import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react';
import {
  Globe, TrendingUp, Users, MapPin, BarChart2, Star,
  Zap, Target, Music, ArrowUpRight, Activity,
  Navigation, Layers, Flame, ShoppingBag, Radio, X,
  Brain, Clock, ChevronUp, AlertTriangle, Megaphone,
  TrendingDown, Minus, CheckCircle, Loader, Play,
  ListChecks, Cpu, Wifi,
} from 'lucide-react';
import { useActiveArtist } from '../hooks/useActiveArtist';

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return n.toString();
}

// ── DATA ──────────────────────────────────────────────────────────────────────

const LIVE_TICKS = [
  { text: 'BREAKOUT · São Paulo +31% in 72 hrs — 0 active campaigns. Window is open now.', color: '#10B981', icon: '🟢', priority: 'high' },
  { text: 'SIGNAL · Mexico City creator content driving 2,100 new listeners this week with zero paid support', color: '#EC4899', icon: '📍', priority: 'high' },
  { text: 'TREND · "Flagpole Sitta" nostalgia TikTok clips outperforming promo content 4:1 on saves', color: '#06B6D4', icon: '📈', priority: 'medium' },
  { text: 'OPPORTUNITY · North America merch click rate 3.4x above avg — limited drop could convert now', color: '#F59E0B', icon: '💰', priority: 'high' },
  { text: 'DEMAND · Touring mention spike in fan forums: São Paulo, Chicago, Mexico City — 240% above baseline', color: '#EF4444', icon: '🎤', priority: 'high' },
  { text: 'SEGMENT · 98K superfans identified — zero direct-to-fan activation in last 90 days', color: '#F59E0B', icon: '⭐', priority: 'medium' },
  { text: 'ALERT · Viral Reactors segment +41% MoM — 210K fans need nurture sequence to convert', color: '#EF4444', icon: '⚡', priority: 'high' },
  { text: 'INTEL · Behind-the-scenes content saves 3.1x higher than announcements in LATAM', color: '#06B6D4', icon: '🔍', priority: 'low' },
];

const COUNTRIES = [
  { name: 'United States',  iso: 'US', listeners: 1020000, growth: '+9%',  eng: '82%', merch: 'High',   touring: 'Priority', tag: 'Core',        tagColor: '#06B6D4', oppScore: 88, actions: ['Run Campaign', 'Plan Tour'] },
  { name: 'Brazil',         iso: 'BR', listeners: 310000,  growth: '+31%', eng: '76%', merch: 'Medium', touring: 'Priority', tag: 'Breakout',    tagColor: '#10B981', oppScore: 96, actions: ['Run Campaign', 'Plan Tour', 'Push Creators'] },
  { name: 'Mexico',         iso: 'MX', listeners: 198000,  growth: '+22%', eng: '71%', merch: 'High',   touring: 'High',     tag: 'Surging',     tagColor: '#EC4899', oppScore: 91, actions: ['Push Creators', 'Plan Tour'] },
  { name: 'United Kingdom', iso: 'UK', listeners: 142000,  growth: '+6%',  eng: '58%', merch: 'Medium', touring: 'Medium',   tag: 'Stable',      tagColor: '#F59E0B', oppScore: 62, actions: ['Run Campaign'] },
  { name: 'Canada',         iso: 'CA', listeners: 118000,  growth: '+11%', eng: '64%', merch: 'Medium', touring: 'Medium',   tag: 'Growing',     tagColor: '#06B6D4', oppScore: 71, actions: ['Run Campaign', 'Plan Tour'] },
  { name: 'Argentina',      iso: 'AR', listeners: 87000,   growth: '+18%', eng: '68%', merch: 'Low',    touring: 'Emerging', tag: 'Under-tapped',tagColor: '#10B981', oppScore: 79, actions: ['Push Creators'] },
  { name: 'Australia',      iso: 'AU', listeners: 61000,   growth: '+4%',  eng: '44%', merch: 'Low',    touring: 'Low',      tag: 'Passive',     tagColor: '#6B7280', oppScore: 38, actions: ['Run Campaign'] },
  { name: 'Germany',        iso: 'DE', listeners: 44000,   growth: '+3%',  eng: '38%', merch: 'Low',    touring: 'Low',      tag: 'Passive',     tagColor: '#6B7280', oppScore: 31, actions: ['Run Campaign'] },
];

const STATES = [
  { name: 'California',  country: 'US', listeners: 198000, growth: '+7%',  density: 'High',   touring: 'Priority', merch: 'High',   tag: 'Creator Market', tagColor: '#06B6D4', oppScore: 86, actions: ['Push Creators', 'Run Campaign'] },
  { name: 'Illinois',    country: 'US', listeners: 142000, growth: '+14%', density: 'High',   touring: 'Priority', merch: 'High',   tag: 'Touring Hot',    tagColor: '#EF4444', oppScore: 92, actions: ['Plan Tour', 'Run Campaign'] },
  { name: 'New York',    country: 'US', listeners: 138000, growth: '+9%',  density: 'High',   touring: 'Priority', merch: 'High',   tag: 'High Value',     tagColor: '#F59E0B', oppScore: 89, actions: ['Plan Tour', 'Run Campaign'] },
  { name: 'Texas',       country: 'US', listeners: 117000, growth: '+12%', density: 'Medium', touring: 'High',     merch: 'Medium', tag: 'Growing',        tagColor: '#10B981', oppScore: 74, actions: ['Run Campaign'] },
  { name: 'Florida',     country: 'US', listeners: 88000,  growth: '+8%',  density: 'Medium', touring: 'High',     merch: 'Medium', tag: 'Growing',        tagColor: '#10B981', oppScore: 67, actions: ['Run Campaign'] },
  { name: 'Tennessee',   country: 'US', listeners: 62000,  growth: '+6%',  density: 'Medium', touring: 'Medium',   merch: 'Low',    tag: 'Crossover',      tagColor: '#F59E0B', oppScore: 55, actions: ['Push Creators'] },
  { name: 'São Paulo',   country: 'BR', listeners: 148000, growth: '+38%', density: 'High',   touring: 'Priority', merch: 'Medium', tag: 'Breakout',       tagColor: '#10B981', oppScore: 97, actions: ['Plan Tour', 'Push Creators'] },
  { name: 'Rio',         country: 'BR', listeners: 82000,  growth: '+22%', density: 'High',   touring: 'High',     merch: 'Low',    tag: 'Surging',        tagColor: '#EC4899', oppScore: 83, actions: ['Plan Tour'] },
  { name: 'CDMX',        country: 'MX', listeners: 94000,  growth: '+26%', density: 'High',   touring: 'High',     merch: 'High',   tag: 'Breakout',       tagColor: '#10B981', oppScore: 90, actions: ['Push Creators', 'Plan Tour'] },
  { name: 'Jalisco',     country: 'MX', listeners: 52000,  growth: '+18%', density: 'Medium', touring: 'Medium',   merch: 'Medium', tag: 'Under-tapped',   tagColor: '#06B6D4', oppScore: 72, actions: ['Push Creators'] },
];

const CITIES = [
  { name: 'São Paulo',    country: 'BR', listeners: 148000, growth: '+38%', creator: 'High',   ticket: '6,400+', merch: 'Medium', platform: 'Spotify',     tags: ['Breakout', 'Touring'],    tagColors: ['#10B981', '#EF4444'], oppScore: 97, actions: ['Plan Tour', 'Run Campaign', 'Push Creators'] },
  { name: 'Mexico City',  country: 'MX', listeners: 94000,  growth: '+26%', creator: 'High',   ticket: '4,100+', merch: 'High',   platform: 'Spotify',     tags: ['Surging', 'High Value'],  tagColors: ['#EC4899', '#F59E0B'], oppScore: 91, actions: ['Push Creators', 'Plan Tour'] },
  { name: 'Chicago',      country: 'US', listeners: 88000,  growth: '+14%', creator: 'High',   ticket: '3,800+', merch: 'High',   platform: 'Spotify',     tags: ['Touring', 'Creator'],     tagColors: ['#EF4444', '#06B6D4'], oppScore: 89, actions: ['Plan Tour', 'Push Creators'] },
  { name: 'Los Angeles',  country: 'US', listeners: 112000, growth: '+7%',  creator: 'High',   ticket: '4,900+', merch: 'Medium', platform: 'Apple Music', tags: ['Creator', 'Tastemaker'],  tagColors: ['#06B6D4', '#F59E0B'], oppScore: 84, actions: ['Push Creators', 'Run Campaign'] },
  { name: 'New York',     country: 'US', listeners: 98000,  growth: '+9%',  creator: 'Medium', ticket: '5,200+', merch: 'High',   platform: 'Spotify',     tags: ['Touring', 'High Value'],  tagColors: ['#EF4444', '#F59E0B'], oppScore: 88, actions: ['Plan Tour', 'Run Campaign'] },
  { name: 'Buenos Aires', country: 'AR', listeners: 61000,  growth: '+18%', creator: 'Medium', ticket: '2,100+', merch: 'Low',    platform: 'Spotify',     tags: ['Emerging', 'Under-tapped'],tagColors: ['#10B981', '#06B6D4'],oppScore: 78, actions: ['Push Creators'] },
  { name: 'London',       country: 'UK', listeners: 78000,  growth: '+6%',  creator: 'Medium', ticket: '3,200+', merch: 'Medium', platform: 'Apple Music', tags: ['Stable'],                 tagColors: ['#F59E0B'],            oppScore: 61, actions: ['Run Campaign'] },
  { name: 'Nashville',    country: 'US', listeners: 42000,  growth: '+6%',  creator: 'Low',    ticket: '1,400+', merch: 'Low',    platform: 'Spotify',     tags: ['Crossover'],              tagColors: ['#F59E0B'],            oppScore: 48, actions: ['Push Creators'] },
];

const SEGMENTS = [
  {
    id: 'superfans',
    name: 'Superfans',
    size: '98K',
    growth: '+6% MoM',
    growthColor: '#F59E0B',
    icon: Star,
    color: '#F59E0B',
    desc: 'Stream full albums, follow all platforms, attend shows, highest merch conversion.',
    monetization: 'Fan club + early access = $8–14 MRR per fan. Est. revenue: $784K–$1.37M/yr.',
    bestAction: 'Launch Fan Club',
    repeatRate: '88%',
    ltv: '$148',
    ltvColor: '#F59E0B',
    platform: 'Spotify + Tidal',
    topSong: 'Move Along',
    nextMove: 'Build fan club + limited merch drop',
  },
  {
    id: 'casual',
    name: 'Casual Repeat Listeners',
    size: '340K',
    growth: '+24% MoM',
    growthColor: '#06B6D4',
    icon: Radio,
    color: '#06B6D4',
    desc: 'Discovered via TikTok / playlists. Listen 1–2 songs. Largest convertible segment.',
    monetization: 'Converting 15% to core fans over 90 days = +51K superfan pipeline. High volume play.',
    bestAction: 'Build Nurture Flow',
    repeatRate: '38%',
    ltv: '$12',
    ltvColor: '#06B6D4',
    platform: 'Spotify',
    topSong: 'Flagpole Sitta',
    nextMove: 'Build content nurture flow',
  },
  {
    id: 'highltv',
    name: 'High-LTV Buyers',
    size: '62K',
    growth: '+9% MoM',
    growthColor: '#10B981',
    icon: ShoppingBag,
    color: '#10B981',
    desc: 'Actively clicking merch links, cart-adds, product saves. Purchase intent is live right now.',
    monetization: 'Limited drop targeting this segment = est. $28K–40K direct. Highest ROI per dollar spent.',
    bestAction: 'Drop Merch Now',
    repeatRate: '61%',
    ltv: '$87',
    ltvColor: '#10B981',
    platform: 'Apple Music',
    topSong: 'Dirty Little Secret',
    nextMove: 'Launch limited catalog merch drop',
  },
  {
    id: 'presave',
    name: 'Pre-Save Responders',
    size: '48K',
    growth: '+14% MoM',
    growthColor: '#EC4899',
    icon: Zap,
    color: '#EC4899',
    desc: 'Pre-saved past releases. Strongest early-adopter signal in the catalog. Re-engage now.',
    monetization: 'Pre-save for re-release + bonus content = 3–4x streaming day-1 vs. standard launch.',
    bestAction: 'Pre-Save Campaign',
    repeatRate: '52%',
    ltv: '$34',
    ltvColor: '#EC4899',
    platform: 'Spotify',
    topSong: 'It Ends Tonight',
    nextMove: 'Pre-save campaign for next drop',
  },
  {
    id: 'viral',
    name: 'Viral Reactors',
    size: '210K',
    growth: '+41% MoM',
    growthColor: '#EF4444',
    icon: Flame,
    color: '#EF4444',
    desc: 'Found via nostalgia TikTok/Reels clips. High volume, low depth. Spike window open.',
    monetization: 'Volume conversion play. Sustain spike → playlist follows → 30K+ net new fans est.',
    bestAction: 'Push Creators Now',
    repeatRate: '22%',
    ltv: '$8',
    ltvColor: '#EF4444',
    platform: 'TikTok → Spotify',
    topSong: 'Flagpole Sitta',
    nextMove: 'Creator brief + playlist push',
  },
  {
    id: 'touring',
    name: 'Touring Candidates',
    size: '220K',
    growth: '+12% MoM',
    growthColor: '#EC4899',
    icon: Navigation,
    color: '#EC4899',
    desc: 'Fan density + streaming growth + forum demand converge in 6 cities. Demand is real.',
    monetization: '6-stop route est. 18K tickets. Avg $52 yield = $936K+ gross. Merch on top.',
    bestAction: 'Build Tour Route',
    repeatRate: '68%',
    ltv: '$62',
    ltvColor: '#EC4899',
    platform: 'Spotify + Apple Music',
    topSong: 'Move Along',
    nextMove: 'Build tour route now',
  },
];

