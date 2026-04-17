/*
  # Extend AI Agent Roster with Full GMG Workforce

  1. Schema Changes
    - Add `functional_category` text column to `admin_ai_agents` for functional
      grouping independent of system (Discovery, Marketing, Audience, Finance,
      Contracts, Catalog Ops, Artist Ops, Executive Support, Comms, Touring,
      Risk).
    - Add `short_desc` text column for one-line card description.
    - Add `requires_human_approval` boolean on assignments for Agent Assignments
      page "Awaiting Human" filter.
    - Add `escalated` boolean on assignments for Escalated filter.
    - Add `requires_human_followup` boolean on activity.
  2. Seeded Data
    - Normalize existing agents' `system` field to rocksteady / artist_os /
      catalog_os / industry_os / admin_os.
    - Insert 16 new agents: Atlas, Echo, Current, Vector (Artist OS);
      Index, Relay, Amplify, Yield, Archive, SignalFlow (Catalog OS);
      Atlas/Crest/Echo/Current/Ledger/Vector Coworkers (Industry OS).
    - Add 30+ assignments across entities, mix of statuses.
    - Add 30+ activity events with mix of severities.
  3. Security
    - RLS policies remain unchanged; added columns inherit existing policies.
*/

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='functional_category') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN functional_category text DEFAULT 'operations';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_ai_agents' AND column_name='short_desc') THEN
    ALTER TABLE admin_ai_agents ADD COLUMN short_desc text DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_agent_assignments' AND column_name='requires_human_approval') THEN
    ALTER TABLE admin_agent_assignments ADD COLUMN requires_human_approval boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_agent_assignments' AND column_name='escalated') THEN
    ALTER TABLE admin_agent_assignments ADD COLUMN escalated boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_agent_activity' AND column_name='requires_human_followup') THEN
    ALTER TABLE admin_agent_activity ADD COLUMN requires_human_followup boolean DEFAULT false;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='admin_agent_activity' AND column_name='assignment_type') THEN
    ALTER TABLE admin_agent_assignments ADD COLUMN assignment_type text DEFAULT 'operations';
  END IF;
END $$;

UPDATE admin_ai_agents SET system = 'rocksteady',
  functional_category = 'discovery_signals',
  short_desc = 'Scans partner pipeline + cultural signal surface for early movement.'
WHERE slug IN ('beacon');
UPDATE admin_ai_agents SET system = 'rocksteady', functional_category = 'discovery_signals',
  short_desc = 'Signal aggregation engine — the nervous system behind Rocksteady.'
WHERE slug = 'signalops';
UPDATE admin_ai_agents SET system = 'rocksteady', functional_category = 'discovery_signals',
  short_desc = 'Release readiness + rollout orchestration.'
WHERE slug = 'stage';
UPDATE admin_ai_agents SET system = 'rocksteady', functional_category = 'audience_growth',
  short_desc = 'Culture map + brand health surveillance.'
WHERE slug = 'crest';
UPDATE admin_ai_agents SET system = 'rocksteady', functional_category = 'risk_protection',
  short_desc = 'Compliance anchor across payment safes + project readiness.'
WHERE slug = 'anchor';

UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'finance_accounting',
  short_desc = 'Finance ledger, payouts, invoices — keeps the books clean.'
WHERE slug = 'ledger';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'finance_accounting',
  short_desc = 'Safe layer — project escrow + capital allocation.'
WHERE slug = 'vault';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'risk_protection',
  short_desc = 'Insurance + coverage events; policy grid watcher.'
WHERE slug = 'shield';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'executive_support',
  short_desc = 'Executive inbox routing + decision packet assembly for Paula.'
WHERE slug = 'paula-exec';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'executive_support',
  short_desc = 'Meeting prep + briefing synthesis support layer.'
WHERE slug = 'jacquelyn-exec';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'contracts_legal',
  short_desc = 'Contract reviewer — flags non-standard clauses + obligations.'
