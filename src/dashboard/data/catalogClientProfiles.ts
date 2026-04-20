// Resolves per-client profile data for COSOverview.
// Bassnectar data re-exported from its dedicated file; Santigold and Placeholder
// Artist 03 carry parallel structures with their own realistic data.

import {
  BN_META, BN_METRICS, BN_METRICS_LIST, BN_CURRENT_STATUS,
  BN_ENTITIES, BN_WEEKLY_SNAPSHOT, BN_TASKS, BN_TIMELINE,
  BN_EXPECTED_ANNUAL_OUTCOMES, BN_AI_RECOMMENDATIONS, BN_ACCOUNTING, BN_COMMS,
} from './bassnectarCatalogData';

// ── Shape types (inferred from Bassnectar data) ──────────────────────────────

type MetaShape           = typeof BN_META;
type MetricsMap          = typeof BN_METRICS;
type MetricsList         = readonly (keyof MetricsMap)[];
type CurrentStatusShape  = typeof BN_CURRENT_STATUS;
type EntitiesShape       = typeof BN_ENTITIES;
type WeeklySnapshotShape = typeof BN_WEEKLY_SNAPSHOT;
type TasksShape          = typeof BN_TASKS;
type TimelineShape       = typeof BN_TIMELINE;
type OutcomesShape       = typeof BN_EXPECTED_ANNUAL_OUTCOMES;
type RecsShape           = typeof BN_AI_RECOMMENDATIONS;
type AccountingShape     = typeof BN_ACCOUNTING;
type CommsShape          = typeof BN_COMMS;

export interface ClientProfileData {
  META: MetaShape;
  METRICS: MetricsMap;
  METRICS_LIST: MetricsList;
  CURRENT_STATUS: CurrentStatusShape;
  ENTITIES: EntitiesShape;
  WEEKLY_SNAPSHOT: WeeklySnapshotShape;
  TASKS: TasksShape;
  TIMELINE: TimelineShape;
  EXPECTED_ANNUAL_OUTCOMES: OutcomesShape;
  AI_RECOMMENDATIONS: RecsShape;
  ACCOUNTING: AccountingShape;
  COMMS: CommsShape;
}

// ── Bassnectar (pass-through) ────────────────────────────────────────────────

const BASSNECTAR_PROFILE: ClientProfileData = {
  META: BN_META,
  METRICS: BN_METRICS,
  METRICS_LIST: BN_METRICS_LIST,
  CURRENT_STATUS: BN_CURRENT_STATUS,
  ENTITIES: BN_ENTITIES,
  WEEKLY_SNAPSHOT: BN_WEEKLY_SNAPSHOT,
  TASKS: BN_TASKS,
  TIMELINE: BN_TIMELINE,
  EXPECTED_ANNUAL_OUTCOMES: BN_EXPECTED_ANNUAL_OUTCOMES,
  AI_RECOMMENDATIONS: BN_AI_RECOMMENDATIONS,
  ACCOUNTING: BN_ACCOUNTING,
  COMMS: BN_COMMS,
};

// ── Santigold ────────────────────────────────────────────────────────────────

const SG_META: MetaShape = {
  catalog_name: 'Santigold Catalog',
  artist_name: 'Santigold',
  logo_url: '',
  company_name: 'Santigold Music LLC',
  status: 'growth_management',
  status_label: 'Growth Management',
  status_color: '#F59E0B',
  catalog_rep: 'GMG Catalog Team',
  catalog_rep_email: 'santigold@greatermusicgroupteam.com',
  attorney: 'Lita Rosario · Rosario & Associates',
  last_updated: 'Apr 15, 2026 · 9:30 AM PT',
  last_updated_by: 'GMG AI Operator',
  client_since: 'February 2026',
  territory: 'Worldwide',
  years_active: '2008–present',
  total_releases: 18,
  description:
    'Santigold is a genre-defying artist whose catalog spans indie pop, art rock, dancehall, and electronic. With 820M all-time streams, 4 studio albums, and a robust sync history, the catalog is positioned for reactivation through new sync pipeline development, streaming growth campaigns, and LP5 planning for Q4 2026. GMG is managing catalog marketing, sync licensing, and operational infrastructure.',
  strategic_focus:
    'LP5 development · Film + TV sync pipeline · Streaming reactivation · Brand partnership expansion',
};

