import type { ReleaseWeek, Platform, WalletTx, CommandAction, SignalItem } from './types';

export const RELEASE_DATA = {
  title: 'Move Along',
  artist: 'All American Rejects',
  label: 'SPIN Records',
  daysUntil: 18,
  stage: 'Pre-Release Window',
  healthScore: 72,
  readinessScore: 72,
  momentumScore: 64,
  releaseDate: 'Apr 30, 2025',
};

export const WEEKS: ReleaseWeek[] = [
  {
    num: 8, label: 'Foundation Lock', objective: 'Lock all assets, DSP submissions, and internal alignment',
    status: 'complete', pct: 100, priority: 'critical', color: '#10B981',
    tasks: [
      { label: 'Finalize master + deliverables', done: true, critical: true },
      { label: 'Submit to all DSPs', done: true, critical: true },
      { label: 'Internal team alignment meeting', done: true, critical: false },
      { label: 'Budget approval + wallet setup', done: true, critical: true },
    ],
  },
  {
    num: 7, label: 'Narrative + Positioning', objective: 'Define campaign angle, key message, visual identity',
    status: 'complete', pct: 100, priority: 'critical', color: '#10B981',
    tasks: [
      { label: 'Campaign narrative finalized', done: true, critical: true },
      { label: 'Visual identity package complete', done: true, critical: true },
      { label: 'Press bio updated', done: true, critical: false },
      { label: 'Social content tone guide', done: true, critical: false },
    ],
  },
  {
    num: 6, label: 'DSP Infrastructure', objective: 'Complete all platform setup, profiles, and editorial pitches',
    status: 'strong', pct: 88, priority: 'critical', color: '#10B981',
    tasks: [
      { label: 'Spotify editorial pitch submitted', done: true, critical: true },
      { label: 'Spotify Canvas + Countdown Page', done: true, critical: true },
      { label: 'Apple Music Q&A + promo card', done: false, critical: true, blocker: true },
      { label: 'Amazon Hype Card ready', done: true, critical: false },
      { label: 'YouTube Premiere scheduled', done: true, critical: false },
    ],
  },
  {
    num: 5, label: 'Content Build', objective: 'Produce all release-week content and creator briefs',
    status: 'strong', pct: 75, priority: 'high', color: '#06B6D4',
    tasks: [
      { label: 'Short-form video package (30 pieces)', done: true, critical: true },
      { label: 'Creator seed pack delivered', done: false, critical: true },
      { label: 'TikTok sound verification active', done: true, critical: true },
      { label: 'IG carousel + story templates', done: false, critical: false },
    ],
  },
  {
    num: 4, label: 'Fan + Creator Seeding', objective: 'Activate creator network and seed superfan communities',
    status: 'at-risk', pct: 40, priority: 'critical', color: '#F59E0B',
    tasks: [
      { label: 'Creator network briefed (target: 60)', done: false, critical: true, blocker: true },
      { label: 'Fan Hub activation + email capture', done: true, critical: true },
      { label: 'Community seeding — Discord + Reddit', done: false, critical: false },
      { label: 'Influencer deal signed × 3', done: false, critical: true },
    ],
  },
  {
    num: 3, label: 'Pre-Save + Signal Detection', objective: 'Launch pre-save push, monitor early signals',
    status: 'at-risk', pct: 55, priority: 'critical', color: '#F59E0B',
    tasks: [
      { label: 'Pre-save page live', done: true, critical: true },
      { label: 'Pre-save CTA across all channels', done: true, critical: true },
      { label: 'Target 25K pre-saves before Week 2', done: false, critical: true },
      { label: 'Signal monitoring dashboard live', done: false, critical: false },
    ],
  },
  {
    num: 2, label: 'Conversion Ramp', objective: 'Maximize saves, streams, and pre-release virality',
    status: 'upcoming', pct: 0, priority: 'critical', color: '#3B82F6',
    tasks: [
      { label: 'Paid media go-live ($3,500 advance)', done: false, critical: true },
      { label: 'Creator wave 2 posts', done: false, critical: true },
      { label: 'Merch drop + bundle activation', done: false, critical: false },
      { label: 'Streaming service ad placements', done: false, critical: false },
    ],
  },
  {
    num: 1, label: 'Release War Room', objective: 'Full execution mode — every lever active on drop day',
    status: 'upcoming', pct: 0, priority: 'critical', color: '#EF4444',
    tasks: [
      { label: 'Release day push across all platforms', done: false, critical: true },
      { label: 'Artist promo posts live', done: false, critical: true },
      { label: 'Paid media surge — release day budget', done: false, critical: true },
      { label: 'Press / media follow-up', done: false, critical: false },
    ],
  },
];

