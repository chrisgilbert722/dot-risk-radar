// Risk Scoring Engine
// Calculates risk scores and levels from dot_profiles data
// Writes to existing risk_snapshots table schema

import { createClient } from '@/lib/supabase/server';
import type { DotProfile, RiskSnapshot, RiskCalculationInput, RiskCalculationResult } from '../fmcsa/types';

// Industry benchmarks (can be tuned)
const BENCHMARKS = {
  VEHICLE_OOS_THRESHOLD: 10.0, // 10%
  DRIVER_OOS_THRESHOLD: 5.0, // 5%
  HAZMAT_OOS_THRESHOLD: 8.0, // 8%
  MIN_INSPECTIONS_FOR_CONFIDENCE: 10,
};

/**
 * Calculate risk score (0-100) from dot_profile data
 */
function calculateRiskScore(input: RiskCalculationInput): number {
  let score = 0;

  // Factor 1: FMCSA Safety Rating (40 points max)
  if (input.fmcsa_safety_rating === 'UNSATISFACTORY') {
    score += 40;
  } else if (input.fmcsa_safety_rating === 'CONDITIONAL') {
    score += 20;
  } else if (input.fmcsa_safety_rating === 'SATISFACTORY') {
    score += 0;
  } else {
    // Not rated - neutral
    score += 10;
  }

  // Factor 2: Vehicle OOS Rate (25 points max)
  if (input.vehicle_oos_rate !== null) {
    if (input.vehicle_oos_rate > BENCHMARKS.VEHICLE_OOS_THRESHOLD * 2) {
      score += 25;
    } else if (input.vehicle_oos_rate > BENCHMARKS.VEHICLE_OOS_THRESHOLD) {
      score += 15;
    }
  }

  // Factor 3: Driver OOS Rate (20 points max)
  if (input.driver_oos_rate !== null) {
    if (input.driver_oos_rate > BENCHMARKS.DRIVER_OOS_THRESHOLD * 2) {
      score += 20;
    } else if (input.driver_oos_rate > BENCHMARKS.DRIVER_OOS_THRESHOLD) {
      score += 10;
    }
  }

  // Factor 4: Hazmat OOS Rate (15 points max, if applicable)
  if (input.hazmat_oos_rate !== null && input.hazmat_oos_rate > 0) {
    if (input.hazmat_oos_rate > BENCHMARKS.HAZMAT_OOS_THRESHOLD) {
      score += 15;
    } else if (input.hazmat_oos_rate > BENCHMARKS.HAZMAT_OOS_THRESHOLD / 2) {
      score += 8;
    }
  }

  return Math.min(score, 100); // Cap at 100
}

/**
 * Categorize risk score into High/Elevated/Low
 */
function categorizeRisk(score: number): 'High' | 'Elevated' | 'Low' {
  if (score >= 60) return 'High';
  if (score >= 30) return 'Elevated';
  return 'Low';
}

/**
 * Identify risk factors (plain English reasons)
 */
function identifyRiskFactors(input: RiskCalculationInput): string[] {
  const factors: string[] = [];

  // FMCSA Safety Rating
  if (input.fmcsa_safety_rating === 'UNSATISFACTORY') {
    factors.push('Unsatisfactory FMCSA safety rating');
  } else if (input.fmcsa_safety_rating === 'CONDITIONAL') {
    factors.push('Conditional FMCSA safety rating');
  }

  // Vehicle OOS Rate
  if (input.vehicle_oos_rate !== null) {
    if (input.vehicle_oos_rate > BENCHMARKS.VEHICLE_OOS_THRESHOLD) {
      factors.push(
        `Vehicle out-of-service rate (${input.vehicle_oos_rate.toFixed(1)}%) above industry average`
      );
    }
  }

  // Driver OOS Rate
  if (input.driver_oos_rate !== null) {
    if (input.driver_oos_rate > BENCHMARKS.DRIVER_OOS_THRESHOLD) {
      factors.push(
        `Driver out-of-service rate (${input.driver_oos_rate.toFixed(1)}%) above industry average`
      );
    }
  }

  // Hazmat OOS Rate
  if (input.hazmat_oos_rate !== null && input.hazmat_oos_rate > 0) {
    if (input.hazmat_oos_rate > BENCHMARKS.HAZMAT_OOS_THRESHOLD) {
      factors.push(
        `Hazmat out-of-service rate (${input.hazmat_oos_rate.toFixed(1)}%) above industry average`
      );
    }
  }

  // Low inspection count warning
  if (input.total_inspections < BENCHMARKS.MIN_INSPECTIONS_FOR_CONFIDENCE) {
    factors.push('Limited inspection history - assessment based on available data');
  }

  return factors;
}

