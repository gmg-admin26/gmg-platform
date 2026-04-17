import { DollarSign, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import { FINANCE } from '../../data/opsData';

export default function FinanceCommand() {
  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Finance Command</span>
        <span className="ml-auto text-[10px] font-mono text-[#10B981]">● Live</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Cash position */}
        <div className="relative p-3 rounded-lg bg-[#10B981]/5 border border-[#10B981]/15 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Cash Position</p>
          <p className="text-[28px] font-bold text-[#10B981] leading-none font-['Satoshi',sans-serif]">{FINANCE.cash_position}</p>
          <p className="text-[11px] text-[#10B981]/60 mt-1">{FINANCE.cash_delta}</p>
        </div>

        {/* Revenue today */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Revenue Today</p>
            <p className="text-[14px] font-bold text-white font-['Satoshi',sans-serif]">{FINANCE.revenue_today}</p>
          </div>
          <div className="space-y-1.5">
            {FINANCE.channels.map(ch => (
              <div key={ch.label} className="flex items-center gap-2">
                <span className="text-[10px] text-white/30 w-14 shrink-0">{ch.label}</span>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${ch.pct}%`, background: ch.color }} />
                </div>
                <span className="text-[10px] font-mono text-white/45 w-14 text-right shrink-0">{ch.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MTD progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <ArrowDownLeft className="w-3 h-3 text-[#06B6D4]" />
              <p className="text-[11px] text-white/45">Incoming (MTD)</p>
            </div>
            <p className="text-[12px] font-mono text-white/70">{FINANCE.incoming_this_month}</p>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-[#06B6D4] rounded-full" style={{ width: `${FINANCE.incoming_progress}%` }} />
          </div>
          <p className="text-[10px] font-mono text-white/20 mt-1">{FINANCE.incoming_progress}% of plan</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight className="w-3 h-3 text-[#F59E0B]" />
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Pending Payouts</p>
            </div>
            <p className="text-[13px] font-bold text-[#F59E0B] font-['Satoshi',sans-serif]">{FINANCE.pending_payouts}</p>
          </div>
          <div className="p-2.5 rounded bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-[#06B6D4]" />
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Next Royalty</p>
            </div>
            <p className="text-[13px] font-bold text-[#06B6D4] font-['Satoshi',sans-serif]">{FINANCE.royalty_next}</p>
            <p className="text-[10px] text-white/20 mt-0.5">{FINANCE.royalty_batches} batches pending</p>
          </div>
        </div>

        {/* Month-end */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Month-End Close</p>
            <p className="text-[11px] font-mono text-white/45">{FINANCE.month_end_progress}%</p>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] rounded-full"
              style={{ width: `${FINANCE.month_end_progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
