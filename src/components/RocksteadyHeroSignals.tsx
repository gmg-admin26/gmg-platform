import { useEffect, useState } from 'react';

interface SignalNode {
  id: number;
  x: number;
  y: number;
  pulse: number;
  size: number;
  strength: 'early' | 'rising' | 'breakout';
  connections: number[];
  label?: string;
  cluster?: number;
}

export default function RocksteadyHeroSignals() {
  const [nodes, setNodes] = useState<SignalNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const clusters = [
      { cx: 25, cy: 30, radius: 12 },
      { cx: 60, cy: 25, radius: 15 },
      { cx: 70, cy: 60, radius: 18 },
      { cx: 35, cy: 70, radius: 10 },
    ];

    const breakoutNodes = [
      { x: 62, y: 27, size: 3.2, label: 'Breakout Traction' },
      { x: 72, y: 58, size: 3.0, label: 'Cultural Momentum' },
    ];

    const risingNodes = [
      { x: 23, y: 32, size: 2.2, label: 'Rising Audience' },
      { x: 58, y: 22, size: 2.4, cluster: 1 },
      { x: 65, y: 30, size: 2.1, cluster: 1 },
      { x: 68, y: 63, size: 2.3, cluster: 2 },
      { x: 75, y: 56, size: 2.0, cluster: 2 },
      { x: 33, y: 68, size: 2.2, cluster: 3 },
    ];

    const earlyNodes = [
      { x: 18, y: 25, size: 1.3, cluster: 0 },
      { x: 28, y: 28, size: 1.2, cluster: 0 },
      { x: 25, y: 35, size: 1.4, cluster: 0 },
      { x: 55, y: 18, size: 1.2 },
      { x: 40, y: 45, size: 1.1 },
      { x: 80, y: 70, size: 1.3 },
      { x: 38, y: 72, size: 1.2, cluster: 3 },
      { x: 30, y: 75, size: 1.1, cluster: 3 },
    ];

    const allNodes: SignalNode[] = [
      ...breakoutNodes.map((n, i) => ({
        id: i,
        ...n,
        pulse: Math.random(),
        strength: 'breakout' as const,
        connections: [2, 3, 4],
        cluster: n.x > 60 ? (n.y < 40 ? 1 : 2) : 0,
      })),
      ...risingNodes.map((n, i) => ({
        id: i + 2,
        ...n,
        pulse: Math.random(),
        strength: 'rising' as const,
        connections: i < 3 ? [0, i + 3] : i < 5 ? [1, i + 4] : [i - 2],
        cluster: n.cluster ?? -1,
      })),
      ...earlyNodes.map((n, i) => ({
        id: i + 10,
        ...n,
        pulse: Math.random(),
        strength: 'early' as const,
        connections: i < 3 ? [2] : [],
        cluster: n.cluster ?? -1,
      })),
    ];

    setNodes(allNodes);

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          pulse: (node.pulse + (node.strength === 'breakout' ? 0.015 : node.strength === 'rising' ? 0.018 : 0.022)) % 1,
        }))
      );
    }, 60);

    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (strength: string) => {
    switch (strength) {
      case 'breakout':
        return { primary: '#8B7AC7', secondary: '#B8A5E3', glow: '#6f5aae' };
      case 'rising':
        return { primary: '#7A6BA8', secondary: '#9d88c9', glow: '#5a4a92' };
      case 'early':
        return { primary: '#5a4a92', secondary: '#6f5aae', glow: '#4B3B78' };
      default:
        return { primary: '#6f5aae', secondary: '#9d88c9', glow: '#5a4a92' };
    }
  };

  return (
    <div className="absolute inset-0">
      <svg className="w-full h-full pointer-events-auto" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGlowBreakout" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8B7AC7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#6f5aae" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4B3B78" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nodeGlowRising" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7A6BA8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#5a4a92" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4B3B78" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nodeGlowEarly" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a4a92" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#4B3B78" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#4B3B78" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B7AC7" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#B8A5E3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7A6BA8" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="lineGradientSubtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6f5aae" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#5a4a92" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#4B3B78" stopOpacity="0.06" />
          </linearGradient>

          <filter id="glowBreakout">
            <feGaussianBlur stdDeviation="0.4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glowRising">
            <feGaussianBlur stdDeviation="0.3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="glowEarly">
            <feGaussianBlur stdDeviation="0.2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {nodes.map(node =>
          node.connections.map(targetId => {
            const target = nodes[targetId];
            if (!target) return null;
            const isActiveConnection = node.strength === 'breakout' || node.strength === 'rising';
            const connectionOpacity = isActiveConnection
              ? 0.25 + node.pulse * 0.2
              : 0.15 + node.pulse * 0.1;

            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={isActiveConnection ? "url(#lineGradientActive)" : "url(#lineGradientSubtle)"}
                strokeWidth={isActiveConnection ? "0.12" : "0.08"}
                opacity={connectionOpacity}
              />
            );
          })
        )}

        {nodes.map(node => {
          const colors = getNodeColor(node.strength);
          const glowSize = node.size + node.pulse * (node.strength === 'breakout' ? 2.0 : node.strength === 'rising' ? 1.5 : 1.0);
          const baseOpacity = node.strength === 'breakout' ? 0.5 : node.strength === 'rising' ? 0.4 : 0.3;
          const opacity = baseOpacity + node.pulse * 0.3;
          const glowId = node.strength === 'breakout' ? 'nodeGlowBreakout' : node.strength === 'rising' ? 'nodeGlowRising' : 'nodeGlowEarly';
          const filterId = node.strength === 'breakout' ? 'glowBreakout' : node.strength === 'rising' ? 'glowRising' : 'glowEarly';

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: node.label ? 'pointer' : 'default' }}
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={glowSize * 2.2}
                fill={`url(#${glowId})`}
                opacity={opacity * 0.3}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={colors.primary}
                opacity={opacity * 0.8}
                filter={`url(#${filterId})`}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 0.4}
                fill={colors.secondary}
                opacity={opacity}
              />

              {node.label && hoveredNode === node.id && (
                <g>
                  <rect
                    x={node.x + 4}
                    y={node.y - 2}
                    width={node.label.length * 0.9}
                    height="3"
                    fill="#1a1625"
                    opacity="0.95"
                    rx="0.3"
                  />
                  <text
                    x={node.x + 4.5}
                    y={node.y + 0.5}
                    fill="#B8A5E3"
                    fontSize="1.1"
                    fontWeight="500"
                    opacity="0.95"
                  >
                    {node.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
