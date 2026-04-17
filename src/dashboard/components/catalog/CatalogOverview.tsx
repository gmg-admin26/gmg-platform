import { TrendingUp, Minus } from 'lucide-react';
import { OVERVIEW_STATS } from '../../data/catalogOSData';

export default function CatalogOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {OVERVIEW_STATS.map(stat => (
        <div
          key={stat.id}
          className="relative bg-[#0A0C0F] border border-white/[0.06] rounded-xl p-4 overflow-hidden group hover:border-white/[0.11] transition-all duration-200"
        >
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)` }}
          />
          <div
            className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-[0.05]"
            style={{ background: stat.color }}
          />
          <p className="text-[9px] font-mono text-white/25 uppercase tracking-[0.15em] mb-2.5">{stat.label}</p>
          <p
            className="text-[26px] font-bold leading-none tracking-tight"
            style={{ color: stat.color, fontFamily: "'Satoshi', sans-serif" }}
          >
            {stat.value}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            {stat.dir === 'up' ? (
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
            ) : (
              <Minus className="w-3 h-3 text-white/20" />
            )}
            <span className={`text-[11px] font-mono ${stat.dir === 'up' ? 'text-[#10B981]' : 'text-white/25'}`}>
              {stat.delta}
            </span>
          </div>
          <p className="text-[10px] text-white/18 mt-0.5">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
