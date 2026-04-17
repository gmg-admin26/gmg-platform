import { useState } from 'react';
import {
  Users, MapPin, TrendingUp, TrendingDown, Zap, ShoppingBag,
  Radio, Star, RefreshCw, Heart, Crown, Globe, Music,
  Target, Megaphone, Sparkles, ChevronDown, ChevronUp,
  ArrowUpRight, AlertCircle, Activity, BarChart2,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import FanValueIndex from '../../components/catalog/FanValueIndex';
import SuperfanEconomics from '../../components/catalog/SuperfanEconomics';
import PlatformEcosystem from '../../components/catalog/PlatformEcosystem';
import SuperfanEngine from '../../components/catalog/SuperfanEngine';
import AIPlaybooks from '../../components/catalog/AIPlaybooks';
import FanClubSystem from '../../components/catalog/FanClubSystem';

const ACCENT = '#3B82F6';

// ── DATA ────────────────────────────────────────────────────────────────────

const FAN_OVERVIEW = {
  total_audience: 4_800_000,
  active_fans: 1_240_000,
  dormant_fans: 2_960_000,
  reactivated_fans: 186_000,
  new_fans_30d: 48_000,
  engagement_trend: '+14.2%',
  engagement_dir: 'up' as const,
  top_countries: [
    { country: 'United States',  code: 'US', pct: 42, listeners: 520_800, trend: 'up'     },
    { country: 'United Kingdom', code: 'UK', pct: 11, listeners: 136_400, trend: 'up'     },
    { country: 'Canada',         code: 'CA', pct: 8,  listeners: 99_200,  trend: 'up'     },
    { country: 'Australia',      code: 'AU', pct: 6,  listeners: 74_400,  trend: 'stable' },
    { country: 'Germany',        code: 'DE', pct: 5,  listeners: 62_000,  trend: 'up'     },
    { country: 'Netherlands',    code: 'NL', pct: 4,  listeners: 49_600,  trend: 'rising' },
    { country: 'Brazil',         code: 'BR', pct: 3,  listeners: 37_200,  trend: 'rising' },
    { country: 'Japan',          code: 'JP', pct: 3,  listeners: 37_200,  trend: 'up'     },
  ],
  top_cities: [
    { city: 'Los Angeles',  country: 'US', pct: 12, listeners: 148_800, delta: '+8%'  },
    { city: 'New York',     country: 'US', pct: 10, listeners: 124_000, delta: '+5%'  },
    { city: 'London',       country: 'UK', pct: 8,  listeners: 99_200,  delta: '+12%' },
    { city: 'Toronto',      country: 'CA', pct: 6,  listeners: 74_400,  delta: '+4%'  },
    { city: 'Sydney',       country: 'AU', pct: 5,  listeners: 62_000,  delta: '+2%'  },
    { city: 'Berlin',       country: 'DE', pct: 4,  listeners: 49_600,  delta: '+18%' },
    { city: 'Chicago',      country: 'US', pct: 4,  listeners: 49_600,  delta: '+3%'  },
    { city: 'Mexico City',  country: 'MX', pct: 3,  listeners: 37_200,  delta: '+22%' },
  ],
  age_breakdown: [
    { range: '18–24', pct: 28, note: 'New discovery cohort',   color: '#10B981' },
    { range: '25–34', pct: 34, note: 'Core active listeners',  color: '#06B6D4' },
    { range: '35–44', pct: 21, note: 'Legacy retention core',  color: '#3B82F6' },
    { range: '45–54', pct: 11, note: 'Merch + vinyl buyers',   color: '#F59E0B' },
    { range: '55+',   pct: 6,  note: 'Long-tail audience',     color: '#6B7280' },
  ],
  engagement_monthly: [
    { month: 'Nov', value: 62 }, { month: 'Dec', value: 68 }, { month: 'Jan', value: 74 },
    { month: 'Feb', value: 80 }, { month: 'Mar', value: 91 }, { month: 'Apr', value: 100 },
  ],
};

const FAN_SEGMENTS = [
  {
    id: 'legacy_core',
    label: 'Legacy Core Fans',
    icon: Crown,
    color: '#F59E0B',
    count: 320_000,
    pct: 26,
    description: 'Pre-2020 listeners who followed through the hiatus. High lifetime value, highest merch conversion.',
    avg_monthly_streams: 28,
    merch_buyers: true,
    live_likely: true,
    health: 'strong',
    key_traits: ['Long tenure (5+ yrs)', 'High merch spend', 'Community active', 'Sync-aware'],
    opportunity: 'Fan vault drops, exclusive content, first-access merch',
  },
  {
    id: 'casual_streaming',
    label: 'Casual Streaming Fans',
    icon: Radio,
    color: '#06B6D4',
    count: 480_000,
    pct: 39,
    description: 'Playlist-driven listeners. Highest volume, lowest conversion. Re-engagement campaigns critical.',
    avg_monthly_streams: 6,
    merch_buyers: false,
    live_likely: false,
    health: 'growing',
    key_traits: ['Playlist discovery', 'Algorithm-driven', 'Low loyalty', 'High reach'],
    opportunity: 'Playlist retargeting, short-form content, low-friction merch',
  },
  {
    id: 'reactivated',
    label: 'Reactivated Fans',
    icon: RefreshCw,
    color: '#10B981',
    count: 186_000,
    pct: 15,
    description: 'Dormant fans who returned in the last 6 months. Highest growth rate, strongest conversion signal.',
    avg_monthly_streams: 18,
    merch_buyers: true,
    live_likely: true,
    health: 'rising',
    key_traits: ['Returning listener', 'Catalog re-explorer', 'Email responsive', 'Social engager'],
    opportunity: 'Personalized re-engagement, archival releases, direct email campaigns',
  },
  {
    id: 'merch_buyers',
    label: 'Merch Buyers',
    icon: ShoppingBag,
    color: '#EC4899',
    count: 94_000,
    pct: 8,
    description: 'Documented purchasers of physical goods. Highest average spend per fan across all segments.',
    avg_monthly_streams: 22,
    merch_buyers: true,
    live_likely: true,
    health: 'strong',
    key_traits: ['Physical goods buyer', 'High LTV', 'Brand loyal', 'Collectible interest'],
    opportunity: 'Limited drops, bundle offers, exclusive colorways, early access',
  },
  {
    id: 'live_event',
    label: 'Live Event Fans',
    icon: Zap,
    color: '#A3E635',
    count: 68_000,
    pct: 6,
    description: 'Verified concert attendees. Highest ticket intent. Critical for tour reactivation targeting.',
    avg_monthly_streams: 24,
    merch_buyers: true,
    live_likely: true,
    health: 'holding',
    key_traits: ['Past ticket buyer', 'Festival-goer', 'High-intensity fan', 'Premium spender'],
    opportunity: 'Presale targeting, VIP packages, intimate venue re-launch',
  },
  {
    id: 'fan_club',
    label: 'Fan Club Members',
    icon: Star,
    color: '#8B5CF6',
    count: 42_000,
    pct: 3,
    description: 'ZFM + mailing list members. Most engaged, highest conversion, strongest brand advocates.',
    avg_monthly_streams: 38,
    merch_buyers: true,
    live_likely: true,
    health: 'strong',
    key_traits: ['ZFM member', 'Mailing list active', 'Community leader', 'Brand ambassador'],
    opportunity: 'Exclusive content, community-led campaigns, referral programs',
  },
  {
    id: 'lapsed_hvf',
    label: 'Lapsed High-Value Fans',
    icon: AlertCircle,
    color: '#EF4444',
    count: 52_000,
    pct: 4,
    description: 'Previously high-spend fans who have gone inactive in 12+ months. Highest reactivation ROI target.',
    avg_monthly_streams: 2,
    merch_buyers: false,
    live_likely: false,
    health: 'at_risk',
    key_traits: ['Was top 10% spender', 'Inactive 12mo+', 'Email unengaged', 'No recent streams'],
    opportunity: 'Win-back email sequence, exclusive "we remember you" offer, private access drop',
  },
];

const OPPORTUNITY_INSIGHTS = [
  {
    category: 'Acquisition Source',
    icon: Target,
    color: '#06B6D4',
    insights: [
      { label: 'TikTok organic discovery',   value: '38% of new fans',      note: '"Butterfly" audio used in 4,200+ videos this month'    },
      { label: 'Spotify playlist algorithm', value: '29% of new fans',      note: 'Late Night Vibes + 3 algo playlists driving volume'    },
      { label: 'YouTube re-discovery',       value: '18% of new fans',      note: 'Live set clips from 2016–2019 getting new views'        },
      { label: 'Reddit / community',         value: '11% of new fans',      note: 'r/electronicmusic threads generating real listener lift' },
      { label: 'Direct press',               value: '4% of new fans',       note: 'Billboard + Pitchfork features with attributable lift'  },
    ],
  },
  {
    category: 'Content + Themes Working',
    icon: Sparkles,
    color: '#F59E0B',
    insights: [
      { label: 'Nostalgia / throwback content', value: 'Highest engagement',   note: '"This album changed my life" posts — massive organic reach' },
      { label: 'Behind-the-scenes archival',    value: '+42% share rate',      note: 'Unreleased studio content driving high share velocity'     },
      { label: 'Bass-heavy sync moments',       value: 'Top TikTok format',    note: 'Cinematic + high-energy clips dominate discovery feed'     },
      { label: 'Fan community spotlights',      value: '+28% comment rate',    note: 'Fan-generated content re-posts drive strongest saves'      },
    ],
  },
  {
    category: 'Heating Markets',
    icon: Globe,
    color: '#10B981',
    insights: [
      { label: 'Mexico City',    value: '+22% MoM',      note: 'Organic bass music community growth — no paid spend'   },
      { label: 'Berlin',         value: '+18% MoM',      note: 'Club culture re-discovery, no active touring presence' },
      { label: 'London',         value: '+12% MoM',      note: 'Strong streaming lift, editorial placement confirmed'   },
      { label: 'Seoul, KR',      value: '+9% MoM',       note: 'New market entry — algorithm-driven cold growth'        },
      { label: 'Amsterdam, NL',  value: '+8% MoM',       note: 'Festival season + podcast mention attributed growth'    },
    ],
  },
  {
    category: 'Releases Driving Rediscovery',
    icon: Music,
    color: '#EC4899',
    insights: [
      { label: 'Butterfly (2012)',           value: '4.2M streams/mo', note: 'Sync consideration + TikTok audio trend extending shelf life' },
      { label: 'Divergent Spectrum LP',      value: '+22% vs prior mo', note: 'Marquee campaign + editorial placement — full LP rediscovery' },
      { label: 'Colorado (2016)',            value: '+19% MoM',        note: 'Nostalgia wave — listeners pulling back into catalog'          },
      { label: 'To the Stars (2014)',        value: '+17% MoM',        note: 'YouTube organic discovery from an old live clip'               },
    ],
  },
];

type ActionType = 'campaign' | 'merch' | 'activation' | 'press' | 'community';

const ACTION_LAYER: {
  id: string; type: ActionType; title: string; description: string;
  target_segment: string; urgency: 'critical' | 'high' | 'medium';
  est_impact: string; color: string; icon: React.ElementType;
}[] = [
  {
    id: 'A-001', type: 'campaign', icon: Megaphone, color: '#10B981',
    title: 'Lapsed HVF Win-Back Email Sequence',
    description: '3-part drip campaign targeting 52K lapsed high-value fans. "We\'ve been waiting" narrative + exclusive access offer.',
    target_segment: 'Lapsed High-Value Fans',
    urgency: 'critical', est_impact: 'Est. 8–14% reactivation → $28K–$48K LTV',
  },
  {
    id: 'A-002', type: 'campaign', icon: Radio, color: '#06B6D4',
    title: 'Spotify Retargeting — Casual Listener Conversion',
    description: 'Marquee + Showcase campaign targeting 480K casual streaming fans. Drive catalog depth + ZFM sign-ups.',
    target_segment: 'Casual Streaming Fans',
    urgency: 'high', est_impact: 'Est. +22K converted fans, +$18K/mo streaming',
  },
  {
    id: 'A-003', type: 'merch', icon: ShoppingBag, color: '#EC4899',
    title: 'Butterfly Anniversary Vinyl Drop',
    description: 'Limited 180g vinyl reissue of Butterfly + art print bundle. Target merch buyers + legacy core fans.',
    target_segment: 'Merch Buyers + Legacy Core',
    urgency: 'high', est_impact: 'Est. 2K–4K units → $80K–$160K gross',
  },
  {
    id: 'A-004', type: 'activation', icon: Zap, color: '#A3E635',
    title: 'Berlin + Mexico City Activation',
    description: 'Pop-up listening event + local press in 2 heating markets. No touring presence needed — community-first format.',
    target_segment: 'Live Event Fans (new market)',
    urgency: 'medium', est_impact: 'Est. +4K fans, +press coverage in 2 new markets',
  },
  {
    id: 'A-005', type: 'press', icon: Target, color: '#F59E0B',
    title: 'Rediscovery Press Push — Catalog Story',
    description: 'Pitch "legacy catalog defying gravity" narrative to 8 targeted music publications. Anchor on streaming growth data.',
    target_segment: 'New Fan Acquisition',
    urgency: 'medium', est_impact: 'Est. 3–5 placements, 40K–120K new reach',
  },
  {
    id: 'A-006', type: 'community', icon: Heart, color: '#8B5CF6',
    title: 'ZFM Fan Club Expansion Campaign',
    description: 'Target reactivated fans (186K) with exclusive community invite. One-time unlock + archival bonus content.',
    target_segment: 'Reactivated Fans',
    urgency: 'medium', est_impact: 'Est. +3K–6K new ZFM members → +$8K/mo recurring',
  },
  {
    id: 'A-007', type: 'campaign', icon: Sparkles, color: '#06B6D4',
    title: 'TikTok Organic Amplification',
    description: 'Seed 10 creator partnerships around "Butterfly" audio trend. Leverage existing organic momentum.',
    target_segment: 'New / Casual Fans',
    urgency: 'high', est_impact: 'Est. +18K new listeners, extend TikTok cycle 4–6 wks',
  },
  {
    id: 'A-008', type: 'merch', icon: Crown, color: '#F59E0B',
    title: 'Legacy Core Fan Vault Bundle',
    description: 'Exclusive archival package for top-tier fans: unreleased demos, limited print, handwritten art. ZFM-only offer.',
    target_segment: 'Legacy Core + Fan Club',
    urgency: 'medium', est_impact: 'Est. $140K–$280K in 30 days (500–1K units at $280)',
  },
];

const ACTION_TYPE_META: Record<ActionType, { label: string; color: string }> = {
  campaign:   { label: 'Campaign',    color: '#10B981' },
  merch:      { label: 'Merch Drop',  color: '#EC4899' },
  activation: { label: 'Activation',  color: '#A3E635' },
  press:      { label: 'Press',       color: '#F59E0B' },
  community:  { label: 'Community',   color: '#8B5CF6' },
};

const URGENCY_META = {
  critical: { label: 'Critical', color: '#EF4444' },
  high:     { label: 'High',     color: '#F59E0B' },
  medium:   { label: 'Medium',   color: '#06B6D4' },
};

const HEALTH_META: Record<string, { label: string; color: string }> = {
  strong:  { label: 'Strong',  color: '#10B981' },
  growing: { label: 'Growing', color: '#06B6D4' },
  rising:  { label: 'Rising',  color: '#A3E635' },
  holding: { label: 'Holding', color: '#F59E0B' },
  at_risk: { label: 'At Risk', color: '#EF4444' },
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function TrendIcon({ dir, size = 3 }: { dir: string; size?: number }) {
  if (dir === 'up' || dir === 'rising') return <TrendingUp className={`w-${size} h-${size} text-[#10B981]`} />;
  if (dir === 'down') return <TrendingDown className={`w-${size} h-${size} text-[#EF4444]`} />;
  return <Activity className={`w-${size} h-${size} text-white/25`} />;
}

// Mini sparkline using inline SVG
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80, h = 24, pts = values.length;
  const xs = values.map((_, i) => (i / (pts - 1)) * w);
  const ys = values.map(v => h - ((v - min) / range) * (h - 4) - 2);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="2.5" fill={color} />
    </svg>
  );
}

