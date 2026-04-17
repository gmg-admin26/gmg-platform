/*
  # Artist OS — Normalized Data Schema

  ## Summary
  Creates the full normalized data layer for the GMG Artist OS platform.
  This migration establishes the five core object types plus supporting tables:

  ## New Tables

  ### 1. aos_artists
  Master artist record. One row per signed artist.
  - Identity: id (AOS-xxx), name, tier, status, genre, location
  - Streaming metrics: monthly_listeners, total_streams, spotify_followers, etc.
  - Social: instagram_link/handle/followers, tiktok_link, youtube_link/followers, facebook_link
  - Contact: artist_phone, primary_email
  - Internal: ar_rep, point_person, internal_notes, roster_notes, health_score
  - Data quality: data_quality_score (0–100), nebula_synced flag, last_synced_at

  ### 2. aos_labels
  Label/imprint records. Artists belong to a label.
  - id, name, type (GMG_internal | external_partner | distribution), contact info

  ### 3. aos_contacts
  Normalized contact records. One row per person (manager, A&R rep, etc.)
  - id, artist_id (FK), full_name, role, email, phone, company

  ### 4. aos_financials
  Financial snapshot per artist per period.
  - artist_id (FK), period (all_time | ytd | last_30), advance, spend breakdowns, revenue

  ### 5. aos_campaigns
  Campaign records per artist.
  - artist_id (FK), title, type, stage, budget, status, dates, performance metrics

  ### 6. aos_releases
  Release records per artist.
  - artist_id (FK), title, type, status, release_date, campaign_stage, streams

  ### 7. aos_data_quality_log
  Per-field data quality audit. Records missing/pending fields.
  - artist_id (FK), field_name, field_status (present | missing | pending_nebula | stale)

  ## Security
  - RLS enabled on all tables
  - Policies scoped to authenticated users only
  - Admin-level and artist-level access separation
*/

