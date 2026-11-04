-- Brand guidelines per workspace: a private storage bucket, files kept under <workspace_id>/...
-- Members read their workspace's files; owners and staff upload. Owners may edit their workspace's
-- name and settings (staff keep full write).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('guidelines', 'guidelines', false, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "guidelines: members read" on storage.objects for select
  using (bucket_id = 'guidelines' and public.is_member((split_part(name, '/', 1))::uuid));
create policy "guidelines: owners write" on storage.objects for insert
  with check (bucket_id = 'guidelines' and (public.is_staff() or public.member_role((split_part(name, '/', 1))::uuid) = 'owner'));
create policy "guidelines: owners update" on storage.objects for update
  using (bucket_id = 'guidelines' and (public.is_staff() or public.member_role((split_part(name, '/', 1))::uuid) = 'owner'));
create policy "guidelines: owners delete" on storage.objects for delete
  using (bucket_id = 'guidelines' and (public.is_staff() or public.member_role((split_part(name, '/', 1))::uuid) = 'owner'));

create policy "workspaces: owners update" on public.workspaces for update
  using (public.member_role(id) = 'owner') with check (public.member_role(id) = 'owner');
