'use client'

import { useState } from 'react'
import { markAlertAsRead } from '@/app/actions/alerts'
import { cn } from '@/lib/utils'
import { Bell, Check, Info, AlertTriangle, ShieldAlert, Circle, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Alert = {
    id: string
    dot_number: string
    alert_type: 'risk_increase' | 'oos_spike' | 'inspection' | 'violation' | string
    summary: string
    is_read: boolean
    created_at: string
}

export function AlertsFeed({ initialAlerts }: { initialAlerts: Alert[] }) {
    const [alerts, setAlerts] = useState(initialAlerts)

    const handleRead = async (id: string) => {
        // Optimistic UI update
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
                    {alerts.map(alert => (
                        <div
                            key={alert.id}
                            className={cn(
                                "p-4 flex gap-4 transition-all duration-200 cursor-pointer group",
                                alert.is_read
                                    ? "opacity-60 hover:opacity-100 hover:bg-slate-800/50"
                                    : "bg-indigo-500/5 hover:bg-indigo-500/10 border-l-2 border-indigo-500"
                            )}
                            onClick={() => !alert.is_read && handleRead(alert.id)}
                        >
                            <div className="mt-1 shrink-0">
                                <AlertIcon type={alert.alert_type} />
                            </div>
                            <div className="flex-1 space-y-1 min-w-0">
                                <div className="flex justify-between items-start gap-4">
                                    <p className={cn("text-sm leading-snug break-words",
                                        !alert.is_read ? "font-semibold text-slate-100" : "text-slate-400"
                                    )}>
                                        {alert.summary}
                                    </p>
                                    {!alert.is_read && (
                                        <span className="shrink-0 flex h-2 w-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                        DOT {alert.dot_number}
                                    </span>
                                    <span>•</span>
                                    <span>{new Date(alert.created_at).toLocaleDateString()}</span>

                                    {alert.is_read && <span className="ml-auto text-xs flex items-center gap-1"><Check className="w-3 h-3" /> Read</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

function AlertIcon({ type }: { type: string }) {
    switch (type) {
        case 'risk_increase': return <ShieldAlert className="w-5 h-5 text-rose-500" />
        case 'oos_spike': return <AlertTriangle className="w-5 h-5 text-amber-500" />
        case 'violation': return <Info className="w-5 h-5 text-blue-400" />
        default: return <Circle className="w-5 h-5 text-slate-500" />
    }
}
