export const CATALOG_META = {
  name: 'Velocity Music Catalog',
  owner: 'Velocity Records LLC',
  contact: 'Marcus Vance — VP Operations',
  assets_total: 214,
  years_span: '2011–2024',
  last_audited: 'Mar 31, 2026',
  health_score: 82,
  client_since: 'Feb 2024',
  territory: 'Worldwide',
  currency: 'USD',
};

export const CATALOG_OVERVIEW = {
  total_value: '$4.2M',
  total_value_raw: 4200000,
  monthly_revenue: '$148,400',
  monthly_revenue_raw: 148400,
  annual_revenue_raw: 1540000,
  growth_rate: '+18.4%',
  growth_dir: 'up',
  royalty_yield: '3.6%',
  multiplier: '28x',
  top_assets: 4,
  avg_multiple_market: '24x',
};

export const OVERVIEW_STATS = [
  { id: 'value',    label: 'Catalog Value',     value: '$4.2M',    delta: '+$420K YTD',  dir: 'up',      color: '#10B981', sub: 'Est. NMV' },
  { id: 'revenue',  label: 'Monthly Revenue',   value: '$148,400', delta: '+18.4%',      dir: 'up',      color: '#06B6D4', sub: 'April 2026' },
  { id: 'yield',    label: 'Royalty Yield',     value: '3.6%',     delta: '+0.4pp',      dir: 'up',      color: '#F59E0B', sub: 'Annual NMV' },
  { id: 'multiple', label: 'Revenue Multiple',  value: '28×',      delta: 'vs 24× avg',  dir: 'up',      color: '#3B82F6', sub: 'Catalog multiple' },
  { id: 'assets',   label: 'Active Assets',     value: '214',      delta: '4 outperform',dir: 'neutral', color: '#A3E635', sub: 'Songs / projects' },
];

export const CATALOG_SIGNALS = [
  { id: 'CS-001', type: 'Song Resurgence', asset: '"Midnight Frequency" (2018)', platform: 'Spotify', magnitude: '+1,840%', magnitude_raw: 1840, level: 'critical', ts: '8m ago', what: '"Midnight Frequency" has surged 1,840% in streams over 5 days.', why: 'Netflix limited series used the song in its finale episode.', next: 'Activate a targeted ad campaign within 24 hours to capture discovery traffic.' },
  { id: 'CS-002', type: 'Playlist Velocity', asset: '"Golden Static" (2021)', platform: 'Spotify / Apple Music', magnitude: '+47 playlists', magnitude_raw: 47, level: 'critical', ts: '1h ago', what: '"Golden Static" has been added to 47 playlists in 4 days.', why: 'Playlist curator momentum at this velocity historically precedes algorithmic amplification.', next: 'Submit to Spotify for Artists editorial immediately.' },
  { id: 'CS-003', type: 'Sync Opportunity', asset: '"Ashen Roads" (2019)', platform: 'Musicbed / Sync', magnitude: '3 inbound requests', magnitude_raw: 3, level: 'high', ts: '3h ago', what: '3 inbound sync licensing requests received.', why: 'Sync placements would generate $8,000–$35,000 per placement.', next: 'Route to sync licensing team with urgency flag.' },
  { id: 'CS-004', type: 'Catalog Spike', asset: 'Full Catalog', platform: 'TikTok', magnitude: '+220% sound uses', magnitude_raw: 220, level: 'high', ts: '6h ago', what: 'Overall catalog TikTok sound usage is up 220% this week.', why: 'TikTok virality creates downstream Spotify/Apple streaming spikes.', next: 'Monitor for streaming conversion. Prepare ad campaigns.' },
];

export const REVENUE_BREAKDOWN = {
  total: 148400,
  streams: [
    { month: 'Nov', val: 68000 },
    { month: 'Dec', val: 74000 },
    { month: 'Jan', val: 79000 },
    { month: 'Feb', val: 91000 },
    { month: 'Mar', val: 112000 },
    { month: 'Apr', val: 148400 },
  ],
  sources: [
    { source: 'Streaming',     amount: 82400,  pct: 55, color: '#06B6D4' },
    { source: 'Publishing',    amount: 29600,  pct: 20, color: '#10B981' },
    { source: 'Sync',          amount: 22400,  pct: 15, color: '#F59E0B' },
    { source: 'Merch / Other', amount: 14000,  pct: 10, color: '#3B82F6' },
  ],
  platforms: [
    { name: 'Spotify',     pct: 44, val: 65280,  color: '#1DB954' },
    { name: 'Apple Music', pct: 22, val: 32650,  color: '#FC3C44' },
    { name: 'YouTube',     pct: 14, val: 20780,  color: '#FF0000' },
    { name: 'Amazon',      pct: 11, val: 16320,  color: '#FF9900' },
    { name: 'Other',       pct: 9,  val: 13370,  color: '#6B7280' },
  ],
};

