import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AlertsFeed } from '@/components/alerts-feed';
import { RISK_LEVELS } from '@/lib/constants/messages';
import { Bell } from 'lucide-react';

export default async function AlertsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: alerts } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-100 h-full">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <Bell className="w-6 h-6 text-indigo-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Alerts & Notifications</h1>
                    <p className="text-slate-400">Review all historical alerts and risk signals.</p>
                </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 p-6 min-h-[500px]">
                <AlertsFeed initialAlerts={alerts || []} />
            </div>
        </div>
    );
}