const SG_METRICS: MetricsMap = {
  catalog_value:   { label: 'Est. Catalog Value',       value: '$3.2M',     delta: '+$340K YTD',   dir: 'up',      color: '#F59E0B', sub: 'Based on 14× NMV'       },
  monthly_revenue: { label: 'Monthly Revenue',          value: '$148,000',  delta: '+18.1% YoY',   dir: 'up',      color: '#06B6D4', sub: 'Apr 2026'                },
  growth_rate:     { label: 'YoY Growth',               value: '+18.1%',    delta: 'vs +9% prior', dir: 'up',      color: '#F59E0B', sub: 'Revenue growth'          },
  multiple:        { label: 'Revenue Multiple',         value: '14×',       delta: 'vs 12× catalog avg', dir: 'up', color: '#3B82F6', sub: 'NMV multiple'           },
  royalty_yield:   { label: 'Royalty Yield',            value: '3.8%',      delta: '+0.4pp YoY',   dir: 'up',      color: '#A3E635', sub: 'Annual NMV yield'        },
  active_assets:   { label: 'Active Assets',            value: '164',       delta: 'incl. features',dir: 'neutral', color: '#EC4899', sub: 'Recordings + releases'  },
  total_streams:   { label: 'Total Streams (All-Time)', value: '820M',      delta: '+14M this mo', dir: 'up',      color: '#8B5CF6', sub: 'Across all DSPs'         },
  top_song:        { label: 'Top Song',                 value: 'Disparate Youth', delta: '2.8M streams/mo',dir: 'up', color: '#06B6D4', sub: '2012 · Sync favorite' },
  top_album:       { label: 'Top Album',                value: 'Santigold', delta: '$32K/mo',      dir: 'up',      color: '#10B981', sub: '2008 debut LP'           },
};

const SG_CURRENT_STATUS: CurrentStatusShape = {
  headline: 'Catalog Reactivation + LP5 Development',
  summary: 'As of April 2026, the Santigold catalog is in an active growth phase. Streaming numbers have increased 18% YoY driven by sync placements and playlist campaigns. LP5 is in early production with a target release window of Q4 2026. The film + TV sync pipeline is the most active it has been in 3 years.',
  dimensions: [
    { label: 'Catalog Marketing', status: 'active', color: '#10B981', detail: '18 releases actively promoted via DSP campaigns and editorial outreach.' },
    { label: 'Sync Pipeline', status: 'active', color: '#10B981', detail: '4 active sync inquiries across film and TV. "Disparate Youth" placed in major ad campaign.' },
    { label: 'LP5 Development', status: 'in_development', color: '#06B6D4', detail: 'Early production phase. 6 demos recorded. Target: Q4 2026 release.' },
    { label: 'Brand Partnerships', status: 'in_progress', color: '#F59E0B', detail: '2 brand partnership inquiries in review. Fashion and lifestyle verticals.' },
    { label: 'International Growth', status: 'planned', color: '#3B82F6', detail: 'EU market expansion planned for H2 2026. UK and Germany priority markets.' },
    { label: 'Direct Fan Strategy', status: 'planned', color: '#3B82F6', detail: 'Newsletter relaunch and fan community platform under evaluation.' },
  ],
  key_opportunities: [
    { label: '"Disparate Youth" — Major Ad Campaign Renewal', urgency: 'high',    impact: 'Est. $60K–$150K renewal fee' },
    { label: 'LP5 Advance — Label Shopping',                  urgency: 'high',    impact: 'Est. $200K–$500K advance' },
    { label: 'Film Sync — "Creator" Placement',               urgency: 'medium',  impact: 'Est. $40K–$80K placement' },
    { label: 'Fashion Brand Partnership',                     urgency: 'medium',  impact: 'Est. $30K–$60K collaboration' },
  ],
};

const SG_ENTITIES: EntitiesShape = [
  {
    id: 'santigold-music',
    name: 'Santigold Music LLC',
    type: 'Record Company / Catalog',
    role: 'Master Recording Owner · Catalog Management',
    color: '#F59E0B',
    icon: 'library',
    monthly_revenue: '$118,200',
    monthly_expenses: '$22,400',
    net_monthly: '$95,800',
    active_projects: 5,
    status: 'active',
    services: ['Spotify', 'Apple Music', 'YouTube', 'GMG Catalog OS', 'SoundExchange'],
    description: 'Holds master recording rights for the Santigold catalog. Primary vehicle for streaming, licensing, and catalog monetization.',
  },
  {
    id: 'santigold-publishing',
    name: 'Santigold Publishing',
    type: 'Publishing Entity',
    role: 'Songwriting · Publishing · Sync Licensing',
    color: '#10B981',
    icon: 'library',
    monthly_revenue: '$29,800',
    monthly_expenses: '$6,200',
    net_monthly: '$23,600',
    active_projects: 3,
    status: 'active',
    services: ['ASCAP', 'Harry Fox Agency', 'GMG Sync Desk'],
    description: 'Publishing entity managing songwriter royalties, mechanical licenses, and sync licensing for Santigold compositions.',
  },
];

