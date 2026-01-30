'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { sendGTMEvent } from '@next/third-parties/google';

type PlanLevel = 'starter' | 'pro' | 'fleet';

const PLAN_WEIGHTS: Record<PlanLevel, number> = {
    starter: 1,
    pro: 2,
    fleet: 3
};

interface PlanGuardProps {
    userPlan: string;        // 'starter' | 'pro' | 'fleet'
    minPlan: PlanLevel;      // Minimum plan required
    children: ReactNode;
    fallback?: 'blur' | 'hide'; // Default to blur as per requirements
    blurText?: string;       // Custom CTA text
}

export function PlanGuard({
    userPlan,
    minPlan,
    children,
    fallback = 'blur',
    blurText = "Upgrade to unlock this feature"
}: PlanGuardProps) {
    const currentWeight = PLAN_WEIGHTS[userPlan as PlanLevel] || 0;
    const requiredWeight = PLAN_WEIGHTS[minPlan];

    if (currentWeight >= requiredWeight) {
        return <>{children}</>;
    }

    if (fallback === 'hide') {
        return null;
    }

    // Blurred implementation
    return (
        <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
            {/* Blurred Content */}
            <div className="filter blur-sm opacity-50 pointer-events-none select-none p-4" aria-hidden="true">
                {children}
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-t from-slate-950/90 to-slate-950/20 p-6 text-center">
                <div className="bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl max-w-sm w-full">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                        <Lock className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Feature Locked</h3>
                    <p className="text-sm text-slate-400 mb-6">{blurText}</p>

                    <Button
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                        asChild
                        onClick={() => {
                            sendGTMEvent({ event: 'upgrade_clicked', location: 'plan_guard', plan_required: minPlan });
                        }}
                    >
                        <Link href="/dashboard/billing">
                            Upgrade to {minPlan.charAt(0).toUpperCase() + minPlan.slice(1)}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
