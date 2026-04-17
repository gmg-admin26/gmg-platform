import { DollarSign, TrendingUp } from 'lucide-react';
import { REVENUE_BREAKDOWN } from '../../data/catalogOSData';

export default function RevenueBreakdown() {
  const maxBar = Math.max(...REVENUE_BREAKDOWN.streams.map(m => m.val));

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <DollarSign className="w-4 h-4 text-[#10B981]" />
        <span className="text-[13px] font-semibold text-white/80">Revenue Breakdown</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">6-month trend</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Bar chart */}
        <div>
          <div className="flex items-end gap-1.5 h-20">
            {REVENUE_BREAKDOWN.streams.map((m, i) => {
              const h = Math.max(6, (m.val / maxBar) * 100);
              const isLatest = i === REVENUE_BREAKDOWN.streams.length - 1;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
                  <div className="relative w-full flex flex-col justify-end" style={{ height: '100%' }}>
                    <div
                      className="w-full rounded-t transition-all group-hover:opacity-80"
                      style={{
                        height: `${h}%`,
                        background: isLatest
                          ? 'linear-gradient(180deg, #10B981, #06B6D4)'
                          : 'rgba(255,255,255,0.05)',
                        boxShadow: isLatest ? '0 0 12px rgba(16,185,129,0.2)' : 'none',
                      }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-white/20">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-mono text-white/20">Nov '25</span>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
              <span className="text-[11px] font-mono text-[#10B981]">+118% in 6 months</span>
            </div>
          </div>
        </div>

        {/* Source breakdown */}
        <div className="border-t border-white/[0.05] pt-4">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">By Source</p>
          <div className="space-y-2.5">
            {REVENUE_BREAKDOWN.sources.map(s => (
              <div key={s.source} className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                <span className="text-[11px] text-white/40 w-28 shrink-0">{s.source}</span>
                <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.pct}%`, background: s.color, opacity: 0.8 }}
                  />
                </div>
                <span className="text-[11px] font-mono text-white/50 w-16 text-right shrink-0">
                  ${(s.amount / 1000).toFixed(0)}K
                </span>
                <span className="text-[10px] font-mono text-white/25 w-8 text-right shrink-0">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="border-t border-white/[0.05] pt-4">
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-3">By Platform</p>
          <div className="grid grid-cols-5 gap-2">
            {REVENUE_BREAKDOWN.platforms.map(p => (
              <div key={p.name} className="text-center">
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-1">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <p className="text-[10px] text-white/40">{p.name}</p>
                <p className="text-[10px] font-mono text-white/25">{p.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
