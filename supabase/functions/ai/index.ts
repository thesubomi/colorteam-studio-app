// AI for Colorteam Studio, through the Claude API. Everything it returns is a proposal: people review it in the
// app and nothing is saved, sent for approval or posted without a person doing it.
//   kit_from_guidelines  reads the workspace's guidelines PDF and proposes colours, fonts, voice, imagery, rules
//   copy                 writes 3 options for a post's template fields and caption in the brand voice
//   month_plan           turns a monthly brief into a list of posts (date, time, template, text, caption)
// Caller: any member of the workspace (kit pre-fill: owners and staff). Each call is logged in ai_usage and a
// workspace stops at AI_DAILY_LIMIT calls a day (default 100).
// Secrets: ANTHROPIC_API_KEY. Optional: AI_MODEL (default claude-sonnet-5-5), AI_DAILY_LIMIT.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const ROLES = ["ground", "surface", "ink", "accent", "accent 2", "muted"];
const CHANNELS = ["LinkedIn", "Instagram", "Facebook", "X", "TikTok", "YouTube", "Website", "Email"];
const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);

type Tpl = { id: string; name: string; fields: { k: string; label: string; def?: string }[] };

function brandBrief(ws: any) {
  const k = ws.settings?.kit || {};
  const lines = [`Brand: ${ws.name}`];
  if (k.website) lines.push(`Website: ${k.website}`);
  if (k.voice) lines.push(`Voice: ${clip(k.voice, 2000)}`);
  if (k.imagery) lines.push(`Imagery: ${clip(k.imagery, 800)}`);
  if (k.dont) lines.push(`Don'ts: ${clip(k.dont, 800)}`);
  if (k.banned) lines.push(`Never use these words: ${clip(k.banned, 400)}`);
  return lines.join("\n");
}
const tplText = (t: Tpl[]) => t.map((x) => `- ${x.id} (${x.name}): ` + x.fields.map((f) => `${f.k} = ${f.label}${f.def ? ` [sample: "${clip(f.def, 120)}"]` : ""}`).join("; ")).join("\n");
const cleanTpls = (t: unknown): Tpl[] => (Array.isArray(t) ? t : []).slice(0, 40).map((x: any) => ({
  id: clip(x?.id, 40), name: clip(x?.name, 60),
  fields: (Array.isArray(x?.fields) ? x.fields : []).slice(0, 20).map((f: any) => ({ k: clip(f?.k, 40), label: clip(f?.label, 80), def: clip(f?.def, 300) })),
})).filter((x) => x.id && x.fields.length);

