// FMCSA Data Types
// Aligned with supabase/migrations/20260120_phase2_fmcsa.sql

export type DotProfile = {
  id: string; // UUID
  dot_number: string; // UNIQUE

  // Company Information
  legal_name: string | null;
  dba_name: string | null;

  // Physical Address
  physical_address: string | null;
  physical_city: string | null;
  physical_state: string | null;
  physical_zip: string | null;

  // Status & Classification
  operating_status: string | null;
  entity_type: string | null;

  // FMCSA Safety Rating (theirs, not ours)
  fmcsa_safety_rating: string | null;
  safety_rating_date: Date | null;

  // Out-of-Service Rates (percentages)
  vehicle_oos_rate: number | null;
  driver_oos_rate: number | null;
  hazmat_oos_rate: number | null;

  // Aggregate Inspection Counts (trailing 24 months)
  total_inspections: number;
  total_vehicles: number;
  total_drivers: number;

  // Raw FMCSA Data (parsed JSONB, not XML string)
  raw_fmcsa_data: object | null;

  // Cache Management
  last_fetched_at: Date | null;

  // Timestamps
  created_at: Date;
  updated_at: Date;
};

export type RiskSnapshot = {
  id: string; // UUID
  dot_number: string; // FK to dot_profiles

  // Risk Assessment Results
  snapshot_date: Date; // Date only, not timestamp
  risk_level: 'High' | 'Elevated' | 'Low';
  risk_score: number; // 0-100

  // Risk Details (JSONB arrays)
  reasons: string[]; // Array of risk factor strings
  actions: string[]; // Array of recommended action strings

  // Raw Calculation Data
  raw_payload: object | null;

  // Timestamps
  created_at: Date;
};

// FMCSA API Response Types (based on WebKey XML structure)

export type FMCSACarrierSnapshot = {
  dotNumber: string;
  legalName: string;
  dbaName?: string;

  // Address
  phyStreet: string;
  phyCity: string;
  phyState: string;
  phyZipcode: string;

  // Status
  carrierOperation: string; // e.g., "AUTHORIZED FOR PROPERTY"
  entityType: string; // e.g., "CARRIER"

  // Safety Rating
  safetyRating?: string; // e.g., "SATISFACTORY", "UNSATISFACTORY", "CONDITIONAL"
  safetyRatingDate?: string; // ISO date string

  // Out-of-Service Rates
  vehicleOOS?: number;
  driverOOS?: number;
  hazmatOOS?: number;
  totalVehicleInsp?: number;
  totalDriverInsp?: number;
  totalHazmatInsp?: number;

  // Inspection Counts
  totalPowerUnits?: number;
  totalDrivers?: number;
  totalInspections?: number;
};

// Normalized data from FMCSA (for upsert to dot_profiles)
export type NormalizedDotProfile = {
  dot_number: string;
  legal_name: string | null;
  dba_name: string | null;
  physical_address: string | null;
  physical_city: string | null;
  physical_state: string | null;
  physical_zip: string | null;
  operating_status: string | null;
  entity_type: string | null;
  fmcsa_safety_rating: string | null;
  safety_rating_date: Date | null;
  vehicle_oos_rate: number | null;
  driver_oos_rate: number | null;
  hazmat_oos_rate: number | null;
  total_inspections: number;
  total_vehicles: number;
  total_drivers: number;
  raw_fmcsa_data: object;
  last_fetched_at: Date;
};

// Risk calculation input
export type RiskCalculationInput = {
  dot_number: string;
  fmcsa_safety_rating: string | null;
  vehicle_oos_rate: number | null;
  driver_oos_rate: number | null;
  hazmat_oos_rate: number | null;
  total_inspections: number;
};

// Risk calculation output
export type RiskCalculationResult = {
  risk_level: 'High' | 'Elevated' | 'Low';
  risk_score: number;
  reasons: string[];
  actions: string[];
  raw_payload: object;
};