const SG_WEEKLY_SNAPSHOT: WeeklySnapshotShape = {
  week_of: 'Week of Apr 7–13, 2026',
  generated: 'Apr 14, 2026 · 9:30 AM PT',
  wins: [
    '"Disparate Youth" ad campaign renewal confirmed — $85K placement fee',
    'LP5 demo session produced 3 strong candidates for lead single',
    'Spotify editorial placement on "Indie Pop Rising" — 1.8M followers',
  ],
  issues: [
    'Publishing royalty audit delayed — CPA firm rescheduled to Apr 28',
    'YouTube MCN contract expires May 15 — renewal terms under review',
  ],
  revenue_movement: {
    vs_prior_week: '+$8,400',
    vs_prior_week_dir: 'up',
    top_mover: '"Disparate Youth" sync boost (+22% WoW)',
    surprise: 'Self-titled debut album streaming up 31% — nostalgia cycle',
  },
  new_opportunities: [
    'Film supervisor inquiry for indie drama — 3 tracks requested',
    'Fashion brand collaboration inquiry — luxury streetwear line',
  ],
  progress_summary: 'Solid week. Sync pipeline continues to strengthen. LP5 production gaining momentum. Catalog streaming trending upward across all DSPs.',
  all_hands_video: null,
};

const SG_TASKS: TasksShape = [
  { id: 'ST-001', title: '"Disparate Youth" ad renewal — contract review',    assignee: 'GMG Licensing',   ai: false, status: 'in_progress', priority: 'high',     due: 'Apr 18, 2026', notes: 2, flagged: false, category: 'Sync'     },
  { id: 'ST-002', title: 'LP5 demo review — A&R brief',                      assignee: 'GMG AI Operator', ai: true,  status: 'in_progress', priority: 'high',     due: 'Apr 20, 2026', notes: 1, flagged: false, category: 'Release'  },
  { id: 'ST-003', title: 'Spotify editorial pitch — "Master of My Make-Believe"', assignee: 'GMG Marketing', ai: false, status: 'open',    priority: 'medium',   due: 'Apr 22, 2026', notes: 0, flagged: false, category: 'Campaign' },
  { id: 'ST-004', title: 'Publishing royalty audit follow-up',                assignee: 'GMG Finance',     ai: false, status: 'open',        priority: 'medium',   due: 'Apr 28, 2026', notes: 1, flagged: true,  category: 'Finance'  },
  { id: 'ST-005', title: 'YouTube MCN contract renewal terms',                assignee: 'GMG Legal',       ai: false, status: 'open',        priority: 'high',     due: 'May 1, 2026',  notes: 0, flagged: false, category: 'Rights'   },
  { id: 'ST-006', title: 'Film sync inquiry — track clearance',               assignee: 'GMG Licensing',   ai: false, status: 'open',        priority: 'medium',   due: 'Apr 25, 2026', notes: 0, flagged: false, category: 'Sync'     },
];

