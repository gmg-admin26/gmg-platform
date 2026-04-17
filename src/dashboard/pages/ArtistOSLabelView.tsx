import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { injectLiveCSS } from '../utils/liveSystem';
import {
  Building2, Users, DollarSign, TrendingUp, TrendingDown,
  BarChart2, Zap, ArrowUpRight, Activity, Radio, CheckCircle,
  ExternalLink, Target, AlertTriangle, Flame, Minus, Wallet,
  CreditCard, Disc3, Megaphone, BarChart, ArrowUp, ArrowDown,
  ChevronRight, Clock, XCircle, CircleDot, Send, Wrench,
  ShieldAlert, CalendarClock, Layers, Focus, Eye,
} from 'lucide-react';
import { LabelFundingSafe } from '../components/labels/LabelFundingSafe';
import OperatorTeamGrid from '../components/artistOS/OperatorTeamGrid';
import { LabelHealthSystem } from '../components/labels/LabelHealthSystem';
import LabelPortfolioEngine from '../components/labels/LabelPortfolioEngine';
import AutopilotModeControl from '../components/autopilot/AutopilotModeControl';
import AutopilotStatusStrip from '../components/autopilot/AutopilotStatusStrip';
import LiveSystemFeed from '../components/LiveSystemFeed';
import SignalFeedModule from '../components/SignalFeedModule';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}
function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
function healthColor(s: number) {
  return s >= 80 ? '#10B981' : s >= 60 ? '#F59E0B' : '#EF4444';
}

const LABEL_COLOR = '#F59E0B';

const LABEL = {
  name: 'SPIN Records',
  type: 'Brand Imprint',
  status: 'Active',
  healthScore: 79,
  descriptor: 'Flagship culture imprint focused on scalable artist growth.',
  founded: 2019,
};

type PrioritySignal = 'Scale Now' | 'Breakout' | 'Maintain' | 'At Risk';

const PRIORITY_META: Record<PrioritySignal, { color: string; bg: string; icon: React.ElementType }> = {
  'Scale Now':  { color: '#EC4899', bg: 'rgba(236,72,153,0.1)',   icon: Zap },
  'Breakout':   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   icon: Flame },
  'Maintain':   { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',   icon: Minus },
  'At Risk':    { color: '#EF4444', bg: 'rgba(239,68,68,0.09)',   icon: AlertTriangle },
};

const ROSTER_ARTISTS = [
  {
    id: 'aar',
    name: 'All American Rejects',
    initials: 'AAR',
    color: '#06B6D4',
    lane: 'Alt-Rock / Nostalgia',
    monthlyListeners: 2_100_000,
    listenerDelta: '+12%',
    listenerTrend: 'up' as const,
    healthScore: 88,
    activeCampaigns: 2,
    ytdRevenue: 142_000,
    status: 'Active',
    releaseStatus: 'Pre-Release',
    prioritySignal: 'Scale Now' as PrioritySignal,
  },
  {
    id: 'rs',
    name: 'Robot Sunrise',
    initials: 'RS',
    color: '#06B6D4',
    lane: 'Indie Pop / Electronic',
    monthlyListeners: 287_000,
    listenerDelta: '+34%',
    listenerTrend: 'up' as const,
    healthScore: 74,
    activeCampaigns: 1,
    ytdRevenue: 38_400,
    status: 'Active',
    releaseStatus: 'In Production',
    prioritySignal: 'Breakout' as PrioritySignal,
  },
  {
    id: 'jrg',
    name: 'Jorgen',
    initials: 'JR',
    color: '#10B981',
    lane: 'Hip-Hop / Alternative',
    monthlyListeners: 91_500,
    listenerDelta: '+8%',
    listenerTrend: 'up' as const,
    healthScore: 63,
    activeCampaigns: 1,
    ytdRevenue: 19_200,
    status: 'Active',
    releaseStatus: 'Scheduled',
    prioritySignal: 'At Risk' as PrioritySignal,
  },
];

const RELEASE_STATUS_COLOR: Record<string, string> = {
  'Pre-Release': '#EC4899',
  'In Production': '#F59E0B',
  'Scheduled': '#06B6D4',
  'Released': '#10B981',
  'Blocked': '#EF4444',
};

const TOTALS = {
  totalArtists: ROSTER_ARTISTS.length,
  totalListeners: ROSTER_ARTISTS.reduce((s, a) => s + a.monthlyListeners, 0),
  totalRevenue: ROSTER_ARTISTS.reduce((s, a) => s + a.ytdRevenue, 0),
  activeCampaigns: ROSTER_ARTISTS.reduce((s, a) => s + a.activeCampaigns, 0),
};

type FeedCategory = 'all' | 'financial' | 'campaigns' | 'releases';

type ImpactDirection = 'up' | 'down' | 'neutral';

interface FeedItem {
  id: string;
  artist: string;
  artistInitials: string;
  artistColor: string;
  category: Exclude<FeedCategory, 'all'>;
  eventType: string;
  description: string;
  impact: string;
  impactDirection: ImpactDirection;
  time: string;
}

const INTEL_FEED: FeedItem[] = [
  {
    id: '1',
    artist: 'All American Rejects',
    artistInitials: 'AAR',
    artistColor: '#06B6D4',
    category: 'financial',
    eventType: 'Payout',
    description: 'Q1 streaming royalty payout processed — Spotify + Apple Music',
    impact: '+$38,200',
    impactDirection: 'up',
    time: '1h ago',
  },
  {
    id: '2',
    artist: 'All American Rejects',
    artistInitials: 'AAR',
    artistColor: '#06B6D4',
    category: 'campaigns',
    eventType: 'Campaign',
    description: 'Pre-save campaign live — 12,400 saves · LATAM creator brief deployed',
    impact: '+12.4K saves',
    impactDirection: 'up',
    time: '2h ago',
  },
  {
    id: '3',
    artist: 'Robot Sunrise',
    artistInitials: 'RS',
    artistColor: '#06B6D4',
    category: 'releases',
    eventType: 'Release',
    description: 'Album mastering complete · delivery queued for DSPs',
    impact: 'On Track',
    impactDirection: 'neutral',
    time: '6h ago',
  },
  {
    id: '4',
    artist: 'Robot Sunrise',
    artistInitials: 'RS',
    artistColor: '#06B6D4',
    category: 'campaigns',
    eventType: 'Campaign',
    description: 'EU playlist campaign underperforming — 18% below click target',
    impact: '-18% CTR',
    impactDirection: 'down',
    time: '8h ago',
  },
  {
    id: '5',
    artist: 'Jorgen',
    artistInitials: 'JR',
    artistColor: '#10B981',
    category: 'releases',
    eventType: 'Release',
    description: 'Spotify editorial pitch submitted for upcoming single',
    impact: 'Pending',
    impactDirection: 'neutral',
    time: '1d ago',
  },
  {
    id: '6',
    artist: 'All American Rejects',
    artistInitials: 'AAR',
    artistColor: '#06B6D4',
    category: 'financial',
    eventType: 'Recoupment',
    description: 'Advance recoupment at 74% — projected full recovery in 6 weeks',
    impact: '74% recouped',
    impactDirection: 'up',
    time: '1d ago',
  },
  {
    id: '7',
    artist: 'Jorgen',
    artistInitials: 'JR',
    artistColor: '#10B981',
    category: 'campaigns',
    eventType: 'Campaign',
    description: 'No active paid campaigns — last campaign ended 18 days ago',
    impact: 'No spend',
    impactDirection: 'down',
    time: '2d ago',
  },
  {
    id: '8',
    artist: 'Robot Sunrise',
    artistInitials: 'RS',
    artistColor: '#06B6D4',
    category: 'financial',
    eventType: 'Revenue',
    description: 'Streaming spike — +34% listener growth driving incremental revenue',
    impact: '+$4,100',
    impactDirection: 'up',
    time: '2d ago',
  },
];

