import { FileText, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { CONTRACTS } from '../../data/opsData';

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  'Out for Signature': { icon: Clock,          color: 'text-[#F59E0B]' },
  'Review Required':   { icon: AlertTriangle,  color: 'text-[#EF4444]' },
  'Signed':            { icon: CheckCircle,    color: 'text-[#10B981]' },
  'Renewal Due':       { icon: Clock,          color: 'text-[#06B6D4]' },
  'Blocked':           { icon: XCircle,        color: 'text-[#EF4444]' },
};

const RISK_BAR: Record<string, string> = {
  critical: 'bg-[#EF4444]',
  high: 'bg-[#F59E0B]',
  medium: 'bg-[#06B6D4]',
  low: 'bg-[#10B981]',
};

export default function ContractDealFlow() {
  const counts = {
    out: CONTRACTS.filter(c => c.status === 'Out for Signature').length,
    signed: CONTRACTS.filter(c => c.status === 'Signed').length,
    renewal: CONTRACTS.filter(c => c.status === 'Renewal Due').length,
    risk: CONTRACTS.filter(c => c.risk === 'critical' || c.risk === 'high').length,
  };

  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <FileText className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Contract & Deal Flow</span>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 divide-x divide-white/[0.05] border-b border-white/[0.05]">
        {[
          { label: 'Out', value: counts.out, color: 'text-[#F59E0B]' },
          { label: 'Signed', value: counts.signed, color: 'text-[#10B981]' },
          { label: 'Renewal', value: counts.renewal, color: 'text-[#06B6D4]' },
          { label: 'At Risk', value: counts.risk, color: 'text-[#EF4444]' },
        ].map(s => (
          <div key={s.label} className="px-4 py-2.5 text-center">
            <p className={`text-[20px] font-bold leading-none font-['Satoshi',sans-serif] ${s.color}`}>{s.value}</p>
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Contract list */}
      <div className="divide-y divide-white/[0.04]">
        {CONTRACTS.map(c => {
          const cfg = STATUS_CONFIG[c.status];
          const Icon = cfg?.icon ?? FileText;
          return (
            <div key={c.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`w-1 h-6 rounded-full shrink-0 ${RISK_BAR[c.risk]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-medium text-white/80 truncate">{c.artist}</p>
                  <span className="text-[10px] font-mono text-white/25 shrink-0">{c.type}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Icon className={`w-3 h-3 shrink-0 ${cfg?.color ?? 'text-white/30'}`} />
                  <span className={`text-[10px] font-mono ${cfg?.color ?? 'text-white/30'}`}>{c.status}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-[10px] font-mono text-white/25">Exp {c.expires}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[12px] font-mono text-white/55">{c.value}</p>
                <p className="text-[10px] font-mono text-white/20">{c.id}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