WHERE slug = 'counsel';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'contracts_legal',
  short_desc = 'PandaDoc loop manager — advances signature states autonomously.'
WHERE slug = 'contract-loop';
UPDATE admin_ai_agents SET system = 'industry_os', functional_category = 'marketing_campaigns',
  short_desc = 'Industry marketing rep — campaign exec + budget tuning.'
WHERE slug = 'industry-marketing';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'touring_store_campus',
  short_desc = 'Tour ops — advances, travel, show-level logistics.'
WHERE slug = 'tour-manager';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'touring_store_campus',
  short_desc = 'Merch + fulfillment + inventory balance across stores.'
WHERE slug = 'store-manager';
UPDATE admin_ai_agents SET system = 'admin_os', functional_category = 'touring_store_campus',
  short_desc = 'Campus memberships + billing + event programming.'
WHERE slug = 'campus-manager';
UPDATE admin_ai_agents SET system = 'artist_os', functional_category = 'artist_operations',
  short_desc = 'Owns artist-by-artist account state + escalation routing.'
WHERE slug = 'artist-account';
UPDATE admin_ai_agents SET system = 'artist_os', functional_category = 'artist_operations',
  short_desc = 'Label-level catalog + artist portfolio operator.'
WHERE slug = 'label-account';

-- Insert new agents
INSERT INTO admin_ai_agents (slug, name, role, mission, status, system, category, specialties, human_override_owner, escalation_level, current_assignments, recent_actions, blockers, escalations, last_action_at, color, sort_order, functional_category, short_desc) VALUES
  ('atlas', 'Atlas', 'Artist OS Campaign Lead', 'Owns campaign strategy, spend routing, and audience expansion for Artist OS clients.', 'active', 'artist_os', 'growth', '["Campaign Strategy","Budget Tuning","Audience Expansion"]'::jsonb, 'Paula Moore', 'standard', 6, 38, 0, 2, now() - interval '14 minutes', '#EC4899', 101, 'marketing_campaigns', 'Lead AI rep behind every Artist OS campaign rollout.'),
  ('echo', 'Echo', 'Fan Intelligence Rep', 'Tracks fan conversion, cluster behavior, and audience pull-through.', 'active', 'artist_os', 'growth', '["Fan Clustering","Conversion","Retention"]'::jsonb, 'Jacquelyn R.', 'standard', 5, 52, 1, 0, now() - interval '8 minutes', '#06B6D4', 102, 'audience_growth', 'Audience scientist; translates signal into fan-ready campaigns.'),
  ('current', 'Current', 'Release Momentum Rep', 'Monitors momentum velocity, trend traction, and release pacing.', 'active', 'artist_os', 'growth', '["Momentum","Trend","Velocity"]'::jsonb, 'Randy Jackson', 'standard', 4, 29, 0, 1, now() - interval '22 minutes', '#10B981', 103, 'discovery_signals', 'Pulse-check agent for every active release in Artist OS.'),
  ('vector', 'Vector', 'Creative Direction Rep', 'Pairs creative direction recommendations with audience intelligence.', 'idle', 'artist_os', 'growth', '["Creative","A/B Test","Brief Routing"]'::jsonb, 'Paula Moore', 'standard', 2, 12, 0, 0, now() - interval '1 hour', '#F59E0B', 104, 'marketing_campaigns', 'Creative vector — direction briefs + creative test rollouts.'),

  ('index', 'Index', 'Catalog Metadata Operator', 'Watches metadata health, artwork, credits, rights, ISRC cleanliness.', 'active', 'catalog_os', 'operations', '["Metadata","ISRC","Rights"]'::jsonb, 'Paula Moore', 'standard', 5, 44, 2, 1, now() - interval '5 minutes', '#10B981', 105, 'catalog_operations', 'Quality bar for every catalog asset that lives inside Catalog OS.'),
  ('relay', 'Relay', 'Catalog Partner Operator', 'Routes catalog-level partner asks to correct workflow and human owner.', 'active', 'catalog_os', 'operations', '["Partner Ops","Routing","Handoff"]'::jsonb, 'Jacquelyn R.', 'standard', 4, 31, 0, 2, now() - interval '3 minutes', '#06B6D4', 106, 'catalog_operations', 'The catalog switchboard — routes partner requests to the right human.'),
  ('amplify', 'Amplify', 'Catalog Growth Operator', 'Identifies growth plays, re-release moments, sync placements.', 'active', 'catalog_os', 'growth', '["Sync","Re-release","Growth"]'::jsonb, 'Randy Jackson', 'standard', 6, 41, 1, 0, now() - interval '30 minutes', '#EC4899', 107, 'marketing_campaigns', 'Catalog-side growth operator; surfaces re-release + sync moments.'),
  ('yield', 'Yield', 'Catalog Revenue Operator', 'Optimizes payout timing, revenue routing, and platform payout reconciliation.', 'active', 'catalog_os', 'operations', '["Payouts","Revenue","Reconciliation"]'::jsonb, 'Paula Moore', 'tier2', 4, 27, 0, 1, now() - interval '11 minutes', '#F59E0B', 108, 'finance_accounting', 'Yield optimizer for catalog-side revenue.'),
  ('archive', 'Archive', 'Catalog Memory Operator', 'Preserves catalog history, versioning, and lineage.', 'idle', 'catalog_os', 'operations', '["History","Versioning","Lineage"]'::jsonb, 'Jacquelyn R.', 'standard', 2, 8, 0, 0, now() - interval '2 hours', '#64748B', 109, 'catalog_operations', 'Long-term memory — every asset version, rights move, and contract swap.'),
  ('signalflow', 'SignalFlow', 'Catalog Signal Operator', 'Detects anomalies, catalog-level demand spikes, and dormant asset breakouts.', 'active', 'catalog_os', 'growth', '["Anomaly","Demand Spike","Breakouts"]'::jsonb, 'Randy Jackson', 'standard', 5, 58, 0, 3, now() - interval '2 minutes', '#06B6D4', 110, 'discovery_signals', 'Realtime catalog anomaly + breakout detector.'),

  ('atlas-coworker', 'Atlas Coworker', 'Industry OS Campaign Rep', 'Industry OS peer of Atlas — supports industry members on campaign craft.', 'active', 'industry_os', 'growth', '["Campaign","Peer","Industry"]'::jsonb, 'Paula Moore', 'standard', 3, 22, 0, 0, now() - interval '18 minutes', '#EC4899', 111, 'marketing_campaigns', 'Industry-side coworker mirroring Artist OS Atlas.'),
  ('crest-coworker', 'Crest Coworker', 'Industry OS Brand Rep', 'Supports industry members on brand health + cultural positioning.', 'active', 'industry_os', 'growth', '["Brand","Culture","Positioning"]'::jsonb, 'Jacquelyn R.', 'standard', 2, 15, 0, 0, now() - interval '44 minutes', '#F59E0B', 112, 'audience_growth', 'Industry brand coworker — peer to Crest.'),
  ('echo-coworker', 'Echo Coworker', 'Industry OS Audience Rep', 'Fan + audience intelligence coworker for industry members.', 'idle', 'industry_os', 'growth', '["Audience","Clusters","Retention"]'::jsonb, 'Paula Moore', 'standard', 2, 9, 0, 0, now() - interval '3 hours', '#06B6D4', 113, 'audience_growth', 'Industry-side audience coworker.'),
  ('current-coworker', 'Current Coworker', 'Industry OS Release Rep', 'Release momentum coworker for industry members.', 'active', 'industry_os', 'growth', '["Release","Momentum","Velocity"]'::jsonb, 'Randy Jackson', 'standard', 3, 18, 0, 0, now() - interval '37 minutes', '#10B981', 114, 'discovery_signals', 'Industry peer of Current; tracks member release traction.'),
  ('ledger-coworker', 'Ledger Coworker', 'Industry OS Finance Rep', 'Industry member finance coworker — payouts, safes, reimbursements.', 'active', 'industry_os', 'core', '["Payouts","Safes","Reimburse"]'::jsonb, 'Paula Moore', 'tier2', 3, 21, 1, 1, now() - interval '12 minutes', '#F59E0B', 115, 'finance_accounting', 'Industry finance coworker — mirrors Admin Ledger.'),
  ('vector-coworker', 'Vector Coworker', 'Industry OS Creative Rep', 'Creative direction coworker for industry members.', 'idle', 'industry_os', 'growth', '["Creative","Brief","Test"]'::jsonb, 'Jacquelyn R.', 'standard', 1, 7, 0, 0, now() - interval '5 hours', '#EC4899', 116, 'marketing_campaigns', 'Creative direction peer for Industry members.')
