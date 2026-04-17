/*
  # Admin AI Agent System

  1. New Tables
    - `admin_agent_assignments` - links an agent to an entity (project / artist / catalog / campaign / partner)
      - `id` (uuid, pk)
      - `agent_slug` (text, references admin_ai_agents.slug)
      - `entity_type` (text: project|artist|catalog|campaign|partner|contract|release|tour)
      - `entity_id` (text)
      - `entity_label` (text)
      - `human_owner` (text)
      - `status` (text: active|queued|blocked|completed)
      - `next_action` (text)
      - `blocker` (text, nullable)
      - `priority` (text: low|normal|high|critical)
      - `progress_pct` (int)
      - `assigned_at` / `updated_at`

    - `admin_agent_activity` - system-wide activity stream
      - `id` (uuid, pk)
      - `agent_slug` (text)
      - `event_type` (text: trigger|action|escalation|failure|approval_wait|cross_update|output)
      - `entity_type` / `entity_id` / `entity_label`
      - `summary` (text)
      - `detail` (text)
      - `severity` (text: info|warn|critical|success)
      - `occurred_at` (timestamptz)

    - `admin_agent_capabilities` - workflows + triggers + escalation rules (UI surface)
      - `id` (uuid, pk)
      - `agent_slug` (text)
      - `capability_type` (text: workflow|trigger|escalation|knowledge)
      - `label` (text)
      - `detail` (text)
      - `sort_order` (int)

  2. Security
    - RLS enabled on all tables
    - anon + authenticated SELECT for demo visibility
    - authenticated INSERT/UPDATE for operators

  3. Data
    - Seeds assignments, activity events, capabilities for the 18 existing agents
*/

CREATE TABLE IF NOT EXISTS admin_agent_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug text NOT NULL,
  entity_type text NOT NULL DEFAULT 'project',
  entity_id text NOT NULL DEFAULT '',
  entity_label text NOT NULL DEFAULT '',
  human_owner text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  next_action text NOT NULL DEFAULT '',
  blocker text,
  priority text NOT NULL DEFAULT 'normal',
  progress_pct int NOT NULL DEFAULT 0,
  assigned_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_agent_assignments_agent ON admin_agent_assignments(agent_slug);
CREATE INDEX IF NOT EXISTS idx_admin_agent_assignments_entity ON admin_agent_assignments(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_agent_assignments_status ON admin_agent_assignments(status);

ALTER TABLE admin_agent_assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_assignments' AND policyname='admin_agent_assignments_read_auth') THEN
    CREATE POLICY admin_agent_assignments_read_auth ON admin_agent_assignments FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_assignments' AND policyname='admin_agent_assignments_read_anon') THEN
    CREATE POLICY admin_agent_assignments_read_anon ON admin_agent_assignments FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_assignments' AND policyname='admin_agent_assignments_ins_auth') THEN
    CREATE POLICY admin_agent_assignments_ins_auth ON admin_agent_assignments FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_assignments' AND policyname='admin_agent_assignments_upd_auth') THEN
    CREATE POLICY admin_agent_assignments_upd_auth ON admin_agent_assignments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS admin_agent_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug text NOT NULL,
  event_type text NOT NULL DEFAULT 'action',
  entity_type text NOT NULL DEFAULT '',
  entity_id text NOT NULL DEFAULT '',
  entity_label text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  detail text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'info',
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_agent_activity_agent ON admin_agent_activity(agent_slug);
CREATE INDEX IF NOT EXISTS idx_admin_agent_activity_entity ON admin_agent_activity(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_agent_activity_time ON admin_agent_activity(occurred_at DESC);

ALTER TABLE admin_agent_activity ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_activity' AND policyname='admin_agent_activity_read_auth') THEN
    CREATE POLICY admin_agent_activity_read_auth ON admin_agent_activity FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_activity' AND policyname='admin_agent_activity_read_anon') THEN
    CREATE POLICY admin_agent_activity_read_anon ON admin_agent_activity FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_activity' AND policyname='admin_agent_activity_ins_auth') THEN
    CREATE POLICY admin_agent_activity_ins_auth ON admin_agent_activity FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS admin_agent_capabilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_slug text NOT NULL,
  capability_type text NOT NULL DEFAULT 'workflow',
  label text NOT NULL,
  detail text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_agent_capabilities_agent ON admin_agent_capabilities(agent_slug);

ALTER TABLE admin_agent_capabilities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_capabilities' AND policyname='admin_agent_capabilities_read_auth') THEN
    CREATE POLICY admin_agent_capabilities_read_auth ON admin_agent_capabilities FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='admin_agent_capabilities' AND policyname='admin_agent_capabilities_read_anon') THEN
    CREATE POLICY admin_agent_capabilities_read_anon ON admin_agent_capabilities FOR SELECT TO anon USING (true);
  END IF;
END $$;

-- Extend admin_ai_agents with category + specialties
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='category') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN category text NOT NULL DEFAULT 'core';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='specialties') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN specialties jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='human_override_owner') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN human_override_owner text NOT NULL DEFAULT 'Paula Moore';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='escalation_level') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN escalation_level text NOT NULL DEFAULT 'normal';
  END IF;
