import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Shield, TrendingUp, Activity, Star,
  Clock, ChevronRight, X, FileText, Globe,
  AlertTriangle, CheckCircle, Zap, Radio
} from 'lucide-react';
import { INTERNAL_ASSIGNEES } from '../data/assignees';

export interface Scout {
  id: string;
  name: string;
  tier: 'Elite' | 'Master' | 'Senior' | 'Junior';
  role: string;
  specialization: string;
  region: string;
  focus: string;
  liveSignals: number;
  discoveries7d: number;
  discoveries30d: number;
  totalDiscoveries: number;
  signsConverted: number;
  accuracy: number;
  confidenceScore: number;
  todayReport: boolean;
  reportStatus: 'Report Ready' | 'In Progress' | 'Pending' | 'Not Submitted';
  reportTime: string | null;
  primarySignals: string[];
  topDiscovery: string;
  joinedAgo: string;
  lastActive: string;
  status: 'active' | 'standby' | 'offline';
  bio: string;
}

export const SCOUTS: Scout[] = [
  // ── ELITE ──────────────────────────────────────────────────────────────────
  {
    id: 'SC-00', name: 'Paragon', tier: 'Elite',
    role: 'Lead A&R Intelligence Scout', specialization: 'Global Breakout Intelligence',
    region: 'Global — All Markets', focus: 'Afro-fusion · Indie · Pop-Crossover · Emerging Markets',
    liveSignals: 24, discoveries7d: 8, discoveries30d: 31, totalDiscoveries: 142, signsConverted: 19,
    accuracy: 98, confidenceScore: 99, todayReport: true, reportStatus: 'Report Ready', reportTime: 'just now',
    primarySignals: ['Velocity spikes', 'Unsigned breakouts', 'Market acceleration'],
    topDiscovery: 'Zaylevelten', joinedAgo: '4 years', lastActive: 'just now', status: 'active',
    bio: 'Primary lead intelligence node for the Rocksteady network. Paragon monitors all global markets simultaneously, filing daily structured briefs with ranked breakout signals, unsigned opportunity windows, and archetype-matched discovery intelligence. Highest accuracy and conversion rate in the network.',
  },
  {
    id: 'SC-01', name: 'Rift', tier: 'Elite',
    role: 'Global Market Intelligence Scout', specialization: 'Market Velocity Analysis',
    region: 'New York / Global', focus: 'Hip-Hop · R&B · Pop',
    liveSignals: 16, discoveries7d: 5, discoveries30d: 22, totalDiscoveries: 91, signsConverted: 13,
    accuracy: 96, confidenceScore: 98, todayReport: true, reportStatus: 'Report Ready', reportTime: '2h ago',
    primarySignals: ['Streaming velocity', 'NY scene', 'Platform adds'],
    topDiscovery: 'DXTR', joinedAgo: '4 years', lastActive: '5m ago', status: 'active',
    bio: 'Highest accuracy rate in the network. Specializes in velocity analysis across streaming platforms and identifying moments when underground artists are about to cross over.',
  },
  {
    id: 'SC-02', name: 'Nova', tier: 'Elite',
    role: 'Senior A&R Intelligence Scout', specialization: 'Breakout Detection',
    region: 'West Coast / Global', focus: 'Alt-Pop · Electronic · Pop-Crossover',
    liveSignals: 14, discoveries7d: 4, discoveries30d: 18, totalDiscoveries: 84, signsConverted: 11,
    accuracy: 94, confidenceScore: 97, todayReport: true, reportStatus: 'Report Ready', reportTime: '4h ago',
    primarySignals: ['TikTok viral', 'Streaming accel.', 'Editorial adds'],
    topDiscovery: 'Zara Vex', joinedAgo: '3 years', lastActive: '12m ago', status: 'active',
    bio: 'Specialist in identifying Alt-Pop and Electronic crossover moments before they break on mainstream platforms. 11 of 84 total discoveries resulted in label signings.',
  },
  {
    id: 'SC-03', name: 'Flare', tier: 'Elite',
    role: 'Cultural Intelligence Scout', specialization: 'Viral Signal Detection',
    region: 'Atlanta / Southeast', focus: 'Afrobeats · R&B · Hip-Hop',
    liveSignals: 11, discoveries7d: 5, discoveries30d: 21, totalDiscoveries: 61, signsConverted: 8,
    accuracy: 91, confidenceScore: 93, todayReport: false, reportStatus: 'In Progress', reportTime: null,
    primarySignals: ['ATL scene', 'Streaming accel.', 'Cross-genre'],
    topDiscovery: 'Mako Sol', joinedAgo: '2.5 years', lastActive: '1h ago', status: 'active',
    bio: 'ATL-embedded with direct access to Atlanta music scenes. Highest 30D discovery rate in the network. Specializes in identifying Afrobeats-R&B hybrid moments with streaming momentum.',
  },
  // ── MASTER ─────────────────────────────────────────────────────────────────
  {
    id: 'SC-04', name: 'Prism', tier: 'Master',
    role: 'Africa & Diaspora Scout', specialization: 'Afrobeats Global Expansion',
    region: 'Lagos · London · Accra', focus: 'Afrobeats · Afropop · Amapiano',
    liveSignals: 12, discoveries7d: 6, discoveries30d: 24, totalDiscoveries: 33, signsConverted: 3,
    accuracy: 87, confidenceScore: 88, todayReport: true, reportStatus: 'Report Ready', reportTime: '6h ago',
    primarySignals: ['Lagos emerging', 'Diaspora signals', 'UK crossover'],
    topDiscovery: 'Amara Blue', joinedAgo: '1 year', lastActive: '2h ago', status: 'active',
    bio: 'Covers the African continent with Lagos as primary base. Tracks diaspora signal chains from Lagos to London and back. Highest live signal count among Master-tier scouts.',
  },
  {
    id: 'SC-05', name: 'Nexus', tier: 'Master',
    role: 'Nashville & Americana Scout', specialization: 'Sync & Folk Crossover',
    region: 'Nashville · Austin · Denver', focus: 'Indie Folk · Alt-Country · Americana',
    liveSignals: 4, discoveries7d: 1, discoveries30d: 7, totalDiscoveries: 22, signsConverted: 2,
    accuracy: 82, confidenceScore: 84, todayReport: true, reportStatus: 'Report Ready', reportTime: '8h ago',
    primarySignals: ['Nashville buzz', 'Sync inquiries', 'Spotify DSP'],
    topDiscovery: 'Phoebe Strand', joinedAgo: '2 years', lastActive: '4h ago', status: 'active',
    bio: 'Deep Nashville network with direct label and management relationships. Primary focus on sync-licensing-ready artists and folk crossover moments.',
  },
  {
    id: 'SC-06', name: 'Halo', tier: 'Master',
    role: 'Asia Pacific Scout', specialization: 'Asian Market Crossover',
    region: 'Seoul · Tokyo · Sydney', focus: 'K-Pop Adjacent · J-Pop · Electronic',
    liveSignals: 6, discoveries7d: 2, discoveries30d: 6, totalDiscoveries: 9, signsConverted: 0,
    accuracy: 79, confidenceScore: 78, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['K-pop breakout', 'Asia streaming', 'TikTok KR'],
    topDiscovery: '—', joinedAgo: '6 months', lastActive: '5h ago', status: 'standby',
    bio: 'First scout assigned to Asia-Pacific coverage. Developing K-pop and J-pop signal feeds. Focused on identifying Asian-market breakouts with Western crossover potential.',
  },
  {
    id: 'SC-07', name: 'Blaze', tier: 'Master',
    role: 'Emerging Markets Scout', specialization: 'Early Stage Detection',
    region: 'Chicago · Detroit · Cleveland', focus: 'Drill · R&B · Hip-Hop',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 4, signsConverted: 0,
    accuracy: 71, confidenceScore: 69, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Chicago drill', 'SoundCloud buzz', 'Local shows'],
    topDiscovery: '—', joinedAgo: '4 months', lastActive: '6h ago', status: 'standby',
    bio: 'Building Midwest coverage with focus on Chicago and Detroit emerging scenes. Early-stage signal detection with developing accuracy profile.',
  },
  // ── SENIOR ─────────────────────────────────────────────────────────────────
  {
    id: 'SC-08', name: 'Riot', tier: 'Senior',
    role: 'Hip-Hop Scene Intelligence Scout', specialization: 'Grassroots Momentum',
    region: 'New York · Chicago · Houston', focus: 'Hip-Hop · Drill · Trap',
    liveSignals: 7, discoveries7d: 2, discoveries30d: 9, totalDiscoveries: 18, signsConverted: 2,
    accuracy: 81, confidenceScore: 80, todayReport: true, reportStatus: 'Report Ready', reportTime: '3h ago',
    primarySignals: ['Local buzz', 'SoundCloud velocity', 'Feature networks'],
    topDiscovery: 'Kase Dillon', joinedAgo: '14 months', lastActive: '45m ago', status: 'active',
    bio: 'Street-level intelligence across the hip-hop corridor. Riot tracks grassroots momentum before it reaches streaming charts, with a focus on unsigned artists building organic fan bases.',
  },
  {
    id: 'SC-09', name: 'Vortex', tier: 'Senior',
    role: 'Electronic & Club Culture Scout', specialization: 'Scene-to-Mainstream Crossover',
    region: 'Los Angeles · Miami · Chicago', focus: 'Electronic · House · Dance-Pop',
    liveSignals: 6, discoveries7d: 2, discoveries30d: 8, totalDiscoveries: 15, signsConverted: 1,
    accuracy: 78, confidenceScore: 77, todayReport: false, reportStatus: 'In Progress', reportTime: null,
    primarySignals: ['Club plays', 'DJ co-signs', 'Streaming accel.'],
    topDiscovery: 'Lyra Dax', joinedAgo: '12 months', lastActive: '1h ago', status: 'active',
    bio: 'Embedded in club culture from Miami to Chicago. Tracks which records are moving dance floors before they hit mainstream playlists. Specialist in electronic crossover trajectories.',
  },
  {
    id: 'SC-10', name: 'Frost', tier: 'Senior',
    role: 'Nordic & North European Scout', specialization: 'Indie-Pop & Alt Crossover',
    region: 'Stockholm · Oslo · Copenhagen', focus: 'Indie Pop · Alt-Pop · Electronic',
    liveSignals: 5, discoveries7d: 1, discoveries30d: 6, totalDiscoveries: 12, signsConverted: 1,
    accuracy: 77, confidenceScore: 76, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Scandinavian charts', 'Export-ready signals', 'Spotify Nordic'],
    topDiscovery: 'Signe Valo', joinedAgo: '10 months', lastActive: '2h ago', status: 'active',
    bio: 'Tracks the Nordic music pipeline with focus on artists showing early export potential. Scandinavia has historically produced outsized global hits — Frost maps those signals before they cross borders.',
  },
  {
    id: 'SC-11', name: 'Storm', tier: 'Senior',
    role: 'Latin & Reggaeton Scout', specialization: 'Latin Chart Velocity',
    region: 'Miami · Puerto Rico · Colombia', focus: 'Reggaeton · Latin Pop · Urban Latin',
    liveSignals: 5, discoveries7d: 2, discoveries30d: 7, totalDiscoveries: 11, signsConverted: 1,
    accuracy: 76, confidenceScore: 75, todayReport: true, reportStatus: 'Report Ready', reportTime: '6h ago',
    primarySignals: ['Latin chart velocity', 'Bilingual crossover', 'Radio adds'],
    topDiscovery: 'Mateo Vega', joinedAgo: '11 months', lastActive: '3h ago', status: 'active',
    bio: 'Specialist in Latin market signals with deep roots in Puerto Rico and Colombia. Tracks artists with both Latin chart velocity and crossover potential into English-language markets.',
  },
  {
    id: 'SC-12', name: 'Spark', tier: 'Senior',
    role: 'R&B & Soul Intelligence Scout', specialization: 'Emotional Signal Detection',
    region: 'Atlanta · Philadelphia · Detroit', focus: 'R&B · Neo-Soul · Soul',
    liveSignals: 4, discoveries7d: 1, discoveries30d: 6, totalDiscoveries: 9, signsConverted: 0,
    accuracy: 74, confidenceScore: 73, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Playlist adds', 'Press momentum', 'Streaming climb'],
    topDiscovery: '—', joinedAgo: '9 months', lastActive: '4h ago', status: 'standby',
    bio: 'Focused on contemporary R&B and soul artists with authentic emotional depth and crossover appeal. Tracks press momentum and playlist signals to identify acts before major label attention arrives.',
  },
  // ── JUNIOR (existing) ──────────────────────────────────────────────────────
  {
    id: 'SC-13', name: 'Vale', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Social Signal Monitoring',
    region: 'New York / Remote', focus: 'Pop · Singer-Songwriter · Indie',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 5, signsConverted: 0,
    accuracy: 68, confidenceScore: 66, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['TikTok growth', 'Instagram reach', 'Playlist pitching'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '6h ago', status: 'standby',
    bio: 'Entry-level scout developing social platform signal competency. Building pattern recognition across TikTok and Instagram discovery loops. Assigned to pop and singer-songwriter artist scanning.',
  },
  {
    id: 'SC-14', name: 'Reign', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Hip-Hop Ground Intelligence',
    region: 'Atlanta / Southeast', focus: 'Hip-Hop · Trap · R&B',
    liveSignals: 2, discoveries7d: 1, discoveries30d: 2, totalDiscoveries: 3, signsConverted: 0,
    accuracy: 65, confidenceScore: 63, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Local shows', 'SoundCloud', 'Word-of-mouth'],
    topDiscovery: '—', joinedAgo: '4 months', lastActive: '8h ago', status: 'standby',
    bio: 'Southeast embedded junior scout tracking Atlanta grassroots hip-hop. Developing show attendance network and regional industry contacts to build signal quality over time.',
  },
  {
    id: 'SC-15', name: 'Lumen', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Songwriting Intelligence',
    region: 'Nashville / Remote', focus: 'Pop · Singer-Songwriter · Indie Pop',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 4, totalDiscoveries: 6, signsConverted: 0,
    accuracy: 69, confidenceScore: 67, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Publishing co-signs', 'Playlist adds', 'Press coverage'],
    topDiscovery: '—', joinedAgo: '6 months', lastActive: '5h ago', status: 'standby',
    bio: 'Developing songwriting intelligence with focus on identifying co-writer network signals and publishing activity as early breakout indicators. Nashville-rooted with remote coverage.',
  },
  {
    id: 'SC-16', name: 'Grove', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Folk & Roots Discovery',
    region: 'Austin · Portland · Denver', focus: 'Folk · Americana · Alt-Country',
    liveSignals: 2, discoveries7d: 0, discoveries30d: 2, totalDiscoveries: 2, signsConverted: 0,
    accuracy: 62, confidenceScore: 60, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Venue buzz', 'Local radio', 'Streaming trickle'],
    topDiscovery: '—', joinedAgo: '3 months', lastActive: '10h ago', status: 'standby',
    bio: 'Newest scout assigned to the roots and folk corridor. Building show circuit contacts across Austin and Portland. Early-stage signal profile still developing.',
  },
  {
    id: 'SC-17', name: 'Cove', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Bedroom Pop & DIY Detection',
    region: 'Los Angeles / Remote', focus: 'Bedroom Pop · Indie · Dream Pop',
    liveSignals: 2, discoveries7d: 1, discoveries30d: 2, totalDiscoveries: 3, signsConverted: 0,
    accuracy: 64, confidenceScore: 62, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Bandcamp plays', 'SoundCloud growth', 'Blog coverage'],
    topDiscovery: '—', joinedAgo: '4 months', lastActive: '9h ago', status: 'standby',
    bio: 'Focused on DIY and bedroom pop discovery through Bandcamp and independent blog signals. Developing an eye for lo-fi artists with crossover craft before they reach mainstream platforms.',
  },
  // ── JUNIOR (new) ───────────────────────────────────────────────────────────
  {
    id: 'SC-18', name: 'Drift', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Underground-to-Mainstream Tracking',
    region: 'Europe · Berlin · London', focus: 'Hyperpop · Electronic · Underground',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 4, signsConverted: 0,
    accuracy: 66, confidenceScore: 65, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['EU underground', 'Festival buzz', 'Club circuit'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '7h ago', status: 'standby',
    bio: 'European junior scout embedded in underground electronic scenes across Berlin and London. Building a feed of pre-mainstream signals from clubs, festivals, and independent labels.',
  },
  {
    id: 'SC-19', name: 'Pulse', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Streaming Velocity Monitoring',
    region: 'Global / Remote', focus: 'Pop · R&B · Electronic',
    liveSignals: 4, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 5, signsConverted: 0,
    accuracy: 67, confidenceScore: 65, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Streaming velocity', 'Playlist movement', 'Save rate'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '6h ago', status: 'standby',
    bio: 'Data-first junior scout focused on streaming velocity metrics. Tracks save rate acceleration and playlist movement as early breakout signals across Pop, R&B, and Electronic.',
  },
  {
    id: 'SC-20', name: 'Ember', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Soul & Gospel Discovery',
    region: 'Chicago · Detroit · Memphis', focus: 'Soul · Gospel · R&B',
    liveSignals: 2, discoveries7d: 0, discoveries30d: 2, totalDiscoveries: 3, signsConverted: 0,
    accuracy: 63, confidenceScore: 61, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Church circuit', 'Gospel radio', 'Word-of-mouth'],
    topDiscovery: '—', joinedAgo: '4 months', lastActive: '10h ago', status: 'standby',
    bio: 'Building a spiritual music intelligence network across Chicago and Memphis. Ember tracks artists rooted in gospel with crossover potential into mainstream soul and R&B.',
  },
  {
    id: 'SC-21', name: 'Slate', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Alt-Rock & Punk Radar',
    region: 'New York · Los Angeles · Seattle', focus: 'Alt-Rock · Punk · Indie Rock',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 4, signsConverted: 0,
    accuracy: 65, confidenceScore: 64, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Venue buzz', 'Blog coverage', 'Radio spins'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '8h ago', status: 'standby',
    bio: 'Guitar-forward scout tracking the alt-rock and punk revival scenes. Slate covers small venues and independent blogs to surface artists building real audiences before the algorithms notice.',
  },
  {
    id: 'SC-22', name: 'Kairo', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Afrobeats & Global Bass',
    region: 'London · Lagos · Paris', focus: 'Afrobeats · Dancehall · Global Bass',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 4, signsConverted: 0,
    accuracy: 68, confidenceScore: 66, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Diaspora signals', 'UK club plays', 'Cross-genre'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '6h ago', status: 'standby',
    bio: 'Diasporic intelligence network spanning London, Lagos, and Paris. Kairo tracks Afrobeats and global bass artists building momentum through diaspora communities before wider market penetration.',
  },
  {
    id: 'SC-23', name: 'Onyx', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Dark Pop & Experimental',
    region: 'Los Angeles · New York / Remote', focus: 'Dark Pop · Experimental · Alt-Pop',
    liveSignals: 2, discoveries7d: 1, discoveries30d: 2, totalDiscoveries: 3, signsConverted: 0,
    accuracy: 64, confidenceScore: 63, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Pitchfork radar', 'Blog hype', 'Streaming trickle'],
    topDiscovery: '—', joinedAgo: '4 months', lastActive: '9h ago', status: 'standby',
    bio: 'Tracks the dark pop and experimental fringes where the next mainstream wave often originates. Onyx identifies critically lauded artists who are one sync or one viral moment away from breaking.',
  },
  {
    id: 'SC-24', name: 'Sol', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Latin Alternative Discovery',
    region: 'Miami · Mexico City · Buenos Aires', focus: 'Latin Alt · Indie Español · Lo-Fi',
    liveSignals: 3, discoveries7d: 1, discoveries30d: 3, totalDiscoveries: 4, signsConverted: 0,
    accuracy: 66, confidenceScore: 65, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Latin streaming', 'Social growth', 'Cross-border signals'],
    topDiscovery: '—', joinedAgo: '5 months', lastActive: '7h ago', status: 'standby',
    bio: 'Covers the Latin alternative pipeline from Mexico City to Buenos Aires. Sol focuses on Spanish-language indie and lo-fi artists with growing streaming momentum and crossover potential.',
  },
  {
    id: 'SC-25', name: 'Tide', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Coastal Pop & Surf Culture',
    region: 'Los Angeles · Sydney · Cape Town', focus: 'Indie Pop · Surf Rock · Beach Pop',
    liveSignals: 2, discoveries7d: 0, discoveries30d: 2, totalDiscoveries: 2, signsConverted: 0,
    accuracy: 61, confidenceScore: 60, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['Spotify mood playlists', 'Blog coverage', 'DSP adds'],
    topDiscovery: '—', joinedAgo: '3 months', lastActive: '11h ago', status: 'standby',
    bio: 'Newest junior scout tracking coastal indie pop across LA, Sydney, and Cape Town. Tide maps mood-playlist signals and beach culture artists before major DSP algorithmic discovery.',
  },
  {
    id: 'SC-26', name: 'Quartz', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Data & Analytics Signals',
    region: 'Global / Remote', focus: 'Pop · Electronic · Multi-genre',
    liveSignals: 4, discoveries7d: 1, discoveries30d: 4, totalDiscoveries: 5, signsConverted: 0,
    accuracy: 70, confidenceScore: 68, todayReport: false, reportStatus: 'Pending', reportTime: null,
    primarySignals: ['Chartmetric data', 'Cross-platform velocity', 'Algorithmic adds'],
    topDiscovery: '—', joinedAgo: '6 months', lastActive: '5h ago', status: 'standby',
    bio: 'Analytics-first junior scout running quantitative signal models across Chartmetric and streaming APIs. Quartz specializes in identifying statistical outliers that predict artist breakout before human scouts detect them.',
  },
  {
    id: 'SC-27', name: 'Aero', tier: 'Junior',
    role: 'Junior A&R Scout', specialization: 'Global Music Discovery',
    region: 'Global / Remote', focus: 'World Music · Global Fusion · Emerging Markets',
    liveSignals: 2, discoveries7d: 0, discoveries30d: 2, totalDiscoveries: 2, signsConverted: 0,
    accuracy: 62, confidenceScore: 61, todayReport: false, reportStatus: 'Not Submitted', reportTime: null,
    primarySignals: ['World streaming', 'Festival lineups', 'Export signals'],
    topDiscovery: '—', joinedAgo: '3 months', lastActive: '12h ago', status: 'standby',
    bio: 'Broadest coverage footprint in the junior tier. Aero maps emerging market signals from regions with historically undercovered artist pipelines, tracking world music and global fusion artists with export potential.',
  },
];

export const TIER_CONFIG: Record<string, {
  pill: string; glow: string; bar: string; bg: string;
  border: string; icon: string; rank: number;
}> = {
  Elite:  { pill: 'bg-[#F59E0B]/12 text-[#F59E0B] border-[#F59E0B]/30', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]', bar: '#F59E0B', bg: 'bg-[#F59E0B]/[0.04]', border: 'border-[#F59E0B]/15', icon: '◆', rank: 4 },
  Master: { pill: 'bg-[#06B6D4]/12 text-[#06B6D4] border-[#06B6D4]/25', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.06)]',  bar: '#06B6D4', bg: 'bg-[#06B6D4]/[0.03]', border: 'border-[#06B6D4]/12', icon: '◈', rank: 3 },
  Senior: { pill: 'bg-[#10B981]/12 text-[#10B981] border-[#10B981]/25', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.06)]', bar: '#10B981', bg: 'bg-[#10B981]/[0.02]', border: 'border-[#10B981]/10', icon: '●', rank: 2 },
  Junior: { pill: 'bg-white/[0.06] text-white/40 border-white/12',       glow: '',                                         bar: '#6B7280', bg: 'bg-white/[0.01]',       border: 'border-white/[0.06]', icon: '○', rank: 1 },
};

