-- Migration: 20260128_monitoring_schema
-- Description: Core tables for monitoring engine (snapshots, diffs, alerts) and user watchlists

-- 1. Monitored DOTs (Watchlist)
-- Links users to the DOTs they want to track
create table if not exists public.monitored_dots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  dot_number text not null,
  created_at timestamptz default now(),
  
  -- Each user can monitor a DOT only once
  unique(user_id, dot_number)
);

-- Index for finding all users watching a specific DOT (critical for fan-out alerts)
create index if not exists idx_monitored_dots_dot on public.monitored_dots(dot_number);


-- 2. DOT Snapshots (Frequency: Daily/Per Run)
-- Stores historical raw data to enable diffing
create table if not exists public.dot_snapshots (
  id uuid default gen_random_uuid() primary key,
  dot_number text not null,
  
  -- content hashing for fast "no change" checks
  snapshot_hash text not null, 
  
  -- complete FMCSA payload at this point in time
  raw_data jsonb not null,
  
  created_at timestamptz default now()
);

-- Index for retrieving the "latest" snapshot efficiently
create index if not exists idx_dot_snapshots_latest 
  on public.dot_snapshots(dot_number, created_at desc);


-- 3. Alerts
-- Generated when a diff exceeds thresholds
create table if not exists public.alerts (
  id uuid default gen_random_uuid() primary key,
  
  user_id uuid not null references auth.users(id) on delete cascade,
  dot_number text not null,
  
  alert_type text not null check (
    alert_type in ('risk_increase', 'oos_spike', 'inspection', 'violation')
  ),
  
  summary text not null,
  
  -- Read status for UI
  is_read boolean default false,
  
  created_at timestamptz default now()
);

-- Index for user feed
create index if not exists idx_alerts_user_created 
  on public.alerts(user_id, created_at desc);

-- RLS Policies
alter table public.monitored_dots enable row level security;
alter table public.dot_snapshots enable row level security;
alter table public.alerts enable row level security;

-- Monitored Dots: Users manage their own
create policy "Users manage own watchlist"
  on public.monitored_dots
  for all
  using (auth.uid() = user_id);

-- Snapshots: Viewable by anyone (or restrict? public data essentially)
-- Let's restrict to authenticated for now to match dot_profiles
create policy "Auth users view snapshots"
  on public.dot_snapshots
  for select
  to authenticated
  using (true);

-- Alerts: Users view their own
create policy "Users view own alerts"
  on public.alerts
  for select
  using (auth.uid() = user_id);
