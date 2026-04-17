/*
  # Artist Update Submissions System

  ## Overview
  Implements a structured pending-update pipeline for artist profile data changes.
  Instead of overwriting artist data directly, submissions go into a queue for
  admin review and approval (with optional AI pre-review tagging).

  ## New Tables

  ### `artist_update_submissions`
  Stores every submitted update request from artists, managers, or internal team.

  Columns:
  - `id` (uuid, PK) — unique submission ID
  - `artist_id` (text) — references the artist's roster ID (e.g., AOS-001)
  - `artist_name` (text) — denormalized for display
  - `submitted_by_email` (text) — who submitted the update
  - `submitted_by_name` (text) — display name of submitter
  - `submitter_role` (text) — 'artist' | 'manager' | 'admin_team' | 'label_partner'
  - `submission_type` (text) — 'info_update' | 'contact_update' | 'social_update' | 'banking_update' | 'full_update'
  - `status` (text) — 'pending' | 'ai_review' | 'approved' | 'rejected' | 'applied'
  - `ai_review_ready` (boolean) — flagged for AI agent processing
  - `ai_review_notes` (text) — AI-generated notes on the submission
  - `changes` (jsonb) — the actual field changes being proposed
  - `banking_changes` (jsonb) — secure banking/payment info (separate column)
  - `admin_notes` (text) — reviewer notes
  - `reviewed_by` (text) — admin who reviewed
  - `reviewed_at` (timestamptz) — when reviewed
  - `created_at` (timestamptz) — submission timestamp
  - `updated_at` (timestamptz) — last update timestamp

  ## Security
  - RLS enabled
  - Authenticated users can insert and view their own submissions
  - Admin role (via app metadata) can view and update all submissions
*/

CREATE TABLE IF NOT EXISTS artist_update_submissions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id           text NOT NULL,
  artist_name         text NOT NULL DEFAULT '',
  submitted_by_email  text NOT NULL,
  submitted_by_name   text NOT NULL DEFAULT '',
  submitter_role      text NOT NULL DEFAULT 'artist',
  submission_type     text NOT NULL DEFAULT 'info_update',
  status              text NOT NULL DEFAULT 'pending',
  ai_review_ready     boolean NOT NULL DEFAULT false,
  ai_review_notes     text NOT NULL DEFAULT '',
  changes             jsonb NOT NULL DEFAULT '{}',
  banking_changes     jsonb NOT NULL DEFAULT '{}',
  admin_notes         text NOT NULL DEFAULT '',
  reviewed_by         text NOT NULL DEFAULT '',
  reviewed_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE artist_update_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit updates"
  ON artist_update_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own submissions"
  ON artist_update_submissions
  FOR SELECT
  TO authenticated
  USING (submitted_by_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all submissions"
  ON artist_update_submissions
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE POLICY "Admins can update all submissions"
  ON artist_update_submissions
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE INDEX IF NOT EXISTS idx_artist_update_submissions_artist_id
  ON artist_update_submissions(artist_id);

CREATE INDEX IF NOT EXISTS idx_artist_update_submissions_status
  ON artist_update_submissions(status);

CREATE INDEX IF NOT EXISTS idx_artist_update_submissions_submitted_by_email
  ON artist_update_submissions(submitted_by_email);

CREATE INDEX IF NOT EXISTS idx_artist_update_submissions_created_at
  ON artist_update_submissions(created_at DESC);
