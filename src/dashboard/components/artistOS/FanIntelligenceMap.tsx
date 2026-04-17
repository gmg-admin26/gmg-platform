import { useState, useEffect, useRef } from 'react';
import {
  Globe, MapPin, TrendingUp, Users, Music, Zap, Activity,
  Target, Star, Flame, Radio, ChevronRight, BarChart2,
  ShoppingBag, Navigation, Layers, X, ArrowUpRight,
  Megaphone, Tent, Package, PlayCircle, AlertTriangle,
  TrendingDown, CheckCircle, ChevronDown, ChevronUp,
  ArrowRight, Sparkles,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props { artist: SignedArtist; }

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return String(n);
}

// ─── ACTION TYPES ─────────────────────────────────────────────────────────────

type ActionType = 'campaign' | 'creators' | 'tour' | 'merch';

interface QuickAction {
  type: ActionType;
  label: string;
  icon: React.ElementType;
  color: string;
}

const ACTIONS: QuickAction[] = [
  { type: 'campaign',  label: 'Run Campaign',   icon: Megaphone,   color: '#06B6D4' },
  { type: 'creators',  label: 'Push Creators',  icon: PlayCircle,  color: '#EC4899' },
  { type: 'tour',      label: 'Plan Tour',       icon: Tent,        color: '#EF4444' },
  { type: 'merch',     label: 'Drop Merch',      icon: Package,     color: '#F59E0B' },
];

// ─── AI SIGNAL TYPES ──────────────────────────────────────────────────────────

type SignalTone = 'scale' | 'reduce' | 'activate' | 'watch';

interface AISignal {
  tone: SignalTone;
  text: string;
}

function signalColor(tone: SignalTone) {
  if (tone === 'scale')    return '#10B981';
  if (tone === 'reduce')   return '#EF4444';
  if (tone === 'activate') return '#F59E0B';
  return '#06B6D4';
}

