import { useState, useEffect, useRef } from 'react';
import {
  Zap, TrendingUp, MapPin, Music2, Users, Gift,
  Star, ShoppingBag, Mic2, Lock, CheckCircle2,
  ArrowRight, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface UnlockReward {
  icon: React.ElementType;
  label: string;
  color: string;
}

interface ProgressMilestone {
  id: string;
  category: string;
  label: string;
  motivator: string;
  remaining: string;
  current: number;
  target: number;
  color: string;
  glowColor: string;
  icon: React.ElementType;
  unlocks: UnlockReward[];
  completedLabel: string;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function buildMilestones(artist: SignedArtist): ProgressMilestone[] {
  const preSaveCurrent = Math.min(
    Math.round(artist.followers * 0.022 + artist.monthlyListeners * 0.005),
    25_000,
  );
  const preSaveRemaining = Math.max(25_000 - preSaveCurrent, 0);

  const listenerTarget = 1_000_000;
  const listenerCurrent = Math.min(artist.monthlyListeners, listenerTarget);
  const listenerRemaining = Math.max(listenerTarget - listenerCurrent, 0);

  const tourThreshold = 250_000;
  const tourCurrent = Math.min(Math.round(artist.monthlyListeners * 0.14), tourThreshold);
  const tourRemaining = Math.max(tourThreshold - tourCurrent, 0);
  const tourCitiesAway = Math.max(Math.ceil(tourRemaining / 40_000), 0);

  const editorialTarget = 500_000;
  const editorialCurrent = Math.min(artist.monthlyListeners, editorialTarget);
  const editorialRemaining = Math.max(editorialTarget - editorialCurrent, 0);

  const advanceTarget = 750_000;
  const advanceCurrent = Math.min(artist.monthlyListeners, advanceTarget);
  const advanceRemaining = Math.max(advanceTarget - advanceCurrent, 0);

  const merchTarget = 50_000;
  const merchCurrent = Math.min(
    Math.round(artist.instagramFollowers * 0.08 + artist.spotifyFollowers * 0.04),
    merchTarget,
  );
  const merchRemaining = Math.max(merchTarget - merchCurrent, 0);

  return [
    {
      id: 'presaves',
      category: 'RELEASE SIGNAL',
      label: '25K Pre-Saves',
      motivator: preSaveCurrent >= 25_000
        ? 'Release demand validated'
        : `${fmt(preSaveRemaining)} pre-saves remaining`,
      remaining: preSaveCurrent >= 25_000 ? '0 remaining' : `${fmt(preSaveRemaining)} to go`,
      current: preSaveCurrent,
      target: 25_000,
      color: '#06B6D4',
      glowColor: 'rgba(6,182,212,0.35)',
      icon: Music2,
      completedLabel: 'Campaign budget expanded',
      unlocks: [
        { icon: Zap,      label: 'Campaign budget expanded',     color: '#06B6D4' },
        { icon: Star,     label: 'Editorial pitch queued',        color: '#10B981' },
      ],
    },
    {
      id: 'monthly_listeners',
      category: 'STREAMING BREAKOUT',
      label: '1M Monthly Listeners',
      motivator: listenerCurrent >= listenerTarget
        ? 'Streaming breakout achieved'
        : `${fmt(listenerRemaining)} monthly listeners to unlock priority budget lane`,
      remaining: listenerCurrent >= listenerTarget ? '0 remaining' : `${fmt(listenerRemaining)} away`,
      current: listenerCurrent,
      target: listenerTarget,
      color: '#10B981',
      glowColor: 'rgba(16,185,129,0.35)',
      icon: TrendingUp,
      completedLabel: 'Advance limit increased',
      unlocks: [
        { icon: Gift,  label: 'Advance limit increased',     color: '#10B981' },
        { icon: Users, label: 'Priority roster tier active', color: '#F59E0B' },
      ],
    },
    {
      id: 'tour_ready',
      category: 'LIVE ACTIVATION',
      label: 'Tour-Ready Routing',
      motivator: tourCurrent >= tourThreshold
        ? 'First market tour-ready'
        : tourCitiesAway <= 2
          ? `${tourCitiesAway} city${tourCitiesAway !== 1 ? 'ies' : ''} away from tour-ready routing`
          : `${fmt(tourRemaining)} local listeners to activate tour routing`,
      remaining: tourCurrent >= tourThreshold ? 'Activated' : `${fmt(tourRemaining)} to threshold`,
      current: tourCurrent,
      target: tourThreshold,
      color: '#F59E0B',
      glowColor: 'rgba(245,158,11,0.35)',
      icon: MapPin,
      completedLabel: 'Tour routing activated',
      unlocks: [
        { icon: MapPin,      label: 'Tour routing activated',    color: '#F59E0B' },
        { icon: ShoppingBag, label: 'Merch program unlocked',    color: '#EC4899' },
      ],
    },
    {
      id: 'editorial',
      category: 'EDITORIAL READINESS',
      label: 'Editorial Threshold',
      motivator: editorialCurrent >= editorialTarget
        ? 'Editorial readiness confirmed'
        : `${fmt(editorialRemaining)} streams to editorial readiness threshold`,
      remaining: editorialCurrent >= editorialTarget ? 'Reached' : `${fmt(editorialRemaining)} away`,
      current: editorialCurrent,
      target: editorialTarget,
      color: '#EC4899',
      glowColor: 'rgba(236,72,153,0.35)',
      icon: Mic2,
      completedLabel: 'Creator seeding unlocked',
      unlocks: [
        { icon: Zap,  label: 'Creator seeding unlocked',    color: '#EC4899' },
        { icon: Star, label: 'Press campaign greenlit',     color: '#F59E0B' },
      ],
    },
    {
      id: 'advance_expand',
      category: 'FINANCIAL MILESTONE',
      label: 'Advance Expansion Threshold',
      motivator: advanceCurrent >= advanceTarget
        ? 'Payout expansion eligible'
        : `${fmt(advanceRemaining)} monthly listeners to advance expansion threshold`,
      remaining: advanceCurrent >= advanceTarget ? 'Eligible' : `${fmt(advanceRemaining)} away`,
      current: advanceCurrent,
      target: advanceTarget,
      color: '#A78BFA',
      glowColor: 'rgba(167,139,250,0.35)',
      icon: Gift,
      completedLabel: 'Advance expansion eligible',
      unlocks: [
        { icon: Gift, label: 'Advance expansion eligible',   color: '#A78BFA' },
        { icon: Zap,  label: 'Deal renegotiation window',    color: '#06B6D4' },
      ],
    },
    {
      id: 'merch_intent',
      category: 'FAN ECONOMY',
      label: 'Merch-Intent Threshold',
      motivator: merchCurrent >= merchTarget
        ? 'Fan club launch recommended'
        : `${fmt(merchRemaining)} engagement signals to merch-intent threshold`,
      remaining: merchCurrent >= merchTarget ? 'Reached' : `${fmt(merchRemaining)} to go`,
      current: merchCurrent,
      target: merchTarget,
      color: '#FB923C',
      glowColor: 'rgba(251,146,60,0.35)',
      icon: ShoppingBag,
      completedLabel: 'Fan club launch recommended',
      unlocks: [
        { icon: ShoppingBag, label: 'Fan club launch recommended', color: '#FB923C' },
        { icon: Users,       label: 'D2C merch store activated',   color: '#10B981' },
      ],
    },
  ];
}

function AnimatedCount({ target, duration = 900 }: { target: number; duration?: number }) {
  const [v, setV] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setV(Math.round(ease * target));
      if (p < 1) raf.current = requestAnimationFrame(step);
    }
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return <>{v}</>;
}

function SegmentedBar({ pct, color, glowColor, isNear }: { pct: number; color: string; glowColor: string; isNear: boolean }) {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ position: 'relative', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'visible' }}>
      <div style={{
        position: 'absolute', inset: '0 auto 0 0', height: '100%',
        width: animated ? `${pct}%` : '0%',
        background: `linear-gradient(90deg, ${color}60, ${color})`,
        borderRadius: 99,
        boxShadow: isNear ? `0 0 16px ${glowColor}, 0 0 30px ${glowColor}` : `0 0 8px ${glowColor}`,
        transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
      }}>
        {pct > 5 && (
          <div style={{
            position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)',
            width: 12, height: 12, borderRadius: '50%',
            background: color,
            boxShadow: isNear ? `0 0 10px ${color}, 0 0 20px ${glowColor}` : `0 0 6px ${color}`,
            border: `2px solid rgba(0,0,0,0.5)`,
          }} />
        )}
      </div>
      {pct < 100 && (
        <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Lock size={5} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        </div>
      )}
    </div>
  );
}

