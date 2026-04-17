import { useEffect, useRef, useState } from 'react';
import {
  Crown, Music, TrendingUp, Zap, Settings, Megaphone, Disc, BarChart2, Compass,
  CheckCircle, PlayCircle, Eye, ListTodo, AlertTriangle, Activity,
  Clock, ArrowUpRight, MessageSquare, ChevronRight, RefreshCw,
} from 'lucide-react';
import { injectLiveCSS } from '../../utils/liveSystem';

export type OperatorStatus =
  | 'Active'
  | 'Monitoring'
  | 'Running Campaign'
  | 'Needs Approval'
  | 'Escalated'
  | 'Blocked'
  | 'Release Active'
  | 'Standby';

export type ActionType = 'approve' | 'execute' | 'queue' | 'review' | 'activate' | 'escalate';

export interface OperatorAction {
  label: string;
  type: ActionType;
  primary?: boolean;
}

export interface AIOperatorDef {
  id: string;
  name: string;
  domain: string;
  roleTag: string;
  tierShort: string;
  color: string;
  Icon: React.ElementType;
  status: OperatorStatus;
  currentResponsibility: string;
  latestSignal: string;
  nextAction: string;
  primaryAction: OperatorAction;
}

export const OPERATOR_DEFS: AIOperatorDef[] = [
  {
    id: 'apex',
    name: 'Apex',
    domain: 'Artist Strategy',
    roleTag: 'STRATEGY',
    tierShort: 'Lead Operator',
    color: '#F59E0B',
    Icon: Crown,
    status: 'Escalated',
    currentResponsibility: 'Aligning Q2 release path, partnership priorities, and long-range positioning',
    latestSignal: 'Release sequencing conflict flagged — campaign spend vs. editorial timing window',
    nextAction: 'Approve updated release path to unblock Q2 cycle',
    primaryAction: { label: 'Approve Release Path', type: 'approve', primary: true },
  },
  {
    id: 'velar',
    name: 'Velar',
    domain: 'Release Architecture',
    roleTag: 'RELEASE',
    tierShort: 'Release Strategy',
    color: '#06B6D4',
    Icon: Music,
    status: 'Needs Approval',
    currentResponsibility: 'Managing full release architecture for Move Along Deluxe — metadata, editorial, and submission timeline',
    latestSignal: 'Metadata gaps and approval blockers detected — submission cannot proceed without resolution',
    nextAction: 'Resolve submission blockers to keep editorial window intact',
    primaryAction: { label: 'Review Blockers', type: 'review', primary: true },
  },
  {
    id: 'mira',
    name: 'Mira',
    domain: 'Audience Growth',
    roleTag: 'GROWTH',
    tierShort: 'Audience Growth',
    color: '#10B981',
    Icon: TrendingUp,
    status: 'Running Campaign',
    currentResponsibility: 'Scaling audience in LATAM and high-affinity segments — creator conversion and geo expansion',
    latestSignal: 'Brazil creator cluster showing +34% conversion lift — expansion window is open now',
    nextAction: 'Activate LATAM growth expansion before momentum window closes',
    primaryAction: { label: 'Activate Expansion', type: 'activate', primary: true },
  },
  {
    id: 'flux',
    name: 'Flux',
    domain: 'Campaign Ops',
    roleTag: 'OPS',
    tierShort: 'Growth Operator',
    color: '#EC4899',
    Icon: Zap,
    status: 'Needs Approval',
    currentResponsibility: 'Optimizing paid spend, momentum transfer, and campaign sequencing across platforms',
    latestSignal: 'EU campaign underperforming at current allocation — $1,200 reallocation to TikTok projected +28% ROAS',
    nextAction: 'Approve EU budget reallocation to unlock performance recovery',
    primaryAction: { label: 'Approve Reallocation', type: 'approve', primary: true },
  },
  {
    id: 'axiom',
    name: 'Axiom',
    domain: 'Artist Operations',
    roleTag: 'OPERATIONS',
    tierShort: 'Artist Operations',
    color: '#8B5CF6',
    Icon: Settings,
    status: 'Active',
    currentResponsibility: 'Coordinating cross-functional execution and clearing operational dependencies across the release cycle',
    latestSignal: '3 unresolved release dependencies detected — team coordination tasks overdue',
    nextAction: 'Open operations queue and clear release blockers',
    primaryAction: { label: 'Open Queue', type: 'queue', primary: true },
  },
  {
    id: 'forge',
    name: 'Forge',
    domain: 'Marketing Systems',
    roleTag: 'MARKETING',
    tierShort: 'Marketing Systems',
    color: '#EF4444',
    Icon: Megaphone,
    status: 'Running Campaign',
    currentResponsibility: 'Managing full marketing execution — paid media, channel sequencing, and release visibility',
    latestSignal: 'Paid media sequence queued and ready — launch window is release week, 6 days out',
    nextAction: 'Launch campaign workflow to begin paid media execution',
    primaryAction: { label: 'Launch Workflow', type: 'execute', primary: true },
  },
  {
    id: 'sol',
    name: 'Sol',
    domain: 'Catalog & Content',
    roleTag: 'CONTENT',
    tierShort: 'Catalog & Content',
    color: '#22D3EE',
    Icon: Disc,
    status: 'Active',
    currentResponsibility: 'Routing content and catalog alignment — post-release scheduling, asset mapping, and sequencing',
    latestSignal: 'Post-release content sequence scheduled — asset map updated with 4 new placements',
    nextAction: 'Approve content plan to allow asset routing to proceed',
    primaryAction: { label: 'Approve Content Plan', type: 'approve', primary: true },
  },
  {
    id: 'lyric',
    name: 'Lyric',
    domain: 'Performance Monitor',
    roleTag: 'PERFORMANCE',
    tierShort: 'Performance',
    color: '#84CC16',
    Icon: BarChart2,
    status: 'Monitoring',
    currentResponsibility: 'Tracking live performance, content rhythm, and audience response across all platforms',
    latestSignal: 'Engagement cadence dropped 18% this week — publishing rhythm weakening vs. release target',
    nextAction: 'Adjust publishing cadence to restore engagement velocity',
    primaryAction: { label: 'Adjust Cadence', type: 'execute', primary: true },
  },
  {
    id: 'rune',
    name: 'Rune',
    domain: 'Career Direction',
    roleTag: 'DIRECTION',
    tierShort: 'Career Direction',
    color: '#F97316',
    Icon: Compass,
    status: 'Monitoring',
    currentResponsibility: 'Tracking long-range positioning and strategic sequencing across catalog cycles',
    latestSignal: 'Timing conflict flagged — short-term campaign push misaligned with longer catalog window',
    nextAction: 'Review strategic sequencing to resolve timing conflict',
    primaryAction: { label: 'Review Sequence', type: 'review', primary: true },
  },
];

