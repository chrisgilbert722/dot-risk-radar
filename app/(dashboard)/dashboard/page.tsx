import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { RISK_LEVELS, DASHBOARD_STRINGS, ALERT_TEMPLATES } from '@/lib/constants/messages';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, ShieldAlert, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isPremium, SubscriptionStatus } from '@/lib/subscriptions'; // Import helper logic (Note: server-side fetching differs, effectively re-implemented below for server context)
import { DashboardTracker } from '@/components/dashboard-tracker';

// --- Types & Helpers ---

type RiskItem = {
    id: string;
    dotNumber: string;
    name: string;
    issue: string; // This would map to an ALERT_TEMPLATE in real logic
    date: string; // ISO Date
    level: string;
};

// Mock data fetcher
async function getRiskData() {
    // Simulating data structure with dates
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0];

    return {
        high: [
            { id: '1', dotNumber: '123456', name: 'Fast Freight Inc', issue: 'Risk Level Escalated to High', date: today, level: RISK_LEVELS.HIGH },
            { id: '2', dotNumber: '999999', name: 'Danger Transport', issue: 'Out-of-Service Rate Increase Detected', date: yesterday, level: RISK_LEVELS.HIGH }
        ] as RiskItem[],
        elevated: [
            { id: '3', dotNumber: '789012', name: 'Safe Haulers LLC', issue: 'Significant Risk Score Increase (+15 pts)', date: today, level: RISK_LEVELS.ELEVATED }
        ] as RiskItem[],
        low: [] as RiskItem[]
    };
}

// Date Grouping Logic
function groupByDate(items: RiskItem[]) {
    const today = new Date().toISOString().split('T')[0];
    const groups = {
        today: [] as RiskItem[],
        yesterday: [] as RiskItem[],
        older: [] as RiskItem[],
    };

    items.forEach(item => {
        const itemDate = item.date.split('T')[0];
        if (itemDate === today) groups.today.push(item);
        else if (new Date(itemDate).getTime() >= new Date().getTime() - 86400000 * 2) groups.yesterday.push(item);
        else groups.older.push(item);
    });
    return groups;
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // --- SUBSCRIPTION CHECK (Server-Side) ---
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .single();

    // Status check logic (mimicking isPremium helper but safely on server)
    const status = subscription?.status as SubscriptionStatus;
    const isActive = status === 'active' || status === 'trialing';

    if (!isActive) {
        // Redirect to pricing or a "locked" state. 
        // Ideally this would open the modal, but on server render we redirect to a dedicated pricing page
        // OR we can rely on middleware. For now, redirecting to root with a query param to trigger modal could work,
        // or a dedicated /locked page. 
        // Directive says: "Redirect user to pricing / paywall modal."
        // Since modal is client-side, let's redirect to home with ?pricing=true or similar, 
        // BUT for a clean server-side gate, a dedicated "Upgrade Required" page is safer.
        // Let's assume for this task that redirecting to '/' is the safest fallback to trigger the client experience,
        // unless we built a /pricing page. I'll mock a simple redirect to home for now.
        redirect('/?pricing=true');
    }

    const data = await getRiskData();

    return (
        <div className="min-h-screen bg-slate-950">
            <DashboardTracker />
            {/* Navigation Bar */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight text-white">
                        DOT Risk Radar
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-slate-400">
                            {user.email}
                        </div>
                        <form action="/auth/signout" method="post">
                            <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-white"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign out
                            </Button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="p-6 space-y-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Risk Radar Dashboard
                    </h1>
                    <div className="text-sm text-slate-500">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>

                <RiskSection
                    title={DASHBOARD_STRINGS.HEADERS.HIGH}
                    items={data.high}
                    level={RISK_LEVELS.HIGH}
                    icon={<ShieldAlert className="w-5 h-5" />}
                />

                <RiskSection
                    title={DASHBOARD_STRINGS.HEADERS.ELEVATED}
                    items={data.elevated}
                    level={RISK_LEVELS.ELEVATED}
                    icon={<AlertTriangle className="w-5 h-5" />}
                />

                {/* Low Risk / Monitoring Section */}
                <section aria-label="Monitored Fleets" className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <CheckCircle2 className="w-5 h-5" />
                        <h2 className="text-lg font-semibold tracking-tight">{DASHBOARD_STRINGS.HEADERS.LOW}</h2>
                    </div>
                    <p className="text-sm text-slate-500 italic">All monitored fleets verified within safe limits.</p>
                </section>
            </div>
        </div>
    );
}

function RiskSection({ title, items, level, icon }: { title: string, items: RiskItem[], level: string, icon: any }) {
    if (items.length === 0) {
        return (
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-500">
                    {icon}
                    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-slate-200 text-slate-500 text-sm">
                    {level === RISK_LEVELS.HIGH ? DASHBOARD_STRINGS.EMPTY_STATES.HIGH : DASHBOARD_STRINGS.EMPTY_STATES.ELEVATED}
                </div>
            </section>
        );
    }

    const { today, yesterday, older } = groupByDate(items);

    return (
        <section className="space-y-4">
            <div className={cn("flex items-center gap-2",
                level === RISK_LEVELS.HIGH ? "text-slate-900 dark:text-slate-100" : "text-slate-700"
            )}>
                {icon}
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            </div>

            {today.length > 0 && <DateGroup title="Today" items={today} level={level} />}
            {yesterday.length > 0 && <DateGroup title="Yesterday" items={yesterday} level={level} />}
            {older.length > 0 && <DateGroup title="Last 7 Days" items={older} level={level} />}
        </section>
    )
}

function DateGroup({ title, items, level }: { title: string, items: RiskItem[], level: string }) {
    return (
        <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-slate-400 tracking-wider pl-1">{title}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map(item => <RiskCard key={item.id} risk={item} level={level} />)}
            </div>
        </div>
    )
}

function RiskCard({ risk, level }: { risk: RiskItem, level: string }) {
    // Styles based on risk level - SEMANTIC VARIANTS
    const borderColors: Record<string, string> = {
        [RISK_LEVELS.HIGH]: 'border-rose-200 dark:border-rose-900',
        [RISK_LEVELS.ELEVATED]: 'border-amber-200 dark:border-amber-900',
        [RISK_LEVELS.LOW]: 'border-slate-200',
    };

    // Semantic badge styling (simulating logical variants)
    const badgeClasses: Record<string, string> = {
        [RISK_LEVELS.HIGH]: 'bg-rose-100 text-rose-700 hover:bg-rose-100 dark:bg-rose-900 dark:text-rose-100',
        [RISK_LEVELS.ELEVATED]: 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-100',
        [RISK_LEVELS.LOW]: 'bg-slate-100 text-slate-700',
    };

    return (
        <Card className={`transition-colors duration-300 ease-in-out border ${borderColors[level] || borderColors[RISK_LEVELS.LOW]}`}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium leading-none">
                        {risk.name}
                    </CardTitle>
                    <Badge className={cn("shadow-none", badgeClasses[level] || badgeClasses[RISK_LEVELS.LOW])}>{level}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">DOT: {risk.dotNumber}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="text-sm">
                    <p className="font-medium">{risk.issue}</p>
                    <p className="text-xs text-muted-foreground mt-1">Updated: {risk.date}</p>
                </div>
                <div className="flex justify-end">
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-slate-100 dark:hover:bg-slate-800">
                        {DASHBOARD_STRINGS.ACTIONS.ACKNOWLEDGE}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
