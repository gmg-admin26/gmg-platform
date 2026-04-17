import { useState } from 'react';
import {
  ShoppingBag, Package, TrendingUp, BarChart2, Image,
  Video, FileText, Layers, Star, AlertTriangle,
  CheckCircle, Clock, RefreshCw, Plus, ExternalLink,
  Zap, Tag, Repeat, Gift, Music, Camera, Play,
  Archive, Link2, ChevronDown, ChevronUp, ArrowUpRight,
  DollarSign, Percent, Hash, Eye, Download, Sparkles,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';

const ACCENT = '#F59E0B';

// ── DATA ──────────────────────────────────────────────────────────────────────

const MERCH_METRICS = {
  monthly_revenue: '$142K',
  monthly_revenue_delta: '+18% MoM',
  units_sold_month: 3_840,
  units_sold_delta: '+12% MoM',
  sell_through_rate: '74%',
  sell_through_delta: '+4pts',
  active_collections: 6,
  avg_order_value: '$68',
  top_category: 'Apparel',
  total_skus: 87,
  low_stock_skus: 14,
  reorder_needed: 8,
};

const BEST_SELLERS = [
  { rank: 1, name: 'All One Pullover Hoodie',         collection: 'Core',           units: 620, revenue: '$43.4K', sell_through: '89%', status: 'active',   trend: 'up'   },
  { rank: 2, name: 'Bassnectar Logo Tee (Black)',     collection: 'Core',           units: 510, revenue: '$20.4K', sell_through: '82%', status: 'active',   trend: 'up'   },
  { rank: 3, name: 'Wook King Beanie',                collection: 'Accessories',    units: 390, revenue: '$15.6K', sell_through: '95%', status: 'low',      trend: 'up'   },
  { rank: 4, name: 'NYE 2019 Long-Sleeve Tee',        collection: 'Archive / Tour', units: 280, revenue: '$16.8K', sell_through: '100%', status: 'sold_out', trend: 'up'   },
  { rank: 5, name: 'Into The Sun Tee',                collection: 'Catalog Merch',  units: 265, revenue: '$11.9K', sell_through: '71%', status: 'active',   trend: 'flat' },
  { rank: 6, name: 'Limited Art Print — Amorphous',  collection: 'Art / Prints',   units: 180, revenue: '$18.0K', sell_through: '60%', status: 'active',   trend: 'up'   },
  { rank: 7, name: 'Bassnectar Tote Bag',             collection: 'Accessories',    units: 155, revenue: '$4.7K',  sell_through: '77%', status: 'active',   trend: 'flat' },
  { rank: 8, name: 'Reflective Logo Cap',             collection: 'Core',           units: 140, revenue: '$7.0K',  sell_through: '58%', status: 'active',   trend: 'down' },
];

const MONTHLY_REVENUE = [
  { month: 'Sep',  rev: 88  },
  { month: 'Oct',  rev: 96  },
  { month: 'Nov',  rev: 118 },
  { month: 'Dec',  rev: 204 },
  { month: 'Jan',  rev: 110 },
  { month: 'Feb',  rev: 120 },
  { month: 'Mar',  rev: 142 },
];

const INVENTORY_DB: Array<{
  id: string; type: 'merch' | 'visual' | 'production' | 'content' | 'tour';
  name: string; category: string; sku?: string;
  qty?: number; status: string; format?: string; notes: string;
}> = [
  { id: 'INV-001', type: 'merch',      name: 'All One Pullover Hoodie — Black (S)',       category: 'Apparel',        sku: 'AO-HOOD-BLK-S',  qty: 42,   status: 'active',   notes: 'Core collection. Reorder at 30 units.'          },
  { id: 'INV-002', type: 'merch',      name: 'All One Pullover Hoodie — Black (M)',       category: 'Apparel',        sku: 'AO-HOOD-BLK-M',  qty: 18,   status: 'low',      notes: 'Below reorder threshold. Action needed.'        },
  { id: 'INV-003', type: 'merch',      name: 'All One Pullover Hoodie — Black (L)',       category: 'Apparel',        sku: 'AO-HOOD-BLK-L',  qty: 55,   status: 'active',   notes: ''                                                },
  { id: 'INV-004', type: 'merch',      name: 'Bassnectar Logo Tee — Black (M)',          category: 'Apparel',        sku: 'BN-TEE-BLK-M',   qty: 0,    status: 'sold_out', notes: 'Sold out. Consider Q3 restock.'                  },
  { id: 'INV-005', type: 'merch',      name: 'Wook King Beanie',                         category: 'Accessories',    sku: 'WK-BEAN-001',    qty: 12,   status: 'low',      notes: 'Near sellout. Reorder in production.'            },
  { id: 'INV-006', type: 'merch',      name: 'Reflective Logo Cap',                      category: 'Accessories',    sku: 'REFL-CAP-001',   qty: 88,   status: 'active',   notes: ''                                                },
  { id: 'INV-007', type: 'merch',      name: 'Bassnectar Tote Bag',                      category: 'Accessories',    sku: 'BN-TOTE-001',    qty: 210,  status: 'active',   notes: ''                                                },
  { id: 'INV-008', type: 'merch',      name: 'Art Print — Amorphous (18x24)',            category: 'Art / Prints',   sku: 'AP-AMOR-001',    qty: 34,   status: 'active',   notes: 'Limited edition. No restock planned.'            },
  { id: 'INV-009', type: 'merch',      name: 'Into The Sun Tee — White',                category: 'Catalog Merch',  sku: 'ITS-TEE-WHT',    qty: 110,  status: 'active',   notes: 'Catalog tie-in. Pairs with album re-release.'    },
  { id: 'INV-010', type: 'merch',      name: 'NYE 2019 Long-Sleeve — Archive',          category: 'Archive / Tour', sku: 'NYE19-LS-001',   qty: 0,    status: 'sold_out', notes: 'Sold out. High demand. Reissue candidate.'       },
  { id: 'INV-011', type: 'visual',     name: 'Album Art — Noise vs. Beauty (Hi-Res)',   category: 'Artwork',        format: 'TIFF / PNG',  qty: undefined, status: 'active', notes: '3000x3000px. Cleared for all uses.'           },
  { id: 'INV-012', type: 'visual',     name: 'Album Art — Divergent Spectrum',          category: 'Artwork',        format: 'TIFF / PNG',  qty: undefined, status: 'active', notes: 'Multiple color variants on file.'               },
  { id: 'INV-013', type: 'visual',     name: 'Promo Pack — 2024 Campaign (v3)',         category: 'Promo Assets',   format: 'PSD / PNG',   qty: undefined, status: 'active', notes: '24 social formats. Cleared for campaign use.'   },
  { id: 'INV-014', type: 'visual',     name: 'Promo Video — Into The Sun (30s cut)',    category: 'Videos',         format: 'MP4 / ProRes', qty: undefined, status: 'active', notes: 'Cut for IG Reels + TikTok. Caption version avail.' },
  { id: 'INV-015', type: 'visual',     name: 'Show Visuals — NYE 2019 Full Set',        category: 'Show Visuals',   format: 'HAP / ProRes', qty: undefined, status: 'archived', notes: '4 hours. Stage mapping files included.'      },
  { id: 'INV-016', type: 'visual',     name: 'Content Snippet — Studio Session (3min)', category: 'Content',        format: 'MP4',         qty: undefined, status: 'active', notes: 'Ready for editorial use. No clearance issues.'  },
  { id: 'INV-017', type: 'production', name: 'Stage Plot — NYE 2019',                  category: 'Stage Design',   format: 'PDF / DWG',   qty: undefined, status: 'archived', notes: 'Reference only. Superseded by 2027 plans.'   },
  { id: 'INV-018', type: 'production', name: 'Sound Design Stems — NvB Album',         category: 'Audio',          format: 'WAV / AIF',   qty: undefined, status: 'active', notes: 'Archived at 96kHz / 24bit. Clearance required.'   },
  { id: 'INV-019', type: 'production', name: 'LED Panel Mapping Files — 2019',         category: 'AV Production',  format: 'RAW / JSON',  qty: undefined, status: 'archived', notes: 'For reference use with 2027 production team.'  },
  { id: 'INV-020', type: 'content',    name: 'Documentary B-Roll — 2019 Tour',         category: 'Video',          format: 'ProRes',      qty: undefined, status: 'active', notes: '40+ hours. Available for microseries use.'        },
  { id: 'INV-021', type: 'content',    name: 'Fan Testimonial Archive — 500+ clips',   category: 'UGC',            format: 'MP4 / MOV',   qty: undefined, status: 'active', notes: 'Cleared UGC. Available for compilation projects.'  },
  { id: 'INV-022', type: 'content',    name: 'Press Photos — Photog Series (2018–19)', category: 'Photography',    format: 'RAW / JPEG',  qty: undefined, status: 'active', notes: '3,200 images. Editorial use. License on file.'     },
  { id: 'INV-023', type: 'tour',       name: 'Tour Advance Pack v1.0',                 category: 'Tour Docs',      format: 'PDF',         qty: undefined, status: 'active', notes: 'Internal. Promoter distribution at contract sign.'  },
  { id: 'INV-024', type: 'tour',       name: 'Merch Bundle — NYE 2027 VIP Pack',       category: 'Tour Merch',     format: 'Concept',     qty: undefined, status: 'draft',  notes: 'In development. Tied to 2027 routing plan.'        },
  { id: 'INV-025', type: 'tour',       name: 'Tour Tee Design Concepts (4 variants)',  category: 'Tour Merch',     format: 'AI / PNG',    qty: undefined, status: 'draft',  notes: 'Review by merch team Q3 2026.'                     },
];

const VISUAL_ASSETS = [
  { id: 'VA-001', type: 'artwork',    name: 'Noise vs. Beauty — Full Art Suite',    format: 'TIFF / PNG',   status: 'active',   clearance: 'cleared',  tags: ['album', 'merch', 'promo'],    updated: 'Feb 2026' },
  { id: 'VA-002', type: 'artwork',    name: 'Divergent Spectrum — Art Suite',       format: 'TIFF / PNG',   status: 'active',   clearance: 'cleared',  tags: ['album', 'merch'],             updated: 'Jan 2025' },
  { id: 'VA-003', type: 'promo',      name: '2024 Campaign Pack (24 formats)',       format: 'PSD / PNG',    status: 'active',   clearance: 'cleared',  tags: ['social', 'campaign', 'ads'],  updated: 'Nov 2024' },
  { id: 'VA-004', type: 'promo',      name: 'Glastonbury 2019 Promo Set',           format: 'PNG / JPEG',   status: 'archived', clearance: 'cleared',  tags: ['festival', 'promo'],          updated: 'Jun 2019' },
  { id: 'VA-005', type: 'video',      name: 'Into The Sun — 30s / 60s / 90s cuts', format: 'MP4 / ProRes', status: 'active',   clearance: 'cleared',  tags: ['social', 'ads', 'editorial'], updated: 'Mar 2026' },
  { id: 'VA-006', type: 'video',      name: 'NYE 2019 Highlight Reel (4min)',       format: 'MP4',          status: 'active',   clearance: 'review',   tags: ['tour', 'highlight'],          updated: 'Jan 2020' },
  { id: 'VA-007', type: 'content',    name: 'Studio Session — 3min Edit',           format: 'MP4',          status: 'active',   clearance: 'cleared',  tags: ['editorial', 'organic'],       updated: 'Apr 2026' },
  { id: 'VA-008', type: 'content',    name: 'Fan Archive UGC — 500+ clips',         format: 'MP4 / MOV',    status: 'active',   clearance: 'cleared',  tags: ['ugc', 'fan', 'compilation'],  updated: 'Ongoing'  },
  { id: 'VA-009', type: 'show',       name: 'NYE 2019 Show Visuals (Full Set)',     format: 'HAP / ProRes', status: 'archived', clearance: 'cleared',  tags: ['show', 'production'],         updated: 'Jan 2020' },
  { id: 'VA-010', type: 'show',       name: 'NYE 2018 Projection Mapping Pack',    format: 'HAP',          status: 'archived', clearance: 'cleared',  tags: ['show', 'production'],         updated: 'Jan 2019' },
  { id: 'VA-011', type: 'production', name: 'Sound Design Stems — NvB',            format: 'WAV / AIF',    status: 'active',   clearance: 'restricted', tags: ['stems', 'audio', 'stems'],  updated: 'Sep 2017' },
  { id: 'VA-012', type: 'production', name: 'Documentary B-Roll — 2019 Tour',      format: 'ProRes',       status: 'active',   clearance: 'cleared',  tags: ['video', 'documentary'],       updated: 'Nov 2019' },
];

const PLATFORMS = [
  { id: 'shopify',  name: 'Shopify',         status: 'disconnected', logo: '🛒', note: 'Connect to sync inventory + order data in real time.', badge: 'Placeholder'  },
  { id: 'fourwall', name: '4Wall Merch',      status: 'disconnected', logo: '📦', note: 'Merch fulfillment + storefront platform integration.',  badge: 'Placeholder'  },
  { id: 'night',    name: 'Night / Official', status: 'disconnected', logo: '🌙', note: 'Artist storefront + exclusive drop platform.',          badge: 'Placeholder'  },
  { id: 'bandcamp', name: 'Bandcamp',         status: 'disconnected', logo: '🎵', note: 'Direct-to-fan music + merch sales channel.',            badge: 'Placeholder'  },
];

const OPPORTUNITY_RECS = [
  {
    id: 'OPP-001', type: 'relaunch',   priority: 'high',
    title: 'NYE 2019 Long-Sleeve Reissue',
    body: 'Sold out 100% on initial run. Strong demand signals from fan community. Reissue as limited anniversary drop at premium price point.',
    tags: ['Archive', 'Limited', 'High Demand'],
    action: 'Launch restock',
    revenue_est: '$28K–$45K',
  },
  {
    id: 'OPP-002', type: 'relaunch',   priority: 'high',
    title: 'Wook King Beanie Restock',
    body: 'Near sellout with high sell-through velocity. One of the fastest-moving accessories. Reorder immediately to capture demand.',
    tags: ['Accessories', 'Reorder', 'Urgent'],
    action: 'Place reorder',
    revenue_est: '$12K–$18K',
  },
  {
    id: 'OPP-003', type: 'bundle',     priority: 'high',
    title: 'Core Fan Bundle — Hoodie + Tee + Tote',
    body: 'Bundle top 3 core items at a 10–15% discount. Increases AOV and reduces individual returns. Launch in Q3 ahead of on-sale window.',
    tags: ['Bundle', 'AOV', 'Core'],
    action: 'Create bundle',
    revenue_est: '$20K–$35K',
  },
  {
    id: 'OPP-004', type: 'catalog',    priority: 'medium',
    title: 'Noise vs. Beauty 10-Year Anniversary Capsule',
    body: 'NvB turns 10 in 2027. Develop a limited capsule collection tied to album artwork and original aesthetic. Pairs with catalog re-push strategy.',
    tags: ['Anniversary', 'Catalog Tie-In', 'Limited'],
    action: 'Brief design team',
    revenue_est: '$40K–$80K',
  },
  {
    id: 'OPP-005', type: 'catalog',    priority: 'medium',
    title: 'Into The Sun Catalog Bundle',
    body: 'Pair Into The Sun merch with a playlist curated push. Fan activation + streaming lift + merch conversion opportunity.',
    tags: ['Catalog', 'Streaming', 'Cross-Sell'],
    action: 'Build campaign',
    revenue_est: '$15K–$25K',
  },
  {
    id: 'OPP-006', type: 'rediscovery', priority: 'medium',
    title: 'Divergent Spectrum Archive Print Drop',
    body: 'DS album art is fan-favorite. A numbered art print run (500 units) would drive collector demand ahead of the 2027 tour.',
    tags: ['Art', 'Collector', 'Limited'],
    action: 'Scope production',
    revenue_est: '$18K–$30K',
  },
  {
    id: 'OPP-007', type: 'bundle',     priority: 'low',
    title: 'VIP Tour Bundle — 2027 Routing',
    body: 'Develop exclusive VIP merch bundles tied to the 2027 tour. Hoodie + exclusive tee + signed print. Premium price point for VIP packages.',
    tags: ['Tour', 'VIP', 'Premium'],
    action: 'Develop concept',
    revenue_est: '$50K–$120K',
  },
  {
    id: 'OPP-008', type: 'rediscovery', priority: 'low',
    title: 'Reflective Cap — New Colorways',
    body: 'Reflective cap has moderate sell-through. Introduce 2 new colorways to refresh the product and extend its lifecycle.',
    tags: ['Accessories', 'Refresh', 'New Colors'],
    action: 'Design review',
    revenue_est: '$8K–$14K',
  },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  active: '#10B981', low: '#F59E0B', sold_out: '#EF4444', archived: '#6B7280',
  draft: '#06B6D4', disconnected: '#6B7280', connected: '#10B981',
  cleared: '#10B981', review: '#F59E0B', restricted: '#EF4444',
};
const STATUS_LABEL: Record<string, string> = {
  active: 'Active', low: 'Low Stock', sold_out: 'Sold Out', archived: 'Archived',
  draft: 'Draft', disconnected: 'Not Connected', connected: 'Connected',
  cleared: 'Cleared', review: 'Needs Review', restricted: 'Restricted',
};

const TYPE_COLOR: Record<string, string> = {
  merch: '#F59E0B', visual: '#EC4899', production: '#06B6D4',
  content: '#A3E635', tour: '#3B82F6',
  artwork: '#EC4899', promo: '#F97316', video: '#3B82F6',
  show: '#8B5CF6', photo: '#10B981',
};
const TYPE_LABEL: Record<string, string> = {
  merch: 'Merch', visual: 'Visual', production: 'Production',
  content: 'Content', tour: 'Tour',
  artwork: 'Artwork', promo: 'Promo', video: 'Video',
  show: 'Show Visual', photo: 'Photography',
};

const OPP_COLOR: Record<string, string> = {
  relaunch: '#EF4444', bundle: '#06B6D4', catalog: '#10B981', rediscovery: '#F59E0B',
};
const OPP_LABEL: Record<string, string> = {
  relaunch: 'Relaunch', bundle: 'Bundle', catalog: 'Catalog Tie-In', rediscovery: 'Rediscovery',
};
const PRIORITY_COLOR: Record<string, string> = {
  high: '#EF4444', medium: '#F59E0B', low: '#6B7280',
};
const TREND_ICON = {
  up:   <span style={{ color: '#10B981' }}>↑</span>,
  down: <span style={{ color: '#EF4444' }}>↓</span>,
  flat: <span style={{ color: '#6B7280' }}>→</span>,
};

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded shrink-0"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label.toUpperCase()}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, sub, color, right }: {
  icon: React.ElementType; title: string; sub?: string; color: string; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-white/80">{title}</p>
        {sub && <p className="text-[9px] font-mono text-white/25">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ── MERCH PERFORMANCE ─────────────────────────────────────────────────────────

function MerchPerformance() {
  const maxRev = Math.max(...MONTHLY_REVENUE.map(m => m.rev));

  const topMetrics = [
    { label: 'Monthly Revenue',     value: MERCH_METRICS.monthly_revenue,     delta: MERCH_METRICS.monthly_revenue_delta,  color: '#10B981', icon: DollarSign },
    { label: 'Units Sold (Month)',   value: MERCH_METRICS.units_sold_month.toLocaleString(), delta: MERCH_METRICS.units_sold_delta, color: '#F59E0B', icon: Package },
    { label: 'Sell-Through Rate',    value: MERCH_METRICS.sell_through_rate,   delta: MERCH_METRICS.sell_through_delta,     color: '#06B6D4', icon: Percent    },
    { label: 'Avg Order Value',      value: MERCH_METRICS.avg_order_value,     delta: '',                                   color: '#EC4899', icon: Tag        },
    { label: 'Active Collections',   value: String(MERCH_METRICS.active_collections), delta: '', color: '#3B82F6', icon: Layers  },
    { label: 'Total SKUs',           value: String(MERCH_METRICS.total_skus),  delta: '',                                   color: '#A3E635', icon: Hash       },
    { label: 'Low Stock SKUs',       value: String(MERCH_METRICS.low_stock_skus), delta: '',                                color: '#EF4444', icon: AlertTriangle },
    { label: 'Reorder Needed',       value: String(MERCH_METRICS.reorder_needed), delta: '',                                color: '#EF4444', icon: RefreshCw  },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
        {topMetrics.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-3.5 flex items-start gap-3 hover:border-white/[0.09] transition-all">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${m.color}10`, border: `1px solid ${m.color}1A` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide truncate">{m.label}</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
                {m.delta && <p className="text-[9px] font-mono" style={{ color: m.color + 'AA' }}>{m.delta}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
          <SectionHeader icon={BarChart2} color="#F59E0B" title="Monthly Revenue" sub="Last 7 months" />
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-end gap-2 h-32">
              {MONTHLY_REVENUE.map(m => {
                const pct = (m.rev / maxRev) * 100;
                const isLast = m.month === 'Mar';
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <p className="text-[9px] font-bold" style={{ color: isLast ? '#F59E0B' : 'rgba(255,255,255,0.3)' }}>${m.rev}K</p>
                    <div className="w-full rounded-t-sm transition-all" style={{
                      height: `${pct}%`,
                      minHeight: '4px',
                      background: isLast ? '#F59E0B' : '#F59E0B22',
                    }} />
                    <p className="text-[8.5px] font-mono text-white/25">{m.month}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
          <SectionHeader icon={Star} color="#10B981" title="Best Sellers" sub="By units sold this month · Top 8" />
          <div className="divide-y divide-white/[0.03]">
            {BEST_SELLERS.slice(0, 5).map(s => (
              <div key={s.rank} className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.015] transition-colors">
                <span className="text-[10px] font-mono text-white/20 w-4 shrink-0">{s.rank}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white/70 truncate">{s.name}</p>
                  <p className="text-[9px] text-white/25">{s.collection}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold text-[#10B981]">{s.revenue}</p>
                  <p className="text-[8.5px] font-mono text-white/25">{s.units} units · {s.sell_through}</p>
                </div>
                <div className="text-[12px] shrink-0">{TREND_ICON[s.trend as keyof typeof TREND_ICON]}</div>
                <PillBadge label={STATUS_LABEL[s.status] ?? s.status} color={STATUS_COLOR[s.status] ?? '#6B7280'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INVENTORY DATABASE ────────────────────────────────────────────────────────

function InventoryDatabase() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const types = ['all', 'merch', 'visual', 'production', 'content', 'tour'];
  const filtered = INVENTORY_DB
    .filter(i => typeFilter === 'all' || i.type === typeFilter)
    .filter(i => statusFilter === 'all' || i.status === statusFilter);
  const visible = showAll ? filtered : filtered.slice(0, 10);

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Archive} color="#06B6D4"
        title="Inventory Database"
        sub={`${INVENTORY_DB.length} total items · Merch · Visual · Production · Content · Tour`}
        right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        }
      />
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-white/[0.04] flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {types.map(t => {
            const active = typeFilter === t;
            const col = TYPE_COLOR[t] ?? '#06B6D4';
            return (
              <button key={t} onClick={() => setTypeFilter(t)}
                className="px-2.5 py-1 rounded text-[10px] font-medium transition-all whitespace-nowrap shrink-0"
                style={{
                  background: active ? `${col}18` : 'transparent',
                  color: active ? col : 'rgba(255,255,255,0.3)',
                  border: active ? `1px solid ${col}30` : '1px solid transparent',
                }}
              >
                {t === 'all' ? 'All Types' : TYPE_LABEL[t] ?? t}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5">
          {['all', 'active', 'low', 'sold_out', 'archived', 'draft'].map(s => {
            const active = statusFilter === s;
            const col = s === 'all' ? '#6B7280' : STATUS_COLOR[s] ?? '#6B7280';
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className="px-2 py-0.5 rounded text-[9.5px] transition-all whitespace-nowrap shrink-0"
                style={{
                  background: active ? `${col}14` : 'transparent',
                  color: active ? col : 'rgba(255,255,255,0.2)',
                  border: active ? `1px solid ${col}22` : '1px solid transparent',
                }}
              >
                {s === 'all' ? 'All Status' : STATUS_LABEL[s] ?? s}
              </button>
            );
          })}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['ID', 'Type', 'Name', 'Category', 'SKU / Format', 'Qty', 'Status', 'Notes'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {visible.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.015] transition-colors">
                <td className="px-4 py-3 text-[9px] font-mono text-white/20 whitespace-nowrap">{item.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PillBadge label={TYPE_LABEL[item.type] ?? item.type} color={TYPE_COLOR[item.type] ?? '#6B7280'} />
                </td>
                <td className="px-4 py-3 max-w-[220px]">
                  <p className="text-[11px] font-medium text-white/70 truncate">{item.name}</p>
                </td>
                <td className="px-4 py-3 text-[10.5px] text-white/35 whitespace-nowrap">{item.category}</td>
                <td className="px-4 py-3 text-[10px] font-mono text-white/30 whitespace-nowrap">{item.sku ?? item.format ?? '—'}</td>
                <td className="px-4 py-3 text-[11px] font-bold whitespace-nowrap"
                  style={{ color: item.qty === 0 ? '#EF4444' : item.qty !== undefined && item.qty < 20 ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>
                  {item.qty !== undefined ? item.qty : '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PillBadge label={STATUS_LABEL[item.status] ?? item.status} color={STATUS_COLOR[item.status] ?? '#6B7280'} />
                </td>
                <td className="px-4 py-3 text-[9.5px] text-white/25 max-w-[200px]">
                  <p className="truncate">{item.notes || '—'}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 10 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] text-white/25 hover:text-white/50 border-t border-white/[0.04] transition-colors"
        >
          {showAll ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show {filtered.length - 10} More</>}
        </button>
      )}
    </div>
  );
}

// ── VISUAL ASSET LIBRARY ─────────────────────────────────────────────────────

const VA_TYPE_ICON: Record<string, React.ElementType> = {
  artwork: Image, promo: Camera, video: Video, content: Play,
  show: Star, production: Layers, photo: Camera,
};

function VisualAssetLibrary() {
  const [filter, setFilter] = useState('all');
  const types = ['all', 'artwork', 'promo', 'video', 'content', 'show', 'production'];
  const filtered = filter === 'all' ? VISUAL_ASSETS : VISUAL_ASSETS.filter(a => a.type === filter);

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Image} color="#EC4899"
        title="Visual Asset Library"
        sub={`${VISUAL_ASSETS.length} assets · Artwork · Promo · Videos · Content · Show Visuals · Production`}
        right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
            <Plus className="w-3 h-3" /> Upload Asset
          </button>
        }
      />
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-white/[0.04] overflow-x-auto">
        {types.map(t => {
          const active = filter === t;
          const col = TYPE_COLOR[t] ?? '#EC4899';
          return (
            <button key={t} onClick={() => setFilter(t)}
              className="px-2.5 py-1 rounded text-[10px] font-medium transition-all whitespace-nowrap shrink-0"
              style={{
                background: active ? `${col}18` : 'transparent',
                color: active ? col : 'rgba(255,255,255,0.3)',
                border: active ? `1px solid ${col}30` : '1px solid transparent',
              }}
            >
              {t === 'all' ? 'All Types' : TYPE_LABEL[t] ?? t}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        {filtered.map(a => {
          const Icon = VA_TYPE_ICON[a.type] ?? FileText;
          const color = TYPE_COLOR[a.type] ?? '#EC4899';
          return (
            <div key={a.id} className="bg-[#0D0F13] border border-white/[0.05] rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-white/[0.08] transition-all">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}10`, border: `1px solid ${color}1A` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-white/75 leading-snug truncate">{a.name}</p>
                  <p className="text-[9px] font-mono text-white/20 mt-0.5">{a.format} · {a.updated}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                <PillBadge label={TYPE_LABEL[a.type] ?? a.type} color={color} />
                <PillBadge label={STATUS_LABEL[a.status] ?? a.status} color={STATUS_COLOR[a.status] ?? '#6B7280'} />
                <PillBadge label={STATUS_LABEL[a.clearance] ?? a.clearance} color={STATUS_COLOR[a.clearance] ?? '#6B7280'} />
              </div>
              <div className="flex flex-wrap gap-1">
                {a.tags.map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1.5 border-t border-white/[0.04]">
                <button className="flex items-center gap-1 px-2 py-1 rounded border border-white/[0.07] text-[9.5px] text-white/30 hover:text-white/60 transition-all">
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded border border-white/[0.07] text-[9.5px] text-white/30 hover:text-white/60 transition-all">
                  <Download className="w-3 h-3" /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PLATFORM CONNECTIVITY ─────────────────────────────────────────────────────

function PlatformConnectivity() {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Link2} color="#3B82F6"
        title="Platform Connectivity"
        sub="Shopify · Merch fulfillment · Storefront platforms · Direct-to-fan channels"
      />
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PLATFORMS.map(p => (
          <div key={p.id} className="bg-[#0D0F13] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-3 hover:border-white/[0.08] transition-all">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl bg-white/[0.04] border border-white/[0.06]">
                {p.logo}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-white/75">{p.name}</p>
                <PillBadge label={STATUS_LABEL[p.status] ?? p.status} color={STATUS_COLOR[p.status] ?? '#6B7280'} />
              </div>
            </div>
            <p className="text-[9.5px] text-white/30 leading-snug">{p.note}</p>
            <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
              <button
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded border border-[#3B82F6]/25 bg-[#3B82F6]/[0.07] text-[10px] text-[#3B82F6] hover:bg-[#3B82F6]/[0.12] transition-all"
              >
                <ExternalLink className="w-3 h-3" /> Connect
              </button>
              <span className="text-[8px] font-mono text-white/15 shrink-0">{p.badge}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mx-5 mb-5 bg-[#3B82F6]/[0.05] border border-[#3B82F6]/15 rounded-xl px-4 py-3 flex items-start gap-3">
        <Link2 className="w-3.5 h-3.5 text-[#3B82F6] shrink-0 mt-0.5" />
        <p className="text-[10.5px] text-white/35 leading-snug">
          Platform integrations are in development. Once connected, inventory levels, order data, and sell-through rates will sync automatically into this dashboard.
        </p>
      </div>
    </div>
  );
}

// ── OPPORTUNITY RECOMMENDATIONS ───────────────────────────────────────────────

function OpportunityRecs() {
  const [filter, setFilter] = useState('all');
  const types = ['all', 'relaunch', 'bundle', 'catalog', 'rediscovery'];
  const filtered = filter === 'all' ? OPPORTUNITY_RECS : OPPORTUNITY_RECS.filter(o => o.type === filter);

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Sparkles} color="#10B981"
        title="Opportunity Recommendations"
        sub="Relaunch candidates · Bundles · Catalog tie-ins · Anniversary + rediscovery products"
      />
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-white/[0.04] overflow-x-auto">
        {types.map(t => {
          const active = filter === t;
          const col = OPP_COLOR[t] ?? '#10B981';
          return (
            <button key={t} onClick={() => setFilter(t)}
              className="px-2.5 py-1 rounded text-[10px] font-medium transition-all whitespace-nowrap shrink-0"
              style={{
                background: active ? `${col}18` : 'transparent',
                color: active ? col : 'rgba(255,255,255,0.3)',
                border: active ? `1px solid ${col}30` : '1px solid transparent',
              }}
            >
              {t === 'all' ? 'All Opportunities' : OPP_LABEL[t] ?? t}
            </button>
          );
        })}
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(o => {
          const color = OPP_COLOR[o.type] ?? '#10B981';
          const OppIcons: Record<string, React.ElementType> = {
            relaunch: Repeat, bundle: Gift, catalog: Music, rediscovery: Zap,
          };
          const Icon = OppIcons[o.type] ?? Sparkles;
          return (
            <div key={o.id} className="bg-[#0D0F13] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-3 hover:border-white/[0.08] transition-all">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}10`, border: `1px solid ${color}1A` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[12px] font-semibold text-white/80">{o.title}</p>
                    <PillBadge label={OPP_LABEL[o.type] ?? o.type} color={color} />
                    <PillBadge label={o.priority} color={PRIORITY_COLOR[o.priority] ?? '#6B7280'} />
                  </div>
                </div>
              </div>
              <p className="text-[10.5px] text-white/45 leading-relaxed">{o.body}</p>
              <div className="flex flex-wrap gap-1">
                {o.tags.map(tag => (
                  <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{tag}</span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04]">
                <div>
                  <p className="text-[8.5px] font-mono text-white/20 uppercase">Revenue Est.</p>
                  <p className="text-[12px] font-bold" style={{ color }}>{o.revenue_est}</p>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[10.5px] font-semibold transition-all hover:opacity-90"
                  style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  {o.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

type TabId = 'performance' | 'inventory' | 'assets' | 'platforms' | 'opportunities';

export default function COSInventory() {
  const [activeTab, setActiveTab] = useState<TabId>('performance');

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'performance',    label: 'Performance',     icon: TrendingUp  },
    { id: 'inventory',      label: 'Inventory',       icon: Archive     },
    { id: 'assets',         label: 'Visual Assets',   icon: Image       },
    { id: 'platforms',      label: 'Platforms',       icon: Link2       },
    { id: 'opportunities',  label: 'Opportunities',   icon: Sparkles    },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={ShoppingBag}
        title="Inventory + Merch"
        subtitle="Merch Performance · Inventory DB · Visual Assets · Platform Connectivity · Opportunities"
        accentColor={ACCENT}
        badge="Live"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#F59E0B]/25 bg-[#F59E0B]/[0.07] text-[10.5px] text-[#F59E0B] hover:bg-[#F59E0B]/[0.12] transition-all">
              <RefreshCw className="w-3 h-3" /> Sync
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <ArrowUpRight className="w-3 h-3" /> Export
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-1 px-5 pt-4 border-b border-white/[0.05] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap shrink-0"
              style={{
                color: active ? ACCENT : 'rgba(255,255,255,0.3)',
                borderBottomColor: active ? ACCENT : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">
        {activeTab === 'performance' && <MerchPerformance />}
        {activeTab === 'inventory' && <InventoryDatabase />}
        {activeTab === 'assets' && <VisualAssetLibrary />}
        {activeTab === 'platforms' && <PlatformConnectivity />}
        {activeTab === 'opportunities' && <OpportunityRecs />}
      </div>
    </div>
  );
}
