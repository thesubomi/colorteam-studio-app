# Edge functions

Deployed from the Supabase dashboard (Functions → Deploy) or `supabase functions deploy <name>`.

| Function | What it does | Secrets |
|---|---|---|
| `invite` | Adds a membership and emails a sign-in link / invite (owners and staff only) | none beyond the defaults |
| `stripe-webhook` | Paid checkout → new workspace (plan from the payment link's metadata), payer as owner, invite email; subscription changes recorded on the workspace. JWT verification off; Stripe signature checked instead | `STRIPE_WEBHOOK_SECRET`, optional `APP_URL` |

Auth emails (invite, sign-in link) use the project's email templates under Authentication → Emails; the Studio ones carry the workspace name from `invited_to`.

## billing-portal

One-click "Manage billing": checks the caller owns the workspace (or is staff), reads the Stripe customer from `workspaces.settings.billing.customer` and returns a Stripe customer-portal session URL. Secret: `STRIPE_SECRET_KEY` (a restricted key with Customer portal: Write is enough). JWT verification off; the function checks the caller itself. The app falls back to the portal's email login link (config `billingPortal`) if this fails.
