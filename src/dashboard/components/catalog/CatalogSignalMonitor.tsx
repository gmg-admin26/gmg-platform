import { useState } from 'react';
import { Radio, TrendingUp, Zap, List, Globe, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { CATALOG_SIGNALS } from '../../data/catalogOSData';

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'Song Resurgence':  TrendingUp,
  'Playlist Velocity': List,
  'Sync Opportunity': Zap,
  'Catalog Spike':    Globe,
};

const LEVEL: Record<string, { pill: string; bar: string; border: string; glow: string }> = {
  critical: { pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', bar: 'bg-[#EF4444]', border: 'border-l-[#EF4444]', glow: 'shadow-[0_0_24px_rgba(239,68,68,0.07)]' },
  high:     { pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25', bar: 'bg-[#F59E0B]', border: 'border-l-[#F59E0B]', glow: 'shadow-[0_0_24px_rgba(245,158,11,0.07)]' },
};

export default function CatalogSignalMonitor() {
  const [expanded, setExpanded] = useState<string>('CS-001');

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <Radio className="w-4 h-4 text-[#06B6D4]" />
        <span className="text-[13px] font-semibold text-white/80">Catalog Signal Monitor</span>
        <span className="text-[9px] font-mono text-white/15 tracking-widest ml-1">// LIVE</span>
        <div className="ml-auto flex items-center gap-2">
          {(['critical', 'high'] as const).map(lvl => (
            <span key={lvl} className={`text-[9px] font-mono px-2 py-0.5 rounded border ${LEVEL[lvl].pill}`}>
              {CATALOG_SIGNALS.filter(s => s.level === lvl).length} {lvl}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {CATALOG_SIGNALS.map(sig => {
          const isOpen = expanded === sig.id;
          const styles = LEVEL[sig.level];
          const Icon = TYPE_ICON[sig.type] ?? TrendingUp;
          return (
            <div
              key={sig.id}
              className={`border-l-2 ${styles.border} cursor-pointer transition-all ${isOpen ? styles.glow : ''}`}
              onClick={() => setExpanded(isOpen ? '' : sig.id)}
            >
              <div className={`px-5 py-3.5 ${isOpen ? 'bg-white/[0.015]' : 'hover:bg-white/[0.01]'} transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${styles.pill}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${styles.pill}`}>{sig.type}</span>
                      <p className="text-[13px] font-semibold text-white">{sig.asset}</p>
                      <span className="text-[11px] text-white/30">· {sig.platform}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className={`text-[13px] font-bold font-mono ${sig.level === 'critical' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`}>
                        {sig.magnitude}
                      </span>
                      <span className="text-[10px] text-white/25">{sig.ts}</span>
                      {!isOpen && <span className="text-[11px] text-white/35 truncate max-w-sm hidden md:block">{sig.what}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 text-white/20">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              {isOpen && (
                <div className="px-5 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/[0.025] rounded-lg p-3.5 border border-white/[0.05]">
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">What's Happening</p>
                    <p className="text-[12px] text-white/65 leading-relaxed">{sig.what}</p>
                  </div>
                  <div className="bg-white/[0.025] rounded-lg p-3.5 border border-white/[0.05]">
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">Why It Matters</p>
                    <p className="text-[12px] text-white/65 leading-relaxed">{sig.why}</p>
                  </div>
                  <div className={`rounded-lg p-3.5 border ${sig.level === 'critical' ? 'bg-[#EF4444]/[0.05] border-[#EF4444]/15' : 'bg-[#F59E0B]/[0.05] border-[#F59E0B]/15'}`}>
                    <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest mb-2">What To Do Next</p>
                    <p className="text-[12px] text-white/80 leading-relaxed mb-3">{sig.next}</p>
                    <button className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${sig.level === 'critical' ? 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/25 hover:bg-[#EF4444]/25' : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/25 hover:bg-[#F59E0B]/25'}`}>
                      Take Action <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
