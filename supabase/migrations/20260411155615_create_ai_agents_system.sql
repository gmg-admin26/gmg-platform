/*
  # AI Agents System — Artist OS Reps

  ## Overview
  Implements AI Agent profiles as first-class assignable operators across artists, tasks, and campaigns.

  ## New Tables

  ### `ai_agents`
  Canonical registry of all AI Agents (Artist OS Reps).

  Columns:
  - `id` (uuid, PK)
  - `slug` (text, unique) — machine key e.g. "apex", "velar"
  - `name` (text) — display name
  - `role` (text) — functional role description
  - `level` (text) — 'Elite' | 'Senior' | 'Junior'
  - `status` (text) — 'deployed' | 'standby' | 'inactive'
  - `color` (text) — accent color
  - `icon_key` (text) — icon identifier for UI
  - `capabilities` (text[]) — array of capability tags
  - `description` (text) — detailed description
  - `created_at` (timestamptz)

  ### `ai_agent_assignments`
  Maps AI agents to artists. One artist can have many agents.

  Columns:
  - `id` (uuid, PK)
  - `agent_id` (uuid, FK → ai_agents.id)
  - `artist_id` (text) — references SignedArtist.id
  - `assigned_at` (timestamptz)
  - `assigned_by` (text)
  - `active` (boolean)

  ### `ai_agent_tasks`
  Tasks assigned to or owned by an AI agent for a specific artist.

  Columns:
  - `id` (uuid, PK)
  - `agent_id` (uuid, FK → ai_agents.id)
  - `artist_id` (text)
  - `title` (text)
  - `description` (text)
  - `priority` (text) — 'High' | 'Medium' | 'Low'
  - `status` (text) — 'Open' | 'In Progress' | 'Done'
  - `due_date` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read
  - Only admin can write
*/

CREATE TABLE IF NOT EXISTS ai_agents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  role         text NOT NULL,
  level        text NOT NULL DEFAULT 'Senior',
  status       text NOT NULL DEFAULT 'deployed',
  color        text NOT NULL DEFAULT '#06B6D4',
  icon_key     text NOT NULL DEFAULT 'cpu',
  capabilities text[] NOT NULL DEFAULT '{}',
  description  text NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ai_agents"
  ON ai_agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert ai_agents"
  ON ai_agents FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE POLICY "Admins can update ai_agents"
  ON ai_agents FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE TABLE IF NOT EXISTS ai_agent_assignments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    uuid NOT NULL REFERENCES ai_agents(id),
  artist_id   text NOT NULL,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by text NOT NULL DEFAULT 'system',
  active      boolean NOT NULL DEFAULT true,
  UNIQUE(agent_id, artist_id)
);

ALTER TABLE ai_agent_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ai_agent_assignments"
  ON ai_agent_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert ai_agent_assignments"
  ON ai_agent_assignments FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE POLICY "Admins can update ai_agent_assignments"
  ON ai_agent_assignments FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE TABLE IF NOT EXISTS ai_agent_tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id    uuid REFERENCES ai_agents(id),
  artist_id   text NOT NULL DEFAULT '',
  title       text NOT NULL,
  description text NOT NULL DEFAULT '',
  priority    text NOT NULL DEFAULT 'Medium',
  status      text NOT NULL DEFAULT 'Open',
  due_date    text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_agent_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view ai_agent_tasks"
  ON ai_agent_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert ai_agent_tasks"
  ON ai_agent_tasks FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE POLICY "Admins can update ai_agent_tasks"
  ON ai_agent_tasks FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin_team');

CREATE INDEX IF NOT EXISTS idx_ai_agent_assignments_agent_id ON ai_agent_assignments(agent_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_assignments_artist_id ON ai_agent_assignments(artist_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_artist_id ON ai_agent_tasks(artist_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_tasks_agent_id ON ai_agent_tasks(agent_id);

INSERT INTO ai_agents (slug, name, role, level, status, color, icon_key, capabilities, description) VALUES
  ('apex',  'Apex',  'High-level strategy, system alignment, long-term direction',  'Elite',  'deployed', '#F59E0B', 'crown',    ARRAY['Strategic Oversight','System Alignment','Long-Term Direction','Priority Setting'], 'Apex serves as the primary strategic lead for all Artist OS operations. Manages high-level decisions, system-wide alignment, and long-term artist direction.'),
  ('velar', 'Velar', 'Campaign architecture, rollout timing, release planning',       'Senior', 'deployed', '#06B6D4', 'calendar', ARRAY['Release Planning','Campaign Architecture','Rollout Timing','Launch Strategy'], 'Velar owns release strategy from concept to execution. Architects campaign rollouts, coordinates timing windows, and aligns release infrastructure.'),
  ('mira',  'Mira',  'Audience development, fan engagement, growth systems',          'Senior', 'deployed', '#10B981', 'users',    ARRAY['Audience Development','Fan Engagement','Growth Systems','Community Building'], 'Mira specializes in audience intelligence and fan-to-community conversion. Builds sustainable growth systems and engagement frameworks.'),
  ('flux',  'Flux',  'Cross-channel growth, momentum systems, execution alignment',   'Senior', 'deployed', '#EC4899', 'zap',      ARRAY['Cross-Channel Growth','Momentum Systems','Execution Alignment','Platform Expansion'], 'Flux drives cross-platform expansion and momentum acceleration. Aligns execution across channels to compound growth velocity.'),
  ('axiom', 'Axiom', 'Day-to-day operations, coordination, execution consistency',    'Senior', 'deployed', '#8B5CF6', 'settings', ARRAY['Operations','Coordination','Execution Consistency','Workflow Management'], 'Axiom manages the operational engine behind each artist. Ensures day-to-day consistency, team coordination, and execution fidelity.'),
  ('forge', 'Forge', 'Marketing execution, amplification systems, visibility',        'Senior', 'deployed', '#EF4444', 'megaphone', ARRAY['Marketing Execution','Amplification Systems','Paid Media','Visibility Infrastructure'], 'Forge runs the marketing amplification layer. Activates paid and organic systems, manages visibility infrastructure, and scales reach.'),
  ('sol',   'Sol',   'Content planning, catalog positioning, release alignment',      'Senior', 'deployed', '#22D3EE', 'disc',     ARRAY['Content Planning','Catalog Positioning','Release Alignment','Asset Strategy'], 'Sol manages content and catalog strategy. Aligns asset positioning with cultural timing and ensures cohesive release narratives.'),
  ('lyric', 'Lyric', 'Performance tracking, engagement signals, optimization',        'Junior', 'deployed', '#84CC16', 'bar-chart', ARRAY['Performance Tracking','Engagement Signals','Data Optimization','Signal Analysis'], 'Lyric monitors real-time performance data and engagement signals. Surfaces optimization opportunities and tracks trend alignment.'),
  ('rune',  'Rune',  'Long-term decision support, prioritization, strategy guidance', 'Junior', 'deployed', '#F97316', 'compass',   ARRAY['Career Direction','Decision Support','Prioritization','Strategy Guidance'], 'Rune provides long-term career direction and strategic prioritization. Guides artist decisions across release cadence, partnerships, and growth.')
ON CONFLICT (slug) DO NOTHING;