END $$;

-- Populate category, specialties, override owner
UPDATE admin_ai_agents SET category='core', specialties='["payouts","reconciliation","ledger"]'::jsonb WHERE slug='ledger';
UPDATE admin_ai_agents SET category='core', specialties='["safes","reserves","capital-allocation"]'::jsonb WHERE slug='vault';
UPDATE admin_ai_agents SET category='core', specialties='["insurance","risk-monitoring","coverage"]'::jsonb WHERE slug='shield';
UPDATE admin_ai_agents SET category='core', specialties='["partners","deal-tracking","inquiry-routing"]'::jsonb WHERE slug='beacon';
UPDATE admin_ai_agents SET category='core', specialties='["releases","stage-readiness","drops"]'::jsonb WHERE slug='stage';
UPDATE admin_ai_agents SET category='core', specialties='["signals","alerting","cross-system"]'::jsonb WHERE slug='signalops';
UPDATE admin_ai_agents SET category='core', specialties='["culture-map","brand-health"]'::jsonb WHERE slug='crest';
UPDATE admin_ai_agents SET category='core', specialties='["compliance","policy","safes"]'::jsonb WHERE slug='anchor';
UPDATE admin_ai_agents SET category='executive', human_override_owner='Paula Moore', specialties='["calendar","inbox-triage","scheduling"]'::jsonb WHERE slug='paula-exec';
UPDATE admin_ai_agents SET category='executive', human_override_owner='Jacquelyn', specialties='["exec-comms","travel","briefings"]'::jsonb WHERE slug='jacquelyn-exec';
UPDATE admin_ai_agents SET category='legal', human_override_owner='Business Affairs', specialties='["contracts","clauses","risk-review"]'::jsonb WHERE slug='counsel';
UPDATE admin_ai_agents SET category='legal', human_override_owner='Business Affairs', specialties='["pandadoc","loop-management","signatures"]'::jsonb WHERE slug='contract-loop';
UPDATE admin_ai_agents SET category='growth', human_override_owner='Marketing Lead', specialties='["campaigns","budget","creative-rollout"]'::jsonb WHERE slug='industry-marketing';
UPDATE admin_ai_agents SET category='operations', human_override_owner='Touring Lead', specialties='["tour-routing","advance","settlement"]'::jsonb WHERE slug='tour-manager';
UPDATE admin_ai_agents SET category='operations', human_override_owner='Store Lead', specialties='["inventory","fulfillment","merch-ops"]'::jsonb WHERE slug='store-manager';
UPDATE admin_ai_agents SET category='operations', human_override_owner='Campus Lead', specialties='["memberships","campus-programs","billing"]'::jsonb WHERE slug='campus-manager';
UPDATE admin_ai_agents SET category='account', human_override_owner='Artist Success', specialties='["artist-requests","rep-routing","status"]'::jsonb WHERE slug='artist-account';
UPDATE admin_ai_agents SET category='account', human_override_owner='Label Success', specialties='["label-ops","catalog-coordination","revenue"]'::jsonb WHERE slug='label-account';