const SG_TIMELINE: TimelineShape = [
  {
    month: 'May 2026',
    items: [
      { type: 'campaign',  label: '"Disparate Youth" Ad Campaign Renewal',        outcome: 'Est. $85K placement',         color: '#F59E0B' },
      { type: 'campaign',  label: 'Spotify Marquee — Self-Titled Debut Push',    outcome: 'Est. +25K monthly listeners', color: '#1DB954' },
    ],
  },
  {
    month: 'Jun 2026',
    items: [
      { type: 'release',   label: 'LP5 Lead Single — Recording Window',           outcome: 'Production milestone',        color: '#06B6D4' },
      { type: 'brand',     label: 'Fashion Brand Partnership — Finalize',         outcome: 'Est. $30K–$60K',              color: '#EC4899' },
    ],
  },
  {
    month: 'Jul–Sep 2026',
    items: [
      { type: 'campaign',  label: 'Film Sync Placements — H2 Window',             outcome: 'Est. $40K–$120K',             color: '#10B981' },
      { type: 'release',   label: 'LP5 Production — Full Album Sessions',         outcome: 'Target: 12 tracks',           color: '#06B6D4' },
      { type: 'press',     label: 'LP5 Pre-Campaign — Media Outreach',            outcome: 'Brand visibility build',      color: '#8B5CF6' },
    ],
  },
  {
    month: 'Oct–Dec 2026',
    items: [
      { type: 'release',   label: 'LP5 Release — Full Campaign',                  outcome: 'Est. $200K–$500K gross',      color: '#F59E0B' },
      { type: 'tour',      label: 'LP5 Supporting Tour — Announcement',           outcome: 'Est. $150K–$300K gross',      color: '#10B981' },
      { type: 'merch',     label: 'LP5 Merch Collection',                         outcome: 'Est. $40K–$80K',              color: '#06B6D4' },
    ],
  },
];

const SG_EXPECTED_ANNUAL_OUTCOMES: OutcomesShape = [
  { label: 'Total Projected Revenue 2026',  value: '$1.4M–$2.2M', color: '#F59E0B' },
  { label: 'Catalog Value at Year-End',     value: '$4.0M–$5.2M', color: '#06B6D4' },
  { label: 'Monthly Listeners Target',      value: '1.2M+',       color: '#10B981' },
  { label: 'LP5 Target Release',            value: 'Q4 2026',     color: '#8B5CF6' },
];

const SG_AI_RECOMMENDATIONS: RecsShape = [
  {
    category: 'Sync',
    urgency: 'high',
    color: '#F59E0B',
    verdict: 'RENEW NOW',
    title: '"Disparate Youth" ad renewal is time-sensitive',
    body: 'The current ad placement expires May 1. Renewal at improved terms is on the table. Delay risks losing placement to competing catalog.',
    action: 'GMG Licensing to finalize renewal terms by Apr 18.',
  },
  {
    category: 'Release',
    urgency: 'high',
    color: '#06B6D4',
    verdict: 'ACCELERATE',
    title: 'LP5 lead single should be identified within 30 days',
    body: 'Demo quality is strong. Identifying the lead single early enables a longer rollout campaign, which historically drives 40% more first-week streams.',
    action: 'A&R review session by Apr 25. Shortlist 3 candidates for lead single.',
  },
  {
    category: 'Revenue',
    urgency: 'medium',
    color: '#10B981',
    verdict: 'OPPORTUNITY',
    title: 'Self-titled debut streaming surge suggests nostalgia campaign',
    body: 'Debut album streams are up 31% WoW — organic nostalgia cycle. A targeted Spotify Marquee push could accelerate this into sustained growth.',
    action: 'GMG Marketing to launch Marquee campaign for self-titled debut by Apr 22.',
  },
];

const SG_ACCOUNTING: AccountingShape = {
  this_week:       { revenue: '$37,200',  expenses: '$7,400',  net: '+$29,800',  dir: 'up'  },
  month_to_date:   { revenue: '$112,400', expenses: '$24,800', net: '+$87,600',  dir: 'up'  },
  quarter_to_date: { revenue: '$348,200', expenses: '$72,400', net: '+$275,800', dir: 'up'  },
  year_to_date:    { revenue: '$492,600', expenses: '$108,200',net: '+$384,400', dir: 'up'  },
  top_expense_this_month: 'LP5 production sessions — $12,400',
  expense_alert: null,
  revenue_sources: [
    { label: 'Streaming',    pct: 58, color: '#1DB954' },
    { label: 'Sync',         pct: 22, color: '#06B6D4' },
    { label: 'Publishing',   pct: 12, color: '#10B981' },
    { label: 'Merch',        pct: 8,  color: '#EC4899' },
  ],
};

const SG_COMMS: CommsShape = {
  email: 'santigold@greatermusicgroupteam.com',
  description: 'All requests, tasks, updates, and approvals submitted to this address are automatically captured, parsed, and routed by the GMG AI Operator.',
  response_sla: 'All emails acknowledged within 2 hours by AI. Human response within 4 business hours.',
  ai_operator_status: 'active',
  recent_threads: [
    { from: 'GMG Licensing',    subject: '"Disparate Youth" renewal terms — ready for review', time: '3h ago',    unread: true  },
    { from: 'GMG A&R',          subject: 'LP5 demo session notes — 3 strong candidates',       time: '6h ago',    unread: true  },
    { from: 'Film Supervisor',  subject: 'Track clearance request — indie drama',               time: 'Yesterday', unread: false },
    { from: 'GMG Marketing',    subject: 'Spotify editorial confirmation — Indie Pop Rising',   time: '2d ago',    unread: false },
  ],
};

