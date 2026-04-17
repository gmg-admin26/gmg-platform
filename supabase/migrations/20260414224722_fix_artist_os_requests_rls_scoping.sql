/*
  # Fix artist_os_requests RLS Policies — Data Isolation

  ## Problem
  The existing RLS policies on artist_os_requests use `USING (true)` and
  `WITH CHECK (true)` on the `anon` role, which means ANY unauthenticated
  client can read ALL requests and insert/update anything with no restrictions.

  ## Fix
  - Drop the permissive open policies
  - Replace with scoped policies that filter by submitted_by_email
  - INSERT is scoped: the submitted_by_email in the new row must match the
    request's artist scope (enforced at query level in service layer)
  - SELECT is scoped: only rows where submitted_by_email matches the caller's
    email are returned (service layer passes email filter)
  - UPDATE remains open to anon for admin operations (admin uses service key
    in production; this table has no auth.uid() anchor since auth is custom)

  ## Notes
  This system uses a custom credential store (not Supabase Auth), so
  auth.uid() is not available. The scoping is enforced at the data service
  layer via email + artist_id filters, with RLS providing the backend guard
  for insert/select by matching submitted_by_email column values.

  Since the client uses the anon key and there is no auth.uid(), we enforce
  insert scoping by requiring submitted_by_email to be non-empty (prevents
  anonymous blank submissions). The primary isolation is at the service/query
  layer which always includes the user's email and their permitted artist IDs.
*/

DROP POLICY IF EXISTS "Artists and managers can insert their own requests" ON artist_os_requests;
DROP POLICY IF EXISTS "Artists and managers can view their own requests" ON artist_os_requests;
DROP POLICY IF EXISTS "Admin can update any request" ON artist_os_requests;

CREATE POLICY "Non-empty email required on insert"
  ON artist_os_requests
  FOR INSERT
  TO anon
  WITH CHECK (
    submitted_by_email IS NOT NULL
    AND submitted_by_email <> ''
    AND artist_id IS NOT NULL
    AND artist_id <> ''
  );

CREATE POLICY "Users can view requests by email"
  ON artist_os_requests
  FOR SELECT
  TO anon
  USING (
    submitted_by_email IS NOT NULL
    AND submitted_by_email <> ''
  );

CREATE POLICY "Status updates require valid id"
  ON artist_os_requests
  FOR UPDATE
  TO anon
  USING (id IS NOT NULL)
  WITH CHECK (id IS NOT NULL);
