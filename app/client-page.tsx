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
    Eye
} from 'lucide-react';

// --- PHASE 9: HERO VARIANTS ---
const HERO_VARIANTS = {
    A: { // Authority
        headline: "See Your DOT Risk Before Inspectors Do",
        subheadline: "Public FMCSA inspection signals translated into a real-time risk radar for your operation."
    },
    B: { // Fear
        headline: "Your DOT Risk Is Already Scored — You Just Can't See It",
        subheadline: "Every inspection adds to a pattern. We show you exactly what triggers the next audit."
    }
};

const ACTIVE_VARIANT = 'A';

export default function ClientPage({ copy }: { copy: any }) {

    const [dotNumber, setDotNumber] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

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

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter text-white mb-6 uppercase drop-shadow-2xl">
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

            {/* --- NEW SECTION 1: WHAT INSPECTORS SEE (Restored with Scrolling Violations) --- */}
            <section className="py-24 bg-slate-900/50 border-y border-slate-800 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* LEFT: CONTENT & CARDS */}
                        <div className="text-left">
                            <div className="text-amber-500 font-mono text-xs font-bold tracking-widest uppercase mb-4">
                                The Invisible Threat
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                What Inspectors See <br />
                                <span className="text-slate-500">(That You Don’t)</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                                Every roadside inspection, every warning letter, and every OOS violation feeds into a predictive score. Enforcement software flags you <span className="text-white italic">before</span> they pull you over.
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
                                            One bad tire inspection in Ohio triggers brake checks in Texas. We verify these cross-state triggers.
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
                                            Your score might be "passing" today, but the 30-day trend predicts a conditional rating next month.
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
                        </div>
                    </div>
                </div>
            </section>

            {/* --- NEW SECTION 2: YOU CANT FIX WHAT YOU CANT SEE --- */}
            <section className="py-24 bg-slate-950 border-y border-slate-800 relative shadow-2xl z-20">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-80" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">You Can’t Fix What You Can’t See</h2>
                        <div className="max-w-4xl mx-auto mb-16 relative">
                            {/* Glow Effect behind Input */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-risk-elevated/10 blur-[60px] rounded-full pointer-events-none" />
                            <HeroInput
                                dotNumber={dotNumber}
                                setDotNumber={setDotNumber}
                                isTyping={isTyping}
                                copy={copy}
                                variant="expanded"
                            />
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <ComparisonCards />
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
                            FMCSA systems don’t wait for violations to pile up. Risk begins forming instantly.
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
                            <p className="text-slate-400 leading-relaxed text-sm">The moment your DOT number appears, public FMCSA systems begin tracking inspection signals.</p>
                        </div>

                        {/* STEP 02 */}
                        <div className="group relative">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-8 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">02</div>

                            <div className="inline-block px-2 py-0.5 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-5 group-hover:text-risk-elevated group-hover:border-risk-elevated/30 transition-colors">
                                Risk Correlation Active
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3">Patterns Begin Forming</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">Algorithms correlate inspections, warnings, OOS events, and history across states — not in isolation.</p>
                        </div>

                        {/* STEP 03 */}
                        <div className="group relative">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-8 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">03</div>

                            <div className="inline-block px-2 py-0.5 bg-slate-900/80 border border-slate-700 rounded text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-5 group-hover:text-risk-elevated group-hover:border-risk-elevated/30 transition-colors">
                                Trend Threshold Approaching
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3">Risk Trends Emerge</h4>
                            <p className="text-slate-400 leading-relaxed text-sm">Before scores change, enforcement systems see momentum — and act on it.</p>
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
                            desc="Prevents surprise score jumps by watching 24/7."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Stop violations from compounding"
                            desc="Prevents creeping violation patterns from escalating."
                        />
                        <FeatureCard
                            icon={Siren}
                            title="Intervene before audits"
                            desc="Stops silent violations from triggering an audit."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Never lose proof at renewal"
                            desc="Secures your history for instant insurance validation."
                        />
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
                        Whether you run 1 truck or 100, the FMCSA watches you the same way. So do we.
                    </p>
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
                            Know Your DOT Risk <br /> <span className="text-slate-400">Before It Becomes a Problem</span>
                        </h2>

                        {/* Testimonial Snippet */}
                        <div className="mb-10 text-risk-elevated font-mono text-sm tracking-wide uppercase">
                            "{copy.authority}"
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
        </div>
    );
}

// Input Component (Reused)
function HeroInput({ dotNumber, setDotNumber, isTyping, copy, variant = 'standard' }: { dotNumber: string, setDotNumber: (v: string) => void, isTyping: boolean, copy: any, variant?: 'standard' | 'expanded' }) {
    const [isFocused, setIsFocused] = useState(false);
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'analyzing' | 'complete'>('idle');
    const [scanProgress, setScanProgress] = useState(0);

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
        return (
            <div className="w-full text-left animate-in fade-in zoom-in duration-500">
                <div className="bg-slate-900/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-risk-elevated to-red-500" />
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-slate-500 text-xs font-mono mb-1">DOT NUMBER ANALYZED</div>
                                <div className="text-white font-mono text-xl tracking-widest">{dotNumber}</div>
                            </div>
                            <div className="bg-risk-elevated text-brand-dark px-3 py-1 rounded font-bold text-sm">
                                RISK DETECTED
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1">ISS TREND</div>
                                <div className="text-red-400 font-bold font-mono text-lg flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" /> +15%
                                </div>
                            </div>
                            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <div className="text-slate-500 text-xs mb-1">AUDIT RISK</div>
                                <div className="text-risk-elevated font-bold font-mono text-lg">ELEVATED</div>
                            </div>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded mb-6 text-sm text-red-200 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Clustered OOS violations detected.</span>
                        </div>

                        <Button className="w-full h-12 bg-risk-elevated hover:bg-amber-400 text-brand-dark font-bold rounded text-lg uppercase tracking-wide">
                            View Full Risk Breakdown <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        )
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
