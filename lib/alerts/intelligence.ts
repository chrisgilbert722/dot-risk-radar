import crypto from 'crypto';
import { FMCSACarrierData } from '@/lib/fmcsa/client';

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertType = 'risk_increase' | 'oos_spike' | 'inspection' | 'violation' | string;

// --- Constants & Thresholds ---
export const THRESHOLDS = {
    RISK_SCORE_DELTA_WARNING: 10,
    OOS_SPIKE_WINDOW_DAYS: 14,
    OOS_SPIKE_COUNT_CRITICAL: 2,
    INSPECTION_COOLDOWN_DAYS: 30,
    VIOLATION_COOLDOWN_DAYS: 30,
    ESCALATION_WINDOW_DAYS: 14,
    ESCALATION_COUNT_THRESHOLD: 2,
};

// --- Severity Mapping ---
export function computeSeverity(type: AlertType, context: any = {}): AlertSeverity {
    switch (type) {
        case 'oos_spike':
            return 'critical';
        case 'risk_increase':
        case 'violation':
            return 'warning';
        case 'inspection':
        default:
            return 'info';
    }
}

// --- Fingerprinting ---
// Format: ${dot_number}:${alert_type}:${windowKey}:${primaryKey}
export function computeFingerprint(
    dotNumber: string,
    type: AlertType,
    diffKey: string // primaryKey describing the specific change (e.g. 'status_change', 'oos_2024-01-01')
): string {
    const today = new Date().toISOString().split('T')[0]; // Daily window
    // For some alerts we might want a rolling window key, but for simple dedupe:
    // If we want to dedup "same alert today", use date.
    // If we want to dedup "exact same change ever", disable window key or use static.
    // Prompt suggests: windowKey is a time bucket e.g. daily "YYYY-MM-DD".

    return `${dotNumber}:${type}:${today}:${diffKey}`;
}

// --- Escalation Logic ---
// Pure logic: Given a count of recent alerts of this type, decide if we escalate.
export function maybeEscalateSeverity(
    currentSeverity: AlertSeverity,
    recentCount: number
): AlertSeverity {
    if (recentCount >= THRESHOLDS.ESCALATION_COUNT_THRESHOLD) {
        if (currentSeverity === 'info') return 'warning';
        if (currentSeverity === 'warning') return 'critical';
    }
    return currentSeverity;
}

// --- Cooldown / Creation Logic ---
// Returns true if we should create the alert, false if suppressed by cooldown
export function shouldCreateAlert(
    type: AlertType,
    lastAlertDate?: Date | null
): boolean {
    if (!lastAlertDate) return true;

    const daysSince = (Date.now() - lastAlertDate.getTime()) / (1000 * 60 * 60 * 24);

    if (type === 'inspection' && daysSince < THRESHOLDS.INSPECTION_COOLDOWN_DAYS) {
        return false;
    }

    if (type === 'violation' && daysSince < THRESHOLDS.VIOLATION_COOLDOWN_DAYS) {
        return false;
    }

    return true;
}