export const ASSETS = [
  { id: 'A-001', title: 'Midnight Frequency',  year: 2018, streams: 4820000, revenue: 28400, growth: 1840, status: 'rising',    sync: true,  type: 'Single', isrc: 'USRC12345001', label: 'Velocity', territory: 'WW' },
  { id: 'A-002', title: 'Golden Static',        year: 2021, streams: 2940000, revenue: 18100, growth:   47, status: 'rising',    sync: false, type: 'Single', isrc: 'USRC12345002', label: 'Velocity', territory: 'WW' },
  { id: 'A-003', title: 'Hollow City LP',       year: 2020, streams: 8400000, revenue: 44200, growth:   12, status: 'stable',    sync: false, type: 'Album',  isrc: 'USRC12345003', label: 'Velocity', territory: 'WW' },
  { id: 'A-004', title: 'Ashen Roads',          year: 2019, streams:  610000, revenue:  3800, growth:   -8, status: 'declining', sync: true,  type: 'Single', isrc: 'USRC12345004', label: 'Velocity', territory: 'WW' },
  { id: 'A-005', title: 'Voltage Sessions EP',  year: 2022, streams: 1820000, revenue: 11400, growth:   29, status: 'rising',    sync: false, type: 'EP',     isrc: 'USRC12345005', label: 'Velocity', territory: 'WW' },
  { id: 'A-006', title: 'Cut the Wire',         year: 2016, streams:  380000, revenue:  2200, growth:  -14, status: 'declining', sync: false, type: 'Single', isrc: 'USRC12345006', label: 'Velocity', territory: 'NA' },
  { id: 'A-007', title: 'Depth Charge',         year: 2023, streams: 3200000, revenue: 19800, growth:   61, status: 'rising',    sync: false, type: 'Single', isrc: 'USRC12345007', label: 'Velocity', territory: 'WW' },
  { id: 'A-008', title: 'Fracture Point LP',    year: 2017, streams: 5100000, revenue: 31600, growth:    4, status: 'stable',    sync: true,  type: 'Album',  isrc: 'USRC12345008', label: 'Velocity', territory: 'WW' },
];

export const OPPORTUNITIES = [
  { id: 'OP-001', type: 'Resurgence', asset: 'Midnight Frequency', headline: 'Netflix placement — capitalize on discovery window', detail: 'Netflix sync placement is generating organic streams. A targeted digital ad campaign ($2K–5K) can 5–10x discovery conversion during this 2–3 week peak window.', impact: 'Est. $40K–$80K in incremental streaming revenue', urgency: 'critical', cta: 'Launch Campaign' },
  { id: 'OP-002', type: 'Licensing',  asset: 'Ashen Roads',        headline: '3 active sync licensing inquiries — fast window', detail: 'Two advertising agencies and one streaming platform have requested sync licensing. Combined potential: $24,000–$105,000 in placement fees.', impact: 'Est. $24K–$105K in sync fees', urgency: 'high', cta: 'Review Requests' },
  { id: 'OP-003', type: 'Optimization', asset: 'Cut the Wire (2016)', headline: 'Catalog reactivation opportunity', detail: 'Declining asset with no active promotion. Metadata audit + playlist re-submission could recover 15–25% of lost streaming share.', impact: 'Est. +$800/mo with $500 investment', urgency: 'medium', cta: 'Start Audit' },
  { id: 'OP-004', type: 'Optimization', asset: 'Hollow City LP', headline: "Catalog's highest-earning asset has no active marketing", detail: 'Hollow City LP generates the most revenue but has zero active campaigns. A $3K–8K evergreen ad campaign can grow its streaming baseline 20–35%.', impact: 'Est. +$9K–$15K/mo incremental', urgency: 'medium', cta: 'Build Campaign' },
];

