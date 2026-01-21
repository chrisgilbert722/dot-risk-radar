'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BarChart3, ShieldCheck, TrendingUp, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function LandingPage() {
    const [dotNumber, setDotNumber] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string; carrierName?: string } | null>(null)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setResult(null)

        try {
            const response = await fetch(`/api/fmcsa/carrier?dot=${encodeURIComponent(dotNumber)}`)
            const data = await response.json()

            if (data.ok) {
                setResult({
                    success: true,
                    message: 'Carrier found!',
                    carrierName: data.carrier?.carrier?.legalName || data.carrier?.legalName || 'Unknown Carrier'
                })
            } else {
                setResult({
                    success: false,
                    message: data.error || 'Failed to fetch carrier data'
                })
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'Network error. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 selection:bg-brand-yellow/30 font-sans overflow-x-hidden">

            {/* Navbar */}
            <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-brand-dark/80 backdrop-blur-md">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-yellow rounded-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-brand-dark rounded-full" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">DOT Risk Radar</span>
                    </div>

                    <div className="flex items-center gap-8">
                        <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Button asChild className="hidden sm:flex bg-transparent border border-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/10 hover:text-brand-yellow rounded-full px-6 h-10">
                            <Link href="/signup">
                                Get Started
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-0 min-h-screen flex items-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-brand-yellow/5 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-t from-brand-yellow/5 to-transparent pointer-events-none rounded-full blur-3xl opacity-20" />

                <div className="container mx-auto px-6 relative z-10 h-full">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">

                        {/* Left Column: Copy + Risk Check Card */}
                        <div className="lg:col-span-5 flex flex-col gap-8 py-10">
                            <div className="space-y-6">
                                <Badge variant="outline" className="border-brand-yellow/20 text-brand-yellow bg-brand-yellow/5 px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold w-fit shadow-[0_0_15px_rgba(250,204,21,0.1)]">
                                    Public Beta Live
                                </Badge>
                                <h1 className="text-4xl lg:text-6xl font-extrabold text-white tracking-tighter leading-[1.1]">
                                    Know Your <span className="text-brand-yellow relative inline-block">
                                        Risk
                                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-yellow opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    </span>
                                    <br /> Before It Escalates
                                </h1>
                                <p className="text-lg text-slate-400 leading-relaxed max-w-lg font-medium">
                                    DOT inspection patterns translated into clear signals. Track risk shifts before audits, OOS events, and insurance hikes.
                                </p>
                            </div>

                            {/* Risk Check Form - High Fidelity Glass Card */}
                            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                                {/* Subtle gradient glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-dark flex items-center justify-center shadow-lg shadow-brand-yellow/20">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight">Check Risk Score</h3>
                                        <p className="text-xs text-slate-400 font-medium">Instant FMCSA Analysis</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">US DOT Number</label>
                                            <Input
                                                type="text"
                                                placeholder="e.g. 1234567"
                                                value={dotNumber}
                                                onChange={(e) => setDotNumber(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="bg-brand-dark/80 border-white/5 text-white placeholder:text-slate-600 focus:border-brand-yellow/50 focus:ring-brand-yellow/20 h-11 rounded-lg font-mono tracking-wide"
                                            />
                                        </div>
                                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Company Name</label>
                                            <Input
                                                type="text"
                                                placeholder="(Optional)"
                                                disabled={loading}
                                                className="bg-brand-dark/80 border-white/5 text-white placeholder:text-slate-600 focus:border-brand-yellow/50 focus:ring-brand-yellow/20 h-11 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <Input
                                            type="email"
                                            placeholder="safety@carrier.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="bg-brand-dark/80 border-white/5 text-white placeholder:text-slate-600 focus:border-brand-yellow/50 focus:ring-brand-yellow/20 h-11 rounded-lg"
                                        />
                                    </div>

                                    {/* Result Message */}
                                    {result && (
                                        <div className={`p-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${result.success
                                                ? 'bg-green-500/10 border border-green-500/20'
                                                : 'bg-red-500/10 border border-red-500/20'
                                            }`}>
                                            {result.success ? (
                                                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold ${result.success ? 'text-green-400' : 'text-red-400'
                                                    }`}>
                                                    {result.message}
                                                </p>
                                                {result.carrierName && (
                                                    <p className="text-xs text-slate-400 mt-1 truncate font-mono">
                                                        {result.carrierName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-12 bg-brand-yellow hover:bg-[#E5BC14] text-brand-dark font-bold text-base rounded-lg shadow-[0_4px_14px_0_rgba(250,204,21,0.39)] hover:shadow-[0_6px_20px_rgba(250,204,21,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                                    Analyzing...
                                                </>
                                            ) : (
                                                <>
                                                    Check Risk Score
                                                    <ArrowRight className="ml-2 w-4 h-4" />
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-center text-[10px] text-slate-500 mt-3 font-medium tracking-wide">
                                            NO CREDIT CARD REQUIRED • INSTANT SNAPSHOT
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Hero Image */}
                        <div className="lg:col-span-7 relative h-[50vh] lg:h-full min-h-[400px] flex items-center justify-center lg:justify-end overflow-visible">
                            {/* Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-yellow/5 rounded-full blur-[120px] -z-10" />

                            <div className="relative w-full max-w-[1000px] lg:-mr-32 xl:-mr-48 2xl:-mr-64 transform transition-transform duration-700 hover:scale-[1.02] ease-out">
                                <div className="aspect-[16/10] relative">
                                    <Image
                                        src="/images/hero-truck.png"
                                        alt="Commercial Truck Modern Hero"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 1000px"
                                        quality={100}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Strip */}
            <section className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm py-8 lg:py-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 opacity-60">
                        <span className="text-sm font-semibold text-slate-400 tracking-wider uppercase">
                            Trust indicators based on public data
                        </span>
                        <div className="flex flex-wrap items-center gap-8 lg:gap-12 grayscale hover:grayscale-0 transition-all duration-500">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-slate-400/20" />
                                <span className="font-bold text-slate-300">FMCSA DATA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-slate-400/20" />
                                <span className="font-bold text-slate-300">SAFER WEB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded bg-slate-400/20" />
                                <span className="font-bold text-slate-300">DOT CENSUS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-brand-dark relative z-10">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Complete Operational Visibility</h2>
                        <p className="text-slate-400">Everything you need to stay ahead of auditors and insurance renewals.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 hover:bg-white/[0.04] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Pattern Analysis</h3>
                            <p className="text-sm text-slate-400">Detect trends in your inspection data that trigger audits.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 hover:bg-white/[0.04] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Risk Trending</h3>
                            <p className="text-sm text-slate-400">Historical tracking of your safety posture over time.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 hover:bg-white/[0.04] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">OOS Detection</h3>
                            <p className="text-sm text-slate-400">Instant alerts for Out-of-Service violations.</p>
                        </div>

                        {/* Feature 4 */}
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-yellow/30 hover:bg-white/[0.04] transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Eye className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Compliance View</h3>
                            <p className="text-sm text-slate-400">See what insurance underwriters see when they look at you.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 bg-brand-dark text-slate-500 text-sm">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p>&copy; {new Date().getFullYear()} DOT Risk Radar. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
