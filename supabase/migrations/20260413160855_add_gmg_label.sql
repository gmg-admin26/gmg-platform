/*
  # Add GMG as an internal label

  1. Changes
    - Inserts GMG (Greater Music Group) as an internal label into the labels table
    - Ensures no duplicate via ON CONFLICT DO NOTHING

  2. Notes
    - GMG is the parent/house label for artists signed directly to Greater Music Group
*/

INSERT INTO labels (slug, name, type, status, color, contact_name, contact_email, notes)
VALUES (
  'gmg',
  'GMG',
  'internal',
  'active',
  '#06B6D4',
  'Randy Jackson',
  '',
  'Greater Music Group house label. Direct GMG signings.'
)
ON CONFLICT (slug) DO NOTHING;