ON CONFLICT (slug) DO NOTHING;

-- Seed assignments
INSERT INTO admin_agent_assignments (agent_slug, entity_type, entity_id, entity_label, human_owner, status, next_action, blocker, priority, progress_pct, updated_at, requires_human_approval, escalated, assignment_type) VALUES
  ('atlas', 'campaign', 'cmp-af-tour', 'Arctic Fox Tour Collection Rollout', 'Paula Moore', 'active', 'Rebalance TikTok vs YouTube spend for week-over-week momentum', NULL, 'high', 62, now() - interval '12 minutes', true, false, 'campaign optimization'),
  ('atlas', 'artist', 'art-trouble-andrew', 'Trouble Andrew — Single Launch', 'Jacquelyn R.', 'active', 'Expand midwest geotarget layer based on fan cluster lift', NULL, 'normal', 45, now() - interval '40 minutes', false, false, 'campaign optimization'),
  ('atlas', 'campaign', 'cmp-spin-streaming', 'SPIN Streaming Push — Spring', 'Randy Jackson', 'queued', 'Confirm creative asset delivery before Tuesday flight', NULL, 'normal', 10, now() - interval '2 hours', false, false, 'campaign optimization'),
  ('echo', 'artist', 'art-trouble-andrew', 'Trouble Andrew — Fan Cluster Sweep', 'Jacquelyn R.', 'active', 'Promote 2 new high-propensity clusters into campaign targeting', NULL, 'normal', 72, now() - interval '18 minutes', false, false, 'audience signal detection'),
  ('echo', 'artist', 'art-arctic-fox', 'Arctic Fox Retention Audit', 'Paula Moore', 'blocked', 'Awaiting cleaner streaming export to re-run cluster model', 'Streaming data export stale', 'high', 30, now() - interval '1 hour', false, true, 'audience signal detection'),
  ('current', 'release', 'rel-af-eponymous', 'Arctic Fox — Self-titled Re-issue', 'Randy Jackson', 'active', 'Track 48h velocity; alert if below 60% benchmark', NULL, 'normal', 55, now() - interval '30 minutes', false, false, 'artist rollout oversight'),
  ('current', 'release', 'rel-ta-glass', 'Trouble Andrew — Glass Palace', 'Paula Moore', 'active', 'Promote single into playlist rotation discussion', NULL, 'high', 68, now() - interval '22 minutes', true, false, 'artist rollout oversight'),
  ('vector', 'project', 'proj-af-merch', 'Arctic Fox Merch Drop Creative', 'Paula Moore', 'queued', 'Brief draft awaiting creative review', NULL, 'normal', 20, now() - interval '3 hours', true, false, 'campaign optimization'),
  ('index', 'catalog', 'cat-spin', 'SPIN Catalog Metadata Sweep', 'Paula Moore', 'active', 'Resolve 14 missing ISRCs across back catalog', NULL, 'high', 60, now() - interval '9 minutes', false, false, 'catalog metadata cleanup'),
  ('index', 'catalog', 'cat-bassnectar', 'Bassnectar Rights Map Update', 'Jacquelyn R.', 'blocked', 'Awaiting missing rights doc from legal team', 'Rights doc missing', 'critical', 25, now() - interval '1 hour', false, true, 'catalog metadata cleanup'),
  ('relay', 'partner', 'par-banc', 'Banc of California — onboarding ask', 'Paula Moore', 'active', 'Route financial readiness packet to Paula for sign-off', NULL, 'high', 75, now() - interval '10 minutes', true, false, 'partner pipeline support'),
  ('relay', 'partner', 'par-gallagher', 'Gallagher — policy review thread', 'Randy Jackson', 'active', 'Push thread into Risk + Protection module for final intake', NULL, 'normal', 40, now() - interval '50 minutes', false, false, 'partner pipeline support'),
  ('amplify', 'catalog', 'cat-spin', 'SPIN — Sync Placement Scan', 'Randy Jackson', 'active', 'Pitch 3 tracks to sync agent inbox', NULL, 'normal', 55, now() - interval '2 hours', false, false, 'catalog metadata cleanup'),
  ('amplify', 'catalog', 'cat-bassnectar', 'Bassnectar — Re-release window map', 'Paula Moore', 'queued', 'Draft Q3 re-release pitch deck for exec review', NULL, 'normal', 15, now() - interval '5 hours', true, false, 'catalog metadata cleanup'),
  ('yield', 'catalog', 'cat-spin', 'SPIN — Payout Reconciliation', 'Paula Moore', 'active', 'Match 3 platform payouts to ledger entries', NULL, 'high', 80, now() - interval '12 minutes', false, false, 'worker payment monitoring'),
  ('yield', 'catalog', 'cat-bassnectar', 'Bassnectar — Royalty Router', 'Jacquelyn R.', 'blocked', 'Waiting on upstream DSP settlement data', 'Upstream DSP feed down', 'high', 35, now() - interval '40 minutes', false, true, 'worker payment monitoring'),
  ('signalflow', 'catalog', 'cat-spin', 'SPIN — Anomaly Watch', 'Randy Jackson', 'active', 'Investigate 3 anomalous streaming spikes — bot check pending', NULL, 'critical', 50, now() - interval '6 minutes', true, true, 'audience signal detection'),
  ('signalflow', 'catalog', 'cat-bassnectar', 'Bassnectar — Dormant Breakout Detector', 'Paula Moore', 'active', 'Monitor 2 dormant tracks trending on short-form', NULL, 'normal', 40, now() - interval '28 minutes', false, false, 'audience signal detection'),
  ('ledger', 'project', 'proj-gmg-launch', 'GMG Platform Launch Payout Readiness', 'Paula Moore', 'active', 'Approve 4 worker payment safes pending finance review', NULL, 'high', 70, now() - interval '4 minutes', true, false, 'worker payment monitoring'),
  ('ledger', 'project', 'proj-af-merch', 'Arctic Fox Merch — Payout map', 'Randy Jackson', 'active', 'Run reconciliation report for first 7 days of sales', NULL, 'normal', 50, now() - interval '35 minutes', false, false, 'worker payment monitoring'),
  ('counsel', 'contract', 'ctr-banc', 'Banc of California — master service', 'Paula Moore', 'active', 'Flag non-standard indemnity language for legal review', NULL, 'critical', 40, now() - interval '16 minutes', true, true, 'contract review'),
  ('counsel', 'contract', 'ctr-gallagher', 'Gallagher — Coverage agreement', 'Randy Jackson', 'queued', 'Draft markup for coverage exclusions', NULL, 'normal', 20, now() - interval '90 minutes', false, false, 'contract review'),
  ('contract-loop', 'contract', 'ctr-session-musician', 'Session Musician Agreement — Sam Heller', 'Paula Moore', 'blocked', 'Advance signature state — waiting on worker to sign', 'Worker has not signed', 'high', 20, now() - interval '1 day', false, false, 'contract review'),
  ('paula-exec', 'project', 'proj-gmg-launch', 'GMG Platform Launch Decision Packet', 'Paula Moore', 'active', 'Route packet to exec meeting agenda', NULL, 'high', 85, now() - interval '8 minutes', false, false, 'task routing'),
  ('paula-exec', 'partner', 'par-banc', 'Banc inquiry decision packet', 'Paula Moore', 'active', 'Assemble next-steps brief for Paula with legal + finance notes', NULL, 'critical', 60, now() - interval '14 minutes', true, true, 'task routing'),
  ('jacquelyn-exec', 'project', 'proj-gmg-launch', 'Launch Week Briefings', 'Paula Moore', 'active', 'Draft 3 briefings for Monday exec sync', NULL, 'normal', 45, now() - interval '40 minutes', false, false, 'task routing'),
  ('shield', 'partner', 'par-gallagher', 'Renewal window watch', 'Randy Jackson', 'active', 'Trigger 60-day notice window', NULL, 'normal', 55, now() - interval '2 hours', false, false, 'legal renewal watch'),
  ('anchor', 'project', 'proj-gmg-launch', 'Payment safe compliance audit', 'Paula Moore', 'active', 'Cross-check ACH + W9 + contract on 4 safes', NULL, 'high', 65, now() - interval '19 minutes', false, false, 'worker payment monitoring'),
  ('beacon', 'partner', 'par-banc', 'Banc of California pipeline advance', 'Paula Moore', 'active', 'Push partner packet to next stage', NULL, 'high', 70, now() - interval '25 minutes', true, false, 'partner pipeline support'),
  ('beacon', 'partner', 'par-fractional', 'Fractional Collective discovery', 'Randy Jackson', 'queued', 'Queue discovery call outreach', NULL, 'normal', 30, now() - interval '4 hours', false, false, 'partner pipeline support'),
  ('industry-marketing', 'campaign', 'cmp-industry-launch', 'Industry OS Launch Campaign', 'Paula Moore', 'active', 'Adjust budget allocation across 3 creative variants', NULL, 'high', 60, now() - interval '33 minutes', true, false, 'campaign optimization'),
  ('atlas-coworker', 'campaign', 'cmp-industry-member-1', 'Member — Early adopter rollout', 'Paula Moore', 'active', 'Onboard member to campaign tuning workflow', NULL, 'normal', 40, now() - interval '1 hour', false, false, 'campaign optimization'),
  ('ledger-coworker', 'project', 'proj-industry-finance', 'Industry Member Payout Setup', 'Paula Moore', 'blocked', 'Member missing W9 — cannot advance', 'W9 missing', 'high', 30, now() - interval '50 minutes', false, true, 'worker payment monitoring'),
  ('store-manager', 'catalog', 'cat-af-store', 'Arctic Fox Store — Inventory Balance', 'Randy Jackson', 'active', 'Re-balance 3 SKUs nearing stockout', NULL, 'normal', 55, now() - interval '20 minutes', false, false, 'catalog metadata cleanup'),
  ('tour-manager', 'project', 'proj-ta-tour', 'Trouble Andrew Tour Advancing', 'Paula Moore', 'active', 'Confirm advances + hospitality for 2 new dates', NULL, 'normal', 50, now() - interval '1 hour', false, false, 'artist rollout oversight');

