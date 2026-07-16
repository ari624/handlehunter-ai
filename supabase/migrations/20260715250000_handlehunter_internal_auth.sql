begin;

create table if not exists public.app_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;
revoke all privileges on table public.app_config from public, anon, authenticated;
grant all privileges on table public.app_config to service_role;

commit;
