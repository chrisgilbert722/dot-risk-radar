'use client'

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    AlertTriangle,
    ShieldCheck,
    Activity,
    Search,
    ArrowRight,
    FileText,
    Lock,
    Radar,
    Siren,
    CheckCircle2,
    XCircle,
    TrendingUp,
    BarChart3,
    Eye,
    ChevronDown,
    Database,
    ShieldAlert
} from 'lucide-react';
import { useSubscription, isPremium } from '@/lib/subscriptions';
import { PricingModal } from '@/components/pricing-modal';
import { TrustScreen } from '@/components/trust-screen';
import { useRouter } from 'next/navigation';

// --- PHASE 9: HERO VARIANTS ---
const HERO_VARIANTS = {
    A: { // Authority
        headline: "See Your DOT Risk Before Inspectors, Audits, or Insurance Reviews Do",
        subheadline: "Real-time FMCSA inspection data, ISS score trends, and enforcement signals translated into actionable DOT risk intelligence for carriers, owner-operators, and fleet managers."
    },
    B: { // Fear
        headline: "Your DOT Risk Is Already Scored — You Just Can't See It",
        subheadline: "Every inspection adds to a pattern. We show you exactly what triggers the next audit."
    }
};

const ACTIVE_VARIANT = 'A';

const FAQS = [
    {
        question: "What actually triggers a DOT audit?",
        answer: "Audits are rarely random. They are triggered by data patterns: rising ISS scores, a spike in OOS violations, or correlated inspection failures across multiple states. Algorithms flag you for intervention long before a human investigator is assigned."
    },
    {
        question: "Does one clean inspection result reset my risk?",
        answer: "No. FMCSA risk models use 24 months of weighted history. A single clean inspection helps dilute the bad data, but it does not 'reset' your score. Consistent clean inspections are required to statistically reverse a negative trend."
    },
    {
        question: "Why did my risk increase before I received a notice?",
        answer: "Enforcement is a lagging indicator; risk is a leading indicator. The data supporting an audit accumulates for months before the administrative threshold is crossed. If you wait for the letter, you have already lost the opportunity to correct the trend."
    },
    {
        question: "How do inspectors actually use ISS scores?",
        answer: "The ISS score (1-100) dictates the roadside inspector's action plan. Scores above 75 signal 'Inspection Required.' Inspectors are incentivized to stop these vehicles to gather more data or confirm suspected non-compliance."
    },
    {
        question: "Does DOT risk affect insurance rates?",
        answer: "Yes. Underwriters use the same FMCSA data as inspectors. A pattern of 'Alert' status in the BASICs or a climbing ISS score signals operational instability, often leading to premium hikes or non-renewal notices."
    },
    {
        question: "Can I predict my next inspection?",
        answer: "Yes. By monitoring the velocity of your inspection data and ISS trends, you can identify when you have crossed the threshold into 'High Priority' status. This allows you to fix the issues before the inspector finds them."
    }
];

