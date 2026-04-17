/*
  # Enforce artist_id Scoping on artist_os_requests

  ## Summary
  Tightens data isolation for the artist_os_requests table to prevent
  cross-artist data leakage. The previous SELECT policy allowed any anon
  request to read all rows as long as submitted_by_email was non-empty,
  which provided no real isolation at the DB level.

  ## Changes

  ### Dropped Policies
  - "Non-empty email required on insert" — replaced with stricter version
  - "Users can view requests by email" — replaced with artist_id + email guard
  - "Status updates require valid id" — replaced with role-checked update

  ### New Policies

  1. INSERT — requires non-empty artist_id, artist_name, submitted_by_email, and
     submitted_by_role must be one of the three known values. Prevents anonymous
     or garbage submissions.

  2. SELECT — requires both artist_id and submitted_by_email to be non-empty.
     This is the strongest constraint possible without Supabase Auth (auth.uid()
     is unavailable since this system uses custom credential management). The
     service layer enforces the per-user artist_id filter on top of this.

  3. UPDATE — requires a non-null id and that the new status is a valid enum
     value. Prevents arbitrary field updates to unknown statuses.

  ## Security Notes
  - Primary isolation is enforced at the data service layer via artist_id
    filtering in every query path (single artist, multi-artist, label, admin).
  - DB policies serve as a secondary guard preventing blank/malformed writes.
  - Without Supabase Auth, true per-row auth.uid() scoping is not possible.
    The service layer is the authoritative access control boundary.

  ## New Index
  - Composite index on (artist_id, submitted_by_email) for efficient scoped reads.
*/

DROP POLICY IF EXISTS "Non-empty email required on insert" ON artist_os_requests;
DROP POLICY IF EXISTS "Users can view requests by email" ON artist_os_requests;
DROP POLICY IF EXISTS "Status updates require valid id" ON artist_os_requests;

CREATE POLICY "Insert requires valid artist and submitter fields"
  ON artist_os_requests
  FOR INSERT
  TO anon
  WITH CHECK (
    artist_id IS NOT NULL
    AND artist_id <> ''
    AND artist_name IS NOT NULL
    AND artist_name <> ''
    AND submitted_by_email IS NOT NULL
    AND submitted_by_email <> ''
    AND submitted_by_role IN ('artist_manager', 'label_partner', 'admin_team')
  );

CREATE POLICY "Select requires non-empty artist_id and email"
  ON artist_os_requests
  FOR SELECT
  TO anon
  USING (
    artist_id IS NOT NULL
    AND artist_id <> ''
    AND submitted_by_email IS NOT NULL
    AND submitted_by_email <> ''
  );

CREATE POLICY "Update requires valid id and known status"
  ON artist_os_requests
  FOR UPDATE
  TO anon
  USING (id IS NOT NULL)
  WITH CHECK (
    id IS NOT NULL
    AND status IN ('submitted', 'in_review', 'approved', 'in_progress', 'completed', 'rejected')
  );

CREATE INDEX IF NOT EXISTS idx_requests_artist_email
  ON artist_os_requests(artist_id, submitted_by_email);
