import { useState } from 'react';
import { TrendingUp, Radio, Users, Disc } from 'lucide-react';

interface SceneSignal {
  id: string;
  name: string;
  city: string;
  genre: string;
  angle: number;
  distance: number;
  strength: 'High' | 'Medium' | 'Growing';
  signals: string[];
  scouts: string[];
}

const sceneSignals: SceneSignal[] = [
  {
    id: '1',
    name: 'Austin Indie',
    city: 'Austin',
    genre: 'Indie Rock',
    angle: 25,
    distance: 75,
    strength: 'High',
    signals: ['Festival Circuit Growth', 'DIY Venue Expansion', 'Producer Migration'],
    scouts: ['Echo', 'Phoenix', 'Nova']
  },
  {
    id: '2',
    name: 'Atlanta Trap',
    city: 'Atlanta',
    genre: 'Trap',
    angle: 85,
    distance: 68,
    strength: 'High',
    signals: ['Producer Collaboration Spike', 'Studio Network Growth', 'Street Culture Momentum'],
    scouts: ['Cipher', 'Signal', 'Halo']
  },
  {
    id: '3',
    name: 'Berlin Electronic',
    city: 'Berlin',
    genre: 'Electronic',
    angle: 145,
    distance: 80,
    strength: 'High',
    signals: ['Producer Collaboration Spike', 'Club Circuit Growth', 'Playlist Momentum'],
    scouts: ['Vortex', 'Vector', 'Orbit']
  },
  {
    id: '4',
    name: 'London Alternative',
    city: 'London',
    genre: 'Alternative',
    angle: 195,
    distance: 72,
    strength: 'Medium',
    signals: ['Underground Venue Activity', 'Radio Momentum', 'Spotify Growth'],
    scouts: ['Echo', 'Riot', 'Nova']
  },
  {
    id: '5',
    name: 'Seoul Hyperpop',
    city: 'Seoul',
    genre: 'Hyperpop',
    angle: 250,
    distance: 85,
    strength: 'Growing',
    signals: ['Social Media Velocity', 'Fan Engagement Spike', 'Genre Fusion Trends'],
    scouts: ['Nexus', 'Flare', 'Phoenix']
  },
  {
    id: '6',
    name: 'Lagos Afrobeats',
    city: 'Lagos',
    genre: 'Afrobeats',
    angle: 305,
    distance: 78,
    strength: 'High',
    signals: ['Cross-Cultural Expansion', 'Global Streaming Growth', 'Artist Migration'],
    scouts: ['Pulse', 'Halo', 'Atlas']
  },
  {
    id: '7',
    name: 'Mexico City Indie Rock',
    city: 'Mexico City',
    genre: 'Indie Rock',
    angle: 345,
    distance: 70,
    strength: 'Growing',
    signals: ['Festival Growth', 'Regional Collaboration', 'Touring Circuit'],
    scouts: ['Echo', 'Atlas', 'Riot']
  },
  {
    id: '8',
    name: 'Toronto R&B',
    city: 'Toronto',
    genre: 'R&B',
    angle: 55,
    distance: 65,
    strength: 'Medium',
    signals: ['Producer Network Growth', 'Playlist Ecosystem', 'Sound Evolution'],
    scouts: ['Halo', 'Nova', 'Cipher']
  }
];