export const RIGHTS = [
  { id: 'R-001', asset: 'Hollow City LP',      ownership: '100%', rights_type: 'Master + Publishing', deal: 'Fully owned',          territory: 'Worldwide',      expires: 'Perpetual', status: 'clean'    },
  { id: 'R-002', asset: 'Midnight Frequency',  ownership: '80%',  rights_type: 'Master',              deal: 'Co-ownership agreement', territory: 'Worldwide',     expires: 'Dec 2028',  status: 'clean'    },
  { id: 'R-003', asset: 'Fracture Point LP',   ownership: '65%',  rights_type: 'Master only',         deal: 'Label rev-share',       territory: 'North America',  expires: 'Jun 2026',  status: 'expiring' },
  { id: 'R-004', asset: 'Ashen Roads',         ownership: '100%', rights_type: 'Master + Publishing', deal: 'Fully owned',          territory: 'Worldwide',      expires: 'Perpetual', status: 'clean'    },
  { id: 'R-005', asset: 'Voltage Sessions EP', ownership: '50%',  rights_type: 'Publishing only',     deal: 'Co-pub agreement',      territory: 'Worldwide',     expires: 'Mar 2027',  status: 'review'   },
];

export const AI_INSIGHTS = [
  { id: 1, urgency: 'critical', verdict: 'HOLD — Undervalued',   asset: 'Full Catalog',           insight: 'This catalog is trading at 28× NMV. Current sync placement activity and TikTok velocity suggest a 34–40× valuation is achievable within 12–18 months.', action: 'Do not sell. Activate catalog marketing plan now. Estimated value increase: +$840K–$1.4M.', confidence: 92, icon: 'hold' },
  { id: 2, urgency: 'critical', verdict: 'ACT NOW',              asset: 'Midnight Frequency',     insight: 'Netflix placement generated 1,840% streaming spike. This is a 2–3 week discovery window. Without immediate marketing activation, 80% of traffic will not convert.', action: "Launch $3K–5K digital ad campaign targeting the song's streaming audience. Estimated ROI: 12–18×.", confidence: 88, icon: 'push' },
  { id: 3, urgency: 'high',     verdict: 'OPTIMIZE',             asset: 'Cut the Wire + Ashen Roads', insight: 'Two declining assets represent $6K+/month in lost potential revenue. Combined metadata, playlist, and ad investment of $2K could recover and grow both.', action: 'Allocate $1K per asset to reactivation. Expected recovery: $4K–$8K/month within 90 days.', confidence: 74, icon: 'optimize' },
  { id: 4, urgency: 'medium',   verdict: 'BUY — Adjacent Asset', asset: 'Catalog Expansion',      insight: 'Current catalog multiple (28×) is outperforming category average (24×). Market conditions favor acquiring adjacent assets at 20–22× NMV.', action: 'Begin acquisition screening. Target: Alt-R&B / Electronic catalogs with 2018–2022 releases and 1M+ stream base.', confidence: 71, icon: 'buy' },
];

export const TASKS = [
  { id: 'T-001', title: 'Launch Midnight Frequency ad campaign', assignee: 'GMG Marketing', due: 'Apr 16, 2026', priority: 'critical', status: 'in_progress', category: 'Campaign', asset: 'Midnight Frequency' },
  { id: 'T-002', title: 'Respond to 3 sync licensing inquiries', assignee: 'GMG Licensing', due: 'Apr 17, 2026', priority: 'high',     status: 'open',        category: 'Licensing', asset: 'Ashen Roads' },
  { id: 'T-003', title: 'Q1 royalty statement review',            assignee: 'Client',        due: 'Apr 20, 2026', priority: 'high',     status: 'pending',     category: 'Finance',  asset: 'Full Catalog' },
  { id: 'T-004', title: 'Submit Golden Static to Spotify editorial', assignee: 'GMG A&R',   due: 'Apr 15, 2026', priority: 'high',     status: 'in_progress', category: 'Playlist', asset: 'Golden Static' },
  { id: 'T-005', title: 'Metadata audit — Cut the Wire',          assignee: 'GMG Ops',       due: 'Apr 22, 2026', priority: 'medium',   status: 'open',        category: 'Ops',      asset: 'Cut the Wire' },
  { id: 'T-006', title: 'Renew Fracture Point LP territory deal',  assignee: 'GMG Legal',    due: 'May 10, 2026', priority: 'high',     status: 'open',        category: 'Legal',    asset: 'Fracture Point LP' },
  { id: 'T-007', title: 'Build Hollow City LP evergreen campaign', assignee: 'GMG Marketing',due: 'Apr 28, 2026', priority: 'medium',   status: 'open',        category: 'Campaign', asset: 'Hollow City LP' },
  { id: 'T-008', title: 'Fan intelligence data pull — Q2',        assignee: 'GMG Analytics', due: 'Apr 30, 2026', priority: 'low',      status: 'open',        category: 'Research', asset: 'Full Catalog' },
];

