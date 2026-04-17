/*
  # Catalog OS Client System

  ## Overview
  Extends Catalog OS to support multiple client types beyond a single artist.
  Allows a single Catalog OS installation to serve:
    - Individual artists
    - Artist management companies managing multiple artists
    - Independent and major labels with rosters
    - Distributors using GMG services
    - Catalog buyers / investors
    - Multi-entity holding companies

  ## New Tables

  ### `catalog_clients`
  Top-level client record. One record per client relationship in Catalog OS.
  - id, name, type (artist | management_company | label | distributor | catalog_owner | multi_entity),
    status, primary_contact, territory, client_since, description, accent_color,
    logo_url, catalog_rep, is_active, metadata, created_at, updated_at

  ### `catalog_client_artists`
  Junction table linking a client to one or more artists it manages or owns.
  - id, client_id, artist_name, artist_role (owned | managed | distributed | licensed | acquired),
    catalog_value_est, monthly_revenue_est, is_primary, status, metadata, created_at

  ## Design Notes
  - The existing Bassnectar single-artist setup is preserved as a seeded client.
  - A label client (Velocity Records) is seeded with a roster.
  - A multi-entity client (Paragon Holdings) is seeded to show the investor view.
  - CatalogOS UI uses client_id in session/context to drive the correct view type.

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read and manage all catalog client records
*/