// Segment card with expand
function SegmentCard({ seg }: { seg: typeof FAN_SEGMENTS[0] }) {
  const [open, setOpen] = useState(false);
  const Icon = seg.icon;
  const health = HEALTH_META[seg.health];

  return (
    <div
      className="bg-[#0B0D10] border rounded-xl overflow-hidden cursor-pointer transition-all"
      style={{ borderColor: open ? `${seg.color}28` : 'rgba(255,255,255,0.06)' }}
      onClick={() => setOpen(o => !o)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${seg.color}14`, border: `1px solid ${seg.color}22` }}>
              <Icon className="w-4 h-4" style={{ color: seg.color }} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-white/85 leading-none">{seg.label}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ color: health.color, background: `${health.color}12`, border: `1px solid ${health.color}20` }}>
                  {health.label}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[18px] font-bold leading-none" style={{ color: seg.color }}>{fmtNum(seg.count)}</p>
            <p className="text-[9.5px] font-mono text-white/25 mt-0.5">{seg.pct}% of audience</p>
          </div>
        </div>

        <p className="text-[11px] text-white/40 leading-relaxed mb-3">{seg.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Avg Streams/mo</p>
              <p className="text-[13px] font-bold text-white/60">{seg.avg_monthly_streams}</p>
            </div>
            <div className="w-px h-6 bg-white/[0.06]" />
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${seg.merch_buyers ? 'text-[#EC4899] bg-[#EC4899]/10' : 'text-white/20 bg-white/[0.03]'}`}>
                Merch
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${seg.live_likely ? 'text-[#A3E635] bg-[#A3E635]/10' : 'text-white/20 bg-white/[0.03]'}`}>
                Live
              </span>
            </div>
          </div>
          <button className="text-white/20 hover:text-white/45 transition-colors">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: `${seg.color}14`, background: `${seg.color}05` }}>
          <div>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Key Traits</p>
            <div className="flex flex-wrap gap-1.5">
              {seg.key_traits.map(t => (
                <span key={t} className="text-[9.5px] px-2 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/[0.06]">{t}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">Top Opportunity</p>
            <p className="text-[11px] text-white/55 leading-relaxed">{seg.opportunity}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Action card
function ActionCard({ action }: { action: typeof ACTION_LAYER[0] }) {
  const Icon = action.icon;
  const urgency = URGENCY_META[action.urgency];
  const typeMeta = ACTION_TYPE_META[action.type];

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 flex gap-4 hover:border-white/[0.10] transition-all">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${action.color}12`, border: `1px solid ${action.color}20` }}>
        <Icon className="w-4 h-4" style={{ color: action.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-[12.5px] font-semibold text-white/85 leading-snug">{action.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: typeMeta.color, background: `${typeMeta.color}12`, border: `1px solid ${typeMeta.color}20` }}>
              {typeMeta.label}
            </span>
            <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: urgency.color, background: `${urgency.color}12`, border: `1px solid ${urgency.color}20` }}>
              {urgency.label}
            </span>
          </div>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed mb-2">{action.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-white/20" />
            <span className="text-[10px] font-mono text-white/30">{action.target_segment}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" style={{ color: action.color }} />
            <span className="text-[10px] font-mono" style={{ color: action.color }}>{action.est_impact}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

