'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
    TrendingUp
} from 'lucide-react';

export default function LandingPage() {
    const [dotNumber, setDotNumber] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Typing effect logic for input
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
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const testimonials = [
        {
            quote: "We didn’t realize our DOT risk had quietly escalated until this flagged it.",
            role: "Fleet Owner",
            size: "12 Trucks"
        },
        {
            quote: "This showed us patterns we weren’t watching — inspections were increasing before we felt it.",
            role: "Safety Director",
            size: "45 Trucks"
        },
        {
            quote: "Now we know where we stand every week. No surprises.",
            role: "Operations Manager",
            size: "28 Trucks"
        },
        {
            quote: "The OOS alerts alone saved us from a conditional rating.",
            role: "Compliance Lead",
            size: "18 Trucks"
        }
    ];

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-risk-elevated/30 overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 border-b border-slate-800 bg-brand-dark/90 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-8 h-8 rounded border border-risk-elevated/50 bg-risk-elevated/10 flex items-center justify-center">
                                <Radar className="w-5 h-5 text-risk-elevated animate-pulse" />
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

            {/* PHASE 2: HIGH-CONVERSION HERO */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-grid-slate pointer-events-none opacity-20" />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-risk-elevated/5 to-transparent skew-x-12 opacity-30 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                        {/* LEFT COLUMN */}
                        <div className="flex-1 w-full text-center lg:text-left order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-risk-elevated/10 border border-risk-elevated/20 text-xs font-bold font-mono text-risk-elevated mb-6 uppercase tracking-widest animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-risk-elevated" />
                                Public Beta Now Live
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tighter text-white mb-6 uppercase">
                                See Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-risk-elevated to-amber-200">
                                    DOT Risk
                                </span> <br />
                                Before Inspectors Do
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed mb-8">
                                Public FMCSA inspection signals translated into a real-time risk radar for your operation.
                            </p>

                            {/* Mobile Stacking Logic: Input comes AFTER visual on mobile in regular flow, but visually we handle strict order below */}
                            <div className="hidden lg:block">
                                <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN (VISUAL) - ORDER 2 on Desktop, ORDER 2 on Mobile (sandwiched) */}
                        {/* BUT User spec says: 1. Headline, 2. Subheadline, 3. Visual, 4. Input */}
                        {/* My code structure: Left Col (Head/Sub) -> Right Col (Visual) -> Left Col (Input [Mobile only]) */}

                        <div className="flex-1 w-full order-2 lg:order-2">
                            <div className="relative w-full aspect-video md:aspect-[4/3] bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg overflow-hidden shadow-2xl group">
                                {/* Dashboard Header */}
                                <div className="h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                                    </div>
                                    <div className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                                        Live Monitoring /// Active
                                    </div>
                                </div>

                                {/* Dashboard Content */}
                                <div className="p-6 relative">
                                    {/* Radar Animation */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-radar-gradient animate-pulse opacity-20 pointer-events-none" />

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700/50">
                                            <div className="text-xs text-slate-400 font-mono mb-1">RISK LEVEL</div>
                                            <div className="text-2xl font-bold font-mono text-risk-elevated flex items-center gap-2">
                                                ELEVATED
                                                <AlertTriangle className="w-5 h-5 text-risk-elevated" />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-800/50 rounded border border-slate-700/50">
                                            <div className="text-xs text-slate-400 font-mono mb-1">ISS TREND</div>
                                            <div className="text-2xl font-bold font-mono text-risk-high flex items-center gap-2">
                                                +12.4%
                                                <TrendingUp className="w-5 h-5 text-risk-high" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mock Graph */}
                                    <div className="h-32 w-full bg-slate-800/30 rounded border border-slate-700/30 relative overflow-hidden flex items-end px-2 pt-8 gap-1">
                                        {[40, 35, 55, 45, 60, 75, 65, 80, 70, 85, 90, 85, 95].map((h, i) => (
                                            <div key={i} className={`flex-1 rounded-t-sm ${h > 70 ? 'bg-risk-high/80' : 'bg-emerald-500/50'}`} style={{ height: `${h}%` }} />
                                        ))}
                                        {/* Scan Line */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-risk-elevated/10 to-transparent w-[2px] h-full translate-x-0 animate-scan-horizontal" />
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

            {/* PHASE 3: VISUAL PROOF (Chaos vs Control) */}
            <section className="py-20 bg-slate-900 border-y border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">What Inspectors See (You Don’t)</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            The FMCSA database is full of raw data signals that trigger audits. We translate the noise into clarity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-0 border border-slate-700 rounded-lg overflow-hidden">
                        {/* LEFT: CHAOS */}
                        <div className="bg-[#0f1219] p-8 md:p-12 relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-700 group md:hover:w-[45%] transition-all duration-500 ease-in-out">
                            <div className="absolute inset-0 opacity-10 font-mono text-xs overflow-hidden leading-none text-red-500 pointer-events-none select-none">
                                {Array(50).fill("VIOLATION_DETECTED OOS_TRUE 396.17(c) FAIL ").join(" ")}
                            </div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 mb-6 text-red-500 font-mono text-sm tracking-wider uppercase">
                                    <XCircle className="w-4 h-4" /> Unprocessed Data
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Overwhelming Noise</h3>
                                <ul className="space-y-4 text-slate-400 font-mono text-sm">
                                    <li className="flex items-center gap-3 text-red-400">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span>Hidden violation clusters</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-red-400">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span>Rising OOS percentage</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-red-400">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span>Audit triggers unnoticed</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: CONTROL */}
                        <div className="bg-slate-800/30 p-8 md:p-12 relative group md:hover:w-[55%] transition-all duration-500 ease-in-out">
                            <div className="inline-flex items-center gap-2 mb-6 text-emerald-400 font-mono text-sm tracking-wider uppercase">
                                <CheckCircle2 className="w-4 h-4" /> Risk Radar Analysis
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Actionable Intelligence</h3>
                            <ul className="space-y-4 text-slate-300 font-mono text-sm">
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">01</div>
                                    <span>Predictive score stabilization</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">02</div>
                                    <span>Plain-English pattern alerts</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">03</div>
                                    <span>Pre-audit intervention signals</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 border-b border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated">01</div>
                            <h4 className="text-xl font-bold text-white mb-2">Enter DOT Number</h4>
                            <p className="text-slate-400">Instant connection to public FMCSA records.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated">02</div>
                            <h4 className="text-xl font-bold text-white mb-2">We Analyze Signals</h4>
                            <p className="text-slate-400">Algorithms scan for patterns, not just single violations.</p>
                        </div>
                        <div>
                            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 mb-6 font-mono text-2xl font-bold text-risk-elevated">03</div>
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
                            icon={Radar}
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

            {/* TESTIMONIALS */}
            <section className="py-24 border-t border-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-dark/95 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10" />

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-8 md:p-12 rounded-2xl relative">
                            {/* Quote Icon */}
                            <div className="absolute top-8 left-8 text-risk-elevated/20">
                                <FileText className="w-16 h-16" />
                            </div>

                            <div className="relative pt-10 text-center">
                                <p className="text-2xl md:text-3xl font-medium text-slate-200 leading-relaxed mb-8">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>

                                <div className="flex flex-col items-center">
                                    <div className="text-risk-elevated font-bold uppercase tracking-wider text-sm mb-1">
                                        {testimonials[activeTestimonial].role}
                                    </div>
                                    <div className="text-slate-500 font-mono text-sm">
                                        Operation Size: {testimonials[activeTestimonial].size}
                                    </div>
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="flex justify-center gap-2 mt-8">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTestimonial(i)}
                                        className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? 'bg-risk-elevated w-6' : 'bg-slate-700 hover:bg-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HIGH CONVERSION BLOCK */}
            <section className="py-24 bg-brand-dark">
                <div className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-20 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Know Your DOT Risk <br /> <span className="text-slate-500">Before It Becomes a Problem</span>
                        </h2>
                        <div className="max-w-xl mx-auto">
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-slate-800 bg-brand-dark text-slate-500 text-sm font-mono text-center">
                <p>&copy; {new Date().getFullYear()} DOT RISK RADAR. MISSION CRITICAL INTELLIGENCE.</p>
            </footer>
        </div>
    );
}

