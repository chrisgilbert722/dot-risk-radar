import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldCheck, BarChart3, Lock, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">

            {/* Navigation */}
            <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="font-bold text-xl tracking-tight text-white">
                        DOT Risk Radar
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </Link>
                        <Button asChild variant="secondary" className="hidden sm:flex bg-white text-slate-900 hover:bg-slate-200">
                            <Link href="/signup">
                                Check DOT Risk (Free)
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Badge variant="outline" className="mb-6 border-slate-700 text-slate-400 px-4 py-1.5 rounded-full">
                        Public Beta Now Live
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
                        Know Your DOT Risk<br className="hidden md:block" /> Before It Escalates
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Public DOT inspection patterns translated into plain English.
                        Monitor your operation's safety posture with ongoing analysis.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button asChild size="lg" className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white border-none">
                            <Link href="/signup">
                                Check DOT Risk (Free) <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                        <p className="text-xs text-slate-500 mt-2 sm:mt-0">
                            No credit card required to check risk.
                        </p>
                    </div>
                </div>

                {/* Subtle Background Elements - Professional/Abstract */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
            </section>

            {/* Factual Social Proof */}
            <section className="border-y border-slate-800 bg-slate-900/50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-6">
                        Analyzing Public Data For Compliance Consistency
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
                        {/* Placeholders for visual balance - Text only for "Factual" constraint */}
                        <span className="text-lg font-bold text-slate-400">FMCSA Data Patterns</span>
                        <span className="text-lg font-bold text-slate-400">Standardized Scoring</span>
                        <span className="text-lg font-bold text-slate-400">Inspection History</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Ongoing Risk Monitoring</h3>
                            <p className="text-slate-400 leading-relaxed">
                                We track public inspection data changes over time, helping you spot trends before they turn into repeat inspections.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                            <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4 text-emerald-400">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Plain English Alerts</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Complex violation codes translated into clear, actionable summaries. Know exactly what an inspection report means.
                            </p>
                        </div>

                        {/* Feature 3 - Vault (Coming Soon) */}
                        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden group">
                            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 text-slate-500">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-300">Compliance Vault</h3>
                                <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px] tracking-wide">COMING SOON</Badge>
                            </div>
                            <p className="text-slate-500 leading-relaxed">
                                Securely organize and store your driver qualification files and maintenance records in one audit-ready location.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-slate-800 relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Start Monitoring Your Carrier Today
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Get clarity on your public safety profile. No hidden fees, no credit card required to start.
                    </p>
                    <Button asChild size="lg" className="h-12 px-8 text-base bg-white text-slate-950 hover:bg-slate-200 border-none">
                        <Link href="/signup">
                            Check DOT Risk (Free)
                        </Link>
                    </Button>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        &copy; {new Date().getFullYear()} DOT Risk Radar. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
