/*
  # Artist OS — External Data Enrichment Schema

  ## Summary
  Stores enrichment data sourced from external APIs (Spotify, TikTok, Instagram, YouTube)
  and manual overrides, with per-field provenance tracking (live / pending_api / manual_override).

  ## New Tables

  ### aos_enrichment_fields
  One row per artist × field_key. Tracks the current value, source, status, and last sync time.
  - artist_id: FK to aos_artists
  - field_key: dot-notation field identifier (e.g. "spotify.monthly_listeners")
  - field_group: category (spotify | tiktok | instagram | youtube | geography | demographics | similar_artists)
  - display_label: human-readable label
  - raw_value: the stored value as text (cast by consumer)
  - source_status: 'live' | 'pending_api' | 'manual_override'
  - api_source: which external API owns this field
  - last_synced_at: when the API last returned data
  - manual_value: admin-entered override value
  - manual_set_by: who set the override
  - manual_set_at: when override was set
  - auto_refresh: whether the system should refresh on next sync cycle

  ### aos_enrichment_sync_log
  Append-only log of every sync attempt per artist × integration.
  - artist_id, integration, status (success/failed/partial), records_updated, error_msg, synced_at

  ## Security
  - RLS enabled on both tables
  - Authenticated users can read
  - Authenticated users can insert/update
*/

CREATE TABLE IF NOT EXISTS aos_enrichment_fields (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id        text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  field_key        text NOT NULL,
  field_group      text NOT NULL
                     CHECK (field_group IN ('spotify','tiktok','instagram','youtube','geography','demographics','similar_artists')),
  display_label    text NOT NULL DEFAULT '',
  raw_value        text,
  source_status    text NOT NULL DEFAULT 'pending_api'
                     CHECK (source_status IN ('live','pending_api','manual_override')),
  api_source       text NOT NULL DEFAULT '',
  last_synced_at   timestamptz,
  manual_value     text,
  manual_set_by    text NOT NULL DEFAULT '',
  manual_set_at    timestamptz,
  auto_refresh     boolean NOT NULL DEFAULT true,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artist_id, field_key)
);

CREATE INDEX IF NOT EXISTS aos_enrichment_artist_idx    ON aos_enrichment_fields(artist_id);
CREATE INDEX IF NOT EXISTS aos_enrichment_group_idx     ON aos_enrichment_fields(field_group);
CREATE INDEX IF NOT EXISTS aos_enrichment_status_idx    ON aos_enrichment_fields(source_status);

ALTER TABLE aos_enrichment_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read enrichment fields"
  ON aos_enrichment_fields FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert enrichment fields"
  ON aos_enrichment_fields FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update enrichment fields"
  ON aos_enrichment_fields FOR UPDATE TO authenticated USING (true) WITH CHECK (true);


CREATE TABLE IF NOT EXISTS aos_enrichment_sync_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id        text NOT NULL,
  integration      text NOT NULL,
  status           text NOT NULL CHECK (status IN ('success','failed','partial')),
  records_updated  int NOT NULL DEFAULT 0,
  error_msg        text,
  synced_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aos_sync_log_artist_idx ON aos_enrichment_sync_log(artist_id);
CREATE INDEX IF NOT EXISTS aos_sync_log_integration_idx ON aos_enrichment_sync_log(integration);

ALTER TABLE aos_enrichment_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read sync log"
  ON aos_enrichment_sync_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert sync log"
  ON aos_enrichment_sync_log FOR INSERT TO authenticated WITH CHECK (true);
