import { useState, useEffect } from 'react';
import { Cpu, TrendingUp, CheckCircle, Zap, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Target, BarChart2, X } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function fmtK(n: number): string {
  if (n >= 1000) return `+${(n / 1000).toFixed(1)}K`;
  return n > 0 ? `+${n}` : '0';
}

interface SummaryRow {
  icon: React.ElementType;
  color: string;
  label: string;
  value: string;
  dim?: boolean;
}

const FORECAST_ACCURACY_BY_TYPE = [
  { label: 'Paid Media',       accuracy: 86, category: 'paid_media',       topPerformer: false },
  { label: 'Geo Targeting',    accuracy: 91, category: 'geo_targeting',    topPerformer: true  },
  { label: 'Creator Seeding',  accuracy: 78, category: 'creator_seeding',  topPerformer: false },
  { label: 'Editorial Timing', accuracy: 74, category: 'editorial_timing', topPerformer: false },
  { label: 'Merch Conversion', accuracy: 81, category: 'merch_conversion', topPerformer: false },
];

function AIPerformanceModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(6px)',
      animation: 'aiws-fade-in 0.2s ease both',
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0D0E12',
          border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: 16,
          padding: '20px 24px',
          width: 380,
          maxWidth: '90vw',
          position: 'relative',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)', borderRadius: '16px 16px 0 0' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={13} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>AI Performance</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em' }}>forecast accuracy · last 30 days</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={14} color="rgba(255,255,255,0.3)" />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 16 }}>
          <Target size={14} color="#10B981" />
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>82%</div>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>overall · 5 forecasts tracked · avg variance −6.2%</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.7)' }}>TOP PERFORMER</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Geo Targeting</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FORECAST_ACCURACY_BY_TYPE.map(item => {
            const barColor = item.accuracy >= 85 ? '#10B981' : item.accuracy >= 75 ? '#F59E0B' : '#EF4444';
            return (
              <div key={item.category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
                    {item.topPerformer && (
                      <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981' }}>TOP</span>
                    )}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: barColor }}>{item.accuracy}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.accuracy}%`, background: barColor, borderRadius: 3, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
            Model updates continuously from completed action outcomes. Missed forecasts recalibrate weighting for that signal type — accuracy improves as more actions complete.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AIWeeklySummary() {
  const {
    mode,
    weeklyActionsSurfaced,
    weeklyActionsApproved,
    weeklyActionsAutonomous,
    weeklyProjectedValue,
    weeklyRisksPrevented,
    weeklyLiftStreams,
  } = useAutopilot();
  const [expanded, setExpanded] = useState(false);
  const [scanPulse, setScanPulse] = useState(false);
  const [showPerfModal, setShowPerfModal] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setScanPulse(true);
      setTimeout(() => setScanPulse(false), 1200);
    }, 14000);
    return () => clearInterval(t);
  }, []);

  const isActive = mode !== 'manual';
  const modeColor = mode === 'autopilot' ? '#10B981' : mode === 'assisted' ? '#F59E0B' : '#64748B';

  const rows: SummaryRow[] = [
    {
      icon: TrendingUp,
      color: '#06B6D4',
      label: 'Actions surfaced',
      value: `${weeklyActionsSurfaced}`,
    },
    {
      icon: CheckCircle,
      color: '#10B981',
      label: 'Approved & executed',
      value: `${weeklyActionsApproved}`,
    },
    {
      icon: Zap,
      color: mode === 'autopilot' ? '#10B981' : '#64748B',
      label: 'Executed autonomously',
      value: `${weeklyActionsAutonomous}`,
      dim: mode !== 'autopilot',
    },
    {
      icon: TrendingUp,
      color: '#06B6D4',
      label: 'Est. stream lift',
      value: fmtK(weeklyLiftStreams),
    },
    {
      icon: ShieldCheck,
      color: '#F59E0B',
      label: 'Major risks prevented',
      value: weeklyRisksPrevented > 0 ? `${weeklyRisksPrevented}` : '—',
    },
    {
      icon: Target,
      color: '#10B981',
      label: 'Forecasts tracked',
      value: '5',
    },
    {
      icon: BarChart2,
      color: '#06B6D4',
      label: 'Avg forecast variance',
      value: '−6.2%',
    },
  ];

  const projValueStr = weeklyProjectedValue.low > 0
    ? `${fmtMoney(weeklyProjectedValue.low)}–${fmtMoney(weeklyProjectedValue.high)}`
    : '—';

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes aiws-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes aiws-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
        @keyframes aiws-fade-in { from{opacity:0} to{opacity:1} }
        .aiws-dot { animation: aiws-pulse 2s ease-in-out infinite; }
        .aiws-scan { animation: aiws-scan 1.8s ease-out forwards; }
        .aiws-perf-btn:hover { background: rgba(16,185,129,0.12) !important; }
      `}</style>

      {showPerfModal && <AIPerformanceModal onClose={() => setShowPerfModal(false)} />}

      <div
        style={{
          background: '#0A0B0E',
          border: isActive ? `1px solid ${modeColor}25` : '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          overflow: 'hidden',
          transition: 'border-color 0.4s',
          position: 'relative',
        }}
      >
        {scanPulse && isActive && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
            <div className="aiws-scan" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', background: `linear-gradient(90deg, transparent, ${modeColor}06, transparent)` }} />
          </div>
        )}

        {isActive && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${modeColor}50, transparent)` }} />
        )}

        <button
          onClick={() => setExpanded(v => !v)}
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block', textAlign: 'left' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? `${modeColor}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? modeColor + '30' : 'rgba(255,255,255,0.08)'}`, flexShrink: 0 }}>
              <Cpu size={13} color={isActive ? modeColor : 'rgba(255,255,255,0.25)'} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isActive && (
                  <div className="aiws-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: modeColor, boxShadow: `0 0 5px ${modeColor}`, flexShrink: 0 }} />
                )}
                <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  AI System · Weekly Output
                </span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
                {isActive ? `${mode === 'autopilot' ? 'Autopilot' : 'Assisted'} mode · rolling 7 days` : 'Manual mode · no autonomous output'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {isActive && weeklyProjectedValue.low > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <TrendingUp size={9} color="#10B981" />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: '#10B981' }}>
                    {projValueStr}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                  {expanded ? 'HIDE' : 'SHOW'}
                </span>
                {expanded
                  ? <ChevronUp size={9} color="rgba(255,255,255,0.2)" />
                  : <ChevronDown size={9} color="rgba(255,255,255,0.2)" />
                }
              </div>
            </div>
          </div>
        </button>

        {expanded && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 16px 14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px', marginBottom: 12 }}>
              {rows.map((row, i) => {
                const Icon = row.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: row.dim ? 'rgba(255,255,255,0.03)' : `${row.color}12`, border: `1px solid ${row.dim ? 'rgba(255,255,255,0.06)' : row.color + '20'}`, flexShrink: 0 }}>
                      <Icon size={9} color={row.dim ? 'rgba(255,255,255,0.2)' : row.color} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1 }}>{row.label}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: row.dim ? 'rgba(255,255,255,0.2)' : row.color, lineHeight: 1.2, marginTop: 2 }}>{row.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {isActive && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Target size={11} color="#10B981" />
                  <div>
                    <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Forecast Accuracy</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 1 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 800, color: '#10B981' }}>82%</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>last 30 days · top: geo targeting 91%</span>
                    </div>
                  </div>
                </div>
                <button
                  className="aiws-perf-btn"
                  onClick={(e) => { e.stopPropagation(); setShowPerfModal(true); }}
                  style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
                >
                  VIEW BREAKDOWN
                </button>
              </div>
            )}

            {isActive && weeklyProjectedValue.low > 0 && (
              <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.14)', display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <ShieldCheck size={11} color="#10B981" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>Projected Value Generated</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#10B981', lineHeight: 1, marginBottom: 3 }}>{projValueStr}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>estimated from executed actions · rolling 7 days</div>
                </div>
              </div>
            )}

            {!isActive && (
              <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={11} color="rgba(255,255,255,0.2)" />
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>
                  Switch to Assisted or Autopilot mode to enable autonomous output tracking.
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
