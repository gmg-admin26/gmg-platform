export const SPIN_RECORDS = {
  id: 'spin-records',
  name: 'SPIN Records',
  type: 'Brand Imprint',
  color: '#F59E0B',
  status: 'Active',
  founded: '2019',
  healthScore: 79,
  descriptor: 'SPIN Records is currently in a growth cycle driven by catalog resurgence and LATAM expansion.',
} as const;

export const SPIN_ROSTER_IDS = ['aar', 'robot-sunrise', 'jorgen'] as const;

export type SpinArtistId = typeof SPIN_ROSTER_IDS[number];

export interface SpinRosterArtist {
  id: SpinArtistId;
  name: string;
  initials: string;
  avatarColor: string;
  genre: string;
  monthlyListeners: number;
  listenerTrend: 'up' | 'down' | 'flat';
  listenerDelta: string;
  healthScore: number;
  revenueYTD: number;
  manager: string;
  campaignStatus: string;
  campaignStatusColor: string;
  releaseStatus: string;
}

export const SPIN_ROSTER: SpinRosterArtist[] = [
  {
    id: 'aar',
    name: 'All American Rejects',
    initials: 'AAR',
    avatarColor: '#06B6D4',
    genre: 'Alt Rock / Pop Rock',
    monthlyListeners: 4_820_000,
    listenerTrend: 'up',
    listenerDelta: '+8.4%',
    healthScore: 87,
    revenueYTD: 48_200,
    manager: 'Dan Berkowitz',
    campaignStatus: 'Active Campaign',
    campaignStatusColor: '#10B981',
    releaseStatus: 'Release Live',
  },
  {
    id: 'robot-sunrise',
    name: 'Robot Sunrise',
    initials: 'RS',
    avatarColor: '#EC4899',
    genre: 'Indie Electronic',
    monthlyListeners: 312_000,
    listenerTrend: 'up',
    listenerDelta: '+22.1%',
    healthScore: 74,
    revenueYTD: 9_100,
    manager: 'Tia Reeves',
    campaignStatus: 'Pre-Launch',
    campaignStatusColor: '#F59E0B',
    releaseStatus: 'Scheduled Apr 25',
  },
  {
    id: 'jorgen',
    name: 'Jorgen',
    initials: 'JG',
    avatarColor: '#F59E0B',
    genre: 'R&B / Soul',
    monthlyListeners: 88_000,
    listenerTrend: 'down',
    listenerDelta: '-4.2%',
    healthScore: 52,
    revenueYTD: 14_300,
    manager: 'Marcus Webb',
    campaignStatus: 'Paused',
    campaignStatusColor: '#6B7280',
    releaseStatus: 'No Release Scheduled',
  },
];

export const SPIN_TEAM = [
  { name: 'Megan Kraemer', role: 'Artist Manager',  artist: 'All American Rejects', email: 'megan@allamericanrejects.com', dept: 'Artist Relations', status: 'Active' as const },
  { name: 'Tia Reeves',   role: 'Artist Manager',  artist: 'Robot Sunrise',         email: 'tia@gmg.ai',    dept: 'Artist Relations', status: 'Active' as const },
  { name: 'Marcus Webb',  role: 'Manager',          artist: 'Jorgen',                email: 'marcus@gmg.ai', dept: 'Artist Relations', status: 'Active' as const },
  { name: 'Jamie Torres', role: 'Marketing Lead',   artist: 'All American Rejects',  email: 'jamie@gmg.ai',  dept: 'Marketing',        status: 'Active' as const },
  { name: 'Sarah Lien',   role: 'Campaign Manager', artist: 'Robot Sunrise',         email: 'sarah@gmg.ai',  dept: 'Marketing',        status: 'Active' as const },
];

export function spinTotalListeners(): number {
  return SPIN_ROSTER.reduce((s, a) => s + a.monthlyListeners, 0);
}

export function spinAvgHealth(): number {
  return Math.round(SPIN_ROSTER.reduce((s, a) => s + a.healthScore, 0) / SPIN_ROSTER.length);
}

export function spinTotalRevenue(): number {
  return SPIN_ROSTER.reduce((s, a) => s + a.revenueYTD, 0);
}
