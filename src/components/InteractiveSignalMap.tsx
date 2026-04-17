import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { TrendingUp, Zap, Users, Music, Radio, Mic, Globe, Waves, Sliders, PenTool, MapPin, Network } from 'lucide-react';

type DiscoveryLayer =
  | 'artist-signals'
  | 'scene-heatmap'
  | 'producer-heatmap'
  | 'songwriter-heatmap'
  | 'genre-momentum'
  | 'superfan-clusters';

type SignalIntensity = 'weak' | 'rising' | 'breakout';

interface SignalNode {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  growth: number;
  momentum: 'Explosive' | 'Very High' | 'Strong' | 'Rising' | 'Emerging';
  intensity: SignalIntensity;
  location?: string;
  data: Record<string, any>;
}

interface Layer {
  id: DiscoveryLayer;
  icon: any;
  label: string;
  color: string;
  description: string;
}

const layers: Layer[] = [
  { id: 'artist-signals', icon: Waves, label: 'Artist Heat Map', color: '#8B5CF6', description: 'Tracks emerging artist momentum across regions and platforms.' },
  { id: 'scene-heatmap', icon: MapPin, label: 'Scene Heat Map', color: '#06B6D4', description: 'Maps regional music scenes and cultural movement hotspots.' },
  { id: 'producer-heatmap', icon: Sliders, label: 'Producer Heat Map', color: '#EC4899', description: 'Identifies rising producers and studio collaborators driving new sounds.' },
  { id: 'songwriter-heatmap', icon: PenTool, label: 'Songwriter Heat Map', color: '#EAB308', description: 'Detects emerging songwriters and creative collaboration patterns.' },
  { id: 'genre-momentum', icon: TrendingUp, label: 'Genre Momentum', color: '#10B981', description: 'Analyzes micro-genres and predicts mainstream traction patterns.' },
  { id: 'superfan-clusters', icon: Network, label: 'Superfan Clusters', color: '#F59E0B', description: 'Maps passionate communities driving artist discovery and growth.' },
];

const getIntensityFromGrowth = (growth: number): SignalIntensity => {
  if (growth >= 200) return 'breakout';
  if (growth >= 150) return 'rising';
  return 'weak';
};

const STATIC_OFFSETS: number[][] = [
  [2, 3], [6, -2], [-3, 4], [5, -4], [-1, 2], [4, 3], [-5, -2], [3, 5],
];

