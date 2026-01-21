/**
 * Feature Flags for Phase 8 Expansion.
 * All features MUST be disabled (false) by default.
 * Use valid environment variables to override in production/staging.
 */

export const FLAGS = {
    // Phase 8.1 - Compliance Vault
    FEATURE_COMPLIANCE_VAULT: process.env.FEATURE_COMPLIANCE_VAULT === 'true',

    // Phase 8.2 - Alert Delivery Channels
    FEATURE_ALERT_DELIVERY: process.env.FEATURE_ALERT_DELIVERY === 'true',

    // Phase 8.3 - DataQs Draft Assistant
    FEATURE_DATAQS_ASSIST: process.env.FEATURE_DATAQS_ASSIST === 'true',

    // Phase 8.4 - Fleet Rollups
    FEATURE_FLEET_ROLLUPS: process.env.FEATURE_FLEET_ROLLUPS === 'true',

    // Phase 8.5 - Programmatic SEO
    FEATURE_PROGRAMMATIC_SEO: process.env.FEATURE_PROGRAMMATIC_SEO === 'true',
} as const;

/**
 * Helper to enforce feature flag check.
 * Throws error if feature is disabled.
 */
export function requireFeature(flag: keyof typeof FLAGS) {
    if (!FLAGS[flag]) {
        throw new Error(`Feature ${flag} is currently disabled.`);
    }
}
