/*
  # Create leads table for intake funnel

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `name` (text) - Full name of the person
      - `email` (text) - Email address
      - `company` (text) - Company or artist name
      - `role_type` (text) - Type of role (artist, manager, label, catalog_owner, brand, partner)
      - `streaming_link` (text, optional) - Spotify or other streaming platform link
      - `catalog_description` (text, optional) - Description of catalog or roster
      - `project_interest` (text, optional) - What they're looking to achieve
      - `created_at` (timestamptz) - Timestamp of submission

  2. Security
    - Enable RLS on `leads` table
    - Add policy for inserting leads (public access for form submission)
    - Add policy for authenticated admin users to read leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  role_type text NOT NULL,
  streaming_link text,
  catalog_description text,
  project_interest text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read all leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);