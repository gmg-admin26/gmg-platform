import { useState, useEffect, useRef } from 'react';
import { Users, Zap, Music, TrendingUp, MapPin, Radio, X } from 'lucide-react';

type NetworkView = 'creative' | 'discovery' | 'activity';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  sublabel?: string;
  intensity: 'high' | 'medium' | 'low';
  roleKey?: string;
}

interface NodeRole {
  title: string;
  description: string;
  connectedTo: string[];
  color: string;
}

const NODE_ROLES: Record<string, NodeRole> = {
  artist: {
    title: 'Artist Node',
    description:
      'The core of the system. Artists generate releases, content, and cultural signals that drive all downstream activity.',
    connectedTo: ['Campaigns', 'Audience', 'AI Operators'],
    color: '#06B6D4',
  },
  scout: {
    title: 'AI Scout',
    description:
      'Identifies emerging artists, trends, and regional movements before they surface globally.',
    connectedTo: ['Artists', 'Signals', 'Campaign Strategy'],
    color: '#8B5CF6',
  },
  campaign: {
    title: 'Campaign System',
    description:
      'Executes releases, coordinates rollouts, and manages distribution, marketing, and content across platforms.',
    connectedTo: ['Artists', 'Audience', 'AI Operators'],
    color: '#10B981',
  },
  cultural: {
    title: 'Cultural Intelligence',
    description:
      'Tracks trends, scenes, and signals to position artists ahead of cultural shifts.',
    connectedTo: ['Signals', 'Campaign Strategy', 'Audience'],
    color: '#F59E0B',
  },
  audience: {
    title: 'Audience Network',
    description:
      'Captures fan behavior, engagement loops, and growth patterns to scale artist reach.',
    connectedTo: ['Campaigns', 'Artists', 'Signals'],
    color: '#06B6D4',
  },
};

const ROLE_KEYS = ['artist', 'scout', 'campaign', 'cultural', 'audience'];

const generateNodes = (view: NetworkView): NetworkNode[] => {
  const configs = {
    creative: {
      nodes: [
        { label: 'Artists', sublabel: 'Live signals active', intensity: 'high' as const },
        { label: 'Creators', sublabel: 'Cultural signals active', intensity: 'high' as const },
        { label: 'Scouts', sublabel: 'Discovery signals active', intensity: 'high' as const },
        { label: 'Marketers', sublabel: 'Campaign signals active', intensity: 'high' as const },
        { label: 'Producers', sublabel: 'Production signals active', intensity: 'medium' as const },
        { label: 'Managers', sublabel: 'Development signals active', intensity: 'medium' as const },
        { label: 'Cultural Operators', sublabel: 'Network signals active', intensity: 'medium' as const },
        { label: 'Fans & Audiences', sublabel: 'Audience signals active', intensity: 'medium' as const },
      ],
      color: '#06B6D4',
    },
    discovery: {
      nodes: [
        { label: 'Tealousy', sublabel: 'Rising Signal', intensity: 'high' as const },
        { label: 'Luke Prov', sublabel: 'Breakout', intensity: 'high' as const },
        { label: 'Lily Bedard', sublabel: 'Strong Signal', intensity: 'high' as const },
        { label: 'Nova Wave', sublabel: 'Rising', intensity: 'medium' as const },
        { label: 'Echo Rise', sublabel: 'Strong Signal', intensity: 'medium' as const },
        { label: 'Midnight Coast', sublabel: 'Very High', intensity: 'high' as const },
        { label: 'Luna Sol', sublabel: 'Emerging', intensity: 'low' as const },
        { label: 'Neon Pulse', sublabel: 'Breakout', intensity: 'high' as const },
      ],
      color: '#8B5CF6',
    },
    activity: {
      nodes: [
        { label: 'Discovery Scouting', sublabel: '1,240 active', intensity: 'high' as const },
        { label: 'Marketing Support', sublabel: '980 active', intensity: 'high' as const },
        { label: 'Content Creation', sublabel: '1,560 active', intensity: 'high' as const },
        { label: 'Playlist Research', sublabel: '720 active', intensity: 'medium' as const },
        { label: 'Scene Mapping', sublabel: '640 active', intensity: 'medium' as const },
        { label: 'Campaign Execution', sublabel: '890 active', intensity: 'high' as const },
        { label: 'Media Production', sublabel: '540 active', intensity: 'medium' as const },
        { label: 'Event Coordination', sublabel: '420 active', intensity: 'medium' as const },
      ],
      color: '#10B981',
    },
  };

  const config = configs[view];
  return config.nodes.map((node, i) => ({
    id: `${view}-${i}`,
    x: 20 + (i % 4) * 20 + Math.random() * 8,
    y: 25 + Math.floor(i / 4) * 35 + Math.random() * 8,
    size: node.intensity === 'high' ? 60 : node.intensity === 'medium' ? 50 : 40,
    color: config.color,
    label: node.label,
    sublabel: node.sublabel,
    intensity: node.intensity,
    roleKey: ROLE_KEYS[i % ROLE_KEYS.length],
  }));
};