function SignalIcon({ tone }: { tone: SignalTone }) {
  const c = signalColor(tone);
  if (tone === 'scale')    return <TrendingUp size={9} color={c} />;
  if (tone === 'reduce')   return <TrendingDown size={9} color={c} />;
  if (tone === 'activate') return <Zap size={9} color={c} />;
  return <Activity size={9} color={c} />;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const LIVE_SIGNALS = [
  { id: 1, text: 'São Paulo listeners +31% in 72 hours', color: '#10B981' },
  { id: 2, text: 'Mexico City breakout cluster detected', color: '#EC4899' },
  { id: 3, text: 'TikTok nostalgia content rising across LATAM', color: '#06B6D4' },
  { id: 4, text: 'Merch intent strongest in North America', color: '#F59E0B' },
  { id: 5, text: 'Touring demand building in Brazil and Chicago', color: '#EF4444' },
  { id: 6, text: '"Flagpole Sitta" nostalgia clip outperforming promo posts 4:1', color: '#10B981' },
];

interface CountryRow {
  id: string; name: string; listeners: number; growth: string;
  engagement: string; tag: string; tagColor: string; platform: string;
  aiSignal: AISignal;
  actions: ActionType[];
}

const COUNTRIES: CountryRow[] = [
  { id: 'us',  name: 'United States',  listeners: 1020000, growth: '+9%',  engagement: 'High',   tag: 'Core',     tagColor: '#06B6D4', platform: 'Spotify',
    aiSignal: { tone: 'scale',    text: 'US: Sustained high engagement → scale merch + creator spend now' },
    actions: ['campaign', 'creators', 'merch'] },
  { id: 'br',  name: 'Brazil',         listeners: 310000,  growth: '+31%', engagement: 'High',   tag: 'Breakout', tagColor: '#10B981', platform: 'Spotify',
    aiSignal: { tone: 'scale',    text: 'Brazil: High conversion potential → scale now before momentum peaks' },
    actions: ['campaign', 'creators', 'tour', 'merch'] },
  { id: 'mx',  name: 'Mexico',         listeners: 198000,  growth: '+22%', engagement: 'High',   tag: 'Surging',  tagColor: '#EC4899', platform: 'Spotify',
    aiSignal: { tone: 'activate', text: 'Mexico: Merch click-rate above avg → drop product before growth plateaus' },
    actions: ['campaign', 'tour', 'merch'] },
  { id: 'uk',  name: 'United Kingdom', listeners: 142000,  growth: '+6%',  engagement: 'Medium', tag: 'Stable',   tagColor: '#F59E0B', platform: 'Apple Music',
    aiSignal: { tone: 'reduce',   text: 'UK: Cooling — engagement down 3 weeks straight → reduce spend, hold' },
    actions: ['campaign', 'creators'] },
  { id: 'ca',  name: 'Canada',         listeners: 118000,  growth: '+11%', engagement: 'Medium', tag: 'Growing',  tagColor: '#06B6D4', platform: 'Spotify',
    aiSignal: { tone: 'activate', text: 'Canada: Consistent growth → touring + creator push could accelerate' },
    actions: ['campaign', 'creators', 'tour'] },
  { id: 'ar',  name: 'Argentina',      listeners: 87000,   growth: '+18%', engagement: 'High',   tag: 'Emerging', tagColor: '#10B981', platform: 'Spotify',
    aiSignal: { tone: 'scale',    text: 'Argentina: Emerging high-engagement pocket → activate now for compounding' },
    actions: ['campaign', 'tour', 'creators'] },
  { id: 'au',  name: 'Australia',      listeners: 61000,   growth: '+4%',  engagement: 'Low',    tag: 'Passive',  tagColor: '#6B7280', platform: 'Spotify',
    aiSignal: { tone: 'watch',    text: 'Australia: Low engagement, slow growth → watch only, minimal spend' },
    actions: ['campaign'] },
  { id: 'de',  name: 'Germany',        listeners: 44000,   growth: '+3%',  engagement: 'Low',    tag: 'Passive',  tagColor: '#6B7280', platform: 'Spotify',
    aiSignal: { tone: 'reduce',   text: 'Germany: Growth stalling → reduce spend, reallocate to LATAM' },
    actions: ['campaign'] },
];

interface CityRow {
  name: string; country: string; listeners: number; growth: string;
  engagement: string; tags: string[]; tagColors: string[];
  platform: string; merchSignal: string;
  aiSignal: AISignal;
  actions: ActionType[];
}

const CITIES: CityRow[] = [
  { name: 'São Paulo',   country: 'BR', listeners: 148000, growth: '+38%', engagement: 'High',   tags: ['Breakout', 'Touring'],    tagColors: ['#10B981', '#EF4444'], platform: 'Spotify',     merchSignal: 'Medium',
    aiSignal: { tone: 'scale',    text: 'São Paulo: High conversion potential → scale now. Portuguese content converts 2x.' },
    actions: ['campaign', 'creators', 'tour', 'merch'] },
  { name: 'Mexico City', country: 'MX', listeners: 94000,  growth: '+26%', engagement: 'High',   tags: ['Surging', 'Merch-Heavy'], tagColors: ['#EC4899', '#F59E0B'], platform: 'Spotify',     merchSignal: 'High',
    aiSignal: { tone: 'activate', text: 'Mexico City: Merch intent elevated → drop limited product this week' },
    actions: ['campaign', 'tour', 'merch', 'creators'] },
  { name: 'Chicago',     country: 'US', listeners: 88000,  growth: '+14%', engagement: 'High',   tags: ['Touring', 'Creator'],    tagColors: ['#EF4444', '#06B6D4'], platform: 'Spotify',     merchSignal: 'High',
    aiSignal: { tone: 'scale',    text: 'Chicago: Top-3 touring market confirmed → book venue before window closes' },
    actions: ['tour', 'campaign', 'creators'] },
  { name: 'Los Angeles', country: 'US', listeners: 112000, growth: '+7%',  engagement: 'Medium', tags: ['Creator', 'Tastemaker'], tagColors: ['#06B6D4', '#F59E0B'], platform: 'Apple Music', merchSignal: 'Medium',
    aiSignal: { tone: 'activate', text: 'LA: Creator-led discovery rising → brief 5–8 mid-tier creators now' },
    actions: ['creators', 'campaign'] },
  { name: 'New York',    country: 'US', listeners: 98000,  growth: '+9%',  engagement: 'High',   tags: ['Touring', 'Merch-Heavy'],tagColors: ['#EF4444', '#F59E0B'], platform: 'Spotify',     merchSignal: 'High',
    aiSignal: { tone: 'scale',    text: 'New York: High merch intent + touring demand → double down' },
    actions: ['tour', 'merch', 'campaign'] },
  { name: 'Buenos Aires',country: 'AR', listeners: 61000,  growth: '+18%', engagement: 'High',   tags: ['Emerging', 'Untapped'], tagColors: ['#10B981', '#06B6D4'], platform: 'Spotify',     merchSignal: 'Low',
    aiSignal: { tone: 'activate', text: 'Buenos Aires: High engagement, zero tour presence → announce first' },
    actions: ['tour', 'campaign', 'creators'] },
  { name: 'London',      country: 'UK', listeners: 78000,  growth: '+6%',  engagement: 'Medium', tags: ['Stable'],              tagColors: ['#F59E0B'],            platform: 'Apple Music', merchSignal: 'Medium',
    aiSignal: { tone: 'reduce',   text: 'London: Cooling trend 3 weeks → reduce paid spend, monitor organic' },
    actions: ['campaign'] },
  { name: 'Nashville',   country: 'US', listeners: 42000,  growth: '+6%',  engagement: 'Medium', tags: ['Country-Cross'],       tagColors: ['#F59E0B'],            platform: 'Spotify',     merchSignal: 'Low',
    aiSignal: { tone: 'watch',    text: 'Nashville: Niche cross-over audience → test, don\'t commit budget yet' },
    actions: ['campaign', 'creators'] },
];

interface SegmentRow {
  id: string; name: string; size: string; growth: string;
  growthColor: string; description: string; opportunity: string;
  cta: string; ctaColor: string; icon: React.ElementType;
  ltv: string; repeatRate: string;
  aiSignal: AISignal;
  actions: ActionType[];
}

const SEGMENTS: SegmentRow[] = [
  {
    id: 'nostalgic', name: 'Pop-Punk Nostalgia Core', size: '480K fans', growth: '+18% MoM', growthColor: '#10B981',
    description: 'Longtime fans re-engaging through throwback TikTok clips, Spotify nostalgia playlists, and "remember when" social content.',
    opportunity: 'Highest purchase intent. Prime merch and fan club conversion target.',
    cta: 'Launch Re-Engagement', ctaColor: '#10B981', icon: Flame, ltv: 'High', repeatRate: '74%',
    aiSignal: { tone: 'scale', text: 'Nostalgia Core: Highest LTV segment active right now → merch drop + fan club = immediate revenue' },
    actions: ['campaign', 'merch', 'creators'],
  },
  {
    id: 'latam', name: 'LATAM Breakout Fans', size: '395K fans', growth: '+31% MoM', growthColor: '#EC4899',
    description: 'Rapidly growing audience in Brazil, Mexico, and Argentina. Mobile-first, TikTok-driven, Spanish & Portuguese speaking.',
    opportunity: 'Zero tour presence = massive unmet demand. Touring + localized content would accelerate.',
    cta: 'Activate LATAM Campaign', ctaColor: '#EC4899', icon: Globe, ltv: 'Medium', repeatRate: '61%',
    aiSignal: { tone: 'scale', text: 'LATAM: High conversion potential → scale localized content + tour now' },
    actions: ['campaign', 'creators', 'tour'],
  },
  {
    id: 'touring', name: 'Touring Candidate Cities', size: '220K fans', growth: '+12% MoM', growthColor: '#EF4444',
    description: 'Fan density + streaming growth + engagement signal converge in Chicago, São Paulo, Mexico City, and New York.',
    opportunity: 'Routing a 6-stop tour would sell through based on current demand density.',
    cta: 'Build Tour Route', ctaColor: '#EF4444', icon: Navigation, ltv: 'High', repeatRate: '68%',
    aiSignal: { tone: 'activate', text: 'Touring window open in 4 cities right now → delay = lost ticket demand' },
    actions: ['tour', 'campaign', 'merch'],
  },
  {
    id: 'merch', name: 'Merch-Intent Fans', size: '162K fans', growth: '+9% MoM', growthColor: '#F59E0B',
    description: 'Fans showing cart-add behavior, clicking merch links, and saving product posts. Concentrated in North America.',
    opportunity: 'Launch limited catalog merch or bundle merch + streaming offer for direct conversion.',
    cta: 'Open Merch Strategy', ctaColor: '#F59E0B', icon: ShoppingBag, ltv: 'High', repeatRate: '58%',
    aiSignal: { tone: 'activate', text: 'Merch-Intent: 162K fans already showing buy intent → drop product now to close' },
    actions: ['merch', 'campaign', 'creators'],
  },
  {
    id: 'viral', name: 'Casual Viral Listeners', size: '340K fans', growth: '+24% MoM', growthColor: '#06B6D4',
    description: 'Discovered through TikTok, Reels, and editorial playlists. Casual engagement — need nurture sequence to convert.',
    opportunity: 'Content drip + pre-save campaign could convert 15–20% to core fans within 90 days.',
    cta: 'Build Nurture Flow', ctaColor: '#06B6D4', icon: Zap, ltv: 'Low-Med', repeatRate: '38%',
    aiSignal: { tone: 'activate', text: 'Viral listeners: 340K in funnel → push creators + campaign to convert before they cool' },
    actions: ['creators', 'campaign'],
  },
  {
    id: 'ltv', name: 'High-LTV Core Fans', size: '98K fans', growth: '+6% MoM', growthColor: '#F59E0B',
    description: 'Deepest catalog listeners. Stream full albums, follow all platforms, high merch conversion, attend shows.',
    opportunity: 'Fan club / subscription model. These are the people to activate for every release and drop.',
    cta: 'Build Fan Club Strategy', ctaColor: '#F59E0B', icon: Star, ltv: 'Highest', repeatRate: '88%',
    aiSignal: { tone: 'scale', text: 'High-LTV Core: Your best 98K fans are primed — fan club + VIP merch = compounding revenue' },
    actions: ['merch', 'campaign', 'tour'],
  },
];

const STATES: Record<string, { name: string; listeners: number; growth: string; engagement: string; tag: string; tagColor: string; aiSignal: AISignal; actions: ActionType[] }[]> = {
  us: [
    { name: 'California', listeners: 198000, growth: '+7%', engagement: 'High', tag: 'Creator Market', tagColor: '#06B6D4', aiSignal: { tone: 'activate', text: 'California: Prime creator market — brief 10 mid-tier now' }, actions: ['creators', 'campaign'] },
    { name: 'Illinois', listeners: 142000, growth: '+14%', engagement: 'High', tag: 'Touring Hot', tagColor: '#EF4444', aiSignal: { tone: 'scale', text: 'Illinois: Touring demand surging — Chicago venue window open' }, actions: ['tour', 'campaign'] },
    { name: 'New York', listeners: 138000, growth: '+9%', engagement: 'High', tag: 'Merch Heavy', tagColor: '#F59E0B', aiSignal: { tone: 'scale', text: 'New York: Merch intent high → drop product this week' }, actions: ['merch', 'campaign'] },
    { name: 'Texas', listeners: 117000, growth: '+12%', engagement: 'Medium', tag: 'Growing', tagColor: '#10B981', aiSignal: { tone: 'activate', text: 'Texas: Accelerating growth → light campaign spend to sustain' }, actions: ['campaign', 'creators'] },
    { name: 'Florida', listeners: 88000, growth: '+8%', engagement: 'Medium', tag: 'Growing', tagColor: '#10B981', aiSignal: { tone: 'watch', text: 'Florida: Steady but not breakout — monitor before committing' }, actions: ['campaign'] },
    { name: 'Tennessee', listeners: 62000, growth: '+6%', engagement: 'Medium', tag: 'Country Cross', tagColor: '#F59E0B', aiSignal: { tone: 'watch', text: 'Tennessee: Niche crossover — test creator content only' }, actions: ['creators'] },
    { name: 'Washington', listeners: 44000, growth: '+5%', engagement: 'Low', tag: 'Passive', tagColor: '#6B7280', aiSignal: { tone: 'reduce', text: 'Washington: Low engagement → no active spend needed' }, actions: ['campaign'] },
    { name: 'Colorado', listeners: 38000, growth: '+10%', engagement: 'Medium', tag: 'Growing', tagColor: '#10B981', aiSignal: { tone: 'activate', text: 'Colorado: Young audience growing → creator brief could compound' }, actions: ['creators', 'campaign'] },
  ],
  br: [
    { name: 'São Paulo', listeners: 148000, growth: '+38%', engagement: 'High', tag: 'Breakout', tagColor: '#10B981', aiSignal: { tone: 'scale', text: 'São Paulo: High conversion potential → scale now' }, actions: ['campaign', 'tour', 'creators', 'merch'] },
    { name: 'Rio de Janeiro', listeners: 82000, growth: '+22%', engagement: 'High', tag: 'Surging', tagColor: '#EC4899', aiSignal: { tone: 'scale', text: 'Rio: Surging fast — activate before peak' }, actions: ['campaign', 'tour'] },
    { name: 'Minas Gerais', listeners: 41000, growth: '+16%', engagement: 'Medium', tag: 'Growing', tagColor: '#06B6D4', aiSignal: { tone: 'activate', text: 'Minas Gerais: Consistent growth — light creators push' }, actions: ['creators', 'campaign'] },
  ],
  mx: [
    { name: 'CDMX', listeners: 94000, growth: '+26%', engagement: 'High', tag: 'Breakout', tagColor: '#10B981', aiSignal: { tone: 'scale', text: 'CDMX: Breakout confirmed → full campaign + tour announcement' }, actions: ['campaign', 'tour', 'merch'] },
    { name: 'Jalisco', listeners: 52000, growth: '+18%', engagement: 'High', tag: 'Surging', tagColor: '#EC4899', aiSignal: { tone: 'activate', text: 'Jalisco: Surging → include in tour routing' }, actions: ['tour', 'campaign'] },
    { name: 'Nuevo León', listeners: 31000, growth: '+14%', engagement: 'Medium', tag: 'Growing', tagColor: '#06B6D4', aiSignal: { tone: 'watch', text: 'Nuevo León: Growing but early — creator test only' }, actions: ['creators'] },
  ],
};

const CLUSTER_DETAIL: Record<string, {
  topSongs: string[];
  platforms: string[];
  contentBehavior: string[];
  merchInterest: string;
  repeatListenRate: string;
  suggestedAction: string;
  actions: { label: string; color: string }[];
}> = {
  'São Paulo': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'YouTube', 'Deezer'],
    contentBehavior: ['Nostalgia clips drive 4x more engagement', 'Portuguese caption posts outperform English 2:1', 'Behind-the-scenes saves 3.1x higher than promo'],
    merchInterest: 'Medium (growing)', repeatListenRate: '68%',
    suggestedAction: 'Launch Portuguese-language social campaign + target São Paulo with tour announcement',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Plan Tour Market', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'Mexico City': {
    topSongs: ['Flagpole Sitta', 'The Last Song', 'Move Along', 'Gives You Hell'],
    platforms: ['Spotify', 'YouTube', 'Apple Music'],
    contentBehavior: ['Merch link clicks above avg by 62%', 'Creator-led content driving discovery', 'Pre-save engagement high for catalog re-releases'],
    merchInterest: 'High', repeatListenRate: '61%',
    suggestedAction: 'Merch campaign + touring announcement + Spanish creator brief',
    actions: [{ label: 'Open Fan Activation', color: '#EC4899' }, { label: 'Plan Tour Market', color: '#EF4444' }, { label: 'Schedule Content', color: '#F59E0B' }],
  },
  'Chicago': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'Stab My Back'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    contentBehavior: ['Tidal share unusually high (18%)', 'Weekend streaming dominates', 'Podcast discovery from alt-music shows adding 800+ fans/wk'],
    merchInterest: 'High', repeatListenRate: '72%',
    suggestedAction: 'Chicago is a top-3 touring market — book venue. Creator outreach for Chicago music influencers.',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Plan Tour Market', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'nostalgic': {
    topSongs: ['Flagpole Sitta', 'Dirty Little Secret', 'Move Along', 'It Ends Tonight'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    contentBehavior: ['Throwback + nostalgia clips 4x engagement', 'Album-deep listeners (2.8 songs/session)', 'High playlist save rate (34%)'],
    merchInterest: 'High', repeatListenRate: '74%',
    suggestedAction: 'Nostalgia content + limited merch drop targeted at this segment',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Open Fan Activation', color: '#EC4899' }, { label: 'Build Content Plan', color: '#06B6D4' }],
  },
  'latam': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'The Last Song', 'Gives You Hell'],
    platforms: ['Spotify', 'YouTube', 'Deezer'],
    contentBehavior: ['Mobile-first (81% mobile)', 'TikTok-to-Spotify conversion highest of all segments', 'Creator-led clips drive majority of new fan acquisition'],
    merchInterest: 'Medium', repeatListenRate: '61%',
    suggestedAction: 'Localized LATAM campaign + creator brief in Portuguese + Spanish + tour announcement',
    actions: [{ label: 'Activate LATAM Campaign', color: '#EC4899' }, { label: 'Plan Tour Market', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'touring': {
    topSongs: ['Move Along', 'Flagpole Sitta', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    contentBehavior: ['Pre-show announcement posts see 3x avg engagement', 'Ticket intent signals active across 4 cities', 'Fan forum mentions of "when are they touring" up 240%'],
    merchInterest: 'High', repeatListenRate: '68%',
    suggestedAction: 'Route a 6-stop run: São Paulo → Mexico City → Chicago → New York → London → LA',
    actions: [{ label: 'Build Tour Route', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }, { label: 'Plan Tour Market', color: '#F59E0B' }],
  },
  'merch': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'Stab My Back'],
    platforms: ['Spotify', 'Apple Music', 'Spotify'],
    contentBehavior: ['Product link click rate 3.4x above catalog avg', 'Cart abandonment high — discount or bundle would close', 'North America concentrated (78%)'],
    merchInterest: 'High', repeatListenRate: '58%',
    suggestedAction: 'Limited catalog merch drop + bundle deal. Target North America first.',
    actions: [{ label: 'Open Merch Strategy', color: '#F59E0B' }, { label: 'Launch Campaign', color: '#10B981' }, { label: 'Schedule Content', color: '#06B6D4' }],
  },
  'ltv': {
    topSongs: ['Move Along', 'Flagpole Sitta', 'Dirty Little Secret', 'It Ends Tonight', 'Stab My Back'],
    platforms: ['Spotify', 'Tidal', 'Apple Music'],
    contentBehavior: ['Streams full albums — not just singles', 'Follow rate across all platforms 68%', 'Highest merch conversion (12%) of all segments'],
    merchInterest: 'High', repeatListenRate: '88%',
    suggestedAction: 'Build a fan club / inner-circle subscription. These are your most valuable fans.',
    actions: [{ label: 'Build Fan Club Strategy', color: '#F59E0B' }, { label: 'Open Fan Activation', color: '#EC4899' }, { label: 'Schedule Content', color: '#10B981' }],
  },
};

