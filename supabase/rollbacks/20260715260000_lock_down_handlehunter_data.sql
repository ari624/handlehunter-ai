begin;

grant select, insert on table public.searches to anon, authenticated;
grant select, insert, update on table public.orders to anon, authenticated;

create policy "Allow anonymous insert searches" on public.searches
  for insert to public with check (true);
create policy "Allow anonymous read searches" on public.searches
  for select to public using (true);
create policy "Allow anonymous insert orders" on public.orders
  for insert to public with check (true);
create policy "Allow anonymous read orders" on public.orders
  for select to public using (true);
create policy "Allow anonymous update orders" on public.orders
  for update to public using (true);

commit;