const SANTIGOLD_PROFILE: ClientProfileData = {
  META: SG_META,
  METRICS: SG_METRICS,
  METRICS_LIST: BN_METRICS_LIST,
  CURRENT_STATUS: SG_CURRENT_STATUS,
  ENTITIES: SG_ENTITIES,
  WEEKLY_SNAPSHOT: SG_WEEKLY_SNAPSHOT,
  TASKS: SG_TASKS,
  TIMELINE: SG_TIMELINE,
  EXPECTED_ANNUAL_OUTCOMES: SG_EXPECTED_ANNUAL_OUTCOMES,
  AI_RECOMMENDATIONS: SG_AI_RECOMMENDATIONS,
  ACCOUNTING: SG_ACCOUNTING,
  COMMS: SG_COMMS,
};

// ── Placeholder Artist 03 ────────────────────────────────────────────────────

const PA_META: MetaShape = {
  catalog_name: 'Artist 03 Catalog',
  artist_name: 'Placeholder Artist 03',
  logo_url: '',
  company_name: 'Artist 03 Music LLC',
  status: 'onboarding',
  status_label: 'Onboarding',
  status_color: '#3B82F6',
  catalog_rep: 'GMG Catalog Team',
  catalog_rep_email: 'artist03@greatermusicgroupteam.com',
  attorney: 'TBD — Under Engagement Review',
  last_updated: 'Apr 15, 2026 · 10:00 AM PT',
  last_updated_by: 'GMG AI Operator',
  client_since: 'April 2026',
  territory: 'Worldwide',
  years_active: '2019–present',
  total_releases: 6,
  description:
    'Placeholder Artist 03 is a newly onboarded catalog client currently in the assessment and rights clearance phase. The catalog includes 6 releases with 42M all-time streams. GMG is conducting a full catalog audit, rights verification, and opportunity assessment. Full operational management is expected to begin in May 2026.',
  strategic_focus:
    'Onboarding + rights clearance · Catalog audit · Opportunity assessment · Full management target: May 2026',
};

const PA_METRICS: MetricsMap = {
  catalog_value:   { label: 'Est. Catalog Value',       value: '$420K',     delta: 'Under assessment', dir: 'neutral', color: '#3B82F6', sub: 'Preliminary estimate' },
  monthly_revenue: { label: 'Monthly Revenue',          value: '$18,500',   delta: 'Baseline period',  dir: 'neutral', color: '#06B6D4', sub: 'Apr 2026'            },
  growth_rate:     { label: 'YoY Growth',               value: '+8.2%',     delta: 'vs +6% prior',     dir: 'up',      color: '#F59E0B', sub: 'Revenue growth'      },
  multiple:        { label: 'Revenue Multiple',         value: '—',         delta: 'Pending audit',    dir: 'neutral', color: '#6B7280', sub: 'Not yet calculated'   },
  royalty_yield:   { label: 'Royalty Yield',            value: '—',         delta: 'Pending',          dir: 'neutral', color: '#6B7280', sub: 'Under review'        },
  active_assets:   { label: 'Active Assets',            value: '38',        delta: 'Under audit',      dir: 'neutral', color: '#EC4899', sub: 'Recordings + releases'},
  total_streams:   { label: 'Total Streams (All-Time)', value: '42M',       delta: '+1.2M this mo',    dir: 'up',      color: '#8B5CF6', sub: 'Across all DSPs'     },
  top_song:        { label: 'Top Song',                 value: 'TBD',       delta: 'Under analysis',   dir: 'neutral', color: '#06B6D4', sub: 'Pending catalog audit'},
  top_album:       { label: 'Top Album',                value: 'TBD',       delta: 'Under analysis',   dir: 'neutral', color: '#10B981', sub: 'Pending catalog audit'},
};

