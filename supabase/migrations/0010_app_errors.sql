-- Error log for the app: crashes and failed actions reported by browsers, read by staff.
-- Browsers can only write through log_app_error(), which trims fields and limits how often
-- one person can write, so the table can't be flooded.

create table public.app_errors (
  id           bigint generated always as identity primary key,
  at           timestamptz not null default now(),
  user_email   text,
  workspace_id uuid,
  release      text,
  url          text,
  message      text not null,
  stack        text,
  user_agent   text
);
create index app_errors_at on public.app_errors (at desc);

alter table public.app_errors enable row level security;
create policy "app_errors: staff read" on public.app_errors for select using (public.is_staff());
create policy "app_errors: staff delete" on public.app_errors for delete using (public.is_staff());
grant select, delete on public.app_errors to authenticated;

create or replace function public.log_app_error(message text, stack text default null, url text default null,
  release text default null, workspace_id uuid default null, user_agent text default null) returns void
language plpgsql security definer set search_path to 'public' as $$
declare who text := public.jwt_email();
begin
  if coalesce(trim(message), '') = '' then return; end if;
  -- At most 30 reports a minute per person (or for signed-out visitors together).
  if (select count(*) from public.app_errors e
       where e.at > now() - interval '1 minute' and e.user_email is not distinct from who) >= 30 then
    return;
  end if;
  insert into public.app_errors (user_email, workspace_id, release, url, message, stack, user_agent)
  values (who, workspace_id, left(release, 40), left(url, 300), left(message, 1000), left(stack, 4000), left(user_agent, 300));
  -- Keep 60 days.
  delete from public.app_errors where at < now() - interval '60 days';
end $$;
grant execute on function public.log_app_error(text, text, text, text, uuid, text) to anon, authenticated;
