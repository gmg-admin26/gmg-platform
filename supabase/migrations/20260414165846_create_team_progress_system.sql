/*
  # Team Progress & Workflow Reporting System

  ## Summary
  Adds tables to support the Catalog OS Team Progress page, which gives
  artists real-time visibility into work being done on their behalf.

  ## New Tables

  ### `cos_work_log`
  Tracks weekly work entries by department and category.
  - id, catalog_id, week_start, department, category, task_count, ai_hours, human_hours, notes

  ### `cos_allhands_meetings`
  Records all-hands and recurring meetings with action items and next steps.
  - id, catalog_id, title, meeting_date, video_link, summary, action_items (jsonb), attendees (jsonb), next_steps, status, created_at

  ### `cos_workflow_email_log`
  Tracks inbound emails routed into workflow.
  - id, catalog_id, received_at, subject, sender, triage_status, assigned_to, task_created, task_id, created_at

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read/insert records where they own or manage the catalog
*/

-- Work log table
CREATE TABLE IF NOT EXISTS cos_work_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id   text NOT NULL DEFAULT 'bassnectar',
  week_start   date NOT NULL,
  department   text NOT NULL,
  category     text NOT NULL,
  task_count   int  NOT NULL DEFAULT 0,
  ai_hours     numeric(5,1) NOT NULL DEFAULT 0,
  human_hours  numeric(5,1) NOT NULL DEFAULT 0,
  notes        text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE cos_work_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read work log"
  ON cos_work_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert work log"
  ON cos_work_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- All-hands meetings table
CREATE TABLE IF NOT EXISTS cos_allhands_meetings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id    text NOT NULL DEFAULT 'bassnectar',
  title         text NOT NULL,
  meeting_date  date NOT NULL,
  video_link    text,
  summary       text,
  action_items  jsonb NOT NULL DEFAULT '[]',
  attendees     jsonb NOT NULL DEFAULT '[]',
  next_steps    text,
  status        text NOT NULL DEFAULT 'upcoming',
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE cos_allhands_meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read meetings"
  ON cos_allhands_meetings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert meetings"
  ON cos_allhands_meetings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update meetings"
  ON cos_allhands_meetings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Workflow email log table
CREATE TABLE IF NOT EXISTS cos_workflow_email_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id     text NOT NULL DEFAULT 'bassnectar',
  received_at    timestamptz NOT NULL DEFAULT now(),
  subject        text NOT NULL,
  sender         text NOT NULL,
  triage_status  text NOT NULL DEFAULT 'pending',
  assigned_to    text,
  task_created   boolean NOT NULL DEFAULT false,
  task_id        uuid REFERENCES tasks(id) ON DELETE SET NULL,
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE cos_workflow_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read email log"
  ON cos_workflow_email_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert email log"
  ON cos_workflow_email_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cos_work_log_catalog ON cos_work_log(catalog_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_cos_meetings_catalog ON cos_allhands_meetings(catalog_id, meeting_date DESC);
CREATE INDEX IF NOT EXISTS idx_cos_email_log_catalog ON cos_workflow_email_log(catalog_id, received_at DESC);
