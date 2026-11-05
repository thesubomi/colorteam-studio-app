-- Plan entitlements (decision D5). Null means unlimited.
--   core:   2 seats, 12 templates, 2 template requests a month, 3 channels
--   growth: 5 seats, 24 templates, 5 requests a month, 6 channels
--   max / internal: unlimited, custom templates, MCP access
-- Staff can grant extras per workspace in settings.limits, e.g. {"seats": 4}.
-- Colorteam staff never use a seat.

create or replace function public.plan_limit(ws uuid, k text) returns int
language sql stable security definer set search_path to 'public' as $$
  select coalesce(
    (w.settings->'limits'->>k)::int,
    case w.plan
      when 'core' then case k when 'seats' then 2 when 'templates' then 12 when 'requests' then 2 when 'channels' then 3 end
      when 'growth' then case k when 'seats' then 5 when 'templates' then 24 when 'requests' then 5 when 'channels' then 6 end
      else null
    end)
  from public.workspaces w where w.id = ws;
$$;

create or replace function public.seats_used(ws uuid) returns int
language sql stable security definer set search_path to 'public' as $$
  select count(*)::int from public.memberships m
  where m.workspace_id = ws and not exists (select 1 from public.staff s where lower(s.email) = lower(m.email));
$$;

create or replace function public.requests_this_month(ws uuid) returns int
language sql stable security definer set search_path to 'public' as $$
  select count(*)::int from public.template_requests r
  where r.workspace_id = ws and r.status <> 'declined' and r.created_at >= date_trunc('month', now());
$$;

-- Server-side callers: the service key (Stripe webhook, invite function) or a direct database session
-- (SQL editor, migrations) carry no user email.
create or replace function public.jwt_role() returns text
language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'role', '') $$;

grant execute on function public.jwt_role(), public.plan_limit(uuid, text), public.seats_used(uuid), public.requests_this_month(uuid) to authenticated;

-- Seats: a new person beyond the plan is refused. Role changes (same email) and staff are not new seats.
create or replace function public.guard_seats() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare lim int;
begin
  -- The service key is not exempt: the invite function adds people on an owner's behalf with it.
  if public.is_staff() or public.jwt_role() = '' then return new; end if;
  if exists (select 1 from public.staff s where lower(s.email) = lower(new.email)) then return new; end if;
  if exists (select 1 from public.memberships m where m.workspace_id = new.workspace_id and m.email = new.email) then return new; end if;
  lim := public.plan_limit(new.workspace_id, 'seats');
  if lim is not null and public.seats_used(new.workspace_id) >= lim then
    raise exception 'Your plan includes % seats and they are all in use. Remove someone or upgrade to add more.', lim;
  end if;
  return new;
end $$;
drop trigger if exists memberships_seats on public.memberships;
create trigger memberships_seats before insert on public.memberships for each row execute function public.guard_seats();

-- Template requests: a monthly allowance. Withdrawn requests are deleted and declined ones do not count.
create or replace function public.guard_template_requests() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare lim int;
begin
  if public.is_staff() or public.jwt_role() in ('service_role', '') then return new; end if;
  lim := public.plan_limit(new.workspace_id, 'requests');
  if lim is not null and public.requests_this_month(new.workspace_id) >= lim then
    raise exception 'Your plan includes % template requests a month and this month''s are used. They reset on the 1st.', lim;
  end if;
  return new;
end $$;
drop trigger if exists template_requests_allowance on public.template_requests;
create trigger template_requests_allowance before insert on public.template_requests for each row execute function public.guard_template_requests();

-- Owners may edit their kit and guidelines in settings, but not their limits or billing record.
create or replace function public.guard_workspace() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_staff() and public.jwt_role() not in ('service_role', '') and (
       new.plan is distinct from old.plan or new.slug is distinct from old.slug or new.id is distinct from old.id
    or (new.settings->'limits') is distinct from (old.settings->'limits')
    or (new.settings->'billing') is distinct from (old.settings->'billing')) then
    raise exception 'Only Colorteam can change the plan, limits, billing or address of a workspace';
  end if;
  return new;
end $$;
-- (Re)attach the guard. On staging the 0007 trigger was lost when it was applied in the same run as a
-- rolled-back test, so this migration makes sure it exists.
drop trigger if exists workspaces_guard on public.workspaces;
create trigger workspaces_guard before update on public.workspaces for each row execute function public.guard_workspace();
