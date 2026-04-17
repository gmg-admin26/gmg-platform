import { Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { RIGHTS } from '../../data/catalogOSData';

const STATUS_CFG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string; label: string }> = {
  clean:    { icon: CheckCircle,   color: 'text-[#10B981]', bg: 'bg-[#10B981]/8',  border: 'border-[#10B981]/15', label: 'Clean' },
  expiring: { icon: AlertTriangle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/8',  border: 'border-[#EF4444]/15', label: 'Expiring Soon' },
  review:   { icon: Clock,         color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/8',  border: 'border-[#F59E0B]/15', label: 'Needs Review' },
};

export default function RightsContractStatus() {
  const expiringCount = RIGHTS.filter(r => r.status !== 'clean').length;
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Shield className="w-4 h-4 text-[#3B82F6]" />
        <span className="text-[13px] font-semibold text-white/80">Rights & Contract Status</span>
        {expiringCount > 0 && (
          <span className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 animate-pulse">
            {expiringCount} need attention
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {['Asset', 'Ownership', 'Rights Type', 'Deal', 'Territory', 'Expires', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {RIGHTS.map(r => {
              const cfg = STATUS_CFG[r.status];
              const Icon = cfg.icon;
              return (
                <tr key={r.id} className="hover:bg-white/[0.015] transition-colors group cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-medium text-white/75 group-hover:text-white transition-colors whitespace-nowrap">{r.asset}</p>
                    <p className="text-[10px] font-mono text-white/20">{r.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: r.ownership }} />
                      </div>
                      <span className="text-[12px] font-mono text-white/55">{r.ownership}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/40 whitespace-nowrap">{r.rights_type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-white/35 whitespace-nowrap">{r.deal}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-mono text-white/30">{r.territory}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-mono whitespace-nowrap ${r.status === 'expiring' ? 'text-[#EF4444]' : r.status === 'review' ? 'text-[#F59E0B]' : 'text-white/30'}`}>
                      {r.expires}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border w-fit whitespace-nowrap ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      <Icon className="w-2.5 h-2.5" />
                      {cfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-white/[0.05] flex items-center gap-6">
        {Object.entries(STATUS_CFG).map(([k, v]) => {
          const Icon = v.icon;
          const count = RIGHTS.filter(r => r.status === k).length;
          return (
            <div key={k} className="flex items-center gap-1.5">
              <Icon className={`w-3 h-3 ${v.color}`} />
              <span className={`text-[10px] font-mono ${v.color}`}>{count} {v.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
