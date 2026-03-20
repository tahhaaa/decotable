alter table public.products
  add column if not exists purchase_price numeric(10,2) not null default 0;

create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  amount numeric(10,2) not null,
  expense_date date not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.expenses enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'expenses' and policyname = 'service role manages expenses'
  ) then
    create policy "service role manages expenses"
    on public.expenses
    for all
    using (true)
    with check (true);
  end if;
end $$;
