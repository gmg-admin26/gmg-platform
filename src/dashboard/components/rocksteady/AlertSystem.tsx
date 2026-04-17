import { Bell, MapPin, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { ALERTS } from '../../data/rocksteadyData';

const LEVEL: Record<string, { border: string; bg: string; pill: string; dot: string }> = {
  critical: { border: 'border-l-[#EF4444]', bg: '',              pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', dot: 'bg-[#EF4444] animate-pulse' },
  high:     { border: 'border-l-[#F59E0B]', bg: '',              pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25', dot: 'bg-[#F59E0B]' },
  medium:   { border: 'border-l-[#06B6D4]', bg: '',              pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', dot: 'bg-[#06B6D4]' },
};

export default function AlertSystem() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const active = ALERTS.filter(a => !dismissed.has(a.id));

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <Bell className="w-4 h-4 text-[#EF4444]" />
        <span className="text-[13px] font-semibold text-white/80">Alert System</span>
        <span className="ml-auto text-[9px] font-mono bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 px-2 py-0.5 rounded">
          {active.filter(a => a.level === 'critical').length} critical
        </span>
      </div>

      {active.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <Bell className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-[12px] text-white/20">No active alerts</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {active.map(al => {
            const lvl = LEVEL[al.level];
            return (
              <div key={al.id} className={`group flex items-start gap-3 px-5 py-3.5 border-l-2 ${lvl.border} hover:bg-white/[0.015] transition-colors`}>
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${lvl.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${lvl.pill}`}>{al.level}</span>
                    <p className="text-[12px] font-semibold text-white/80">{al.headline}</p>
                  </div>
                  <p className="text-[11px] text-white/35 leading-relaxed">{al.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-2.5 h-2.5 text-white/20" />
                      <span className="text-[10px] font-mono text-white/20">{al.location}</span>
                      <span className="text-[10px] font-mono text-white/15">· {al.ts === 'now' ? 'just now' : `${al.ts} ago`}</span>
                    </div>
                    <button className={`flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-lg border transition-all ${lvl.pill}`}>
                      {al.action} <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setDismissed(prev => new Set([...prev, al.id]))}
                  className="w-5 h-5 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0 hover:bg-white/[0.1] transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-2.5 h-2.5 text-white/30" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
