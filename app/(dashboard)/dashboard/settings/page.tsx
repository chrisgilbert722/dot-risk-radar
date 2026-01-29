import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Settings, User } from 'lucide-react';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Settings className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
                    <p className="text-slate-400">Manage your account preferences.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
                            <p className="text-slate-400">{user.email}</p>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-center text-slate-500 italic">
                        Additional settings coming soon.
                    </div>
                </div>
            </div>
        </div>
    );
}