const STATUS_CFG: Record<OperatorStatus, { color: string; label: string; pulse: boolean }> = {
  'Active':            { color: '#10B981', label: 'Active',            pulse: true  },
  'Monitoring':        { color: '#06B6D4', label: 'Monitoring',        pulse: false },
  'Running Campaign':  { color: '#F59E0B', label: 'Running Campaign',  pulse: true  },
  'Needs Approval':    { color: '#EF4444', label: 'Needs Approval',    pulse: true  },
  'Escalated':         { color: '#EF4444', label: 'Escalated',         pulse: true  },
  'Blocked':           { color: '#6B7280', label: 'Blocked',           pulse: false },
  'Release Active':    { color: '#EC4899', label: 'Release Active',    pulse: true  },
  'Standby':           { color: 'rgba(255,255,255,0.25)', label: 'Standby', pulse: false },
};

const ACTION_CFG: Record<ActionType, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
  approve:  { color: '#10B981', bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)',  Icon: CheckCircle  },
  execute:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)',  Icon: PlayCircle   },
  queue:    { color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.10)', Icon: ListTodo },
  review:   { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.20)',   Icon: Eye          },
  activate: { color: '#EC4899', bg: 'rgba(236,72,153,0.10)',  border: 'rgba(236,72,153,0.22)',  Icon: Zap          },
  escalate: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.20)',   Icon: AlertTriangle },
};

