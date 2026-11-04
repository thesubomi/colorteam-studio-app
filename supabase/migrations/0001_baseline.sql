-- Baseline of the production Studio database as read on 2026-11-04.
-- Three tables, one role helper, one approval guard. Realtime on requests and library.
-- Run this on a fresh project to get a staging copy of the schema (no data).

create table public.members (
  email text primary key,
  name  text,
  role  text not null default 'designer'          -- 'designer' | 'approver'
);

create table public.requests (                     -- one row per Studio file
  id         uuid primary key default gen_random_uuid(),
  uid        uuid not null default auth.uid(),
  email      text,
  data       jsonb not null,                        -- title, tplId, fields, photo, sizes, theme, offsets, comments, versions, schedule, note, ownerName, updatedAt, updatedBy
  status     text not null default 'draft',         -- draft | pending | approved | changes
  comment    text default '',
  at         timestamptz not null default now(),
  decided_at timestamptz
);
create index requests_uid_at on public.requests (uid, at desc);

create table public.library (                      -- shared assets (kind = 'photo' today)
  id      uuid primary key default gen_random_uuid(),
  uid     uuid not null default auth.uid(),
  kind    text not null,
  name    text,
  src     text not null,
  by_name text,
  at      timestamptz not null default now()
);

create or replace function public.my_role() returns text
language sql stable security definer set search_path to 'public' as $$
  select role from public.members where email = lower(auth.jwt() ->> 'email')
$$;

create or replace function public.guard_status() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if new.status is distinct from old.status
     and new.status in ('approved','changes')
     and coalesce(public.my_role(),'') <> 'approver' then
    raise exception 'Only approvers can approve or request changes';
  end if;
  return new;
end $$;
create trigger requests_guard before update on public.requests
  for each row execute function public.guard_status();

alter table public.members  enable row level security;
alter table public.requests enable row level security;
alter table public.library  enable row level security;

create policy "members: team read"   on public.members  for select using (my_role() is not null);
create policy "requests: team read"  on public.requests for select using (my_role() is not null);
create policy "requests: team create" on public.requests for insert with check (my_role() is not null and uid = auth.uid());
create policy "requests: team update" on public.requests for update using (my_role() is not null);
create policy "requests: delete"     on public.requests for delete using (my_role() = 'approver' or uid = auth.uid());
create policy "library: team read"   on public.library  for select using (my_role() is not null);
create policy "library: team create" on public.library  for insert with check (my_role() is not null and uid = auth.uid());
create policy "library: delete"      on public.library  for delete using (my_role() = 'approver' or uid = auth.uid());

alter publication supabase_realtime add table public.requests, public.library;
