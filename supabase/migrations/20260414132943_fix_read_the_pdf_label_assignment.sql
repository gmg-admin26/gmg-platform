/*
  # Fix Read the PDF (Kennedy) label assignment

  ## Summary
  Corrects a data error where AOS-005 "Read the PDF (Kennedy)" was incorrectly 
  assigned to Alabama Sound Company. This artist belongs directly under GMG 
  (Greater Music Group) as a direct signing.

  ## Changes
  - Deactivates the incorrect Alabama Sound Company assignment for AOS-005
  - Creates an active assignment linking AOS-005 to GMG

  ## Notes
  - GMG label UUID: 663f03b5-af40-462c-a373-1b3d124b51d0
  - Alabama Sound UUID: 1cc067c4-9a20-4155-bddc-ce10cfd3795c
*/

UPDATE artist_label_assignments
SET active = false
WHERE artist_id = 'AOS-005'
  AND label_id = '1cc067c4-9a20-4155-bddc-ce10cfd3795c';

INSERT INTO artist_label_assignments (artist_id, label_id, role, assigned_by, active, assigned_at)
VALUES ('AOS-005', '663f03b5-af40-462c-a373-1b3d124b51d0', 'primary', 'admin', true, now())
ON CONFLICT (artist_id, label_id) DO UPDATE
  SET active = true, assigned_by = 'admin', assigned_at = now();
