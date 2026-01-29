import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Bell, Filter, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RiskCard, RiskItem } from '@/components/risk-card';
import { RISK_LEVELS } from '@/lib/constants/messages';
import { AlertsView } from '@/components/alerts-view';

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
                <AlertsView initialAlerts={alerts} planName={planName} />
            </div>
        </div>
    );
}
