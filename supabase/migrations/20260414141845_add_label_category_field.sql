/*
  # Add label_category field to labels table

  ## Summary
  Adds a `label_category` column to the `labels` table to support a structured
  classification system distinct from the existing `type` field (internal/partner/distribution).

  ## New Columns
  - `labels.label_category` (text, nullable) — one of:
    'Brand Imprint' | 'Campus Label' | 'Wellness Label' | 'Indie Label'

  ## Default Mappings
  Sets initial category values for all existing labels based on best-fit:
  - GMG → Brand Imprint
  - SPIN Records → Brand Imprint
  - SNBJR Records → Campus Label
  - Self-Realization Fellowship → Wellness Label
  - Alabama Sound Company → Indie Label
  - Quatorze Recordings → Indie Label

  ## Notes
  - Column is nullable so existing rows without a category are not broken
  - No RLS changes needed — inherits existing label table policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'labels' AND column_name = 'label_category'
  ) THEN
    ALTER TABLE labels ADD COLUMN label_category text DEFAULT NULL;
  END IF;
END $$;

UPDATE labels SET label_category = 'Brand Imprint'   WHERE slug = 'gmg';
UPDATE labels SET label_category = 'Brand Imprint'   WHERE slug = 'spin-records';
UPDATE labels SET label_category = 'Campus Label'    WHERE slug = 'snbjr-records';
UPDATE labels SET label_category = 'Wellness Label'  WHERE slug = 'srf';
UPDATE labels SET label_category = 'Indie Label'     WHERE slug = 'alabama-sound';
UPDATE labels SET label_category = 'Indie Label'     WHERE slug = 'quatorze';
