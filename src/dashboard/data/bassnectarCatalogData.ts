export const BN_META = {
  catalog_name: 'Bassnectar / Amorphous Music Catalog',
  artist_name: 'Bassnectar',
  logo_url: '/bassnectar-logo-white[1000].png',
  company_name: 'Amorphous Music Inc.',
  status: 'growth_management',
  status_label: 'Growth Management',
  status_color: '#10B981',
  catalog_rep: 'Nick Terzo',
  catalog_rep_email: 'bn@greatermusicgroupteam.com',
  attorney: 'Peter Paterno · King, Holmes, Paterno & Soriano LLP',
  last_updated: 'Apr 15, 2026 · 8:14 AM PT',
  last_updated_by: 'GMG AI Operator',
  client_since: 'November 2025',
  territory: 'Worldwide',
  years_active: '2001–present',
  total_releases: 28,
  description:
    'Bassnectar is one of the most culturally significant names in electronic music — 20+ years, 28 releases, 2.4B all-time streams, and one of the most loyal fanbases in the independent world. The catalog is in a structured brand rehabilitation and reactivation phase following a 2020 hiatus. GMG is managing the full operational stack: streaming growth, sync pipeline development, direct fan monetization via ZFM, merchandise operations through Vasona Blue, and entity-level financial infrastructure.',
  strategic_focus:
    'Brand rehab + catalog reactivation · Sync pipeline ($200K–$600K target) · Direct fan monetization (ZFM) · Live return — Q4 2026',
};

export const BN_METRICS = {
  catalog_value:       { label: 'Est. Catalog Value',       value: '$5.8M',     delta: '+$820K YTD',   dir: 'up',      color: '#10B981', sub: 'Based on 17× NMV'       },
  monthly_revenue:     { label: 'Monthly Revenue',          value: '$284,600',  delta: '+22.4% YoY',   dir: 'up',      color: '#06B6D4', sub: 'Apr 2026'                },
  growth_rate:         { label: 'YoY Growth',               value: '+22.4%',    delta: 'vs +11% prior',dir: 'up',      color: '#F59E0B', sub: 'Revenue growth'          },
  multiple:            { label: 'Revenue Multiple',         value: '17×',       delta: 'vs 14× catalog avg', dir: 'up', color: '#3B82F6', sub: 'NMV multiple'           },
  royalty_yield:       { label: 'Royalty Yield',            value: '4.1%',      delta: '+0.6pp YoY',   dir: 'up',      color: '#A3E635', sub: 'Annual NMV yield'        },
  active_assets:       { label: 'Active Assets',            value: '312',       delta: 'incl. bootlegs',dir: 'neutral', color: '#EC4899', sub: 'Recordings + releases'  },
  total_streams:       { label: 'Total Streams (All-Time)', value: '2.4B',      delta: '+28M this mo', dir: 'up',      color: '#8B5CF6', sub: 'Across all DSPs'         },
  top_song:            { label: 'Top Song',                 value: 'Butterfly', delta: '4.2M streams/mo',dir: 'up',    color: '#06B6D4', sub: '2012 · Still climbing'   },
  top_album:           { label: 'Top Album',                value: 'Divergent Spectrum', delta: '$48K/mo',dir: 'up',   color: '#10B981', sub: '2016 LP'                 },
};

export const BN_METRICS_LIST = [
  'catalog_value', 'multiple', 'total_streams',
  'monthly_revenue', 'growth_rate', 'royalty_yield',
  'active_assets', 'top_song', 'top_album',
] as const;

export const BN_CURRENT_STATUS = {
  headline: 'Brand Rehabilitation + Catalog Reactivation Underway',
  summary: 'As of April 2026, the Bassnectar catalog is in a structured rehabilitation and growth phase. Streaming numbers have returned to 85% of pre-hiatus levels, with monthly listeners growing for 14 consecutive months. A carefully managed brand reintroduction strategy is in progress, anchored by catalog reactivation, new sync placements, and direct fan re-engagement through ZFM and Bassnectar mailing lists. No new public-facing statements are scheduled at this time.',
  dimensions: [
    {
      label: 'Brand Rehabilitation',
      status: 'in_progress',
      color: '#F59E0B',
      detail: 'Private community reactivation underway. No public press campaign yet. Dedicated team managing narrative and content.',
    },
    {
      label: 'Catalog Reactivation',
      status: 'active',
      color: '#10B981',
      detail: '28 releases actively promoted via playlist submissions, editorial outreach, and catalog ad campaigns across Spotify and Meta.',
    },
    {
      label: 'Sync Activity',
      status: 'active',
      color: '#10B981',
      detail: '6 active sync inquiries across film, gaming, and brand. "Butterfly" in final round for major streaming series.',
    },
    {
      label: 'New Release Pipeline',
      status: 'in_development',
      color: '#06B6D4',
      detail: 'Archival release and potential new EP in production discussions. Target window: Q3 2026 pending artist confirmation.',
    },
    {
      label: 'International Re-Expansion',
      status: 'planned',
      color: '#3B82F6',
      detail: 'EU and UK market reactivation plans drafted. Target: 3 key markets by Q4 2026.',
    },
    {
      label: 'Fan Monetization',
      status: 'active',
      color: '#10B981',
      detail: 'ZFM platform generating $18K/mo from non-DSP sales, merchandise, and archival content. Growing 9% MoM.',
    },
  ],
  key_opportunities: [
    { label: '"Butterfly" Sync — Streaming Series',  urgency: 'critical', impact: 'Est. $80K–$220K placement fee' },
    { label: 'Archival Release — Fan Vault Drop',    urgency: 'high',    impact: 'Est. $140K–$400K in 90 days'   },
    { label: 'Gaming Sync Pipeline',                 urgency: 'high',    impact: '3 active requests in review'   },
    { label: 'ZFM Subscription Tier Launch',         urgency: 'medium',  impact: 'Est. +$22K/mo at 500 subs'    },
    { label: 'Spotify Marquee Campaign',             urgency: 'medium',  impact: 'Divergent Spectrum — est. +$31K/mo streaming' },
  ],
};

export const BN_ENTITIES = [
  {
    id: 'amorphous-music',
    name: 'Amorphous Music Inc.',
    type: 'Record Company / Catalog',
    role: 'Master Recording Owner · Catalog Management',
    color: '#10B981',
    icon: 'library',
    monthly_revenue: '$201,400',
    monthly_expenses: '$38,200',
    net_monthly: '$163,200',
    active_projects: 8,
    status: 'active',
    services: ['Spotify', 'Apple Music', 'YouTube', 'GMG Catalog OS', 'SoundExchange'],
    description: 'Holds all master recording rights for the Bassnectar catalog. Primary vehicle for streaming, licensing, and catalog monetization.',
  },
  {
    id: 'vasona-blue',
    name: 'Vasona Blue LLC',
    type: 'Tour + Merch Company',
    role: 'Live Performance · Merchandise · Consumer Products',
    color: '#06B6D4',
    icon: 'mic',
    monthly_revenue: '$42,800',
    monthly_expenses: '$28,600',
    net_monthly: '$14,200',
    active_projects: 3,
    status: 'active',
    services: ['Shopify', 'Printful', 'CAA Touring', 'Stripe'],
    description: 'Manages official merchandise, apparel, and consumer products. Will also serve as the touring entity when live operations resume.',
  },
  {
    id: 'zfm-music',
    name: 'ZFM Music',
    type: 'Fan Club + Direct Media',
    role: 'Fan Community · Non-DSP Sales · Archival Content',
    color: '#F59E0B',
    icon: 'users',
    monthly_revenue: '$18,200',
    monthly_expenses: '$4,800',
    net_monthly: '$13,400',
    active_projects: 4,
    status: 'active',
    services: ['Bandcamp', 'Patreon', 'Mailchimp', 'Stripe', 'Discord'],
    description: 'Dedicated fan platform for direct music sales, archival releases, exclusive content, and community operations. Core of direct fan monetization strategy.',
  },
  {
    id: 'bassnectar-touring',
    name: 'Bassnectar Touring LLC',
    type: 'Touring Entity',
    role: 'Live + Festival Bookings',
    color: '#8B5CF6',
    icon: 'map-pin',
    monthly_revenue: '$0',
    monthly_expenses: '$2,100',
    net_monthly: '-$2,100',
    active_projects: 1,
    status: 'holding',
    services: ['CAA Music', 'TM / Live Nation'],
    description: 'Dormant touring entity currently in holding status. Bookings on hold pending brand rehab completion. Reactivation target: Q4 2026.',
  },
  {
    id: 'bassnectar-inc',
    name: 'Bassnectar Inc.',
    type: 'Parent Company / Production',
    role: 'IP Holding · Side Projects · Production Licensing',
    color: '#EC4899',
    icon: 'building',
    monthly_revenue: '$22,200',
    monthly_expenses: '$11,400',
    net_monthly: '$10,800',
    active_projects: 2,
    status: 'active',
    services: ['QuickBooks', 'Legal', 'Publishing Admin'],
    description: 'Parent holding company covering IP, production licensing, side project development, and administrative operations.',
  },
];

export const BN_WEEKLY_SNAPSHOT = {
  week_of: 'Week of Apr 7–13, 2026',
  generated: 'Apr 14, 2026 · 8:00 AM PT',
  wins: [
    '"Butterfly" advanced to final sync consideration round for major Netflix series — decision expected Apr 18',
    'Monthly listeners crossed 1.24M — highest since 2019, 14th consecutive month of growth',
    'ZFM archival release generated $31,200 in first 72 hours',
    'Divergent Spectrum LP editorial placement confirmed on "Late Night Electronic" (Spotify, 2.4M followers)',
  ],
  issues: [
    'Vasona Blue fulfillment delay on hoodie restock — vendor ETA pushed to Apr 22',
    'Bassnectar Touring entity insurance renewal overdue — legal flagged Apr 12',
    'YouTube Content ID dispute on 3 bootleg recordings — GMG Legal in review',
  ],
  revenue_movement: {
    vs_prior_week: '+$14,800',
    vs_prior_week_dir: 'up',
    top_mover: '"Butterfly" stream spike (+38% WoW)',
    surprise: 'ZFM archival drop outperformed projection by 2.4×',
  },
  new_opportunities: [
    'Gaming company sync inquiry — 2 Bassnectar tracks requested for AAA title',
    'Brand collaboration inquiry from major outdoor apparel company for Vasona Blue',
    'European festival booking inquiry (Glastonbury associated) — routing to team',
  ],
  progress_summary: 'Strong week overall. Brand metrics continue upward trajectory. Sync pipeline is the most active it has been since 2018. ZFM performance validates direct fan monetization approach. Touring reactivation timeline remains on track for Q4 2026 soft launch.',
  all_hands_video: null,
};

export const BN_TASKS = [
  { id: 'BT-001', title: '"Butterfly" sync — final negotiation response',   assignee: 'GMG Licensing',  ai: false, status: 'in_progress', priority: 'critical', due: 'Apr 17, 2026', notes: 3, flagged: false, category: 'Sync'     },
  { id: 'BT-002', title: 'ZFM Vault Drop Vol. 2 — production brief',        assignee: 'GMG AI Operator',ai: true,  status: 'in_progress', priority: 'high',     due: 'Apr 18, 2026', notes: 1, flagged: false, category: 'Release'  },
  { id: 'BT-003', title: 'Divergent Spectrum Spotify Marquee campaign setup',assignee: 'GMG Marketing',  ai: false, status: 'open',        priority: 'high',     due: 'Apr 20, 2026', notes: 0, flagged: false, category: 'Campaign' },
  { id: 'BT-004', title: 'Bassnectar Touring LLC — insurance renewal',       assignee: 'GMG Legal',      ai: false, status: 'open',        priority: 'high',     due: 'Apr 19, 2026', notes: 1, flagged: true,  category: 'Legal'    },
  { id: 'BT-005', title: 'YouTube Content ID dispute — 3 tracks',            assignee: 'GMG Legal',      ai: false, status: 'in_progress', priority: 'high',     due: 'Apr 21, 2026', notes: 2, flagged: true,  category: 'Rights'   },
  { id: 'BT-006', title: 'Vasona Blue hoodie restock — vendor follow-up',    assignee: 'GMG Ops',        ai: false, status: 'open',        priority: 'medium',   due: 'Apr 22, 2026', notes: 1, flagged: false, category: 'Ops'      },
  { id: 'BT-007', title: 'Q1 2026 financial statement review',               assignee: 'GMG Finance',    ai: false, status: 'pending',     priority: 'medium',   due: 'Apr 25, 2026', notes: 0, flagged: false, category: 'Finance'  },
  { id: 'BT-008', title: 'EU/UK reactivation market brief — draft',          assignee: 'GMG AI Operator',ai: true,  status: 'open',        priority: 'medium',   due: 'Apr 28, 2026', notes: 0, flagged: false, category: 'Strategy' },
  { id: 'BT-009', title: 'ZFM subscription tier — product spec',             assignee: 'GMG Product',    ai: false, status: 'open',        priority: 'medium',   due: 'Apr 30, 2026', notes: 0, flagged: false, category: 'Product'  },
  { id: 'BT-010', title: 'Gaming sync — respond to AAA inquiry',             assignee: 'GMG Licensing',  ai: false, status: 'open',        priority: 'medium',   due: 'Apr 18, 2026', notes: 0, flagged: false, category: 'Sync'     },
];