/**
 * Generate recommended actions
 */
function generateActions(input: RiskCalculationInput, riskLevel: 'High' | 'Elevated' | 'Low'): string[] {
  const actions: string[] = [];

  if (riskLevel === 'High' || riskLevel === 'Elevated') {
    // Vehicle-related actions
    if (input.vehicle_oos_rate && input.vehicle_oos_rate > BENCHMARKS.VEHICLE_OOS_THRESHOLD) {
      actions.push('Review vehicle maintenance procedures');
      actions.push('Conduct pre-trip inspection training');
    }

    // Driver-related actions
    if (input.driver_oos_rate && input.driver_oos_rate > BENCHMARKS.DRIVER_OOS_THRESHOLD) {
      actions.push('Review driver qualification files');
      actions.push('Implement driver compliance training');
    }

    // Safety rating actions
    if (input.fmcsa_safety_rating === 'UNSATISFACTORY' || input.fmcsa_safety_rating === 'CONDITIONAL') {
      actions.push('Consult with compliance specialist');
      actions.push('Develop safety improvement plan');
    }
  }

  if (actions.length === 0 && riskLevel === 'Low') {
    actions.push('Continue ongoing monitoring');
    actions.push('Maintain current safety practices');
  }

  return actions;
}

/**
 * Calculate risk assessment from dot_profile
 */
export function calculateRiskAssessment(profile: DotProfile): RiskCalculationResult {
  const input: RiskCalculationInput = {
    dot_number: profile.dot_number,
    fmcsa_safety_rating: profile.fmcsa_safety_rating,
    vehicle_oos_rate: profile.vehicle_oos_rate,
    driver_oos_rate: profile.driver_oos_rate,
    hazmat_oos_rate: profile.hazmat_oos_rate,
    total_inspections: profile.total_inspections,
  };

  const risk_score = calculateRiskScore(input);
  const risk_level = categorizeRisk(risk_score);
  const reasons = identifyRiskFactors(input);
  const actions = generateActions(input, risk_level);

  return {
    risk_level,
    risk_score,
    reasons,
    actions,
    raw_payload: input as object,
  };
}

/**
 * Store risk snapshot in database (using existing risk_snapshots schema)
 */
export async function storeRiskSnapshot(
  dotNumber: string,
  assessment: RiskCalculationResult
): Promise<RiskSnapshot> {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0]; // Date only (YYYY-MM-DD)

  // Upsert by (dot_number, snapshot_date) - unique constraint
  const { data: snapshot, error } = await supabase
    .from('risk_snapshots')
    .upsert(
      {
        dot_number: dotNumber,
        snapshot_date: today,
        risk_level: assessment.risk_level,
        risk_score: assessment.risk_score,
        reasons: assessment.reasons,
        actions: assessment.actions,
        raw_payload: assessment.raw_payload,
      },
      {
        onConflict: 'dot_number,snapshot_date',
      }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store risk snapshot: ${error.message}`);
  }

  return snapshot as RiskSnapshot;
}

/**
 * Get latest risk snapshot for a DOT number
 */
export async function getLatestRiskSnapshot(dotNumber: string): Promise<RiskSnapshot | null> {
  const supabase = await createClient();

  const { data: snapshot } = await supabase
    .from('risk_snapshots')
    .select('*')
    .eq('dot_number', dotNumber)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  return snapshot as RiskSnapshot | null;
}

/**
 * Calculate and store risk assessment for a DOT number
 * Main entry point for risk scoring
 */
export async function assessDotRisk(dotNumber: string): Promise<RiskSnapshot> {
  // Get dot_profile (must exist)
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from('dot_profiles')
    .select('*')
    .eq('dot_number', dotNumber)
    .single();

  if (error || !profile) {
    throw new Error(`DOT profile not found: ${dotNumber}`);
  }

  // Calculate risk assessment
  const assessment = calculateRiskAssessment(profile as DotProfile);

  // Store in risk_snapshots
  return await storeRiskSnapshot(dotNumber, assessment);
}
