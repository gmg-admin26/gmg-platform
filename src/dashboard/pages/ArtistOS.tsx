import { useEffect, useRef, useState } from 'react';
import {
  Star, TrendingUp, Users, Headphones, Heart, Music2,
  DollarSign, TrendingDown, Zap, ArrowUpRight, RefreshCcw, Target,
  Activity, AlertCircle, AlertTriangle, CheckCircle, Clock, Layers, Radio, BarChart2,
  FileText, Mic2, Globe, Info, ChevronRight, Cpu, Play, RefreshCw,
} from 'lucide-react';
import { type SignedArtist, type ArtistRelease } from '../data/artistRosterData';
import { useActiveArtist } from '../hooks/useActiveArtist';
import AIRecommendations from '../components/artistOS/AIRecommendations';
import CampaignWallet from '../components/artistOS/CampaignWallet';
import MarketingCenterpiece from '../components/artistOS/MarketingCenterpiece';
import RequestModal from '../components/artistOS/RequestModal';
import MomentumScore from '../components/artistOS/MomentumScore';
import MilestoneTracker from '../components/artistOS/MilestoneTracker';
import NextMilestoneModule from '../components/artistOS/NextMilestoneModule';
import ArtistConsequenceEngine from '../components/artistOS/ArtistConsequenceEngine';
import TodaysPriorityActions from '../components/artistOS/TodaysPriorityActions';
import AutopilotModeControl from '../components/autopilot/AutopilotModeControl';
import AutopilotStatusStrip from '../components/autopilot/AutopilotStatusStrip';
import AIWeeklySummary from '../components/artistOS/AIWeeklySummary';
import LiveSystemFeed from '../components/LiveSystemFeed';
import SignalFeedModule from '../components/SignalFeedModule';
import { useAuth } from '../../auth/AuthContext';
import { useRole } from '../../auth/RoleContext';
import { injectLiveCSS } from '../utils/liveSystem';

type TimeWindow = 'allTime' | 'ytd' | 'last30';

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}
function getW<T extends { allTime: number; ytd: number; last30: number }>(obj: T, w: TimeWindow): number {
  return w === 'allTime' ? obj.allTime : w === 'ytd' ? obj.ytd : obj.last30;
}

function AnimatedNumber({ value, prefix = '', suffix = '', color }: { value: number; prefix?: string; suffix?: string; color?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = to;
    if (from === to) { setDisplay(to); return; }
    let start: number | null = null;
    const dur = 700;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [value]);
  const formatted = display >= 1000000 ? `${(display / 1000000).toFixed(1)}M` : display >= 1000 ? `${(display / 1000).toFixed(1)}K` : display.toString();
  return <span style={{ color: color || 'inherit' }}>{prefix}{formatted}{suffix}</span>;
}

function HealthRing({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}50)`, transition: 'stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color, lineHeight: 1, textShadow: `0 0 12px ${color}40` }}>{score}</span>
      </div>
    </div>
  );
}

type ModuleType = 'engine' | 'analytics' | 'monitor' | 'execution' | 'signal';
const MODULE_TYPE_META: Record<ModuleType, { label: string; color: string; bg: string; border: string }> = {
  engine:    { label: 'ENGINE',    color: '#10B981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.2)'  },
  analytics: { label: 'ANALYTICS', color: '#06B6D4', bg: 'rgba(6,182,212,0.07)',   border: 'rgba(6,182,212,0.18)'  },
  monitor:   { label: 'MONITOR',   color: '#F59E0B', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.2)'  },
  execution: { label: 'EXECUTION', color: '#EC4899', bg: 'rgba(236,72,153,0.07)',  border: 'rgba(236,72,153,0.2)'  },
  signal:    { label: 'SIGNAL',    color: '#EF4444', bg: 'rgba(239,68,68,0.07)',   border: 'rgba(239,68,68,0.2)'   },
};

function SectionHead({ index, label, children, moduleType, live }: { index: string; label: string; children?: React.ReactNode; moduleType?: ModuleType; live?: boolean }) {
  const mt = moduleType ? MODULE_TYPE_META[moduleType] : null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.2em', flexShrink: 0 }}>{index}</span>
      <div style={{ width: 10, height: 1, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{label}</span>
      {mt && (
        <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 7px', borderRadius: 10, background: mt.bg, border: `1px solid ${mt.border}`, color: mt.color, letterSpacing: '0.1em', flexShrink: 0 }}>
          {mt.label}
        </span>
      )}
      {live && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981', animation: 'aos-pulse-dot 2.2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: '#10B981', letterSpacing: '0.08em' }}>LIVE</span>
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,0.05),transparent)' }} />
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, valueColor, sub, subIcon: SubIcon, subColor, accent, glow }: {
  icon: React.ElementType; label: string; value: string | React.ReactNode;
  valueColor?: string; sub?: string; subIcon?: React.ElementType; subColor?: string;
  accent?: string; glow?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const c = accent || '#06B6D4';
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.032)' : '#0D0E11',
        border: `1px solid ${hovered ? `${c}30` : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14, padding: '20px 20px 18px',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.3),0 0 0 1px ${c}18` : 'none',
        cursor: 'default',
      }}
    >
      {glow && (
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 110% 0%,${c}10 0%,transparent 65%)`, pointerEvents: 'none', transition: 'opacity 0.25s', opacity: hovered ? 1 : 0.7 }} />
      )}
      {hovered && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${c}50,transparent)`, pointerEvents: 'none' }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${c}16`, border: `1px solid ${c}28`, transition: 'all 0.25s', boxShadow: hovered ? `0 0 14px ${c}25` : 'none' }}>
          <Icon size={13} color={c} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.025em', position: 'relative', color: valueColor || '#F9FAFB' }}>{value}</div>
      {sub && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
          {SubIcon && <SubIcon size={10} color={subColor || 'rgba(255,255,255,0.3)'} />}
          <span style={{ fontSize: 10, color: subColor || 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{sub}</span>
        </div>
      )}
    </div>
  );
}

