export const SIGNAL_CARDS = [
  {
    id: 'artists',
    label: 'Active Artists',
    value: '247',
    delta: '+12',
    deltaDir: 'up' as const,
    sub: 'vs last 30d',
    accent: '#06B6D4',
  },
  {
    id: 'streams',
    label: 'Streams (24h)',
    value: '4.2M',
    delta: '+18.4%',
    deltaDir: 'up' as const,
    sub: 'across all catalogs',
    accent: '#10B981',
  },
  {
    id: 'campaigns',
    label: 'Live Campaigns',
    value: '31',
    delta: '+4',
    deltaDir: 'up' as const,
    sub: '3 entering scale phase',
    accent: '#F59E0B',
  },
  {
    id: 'revenue',
    label: 'Revenue (MTD)',
    value: '$1.84M',
    delta: '+9.2%',
    deltaDir: 'up' as const,
    sub: 'across all channels',
    accent: '#3B82F6',
  },
  {
    id: 'signals',
    label: 'Signal Alerts',
    value: '8',
    delta: '2 critical',
    deltaDir: 'neutral' as const,
    sub: 'require review',
    accent: '#EF4444',
  },
  {
    id: 'catalog',
    label: 'Catalog Assets',
    value: '12,408',
    delta: '+204',
    deltaDir: 'up' as const,
    sub: 'indexed this week',
    accent: '#8B5CF6',
  },
];

export const ARTISTS = [
  { id: 'A001', name: 'Nova Blaze', genre: 'Hip-Hop', status: 'Scaling', velocity: '+847%', streams: '2.1M', revenue: '$48,200', risk: 'Low', manager: 'J. Torres', campaigns: 3 },
  { id: 'A002', name: 'Aria Cross', genre: 'Pop', status: 'Active', velocity: '+112%', streams: '890K', revenue: '$22,100', risk: 'Low', manager: 'M. Chen', campaigns: 2 },
  { id: 'A003', name: 'Vex Hollow', genre: 'Alternative', status: 'Risk', velocity: '-24%', streams: '310K', revenue: '$7,400', risk: 'High', manager: 'D. Reyes', campaigns: 1 },
  { id: 'A004', name: 'SOLACE', genre: 'R&B', status: 'Active', velocity: '+67%', streams: '1.4M', revenue: '$31,000', risk: 'Low', manager: 'A. Park', campaigns: 2 },
  { id: 'A005', name: 'Drift Current', genre: 'Electronic', status: 'Blocked', velocity: '0%', streams: '120K', revenue: '$2,800', risk: 'Critical', manager: 'B. Singh', campaigns: 0 },
  { id: 'A006', name: 'Maeven', genre: 'Indie', status: 'Active', velocity: '+34%', streams: '540K', revenue: '$12,600', risk: 'Low', manager: 'S. Kim', campaigns: 1 },
  { id: 'A007', name: 'ZEAL', genre: 'Trap', status: 'Scaling', velocity: '+290%', streams: '3.2M', revenue: '$71,000', risk: 'Low', manager: 'T. Watts', campaigns: 4 },
  { id: 'A008', name: 'Lucid Fray', genre: 'Soul', status: 'Active', velocity: '+18%', streams: '430K', revenue: '$9,800', risk: 'Medium', manager: 'L. Horne', campaigns: 1 },
];

export const CAMPAIGNS = [
  { id: 'C-0041', name: 'Nova Blaze — Q2 Push', artist: 'Nova Blaze', type: 'Paid Social', status: 'Risk', budget: '$12,000', spent: '$9,100', ctr: '0.8%', reach: '1.2M', end: 'Apr 30' },
  { id: 'C-0038', name: 'ZEAL — Album Rollout', artist: 'ZEAL', type: 'Multi-Channel', status: 'Active', budget: '$25,000', spent: '$14,200', ctr: '3.4%', reach: '8.1M', end: 'May 15' },
  { id: 'C-0035', name: 'Aria Cross — Playlist', artist: 'Aria Cross', type: 'DSP Promo', status: 'Active', budget: '$8,000', spent: '$4,500', ctr: '2.1%', reach: '2.4M', end: 'May 1' },
  { id: 'C-0029', name: 'SOLACE — Sync Pitch', artist: 'SOLACE', type: 'Sync / License', status: 'Scaling', budget: '$5,000', spent: '$2,000', ctr: '—', reach: '—', end: 'May 20' },
  { id: 'C-0027', name: 'Vex Hollow — Reboot', artist: 'Vex Hollow', type: 'Organic', status: 'Blocked', budget: '$3,000', spent: '$3,000', ctr: '0.3%', reach: '180K', end: 'Apr 15' },
];

