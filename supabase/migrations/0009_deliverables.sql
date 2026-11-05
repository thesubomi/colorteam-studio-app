-- Deliverables: what Colorteam owes each client, as dated tasks for staff.
-- Created automatically from template requests (due by plan turnaround) and Brand Foundation
-- stages; staff add their own (check-ins, extras). Staff only.

create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  kind         text not null default 'manual' check (kind in ('request','foundation','manual')),
  ref          text,                       -- template_requests.id or foundation stage key
  title        text not null,
  due_on       date,
  assignee     text,                       -- staff email
  status       text not null default 'open' check (status in ('open','done')),
  note         text not null default '',
  created_at   timestamptz not null default now(),
  done_at      timestamptz,
  unique (workspace_id, kind, ref)
);
create index tasks_open on public.tasks (status, due_on);

alter table public.tasks enable row level security;
create policy "tasks: staff all" on public.tasks for all using (public.is_staff()) with check (public.is_staff());
grant select, insert, update, delete on public.tasks to authenticated;

-- Working days (Mon to Fri) after a date.
create or replace function public.add_business_days(d date, n int) returns date
language plpgsql immutable as $$
declare r date := d; i int := 0;
begin
  while i < n loop
    r := r + 1;
    if extract(isodow from r) < 6 then i := i + 1; end if;
  end loop;
  return r;
end $$;

-- Turnaround for a template request, in working days, by plan.
create or replace function public.plan_turnaround(ws uuid) returns int
language sql stable security definer set search_path to 'public' as $$
  select case (select plan from public.workspaces where id = ws) when 'max' then 2 when 'growth' then 3 else 5 end;
$$;

-- Template requests -> tasks.
create or replace function public.sync_request_task() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if tg_op = 'DELETE' then
    delete from public.tasks where kind = 'request' and ref = old.id::text;
    return old;
  end if;
  if tg_op = 'INSERT' then
    insert into public.tasks (workspace_id, kind, ref, title, due_on)
    values (new.workspace_id, 'request', new.id::text, 'Template request: ' || new.title,
            public.add_business_days(new.created_at::date, public.plan_turnaround(new.workspace_id)))
    on conflict (workspace_id, kind, ref) do nothing;
  else
    update public.tasks
       set status  = case when new.status in ('done','declined') then 'done' else 'open' end,
           done_at = case when new.status in ('done','declined') then coalesce(done_at, now()) else null end,
           title   = 'Template request: ' || new.title
     where kind = 'request' and ref = new.id::text;
  end if;
  return new;
end $$;
drop trigger if exists template_requests_task on public.template_requests;
create trigger template_requests_task after insert or update or delete on public.template_requests
  for each row execute function public.sync_request_task();

-- Brand Foundation stages -> tasks (created once, status follows the stage).
create or replace function public.sync_foundation_tasks() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare st record; base date;
begin
  if not (new.settings ? 'foundation') then return new; end if;
  base := coalesce((new.settings->'billing'->>'paid_at')::date, current_date);
  for st in select * from (values
      ('moodboards', 'Foundation: mood boards', 5),
      ('logo',       'Foundation: logo',        15),
      ('guidelines', 'Foundation: guidelines',  25),
      ('signoff',    'Foundation: sign-off',    30)) as s(key, title, days)
  loop
    insert into public.tasks (workspace_id, kind, ref, title, due_on)
    values (new.id, 'foundation', st.key, st.title, public.add_business_days(base, st.days))
    on conflict (workspace_id, kind, ref) do nothing;
    update public.tasks
       set status  = case when new.settings->'foundation'->st.key->>'status' = 'done' then 'done' else 'open' end,
           done_at = case when new.settings->'foundation'->st.key->>'status' = 'done' then coalesce(done_at, now()) else null end
     where workspace_id = new.id and kind = 'foundation' and ref = st.key;
  end loop;
  return new;
end $$;
drop trigger if exists workspaces_foundation_tasks on public.workspaces;
create trigger workspaces_foundation_tasks after insert or update of settings on public.workspaces
  for each row execute function public.sync_foundation_tasks();

-- Backfill what already exists.
insert into public.tasks (workspace_id, kind, ref, title, due_on, status, done_at)
select r.workspace_id, 'request', r.id::text, 'Template request: ' || r.title,
       public.add_business_days(r.created_at::date, public.plan_turnaround(r.workspace_id)),
       case when r.status in ('done','declined') then 'done' else 'open' end,
       case when r.status in ('done','declined') then r.updated_at end
from public.template_requests r
on conflict (workspace_id, kind, ref) do nothing;

update public.workspaces set settings = settings where settings ? 'foundation';