export const BN_TIMELINE = [
  {
    month: 'May 2026',
    items: [
      { type: 'campaign',  label: '"Butterfly" Sync — Decision + Activation',          outcome: 'Est. $80K–$220K',        color: '#10B981' },
      { type: 'release',   label: 'ZFM Vault Drop Vol. 2 — Fan Pre-Sale',              outcome: 'Est. $60K–$120K',        color: '#F59E0B' },
      { type: 'campaign',  label: 'Spotify Marquee — Divergent Spectrum',              outcome: 'Est. +40K monthly listeners',color: '#1DB954' },
    ],
  },
  {
    month: 'Jun 2026',
    items: [
      { type: 'merch',     label: 'Vasona Blue Summer Drop — Apparel',                  outcome: 'Est. $35K–$60K',         color: '#06B6D4' },
      { type: 'brand',     label: 'Brand Rehab Phase 2 — Community Expansion',         outcome: 'Target: 50K community',  color: '#F59E0B' },
      { type: 'legal',     label: 'Bassnectar Touring — Entity Reactivation Review',   outcome: 'Decision on booking window',color: '#EF4444' },
    ],
  },
  {
    month: 'Jul 2026',
    items: [
      { type: 'release',   label: 'Archival LP — Target Release Window',               outcome: 'Est. $200K–$400K gross', color: '#10B981' },
      { type: 'campaign',  label: 'Gaming Sync Placements — Q3 Window',                outcome: 'Est. $40K–$90K',         color: '#8B5CF6' },
      { type: 'press',     label: 'Select Press Re-Introduction — Music Media',        outcome: 'Brand visibility recovery',color: '#EC4899' },
    ],
  },
  {
    month: 'Aug 2026',
    items: [
      { type: 'tour',      label: 'Soft Touring Announcement — Target Markets',        outcome: '2 intimate shows possible',color: '#F59E0B' },
      { type: 'campaign',  label: 'ZFM Subscription Tier Launch',                      outcome: 'Est. +$22K/mo recurring', color: '#06B6D4' },
    ],
  },
  {
    month: 'Sep 2026',
    items: [
      { type: 'campaign',  label: 'Fall Catalog Push — Full 28-release promo',         outcome: 'Est. +$18K/mo streaming', color: '#10B981' },
      { type: 'merch',     label: 'Vasona Blue Fall / Winter Collection',              outcome: 'Est. $55K–$90K',          color: '#06B6D4' },
      { type: 'press',     label: 'Q3 Catalog + Brand Review',                         outcome: 'Progress milestone report',color: '#8B5CF6' },
    ],
  },
  {
    month: 'Oct–Dec 2026',
    items: [
      { type: 'tour',      label: 'Live Return — Target 4–6 Shows (Soft Launch)',      outcome: 'Est. $400K–$800K gross',  color: '#F59E0B' },
      { type: 'release',   label: 'Holiday Fan Release / Archive Collection',          outcome: 'Est. $80K–$150K',         color: '#10B981' },
      { type: 'brand',     label: 'Brand Rehab Completion — Phase 3',                  outcome: 'Full public relaunch ready',color: '#EC4899' },
      { type: 'campaign',  label: 'Year-End Catalog Review + 2027 Planning',           outcome: 'Annual valuation update', color: '#06B6D4' },
    ],
  },
];

export const BN_EXPECTED_ANNUAL_OUTCOMES = [
  { label: 'Total Projected Revenue 2026',  value: '$2.4M–$3.8M', color: '#10B981' },
  { label: 'Catalog Value at Year-End',     value: '$7.2M–$9.4M', color: '#06B6D4' },
  { label: 'Monthly Listeners Target',      value: '2.0M+',       color: '#F59E0B' },
  { label: 'Live Return (Soft Launch)',      value: 'Q4 2026',     color: '#8B5CF6' },
];

export const BN_AI_RECOMMENDATIONS = [
  {
    category: 'Catalog Growth',
    urgency: 'critical',
    color: '#10B981',
    verdict: 'ACT WITHIN 48 HOURS',
    title: 'Butterfly sync window is closing',
    body: '"Butterfly" is in final consideration for a Netflix series. Delay or under-negotiation risks losing a $80K–$220K placement. Respond to sync inquiry with counter today.',
    action: 'GMG Licensing to respond by Apr 17. Client approval needed on minimum fee floor.',
  },
  {
    category: 'Revenue',
    urgency: 'high',
    color: '#06B6D4',
    verdict: 'LAUNCH NOW',
    title: 'ZFM Vault Drop Vol. 2 should activate within 30 days',
    body: 'Vol. 1 outperformed projection by 2.4×. Vol. 2 should follow within 30 days while fan momentum is elevated. Projected: $60K–$120K gross in 72 hours.',
    action: 'GMG Product to finalize content selection by Apr 18. Pre-sale page by Apr 22.',
  },
  {
    category: 'Brand',
    urgency: 'high',
    color: '#F59E0B',
    verdict: 'EXECUTE PHASE 2',
    title: 'Brand rehabilitation is ready for Phase 2 community expansion',
    body: 'Phase 1 (private community re-engagement) has achieved 82% of targets. Phase 2 can begin: controlled community growth, new content formats, and select media introductions.',
    action: 'GMG Brand Team to present Phase 2 brief by Apr 21 for client approval.',
  },
  {
    category: 'Fan Intelligence',
    urgency: 'medium',
    color: '#EC4899',
    verdict: 'OPPORTUNITY',
    title: 'Core 25–34 age segment is ready for ZFM subscription upgrade',
    body: 'Fan data shows 34% of ZFM active users are 25–34, with average spend 2.8× higher than other segments. A premium subscription tier at $9.99/mo is projected to convert 8–12% immediately.',
    action: 'Launch ZFM subscription tier as planned for Aug 2026. GMG Product to spec by Apr 30.',
  },
  {
    category: 'Cost Savings',
    urgency: 'medium',
    color: '#A3E635',
    verdict: 'OPTIMIZE',
    title: 'Vasona Blue supply chain consolidation would save ~$8K/mo',
    body: 'Current merch production uses 3 separate vendors. Consolidating to 1 primary + 1 overflow vendor would reduce unit costs by 14–18% and eliminate $8,200/mo in redundant overhead.',
    action: 'GMG Ops to present vendor consolidation proposal by May 5.',
  },
];

export const BN_ACCOUNTING = {
  this_week:    { revenue: '$71,200',  expenses: '$12,800', net: '+$58,400',  dir: 'up'  },
  month_to_date:{ revenue: '$214,400', expenses: '$46,600', net: '+$167,800', dir: 'up'  },
  quarter_to_date:{ revenue: '$692,400',expenses: '$141,200',net: '+$551,200',dir: 'up'  },
  year_to_date: { revenue: '$1,042,600',expenses: '$218,400',net: '+$824,200',dir: 'up'  },
  top_expense_this_month: 'Marketing campaigns — $18,200',
  expense_alert: null,
  revenue_sources: [
    { label: 'Streaming',        pct: 52, color: '#1DB954' },
    { label: 'ZFM / Direct',     pct: 18, color: '#F59E0B' },
    { label: 'Sync',             pct: 14, color: '#06B6D4' },
    { label: 'Merch',            pct: 10, color: '#EC4899' },
    { label: 'Publishing',       pct: 6,  color: '#10B981' },
  ],
};

export const BN_HISTORICAL_REVENUE = [
  { year: '2020', total: 898521.00,  yoy: null,    yoy_pct: null,   is_base: true  },
  { year: '2021', total: 787887.67,  yoy: -110633, yoy_pct: -12.3,  is_base: false },
  { year: '2022', total: 495485.05,  yoy: -292403, yoy_pct: -37.1,  is_base: false },
  { year: '2023', total: 534287.09,  yoy:   38802, yoy_pct:  +7.8,  is_base: false },
  { year: '2024', total: 503017.35,  yoy:  -31270, yoy_pct:  -5.9,  is_base: false },
  { year: '2025', total: 375586.95,  yoy: -127430, yoy_pct: -25.3,  is_base: false },
];

export const BN_REVENUE_2026_QUARTERS = [
  { quarter: 'Q1 2026', total: null, note: 'Pending actuals' },
  { quarter: 'Q2 2026', total: null, note: 'In progress'     },
  { quarter: 'Q3 2026', total: null, note: 'Projected'       },
  { quarter: 'Q4 2026', total: null, note: 'Projected'       },
];

export const BN_SALE_ROOM = {
  for_sale: true,
  sale_effective_date: 'April 15, 2026',
  status_label: 'FOR SALE',
  status_color: '#10B981',

  catalog_rep: 'Nick Terzo',
  catalog_rep_email: 'bn@greatermusicgroupteam.com',
  attorney: 'Peter Paterno · King, Holmes, Paterno & Soriano LLP',

  buyer_readiness: {
    status: 'ready',
    label: 'Buyer Ready',
    detail: 'Confidential information memorandum available. NDAs executed on request. Virtual data room prepared.',
    color: '#10B981',
  },
  diligence_readiness: {
    status: 'in_progress',
    label: 'Diligence: 82% Complete',
    detail: 'Contracts audit in final review. Financial statements Q1 2026 pending CPA sign-off. All other materials available.',
    color: '#F59E0B',
    pct: 82,
  },

  valuation_low: 4_800_000,
  valuation_high: 7_200_000,
  valuation_target: 5_800_000,
  valuation_current: 5_800_000,
  monthly_revenue: 284_600,
  annualized_revenue: 3_415_200,
  multiple: 17,
  growth_modifier: '+2× above base (22% YoY growth + sync pipeline + audience recovery premium)',
  gmg_uplift: 820_000,
  gmg_uplift_label: '+$820K above pre-engagement baseline',
  basis_date: 'Apr 2026',
  nmv_basis: '$284,600 trailing monthly NMV (Apr 2026)',

  valuation_method: {
    trailing_revenue_basis: '$3.415M annualized (Apr 2025 – Apr 2026 avg)',
    multiple_logic: '17× applied to NMV — within market range for high-growth indie electronic catalog with active sync pipeline and brand rehabilitation premium',
    growth_trend_factor: 'Growth premium — 22.4% YoY revenue growth vs 8–11% EDM catalog market avg',
    sync_momentum_factor: 'Sync premium — active pipeline with 6 live inquiries including $80K–$220K Netflix opportunity',
    audience_trend_factor: 'Audience premium — 14 consecutive months of listener growth, 85% of peak recovery without new releases',
    release_activity_factor: 'Release premium — archival vault active, new release in development, Vault Drop Vol. 2 in pre-sale prep',
    cost_optimization_factor: 'Upside — supply chain consolidation and touring reactivation (Q4 2026) not yet reflected in current multiple',
  },

  investment_narrative: {
    artist_significance: 'Bassnectar is one of electronic music\'s most recognized names — a 20+ year career, 2.4B all-time streams, and a genre-defining catalog spanning bass music, dubstep, and experimental electronica. The artist maintains one of the most loyal and engaged fanbases in the independent music world.',
    audience_durability: 'The core audience (25–38 male-skewed, festival-oriented) shows exceptional retention. Streaming has recovered to 85% of pre-2020 peak with no new releases — an extraordinary organic signal. Monthly listeners have grown for 14 consecutive months purely through catalog engagement and fan community activity.',
    sync_potential: 'The catalog is dramatically under-synced relative to its cultural stature. "Butterfly" is in final consideration for a major Netflix series. 6 active inquiries across gaming (AAA), brand, and film. Genre-crossover sonic profile is ideal for action, sports, gaming, and thriller contexts. Estimated $200K–$600K in sync revenue achievable in next 12–24 months.',
    long_tail_revenue: 'With 28 releases and 312 active recordings, the catalog has significant long-tail streaming value. Deep catalog tracks continue to surface organically through algorithmic recommendations. Revenue is diversified across streaming, sync, direct fan sales (ZFM), merchandise, and publishing.',
    merch_touring_adjacency: 'Vasona Blue (merch entity) is active and generating $42K/mo. ZFM fan club generates $18K/mo in direct monetization. Touring entity (Bassnectar Touring LLC) is in holding status with a Q4 2026 soft reactivation target — a significant revenue unlock that is not yet reflected in current valuation.',
    rehab_upside: 'The catalog is currently in a carefully managed brand rehabilitation phase following a 2020 hiatus. Phase 1 (private community re-engagement) is 82% complete. As rehabilitation progresses, each phase is expected to unlock meaningful streaming, press, and touring revenue. A full brand relaunch by H1 2027 could represent a 1.4–1.8× valuation step-change.',
    improvement_underway: 'GMG has already driven $820K in catalog value improvement since engagement began in November 2025. Active improvements include: Spotify Marquee campaigns, sync pipeline development, Vault Drop fan releases, ZFM subscription tier build, entity cost consolidation, and international market reactivation planning.',
  },

  live_value_drivers: [
    {
      label: 'Streaming',
      value: '1.24M monthly listeners',
      delta: '+14 consecutive months of growth',
      color: '#1DB954',
      status: 'strong',
      detail: 'Organic recovery without new releases — algorithmic and community-driven',
    },
    {
      label: 'Audience',
      value: '85% of peak recovery',
      delta: 'Peak was 1.46M · Target: 2M+',
      color: '#06B6D4',
      status: 'growing',
      detail: 'Core 25–38 demographic. Strong Discord and mailing list engagement',
    },
    {
      label: 'Sync Pipeline',
      value: '6 active inquiries',
      delta: '"Butterfly" in final Netflix round',
      color: '#F59E0B',
      status: 'hot',
      detail: 'Film, gaming (AAA), brand, and streaming series. Most active since 2018.',
    },
    {
      label: 'New Releases',
      value: 'ZFM Vault Drop Vol. 1 complete',
      delta: 'Vol. 2 in pre-sale prep',
      color: '#10B981',
      status: 'active',
      detail: 'Vol. 1 generated $31K in 72 hours. Archival LP in development for Q3 2026.',
    },
    {
      label: 'Press + Brand',
      value: 'Phase 1 complete',
      delta: 'Phase 2 brief in review',
      color: '#A3E635',
      status: 'in_progress',
      detail: 'Select editorial placements confirmed. No broad press campaign until Phase 2 approval.',
    },
    {
      label: 'Merch Momentum',
      value: '$42,800/mo (Vasona Blue)',
      delta: 'Summer drop planned Jun 2026',
      color: '#EC4899',
      status: 'active',
      detail: 'Official merchandise and apparel active. Vendor consolidation in progress.',
    },
    {
      label: 'Fan Club (ZFM)',
      value: '$18,200/mo direct',
      delta: '+9% MoM · Subscription tier coming',
      color: '#F59E0B',
      status: 'growing',
      detail: 'Bandcamp, Patreon, and direct sales. Subscription tier launch target Aug 2026.',
    },
    {
      label: 'Social / Cultural Visibility',
      value: 'Organic resurgence signals',
      delta: 'TikTok usage up 34% QoQ',
      color: '#8B5CF6',
      status: 'active',
      detail: 'Catalog being rediscovered on short-form video. No official campaign behind it.',
    },
  ],

  diligence_snapshot: {
    total_releases: 28,
    total_recordings: 312,
    top_song: { title: 'Butterfly', year: '2012', streams_monthly: '4.2M', streams_lifetime: '210M+' },
    top_album: { title: 'Divergent Spectrum', year: '2016', monthly_revenue: '$48,000' },
    rights_status: 'All master recordings 100% owned by Amorphous Music Inc. No co-ownership or reversion clauses.',
    publishing_notes: 'Publishing administered by BMI. Songwriter splits fully documented. No known co-publishing claims beyond standard splits.',
    known_issues: [
      { issue: 'YouTube Content ID dispute — 3 bootleg tracks', severity: 'low', status: 'GMG Legal in review' },
      { issue: 'Bassnectar Touring LLC insurance renewal overdue', severity: 'medium', status: 'Being resolved by Apr 19' },
    ],
    contracts_status: 'Contracts audit 90% complete. All major agreements reviewed. Distribution agreements current. Management and booking agreements in update process.',
    data_room_ready: true,
    nda_required: true,
  },

  buyer_deal_flow: [
    {
      id: 'buyer-001',
      buyer: 'Undisclosed Investment Fund A',
      type: 'Music Catalog Fund',
      stage: 'nda_signed',
      stage_label: 'NDA Signed',
      stage_color: '#F59E0B',
      inquiry_date: 'Mar 28, 2026',
      last_contact: 'Apr 11, 2026',
      note: 'Reviewed executive summary. Requesting full CIM and financial package. Primary interest in streaming + sync upside.',
      next_action: 'Deliver CIM by Apr 18. Schedule management call.',
      interest_level: 'high',
    },
    {
      id: 'buyer-002',
      buyer: 'Undisclosed Strategic Buyer B',
      type: 'Major Label / Catalog Division',
      stage: 'initial_contact',
      stage_label: 'Initial Contact',
      stage_color: '#06B6D4',
      inquiry_date: 'Apr 4, 2026',
      last_contact: 'Apr 9, 2026',
      note: 'Inbound inquiry via industry contact. Expressed interest in catalog + touring rights package. No NDA yet.',
      next_action: 'Execute NDA. Share teaser materials by Apr 17.',
      interest_level: 'medium',
    },
    {
      id: 'buyer-003',
      buyer: 'Undisclosed HNWI Investor C',
      type: 'High Net Worth Individual / Artist Investor',
      stage: 'watching',
      stage_label: 'Watching',
      stage_color: '#6B7280',
      inquiry_date: 'Feb 14, 2026',
      last_contact: 'Mar 3, 2026',
      note: 'Received teaser deck. Has not re-engaged. May circle back after Netflix sync decision.',
      next_action: 'Re-engage post-Netflix decision (est. Apr 18).',
      interest_level: 'low',
    },
  ],

  not_for_sale_message: 'This catalog is not currently available for sale. GMG is actively managing catalog growth, audience development, and value optimization on behalf of the rights holder. If you have an inquiry, please contact the catalog team.',
};

