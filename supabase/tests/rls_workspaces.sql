-- Row-level security test for the workspace model. Paste into the SQL editor of a project
-- that has 0002_workspaces.sql applied. Runs inside a transaction and rolls back, so it
-- leaves no data behind. Fails loudly (ASSERT) if a client can see another client's rows.
begin;

-- Two clients, one editor each, one Colorteam staff member.
insert into public.workspaces (id, slug, name) values
  ('11111111-1111-1111-1111-111111111111','acme','Acme'),
  ('22222222-2222-2222-2222-222222222222','globex','Globex');
insert into public.memberships (workspace_id, email, role) values
  ('11111111-1111-1111-1111-111111111111','ann@acme.test','owner'),
  ('11111111-1111-1111-1111-111111111111','ed@acme.test','editor'),
  ('22222222-2222-2222-2222-222222222222','gil@globex.test','owner');
insert into public.staff (email) values ('staff@colorteam.test');
insert into public.requests (uid, email, data, workspace_id) values
  ('aaaaaaaa-0000-0000-0000-000000000001','ann@acme.test','{"title":"acme 1"}','11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-0000-0000-0000-000000000002','ed@acme.test','{"title":"acme 2"}','11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-0000-0000-0000-000000000001','gil@globex.test','{"title":"globex 1"}','22222222-2222-2222-2222-222222222222');

create or replace function pg_temp.become(email text, sub text) returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('email', email, 'sub', sub, 'role', 'authenticated')::text, true);
$$;

set local role authenticated;

-- Ed (Acme editor) sees only Acme's two files, one workspace, two teammates.
select pg_temp.become('ed@acme.test','aaaaaaaa-0000-0000-0000-000000000002');
do $$ begin
  assert (select count(*) from public.requests) = 2, 'editor should see 2 Acme files';
  assert (select count(*) from public.workspaces) = 1, 'editor should see 1 workspace';
  assert (select count(*) from public.memberships) = 2, 'editor should see 2 memberships';
  assert (select count(*) from public.members) = 2, 'legacy members view should show the Acme team';
  assert public.my_role() = 'designer', 'legacy role for an editor is designer';
  assert (select count(*) from public.staff) = 0, 'editor cannot read the staff list';
end $$;

-- Ed cannot approve.
do $$ begin
  begin
    update public.requests set status = 'approved' where data->>'title' = 'acme 1';
    raise exception 'editor was allowed to approve';
  exception when others then
    if sqlerrm not like 'Only approvers%' then raise; end if;
  end;
end $$;

-- Ed cannot write into Globex.
do $$ begin
  begin
    insert into public.requests (uid, email, data, workspace_id)
      values ('aaaaaaaa-0000-0000-0000-000000000002','ed@acme.test','{"title":"sneak"}','22222222-2222-2222-2222-222222222222');
    raise exception 'editor wrote into another workspace';
  exception when insufficient_privilege or check_violation then null;
  end;
end $$;

-- Ann (Acme owner) can approve and manage members, still sees nothing of Globex.
select pg_temp.become('ann@acme.test','aaaaaaaa-0000-0000-0000-000000000001');
do $$ begin
  update public.requests set status = 'approved' where data->>'title' = 'acme 2';
  assert (select status from public.requests where data->>'title' = 'acme 2') = 'approved', 'owner approves';
  insert into public.memberships (workspace_id, email, role) values ('11111111-1111-1111-1111-111111111111','new@acme.test','editor');
  assert (select count(*) from public.memberships) = 3, 'owner added a member';
  assert (select count(*) from public.requests where data->>'title' like 'globex%') = 0, 'owner sees no Globex files';
end $$;

-- Gil (Globex) sees only Globex.
select pg_temp.become('gil@globex.test','bbbbbbbb-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from public.requests) = 1, 'Globex owner sees 1 file';
  assert (select count(*) from public.memberships) = 1, 'Globex owner sees 1 membership';
end $$;

-- Staff sees everything and counts as approver.
select pg_temp.become('staff@colorteam.test','cccccccc-0000-0000-0000-000000000001');
do $$ begin
  assert (select count(*) from public.requests) = 3, 'staff sees all files';
  assert (select count(*) from public.workspaces where slug in ('acme','globex')) = 2, 'staff sees all workspaces';
  assert public.my_role() = 'approver', 'staff count as approver';
  update public.requests set status = 'changes' where data->>'title' = 'globex 1';
end $$;

-- Nobody signed in sees nothing.
select set_config('request.jwt.claims', '', true);
set local role anon;
do $$ begin
  assert (select count(*) from public.requests) = 0, 'anon sees no files';
  assert (select count(*) from public.workspaces) = 0, 'anon sees no workspaces';
end $$;

reset role;
select 'RLS tests passed' as result;
rollback;
