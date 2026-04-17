export const EXEC_PRIORITIES = [
  { id: 1, label: 'Resolve Nova Blaze distribution block before EOD', urgency: 'critical', owner: 'Operations', due: 'Today 5PM' },
  { id: 2, label: 'Sign off on ZEAL Vol.2 campaign budget ($28K)', urgency: 'high', owner: 'Finance', due: 'Today 3PM' },
  { id: 3, label: 'Review Aria Cross sync deal — expires in 48h', urgency: 'high', owner: 'Legal', due: 'Apr 10' },
];

export const ACTIVE_RISKS = [
  { id: 1, label: 'Drift Current — Distribution block, Day 12', level: 'critical', est_impact: '-$33.6K/mo', owner: 'Ops / Legal' },
  { id: 2, label: 'Campaign C-0041 CTR at 0.8% — budget burning', level: 'high', est_impact: '-$3,100 wasted', owner: 'Campaigns' },
  { id: 3, label: 'Vex Hollow — Manager unresponsive (10 days)', level: 'medium', est_impact: 'Release delayed', owner: 'A&R' },
];

export const DECISIONS_NEEDED = [
  { id: 1, label: 'Approve KAEZO outreach — 48h acquisition window', type: 'A&R', urgency: 'critical' },
  { id: 2, label: 'Authorize Creative Rotation — Campaign C-0041', type: 'Campaign', urgency: 'high' },
  { id: 3, label: 'Approve Q2 Merch Budget Extension (+$12K)', type: 'Finance', urgency: 'medium' },
];

export const GLOBAL_SIGNALS = [
  { id: 'SIG-001', artist: 'Nova Blaze', asset: 'Voltage Dreams', type: 'Stream Spike', magnitude: 847, unit: '%', platform: 'Spotify', geo: 'US · UK', action: 'Accelerate campaign spend — momentum window is open', level: 'critical', ts: '2m ago' },
  { id: 'SIG-002', artist: 'ZEAL', asset: 'ZEAL Vol. 1', type: 'Playlist Add', magnitude: 12, unit: 'playlists', platform: 'Spotify', geo: 'US', action: 'Contact playlist curators — pitch Vol. 2 pre-release', level: 'high', ts: '11m ago' },
  { id: 'SIG-003', artist: 'KAEZO', asset: 'Untitled (viral)', type: 'Social Velocity', magnitude: 1240, unit: '%', platform: 'TikTok', geo: 'NG · UK · US', action: 'Immediate outreach — sign window closes in 48h', level: 'critical', ts: '18m ago' },
  { id: 'SIG-004', artist: 'Aria Cross', asset: 'Glass Architecture', type: 'Geographic Surge', magnitude: 280, unit: '%', platform: 'Apple Music', geo: 'Brazil', action: 'Launch geo-targeted DSP ad campaign in BR', level: 'high', ts: '34m ago' },
  { id: 'SIG-005', artist: 'SOLACE', asset: 'Midnight Signal EP', type: 'Sync Inquiry', magnitude: 3, unit: 'inquiries', platform: 'Sync', geo: '—', action: 'Route to licensing team — TV sync, high-value placement', level: 'medium', ts: '1h ago' },
  { id: 'SIG-006', artist: 'ZEAL', asset: 'Campaign C-0038', type: 'Campaign Surge', magnitude: 3.4, unit: '% CTR', platform: 'Meta', geo: 'US', action: 'Increase daily budget by 20% — peak ROAS window', level: 'high', ts: '2h ago' },
  { id: 'SIG-007', artist: 'Maeven', asset: 'Catalog (2022–24)', type: 'Catalog Revival', magnitude: 145, unit: '%', platform: 'YouTube', geo: 'DE · FR', action: 'Re-pitch catalog to EU DSP editorial teams', level: 'medium', ts: '3h ago' },
];

export const OPS_HEALTH = [
  { id: 1, category: 'Automations', item: 'Royalty statement sync — artist portal', status: 'failed', since: '6h ago', impact: 'Medium' },
  { id: 2, category: 'Approvals', item: 'ZEAL Vol. 2 budget approval', status: 'pending', since: '18h ago', impact: 'High' },
  { id: 3, category: 'Blocked', item: 'Drift Current distribution unlock', status: 'blocked', since: '12d ago', impact: 'Critical' },
  { id: 4, category: 'SLA Breach', item: 'Campaign C-0027 close-out report', status: 'breached', since: '3d ago', impact: 'Low' },
  { id: 5, category: 'System', item: 'Catalog sync partial failure — 204 assets pending', status: 'degraded', since: '1h ago', impact: 'Medium' },
  { id: 6, category: 'Approvals', item: 'Aria Cross sync deal sign-off', status: 'pending', since: '2d ago', impact: 'High' },
];

export const FINANCE = {
  cash_position: '$4.28M',
  cash_delta: '+$142K today',
  incoming_this_month: '$1.84M',
  incoming_progress: 74,
  pending_payouts: '$312,000',
  royalty_batches: 3,
  royalty_next: 'Apr 15',
  month_end_progress: 62,
  revenue_today: '$48,400',
  channels: [
    { label: 'Streaming', amount: '$21,200', pct: 44, color: '#06B6D4' },
    { label: 'Sync', amount: '$9,400', pct: 19, color: '#8B5CF6' },
    { label: 'Merch', amount: '$11,800', pct: 24, color: '#F59E0B' },
    { label: 'Other', amount: '$6,000', pct: 13, color: '#10B981' },
  ],
};

