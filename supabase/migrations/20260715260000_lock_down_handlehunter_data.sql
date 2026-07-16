begin;

alter table public.searches enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Allow anonymous insert searches" on public.searches;
drop policy if exists "Allow anonymous read searches" on public.searches;
drop policy if exists "Allow anonymous insert orders" on public.orders;
drop policy if exists "Allow anonymous read orders" on public.orders;
drop policy if exists "Allow anonymous update orders" on public.orders;

revoke all privileges on table public.searches, public.orders
  from public, anon, authenticated;
grant all privileges on table public.searches, public.orders to service_role;

commit;
