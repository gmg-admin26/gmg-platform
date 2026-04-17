import { useState, useEffect } from 'react';
import { TrendingUp, Radio, Zap, Music } from 'lucide-react';

interface GlobalNode {
  x: number;
  y: number;
  region: string;
  participants: number;
}

interface Signal {
  id: string;
  x: number;
  y: number;
  type: 'scout' | 'artist' | 'campaign' | 'growth';
  intensity: 'weak' | 'rising' | 'breakout';
  region: string;
  detail: string;
}

const globalRegions: GlobalNode[] = [
  { x: 75, y: 35, region: 'United Kingdom', participants: 450, },
  { x: 73, y: 32, region: 'Ireland', participants: 180 },
  { x: 75, y: 30, region: 'Scotland', participants: 120 },
  { x: 25, y: 35, region: 'Canada', participants: 520 },
  { x: 35, y: 55, region: 'Mexico', participants: 280 },
  { x: 45, y: 70, region: 'Brazil', participants: 340 },
  { x: 50, y: 75, region: 'Argentina', participants: 190 },
  { x: 82, y: 75, region: 'Australia', participants: 310 },
  { x: 88, y: 45, region: 'South Korea', participants: 270 },
  { x: 78, y: 42, region: 'Japan', participants: 220 }
];

const signalDetails = [
  { detail: 'International Scout', subDetail: 'Rising Signal' },
  { detail: 'Global Campaign', subDetail: 'Breakout Phase' },
  { detail: 'Artist Discovery', subDetail: 'Early Signal' },
  { detail: 'Audience Growth', subDetail: 'Momentum Building' },
  { detail: 'Cross-Border Collaboration', subDetail: 'Active Now' }
];

