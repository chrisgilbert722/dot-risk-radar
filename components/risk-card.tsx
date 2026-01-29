'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RISK_LEVELS } from '@/lib/constants/messages'
import { RiskDetailsDialog, RiskDetail } from "@/components/risk-details-dialog"
import { Check, ChevronRight, TrendingUp, AlertCircle, Clock } from 'lucide-react'

export type RiskItem = {
    id: string;
    dotNumber: string;
    name: string;
    issue: string;
    date: string;
    level: string;
    changeLabel: string; // e.g., "+15 pts", "New Inspection", "+2 OOS"
    changeType: 'negative' | 'neutral' | 'positive';
};

interface RiskCardProps {
    risk: RiskItem
    level: string
    planName?: string
}

export function RiskCard({ risk, level, planName = 'starter' }: RiskCardProps) {
    const [open, setOpen] = useState(false)
    const [acknowledged, setAcknowledged] = useState(false)

    // Semantic colors - Halo Lab Style (Darker, crisper borders)
    const severityStyles = {
        [RISK_LEVELS.HIGH]: {
            border: 'border-rose-900/50 hover:border-rose-500',
            badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            icon: 'text-rose-500',
            glow: 'hover:shadow-[0_0_20px_-12px_rgba(244,63,94,0.3)]'
        },
        [RISK_LEVELS.ELEVATED]: {
            border: 'border-amber-900/50 hover:border-amber-500',
            badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            icon: 'text-amber-500',
            glow: 'hover:shadow-[0_0_20px_-12px_rgba(245,158,11,0.3)]'
        },
        [RISK_LEVELS.LOW]: {
            border: 'border-slate-800 hover:border-slate-600',
            badge: 'bg-slate-800 text-slate-400 border-slate-700',
            icon: 'text-slate-500',
            glow: 'hover:shadow-none'
        }
    }

    const style = severityStyles[level as keyof typeof severityStyles] || severityStyles[RISK_LEVELS.LOW]

    const detailData: RiskDetail = {
        id: risk.id,
        title: risk.name,
        subtitle: `DOT: ${risk.dotNumber}`,
        severity: level === RISK_LEVELS.HIGH ? 'critical' : level === RISK_LEVELS.ELEVATED ? 'warning' : 'info',
        description: risk.issue,
        timestamp: risk.date,
        status: acknowledged ? 'acknowledged' : 'active',
        source: 'Automated Risk Engine',
        // Mock Metrics for Phase 1 Visuals
        metrics: [
            { label: 'Risk Score', value: '78', delta: risk.changeType === 'negative' ? '+15' : '+0', trend: risk.changeType === 'negative' ? 'down' : 'neutral' },
            { label: 'OOS Rate', value: '12.5%', delta: '+2.1%', trend: 'down' },
            { label: 'Inspections', value: '24', delta: 'New', trend: 'neutral' },
            { label: 'Violations', value: '8', delta: '+3', trend: 'down' }
        ],
        context: "This carrier has exceeded the alert threshold for unsafe driving indicators in the last 30 days."
    }

    const handleAcknowledge = (e: React.MouseEvent) => {
        e.stopPropagation()
        setAcknowledged(true)
    }

    return (
        <>
            <Card
                className={cn(
                    "group relative transition-all duration-300 bg-slate-950/50 backdrop-blur-sm",
                    style.border,
                    style.glow,
                    acknowledged ? "opacity-50 grayscale sm:hover:opacity-100 sm:hover:grayscale-0" : ""
                )}
                onClick={() => setOpen(true)}
            >
                {/* Header: Company + Severity */}
                <div className="p-4 flex justify-between items-start border-b border-slate-800/50">
                    <div>
                        <h3 className="font-bold text-slate-100 leading-tight group-hover:text-indigo-300 transition-colors">
                            {risk.name}
                        </h3>
                        <p className="text-xs font-mono text-slate-500 mt-1">
                            DOT: {risk.dotNumber}
                        </p>
                    </div>
                    <Badge variant="outline" className={cn("uppercase text-[10px] tracking-wider", style.badge)}>
                        {level}
                    </Badge>
                </div>

                {/* Body: Issue + what changed */}
                <div className="p-4 space-y-4">
                    <p className="text-sm font-medium text-slate-300 leading-snug">
                        {risk.issue}
                    </p>

                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-slate-900 text-xs font-normal border border-slate-800 text-slate-400 flex items-center gap-1.5 px-2 py-1">
                            {risk.changeType === 'negative' ? <TrendingUp className="w-3 h-3 text-rose-400" /> : <AlertCircle className="w-3 h-3 text-amber-400" />}
                            {risk.changeLabel}
                        </Badge>
                    </div>
                </div>

                {/* Footer: Time + Actions */}
                <div className="p-3 bg-slate-900/30 border-t border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        {new Date(risk.date).toLocaleDateString()}
                    </div>

                    <div className="flex items-center gap-2">
                        {acknowledged ? (
                            <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Ack
                            </span>
                        ) : (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-slate-400 hover:text-white hover:bg-slate-800 px-2"
                                onClick={handleAcknowledge}
                            >
                                Acknowledge
                            </Button>
                        )}
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-500 group-hover:text-white">
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            <RiskDetailsDialog
                open={open}
                onOpenChange={setOpen}
                data={detailData}
                planName={planName}
                onAcknowledge={(id) => setAcknowledged(true)}
            />
        </>
    );
}
