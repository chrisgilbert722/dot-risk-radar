'use client'

import { useState, useMemo } from 'react'
import { markAlertAsRead } from '@/app/actions/alerts'
import { cn } from '@/lib/utils'
import { Bell, Check, Info, AlertTriangle, ShieldAlert, Circle, Activity, AlertOctagon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type AlertSeverity = 'info' | 'warning' | 'critical'

type Alert = {
    id: string
    dot_number: string
    alert_type: string
    summary: string
    severity?: AlertSeverity // Optional for backward compat, treat missing as 'info'
    is_read: boolean
    created_at: string
}

const SEVERITY_WEIGHT = {
    critical: 3,
    warning: 2,
    info: 1
}

export function AlertsFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
    const [alerts, setAlerts] = useState(initialAlerts)

    const sortedAlerts = useMemo(() => {
        return [...alerts].sort((a, b) => {
            // 1. Sort by Unread first? (User didn't ask, but good UX. User asked for "Sort newest first" originally, now "critical first...")
            // Prompt: "Sort order: critical first, then warning, then info; within each group newest first."
            // Also "Unread vs read distinction" exists visually.
            // Let's strictly follow prompt: Severity > Newest.

            const sevA = SEVERITY_WEIGHT[a.severity || 'info'] || 1
            const sevB = SEVERITY_WEIGHT[b.severity || 'info'] || 1

            if (sevA !== sevB) {
                return sevB - sevA // Higher severity first
            }

            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
    }, [alerts])

    const handleRead = async (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a))
        try {
            await markAlertAsRead(id)
        } catch (e) {
            console.error('Failed to mark alert as read', e)
        }
    }

    if (!alerts || alerts.length === 0) return null

    return (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 px-1">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold tracking-tight text-white">Recent Activity</h2>
            </div>

            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="divide-y divide-slate-800">
                    {sortedAlerts.map(alert => {
                        const severity = alert.severity || 'info'
                        return (
                            <div
                                key={alert.id}
                                className={cn(
                                    "p-4 flex gap-4 transition-all duration-200 cursor-pointer group relative",
                                    // Base styles
                                    !alert.is_read && severity === 'critical' ? "bg-rose-950/20 hover:bg-rose-950/30 border-l-2 border-rose-500" :
                                        !alert.is_read && severity === 'warning' ? "bg-amber-950/20 hover:bg-amber-950/30 border-l-2 border-amber-500" :
                                            !alert.is_read ? "bg-indigo-500/5 hover:bg-indigo-500/10 border-l-2 border-indigo-500" :
                                                "opacity-60 hover:opacity-100 hover:bg-slate-800/50 border-l-2 border-transparent"
                                )}
                                onClick={() => !alert.is_read && handleRead(alert.id)}
                            >
                                <div className="mt-1 shrink-0">
                                    <AlertIcon type={alert.alert_type} severity={severity} />
                                </div>
                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        severity === 'critical' ? 'destructive' :
                                                            severity === 'warning' ? 'secondary' : 'outline'
                                                    }
                                                    className={cn(
                                                        "uppercase text-[10px] px-1.5 py-0 tracking-wider h-5",
                                                        severity === 'warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                            severity === 'info' ? "text-slate-400 border-slate-700" : ""
                                                    )}
                                                >
                                                    {severity}
                                                </Badge>
                                                {!alert.is_read && (
                                                    <span className="shrink-0 flex h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                                                )}
                                            </div>
                                            <p className={cn("text-sm leading-snug break-words",
                                                !alert.is_read ? "font-semibold text-slate-100" : "text-slate-400"
                                            )}>
                                                {alert.summary}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                        <span className="font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                            DOT {alert.dot_number}
                                        </span>
                                        <span>•</span>
                                        <span>{new Date(alert.created_at).toLocaleDateString()}</span>

                                        {alert.is_read && <span className="ml-auto text-xs flex items-center gap-1"><Check className="w-3 h-3" /> Read</span>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Card>
        </div>
    )
}

function AlertIcon({ type, severity }: { type: string, severity: string }) {
    if (severity === 'critical') return <AlertOctagon className="w-5 h-5 text-rose-500" />
    if (severity === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />

    switch (type) {
        case 'risk_increase': return <ShieldAlert className="w-5 h-5 text-amber-500" />
        case 'violation': return <Info className="w-5 h-5 text-blue-400" />
        default: return <Circle className="w-5 h-5 text-slate-500" />
    }
}
