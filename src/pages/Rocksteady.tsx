import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowRight, User, TrendingUp, Music, Users as UsersIcon,
  Radio, Mic, MapPin, Eye, Target, Sparkles, Network,
  Disc, UsersRound, BarChart, Zap, Brain, Activity, Shield,
  MessageSquare, Diamond
} from 'lucide-react';
import InteractiveSignalMap from '../components/InteractiveSignalMap';
import CulturalRadar from '../components/CulturalRadar';
import DiscoveryTimeline from '../components/DiscoveryTimeline';
import SignalStream from '../components/SignalStream';
import SystemRebuildStatement from '../components/SystemRebuildStatement';

interface Scout {
  name: string;
  role: string;
  level: number;
  rank: number;
  tier: 'Elite' | 'Master' | 'Senior' | 'Junior';
  genres: string[];
  skills: string[];
  signalsDetected: number;
  signalTypes: string[];
}

const scouts: Scout[] = [
  // Elite Scouts
  { name: 'Nova', role: 'Trend Architect', level: 50, rank: 1, tier: 'Elite', genres: ['Alt R&B', 'Indie'], skills: ['Early Discovery', 'Cultural Momentum', 'Breakout Prediction'], signalsDetected: 4821, signalTypes: ['Streaming Growth', 'Cultural Momentum', 'Scene Emergence'] },
  { name: 'Rift', role: 'Signal Hunter', level: 49, rank: 2, tier: 'Elite', genres: ['Hip Hop', 'Trap'], skills: ['Scene Analysis', 'Producer Networks', 'Viral Potential'], signalsDetected: 4512, signalTypes: ['Producer Networks', 'TikTok Velocity', 'Fan Behavior'] },
  { name: 'Flare', role: 'Wave Tracker', level: 48, rank: 3, tier: 'Elite', genres: ['Electronic', 'House'], skills: ['Genre Momentum', 'Festival Circuit', 'Underground'], signalsDetected: 4203, signalTypes: ['Scene Emergence', 'Festival Circuit', 'Underground Activity'] },
  { name: 'Drift', role: 'Culture Mapper', level: 47, rank: 4, tier: 'Elite', genres: ['Indie Rock', 'Alt Pop'], skills: ['Regional Scenes', 'DIY Culture', 'College Radio'], signalsDetected: 3987, signalTypes: ['Regional Growth', 'DIY Networks', 'Radio Momentum'] },
  { name: 'Vibe', role: 'Data Sentinel', level: 46, rank: 5, tier: 'Elite', genres: ['Latin', 'Afrobeats'], skills: ['Global Markets', 'Cross-Cultural', 'Language'], signalsDetected: 3654, signalTypes: ['Cross-Cultural', 'Streaming Growth', 'Global Markets'] },

  // Master Scouts
  { name: 'Prism', role: 'Network Oracle', level: 42, rank: 6, tier: 'Master', genres: ['Pop', 'Hyperpop'], skills: ['Network Analysis', 'Collaboration', 'Trend Prediction'], signalsDetected: 2891, signalTypes: ['Producer Networks', 'Collaboration Trends', 'Platform Growth'] },
  { name: 'Nexus', role: 'Breakout Analyst', level: 41, rank: 7, tier: 'Master', genres: ['Indie Pop', 'Dream Pop'], skills: ['Momentum Tracking', 'Playlists', 'Viral Tracking'], signalsDetected: 2743, signalTypes: ['Playlist Velocity', 'Fan Behavior', 'Viral Momentum'] },
  { name: 'Cipher', role: 'Market Tracker', level: 40, rank: 8, tier: 'Master', genres: ['Country', 'Americana'], skills: ['Regional Growth', 'Chart Analysis', 'Market Dynamics'], signalsDetected: 2621, signalTypes: ['Regional Growth', 'Chart Momentum', 'Tour Activity'] },
  { name: 'Halo', role: 'Culture Analyst', level: 39, rank: 9, tier: 'Master', genres: ['R&B', 'Neo Soul'], skills: ['Cultural Momentum', 'Scene Dynamics', 'Audience'], signalsDetected: 2504, signalTypes: ['Cultural Momentum', 'Scene Dynamics', 'Audience Growth'] },
  { name: 'Blaze', role: 'Trend Predictor', level: 38, rank: 10, tier: 'Master', genres: ['Electronic', 'Techno'], skills: ['Pattern Recognition', 'Underground', 'Evolution'], signalsDetected: 2387, signalTypes: ['Underground Activity', 'Pattern Detection', 'Genre Evolution'] },

  // Senior Scouts
  { name: 'Riot', role: 'Scene Tracker', level: 34, rank: 11, tier: 'Senior', genres: ['Punk', 'Alt Rock'], skills: ['DIY Networks', 'Live Circuit', 'Community'], signalsDetected: 1823, signalTypes: ['DIY Networks', 'Live Circuit', 'Community Growth'] },
  { name: 'Vortex', role: 'Underground Map', level: 33, rank: 12, tier: 'Senior', genres: ['Lo-Fi', 'Bedroom'], skills: ['Platform Growth', 'Indie Discovery', 'Genre Niches'], signalsDetected: 1694, signalTypes: ['Platform Growth', 'Indie Discovery', 'Niche Scenes'] },
  { name: 'Frost', role: 'Viral Analyst', level: 32, rank: 13, tier: 'Senior', genres: ['TikTok', 'Jersey Club'], skills: ['Social Momentum', 'Viral Tracking', 'Velocity'], signalsDetected: 1571, signalTypes: ['TikTok Velocity', 'Social Momentum', 'Viral Trends'] },
  { name: 'Storm', role: 'Collab Analyst', level: 31, rank: 14, tier: 'Senior', genres: ['Dance Pop', 'EDM'], skills: ['Feature Tracking', 'Producer Networks', 'Collabs'], signalsDetected: 1489, signalTypes: ['Collaboration Trends', 'Producer Networks', 'Feature Analysis'] },
  { name: 'Spark', role: 'Sound Hunter', level: 30, rank: 15, tier: 'Senior', genres: ['Trap', 'Drill'], skills: ['Regional Signals', 'Sound Evolution', 'Street Culture'], signalsDetected: 1352, signalTypes: ['Regional Signals', 'Sound Evolution', 'Street Culture'] },

  // Junior Scouts
  { name: 'Vale', role: 'Data Monitor', level: 24, rank: 16, tier: 'Junior', genres: ['Pop', 'Dance'], skills: ['Data Monitoring', 'Trend Observation', 'Signal Detection'], signalsDetected: 892, signalTypes: ['Streaming Growth', 'Platform Growth', 'Trend Detection'] },
  { name: 'Reign', role: 'Scene Observer', level: 23, rank: 17, tier: 'Junior', genres: ['Rock', 'Metal'], skills: ['Scene Observation', 'Growth Tracking', 'Community'], signalsDetected: 821, signalTypes: ['Scene Emergence', 'Growth Tracking', 'Community Signals'] },
  { name: 'Lumen', role: 'Pattern Tracker', level: 22, rank: 18, tier: 'Junior', genres: ['Hip Hop', 'R&B'], skills: ['Pattern Analysis', 'Market Research', 'Audience'], signalsDetected: 743, signalTypes: ['Pattern Detection', 'Market Research', 'Audience Growth'] },
  { name: 'Grove', role: 'Genre Monitor', level: 21, rank: 19, tier: 'Junior', genres: ['Electronic', 'Ambient'], skills: ['Genre Monitoring', 'Platform Tracking', 'Discovery'], signalsDetected: 687, signalTypes: ['Genre Evolution', 'Platform Growth', 'Discovery Signals'] },
  { name: 'Cove', role: 'Regional Scout', level: 20, rank: 20, tier: 'Junior', genres: ['Indie', 'Folk'], skills: ['Regional Monitoring', 'Growth Analysis', 'Scene Mapping'], signalsDetected: 614, signalTypes: ['Regional Growth', 'Scene Mapping', 'Growth Analysis'] },
];