export const TIMELINE_MONTHS = [
  {
    month: 'May 2026', items: [
      { type: 'campaign', label: 'Midnight Frequency — Discovery Campaign Live', color: '#10B981' },
      { type: 'deadline', label: 'Q1 Royalty Statement Finalized',               color: '#F59E0B' },
      { type: 'pitch',    label: 'Sync Pitch Deck — Brand Partnerships',         color: '#06B6D4' },
    ]
  },
  {
    month: 'Jun 2026', items: [
      { type: 'legal',    label: 'Fracture Point LP — Deal Renewal Window',      color: '#EF4444' },
      { type: 'campaign', label: 'Hollow City LP — Evergreen Ads Launch',        color: '#10B981' },
      { type: 'report',   label: 'Q2 Mid-Year Business Review',                  color: '#8B5CF6' },
    ]
  },
  {
    month: 'Jul 2026', items: [
      { type: 'campaign', label: 'Voltage Sessions EP — Summer Campaign',        color: '#10B981' },
      { type: 'pitch',    label: 'TikTok Catalog Sound Partnership',             color: '#06B6D4' },
    ]
  },
  {
    month: 'Aug 2026', items: [
      { type: 'report',   label: 'Mid-Year Valuation Update',                    color: '#8B5CF6' },
      { type: 'release',  label: 'Potential New Single Drop Window',             color: '#A3E635' },
    ]
  },
  {
    month: 'Sep 2026', items: [
      { type: 'campaign', label: 'Fall Catalog Push — Multi-Asset',              color: '#10B981' },
      { type: 'deadline', label: 'Q3 Royalty Statement',                         color: '#F59E0B' },
    ]
  },
  {
    month: 'Oct 2026', items: [
      { type: 'pitch',    label: 'Holiday Sync Pitch Window',                    color: '#06B6D4' },
      { type: 'legal',    label: 'Annual Contract Review',                       color: '#EF4444' },
    ]
  },
  {
    month: 'Nov 2026', items: [
      { type: 'campaign', label: 'Holiday Campaign — Top 5 Assets',             color: '#10B981' },
      { type: 'merch',    label: 'Merch Drop — Hollow City Anniversary',         color: '#F59E0B' },
    ]
  },
  {
    month: 'Dec 2026', items: [
      { type: 'report',   label: 'Year-End Business Review + Valuation',         color: '#8B5CF6' },
      { type: 'deadline', label: 'Q4 Royalty Statement',                         color: '#F59E0B' },
    ]
  },
  {
    month: 'Jan 2027', items: [
      { type: 'campaign', label: 'New Year Catalog Reset Campaign',              color: '#10B981' },
      { type: 'pitch',    label: 'Q1 Sync Pitch Slate',                         color: '#06B6D4' },
    ]
  },
  {
    month: 'Feb 2027', items: [
      { type: 'report',   label: 'Annual Catalog Audit',                         color: '#8B5CF6' },
    ]
  },
  {
    month: 'Mar 2027', items: [
      { type: 'deadline', label: 'Voltage Sessions EP — Co-pub Renewal',         color: '#EF4444' },
      { type: 'campaign', label: 'Spring Streaming Campaign',                    color: '#10B981' },
    ]
  },
  {
    month: 'Apr 2027', items: [
      { type: 'report',   label: 'Q1 2027 Annual Summary',                       color: '#8B5CF6' },
      { type: 'pitch',    label: 'Brand Partnership Review',                     color: '#06B6D4' },
    ]
  },
];

