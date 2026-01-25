'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, CheckCircle2, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function TrustScreen({ dotNumber }: { dotNumber: string }) {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        // Redirect to login with email pre-filled and return URL properly set
        router.push(`/login?email=${encodeURIComponent(email)}&next=/dashboard`);
    };

    return (
        <div className="w-full text-left animate-in fade-in zoom-in duration-500">
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative">
                {/* Top Gradient Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-risk-elevated to-amber-500" />

                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Here’s what inspectors would notice first.
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base">
                            Based on FMCSA inspection patterns and violation weighting — not guesswork.
                        </p>
                    </div>

                    {/* Risk Signal Card */}
                    <div className="bg-slate-950/50 border border-risk-elevated/20 rounded-lg p-5 mb-8 relative overflow-hidden">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded bg-risk-elevated/10 flex items-center justify-center shrink-0 border border-risk-elevated/20">
                                <ShieldAlert className="w-6 h-6 text-risk-elevated" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg mb-2">Inspection Risk Driver Detected</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    One or more recent compliance signals associated with increased roadside inspection probability were identified for this DOT number.
                                </p>

                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-start gap-2 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Certain violation categories carry higher ISS weighting</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>Carriers with similar profiles are inspected more frequently</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-sm text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                        <span>This alone does not guarantee an inspection — it increases likelihood</span>
                                    </li>
                                </ul>

                                <div className="text-[10px] text-slate-500 uppercase tracking-wide font-mono">
                                    DOT Risk Radar does not predict individual inspections. It identifies risk signals inspectors prioritize.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How It Works Section */}
                    <div className="mb-8">
                        <h4 className="text-white font-bold mb-4 font-mono uppercase tracking-wider text-sm">
                            How DOT Risk Radar calculates risk
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>FMCSA inspection, violation, and OOS data are continuously analyzed</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Signals are weighted using real enforcement and inspection patterns</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Raw data is translated into clear, operator-friendly risk indicators</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA Section */}
                    <form onSubmit={handleSubmit} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700">
                        <div className="flex flex-col gap-4">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-slate-950 border-slate-700 text-white h-12"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button
                                type="submit"
                                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-brand-dark font-bold text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all"
                            >
                                Send Me My Full Risk Report <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-4">
                            Includes full risk breakdown, contributing factors, and trend indicators.
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-600">
                            <Lock className="w-3 h-3" />
                            <span>No spam. Used only to deliver your report and alerts.</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
