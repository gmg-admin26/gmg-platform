import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import LiveCampaignSimulation from './LiveCampaignSimulation';

const GOALS = [
  { id: 'blow-up',      label: 'Blow up this song',   speedMultiplier: 1.4, stepFocus: 0 },
  { id: 'grow-fanbase', label: 'Grow fanbase',         speedMultiplier: 1.2, stepFocus: 2 },
  { id: 'go-viral',     label: 'Go viral on TikTok',  speedMultiplier: 1.6, stepFocus: 3 },
];

const ENGINE_STEPS = [
  'Creative testing is running',
  'Budget is being reallocated',
  'Audiences are expanding',
  'Platforms are activating',
  'Performance is optimizing',
];

const BASE_AUDIENCE = 2347;
const BASE_FANS     = 842;
const PLATFORMS     = ['TikTok', 'IG Reels', 'Spotify'];

function useBurstCounter(base: number, boosted: boolean, surging: boolean) {
  const [value, setValue]     = useState(base);
  const [flicker, setFlicker] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const rate = surging ? 80 : boosted ? 220 : 1100;
    timerRef.current = setInterval(() => {
      const isBurst = Math.random() < (surging ? 0.55 : boosted ? 0.35 : 0.18);
      const delta   = isBurst
        ? Math.floor(Math.random() * (surging ? 40 : boosted ? 18 : 8) + (surging ? 12 : 4))
        : Math.floor(Math.random() * (boosted ? 5 : 2) + 1);
      setValue(v => v + delta);
      if (isBurst) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 180);
      }
    }, rate);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [boosted, surging]);

  return { value, flicker };
}

