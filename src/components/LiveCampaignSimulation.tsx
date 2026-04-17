import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'blow-up',
    headline: 'Launching momentum campaign',
    goal: 'Blow up this song',
    target: { reach: 214000, engagement: 8.4, followers: 3800, conversion: 4.2, momentum: 94 },
  },
  {
    id: 'grow-fanbase',
    headline: 'Launching fan growth campaign',
    goal: 'Grow fanbase',
    target: { reach: 148000, engagement: 6.1, followers: 9200, conversion: 5.7, momentum: 88 },
  },
  {
    id: 'go-viral',
    headline: 'Launching viral acceleration campaign',
    goal: 'Go viral on TikTok',
    target: { reach: 184000, engagement: 11.2, followers: 4600, conversion: 3.8, momentum: 97 },
  },
];

const SIMULATION_STEPS = [
  { title: 'Analyzing audience signals',    subtext: 'Reading behavioral momentum, catalog affinity, and fan density patterns' },
  { title: 'Testing creative variations',   subtext: 'Generating hooks, edit angles, and content directions across deployment channels' },
  { title: 'Allocating budget dynamically', subtext: 'Shifting spend toward highest-converting audiences and placements' },
  { title: 'Activating platform mix',       subtext: 'Deploying campaign across short-form, paid media, and discovery surfaces' },
  { title: 'Scaling winning performance',   subtext: 'Expanding reach on top-performing segments, suppressing underperformers' },
];

const CHANNELS = ['Short-form video', 'Paid media', 'Audience expansion', 'Conversion routing', 'Retargeting'];

type MetricKey = 'reach' | 'engagement' | 'followers' | 'conversion' | 'momentum';
type Metrics   = Record<MetricKey, number>;

const ZERO_METRICS: Metrics = { reach: 0, engagement: 0, followers: 0, conversion: 0, momentum: 0 };

const METRIC_DEFS: { label: string; key: MetricKey; format: (v: number) => string; suffix?: string }[] = [
  { label: 'Audience Reach',  key: 'reach',      format: v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(Math.round(v)) },
  { label: 'Engagement Lift', key: 'engagement', format: v => v.toFixed(1), suffix: '%' },
  { label: 'Follower Growth', key: 'followers',  format: v => `+${v >= 1000 ? (v / 1000).toFixed(1) + 'K' : Math.round(v)}` },
  { label: 'Conversion Rate', key: 'conversion', format: v => v.toFixed(1), suffix: '%' },
  { label: 'Momentum Score',  key: 'momentum',   format: v => String(Math.round(v)), suffix: ' / 100' },
];

