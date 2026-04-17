import { useState, useMemo } from 'react';
import {
  Layers, TrendingUp, TrendingDown, Minus, Search, Filter, Star,
  Music, Disc, Radio, Zap, Eye, Tag, ChevronDown, ChevronUp,
  ArrowUpRight, Shield, ShoppingBag, Sparkles, RefreshCw,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import {
  BN_CATALOG_ASSETS, BN_CATALOG_SUMMARY,
  type CatalogAsset, type AssetType, type AssetStatus, type RevenueTier, type AssetOpportunity,
} from '../../data/bassnectarCatalogData';

const ACCENT = '#10B981';

type Opportunity = AssetOpportunity;

const OPP_META: Record<Opportunity, { label: string; color: string; icon: React.ElementType }> = {
  sync_candidate:  { label: 'Sync Candidate',   color: '#06B6D4', icon: Zap         },
  reactivation:    { label: 'Reactivation',      color: '#F59E0B', icon: RefreshCw   },
  playlist_focus:  { label: 'Playlist Focus',    color: '#10B981', icon: Radio       },
  merch_tie_in:    { label: 'Merch Tie-In',      color: '#EC4899', icon: ShoppingBag },
  anniversary:     { label: 'Anniversary',       color: '#A3E635', icon: Star        },
  social_content:  { label: 'Social Content',    color: '#8B5CF6', icon: Eye         },
};

const STATUS_META: Record<AssetStatus, { label: string; color: string }> = {
  active:   { label: 'Active',    color: '#10B981' },
  rising:   { label: 'Rising',    color: '#06B6D4' },
  dormant:  { label: 'Dormant',   color: '#F59E0B' },
  priority: { label: 'Priority',  color: '#EC4899' },
};

const TYPE_META: Record<AssetType, { label: string; color: string }> = {
  single:      { label: 'Single',      color: '#10B981' },
  album:       { label: 'Album',       color: '#06B6D4' },
  ep:          { label: 'EP',          color: '#F59E0B' },
  compilation: { label: 'Compilation', color: '#8B5CF6' },
  bootleg:     { label: 'Bootleg',     color: '#EC4899' },
};

const SYNC_META: Record<string, { label: string; color: string }> = {
  ready:       { label: 'Ready',       color: '#10B981' },
  potential:   { label: 'Potential',   color: '#F59E0B' },
  not_cleared: { label: 'Not Cleared', color: '#EF4444' },
  pending:     { label: 'In Review',   color: '#06B6D4' },
};

const CATALOG_ASSETS = BN_CATALOG_ASSETS;
const CATALOG_SUMMARY = BN_CATALOG_SUMMARY;


function fmtStreams(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function GrowthIndicator({ rate }: { rate: number }) {
  if (rate > 0) return (
    <span className="flex items-center gap-0.5 text-[#10B981] text-[10px] font-mono font-bold">
      <TrendingUp className="w-3 h-3" />+{rate}%
    </span>
  );
  if (rate < 0) return (
    <span className="flex items-center gap-0.5 text-[#EF4444] text-[10px] font-mono font-bold">
      <TrendingDown className="w-3 h-3" />{rate}%
    </span>
  );
  return (
    <span className="flex items-center gap-0.5 text-white/30 text-[10px] font-mono">
      <Minus className="w-3 h-3" />0%
    </span>
  );
}

function OppTag({ opp }: { opp: Opportunity }) {
  const meta = OPP_META[opp];
  const Icon = meta.icon;
  return (
    <span
      className="flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
      style={{ color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}20` }}
    >
      <Icon className="w-2.5 h-2.5" />
      {meta.label}
    </span>
  );
}

function AssetRow({ asset, idx }: { asset: CatalogAsset; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const sm = STATUS_META[asset.status];
  const tm = TYPE_META[asset.type];
  const sync = SYNC_META[asset.sync_readiness];

  return (
    <>
      <tr
        className="border-b border-white/[0.04] hover:bg-white/[0.018] transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="px-4 py-3.5 w-8">
          <span className="text-[9px] font-mono text-white/20">{String(idx + 1).padStart(2, '0')}</span>
        </td>
        <td className="px-3 py-3.5 min-w-[200px]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${tm.color}14`, border: `1px solid ${tm.color}20` }}>
              {asset.type === 'album' || asset.type === 'ep' || asset.type === 'compilation'
                ? <Disc className="w-3.5 h-3.5" style={{ color: tm.color }} />
                : <Music className="w-3.5 h-3.5" style={{ color: tm.color }} />
              }
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-white/85 leading-none mb-0.5">{asset.title}</p>
              <p className="text-[9.5px] font-mono text-white/25">{asset.year} · {asset.label}</p>
            </div>
          </div>
        </td>
        <td className="px-3 py-3.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: tm.color, background: `${tm.color}12`, border: `1px solid ${tm.color}22` }}>
            {tm.label}
          </span>
        </td>
        <td className="px-3 py-3.5 text-[11px] text-white/45 font-mono max-w-[140px] truncate">{asset.album}</td>
        <td className="px-3 py-3.5">
          <div className="text-[12.5px] font-bold text-white/70 font-mono">{fmtStreams(asset.total_streams)}</div>
          <div className="text-[9.5px] text-white/25 font-mono">{fmtStreams(asset.monthly_streams)}/mo</div>
        </td>
        <td className="px-3 py-3.5">
          <div className="text-[12.5px] font-bold" style={{ color: ACCENT }}>{fmtUSD(asset.monthly_revenue)}/mo</div>
          <div className="text-[9.5px] text-white/25 font-mono">{fmtUSD(asset.annual_revenue)}/yr</div>
        </td>
        <td className="px-3 py-3.5"><GrowthIndicator rate={asset.growth_rate} /></td>
        <td className="px-3 py-3.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: sm.color, background: `${sm.color}12`, border: `1px solid ${sm.color}22` }}>
            {sm.label}
          </span>
        </td>
        <td className="px-3 py-3.5">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: sync.color, background: `${sync.color}10`, border: `1px solid ${sync.color}20` }}>
            {sync.label}
          </span>
        </td>
        <td className="px-3 py-3.5">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {asset.opportunities.slice(0, 2).map(opp => (
              <OppTag key={opp} opp={opp} />
            ))}
            {asset.opportunities.length > 2 && (
              <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded bg-white/[0.04]">
                +{asset.opportunities.length - 2}
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-3.5 text-right">
          <button className="p-1 rounded hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-all">
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-white/[0.012] border-b border-white/[0.04]">
          <td colSpan={11} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Asset Detail</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Release Date</span>
                    <span className="text-white/60 font-mono">{asset.release_date}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Asset ID</span>
                    <span className="text-white/60 font-mono">{asset.id}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Label</span>
                    <span className="text-white/60">{asset.label}</span>
                  </div>
                  {asset.peak_streams && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/35">Peak Monthly</span>
                      <span className="text-white/60 font-mono">{fmtStreams(asset.peak_streams)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Revenue Breakdown</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Monthly Revenue</span>
                    <span style={{ color: ACCENT }} className="font-mono font-bold">{fmtUSD(asset.monthly_revenue)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Annual Revenue</span>
                    <span style={{ color: ACCENT }} className="font-mono font-bold">{fmtUSD(asset.annual_revenue)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Monthly Streams</span>
                    <span className="text-white/60 font-mono">{fmtStreams(asset.monthly_streams)}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Total Streams</span>
                    <span className="text-white/60 font-mono">{fmtStreams(asset.total_streams)}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Sync &amp; Rights</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Sync Readiness</span>
                    <span style={{ color: sync.color }} className="font-mono">{sync.label}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Merch Opportunity</span>
                    <span className={asset.merch_opportunity ? 'text-[#10B981] font-mono' : 'text-white/25 font-mono'}>
                      {asset.merch_opportunity ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-white/35">Revenue Tier</span>
                    <span className="text-white/60 font-mono capitalize">{asset.revenue_tier}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">All Opportunities</p>
                <div className="flex flex-wrap gap-1.5">
                  {asset.opportunities.map(opp => (
                    <OppTag key={opp} opp={opp} />
                  ))}
                  {asset.opportunities.length === 0 && (
                    <span className="text-[11px] text-white/20">None flagged</span>
                  )}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

type FilterStatus = AssetStatus | 'all';
type FilterType = AssetType | 'all';
type FilterRevTier = RevenueTier | 'all';

export default function COSAssets() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterRevTier, setFilterRevTier] = useState<FilterRevTier>('all');
  const [filterAlbum, setFilterAlbum] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterOpp, setFilterOpp] = useState<Opportunity | 'all'>('all');
  const [sortCol, setSortCol] = useState<'streams' | 'revenue' | 'growth' | 'title'>('revenue');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const albums = useMemo(() => {
    const s = new Set(CATALOG_ASSETS.map(a => a.album));
    return Array.from(s).sort();
  }, []);

  const years = useMemo(() => {
    const s = new Set(CATALOG_ASSETS.map(a => a.year));
    return Array.from(s).sort((a, b) => b - a);
  }, []);

  const filtered = useMemo(() => {
    let list = [...CATALOG_ASSETS];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.album.toLowerCase().includes(q));
    }
    if (filterType !== 'all') list = list.filter(a => a.type === filterType);
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus);
    if (filterRevTier !== 'all') list = list.filter(a => a.revenue_tier === filterRevTier);
    if (filterAlbum !== 'all') list = list.filter(a => a.album === filterAlbum);
    if (filterYear !== 'all') list = list.filter(a => a.year === Number(filterYear));
    if (filterOpp !== 'all') list = list.filter(a => a.opportunities.includes(filterOpp as Opportunity));
    list.sort((a, b) => {
      let av = 0, bv = 0;
      if (sortCol === 'streams') { av = a.monthly_streams; bv = b.monthly_streams; }
      else if (sortCol === 'revenue') { av = a.monthly_revenue; bv = b.monthly_revenue; }
      else if (sortCol === 'growth') { av = a.growth_rate; bv = b.growth_rate; }
      else { return sortDir === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title); }
      return sortDir === 'desc' ? bv - av : av - bv;
    });
    return list;
  }, [search, filterType, filterStatus, filterRevTier, filterAlbum, filterYear, filterOpp, sortCol, sortDir]);

  function toggleSort(col: typeof sortCol) {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortCol(col); setSortDir('desc'); }
  }

  const totalMonthlyRevenue = filtered.reduce((s, a) => s + a.monthly_revenue, 0);
  const totalMonthlyStreams = filtered.reduce((s, a) => s + a.monthly_streams, 0);

  const syncReady = CATALOG_ASSETS.filter(a => a.sync_readiness === 'ready').length;
  const syncPending = CATALOG_ASSETS.filter(a => a.sync_readiness === 'pending').length;
  const reactivationCount = CATALOG_ASSETS.filter(a => a.opportunities.includes('reactivation')).length;
  const risingCount = CATALOG_ASSETS.filter(a => a.status === 'rising').length;

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Layers}
        title="Catalog Scope + Asset Library"
        subtitle="Full asset depth, performance intelligence, and opportunity mapping"
        accentColor={ACCENT}
        badge={`${CATALOG_SUMMARY.total_assets} Assets`}
        actions={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#10B981]/25 bg-[#10B981]/[0.07] text-[10.5px] text-[#10B981] hover:bg-[#10B981]/[0.12] transition-all">
            <ArrowUpRight className="w-3 h-3" />
            Export
          </button>
        }
      />

      <div className="p-5 space-y-5">

        {/* ── HEADER METRICS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total Releases',       value: CATALOG_SUMMARY.total_releases.toString(), color: ACCENT,    sub: 'Full discography'       },
            { label: 'Total Assets',          value: CATALOG_SUMMARY.total_assets.toString(),   color: '#06B6D4', sub: 'Songs, EPs, LPs, bootlegs' },
            { label: 'All-Time Streams',      value: fmtStreams(CATALOG_SUMMARY.total_streams_all_time), color: '#8B5CF6', sub: 'Across all DSPs'    },
            { label: 'Monthly Activity',      value: CATALOG_SUMMARY.avg_monthly_activity,      color: '#F59E0B', sub: 'Avg monthly revenue'    },
            { label: 'Top Song',              value: CATALOG_SUMMARY.highest_song.title,         color: '#EC4899', sub: CATALOG_SUMMARY.highest_song.monthly },
            { label: 'Top Album',             value: CATALOG_SUMMARY.highest_album.title,        color: '#A3E635', sub: CATALOG_SUMMARY.highest_album.monthly },
          ].map(m => (
            <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2 leading-none">{m.label}</p>
              <p className="text-[18px] font-bold leading-none truncate" style={{ color: m.color }}>{m.value}</p>
              <p className="text-[9.5px] font-mono text-white/22 mt-1 leading-none truncate">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* ── OPPORTUNITY SUMMARY STRIP ── */}
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Catalog Opportunity Layer</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {(Object.keys(OPP_META) as Opportunity[]).map(opp => {
              const meta = OPP_META[opp];
              const count = CATALOG_ASSETS.filter(a => a.opportunities.includes(opp)).length;
              const Icon = meta.icon;
              return (
                <button
                  key={opp}
                  onClick={() => setFilterOpp(filterOpp === opp ? 'all' : opp)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left"
                  style={{
                    borderColor: filterOpp === opp ? `${meta.color}40` : 'rgba(255,255,255,0.06)',
                    background: filterOpp === opp ? `${meta.color}10` : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: `${meta.color}14`, border: `1px solid ${meta.color}22` }}>
                    <Icon className="w-3 h-3" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium leading-none" style={{ color: meta.color }}>{count} assets</p>
                    <p className="text-[8.5px] font-mono text-white/25 mt-0.5 leading-none">{meta.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── STATUS + SYNC HEALTH STRIP ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Sync Ready',       value: syncReady,        color: '#10B981', icon: Shield,    sub: 'Cleared for licensing'   },
            { label: 'Sync In Review',   value: syncPending,      color: '#06B6D4', icon: Zap,       sub: 'Active inquiry pipeline' },
            { label: 'Rising Assets',    value: risingCount,      color: '#F59E0B', icon: TrendingUp, sub: 'Month-over-month growth' },
            { label: 'Reactivation Queue', value: reactivationCount, color: '#EC4899', icon: RefreshCw, sub: 'Dormant with potential'  },
          ].map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${m.color}12`, border: `1px solid ${m.color}22` }}>
                  <Icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold leading-none" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[10px] font-semibold text-white/55 mt-0.5">{m.label}</p>
                  <p className="text-[9px] font-mono text-white/20 mt-0.5">{m.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SEARCH + FILTER BAR ── */}
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search assets by title or album..."
                className="w-full bg-[#07080A] border border-white/[0.07] rounded-lg pl-9 pr-3 py-2.5 text-[11.5px] text-white/70 placeholder:text-white/20 focus:outline-none focus:border-[#10B981]/40 transition-colors"
              />
            </div>
            <button
              onClick={() => setShowFilters(f => !f)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-[11px] font-mono"
              style={{
                borderColor: showFilters ? `${ACCENT}40` : 'rgba(255,255,255,0.07)',
                color: showFilters ? ACCENT : 'rgba(255,255,255,0.35)',
                background: showFilters ? `${ACCENT}08` : 'transparent',
              }}
            >
              <Filter className="w-3 h-3" />
              Filters
              {[filterType, filterStatus, filterRevTier, filterAlbum, filterYear].filter(f => f !== 'all').length > 0 && (
                <span className="w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold"
                  style={{ background: ACCENT, color: '#000' }}>
                  {[filterType, filterStatus, filterRevTier, filterAlbum, filterYear].filter(f => f !== 'all').length}
                </span>
              )}
            </button>
            <div className="flex items-center gap-1 ml-auto">
              {[
                { key: 'revenue',  label: 'Revenue' },
                { key: 'streams',  label: 'Streams' },
                { key: 'growth',   label: 'Growth'  },
                { key: 'title',    label: 'Title'   },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => toggleSort(s.key as typeof sortCol)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[10px] font-mono transition-all"
                  style={{
                    color: sortCol === s.key ? ACCENT : 'rgba(255,255,255,0.25)',
                    background: sortCol === s.key ? `${ACCENT}10` : 'transparent',
                    border: `1px solid ${sortCol === s.key ? `${ACCENT}28` : 'transparent'}`,
                  }}
                >
                  {s.label}
                  {sortCol === s.key && (
                    sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-white/[0.05]">
              {[
                {
                  label: 'Type', val: filterType, set: (v: string) => setFilterType(v as FilterType),
                  options: [['all', 'All Types'], ['single', 'Single'], ['album', 'Album'], ['ep', 'EP'], ['compilation', 'Compilation'], ['bootleg', 'Bootleg']],
                },
                {
                  label: 'Status', val: filterStatus, set: (v: string) => setFilterStatus(v as FilterStatus),
                  options: [['all', 'All Status'], ['active', 'Active'], ['rising', 'Rising'], ['dormant', 'Dormant'], ['priority', 'Priority']],
                },
                {
                  label: 'Revenue Tier', val: filterRevTier, set: (v: string) => setFilterRevTier(v as FilterRevTier),
                  options: [['all', 'All Tiers'], ['high', 'High'], ['mid', 'Mid'], ['low', 'Low'], ['none', 'None']],
                },
                {
                  label: 'Album / Project', val: filterAlbum, set: (v: string) => setFilterAlbum(v),
                  options: [['all', 'All Albums'], ...albums.map(a => [a, a])],
                },
                {
                  label: 'Year', val: filterYear, set: (v: string) => setFilterYear(v),
                  options: [['all', 'All Years'], ...years.map(y => [String(y), String(y)])],
                },
                {
                  label: 'Opportunity', val: filterOpp, set: (v: string) => setFilterOpp(v as Opportunity | 'all'),
                  options: [['all', 'All Opportunities'], ...Object.entries(OPP_META).map(([k, v]) => [k, v.label])],
                },
              ].map(f => (
                <div key={f.label}>
                  <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-widest mb-1.5">{f.label}</p>
                  <select
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    className="w-full bg-[#07080A] border border-white/[0.08] rounded-lg px-2.5 py-2 text-[10.5px] text-white/55 focus:outline-none focus:border-[#10B981]/35 transition-colors"
                  >
                    {f.options.map(([val, lbl]) => (
                      <option key={val} value={val}>{lbl}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ASSET TABLE ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-3 h-3 text-[#10B981]" />
              {filtered.length} assets · {fmtUSD(totalMonthlyRevenue)}/mo · {fmtStreams(totalMonthlyStreams)} monthly streams
            </p>
            {(search || filterType !== 'all' || filterStatus !== 'all' || filterRevTier !== 'all' || filterAlbum !== 'all' || filterYear !== 'all' || filterOpp !== 'all') && (
              <button
                onClick={() => {
                  setSearch(''); setFilterType('all'); setFilterStatus('all');
                  setFilterRevTier('all'); setFilterAlbum('all'); setFilterYear('all'); setFilterOpp('all');
                }}
                className="text-[9.5px] font-mono text-white/25 hover:text-[#EF4444] transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-3 text-left w-8" />
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Asset</th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Album / Project</th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider cursor-pointer hover:text-white/40" onClick={() => toggleSort('streams')}>
                    Streams {sortCol === 'streams' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider cursor-pointer hover:text-white/40" onClick={() => toggleSort('revenue')}>
                    Revenue {sortCol === 'revenue' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider cursor-pointer hover:text-white/40" onClick={() => toggleSort('growth')}>
                    Growth {sortCol === 'growth' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Sync</th>
                  <th className="px-3 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">Opportunities</th>
                  <th className="px-3 py-3 text-left w-8" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((asset, idx) => (
                  <AssetRow key={asset.id} asset={asset} idx={idx} />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center text-[12px] text-white/20 font-mono">
                      No assets match current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
