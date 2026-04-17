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
  - id, name, role, project, system (catalog_os | industry_os), fee_type, rate,
    payment_terms_days, ach_status, w9_status, invoice_status, agreement_status,
    notes, created_at, updated_at

  ### `project_assignments`
  Per-worker deliverable block describing what work is required, what completion
  means, due dates, and assigned manager.
  - id, worker_id, deliverable_title, deliverable_description, completion_definition,
    due_date, assigned_manager, status, notes, issues, created_at, updated_at

  ### `payment_safes`
  The payment hold and release ledger per worker. Tracks amount, status lifecycle,
  expected release, delay reasons, and all compliance gates.
  - id, worker_id, assignment_id, amount, currency, status (held|pending|approved|
    delayed|paid), expected_release_date, delay_reason, compliance_contract_signed,
    compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected,
    compliance_deliverables_approved, approved_by, approved_at, paid_at, notes,
    created_at, updated_at

  ### `payment_delay_log`
  Audit trail of all delay reason entries with timestamps.
  - id, payment_safe_id, worker_id, reason, logged_by, created_at

  ## Security
  - RLS enabled on all tables
  - Authenticated users can read/insert/update their own records
  - All write operations require authenticated session
*/

-- ── WORKERS ──────────────────────────────────────────────────────────────────

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

CREATE POLICY "Authenticated users can read project workers"
  ON project_workers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert project workers"
  ON project_workers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update project workers"
  ON project_workers FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── ASSIGNMENTS ───────────────────────────────────────────────────────────────

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

