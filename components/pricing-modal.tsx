import * as React from "react"
import { Check, ShieldCheck, Zap, Building, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface PricingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: 29,
        priceId: 'price_1StVvK2a1UrjaUn8meEwu1yt',
        features: [
            'Basic Risk Monitoring',
            'Weekly ISS Score Updates',
            'Last 5 Inspections',
        ],
        icon: Truck,
        color: 'text-slate-400',
        borderColor: 'border-slate-800'
    },
    {
        id: 'pro',
        name: 'Professional',
        price: 49,
        priceId: 'price_1StVza2a1UrjaUn8KwLOfodR',
        popular: true,
        features: [
            'Real-time ISS Score Tracking',
            'Predictive Audit Risk Alerts',
            'Unlimited Inspection History',
            'Compare vs National Averages',
        ],
        icon: ShieldCheck,
        color: 'text-amber-500',
        borderColor: 'border-amber-500/50'
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 79,
        priceId: 'price_1StW2A2a1UrjaUn872axtPVG',
        features: [
            'Everything in Professional',
            'Multi-DOT Management',
            'API Access',
            'Priority Support',
        ],
        icon: Building,
        color: 'text-emerald-500',
        borderColor: 'border-emerald-500/30'
    }
];

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
    const [selectedPlan, setSelectedPlan] = React.useState<string>('pro');
    const [loading, setLoading] = React.useState(false);

    const handleSubscribe = async () => {
        setLoading(true);
        const plan = PLANS.find(p => p.id === selectedPlan);
        if (!plan) return;

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: plan.priceId,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create checkout session');
            }

            const { url } = await response.json();
            if (url) {
                window.location.href = url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    // Reset selection on close
    React.useEffect(() => {
        if (!open) {
            setSelectedPlan('pro');
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-slate-950 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-4 mb-4">
                    <DialogTitle className="text-2xl font-bold text-center flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-6 h-6 text-amber-500" />
                        </div>
                        Unlock Full Risk Intelligence
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400 text-base max-w-lg mx-auto">
                        Choose a plan to see your full Inspection history, OOS trends, and predictive audit risk analysis.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-5xl mx-auto">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-6 rounded-xl border relative overflow-hidden cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                                ? `bg-slate-900 ${plan.borderColor} ring-1 ring-inset ${plan.color.replace('text-', 'ring-')}`
                                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-brand-dark text-[11px] font-bold uppercase rounded-bl-xl z-10 tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-4">
                                    <plan.icon className={`w-8 h-8 ${plan.color}`} />
                                    <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                                </div>
                                <div className={`text-right ${plan.popular ? 'pt-10' : ''}`}>
                                    <div className="flex items-baseline justify-end">
                                        <span className={`text-3xl font-bold font-mono text-white`}>${plan.price}</span>
                                        <span className="text-sm text-slate-500 font-sans ml-1">/mo</span>
                                    </div>
                                </div>
                            </div>

                            <ul className="space-y-3 text-sm text-slate-300">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className="leading-tight">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pb-2">
                    <Button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-brand-dark font-bold text-lg uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all"
                    >
                        {loading ? "Preparing Checkout..." : "Start Risk Monitoring"}
                    </Button>


                    <p className="text-center text-xs text-slate-600 font-mono pt-2">
                        Safe & Secure Stripe Checkout. Cancel Anytime.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