-- Seed capabilities for all 18 agents
INSERT INTO admin_agent_capabilities (agent_slug, capability_type, label, detail, sort_order)
VALUES
  ('ledger','workflow','Daily Payout Reconciliation','Matches Stripe + bank clears against open invoices',1),
  ('ledger','trigger','Invoice > 7 days unpaid','Opens escalation to finance operator',2),
  ('ledger','escalation','Mismatch > $500','Pauses payout + notifies Anchor + Vault',3),
  ('ledger','knowledge','Chart of Accounts','GL codes, tax mapping, entity routing',4),
  ('vault','workflow','Reserve Rebalancing','Maintains 90-day runway across entities',1),
  ('vault','trigger','Runway < 60 days','Flags for capital review',2),
  ('vault','escalation','Reserve breach','Routes to Paula + Counsel',3),
  ('shield','workflow','Coverage Audit','Scans policies for renewal windows',1),
  ('shield','trigger','Policy expires < 30d','Creates renewal task',2),
  ('shield','escalation','Coverage gap detected','Halts live event activation',3),
  ('beacon','workflow','Partner Deal Tracking','Monitors 4 institutional pipelines',1),
  ('beacon','trigger','New partner inquiry','Routes to owner within 12h',2),
  ('beacon','escalation','Stalled > 10d','Notifies Paula + partners board',3),
  ('stage','workflow','Release Readiness Audit','Pre-drop checklist across all releases',1),
  ('stage','trigger','Release D-14','Opens campaign wizard',2),
  ('stage','escalation','Missing assets D-7','Escalates to artist rep',3),
  ('signalops','workflow','Cross-System Signal Merge','Unifies signals from Rocksteady + Catalog + Artist OS',1),
  ('signalops','trigger','High-severity signal','Posts to Command Center feed',2),
  ('crest','workflow','Culture Heatmap Refresh','Tracks cultural momentum per artist',1),
  ('anchor','workflow','Safe Compliance Check','Verifies project safe requirements',1),
  ('anchor','trigger','Missing W9/ACH','Blocks payment initiation',2),
  ('paula-exec','workflow','Inbox Triage','Classifies exec inbox + drafts replies',1),
  ('paula-exec','trigger','Critical email flagged','Interrupts Paula calendar',2),
  ('jacquelyn-exec','workflow','Travel + Brief Prep','Assembles briefings 48h ahead',1),
  ('counsel','workflow','Contract Red-Line Review','Flags non-standard clauses',1),
  ('counsel','escalation','New LOI','Routes to business affairs',2),
  ('contract-loop','workflow','PandaDoc Loop Close','Drives contracts to signature',1),
  ('contract-loop','trigger','Signer idle > 5d','Sends nudge + escalates',2),
  ('industry-marketing','workflow','Campaign Execution','Runs paid + organic playbooks',1),
  ('industry-marketing','trigger','Budget utilization > 80%','Requests human approval',2),
  ('tour-manager','workflow','Tour Advance Pipeline','Advances each date 30d out',1),
  ('store-manager','workflow','Inventory Depletion','Triggers restock orders',1),
  ('campus-manager','workflow','Membership Renewal','Drives retention sequences',1),
  ('artist-account','workflow','Artist Request Routing','Classifies + routes artist requests',1),
  ('label-account','workflow','Label Coordination','Syncs label priorities weekly',1)
ON CONFLICT DO NOTHING;