export const CAMPAIGNS = [
  { id: 'C-001', name: 'Midnight Frequency Discovery',  asset: 'Midnight Frequency',  status: 'active',    budget: 4200,  spent: 1840,  impressions: '2.1M', clicks: '84K', streams: '+142K',  start: 'Apr 14', end: 'May 5',   channel: 'Meta + Spotify', roi: '14.2x' },
  { id: 'C-002', name: 'Golden Static Playlist Push',   asset: 'Golden Static',       status: 'active',    budget: 1500,  spent: 680,   impressions: '880K', clicks: '31K', streams: '+48K',   start: 'Apr 12', end: 'Apr 28',  channel: 'Spotify Ads',    roi: '9.8x' },
  { id: 'C-003', name: 'Hollow City Evergreen',         asset: 'Hollow City LP',      status: 'planned',   budget: 6000,  spent: 0,     impressions: '—',    clicks: '—',   streams: '—',      start: 'May 1',  end: 'Jun 30',  channel: 'Meta + YouTube', roi: '—' },
  { id: 'C-004', name: 'Voltage Sessions Summer',       asset: 'Voltage Sessions EP', status: 'planned',   budget: 2800,  spent: 0,     impressions: '—',    clicks: '—',   streams: '—',      start: 'Jul 1',  end: 'Aug 15',  channel: 'TikTok + Meta',  roi: '—' },
  { id: 'C-005', name: 'Depth Charge Growth',           asset: 'Depth Charge',        status: 'completed', budget: 3200,  spent: 3200,  impressions: '1.6M', clicks: '62K', streams: '+91K',   start: 'Mar 1',  end: 'Mar 31',  channel: 'Meta',           roi: '11.4x' },
];

export const FAN_INTELLIGENCE = {
  total_listeners: 4800000,
  monthly_listeners: 1240000,
  top_cities: [
    { city: 'Los Angeles',   country: 'US', pct: 12, listeners: 148800 },
    { city: 'New York',      country: 'US', pct: 10, listeners: 124000 },
    { city: 'London',        country: 'UK', pct: 8,  listeners: 99200  },
    { city: 'Toronto',       country: 'CA', pct: 6,  listeners: 74400  },
    { city: 'Sydney',        country: 'AU', pct: 5,  listeners: 62000  },
    { city: 'Berlin',        country: 'DE', pct: 4,  listeners: 49600  },
    { city: 'Chicago',       country: 'US', pct: 4,  listeners: 49600  },
    { city: 'Mexico City',   country: 'MX', pct: 3,  listeners: 37200  },
  ],
  demographics: [
    { age: '18–24', pct: 28, color: '#10B981' },
    { age: '25–34', pct: 34, color: '#06B6D4' },
    { age: '35–44', pct: 21, color: '#F59E0B' },
    { age: '45–54', pct: 11, color: '#3B82F6' },
    { age: '55+',   pct: 6,  color: '#6B7280' },
  ],
  gender: [
    { label: 'Male',   pct: 52, color: '#06B6D4' },
    { label: 'Female', pct: 44, color: '#10B981' },
    { label: 'Other',  pct: 4,  color: '#6B7280' },
  ],
  top_playlists: [
    { name: 'Late Night Vibes',       followers: '2.1M',  added: 'Apr 12, 2026', editorial: true  },
    { name: 'Indie Electronic',       followers: '890K',  added: 'Apr 9, 2026',  editorial: false },
    { name: 'New Music Friday — Alt', followers: '4.8M',  added: 'Apr 5, 2026',  editorial: true  },
    { name: 'Chill Instrumental',     followers: '1.2M',  added: 'Mar 28, 2026', editorial: false },
  ],
};

export const TOURING = {
  upcoming: [
    { id: 'TU-001', event: 'Velocity Summer Showcase',    venue: 'Hollywood Bowl',      city: 'Los Angeles',  date: 'Jul 18, 2026', type: 'headline',  capacity: 17500, status: 'confirmed', revenue_est: '$280K' },
    { id: 'TU-002', event: 'Fractured Frequencies Tour',  venue: 'Terminal 5',          city: 'New York',     date: 'Aug 2, 2026',  type: 'headline',  capacity: 3000,  status: 'confirmed', revenue_est: '$48K' },
    { id: 'TU-003', event: 'UK Fall Dates',               venue: 'O2 Academy Brixton',  city: 'London',       date: 'Sep 14, 2026', type: 'headline',  capacity: 4921,  status: 'in_nego',   revenue_est: '$72K' },
    { id: 'TU-004', event: 'Electric Island Festival',    venue: 'Sunset Park',         city: 'Toronto',      date: 'Jul 4, 2026',  type: 'festival',  capacity: 25000, status: 'confirmed', revenue_est: '$60K' },
  ],
  past_year: [
    { id: 'TP-001', event: 'Spring Club Tour',           city: 'Chicago / LA / NYC',    date: 'Mar 2026',     gross: '$124K',  attendance: '92%' },
    { id: 'TP-002', event: 'SXSW Showcase',              city: 'Austin',                date: 'Mar 2026',     gross: '$18K',   attendance: '100%' },
    { id: 'TP-003', event: 'Coachella Slot',             city: 'Indio, CA',             date: 'Apr 2026',     gross: '$200K',  attendance: '100%' },
  ],
  agent: { name: 'Claire Osei',      agency: 'CAA Music',           email: 'cosei@caa.com' },
  manager: { name: 'Drew Holloway', agency: 'Pinnacle Artist Mgmt', email: 'drew@pinnaclemgmt.com' },
};

