import { useState, useEffect } from 'react';
import { Megaphone, TrendingUp, TrendingDown, PlusCircle, ChevronDown, ChevronRight } from 'lucide-react';
import StatusTag from '../components/StatusTag';
import AIInsightPanel from '../components/AIInsightPanel';
import { CAMPAIGNS } from '../data/mockData';

function BudgetBar({ spent, budget }: { spent: string; budget: string }) {
  const s = parseFloat(spent.replace(/\D/g, ''));
  const b = parseFloat(budget.replace(/\D/g, ''));
  const pct = Math.min(100, Math.round((s / b) * 100));
  const color = pct >= 90 ? '#EF4444' : pct >= 70 ? '#F59E0B' : '#06B6D4';
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-mono text-white/30">Budget Used</span>
        <span className="text-[10px] font-mono" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] font-mono text-white/25">{spent} spent</span>
        <span className="text-[10px] font-mono text-white/25">{budget} total</span>
      </div>
    </div>
  );
}

const LIVE_METRICS = [
  { label: 'Total Reach (7d)', value: '14.2M', delta: '+11%', up: true },
  { label: 'Avg CTR', value: '2.1%', delta: '-0.3%', up: false },
  { label: 'Ad Spend (MTD)', value: '$53,100', delta: '+7%', up: true },
  { label: 'Attributed Streams', value: '980K', delta: '+22%', up: true },
];

export default function CampaignEngine() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [liveTick, setLiveTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLiveTick(p => p + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const liveReach = (14200000 + liveTick * 1247).toLocaleString();

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-4 h-4 text-[#F59E0B]" />
            <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Campaign Engine</h1>
          </div>
          <p className="text-[12px] text-white/30">{CAMPAIGNS.length} active campaigns · reach updating live</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#06B6D4]/20 bg-[#06B6D4]/5 text-[11px] text-[#06B6D4] hover:bg-[#06B6D4]/10 transition-all">
          <PlusCircle className="w-3.5 h-3.5" />
          New Campaign
        </button>
      </div>

      {/* Live metrics row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {LIVE_METRICS.map((m, i) => (
          <div key={m.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/30 to-transparent" />
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">{m.label}</p>
            <p className="text-[22px] font-bold text-white leading-none font-['Satoshi',sans-serif]">
              {i === 0 ? liveReach.replace(/\d{7,}/, (14200000 + liveTick * 1247 > 1000000 ? ((14200000 + liveTick * 1247) / 1000000).toFixed(1) + 'M' : m.value)) : m.value}
            </p>
            <div className={`flex items-center gap-1 mt-1.5 text-[11px] font-mono ${m.up ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {m.delta}
            </div>
          </div>
        ))}
      </div>

      <AIInsightPanel />

      {/* Campaign cards */}
      <div className="space-y-3">
        {CAMPAIGNS.map(c => {
          const isExpanded = expanded === c.id;
          return (
            <div key={c.id} className={`bg-[#0D0E11] border rounded-lg overflow-hidden transition-all ${
              c.status === 'Blocked' ? 'border-[#EF4444]/20' :
              c.status === 'Risk' ? 'border-[#F59E0B]/20' :
              c.status === 'Scaling' ? 'border-[#06B6D4]/20' :
              'border-white/[0.06]'
            }`}>
              <div
                className="px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={() => setExpanded(isExpanded ? null : c.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-[14px] font-medium text-white">{c.name}</p>
                      <StatusTag status={c.status} pulse />
                      <span className="text-[10px] font-mono text-white/25 bg-white/[0.04] px-2 py-0.5 rounded">{c.type}</span>
                    </div>
                    <p className="text-[11px] font-mono text-white/30">{c.id} · ends {c.end}</p>
                  </div>

                  <div className="hidden md:flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-0.5">Reach</p>
                      <p className="text-[13px] font-medium text-white">{c.reach}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-0.5">CTR</p>
                      <p className={`text-[13px] font-mono font-medium ${
                        c.ctr === '—' ? 'text-white/20' :
                        parseFloat(c.ctr) >= 2 ? 'text-[#10B981]' :
                        parseFloat(c.ctr) >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                      }`}>{c.ctr}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-0.5">Spent</p>
                      <p className="text-[13px] font-medium text-white">{c.spent}</p>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-white/20 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Budget progress */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] transition-all"
                      style={{ width: `${Math.min(100, Math.round((parseFloat(c.spent.replace(/\D/g, '')) / parseFloat(c.budget.replace(/\D/g, ''))) * 100))}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/25 shrink-0">
                    {Math.min(100, Math.round((parseFloat(c.spent.replace(/\D/g, '')) / parseFloat(c.budget.replace(/\D/g, ''))) * 100))}% of {c.budget}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-white/[0.06] px-5 py-4 bg-white/[0.015]">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <BudgetBar spent={c.spent} budget={c.budget} />
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Artist</p>
                      <p className="text-[13px] text-white/80">{c.artist}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">Campaign Type</p>
                      <p className="text-[13px] text-white/80">{c.type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-white/25 uppercase mb-1">End Date</p>
                      <p className="text-[13px] text-white/80">{c.end}</p>
                    </div>
                  </div>

                  {c.status === 'Risk' && (
                    <div className="mb-4 p-3 rounded border border-[#F59E0B]/20 bg-[#F59E0B]/5">
                      <p className="text-[11px] text-[#F59E0B]">
                        CTR below floor (0.8% vs 1.2% threshold). Creative fatigue detected at Day 18. Recommend: rotate creative assets + expand audience to 25–34 demo.
                      </p>
                    </div>
                  )}
                  {c.status === 'Blocked' && (
                    <div className="mb-4 p-3 rounded border border-[#EF4444]/20 bg-[#EF4444]/5">
                      <p className="text-[11px] text-[#EF4444]">
                        Campaign delivery blocked. Budget exhausted. Pending reauthorization from artist manager. No impressions since Apr 7.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[11px] text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" />
                      Full Campaign View
                    </button>
                    <button className="px-3 py-1.5 rounded border border-white/[0.08] text-[11px] text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-colors">
                      Edit Settings
                    </button>
                    {c.status !== 'Blocked' && (
                      <button className="px-3 py-1.5 rounded border border-white/[0.08] text-[11px] text-white/40 hover:text-white/70 hover:border-white/[0.15] transition-colors ml-auto">
                        Pause Campaign
                      </button>
                    )}
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