CREATE POLICY "Authenticated users can read project assignments"
  ON project_assignments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert project assignments"
  ON project_assignments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update project assignments"
  ON project_assignments FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── PAYMENT SAFES ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payment_safes (
  id                              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id                       uuid NOT NULL REFERENCES project_workers(id) ON DELETE CASCADE,
  assignment_id                   uuid REFERENCES project_assignments(id) ON DELETE SET NULL,
  amount                          numeric(12,2) NOT NULL DEFAULT 0,
  currency                        text NOT NULL DEFAULT 'USD',
  status                          text NOT NULL DEFAULT 'held' CHECK (status IN ('held','pending','approved','delayed','paid','cancelled')),
  expected_release_date           date,
  delay_reason                    text,
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

CREATE POLICY "Authenticated users can read payment safes"
  ON payment_safes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payment safes"
  ON payment_safes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update payment safes"
  ON payment_safes FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── DELAY LOG ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS payment_delay_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_safe_id  uuid NOT NULL REFERENCES payment_safes(id) ON DELETE CASCADE,
  worker_id        uuid NOT NULL REFERENCES project_workers(id) ON DELETE CASCADE,
  reason           text NOT NULL DEFAULT '',
  logged_by        text,
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_delay_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read delay log"
  ON payment_delay_log FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert delay log"
  ON payment_delay_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── INDEXES ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_project_workers_system     ON project_workers(system);
CREATE INDEX IF NOT EXISTS idx_project_workers_active     ON project_workers(is_active);
CREATE INDEX IF NOT EXISTS idx_project_assignments_worker ON project_assignments(worker_id);
CREATE INDEX IF NOT EXISTS idx_payment_safes_worker       ON payment_safes(worker_id);
CREATE INDEX IF NOT EXISTS idx_payment_safes_status       ON payment_safes(status);
CREATE INDEX IF NOT EXISTS idx_delay_log_safe             ON payment_delay_log(payment_safe_id);

-- ── SEED DATA ─────────────────────────────────────────────────────────────────

INSERT INTO project_workers (name, role, project, system, fee_type, rate, payment_terms_days, ach_status, w9_status, invoice_status, agreement_status, entity_name, notes)
VALUES
  ('Jordan Mills',     'Video Editor',          'Catalog Visual Assets 2026',         'catalog_os', 'flat',   3500.00,  60, 'connected', 'verified',  'submitted', 'signed',  'Jordan Mills LLC',   'Primary editor for catalog reels and social clips.'),
  ('Teri Vance',       'Campaign Marketer',     'Streaming Push — Spring 2026',        'catalog_os', 'flat',   2800.00,  60, 'pending',   'submitted', 'missing',   'signed',  NULL,                 'Running DSP pitch campaign and playlist outreach.'),
  ('Rox Delgado',      'Tour Merchandise Lead', 'NYE 2027 Tour Merch',                 'catalog_os', 'hourly', 75.00,    60, 'connected', 'verified',  'approved',  'signed',  'RD Creative',        'Overseeing merch fulfillment and vendor coordination.'),
  ('Sam Heller',       'Session Musician',      'Studio Sessions — Q1 2026',           'catalog_os', 'flat',   1200.00,  60, 'missing',   'missing',   'missing',   'missing', NULL,                 'Payment BLOCKED. No W9, no ACH, no contract on file.'),
  ('Priya Nair',       'Sync Licensing Agent',  'Brand Sync Deals 2026',               'catalog_os', 'rev_share', 0.00, 60, 'connected', 'verified',  'submitted', 'signed',  'Nair Agency LLC',    'Rev share 10% of gross sync fee. Commission invoice due per deal.'),
  ('Cole Whitman',     'Tour Production Mgr',   'NYE 2027 Tour — Production',          'catalog_os', 'flat',   8500.00,  60, 'connected', 'verified',  'submitted', 'signed',  'Whitman Productions','Full production management. Deliverable: production package approved.'),
  ('Aisha Grant',      'Graphic Designer',      'Catalog Visual Identity Refresh',     'catalog_os', 'flat',   4200.00,  60, 'pending',   'submitted', 'missing',   'signed',  NULL,                 'Designing updated visual identity assets for 2026 catalog release cycle.')
ON CONFLICT DO NOTHING;

-- Assignments
DO $$
DECLARE
  w1 uuid; w2 uuid; w3 uuid; w4 uuid; w5 uuid; w6 uuid; w7 uuid;
BEGIN
  SELECT id INTO w1 FROM project_workers WHERE name = 'Jordan Mills'     LIMIT 1;
  SELECT id INTO w2 FROM project_workers WHERE name = 'Teri Vance'       LIMIT 1;
  SELECT id INTO w3 FROM project_workers WHERE name = 'Rox Delgado'      LIMIT 1;
  SELECT id INTO w4 FROM project_workers WHERE name = 'Sam Heller'       LIMIT 1;
  SELECT id INTO w5 FROM project_workers WHERE name = 'Priya Nair'       LIMIT 1;
  SELECT id INTO w6 FROM project_workers WHERE name = 'Cole Whitman'     LIMIT 1;
  SELECT id INTO w7 FROM project_workers WHERE name = 'Aisha Grant'      LIMIT 1;

  IF w1 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, sort_order)
    VALUES
      (w1, 'Catalog Reel — Noise vs. Beauty', 'Edit 60s and 30s reel for catalog asset featuring key visuals.', 'Final exports delivered in approved formats. Manager sign-off received.', '2026-05-01', 'Paula Moore', 'approved', 1),
      (w1, 'Social Clip Pack — 10 assets', '10 short-form clips cut from catalog footage for social use.', 'All 10 clips delivered, watermark-free, in 9:16 and 1:1. Approved by team.', '2026-05-15', 'Paula Moore', 'in_progress', 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF w2 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, sort_order)
    VALUES
      (w2, 'DSP Pitch Submissions', 'Submit catalog releases to Spotify, Apple, Amazon editorial for playlist consideration.', 'Confirmation receipts from all 3 DSPs. Summary report submitted.', '2026-04-30', 'Randy Jackson', 'in_progress', 1),
      (w2, 'Streaming Campaign Report', 'Deliver post-campaign performance report with stream lift data.', 'Report delivered and reviewed. Stream data included from DSP dashboards.', '2026-06-01', 'Randy Jackson', 'open', 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF w3 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, sort_order)
    VALUES
      (w3, 'NYE 2027 Merch — Vendor Coordination', 'Coordinate all merch vendor orders, timelines, and quality checks for NYE 2027.', 'All vendor POs confirmed. Sample approval complete. Inventory confirmed pre-show.', '2026-10-01', 'Paula Moore', 'in_progress', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  IF w4 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, issues, sort_order)
    VALUES
      (w4, 'Studio Session — Q1 2026', 'Record bass and synth tracks for 3 unreleased tracks.', 'All session recordings delivered as stems. Engineer confirmation received.', '2026-03-31', 'Randy Jackson', 'submitted', 'PAYMENT BLOCKED: W9, ACH, and contract not on file. Work accepted but no payment can be issued until compliance docs are submitted.', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  IF w6 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, sort_order)
    VALUES
      (w6, 'NYE 2027 Production Package', 'Deliver full production package: staging design, rigging plan, technical rider, vendor list, and day-of schedule.', 'Production package reviewed and approved by artist and venue. All vendor contracts executed.', '2026-09-01', 'Randy Jackson', 'open', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  IF w7 IS NOT NULL THEN
    INSERT INTO project_assignments (worker_id, deliverable_title, deliverable_description, completion_definition, due_date, assigned_manager, status, sort_order)
    VALUES
      (w7, 'Visual Identity Asset Pack', 'Deliver updated logo variants, color system, and key art templates for 2026 release cycle.', 'All assets delivered in required formats. Art director approval received. Brand guide PDF delivered.', '2026-05-20', 'Paula Moore', 'in_progress', 1)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Payment Safes
DO $$
DECLARE
  w1 uuid; w2 uuid; w3 uuid; w4 uuid; w5 uuid; w6 uuid; w7 uuid;
  a1 uuid; a2 uuid; a3 uuid; a4 uuid; a5 uuid; a6 uuid; a7 uuid;
BEGIN
  SELECT id INTO w1 FROM project_workers WHERE name = 'Jordan Mills'     LIMIT 1;
  SELECT id INTO w2 FROM project_workers WHERE name = 'Teri Vance'       LIMIT 1;
  SELECT id INTO w3 FROM project_workers WHERE name = 'Rox Delgado'      LIMIT 1;
  SELECT id INTO w4 FROM project_workers WHERE name = 'Sam Heller'       LIMIT 1;
  SELECT id INTO w5 FROM project_workers WHERE name = 'Priya Nair'       LIMIT 1;
  SELECT id INTO w6 FROM project_workers WHERE name = 'Cole Whitman'     LIMIT 1;
  SELECT id INTO w7 FROM project_workers WHERE name = 'Aisha Grant'      LIMIT 1;

  SELECT id INTO a4 FROM project_assignments WHERE worker_id = w4 LIMIT 1;

  IF w1 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w1, 3500.00, 'approved', '2026-06-01', true, true, true, true, true, 'All compliance gates cleared. Approved by Paula Moore. ACH scheduled for release date.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w2 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w2, 2800.00, 'pending', '2026-07-01', true, true, false, false, false, 'Invoice not submitted. ACH not connected. Deliverables in progress. Payment pending compliance completion.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w3 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w3, 8437.50, 'held', '2026-11-01', true, true, true, true, false, 'On hold until deliverable approved. Expected release Nov 1 post-event confirmation.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w4 IS NOT NULL AND a4 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, assignment_id, amount, status, expected_release_date, delay_reason, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w4, a4, 1200.00, 'delayed', NULL, 'Contract not signed. W9 not submitted. ACH not connected. No payment can be issued until all three documents are on file.', false, false, false, false, true, 'Work completed and accepted. Payment BLOCKED pending compliance docs.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w5 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w5, 6000.00, 'held', '2026-05-15', true, true, true, true, false, 'Rev share payment pending sync deal final close and deliverable approval.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w6 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w6, 8500.00, 'held', '2026-10-01', true, true, true, true, false, 'Held until production package approved. All other compliance gates cleared.')
    ON CONFLICT DO NOTHING;
  END IF;

  IF w7 IS NOT NULL THEN
    INSERT INTO payment_safes (worker_id, amount, status, expected_release_date, compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted, compliance_ach_connected, compliance_deliverables_approved, notes)
    VALUES (w7, 4200.00, 'pending', '2026-06-20', true, true, false, false, false, 'Invoice and ACH not yet submitted. Deliverables in progress.')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
