import { useEffect, useState } from 'react';
import { Radio, TrendingUp, BookOpen, DollarSign, AlertTriangle, Activity, Settings } from 'lucide-react';
import { ACTIVITY_FEED } from '../data/mockData';

type FeedItem = typeof ACTIVITY_FEED[number];

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  signal: Radio,
  campaign: TrendingUp,
  catalog: BookOpen,
  revenue: DollarSign,
  risk: AlertTriangle,
  system: Settings,
};

const LEVEL_DOT: Record<string, string> = {
  critical: 'bg-[#EF4444] animate-pulse',
  warning: 'bg-[#F59E0B]',
  success: 'bg-[#10B981]',
  info: 'bg-[#06B6D4]',
};

export default function ActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>(ACTIVITY_FEED);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(p => p + 1);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg flex flex-col overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Activity Feed</span>
        </div>
        <span className="text-[9px] font-mono text-white/20">{items.length} events</span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type] ?? Activity;
          return (
            <div key={item.id} className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-default">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 relative shrink-0">
                  <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${LEVEL_DOT[item.level]}`} />
                  <div className="w-6 h-6 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <Icon className="w-3 h-3 text-white/30" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/70 leading-snug">{item.text}</p>
                  <p className="text-[10px] text-white/25 mt-0.5 font-mono">{item.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