CREATE TABLE IF NOT EXISTS catalog_clients (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  type              text NOT NULL DEFAULT 'artist'
                      CHECK (type IN ('artist','management_company','label','distributor','catalog_owner','multi_entity')),
  status            text NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active','onboarding','paused','offboarded')),
  primary_contact   text,
  contact_email     text,
  territory         text DEFAULT 'Worldwide',
  client_since      text,
  description       text,
  accent_color      text DEFAULT '#10B981',
  catalog_rep       text DEFAULT 'GMG Catalog Team',
  catalog_rep_email text,
  est_catalog_value numeric(14,2),
  est_monthly_revenue numeric(12,2),
  total_artists     integer DEFAULT 1,
  total_releases    integer,
  is_active         boolean NOT NULL DEFAULT true,
  metadata          jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE catalog_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read catalog clients"
  ON catalog_clients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert catalog clients"
  ON catalog_clients FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update catalog clients"
  ON catalog_clients FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── ARTIST ROSTER PER CLIENT ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS catalog_client_artists (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             uuid NOT NULL REFERENCES catalog_clients(id) ON DELETE CASCADE,
  artist_name           text NOT NULL,
  artist_role           text NOT NULL DEFAULT 'owned'
                          CHECK (artist_role IN ('owned','managed','distributed','licensed','acquired')),
  genre                 text,
  catalog_value_est     numeric(14,2),
  monthly_revenue_est   numeric(12,2),
  total_releases        integer DEFAULT 0,
  total_streams_alltime text,
  status                text NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active','inactive','on_hold','exit')),
  is_primary            boolean NOT NULL DEFAULT false,
  priority_rank         integer DEFAULT 0,
  territory             text DEFAULT 'Worldwide',
  signed_date           text,
  notes                 text,
  metadata              jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE catalog_client_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read catalog client artists"
  ON catalog_client_artists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert catalog client artists"
  ON catalog_client_artists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update catalog client artists"
  ON catalog_client_artists FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── INDEXES ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_catalog_clients_type     ON catalog_clients(type);
CREATE INDEX IF NOT EXISTS idx_catalog_clients_active   ON catalog_clients(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_client_artists   ON catalog_client_artists(client_id);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────

INSERT INTO catalog_clients (name, type, status, primary_contact, contact_email, territory, client_since, description, accent_color, catalog_rep, catalog_rep_email, est_catalog_value, est_monthly_revenue, total_artists, total_releases)
VALUES
  (
    'Bassnectar / Amorphous Music',
    'artist',
    'active',
    'Amorphous Music Inc.',
    'bn@greatermusicgroupteam.com',
    'Worldwide',
    'Jan 2025',
    'Bassnectar is one of the most influential artists in electronic music, with a catalog spanning 20+ years, 28 releases, and a deeply devoted global fanbase. Currently in brand rehabilitation and catalog growth phase.',
    '#10B981',
    'GMG Catalog Team',
    'bn@greatermusicgroupteam.com',
    9800000,
    284600,
    1,
    28
  ),
  (
    'Velocity Records',
    'label',
    'active',
    'Velocity Records LLC',
    'velocity@greatermusicgroupteam.com',
    'North America / Europe',
    'Mar 2025',
    'Independent label with a 6-artist roster spanning electronic, indie, and alternative. Focus on catalog optimization, sync pipeline development, and streaming growth across all assets.',
    '#3B82F6',
    'GMG Catalog Team',
    'velocity@greatermusicgroupteam.com',
    4200000,
    148400,
    6,
    94
  ),
  (
    'Paragon Music Holdings',
    'catalog_owner',
    'active',
    'Paragon Capital Group',
    'paragon@greatermusicgroupteam.com',
    'Worldwide',
    'Jun 2025',
    'Institutional catalog investor managing a diversified portfolio of acquired music catalogs across multiple genres and eras. Focus on yield maximization, sync licensing, and strategic catalog expansion.',
    '#F59E0B',
    'GMG Catalog Team',
    'paragon@greatermusicgroupteam.com',
    31500000,
    540000,
    12,
    380
  ),
  (
    'Nova Artist Management',
    'management_company',
    'active',
    'Jordan Cross — Nova Management',
    'nova@greatermusicgroupteam.com',
    'North America',
    'Sep 2025',
    'Artist management company representing 4 developing artists across pop, R&B, and hip-hop. Focused on catalog building, brand development, and growing streaming footprints ahead of label deals.',
    '#06B6D4',
    'GMG Catalog Team',
    'nova@greatermusicgroupteam.com',
    1200000,
    38000,
    4,
    31
  )
ON CONFLICT DO NOTHING;

-- Artist rosters per client
DO $$
DECLARE
  bn_id  uuid;
  vel_id uuid;
  par_id uuid;
  nov_id uuid;
BEGIN
  SELECT id INTO bn_id  FROM catalog_clients WHERE name = 'Bassnectar / Amorphous Music' LIMIT 1;
  SELECT id INTO vel_id FROM catalog_clients WHERE name = 'Velocity Records' LIMIT 1;
  SELECT id INTO par_id FROM catalog_clients WHERE name = 'Paragon Music Holdings' LIMIT 1;
  SELECT id INTO nov_id FROM catalog_clients WHERE name = 'Nova Artist Management' LIMIT 1;

  -- Bassnectar (single-artist)
  IF bn_id IS NOT NULL THEN
    INSERT INTO catalog_client_artists (client_id, artist_name, artist_role, genre, catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime, status, is_primary, priority_rank)
    VALUES (bn_id, 'Bassnectar', 'owned', 'Electronic / Bass Music', 9800000, 284600, 28, '2.4B', 'active', true, 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Velocity Records roster
  IF vel_id IS NOT NULL THEN
    INSERT INTO catalog_client_artists (client_id, artist_name, artist_role, genre, catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime, status, is_primary, priority_rank, signed_date)
    VALUES
      (vel_id, 'Midnight Frequency', 'owned', 'Electronic / Ambient',   1840000, 62000, 18, '420M', 'active', true,  1, 'Jan 2022'),
      (vel_id, 'Golden Static',      'owned', 'Indie Rock',              820000,  31000, 14, '180M', 'active', false, 2, 'Mar 2022'),
      (vel_id, 'Ashen Roads',        'owned', 'Alternative',             640000,  24000, 12, '140M', 'active', false, 3, 'Jul 2022'),
      (vel_id, 'Nova Drift',         'owned', 'Electronic / House',      480000,  18000,  8, '95M',  'active', false, 4, 'Feb 2023'),
      (vel_id, 'Pale Circuit',       'owned', 'Post-Rock',               300000,   9000,  6, '42M',  'active', false, 5, 'Oct 2023'),
      (vel_id, 'Tether Blue',        'owned', 'Singer-Songwriter',       120000,   4400,  2, '8M',   'on_hold',false, 6, 'Jan 2024')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Paragon Holdings portfolio
  IF par_id IS NOT NULL THEN
    INSERT INTO catalog_client_artists (client_id, artist_name, artist_role, genre, catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime, status, is_primary, priority_rank, signed_date)
    VALUES
      (par_id, 'The Arlowe Sessions',   'acquired', 'Jazz / Neo-Soul',       4200000, 82000, 42, '890M',  'active', true,  1, 'Jan 2024'),
      (par_id, 'Drift Theory',          'acquired', 'Electronic',            3800000, 74000, 31, '740M',  'active', false, 2, 'Mar 2024'),
      (par_id, 'Coastal Hymns',         'acquired', 'Folk / Americana',      3100000, 58000, 28, '610M',  'active', false, 3, 'Jan 2024'),
      (par_id, 'Reel Noir',             'acquired', 'Cinematic / Score',     2900000, 51000, 67, '220M',  'active', false, 4, 'Jun 2024'),
      (par_id, 'Serenova',              'acquired', 'Pop / Adult Contemp.',  2400000, 45000, 19, '980M',  'active', false, 5, 'Sep 2024'),
      (par_id, 'Iron Lattice',          'acquired', 'Alternative Rock',      2200000, 42000, 24, '510M',  'active', false, 6, 'Jun 2024'),
      (par_id, 'Bluewater Archive',     'licensed', 'Blues / Classic R&B',   2100000, 36000, 88, '310M',  'active', false, 7, 'Dec 2024'),
      (par_id, 'Veldt',                 'acquired', 'Ambient / New Age',     1900000, 32000, 14, '220M',  'active', false, 8, 'Jan 2025'),
      (par_id, 'Kessler Brothers Band', 'acquired', 'Country',               1800000, 31000, 22, '480M',  'active', false, 9, 'Feb 2025'),
      (par_id, 'Pressfield',            'acquired', 'Hip-Hop / R&B',         1700000, 28000, 17, '390M',  'active', false,10, 'Mar 2025'),
      (par_id, 'Hazel Fawn',            'licensed', 'Indie Pop',             1400000, 23000,  9, '180M',  'active', false,11, 'Mar 2025'),
      (par_id, 'The Velvet Undertow',   'acquired', 'Psychedelic Rock',      1200000, 18000, 29, '260M',  'active', false,12, 'Apr 2025')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Nova Management roster
  IF nov_id IS NOT NULL THEN
    INSERT INTO catalog_client_artists (client_id, artist_name, artist_role, genre, catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime, status, is_primary, priority_rank, signed_date)
    VALUES
      (nov_id, 'Salena Voss',   'managed', 'R&B / Pop',    480000, 15000, 8,  '62M',  'active', true,  1, 'Apr 2025'),
      (nov_id, 'Tron Mercer',   'managed', 'Hip-Hop',      360000, 12000, 6,  '44M',  'active', false, 2, 'Jun 2025'),
      (nov_id, 'Lyra James',    'managed', 'Indie Pop',    240000,  7000, 5,  '22M',  'active', false, 3, 'Aug 2025'),
      (nov_id, 'Coldwave Cole', 'managed', 'Electronic',   120000,  4000, 2,  '8M',   'active', false, 4, 'Sep 2025')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
