drop policy if exists "users create orders" on public.orders;

create policy "users create orders"
on public.orders
for insert
with check (
  auth.uid() = user_id
  or user_id is null
  or auth.role() = 'authenticated'
);

drop policy if exists "users create own order items" on public.order_items;

create policy "users create own order items"
on public.order_items
for insert
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and (
        orders.user_id = auth.uid()
        or orders.user_id is null
        or auth.role() = 'authenticated'
      )
  )
);