const FOCUS_RECS = [
  { title: 'Focus nostalgia content in Brazil and Mexico', confidence: 94, outcome: 'Est. +60K new listeners in 30 days', cta: 'Build Content Plan', ctaColor: '#10B981', color: '#10B981' },
  { title: 'Use creator-led content in Chicago + California', confidence: 88, outcome: '+18% Spotify link click conversion', cta: 'Activate Campaign', ctaColor: '#06B6D4', color: '#06B6D4' },
  { title: 'Push merch in North America (NYC, Chicago, LA)', confidence: 91, outcome: 'Est. $28K–40K incremental merch revenue', cta: 'Open Strategy', ctaColor: '#F59E0B', color: '#F59E0B' },
  { title: 'Build tour routing: São Paulo → Mexico City → Chicago', confidence: 86, outcome: '6,400+ estimated ticket demand', cta: 'Plan Tour Route', ctaColor: '#EF4444', color: '#EF4444' },
  { title: 'Catalog re-engagement near pop-punk adjacent artists', confidence: 79, outcome: '+22K cross-listener acquisition projected', cta: 'Open Strategy', ctaColor: '#EC4899', color: '#EC4899' },
];

const TREND_CARDS = [
  {
    title: 'Fan Taste Trends', icon: Music, color: '#06B6D4',
    insights: [
      'Pop-punk nostalgia clips outperform polished promo 4:1 in saves',
      'Acoustic and stripped versions seeing 2.1x longer session time',
      'Tracks featuring early 2000s callbacks seeing +38% playlist adds vs newer material',
    ],
    cta: 'Build Content Plan',
  },
  {
    title: 'Marketing / Platform Trends', icon: Radio, color: '#EC4899',
    insights: [
      'Creator-led short-form is driving more discovery than brand posts',
      'Reels driving 18% more Spotify conversions than TikTok this quarter',
      'Behind-the-scenes content converting better than polished announcements',
    ],
    cta: 'Activate Campaign',
  },
  {
    title: 'Lifestyle / Culture Signals', icon: Layers, color: '#F59E0B',
    insights: [
      'Live-performance nostalgia resonating strongest in LATAM markets',
      'Merch + lifestyle crossover interest rising — fans want wearable identity',
      'Late-night listening (10PM–2AM) = peak engagement window across all markets',
    ],
    cta: 'Open Strategy',
  },
];

