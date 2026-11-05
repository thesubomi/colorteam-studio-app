# Database

Projects: production `vxuqsfyvvchwqzvdjjfs` (colorteam.io/studio, later app.colorteam.io) and staging `aqssqqiiwcfwyygmxoic` (app-staging.colorteam.io, GitHub Pages, localhost). The app picks one by hostname in `legacy/app/config.js`.

`migrations/0001_baseline.sql` is the schema of the production project as of 2026-11-04, applied to staging the same day (staging holds no production data; one seed member).
Later changes go in numbered files after it. Apply a file by pasting it into the project's SQL editor, or with the Supabase CLI.

Auth: email sign-in links (and password), Google sign-in available. Redirect URLs allowed: colorteam.io/studio, app-staging.colorteam.io, thesubomi.github.io/colorteam-studio-app, localhost:5173.

## Migrations applied

| File | Production | Staging |
|---|---|---|
| 0001_baseline.sql | is the baseline | 2026-11-04 |
| 0002_workspaces.sql | not yet | 2026-11-04 |
| 0003_guidelines_storage.sql | not yet | 2026-11-04 |
| 0004_brand_kit_assets.sql | not yet | 2026-11-04 |
| 0005_templates.sql | not yet | 2026-11-05 |
| 0006_template_requests.sql | not yet | 2026-11-05 |
| 0007_protect_plan.sql | not yet | 2026-11-05 (trigger re-attached by 0008) |
| 0008_plan_limits.sql | not yet | 2026-11-05 |

Apply a migration on its own, then run `tests/rls_workspaces.sql` as a separate run: the test ends in `rollback`, and the SQL editor runs everything pasted in one transaction, so a migration pasted together with the test is undone with it.

Plan limits (0008): `plan_limit(ws, key)` gives seats / templates / requests / channels for the workspace's plan, with per-workspace extras in `settings.limits` (staff only). Seats are enforced on `memberships` inserts (staff never use one), template requests per calendar month on `template_requests`. Owners cannot edit `settings.limits` or `settings.billing`.

Workspace model (0002): `workspaces` (one per client, slug + plan), `memberships` (email + role owner/approver/editor per workspace), `invites`, `staff` (Colorteam people who can enter every workspace). `requests` and `library` carry `workspace_id`. `members` is now a view of the caller's default workspace so the current app keeps working until the switcher ships. Helpers: `is_staff()`, `member_role(ws)`, `is_member(ws)`, `can_approve(ws)`, `default_workspace()`.

## Demo data (staging only)

`seed/demo_northline.sql` creates "Northline Summit (demo)": full brand kit (layout locked, do-not-use words), Foundation at 2 of 4, three members (Subomi owner, a fake editor and approver), four files in every state (approved, waiting, changes requested, draft) and an open template request. Rerun it to reset the demo.
