// ORPHANED FILE — Not imported anywhere in the app as of stabilization pass.
// The active Catalog OS app layout is: src/dashboard/pages/catalogOS/CatalogOSLayout.tsx
// The active Catalog OS public page is: src/pages/CatalogOS.tsx
// Do not delete without confirming it is still unused.
import { useEffect, useState } from 'react';
import { Library, Calendar, Clock, ChevronDown } from 'lucide-react';
import { CATALOG_META, CATALOG_OVERVIEW } from '../data/catalogOSData';
import CatalogOverview from '../components/catalog/CatalogOverview';
import CatalogSignalMonitor from '../components/catalog/CatalogSignalMonitor';
import RevenueBreakdown from '../components/catalog/RevenueBreakdown';
import AssetPerformanceTable from '../components/catalog/AssetPerformanceTable';
import OpportunityEngine from '../components/catalog/OpportunityEngine';
import RightsContractStatus from '../components/catalog/RightsContractStatus';
import AIInvestmentInsights from '../components/catalog/AIInvestmentInsights';

function SectionLabel({ label, index }: { label: string; index: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[9px] font-mono text-white/15 tracking-widest">{index}</span>
      <div className="h-[1px] w-3 bg-white/[0.05]" />
      <span className="text-[10px] font-mono text-white/25 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-[1px] bg-white/[0.04]" />
    </div>
  );
}

function ValueRing({ pct, color }: { pct: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative w-14 h-14">
      <svg viewBox="0 0 50 50" className="w-full h-full -rotate-90">
        <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-bold" style={{ color }}>{pct}</span>
      </div>
    </div>
  );
}

export default function CatalogOS() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-5 space-y-6 min-h-full bg-[#07080A]">

      {/* ── Catalog Identity Header ── */}
      <div className="relative bg-[#0A0C0F] border border-white/[0.07] rounded-xl px-6 py-5 overflow-hidden">
        {/* Subtle green glow top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />
        <div className="absolute -top-20 left-1/4 w-80 h-40 rounded-full opacity-[0.04] blur-3xl" style={{ background: '#10B981' }} />

        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#10B981]/25 to-[#06B6D4]/20 border border-[#10B981]/20 flex items-center justify-center shrink-0">
            <Library className="w-6 h-6 text-[#10B981]" />
          </div>

          {/* Name + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[22px] font-bold text-white tracking-tight" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                {CATALOG_META.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                Active
              </span>
              <span className="text-[10px] font-mono text-white/20">{CATALOG_OVERVIEW.multiplier} NMV</span>
            </div>
            <p className="text-[12px] text-white/35 mt-0.5">{CATALOG_META.owner}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Library className="w-3 h-3 text-white/20" />
                <span className="text-[11px] text-white/30">{CATALOG_META.assets_total} assets</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-white/20" />
                <span className="text-[11px] text-white/30">{CATALOG_META.years_span}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/20" />
                <span className="text-[11px] font-mono text-white/20">
                  Audited {CATALOG_META.last_audited} · {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Health ring */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider">Health Score</p>
              <p className="text-[10px] text-white/15 mt-0.5">vs. 75 avg</p>
            </div>
            <ValueRing pct={CATALOG_META.health_score} color="#10B981" />
          </div>

          {/* Switcher */}
          <div className="shrink-0 hidden md:block">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/[0.07] text-[11px] text-white/30 hover:text-white/55 hover:border-white/[0.14] transition-all">
              <Library className="w-3.5 h-3.5" />
              Switch Catalog
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Value ticker strip */}
        <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center gap-6 flex-wrap">
          {[
            { label: 'Est. Value', value: CATALOG_OVERVIEW.total_value, color: '#10B981' },
            { label: 'Monthly Revenue', value: CATALOG_OVERVIEW.monthly_revenue, color: '#06B6D4' },
            { label: 'Growth Rate', value: CATALOG_OVERVIEW.growth_rate, color: '#F59E0B' },
            { label: 'Revenue Multiple', value: CATALOG_OVERVIEW.multiplier, color: '#3B82F6' },
            { label: 'Royalty Yield', value: CATALOG_OVERVIEW.royalty_yield, color: '#A3E635' },
          ].map(kv => (
            <div key={kv.label}>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-0.5">{kv.label}</p>
              <p className="text-[16px] font-bold" style={{ color: kv.color, fontFamily: "'Satoshi', sans-serif" }}>{kv.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 01. Catalog Overview Stats ── */}
      <section>
        <SectionLabel label="Catalog Overview" index="01" />
        <CatalogOverview />
      </section>

      {/* ── AI Investment Insights (priority) ── */}
      <AIInvestmentInsights />

      {/* ── 02. Signal Monitor ── */}
      <section>
        <SectionLabel label="Signal Monitor" index="02" />
        <CatalogSignalMonitor />
      </section>

      {/* ── 03 + 04. Revenue + Asset Table ── */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
          <div>
            <SectionLabel label="Revenue Breakdown" index="03" />
            <RevenueBreakdown />
          </div>
          <div>
            <SectionLabel label="Asset Performance" index="04" />
            <AssetPerformanceTable />
          </div>
        </div>
      </section>

      {/* ── 05. Opportunity Engine ── */}
      <section>
        <SectionLabel label="Opportunity Engine" index="05" />
        <OpportunityEngine />
      </section>

      {/* ── 06. Rights + Contracts ── */}
      <section>
        <SectionLabel label="Rights & Contract Status" index="06" />
        <RightsContractStatus />
      </section>

    </div>
  );
}
