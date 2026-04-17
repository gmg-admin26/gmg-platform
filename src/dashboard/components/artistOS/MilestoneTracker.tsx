import { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2, Lock, ChevronRight, Zap, TrendingUp,
  MapPin, Music2, Users, Star, Gift, BarChart2,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props {
  artist: SignedArtist;
}

interface Unlock {
  icon: React.ElementType;
  label: string;
  detail: string;
  color: string;
}

interface Milestone {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  current: number;
  target: number;
  unit: string;
  formatValue: (v: number) => string;
  unlocks: Unlock[];
  completedMessage: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

function buildMilestones(artist: SignedArtist): Milestone[] {
  const preSaves = Math.round(artist.followers * 0.018 + artist.monthlyListeners * 0.004);
  const tourReadyThreshold = 250_000;

  return [
    {
      id: 'presaves',
      label: '25K Pre-Saves',
      description: 'First major release demand signal',
      icon: Music2,
      color: '#06B6D4',
      current: Math.min(preSaves, 25_000),
      target: 25_000,
      unit: 'pre-saves',
      formatValue: fmt,
      completedMessage: 'Release demand validated — label ready to green-light campaign expansion.',
      unlocks: [
        { icon: Zap, label: 'Campaign budget unlocks', detail: 'Eligible for +$15K campaign boost on next release', color: '#06B6D4' },
        { icon: BarChart2, label: 'Editorial pitch access', detail: 'Rocksteady queues Spotify editorial + DSP pitching', color: '#10B981' },
      ],
    },
    {
      id: 'monthly_listeners',
      label: '1M Monthly Listeners',
      description: 'Streaming breakout threshold',
      icon: TrendingUp,
      color: '#10B981',
      current: Math.min(artist.monthlyListeners, 1_000_000),
      target: 1_000_000,
      unit: 'monthly listeners',
      formatValue: fmt,
      completedMessage: 'Streaming breakout achieved — advance expansion and tour readiness evaluation begin.',
      unlocks: [
        { icon: Gift, label: 'Advance increase eligible', detail: 'Deal renegotiation window opens at 1M milestone', color: '#10B981' },
        { icon: Star, label: 'Priority roster tier', detail: 'Artist moves into Priority tier — full team support', color: '#F59E0B' },
      ],
    },
    {
      id: 'tour_ready',
      label: 'First Tour-Ready City',
      description: `${fmt(tourReadyThreshold)} local monthly listeners`,
      icon: MapPin,
      color: '#F59E0B',
      current: Math.min(Math.round(artist.monthlyListeners * 0.12), tourReadyThreshold),
      target: tourReadyThreshold,
      unit: 'local listeners',
      formatValue: fmt,
      completedMessage: `Top market is now tour-ready. Booking agents and promoters can be activated.`,
      unlocks: [
        { icon: MapPin, label: 'Touring operations open', detail: 'GMG ops team activates live show booking pipeline', color: '#F59E0B' },
        { icon: Users, label: 'Merch program unlocks', detail: 'Direct-to-fan merch program becomes eligible', color: '#EC4899' },
      ],
    },
  ];
}

function ProgressBar({ pct, color, animated }: { pct: number; color: string; animated: boolean }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: '0 auto 0 0',
        width: `${animated ? width : pct}%`,
        background: `linear-gradient(90deg, ${color}70, ${color})`,
        boxShadow: `0 0 10px ${color}50`,
        borderRadius: 99,
        transition: animated ? 'width 1.1s cubic-bezier(0.16,1,0.3,1)' : 'none',
      }}>
        <div style={{
          position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
          width: 8, height: 8, borderRadius: '50%',
          background: color, boxShadow: `0 0 6px ${color}`,
        }} />
      </div>
    </div>
  );
}

function UnlockChip({ unlock, revealed }: { unlock: Unlock; revealed: boolean }) {
  const Icon = unlock.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '8px 10px', borderRadius: 10,
      background: revealed ? `${unlock.color}0A` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${revealed ? `${unlock.color}20` : 'rgba(255,255,255,0.05)'}`,
      transition: 'all 0.3s ease',
      filter: revealed ? 'none' : 'blur(0px)',
    }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, background: revealed ? `${unlock.color}15` : 'rgba(255,255,255,0.04)', border: `1px solid ${revealed ? `${unlock.color}25` : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        {revealed ? <Icon size={10} color={unlock.color} /> : <Lock size={9} color="rgba(255,255,255,0.2)" />}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: revealed ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)', lineHeight: 1.2, marginBottom: 2 }}>{unlock.label}</p>
        <p style={{ margin: 0, fontSize: 9, color: revealed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)', lineHeight: 1.4 }}>
          {revealed ? unlock.detail : '— reach milestone to unlock —'}
        </p>
      </div>
    </div>
  );
}

