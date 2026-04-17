import { Radio, TrendingUp, Zap, List, MapPin, Globe, ArrowRight } from 'lucide-react';
import { SIGNALS } from '../../data/rocksteadyData';

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'TikTok Spike':       Zap,
  'Breaking Alert':     Radio,
  'Streaming Accel':    TrendingUp,
  'Playlist Velocity':  List,
  'Engagement Cluster': Globe,
  'Sync Inquiry':       Zap,
  'Press Coverage':     Globe,
  'Emerging Market':    MapPin,
};

const LEVEL: Record<string, { pill: string; dot: string; border: string }> = {
  critical: { pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', dot: 'bg-[#EF4444] animate-pulse', border: 'border-l-[#EF4444]' },
  high:     { pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25', dot: 'bg-[#F59E0B]',              border: 'border-l-[#F59E0B]' },
  medium:   { pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', dot: 'bg-[#06B6D4]',              border: 'border-l-[#06B6D4]' },
};

export default function SignalFeed() {
  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
        <Radio className="w-4 h-4 text-[#EF4444]" />
        <span className="text-[13px] font-semibold text-white/80">Signal Feed</span>
        <span className="text-[9px] font-mono text-white/15 tracking-widest">// LIVE</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{SIGNALS.length} signals</span>
      </div>

      <div className="divide-y divide-white/[0.03] max-h-[420px] overflow-y-auto">
        {SIGNALS.map(sig => {
          const lvl = LEVEL[sig.level];
          const Icon = TYPE_ICON[sig.type] ?? Radio;
          return (
            <div key={sig.id} className={`flex gap-3 px-5 py-3 border-l-2 ${lvl.border} hover:bg-white/[0.015] transition-colors cursor-pointer`}>
              <div className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 ${lvl.pill}`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${lvl.pill}`}>{sig.type}</span>
                  {sig.artist !== '—' && <span className="text-[11px] font-semibold text-white/80">{sig.artist}</span>}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-white/20" />
                    <span className="text-[10px] text-white/20">{sig.location}</span>
                  </div>
                </div>
                <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{sig.detail}</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[10px] font-mono text-white/20">{sig.ts === 'now' ? 'just now' : `${sig.ts} ago`}</span>
                <div className="mt-1">
                  <ArrowRight className="w-3 h-3 text-white/15 ml-auto" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
