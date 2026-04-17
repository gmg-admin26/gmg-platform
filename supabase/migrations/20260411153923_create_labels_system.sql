/*
  # Labels System — First-Class Label Entities

  ## Overview
  Implements labels as a first-class entity with full artist-label relationship tracking,
  analytics aggregation support, and admin CRUD capabilities.

  ## New Tables

  ### `labels`
  The canonical label registry. Each label is a standalone entity.

  Columns:
  - `id` (uuid, PK)
  - `slug` (text, unique) — short machine key e.g. "srf", "quatorze"
  - `name` (text) — display name
  - `type` (text) — 'internal' | 'partner' | 'distribution'
  - `status` (text) — 'active' | 'inactive' | 'archived'
  - `contact_name` (text)
  - `contact_email` (text)
  - `contact_phone` (text)
  - `website` (text)
  - `notes` (text)
  - `logo_url` (text)
  - `color` (text) — brand accent color for UI
  - `founded_year` (int)
  - `created_at`, `updated_at` (timestamptz)

  ### `artist_label_assignments`
  Many-to-many artist ↔ label. An artist can belong to multiple labels.

  Columns:
  - `id` (uuid, PK)
  - `artist_id` (text) — references SignedArtist.id (e.g. "AOS-001")
  - `label_id` (uuid, FK → labels.id)
  - `role` (text) — 'primary' | 'secondary' | 'distribution'
  - `assigned_at` (timestamptz)
  - `assigned_by` (text)
  - `notes` (text)
  - `active` (boolean)

  ## Security
  - RLS enabled on both tables
  - Authenticated users can read
  - Only admin role can write
*/

CREATE TABLE IF NOT EXISTS labels (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          text UNIQUE NOT NULL,
  name          text NOT NULL,
  type          text NOT NULL DEFAULT 'partner',
  status        text NOT NULL DEFAULT 'active',
  contact_name  text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  website       text NOT NULL DEFAULT '',
  notes         text NOT NULL DEFAULT '',
  logo_url      text NOT NULL DEFAULT '',
  color         text NOT NULL DEFAULT '#06B6D4',
  founded_year  int,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view labels"
  ON labels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert labels"
  ON labels FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE POLICY "Admins can update labels"
  ON labels FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE TABLE IF NOT EXISTS artist_label_assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   text NOT NULL,
  label_id    uuid NOT NULL REFERENCES labels(id),
  role        text NOT NULL DEFAULT 'primary',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by text NOT NULL DEFAULT '',
  notes       text NOT NULL DEFAULT '',
  active      boolean NOT NULL DEFAULT true,
  UNIQUE(artist_id, label_id)
);

ALTER TABLE artist_label_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view assignments"
  ON artist_label_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert assignments"
  ON artist_label_assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE POLICY "Admins can update assignments"
  ON artist_label_assignments FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team'
  );

CREATE INDEX IF NOT EXISTS idx_artist_label_assignments_artist_id ON artist_label_assignments(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_label_assignments_label_id ON artist_label_assignments(label_id);
CREATE INDEX IF NOT EXISTS idx_labels_status ON labels(status);
CREATE INDEX IF NOT EXISTS idx_labels_type ON labels(type);

INSERT INTO labels (slug, name, type, status, color, notes) VALUES
  ('srf',           'Self-Realization Fellowship', 'partner',      'active', '#10B981', 'Partner label — spiritual / ambient catalog'),
  ('quatorze',      'Quatorze Recordings',          'partner',      'active', '#06B6D4', 'Partner label — electronic / indie'),
  ('spin-records',  'SPIN Records',                 'partner',      'active', '#F59E0B', 'Partner label — diverse genre catalog'),
  ('alabama-sound', 'Alabama Sound Company',        'partner',      'active', '#EF4444', 'Partner label — southern / roots music')
ON CONFLICT (slug) DO NOTHING;
