// Colorteam Studio MCP server (Streamable HTTP, JSON responses). One key = one workspace.
// Agents can read the brand kit and templates, make and edit draft posts, set publish dates and
// send posts for approval. They can't approve, publish or touch other workspaces.
// Auth: "Authorization: Bearer cts_..." (or ?key=cts_... for clients that only take a URL).
// Build: scripts/build-mcp.cjs inlines templates.json into index.ts for the dashboard editor.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

declare const MANIFEST: { templates: any[]; sizes: Record<string, { label: string; W: number; H: number }> };

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, mcp-session-id, mcp-protocol-version, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const send = (b: unknown, s = 200) => new Response(b === null ? null : JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const APP = () => Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/";
const link = (id: string) => APP() + "#/file/" + id;

async function sha256(s: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
const autoTitle = (name: string, f: Record<string, unknown>) => {
  const v = Object.values(f).find((x) => typeof x === "string" && (x as string).trim()) as string || "";
  return name + " — " + v.replace(/\*/g, "").split("\n")[0].slice(0, 40);
};

const CHANNELS = ["LinkedIn", "Instagram", "Facebook", "X", "TikTok", "YouTube", "Website", "Email"];
const TOOLS = [
  { name: "get_workspace", description: "The workspace this key belongs to: name, plan, brand kit (colours with roles, fonts, voice, things to avoid, banned words, website) and the styles posts can use. Read this before writing copy.",
    inputSchema: { type: "object", properties: {} } },
  { name: "list_templates", description: "Templates this workspace can make posts from, with their sizes and the text fields each one takes. Wrap words in *asterisks* in a field to highlight them.",
    inputSchema: { type: "object", properties: {} } },
  { name: "list_posts", description: "Recent posts in the workspace with status (draft, pending = waiting for approval, approved, changes = changes requested), publish date and a link.",
    inputSchema: { type: "object", properties: { status: { type: "string", enum: ["draft", "pending", "approved", "changes"] }, limit: { type: "integer", minimum: 1, maximum: 50 } } } },
  { name: "create_post", description: "Make a new draft post from a template. Unspecified fields keep the template's sample text. Returns the post id and a link to open it in Colorteam Studio.",
    inputSchema: { type: "object", required: ["template"], properties: {
      template: { type: "string", description: "Template id from list_templates" },
      fields: { type: "object", additionalProperties: { type: "string" }, description: "Field key to text" },
      sizes: { type: "array", items: { type: "string" }, description: "Sizes to include, e.g. post, square, story, wide. Defaults to the template's designed sizes." },
      style: { type: ["string", "integer"], description: "Style name or index from get_workspace (e.g. Brand, Light, Accent)" },
      publish_date: { type: "string", description: "YYYY-MM-DD, shows the post on the Studio calendar" },
      publish_time: { type: "string", description: "HH:MM, 24-hour, in the workspace's time zone (default 09:00)" },
      time_zone: { type: "string", description: "IANA time zone, e.g. Europe/Warsaw (default Europe/Warsaw)" },
      channels: { type: "array", items: { type: "string", enum: CHANNELS }, description: "Where it will be posted" },
      caption: { type: "string", description: "Text that goes with the post. Write it in the brand voice from get_workspace." },
      link: { type: "string", description: "Optional link; the Studio adds UTM tags per channel" },
      campaign: { type: "string", description: "Optional UTM campaign name" },
      title: { type: "string" } } } },
  { name: "update_post", description: "Change the text, sizes, style, publish date and time, channels, caption or link of a draft (or a post with changes requested).",
    inputSchema: { type: "object", required: ["post_id"], properties: {
      post_id: { type: "string" }, fields: { type: "object", additionalProperties: { type: "string" } },
      sizes: { type: "array", items: { type: "string" } }, style: { type: ["string", "integer"] }, publish_date: { type: ["string", "null"] },
      publish_time: { type: "string", description: "HH:MM, 24-hour, in the workspace's time zone (default 09:00)" },
      time_zone: { type: "string", description: "IANA time zone, e.g. Europe/Warsaw (default Europe/Warsaw)" },
      channels: { type: "array", items: { type: "string", enum: CHANNELS }, description: "Where it will be posted" },
      caption: { type: "string", description: "Text that goes with the post. Write it in the brand voice from get_workspace." },
      link: { type: "string", description: "Optional link; the Studio adds UTM tags per channel" },
      campaign: { type: "string", description: "Optional UTM campaign name" },
      title: { type: "string" } } } },
  { name: "request_approval", description: "Send a draft to the workspace's approvers. They get an email and approve or ask for changes in Colorteam Studio. Agents can't approve.",
    inputSchema: { type: "object", required: ["post_id"], properties: { post_id: { type: "string" }, note: { type: "string", description: "Note for the approver" } } } },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method === "GET") return send({ error: "This MCP server answers POST requests (no event stream)." }, 405);
  if (req.method !== "POST") return send({ error: "POST only" }, 405);

  const url = new URL(req.url);
  const key = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "") || url.searchParams.get("key") || "";
  const unauth = (m: string) => send({ jsonrpc: "2.0", id: null, error: { code: -32001, message: m } }, 401);
  if (!key.startsWith("cts_")) return unauth("Missing Colorteam Studio key (Authorization: Bearer cts_...)");

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: k } = await db.from("api_keys").select("*").eq("key_hash", await sha256(key)).maybeSingle();
  if (!k || k.revoked_at) return unauth("This key is not valid or was revoked");
  const { data: access } = await db.rpc("has_agent_access", { ws: k.workspace_id });
  if (!access) return unauth("Agent access is part of the Max plan");
  if (!k.last_used_at || Date.now() - new Date(k.last_used_at).getTime() > 5 * 60000) {
    await db.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", k.id);
  }
  const { data: ws } = await db.from("workspaces").select("id,slug,name,plan,settings").eq("id", k.workspace_id).single();
  const kit = ws?.settings?.kit || null;
  const client = ws?.slug !== "colorteam";
  const brand = String(ws?.name || "").replace(/\s*\(demo[^)]*\)\s*$/i, "");
  const web = String(kit?.website || "").replace(/^https?:\/\//, "").replace(/\/$/, "") || brand;
  const styles: string[] = client && kit ? ["Brand", "Light", "Accent", ...((kit.colors || []).some((c: any) => c.role === "accent 2") ? ["Accent 2"] : [])] : ["Night", "Stone", "Pink", "Podcast"];
  const { data: member } = await db.from("memberships").select("name").eq("workspace_id", k.workspace_id).eq("email", k.created_by).maybeSingle();
  const author = member?.name || k.created_by.split("@")[0];

  async function templates() {
    const fill = (v: string) => String(v).replace(/\{brand\}/g, brand).replace(/\{web\}/g, web);
    const builtIn = MANIFEST.templates.filter((t) => !(client && t.internal)).map((t) => ({
      id: t.id, name: t.name, photo: t.photo, defTheme: t.defTheme, sizes: t.sizes, designedSizes: t.designedSizes,
      fields: t.fields.map((f: any) => ({ key: f.k, label: f.label, multiline: !!f.multiline,
        example: client && t.clientDefaults && f.k in t.clientDefaults ? fill(t.clientDefaults[f.k]) : f.def })) }));
    const { data: rows } = await db.from("templates").select("key,name,spec,workspace_id").eq("published", true).or(`workspace_id.is.null,workspace_id.eq.${k.workspace_id}`);
    const custom = (rows || []).filter((r) => r.spec?.fields && r.spec?.sizes).map((r) => ({
      id: r.key, name: r.name, photo: !!r.spec.photo, defTheme: r.spec.defTheme || 0, sizes: r.spec.sizes, designedSizes: r.spec.sizes,
      fields: r.spec.fields.filter((f: any) => f.type !== "image").map((f: any) => ({ key: f.k, label: f.label, multiline: f.type === "area", example: f.def ?? "" })) }));
    const byId = new Map<string, any>();
    for (const t of [...builtIn, ...custom]) byId.set(t.id, t);
    return [...byId.values()];
  }
  const styleIndex = (s: unknown, fallback: number) => {
    if (s === undefined || s === null || s === "") return fallback;
    if (typeof s === "number" || /^\d+$/.test(String(s))) { const n = Number(s); if (n >= 0 && n < styles.length) return n; throw new Error("Unknown style " + s + ". Styles: " + styles.join(", ")); }
    const i = styles.findIndex((x) => x.toLowerCase() === String(s).toLowerCase());
    if (i < 0) throw new Error("Unknown style " + s + ". Styles: " + styles.join(", "));
    return i;
  };
  const checkDate = (d: unknown) => { if (d === null || d === undefined || d === "") return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(String(d))) throw new Error("publish_date must be YYYY-MM-DD"); return String(d); };
  const checkTime = (t: unknown) => { if (!t) return undefined; if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(t))) throw new Error("publish_time must be HH:MM (24-hour)"); return String(t); };
  const checkTz = (z: unknown) => { if (!z) return undefined; try { new Intl.DateTimeFormat("en", { timeZone: String(z) }); return String(z); } catch { throw new Error("Unknown time_zone " + z); } };
  const checkChannels = (c: unknown) => { if (c === undefined) return undefined; if (!Array.isArray(c)) throw new Error("channels must be a list"); const bad = c.filter((x) => !CHANNELS.includes(String(x))); if (bad.length) throw new Error("Unknown channel(s): " + bad.join(", ") + ". Channels: " + CHANNELS.join(", ")); return [...new Set(c.map(String))]; };
  const publishing = (a: any, d: Record<string, unknown>) => {
    const t = checkTime(a.publish_time); if (t) d.time = t;
    const z = checkTz(a.time_zone); if (z) d.tz = z; else if (!d.tz && (t || d.schedule)) d.tz = "Europe/Warsaw";
    const c = checkChannels(a.channels); if (c) d.channels = c;
    if (typeof a.caption === "string") d.caption = a.caption.slice(0, 5000);
    if (typeof a.link === "string") d.link = a.link.trim().slice(0, 500);
    if (typeof a.campaign === "string") d.campaign = a.campaign.trim().slice(0, 80);
    return d;
  };
  const cleanFields = (tpl: any, given: Record<string, unknown> = {}) => {
    const keys = new Set(tpl.fields.map((f: any) => f.key));
    const unknown = Object.keys(given).filter((x) => !keys.has(x));
    if (unknown.length) throw new Error(`Unknown field(s) for ${tpl.id}: ${unknown.join(", ")}. Fields: ${[...keys].join(", ")}`);
    const out: Record<string, string> = {};
    for (const f of tpl.fields) out[f.key] = String(given[f.key] ?? f.example ?? "").slice(0, 2000);
    return out;
  };
  const checkSizes = (tpl: any, s?: string[]) => {
    if (!s || !s.length) return tpl.designedSizes.slice();
    const bad = s.filter((x) => !tpl.sizes.includes(x));
    if (bad.length) throw new Error(`Size(s) not available for ${tpl.id}: ${bad.join(", ")}. Available: ${tpl.sizes.join(", ")}`);
    return tpl.sizes.filter((x: string) => s.includes(x));
  };
  const getPost = async (id: string) => {
    if (!/^[0-9a-f-]{36}$/.test(id || "")) throw new Error("post_id looks wrong");
    const { data } = await db.from("requests").select("*").eq("id", id).eq("workspace_id", k.workspace_id).maybeSingle();
    if (!data) throw new Error("No post with that id in this workspace");
    return data;
  };
  const summary = (r: any) => ({ id: r.id, title: r.data?.title, template: r.data?.tplId, status: r.status, publish_date: r.data?.schedule || null, publish_time: r.data?.schedule ? (r.data?.time || "09:00") : null, time_zone: r.data?.tz || null, channels: r.data?.channels || [], caption: r.data?.caption || "", link_url: r.data?.link || null,
    sizes: r.data?.sizes, updated_at: r.data?.updatedAt || r.at, link: link(r.id), feedback: r.status === "changes" ? r.comment || "" : undefined });

  async function call(name: string, a: any): Promise<unknown> {
    switch (name) {
      case "get_workspace":
        return { name: ws?.name, plan: ws?.plan, app: APP(), styles,
          brand_kit: kit ? { colours: kit.colors, fonts: kit.fonts, website: kit.website || null, voice: kit.voice || null, imagery: kit.imagery || null,
            avoid: kit.dont || null, banned_words: kit.banned || null } : null,
          notes: "Posts you make are drafts filed under " + author + ". A person approves them in Colorteam Studio." };
      case "list_templates": return { templates: await templates(), sizes: MANIFEST.sizes };
      case "list_posts": {
        let q = db.from("requests").select("id,status,comment,data,at").eq("workspace_id", k.workspace_id).order("at", { ascending: false }).limit(Math.min(Number(a?.limit) || 20, 50));
        if (a?.status) q = q.eq("status", a.status);
        const { data } = await q; return { posts: (data || []).map(summary) };
      }
      case "create_post": {
        const tpl = (await templates()).find((t) => t.id === a?.template);
        if (!tpl) throw new Error("Unknown template. Call list_templates for ids.");
        const fields = cleanFields(tpl, a.fields || {});
        const now = new Date().toISOString();
        const data = { tplId: tpl.id, title: String(a.title || autoTitle(tpl.name, fields)).slice(0, 120), fields, photo: null,
          sizes: checkSizes(tpl, a.sizes), theme: styleIndex(a.style, tpl.defTheme || 0), offsets: {}, schedule: checkDate(a.publish_date), versions: [],
          ownerName: author, updatedBy: author + " (agent)", updatedAt: now, madeBy: "agent: " + k.name };
        publishing(a, data as Record<string, unknown>);
        const row: Record<string, unknown> = { email: k.created_by, data, status: "draft", comment: "", workspace_id: k.workspace_id };
        if (k.created_uid) row.uid = k.created_uid;
        const { data: ins, error } = await db.from("requests").insert(row).select("*").single();
        if (error) throw new Error(error.message);
        return { ...summary(ins), message: "Draft created. Open the link to check it, or call request_approval." };
      }
      case "update_post": {
        const r = await getPost(a.post_id);
        if (!["draft", "changes"].includes(r.status)) throw new Error("Only drafts and posts with changes requested can be edited (this one is " + r.status + ")");
        const tpl = (await templates()).find((t) => t.id === r.data?.tplId);
        if (!tpl) throw new Error("This post's template is no longer available");
        const d = { ...r.data };
        if (a.fields) { const wasAuto = d.title === autoTitle(tpl.name, d.fields || {}); d.fields = cleanFields(tpl, { ...(d.fields || {}), ...a.fields }); if (wasAuto && !a.title) d.title = autoTitle(tpl.name, d.fields); }
        if (a.sizes) d.sizes = checkSizes(tpl, a.sizes);
        if (a.style !== undefined) d.theme = styleIndex(a.style, d.theme || 0);
        if ("publish_date" in (a || {})) d.schedule = checkDate(a.publish_date);
        if (a.title) d.title = String(a.title).slice(0, 120);
        publishing(a, d);
        d.updatedAt = new Date().toISOString(); d.updatedBy = author + " (agent)";
        const { data: up, error } = await db.from("requests").update({ data: d }).eq("id", r.id).select("*").single();
        if (error) throw new Error(error.message);
        return summary(up);
      }
      case "request_approval": {
        const r = await getPost(a.post_id);
        if (!["draft", "changes"].includes(r.status)) throw new Error("This post is " + r.status + "; only drafts can be sent for approval");
        const d = { ...r.data, note: String(a.note || "").slice(0, 500), updatedAt: new Date().toISOString(), updatedBy: author + " (agent)" };
        const { data: up, error } = await db.from("requests").update({ status: "pending", comment: "", data: d }).eq("id", r.id).select("*").single();
        if (error) throw new Error(error.message);
        // Email the approvers through the notify function, as the key's owner.
        const nf = await fetch(Deno.env.get("SUPABASE_URL") + "/functions/v1/notify", { method: "POST",
          headers: { Authorization: "Bearer " + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"), "Content-Type": "application/json" },
          body: JSON.stringify({ file_id: r.id, event: "sent", actor: k.created_by }) }).then((x) => x.json()).catch(() => ({}));
        return { ...summary(up), approvers_emailed: nf?.sent ?? 0 };
      }
    }
    throw new Error("Unknown tool " + name);
  }

  async function handle(m: any) {
    const id = m?.id ?? null;
    if (m?.jsonrpc !== "2.0" || typeof m?.method !== "string") return { jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid request" } };
    if (id === null || id === undefined) return null; // notification
    try {
      switch (m.method) {
        case "initialize": return { jsonrpc: "2.0", id, result: { protocolVersion: m.params?.protocolVersion || "2025-06-18",
          capabilities: { tools: { listChanged: false } }, serverInfo: { name: "colorteam-studio", version: "1.0.0" },
          instructions: `Colorteam Studio for ${ws?.name}. Read get_workspace first (brand kit, voice, banned words), pick a template from list_templates, then create_post. Posts are drafts until a person approves them.` } };
        case "ping": return { jsonrpc: "2.0", id, result: {} };
        case "tools/list": return { jsonrpc: "2.0", id, result: { tools: TOOLS } };
        case "tools/call": {
          try {
            const out = await call(m.params?.name, m.params?.arguments || {});
            return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(out, null, 1) }], structuredContent: out } };
          } catch (e) {
            return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: (e as Error).message }], isError: true } };
          }
        }
        default: return { jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found: " + m.method } };
      }
    } catch (e) {
      return { jsonrpc: "2.0", id, error: { code: -32603, message: (e as Error).message } };
    }
  }

  let body: any;
  try { body = await req.json(); } catch { return send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400); }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map(handle))).filter(Boolean);
    return out.length ? send(out) : new Response(null, { status: 202, headers: cors });
  }
  const out = await handle(body);
  return out ? send(out) : new Response(null, { status: 202, headers: cors });
});
