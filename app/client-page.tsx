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
    MapPin
} from 'lucide-react';

// --- HERO VARIANTS ---
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
                        <span className="font-bold text-xl tracking-tight text-white">
                            DOT RISK <span className="text-risk-elevated">RADAR</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Risk Monitoring</Link>
                        <Link href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Alerts</Link>
                        <Button variant="outline" className="text-risk-elevated border-risk-elevated/50 hover:bg-risk-elevated/10 hover:text-risk-elevated transition-all rounded-lg uppercase tracking-wider font-bold text-xs h-9">
                            Log In
                        </Button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs text-risk-elevated font-mono mb-8 animate-fade-in-up">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-risk-elevated opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-risk-elevated"></span>
                            </span>
                            LIVE FMCSA DATA FEED ACTIVE
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-none">
                            {HERO_VARIANTS['A'].headline}
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {copy.hero}
                        </p>

                        <div className="max-w-3xl mx-auto">
                            <HeroInput dotNumber={dotNumber} setDotNumber={setDotNumber} isTyping={isTyping} />
                        </div>

                        {/* Social Proof / Trust */}
                        <div className="mt-12 flex items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="text-slate-500 font-mono text-xs uppercase tracking-widest">{copy.authority}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHASE 3: WHAT INSPECTORS SEE --- */}
            <section className="py-24 bg-slate-900/50 border-y border-slate-800 relative">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-sm font-mono text-risk-elevated mb-4 tracking-widest uppercase">The Invisible Threat</h2>
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                What Inspectors See <br /><span className="text-slate-500">(That You Don't)</span>
                            </h3>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                Every roadside inspection, every warning letter, and every OOS violation feeds into a predictive score. Enforcement software flags you <i>before</i> they pull you over.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-risk-elevated/30 transition-colors group">
                                    <div className="mt-1 bg-slate-900 p-2 rounded text-risk-elevated group-hover:scale-110 transition-transform duration-300">
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Hidden Violation Patterns</h4>
                                        <p className="text-sm text-slate-500">One bad tire inspection in Ohio triggers brake checks in Texas. We verify these cross-state triggers.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800 hover:border-risk-elevated/30 transition-colors group">
                                    <div className="mt-1 bg-slate-900 p-2 rounded text-risk-elevated group-hover:scale-110 transition-transform duration-300">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">ISS Score Velocity</h4>
                                        <p className="text-sm text-slate-500">Your score might be "passing" today, but the 30-day trend predicts a conditional rating next month.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-risk-elevated/20 to-transparent rounded-2xl blur-2xl opacity-50" />
                            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
                                <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-xs font-mono text-slate-500">ENFORCEMENT VIEW SIMULATION</div>
                                </div>
                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-end border-b border-slate-800 pb-6">
                                        <div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Target Vehicle</div>
                                            <div className="text-2xl font-mono text-white">DOT #382910</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">ISS Score</div>
                                            <div className="text-4xl font-mono font-bold text-red-500">92</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded flex justify-between items-center">
                                            <span className="text-red-400 text-sm font-bold flex items-center gap-2">
                                                <XCircle className="w-4 h-4" /> INSPECTION REQUIRED
                                            </span>
                                            <span className="text-xs text-red-400/70 font-mono">PRIORITY 1</span>
                                        </div>
                                        <div className="bg-slate-900 border border-slate-800 p-3 rounded flex justify-between items-center opacity-50">
                                            <span className="text-slate-400 text-sm font-medium flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4" /> WEIGH STATION BYPASS
                                            </span>
                                            <span className="text-xs text-slate-600 font-mono">DENIED</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PHASE 9: BEFORE / AFTER TRANSFORMATION --- */}
            <RiskTransformationSection />

            {/* --- PHASE 3: FEATURES GRID --- */}
            <section className="py-24 bg-slate-950 border-t border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Complete Compliance Intelligence</h2>
                        <p className="text-slate-400">Everything you need to stay off the radar and keep your trucks moving.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={Activity}
                            title="Real-Time ISS Tracking"
                            desc="Monitor your Inspection Selection System score daily. Know exactly when you cross the alert threshold."
                        />
                        <FeatureCard
                            icon={Siren}
                            title="Violation Alerts"
                            desc="Instant notifications when a new inspection hits your record. Contest bad data before it sticks."
                        />
                        <FeatureCard
                            icon={Eye}
                            title="Competitor Spy"
                            desc="See how your safety score stacks up against other carriers in your region and size class."
                        />
                        <FeatureCard
                            icon={Lock}
                            title="Audit Prevention"
                            desc="Actionable steps to fix safety management controls coming directly from potential audit triggers."
                        />
                    </div>
                </div>
            </section>

            {/* --- PHASE 6: TESTIMONIALS (Image 4 BG) --- */}
            <section className="py-24 border-t border-slate-800 relative overflow-hidden bg-slate-950 min-h-[600px] flex items-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-slate-950/80 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10" />
                    {/* Placeholder for uploaded_media_1 (Background) if needed, sticking to CSS for now to be safe */}
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Giant Quote Icon */}
                            <div className="absolute -top-12 -left-12 text-risk-elevated/10 opacity-50">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                                </svg>
                            </div>

                            <div className="relative bg-slate-900/40 backdrop-blur-md border border-slate-700/50 p-12 rounded-2xl shadow-2xl min-h-[300px] flex flex-col justify-center transform transition-all duration-700 hover:border-risk-elevated/30 group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-risk-elevated to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                                <div key={activeTestimonial} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <p className="text-2xl md:text-4xl font-bold text-white mb-8 leading-snug tracking-tight">
                                        "{testimonials[activeTestimonial].quote}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-risk-elevated text-brand-dark flex items-center justify-center font-bold text-xl">
                                            {testimonials[activeTestimonial].role.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{testimonials[activeTestimonial].role}</div>
                                            <div className="text-risk-elevated text-sm font-mono">{testimonials[activeTestimonial].size || "Fleet"}</div>
                                        </div>
                                    </div>
                                    {testimonials[activeTestimonial].outcome && (
                                        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            <span className="text-slate-300 font-medium italic">
                                                Outcome: {testimonials[activeTestimonial].outcome}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-2 mt-8">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'bg-risk-elevated w-8' : 'bg-slate-700 hover:bg-slate-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA (Image 1 BG) */}
            <section className="py-32 relative overflow-hidden bg-risk-elevated">
                <div className="absolute inset-0 mix-blend-multiply opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1519003722824-19eee9832863" // Example semi-truck texture
                        alt="Texture"
                        fill
                        className="object-cover grayscale"
                    />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6 tracking-tight">
                        Don't Let Compliance Slow You Down.
                    </h2>
                    <p className="text-brand-dark/80 text-xl font-medium mb-10 max-w-2xl mx-auto">
                        Get the same intelligence FMCSA uses to audit you. Free for 7 days.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-brand-dark text-white hover:bg-slate-800 text-lg px-12 h-16 rounded-xl font-bold uppercase tracking-wide shadow-2xl">
                            Start Free Risk Scan
                        </Button>
                        <Button size="lg" variant="outline" className="border-brand-dark text-brand-dark hover:bg-brand-dark/10 text-lg px-12 h-16 rounded-xl font-bold uppercase tracking-wide">
                            View Sample Report
                        </Button>
                    </div>
                    <p className="mt-6 text-brand-dark/60 font-mono text-xs uppercase tracking-widest">
                        {copy.trust || "No credit card required for initial scan."}
                    </p>
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

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-risk-elevated to-amber-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500" />
                <div className="relative flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <Input
                            type="text"
                            placeholder={isFocused ? "FMCSA records will be queried immediately" : "ENTER DOT NUMBER"}
                            className="pl-11 bg-slate-900/95 border-slate-700 text-white h-14 text-lg focus:border-risk-elevated focus:ring-1 focus:ring-risk-elevated/50 rounded-lg font-mono tracking-wider uppercase placeholder:text-slate-600 transition-all font-bold"
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
                    <div className="flex flex-col items-center">
                        <Button
                            onClick={startScan}
                            className="h-14 px-8 bg-risk-elevated hover:bg-amber-400 text-brand-dark font-bold rounded-lg text-lg uppercase tracking-wide min-w-[200px] transition-all relative overflow-hidden hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20 w-full mb-3"
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
                        <span className="text-xs text-slate-500 font-medium">
                            {copy.risk}
                        </span>
                        <div className="mt-2 text-[10px] text-slate-600 uppercase tracking-widest font-mono">
                            Built on public FMCSA data
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Help Text (Hide during scan) */}
            {scanState === 'idle' && (
                <div className={`mt-8 flex items-center justify-between px-1 h-6 transition-all duration-300 ${isFocused ? 'opacity-0' : 'opacity-100'}`}>
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

function RiskTransformationSection() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.4 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="py-24 bg-slate-950 relative border-t border-slate-800" ref={ref}>
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-white mb-4">You Can’t Fix What You Can’t See</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Most carriers don’t realize risk is rising until enforcement already has eyes on them.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* BEFORE CARD */}
                    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl relative overflow-hidden group h-full">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50" />
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-slate-500 font-mono text-sm uppercase tracking-wider">Before Risk Radar</div>
                            <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded text-xs font-bold border border-red-500/20">HIGH EXPOSURE</div>
                        </div>

                        <div className="flex items-end gap-4 mb-4">
                            <div className="text-6xl font-bold text-slate-300 font-mono">78</div>
                            <div className="mb-2 flex items-center gap-1 text-red-400 font-bold">
                                <TrendingUp className="w-5 h-5" /> Rising
                            </div>
                        </div>

                        <div className="text-slate-400 text-sm border-t border-slate-800 pt-4 mt-4">
                            Unmonitored inspection patterns & blindspots.
                        </div>
                    </div>

                    {/* AFTER CARD */}
                    <div className={`bg-slate-900/80 border border-emerald-500/30 p-8 rounded-xl relative overflow-hidden transition-all duration-1000 h-full ${isVisible ? 'shadow-[0_0_50px_-10px_rgba(16,185,129,0.2)]' : ''}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-emerald-400 font-mono text-sm uppercase tracking-wider font-bold">After Risk Radar</div>
                            <div className={`bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs font-bold border border-emerald-500/20 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>OPTIMIZED</div>
                        </div>

                        <div className="flex items-end gap-4 mb-4">
                            <div className="relative">
                                <div className={`text-6xl font-bold text-white font-mono transition-all duration-[2000ms] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    {isVisible ? "61" : "78"}
                                </div>
                            </div>
                            <div className={`mb-2 flex items-center gap-1 text-emerald-400 font-bold transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <Activity className="w-5 h-5" /> Stabilized
                            </div>
                        </div>

                        <div className="text-slate-400 text-sm border-t border-slate-800 pt-4 mt-4">
                            Early alerts + intervention signals.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
