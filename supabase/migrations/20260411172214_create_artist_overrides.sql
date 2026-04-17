/*
  # Artist Overrides Table

  ## Summary
  Stores per-field overrides for artist records that originate from the static
  roster data. When an admin edits an artist profile (name, arRep, pointPerson,
  contact info, social links, etc.) the changes are persisted here and merged
  back into the in-memory roster on next load, so edits survive page navigation.

  ## New Table

  ### `aos_artist_overrides`
  - `id` (uuid, pk)
  - `artist_id` (text, not null) — matches SignedArtist.id e.g. "AOS-001"
  - `field` (text) — the exact camelCase field name being overridden
  - `value` (text) — the new value (always stored as string, cast on read)
  - `updated_by` (text) — email or role of user who made the change
  - `updated_at` (timestamptz)
  - unique constraint on (artist_id, field) so upsert is clean

  ## Security
  - RLS enabled
  - Authenticated users can read all overrides
  - Authenticated users can insert/update overrides
*/

CREATE TABLE IF NOT EXISTS aos_artist_overrides (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   text        NOT NULL,
  field       text        NOT NULL,
  value       text        NOT NULL DEFAULT '',
  updated_by  text        NOT NULL DEFAULT 'admin',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artist_id, field)
);

CREATE INDEX IF NOT EXISTS idx_artist_overrides_artist_id ON aos_artist_overrides(artist_id);

ALTER TABLE aos_artist_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read overrides"
  ON aos_artist_overrides FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert overrides"
  ON aos_artist_overrides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update overrides"
  ON aos_artist_overrides FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
