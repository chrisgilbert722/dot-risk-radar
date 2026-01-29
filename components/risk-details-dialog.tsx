import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, Lock, TrendingUp, History, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export type RiskDetail = {
    id: string
    title: string
    subtitle: string
    severity: 'critical' | 'warning' | 'info' | 'low'
    description: string // Trigger Summary
    context?: string // Why this matters
    metrics?: { label: string; value: string; delta?: string; trend?: 'up' | 'down' | 'neutral' }[]
    timestamp: string
    source?: string
    status: 'active' | 'acknowledged'
}

interface RiskDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    data: RiskDetail | null
    planName?: string
    onAcknowledge: (id: string) => void
}

export function RiskDetailsDialog({ open, onOpenChange, data, planName = 'starter', onAcknowledge }: RiskDetailsDialogProps) {
    if (!data) return null

    const isCritical = data.severity === 'critical'
    const isWarning = data.severity === 'warning'
    const isPremium = planName === 'pro' || planName === 'fleet'

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-slate-950 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={cn("p-2 rounded-full bg-slate-900 border",
                            isCritical ? "border-rose-500/50 text-rose-500" :
                                isWarning ? "border-amber-500/50 text-amber-500" : "border-slate-700 text-slate-400"
                        )}>
                            {isCritical ? <ShieldAlert className="w-6 h-6" /> :
                                isWarning ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">{data.title}</DialogTitle>
                            <DialogDescription className="text-slate-400 mt-1 flex items-center gap-2">
                                {data.subtitle} • {data.source || "Automated Risk Engine"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* 1. Trigger Summary */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Trigger Summary</h4>
                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                            <p className="text-sm font-medium leading-relaxed text-slate-200">
                                {data.description}
                            </p>
                        </div>
                    </div>

                    {/* 2. What Changed (Metrics) */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">What Changed</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {data.metrics?.map((metric, i) => (
                                <div key={i} className="bg-slate-900/30 p-3 rounded-lg border border-slate-800 flex flex-col justify-between">
                                    <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                                    <div className="mt-1">
                                        <div className="text-lg font-bold text-white">{metric.value}</div>
                                        {metric.delta && (
                                            <div className={cn("text-xs font-medium flex items-center gap-1",
                                                metric.trend === 'down' ? "text-rose-400" : "text-emerald-400"
                                            )}>
                                                {metric.delta}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )) || (
                                    <div className="col-span-4 text-sm text-slate-500 italic">No specific start metrics available.</div>
                                )}
                        </div>
                    </div>

                    {/* 3. Why This Matters (Context) */}
                    {data.context && (
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Why This Matters</h4>
                            <div className="flex gap-3 text-sm text-slate-400 bg-blue-950/20 p-3 rounded-lg border border-blue-900/30">
                                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <p>{data.context}</p>
                            </div>
                        </div>
                    )}

                    {/* 4. Plan Gating: Historical Trends */}
                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-center">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">90-Day Trend Analysis</h4>
                            {!isPremium && <Badge variant="secondary" className="bg-slate-800 text-[10px] text-slate-400 border-slate-700 h-5"><Lock className="w-3 h-3 mr-1" /> Pro Feature</Badge>}
                        </div>

                        <div className={cn("rounded-lg border border-slate-800 p-4 space-y-4", !isPremium && "opacity-90 blur-[2px] select-none pointer-events-none")}>
                            {/* Fake Chart Placeholders */}
                            <div className="flex items-end gap-2 h-24 w-full">
                                {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i} className="bg-slate-800 hover:bg-indigo-500/50 transition-colors w-full rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-600 font-mono">
                                <span>Nov 1</span>
                                <span>Dec 1</span>
                                <span>Jan 1</span>
                            </div>
                        </div>

                        {!isPremium && (
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-2xl text-center space-y-3 max-w-sm">
                                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white">Unlock Historical Trends</h3>
                                        <p className="text-sm text-slate-400 mt-1">Upgrade to Pro to view 90-day risk history and violation patterns.</p>
                                    </div>
                                    <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                        <Link href="/?pricing=true">Upgrade Now</Link>
                                    </Button>
                                    <p className="text-[10px] text-slate-500">Includes CSV exports & multi-fleet support</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 5. Recommended Action */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Recommended Action</h4>
                        <div className="flex gap-4 items-start bg-slate-900 p-4 rounded-lg">
                            <div className="bg-indigo-500/10 p-2 rounded-full text-indigo-400 mt-0.5">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-slate-200">Review Compliance Profile</p>
                                <p className="text-sm text-slate-400">
                                    Check recent inspection reports and driver logs for the identified period.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between items-center border-t border-slate-800 pt-4 mt-2">
                    <div className="text-xs text-slate-500">
                        Event ID: {data.id}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
                            Close
                        </Button>
                        <Button
                            onClick={() => {
                                onAcknowledge(data.id)
                                onOpenChange(false)
                            }}
                            className={cn(
                                "gap-2",
                                data.status === 'acknowledged' ? "bg-emerald-600 hover:bg-emerald-700" : ""
                            )}
                            disabled={data.status === 'acknowledged'}
                        >
                            {data.status === 'acknowledged' ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" /> Acknowledged
                                </>
                            ) : (
                                <>
                                    Acknowledge Risk
                                </>
                            )}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
