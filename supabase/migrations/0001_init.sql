create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  short_description text not null,
  description text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  inventory integer not null default 0,
  featured boolean not null default false,
  images text[] not null default '{}',
  tags text[] not null default '{}',
  materials text[] not null default '{}',
  dimensions text,
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  price numeric(10,2) not null,
  estimated_time text not null
);

create table if not exists public.promotions (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  label text not null,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10,2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  phone text not null,
  city_id uuid references public.cities(id),
  address text not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.carts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  subscription jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.page_views (
  id uuid primary key default uuid_generate_v4(),
  path text not null,
  referrer text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.cities enable row level security;
alter table public.promotions enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.carts enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.page_views enable row level security;

create policy "public can read catalog" on public.categories for select using (true);
create policy "public can read products" on public.products for select using (true);
create policy "public can read cities" on public.cities for select using (true);
create policy "public can read promotions" on public.promotions for select using (active = true);
create policy "public can read reviews" on public.reviews for select using (true);

create policy "users manage own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "users manage own orders" on public.orders for select using (auth.uid() = user_id);
create policy "users create orders" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "users manage own wishlist" on public.wishlist for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "users manage own cart" on public.carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users manage own push subscriptions" on public.push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "service role tracks traffic" on public.page_views for insert with check (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
