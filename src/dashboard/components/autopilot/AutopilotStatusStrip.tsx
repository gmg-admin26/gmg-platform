import React, { useState, useEffect } from 'react';
import { Cpu, Radio, Clock, Zap, Activity, ChevronDown, ChevronUp, CheckCircle, AlertCircle, ScanLine, TrendingUp } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import type { AutopilotMode } from '../../context/AutopilotContext';

function fmtSeconds(s: number): string {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem === 0 ? `${m}m` : `${m}m ${rem}s`;
}

function fmtScanAge(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 10) return 'just now';
  if (s < 90) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

function fmtK(n: number): string {
  if (n >= 1000) return `+${(n / 1000).toFixed(1)}K`;
  return n > 0 ? `+${n}` : '—';
}

const MODE_META: Record<AutopilotMode, { label: string; color: string; glow: string; bg: string; borderColor: string; dot: string }> = {
  manual: {
    label: 'Manual Mode',
    color: '#94A3B8',
    glow: 'rgba(148,163,184,0.12)',
    bg: 'rgba(148,163,184,0.05)',
    borderColor: 'rgba(148,163,184,0.15)',
    dot: '#64748B',
  },
  assisted: {
    label: 'Assisted Mode',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.12)',
    bg: 'rgba(245,158,11,0.05)',
    borderColor: 'rgba(245,158,11,0.2)',
    dot: '#F59E0B',
  },
  autopilot: {
    label: 'Autopilot Active',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.15)',
    bg: 'rgba(16,185,129,0.05)',
    borderColor: 'rgba(16,185,129,0.25)',
    dot: '#10B981',
  },
};

interface Props {
  compact?: boolean;
}

