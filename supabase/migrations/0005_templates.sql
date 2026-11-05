-- Templates as rows. A template belongs to one workspace, or to nobody (workspace_id null = available to all).
-- Members read published ones; Colorteam staff manage them. The spec column holds the JSON described in docs/template-format.md.

create table public.templates (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,   -- null = global
  key          text not null,                                             -- template id used by files (tplId)
  name         text not null,
  spec         jsonb not null,
  published    boolean not null default false,
  version      int not null default 1,
  created_by   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, key)
);
create unique index templates_global_key on public.templates (key) where workspace_id is null;
create index templates_workspace on public.templates (workspace_id, published);

alter table public.templates enable row level security;
create policy "templates: members read published" on public.templates for select
  using (published and (workspace_id is null or public.is_member(workspace_id)));
create policy "templates: staff all" on public.templates for all
  using (public.is_staff()) with check (public.is_staff());

grant select, insert, update, delete on public.templates to authenticated;
alter publication supabase_realtime add table public.templates;
