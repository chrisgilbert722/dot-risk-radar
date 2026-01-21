-- Phase 8.1: Compliance Vault Schema
CREATE TABLE IF NOT EXISTS vault_folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  dot_number text NOT NULL,
  name text NOT NULL, -- e.g. "Driver Files", "Maintenance"
  parent_id uuid REFERENCES vault_folders(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vault_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  folder_id uuid REFERENCES vault_folders(id),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz DEFAULT now()
);

-- Phase 8.2: Alert Delivery & Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  email_enabled boolean DEFAULT false,
  sms_enabled boolean DEFAULT false,
  sms_number text,
  min_severity text DEFAULT 'Elevated' -- Only send Elevated+ by default
);

-- Note: Delivery adapters will consume standard 'alerts' table, no new table needed yet.