const RELEASE_STATUS_META: Record<string, { color: string; bg: string }> = {
  'Released':          { color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
  'Pre-Save Live':     { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'   },
  'In Production':     { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  'Scheduled':         { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)'  },
  'Blocked':           { color: '#EF4444', bg: 'rgba(239,68,68,0.1)'   },
  'No Active Release': { color: '#4B5563', bg: 'rgba(75,85,99,0.1)'    },
};

const CAMPAIGN_STAGE_META: Record<ArtistRelease['campaignStage'], { color: string }> = {
  'Launch Week': { color: '#06B6D4' },
  'Active Push': { color: '#10B981' },
  'Pre-Release': { color: '#F59E0B' },
  'Sustain':     { color: '#8B5CF6' },
  'Wind Down':   { color: '#6B7280' },
  'Standby':     { color: '#4B5563' },
};

const ACTION_PRIORITY_META = {
  urgent: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Urgent' },
  high:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'High' },
  normal: { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)', label: 'Normal' },
};

const TIER_COLORS: Record<string, string> = {
  Priority: '#EF4444',
  Rising: '#06B6D4',
  Developing: '#F59E0B',
  'New Signing': '#8B5CF6',
};

const SPEND_CATEGORIES = (fin: SignedArtist['financials'], w: TimeWindow) => [
  { label: 'Ad Spend',            value: getW(fin.adSpend, w),           recoupable: true,  icon: Radio   },
  { label: 'Marketing',           value: getW(fin.marketingSpend, w),    recoupable: true,  icon: BarChart2},
  { label: 'Content Production',  value: getW(fin.contentProduction, w), recoupable: true,  icon: Mic2    },
  { label: 'Live Shows',          value: getW(fin.liveShows, w),         recoupable: false, icon: Music2  },
  { label: 'Touring',             value: getW(fin.touring, w),           recoupable: false, icon: Globe   },
  { label: 'A&R',                 value: getW(fin.arSpend, w),           recoupable: false, icon: Layers  },
  { label: 'Operations / Team',   value: getW(fin.operationsPeople, w),  recoupable: false, icon: Users   },
  { label: 'Other (Recoupable)',   value: getW(fin.otherRecoupable, w),   recoupable: true,  icon: Target  },
  { label: 'Other (Support)',      value: getW(fin.otherNonRecoupable, w),recoupable: false, icon: Zap     },
];

function RecoupBar({ pct, isRecouped }: { pct: number; isRecouped: boolean }) {
  const color = isRecouped ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, height: '100%',
        width: `${pct}%`, borderRadius: 3,
        background: `linear-gradient(90deg,${color}aa,${color})`,
        boxShadow: `0 0 8px ${color}50`,
        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
      }} />
      {!isRecouped && (
        <div style={{ position: 'absolute', left: `${pct}%`, top: 0, bottom: 0, width: 1, background: `${color}`, boxShadow: `0 0 4px ${color}` }} />
      )}
    </div>
  );
}

const SYSTEM_PROCESSES = [
  { id: 'audience', label: 'Audience Engine', color: '#10B981', status: 'Running' },
  { id: 'campaign', label: 'Campaign Optimizer', color: '#F59E0B', status: 'Active' },
  { id: 'signal',   label: 'Signal Monitor', color: '#EF4444', status: 'Scanning' },
  { id: 'release',  label: 'Release Pipeline', color: '#06B6D4', status: 'Standby' },
  { id: 'intel',    label: 'Intel Layer', color: '#EC4899', status: 'Processing' },
];

