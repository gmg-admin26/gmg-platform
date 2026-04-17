import { TrendingUp, MapPin, Zap, ChevronRight } from 'lucide-react';
import { ARTISTS, Artist } from '../../data/rocksteadyData';

const STATUS_STYLES = {
  breaking: { pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', bar: '#EF4444', dot: 'bg-[#EF4444] animate-pulse' },
  rising:   { pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25', bar: '#F59E0B', dot: 'bg-[#F59E0B]' },
  watch:    { pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', bar: '#06B6D4', dot: 'bg-[#06B6D4]' },
};

const REC_STYLES = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/30 border-white/10',
};

function VelocityBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${score}%`,
            background: score > 90 ? '#EF4444' : score > 75 ? '#F59E0B' : '#06B6D4',
            boxShadow: score > 90 ? '0 0 8px rgba(239,68,68,0.4)' : undefined,
          }}
        />
      </div>
      <span className="text-[11px] font-mono font-bold" style={{ color: score > 90 ? '#EF4444' : score > 75 ? '#F59E0B' : '#06B6D4' }}>
        {score}
      </span>
    </div>
  );
}

interface Props {
  onSelect: (a: Artist) => void;
  selected: Artist | null;
}

export default function HotArtistRadar({ onSelect, selected }: Props) {
  const sorted = [...ARTISTS].sort((a, b) => b.velocityScore - a.velocityScore);

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <TrendingUp className="w-4 h-4 text-[#EF4444]" />
        <span className="text-[13px] font-semibold text-white/80">Hot Artist Radar</span>
        <span className="text-[9px] font-mono text-white/15 tracking-widest">// LIVE</span>
        <div className="ml-auto flex gap-1.5">
          {(['breaking', 'rising', 'watch'] as const).map(s => (
            <span key={s} className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${STATUS_STYLES[s].pill}`}>
              {sorted.filter(a => a.status === s).length} {s}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/[0.03]">
        {sorted.map((artist, i) => {
          const s = STATUS_STYLES[artist.status];
          const isSelected = selected?.id === artist.id;
          return (
            <div
              key={artist.id}
              onClick={() => onSelect(artist)}
              className={`px-5 py-3.5 cursor-pointer transition-all ${isSelected ? 'bg-white/[0.04] border-l-2 border-l-[#10B981]' : 'hover:bg-white/[0.015] border-l-2 border-l-transparent'}`}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <span className="text-[11px] font-mono text-white/15 w-4 shrink-0">{i + 1}</span>

                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-white/50">{artist.name.charAt(0)}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-[13px] font-semibold text-white/85">{artist.name}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${s.pill}`}>{artist.status}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${REC_STYLES[artist.recommendation]}`}>{artist.recommendation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-white/25">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{artist.location}</span>
                    <span>·</span>
                    <span>{artist.genre}</span>
                  </div>
                </div>

                <div className="shrink-0 w-28 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-white/20">velocity</span>
                  </div>
                  <VelocityBar score={artist.velocityScore} />
                </div>

                <div className="shrink-0 text-right hidden md:block">
                  <p className="text-[12px] font-mono text-white/55">{(artist.monthlyListeners / 1000000).toFixed(1)}M</p>
                  <p className="text-[10px] font-mono text-[#10B981]">{artist.listenersDelta}</p>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-[#10B981]' : 'text-white/15'}`} />
              </div>

              {/* Tags */}
              <div className="flex gap-1.5 mt-2 ml-16 flex-wrap">
                {artist.signalTags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.05]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