function LiveDot({ color, pulse }: { color: string; pulse: boolean }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8, flexShrink: 0 }}>
      {pulse && <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4, animation: 'otg-ping 1.6s cubic-bezier(0,0,0.2,1) infinite' }} />}
      <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}`, display: 'inline-block' }} />
    </span>
  );
}

interface OperatorCardProps {
  op: AIOperatorDef;
  variant?: 'artist' | 'label';
  onAction?: (op: AIOperatorDef) => void;
}

const OPERATOR_META: Record<string, { confidence: number; impact: number; lastUpdated: string }> = {
  apex:  { confidence: 91, impact: 88, lastUpdated: '3m ago' },
  velar: { confidence: 84, impact: 79, lastUpdated: '8m ago' },
  mira:  { confidence: 87, impact: 93, lastUpdated: '2m ago' },
  flux:  { confidence: 78, impact: 85, lastUpdated: '11m ago' },
  axiom: { confidence: 82, impact: 71, lastUpdated: '5m ago' },
  forge: { confidence: 90, impact: 83, lastUpdated: '6m ago' },
  sol:   { confidence: 76, impact: 68, lastUpdated: '14m ago' },
  lyric: { confidence: 88, impact: 72, lastUpdated: '4m ago' },
  rune:  { confidence: 73, impact: 66, lastUpdated: '22m ago' },
};

function MiniBar({ pct, color, label, delay }: { pct: number; color: string; label: string; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    ref.current = setTimeout(() => setWidth(pct), 200 + delay);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [pct, delay]);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${color}90` }}>{pct}%</span>
      </div>
      <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${width}%`, borderRadius: 2,
          background: `linear-gradient(90deg, ${color}60, ${color})`,
          boxShadow: `0 0 4px ${color}40`,
          transition: 'width 0.9s cubic-bezier(0.25,1,0.5,1)',
        }} />
      </div>
    </div>
  );
}

function OperatorCard({ op, variant = 'artist', onAction }: OperatorCardProps) {
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [signalled, setSignalled] = useState(false);
  const sc = STATUS_CFG[op.status];
  const ac = ACTION_CFG[op.primaryAction.type];
  const ActionIcon = ac.Icon;
  const Icon = op.Icon;
  const meta = OPERATOR_META[op.id] ?? { confidence: 80, impact: 75, lastUpdated: '—' };

  const needsUrgentAction = op.status === 'Needs Approval' || op.status === 'Escalated' || op.status === 'Blocked';

  useEffect(() => {
    const live = op.status === 'Active' || op.status === 'Running Campaign' || op.status === 'Escalated' || op.status === 'Needs Approval';
    if (!live) return;
    const offset = Math.random() * 18000;
    const t0 = setTimeout(() => {
      setSignalled(true);
      setTimeout(() => setSignalled(false), 1500);
    }, offset);
    const interval = setInterval(() => {
      setSignalled(true);
      setTimeout(() => setSignalled(false), 1500);
    }, 18000 + offset);
    return () => { clearTimeout(t0); clearInterval(interval); };
  }, [op.id, op.status]);

  function handlePrimary() {
    if (onAction) { onAction(op); return; }
    setDone(true);
    setTimeout(() => setDone(false), 2400);
  }

  const isLive = op.status !== 'Monitoring' && op.status !== 'Standby' && op.status !== 'Blocked';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? (needsUrgentAction ? 'rgba(239,68,68,0.04)' : `${op.color}07`)
          : (needsUrgentAction ? 'rgba(239,68,68,0.025)' : '#0D0E11'),
        border: `1px solid ${signalled ? op.color + '40' : hovered ? (needsUrgentAction ? 'rgba(239,68,68,0.25)' : op.color + '30') : (needsUrgentAction ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.07)')}`,
        borderTop: `2px solid ${needsUrgentAction ? '#EF4444' : hovered ? op.color : op.color + '50'}`,
        borderRadius: 14, overflow: 'hidden', position: 'relative',
        boxShadow: signalled
          ? `0 0 18px ${op.color}14, inset 0 0 10px ${op.color}04`
          : hovered ? `0 0 22px ${needsUrgentAction ? 'rgba(239,68,68,0.10)' : op.color + '0E'}` : 'none',
        transition: 'all 0.22s ease',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Top gradient shimmer */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40, background: `linear-gradient(180deg, ${op.color}08 0%, transparent 100%)`, pointerEvents: 'none' }} />

      <div style={{ padding: '12px 14px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── Identity row ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9, flexShrink: 0,
              background: `${op.color}12`, border: `1px solid ${op.color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: hovered ? `0 0 10px ${op.color}20` : 'none',
              transition: 'box-shadow 0.2s',
            }}>
              <Icon size={13} color={op.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{op.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: op.color, background: `${op.color}12`, border: `1px solid ${op.color}20`, fontWeight: 800, letterSpacing: '0.05em' }}>{op.roleTag}</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>{op.domain}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 20, background: `${sc.color}10`, border: `1px solid ${sc.color}22` }}>
              <LiveDot color={sc.color} pulse={sc.pulse} />
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: sc.color, fontWeight: 700, animation: needsUrgentAction ? 'ls-status-flicker 5s ease-in-out infinite' : 'none' }}>{sc.label}</span>
            </div>
          </div>
        </div>

        {/* ── Current Assignment (single compact line) ── */}
        <p style={{ margin: 0, fontSize: 10.5, color: 'rgba(255,255,255,0.52)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {op.currentResponsibility}
        </p>

        {/* ── Latest Signal ── */}
        <div style={{
          padding: '6px 9px',
          background: needsUrgentAction ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.015)',
          border: `1px solid ${needsUrgentAction ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)'}`,
          borderRadius: 7,
          display: 'flex', alignItems: 'flex-start', gap: 6,
        }}>
          <Activity size={8} color={needsUrgentAction ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.2)'} style={{ marginTop: 2, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 10, color: needsUrgentAction ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.38)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{op.latestSignal}</p>
        </div>

        {/* ── Confidence / Impact mini bars (shown on hover) ── */}
        {hovered && (
          <div style={{ display: 'flex', gap: 10 }}>
            <MiniBar pct={meta.confidence} color={op.color} label="Confidence" delay={0} />
            <MiniBar pct={meta.impact} color={op.color} label="Impact" delay={120} />
          </div>
        )}

        {/* ── Next Action callout ── */}
        <div style={{ padding: '6px 9px', background: `${op.color}07`, border: `1px solid ${op.color}18`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: op.color, flexShrink: 0, boxShadow: `0 0 5px ${op.color}` }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: op.color, lineHeight: 1.4, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{op.nextAction}</span>
        </div>
      </div>

      {/* ── Action footer ── */}
      <div style={{ padding: '10px 15px', borderTop: `1px solid ${op.color}12`, background: `${op.color}04`, display: 'flex', alignItems: 'center', gap: 7 }}>
        <button
          onClick={handlePrimary}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '7px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 9.5,
            background: done ? 'rgba(16,185,129,0.12)' : ac.bg,
            border: `1px solid ${done ? 'rgba(16,185,129,0.28)' : ac.border}`,
            color: done ? '#10B981' : ac.color,
            transition: 'all 0.15s',
            letterSpacing: '0.02em',
          }}
        >
          {done ? <CheckCircle size={10} /> : <ActionIcon size={10} />}
          {done ? 'Done' : op.primaryAction.label}
        </button>

        {variant === 'label' && (
          <button
            style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <ArrowUpRight size={9} color="rgba(255,255,255,0.3)" />
            Intel
          </button>
        )}

        <button
          style={{ padding: '7px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 9, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 5 }}
        >
          <MessageSquare size={9} color="rgba(255,255,255,0.22)" />
          Ask
        </button>
      </div>
    </div>
  );
}