const BEHAVIOR_METRICS = [
  { metric: 'Playlist Save Rate', value: '34%', interpretation: 'Strong retention signal — audience is keeping songs, not just sampling.', color: '#10B981', icon: Star },
  { metric: 'Repeat Listen Rate', value: '71%', interpretation: 'Deep listener base. Album-oriented campaigns will outperform single-focused ones.', color: '#06B6D4', icon: Activity },
  { metric: 'Cross-Listen Rate', value: '58%', interpretation: '58% of fans listen to 3+ songs per session. Deep catalog resonance is present.', color: '#F59E0B', icon: Music },
  { metric: 'Merch Interest', value: '12%', interpretation: 'Click-to-cart intent above category avg. North America concentrated. Activate a drop.', color: '#F59E0B', icon: ShoppingBag },
  { metric: 'Followback Rate', value: '29%', interpretation: 'Nearly 1 in 3 stream-discoverers follows back. Strong organic funnel conversion.', color: '#EC4899', icon: Users },
  { metric: 'Pre-Save Tendency', value: '18%', interpretation: 'Above baseline. Pre-save campaigns for upcoming releases will outperform industry avg.', color: '#EF4444', icon: Zap },
];

const HIGH_VALUE = {
  repeatStreamRate: '71%', projectedLTV: '$48', saveRate: '34%', highValueFans: '98K',
  aiInterpretation: 'Your core audience has above-average repeat stream and save rates — meaning these listeners keep coming back and building libraries around your catalog. The 98K high-LTV fans represent your most monetizable segment. Target them first for fan club, premium merch, and early access releases. The casual listener pool (340K+) is large enough for a conversion campaign at meaningful scale.',
  whoToTarget: 'Nostalgia Core + High-LTV + Merch-Intent segments first. LATAM Breakout second for volume.',
  whatNext: 'Fan club launch + limited merch drop + catalog re-engagement push before next release cycle.',
};

