import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch subscription details for the sidebar
    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('plan')
        .eq('user_id', user.id)
        .single();

    const planName = subscription?.plan || 'starter';

    return (
        <div className="flex h-screen bg-slate-950">
            <DashboardSidebar userEmail={user.email!} planName={planName} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