export const ACTIVITY_FEED = [
  { id: 1, type: 'signal', text: 'Nova Blaze track velocity triggered Tier-1 alert', time: '2m ago', level: 'critical' },
  { id: 2, type: 'campaign', text: 'Campaign C-0038 entered scale phase — ZEAL', time: '14m ago', level: 'success' },
  { id: 3, type: 'catalog', text: '204 new catalog assets indexed from Aria Cross submission', time: '31m ago', level: 'info' },
  { id: 4, type: 'revenue', text: 'Merch drop: ARIA CROSS — $42,400 in 3h (Q2 record)', time: '1h ago', level: 'success' },
  { id: 5, type: 'risk', text: 'Campaign C-0041 CTR below threshold — manual review flagged', time: '2h ago', level: 'warning' },
  { id: 6, type: 'signal', text: 'ZEAL streaming velocity: +290% WoW across Spotify + Apple', time: '3h ago', level: 'info' },
  { id: 7, type: 'system', text: 'Rocksteady scan complete — 18 new emerging signals detected', time: '4h ago', level: 'info' },
  { id: 8, type: 'risk', text: 'Drift Current — distribution block unresolved (day 12)', time: '5h ago', level: 'critical' },
];

export const ROCKSTEADY_SIGNALS = [
  { id: 'RS001', artist: 'KAEZO', genre: 'Afrobeats', origin: 'Lagos, NG', score: 94, velocity: '+1,240%', platforms: ['TikTok', 'Spotify'], status: 'Hot', followers: '42K', trend: 'viral loop' },
  { id: 'RS002', artist: 'Pale Wire', genre: 'Indie Rock', origin: 'Manchester, UK', score: 81, velocity: '+380%', platforms: ['Spotify', 'Reddit'], status: 'Rising', followers: '18K', trend: 'playlist momentum' },
  { id: 'RS003', artist: 'SUNRA', genre: 'Neo-Soul', origin: 'Atlanta, GA', score: 78, velocity: '+210%', platforms: ['Apple', 'Instagram'], status: 'Rising', followers: '31K', trend: 'sync placement' },
  { id: 'RS004', artist: 'Mochi Sei', genre: 'J-Pop Fusion', origin: 'Tokyo, JP', score: 73, velocity: '+160%', platforms: ['TikTok', 'YouTube'], status: 'Watch', followers: '89K', trend: 'dance challenge' },
  { id: 'RS005', artist: 'Corrode', genre: 'Post-Punk', origin: 'Berlin, DE', score: 68, velocity: '+95%', platforms: ['Bandcamp', 'Spotify'], status: 'Watch', followers: '9K', trend: 'blog traction' },
  { id: 'RS006', artist: 'VERA-X', genre: 'Electronic', origin: 'Toronto, CA', score: 62, velocity: '+72%', platforms: ['SoundCloud', 'TikTok'], status: 'Emerging', followers: '14K', trend: 'edit loop' },
];

export const CATALOG_ASSETS = [
  { id: 'CAT-001', title: 'Midnight Signal EP', artist: 'SOLACE', year: 2023, tracks: 6, streams_total: '22.4M', revenue_ltm: '$89,100', status: 'Active', sync: 3 },
  { id: 'CAT-002', title: 'Voltage Dreams', artist: 'Nova Blaze', year: 2022, tracks: 12, streams_total: '41.2M', revenue_ltm: '$162,000', status: 'Scaling', sync: 7 },
  { id: 'CAT-003', title: 'Glass Architecture', artist: 'Aria Cross', year: 2024, tracks: 9, streams_total: '18.1M', revenue_ltm: '$71,400', status: 'Active', sync: 2 },
  { id: 'CAT-004', title: 'Fracture Lines', artist: 'Vex Hollow', year: 2021, tracks: 11, streams_total: '8.6M', revenue_ltm: '$28,200', status: 'Risk', sync: 0 },
  { id: 'CAT-005', title: 'ZEAL Vol. 1', artist: 'ZEAL', year: 2023, tracks: 14, streams_total: '58.9M', revenue_ltm: '$234,000', status: 'Scaling', sync: 9 },
];