const PA_CURRENT_STATUS: CurrentStatusShape = {
  headline: 'Onboarding + Rights Clearance In Progress',
  summary: 'Placeholder Artist 03 is in the initial onboarding phase. GMG is conducting a full catalog audit, verifying rights ownership, and building the operational baseline. Full management is expected to begin in May 2026 pending completion of rights clearance and initial assessment.',
  dimensions: [
    { label: 'Catalog Audit', status: 'in_progress', color: '#F59E0B', detail: 'Full catalog inventory and metadata audit underway. 38 assets identified across 6 releases.' },
    { label: 'Rights Clearance', status: 'in_progress', color: '#F59E0B', detail: 'Rights verification in progress. Master ownership confirmed for 4 of 6 releases. 2 pending co-ownership review.' },
    { label: 'Opportunity Assessment', status: 'planned', color: '#3B82F6', detail: 'Initial market and sync opportunity assessment scheduled for May 2026.' },
  ],
  key_opportunities: [
    { label: 'Full Catalog Audit Completion', urgency: 'high',   impact: 'Enables full operational management' },
    { label: 'Rights Clearance — 2 Pending Releases', urgency: 'high', impact: 'Unlocks full catalog licensing' },
    { label: 'Streaming Baseline Assessment', urgency: 'medium', impact: 'Informs growth strategy' },
  ],
};

const PA_ENTITIES: EntitiesShape = [
  {
    id: 'artist03-music',
    name: 'Artist 03 Music LLC',
    type: 'Record Company / Catalog',
    role: 'Master Recording Owner',
    color: '#3B82F6',
    icon: 'library',
    monthly_revenue: '$18,500',
    monthly_expenses: '$4,200',
    net_monthly: '$14,300',
    active_projects: 2,
    status: 'active',
    services: ['Spotify', 'Apple Music', 'YouTube'],
    description: 'Primary entity holding master recording rights. Currently under audit and rights verification.',
  },
];

const PA_WEEKLY_SNAPSHOT: WeeklySnapshotShape = {
  week_of: 'Week of Apr 7–13, 2026',
  generated: 'Apr 14, 2026 · 10:00 AM PT',
  wins: [
    'Onboarding kickoff meeting completed successfully',
    'Master ownership confirmed for 4 of 6 releases',
    'Catalog metadata ingestion started — 38 assets identified',
  ],
  issues: [
    '2 releases have co-ownership claims requiring legal review',
    'Distribution agreement terms need verification before campaign activation',
  ],
  revenue_movement: {
    vs_prior_week: '+$420',
    vs_prior_week_dir: 'up',
    top_mover: 'Organic playlist adds across catalog',
    surprise: 'No surprises this week — baseline period',
  },
  new_opportunities: [
    'Early sync screening identified 2 tracks with potential for film/TV placement',
  ],
  progress_summary: 'Onboarding progressing on schedule. Rights clearance is the critical path item. Full management expected to begin May 2026.',
  all_hands_video: null,
};

const PA_TASKS: TasksShape = [
  { id: 'PA-001', title: 'Complete rights clearance — 2 pending releases',  assignee: 'GMG Legal',       ai: false, status: 'in_progress', priority: 'high',   due: 'Apr 25, 2026', notes: 2, flagged: true,  category: 'Rights' },
  { id: 'PA-002', title: 'Catalog metadata audit — finalize asset inventory', assignee: 'GMG AI Operator', ai: true,  status: 'in_progress', priority: 'high',   due: 'Apr 22, 2026', notes: 0, flagged: false, category: 'Ops'    },
  { id: 'PA-003', title: 'Distribution agreement verification',              assignee: 'GMG Legal',       ai: false, status: 'open',        priority: 'medium', due: 'Apr 30, 2026', notes: 0, flagged: false, category: 'Rights' },
  { id: 'PA-004', title: 'Initial streaming baseline report',                assignee: 'GMG Analytics',   ai: true,  status: 'open',        priority: 'medium', due: 'May 5, 2026',  notes: 0, flagged: false, category: 'Strategy' },
];

const PA_TIMELINE: TimelineShape = [
  {
    month: 'May 2026',
    items: [
      { type: 'legal',     label: 'Rights Clearance Completion',                outcome: 'Full catalog access',        color: '#3B82F6' },
      { type: 'campaign',  label: 'Initial Streaming Assessment',               outcome: 'Growth strategy baseline',   color: '#06B6D4' },
    ],
  },
  {
    month: 'Jun–Jul 2026',
    items: [
      { type: 'campaign',  label: 'First Catalog Marketing Campaign',           outcome: 'Est. growth baseline',       color: '#10B981' },
      { type: 'campaign',  label: 'Sync Opportunity Outreach — Phase 1',        outcome: 'Pipeline development',       color: '#F59E0B' },
    ],
  },
];