export const BRAND_HEALTH = {
  overall_score: 78,
  dimensions: [
    { label: 'Streaming Momentum',  score: 88, color: '#10B981', delta: '+12' },
    { label: 'Social Reach',        score: 72, color: '#06B6D4', delta: '+4'  },
    { label: 'Press Coverage',      score: 64, color: '#F59E0B', delta: '-2'  },
    { label: 'Playlist Presence',   score: 81, color: '#3B82F6', delta: '+9'  },
    { label: 'Fan Engagement',      score: 69, color: '#A3E635', delta: '+1'  },
    { label: 'Sync Activity',       score: 74, color: '#EC4899', delta: '+18' },
  ],
  social: [
    { platform: 'Instagram',  followers: '380K', growth_30d: '+4.2%', color: '#EC4899' },
    { platform: 'TikTok',     followers: '920K', growth_30d: '+18.4%',color: '#06B6D4' },
    { platform: 'YouTube',    followers: '240K', growth_30d: '+2.1%', color: '#FF0000' },
    { platform: 'Spotify',    followers: '1.24M',growth_30d: '+6.8%', color: '#1DB954' },
    { platform: 'X / Twitter',followers: '88K',  growth_30d: '+0.4%', color: '#6B7280' },
  ],
  press: [
    { outlet: 'Pitchfork',    headline: '"Velocity Music Catalog Defies Streaming Gravity"', date: 'Apr 8, 2026',  sentiment: 'positive' },
    { outlet: 'Billboard',    headline: '"Midnight Frequency Enters Chart Resurgence"',      date: 'Apr 11, 2026', sentiment: 'positive' },
    { outlet: 'Rolling Stone',headline: '"Legacy Catalogs Are Having a Moment"',             date: 'Mar 28, 2026', sentiment: 'positive' },
  ],
};

export const INVENTORY = [
  { id: 'M-001', item: 'Hollow City LP — Vinyl Reissue',   category: 'Vinyl',      qty_on_hand: 840,  qty_sold_ytd: 2400, revenue_ytd: '$72,000',  status: 'active',  low_stock: false },
  { id: 'M-002', item: 'Velocity Logo Tee',                category: 'Apparel',    qty_on_hand: 320,  qty_sold_ytd: 1800, revenue_ytd: '$45,000',  status: 'active',  low_stock: false },
  { id: 'M-003', item: 'Midnight Frequency Limited Print', category: 'Art Print',  qty_on_hand: 42,   qty_sold_ytd: 580,  revenue_ytd: '$34,800',  status: 'active',  low_stock: true  },
  { id: 'M-004', item: 'Fracture Point Tour Hoodie',       category: 'Apparel',    qty_on_hand: 180,  qty_sold_ytd: 920,  revenue_ytd: '$46,000',  status: 'active',  low_stock: false },
  { id: 'M-005', item: 'Depth Charge Single Cassette',     category: 'Physical',   qty_on_hand: 0,    qty_sold_ytd: 400,  revenue_ytd: '$8,000',   status: 'sold_out',low_stock: true  },
  { id: 'M-006', item: 'Hollow City Enamel Pin Set',       category: 'Accessories',qty_on_hand: 1200, qty_sold_ytd: 3400, revenue_ytd: '$34,000',  status: 'active',  low_stock: false },
];

