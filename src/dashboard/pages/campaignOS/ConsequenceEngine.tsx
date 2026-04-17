import { useState, useEffect } from 'react';
import {
  AlertTriangle, TrendingDown, Clock, DollarSign, Radio, Zap,
  ArrowRight, Music2, Users, Target, BarChart2, Wifi,
} from 'lucide-react';
import { mono, chip, HoverBtn, LiveDot } from './primitives';

interface LossMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  subtext?: string;
}

interface Consequence {
  id: string;
  issue: string;
  platform?: string;
  severity: 'critical' | 'high' | 'medium';
  color: string;
  timeWindowLabel: string;
  windowHours: number;
  expectedDownside: string;
  metrics: LossMetric[];
  algoNote?: string;
  cta: string;
  ctaDetail?: string;
}

const CONSEQUENCES: Consequence[] = [
  {
    id: 'c1',
    issue: 'Apple Music setup incomplete',
    platform: 'Apple Music',
    severity: 'critical',
    color: '#FA2D48',
    timeWindowLabel: '10 days remaining',
    windowHours: 10 * 24,
    expectedDownside: 'Editorial placement opportunity permanently forfeited. Platform algorithm de-prioritizes unreachable tracks on release week.',
    metrics: [
      { icon: Radio,       label: 'Streams at risk · first 30 days',  value: '~22K streams lost',     color: '#FA2D48', subtext: 'Projected from historical editorial slot data' },
      { icon: DollarSign,  label: 'Revenue exposure',                  value: '$14K potential lost',   color: '#F59E0B', subtext: 'Based on avg Apple Music per-stream rate' },
      { icon: Zap,         label: 'Editorial window closes',           value: '10-day hard deadline',  color: '#FA2D48', subtext: 'Missed deadlines are non-recoverable' },
    ],
    algoNote: 'Apple Music editorial submission window closes 10 days before release. This slot does not re-open.',
    cta: 'Complete Setup',
    ctaDetail: '~15 min to resolve',
  },
  {
    id: 'c2',
    issue: 'Creator seeding 43% below target',
    platform: 'TikTok / IG Reels',
    severity: 'critical',
    color: '#EF4444',
    timeWindowLabel: '8 days remaining',
    windowHours: 8 * 24,
    expectedDownside: 'Release week organic velocity reduced. Without seeded creator content, algorithmic discovery pools shrink by an estimated 22% on day one.',
    metrics: [
      { icon: Users,        label: 'Creator coverage gap',            value: '43% below target',      color: '#EF4444', subtext: '57 creators activated, target is 100' },
      { icon: Radio,        label: 'Organic reach loss · 7 days',     value: '~18K streams lost',     color: '#EF4444', subtext: 'Velocity impact compounds through week 2' },
      { icon: TrendingDown, label: 'Day-1 momentum impact',           value: '-22% release velocity', color: '#F59E0B', subtext: 'Algo trigger threshold at risk' },
    ],
    algoNote: 'Creators must post 48–72h before release for maximum algorithmic seeding. Window closing in 8 days.',
    cta: 'Activate Creators',
    ctaDetail: 'Rocksteady auto-matches 43 creators',
  },
  {
    id: 'c3',
    issue: 'Paid media not funded or activated',
    platform: 'Meta / YouTube Ads',
    severity: 'high',
    color: '#F59E0B',
    timeWindowLabel: '5 days to launch deadline',
    windowHours: 5 * 24,
    expectedDownside: 'Miss release-week paid amplification window entirely. Paid campaigns must be live 5 days pre-release to optimize before drop day.',
    metrics: [
      { icon: BarChart2,   label: 'Amplification coverage',          value: '0% funded',             color: '#F59E0B', subtext: '$3,500 minimum to activate' },
      { icon: Radio,       label: 'Streams at risk · release week',  value: '~9K streams lost',      color: '#F59E0B', subtext: 'Paid re-targeting compounds organic reach' },
      { icon: Target,      label: 'Pixel warm-up window',            value: 'Must launch 5 days pre', color: '#EF4444', subtext: 'Cold campaigns on drop day lose 40% efficiency' },
    ],
    algoNote: 'Paid campaigns need 5-day warm-up window before release. Launching on drop day is estimated 40% less efficient.',
    cta: 'Fund Campaign',
    ctaDetail: '$3,500 unlocks full paid stack',
  },
  {
    id: 'c4',
    issue: 'Pre-save pace below 25K target',
    platform: 'Spotify',
    severity: 'high',
    color: '#F59E0B',
    timeWindowLabel: '18 days to release',
    windowHours: 18 * 24,
    expectedDownside: 'Weaker day-1 algorithm trigger. Spotify\'s Release Radar and Discover Weekly weights are partially calculated from pre-save velocity heading into release.',
    metrics: [
      { icon: Radio,        label: 'Algorithmic reach loss',          value: '-25% to -40% day-1',    color: '#F59E0B', subtext: 'Estimated reduction vs 25K pre-save baseline' },
      { icon: DollarSign,   label: 'Revenue impact · first week',     value: '$6K potential lost',    color: '#F59E0B', subtext: 'Compounding effect across 30-day algo window' },
      { icon: Zap,          label: 'Playlist trigger at risk',        value: 'Algo signal weakened',  color: '#EF4444', subtext: 'Release Radar & Discover Weekly eligibility' },
    ],
    algoNote: 'Current pace: 11.2K pre-saves. 13,800 more needed in 18 days. Achievable with targeted push.',
    cta: 'Push Pre-Saves',
    ctaDetail: '13,800 pre-saves needed',
  },
  {
    id: 'c5',
    issue: 'Playlist pitching window not submitted',
    platform: 'Spotify Editorial',
    severity: 'high',
    color: '#06B6D4',
    timeWindowLabel: '7 days to submission deadline',
    windowHours: 7 * 24,
    expectedDownside: 'Editorial playlist consideration window missed. Spotify requires pitches 7+ days before release. Late submissions are not reviewed.',
    metrics: [
      { icon: Music2,       label: 'Editorial slots at risk',         value: '3 playlist targets',    color: '#06B6D4', subtext: 'Identified: New Music Friday, R&B Rising' },
      { icon: Radio,        label: 'Potential reach impact',          value: '50K–200K adds at risk', color: '#06B6D4', subtext: 'Dependent on editorial outcome' },
      { icon: Wifi,         label: 'Submission deadline',             value: '7-day hard deadline',   color: '#EF4444', subtext: 'Spotify does not accept late pitches' },
    ],
    algoNote: 'Spotify editorial pitch must be submitted at least 7 days before release date. Deadline is firm.',
    cta: 'Submit Pitch',
    ctaDetail: 'Takes 10 min via Spotify for Artists',
  },
  {
    id: 'c6',
    issue: 'No pre-release content calendar locked',
    platform: 'Instagram / TikTok',
    severity: 'medium',
    color: '#8B5CF6',
    timeWindowLabel: '14 days to release',
    windowHours: 14 * 24,
    expectedDownside: 'Without a structured pre-release content cadence, audience priming is weak. Release day awareness is 30–50% lower without 2-week runway content.',
    metrics: [
      { icon: Users,        label: 'Audience priming coverage',       value: '0% planned',            color: '#8B5CF6', subtext: 'Zero scheduled posts in the 2-week window' },
      { icon: TrendingDown, label: 'Release day awareness impact',    value: '-30% to -50%',          color: '#8B5CF6', subtext: 'Estimated vs campaigns with content runway' },
      { icon: BarChart2,    label: 'Story/post sequence',             value: '8 posts recommended',   color: '#8B5CF6', subtext: '4 IG posts + 4 TikToks in 14 days' },
    ],
    algoNote: 'A structured 2-week content calendar is correlated with 38% higher release week engagement on average.',
    cta: 'Build Calendar',
    ctaDetail: 'AI generates full 14-day plan',
  },
];

