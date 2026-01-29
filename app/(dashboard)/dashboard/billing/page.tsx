import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Pricing Plans Data
const PLANS = [
    {
        name: 'Starter',
        price: 49,
        key: 'starter',
        features: ['Real-time Risk Monitoring', 'Daily DOT Snapshots', 'Basic Email Alerts', '1 User Seat'],
    },
    {
        name: 'Pro',
        price: 119,
        key: 'pro',
        popular: true,
        features: ['Everything in Starter', '90-Day History & Trends', 'Detailed Violation Analysis', 'Priority Email Support', '3 User Seats'],
    },
    {
        name: 'Fleet',
        price: 249,
        key: 'fleet',
        features: ['Everything in Pro', 'Multi-DOT Monitoring', 'Unlimited Users', 'API Access', 'Dedicated Account Manager'],
    },
];

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    const currentPlanKey = subscription?.plan || 'starter'; // Default to starter styling if no sub, though app forces active usually
    const isSubActive = subscription?.status === 'active';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 text-slate-100">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-white">Billing & Plans</h1>
                <p className="text-slate-400">Manage your subscription and billing details.</p>
            </div>

            {/* Current Plan Status */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h2 className="text-lg font-semibold text-white mb-1">Current Subscription</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-indigo-400 capitalize">{currentPlanKey === 'fleet' ? 'Fleet' : currentPlanKey === 'pro' ? 'Pro' : 'Starter'} Plan</span>
                        {isSubActive ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
                        ) : (
                            <Badge variant="destructive">Inactive</Badge>
                        )}
                    </div>
                    {isSubActive && <p className="text-sm text-slate-500 mt-2">Renews automatically on {new Date().toLocaleDateString()}</p>}
                </div>

                <div className="flex gap-3">
                    {/* In a real app, this would use Stripe Customer Portal */}
                    <form action="/api/stripe/create-portal-session" method="POST">
                        <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            Manage Payment Method
                        </Button>
                    </form>
                </div>
            </div>

            {/* Plan Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {PLANS.map((plan) => {
                    const isCurrent = currentPlanKey === plan.key;
                    // For upgrading, we would use the checkout session creation
                    // This assumes we have a route or action to handle upgrades
                    return (
                        <Card key={plan.key} className={`bg-slate-950 border-slate-800 relative flex flex-col ${isCurrent ? 'ring-2 ring-indigo-500' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                                    <Badge className="bg-indigo-600 text-white border-none">Most Popular</Badge>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                                <CardDescription className="text-slate-400">
                                    <span className="text-3xl font-bold text-white">${plan.price}</span>/mo
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <ul className="space-y-2.5">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {isCurrent ? (
                                    <Button className="w-full bg-slate-800 text-slate-400 cursor-default hover:bg-slate-800" disabled>
                                        Current Plan
                                    </Button>
                                ) : (
                                    // Trigger Checkout - reuse the existing Stripe flow logic
                                    <form action="/api/stripe/create-checkout-session" method="POST" className="w-full">
                                        <input type="hidden" name="priceId" value={
                                            // Mapping price IDs (using placeholders or env vars in real app)
                                            plan.key === 'starter' ? process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER :
                                                plan.key === 'pro' ? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO :
                                                    process.env.NEXT_PUBLIC_STRIPE_PRICE_FLEET
                                        } />
                                        <input type="hidden" name="planKey" value={plan.key} />
                                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                            {plan.price > (PLANS.find(p => p.key === currentPlanKey)?.price || 0) ? 'Upgrade' : 'Downgrade'}
                                        </Button>
                                    </form>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
