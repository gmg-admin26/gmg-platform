/*
  # Admin OS — AI Agents + Executive Digests

  1. New Tables
    - `admin_ai_agents` — GMG internal AI agent roster (Ledger, Vault, Shield, Beacon, etc.)
      - `id` (uuid, pk)
      - `slug` (text, unique) — stable key like 'ledger'
      - `name` (text) — display name
      - `role` (text) — functional role
      - `mission` (text) — short mission statement
      - `status` (text) — 'active' | 'idle' | 'paused' | 'blocked'
      - `system` (text) — linked system (admin, artist_os, catalog_os, industry_os, rocksteady)
      - `current_assignments` (int, default 0)
      - `recent_actions` (int, default 0)
      - `blockers` (int, default 0)
      - `escalations` (int, default 0)
      - `last_action_at` (timestamptz)
      - `color` (text) — accent color for chips/cards
      - `sort_order` (int, default 0)
      - timestamps

    - `admin_executive_digests` — daily/weekly/monthly exec digests archive
      - `id` (uuid, pk)
      - `period` (text) — 'daily' | 'weekly' | 'monthly'
      - `title` (text)
      - `summary` (text)
      - `decisions_needed` (int, default 0)
      - `blocked_items` (int, default 0)
      - `ready_items` (int, default 0)
      - `what_changed` (text)
      - `published_at` (timestamptz, default now())
      - timestamps

  2. Security
    - RLS enabled on both tables
    - SELECT allowed for authenticated users (admin surface gated at UI level)
    - No insert/update/delete policies at DB level (admin writes happen via service role or seeded data)

  3. Seed Data
    - 18 AI agents seeded per operations agent build plan roster
    - 3 executive digests seeded
*/

CREATE TABLE IF NOT EXISTS admin_ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  mission text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  system text NOT NULL DEFAULT 'admin',
  current_assignments integer NOT NULL DEFAULT 0,
  recent_actions integer NOT NULL DEFAULT 0,
  blockers integer NOT NULL DEFAULT 0,
  escalations integer NOT NULL DEFAULT 0,
  last_action_at timestamptz DEFAULT now(),
  color text NOT NULL DEFAULT '#06B6D4',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_ai_agents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_ai_agents' AND policyname = 'Authenticated read admin agents'
  ) THEN
    CREATE POLICY "Authenticated read admin agents"
      ON admin_ai_agents FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_ai_agents' AND policyname = 'Anon read admin agents for demo'
  ) THEN
    CREATE POLICY "Anon read admin agents for demo"
      ON admin_ai_agents FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS admin_executive_digests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL DEFAULT 'daily',
  title text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  decisions_needed integer NOT NULL DEFAULT 0,
  blocked_items integer NOT NULL DEFAULT 0,
  ready_items integer NOT NULL DEFAULT 0,
  what_changed text NOT NULL DEFAULT '',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_executive_digests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_executive_digests' AND policyname = 'Authenticated read exec digests'
  ) THEN
    CREATE POLICY "Authenticated read exec digests"
      ON admin_executive_digests FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_executive_digests' AND policyname = 'Anon read exec digests for demo'
  ) THEN
    CREATE POLICY "Anon read exec digests for demo"
      ON admin_executive_digests FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;