export const BN_COMMS = {
  email: 'bn@greatermusicgroupteam.com',
  description: 'All requests, tasks, updates, and approvals submitted to this address are automatically captured, parsed, and routed by the GMG AI Operator. Submissions are logged, assigned, and tracked within this OS.',
  response_sla: 'All emails acknowledged within 2 hours by AI. Human response within 4 business hours.',
  ai_operator_status: 'active',
  recent_threads: [
    { from: 'Lowell Shapiro (Attorney)',    subject: 'Butterfly Sync — Minimum Fee Review',         time: '2h ago',   unread: true  },
    { from: 'GMG Marketing',               subject: 'Divergent Spectrum campaign brief — ready',    time: '4h ago',   unread: true  },
    { from: 'CAA Music',                   subject: 'EU festival inquiry — routing to team',        time: '8h ago',   unread: false },
    { from: 'ZFM Operations',              subject: 'Vault Drop Vol. 2 content brief submitted',    time: 'Yesterday',unread: false },
  ],
};

// ─── REVENUE PAGE DATA ────────────────────────────────────────────────────────
// PLACEHOLDER: All financial figures are estimates/placeholders.
// Replace with real data from accounting system (QuickBooks, Xero, or Wave).

export const BN_REVENUE_SUMMARY = {
  weekly:    { revenue: 71200,    expenses: 12800,  net: 58400   },
  monthly:   { revenue: 284600,   expenses: 46600,  net: 238000  },
  quarterly: { revenue: 692400,   expenses: 141200, net: 551200  },
  annual:    { revenue: 2820000,  expenses: 580000, net: 2240000 },
};

export const BN_CASH_POSITION = {
  amorphous_checking: 482000,
  vasona_blue:         92400,
  zfm_music:           41800,
  total:              616200,
  note: 'Cash positions as of Apr 14, 2026. PLACEHOLDER — update monthly from actual bank records.',
};

export const BN_UPCOMING_OBLIGATIONS = [
  { label: 'Vendor — Merch Production (Vasona Blue)', amount: 28600,  due: 'Apr 22, 2026', status: 'upcoming', entity: 'Vasona Blue'       },
  { label: 'Legal Retainer — Bloom & Partners',       amount: 12000,  due: 'May 1, 2026',  status: 'upcoming', entity: 'Amorphous Music'   },
  { label: 'Platform Distribution Fees',              amount:  4800,  due: 'May 5, 2026',  status: 'upcoming', entity: 'Amorphous Music'   },
  { label: 'GMG Management Fee',                      amount: 22400,  due: 'May 1, 2026',  status: 'upcoming', entity: 'All Entities'      },
  { label: 'Touring Entity Insurance Renewal',        amount:  3600,  due: 'Apr 30, 2026', status: 'overdue',  entity: 'Bassnectar Touring'},
  { label: 'ZFM Platform Hosting + Tech',             amount:  2200,  due: 'May 1, 2026',  status: 'upcoming', entity: 'ZFM Music'         },
];

export const BN_REVENUE_STREAMS = [
  { label: 'Streaming',            amount: 148040, pct: 52,   color: '#1DB954', detail: 'Spotify, Apple Music, YouTube, Amazon, Tidal' },
  { label: 'ZFM / Direct Digital', amount:  51228, pct: 18,   color: '#F59E0B', detail: 'Bandcamp, ZFM direct sales, archival drops'   },
  { label: 'Sync Licensing',       amount:  39844, pct: 14,   color: '#06B6D4', detail: '2 active placements + 3 pending negotiations'  },
  { label: 'Merch / Consumer',     amount:  28460, pct: 10,   color: '#EC4899', detail: 'Shopify, Vasona Blue, tour merch pipeline'     },
  { label: 'Publishing',           amount:  17076, pct:  6,   color: '#10B981', detail: 'ASCAP, BMI, sub-publishing, YouTube Content ID'},
  { label: 'Touring',              amount:      0, pct:  0,   color: '#3B82F6', detail: 'Dormant — reactivation target Q4 2026'         },
  { label: 'Brand Partnerships',   amount:      0, pct:  0,   color: '#A3E635', detail: '2 partnership conversations in early stage'    },
  { label: 'Other',                amount:   1952, pct:  0.5, color: '#6B7280', detail: 'Miscellaneous licensing, content deals'         },
];

export const BN_COST_BREAKDOWN = [
  { category: 'Marketing Campaigns', amount: 18200, pct: 39, color: '#10B981', vendor: 'Meta, Spotify Ads, Google'        },
  { category: 'Legal & Accounting',  amount: 12000, pct: 26, color: '#06B6D4', vendor: 'Bloom & Partners, GMG Finance'    },
  { category: 'Merch Production',    amount:  6400, pct: 14, color: '#F59E0B', vendor: 'Vasona Blue vendors'              },
  { category: 'Platform & Tech',     amount:  4800, pct: 10, color: '#EC4899', vendor: 'Distribution, ZFM hosting, tools' },
  { category: 'Team & Operations',   amount:  3200, pct:  7, color: '#A3E635', vendor: 'GMG operator time, admin'         },
  { category: 'Touring Entity Hold', amount:  2000, pct:  4, color: '#8B5CF6', vendor: 'Insurance, holding costs'         },
];

export const BN_ENTITY_FINANCIALS = [
  {
    id: 'amorphous-music', name: 'Amorphous Music Inc.', type: 'Master Recording / Catalog',
    color: '#10B981', monthly_revenue: 201400, monthly_expenses: 38200, monthly_net: 163200,
    trend: 'up', trend_pct: '+22%', ytd_revenue: 780000, ytd_expenses: 148000,
    notes: 'Primary revenue entity. All streaming + publishing + sync income flows here.',
  },
  {
    id: 'vasona-blue', name: 'Vasona Blue LLC', type: 'Touring + Merch',
    color: '#06B6D4', monthly_revenue: 42800, monthly_expenses: 28600, monthly_net: 14200,
    trend: 'up', trend_pct: '+8%', ytd_revenue: 162000, ytd_expenses: 109000,
    notes: 'Merch and consumer products. Fulfillment delay this month impacted margins slightly.',
  },
  {
    id: 'zfm-music', name: 'ZFM Music', type: 'Fan Club + Direct Media',
    color: '#F59E0B', monthly_revenue: 18200, monthly_expenses: 4800, monthly_net: 13400,
    trend: 'up', trend_pct: '+31%', ytd_revenue: 54000, ytd_expenses: 14400,
    notes: 'Vault Drop Vol. 1 drove $31K in 72 hours. Growing 9% MoM baseline.',
  },
  {
    id: 'bassnectar-touring', name: 'Bassnectar Touring LLC', type: 'Touring Entity',
    color: '#8B5CF6', monthly_revenue: 0, monthly_expenses: 2100, monthly_net: -2100,
    trend: 'neutral', trend_pct: 'Hold', ytd_revenue: 0, ytd_expenses: 8400,
    notes: 'Dormant. Insurance renewal overdue — flagged. Reactivation: Q4 2026.',
  },
  {
    id: 'bassnectar-inc', name: 'Bassnectar Inc.', type: 'Parent / Production IP',
    color: '#EC4899', monthly_revenue: 22200, monthly_expenses: 11400, monthly_net: 10800,
    trend: 'stable', trend_pct: '+2%', ytd_revenue: 88800, ytd_expenses: 45600,
    notes: 'IP holding and production licensing. Stable base.',
  },
];

export const BN_REVENUE_TREND_6MO = [
  { month: 'Nov', val: 68000  },
  { month: 'Dec', val: 74000  },
  { month: 'Jan', val: 79000  },
  { month: 'Feb', val: 91000  },
  { month: 'Mar', val: 112000 },
  { month: 'Apr', val: 284600 },
];

export const BN_WEEKLY_REVENUE = {
  week_of: 'Week of Apr 7–13, 2026',
  generated: 'Apr 14, 2026 · 8:00 AM PT · GMG AI Operator',
  revenue_this_week: 71200,
  revenue_prior_week: 56400,
  net_change: '+$14,800',
  direction: 'up' as const,
  wins: [
    { label: '"Butterfly" advanced to final sync consideration — Netflix decision expected Apr 18–20', impact: 'Est. $80K–$220K if confirmed' },
    { label: 'Monthly listeners hit 1.24M — highest since 2019, 14th consecutive month of growth',      impact: 'Catalog value signal'       },
    { label: 'ZFM archival vault drop generated $31,200 in first 72 hours',                              impact: '+2.4× projection'          },
    { label: 'Divergent Spectrum LP confirmed on "Late Night Electronic" playlist (2.4M followers)',      impact: 'Est. +$8K/mo streaming'    },
  ],
  issues: [
    { label: 'Vasona Blue hoodie restock delayed — vendor ETA Apr 22',                      impact: 'Est. -$4,200 in delayed revenue' },
    { label: 'Bassnectar Touring entity insurance renewal overdue — legal flagged',          impact: 'Legal risk if not resolved'      },
    { label: 'YouTube Content ID dispute on 3 bootleg recordings — GMG Legal reviewing',    impact: 'Possible revenue recovery pending' },
  ],
  attention: [
    '"Butterfly" sync negotiation requires client approval on minimum fee floor before Apr 17',
    'Touring insurance renewal — attorney needs authorization to proceed by Apr 30',
  ],
};

