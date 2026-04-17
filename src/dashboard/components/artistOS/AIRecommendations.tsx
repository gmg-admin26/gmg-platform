import { useState, useEffect, useRef } from 'react';
import {
  Zap, Video, BarChart2, Disc3, Film, CheckCircle2,
  Clock, AlertTriangle, Play, ArrowRight, Bot, Activity,
  Globe, Users, Repeat2, Shield, TrendingUp, TrendingDown, Minus, Radio,
} from 'lucide-react';
import { AI_RECS } from '../../data/artistOSData';
import type { OutcomeData } from './OutcomeSummary';

type Mode = 'assisted' | 'autopilot';

type CompletedAction = {
  id: string;
  text: string;
  time: string;
  color: string;
  icon: React.ElementType;
  outcome?: OutcomeData;
};

type PendingAction = {
  id: number;
  urgency: 'critical' | 'high' | 'medium';
  action: string;
  why: string;
  cta: string;
  category: string;
  icon: string;
  impact: string;
  surfacedFrom?: string;
  status: 'auto-running' | 'awaiting-approval' | 'high-urgency';
};

const ICON_MAP: Record<string, React.ElementType> = {
  video:   Video,
  ads:     BarChart2,
  release: Disc3,
  content: Film,
};

const COMPLETED_ACTIONS: CompletedAction[] = [
  {
    id: 'ca-1', text: 'Creator briefs sent to 12 creators', time: '14m ago', color: '#10B981', icon: Users,
    outcome: {
      predicted: '12 posts · ~900K reach', actual: '14 posts · 1.3M reach', delta: '+44% vs forecast',
      deltaDirection: 'beat', confidence: 78, completedAt: '14m ago', status: 'completed',
      note: 'Two bonus creators self-recruited via the All American Rejects hashtag challenge. Organic amplification exceeded the paid activation model. Model adjusted — creator self-seeding probability weight increased for future campaigns.',
    },
  },
  {
    id: 'ca-2', text: 'Budget reallocated to Brazil segment', time: '1h ago', color: '#F59E0B', icon: Globe,
    outcome: {
      predicted: '+18% streams in BR market', actual: '+31.4% streams', delta: '+13.4% above target',
      deltaDirection: 'beat', confidence: 87, completedAt: '1h ago', status: 'completed',
      note: 'São Paulo + Recife surging. Organic-paid multiplier hit 2.8× — above the 2.1× model. Brazil is now a tier-1 market. Confidence recalibrated after this campaign outperformed the geo-multiplier forecast by 33%.',
    },
  },
  {
    id: 'ca-3', text: 'Ad variant switched — low CTR detected', time: '2h ago', color: '#06B6D4', icon: Repeat2,
    outcome: {
      predicted: 'CTR recovery to 1.8%+', actual: 'CTR 2.4% on new variant', delta: '+0.6% above floor',
      deltaDirection: 'beat', confidence: 80, completedAt: '2h ago', status: 'completed',
      note: 'Chorus-first cut outperformed intro cut by 33%. Model updated — chorus-lead creative is now the default first test variant for this artist profile and genre.',
    },
  },
  {
    id: 'ca-4', text: 'Pre-save link pushed to content calendar', time: '3h ago', color: '#EC4899', icon: Disc3,
    outcome: {
      predicted: '+11.2K pre-saves in 48h', actual: '+8.7K pre-saves', delta: '-22% vs forecast',
      deltaDirection: 'missed', confidence: 91, completedAt: '3h ago', status: 'completed',
      note: 'Casual segment under-converted. Core fans hit 62% conversion — above benchmark. Model recalibrating casual-fan pre-save conversion assumptions for this release tier. Follow-up push queued.',
    },
  },
  {
    id: 'ca-5', text: 'TikTok engagement window detected + queued', time: '4h ago', color: '#10B981', icon: Activity,
    outcome: {
      predicted: '+8–12% engagement lift', actual: '+9.1% engagement', delta: 'Met forecast',
      deltaDirection: 'met', confidence: 82, completedAt: '4h ago', status: 'completed',
      note: 'Window captured before peak decay. Engagement sustaining above baseline and feeding back into algorithmic discovery. Timing model confirmed — no adjustment required.',
    },
  },
];