const generateNodes = (layer: DiscoveryLayer): SignalNode[] => {
  const configs: Record<DiscoveryLayer, any> = {
    'artist-signals': {
      nodes: [
        { label: 'Tealousy', growth: 156, momentum: 'Strong', location: 'Los Angeles, CA', data: { signals: ['Spotify Saves', 'TikTok Velocity', 'Playlist Expansion', 'Tour Ticket Demand'] } },
        { label: 'Luke Prov', growth: 243, momentum: 'Explosive', location: 'Nashville, TN', data: { signals: ['Stream Growth', 'Social Engagement', 'Radio Spins', 'YouTube Views'] } },
        { label: 'Lily Bedard', growth: 189, momentum: 'Very High', location: 'Brooklyn, NY', data: { signals: ['Fan Growth', 'Playlist Adds', 'Concert Sales', 'Brand Interest'] } },
        { label: 'Nova Wave', growth: 134, momentum: 'Rising', location: 'Austin, TX', data: { signals: ['Discovery Metrics', 'Engagement Rate', 'Festival Bookings'] } },
        { label: 'Echo Rise', growth: 167, momentum: 'Strong', location: 'Portland, OR', data: { signals: ['Streaming Velocity', 'Social Mentions', 'Playlist Momentum'] } },
        { label: 'Midnight Coast', growth: 201, momentum: 'Very High', location: 'Miami, FL', data: { signals: ['Audience Growth', 'Content Virality', 'Industry Buzz'] } },
        { label: 'Luna Sol', growth: 98, momentum: 'Emerging', location: 'Seattle, WA', data: { signals: ['Early Traction', 'Community Building', 'Content Strategy'] } },
        { label: 'Neon Pulse', growth: 223, momentum: 'Explosive', location: 'Atlanta, GA', data: { signals: ['Breakout Track', 'Viral Moment', 'Label Interest'] } },
      ],
      color: '#8B5CF6',
    },
    'scene-heatmap': {
      nodes: [
        { label: 'Austin Indie Scene', growth: 278, momentum: 'Very High', data: { artists: 42, releases: 187, sound: 'Indie Pop + Dream Pop' } },
        { label: 'Atlanta Trap Wave', growth: 312, momentum: 'Explosive', data: { artists: 67, releases: 234, sound: 'Melodic Trap + R&B' } },
        { label: 'Brooklyn Alt Pop', growth: 189, momentum: 'Strong', data: { artists: 38, releases: 156, sound: 'Alt Pop + Indie Rock' } },
        { label: 'Nashville Indie Folk', growth: 145, momentum: 'Rising', data: { artists: 29, releases: 98, sound: 'Folk Pop + Americana' } },
        { label: 'Berlin Electronic', growth: 267, momentum: 'Very High', data: { artists: 54, releases: 201, sound: 'Techno + House' } },
        { label: 'LA Bedroom Pop', growth: 198, momentum: 'Strong', data: { artists: 45, releases: 167, sound: 'Bedroom Pop + Lo-Fi' } },
        { label: 'Miami Latin Urban', growth: 289, momentum: 'Explosive', data: { artists: 61, releases: 223, sound: 'Reggaeton + Latin Trap' } },
        { label: 'Seattle Grunge Revival', growth: 134, momentum: 'Emerging', data: { artists: 31, releases: 89, sound: 'Alt Rock + Grunge' } },
      ],
      color: '#06B6D4',
    },
    'producer-heatmap': {
      nodes: [
        { label: '808Marco Network', growth: 234, momentum: 'Explosive', data: { cluster: 'Melodic Trap Producers', collaborations: 64, breakoutTracks: 5 } },
        { label: 'BeatsByNova', growth: 198, momentum: 'Very High', data: { cluster: 'Indie Pop Producers', collaborations: 48, breakoutTracks: 3 } },
        { label: 'SynthWave Collective', growth: 167, momentum: 'Strong', data: { cluster: 'Electronic Producers', collaborations: 37, breakoutTracks: 4 } },
        { label: 'Urban Knights', growth: 256, momentum: 'Explosive', data: { cluster: 'Hip Hop Producers', collaborations: 71, breakoutTracks: 6 } },
        { label: 'Indie Rock Guild', growth: 145, momentum: 'Rising', data: { cluster: 'Rock Producers', collaborations: 42, breakoutTracks: 2 } },
        { label: 'Pop Factory', growth: 223, momentum: 'Very High', data: { cluster: 'Pop Producers', collaborations: 58, breakoutTracks: 7 } },
        { label: 'Lo-Fi Lounge', growth: 189, momentum: 'Strong', data: { cluster: 'Lo-Fi Producers', collaborations: 51, breakoutTracks: 3 } },
        { label: 'Bass Collective', growth: 178, momentum: 'Strong', data: { cluster: 'Bass Music Producers', collaborations: 44, breakoutTracks: 4 } },
      ],
      color: '#EC4899',
    },
    'songwriter-heatmap': {
      nodes: [
        { label: 'Maya Torres', growth: 203, momentum: 'Very High', data: { songs: 14, artists: 8, genre: 'Pop / Indie Pop' } },
        { label: 'Jake Rivers', growth: 178, momentum: 'Strong', data: { songs: 11, artists: 6, genre: 'Alt Rock / Pop Rock' } },
        { label: 'Sophia Chen', growth: 245, momentum: 'Explosive', data: { songs: 18, artists: 10, genre: 'R&B / Soul' } },
        { label: 'Marcus Lee', growth: 167, momentum: 'Strong', data: { songs: 12, artists: 7, genre: 'Hip Hop / Trap' } },
        { label: 'Emma Clarke', growth: 189, momentum: 'Strong', data: { songs: 15, artists: 9, genre: 'Indie Folk / Singer-Songwriter' } },
        { label: 'David Park', growth: 212, momentum: 'Very High', data: { songs: 16, artists: 8, genre: 'Electronic / Dance' } },
        { label: 'Olivia Santos', growth: 198, momentum: 'Very High', data: { songs: 13, artists: 7, genre: 'Latin Pop / Urban' } },
        { label: 'Alex Morgan', growth: 156, momentum: 'Rising', data: { songs: 9, artists: 5, genre: 'Country Pop / Americana' } },
      ],
      color: '#EAB308',
    },
    'genre-momentum': {
      nodes: [
        { label: 'Alt R&B', growth: 312, momentum: 'Explosive', data: { artists: 127, playlists: ['New Music Friday', 'Fresh Finds', 'R&B Rising'] } },
        { label: 'Hyperpop', growth: 289, momentum: 'Explosive', data: { artists: 98, playlists: ['Hyperpop', 'PC Music', 'Internet Pop'] } },
        { label: 'Afrobeats Pop', growth: 267, momentum: 'Very High', data: { artists: 156, playlists: ['Afrobeats Hits', 'African Heat', 'Global Rhythms'] } },
        { label: 'Bedroom Pop', growth: 234, momentum: 'Very High', data: { artists: 134, playlists: ['Bedroom Pop', 'Lo-Fi Indie', 'Chill Vibes'] } },
        { label: 'Indie Folk', growth: 198, momentum: 'Strong', data: { artists: 89, playlists: ['Folk Pop', 'Indie Americana', 'Acoustic Gems'] } },
        { label: 'Melodic Trap', growth: 256, momentum: 'Explosive', data: { artists: 143, playlists: ['Trap Nation', 'Melodic Vibes', 'New Hip Hop'] } },
        { label: 'Dream Pop', growth: 223, momentum: 'Very High', data: { artists: 112, playlists: ['Dream Pop', 'Shoegaze Revival', 'Ethereal Sounds'] } },
        { label: 'Country Pop', growth: 189, momentum: 'Strong', data: { artists: 76, playlists: ['Hot Country', 'New Nashville', 'Country Crossover'] } },
      ],
      color: '#10B981',
    },
    'superfan-clusters': {
      nodes: [
        { label: 'Hyperpop Discord', growth: 278, momentum: 'Very High', data: { members: '45K', engagement: 'Very High', activity: 'Daily drops, remix culture' } },
        { label: 'Bedroom Pop TikTok', growth: 312, momentum: 'Explosive', data: { members: '2.3M', engagement: 'Explosive', activity: 'Viral sounds, artist discovery' } },
        { label: 'EDM Festival Fans', growth: 234, momentum: 'Very High', data: { members: '890K', engagement: 'High', activity: 'Live sets, tour followings' } },
        { label: 'Indie Folk Community', growth: 189, momentum: 'Strong', data: { members: '167K', engagement: 'Strong', activity: 'Album discussions, vinyl culture' } },
        { label: 'Trap Reddit', growth: 256, momentum: 'Explosive', data: { members: '523K', engagement: 'Very High', activity: 'Producer breakdowns, leak culture' } },
        { label: 'K-Pop Stan Twitter', growth: 298, momentum: 'Explosive', data: { members: '5.6M', engagement: 'Explosive', activity: 'Stream parties, voting campaigns' } },
        { label: 'Metal YouTube', growth: 178, momentum: 'Strong', data: { members: '712K', engagement: 'Strong', activity: 'Reaction videos, gear reviews' } },
        { label: 'Jazz Vinyl Collectors', growth: 145, momentum: 'Rising', data: { members: '89K', engagement: 'Moderate', activity: 'Rare finds, reissues' } },
      ],
      color: '#F59E0B',
    },
  };

  const config = configs[layer];
  return config.nodes.map((node: any, i: number) => ({
    id: `${layer}-${i}`,
    x: 20 + (i % 4) * 20 + STATIC_OFFSETS[i][0],
    y: 25 + Math.floor(i / 4) * 30 + STATIC_OFFSETS[i][1],
    size: 40 + node.growth / 5,
    color: config.color,
    label: node.label,
    growth: node.growth,
    momentum: node.momentum,
    intensity: getIntensityFromGrowth(node.growth),
    location: node.location,
    data: node.data,
  }));
};

