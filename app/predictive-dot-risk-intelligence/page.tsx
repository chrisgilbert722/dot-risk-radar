
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Activity, Lock } from 'lucide-react';

export const metadata: Metadata = {
    title: "What Is Predictive DOT Risk Intelligence? | FMCSA Intelligence",
    description: "Predictive DOT Risk Intelligence goes beyond compliance tracking to forecast enforcement actions. Learn how data becomes a competitive advantage.",
};

export default function PredictiveRiskPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-amber-500/30">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                <header className="mb-16">
                    <div className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-4">Category Definition</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">What Is Predictive DOT Risk Intelligence?</h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Compliance tracking looks backward at what went wrong. Predictive intelligence looks forward at what is about to happen.
                    </p>
                </header>

                <div className="grid gap-16">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Activity className="w-6 h-6 text-amber-500" />
                            Difference Between Compliance Tracking and Risk Intelligence
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Traditional compliance software is a ledger: "Here is what happened." It tracks expiration dates and logs past violations.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                <strong>Predictive DOT Risk Intelligence</strong> is a radar: "Here is what will happen." It analyzes the velocity of your data points—how fast <Link href="/iss-score-trends" className="text-amber-500 hover:text-amber-400 underline underline-offset-4 decoration-amber-500/30">scores are rising</Link>, where <Link href="/dot-inspection-risk-signals" className="text-amber-500 hover:text-amber-400 underline underline-offset-4 decoration-amber-500/30">inspections are clustering</Link>, and how your patterns compare to enforcement thresholds—to forecast the next inspection or audit.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-emerald-400" />
                            Why Predictive Risk Exists Before Enforcement
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                The government does not act randomly. It acts on data. Before an investigator is assigned to your file, your data profile has likely been "red-flagged" for weeks or months.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                This gap—between the moment the risk signal appears in the data and the moment enforcement action is taken—is your window of opportunity. Predictive intelligence identifies this window so you can act before <Link href="/fm-csa-audit-risk-prediction" className="text-amber-500 hover:text-amber-400 underline underline-offset-4 decoration-amber-500/30">risk becomes intervention</Link>.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Lock className="w-6 h-6 text-slate-400" />
                            How FMCSA Data Becomes Enforcement Action
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                The path from data to action is algorithmic.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-4">
                                <li><strong>Input:</strong> Roadside officers input inspection results.</li>
                                <li><strong>Aggregation:</strong> FMCSA systems (MCMIS) aggregate this data nightly.</li>
                                <li><strong>Scoring:</strong> Algorithms (ISS, SMS) update your risk scores.</li>
                                <li><strong>Trigger:</strong> If scores cross a threshold, an alert is sent to state or federal partners to prioritize your fleet.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Who This Is For</h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed">
                                Predictive DOT Risk Intelligence is for any carrier—from single-truck owner-operators to enterprise fleets—who views their DOT number as their most valuable asset. It is for those who cannot afford the downtime of an out-of-service order or the reputational damage of a Conditional safety rating.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">See The Future of Your Fleet</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">Get the intelligence you need to stay ahead of enforcement.</p>
                    <Link href="/" className="inline-block bg-amber-500 text-brand-dark font-bold px-8 py-4 rounded hover:bg-amber-400 transition-colors uppercase tracking-wide">
                        Get Risk Intelligence
                    </Link>
                    <div className="mt-6">
                        <Link href="/fm-csa-audit-risk-prediction" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                            See how enforcement risk builds &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
