# Edge functions

Deployed from the Supabase dashboard (Functions → Deploy) or `supabase functions deploy <name>`.

| Function | What it does | Secrets |
|---|---|---|
| `invite` | Adds a membership and emails a sign-in link / invite (owners and staff only) | none beyond the defaults |
| `stripe-webhook` | Paid checkout → new workspace (plan from the payment link's metadata), payer as owner, invite email; subscription changes recorded on the workspace. JWT verification off; Stripe signature checked instead | `STRIPE_WEBHOOK_SECRET`, optional `APP_URL` |

Auth emails (invite, sign-in link) use the project's email templates under Authentication → Emails; the Studio ones carry the workspace name from `invited_to`.

## billing-portal

One-click "Manage billing": checks the caller owns the workspace (or is staff), reads the Stripe customer from `workspaces.settings.billing.customer` and returns a Stripe customer-portal session URL. Secret: `STRIPE_SECRET_KEY` (a restricted key with Customer portal: Write is enough). JWT verification off; the function checks the caller itself. The app falls back to the portal's email login link (config `billingPortal`) if this fails.

## notify

Approval emails. The editor calls it after a file is sent for approval (event `sent`), approved (`approved`) or sent back (`changes`). It re-reads the file, checks the caller is in its workspace, then emails the workspace's owners and approvers (sent) or the file's maker (approved/changes) through SMTP on port 465. Secrets: `SMTP_USER`, `SMTP_PASS` (Google Workspace app password); optional `SMTP_HOST`, `SMTP_FROM_NAME`, `APP_URL`. Without the secrets it returns `skipped`. JWT verification off; the function checks the caller itself.

## mcp

MCP server (Streamable HTTP, JSON responses) for agent access. Auth: `Authorization: Bearer cts_...` or `?key=`. Tools: get_workspace, list_templates, list_posts, create_post, update_post, request_approval (emails approvers via `notify`). Agents can't approve or publish. Edit `server.ts`; after template changes run `npm run build && node scripts/template-manifest.cjs && node scripts/build-mcp.cjs` and deploy `index.ts`. JWT verification off (keys are checked by hash).

`notify` also accepts server-to-server calls from `mcp` (Authorization = the service key, `actor` in the body).

## post-reminders

Scheduler, version one (posting is by hand until channel APIs are approved). pg_cron calls it every 5 minutes (`0012_post_reminders.sql`, then `select public.schedule_post_reminders('<project url>')` once per environment). It emails: approvers 24 h before a scheduled post that isn't approved; the maker and owners at the time for approved posts (caption and UTM-tagged links included) or for posts that missed their time because they weren't approved. Each reminder is claimed in `post_reminders` before sending, released if the email fails (so the next run retries). Secrets: `SMTP_USER`, `SMTP_PASS`; optional `SMTP_HOST`, `SMTP_FROM_NAME`, `APP_URL`. JWT verification off; it takes no input and only sends what is due.
