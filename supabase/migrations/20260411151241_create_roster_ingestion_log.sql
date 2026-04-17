/*
  # Create Roster Ingestion Log Table

  ## Summary
  Stores a record of every time the roster data is parsed and validated.
  Each run captures total artists found, field coverage stats, and per-artist
  data quality issues, so the team can track improvements over time.

  ## New Tables
  - `roster_ingestion_log`
    - `id` — UUID primary key
    - `ingested_at` — timestamp of parse run
    - `total_artists` — number of artist rows found
    - `artists_with_email` — count with valid emails
    - `artists_with_phone` — count with phone numbers
    - `artists_with_any_social` — count with at least one social link
    - `artists_missing_email` — count missing email
    - `artists_missing_phone` — count missing phone
    - `artists_missing_social` — count missing all social links
    - `pct_email_coverage` — percentage (0–100)
    - `pct_phone_coverage` — percentage (0–100)
    - `pct_social_coverage` — percentage (0–100)
    - `issues` — JSONB array of per-artist issue objects
    - `source` — string identifying the data source
    - `notes` — optional free-text

  ## Security
  - RLS enabled
  - Only admin_team role (authenticated users) can read/insert
*/

CREATE TABLE IF NOT EXISTS roster_ingestion_log (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ingested_at             timestamptz DEFAULT now() NOT NULL,
  total_artists           integer NOT NULL DEFAULT 0,
  artists_with_email      integer NOT NULL DEFAULT 0,
  artists_with_phone      integer NOT NULL DEFAULT 0,
  artists_with_any_social integer NOT NULL DEFAULT 0,
  artists_missing_email   integer NOT NULL DEFAULT 0,
  artists_missing_phone   integer NOT NULL DEFAULT 0,
  artists_missing_social  integer NOT NULL DEFAULT 0,
  pct_email_coverage      numeric(5,2) NOT NULL DEFAULT 0,
  pct_phone_coverage      numeric(5,2) NOT NULL DEFAULT 0,
  pct_social_coverage     numeric(5,2) NOT NULL DEFAULT 0,
  issues                  jsonb NOT NULL DEFAULT '[]'::jsonb,
  source                  text NOT NULL DEFAULT 'roster_data_ts',
  notes                   text
);

ALTER TABLE roster_ingestion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert ingestion logs"
  ON roster_ingestion_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read ingestion logs"
  ON roster_ingestion_log FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_ingestion_log_ingested_at
  ON roster_ingestion_log (ingested_at DESC);