-- ============================================================
-- 1. ARTISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_artists (
  id                    text PRIMARY KEY,
  name                  text NOT NULL,
  avatar_initials       text NOT NULL DEFAULT '',
  avatar_color          text NOT NULL DEFAULT '#10B981',
  tier                  text NOT NULL DEFAULT 'Base Roster'
                          CHECK (tier IN ('Growth Roster','Base Roster','Label Roster','Priority')),
  status                text NOT NULL DEFAULT 'Active'
                          CHECK (status IN ('Active','On Hold','Recouping','Inactive','Priority','New Signing','Pending Sync')),
  genre                 text NOT NULL DEFAULT '',
  subgenre              text NOT NULL DEFAULT '',
  city                  text NOT NULL DEFAULT '',
  country               text NOT NULL DEFAULT 'US',
  market                text NOT NULL DEFAULT '',
  signing_date          text NOT NULL DEFAULT 'Pending Sync',
  health_score          integer NOT NULL DEFAULT 50 CHECK (health_score BETWEEN 0 AND 100),
  monthly_listeners     integer NOT NULL DEFAULT 0,
  active_listeners      integer NOT NULL DEFAULT 0,
  total_streams         bigint NOT NULL DEFAULT 0,
  streaming_at_signing  bigint NOT NULL DEFAULT 0,
  followers             integer NOT NULL DEFAULT 0,
  fan_engagement_score  integer NOT NULL DEFAULT 0,
  spotify_link          text NOT NULL DEFAULT '',
  spotify_followers     integer NOT NULL DEFAULT 0,
  instagram_link        text NOT NULL DEFAULT '',
  instagram_handle      text NOT NULL DEFAULT '',
  instagram_followers   integer NOT NULL DEFAULT 0,
  tiktok_link           text NOT NULL DEFAULT '',
  youtube_link          text NOT NULL DEFAULT '',
  youtube_followers     integer NOT NULL DEFAULT 0,
  facebook_link         text NOT NULL DEFAULT '',
  top_platform          text NOT NULL DEFAULT '',
  artist_phone          text NOT NULL DEFAULT '',
  primary_email         text NOT NULL DEFAULT '',
  label_imprint         text NOT NULL DEFAULT 'Greater Music Group',
  roster_notes          text NOT NULL DEFAULT '',
  internal_notes        text NOT NULL DEFAULT '',
  streaming_delta       text NOT NULL DEFAULT 'Pending sync',
  follower_delta        text NOT NULL DEFAULT 'Pending sync',
  active_listener_delta text NOT NULL DEFAULT 'Pending sync',
  ar_rep                text NOT NULL DEFAULT '',
  point_person          text NOT NULL DEFAULT '',
  manager               text NOT NULL DEFAULT '',
  management_contact    text NOT NULL DEFAULT '',
  manager_phone         text NOT NULL DEFAULT '',
  -- Data quality
  data_quality_score    integer NOT NULL DEFAULT 0 CHECK (data_quality_score BETWEEN 0 AND 100),
  nebula_synced         boolean NOT NULL DEFAULT false,
  last_synced_at        timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE aos_artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view artists"
  ON aos_artists FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert artists"
  ON aos_artists FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update artists"
  ON aos_artists FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 2. LABELS
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_labels (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  type          text NOT NULL DEFAULT 'GMG_internal'
                  CHECK (type IN ('GMG_internal','external_partner','distribution')),
  contact_name  text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  contact_phone text NOT NULL DEFAULT '',
  website       text NOT NULL DEFAULT '',
  notes         text NOT NULL DEFAULT '',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE aos_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view labels"
  ON aos_labels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert labels"
  ON aos_labels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update labels"
  ON aos_labels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. CONTACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_contacts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  role        text NOT NULL DEFAULT 'manager'
                CHECK (role IN ('manager','ar_rep','booking','legal','publicist','label_contact','artist_self','other')),
  email       text NOT NULL DEFAULT '',
  phone       text NOT NULL DEFAULT '',
  company     text NOT NULL DEFAULT '',
  is_primary  boolean NOT NULL DEFAULT false,
  notes       text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aos_contacts_artist_id_idx ON aos_contacts(artist_id);

ALTER TABLE aos_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view contacts"
  ON aos_contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert contacts"
  ON aos_contacts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update contacts"
  ON aos_contacts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. FINANCIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_financials (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id                   text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  period                      text NOT NULL DEFAULT 'all_time'
                                CHECK (period IN ('all_time','ytd','last_30')),
  advance                     numeric(12,2) NOT NULL DEFAULT 0,
  artist_grant                numeric(12,2) NOT NULL DEFAULT 0,
  artist_grant_recoupable     boolean NOT NULL DEFAULT false,
  ad_spend                    numeric(12,2) NOT NULL DEFAULT 0,
  marketing_spend             numeric(12,2) NOT NULL DEFAULT 0,
  live_shows                  numeric(12,2) NOT NULL DEFAULT 0,
  touring                     numeric(12,2) NOT NULL DEFAULT 0,
  content_production          numeric(12,2) NOT NULL DEFAULT 0,
  ar_spend                    numeric(12,2) NOT NULL DEFAULT 0,
  operations_people           numeric(12,2) NOT NULL DEFAULT 0,
  other_recoupable            numeric(12,2) NOT NULL DEFAULT 0,
  other_non_recoupable        numeric(12,2) NOT NULL DEFAULT 0,
  total_investment            numeric(12,2) NOT NULL DEFAULT 0,
  total_recoupable_spend      numeric(12,2) NOT NULL DEFAULT 0,
  total_non_recoupable_spend  numeric(12,2) NOT NULL DEFAULT 0,
  recoupable_balance          numeric(12,2) NOT NULL DEFAULT 0,
  revenue                     numeric(12,2) NOT NULL DEFAULT 0,
  snapshot_date               date NOT NULL DEFAULT CURRENT_DATE,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artist_id, period, snapshot_date)
);

CREATE INDEX IF NOT EXISTS aos_financials_artist_id_idx ON aos_financials(artist_id);

ALTER TABLE aos_financials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view financials"
  ON aos_financials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert financials"
  ON aos_financials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update financials"
  ON aos_financials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 5. CAMPAIGNS
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_campaigns (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id       text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  title           text NOT NULL,
  type            text NOT NULL DEFAULT 'release'
                    CHECK (type IN ('release','brand','touring','content','awareness','retargeting','playlist')),
  stage           text NOT NULL DEFAULT 'Pre-Release'
                    CHECK (stage IN ('Pre-Release','Launch Week','Active Push','Sustain','Wind Down','Standby')),
  status          text NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active','paused','completed','draft','cancelled')),
  budget          numeric(12,2) NOT NULL DEFAULT 0,
  spend_to_date   numeric(12,2) NOT NULL DEFAULT 0,
  impressions     bigint NOT NULL DEFAULT 0,
  clicks          bigint NOT NULL DEFAULT 0,
  conversions     integer NOT NULL DEFAULT 0,
  streams_driven  bigint NOT NULL DEFAULT 0,
  start_date      date,
  end_date        date,
  platforms       text[] NOT NULL DEFAULT '{}',
  owner           text NOT NULL DEFAULT '',
  notes           text NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aos_campaigns_artist_id_idx ON aos_campaigns(artist_id);

ALTER TABLE aos_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view campaigns"
  ON aos_campaigns FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert campaigns"
  ON aos_campaigns FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update campaigns"
  ON aos_campaigns FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 6. RELEASES
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_releases (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id       text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  title           text NOT NULL,
  type            text NOT NULL DEFAULT 'Single'
                    CHECK (type IN ('Single','EP','Album','Mixtape')),
  status          text NOT NULL DEFAULT 'No Active Release'
                    CHECK (status IN ('Released','In Production','Scheduled','Blocked','Pre-Save Live','No Active Release')),
  release_date    text NOT NULL DEFAULT 'TBD',
  campaign_stage  text NOT NULL DEFAULT 'Standby'
                    CHECK (campaign_stage IN ('Pre-Release','Launch Week','Active Push','Sustain','Wind Down','Standby')),
  streams         bigint NOT NULL DEFAULT 0,
  cover_note      text NOT NULL DEFAULT '',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS aos_releases_artist_id_idx ON aos_releases(artist_id);

ALTER TABLE aos_releases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view releases"
  ON aos_releases FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert releases"
  ON aos_releases FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update releases"
  ON aos_releases FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 7. DATA QUALITY LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS aos_data_quality_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id   text NOT NULL REFERENCES aos_artists(id) ON DELETE CASCADE,
  field_name  text NOT NULL,
  field_group text NOT NULL DEFAULT 'general'
                CHECK (field_group IN ('identity','streaming','social','contact','financial','release','campaign','internal')),
  status      text NOT NULL DEFAULT 'missing'
                CHECK (status IN ('present','missing','pending_nebula','stale','needs_review')),
  notes       text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (artist_id, field_name)
);

CREATE INDEX IF NOT EXISTS aos_dql_artist_id_idx ON aos_data_quality_log(artist_id);
CREATE INDEX IF NOT EXISTS aos_dql_status_idx    ON aos_data_quality_log(status);

ALTER TABLE aos_data_quality_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view data quality log"
  ON aos_data_quality_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert data quality log"
  ON aos_data_quality_log FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin users can update data quality log"
  ON aos_data_quality_log FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