type TabId = 'overview' | 'segments' | 'opportunities' | 'actions';

export default function COSFans() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [actionFilter, setActionFilter] = useState<ActionType | 'all'>('all');

  const filteredActions = actionFilter === 'all'
    ? ACTION_LAYER
    : ACTION_LAYER.filter(a => a.type === actionFilter);

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview',      label: 'Overview',           icon: BarChart2  },
    { id: 'segments',      label: 'Fan Segments',       icon: Users      },
    { id: 'opportunities', label: 'Opportunity Signals', icon: Sparkles  },
    { id: 'actions',       label: 'Action Layer',        icon: Zap        },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Users}
        title="Fan Intelligence"
        subtitle="Audience architecture, segment depth, and re-engagement strategy"
        accentColor={ACCENT}
        badge="1.24M Active"
        actions={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#3B82F6]/25 bg-[#3B82F6]/[0.07] text-[10.5px] text-[#3B82F6] hover:bg-[#3B82F6]/[0.12] transition-all">
            <ArrowUpRight className="w-3 h-3" />
            Export
          </button>
        }
      />

      {/* ── TAB BAR ── */}
      <div className="flex items-center gap-1 px-5 pt-4 border-b border-white/[0.05]">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-medium transition-all relative border-b-2 -mb-[1px]"
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

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === 'overview' && (
          <>
            {/* Fan Value Index */}
            <FanValueIndex />

            {/* Superfan Economics */}
            <SuperfanEconomics />

            {/* Superfan Engine */}
            <SuperfanEngine />

            {/* AI Playbooks */}
            <AIPlaybooks />

            {/* Fan Club System */}
            <FanClubSystem />

            {/* Platform Ecosystem */}
            <PlatformEcosystem />

            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              {[
                { label: 'Total Audience',    value: fmtNum(FAN_OVERVIEW.total_audience),    color: ACCENT,    sub: 'All platforms'           },
                { label: 'Active Fans',       value: fmtNum(FAN_OVERVIEW.active_fans),       color: '#10B981', sub: 'Last 28 days'            },
                { label: 'Dormant Fans',      value: fmtNum(FAN_OVERVIEW.dormant_fans),      color: '#F59E0B', sub: 'No activity 90d+'        },
                { label: 'Reactivated',       value: fmtNum(FAN_OVERVIEW.reactivated_fans),  color: '#06B6D4', sub: 'Last 6 months'           },
                { label: 'New Fans (30d)',     value: fmtNum(FAN_OVERVIEW.new_fans_30d),      color: '#EC4899', sub: 'Cross-platform net new'  },
                { label: 'Engagement Trend',  value: FAN_OVERVIEW.engagement_trend,          color: '#A3E635', sub: 'MoM engagement lift'     },
              ].map(m => (
                <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">{m.label}</p>
                  <p className="text-[19px] font-bold leading-none" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[9.5px] font-mono text-white/20 mt-1">{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Engagement trend sparkline */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-5 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">6-Month Engagement Trend</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[11px] font-bold text-[#10B981]">+14.2% MoM</span>
                </div>
              </div>
              <div className="flex items-end gap-2">
                {FAN_OVERVIEW.engagement_monthly.map((m, i, arr) => {
                  const maxV = Math.max(...arr.map(x => x.value));
                  const h = Math.round((m.value / maxV) * 56);
                  const isLast = i === arr.length - 1;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full rounded-t-md transition-all" style={{
                        height: h,
                        background: isLast ? ACCENT : `${ACCENT}28`,
                        border: isLast ? `1px solid ${ACCENT}60` : 'none',
                      }} />
                      <span className="text-[9px] font-mono text-white/25">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
              {/* Top Cities table */}
              <div>
                <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#3B82F6]" /> Top Markets by Monthly Listeners
                </p>
                <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.05]">
                        {['#', 'City', 'Monthly Listeners', 'Share', 'Trend'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {FAN_OVERVIEW.top_cities.map((c, i) => (
                        <tr key={c.city} className="hover:bg-white/[0.018] transition-colors">
                          <td className="px-4 py-3.5 text-[9px] font-mono text-white/20">{String(i + 1).padStart(2, '0')}</td>
                          <td className="px-4 py-3.5">
                            <p className="text-[12px] font-medium text-white/80">{c.city}</p>
                            <p className="text-[9.5px] font-mono text-white/25">{c.country}</p>
                          </td>
                          <td className="px-4 py-3.5 text-[13px] font-bold text-[#3B82F6]">{fmtNum(c.listeners)}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${(c.pct / 12) * 100}%`, background: ACCENT }} />
                              </div>
                              <span className="text-[10px] font-mono text-white/30">{c.pct}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-[10px] font-mono font-bold text-[#10B981]">{c.delta}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Demographics + age */}
              <div className="space-y-4">
                <div>
                  <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3">Age Range</p>
                  <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 space-y-3">
                    {FAN_OVERVIEW.age_breakdown.map(d => (
                      <div key={d.range}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-[11px] text-white/60">{d.range}</span>
                            <span className="text-[9.5px] font-mono text-white/20 ml-2">{d.note}</span>
                          </div>
                          <span className="text-[11px] font-bold" style={{ color: d.color }}>{d.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top countries list */}
                <div>
                  <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Globe className="w-3 h-3 text-[#10B981]" /> Top Countries
                  </p>
                  <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 space-y-2.5">
                    {FAN_OVERVIEW.top_countries.slice(0, 6).map(c => (
                      <div key={c.code} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendIcon dir={c.trend} />
                          <span className="text-[11px] text-white/60">{c.country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-white/50 font-mono">{fmtNum(c.listeners)}</span>
                          <span className="text-[9px] font-mono text-white/25">{c.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══ SEGMENTS TAB ══ */}
        {activeTab === 'segments' && (
          <>
            {/* Segment summary bar */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-5 py-4">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Audience Composition</p>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-3">
                {FAN_SEGMENTS.map(seg => (
                  <div key={seg.id} className="h-full transition-all" style={{ width: `${seg.pct}%`, background: seg.color }} title={`${seg.label}: ${seg.pct}%`} />
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                {FAN_SEGMENTS.map(seg => (
                  <div key={seg.id} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                    <span className="text-[10px] text-white/40">{seg.label}</span>
                    <span className="text-[10px] font-mono font-bold" style={{ color: seg.color }}>{seg.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {FAN_SEGMENTS.map(seg => <SegmentCard key={seg.id} seg={seg} />)}
            </div>
          </>
        )}

        {/* ══ OPPORTUNITIES TAB ══ */}
        {activeTab === 'opportunities' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {OPPORTUNITY_INSIGHTS.map(section => {
                const Icon = section.icon;
                return (
                  <div key={section.category} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]"
                      style={{ background: `${section.color}05` }}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${section.color}14`, border: `1px solid ${section.color}22` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: section.color }} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-white/80">{section.category}</p>
                        <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">
                          {section.insights.length} signal{section.insights.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="divide-y divide-white/[0.04]">
                      {section.insights.map((ins, i) => (
                        <div key={i} className="px-5 py-3.5 flex items-start justify-between gap-4 hover:bg-white/[0.018] transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11.5px] font-medium text-white/75">{ins.label}</p>
                            <p className="text-[10px] text-white/30 mt-0.5 leading-relaxed">{ins.note}</p>
                          </div>
                          <span className="text-[10.5px] font-mono font-bold shrink-0" style={{ color: section.color }}>{ins.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Heating markets map placeholder */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Geographic Heat — New Fan Acquisition (30d)</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 ml-auto">LIVE DATA</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { city: 'Mexico City',   growth: '+22%', color: '#EF4444', note: 'Organic bass community'      },
                  { city: 'Berlin',        growth: '+18%', color: '#F97316', note: 'Club culture rediscovery'    },
                  { city: 'London',        growth: '+12%', color: '#F59E0B', note: 'Editorial placement lift'    },
                  { city: 'Seoul',         growth: '+9%',  color: '#A3E635', note: 'Algorithm cold growth'       },
                  { city: 'Amsterdam',     growth: '+8%',  color: '#10B981', note: 'Festival + podcast mention'  },
                  { city: 'Los Angeles',   growth: '+8%',  color: '#10B981', note: 'TikTok + sync press spill'   },
                  { city: 'São Paulo',     growth: '+7%',  color: '#06B6D4', note: 'New market — no paid spend'  },
                  { city: 'Tokyo',         growth: '+6%',  color: '#06B6D4', note: 'Steady organic discovery'    },
                ].map(m => (
                  <div key={m.city} className="bg-[#0D0F13] rounded-xl p-3.5 border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11.5px] font-semibold text-white/75">{m.city}</p>
                      <span className="text-[12px] font-bold font-mono" style={{ color: m.color }}>{m.growth}</span>
                    </div>
                    <p className="text-[9.5px] text-white/25">{m.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ══ ACTIONS TAB ══ */}
        {activeTab === 'actions' && (
          <>
            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mr-1">Filter</span>
              {([['all', 'All Actions'], ...Object.entries(ACTION_TYPE_META).map(([k, v]) => [k, v.label])] as [string, string][]).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => setActionFilter(val as ActionType | 'all')}
                  className="px-2.5 py-1.5 rounded text-[10px] font-mono transition-all border"
                  style={{
                    color: actionFilter === val ? '#000' : 'rgba(255,255,255,0.3)',
                    background: actionFilter === val ? (val === 'all' ? ACCENT : ACTION_TYPE_META[val as ActionType]?.color ?? ACCENT) : 'transparent',
                    borderColor: actionFilter === val
                      ? (val === 'all' ? ACCENT : ACTION_TYPE_META[val as ActionType]?.color ?? ACCENT)
                      : 'rgba(255,255,255,0.07)',
                  }}
                >
                  {lbl}
                </button>
              ))}
              <span className="ml-auto text-[9.5px] font-mono text-white/20">{filteredActions.length} actions</span>
            </div>

            {/* Critical + high urgency alert */}
            {filteredActions.filter(a => a.urgency === 'critical').length > 0 && (
              <div className="bg-[#EF4444]/[0.06] border border-[#EF4444]/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                <p className="text-[11.5px] text-[#EF4444]/80 font-medium">
                  {filteredActions.filter(a => a.urgency === 'critical').length} critical action{filteredActions.filter(a => a.urgency === 'critical').length > 1 ? 's' : ''} need immediate execution
                </p>
              </div>
            )}

            {/* Priority grouping */}
            {(['critical', 'high', 'medium'] as const).map(urgency => {
              const items = filteredActions.filter(a => a.urgency === urgency);
              if (!items.length) return null;
              const meta = URGENCY_META[urgency];
              return (
                <div key={urgency}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
                    <p className="text-[9.5px] font-mono uppercase tracking-widest" style={{ color: meta.color }}>
                      {meta.label} Priority
                    </p>
                    <span className="text-[9.5px] font-mono text-white/20">· {items.length} action{items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2.5">
                    {items.map(a => <ActionCard key={a.id} action={a} />)}
                  </div>
                </div>
              );
            })}
          </>
        )}

      </div>
    </div>
  );
}
