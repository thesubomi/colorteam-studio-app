-- Workspaces: one Studio per client, sealed from the others.
-- Adds workspaces, memberships, invites and staff; gives every file and asset a workspace;
-- moves the existing team into the "colorteam" workspace; rewrites RLS around workspace membership.
-- The old members table becomes a view so the current app keeps working until the switcher ships.

create table public.workspaces (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$'),
  name       text not null,
  plan       text not null default 'core' check (plan in ('core','growth','max','internal')),
  settings   jsonb not null default '{}'::jsonb,        -- brand kit, approver policy, limits
  created_at timestamptz not null default now()
);

-- Colorteam staff can enter every workspace.
create table public.staff (
  email      text primary key,
  name       text,
  created_at timestamptz not null default now()
);

create table public.memberships (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email        text not null,
  name         text,
  role         text not null default 'editor' check (role in ('owner','approver','editor')),
  created_at   timestamptz not null default now(),
  primary key (workspace_id, email)
);
create index memberships_email on public.memberships (email);

create table public.invites (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email        text not null,
  role         text not null default 'editor' check (role in ('owner','approver','editor')),
  invited_by   text,
  created_at   timestamptz not null default now(),
  accepted_at  timestamptz,
  unique (workspace_id, email)
);

-- Helpers -------------------------------------------------------------------

create or replace function public.jwt_email() returns text
language sql stable as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path to 'public' as $$
  select exists (select 1 from public.staff where email = public.jwt_email())
$$;

create or replace function public.member_role(ws uuid) returns text
language sql stable security definer set search_path to 'public' as $$
  select role from public.memberships where workspace_id = ws and email = public.jwt_email()
$$;

create or replace function public.is_member(ws uuid) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select public.is_staff() or public.member_role(ws) is not null
$$;

create or replace function public.can_approve(ws uuid) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select public.is_staff() or public.member_role(ws) in ('owner','approver')
$$;

-- The workspace a request lands in when the app does not say: the user's only one.
create or replace function public.default_workspace() returns uuid
language sql stable security definer set search_path to 'public' as $$
  select (array_agg(workspace_id))[1]
  from public.memberships where email = public.jwt_email()
  having count(*) = 1
$$;

-- Move the existing team into the Colorteam workspace -------------------------

insert into public.workspaces (slug, name, plan) values ('colorteam', 'Colorteam', 'internal');

insert into public.memberships (workspace_id, email, name, role)
select w.id, lower(m.email), m.name,
       case when lower(m.email) = 'subomi@colorteam.io' then 'owner'
            when m.role = 'approver' then 'approver' else 'editor' end
from public.members m, public.workspaces w where w.slug = 'colorteam';

insert into public.staff (email, name) values ('subomi@colorteam.io', 'Subomi')
on conflict do nothing;

alter table public.requests add column workspace_id uuid references public.workspaces(id) on delete cascade;
alter table public.library  add column workspace_id uuid references public.workspaces(id) on delete cascade;
update public.requests set workspace_id = (select id from public.workspaces where slug = 'colorteam');
update public.library  set workspace_id = (select id from public.workspaces where slug = 'colorteam');
alter table public.requests alter column workspace_id set not null, alter column workspace_id set default public.default_workspace();
alter table public.library  alter column workspace_id set not null, alter column workspace_id set default public.default_workspace();
create index requests_workspace_at on public.requests (workspace_id, at desc);
create index library_workspace_at  on public.library  (workspace_id, at desc);

-- Keep the old API alive: members is now a view of the user's default workspace, and
-- my_role() answers for that workspace (staff count as approver).
drop policy if exists "members: team read" on public.members;
drop table public.members;
create view public.members with (security_invoker = true) as
  select email, name, case role when 'editor' then 'designer' else 'approver' end as role
  from public.memberships where workspace_id = public.default_workspace();

create or replace function public.my_role() returns text
language sql stable security definer set search_path to 'public' as $$
  select case when public.is_staff() then 'approver'
              when public.member_role(public.default_workspace()) in ('owner','approver') then 'approver'
              when public.member_role(public.default_workspace()) = 'editor' then 'designer' end
$$;

create or replace function public.guard_status() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if new.status is distinct from old.status
     and new.status in ('approved','changes')
     and not public.can_approve(new.workspace_id) then
    raise exception 'Only approvers can approve or request changes';
  end if;
  if new.workspace_id is distinct from old.workspace_id then
    raise exception 'A file cannot move between workspaces';
  end if;
  return new;
end $$;

-- Row-level security ----------------------------------------------------------

alter table public.workspaces  enable row level security;
alter table public.staff       enable row level security;
alter table public.memberships enable row level security;
alter table public.invites     enable row level security;

create policy "workspaces: members read" on public.workspaces for select using (public.is_member(id));
create policy "workspaces: staff write"  on public.workspaces for all    using (public.is_staff()) with check (public.is_staff());

create policy "staff: self read" on public.staff for select using (email = public.jwt_email());

create policy "memberships: members read" on public.memberships for select using (public.is_member(workspace_id));
create policy "memberships: owners write" on public.memberships for all
  using (public.is_staff() or public.member_role(workspace_id) = 'owner')
  with check (public.is_staff() or public.member_role(workspace_id) = 'owner');

create policy "invites: owners read"  on public.invites for select using (public.is_staff() or public.member_role(workspace_id) = 'owner' or email = public.jwt_email());
create policy "invites: owners write" on public.invites for all
  using (public.is_staff() or public.member_role(workspace_id) = 'owner')
  with check (public.is_staff() or public.member_role(workspace_id) = 'owner');

drop policy "requests: team read"   on public.requests;
drop policy "requests: team create" on public.requests;
drop policy "requests: team update" on public.requests;
drop policy "requests: delete"      on public.requests;
create policy "requests: members read"   on public.requests for select using (public.is_member(workspace_id));
create policy "requests: members create" on public.requests for insert with check (public.is_member(workspace_id) and uid = auth.uid());
create policy "requests: members update" on public.requests for update using (public.is_member(workspace_id));
create policy "requests: delete"         on public.requests for delete using (public.can_approve(workspace_id) or uid = auth.uid());

drop policy "library: team read"   on public.library;
drop policy "library: team create" on public.library;
drop policy "library: delete"      on public.library;
create policy "library: members read"   on public.library for select using (public.is_member(workspace_id));
create policy "library: members create" on public.library for insert with check (public.is_member(workspace_id) and uid = auth.uid());
create policy "library: delete"         on public.library for delete using (public.can_approve(workspace_id) or uid = auth.uid());

alter publication supabase_realtime add table public.memberships;

grant select on public.members to anon, authenticated;
grant select, insert, update, delete on public.workspaces, public.memberships, public.invites, public.staff to authenticated;
