// Opens a client's own Stripe customer portal in one click (no email login step).
// Caller must be an owner of the workspace or Colorteam staff. The Stripe customer comes from
// workspaces.settings.billing.customer, written by stripe-webhook when they paid.
// Secrets: STRIPE_SECRET_KEY (a restricted key with "Customer portal: Write" is enough).
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
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return json({ error: "Billing portal is not set up yet (STRIPE_SECRET_KEY missing)" }, 500);

  const url = Deno.env.get("SUPABASE_URL")!;
  const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });
  const { data: me } = await caller.auth.getUser();
  if (!me?.user?.email) return json({ error: "Sign in first" }, 401);

  let body: { workspace_id?: string; return_url?: string };
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  if (!body.workspace_id) return json({ error: "workspace_id is required" }, 400);

  const { data: staff } = await caller.rpc("is_staff");
  const { data: role } = await caller.rpc("member_role", { ws: body.workspace_id });
  if (!staff && role !== "owner") return json({ error: "Only the workspace owner can manage billing" }, 403);

  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: ws } = await admin.from("workspaces").select("settings").eq("id", body.workspace_id).single();
  const customer = (ws?.settings as any)?.billing?.customer;
  if (!customer) return json({ error: "No Stripe customer on this workspace" }, 404);

  // Only send people back to our own app.
  const fallback = Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/";
  const ret = /^https:\/\/(app|app-staging)\.colorteam\.io\//.test(body.return_url ?? "") ? body.return_url! : fallback + "#/billing";

  const r = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ customer, return_url: ret }),
  });
  const s = await r.json();
  if (!r.ok) return json({ error: s?.error?.message || "Stripe error" }, 502);
  return json({ url: s.url });
});
