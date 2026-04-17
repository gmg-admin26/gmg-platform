import { BookOpen, TrendingUp, Music, ExternalLink } from 'lucide-react';
import StatusTag from '../components/StatusTag';
import AIInsightPanel from '../components/AIInsightPanel';
import { CATALOG_ASSETS } from '../data/mockData';

export default function CatalogIntel() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
            <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Catalog Intel</h1>
          </div>
          <p className="text-[12px] text-white/30">12,408 assets indexed · {CATALOG_ASSETS.length} flagship releases tracked</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Assets', value: '12,408', accent: '#8B5CF6' },
          { label: 'Sync Placements', value: '21', accent: '#06B6D4' },
          { label: 'LTM Revenue', value: '$585K', accent: '#10B981' },
          { label: 'Scaling Projects', value: '2', accent: '#F59E0B' },
        ].map(m => (
          <div key={m.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${m.accent}55, transparent)` }} />
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-[26px] font-bold leading-none font-['Satoshi',sans-serif]" style={{ color: m.accent }}>{m.value}</p>
          </div>
        ))}
      </div>

      <AIInsightPanel />

      <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-white/[0.06] text-[10px] font-mono text-white/25 uppercase tracking-widest">
          <div className="col-span-3">Project</div>
          <div className="col-span-2">Artist</div>
          <div className="col-span-1">Year</div>
          <div className="col-span-1">Tracks</div>
          <div className="col-span-2">Total Streams</div>
          <div className="col-span-2">LTM Revenue</div>
          <div className="col-span-1">Status</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {CATALOG_ASSETS.map(asset => (
            <div key={asset.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer items-center group">
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-7 h-7 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center shrink-0">
                  <Music className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white">{asset.title}</p>
                  <p className="text-[10px] font-mono text-white/25">{asset.id}</p>
                </div>
              </div>
              <div className="col-span-2 text-[12px] text-white/60">{asset.artist}</div>
              <div className="col-span-1 text-[12px] font-mono text-white/40">{asset.year}</div>
              <div className="col-span-1 text-[12px] font-mono text-white/50">{asset.tracks}</div>
              <div className="col-span-2 text-[12px] text-white/70">{asset.streams_total}</div>
              <div className="col-span-2 text-[12px] text-white/70">{asset.revenue_ltm}</div>
              <div className="col-span-1 flex items-center gap-2">
                <StatusTag status={asset.status} pulse />
                <ExternalLink className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