interface ActivityFeedItem {
  opId: string;
  text: string;
  type: 'alert' | 'action' | 'signal' | 'campaign';
  ts: string;
}

const ACTIVITY_FEED: ActivityFeedItem[] = [
  { opId: 'mira',  text: 'LATAM expansion window open — awaiting activation',                      type: 'alert',    ts: '2m ago'  },
  { opId: 'velar', text: 'Submission blockers detected — editorial window at risk',                type: 'alert',    ts: '9m ago'  },
  { opId: 'flux',  text: 'EU budget reallocation staged — projected +28% ROAS on approval',        type: 'alert',    ts: '24m ago' },
  { opId: 'apex',  text: 'Q2 release sequencing conflict escalated for review',                    type: 'alert',    ts: '38m ago' },
  { opId: 'forge', text: 'Paid media sequence queued — release week launch ready',                 type: 'campaign', ts: '1h ago'  },
  { opId: 'sol',   text: 'Post-release content sequence scheduled, asset map updated',             type: 'action',   ts: '2h ago'  },
  { opId: 'lyric', text: 'Content rhythm dropped 18% — publishing cadence weakening',              type: 'signal',   ts: '3h ago'  },
  { opId: 'rune',  text: 'Timing conflict flagged: campaign push vs. catalog window',              type: 'signal',   ts: '4h ago'  },
];

const TYPE_DOT: Record<ActivityFeedItem['type'], string> = {
  alert: '#EF4444', campaign: '#F59E0B', action: '#10B981', signal: '#06B6D4',
};

