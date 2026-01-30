'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Activity, TrendingDown } from "lucide-react";

export function FleetSummaryCard({ score = "Good", riskCount = 3 }: { score?: string, riskCount?: number }) {
    return (
        <Card className="bg-slate-950 border-slate-800 mb-6 overflow-hidden relative">
            {/* Subtle background glow - keeping it calm as requested */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

            <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Left: Overall Status */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">Fleet Safety Status</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-0.5">
                            <span>Overall Rating:</span>
                            <span className="text-emerald-400 font-medium">Satisfactory</span>
                        </div>
                    </div>
                </div>

                {/* Center: Active Alerts */}
                <div className="flex items-center gap-4 w-full md:w-auto md:justify-center flex-1">
                    <div className="relative">
                        <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping opacity-75" />
                        <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center relative z-10 border border-rose-500/20">
                            <Activity className="w-5 h-5 text-rose-500" />
                        </div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white leading-none">{riskCount}</div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Active Alerts</div>
                    </div>
                </div>

                {/* Right: Trend */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-start md:justify-end">
                    <div className="text-right">
                        <div className="text-sm font-medium text-emerald-400 flex items-center gap-2 justify-end">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-lg">-2.4%</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">Risk Trend (30d)</div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
