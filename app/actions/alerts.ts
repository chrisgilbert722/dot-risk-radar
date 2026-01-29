'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markAlertAsRead(alertId: string) {
    const supabase = await createClient()

    // Verify user owns the alert via RLS, but explicit check doesn't hurt if we wanted.
    // RLS "Users update own alerts" policy is needed? 
    // Wait, I only created "Users view own alerts" policy in the migration.
    // I need to add an update policy or the update will fail.

    // Checking migration... 
    // create policy "Users view own alerts" on public.alerts for select using (auth.uid() = user_id);
    // I need an UPDATE policy.

    // Actually, I should probably add the policy via migration or run a SQL command. 
    // However, I can't run SQL directly. 
    // I'll assume I have to add the policy. The user said "do not modify monitoring logic", but enabling the UI requires RLS permission.
    // I will check if I can just use `supabaseAdmin` (service role) inside the action?
    // Server actions run on server. `createClient` uses cookie auth (user context).
    // If I use user context, I need RLS.
    // If I use service role, I bypass RLS.
    // Service role is safer to ensure it works without migration churn right now, 
    // BUT `createClient` in `lib/supabase/server` typically returns the cookie-based client.

    // Let's rely on adding the policy. It's the "Right Way".
    // Or I can use service role in the action?
    // `import { createClient } from '@supabase/supabase-js'` and use env vars.

    // The user prompt constraints: "Do not modify monitoring logic, billing, or Stripe". 
    // It didn't explicitly forbid DB schema tweaks for UI functionality (like RLS).
    // But to be safe and fast, I will just use the service role key for the `markRead` action if possible, 
    // OR I'll assume I need to create a migration for the policy.
    // A migration is cleaner.

    // Wait, "Do not modify monitoring logic...".
    // Adding an RLS policy is technically schema. 
    // Let's check `lib/supabase/server.ts` to see if it allows service role. Usually not.

    // I'll create a small migration for the RLS policy Update.
    // "20260128_alerts_rls.sql"

    // Update: I'll write the action using `createClient` (user auth). 
    // And I will ALSO create a migration file to allow users to update their own alerts.

    // Let's write the action first.
    const { error } = await supabase
        .from('alerts')
        .update({ is_read: true })
        .eq('id', alertId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id!) // RLS should handle this, but safe to be explicit

    if (error) {
        console.error('Failed to mark alert read:', error)
        throw new Error('Failed to update alert')
    }

    revalidatePath('/dashboard')
}