function SystemStatusBar({ artistName, now }: { artistName: string; now: Date }) {
  const [tick, setTick] = useState(0);
  const [activeProcess, setActiveProcess] = useState(0);
  useEffect(() => {
    const t = setInterval(() => { setTick(v => v + 1); setActiveProcess(v => (v + 1) % SYSTEM_PROCESSES.length); }, 3200);
    return () => clearInterval(t);
  }, []);
  const proc = SYSTEM_PROCESSES[activeProcess];
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: '#050507', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10,
      marginBottom: 18, overflow: 'hidden', height: 32,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', borderRight: '1px solid rgba(255,255,255,0.05)', height: '100%', flexShrink: 0 }}>
        <Cpu size={10} color="#10B981" />
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', letterSpacing: '0.12em' }}>ARTIST OS · RUNNING</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '0 12px' }}>
        <div key={tick} style={{ display: 'flex', alignItems: 'center', gap: 6, animation: 'ls-fade-up 0.3s ease both' }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: proc.color, display: 'inline-block', boxShadow: `0 0 5px ${proc.color}` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{proc.label}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: proc.color, opacity: 0.8 }}>{proc.status}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.12)', marginLeft: 4 }}>for {artistName}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderLeft: '1px solid rgba(255,255,255,0.04)', height: '100%', flexShrink: 0 }}>
        {SYSTEM_PROCESSES.map((p, i) => (
          <span key={p.id} style={{ width: 4, height: 4, borderRadius: '50%', background: i === activeProcess ? p.color : 'rgba(255,255,255,0.08)', display: 'inline-block', boxShadow: i === activeProcess ? `0 0 5px ${p.color}` : 'none', transition: 'all 0.35s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', borderLeft: '1px solid rgba(255,255,255,0.04)', height: '100%', flexShrink: 0 }}>
        <RefreshCw size={8} color="rgba(255,255,255,0.15)" />
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em' }}>{timeStr}</span>
      </div>
    </div>
  );
}

export default function ArtistOS() {
  const [now, setNow]             = useState(new Date());
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('ytd');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [mounted, setMounted]     = useState(false);

  const { auth } = useAuth();
  const { roleState } = useRole();

  const artist = useActiveArtist();

  useEffect(() => {
    injectLiveCSS();
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (!artist) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist context active.</p>
      </div>
    );
  }

  const fin       = artist.financials;
  const tierColor = TIER_COLORS[artist.tier] ?? '#06B6D4';

  const revenue           = timeWindow === 'allTime' ? fin.allTimeRevenue : timeWindow === 'ytd' ? fin.ytdRevenue : fin.last30Revenue;
  const investment        = getW(fin.totalInvestment, timeWindow);
  const recoupableSpend   = getW(fin.totalRecoupableSpend, timeWindow);
  const nonRecoupableSpend = getW(fin.totalNonRecoupableSpend, timeWindow);

  const recoupPct = fin.allTimeRevenue > 0
    ? Math.min(Math.round((fin.allTimeRevenue / (fin.advance + fin.recoupableBalance + fin.allTimeRevenue)) * 100), 100)
    : 0;
  const isRecouped = recoupPct >= 100;

  const ytdSpendRatio     = fin.totalInvestment.ytd > 0 ? fin.ytdRevenue / fin.totalInvestment.ytd : 1;
  const highSpendWarning  = ytdSpendRatio < 0.5 && fin.totalInvestment.ytd > 5000;
  const lowEngagementWarning = artist.fanEngagementScore < 50;
  const deepInDebtWarning = fin.recoupableBalance > fin.ytdRevenue * 2;

  const spendCats = SPEND_CATEGORIES(fin, timeWindow);
  const maxSpend  = Math.max(...spendCats.map(c => c.value), 1);
  const netPosition = revenue - investment;

  const TimeToggle = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 2 }}>
      {(['last30', 'ytd', 'allTime'] as const).map((w, i) => {
        const labels = ['L30', 'YTD', 'ALL TIME'];
        const active = timeWindow === w;
        return (
          <button key={w} onClick={() => setTimeWindow(w)} style={{
            padding: '4px 10px', borderRadius: 6, background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
            border: 'none', cursor: 'pointer', color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.08em',
            transition: 'all 0.2s ease',
          }}>{labels[i]}</button>
        );
      })}
    </div>
  );

  const statusColor = artist.status === 'Priority' ? '#EF4444' : artist.status === 'Active' ? '#10B981' : artist.status === 'Recouping' ? '#F59E0B' : 'rgba(255,255,255,0.3)';

  return (
    <div style={{ padding: '20px 24px', minHeight: '100%', background: '#08090B', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <style>{`
        @keyframes aos-section-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes aos-pulse-dot { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.75)} }
        @keyframes aos-glow-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes aos-bar-in { from{width:0} to{width:var(--bar-w)} }
        @keyframes aos-spin { to{transform:rotate(360deg)} }
        @keyframes aos-border-breathe { 0%,100%{border-color:rgba(255,255,255,0.07)} 50%{border-color:rgba(16,185,129,0.18)} }

        .aos-section { animation: aos-section-in 0.4s ease both; }
        .aos-card-hover { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
        .aos-card-hover:hover { transform: translateY(-2px); background: rgba(255,255,255,0.03) !important; }
        .aos-row-hover:hover { background: rgba(255,255,255,0.025) !important; }
        .aos-time-btn:hover:not(.active) { color: rgba(255,255,255,0.55) !important; }
        .aos-engine-module { animation: aos-border-breathe 6s ease-in-out infinite; }
      `}</style>

      {/* ══ SYSTEM STATUS BAR ══ */}
      <SystemStatusBar artistName={artist.name} now={now} />

      {/* ══ 0. ARTIST IDENTITY HEADER ══ */}
      <div className="aos-section" style={{ animationDelay: '0ms' }}>
        <div style={{
          background: 'rgba(13,14,17,0.95)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle top line accent */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${artist.avatarColor}35,transparent)` }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${artist.avatarColor}18`, border: `2px solid ${artist.avatarColor}35`,
                boxShadow: `0 0 24px ${artist.avatarColor}20`,
              }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: artist.avatarColor }}>{artist.avatarInitials}</span>
              </div>
              <div style={{
                position: 'absolute', bottom: -3, right: -3, width: 16, height: 16, borderRadius: '50%',
                background: statusColor, border: '2.5px solid #08090B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 8px ${statusColor}80`,
                animation: 'aos-pulse-dot 2.5s ease-in-out infinite',
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#F0F0F2', letterSpacing: '-0.03em', lineHeight: 1 }}>{artist.name}</h1>
                <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '3px 9px', borderRadius: 20, border: `1px solid ${tierColor}30`, background: `${tierColor}12`, color: tierColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={9} />{artist.tier}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '3px 9px', borderRadius: 20, border: `1px solid ${statusColor}25`, background: `${statusColor}10`, color: statusColor }}>{artist.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{artist.genre}</p>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>•</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{artist.market}</span>
                <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>•</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#06B6D4', letterSpacing: '0.05em' }}>{artist.labelImprint}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 6, flexWrap: 'wrap' }}>
                {[
                  `Signed ${artist.signingDate}`,
                  `Mgr: ${artist.manager}`,
                  `GMG: ${artist.pointPerson}`,
                ].map((item, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    {i > 0 && <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 8px', fontSize: 10 }}>·</span>}
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Momentum Score */}
            <div style={{ flexShrink: 0 }}>
              <MomentumScore artist={artist} />
            </div>
          </div>

          {/* Recoupment progress */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.045)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Recoupment Progress</span>
                <span style={{ fontFamily: 'monospace', fontSize: 10, color: isRecouped ? '#10B981' : '#F59E0B', fontWeight: 700 }}>
                  {recoupPct}% · {isRecouped ? 'Recouped' : fmtMoney(fin.recoupableBalance) + ' balance'}
                </span>
              </div>
              <RecoupBar pct={recoupPct} isRecouped={isRecouped} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>Advance: {fmtMoney(fin.advance)}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>Revenue: {fmtMoney(fin.allTimeRevenue)}</span>
              </div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>Roster Note</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{artist.rosterNotes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══ AUTOPILOT COMMAND LAYER ══ */}
      <div className="aos-section" style={{ animationDelay: '0ms', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'start' }}>
          <AutopilotModeControl variant="full" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AutopilotStatusStrip />
            <AIWeeklySummary />
            <LiveSystemFeed variant="strip" title="Artist OS Feed" />
          </div>
        </div>
      </div>

      {/* ══ 1. TODAY'S PRIORITY ACTIONS ══ */}
      <div className="aos-section" style={{ animationDelay: '0ms' }}>
        <TodaysPriorityActions artist={artist} />
      </div>

      {/* ══ 2. NEXT MILESTONE ══ */}
      <div className="aos-section" style={{ animationDelay: '10ms' }}>
        <NextMilestoneModule artist={artist} />
      </div>

      {/* ══ 2b. MILESTONE DETAIL ══ */}
      <div className="aos-section" style={{ animationDelay: '15ms' }}>
        <MilestoneTracker artist={artist} />
      </div>

      {/* ══ 2c. CONSEQUENCE ENGINE ══ */}
      <section className="aos-section" style={{ animationDelay: '18ms', marginBottom: 24 }}>
        <SectionHead index="CE" label="Consequence Engine" moduleType="signal" >
          <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', letterSpacing: '0.08em' }}>
            INACTION = COST
          </span>
        </SectionHead>
        <ArtistConsequenceEngine artist={artist} />
      </section>

      {/* ══ 3. CAMPAIGN WALLET / ARTIST SAFE ══ */}
      <div className="aos-section" style={{ animationDelay: '20ms' }}>
        <CampaignWallet status={
          artist.healthScore >= 70 && artist.fanEngagementScore >= 60 ? 'ready' :
          artist.healthScore >= 50 ? 'building' : 'hold'
        } />
      </div>

      {/* ══ 3. PERFORMANCE SNAPSHOT ══ */}
      <section className="aos-section" style={{ animationDelay: '40ms', marginBottom: 24 }}>
        <SectionHead index="01" label="Performance Snapshot" moduleType="analytics" live />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
          <StatCard icon={Headphones} label="Total Streams" value={<AnimatedNumber value={artist.totalStreams} />} accent="#3B82F6" glow sub="All platforms · All time" />
          <StatCard icon={Users} label="Followers" value={<AnimatedNumber value={artist.followers} />} accent="#8B5CF6" glow
            sub={`${artist.followerDelta} this month`} subIcon={ArrowUpRight} subColor="#10B981" />
          <StatCard icon={Activity} label="Monthly Listeners" value={<AnimatedNumber value={artist.monthlyListeners} color="#06B6D4" />} valueColor="#06B6D4" accent="#06B6D4" glow
            sub={`${artist.streamingDelta} growth`} subIcon={ArrowUpRight} subColor="#10B981" />
          <StatCard icon={Heart} label="Fan Engagement" value={
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ color: '#EC4899' }}>{artist.fanEngagementScore}</span>
              <span style={{ fontSize: 14, color: 'rgba(236,72,153,0.4)', fontFamily: 'monospace' }}>/100</span>
            </div>
          } accent="#EC4899" glow sub="Composite · This week" />
        </div>
      </section>

      {/* ══ 3. BUSINESS ECONOMICS ══ */}
      <section className="aos-section" style={{ animationDelay: '80ms', marginBottom: 24 }}>
        <SectionHead index="02" label="Business Economics" moduleType="analytics">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {(highSpendWarning || lowEngagementWarning) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <AlertTriangle size={10} color="#F59E0B" />
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#F59E0B' }}>Review before spending</span>
              </div>
            )}
            <TimeToggle />
          </div>
        </SectionHead>

        {/* Guardrail alerts */}
        {(highSpendWarning || lowEngagementWarning || deepInDebtWarning) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {highSpendWarning && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.16)' }}>
                <AlertTriangle size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.8)' }}>High spend relative to revenue — YTD return is {Math.round(ytdSpendRatio * 100)}¢ per $1 invested. Review current campaign performance before adding new spend.</span>
              </div>
            )}
            {lowEngagementWarning && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <AlertTriangle size={13} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: 'rgba(239,68,68,0.75)' }}>Low engagement trend detected. Organic growth signals should improve before scaling paid campaigns.</span>
              </div>
            )}
            {deepInDebtWarning && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.13)' }}>
                <Info size={13} color="#06B6D4" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11, color: 'rgba(6,182,212,0.7)' }}>Recoupable balance is {(fin.recoupableBalance / Math.max(fin.ytdRevenue, 1)).toFixed(1)}x YTD revenue. Additional recoupable spend extends the timeline to profitability.</span>
              </div>
            )}
          </div>
        )}

        {/* Primary economics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 12 }}>
          {/* Revenue */}
          <EconCard label="Revenue" value={revenue} color="#10B981" icon={TrendingUp} note={timeWindow === 'allTime' ? 'All time' : timeWindow === 'ytd' ? 'Year to date' : 'Last 30 days'}
            subStats={[{ l: 'ALL TIME', v: fmtMoney(fin.allTimeRevenue) }, { l: 'YTD', v: fmtMoney(fin.ytdRevenue) }, { l: 'L30', v: fmtMoney(fin.last30Revenue) }]} />
          <EconCard label="Total Investment" value={investment} color="#EF4444" icon={TrendingDown} note="Cash + team support"
            subStats={[{ l: 'ALL TIME', v: fmtMoney(fin.totalInvestment.allTime) }, { l: 'YTD', v: fmtMoney(fin.totalInvestment.ytd) }, { l: 'L30', v: fmtMoney(fin.totalInvestment.last30) }]} />
          <EconCard label="Recoupable Spend" value={recoupableSpend} color="#F59E0B" icon={Target} note="Charged back to earnings"
            barPct={Math.min((recoupableSpend / Math.max(investment, 1)) * 100, 100)} barLabel={`${Math.round((recoupableSpend / Math.max(investment, 1)) * 100)}% of total`} />
          <EconCard label="Non-Recoupable" value={nonRecoupableSpend} color="#10B981" icon={Zap} note="GMG support investment"
            barPct={Math.min((nonRecoupableSpend / Math.max(investment, 1)) * 100, 100)} barLabel={`${Math.round((nonRecoupableSpend / Math.max(investment, 1)) * 100)}% of total`} />
        </div>

        {/* Secondary economics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          <SmallEconCard label="Advance" value={fmtMoney(fin.advance)} color="#06B6D4" icon={DollarSign} note="Original signing advance" />
          <SmallEconCard label="Advance Balance" value={fmtMoney(fin.recoupableBalance)} color="#F59E0B" icon={RefreshCcw} note="Remaining recoupable" barPct={recoupPct} />
          <SmallEconCard label="Artist Grant" value={fmtMoney(fin.artistGrant)} color="#10B981" icon={Zap} note={fin.artistGrantRecoupable ? 'Recoupable' : 'Non-Recoupable'} tagColor={fin.artistGrantRecoupable ? '#F59E0B' : '#10B981'} />
          <SmallEconCard label="Status" value={isRecouped ? 'Profitable' : 'Not Recouped'} color={isRecouped ? '#10B981' : '#F59E0B'} icon={isRecouped ? CheckCircle : AlertCircle} note={isRecouped ? 'Revenue exceeds investment' : `${recoupPct}% recouped`} />
          <SmallEconCard label="Net Position" value={(netPosition >= 0 ? '+' : '') + fmtMoney(netPosition)} color={netPosition >= 0 ? '#10B981' : '#EF4444'} icon={BarChart2} note={`${Math.round(ytdSpendRatio * 100)}¢ return per $1 (YTD)`} />
        </div>
      </section>

      {/* ══ 4. MARKETING & CAMPAIGN CENTER ══ */}
      <section className="aos-section" style={{ animationDelay: '120ms', marginBottom: 24 }}>
        <SectionHead index="03" label="Marketing & Campaign Center" moduleType="engine" live />
        <MarketingCenterpiece artist={artist} onRequestCampaign={() => setRequestModalOpen(true)} />
      </section>

      {/* ══ 5. AI RECOMMENDATIONS / ACTION QUEUE ══ */}
      <section className="aos-section" style={{ animationDelay: '160ms', marginBottom: 24 }}>
        <SectionHead index="04" label="AI Recommendations / Action Queue" moduleType="engine" live />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AIRecommendations />

          {/* Action queue */}
          <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <AlertCircle size={13} color="#EF4444" />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Action Queue</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                {artist.actionQueue.length} items
              </span>
            </div>
            <div>
              {(artist.actionQueue ?? []).map((action, i) => {
                const pm = ACTION_PRIORITY_META[action.priority] ?? ACTION_PRIORITY_META['normal'];
                return (
                  <ActionRow key={action.id} action={action} pm={pm} isLast={i === (artist.actionQueue ?? []).length - 1} />
                );
              })}
              {artist.actionQueue.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 16px' }}>
                  <CheckCircle size={14} color="#10B981" />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No pending actions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE SYSTEM FEED ══ */}
      <section className="aos-section" style={{ animationDelay: '190ms', marginBottom: 24 }}>
        <SectionHead index="05a" label="Live System Feed" moduleType="monitor" live />
        <LiveSystemFeed variant="panel" maxVisible={5} title="Artist OS · Live Feed" />
      </section>

      {/* ══ SIGNAL FEED ══ */}
      <section className="aos-section" style={{ animationDelay: '195ms', marginBottom: 24 }}>
        <SectionHead index="05b" label="Momentum Signal Feed" moduleType="signal" live>
          <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 9px', borderRadius: 20, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4', letterSpacing: '0.07em' }}>Live · 12 Signals</span>
        </SectionHead>
        <SignalFeedModule view="artist" />
      </section>

      {/* ══ 6. RELEASE + TEAM SUPPORT ══ */}
      <section className="aos-section" style={{ animationDelay: '200ms', marginBottom: 24 }}>
        <SectionHead index="05" label="Release & Campaign Operations" moduleType="execution" />
        <div className="aos-engine-module" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={11} color="#06B6D4" />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Release Pipeline</span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#06B6D4', letterSpacing: '0.1em' }}>EXECUTION</span>
            <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'aos-pulse-dot 2s ease-in-out infinite', boxShadow: '0 0 5px #10B981' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{artist.releases.length} active releases</span>
            </span>
          </div>
          <div>
            {(artist.releases ?? []).map((release, i) => {
              const sm = RELEASE_STATUS_META[release.status] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.1)' };
              const cm = CAMPAIGN_STAGE_META[release.campaignStage] ?? { color: '#6B7280' };
              const stageOrder: ArtistRelease['campaignStage'][] = ['Standby','Pre-Release','Launch Week','Active Push','Sustain','Wind Down'];
              const stageIdx = stageOrder.indexOf(release.campaignStage);
              const stagePct = stageIdx >= 0 ? Math.round(((stageIdx + 1) / stageOrder.length) * 100) : 0;
              const isActive = ['Launch Week','Active Push','Pre-Release'].includes(release.campaignStage);
              return (
                <div key={release.id} className="aos-row-hover"
                  style={{ padding: '12px 16px', borderBottom: i < artist.releases.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: 'transparent', transition: 'background 0.15s', cursor: 'default', borderLeft: `2px solid ${sm.color}30` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 6 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>{release.title}</p>
                        <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '1px 7px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.28)' }}>{release.type}</span>
                        {isActive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: sm.color, display: 'inline-block', boxShadow: `0 0 5px ${sm.color}`, animation: 'aos-pulse-dot 2s ease-in-out infinite' }} />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 6, background: sm.bg, color: sm.color, border: `1px solid ${sm.color}25` }}>{release.status}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, color: cm.color, fontWeight: 700 }}>{release.campaignStage}</span>
                        {release.streams && <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{fmt(release.streams)} streams</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {stageOrder.map((s, si) => (
                          <div key={s} style={{ flex: 1, height: 2, borderRadius: 2, background: si <= stageIdx ? cm.color : 'rgba(255,255,255,0.06)', transition: 'background 0.3s', boxShadow: si === stageIdx ? `0 0 5px ${cm.color}` : 'none' }} />
                        ))}
                      </div>
                      {release.coverNote && <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.28)', marginTop: 6, lineHeight: 1.6 }}>{release.coverNote}</p>}
                    </div>
                    <div style={{ flexShrink: 0, textAlign: 'right' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', display: 'block' }}>{release.releaseDate}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 8, color: cm.color, marginTop: 3, display: 'block' }}>{stagePct}% complete</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 7. INVESTMENT TRANSPARENCY ══ */}
      <section className="aos-section" style={{ animationDelay: '240ms', marginBottom: 8 }}>
        <SectionHead index="06" label="Investment Transparency" moduleType="analytics">
          <TimeToggle />
        </SectionHead>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { label: 'Total Invested', value: investment, color: '#EF4444' },
              { label: 'Recoupable', value: recoupableSpend, color: '#F59E0B' },
              { label: 'Non-Recoupable Support', value: nonRecoupableSpend, color: '#10B981' },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '14px 20px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>{item.label}</p>
                <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1, color: item.color, textShadow: `0 0 20px ${item.color}30` }}>{fmtMoney(item.value)}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: '16px 20px' }}>
            {spendCats.filter(cat => cat.value !== 0).map(cat => {
              const barPct = (cat.value / maxSpend) * 100;
              return (
                <SpendRow key={cat.label} cat={cat} barPct={barPct} fmtMoney={fmtMoney} />
              );
            })}
          </div>
          <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {[
                { color: 'rgba(245,158,11,0.55)', label: 'Recoupable — charged back to earnings' },
                { color: 'rgba(16,185,129,0.5)',  label: 'Non-recoupable — GMG support investment' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 8. ARTIST OPERATOR TEAM ══ */}
      <section className="aos-section" style={{ animationDelay: '280ms', marginBottom: 8 }}>
        <SectionHead index="07" label="AI Operator Team" moduleType="engine" live />
        <ArtistOperatorTeam artist={artist} />
      </section>

      {requestModalOpen && (
        <RequestModal artist={artist} submittedByEmail={auth.email || 'manager@gmg.ai'} submittedByRole={roleState.role ?? 'artist_manager'} onClose={() => setRequestModalOpen(false)} />
      )}
    </div>
  );
}

