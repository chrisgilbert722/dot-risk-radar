'use client';

import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { PlanGuard } from "./plan-guard";

export function TrendChart({ userPlan = 'starter' }: { userPlan?: string }) {
    return (
        <Card className="p-6 border-slate-800 bg-slate-950/50">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-white">Risk trend (90 Days)</h3>
            </div>

            <PlanGuard
                userPlan={userPlan}
                minPlan="pro"
                blurText="Upgrade to Pro to unlock 90-day risk trends"
            >
                {/* Mock Chart Visual */}
                <div className="h-48 flex items-end gap-2 px-2">
                    {[40, 65, 45, 80, 55, 70, 45, 60, 75, 50, 65, 85].map((height, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500/40 transition-colors relative group"
                            style={{ height: `${height}%` }}
                        >
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-slate-500 font-mono">
                    <span>90 days ago</span>
                    <span>Today</span>
                </div>
            </PlanGuard>
        </Card>
    );
}