const CATEGORY_META: Record<Exclude<FeedCategory, 'all'>, { color: string; icon: React.ElementType }> = {
  financial: { color: '#10B981', icon: CreditCard },
  campaigns: { color: '#F59E0B', icon: Megaphone },
  releases:  { color: '#06B6D4', icon: Disc3 },
};

const WEEK_INSIGHTS = [
  { text: '+$12K revenue from streaming spike', direction: 'up' as ImpactDirection, color: '#10B981' },
  { text: 'Robot Sunrise campaign underperforming in EU', direction: 'down' as ImpactDirection, color: '#EF4444' },
  { text: 'Pre-save conversion above baseline', direction: 'up' as ImpactDirection, color: '#06B6D4' },
];

type ReleaseUrgency = 'blocking' | 'at-risk' | 'ready';
type ReleaseStage = 'Pre-Release' | 'In Production' | 'Scheduled';

interface ReleaseCard {
  id: string;
  artist: string;
  artistInitials: string;
  artistColor: string;
  title: string;
  stage: ReleaseStage;
  readiness: number;
  nextDeadline: string;
  daysUntil: number;
  blockers: string[];
  urgency: ReleaseUrgency;
}

interface LabelAction {
  id: string;
  artist: string;
  artistColor: string;
  text: string;
  urgency: ReleaseUrgency;
  type: 'approve' | 'submit' | 'fix';
}

const RELEASE_CARDS: ReleaseCard[] = [
  {
    id: 'aar-rel',
    artist: 'All American Rejects',
    artistInitials: 'AAR',
    artistColor: '#06B6D4',
    title: '"Flagpole Sitta" Campaign Release',
    stage: 'Pre-Release',
    readiness: 91,
    nextDeadline: 'Apr 18 · Asset Lock',
    daysUntil: 6,
    blockers: ['Artwork variant not approved', 'Pre-save link pending'],
    urgency: 'at-risk',
  },
  {
    id: 'rs-rel',
    artist: 'Robot Sunrise',
    artistInitials: 'RS',
    artistColor: '#06B6D4',
    title: '"Neon Grid" EP',
    stage: 'In Production',
    readiness: 62,
    nextDeadline: 'Apr 22 · Mastered Delivery',
    daysUntil: 10,
    blockers: ['Mixing revision outstanding', 'Metadata incomplete', 'DSP submission blocked'],
    urgency: 'blocking',
  },
  {
    id: 'jrg-rel',
    artist: 'Jorgen',
    artistInitials: 'JR',
    artistColor: '#10B981',
    title: '"Frequency" Single',
    stage: 'Scheduled',
    readiness: 100,
    nextDeadline: 'May 2 · Go-Live',
    daysUntil: 20,
    blockers: [],
    urgency: 'ready',
  },
];

const LABEL_ACTIONS: LabelAction[] = [
  {
    id: 'act-1',
    artist: 'All American Rejects',
    artistColor: '#06B6D4',
    text: 'Approve artwork assets for AAR pre-release',
    urgency: 'at-risk',
    type: 'approve',
  },
  {
    id: 'act-2',
    artist: 'Robot Sunrise',
    artistColor: '#06B6D4',
    text: 'Submit "Neon Grid" EP metadata to DSPs',
    urgency: 'blocking',
    type: 'submit',
  },
  {
    id: 'act-3',
    artist: 'Robot Sunrise',
    artistColor: '#06B6D4',
    text: 'Fix mixing revision — blocking mastered delivery',
    urgency: 'blocking',
    type: 'fix',
  },
  {
    id: 'act-4',
    artist: 'Jorgen',
    artistColor: '#10B981',
    text: 'Finalize go-live checklist for "Frequency"',
    urgency: 'ready',
    type: 'approve',
  },
];

const URGENCY_META: Record<ReleaseUrgency, { color: string; label: string; bg: string }> = {
  blocking: { color: '#EF4444', label: 'Blocking',  bg: 'rgba(239,68,68,0.08)' },
  'at-risk': { color: '#F59E0B', label: 'At Risk',  bg: 'rgba(245,158,11,0.08)' },
  ready:     { color: '#10B981', label: 'Ready',    bg: 'rgba(16,185,129,0.08)' },
};

const STAGE_META: Record<ReleaseStage, { color: string; icon: React.ElementType }> = {
  'Pre-Release':   { color: '#EC4899', icon: CircleDot },
  'In Production': { color: '#F59E0B', icon: Wrench },
  'Scheduled':     { color: '#06B6D4', icon: CalendarClock },
};

const CRITICAL_ALERTS = [
  { id: 'a1', urgency: 'blocking' as ReleaseUrgency, artist: 'Robot Sunrise', artistColor: '#06B6D4', text: 'DSP metadata submission still blocked — delivery window closes in 10 days', action: 'Submit Now' },
  { id: 'a2', urgency: 'at-risk' as ReleaseUrgency, artist: 'All American Rejects', artistColor: '#06B6D4', text: 'Artwork variant not approved — asset lock is April 18 (6 days)', action: 'Approve' },
  { id: 'a3', urgency: 'blocking' as ReleaseUrgency, artist: 'Robot Sunrise', artistColor: '#06B6D4', text: 'EU playlist campaign 18% below CTR target — daily spend is live', action: 'Fix Campaign' },
  { id: 'a4', urgency: 'at-risk' as ReleaseUrgency, artist: 'Jorgen', artistColor: '#10B981', text: 'No active paid campaigns — artist has been dark for 18 days', action: 'Launch Campaign' },
];

