import { Lightbulb, TrendingUp, Zap, Settings2, ArrowRight } from 'lucide-react';
import { OPPORTUNITIES } from '../../data/catalogOSData';

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  Resurgence:   TrendingUp,
  Licensing:    Zap,
  Optimization: Settings2,
};

const URGENCY: Record<string, { border: string; bg: string; badge: string; btn: string; dot: string }> = {
  critical: { border: 'border-[#EF4444]/20', bg: 'bg-[#EF4444]/[0.04]', badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', btn: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/25 hover:bg-[#EF4444]/25', dot: 'bg-[#EF4444]' },
  high:     { border: 'border-[#F59E0B]/20', bg: 'bg-[#F59E0B]/[0.03]', badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25', btn: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/25 hover:bg-[#F59E0B]/25', dot: 'bg-[#F59E0B]' },
  medium:   { border: 'border-[#06B6D4]/15', bg: 'bg-[#06B6D4]/[0.03]', badge: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',  btn: 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/20  hover:bg-[#06B6D4]/25', dot: 'bg-[#06B6D4]' },
};

export default function OpportunityEngine() {
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
        <span className="text-[13px] font-semibold text-white/80">Opportunity Engine</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{OPPORTUNITIES.length} active opportunities</span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {OPPORTUNITIES.map(op => {
          const styles = URGENCY[op.urgency];
          const Icon = TYPE_ICON[op.type] ?? Lightbulb;
          return (
            <div key={op.id} className={`rounded-xl border ${styles.border} ${styles.bg} p-4 flex flex-col gap-3`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${styles.badge}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${styles.badge}`}>{op.type}</span>
                    <span className="text-[10px] font-mono text-white/25">{op.asset}</span>
                  </div>
                  <p className="text-[13px] font-semibold text-white leading-snug">{op.headline}</p>
                </div>
              </div>
              <p className="text-[12px] text-white/45 leading-relaxed">{op.detail}</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-white/30">{op.impact}</span>
                <button className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${styles.btn}`}>
                  {op.cta} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
