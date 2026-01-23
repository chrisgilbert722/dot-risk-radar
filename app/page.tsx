'use client'

import React, { useState, useEffect } from 'react';
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
    },
    C: { // Control
        headline: "Know Your DOT Risk Before It Becomes a Problem",
        subheadline: "Take control of your FMCSA data. Monitor trends, predict issues, and stay compliant."
    },
    D: { // Urgency
        headline: "FMCSA Signals Are Triggering Audits — Are You on the List?",
        subheadline: "Don't wait for a warning letter. See the hidden risk patterns in your DOT number now."
    }
};

// Simple variant selector (can be replaced with A/B testing lib logic later)
const ACTIVE_VARIANT = 'A'; // Defaulting to Authority as primary lock

export default function LandingPage() {
    const [dotNumber, setDotNumber] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Typing effect logic
    useEffect(() => {
        if (dotNumber.length > 0) {
            setIsTyping(true);
            const timer = setTimeout(() => setIsTyping(false), 2000);
            return () => clearTimeout(timer);
        } else {
            setIsTyping(false);
        }
    }, [dotNumber]);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 8000); // Slowed down slightly for readability
        return () => clearInterval(interval);
    }, []);

    // --- PHASE 6: EXPANDED TESTIMONIALS (15 items) ---
    const testimonials = [
        { quote: "We didn’t realize our DOT risk had quietly escalated until this flagged it.", role: "Fleet Owner", size: "12 Trucks" },
        { quote: "This showed us patterns we weren’t watching — inspections were increasing before we felt it.", role: "Safety Director", size: "45 Trucks" },
        { quote: "Now we know where we stand every week. No surprises.", role: "Operations Manager", size: "28 Trucks" },
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
                {/* Image 1: Background Layer with Refined Overlay (Darker Cinematic) */}
                <div className="absolute inset-0 z-0 select-none">
                    <Image
                        src="/images/hero-inspection-v2.png"
                        alt="Roadside Inspection"
                        fill
                        className="object-cover opacity-80 mix-blend-normal"
                        priority
                    />
                    {/* Directional Gradient: Dark on left (text), transparent on right (visual) - Navy Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/95 to-brand-dark/40" />
                    {/* Bottom Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
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

                            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                                {HERO_VARIANTS[ACTIVE_VARIANT].subheadline}
                            </p>

                            <div className="hidden lg:block">
                                <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
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
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] opacity-10 pointer-events-none">
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
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
                        </div>

                    </div>
                </div>
            </section>

            {/* --- PHASE 5: VISUAL PROOF (Refined with Image 2 + Glassmorphism) --- */}
            <section className="py-20 bg-slate-950 border-y border-slate-800 relative min-h-[800px] flex items-center">
                <div className="absolute inset-0 bg-noise opacity-50 mix-blend-soft-light pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Inspectors See (You Don’t)</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            The FMCSA database is full of raw data signals that trigger audits. We translate the noise into clarity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-2xl relative min-h-[500px]">
                        {/* LEFT: CHAOS (Red Truck + Dark Glass Overlay) */}
                        <div className="relative p-8 md:p-12 group md:hover:w-[45%] transition-all duration-500 ease-in-out min-h-[400px] flex flex-col overflow-hidden border-r border-slate-800">
                            {/* NEW BACKGROUND: Red Truck Inspection */}
                            <Image
                                src="/images/chaos-inspection.png"
                                alt="Inspection Chaos"
                                fill
                                className="object-cover opacity-100 grayscale hover:grayscale-0 transition-all duration-700"
                            />

                            {/* Dark Glass Overlay (Not Flat Black) */}
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm mix-blend-multiply transition-all duration-700 group-hover:bg-slate-900/60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-slate-950/80 mix-blend-overlay" />

                            {/* Scrolling Terminal Effect - BRIGHTER & GLOWING */}
                            <div className="absolute inset-0 opacity-80 font-mono text-xs leading-none text-code-red pointer-events-none select-none z-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute inset-0 animate-[terminal-scroll_15s_linear_infinite] group-hover:animate-[terminal-scroll_2s_linear_infinite]">
                                    {Array(50).fill("VIOLATION_DETECTED OOS_TRUE 396.17(c) FAIL // !!! ALERT !!! ").join(" ")}
                                    {Array(50).fill("VIOLATION_DETECTED OOS_TRUE 396.17(c) FAIL // !!! ALERT !!! ").join(" ")}
                                </div>
                            </div>

                            <div className="relative z-10 mt-auto tactical-glass rounded-lg p-6">
                                <div className="inline-flex items-center gap-2 mb-4 text-red-500 font-mono text-sm tracking-wider uppercase bg-black/40 px-3 py-1 rounded border border-red-500/30">
                                    <XCircle className="w-4 h-4" /> Unprocessed Data
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-100 transition-colors">Overwhelming Noise</h3>
                                <ul className="space-y-4 text-slate-300 font-mono text-sm">
                                    <li className="flex items-center gap-3 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 group-hover:animate-pulse" />
                                        <span>Hidden violation clusters</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 delay-75 group-hover:translate-x-1 group-hover:text-white">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 group-hover:animate-pulse" />
                                        <span>Rising OOS percentage</span>
                                    </li>
                                    <li className="flex items-center gap-3 transition-transform duration-300 delay-150 group-hover:translate-x-1 group-hover:text-white">
                                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-500 group-hover:animate-pulse" />
                                        <span>Audit triggers unnoticed</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: CONTROL (Glassmorphism + Progressive Reveal) */}
                        <div className="tactical-glass p-8 md:p-12 relative group md:hover:w-[55%] transition-all duration-500 ease-in-out min-h-[400px] flex flex-col justify-end overflow-hidden">
                            {/* Radar Background Interaction */}
                            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20 group-hover:opacity-60 transition-opacity duration-700">
                                <Radar className="w-32 h-32 text-emerald-500 group-hover:animate-[radar-expand_3s_ease-out_infinite]" />
                            </div>

                            <div className="inline-flex items-center gap-2 mb-6 text-emerald-400 font-mono text-sm tracking-wider uppercase bg-emerald-950/30 px-3 py-1 rounded border border-emerald-500/20 w-fit group-hover:bg-emerald-900/50 group-hover:border-emerald-400 transition-colors">
                                <CheckCircle2 className="w-4 h-4" /> Risk Radar Analysis
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Actionable Intelligence</h3>
                            <ul className="space-y-4 text-slate-300 font-mono text-sm transform transition-all">
                                <li className="flex items-center gap-3 group-hover:text-white transition-colors">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors duration-500">01</div>
                                    <span>Predictive score stabilization</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors duration-500">02</div>
                                    <span>Plain-English pattern alerts</span>
                                </li>
                                <li className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors duration-500">03</div>
                                    <span>Pre-audit intervention signals</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 border-b border-slate-800 bg-brand-dark">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="group">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-colors">01</div>
                            <h4 className="text-xl font-bold text-white mb-2">Enter DOT Number</h4>
                            <p className="text-slate-400">Instant connection to public FMCSA records.</p>
                        </div>
                        <div className="group">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-colors">02</div>
                            <h4 className="text-xl font-bold text-white mb-2">We Analyze Signals</h4>
                            <p className="text-slate-400">Algorithms scan for patterns, not just single violations.</p>
                        </div>
                        <div className="group">
                            <div className="w-16 h-16 mx-auto bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated group-hover:bg-risk-elevated group-hover:text-brand-dark transition-colors">03</div>
                            <h4 className="text-xl font-bold text-white mb-2">See Risk Trends</h4>
                            <p className="text-slate-400">Get alerted before your safety rating takes a hit.</p>
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
                            title="Continuous Monitoring"
                            desc="Prevents surprise score jumps by watching 24/7."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Risk Trend Detection"
                            desc="Prevents creeping violation patterns from escalating."
                        />
                        <FeatureCard
                            icon={Siren}
                            title="Early Warning Alerts"
                            desc="Prevents silent issues from becoming audits."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Compliance Vault"
                            desc="Prevents lost history during insurance renewals."
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
                        src="/images/driver-rest.jpg"
                        alt="Testimonial Background"
                        fill
                        className="object-cover opacity-50 mix-blend-normal blur-[6px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/95 to-brand-dark/60" />
                    <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="tactical-glass p-8 md:p-16 rounded-2xl relative shadow-2xl">
                            {/* Quote Icon */}
                            <div className="absolute top-8 left-8 text-risk-elevated/20">
                                <FileText className="w-16 h-16" />
                            </div>

                            <div className="relative pt-8 text-center min-h-[220px] flex flex-col justify-center">
                                <p className="text-2xl md:text-3xl font-medium text-slate-200 leading-relaxed mb-8 italic">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>

                                <div className="flex flex-col items-center animate-fade-in-up">
                                    <div className="text-risk-elevated font-bold uppercase tracking-wider text-sm mb-1">
                                        {testimonials[activeTestimonial].role}
                                    </div>
                                    <div className="text-slate-500 font-mono text-sm">
                                        Operation Size: {testimonials[activeTestimonial].size}
                                    </div>
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
                        <div className="mb-10 text-risk-elevated font-mono text-sm tracking-wide">
                            "USED BY OWNER-OPERATORS & SMALL FLEETS ACROSS THE U.S."
                        </div>

                        <div className="max-w-xl mx-auto">
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
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
function HeroInput({ dotNumber, setDotNumber, isTyping }: { dotNumber: string, setDotNumber: (v: string) => void, isTyping: boolean }) {
    return (
        <div className="w-full text-left">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-risk-elevated to-amber-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input
                            type="text"
                            placeholder="ENTER DOT NUMBER"
                            className="pl-11 bg-slate-900/95 border-slate-700 text-white h-14 text-lg focus:border-risk-elevated focus:ring-1 focus:ring-risk-elevated/50 rounded-lg font-mono tracking-wider uppercase placeholder:text-slate-600 transition-all font-bold"
                            value={dotNumber}
                            onChange={(e) => setDotNumber(e.target.value)}
                        />
                    </div>
                    <Button className="h-14 px-8 bg-risk-elevated hover:bg-amber-400 text-brand-dark font-bold rounded-lg text-lg uppercase tracking-wide min-w-[200px] transition-all relative overflow-hidden hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20">
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

            {/* Dynamic Help Text */}
            <div className="mt-3 flex items-center justify-between px-1 h-6 transition-all duration-300">
                <span className={`text-xs font-mono transition-colors duration-300 font-medium tracking-wide ${isTyping ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isTyping ? "ANALYZING INSPECTIONS, OOS TRENDS, VIOLATION VELOCITY..." : "NO CREDIT CARD. NO SALES CALLS."}
                </span>
                {isTyping && (
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-0" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150" />
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
                    </div>
                )}
            </div>
        </div>
    )
}



function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 tactical-glass rounded hover:border-risk-elevated/40 transition-all group">
            <div className="w-12 h-12 bg-slate-950/50 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-slate-800 group-hover:border-risk-elevated/30">
                <Icon className="w-6 h-6 text-risk-elevated" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-risk-elevated transition-colors">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                {desc}
            </p>
        </div>
    )
}