export default function GlobalParticipationMap() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [hoveredSignal, setHoveredSignal] = useState<Signal | null>(null);

  useEffect(() => {
    const createSignal = () => {
      const types: Signal['type'][] = ['scout', 'artist', 'campaign', 'growth'];
      const intensities: Signal['intensity'][] = ['weak', 'rising', 'breakout'];
      const regions = globalRegions[Math.floor(Math.random() * globalRegions.length)];
      const signalInfo = signalDetails[Math.floor(Math.random() * signalDetails.length)];

      const newSignal: Signal = {
        id: Math.random().toString(36),
        x: regions.x + (Math.random() - 0.5) * 8,
        y: regions.y + (Math.random() - 0.5) * 8,
        type: types[Math.floor(Math.random() * types.length)],
        intensity: intensities[Math.floor(Math.random() * intensities.length)],
        region: regions.region,
        detail: signalInfo.detail
      };

      setSignals(prev => [...prev, newSignal]);

      setTimeout(() => {
        setSignals(prev => prev.filter(s => s.id !== newSignal.id));
      }, 7000);
    };

    const interval = setInterval(createSignal, 3000);
    createSignal();

    return () => clearInterval(interval);
  }, []);

  const getSignalColor = (type: Signal['type']) => {
    switch (type) {
      case 'scout': return '#8B5CF6';
      case 'artist': return '#EC4899';
      case 'campaign': return '#06B6D4';
      case 'growth': return '#F59E0B';
    }
  };

  const getSignalSize = (intensity: Signal['intensity']) => {
    switch (intensity) {
      case 'weak': return { size: 10, glow: 18 };
      case 'rising': return { size: 16, glow: 30 };
      case 'breakout': return { size: 22, glow: 45 };
    }
  };

  const getSignalIcon = (type: Signal['type']) => {
    switch (type) {
      case 'scout': return TrendingUp;
      case 'artist': return Music;
      case 'campaign': return Radio;
      case 'growth': return Zap;
    }
  };

  return (
    <div className="relative">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gmg-cyan/20 border border-gmg-cyan/30 mb-4 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-gmg-cyan animate-pulse"></div>
          <span className="text-xs text-gmg-cyan font-bold tracking-wider uppercase">Global Signal Network</span>
        </div>
        <p className="text-sm text-gmg-gray/60 font-light">
          International discovery activity across 10+ regions.
        </p>
      </div>

      <div className="relative w-full rounded-3xl bg-gradient-to-br from-gmg-charcoal/80 to-gmg-graphite/60 backdrop-blur-xl border border-gmg-cyan/30 overflow-hidden" style={{ aspectRatio: '2/1', boxShadow: '0 0 80px rgba(6, 182, 212, 0.2)' }}>
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(6, 182, 212, 0.3) 50px, rgba(6, 182, 212, 0.3) 51px)',
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(6, 182, 212, 0.3) 50px, rgba(6, 182, 212, 0.3) 51px)',
          }}></div>
        </div>

        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {globalRegions.map((region, i) => (
            globalRegions.slice(i + 1).map((targetRegion, j) => (
              <line
                key={`${i}-${j}`}
                x1={`${region.x}%`}
                y1={`${region.y}%`}
                x2={`${targetRegion.x}%`}
                y2={`${targetRegion.y}%`}
                stroke="rgba(6, 182, 212, 0.15)"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDuration: `${5 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              />
            ))
          ))}
        </svg>

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {globalRegions.map((node, i) => (
            <div
              key={i}
              className="absolute cursor-pointer group"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredRegion(node.region)}
              onMouseLeave={() => setHoveredRegion(null)}
            >
              <div
                className="relative rounded-full transition-all duration-500"
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#06B6D4',
                  boxShadow: '0 0 30px #06B6D4',
                  opacity: 0.7
                }}
              >
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    backgroundColor: '#06B6D4',
                    opacity: 0.5,
                    animationDuration: '3s',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              </div>

              {hoveredRegion === node.region && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/95 backdrop-blur-xl border border-gmg-cyan/50 rounded-xl px-5 py-3 whitespace-nowrap" style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)', zIndex: 100 }}>
                  <div className="text-sm font-black text-gmg-cyan mb-1">{node.region}</div>
                  <div className="text-xs text-gmg-gray/80">{node.participants} Participants</div>
                </div>
              )}
            </div>
          ))}

          {signals.map((signal) => {
            const { size, glow } = getSignalSize(signal.intensity);
            const color = getSignalColor(signal.type);
            const Icon = getSignalIcon(signal.type);

            return (
              <div
                key={signal.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${signal.x}%`,
                  top: `${signal.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                onMouseEnter={() => setHoveredSignal(signal)}
                onMouseLeave={() => setHoveredSignal(null)}
              >
                <div
                  className="rounded-full flex items-center justify-center transition-all duration-1000"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: color,
                    boxShadow: `0 0 ${glow}px ${color}`,
                    animation: signal.intensity === 'breakout' ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                  }}
                >
                  <Icon className="w-2/3 h-2/3 text-white" style={{ opacity: 0.9 }} />
                  {signal.intensity === 'rising' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: color,
                        opacity: 0.5,
                        animationDuration: '2s'
                      }}
                    />
                  )}
                </div>

                {hoveredSignal?.id === signal.id && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-black/98 backdrop-blur-xl border-2 rounded-xl px-5 py-3 whitespace-nowrap" style={{
                    borderColor: color,
                    boxShadow: `0 0 40px ${color}`,
                    zIndex: 1000
                  }}>
                    <div className="text-sm font-black mb-1" style={{ color }}>{signal.region}</div>
                    <div className="text-xs text-gmg-white font-bold mb-0.5">{signal.detail}</div>
                    <div className="text-[10px] text-gmg-gray/60 uppercase tracking-wider">{signal.intensity} signal</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl border border-gmg-cyan/40 rounded-xl px-5 py-3" style={{ zIndex: 10 }}>
          <div className="text-[10px] text-gmg-gray/60 uppercase tracking-widest mb-1 font-black">Global Reach</div>
          <div className="text-2xl font-black text-gmg-cyan">10+</div>
          <div className="text-xs text-gmg-gray/80">International Regions</div>
        </div>

        <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl border border-gmg-magenta/40 rounded-xl px-5 py-3" style={{ zIndex: 10 }}>
          <div className="text-[10px] text-gmg-gray/60 uppercase tracking-widest mb-1 font-black">Live Signals</div>
          <div className="text-2xl font-black text-gmg-magenta">{signals.length}</div>
          <div className="text-xs text-gmg-gray/80">Active Now</div>
        </div>
      </div>
    </div>
  );
}
