
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, Search, Activity } from 'lucide-react';

export const metadata: Metadata = {
    title: "ISS Score Trends and Enforcement Risk | DOT Risk Radar",
    description: "Understand how Inspection Selection System (ISS) scores drive DOT enforcement. Learn why score trends matter more than current values.",
};

export default function IssScoreTrendsPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-emerald-500/30">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                <header className="mb-16">
                    <div className="text-emerald-400 font-mono text-sm tracking-widest uppercase mb-4">Metric Deep Dive</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">ISS Score Trends and Enforcement Risk</h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Your ISS score determines whether your trucks keep rolling or get pulled in for inspection. Here is how the system works and why the trend line is your most critical metric.
                    </p>
                </header>

                <div className="grid gap-16">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Search className="w-6 h-6 text-emerald-400" />
                            What ISS Scores Measure
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                The Inspection Selection System (ISS) assigns a value from 1 to 100 to every DOT number. This score tells roadside inspectors one thing: <strong>how much data the FMCSA needs on you.</strong>
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                A high score means the system has identified safety concerns or a lack of data, prompting inspectors to "Prioritize for Inspection." A low score typically signals "Pass" or "Optional," allowing your drivers to bypass scales more often.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-risk-high" />
                            Why Score Direction Matters More Than Value
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                A static score of 60 is manageable. A score that jumps from 40 to 60 in a month is a crisis. Rapidly increasing scores attract algorithmic attention at the federal level.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Volatility suggests operational instability. Even if you are technically below the "Inspection Required" threshold (usually 75+), a sharp upward trend indicates that your safety controls are failing, often triggering <Link href="/fm-csa-audit-risk-prediction" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-400/30">targeted enforcement to arrest the slide</Link>.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-slate-400" />
                            How Inspectors Use ISS Trends
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Inspectors don't just see a number; they see a profile. If they see a carrier with worsening metrics, they are incentivized to inspect to confirm compliance or discover further violations.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-4">
                                <li><strong>75-100 (Inspect):</strong> Almost guaranteed inspection if the station is open.</li>
                                <li><strong>50-74 (Optional):</strong> Inspector's discretion, driven by visible defects or recent history.</li>
                                <li><strong>1-49 (Pass):</strong> Usually waived through unless a violation is obvious.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Early Warning Signs of Escalating Risk</h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed">
                                The earliest signs aren't the scores themselves, but the events feeding them. A series of driver fitness violations or a single "Unsafe Driving" citation can begin tipping the scale. Monitoring these <Link href="/dot-inspection-risk-signals" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-400/30">raw inputs allows you to predict the score change</Link> before it publishes.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Check Your ISS Trend</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">See if your enforcement profile is trending toward an audit.</p>
                    <Link href="/" className="inline-block bg-emerald-500 text-brand-dark font-bold px-8 py-4 rounded hover:bg-emerald-400 transition-colors uppercase tracking-wide">
                        View My Risk Profile
                    </Link>
                    <div className="mt-6">
                        <Link href="/fm-csa-audit-risk-prediction" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                            See what triggers audits &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