-- Seed assignments across entities
INSERT INTO admin_agent_assignments (agent_slug, entity_type, entity_id, entity_label, human_owner, status, next_action, blocker, priority, progress_pct)
VALUES
  ('ledger','project','gmg-launch','GMG Platform Launch Q2 2026','Paula Moore','active','Reconcile Q2 vendor batch',NULL,'high',72),
  ('ledger','artist','read-the-pdf','Read the PDF','Artist Success','active','Process Apr royalty statement',NULL,'normal',48),
  ('ledger','catalog','bassnectar','Bassnectar Catalog','Label Success','blocked','Awaiting DSP statement','DSP delay','normal',30),
  ('vault','project','gmg-launch','GMG Platform Launch Q2 2026','Paula Moore','active','Rebalance operating reserve',NULL,'critical',60),
  ('vault','artist','ghost-in-the-static','Ghost in the Static','Artist Success','queued','Open tour float',NULL,'normal',0),
  ('shield','project','tour-spring','Spring Tour 2026','Touring Lead','active','Verify venue coverage Dallas',NULL,'high',55),
  ('shield','artist','read-the-pdf','Read the PDF','Artist Success','blocked','Missing liability rider','Awaiting artist sig','high',20),
  ('beacon','partner','banc-of-california','Banc of California','Paula Moore','active','Schedule structuring call',NULL,'critical',80),
  ('beacon','partner','gallagher','Gallagher','Paula Moore','active','Return signed NDA',NULL,'high',65),
  ('beacon','partner','fractional','Fractional Collective','Paula Moore','queued','Intro pack',NULL,'normal',10),
  ('stage','artist','read-the-pdf','Read the PDF','Artist Success','active','Open D-30 campaign',NULL,'high',58),
  ('stage','release','midnight-drive','Midnight Drive','Artist Success','active','Approve cover master',NULL,'normal',42),
  ('signalops','project','gmg-launch','GMG Platform Launch Q2 2026','Paula Moore','active','Merge Rocksteady + Catalog pulse',NULL,'high',70),
  ('crest','artist','read-the-pdf','Read the PDF','Artist Success','active','Refresh culture heatmap',NULL,'normal',90),
  ('anchor','project','gmg-launch','GMG Platform Launch Q2 2026','Paula Moore','active','Verify 4 open safes',NULL,'high',88),
  ('paula-exec','artist','paula-inbox','Paula Exec Inbox','Paula Moore','active','Draft 3 partner replies',NULL,'critical',75),
  ('jacquelyn-exec','project','miami-trip','Miami Exec Trip','Paula Moore','active','Assemble Thursday briefing',NULL,'high',60),
  ('counsel','contract','banc-mou','Banc of California MOU','Business Affairs','active','Red-line termination clause',NULL,'critical',45),
  ('counsel','contract','gallagher-loi','Gallagher LOI','Business Affairs','queued','First pass review',NULL,'high',0),
  ('contract-loop','contract','artist-nda-batch','Artist NDA Batch (8 signers)','Business Affairs','active','Nudge idle signers',NULL,'normal',62),
  ('contract-loop','contract','vendor-msa-creative','Creative MSA Loop','Business Affairs','blocked','Counterparty delay','External','normal',35),
  ('industry-marketing','campaign','read-the-pdf-d30','RTP D-30 Campaign','Marketing Lead','active','Deploy Reels cohort',NULL,'high',55),
  ('industry-marketing','campaign','catalog-bassnectar-reactivation','Bassnectar Reactivation','Label Success','active','Budget >80% — approval',NULL,'critical',82),
  ('tour-manager','project','tour-spring','Spring Tour 2026','Touring Lead','active','Advance Dallas date',NULL,'high',48),
  ('store-manager','project','store-merch-q2','Q2 Store Ops','Store Lead','active','Restock Arctic Fox tees',NULL,'normal',65),
  ('campus-manager','project','campus-spring','Campus Spring Wave','Campus Lead','active','Renew 42 memberships',NULL,'normal',58),
  ('artist-account','artist','read-the-pdf','Read the PDF','Artist Success','active','Route 3 open requests',NULL,'high',75),
  ('label-account','catalog','bassnectar','Bassnectar','Label Success','active','Weekly priorities sync',NULL,'normal',70)
ON CONFLICT DO NOTHING;

