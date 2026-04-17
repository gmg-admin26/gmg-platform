/*
  # Create bug_reports table

  ## Summary
  Creates a persistent table for platform bug reports submitted via the in-app
  Report Bug flow. Records page context, severity, category, and full description.

  ## New Tables
  - `bug_reports`
    - `id` (uuid, primary key)
    - `page_context` (text) — auto-filled current view/page name
    - `category` (text) — issue category (UI, Data, Performance, Access, Other)
    - `severity` (text) — low / medium / high / critical
    - `summary` (text, required) — short title of the issue
    - `description` (text) — detailed description
    - `user_email` (text) — reporter email if available
    - `user_role` (text) — reporter role if available
    - `metadata` (jsonb) — optional extra context (artist, label, etc.)
    - `status` (text) — open / in_review / resolved (default: open)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - INSERT allowed for all authenticated users
  - SELECT/UPDATE restricted to authenticated users reading their own reports
  - Admin-level read handled via service role key in edge functions if needed

  ## Notes
  - Table is append-only for regular users
  - status defaults to 'open' for triage workflow
*/

CREATE TABLE IF NOT EXISTS bug_reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  page_context text        NOT NULL DEFAULT '',
  category     text        NOT NULL DEFAULT 'Other',
  severity     text        NOT NULL DEFAULT 'medium',
  summary      text        NOT NULL,
  description  text        NOT NULL DEFAULT '',
  user_email   text        NOT NULL DEFAULT '',
  user_role    text        NOT NULL DEFAULT '',
  metadata     jsonb       NOT NULL DEFAULT '{}',
  status       text        NOT NULL DEFAULT 'open',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit bug reports"
  ON bug_reports FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own bug reports"
  ON bug_reports FOR SELECT
  TO authenticated
  USING (user_email = auth.jwt() ->> 'email');

CREATE POLICY "Anon insert allowed for bug reports"
  ON bug_reports FOR INSERT
  TO anon
  WITH CHECK (true);
