import React, { useState } from 'react';

export default function PlatformInfrastructureMap() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const layers = [
    {
      title: 'DISCOVERY ENGINE',
      nodes: [
        'Rocksteady Discovery',
        'Signal Detection',
        'Audience Intelligence',
        'Breakout Score Engine'
      ],
      color: 'violet',
      gradient: 'from-violet-600/30 to-purple-600/30',
      borderGlow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
      nodeGlow: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
      connectionColor: 'stroke-violet-500/40'
    },
    {
      title: 'ARTIST OPERATING SYSTEM',
      nodes: [
        'AI Artist Tools',
        'Artist Operations',
        'AI Marketing Engine',
        'Fan Intelligence',
        'Distribution Strategy'
      ],
      color: 'blue',
      gradient: 'from-blue-600/30 to-cyan-600/30',
      borderGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
      nodeGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
      connectionColor: 'stroke-blue-500/40'
    },
    {
      title: 'GROWTH INFRASTRUCTURE',
      nodes: [
        'Catalog Growth',
        'Touring Intelligence',
        'Merch Infrastructure',
        'Brand / Creative Collaborations'
      ],
      color: 'emerald',
      gradient: 'from-emerald-600/30 to-teal-600/30',
      borderGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      nodeGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
      connectionColor: 'stroke-emerald-500/40'
    },
    {
      title: 'EXPERT INFRASTRUCTURE',
      nodes: [
        'Playlist Pitching',
        'Management Strategy',
        'Sync Placement',
        'Creative Direction',
        'Content Production'
      ],
      color: 'amber',
      gradient: 'from-amber-600/30 to-orange-600/30',
      borderGlow: 'shadow-[0_0_30px_rgba(245,158,11,0.3)]',
      nodeGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
      connectionColor: 'stroke-amber-500/40'
    }
  ];

  return (
    <div className="relative w-full py-20">
      {/* Core Platform Label */}
      <div className="text-center mb-16">
        <div className="inline-block relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-emerald-600/20 blur-2xl animate-pulse" />
          <div className="relative px-10 py-4 rounded-xl bg-black/80 border border-white/30 backdrop-blur-xl">
            <p className="text-2xl font-bold text-white tracking-tight">GMG PLATFORM</p>
          </div>
        </div>
      </div>

      {/* Layered Architecture Stack */}
      <div className="max-w-6xl mx-auto space-y-8">
        {layers.map((layer, layerIndex) => (
          <div key={layerIndex} className="relative">
            {/* Connection Lines to Next Layer */}
            {layerIndex < layers.length - 1 && (
              <svg className="absolute left-1/2 -translate-x-1/2 w-px overflow-visible" style={{ top: '100%', height: '32px' }}>
                <defs>
                  <linearGradient id={`gradient-${layerIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={`rgb(139, 92, 246)`} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={`rgb(139, 92, 246)`} stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="0" x2="0" y2="32" stroke={`url(#gradient-${layerIndex})`} strokeWidth="2" />
                <circle cx="0" cy="32" r="3" fill="rgb(139, 92, 246)" opacity="0.6">
                  <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              </svg>
            )}

            {/* Layer Container */}
            <div className={`relative p-8 rounded-2xl bg-gradient-to-r ${layer.gradient} border border-white/10 backdrop-blur-xl ${layer.borderGlow} transition-all duration-500 hover:border-white/20`}>
              {/* Animated Background Effect */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${layer.gradient} opacity-0 hover:opacity-100 transition-opacity duration-500`} />
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
                  backgroundSize: '40px 40px'
                }} />
              </div>

              {/* Layer Title */}
              <div className="relative text-center mb-6">
                <h3 className="text-xs font-bold text-white/60 tracking-[0.2em] uppercase mb-3">
                  Layer {layerIndex + 1}
                </h3>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {layer.title}
                </h2>
              </div>

              {/* Nodes Grid */}
              <div className="relative flex flex-wrap justify-center gap-4">
                {layer.nodes.map((node, nodeIndex) => (
                  <React.Fragment key={nodeIndex}>
                    {/* Connection Line to Next Node */}
                    {nodeIndex < layer.nodes.length - 1 && (
                      <svg className="absolute top-1/2 left-0 w-full h-px pointer-events-none" style={{ zIndex: 0 }}>
                        <line
                          x1={`${(nodeIndex / (layer.nodes.length - 1)) * 100}%`}
                          y1="0"
                          x2={`${((nodeIndex + 1) / (layer.nodes.length - 1)) * 100}%`}
                          y2="0"
                          className={layer.connectionColor}
                          strokeWidth="1"
                          opacity="0.3"
                          strokeDasharray="4,4"
                        >
                          <animate
                            attributeName="stroke-dashoffset"
                            values="0;8"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </line>
                      </svg>
                    )}

                    {/* Node */}
                    <div
                      className="relative group cursor-pointer z-10"
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Hover Glow Effect */}
                      <div className={`absolute inset-0 rounded-lg ${layer.nodeGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md`} />

                      {/* Node Card */}
                      <div className="relative px-6 py-3 rounded-lg bg-black/60 border border-white/20 backdrop-blur-md group-hover:bg-black/80 group-hover:border-white/40 group-hover:-translate-y-1 transition-all duration-300">
                        {/* Signal Indicator */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white/40 group-hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 rounded-full bg-white animate-ping" />
                        </div>

                        <p className="text-sm font-medium text-white/80 group-hover:text-white whitespace-nowrap transition-colors duration-300">
                          {node}
                        </p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Layer Indicator Line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Connection Point */}
      <div className="text-center mt-12">
        <div className="inline-block">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