function deriveStatus(rec: typeof AI_RECS[0]): PendingAction['status'] {
  if (rec.urgency === 'critical') return 'high-urgency';
  if (rec.urgency === 'high') return 'awaiting-approval';
  return 'auto-running';
}

const STATUS_META: Record<PendingAction['status'], { label: string; color: string; dot: string; bg: string }> = {
  'auto-running':      { label: 'Auto-Running',      color: '#10B981', dot: '#10B981', bg: 'rgba(16,185,129,0.08)'  },
  'awaiting-approval': { label: 'Awaiting Approval', color: '#F59E0B', dot: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  'high-urgency':      { label: 'High Urgency',      color: '#EF4444', dot: '#EF4444', bg: 'rgba(239,68,68,0.08)'  },
};

const URGENCY_BORDER: Record<string, string> = {
  critical: 'rgba(239,68,68,0.2)',
  high:     'rgba(245,158,11,0.18)',
  medium:   'rgba(6,182,212,0.15)',
};

const URGENCY_ACCENT: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F59E0B',
  medium:   '#06B6D4',
};

function useTick(interval = 3000) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), interval);
    return () => clearInterval(t);
  }, [interval]);
  return tick;
}

const DIR_META = {
  beat:   { icon: TrendingUp,   color: '#10B981', label: 'Beat' },
  met:    { icon: Minus,        color: '#F59E0B', label: 'Met'  },
  missed: { icon: TrendingDown, color: '#EF4444', label: 'Miss' },
};

