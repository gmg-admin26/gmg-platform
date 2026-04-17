import { useEffect, useState } from 'react';
import { TrendingUp, Radio, Zap, Music } from 'lucide-react';

interface NetworkNode {
  x: number;
  y: number;
  size: 'large' | 'medium' | 'small';
  city?: string;
}

interface Signal {
  id: string;
  x: number;
  y: number;
  type: 'scout' | 'artist' | 'campaign' | 'growth';
  intensity: 'weak' | 'rising' | 'breakout';
  city: string;
  detail: string;
  timestamp: number;
}

interface Connection {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
  opacity: number;
}

type MapMode = 'campus' | 'discovery' | 'artist';

const generateUSNodes = (): NetworkNode[] => {
  const majorCities = [
    { x: 13, y: 42, size: 'large' as const, city: 'Los Angeles' },
    { x: 22, y: 35, size: 'large' as const, city: 'Phoenix' },
    { x: 32, y: 50, size: 'large' as const, city: 'Austin' },
    { x: 42, y: 48, size: 'large' as const, city: 'Nashville' },
    { x: 52, y: 45, size: 'large' as const, city: 'Atlanta' },
    { x: 80, y: 32, size: 'large' as const, city: 'New York' },
    { x: 77, y: 38, size: 'large' as const, city: 'Philadelphia' },
    { x: 43, y: 25, size: 'large' as const, city: 'Chicago' },
    { x: 13, y: 20, size: 'large' as const, city: 'Seattle' },
    { x: 10, y: 35, size: 'large' as const, city: 'San Francisco' },
    { x: 73, y: 40, size: 'large' as const, city: 'Washington DC' },
    { x: 78, y: 30, size: 'large' as const, city: 'Boston' }
  ];

  const mediumCities = Array.from({ length: 30 }, (_, i) => ({
    x: 10 + Math.random() * 70,
    y: 25 + Math.random() * 40,
    size: 'medium' as const
  }));

  const smallTowns = Array.from({ length: 260 }, (_, i) => ({
    x: 8 + Math.random() * 75,
    y: 22 + Math.random() * 50,
    size: 'small' as const
  }));

  return [...majorCities, ...mediumCities, ...smallTowns];
};

const signalData = [
  { city: 'Austin TX', detail: 'Scout Submission', subDetail: 'Momentum Rising', growth: '+180%' },
  { city: 'Nashville TN', detail: 'Campaign Activation', subDetail: 'Breakout Signal', growth: '' },
  { city: 'Los Angeles CA', detail: 'Artist Discovery', subDetail: 'Rising Signal', growth: '+240%' },
  { city: 'New York NY', detail: 'Audience Growth', subDetail: 'Strong Momentum', growth: '+320%' },
  { city: 'Atlanta GA', detail: 'Live Event', subDetail: 'Campaign Active', growth: '' },
  { city: 'Chicago IL', detail: 'Scout Network', subDetail: 'Discovery Phase', growth: '+95%' },
  { city: 'Seattle WA', detail: 'Artist Campaign', subDetail: 'Early Signal', growth: '+110%' },
  { city: 'Boston MA', detail: 'Campus Activity', subDetail: 'Scout Submission', growth: '' },
  { city: 'Philadelphia PA', detail: 'Discovery Signal', subDetail: 'Rising Artist', growth: '+165%' },
  { city: 'Phoenix AZ', detail: 'Growth Signal', subDetail: 'Breakout Phase', growth: '+280%' }
];

