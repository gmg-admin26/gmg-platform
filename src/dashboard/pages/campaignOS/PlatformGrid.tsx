import { useState } from 'react';
import {
  CheckCircle, AlertTriangle, XCircle, Clock, ChevronDown,
  Zap, AlertOctagon, Eye, RefreshCw, Wrench, Settings2,
  ShieldCheck, ShieldAlert, Activity, Radio, Wifi, WifiOff,
} from 'lucide-react';
import type { Platform, PlatformStatus, PlatformRowState, PlatformCTA } from './types';
import { mono, chip, ProgressBar, HoverBtn } from './primitives';

const STATUS_CFG: Record<PlatformStatus, { icon: React.ElementType; color: string; label: string }> = {
  complete:  { icon: CheckCircle,   color: '#10B981', label: 'Done'    },
  ready:     { icon: Clock,         color: '#06B6D4', label: 'Ready'   },
  partial:   { icon: AlertTriangle, color: '#F59E0B', label: 'Partial' },
  missing:   { icon: XCircle,       color: '#EF4444', label: 'Missing' },
  blocked:   { icon: XCircle,       color: '#EF4444', label: 'Blocked' },
};

const ROW_STATE_CFG: Record<PlatformRowState, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  'ready':       { label: 'Ready',       color: '#10B981', icon: CheckCircle,  bg: 'rgba(16,185,129,0.08)'  },
  'monitoring':  { label: 'Monitoring',  color: '#06B6D4', icon: Activity,     bg: 'rgba(6,182,212,0.06)'   },
  'partial':     { label: 'Partial',     color: '#F59E0B', icon: AlertTriangle, bg: 'rgba(245,158,11,0.07)' },
  'needs-fix':   { label: 'Needs Fix',   color: '#EF4444', icon: Wrench,       bg: 'rgba(239,68,68,0.07)'   },
  'blocked':     { label: 'Blocked',     color: '#EF4444', icon: AlertOctagon, bg: 'rgba(239,68,68,0.1)'    },
};

const CTA_CFG: Record<PlatformCTA, { label: string; color: string; icon: React.ElementType }> = {
  'fix-now':        { label: 'Fix Now',        color: '#EF4444', icon: Zap         },
  'complete-setup': { label: 'Complete Setup', color: '#F59E0B', icon: Settings2   },
  'verify':         { label: 'Verify',         color: '#06B6D4', icon: ShieldCheck },
  'sync':           { label: 'Sync',           color: '#10B981', icon: RefreshCw   },
  'review':         { label: 'Review',         color: '#94A3B8', icon: Eye         },
  'none':           { label: '',               color: '#94A3B8', icon: Eye         },
};

const CHANNEL_CFG = {
  dsp:   { label: 'DSP',         color: '#06B6D4' },
  social: { label: 'Social',    color: '#EC4899'  },
  fan:   { label: 'Fan',         color: '#8B5CF6'  },
  paid:  { label: 'Paid Ads',    color: '#F59E0B'  },
};

function BlockerBadge() {
  return (
    <span style={{
      ...mono, fontSize: 7, padding: '2px 6px', borderRadius: 4,
      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
      color: '#EF4444', fontWeight: 900, letterSpacing: '0.05em', flexShrink: 0,
    }}>
      BLOCKING
    </span>
  );
}

function CheckRow({ label, status, blocker, detail }: { label: string; status: PlatformStatus; blocker?: boolean; detail?: string }) {
  const sc = STATUS_CFG[status];
  const Icon = sc.icon;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
      <div style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: `${sc.color}10`, border: `1px solid ${sc.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        <Icon size={9} color={sc.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11,
            color: status === 'complete' ? 'rgba(255,255,255,0.38)' : status === 'missing' || status === 'blocked' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)',
            textDecoration: status === 'complete' ? 'line-through' : 'none',
            textDecorationColor: 'rgba(255,255,255,0.15)',
          }}>{label}</span>
          {blocker && <BlockerBadge />}
        </div>
        {detail && (
          <span style={{ ...mono, fontSize: 8.5, color: status === 'missing' || status === 'blocked' ? '#EF444499' : 'rgba(255,255,255,0.22)', marginTop: 2, display: 'block', lineHeight: 1.4 }}>
            {detail}
          </span>
        )}
      </div>
      <span style={{ ...chip(sc.color, 7), flexShrink: 0 }}>{sc.label}</span>
    </div>
  );
}

function ReadinessRing({ score, color }: { score: number; color: string }) {
  const size = 40;
  const r = 15;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}80)`, transition: 'stroke-dashoffset 0.5s ease' }} />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#fff"
        style={{ fontSize: 9, fontWeight: 900, fontFamily: 'monospace', transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}>
        {score}
      </text>
    </svg>
  );
}

