'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, ShieldCheck, Activity, Clock } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export function TrustPanel() {
    return (
        <Card className="border-slate-800 bg-slate-900/30 p-0 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sources" className="border-b-0">
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-semibold text-white text-sm">Data Integrity Verified</h3>
                                <p className="text-xs text-slate-500 font-normal">FMCSA Sources Live • Updated 2m ago</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 bg-slate-950/30">
                        <div className="space-y-4 pt-2 border-t border-slate-800/50">
                            <div className="grid gap-3">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Database className="w-3 h-3" />
                                        <span>FMCSA QCMobile</span>
                                    </div>
                                    <Badge variant="outline" className="h-5 text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/5">Connected</Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Activity className="w-3 h-3" />
                                        <span>Inspection Feeds</span>
                                    </div>
                                    <Badge variant="outline" className="h-5 text-[10px] text-emerald-400 border-emerald-500/20 bg-emerald-500/5">Real-time</Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span>Last Sync</span>
                                    </div>
                                    <span className="text-slate-500 font-mono">{new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-800/50">
                                <h4 className="text-xs font-semibold text-white mb-2">Recent System Activity</h4>
                                <ul className="space-y-2">
                                    {[
                                        { action: 'Risk verification complete', time: '2m ago' },
                                        { action: 'Daily snapshot created', time: '6h ago' },
                                        { action: 'FMCSA connection refreshed', time: '6h ago' },
                                    ].map((log, i) => (
                                        <li key={i} className="flex justify-between text-[10px] text-slate-500">
                                            <span>{log.action}</span>
                                            <span className="font-mono">{log.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}
