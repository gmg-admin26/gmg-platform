import { Music, ListMusic, Plus, Play } from 'lucide-react';
import { AR_PLAYLISTS } from '../../data/rocksteadyData';

export default function PlaylistEngine() {
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <ListMusic className="w-4 h-4 text-[#A3E635]" />
        <span className="text-[13px] font-semibold text-white/80">A&R Playlists</span>
        <button className="ml-auto flex items-center gap-1 text-[10px] font-mono text-white/25 px-2 py-1 rounded-lg border border-white/[0.06] hover:text-white/50 hover:border-white/[0.12] transition-all">
          <Plus className="w-3 h-3" /> New Playlist
        </button>
      </div>

      <div className="p-3 grid grid-cols-1 gap-2">
        {AR_PLAYLISTS.map(pl => (
          <div
            key={pl.id}
            className="group flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${pl.color}18`, border: `1px solid ${pl.color}25` }}
            >
              <Music className="w-4 h-4" style={{ color: pl.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-white/75 group-hover:text-white transition-colors">{pl.name}</p>
              <p className="text-[10px] text-white/25 mt-0.5">{pl.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono" style={{ color: pl.color }}>{pl.trackCount} tracks</span>
                <span className="text-[10px] font-mono text-white/15">· {pl.updatedAgo}</span>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] transition-colors">
              <Play className="w-2.5 h-2.5 text-white/30 ml-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
