
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export type SubscriptionStatus =
    | "active"
    | "past_due"
    | "unpaid"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | null;

export interface Subscription {
    user_id: string;
    status: SubscriptionStatus;
    current_period_end: string;
}

/**
 * Hook to get the current user's subscription status.
 * Returns: { subscription, loading, error }
 */
export function useSubscription() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function fetchSubscription() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setSubscription(null);
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found', which is valid for non-subscribers
                    throw error;
                }

                setSubscription(data as Subscription);
            } catch (err) {
                console.error("Error fetching subscription:", err);
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscription();
    }, []);

    const [user, setUser] = useState<any>(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    return { subscription, loading, error, user };
}

/**
 * Helper to check if a user acts as a "subscriber" based on status.
 * Returns true if the user should have access to premium features.
 */
export function isPremium(status: SubscriptionStatus): boolean {
    return status === 'active' || status === 'trialing';
}
