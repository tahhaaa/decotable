create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'profiles' and policyname = 'admins read profiles'
  ) then
    create policy "admins read profiles" on public.profiles for select using (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'categories' and policyname = 'admins manage categories'
  ) then
    create policy "admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'products' and policyname = 'admins manage products'
  ) then
    create policy "admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'cities' and policyname = 'admins manage cities'
  ) then
    create policy "admins manage cities" on public.cities for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'promotions' and policyname = 'admins manage promotions'
  ) then
    create policy "admins manage promotions" on public.promotions for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'orders' and policyname = 'admins manage orders'
  ) then
    create policy "admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'order_items' and policyname = 'admins manage order items'
  ) then
    create policy "admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'expenses' and policyname = 'admins manage expenses'
  ) then
    create policy "admins manage expenses" on public.expenses for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'page_views' and policyname = 'admins read traffic'
  ) then
    create policy "admins read traffic" on public.page_views for select using (public.is_admin());
  end if;
end $$;
