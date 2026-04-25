/*
  # Create lifecycle events tables for Artist OS and Catalog OS

  1. New Tables
    - `artist_lifecycle_events`
      - `id` (uuid, primary key)
      - `artist_id` (text, not null) — references the in-app artist ID (e.g. AOS-001)
      - `artist_name` (text, not null, default '')
      - `state` (text, not null) — one of: active, at_risk, dropped_pending, dropped_complete
      - `initiated_by` (text, not null, default '')
      - `initiated_at` (timestamptz, default now())
      - `notes` (text, nullable)

    - `catalog_lifecycle_events`
      - `id` (uuid, primary key)
      - `client_id` (text, not null) — references the catalog client UUID
      - `client_name` (text, not null, default '')
      - `state` (text, not null) — one of: active, dropped_pending, dropped_complete
      - `initiated_by` (text, not null, default '')
      - `initiated_at` (timestamptz, default now())
      - `notes` (text, nullable)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage lifecycle events
    - Add policies for anon access (demo/investor mode)

  3. Notes
    - These tables store an immutable event log for drop/reinstate workflows
    - The latest event per entity determines current state
    - Used by dropArtistService.ts and catalogDropService.ts
*/

-- Artist lifecycle events
CREATE TABLE IF NOT EXISTS artist_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id text NOT NULL,
  artist_name text NOT NULL DEFAULT '',
  state text NOT NULL CHECK (state IN ('active', 'at_risk', 'dropped_pending', 'dropped_complete')),
  initiated_by text NOT NULL DEFAULT '',
  initiated_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

ALTER TABLE artist_lifecycle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read artist lifecycle events"
  ON artist_lifecycle_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert artist lifecycle events"
  ON artist_lifecycle_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon users can read artist lifecycle events"
  ON artist_lifecycle_events
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can insert artist lifecycle events"
  ON artist_lifecycle_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_artist_lifecycle_artist_id ON artist_lifecycle_events (artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_lifecycle_state ON artist_lifecycle_events (state);

-- Catalog lifecycle events
CREATE TABLE IF NOT EXISTS catalog_lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  state text NOT NULL CHECK (state IN ('active', 'dropped_pending', 'dropped_complete')),
  initiated_by text NOT NULL DEFAULT '',
  initiated_at timestamptz NOT NULL DEFAULT now(),
  notes text
);

ALTER TABLE catalog_lifecycle_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read catalog lifecycle events"
  ON catalog_lifecycle_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert catalog lifecycle events"
  ON catalog_lifecycle_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anon users can read catalog lifecycle events"
  ON catalog_lifecycle_events
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon users can insert catalog lifecycle events"
  ON catalog_lifecycle_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_catalog_lifecycle_client_id ON catalog_lifecycle_events (client_id);
CREATE INDEX IF NOT EXISTS idx_catalog_lifecycle_state ON catalog_lifecycle_events (state);
