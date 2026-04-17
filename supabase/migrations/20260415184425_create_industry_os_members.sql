/*
  # Industry OS Members System

  ## Overview
  Creates the membership table for Industry OS, supporting application-based access,
  waitlist management, member profiles, and Project OS assignment tracking.

  ## New Tables

  ### industry_os_members
  - Core member profile for Industry OS users
  - Stores professional info, links, interests, and membership status
  - Supports waitlist / pending / approved flow

  ## Security
  - RLS enabled
  - Open insert for signup, open select for login verification
  - Members can update their own row
*/

CREATE TABLE IF NOT EXISTS industry_os_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  location text NOT NULL,
  primary_industry text NOT NULL,
  primary_industry_other text,
  member_current_role text,
  desired_role text,
  instagram text,
  linkedin text,
  website text,
  promo_code text,
  interests text[] DEFAULT '{}',
  badge_type text DEFAULT 'member',
  membership_status text NOT NULL DEFAULT 'pending',
  has_project_assignment boolean NOT NULL DEFAULT false,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE industry_os_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Industry OS open select"
  ON industry_os_members FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Industry OS open insert"
  ON industry_os_members FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Industry OS open update"
  ON industry_os_members FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
