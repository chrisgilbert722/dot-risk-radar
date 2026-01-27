'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { sendGTMEvent } from '@next/third-parties/google';

const PLAN_VALUES: Record<string, number> = {
    'starter': 49,
    'pro': 119,
    'fleet': 249
};

export function DashboardTracker() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) return;

        // Check for purchase success
        if (searchParams.get('success') === 'true') {
            const plan = searchParams.get('plan') || 'unknown';
            const value = PLAN_VALUES[plan] || 0;

            sendGTMEvent({
                event: 'purchase',
                value: value,
                currency: 'USD',
                plan: plan,
                transaction_id: `tx_${Date.now()}` // Fallback since we don't have real ID client-side easily without exposing it
            });

            processedRef.current = true;

            // Optional: Cleanup URL
            // const params = new URLSearchParams(searchParams.toString());
            // params.delete('success');
            // params.delete('plan');
            // router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, router, pathname]);

    return null;
}