const PA_EXPECTED_ANNUAL_OUTCOMES: OutcomesShape = [
  { label: 'Projected Revenue 2026 (H2)',  value: '$120K–$200K', color: '#3B82F6' },
  { label: 'Catalog Value Target',         value: '$500K–$650K', color: '#06B6D4' },
  { label: 'Onboarding Completion',        value: 'May 2026',    color: '#10B981' },
  { label: 'First Campaign Launch',        value: 'Jun 2026',    color: '#F59E0B' },
];

const PA_AI_RECOMMENDATIONS: RecsShape = [
  {
    category: 'Onboarding',
    urgency: 'high',
    color: '#3B82F6',
    verdict: 'PRIORITY',
    title: 'Rights clearance is the critical path to full management',
    body: '2 releases have co-ownership claims that must be resolved before GMG can activate campaigns or pursue sync licensing on those assets.',
    action: 'GMG Legal to complete co-ownership review by Apr 25. Escalate if third-party response delayed.',
  },
  {
    category: 'Strategy',
    urgency: 'medium',
    color: '#06B6D4',
    verdict: 'ASSESS',
    title: 'Early sync screening shows promise for 2 tracks',
    body: 'Initial catalog review identified 2 tracks with strong sync potential. Once rights are cleared, these should be prioritized for film/TV pitching.',
    action: 'Queue for sync desk review immediately after rights clearance completion.',
  },
];

const PA_ACCOUNTING: AccountingShape = {
  this_week:       { revenue: '$4,600',  expenses: '$1,200', net: '+$3,400',  dir: 'up'  },
  month_to_date:   { revenue: '$14,200', expenses: '$4,200', net: '+$10,000', dir: 'up'  },
  quarter_to_date: { revenue: '$14,200', expenses: '$4,200', net: '+$10,000', dir: 'up'  },
  year_to_date:    { revenue: '$14,200', expenses: '$4,200', net: '+$10,000', dir: 'up'  },
  top_expense_this_month: 'Legal — rights clearance review $2,800',
  expense_alert: null,
  revenue_sources: [
    { label: 'Streaming',    pct: 82, color: '#1DB954' },
    { label: 'Publishing',   pct: 18, color: '#10B981' },
  ],
};

const PA_COMMS: CommsShape = {
  email: 'artist03@greatermusicgroupteam.com',
  description: 'All requests, tasks, updates, and approvals submitted to this address are automatically captured, parsed, and routed by the GMG AI Operator.',
  response_sla: 'All emails acknowledged within 2 hours by AI. Human response within 4 business hours.',
  ai_operator_status: 'active',
  recent_threads: [
    { from: 'GMG Legal',      subject: 'Rights clearance update — 2 releases pending', time: '4h ago',    unread: true  },
    { from: 'GMG Onboarding', subject: 'Catalog audit kickoff notes',                  time: 'Yesterday', unread: false },
  ],
};

const PLACEHOLDER_03_PROFILE: ClientProfileData = {
  META: PA_META,
  METRICS: PA_METRICS,
  METRICS_LIST: BN_METRICS_LIST,
  CURRENT_STATUS: PA_CURRENT_STATUS,
  ENTITIES: PA_ENTITIES,
  WEEKLY_SNAPSHOT: PA_WEEKLY_SNAPSHOT,
  TASKS: PA_TASKS,
  TIMELINE: PA_TIMELINE,
  EXPECTED_ANNUAL_OUTCOMES: PA_EXPECTED_ANNUAL_OUTCOMES,
  AI_RECOMMENDATIONS: PA_AI_RECOMMENDATIONS,
  ACCOUNTING: PA_ACCOUNTING,
  COMMS: PA_COMMS,
};

// ── Resolver ─────────────────────────────────────────────────────────────────

const PROFILES: Record<string, ClientProfileData> = {
  'a1000000-0000-0000-0000-000000000001': BASSNECTAR_PROFILE,
  'a2000000-0000-0000-0000-000000000002': SANTIGOLD_PROFILE,
  'a3000000-0000-0000-0000-000000000003': PLACEHOLDER_03_PROFILE,
};

export function getClientProfile(clientId: string | undefined): ClientProfileData {
  if (clientId && PROFILES[clientId]) return PROFILES[clientId];
  return BASSNECTAR_PROFILE;
}
