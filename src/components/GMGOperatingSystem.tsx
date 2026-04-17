import { useState } from 'react';
import { Brain, TrendingUp, Database, Radio, Users, Globe, Zap, Target } from 'lucide-react';

export default function GMGOperatingSystem() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const centerNode = {
    id: 'center',
    label: 'GMG AI Infrastructure',
    icon: Brain,
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.4)',
  };

  const innerRing = [
    { id: 'discovery', label: 'Discovery Intelligence', icon: Target, angle: 0 },
    { id: 'artist-os', label: 'Artist Operating System', icon: Zap, angle: 120 },
    { id: 'catalog', label: 'Catalog Growth Engine', icon: TrendingUp, angle: 240 },
  ];

  const middleRing = [
    { id: 'streaming', label: 'Streaming Intelligence', icon: Radio, angle: 30 },
    { id: 'social', label: 'Cultural Signals', icon: Users, angle: 90 },
    { id: 'scene', label: 'Scene Activity', icon: Database, angle: 150 },
    { id: 'creators', label: 'Creator Graph', icon: Globe, angle: 210 },
  ];

  const outerRing = [
    { id: 'artist-dev', label: 'Artist Development', angle: 0 },
    { id: 'catalog-exp', label: 'Catalog Expansion', angle: 90 },
    { id: 'momentum', label: 'Cultural Momentum', angle: 180 },
    { id: 'distribution', label: 'Global Distribution', angle: 270 },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <svg
        className="w-full h-auto"
        viewBox="0 0 800 800"
        style={{
          filter: 'drop-shadow(0 0 50px rgba(139, 92, 246, 0.3))',
          transform: 'scale(1.7)',
          transformOrigin: 'center center'
        }}
      >
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.6)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
          </radialGradient>
        </defs>

        {/* Center glow */}
        <circle cx="400" cy="400" r="100" fill="url(#centerGlow)" opacity="0.8">
          <animate attributeName="r" values="100;120;100" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Additional center glow layer */}
        <circle cx="400" cy="400" r="80" fill="url(#centerGlow)" opacity="0.5">
          <animate attributeName="r" values="80;95;80" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Connection lines from center to inner ring */}
        {innerRing.map((node) => {
          const x = 400 + 180 * Math.cos((node.angle * Math.PI) / 180);
          const y = 400 + 180 * Math.sin((node.angle * Math.PI) / 180);
          return (
            <line
              key={`line-center-${node.id}`}
              x1="400"
              y1="400"
              x2={x}
              y2={y}
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="2"
              className="transition-all duration-300"
              style={{
                opacity: hoveredNode === node.id || hoveredNode === 'center' ? 1 : 0.3,
              }}
            >
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.6;0.3"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Connection lines from inner ring to middle ring */}
        {middleRing.map((mNode) => {
          const nearestInner = innerRing.reduce((prev, curr) => {
            const prevDiff = Math.abs(prev.angle - mNode.angle);
            const currDiff = Math.abs(curr.angle - mNode.angle);
            return currDiff < prevDiff ? curr : prev;
          });

          const x1 = 400 + 180 * Math.cos((nearestInner.angle * Math.PI) / 180);
          const y1 = 400 + 180 * Math.sin((nearestInner.angle * Math.PI) / 180);
          const x2 = 400 + 280 * Math.cos((mNode.angle * Math.PI) / 180);
          const y2 = 400 + 280 * Math.sin((mNode.angle * Math.PI) / 180);

          return (
            <line
              key={`line-middle-${mNode.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="1.5"
              className="transition-all duration-300"
              style={{
                opacity: hoveredNode === mNode.id ? 1 : 0.2,
              }}
            />
          );
        })}

        {/* Connection lines from inner ring to outer ring */}
        {outerRing.map((oNode) => {
          const nearestInner = innerRing.reduce((prev, curr) => {
            const prevDiff = Math.abs(prev.angle - oNode.angle);
            const currDiff = Math.abs(curr.angle - oNode.angle);
            return currDiff < prevDiff ? curr : prev;
          });

          const x1 = 400 + 180 * Math.cos((nearestInner.angle * Math.PI) / 180);
          const y1 = 400 + 180 * Math.sin((nearestInner.angle * Math.PI) / 180);
          const x2 = 400 + 370 * Math.cos((oNode.angle * Math.PI) / 180);
          const y2 = 400 + 370 * Math.sin((oNode.angle * Math.PI) / 180);

          return (
            <line
              key={`line-outer-${oNode.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(139, 92, 246, 0.2)"
              strokeWidth="1.5"
              className="transition-all duration-300"
              style={{
                opacity: hoveredNode === oNode.id ? 1 : 0.15,
              }}
            />
          );
        })}

        {/* Center node */}
        <g
          onMouseEnter={() => setHoveredNode('center')}
          onMouseLeave={() => setHoveredNode(null)}
          className="cursor-pointer"
        >
          <circle
            cx="400"
            cy="400"
            r="60"
            fill="rgba(139, 92, 246, 0.25)"
            stroke="rgba(139, 92, 246, 1)"
            strokeWidth="3"
            className="transition-all duration-300"
            style={{
              filter: hoveredNode === 'center' ? 'drop-shadow(0 0 30px rgba(139, 92, 246, 1))' : 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.7))',
            }}
          >
            <animate
              attributeName="stroke-opacity"
              values="0.8;1;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Inner ring nodes */}
        {innerRing.map((node) => {
          const x = 400 + 180 * Math.cos((node.angle * Math.PI) / 180);
          const y = 400 + 180 * Math.sin((node.angle * Math.PI) / 180);

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r="45"
                fill="rgba(139, 92, 246, 0.15)"
                stroke="rgba(139, 92, 246, 0.6)"
                strokeWidth="2.5"
                className="transition-all duration-300"
                style={{
                  filter: hoveredNode === node.id ? 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))' : 'none',
                }}
              >
                <animate
                  attributeName="r"
                  values="45;47;45"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}

        {/* Middle ring nodes */}
        {middleRing.map((node) => {
          const x = 400 + 280 * Math.cos((node.angle * Math.PI) / 180);
          const y = 400 + 280 * Math.sin((node.angle * Math.PI) / 180);

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r="36"
                fill="rgba(6, 182, 212, 0.15)"
                stroke="rgba(6, 182, 212, 0.5)"
                strokeWidth="2"
                className="transition-all duration-300"
                style={{
                  filter: hoveredNode === node.id ? 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.6))' : 'none',
                }}
              />
            </g>
          );
        })}

        {/* Outer ring nodes */}
        {outerRing.map((node) => {
          const x = 400 + 370 * Math.cos((node.angle * Math.PI) / 180);
          const y = 400 + 370 * Math.sin((node.angle * Math.PI) / 180);

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r="28"
                fill="rgba(139, 92, 246, 0.1)"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="2"
                className="transition-all duration-300"
                style={{
                  filter: hoveredNode === node.id ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.5))' : 'none',
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Labels overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Center label */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ width: '160px' }}
        >
          <Brain className="w-10 h-10 mx-auto mb-2 text-purple-400" />
          <p className="text-sm font-bold text-white/90 leading-tight">
            {centerNode.label}
          </p>
        </div>

        {/* Inner ring labels */}
        {innerRing.map((node) => {
          const x = 50 + 22.5 * Math.cos((node.angle * Math.PI) / 180);
          const y = 50 + 22.5 * Math.sin((node.angle * Math.PI) / 180);
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: '140px',
              }}
            >
              <Icon className="w-6 h-6 mx-auto mb-1 text-purple-400" />
              <p className="text-xs font-semibold text-white/80 leading-tight">
                {node.label}
              </p>
            </div>
          );
        })}

        {/* Middle ring labels */}
        {middleRing.map((node) => {
          const x = 50 + 35 * Math.cos((node.angle * Math.PI) / 180);
          const y = 50 + 35 * Math.sin((node.angle * Math.PI) / 180);
          const Icon = node.icon;

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: '110px',
              }}
            >
              <Icon className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
              <p className="text-[10px] font-medium text-white/70 leading-tight">
                {node.label}
              </p>
            </div>
          );
        })}

        {/* Outer ring labels */}
        {outerRing.map((node) => {
          const x = 50 + 46.25 * Math.cos((node.angle * Math.PI) / 180);
          const y = 50 + 46.25 * Math.sin((node.angle * Math.PI) / 180);

          return (
            <div
              key={node.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: '100px',
              }}
            >
              <p className="text-[10px] font-medium text-white/60 leading-tight">
                {node.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
