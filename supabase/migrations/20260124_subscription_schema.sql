-- Migration: 20260124_subscription_schema
-- Description: Adds subscriptions table to track Stripe subscription status linked to auth.users

create table if not exists public.subscriptions (
  user_id uuid references auth.users not null primary key,
  status text check (status in ('active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing')) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Policies
-- Allow users to view their own subscription
create policy "Users can view own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- Allow service role (e.g. webhooks) to manage all subscriptions
create policy "Service role can manage subscriptions"
  on public.subscriptions
  for all
  to service_role
  using (true);

-- Function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for updated_at
create trigger handle_updated_at
  before update on public.subscriptions
  for each row
  execute procedure public.handle_updated_at();
