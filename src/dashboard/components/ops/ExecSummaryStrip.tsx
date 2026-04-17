import { AlertTriangle, CheckSquare, DollarSign, Megaphone, FileText, ChevronRight } from 'lucide-react';
import { EXEC_PRIORITIES, ACTIVE_RISKS, DECISIONS_NEEDED, FINANCE } from '../../data/opsData';

const URGENCY_DOT: Record<string, string> = {
  critical: 'bg-[#EF4444] animate-pulse',
  high: 'bg-[#F59E0B]',
  medium: 'bg-[#06B6D4]',
};
const URGENCY_TEXT: Record<string, string> = {
  critical: 'text-[#EF4444]',
  high: 'text-[#F59E0B]',
  medium: 'text-[#06B6D4]',
};

export default function ExecSummaryStrip() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

      {/* Today's Priorities */}
      <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
          <CheckSquare className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Today's Priorities</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {EXEC_PRIORITIES.map(p => (
            <div key={p.id} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${URGENCY_DOT[p.urgency]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/75 leading-snug">{p.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-white/25">{p.owner}</span>
                  <span className="text-[10px] font-mono text-white/20">·</span>
                  <span className={`text-[10px] font-mono ${URGENCY_TEXT[p.urgency]}`}>{p.due}</span>
                </div>
              </div>
              <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Active Risks */}
      <div className="bg-[#0D0E11] border border-[#EF4444]/15 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
          <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Active Risks</span>
          <span className="ml-auto text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">{ACTIVE_RISKS.length} open</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {ACTIVE_RISKS.map(r => (
            <div key={r.id} className="flex items-start gap-2.5 px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                r.level === 'critical' ? 'bg-[#EF4444] animate-pulse' :
                r.level === 'high' ? 'bg-[#F59E0B]' : 'bg-[#06B6D4]'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/75 leading-snug">{r.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-white/25">{r.owner}</span>
                  <span className={`text-[10px] font-mono ${
                    r.level === 'critical' ? 'text-[#EF4444]' : r.level === 'high' ? 'text-[#F59E0B]' : 'text-[#06B6D4]'
                  }`}>{r.est_impact}</span>
                </div>
              </div>
              <ChevronRight className="w-3 h-3 text-white/10 group-hover:text-white/30 transition-colors mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Decisions + KPIs */}
      <div className="flex flex-col gap-3">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: DollarSign, label: 'Revenue Today', value: FINANCE.revenue_today, color: '#10B981' },
            { icon: Megaphone, label: 'Live Campaigns', value: '31', color: '#F59E0B' },
            { icon: FileText, label: 'Contracts Signed', value: '2', color: '#06B6D4' },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-3 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${k.color}44, transparent)` }} />
                <Icon className="w-3.5 h-3.5 mb-1.5" style={{ color: k.color }} />
                <p className="text-[18px] font-bold text-white leading-none font-['Satoshi',sans-serif]" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mt-1">{k.label}</p>
              </div>
            );
          })}
        </div>

        {/* Decisions needed */}
        <div className="bg-[#0D0E11] border border-[#F59E0B]/15 rounded-lg overflow-hidden flex-1">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Decisions Needed</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {DECISIONS_NEEDED.map(d => (
              <div key={d.id} className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/[0.02] transition-colors cursor-pointer">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                  d.urgency === 'critical' ? 'bg-[#EF4444]/10 text-[#EF4444]' :
                  d.urgency === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-[#06B6D4]/10 text-[#06B6D4]'
                }`}>{d.type}</span>
                <p className="text-[11px] text-white/65 flex-1 leading-snug">{d.label}</p>
                <button className="text-[10px] font-mono text-[#06B6D4] hover:text-white transition-colors whitespace-nowrap shrink-0">Decide →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
