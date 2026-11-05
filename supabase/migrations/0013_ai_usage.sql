-- AI features (kit pre-fill, copy assist, month plans) go through the `ai` edge function, which logs every
-- call here and stops a workspace at a daily cap (AI_DAILY_LIMIT, default 100) so costs stay bounded.
create table if not exists public.ai_usage (
  id            bigserial primary key,
  workspace_id  uuid not null references public.workspaces(id) on delete cascade,
  email         text,
  action        text not null,
  model         text,
  input_tokens  int not null default 0,
  output_tokens int not null default 0,
  ok            boolean not null default true,
  at            timestamptz not null default now()
);
create index if not exists ai_usage_ws_at on public.ai_usage (workspace_id, at desc);
alter table public.ai_usage enable row level security;
create policy "ai_usage: staff read" on public.ai_usage for select using (public.is_staff());
-- Inserts come from the edge function with the service role only.
