import { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, BarChart2, Zap,
  ShoppingBag, Mic2, Heart, Handshake, Globe, Music,
  Building2, AlertTriangle, CheckCircle2, Clock, RefreshCw,
  ArrowUpRight, ArrowDownRight, Info, Link, ChevronDown, ChevronUp,
  Plug, FileText, Calendar, Star,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import {
  BN_REVENUE_SUMMARY, BN_CASH_POSITION, BN_UPCOMING_OBLIGATIONS,
  BN_REVENUE_STREAMS as BN_STREAMS_DATA, BN_COST_BREAKDOWN, BN_ENTITY_FINANCIALS,
  BN_REVENUE_TREND_6MO, BN_WEEKLY_REVENUE,
} from '../../data/bassnectarCatalogData';

const ACCENT = '#06B6D4';

function fmtUSD(n: number, compact = false) {
  if (compact && n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (compact && n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(n);
}

// ─── Icon mapping for revenue streams (icons can't be stored in data file) ───

const STREAM_ICON_MAP: Record<string, React.ElementType> = {
  'Streaming':           Music,
  'ZFM / Direct Digital':Heart,
  'Sync Licensing':      Zap,
  'Merch / Consumer':    ShoppingBag,
  'Publishing':          FileText,
  'Touring':             Mic2,
  'Brand Partnerships':  Handshake,
  'Other':               Globe,
};

const REVENUE_STREAMS = BN_STREAMS_DATA.map(s => ({
  ...s,
  icon: STREAM_ICON_MAP[s.label] ?? Globe,
}));

const SUMMARY        = BN_REVENUE_SUMMARY;
const CASH_POSITION  = BN_CASH_POSITION;
const UPCOMING_OBLIGATIONS = BN_UPCOMING_OBLIGATIONS;
const COST_BREAKDOWN = BN_COST_BREAKDOWN;
const ENTITY_FINANCIALS    = BN_ENTITY_FINANCIALS;
const WEEKLY_UPDATE        = BN_WEEKLY_REVENUE;

// ─── Small components ─────────────────────────────────────────────────────────

function MetricTile({
  label, value, sub, color = '#10B981', dir = 'up',
}: { label: string; value: string; sub?: string; color?: string; dir?: string }) {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}28, transparent)` }} />
      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">{label}</p>
      <p className="text-[21px] font-bold leading-none" style={{ color }}>{value}</p>
      {sub && (
        <div className="flex items-center gap-1 mt-1.5">
          {dir === 'up'   && <ArrowUpRight   className="w-3 h-3 text-[#10B981]" />}
          {dir === 'down' && <ArrowDownRight  className="w-3 h-3 text-[#EF4444]" />}
          <span className="text-[9.5px] text-white/25 font-mono">{sub}</span>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ label, index, accent = ACCENT }: { label: string; index: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}55` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0"
        style={{ color: `${accent}80` }}>{label}</span>
      <div className="flex-1 h-[1px] bg-white/[0.04]" />
    </div>
  );
}