function CompletedOutcomeChip({ outcome }: { outcome: OutcomeData }) {
  const [open, setOpen] = useState(false);
  const dir = DIR_META[outcome.deltaDirection];
  const DirIcon = dir.icon;

  return (
    <div style={{ marginTop: 4 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <DirIcon size={8} color={dir.color} />
        <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: dir.color, fontWeight: 700 }}>
          {outcome.delta}
        </span>
        <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', marginLeft: 2 }}>
          {open ? '▲ hide' : '▼ view result'}
        </span>
      </button>

      {open && (
        <div style={{
          marginTop: 6, padding: '8px 10px',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${dir.color}22`,
          borderRadius: 8,
          animation: 'aiop-slide-in 0.18s ease both',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginBottom: 6 }}>
            {[
              { label: 'Predicted', value: outcome.predicted, color: 'rgba(255,255,255,0.4)' },
              { label: 'Actual',    value: outcome.actual,    color: dir.color              },
              { label: 'Variance',  value: outcome.delta,     color: dir.color              },
            ].map(c => (
              <div key={c.label} style={{ padding: '5px 7px', background: 'rgba(255,255,255,0.025)', borderRadius: 6 }}>
                <p style={{ margin: '0 0 2px', fontFamily: 'monospace', fontSize: 6.5, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>{c.label}</p>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: c.color, lineHeight: 1.2 }}>{c.value}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 6.5, color: 'rgba(255,255,255,0.2)' }}>CONF {outcome.confidence}%</span>
            <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${outcome.confidence}%`, background: outcome.confidence >= 80 ? '#10B981' : '#F59E0B', borderRadius: 2 }} />
            </div>
            {outcome.note && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic', flex: 1 }}>{outcome.note}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function PulsingDot({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 7, height: 7, flexShrink: 0 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}` }} />
      <span style={{
        position: 'absolute', inset: -3, borderRadius: '50%',
        border: `1px solid ${color}`,
        animation: 'aiop-ring 2s ease-out infinite',
        opacity: 0,
      }} />
    </span>
  );
}

export default function AIRecommendations() {
  const [mode, setMode] = useState<Mode>('assisted');
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const [approved, setApproved] = useState<Set<number>>(new Set());
  const [activityCount, setActivityCount] = useState(5);
  const tick = useTick(4200);
  const prevMode = useRef(mode);

  useEffect(() => {
    if (mode === 'autopilot' && prevMode.current !== 'autopilot') {
      const newApproved = new Set(approved);
      AI_RECS.forEach(r => {
        if (deriveStatus(r) === 'auto-running') newApproved.add(r.id);
      });
      setApproved(newApproved);
    }
    prevMode.current = mode;
  }, [mode]);

  useEffect(() => {
    if (mode === 'autopilot') {
      const t = setInterval(() => setActivityCount(n => n + 1), 8000);
      return () => clearInterval(t);
    }
  }, [mode, tick]);

  const pending = (AI_RECS as PendingAction[])
    .map(r => ({ ...r, status: deriveStatus(r) }))
    .filter(r => !dismissed.has(r.id));

  const criticalCount = pending.filter(r => r.status === 'high-urgency' && !approved.has(r.id)).length;
  const autoCount     = pending.filter(r => r.status === 'auto-running').length;

  return (
    <div style={{
      position: 'relative',
      background: '#09090C',
      border: '1px solid rgba(6,182,212,0.15)',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @keyframes aiop-ring { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes aiop-flash { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes aiop-slide-in { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes aiop-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .aiop-row { transition: background 0.2s; }
        .aiop-row:hover { background: rgba(255,255,255,0.025) !important; }
      `}</style>

      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.5),rgba(16,185,129,0.3),transparent)' }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(6,182,212,0.02)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Bot size={13} color="#06B6D4" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>AI Actions Ready</span>
            {criticalCount > 0 && (
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', animation: 'aiop-flash 2s ease-in-out infinite' }}>
                {criticalCount} URGENT
              </span>
            )}
            <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              82% forecast accuracy · 30d
            </span>
          </div>
          <p style={{ margin: 0, marginTop: 2, fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
            {mode === 'autopilot' ? `${activityCount} actions executed · system running autonomously — high-impact decisions escalated to you` : 'System has surfaced actions ready for your approval — each has a time-sensitive window'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
          {(['assisted', 'autopilot'] as Mode[]).map(m => {
            const active = mode === m;
            const isAuto = m === 'autopilot';
            const activeColor = isAuto ? '#10B981' : '#06B6D4';
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  background: active ? (isAuto ? 'rgba(16,185,129,0.15)' : 'rgba(6,182,212,0.15)') : 'transparent',
                  color: active ? activeColor : 'rgba(255,255,255,0.28)',
                  fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                  transition: 'all 0.2s ease',
                }}
              >
                {isAuto ? <Zap size={9} color={active ? activeColor : 'rgba(255,255,255,0.25)'} /> : <Shield size={9} color={active ? activeColor : 'rgba(255,255,255,0.25)'} />}
                {m === 'assisted' ? 'ASSISTED' : 'AUTOPILOT'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Autopilot mode banner ── */}
      {mode === 'autopilot' && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 16px', borderBottom: '1px solid rgba(16,185,129,0.12)',
          background: 'rgba(16,185,129,0.04)',
          animation: 'aiop-slide-in 0.3s ease both',
        }}>
          <PulsingDot color="#10B981" />
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', letterSpacing: '0.06em' }}>AUTOPILOT ACTIVE</span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Routine execution is running autonomously · decisions above the impact threshold are escalated before execution</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, color: 'rgba(16,185,129,0.7)' }}>{activityCount} done</span>
        </div>
      )}

      {/* ── Already Done strip ── */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 6px' }}>
          <CheckCircle2 size={10} color="rgba(16,185,129,0.6)" />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI already executed</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {COMPLETED_ACTIONS.map((a, i) => (
            <div key={a.id} className="aiop-row" style={{
              padding: '8px 16px',
              borderBottom: i < COMPLETED_ACTIONS.length - 1 ? '1px solid rgba(255,255,255,0.025)' : 'none',
              background: 'transparent',
              animation: 'aiop-slide-in 0.3s ease both',
              animationDelay: `${i * 40}ms`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: `${a.color}10`, border: `1px solid ${a.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <a.icon size={10} color={a.color} />
                </div>
                <span style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{a.text}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{a.time}</span>
                <CheckCircle2 size={11} color={`${a.color}80`} />
              </div>
              {a.outcome && (
                <div style={{ paddingLeft: 29 }}>
                  <CompletedOutcomeChip outcome={a.outcome} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Pending actions ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 7px' }}>
          <Play size={9} color="rgba(255,255,255,0.25)" />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Pending · {pending.length} actions</span>
          {mode === 'autopilot' && autoCount > 0 && (
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>{autoCount} running now</span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {pending.map((rec, i) => {
            const Icon = ICON_MAP[rec.icon] ?? Zap;
            const sm = STATUS_META[rec.status];
            const accentColor = URGENCY_ACCENT[rec.urgency];
            const borderColor = URGENCY_BORDER[rec.urgency];
            const isApproved = approved.has(rec.id);
            const isAutoInPilot = mode === 'autopilot' && rec.status === 'auto-running';

            return (
              <div key={rec.id} style={{
                padding: '12px 16px',
                borderBottom: i < pending.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                borderLeft: `2px solid ${isApproved || isAutoInPilot ? accentColor + '60' : borderColor}`,
                background: isApproved || isAutoInPilot ? `${accentColor}05` : 'transparent',
                transition: 'all 0.25s ease',
                opacity: isApproved ? 0.7 : 1,
                animation: 'aiop-slide-in 0.3s ease both',
                animationDelay: `${i * 50}ms`,
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accentColor}12`, border: `1px solid ${accentColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={accentColor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                      {/* Status tag */}
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        fontFamily: 'monospace', fontSize: 8, padding: '2px 8px', borderRadius: 20,
                        background: sm.bg, color: sm.color,
                        border: `1px solid ${sm.color}25`,
                      }}>
                        <PulsingDot color={sm.dot} />
                        {sm.label}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{rec.category}</span>
                      {isApproved && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>
                          <CheckCircle2 size={9} />Approved
                        </span>
                      )}
                      {isAutoInPilot && !isApproved && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>
                          <Activity size={9} />Running
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.82)', margin: 0, lineHeight: 1.4 }}>{rec.action}</p>
                  </div>
                </div>

                {/* Why */}
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, margin: '0 0 6px', paddingLeft: 38 }}>{rec.why}</p>

                {/* Surfaced from */}
                {rec.surfacedFrom && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, paddingLeft: 38, marginBottom: 8 }}>
                    <Radio size={8} color={`${accentColor}80`} />
                    <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: `${accentColor}80`, fontWeight: 700, letterSpacing: '0.06em' }}>
                      {rec.surfacedFrom}
                    </span>
                  </div>
                )}

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 38 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={9} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{rec.impact}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!isApproved && !isAutoInPilot && (
                      <button
                        onClick={() => {
                          const next = new Set(dismissed);
                          next.add(rec.id);
                          setDismissed(next);
                        }}
                        style={{ padding: '4px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', fontSize: 8.5, cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        SKIP
                      </button>
                    )}
                    {!isApproved && (
                      <button
                        onClick={() => {
                          const next = new Set(approved);
                          next.add(rec.id);
                          setApproved(next);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '4px 12px', borderRadius: 7,
                          background: `${accentColor}14`, border: `1px solid ${accentColor}30`,
                          color: accentColor, fontFamily: 'monospace', fontSize: 8.5, fontWeight: 700,
                          cursor: 'pointer', letterSpacing: '0.06em',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {rec.cta.toUpperCase()} <ArrowRight size={9} />
                      </button>
                    )}
                    {isApproved && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 8.5, color: '#10B981', padding: '4px 12px' }}>
                        <CheckCircle2 size={10} /> EXECUTING
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {pending.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 16px' }}>
              <CheckCircle2 size={14} color="#10B981" />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>All queued actions resolved · system is monitoring signals for the next window</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
