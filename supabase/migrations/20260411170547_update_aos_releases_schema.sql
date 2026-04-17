/*
  # Update aos_releases schema

  ## Changes

  ### aos_releases table
  - **Status enum expanded**: Replaces the old limited set with:
    - `active` — currently live/active
    - `upcoming` — confirmed and approaching
    - `scheduled` — date locked, pre-release phase
    - `in_production` — actively being recorded/mixed/mastered
    - `planning` — concept/ideation stage
    - `released` — fully released and in catalog
  - **New column `campaign_id`**: Optional FK to `aos_campaigns.id` so each release can be linked to its campaign
  - **New column `label`**: Text field for label/imprint name (replaces implicit coupling)

  ## Security
  - Existing RLS remains active; no policy changes needed
*/

DO $$
BEGIN
  -- Drop the existing status check constraint
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'aos_releases'
      AND constraint_type = 'CHECK'
      AND constraint_name LIKE '%status%'
  ) THEN
    ALTER TABLE aos_releases DROP CONSTRAINT IF EXISTS aos_releases_status_check;
  END IF;
END $$;

ALTER TABLE aos_releases
  ALTER COLUMN status SET DEFAULT 'planning',
  ADD CONSTRAINT aos_releases_status_check
    CHECK (status = ANY (ARRAY[
      'active'::text,
      'upcoming'::text,
      'scheduled'::text,
      'in_production'::text,
      'planning'::text,
      'released'::text
    ]));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_releases' AND column_name = 'campaign_id'
  ) THEN
    ALTER TABLE aos_releases ADD COLUMN campaign_id uuid REFERENCES aos_campaigns(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'aos_releases' AND column_name = 'label'
  ) THEN
    ALTER TABLE aos_releases ADD COLUMN label text NOT NULL DEFAULT '';
  END IF;
END $$;
