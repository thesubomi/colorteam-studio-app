# Production runbook: app.colorteam.io

Go-Live Tracker tasks 42 to 48. Production Supabase project: `vxuqsfyvvchwqzvdjjfs`. Staging stays on `aqssqqiiwcfwyygmxoic` and app-staging.colorteam.io.

Everything up to step 5 can run before Stripe live mode. Steps 6 and 7 wait on it (task 40).

## 1. Safety copy (before any migration)

The free plan only has a daily backup, so first copy today's data inside the production database. In the SQL editor, run on its own:

```sql
create schema if not exists backup_20261120;
create table backup_20261120.members  as select * from public.members;
create table backup_20261120.requests as select * from public.requests;
create table backup_20261120.library  as select * from public.library;
select 'members' t, count(*) from backup_20261120.members
union all select 'requests', count(*) from backup_20261120.requests
union all select 'library', count(*) from backup_20261120.library;
```

Write the three counts in the tracker note for task 42. Drop the schema a week after go-live.

## 2. Migrations (task 42)

Apply `supabase/migrations/0002` to `0013` in order, one file per SQL editor run. After each file, run `supabase/tests/rls_workspaces.sql` as a separate run (it ends in rollback, so never paste it together with a migration). Stop at the first failure.

- `0002_workspaces.sql` already moves the current team, requests and files into the Colorteam workspace (task 32). Check afterwards: `select count(*) from requests where workspace_id is null;` returns 0, and the counts match step 1.
- `0012_post_reminders.sql` needs the pg_net and pg_cron extensions (the file enables them). Only after the `post-reminders` function is deployed (step 4), run once: `select public.schedule_post_reminders('https://vxuqsfyvvchwqzvdjjfs.supabase.co');`
- Done 2026-11-20: safety copy (7 / 82 / 5), 0002 to 0013 applied, RLS test passed (see supabase/README.md for the production test tweak).
- Update the table in `supabase/README.md` with the date for each file.

## 3. Sign-in (task 44)

Authentication > URL configuration:
- Site URL: `https://app.colorteam.io/`
- Redirect URLs: `https://app.colorteam.io/**` (keep colorteam.io/studio until the redirect is live)

Authentication > Emails: paste the four templates from `supabase/emails` (subject from the `.subject.txt` files).

Authentication > SMTP: same as staging (Google Workspace, port 465, sender name Colorteam Studio). Archie pastes the app password. Consider studio@ or hello@ as the sender.

Google and GitHub sign-in (task 103): switch on each provider once Archie has the OAuth client details, with the production callback URL Supabase shows on the provider page.

## 4. Server functions and secrets (task 43)

Edge Functions > Secrets. Archie pastes values; names:

| Secret | Now or at Stripe live |
|---|---|
| `APP_URL` = `https://app.colorteam.io/` | now |
| `SMTP_USER`, `SMTP_PASS` (optional `SMTP_HOST`, `SMTP_FROM_NAME`) | now |
| `HUBSPOT_TOKEN` | now |
| `ANTHROPIC_API_KEY` (production key; optional `AI_MODEL`, `AI_DAILY_LIMIT`) | now |
| `STRIPE_WEBHOOK_SECRET` (live) | at Stripe live |
| `STRIPE_SECRET_KEY` (live restricted key, Customer portal: Write) | at Stripe live |

Deploy all eight from `supabase/functions` with JWT verification **off** (each one checks the caller itself): `stripe-webhook`, `invite`, `notify`, `billing-portal`, `hubspot-sync`, `ai`, `mcp`, `post-reminders`. Seven are single `index.ts` files. `mcp` also needs `server.ts` and `templates.json`; if the dashboard editor won't take three files, deploy it with the CLI (`supabase functions deploy mcp --no-verify-jwt --project-ref vxuqsfyvvchwqzvdjjfs`).

Done 2026-11-20: all eight deployed from the dashboard editor (mcp's index.ts is already bundled, one file), JWT verification off on each, `APP_URL` set. Still to paste: SMTP_USER, SMTP_PASS, HUBSPOT_TOKEN, ANTHROPIC_API_KEY, then the two Stripe secrets at live mode. Schedule the reminder job (step 2) once app.colorteam.io is live, so reminder emails link to a working app.

## 5. app.colorteam.io (task 45)

GitHub Pages allows one custom domain per repo, and this repo serves app-staging.colorteam.io.

1. Archie creates an empty public repo `thesubomi/colorteam-studio-app-production`.
2. Add `docs/production-deploy.yml` from this repo to it as `.github/workflows/deploy.yml`. It builds this repo's `production` branch.
3. In that repo: Settings > Pages > Source: GitHub Actions; Custom domain: `app.colorteam.io`; Enforce HTTPS.
4. Namecheap DNS: CNAME `app` to `thesubomi.github.io`.
5. Release = move the `production` branch to the commit to ship, then run the workflow (Actions > Deploy app.colorteam.io > Run workflow).
6. colorteam.io/studio redirects to `https://app.colorteam.io/` (in the agency site repo).

The app picks the production database by hostname (`legacy/app/config.js`), so no code change is needed. GA4 only loads on app.colorteam.io.

## 6. Live payments (task 46, after Stripe live)

- Live Payment Links return to `https://app.colorteam.io/?welcome=1`.
- Live webhook endpoint: `https://vxuqsfyvvchwqzvdjjfs.supabase.co/functions/v1/stripe-webhook`, events as on the test endpoint. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
- Customer portal switched on in live mode.

## 7. Launch-day test (task 48)

Real card payment (refund after), invite email, sign in, brand kit with guidelines upload, workspace switcher, create, export, AI caption, billing portal, HubSpot contact. Then point the uptime check (`.github/workflows/uptime.yml`) at production too.
