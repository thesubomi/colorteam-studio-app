// Approval emails. The app calls this right after a file is sent for approval, approved or sent back.
// It re-reads the file (so it can't be used to send arbitrary mail), checks the caller belongs to the
// workspace, and emails: approvers when a file is waiting; the maker when it's approved or needs changes.
// Secrets: SMTP_USER, SMTP_PASS (Google Workspace app password). Optional: SMTP_HOST, SMTP_FROM_NAME, APP_URL.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

function page(heading: string, lead: string, quote: string, button: string, link: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4F4F2;font-family:Inter,-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#161616">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F2;padding:40px 16px"><tr><td align="center">
<table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:20px;padding:36px">
<tr><td style="font-weight:800;font-size:22px;letter-spacing:-0.04em">colorteam <span style="font-weight:500;color:#57554D;letter-spacing:0">Studio</span></td></tr>
<tr><td style="padding-top:28px;font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.25">${heading}</td></tr>
<tr><td style="padding-top:12px;font-size:15px;line-height:1.55;color:#57554D">${lead}</td></tr>
${quote ? `<tr><td style="padding-top:14px"><div style="border-left:3px solid #F2B0CD;padding:6px 0 6px 12px;font-size:14px;line-height:1.5;color:#161616">${quote}</div></td></tr>` : ""}
<tr><td style="padding-top:26px"><a href="${link}" style="display:inline-block;background:#161616;color:#FFFFFF;text-decoration:none;font-weight:600;font-size:15px;padding:13px 22px;border-radius:12px">${button}</a></td></tr>
<tr><td style="padding-top:22px;font-size:13px;line-height:1.5;color:#8B8A82">You get this because you're on this workspace in Colorteam Studio.</td></tr>
</table><p style="font-size:12px;color:#8B8A82;margin:18px 0 0">Colorteam · Warsaw · <a href="https://colorteam.io" style="color:#8B8A82">colorteam.io</a></p>
</td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const user = Deno.env.get("SMTP_USER"), pass = Deno.env.get("SMTP_PASS");
  if (!user || !pass) return json({ skipped: "SMTP not configured" });

  const url = Deno.env.get("SUPABASE_URL")!;
  let body: { file_id?: string; event?: string; actor?: string };
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  // Server-to-server calls (the mcp function, on behalf of a key's owner) carry the service key.
  const internal = (req.headers.get("Authorization") ?? "") === "Bearer " + Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
  let actor = "";
  if (internal) actor = String(body.actor ?? "").toLowerCase();
  else { const { data: me } = await caller.auth.getUser(); actor = me?.user?.email?.toLowerCase() ?? ""; }
  if (!actor) return json({ error: "Sign in first" }, 401);
  const want = { sent: "pending", approved: "approved", changes: "changes" }[body.event ?? ""];
  if (!body.file_id || !want) return json({ error: "file_id and event (sent, approved, changes) are required" }, 400);

  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  // The app saves a moment before calling; give it a few tries to land.
  let file: any = null;
  for (let i = 0; i < 4; i++) {
    const { data } = await admin.from("requests").select("id,email,status,comment,data,workspace_id").eq("id", body.file_id).maybeSingle();
    file = data;
    if (file && file.status === want) break;
    await new Promise((r) => setTimeout(r, 900));
  }
  if (!file) return json({ error: "File not found" }, 404);
  if (file.status !== want) return json({ skipped: "status is " + file.status });

  // Caller must belong to the file's workspace (or be staff).
  if (!internal) {
    const { data: role } = await caller.rpc("member_role", { ws: file.workspace_id });
    const { data: staff } = await caller.rpc("is_staff");
    if (!role && !staff) return json({ error: "Not in this workspace" }, 403);
  }

  const { data: ws } = await admin.from("workspaces").select("name").eq("id", file.workspace_id).single();
  const { data: members } = await admin.from("memberships").select("email,name,role").eq("workspace_id", file.workspace_id);
  const actorName = ((members ?? []).find((m) => m.email === actor)?.name || actor.split("@")[0]) + (internal ? " (via an AI agent)" : "");
  const title = file.data?.title || "Untitled post";
  const app = (Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/") + "#/file/" + file.id;
  const wsName = ws?.name || "your workspace";

  let to: string[] = [], subject = "", html = "";
  if (want === "pending") {
    to = (members ?? []).filter((m) => (m.role === "owner" || m.role === "approver") && m.email !== actor).map((m) => m.email);
    subject = `Approval needed: ${title}`;
    html = page("A post is waiting for your approval",
      `${esc(actorName)} sent <b style="color:#161616">${esc(title)}</b> in ${esc(wsName)} for approval.`,
      file.data?.note ? esc(file.data.note) : "", "Review the post", app);
  } else {
    if (file.email && file.email.toLowerCase() !== actor) to = [file.email.toLowerCase()];
    const ok = want === "approved";
    subject = ok ? `Approved: ${title}` : `Changes requested: ${title}`;
    html = page(ok ? "Your post is approved" : "Your post needs a few changes",
      `${esc(actorName)} ${ok ? "approved" : "asked for changes to"} <b style="color:#161616">${esc(title)}</b> in ${esc(wsName)}.${ok ? " It's ready to export and post." : ""}`,
      file.comment ? esc(file.comment) : "", ok ? "Open the post" : "See the feedback", app);
  }
  to = [...new Set(to)];
  if (!to.length) return json({ ok: true, sent: 0 });
  // Plain-ASCII subject: long subjects with dashes or curly quotes get mangled by the mailer's encoding.
  subject = subject.replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[^\x20-\x7E]/g, "");
  if (subject.length > 70) subject = subject.slice(0, 67).trimEnd() + "...";

  const client = new SMTPClient({
    connection: { hostname: Deno.env.get("SMTP_HOST") || "smtp.gmail.com", port: 465, tls: true, auth: { username: user, password: pass } },
  });
  try {
    for (const addr of to) {
      await client.send({ from: `${Deno.env.get("SMTP_FROM_NAME") || "Colorteam Studio"} <${user}>`, to: addr, subject, html, content: "auto" });
    }
  } catch (e) {
    return json({ error: "Email failed: " + (e as Error).message }, 502);
  } finally {
    try { await client.close(); } catch { /* already closed */ }
  }
  return json({ ok: true, sent: to.length });
});
