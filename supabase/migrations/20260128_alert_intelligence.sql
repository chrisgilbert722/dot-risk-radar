-- Migration: 20260128_alert_intelligence
-- Description: Adds severity, fingerprinting, and deduplication to alerts system

-- 1. Severity Column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'severity') THEN
        ALTER TABLE public.alerts ADD COLUMN severity text NOT NULL DEFAULT 'info';
        ALTER TABLE public.alerts ADD CONSTRAINT alerts_severity_check CHECK (severity IN ('info', 'warning', 'critical'));
    END IF;
END $$;

-- 2. Fingerprint Column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'fingerprint') THEN
        ALTER TABLE public.alerts ADD COLUMN fingerprint text NULL;
    END IF;
END $$;

-- 3. Is Emailed Column (Idempotency check, might already exist from previous step)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'is_emailed') THEN
        ALTER TABLE public.alerts ADD COLUMN is_emailed boolean NOT NULL DEFAULT false;
    END IF;
END $$;

-- 4. Indexes
-- Feed sorting: prioritize severity then time
CREATE INDEX IF NOT EXISTS idx_alerts_feed_sort ON public.alerts(user_id, severity, created_at DESC);

-- Deduplication: Ensure unique alert per user/dot/fingerprint
-- Requires fingerprint to be provided for dedupe to work effective.
-- We use a partial index or just standard unique index allowing multiple nulls?
-- Ideally we want to prevent duplicate fingerprints.
-- "create unique index if not exists"
CREATE UNIQUE INDEX IF NOT EXISTS idx_alerts_dedupe ON public.alerts(user_id, dot_number, fingerprint);

-- 5. RLS Confirmation
-- Users can already update their own alerts (for is_read) due to previous policy.
-- No new policies needed as server handles insertion of new columns.
