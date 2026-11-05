-- Agent access (MCP) for Max workspaces. Owners (or staff) create keys; only a SHA-256 hash is
-- stored, so the key is shown once. The mcp edge function looks keys up by hash with the service role.

create table public.api_keys (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name         text not null,
  prefix       text not null,              -- first characters, to recognise a key in the list
  key_hash     text not null unique,       -- hex sha256 of the full key
  created_by   text not null,              -- email; posts made with the key are filed under this person
  created_uid  uuid,
  created_at   timestamptz not null default now(),
  last_used_at timestamptz,
  revoked_at   timestamptz
);
alter table public.api_keys enable row level security;
create policy "api_keys: owners and staff read" on public.api_keys for select
  using (public.is_staff() or public.member_role(workspace_id) = 'owner');
-- No insert/update/delete policies: keys change only through the functions below.
grant select on public.api_keys to authenticated;

-- Max (and internal) include agent access; staff can grant it to others with settings.limits.mcp = true.
create or replace function public.has_agent_access(ws uuid) returns boolean
language sql stable security definer set search_path to 'public' as $$
  select coalesce((w.settings->'limits'->>'mcp')::boolean, w.plan in ('max','internal'))
  from public.workspaces w where w.id = ws;
$$;

create or replace function public.create_api_key(ws uuid, key_name text) returns text
language plpgsql security definer set search_path to 'public', 'extensions' as $$
declare k text; who text := public.jwt_email();
begin
  if not (public.is_staff() or public.member_role(ws) = 'owner') then
    raise exception 'Only the workspace owner can create agent keys';
  end if;
  if not public.has_agent_access(ws) then
    raise exception 'Agent access is part of the Max plan';
  end if;
  if (select count(*) from public.api_keys where workspace_id = ws and revoked_at is null) >= 10 then
    raise exception 'This workspace already has 10 active keys. Revoke one first.';
  end if;
  k := 'cts_' || translate(encode(gen_random_bytes(24), 'base64'), '+/=', '-_');
  insert into public.api_keys (workspace_id, name, prefix, key_hash, created_by, created_uid)
  values (ws, left(coalesce(nullif(trim(key_name), ''), 'Agent key'), 60), left(k, 10),
          encode(digest(k, 'sha256'), 'hex'), who, auth.uid());
  return k;
end $$;

create or replace function public.revoke_api_key(key_id uuid) returns void
language plpgsql security definer set search_path to 'public' as $$
declare ws uuid;
begin
  select workspace_id into ws from public.api_keys where id = key_id;
  if ws is null then raise exception 'Key not found'; end if;
  if not (public.is_staff() or public.member_role(ws) = 'owner') then
    raise exception 'Only the workspace owner can revoke agent keys';
  end if;
  update public.api_keys set revoked_at = now() where id = key_id and revoked_at is null;
end $$;

grant execute on function public.has_agent_access(uuid), public.create_api_key(uuid, text), public.revoke_api_key(uuid) to authenticated;
