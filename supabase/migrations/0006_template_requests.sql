-- Template requests: a client asks for a new template or variant; Colorteam ships it.
create table public.template_requests (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  requested_by text not null,
  title        text not null,
  brief        text not null default '',
  status       text not null default 'open' check (status in ('open','in progress','done','declined')),
  reply        text not null default '',
  template_id  uuid references public.templates(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index template_requests_ws on public.template_requests (workspace_id, created_at desc);

alter table public.template_requests enable row level security;
create policy "treq: members read"   on public.template_requests for select using (public.is_member(workspace_id));
create policy "treq: members create" on public.template_requests for insert with check (public.is_member(workspace_id) and requested_by = public.jwt_email());
create policy "treq: staff update"   on public.template_requests for update using (public.is_staff());
create policy "treq: delete"         on public.template_requests for delete using (public.is_staff() or (requested_by = public.jwt_email() and status = 'open'));

grant select, insert, update, delete on public.template_requests to authenticated;
alter publication supabase_realtime add table public.template_requests;