const STATUS_CONFIG = {
  active:  { dot: 'bg-[#10B981] animate-pulse', label: 'Active',  text: 'text-[#10B981]' },
  standby: { dot: 'bg-[#F59E0B]',               label: 'Standby', text: 'text-[#F59E0B]' },
  offline: { dot: 'bg-white/20',                label: 'Offline', text: 'text-white/30'  },
};

const REPORT_STATUS_STYLE: Record<string, string> = {
  'Report Ready':   'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
  'In Progress':    'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  'Pending':        'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',
  'Not Submitted':  'bg-white/5 text-white/25 border-white/10',
};

const TIERS = ['All', 'Elite', 'Master', 'Senior', 'Junior'] as const;

const RESEARCH_TYPES = [
  'Deep artist scan',
  'Market scan',
  'Similar artists',
  'Scene scan',
  'Playlist scan',
  'Competitive landscape scan',
  'Cultural momentum scan',
  'Deep diligence report',
];
const DELIVERABLE_FORMATS = [
  'Daily brief', '7-day report', '14-day tracking', '30-day tracking', 'Full scout memo',
];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const RESULTS_OPTIONS = ['5 results', '10 results', '20 results'];

function RequestResearchModal({ onClose, defaultScout }: { onClose: () => void; defaultScout?: string }) {
  const [form, setForm] = useState({
    scout: defaultScout || 'auto',
    researchType: '',
    criteria: '',
    songRelease: '',
    region: '',
    genre: '',
    resultsRequested: '10 results',
    priority: 'High',
    deadline: '',
    questions: '',
    format: 'Daily brief',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  }

  const inputCls = "w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-[12px] text-white/80 placeholder-white/25 focus:outline-none focus:border-[#EF4444]/40 transition-colors";
  const labelCls = "block text-[9.5px] font-mono text-white/35 uppercase tracking-[0.13em] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#0C0D10] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#0A0B0E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EF4444]/12 border border-[#EF4444]/25 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.15)]">
              <Radio className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white">Request Discovery Research</h2>
              <p className="text-[10px] text-white/35 font-mono">Submit a global A&R research request — Rocksteady assigns the best scout</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-7 h-7 text-[#10B981]" />
            </div>
            <p className="text-[16px] font-bold text-white mb-2">Request Submitted</p>
            <p className="text-[12.5px] text-white/45 max-w-sm mx-auto leading-relaxed">
              Request submitted. Rocksteady is assigning the best scout and will return {form.resultsRequested.split(' ')[0]} qualified results.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Scout Assignment</label>
                <select value={form.scout} onChange={e => setForm(p => ({ ...p, scout: e.target.value }))}
                  className={inputCls}>
                  <option value="auto">Assign best scout for the job (default)</option>
                  {INTERNAL_ASSIGNEES.filter(a => a.type === 'scout').map(a => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Research Type</label>
                <select value={form.researchType} onChange={e => setForm(p => ({ ...p, researchType: e.target.value }))} required
                  className={inputCls}>
                  <option value="">Select type...</option>
                  {RESEARCH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Research Target / Criteria</label>
              <textarea value={form.criteria} onChange={e => setForm(p => ({ ...p, criteria: e.target.value }))} rows={3} required
                placeholder="Describe the type of artist, sound, audience, or opportunity you want discovered…"
                className={`${inputCls} resize-none leading-relaxed`} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Song / Reference Track</label>
                <input value={form.songRelease} onChange={e => setForm(p => ({ ...p, songRelease: e.target.value }))}
                  placeholder="Optional…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Region / Market</label>
                <input value={form.region} onChange={e => setForm(p => ({ ...p, region: e.target.value }))}
                  placeholder="e.g. Lagos, West Coast…" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Genre or Scene</label>
                <input value={form.genre} onChange={e => setForm(p => ({ ...p, genre: e.target.value }))}
                  placeholder="e.g. Afrobeats, Alt-Pop…" className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Results Requested</label>
                <div className="flex gap-2">
                  {RESULTS_OPTIONS.map(r => (
                    <button key={r} type="button" onClick={() => setForm(p => ({ ...p, resultsRequested: r }))}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-mono border transition-all ${form.resultsRequested === r
                        ? 'bg-[#EF4444]/12 text-[#EF4444] border-[#EF4444]/28'
                        : 'bg-white/[0.02] text-white/30 border-white/[0.06] hover:text-white/55 hover:border-white/15'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                  className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Priority</label>
              <div className="flex gap-2">
                {PRIORITIES.map(p => (
                  <button key={p} type="button" onClick={() => setForm(prev => ({ ...prev, priority: p }))}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-mono border transition-all ${form.priority === p
                      ? p === 'Critical' ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30'
                      : p === 'High' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                      : p === 'Medium' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30'
                      : 'bg-white/[0.06] text-white/50 border-white/15'
                      : 'bg-white/[0.02] text-white/25 border-white/[0.05] hover:border-white/15'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Specific Questions / Intelligence Gaps</label>
              <textarea value={form.questions} onChange={e => setForm(p => ({ ...p, questions: e.target.value }))} rows={3}
                placeholder="What specific intelligence gaps should this request fill? Any context, angles, or questions for the scout?"
                className={`${inputCls} resize-none leading-relaxed`} />
            </div>

            <div>
              <label className={labelCls}>Deliverable Format</label>
              <div className="flex flex-wrap gap-2">
                {DELIVERABLE_FORMATS.map(f => (
                  <button key={f} type="button" onClick={() => setForm(prev => ({ ...prev, format: f }))}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${form.format === f
                      ? 'bg-[#EF4444]/12 text-[#EF4444] border-[#EF4444]/25'
                      : 'bg-white/[0.02] text-white/30 border-white/[0.06] hover:text-white/50 hover:border-white/15'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[12px] text-white/40 border border-white/[0.07] hover:text-white/60 hover:border-white/15 transition-all">
                Cancel
              </button>
              <button type="submit"
                className="flex-1 py-2.5 rounded-xl text-[12.5px] font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.12))', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 16px rgba(239,68,68,0.1)' }}>
                Submit Research Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ScoutCard({ scout, featured = false, onRequestResearch }: {
  scout: Scout;
  featured?: boolean;
  onRequestResearch: (name: string) => void;
}) {
  const navigate = useNavigate();
  const tc = TIER_CONFIG[scout.tier];
  const sc = STATUS_CONFIG[scout.status];
  const isPrimary = scout.id === 'SC-00';

  return (
    <div className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${tc.bg} ${tc.border} ${tc.glow} hover:border-opacity-60`}
      style={{ boxShadow: isPrimary ? '0 0 32px rgba(239,68,68,0.08), 0 0 0 1px rgba(239,68,68,0.12)' : `0 0 0 0 transparent` }}
      onClick={() => navigate(`/dashboard/rocksteady/scouts/${scout.id}`)}>

      <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: isPrimary ? 'linear-gradient(90deg, #EF444430, #EF4444, #F59E0B, #EF444430)' : `linear-gradient(90deg, ${tc.bar}30, ${tc.bar}60, ${tc.bar}30)` }} />

      {isPrimary && (
        <div className="absolute top-3 right-3">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 tracking-widest">PRIMARY</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold border"
              style={{ background: isPrimary ? 'rgba(239,68,68,0.12)' : `${tc.bar}15`, borderColor: isPrimary ? 'rgba(239,68,68,0.3)' : `${tc.bar}30`, color: isPrimary ? '#EF4444' : tc.bar }}>
              {scout.name.charAt(0)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#0A0B0E] ${sc.dot}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[14px] font-bold text-white/90">{scout.name}</span>
              <span className="text-[7px] font-mono" style={{ color: tc.bar }}>{tc.icon}</span>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${tc.pill}`}>{scout.tier}</span>
            </div>
            <p className="text-[10px] text-white/35 truncate">{scout.role}</p>
            <p className="text-[9.5px] mt-0.5 truncate font-mono" style={{ color: isPrimary ? '#EF4444' : tc.bar }}>{scout.specialization}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {scout.focus.split(' · ').map(f => (
            <span key={f} className="text-[8px] font-mono px-1.5 py-0.5 rounded border text-white/35 border-white/[0.07] bg-white/[0.02]">{f}</span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-3 text-[9px] text-white/25 font-mono">
          <Globe className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{scout.region}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 mb-3 p-2.5 rounded-lg bg-black/20 border border-white/[0.04]">
          {[
            { label: 'Live', value: scout.liveSignals, color: '#EF4444' },
            { label: '7D',   value: scout.discoveries7d },
            { label: '30D',  value: scout.discoveries30d },
            { label: 'Total',value: scout.totalDiscoveries },
            { label: 'Acc.', value: `${scout.accuracy}%`, color: '#10B981' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-[12px] font-bold leading-tight" style={{ color: color || tc.bar }}>{value}</p>
              <p className="text-[7.5px] font-mono text-white/20 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          {scout.primarySignals.slice(0, 2).map(sig => (
            <span key={sig} className="text-[7.5px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: tc.bar, borderColor: `${tc.bar}30`, background: `${tc.bar}0D` }}>{sig}</span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t" style={{ borderColor: `${tc.bar}15` }}>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${REPORT_STATUS_STYLE[scout.reportStatus]}`}>
            {scout.reportStatus}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={e => { e.stopPropagation(); onRequestResearch(scout.name); }}
              className="text-[9px] font-mono px-2 py-1 rounded border text-white/30 border-white/[0.07] hover:text-white/60 hover:border-white/20 transition-all"
              title="Request Research">
              Request Research
            </button>
            <button
              onClick={e => { e.stopPropagation(); navigate(`/dashboard/rocksteady/scouts/${scout.id}`); }}
              className="flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border transition-all"
              style={{ color: tc.bar, borderColor: `${tc.bar}30`, background: `${tc.bar}0D` }}>
              Open <ChevronRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScoutNetwork() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'accuracy' | 'liveSignals' | 'discoveries30d'>('accuracy');
  const [researchModal, setResearchModal] = useState(false);
  const [researchScout, setResearchScout] = useState<string>('');

  function openResearch(scoutName: string) {
    setResearchScout(scoutName);
    setResearchModal(true);
  }

  const filtered = SCOUTS
    .filter(s => {
      if (activeFilter !== 'All' && s.tier !== activeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.region.toLowerCase().includes(q) && !s.focus.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const tierDiff = TIER_CONFIG[b.tier].rank - TIER_CONFIG[a.tier].rank;
      if (tierDiff !== 0 && activeFilter === 'All') return tierDiff;
      return b[sortBy] - a[sortBy];
    });

  const totalLive = SCOUTS.reduce((a, s) => a + s.liveSignals, 0);
  const reportsReady = SCOUTS.filter(s => s.reportStatus === 'Report Ready').length;
  const activeCount = SCOUTS.filter(s => s.status === 'active').length;
  const avgAccuracy = Math.round(SCOUTS.reduce((a, s) => a + s.accuracy, 0) / SCOUTS.length);

  return (
    <div className="min-h-full bg-[#07080A]">
      {researchModal && (
        <RequestResearchModal onClose={() => setResearchModal(false)} defaultScout={researchScout} />
      )}

      <div className="relative bg-[#09090D] border-b border-[#10B981]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/20 to-transparent" />
        <div className="absolute -top-8 right-1/3 w-48 h-16 rounded-full opacity-[0.04] blur-3xl bg-[#10B981]" />

        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[#10B981]" />
              </div>
              <div>
                <h1 className="text-[19px] font-bold text-white leading-tight">Scout Network</h1>
                <p className="text-[10.5px] text-white/25 leading-none">AI intelligence operator network · {SCOUTS.length} active scouts</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap ml-auto">
            {[
              { label: 'Live Signals', value: totalLive, color: '#EF4444', icon: Activity },
              { label: 'Reports Ready', value: reportsReady, color: '#10B981', icon: CheckCircle },
              { label: 'Active Now', value: activeCount, color: '#06B6D4', icon: Zap },
              { label: 'Avg Accuracy', value: `${avgAccuracy}%`, color: '#F59E0B', icon: Star },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5 px-3.5 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                <div>
                  <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                  <p className="text-[13px] font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search scouts, regions, genres..."
              className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.07] rounded-lg text-[12px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#10B981]/40" />
          </div>

          <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {TIERS.map(t => (
              <button key={t} onClick={() => setActiveFilter(t)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${activeFilter === t
                  ? 'bg-[#10B981]/12 text-[#10B981] border border-[#10B981]/25'
                  : 'text-white/30 hover:text-white/60'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[9px] font-mono text-white/20 mr-1">SORT</span>
            {([['accuracy', 'Accuracy'], ['liveSignals', 'Live'], ['discoveries30d', '30D']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setSortBy(key)}
                className={`px-2.5 py-1.5 rounded text-[10px] font-mono border transition-all ${sortBy === key
                  ? 'bg-white/[0.06] text-white/80 border-white/20'
                  : 'text-white/25 border-white/[0.06] hover:text-white/50'}`}>
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={() => openResearch('')}
            title="Submit a global A&R research request — Rocksteady will assign the best scout"
            className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[12px] font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.22), rgba(239,68,68,0.12))',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.35)',
              boxShadow: '0 0 20px rgba(239,68,68,0.18), 0 0 0 0 transparent',
            }}>
            <span className="absolute inset-0 rounded-xl animate-pulse opacity-0 hover:opacity-100" style={{ boxShadow: '0 0 24px rgba(239,68,68,0.25)' }} />
            <Radio className="w-4 h-4 shrink-0" />
            Request Discovery Research
          </button>
        </div>

        {activeFilter === 'All' ? (
          <div className="space-y-6">
            {(['Elite', 'Master', 'Senior'] as const).map(tier => {
              const inTier = filtered.filter(s => s.tier === tier);
              if (inTier.length === 0) return null;
              const tc = TIER_CONFIG[tier];
              return (
                <div key={tier}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-mono font-bold" style={{ color: tc.bar }}>{tc.icon} {tier} Scout{inTier.length > 1 ? 's' : ''}</span>
                    <div className="flex-1 h-[1px]" style={{ background: `${tc.bar}20` }} />
                    <span className="text-[9px] font-mono text-white/15">{inTier.length} scout{inTier.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className={`grid gap-4 ${tier === 'Elite' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                    {inTier.map(scout => (
                      <ScoutCard key={scout.id} scout={scout} featured={tier === 'Elite'} onRequestResearch={openResearch} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(scout => (
              <ScoutCard key={scout.id} scout={scout} onRequestResearch={openResearch} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <AlertTriangle className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-[13px] text-white/25">No scouts match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