const STEP_DURATION = 900;
const SCENARIO_HOLD = 1200;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function LiveCampaignSimulation() {
  const [scenarioIdx, setScenarioIdx]       = useState(0);
  const [currentStep, setCurrentStep]       = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [done, setDone]                     = useState(false);
  const [metrics, setMetrics]               = useState<Metrics>(ZERO_METRICS);
  const [activeChannels, setActiveChannels] = useState<number[]>([]);
  const [transitioning, setTransitioning]   = useState(false);

  const stepTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef       = useRef<number>(0);
  const metricStartRef = useRef<number>(0);
  const metricFromRef  = useRef<Metrics>(ZERO_METRICS);
  const metricToRef    = useRef<Metrics>(ZERO_METRICS);

  const scenario = SCENARIOS[scenarioIdx];

  const animateMetrics = (from: Metrics, to: Metrics, duration: number) => {
    cancelAnimationFrame(frameRef.current);
    metricStartRef.current = performance.now();
    metricFromRef.current  = { ...from };
    metricToRef.current    = to;

    const tick = (now: number) => {
      const t = Math.min((now - metricStartRef.current) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setMetrics({
        reach:      lerp(metricFromRef.current.reach, to.reach, e),
        engagement: lerp(metricFromRef.current.engagement, to.engagement, e),
        followers:  lerp(metricFromRef.current.followers, to.followers, e),
        conversion: lerp(metricFromRef.current.conversion, to.conversion, e),
        momentum:   lerp(metricFromRef.current.momentum, to.momentum, e),
      });
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  const clearAllTimers = () => {
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    cancelAnimationFrame(frameRef.current);
  };

  const runStep = (idx: number, tgt: Metrics, currentMetrics: Metrics) => {
    if (idx >= SIMULATION_STEPS.length) {
      animateMetrics(currentMetrics, tgt, 800);
      setActiveChannels([0, 1, 2, 3, 4]);
      setDone(true);
      return;
    }

    setCurrentStep(idx);

    const frac = (idx + 1) / SIMULATION_STEPS.length;
    const partial: Metrics = {
      reach:      tgt.reach      * frac * (0.55 + Math.random() * 0.38),
      engagement: tgt.engagement * frac * (0.5  + Math.random() * 0.4),
      followers:  tgt.followers  * frac * (0.5  + Math.random() * 0.38),
      conversion: tgt.conversion * frac * (0.5  + Math.random() * 0.4),
      momentum:   tgt.momentum   * frac,
    };
    animateMetrics(currentMetrics, partial, STEP_DURATION * 0.6);

    if (idx >= 2) {
      setActiveChannels(prev => {
        const next = [...prev];
        if (!next.includes(idx - 2)) next.push(idx - 2);
        return next;
      });
    }

    stepTimerRef.current = setTimeout(() => {
      setCompletedSteps(prev => [...prev, idx]);
      setMetrics(prev => {
        runStep(idx + 1, tgt, prev);
        return prev;
      });
    }, STEP_DURATION);
  };

  const startScenario = (idx: number) => {
    clearAllTimers();
    setCurrentStep(-1);
    setCompletedSteps([]);
    setDone(false);
    setActiveChannels([]);
    const tgt = SCENARIOS[idx].target;
    setMetrics(ZERO_METRICS);
    stepTimerRef.current = setTimeout(() => {
      runStep(0, tgt, ZERO_METRICS);
    }, 380);
  };

  useEffect(() => {
    startScenario(0);
    return clearAllTimers;
  }, []);

  useEffect(() => {
    if (!done) return;
    const holdTimer = setTimeout(() => {
      setTransitioning(true);
      const fadeTimer = setTimeout(() => {
        const next = (scenarioIdx + 1) % SCENARIOS.length;
        setScenarioIdx(next);
        setTransitioning(false);
        startScenario(next);
      }, 400);
      return () => clearTimeout(fadeTimer);
    }, SCENARIO_HOLD);
    return () => clearTimeout(holdTimer);
  }, [done, scenarioIdx]);

  return (
    <div
      className="relative w-full max-w-[1060px] mx-auto rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #050f09 0%, #030808 50%, #020404 100%)',
        border: `1px solid ${done ? 'rgba(16,185,129,0.32)' : 'rgba(16,185,129,0.18)'}`,
        boxShadow: done
          ? '0 0 0 1px rgba(16,185,129,0.06), 0 0 120px rgba(16,185,129,0.18), 0 60px 160px rgba(0,0,0,0.9)'
          : '0 0 0 1px rgba(16,185,129,0.04), 0 0 80px rgba(16,185,129,0.1), 0 60px 140px rgba(0,0,0,0.85)',
        transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
        opacity: transitioning ? 0.4 : 1,
      }}
    >
      {/* Ambient layers */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 75% 45% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 55%)',
          animation: 'sim-breathe 5s ease-in-out infinite',
        }} />
        <div className="absolute inset-0 transition-opacity duration-700" style={{
          opacity: done ? 1 : 0,
          background: 'radial-gradient(ellipse 55% 40% at 85% 100%, rgba(16,185,129,0.08) 0%, transparent 55%)',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(16,185,129,0.032) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.032) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'sim-grid-drift 20s linear infinite',
          opacity: 0.5,
        }} />
        {!done && currentStep >= 0 && (
          <div className="absolute left-0 right-0 h-px" style={{
            background: 'linear-gradient(to right, transparent 0%, rgba(16,185,129,0.5) 50%, transparent 100%)',
            animation: 'sim-scan 3.5s linear infinite',
            top: 0,
          }} />
        )}
      </div>

      <div
        className="relative z-10 p-8 md:p-10"
        style={{ transition: 'opacity 0.4s ease', opacity: transitioning ? 0 : 1 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{
                boxShadow: '0 0 7px rgba(16,185,129,0.9)',
                animation: 'sim-pulse 1.1s ease-in-out infinite',
              }}
            />
            <p className="text-[9px] font-black tracking-[0.34em] uppercase text-emerald-400/55">
              Live Campaign Simulation
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-black tracking-tight text-white mb-3 leading-tight">
                {scenario.headline}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase text-white/30">Goal</span>
                  <span className="text-[9px] font-bold tracking-wide text-white/60">{scenario.goal}</span>
                </div>
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all duration-500"
                  style={{
                    borderColor: done ? 'rgba(16,185,129,0.3)' : 'rgba(16,185,129,0.14)',
                    background:  done ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.04)',
                  }}
                >
                  <div className="w-1 h-1 rounded-full bg-emerald-400" style={{
                    animation: 'sim-pulse 1.2s ease-in-out infinite',
                    boxShadow: '0 0 5px rgba(16,185,129,0.9)',
                  }} />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase text-emerald-400/80">
                    {done ? 'Campaign Live' : currentStep >= 0 ? 'System Running' : 'Initializing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario indicator dots */}
            <div className="flex items-center gap-2 sm:pb-1">
              {SCENARIOS.map((s, i) => (
                <div
                  key={s.id}
                  className="rounded-full transition-all duration-500"
                  style={{
                    width:   i === scenarioIdx ? 20 : 6,
                    height:  6,
                    background: i === scenarioIdx ? 'rgba(52,211,153,0.75)' : 'rgba(255,255,255,0.1)',
                    boxShadow:  i === scenarioIdx ? '0 0 8px rgba(52,211,153,0.4)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Steps — 3 cols */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-[9px] font-black tracking-[0.28em] uppercase text-white/20 mb-3">Status Rail</p>
            {SIMULATION_STEPS.map((step, i) => {
              const isActive   = currentStep === i;
              const isComplete = completedSteps.includes(i);
              return (
                <div
                  key={i}
                  className="relative rounded-xl border px-5 py-4 overflow-hidden transition-all duration-500"
                  style={{
                    borderColor: isComplete
                      ? 'rgba(16,185,129,0.2)'
                      : isActive
                      ? 'rgba(16,185,129,0.4)'
                      : 'rgba(255,255,255,0.05)',
                    background: isComplete
                      ? 'rgba(16,185,129,0.05)'
                      : isActive
                      ? 'rgba(16,185,129,0.09)'
                      : 'rgba(255,255,255,0.012)',
                    boxShadow: isActive ? '0 0 28px rgba(16,185,129,0.1)' : 'none',
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 h-[2px] rounded-full"
                      style={{
                        background: 'linear-gradient(to right, rgba(16,185,129,0.8), rgba(16,185,129,0.08))',
                        animation: `sim-step-fill ${STEP_DURATION}ms linear forwards`,
                      }}
                    />
                  )}

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      {isComplete ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500/18 border border-emerald-400/38 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border border-emerald-400/55 flex items-center justify-center" style={{ animation: 'sim-pulse 1s ease-in-out infinite' }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 6px rgba(16,185,129,1)', animation: 'sim-pulse 0.8s ease-in-out infinite' }} />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/12" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p
                          className="text-sm font-semibold transition-colors duration-300"
                          style={{ color: isComplete ? 'rgba(255,255,255,0.72)' : isActive ? '#E5E5E7' : 'rgba(255,255,255,0.22)' }}
                        >
                          {step.title}
                        </p>
                        <span
                          className="text-[7.5px] font-black tracking-[0.22em] uppercase flex-shrink-0 transition-colors duration-300"
                          style={{ color: isComplete ? 'rgba(52,211,153,0.52)' : isActive ? 'rgba(52,211,153,0.9)' : 'rgba(255,255,255,0.1)' }}
                        >
                          {isComplete ? 'DONE' : isActive ? 'RUNNING' : 'PENDING'}
                        </span>
                      </div>
                      <p
                        className="text-xs font-light leading-relaxed transition-colors duration-300"
                        style={{ color: isComplete ? 'rgba(255,255,255,0.25)' : isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.13)' }}
                      >
                        {step.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Channel deployment */}
            <div
              className="rounded-xl border px-5 py-5 mt-3 transition-all duration-500"
              style={{
                borderColor: activeChannels.length > 0 ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.05)',
                background:  activeChannels.length > 0 ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.012)',
              }}
            >
              <p className="text-[9px] font-black tracking-[0.28em] uppercase text-white/20 mb-4">Channel Deployment</p>
              <div className="flex flex-wrap gap-2">
                {CHANNELS.map((ch, i) => {
                  const isOn = activeChannels.includes(i);
                  return (
                    <div
                      key={ch}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wide transition-all duration-500"
                      style={{
                        borderColor: isOn ? 'rgba(16,185,129,0.28)' : 'rgba(255,255,255,0.06)',
                        background:  isOn ? 'rgba(16,185,129,0.09)' : 'rgba(255,255,255,0.02)',
                        color:       isOn ? 'rgba(255,255,255,0.78)' : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-400"
                        style={{
                          background:  isOn ? 'rgb(52,211,153)' : 'rgba(255,255,255,0.15)',
                          boxShadow:   isOn ? '0 0 5px rgba(16,185,129,0.9)' : 'none',
                          animation:   isOn ? 'sim-pulse 2s ease-in-out infinite' : 'none',
                        }}
                      />
                      {ch}
                      {isOn && (
                        <span className="text-[7px] font-black tracking-[0.18em] uppercase text-emerald-400/65 ml-0.5">Active</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metrics — 2 cols */}
          <div className="md:col-span-2 flex flex-col gap-2.5">
            <p className="text-[9px] font-black tracking-[0.28em] uppercase text-white/20 mb-1">Live Metrics</p>

            {METRIC_DEFS.map(({ label, key, format, suffix }) => {
              const raw       = metrics[key];
              const targetVal = scenario.target[key];
              const pct       = Math.min((raw / targetVal) * 100, 100);
              const isLive    = raw > 0.01;

              return (
                <div
                  key={key}
                  className="rounded-xl border px-4 py-4 transition-all duration-500"
                  style={{
                    borderColor: isLive ? 'rgba(16,185,129,0.14)' : 'rgba(255,255,255,0.05)',
                    background:  isLive ? 'rgba(16,185,129,0.045)' : 'rgba(255,255,255,0.012)',
                  }}
                >
                  <p className="text-[8px] font-black tracking-[0.24em] uppercase text-white/22 mb-1.5">{label}</p>
                  <p
                    className="text-xl font-black tabular-nums tracking-tight transition-colors duration-300 mb-2"
                    style={{ color: isLive ? '#E5E5E7' : 'rgba(255,255,255,0.12)' }}
                  >
                    {isLive ? (
                      <>
                        {format(raw)}
                        {suffix && <span className="text-xs font-normal text-emerald-400/55 ml-0.5">{suffix}</span>}
                      </>
                    ) : '—'}
                  </p>
                  <div className="h-px rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:      `${pct}%`,
                        background: 'linear-gradient(to right, rgba(16,185,129,0.7), rgba(52,211,153,0.3))',
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Optimization status */}
            <div
              className="rounded-xl border px-4 py-4 mt-0.5 transition-all duration-500"
              style={{
                borderColor: done ? 'rgba(16,185,129,0.32)' : currentStep >= 3 ? 'rgba(16,185,129,0.16)' : 'rgba(255,255,255,0.05)',
                background:  done ? 'rgba(16,185,129,0.09)' : currentStep >= 3 ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.012)',
              }}
            >
              <p className="text-[8px] font-black tracking-[0.24em] uppercase text-white/22 mb-2">Optimization Status</p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-400"
                  style={{
                    background:  done ? 'rgb(52,211,153)' : currentStep >= 3 ? 'rgba(52,211,153,0.6)' : 'rgba(255,255,255,0.15)',
                    boxShadow:   done ? '0 0 8px rgba(16,185,129,1)' : 'none',
                    animation:   done || currentStep >= 3 ? 'sim-pulse 1.5s ease-in-out infinite' : 'none',
                  }}
                />
                <p
                  className="text-sm font-bold transition-colors duration-400"
                  style={{ color: done ? 'rgb(52,211,153)' : currentStep >= 3 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)' }}
                >
                  {done ? 'Live & Optimizing' : currentStep >= 3 ? 'Activating...' : 'Standby'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completion block */}
        {done && (
          <div
            className="mt-8 rounded-2xl border border-emerald-500/20 p-7 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(16,185,129,0.025) 100%)',
              animation: 'sim-fade-up 0.5s ease forwards',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: 'radial-gradient(ellipse 55% 65% at 92% 100%, rgba(16,185,129,0.08) 0%, transparent 55%)' }}
            />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 10px rgba(16,185,129,1)', animation: 'sim-pulse 1.5s ease-in-out infinite' }} />
                    <h4 className="text-lg md:text-xl font-black text-white">Campaign is now running</h4>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.38)' }}>You chose the goal.</p>
                    <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.72)' }}>We run the campaign for you.</p>
                  </div>
                </div>
                <a
                  href="/get-started"
                  className="flex-shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-black text-sm text-black transition-all duration-200 hover:scale-[1.025] active:scale-[0.98]"
                  style={{
                    background:  'linear-gradient(135deg, #34d399, #10b981)',
                    boxShadow:   '0 0 28px rgba(16,185,129,0.35)',
                    whiteSpace:  'nowrap',
                  }}
                >
                  Request Access
                  <ArrowRight size={14} />
                </a>
              </div>
              <div className="pt-4 mt-4 border-t border-emerald-500/12">
                <p className="text-xs text-white/22 font-light">You did not select audiences, adjust bids, or build creatives.{' '}
                  <span className="font-bold text-white/45">The system handled the execution.</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes sim-breathe {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes sim-grid-drift {
          0%   { background-position: 0 0; }
          100% { background-position: 32px 32px; }
        }
        @keyframes sim-scan {
          0%   { transform: translateY(0); opacity: 0; }
          4%   { opacity: 1; }
          92%  { opacity: 0.55; }
          100% { transform: translateY(800px); opacity: 0; }
        }
        @keyframes sim-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        @keyframes sim-step-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes sim-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
