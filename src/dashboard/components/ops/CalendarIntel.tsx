import { Calendar, Music, FileText, Mic, DollarSign, AlertTriangle } from 'lucide-react';
import { CALENDAR_EVENTS } from '../../data/opsData';

const TYPE_ICON: Record<string, React.ElementType> = {
  release: Music,
  contract: FileText,
  tour: Mic,
  finance: DollarSign,
  conflict: AlertTriangle,
};

const TYPE_COLOR: Record<string, string> = {
  release: '#06B6D4',
  contract: '#F59E0B',
  tour: '#10B981',
  finance: '#3B82F6',
  conflict: '#EF4444',
};

export default function CalendarIntel() {
  const sorted = [...CALENDAR_EVENTS].sort((a, b) => a.days_out - b.days_out);

  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Calendar className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Calendar & Deadline Intel</span>
        <span className="ml-auto text-[9px] font-mono text-[#EF4444]">
          {sorted.filter(e => e.urgent).length} urgent
        </span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {sorted.map(ev => {
          const Icon = TYPE_ICON[ev.type] ?? Calendar;
          const color = TYPE_COLOR[ev.type] ?? '#06B6D4';
          return (
            <div key={ev.id} className={`flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer ${ev.urgent ? 'bg-[#EF4444]/[0.02]' : ''}`}>
              <div className="w-8 text-center shrink-0">
                <p className={`text-[16px] font-bold leading-none font-['Satoshi',sans-serif] ${ev.days_out <= 3 ? 'text-[#EF4444]' : ev.days_out <= 7 ? 'text-[#F59E0B]' : 'text-white/40'}`}>
                  {ev.days_out}
                </p>
                <p className="text-[8px] font-mono text-white/20 uppercase">days</p>
              </div>
              <div className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon className="w-2.5 h-2.5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/70 leading-snug truncate">{ev.label}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-white/25">{ev.artist}</span>
                  <span className="text-white/15">·</span>
                  <span className="text-[10px] font-mono" style={{ color }}>{ev.date}</span>
                </div>
              </div>
              {ev.urgent && (
                <span className="text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1.5 py-0.5 rounded shrink-0 animate-pulse">
                  URGENT
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
