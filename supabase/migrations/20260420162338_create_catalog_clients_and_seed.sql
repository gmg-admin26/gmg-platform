/*
  # Create catalog_clients and catalog_client_artists tables

  1. New Tables
    - `catalog_clients` — one row per catalog client/account (Bassnectar, Santigold, etc.)
      - id, name, type, status, accent_color, territory, est_catalog_value, est_monthly_revenue,
        total_artists, is_active, metadata, timestamps
    - `catalog_client_artists` — roster entries linked to a client
      - id, client_id, artist_name, artist_role, genre, financial snapshots, status, priority_rank, etc.

  2. Security
    - RLS enabled on both tables
    - Authenticated users with system access can read all active clients
    - No public write access

  3. Seed data
    - Bassnectar (client_id: fixed UUID for stable reference)
    - Santigold
    - Placeholder Artist 03
*/

-- ── Tables ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS catalog_clients (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  type                 text NOT NULL DEFAULT 'artist'
                         CHECK (type IN ('artist','management_company','label','distributor','catalog_owner','multi_entity')),
  status               text NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active','onboarding','paused','offboarded')),
  primary_contact      text,
  contact_email        text,
  territory            text DEFAULT 'Worldwide',
  client_since         text,
  description          text,
  accent_color         text NOT NULL DEFAULT '#10B981',
  catalog_rep          text,
  catalog_rep_email    text,
  est_catalog_value    bigint,
  est_monthly_revenue  bigint,
  total_artists        integer NOT NULL DEFAULT 1,
  is_active            boolean NOT NULL DEFAULT true,
  metadata             jsonb,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog_client_artists (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             uuid NOT NULL REFERENCES catalog_clients(id) ON DELETE CASCADE,
  artist_name           text NOT NULL,
  artist_role           text NOT NULL DEFAULT 'owned'
                          CHECK (artist_role IN ('owned','managed','distributed','licensed','acquired')),
  genre                 text,
  catalog_value_est     bigint,
  monthly_revenue_est   bigint,
  total_releases        integer,
  total_streams_alltime text,
  status                text NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active','inactive','on_hold','exit')),
  is_primary            boolean NOT NULL DEFAULT false,
  priority_rank         integer NOT NULL DEFAULT 0,
  territory             text DEFAULT 'Worldwide',
  signed_date           text,
  notes                 text,
  metadata              jsonb,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- ── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE catalog_clients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_client_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read active catalog clients"
  ON catalog_clients FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can read catalog client artists"
  ON catalog_client_artists FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM catalog_clients cc
      WHERE cc.id = catalog_client_artists.client_id
        AND cc.is_active = true
    )
  );

-- ── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_catalog_clients_is_active    ON catalog_clients(is_active);
CREATE INDEX IF NOT EXISTS idx_catalog_client_artists_client ON catalog_client_artists(client_id);

-- ── Seed: Bassnectar ─────────────────────────────────────────────────────────

INSERT INTO catalog_clients (
  id, name, type, status, territory, client_since, description,
  accent_color, catalog_rep, catalog_rep_email,
  est_catalog_value, est_monthly_revenue, total_artists, is_active
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Bassnectar',
  'artist',
  'active',
  'Worldwide',
  'November 2025',
  'Bassnectar is one of the most culturally significant names in electronic music — 20+ years, 28 releases, 2.4B all-time streams, and one of the most loyal fanbases in the independent world. Catalog is in structured brand rehabilitation and reactivation phase.',
  '#10B981',
  'Nick Terzo',
  'bn@greatermusicgroupteam.com',
  5800000,
  284600,
  1,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO catalog_client_artists (
  client_id, artist_name, artist_role, genre,
  catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime,
  status, is_primary, priority_rank, territory, signed_date, notes
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Bassnectar',
  'owned',
  'Electronic / Bass Music',
  5800000,
  284600,
  28,
  '2.4B',
  'active',
  true,
  1,
  'Worldwide',
  '2025-11-01',
  'Brand rehab + catalog reactivation. Sync pipeline active. ZFM direct-fan channel generating $18K/mo.'
) ON CONFLICT DO NOTHING;

-- ── Seed: Santigold ──────────────────────────────────────────────────────────

INSERT INTO catalog_clients (
  id, name, type, status, territory, client_since, description,
  accent_color, catalog_rep, catalog_rep_email,
  est_catalog_value, est_monthly_revenue, total_artists, is_active
) VALUES (
  'a2000000-0000-0000-0000-000000000002',
  'Santigold',
  'artist',
  'active',
  'Worldwide',
  'February 2026',
  'Santigold is a critically acclaimed indie-pop and new wave artist with 4 studio albums, a devoted global fanbase, and consistent sync placement activity. Catalog managed by GMG with focus on streaming growth, licensing, and new release planning.',
  '#F59E0B',
  'GMG Catalog Team',
  'catalog@gmg.ai',
  3200000,
  148000,
  1,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO catalog_client_artists (
  client_id, artist_name, artist_role, genre,
  catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime,
  status, is_primary, priority_rank, territory, signed_date, notes
) VALUES (
  'a2000000-0000-0000-0000-000000000002',
  'Santigold',
  'managed',
  'Indie Pop / Art Rock / New Wave',
  3200000,
  148000,
  18,
  '820M',
  'active',
  true,
  1,
  'Worldwide',
  '2026-02-01',
  'Catalog growth focus. Strong sync pipeline — film + TV placements active. New release in development for Q4 2026.'
) ON CONFLICT DO NOTHING;

-- ── Seed: Placeholder Artist 03 ──────────────────────────────────────────────

INSERT INTO catalog_clients (
  id, name, type, status, territory, client_since, description,
  accent_color, catalog_rep, catalog_rep_email,
  est_catalog_value, est_monthly_revenue, total_artists, is_active
) VALUES (
  'a3000000-0000-0000-0000-000000000003',
  'Placeholder Artist 03',
  'artist',
  'onboarding',
  'Worldwide',
  'April 2026',
  'Emerging artist catalog currently in onboarding and initial data enrichment phase. GMG managing intake of back catalog, rights documentation, and initial revenue baseline assessment.',
  '#3B82F6',
  'GMG Catalog Team',
  'catalog@gmg.ai',
  420000,
  18500,
  1,
  true
) ON CONFLICT (id) DO NOTHING;

INSERT INTO catalog_client_artists (
  client_id, artist_name, artist_role, genre,
  catalog_value_est, monthly_revenue_est, total_releases, total_streams_alltime,
  status, is_primary, priority_rank, territory, signed_date, notes
) VALUES (
  'a3000000-0000-0000-0000-000000000003',
  'Placeholder Artist 03',
  'acquired',
  'TBD',
  420000,
  18500,
  6,
  '42M',
  'on_hold',
  true,
  1,
  'Worldwide',
  '2026-04-01',
  'Onboarding in progress. Rights documentation review underway. Full catalog assessment expected by May 2026.'
) ON CONFLICT DO NOTHING;
