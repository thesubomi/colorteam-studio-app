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

Workspace model (0002): `workspaces` (one per client, slug + plan), `memberships` (email + role owner/approver/editor per workspace), `invites`, `staff` (Colorteam people who can enter every workspace). `requests` and `library` carry `workspace_id`. `members` is now a view of the caller's default workspace so the current app keeps working until the switcher ships. Helpers: `is_staff()`, `member_role(ws)`, `is_member(ws)`, `can_approve(ws)`, `default_workspace()`.