-- Seed activity log entries
INSERT INTO admin_agent_activity (agent_slug, event_type, entity_type, entity_id, entity_label, summary, detail, severity, occurred_at, requires_human_followup) VALUES
  ('beacon', 'trigger', 'partner', 'par-banc', 'Banc of California', 'Flagged breakout velocity spike on Banc inquiry thread', 'Thread activity tripled in 48h — escalated to Paula for acceleration.', 'warn', now() - interval '3 minutes', true),
  ('atlas', 'action', 'campaign', 'cmp-af-tour', 'Arctic Fox Tour Rollout', 'Adjusted TikTok budget +18% based on 24h lift', 'Shifted budget from YouTube pre-roll into TikTok Spark Ads. Projected CPA delta -$0.42.', 'info', now() - interval '6 minutes', false),
  ('counsel', 'escalation', 'contract', 'ctr-banc', 'Banc of California — master service', 'Flagged non-standard clause — indemnity exposure', 'Clause 9.3 diverges from GMG standard. Routed to Paula + external counsel.', 'critical', now() - interval '10 minutes', true),
  ('ledger', 'output', 'project', 'proj-gmg-launch', 'GMG Platform Launch', 'Updated payout readiness — 4 safes now green', 'Contract + W9 + ACH + deliverables confirmed for 4 workers.', 'success', now() - interval '12 minutes', false),
  ('signalflow', 'trigger', 'catalog', 'cat-spin', 'SPIN Catalog', 'Detected anomaly — 3 tracks with 300%+ streaming spike', 'Bot-check triggered; cross-verifying geography + device fingerprints.', 'warn', now() - interval '14 minutes', true),
  ('paula-exec', 'action', 'project', 'proj-gmg-launch', 'Launch decision packet', 'Routed decision packet into Monday exec sync', 'Packet contains legal, finance, partner summaries and recommended actions.', 'info', now() - interval '18 minutes', false),
  ('contract-loop', 'action', 'contract', 'ctr-gallagher', 'Gallagher Coverage', 'Advanced signature state to Partner Review', 'PandaDoc field sync complete. Reminder dispatched to partner signer.', 'info', now() - interval '22 minutes', false),
  ('stage', 'cross_update', 'release', 'rel-af-eponymous', 'Arctic Fox Self-titled', 'Rollout timeline advanced by 3 days based on readiness', 'Readiness score 94. Moved pre-save push forward.', 'info', now() - interval '24 minutes', false),
  ('echo', 'output', 'artist', 'art-trouble-andrew', 'Trouble Andrew', 'Detected 2 new high-propensity fan clusters', 'Gen Z club-pop cluster + Southern indie shortform cluster surfaced.', 'success', now() - interval '26 minutes', false),
  ('current', 'trigger', 'release', 'rel-ta-glass', 'Trouble Andrew — Glass Palace', 'Release velocity above benchmark at 48h', 'Tracking above 72% of peer benchmark curve.', 'success', now() - interval '28 minutes', false),
  ('relay', 'action', 'partner', 'par-banc', 'Banc inquiry', 'Routed financial readiness packet to Paula', 'Auto-assembled from finance + legal + risk feeds.', 'info', now() - interval '32 minutes', false),
  ('index', 'failure', 'catalog', 'cat-bassnectar', 'Bassnectar Rights Map', 'Metadata refresh failed — missing rights doc', 'Run aborted at rights cross-check. Escalated to Jacquelyn.', 'critical', now() - interval '40 minutes', true),
  ('yield', 'approval_wait', 'catalog', 'cat-spin', 'SPIN — Payout Reconciliation', 'Awaiting human approval to post adjustments', 'Ledger entries ready to post. Pending Paula sign-off.', 'warn', now() - interval '45 minutes', true),
  ('anchor', 'output', 'project', 'proj-gmg-launch', 'Project Safe Compliance', 'Compliance audit complete on 4 safes', 'Ready-to-release flagged on 2; 2 held for ACH verification.', 'success', now() - interval '50 minutes', false),
  ('jacquelyn-exec', 'action', 'project', 'proj-gmg-launch', 'Briefings pack', 'Drafted 3 exec briefings for Monday sync', 'Covers GMG launch, partner pipeline, payment safes.', 'info', now() - interval '55 minutes', false),
  ('amplify', 'output', 'catalog', 'cat-spin', 'SPIN Catalog', 'Surfaced 3 sync placement opportunities', 'Pitched to sync agent inbox for review.', 'success', now() - interval '65 minutes', false),
  ('shield', 'cross_update', 'partner', 'par-gallagher', 'Gallagher Policy', 'Triggered 60-day renewal notice window', 'Window active until next review cycle.', 'info', now() - interval '75 minutes', false),
  ('ledger-coworker', 'escalation', 'project', 'proj-industry-finance', 'Industry Member Payout', 'Member missing W9 — payout cannot proceed', 'Escalated to member via Industry OS profile.', 'warn', now() - interval '85 minutes', true),
  ('vault', 'action', 'project', 'proj-gmg-launch', 'Safe allocation', 'Allocated $24K across 3 new project safes', 'Capital from reserve bucket A. Replenishment scheduled.', 'info', now() - interval '95 minutes', false),
  ('atlas-coworker', 'output', 'campaign', 'cmp-industry-member-1', 'Industry Member Campaign', 'Delivered campaign tuning handbook to member', 'Auto-generated based on member engagement profile.', 'info', now() - interval '2 hours', false),
  ('signalops', 'trigger', 'signal', 'sig-dormant-spike', 'Dormant Track Spike', 'Detected dormant catalog track trending on short-form', 'Track returning 4x 30d baseline on short-form video.', 'warn', now() - interval '2 hours 12 minutes', true),
  ('crest', 'output', 'artist', 'art-arctic-fox', 'Arctic Fox', 'Brand health score refreshed — 78/100', 'Up 4 points week-over-week driven by tour announcement response.', 'success', now() - interval '2 hours 20 minutes', false),
  ('counsel', 'action', 'contract', 'ctr-gallagher', 'Gallagher Coverage', 'Drafted clause markup for coverage exclusions', 'Markup delivered into contract review queue.', 'info', now() - interval '2 hours 40 minutes', false),
  ('tour-manager', 'action', 'project', 'proj-ta-tour', 'Trouble Andrew Tour', 'Confirmed advances for 2 new dates', 'Hospitality riders next; alerts dispatched to tour ops.', 'info', now() - interval '3 hours', false),
  ('store-manager', 'output', 'catalog', 'cat-af-store', 'Arctic Fox Store', 'Auto-rebalanced 3 SKUs nearing stockout', 'Inventory reallocation preserves tour merch window.', 'success', now() - interval '3 hours 20 minutes', false),
  ('campus-manager', 'cross_update', 'project', 'proj-campus', 'Campus Program', 'Synced membership billing to finance', 'Reconciled 42 memberships into ledger this cycle.', 'info', now() - interval '4 hours', false),
  ('industry-marketing', 'action', 'campaign', 'cmp-industry-launch', 'Industry Launch Campaign', 'Shifted creative variant weights based on CTR', 'Variant B now carrying 55% impression share.', 'info', now() - interval '4 hours 40 minutes', false),
  ('archive', 'output', 'catalog', 'cat-spin', 'SPIN History', 'Preserved new version snapshot', 'Metadata + rights snapshot stored with lineage pointer.', 'info', now() - interval '5 hours', false),
  ('vector', 'approval_wait', 'project', 'proj-af-merch', 'Arctic Fox Merch Creative', 'Awaiting creative direction brief review', 'Brief draft ready; Paula review pending.', 'warn', now() - interval '5 hours 30 minutes', true),
  ('echo-coworker', 'output', 'industry_member', 'mem-01', 'Industry Member — Audience Cluster', 'Identified fresh cluster for member rollout', 'Cluster scored 82/100 propensity.', 'info', now() - interval '6 hours', false),
  ('current-coworker', 'output', 'industry_member', 'mem-02', 'Industry Member — Release Traction', 'Release pacing ahead of benchmark', 'Momentum index +12% vs peer median.', 'success', now() - interval '7 hours', false),
  ('crest-coworker', 'output', 'industry_member', 'mem-03', 'Industry Member — Brand Health', 'Posted brand health pulse snapshot', 'Shifts in cultural positioning noted.', 'info', now() - interval '8 hours', false);