function EntityCard({ entity }: { entity: typeof ENTITY_FINANCIALS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const isProfit = entity.monthly_net >= 0;
  return (
    <div className="bg-[#0B0D10] border border-white/[0.05] rounded-xl overflow-hidden hover:border-white/[0.1] transition-all">
      <button
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${entity.color}14`, border: `1px solid ${entity.color}22` }}>
          <Building2 className="w-4 h-4" style={{ color: entity.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-white/80 truncate">{entity.name}</p>
          <p className="text-[9.5px] font-mono text-white/30">{entity.type}</p>
        </div>
        <div className="text-right shrink-0 mr-3">
          <p className="text-[13px] font-bold" style={{ color: isProfit ? '#10B981' : '#EF4444' }}>
            {isProfit ? '+' : ''}{fmtUSD(entity.monthly_net)}
          </p>
          <p className="text-[9px] font-mono text-white/25">net / mo</p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{
              color:      entity.trend === 'up' ? '#10B981' : entity.trend === 'down' ? '#EF4444' : '#6B7280',
              background: entity.trend === 'up' ? '#10B98115' : entity.trend === 'down' ? '#EF444415' : '#6B728015',
            }}>
            {entity.trend_pct}
          </span>
          {expanded
            ? <ChevronUp   className="w-3.5 h-3.5 text-white/20" />
            : <ChevronDown className="w-3.5 h-3.5 text-white/20" />
          }
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.04] pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8.5px] font-mono text-white/20 mb-0.5">REVENUE / MO</p>
              <p className="text-[13px] font-bold text-[#10B981]">{fmtUSD(entity.monthly_revenue)}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8.5px] font-mono text-white/20 mb-0.5">EXPENSES / MO</p>
              <p className="text-[13px] font-bold text-[#EF4444]">{fmtUSD(entity.monthly_expenses)}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8.5px] font-mono text-white/20 mb-0.5">YTD REVENUE</p>
              <p className="text-[13px] font-bold text-[#06B6D4]">{fmtUSD(entity.ytd_revenue, true)}</p>
            </div>
          </div>
          <p className="text-[10.5px] text-white/40 leading-relaxed">{entity.notes}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function COSRevenue() {
  const [activeTab, setActiveTab] = useState<'summary' | 'streams' | 'entities' | 'costs' | 'weekly'>('summary');

  const totalMonthlyExpenses = COST_BREAKDOWN.reduce((s, c) => s + c.amount, 0);
  const totalMonthlyRevenue  = REVENUE_STREAMS.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={DollarSign}
        title="Revenue + Financial Transparency"
        subtitle="Complete financial picture · All entities · All revenue sources · Weekly updates"
        accentColor={ACCENT}
        badge="Apr 2026"
      />

      <div className="p-5 space-y-6">

        {/* ── Always-visible KPI row ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricTile label="This Week — Net"   value="+$58,400"  sub="+26% vs prior week" color="#10B981" />
          <MetricTile label="Monthly Revenue"   value="$284,600"  sub="+22.4% YoY"         color="#06B6D4" />
          <MetricTile label="Monthly Expenses"  value="$46,600"   sub="16.4% of revenue"   color="#F59E0B" dir="neutral" />
          <MetricTile label="Monthly Net"       value="+$238,000" sub="83.6% margin"        color="#A3E635" />
        </div>

        {/* ── Tab navigation ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-1 p-0.5 bg-white/[0.03] rounded-lg border border-white/[0.06] w-fit flex-wrap">
          {([
            { key: 'summary',  label: 'Summary'         },
            { key: 'streams',  label: 'Revenue Streams' },
            { key: 'entities', label: 'Entities'        },
            { key: 'costs',    label: 'Cost Visibility' },
            { key: 'weekly',   label: 'Weekly Update'   },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                activeTab === tab.key ? 'bg-white/[0.08] text-white/85' : 'text-white/30 hover:text-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: SUMMARY
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <SectionLabel label="Period Summary" index="01" />

            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="grid grid-cols-4 border-b border-white/[0.05]">
                {['Period', 'Revenue', 'Expenses', 'Net Income'].map(h => (
                  <div key={h} className="px-5 py-3">
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{h}</p>
                  </div>
                ))}
              </div>
              {([
                { label: 'This Week',      data: SUMMARY.weekly    },
                { label: 'Month-to-Date',  data: SUMMARY.monthly   },
                { label: 'Quarter-to-Date',data: SUMMARY.quarterly },
                { label: 'Year-to-Date',   data: SUMMARY.annual    },
              ]).map((row, i) => (
                <div key={row.label}
                  className={`grid grid-cols-4 ${i < 3 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.01] transition-colors`}>
                  <div className="px-5 py-3.5">
                    <p className="text-[11.5px] font-semibold text-white/65">{row.label}</p>
                  </div>
                  <div className="px-5 py-3.5">
                    <p className="text-[12px] font-bold text-[#10B981]">{fmtUSD(row.data.revenue)}</p>
                  </div>
                  <div className="px-5 py-3.5">
                    <p className="text-[12px] font-bold text-[#EF4444]">{fmtUSD(row.data.expenses)}</p>
                  </div>
                  <div className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#10B981]" />
                      <p className="text-[12px] font-bold text-[#10B981]">{fmtUSD(row.data.net)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel label="Cash Position" index="02" accent="#06B6D4" />
            <div className="bg-[#0B0D10] border border-[#06B6D4]/15 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4 flex-wrap">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#06B6D414', border: '1px solid #06B6D422' }}>
                  <BarChart2 className="w-3.5 h-3.5 text-[#06B6D4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold text-white/80">Total Cash Across Entities</p>
                  <p className="text-[10px] text-white/25">{CASH_POSITION.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-[#06B6D4]">{fmtUSD(CASH_POSITION.total)}</p>
                  <p className="text-[9.5px] font-mono text-white/20">combined balance</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Amorphous Music Inc.', value: CASH_POSITION.amorphous_checking, color: '#10B981' },
                  { label: 'Vasona Blue LLC',       value: CASH_POSITION.vasona_blue,        color: '#06B6D4' },
                  { label: 'ZFM Music',             value: CASH_POSITION.zfm_music,          color: '#F59E0B' },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <p className="text-[9.5px] font-mono text-white/25 mb-1">{item.label}</p>
                    <p className="text-[16px] font-bold" style={{ color: item.color }}>{fmtUSD(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>

            <SectionLabel label="Upcoming Obligations" index="03" accent="#F59E0B" />
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
              {UPCOMING_OBLIGATIONS.map((obl, i) => (
                <div key={i}
                  className={`flex items-center gap-3 px-5 py-3.5 ${i < UPCOMING_OBLIGATIONS.length - 1 ? 'border-b border-white/[0.04]' : ''} hover:bg-white/[0.01] transition-colors`}>
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${obl.status === 'overdue' ? 'bg-[#EF4444] animate-pulse' : 'bg-[#F59E0B]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11.5px] text-white/70">{obl.label}</p>
                    <p className="text-[9.5px] font-mono text-white/25">{obl.entity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-bold text-white/70">{fmtUSD(obl.amount)}</p>
                    <div className="flex items-center gap-1 justify-end">
                      {obl.status === 'overdue'
                        ? <AlertTriangle className="w-2.5 h-2.5 text-[#EF4444]" />
                        : <Calendar       className="w-2.5 h-2.5 text-white/20"  />
                      }
                      <p className={`text-[9px] font-mono ${obl.status === 'overdue' ? 'text-[#EF4444]' : 'text-white/25'}`}>{obl.due}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.01]">
                <p className="text-[10px] font-mono text-white/25">Total Upcoming Obligations</p>
                <p className="text-[14px] font-bold text-white/60">
                  {fmtUSD(UPCOMING_OBLIGATIONS.reduce((s, o) => s + o.amount, 0))}
                </p>
              </div>
            </div>

            <SectionLabel label="Accounting Connectivity" index="04" accent="#8B5CF6" />
            <div className="bg-[#0B0D10] border border-[#8B5CF6]/15 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4 flex-wrap">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#8B5CF614', border: '1px solid #8B5CF622' }}>
                  <Plug className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div className="flex-1">
                  <p className="text-[12.5px] font-semibold text-white/80 mb-0.5">Automated Accounting Integration</p>
                  <p className="text-[10.5px] text-white/35 leading-relaxed">
                    Connect QuickBooks, Xero, or Wave to automatically sync transaction data, generate reports, and keep this page updated in real time.
                  </p>
                </div>
                <span className="shrink-0 text-[8.5px] font-mono px-2 py-0.5 rounded border border-[#8B5CF6]/25 text-[#8B5CF6]">COMING SOON</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: 'QuickBooks Online', sub: 'Available Q3 2026' },
                  { label: 'Xero',              sub: 'Available Q3 2026' },
                  { label: 'Wave Accounting',   sub: 'Available Q4 2026' },
                ].map(item => (
                  <div key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] opacity-60">
                    <div className="w-6 h-6 rounded bg-white/[0.08] shrink-0" />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold text-white/60">{item.label}</p>
                      <p className="text-[9px] font-mono text-white/25">{item.sub}</p>
                    </div>
                    <Link className="w-3 h-3 text-white/20" />
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/20 mt-3 leading-relaxed">
                Until integration is live, financial data is updated monthly by the GMG Finance team.
                All figures are reviewed by Sarah M. Bloom, Esq. and GMG Finance before publication.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: REVENUE STREAMS
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <SectionLabel label="Revenue Stream Breakdown" index="01" />

            <div className="flex items-center justify-between px-5 py-4 bg-[#0B0D10] border border-white/[0.06] rounded-xl">
              <div>
                <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-1">Total Monthly Revenue</p>
                <p className="text-[28px] font-bold text-[#10B981]">{fmtUSD(totalMonthlyRevenue)}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[#10B981]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[13px] font-bold">+22.4%</span>
                <span className="text-[10px] text-white/25 font-mono">YoY</span>
              </div>
            </div>

            <div className="space-y-3">
              {REVENUE_STREAMS.map(stream => {
                const Icon = stream.icon;
                const barW = totalMonthlyRevenue > 0 ? (stream.amount / totalMonthlyRevenue) * 100 : 0;
                return (
                  <div key={stream.label}
                    className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-all">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${stream.color}14`, border: `1px solid ${stream.color}22` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: stream.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[12px] font-semibold text-white/75">{stream.label}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-white/30">{stream.pct}%</span>
                            <span className="text-[14px] font-bold" style={{ color: stream.amount > 0 ? stream.color : '#4B5563' }}>
                              {stream.amount > 0 ? fmtUSD(stream.amount) : '—'}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/30">{stream.detail}</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${barW}%`, background: stream.color, opacity: stream.amount > 0 ? 1 : 0.15 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionLabel label="6-Month Revenue Trend" index="02" accent="#F59E0B" />
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11.5px] font-semibold text-white/60">Nov 2025 – Apr 2026</p>
                <span className="text-[9px] font-mono px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">+118% 6-mo growth</span>
              </div>
              <div className="flex items-end gap-2.5 h-36">
                {BN_REVENUE_TREND_6MO.map((s, idx) => {
                  const maxVal = Math.max(...BN_REVENUE_TREND_6MO.map(x => x.val));
                  const heightPct = (s.val / maxVal) * 100;
                  const isCurrent = idx === BN_REVENUE_TREND_6MO.length - 1;
                  return (
                    <div key={s.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-[8.5px] font-mono text-white/30">{fmtUSD(s.val, true)}</span>
                      <div className="w-full rounded-t-md"
                        style={{
                          height: `${heightPct}%`, minHeight: 6,
                          background: isCurrent
                            ? 'linear-gradient(180deg, #10B981, #06B6D4)'
                            : 'rgba(16,185,129,0.22)',
                        }} />
                      <span className="text-[9px] text-white/25">{s.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: ENTITIES
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'entities' && (
          <div className="space-y-6">
            <SectionLabel label="Business Entity Breakdown" index="01" />

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Monthly Revenue',  value: ENTITY_FINANCIALS.reduce((s, e) => s + e.monthly_revenue, 0),  color: '#10B981' },
                { label: 'Total Monthly Expenses', value: ENTITY_FINANCIALS.reduce((s, e) => s + e.monthly_expenses, 0), color: '#EF4444' },
                { label: 'Total Monthly Net',      value: ENTITY_FINANCIALS.reduce((s, e) => s + e.monthly_net, 0),       color: '#06B6D4' },
              ].map(item => (
                <div key={item.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">{item.label}</p>
                  <p className="text-[20px] font-bold" style={{ color: item.color }}>{fmtUSD(item.value)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {ENTITY_FINANCIALS.map(entity => (
                <EntityCard key={entity.id} entity={entity} />
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: COST VISIBILITY
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'costs' && (
          <div className="space-y-6">
            <SectionLabel label="Monthly Cost Breakdown" index="01" accent="#EF4444" />

            <div className="flex items-center justify-between px-5 py-4 bg-[#0B0D10] border border-[#EF4444]/15 rounded-xl">
              <div>
                <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-1">Total Monthly Operating Costs</p>
                <p className="text-[28px] font-bold text-[#EF4444]">{fmtUSD(totalMonthlyExpenses)}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/30">
                  <span className="text-[#10B981] font-bold">16.4%</span> of monthly revenue
                </p>
                <p className="text-[10px] font-mono text-white/20">healthy operating ratio</p>
              </div>
            </div>

            <div className="space-y-3">
              {COST_BREAKDOWN.map(cost => (
                <div key={cost.category}
                  className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[12px] font-semibold text-white/75">{cost.category}</p>
                      <p className="text-[10px] text-white/30">{cost.vendor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-bold" style={{ color: cost.color }}>{fmtUSD(cost.amount)}</p>
                      <p className="text-[9.5px] font-mono text-white/25">{cost.pct}% of total</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cost.pct}%`, background: cost.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <Info className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />
              <p className="text-[10.5px] text-white/35 leading-relaxed">
                Costs above represent consolidated operating expenses across all GMG-managed entities.
                Individual entity expenses are tracked separately and visible in the Entities tab.
                Campaign and marketing expenses are approved through the budget allocation process — see the Campaigns section for current spend authorizations.
              </p>
            </div>

            {/* Wallet / Budget clarity box */}
            <SectionLabel label="How Payouts vs. Campaign Spend Works" index="02" accent="#F59E0B" />
            <div className="bg-[#0B0D10] border border-[#F59E0B]/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#F59E0B14', border: '1px solid #F59E0B22' }}>
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="text-[12.5px] font-semibold text-white/80 mb-0.5">Payouts and Campaign Spending Are Separate</p>
                  <p className="text-[10.5px] text-white/35 leading-relaxed">
                    These are two completely different actions. Approving a campaign budget does{' '}
                    <strong className="text-white/60">not</strong> reduce your personal payout.
                    Campaign spend comes from a dedicated operating budget, not your revenue balance.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#10B981]/06 border border-[#10B981]/18">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                    <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-wide">Withdraw Funds</p>
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    This means <strong className="text-white/70">transfer money to yourself</strong> — your personal payout from revenue earned.
                    Clicking "Withdraw Funds" moves money from your artist account to your personal or business bank account.
                    It has nothing to do with campaign spend.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#F59E0B]/06 border border-[#F59E0B]/18">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart2 className="w-4 h-4 text-[#F59E0B]" />
                    <p className="text-[11px] font-bold text-[#F59E0B] uppercase tracking-wide">Allocate Budget / Fund Campaign</p>
                  </div>
                  <p className="text-[11px] text-white/55 leading-relaxed">
                    This means <strong className="text-white/70">approve spend for a specific campaign or initiative</strong>.
                    Campaign budgets come from a separate operating pool managed by GMG.
                    You are approving a marketing or operating expenditure, not moving personal funds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: WEEKLY UPDATE
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'weekly' && (
          <div className="space-y-5">
            {/* Header */}
            <div className="bg-[#0B0D10] border border-[#10B981]/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, #10B98125, transparent)' }} />
              <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                <div>
                  <p className="text-[13px] font-bold text-white/85">{WEEKLY_UPDATE.week_of}</p>
                  <p className="text-[10px] font-mono text-white/25 mt-0.5">{WEEKLY_UPDATE.generated}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-0.5">Revenue This Week</p>
                    <p className="text-[20px] font-bold text-[#10B981]">{fmtUSD(WEEKLY_UPDATE.revenue_this_week)}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                    <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-[11px] font-bold text-[#10B981]">{WEEKLY_UPDATE.net_change}</span>
                  </div>
                </div>
              </div>

              {WEEKLY_UPDATE.attention.length > 0 && (
                <div className="p-3.5 rounded-lg bg-[#EF4444]/06 border border-[#EF4444]/20">
                  <p className="text-[9px] font-mono text-[#EF4444]/70 uppercase tracking-widest mb-2">Needs Your Attention</p>
                  <div className="space-y-1.5">
                    {WEEKLY_UPDATE.attention.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-[#EF4444] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-white/65">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <SectionLabel label="Wins This Week" index="01" accent="#10B981" />
            <div className="space-y-2">
              {WEEKLY_UPDATE.wins.map((win, i) => (
                <div key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0D10] border border-[#10B981]/10 hover:border-[#10B981]/20 transition-all">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11.5px] text-white/70 leading-snug">{win.label}</p>
                    {win.impact && (
                      <p className="text-[10px] font-mono text-[#10B981]/70 mt-0.5">{win.impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel label="Issues + Watch Items" index="02" accent="#F59E0B" />
            <div className="space-y-2">
              {WEEKLY_UPDATE.issues.map((issue, i) => (
                <div key={i}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0D10] border border-[#F59E0B]/12 hover:border-[#F59E0B]/22 transition-all">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11.5px] text-white/70 leading-snug">{issue.label}</p>
                    {issue.impact && (
                      <p className="text-[10px] font-mono text-[#F59E0B]/70 mt-0.5">{issue.impact}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <SectionLabel label="Revenue Shifts" index="03" accent="#06B6D4" />
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5 space-y-3">
              {[
                { label: 'vs Prior Week',        value: WEEKLY_UPDATE.net_change,                        icon: TrendingUp,  color: '#10B981' },
                { label: 'Top Mover',            value: '"Butterfly" stream spike (+38% WoW)',            icon: Star,        color: '#F59E0B' },
                { label: 'Surprise Performer',   value: 'ZFM archival drop — 2.4× projection',           icon: ArrowUpRight,color: '#06B6D4' },
              ].map(row => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${row.color}14` }}>
                      <Icon className="w-3 h-3" style={{ color: row.color }} />
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <p className="text-[10.5px] text-white/30 font-mono uppercase tracking-wider">{row.label}</p>
                      <p className="text-[11.5px] font-semibold text-right" style={{ color: row.color }}>{row.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Friday report automation info */}
            <div className="bg-[#0B0D10] border border-[#8B5CF6]/15 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#8B5CF614', border: '1px solid #8B5CF622' }}>
                  <RefreshCw className="w-3.5 h-3.5 text-[#8B5CF6]" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/75">Automated Friday Report</p>
                  <p className="text-[10px] text-white/30">Generated every Friday 8AM PT by GMG AI Operator. Delivered to client + team.</p>
                </div>
                <span className="ml-auto text-[8.5px] font-mono px-2 py-0.5 rounded border border-[#10B981]/25 text-[#10B981]">ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-white/20">
                <Clock className="w-3 h-3" />
                <span>Next report: Friday, Apr 18, 2026 at 8:00 AM PT</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
