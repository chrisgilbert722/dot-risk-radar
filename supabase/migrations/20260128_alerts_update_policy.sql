-- Allow users to mark their own alerts as read
create policy "Users update own alerts"
  on public.alerts
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
