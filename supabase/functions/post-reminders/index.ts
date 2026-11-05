// Scheduled-post reminders. pg_cron calls this every 5 minutes (see 0012_post_reminders.sql).
// It asks the database what is due, claims each reminder (so two runs never send the same one),
// emails the right people and, if an email fails, releases the claim so the next run retries.
// No caller key needed: it only ever sends reminders that are due, once each.
// Secrets: SMTP_USER, SMTP_PASS. Optional: SMTP_HOST, SMTP_FROM_NAME, APP_URL.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
const esc = (s: string) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const ascii = (s: string) => {
  s = s.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7E]/g, "");
  return s.length > 70 ? s.slice(0, 67).trimEnd() + "..." : s;
};

function page(heading: string, lead: string, quote: string, button: string, link: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4F4F2;font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#161616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F2;padding:40px 16px"><tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:20px;padding:36px">
<tr><td style="font-weight:800;font-size:22px;letter-spacing:-0.04em">colorteam <span style="font-weight:500;color:#57554D;letter-spacing:0">Studio</span></td></tr>
<tr><td style="padding-top:28px;font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.25">${heading}</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.55;color:#57554D">${lead}</td></tr>
${quote ? `<tr><td style="padding-top:14px"><div style="border-left:3px solid #F2B0CD;padding:6px 0 6px 12px;font-size:14px;line-height:1.5;color:#161616;white-space:pre-wrap;word-break:break-word">${quote}</div></td></tr>` : ""}
<tr><td style="padding-top:26px"><a href="${link}" style="display:inline-block;background:#161616;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px;padding:13px 22px;border-radius:12px">${button}</a></td></tr>
<tr><td style="padding-top:22px;font-size:13px;line-height:1.5;color:#8B8A82">You get this because you're on this workspace in Colorteam Studio.</td></tr>
</table><p style="font-size:12px;color:#8B8A82;margin:18px 0 0">Colorteam · Warsaw · <a href="https://colorteam.io" style="color:#8B8A82">colorteam.io</a></p>
</td></tr></table></body></html>`;
}

// Same tagging as ctTagLink in the app (config.js).
const SRC: Record<string, string> = { LinkedIn: "linkedin", Instagram: "instagram", Facebook: "facebook", X: "x", TikTok: "tiktok", YouTube: "youtube", Website: "website", Email: "newsletter" };
const slug = (s: string) => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
function tag(link: string, channel: string, kit: any, campaign: string, content: string) {
  link = String(link || "").trim(); if (!link) return "";
  if (!/^https?:\/\//i.test(link)) link = "https://" + link;
  let u: URL; try { u = new URL(link); } catch { return link; }
  const p = kit?.utm || {};
  if (p.off || u.searchParams.has("utm_source")) return u.toString();
  u.searchParams.set("utm_source", (p.sources || {})[channel] || SRC[channel] || slug(channel));
  u.searchParams.set("utm_medium", channel === "Email" ? "email" : (p.medium || "social"));
  const c = slug(campaign || p.campaign || ""); if (c) u.searchParams.set("utm_campaign", c);
  const ct = slug(content); if (ct) u.searchParams.set("utm_content", ct);
  return u.toString();
}
const when = (d: Date, tz: string) => {
  try { return d.toLocaleString("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + " (" + tz.replace(/_/g, " ") + ")"; }
  catch { return d.toISOString().slice(0, 16).replace("T", " ") + " UTC"; }
};

Deno.serve(async (req) => {
  if (req.method !== "POST" && req.method !== "GET") return json({ error: "POST" }, 405);
  const user = Deno.env.get("SMTP_USER"), pass = Deno.env.get("SMTP_PASS");
  if (!user || !pass) return json({ skipped: "SMTP not configured" });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: due, error } = await db.rpc("due_post_reminders");
  if (error) return json({ error: error.message }, 500);
  if (!due?.length) return json({ ok: true, due: 0 });

  const ids = [...new Set(due.map((d: any) => d.request_id))];
  const { data: posts } = await db.from("requests").select("id,email,status,data,workspace_id").in("id", ids);
  const wsIds = [...new Set((posts || []).map((p) => p.workspace_id))];
  const { data: wss } = await db.from("workspaces").select("id,name,settings").in("id", wsIds);
  const { data: mems } = await db.from("memberships").select("workspace_id,email,role").in("workspace_id", wsIds);
  const appBase = Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/";

  const client = new SMTPClient({ connection: { hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com", port: 465, tls: true, auth: { username: user, password: pass } } });
  const from = `${Deno.env.get("SMTP_FROM_NAME") || "Colorteam Studio"} <${user}>`;
  const out: any[] = [];
  try {
    for (const d of due as any[]) {
      const p = (posts || []).find((x) => x.id === d.request_id); if (!p) continue;
      const ws = (wss || []).find((x) => x.id === p.workspace_id);
      const team = (mems || []).filter((m) => m.workspace_id === p.workspace_id);
      const owners = team.filter((m) => m.role === "owner").map((m) => m.email);
      const approvers = team.filter((m) => m.role === "owner" || m.role === "approver").map((m) => m.email);
      const maker = p.email ? [String(p.email).toLowerCase()] : [];
      const title = p.data?.title || "Untitled post";
      const tz = p.data?.tz || "Europe/Warsaw";
      const at = when(new Date(d.due_at), tz);
      const link = appBase + "#/file/" + p.id;
      const wsName = esc(ws?.name || "your workspace");
      const channels: string[] = Array.isArray(p.data?.channels) ? p.data.channels : [];
      let to: string[] = [], subject = "", html = "";
      if (d.kind === "needs_approval") {
        to = approvers;
        subject = `Due tomorrow, needs approval: ${title}`;
        html = page("A post is due soon and still needs approval",
          `<b style="color:#161616">${esc(title)}</b> in ${wsName} is scheduled for ${esc(at)}. It can't go out until someone approves it.`,
          "", "Review the post", link);
      } else if (d.kind === "missed") {
        to = [...maker, ...owners];
        subject = `Not posted, wasn't approved: ${title}`;
        html = page("This post missed its time",
          `<b style="color:#161616">${esc(title)}</b> in ${wsName} was scheduled for ${esc(at)} but wasn't approved, so it hasn't gone out. Get it approved and pick a new date.`,
          "", "Open the post", link);
      } else {
        to = [...maker, ...owners];
        subject = `Time to post: ${title}`;
        const caption = String(p.data?.caption || "").trim();
        const kit = ws?.settings?.kit || null;
        const lines = (channels.length ? channels : [""]).map((c) => {
          const l = p.data?.link ? tag(p.data.link, c || "LinkedIn", kit, p.data?.campaign || "", title) : "";
          return (c ? `<b>${esc(c)}</b>${l ? `: ${esc(l)}` : ""}` : (l ? esc(l) : ""));
        }).filter(Boolean);
        const quote = [caption ? esc(caption) : "", lines.join("<br>")].filter(Boolean).join("<br><br>");
        html = page("It's time to post",
          `<b style="color:#161616">${esc(title)}</b> in ${wsName} is approved and scheduled for ${esc(at)}${channels.length ? " on " + esc(channels.join(", ")) : ""}. Download it from the Studio, post it, then mark it as posted.`,
          quote, "Open and download", link);
      }
      to = [...new Set(to.map((e) => e.toLowerCase()))];
      // Claim first so a parallel run can't send the same reminder.
      const { data: claim } = await db.from("post_reminders").upsert({ request_id: p.id, kind: d.kind, due_at: d.due_at, sent_to: to.length }, { onConflict: "request_id,kind,due_at", ignoreDuplicates: true }).select("request_id");
      if (!claim?.length) continue;
      try {
        for (const addr of to) await client.send({ from, to: addr, subject: ascii(subject), html, content: "auto" });
        out.push({ id: p.id, kind: d.kind, sent: to.length });
      } catch (e) {
        await db.from("post_reminders").delete().eq("request_id", p.id).eq("kind", d.kind).eq("due_at", d.due_at);
        out.push({ id: p.id, kind: d.kind, error: (e as Error).message });
      }
    }
  } finally {
    try { await client.close(); } catch { /* closed */ }
  }
  return json({ ok: true, due: due.length, results: out });
});
