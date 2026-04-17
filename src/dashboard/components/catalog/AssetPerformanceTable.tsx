import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus, Zap, ChevronUp, ChevronDown } from 'lucide-react';
import { ASSETS } from '../../data/catalogOSData';

type SortKey = 'title' | 'streams' | 'revenue' | 'growth';
type SortDir = 'asc' | 'desc';

const STATUS_CFG: Record<string, { color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  rising:   { color: 'text-[#10B981]', bg: 'bg-[#10B981]/8',  border: 'border-[#10B981]/15', icon: TrendingUp },
  stable:   { color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/8',  border: 'border-[#06B6D4]/15', icon: Minus },
  declining:{ color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/8',  border: 'border-[#EF4444]/15', icon: TrendingDown },
};

const maxRevenue = Math.max(...ASSETS.map(a => a.revenue));

export default function AssetPerformanceTable() {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'revenue', dir: 'desc' });

  const sorted = [...ASSETS].sort((a, b) => {
    const av = a[sort.key], bv = b[sort.key];
    if (typeof av === 'string' && typeof bv === 'string') return sort.dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return sort.dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const toggle = (key: SortKey) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sort.key === col
      ? sort.dir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-20" />;

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <BarChart3 className="w-4 h-4 text-[#06B6D4]" />
        <span className="text-[13px] font-semibold text-white/80">Asset Performance</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">{ASSETS.length} assets · sorted by revenue</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05]">
              {[
                { key: 'title',   label: 'Asset',     w: '' },
                { key: null,      label: 'Type',      w: 'w-20' },
                { key: 'streams', label: 'Streams',   w: 'w-28' },
                { key: 'revenue', label: 'Revenue/mo',w: 'w-28' },
                { key: 'growth',  label: 'Growth',    w: 'w-24' },
                { key: null,      label: 'Bar',        w: 'w-32' },
                { key: null,      label: 'Status',    w: 'w-28' },
                { key: null,      label: 'Sync',      w: 'w-12' },
              ].map(col => (
                <th
                  key={col.label}
                  className={`text-left px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-wider ${col.w} ${col.key ? 'cursor-pointer hover:text-white/40 transition-colors' : ''}`}
                  onClick={() => col.key && toggle(col.key as SortKey)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && <SortIcon col={col.key as SortKey} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {sorted.map(asset => {
              const cfg = STATUS_CFG[asset.status];
              const Icon = cfg.icon;
              const barPct = (asset.revenue / maxRevenue) * 100;
              return (
                <tr key={asset.id} className="hover:bg-white/[0.015] transition-colors group cursor-pointer">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-white/80 group-hover:text-white transition-colors">{asset.title}</p>
                    <p className="text-[10px] font-mono text-white/25">{asset.year} · {asset.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono text-white/30 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05]">
                      {asset.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[12px] font-mono text-white/60">{(asset.streams / 1000000).toFixed(1)}M</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-mono text-white/70">${asset.revenue.toLocaleString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1 ${asset.growth > 0 ? 'text-[#10B981]' : asset.growth < 0 ? 'text-[#EF4444]' : 'text-white/30'}`}>
                      {asset.growth > 0 ? <TrendingUp className="w-3 h-3" /> : asset.growth < 0 ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                      <span className="text-[12px] font-mono font-semibold">
                        {asset.growth > 0 ? '+' : ''}{asset.growth}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${barPct}%`,
                          background: asset.status === 'rising' ? '#10B981' : asset.status === 'declining' ? '#EF4444' : '#06B6D4',
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border w-fit ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                      <Icon className="w-2.5 h-2.5" />
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {asset.sync && (
                      <div className="flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-[#F59E0B]" aria-label="Sync opportunity" />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