export const CONTRACTS = [
  { id: 'CON-041', artist: 'ZEAL', type: 'Recording', status: 'Out for Signature', value: '$85,000', expires: 'Apr 12', risk: 'high' },
  { id: 'CON-039', artist: 'Aria Cross', type: 'Sync License', status: 'Review Required', value: '$22,000', expires: 'Apr 10', risk: 'critical' },
  { id: 'CON-037', artist: 'Nova Blaze', type: 'Management', status: 'Signed', value: '$120,000', expires: 'Dec 2026', risk: 'low' },
  { id: 'CON-035', artist: 'SOLACE', type: 'Distribution', status: 'Renewal Due', value: '$45,000', expires: 'May 1', risk: 'medium' },
  { id: 'CON-031', artist: 'Drift Current', type: 'Distribution', status: 'Blocked', value: '$18,000', expires: 'Jun 1', risk: 'critical' },
  { id: 'CON-028', artist: 'Maeven', type: 'Recording', status: 'Signed', value: '$31,000', expires: 'Mar 2027', risk: 'low' },
];

export const TEAM_PERFORMANCE = [
  { team: 'A&R', completed: 14, overdue: 2, score: 92, blocked: 0, members: 4 },
  { team: 'Campaigns', completed: 31, overdue: 4, score: 78, blocked: 1, members: 6 },
  { team: 'Operations', completed: 22, overdue: 7, score: 68, blocked: 2, members: 5 },
  { team: 'Legal', completed: 8, overdue: 3, score: 73, blocked: 1, members: 3 },
  { team: 'Finance', completed: 19, overdue: 1, score: 94, blocked: 0, members: 4 },
  { team: 'Merch', completed: 11, overdue: 0, score: 97, blocked: 0, members: 3 },
];

export const CALENDAR_EVENTS = [
  { id: 1, type: 'release', label: 'ZEAL Vol. 2 — Album Release', date: 'May 15', days_out: 37, artist: 'ZEAL', urgent: false },
  { id: 2, type: 'contract', label: 'Aria Cross sync deal expires', date: 'Apr 10', days_out: 2, artist: 'Aria Cross', urgent: true },
  { id: 3, type: 'contract', label: 'ZEAL recording contract signature', date: 'Apr 12', days_out: 4, artist: 'ZEAL', urgent: true },
  { id: 4, type: 'release', label: 'Nova Blaze EP Pre-Save Launch', date: 'Apr 18', days_out: 10, artist: 'Nova Blaze', urgent: false },
  { id: 5, type: 'tour', label: 'Aria Cross — West Coast Dates', date: 'May 3', days_out: 25, artist: 'Aria Cross', urgent: false },
  { id: 6, type: 'finance', label: 'Q1 Royalty Payout Batch', date: 'Apr 15', days_out: 7, artist: 'All Roster', urgent: false },
  { id: 7, type: 'conflict', label: 'Vex Hollow tour / recording overlap', date: 'Apr 20', days_out: 12, artist: 'Vex Hollow', urgent: true },
];

export const PARTNER_PIPELINE = [
  { id: 1, partner: 'Nike Music', type: 'Brand Deal', status: 'Negotiating', value: '$240,000', stage: 3, stages: 5, contact: 'J. Martin' },
  { id: 2, partner: 'Hype House Finance', type: 'Banking', status: 'Due Diligence', value: '—', stage: 2, stages: 4, contact: 'S. Reeves' },
  { id: 3, partner: 'SoundGuard Insurance', type: 'Insurance', status: 'Proposal Sent', value: '$18,000/yr', stage: 2, stages: 3, contact: 'M. Walsh' },
  { id: 4, partner: 'Vertex Legal Group', type: 'Legal', status: 'Active Partner', value: '$6,000/mo', stage: 4, stages: 4, contact: 'T. Cross' },
  { id: 5, partner: 'Vans Apparel', type: 'Brand Deal', status: 'Intro Call', value: '$85,000', stage: 1, stages: 5, contact: 'K. Diaz' },
  { id: 6, partner: 'AudioShield FX', type: 'Brand Deal', status: 'At Risk', value: '$60,000', stage: 2, stages: 5, contact: 'B. Lane' },
];

export const AI_OPS_INSIGHTS = [
  "CRITICAL WINDOW: KAEZO's TikTok viral coefficient is accelerating — score now 94. Every 24 hours of delay reduces acquisition probability by ~18%. Recommend immediate outreach authorization from Randy Jackson.",
  "Operational risk concentration: 3 of 5 critical issues trace to distribution and legal delays. Drift Current has now lost an estimated $33.6K in potential revenue. Escalating to priority channel is recommended before further compounding.",
  "Revenue mix health: Streaming (44%) and Merch (24%) are the strongest contributors today. Sync revenue ($9.4K) is up 34% — the Aria Cross pipeline holds 3 unrouted inquiries. Legal sign-off on CON-039 would unlock an estimated $22K.",
  "Team performance divergence: Finance and Merch are at 94–97% productivity scores. Campaigns and Operations are underperforming at 78% and 68% — both have blocked members. Recommend a 15-min stand-up to unblock the 3 stalled items.",
  "ZEAL is your highest-momentum asset across all signals: streaming +290%, CTR 3.4%, 12 new playlist adds, and a recording contract pending signature. Delay on CON-041 is the single largest unlocked value item on the board.",
];