const ScoutCard = ({ scout, index, featured = false, isHovered, onHover, onLeave, tagHighlighted }: {
  scout: Scout;
  index: number;
  featured?: boolean;
  isHovered?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  tagHighlighted?: boolean | null;
}) => {
  const [signalCount, setSignalCount] = useState(scout.signalsDetected);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setSignalCount(prev => prev + 1);
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 1000);
      }
    }, 12000 + Math.random() * 8000);

    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Diamond, color: '#C084FC', label: 'Diamond' };
    if (rank === 2) return { icon: Shield, color: '#FFD700', label: 'Gold' };
    if (rank === 3) return { icon: Shield, color: '#C0C0C0', label: 'Silver' };
    if (rank === 4) return { icon: Shield, color: '#CD7F32', label: 'Bronze' };
    return null;
  };

  const tierStyles = {
    Elite: {
      cardBg: 'from-zinc-950 via-zinc-900 to-zinc-950',
      borderColor: 'border-violet-500/40',
      hoverShadow: 'hover:shadow-[0_0_40px_rgba(139,92,246,0.6),0_20px_60px_rgba(139,92,246,0.3)]',
      accentGlow: 'shadow-[0_0_30px_rgba(139,92,246,0.4)]',
      iconGlow: 'from-violet-500/20 to-purple-600/20 border-violet-400/40',
      iconColor: 'text-violet-300',
      textColor: 'text-violet-300'
    },
    Master: {
      cardBg: 'from-zinc-950 via-zinc-900 to-black',
      borderColor: 'border-blue-500/30',
      hoverShadow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5),0_15px_50px_rgba(59,130,246,0.2)]',
      accentGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      iconGlow: 'from-blue-500/20 to-cyan-600/20 border-blue-400/40',
      iconColor: 'text-blue-300',
      textColor: 'text-blue-300'
    },
    Senior: {
      cardBg: 'from-zinc-950 via-black to-zinc-950',
      borderColor: 'border-teal-600/25',
      hoverShadow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.3),0_10px_40px_rgba(0,0,0,0.5)]',
      accentGlow: 'shadow-[0_0_15px_rgba(20,184,166,0.2)]',
      iconGlow: 'from-teal-500/20 to-cyan-600/20 border-teal-400/30',
      iconColor: 'text-teal-300',
      textColor: 'text-teal-300'
    },
    Junior: {
      cardBg: 'from-black via-zinc-950 to-black',
      borderColor: 'border-zinc-700/20',
      hoverShadow: 'hover:shadow-[0_0_15px_rgba(113,113,122,0.2),0_10px_30px_rgba(0,0,0,0.4)]',
      accentGlow: 'shadow-[0_0_10px_rgba(113,113,122,0.15)]',
      iconGlow: 'from-zinc-500/20 to-gray-600/20 border-zinc-400/20',
      iconColor: 'text-gray-400',
      textColor: 'text-gray-400'
    }
  };

  const style = tierStyles[scout.tier];
  const rankBadge = getRankBadge(scout.rank);
  const RankIcon = rankBadge?.icon;

  const getStatusLabel = (tier: string) => {
    switch (tier) {
      case 'Elite': return 'LIVE SIGNALS';
      case 'Master': return 'SCANNING NETWORKS';
      case 'Senior': return 'TRACKING SCENES';
      case 'Junior': return 'MONITORING SIGNALS';
      default: return 'ACTIVE';
    }
  };

  const tagDimmed = tagHighlighted === false;
  const tagLit = tagHighlighted === true;

  if (featured) {
    return (
      <div
        className={`group relative rounded-2xl bg-gradient-to-br ${style.cardBg} border ${style.borderColor} backdrop-blur-sm overflow-hidden`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        style={{
          opacity: tagDimmed ? 0.25 : isHovered === false ? 0.85 : 1,
          transform: isHovered === true && !tagDimmed ? 'translateY(-12px) scale(1.08)' : tagLit ? 'scale(1.01)' : 'scale(1)',
          transition: 'opacity 0.2s ease, transform 0.3s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          boxShadow: tagLit
            ? '0 0 50px rgba(139,92,246,0.7), 0 0 20px rgba(139,92,246,0.4), 0 10px 40px rgba(0,0,0,0.8)'
            : '0 10px 40px rgba(0,0,0,0.8)',
          borderColor: tagLit ? 'rgba(139,92,246,0.8)' : undefined,
          willChange: 'transform, opacity',
        }}
      >
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-violet-400/50 group-hover:border-violet-400/90 transition-all"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-violet-400/50 group-hover:border-violet-400/90 transition-all"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-violet-400/50 group-hover:border-violet-400/90 transition-all"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-violet-400/50 group-hover:border-violet-400/90 transition-all"></div>

        <div className="p-6 h-full flex flex-col">
          {rankBadge && RankIcon && (
            <div className="flex items-center justify-center gap-2 mb-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-violet-400/20 animate-ping" style={{ animationDuration: '3s' }}></div>
              </div>
              <RankIcon className="w-6 h-6 relative z-10" style={{ color: rankBadge.color, fill: rankBadge.color }} />
              <span className="text-sm font-black uppercase tracking-wider relative z-10" style={{ color: rankBadge.color }}>
                Rank #{scout.rank}
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${style.iconGlow} flex items-center justify-center ${style.accentGlow} group-hover:scale-110 transition-all duration-300 relative`}>
              <User className={`w-8 h-8 ${style.iconColor}`} />
              {/* Subtle data activity particles */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-white/40 animate-ping" style={{ animationDuration: '3s', animationDelay: '0s' }}></div>
                <div className="absolute bottom-3 right-3 w-1 h-1 rounded-full bg-white/40 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
              </div>
            </div>
            <div className="text-left flex-1">
              <h4 className="text-xl font-black text-white tracking-tight mb-1">
                {scout.name}
              </h4>
              {/* Live status indicator */}
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${style.iconColor.replace('text-', 'bg-')}`} style={{
                  animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <span className={`text-[9px] ${style.textColor} font-black uppercase tracking-widest`}>
                  {getStatusLabel(scout.tier)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <p className={`text-sm ${style.textColor} font-bold uppercase tracking-wide mb-2`}>
              {scout.role}
            </p>
            {/* Live signal count metric */}
            <div className="relative">
              <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">LIVE SIGNALS</div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg tabular-nums transition-all duration-500" style={{
                  color: isScanning ? '#C084FC' : 'white'
                }}>
                  {signalCount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 font-medium">detected</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${style.iconColor.replace('text-', 'bg-')}`} style={{
                  animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}></div>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">
                  {isScanning ? 'detecting' : 'scanning'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-black/60 border border-violet-400/20">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Level</div>
              <div className="text-3xl font-black text-white">{scout.level}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-bold">Rank</div>
              <div className="text-3xl font-black bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent">
                #{scout.rank}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Genre Focus</div>
            <div className="flex flex-wrap gap-2">
              {scout.genres.map((genre, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-800/80 text-gray-200 border border-zinc-700/50 uppercase tracking-wide"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent mb-4"></div>

          <div className="mb-3">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Skill Set</div>
            <div className="flex flex-wrap gap-2">
              {scout.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-xs font-bold bg-violet-500/15 text-violet-200 border border-violet-400/30 uppercase tracking-wide transition-all duration-300 group-hover:bg-violet-500/25 group-hover:border-violet-400/50 group-hover:text-violet-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent mb-3"></div>

          <div className="flex-1">
            <div className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-bold">Signal Types</div>
            <div className="flex flex-wrap gap-2">
              {scout.signalTypes.map((type, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded text-[10px] font-bold bg-black/60 text-violet-300 border border-violet-400/20 uppercase tracking-wide"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute bottom-3 right-3">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              <div className="absolute w-4 h-4 rounded-full bg-violet-400/30 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative rounded-xl bg-gradient-to-br ${style.cardBg} border ${style.borderColor} backdrop-blur-sm`}
      style={{
        minHeight: '480px',
        opacity: tagDimmed ? 0.25 : isHovered === false ? 0.85 : 1,
        transform: isHovered === true && !tagDimmed ? 'translateY(-8px) scale(1.03)' : tagLit ? 'scale(1.01)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.25s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: tagLit
          ? '0 0 40px rgba(139,92,246,0.6), 0 0 16px rgba(139,92,246,0.3), 0 10px 30px rgba(0,0,0,0.8)'
          : '0 10px 30px rgba(0,0,0,0.8)',
        borderColor: tagLit ? 'rgba(139,92,246,0.7)' : undefined,
        willChange: 'transform, opacity',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="absolute top-1.5 left-1.5 w-3 h-3 border-l border-t border-violet-400/40 group-hover:border-violet-400/80 transition-all"></div>
      <div className="absolute top-1.5 right-1.5 w-3 h-3 border-r border-t border-violet-400/40 group-hover:border-violet-400/80 transition-all"></div>
      <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-l border-b border-violet-400/40 group-hover:border-violet-400/80 transition-all"></div>
      <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-r border-b border-violet-400/40 group-hover:border-violet-400/80 transition-all"></div>

      <div className="p-4 pb-6 h-full flex flex-col">
        {rankBadge && RankIcon && (
          <div className="flex items-center justify-center gap-1.5 mb-2 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-8 h-8 rounded-full border border-violet-400/15 animate-ping" style={{ animationDuration: '3s' }}></div>
            </div>
            <RankIcon className="w-4 h-4 relative z-10" style={{ color: rankBadge.color, fill: rankBadge.color }} />
            <span className="text-xs font-black uppercase tracking-wider relative z-10" style={{ color: rankBadge.color }}>
              #{scout.rank}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${style.iconGlow} flex items-center justify-center ${style.accentGlow} group-hover:scale-110 transition-all duration-300 relative`}>
            <User className={`w-6 h-6 ${style.iconColor}`} />
            {/* Subtle data activity */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1.5 left-1.5 w-0.5 h-0.5 rounded-full bg-white/60 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute bottom-2 right-2 w-0.5 h-0.5 rounded-full bg-white/60 animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            </div>
          </div>
          <div className="text-left flex-1 min-w-0">
            <h4 className="text-sm font-black text-white tracking-tight truncate mb-0.5">
              {scout.name}
            </h4>
            {/* Live status indicator */}
            <div className="flex items-center gap-1">
              <div className={`w-1 h-1 rounded-full ${style.iconColor.replace('text-', 'bg-')}`} style={{
                animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span className={`text-[7px] ${style.textColor} font-black uppercase tracking-widest`}>
                {getStatusLabel(scout.tier)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <p className={`text-[10px] ${style.textColor} font-bold uppercase tracking-wide mb-1`}>
            {scout.role}
          </p>
          {/* Live signal count metric */}
          <div className="relative">
            <div className="text-[8px] text-gray-600 uppercase tracking-wider font-bold mb-0.5">LIVE SIGNALS</div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-200 font-black text-sm tabular-nums transition-all duration-500" style={{
                color: isScanning ? '#C084FC' : '#E5E5E5'
              }}>
                {signalCount.toLocaleString()}
              </span>
              <span className="text-[8px] text-gray-500 font-medium">detected</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <div className={`w-1 h-1 rounded-full ${style.iconColor.replace('text-', 'bg-')}`} style={{
                animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}></div>
              <span className="text-[7px] text-gray-600 font-bold uppercase tracking-wide">
                {isScanning ? 'detecting' : 'scanning'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mb-2 p-2 rounded-lg bg-black/60 border border-violet-400/15">
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5 font-bold">Level</div>
            <div className="text-base font-black text-white leading-none">{scout.level}</div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5 font-bold">Rank</div>
            <div className="text-base font-black bg-gradient-to-r from-violet-300 to-purple-400 bg-clip-text text-transparent leading-none">
              #{scout.rank}
            </div>
          </div>
        </div>

        <div className="mb-1.5">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Genre Focus</div>
          <div className="flex flex-wrap gap-1">
            {scout.genres.map((genre, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-800/80 text-gray-300 border border-zinc-700/50 uppercase tracking-wide"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent mb-1.5"></div>

        <div className="mb-1.5">
          <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Skill Set</div>
          <div className="flex flex-wrap gap-1">
            {scout.skills.map((skill, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-500/10 text-violet-200 border border-violet-400/25 uppercase tracking-wide leading-tight transition-all duration-300 group-hover:bg-violet-500/20 group-hover:border-violet-400/40 group-hover:text-violet-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-violet-400/15 to-transparent mb-1.5"></div>

        <div className="flex-1 mb-3">
          <div className="text-[8px] text-gray-500 uppercase tracking-wider mb-1 font-bold">Signal Types</div>
          <div className="flex flex-wrap gap-0.5">
            {scout.signalTypes.map((type, i) => (
              <span
                key={i}
                className="px-1 py-0.5 rounded text-[7px] font-bold bg-black/60 text-violet-300/80 border border-violet-400/15 uppercase tracking-wide leading-tight"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-3 right-3">
          <div className="relative flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
            <div className="absolute w-3 h-3 rounded-full bg-violet-400/30 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ACCENT_COLOR = '#8B5CF6';

const TAG_DESCRIPTIONS: Record<string, string> = {
  'FIRST AI SCOUTS': 'The first AI Scout Army in music — autonomous scouts operating in real time, reporting directly into Rocksteady, GMG\'s intelligence platform.',
  '20 AUTONOMOUS SCOUTS': '20 specialized AI Scouts running continuously, each trained on a different slice of the global music landscape.',
  'GLOBAL COVERAGE': 'Scouts track signals across 156 genres and 23 global scenes simultaneously, 24/7.',
  'SPECIALIZED TRAINING': 'Each Scout is trained on specific genres, regions, and signal types to maximize precision.',
  'REAL TIME MONITORING': 'AI Scouts are tracking real time streaming, social, and cultural signals across global markets.',
  'MOMENTUM DETECTION': 'Scouts detect early-stage momentum before it registers on mainstream charts or radar.',
  'SIGNAL VALIDATION': 'Cross-referencing signals across platforms to eliminate noise and confirm genuine artist breakout patterns.',
  'OPPORTUNITY PRIORITIZATION': 'Scouts rank and surface the highest-value opportunities by signal strength, timing, and market fit.',
  'ARTIST GROWTH TRACKING': 'Continuous monitoring of fan base growth, streaming velocity, and audience engagement over time.',
  'STRATEGY GUIDANCE': 'Scouts generate strategic recommendations for artist development, positioning, and release timing.',
  'CATALOG EXPANSION': 'Identifying catalog acquisition and licensing opportunities based on trend data and scene momentum.',
  'AUTONOMOUS DEAL EXECUTION': 'Scouts can autonomously initiate and structure deal frameworks based on validated signal data.',
  'ADAPTIVE LEARNING': 'All Master AI Scouts continuously learn from new data, improving detection accuracy over time.',
};

const TAG_SCOUT_MAP: Record<string, string[]> = {
  'FIRST AI SCOUTS': ['Phoenix', 'Cipher', 'Vortex', 'Echo', 'Pulse'],
  '20 AUTONOMOUS SCOUTS': ['Phoenix', 'Cipher', 'Vortex', 'Echo', 'Pulse', 'Nexus', 'Nova', 'Atlas', 'Halo', 'Vector', 'Riot', 'Drift', 'Flare', 'Orbit', 'Signal', 'Blaze', 'Storm', 'Frost', 'Spark', 'Vale'],
  'GLOBAL COVERAGE': ['Echo', 'Pulse', 'Atlas', 'Vector', 'Signal', 'Vale'],
  'SPECIALIZED TRAINING': ['Phoenix', 'Cipher', 'Vortex', 'Nexus', 'Nova'],
  'REAL TIME MONITORING': ['Phoenix', 'Cipher', 'Vortex', 'Echo', 'Pulse'],
  'MOMENTUM DETECTION': ['Phoenix', 'Vortex', 'Pulse'],
  'SIGNAL VALIDATION': ['Cipher', 'Atlas'],
  'OPPORTUNITY PRIORITIZATION': ['Phoenix', 'Cipher'],
  'ARTIST GROWTH TRACKING': ['Nova', 'Atlas'],
  'STRATEGY GUIDANCE': ['Atlas', 'Halo'],
  'CATALOG EXPANSION': ['Pulse', 'Halo'],
  'AUTONOMOUS DEAL EXECUTION': ['Nexus', 'Atlas'],
  'ADAPTIVE LEARNING': ['Nexus', 'Nova', 'Atlas', 'Halo', 'Vector'],
};

interface ScoutSystemIntroProps {
  activeTag: string | null;
  hoveredTag: string | null;
  onTagClick: (tag: string | null) => void;
  onTagHover: (tag: string | null) => void;
}

const systemTagLabels = [
  'FIRST AI SCOUTS',
  '20 AUTONOMOUS SCOUTS',
  'GLOBAL COVERAGE',
  'SPECIALIZED TRAINING',
];

const capabilityTagLabels = [
  'REAL TIME MONITORING',
  'MOMENTUM DETECTION',
  'SIGNAL VALIDATION',
  'OPPORTUNITY PRIORITIZATION',
  'ARTIST GROWTH TRACKING',
  'STRATEGY GUIDANCE',
  'CATALOG EXPANSION',
  'AUTONOMOUS DEAL EXECUTION',
  'ADAPTIVE LEARNING',
];

function ScoutSystemIntro({ activeTag, hoveredTag, onTagClick, onTagHover }: ScoutSystemIntroProps) {
  const visibleTag = activeTag ?? hoveredTag;
  const visibleText = visibleTag ? (TAG_DESCRIPTIONS[visibleTag] ?? '') : '';

  const renderTag = (label: string) => {
    const isActive = activeTag === label;
    const isHovered = hoveredTag === label && !activeTag;
    const isHighlit = isActive || isHovered;
    return (
      <button
        key={label}
        onClick={(e) => {
          e.preventDefault();
          onTagClick(isActive ? null : label);
        }}
        onMouseEnter={() => onTagHover(label)}
        onMouseLeave={() => onTagHover(null)}
        className="relative px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
        style={{
          backgroundColor: isHighlit ? `${ACCENT_COLOR}25` : 'rgba(24,24,27,0.6)',
          borderWidth: '2px',
          borderColor: isHighlit ? ACCENT_COLOR : 'rgba(255,255,255,0.1)',
          boxShadow: isHighlit
            ? `0 0 40px ${ACCENT_COLOR}50, 0 8px 24px rgba(0,0,0,0.4)`
            : '0 4px 12px rgba(0,0,0,0.3)',
          color: isHighlit ? ACCENT_COLOR : '#9CA3AF',
          transform: isHighlit ? 'scale(1.04)' : 'scale(1)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease, transform 0.2s ease',
          willChange: 'transform',
        }}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          <div
            className="relative flex items-center justify-center ml-1"
            style={{
              opacity: isHighlit ? 1 : 0,
              transition: 'opacity 0.2s ease',
              width: '12px',
              height: '12px',
              flexShrink: 0,
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT_COLOR }}></div>
            <div className="absolute w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: ACCENT_COLOR, opacity: 0.5 }}></div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="mb-14 p-8 md:p-10 rounded-2xl bg-gradient-to-br from-zinc-950/60 via-black/40 to-zinc-950/60 border border-violet-400/20 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
        <Zap className="w-3.5 h-3.5 text-violet-300" />
        <span className="text-xs font-black text-violet-200 uppercase tracking-wider">Enter Rocksteady</span>
      </div>

      <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-white leading-[1.1]">
        The first AI Scout Army in music
      </h3>
      <p className="text-base text-gray-400 max-w-3xl mb-8 leading-relaxed">
        Rocksteady is the platform where GMG's AI Scout Army reports, analyzes, and activates opportunity in real time.<br />
        An army of autonomous AI Scouts — each operating continuously across genres, regions, and cultural signals.
      </p>

      <div className="flex flex-wrap gap-3 mb-3">
        {systemTagLabels.map(renderTag)}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-violet-400/20 to-transparent my-4"></div>

      <div className="flex flex-wrap gap-3">
        {capabilityTagLabels.map(renderTag)}
      </div>

      {/* Fixed-height helper text area — always in DOM, opacity-toggled to prevent layout shift */}
      <div style={{ height: '52px', marginTop: '16px', position: 'relative' }}>
        <div
          className="absolute inset-0 px-5 py-3 rounded-xl text-sm text-gray-300 leading-relaxed flex items-center"
          style={{
            backgroundColor: `${ACCENT_COLOR}10`,
            borderWidth: '1px',
            borderColor: `${ACCENT_COLOR}30`,
            opacity: visibleText ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: visibleText ? 'auto' : 'none',
          }}
        >
          {visibleText}
        </div>
      </div>
    </div>
  );
}

export default function Rocksteady() {
  const [hoveredScoutIndex, setHoveredScoutIndex] = useState<number | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const resolvedTag = activeTag ?? hoveredTag;
  const tagScouts = resolvedTag ? (TAG_SCOUT_MAP[resolvedTag] ?? null) : null;

  const getTagHighlight = (scoutName: string): boolean | null => {
    if (!tagScouts) return null;
    return tagScouts.includes(scoutName) ? true : false;
  };

  const eliteScouts = scouts.filter(s => s.tier === 'Elite');
  const masterScouts = scouts.filter(s => s.tier === 'Master');
  const seniorScouts = scouts.filter(s => s.tier === 'Senior');
  const juniorScouts = scouts.filter(s => s.tier === 'Junior');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Signal Stream Background */}
      <SignalStream />

      {/* Hero Section - AI Scout Network */}
      <section className="relative flex items-center overflow-hidden pt-32 pb-20">
        {/* Shepard Fairey Inspired Background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-purple-950/30"></div>

          {/* Propaganda-style radial burst (Shepard Fairey aesthetic) */}
          <div className="absolute inset-0 opacity-[0.12]">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/3 w-0.5 bg-gradient-to-t from-transparent via-violet-500/50 to-transparent h-[130%] origin-bottom"
                style={{
                  transform: `rotate(${i * 7.5}deg) translateX(-50%)`,
                  filter: i % 2 === 0 ? 'blur(1px)' : 'none'
                }}
              ></div>
            ))}
          </div>

          {/* Halftone dot pattern (poster texture) */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(139,92,246,0.4) 1px, transparent 1px)`,
              backgroundSize: '12px 12px'
            }}
          ></div>

          {/* Vintage poster grain texture */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, rgba(139,92,246,0.2) 0px, transparent 1px, transparent 3px, rgba(139,92,246,0.2) 4px),
                repeating-linear-gradient(90deg, rgba(168,85,247,0.15) 0px, transparent 1px, transparent 3px, rgba(168,85,247,0.15) 4px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>

          {/* Atmospheric light orbs */}
          <div className="absolute inset-0 opacity-[0.15]">
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-violet-600/40 rounded-full blur-[140px]"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-purple-700/30 rounded-full blur-[140px]"></div>
          </div>

          {/* Top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"></div>
        </div>

        {/* Two Column Layout */}
        <div className="relative z-10 w-full max-w-[1800px] mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Hero Copy */}
          <div>
            {/* System Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-violet-400/20 backdrop-blur-sm mb-6">
              <span className="text-[10px] font-black text-violet-300/80 uppercase tracking-[0.2em]">GMG Discovery Intelligence</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
              <span className="block text-gradient-matte-violet">
                Rocksteady AI
              </span>
            </h1>

            <p className="text-3xl md:text-4xl text-white mb-8 leading-tight font-black tracking-tight">
              Global Discovery Intelligence for Music
            </p>

            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-6">
              Powered by Rocksteady — GMG's real-time intelligence platform
            </p>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              An army of autonomous AI Scouts operating in real time — tracking signals, scenes, and cultural momentum across the global music landscape, identifying emerging artists before they surface globally.
            </p>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Rocksteady is the platform where GMG's AI Scout Army reports, analyzes, and activates opportunity in real time.
            </p>

            <p className="text-base text-gray-400 mb-6 leading-relaxed">
              GMG rebuilt the A&R intelligence system after deploying these methods at Warner Music. Rocksteady now powers both discovery and active artist growth across the GMG ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/login/rocksteady"
                className="group px-10 py-5 rounded-full font-black text-base text-white transition-all duration-300 hover:scale-105 flex items-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.1) 100%)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  boxShadow: '0 0 24px rgba(239,68,68,0.12)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 32px rgba(239,68,68,0.22)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(239,68,68,0.65)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 24px rgba(239,68,68,0.12)';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(239,68,68,0.4)';
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
                Log In
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/get-started"
                className="group px-10 py-5 bg-zinc-950 border border-white/10 rounded-full font-black text-base text-white/70 hover:border-white/20 hover:text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Request Access
              </Link>
            </div>
          </div>

          {/* Right Side - Featured Elite AI Scouts */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/30 backdrop-blur-sm mb-6">
              <Diamond className="w-4 h-4 text-violet-300 fill-violet-300" />
              <span className="text-sm font-black text-violet-200 uppercase tracking-wider">Elite AI Scouts</span>
            </div>

            <div className="grid grid-cols-3 gap-6 scale-110 origin-top">
              {eliteScouts.slice(0, 3).map((scout, index) => (
                <ScoutCard
                  key={scout.name}
                  scout={scout}
                  index={index}
                  featured={true}
                  isHovered={hoveredScoutIndex === index ? true : hoveredScoutIndex === null ? undefined : false}
                  onHover={() => setHoveredScoutIndex(index)}
                  onLeave={() => setHoveredScoutIndex(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SystemRebuildStatement accentColor="violet" />

      {/* Shepard Fairey Artwork Feature */}
      <section className="relative py-16 px-8 lg:px-12 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[400px_1fr] gap-10 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-500/10 blur-3xl rounded-full"></div>
              <img
                src="/shepard_fairey_art.png"
                alt="Rocksteady - Original artwork by Shepard Fairey"
                className="relative w-full h-auto rounded-lg shadow-2xl shadow-violet-500/20 border border-violet-400/10"
              />
            </div>
            <div className="max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-4">
                <span className="text-[10px] font-black text-violet-300 uppercase tracking-[0.2em]">Original Culture Artifact</span>
              </div>
              <h3 className="text-xs font-bold text-violet-400/70 tracking-[0.25em] uppercase mb-4">
                Original Artwork by Shepard Fairey
              </h3>
              <p className="text-base text-gray-300 mb-4 leading-relaxed">
                Rocksteady's cultural intelligence platform is visualized through original artwork created by Shepard Fairey, reflecting the intersection of music, culture, and emerging movements.
              </p>
              <p className="text-base text-gray-400 leading-relaxed">
                The Rocksteady system maps cultural signals, regional scenes, and creative networks to identify artists before they break globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Scout Network Introduction */}
      <section className="py-20 pb-32 px-8 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 relative">
        <div className="absolute inset-0 opacity-5 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/40 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          {/* Global Scout Metric */}
          <div className="text-center mb-10">
            <div className="inline-block px-8 py-3 rounded-xl bg-black/60 border border-violet-400/25 backdrop-blur-sm">
              <p className="text-sm text-gray-300 font-medium">
                <span className="text-violet-300 font-black text-lg">20 Active Scouts</span> monitoring{' '}
                <span className="text-violet-300 font-bold">156 genres</span> across{' '}
                <span className="text-violet-300 font-bold">23 global scenes</span>
              </p>
            </div>
          </div>

          {/* AI Scout Network Intro */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <Brain className="w-4 h-4 text-violet-300" />
              <span className="text-xs font-black text-violet-200 uppercase tracking-wider">Rocksteady AI Scout Army</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-[1.1]">
              AI Scout Army
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              An army of autonomous scouts monitoring signals, scenes, momentum, and opportunity across the global music landscape.
            </p>
          </div>

          {/* Enter Rocksteady Sub-Section */}
          <ScoutSystemIntro
            activeTag={activeTag}
            hoveredTag={hoveredTag}
            onTagClick={setActiveTag}
            onTagHover={setHoveredTag}
          />

          <div className="space-y-20">
            {/* Elite AI Scouts */}
            <div>
              <h3 className="text-2xl font-black text-violet-300 mb-8 flex items-center gap-3">
                <Diamond className="w-6 h-6 fill-violet-300" />
                Elite AI Scouts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {eliteScouts.map((scout, index) => (
                  <ScoutCard
                    key={scout.name}
                    scout={scout}
                    index={100 + index}
                    isHovered={tagScouts ? undefined : hoveredScoutIndex === 100 + index ? true : hoveredScoutIndex === null ? undefined : false}
                    onHover={() => setHoveredScoutIndex(100 + index)}
                    onLeave={() => setHoveredScoutIndex(null)}
                    tagHighlighted={getTagHighlight(scout.name)}
                  />
                ))}
              </div>
            </div>

            {/* Master AI Scouts */}
            <div>
              <h3 className="text-2xl font-black text-blue-300 mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-blue-300" />
                Master AI Scouts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {masterScouts.map((scout, index) => (
                  <ScoutCard
                    key={scout.name}
                    scout={scout}
                    index={200 + index}
                    isHovered={tagScouts ? undefined : hoveredScoutIndex === 200 + index ? true : hoveredScoutIndex === null ? undefined : false}
                    onHover={() => setHoveredScoutIndex(200 + index)}
                    onLeave={() => setHoveredScoutIndex(null)}
                    tagHighlighted={getTagHighlight(scout.name)}
                  />
                ))}
              </div>
            </div>

            {/* Senior AI Scouts */}
            <div>
              <h3 className="text-2xl font-black text-teal-300 mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-teal-300" />
                Senior AI Scouts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {seniorScouts.map((scout, index) => (
                  <ScoutCard
                    key={scout.name}
                    scout={scout}
                    index={300 + index}
                    isHovered={tagScouts ? undefined : hoveredScoutIndex === 300 + index ? true : hoveredScoutIndex === null ? undefined : false}
                    onHover={() => setHoveredScoutIndex(300 + index)}
                    onLeave={() => setHoveredScoutIndex(null)}
                    tagHighlighted={getTagHighlight(scout.name)}
                  />
                ))}
              </div>
            </div>

            {/* Junior AI Scouts */}
            <div>
              <h3 className="text-2xl font-black text-gray-400 mb-8 flex items-center gap-3">
                <Shield className="w-6 h-6 text-gray-400" />
                Junior AI Scouts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {juniorScouts.map((scout, index) => (
                  <ScoutCard
                    key={scout.name}
                    scout={scout}
                    index={400 + index}
                    isHovered={tagScouts ? undefined : hoveredScoutIndex === 400 + index ? true : hoveredScoutIndex === null ? undefined : false}
                    onHover={() => setHoveredScoutIndex(400 + index)}
                    onLeave={() => setHoveredScoutIndex(null)}
                    tagHighlighted={getTagHighlight(scout.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Radar Section */}
      <CulturalRadar />

      {/* Global Signal Intelligence Map */}
      <section id="signal-map" className="py-32 px-8 pb-24 bg-gradient-to-b from-black via-zinc-950 to-black relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-violet-600/40 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <Activity className="w-4 h-4 text-violet-300" />
              <span className="text-sm font-bold text-violet-200 uppercase tracking-wider">Rocksteady Live Intelligence</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Global Signal Intelligence
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Rocksteady's real-time detection of artist momentum, cultural scenes, and emerging signals across the global music landscape.
            </p>
          </div>

          <InteractiveSignalMap />
        </div>
      </section>

      {/* AI Scout Intelligence Dashboard */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
        {/* Cosmic background atmosphere */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/40 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/40 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-500/10 border border-violet-400/25 backdrop-blur-sm mb-6 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <BarChart className="w-4 h-4 text-violet-300" />
              <span className="text-sm font-bold text-violet-200 uppercase tracking-wider">Rocksteady Intelligence Dashboard</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-[1.1] pb-1">
              AI Scout Intelligence Dashboard
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Rocksteady's intelligence analysis and signal detection for modern music discovery.
            </p>
          </div>

          {/* Unified Dashboard Container */}
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-950/60 via-black/40 to-zinc-950/60 border border-violet-400/20 backdrop-blur-sm shadow-[0_40px_100px_rgba(0,0,0,0.8)] mb-16">
            <div className="grid lg:grid-cols-3 gap-8">
            {/* Panel 1 - Cultural Signal Volume */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-black/80 via-zinc-900/60 to-black/80 border border-violet-400/20 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-violet-400/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-600/15 border border-violet-400/20 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Cultural Signal Volume</h3>

              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15">
                  <div className="text-3xl font-black text-violet-300 mb-1">100K+</div>
                  <div className="text-sm text-gray-400">Tracks Uploaded Daily</div>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15">
                  <div className="text-3xl font-black text-violet-300 mb-1">Millions</div>
                  <div className="text-sm text-gray-400">Cultural Signals Emerging</div>
                </div>
              </div>

              <p className="text-base text-gray-400 leading-relaxed mb-4">
                Modern music distribution creates overwhelming signal noise.
              </p>
              <p className="text-base text-white font-bold">
                Rocksteady detects the meaningful signals inside it.
              </p>
            </div>

            {/* Panel 2 - Data Intelligence Coverage */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-black/80 via-zinc-900/60 to-black/80 border border-violet-400/20 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-violet-400/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-600/15 border border-violet-400/20 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Data Intelligence Coverage</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15 text-center">
                  <Disc className="w-8 h-8 text-violet-300 mx-auto mb-2" />
                  <div className="text-2xl font-black text-white mb-1">15+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Streaming Platforms</div>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15 text-center">
                  <UsersRound className="w-8 h-8 text-violet-300 mx-auto mb-2" />
                  <div className="text-2xl font-black text-white mb-1">12+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Social Networks</div>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15 text-center">
                  <Target className="w-8 h-8 text-violet-300 mx-auto mb-2" />
                  <div className="text-2xl font-black text-white mb-1">500+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Data Points</div>
                </div>
                <div className="p-4 rounded-xl bg-black/50 border border-violet-400/15 text-center">
                  <Network className="w-8 h-8 text-violet-300 mx-auto mb-2" />
                  <div className="text-2xl font-black text-white mb-1">50M+</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Signals Tracked</div>
                </div>
              </div>
            </div>

            {/* Panel 3 - Discovery Pipeline */}
            <div className="p-10 rounded-3xl bg-gradient-to-br from-black/80 via-zinc-900/60 to-black/80 border border-violet-400/20 backdrop-blur-sm shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-violet-400/40 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-600/15 border border-violet-400/20 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-violet-300" />
              </div>
              <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Discovery Pipeline</h3>

              <div className="space-y-3">
                {[
                  { icon: Target, label: 'Signal Detected', desc: 'Early momentum identified' },
                  { icon: Shield, label: 'Scout Validation', desc: 'AI scouts verify patterns' },
                  { icon: Brain, label: 'Intelligence Analysis', desc: 'Priority opportunities surfaced' },
                  { icon: MessageSquare, label: 'Artist Connection', desc: 'Outreach initiated' },
                  { icon: Zap, label: 'Deal Development', desc: 'Artist enters pathways' }
                ].map((stage, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-black/50 border border-violet-400/10 hover:border-violet-400/25 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-400/20 flex items-center justify-center flex-shrink-0">
                      <stage.icon className="w-5 h-5 text-violet-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-black text-white mb-0.5">{stage.label}</div>
                      <div className="text-xs text-gray-400">{stage.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>

          {/* Discovery Intelligence Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Music, title: 'Artist Signal Detection', desc: 'Real-time analysis of streaming velocity, social engagement, and fan growth patterns.' },
              { icon: MapPin, title: 'Scene Intelligence', desc: 'Identify emerging regional scenes before mainstream awareness.' },
              { icon: Radio, title: 'Producer Network Analysis', desc: 'Track collaborations and emerging production talent signals.' },
              { icon: Mic, title: 'Songwriter Intelligence', desc: 'Detection of rising songwriters and creative collaboration patterns.' },
              { icon: TrendingUp, title: 'Genre Momentum Systems', desc: 'Analyze micro-genres and predict mainstream traction patterns.' },
              { icon: UsersIcon, title: 'Superfan Intelligence', desc: 'Map passionate communities driving artist discovery.' }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-black/50 border border-violet-400/15 hover:border-violet-400/30 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(139,92,246,0.2)]">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/15 to-purple-600/15 border border-violet-400/20 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-violet-300" />
                </div>
                <h4 className="text-lg font-black text-white mb-3 tracking-tight">{item.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Timeline */}
      <section className="py-32 px-8 bg-gradient-to-b from-black via-zinc-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-violet-600/40 rounded-full blur-[150px]"></div>
          <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-purple-600/40 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <DiscoveryTimeline />
        </div>
      </section>

      {/* Final CTA */}
      <section className="pt-32 pb-20 px-8 bg-gradient-to-b from-black via-zinc-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent pb-2">
            Discover the Next Wave Earlier
          </h2>

          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            Partner with GMG to access discovery intelligence systems designed to detect emerging artists, producers, songwriters, and cultural movements before they break at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login/rocksteady"
              className="group px-12 py-6 rounded-full font-black text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.18) 0%, rgba(245,158,11,0.1) 100%)',
                border: '1px solid rgba(239,68,68,0.4)',
                boxShadow: '0 0 28px rgba(239,68,68,0.14)',
              }}
            >
              <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
              Log In to Rocksteady
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/get-started"
              className="px-12 py-6 border border-white/10 rounded-full font-black text-lg text-white/70 hover:border-white/20 hover:text-white bg-zinc-950 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Request Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
