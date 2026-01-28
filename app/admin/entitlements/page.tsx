import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function getAdminData() {
    const supabase = await createClient();

    // 1. Fetch all users (from auth - restricted to service role usually, but here we query public profiles if they exist or just rely on subscription table distinct user_ids)
    // To list ALL users properly we might need service role client or access to auth.users which is restricted.
    // For Debug MVP, let's query the `subscriptions` table as the primary source of "users who matter" (paid users).

    // Fetch user entitlement data
    const { data: subscriptions, error: subError } = await supabase
        .from('subscriptions')
        .select('*');

    if (subError) throw subError;

    // Fetch monitoring data
    const { data: monitored, error: monError } = await supabase
        .from('monitored_dots')
        .select('*');

    if (monError) throw monError;

    // Fetch alert counts
    const { data: alerts, error: alertError } = await supabase
        .from('alerts')
        .select('user_id, is_read');

    if (alertError) throw alertError;

    // Helper to aggregate data per user
    const usersMap = new Map();

    // Initialize with subscription users
    subscriptions?.forEach(sub => {
        usersMap.set(sub.user_id, {
            userId: sub.user_id,
            email: 'Unknown (Auth Restricted)', // We can't easily get email without admin API or profiles table
            subscription: sub,
            monitoredDots: [],
            alertCount: 0,
            unreadAlertCount: 0
        });
    });

    // Attach monitored dots
    monitored?.forEach(dot => {
        const user = usersMap.get(dot.user_id);
        if (user) {
            user.monitoredDots.push(dot.dot_number);
        } else {
            // User has monitored DOTs but no subscription row? Interesting edge case.
            usersMap.set(dot.user_id, {
                userId: dot.user_id,
                email: 'Unknown (No Sub)',
                subscription: null,
                monitoredDots: [dot.dot_number],
                alertCount: 0,
                unreadAlertCount: 0
            });
        }
    });

    // Attach alerts
    alerts?.forEach(alert => {
        const user = usersMap.get(alert.user_id);
        if (user) {
            user.alertCount++;
            if (!alert.is_read) user.unreadAlertCount++;
        }
    });

    return Array.from(usersMap.values());
}

export default async function AdminEntitlementsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // SIMPLE ADMIN GUARD (Replace with real RBAC later)
    // Ideally user.email should be checked against an env var list
    // For now, require auth atleast.
    if (!user) {
        redirect('/login');
    }

    // Check for admin entitlement (e.g. specific env var or hardcoded for dev)
    // if (user.email !== process.env.ADMIN_EMAIL) return <div>Unauthorized</div>;

    const stats = await getAdminData();

    return (
        <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Admin: Entitlements & Monitoring Debug</h1>

                <form action="/api/monitoring/run" method="POST" target="_blank">
                    <Button variant="destructive" type="submit">
                        Trigger Monitoring Run (Manual)
                    </Button>
                </form>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>User Status Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Subscription Status</TableHead>
                                <TableHead>Billing Period</TableHead>
                                <TableHead>Monitored DOTs</TableHead>
                                <TableHead>Alerts (Unread)</TableHead>
                                <TableHead>Entitlement</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.map((user: any) => {
                                const isSubActive = user.subscription?.status === 'active';
                                const activeDots = user.monitoredDots.length;
                                const entitleStatus = isSubActive ? 'ACTIVE' : user.subscription?.status === 'past_due' ? 'PAST_DUE' : 'INACTIVE';

                                return (
                                    <TableRow key={user.userId}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{user.userId}</TableCell>
                                        <TableCell>
                                            {user.subscription ? (
                                                <Badge variant={isSubActive ? 'default' : 'secondary'}>
                                                    {user.subscription.status}
                                                </Badge>
                                            ) : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {user.subscription?.current_period_end
                                                ? new Date(user.subscription.current_period_end).toLocaleDateString()
                                                : <span className="text-muted-foreground text-xs italic">N/A</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold">{activeDots} DOTs</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.monitoredDots.slice(0, 5).map((d: string) => (
                                                        <Badge key={d} variant="outline" className="text-xs px-1 py-0">{d}</Badge>
                                                    ))}
                                                    {activeDots > 5 && <span className="text-xs text-muted-foreground">+{activeDots - 5} more</span>}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.alertCount} (<span className="text-red-500 font-bold">{user.unreadAlertCount}</span>)
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={entitleStatus === 'ACTIVE' ? 'outline' : 'destructive'} className={entitleStatus === 'ACTIVE' ? 'border-green-500 text-green-500' : ''}>
                                                {entitleStatus}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