export default function LaunchpadSignalNetwork() {
  const [activeView, setActiveView] = useState<NetworkView>('creative');
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [connections, setConnections] = useState<Array<[number, number]>>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newNodes = generateNodes(activeView);
    setNodes(newNodes);

    const newConnections: Array<[number, number]> = [];
    for (let i = 0; i < newNodes.length; i++) {
      for (let j = i + 1; j < newNodes.length; j++) {
        if (Math.random() > 0.65) {
          newConnections.push([i, j]);
        }
      }
    }
    setConnections(newConnections);
    setSelectedNode(null);
    setPanelVisible(false);
  }, [activeView]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelectedNode(null);
        setPanelVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNodeClick = (nodeId: string) => {
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setPanelVisible(false);
    } else {
      setSelectedNode(nodeId);
      setPanelVisible(true);
    }
  };

  const activeInteraction = selectedNode ?? hoveredNode;

  const views = [
    { id: 'creative' as NetworkView, icon: MapPin, label: 'Creative Network', color: '#06B6D4' },
    { id: 'discovery' as NetworkView, icon: Zap, label: 'Discovery Signals', color: '#8B5CF6' },
    { id: 'activity' as NetworkView, icon: TrendingUp, label: 'Artist Activity', color: '#10B981' },
  ];

  const activeViewData = views.find(v => v.id === activeView);

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const selectedRole = selectedNodeData?.roleKey ? NODE_ROLES[selectedNodeData.roleKey] : null;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex gap-3 mb-6">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex-1 relative px-4 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                isActive ? 'scale-105' : 'hover:scale-102'
              }`}
              style={{
                backgroundColor: isActive ? `${view.color}25` : 'rgba(255,255,255,0.05)',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: isActive ? view.color : 'rgba(255,255,255,0.1)',
                boxShadow: isActive
                  ? `0 0 30px ${view.color}40, 0 4px 16px rgba(0,0,0,0.4)`
                  : 'none',
                color: isActive ? view.color : 'rgba(255,255,255,0.5)',
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                <span className="whitespace-nowrap">{view.label}</span>
                {isActive && (
                  <div className="relative flex items-center justify-center ml-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: view.color }}></div>
                    <div
                      className="absolute w-4 h-4 rounded-full animate-ping"
                      style={{ backgroundColor: view.color, opacity: 0.5 }}
                    ></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="relative w-full rounded-2xl bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-xl border border-white/10 overflow-hidden"
        style={{ height: '500px' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id={`launchpad-gradient-${activeView}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={activeViewData?.color || '#8B5CF6'} stopOpacity="0" />
              <stop offset="50%" stopColor={activeViewData?.color || '#8B5CF6'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={activeViewData?.color || '#8B5CF6'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {connections.map(([i, j], idx) => {
            const node1 = nodes[i];
            const node2 = nodes[j];
            if (!node1 || !node2) return null;

            const isConnectedToActive =
              activeInteraction !== null &&
              (node1.id === activeInteraction || node2.id === activeInteraction);
            const isUnrelated = activeInteraction !== null && !isConnectedToActive;

            return (
              <line
                key={idx}
                x1={`${node1.x}%`}
                y1={`${node1.y}%`}
                x2={`${node2.x}%`}
                y2={`${node2.y}%`}
                stroke={
                  isConnectedToActive
                    ? activeViewData?.color
                    : `url(#launchpad-gradient-${activeView})`
                }
                strokeWidth={isConnectedToActive ? '2.5' : '1.5'}
                className="animate-pulse"
                style={{
                  animationDuration: `${3 + Math.random() * 3}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: isUnrelated ? 0.1 : isConnectedToActive ? 0.9 : 1,
                  transition: 'opacity 0.3s, stroke-width 0.3s',
                }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {nodes.map((node) => {
            const getOpacity = (intensity: string) => {
              switch (intensity) {
                case 'high': return 0.8;
                case 'medium': return 0.6;
                default: return 0.4;
              }
            };

            const opacity = getOpacity(node.intensity);
            const glowSize = node.size * 0.6;

            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;
            const isActive = isHovered || isSelected;
            const isDimmed = activeInteraction !== null && !isActive && node.id !== activeInteraction;
            const hoverScale = isActive ? 1.25 : 1;
            const hoverGlow = isActive ? glowSize * 2 : glowSize;

            return (
              <div
                key={node.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isDimmed ? 0.3 : 1,
                  transition: 'opacity 0.3s',
                  zIndex: isActive ? 5 : 2,
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className="relative group">
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: `${node.size}px`,
                      height: `${node.size}px`,
                      backgroundColor: `${node.color}${Math.floor(opacity * 100)}`,
                      border: isSelected
                        ? `3px solid ${node.color}`
                        : `2px solid ${node.color}`,
                      boxShadow: isSelected
                        ? `0 0 ${hoverGlow * 1.5}px ${node.color}, 0 0 ${hoverGlow * 0.5}px ${node.color}40`
                        : `0 0 ${hoverGlow}px ${node.color}`,
                      animation: node.intensity === 'high' ? 'pulse 2s ease-in-out infinite' : 'none',
                      transform: `scale(${hoverScale})`,
                    }}
                  >
                    {node.intensity === 'high' && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping"
                        style={{
                          backgroundColor: node.color,
                          opacity: 0.4,
                          animationDuration: '2s',
                        }}
                      ></div>
                    )}
                  </div>

                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <div
                      className="bg-black/90 backdrop-blur-xl border rounded-lg px-3 py-2"
                      style={{ borderColor: node.color }}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{node.label}</div>
                      {node.sublabel && (
                        <div className="text-[10px]" style={{ color: node.color }}>
                          {node.sublabel}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2"
          style={{ zIndex: 10 }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeViewData?.color }}
          ></div>
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: activeViewData?.color }}
          >
            {activeViewData?.label}
          </span>
        </div>

        {selectedNode && !panelVisible && null}
      </div>

      <div
        className="relative overflow-hidden rounded-2xl mt-4 transition-all duration-400"
        style={{
          maxHeight: panelVisible && selectedRole ? '280px' : '0px',
          opacity: panelVisible && selectedRole ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        }}
      >
        {selectedRole && selectedNodeData && (
          <div
            className="rounded-2xl backdrop-blur-xl border p-6"
            style={{
              backgroundColor: `${selectedRole.color}08`,
              borderColor: `${selectedRole.color}30`,
              boxShadow: `0 0 40px ${selectedRole.color}15`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: selectedRole.color,
                    boxShadow: `0 0 8px ${selectedRole.color}`,
                  }}
                ></div>
                <div>
                  <p
                    className="text-[10px] font-bold tracking-[0.2em] uppercase mb-0.5"
                    style={{ color: `${selectedRole.color}99` }}
                  >
                    System Node
                  </p>
                  <h4 className="text-lg font-black text-white leading-tight">
                    {selectedRole.title}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => { setSelectedNode(null); setPanelVisible(false); }}
                className="text-white/30 hover:text-white/70 transition-colors p-1 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/60 font-light leading-relaxed mb-5">
              {selectedRole.description}
            </p>

            <div>
              <p
                className="text-[10px] font-bold tracking-[0.2em] uppercase mb-3"
                style={{ color: `${selectedRole.color}80` }}
              >
                Connected To
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedRole.connectedTo.map((label, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border"
                    style={{
                      backgroundColor: `${selectedRole.color}12`,
                      borderColor: `${selectedRole.color}30`,
                      color: selectedRole.color,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
