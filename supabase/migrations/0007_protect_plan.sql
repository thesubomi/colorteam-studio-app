-- Owners may edit their workspace's name and settings, never its plan or slug (billing and links).
create or replace function public.guard_workspace() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if not public.is_staff() and (new.plan is distinct from old.plan or new.slug is distinct from old.slug or new.id is distinct from old.id) then
    raise exception 'Only Colorteam can change the plan or address of a workspace';
  end if;
  return new;
end $$;
create trigger workspaces_guard before update on public.workspaces
  for each row execute function public.guard_workspace();
