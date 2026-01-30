'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Archive } from "lucide-react";
import Link from 'next/link';

export function FleetUpgradeCard() {
    return (
        <Card className="bg-slate-900/50 border-slate-800 mb-8 border-dashed">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Archive className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white">Advanced Fleet Intelligence</h3>
                        <p className="text-sm text-slate-400">Monitor multiple fleets, access API endpoints, and get predictive risk scoring.</p>
                    </div>
                </div>

                <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shrink-0" asChild>
                    <Link href="/dashboard/billing">
                        Upgrade to Fleet
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