// ─── CATALOG ASSETS ───────────────────────────────────────────────────────────
// PLACEHOLDER: Stream counts, revenue figures, and growth rates are estimates.
// Replace with real DSP royalty reports and distributor statements.

export type AssetType = 'single' | 'album' | 'ep' | 'compilation' | 'bootleg';
export type AssetStatus = 'active' | 'rising' | 'dormant' | 'priority';
export type RevenueTier = 'high' | 'mid' | 'low' | 'none';
export type AssetOpportunity =
  | 'sync_candidate'
  | 'reactivation'
  | 'playlist_focus'
  | 'merch_tie_in'
  | 'anniversary'
  | 'social_content';

export interface CatalogAsset {
  id: string;
  title: string;
  type: AssetType;
  album: string;
  year: number;
  release_date: string;
  total_streams: number;
  monthly_streams: number;
  monthly_revenue: number;
  annual_revenue: number;
  growth_rate: number;
  status: AssetStatus;
  revenue_tier: RevenueTier;
  sync_readiness: 'ready' | 'potential' | 'not_cleared' | 'pending';
  merch_opportunity: boolean;
  opportunities: AssetOpportunity[];
  label: string;
  peak_streams?: number;
}

export const BN_CATALOG_ASSETS: CatalogAsset[] = [
  {
    id: 'BN-001', title: 'Butterfly', type: 'single', album: 'Vava Voom', year: 2012,
    release_date: 'Feb 14, 2012', total_streams: 48_200_000, monthly_streams: 4_200_000,
    monthly_revenue: 14_700, annual_revenue: 176_400, growth_rate: 38, status: 'priority',
    revenue_tier: 'high', sync_readiness: 'pending', merch_opportunity: true,
    opportunities: ['sync_candidate', 'playlist_focus', 'merch_tie_in', 'social_content'],
    label: 'Amorphous Music', peak_streams: 3_800_000,
  },
  {
    id: 'BN-002', title: 'Divergent Spectrum', type: 'album', album: 'Divergent Spectrum', year: 2016,
    release_date: 'Oct 28, 2016', total_streams: 210_000_000, monthly_streams: 3_100_000,
    monthly_revenue: 10_850, annual_revenue: 130_200, growth_rate: 22, status: 'priority',
    revenue_tier: 'high', sync_readiness: 'ready', merch_opportunity: true,
    opportunities: ['playlist_focus', 'sync_candidate', 'anniversary', 'merch_tie_in'],
    label: 'Amorphous Music', peak_streams: 4_200_000,
  },
  {
    id: 'BN-003', title: 'Lost in the Crowd', type: 'single', album: 'Divergent Spectrum', year: 2016,
    release_date: 'Sep 12, 2016', total_streams: 32_400_000, monthly_streams: 1_840_000,
    monthly_revenue: 6_440, annual_revenue: 77_280, growth_rate: 14, status: 'rising',
    revenue_tier: 'high', sync_readiness: 'ready', merch_opportunity: false,
    opportunities: ['playlist_focus', 'sync_candidate'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-004', title: 'Up All Night', type: 'single', album: 'Vava Voom', year: 2012,
    release_date: 'Mar 5, 2012', total_streams: 28_100_000, monthly_streams: 1_520_000,
    monthly_revenue: 5_320, annual_revenue: 63_840, growth_rate: 8, status: 'active',
    revenue_tier: 'high', sync_readiness: 'ready', merch_opportunity: false,
    opportunities: ['playlist_focus', 'social_content'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-005', title: 'Vava Voom', type: 'album', album: 'Vava Voom', year: 2012,
    release_date: 'May 22, 2012', total_streams: 310_000_000, monthly_streams: 2_800_000,
    monthly_revenue: 9_800, annual_revenue: 117_600, growth_rate: 12, status: 'active',
    revenue_tier: 'high', sync_readiness: 'ready', merch_opportunity: true,
    opportunities: ['playlist_focus', 'anniversary', 'merch_tie_in'],
    label: 'Amorphous Music', peak_streams: 5_100_000,
  },
  {
    id: 'BN-006', title: 'Mixed Methods EP', type: 'ep', album: 'Mixed Methods EP', year: 2010,
    release_date: 'Jun 8, 2010', total_streams: 18_700_000, monthly_streams: 820_000,
    monthly_revenue: 2_870, annual_revenue: 34_440, growth_rate: -4, status: 'dormant',
    revenue_tier: 'mid', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['reactivation', 'social_content'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-007', title: 'Noise vs. Beauty', type: 'album', album: 'Noise vs. Beauty', year: 2014,
    release_date: 'Apr 22, 2014', total_streams: 180_000_000, monthly_streams: 2_200_000,
    monthly_revenue: 7_700, annual_revenue: 92_400, growth_rate: 6, status: 'active',
    revenue_tier: 'high', sync_readiness: 'ready', merch_opportunity: true,
    opportunities: ['playlist_focus', 'anniversary', 'sync_candidate'],
    label: 'Amorphous Music', peak_streams: 3_400_000,
  },
  {
    id: 'BN-008', title: 'Underground Communication', type: 'album', album: 'Underground Communication', year: 2007,
    release_date: 'Nov 18, 2007', total_streams: 62_000_000, monthly_streams: 680_000,
    monthly_revenue: 2_380, annual_revenue: 28_560, growth_rate: -8, status: 'dormant',
    revenue_tier: 'mid', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['reactivation', 'anniversary'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-009', title: 'To the Stars', type: 'single', album: 'Noise vs. Beauty', year: 2014,
    release_date: 'Mar 10, 2014', total_streams: 22_300_000, monthly_streams: 1_060_000,
    monthly_revenue: 3_710, annual_revenue: 44_520, growth_rate: 17, status: 'rising',
    revenue_tier: 'mid', sync_readiness: 'ready', merch_opportunity: false,
    opportunities: ['sync_candidate', 'playlist_focus'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-010', title: 'Freestyle Compilation Vol. 1', type: 'compilation', album: 'Compilation Series', year: 2019,
    release_date: 'Jan 15, 2019', total_streams: 14_400_000, monthly_streams: 480_000,
    monthly_revenue: 1_680, annual_revenue: 20_160, growth_rate: 2, status: 'active',
    revenue_tier: 'low', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['social_content'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-011', title: 'Colorado', type: 'single', album: 'Divergent Spectrum', year: 2016,
    release_date: 'Aug 3, 2016', total_streams: 19_800_000, monthly_streams: 1_100_000,
    monthly_revenue: 3_850, annual_revenue: 46_200, growth_rate: 19, status: 'rising',
    revenue_tier: 'mid', sync_readiness: 'ready', merch_opportunity: true,
    opportunities: ['sync_candidate', 'merch_tie_in', 'playlist_focus'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-012', title: 'Full Spectrum Vol. 1', type: 'compilation', album: 'Full Spectrum Series', year: 2018,
    release_date: 'Jul 20, 2018', total_streams: 11_200_000, monthly_streams: 390_000,
    monthly_revenue: 1_365, annual_revenue: 16_380, growth_rate: -2, status: 'dormant',
    revenue_tier: 'low', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['reactivation'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-013', title: 'Timestretch', type: 'single', album: 'Vava Voom', year: 2012,
    release_date: 'Feb 14, 2012', total_streams: 16_600_000, monthly_streams: 920_000,
    monthly_revenue: 3_220, annual_revenue: 38_640, growth_rate: 5, status: 'active',
    revenue_tier: 'mid', sync_readiness: 'ready', merch_opportunity: false,
    opportunities: ['playlist_focus', 'sync_candidate'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-014', title: 'Laughter Tries to Bury You', type: 'single', album: 'Noise vs. Beauty', year: 2014,
    release_date: 'Apr 22, 2014', total_streams: 9_800_000, monthly_streams: 340_000,
    monthly_revenue: 1_190, annual_revenue: 14_280, growth_rate: -12, status: 'dormant',
    revenue_tier: 'low', sync_readiness: 'not_cleared', merch_opportunity: false,
    opportunities: ['reactivation'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-015', title: 'Speakerbox', type: 'ep', album: 'Speakerbox EP', year: 2005,
    release_date: 'Mar 14, 2005', total_streams: 7_100_000, monthly_streams: 210_000,
    monthly_revenue: 735, annual_revenue: 8_820, growth_rate: -6, status: 'dormant',
    revenue_tier: 'none', sync_readiness: 'not_cleared', merch_opportunity: false,
    opportunities: ['reactivation', 'anniversary'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-016', title: 'Freestyle Bootleg Vol. 3', type: 'bootleg', album: 'Bootleg Series', year: 2015,
    release_date: 'Nov 1, 2015', total_streams: 5_400_000, monthly_streams: 180_000,
    monthly_revenue: 630, annual_revenue: 7_560, growth_rate: 3, status: 'active',
    revenue_tier: 'none', sync_readiness: 'not_cleared', merch_opportunity: false,
    opportunities: ['social_content'],
    label: 'ZFM / Amorphous Music',
  },
  {
    id: 'BN-017', title: 'Underground Communication Vol. 2', type: 'album', album: 'Underground Communication', year: 2009,
    release_date: 'May 5, 2009', total_streams: 44_000_000, monthly_streams: 560_000,
    monthly_revenue: 1_960, annual_revenue: 23_520, growth_rate: -5, status: 'dormant',
    revenue_tier: 'low', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['reactivation', 'anniversary'],
    label: 'Amorphous Music',
  },
  {
    id: 'BN-018', title: 'Freestyle Compilation Vol. 2', type: 'compilation', album: 'Compilation Series', year: 2020,
    release_date: 'Jan 10, 2020', total_streams: 8_200_000, monthly_streams: 290_000,
    monthly_revenue: 1_015, annual_revenue: 12_180, growth_rate: 7, status: 'active',
    revenue_tier: 'low', sync_readiness: 'potential', merch_opportunity: false,
    opportunities: ['social_content', 'reactivation'],
    label: 'Amorphous Music',
  },
];

export const BN_CATALOG_SUMMARY = {
  total_releases: 28,
  total_assets: 312,
  total_streams_all_time: 2_400_000_000,
  total_streams_this_month: 28_000_000,
  avg_monthly_activity: '$284,600',
  highest_song: { title: 'Butterfly', monthly: '4.2M streams/mo' },
  highest_album: { title: 'Divergent Spectrum', monthly: '$10,850/mo' },
  active_count: 18,
  rising_count: 4,
  dormant_count: 8,
  priority_count: 2,
};

// ─── RIGHTS + CONTRACTS DATA ──────────────────────────────────────────────────
// PLACEHOLDER: Split percentages, party names, and doc file references are
// illustrative. Replace with actual rights agreements and CPA-confirmed data.

export const BN_RIGHTS_OVERVIEW = [
  {
    id: 'RGT-001', asset: 'Noise vs. Beauty',          type: 'Master',     ownership: '100%', publisher: 'Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'Fully cleared. Distributed via GMG.', status: 'clean',
  },
  {
    id: 'RGT-002', asset: 'Noise vs. Beauty',          type: 'Publishing', ownership: '100%', publisher: 'Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'Self-published. No co-admin.', status: 'clean',
  },
  {
    id: 'RGT-003', asset: 'Divergent Spectrum',        type: 'Master',     ownership: '100%', publisher: 'Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'Fully cleared.', status: 'clean',
  },
  {
    id: 'RGT-004', asset: 'Divergent Spectrum',        type: 'Publishing', ownership: '85%',  publisher: 'BMI / Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: false, conflicts: false, notes: '15% co-write credit. Split sheet pending final signature.', status: 'review',
  },
  {
    id: 'RGT-005', asset: 'Into The Sun (feat. AR)',   type: 'Master',     ownership: '100%', publisher: 'Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'Feature deal executed. Buyout confirmed.', status: 'clean',
  },
  {
    id: 'RGT-006', asset: 'Into The Sun (feat. AR)',   type: 'Publishing', ownership: '60%',  publisher: 'BMI',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: false, conflicts: true,  notes: 'Co-write dispute unresolved. AR camp claiming 50%. Needs mediation.', status: 'conflict',
  },
  {
    id: 'RGT-007', asset: 'Amorphous',                type: 'Master',     ownership: '100%', publisher: 'Self-Admin',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'Solo composition. All rights retained.', status: 'clean',
  },
  {
    id: 'RGT-008', asset: 'NYE 2019 Live Recordings',  type: 'Master',    ownership: '100%', publisher: 'N/A',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: true,  conflicts: false, notes: 'All performers on work-for-hire agreements. Rights retained.', status: 'clean',
  },
  {
    id: 'RGT-009', asset: 'Bassnectar Catalog Pre-2010', type: 'Master',  ownership: '100%', publisher: 'ASCAP / Self',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: false, conflicts: false, notes: 'Catalog audit in progress. Some split sheets missing from 2007–2009.', status: 'review',
  },
  {
    id: 'RGT-010', asset: 'Freestyle Collab — 2022',  type: 'Publishing', ownership: '50%',  publisher: 'ASCAP',
    territory: 'Worldwide', term: 'Perpetual', splits_locked: false, conflicts: true,  notes: 'Co-author unresponsive. Split sheet unsigned. Do not exploit until resolved.', status: 'conflict',
  },
];

export const BN_SPLITS = [
  { id: 'SPL-001', asset: 'Divergent Spectrum',         party: 'Lorin Ashton',      role: 'Composer / Artist',   pct: '85%',  signed: true,  doc: 'Split-DS-v2.pdf'      },
  { id: 'SPL-002', asset: 'Divergent Spectrum',         party: 'Credited Co-Write', role: 'Co-Writer',           pct: '15%',  signed: false, doc: 'PENDING'              },
  { id: 'SPL-003', asset: 'Into The Sun (feat. AR)',    party: 'Lorin Ashton',      role: 'Composer / Artist',   pct: '60%',  signed: true,  doc: 'Split-ITS-v1.pdf'     },
  { id: 'SPL-004', asset: 'Into The Sun (feat. AR)',    party: 'AR Publishing',     role: 'Co-Writer (Claimed)', pct: '40%',  signed: false, doc: 'DISPUTED'             },
  { id: 'SPL-005', asset: 'Freestyle Collab — 2022',   party: 'Lorin Ashton',      role: 'Composer',            pct: '50%',  signed: true,  doc: 'Split-FC22-v1.pdf'    },
  { id: 'SPL-006', asset: 'Freestyle Collab — 2022',   party: 'Unknown Co-Author', role: 'Co-Writer',           pct: '50%',  signed: false, doc: 'UNSIGNED / MISSING'   },
  { id: 'SPL-007', asset: 'Noise vs. Beauty',          party: 'Lorin Ashton',      role: 'Sole Composer',       pct: '100%', signed: true,  doc: 'Split-NvB-Final.pdf'  },
  { id: 'SPL-008', asset: 'Amorphous',                 party: 'Lorin Ashton',      role: 'Sole Composer',       pct: '100%', signed: true,  doc: 'Split-Amor-Final.pdf' },
];

export const BN_MISSING_DOCS = [
  { id: 'MISS-001', asset: 'Divergent Spectrum',         doc: 'Co-Write Split Sheet (Co-Author Signature)',       priority: 'high',   blocking_payment: true  },
  { id: 'MISS-002', asset: 'Into The Sun (feat. AR)',    doc: 'Publishing Split Resolution / Final Agreement',    priority: 'high',   blocking_payment: true  },
  { id: 'MISS-003', asset: 'Freestyle Collab — 2022',   doc: 'Co-Author Split Sheet + Contact Info',             priority: 'high',   blocking_payment: true  },
  { id: 'MISS-004', asset: 'Catalog Pre-2010',           doc: 'Retroactive Split Sheets (2007–2009)',             priority: 'medium', blocking_payment: false },
  { id: 'MISS-005', asset: 'NYE 2019 Recordings',        doc: 'Session Musician W9s (2 missing)',                 priority: 'medium', blocking_payment: true  },
  { id: 'MISS-006', asset: 'All Active Releases',        doc: 'Mechanical License Confirmations (streaming)',     priority: 'low',    blocking_payment: false },
];

export const BN_CONTRACTS = [
  {
    id: 'CON-001', title: 'GMG Artist Services Agreement',        type: 'Distribution', status: 'active',
    parties: ['Bassnectar (Lorin Ashton)', 'Greater Music Group'], effective: 'Jan 1 2025', expires: 'Dec 31 2026',
    renewal: 'Auto-renew 90-day notice', value: 'Rev Share',       signed: true,  issues: false, notes: 'Primary services agreement. Governs all GMG platform services.',
  },
  {
    id: 'CON-002', title: 'Merchandising Agreement — GMG Merch',  type: 'Merch',        status: 'active',
    parties: ['Bassnectar LLC', 'GMG Merch Division'], effective: 'Mar 1 2025', expires: 'Dec 31 2026',
    renewal: 'Auto-renew 60-day notice', value: '80/20 Royalty',   signed: true,  issues: false, notes: 'Covers all direct merch including tour, core, and catalog lines.',
  },
  {
    id: 'CON-003', title: 'Producer Agreement — Studio Sessions',  type: 'Production',  status: 'active',
    parties: ['Lorin Ashton', 'Session Producer A'], effective: 'Feb 2025', expires: 'Dec 2025',
    renewal: 'Per-project', value: 'Buyout + Points',              signed: true,  issues: false, notes: 'Work-for-hire. Rights fully assigned to Bassnectar LLC.',
  },
  {
    id: 'CON-004', title: 'Feature Deal — Into The Sun (AR)',      type: 'Feature',     status: 'issue',
    parties: ['Bassnectar LLC', 'AR Entertainment LLC'], effective: 'Jun 2024', expires: 'Perpetual',
    renewal: 'N/A', value: 'Buyout Executed',                      signed: false, issues: true,  notes: 'Publishing split unresolved. Feature buyout executed but co-write dispute active. Legal hold on exploitation.',
  },
  {
    id: 'CON-005', title: 'Tour Booking — 2027 Routing',           type: 'Touring',     status: 'pending',
    parties: ['Bassnectar LLC', 'Booking Agency TBD'], effective: 'TBD', expires: 'TBD',
    renewal: 'N/A', value: 'TBD',                                  signed: false, issues: false, notes: 'Agent negotiations in progress. Draft received. Legal review pending.',
  },
  {
    id: 'CON-006', title: 'Sync Licensing — Brand Campaign 2026',  type: 'Sync',        status: 'active',
    parties: ['Bassnectar Music LLC', 'Brand Partner (NDA)'], effective: 'Jan 2026', expires: 'Dec 2026',
    renewal: 'One-time with option', value: '$60K Flat',           signed: true,  issues: false, notes: 'Catalog sync rights granted for single campaign use.',
  },
  {
    id: 'CON-007', title: 'Venue Agreement — NYE 2027',            type: 'Event',       status: 'pending',
    parties: ['Bassnectar LLC', 'Venue TBD'], effective: 'TBD', expires: 'Event Date',
    renewal: 'N/A', value: 'Guarantee + %',                        signed: false, issues: false, notes: 'LOI signed. Final contract in negotiation.',
  },
  {
    id: 'CON-008', title: 'Management Agreement',                  type: 'Management',  status: 'active',
    parties: ['Lorin Ashton', 'Management Co.'], effective: 'Jan 2023', expires: 'Dec 2027',
    renewal: '12-month notice', value: '15% Gross',                signed: true,  issues: false, notes: 'Standard term management deal. Rights audit clause active.',
  },
];

export const BN_CONTRACT_RENEWALS = [
  { id: 'RNW-001', contract: 'GMG Artist Services Agreement', deadline: 'Oct 1 2026',  days_out: 170, action: 'Decision by Oct 1', priority: 'medium' },
  { id: 'RNW-002', contract: 'Merchandising Agreement',       deadline: 'Nov 1 2026',  days_out: 200, action: 'Decision by Nov 1', priority: 'low'    },
  { id: 'RNW-003', contract: 'Producer Agreement',            deadline: 'Nov 1 2025',  days_out: 50,  action: 'Renew or close',    priority: 'high'   },
  { id: 'RNW-004', contract: 'Sync License — Brand Campaign', deadline: 'Dec 31 2026', days_out: 260, action: 'Evaluate renewal',  priority: 'low'    },
];

export const BN_NDA_TRACKING = [
  { id: 'NDA-001', party: 'GMG Staff — Creative Team (6 members)', type: 'NDA',           status: 'signed',  signed_date: 'Jan 2025', expiry: 'Perpetual', scope: 'All catalog, creative, and business materials.'    },
  { id: 'NDA-002', party: 'GMG Staff — Operations (4 members)',    type: 'NDA',           status: 'signed',  signed_date: 'Jan 2025', expiry: 'Perpetual', scope: 'Business operations and financial data.'            },
  { id: 'NDA-003', party: 'Booking Agency (3 agents)',              type: 'NDA',           status: 'signed',  signed_date: 'Feb 2025', expiry: 'Perpetual', scope: 'Routing, fees, and negotiation strategy.'           },
  { id: 'NDA-004', party: 'Vendor — Merch Manufacturer',            type: 'Confidentiality', status: 'signed', signed_date: 'Mar 2025', expiry: 'Perpetual', scope: 'Design files, artwork, product line info.'         },
  { id: 'NDA-005', party: 'Brand Partner (Sync Campaign)',          type: 'NDA',           status: 'signed',  signed_date: 'Dec 2024', expiry: 'Dec 2026',  scope: 'Brand identity, campaign strategy, and deal terms.' },
  { id: 'NDA-006', party: 'Session Producer A',                     type: 'NDA',           status: 'signed',  signed_date: 'Feb 2025', expiry: 'Perpetual', scope: 'Unreleased recordings and session materials.'        },
  { id: 'NDA-007', party: 'Venue Partner — NYE 2027',               type: 'NDA',           status: 'pending', signed_date: '—',        expiry: '—',         scope: 'Event logistics, deal structure, and routing.'      },
  { id: 'NDA-008', party: 'New Business Contact — Inbound',         type: 'NDA',           status: 'pending', signed_date: '—',        expiry: '—',         scope: 'General business discussions.'                      },
];

export const BN_RELEASES_LIABILITY = [
  { id: 'REL-001', doc: 'Session Musician Release — NYE 2019 (12 of 14)', status: 'partial',  notes: '2 session musicians have not returned signed releases. Recordings on hold.'   },
  { id: 'REL-002', doc: 'Photography Release — 2019 Tour (Press)',         status: 'complete', notes: 'All photographers signed. License on file. Cleared for editorial use.'        },
  { id: 'REL-003', doc: 'Fan Footage / UGC Release Pool (500+ clips)',     status: 'complete', notes: 'Blanket UGC clearance agreement in place. GMG legal reviewed.'                },
  { id: 'REL-004', doc: 'Sync Licensee Indemnification (Brand Campaign)',  status: 'complete', notes: 'Indemnification clause active. Brand assumes liability for campaign use.'       },
  { id: 'REL-005', doc: 'Tour Staff / Crew — General Liability Release',   status: 'pending',  notes: 'Template drafted. Not yet distributed to 2027 tour crew.'                      },
];

export const BN_FINANCIAL_DOCS: Array<{
  id: string; party: string; doc: string; status: string;
  blocking_payment: boolean; file?: string; notes: string;
}> = [
  { id: 'FIN-001', party: 'Bassnectar LLC',          doc: 'W9',                          status: 'on_file', blocking_payment: false, file: 'W9-BassnectarLLC-2025.pdf',   notes: 'Current. Valid EIN on file.'                                           },
  { id: 'FIN-002', party: 'Lorin Ashton (Personal)', doc: 'W9',                          status: 'on_file', blocking_payment: false, file: 'W9-Ashton-2025.pdf',           notes: 'Current. SSN/EIN confirmed.'                                           },
  { id: 'FIN-003', party: 'Session Producer A',      doc: 'W9',                          status: 'on_file', blocking_payment: false, file: 'W9-ProdA-2025.pdf',            notes: 'On file. Cleared for payment.'                                         },
  { id: 'FIN-004', party: 'Session Musician 1',      doc: 'W9',                          status: 'missing', blocking_payment: true,  file: undefined,                      notes: 'Not received. Payment BLOCKED until on file.'                          },
  { id: 'FIN-005', party: 'Session Musician 2',      doc: 'W9',                          status: 'missing', blocking_payment: true,  file: undefined,                      notes: 'Not received. Payment BLOCKED until on file.'                          },
  { id: 'FIN-006', party: 'Bassnectar LLC',          doc: 'ACH / Banking',               status: 'on_file', blocking_payment: false, file: 'ACH-BassnectarLLC.pdf',        notes: 'Verified. Direct deposit active.'                                      },
  { id: 'FIN-007', party: 'Lorin Ashton (Personal)', doc: 'ACH / Banking',               status: 'on_file', blocking_payment: false, file: 'ACH-Ashton.pdf',               notes: 'Verified. Direct deposit active.'                                      },
  { id: 'FIN-008', party: 'Session Musician 1',      doc: 'ACH / Banking',               status: 'missing', blocking_payment: true,  file: undefined,                      notes: 'Not received. Payment BLOCKED.'                                        },
  { id: 'FIN-009', party: 'Session Musician 2',      doc: 'ACH / Banking',               status: 'missing', blocking_payment: true,  file: undefined,                      notes: 'Not received. Payment BLOCKED.'                                        },
  { id: 'FIN-010', party: 'AR Entertainment LLC',    doc: 'W9',                          status: 'on_file', blocking_payment: false, file: 'W9-AR-Ent.pdf',                notes: 'On file. Note: publishing dispute active.'                             },
  { id: 'FIN-011', party: 'AR Entertainment LLC',    doc: 'ACH / Banking',               status: 'on_file', blocking_payment: false, file: 'ACH-AR-Ent.pdf',               notes: 'Verified. NOTE: publishing dispute puts royalty payments on LEGAL HOLD.' },
  { id: 'FIN-012', party: 'GMG Merch Division',      doc: 'Invoice — Q1 2026 Merch Revenue',status: 'issued', blocking_payment: false, file: 'INV-GMG-Q1-2026.pdf',       notes: 'Issued Mar 31 2026. Net-30. Due Apr 30 2026.'                          },
  { id: 'FIN-013', party: 'Sync Licensee (Brand)',   doc: 'Invoice — Campaign Sync Fee', status: 'paid',    blocking_payment: false, file: 'INV-Sync-Brand-2026.pdf',      notes: 'Paid Jan 15 2026. $60K. Confirmed received.'                           },
  { id: 'FIN-014', party: 'Session Producer A',      doc: 'Invoice — Studio Sessions',   status: 'paid',    blocking_payment: false, file: 'INV-ProdA-2025.pdf',           notes: 'Paid. Cleared. Archived.'                                              },
];

export const BN_CYBER_PROTECTION = [
  { id: 'CYB-001', area: 'File Storage — Catalog Masters',   status: 'placeholder', note: 'Encrypted cloud storage. Access-controlled. Audit log pending integration.'      },
  { id: 'CYB-002', area: 'Dashboard Access Controls',        status: 'placeholder', note: 'Role-based access via Supabase Auth. 2FA integration planned.'                    },
  { id: 'CYB-003', area: 'Contract + Doc Encryption',        status: 'placeholder', note: 'At-rest encryption active. In-transit TLS enforced. SFTP for file exchange TBD.' },
  { id: 'CYB-004', area: 'NDA + Legal Doc Watermarking',     status: 'placeholder', note: 'Watermark-on-export integration in development.'                                   },
  { id: 'CYB-005', area: 'Intrusion Detection / Monitoring', status: 'placeholder', note: 'Enterprise security audit scheduled Q3 2026.'                                      },
];

// ─── ENTITIES + CONNECTED ACCOUNTS PAGE DATA ─────────────────────────────────
// PLACEHOLDER: Entity names and EINs are real. All financial + operational
// details are placeholders. Replace with verified data from legal / accounting.

export const BN_ENTITIES_DETAIL = [
  {
    id: 'BE-001',
    name: 'Amorphous Music Inc.',
    type: 'Record Label',
    role: 'Master Recording Owner',
    jurisdiction: 'California, USA',
    ein: '— (placeholder)',
    status: 'active',
  },
  {
    id: 'BE-002',
    name: 'Vasona Blue LLC',
    type: 'Merchandise',
    role: 'DTC + Wholesale Merch',
    jurisdiction: 'California, USA',
    ein: '— (placeholder)',
    status: 'active',
  },
  {
    id: 'BE-003',
    name: 'ZFM Music',
    type: 'Music Publisher',
    role: 'Fan Community + Publishing',
    jurisdiction: 'California, USA',
    ein: '— (placeholder)',
    status: 'active',
  },
  {
    id: 'BE-004',
    name: 'Bassnectar Touring LLC',
    type: 'Touring Entity',
    role: 'Live / Touring — Dormant',
    jurisdiction: 'California, USA',
    ein: '— (placeholder)',
    status: 'inactive',
  },
  {
    id: 'BE-005',
    name: 'Bassnectar Inc.',
    type: 'IP Holding Trust',
    role: 'IP + Catalog Asset Holder',
    jurisdiction: 'Nevada, USA',
    ein: '— (placeholder)',
    status: 'active',
  },
];

// PLACEHOLDER: Platform follower counts, sync windows, and last-sync times are
// representative estimates. Replace with live API data from each platform.
export const BN_CONNECTED_ACCOUNTS = [
  {
    id: 'CA-001',
    platform: 'Spotify for Artists',
    type: 'Streaming',
    status: 'connected',
    last_sync: '4m ago',
    data: '1.24M followers · 4.8M streams/mo',
  },
  {
    id: 'CA-002',
    platform: 'Apple Music for Artists',
    type: 'Streaming',
    status: 'connected',
    last_sync: '11m ago',
    data: '820K listeners/mo',
  },
  {
    id: 'CA-003',
    platform: 'YouTube Studio',
    type: 'Video',
    status: 'connected',
    last_sync: '1h ago',
    data: '340K subscribers · 3.2M views/mo',
  },
  {
    id: 'CA-004',
    platform: 'TikTok Business Center',
    type: 'Social',
    status: 'connected',
    last_sync: '18m ago',
    data: '920K followers · catalog sound usage growing',
  },
  {
    id: 'CA-005',
    platform: 'SoundCloud',
    type: 'Streaming',
    status: 'connected',
    last_sync: '2h ago',
    data: '1.8M followers · key legacy audience',
  },
  {
    id: 'CA-006',
    platform: 'Bandcamp (ZFM)',
    type: 'Licensing',
    status: 'connected',
    last_sync: 'Yesterday',
    data: 'Vault drops + direct fan sales active',
  },
  {
    id: 'CA-007',
    platform: 'QuickBooks Online',
    type: 'Accounting',
    status: 'connected',
    last_sync: 'Yesterday',
    data: 'P&L + royalty import active',
  },
  {
    id: 'CA-008',
    platform: 'Instagram Business',
    type: 'Social',
    status: 'connected',
    last_sync: '25m ago',
    data: '580K followers',
  },
  {
    id: 'CA-009',
    platform: 'Amazon Music for Artists',
    type: 'Streaming',
    status: 'pending',
    last_sync: '—',
    data: 'Auth pending — high HD/Unlimited audience',
  },
  {
    id: 'CA-010',
    platform: 'SoundExchange',
    type: 'Royalties',
    status: 'connected',
    last_sync: 'Apr 10, 2026',
    data: 'Digital performance royalties — all entities',
  },
];

// ─── TIMELINE PAGE DATA ───────────────────────────────────────────────────────
// PLACEHOLDER: Revenue targets, dates, and owners are planning estimates only.
// All financial projections should be validated with client and legal before
// being used in any external communications or valuations.

export type BNTimelineItemType =
  | 'release' | 'campaign' | 'sync' | 'merch' | 'touring'
  | 'interview' | 'press' | 'fan_club' | 'brand_rehab' | 'venture'
  | 'partnership' | 'content' | 'legal' | 'finance';

export type BNTimelineItemStatus = 'planned' | 'in_progress' | 'completed' | 'delayed' | 'cancelled';
export type BNTimelinePriority = 'critical' | 'high' | 'medium' | 'low';

export interface BNTimelineItem {
  id: string;
  type: BNTimelineItemType;
  title: string;
  description: string;
  owner: string;
  status: BNTimelineItemStatus;
  priority: BNTimelinePriority;
  expected_outcome: string;
  revenue_label?: string;
  linked_task?: string;
  date_label?: string;
}

export interface BNMonthData {
  month_key: string;
  month_label: string;
  quarter: string;
  items: BNTimelineItem[];
}

export const BN_TIMELINE_DATA: BNMonthData[] = [
  {
    month_key: '2026-01', month_label: 'January 2026', quarter: 'Q1 2026',
    items: [
      {
        id: 'q1-0101', type: 'brand_rehab', title: 'Catalog Onboarding + Baseline Audit',
        description: 'Full catalog audit completed across all 28 releases and 312 recordings. Rights documentation reviewed, entity structure mapped, and GMG operational stack initialized.',
        owner: 'GMG Finance', status: 'completed', priority: 'critical',
        expected_outcome: 'Complete catalog baseline established for valuation and growth planning.',
        date_label: 'Jan 2026',
      },
      {
        id: 'q1-0102', type: 'finance', title: 'Entity Financial Review — All 5 Entities',
        description: 'Financial review of all five business entities: Amorphous Music, ZFM Music, Vasona Blue, Bassnectar Touring LLC, and Bassnectar Inc. Monthly P&L baselines set.',
        owner: 'GMG Finance', status: 'completed', priority: 'high',
        expected_outcome: 'Financial baseline across all entities. Identified $8K/mo cost consolidation target.',
        date_label: 'Jan 2026',
      },
    ],
  },
  {
    month_key: '2026-02', month_label: 'February 2026', quarter: 'Q1 2026',
    items: [
      {
        id: 'q1-0201', type: 'campaign', title: 'Streaming Baseline Campaign — Catalog Reactivation',
        description: 'Initial Spotify editorial outreach and playlist seeding for core catalog. Focused on "Divergent Spectrum" and "Butterfly" as anchor tracks to lift algorithmic performance.',
        owner: 'GMG Marketing', status: 'completed', priority: 'high',
        expected_outcome: 'Monthly listeners grew from 880K to 1.02M. Algorithmic tray placements up 34%.',
        revenue_label: '+$18K/mo streaming lift',
        date_label: 'Feb 2026',
      },
      {
        id: 'q1-0202', type: 'sync', title: 'Sync Pipeline — Initial Outreach',
        description: 'First formal sync outreach conducted to 14 music supervisors across film, TV, and gaming. Catalog one-sheet and stem packages prepared for first time since 2019.',
        owner: 'GMG Licensing', status: 'completed', priority: 'high',
        expected_outcome: '6 active sync inquiries opened within 45 days of initial outreach.',
        date_label: 'Feb–Mar 2026',
      },
    ],
  },
  {
    month_key: '2026-03', month_label: 'March 2026', quarter: 'Q1 2026',
    items: [
      {
        id: 'q1-0301', type: 'fan_club', title: 'ZFM Vault Drop Vol. 1 — Launch',
        description: 'First archival fan release executed through ZFM platform. 4 unreleased tracks made available exclusively to fan community via Bandcamp and direct links.',
        owner: 'GMG AI Operator', status: 'completed', priority: 'critical',
        expected_outcome: '$31,200 generated in first 72 hours. Outperformed projection by 2.4×.',
        revenue_label: '$31,200 in 72 hrs',
        date_label: 'Mar 8, 2026',
      },
      {
        id: 'q1-0302', type: 'brand_rehab', title: 'Brand Rehab Phase 1 — Community Re-Engagement',
        description: 'Controlled re-engagement with core fan community via ZFM Discord and mailing list. No public press. Focus on authentic community warmup ahead of broader reactivation.',
        owner: 'GMG Marketing', status: 'completed', priority: 'high',
        expected_outcome: 'Phase 1 targets 82% achieved. Community NPS improved significantly.',
        date_label: 'Mar 2026',
      },
      {
        id: 'q1-0303', type: 'finance', title: 'Q1 2026 Financial Close + GMG Reporting',
        description: 'End of quarter financial close across all entities. First quarterly GMG performance report delivered to client.',
        owner: 'GMG Finance', status: 'completed', priority: 'medium',
        expected_outcome: 'Q1 total net revenue: $214K across entities. On pace vs projection.',
        revenue_label: '$214K Q1 net',
        date_label: 'Mar 31, 2026',
      },
    ],
  },
  {
    month_key: '2026-04', month_label: 'April 2026', quarter: 'Q2 2026',
    items: [
      {
        id: 't-0401', type: 'sync', title: '"Butterfly" Sync — Final Negotiation',
        description: 'Major Netflix series has advanced "Butterfly" to final round. Negotiation in progress with music supervisor. Decision window: Apr 17–20.',
        owner: 'GMG Licensing', status: 'in_progress', priority: 'critical',
        expected_outcome: 'Confirmed placement in Netflix streaming series.',
        revenue_label: '$80K–$220K', date_label: 'Apr 17–20',
        linked_task: 'BT-001',
      },
      {
        id: 't-0402', type: 'campaign', title: 'Spotify Marquee — Divergent Spectrum',
        description: 'Paid Spotify Marquee campaign targeting listeners of Bassnectar and adjacent electronic artists. Driving catalog streams during peak spring listening window.',
        owner: 'GMG Marketing', status: 'in_progress', priority: 'high',
        expected_outcome: '+$28K–$35K incremental monthly streaming revenue.',
        revenue_label: '+$28K–$35K/mo', date_label: 'Apr 14–30',
      },
      {
        id: 't-0403', type: 'fan_club', title: 'ZFM Vault Drop Vol. 2 — Production Brief',
        description: 'Second archival vault release in production. Building on Vol. 1 performance ($31K in 72 hours). 4 unreleased tracks confirmed.',
        owner: 'GMG AI Operator', status: 'in_progress', priority: 'high',
        expected_outcome: 'Target: $40K–$80K in first 7 days based on Vol. 1 trajectory.',
        revenue_label: '$40K–$80K', date_label: 'Apr 18',
      },
    ],
  },
  {
    month_key: '2026-05', month_label: 'May 2026', quarter: 'Q2 2026',
    items: [
      {
        id: 't-0501', type: 'campaign', title: 'Multi-Asset Discovery Campaign — Live',
        description: 'Cross-catalog paid campaign across Spotify, Meta, and YouTube targeting new listener acquisition. Anchored by "Butterfly" and "Divergent Spectrum".',
        owner: 'GMG Marketing', status: 'planned', priority: 'high',
        expected_outcome: '+1.4M impressions. Est. +$40K incremental monthly revenue across catalog.',
        revenue_label: '+$40K/mo', date_label: 'May 1–31',
      },
      {
        id: 't-0502', type: 'finance', title: 'Q1 Royalty Statement — Final Delivery',
        description: 'Full Q1 2026 royalty reconciliation across all DSPs, publishing, and sync. Delivered to client and attorney for review.',
        owner: 'GMG Finance', status: 'planned', priority: 'high',
        expected_outcome: 'Complete Q1 revenue picture. Identify Q2 optimization targets.',
        date_label: 'May 5',
      },
      {
        id: 't-0503', type: 'sync', title: 'Brand Partnership Sync Pitch Deck',
        description: 'Curated sync pitch targeting premium brands: outdoor / lifestyle, automotive, gaming. "Butterfly", "Vibrate" and 4 additional tracks included.',
        owner: 'GMG Sync Team', status: 'planned', priority: 'medium',
        expected_outcome: '2–3 new brand licensing conversations opened.',
        revenue_label: '$15K–$80K per placement', date_label: 'May 12',
      },
      {
        id: 't-0504', type: 'fan_club', title: 'ZFM Subscription Tier Launch',
        description: 'New paid subscription tier for ZFM community. $9/mo and $79/yr pricing. Access to early releases, archive content, and community forums.',
        owner: 'GMG Ops', status: 'planned', priority: 'medium',
        expected_outcome: 'Target 500 subscribers at launch = +$22K/mo recurring.',
        revenue_label: '+$22K/mo at 500 subs', date_label: 'May 20',
      },
    ],
  },
  {
    month_key: '2026-06', month_label: 'June 2026', quarter: 'Q2 2026',
    items: [
      {
        id: 't-0601', type: 'legal', title: 'Sub-Publishing Agreement Renewal',
        description: 'Current sub-publishing agreement expires Q3 2026. Attorney review in progress. New terms target improved royalty splits and international territory coverage.',
        owner: 'Sarah Bloom, Esq.', status: 'in_progress', priority: 'high',
        expected_outcome: 'Improved international publishing income. Est. +$8K–$14K/mo.',
        revenue_label: '+$8K–$14K/mo', date_label: 'Jun 15',
      },
      {
        id: 't-0602', type: 'campaign', title: 'Summer Catalog Evergreen — 5 Assets',
        description: 'Always-on summer streaming campaign across 5 core catalog assets. Designed to sustain momentum through peak summer listening on Spotify and Apple Music.',
        owner: 'GMG Marketing', status: 'planned', priority: 'medium',
        expected_outcome: 'Baseline streaming revenue maintained / grown through summer.',
        revenue_label: '+$18K–$28K/mo', date_label: 'Jun 1 – Aug 31',
      },
      {
        id: 't-0603', type: 'finance', title: 'Q2 Mid-Year Business Review',
        description: 'Full mid-year financial review: revenue, expenses, catalog valuation update, and 6-month forward plan. Delivered as full PDF report.',
        owner: 'GMG Finance + AI', status: 'planned', priority: 'medium',
        expected_outcome: 'Clear financial picture for H2 planning. Valuation update.',
        date_label: 'Jun 30',
      },
    ],
  },
  {
    month_key: '2026-07', month_label: 'July 2026', quarter: 'Q3 2026',
    items: [
      {
        id: 't-0701', type: 'release', title: 'ZFM Vault Drop Vol. 3 — Archival EP',
        description: 'Third archival vault release: 6-track fan-targeted EP. Limited edition digital and physical formats. Pre-order period begins July 1.',
        owner: 'GMG Ops + AI', status: 'planned', priority: 'high',
        expected_outcome: 'Target $60K–$120K based on prior drops. Streaming chart impact.',
        revenue_label: '$60K–$120K', date_label: 'Jul 15',
      },
      {
        id: 't-0702', type: 'sync', title: 'Gaming Sync Pipeline — AAA Titles',
        description: 'Two confirmed active inquiries from major gaming studios for AAA title soundtracks. Final track selections and licensing terms in negotiation.',
        owner: 'GMG Sync Team', status: 'planned', priority: 'high',
        expected_outcome: '1–2 confirmed gaming sync placements.',
        revenue_label: '$40K–$160K per placement', date_label: 'Jul 1–31',
      },
      {
        id: 't-0703', type: 'content', title: 'TikTok Sound Partnership — Catalog Integration',
        description: 'Structured TikTok catalog partnership for 12 key tracks. Targeted creator seeding, promotional tools, and discovery integration.',
        owner: 'GMG Marketing', status: 'planned', priority: 'medium',
        expected_outcome: '+$12K–$20K/mo from TikTok-driven streaming conversion.',
        revenue_label: '+$12K–$20K/mo', date_label: 'Jul 1',
      },
    ],
  },
  {
    month_key: '2026-08', month_label: 'August 2026', quarter: 'Q3 2026',
    items: [
      {
        id: 't-0801', type: 'finance', title: 'Mid-Year Catalog Valuation Update',
        description: 'Independent valuation update benchmarking current NMV multiple, comparable catalog sales, and projected 12-month trajectory.',
        owner: 'GMG Finance', status: 'planned', priority: 'medium',
        expected_outcome: 'Valuation target: $11.2M–$13.4M at 38–46× NMV.',
        date_label: 'Aug 15',
      },
      {
        id: 't-0802', type: 'release', title: 'New EP — Production Window',
        description: 'Potential new creative EP or single in production discussions. Target: 4–6 tracks, Q4 release strategy TBD pending artist confirmation.',
        owner: 'Artist + GMG A&R', status: 'planned', priority: 'high',
        expected_outcome: 'First new Bassnectar release in 4+ years. Significant catalog reset event.',
        revenue_label: '$200K–$600K launch window', date_label: 'Aug–Sep (TBD)',
      },
      {
        id: 't-0803', type: 'merch', title: 'Fall / Holiday Merch Collection — Design Phase',
        description: 'Design and production of fall / holiday merchandise line. 6–8 SKUs across apparel, accessories, and limited collector items.',
        owner: 'Vasona Blue + GMG', status: 'planned', priority: 'medium',
        expected_outcome: 'Target: $80K–$140K revenue in Q4 merch cycle.',
        revenue_label: '$80K–$140K', date_label: 'Aug 1 – Sep 30',
      },
    ],
  },
  {
    month_key: '2026-09', month_label: 'September 2026', quarter: 'Q3 2026',
    items: [
      {
        id: 't-0901', type: 'campaign', title: 'Fall Catalog Push — Multi-Asset Q4 Ramp',
        description: 'Structured fall re-engagement campaign across top 8 catalog assets ahead of Q4 listening season. Includes playlist re-submission, editorial outreach, and paid ads.',
        owner: 'GMG Marketing', status: 'planned', priority: 'high',
        expected_outcome: '+25% streaming baseline by Oct 1. Est. +$42K/mo.',
        revenue_label: '+$42K/mo', date_label: 'Sep 1–30',
      },
      {
        id: 't-0902', type: 'finance', title: 'Q3 Royalty Statement',
        description: 'Full Q3 royalty reconciliation across all income streams. Delivered with analysis and H2 forecast.',
        owner: 'GMG Finance', status: 'planned', priority: 'medium',
        expected_outcome: 'Q3 financial close. Inform Q4 investment decisions.',
        date_label: 'Sep 30',
      },
      {
        id: 't-0903', type: 'brand_rehab', title: 'Brand Rehabilitation — Phase 2 Assessment',
        description: 'Formal assessment of brand sentiment recovery progress. Includes fan sentiment data, press index, and streaming audience health metrics.',
        owner: 'GMG Brand Team', status: 'planned', priority: 'medium',
        expected_outcome: 'Brand health score target: 78+ (up from 62 in Jan 2025).',
        date_label: 'Sep 15',
      },
    ],
  },
  {
    month_key: '2026-10', month_label: 'October 2026', quarter: 'Q4 2026',
    items: [
      {
        id: 't-1001', type: 'sync', title: 'Holiday Sync Pitch Window — Film + TV',
        description: 'Targeted holiday sync pitch to film, TV, and brand music supervisors. 8 tracks selected for holiday licensing. Timing aligned with music supervisor budget cycles.',
        owner: 'GMG Sync Team', status: 'planned', priority: 'high',
        expected_outcome: '2–4 holiday placements. Est. $60K–$180K.',
        revenue_label: '$60K–$180K', date_label: 'Oct 1–15',
      },
      {
        id: 't-1002', type: 'touring', title: 'Touring Reactivation — Soft Launch Planning',
        description: 'Begin booking process for 2027 touring soft launch. Target: 3–5 headline shows in key markets. CAA routing begins. No public announcement.',
        owner: 'GMG + CAA Music', status: 'planned', priority: 'high',
        expected_outcome: '3–5 confirmed headline shows in H1 2027.',
        revenue_label: '$180K–$480K gross', date_label: 'Oct 1',
      },
      {
        id: 't-1003', type: 'legal', title: 'Annual Contract Review',
        description: 'Annual review of all active agreements: distribution, publishing, merch partnerships, licensing deals, and entity structures.',
        owner: 'Sarah Bloom, Esq.', status: 'planned', priority: 'medium',
        expected_outcome: 'All contracts current. Risk items flagged and addressed.',
        date_label: 'Oct 31',
      },
    ],
  },
  {
    month_key: '2026-11', month_label: 'November 2026', quarter: 'Q4 2026',
    items: [
      {
        id: 't-1101', type: 'campaign', title: 'Holiday Campaign — Full Catalog',
        description: 'Full Q4 / holiday streaming campaign across top 5 catalog assets. Heavy editorial push, paid placements, and fan re-engagement targeting.',
        owner: 'GMG Marketing', status: 'planned', priority: 'high',
        expected_outcome: 'Target peak monthly revenue: $380K–$440K in Dec 2026.',
        revenue_label: '$380K–$440K peak', date_label: 'Nov 1 – Dec 31',
      },
      {
        id: 't-1102', type: 'merch', title: 'Holiday Merch Drop — Limited Edition',
        description: 'Holiday limited edition merch line through Vasona Blue and ZFM. 8 SKUs including exclusive fan bundles and vinyl reissue.',
        owner: 'Vasona Blue', status: 'planned', priority: 'high',
        expected_outcome: 'Target: $90K–$140K in Nov–Dec merch window.',
        revenue_label: '$90K–$140K', date_label: 'Nov 15',
      },
      {
        id: 't-1103', type: 'press', title: 'Strategic Press Placement — Return Narrative',
        description: 'First major press outreach campaign since brand rehab began. Carefully selected publications and interview opportunities supporting the return narrative.',
        owner: 'GMG Brand Team', status: 'planned', priority: 'high',
        expected_outcome: '2–3 major publication placements. Audience sentiment positive shift.',
        date_label: 'Nov 1–30',
      },
    ],
  },
  {
    month_key: '2026-12', month_label: 'December 2026', quarter: 'Q4 2026',
    items: [
      {
        id: 't-1201', type: 'finance', title: 'Year-End Business Review + Valuation',
        description: 'Full 12-month performance review: revenue, catalog valuation, brand health, sync activity, and 2027 operating plan. Comprehensive PDF delivered.',
        owner: 'GMG Finance + AI', status: 'planned', priority: 'high',
        expected_outcome: 'Complete 2026 financial picture. Set 2027 investment strategy.',
        date_label: 'Dec 31',
      },
      {
        id: 't-1202', type: 'brand_rehab', title: 'Brand Rehab — Phase 3 Milestone',
        description: 'Target milestone: brand health score 85+. Fan sentiment positive majority. Touring announcement readiness confirmed.',
        owner: 'GMG Brand Team', status: 'planned', priority: 'high',
        expected_outcome: 'Brand cleared for full public reactivation and touring announcement.',
        date_label: 'Dec 31',
      },
    ],
  },
  {
    month_key: '2027-01', month_label: 'January 2027', quarter: 'Q1 2027',
    items: [
      {
        id: 't-2701', type: 'campaign', title: 'New Year Catalog Reset Campaign',
        description: 'Structured new-year catalog push targeting playlist reset algorithms and new listener acquisition. Coordinated across Spotify, Apple, YouTube, and TikTok.',
        owner: 'GMG Marketing', status: 'planned', priority: 'medium',
        expected_outcome: '+18–24% streaming baseline growth in Q1 vs Q4 2026.',
        date_label: 'Jan 1–31',
      },
      {
        id: 't-2702', type: 'sync', title: 'Q1 Sync Pitch Slate — 2027',
        description: '12-track Q1 2027 sync pitch to film, TV, brand, and gaming supervisors. New catalog data and placement history included.',
        owner: 'GMG Sync Team', status: 'planned', priority: 'medium',
        expected_outcome: '3–5 new sync placement conversations.',
        date_label: 'Jan 15',
      },
      {
        id: 't-2703', type: 'touring', title: 'Touring Announcement — Public Launch',
        description: 'First public touring announcement. 4–6 headline shows confirmed. Press release, fan community announcement, and ticket on-sale coordination.',
        owner: 'GMG + CAA + Vasona Blue', status: 'planned', priority: 'critical',
        expected_outcome: 'Ticket sales. Industry signal of full brand reactivation. Catalog streaming spike.',
        revenue_label: '$250K–$600K gross first run', date_label: 'Jan (TBD)',
      },
    ],
  },
  {
    month_key: '2027-02', month_label: 'February 2027', quarter: 'Q1 2027',
    items: [
      {
        id: 't-2801', type: 'finance', title: 'Annual Catalog Audit',
        description: 'Full 24-month performance audit since GMG engagement. Revenue growth, catalog value appreciation, and opportunity pipeline review.',
        owner: 'GMG Finance', status: 'planned', priority: 'medium',
        expected_outcome: 'Full ROI picture. Benchmark for next engagement period.',
        date_label: 'Feb 28',
      },
      {
        id: 't-2802', type: 'partnership', title: 'Brand Partnership Expansion — 2027 Slate',
        description: 'Outreach to 8–12 target brand partners for 2027 campaign collaborations. Outdoor, lifestyle, gaming, and beverage verticals.',
        owner: 'GMG Partnerships', status: 'planned', priority: 'medium',
        expected_outcome: '2–3 confirmed brand partnerships generating $60K–$180K.',
        revenue_label: '$60K–$180K', date_label: 'Feb 1',
      },
    ],
  },
  {
    month_key: '2027-03', month_label: 'March 2027', quarter: 'Q1 2027',
    items: [
      {
        id: 't-2901', type: 'legal', title: 'Voltage Sessions EP Co-Pub Renewal',
        description: 'Co-publishing agreement on Voltage Sessions EP expires Mar 2027. Renegotiation window open. Target: full ownership or improved split.',
        owner: 'Sarah Bloom, Esq.', status: 'planned', priority: 'high',
        expected_outcome: 'Improved or full publishing ownership. +$4K–$8K/mo.',
        revenue_label: '+$4K–$8K/mo', date_label: 'Mar 31',
      },
      {
        id: 't-2902', type: 'campaign', title: 'Spring Streaming Campaign + Tour Support',
        description: 'Spring catalog push coordinated with tour announcement momentum. Amplifying discovery around announced tour markets.',
        owner: 'GMG Marketing', status: 'planned', priority: 'high',
        expected_outcome: 'Tour announcement streaming spike converted to sustained growth.',
        date_label: 'Mar 1–31',
      },
    ],
  },
];

// PLACEHOLDER: All outcome milestones and financial projections are planning
// targets only. Do not use externally without validation.
export const BN_EXPECTED_OUTCOMES_DATA = {
  revenue: {
    label: 'Revenue Growth',
    color: '#10B981',
    current: '$284,600/mo',
    target: '$420K–$480K/mo',
    detail: 'Projected monthly revenue by Dec 2026, driven by sync placements, ZFM vault drops, campaign ROI, and touring pre-sales.',
    milestones: [
      { label: 'Q2 2026 target', value: '$320K/mo',  color: '#10B981' },
      { label: 'Q3 2026 target', value: '$360K/mo',  color: '#F59E0B' },
      { label: 'Q4 2026 target', value: '$440K/mo',  color: '#06B6D4' },
      { label: 'Q1 2027 target', value: '$480K+/mo', color: '#3B82F6' },
    ],
  },
  valuation: {
    label: 'Catalog Valuation',
    color: '#06B6D4',
    current: '$9.8M (34× NMV)',
    target: '$13.4M–$16.2M',
    detail: 'Projected catalog valuation by Q1 2027 based on revenue growth trajectory and market multiple expansion from brand reactivation.',
    milestones: [
      { label: 'Mid-2026',        value: '$11.2M', color: '#10B981' },
      { label: 'End 2026',        value: '$13.4M', color: '#F59E0B' },
      { label: 'Q1 2027',         value: '$16.2M', color: '#06B6D4' },
      { label: 'Target multiple', value: '44–52×', color: '#3B82F6' },
    ],
  },
  audience: {
    label: 'Audience Growth',
    color: '#F59E0B',
    current: '1.24M monthly listeners',
    target: '2.4M–3.2M monthly listeners',
    detail: 'Projected monthly listeners by Q1 2027 driven by campaign activity, tour announcement, vault drops, and organic recovery.',
    milestones: [
      { label: 'Q2 2026', value: '1.6M',  color: '#10B981' },
      { label: 'Q3 2026', value: '1.9M',  color: '#F59E0B' },
      { label: 'Q4 2026', value: '2.4M',  color: '#06B6D4' },
      { label: 'Q1 2027', value: '3.2M+', color: '#3B82F6' },
    ],
  },
  sync: {
    label: 'Sync Revenue Goals',
    color: '#A3E635',
    current: '$28K/mo avg',
    target: '$80K–$180K/placement',
    detail: 'Active sync pipeline with 6+ active inquiries. "Butterfly" Netflix placement in final round. Gaming pipeline opening. Holiday sync window target: $60K–$180K.',
    milestones: [
      { label: '"Butterfly" placement',    value: '$80K–$220K',  color: '#10B981' },
      { label: 'Gaming sync (×2)',         value: '$80K–$320K',  color: '#F59E0B' },
      { label: 'Holiday film/TV (×2–4)',   value: '$60K–$180K',  color: '#06B6D4' },
      { label: '12-month sync total goal', value: '$300K–$900K', color: '#A3E635' },
    ],
  },
  merch: {
    label: 'Merch Revenue Goals',
    color: '#EC4899',
    current: '$42K/mo (Vasona Blue + ZFM)',
    target: '$140K–$200K peak month',
    detail: 'Merch growth driven by ZFM vault drops, holiday collection, and touring merchandise when live shows launch in Q1 2027.',
    milestones: [
      { label: 'ZFM vault drops (×3)',  value: '$160K–$320K total', color: '#10B981' },
      { label: 'Holiday merch window', value: '$90K–$140K',         color: '#F59E0B' },
      { label: 'Tour merch (Q1 2027)', value: '$120K–$280K',        color: '#06B6D4' },
      { label: '12-month merch total', value: '$480K–$820K',        color: '#EC4899' },
    ],
  },
  touring: {
    label: 'Touring Goals',
    color: '#3B82F6',
    current: 'Dormant — reactivation underway',
    target: '4–6 headline shows Q1 2027',
    detail: 'Touring entity reactivation following brand rehab completion. CAA routing begins Oct 2026. Public announcement target Jan 2027.',
    milestones: [
      { label: 'Booking begins',       value: 'Oct 2026',    color: '#10B981' },
      { label: 'Dates confirmed',      value: '4–6 shows',   color: '#F59E0B' },
      { label: 'Public announcement',  value: 'Jan 2027',    color: '#06B6D4' },
      { label: 'Gross revenue target', value: '$250K–$600K', color: '#3B82F6' },
    ],
  },
  brand: {
    label: 'Brand Rehab Goals',
    color: '#8B5CF6',
    current: 'Brand health score: 62 (Apr 2026)',
    target: 'Brand health score: 85+ by Dec 2026',
    detail: 'Structured brand rehabilitation through private community reactivation, controlled press, and fan sentiment management. Touring announcement readiness target: Q4 2026.',
    milestones: [
      { label: 'Phase 1 complete',      value: 'Score 70+', color: '#10B981' },
      { label: 'Phase 2 assessment',    value: 'Sep 2026',  color: '#F59E0B' },
      { label: 'Press campaign launch', value: 'Nov 2026',  color: '#06B6D4' },
      { label: 'Full reactivation',     value: 'Dec 2026',  color: '#8B5CF6' },
    ],
  },
};

// ─── CAMPAIGNS PAGE DATA ──────────────────────────────────────────────────────
// PLACEHOLDER: Campaign budgets, impressions, and ROI figures are planning
// estimates. Replace with live Ad Manager / DSP data when campaigns go live.

export const BN_CAMPAIGNS = [
  {
    id: 'C-001',
    name: 'Spotify Marquee — Divergent Spectrum',
    asset: 'Divergent Spectrum',
    status: 'active',
    budget: 8400,
    spent: 3820,
    impressions: '3.2M',
    clicks: '128K',
    streams: '+184K',
    start: 'Apr 14',
    end: 'May 5',
    channel: 'Spotify Marquee',
    roi: '12.4×',
  },
  {
    id: 'C-002',
    name: 'Meta Discovery — Butterfly',
    asset: 'Butterfly (2012)',
    status: 'active',
    budget: 4200,
    spent: 1960,
    impressions: '1.8M',
    clicks: '62K',
    streams: '+98K',
    start: 'Apr 14',
    end: 'Apr 30',
    channel: 'Meta Ads',
    roi: '8.6×',
  },
  {
    id: 'C-003',
    name: 'YouTube Catalog Evergreen — 5 Assets',
    asset: 'Multi-asset',
    status: 'active',
    budget: 3200,
    spent: 980,
    impressions: '980K',
    clicks: '34K',
    streams: '+42K',
    start: 'Apr 10',
    end: 'May 31',
    channel: 'YouTube Ads',
    roi: '5.8×',
  },
  {
    id: 'C-004',
    name: 'Multi-Asset Discovery Campaign — Q2',
    asset: 'Multi-asset',
    status: 'planned',
    budget: 18000,
    spent: 0,
    impressions: '—',
    clicks: '—',
    streams: '—',
    start: 'May 1',
    end: 'May 31',
    channel: 'Spotify + Meta + YouTube',
    roi: '—',
  },
  {
    id: 'C-005',
    name: 'TikTok Sound Seeding — Catalog Integration',
    asset: '12 key tracks',
    status: 'planned',
    budget: 6000,
    spent: 0,
    impressions: '—',
    clicks: '—',
    streams: '—',
    start: 'Jul 1',
    end: 'Jul 31',
    channel: 'TikTok Business',
    roi: '—',
  },
  {
    id: 'C-006',
    name: 'ZFM Fan Reactivation Campaign',
    asset: 'ZFM Vault Drops',
    status: 'planned',
    budget: 2400,
    spent: 0,
    impressions: '—',
    clicks: '—',
    streams: '—',
    start: 'May 15',
    end: 'Jun 15',
    channel: 'Email + Meta',
    roi: '—',
  },
  {
    id: 'C-007',
    name: 'Spring Catalog Push — Spotify Editorial',
    asset: 'Cozza Frenzy LP',
    status: 'completed',
    budget: 3800,
    spent: 3800,
    impressions: '1.4M',
    clicks: '52K',
    streams: '+76K',
    start: 'Mar 1',
    end: 'Mar 31',
    channel: 'Spotify Ads',
    roi: '9.2×',
  },
];

// ─── MEETINGS + REPORTS PAGE DATA ────────────────────────────────────────────
// PLACEHOLDER: Meeting dates and participants are structural placeholders.
// Replace with real calendar data when client management system is connected.

export const BN_MEETINGS = [
  {
    id: 'MT-001',
    title: 'Monthly Operations Review',
    with: 'Client + GMG Catalog Team',
    date: 'Apr 22, 2026',
    time: '2:00 PM PT',
    type: 'ops',
    status: 'scheduled',
    notes: 'Q1 revenue walkthrough, timeline review, sync pipeline update, ZFM vault drop debrief',
  },
  {
    id: 'MT-002',
    title: '"Butterfly" Sync — Negotiation Update',
    with: 'GMG Licensing + Sarah Bloom, Esq.',
    date: 'Apr 17, 2026',
    time: '11:00 AM PT',
    type: 'licensing',
    status: 'scheduled',
    notes: 'Netflix final-round decision window. Decision expected Apr 17–20.',
  },
  {
    id: 'MT-003',
    title: 'Sub-Publishing Agreement Renewal',
    with: 'GMG Legal + Sarah Bloom, Esq.',
    date: 'Jun 15, 2026',
    time: '10:00 AM PT',
    type: 'legal',
    status: 'tentative',
    notes: 'Territory renewal negotiation — current agreement expires Q3 2026',
  },
  {
    id: 'MT-004',
    title: 'Q1 2026 Royalty Statement Review',
    with: 'GMG Finance',
    date: 'May 5, 2026',
    time: '3:00 PM PT',
    type: 'finance',
    status: 'scheduled',
    notes: 'Full Q1 royalty reconciliation. Delivered to client and attorney.',
  },
  {
    id: 'MT-005',
    title: 'Brand Rehab Strategy Session — Phase 2',
    with: 'GMG Brand Team + Client',
    date: 'Sep 15, 2026',
    time: '1:00 PM PT',
    type: 'business',
    status: 'tentative',
    notes: 'Brand health score assessment. Press campaign readiness review.',
  },
];

export const BN_REPORTS = [
  {
    id: 'RP-001',
    title: 'March 2026 Monthly Report — Bassnectar Catalog',
    date: 'Apr 5, 2026',
    type: 'monthly',
    status: 'published',
    pages: 16,
  },
  {
    id: 'RP-002',
    title: 'Q1 2026 Quarterly Review — Amorphous Music',
    date: 'Apr 10, 2026',
    type: 'quarterly',
    status: 'published',
    pages: 32,
  },
  {
    id: 'RP-003',
    title: '"Butterfly" Sync Pitch — Asset Impact Report',
    date: 'Apr 12, 2026',
    type: 'asset',
    status: 'published',
    pages: 10,
  },
  {
    id: 'RP-004',
    title: 'April 2026 Monthly Report',
    date: 'May 5, 2026',
    type: 'monthly',
    status: 'upcoming',
    pages: 0,
  },
  {
    id: 'RP-005',
    title: 'Catalog Valuation Update — Mid-2026',
    date: 'May 15, 2026',
    type: 'valuation',
    status: 'upcoming',
    pages: 0,
  },
  {
    id: 'RP-006',
    title: 'ZFM Vault Drop Vol. 2 — Performance Report',
    date: 'Apr 25, 2026',
    type: 'asset',
    status: 'upcoming',
    pages: 0,
  },
];
