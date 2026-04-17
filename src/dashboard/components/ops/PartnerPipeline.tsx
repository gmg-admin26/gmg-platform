import { Handshake } from 'lucide-react';
import { PARTNER_PIPELINE } from '../../data/opsData';

const TYPE_COLOR: Record<string, string> = {
  'Brand Deal': '#F59E0B',
  'Banking': '#06B6D4',
  'Insurance': '#10B981',
  'Legal': '#8B5CF6',
};

const STATUS_COLOR: Record<string, string> = {
  'Active Partner':  'text-[#10B981]',
  'Negotiating':     'text-[#F59E0B]',
  'Due Diligence':   'text-[#06B6D4]',
  'Proposal Sent':   'text-[#06B6D4]',
  'Intro Call':      'text-white/40',
  'At Risk':         'text-[#EF4444]',
};

export default function PartnerPipeline() {
  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Handshake className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Partner Pipeline</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{PARTNER_PIPELINE.length} active</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {PARTNER_PIPELINE.map(p => {
          const typeColor = TYPE_COLOR[p.type] ?? '#ffffff';
          return (
            <div key={p.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-white/80">{p.partner}</p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                      style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25` }}>
                      {p.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-mono ${STATUS_COLOR[p.status] ?? 'text-white/30'}`}>{p.status}</span>
                    <span className="text-white/15">·</span>
                    <span className="text-[10px] text-white/25">{p.contact}</span>
                  </div>
                </div>
                <p className="text-[12px] font-mono text-white/55 shrink-0 text-right">{p.value}</p>
              </div>

              {/* Stage progress */}
              <div className="flex items-center gap-1.5">
                {Array.from({ length: p.stages }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      i < p.stage
                        ? p.status === 'At Risk' ? 'bg-[#EF4444]'
                        : p.status === 'Active Partner' ? 'bg-[#10B981]'
                        : 'bg-[#06B6D4]'
                        : 'bg-white/[0.06]'
                    }`}
                  />
                ))}
                <span className="text-[9px] font-mono text-white/20 ml-1 shrink-0">{p.stage}/{p.stages}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