export default function ClientPage({ copy }: { copy: any }) {

    const [dotNumber, setDotNumber] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const router = useRouter();

    // Subscription & Gate State
    const { subscription, loading: subLoading, user } = useSubscription();
    const [showPricing, setShowPricing] = useState(false);

    // Effect: Check for pricing URL param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('pricing') === 'true' || params.get('canceled') === 'true') {
            setShowPricing(true);
        }
        if (params.get('success') === 'true') {
            // Optional: Show success toast
        }
    }, []);

    const handleGatedAction = (action: () => void) => {
        if (subLoading) return; // Wait for check

        if (!user) {
            router.push('/login?next=' + encodeURIComponent(window.location.pathname));
            return;
        }

        if (subscription && isPremium(subscription.status)) {
            action(); // User is subscribed, proceed
        } else {
            setShowPricing(true); // Gated
        }
    };

    // Typing effect logic
    useEffect(() => {
        if (dotNumber.length > 0) {
            setIsTyping(true);
            const timer = setTimeout(() => setIsTyping(false), 800);
            return () => clearTimeout(timer);
        } else {
            setIsTyping(false);
        }
    }, [dotNumber]);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // --- PHASE 6: EXPANDED TESTIMONIALS (15 items) ---
    const testimonials = [
        { quote: "We didn’t realize our DOT risk had quietly escalated until this flagged it.", role: "Fleet Owner", size: "12 Trucks", outcome: "Passed the next inspection with no surprises." },
        { quote: "This showed us patterns we weren’t watching — inspections were increasing before we felt it.", role: "Safety Director", size: "45 Trucks", outcome: "Caught a trend before it escalated." },
        { quote: "Now we know where we stand every week. No surprises.", role: "Operations Manager", size: "28 Trucks", outcome: "Insurance renewal with zero pushback." },
        { quote: "The OOS alerts alone saved us from a conditional rating.", role: "Compliance Lead", size: "18 Trucks" },
        { quote: "It doesn't tell you what to fear, it shows you what to watch.", role: "Owner-Operator", size: "3 Trucks" },
        { quote: "Finally, FMCSA data that makes sense without a law degree.", role: "Fleet Administrator", size: "15 Trucks" },
        { quote: "We check this before every insurance renewal now.", role: "CFO", size: "60 Trucks" },
        { quote: "The trend analysis spotted a brake violation pattern our mechanics missed.", role: "Maintenance Mgr", size: "32 Trucks" },
        { quote: "Better than the expensive enterprise tools we used to use.", role: "Safety Manager", size: "10 Trucks" },
        { quote: "Simple, fast, and actually tactical. No fluff.", role: "Logistics Coordinator", size: "22 Trucks" },
        { quote: "I sleep better knowing I'll get an alert if something goes red.", role: "Owner", size: "8 Trucks" },
        { quote: "Gave us the ammo we needed to fire a problem driver.", role: "HR Director", size: "55 Trucks" },
        { quote: "The dashboard looks exactly like what we needed.", role: "Dispatcher", size: "14 Trucks" },
        { quote: "Stopped a roadside inspection from turning into an audit.", role: "Driver Manager", size: "40 Trucks" },
        { quote: "Essential gear for modern trucking.", role: "V.P. Operations", size: "75 Trucks" }
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-risk-elevated/30 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 border-b border-slate-800 bg-brand-dark/90 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded border border-risk-elevated/50 bg-risk-elevated/10 flex items-center justify-center">
                                <Radar className="w-5 h-5 text-risk-elevated animate-pulse-slow" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-risk-elevated rounded-full animate-ping" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase font-mono">
                            DOT <span className="text-risk-elevated">RISK RADAR</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/login" className="hidden md:block text-sm font-medium text-slate-400 hover:text-white transition-colors font-mono uppercase tracking-wider">
                            // Login
                        </Link>
                        <Button asChild className="bg-risk-elevated text-brand-dark hover:bg-amber-400 font-bold px-6 border-b-4 border-amber-600 active:border-b-0 active:translate-y-[4px] transition-all">
                            <Link href="/signup">
                                GET ACCESS
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* --- PHASE 2 & 9: HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] lg:min-h-[800px] flex items-center">
                {/* Image 1: Background Layer - MAXIMUM CLARITY (No Blur) */}
                <div className="absolute inset-0 z-0 select-none">
                    <Image
                        src="/images/hero-inspector-clipboard.jpg"
                        alt="Roadside Inspection"
                        fill
                        className="object-cover opacity-100 mix-blend-normal"
                        priority
                    />
                    {/* Directional Gradient: Dark on left (text), transparent on right (visual) - LIGHTER OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/40 to-transparent" />
                    {/* Bottom Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-grid-slate opacity-10" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* LEFT COLUMN */}
                        <div className="flex-1 w-full text-center lg:text-left order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-risk-elevated/10 border border-risk-elevated/20 text-xs font-bold font-mono text-risk-elevated mb-6 uppercase tracking-widest animate-pulse-slow">
                                <span className="w-2 h-2 rounded-full bg-risk-elevated" />
                                Public Beta Now Live
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[0.9] tracking-tighter text-white mb-6 uppercase drop-shadow-2xl">
                                {HERO_VARIANTS[ACTIVE_VARIANT].headline.split(' ').map((word, i) => (
                                    word === "Risk" || word === "Audits" ?
                                        <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-risk-elevated to-amber-200 text-glow-amber pr-2">{word} </span> :
                                        <span key={i}>{word} </span>
                                ))}
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-4">
                                {HERO_VARIANTS[ACTIVE_VARIANT].subheadline}
                            </p>
                            <p className="text-md text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                                {copy.hero}
                            </p>

                            <div className="hidden lg:block relative z-20">
                                <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} copy={copy} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN (VISUAL) - ORDER 2 Mobile Stickiness Enforced */}
                        <div className="flex-1 w-full order-2 lg:order-2">
                            <div className="relative w-full aspect-video md:aspect-[4/3] tactical-glass rounded-lg overflow-hidden shadow-2xl group ring-1 ring-white/10">
                                {/* Tactical Header */}
                                <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                    </div>
                                    <div className="font-mono text-[10px] text-risk-safe uppercase tracking-widest flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> System Active
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-6 relative h-full flex flex-col">
                                    {/* Radar Animation */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] opacity-40 pointer-events-none">
                                        <div className="w-full h-full radar-sweep" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4 z-10">
                                        <div className="p-4 bg-slate-800/40 rounded border border-white/5 backdrop-blur-sm">
                                            <div className="text-xs text-slate-400 font-mono mb-1">RISK LEVEL</div>
                                            <div className="text-2xl font-bold font-mono text-risk-elevated flex items-center gap-2 text-glow-amber">
                                                ELEVATED
                                                <AlertTriangle className="w-5 h-5 text-risk-elevated" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-800/40 rounded border border-white/5 backdrop-blur-sm">
                                            <div className="text-xs text-slate-400 font-mono mb-1">ISS TREND</div>
                                            <div className="text-2xl font-bold font-mono text-risk-high flex items-center gap-2 text-glow-red">
                                                +12.4%
                                                <TrendingUp className="w-5 h-5 text-risk-high" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Graph */}
                                    <div className="flex-1 bg-slate-900/30 rounded border border-white/5 relative overflow-hidden flex items-end px-2 pt-8 gap-1 z-10">
                                        {[40, 35, 55, 45, 60, 75, 65, 80, 70, 85, 90, 85, 95].map((h, i) => (
                                            <div key={i} className={`flex-1 rounded-t-sm transition-all duration-1000 ${h > 70 ? 'bg-risk-high shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-emerald-500/50'}`} style={{ height: `${h}%` }} />
                                        ))}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-risk-elevated/5 to-transparent w-[2px] h-full animate-scan-horizontal" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MOBILE INPUT (Visible only on mobile, Order 3) */}
                        <div className="w-full order-3 lg:hidden mt-4">
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} copy={copy} />
                        </div>

                    </div>
                </div>
            </section>

            {/* NEW SECTION: TRUST COMPARISON (Inserted per final command) */}
            <section className="py-24 bg-slate-950 border-b border-slate-800 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                            You Can’t Fix What You Can’t See
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            What DOT inspectors see about your company — before they ever pull you over
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {/* Column 1 */}
                        <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-300 mb-6 uppercase tracking-wider text-center">What You Think</h3>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-slate-500">
                                    <XCircle className="w-5 h-5 shrink-0 text-slate-600" />
                                    <span>“My CSA score looks fine”</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500">
                                    <XCircle className="w-5 h-5 shrink-0 text-slate-600" />
                                    <span>“We passed the last inspection”</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500">
                                    <XCircle className="w-5 h-5 shrink-0 text-slate-600" />
                                    <span>“No major violations recently”</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-500">
                                    <XCircle className="w-5 h-5 shrink-0 text-slate-600" />
                                    <span>“We’ll deal with it if something happens”</span>
                                </li>
                            </ul>
                            <div className="text-center text-xs text-slate-600 uppercase font-mono tracking-widest border-t border-slate-800 pt-4">
                                What most owner-operators believe
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="bg-slate-900 p-8 rounded-xl border border-risk-elevated/30 relative flex flex-col shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-risk-elevated" />
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-center">What Inspectors Actually See</h3>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-slate-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 text-risk-elevated" />
                                    <span>Inspection trends over time</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 text-risk-elevated" />
                                    <span>Violation velocity (are issues increasing?)</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 text-risk-elevated" />
                                    <span>Out-of-Service probability signals</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 text-risk-elevated" />
                                    <span>Carrier risk flags from FMCSA data</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-300">
                                    <AlertTriangle className="w-5 h-5 shrink-0 text-risk-elevated" />
                                    <span>Insurance-relevant enforcement indicators</span>
                                </li>
                            </ul>
                            <div className="text-center text-xs text-risk-elevated font-bold uppercase font-mono tracking-widest border-t border-slate-800 pt-4">
                                Inspectors don’t look at one score.<br /> They look at patterns.
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="bg-slate-900/50 p-8 rounded-xl border border-red-900/30 flex flex-col">
                            <h3 className="text-xl font-bold text-red-400 mb-6 uppercase tracking-wider text-center">What Happens When You’re Flagged</h3>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-start gap-3 text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span>More roadside inspections</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span>Higher chance of Out-of-Service orders</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span>Insurance premium increases</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span>Lost loads and downtime</span>
                                </li>
                                <li className="flex items-start gap-3 text-slate-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                                    <span>Permanent compliance history</span>
                                </li>
                            </ul>
                            <div className="text-center text-xs text-red-500 uppercase font-mono tracking-widest border-t border-slate-800 pt-4">
                                By the time you feel it — it’s already too late.
                            </div>
                        </div>
                    </div>

                    {/* Proof Block */}
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xl text-white mb-8 font-medium">
                            DOT Risk Radar monitors the same public signals inspectors use — and alerts you before they become expensive problems.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Continuous risk scoring (not snapshots)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Inspection and violation trend tracking</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Early-warning enforcement indicators</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Built specifically for owner-operators and small fleets</span>
                            </div>
                        </div>

                        <div className="text-risk-elevated text-sm font-mono uppercase tracking-widest mb-8">
                            No contracts. No hardware. No fleet minimums.<br />
                            Just visibility into your real DOT risk.
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <Button
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="h-16 px-10 bg-amber-500 hover:bg-amber-400 text-brand-dark font-bold text-xl uppercase tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all"
                            >
                                See My Risk Profile <ArrowRight className="w-6 h-6 ml-2" />
                            </Button>
                            <span className="text-xs text-slate-500 font-mono">Takes under 60 seconds • No credit card required</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW SECTION: TRUSTWORTHINESS (Inserted per 10/10 command) */}
            <section className="py-24 bg-slate-900 border-b border-slate-800 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                            Why DOT Risk Radar Is Different
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Built around how inspections actually happen — not how drivers are told they happen
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Block 1: Data Authority */}
                        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-amber-500" /> Data Authority
                            </h3>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                DOT Risk Radar analyzes public FMCSA inspection, violation, and enforcement data — the same sources inspectors rely on — and applies weighting based on how enforcement patterns actually behave over time.
                            </p>
                            <div className="text-xs text-slate-500 font-mono uppercase tracking-wide">
                                We don’t invent data. We interpret it the way enforcement does.
                            </div>
                        </div>

                        {/* Block 2: Pattern vs Snapshot */}
                        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" /> Pattern vs Snapshot
                            </h3>
                            <p className="text-slate-300 leading-relaxed mb-6">
                                Most tools show a snapshot. Inspectors look for movement.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Rising inspection frequency</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Violation velocity (are issues increasing?)</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>Repeated violation categories</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                    <span>OOS-adjacent indicators</span>
                                </div>
                            </div>
                            <div className="text-sm text-white font-bold border-t border-slate-800 pt-4">
                                DOT Risk Radar is built to surface these patterns early.
                            </div>
                        </div>

                        {/* Block 3: Proof by Scenario (CRITICAL) */}
                        <div className="bg-slate-950/50 p-8 rounded-xl border border-risk-elevated/20 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-risk-elevated" />
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-risk-elevated" /> Real-World Risk Example
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8 mb-6">
                                <div>
                                    <div className="text-xs text-slate-500 font-mono uppercase tracking-wide mb-2">Carrier Profile</div>
                                    <p className="text-slate-300 italic mb-6">
                                        “Small carrier with no major violations, but increasing inspection frequency and repeat minor issues.”
                                    </p>
                                </div>
                                <div>
                                    <div className="text-xs text-risk-elevated font-mono uppercase tracking-wide mb-2">What DOT Risk Radar Flagged</div>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <CheckCircle2 className="w-4 h-4 text-risk-elevated shrink-0 mt-0.5" />
                                            <span>Inspection frequency trending upward</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <CheckCircle2 className="w-4 h-4 text-risk-elevated shrink-0 mt-0.5" />
                                            <span>Repeated violation category appearing across inspections</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <CheckCircle2 className="w-4 h-4 text-risk-elevated shrink-0 mt-0.5" />
                                            <span>Elevated enforcement attention compared to peer carriers</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-risk-elevated/10 p-4 rounded border border-risk-elevated/20 mb-4">
                                <div className="text-risk-elevated font-bold text-sm mb-1 uppercase tracking-wide">Why This Matters</div>
                                <p className="text-slate-300 text-sm">
                                    This is how carriers get flagged — quietly — before problems feel serious.
                                </p>
                            </div>

                            <div className="text-[10px] text-slate-600 uppercase font-mono tracking-wide">
                                Example is illustrative. DOT Risk Radar does not predict individual inspections.
                            </div>
                        </div>

                        {/* Block 4: Who This Is For */}
                        <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center">
                            <h3 className="text-xl font-bold text-white mb-6">Who This Is For</h3>
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300">Owner-operators</span>
                                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300">Small fleets</span>
                                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-sm text-slate-300">Carriers without compliance departments</span>
                            </div>
                            <p className="text-slate-500 text-sm mb-0">
                                It is not built for enterprise dashboards or long-term contracts.
                            </p>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <div className="text-risk-elevated text-sm font-mono uppercase tracking-widest">
                            No contracts. No hardware. No fleet minimums.<br />
                            Just visibility into your real DOT risk — before it becomes expensive.
                        </div>
                    </div>

                </div>
            </section>

            {/* --- RESTORED SECTION 1: VISUAL CHAOS/CONTROL (Added back per request) --- */}
            <section className="py-24 bg-slate-900/50 border-y border-slate-800 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Inspectors See <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-elevated to-amber-200 text-glow-amber">(That You Don’t)</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            The FMCSA database aggregates inspection records, violations, OOS events, and enforcement history into risk indicators inspectors and auditors rely on. DOT Risk Radar transforms these raw compliance signals into clear, actionable intelligence.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-2xl relative min-h-[500px]">
                        {/* LEFT: CHAOS (Red Truck + Dark Glass Overlay) */}
                        <div className="relative p-8 md:p-12 group min-h-[400px] flex flex-col overflow-hidden border-r border-slate-800">
                            <Image
                                src="/images/chaos-inspection.png"
                                alt="Inspection Chaos"
                                fill
                                className="object-cover opacity-100 grayscale hover:grayscale-0 transition-opacity duration-700"
                            />

                            {/* Dark Glass Overlay (Not Flat Black) */}
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm mix-blend-multiply transition-all duration-700 group-hover:bg-slate-900/60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-slate-950/80 mix-blend-overlay" />

                            {/* Scrolling Terminal Effect - BRIGHTER & GLOWING */}
                            <div className="absolute inset-0 opacity-80 font-mono text-xs leading-none text-code-red pointer-events-none select-none z-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 animate-[terminal-scroll_15s_linear_infinite] group-hover:animate-[terminal-scroll_2s_linear_infinite]">
                                    {Array(50).fill("VIOLATION_DETECTED OOS_TRUE 396.17(c) FAIL // !!! ALERT !!! ").join(" ")}
                                    {Array(50).fill("VIOLATION_DETECTED OOS_TRUE 396.17(c) FAIL // !!! ALERT !!! ").join(" ")}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                                </div>
                            </div>

                            <div className="relative z-10 mt-auto tactical-glass rounded-lg p-6">
                                <div className="inline-flex items-center gap-2 mb-4 text-red-500 font-mono text-sm tracking-wider uppercase bg-black/40 px-3 py-1 rounded border border-red-500/30">
                                    <AlertTriangle className="w-3 h-3" /> Audit Triggers Detected
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Overwhelming Noise</h3>
                                <ul className="space-y-4 text-slate-300 font-mono text-sm">
                                    <li className="flex items-center gap-3">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                                        <span>Clustered violations</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                                        <span>Rising OOS trend</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                                        <span>Pattern matches past audits</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: CONTROL (Actionable Intelligence) */}
                        <div className="relative p-8 md:p-12 group min-h-[400px] flex flex-col justify-end overflow-hidden border-l border-slate-800">
                            <Image
                                src="/images/clean-highway.jpg"
                                alt="Clear Road"
                                fill
                                className="object-cover opacity-100 grayscale hover:grayscale-0 transition-opacity duration-700"
                            />

                            {/* Dark Glass Overlay */}
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm mix-blend-multiply transition-all duration-700 group-hover:bg-slate-900/60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-slate-950/80 mix-blend-overlay" />

                            {/* Scrolling Terminal Effect - GREEN & GLOWING */}
                            <div className="absolute inset-0 opacity-80 font-mono text-xs leading-none text-emerald-400 pointer-events-none select-none z-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 animate-[terminal-scroll_15s_linear_infinite] group-hover:animate-[terminal-scroll_2s_linear_infinite] direction-reverse">
                                    {Array(50).fill("PASSED_INSPECTION CLEAN_LEVEL_1 396.17(c) PASS // !!! SAFE !!! ").join(" ")}
                                    {Array(50).fill("PASSED_INSPECTION CLEAN_LEVEL_1 396.17(c) PASS // !!! SAFE !!! ").join(" ")}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90" />
                                </div>
                            </div>

                            {/* Radar Background Interaction */}
                            <div className="absolute top-8 right-8 p-0 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-700 z-10">
                                <Radar className="w-32 h-32 text-emerald-500 group-hover:animate-radar-expand" />
                            </div>

                            <div className="relative z-20 mt-auto tactical-glass rounded-lg p-6">
                                <div className="inline-flex items-center gap-2 mb-6 text-emerald-400 font-mono text-sm tracking-wider uppercase bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30 w-fit">
                                    <CheckCircle2 className="w-4 h-4" /> Risk Radar Analysis
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-6">Actionable Intelligence</h3>

                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3 text-slate-300 font-mono text-sm group-hover:text-white transition-colors">
                                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20 border-emerald-500/30">01</div>
                                        <span>Predictive score stabilization</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 font-mono text-sm group-hover:text-white transition-colors">
                                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20 border-emerald-500/30">02</div>
                                        <span>Plain-English pattern alerts</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 font-mono text-sm group-hover:text-white transition-colors">
                                        <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/20 border-emerald-500/30">03</div>
                                        <span>Pre-audit intervention signals</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHASE 4: MID-PAGE AUTHORITY (Image 3) --- */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <Image
                    src="/images/clean-highway.jpg"
                    alt="Safe Operations"
                    fill
                    className="object-cover opacity-60 grayscale"
                />
                <div className="absolute inset-0 bg-brand-dark/80 mix-blend-multiply" />
                <div className="absolute inset-0 bg-grid-slate opacity-30" />
                <div className="relative z-10 text-center px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight uppercase">
                        Enterprise Risk Intelligence <br /> <span className="text-risk-safe">For Every Fleet Size</span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        DOT Risk Radar delivers enterprise-grade FMCSA risk intelligence for fleets of any size — from single owner-operators to multi-state carriers managing complex compliance exposure.
                    </p>
                </div>
            </section>

            {/* --- SECTION 2: WHAT INSPECTORS SEE (Split Layout - MOVED DOWN) --- */}
            <section className="py-24 bg-slate-900 border-y border-slate-800 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* LEFT: CONTENT & CARDS */}
                        <div className="text-left">
                            <div className="text-amber-500 font-mono text-xs font-bold tracking-widest uppercase mb-4">
                                THE INVISIBLE THREAT
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                The DOT Enforcement Profile <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-elevated to-amber-200 text-glow-amber">Behind Your Number</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Every DOT number is associated with an enforcement profile built from inspection results, violations, Out-of-Service events, and ISS score trends. This profile is what FMCSA inspectors and auditors review when determining enforcement priority.
                            </p>

                            <div className="space-y-4">
                                {/* Card 1 */}
                                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg flex gap-4 hover:bg-slate-900/80 transition-colors">
                                    <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Hidden Violation Patterns</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Violations that appear isolated to carriers are connected at the federal level. FMCSA systems correlate inspection outcomes across states to detect broader enforcement patterns.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-lg flex gap-4 hover:bg-slate-900/80 transition-colors">
                                    <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded flex items-center justify-center shrink-0">
                                        <TrendingUp className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">ISS Score Velocity</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            ISS scores reflect how enforcement risk is changing — not just where it stands today. Directional movement is often more important than the current score itself.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: ENFORCEMENT SIMULATION WINDOW */}
                        <div className="relative">
                            <div className="bg-[#0B0F17] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
                                {/* Window Header */}
                                <div className="bg-[#151923] px-4 py-3 flex items-center justify-between border-b border-slate-800">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <div className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                                        Enforcement View Simulation
                                    </div>
                                    <div className="w-12" /> {/* Spacer */}
                                </div>

                                {/* Window Content */}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <div className="text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-2">Target Vehicle</div>
                                            <div className="text-2xl text-white font-mono tracking-wider">
                                                DOT <span className="text-slate-400">#382910</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-slate-500 text-[10px] font-mono uppercase tracking-wider mb-1">ISS Score</div>
                                            <div className="text-4xl font-bold text-red-500 font-mono">92</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Status 1: Inspection Required */}
                                        <div className="bg-red-500/10 border border-red-500/20 rounded p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                <span className="text-red-400 font-bold text-sm tracking-wide uppercase">Inspection Required</span>
                                            </div>
                                            <span className="text-red-500/50 font-mono text-xs uppercase">Priority 1</span>
                                        </div>

                                        {/* Status 2: Bypass Denied */}
                                        <div className="bg-slate-900/50 border border-slate-800 rounded p-4 flex items-center justify-between opacity-50">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-400 font-bold text-sm tracking-wide uppercase">Weigh Station Bypass</span>
                                            </div>
                                            <span className="text-slate-600 font-mono text-xs uppercase">Denied</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute -inset-4 bg-red-500/5 blur-2xl -z-10 rounded-full" />

                            {/* Comparison Cards (Added per request) */}
                            <div className="mt-8">
                                <ComparisonCards />
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* HOW IT WORKS (Enhanced) */}
            <section className="py-24 border-b border-slate-800 bg-brand-dark relative overflow-hidden">
                {/* Subtle Gradient Sweep */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 via-slate-900/40 to-slate-900/0 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Happens the Moment <br className="hidden md:block" /> Your DOT Number Is Seen</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            Once a DOT number enters an inspection or enforcement workflow, FMCSA systems begin evaluating frequency, severity, and historical context. This evaluation happens continuously — not only after repeated violations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2rem] left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent -z-10" />

                        {/* STEP 01 */}
                        <div className="group relative">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-8 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">01</div>

                            <div className="inline-block px-2 py-0.5 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-5 group-hover:text-risk-elevated group-hover:border-risk-elevated/30 transition-colors">
                                System Aware
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3">DOT Signal Detected</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">FMCSA systems recognize the DOT number and immediately associate it with historical inspection and compliance records.</p>
                        </div>

                        {/* STEP 02 */}
                        <div className="group relative">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-8 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">02</div>

                            <div className="inline-block px-2 py-0.5 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-5 group-hover:text-risk-elevated group-hover:border-risk-elevated/30 transition-colors">
                                Risk Correlation Active
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3">Patterns Begin Forming</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">Inspection outcomes, warnings, and OOS events are evaluated together to assess whether compliance risk is stabilizing or escalating.</p>
                        </div>

                        {/* STEP 03 */}
                        <div className="group relative">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-8 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">03</div>

                            <div className="inline-block px-2 py-0.5 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-5 group-hover:text-risk-elevated group-hover:border-risk-elevated/30 transition-colors">
                                Trend Threshold Approaching
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3">Risk Trends Emerge</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">As enforcement risk increases, inspection likelihood, audit exposure, and regulatory attention rise accordingly.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* --- PHASE 6: TESTIMONIALS (Image 4 BG) --- */}
            <section className="py-24 border-t border-slate-800 relative overflow-hidden bg-slate-950 min-h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/testimonial-trucks.jpg"
                        alt="Testimonial Background"
                        fill
                        className="object-cover opacity-100 mix-blend-normal"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-brand-dark/40" />
                    <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="tactical-glass p-8 md:p-12 rounded-2xl relative shadow-[0_0_60px_-10px_rgba(245,158,11,0.5)] border border-risk-elevated/50">
                            {/* Quote Icon */}
                            <div className="absolute top-6 left-6 text-risk-elevated/20">
                                <FileText className="w-12 h-12" />
                            </div>

                            <div className="relative pt-6 text-center min-h-[200px] flex flex-col justify-center">
                                <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed mb-6 italic">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>

                                <div className="flex flex-col items-center animate-fade-in-up">
                                    <div className="text-risk-elevated font-bold uppercase tracking-wider text-sm mb-1">
                                        {testimonials[activeTestimonial].role}
                                    </div>
                                    <div className="text-slate-500 font-mono text-sm mb-2">
                                        Operation Size: {testimonials[activeTestimonial].size}
                                    </div>
                                    {testimonials[activeTestimonial].outcome && (
                                        <div className="text-slate-400 text-sm italic border-t border-slate-800 pt-2 mt-2">
                                            "{testimonials[activeTestimonial].outcome}"
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="flex justify-center gap-3 mt-10">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTestimonial(i)}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-risk-elevated w-8' : 'bg-slate-700 w-2 hover:bg-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* FEATURE GRID */}
            <section className="py-24 bg-slate-900/50">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Eye}
                            title="Know before scores jump"
                            desc="Understand enforcement risk direction before ISS or safety scores officially change."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Stop violations from compounding"
                            desc="Identify early compliance signals before they form patterns that attract enforcement attention."
                        />
                        <FeatureCard
                            icon={Siren}
                            title="Intervene before audits"
                            desc="Gain visibility into audit risk while corrective action is still possible."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Never lose proof at renewal"
                            desc="Maintain a clear, documented compliance history for insurance and regulatory review."
                        />
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-32 bg-slate-950 border-t border-slate-800 relative z-10">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">DOT Risk & FMCSA Enforcement FAQs</h2>
                        <div className="w-24 h-1 bg-risk-elevated mx-auto rounded-full opacity-60" />
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <div key={i} className={`border rounded-lg transition-all duration-300 ${openFAQ === i ? 'bg-slate-900/40 border-risk-elevated/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'bg-transparent border-slate-800 hover:border-slate-700 hover:bg-slate-900/20'}`}>
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                                >
                                    <span className={`text-lg font-bold transition-colors ${openFAQ === i ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 transition-transform duration-300 ${openFAQ === i ? 'rotate-180 text-risk-elevated' : 'text-slate-500 group-hover:text-slate-300'}`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFAQ === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-6 pb-6 text-slate-400 leading-relaxed text-[15px] border-t border-slate-800/0">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* --- PHASE 7: HIGH CONVERSION BLOCK (Image 5 BG) --- */}
            <section className="py-32 relative overflow-hidden min-h-[600px] flex items-center">
                {/* Image 5 Background - Brightened */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/cta-sunset.jpg"
                        alt="Final Call"
                        fill
                        className="object-cover opacity-100 mix-blend-normal"
                    />
                    {/* Lighter Gradient for Confidence */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/80 via-brand-dark/60 to-brand-dark/80" />
                    <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="tactical-glass rounded-3xl p-8 md:p-20 text-center shadow-2xl max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
                            Know Your DOT Risk <br /> <span className="text-slate-400">Before It Becomes a Compliance Problem</span>
                        </h2>

                        {/* Testimonial Snippet */}
                        <div className="mb-10 text-risk-elevated font-mono text-sm tracking-wide uppercase">
                            Monitor FMCSA enforcement risk in real time — before inspections, audits, or insurance reviews occur.
                        </div>

                        <div className="max-w-3xl mx-auto">
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} copy={copy} />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-slate-800 bg-brand-dark text-slate-500 text-sm font-mono text-center">
                <p>&copy; {new Date().getFullYear()} DOT RISK RADAR. MISSION CRITICAL COMPLIANCE INTELLIGENCE.</p>
            </footer>

            {/* Gating Modal */}
            <PricingModal open={showPricing} onOpenChange={setShowPricing} />
        </div>
    );
}

