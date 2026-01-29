'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ShieldAlert, Activity, TrendingDown } from "lucide-react"

export function FleetSummaryCard({ score = "Good", riskCount = 3 }: { score?: string, riskCount?: number }) {
    return (
        <Card className="bg-gradient-to-r from-indigo-950 to-slate-950 border-slate-800 mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <CardContent className="p-6 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* Left: Overall Status */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
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

                <div className="h-10 w-px bg-slate-800 hidden md:block" />

                {/* Middle: Active Alerts */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white leading-none">{riskCount}</div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Active Alerts</div>
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-800 hidden md:block" />

                {/* Right: Trend */}
                <div className="flex items-center gap-4 pr-4">
                    <div className="text-right">
                        <div className="text-sm font-medium text-emerald-400 flex items-center gap-1 justify-end">
                            <TrendingDown className="w-3 h-3" />
                            -2.4%
                        </div>
                        <div className="text-xs text-slate-500">Risk Trend (30d)</div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
