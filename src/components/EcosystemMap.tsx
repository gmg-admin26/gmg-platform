import { useEffect, useState, useRef } from 'react';
import {
  Brain,
  Zap,
  Music,
  TrendingUp,
  Video,
  ShoppingBag,
  Users,
  Radio,
  Sparkles,
  Activity,
  Target,
  BarChart3,
  Briefcase,
  Album,
  Headphones,
  Share2
} from 'lucide-react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  delay: number;
}

interface DiamondStar {
  x: number;
  y: number;
  size: number;
  rotation: number;
  color: string;
  opacity: number;
}

interface SignalPulse {
  id: string;
  fromNode: string;
  toNode: string;
  progress: number;
  color: string;
  type: 'radial' | 'cross';
}

interface DiscoverySpark {
  id: string;
  x: number;
  y: number;
  opacity: number;
  progress: number;
}

interface NodeBreathing {
  scale: number;
}

interface CenterFloat {
  y: number;
  rotation: number;
}

export default function EcosystemMap() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [diamonds, setDiamonds] = useState<DiamondStar[]>([]);
  const [signalPulses, setSignalPulses] = useState<SignalPulse[]>([]);
  const [discoverySparks, setDiscoverySparks] = useState<DiscoverySpark[]>([]);
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [nodeBreathing, setNodeBreathing] = useState<Record<string, NodeBreathing>>({});
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [networkSweep, setNetworkSweep] = useState(0);
  const [centerFloat, setCenterFloat] = useState<CenterFloat>({ y: 0, rotation: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const starField: Star[] = [];
    for (let i = 0; i < 60; i++) {
      starField.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        twinkleSpeed: Math.random() * 3 + 2,
        delay: Math.random() * 2
      });
    }
    setStars(starField);

    const diamondField: DiamondStar[] = [];
    const colors = ['#ec4899', '#8b5cf6', '#06b6d4'];
    for (let i = 0; i < 12; i++) {
      diamondField.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    setDiamonds(diamondField);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const allNodes = [...innerOrbitNodes, ...outerOrbitNodes];
    const initialOffsets: Record<string, { x: number; y: number }> = {};
    allNodes.forEach(node => {
      initialOffsets[node.id] = {
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2
      };
    });
    setNodeOffsets(initialOffsets);

    const signalInterval = setInterval(() => {
      const allNodes = [...innerOrbitNodes, ...outerOrbitNodes];
      const randomNode = allNodes[Math.floor(Math.random() * allNodes.length)];

      const pulseType = Math.random();
      let fromNode, toNode, color, type: 'radial' | 'cross';

      if (pulseType < 0.6) {
        fromNode = randomNode.id;
        toNode = 'platform';
        color = randomNode.color;
        type = 'radial';
      } else if (pulseType < 0.85 && crossConnections.length > 0) {
        const connection = crossConnections[Math.floor(Math.random() * crossConnections.length)];
        fromNode = connection.from;
        toNode = connection.to;
        color = connection.color;
        type = 'cross';
      } else {
        fromNode = 'platform';
        toNode = randomNode.id;
        color = randomNode.color;
        type = 'radial';
      }

      const newPulse: SignalPulse = {
        id: `pulse-${Date.now()}-${Math.random()}`,
        fromNode,
        toNode,
        progress: 0,
        color,
        type
      };

      setSignalPulses(prev => [...prev, newPulse]);

      setTimeout(() => {
        setSignalPulses(prev => prev.filter(p => p.id !== newPulse.id));
      }, 2500);
    }, 800);

    const sparkInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const newSpark: DiscoverySpark = {
          id: `spark-${Date.now()}`,
          x: Math.random() * 1000,
          y: Math.random() * 1000,
          opacity: 0,
          progress: 0
        };
        setDiscoverySparks(prev => [...prev, newSpark]);

        setTimeout(() => {
          setDiscoverySparks(prev => prev.filter(s => s.id !== newSpark.id));
        }, 3000);
      }
    }, 4000);

    const offsetInterval = setInterval(() => {
      setNodeOffsets(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = {
            x: updated[key].x + (Math.random() * 0.3 - 0.15),
            y: updated[key].y + (Math.random() * 0.3 - 0.15)
          };
          updated[key].x = Math.max(-3, Math.min(3, updated[key].x));
          updated[key].y = Math.max(-3, Math.min(3, updated[key].y));
        });
        return updated;
      });
    }, 100);

    const rotationInterval = setInterval(() => {
      setOrbitRotation(prev => (prev + 0.05) % 360);
    }, 50);

    const breathingInterval = setInterval(() => {
      const allNodes = [...innerOrbitNodes, ...outerOrbitNodes];
      setNodeBreathing(prev => {
        const updated: Record<string, NodeBreathing> = {};
        allNodes.forEach((node, index) => {
          const time = Date.now() / 1000;
          const offset = index * 0.5;
          updated[node.id] = {
            scale: 1.0 + Math.sin(time * 0.5 + offset) * 0.015
          };
        });
        return updated;
      });
    }, 50);

    const floatInterval = setInterval(() => {
      const time = Date.now() / 1000;
      setCenterFloat({
        y: Math.sin(time * 0.4) * 3,
        rotation: Math.sin(time * 0.2) * 0.5
      });
    }, 50);

    const sweepInterval = setInterval(() => {
      setNetworkSweep(0);
      const sweepDuration = 2000;
      const sweepStart = Date.now();
      const sweepTimer = setInterval(() => {
        const elapsed = Date.now() - sweepStart;
        const progress = Math.min(elapsed / sweepDuration, 1);
        setNetworkSweep(progress * 360);
        if (progress >= 1) {
          clearInterval(sweepTimer);
        }
      }, 16);
    }, 10000);

    return () => {
      clearInterval(signalInterval);
      clearInterval(sparkInterval);
      clearInterval(offsetInterval);
      clearInterval(rotationInterval);
      clearInterval(breathingInterval);
      clearInterval(floatInterval);
      clearInterval(sweepInterval);
    };
  }, []);

  const innerOrbitRadius = 170;
  const outerOrbitRadius = 295;
  const centerX = 500;
  const centerY = 500;

  const innerOrbitNodes = [
    { id: 'rocksteady', icon: Brain, label: 'Rocksteady', color: '#8b5cf6', angle: 0, radiusOffset: 18 },
    { id: 'tools', icon: Zap, label: 'Artist Tools', color: '#06b6d4', angle: 45, radiusOffset: 0 },
    { id: 'marketing', icon: Target, label: 'AI Marketing', color: '#ec4899', angle: 90, radiusOffset: 0 },
    { id: 'distribution', icon: Share2, label: 'Distribution', color: '#06b6d4', angle: 135, radiusOffset: 0 },
    { id: 'growth', icon: TrendingUp, label: 'Catalog Growth', color: '#8b5cf6', angle: 180, radiusOffset: 18 },
    { id: 'acquisition', icon: Album, label: 'Catalog Acquisition', color: '#d4af37', angle: 225, radiusOffset: 0 },
    { id: 'merch', icon: ShoppingBag, label: 'Merch & Products', color: '#d4af37', angle: 270, radiusOffset: 0 },
    { id: 'media', icon: Video, label: 'Media & Microseries', color: '#ec4899', angle: 315, radiusOffset: 0 }
  ];

  const outerOrbitNodes = [
    { id: 'artists', icon: Music, label: 'Artists', color: '#06b6d4', angle: 22.5, radiusOffset: 0 },
    { id: 'producers', icon: Headphones, label: 'Producers & Creators', color: '#8b5cf6', angle: 67.5, radiusOffset: 0 },
    { id: 'labels', icon: Briefcase, label: 'Independent Labels', color: '#ec4899', angle: 112.5, radiusOffset: 0 },
    { id: 'managers', icon: BarChart3, label: 'Managers', color: '#06b6d4', angle: 157.5, radiusOffset: 0 },
    { id: 'touring', icon: Radio, label: 'Touring', color: '#d4af37', angle: 207.5, radiusOffset: 0 },
    { id: 'fans', icon: Users, label: 'Fans & Audiences', color: '#8b5cf6', angle: 247.5, radiusOffset: 0 },
    { id: 'brands', icon: Sparkles, label: 'Creative Collaborators', color: '#ec4899', angle: 292.5, radiusOffset: 0 },
    { id: 'signals', icon: Activity, label: 'Cultural Signals', color: '#06b6d4', angle: 332.5, radiusOffset: 0 }
  ];

  const crossConnections = [
    { from: 'artists', to: 'signals', color: '#06b6d4' },
    { from: 'distribution', to: 'growth', color: '#8b5cf6' },
    { from: 'tools', to: 'marketing', color: '#ec4899' },
    { from: 'merch', to: 'brands', color: '#d4af37' },
  ];

  useEffect(() => {
    const animationFrame = requestAnimationFrame(function animate() {
      setSignalPulses(prev =>
        prev.map(pulse => ({
          ...pulse,
          progress: Math.min(pulse.progress + 0.015, 1)
        }))
      );

      setDiscoverySparks(prev =>
        prev.map(spark => {
          const newProgress = spark.progress + 0.008;
          let newOpacity = spark.opacity;
          if (newProgress < 0.3) {
            newOpacity = newProgress / 0.3;
          } else if (newProgress > 0.7) {
            newOpacity = (1 - newProgress) / 0.3;
          } else {
            newOpacity = 1;
          }
          return {
            ...spark,
            progress: newProgress,
            opacity: newOpacity
          };
        })
      );

      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const calculatePosition = (angle: number, radius: number, nodeId?: string, radiusOffset: number = 0) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const offset = nodeId && nodeOffsets[nodeId] ? nodeOffsets[nodeId] : { x: 0, y: 0 };
    const adjustedRadius = radius + radiusOffset;
    return {
      x: centerX + adjustedRadius * Math.cos(rad) + offset.x,
      y: centerY + adjustedRadius * Math.sin(rad) + offset.y
    };
  };

  const getNodePosition = (nodeId: string) => {
    if (nodeId === 'platform') {
      return { x: centerX, y: centerY };
    }
    const node = [...innerOrbitNodes, ...outerOrbitNodes].find(n => n.id === nodeId);
    if (!node) return { x: centerX, y: centerY };
    const isInner = innerOrbitNodes.includes(node);
    const radius = isInner ? innerOrbitRadius : outerOrbitRadius;
    const radiusOffset = node.radiusOffset || 0;
    return calculatePosition(node.angle, radius, node.id, radiusOffset);
  };

  const getConnectedNodes = (nodeId: string): string[] => {
    if (nodeId === 'platform') {
      return [...innerOrbitNodes, ...outerOrbitNodes].map(n => n.id);
    }
    const connected: string[] = ['platform'];
    crossConnections.forEach(conn => {
      if (conn.from === nodeId) connected.push(conn.to);
      if (conn.to === nodeId) connected.push(conn.from);
    });
    return connected;
  };

  const getCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const offsetX = -dy * 0.12;
    const offsetY = dx * 0.12;
    return `M ${x1},${y1} Q ${midX + offsetX},${midY + offsetY} ${x2},${y2}`;
  };

  const getNodeColor = (color: string) => {
    const colorMap: Record<string, string> = {
      '#ec4899': 'text-gmg-magenta',
      '#06b6d4': 'text-gmg-cyan',
      '#8b5cf6': 'text-gmg-violet',
      '#d4af37': 'text-gmg-gold'
    };
    return colorMap[color] || 'text-gmg-magenta';
  };

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/10 to-black"></div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gmg-violet/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gmg-magenta/8 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.5 }}>
        {stars.map((star, i) => (
          <circle
            key={`star-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="#ffffff"
            opacity={star.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
              dur={`${star.twinkleSpeed}s`}
              begin={`${star.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}

        {diamonds.map((diamond, i) => (
          <g key={`diamond-${i}`}>
            <polygon
              points="0,-4 3,0 0,4 -3,0"
              fill={diamond.color}
              opacity={diamond.opacity}
              transform={`translate(${diamond.x * 10}, ${diamond.y * 8}) rotate(${diamond.rotation}) scale(${diamond.size / 4})`}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${diamond.rotation} ${diamond.x * 10} ${diamond.y * 8}`}
                to={`${diamond.rotation + 360} ${diamond.x * 10} ${diamond.y * 8}`}
                dur="20s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values={`${diamond.opacity};${diamond.opacity * 1.8};${diamond.opacity}`}
                dur="4s"
                repeatCount="indefinite"
              />
            </polygon>
          </g>
        ))}
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Inside the GMG System</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-gmg-violet/70 mb-6">Every signal, system, and operator connects through Rocksteady.</p>
          <p className="text-xl text-gmg-white/90 max-w-3xl mx-auto leading-relaxed">
            GMG connects discovery, artist infrastructure, and cultural media into one system.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto" style={{ height: '750px' }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="constellation-glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <radialGradient id="core-glow">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1"/>
              </radialGradient>
              <linearGradient id="signal-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0"/>
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
              </linearGradient>
            </defs>

            <g transform={`rotate(${orbitRotation} ${centerX} ${centerY})`}>
              <circle
                cx={centerX}
                cy={centerY}
                r={innerOrbitRadius}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="0.5"
                opacity="0.15"
                strokeDasharray="4 4"
              />
            </g>

            <g transform={`rotate(${-orbitRotation * 0.7} ${centerX} ${centerY})`}>
              <circle
                cx={centerX}
                cy={centerY}
                r={outerOrbitRadius}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.5"
                opacity="0.1"
                strokeDasharray="6 6"
              />
            </g>

            {crossConnections.map((conn, idx) => {
              const fromPos = getNodePosition(conn.from);
              const toPos = getNodePosition(conn.to);
              const path = getCurvedPath(fromPos.x, fromPos.y, toPos.x, toPos.y);
              const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
              return (
                <g key={`cross-${idx}`}>
                  <path
                    d={path}
                    stroke={conn.color}
                    strokeWidth={isHighlighted ? "1.2" : "0.6"}
                    fill="none"
                    opacity={isHighlighted ? "0.4" : "0.12"}
                    filter={isHighlighted ? "url(#constellation-glow)" : "none"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                </g>
              );
            })}

            {[...innerOrbitNodes, ...outerOrbitNodes].map((node) => {
              const isInner = innerOrbitNodes.includes(node);
              const radius = isInner ? innerOrbitRadius : outerOrbitRadius;
              const radiusOffset = node.radiusOffset || 0;
              const pos = calculatePosition(node.angle, radius, node.id, radiusOffset);
              const shouldHighlight = hoveredNode === node.id || hoveredNode === 'platform';

              const angleDiff = Math.abs(node.angle - networkSweep);
              const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
              const isSweepNear = normalizedDiff < 30;
              const sweepIntensity = isSweepNear ? (1 - normalizedDiff / 30) * 0.3 : 0;

              return (
                <g key={`line-${node.id}`}>
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={centerX}
                    y2={centerY}
                    stroke={shouldHighlight ? node.color : '#8b5cf6'}
                    strokeWidth={shouldHighlight ? "1.5" : "0.5"}
                    opacity={shouldHighlight ? "0.5" : Math.max(0.12, sweepIntensity)}
                    filter={shouldHighlight || sweepIntensity > 0 ? "url(#constellation-glow)" : "none"}
                    style={{ transition: 'all 0.4s ease' }}
                  />
                </g>
              );
            })}

            {signalPulses.map(pulse => {
              const fromPos = getNodePosition(pulse.fromNode);
              const toPos = getNodePosition(pulse.toNode);

              let x, y;
              if (pulse.type === 'cross') {
                const midX = (fromPos.x + toPos.x) / 2;
                const midY = (fromPos.y + toPos.y) / 2;
                const dx = toPos.x - fromPos.x;
                const dy = toPos.y - fromPos.y;
                const offsetX = -dy * 0.12;
                const offsetY = dx * 0.12;
                const t = pulse.progress;
                const t1 = 1 - t;
                x = t1 * t1 * fromPos.x + 2 * t1 * t * (midX + offsetX) + t * t * toPos.x;
                y = t1 * t1 * fromPos.y + 2 * t1 * t * (midY + offsetY) + t * t * toPos.y;
              } else {
                x = fromPos.x + (toPos.x - fromPos.x) * pulse.progress;
                y = fromPos.y + (toPos.y - fromPos.y) * pulse.progress;
              }

              const opacity = pulse.progress < 0.1 ? pulse.progress / 0.1 : pulse.progress > 0.9 ? (1 - pulse.progress) / 0.1 : 1;

              return (
                <g key={pulse.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill={pulse.color}
                    opacity={opacity * 0.3}
                    filter="url(#constellation-glow)"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="2.5"
                    fill={pulse.color}
                    opacity={opacity * 0.9}
                    filter="url(#constellation-glow)"
                  />
                </g>
              );
            })}

            {discoverySparks.map(spark => (
              <g key={spark.id}>
                <polygon
                  points="0,-4 3,0 0,4 -3,0"
                  fill="#06b6d4"
                  opacity={spark.opacity * 0.6}
                  transform={`translate(${spark.x}, ${spark.y}) scale(${1 + spark.progress * 0.5})`}
                  filter="url(#constellation-glow)"
                />
              </g>
            ))}

            <circle
              cx={centerX}
              cy={centerY}
              r="120"
              fill="url(#core-glow)"
              opacity="0.25"
            >
              <animate
                attributeName="r"
                values="120;140;120"
                dur="8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.25;0.4;0.25"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={centerX}
              cy={centerY}
              r="80"
              fill="url(#core-glow)"
              opacity="0.15"
            >
              <animate
                attributeName="r"
                values="80;95;80"
                dur="6s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          <div
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{
              zIndex: 30,
              transform: `translate(-50%, calc(-50% + ${centerFloat.y}px)) rotate(${centerFloat.rotation}deg)`,
              transition: 'opacity 1s, transform 0.05s ease-out'
            }}
            onMouseEnter={() => setHoveredNode('platform')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <div className="relative group cursor-pointer flex flex-col items-center">
              <div
                className="absolute -inset-16 bg-gradient-to-br from-gmg-violet/30 via-gmg-magenta/20 to-gmg-cyan/20 rounded-full blur-3xl"
                style={{
                  transform: hoveredNode === 'platform' ? 'scale(1.4)' : 'scale(1)',
                  opacity: hoveredNode === 'platform' ? 0.8 : 0.5,
                  transition: 'all 0.6s ease'
                }}
              ></div>

              <div className="relative w-32 h-32 flex items-center justify-center">
                <img
                  src="/GMG_logo_Crown_black_and_color.png"
                  alt="GMG"
                  className="w-full h-full object-contain drop-shadow-2xl"
                  style={{
                    filter: hoveredNode === 'platform'
                      ? 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 40px rgba(236, 72, 153, 0.4))'
                      : 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5))',
                    transform: hoveredNode === 'platform' ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.4s ease'
                  }}
                />
              </div>

              <p
                className="text-sm font-bold text-center mt-4 px-4 py-1.5 rounded-lg backdrop-blur-md"
                style={{
                  color: hoveredNode === 'platform' ? '#8b5cf6' : '#ffffff',
                  backgroundColor: hoveredNode === 'platform' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(0, 0, 0, 0.3)',
                  textShadow: hoveredNode === 'platform' ? '0 0 15px rgba(139, 92, 246, 0.8)' : 'none',
                  transition: 'all 0.4s ease'
                }}
              >
                Greater Music Group
              </p>
            </div>
          </div>

          {[...innerOrbitNodes, ...outerOrbitNodes].map((node, index) => {
            const Icon = node.icon;
            const connectedNodes = hoveredNode ? getConnectedNodes(hoveredNode) : [];
            const isDirectlyHovered = hoveredNode === node.id;
            const isConnected = hoveredNode && connectedNodes.includes(node.id);
            const isHighlighted = isDirectlyHovered || isConnected;
            const isInner = innerOrbitNodes.includes(node);
            const radius = isInner ? innerOrbitRadius : outerOrbitRadius;
            const radiusOffset = node.radiusOffset || 0;
            const pos = calculatePosition(node.angle, radius, node.id, radiusOffset);

            const leftPercent = (pos.x / 1000) * 100;
            const topPercent = (pos.y / 1000) * 100;

            const angleDiff = Math.abs(node.angle - networkSweep);
            const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
            const isSweepNear = normalizedDiff < 30;
            const sweepIntensity = isSweepNear ? (1 - normalizedDiff / 30) : 0;

            const breathingScale = nodeBreathing[node.id]?.scale || 1.0;

            return (
              <div
                key={node.id}
                className={`absolute transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: `${400 + index * 50}ms`,
                  zIndex: 20
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="relative group cursor-pointer flex flex-col items-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
                      style={{
                        backgroundColor: node.color,
                        opacity: isDirectlyHovered ? 0.6 : isConnected ? 0.4 : sweepIntensity * 0.3,
                        transform: isDirectlyHovered ? 'scale(2)' : isConnected ? 'scale(1.5)' : `scale(${1 + sweepIntensity * 0.5})`
                      }}
                    />
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm border"
                      style={{
                        backgroundColor: isHighlighted ? `${node.color}25` : 'rgba(15, 15, 20, 0.9)',
                        borderColor: isDirectlyHovered ? `${node.color}` : isConnected ? `${node.color}70` : `${node.color}35`,
                        boxShadow: isDirectlyHovered ? `0 0 30px ${node.color}60, 0 0 20px ${node.color}40 inset` : isConnected ? `0 0 20px ${node.color}40` : sweepIntensity > 0 ? `0 0 ${sweepIntensity * 20}px ${node.color}40` : 'none',
                        transform: isDirectlyHovered ? 'scale(1.3)' : isConnected ? 'scale(1.15)' : `scale(${breathingScale})`
                      }}
                    >
                      <Icon
                        className={`w-6 h-6 ${getNodeColor(node.color)} transition-all duration-300`}
                        style={{
                          filter: isDirectlyHovered ? `drop-shadow(0 0 8px ${node.color})` : isConnected ? `drop-shadow(0 0 4px ${node.color})` : sweepIntensity > 0 ? `drop-shadow(0 0 ${sweepIntensity * 4}px ${node.color})` : 'none'
                        }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-[11px] font-semibold text-center mt-3 px-2.5 py-1 rounded-md backdrop-blur-sm transition-all duration-300 whitespace-nowrap"
                    style={{
                      color: isHighlighted ? node.color : '#ffffff',
                      opacity: isHighlighted ? 1 : 0.85 + sweepIntensity * 0.15,
                      backgroundColor: isHighlighted ? `${node.color}15` : 'rgba(0,0,0,0.3)',
                      textShadow: isHighlighted ? `0 0 10px ${node.color}80` : sweepIntensity > 0 ? `0 0 ${sweepIntensity * 8}px ${node.color}60` : 'none'
                    }}
                  >
                    {node.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`text-center mt-24 space-y-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-gmg-violet font-semibold">How It Works</p>
            <p className="text-2xl md:text-3xl font-light text-gmg-white/90">
              Artists emerge from cultural signals.
            </p>
            <p className="text-2xl md:text-3xl font-light text-gmg-white/90">
              GMG identifies them early, connects them to infrastructure, and scales their growth.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gmg-gray text-sm pt-4">
            <span className="flex items-center gap-2 px-4 py-2 bg-gmg-magenta/10 rounded-lg border border-gmg-magenta/20">
              <Activity className="w-4 h-4 text-gmg-magenta" />
              Cultural Signals
            </span>
            <span className="text-gmg-gray/40">→</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-gmg-violet/10 rounded-lg border border-gmg-violet/20">
              <Brain className="w-4 h-4 text-gmg-violet" />
              AI Discovery
            </span>
            <span className="text-gmg-gray/40">→</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-gmg-cyan/10 rounded-lg border border-gmg-cyan/20">
              <Music className="w-4 h-4 text-gmg-cyan" />
              Artist Growth
            </span>
            <span className="text-gmg-gray/40">→</span>
            <span className="flex items-center gap-2 px-4 py-2 bg-gmg-gold/10 rounded-lg border border-gmg-gold/20">
              <Sparkles className="w-4 h-4 text-gmg-gold" />
              Culture Impact
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
