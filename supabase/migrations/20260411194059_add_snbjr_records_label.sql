/*
  # Add SNBJR Records to labels table

  1. Changes
    - Inserts SNBJR Records as a partner label with Stacy as primary contact
    - SPIN Records and Alabama Sound Company already exist in the labels table
*/

INSERT INTO labels (slug, name, type, status, contact_name, contact_email, color, notes)
VALUES (
  'snbjr-records',
  'SNBJR Records',
  'partner',
  'active',
  'Stacy',
  'snbjrrecords@gmail.com',
  '#F59E0B',
  'Chicago-based label partner. Artists include Just James F, Simere, Color., Carlito, Nate Nate, Krisavian, Tim Young.'
)
ON CONFLICT (slug) DO NOTHING;