export default function AutopilotStatusStrip({ compact = false }: Props) {
  const {
    mode, liveSignals, nextExecutionIn, lastExecutedAgo, queuedActions, isExecuting,
    executedToday, awaitingApproval, weeklyLiftStreams, lastScanTs,
  } = useAutopilot();
  const meta = MODE_META[mode];
  const [expanded, setExpanded] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isExecuting) setPulse(true);
    const t = setTimeout(() => setPulse(false), 2000);
    return () => clearTimeout(t);
  }, [isExecuting]);

  const showQueue = mode !== 'manual' && queuedActions.length > 0;

  const activityLine = mode === 'manual'
    ? 'System monitoring signals — no autonomous actions active'
    : mode === 'assisted'
    ? `AI executed ${executedToday} action${executedToday !== 1 ? 's' : ''} in last 24h · ${awaitingApproval} awaiting your approval · Est. lift this week: ${fmtK(weeklyLiftStreams)} streams`
    : `Autopilot executed ${executedToday} action${executedToday !== 1 ? 's' : ''} autonomously today · Est. lift this week: ${fmtK(weeklyLiftStreams)} streams`;

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes ap-pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes ap-exec-flash { 0%{opacity:0;transform:scaleX(0)} 30%{opacity:1;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(1)} }
        @keyframes ap-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
        .ap-live-dot { animation: ap-pulse 1.6s ease-in-out infinite; }
        .ap-exec-flash { animation: ap-exec-flash 1.8s ease-out forwards; }
        .ap-scan-line { animation: ap-scan 2.4s linear infinite; }
      `}</style>

      <div
        style={{
          background: meta.bg,
          border: `1px solid ${meta.borderColor}`,
          borderRadius: compact ? 10 : 12,
          boxShadow: mode === 'autopilot' ? `0 0 24px ${meta.glow}, inset 0 1px 0 rgba(255,255,255,0.04)` : `inset 0 1px 0 rgba(255,255,255,0.03)`,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.4s ease',
        }}
      >
        {pulse && (
          <div className="ap-exec-flash" style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent, ${meta.color}22, transparent)`, pointerEvents: 'none', zIndex: 2 }} />
        )}

        {mode === 'autopilot' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${meta.color}60, transparent)`, zIndex: 1 }} />
        )}

        {/* Main row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 12 : 16, padding: compact ? '8px 14px' : '10px 18px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ position: 'relative', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mode === 'autopilot' && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `radial-gradient(circle, ${meta.color}25 0%, transparent 70%)` }} />
              )}
              <Cpu size={14} color={meta.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {mode !== 'manual' && (
                  <div className="ap-live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: meta.dot, boxShadow: `0 0 6px ${meta.dot}` }} />
                )}
                <span style={{ fontFamily: 'monospace', fontSize: compact ? 10 : 11, fontWeight: 800, color: meta.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {isExecuting ? 'Executing…' : meta.label}
                </span>
              </div>
              {!compact && (
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>
                  GMG ARTIST OS · ENGINE v2
                </span>
              )}
            </div>
          </div>

          <div style={{ width: 1, height: compact ? 20 : 28, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 12 : 18, flex: 1, flexWrap: 'wrap' }}>
            {mode !== 'manual' ? (
              <StatusStat icon={<Radio size={10} color={meta.color} />} label="Live Signals" value={`${liveSignals}`} color={meta.color} compact={compact} />
            ) : (
              <StatusStat icon={<Radio size={10} color="#64748B" />} label="Monitoring" value="Passive" color="#64748B" compact={compact} />
            )}

            {mode !== 'manual' ? (
              <StatusStat
                icon={<Clock size={10} color={mode === 'autopilot' ? '#06B6D4' : '#F59E0B'} />}
                label="Next Window"
                value={fmtSeconds(nextExecutionIn)}
                color={mode === 'autopilot' ? '#06B6D4' : '#F59E0B'}
                compact={compact}
              />
            ) : (
              <StatusStat icon={<Clock size={10} color="#64748B" />} label="Next Window" value="—" color="#64748B" compact={compact} />
            )}

            {lastExecutedAgo !== null ? (
              <StatusStat
                icon={<Zap size={10} color="#10B981" />}
                label="Last Action"
                value={lastExecutedAgo < 60 ? `${lastExecutedAgo}s ago` : `${Math.floor(lastExecutedAgo / 60)}m ago`}
                color="#10B981"
                compact={compact}
              />
            ) : (
              <StatusStat icon={<Zap size={10} color="#64748B" />} label="Last Action" value="—" color="#64748B" compact={compact} />
            )}

            {mode !== 'manual' && executedToday > 0 && (
              <StatusStat
                icon={<CheckCircle size={10} color="#10B981" />}
                label="Today"
                value={`${executedToday} exec`}
                color="#10B981"
                compact={compact}
              />
            )}

            {mode === 'assisted' && awaitingApproval > 0 && (
              <StatusStat
                icon={<AlertCircle size={10} color="#F59E0B" />}
                label="Awaiting"
                value={`${awaitingApproval} pending`}
                color="#F59E0B"
                compact={compact}
              />
            )}

            {showQueue && mode === 'autopilot' && (
              <StatusStat
                icon={<Activity size={10} color={meta.color} />}
                label="Queued"
                value={`${queuedActions.length} action${queuedActions.length !== 1 ? 's' : ''}`}
                color={meta.color}
                compact={compact}
              />
            )}

            {mode !== 'manual' && weeklyLiftStreams > 0 && !compact && (
              <StatusStat
                icon={<TrendingUp size={10} color="#06B6D4" />}
                label="Wk Lift"
                value={fmtK(weeklyLiftStreams)}
                color="#06B6D4"
                compact={compact}
              />
            )}
          </div>

          {showQueue && !compact && (
            <button
              onClick={() => setExpanded(v => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, background: `${meta.color}15`, border: `1px solid ${meta.color}30`, cursor: 'pointer', flexShrink: 0 }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: meta.color, fontWeight: 700, letterSpacing: '0.05em' }}>QUEUE</span>
              {expanded ? <ChevronUp size={9} color={meta.color} /> : <ChevronDown size={9} color={meta.color} />}
            </button>
          )}

          {mode === 'manual' && (
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', flexShrink: 0 }}>
              RECOMMENDATIONS ONLY
            </span>
          )}
        </div>

        {/* System activity line */}
        {!compact && (
          <div style={{
            borderTop: `1px solid ${meta.borderColor}`,
            padding: '6px 18px',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(0,0,0,0.15)',
          }}>
            <ScanLine size={9} color={mode === 'manual' ? 'rgba(255,255,255,0.15)' : meta.color} style={{ flexShrink: 0, opacity: mode === 'manual' ? 0.5 : 1 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: mode === 'manual' ? 'rgba(255,255,255,0.2)' : `${meta.color}CC`, letterSpacing: '0.03em', flex: 1 }}>
              {activityLine}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
              {mode !== 'manual' && (
                <div className="ap-live-dot" style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
              )}
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.05em' }}>
                Last scan {fmtScanAge(lastScanTs)}
              </span>
            </div>
          </div>
        )}

        {expanded && showQueue && (
          <div style={{ borderTop: `1px solid ${meta.borderColor}`, padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
              {mode === 'autopilot' ? 'Auto-Execute Queue' : 'Pending Approval Queue'}
            </span>
            {queuedActions.map((a, i) => (
              <QueueItem key={a.id} action={a} index={i} mode={mode} color={meta.color} />
            ))}
          </div>
        )}

        {mode === 'autopilot' && (
          <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${meta.color}40, transparent)`, position: 'relative', overflow: 'hidden' }}>
            <div className="ap-scan-line" style={{ position: 'absolute', top: 0, bottom: 0, width: '25%', background: `linear-gradient(90deg, transparent, ${meta.color}80, transparent)` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusStat({ icon, label, value, color, compact }: { icon: React.ReactNode; label: string; value: string; color: string; compact: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {icon}
      <div>
        {!compact && <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>{label}</div>}
        <div style={{ fontFamily: 'monospace', fontSize: compact ? 10 : 11, fontWeight: 700, color, lineHeight: 1, marginTop: compact ? 0 : 2 }}>{value}</div>
      </div>
    </div>
  );
}

function QueueItem({ action, index, mode, color }: { action: import('../../context/AutopilotContext').QueuedAction; index: number; mode: AutopilotMode; color: string }) {
  const delay = Math.round((action.scheduledAt - Date.now()) / 1000);
  const delayStr = delay > 0 ? fmtSeconds(delay) : 'now';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, color }}>{index + 1}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{action.label}</div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{action.trigger}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{action.confidence}%</span>
        <div style={{ padding: '3px 8px', borderRadius: 5, background: mode === 'autopilot' ? `${color}18` : 'rgba(245,158,11,0.12)', border: `1px solid ${mode === 'autopilot' ? color + '30' : 'rgba(245,158,11,0.25)'}` }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 700, color: mode === 'autopilot' ? color : '#F59E0B', letterSpacing: '0.05em' }}>
            {mode === 'autopilot' ? `AUTO · ${delayStr}` : 'PENDING APPROVAL'}
          </span>
        </div>
      </div>
    </div>
  );
}
