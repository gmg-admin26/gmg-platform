import { useState, useEffect } from 'react';
import { Cpu, Zap, CheckCircle, Activity, ChevronDown, Radio } from 'lucide-react';
import { mono, LiveDot, chip } from './primitives';

type AutopilotMode = 'manual' | 'assisted' | 'autopilot';

const MODE_CFG = {
  manual:    { label: 'Manual Mode',    color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)',  desc: 'All actions require your approval' },
  assisted:  { label: 'Assisted Mode',  color: '#06B6D4',               bg: 'rgba(6,182,212,0.06)',   border: 'rgba(6,182,212,0.2)',   desc: 'AI recommends — you execute with one click' },
  autopilot: { label: 'Autopilot Active', color: '#10B981',             bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.25)', desc: 'AI agents executing campaign actions autonomously' },
};

const MICRO_FEED_ITEMS = [
  'Creator outreach batch deployed — 42 creators contacted',
  'Paid media test launched — TikTok variant B active',
  'Spotify Canvas updated automatically — new artwork live',
  'Pre-save CTA refreshed across IG + TikTok bios',
  'Advance request queued — pending approval',
  'Brazil creator brief sent — 12 recipients',
  'Signal monitoring recalibrated — new baseline set',
  'Apple Music bio auto-draft generated — ready for review',
];

const ACTIVE_AUTOMATIONS = [
  { label: 'Creator outreach', status: 'in-progress', pct: 44, detail: '18 / 42 creators contacted' },
  { label: 'TikTok A/B test', status: 'in-progress', pct: 68, detail: 'Variant B outperforming A by 14%' },
  { label: 'Pre-save amplification', status: 'in-progress', pct: 30, detail: '3,720 / 12,600 gap closed' },
];

export function AutopilotBar() {
  const [mode, setMode] = useState<AutopilotMode>('assisted');
  const [feedIdx, setFeedIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const cfg = MODE_CFG[mode];

  useEffect(() => {
    const t = setInterval(() => setFeedIdx(v => v + 1), 3800);
    return () => clearInterval(t);
  }, []);

  const isAuto = mode === 'autopilot';

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'all 0.3s',
        boxShadow: isAuto ? `0 0 24px rgba(16,185,129,0.07)` : 'none',
      }}>
        {/* Top shimmer */}
        {isAuto && (
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.7) 40%, rgba(6,182,212,0.4) 70%, transparent 100%)' }} />
        )}

        {/* Main bar */}
        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {/* Mode icon + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `${cfg.color}12`, border: `1px solid ${cfg.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
              <Cpu size={14} color={cfg.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {isAuto && <LiveDot color="#10B981" size={6} gap={3} />}
                <span style={{ ...mono, fontSize: 10, fontWeight: 900, color: cfg.color, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{cfg.label}</span>
              </div>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{cfg.desc}</p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 4 }}>
            {(['manual', 'assisted', 'autopilot'] as AutopilotMode[]).map(m => {
              const mc = MODE_CFG[m];
              const active = mode === m;
              return (
                <button key={m} onClick={() => setMode(m)}
                  style={{
                    ...mono, fontSize: 8, padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    fontWeight: 800, textTransform: 'uppercase' as const, letterSpacing: '0.07em',
                    background: active ? `${mc.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? mc.color + '40' : 'rgba(255,255,255,0.07)'}`,
                    color: active ? mc.color : 'rgba(255,255,255,0.25)',
                    transition: 'all 0.2s',
                    boxShadow: active ? `0 0 10px ${mc.color}15` : 'none',
                  }}>
                  {m === 'manual' ? 'Manual' : m === 'assisted' ? 'Assisted' : 'Autopilot'}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />

          {/* Active automations count */}
          {(isAuto || mode === 'assisted') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <Activity size={10} color={cfg.color} />
              <span style={{ ...mono, fontSize: 9, color: cfg.color, fontWeight: 700 }}>
                {isAuto ? `${ACTIVE_AUTOMATIONS.length} ACTIONS IN PROGRESS` : '7 ACTIONS READY'}
              </span>
            </div>
          )}

          {/* Micro-feed ticker */}
          {isAuto && (
            <>
              <div style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, minWidth: 0 }}>
                <Radio size={9} color="rgba(16,185,129,0.5)" />
                <span key={feedIdx} style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', animation: 'cos-slide 0.35s ease' }}>
                  {MICRO_FEED_ITEMS[feedIdx % MICRO_FEED_ITEMS.length]}
                </span>
              </div>
            </>
          )}

          {/* Timestamp */}
          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.18)', marginLeft: 'auto', flexShrink: 0 }}>
            Last action: 3 min ago
          </span>

          {/* Expand toggle */}
          {(isAuto || mode === 'assisted') && (
            <button onClick={() => setExpanded(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
              <ChevronDown size={13} color="rgba(255,255,255,0.3)" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </button>
          )}
        </div>

        {/* Expanded automations */}
        {expanded && isAuto && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10, animation: 'cos-slide 0.2s ease' }}>
            <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 4 }}>Active Automations</div>
            {ACTIVE_AUTOMATIONS.map((auto, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)', flexShrink: 0, animation: 'cos-glow 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', flex: '0 0 200px' }}>{auto.label}</span>
                <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${auto.pct}%`, background: '#10B981', borderRadius: 99, boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
                </div>
                <span style={{ ...mono, fontSize: 9, color: '#10B981', flex: '0 0 30px', textAlign: 'right' }}>{auto.pct}%</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', flex: '0 0 220px' }}>{auto.detail}</span>
                <span style={{ ...chip('#10B981'), fontSize: 7 }}>In Progress</span>
              </div>
            ))}
          </div>
        )}

        {/* Assisted mode expanded — ready actions */}
        {expanded && mode === 'assisted' && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 18px', animation: 'cos-slide 0.2s ease' }}>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
              7 high-confidence actions ready for one-click execution. Switch to Autopilot to let the system execute autonomously.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
