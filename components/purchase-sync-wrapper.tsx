'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardTracker } from '@/components/dashboard-tracker';
import { createClient } from '@/lib/supabase/client';
import { Loader2, ShieldCheck } from 'lucide-react';

export function PurchaseSyncWrapper() {
    const router = useRouter();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const checkSubscription = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // Should technically not happen if we are here, but safe guard
                router.replace('/login');
                return;
            }

            // Polling loop
            const interval = setInterval(async () => {
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select('status')
                    .eq('user_id', user.id)
                    .single();

                const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';

                if (isActive) {
                    clearInterval(interval);
                    // Force rigorous hard refresh to ensure server components verify
                    window.location.href = '/dashboard';
                }
            }, 1000); // Check every second

            // Timeout after 15 seconds to prevent infinite loop
            setTimeout(() => {
                clearInterval(interval);
                // If it timed out, let the user go to dashboard (which might redirect to pricing, but at least breaks the loop)
                // Or stay here with an error. Redirecting to pricing is probably safer default.
                window.location.href = '/dashboard';
            }, 15000);

            return () => clearInterval(interval);
        };

        checkSubscription();
    }, [router]);

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            {/* Analytics Tracking Component */}
            <DashboardTracker />

            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Finalizing Subscription</h2>
            <p className="text-slate-400 mb-8 max-w-sm">
                We're syncing your payment with the risk engine. This usually takes just a moment.
            </p>

            <div className="flex items-center gap-3 text-slate-500 font-mono text-sm uppercase tracking-wider">
                <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                Wait for green light...
            </div>
        </div>
    );
}
