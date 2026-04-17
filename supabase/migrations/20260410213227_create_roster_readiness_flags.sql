/*
  # Roster Readiness — Admin Flags & Assignments

  ## Summary
  Stores admin actions taken on artist records from the Roster Readiness panel:
  flagging for update, assigning team members, and tracking last-reviewed state.

  ## New Tables

  ### aos_roster_flags
  One row per artist. Tracks admin-set readiness state, update flags, and team assignments.
  - artist_id (FK to aos_artists)
  - readiness_status: 'ready' | 'incomplete' | 'needs_review'
  - flagged_for_update: boolean — admin marked this artist as needing data update
  - assigned_to: name/email of assigned GMG team member
  - flag_reason: free-text reason for flag
  - admin_notes: internal admin notes
  - last_reviewed_at: timestamp of last admin review
  - last_reviewed_by: who reviewed it

  ## Security
  - RLS enabled
  - Authenticated users can read
  - Authenticated users can insert/update (admin-gated in application layer)
*/

CREATE TABLE IF NOT EXISTS aos_roster_flags (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id         text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  readiness_status  text NOT NULL DEFAULT 'incomplete'
                      CHECK (readiness_status IN ('ready', 'incomplete', 'needs_review')),
  flagged_for_update boolean NOT NULL DEFAULT false,
  assigned_to       text NOT NULL DEFAULT '',
  flag_reason       text NOT NULL DEFAULT '',
  admin_notes       text NOT NULL DEFAULT '',
  last_reviewed_at  timestamptz,
  last_reviewed_by  text NOT NULL DEFAULT '',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artist_id)
);

CREATE INDEX IF NOT EXISTS aos_roster_flags_artist_id_idx ON aos_roster_flags(artist_id);
CREATE INDEX IF NOT EXISTS aos_roster_flags_status_idx    ON aos_roster_flags(readiness_status);
CREATE INDEX IF NOT EXISTS aos_roster_flags_flagged_idx   ON aos_roster_flags(flagged_for_update);

ALTER TABLE aos_roster_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view roster flags"
  ON aos_roster_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert roster flags"
  ON aos_roster_flags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update roster flags"
  ON aos_roster_flags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