export const PLATFORMS: Platform[] = [
  {
    id: 'spotify', name: 'Spotify', icon: '♪', color: '#1DB954',
    hygieneScore: 94, setupPct: 100, overallStatus: 'ready',
    rowState: 'monitoring', channel: 'dsp',
    currentStatus: 'Countdown Page live · Pre-save tracking active · Editorial pitch submitted',
    actionNeeded: 'Monitor pre-save velocity — currently on pace for 18K by release',
    isBlocker: false,
    ctaActions: ['review', 'sync'],
    lastSynced: '4 min ago',
    checks: [
      { label: 'Countdown Page active', status: 'complete', detail: 'Driving 38% of all pre-saves' },
      { label: 'Canvas uploaded + approved', status: 'complete', detail: 'Accepted Apr 2' },
      { label: 'Editorial pitch submitted', status: 'complete', detail: 'Submitted 6 days ahead of deadline' },
      { label: 'Artist Pick updated', status: 'complete', detail: 'Pointing to new single' },
      { label: 'Pre-save page linked to bio', status: 'complete' },
    ],
  },
  {
    id: 'apple', name: 'Apple Music', icon: '♫', color: '#FA2D48',
    hygieneScore: 58, setupPct: 35, overallStatus: 'partial',
    rowState: 'needs-fix', channel: 'dsp',
    currentStatus: 'Bio, Q&A, and promo card missing · Editorial window closes in 10 days',
    actionNeeded: 'Complete bio + Q&A update and submit promo card — risk of missing editorial feature',
    isBlocker: true,
    ctaActions: ['fix-now', 'complete-setup'],
    lastSynced: '2 hr ago',
    checks: [
      { label: 'Bio / Q&A updated', status: 'missing', blocker: true, detail: 'Required for editorial consideration' },
      { label: 'Promo card ready', status: 'missing', blocker: true, detail: 'Deadline in 10 days' },
      { label: 'Playlist / set list created', status: 'partial', detail: '2 of 4 playlists set' },
      { label: 'Promotional pitch sent', status: 'partial', detail: 'Draft ready — needs submission' },
      { label: 'Artist Connect post live', status: 'missing', detail: 'Optional but boosts editorial score' },
    ],
  },
  {
    id: 'amazon', name: 'Amazon Music', icon: '▶', color: '#FF9900',
    hygieneScore: 71, setupPct: 62, overallStatus: 'partial',
    rowState: 'partial', channel: 'dsp',
    currentStatus: 'Profile ready · Hype Card built · X-Ray lyrics missing',
    actionNeeded: 'Submit X-Ray lyrics to complete editorial eligibility',
    isBlocker: false,
    ctaActions: ['complete-setup', 'verify'],
    lastSynced: '1 hr ago',
    checks: [
      { label: 'Profile updated', status: 'complete' },
      { label: 'Editorial pitch ready', status: 'partial', detail: 'Pending team review' },
      { label: 'Hype Card ready', status: 'ready', detail: 'Needs final approval' },
      { label: 'X-Ray lyrics submitted', status: 'missing', detail: 'Improves algorithmic placement' },
      { label: 'Alexa announcement trigger', status: 'partial', detail: '1 of 3 phrases active' },
    ],
  },
  {
    id: 'tiktok', name: 'TikTok', icon: '♬', color: '#FF0050',
    hygieneScore: 77, setupPct: 72, overallStatus: 'partial',
    rowState: 'partial', channel: 'social',
    currentStatus: 'Sound live · Account claimed · Creator seed pack incomplete',
    actionNeeded: 'Complete creator seed pack — 3 assets missing before Week 4 brief',
    isBlocker: false,
    ctaActions: ['complete-setup', 'sync'],
    lastSynced: '28 min ago',
    checks: [
      { label: 'Artist account claimed', status: 'complete' },
      { label: 'Sound verified + live', status: 'complete', detail: 'Trending in 3 regions' },
      { label: 'Pinned track active', status: 'complete' },
      { label: 'Creator seed pack ready', status: 'partial', blocker: true, detail: 'Missing: hook clips, lyric cards, B-roll' },
      { label: 'TopView / Spark Ads configured', status: 'partial', detail: 'Budget allocation pending' },
      { label: 'Creator brief sent (target: 60)', status: 'missing', detail: 'Week 4 brief not yet dispatched' },
    ],
  },
  {
    id: 'instagram', name: 'Instagram', icon: '◈', color: '#E1306C',
    hygieneScore: 82, setupPct: 80, overallStatus: 'ready',
    rowState: 'monitoring', channel: 'social',
    currentStatus: 'Bio + link live · Pinned posts ready · Story cadence partial',
    actionNeeded: 'Activate automated story cadence for release week push',
    isBlocker: false,
    ctaActions: ['review', 'sync'],
    lastSynced: '12 min ago',
    checks: [
      { label: 'Bio updated w/ pre-save link', status: 'complete' },
      { label: 'Pre-save link in bio active', status: 'complete' },
      { label: 'Pinned posts ready', status: 'complete' },
      { label: 'Story cadence active', status: 'partial', detail: 'Manual only — automation not set' },
      { label: 'Countdown sticker scheduled', status: 'partial', detail: 'Needs scheduling for release day' },
    ],
  },
  {
    id: 'youtube', name: 'YouTube', icon: '▷', color: '#FF0000',
    hygieneScore: 85, setupPct: 85, overallStatus: 'ready',
    rowState: 'monitoring', channel: 'dsp',
    currentStatus: 'Premiere scheduled · Banner live · Shorts package partial',
    actionNeeded: 'Finalize Shorts package for release week organic push',
    isBlocker: false,
    ctaActions: ['review', 'complete-setup'],
    lastSynced: '45 min ago',
    checks: [
      { label: 'Channel banner updated', status: 'complete' },
      { label: 'Premiere scheduled', status: 'complete', detail: 'Apr 30 at 12:00 PM ET' },
      { label: 'Shorts package ready', status: 'partial', detail: '4 of 6 clips ready' },
      { label: 'Featured shelf live', status: 'complete' },
      { label: 'Community tab post scheduled', status: 'partial', detail: 'Release day post not yet created' },
    ],
  },
  {
    id: 'dtf', name: 'Direct-to-Fan', icon: '✦', color: '#8B5CF6',
    hygieneScore: 63, setupPct: 40, overallStatus: 'partial',
    rowState: 'needs-fix', channel: 'fan',
    currentStatus: 'Fan capture live · Merch destination and exclusive content not set up',
    actionNeeded: 'Set up merch destination and fan-exclusive content to activate high-LTV segment',
    isBlocker: false,
    ctaActions: ['complete-setup', 'fix-now'],
    lastSynced: '3 hr ago',
    checks: [
      { label: 'Fan capture flow active', status: 'complete' },
      { label: 'Email + SMS destination ready', status: 'partial', detail: 'Email linked — SMS pending' },
      { label: 'Merch / offer destination live', status: 'missing', detail: 'Bundle opportunity not activated' },
      { label: 'Fan Hub exclusive content set', status: 'missing', blocker: false, detail: 'High-LTV segment primed — no offer live' },
      { label: 'Automated drip sequence active', status: 'missing', detail: 'Capture-to-engagement flow not configured' },
    ],
  },
  {
    id: 'paid', name: 'Paid Ads', icon: '$', color: '#F59E0B',
    hygieneScore: 45, setupPct: 28, overallStatus: 'blocked',
    rowState: 'blocked', channel: 'paid',
    currentStatus: 'Budget locked · Landing page missing · Audiences not configured · Creatives incomplete',
    actionNeeded: 'Unlock wallet advance + complete creative set to prevent release week launch delay',
    isBlocker: true,
    ctaActions: ['fix-now', 'complete-setup', 'verify'],
    lastSynced: '6 hr ago',
    checks: [
      { label: 'Budget unlocked (wallet)', status: 'partial', blocker: true, detail: '$3,500 advance eligible — not yet requested' },
      { label: 'Creative variants ready (6 needed)', status: 'partial', detail: '2 of 6 variants approved' },
      { label: 'Landing page / destination ready', status: 'missing', blocker: true, detail: 'Blocking all paid traffic — no destination' },
      { label: 'Audience targeting configured', status: 'missing', detail: 'Lookalikes + retargeting not set' },
      { label: 'Ad accounts verified', status: 'ready', detail: 'Meta + TikTok accounts cleared' },
      { label: 'Tracking pixels installed', status: 'partial', detail: 'Meta pixel live — TikTok pixel missing' },
    ],
  },
];

