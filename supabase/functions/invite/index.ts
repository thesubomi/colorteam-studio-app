// Invite a person to a workspace: adds the membership and sends Supabase's invite email
// (which carries a sign-in link). Caller must be a workspace owner or Colorteam staff.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const auth = req.headers.get("Authorization") ?? "";

  // Who is calling, as seen through RLS.
  const caller = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: me, error: meErr } = await caller.auth.getUser();
  if (meErr || !me?.user?.email) return json({ error: "Sign in first" }, 401);
  const callerEmail = me.user.email.toLowerCase();

  let body: { workspace_id?: string; email?: string; name?: string; role?: string; redirect?: string };
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  const email = String(body.email ?? "").trim().toLowerCase();
  const role = ["owner", "approver", "editor"].includes(body.role ?? "") ? body.role! : "editor";
  if (!body.workspace_id || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Workspace and a valid email are required" }, 400);

  const { data: allowed } = await caller.rpc("is_staff");
  const { data: myRole } = await caller.rpc("member_role", { ws: body.workspace_id });
  if (!allowed && myRole !== "owner") return json({ error: "Only owners or Colorteam can invite" }, 403);

  const admin = createClient(url, service);
  const { data: ws } = await admin.from("workspaces").select("name").eq("id", body.workspace_id).single();
  const { error: mErr } = await admin.from("memberships").upsert({ workspace_id: body.workspace_id, email, name: body.name || null, role });
  if (mErr) return json({ error: mErr.message }, 400);

  // Existing accounts get a sign-in link, new ones an invite. Both land on the app.
  const redirectTo = body.redirect || "https://app-staging.colorteam.io/";
  const { data: existing } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const known = existing?.users?.some((u) => (u.email ?? "").toLowerCase() === email);
  const sent = known
    ? await admin.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo, shouldCreateUser: false } })
    : await admin.auth.admin.inviteUserByEmail(email, { redirectTo, data: { invited_to: ws?.name ?? "", invited_by: callerEmail, full_name: body.name ?? "" } });
  if (sent.error) return json({ ok: true, membership: true, email_sent: false, warning: sent.error.message });
  return json({ ok: true, membership: true, email_sent: true, workspace: ws?.name });
});
