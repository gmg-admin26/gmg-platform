import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, Clock,
  Shield, FileText, Lock, ChevronDown, ChevronRight, ChevronUp,
  Users, Scale, RefreshCw, Zap, Activity, Eye, ArrowUpRight,
  Music, ShoppingBag, Mic2, Star, BarChart2, Globe, Radio,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { BN_SALE_ROOM, BN_META, BN_HISTORICAL_REVENUE, BN_REVENUE_2026_QUARTERS } from '../../data/bassnectarCatalogData';

function fmt(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function fmtK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const DRIVER_ICON_MAP: Record<string, typeof Music> = {
  'Streaming': Radio,
  'Audience': Users,
  'Sync Pipeline': Zap,
  'New Releases': Music,
  'Press + Brand': Star,
  'Merch Momentum': ShoppingBag,
  'Fan Club (ZFM)': Users,
  'Social / Cultural Visibility': Globe,
};

const DRIVER_STATUS: Record<string, { label: string; color: string }> = {
  strong:      { label: 'STRONG',      color: '#10B981' },
  growing:     { label: 'GROWING',     color: '#06B6D4' },
  hot:         { label: 'HOT',         color: '#F59E0B' },
  active:      { label: 'ACTIVE',      color: '#10B981' },
  in_progress: { label: 'IN PROGRESS', color: '#3B82F6' },
};

const INTEREST_META: Record<string, { color: string; label: string }> = {
  high:   { color: '#10B981', label: 'HIGH INTEREST'   },
  medium: { color: '#F59E0B', label: 'MED INTEREST'    },
  low:    { color: '#6B7280', label: 'LOW / WATCHING'  },
};

function SectionLabel({ index, label, accent = '#10B981' }: { index: string; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}50` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0" style={{ color: `${accent}70` }}>{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function ReadinessChip({ status, label, detail, color }: { status: string; label: string; detail: string; color: string }) {
  const Icon = status === 'ready' ? CheckCircle : status === 'in_progress' ? Clock : AlertCircle;
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
      style={{ borderColor: `${color}25`, background: `${color}08` }}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
      <div>
        <p className="text-[11.5px] font-semibold" style={{ color }}>{label}</p>
        <p className="text-[10px] text-white/35 mt-0.5 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

// Per-client "Not For Sale" valuation data
const NFS_CLIENTS: Record<string, {
  artistName: string;
  catalogName: string;
  accentColor: string;
  logoUrl?: string;
  annualRevenue: string;
  monthlyRevenue: string;
  estimatedRange: string;
  genres: string;
  totalReleases: number;
  valuationNote: string;
  readinessItems: { label: string; status: 'ready' | 'in_progress' | 'pending'; detail: string }[];
}> = {
  santigold: {
    artistName: 'Santigold',
    catalogName: 'Santigold / Santi White Publishing + Masters',
    accentColor: '#F59E0B',
    annualRevenue: '$180K–$240K',
    monthlyRevenue: '$15K–$20K',
    estimatedRange: '$2.5M – $4.5M',
    genres: 'Alternative / Art-Pop / New Wave',
    totalReleases: 6,
    valuationNote: 'Santigold\'s catalog carries significant cultural equity across alt-pop and art-pop audiences. Recurring streaming and sync income form a durable revenue base. Valuation range is based on trailing NMV with a 14–18× multiple, consistent with culturally resonant independent catalogs.',
    readinessItems: [
      { label: 'Revenue Audit', status: 'in_progress', detail: 'Trailing 12-month revenue capture in progress across DSPs and publishing admin.' },
      { label: 'Rights Verification', status: 'in_progress', detail: 'Master ownership and publishing splits under review. No material encumbrances identified.' },
      { label: 'Sync Pipeline Assessment', status: 'pending', detail: 'Sync licensing opportunities being mapped — strong placement history in film/TV.' },
      { label: 'Data Room Prep', status: 'pending', detail: 'CIM and data room to be assembled once revenue audit is finalized.' },
    ],
  },
  'virgin-catalog-artist': {
    artistName: 'Virgin Catalog Artist',
    catalogName: 'Virgin Catalog Artist — Masters Portfolio',
    accentColor: '#06B6D4',
    annualRevenue: '$90K–$140K',
    monthlyRevenue: '$7.5K–$12K',
    estimatedRange: '$1.2M – $2.2M',
    genres: 'Pop / R&B / Crossover',
    totalReleases: 4,
    valuationNote: 'This catalog represents a legacy pop/R&B asset with stable recurring income and potential for catalog reactivation through targeted streaming and sync campaigns. Estimated valuation is based on a 12–16× trailing NMV multiple, reflecting current yield with upside from planned reactivation efforts.',
    readinessItems: [
      { label: 'Revenue Audit', status: 'pending', detail: 'Initial revenue capture not yet started. GMG team to begin Q3 2026.' },
      { label: 'Rights Verification', status: 'pending', detail: 'Master and publishing rights documentation requested from prior administrator.' },
      { label: 'Catalog Reactivation Plan', status: 'pending', detail: 'Streaming and sync reactivation strategy to be developed following rights verification.' },
      { label: 'Data Room Prep', status: 'pending', detail: 'Data room build queued pending rights and revenue confirmation.' },
    ],
  },
};

function NotForSaleValuation({ clientSlug }: { clientSlug: string }) {
  const d = NFS_CLIENTS[clientSlug];
  if (!d) return null;
  const ACCENT = d.accentColor;

  const statusIcon = (s: string) => s === 'ready' ? CheckCircle : s === 'in_progress' ? Clock : AlertCircle;
  const statusColor = (s: string) => s === 'ready' ? '#10B981' : s === 'in_progress' ? '#F59E0B' : '#6B7280';

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Lock}
        title="Catalog Value / Sale Room"
        subtitle="Prepared valuation — not currently active for sale"
        accentColor={ACCENT}
        badge="NOT FOR SALE"
        logoUrl={d.logoUrl}
        logoAlt={d.artistName}
      />

      <div className="p-5 space-y-6">

        {/* Status banner */}
        <div className="relative bg-[#0B0D10] border rounded-2xl overflow-hidden p-5"
          style={{ borderColor: `${ACCENT}22` }}>
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}35, transparent)` }} />
          <div className="flex items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-[240px]">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full tracking-widest"
                  style={{ color: '#6B7280', background: '#6B728018', border: '1.5px solid #6B728030' }}>
                  NOT FOR SALE
                </span>
              </div>
              <h2 className="text-[18px] font-bold text-white/80 leading-tight mb-1">{d.catalogName}</h2>
              <p className="text-[11.5px] text-white/35 leading-relaxed max-w-2xl">
                This catalog is not currently listed for sale. This page is a prepared valuation overview available to GMG reps. When the catalog is ready for sale, a buyer login can be created to expose the Sale Room to qualified buyers.
              </p>
            </div>
            <div className="shrink-0 flex flex-col gap-2 min-w-[180px]">
              <button disabled
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-semibold border border-white/[0.07] text-white/20 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                Create Buyer Login
              </button>
              <p className="text-[8.5px] font-mono text-white/15 text-center">Available when catalog is listed for sale</p>
            </div>
          </div>
        </div>

        {/* Estimated valuation */}
        <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-4">Estimated Valuation Range</p>
          <div className="flex items-end gap-8 flex-wrap mb-6">
            <div>
              <p className="text-[10px] font-mono text-white/20 mb-1">Estimated Range</p>
              <p className="text-[38px] font-black leading-none" style={{ color: ACCENT }}>{d.estimatedRange}</p>
              <p className="text-[10.5px] text-white/30 mt-1.5">Based on 12–18× NMV · Subject to final revenue audit</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Est. Monthly Revenue', value: d.monthlyRevenue, color: ACCENT },
                { label: 'Est. Annual Revenue',  value: d.annualRevenue,  color: '#10B981' },
                { label: 'Total Releases',       value: `${d.totalReleases}`,          color: '#06B6D4' },
                { label: 'Genre',                value: d.genres,         color: '#F59E0B' },
              ].map(m => (
                <div key={m.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] min-w-[130px]">
                  <p className="text-[8px] font-mono text-white/20 mb-1 uppercase tracking-wider">{m.label}</p>
                  <p className="text-[12px] font-bold leading-snug" style={{ color: m.color }}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t border-white/[0.05]">
            <p className="text-[11px] text-white/40 leading-relaxed max-w-3xl">{d.valuationNote}</p>
          </div>
        </div>

        {/* Sale readiness checklist */}
        <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}25` }}>
              <CheckCircle className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-white/70">Sale Readiness Checklist</p>
              <p className="text-[9.5px] text-white/20 font-mono">Items required before Sale Room can be activated</p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {d.readinessItems.map(item => {
              const Icon = statusIcon(item.status);
              const color = statusColor(item.status);
              return (
                <div key={item.label} className="flex items-start gap-3 px-4 py-3.5 rounded-xl border"
                  style={{ borderColor: `${color}22`, background: `${color}06` }}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
                  <div>
                    <p className="text-[11.5px] font-semibold mb-0.5" style={{ color }}>{item.label}</p>
                    <p className="text-[10px] text-white/35 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rep note */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <Shield className="w-4 h-4 shrink-0 mt-0.5 text-white/20" />
          <p className="text-[10.5px] text-white/30 leading-relaxed">
            <span className="font-semibold text-white/45">Rep note:</span> When this catalog is ready for sale, navigate to Settings and activate the Sale Room. You can then create a buyer NDA login to expose the data room to qualified parties.
          </p>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

// Slug map — route param to profile key
const SLUG_TO_CLIENT: Record<string, string> = {
  bassnectar: 'bassnectar',
  santigold: 'santigold',
  'virgin-catalog-artist': 'virgin-catalog-artist',
};

export default function COSValue() {
  const { clientId } = useParams<{ clientId: string }>();
  const resolvedSlug = clientId ? (SLUG_TO_CLIENT[clientId] ?? clientId) : 'bassnectar';

  // Non-Bassnectar clients get the Not For Sale valuation page
  if (resolvedSlug !== 'bassnectar') {
    return <NotForSaleValuation clientSlug={resolvedSlug} />;
  }

  const sr = BN_SALE_ROOM;
  const [methodExpanded, setMethodExpanded] = useState(false);
  const [activeBuyer, setActiveBuyer] = useState<string | null>(null);

  const rangePct = (sr.valuation_current - sr.valuation_low) / (sr.valuation_high - sr.valuation_low) * 100;
  const targetPct = (sr.valuation_target - sr.valuation_low) / (sr.valuation_high - sr.valuation_low) * 100;

  const narrativeItems = [
    { key: 'artist_significance',   label: 'Artist Significance',          icon: Star,       color: '#F59E0B' },
    { key: 'audience_durability',   label: 'Audience Durability',          icon: Users,      color: '#06B6D4' },
    { key: 'sync_potential',        label: 'Sync Potential',               icon: Zap,        color: '#10B981' },
    { key: 'long_tail_revenue',     label: 'Long-Tail Revenue',            icon: BarChart2,  color: '#A3E635' },
    { key: 'merch_touring_adjacency', label: 'Merch · Touring · Fan Club', icon: Mic2,       color: '#EC4899' },
    { key: 'rehab_upside',          label: 'Brand Rehab Upside',           icon: TrendingUp, color: '#F59E0B' },
    { key: 'improvement_underway',  label: 'Improvements Underway',        icon: Activity,   color: '#10B981' },
  ] as const;

  const methodRows = [
    { label: 'Trailing Revenue Basis',  value: sr.valuation_method.trailing_revenue_basis  },
    { label: 'Multiple Logic',          value: sr.valuation_method.multiple_logic          },
    { label: 'Growth Trend Factor',     value: sr.valuation_method.growth_trend_factor     },
    { label: 'Sync Momentum Factor',    value: sr.valuation_method.sync_momentum_factor    },
    { label: 'Audience Trend Factor',   value: sr.valuation_method.audience_trend_factor   },
    { label: 'Release Activity Factor', value: sr.valuation_method.release_activity_factor },
    { label: 'Cost Optimization Factor',value: sr.valuation_method.cost_optimization_factor},
  ];

  if (!sr.for_sale) {
    return (
      <div className="min-h-full bg-[#07080A]">
        <CatalogPageHeader
          icon={Lock}
          title="Catalog Value / Sale Room"
          subtitle="Valuation intelligence and sale readiness"
          accentColor="#6B7280"
          badge="NOT FOR SALE"
          logoUrl={BN_META.logo_url}
          logoAlt={BN_META.artist_name}
        />
        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: '#6B728018', border: '1px solid #6B728025' }}>
            <Lock className="w-6 h-6 text-white/20" />
          </div>
          <h2 className="text-[17px] font-bold text-white/50 mb-3">Not Currently For Sale</h2>
          <p className="text-[12.5px] text-white/30 leading-relaxed max-w-lg">{sr.not_for_sale_message}</p>
          <div className="mt-6 px-5 py-3 rounded-xl border border-white/[0.07] bg-white/[0.02] text-[11px] font-mono text-white/25">
            {sr.catalog_rep_email}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={TrendingUp}
        title="Catalog Value / Sale Room"
        subtitle="Investment memo · Valuation intelligence · Buyer deal flow"
        accentColor="#10B981"
        logoUrl={BN_META.logo_url}
        logoAlt={BN_META.artist_name}
        badge="FOR SALE"
      />

      <div className="p-5 space-y-8">

        {/* ─────────────────────────────────────────
            01. SALE STATUS HEADER
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="01" label="Sale Status" accent="#10B981" />

          <div className="relative bg-[#0B0D10] border border-[#10B981]/20 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #10B98140, #06B6D430, transparent)' }} />
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
              style={{ background: '#10B981' }} />

            <div className="p-5">
              <div className="flex items-start gap-5 flex-wrap mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[13px] font-mono font-bold px-3.5 py-1.5 rounded-full tracking-widest"
                      style={{ color: sr.status_color, background: `${sr.status_color}18`, border: `1.5px solid ${sr.status_color}35` }}>
                      {sr.status_label}
                    </span>
                    <span className="text-[10.5px] text-white/35 font-mono">Effective {sr.sale_effective_date}</span>
                  </div>
                  <h2 className="text-[20px] font-bold text-white/90 leading-tight">{BN_META.catalog_name}</h2>
                  <p className="text-[12px] text-white/40 mt-1">{BN_META.company_name}</p>
                </div>

                <div className="ml-auto flex items-center gap-2 flex-wrap">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
                    style={{ background: '#10B981', color: '#000' }}>
                    <FileText className="w-3.5 h-3.5" />
                    Request CIM
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium border border-white/[0.1] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">
                    <Lock className="w-3.5 h-3.5" />
                    Execute NDA
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-medium border border-white/[0.1] text-white/50 hover:text-white/80 hover:bg-white/[0.04] transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    Open Data Room
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <ReadinessChip {...sr.buyer_readiness} />
                <div className="flex flex-col gap-2">
                  <ReadinessChip
                    status={sr.diligence_readiness.status}
                    label={sr.diligence_readiness.label}
                    detail={sr.diligence_readiness.detail}
                    color={sr.diligence_readiness.color}
                  />
                  <div className="relative h-1.5 bg-white/[0.06] rounded-full overflow-hidden mx-4">
                    <div className="h-full rounded-full"
                      style={{ width: `${sr.diligence_readiness.pct}%`, background: 'linear-gradient(90deg, #F59E0B, #10B981)' }} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 pt-3 border-t border-white/[0.05] flex-wrap">
                <span className="flex items-center gap-1.5 text-[10.5px] text-white/30">
                  <Users className="w-3 h-3 text-white/20" />
                  <span className="text-white/50">{sr.catalog_rep}</span>
                </span>
                <span className="text-white/10">·</span>
                <span className="flex items-center gap-1.5 text-[10.5px] text-white/30">
                  <Scale className="w-3 h-3 text-white/20" />
                  {sr.attorney}
                </span>
                <span className="text-white/10">·</span>
                <span className="flex items-center gap-1.5 text-[10.5px] text-white/30">
                  <RefreshCw className="w-3 h-3 text-white/20" />
                  Basis: {sr.basis_date}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            02. REVENUE OVERVIEW 2020–2026
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="02" label="Revenue Performance 2020–2026" accent="#06B6D4" />

          <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-[12.5px] font-semibold text-white/70">Historical Revenue Overview</p>
                <p className="text-[10px] text-white/25 mt-0.5 leading-relaxed max-w-xl">
                  Historical revenue reflects a post-2020 normalization period, with durable recurring earnings and a notable stabilization rebound in 2023.
                </p>
              </div>
              <div className="flex items-center gap-4 text-[9.5px] font-mono text-white/20 shrink-0">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10B981]" />YoY Growth</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]/60" />YoY Decline</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['Year', 'Total Revenue', 'YoY Change', '% Change', ''].map((h, i) => (
                      <th key={i} className="px-5 py-3 text-left text-[8.5px] font-mono text-white/20 uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {BN_HISTORICAL_REVENUE.map((row) => {
                    const isPos = row.yoy_pct !== null && row.yoy_pct > 0;
                    const isNeg = row.yoy_pct !== null && row.yoy_pct < 0;
                    const barWidth = (row.total / 898521) * 100;
                    return (
                      <tr key={row.year} className="group hover:bg-white/[0.015] transition-all">
                        <td className="px-5 py-4">
                          <span className="text-[13px] font-bold text-white/80 font-mono">{row.year}</span>
                          {row.is_base && (
                            <span className="ml-2 text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/25 tracking-wider">BASE</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[13.5px] font-semibold text-white/75 tabular-nums">{fmt(row.total)}</span>
                        </td>
                        <td className="px-5 py-4">
                          {row.yoy !== null ? (
                            <span className="text-[12px] font-mono tabular-nums"
                              style={{ color: isPos ? '#10B981' : '#EF444488' }}>
                              {isPos ? '+' : ''}{fmt(row.yoy)}
                            </span>
                          ) : (
                            <span className="text-[11px] text-white/15 font-mono">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          {row.yoy_pct !== null ? (
                            <div className="flex items-center gap-2.5">
                              <span className="text-[12px] font-mono font-semibold tabular-nums shrink-0"
                                style={{ color: isPos ? '#10B981' : '#EF4444' }}>
                                {isPos ? '+' : ''}{row.yoy_pct}%
                              </span>
                              {isPos
                                ? <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                                : <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]/70" />
                              }
                            </div>
                          ) : (
                            <span className="text-[10px] text-white/15 font-mono">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4 w-[140px]">
                          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{
                                width: `${barWidth}%`,
                                background: isNeg
                                  ? 'linear-gradient(90deg, #EF444440, #EF444470)'
                                  : 'linear-gradient(90deg, #10B98140, #10B981)',
                              }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t border-white/[0.05] bg-white/[0.01]">
              <p className="text-[9.5px] text-white/20 leading-relaxed max-w-2xl">
                2023 demonstrated durable catalog resilience — revenue recovered +7.8% relative to the 2022 trough, establishing a meaningful stabilization baseline. The catalog continues to generate recurring income across streaming, publishing, and long-tail monetization channels with no material rights encumbrances.
              </p>
            </div>
          </div>

          <div className="mt-4 bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-[12px] font-semibold text-white/65">2026 Quarterly Revenue</p>
                <p className="text-[9.5px] text-white/20 mt-0.5">Actuals to be updated quarterly · Structure established for ongoing diligence</p>
              </div>
              <span className="text-[8px] font-mono px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 tracking-wider">
                IN YEAR
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.05]">
              {BN_REVENUE_2026_QUARTERS.map((q) => (
                <div key={q.quarter} className="p-5 flex flex-col gap-2">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{q.quarter}</p>
                  <p className="text-[16px] font-bold text-white/20">—</p>
                  <span className="inline-flex items-center gap-1 text-[8px] font-mono px-2 py-0.5 rounded w-fit"
                    style={{ background: '#F59E0B10', color: '#F59E0B80', border: '1px solid #F59E0B18' }}>
                    {q.note}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.01]">
              <p className="text-[9px] text-white/15 font-mono">
                Q1 2026 actuals available upon NDA execution. Q2–Q4 projections provided in full CIM.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            03. VALUATION HERO
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="03" label="Valuation" accent="#10B981" />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 mb-4">

            <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full opacity-[0.05] blur-3xl pointer-events-none"
                style={{ background: '#10B981' }} />

              <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-4">Valuation Range — {sr.basis_date}</p>

              <div className="flex items-end gap-6 flex-wrap mb-6">
                <div>
                  <p className="text-[10px] font-mono text-white/20 mb-1">Low</p>
                  <p className="text-[26px] font-bold text-white/35">{fmtK(sr.valuation_low)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-center mb-2">
                    <p className="text-[10px] font-mono text-[#10B981]/60 mb-0.5">Current</p>
                    <p className="text-[38px] font-black text-[#10B981] leading-none">{fmtK(sr.valuation_current)}</p>
                    <p className="text-[10.5px] text-white/30 mt-1">{sr.multiple}× NMV · {sr.nmv_basis}</p>
                  </div>
                  <div className="relative h-2 bg-white/[0.06] rounded-full mx-2">
                    <div className="absolute h-2 rounded-full"
                      style={{
                        left: 0,
                        width: `${rangePct}%`,
                        background: 'linear-gradient(90deg, #10B98155, #10B981)',
                      }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#10B981] bg-[#0B0D10]"
                      style={{ left: `calc(${rangePct}% - 8px)` }} />
                    <div className="absolute -top-6 text-[8px] font-mono text-[#06B6D4]"
                      style={{ left: `calc(${targetPct}% - 12px)` }}>TARGET</div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-2 h-5 rounded-sm opacity-60"
                      style={{ left: `calc(${targetPct}% - 4px)`, background: '#06B6D4' }} />
                  </div>
                  <div className="flex justify-between mt-1.5 px-2">
                    <span className="text-[8.5px] text-white/15 font-mono">{fmtK(sr.valuation_low)}</span>
                    <span className="text-[8.5px] text-[#06B6D4]/50 font-mono">Target: {fmtK(sr.valuation_target)}</span>
                    <span className="text-[8.5px] text-white/15 font-mono">{fmtK(sr.valuation_high)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/20 mb-1">High</p>
                  <p className="text-[26px] font-bold text-white/35">{fmtK(sr.valuation_high)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Monthly Revenue',     value: fmt(sr.monthly_revenue),    color: '#10B981' },
                  { label: 'Annualized Revenue',  value: fmt(sr.annualized_revenue), color: '#06B6D4' },
                  { label: 'Revenue Multiple',    value: `${sr.multiple}×`,          color: '#F59E0B' },
                  { label: 'Target Valuation',    value: fmtK(sr.valuation_target),  color: '#06B6D4' },
                ].map(m => (
                  <div key={m.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.05]">
                    <p className="text-[8.5px] font-mono text-white/20 mb-1 uppercase tracking-wider">{m.label}</p>
                    <p className="text-[17px] font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="bg-[#0B0D10] border border-[#10B981]/20 rounded-2xl p-5 relative overflow-hidden flex-1">
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #10B98130, transparent)' }} />
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">GMG Uplift Applied</p>
                <p className="text-[32px] font-black text-[#10B981] leading-none">{fmtK(sr.gmg_uplift)}</p>
                <p className="text-[10px] text-[#10B981]/55 mt-1.5">{sr.gmg_uplift_label}</p>
                <div className="mt-3 pt-3 border-t border-white/[0.05]">
                  <p className="text-[9.5px] text-white/25 leading-relaxed">Value added since GMG engagement began Jan 2025. Attributed to catalog activation, streaming campaigns, and sync pipeline development.</p>
                </div>
              </div>
              <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl p-4">
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Growth Modifier</p>
                <p className="text-[13px] font-semibold text-[#F59E0B] leading-snug">{sr.growth_modifier}</p>
                <p className="text-[9.5px] text-white/20 mt-2 leading-relaxed">Applied to base multiple as premium for above-market revenue growth trajectory</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            03. VALUATION METHOD / CALCULATIONS
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="04" label="Valuation Method + Calculations" accent="#06B6D4" />

          <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-all"
              onClick={() => setMethodExpanded(v => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#06B6D418', border: '1px solid #06B6D425' }}>
                  <BarChart2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                </div>
                <div className="text-left">
                  <p className="text-[12.5px] font-semibold text-white/75">Valuation Methodology</p>
                  <p className="text-[10px] text-white/25 font-mono">NMV-based · 7 weighted factors · GMG proprietary model</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#06B6D4]/10 text-[#06B6D4]">
                  {methodExpanded ? 'Collapse' : 'Expand'}
                </span>
                {methodExpanded
                  ? <ChevronUp className="w-4 h-4 text-white/25" />
                  : <ChevronDown className="w-4 h-4 text-white/25" />
                }
              </div>
            </button>

            {methodExpanded && (
              <div className="divide-y divide-white/[0.04]">
                {methodRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-[200px_1fr] gap-4 px-5 py-4 hover:bg-white/[0.015] transition-all">
                    <p className="text-[10.5px] font-mono text-white/30 uppercase tracking-wider leading-relaxed">{row.label}</p>
                    <p className="text-[11.5px] text-white/60 leading-relaxed">{row.value}</p>
                  </div>
                ))}
              </div>
            )}

            {!methodExpanded && (
              <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Base Multiple', value: '26×', sub: 'EDM catalog avg' },
                  { label: 'Applied Multiple', value: `${sr.multiple}×`, sub: 'With all premiums', color: '#10B981' },
                  { label: 'NMV Basis', value: '$288K', sub: '12-mo trailing avg' },
                  { label: 'Final Valuation', value: fmtK(sr.valuation_current), sub: 'Current', color: '#10B981' },
                ].map(m => (
                  <div key={m.label} className="bg-white/[0.03] rounded-lg p-3">
                    <p className="text-[8.5px] font-mono text-white/20 mb-1">{m.label}</p>
                    <p className="text-[16px] font-bold" style={{ color: m.color ?? '#fff' }}>{m.value}</p>
                    <p className="text-[8.5px] text-white/20">{m.sub}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            04. WHY THIS CATALOG HAS VALUE
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="05" label="Why This Catalog Has Value" accent="#F59E0B" />

          <div className="relative bg-[#0B0D10] border border-[#F59E0B]/12 rounded-2xl overflow-hidden mb-4">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #F59E0B25, transparent)' }} />
            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: '#F59E0B18', border: '1px solid #F59E0B25' }}>
                <FileText className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-[12.5px] font-semibold text-white/75">Investment Narrative — Bassnectar / Amorphous Music</p>
                <p className="text-[9.5px] text-white/20 font-mono">Institutional-quality assessment · Internal use / buyer disclosure</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
              {narrativeItems.map(item => {
                const Icon = item.icon;
                const text = sr.investment_narrative[item.key];
                return (
                  <div key={item.key} className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]
                    hover:bg-white/[0.035] hover:border-white/[0.09] transition-all">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}14`, border: `1px solid ${item.color}22` }}>
                      <Icon className="w-[17px] h-[17px]" style={{ color: item.color }} />
                    </div>
                    <div>
                      <p className="text-[11.5px] font-semibold text-white/75 mb-1.5">{item.label}</p>
                      <p className="text-[11px] text-white/40 leading-relaxed">{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            05. LIVE VALUE DRIVERS
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="06" label="Live Value Drivers" accent="#10B981" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {sr.live_value_drivers.map(driver => {
              const Icon = DRIVER_ICON_MAP[driver.label] ?? Activity;
              const statusMeta = DRIVER_STATUS[driver.status] ?? DRIVER_STATUS.active;
              return (
                <div key={driver.label}
                  className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 relative overflow-hidden hover:border-white/[0.11] transition-all group">
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${driver.color}28, transparent)` }} />
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${driver.color}14`, border: `1px solid ${driver.color}22` }}>
                      <Icon className="w-[17px] h-[17px]" style={{ color: driver.color }} />
                    </div>
                    <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded font-semibold tracking-wider"
                      style={{ color: statusMeta.color, background: `${statusMeta.color}14` }}>
                      {statusMeta.label}
                    </span>
                  </div>
                  <p className="text-[9.5px] font-mono text-white/25 mb-1 uppercase tracking-wider">{driver.label}</p>
                  <p className="text-[13px] font-bold text-white/85 leading-snug mb-1">{driver.value}</p>
                  <p className="text-[10px] font-mono leading-snug mb-2.5" style={{ color: driver.color }}>{driver.delta}</p>
                  <p className="text-[9.5px] text-white/30 leading-relaxed border-t border-white/[0.05] pt-2.5">{driver.detail}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─────────────────────────────────────────
            06. DILIGENCE SNAPSHOT
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="07" label="Diligence Snapshot" accent="#06B6D4" />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
            <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-[#06B6D4]" />
                  <p className="text-[12px] font-semibold text-white/65">Catalog + Rights Summary</p>
                </div>
                <div className="flex items-center gap-2">
                  {sr.diligence_snapshot.data_room_ready && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">DATA ROOM READY</span>
                  )}
                  {sr.diligence_snapshot.nda_required && (
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">NDA REQUIRED</span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Releases',       value: `${sr.diligence_snapshot.total_releases}`,    color: '#10B981' },
                    { label: 'Total Recordings',     value: `${sr.diligence_snapshot.total_recordings}`,  color: '#06B6D4' },
                    { label: 'Top Song Streams/Mo',  value: sr.diligence_snapshot.top_song.streams_monthly, color: '#F59E0B' },
                    { label: 'Top Album Rev/Mo',     value: sr.diligence_snapshot.top_album.monthly_revenue, color: '#A3E635' },
                  ].map(m => (
                    <div key={m.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                      <p className="text-[8px] font-mono text-white/20 mb-1 uppercase tracking-wider">{m.label}</p>
                      <p className="text-[17px] font-bold" style={{ color: m.color }}>{m.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-3.5 h-3.5 text-[#10B981]" />
                      <span className="text-[9.5px] font-mono text-white/25 uppercase tracking-wider">Top Song</span>
                    </div>
                    <p className="text-[13px] font-bold text-white/80">{sr.diligence_snapshot.top_song.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{sr.diligence_snapshot.top_song.year} · {sr.diligence_snapshot.top_song.streams_lifetime} lifetime streams</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span className="text-[9.5px] font-mono text-white/25 uppercase tracking-wider">Top Album</span>
                    </div>
                    <p className="text-[13px] font-bold text-white/80">{sr.diligence_snapshot.top_album.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{sr.diligence_snapshot.top_album.year} · {sr.diligence_snapshot.top_album.monthly_revenue}/mo</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { label: 'Master Rights',          value: sr.diligence_snapshot.rights_status,    icon: Lock,     color: '#10B981' },
                    { label: 'Publishing / Admin',     value: sr.diligence_snapshot.publishing_notes, icon: FileText, color: '#06B6D4' },
                    { label: 'Contracts Status',       value: sr.diligence_snapshot.contracts_status, icon: Shield,   color: '#A3E635' },
                  ].map(row => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: row.color }} />
                        <div>
                          <p className="text-[9.5px] font-mono text-white/25 mb-0.5 uppercase tracking-wider">{row.label}</p>
                          <p className="text-[11px] text-white/55 leading-relaxed">{row.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-[#0B0D10] border border-white/[0.07] rounded-2xl overflow-hidden flex flex-col">
              <div className="px-4 py-4 border-b border-white/[0.05] flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                <p className="text-[12px] font-semibold text-white/65">Known Issues</p>
                <span className="ml-auto text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B]">
                  {sr.diligence_snapshot.known_issues.length} OPEN
                </span>
              </div>
              <div className="flex-1 p-4 space-y-3">
                {sr.diligence_snapshot.known_issues.map((issue, i) => (
                  <div key={i} className="p-3.5 rounded-xl border"
                    style={{
                      borderColor: issue.severity === 'medium' ? '#F59E0B25' : '#6B728025',
                      background: issue.severity === 'medium' ? '#F59E0B06' : '#6B728006',
                    }}>
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: issue.severity === 'medium' ? '#F59E0B' : '#6B7280' }} />
                      <p className="text-[11px] text-white/65 leading-snug">{issue.issue}</p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-4">
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded capitalize"
                        style={{
                          color: issue.severity === 'medium' ? '#F59E0B' : '#6B7280',
                          background: issue.severity === 'medium' ? '#F59E0B10' : '#6B728010',
                        }}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className="text-[9.5px] text-white/30">{issue.status}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-auto pt-3 border-t border-white/[0.04]">
                  <p className="text-[9.5px] text-white/20 leading-relaxed">No material issues identified. All open items are operational in nature and are being resolved by GMG team.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────
            07. BUYER / DEAL FLOW
        ───────────────────────────────────────── */}
        <section>
          <SectionLabel index="08" label="Buyer / Deal Flow" accent="#EC4899" />

          <div className="relative bg-[#0B0D10] border border-[#EC4899]/12 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #EC489920, transparent)' }} />

            <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: '#EC489918', border: '1px solid #EC489925' }}>
                  <Eye className="w-3.5 h-3.5 text-[#EC4899]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/70">Active Buyer Pipeline</p>
                  <p className="text-[9.5px] text-white/20 font-mono">Internal use only · Confidential</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
                <span className="text-[9px] font-mono text-[#EC4899]/60">{sr.buyer_deal_flow.length} ACTIVE</span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {sr.buyer_deal_flow.map(buyer => {
                const im = INTEREST_META[buyer.interest_level] ?? INTEREST_META.low;
                const isOpen = activeBuyer === buyer.id;
                return (
                  <div key={buyer.id}
                    className="border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.1] transition-all">
                    <button
                      className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.02] transition-all text-left"
                      onClick={() => setActiveBuyer(isOpen ? null : buyer.id)}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${buyer.stage_color}14`, border: `1px solid ${buyer.stage_color}22` }}>
                        <DollarSign className="w-4 h-4" style={{ color: buyer.stage_color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 mb-0.5">
                          <p className="text-[12.5px] font-semibold text-white/80 truncate">{buyer.buyer}</p>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                            style={{ color: buyer.stage_color, background: `${buyer.stage_color}12`, border: `1px solid ${buyer.stage_color}20` }}>
                            {buyer.stage_label}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/30">{buyer.type} · Inquiry: {buyer.inquiry_date}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                          style={{ color: im.color, background: `${im.color}12` }}>{im.label}</span>
                        {isOpen
                          ? <ChevronUp className="w-3.5 h-3.5 text-white/20" />
                          : <ChevronDown className="w-3.5 h-3.5 text-white/20" />
                        }
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-white/[0.04] bg-white/[0.015]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          <div>
                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Latest Note</p>
                            <p className="text-[11px] text-white/50 leading-relaxed">{buyer.note}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Next Action</p>
                            <div className="flex items-start gap-2 p-3 rounded-lg"
                              style={{ background: `${buyer.stage_color}08`, border: `1px solid ${buyer.stage_color}18` }}>
                              <ArrowUpRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: buyer.stage_color }} />
                              <p className="text-[11px] text-white/65 leading-relaxed">{buyer.next_action}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-3 mt-2 border-t border-white/[0.04] text-[9.5px] font-mono text-white/20">
                          <span>Inquiry: {buyer.inquiry_date}</span>
                          <span>·</span>
                          <span>Last contact: {buyer.last_contact}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="border border-dashed border-white/[0.07] rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5 text-white/15" />
                  </div>
                  <p className="text-[11px] text-white/20 font-mono">Add buyer inquiry</p>
                </div>
                <button className="flex items-center gap-1.5 text-[10px] text-[#EC4899]/40 hover:text-[#EC4899] transition-colors font-mono">
                  <ChevronRight className="w-3 h-3" />
                  Add
                </button>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-white/[0.05] flex items-center gap-2 bg-[#EC4899]/[0.02]">
              <Lock className="w-3 h-3 text-[#EC4899]/40" />
              <p className="text-[9.5px] text-white/20">Buyer information is confidential. Access restricted to authorized GMG team members.</p>
            </div>
          </div>
        </section>

        <div className="h-6" />
      </div>
    </div>
  );
}
