/**
 * Centralized store for all user-facing alert messages and risk terminology.
 * Strictly adheres to "Low", "Elevated", "High" risk levels.
 * NO "Critical", "Severe", "Emergency", "Extreme", "Immediate".
 */

export const RISK_LEVELS = {
    LOW: 'Low',
    ELEVATED: 'Elevated',
    HIGH: 'High',
} as const;

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS];

export const ALERT_TEMPLATES = {
    RISK_LEVEL_INCREASE: {
        title: (level: string) => `Risk Level Escalated to ${level}`,
        body: (oldLevel: string, newLevel: string) => `Risk profile has shifted from ${oldLevel} to ${newLevel}. Review recommended.`,
    },
    RISK_SCORE_SPIKE: {
        title: (delta: number) => `Significant Risk Score Increase (+${delta} pts)`,
        body: (newScore: number, primaryFactor: string | null) =>
            `Score rose to ${newScore}. ${primaryFactor ? `Key driver: ${primaryFactor}.` : 'Multiple contributing factors detected.'}`,
    },
    OOS_DETECTED: {
        title: 'Out-of-Service Rate Increase Detected',
        body: 'New OOS violations have impacted your safety rating benchmarks.',
    },
    NEW_INSPECTION: {
        title: 'New Inspection Report Received',
        body: 'FMCSA data updated. View latest inspection details.',
    }
} as const;

export const DASHBOARD_STRINGS = {
    HEADERS: {
        HIGH: 'High Risk Fleets',
        ELEVATED: 'Elevated Risk Fleets',
        LOW: 'Monitoring (Low Risk)',
    },
    EMPTY_STATES: {
        HIGH: 'No high risk fleets at this time.',
        ELEVATED: 'No elevated risk fleets at this time.',
        LOW: 'No low risk fleets at this time.',
    },
    ACTIONS: {
        ACKNOWLEDGE: 'Acknowledge',
        MARK_READ: 'Mark as read',
    }
} as const;