// ─── Artist Operator Team ────────────────────────────────────────────────────

type OperatorMode = 'overview' | 'action' | 'operators';

type ArtistOperatorDef = {
  name: string;
  color: string;
  tier: string;
  status: string;
  scope: string;
  responsibility: (artistName: string) => string;
  latestAction: (artistName: string) => string;
  recommended: (artistName: string) => string;
  actionLabel: string;
};

const ARTIST_OPERATORS: ArtistOperatorDef[] = [
  {
    name: 'Apex', color: '#F59E0B', tier: 'Artist Strategy', status: 'Active',
    scope: 'Long-range artist strategy + release sequencing',
    responsibility: (n) => `Aligning ${n}'s multi-release roadmap and priority positioning`,
    latestAction: (n) => `Mapped ${n}'s optimal release window against market heat`,
    recommended: () => 'Review strategy roadmap',
    actionLabel: 'Review Roadmap',
  },
  {
    name: 'Velar', color: '#06B6D4', tier: 'Release Architecture', status: 'Release Active',
    scope: 'Release planning and editorial timing',
    responsibility: (n) => `Managing release architecture and submission readiness for ${n}`,
    latestAction: () => 'Flagged metadata gaps and sequencing blockers in active pipeline',
    recommended: () => 'Open release queue',
    actionLabel: 'Open Queue',
  },
  {
    name: 'Mira', color: '#10B981', tier: 'Audience Growth', status: 'Running Campaign',
    scope: 'Audience opportunity mapping',
    responsibility: (n) => `Tracking high-conversion fan clusters and growth zones for ${n}`,
    latestAction: () => 'Detected lift in Brazil creator segment / fan conversion rising',
    recommended: () => 'Scale top audience segment',
    actionLabel: 'Scale Now',
  },
  {
    name: 'Flux', color: '#EC4899', tier: 'Campaign Growth', status: 'Running Campaign',
    scope: 'Campaign growth execution',
    responsibility: (n) => `Optimizing paid momentum and budget deployment across ${n}'s active campaigns`,
    latestAction: () => 'Flagged underperforming EU spend — reallocation ready for approval',
    recommended: () => 'Approve growth shift',
    actionLabel: 'Approve',
  },
  {
    name: 'Axiom', color: '#06B6D4', tier: 'Artist Operations', status: 'Active',
    scope: 'Task and workflow coordination',
    responsibility: (n) => `Managing cross-functional blockers and workflow execution for ${n}`,
    latestAction: () => 'Detected 3 unresolved dependencies in active release cycle',
    recommended: () => 'Resolve operations blockers',
    actionLabel: 'Resolve',
  },
  {
    name: 'Forge', color: '#EF4444', tier: 'Marketing Systems', status: 'Running Campaign',
    scope: 'Marketing systems execution',
    responsibility: (n) => `Running launch playbooks and channel sequencing for ${n}'s campaigns`,
    latestAction: () => 'Queued paid media + channel distribution — awaiting launch approval',
    recommended: () => 'Launch playbook',
    actionLabel: 'Launch',
  },
  {
    name: 'Sol', color: '#22D3EE', tier: 'Catalog & Content', status: 'Active',
    scope: 'Content and catalog alignment',
    responsibility: (n) => `Routing ${n}'s content queue and aligning catalog assets to release windows`,
    latestAction: () => 'Scheduled post-release content sequence and updated asset map',
    recommended: () => 'Approve content routing',
    actionLabel: 'Approve',
  },
  {
    name: 'Lyric', color: '#84CC16', tier: 'Performance Monitor', status: 'Monitoring',
    scope: 'Live performance and response monitoring',
    responsibility: (n) => `Watching ${n}'s engagement rhythm, pacing signals, and streaming velocity`,
    latestAction: () => 'Detected drop in content cadence — engagement pacing off target',
    recommended: () => 'Review performance changes',
    actionLabel: 'Review',
  },
  {
    name: 'Rune', color: '#F97316', tier: 'Career Direction', status: 'Monitoring',
    scope: 'Strategic next-move guidance',
    responsibility: (n) => `Tracking ${n}'s long-range positioning and sequencing for next phase`,
    latestAction: () => 'Flagged timing conflict between campaign push and long-term catalog strategy',
    recommended: () => 'Review strategic sequencing',
    actionLabel: 'Review',
  },
];

