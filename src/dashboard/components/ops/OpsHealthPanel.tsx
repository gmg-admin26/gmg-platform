import { AlertOctagon, Clock, XCircle, AlertTriangle, Server } from 'lucide-react';
import { OPS_HEALTH } from '../../data/opsData';

const STATUS_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  failed:   { icon: XCircle,       color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10 border-[#EF4444]/20', label: 'Failed' },
  blocked:  { icon: AlertOctagon,  color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10 border-[#EF4444]/20', label: 'Blocked' },
  pending:  { icon: Clock,         color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20', label: 'Pending' },
  breached: { icon: AlertTriangle, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20', label: 'SLA Breach' },
  degraded: { icon: Server,        color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10 border-[#06B6D4]/20', label: 'Degraded' },
};

const IMPACT_COLOR: Record<string, string> = {
  Critical: 'text-[#EF4444]',
  High: 'text-[#F59E0B]',
  Medium: 'text-[#06B6D4]',
  Low: 'text-white/25',
};

export default function OpsHealthPanel() {
  const critCount = OPS_HEALTH.filter(i => i.status === 'failed' || i.status === 'blocked').length;

  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Server className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Operations Health</span>
        {critCount > 0 && (
          <span className="ml-auto text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1.5 py-0.5 rounded animate-pulse">
            {critCount} CRITICAL
          </span>
        )}
      </div>
      <div className="divide-y divide-white/[0.04]">
        {OPS_HEALTH.map(item => {
          const cfg = STATUS_CONFIG[item.status];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <Icon className={`w-3 h-3 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/70 leading-snug">{item.item}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-mono ${cfg.color}`}>{cfg.label}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-[10px] font-mono text-white/25">{item.since}</span>
                  <span className="text-white/15">·</span>
                  <span className={`text-[10px] font-mono font-medium ${IMPACT_COLOR[item.impact] ?? 'text-white/25'}`}>
                    {item.impact} impact
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-white/25 bg-white/[0.04] px-2 py-0.5 rounded shrink-0">{item.category}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
