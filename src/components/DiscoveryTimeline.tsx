import { useState } from 'react';
import { Radio, UserCheck, Database, Users, FileText } from 'lucide-react';

interface TimelineStage {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const stages: TimelineStage[] = [
  {
    id: 1,
    title: 'Signal Detected',
    description: 'Rocksteady detects early momentum through streaming velocity, social growth, and cultural signals.',
    icon: Radio,
    color: '#8B5CF6'
  },
  {
    id: 2,
    title: 'Scout Validation',
    description: 'AI scouts confirm the signal by analyzing scene momentum, producer networks, and fan clusters.',
    icon: UserCheck,
    color: '#A78BFA'
  },
  {
    id: 3,
    title: 'Discovery Intelligence',
    description: 'Rocksteady aggregates multi-source data to validate the opportunity.',
    icon: Database,
    color: '#C4B5FD'
  },
  {
    id: 4,
    title: 'Artist Connection',
    description: 'GMG identifies and connects with the artist early in their growth phase.',
    icon: Users,
    color: '#D8B4FE'
  },
  {
    id: 5,
    title: 'Deal Development',
    description: 'Artists are offered distribution, partnership, or label opportunities.',
    icon: FileText,
    color: '#E9D5FF'
  }
];

export default function DiscoveryTimeline() {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  return (
    <div className="relative">
      <div className="text-center mb-20">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
          Discovery Timeline
        </h2>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          How early signals become breakthrough artists.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-8 pb-12">
        <div className="relative">
          <svg
            className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <defs>
              <linearGradient id="timeline-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <line
              x1="10%"
              y1="50%"
              x2="90%"
              y2="50%"
              stroke="url(#timeline-gradient)"
              strokeWidth="3"
              filter="url(#glow)"
            />
            {/* Animated pulse traveling along line */}
            <line
              x1="10%"
              y1="50%"
              x2="90%"
              y2="50%"
              stroke="#C084FC"
              strokeWidth="4"
              strokeDasharray="10 990"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;-1000"
                dur="4s"
                repeatCount="indefinite"
              />
            </line>
          </svg>

          <div className="relative flex justify-between items-start" style={{ zIndex: 1 }}>
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isHovered = hoveredStage === stage.id;
              const position = 10 + (index * 20);

              return (
                <div
                  key={stage.id}
                  className="relative flex flex-col items-center"
                  style={{ width: '16%' }}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <div
                    className="relative w-20 h-20 rounded-full transition-all duration-500 cursor-pointer group"
                    style={{
                      backgroundColor: `${stage.color}20`,
                      border: `3px solid ${stage.color}`,
                      boxShadow: isHovered
                        ? `0 0 50px ${stage.color}, inset 0 0 20px ${stage.color}60`
                        : `0 0 30px ${stage.color}80, inset 0 0 15px ${stage.color}40`,
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon
                        className="w-8 h-8 transition-all duration-300"
                        style={{
                          color: stage.color,
                          filter: isHovered ? 'drop-shadow(0 0 8px currentColor)' : 'none'
                        }}
                      />
                    </div>

                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                      style={{
                        backgroundColor: stage.color,
                        animation: 'pulse 2s ease-in-out infinite'
                      }}
                    />
                  </div>

                  <div className="mt-6 text-center">
                    <div
                      className="text-sm font-black mb-2 transition-colors duration-300"
                      style={{
                        color: isHovered ? stage.color : '#9CA3AF'
                      }}
                    >
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                      Stage {stage.id}
                    </div>
                  </div>

                  {isHovered && (
                    <div
                      className="absolute top-28 left-1/2 -translate-x-1/2 w-64 bg-gradient-to-br from-gmg-graphite/95 to-gmg-charcoal/95 backdrop-blur-2xl rounded-2xl p-5 border z-50 pointer-events-none"
                      style={{
                        borderColor: `${stage.color}60`,
                        boxShadow: `0 0 40px ${stage.color}60, inset 0 0 20px rgba(0,0,0,0.3)`,
                        animation: 'fadeIn 0.3s ease-out'
                      }}
                    >
                      <h4 className="text-sm font-black text-gmg-white mb-3 flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: stage.color }} />
                        {stage.title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center mt-24">
        <p className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-violet-400 via-purple-300 to-fuchsia-400 bg-clip-text">
          "The future of A&R is signal intelligence."
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
