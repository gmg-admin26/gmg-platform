/*
  # Project Worker Payment System

  ## Overview
  A reusable payment infrastructure for temporary workers, contractors, editors,
  marketers, tour workers, and project-based collaborators across Catalog OS and
  Industry OS.

  ## New Tables

  ### `project_workers`
  Core worker profile storing identity, role, fee type, rate, payment terms,
  and all compliance documentation status.

  ### `project_assignments`
  Per-worker deliverable block describing what work is required, what completion
  means, due dates, and assigned manager.

  ### `payment_safes`
  The payment hold and release ledger per worker. Tracks amount, status lifecycle,
  expected release, delay reasons, and all compliance gates.

  ### `payment_delay_log`
  Audit trail of all delay reason entries with timestamps.

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read/insert/update
  - Anon users can SELECT (required for Industry OS which uses custom auth, not Supabase Auth)
*/

CREATE TABLE IF NOT EXISTS project_workers (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  role                 text NOT NULL DEFAULT '',
  project              text NOT NULL DEFAULT '',
  system               text NOT NULL DEFAULT 'catalog_os' CHECK (system IN ('catalog_os','industry_os','artist_os','rocksteady')),
  fee_type             text NOT NULL DEFAULT 'flat' CHECK (fee_type IN ('hourly','flat','retainer','rev_share')),
  rate                 numeric(12,2) NOT NULL DEFAULT 0,
  rate_currency        text NOT NULL DEFAULT 'USD',
  payment_terms_days   integer NOT NULL DEFAULT 60,
  ach_status           text NOT NULL DEFAULT 'missing' CHECK (ach_status IN ('missing','pending','connected')),
  w9_status            text NOT NULL DEFAULT 'missing' CHECK (w9_status IN ('missing','submitted','verified')),
  invoice_status       text NOT NULL DEFAULT 'missing' CHECK (invoice_status IN ('missing','submitted','approved','paid')),
  agreement_status     text NOT NULL DEFAULT 'missing' CHECK (agreement_status IN ('missing','sent','signed')),
  email                text,
  phone                text,
  entity_name          text,
  ein_last4            text,
  notes                text,
  is_active            boolean NOT NULL DEFAULT true,
  created_by           uuid,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_workers ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_workers' AND policyname = 'Anon can read project workers') THEN
    CREATE POLICY "Anon can read project workers"
      ON project_workers FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_workers' AND policyname = 'Authenticated users can read project workers') THEN
    CREATE POLICY "Authenticated users can read project workers"
      ON project_workers FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_workers' AND policyname = 'Authenticated users can insert project workers') THEN
    CREATE POLICY "Authenticated users can insert project workers"
      ON project_workers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_workers' AND policyname = 'Authenticated users can update project workers') THEN
    CREATE POLICY "Authenticated users can update project workers"
      ON project_workers FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS project_assignments (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id                uuid NOT NULL REFERENCES project_workers(id) ON DELETE CASCADE,
  deliverable_title        text NOT NULL DEFAULT '',
  deliverable_description  text,
  completion_definition    text,
  due_date                 date,
  assigned_manager         text,
  status                   text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','submitted','approved','rejected','cancelled')),
  notes                    text,
  issues                   text,
  sort_order               integer NOT NULL DEFAULT 0,
  created_at               timestamptz NOT NULL DEFAULT now(),
  updated_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_assignments' AND policyname = 'Anon can read project assignments') THEN
    CREATE POLICY "Anon can read project assignments"
      ON project_assignments FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_assignments' AND policyname = 'Authenticated users can read project assignments') THEN
    CREATE POLICY "Authenticated users can read project assignments"
      ON project_assignments FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_assignments' AND policyname = 'Authenticated users can insert project assignments') THEN
    CREATE POLICY "Authenticated users can insert project assignments"
      ON project_assignments FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'project_assignments' AND policyname = 'Authenticated users can update project assignments') THEN
    CREATE POLICY "Authenticated users can update project assignments"
      ON project_assignments FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS payment_safes (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id                       uuid NOT NULL REFERENCES project_workers(id) ON DELETE CASCADE,
  assignment_id                   uuid REFERENCES project_assignments(id) ON DELETE SET NULL,
  amount                          numeric(12,2) NOT NULL DEFAULT 0,
  currency                        text NOT NULL DEFAULT 'USD',
  status                          text NOT NULL DEFAULT 'held' CHECK (status IN ('held','pending','approved','delayed','paid','cancelled')),
  expected_release_date           date,
  delay_reason                    text,
  delay_title                     text,
  delay_category                  text,
  delay_description               text,
  delay_requires_worker_action    boolean DEFAULT false,
  release_type                    text,
  stage                           text,
  compliance_contract_signed      boolean NOT NULL DEFAULT false,
  compliance_w9_submitted         boolean NOT NULL DEFAULT false,
  compliance_invoice_submitted    boolean NOT NULL DEFAULT false,
  compliance_ach_connected        boolean NOT NULL DEFAULT false,
  compliance_deliverables_approved boolean NOT NULL DEFAULT false,
  approved_by                     text,
  approved_at                     timestamptz,
  paid_at                         timestamptz,
  payment_method                  text DEFAULT 'ach',
  notes                           text,
  created_by                      uuid,
  created_at                      timestamptz NOT NULL DEFAULT now(),
  updated_at                      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_safes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_safes' AND policyname = 'Anon can read payment safes') THEN
    CREATE POLICY "Anon can read payment safes"
      ON payment_safes FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_safes' AND policyname = 'Authenticated users can read payment safes') THEN
    CREATE POLICY "Authenticated users can read payment safes"
      ON payment_safes FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_safes' AND policyname = 'Authenticated users can insert payment safes') THEN
    CREATE POLICY "Authenticated users can insert payment safes"
      ON payment_safes FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_safes' AND policyname = 'Authenticated users can update payment safes') THEN
    CREATE POLICY "Authenticated users can update payment safes"
      ON payment_safes FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS payment_delay_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_safe_id  uuid NOT NULL REFERENCES payment_safes(id) ON DELETE CASCADE,
  worker_id        uuid NOT NULL REFERENCES project_workers(id) ON DELETE CASCADE,
  reason           text NOT NULL DEFAULT '',
  logged_by        text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_delay_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_delay_log' AND policyname = 'Anon can read payment delay log') THEN
    CREATE POLICY "Anon can read payment delay log"
      ON payment_delay_log FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_delay_log' AND policyname = 'Authenticated users can read delay log') THEN
    CREATE POLICY "Authenticated users can read delay log"
      ON payment_delay_log FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_delay_log' AND policyname = 'Authenticated users can insert delay log') THEN
    CREATE POLICY "Authenticated users can insert delay log"
      ON payment_delay_log FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_project_workers_system     ON project_workers(system);
CREATE INDEX IF NOT EXISTS idx_project_workers_active     ON project_workers(is_active);
CREATE INDEX IF NOT EXISTS idx_project_assignments_worker ON project_assignments(worker_id);
CREATE INDEX IF NOT EXISTS idx_payment_safes_worker       ON payment_safes(worker_id);
CREATE INDEX IF NOT EXISTS idx_payment_safes_status       ON payment_safes(status);
CREATE INDEX IF NOT EXISTS idx_delay_log_safe             ON payment_delay_log(payment_safe_id);
