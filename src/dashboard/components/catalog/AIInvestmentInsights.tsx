import { Cpu, TrendingUp, Zap, Settings2, ShoppingCart, ArrowRight } from 'lucide-react';
import { AI_INSIGHTS } from '../../data/catalogOSData';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  hold:     TrendingUp,
  push:     Zap,
  optimize: Settings2,
  buy:      ShoppingCart,
};

const VERDICT_STYLES: Record<string, { border: string; bg: string; badge: string; btn: string; glow: string; barColor: string }> = {
  critical: {
    border: 'border-[#10B981]/20',
    bg: 'bg-[#10B981]/[0.04]',
    badge: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
    btn: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/25 hover:bg-[#10B981]/25',
    glow: 'shadow-[0_0_24px_rgba(16,185,129,0.08)]',
    barColor: '#10B981',
  },
  high: {
    border: 'border-[#EF4444]/20',
    bg: 'bg-[#EF4444]/[0.04]',
    badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25',
    btn: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/25 hover:bg-[#EF4444]/25',
    glow: 'shadow-[0_0_24px_rgba(239,68,68,0.08)]',
    barColor: '#EF4444',
  },
  medium: {
    border: 'border-[#06B6D4]/15',
    bg: 'bg-[#06B6D4]/[0.03]',
    badge: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',
    btn: 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/20 hover:bg-[#06B6D4]/25',
    glow: '',
    barColor: '#06B6D4',
  },
};

export default function AIInvestmentInsights() {
  return (
    <div className="relative bg-[#08090C] border border-[#10B981]/15 rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />

      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
        <div className="w-7 h-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
          <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
        </div>
        <span className="text-[13px] font-semibold text-white/80">AI Investment Insights</span>
        <span className="text-[9px] font-mono text-white/15 tracking-wider ml-1">// updated daily</span>
        <span className="ml-auto text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded">
          {AI_INSIGHTS.length} recommendations
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {AI_INSIGHTS.map(ins => {
          const styles = VERDICT_STYLES[ins.urgency];
          const Icon = ICON_MAP[ins.icon] ?? Cpu;
          return (
            <div key={ins.id} className={`rounded-xl border ${styles.border} ${styles.bg} ${styles.glow} p-4 flex flex-col gap-3`}>
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${styles.badge}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${styles.badge}`}>
                      {ins.verdict}
                    </span>
                    <span className="text-[10px] font-mono text-white/25">{ins.asset}</span>
                  </div>
                </div>
              </div>

              {/* Insight text */}
              <p className="text-[12px] text-white/55 leading-relaxed">{ins.insight}</p>

              {/* Action */}
              <div className="rounded-lg bg-white/[0.025] border border-white/[0.06] p-3">
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-1">Recommended Action</p>
                <p className="text-[12px] text-white/75 leading-relaxed">{ins.action}</p>
              </div>

              {/* Confidence + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/20">AI Confidence</span>
                  <div className="w-20 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ins.confidence}%`, background: styles.barColor }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{ins.confidence}%</span>
                </div>
                <button className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${styles.btn}`}>
                  View Detail <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
