import { useState, useEffect, useRef } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Activity, Users,
  Radio, Zap, ChevronDown, ChevronUp, Sparkles,
  Music2, Target,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props {
  artist: SignedArtist;
}

interface Driver {
  id: string;
  label: string;
  score: number;
  weight: number;
  delta: number;
  icon: React.ElementType;
  color: string;
  summary: string;
}

function computeDrivers(artist: SignedArtist): Driver[] {
  const streamingVelocity = (() => {
    const raw = parseInt(artist.streamingDelta?.replace(/[^0-9]/g, '') ?? '0') || 0;
    const isPositive = artist.streamingDelta?.includes('+') ?? false;
    const base = Math.min(Math.round((artist.monthlyListeners / 10000000) * 60) + (isPositive ? 28 : 8), 100);
    return { score: base, delta: isPositive ? raw : -raw };
  })();

  const socialEngagement = (() => {
    const base = Math.min(Math.round((artist.fanEngagementScore / 100) * 85) + 10, 100);
    const delta = artist.fanEngagementScore >= 70 ? 5 : artist.fanEngagementScore >= 50 ? 2 : -3;
    return { score: base, delta };
  })();

  const fanGrowth = (() => {
    const raw = parseInt(artist.followerDelta?.replace(/[^0-9]/g, '') ?? '0') || 0;
    const isPos = artist.followerDelta?.includes('+') ?? false;
    const base = Math.min(Math.round((artist.followers / 5000000) * 55) + (isPos ? 25 : 5), 100);
    return { score: base, delta: isPos ? raw : -raw };
  })();

  const campaignPerformance = (() => {
    const base = artist.healthScore >= 80 ? 84 : artist.healthScore >= 65 ? 68 : artist.healthScore >= 50 ? 52 : 38;
    const delta = artist.healthScore >= 70 ? 6 : -4;
    return { score: base, delta };
  })();

  return [
    {
      id: 'streaming', label: 'Streaming Velocity', score: streamingVelocity.score,
      weight: 0.3, delta: streamingVelocity.delta,
      icon: Music2, color: '#06B6D4',
      summary: streamingVelocity.score >= 70
        ? `Monthly listeners trending ${artist.streamingDelta ?? 'up'} — catalog momentum is strong.`
        : `Growth has slowed — consider a catalog re-push or editorial campaign.`,
    },
    {
      id: 'social', label: 'Social Engagement', score: socialEngagement.score,
      weight: 0.25, delta: socialEngagement.delta,
      icon: Radio, color: '#EC4899',
      summary: socialEngagement.score >= 70
        ? `Fan engagement score of ${artist.fanEngagementScore}/100 is above the platform average.`
        : `Engagement is below target — creator-led content and nostalgia posts outperform by 4x.`,
    },
    {
      id: 'fangrowth', label: 'Fan Growth Rate', score: fanGrowth.score,
      weight: 0.25, delta: fanGrowth.delta,
      icon: Users, color: '#10B981',
      summary: fanGrowth.score >= 70
        ? `Follower base growing consistently across platforms — LATAM adding the most new fans.`
        : `Fan growth has stalled — a targeted campaign in high-signal markets could reactivate.`,
    },
    {
      id: 'campaign', label: 'Campaign Performance', score: campaignPerformance.score,
      weight: 0.2, delta: campaignPerformance.delta,
      icon: Target, color: '#F59E0B',
      summary: campaignPerformance.score >= 70
        ? `Active campaigns are converting. Ad spend return is tracking above baseline.`
        : `Campaign ROI is underperforming. Reduce broad spend — focus on highest-signal cities.`,
    },
  ];
}

function computeMomentum(drivers: Driver[]): number {
  return Math.round(
    drivers.reduce((acc, d) => acc + d.score * d.weight, 0)
  );
}

function momentumColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 65) return '#34D399';
  if (score >= 50) return '#F59E0B';
  if (score >= 35) return '#FB923C';
  return '#EF4444';
}

function momentumLabel(score: number): string {
  if (score >= 80) return 'Surging';
  if (score >= 65) return 'Building';
  if (score >= 50) return 'Stable';
  if (score >= 35) return 'Slowing';
  return 'Declining';
}