function MilestoneRow({
  milestone, isActive, onClick,
}: {
  milestone: ProgressMilestone;
  isActive: boolean;
  onClick: () => void;
}) {
  const pct = Math.min(Math.round((milestone.current / milestone.target) * 100), 100);
  const isComplete = milestone.current >= milestone.target;
  const isNear = pct >= 75 && !isComplete;
  const Icon = milestone.icon;

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        textAlign: 'left',
        transition: 'background 0.15s ease',
        ...(isActive ? { background: `${milestone.color}06` } : {}),
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isComplete ? `${milestone.color}20` : `${milestone.color}0E`,
        border: `1px solid ${isActive || isComplete ? `${milestone.color}35` : 'rgba(255,255,255,0.07)'}`,
        boxShadow: isNear ? `0 0 10px ${milestone.glowColor}` : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        {isComplete
          ? <CheckCircle2 size={12} color={milestone.color} />
          : <Icon size={11} color={isActive ? milestone.color : 'rgba(255,255,255,0.3)'} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: isActive ? milestone.color : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>
            {milestone.category}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color: isComplete ? milestone.color : isActive ? milestone.color : 'rgba(255,255,255,0.3)' }}>
            {isComplete ? 'DONE' : `${pct}%`}
          </span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            width: `${pct}%`,
            background: isComplete ? milestone.color : `linear-gradient(90deg,${milestone.color}50,${milestone.color})`,
            boxShadow: isNear ? `0 0 8px ${milestone.glowColor}` : 'none',
            transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>
    </button>
  );
}

