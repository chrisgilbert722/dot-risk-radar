-- Migration: 20260128_create_subscriptions_table
-- Description: Creates the subscriptions table for Stripe billing persistence (CRITICAL FIX)

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  price_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookups by user (entitlement checks)
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Policies
create policy "Users can view own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

create policy "Service role can manage subscriptions"
  on public.subscriptions
  for all
  to service_role
  using (true);

-- Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
  before update on public.subscriptions
  for each row
  execute procedure public.handle_updated_at();
