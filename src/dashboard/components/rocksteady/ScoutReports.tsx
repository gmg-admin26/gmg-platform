import { FileText, Star, MessageSquare } from 'lucide-react';
import { SCOUT_REPORTS } from '../../data/rocksteadyData';

const REC_STYLES: Record<string, string> = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/25 border-white/10',
};

export default function ScoutReports() {
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <FileText className="w-4 h-4 text-[#06B6D4]" />
        <span className="text-[13px] font-semibold text-white/80">Scout Reports</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{SCOUT_REPORTS.length} reports this week</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {SCOUT_REPORTS.map(r => (
          <div key={r.id} className="p-4 hover:bg-white/[0.015] transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0">
                <MessageSquare className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[13px] font-semibold text-white/80">{r.artist}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${REC_STYLES[r.recommendation]}`}>{r.recommendation}</span>
                  <div className="flex items-center gap-0.5 ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-white/10'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed mb-2 italic">"{r.summary}"</p>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex gap-1.5 flex-wrap">
                    {r.tags.map(t => (
                      <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.05]">{t}</span>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-white/20">{r.scout} · {r.date}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