-- Seed recent activity events (36 events across agents)
INSERT INTO admin_agent_activity (agent_slug, event_type, entity_type, entity_id, entity_label, summary, detail, severity, occurred_at)
VALUES
  ('ledger','action','project','gmg-launch','GMG Platform Launch','Reconciled 14 vendor invoices','$48,220 cleared to ACH batch 2026-04-15','success', now() - interval '22 minutes'),
  ('ledger','escalation','catalog','bassnectar','Bassnectar','Flagged DSP statement gap','Q1 statement missing for 2 DSPs','warn', now() - interval '1 hour 10 minutes'),
  ('vault','action','project','gmg-launch','GMG Platform Launch','Rebalanced operating reserve','Moved $120k to Q2 runway buffer','success', now() - interval '35 minutes'),
  ('vault','trigger','artist','ghost-in-the-static','Ghost in the Static','Runway < 60d alert','Queued new float recommendation','warn', now() - interval '2 hours'),
  ('shield','escalation','artist','read-the-pdf','Read the PDF','Coverage gap detected','Liability rider missing for May live dates','critical', now() - interval '48 minutes'),
  ('shield','action','project','tour-spring','Spring Tour','Verified 3 venue policies','Dallas + Austin + Phoenix cleared','success', now() - interval '3 hours'),
  ('beacon','action','partner','banc-of-california','Banc of California','Deal advanced to Stage 4','Structuring call scheduled for 04-22','success', now() - interval '15 minutes'),
  ('beacon','trigger','partner','gallagher','Gallagher','NDA countersignature pending','Reminder sent to Gallagher legal','info', now() - interval '1 hour 40 minutes'),
  ('stage','action','release','midnight-drive','Midnight Drive','Master approved','Cover + audio passed QA','success', now() - interval '55 minutes'),
  ('stage','trigger','artist','read-the-pdf','Read the PDF','D-30 window opened','Campaign wizard ready','info', now() - interval '4 hours'),
  ('signalops','output','project','gmg-launch','GMG Platform Launch','Merged cross-system pulse','42 signals merged across 3 OS','success', now() - interval '18 minutes'),
  ('signalops','cross_update','catalog','bassnectar','Bassnectar','Cultural momentum +14%','Reactivation campaign compounding','info', now() - interval '2 hours 25 minutes'),
  ('crest','output','artist','read-the-pdf','Read the PDF','Culture heatmap refreshed','NYC + ATL + LA hot zones','success', now() - interval '1 hour'),
  ('anchor','escalation','project','gmg-launch','GMG Platform Launch','Safe compliance warning','1 worker missing W9 on safe #3','warn', now() - interval '30 minutes'),
  ('anchor','action','project','gmg-launch','GMG Platform Launch','Cleared 3 safes for payment','Safes 1, 2, 5 approved','success', now() - interval '2 hours 50 minutes'),
  ('paula-exec','output','artist','paula-inbox','Paula Inbox','Drafted 3 partner replies','Banc + Gallagher + Institutional','success', now() - interval '12 minutes'),
  ('paula-exec','escalation','artist','paula-inbox','Paula Inbox','Critical inbox flag','Legal counsel needs decision today','critical', now() - interval '45 minutes'),
  ('jacquelyn-exec','action','project','miami-trip','Miami Exec Trip','Briefing assembled','48h pack ready for review','success', now() - interval '1 hour 15 minutes'),
  ('counsel','escalation','contract','banc-mou','Banc MOU','Non-standard clause flagged','Termination clause needs review','critical', now() - interval '28 minutes'),
  ('counsel','output','contract','gallagher-loi','Gallagher LOI','First-pass review complete','4 edits suggested','success', now() - interval '3 hours 30 minutes'),
  ('contract-loop','trigger','contract','artist-nda-batch','Artist NDA Batch','2 signers idle > 5d','Nudges dispatched','warn', now() - interval '1 hour'),
  ('contract-loop','failure','contract','vendor-msa-creative','Creative MSA','External counterparty delay','Flagged for manual follow up','warn', now() - interval '4 hours'),
  ('industry-marketing','approval_wait','campaign','catalog-bassnectar-reactivation','Bassnectar Reactivation','Budget > 80% - awaiting human','Paula approval requested','critical', now() - interval '20 minutes'),
  ('industry-marketing','action','campaign','read-the-pdf-d30','RTP D-30','Deployed Reels cohort','12 creatives live across 4 audiences','success', now() - interval '1 hour 30 minutes'),
  ('tour-manager','action','project','tour-spring','Spring Tour','Advanced Dallas date','Crew, hospitality, travel locked','success', now() - interval '2 hours'),
  ('store-manager','action','project','store-merch-q2','Q2 Store','Restock order placed','Arctic Fox tees reorder 240 units','success', now() - interval '1 hour 48 minutes'),
  ('campus-manager','output','project','campus-spring','Campus Spring','Renewal wave sent','42 members in retention sequence','success', now() - interval '3 hours'),
  ('artist-account','action','artist','read-the-pdf','Read the PDF','Routed 3 open requests','Assigned to marketing + legal + finance','success', now() - interval '35 minutes'),
  ('label-account','output','catalog','bassnectar','Bassnectar','Weekly priorities synced','6 priorities delivered to label lead','success', now() - interval '5 hours'),
  ('ledger','trigger','project','gmg-launch','GMG Platform Launch','Invoice > 7d unpaid','2 vendor invoices flagged','warn', now() - interval '6 hours'),
  ('shield','action','project','tour-spring','Spring Tour','Policy refresh requested','Gallagher broker notified','info', now() - interval '7 hours'),
  ('beacon','output','partner','future-institutional','Future Institutional','Pipeline status compiled','Intro deck + fit analysis','info', now() - interval '8 hours'),
  ('stage','escalation','release','midnight-drive','Midnight Drive','Missing Canva assets','Asset drop due by EOD','warn', now() - interval '9 hours'),
  ('paula-exec','action','artist','paula-inbox','Paula Inbox','Calendar rebalanced','Moved 3 internal syncs','success', now() - interval '10 hours'),
  ('counsel','action','contract','banc-mou','Banc MOU','Red-line draft ready','Draft v3 ready for Paula','success', now() - interval '12 hours'),
  ('vault','output','project','gmg-launch','GMG Platform Launch','Runway report published','Q2 runway at 94 days','success', now() - interval '14 hours')
ON CONFLICT DO NOTHING;
