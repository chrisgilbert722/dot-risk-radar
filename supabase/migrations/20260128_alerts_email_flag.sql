-- Add email tracking to alerts
alter table public.alerts 
add column if not exists is_emailed boolean default false;
