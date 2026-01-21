-- Phase 2: FMCSA Data Integration
-- Creates core tables for DOT profile storage and risk assessment

-- Table: dot_profiles
-- Stores FMCSA carrier snapshot data
CREATE TABLE IF NOT EXISTS dot_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dot_number text UNIQUE NOT NULL,

  -- Company Information
  legal_name text,
  dba_name text,

  -- Physical Address
  physical_address text,
  physical_city text,
  physical_state text,
  physical_zip text,

  -- Status & Classification
  operating_status text,
  entity_type text,

  -- FMCSA Safety Rating (theirs, not ours)
  fmcsa_safety_rating text,
  safety_rating_date timestamptz,

  -- Out-of-Service Rates (percentages)
  vehicle_oos_rate numeric,
  driver_oos_rate numeric,
  hazmat_oos_rate numeric,

  -- Aggregate Inspection Counts (trailing 24 months)
  total_inspections integer DEFAULT 0,
  total_vehicles integer DEFAULT 0,
  total_drivers integer DEFAULT 0,

  -- Raw FMCSA Data (parsed JSONB, not XML string)
  raw_fmcsa_data jsonb,

  -- Cache Management
  last_fetched_at timestamptz,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index for fast DOT number lookup
CREATE INDEX IF NOT EXISTS idx_dot_profiles_dot_number ON dot_profiles(dot_number);

-- Index for cache refresh queries
CREATE INDEX IF NOT EXISTS idx_dot_profiles_last_fetched ON dot_profiles(last_fetched_at);

-- Table: risk_snapshots
-- Stores calculated risk assessments (separate from FMCSA data)
CREATE TABLE IF NOT EXISTS risk_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dot_number text NOT NULL REFERENCES dot_profiles(dot_number) ON DELETE CASCADE,

  -- Risk Assessment Results
  snapshot_date date NOT NULL,
  risk_level text NOT NULL CHECK (risk_level IN ('High', 'Elevated', 'Low')),
  risk_score numeric NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),

  -- Risk Details (JSONB arrays)
  reasons jsonb DEFAULT '[]'::jsonb,  -- Array of risk factor strings
  actions jsonb DEFAULT '[]'::jsonb,  -- Array of recommended action strings

  -- Raw Calculation Data
  raw_payload jsonb,

  -- Timestamps
  created_at timestamptz DEFAULT now(),

  -- Unique constraint: one snapshot per dot_number per day
  UNIQUE(dot_number, snapshot_date)
);

-- Index for latest snapshot queries
CREATE INDEX IF NOT EXISTS idx_risk_snapshots_dot_number ON risk_snapshots(dot_number, snapshot_date DESC);

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_risk_snapshots_date ON risk_snapshots(snapshot_date);

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at on dot_profiles
DROP TRIGGER IF EXISTS update_dot_profiles_updated_at ON dot_profiles;
CREATE TRIGGER update_dot_profiles_updated_at
  BEFORE UPDATE ON dot_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies (optional - adjust based on your auth requirements)
-- For now, allowing authenticated users to read all profiles
ALTER TABLE dot_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read dot_profiles"
  ON dot_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read risk_snapshots"
  ON risk_snapshots FOR SELECT
  TO authenticated
  USING (true);

-- Service role can insert/update (for background jobs)
CREATE POLICY "Allow service role to manage dot_profiles"
  ON dot_profiles FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Allow service role to manage risk_snapshots"
  ON risk_snapshots FOR ALL
  TO service_role
  USING (true);
