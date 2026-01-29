import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RISK_LEVELS, DASHBOARD_STRINGS } from '@/lib/constants/messages';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, ShieldAlert, LogOut, Zap, LayoutDashboard, Clock } from 'lucide-react';
import { requireActiveSubscription } from '@/lib/billing/requireActiveSubscription';
import { DashboardTracker } from '@/components/dashboard-tracker';
import { PurchaseSyncWrapper } from '@/components/purchase-sync-wrapper';
import { AlertsFeed } from '@/components/alerts-feed';
import { RiskCard, RiskItem } from '@/components/risk-card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FleetSummaryCard } from '@/components/fleet-summary-card';

// --- Types & Helpers ---

// Mock data fetcher with strict Intelligence Data
async function getRiskData() {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    return {
        high: [
            {
                id: '1',
                dotNumber: '123456',
                name: 'Fast Freight Inc',
                issue: 'Risk Level Escalated to High',
                date: today,
                level: RISK_LEVELS.HIGH,
                changeLabel: '+15 pts Risk Score',
                changeType: 'negative'
            },
            {
                id: '2',
                dotNumber: '999999',
                name: 'Danger Transport',
                issue: 'Out-of-Service Rate Increase Detected',
                date: yesterday,
                level: RISK_LEVELS.HIGH,
                changeLabel: '+2.4% OOS Rate',
                changeType: 'negative'
            }
        ] as RiskItem[],
        elevated: [
            {
                id: '3',
                dotNumber: '789012',
                name: 'Safe Haulers LLC',
                issue: 'New Inspection Report with Violations',
                date: today,
                level: RISK_LEVELS.ELEVATED,
                changeLabel: 'New Inspection',
                changeType: 'neutral'
            }
        ] as RiskItem[],
    };
}

// Next.js 15: searchParams is async
type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: Props) {
    const resolvedParams = await searchParams;
    const isSuccess = resolvedParams.success === 'true';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // --- SUBSCRIPTION CHECK (Server-Side) ---
    try {
        await requireActiveSubscription(user.id);
    } catch (error) {
        if (isSuccess) {
            return <PurchaseSyncWrapper />;
        }
        redirect('/?pricing=true');
    }

    // Fetch subscription details for UI
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan, status')
        .eq('user_id', user.id)
        .single();

    const planName = subscription?.plan === 'fleet' ? 'Fleet Plan' : subscription?.plan === 'pro' ? 'Pro Plan' : 'Starter Plan';
    const planKey = subscription?.plan || 'starter';

    // --- FETCH DATA ---
    const { data: alerts } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    const data = await getRiskData();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
            <DashboardTracker />

            {/* Header Area */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40 px-8 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-indigo-500" />
                        Operational Overview
                    </h1>
                    <p className="text-sm text-slate-400 mt-1 ml-8">
                        Monitoring {subscription?.plan === 'fleet' ? 'unlimited' : 'active'} fleets • Updated {new Date().toLocaleTimeString()}
                    </p>
                </div>

                {subscription?.plan !== 'fleet' && (
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95" asChild>
                        <a href="/dashboard/billing">
                            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                            Upgrade to Fleet
                        </a>
                    </Button>
                )}
            </header>

            <div className="p-8 max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content Area (Risk Cards) */}
                <main className="lg:col-span-8 xl:col-span-9 space-y-10">

                    {/* Phase 1.5 Polish: Fleet Summary Card */}
                    <FleetSummaryCard score="Good" riskCount={data.high.length + data.elevated.length} />

                    {/* High Risk Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-5 px-1">
                            <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]">
                                <ShieldAlert className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-white">High Priority Risks</h2>
                                <p className="text-xs text-slate-500">Immediate attention required</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {data.high.length > 0 ? (
                                data.high.map(item => (
                                    <RiskCard key={item.id} risk={item} level={RISK_LEVELS.HIGH} planName={planKey} />
                                ))
                            ) : (
                                <div className="col-span-full p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center text-slate-500">
                                    No high priority risks detected.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Elevated Risk Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-5 px-1">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-white">Elevated Risks</h2>
                                <p className="text-xs text-slate-500">Monitor closely for changes</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {data.elevated.length > 0 ? (
                                data.elevated.map(item => (
                                    <RiskCard key={item.id} risk={item} level={RISK_LEVELS.ELEVATED} planName={planKey} />
                                ))
                            ) : (
                                <div className="col-span-full p-8 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-center text-slate-500">
                                    No elevated risks detected.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Recent Activity Feed */}
                    <section className="pt-8 border-t border-slate-800/50">
                        <div className="flex items-center gap-3 mb-5 px-1">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <h2 className="text-lg font-bold tracking-tight text-white">Recent Activity Log</h2>
                        </div>
                        <AlertsFeed initialAlerts={alerts || []} />
                    </section>
                </main>

                {/* Right Sidebar Area */}
                <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                    {/* Subscription Card */}
                    <div className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-xl">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Current Plan</h3>
                                <div className="text-2xl font-bold text-white mt-1">{planName}</div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Monitoring Engine</span>
                                <span className="text-slate-200">Online</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Next Billing</span>
                                <span className="text-slate-200">Auto-renew</span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors" asChild>
                            <a href="/dashboard/billing">Manage Subscription</a>
                        </Button>
                    </div>

                    {/* Status Card */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse absolute top-0 right-0"></div>
                                <ShieldAlert className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="font-semibold text-white">System Status</h3>
                        </div>
                        <div className="space-y-3 text-sm text-slate-400">
                            <p>All monitoring systems operational.</p>
                            <p>FMCSA connection stable.</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
