
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Radar, Map, XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: "DOT Inspection Risk Signals Explained | DOT Risk Radar",
    description: "Learn what triggers increased DOT inspections. Understand cross-state correlation, OOS multipliers, and enforcement patterns.",
};

export default function DotInspectionRiskPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-red-500/30">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                <header className="mb-16">
                    <div className="text-red-400 font-mono text-sm tracking-widest uppercase mb-4">Signal Analysis</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">DOT Inspection Risk Signals Explained</h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Inspections tend to happen in clusters. Understanding the signals that trigger these clusters can help you break the cycle of enforcement.
                    </p>
                </header>

                <div className="grid gap-16">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Radar className="w-6 h-6 text-red-500" />
                            What Triggers Increased Inspections
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Inspection frequency is rarely random. It is usually triggered by "visible" flaws—lights, tires, load securement—or systemic flags like a lapsed UCR or outdated MCS-150.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Once a vehicle is pulled in, the inspector's computer system (like Aspen) alerts them to your carrier history. If you have recent bad inspections, the likelihood of a Level 1 (full) inspection skyrockets. This creates a feedback loop: <Link href="/iss-score-trends" className="text-red-400 hover:text-red-300 underline underline-offset-4 decoration-red-500/30">bad data invites more scrutiny</Link>, which generates more data.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Map className="w-6 h-6 text-slate-400" />
                            Cross-State Inspection Correlation
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Many carriers believe state agencies operate in silos. They don't. A violation in Ohio is immediately visible to an officer in Texas.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                FMCSA systems correlate this activity. If you suddenly show a spike in brake violations across three different states, it suggests a centralized maintenance failure, not just a bad driver or a "strict cop." This multi-state pattern is a primary trigger for <Link href="/fm-csa-audit-risk-prediction" className="text-red-400 hover:text-red-300 underline underline-offset-4 decoration-red-500/30">federal compliance reviews</Link>.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-red-500" />
                            OOS Events as Risk Multipliers
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Out-of-Service (OOS) violations are the heaviest weighted events in the risk algorithm. They don't just add component points; they signal that your operation put the public in immediate danger.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                A single OOS event is recoverable. A cluster of OOS events (e.g., 3 in 2 months) acts as a powerful multiplier, pushing your risk profile into the "High Priority" zone for months or years.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">How Enforcement Patterns Form</h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed">
                                Enforcement patterns typically follow a "Testing" phase. Inspectors will hit a few units to test the fleet's health. If they find issues, the "Enforcement" phase begins, where every unit sighted is stopped. Breaking this pattern requires a string of clean inspections to statistically prove the issue is resolved.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Break the Enforcement Cycle</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">Identify the signals triggering your inspections before your next run.</p>
                    <Link href="/" className="inline-block bg-red-500 text-brand-dark font-bold px-8 py-4 rounded hover:bg-red-400 transition-colors uppercase tracking-wide">
                        Scan For Risk Signals
                    </Link>
                    <div className="mt-6">
                        <Link href="/iss-score-trends" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                            See how signals act as multipliers &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
