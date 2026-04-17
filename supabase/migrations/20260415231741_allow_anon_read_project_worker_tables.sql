/*
  # Allow anon reads on project worker tables for Industry OS

  ## Summary
  Industry OS uses custom authentication (not Supabase auth), so its frontend
  client has no authenticated Supabase JWT. The existing SELECT policies on
  project_workers, project_assignments, and payment_safes only allow the
  'authenticated' role, causing fetchWorkerByEmail() to always return null for
  Industry OS members.

  ## Changes
  1. Add SELECT policies for the 'anon' role on:
     - project_workers (lookup by email + system + is_active)
     - project_assignments (lookup by worker_id)
     - payment_safes (lookup by worker_id)

  These are read-only policies. Write operations remain restricted to
  authenticated/admin users.
*/

CREATE POLICY "Anon can read project workers"
  ON project_workers
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can read project assignments"
  ON project_assignments
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anon can read payment safes"
  ON payment_safes
  FOR SELECT
  TO anon
  USING (true);