const DRILL_DETAIL: Record<string, {
  topSongs: string[];
  platforms: string[];
  behaviors: string[];
  merchDemand: string;
  touringScore: string;
  engScore: string;
  nextMove: string;
  actions: { label: string; color: string }[];
}> = {
  'United States': {
    topSongs: ['Move Along', 'Flagpole Sitta', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    behaviors: ['North America is highest LTV market', 'Merch click rate 3.4x above average', 'Weekend streaming peak 10PM–2AM'],
    merchDemand: 'High',
    touringScore: 'Priority',
    engScore: '82%',
    nextMove: 'Merch drop + tour announcement targeting NYC, Chicago, LA',
    actions: [{ label: 'Launch Merch', color: '#F59E0B' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'Brazil': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'YouTube', 'Deezer'],
    behaviors: ['Portuguese captions outperform English 2:1', 'Nostalgia clips 4x engagement', 'Behind-the-scenes saves 3.1x higher'],
    merchDemand: 'Medium',
    touringScore: 'Priority',
    engScore: '76%',
    nextMove: 'Launch PT-language social + São Paulo tour date announcement',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'Mexico': {
    topSongs: ['Flagpole Sitta', 'The Last Song', 'Move Along', 'Gives You Hell'],
    platforms: ['Spotify', 'YouTube', 'Apple Music'],
    behaviors: ['Merch link clicks above avg by 62%', 'Creator-led content driving discovery', 'Pre-save engagement high'],
    merchDemand: 'High',
    touringScore: 'High',
    engScore: '71%',
    nextMove: 'Merch campaign + Spanish creator brief + CDMX tour date',
    actions: [{ label: 'Activate LATAM', color: '#EC4899' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Schedule Content', color: '#F59E0B' }],
  },
  'São Paulo': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'YouTube', 'Deezer'],
    behaviors: ['Fastest growing city globally +38%', 'Nostalgia content 4x baseline engagement', 'Fan forums: "when are they touring" up 240%'],
    merchDemand: 'Medium',
    touringScore: 'Priority',
    engScore: '78%',
    nextMove: 'Book São Paulo venue. Launch PT-language promo now.',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'Mexico City': {
    topSongs: ['Flagpole Sitta', 'The Last Song', 'Move Along', 'Gives You Hell'],
    platforms: ['Spotify', 'YouTube', 'Apple Music'],
    behaviors: ['Merch click +62% above avg', 'Creator discovery dominant', 'Weekend streaming 3x weekday'],
    merchDemand: 'High',
    touringScore: 'High',
    engScore: '71%',
    nextMove: 'Merch + tour announcement + Spanish creator brief',
    actions: [{ label: 'Activate Campaign', color: '#EC4899' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Open Strategy', color: '#F59E0B' }],
  },
  'Chicago': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'Stab My Back'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    behaviors: ['Tidal share unusually high (18%)', 'Weekend streaming dominates', 'Alt-music podcast fans adding 800+ fans/wk'],
    merchDemand: 'High',
    touringScore: 'Priority',
    engScore: '79%',
    nextMove: 'Top-3 touring market — book venue now. Creator outreach.',
    actions: [{ label: 'Launch Campaign', color: '#10B981' }, { label: 'Plan Tour', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }],
  },
  'superfans': {
    topSongs: ['Move Along', 'Flagpole Sitta', 'Dirty Little Secret', 'It Ends Tonight', 'Stab My Back'],
    platforms: ['Spotify', 'Tidal', 'Apple Music'],
    behaviors: ['Streams full albums (not just singles)', 'Follow rate across all platforms 68%', 'Highest merch conversion (12%) of all segments'],
    merchDemand: 'High',
    touringScore: 'Priority',
    engScore: '92%',
    nextMove: 'Fan club + limited merch drop. Inner circle launch.',
    actions: [{ label: 'Build Fan Club', color: '#F59E0B' }, { label: 'Open Fan Activation', color: '#EC4899' }, { label: 'Schedule Content', color: '#10B981' }],
  },
  'highltv': {
    topSongs: ['Flagpole Sitta', 'Move Along', 'Dirty Little Secret', 'Stab My Back'],
    platforms: ['Spotify', 'Apple Music', 'Spotify'],
    behaviors: ['Product link click rate 3.4x above avg', 'Cart abandonment high — bundle or discount closes', 'North America concentrated (78%)'],
    merchDemand: 'High',
    touringScore: 'High',
    engScore: '74%',
    nextMove: 'Limited catalog merch drop + bundle. Target North America.',
    actions: [{ label: 'Open Merch Strategy', color: '#10B981' }, { label: 'Launch Campaign', color: '#06B6D4' }, { label: 'Schedule Content', color: '#F59E0B' }],
  },
  'viral': {
    topSongs: ['Flagpole Sitta', 'Dirty Little Secret', 'Move Along'],
    platforms: ['TikTok → Spotify', 'Reels → Spotify'],
    behaviors: ['Spike-driven — nostalgia clips sustain loop', 'Very low playlist save rate (9%)', 'Convert via creator + pre-save push'],
    merchDemand: 'Low',
    touringScore: 'Low',
    engScore: '31%',
    nextMove: 'Creator brief + pre-save conversion campaign within 7 days of spike',
    actions: [{ label: 'Build Nurture Flow', color: '#EF4444' }, { label: 'Creator Brief', color: '#06B6D4' }, { label: 'Pre-Save Campaign', color: '#EC4899' }],
  },
  'touring': {
    topSongs: ['Move Along', 'Flagpole Sitta', 'Dirty Little Secret', 'It Ends Tonight'],
    platforms: ['Spotify', 'Apple Music', 'Tidal'],
    behaviors: ['Pre-show announcement posts 3x avg engagement', 'Ticket intent signals active in 4 cities', 'Fan forum touring mentions up 240%'],
    merchDemand: 'High',
    touringScore: 'Priority',
    engScore: '77%',
    nextMove: 'Route 6-stop run: São Paulo → Mexico City → Chicago → New York → London → LA',
    actions: [{ label: 'Build Tour Route', color: '#EF4444' }, { label: 'Target Ads', color: '#06B6D4' }, { label: 'Plan Tour Market', color: '#F59E0B' }],
  },
};

const TREND_MOMENTUM_KEYS = ['nostalgia', 'creator', 'culture', 'merch', 'touring', 'social'];

const TREND_CARDS = [
  {
    title: 'What Fans Respond To',
    icon: Music,
    color: '#06B6D4',
    momentumKey: 'nostalgia',
    why: 'Your catalog has a nostalgia moat. Fans discover via throwback content and stay for depth — this is a compounding asset if you activate it intentionally.',
    signals: [
      { label: 'Nostalgia clips', sub: 'Outperform promo 4:1 in saves', hot: true },
      { label: 'Acoustic + stripped', sub: '2.1x longer session time vs standard posts', hot: false },
      { label: 'Early 2000s callbacks', sub: '+38% playlist adds vs newer material', hot: true },
    ],
    cta: 'Build Content Plan',
    ctaColor: '#06B6D4',
  },
  {
    title: 'Hot Content Formats',
    icon: Radio,
    color: '#EC4899',
    momentumKey: 'creator',
    why: 'Creator-led discovery is outpacing your own posts. You\'re getting discovery from creators you haven\'t even briefed yet — a structured creator program could 3x this.',
    signals: [
      { label: 'Creator-led short-form', sub: 'Driving more discovery than brand posts', hot: true },
      { label: 'Reels → Spotify conversion', sub: '18% higher than TikTok this quarter', hot: false },
      { label: 'Behind-the-scenes saves', sub: '3.1x higher in LATAM than announcement posts', hot: true },
    ],
    cta: 'Activate Creators',
    ctaColor: '#EC4899',
  },
  {
    title: 'Culture / Lifestyle Signals',
    icon: Layers,
    color: '#F59E0B',
    momentumKey: 'culture',
    why: 'LATAM fans are treating this as an identity marker — not passive listening. That level of cultural attachment is rare and means merch, tours, and collabs will overperform there.',
    signals: [
      { label: 'LATAM nostalgia resonance', sub: 'Strongest in Brazil + Mexico — identity-level attachment', hot: true },
      { label: 'Merch + lifestyle crossover', sub: 'Fans want wearable artist identity, not just music', hot: false },
      { label: 'Late-night peak 10PM–2AM', sub: 'Across all key markets — emotional listening context', hot: false },
    ],
    cta: 'Open Strategy',
    ctaColor: '#F59E0B',
  },
  {
    title: 'Merch / Product Interest',
    icon: ShoppingBag,
    color: '#10B981',
    momentumKey: 'merch',
    why: 'Cart-add intent is spiking with nothing to buy. Every day without a drop is revenue left on the table. North America is primed — this window closes if a competitor drops first.',
    signals: [
      { label: 'Cart-add intent rising', sub: '+14% MoM in North America, nothing to convert to', hot: true },
      { label: 'Retro tour tee demand', sub: 'High in NYC, Chicago, LA — nostalgia aesthetic', hot: true },
      { label: 'Bundle intent up', sub: 'Streaming + merch bundle intent +22% — monetize the depth', hot: false },
    ],
    cta: 'Open Merch Strategy',
    ctaColor: '#10B981',
  },
  {
    title: 'Tour Market Indicators',
    icon: Navigation,
    color: '#EF4444',
    momentumKey: 'touring',
    why: 'Fan-forum touring mentions are at all-time high with zero announcement. This is organic demand that will go cold if it\'s not captured within 60 days with a venue announcement.',
    signals: [
      { label: '"When are they touring"', sub: 'Fan forum mentions up 240% — organic demand signal', hot: true },
      { label: 'São Paulo + Mexico City', sub: 'Highest demand, zero supply — act before it peaks', hot: true },
      { label: 'Chicago ticket signals', sub: '3,800+ estimated demand — top 3 US market', hot: false },
    ],
    cta: 'Plan Tour Route',
    ctaColor: '#EF4444',
  },
  {
    title: 'Social Platform Momentum',
    icon: TrendingUp,
    color: '#F59E0B',
    momentumKey: 'social',
    why: 'TikTok → Spotify is the discovery pipeline right now. YouTube LATAM is rising without investment. These are free distribution channels — every post that lands compounds.',
    signals: [
      { label: 'TikTok → Spotify', sub: 'Highest conversion channel — discovery pipeline is hot', hot: true },
      { label: 'Instagram saves', sub: '+19% MoM on promo posts — save intent means replay intent', hot: false },
      { label: 'YouTube LATAM plays', sub: '+28% in LATAM with no paid support — organic surge', hot: true },
    ],
    cta: 'View Platform Intel',
    ctaColor: '#F59E0B',
  },
];

const AI_COMMANDS = [
  {
    rank: 1,
    priority: 'CRITICAL',
    priorityColor: '#EF4444',
    title: 'Launch nostalgia content campaign in Brazil and Mexico',
    confidence: 94,
    outcome: 'Est. +60K new listeners · +31% stream growth sustained',
    horizon: '7–14 days',
    reasoning: 'Brazil is generating 4,100 new listeners per week with zero paid activation — that is free signal you are not capitalizing on. Mexico City creator content is already driving 2,100 new fans organically this week. Both markets convert on early-2000s nostalgia content at 4x your other formats. Every week without a paid campaign costs an estimated 8K–12K listeners. The ROI window is highest now: CPMs are low and intent is at peak.',
    cta: 'Build Content Plan',
    ctaColor: '#EF4444',
    icon: Flame,
  },
  {
    rank: 2,
    priority: 'HIGH',
    priorityColor: '#F59E0B',
    title: 'Drop a limited merch bundle targeting North America',
    confidence: 91,
    outcome: 'Est. $28K–40K direct revenue · High-LTV segment conversion',
    horizon: '10–21 days',
    reasoning: '62K High-LTV fans are actively clicking product links with nothing to purchase — cart-add intent is up 14% month-over-month and your average LTV is $87 per buyer. That is $5.4M in addressable lifetime value sitting in a warm segment right now. A retro catalog bundle converts this demand at above-average rates. Every day without a live product is $1K–2K in abandoned revenue.',
    cta: 'Open Merch Strategy',
    ctaColor: '#F59E0B',
    icon: ShoppingBag,
  },
  {
    rank: 3,
    priority: 'HIGH',
    priorityColor: '#EC4899',
    title: 'Brief and activate creators in Mexico City and Chicago',
    confidence: 88,
    outcome: '+18% Spotify link click conversion · 2–3 week spike sustained',
    horizon: '5–10 days',
    reasoning: 'Unbriefed creators are already outperforming your own posts — reels-to-Spotify conversion is 18% higher this quarter than TikTok, and no budget has been spent. Mexico City is streaming +26% this week. Chicago has 3,800+ verified ticket intent signals. A $0-brief structured creator push in both markets converts organic momentum into sustained playlist follows and locks in that growth before the algorithm cycle resets in 10 days.',
    cta: 'Activate Creators',
    ctaColor: '#EC4899',
    icon: Megaphone,
  },
  {
    rank: 4,
    priority: 'HIGH',
    priorityColor: '#EF4444',
    title: 'Announce 6-stop tour: São Paulo → Mexico City → Chicago → NYC → London → LA',
    confidence: 86,
    outcome: 'Est. 18K tickets · $936K+ gross · Merch on top',
    horizon: '30–60 days announcement',
    reasoning: 'Touring demand mentions are 240% above baseline with zero dates announced — that is unmet demand at peak. São Paulo and Mexico City are your fastest-growing cities globally, both without a single show on the map. Chicago carries 3,800+ verified ticket intent signals. Demand like this typically decays 50–60 days after peak if left unmet. Announcing now captures it; waiting hands the market to the next artist who does.',
    cta: 'Plan Tour Route',
    ctaColor: '#EF4444',
    icon: Navigation,
  },
  {
    rank: 5,
    priority: 'MEDIUM',
    priorityColor: '#06B6D4',
    title: 'Launch fan club for the 98K Superfan segment',
    confidence: 82,
    outcome: 'Est. $784K–$1.37M/yr MRR at $8–14/mo · Highest LTV activation',
    horizon: '21–45 days',
    reasoning: 'Your 98K Superfans stream full albums, maintain an 88% repeat rate, and follow across every platform — but they have no direct-to-fan access. At $8–14/mo, this segment generates $784K–$1.37M/yr in predictable recurring revenue. Fan club members also convert 3x higher on merch and touring. This is the highest ROI per-fan activation in your entire audience. The only cost is not building it sooner.',
    cta: 'Build Fan Club',
    ctaColor: '#06B6D4',
    icon: Star,
  },
  {
    rank: 6,
    priority: 'MEDIUM',
    priorityColor: '#10B981',
    title: 'Build nurture sequence for 210K Viral Reactors before spike fades',
    confidence: 78,
    outcome: '30K+ estimated net new core fans · Pipeline for next 90 days',
    horizon: '7 days to activate',
    reasoning: '"Flagpole Sitta" nostalgia clips are generating 41K new reactors this cycle, but this audience converts at only 9% to playlist saves — the spike will decay in 10–14 days without intervention. Launching a pre-save redirect + creator brief within 7 days of spike peak converts 12–15% of volume into lasting followers. Missing this window means 210K potential fans cycle through and leave. The infrastructure cost is one campaign brief.',
    cta: 'Build Nurture Flow',
    ctaColor: '#10B981',
    icon: Zap,
  },
];

const BEHAVIOR_DATA = [
  { label: 'Playlist Save Rate', value: '34%', note: 'Strong retention — audience keeps songs, not just sampling.', color: '#10B981', icon: Star },
  { label: 'Repeat Listen Rate', value: '71%', note: 'Deep listener base. Album campaigns outperform single-focused.', color: '#06B6D4', icon: Activity },
  { label: 'Cross-Listen Rate', value: '58%', note: '3+ songs per session. Deep catalog resonance.', color: '#F59E0B', icon: Music },
  { label: 'Merch Interest', value: '12%', note: 'Click-to-cart intent above category avg. Activate a drop.', color: '#F59E0B', icon: ShoppingBag },
  { label: 'Followback Rate', value: '29%', note: '1 in 3 stream-discoverers follows back.', color: '#EC4899', icon: Users },
  { label: 'Pre-Save Tendency', value: '18%', note: 'Above baseline. Pre-save campaigns will outperform industry avg.', color: '#EF4444', icon: Zap },
];

// ── EXECUTION STATE TYPES ─────────────────────────────────────────────────────

type ExecState = 'ready' | 'inprogress' | 'live' | 'results';

interface ExecStatus {
  state: ExecState;
  startedAt?: number;
  results?: { label: string; value: string; color: string }[];
}

// ── MOMENTUM DATA ─────────────────────────────────────────────────────────────

const MOMENTUM_MAP: Record<string, { dir: 'up' | 'stable' | 'down'; label: string; color: string }> = {
  'Brazil':        { dir: 'up',     label: 'Accelerating',  color: '#10B981' },
  'Mexico':        { dir: 'up',     label: 'Surging',       color: '#EC4899' },
  'United States': { dir: 'stable', label: 'Stable',        color: '#F59E0B' },
  'Canada':        { dir: 'up',     label: 'Rising',        color: '#06B6D4' },
  'Argentina':     { dir: 'up',     label: 'Building',      color: '#10B981' },
  'United Kingdom':{ dir: 'stable', label: 'Holding',       color: '#F59E0B' },
  'Australia':     { dir: 'down',   label: 'Cooling',       color: '#EF4444' },
  'Germany':       { dir: 'down',   label: 'Flat',          color: '#6B7280' },
  'São Paulo':     { dir: 'up',     label: 'Accelerating',  color: '#10B981' },
  'CDMX':          { dir: 'up',     label: 'Surging',       color: '#EC4899' },
  'Chicago':       { dir: 'up',     label: 'Rising',        color: '#06B6D4' },
  'Illinois':      { dir: 'up',     label: 'Rising',        color: '#06B6D4' },
  'New York':      { dir: 'stable', label: 'Stable',        color: '#F59E0B' },
  'California':    { dir: 'stable', label: 'Stable',        color: '#F59E0B' },
  'Texas':         { dir: 'up',     label: 'Growing',       color: '#10B981' },
  'Rio':           { dir: 'up',     label: 'Surging',       color: '#EC4899' },
  'nostalgia':     { dir: 'up',     label: 'Accelerating',  color: '#10B981' },
  'creator':       { dir: 'up',     label: 'Surging',       color: '#EC4899' },
  'culture':       { dir: 'stable', label: 'Stable',        color: '#F59E0B' },
  'merch':         { dir: 'up',     label: 'Accelerating',  color: '#10B981' },
  'touring':       { dir: 'up',     label: 'Peak Signal',   color: '#EF4444' },
  'social':        { dir: 'up',     label: 'Rising',        color: '#06B6D4' },
};

// ── TIME SENSITIVITY ──────────────────────────────────────────────────────────

const CMD_URGENCY = [
  { window: '7–14 days', urgency: 'peak now',     urgencyColor: '#EF4444', blinking: true  },
  { window: '10–21 days', urgency: 'window open', urgencyColor: '#F59E0B', blinking: false },
  { window: '5–10 days', urgency: 'peak now',     urgencyColor: '#EF4444', blinking: true  },
  { window: '30–60 days', urgency: 'cooling soon', urgencyColor: '#EC4899', blinking: false },
  { window: '21–45 days', urgency: 'stable',      urgencyColor: '#06B6D4', blinking: false },
  { window: '7 days',     urgency: 'act now',      urgencyColor: '#EF4444', blinking: true  },
];

// ── LIVE PERFORMANCE FEEDBACK ─────────────────────────────────────────────────

const PERF_ENTRIES = [
  {
    id: 'brazil-organic',
    type: 'organic',
    typeColor: '#10B981',
    title: 'Brazil Organic Growth — No Active Campaign',
    status: 'live',
    startedLabel: '72 hrs ago',
    metric1: { label: 'New Listeners', value: '+4,100', color: '#10B981', delta: '▲ 31%' },
    metric2: { label: 'Stream Sessions', value: '+12K', color: '#10B981', delta: '▲ 28%' },
    metric3: { label: 'Revenue Signal', value: '+$840', color: '#F59E0B', delta: 'est.' },
    insight: 'São Paulo discovery is running on creator content you haven\'t briefed. Capitalizing with a paid campaign here would multiply current momentum 4–6x.',
    insightColor: '#10B981',
    momentum: 'up',
  },
  {
    id: 'nostalgia-tiktok',
    type: 'viral',
    typeColor: '#EC4899',
    title: '"Flagpole Sitta" Nostalgia Spike — TikTok',
    status: 'live',
    startedLabel: '6 days ago',
    metric1: { label: 'Viral Reactors', value: '+41K', color: '#EC4899', delta: '▲ 41% MoM' },
    metric2: { label: 'Spotify Add Rate', value: '18%', color: '#06B6D4', delta: '+3.2pts' },
    metric3: { label: 'Creator Posts', value: '214', color: '#EC4899', delta: 'organic' },
    insight: 'This spike is generating its own content cycle. Window to capture is 7–10 days before decay. A creator brief now extends the run by 2–3 weeks.',
    insightColor: '#EC4899',
    momentum: 'up',
  },
  {
    id: 'merch-intent',
    type: 'intent signal',
    typeColor: '#F59E0B',
    title: 'North America Merch Intent — No Product Live',
    status: 'live',
    startedLabel: '14 days ago',
    metric1: { label: 'Cart-Add Clicks', value: '+14%', color: '#F59E0B', delta: 'MoM' },
    metric2: { label: 'Link-Clicks', value: '3.4x avg', color: '#F59E0B', delta: '▲ above avg' },
    metric3: { label: 'Est. Revenue Ready', value: '$28K+', color: '#10B981', delta: 'if live now' },
    insight: 'High-LTV buyers are clicking links with nothing to purchase. Every day without a merch drop is abandoned revenue. The demand is warm right now.',
    insightColor: '#F59E0B',
    momentum: 'stable',
  },
  {
    id: 'touring-demand',
    type: 'demand signal',
    typeColor: '#EF4444',
    title: 'Touring Demand — Fan Forums + Streaming',
    status: 'live',
    startedLabel: '21 days ago',
    metric1: { label: 'Forum Mentions', value: '240%', color: '#EF4444', delta: '▲ vs baseline' },
    metric2: { label: 'Cities Flagged', value: '6', color: '#EF4444', delta: 'São Paulo, Chicago +' },
    metric3: { label: 'Est. Ticket Demand', value: '18K+', color: '#F59E0B', delta: 'across markets' },
    insight: 'Organic touring demand is near all-time high. No announcement exists. This signal typically decays 60 days after peak if unmet — the countdown has started.',
    insightColor: '#EF4444',
    momentum: 'up',
  },
];

// ── SYSTEM MODES ──────────────────────────────────────────────────────────────

const SYSTEM_MODES = {
  conservative: {
    label: 'Conservative',
    color: '#06B6D4',
    description: 'Low-risk, organic-first. Prioritize retention and slow growth over aggressive spend.',
    multiplier: 0.7,
  },
  balanced: {
    label: 'Balanced',
    color: '#10B981',
    description: 'Optimal mix of organic amplification and targeted campaigns across all markets.',
    multiplier: 1.0,
  },
  aggressive: {
    label: 'Aggressive',
    color: '#EF4444',
    description: 'Maximum acceleration. High spend, full market activation. Maximize growth windows.',
    multiplier: 1.4,
  },
} as const;

type SystemMode = keyof typeof SYSTEM_MODES;

// ── RESULTS TEMPLATES ─────────────────────────────────────────────────────────

const EXEC_RESULTS: Record<string, { label: string; value: string; color: string }[]> = {
  'Run Campaign':   [{ label: 'Reach', value: '+48K', color: '#06B6D4' }, { label: 'CTR', value: '3.8%', color: '#10B981' }, { label: 'Stream +', value: '+12%', color: '#F59E0B' }],
  'Plan Tour':      [{ label: 'Cities Mapped', value: '6', color: '#EF4444' }, { label: 'Est. Demand', value: '18K+', color: '#F59E0B' }, { label: 'Gross Est.', value: '$936K', color: '#10B981' }],
  'Push Creators':  [{ label: 'Creators Briefed', value: '24', color: '#EC4899' }, { label: 'Posts Live', value: '12', color: '#EC4899' }, { label: 'Stream +', value: '+19%', color: '#10B981' }],
  'Build Content Plan': [{ label: 'Content Items', value: '8', color: '#06B6D4' }, { label: 'Reach Est.', value: '+60K', color: '#10B981' }, { label: 'Saves +', value: '+22%', color: '#F59E0B' }],
  'Open Merch Strategy':[{ label: 'SKUs Ready', value: '4', color: '#F59E0B' }, { label: 'Rev Est.', value: '$34K', color: '#10B981' }, { label: 'Segment', value: '62K fans', color: '#EC4899' }],
  'Activate Creators':  [{ label: 'Creators', value: '31', color: '#EC4899' }, { label: 'Est. Views', value: '2.1M', color: '#EC4899' }, { label: 'Conv Rate', value: '18%', color: '#10B981' }],
  'Plan Tour Route':    [{ label: 'Route', value: '6 stops', color: '#EF4444' }, { label: 'Demand', value: '18K+', color: '#F59E0B' }, { label: 'Timeline', value: '8 wks', color: '#06B6D4' }],
  'Build Fan Club':     [{ label: 'Target', value: '98K fans', color: '#F59E0B' }, { label: 'MRR Est.', value: '$784K', color: '#10B981' }, { label: 'Tier 1 Price', value: '$8/mo', color: '#06B6D4' }],
  'Build Nurture Flow': [{ label: 'Segment', value: '210K', color: '#EF4444' }, { label: 'Conv. Est.', value: '30K fans', color: '#10B981' }, { label: 'Timeline', value: '90 days', color: '#06B6D4' }],
};

type DrillTab = 'countries' | 'states' | 'cities' | 'segments';

// ── SUB COMPONENTS ────────────────────────────────────────────────────────────

function LiveSignalBar() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % LIVE_TICKS.length);
        setVisible(true);
      }, 300);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const tick = LIVE_TICKS[activeIdx];
  const priorityBg = tick.priority === 'high' ? 'rgba(239,68,68,0.06)' : tick.priority === 'medium' ? 'rgba(245,158,11,0.05)' : 'rgba(6,182,212,0.04)';
  const priorityBorder = tick.priority === 'high' ? 'rgba(239,68,68,0.15)' : tick.priority === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(6,182,212,0.1)';

  return (
    <div style={{ background: '#0A0B0D', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Label row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' }} ref={scrollRef}>
        {LIVE_TICKS.map((t2, i) => (
          <button key={i} onClick={() => { setActiveIdx(i); setVisible(true); }}
            style={{ flexShrink: 0, padding: '6px 14px', fontSize: 8, fontFamily: 'monospace', color: i === activeIdx ? t2.color : 'rgba(255,255,255,0.18)', background: i === activeIdx ? `${t2.color}08` : 'transparent', border: 'none', borderBottom: i === activeIdx ? `2px solid ${t2.color}` : '2px solid transparent', cursor: 'pointer', letterSpacing: '0.08em', transition: 'all 0.2s', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
            {t2.priority === 'high' ? '● ' : '○ '}{t2.text.split('·')[0].trim()}
          </button>
        ))}
      </div>
      {/* Active message */}
      <div style={{ padding: '8px 16px 10px', background: priorityBg, borderTop: `1px solid ${priorityBorder}`, opacity: visible ? 1 : 0, transition: 'opacity 0.3s', minHeight: 38 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: tick.color, boxShadow: `0 0 6px ${tick.color}88`, flexShrink: 0, marginTop: 4, animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
          <div style={{ flex: 1 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: tick.color, lineHeight: 1.6, fontWeight: 600 }}>{tick.text}</span>
          </div>
          <div style={{ display: 'flex', gap: 3, flexShrink: 0, alignItems: 'center', paddingTop: 2 }}>
            {LIVE_TICKS.map((_, i) => (
              <div key={i} onClick={() => { setActiveIdx(i); setVisible(true); }} style={{ width: i === activeIdx ? 16 : 4, height: 3, borderRadius: 2, background: i === activeIdx ? tick.color : 'rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'width 0.25s, background 0.25s' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OppScoreBar({ score, color }: { score: number; color: string }) {
  const c = score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : score >= 50 ? '#06B6D4' : '#6B7280';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
      <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${score}%`, background: c, borderRadius: 2, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 9, color: c, fontWeight: 700, width: 22 }}>{score}</span>
    </div>
  );
}

const ACTION_COLORS: Record<string, string> = {
  'Run Campaign':       '#06B6D4',
  'Plan Tour':          '#EF4444',
  'Push Creators':      '#EC4899',
  'Build Content Plan': '#06B6D4',
  'Open Merch Strategy':'#10B981',
  'Activate Creators':  '#EC4899',
  'Plan Tour Route':    '#EF4444',
  'Build Fan Club':     '#F59E0B',
  'Build Nurture Flow': '#EF4444',
};

// ── ACTION SOURCES (for feedback loop tagging) ────────────────────────────────

const ACTION_SOURCE_LABELS: Record<string, string> = {
  'Run Campaign':       'Launched from AI Command Center',
  'Plan Tour':          'Launched from Geo Drilldown',
  'Push Creators':      'Launched from Trend Signals',
  'Build Content Plan': 'Launched from AI Command Center',
  'Open Merch Strategy':'Launched from High-Value Intelligence',
  'Activate Creators':  'Launched from AI Command Center',
  'Plan Tour Route':    'Launched from AI Command Center',
  'Build Fan Club':     'Launched from AI Command Center',
  'Build Nurture Flow': 'Launched from AI Command Center',
};

// ── SYSTEM MEMORY TYPES ───────────────────────────────────────────────────────

interface ActionRecord {
  id: string;
  label: string;
  color: string;
  state: ExecState;
  startedAt: number;
  completedAt?: number;
  dayActive?: number;
  results?: { label: string; value: string; color: string }[];
  source?: string;
}

interface SystemMemoryCtx {
  actions: Record<string, ActionRecord>;
  launch: (id: string, label: string, color: string, source?: string) => void;
  getAction: (id: string) => ActionRecord | undefined;
}

const SystemMemoryContext = createContext<SystemMemoryCtx>({
  actions: {},
  launch: () => {},
  getAction: () => undefined,
});

function SystemMemoryProvider({ children }: { children: React.ReactNode }) {
  const [actions, setActions] = useState<Record<string, ActionRecord>>({});

  const launch = useCallback((id: string, label: string, color: string, source?: string) => {
    setActions(prev => {
      if (prev[id]?.state !== 'ready' && prev[id] !== undefined) return prev;
      return { ...prev, [id]: { id, label, color, source, state: 'inprogress', startedAt: Date.now() } };
    });
    setTimeout(() => {
      setActions(prev => ({
        ...prev,
        [id]: { ...prev[id]!, state: 'live', dayActive: 1 },
      }));
    }, 1800);
    setTimeout(() => {
      setActions(prev => ({
        ...prev,
        [id]: { ...prev[id]!, state: 'results', completedAt: Date.now(), results: EXEC_RESULTS[label] ?? [] },
      }));
    }, 7000);
  }, []);

  const getAction = useCallback((id: string) => actions[id], [actions]);

  const value = useMemo(() => ({ actions, launch, getAction }), [actions, launch, getAction]);

  return (
    <SystemMemoryContext.Provider value={value}>
      {children}
    </SystemMemoryContext.Provider>
  );
}

function useSystemMemory() {
  return useContext(SystemMemoryContext);
}

// ── EXEC BUTTON (connected to system memory) ──────────────────────────────────

function ExecBtn({ label, color, instanceId, source }: { label: string; color: string; instanceId?: string; source?: string }) {
  const mem = useSystemMemory();
  const id = instanceId ?? label;
  const rec = mem.getAction(id);
  const state: ExecState = rec?.state ?? 'ready';
  const [elapsed, setElapsed] = useState(0);
  const [dayActive, setDayActive] = useState(1);

  const handleClick = () => {
    if (state !== 'ready') return;
    mem.launch(id, label, color, source ?? ACTION_SOURCE_LABELS[label]);
  };

  useEffect(() => {
    if (state !== 'live') return;
    const start = rec?.startedAt ?? Date.now();
    const t = setInterval(() => {
      const secs = Math.floor((Date.now() - start) / 1000);
      setElapsed(secs);
      setDayActive(Math.max(1, Math.ceil(secs / 3)));
    }, 1000);
    return () => clearInterval(t);
  }, [state, rec?.startedAt]);

  const results = rec?.results ?? EXEC_RESULTS[label] ?? [];

  if (state === 'results') {
    const primary   = results[0];
    const secondary = results[1];
    const summaryLine = [primary, secondary]
      .filter(Boolean)
      .map(r => `${r!.value} ${r!.label}`)
      .join(' · ');

    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6 }}>
        {/* Badge row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 7, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.28)', width: 'fit-content', boxShadow: '0 0 0 2px rgba(16,185,129,0.06)' }}>
          <CheckCircle size={10} color="#10B981" />
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#10B981', fontWeight: 900, letterSpacing: '0.1em' }}>COMPLETED</span>
          {summaryLine && (
            <>
              <span style={{ width: 1, height: 8, background: 'rgba(16,185,129,0.25)' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(16,185,129,0.7)', fontWeight: 600 }}>{summaryLine}</span>
            </>
          )}
        </div>
        {/* Result chips */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {results.slice(0, 3).map((r, ri) => (
            <div key={r.label} style={{ padding: '4px 9px', borderRadius: 6, background: ri === 0 ? `${r.color}14` : `${r.color}0A`, border: `1px solid ${ri === 0 ? r.color + '35' : r.color + '1C'}`, display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: ri === 0 ? 11 : 9, color: r.color, fontWeight: 900, lineHeight: 1 }}>{r.value}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.28)' }}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'live') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 7, background: `${color}10`, border: `1px solid ${color}33`, boxShadow: `0 0 12px ${color}18, 0 0 0 1px ${color}0A` }}>
          {/* Double-ring live dot */}
          <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
            <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1px solid ${color}55`, animation: 'aud-pulse 1.8s ease-in-out infinite' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color, fontWeight: 900, letterSpacing: '0.1em' }}>LIVE</span>
          <span style={{ width: 1, height: 10, background: `${color}30` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${color}99`, letterSpacing: '0.04em' }}>Day {dayActive} · Updating now</span>
        </div>
      </div>
    );
  }

  if (state === 'inprogress') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Loader size={9} color="rgba(255,255,255,0.45)" style={{ animation: 'spin 0.9s linear infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.06em' }}>LAUNCHING…</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 8, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', background: `${color}0C`, border: `1px solid ${color}22`, color, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '0.03em', transition: 'all 0.18s' }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}1A`; e.currentTarget.style.borderColor = `${color}3A`; e.currentTarget.style.boxShadow = `0 0 10px ${color}18`; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}0C`; e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <Play size={7} color={color} />
      {label}
    </button>
  );
}

function ActionBtns({ actions, prefix }: { actions: string[]; prefix?: string }) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {actions.map(a => <ExecBtn key={a} label={a} color={ACTION_COLORS[a] ?? '#6B7280'} instanceId={prefix ? `${prefix}:${a}` : a} />)}
    </div>
  );
}

// ── ACTIVE SYSTEM SUMMARY STRIP ───────────────────────────────────────────────

function ActiveSystemSummaryStrip() {
  const mem = useSystemMemory();
  const allActions = Object.values(mem.actions);

  const campaigns   = allActions.filter(a => ['Build Content Plan', 'Run Campaign', 'Activate Creators', 'Build Nurture Flow'].includes(a.label));
  const creators    = allActions.filter(a => ['Activate Creators', 'Push Creators'].includes(a.label));
  const monetize    = allActions.filter(a => ['Open Merch Strategy', 'Plan Tour Route', 'Build Fan Club'].includes(a.label));

  const liveCampaigns   = campaigns.filter(a => a.state === 'live' || a.state === 'inprogress').length;
  const liveCreators    = creators.filter(a => a.state === 'live' || a.state === 'inprogress').length;
  const liveMonetize    = monetize.filter(a => a.state === 'live' || a.state === 'inprogress').length;
  const completedTotal  = allActions.filter(a => a.state === 'results').length;

  const totalListeners = allActions
    .filter(a => a.state === 'results')
    .reduce((sum, a) => {
      const r = a.results?.find(r =>
        r.label.toLowerCase().includes('reach') ||
        r.label.toLowerCase().includes('listener') ||
        r.label.toLowerCase().includes('conv')
      );
      if (!r) return sum;
      const n = parseInt(r.value.replace(/[^0-9]/g, ''));
      return isNaN(n) ? sum : sum + n;
    }, 0);

  const totalRevenue = allActions
    .filter(a => a.state === 'results')
    .reduce((sum, a) => {
      const r = a.results?.find(r =>
        r.label.toLowerCase().includes('rev') ||
        r.label.toLowerCase().includes('gross') ||
        r.label.toLowerCase().includes('mrr')
      );
      if (!r) return sum;
      const match = r.value.match(/\$?([\d,]+)/);
      return match ? sum + parseInt(match[1].replace(',', '')) : sum;
    }, 0);

  const totalActive = liveCampaigns + liveCreators + liveMonetize;
  const hasAny = totalActive > 0 || completedTotal > 0;

  const STATS = [
    {
      label: 'Campaigns',
      value: liveCampaigns,
      subLabel: 'live',
      color: '#06B6D4',
      live: liveCampaigns > 0,
    },
    {
      label: 'Creator Activations',
      value: liveCreators,
      subLabel: 'running',
      color: '#EC4899',
      live: liveCreators > 0,
    },
    {
      label: 'Monetization',
      value: liveMonetize,
      subLabel: 'active',
      color: '#10B981',
      live: liveMonetize > 0,
    },
    {
      label: 'Completed',
      value: completedTotal,
      subLabel: 'actions',
      color: '#F59E0B',
      live: false,
    },
  ];

  const borderColor = totalActive > 0 ? 'rgba(16,185,129,0.22)' : 'rgba(255,255,255,0.06)';
  const headerBg    = totalActive > 0 ? 'rgba(16,185,129,0.055)' : 'rgba(255,255,255,0.02)';

  return (
    <div style={{ background: '#0A0B0D', border: `1px solid ${borderColor}`, borderRadius: 14, marginBottom: 14, overflow: 'hidden', transition: 'border-color 0.4s', boxShadow: totalActive > 0 ? '0 0 0 1px rgba(16,185,129,0.08), 0 4px 24px rgba(16,185,129,0.05)' : 'none' }}>

      {/* ── SYSTEM ACTIVE header bar ── */}
      <div style={{ padding: '7px 16px', background: headerBg, borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: totalActive > 0 ? '#10B981' : 'rgba(255,255,255,0.15)', boxShadow: totalActive > 0 ? '0 0 8px #10B981' : 'none', animation: totalActive > 0 ? 'aud-pulse 1.4s ease-in-out infinite' : 'none' }} />
            {totalActive > 0 && <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid rgba(16,185,129,0.3)', animation: 'aud-pulse 2s ease-in-out infinite' }} />}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, letterSpacing: '0.14em', color: totalActive > 0 ? '#10B981' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            {totalActive > 0 ? 'System Active' : completedTotal > 0 ? 'System Standby' : 'System Ready'}
          </span>
          {totalActive > 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(16,185,129,0.45)', letterSpacing: '0.05em' }}>
              · {totalActive} action{totalActive !== 1 ? 's' : ''} running
            </span>
          )}
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.06em' }}>
          Fan Intelligence OS · All American Rejects
        </span>
      </div>

      {/* ── Stat cells ── */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${hasAny && (totalListeners > 0 || totalRevenue > 0) ? 6 : 4}, 1fr)`, borderBottom: hasAny ? `1px solid ${borderColor}` : 'none' }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ padding: '14px 16px', borderRight: i < STATS.length - 1 ? `1px solid ${borderColor}` : 'none', display: 'flex', alignItems: 'center', gap: 10, background: s.live ? `${s.color}05` : 'transparent', transition: 'background 0.3s' }}>
            {s.live ? (
              <div style={{ position: 'relative', width: 7, height: 7, flexShrink: 0 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: s.color, boxShadow: `0 0 8px ${s.color}88`, animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1px solid ${s.color}44`, animation: 'aud-pulse 2s ease-in-out infinite' }} />
              </div>
            ) : (
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.value > 0 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)', flexShrink: 0 }} />
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: s.live ? 22 : 18, fontWeight: 900, color: s.live ? s.color : s.value > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.15)', lineHeight: 1, transition: 'color 0.3s, font-size 0.3s' }}>{s.value}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: s.live ? `${s.color}77` : 'rgba(255,255,255,0.18)', fontWeight: 600 }}>{s.subLabel}</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: s.live ? `${s.color}55` : 'rgba(255,255,255,0.2)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          </div>
        ))}

        {hasAny && totalListeners > 0 && (
          <div style={{ padding: '14px 16px', borderLeft: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(16,185,129,0.04)' }}>
            <TrendingUp size={14} color="#10B981" />
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: '#10B981', lineHeight: 1 }}>+{fmt(totalListeners)}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(16,185,129,0.5)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Listeners Gained</div>
            </div>
          </div>
        )}
        {hasAny && totalRevenue > 0 && (
          <div style={{ padding: '14px 16px', borderLeft: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(245,158,11,0.04)' }}>
            <ArrowUpRight size={14} color="#F59E0B" />
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>${fmt(totalRevenue)}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(245,158,11,0.5)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Revenue Impact</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom status line ── */}
      {(totalActive > 0 || completedTotal > 0) && (
        <div style={{ padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: totalActive > 0 ? 'rgba(16,185,129,0.65)' : 'rgba(255,255,255,0.18)' }}>
            {totalActive > 0
              ? `${totalActive} directive${totalActive !== 1 ? 's' : ''} live · updating in real time`
              : `${completedTotal} directive${completedTotal !== 1 ? 's' : ''} completed · system ready for next move`
            }
          </span>
          {completedTotal > 0 && totalListeners === 0 && (
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.4)', marginLeft: 'auto' }}>
              {completedTotal} completed
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── ACTIVE SYSTEM PANEL ───────────────────────────────────────────────────────

function ActiveSystemPanel() {
  const mem = useSystemMemory();
  const allActions = Object.values(mem.actions);
  const active = allActions.filter(a => a.state === 'live' || a.state === 'inprogress');
  const completed = allActions.filter(a => a.state === 'results');

  const totalListeners = useMemo(() => {
    return completed.reduce((sum, a) => {
      const r = a.results?.find(r => r.label.toLowerCase().includes('reach') || r.label.toLowerCase().includes('listener'));
      if (!r) return sum;
      const n = parseInt(r.value.replace(/[^0-9]/g, ''));
      return isNaN(n) ? sum : sum + n;
    }, 0);
  }, [completed]);

  if (allActions.length === 0) return null;

  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(6,182,212,0.14)', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(6,182,212,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={12} color="#06B6D4" />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Active System</span>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>execution memory · all american rejects</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {active.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', fontWeight: 700 }}>{active.length} ACTIVE</span>
            </div>
          )}
          {completed.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7, background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <CheckCircle size={9} color="#F59E0B" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#F59E0B', fontWeight: 700 }}>{completed.length} COMPLETED</span>
            </div>
          )}
          {totalListeners > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 7, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <TrendingUp size={9} color="#10B981" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', fontWeight: 700 }}>+{fmt(totalListeners)} from campaigns</span>
            </div>
          )}
        </div>
      </div>
      {/* Active actions */}
      {active.length > 0 && (
        <div style={{ padding: '10px 18px', borderBottom: completed.length > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Currently Running</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {active.map(a => {
              const secsActive = Math.floor((Date.now() - a.startedAt) / 1000);
              const isBuilding = a.state === 'inprogress';
              return (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 12px', borderRadius: 10, background: isBuilding ? 'rgba(255,255,255,0.03)' : `${a.color}08`, border: `1px solid ${isBuilding ? 'rgba(255,255,255,0.07)' : a.color + '20'}` }}>
                  {isBuilding
                    ? <Loader size={9} color="rgba(255,255,255,0.3)" style={{ animation: 'spin 1s linear infinite' }} />
                    : <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
                  }
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isBuilding ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)', marginBottom: 1 }}>{a.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7, color: isBuilding ? 'rgba(255,255,255,0.2)' : `${a.color}88` }}>
                      {isBuilding ? 'Building…' : `Live · Day ${Math.max(1, Math.ceil(secsActive / 3))} · ${secsActive}s`}
                    </div>
                  </div>
                  {!isBuilding && a.color && (
                    <div style={{ padding: '2px 7px', borderRadius: 5, background: `${a.color}10`, border: `1px solid ${a.color}22` }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 7, color: a.color }}>Early indicators incoming…</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Completed actions */}
      {completed.length > 0 && (
        <div style={{ padding: '10px 18px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Recently Completed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {completed.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 10, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.1)' }}>
                <CheckCircle size={10} color="#10B981" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>{a.label}</div>
                  {a.source && <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>{a.source}</div>}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {(a.results ?? []).slice(0, 3).map(r => (
                    <div key={r.label} style={{ padding: '2px 8px', borderRadius: 5, background: `${r.color}0E`, border: `1px solid ${r.color}20` }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 8, color: r.color, fontWeight: 700 }}>{r.value}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', marginLeft: 3 }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MomentumBadge({ name }: { name: string }) {
  const m = MOMENTUM_MAP[name];
  if (!m) return null;
  const Icon = m.dir === 'up' ? TrendingUp : m.dir === 'down' ? TrendingDown : Minus;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 6px', borderRadius: 5, background: `${m.color}0C`, border: `1px solid ${m.color}1A` }}>
      <Icon size={7} color={m.color} />
      <span style={{ fontFamily: 'monospace', fontSize: 7, color: m.color, fontWeight: 600, whiteSpace: 'nowrap' }}>{m.label}</span>
    </div>
  );
}

const PERF_ACTION_LINKS: Record<string, { label: string; actionId: string; expandedInsight: string }> = {
  'brazil-organic': {
    label: 'Brazil Nostalgia Campaign',
    actionId: 'Run Campaign',
    expandedInsight: 'This organic signal is now being amplified by your launched campaign. Performance is tracking 4x above baseline.',
  },
  'nostalgia-tiktok': {
    label: '"Flagpole Sitta" Creator Push',
    actionId: 'Push Creators',
    expandedInsight: 'Activated creator push is accelerating this spike. Early indicators show conversion rate up 2.1x since launch.',
  },
  'merch-intent': {
    label: 'Merch Strategy',
    actionId: 'Open Merch Strategy',
    expandedInsight: 'Merch strategy activated. High-LTV segment is now being funneled to drop page. Revenue conversion in early data.',
  },
  'touring-demand': {
    label: 'Tour Route Plan',
    actionId: 'Plan Tour Route',
    expandedInsight: 'Tour route building. Venue targeting underway for São Paulo, Chicago, and Mexico City based on demand data.',
  },
};

function LivePerfFeedback() {
  const mem = useSystemMemory();

  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(16,185,129,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={14} color="#10B981" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>Live Performance Feedback</h3>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>Active signals, demand indicators, and conversion intelligence · updated in real time</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>LIVE · {PERF_ENTRIES.length} active signals</span>
        </div>
      </div>
      {/* Entries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1, background: 'rgba(255,255,255,0.02)' }}>
        {PERF_ENTRIES.map(entry => {
          const momDir = entry.momentum === 'up' ? 'up' : entry.momentum === 'down' ? 'down' : 'stable';
          const MomIcon = momDir === 'up' ? TrendingUp : momDir === 'down' ? TrendingDown : Minus;
          const link = PERF_ACTION_LINKS[entry.id];
          const linkedAction = link ? mem.getAction(link.actionId) : undefined;
          const isActionLive = linkedAction && (linkedAction.state === 'live' || linkedAction.state === 'inprogress');
          const isActionDone = linkedAction?.state === 'results';

          return (
            <div key={entry.id} style={{ background: '#0D0E11', padding: '16px 18px', border: isActionLive ? `1px solid ${entry.typeColor}18` : 'none' }}>
              {/* Action origin tag — shown if an action was launched */}
              {link && linkedAction && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9, padding: '5px 10px', borderRadius: 8, background: isActionDone ? 'rgba(16,185,129,0.06)' : isActionLive ? `${entry.typeColor}08` : 'rgba(255,255,255,0.025)', border: `1px solid ${isActionDone ? 'rgba(16,185,129,0.15)' : isActionLive ? entry.typeColor + '20' : 'rgba(255,255,255,0.06)'}` }}>
                  {isActionDone
                    ? <CheckCircle size={8} color="#10B981" />
                    : isActionLive
                      ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: entry.typeColor, animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
                      : <Wifi size={8} color="rgba(255,255,255,0.25)" />
                  }
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: isActionDone ? '#10B981' : isActionLive ? entry.typeColor : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>
                    {link.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>
                    ({isActionDone ? 'Completed' : isActionLive ? linkedAction.state === 'inprogress' ? 'Building…' : 'Live now' : 'not launched'})
                  </span>
                </div>
              )}
              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: entry.typeColor, animation: 'aud-pulse 1.4s ease-in-out infinite', flexShrink: 0 }} />
                <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 5, color: entry.typeColor, background: `${entry.typeColor}10`, border: `1px solid ${entry.typeColor}22`, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{entry.type}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>since {entry.startedLabel}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MomIcon size={8} color={entry.insightColor} />
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: entry.insightColor }}>
                    {momDir === 'up' ? 'Accelerating' : momDir === 'down' ? 'Cooling' : 'Stable'}
                  </span>
                </div>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.82)', lineHeight: 1.4 }}>{entry.title}</p>
              {/* Metrics — boost if action is live */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
                {[entry.metric1, entry.metric2, entry.metric3].map(m => (
                  <div key={m.label} style={{ padding: '8px 10px', background: isActionLive ? `${m.color}0D` : `${m.color}07`, border: `1px solid ${m.color}${isActionLive ? '20' : '14'}`, borderRadius: 9, transition: 'all 0.3s' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 800, color: m.color, marginBottom: 2 }}>{m.value}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.22)', marginBottom: 1 }}>{m.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7, color: `${m.color}88` }}>{isActionLive ? '▲ amplified' : m.delta}</div>
                  </div>
                ))}
              </div>
              {/* Insight — swap to action-linked insight if action is live */}
              <div style={{ padding: '8px 11px', background: `${entry.insightColor}07`, border: `1px solid ${entry.insightColor}14`, borderRadius: 9 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <Brain size={9} color={`${entry.insightColor}77`} style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.44)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    {isActionLive && link ? link.expandedInsight : entry.insight}
                  </p>
                </div>
              </div>
              {/* Action CTA if not launched yet */}
              {link && !linkedAction && (
                <div style={{ marginTop: 8 }}>
                  <ExecBtn label={link.actionId} color={entry.typeColor} instanceId={link.actionId} source={`Triggered from Live Performance Feedback · ${entry.title}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface FeedbackLoop {
  triggeredBy: string;
  adaptedText: string;
  newTitle: string;
  microCopy: string;
  followUpAction?: { label: string; ctaLabel: string; ctaColor: string };
}

const CMD_FEEDBACK_LOOPS: Record<string, FeedbackLoop> = {
  'Launch nostalgia content campaign in Brazil and Mexico': {
    triggeredBy: 'Build Content Plan',
    microCopy: 'Based on performance of Brazil Content Campaign',
    adaptedText: 'Brazil content campaign is outperforming projections by 31% — same nostalgia trigger is converting in Mexico City at comparable CPM. Following strong conversion in LATAM, expanding now is the highest-confidence next move.',
    newTitle: 'Brazil Performing → Expand Content Campaign to Mexico',
    followUpAction: {
      label: 'Expand campaign to Mexico City audience — same brief, Spanish-language adaptation',
      ctaLabel: 'Expand to Mexico',
      ctaColor: '#EC4899',
    },
  },
  'Drop a limited merch bundle targeting North America': {
    triggeredBy: 'Open Merch Strategy',
    microCopy: 'Based on performance of Merch Strategy launch',
    adaptedText: 'Merch strategy is live and converting. High-LTV segment is clicking through at 12% above baseline. Following strong conversion in North America, a second SKU drop within 14 days will capture the remaining demand before the cycle cools.',
    newTitle: 'Merch Live → Queue Second Drop Within 14 Days',
    followUpAction: {
      label: 'System recommends adding vinyl + bundle SKU to capture remaining demand',
      ctaLabel: 'Add Second Drop',
      ctaColor: '#10B981',
    },
  },
  'Brief and activate creators in Mexico City and Chicago': {
    triggeredBy: 'Activate Creators',
    microCopy: 'Based on performance of Creator Activation push',
    adaptedText: 'Creator activation is live with 31 creators briefed. "Flagpole Sitta" content cycle is now extending into week 3. Following strong conversion in LATAM, 8 additional creators are recommended to sustain the spike through week 4.',
    newTitle: 'Creator Push Live → Brief 8 More in Buenos Aires + Jalisco',
    followUpAction: {
      label: 'Extend creator brief to Buenos Aires + Jalisco to capture adjacent LATAM audience',
      ctaLabel: 'Expand Creator Brief',
      ctaColor: '#EC4899',
    },
  },
};

function AICmdCenter() {
  const [mode, setMode] = useState<SystemMode>('balanced');
  const m = SYSTEM_MODES[mode];
  const mem = useSystemMemory();

  const modifiedCmds = AI_COMMANDS.map((cmd, i) => {
    const urgency = CMD_URGENCY[i];
    let adjConf = cmd.confidence;
    if (mode === 'aggressive') adjConf = Math.min(99, Math.round(adjConf * 1.05));
    if (mode === 'conservative') adjConf = Math.max(60, Math.round(adjConf * 0.95));

    const feedbackLoop = CMD_FEEDBACK_LOOPS[cmd.title];
    const linkedAction = feedbackLoop ? mem.getAction(feedbackLoop.triggeredBy) : undefined;
    const hasFeedback = linkedAction && (linkedAction.state === 'live' || linkedAction.state === 'results');
    const ctaAction = mem.getAction(cmd.cta);
    const ctaState = ctaAction?.state ?? 'ready';

    return {
      ...cmd,
      adjConf,
      urgency,
      feedbackLoop: hasFeedback ? feedbackLoop : undefined,
      linkedActionState: linkedAction?.state,
      ctaState,
      ctaResults: ctaAction?.results,
    };
  });

  const activeCmds    = modifiedCmds.filter(c => c.ctaState === 'live' || c.ctaState === 'inprogress');
  const completedCmds = modifiedCmds.filter(c => c.ctaState === 'results');
  const readyCmds     = modifiedCmds.filter(c => c.ctaState === 'ready');

  const sortedCmds = [
    ...activeCmds,
    ...readyCmds.sort((a, b) => (a.feedbackLoop ? -1 : b.feedbackLoop ? 1 : 0)),
    ...completedCmds,
  ];

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Section 3 — AI Command Center · Ranked Action Intelligence</span>
      </div>
      <div style={{ background: '#0D0E11', border: `1px solid ${m.color}18`, borderRadius: 18, overflow: 'hidden' }}>
        {/* Header with System Mode toggle */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: `${m.color}04`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `${m.color}12`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={14} color={m.color} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>AI Command Center</h3>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>All American Rejects · {modifiedCmds.length} active directives</p>
            </div>
          </div>
          {/* System Mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginRight: 2 }}>SYSTEM MODE</span>
            {(Object.keys(SYSTEM_MODES) as SystemMode[]).map(k => {
              const sm = SYSTEM_MODES[k];
              const active = mode === k;
              return (
                <button key={k} onClick={() => setMode(k)}
                  style={{ padding: '4px 11px', borderRadius: 7, fontSize: 9, fontWeight: 700, cursor: 'pointer', background: active ? `${sm.color}15` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? sm.color + '35' : 'rgba(255,255,255,0.07)'}`, color: active ? sm.color : 'rgba(255,255,255,0.3)', transition: 'all 0.15s', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  {sm.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Mode description strip */}
        <div style={{ padding: '7px 20px', background: `${m.color}05`, borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={9} color={`${m.color}66`} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: `${m.color}88`, fontStyle: 'italic' }}>{m.description}</span>
        </div>

        {/* ── Group: Active ── */}
        {activeCmds.length > 0 && (
          <div style={{ padding: '6px 20px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(16,185,129,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active — {activeCmds.length} running</span>
            </div>
          </div>
        )}

        {sortedCmds.map((cmd, i) => {
          const CmdIcon = cmd.icon;
          const isActive    = cmd.ctaState === 'live' || cmd.ctaState === 'inprogress';
          const isCompleted = cmd.ctaState === 'results';
          const prevCmd = sortedCmds[i - 1];
          const prevIsActive    = prevCmd && (prevCmd.ctaState === 'live' || prevCmd.ctaState === 'inprogress');
          const prevIsCompleted = prevCmd && prevCmd.ctaState === 'results';

          const showReadyDivider    = !isActive && !isCompleted && prevIsActive;
          const showCompletedDivider = isCompleted && !prevIsCompleted;

          return (
            <div key={cmd.title}>
              {/* Group divider: Ready */}
              {showReadyDivider && (
                <div style={{ padding: '6px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ready — Not Yet Launched</span>
                </div>
              )}
              {/* Group divider: Completed */}
              {showCompletedDivider && (
                <div style={{ padding: '6px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(16,185,129,0.015)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CheckCircle size={8} color="rgba(16,185,129,0.5)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Completed</span>
                  </div>
                </div>
              )}

              <div style={{
                borderBottom: i < sortedCmds.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: isActive
                  ? 'rgba(16,185,129,0.04)'
                  : isCompleted
                    ? 'rgba(255,255,255,0.012)'
                    : 'transparent',
                borderLeft: isActive
                  ? '2px solid rgba(16,185,129,0.45)'
                  : isCompleted
                    ? '2px solid rgba(16,185,129,0.18)'
                    : '2px solid transparent',
                opacity: isCompleted ? 0.68 : 1,
                transition: 'all 0.35s',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto', gap: 14, padding: '16px 20px', alignItems: 'start' }}>
                  {/* Rank / State indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, paddingTop: 2 }}>
                    {isCompleted ? (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle size={12} color="#10B981" />
                      </div>
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: `${cmd.ctaColor}12`, border: `1px solid ${isActive ? cmd.ctaColor + '45' : cmd.ctaColor + '25'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        {isActive && <div style={{ position: 'absolute', inset: -2, borderRadius: 10, border: `1px solid ${cmd.ctaColor}30`, animation: 'aud-pulse 2s ease-in-out infinite' }} />}
                        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 900, color: cmd.ctaColor }}>{cmd.rank}</span>
                      </div>
                    )}
                    <CmdIcon size={12} color={isCompleted ? 'rgba(16,185,129,0.4)' : `${cmd.ctaColor}60`} />
                  </div>

                  {/* Body */}
                  <div>
                    {/* Feedback loop badge with explicit microcopy */}
                    {cmd.feedbackLoop && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, padding: '5px 10px', borderRadius: 7, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
                        <div>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#10B981', fontWeight: 800, letterSpacing: '0.07em' }}>ADAPTED · </span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>{cmd.feedbackLoop.microCopy}</span>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 7px', borderRadius: 5, color: isCompleted ? '#10B981' : cmd.priorityColor, background: isCompleted ? 'rgba(16,185,129,0.1)' : `${cmd.priorityColor}12`, border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.2)' : cmd.priorityColor + '22'}`, fontWeight: 800, letterSpacing: '0.1em' }}>
                        {isCompleted ? 'COMPLETED' : cmd.priority}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isCompleted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.88)' }}>
                        {cmd.feedbackLoop ? cmd.feedbackLoop.newTitle : cmd.title}
                      </span>
                    </div>

                    {/* Completed results strip */}
                    {isCompleted && cmd.ctaResults && (
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
                        {cmd.ctaResults.slice(0, 3).map(r => (
                          <div key={r.label} style={{ padding: '3px 9px', borderRadius: 6, background: `${r.color}0C`, border: `1px solid ${r.color}1E` }}>
                            <span style={{ fontFamily: 'monospace', fontSize: 9, color: r.color, fontWeight: 800 }}>{r.value}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.28)', marginLeft: 4 }}>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {!isCompleted && (
                      <>
                        {/* Time sensitivity row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, padding: '5px 10px', background: `${cmd.urgency.urgencyColor}08`, border: `1px solid ${cmd.urgency.urgencyColor}18`, borderRadius: 7 }}>
                          <Clock size={9} color={cmd.urgency.urgencyColor} />
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>Window: <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{cmd.urgency.window}</span></span>
                          <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.06)' }} />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {cmd.urgency.blinking && !isActive && <div style={{ width: 5, height: 5, borderRadius: '50%', background: cmd.urgency.urgencyColor, animation: 'aud-pulse 1s ease-in-out infinite', flexShrink: 0 }} />}
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: isActive ? '#10B981' : cmd.urgency.urgencyColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {isActive ? 'LIVE NOW' : cmd.urgency.urgency}
                            </span>
                          </div>
                        </div>

                        {/* Metrics row */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Activity size={9} color="rgba(16,185,129,0.5)" />
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>Confidence: <span style={{ color: '#10B981', fontWeight: 700 }}>{cmd.adjConf}%</span></span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ArrowUpRight size={9} color={`${cmd.ctaColor}66`} />
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>Outcome: <span style={{ color: cmd.ctaColor }}>{cmd.outcome}</span></span>
                          </div>
                          {cmd.feedbackLoop && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <ListChecks size={9} color="rgba(16,185,129,0.5)" />
                              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.6)', fontWeight: 600, fontStyle: 'italic' }}>Live data updating this recommendation</span>
                            </div>
                          )}
                        </div>

                        {/* Reasoning */}
                        <div style={{ padding: '9px 12px', background: cmd.feedbackLoop ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.02)', border: `1px solid ${cmd.feedbackLoop ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)'}`, borderRadius: 9, transition: 'all 0.3s' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                            <Brain size={9} color={cmd.feedbackLoop ? 'rgba(16,185,129,0.55)' : `${cmd.ctaColor}55`} style={{ marginTop: 2, flexShrink: 0 }} />
                            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>
                              {cmd.feedbackLoop ? cmd.feedbackLoop.adaptedText : cmd.reasoning}
                            </p>
                          </div>
                        </div>

                        {/* Follow-up action row (inline, below reasoning) */}
                        {cmd.feedbackLoop?.followUpAction && (
                          <div style={{ marginTop: 10, padding: '9px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                              <ArrowUpRight size={9} color={`${cmd.feedbackLoop.followUpAction.ctaColor}66`} style={{ marginTop: 2, flexShrink: 0 }} />
                              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{cmd.feedbackLoop.followUpAction.label}</span>
                            </div>
                            <ExecBtn
                              label={cmd.feedbackLoop.followUpAction.ctaLabel}
                              color={cmd.feedbackLoop.followUpAction.ctaColor}
                              instanceId={`followup:${cmd.title}`}
                              source={`Follow-up from ${cmd.title} · AI Command Center`}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* CTA */}
                  <div style={{ paddingTop: 2 }}>
                    <ExecBtn label={cmd.cta} color={cmd.ctaColor} instanceId={cmd.cta} source={`Launched from AI Command Center · ${cmd.title}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 7px', borderRadius: 5, color, background: `${color}12`, border: `1px solid ${color}22` }}>{label}</span>
  );
}

function Dot({ level }: { level: string }) {
  const c = level === 'High' || level === 'Priority' ? '#10B981' : level === 'Medium' ? '#F59E0B' : '#6B7280';
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}55`, marginRight: 4 }} />;
}

function Btn({ label, color, small }: { label: string; color: string; small?: boolean }) {
  return (
    <button style={{ fontSize: small ? 8 : 9, padding: small ? '3px 10px' : '5px 13px', borderRadius: 7, cursor: 'pointer', background: `${color}10`, border: `1px solid ${color}25`, color, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {label}
    </button>
  );
}

function DrillPanel({ id, onClose }: { id: string; onClose: () => void }) {
  const d = DRILL_DETAIL[id];
  if (!d) return null;
  const seg = SEGMENTS.find(s => s.id === id);
  const city = CITIES.find(c => c.name === id);
  const country = COUNTRIES.find(c => c.name === id);
  const label = seg?.name ?? city?.name ?? country?.name ?? id;
  const accentColor = seg?.color ?? '#06B6D4';
  return (
    <div style={{ background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, overflow: 'hidden', animation: 'aud-slide 0.25s cubic-bezier(0.16,1,0.3,1) both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${accentColor}06` }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={11} color={accentColor} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Audience Drilldown</span>
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{label}</div>
        </div>
        <button onClick={onClose} style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={10} color="rgba(255,255,255,0.4)" />
        </button>
      </div>
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { label: 'Engagement', value: d.engScore, color: '#06B6D4' },
            { label: 'Merch Demand', value: d.merchDemand, color: '#F59E0B' },
            { label: 'Touring Score', value: d.touringScore, color: '#EF4444' },
          ].map(m => (
            <div key={m.label} style={{ padding: '8px 10px', background: `${m.color}08`, border: `1px solid ${m.color}18`, borderRadius: 9 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: m.color, marginBottom: 2 }}>{m.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Top Songs</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {d.topSongs.map((s, i) => (
              <span key={s} style={{ fontFamily: 'monospace', fontSize: 9, padding: '3px 9px', borderRadius: 6, color: i === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', background: i === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)', border: i === 0 ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.05)' }}>{s}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>Key Behaviors</div>
          {d.behaviors.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: accentColor, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '9px 11px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 9 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Recommended Next Move</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{d.nextMove}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {d.actions.map(a => <Btn key={a.label} label={a.label} color={a.color} />)}
        </div>
      </div>
    </div>
  );
}

function GeoDrilldown() {
  const [tab, setTab] = useState<DrillTab>('countries');
  const [selected, setSelected] = useState<string | null>(null);

  const tabs: { id: DrillTab; label: string; Icon: React.ElementType }[] = [
    { id: 'countries', label: 'Countries', Icon: Globe },
    { id: 'states', label: 'States', Icon: MapPin },
    { id: 'cities', label: 'Cities', Icon: Navigation },
    { id: 'segments', label: 'Segments', Icon: Users },
  ];

  const handleSelect = (id: string) => setSelected(prev => prev === id ? null : id);

  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 18, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={14} color="#06B6D4" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>Geo Drilldown Intelligence</h3>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>All American Rejects · multi-level audience explorer</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>LIVE</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {tabs.map(t => {
          const active = tab === t.id;
          const TIcon = t.Icon;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 8px', background: active ? 'rgba(6,182,212,0.07)' : 'transparent', border: 'none', cursor: 'pointer', borderBottom: active ? '2px solid #06B6D4' : '2px solid transparent', transition: 'all 0.15s' }}>
              <TIcon size={11} color={active ? '#06B6D4' : 'rgba(255,255,255,0.22)'} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: active ? '#06B6D4' : 'rgba(255,255,255,0.28)', fontWeight: active ? 700 : 400, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', minHeight: 360 }}>
        {/* List */}
        <div style={{ padding: '12px 16px', borderRight: selected ? '1px solid rgba(255,255,255,0.05)' : 'none', overflowY: 'auto', maxHeight: 500 }}>

          {tab === 'countries' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Top Countries · All American Rejects</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)' }}>OPP SCORE = growth + engagement + merch + touring</span>
              </div>
              {COUNTRIES.map(c => (
                <div key={c.name} style={{ marginBottom: 5, borderRadius: 12, background: selected === c.name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.015)', border: selected === c.name ? '1px solid rgba(6,182,212,0.18)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                  <button onClick={() => handleSelect(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Dot level={c.merch} />
                    <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{c.name}</span>
                    <MomentumBadge name={c.name} />
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{fmt(c.listeners)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(16,185,129,0.18)' }}>{c.growth}</span>
                    <Tag label={c.tag} color={c.tagColor} />
                    <OppScoreBar score={c.oppScore} color={c.tagColor} />
                  </button>
                  <div style={{ padding: '0 12px 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <ActionBtns actions={c.actions} prefix={`country:${c.name}`} />
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', cursor: 'pointer' }} onClick={() => handleSelect(c.name)}>
                      {selected === c.name ? '▲ collapse' : '▼ drilldown'}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'states' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>States / Regions · US · Brazil · Mexico</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)' }}>OPP SCORE</span>
              </div>
              {STATES.map(s => (
                <div key={s.name} style={{ marginBottom: 5, borderRadius: 12, background: selected === s.name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.015)', border: selected === s.name ? '1px solid rgba(6,182,212,0.18)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                  <button onClick={() => handleSelect(s.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Dot level={s.density} />
                    <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{s.name}</span>
                    <MomentumBadge name={s.name} />
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{s.country}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{fmt(s.listeners)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(16,185,129,0.18)' }}>{s.growth}</span>
                    <Tag label={s.tag} color={s.tagColor} />
                    <OppScoreBar score={s.oppScore} color={s.tagColor} />
                  </button>
                  <div style={{ padding: '0 12px 9px' }}>
                    <ActionBtns actions={s.actions} prefix={`state:${s.name}`} />
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'cities' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cities · Momentum + Ticket Demand</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)' }}>OPP SCORE</span>
              </div>
              {CITIES.map(c => (
                <div key={c.name} style={{ marginBottom: 5, borderRadius: 12, background: selected === c.name ? 'rgba(6,182,212,0.05)' : 'rgba(255,255,255,0.015)', border: selected === c.name ? '1px solid rgba(6,182,212,0.18)' : '1px solid rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                  <button onClick={() => handleSelect(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '9px 12px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <Dot level={c.creator} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{c.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{c.country}</span>
                        <MomentumBadge name={c.name} />
                        {c.tags.map((tag, i) => <Tag key={tag} label={tag} color={c.tagColors[i] ?? '#6B7280'} />)}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.38)' }}>{fmt(c.listeners)}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', background: 'rgba(16,185,129,0.08)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(16,185,129,0.18)' }}>{c.growth}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444' }}>🎟 {c.ticket}</span>
                    <OppScoreBar score={c.oppScore} color="#10B981" />
                  </button>
                  <div style={{ padding: '0 12px 9px' }}>
                    <ActionBtns actions={c.actions} prefix={`city:${c.name}`} />
                  </div>
                </div>
              ))}
            </>
          )}

          {tab === 'segments' && (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Audience Segments · Monetization Opportunities</div>
              {SEGMENTS.map(seg => {
                const SIcon = seg.icon;
                return (
                  <div key={seg.id} onClick={() => handleSelect(seg.id)}
                    style={{ marginBottom: 7, borderRadius: 14, background: selected === seg.id ? `${seg.color}06` : 'rgba(255,255,255,0.015)', border: selected === seg.id ? `1px solid ${seg.color}22` : '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.15s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 12px 8px' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${seg.color}10`, border: `1px solid ${seg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <SIcon size={14} color={seg.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{seg.name}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.07)' }}>{seg.size}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, color: seg.growthColor, background: `${seg.growthColor}10`, padding: '1px 6px', borderRadius: 5, border: `1px solid ${seg.growthColor}22` }}>{seg.growth}</span>
                        </div>
                        <p style={{ margin: '0 0 5px', fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{seg.desc}</p>
                        <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>Repeat: <span style={{ color: seg.color }}>{seg.repeatRate}</span></span>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>LTV: <span style={{ color: '#F59E0B', fontWeight: 700 }}>{seg.ltv}</span></span>
                        </div>
                        <div style={{ padding: '7px 10px', background: `${seg.color}07`, border: `1px solid ${seg.color}14`, borderRadius: 8, marginBottom: 6 }}>
                          <div style={{ fontFamily: 'monospace', fontSize: 7, color: `${seg.color}88`, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Monetization Opportunity</div>
                          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{seg.monetization}</div>
                        </div>
                        <button style={{ fontSize: 8, padding: '4px 12px', borderRadius: 6, cursor: 'pointer', background: `${seg.color}12`, border: `1px solid ${seg.color}28`, color: seg.color, fontWeight: 700 }} onClick={e => e.stopPropagation()}>
                          {seg.bestAction}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Drill panel */}
        {selected && (
          <div style={{ padding: '12px 16px', overflowY: 'auto', maxHeight: 500 }}>
            <DrillPanel id={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────

function ArtistOSAudienceInner() {
  const artist = useActiveArtist();
  if (!artist) return null;

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>
      <style>{`
        @keyframes aud-pulse { 0%,100%{opacity:1}50%{opacity:0.25} }
        @keyframes aud-slide { from{opacity:0;transform:translateX(10px)}to{opacity:1;transform:translateX(0)} }
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '18px 22px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>Fan Intelligence</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>All American Rejects</span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, padding: '2px 9px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>SPIN Records</span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', animation: 'aud-pulse 1.4s ease-in-out infinite' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981' }}>Live Audience System</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Activity size={11} color="rgba(16,185,129,0.5)" />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(16,185,129,0.5)' }}>LIVE · {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Monthly Listeners', value: fmt(artist.monthlyListeners), sub: artist.streamingDelta ?? '+14% MoM', color: '#06B6D4', Icon: Users },
              { label: 'Followers',          value: fmt(artist.followers),        sub: artist.followerDelta ?? '+8,200 this month', color: '#10B981', Icon: TrendingUp },
              { label: 'Fastest Growing City', value: 'São Paulo',                sub: '+38% this week', color: '#EC4899', Icon: MapPin },
              { label: 'Engagement Score',   value: `${artist.fanEngagementScore ?? 78}/100`, sub: 'Above industry avg', color: '#F59E0B', Icon: Activity },
            ].map(s => (
              <div key={s.label} style={{ padding: '13px 15px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 5, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.Icon size={10} color={s.color} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: s.color }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <LiveSignalBar />
      </div>

      {/* ── ACTIVE SYSTEM SUMMARY (always visible) ── */}
      <ActiveSystemSummaryStrip />

      {/* ── ACTIVE SYSTEM PANEL (detail view, appears after first action) ── */}
      <ActiveSystemPanel />

      {/* ── SECTION: GEO DRILLDOWN ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#06B6D4' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Section 1 — Geo Drilldown Intelligence</span>
        </div>
        <GeoDrilldown />
      </div>

      {/* ── SECTION: TREND SIGNALS ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EC4899' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Section 2 — Trend Signals · What Fans Want Right Now</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {TREND_CARDS.map(card => {
            const CIcon = card.icon;
            return (
              <div key={card.title} style={{ background: '#0D0E11', border: `1px solid ${card.color}14`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${card.color}06` }}>
                  <div style={{ width: 27, height: 27, borderRadius: 8, background: `${card.color}12`, border: `1px solid ${card.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CIcon size={13} color={card.color} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', flex: 1 }}>{card.title}</span>
                  {(card as any).momentumKey && <MomentumBadge name={(card as any).momentumKey} />}
                </div>
                <div style={{ padding: '11px 15px', background: `${card.color}04`, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                    <Brain size={9} color={`${card.color}88`} style={{ marginTop: 2, flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, fontStyle: 'italic' }}>{card.why}</p>
                  </div>
                </div>
                <div style={{ padding: '11px 15px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {card.signals.map(sig => (
                    <div key={sig.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: sig.hot ? card.color : 'rgba(255,255,255,0.12)', marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 10, color: sig.hot ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.42)', fontWeight: sig.hot ? 600 : 400 }}>{sig.label}</span>
                        {sig.hot && <span style={{ fontFamily: 'monospace', fontSize: 6, color: card.color, background: `${card.color}10`, border: `1px solid ${card.color}20`, padding: '1px 5px', borderRadius: 4, marginLeft: 5, verticalAlign: 'middle' }}>HOT</span>}
                        <p style={{ margin: '1px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.26)', lineHeight: 1.4 }}>{sig.sub}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 5 }}>
                    <Btn label={card.cta} color={card.ctaColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION: LIVE PERFORMANCE FEEDBACK ── */}
      <div style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Section 3 — Live Performance Feedback · What is Working Right Now</span>
        </div>
      </div>
      <LivePerfFeedback />

      {/* ── SECTION: AI COMMAND CENTER ── */}
      <AICmdCenter />

      {/* ── SECTION: AUDIENCE BEHAVIOR ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#F59E0B' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Section 4 — Audience Behavior Intelligence</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {BEHAVIOR_DATA.map(b => {
            const BIcon = b.icon;
            return (
              <div key={b.label} style={{ padding: '14px 16px', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <BIcon size={12} color={b.color} />
                  <span style={{ fontSize: 22, fontWeight: 800, color: b.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{b.value}</span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{b.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.55, fontStyle: 'italic' }}>{b.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION: HIGH VALUE FAN INTELLIGENCE ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(236,72,153,0.15)', borderRadius: 18, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={13} color="#F59E0B" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>High-Value Fan Intelligence</h3>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>LTV signals and monetization potential · All American Rejects</p>
          </div>
        </div>
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { label: 'Repeat Stream Rate', value: '71%',   color: '#10B981' },
              { label: 'Projected LTV',      value: '$48',   color: '#F59E0B' },
              { label: 'Save Rate',           value: '34%',  color: '#06B6D4' },
              { label: 'High-Value Fans',     value: '98K',  color: '#EC4899' },
            ].map(m => (
              <div key={m.label} style={{ padding: '12px 14px', background: `${m.color}08`, border: `1px solid ${m.color}18`, borderRadius: 12 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: m.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '13px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <BarChart2 size={11} color="#06B6D4" />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#06B6D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Interpretation</span>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
              Your core audience has above-average repeat stream and save rates — listeners keep coming back and building libraries around the catalog. The 98K high-LTV fans represent the most monetizable segment. The casual listener pool (340K+) is large enough for a meaningful conversion campaign.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
              <div style={{ padding: '9px 12px', background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.12)', borderRadius: 10 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(236,72,153,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Who to Target First</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Nostalgia Core + High-LTV + Merch-Intent segments first. LATAM Breakout second for volume.</div>
              </div>
              <div style={{ padding: '9px 12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>What to Do Next</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Fan club launch + limited merch drop + catalog re-engagement before next release cycle.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUGGESTED COLLABS ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Music size={13} color="#10B981" />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Suggested Collaborations</span>
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', marginLeft: 8 }}>AI-Matched by Fan Overlap + Momentum · All American Rejects</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,0.03)' }}>
          {[
            { name: 'Dashboard Confessional', type: 'Artist',         overlap: '62%', fit: 'Genre / Culture',  momentum: 'Resurgent', color: '#06B6D4', why: 'Audience overlap 62%. Same pop/rock nostalgia cycle. Shared 25-34 fan base.' },
            { name: 'Paramore',               type: 'Artist',         overlap: '48%', fit: 'Fan Demo',         momentum: 'Peak',      color: '#10B981', why: 'Strong crossover in 18-24 demo. Both driving nostalgia + new generation fans.' },
            { name: 'John Feldmann',           type: 'Producer',       overlap: '—',   fit: 'Sonic / Label',   momentum: 'Active',    color: '#F59E0B', why: 'Produced pop/rock catalog with similar sonic profile. Relationship with SPIN Records.' },
            { name: 'Simple Plan',             type: 'Artist',         overlap: '41%', fit: 'Geo / Fan Cluster', momentum: 'Active',  color: '#EF4444', why: 'Overlapping LATAM + Canada fan clusters. Potential joint tour candidate.' },
          ].map(collab => (
            <div key={collab.name} style={{ background: '#0D0E11', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#fff' }}>{collab.name}</p>
                  <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: collab.color, background: `${collab.color}12`, border: `1px solid ${collab.color}25` }}>{collab.type}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Momentum</p>
                  <span style={{ fontSize: 10, color: '#10B981', fontWeight: 700 }}>{collab.momentum}</span>
                </div>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{collab.why}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {collab.overlap !== '—' && (
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontFamily: 'monospace' }}>Overlap: <span style={{ color: collab.color }}>{collab.overlap}</span></span>
                )}
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', fontFamily: 'monospace' }}>Fit: {collab.fit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArtistOSAudience() {
  return (
    <SystemMemoryProvider>
      <ArtistOSAudienceInner />
    </SystemMemoryProvider>
  );
}
