import React, { useState } from 'react';

interface EcosystemNode {
  id: string;
  title: string;
  description: string;
  detailedInfo: string;
  angle: number;
  color: string;
  glowColor: string;
}

export default function InteractiveEcosystemMap() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: EcosystemNode[] = [
    {
      id: 'artists',
      title: 'Artists',
      description: 'Independent creators building modern music businesses',
      detailedInfo: 'Artists connect to GMG through discovery systems, growth infrastructure, distribution tools, and cultural media development.',
      angle: 0,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'cultural-signals',
      title: 'Cultural Signals',
      description: 'Real-time trends and emerging cultural patterns',
      detailedInfo: 'GMG tracks cultural signals across platforms to identify emerging trends and artist momentum before the market.',
      angle: 25.7,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'ai-discovery',
      title: 'AI Discovery',
      description: 'Machine learning systems for artist identification',
      detailedInfo: 'Rocksteady AI analyzes millions of data points to identify emerging artists with early growth signals and cultural traction.',
      angle: 51.4,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'artist-tools',
      title: 'Artist Tools',
      description: 'AI-powered marketing and operational infrastructure',
      detailedInfo: 'GMG provides artists with automated marketing tools, campaign planning, fan engagement systems, and growth analytics.',
      angle: 77.1,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'catalog-growth',
      title: 'Catalog Growth',
      description: 'Strategies to expand music asset value',
      detailedInfo: 'GMG helps catalog owners unlock value through streaming optimization, marketing campaigns, and audience expansion strategies.',
      angle: 102.8,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'distribution',
      title: 'Distribution',
      description: 'Multi-platform music delivery systems',
      detailedInfo: 'GMG ensures music reaches all major streaming platforms, social networks, and emerging distribution channels.',
      angle: 128.5,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'fans-audiences',
      title: 'Fans & Audiences',
      description: 'Global listeners and music communities',
      detailedInfo: 'GMG helps artists build direct relationships with fans through data-driven engagement and community-building tools.',
      angle: 154.2,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'brand-partnerships',
      title: 'Brand / Creative Collaborations',
      description: 'Creative collaborations, sync, and cultural activations',
      detailedInfo: 'GMG connects artists and catalogs with brands, creative studios, and cultural organizations for collaborations, sync placements, and media activations.',
      angle: 180,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'media-microseries',
      title: 'Media & Microseries',
      description: 'Vertical video storytelling and original content',
      detailedInfo: 'GMG develops music-driven microseries and original formats designed for next-generation social platforms and audiences.',
      angle: 205.7,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'merch-products',
      title: 'Merch & Products',
      description: 'E-commerce and physical merchandise',
      detailedInfo: 'GMG helps artists expand revenue through merchandise strategy, product development, and e-commerce infrastructure.',
      angle: 231.4,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'touring',
      title: 'Touring',
      description: 'Live performance and event intelligence',
      detailedInfo: 'GMG provides touring intelligence, market analysis, and live event strategy to maximize artist performance revenue.',
      angle: 257.1,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'independent-labels',
      title: 'Independent Labels',
      description: 'Modern label infrastructure and services',
      detailedInfo: 'GMG supports independent labels with discovery systems, operational infrastructure, and artist development resources.',
      angle: 282.8,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    },
    {
      id: 'managers',
      title: 'Managers',
      description: 'Artist management and career development',
      detailedInfo: 'GMG provides managers with tools, insights, and infrastructure to help their artists grow more efficiently.',
      angle: 308.5,
      color: 'violet',
      glowColor: 'rgba(139, 92, 246, 0.6)'
    },
    {
      id: 'producers-creators',
      title: 'Producers & Creators',
      description: 'Music producers and content creators',
      detailedInfo: 'GMG connects producers and creators to opportunities, collaboration tools, and revenue optimization systems.',
      angle: 334.2,
      color: 'cyan',
      glowColor: 'rgba(6, 182, 212, 0.6)'
    }
  ];

  const radius = 280;

  const getNodePosition = (angle: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full py-32 px-6 overflow-hidden">
      {/* Background System */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}></div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-violet-600/8 via-indigo-700/4 to-transparent blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="text-center mb-20 relative z-10">
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
          Music Doesn't Move in <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Straight Lines</span> Anymore
        </h2>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Artists, catalogs, audiences, and culture now evolve through interconnected systems. GMG connects those systems into one infrastructure.
        </p>
      </div>

      {/* Ecosystem Map Container */}
      <div className="relative max-w-7xl mx-auto">
        <div className="relative w-full" style={{ minHeight: '800px' }}>
          {/* SVG Container for Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="connectionGradient" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
              </radialGradient>
            </defs>

            {/* Center Circle Glow */}
            <circle
              cx="50%"
              cy="400"
              r="100"
              fill="url(#connectionGradient)"
              opacity="0.2"
            >
              <animate attributeName="r" values="100;110;100" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.3;0.2" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* Connection Lines to All Nodes */}
            {nodes.map((node) => {
              const pos = getNodePosition(node.angle);
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode === node.id;

              return (
                <line
                  key={`line-${node.id}`}
                  x1="50%"
                  y1="400"
                  x2={`calc(50% + ${pos.x}px)`}
                  y2={`calc(400px + ${pos.y}px)`}
                  stroke={isHovered || isSelected ? node.glowColor : 'rgba(139, 92, 246, 0.15)'}
                  strokeWidth={isHovered || isSelected ? '2' : '1'}
                  opacity={isHovered || isSelected ? '0.8' : '0.3'}
                  className="transition-all duration-500"
                  strokeDasharray={isSelected ? '0' : '4,4'}
                >
                  {!isSelected && (
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;8"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>
              );
            })}
          </svg>

          {/* Center GMG Node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative">
              {/* Pulsing Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/40 via-indigo-600/40 to-cyan-600/40 blur-3xl rounded-full animate-pulse" style={{ transform: 'scale(1.5)' }}></div>

              {/* Center Card */}
              <div className="relative px-12 py-8 rounded-2xl bg-black/90 border-2 border-white/40 backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.5)]">
                <p className="text-2xl font-black text-white tracking-tight whitespace-nowrap">
                  Greater Music Group
                </p>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 animate-ping"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Orbital Nodes */}
          {nodes.map((node) => {
            const pos = getNodePosition(node.angle);
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;

            return (
              <div
                key={node.id}
                className="absolute top-1/2 left-1/2 z-10"
                style={{
                  transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                }}
              >
                {/* Node Button */}
                <button
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="relative group cursor-pointer"
                >
                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-xl blur-xl transition-all duration-500 ${
                      isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      backgroundColor: node.glowColor,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)'
                    }}
                  ></div>

                  {/* Node Card */}
                  <div
                    className={`relative px-6 py-4 rounded-xl backdrop-blur-xl transition-all duration-500 ${
                      isSelected
                        ? 'bg-black/90 border-2 scale-110'
                        : 'bg-black/70 border'
                    } ${
                      node.color === 'violet'
                        ? isHovered || isSelected
                          ? 'border-violet-400/80'
                          : 'border-violet-500/30'
                        : isHovered || isSelected
                          ? 'border-cyan-400/80'
                          : 'border-cyan-500/30'
                    }`}
                    style={{
                      boxShadow: isHovered || isSelected
                        ? `0 0 30px ${node.glowColor}`
                        : '0 0 10px rgba(0,0,0,0.3)',
                      transform: isSelected ? 'translateY(-4px)' : isHovered ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    {/* Active Indicator */}
                    {(isHovered || isSelected) && (
                      <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                        node.color === 'violet' ? 'bg-violet-400' : 'bg-cyan-400'
                      }`}>
                        <div className={`absolute inset-0 rounded-full animate-ping ${
                          node.color === 'violet' ? 'bg-violet-400' : 'bg-cyan-400'
                        }`}></div>
                      </div>
                    )}

                    <p className={`text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                      isHovered || isSelected ? 'text-white' : 'text-gray-300'
                    }`}>
                      {node.title}
                    </p>
                  </div>

                  {/* Hover Description Tooltip */}
                  {isHovered && !isSelected && (
                    <div
                      className="absolute top-full mt-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg bg-black/95 border backdrop-blur-xl pointer-events-none whitespace-nowrap z-30"
                      style={{
                        borderColor: node.color === 'violet' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)',
                        boxShadow: `0 0 20px ${node.glowColor}`
                      }}
                    >
                      <p className="text-xs text-gray-300">{node.description}</p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}

          {/* Ambient Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s infinite ease-in-out`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Selected Node Info Panel */}
        {selectedNodeData && (
          <div className="mt-16 max-w-3xl mx-auto">
            <div
              className="relative p-8 rounded-2xl backdrop-blur-xl border-2 transition-all duration-500"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: selectedNodeData.color === 'violet' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(6, 182, 212, 0.5)',
                boxShadow: `0 0 40px ${selectedNodeData.glowColor}`
              }}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-10"
                style={{
                  backgroundImage: selectedNodeData.color === 'violet'
                    ? 'linear-gradient(to bottom right, rgb(139, 92, 246), transparent)'
                    : 'linear-gradient(to bottom right, rgb(6, 182, 212), transparent)'
                }}
              ></div>

              <div className="relative">
                <h3 className={`text-2xl font-black mb-4 ${
                  selectedNodeData.color === 'violet' ? 'text-violet-400' : 'text-cyan-400'
                }`}>
                  {selectedNodeData.title}
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {selectedNodeData.detailedInfo}
                </p>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
              >
                <span className="text-white text-sm">✕</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
}