const STYLE = `Write like a sharp social media editor. Plain, specific, confident. No hashtag walls (at most 3 relevant hashtags, only in captions, only if they fit the brand). No emoji unless the brand voice asks for them. Never use em dashes. Wrap one or two key words of a headline in *asterisks* to highlight them when the template's sample does. Keep each field close to the length of its sample: templates have fixed space.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "AI isn't switched on yet (ANTHROPIC_API_KEY not set)." }, 503);
  let body: any; try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  const action = String(body?.action || ""), wsId = String(body?.workspace_id || "");
  if (!["kit_from_guidelines", "copy", "month_plan"].includes(action)) return json({ error: "Unknown action" }, 400);
  if (!/^[0-9a-f-]{36}$/.test(wsId)) return json({ error: "workspace_id required" }, 400);

  const url = Deno.env.get("SUPABASE_URL")!;
  const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  const { data: me } = await caller.auth.getUser();
  const email = me?.user?.email?.toLowerCase();
  if (!email) return json({ error: "Sign in first" }, 401);
  const { data: role } = await caller.rpc("member_role", { ws: wsId });
  const { data: staff } = await caller.rpc("is_staff");
  if (!role && !staff) return json({ error: "Not in this workspace" }, 403);
  if (action === "kit_from_guidelines" && role !== "owner" && !staff) return json({ error: "Only owners can fill the brand kit" }, 403);

  const db = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const limit = Number(Deno.env.get("AI_DAILY_LIMIT") || 100);
  const { count } = await db.from("ai_usage").select("id", { count: "exact", head: true }).eq("workspace_id", wsId).gte("at", new Date(Date.now() - 864e5).toISOString());
  if ((count || 0) >= limit) return json({ error: `This workspace has used its ${limit} AI requests for today. Try again tomorrow.` }, 429);
  const { data: ws } = await db.from("workspaces").select("id,name,slug,settings").eq("id", wsId).single();
  if (!ws) return json({ error: "Workspace not found" }, 404);

  const model = Deno.env.get("AI_MODEL") || "claude-sonnet-5-5";
  async function claude(system: string, content: unknown[], tool: { name: string; description: string; input_schema: unknown }, maxTokens = 4000) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, tools: [tool], tool_choice: { type: "tool", name: tool.name }, messages: [{ role: "user", content }] }),
    });
    const out = await r.json().catch(() => ({}));
    const usage = out?.usage || {};
    await db.from("ai_usage").insert({ workspace_id: wsId, email, action, model, input_tokens: usage.input_tokens || 0, output_tokens: usage.output_tokens || 0, ok: r.ok });
    if (!r.ok) throw new Error(out?.error?.message || "The AI service returned " + r.status);
    const use = (out.content || []).find((c: any) => c.type === "tool_use");
    if (!use) throw new Error("The AI didn't return a result. Try again.");
    return use.input;
  }

  try {
    if (action === "kit_from_guidelines") {
      const path = ws.settings?.guidelines;
      if (!path) return json({ error: "Upload the guidelines PDF first" }, 400);
      const { data: file, error } = await db.storage.from("guidelines").download(path);
      if (error || !file) return json({ error: "Couldn't read the guidelines PDF" }, 500);
      if (file.size > 25 * 1024 * 1024) return json({ error: "The PDF is over 25 MB. Upload a lighter export (no embedded video, compressed images)." }, 400);
      const buf = new Uint8Array(await file.arrayBuffer());
      let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
      const out = await claude(
        `You read brand guidelines and extract a brand kit for a design tool. Report only what the document says; leave a field empty when it isn't covered. Never invent colours or fonts. Hex values must appear in the document (convert RGB or CMYK only if the document gives them). Write prose fields as short, practical rules a designer can follow, in English, without em dashes.`,
        [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: btoa(bin) } },
         { type: "text", text: `Extract the brand kit for ${ws.name}. Roles: ground = main background, surface = cards/light background, ink = main text, accent = main highlight, "accent 2" = second highlight, muted = secondary text or lines.` }],
        { name: "propose_kit", description: "The brand kit found in the guidelines", input_schema: { type: "object", required: ["colors", "fonts"], properties: {
          colors: { type: "array", maxItems: 12, items: { type: "object", required: ["name", "hex", "role"], properties: { name: { type: "string" }, hex: { type: "string", description: "#RRGGBB" }, role: { type: "string", enum: ROLES }, note: { type: "string", description: "Where the document says to use it" } } } },
          fonts: { type: "object", properties: { display: { type: "string", description: "Headline typeface family" }, body: { type: "string" }, serif: { type: "string" } } },
          voice: { type: "string", description: "Tone of voice: how the brand speaks, words it uses" },
          imagery: { type: "string", description: "Photography and illustration rules" },
          dont: { type: "string", description: "Rules and misuses to avoid, including logo misuse and clear space" },
          banned: { type: "string", description: "Comma-separated words or phrases the brand never uses" },
          website: { type: "string" },
          pages_read: { type: "integer" } } } }, 3000);
      const hex = (h: string) => { h = String(h || "").trim(); if (/^[0-9a-f]{6}$/i.test(h)) h = "#" + h; return /^#[0-9a-f]{6}$/i.test(h) ? h.toUpperCase() : null; };
      const colors = (out.colors || []).map((c: any) => ({ name: clip(c.name, 40), hex: hex(c.hex), role: ROLES.includes(c.role) ? c.role : "muted", note: clip(c.note, 160) })).filter((c: any) => c.hex);
      return json({ ok: true, kit: { colors, fonts: { display: clip(out.fonts?.display, 60), body: clip(out.fonts?.body, 60), serif: clip(out.fonts?.serif, 60) },
        voice: clip(out.voice, 2000), imagery: clip(out.imagery, 1200), dont: clip(out.dont, 1200), banned: clip(out.banned, 400), website: clip(out.website, 200) } });
    }

    if (action === "copy") {
      const [tpl] = cleanTpls([body.template]);
      if (!tpl) return json({ error: "template required" }, 400);
      const channels = (Array.isArray(body.channels) ? body.channels : []).filter((c: string) => CHANNELS.includes(c));
      const current = body.current?.fields || {};
      const out = await claude(
        `You write social posts for a brand inside its design tool. ${STYLE}\n\n${brandBrief(ws)}`,
        [{ type: "text", text: `Template: ${tpl.name}\nFields:\n${tpl.fields.map((f) => `- ${f.k} (${f.label}). Sample: "${clip(f.def, 200)}". Current: "${clip(current[f.k], 300)}"`).join("\n")}\n` +
          `Channels: ${channels.join(", ") || "not chosen"}\nCurrent caption: "${clip(body.current?.caption, 1500)}"\n` +
          `Brief from the person: ${clip(body.brief, 1500) || "(none: improve what is there, in the brand voice)"}\n\nWrite 3 distinct options. Each fills every field and a caption suited to the channels (X: under 250 characters).` }],
        { name: "suggest_copy", description: "Three options for the post", input_schema: { type: "object", required: ["options"], properties: {
          options: { type: "array", minItems: 1, maxItems: 3, items: { type: "object", required: ["fields", "caption"], properties: {
            angle: { type: "string", description: "A few words naming the approach" },
            fields: { type: "object", properties: Object.fromEntries(tpl.fields.map((f) => [f.k, { type: "string" }])) },
            caption: { type: "string" } } } } } } }, 2500);
      const keys = new Set(tpl.fields.map((f) => f.k));
      const options = (out.options || []).slice(0, 3).map((o: any) => ({ angle: clip(o.angle, 60),
        fields: Object.fromEntries(Object.entries(o.fields || {}).filter(([k]) => keys.has(k)).map(([k, v]) => [k, clip(v, 600)])), caption: clip(o.caption, 3000) }));
      return json({ ok: true, options });
    }

    // month_plan
    const tpls = cleanTpls(body.templates);
    if (!tpls.length) return json({ error: "templates required" }, 400);
    const month = /^\d{4}-\d{2}$/.test(body.month || "") ? body.month : new Date().toISOString().slice(0, 7);
    const n = Math.max(1, Math.min(Number(body.count) || 8, 20));
    const channels = (Array.isArray(body.channels) ? body.channels : []).filter((c: string) => CHANNELS.includes(c));
    const out = await claude(
      `You are the content lead for a brand, planning a month of social posts made from its design templates. ${STYLE}\nSpread posts across the month on sensible days and times for the channels (weekdays for LinkedIn, mornings or lunchtimes). Vary the templates. Each post must use one template id from the list and fill its fields.\n\n${brandBrief(ws)}`,
      [{ type: "text", text: `Month: ${month}\nNumber of posts: ${n}\nChannels: ${channels.join(", ") || "choose sensible ones from: " + CHANNELS.join(", ")}\nTemplates:\n${tplText(tpls)}\n\nBrief:\n${clip(body.brief, 4000)}` }],
      { name: "plan_month", description: "The month's posts", input_schema: { type: "object", required: ["posts"], properties: {
        summary: { type: "string", description: "One or two sentences on the plan" },
        posts: { type: "array", maxItems: 20, items: { type: "object", required: ["date", "template", "title", "fields", "caption"], properties: {
          date: { type: "string", description: "YYYY-MM-DD within the month" }, time: { type: "string", description: "HH:MM 24-hour" },
          template: { type: "string", enum: tpls.map((t) => t.id) }, title: { type: "string", description: "Short internal name for the post" },
          fields: { type: "object", additionalProperties: { type: "string" } }, caption: { type: "string" },
          channels: { type: "array", items: { type: "string", enum: CHANNELS } }, why: { type: "string", description: "One line: what this post does for the brief" } } } } } } }, 8000);
    const posts = (out.posts || []).slice(0, n).map((p: any) => {
      const t = tpls.find((x) => x.id === p.template); if (!t) return null;
      const keys = new Set(t.fields.map((f) => f.k));
      const date = /^\d{4}-\d{2}-\d{2}$/.test(p.date || "") && String(p.date).startsWith(month) ? p.date : null;
      return { date, time: /^([01]\d|2[0-3]):[0-5]\d$/.test(p.time || "") ? p.time : "09:00", template: t.id, title: clip(p.title, 120),
        fields: Object.fromEntries(Object.entries(p.fields || {}).filter(([k]) => keys.has(k)).map(([k, v]) => [k, clip(v, 600)])),
        caption: clip(p.caption, 3000), channels: (p.channels || []).filter((c: string) => CHANNELS.includes(c)), why: clip(p.why, 200) };
    }).filter(Boolean);
    return json({ ok: true, summary: clip(out.summary, 500), posts });
  } catch (e) {
    return json({ error: (e as Error).message }, 502);
  }
});
