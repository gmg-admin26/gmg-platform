/*
  # Add for_sale status + update Bassnectar catalog record

  1. Changes
    - Adds 'for_sale' as a valid status in catalog_clients_status_check constraint
    - Updates Bassnectar / Amorphous Music record to status = 'for_sale'
    - Adds for_sale_date, catalog_comms_email, business_entities to metadata

  2. Notes
    - The 'for_sale' status is a new variant indicating catalog is actively listed
    - Business entities: Amorphous Music, Vasona Blue, ZFM Music, Bassnectar Touring, Bassnectar Inc
    - For sale as of April 15, 2026
    - Contact: bn@greatermusicgroupteam.com
*/

ALTER TABLE catalog_clients
  DROP CONSTRAINT IF EXISTS catalog_clients_status_check;

ALTER TABLE catalog_clients
  ADD CONSTRAINT catalog_clients_status_check
  CHECK (status = ANY (ARRAY[
    'active'::text,
    'onboarding'::text,
    'paused'::text,
    'offboarded'::text,
    'for_sale'::text
  ]));

UPDATE catalog_clients
SET
  status   = 'for_sale',
  metadata = COALESCE(metadata, '{}'::jsonb) || '{
    "for_sale_date":         "April 15, 2026",
    "catalog_comms_email":   "bn@greatermusicgroupteam.com",
    "sale_status":           "for_sale",
    "business_entities": [
      "Amorphous Music",
      "Vasona Blue",
      "ZFM Music",
      "Bassnectar Touring",
      "Bassnectar Inc"
    ]
  }'::jsonb
WHERE name = 'Bassnectar / Amorphous Music';
