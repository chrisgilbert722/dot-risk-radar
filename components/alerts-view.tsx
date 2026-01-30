"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { RiskItem, RiskCard } from "@/components/risk-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RISK_LEVELS } from "@/lib/constants/messages";

type FilterType = "ALL" | "HIGH" | "ELEVATED" | "ACKNOWLEDGED";

interface AlertsViewProps {
    initialAlerts: (RiskItem & { isAcknowledged?: boolean })[];
    planName: string;
}

export function AlertsView({ initialAlerts, planName }: AlertsViewProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Get filter from URL or default to ALL
    const filter = (searchParams.get("filter") as FilterType) || "ALL";

    const setFilter = (newFilter: FilterType) => {
        const params = new URLSearchParams(searchParams.toString());
        if (newFilter === "ALL") {
            params.delete("filter");
        } else {
            params.set("filter", newFilter);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filteredAlerts = initialAlerts.filter((item) => {
        if (filter === "ALL") return true;
        if (filter === "ACKNOWLEDGED") return item.isAcknowledged;
        if (filter === "HIGH") return item.level === RISK_LEVELS.HIGH || item.level === 'critical';
        if (filter === "ELEVATED") return item.level === RISK_LEVELS.ELEVATED || item.level === 'warning';
        return true;
    });

    const counts = {
        ALL: initialAlerts.length,
        HIGH: initialAlerts.filter(i => i.level === RISK_LEVELS.HIGH || i.level === 'critical').length,
        ELEVATED: initialAlerts.filter(i => i.level === RISK_LEVELS.ELEVATED || i.level === 'warning').length,
        ACKNOWLEDGED: initialAlerts.filter(i => i.isAcknowledged).length
    };

    return (
        <div className="space-y-8">
            {/* Visual Filters */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-800 w-fit">
                <FilterButton
                    active={filter === "ALL"}
                    onClick={() => setFilter("ALL")}
                    label="All Alerts"
                    count={counts.ALL}
                />
                <FilterButton
                    active={filter === "HIGH"}
                    onClick={() => setFilter("HIGH")}
                    label="High Priority"
                    count={counts.HIGH}
                    variant="high"
                />
                <FilterButton
                    active={filter === "ELEVATED"}
                    onClick={() => setFilter("ELEVATED")}
                    label="Elevated"
                    count={counts.ELEVATED}
                    variant="elevated"
                />
                <FilterButton
                    active={filter === "ACKNOWLEDGED"}
                    onClick={() => setFilter("ACKNOWLEDGED")}
                    label="Acknowledged"
                    count={counts.ACKNOWLEDGED}
                    variant="acknowledged"
                />
            </div>

            {/* Alerts List */}
            {filteredAlerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {filteredAlerts.map((item) => (
                        <RiskCard
                            key={item.id}
                            risk={item}
                            level={item.level as any}
                            planName={planName}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <p className="text-slate-500">No alerts found for this filter.</p>
                </div>
            )}
        </div>
    );
}

function FilterButton({ active, onClick, label, count, variant }: { active: boolean, onClick: () => void, label: string, count: number, variant?: 'high' | 'elevated' | 'acknowledged' }) {
    let activeClass = "bg-slate-800 text-white shadow-sm";
    let inactiveClass = "text-slate-400 hover:text-white hover:bg-slate-800/50";

    // Optional: Add specific coloring for active states if desired, keeping it subtle for now or matching dashboard style
    if (active && variant === 'high') activeClass = "bg-rose-500/20 text-rose-300 border border-rose-500/20";
    if (active && variant === 'elevated') activeClass = "bg-amber-500/20 text-amber-300 border border-amber-500/20";
    if (active && variant === 'acknowledged') activeClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20";


    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={`transition-all ${active ? activeClass : inactiveClass}`}
        >
            {label}
            {count > 0 && (
                <Badge className={`ml-2 border-none ${active ? "bg-black/20" : "bg-slate-800 text-slate-500"}`}>
                    {count}
                </Badge>
            )}
        </Button>
    )
}