export const CONTRACTS = [
  { id: 'CT-001', title: 'GMG Catalog Management Agreement', parties: ['Velocity Records LLC', 'GMG'],          effective: 'Feb 1, 2024',  expires: 'Jan 31, 2027', status: 'active',   type: 'Management',   value: '$24K/yr' },
  { id: 'CT-002', title: 'Co-Ownership — Midnight Frequency', parties: ['Velocity Records', 'Jordan Ellis'],    effective: 'Jan 1, 2022',  expires: 'Dec 31, 2028', status: 'active',   type: 'Co-Ownership', value: '80/20 split' },
  { id: 'CT-003', title: 'Fracture Point LP — Label Rev-Share',parties: ['Velocity Records', 'Apex Recordings'],effective: 'Oct 1, 2019', expires: 'Jun 30, 2026', status: 'expiring', type: 'Distribution', value: '65% retain'  },
  { id: 'CT-004', title: 'Voltage Sessions — Co-Pub Deal',    parties: ['Velocity Publishing', 'BMI Affiliate'],effective: 'Mar 15, 2022', expires: 'Mar 14, 2027', status: 'active',   type: 'Publishing',   value: '50/50 admin' },
  { id: 'CT-005', title: 'CAA Touring Agreement',             parties: ['Velocity Records', 'CAA Music'],       effective: 'Jan 1, 2025',  expires: 'Dec 31, 2026', status: 'active',   type: 'Touring',      value: '10% commission' },
];

export const MEETINGS = [
  { id: 'MT-001', title: 'Monthly Operations Review',   with: 'Marcus Vance + GMG Team', date: 'Apr 22, 2026', time: '2:00 PM PT', type: 'ops',       status: 'scheduled', notes: 'Q1 revenue, campaign performance, 12-mo plan review' },
  { id: 'MT-002', title: 'Sync Licensing Call',         with: 'GMG Licensing Team',      date: 'Apr 17, 2026', time: '11:00 AM PT',type: 'licensing',  status: 'scheduled', notes: 'Review 3 active sync inquiries for Ashen Roads' },
  { id: 'MT-003', title: 'Deal Renewal — Fracture LP',  with: 'GMG Legal + Apex Music',  date: 'May 5, 2026',  time: '10:00 AM PT',type: 'legal',      status: 'tentative', notes: 'Territory renewal negotiation — Jun 2026 deadline' },
  { id: 'MT-004', title: 'Q1 Royalty Statement Review', with: 'GMG Finance',             date: 'Apr 20, 2026', time: '3:00 PM PT', type: 'finance',    status: 'scheduled', notes: 'Statement distribution and Q2 projections' },
  { id: 'MT-005', title: 'Brand Partnership Pitch',     with: 'GMG x Brand Partners',    date: 'Apr 30, 2026', time: '1:00 PM PT', type: 'business',   status: 'tentative', notes: 'TikTok catalog partnership and apparel licensing' },
];

export const REPORTS = [
  { id: 'RP-001', title: 'March 2026 Monthly Report',       date: 'Apr 5, 2026',  type: 'monthly',    status: 'published', pages: 14 },
  { id: 'RP-002', title: 'Q1 2026 Quarterly Review',        date: 'Apr 10, 2026', type: 'quarterly',  status: 'published', pages: 28 },
  { id: 'RP-003', title: 'Midnight Frequency Impact Report',date: 'Apr 12, 2026', type: 'asset',      status: 'published', pages: 8  },
  { id: 'RP-004', title: 'April 2026 Monthly Report',       date: 'May 5, 2026',  type: 'monthly',    status: 'upcoming',  pages: 0  },
  { id: 'RP-005', title: 'Catalog Valuation Update',        date: 'May 15, 2026', type: 'valuation',  status: 'upcoming',  pages: 0  },
];

export const BUSINESS_ENTITIES = [
  { id: 'BE-001', name: 'Velocity Records LLC',    type: 'Record Label',      role: 'Master Owner',          jurisdiction: 'Delaware, USA',    status: 'active',  ein: '87-1234567' },
  { id: 'BE-002', name: 'Velocity Publishing Co.', type: 'Music Publisher',   role: 'Publishing Owner',      jurisdiction: 'California, USA',   status: 'active',  ein: '87-7654321' },
  { id: 'BE-003', name: 'Velocity Touring LLC',    type: 'Touring Entity',    role: 'Live / Touring',        jurisdiction: 'California, USA',   status: 'active',  ein: '87-9988776' },
  { id: 'BE-004', name: 'Velocity Merch Co.',      type: 'Merchandise',       role: 'DTC + Wholesale',       jurisdiction: 'California, USA',   status: 'active',  ein: '87-1122334' },
  { id: 'BE-005', name: 'VRC Holdings Trust',      type: 'IP Holding Trust',  role: 'Catalog Asset Holder',  jurisdiction: 'Nevada, USA',       status: 'active',  ein: '—' },
];