const STATIC_CONNECTIONS: Array<[number, number]> = [
  [0, 2], [0, 4], [1, 3], [1, 5], [2, 6], [3, 7], [4, 6], [5, 7], [0, 7],
];

const getIntensityLabel = (intensity: SignalIntensity) => {
  switch (intensity) {
    case 'breakout': return 'Breakout Signal';
    case 'rising': return 'Rising Signal';
    case 'weak': return 'Weak Signal';
  }
};

const getIntensityColor = (intensity: SignalIntensity) => {
  switch (intensity) {
    case 'breakout': return '#EF4444';
    case 'rising': return '#F59E0B';
    case 'weak': return '#6B7280';
  }
};

const getSignalType = (layer: DiscoveryLayer) => {
  switch (layer) {
    case 'artist-signals': return 'Artist Signal';
    case 'scene-heatmap': return 'Scene Signal';
    case 'producer-heatmap': return 'Producer Signal';
    case 'songwriter-heatmap': return 'Songwriter Signal';
    case 'genre-momentum': return 'Genre Signal';
    case 'superfan-clusters': return 'Community Signal';
  }
};

const SignalCard = ({ node, layer, onClose }: { node: SignalNode; layer: DiscoveryLayer; onClose: () => void }) => {
  const getCardPosition = () => {
    const isTopHalf = node.y < 50;
    if (isTopHalf && node.y < 30) return 'translate(-50%, 10%)';
    if (node.x > 75) return 'translate(-100%, -120%)';
    if (node.x < 25) return 'translate(0%, -120%)';
    return 'translate(-50%, -120%)';
  };

  const renderContent = () => {
    switch (layer) {
      case 'artist-signals':
        return (
          <>
            <div className="mb-4 pb-4 border-b border-gmg-gray/10">
              {node.location && <div className="text-xs text-gmg-gray/80 mb-2">{node.location}</div>}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-gmg-gray/60 uppercase tracking-wider">{getSignalType(layer)}</span>
                <div className="w-1 h-1 rounded-full bg-gmg-gray/40"></div>
                <span className="text-xs font-black uppercase" style={{ color: getIntensityColor(node.intensity) }}>
                  {getIntensityLabel(node.intensity)}
                </span>
              </div>
            </div>
            <h4 className="text-sm font-black text-gmg-white mb-4">Breaking Artist Signal</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gmg-gray/10">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-bold">Signals Detected</div>
              <div className="space-y-1.5">
                {node.data.signals.map((signal: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-gmg-gray/80">
                    <Zap className="w-3 h-3 text-gmg-cyan flex-shrink-0" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'scene-heatmap':
        return (
          <>
            <h4 className="text-sm font-black text-gmg-white mb-4">Regional Emergence</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Active Artists</div>
                <div className="text-xl font-black text-gmg-white">{node.data.artists}</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">New Releases</div>
                <div className="text-xl font-black text-gmg-white">{node.data.releases}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gmg-gray/10">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-bold">Top Sound</div>
              <div className="text-[11px] text-gmg-cyan font-semibold">{node.data.sound}</div>
            </div>
          </>
        );
      case 'producer-heatmap':
        return (
          <>
            <h4 className="text-sm font-black text-gmg-white mb-4">Producer Network</h4>
            <div className="mb-4">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Cluster</div>
              <div className="text-sm font-black text-gmg-magenta">{node.data.cluster}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Collaborations</div>
                <div className="text-xl font-black text-gmg-white">{node.data.collaborations} artists</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Breakout Tracks</div>
                <div className="text-xl font-black text-gmg-white">{node.data.breakoutTracks} songs</div>
              </div>
            </div>
          </>
        );
      case 'songwriter-heatmap':
        return (
          <>
            <h4 className="text-sm font-black text-gmg-white mb-4">Songwriter Momentum</h4>
            <div className="mb-4">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Writer</div>
              <div className="text-sm font-black text-gmg-gold">{node.label}</div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Songs Placed</div>
                <div className="text-xl font-black text-gmg-white">{node.data.songs}</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Artists</div>
                <div className="text-xl font-black text-gmg-white">{node.data.artists}</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gmg-gray/10">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-bold">Genre Focus</div>
              <div className="text-[11px] text-gmg-gold font-semibold">{node.data.genre}</div>
            </div>
          </>
        );
      case 'genre-momentum':
        return (
          <>
            <h4 className="text-sm font-black text-gmg-white mb-4">Genre Momentum</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Emerging Artists</div>
              <div className="text-xl font-black text-gmg-white">{node.data.artists}</div>
            </div>
            <div className="pt-4 border-t border-gmg-gray/10">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-bold">Top Playlist Adds</div>
              <div className="space-y-1.5">
                {node.data.playlists.map((playlist: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-gmg-gray/80">
                    <Music className="w-3 h-3 text-gmg-green flex-shrink-0" />
                    <span>{playlist}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case 'superfan-clusters':
        return (
          <>
            <h4 className="text-sm font-black text-gmg-white mb-4">Superfan Community</h4>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Growth</div>
                <div className="text-2xl font-black text-gmg-cyan">↑ {node.growth}%</div>
              </div>
              <div>
                <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Momentum</div>
                <div className="text-sm font-black text-gmg-white">{node.momentum}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Community Size</div>
              <div className="text-xl font-black text-gmg-white">{node.data.members}</div>
            </div>
            <div className="mb-4">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-1 font-bold">Engagement</div>
              <div className="text-sm font-black text-gmg-orange">{node.data.engagement}</div>
            </div>
            <div className="pt-4 border-t border-gmg-gray/10">
              <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-bold">Activity</div>
              <div className="text-[11px] text-gmg-gray/80">{node.data.activity}</div>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="absolute z-50 bg-gradient-to-br from-gmg-graphite/95 to-gmg-charcoal/95 backdrop-blur-2xl border border-gmg-cyan/40 rounded-2xl p-5 w-72"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: getCardPosition(),
        boxShadow: `0 0 60px ${node.color}80, inset 0 0 20px rgba(0,0,0,0.3)`,
        pointerEvents: 'none',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-black text-gmg-white leading-tight">{node.label}</h3>
        <button
          onPointerDown={(e) => { e.stopPropagation(); onClose(); }}
          className="text-gmg-gray/60 hover:text-gmg-white transition-colors text-xl leading-none"
          style={{ pointerEvents: 'auto' }}
        >
          ×
        </button>
      </div>
      {renderContent()}
    </div>
  );
};

export default function InteractiveSignalMap() {
  const [activeLayer, setActiveLayer] = useState<DiscoveryLayer>('artist-signals');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nodes = useMemo(() => generateNodes(activeLayer), [activeLayer]);

  const hoveredNode = useMemo(
    () => nodes.find((n) => n.id === hoveredNodeId) ?? null,
    [nodes, hoveredNodeId]
  );

  const activeLayerData = useMemo(
    () => layers.find((l) => l.id === activeLayer),
    [activeLayer]
  );

  const handleNodeEnter = useCallback((id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoveredNodeId(id), 60);
  }, []);

  const handleNodeLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setHoveredNodeId(null), 120);
  }, []);

  useEffect(() => {
    setHoveredNodeId(null);
  }, [activeLayer]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  return (
    <div className="relative max-w-7xl mx-auto">
      <style>{`
        @keyframes signalPulse {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.04); }
        }
        @keyframes signalRing {
          0% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.4); }
        }
        .signal-node { animation: signalPulse 3.5s ease-in-out infinite; }
        .signal-ring { animation: signalRing 2.8s ease-out infinite; }
        .signal-ring-slow { animation: signalRing 3.8s ease-out infinite 0.6s; }
      `}</style>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-3">
          <Zap className="w-3.5 h-3.5 text-violet-300" />
          <span className="text-xs font-black text-violet-200 uppercase tracking-wider">Discovery Intelligence Maps</span>
        </div>
        <p className="text-sm text-gray-400 font-medium">
          Select a signal layer to explore different discovery heat maps
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`group relative px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 ${
                isActive ? 'scale-105' : 'hover:-translate-y-0.5'
              }`}
              style={{
                backgroundColor: isActive ? `${layer.color}25` : 'rgba(24, 24, 27, 0.6)',
                borderWidth: '2px',
                borderColor: isActive ? layer.color : 'rgba(255,255,255,0.1)',
                boxShadow: isActive
                  ? `0 0 40px ${layer.color}50, 0 8px 24px rgba(0,0,0,0.4)`
                  : '0 4px 12px rgba(0,0,0,0.3)',
                color: isActive ? layer.color : '#9CA3AF',
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{layer.label}</span>
                {isActive && (
                  <div className="relative flex items-center justify-center ml-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color }} />
                    <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: layer.color, opacity: 0.4 }} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {activeLayerData && (
        <div className="mb-8 text-center">
          <div
            className="inline-block px-6 py-3 rounded-xl bg-black/60 border backdrop-blur-sm"
            style={{ borderColor: `${activeLayerData.color}30`, boxShadow: `0 0 30px ${activeLayerData.color}20` }}
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: activeLayerData.color }}>
                {activeLayerData.label}
              </span>
            </div>
            <p className="text-sm text-gray-300 font-medium">{activeLayerData.description}</p>
          </div>
        </div>
      )}

      {activeLayerData && (
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Active Signal Map</span>
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm"
            style={{ backgroundColor: `${activeLayerData.color}10`, borderColor: `${activeLayerData.color}40` }}
          >
            <activeLayerData.icon className="w-4 h-4" style={{ color: activeLayerData.color }} />
            <span className="text-sm font-black uppercase tracking-wide" style={{ color: activeLayerData.color }}>
              {activeLayerData.label}
            </span>
            <div className="relative flex items-center justify-center ml-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeLayerData.color }} />
              <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: activeLayerData.color, opacity: 0.4 }} />
            </div>
          </div>
        </div>
      )}

      <div
        className="relative w-full rounded-3xl bg-gradient-to-br from-gmg-charcoal/60 to-gmg-graphite/40 backdrop-blur-xl border border-gmg-gray/20 overflow-hidden"
        style={{
          height: '600px',
          boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        }}
      >
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id={`gradient-${activeLayer}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={nodes[0]?.color || '#8B5CF6'} stopOpacity="0" />
              <stop offset="50%" stopColor={nodes[0]?.color || '#8B5CF6'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={nodes[0]?.color || '#8B5CF6'} stopOpacity="0" />
            </linearGradient>
          </defs>
          {STATIC_CONNECTIONS.map(([i, j], idx) => {
            const node1 = nodes[i];
            const node2 = nodes[j];
            if (!node1 || !node2) return null;
            return (
              <line
                key={idx}
                x1={`${node1.x}%`}
                y1={`${node1.y}%`}
                x2={`${node2.x}%`}
                y2={`${node2.y}%`}
                stroke={`url(#gradient-${activeLayer})`}
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
        </svg>

        <div className="absolute inset-0" style={{ zIndex: 2, pointerEvents: 'none' }}>
          {nodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            const glowSize = node.intensity === 'breakout' ? 28 : node.intensity === 'rising' ? 18 : 10;
            const opacity = node.intensity === 'weak' ? 0.3 : node.intensity === 'rising' ? 0.5 : 0.7;

            return (
              <div
                key={node.id}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${node.size + 24}px`,
                  height: `${node.size + 24}px`,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: isHovered ? 10 : 2,
                }}
                onMouseEnter={() => handleNodeEnter(node.id)}
                onMouseLeave={handleNodeLeave}
              >
                {node.intensity !== 'weak' && (
                  <div
                    className={node.intensity === 'breakout' ? 'signal-ring' : 'signal-ring-slow'}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: `${node.size}px`,
                      height: `${node.size}px`,
                      borderRadius: '50%',
                      border: `1px solid ${node.color}`,
                      opacity: 0,
                    }}
                  />
                )}

                <div
                  className="signal-node absolute rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                    backgroundColor: `${node.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`,
                    border: `${node.intensity === 'breakout' ? '3px' : '2px'} solid ${node.color}`,
                    boxShadow: isHovered
                      ? `0 0 ${glowSize * 2}px ${node.color}, 0 0 ${glowSize}px ${node.color}80`
                      : `0 0 ${glowSize}px ${node.color}80`,
                    transition: 'box-shadow 0.3s ease',
                    animationDelay: `${(parseInt(node.id.slice(-1)) || 0) * 0.4}s`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {hoveredNode && (
          <div style={{ zIndex: 50, pointerEvents: 'none' }} className="absolute inset-0">
            <SignalCard
              node={hoveredNode}
              layer={activeLayer}
              onClose={() => setHoveredNodeId(null)}
            />
          </div>
        )}

        <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-xl border border-gray-700/40 rounded-xl p-4" style={{ zIndex: 10, pointerEvents: 'none' }}>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-black">Signal Intensity</div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="relative w-4 h-4 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gray-500/30 border border-gray-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400">Weak Signal</div>
                <div className="text-[10px] text-gray-500">Early detection</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-4 h-4 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-orange-500/50 border-2 border-orange-500" />
                <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <div className="text-xs font-bold text-orange-400">Rising Signal</div>
                <div className="text-[10px] text-gray-500">Momentum building</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-4 h-4 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-red-500/70 border-2 border-red-500" style={{ boxShadow: '0 0 12px rgba(239, 68, 68, 0.8)' }} />
                <div className="absolute inset-0 rounded-full bg-red-500/50 animate-ping" style={{ animationDuration: '2s' }} />
              </div>
              <div>
                <div className="text-xs font-bold text-red-400">Breakout Signal</div>
                <div className="text-[10px] text-gray-500">Rapid cultural acceleration</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal/40 backdrop-blur-xl border border-gmg-violet/30 rounded-2xl p-6" style={{ boxShadow: '0 0 40px rgba(139, 92, 246, 0.2)' }}>
          <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-black">Trending Signals Detected</div>
          <h4 className="text-sm font-black text-gmg-violet mb-3">Emerging Artists</h4>
          <div className="space-y-2">
            {['Tealousy', 'Luke Prov', 'Lily Bedard'].map((artist, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gmg-white/80">
                <div className="w-1 h-1 rounded-full bg-gmg-violet flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(139, 92, 246, 0.6)' }} />
                <span>{artist}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal/40 backdrop-blur-xl border border-gmg-cyan/30 rounded-2xl p-6" style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.2)' }}>
          <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-black">Regional Heat</div>
          <h4 className="text-sm font-black text-gmg-cyan mb-3">Trending Scenes</h4>
          <div className="space-y-2">
            {['Austin Indie', 'Berlin Electronic', 'Atlanta Trap'].map((scene, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gmg-white/80">
                <div className="w-1 h-1 rounded-full bg-gmg-cyan flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(6, 182, 212, 0.6)' }} />
                <span>{scene}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal/40 backdrop-blur-xl border border-gmg-magenta/30 rounded-2xl p-6" style={{ boxShadow: '0 0 40px rgba(236, 72, 153, 0.2)' }}>
          <div className="text-[9px] text-gmg-gray/60 uppercase tracking-wider mb-2 font-black">Network Activity</div>
          <h4 className="text-sm font-black text-gmg-magenta mb-3">Producer Networks</h4>
          <div className="space-y-2">
            {['Melodic Trap Collective', 'Indie Pop Writers', 'Electronic Guild'].map((network, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gmg-white/80">
                <div className="w-1 h-1 rounded-full bg-gmg-magenta flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(236, 72, 153, 0.6)' }} />
                <span>{network}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