function AnimatedScore({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const dur = 1200;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return <>{value}</>;
}

function ScoreArc({ score, color }: { score: number; color: string }) {
  const size = 96;
  const cx = size / 2;
  const cy = size / 2;
  const r = 38;
  const startAngle = -220;
  const sweep = 260;
  const pct = score / 100;

  function polar(angle: number, radius: number) {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(start: number, end: number, radius: number) {
    const s = polar(start, radius);
    const e = polar(end, radius);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath   = arcPath(startAngle, startAngle + sweep, r);
  const activePath  = arcPath(startAngle, startAngle + sweep * pct, r);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="ms-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
        <filter id="ms-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" strokeLinecap="round" />
      <path d={activePath} fill="none" stroke="url(#ms-grad)" strokeWidth="5" strokeLinecap="round"
        filter="url(#ms-glow)"
        style={{ transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }} />
    </svg>
  );
}

function DriverBar({ driver, isLast }: { driver: Driver; isLast: boolean }) {
  const Icon = driver.icon;
  const isUp = driver.delta >= 0;
  return (
    <div style={{ paddingBottom: isLast ? 0 : 12, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.04)', marginBottom: isLast ? 0 : 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: `${driver.color}14`, border: `1px solid ${driver.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={10} color={driver.color} />
        </div>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{driver.label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {isUp
            ? <TrendingUp size={9} color="#10B981" />
            : <TrendingDown size={9} color="#EF4444" />}
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: driver.color, fontWeight: 700 }}>{driver.score}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>/100</span>
        </div>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden', marginBottom: 5 }}>
        <div style={{
          height: '100%', width: `${driver.score}%`, borderRadius: 3,
          background: `linear-gradient(90deg,${driver.color}70,${driver.color})`,
          boxShadow: `0 0 8px ${driver.color}40`,
          transition: 'width 0.9s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
      <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55 }}>{driver.summary}</p>
    </div>
  );
}

export default function MomentumScore({ artist }: Props) {
  const [open, setOpen] = useState(false);
  const drivers  = computeDrivers(artist);
  const score    = computeMomentum(drivers);
  const color    = momentumColor(score);
  const label    = momentumLabel(score);
  const prevRef  = useRef(score);
  const trending = score >= prevRef.current ? 'up' : score === prevRef.current ? 'flat' : 'down';

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: open ? `${color}0C` : 'rgba(255,255,255,0.025)',
          border: `1px solid ${open ? `${color}30` : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 14, cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: open ? `0 0 24px ${color}14` : 'none',
        }}
      >
        <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
          <ScoreArc score={score} color={color} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 28, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.04em', textShadow: `0 0 20px ${color}50` }}>
              <AnimatedScore target={score} />
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', lineHeight: 1 }}>/ 100</span>
          </div>
        </div>

        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Momentum Score</span>
            {open ? <ChevronUp size={9} color="rgba(255,255,255,0.25)" /> : <ChevronDown size={9} color="rgba(255,255,255,0.25)" />}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{label}</span>
            {trending === 'up'
              ? <TrendingUp size={13} color="#10B981" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.5))' }} />
              : trending === 'down'
              ? <TrendingDown size={13} color="#EF4444" style={{ filter: 'drop-shadow(0 0 4px rgba(239,68,68,0.5))' }} />
              : <Minus size={11} color="rgba(255,255,255,0.2)" />}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {drivers.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 3, height: 3, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{d.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: d.color, fontWeight: 700, marginLeft: 2 }}>{d.score}</span>
              </div>
            ))}
          </div>
        </div>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, zIndex: 100,
          background: '#0D0E11', border: `1px solid ${color}22`,
          borderRadius: 16, overflow: 'hidden',
          boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${color}14`,
          animation: 'ms-drop 0.22s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          <style>{`@keyframes ms-drop { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }`}</style>

          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${color}14`, background: `${color}06` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <Sparkles size={11} color={color} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>What's Driving This Score</span>
            </div>
            <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>
              Composite of 4 live signals · updated every 24h
            </p>
          </div>

          {/* Score summary row */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid rgba(255,255,255,0.05)`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
              <ScoreArc score={score} color={color} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color, letterSpacing: '-0.02em' }}>{label}</span>
                {trending === 'up'
                  ? <TrendingUp size={14} color="#10B981" />
                  : trending === 'down'
                  ? <TrendingDown size={14} color="#EF4444" />
                  : <Minus size={12} color="rgba(255,255,255,0.2)" />}
              </div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                {score >= 70
                  ? `${artist.name} is generating strong momentum across multiple signals. Keep spend active.`
                  : score >= 50
                  ? `Momentum is building but not yet compounding. One strong campaign could break through.`
                  : `Signals are soft. Prioritize fan re-engagement before scaling ad spend.`}
              </p>
            </div>
          </div>

          {/* Drivers */}
          <div style={{ padding: '14px 16px' }}>
            <p style={{ margin: '0 0 12px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score Breakdown</p>
            {drivers.map((d, i) => (
              <DriverBar key={d.id} driver={d} isLast={i === drivers.length - 1} />
            ))}
          </div>

          {/* Weight legend */}
          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {drivers.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: d.color }} />
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>{d.label} <span style={{ color: 'rgba(255,255,255,0.12)' }}>×{d.weight}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
