/*
  # Global Task & Workflow System

  ## Summary
  Creates a comprehensive task management system usable across Admin OS, Artist OS,
  Catalog OS, and future Industry OS. Supports AI vs human work tracking, revenue
  impact tracking, blockers, status history, and notes history.

  ## New Tables

  ### tasks
  Core task record with all metadata fields:
  - id, title, description
  - linked_system: which OS this belongs to (admin_os, artist_os, catalog_os, etc.)
  - linked_entity_id / linked_entity_name: artist, catalog, label, etc.
  - assignee_id, assignee_name, assignee_type (ai_operator, human_team, artist, external)
  - created_by_name, completed_by_name
  - priority: critical, high, medium, low
  - status: open, in_progress, blocked, review, completed, cancelled
  - due_date
  - revenue_impact (numeric)
  - revenue_impact_label
  - related_milestone
  - blocker_notes
  - timestamps

  ### task_notes
  Append-only notes log per task (history thread).

  ### task_status_history
  Every status change is recorded with who changed it and when.

  ## Security
  RLS enabled. Authenticated users can read all tasks.
  Authenticated users can insert/update tasks.
*/

CREATE TABLE IF NOT EXISTS tasks (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 text NOT NULL,
  description           text,
  linked_system         text NOT NULL DEFAULT 'admin_os',
  linked_entity_id      text,
  linked_entity_name    text,
  assignee_id           text,
  assignee_name         text NOT NULL DEFAULT 'Unassigned',
  assignee_type         text NOT NULL DEFAULT 'human_team',
  priority              text NOT NULL DEFAULT 'medium',
  status                text NOT NULL DEFAULT 'open',
  due_date              date,
  notes                 text,
  blocker_notes         text,
  revenue_impact        numeric,
  revenue_impact_label  text,
  related_milestone     text,
  created_by            text,
  completed_by          text,
  completed_at          timestamptz,
  metadata              jsonb DEFAULT '{}',
  created_at            timestamptz DEFAULT now(),
  updated_at            timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_notes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  author     text NOT NULL,
  author_type text NOT NULL DEFAULT 'human_team',
  body       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_status_history (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  from_status text,
  to_status   text NOT NULL,
  changed_by  text NOT NULL,
  note        text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_notes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tasks"
  ON tasks FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tasks"
  ON tasks FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks"
  ON tasks FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read task notes"
  ON task_notes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert task notes"
  ON task_notes FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read status history"
  ON task_status_history FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert status history"
  ON task_status_history FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS tasks_linked_system_idx  ON tasks(linked_system);
CREATE INDEX IF NOT EXISTS tasks_status_idx         ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_assignee_type_idx  ON tasks(assignee_type);
CREATE INDEX IF NOT EXISTS task_notes_task_id_idx   ON task_notes(task_id);
CREATE INDEX IF NOT EXISTS task_history_task_id_idx ON task_status_history(task_id);
