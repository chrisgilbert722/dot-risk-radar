import { createClient } from '@/lib/supabase/server';

export async function requireActiveSubscription(userId: string) {
    if (!userId) {
        throw new Error('AUTH_REQUIRED');
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .single();

    if (error || !data || data.status !== 'active') {
        throw new Error('SUBSCRIPTION_REQUIRED');
    }

    return true;
}