const CAMPAIGN_ACTIONS = [
  { id: 'c1', artist: 'All American Rejects', artistColor: '#06B6D4', type: 'Pre-Save Push', status: 'Live', statusColor: '#10B981', spend: '$1,200/d', returns: '+12.4K saves', action: 'Scale Budget' },
  { id: 'c2', artist: 'Robot Sunrise', artistColor: '#06B6D4', type: 'EU Playlist Campaign', status: 'Underperforming', statusColor: '#EF4444', spend: '$800/d', returns: '-18% CTR', action: 'Pause + Fix' },
  { id: 'c3', artist: 'Jorgen', artistColor: '#10B981', type: 'No Active Campaign', status: 'Inactive', statusColor: '#6B7280', spend: '$0/d', returns: '—', action: 'Launch Now' },
];

function FocusModePanel({ navigate }: { navigate: (path: string) => void }) {
  const blockingCount = CRITICAL_ALERTS.filter(a => a.urgency === 'blocking').length;
  return (
    <div className="space-y-4">
      {/* Focus Mode banner */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
        style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.2)', boxShadow: '0 0 20px rgba(236,72,153,0.04)' }}>
        <div className="w-2 h-2 rounded-full bg-[#EC4899]" style={{ boxShadow: '0 0 6px #EC4899', flexShrink: 0 }} />
        <span className="text-[10px] font-mono font-bold text-[#EC4899] uppercase tracking-wider">Execution Mode Active</span>
        <span className="text-[9px] font-mono text-white/30 ml-1">— showing only what requires action right now</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[8px] font-mono px-2 py-0.5 rounded" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {blockingCount} blocking
          </span>
          <span className="text-[8px] font-mono px-2 py-0.5 rounded" style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            {CRITICAL_ALERTS.filter(a => a.urgency === 'at-risk').length} at risk
          </span>
        </div>
      </div>

      {/* 3-column execution grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Col 1: Critical Alerts — sorted by urgency */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(239,68,68,0.18)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.6),transparent)' }} />
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <AlertTriangle size={10} color="#EF4444" />
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Critical Alerts</span>
            <span className="text-[7px] font-mono px-1.5 py-0.5 rounded ml-auto" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {CRITICAL_ALERTS.length} total
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {[...CRITICAL_ALERTS].sort((a, b) => (a.urgency === 'blocking' ? -1 : 1) - (b.urgency === 'blocking' ? -1 : 1)).map(alert => {
              const um = URGENCY_META[alert.urgency];
              return (
                <div key={alert.id} className="px-5 py-3.5 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                      style={{ background: `${alert.artistColor}15`, border: `1px solid ${alert.artistColor}25` }}>
                      <span className="text-[6px] font-black" style={{ color: alert.artistColor }}>
                        {alert.artist.split(' ').map(w => w[0]).join('').slice(0, 3)}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-white/30 flex-1 truncate">{alert.artist}</span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: um.color, background: `${um.color}12`, border: `1px solid ${um.color}20` }}>
                      {um.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/55 leading-snug">{alert.text}</p>
                  <button
                    className="self-start flex items-center gap-1.5 text-[8px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: um.color, background: `${um.color}10`, border: `1px solid ${um.color}22` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${um.color}20`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${um.color}10`; }}
                  >
                    <Zap size={8} color={um.color} /> {alert.action}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 2: Campaign Actions */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(245,158,11,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.55),transparent)' }} />
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Megaphone size={10} color="#F59E0B" />
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Campaign Actions</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {CAMPAIGN_ACTIONS.map(c => (
              <div key={c.id} className="px-5 py-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                    style={{ background: `${c.artistColor}15`, border: `1px solid ${c.artistColor}25` }}>
                    <span className="text-[6px] font-black" style={{ color: c.artistColor }}>
                      {c.artist.split(' ').map(w => w[0]).join('').slice(0, 3)}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-white/30 flex-1 truncate">{c.artist}</span>
                  <span className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: c.statusColor, background: `${c.statusColor}12`, border: `1px solid ${c.statusColor}20` }}>
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-white/65">{c.type}</p>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[8px] font-mono text-white/20 block">Spend</span>
                    <span className="text-[10px] font-mono font-bold text-[#F59E0B]">{c.spend}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-white/20 block">Returns</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: c.statusColor }}>{c.returns}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/dashboard/campaign-engine')}
                  className="self-start flex items-center gap-1.5 text-[8px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
                  style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.1)'; }}
                >
                  <ArrowUpRight size={8} color="#F59E0B" /> {c.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Col 3: Safe (top actions) */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(16,185,129,0.15)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.55),transparent)' }} />
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-white/[0.05]">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Wallet size={10} color="#10B981" />
            </div>
            <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-bold">Safe — Actions</span>
          </div>

          {/* Funding summary */}
          <div className="px-5 py-4 space-y-3 border-b border-white/[0.05]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-white/25">Available Balance</span>
              <span className="text-[16px] font-black text-[#10B981]">$284,000</span>
            </div>
            <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '71%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
            </div>
            <div className="flex items-center justify-between text-[8px] font-mono text-white/20">
              <span>$284K of $400K available</span>
              <span>71%</span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="px-5 py-4 space-y-2.5">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Quick Actions</span>
            {[
              { label: 'Approve AAR artwork release', color: '#06B6D4', type: 'approve' as const },
              { label: 'Allocate budget — Jorgen campaign', color: '#10B981', type: 'approve' as const },
              { label: 'Submit RS EP metadata to DSPs', color: '#06B6D4', type: 'submit' as const },
            ].map((qa, i) => {
              const QIcon = qa.type === 'approve' ? CheckCircle : Send;
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group cursor-pointer transition-all"
                  style={{ background: `${qa.color}05`, border: `1px solid ${qa.color}14` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = `${qa.color}10`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = `${qa.color}05`; }}>
                  <QIcon size={11} color={qa.color} className="shrink-0" />
                  <span className="text-[10px] text-white/50 group-hover:text-white/70 transition-colors leading-snug">{qa.label}</span>
                  <ChevronRight size={9} color="rgba(255,255,255,0.2)" className="ml-auto shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Recoupment status */}
          <div className="px-5 py-4 border-t border-white/[0.05] space-y-2.5">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Recoupment Status</span>
            {[
              { name: 'All American Rejects', color: '#06B6D4', pct: 74, label: '74% · on track' },
              { name: 'Robot Sunrise', color: '#06B6D4', pct: 31, label: '31% · monitor' },
              { name: 'Jorgen', color: '#10B981', pct: 55, label: '55% · stable' },
            ].map(r => (
              <div key={r.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-white/30 truncate">{r.name}</span>
                  <span className="text-[8px] font-mono shrink-0 ml-2" style={{ color: r.color }}>{r.label}</span>
                </div>
                <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color + 'BB' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const LABEL_STAT_IS_LIVE: Record<string, boolean> = {
  'Total Artists': false,
  'Monthly Listeners': true,
  'Revenue YTD': false,
  'Active Campaigns': true,
  'Label Health': true,
};

const LABEL_STAT_UPDATED: Record<string, string> = {
  'Total Artists': '6h ago',
  'Monthly Listeners': '4m ago',
  'Revenue YTD': '1h ago',
  'Active Campaigns': '2m ago',
  'Label Health': '8m ago',
};

const LABEL_STAT_PROGRESS: Record<string, number> = {
  'Total Artists': 60,
  'Monthly Listeners': 78,
  'Revenue YTD': 65,
  'Active Campaigns': 40,
  'Label Health': 79,
};

function LabelStatProgressBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div style={{ height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: `linear-gradient(90deg, ${color}80, ${color})`,
        borderRadius: 2,
        boxShadow: `0 0 6px ${color}50`,
        transition: 'width 0.85s cubic-bezier(0.25,1,0.5,1)',
      }} />
    </div>
  );
}

function LabelSummaryStats({ hc }: { hc: string }) {
  useEffect(() => { injectLiveCSS(); }, []);
  const [signalled, setSignalled] = useState<Set<string>>(new Set());

  const stats = [
    { icon: Users,      label: 'Total Artists',     value: TOTALS.totalArtists.toString(),    color: '#06B6D4', sub: 'Active roster'          },
    { icon: Activity,   label: 'Monthly Listeners', value: fmt(TOTALS.totalListeners),         color: '#10B981', sub: 'Combined · all artists'  },
    { icon: TrendingUp, label: 'Revenue YTD',        value: fmtMoney(TOTALS.totalRevenue),      color: '#10B981', sub: 'Imprint aggregate'       },
    { icon: Zap,        label: 'Active Campaigns',   value: TOTALS.activeCampaigns.toString(),  color: '#F59E0B', sub: 'Running now'             },
    { icon: BarChart2,  label: 'Label Health',       value: LABEL.healthScore.toString(),       color: hc,        sub: 'System composite score'  },
  ];

  useEffect(() => {
    const liveLabels = stats.filter(s => LABEL_STAT_IS_LIVE[s.label]).map(s => s.label);
    let idx = 0;
    const cycle = () => {
      const lbl = liveLabels[idx % liveLabels.length];
      setSignalled(prev => new Set(prev).add(lbl));
      setTimeout(() => setSignalled(prev => { const n = new Set(prev); n.delete(lbl); return n; }), 1800);
      idx++;
    };
    const t = setInterval(cycle, 10000);
    const t0 = setTimeout(cycle, 2800);
    return () => { clearInterval(t); clearTimeout(t0); };
  }, []);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-5 gap-3">
      {stats.map((item, i) => {
        const isLive = LABEL_STAT_IS_LIVE[item.label];
        const isSignalled = signalled.has(item.label);
        return (
          <div
            key={item.label}
            className="relative rounded-xl p-4 overflow-hidden ls-fade-up"
            style={{
              background: '#0D0E11',
              border: isSignalled ? `1px solid ${item.color}30` : '1px solid rgba(255,255,255,0.07)',
              boxShadow: isSignalled ? `0 0 18px ${item.color}08, inset 0 0 12px ${item.color}04` : undefined,
              transition: 'border-color 0.4s, box-shadow 0.4s',
              animationDelay: `${i * 60}ms`,
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: `linear-gradient(90deg, transparent, ${item.color}55, transparent)` }} />
            {isLive && (
              <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: item.color, opacity: 0.4, animation: 'ls-ring-ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span className="ls-live-dot" style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${item.color}14`, border: `1px solid ${item.color}22` }}>
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
              </div>
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">{item.label}</span>
            </div>
            <p
              className="text-[24px] font-black leading-none"
              style={{
                color: item.color,
                animation: isSignalled ? 'ls-number-pop 0.5s cubic-bezier(0.16,1,0.3,1)' : undefined,
              }}
            >{item.value}</p>
            <p className="text-[9px] text-white/20 mt-1.5">{item.sub}</p>
            <LabelStatProgressBar pct={LABEL_STAT_PROGRESS[item.label] ?? 50} color={item.color} delay={i * 80} />
            <p style={{ margin: '5px 0 0', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.16)' }}>
              {isLive ? 'LIVE' : 'Updated'} · {LABEL_STAT_UPDATED[item.label] ?? '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function ArtistOSLabelView() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'listeners' | 'revenue' | 'health'>('listeners');
  const [feedFilter, setFeedFilter] = useState<FeedCategory>('all');
  const [focusMode, setFocusMode] = useState(false);
  const hc = healthColor(LABEL.healthScore);

  useEffect(() => { injectLiveCSS(); }, []);

  const sortedAll = [...ROSTER_ARTISTS].sort((a, b) =>
    sortBy === 'listeners' ? b.monthlyListeners - a.monthlyListeners
    : sortBy === 'revenue'  ? b.ytdRevenue - a.ytdRevenue
    : b.healthScore - a.healthScore
  );
  const sortedByUrgency = [...ROSTER_ARTISTS].sort((a, b) => a.healthScore - b.healthScore);
  const sorted = focusMode ? sortedByUrgency.slice(0, 3) : sortedAll;

  const maxRev = Math.max(...ROSTER_ARTISTS.map(a => a.ytdRevenue));
  const maxList = Math.max(...ROSTER_ARTISTS.map(a => a.monthlyListeners));

  return (
    <div className="p-5 space-y-5 min-h-full bg-[#08090B]">

      {/* ── IMPRINT IDENTITY BLOCK ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D0E11', border: `1px solid ${focusMode ? '#EC4899' : LABEL_COLOR}22`, boxShadow: `0 0 40px ${focusMode ? '#EC4899' : LABEL_COLOR}08`, position: 'relative', transition: 'border-color 0.3s, box-shadow 0.3s' }}>
        {/* Top shimmer line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: focusMode ? 'linear-gradient(90deg,transparent,#EC489980,#EF444460,transparent)' : `linear-gradient(90deg,transparent,${LABEL_COLOR}80,transparent)`, transition: 'background 0.3s' }} />
        {/* Ambient glow left edge */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: focusMode ? 'linear-gradient(180deg,transparent,#EC489940,transparent)' : `linear-gradient(180deg,transparent,${LABEL_COLOR}40,transparent)`, transition: 'background 0.3s' }} />

        <div className="px-6 py-5">
          <div className="flex items-center gap-5">

            {/* ── LOGO SLOT ── */}
            <div className="shrink-0 relative self-center">
              <div className="flex items-center justify-center rounded-2xl"
                style={{
                  height: 72,
                  minWidth: 72,
                  maxWidth: 160,
                  padding: '10px 14px',
                  background: 'rgba(15,16,19,0.95)',
                  border: `1px solid ${LABEL_COLOR}28`,
                  boxShadow: `0 0 24px ${LABEL_COLOR}12, inset 0 0 16px rgba(0,0,0,0.5)`,
                }}>
                <img
                  src="/spin-records-logo.png"
                  alt="SPIN Records"
                  style={{
                    maxHeight: 52,
                    maxWidth: 132,
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>
              {/* Active pulse ring */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#08090B] flex items-center justify-center"
                style={{ background: '#10B981', boxShadow: '0 0 6px #10B981' }}>
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>

            {/* ── LABEL INFO ── */}
            <div className="flex-1 min-w-0">
              {/* Name + badges row */}
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-[24px] font-black text-white tracking-tight leading-none">{LABEL.name}</h1>
                <span className="text-[8px] font-mono px-2.5 py-1 rounded-md" style={{ color: LABEL_COLOR, background: `${LABEL_COLOR}15`, border: `1px solid ${LABEL_COLOR}28`, letterSpacing: '0.08em' }}>
                  {LABEL.type}
                </span>
                <span className="text-[8px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', letterSpacing: '0.08em' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block" style={{ boxShadow: '0 0 5px #10B981', animation: 'pulse 2s infinite' }} />
                  {LABEL.status}
                </span>
                {focusMode && (
                  <span className="text-[8px] font-mono px-2.5 py-1 rounded-md flex items-center gap-1.5" style={{ color: '#EC4899', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.28)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] inline-block" style={{ boxShadow: '0 0 5px #EC4899', animation: 'pulse 1.5s infinite' }} />
                    FOCUS MODE
                  </span>
                )}
              </div>

              {/* Descriptor */}
              <p className="text-[11.5px] text-white/45 mb-2.5 leading-relaxed">
                {focusMode
                  ? 'Execution view — showing critical actions only'
                  : LABEL.descriptor
                }
              </p>

              {/* Meta chips */}
              {!focusMode && (
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.15)' }}>
                    <div className="w-3.5 h-3.5 rounded flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.18)' }}>
                      <span className="text-[5px] font-black text-[#06B6D4]">AAR</span>
                    </div>
                    <span className="text-[8px] font-mono text-white/40">Flagship: <span className="text-white/65">All American Rejects</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.14)' }}>
                    <span className="text-[8px] font-mono text-white/40">Genre: <span className="text-[#F59E0B]">Alt Rock / Indie Pop</span></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.14)' }}>
                    <span className="text-[8px] font-mono text-white/40">Markets: <span className="text-[#06B6D4]">LATAM · EU</span></span>
                  </div>
                </div>
              )}

              {/* Status tags */}
              {!focusMode && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: 'Touring Active',     color: '#10B981' },
                    { label: 'Catalog Performing', color: '#F59E0B' },
                    { label: 'Campaign Scaling',   color: '#06B6D4' },
                  ].map(tag => (
                    <span key={tag.label} className="flex items-center gap-1 text-[7px] font-mono px-2 py-0.5 rounded-full"
                      style={{ color: tag.color, background: `${tag.color}0C`, border: `1px solid ${tag.color}20` }}>
                      <span className="w-1 h-1 rounded-full inline-block" style={{ background: tag.color, boxShadow: `0 0 3px ${tag.color}` }} />
                      {tag.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT CONTROLS ── */}
            <div className="shrink-0 flex flex-col items-end gap-2.5">
              {/* Health score */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: `${hc}0A`, border: `1px solid ${hc}22` }}>
                <div className="flex flex-col items-center">
                  <span className="text-[18px] font-black leading-none" style={{ color: hc }}>{LABEL.healthScore}</span>
                  <span className="text-[7px] font-mono text-white/25 tracking-widest uppercase mt-0.5">Health</span>
                </div>
                <div className="w-[1px] h-7 bg-white/[0.07]" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: hc, boxShadow: `0 0 4px ${hc}` }} />
                    <span className="text-[8px] font-mono text-white/35">Imprint Score</span>
                  </div>
                  <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${LABEL.healthScore}%`, background: `linear-gradient(90deg, ${hc}99, ${hc})` }} />
                  </div>
                </div>
              </div>

              {/* Focus Mode toggle */}
              <button
                onClick={() => setFocusMode(f => !f)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200"
                style={focusMode
                  ? { background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 0 12px rgba(236,72,153,0.2)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }
                }
              >
                {focusMode
                  ? <Eye size={13} color="#EC4899" />
                  : <Focus size={13} color="rgba(255,255,255,0.4)" />
                }
                <span className="text-[10px] font-mono font-bold transition-colors" style={{ color: focusMode ? '#EC4899' : 'rgba(255,255,255,0.35)' }}>
                  {focusMode ? 'Exit Focus' : 'Focus Mode'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom separator before metrics */}
        <div className="mx-6 border-t border-white/[0.05]" />
        <div className="px-6 py-3 flex items-center gap-4">
          <span className="text-[9px] font-mono text-white/20 tracking-[0.16em] uppercase">Imprint Overview</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <span className="text-[9px] font-mono text-white/15">Founded {LABEL.founded}</span>
        </div>
      </div>

      {/* ── SUMMARY ROW ── */}
      <LabelSummaryStats hc={hc} />

      {/* ── AUTOPILOT COMMAND LAYER ── */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-white/20 tracking-[0.16em] uppercase">System Mode</span>
          </div>
          <AutopilotModeControl variant="inline" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <AutopilotStatusStrip />
          <LiveSystemFeed variant="strip" title="Label OS Feed" />
        </div>
      </div>

      {/* ── FOCUS MODE EXECUTION PANEL ── */}
      {focusMode && <FocusModePanel navigate={navigate} />}

      {/* ── PORTFOLIO INTELLIGENCE ENGINE ── */}
      {!focusMode && <LabelPortfolioEngine />}

      {/* ── LABEL HEALTH SYSTEM ── */}
      {!focusMode && <LabelHealthSystem />}

      {/* ── LABEL FUNDING SAFE ── */}
      {!focusMode && <LabelFundingSafe />}

      {/* ── LIVE SYSTEM FEED ── */}
      {!focusMode && (
        <div className="mb-5">
          <LiveSystemFeed variant="panel" maxVisible={6} title="Label OS · Live Feed" />
        </div>
      )}

      {/* ── LABEL SIGNAL FEED ── */}
      {!focusMode && (
        <div className="mb-5">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 1.5, height: 28, background: '#F59E0B', borderRadius: 2, boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Label Intelligence Feed</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 3 }}>Roster-level signals · the system is watching everything for you</div>
            </div>
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, padding: '2px 9px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B', letterSpacing: '0.07em' }}>Live · 12 Signals</span>
          </div>
          <SignalFeedModule view="label" />
        </div>
      )}

      {/* ── ROSTER SIGNALS STRIP ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.5),rgba(16,185,129,0.3),transparent)' }} />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.05] flex-wrap">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" style={{ boxShadow: '0 0 5px #F59E0B' }} />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider font-bold">Roster Signals</span>
          </div>
          <div className="w-px h-4 bg-white/[0.07] shrink-0" />
          {[
            { text: 'All American Rejects driving 72% of revenue', color: '#06B6D4', icon: TrendingUp },
            { text: 'Robot Sunrise trending +34% listeners', color: '#06B6D4', icon: Flame },
            { text: 'Jorgen — low campaign activity', color: '#F59E0B', icon: AlertTriangle },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                <Icon className="w-2.5 h-2.5 shrink-0" style={{ color: s.color }} />
                <span className="text-[10px] text-white/55">{s.text}</span>
              </div>
            );
          })}
        </div>

        {/* ── ROSTER TABLE HEADER ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-mono text-white/35 uppercase tracking-wider">Roster Overview</span>
            <span className="text-[8px] font-mono px-2 py-0.5 rounded" style={{ color: LABEL_COLOR, background: `${LABEL_COLOR}12`, border: `1px solid ${LABEL_COLOR}20` }}>
              {ROSTER_ARTISTS.length} Artists
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/20 border border-white/[0.06] rounded-lg p-0.5">
            {(['listeners', 'revenue', 'health'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`text-[9px] font-mono px-2.5 py-1 rounded-md transition-all capitalize ${sortBy === s ? 'bg-white/[0.08] text-white/70' : 'text-white/25 hover:text-white/45'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── COLUMN LABELS ── */}
        <div className="hidden md:flex items-center gap-4 px-5 py-2 border-b border-white/[0.03]">
          <div className="w-5 shrink-0" />
          <div className="w-10 shrink-0" />
          <div className="flex-1 min-w-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Artist</span>
          </div>
          <div className="w-28 text-right shrink-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Listeners</span>
          </div>
          <div className="w-20 text-right shrink-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Rev YTD</span>
          </div>
          <div className="w-16 text-right shrink-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Camps</span>
          </div>
          <div className="w-24 shrink-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Health</span>
          </div>
          <div className="w-28 shrink-0">
            <span className="text-[8px] font-mono text-white/15 uppercase tracking-widest">Priority Signal</span>
          </div>
          <div className="w-56 shrink-0" />
        </div>

        {/* ── ROWS ── */}
        <div className="divide-y divide-white/[0.04]">
          {sorted.map((artist, i) => {
            const ahc = healthColor(artist.healthScore);
            const releaseColor = RELEASE_STATUS_COLOR[artist.releaseStatus] ?? '#6B7280';
            const pm = PRIORITY_META[artist.prioritySignal];
            const PriorityIcon = pm.icon;
            return (
              <div
                key={artist.id}
                onClick={() => navigate('/dashboard/artist-os')}
                className="px-5 py-4 flex items-center gap-4 group cursor-pointer transition-all duration-150"
                style={{ borderLeft: '2px solid transparent' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = `${artist.color}06`;
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = artist.color;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
                }}
              >
                <span className="text-[10px] font-mono text-white/15 w-5 shrink-0">{i + 1}</span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${artist.color}18`, border: `1px solid ${artist.color}30` }}>
                  <span className="text-[10px] font-bold" style={{ color: artist.color }}>{artist.initials}</span>
                </div>

                {/* Name + lane */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[13px] font-semibold text-white/85 truncate group-hover:text-white transition-colors">{artist.name}</p>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: releaseColor, background: `${releaseColor}10`, border: `1px solid ${releaseColor}22` }}>
                      {artist.releaseStatus}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30">{artist.lane}</p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 shrink-0">
                  {/* Listeners */}
                  <div className="text-right w-28">
                    <p className="text-[13px] font-mono font-bold text-[#06B6D4]">{fmt(artist.monthlyListeners)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {artist.listenerTrend === 'up' ? <TrendingUp className="w-2.5 h-2.5 text-[#10B981]" /> : <TrendingDown className="w-2.5 h-2.5 text-[#EF4444]" />}
                      <span className="text-[9px] font-mono text-[#10B981]">{artist.listenerDelta}</span>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="text-right w-20">
                    <p className="text-[13px] font-mono font-bold text-[#10B981]">{fmtMoney(artist.ytdRevenue)}</p>
                  </div>

                  {/* Campaigns */}
                  <div className="text-right w-16">
                    <p className="text-[13px] font-mono font-bold text-[#F59E0B]">{artist.activeCampaigns}</p>
                  </div>

                  {/* Health bar */}
                  <div className="w-24">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[9px] font-mono" style={{ color: ahc }}>{artist.healthScore}</p>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${artist.healthScore}%`, background: ahc }} />
                    </div>
                  </div>

                  {/* Priority Signal */}
                  <div className="w-28">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg w-fit"
                      style={{ background: pm.bg, border: `1px solid ${pm.color}25` }}>
                      <PriorityIcon size={10} color={pm.color} />
                      <span className="text-[9px] font-mono font-bold" style={{ color: pm.color }}>{artist.prioritySignal}</span>
                    </div>
                  </div>
                </div>

                {/* Inline action buttons — visible on hover */}
                <div className="shrink-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 w-56 justify-end"
                  onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => navigate('/dashboard/artist-os')}
                    className="flex items-center gap-1 text-[8px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: artist.color, background: `${artist.color}12`, border: `1px solid ${artist.color}25` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${artist.color}22`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${artist.color}12`; }}
                  >
                    <ExternalLink size={8} color={artist.color} /> Artist OS
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/campaign-engine')}
                    className="flex items-center gap-1 text-[8px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(245,158,11,0.1)'; }}
                  >
                    <Zap size={8} color="#F59E0B" /> Campaigns
                  </button>
                  <button
                    className="flex items-center gap-1 text-[8px] font-mono px-2.5 py-1.5 rounded-lg transition-all"
                    style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.1)'; }}
                  >
                    <Wallet size={8} color="#10B981" /> Budget
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LABEL INTELLIGENCE FEED ── */}
      {!focusMode && (() => {
        const filtered = feedFilter === 'all' ? INTEL_FEED : INTEL_FEED.filter(i => i.category === feedFilter);
        return (
          <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),rgba(6,182,212,0.3),transparent)' }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" style={{ boxShadow: '0 0 5px #10B981' }} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">Label Intelligence Feed</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {filtered.length} events
                </span>
              </div>
              <div className="flex items-center gap-1 bg-black/20 border border-white/[0.06] rounded-lg p-0.5">
                {(['all', 'financial', 'campaigns', 'releases'] as FeedCategory[]).map(f => {
                  const active = feedFilter === f;
                  const meta = f === 'all' ? null : CATEGORY_META[f as Exclude<FeedCategory, 'all'>];
                  return (
                    <button key={f} onClick={() => setFeedFilter(f)}
                      className={`flex items-center gap-1.5 text-[9px] font-mono px-2.5 py-1 rounded-md transition-all capitalize ${active ? 'bg-white/[0.08] text-white/70' : 'text-white/25 hover:text-white/45'}`}
                      style={active && meta ? { color: meta.color } : {}}>
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Two-col: feed + weekly summary */}
            <div className="grid grid-cols-1 xl:grid-cols-3">

              {/* Feed list */}
              <div className="xl:col-span-2 divide-y divide-white/[0.04]">
                {filtered.map(item => {
                  const catMeta = CATEGORY_META[item.category];
                  const CatIcon = catMeta.icon;
                  const impactColor = item.impactDirection === 'up' ? '#10B981' : item.impactDirection === 'down' ? '#EF4444' : '#6B7280';
                  const ImpactIcon = item.impactDirection === 'up' ? ArrowUp : item.impactDirection === 'down' ? ArrowDown : Minus;
                  return (
                    <div key={item.id} className="flex items-start gap-3.5 px-5 py-3.5 group hover:bg-white/[0.015] transition-colors cursor-default">
                      {/* Category icon */}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${catMeta.color}12`, border: `1px solid ${catMeta.color}22` }}>
                        <CatIcon size={12} color={catMeta.color} />
                      </div>

                      {/* Artist dot + content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                              style={{ background: `${item.artistColor}18`, border: `1px solid ${item.artistColor}30` }}>
                              <span className="text-[6px] font-black" style={{ color: item.artistColor }}>{item.artistInitials}</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/35">{item.artist}</span>
                          </div>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                            style={{ color: catMeta.color, background: `${catMeta.color}10`, border: `1px solid ${catMeta.color}20` }}>
                            {item.eventType}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/55 leading-snug">{item.description}</p>
                      </div>

                      {/* Impact + time */}
                      <div className="shrink-0 flex flex-col items-end gap-1.5 ml-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                          style={{ background: `${impactColor}09`, border: `1px solid ${impactColor}20` }}>
                          <ImpactIcon size={8} color={impactColor} />
                          <span className="text-[9px] font-mono font-bold" style={{ color: impactColor }}>{item.impact}</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/15">{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly summary panel */}
              <div className="xl:border-l border-white/[0.05] px-5 py-5 flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart className="w-3.5 h-3.5 text-white/25" />
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">What Changed This Week</span>
                </div>

                <div className="space-y-2.5">
                  {WEEK_INSIGHTS.map((insight, i) => {
                    const IIcon = insight.direction === 'up' ? ArrowUp : insight.direction === 'down' ? ArrowDown : Minus;
                    return (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl"
                        style={{ background: `${insight.color}07`, border: `1px solid ${insight.color}15` }}>
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: `${insight.color}15`, border: `1px solid ${insight.color}25` }}>
                          <IIcon size={9} color={insight.color} />
                        </div>
                        <p className="text-[10px] text-white/55 leading-snug">{insight.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Revenue mini breakdown */}
                <div className="mt-2 pt-4 border-t border-white/[0.05]">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest block mb-3">Revenue Share · YTD</span>
                  <div className="space-y-2.5">
                    {ROSTER_ARTISTS.map(artist => (
                      <div key={artist.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] text-white/40 truncate">{artist.name}</span>
                          <span className="text-[9px] font-mono shrink-0 ml-2" style={{ color: artist.color }}>{fmtMoney(artist.ytdRevenue)}</span>
                        </div>
                        <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                          <div className="h-full rounded-full"
                            style={{ width: `${(artist.ytdRevenue / maxRev) * 100}%`, background: artist.color + 'BB' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-white/[0.05]">
                  <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[9px] font-mono text-white/30 hover:text-white/50 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    View full report <ChevronRight size={11} />
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── LABEL CONTROL LAYER ── */}
      {!focusMode && <div className="rounded-xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.35),rgba(245,158,11,0.25),rgba(16,185,129,0.2),transparent)' }} />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider font-bold">Label Control Layer</span>
            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded ml-1" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {LABEL_ACTIONS.filter(a => a.urgency === 'blocking').length} blocking
            </span>
          </div>
          <span className="text-[8px] font-mono text-white/15 ml-auto">Release Command View</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3">

          {/* Release cards — left 2 cols */}
          <div className="xl:col-span-2 p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {RELEASE_CARDS.map(card => {
              const um = URGENCY_META[card.urgency];
              const sm = STAGE_META[card.stage];
              const StageIcon = sm.icon;
              const readinessBg = card.readiness >= 90 ? '#10B981' : card.readiness >= 65 ? '#F59E0B' : '#EF4444';
              return (
                <div key={card.id} className="rounded-xl flex flex-col gap-3 p-4 relative overflow-hidden"
                  style={{ background: `${um.color}06`, border: `1px solid ${um.color}22` }}>
                  {/* Urgency stripe top */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: um.color, opacity: 0.6 }} />

                  {/* Artist + urgency */}
                  <div className="flex items-start justify-between mt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${card.artistColor}18`, border: `1px solid ${card.artistColor}30` }}>
                        <span className="text-[8px] font-black" style={{ color: card.artistColor }}>{card.artistInitials}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-white/70 leading-tight">{card.artist}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <StageIcon size={8} color={sm.color} />
                          <span className="text-[8px] font-mono" style={{ color: sm.color }}>{card.stage}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded-full shrink-0"
                      style={{ color: um.color, background: `${um.color}15`, border: `1px solid ${um.color}25` }}>
                      {um.label}
                    </span>
                  </div>

                  {/* Release title */}
                  <p className="text-[11px] font-semibold text-white/65 leading-snug">{card.title}</p>

                  {/* Readiness bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[8px] font-mono text-white/25">Readiness</span>
                      <span className="text-[9px] font-mono font-bold" style={{ color: readinessBg }}>{card.readiness}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${card.readiness}%`, background: readinessBg }} />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center gap-1.5">
                    <Clock size={9} color={card.daysUntil <= 7 ? '#F59E0B' : '#6B7280'} />
                    <span className="text-[9px] font-mono" style={{ color: card.daysUntil <= 7 ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>
                      {card.nextDeadline}
                    </span>
                    <span className="text-[8px] font-mono text-white/15 ml-auto">{card.daysUntil}d</span>
                  </div>

                  {/* Blockers */}
                  {card.blockers.length > 0 ? (
                    <div className="space-y-1">
                      {card.blockers.map((b, bi) => (
                        <div key={bi} className="flex items-start gap-1.5">
                          <XCircle size={8} color="#EF4444" className="mt-0.5 shrink-0" />
                          <span className="text-[8px] text-white/35 leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={8} color="#10B981" />
                      <span className="text-[8px] text-[#10B981]/60">No blockers — cleared for release</span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 mt-auto pt-1 flex-wrap">
                    <button
                      onClick={() => navigate('/dashboard/artist-os/releases')}
                      className="flex items-center gap-1 text-[7px] font-mono px-2 py-1 rounded-lg transition-all"
                      style={{ color: card.artistColor, background: `${card.artistColor}10`, border: `1px solid ${card.artistColor}22` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${card.artistColor}20`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${card.artistColor}10`; }}
                    >
                      <ExternalLink size={7} /> Open Release OS
                    </button>
                    {card.urgency !== 'blocking' && (
                      <button
                        className="flex items-center gap-1 text-[7px] font-mono px-2 py-1 rounded-lg transition-all"
                        style={{ color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.18)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.08)'; }}
                      >
                        <CheckCircle size={7} /> Approve
                      </button>
                    )}
                    {card.blockers.length > 0 && (
                      <button
                        className="flex items-center gap-1 text-[7px] font-mono px-2 py-1 rounded-lg transition-all"
                        style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.18)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
                      >
                        <Wrench size={7} /> Fix Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions required panel — right col */}
          <div className="xl:border-l border-white/[0.05] flex flex-col">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/[0.05]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
              <span className="text-[9px] font-mono text-white/35 uppercase tracking-wider">Label Actions Required</span>
            </div>
            <div className="divide-y divide-white/[0.04] flex-1">
              {LABEL_ACTIONS.map(action => {
                const um = URGENCY_META[action.urgency];
                const ActionIcon = action.type === 'approve' ? CheckCircle : action.type === 'submit' ? Send : Wrench;
                const ctaColor = action.type === 'fix' ? '#EF4444' : action.type === 'submit' ? '#06B6D4' : '#10B981';
                const ctaLabel = action.type === 'approve' ? 'Approve' : action.type === 'submit' ? 'Submit' : 'Fix Now';
                return (
                  <div key={action.id} className="flex items-start gap-3 px-5 py-3.5 group hover:bg-white/[0.015] transition-colors">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${um.color}12`, border: `1px solid ${um.color}22` }}>
                      <ActionIcon size={10} color={um.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3.5 h-3.5 rounded flex items-center justify-center shrink-0"
                          style={{ background: `${action.artistColor}15` }}>
                          <span className="text-[5px] font-black" style={{ color: action.artistColor }}>{action.artist.split(' ').map(w => w[0]).join('').slice(0,3)}</span>
                        </div>
                        <span className="text-[8px] font-mono text-white/25">{action.artist}</span>
                        <span className="text-[7px] font-mono px-1 py-0.5 rounded ml-auto shrink-0"
                          style={{ color: um.color, background: `${um.color}12`, border: `1px solid ${um.color}18` }}>
                          {um.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-snug mb-2">{action.text}</p>
                      <button
                        className="flex items-center gap-1 text-[7px] font-mono px-2.5 py-1 rounded-lg transition-all"
                        style={{ color: ctaColor, background: `${ctaColor}0D`, border: `1px solid ${ctaColor}22` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${ctaColor}1C`; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${ctaColor}0D`; }}
                      >
                        <ActionIcon size={7} color={ctaColor} /> {ctaLabel}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 py-4 border-t border-white/[0.05]">
              <button
                onClick={() => navigate('/dashboard/artist-os/releases')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[9px] font-mono text-white/30 hover:text-white/50 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                Open Release OS <ChevronRight size={11} />
              </button>
            </div>
          </div>

        </div>
      </div>}

      {/* ── SPIN OPERATOR TEAM ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)' }} />

        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]" style={{ background: 'rgba(245,158,11,0.02)' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h3 className="text-[14px] font-extrabold text-white tracking-tight m-0">SPIN Operator Team</h3>
              <p className="text-[9px] font-mono text-white/25 mt-0.5 m-0">9 AI operators · Roster-wide intelligence · Decision layer · Always executing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono px-2 py-1 rounded-lg" style={{ color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>4 NEED ACTION</span>
            <span className="text-[8px] font-mono px-2 py-1 rounded-lg" style={{ color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>LIVE</span>
          </div>
        </div>

        <div className="px-5 py-5">
          <OperatorTeamGrid variant="label" labelContext="SPIN Records" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-3 h-3 text-[#10B981]" />
          <span className="text-[9px] font-mono text-white/20">SPIN Records · Brand Imprint · Active · GMG Intelligence Platform</span>
        </div>
        <span className="text-[8px] font-mono text-white/10">label_partner view</span>
      </div>

    </div>
  );
}