function PlatformRow({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false);
  const rsc = ROW_STATE_CFG[platform.rowState];
  const StateIcon = rsc.icon;
  const doneCount = platform.checks.filter(c => c.status === 'complete').length;
  const blockerChecks = platform.checks.filter(c => c.blocker);
  const scoreColor = platform.hygieneScore >= 80 ? '#10B981' : platform.hygieneScore >= 60 ? '#F59E0B' : '#EF4444';
  const ch = CHANNEL_CFG[platform.channel];

  const primaryCTA = platform.ctaActions.find(c => c !== 'none');
  const ctaCfg = primaryCTA ? CTA_CFG[primaryCTA] : null;
  const secondaryCTA = platform.ctaActions.find(c => c !== 'none' && c !== primaryCTA);
  const secondaryCfg = secondaryCTA ? CTA_CFG[secondaryCTA] : null;

  return (
    <div style={{
      background: open ? rsc.bg : '#0A0B0D',
      border: `1px solid ${open ? rsc.color + '28' : platform.isBlocker ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.07)'}`,
      borderLeft: platform.isBlocker ? `3px solid #EF4444` : platform.rowState === 'blocked' ? `3px solid #EF4444` : platform.rowState === 'needs-fix' ? `3px solid ${rsc.color}` : `3px solid ${platform.color}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'background 0.2s, border-color 0.2s',
      boxShadow: platform.isBlocker ? '0 0 0 1px rgba(239,68,68,0.08)' : 'none',
    }}>
      {/* Main row — always visible */}
      <div
        style={{ padding: '0 16px', cursor: 'pointer', display: 'flex', alignItems: 'stretch', minHeight: 62 }}
        onClick={() => setOpen(v => !v)}
      >
        {/* Platform identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 148, flexShrink: 0, paddingRight: 12, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: `${platform.color}14`, border: `1px solid ${platform.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 8px ${platform.color}18` }}>
            <span style={{ fontSize: 13, color: platform.color }}>{platform.icon}</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{platform.name}</span>
              {platform.isBlocker && <ShieldAlert size={9} color="#EF4444" />}
            </div>
            <span style={{ ...mono, fontSize: 7, padding: '1px 5px', borderRadius: 4, background: `${ch.color}12`, border: `1px solid ${ch.color}20`, color: ch.color, fontWeight: 700 }}>
              {ch.label}
            </span>
          </div>
        </div>

        {/* Readiness score */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 68, flexShrink: 0, paddingRight: 8, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ReadinessRing score={platform.hygieneScore} color={scoreColor} />
            <span style={{ ...mono, fontSize: 6.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Score</span>
          </div>
        </div>

        {/* Setup completion */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 80, flexShrink: 0, padding: '0 10px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Setup</span>
            <span style={{ ...mono, fontSize: 8, fontWeight: 800, color: doneCount === platform.checks.length ? '#10B981' : scoreColor }}>
              {doneCount}/{platform.checks.length}
            </span>
          </div>
          <ProgressBar pct={platform.setupPct} color={scoreColor} height={4} />
          <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 3 }}>{platform.setupPct}% complete</span>
        </div>

        {/* Row state */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 96, flexShrink: 0, padding: '0 8px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: `${rsc.color}12`, border: `1px solid ${rsc.color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: (platform.rowState === 'blocked' || platform.rowState === 'needs-fix') ? `0 0 8px ${rsc.color}30` : 'none',
            }}>
              <StateIcon size={12} color={rsc.color} />
            </div>
            <span style={{ ...chip(rsc.color, 7.5) }}>{rsc.label}</span>
          </div>
        </div>

        {/* Current status + action needed */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '10px 14px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5, flexWrap: 'wrap' }}>
            {platform.rowState === 'monitoring' || platform.rowState === 'ready' ? (
              <Wifi size={9} color="#10B981" />
            ) : (
              <WifiOff size={9} color={rsc.color} />
            )}
            <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
              {platform.currentStatus}
            </span>
          </div>
          {platform.rowState !== 'ready' && platform.rowState !== 'monitoring' && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <Radio size={8} color={rsc.color} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 10, color: rsc.color === '#EF4444' ? 'rgba(239,68,68,0.85)' : 'rgba(245,158,11,0.85)', lineHeight: 1.5 }}>
                {platform.actionNeeded}
              </span>
            </div>
          )}
          {(platform.rowState === 'ready' || platform.rowState === 'monitoring') && platform.actionNeeded && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
              <Eye size={8} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
                {platform.actionNeeded}
              </span>
            </div>
          )}
          {blockerChecks.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
              {blockerChecks.map((bc, i) => (
                <span key={i} style={{ ...mono, fontSize: 7, padding: '1px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444' }}>
                  ✕ {bc.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CTA actions + sync time */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 6, padding: '10px 0 10px 12px', flexShrink: 0, minWidth: 130 }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
            {ctaCfg && (
              <HoverBtn label={ctaCfg.label} color={ctaCfg.color} icon={ctaCfg.icon} sm />
            )}
            {secondaryCfg && (
              <HoverBtn label={secondaryCfg.label} color={secondaryCfg.color} icon={secondaryCfg.icon} sm />
            )}
            {!ctaCfg && (
              <span style={{ ...mono, fontSize: 8, color: 'rgba(16,185,129,0.5)' }}>All clear</span>
            )}
          </div>
          {platform.lastSynced && (
            <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <RefreshCw size={7} color="rgba(255,255,255,0.15)" />
              {platform.lastSynced}
            </span>
          )}
        </div>

        {/* Expand toggle */}
        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8, flexShrink: 0 }}>
          <ChevronDown size={12} color="rgba(255,255,255,0.22)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>

      {/* Expanded check detail panel */}
      {open && (
        <div style={{ borderTop: `1px solid ${rsc.color}18`, padding: '14px 18px 14px 18px', animation: 'cos-slide 0.18s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Channel Checklist — {doneCount} of {platform.checks.length} complete
            </span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            {platform.isBlocker && (
              <span style={{ ...mono, fontSize: 7.5, padding: '2px 8px', borderRadius: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontWeight: 800 }}>
                Release Blocker
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {platform.checks.map((check, i) => (
              <CheckRow key={i} label={check.label} status={check.status} blocker={check.blocker} detail={check.detail} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type FilterView = 'all' | 'blockers' | 'needs-fix' | 'monitoring';
type ChannelFilter = 'all' | 'dsp' | 'social' | 'fan' | 'paid';

export function PlatformGrid({ platforms }: { platforms: Platform[] }) {
  const [view, setView] = useState<FilterView>('all');
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>('all');

  const blockerCount = platforms.filter(p => p.isBlocker).length;
  const needsFixCount = platforms.filter(p => p.rowState === 'needs-fix' || p.rowState === 'blocked').length;
  const readyCount = platforms.filter(p => p.rowState === 'ready' || p.rowState === 'monitoring').length;
  const avgScore = Math.round(platforms.reduce((sum, p) => sum + p.hygieneScore, 0) / platforms.length);

  const visible = platforms
    .filter(p => {
      if (channelFilter !== 'all' && p.channel !== channelFilter) return false;
      if (view === 'blockers') return p.isBlocker;
      if (view === 'needs-fix') return p.rowState === 'needs-fix' || p.rowState === 'blocked';
      if (view === 'monitoring') return p.rowState === 'monitoring' || p.rowState === 'ready';
      return true;
    })
    .sort((a, b) => {
      const priority: Record<PlatformRowState, number> = { blocked: 0, 'needs-fix': 1, partial: 2, monitoring: 3, ready: 4 };
      return priority[a.rowState] - priority[b.rowState];
    });

  const FILTERS: { key: FilterView; label: string; count?: number; color: string }[] = [
    { key: 'all',       label: 'All Channels',  count: platforms.length, color: '#94A3B8' },
    { key: 'blockers',  label: 'Blocking',       count: blockerCount,     color: '#EF4444' },
    { key: 'needs-fix', label: 'Needs Fix',      count: needsFixCount,    color: '#F59E0B' },
    { key: 'monitoring', label: 'Monitoring',    count: readyCount,       color: '#10B981' },
  ];

  const CHANNEL_FILTERS: { key: ChannelFilter; label: string; color: string }[] = [
    { key: 'all',    label: 'All',      color: '#94A3B8' },
    { key: 'dsp',    label: 'DSP',      color: '#06B6D4' },
    { key: 'social', label: 'Social',   color: '#EC4899' },
    { key: 'fan',    label: 'Fan',      color: '#8B5CF6' },
    { key: 'paid',   label: 'Paid Ads', color: '#F59E0B' },
  ];

  return (
    <div>
      {/* Ops summary bar */}
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: 0, marginBottom: 16,
        background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12,
        overflow: 'hidden',
      }}>
        {[
          { label: 'Avg Readiness', value: `${avgScore}`, unit: '/100', color: avgScore >= 75 ? '#10B981' : avgScore >= 60 ? '#F59E0B' : '#EF4444' },
          { label: 'Channels Ready', value: `${readyCount}`, unit: `/${platforms.length}`, color: '#10B981' },
          { label: 'Needs Fix', value: `${needsFixCount}`, unit: ' channels', color: needsFixCount > 0 ? '#F59E0B' : '#10B981' },
          { label: 'Release Blockers', value: `${blockerCount}`, unit: ' active', color: blockerCount > 0 ? '#EF4444' : '#10B981' },
          { label: 'Infrastructure', value: blockerCount === 0 ? 'Clear' : 'At Risk', unit: '', color: blockerCount === 0 ? '#10B981' : '#EF4444' },
        ].map((stat, i) => (
          <div key={i} style={{ flex: 1, padding: '12px 14px', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
              <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setView(f.key)} style={{
              ...mono, fontSize: 8.5, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              background: view === f.key ? `${f.color}16` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${view === f.key ? f.color + '40' : 'rgba(255,255,255,0.07)'}`,
              color: view === f.key ? f.color : 'rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {f.label}
              {f.count !== undefined && (
                <span style={{ background: view === f.key ? `${f.color}20` : 'rgba(255,255,255,0.06)', borderRadius: 99, padding: '1px 5px', fontSize: 7 }}>
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {CHANNEL_FILTERS.map(f => (
            <button key={f.key} onClick={() => setChannelFilter(f.key)} style={{
              ...mono, fontSize: 7.5, padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 700,
              background: channelFilter === f.key ? `${f.color}14` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${channelFilter === f.key ? f.color + '35' : 'rgba(255,255,255,0.06)'}`,
              color: channelFilter === f.key ? f.color : 'rgba(255,255,255,0.25)',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '151px 68px 80px 96px 1fr 130px 20px',
        gap: 0, paddingLeft: 3, marginBottom: 6,
      }}>
        {['Platform', 'Score', 'Setup', 'State', 'Status / Action Needed', 'Actions', ''].map(h => (
          <span key={h} style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.07em', padding: '0 8px' }}>{h}</span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {visible.length === 0 ? (
          <div style={{ padding: '28px 0', textAlign: 'center' }}>
            <span style={{ ...mono, fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>No channels match this filter</span>
          </div>
        ) : (
          visible.map(p => <PlatformRow key={p.id} platform={p} />)
        )}
      </div>

      {/* Footer legend */}
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {Object.entries(ROW_STATE_CFG).map(([state, cfg]) => {
            const Icon = cfg.icon;
            return (
              <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Icon size={9} color={cfg.color} />
                <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.25)' }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
        <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
          {readyCount}/{platforms.length} channels flight-ready
        </span>
      </div>
    </div>
  );
}
