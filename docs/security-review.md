# Security review, staging, 2026-11-05

| Area | Finding | Status |
|---|---|---|
| Keys in the browser | Only the publishable/anon keys ship; the service key lives in the edge function's environment | OK |
| Tenant isolation | RLS on every table; `supabase/tests/rls_workspaces.sql` checks editors, owners, staff, anon across two fake clients | OK, passes |
| Approvals | Database trigger blocks non-approvers from approving or requesting changes | OK |
| Files moving between clients | Trigger blocks changing `workspace_id` on a file | OK |
| Plan and slug | Owners could edit their own workspace row, including `plan` | Fixed in 0007: only staff change plan or slug; test added |
| Invites | `invite` function verifies the caller is owner or staff before writing | OK |
| Storage | Guidelines and kit files private; path must start with a workspace the caller belongs to | OK |
| Template requests | Clients create and withdraw open ones; only staff change status | OK |
| Email rate limit | Default Supabase sender caps auth emails at a few per hour | Open: needs custom SMTP (tracker step 79) |
| Backups | Free plan: daily backups, 7 days, no point-in-time | Accept for testing; review before paying clients |
| Rate limits on functions | Supabase platform limits only | Revisit with the Stripe webhook |
