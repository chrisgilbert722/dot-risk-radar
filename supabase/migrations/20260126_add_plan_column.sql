-- Migration: 20260126_add_plan_column
-- Description: Adds plan column to subscriptions table to track plan type (starter, pro, fleet)

alter table public.subscriptions 
add column if not exists plan text check (plan in ('starter', 'pro', 'fleet'));