function UnlockCard({ reward, revealed, delay }: { reward: UnlockReward; revealed: boolean; delay: number }) {
  const Icon = reward.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 10,
      background: revealed ? `${reward.color}0C` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${revealed ? `${reward.color}25` : 'rgba(255,255,255,0.05)'}`,
      animation: revealed ? `nmm-unlock 0.45s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both` : 'none',
      transition: 'background 0.3s, border-color 0.3s',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 7, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: revealed ? `${reward.color}18` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${revealed ? `${reward.color}30` : 'rgba(255,255,255,0.07)'}`,
      }}>
        {revealed ? <Icon size={10} color={reward.color} /> : <Lock size={9} color="rgba(255,255,255,0.2)" />}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 600,
        color: revealed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
        lineHeight: 1.3,
      }}>
        {revealed ? reward.label : '— locked —'}
      </span>
    </div>
  );
}

export default function NextMilestoneModule({ artist }: { artist: SignedArtist }) {
  const milestones = buildMilestones(artist);
  const nextIncomplete = milestones.find(m => m.current < m.target) ?? milestones[0];
  const [activeId, setActiveId] = useState(nextIncomplete.id);
  const [showAll, setShowAll] = useState(false);

  const active = milestones.find(m => m.id === activeId) ?? nextIncomplete;
  const pct = Math.min(Math.round((active.current / active.target) * 100), 100);
  const isComplete = active.current >= active.target;
  const isNear = pct >= 75 && !isComplete;
  const ActiveIcon = active.icon;

  const completedCount = milestones.filter(m => m.current >= m.target).length;

  return (
    <div style={{ marginBottom: 20 }}>
      <style>{`
        @keyframes nmm-unlock {
          0%  { opacity:0; transform:scale(0.85) translateY(4px); }
          60% { transform:scale(1.04) translateY(-1px); }
          100%{ opacity:1; transform:scale(1) translateY(0); }
        }
        @keyframes nmm-pulse-ring {
          0%   { transform:scale(1); opacity:0.6; }
          100% { transform:scale(1.9); opacity:0; }
        }
        @keyframes nmm-scan-line {
          0%   { transform:translateX(-100%); }
          100% { transform:translateX(500%); }
        }
        @keyframes nmm-glow-pulse {
          0%,100% { opacity:0.5; }
          50%     { opacity:1; }
        }
        .nmm-near-glow { animation: nmm-glow-pulse 2s ease-in-out infinite; }
      `}</style>

      <div style={{
        background: '#0A0B0F',
        border: `1px solid ${isNear ? `${active.color}35` : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: isNear ? `0 0 40px ${active.glowColor}` : 'none',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      }}>

        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${active.color}70, transparent)`,
          overflow: 'hidden',
        }}>
          <div className="nmm-scan-line" style={{
            position: 'absolute', top: 0, bottom: 0, width: '20%',
            background: `linear-gradient(90deg,transparent,${active.color},transparent)`,
            animation: 'nmm-scan-line 3s linear infinite',
          }} />
        </div>

        {/* ── HERO SECTION ── */}
        <div style={{ padding: '20px 20px 16px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>

          <div>
            {/* Label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${active.color}14`,
                  border: `1px solid ${active.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isNear ? `0 0 14px ${active.glowColor}` : 'none',
                  transition: 'box-shadow 0.4s ease',
                }}>
                  <ActiveIcon size={14} color={active.color} />
                </div>
                {isNear && (
                  <div style={{
                    position: 'absolute', inset: -3, borderRadius: 13,
                    border: `1px solid ${active.color}`,
                    animation: 'nmm-pulse-ring 2s ease-out infinite',
                  }} />
                )}
              </div>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700, display: 'block' }}>
                  {active.category} · Next Milestone
                </span>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  {active.label}
                </span>
              </div>
            </div>

            {/* Motivator message */}
            <p style={{
              margin: '0 0 14px',
              fontSize: 13, fontWeight: 500, lineHeight: 1.5,
              color: isComplete ? active.color : isNear ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)',
              fontStyle: isComplete ? 'normal' : 'normal',
            }}>
              {isComplete ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color={active.color} style={{ flexShrink: 0 }} />
                  {active.completedLabel}
                </span>
              ) : active.motivator}
            </p>

            {/* Progress bar */}
            <SegmentedBar pct={pct} color={active.color} glowColor={active.glowColor} isNear={isNear} />

            {/* Progress label row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 7 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 20, fontWeight: 900, color: active.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <AnimatedCount target={pct} />%
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>complete</span>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: isNear ? active.color : 'rgba(255,255,255,0.3)', fontWeight: isNear ? 700 : 400 }}>
                {isComplete ? 'MILESTONE REACHED' : active.remaining}
              </span>
            </div>
            {!isComplete && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '7px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: active.color, flexShrink: 0, animation: 'nmm-glow-pulse 2.2s ease-in-out infinite', boxShadow: `0 0 5px ${active.color}` }} />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                  {isNear
                    ? `System is close — hitting this target unlocks ${active.unlocks[0]?.label.toLowerCase() ?? 'next capability'}`
                    : `${active.unlocks.map(u => u.label).join(' + ')} locked until this milestone is reached`}
                </span>
              </div>
            )}
          </div>

          {/* Right side: unlocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: isComplete ? active.color : 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: isComplete ? 700 : 400 }}>
                {isComplete ? 'UNLOCKED' : 'Locks Unlocking At'}
              </span>
              {!isComplete && <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.1)' }}>· {100 - pct}% away</span>}
            </div>
            {active.unlocks.map((u, i) => (
              <UnlockCard key={i} reward={u} revealed={isComplete} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* ── PROGRESS STACK / TOGGLE ── */}
        <button
          onClick={() => setShowAll(v => !v)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 20px', background: 'none', border: 'none', cursor: 'pointer',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {milestones.map(m => {
                const mpct = Math.min(Math.round((m.current / m.target) * 100), 100);
                const done = m.current >= m.target;
                const isThisNear = mpct >= 75 && !done;
                return (
                  <div key={m.id} style={{ position: 'relative' }}>
                    <div style={{
                      width: 28, height: 4, borderRadius: 99,
                      background: done ? m.color : `${m.color}22`,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: `${mpct}%`, borderRadius: 99,
                        background: done ? m.color : `${m.color}80`,
                        boxShadow: isThisNear ? `0 0 6px ${m.glowColor}` : 'none',
                        transition: 'width 1s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
              {completedCount} / {milestones.length} milestones reached
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
              {showAll ? 'Collapse' : 'All milestones'}
            </span>
            {showAll
              ? <ChevronUp size={11} color="rgba(255,255,255,0.2)" />
              : <ChevronDown size={11} color="rgba(255,255,255,0.2)" />}
          </div>
        </button>

        {/* ── ALL MILESTONES STACK ── */}
        {showAll && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', animation: 'nmm-unlock 0.2s ease both' }}>
            {milestones.map(m => (
              <MilestoneRow
                key={m.id}
                milestone={m}
                isActive={m.id === activeId}
                onClick={() => setActiveId(m.id)}
              />
            ))}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
              <button
                onClick={() => { setShowAll(false); setActiveId(activeId); }}
                style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: active.color }}>View active milestone</span>
                <ArrowRight size={10} color={active.color} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