export default function USNetworkMap() {
  const [nodes] = useState<NetworkNode[]>(generateUSNodes());
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [mapMode, setMapMode] = useState<MapMode>('discovery');
  const [hoveredSignal, setHoveredSignal] = useState<Signal | null>(null);

  useEffect(() => {
    const createSignal = () => {
      const types: Signal['type'][] = ['scout', 'artist', 'campaign', 'growth'];
      const intensities: Signal['intensity'][] = ['weak', 'rising', 'breakout'];

      const signalInfo = signalData[Math.floor(Math.random() * signalData.length)];

      const newSignal: Signal = {
        id: Math.random().toString(36),
        x: 10 + Math.random() * 70,
        y: 25 + Math.random() * 40,
        type: types[Math.floor(Math.random() * types.length)],
        intensity: intensities[Math.floor(Math.random() * intensities.length)],
        city: signalInfo.city,
        detail: signalInfo.detail,
        timestamp: Date.now()
      };

      setSignals(prev => [...prev, newSignal]);

      setTimeout(() => {
        setSignals(prev => prev.filter(s => s.id !== newSignal.id));
      }, 8000);
    };

    const createConnection = () => {
      const connection: Connection = {
        id: Math.random().toString(36),
        x1: 10 + Math.random() * 70,
        y1: 25 + Math.random() * 40,
        x2: 10 + Math.random() * 70,
        y2: 25 + Math.random() * 40,
        type: ['scout-artist', 'campus-campaign', 'artist-growth'][Math.floor(Math.random() * 3)],
        opacity: 0.4
      };

      setConnections(prev => [...prev, connection]);

      setTimeout(() => {
        setConnections(prev => prev.filter(c => c.id !== connection.id));
      }, 6000);
    };

    const signalInterval = setInterval(createSignal, 2500);
    const connectionInterval = setInterval(createConnection, 4000);

    createSignal();
    createSignal();

    return () => {
      clearInterval(signalInterval);
      clearInterval(connectionInterval);
    };
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
      case 'weak': return { size: 12, glow: 20 };
      case 'rising': return { size: 18, glow: 35 };
      case 'breakout': return { size: 24, glow: 50 };
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

  const shouldShowNode = (node: NetworkNode) => {
    if (mapMode === 'campus') return true;
    if (mapMode === 'discovery') return node.size === 'large' || node.size === 'medium';
    if (mapMode === 'artist') return node.size === 'large';
    return true;
  };

  const shouldShowSignal = (signal: Signal) => {
    if (mapMode === 'campus') return false;
    if (mapMode === 'discovery') return signal.type === 'scout' || signal.type === 'growth';
    if (mapMode === 'artist') return signal.type === 'artist' || signal.type === 'campaign';
    return true;
  };

  return (
    <div className="relative">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gmg-violet/20 border border-gmg-violet/30 mb-4 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-gmg-violet animate-pulse"></div>
          <span className="text-xs text-gmg-violet font-bold tracking-wider uppercase">Launchpad Signal Network</span>
        </div>
        <p className="text-sm text-gmg-gray/60 font-light">
          Real discovery signals flowing through the Launchpad network.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setMapMode('campus')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
            mapMode === 'campus'
              ? 'bg-gmg-violet/30 border-2 border-gmg-violet/60 text-gmg-violet shadow-[0_0_30px_rgba(139,92,246,0.3)]'
              : 'bg-gmg-graphite/60 border border-gmg-gray/20 text-gmg-gray/60 hover:border-gmg-gray/40'
          }`}
        >
          Campus Network
        </button>
        <button
          onClick={() => setMapMode('discovery')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
            mapMode === 'discovery'
              ? 'bg-gmg-violet/30 border-2 border-gmg-violet/60 text-gmg-violet shadow-[0_0_30px_rgba(139,92,246,0.3)]'
              : 'bg-gmg-graphite/60 border border-gmg-gray/20 text-gmg-gray/60 hover:border-gmg-gray/40'
          }`}
        >
          Discovery Signals
        </button>
        <button
          onClick={() => setMapMode('artist')}
          className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
            mapMode === 'artist'
              ? 'bg-gmg-violet/30 border-2 border-gmg-violet/60 text-gmg-violet shadow-[0_0_30px_rgba(139,92,246,0.3)]'
              : 'bg-gmg-graphite/60 border border-gmg-gray/20 text-gmg-gray/60 hover:border-gmg-gray/40'
          }`}
        >
          Artist Activity
        </button>
      </div>

      <div className="relative w-full rounded-3xl bg-gradient-to-br from-gmg-charcoal/80 to-gmg-graphite/60 backdrop-blur-xl border border-gmg-violet/30 overflow-hidden" style={{ aspectRatio: '16/9', boxShadow: '0 0 80px rgba(139, 92, 246, 0.2)' }}>
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139, 92, 246, 0.3) 40px, rgba(139, 92, 246, 0.3) 41px)',
          }}></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 92, 246, 0.3) 40px, rgba(139, 92, 246, 0.3) 41px)',
          }}></div>
        </div>

        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {connections.map((conn) => (
            <line
              key={conn.id}
              x1={`${conn.x1}%`}
              y1={`${conn.y1}%`}
              x2={`${conn.x2}%`}
              y2={`${conn.y2}%`}
              stroke="rgba(139, 92, 246, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              className="transition-opacity duration-1000"
              style={{ opacity: conn.opacity }}
            >
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
            </line>
          ))}
        </svg>

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {nodes.filter(shouldShowNode).map((node, i) => {
            const sizeMap = {
              large: 16,
              medium: 8,
              small: 3
            };
            const size = sizeMap[node.size];
            const glowSize = node.size === 'large' ? 40 : node.size === 'medium' ? 20 : 8;
            const opacity = mapMode === 'campus' ? 1 : 0.3;

            return (
              <div
                key={i}
                className="absolute cursor-pointer transition-all duration-300"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity
                }}
                onMouseEnter={() => node.city && setHoveredCity(node.city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: node.size === 'large' ? '#8B5CF6' : node.size === 'medium' ? '#A78BFA' : '#C4B5FD',
                    boxShadow: `0 0 ${glowSize}px ${node.size === 'large' ? '#8B5CF6' : '#A78BFA'}`,
                    opacity: node.size === 'small' ? 0.6 : 0.9
                  }}
                >
                  {node.size === 'large' && mapMode === 'campus' && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: '#8B5CF6',
                        opacity: 0.4,
                        animationDuration: '3s'
                      }}
                    />
                  )}
                </div>

                {node.city && hoveredCity === node.city && mapMode === 'campus' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-black/95 backdrop-blur-xl border border-gmg-violet/50 rounded-xl px-4 py-2 whitespace-nowrap" style={{ boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)', zIndex: 100 }}>
                    <div className="text-xs font-black text-gmg-violet uppercase tracking-wider">{node.city}</div>
                  </div>
                )}
              </div>
            );
          })}

          {signals.filter(shouldShowSignal).map((signal) => {
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
                    <div className="text-sm font-black mb-1" style={{ color }}>{signal.city}</div>
                    <div className="text-xs text-gmg-white font-bold mb-0.5">{signal.detail}</div>
                    <div className="text-[10px] text-gmg-gray/60 uppercase tracking-wider">{signal.intensity} signal</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl border border-gmg-violet/40 rounded-xl px-5 py-3" style={{ zIndex: 20 }}>
          <div className="text-[10px] text-gmg-gray/60 uppercase tracking-widest mb-1 font-black">Network Scale</div>
          <div className="text-2xl font-black text-gmg-violet">300+</div>
          <div className="text-xs text-gmg-gray/80">Participating Campuses</div>
        </div>

        {mapMode !== 'campus' && (
          <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl border border-gmg-cyan/40 rounded-xl px-5 py-3" style={{ zIndex: 20 }}>
            <div className="text-[10px] text-gmg-gray/60 uppercase tracking-widest mb-1 font-black">Live Signals</div>
            <div className="text-2xl font-black text-gmg-cyan">{signals.length}</div>
            <div className="text-xs text-gmg-gray/80">Active Now</div>
          </div>
        )}
      </div>
    </div>
  );
}
