import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bell, Filter, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskCard, RiskItem } from '@/components/risk-card';
import { RISK_LEVELS } from '@/lib/constants/messages';

// Mock data fetcher (Duplicated for Phase 1.7 presentation)
async function getAlertsData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 604800000).toISOString().split('T')[0];

    return [
        {
            id: '1',
            dotNumber: '123456',
            name: 'Fast Freight Inc',
            issue: 'Risk Level Escalated to High',
            date: today,
            level: 'critical', // Mapping to RiskCard logic
            changeLabel: '+15 pts Risk Score',
            changeType: 'negative'
        },
        {
            id: '2',
            dotNumber: '999999',
            name: 'Danger Transport',
            issue: 'Out-of-Service Rate Increase Detected',
            date: yesterday,
            level: 'critical',
            changeLabel: '+2.4% OOS Rate',
            changeType: 'negative'
        },
        {
            id: '3',
            dotNumber: '789012',
            name: 'Safe Haulers LLC',
            issue: 'New Inspection Report with Violations',
            date: today,
            level: 'warning',
            changeLabel: 'New Inspection',
            changeType: 'neutral'
        },
        // Acknowledged Item
        {
            id: '4',
            dotNumber: '555123',
            name: 'Reliable Logistics',
            issue: 'Driver Medical Cert Expired',
            date: lastWeek,
            level: 'low', // Treated as acknowledged/resolved contextually
            changeLabel: 'Resolved',
            changeType: 'positive',
            isAcknowledged: true
        }
    ] as (RiskItem & { isAcknowledged?: boolean })[];
}

export default async function AlertsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch subscription for plan context (if needed for cards)
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();

    const planName = subscription?.plan || 'starter';
    const alerts = await getAlertsData();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <Bell className="w-6 h-6 text-indigo-500" />
                            All Alerts
                        </h1>
                        <p className="text-sm text-slate-400 mt-1 ml-8">
                            Review and manage operational risk notifications.
                        </p>
                    </div>
                </div>
            </header>

            <div className="p-8 max-w-[1920px] mx-auto">
                {/* Visual Filters */}
                <div className="flex flex-wrap items-center gap-2 mb-8 p-1 bg-slate-900/50 rounded-lg border border-slate-800 w-fit">
                    <Button variant="secondary" size="sm" className="bg-slate-800 text-white hover:bg-slate-700 shadow-sm">
                        All Alerts
                        <Badge className="ml-2 bg-slate-700 text-slate-300 hover:bg-slate-600 border-none">{alerts.length}</Badge>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30" disabled>
                        High Priority
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-amber-400 hover:bg-amber-950/30" disabled>
                        Elevated
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/30" disabled>
                        Acknowledged
                    </Button>
                </div>

                {/* Alerts List */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {alerts.map((item) => (
                        <RiskCard
                            key={item.id}
                            risk={item}
                            level={item.level as any}
                            planName={planName}
                        // Note: RiskCard might need visual adjustment for 'Acknowledged' state if passed specifically, 
                        // but currently it renders based on level. We can assume 'low' or passing a specific prop if RiskCard supported it.
                        // For this pass, we use existing RiskCard.
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
