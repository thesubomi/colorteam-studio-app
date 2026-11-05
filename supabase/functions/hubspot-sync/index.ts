// Studio → HubSpot. Upserts each workspace owner as a HubSpot contact (by email) with their plan, subscription
// status, Brand Foundation, brand stage and a link to the workspace, and moves them to lifecycle stage Customer.
// Called by stripe-webhook after a payment or subscription change (service key), and by the app when an owner
// answers the brand stage question (their own sign-in). Staff can call it for any workspace.
// Secret: HUBSPOT_TOKEN (private app with crm.objects.contacts.read and crm.objects.contacts.write). Optional APP_URL.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const STAGES = ["no_brand", "guidelines_no_system", "brand_need_speed"];
const LATER = ["customer", "evangelist"]; // HubSpot won't move a contact back from these

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const token = Deno.env.get("HUBSPOT_TOKEN");
  if (!token) return json({ skipped: "HUBSPOT_TOKEN not set" });
  let body: { workspace_id?: string };
  try { body = await req.json(); } catch { return json({ error: "Bad JSON" }, 400); }
  if (!body.workspace_id || !/^[0-9a-f-]{36}$/.test(body.workspace_id)) return json({ error: "workspace_id required" }, 400);

  const url = Deno.env.get("SUPABASE_URL")!, service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const internal = (req.headers.get("Authorization") ?? "") === "Bearer " + service;
  if (!internal) {
    const caller = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: role } = await caller.rpc("member_role", { ws: body.workspace_id });
    const { data: staff } = await caller.rpc("is_staff");
    if (role !== "owner" && !staff) return json({ error: "Only the workspace owner or Colorteam can sync" }, 403);
  }
  const db = createClient(url, service);
  const { data: ws } = await db.from("workspaces").select("id,slug,name,plan,settings").eq("id", body.workspace_id).maybeSingle();
  if (!ws) return json({ error: "Workspace not found" }, 404);
  if (ws.slug === "colorteam") return json({ skipped: "internal workspace" });
  const { data: owners } = await db.from("memberships").select("email,name").eq("workspace_id", ws.id).eq("role", "owner");
  if (!owners?.length) return json({ skipped: "no owners" });

  const s: any = ws.settings || {}, b: any = s.billing || {};
  const app = (Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/").replace(/\/?$/, "/");
  const common: Record<string, string> = {
    company: ws.name,
    studio_plan: ["core", "growth", "max"].includes(ws.plan) ? ws.plan : "",
    studio_subscription_status: b.status || "",
    studio_brand_foundation: b.foundation ? "true" : "false",
    studio_workspace_url: app + "?ws=" + encodeURIComponent(ws.slug),
  };
  if (b.paid_at) common.studio_customer_since = String(b.paid_at).slice(0, 10);
  if (STAGES.includes(s.brand_stage)) common.studio_brand_stage = s.brand_stage;
  for (const k of Object.keys(common)) if (common[k] === "") delete common[k];

  const hs = (path: string, init: RequestInit = {}) => fetch("https://api.hubapi.com" + path, { ...init, headers: { Authorization: "Bearer " + token, "Content-Type": "application/json", ...(init.headers || {}) } })
    .then(async (r) => ({ ok: r.ok, status: r.status, body: await r.json().catch(() => ({})) }));

  const inputs = owners.map((o) => {
    const [first, ...rest] = String(o.name || "").trim().split(/\s+/);
    const p: Record<string, string> = { email: o.email.toLowerCase(), ...common };
    if (first) p.firstname = first; if (rest.length) p.lastname = rest.join(" ");
    return { idProperty: "email", id: o.email.toLowerCase(), properties: p };
  });
  const up = await hs("/crm/v3/objects/contacts/batch/upsert", { method: "POST", body: JSON.stringify({ inputs }) });
  // Re-read settings just before writing, so a kit save in between isn't lost.
  const mark = async (hubspot: Record<string, unknown>) => {
    const { data: now } = await db.from("workspaces").select("settings").eq("id", ws.id).single();
    await db.from("workspaces").update({ settings: { ...((now?.settings as any) || {}), hubspot } }).eq("id", ws.id);
  };
  if (!up.ok) {
    await mark({ error: (up.body as any)?.message || "HTTP " + up.status, at: new Date().toISOString() });
    return json({ error: "HubSpot: " + ((up.body as any)?.message || up.status) }, 502);
  }
  const ids: string[] = ((up.body as any).results || []).map((r: any) => r.id);

  // Lifecycle: only move forward to Customer (paid and not cancelled).
  let lifecycle = 0;
  if (b.status !== "canceled" && ids.length) {
    const cur = await hs("/crm/v3/objects/contacts/batch/read", { method: "POST", body: JSON.stringify({ properties: ["lifecyclestage"], inputs: ids.map((id) => ({ id })) }) });
    const move = ((cur.body as any).results || []).filter((r: any) => !LATER.includes(r.properties?.lifecyclestage)).map((r: any) => r.id);
    if (move.length) {
      const lc = await hs("/crm/v3/objects/contacts/batch/update", { method: "POST", body: JSON.stringify({ inputs: move.map((id: string) => ({ id, properties: { lifecyclestage: "customer" } })) }) });
      if (lc.ok) lifecycle = move.length;
    }
  }
  await mark({ contacts: ids, synced_at: new Date().toISOString() });
  return json({ ok: true, contacts: ids.length, lifecycle_moved: lifecycle });
});
