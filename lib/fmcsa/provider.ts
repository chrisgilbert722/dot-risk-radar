// FMCSA Data Provider
// Handles fetching, caching (12h rule), and storing FMCSA data
// NO RISK SCORING - only data fetching and normalization

import { createClient } from '@/lib/supabase/server';
import { fetchFMCSACarrierData } from './client';
import type { DotProfile, NormalizedDotProfile } from './types';

const CACHE_TTL_HOURS = 12;

export type FetchResult =
  | { success: true; data: DotProfile; source: 'fmcsa' | 'cache'; staleness?: number }
  | { success: false; error: string; userMessage: string; code?: string };

/**
 * Check if cached profile should be refreshed (12-hour rule)
 */
async function shouldRefreshProfile(dotNumber: string): Promise<boolean> {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('dot_profiles')
    .select('last_fetched_at')
    .eq('dot_number', dotNumber)
    .single();

  if (!profile) return true; // No cache, needs fetch

  if (!profile.last_fetched_at) return true; // Never fetched

  const lastFetch = new Date(profile.last_fetched_at);
  const now = new Date();
  const hoursSinceLastFetch =
    (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);

  return hoursSinceLastFetch >= CACHE_TTL_HOURS;
}

/**
 * Get cached DOT profile from database
 */
async function getCachedProfile(dotNumber: string): Promise<DotProfile | null> {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from('dot_profiles')
    .select('*')
    .eq('dot_number', dotNumber)
    .single();

  if (error || !profile) return null;

  return profile as DotProfile;
}

/**
 * Calculate cache staleness in hours
 */
function calculateStaleness(lastFetchedAt: Date | null): number {
  if (!lastFetchedAt) return Infinity;

  const now = new Date();
  const lastFetch = new Date(lastFetchedAt);
  return (now.getTime() - lastFetch.getTime()) / (1000 * 60 * 60);
}

/**
 * Store normalized FMCSA data in dot_profiles table
 */
async function storeDotProfile(
  normalized: NormalizedDotProfile
): Promise<DotProfile> {
  const supabase = await createClient();

  // Upsert by dot_number (UNIQUE constraint)
  const { data: profile, error } = await supabase
    .from('dot_profiles')
    .upsert(normalized, {
      onConflict: 'dot_number',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to store DOT profile: ${error.message}`);
  }

  return profile as DotProfile;
}

/**
 * Fetch FMCSA data and store in database
 * Returns raw data only - NO risk scoring
 */
/**
 * Fetch FMCSA data and store in database
 * Returns raw data only - NO risk scoring
 */
export async function fetchAndStoreDotProfile(
  dotNumber: string
): Promise<FetchResult> {
  try {
    // 1. Check if refresh is needed (12-hour rule)
    const needsRefresh = await shouldRefreshProfile(dotNumber);

    if (!needsRefresh) {
      const cached = await getCachedProfile(dotNumber);
      if (cached) {
        return {
          success: true,
          data: cached,
          source: 'cache',
          staleness: calculateStaleness(cached.last_fetched_at),
        };
      }
    }

    // 2. Fetch from FMCSA WebKey API (JSON)
    const result = await fetchFMCSACarrierData(dotNumber);

    if (!result.success) {
      // Return error with user-friendly message
      return {
        success: false,
        error: result.error || 'Unknown error',
        userMessage: 'Unable to retrieve carrier data. Please try again later.',
        code: result.statusCode ? result.statusCode.toString() : 'UNKNOWN',
      };
    }

    // 3. Normalize to dot_profiles schema
    const data = result.data;

    // Map JSON data to NormalizedDotProfile
    const normalized: NormalizedDotProfile = {
      dot_number: data.dotNumber,
      legal_name: data.legalName,
      dba_name: data.dbaName || null,
      physical_address: data.physicalAddress?.street || null,
      physical_city: data.physicalAddress?.city || null,
      physical_state: data.physicalAddress?.state || null,
      physical_zip: data.physicalAddress?.zipCode || null,
      operating_status: data.operatingStatus || null,
      entity_type: null,
      fmcsa_safety_rating: null,
      safety_rating_date: null,
      vehicle_oos_rate: null,
      driver_oos_rate: null,
      hazmat_oos_rate: null,
      total_inspections: 0,
      total_vehicles: data.numberOfPowerUnits || 0,
      total_drivers: data.numberOfDrivers || 0,
      raw_fmcsa_data: data as object,
      last_fetched_at: new Date(),
    };

    // 4. Store in database (upsert by dot_number)
    const profile = await storeDotProfile(normalized);

    return {
      success: true,
      data: profile,
      source: 'fmcsa',
    };
  } catch (error) {
    // Generic error
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      userMessage: 'Unable to retrieve carrier data. Please try again later.',
      code: 'UNKNOWN_ERROR',
    };
  }
}



/**
 * Get DOT profile (cached or fetch)
 * Convenience wrapper
 */
export async function getDotProfile(dotNumber: string): Promise<DotProfile | null> {
  const result = await fetchAndStoreDotProfile(dotNumber);
  return result.success ? result.data : null;
}
