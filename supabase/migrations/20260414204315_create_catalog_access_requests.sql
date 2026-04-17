/*
  # Create catalog_access_requests table

  ## Purpose
  Stores "Request Access" form submissions from the Catalog OS login page.

  ## New Table: catalog_access_requests
  - id (uuid, primary key)
  - name (text) — requester's full name
  - email (text) — requester's email address
  - company (text) — company or artist name
  - role (text) — artist / manager / label / investor / other
  - message (text, optional) — free-form message
  - status (text) — pending / approved / rejected, default pending
  - created_at (timestamptz) — submission timestamp

  ## Security
  - RLS enabled
  - INSERT allowed for anonymous users (public form)
  - SELECT/UPDATE restricted to authenticated internal operators
*/

CREATE TABLE IF NOT EXISTS catalog_access_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  company    text NOT NULL,
  role       text NOT NULL CHECK (role IN ('artist', 'manager', 'label', 'investor', 'other')),
  message    text DEFAULT '',
  status     text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE catalog_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a catalog access request"
  ON catalog_access_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view access requests"
  ON catalog_access_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update access request status"
  ON catalog_access_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