function CampaignModal({ goalId, onClose }: { goalId: string; onClose: () => void }) {
  const goal = GOALS.find(g => g.id === goalId);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8"
      style={{ animation: 'modal-overlay-in 0.25s ease forwards' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
        onClick={onClose}
      />

      {/* Outer glow ring */}
      <div
        className="absolute pointer-events-none rounded-3xl"
        style={{
          inset: '10%',
          background: 'radial-gradient(ellipse 55% 55% at 50% 50%, rgba(16,185,129,0.065) 0%, transparent 65%)',
        }}
      />

      {/* Modal window */}
      <div
        className="relative w-full max-w-[1040px] max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          animation: 'modal-scale-in 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
          boxShadow: '0 0 0 1px rgba(16,185,129,0.16), 0 0 120px rgba(16,185,129,0.14), 0 40px 120px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header bar */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-7 py-5"
          style={{
            background: 'rgba(3,10,6,0.95)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(16,185,129,0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{
              boxShadow: '0 0 8px rgba(16,185,129,1)',
              animation: 'hard-pulse 1.2s ease-in-out infinite',
            }} />
            <p className="text-[9px] font-black tracking-[0.34em] uppercase text-emerald-400/70">
              Campaign Simulation
            </p>
            {goal && (
              <>
                <span className="text-white/15 text-xs">·</span>
                <p className="text-[11px] font-semibold text-white/50">{goal.label}</p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-white/40 hover:text-white hover:border-white/25 transition-all duration-200 hover:bg-white/5"
          >
            <X size={14} />
          </button>
        </div>

        {/* Simulation content */}
        <div
          style={{
            background: 'linear-gradient(155deg, #020d06 0%, #020404 100%)',
          }}
        >
          <LiveCampaignSimulation />
        </div>
      </div>

      <style>{`
        @keyframes modal-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-scale-in {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes hard-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>,
    document.body
  );
}

export default function CampaignEngine() {
  const [hoveredGoal, setHoveredGoal] = useState<string | null>(null);
  const [activeGoal, setActiveGoal]   = useState<string | null>(null);
  const [activeStep, setActiveStep]   = useState(0);
  const [pulsingRow, setPulsingRow]   = useState<number | null>(null);
  const [surging, setSurging]         = useState(false);
  const [isVisible, setIsVisible]     = useState(false);
  const [modalGoalId, setModalGoalId] = useState<string | null>(null);

  const sectionRef    = useRef<HTMLDivElement>(null);
  const stepTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const sweepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const surgeTimerRef = useRef<ReturnType<typeof setTimeout>  | null>(null);

  const focused      = hoveredGoal ?? activeGoal;
  const focusedGoal  = GOALS.find(g => g.id === focused) ?? null;
  const isBoosted    = !!focused;
  const stepInterval = focusedGoal ? Math.round(1800 / focusedGoal.speedMultiplier) : 1800;

  const audience = useBurstCounter(BASE_AUDIENCE, isBoosted, surging);
  const fans     = useBurstCounter(BASE_FANS,     isBoosted, surging);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    stepTimerRef.current = setInterval(() => {
      setActiveStep(prev => (prev + 1) % ENGINE_STEPS.length);
    }, stepInterval);
    return () => { if (stepTimerRef.current) clearInterval(stepTimerRef.current); };
  }, [isVisible, stepInterval]);

  useEffect(() => {
    if (!isVisible) return;
    if (sweepTimerRef.current) clearInterval(sweepTimerRef.current);
    const sweepRate = surging ? 120 : isBoosted ? 220 : 400;
    let pos = 0;
    sweepTimerRef.current = setInterval(() => {
      setPulsingRow(pos);
      setTimeout(() => setPulsingRow(null), sweepRate * 0.7);
      pos = (pos + 1) % ENGINE_STEPS.length;
    }, sweepRate);
    return () => { if (sweepTimerRef.current) clearInterval(sweepTimerRef.current); };
  }, [isVisible, isBoosted, surging]);

  const triggerSurge = useCallback(() => {
    if (surgeTimerRef.current) clearTimeout(surgeTimerRef.current);
    setSurging(true);
    surgeTimerRef.current = setTimeout(() => setSurging(false), 1400);
  }, []);

  const handleGoalEnter = (id: string) => {
    setHoveredGoal(id);
    triggerSurge();
  };

  const handleGoalClick = (id: string) => {
    setActiveGoal(id);
    setModalGoalId(id);
    triggerSurge();
  };

  const centerBorder = surging
    ? 'rgba(52,211,153,0.75)'
    : isBoosted
    ? 'rgba(16,185,129,0.5)'
    : 'rgba(16,185,129,0.28)';

  const centerShadow = surging
    ? '0 0 200px rgba(16,185,129,0.55), 0 0 80px rgba(16,185,129,0.35), 0 0 30px rgba(52,211,153,0.18)'
    : isBoosted
    ? '0 0 140px rgba(16,185,129,0.38), 0 0 55px rgba(16,185,129,0.2)'
    : '0 0 90px rgba(16,185,129,0.18), 0 0 30px rgba(16,185,129,0.08)';

  const coreGlowOpacity = surging ? 0.45 : isBoosted ? 0.28 : 0.17;
  const gridSpeed       = surging ? 4    : isBoosted ? 7    : 18;

  return (
    <>
      <section ref={sectionRef} className="relative py-20 px-6 lg:px-10 overflow-hidden" style={{ background: '#020202' }}>

        {/* Section radial bloom */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 56%, rgba(16,185,129,0.065) 0%, transparent 68%)',
            opacity: surging ? 1.8 : isBoosted ? 1.2 : 1,
          }}
        />

        {/* Coarse outer grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.008) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.008) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
        }} />

        <div className="max-w-[1400px] mx-auto relative z-10">

          {/* Opening Statement */}
          <div className="relative text-center pt-4 pb-10">
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 70% 80% at 50% 40%, rgba(16,185,129,0.055) 0%, transparent 65%)',
            }} />

            <div className="relative" style={{ marginBottom: '2rem' }}>
              <p
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] mb-4 md:mb-5"
                style={{
                  color: 'rgba(255,255,255,0.22)',
                  letterSpacing: '-0.01em',
                  animation: 'reveal-line 0.7s ease forwards',
                  opacity: 0,
                  animationDelay: '0.1s',
                }}
              >
                Most platforms give you tools.
              </p>
              <p
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1]"
                style={{
                  color: '#F4F4F4',
                  letterSpacing: '-0.025em',
                  textShadow: '0 0 60px rgba(52,211,153,0.28), 0 0 120px rgba(16,185,129,0.14)',
                  animation: 'reveal-line-bright 0.7s ease forwards',
                  opacity: 0,
                  animationDelay: '0.3s',
                }}
              >
                We run the campaign for you.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mb-14">
              <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to right, transparent, rgba(16,185,129,0.25))' }} />
              <div className="inline-flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: '#34D399',
                  boxShadow: '0 0 10px rgba(52,211,153,1), 0 0 20px rgba(16,185,129,0.5)',
                  animation: 'hard-pulse 1.8s ease-in-out infinite',
                }} />
                <p className="text-[9px] font-black tracking-[0.38em] uppercase" style={{ color: 'rgba(52,211,153,0.72)' }}>
                  Campaign Engine · Live
                </p>
                <div className="w-1.5 h-1.5 rounded-full" style={{
                  background: '#34D399',
                  boxShadow: '0 0 10px rgba(52,211,153,1), 0 0 20px rgba(16,185,129,0.5)',
                  animation: 'hard-pulse 1.8s ease-in-out infinite 0.5s',
                }} />
              </div>
              <div className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(to left, transparent, rgba(16,185,129,0.25))' }} />
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] mb-7" style={{ color: '#F0F0F0' }}>
              Campaigns That<br />Run Themselves
            </h2>

            <div>
              <p className="text-base md:text-lg font-light mb-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                You choose the goal.
              </p>
              <p className="text-base md:text-lg font-bold" style={{ color: 'rgba(255,255,255,0.72)' }}>
                The system is already running.
              </p>
            </div>
          </div>

          {/* 18 / 64 / 18 three-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3.5fr_1fr] gap-4 lg:gap-5 items-stretch">

            {/* LEFT: Steer */}
            <div className="flex flex-col justify-center gap-2.5" style={{ opacity: 0.78 }}>
              <p className="text-[7px] font-black tracking-[0.4em] uppercase mb-2" style={{ color: 'rgba(52,211,153,0.32)' }}>
                Choose a Goal
              </p>

              {GOALS.map(g => {
                const isActive  = activeGoal  === g.id;
                const isHovered = hoveredGoal === g.id;
                const lit       = isActive || isHovered;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleGoalClick(g.id)}
                    onMouseEnter={() => handleGoalEnter(g.id)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    className="relative w-full text-left overflow-hidden transition-all duration-250"
                    style={{
                      borderRadius: 10,
                      padding: '14px 16px',
                      border: `1px solid ${lit ? 'rgba(16,185,129,0.42)' : 'rgba(255,255,255,0.055)'}`,
                      background: lit ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.015)',
                      boxShadow: lit ? '0 0 32px rgba(16,185,129,0.2)' : 'none',
                    }}
                  >
                    {lit && (
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(ellipse 100% 100% at 0% 50%, rgba(16,185,129,0.14) 0%, transparent 55%)',
                      }} />
                    )}
                    <div className="relative flex items-center justify-between gap-2">
                      <span className="text-[12px] font-semibold leading-snug transition-colors duration-200" style={{
                        color: lit ? '#E8E8E8' : 'rgba(255,255,255,0.34)',
                      }}>
                        {g.label}
                      </span>
                      {isActive
                        ? <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                            background: '#34D399',
                            boxShadow: '0 0 10px rgba(52,211,153,1)',
                            animation: 'hard-pulse 1s ease-in-out infinite',
                          }} />
                        : <span className="text-[7px] font-black tracking-[0.24em] uppercase flex-shrink-0 transition-colors duration-200" style={{
                            color: isHovered ? 'rgba(52,211,153,0.65)' : 'rgba(255,255,255,0.12)',
                          }}>RUN</span>
                      }
                    </div>
                  </button>
                );
              })}

              <p className="text-[8px] leading-relaxed mt-2" style={{ color: 'rgba(255,255,255,0.14)' }}>
                Click a goal to<br />launch the simulation.
              </p>
            </div>

            {/* CENTER: Power Core */}
            <div
              className="relative overflow-hidden"
              style={{
                minHeight: 520,
                borderRadius: 16,
                background: '#020d06',
                border: `1px solid ${centerBorder}`,
                boxShadow: centerShadow,
                transition: 'border-color 0.25s ease, box-shadow 0.3s ease',
              }}
            >
              {/* Fine internal grid */}
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(to right, rgba(16,185,129,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.07) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                animation: `grid-drift ${gridSpeed}s linear infinite`,
              }} />

              {/* Core energy glow */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(ellipse 80% 65% at 50% 50%, rgba(16,185,129,${coreGlowOpacity}) 0%, rgba(16,185,129,0.04) 45%, transparent 68%)`,
                animation: `core-breathe ${surging ? 0.7 : isBoosted ? 1.4 : 3.5}s ease-in-out infinite`,
                transition: 'background 0.3s ease',
              }} />

              {/* Outer bloom */}
              <div className="absolute pointer-events-none" style={{
                inset: '-40px',
                background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(16,185,129,${surging ? 0.18 : isBoosted ? 0.1 : 0.05}) 0%, transparent 55%)`,
                animation: `core-breathe ${surging ? 1 : 4}s ease-in-out infinite 0.3s`,
              }} />

              {/* Horizontal sweep */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 16 }}>
                <div
                  className="absolute left-0 right-0 h-[1px] pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, transparent 0%, rgba(52,211,153,${surging ? 0.9 : isBoosted ? 0.65 : 0.45}) 50%, transparent 100%)`,
                    animation: `energy-sweep ${surging ? 0.55 : isBoosted ? 0.9 : 1.7}s linear infinite`,
                    boxShadow: `0 0 8px rgba(52,211,153,${surging ? 0.6 : 0.3})`,
                  }}
                />
              </div>

              {/* Vertical edge bars */}
              <div className="absolute top-0 bottom-0 left-0 w-[2px] pointer-events-none" style={{
                background: `linear-gradient(to bottom, transparent 0%, rgba(52,211,153,${surging ? 0.7 : isBoosted ? 0.45 : 0.28}) 30%, rgba(52,211,153,${surging ? 0.7 : isBoosted ? 0.45 : 0.28}) 70%, transparent 100%)`,
                boxShadow: `2px 0 12px rgba(52,211,153,${surging ? 0.4 : 0.15})`,
                transition: 'all 0.3s ease',
              }} />
              <div className="absolute top-0 bottom-0 right-0 w-[2px] pointer-events-none" style={{
                background: `linear-gradient(to bottom, transparent 0%, rgba(52,211,153,${surging ? 0.7 : isBoosted ? 0.45 : 0.28}) 30%, rgba(52,211,153,${surging ? 0.7 : isBoosted ? 0.45 : 0.28}) 70%, transparent 100%)`,
                boxShadow: `-2px 0 12px rgba(52,211,153,${surging ? 0.4 : 0.15})`,
                transition: 'all 0.3s ease',
              }} />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 flex flex-col h-full" style={{ minHeight: 520 }}>

                {/* Header bar */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="relative w-2.5 h-2.5 flex-shrink-0">
                      <div className="absolute inset-0 rounded-full" style={{
                        background: '#34D399',
                        animation: 'ping-hard 1.4s ease-out infinite',
                        opacity: 0,
                      }} />
                      <div className="absolute inset-0 rounded-full" style={{
                        background: '#34D399',
                        boxShadow: '0 0 14px rgba(52,211,153,1), 0 0 28px rgba(16,185,129,0.6)',
                        animation: 'hard-pulse 1.2s ease-in-out infinite',
                      }} />
                    </div>
                    <p className="text-[9px] font-black tracking-[0.38em] uppercase" style={{ color: 'rgba(52,211,153,0.82)' }}>
                      Live Campaign Engine
                    </p>
                  </div>
                  <div
                    className="text-[8px] font-black tracking-[0.24em] uppercase px-3 py-1.5 transition-all duration-300"
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${surging ? 'rgba(52,211,153,0.75)' : isBoosted ? 'rgba(52,211,153,0.5)' : 'rgba(16,185,129,0.3)'}`,
                      color: surging ? '#34D399' : isBoosted ? 'rgba(52,211,153,0.95)' : 'rgba(52,211,153,0.7)',
                      background: surging ? 'rgba(16,185,129,0.22)' : isBoosted ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.08)',
                      boxShadow: surging ? '0 0 20px rgba(16,185,129,0.35)' : 'none',
                    }}
                  >
                    {surging ? 'Surging' : isBoosted ? 'Accelerating' : 'Running'}
                  </div>
                </div>

                {/* Steps */}
                <div className="flex-1 flex flex-col justify-center gap-2.5">
                  {ENGINE_STEPS.map((step, i) => {
                    const isCurrent  = activeStep === i;
                    const isPast     = i < activeStep;
                    const isFocused  = focusedGoal?.stepFocus === i;
                    const isSweeping = pulsingRow === i;

                    const rowBg = isCurrent
                      ? `rgba(16,185,129,${surging ? 0.22 : 0.15})`
                      : isSweeping
                      ? 'rgba(16,185,129,0.09)'
                      : isFocused
                      ? 'rgba(16,185,129,0.07)'
                      : isPast
                      ? 'rgba(16,185,129,0.03)'
                      : 'rgba(16,185,129,0.018)';

                    const rowBorder = isCurrent
                      ? `rgba(52,211,153,${surging ? 0.65 : 0.48})`
                      : isSweeping
                      ? 'rgba(52,211,153,0.28)'
                      : isFocused
                      ? 'rgba(16,185,129,0.28)'
                      : isPast
                      ? 'rgba(16,185,129,0.13)'
                      : 'rgba(16,185,129,0.07)';

                    const rowShadow = isCurrent
                      ? `0 0 ${surging ? 70 : 50}px rgba(16,185,129,${surging ? 0.35 : 0.22}), inset 0 0 0 1px rgba(52,211,153,0.05)`
                      : isSweeping
                      ? '0 0 25px rgba(16,185,129,0.12)'
                      : 'none';

                    const textColor = isCurrent
                      ? '#FFFFFF'
                      : isFocused
                      ? 'rgba(255,255,255,0.62)'
                      : isPast
                      ? 'rgba(255,255,255,0.32)'
                      : 'rgba(255,255,255,0.16)';

                    return (
                      <div
                        key={step}
                        className="relative overflow-hidden transition-all duration-300"
                        style={{
                          borderRadius: 10,
                          padding: isCurrent ? '17px 22px' : '12px 22px',
                          border: `1px solid ${rowBorder}`,
                          background: rowBg,
                          boxShadow: rowShadow,
                        }}
                      >
                        {isCurrent && (
                          <div
                            className="absolute bottom-0 left-0 h-[2px]"
                            style={{
                              background: surging
                                ? 'linear-gradient(to right, rgba(52,211,153,1), rgba(52,211,153,0.2))'
                                : 'linear-gradient(to right, rgba(52,211,153,0.9), rgba(16,185,129,0.15))',
                              animation: `step-fill ${stepInterval}ms linear forwards`,
                              boxShadow: '0 0 8px rgba(52,211,153,0.6)',
                            }}
                          />
                        )}
                        {isCurrent && (
                          <div className="absolute inset-y-0 left-0 w-[3px]" style={{
                            background: 'linear-gradient(to bottom, rgba(52,211,153,0.9), rgba(16,185,129,0.3))',
                            boxShadow: '0 0 16px rgba(52,211,153,0.9)',
                          }} />
                        )}

                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {isCurrent ? (
                              <div className="relative w-2.5 h-2.5">
                                <div className="absolute inset-0 rounded-full" style={{
                                  background: '#34D399',
                                  animation: 'ping-hard 1.2s ease-out infinite',
                                  opacity: 0,
                                }} />
                                <div className="absolute inset-0 rounded-full" style={{
                                  background: '#34D399',
                                  boxShadow: '0 0 14px rgba(52,211,153,1), 0 0 30px rgba(16,185,129,0.7)',
                                  animation: `hard-pulse ${surging ? 0.5 : 0.85}s ease-in-out infinite`,
                                }} />
                              </div>
                            ) : isFocused ? (
                              <div className="w-2 h-2 rounded-full" style={{
                                background: 'rgba(52,211,153,0.65)',
                                boxShadow: '0 0 8px rgba(52,211,153,0.5)',
                                animation: 'hard-pulse 1.8s ease-in-out infinite',
                              }} />
                            ) : isPast ? (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.35)' }} />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)' }} />
                            )}
                          </div>

                          <span className="flex-1 font-semibold transition-all duration-250" style={{
                            fontSize: isCurrent ? '15px' : '12.5px',
                            color: textColor,
                            letterSpacing: isCurrent ? '-0.01em' : '0.01em',
                            fontWeight: isCurrent ? 700 : 500,
                          }}>
                            {step}
                          </span>

                          <span className="flex-shrink-0 text-[7px] font-black tracking-[0.28em] uppercase" style={{
                            color: isCurrent
                              ? surging ? '#34D399' : 'rgba(52,211,153,0.95)'
                              : isFocused
                              ? 'rgba(52,211,153,0.55)'
                              : isPast
                              ? 'rgba(52,211,153,0.28)'
                              : 'transparent',
                          }}>
                            {isCurrent ? (surging ? 'SURGE' : 'LIVE') : isFocused ? 'FOCUS' : isPast ? 'DONE' : ''}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="mt-9 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-[5px]">
                      {[0, 1, 2, 3].map(i => (
                        <div key={i} className="w-1 h-1 rounded-full" style={{
                          background: '#34D399',
                          boxShadow: '0 0 6px rgba(52,211,153,0.85)',
                          animation: `hard-pulse ${surging ? 0.4 : isBoosted ? 0.8 : 1.2}s ease-in-out infinite`,
                          animationDelay: `${i * 0.14}s`,
                          opacity: surging ? 1 : isBoosted ? 0.85 : 0.55,
                        }} />
                      ))}
                    </div>
                    <span className="text-[8px] font-black tracking-[0.28em] uppercase" style={{
                      color: surging ? 'rgba(52,211,153,0.95)' : isBoosted ? 'rgba(52,211,153,0.72)' : 'rgba(52,211,153,0.5)',
                    }}>
                      {surging ? 'System Surge' : isBoosted ? 'Accelerating' : 'Running Continuously'}
                    </span>
                  </div>
                  {focusedGoal && (
                    <span className="text-[8px] font-light tracking-wide" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {focusedGoal.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Output */}
            <div className="flex flex-col justify-center gap-3" style={{ opacity: 0.88 }}>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[7px] font-black tracking-[0.4em] uppercase" style={{ color: 'rgba(52,211,153,0.38)' }}>
                  Live Output
                </p>
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{
                  background: '#34D399',
                  boxShadow: '0 0 6px rgba(52,211,153,0.9)',
                  animation: 'hard-pulse 1.4s ease-in-out infinite',
                }} />
              </div>

              {/* Audience */}
              <div
                className="rounded-xl p-5 border transition-all duration-300"
                style={{
                  borderColor: surging ? 'rgba(52,211,153,0.38)' : isBoosted ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.14)',
                  background:  surging ? 'rgba(16,185,129,0.13)' : isBoosted ? 'rgba(16,185,129,0.09)' : 'rgba(16,185,129,0.045)',
                  boxShadow:   surging ? '0 0 35px rgba(16,185,129,0.22)' : isBoosted ? '0 0 22px rgba(16,185,129,0.12)' : 'none',
                }}
              >
                <p className="text-[7px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  Audience Growth
                </p>
                <p
                  className="text-[26px] font-black tabular-nums leading-none"
                  style={{
                    color: audience.flicker ? '#34D399' : '#F0F0F0',
                    textShadow: audience.flicker
                      ? '0 0 30px rgba(52,211,153,0.8), 0 0 60px rgba(16,185,129,0.4)'
                      : surging
                      ? '0 0 22px rgba(52,211,153,0.4)'
                      : isBoosted
                      ? '0 0 16px rgba(16,185,129,0.3)'
                      : '0 0 10px rgba(16,185,129,0.15)',
                    transition: 'color 0.08s ease, text-shadow 0.15s ease',
                  }}
                >
                  +{audience.value.toLocaleString()}
                </p>
                <div className="mt-2.5 h-[1.5px] rounded-full transition-all duration-400" style={{
                  background: 'linear-gradient(to right, rgba(52,211,153,0.65), rgba(16,185,129,0.1))',
                  width: surging ? '95%' : isBoosted ? '82%' : '58%',
                  boxShadow: surging ? '0 0 6px rgba(52,211,153,0.4)' : 'none',
                }} />
              </div>

              {/* Fans */}
              <div
                className="rounded-xl p-5 border transition-all duration-300"
                style={{
                  borderColor: surging ? 'rgba(52,211,153,0.38)' : isBoosted ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.14)',
                  background:  surging ? 'rgba(16,185,129,0.13)' : isBoosted ? 'rgba(16,185,129,0.09)' : 'rgba(16,185,129,0.045)',
                  boxShadow:   surging ? '0 0 35px rgba(16,185,129,0.22)' : isBoosted ? '0 0 22px rgba(16,185,129,0.12)' : 'none',
                }}
              >
                <p className="text-[7px] font-black tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  New Fans
                </p>
                <p
                  className="text-[26px] font-black tabular-nums leading-none"
                  style={{
                    color: fans.flicker ? '#34D399' : '#F0F0F0',
                    textShadow: fans.flicker
                      ? '0 0 30px rgba(52,211,153,0.8), 0 0 60px rgba(16,185,129,0.4)'
                      : surging
                      ? '0 0 22px rgba(52,211,153,0.4)'
                      : isBoosted
                      ? '0 0 16px rgba(16,185,129,0.3)'
                      : '0 0 10px rgba(16,185,129,0.15)',
                    transition: 'color 0.08s ease, text-shadow 0.15s ease',
                  }}
                >
                  +{fans.value.toLocaleString()}
                </p>
                <div className="mt-2.5 h-[1.5px] rounded-full transition-all duration-400" style={{
                  background: 'linear-gradient(to right, rgba(52,211,153,0.65), rgba(16,185,129,0.1))',
                  width: surging ? '88%' : isBoosted ? '72%' : '50%',
                  boxShadow: surging ? '0 0 6px rgba(52,211,153,0.4)' : 'none',
                }} />
              </div>

              {/* Platforms */}
              <div
                className="rounded-xl p-5 border transition-all duration-300"
                style={{
                  borderColor: surging ? 'rgba(52,211,153,0.38)' : isBoosted ? 'rgba(16,185,129,0.25)' : 'rgba(16,185,129,0.14)',
                  background:  surging ? 'rgba(16,185,129,0.13)' : isBoosted ? 'rgba(16,185,129,0.09)' : 'rgba(16,185,129,0.045)',
                  boxShadow:   surging ? '0 0 35px rgba(16,185,129,0.22)' : isBoosted ? '0 0 22px rgba(16,185,129,0.12)' : 'none',
                }}
              >
                <p className="text-[7px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.22)' }}>
                  Momentum Building
                </p>
                <div className="flex flex-col gap-2.5">
                  {PLATFORMS.map((p, i) => (
                    <div key={p} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{
                        background: '#34D399',
                        boxShadow: `0 0 ${surging ? 10 : 6}px rgba(52,211,153,${surging ? 1 : 0.8})`,
                        animation: `hard-pulse ${surging ? 0.6 : 1.6}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                      }} />
                      <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>{p}</span>
                      <span className="ml-auto text-[7px] font-black tracking-[0.22em] uppercase" style={{
                        color: surging ? 'rgba(52,211,153,0.88)' : 'rgba(52,211,153,0.48)',
                      }}>Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Closing statement */}
          <div className="mt-24 text-center">
            <p className="text-sm md:text-base leading-[2.4] tracking-wide">
              <span className="block font-light" style={{ color: 'rgba(255,255,255,0.18)' }}>You do not run campaigns.</span>
              <span className="block font-light" style={{ color: 'rgba(255,255,255,0.32)' }}>You set direction.</span>
              <span className="block font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>The system executes.</span>
            </p>
          </div>
        </div>

        <style>{`
          @keyframes reveal-line {
            0%   { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes reveal-line-bright {
            0%   { opacity: 0; transform: translateY(14px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes energy-sweep {
            0%   { transform: translateY(-100vh); }
            100% { transform: translateY(200vh); }
          }
          @keyframes grid-drift {
            0%   { background-position: 0 0; }
            100% { background-position: 28px 28px; }
          }
          @keyframes core-breathe {
            0%, 100% { opacity: 0.7; transform: scale(1); }
            50%       { opacity: 1;   transform: scale(1.04); }
          }
          @keyframes hard-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.45; }
          }
          @keyframes ping-hard {
            0%   { transform: scale(1);   opacity: 0.65; }
            100% { transform: scale(3.2); opacity: 0; }
          }
          @keyframes step-fill {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </section>

      {modalGoalId && (
        <CampaignModal goalId={modalGoalId} onClose={() => { setModalGoalId(null); setActiveGoal(null); }} />
      )}
    </>
  );
}