export const WALLET_TXS: WalletTx[] = [
  { id: 'tx1', label: 'ACH Payout Sent', amount: '+$2,300', date: 'Mar 28', state: 'sent' },
  { id: 'tx2', label: 'Campaign Spend — TikTok', amount: '-$1,200', date: 'Mar 25', state: 'settled' },
  { id: 'tx3', label: 'Streaming Royalties Received', amount: '+$4,100', date: 'Mar 20', state: 'settled' },
  { id: 'tx4', label: 'ACH Payout Received', amount: '+$3,800', date: 'Mar 10', state: 'settled' },
  { id: 'tx5', label: 'Campaign Spend — Meta Ads', amount: '-$950', date: 'Mar 8', state: 'settled' },
];

export const COMMAND_ACTIONS: CommandAction[] = [
  {
    id: 'a1', rank: 1, title: 'Complete Apple Music setup — 18 days out',
    body: 'Bio, Q&A, and promo card are missing. Apple editorial response window closes in 10 days. This gap will cost you a potential featured placement.',
    urgency: 'immediate', confidence: 96, outcome: 'Unlock potential Apple editorial feature', timeWindow: '48 hours', group: 'blocked', color: '#FA2D48',
    blocked: 'Apple Music Q&A + bio not updated',
  },
  {
    id: 'a2', rank: 2, title: 'Activate Week 4 creator seeding — 34 creators behind',
    body: 'Creator network brief is 43% complete. At current pace, you will enter release week with half your creator velocity. Nostalgia + identity angles are trending — this window closes in 8 days.',
    urgency: 'immediate', confidence: 92, outcome: '+18–24% stream velocity on release day', timeWindow: '3 days', group: 'active', color: '#EF4444',
  },
  {
    id: 'a3', rank: 3, title: 'Use $3,500 advance for Week 2 paid media launch',
    body: 'Release week paid media requires $3,500 minimum. Wallet advance is eligible against Apr 30 payout. Activating now locks your ad accounts and audience segments before release day.',
    urgency: 'high', confidence: 89, outcome: 'Recoup within 21 days from streaming cycle', timeWindow: '5 days', group: 'funding', color: '#F59E0B',
  },
  {
    id: 'a4', rank: 4, title: 'Hit 25K pre-saves — currently at 12,400',
    body: 'You need 12,600 more pre-saves in 18 days. At current pace: 18,200 by release. Paid amplification + creator wave can bridge the gap. AI projects 94% confidence if both activate.',
    urgency: 'high', confidence: 88, outcome: '+25–40% Spotify algorithm boost on day-1', timeWindow: '7 days', group: 'active', color: '#10B981',
  },
  {
    id: 'a5', rank: 5, title: 'Brazil + Mexico City momentum — creator brief ready',
    body: 'Both markets showing strong organic signals. Creator brief is ready to send. LATAM creators have 72h avg response time — sending today means first posts live before Week 2.',
    urgency: 'high', confidence: 91, outcome: '+31% LATAM stream lift, $14K est. revenue', timeWindow: '24 hours', group: 'momentum', color: '#10B981',
  },
  {
    id: 'a6', rank: 6, title: 'Request payout — $8,420 available now',
    body: 'Available campaign funds from streaming receivables are ready for ACH transfer. Initiating payout now delivers funds to linked bank in 1–2 business days to cover upcoming campaign expenses.',
    urgency: 'medium', confidence: 100, outcome: 'Cash in hand for release-week activation', timeWindow: 'Any time', group: 'funding', color: '#06B6D4',
  },
  {
    id: 'a7', rank: 7, title: 'Complete TikTok creator seed pack',
    body: 'Creator seed pack is 60% complete. Missing: short hook clips, lyric cards, B-roll footage. Package needed before Week 4 brief goes out.',
    urgency: 'medium', confidence: 85, outcome: '2x creator content output, broader reach', timeWindow: '4 days', group: 'blocked', color: '#FF0050',
    blocked: 'Seed pack content incomplete (3 assets missing)',
  },
];