// ─── ACTION MODAL ─────────────────────────────────────────────────────────────

interface ActionModal {
  type: ActionType;
  context: string;
}

const ACTION_CONFIGS: Record<ActionType, { title: string; icon: React.ElementType; color: string; fields: string[]; cta: string }> = {
  campaign:  { title: 'Run Campaign',  icon: Megaphone,  color: '#06B6D4', fields: ['Budget ($)', 'Duration (days)', 'Platforms', 'Target Audience'], cta: 'Launch Campaign' },
  creators:  { title: 'Push Creators', icon: PlayCircle, color: '#EC4899', fields: ['Creator Tier', 'Brief Type', 'Content Format', 'Target Count'],   cta: 'Brief Creators' },
  tour:      { title: 'Plan Tour',     icon: Tent,       color: '#EF4444', fields: ['Market', 'Venue Size', 'Date Window', 'Support Act?'],             cta: 'Add to Routing' },
  merch:     { title: 'Drop Merch',    icon: Package,    color: '#F59E0B', fields: ['Product Type', 'Price Point', 'Qty', 'Target Market'],             cta: 'Create Drop' },
};

function ActionModal({ modal, onClose }: { modal: ActionModal; onClose: () => void }) {
  const cfg = ACTION_CONFIGS[modal.type];
  const Icon = cfg.icon;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)', animation: 'fim-fade-in 0.2s ease' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#0D0E11', border: `1px solid ${cfg.color}30`, borderRadius: 20, width: '100%', maxWidth: 460, overflow: 'hidden', animation: 'fim-slide-up 0.25s cubic-bezier(0.16,1,0.3,1) both', boxShadow: `0 0 60px ${cfg.color}18` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${cfg.color}15`, background: `${cfg.color}06` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${cfg.color}14`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={15} color={cfg.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>{cfg.title}</p>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{modal.context}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={12} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        {submitted ? (
          <div style={{ padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${cfg.color}14`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle size={22} color={cfg.color} />
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 800, color: '#fff' }}>Action queued</p>
            <p style={{ margin: '0 0 20px', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Your team has been notified. This action will appear in your campaign pipeline within minutes.</p>
            <button onClick={onClose} style={{ padding: '9px 24px', borderRadius: 10, background: `${cfg.color}14`, border: `1px solid ${cfg.color}30`, color: cfg.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        ) : (
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ padding: '10px 12px', background: `${cfg.color}06`, border: `1px solid ${cfg.color}15`, borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Sparkles size={10} color={cfg.color} />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Pre-fill</span>
              </div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Fields pre-filled based on fan signal data for <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{modal.context}</strong>. Adjust as needed.
              </p>
            </div>

            {cfg.fields.map((field, i) => (
              <div key={field}>
                <p style={{ margin: '0 0 5px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{field}</p>
                <input
                  defaultValue={
                    i === 0 ? (modal.type === 'campaign' ? '$2,500' : modal.type === 'creators' ? 'Mid-tier (50K–500K)' : modal.type === 'tour' ? modal.context : 'Limited Drop') :
                    i === 1 ? (modal.type === 'campaign' ? '14' : modal.type === 'creators' ? 'Nostalgia / Behind-the-scenes' : modal.type === 'tour' ? '1,500–3,000 cap' : '$35–$65') :
                    i === 2 ? (modal.type === 'campaign' ? 'TikTok, Meta, Spotify' : modal.type === 'creators' ? 'Short-form video (15–30s)' : modal.type === 'tour' ? 'May–June 2025' : '500 units') :
                    (modal.type === 'campaign' ? modal.context : modal.type === 'creators' ? '6–10 creators' : modal.type === 'tour' ? 'TBD' : modal.context)
                  }
                  style={{ width: '100%', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 9, color: 'rgba(255,255,255,0.75)', fontSize: 12, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>
            ))}

            <button
              onClick={() => setSubmitted(true)}
              style={{ marginTop: 4, padding: '11px 0', borderRadius: 11, background: `${cfg.color}18`, border: `1px solid ${cfg.color}35`, color: cfg.color, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}
            >
              <Icon size={13} color={cfg.color} />
              {cfg.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── INLINE AI SIGNAL PILL ───────────────────────────────────────────────────

function AISig({ signal, compact }: { signal: AISignal; compact?: boolean }) {
  const c = signalColor(signal.tone);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, padding: compact ? '4px 8px' : '6px 10px', borderRadius: 8, background: `${c}08`, border: `1px solid ${c}18` }}>
      <div style={{ flexShrink: 0, marginTop: compact ? 1 : 2 }}>
        <SignalIcon tone={signal.tone} />
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: compact ? 8 : 9, color: c, lineHeight: 1.45 }}>{signal.text}</span>
    </div>
  );
}

// ─── QUICK ACTION STRIP ───────────────────────────────────────────────────────

function ActionStrip({ types, context, onAction }: { types: ActionType[]; context: string; onAction: (t: ActionType, ctx: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {types.map(t => {
        const a = ACTIONS.find(x => x.type === t)!;
        const AIcon = a.icon;
        return (
          <button key={t}
            onClick={e => { e.stopPropagation(); onAction(t, context); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 7, cursor: 'pointer', background: `${a.color}0C`, border: `1px solid ${a.color}22`, color: a.color, fontSize: 9, fontWeight: 700, transition: 'all 0.15s', whiteSpace: 'nowrap' }}
          >
            <AIcon size={9} color={a.color} />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

type GeoView = 'countries' | 'states' | 'cities' | 'segments';

function LiveTicker() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % LIVE_SIGNALS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const sig = LIVE_SIGNALS[idx];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', background: 'rgba(16,185,129,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)', flexShrink: 0, animation: 'fim-blink 1.4s ease-in-out infinite' }} />
      <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', letterSpacing: '0.1em', flexShrink: 0 }}>LIVE</span>
      <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 10, color: sig.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sig.text}</span>
      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {LIVE_SIGNALS.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 14 : 4, height: 3, borderRadius: 2, background: i === idx ? '#10B981' : 'rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'all 0.25s' }} />
        ))}
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: 110, padding: '14px 16px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontFamily: 'monospace', fontSize: 8, color, marginBottom: 3 }}>{sub}</div>}
      <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  );
}

function EngageDot({ level }: { level: string }) {
  const c = level === 'High' ? '#10B981' : level === 'Medium' ? '#F59E0B' : '#6B7280';
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}80`, marginRight: 4 }} />;
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 7px', borderRadius: 5, color, background: `${color}12`, border: `1px solid ${color}22` }}>{label}</span>
  );
}

function ClusterPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const d = CLUSTER_DETAIL[id];
  if (!d) return null;
  const label = SEGMENTS.find(s => s.id === id)?.name ?? CITIES.find(c => c.name === id)?.name ?? id;
  return (
    <div style={{ background: '#0B0C0E', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden', animation: 'fim-slide-in 0.28s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.04)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Target size={12} color="#06B6D4" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Cluster Detail</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{label}</div>
        </div>
        <button onClick={onClose} style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={11} color="rgba(255,255,255,0.4)" />
        </button>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Top Songs in Cluster</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {d.topSongs.map((s, i) => (
              <span key={s} style={{ fontFamily: 'monospace', fontSize: 9, padding: '3px 9px', borderRadius: 7, color: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', background: i === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', border: i === 0 ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.05)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[{ label: 'Merch Interest', value: d.merchInterest, color: '#F59E0B' }, { label: 'Repeat Listen Rate', value: d.repeatListenRate, color: '#10B981' }].map(m => (
            <div key={m.label} style={{ padding: '9px 11px', background: `${m.color}08`, border: `1px solid ${m.color}18`, borderRadius: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: m.color, marginBottom: 3 }}>{m.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Top Content Behavior</div>
          {d.contentBehavior.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#06B6D4', marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 12px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Suggested Next Action</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{d.suggestedAction}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {d.actions.map(a => (
            <button key={a.label} style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: `${a.color}10`, border: `1px solid ${a.color}25`, color: a.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{a.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GeoSection({ onAction }: { onAction: (t: ActionType, ctx: string) => void }) {
  const [view, setView] = useState<GeoView>('countries');
  const [selectedCountry, setSelectedCountry] = useState<string>('us');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const VIEWS: { id: GeoView; label: string; icon: React.ElementType }[] = [
    { id: 'countries', label: 'Countries', icon: Globe },
    { id: 'states',    label: 'States / Regions', icon: MapPin },
    { id: 'cities',    label: 'Cities', icon: Navigation },
    { id: 'segments',  label: 'Audience Segments', icon: Users },
  ];

  const stateData = STATES[selectedCountry] ?? [];
  const countriesWithStates = Object.keys(STATES);

  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={13} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>Fan Action Map — Geo & Segment Engine</h3>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>Every insight has a direct action · All American Rejects</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'fim-blink 1.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>LIVE</span>
        </div>
      </div>

      {/* View switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}>
        {VIEWS.map(v => {
          const VIcon = v.icon;
          const active = view === v.id;
          return (
            <button key={v.id} onClick={() => { setView(v.id); setSelectedItem(null); setExpandedId(null); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '9px 6px', background: active ? 'rgba(6,182,212,0.06)' : 'transparent', border: 'none', cursor: 'pointer', borderBottom: active ? '2px solid #06B6D4' : '2px solid transparent', transition: 'all 0.18s' }}>
              <VIcon size={10} color={active ? '#06B6D4' : 'rgba(255,255,255,0.2)'} />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: active ? '#06B6D4' : 'rgba(255,255,255,0.28)', fontWeight: active ? 700 : 400, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{v.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedItem ? '1fr 1fr' : '1fr', gap: 0 }}>
        <div style={{ padding: '12px 16px', borderRight: selectedItem ? '1px solid rgba(255,255,255,0.05)' : 'none', overflowY: 'auto', maxHeight: 600 }}>

          {/* COUNTRIES */}
          {view === 'countries' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Top Countries — Click a row to expand actions</div>
              {COUNTRIES.map(c => {
                const expanded = expandedId === c.id;
                return (
                  <div key={c.id} style={{ borderRadius: 12, overflow: 'hidden', border: expanded ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(255,255,255,0.04)', marginBottom: 6, background: expanded ? 'rgba(6,182,212,0.03)' : 'rgba(255,255,255,0.015)', transition: 'all 0.2s' }}>
                    <button onClick={() => setExpandedId(expanded ? null : c.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <EngageDot level={c.engagement} />
                      <span style={{ flex: 1, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{c.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{fmt(c.listeners)}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(16,185,129,0.2)' }}>{c.growth}</span>
                      <Tag label={c.tag} color={c.tagColor} />
                      {expanded ? <ChevronUp size={10} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={10} color="rgba(255,255,255,0.2)" />}
                    </button>
                    {expanded && (
                      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'fim-expand 0.2s ease' }}>
                        <AISig signal={c.aiSignal} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <ActionStrip types={c.actions} context={c.name} onAction={onAction} />
                          <button onClick={() => setSelectedItem(selectedItem === c.name ? null : c.name)}
                            style={{ fontSize: 9, padding: '4px 10px', borderRadius: 6, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06B6D4', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                            View Cluster
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* STATES */}
          {view === 'states' && (
            <>
              <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                {countriesWithStates.map(cid => {
                  const cname = COUNTRIES.find(c => c.id === cid)?.name ?? cid.toUpperCase();
                  const active = selectedCountry === cid;
                  return (
                    <button key={cid} onClick={() => { setSelectedCountry(cid); setSelectedItem(null); setExpandedId(null); }}
                      style={{ fontSize: 9, padding: '4px 11px', borderRadius: 7, cursor: 'pointer', background: active ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.07)', color: active ? '#06B6D4' : 'rgba(255,255,255,0.35)', fontWeight: active ? 700 : 400, transition: 'all 0.15s' }}>
                      {cname}
                    </button>
                  );
                })}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                States / Regions — {COUNTRIES.find(c => c.id === selectedCountry)?.name}
              </div>
              {stateData.map(s => {
                const expanded = expandedId === s.name;
                return (
                  <div key={s.name} style={{ borderRadius: 12, overflow: 'hidden', border: expanded ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(255,255,255,0.04)', marginBottom: 6, background: expanded ? 'rgba(6,182,212,0.03)' : 'rgba(255,255,255,0.015)', transition: 'all 0.2s' }}>
                    <button onClick={() => setExpandedId(expanded ? null : s.name)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <EngageDot level={s.engagement} />
                      <span style={{ flex: 1, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>{s.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{fmt(s.listeners)}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(16,185,129,0.2)' }}>{s.growth}</span>
                      <Tag label={s.tag} color={s.tagColor} />
                      {expanded ? <ChevronUp size={10} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={10} color="rgba(255,255,255,0.2)" />}
                    </button>
                    {expanded && (
                      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'fim-expand 0.2s ease' }}>
                        <AISig signal={s.aiSignal} />
                        <ActionStrip types={s.actions} context={s.name} onAction={onAction} />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* CITIES */}
          {view === 'cities' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Top Cities — Every signal is an action</div>
              {CITIES.map(c => {
                const expanded = expandedId === c.name;
                return (
                  <div key={c.name} style={{ borderRadius: 12, overflow: 'hidden', border: expanded ? '1px solid rgba(6,182,212,0.2)' : '1px solid rgba(255,255,255,0.04)', marginBottom: 6, background: expanded ? 'rgba(6,182,212,0.03)' : 'rgba(255,255,255,0.015)', transition: 'all 0.2s' }}>
                    <button onClick={() => setExpandedId(expanded ? null : c.name)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', textAlign: 'left', padding: '10px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <div style={{ paddingTop: 2 }}><EngageDot level={c.engagement} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{c.name}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{c.country}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {c.tags.map((tag, i) => <Tag key={tag} label={tag} color={c.tagColors[i] ?? '#6B7280'} />)}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>{fmt(c.listeners)}</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>{c.growth}</div>
                      </div>
                      {expanded ? <ChevronUp size={10} color="rgba(255,255,255,0.3)" style={{ marginTop: 4 }} /> : <ChevronDown size={10} color="rgba(255,255,255,0.2)" style={{ marginTop: 4 }} />}
                    </button>
                    {expanded && (
                      <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 8, animation: 'fim-expand 0.2s ease' }}>
                        <AISig signal={c.aiSignal} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <ActionStrip types={c.actions} context={c.name} onAction={onAction} />
                          <button onClick={() => setSelectedItem(selectedItem === c.name ? null : c.name)}
                            style={{ fontSize: 9, padding: '4px 10px', borderRadius: 6, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06B6D4', fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                            View Cluster
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* SEGMENTS */}
          {view === 'segments' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Audience Segments — AI signal + actions on every segment</div>
              {SEGMENTS.map(seg => {
                const Icon = seg.icon;
                const expanded = expandedId === seg.id;
                return (
                  <div key={seg.id} style={{ borderRadius: 14, overflow: 'hidden', border: expanded ? `1px solid ${seg.ctaColor}25` : '1px solid rgba(255,255,255,0.04)', marginBottom: 8, background: expanded ? `${seg.ctaColor}04` : 'rgba(255,255,255,0.015)', transition: 'all 0.2s' }}>
                    <button onClick={() => setExpandedId(expanded ? null : seg.id)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', textAlign: 'left', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${seg.ctaColor}10`, border: `1px solid ${seg.ctaColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={13} color={seg.ctaColor} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{seg.name}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.07)' }}>{seg.size}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: seg.growthColor, background: `${seg.growthColor}10`, padding: '1px 6px', borderRadius: 5, border: `1px solid ${seg.growthColor}22` }}>{seg.growth}</span>
                        </div>
                        <p style={{ margin: '0 0 4px', fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{seg.description}</p>
                        {!expanded && (
                          <AISig signal={seg.aiSignal} compact />
                        )}
                      </div>
                      <div style={{ flexShrink: 0, marginTop: 2 }}>
                        {expanded ? <ChevronUp size={10} color="rgba(255,255,255,0.3)" /> : <ChevronDown size={10} color="rgba(255,255,255,0.2)" />}
                      </div>
                    </button>
                    {expanded && (
                      <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fim-expand 0.2s ease' }}>
                        <AISig signal={seg.aiSignal} />
                        <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9 }}>
                          <p style={{ margin: '0 0 4px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Opportunity</p>
                          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, fontStyle: 'italic' }}>{seg.opportunity}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                          <ActionStrip types={seg.actions} context={seg.name} onAction={onAction} />
                          <button onClick={() => setSelectedItem(selectedItem === seg.id ? null : seg.id)}
                            style={{ fontSize: 9, padding: '4px 10px', borderRadius: 6, background: `${seg.ctaColor}0C`, border: `1px solid ${seg.ctaColor}22`, color: seg.ctaColor, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                            Deep Dive
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Drilldown panel */}
        {selectedItem && (
          <div style={{ padding: '12px 16px', overflowY: 'auto', maxHeight: 600, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
            <ClusterPanel id={selectedItem} onClose={() => setSelectedItem(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

function TrendCards({ onAction }: { onAction: (t: ActionType, ctx: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {TREND_CARDS.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.title} style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${card.color}05` }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: `${card.color}12`, border: `1px solid ${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={13} color={card.color} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{card.title}</span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {card.insights.map((ins, i) => (
                <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{ins}</span>
                </div>
              ))}
              <div style={{ marginTop: 4 }}>
                <button style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: `${card.color}10`, border: `1px solid ${card.color}25`, color: card.color, fontWeight: 600 }}
                  onClick={() => onAction('campaign', card.title)}>
                  {card.cta}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BehaviorSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {BEHAVIOR_METRICS.map(m => {
        const Icon = m.icon;
        return (
          <div key={m.metric} style={{ padding: '13px 14px', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
              <Icon size={12} color={m.color} />
              <span style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{m.value}</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{m.metric}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.55, fontStyle: 'italic' }}>{m.interpretation}</div>
          </div>
        );
      })}
    </div>
  );
}

function HighValueSection({ onAction }: { onAction: (t: ActionType, ctx: string) => void }) {
  const hv = HIGH_VALUE;
  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Star size={13} color="#F59E0B" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>High-Value Fan Intelligence</h3>
          <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>LTV signals and monetization potential</p>
        </div>
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Repeat Stream Rate', value: hv.repeatStreamRate, color: '#10B981' },
            { label: 'Projected LTV',      value: hv.projectedLTV,    color: '#F59E0B' },
            { label: 'Save Rate',           value: hv.saveRate,        color: '#06B6D4' },
            { label: 'High-Value Fans',     value: hv.highValueFans,   color: '#EC4899' },
          ].map(m => (
            <div key={m.label} style={{ padding: '11px 12px', background: `${m.color}08`, border: `1px solid ${m.color}18`, borderRadius: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <BarChart2 size={11} color="#06B6D4" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#06B6D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Interpretation</span>
          </div>
          <p style={{ margin: '0 0 8px', fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{hv.aiInterpretation}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
            <div style={{ padding: '8px 10px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.12)', borderRadius: 9 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(236,72,153,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Who to Target</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{hv.whoToTarget}</div>
            </div>
            <div style={{ padding: '8px 10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 9 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>What to Do Next</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{hv.whatNext}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={() => onAction('merch', 'High-LTV Core Fans')} style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B', fontWeight: 600 }}>Drop Merch</button>
            <button onClick={() => onAction('campaign', 'High-LTV Core Fans')} style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981', fontWeight: 600 }}>Run Campaign</button>
            <button onClick={() => onAction('creators', 'High-LTV Core Fans')} style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', color: '#EC4899', fontWeight: 600 }}>Push Creators</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FocusRecs({ onAction }: { onAction: (t: ActionType, ctx: string) => void }) {
  const typeMap: Record<string, ActionType> = {
    'Build Content Plan': 'creators',
    'Activate Campaign':  'campaign',
    'Open Strategy':      'merch',
    'Plan Tour Route':    'tour',
  };
  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Target size={13} color="#EF4444" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>Where to Focus Next</h3>
          <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>AI-ranked strategic recommendations · each leads to an action</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {FOCUS_RECS.map((r, i) => (
          <div key={r.title} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < FOCUS_RECS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${r.color}10`, border: `1px solid ${r.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ChevronRight size={14} color={r.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{r.title}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 5, color: r.color, background: `${r.color}12`, border: `1px solid ${r.color}22` }}>{r.confidence}% confidence</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>Outcome: <span style={{ color: r.color }}>{r.outcome}</span></div>
            </div>
            <button onClick={() => onAction(typeMap[r.cta] ?? 'campaign', r.title)}
              style={{ fontSize: 9, padding: '5px 13px', borderRadius: 7, cursor: 'pointer', background: `${r.ctaColor}10`, border: `1px solid ${r.ctaColor}25`, color: r.ctaColor, fontWeight: 600, whiteSpace: 'nowrap' }}>
              {r.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

export default function FanIntelligenceMap({ artist }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const [activeModal, setActiveModal] = useState<ActionModal | null>(null);

  const openAction = (type: ActionType, context: string) => setActiveModal({ type, context });
  const closeAction = () => setActiveModal(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width; const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(6,182,212,0.03)'; ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 52) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 52) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      const scanY = (t * 0.3) % H;
      const g = ctx.createLinearGradient(0, scanY - 28, 0, scanY + 28);
      g.addColorStop(0, 'rgba(6,182,212,0)'); g.addColorStop(0.5, 'rgba(6,182,212,0.03)'); g.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = g; ctx.fillRect(0, scanY - 28, W, 56);
      t++; animRef.current = requestAnimationFrame(draw);
    }
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); draw();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    return () => { cancelAnimationFrame(animRef.current); ro.disconnect(); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
      <style>{`
        @keyframes fim-blink     { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes fim-slide-in  { from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)} }
        @keyframes fim-slide-up  { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fim-fade-in   { from{opacity:0}to{opacity:1} }
        @keyframes fim-expand    { from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)} }
      `}</style>

      {activeModal && <ActionModal modal={activeModal} onClose={closeAction} />}

      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.4 }} />

      {/* ── SECTION 1: HEADER ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        <div style={{ padding: '18px 20px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Fan Intelligence</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>Pop / Rock</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>•</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Los Angeles, CA</span>
                <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 11 }}>•</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#06B6D4', letterSpacing: '0.04em' }}>SPIN Records</span>
                <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 4px', fontSize: 10 }}>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'fim-blink 1.4s ease-in-out infinite' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981' }}>Live Action Engine</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Activity size={11} color="rgba(16,185,129,0.5)" />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(16,185,129,0.5)' }}>LIVE · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <KpiCard label="Monthly Listeners" value={fmt(artist.monthlyListeners)} sub={artist.streamingDelta} color="#06B6D4" />
            <KpiCard label="Followers"          value={fmt(artist.followers)}        sub={artist.followerDelta}   color="#10B981" />
            <KpiCard label="Fastest Growing"    value="São Paulo"                    sub="+38% this week"          color="#EC4899" />
            <KpiCard label="Engagement Score"   value={`${artist.fanEngagementScore}/100`} sub="Above industry avg" color="#F59E0B" />
          </div>

          {/* Global quick-action bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginRight: 4 }}>
              <Sparkles size={10} color="rgba(255,255,255,0.3)" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quick actions</span>
            </div>
            {ACTIONS.map(a => {
              const AIcon = a.icon;
              return (
                <button key={a.type} onClick={() => openAction(a.type, 'Global')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: `${a.color}0E`, border: `1px solid ${a.color}25`, color: a.color, fontSize: 10, fontWeight: 700, transition: 'all 0.15s' }}>
                  <AIcon size={11} color={a.color} />
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
        <LiveTicker />
      </div>

      {/* ── SECTION 2: TREND INTELLIGENCE ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#06B6D4' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Trend Intelligence — What Your Fans Want Right Now</span>
        </div>
        <TrendCards onAction={openAction} />
      </div>

      {/* ── SECTION 3: GEO ACTION MAP ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Fan Action Map — Every Insight → Executable Action</span>
        </div>
        <GeoSection onAction={openAction} />
      </div>

      {/* ── SECTION 4: AUDIENCE BEHAVIOR ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EC4899' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Audience Behavior Intelligence</span>
        </div>
        <BehaviorSection />
      </div>

      {/* ── SECTION 5: HIGH VALUE FANS ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <HighValueSection onAction={openAction} />
      </div>

      {/* ── SECTION 6: FOCUS RECS ── */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Where to Focus Next</span>
        </div>
        <FocusRecs onAction={openAction} />
      </div>
    </div>
  );
}