const SEVERITY_CFG = {
  critical: { label: 'Critical Risk',  color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)' },
  high:     { label: 'High Risk',      color: '#F59E0B', bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.18)' },
  medium:   { label: 'Medium Risk',    color: '#8B5CF6', bg: 'rgba(139,92,246,0.07)', border: 'rgba(139,92,246,0.18)' },
};

function useCountdown(totalHours: number) {
  const [remaining, setRemaining] = useState(totalHours * 3600);
  useEffect(() => {
    const t = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  return { d, h, m };
}

function CountdownBadge({ hours, color }: { hours: number; color: string }) {
  const { d, h, m } = useCountdown(hours);
  const urgent = d < 3;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 8,
      background: urgent ? `${color}14` : 'rgba(255,255,255,0.04)',
      border: `1px solid ${urgent ? color + '35' : 'rgba(255,255,255,0.08)'}`,
    }}>
      <Clock size={9} color={urgent ? color : 'rgba(255,255,255,0.3)'} />
      <span style={{ ...mono, fontSize: 9, color: urgent ? color : 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
        {d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`}
      </span>
      <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>remaining</span>
      {urgent && (
        <span style={{ ...chip(color, 7) }}>urgent</span>
      )}
    </div>
  );
}

function MetricRow({ metric }: { metric: LossMetric }) {
  const Icon = metric.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 11px', borderRadius: 9,
      background: `${metric.color}07`,
      border: `1px solid ${metric.color}14`,
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, background: `${metric.color}12`, border: `1px solid ${metric.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon size={10} color={metric.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', lineHeight: 1, marginBottom: 3 }}>{metric.label}</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: metric.color, lineHeight: 1, marginBottom: 2 }}>{metric.value}</p>
        {metric.subtext && (
          <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.22)', lineHeight: 1.4 }}>{metric.subtext}</p>
        )}
      </div>
    </div>
  );
}

function ConsequenceCard({ c }: { c: Consequence }) {
  const [hov, setHov] = useState(false);
  const [resolved, setResolved] = useState(false);
  const sc = SEVERITY_CFG[c.severity];
  const isCritical = c.severity === 'critical';

  if (resolved) {
    return (
      <div style={{
        padding: '20px', borderRadius: 16,
        background: 'rgba(16,185,129,0.05)',
        border: '1px solid rgba(16,185,129,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: 120,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={14} color="#10B981" />
        </div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#10B981' }}>Marked Resolved</p>
        <p style={{ margin: 0, ...mono, fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>Gap acknowledged · monitoring active</p>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 16,
        background: hov ? `${c.color}0C` : `${c.color}06`,
        border: `1px solid ${hov ? c.color + '40' : c.color + '20'}`,
        transition: 'all 0.25s ease',
        boxShadow: isCritical ? (hov ? `0 0 32px ${c.color}20, 0 0 0 1px ${c.color}10` : `0 0 20px ${c.color}10`) : 'none',
      }}
    >
      <style>{`
        @keyframes ceq-ring { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.8);opacity:0} }
        @keyframes ceq-glow-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes ceq-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(600%)} }
      `}</style>

      {/* Top gradient line with scan */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${c.color}70,transparent)`, overflow: 'hidden' }}>
        {isCritical && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '15%', background: `linear-gradient(90deg,transparent,${c.color},transparent)`, animation: 'ceq-scan 3s linear infinite' }} />
        )}
      </div>

      {/* Critical pulse dot */}
      {isCritical && (
        <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1.5px solid ${c.color}`, animation: 'ceq-ring 1.8s ease-out infinite', opacity: 0 }} />
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid ${c.color}50`, animation: 'ceq-ring 1.8s ease-out 0.5s infinite', opacity: 0 }} />
        </div>
      )}

      <div style={{ padding: '16px 18px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10, paddingRight: isCritical ? 22 : 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${c.color}14`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingDown size={14} color={c.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{c.issue}</span>
              <span style={{ ...chip(sc.color, 7) }}>{sc.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              {c.platform && (
                <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{c.platform}</span>
              )}
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.18)' }}>·</span>
              <span style={{ ...mono, fontSize: 7.5, color: c.color, fontWeight: 700 }}>{c.timeWindowLabel}</span>
            </div>
          </div>
        </div>

        {/* Expected downside text */}
        <div style={{
          padding: '9px 12px', borderRadius: 9, marginBottom: 11,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', ...mono, fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 6 }}>Expected downside:</span>
            {c.expectedDownside}
          </p>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 11 }}>
          {c.metrics.map((m, i) => <MetricRow key={i} metric={m} />)}
        </div>

        {/* Algo note */}
        {c.algoNote && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '8px 11px', borderRadius: 9, marginBottom: 12,
            background: `${c.color}0B`, border: `1px solid ${c.color}20`,
          }}>
            <LiveDot color={c.color} size={6} gap={3} />
            <span style={{ ...mono, fontSize: 8.5, color: c.color, lineHeight: 1.6, marginTop: 1 }}>{c.algoNote}</span>
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 14px', flexWrap: 'wrap', gap: 8,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <CountdownBadge hours={c.windowHours} color={c.color} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {c.ctaDetail && (
            <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>{c.ctaDetail}</span>
          )}
          <HoverBtn label={c.cta} color={c.color} icon={ArrowRight} sm onClick={() => setResolved(true)} />
        </div>
      </div>
    </div>
  );
}

function SummaryStrip() {
  const criticals  = CONSEQUENCES.filter(c => c.severity === 'critical');
  const highs      = CONSEQUENCES.filter(c => c.severity === 'high');
  const totalRisk  = '$38K+';

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10, alignItems: 'center',
      padding: '12px 16px', borderRadius: 12, marginBottom: 20,
      background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <AlertTriangle size={13} color="#EF4444" style={{ flexShrink: 0 }} />
        <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
          {criticals.length + highs.length} unresolved execution gaps detected ·{' '}
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>{totalRisk} revenue potential at risk</span>
          {' '}· Inaction permanently forfeits these windows
        </span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>{criticals.length}</div>
        <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>Critical</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{highs.length}</div>
        <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>High</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{totalRisk}</div>
        <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>At Risk</div>
      </div>
    </div>
  );
}

export function ConsequenceEngine() {
  return (
    <div>
      <SummaryStrip />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {CONSEQUENCES.map(c => <ConsequenceCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