// Input Component extracted for re-use
function HeroInput({ dotNumber, setDotNumber, isTyping }: { dotNumber: string, setDotNumber: (v: string) => void, isTyping: boolean }) {
    return (
        <div className="w-full">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-risk-elevated to-amber-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input
                            type="text"
                            placeholder="ENTER DOT NUMBER"
                            className="pl-11 bg-slate-900/90 border-slate-700 text-white h-14 text-lg focus:border-risk-elevated focus:ring-risk-elevated/20 rounded-lg font-mono tracking-wider uppercase placeholder:text-slate-600"
                            value={dotNumber}
                            onChange={(e) => setDotNumber(e.target.value)}
                        />
                    </div>
                    <Button className="h-14 px-8 bg-risk-elevated hover:bg-amber-400 text-brand-dark font-bold rounded-lg text-lg uppercase tracking-wide min-w-[200px] transition-all relative overflow-hidden">
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
                <span className={`text-xs font-mono transition-colors duration-300 ${isTyping ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isTyping ? "Analyzing inspections, OOS trends, violation velocity..." : "No credit card. No sales calls."}
                </span>
                {isTyping && (
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-0" />
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-150" />
                        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce delay-300" />
                    </div>
                )}
            </div>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded hover:border-risk-elevated/30 transition-all group">
            <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-risk-elevated" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[90%]">
                {desc}
            </p>
        </div>
    )
}
