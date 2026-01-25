
import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Siren, TrendingUp, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
    title: "FMCSA Audit Risk Prediction Explained | DOT Risk Radar",
    description: "Learn how DOT Risk Radar identifies audit risk before enforcement action. Understand the role of ISS scores, inspection patterns, and risk escalation signals.",
};

export default function FmcsaAuditRiskPage() {
    return (
        <div className="min-h-screen bg-brand-dark text-slate-100 font-sans selection:bg-risk-elevated/30">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-slate-500 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
                </Link>

                <header className="mb-16">
                    <div className="text-risk-elevated font-mono text-sm tracking-widest uppercase mb-4">Risk Intelligence Briefing</div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">FMCSA Audit Risk Prediction Explained</h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Audit risk isn't random. It builds over time through specific enforcement signals. Understanding how these signals trigger FMCSA intervention is key to staying operational.
                    </p>
                </header>

                <div className="grid gap-16">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <Siren className="w-6 h-6 text-risk-elevated" />
                            How FMCSA Identifies Audit Risk
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                The FMCSA uses data-driven algorithms to identify high-risk carriers. This isn't just about a single bad inspection; it's about the profile your operation creates over time. When your data signals a pattern of non-compliance, you move from a standard operator to a "person of interest" within the enforcement network.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Automated systems flag carriers for intervention based on safety measurement system (SMS) data. This creates a "targeted" status long before a warning letter arrives.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-risk-high" />
                            Role of ISS Scores in Audit Selection
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Your Inspection Selection System (ISS) score is the primary metric roadside inspectors use to decide whether to inspect your vehicle. A <Link href="/iss-score-trends" className="text-risk-elevated hover:text-amber-400 underline underline-offset-4 decoration-amber-500/30">rising ISS score is a direct precursor</Link> to audit activity.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Scores above 75 (and definitely above 90) signal "Inspection Required." Persistent high scores indicate to the FMCSA that roadside enforcement isn't correcting the behavior, often triggering a more invasive compliance review or audit.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            Inspection Patterns That Precede Audits
                        </h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Audits are rarely surprises if you know what to look for. Common pre-audit patterns include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-slate-300 mb-4">
                                <li><strong>Cluster Violations:</strong> Multiple similar violations in a short period (e.g., brakes or hours of service).</li>
                                <li><strong>Rising OOS Rates:</strong> An Out-of-Service rate climbing above the national average (approx. 20-21%).</li>
                                <li><strong>Clean Inspection Droughts:</strong> A lack of clean Level 1 inspections to offset bad data.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Why Risk Escalates Before Notices Are Sent</h2>
                        <div className="prose prose-invert prose-slate max-w-none">
                            <p className="text-slate-300 leading-relaxed">
                                Enforcement is a lagging indicator. The risk builds up in the data first. By the time you receive a Notice of Claim or a Conditional rating, the data supporting that action has been accumulating for months. <Link href="/predictive-dot-risk-intelligence" className="text-risk-elevated hover:text-amber-400 underline underline-offset-4 decoration-amber-500/30">Predictive intelligence allows you to see this accumulation</Link> and reverse the trend before it crosses the administrative threshold.
                            </p>
                        </div>
                    </section>
                </div>

                <div className="mt-20 p-8 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Know Your Risk Profile Now</h3>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">Don't wait for an audit letter. See what inspectors see today.</p>
                    <Link href="/" className="inline-block bg-risk-elevated text-brand-dark font-bold px-8 py-4 rounded hover:bg-amber-400 transition-colors uppercase tracking-wide">
                        Check My Risk Free
                    </Link>
                    <div className="mt-6">
                        <Link href="/iss-score-trends" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                            Understand your ISS trend &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