function MilestoneCard({
  milestone, isActive, isComplete, onClick,
}: {
  milestone: Milestone;
  isActive: boolean;
  isComplete: boolean;
  onClick: () => void;
}) {
  const Icon = milestone.icon;
  const pct = Math.min(Math.round((milestone.current / milestone.target) * 100), 100);
  const remaining = milestone.target - milestone.current;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        padding: '12px 14px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
        background: isActive ? `${milestone.color}08` : 'transparent',
        border: `1px solid ${isActive ? `${milestone.color}30` : isComplete ? `${milestone.color}20` : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        position: 'relative', overflow: 'hidden', width: '100%',
      }}
    >
      {isActive && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${milestone.color}60, transparent)` }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, width: '100%' }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: isComplete ? `${milestone.color}20` : `${milestone.color}10`, border: `1px solid ${milestone.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isComplete
            ? <CheckCircle2 size={13} color={milestone.color} />
            : <Icon size={12} color={milestone.color} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: isComplete ? milestone.color : 'rgba(255,255,255,0.75)', lineHeight: 1.2 }}>{milestone.label}</p>
          <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', lineHeight: 1.3 }}>{milestone.description}</p>
        </div>
        {isComplete
          ? <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 99, background: `${milestone.color}15`, border: `1px solid ${milestone.color}30`, color: milestone.color }}>DONE</span>
          : <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: milestone.color }}>{pct}%</span>}
      </div>
      <ProgressBar pct={pct} color={milestone.color} animated />
      {!isComplete && (
        <p style={{ margin: '6px 0 0', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
          {milestone.formatValue(milestone.current)} / {milestone.formatValue(milestone.target)} · <span style={{ color: 'rgba(255,255,255,0.35)' }}>{milestone.formatValue(remaining)} to go</span>
        </p>
      )}
    </button>
  );
}

function AnimatedPct({ target }: { target: number }) {
  const [v, setV] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 900, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return <>{v}</>;
}

export default function MilestoneTracker({ artist }: Props) {
  const milestones = buildMilestones(artist);
  const [activeId, setActiveId] = useState<string>(milestones[0].id);
  const [expanded, setExpanded] = useState(false);

  const activeMilestone = milestones.find(m => m.id === activeId) ?? milestones[0];
  const isComplete = activeMilestone.current >= activeMilestone.target;
  const pct = Math.min(Math.round((activeMilestone.current / activeMilestone.target) * 100), 100);

  const nextIncomplete = milestones.find(m => m.current < m.target);

  return (
    <div style={{ marginBottom: 20 }}>
      <style>{`
        @keyframes mt-unlock { 0%{opacity:0;transform:scale(0.9)} 60%{transform:scale(1.04)} 100%{opacity:1;transform:scale(1)} }
        @keyframes mt-shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .mt-unlock-in { animation: mt-unlock 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div style={{
        background: 'rgba(13,14,17,0.95)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, overflow: 'hidden', position: 'relative',
      }}>
        {/* Top accent line keyed to active milestone */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${activeMilestone.color}40,transparent)` }} />

        {/* Header bar */}
        <button
          onClick={() => setExpanded(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: `${activeMilestone.color}14`, border: `1px solid ${activeMilestone.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={13} color={activeMilestone.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Next Milestone</span>
                {nextIncomplete && (
                  <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 99, background: `${nextIncomplete.color}12`, border: `1px solid ${nextIncomplete.color}25`, color: nextIncomplete.color }}>
                    {nextIncomplete.label}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginTop: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: activeMilestone.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <AnimatedPct target={pct} />%
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>to next milestone</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mini progress pills */}
            <div style={{ display: 'flex', gap: 4 }}>
              {milestones.map(m => {
                const mpct = Math.min(Math.round((m.current / m.target) * 100), 100);
                const done = m.current >= m.target;
                return (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${mpct}%`, background: done ? m.color : `${m.color}80`, borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: done ? m.color : 'rgba(255,255,255,0.2)' }}>{done ? '✓' : `${mpct}%`}</span>
                  </div>
                );
              })}
            </div>
            <ChevronRight size={14} color="rgba(255,255,255,0.2)"
              style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }} />
          </div>
        </button>

        {/* Active milestone highlight strip (always visible) */}
        {!expanded && (
          <div style={{ padding: '0 20px 16px' }}>
            <ProgressBar pct={pct} color={activeMilestone.color} animated />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                {activeMilestone.formatValue(activeMilestone.current)} / {activeMilestone.formatValue(activeMilestone.target)} {activeMilestone.unit}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: activeMilestone.color }}>
                {activeMilestone.formatValue(activeMilestone.target - activeMilestone.current)} remaining
              </span>
            </div>
          </div>
        )}

        {/* Expanded detail */}
        {expanded && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', animation: 'mt-unlock 0.25s ease both' }}>
            {/* Milestone selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, padding: '16px 16px 0' }}>
              {milestones.map(m => (
                <MilestoneCard
                  key={m.id}
                  milestone={m}
                  isActive={m.id === activeId}
                  isComplete={m.current >= m.target}
                  onClick={() => setActiveId(m.id)}
                />
              ))}
            </div>

            {/* Active milestone detail */}
            <div style={{ padding: '16px 16px 16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${activeMilestone.color}15`, borderRadius: 12, padding: '14px 16px' }}>
                {isComplete ? (
                  <div className="mt-unlock-in" style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <CheckCircle2 size={16} color={activeMilestone.color} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: activeMilestone.color }}>Milestone Reached</p>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{activeMilestone.completedMessage}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: activeMilestone.color }}>{pct}%</span>
                    </div>
                    <ProgressBar pct={pct} color={activeMilestone.color} animated />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, marginBottom: 14 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{activeMilestone.formatValue(activeMilestone.current)} now</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{activeMilestone.formatValue(activeMilestone.target - activeMilestone.current)} to go</span>
                    </div>

                    <p style={{ margin: '0 0 10px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Unlocks at milestone</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                      {activeMilestone.unlocks.map((u, i) => (
                        <div key={i} className={isComplete ? 'mt-unlock-in' : ''} style={{ animationDelay: `${i * 80}ms` }}>
                          <UnlockChip unlock={u} revealed={isComplete} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