export default function CulturalRadar() {
  const [hoveredSignal, setHoveredSignal] = useState<SceneSignal | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'High':
        return 'bg-violet-400 border-violet-300';
      case 'Medium':
        return 'bg-purple-400 border-purple-300';
      case 'Growing':
        return 'bg-violet-500 border-violet-400';
      default:
        return 'bg-violet-400 border-violet-300';
    }
  };

  const getStrengthGlow = (strength: string) => {
    switch (strength) {
      case 'High':
        return 'shadow-[0_0_20px_rgba(139,92,246,0.6)]';
      case 'Medium':
        return 'shadow-[0_0_15px_rgba(168,85,247,0.5)]';
      case 'Growing':
        return 'shadow-[0_0_12px_rgba(139,92,246,0.4)]';
      default:
        return 'shadow-[0_0_20px_rgba(139,92,246,0.6)]';
    }
  };

  return (
    <section className="py-20 px-8 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
      {/* Background atmosphere with enhanced depth */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/40 rounded-full blur-[200px] animate-pulse"></div>
      </div>

      {/* Additional depth layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(139,92,246,0.2) 0px, transparent 1px, transparent 40px, rgba(139,92,246,0.2) 41px),
            repeating-linear-gradient(90deg, rgba(139,92,246,0.2) 0px, transparent 1px, transparent 40px, rgba(139,92,246,0.2) 41px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
            <Radio className="w-4 h-4 text-violet-300" />
            <span className="text-sm font-bold text-violet-200 uppercase tracking-wider">Global Intelligence System</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Cultural Radar
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Real-time global signals detecting emerging music scenes, creators, and cultural movements.
          </p>
        </div>

        {/* Radar Visualization Container - Reduced Size */}
        <div className="relative max-w-3xl mx-auto pb-8">
          {/* Radar Center */}
          <div className="relative w-full aspect-square max-w-[450px] mx-auto">
            {/* Outer rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[95%] h-[95%] rounded-full border border-violet-400/10"></div>
              <div className="absolute w-[75%] h-[75%] rounded-full border border-violet-400/10"></div>
              <div className="absolute w-[55%] h-[55%] rounded-full border border-violet-400/15"></div>
              <div className="absolute w-[35%] h-[35%] rounded-full border border-violet-400/20"></div>
            </div>

            {/* Rotating radar sweep */}
            <div className="absolute inset-0 animate-[spin_20s_linear_infinite] opacity-20">
              <div className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left bg-gradient-to-r from-violet-400 via-violet-300 to-transparent"></div>
            </div>

            {/* Center hub with enhanced glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/30 to-purple-700/30 border-2 border-violet-400/40 backdrop-blur-sm shadow-[0_0_60px_rgba(139,92,246,0.6),0_0_100px_rgba(139,92,246,0.3)]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-transparent animate-pulse"></div>
              <div className="absolute -inset-4 rounded-full bg-violet-500/10 blur-xl animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Radio className="w-6 h-6 text-violet-300" />
              </div>
            </div>

            {/* Signal points */}
            {sceneSignals.map((signal) => {
              const angleRad = (signal.angle * Math.PI) / 180;
              const radius = signal.distance;
              const x = 50 + radius * Math.cos(angleRad - Math.PI / 2);
              const y = 50 + radius * Math.sin(angleRad - Math.PI / 2);

              return (
                <div
                  key={signal.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`
                  }}
                  onMouseEnter={(e) => {
                    setHoveredSignal(signal);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPopupPosition({ x: rect.left, y: rect.top });
                  }}
                  onMouseLeave={() => {
                    setHoveredSignal(null);
                    setPopupPosition(null);
                  }}
                >
                  {/* Connection line to center */}
                  <svg
                    className="absolute top-1/2 left-1/2 pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{
                      width: `${radius * 6}px`,
                      height: `${radius * 6}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <line
                      x1="50%"
                      y1="50%"
                      x2={`${50 - (x - 50) * 6}%`}
                      y2={`${50 - (y - 50) * 6}%`}
                      stroke="rgba(139,92,246,0.3)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                  </svg>

                  {/* Signal point with pulsing animation */}
                  <div className={`relative w-4 h-4 rounded-full ${getStrengthColor(signal.strength)} border ${getStrengthGlow(signal.strength)} group-hover:scale-[1.8] transition-all duration-300`}>
                    <div className="absolute inset-0 rounded-full bg-violet-400/40 animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute -inset-2 rounded-full bg-violet-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  </div>

                  {/* City label */}
                  <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider px-2 py-1 rounded bg-black/90 border border-violet-400/40 backdrop-blur-sm shadow-lg">
                      {signal.city}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Signal Intelligence Panel */}
          {hoveredSignal && popupPosition && (
            <div
              className="fixed w-[400px] animate-[fadeIn_0.2s_ease-out] z-[100] pointer-events-none"
              style={{
                left: hoveredSignal.angle >= 90 && hoveredSignal.angle <= 270
                  ? `${popupPosition.x - 420}px`
                  : `${popupPosition.x + 20}px`,
                top: `${Math.max(20, Math.min(window.innerHeight - 500, popupPosition.y - 200))}px`
              }}
            >
              <div className="p-6 rounded-2xl bg-gradient-to-br from-black/98 via-zinc-900/98 to-black/98 border-2 border-violet-400/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(139,92,246,0.4)]">
                {/* Header */}
                <div className="mb-5 pb-4 border-b border-violet-400/20">
                  <h3 className="text-lg font-black text-white mb-1 tracking-tight">
                    {hoveredSignal.name}
                  </h3>
                  <p className="text-xs text-violet-300 font-bold uppercase tracking-wider">
                    {hoveredSignal.genre}
                  </p>
                </div>

                {/* Signal Strength */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Signal Strength</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStrengthColor(hoveredSignal.strength)} ${getStrengthGlow(hoveredSignal.strength)}`}></div>
                      <span className="text-sm font-black text-violet-300">{hoveredSignal.strength} Momentum</span>
                    </div>
                  </div>
                </div>

                {/* Signals Detected */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Signals Detected</span>
                  </div>
                  <div className="space-y-2">
                    {hoveredSignal.signals.map((sig, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-300 p-2 rounded-lg bg-violet-500/5 border border-violet-400/10">
                        <div className="w-1 h-1 rounded-full bg-violet-400 mt-1.5 flex-shrink-0"></div>
                        <span className="font-medium">{sig}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scout Monitoring */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">Scout Monitoring</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hoveredSignal.scouts.map((scout, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-violet-500/15 text-violet-200 border border-violet-400/30 uppercase tracking-wider"
                      >
                        {scout}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scanning indicator */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="text-[9px] text-violet-400 uppercase tracking-widest font-black">Active</span>
                  <div className="relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                    <div className="absolute w-3 h-3 rounded-full bg-violet-400/30 animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid Below Radar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
          {[
            { icon: Radio, value: '156', label: 'Scenes Monitored' },
            { icon: TrendingUp, value: '50M+', label: 'Signals Tracked' },
            { icon: Users, value: '20', label: 'Active Scouts' },
            { icon: Disc, value: '23', label: 'Genre Networks' }
          ].map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-black/50 border border-violet-400/15 backdrop-blur-sm hover:border-violet-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-violet-300" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint and fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
        <div className="w-px h-12 bg-gradient-to-b from-violet-400/30 to-transparent"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce"></div>
      </div>
    </section>
  );
}
