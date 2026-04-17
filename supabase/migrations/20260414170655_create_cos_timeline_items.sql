/*
  # Catalog OS — 12-Month Timeline Items

  ## Summary
  Creates a persistent table for strategic timeline / operating plan items
  inside Catalog OS. Each item represents a planned or executed initiative
  on behalf of an artist's catalog.

  ## New Table: `cos_timeline_items`

  Stores individual timeline entries for the 12-month operating plan.

  ### Columns
  - id              — UUID primary key
  - catalog_id      — text identifier for the catalog (e.g. 'bassnectar')
  - month_key       — YYYY-MM format (e.g. '2026-05') for ordering
  - month_label     — Display label (e.g. 'May 2026')
  - type            — Category: release | campaign | sync | merch | touring |
                      interview | press | fan_club | brand_rehab | venture |
                      partnership | content | legal | finance
  - title           — Short item title
  - description     — Full detail / context
  - owner           — Who owns execution (text)
  - status          — planned | in_progress | completed | delayed | cancelled
  - linked_task_id  — Optional FK to tasks table
  - expected_outcome — Plain-English outcome description
  - expected_revenue — Optional numeric revenue estimate
  - revenue_label   — Display string for revenue (e.g. '$80K–$220K')
  - priority        — critical | high | medium | low
  - color           — Hex color for UI display
  - created_at
  - updated_at

  ## Security
  - RLS enabled
  - Authenticated users can read / insert / update
*/

CREATE TABLE IF NOT EXISTS cos_timeline_items (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_id       text NOT NULL DEFAULT 'bassnectar',
  month_key        text NOT NULL,
  month_label      text NOT NULL,
  type             text NOT NULL DEFAULT 'campaign',
  title            text NOT NULL,
  description      text,
  owner            text NOT NULL DEFAULT 'GMG Team',
  status           text NOT NULL DEFAULT 'planned',
  linked_task_id   uuid REFERENCES tasks(id) ON DELETE SET NULL,
  expected_outcome text,
  expected_revenue numeric(12,2),
  revenue_label    text,
  priority         text NOT NULL DEFAULT 'medium',
  color            text NOT NULL DEFAULT '#10B981',
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE cos_timeline_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read timeline items"
  ON cos_timeline_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert timeline items"
  ON cos_timeline_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update timeline items"
  ON cos_timeline_items FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_cos_timeline_catalog_month ON cos_timeline_items(catalog_id, month_key);
CREATE INDEX IF NOT EXISTS idx_cos_timeline_status ON cos_timeline_items(catalog_id, status);
