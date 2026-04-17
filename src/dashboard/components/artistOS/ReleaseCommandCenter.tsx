import { CheckCircle, Circle, AlertCircle, Clock, Disc3 } from 'lucide-react';
import { RELEASES } from '../../data/artistOSData';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  live:        { label: 'Live', color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 border-[#10B981]/20' },
  in_progress: { label: 'In Progress', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20' },
  concept:     { label: 'Concept', color: 'text-white/30', bg: 'bg-white/[0.05] border-white/[0.08]' },
};

export default function ReleaseCommandCenter() {
  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Disc3 className="w-4 h-4 text-[#06B6D4]" />
        <span className="text-[13px] font-semibold text-white/80">Release Command Center</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{RELEASES.length} releases</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {RELEASES.map(rel => {
          const cfg = STATUS_CONFIG[rel.status];
          const done = rel.checklist.filter(c => c.done).length;
          const total = rel.checklist.length;
          const pct = Math.round((done / total) * 100);
          const urgentMissing = rel.checklist.filter(c => !c.done && c.urgent);

          return (
            <div key={rel.id} className="p-5">
              <div className="flex items-start gap-4">
                {/* Cover placeholder */}
                <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-bold text-white font-mono"
                  style={{ background: `${rel.cover_color}20`, border: `1px solid ${rel.cover_color}30`, color: rel.cover_color }}>
                  {rel.type === 'Album' ? 'LP' : rel.type === 'EP' ? 'EP' : '7"'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-[14px] font-semibold text-white">{rel.title}</h3>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    {urgentMissing.length > 0 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 animate-pulse">
                        {urgentMissing.length} URGENT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/20" />
                      <span className="text-[11px] text-white/30">{rel.release_date}</span>
                    </div>
                    {rel.days_out > 0 && (
                      <span className={`text-[11px] font-mono ${rel.days_out <= 14 ? 'text-[#F59E0B]' : 'text-white/30'}`}>
                        {rel.days_out}d out
                      </span>
                    )}
                    {rel.days_out < 0 && (
                      <span className="text-[11px] font-mono text-[#10B981]">Released</span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-white/25">Checklist progress</span>
                      <span className="text-[10px] font-mono text-white/40">{done}/{total}</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? '#10B981' : pct > 60 ? '#F59E0B' : rel.cover_color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {rel.checklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {item.done ? (
                          <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                        ) : item.urgent ? (
                          <AlertCircle className="w-3.5 h-3.5 text-[#EF4444] shrink-0 animate-pulse" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-white/15 shrink-0" />
                        )}
                        <span className={`text-[11px] leading-snug ${
                          item.done ? 'text-white/30 line-through' :
                          item.urgent ? 'text-[#EF4444]' :
                          'text-white/55'
                        }`}>{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
