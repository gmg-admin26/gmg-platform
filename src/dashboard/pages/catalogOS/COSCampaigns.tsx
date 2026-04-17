import { Megaphone, TrendingUp, DollarSign, Play, Clock } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { BN_CAMPAIGNS } from '../../data/bassnectarCatalogData';

const CAMPAIGNS = BN_CAMPAIGNS;

const STATUS_META: Record<string, { color: string; label: string }> = {
  active:    { color: '#10B981', label: 'Active'    },
  planned:   { color: '#06B6D4', label: 'Planned'   },
  completed: { color: '#6B7280', label: 'Completed' },
  paused:    { color: '#F59E0B', label: 'Paused'    },
};

function fmtUSD(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function COSCampaigns() {
  const activeCampaigns = CAMPAIGNS.filter(c => c.status === 'active');
  const totalBudget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpent  = CAMPAIGNS.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Megaphone}
        title="Campaigns + Releases"
        subtitle="All active, planned, and completed marketing campaigns across the catalog"
        accentColor="#10B981"
        actions={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#10B981]/25 bg-[#10B981]/[0.07] text-[10.5px] text-[#10B981] hover:bg-[#10B981]/[0.12] transition-all">
            <Play className="w-3 h-3" />
            New Campaign
          </button>
        }
      />
      <div className="p-5 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Active Campaigns',  value: activeCampaigns.length.toString(), color: '#10B981' },
            { label: 'Total Budget',      value: fmtUSD(totalBudget),               color: '#06B6D4' },
            { label: 'Total Spent',       value: fmtUSD(totalSpent),                color: '#F59E0B' },
            { label: 'Budget Remaining',  value: fmtUSD(totalBudget - totalSpent),  color: '#3B82F6' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Active Campaigns Detail */}
        {activeCampaigns.length > 0 && (
          <div>
            <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3">Active Campaigns</p>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {activeCampaigns.map(c => {
                const sm = STATUS_META[c.status] ?? STATUS_META.active;
                const spendPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                return (
                  <div key={c.id} className="bg-[#0B0D10] border border-[#10B981]/15 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px]"
                      style={{ background: 'linear-gradient(90deg, transparent, #10B98125, transparent)' }} />
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded" style={{ color: sm.color, background: `${sm.color}14` }}>{sm.label.toUpperCase()}</span>
                          <span className="text-[9.5px] text-white/25 font-mono">{c.id}</span>
                        </div>
                        <h3 className="text-[13.5px] font-semibold text-white/85">{c.name}</h3>
                        <p className="text-[10.5px] text-white/35 mt-0.5">{c.asset} · {c.channel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/25 font-mono">ROI</p>
                        <p className="text-[16px] font-bold text-[#10B981]">{c.roi}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'Impressions', value: c.impressions, color: '#06B6D4' },
                        { label: 'Clicks',      value: c.clicks,      color: '#F59E0B' },
                        { label: 'New Streams', value: c.streams,     color: '#10B981' },
                      ].map(stat => (
                        <div key={stat.label} className="text-center p-2 rounded-lg bg-white/[0.03]">
                          <p className="text-[13px] font-bold" style={{ color: stat.color }}>{stat.value}</p>
                          <p className="text-[9px] text-white/25 mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-white/30">Budget: {fmtUSD(c.budget)}</span>
                        <span className="text-[10px] font-mono" style={{ color: sm.color }}>
                          {fmtUSD(c.spent)} spent ({spendPct}%)
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${spendPct}%`, background: '#10B981' }} />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9.5px] text-white/20 font-mono">{c.start}</span>
                        <span className="text-[9.5px] text-white/20 font-mono">{c.end}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Campaigns Table */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3">All Campaigns</p>
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Campaign', 'Asset', 'Status', 'Budget', 'Spent', 'ROI', 'Channel', 'Dates'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {CAMPAIGNS.map(c => {
                  const sm = STATUS_META[c.status] ?? STATUS_META.active;
                  return (
                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-[12px] font-medium text-white/80">{c.name}</p>
                        <p className="text-[9.5px] font-mono text-white/25">{c.id}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-white/50">{c.asset}</td>
                      <td className="px-4 py-3">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ color: sm.color, background: `${sm.color}14` }}>
                          {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11.5px] font-mono text-white/60">{fmtUSD(c.budget)}</td>
                      <td className="px-4 py-3 text-[11.5px] font-mono text-white/50">{fmtUSD(c.spent)}</td>
                      <td className="px-4 py-3 text-[12px] font-bold" style={{ color: c.roi !== '—' ? '#10B981' : '#6B7280' }}>{c.roi}</td>
                      <td className="px-4 py-3 text-[10.5px] text-white/40">{c.channel}</td>
                      <td className="px-4 py-3">
                        <p className="text-[10px] font-mono text-white/35">{c.start} → {c.end}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planned Campaigns */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Clock className="w-3 h-3 text-[#06B6D4]" /> Planned
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CAMPAIGNS.filter(c => c.status === 'planned').map(c => (
              <div key={c.id} className="bg-[#0B0D10] border border-white/[0.06] border-dashed rounded-xl p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#06B6D4]/10 border border-[#06B6D4]/20">
                  <Megaphone className="w-4 h-4 text-[#06B6D4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-white/70">{c.name}</p>
                  <p className="text-[10px] text-white/30">{c.asset} · {c.start} – {c.end}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-white/25">Budget</p>
                  <p className="text-[12px] font-bold text-[#06B6D4]">{fmtUSD(c.budget)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
