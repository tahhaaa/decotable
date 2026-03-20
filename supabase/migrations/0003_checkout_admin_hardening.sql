do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'users create own order items'
  ) then
    create policy "users create own order items"
    on public.order_items
    for insert
    with check (
      exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and (orders.user_id = auth.uid() or orders.user_id is null)
      )
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'order_items' and policyname = 'users read own order items'
  ) then
    create policy "users read own order items"
    on public.order_items
    for select
    using (
      exists (
        select 1
        from public.orders
        where orders.id = order_items.order_id
          and (orders.user_id = auth.uid() or orders.user_id is null)
      )
    );
  end if;
end $$;

create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_cities_name on public.cities(name);