function ActivityStrip({ compact }: { compact?: boolean }) {
  const [visible, setVisible] = useState(true);
  const itemsToShow = compact ? ACTIVITY_FEED.slice(0, 5) : ACTIVITY_FEED;
  const alertCount = ACTIVITY_FEED.filter(i => i.type === 'alert').length;
  return (
    <div style={{ background: '#0A0B0E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 13, overflow: 'hidden', marginBottom: 14 }}>
      <div
        onClick={() => setVisible(v => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 15px', cursor: 'pointer', borderBottom: visible ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
      >
        <Activity size={11} color="#10B981" />
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', flex: 1 }}>Operator Activity</span>
        {alertCount > 0 && (
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '2px 8px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444', marginRight: 4 }}>{alertCount} need action</span>
        )}
        <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '2px 8px', borderRadius: 8, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#10B981' }}>LIVE</span>
        <ChevronRight size={11} color="rgba(255,255,255,0.18)" style={{ transform: visible ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', marginLeft: 4 }} />
      </div>
      {visible && (
        <div>
          {itemsToShow.map((item, i) => {
            const op = OPERATOR_DEFS.find(o => o.id === item.opId);
            return (
              <div
                key={i}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 15px', borderBottom: i < itemsToShow.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', background: item.type === 'alert' ? 'rgba(239,68,68,0.018)' : 'transparent' }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_DOT[item.type], boxShadow: `0 0 5px ${TYPE_DOT[item.type]}60`, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 11, color: item.type === 'alert' ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>{item.text}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    {op && <span style={{ fontFamily: 'monospace', fontSize: 8, color: op.color }}>{op.name}</span>}
                    <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: 8 }}>·</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{item.ts}</span>
                  </div>
                </div>
                {item.type === 'alert' && (
                  <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 6px', borderRadius: 5, background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', color: '#EF4444', flexShrink: 0 }}>ACTION</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface OperatorTeamGridProps {
  variant?: 'artist' | 'label';
  onOperatorAction?: (op: AIOperatorDef) => void;
  compact?: boolean;
  labelContext?: string;
}

export default function OperatorTeamGrid({ variant = 'artist', onOperatorAction, compact, labelContext }: OperatorTeamGridProps) {
  useEffect(() => { injectLiveCSS(); }, []);

  const urgentOps = OPERATOR_DEFS.filter(o => o.status === 'Escalated' || o.status === 'Needs Approval' || o.status === 'Blocked');
  const activeOps = OPERATOR_DEFS.filter(o => o.status === 'Active' || o.status === 'Running Campaign' || o.status === 'Release Active');
  const monitorOps = OPERATOR_DEFS.filter(o => o.status === 'Monitoring' || o.status === 'Standby');

  const activeCount = OPERATOR_DEFS.filter(o => o.status !== 'Standby' && o.status !== 'Blocked').length;

  return (
    <div>
      <style>{`
        @keyframes otg-ping { 75%,100%{transform:scale(2.2);opacity:0} }
      `}</style>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Operators Active', value: `${activeCount}`, color: '#10B981' },
          { label: 'Running Campaigns', value: `${OPERATOR_DEFS.filter(o => o.status === 'Running Campaign').length}`, color: '#F59E0B' },
          { label: 'Need Approval',    value: `${urgentOps.length}`,  color: '#EF4444' },
          { label: 'Monitoring',       value: `${monitorOps.length}`, color: '#06B6D4' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '10px 13px', background: `${s.color}07`, border: `1px solid ${s.color}18`, borderRadius: 11 }}>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7, color: `${s.color}70`, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <ActivityStrip compact={compact} />

      {/* Urgent / Needs Action */}
      {urgentOps.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <AlertTriangle size={11} color="#EF4444" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Needs Your Action</span>
            <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#EF4444' }}>{urgentOps.length}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {urgentOps.map(op => (
              <OperatorCard key={op.id} op={op} variant={variant} onAction={onOperatorAction} />
            ))}
          </div>
        </div>
      )}

      {/* Active operators */}
      {activeOps.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Activity size={11} color="#10B981" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Operators</span>
            <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 6, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: '#10B981' }}>{activeOps.length}</span>
            {labelContext && <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', color: '#F59E0B', marginLeft: 'auto' }}>{labelContext}</span>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {activeOps.map(op => (
              <OperatorCard key={op.id} op={op} variant={variant} onAction={onOperatorAction} />
            ))}
          </div>
        </div>
      )}

      {/* Monitoring */}
      {monitorOps.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <Eye size={11} color="#06B6D4" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Monitoring</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 10 }}>
            {monitorOps.map(op => (
              <OperatorCard key={op.id} op={op} variant={variant} onAction={onOperatorAction} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