// Input Component (Reused)
function HeroInput({ dotNumber, setDotNumber, isTyping, copy, variant = 'standard' }: { dotNumber: string, setDotNumber: (v: string) => void, isTyping: boolean, copy: any, variant?: 'standard' | 'expanded' }) {
    const [isFocused, setIsFocused] = useState(false);
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'analyzing' | 'complete'>('idle');
    const [scanProgress, setScanProgress] = useState(0);

    // Auth & Subscription context for the hero input action
    const { subscription, loading: subLoading, user } = useSubscription();
    const [showPricing, setShowPricing] = useState(false);
    const router = useRouter();

    const handleViewFullBreakdown = () => {
        if (subLoading) return;

        if (!user) {
            router.push('/login?next=/dashboard');
            return;
        }

        if (subscription && isPremium(subscription.status)) {
            router.push('/dashboard');
        } else {
            setShowPricing(true);
        }
    };

    const startScan = () => {
        if (!dotNumber) return;
        setScanState('scanning');

        // Sequence
        setTimeout(() => {
            setScanState('analyzing');
            setScanProgress(30);
        }, 1500);

        setTimeout(() => {
            setScanProgress(70);
        }, 2500);

        setTimeout(() => {
            setScanState('complete');
            setScanProgress(100);
        }, 3500);
    };

    if (scanState === 'complete') {
        return <TrustScreen dotNumber={dotNumber} />;
    }

    return (
        <div className="w-full text-left relative">
            {scanState !== 'idle' && (
                <div className="absolute inset-0 z-20 bg-slate-900/90 rounded-xl flex flex-col items-center justify-center p-8 backdrop-blur-sm border border-risk-elevated/20">
                    <Activity className="w-10 h-10 text-risk-elevated animate-spin mb-4" />
                    <div className="text-white font-mono font-bold text-lg mb-2">
                        {scanState === 'scanning' ? 'CONNECTING TO FMCSA...' : 'ANALYZING PATTERNS...'}
                    </div>
                    <div className="w-full max-w-[200px] h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-risk-elevated transition-all duration-500" style={{ width: `${scanProgress}%` }} />
                    </div>
                </div>
            )}

            <div className={`relative group max-w-4xl mx-auto ${variant === 'expanded' ? '' : 'sm:mx-0'}`}>
                {/* Glow behind input */}
                {variant === 'expanded' && (
                    <div className="absolute -inset-1 bg-amber-500/10 rounded-lg blur-xl opacity-50 pointer-events-none" />
                )}

                <div className={`relative flex flex-col sm:flex-row gap-0 ${variant === 'expanded' ? 'shadow-2xl' : ''}`}>
                    <div className="flex-[1.5] relative">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input
                            type="text"
                            placeholder={isFocused ? "FMCSA records will be queried immediately" : "ENTER DOT NUMBER"}
                            className={`pl-14 bg-[#1A1D24] border border-slate-700/50 text-white h-16 text-lg rounded-l-lg rounded-r-none font-mono tracking-wider uppercase placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all ${variant === 'expanded' ? 'bg-[#15171B]' : ''}`}
                            value={dotNumber}
                            onChange={(e) => setDotNumber(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={(e) => e.key === 'Enter' && startScan()}
                        />
                        {/* Helper Line on Focus */}
                        <div className={`absolute top-full left-0 mt-2 text-xs text-slate-400 font-medium transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-0'}`}>
                            Includes inspections, OOS rates, and risk trend signals
                        </div>
                    </div>
                    <div className="flex-1">
                        <Button
                            onClick={startScan}
                            className="w-full h-16 bg-amber-500 hover:bg-amber-400 text-brand-dark font-bold text-lg uppercase tracking-wide rounded-l-none rounded-r-lg relative overflow-hidden transition-all hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                        >
                            {isTyping ? (
                                <span className="flex items-center gap-2 animate-pulse">
                                    <Activity className="w-5 h-5 animate-spin" />
                                    Scanning...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Check Risk (Free) <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dynamic Help Text (Hide during scan) */}
            {scanState === 'idle' && (
                <div className={`mt-4 flex flex-col md:flex-row items-center justify-between px-1 transition-all duration-300 ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
                    <span className={`text-[10px] md:text-xs font-mono uppercase tracking-widest transition-colors duration-300 font-bold ${isTyping ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isTyping ? "ANALYZING INSPECTIONS, OOS TRENDS, VIOLATION VELOCITY..." : "NO CREDIT CARD. NO SALES CALLS."}
                    </span>

                    {variant === 'expanded' && !isTyping && (
                        <div className="text-[10px] md:text-xs font-mono text-slate-600 uppercase tracking-wide text-right hidden md:block">
                            FMCSA data updates often — risk can shift after a single inspection. <br />
                            <span className="opacity-50">BUILT ON PUBLIC FMCSA DATA</span>
                        </div>
                    )}

                    {/* Standard Mobile / Hero Hint */}
                    {variant === 'standard' && !isTyping && (
                        <div className="mt-2 md:mt-0 text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                            Built on public FMCSA data
                        </div>
                    )}

                    {isTyping && (
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-0" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-900 transition-colors group h-full">
            <div className="w-12 h-12 bg-slate-950 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-risk-elevated/20">
                <Icon className="w-6 h-6 text-risk-elevated" />
            </div>
            <h3 className="text-white font-bold mb-3">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}

function ComparisonCards() {
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {/* LEFT CARD - BEFORE */}
            <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl relative overflow-hidden h-full backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
                <div className="flex justify-between items-start mb-4">
                    <div className="text-slate-500 font-mono text-[10px] uppercase tracking-wider">High Exposure</div>
                    <div className="text-red-500 font-bold font-mono text-xs">Rising</div>
                </div>

                <div className="mb-2">
                    <div className="text-4xl font-bold text-slate-300 font-mono">78</div>
                </div>

                <div className="text-slate-400 text-xs border-t border-slate-800 pt-2 mt-2 leading-tight">
                    Unmonitored inspection patterns and blind spots.
                </div>
            </div>

            {/* RIGHT CARD - AFTER */}
            <div className="bg-slate-900/90 border border-emerald-500/30 p-6 rounded-xl relative overflow-hidden h-full shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] backdrop-blur-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                <div className="flex justify-between items-start mb-4">
                    <div className="text-emerald-400 font-mono text-[10px] uppercase tracking-wider font-bold">Optimized</div>
                    <div className="text-emerald-400 font-bold font-mono text-xs">Stabilized</div>
                </div>

                <div className="mb-2">
                    <div className="text-4xl font-bold text-white font-mono">61</div>
                </div>

                <div className="text-slate-400 text-xs border-t border-slate-800 pt-2 mt-2 leading-tight">
                    Early alerts and intervention signals.
                </div>
            </div>
        </div>
    )
}
