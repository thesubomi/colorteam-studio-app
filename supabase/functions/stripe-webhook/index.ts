// Stripe → Studio. A paid checkout creates the client's workspace, makes the payer its owner
// and emails them an invite. A cancelled subscription is recorded on the workspace.
// Secrets: STRIPE_WEBHOOK_SECRET (from the Stripe webhook endpoint). APP_URL optional.
import Stripe from "npm:stripe@17.4.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const stripe = new Stripe("sk_unused_signature_only", { apiVersion: "2024-11-20.acacia" });
const crypto = Stripe.createSubtleCryptoProvider();
const ok = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 36) || "client";

const FOUNDATION_START = {
  moodboards: { status: "not started", files: [] },
  logo: { status: "not started", files: [] },
  guidelines: { status: "not started", files: [] },
  signoff: { status: "not started", files: [] },
};

Deno.serve(async (req) => {
  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) return ok({ error: "STRIPE_WEBHOOK_SECRET not set" }, 500);
  const sig = req.headers.get("stripe-signature") ?? "";
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, secret, undefined, crypto);
  } catch (e) {
    return ok({ error: "Bad signature: " + (e as Error).message }, 400);
  }

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const appUrl = Deno.env.get("APP_URL") || "https://app-staging.colorteam.io/";

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const md = s.metadata || {};
    const plan = ["core", "growth", "max"].includes(md.plan) ? md.plan : null;
    if (!plan) return ok({ skipped: "no studio plan on this checkout" });
    const email = (s.customer_details?.email || s.customer_email || "").toLowerCase();
    if (!email) return ok({ error: "no customer email" }, 400);

    // Stripe retries; one checkout must only ever create one workspace.
    const { data: dupe } = await admin.from("workspaces").select("id,slug").eq("settings->billing->>session", s.id).maybeSingle();
    if (dupe) return ok({ ok: true, duplicate: true, workspace: dupe.slug });

    const business = (s.customer_details as any)?.business_name || (s as any).collected_information?.business_name || "";
    const domain = email.split("@")[1] || "";
    const freeMail = /^(gmail|googlemail|yahoo|outlook|hotmail|icloud|proton|protonmail|live|aol|gmx|wp|o2|onet|interia)\./.test(domain);
    const name = business || (freeMail ? (s.customer_details?.name || email.split("@")[0]) : domain.split(".")[0]);
    const nice = name.replace(/\b\w/g, (c: string) => c.toUpperCase());

    let slug = slugify(name), n = 1;
    while ((await admin.from("workspaces").select("id").eq("slug", slug).maybeSingle()).data) slug = slugify(name) + "-" + (++n);

    const settings: Record<string, unknown> = {
      billing: {
        session: s.id, customer: s.customer, subscription: s.subscription, status: "active",
        plan, foundation: md.foundation === "yes", addons: md.addons || "none",
        amount_total: s.amount_total, currency: s.currency, paid_at: new Date().toISOString(), livemode: event.livemode,
      },
    };
    if (md.foundation === "yes") settings.foundation = FOUNDATION_START;

    const { data: ws, error: wErr } = await admin.from("workspaces").insert({ slug, name: nice, plan, settings }).select("id,slug,name").single();
    if (wErr) return ok({ error: wErr.message }, 500);
    await admin.from("memberships").upsert({ workspace_id: ws.id, email, name: s.customer_details?.name || null, role: "owner" });

    const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const known = users?.users?.some((u) => (u.email ?? "").toLowerCase() === email);
    const sent = known
      ? await admin.auth.signInWithOtp({ email, options: { emailRedirectTo: appUrl, shouldCreateUser: false } })
      : await admin.auth.admin.inviteUserByEmail(email, { redirectTo: appUrl, data: { invited_to: ws.name, invited_by: "Colorteam", full_name: s.customer_details?.name || "" } });
    return ok({ ok: true, workspace: ws.slug, email_sent: !sent.error, warning: sent.error?.message });
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const { data: ws } = await admin.from("workspaces").select("id,settings").eq("settings->billing->>subscription", sub.id).maybeSingle();
    if (!ws) return ok({ skipped: "no workspace for subscription" });
    const billing = { ...((ws.settings as any)?.billing || {}), status: sub.status, cancel_at: sub.cancel_at, updated_at: new Date().toISOString() };
    await admin.from("workspaces").update({ settings: { ...(ws.settings as any), billing } }).eq("id", ws.id);
    return ok({ ok: true, status: sub.status });
  }

  return ok({ ignored: event.type });
});
