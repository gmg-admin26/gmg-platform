import { X, MapPin, TrendingUp, Users, Music, Zap, ExternalLink } from 'lucide-react';
import { Artist } from '../../data/rocksteadyData';

const REC = {
  SIGN:  { border: 'border-[#10B981]/30', bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', label: 'SIGN', glow: 'shadow-[0_0_30px_rgba(16,185,129,0.12)]' },
  WATCH: { border: 'border-[#F59E0B]/30', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'WATCH', glow: '' },
  PASS:  { border: 'border-white/10',     bg: 'bg-white/5',       text: 'text-white/30',  label: 'PASS', glow: '' },
};

function ScoreArc({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
          <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="4"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[13px] font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider text-center">{label}</span>
    </div>
  );
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const W = 280, H = 60;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * (H - 8);
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(' L ')}`;
  const fillD = `${pathD} L ${W},${H} L 0,${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 60 }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#sg)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * W;
        const y = H - (v / max) * (H - 8);
        if (i !== data.length - 1) return null;
        return <circle key={i} cx={x} cy={y} r={3} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />;
      })}
    </svg>
  );
}

interface Props {
  artist: Artist;
  onClose: () => void;
}

export default function ArtistProfilePanel({ artist, onClose }: Props) {
  const rec = REC[artist.recommendation];

  return (
    <div className={`bg-[#0A0C0F] border rounded-xl overflow-hidden ${rec.border} ${rec.glow}`}>
      {/* Top stripe */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" style={{ position: 'relative' }} />

      {/* Header */}
      <div className={`px-5 py-4 border-b border-white/[0.06] ${rec.bg}`}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/[0.1] flex items-center justify-center shrink-0">
            <span className="text-[18px] font-bold text-white/60">{artist.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[18px] font-bold text-white">{artist.name}</h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${rec.bg} ${rec.text} ${rec.border}`}>
                {rec.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/30">
              <MapPin className="w-3 h-3" />
              <span>{artist.location}</span>
              <span>·</span>
              <span>{artist.genre}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
            <X className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Hit probability */}
        <div className={`rounded-xl p-3.5 border ${rec.border} ${rec.bg} flex items-center gap-4`}>
          <div>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-0.5">AI Hit Probability</p>
            <p className="text-[32px] font-bold" style={{ color: artist.hitProb >= 80 ? '#10B981' : artist.hitProb >= 70 ? '#F59E0B' : '#EF4444' }}>
              {artist.hitProb}%
            </p>
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-[11px] text-white/40">
              {artist.hitProb >= 80 ? 'High-confidence opportunity. Recommend immediate action.' : artist.hitProb >= 70 ? 'Strong potential. Monitor closely over next 30 days.' : 'Developing. Continue watching.'}
            </p>
            <div className="text-[10px] font-mono text-white/20">Discovered {artist.discovered}</div>
          </div>
        </div>

        {/* AI Score breakdown */}
        <div className="grid grid-cols-4 gap-2">
          <ScoreArc value={artist.growthScore}     color="#10B981" label="Growth" />
          <ScoreArc value={artist.engagementScore} color="#06B6D4" label="Engage" />
          <ScoreArc value={artist.revenueScore}    color="#F59E0B" label="Revenue" />
          <ScoreArc value={artist.viralityScore}   color="#EF4444" label="Virality" />
        </div>

        {/* Growth chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Monthly Listener Growth</p>
            <span className="text-[10px] font-mono text-[#10B981]">{artist.listenersDelta}</span>
          </div>
          <SparkLine data={artist.chartHistory} color="#10B981" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: Users,  label: 'Monthly Listeners', val: `${(artist.monthlyListeners / 1000000).toFixed(1)}M`, color: '#10B981' },
            { icon: TrendingUp, label: 'Streams Total',  val: `${(artist.spotifyStreams / 1000000).toFixed(1)}M`,  color: '#06B6D4' },
            { icon: Zap,    label: 'TikTok Followers',   val: `${(artist.tiktokFollowers / 1000000).toFixed(1)}M`, color: '#EF4444' },
            { icon: Music,  label: 'Top Track Streams',  val: `${(artist.topTrackStreams / 1000000).toFixed(1)}M`, color: '#F59E0B' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-white/[0.025] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3" style={{ color: item.color }} />
                  <span className="text-[9px] font-mono text-white/25">{item.label}</span>
                </div>
                <p className="text-[14px] font-bold" style={{ color: item.color }}>{item.val}</p>
              </div>
            );
          })}
        </div>

        {/* Top Track */}
        <div className="bg-white/[0.025] border border-white/[0.05] rounded-lg px-3 py-2.5">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">Top Track</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/[0.06] flex items-center justify-center">
                <Music className="w-3 h-3 text-white/30" />
              </div>
              <span className="text-[13px] font-semibold text-white/80">{artist.topTrack}</span>
            </div>
            <span className="text-[11px] font-mono text-white/35">{(artist.topTrackStreams / 1000000).toFixed(1)}M streams</span>
          </div>
        </div>

        {/* Audience breakdown */}
        <div>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2.5">Audience Breakdown</p>
          <div className="space-y-1.5">
            {artist.audienceBreakdown.map(seg => (
              <div key={seg.label} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-[10px] text-white/30 w-20 shrink-0">{seg.label}</span>
                <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color, opacity: 0.8 }} />
                </div>
                <span className="text-[10px] font-mono text-white/30 w-8 text-right shrink-0">{seg.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Similar artists */}
        <div>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">Sounds Like</p>
          <div className="flex flex-wrap gap-1.5">
            {artist.similarArtists.map(sim => (
              <span key={sim} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/[0.04] text-white/40 border border-white/[0.06]">
                {sim}
              </span>
            ))}
          </div>
        </div>

        {/* Scout notes */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Scout Notes</p>
          <p className="text-[11px] text-white/50 leading-relaxed italic">"{artist.scoutNotes}"</p>
        </div>

        {/* CTA */}
        <button className={`w-full py-3 rounded-xl border font-semibold text-[13px] transition-all ${rec.bg} ${rec.border} ${rec.text} hover:brightness-125`}>
          {artist.recommendation === 'SIGN' ? 'Initiate Contact Process' : artist.recommendation === 'WATCH' ? 'Add to Watch List' : 'Archive Artist'}
        </button>

        <div className="flex gap-2">
          <button className="flex-1 py-2 rounded-xl border border-white/[0.07] text-[11px] font-mono text-white/25 hover:text-white/50 hover:border-white/[0.12] transition-all flex items-center justify-center gap-1.5">
            <ExternalLink className="w-3 h-3" /> Open Full Profile
          </button>
        </div>
      </div>
    </div>
  );
}