function ArtistOperatorTeam({ artist }: { artist: SignedArtist }) {
  const [mode, setMode] = useState<OperatorMode>('operators');

  const statusColors: Record<string, string> = {
    'Active': '#10B981', 'Monitoring': '#06B6D4',
    'Running Campaign': '#F59E0B', 'Release Active': '#EC4899',
  };

  const summaryStats = [
    { label: 'Operators Active', value: '9 / 9', color: '#10B981' },
    { label: 'Running Actions', value: '3', color: '#F59E0B' },
    { label: 'Escalations', value: '1', color: '#EF4444' },
    { label: 'Need Approval', value: '2', color: '#06B6D4' },
  ];

  const modes: { key: OperatorMode; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'action', label: 'Action Queue' },
    { key: 'operators', label: 'Operators' },
  ];

  const urgentOps = ARTIST_OPERATORS.filter(op =>
    op.status === 'Running Campaign' || op.status === 'Release Active'
  );

  return (
    <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(245,158,11,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Artist Operator Team</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', margin: 0, marginTop: 2 }}>AI operators running {artist.name}'s growth system · Decision layer</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Mode switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 2, gap: 1 }}>
            {modes.map(m => (
              <button key={m.key} onClick={() => setMode(m.key)}
                style={{ padding: '4px 10px', borderRadius: 6, fontSize: 8, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.06em', cursor: 'pointer', transition: 'all 0.15s', border: 'none', background: mode === m.key ? 'rgba(245,158,11,0.15)' : 'transparent', color: mode === m.key ? '#F59E0B' : 'rgba(255,255,255,0.28)' }}>
                {m.label.toUpperCase()}
              </button>
            ))}
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '3px 8px', borderRadius: 8, color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>LIVE</span>
        </div>
      </div>

      {/* Summary stats strip */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.006)' }}>
        {summaryStats.map((stat, i) => (
          <div key={i} style={{ flex: 1, padding: '10px 16px', borderRight: i < summaryStats.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${stat.color}30,transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: stat.color, display: 'inline-block', animation: 'aos-pulse-dot 2.5s ease-in-out infinite' }} />
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</p>
            </div>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: stat.color, lineHeight: 1, textShadow: `0 0 16px ${stat.color}25` }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Content area */}
      <div style={{ padding: '16px 18px' }}>

        {/* OVERVIEW mode */}
        {mode === 'overview' && (
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Active operator summary for {artist.name}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
              {ARTIST_OPERATORS.map(op => {
                const sc = statusColors[op.status] || '#10B981';
                return (
                  <div key={op.name} style={{ padding: '10px 12px', background: '#09090C', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `2px solid ${op.color}35`, borderRadius: 9 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: `${op.color}12`, border: `1px solid ${op.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: op.color }}>{op.name[0]}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{op.name}</span>
                      </div>
                      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: sc, boxShadow: `0 0 5px ${sc}` }} />
                    </div>
                    <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{op.scope}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ACTION QUEUE mode */}
        {mode === 'action' && (
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Operators with active decisions · {artist.name}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {urgentOps.map(op => {
                const sc = statusColors[op.status] || '#10B981';
                return (
                  <div key={op.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#09090C', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `2px solid ${op.color}40`, borderRadius: 9 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${op.color}12`, border: `1px solid ${op.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: op.color }}>{op.name[0]}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{op.name}</span>
                        <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 5, color: op.color, background: `${op.color}10`, border: `1px solid ${op.color}1E` }}>{op.tier.toUpperCase()}</span>
                        <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: sc, boxShadow: `0 0 4px ${sc}` }} />
                        <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: sc }}>{op.status}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{op.recommended(artist.name)}</p>
                    </div>
                    <button style={{ padding: '5px 12px', borderRadius: 6, fontSize: 8.5, fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer', background: `${op.color}12`, border: `1px solid ${op.color}28`, color: op.color, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                      {op.actionLabel.toUpperCase()}
                    </button>
                  </div>
                );
              })}
              {urgentOps.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '20px 16px' }}>
                  <CheckCircle size={14} color="#10B981" />
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No active decisions pending</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OPERATORS mode — full grid */}
        {mode === 'operators' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 10 }}>
            {ARTIST_OPERATORS.map(op => {
              const sc = statusColors[op.status] || '#10B981';
              const isRunning = ['Running Campaign', 'Release Active'].includes(op.status);
              const isMonitoring = op.status === 'Monitoring';
              return (
                <div key={op.name} style={{
                  background: '#09090C',
                  border: `1px solid ${isRunning ? `${op.color}20` : 'rgba(255,255,255,0.05)'}`,
                  borderLeft: `2px solid ${op.color}${isRunning ? '70' : '40'}`,
                  borderRadius: 11, padding: '13px 14px', position: 'relative', overflow: 'hidden',
                  boxShadow: isRunning ? `0 0 18px ${op.color}06, inset 0 0 20px ${op.color}03` : 'none',
                  transition: 'all 0.3s',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${op.color}${isRunning ? '45' : '20'},transparent)` }} />
                  {isRunning && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 1, background: `linear-gradient(180deg,${op.color}60,transparent)`, pointerEvents: 'none' }} />}

                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: `${op.color}14`, border: `1px solid ${op.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isRunning ? `0 0 10px ${op.color}20` : 'none' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: op.color }}>{op.name[0]}</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: isRunning ? '#fff' : 'rgba(255,255,255,0.85)' }}>{op.name}</span>
                          <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 5, color: op.color, background: `${op.color}10`, border: `1px solid ${op.color}1E` }}>{op.tier.toUpperCase()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{op.scope}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: sc, boxShadow: `0 0 5px ${sc}`, animation: isRunning ? 'aos-pulse-dot 1.4s ease-in-out infinite' : isMonitoring ? 'aos-pulse-dot 3s ease-in-out infinite' : 'none' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: sc, fontWeight: isRunning ? 700 : 400 }}>{op.status}</span>
                    </div>
                  </div>

                  {/* Responsibility */}
                  <div style={{ padding: '6px 9px', background: 'rgba(255,255,255,0.014)', border: '1px solid rgba(255,255,255,0.035)', borderRadius: 7, marginBottom: 6 }}>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Currently Running</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{op.responsibility(artist.name)}</p>
                  </div>

                  {/* Latest action */}
                  <div style={{ padding: '6px 9px', background: `${op.color}05`, border: `1px solid ${op.color}12`, borderRadius: 7, marginBottom: 8 }}>
                    <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7.5, color: `${op.color}70`, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Latest Signal</p>
                    <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{op.latestAction(artist.name)}</p>
                  </div>

                  {/* Recommended action */}
                  <div style={{ padding: '6px 9px', background: `${op.color}${isRunning ? '10' : '07'}`, border: `1px solid ${op.color}${isRunning ? '28' : '15'}`, borderRadius: 7, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 7 }}>
                    <Play size={8} color={op.color} />
                    <p style={{ margin: 0, fontSize: 10, color: op.color, fontWeight: 700, lineHeight: 1.4 }}>{op.recommended(artist.name)}</p>
                  </div>

                  {/* Buttons */}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 8.5, fontWeight: 700, fontFamily: 'monospace', cursor: 'pointer', background: `${op.color}${isRunning ? '18' : '10'}`, border: `1px solid ${op.color}${isRunning ? '35' : '25'}`, color: op.color, letterSpacing: '0.06em', boxShadow: isRunning ? `0 0 10px ${op.color}15` : 'none' }}>
                      {op.actionLabel.toUpperCase()}
                    </button>
                    <button style={{ flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 8.5, fontWeight: 600, fontFamily: 'monospace', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.06em' }}>
                      VIEW INTEL
                    </button>
                    <button style={{ padding: '5px 9px', borderRadius: 6, fontSize: 8.5, fontWeight: 600, fontFamily: 'monospace', cursor: 'pointer', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
                      ASK
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

type ActionRowProps = {
  action: { id: string; label: string; owner: string; priority: string; due?: string };
  pm: { bg: string; color: string; label: string };
  isLast: boolean;
};
function ActionRow({ action, pm, isLast }: ActionRowProps) {
  const [hov, setHov] = useState(false);
  return (
    <div className="aos-row-hover" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderBottom: !isLast ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.15s', background: 'transparent', cursor: 'default' }}>
      <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 8, background: pm.bg, color: pm.color, flexShrink: 0 }}>{pm.label}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>{action.label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{action.owner}</span>
          {action.due && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 9 }}>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                <Clock size={9} />{action.due}
              </span>
            </>
          )}
        </div>
      </div>
      <ChevronRight size={12} color={hov ? 'rgba(255,255,255,0.3)' : 'transparent'} style={{ flexShrink: 0, transition: 'color 0.15s' }} />
    </div>
  );
}

type SpendCat = { label: string; value: number; recoupable: boolean; icon: React.ElementType };
function SpendRow({ cat, barPct, fmtMoney }: { cat: SpendCat; barPct: number; fmtMoney: (n: number) => string }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="aos-row-hover" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.02)', background: 'transparent', transition: 'background 0.15s', cursor: 'default' }}>
      <div style={{ width: 140, display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
        <cat.icon size={11} color="rgba(255,255,255,0.2)" />
        <span style={{ fontSize: 10, color: hov ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.4)', transition: 'color 0.15s', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.label}</span>
      </div>
      <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${barPct}%`,
          background: cat.recoupable ? 'linear-gradient(90deg,rgba(245,158,11,0.4),rgba(245,158,11,0.65))' : 'linear-gradient(90deg,rgba(16,185,129,0.35),rgba(16,185,129,0.55))',
          boxShadow: hov ? `0 0 8px ${cat.recoupable ? 'rgba(245,158,11,0.4)' : 'rgba(16,185,129,0.4)'}` : 'none',
          transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s',
        }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 110, flexShrink: 0, justifyContent: 'flex-end' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{fmtMoney(cat.value)}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: cat.recoupable ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${cat.recoupable ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`, color: cat.recoupable ? '#F59E0B' : '#10B981' }}>
          {cat.recoupable ? 'REC' : 'SUP'}
        </span>
      </div>
    </div>
  );
}

function EconCard({ label, value, color, icon: Icon, note, subStats, barPct, barLabel }: {
  label: string; value: number; color: string; icon: React.ElementType; note: string;
  subStats?: { l: string; v: string }[]; barPct?: number; barLabel?: string;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? 'rgba(255,255,255,0.025)' : '#0D0E11',
      border: `1px solid ${hov ? `${color}25` : `${color}18`}`,
      borderRadius: 14, padding: '18px 18px', position: 'relative', overflow: 'hidden',
      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      transform: hov ? 'translateY(-1px)' : 'none',
      cursor: 'default',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 110% 0%,${color}08 0%,transparent 65%)`, pointerEvents: 'none' }} />
      {hov && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color}45,transparent)` }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, position: 'relative' }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}14`, border: `1px solid ${color}25` }}>
          <Icon size={11} color={color} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <p style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '-0.025em', lineHeight: 1, textShadow: `0 0 24px ${color}25`, position: 'relative' }}>{fmtMoney(value)}</p>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 5, position: 'relative' }}>{note}</p>
      {subStats && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0, position: 'relative' }}>
          {subStats.map((s, i) => (
            <div key={i} style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'center', paddingRight: i < 2 ? 0 : 0 }}>
              <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', marginBottom: 2 }}>{s.l}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{s.v}</p>
            </div>
          ))}
        </div>
      )}
      {barPct !== undefined && (
        <div style={{ marginTop: 10, position: 'relative' }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `${color}55`, borderRadius: 2, width: `${barPct}%`, transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
          {barLabel && <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', marginTop: 4, textAlign: 'right' }}>{barLabel}</p>}
        </div>
      )}
    </div>
  );
}

function SmallEconCard({ label, value, color, icon: Icon, note, tagColor, barPct }: {
  label: string; value: string; color: string; icon: React.ElementType; note: string; tagColor?: string; barPct?: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: hov ? 'rgba(255,255,255,0.025)' : '#0D0E11', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '13px 14px', position: 'relative', overflow: 'hidden',
      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      transform: hov ? 'translateY(-1px)' : 'none',
      cursor: 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}14`, border: `1px solid ${color}25` }}>
          <Icon size={10} color={color} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</span>
      </div>
      <p style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
      {tagColor ? (
        <span style={{ display: 'inline-block', fontFamily: 'monospace', fontSize: 8, padding: '1px 7px', borderRadius: 8, background: `${tagColor}10`, border: `1px solid ${tagColor}20`, color: tagColor, marginTop: 5 }}>{note}</span>
      ) : (
        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{note}</p>
      )}
      {barPct !== undefined && (
        <div style={{ marginTop: 7 }}>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 2, width: `${barPct}%`, background: barPct >= 80 ? '#10B981' : barPct >= 50 ? '#F59E0B' : '#EF4444', transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
        </div>
      )}
    </div>
  );
}