-- Seed agents
INSERT INTO admin_ai_agents (slug, name, role, mission, status, system, current_assignments, recent_actions, blockers, escalations, color, sort_order)
VALUES
  ('ledger',  'Ledger',  'Finance + Accounting', 'Owns revenue, expenses, cash visibility, payout queues.',            'active',  'admin',       14, 42, 1, 0, '#10B981', 1),
  ('vault',   'Vault',   'Capital + Banking',     'Manages reserves, banking setup, funding readiness.',                'active',  'admin',       6,  18, 0, 0, '#06B6D4', 2),
  ('shield',  'Shield',  'Risk + Protection',     'Policies, coverage renewals, claims routing, live-event risk.',      'active',  'admin',       9,  21, 0, 1, '#F59E0B', 3),
  ('beacon',  'Beacon',  'Cross-System Signals',  'Signal board across streams, fans, scene shifts, campaigns.',        'active',  'admin',       21, 88, 0, 0, '#EC4899', 4),
  ('stage',   'Stage',   'Release + Tour Ops',    'Release dates, tour calendars, rollout plan intelligence.',          'active',  'admin',       7,  26, 1, 0, '#06B6D4', 5),
  ('signalops','SignalOps','Campaign Intelligence','AI rep campaign control, performance loops, recommendations.',      'active',  'artist_os',   18, 63, 0, 1, '#EC4899', 6),
  ('crest',   'Crest',   'Brand + Partnerships',  'Partner pipeline, brand collabs, package matching.',                 'active',  'admin',       5,  12, 0, 0, '#F59E0B', 7),
  ('anchor',  'Anchor',  'Operations Stability',  'System health, error watch, cross-system reliability checks.',       'active',  'admin',       11, 47, 0, 0, '#10B981', 8),
  ('paula-exec','Paula Exec Assistant','Executive Support','Paula''s standing meetings, priorities, decisions pipeline.','active','admin',        4,   9, 0, 0, '#EF4444', 9),
  ('jacquelyn-exec','Jacquelyn Executive Support','Executive Support','Jacquelyn''s calendar, comms, travel, deadlines.','active','admin',       3,  11, 0, 0, '#EF4444', 10),
  ('counsel', 'Counsel', 'Legal + Business Affairs','Contract intelligence, renewals, notice deadlines, NDAs.',         'active',  'admin',       12, 33, 1, 0, '#06B6D4', 11),
  ('contract-loop','Contract Loop Manager','Contracts','PandaDoc loop, signature tracking, missing payment forms.',     'active',  'admin',       8,  24, 0, 0, '#10B981', 12),
  ('industry-marketing','Industry Marketing Rep','Campaigns','Industry-wide marketing comms + outbound execution.',     'active',  'industry_os', 6,  19, 0, 0, '#EC4899', 13),
  ('tour-manager','Tour Manager Rep','Touring Ops','Tour manager operations, routing, advance sheets.',                  'idle',    'admin',       2,   5, 0, 0, '#F59E0B', 14),
  ('store-manager','Store Manager Rep','Retail Ops','Store operations, inventory, membership billing, support.',        'active',  'admin',       4,  10, 0, 0, '#10B981', 15),
  ('campus-manager','Campus Manager','Campus Program','Campus partnerships, program rollout, student operations.',      'idle',    'admin',       1,   3, 0, 0, '#06B6D4', 16),
  ('artist-account','Artist Account Manager','Artist Ops','Artist account relationship, onboarding, escalations.',      'active',  'artist_os',   13, 41, 1, 1, '#EC4899', 17),
  ('label-account','Label Account Manager','Label Ops','Label relationship, roster support, release coordination.',     'active',  'artist_os',   10, 29, 0, 0, '#F59E0B', 18)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  mission = EXCLUDED.mission,
  updated_at = now();

-- Seed digests
INSERT INTO admin_executive_digests (period, title, summary, decisions_needed, blocked_items, ready_items, what_changed, published_at)
VALUES
  ('daily',   'Daily Digest — Today',       'Contracts out 12, payouts pending 4, signals hot on 3 artists, partner docs waiting 2.', 3, 2, 7,  'Gallagher proposal moved to signature. Two campaign budgets flagged over-threshold. One artist momentum spike > 400%.', now()),
  ('weekly',  'Weekly Digest — This Week',  'Revenue +8.4%, payouts processed 22, LOIs advanced 5, no SLA breaches.',                 5, 3, 14, 'Banc of California fractional package under review. Two catalog renewals escalated. Tour rollout approved.',             now() - interval '1 day'),
  ('monthly', 'Monthly Digest — Last Close','Month-end close complete, tax-ready 96%, royalty readiness 88%, 1099 tracking on-track.',2, 1, 31, 'Closed Q2 books. Finalized fractional partnership scope. Three artists cleared roster readiness audit.',                now() - interval '3 day')
ON CONFLICT DO NOTHING;
