-- Scheduler, version one: posts carry a date, time and time zone (requests.data: schedule, time, tz).
-- Until channel APIs are approved, posting is by hand, so the Studio emails people at the right moments:
--   needs_approval  24 h before a post that still isn't approved (to owners and approvers)
--   post_now        at the time, for approved posts not yet marked as posted (to the maker and owners)
--   missed          at the time, for posts that never got approved (to the maker and owners)
-- The post-reminders edge function runs every 5 minutes (pg_cron + pg_net), sends what is due and records
-- it here, so each reminder goes once per scheduled time. Rescheduling makes new reminders.

create table if not exists public.post_reminders (
  request_id uuid not null references public.requests(id) on delete cascade,
  kind       text not null check (kind in ('needs_approval', 'post_now', 'missed')),
  due_at     timestamptz not null,
  sent_to    int not null default 0,
  sent_at    timestamptz not null default now(),
  primary key (request_id, kind, due_at)
);
alter table public.post_reminders enable row level security;
create policy "post_reminders: staff read" on public.post_reminders for select using (public.is_staff());

-- The scheduled moment of a post, or null when it has no date or a bad time / time zone.
create or replace function public.post_due_at(d jsonb) returns timestamptz
language plpgsql stable set search_path to 'public' as $$
declare t text := coalesce(nullif(d->>'time', ''), '09:00'); tz text := coalesce(nullif(d->>'tz', ''), 'Europe/Warsaw');
begin
  if coalesce(d->>'schedule', '') !~ '^\d{4}-\d{2}-\d{2}$' or t !~ '^\d{2}:\d{2}$' then return null; end if;
  if not exists (select 1 from pg_timezone_names where name = tz) then tz := 'Europe/Warsaw'; end if;
  return ((d->>'schedule') || ' ' || t)::timestamp at time zone tz;
exception when others then return null;
end $$;

-- What is due now and not sent yet. Only looks back two days, so old posts never trigger a burst.
create or replace function public.due_post_reminders()
returns table (request_id uuid, kind text, due_at timestamptz)
language sql stable security definer set search_path to 'public' as $$
  with p as (
    select r.id, r.status, public.post_due_at(r.data) as due,
           coalesce(jsonb_array_length(case when jsonb_typeof(r.data->'posted'->'list') = 'array' then r.data->'posted'->'list' end), 0) > 0 as posted
    from public.requests r
    where r.workspace_id is not null and r.data->>'schedule' >= to_char(now() - interval '3 days', 'YYYY-MM-DD')
  ), due as (
    select id, 'needs_approval'::text k, due from p
      where status <> 'approved' and not posted and now() >= due - interval '24 hours' and now() < due
    union all
    select id, 'post_now', due from p
      where status = 'approved' and not posted and now() >= due and now() < due + interval '2 days'
    union all
    select id, 'missed', due from p
      where status <> 'approved' and not posted and now() >= due and now() < due + interval '2 days'
  )
  select d.id, d.k, d.due from due d
  where d.due is not null
    and not exists (select 1 from public.post_reminders x where x.request_id = d.id and x.kind = d.k and x.due_at = d.due)
    -- a post that got its "needs approval" mail and then went past its time should still get "missed",
    -- but never two of the same kind for the same moment (checked above).
  order by d.due;
$$;
revoke all on function public.due_post_reminders() from public, anon, authenticated;
grant execute on function public.due_post_reminders() to service_role;
grant execute on function public.post_due_at(jsonb) to authenticated, service_role;

create index if not exists requests_schedule on public.requests ((data->>'schedule')) where data->>'schedule' is not null;

-- Run the edge function every 5 minutes. The function needs no key: it only sends reminders that are due,
-- once each, so calling it early or twice does nothing extra.
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

create or replace function public.schedule_post_reminders(base_url text) returns void
language plpgsql security definer set search_path to 'public', 'extensions' as $$
begin
  perform cron.unschedule(jobid) from cron.job where jobname = 'post-reminders';
  perform cron.schedule('post-reminders', '*/5 * * * *',
    format($c$select net.http_post(url := %L, headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb, timeout_milliseconds := 20000)$c$,
           base_url || '/functions/v1/post-reminders'));
end $$;
revoke all on function public.schedule_post_reminders(text) from public, anon, authenticated;

-- Per environment (run once after deploying the function):
--   staging:    select public.schedule_post_reminders('https://aqssqqiiwcfwyygmxoic.supabase.co');
--   production: select public.schedule_post_reminders('https://vxuqsfyvvchwqzvdjjfs.supabase.co');