export const PERFORMANCE_SIGNALS: SignalItem[] = [
  { id: 's1', label: 'Strongest Market', value: 'Brazil', delta: '+50% vs baseline', trend: 'up', color: '#10B981', note: 'São Paulo + Rio de Janeiro leading' },
  { id: 's2', label: 'Strongest Platform', value: 'Spotify', delta: '94 hygiene score', trend: 'up', color: '#1DB954', note: 'Countdown Page driving 38% of saves' },
  { id: 's3', label: 'Best Content Angle', value: 'Nostalgia', delta: '3.1x engagement rate', trend: 'up', color: '#EC4899', note: '"Early 2000s alt" trending on TikTok' },
  { id: 's4', label: 'Top Audience Segment', value: 'Viral Reactors', delta: '210K identified', trend: 'up', color: '#06B6D4', note: '18–28 demo, US + LATAM' },
  { id: 's5', label: 'Cooling Signal', value: 'UK Market', delta: '-4% engagement', trend: 'down', color: '#F59E0B', note: 'Scheduled push activates Apr 22' },
  { id: 's6', label: 'Rising Opportunity', value: 'Merch Intent', delta: '+22% intent signals', trend: 'up', color: '#F59E0B', note: 'High-LTV segment primed for bundle' },
];

export const TICKER_MESSAGES = [
  'Readiness gap: TikTok creator seeding 43% below target',
  'Momentum spike detected in Mexico City — +38% listener growth',
  'Wallet funding available — $8,420 ready for campaign activation',
  'Spotify Countdown Page driving 38% of pre-saves',
  'Apple Music setup incomplete — editorial window closes in 10 days',
  'Creator brief ready: LATAM wave can launch today',
  'Advance eligible — $3,500 available against Apr 30 streaming payout',
  'Brazil creator content outperforming paid media 3:1',
];
