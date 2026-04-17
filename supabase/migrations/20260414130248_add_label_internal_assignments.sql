/*
  # Add Internal Assignment Columns to Labels

  ## Summary
  Adds A&R Rep and Point Person assignment fields to the labels table,
  mirroring the same internal assignment system used for artists.

  ## Changes
  ### Modified Tables
  - `labels`
    - `ar_rep` (text, default ''): The assigned A&R representative for this label
    - `point_person` (text, default ''): The assigned internal point person for this label

  ## Notes
  - Both fields default to empty string so existing labels are unaffected
  - Values are chosen from the approved GMG team/scout assignee list in the frontend
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'labels' AND column_name = 'ar_rep'
  ) THEN
    ALTER TABLE labels ADD COLUMN ar_rep text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'labels' AND column_name = 'point_person'
  ) THEN
    ALTER TABLE labels ADD COLUMN point_person text NOT NULL DEFAULT '';
  END IF;
END $$;
