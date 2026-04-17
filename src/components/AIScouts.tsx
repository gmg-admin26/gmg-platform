import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio, TrendingUp, Globe, Layers, Zap } from 'lucide-react';
import GMGMotif from './GMGMotif';

const scoutTiers = [
  {
    level: 'Elite Scouts',
    description: 'Global pattern recognition across markets and culture shifts',
    color: '#06B6D4',
    bg: 'rgba(6, 182, 212, 0.08)',
    border: 'rgba(6, 182, 212, 0.2)',
    dot: 'bg-cyan-400',
  },
  {
    level: 'Master Scouts',
    description: 'Regional scene intelligence and early movement detection',
    color: '#EC4899',
    bg: 'rgba(236, 72, 153, 0.08)',
    border: 'rgba(236, 72, 153, 0.2)',
    dot: 'bg-pink-400',
  },
  {
    level: 'Senior Scouts',
    description: 'Platform-level signals across streaming, social, and engagement',
    color: '#EAB308',
    bg: 'rgba(234, 179, 8, 0.08)',
    border: 'rgba(234, 179, 8, 0.2)',
    dot: 'bg-yellow-400',
  },
  {
    level: 'Junior Scouts',
    description: 'Ground-level data collection across scenes, creators, and trends',
    color: '#10B981',
    bg: 'rgba(16, 185, 129, 0.08)',
    border: 'rgba(16, 185, 129, 0.2)',
    dot: 'bg-emerald-400',
  },
];

const signals = [
  {
    icon: TrendingUp,
    location: 'Atlanta, US',
    title: 'Artist Surge Detected',
    detail: 'Streaming velocity +340% (48h)',
    color: '#06B6D4',
    border: 'rgba(6, 182, 212, 0.25)',
    bg: 'rgba(6, 182, 212, 0.06)',
    pulse: 'rgba(6, 182, 212, 0.4)',
  },
  {
    icon: Globe,
    location: 'Lagos, NG',
    title: 'Cultural Breakout',
    detail: 'TikTok + Reels crossover spike',
    color: '#EC4899',
    border: 'rgba(236, 72, 153, 0.25)',
    bg: 'rgba(236, 72, 153, 0.06)',
    pulse: 'rgba(236, 72, 153, 0.4)',
  },
  {
    icon: Layers,
    location: 'London, UK',
    title: 'Producer Network Activity',
    detail: '3 emerging collaborations detected',
    color: '#EAB308',
    border: 'rgba(234, 179, 8, 0.25)',
    bg: 'rgba(234, 179, 8, 0.06)',
    pulse: 'rgba(234, 179, 8, 0.4)',
  },
  {
    icon: Zap,
    location: 'São Paulo, BR',
    title: 'Early Momentum',
    detail: 'Underground track entering mainstream playlists',
    color: '#10B981',
    border: 'rgba(16, 185, 129, 0.25)',
    bg: 'rgba(16, 185, 129, 0.06)',
    pulse: 'rgba(16, 185, 129, 0.4)',
  },
];

const tags = ['Cultural Signals', 'Streaming Velocity', 'Scene Growth', 'Network Activity'];

export default function AIScouts() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSignal, setActiveSignal] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % signals.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-8 lg:px-12 overflow-hidden bg-black"
    >
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 40%, #221B33 50%, #0B0B0D 100%)' }}></div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 130% 80% at 50% 50%, rgba(75,59,120,0.28) 0%, rgba(55,40,90,0.14) 40%, transparent 70%)' }}></div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.5) 100%)' }}></div>
      <GMGMotif />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <div
          className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] mb-5"
            style={{ color: '#06B6D4' }}
          >
            AI Scouts
          </span>
          <h2
            className="font-black text-[3rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[0.95] tracking-tighter mb-6 max-w-4xl"
            style={{ color: '#E5E5E7' }}
          >
            An Army of AI Scouts Mapping Music in Real Time
          </h2>
          <p
            className="text-lg md:text-xl font-light leading-relaxed max-w-3xl"
            style={{ color: 'rgba(165,168,173,0.85)' }}
          >
            Thousands of autonomous scouts analyze cultural signals, regional scenes, and artist momentum — identifying opportunities before the market reacts.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* LEFT COLUMN */}
          <div
            className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="text-base leading-relaxed mb-4" style={{ color: 'rgba(165,168,173,0.85)', fontSize: '1rem' }}>
              Each AI Scout specializes in a specific layer of the music ecosystem — from local scenes and producer networks to streaming velocity and cultural traction.
            </p>
            <p className="text-base leading-relaxed mb-10" style={{ color: 'rgba(165,168,173,0.85)', fontSize: '1rem' }}>
              Together, they form a real-time intelligence system that surfaces emerging artists, signals breakout moments, and feeds directly into Rocksteady.
            </p>

            {/* Scout tier stack */}
            <div className="space-y-3 mb-8">
              {scoutTiers.map((tier, i) => (
                <div
                  key={tier.level}
                  className="flex items-start gap-4 rounded-xl px-5 py-4 transition-all duration-300"
                  style={{
                    background: tier.bg,
                    border: `1px solid ${tier.border}`,
                    transitionDelay: `${i * 80}ms`,
                  }}
                >
                  <div
                    className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: tier.color, boxShadow: `0 0 6px ${tier.color}` }}
                  />
                  <div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: tier.color, fontSize: '0.8rem' }}>
                      {tier.level}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(165,168,173,0.7)', fontSize: '0.75rem' }}>
                      {tier.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: 'rgba(165,168,173,0.4)' }}>
              All scouts operate autonomously and report into Rocksteady.
            </p>
          </div>

          {/* RIGHT COLUMN — Dashboard card */}
          <div
            className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(8, 8, 10, 0.9)',
                border: '1px solid rgba(6, 182, 212, 0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 0 60px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
              }}
            >
              {/* Card header bar */}
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: 'rgba(6, 182, 212, 0.04)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#06B6D4' }}>
                    Rocksteady — Live Signals
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: 'rgba(6,182,212,0.6)' }}>
                    Live
                  </span>
                </div>
              </div>

              {/* Signal list */}
              <div className="p-5 space-y-3">
                {signals.map((signal, i) => {
                  const Icon = signal.icon;
                  const isActive = activeSignal === i;
                  return (
                    <div
                      key={signal.title}
                      className="rounded-xl px-4 py-4 transition-all duration-500"
                      style={{
                        background: isActive ? signal.bg : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isActive ? signal.border : 'rgba(255,255,255,0.05)'}`,
                        transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                          style={{ background: `${signal.color}15`, border: `1px solid ${signal.color}30` }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: signal.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider"
                              style={{ color: signal.color }}
                            >
                              ↑ {signal.title}
                            </span>
                            <span
                              className="text-[9px] font-medium"
                              style={{ color: 'rgba(165,168,173,0.5)' }}
                            >
                              — {signal.location}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(165,168,173,0.65)' }}>
                            {signal.detail}
                          </p>
                        </div>
                        {isActive && (
                          <div
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2 animate-pulse"
                            style={{ background: signal.pulse }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tag row */}
              <div
                className="px-5 py-3 flex flex-wrap gap-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(165,168,173,0.5)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Card footer */}
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <p className="text-[10px]" style={{ color: 'rgba(165,168,173,0.35)', fontSize: '10px' }}>
                  All signals are processed and ranked in real time inside Rocksteady.
                </p>
              </div>
            </div>

            {/* CTA under card */}
            <div className="mt-6">
              <Link
                to="/discovery"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 group"
                style={{ color: '#06B6D4' }}
              >
                Explore Rocksteady
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
