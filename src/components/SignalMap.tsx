import { useEffect, useState } from 'react';

interface SignalNode {
  id: number;
  x: number;
  y: number;
  pulse: number;
  size: number;
  connections: number[];
  label?: string;
  trend?: string;
  momentum?: string;
}

export function SignalMap() {
  const [nodes, setNodes] = useState<SignalNode[]>([]);

  useEffect(() => {
    const nodeCount = 25;
    const initialNodes: SignalNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      pulse: Math.random(),
      size: 3 + Math.random() * 4,
      connections: Array.from(
        { length: Math.floor(Math.random() * 3) },
        () => Math.floor(Math.random() * nodeCount)
      ).filter(conn => conn !== i),
    }));

    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          pulse: (node.pulse + 0.05) % 1,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.2" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
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
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke="url(#lineGradient)"
                strokeWidth="0.1"
                opacity={0.3 + node.pulse * 0.3}
              />
            );
          })
        )}

        {nodes.map(node => {
          const glowSize = node.size + node.pulse * 3;
          const opacity = 0.4 + node.pulse * 0.6;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={glowSize}
                fill="url(#nodeGlow)"
                opacity={opacity * 0.3}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#a78bfa"
                opacity={opacity}
                filter="url(#glow)"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 0.5}
                fill="#ffffff"
                opacity={opacity * 0.8}
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-gmg-charcoal via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}

export function SignalMapCompact() {
  const [nodes, setNodes] = useState<SignalNode[]>([]);

  useEffect(() => {
    const nodeCount = 15;
    const initialNodes: SignalNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      pulse: Math.random(),
      size: 2 + Math.random() * 3,
      connections: Array.from(
        { length: Math.floor(Math.random() * 2) },
        () => Math.floor(Math.random() * nodeCount)
      ).filter(conn => conn !== i),
    }));

    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          pulse: (node.pulse + 0.05) % 1,
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGlowCompact" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGradientCompact" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {nodes.map(node =>
          node.connections.map(targetId => {
            const target = nodes[targetId];
            if (!target) return null;
            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke="url(#lineGradientCompact)"
                strokeWidth="0.15"
                opacity={0.4 + node.pulse * 0.3}
              />
            );
          })
        )}

        {nodes.map(node => {
          const glowSize = node.size + node.pulse * 2;
          const opacity = 0.5 + node.pulse * 0.5;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={glowSize}
                fill="url(#nodeGlowCompact)"
                opacity={opacity * 0.4}
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill="#06b6d4"
                opacity={opacity}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SignalMapInteractive() {
  const [nodes, setNodes] = useState<SignalNode[]>([]);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [signalPulse, setSignalPulse] = useState<{ path: number[]; progress: number } | null>(null);

  const artistLabels = [
    'Regional Emergence',
    'Momentum Rising',
    'Audience Acceleration',
    'Cultural Breakout',
    'Viral Growth Pattern',
    'Genre Crossover Signal',
    'Collaborative Network',
    'Breaking Artist Signal',
  ];

  const trends = ['↑ 245%', '↑ 189%', '↑ 312%', '↑ 156%', '↑ 278%', '↑ 423%', '↑ 167%', '↑ 334%'];
  const momentumLabels = ['High', 'Very High', 'Explosive', 'Strong', 'Accelerating', 'Breaking', 'Rising', 'Surging'];

  useEffect(() => {
    const nodeCount = 35;
    const initialNodes: SignalNode[] = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      pulse: Math.random(),
      size: 2.5 + Math.random() * 3,
      connections: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => Math.floor(Math.random() * nodeCount)
      ).filter(conn => conn !== i),
      label: artistLabels[Math.floor(Math.random() * artistLabels.length)],
      trend: trends[Math.floor(Math.random() * trends.length)],
      momentum: momentumLabels[Math.floor(Math.random() * momentumLabels.length)],
    }));

    setNodes(initialNodes);

    const interval = setInterval(() => {
      setNodes(prevNodes =>
        prevNodes.map(node => ({
          ...node,
          pulse: (node.pulse + 0.03) % 1,
          x: node.x + (Math.random() - 0.5) * 0.05,
          y: node.y + (Math.random() - 0.5) * 0.05,
        }))
      );
    }, 50);

    const signalInterval = setInterval(() => {
      const startNode = Math.floor(Math.random() * nodeCount);
      const path: number[] = [startNode];
      let current = startNode;

      for (let i = 0; i < 3 + Math.floor(Math.random() * 3); i++) {
        const connections = initialNodes[current]?.connections || [];
        if (connections.length === 0) break;
        const next = connections[Math.floor(Math.random() * connections.length)];
        if (!path.includes(next)) {
          path.push(next);
          current = next;
        }
      }

      if (path.length > 1) {
        setSignalPulse({ path, progress: 0 });

        const pulseInterval = setInterval(() => {
          setSignalPulse(prev => {
            if (!prev || prev.progress >= 1) {
              clearInterval(pulseInterval);
              return null;
            }
            return { ...prev, progress: prev.progress + 0.02 };
          });
        }, 30);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(signalInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGlowInteractive" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nodeGlowHover" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="lineGradientInteractive" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="0.1" />
          </linearGradient>

          <filter id="glowInteractive">
            <feGaussianBlur stdDeviation="0.8" result="coloredBlur"/>
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
            const isHighlighted = hoveredNode === node.id || hoveredNode === targetId;

            const isInPulsePath = signalPulse && (
              (signalPulse.path.includes(node.id) && signalPulse.path.includes(targetId) &&
               Math.abs(signalPulse.path.indexOf(node.id) - signalPulse.path.indexOf(targetId)) === 1)
            );

            const pulseOpacity = isInPulsePath ? Math.sin(signalPulse.progress * Math.PI) * 0.8 : 0;

            return (
              <line
                key={`${node.id}-${targetId}`}
                x1={node.x}
                y1={node.y}
                x2={target.x}
                y2={target.y}
                stroke={isInPulsePath ? '#06b6d4' : (isHighlighted ? '#06b6d4' : 'url(#lineGradientInteractive)')}
                strokeWidth={isInPulsePath ? '0.3' : (isHighlighted ? '0.2' : '0.12')}
                opacity={isInPulsePath ? 0.8 + pulseOpacity : (isHighlighted ? 0.8 : 0.3 + node.pulse * 0.2)}
                className="transition-all duration-300"
              />
            );
          })
        )}

        {nodes.map(node => {
          const isHovered = hoveredNode === node.id;
          const glowSize = node.size + node.pulse * (isHovered ? 5 : 2.5);
          const opacity = 0.4 + node.pulse * 0.5;

          return (
            <g
              key={node.id}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="cursor-pointer"
            >
              <circle
                cx={node.x}
                cy={node.y}
                r={glowSize}
                fill={isHovered ? 'url(#nodeGlowHover)' : 'url(#nodeGlowInteractive)'}
                opacity={isHovered ? 0.6 : opacity * 0.3}
                className="transition-all duration-300"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? node.size * 1.5 : node.size}
                fill={isHovered ? '#06b6d4' : '#a78bfa'}
                opacity={opacity}
                filter="url(#glowInteractive)"
                className="transition-all duration-300"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={node.size * 0.4}
                fill="#ffffff"
                opacity={isHovered ? 1 : opacity * 0.7}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>

      {hoveredNode !== null && nodes[hoveredNode] && (
        <div
          className="absolute pointer-events-none z-50 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y - 20}px`,
          }}
        >
          <div className="bg-gmg-graphite/95 backdrop-blur-sm border border-gmg-cyan/50 rounded-xl px-4 py-3 shadow-2xl min-w-[200px]">
            <div className="text-xs font-semibold text-gmg-cyan mb-2">{nodes[hoveredNode].label}</div>
            <div className="text-xs text-gmg-gray space-y-1">
              <div className="flex justify-between">
                <span>Growth:</span>
                <span className="text-gmg-white font-medium">{nodes[hoveredNode].trend}</span>
              </div>
              <div className="flex justify-between">
                <span>Momentum:</span>
                <span className="text-gmg-white font-medium">{nodes[hoveredNode].momentum}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-gmg-charcoal via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}