export const CONNECTED_ACCOUNTS = [
  { id: 'CA-001', platform: 'Spotify for Artists',  type: 'Streaming',    status: 'connected', last_sync: '2m ago',      data: '1.24M followers, 4.8M streams/mo' },
  { id: 'CA-002', platform: 'Apple Music for Artists', type: 'Streaming', status: 'connected', last_sync: '8m ago',      data: '820K listeners/mo' },
  { id: 'CA-003', platform: 'YouTube Studio',        type: 'Video',       status: 'connected', last_sync: '1h ago',      data: '240K subs, 2.1M views/mo' },
  { id: 'CA-004', platform: 'TikTok Business Center',type: 'Social',      status: 'connected', last_sync: '14m ago',     data: '920K followers, 18.4% growth' },
  { id: 'CA-005', platform: 'Musicbed Sync Portal',  type: 'Licensing',   status: 'connected', last_sync: '3h ago',      data: '3 active requests' },
  { id: 'CA-006', platform: 'Stripe Atlas',          type: 'Finance',     status: 'connected', last_sync: 'Yesterday',   data: 'Merch revenue linked' },
  { id: 'CA-007', platform: 'QuickBooks Online',     type: 'Accounting',  status: 'connected', last_sync: 'Yesterday',   data: 'P&L + royalty import active' },
  { id: 'CA-008', platform: 'Instagram Business',    type: 'Social',      status: 'connected', last_sync: '22m ago',     data: '380K followers' },
  { id: 'CA-009', platform: 'Amazon Music',          type: 'Streaming',   status: 'pending',   last_sync: '—',           data: 'Auth pending' },
  { id: 'CA-010', platform: 'SoundExchange',         type: 'Royalties',   status: 'connected', last_sync: 'Apr 10, 2026',data: 'Digital performance royalties' },
];

export const SALE_ROOM = {
  status: 'hold',
  current_valuation: 4200000,
  target_valuation: 5600000,
  multiple_current: 28,
  multiple_target: 37,
  catalysts: [
    { label: 'Netflix Sync Placement Active',      status: 'live',    impact: '+$420K est. value uplift' },
    { label: 'TikTok Velocity Window (60 days)',   status: 'live',    impact: '+$280K est. value uplift' },
    { label: 'Hollow City LP Evergreen Campaign',  status: 'planned', impact: '+$140K est. on execution' },
    { label: 'Fracture LP Deal Renewal',           status: 'pending', impact: 'Critical — affects 65% ownership' },
    { label: 'Fan Audience Growth (1.24M→2M)',     status: 'ongoing', impact: '+$560K est. at target' },
  ],
  comparable_sales: [
    { catalog: 'Alt-Electronic Catalog A',  sold: 'Feb 2026', multiple: '31x', value: '$3.8M', notes: 'Similar era, lower streams' },
    { catalog: 'Indie-R&B Catalog B',       sold: 'Nov 2025', multiple: '26x', value: '$2.1M', notes: 'Smaller asset count' },
    { catalog: 'Electronic Artist Catalog', sold: 'Jan 2026', multiple: '34x', value: '$6.2M', notes: 'Higher TikTok presence' },
  ],
  buyer_activity: [
    { buyer: 'Hipgnosis / HQ', type: 'Institutional', inquiry_date: 'Mar 2026', status: 'inactive', note: 'Expressed interest at 24x NMV' },
    { buyer: 'Round Hill Music', type: 'Institutional', inquiry_date: 'Jan 2026', status: 'inactive', note: 'Monitoring — watching resurgence' },
    { buyer: 'Undisclosed PE',   type: 'Private Equity', inquiry_date: 'Feb 2026', status: 'watching', note: 'Tracking catalog metrics' },
  ],
  gmg_recommendation: 'HOLD. Current market momentum positions this catalog for a 34–40× NMV sale within 12–18 months with proper execution. Premature exit at 28× would leave an estimated $840K–$1.4M on the table.',
};
