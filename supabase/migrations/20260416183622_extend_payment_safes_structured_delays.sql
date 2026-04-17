/*
  # Extend Payment Safes with Structured Delay Metadata + Release Type

  1. Schema Changes
    - `payment_safes`: add `delay_title`, `delay_category`, `delay_description`,
      `delay_requires_worker_action`, `release_type`, `stage` columns
    - These let Project Safe Admin store structured delay context that can be
      surfaced on the worker-facing Project OS view later
  2. Seed Data
    - Add a second delayed worker (Marcus Eller, Producer) so admin view has
      at least 2 delay cases with distinct categories
    - Update existing "Sam Heller" delay with new structured fields
    - Update existing workers to have explicit stages
  3. Security
    - No RLS changes — existing policies cover new columns
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='delay_title') THEN
    ALTER TABLE payment_safes ADD COLUMN delay_title text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='delay_category') THEN
    ALTER TABLE payment_safes ADD COLUMN delay_category text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='delay_description') THEN
    ALTER TABLE payment_safes ADD COLUMN delay_description text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='delay_requires_worker_action') THEN
    ALTER TABLE payment_safes ADD COLUMN delay_requires_worker_action boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='release_type') THEN
    ALTER TABLE payment_safes ADD COLUMN release_type text DEFAULT 'partial';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='payment_safes' AND column_name='stage') THEN
    ALTER TABLE payment_safes ADD COLUMN stage text DEFAULT 'agreement_active';
  END IF;
END $$;

UPDATE payment_safes
SET delay_title = 'Missing contract, W9, and ACH setup',
    delay_category = 'missing_contract',
    delay_description = 'Worker has not completed onboarding. Contract, W9, and ACH banking info all outstanding. Payment cannot release until all three documents are on file with finance.',
    delay_requires_worker_action = true,
    stage = 'delayed'
WHERE status = 'delayed' AND (delay_title = '' OR delay_title IS NULL);

UPDATE payment_safes SET stage = CASE status
  WHEN 'held' THEN 'under_review'
  WHEN 'pending' THEN 'processing'
  WHEN 'approved' THEN 'get_paid'
  WHEN 'delayed' THEN 'delayed'
  WHEN 'paid' THEN 'paid'
  ELSE 'agreement_active'
END
WHERE stage = 'agreement_active' OR stage IS NULL;

DO $$
DECLARE
  marcus_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM project_workers WHERE email='marcus.eller@gmg.test') THEN
    INSERT INTO project_workers (
      name, role, project, system, fee_type, rate, rate_currency, payment_terms_days,
      ach_status, w9_status, invoice_status, agreement_status,
      email, entity_name, is_active
    ) VALUES (
      'Marcus Eller', 'Producer', 'Catalog Reactivation — SPIN', 'catalog_os',
      'flat', 7500, 'USD', 30,
      'connected', 'verified', 'submitted', 'signed',
      'marcus.eller@gmg.test', 'Eller Audio LLC', true
    ) RETURNING id INTO marcus_id;

    INSERT INTO payment_safes (
      worker_id, amount, currency, status,
      compliance_contract_signed, compliance_w9_submitted, compliance_invoice_submitted,
      compliance_ach_connected, compliance_deliverables_approved,
      delay_title, delay_category, delay_description, delay_requires_worker_action,
      release_type, stage, notes
    ) VALUES (
      marcus_id, 7500, 'USD', 'delayed',
      true, true, true, true, true,
      'Upstream settlement pending from label partner',
      'upstream_cash_timing',
      'Full deliverables approved and all compliance complete. Payment waiting on upstream label settlement expected Friday. No worker action required — finance is tracking.',
      false,
      'final', 'delayed', 'Eller is fully cleared internally; pending partner wire.'
    );

    INSERT INTO project_assignments (worker_id, deliverable_title, status, sort_order)
    VALUES
      (marcus_id, 'Mix and master 6 catalog priority tracks', 'approved', 1),
      (marcus_id, 'Deliver stems to licensing', 'approved', 2);

    INSERT INTO payment_delay_log (payment_safe_id, worker_id, reason)
    SELECT ps.id, marcus_id, 'Upstream settlement pending from label partner'
    FROM payment_safes ps WHERE ps.worker_id = marcus_id;
  END IF;
END $$;
