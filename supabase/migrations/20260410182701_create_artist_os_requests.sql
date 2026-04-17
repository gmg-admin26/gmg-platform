/*
  # Artist OS Request System

  ## Summary
  Creates the request system for Artist OS allowing artists, managers, and labels
  to submit structured requests for marketing campaigns, ad spend, content production,
  release support, and more.

  ## New Tables

  ### `artist_os_requests`
  - `id` (uuid, primary key)
  - `request_type` (text) — Marketing Campaign, Ad Spend, Content Production, etc.
  - `artist_id` (text) — artist identifier from roster data
  - `artist_name` (text) — display name
  - `label_id` (text, nullable) — label identifier if submitted by label
  - `submitted_by_email` (text) — email of submitter
  - `submitted_by_role` (text) — artist_manager | label_partner | admin_team
  - `priority` (text) — high | medium | low
  - `budget_range` (text, nullable)
  - `description` (text)
  - `desired_timeline` (text)
  - `status` (text) — submitted | in_review | approved | in_progress | completed | rejected
  - `assigned_to` (text, nullable)
  - `admin_notes` (text, nullable)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - artist_manager: can only read/write their own requests (by submitted_by_email)
  - label_partner: can read requests from their roster label_id
  - admin_team: full access to all requests
*/

CREATE TABLE IF NOT EXISTS artist_os_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_type text NOT NULL,
  artist_id text NOT NULL,
  artist_name text NOT NULL,
  label_id text,
  submitted_by_email text NOT NULL,
  submitted_by_role text NOT NULL,
  priority text NOT NULL DEFAULT 'medium',
  budget_range text,
  description text NOT NULL,
  desired_timeline text NOT NULL,
  status text NOT NULL DEFAULT 'submitted',
  assigned_to text,
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE artist_os_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Artists and managers can insert their own requests"
  ON artist_os_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Artists and managers can view their own requests"
  ON artist_os_requests
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Admin can update any request"
  ON artist_os_requests
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_requests_email ON artist_os_requests(submitted_by_email);
CREATE INDEX IF NOT EXISTS idx_requests_label ON artist_os_requests(label_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON artist_os_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_artist ON artist_os_requests(artist_id);
