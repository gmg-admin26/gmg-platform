import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Newspaper, Globe, Search, Shield,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, Activity,
  BarChart2, MessageSquare, Eye, Zap, RefreshCw, Megaphone,
  FileText, Star, Minus, ChevronRight, Target, Users,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';

const ACCENT = '#EC4899';

// ── DATA ─────────────────────────────────────────────────────────────────────

const BRAND_SCORE = {
  overall: 78,
  updated: 'Apr 14, 2026',
  tier: 'Above Average',
  tier_note: 'Strong for a mid-legacy catalog with no active releases in 18 months',
  dimensions: [
    { label: 'Visibility',           score: 82, delta: '+6',  color: '#3B82F6', note: 'Editorial + search placement strong'        },
    { label: 'Sentiment',            score: 74, delta: '+2',  color: '#10B981', note: 'Positive net, minor unresolved threads'      },
    { label: 'Press Activity',       score: 64, delta: '-2',  color: '#F59E0B', note: '3 placements this month, needs cadence'      },
    { label: 'Social Consistency',   score: 58, delta: '-8',  color: '#EF4444', note: 'Posting gaps flagged on 3 platforms'         },
    { label: 'Search Visibility',    score: 80, delta: '+11', color: '#06B6D4', note: 'Knowledge panel active, top 3 on brand terms' },
    { label: 'Cultural Presence',    score: 71, delta: '+4',  color: '#A3E635', note: 'Sync + community traction growing'           },
    { label: 'Audience Trust',       score: 83, delta: '+1',  color: '#10B981', note: 'ZFM satisfaction high, legacy fan loyalty'   },
    { label: 'Catalog Momentum',     score: 88, delta: '+12', color: '#3B82F6', note: 'Streaming velocity at multi-year high'       },
  ],
};

const PRESS_MENTIONS = [
  { id: 'P-001', outlet: 'Billboard',     headline: '"Midnight Frequency Enters Chart Resurgence"',           date: 'Apr 11, 2026', sentiment: 'positive', type: 'feature',   tier: 1, reach: '4.2M' },
  { id: 'P-002', outlet: 'Pitchfork',     headline: '"Velocity Music Catalog Defies Streaming Gravity"',      date: 'Apr 8, 2026',  sentiment: 'positive', type: 'feature',   tier: 1, reach: '2.8M' },
  { id: 'P-003', outlet: 'Rolling Stone', headline: '"Legacy Catalogs Are Having a Moment"',                  date: 'Mar 28, 2026', sentiment: 'positive', type: 'roundup',   tier: 1, reach: '5.1M' },
  { id: 'P-004', outlet: 'Stereogum',     headline: '"The Slow Comeback of Mid-2010s Electronic Music"',      date: 'Mar 22, 2026', sentiment: 'neutral',  type: 'editorial', tier: 2, reach: '820K' },
  { id: 'P-005', outlet: 'NME',           headline: '"Bass Music\'s Second Life in the Streaming Era"',       date: 'Mar 15, 2026', sentiment: 'positive', type: 'feature',   tier: 2, reach: '1.4M' },
  { id: 'P-006', outlet: 'Reddit (r/edm)',headline: '"Why Velocity Music aged so well (thread)"',             date: 'Mar 9, 2026',  sentiment: 'positive', type: 'community', tier: 3, reach: '92K'  },
];

const SOCIAL_ACTIVITY = [
  { platform: 'Instagram',   followers: '380K', growth_30d: '+4.2%',  posts_30d: 8,  engagement_rate: '3.1%', last_post: '2d ago',  status: 'active',     color: '#EC4899' },
  { platform: 'TikTok',      followers: '920K', growth_30d: '+18.4%', posts_30d: 3,  engagement_rate: '7.8%', last_post: '5d ago',  status: 'irregular',  color: '#06B6D4' },
  { platform: 'YouTube',     followers: '240K', growth_30d: '+2.1%',  posts_30d: 1,  engagement_rate: '5.2%', last_post: '11d ago', status: 'low',        color: '#EF4444' },
  { platform: 'Spotify',     followers: '1.24M',growth_30d: '+6.8%',  posts_30d: 0,  engagement_rate: 'N/A',  last_post: 'N/A',     status: 'passive',    color: '#1DB954' },
  { platform: 'X / Twitter', followers: '88K',  growth_30d: '+0.4%',  posts_30d: 14, engagement_rate: '0.9%', last_post: 'Today',   status: 'active',     color: '#6B7280' },
];

const SITE_ACTIVITY = {
  monthly_visits: 142_000,
  visit_delta: '+22%',
  avg_session: '2m 14s',
  bounce_rate: '58%',
  top_pages: [
    { page: '/discography',   visits: '48K',  pct: 34 },
    { page: '/tour',          visits: '31K',  pct: 22 },
    { page: '/ (homepage)',   visits: '28K',  pct: 20 },
    { page: '/store',         visits: '22K',  pct: 15 },
    { page: '/about',         visits: '13K',  pct: 9  },
  ],
  issues: [
    { label: 'Homepage needs updated bio + current photo',         severity: 'high'   },
    { label: 'Store link broken on mobile',                        severity: 'critical'},
    { label: 'No press/media kit page',                            severity: 'high'   },
    { label: 'Tour page shows 2024 dates (stale)',                 severity: 'medium' },
  ],
};

const PUBLIC_NARRATIVE = {
  dominant_narrative: 'Legacy artist with strong cult following experiencing catalog rediscovery via streaming and sync.',
  narrative_health: 'positive',
  narrative_score: 74,
  themes: [
    { theme: 'Nostalgia + Legacy',     strength: 'dominant', sentiment: 'positive', note: '"Classic artist ahead of their time" framing is pervasive'        },
    { theme: 'Streaming Rediscovery',  strength: 'growing',  sentiment: 'positive', note: 'TikTok + editorial driving new-gen discovery narrative'           },
    { theme: 'Community Loyalty',      strength: 'strong',   sentiment: 'positive', note: 'ZFM + Reddit communities act as organic brand ambassadors'        },
    { theme: 'Return / Comeback',      strength: 'moderate', sentiment: 'mixed',    note: 'Fan speculation is present but no confirmed releases — manage'    },
    { theme: 'AI / Catalog Concerns',  strength: 'low',      sentiment: 'negative', note: 'Minor AI cover discourse surfacing — monitor, not urgent yet'     },
  ],
  knowledge_panel: {
    status: 'active',
    completeness: 82,
    issues: ['Missing manager/booking contact info', 'Outdated label info showing old imprint'],
  },
  wikipedia: {
    status: 'active',
    quality: 'B-class',
    last_edited: 'Mar 3, 2026',
    issues: ['Missing discography citations', 'No section on catalog licensing activity'],
  },
};

const CATALOG_VISIBILITY = {
  dsp_editorial_score: 88,
  sync_visibility: 74,
  playlist_reach: '12.4M',
  items: [
    { platform: 'Spotify',       status: 'strong',   placements: 12, editorial: true,  note: 'Active editorial + 4 major algo playlists'    },
    { platform: 'Apple Music',   status: 'moderate', placements: 5,  editorial: true,  note: '2 editorial features, curated coverage'        },
    { platform: 'YouTube Music', status: 'low',      placements: 2,  editorial: false, note: 'No editorial presence — opportunity gap'       },
    { platform: 'Amazon Music',  status: 'low',      placements: 1,  editorial: false, note: 'Minimal presence, no active effort'            },
    { platform: 'Tidal',         status: 'moderate', placements: 3,  editorial: true,  note: 'Curated feature on master quality series'      },
  ],
  sync_activity: [
    { project: 'Netflix Documentary — unnamed',  status: 'in_nego',   track: 'Butterfly',          date: 'Apr 2026'  },
    { project: 'HBO Series — Music Supervision', status: 'cleared',   track: 'Colorado (2016)',     date: 'Mar 2026'  },
    { project: 'Ad Campaign — Global Brand',     status: 'cleared',   track: 'To the Stars',        date: 'Feb 2026'  },
    { project: 'Indie Film — Festival Circuit',  status: 'submitted', track: 'Depth Charge (Edit)', date: 'Apr 2026'  },
  ],
};

const BRAND_REHAB = {
  overall_status: 'stable',
  risk_level: 'low',
  items: [
    { issue: 'Stale web presence',     status: 'open',    priority: 'high',   action: 'Full site refresh + press kit page. Assign to web team.'                  },
    { issue: 'YouTube under-managed',  status: 'open',    priority: 'high',   action: 'Upload live archive content. Assign digital ops to maintain cadence.'      },
    { issue: 'Return fan speculation', status: 'monitor', priority: 'medium', action: 'Narrative management — do not confirm or deny. Use catalog releases instead.' },
    { issue: 'AI cover discourse',     status: 'monitor', priority: 'low',    action: 'Monitor weekly. Respond only if reaches mainstream press cycle.'            },
    { issue: 'Knowledge panel gaps',   status: 'open',    priority: 'medium', action: 'Update Google KP via artist/label auth. Fix label + contact info.'          },
    { issue: 'Wikipedia quality',      status: 'open',    priority: 'low',    action: 'Engage Wikipedia editor to add citations + licensing section.'              },
  ],
};

const RECOMMENDATIONS = [
  {
    id: 'R-001', category: 'Website',      icon: Globe,       color: '#3B82F6',
    title: 'Full Website Refresh',
    body: 'Homepage bio is 3+ years stale. Press kit page missing. Mobile store link is broken. A one-week web push would immediately lift brand perception.',
    urgency: 'critical', est_effort: '1 week', owner: 'Web / Digital Team',
  },
  {
    id: 'R-002', category: 'Content',      icon: FileText,    color: '#F59E0B',
    title: 'Behind-the-Scenes Archival Content',
    body: 'Archival BTS content from tours and studios has highest share rate of any content type. 4–6 short-form videos would fuel TikTok + Instagram for 2 months.',
    urgency: 'high', est_effort: '2–3 days editing', owner: 'Creative / Content Team',
  },
  {
    id: 'R-003', category: 'Press',        icon: Newspaper,   color: '#06B6D4',
    title: 'Proactive Press Outreach — Catalog Story',
    body: 'Streaming growth data is compelling press material. Pitch 8 target outlets with a catalog rediscovery angle. Anchor on the +22% streaming lift.',
    urgency: 'high', est_effort: '1 week pitch cycle', owner: 'Publicist / GMG PR',
  },
  {
    id: 'R-004', category: 'Social',       icon: Activity,    color: '#EC4899',
    title: 'TikTok + Instagram Consistency Plan',
    body: 'TikTok has 920K followers but only 3 posts this month. Posting gap is costing algorithm reach. 3x/week minimum with archival + fan-driven content.',
    urgency: 'high', est_effort: 'Ongoing (2h/week)', owner: 'Social Manager',
  },
  {
    id: 'R-005', category: 'Reputation',   icon: Shield,      color: '#10B981',
    title: 'Knowledge Panel + Wikipedia Cleanup',
    body: 'Google Knowledge Panel shows outdated label. Wikipedia has quality gaps. Fix both before next press cycle — journalists will reference both.',
    urgency: 'medium', est_effort: '3–5 days', owner: 'Label / Legal + Editor',
  },
  {
    id: 'R-006', category: 'Campaign',     icon: Megaphone,   color: '#A3E635',
    title: 'Campaign Window — Q2 Launch Timing',
    body: 'Streaming momentum is at a multi-year high. Ideal 6–8 week window to launch a campaign before the summer cycle compresses attention. Act before May.',
    urgency: 'high', est_effort: '4–6 weeks build', owner: 'GMG Campaign Team',
  },
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

const SENTIMENT_COLOR: Record<string, string> = {
  positive: '#10B981', neutral: '#6B7280', negative: '#EF4444', mixed: '#F59E0B',
};
const STATUS_COLOR: Record<string, string> = {
  strong: '#10B981', moderate: '#F59E0B', low: '#EF4444',
  active: '#10B981', irregular: '#F59E0B', passive: '#6B7280',
  open: '#EF4444', monitor: '#F59E0B', resolved: '#10B981',
  cleared: '#10B981', in_nego: '#06B6D4', submitted: '#F59E0B',
};
const URGENCY_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F59E0B', medium: '#06B6D4', low: '#6B7280',
};

function ScoreRing({ score, color, size = 88 }: { score: number; color: string; size?: number }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90">
        <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
        <circle cx="35" cy="35" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold leading-none" style={{ color }}>{score}</span>
        <span className="text-[7px] font-mono text-white/20 tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = STATUS_COLOR[status] ?? '#6B7280';
  return <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />;
}

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label.toUpperCase()}
    </span>
  );
}

// ── SCORE PANEL ──────────────────────────────────────────────────────────────

function ScorePanel() {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-start gap-6 flex-wrap mb-5">
        <div className="flex items-center gap-5">
          <ScoreRing score={BRAND_SCORE.overall} color={ACCENT} size={92} />
          <div>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">Overall Brand Score</p>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[16px] font-bold text-white/85">{BRAND_SCORE.tier}</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20">8-DIMENSION</span>
            </div>
            <p className="text-[11px] text-white/30 max-w-xs leading-relaxed">{BRAND_SCORE.tier_note}</p>
            <p className="text-[9px] font-mono text-white/20 mt-1.5">Updated {BRAND_SCORE.updated}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {BRAND_SCORE.dimensions.map(d => {
          const isUp = d.delta.startsWith('+');
          const isDown = d.delta.startsWith('-');
          return (
            <div key={d.label} className="bg-[#0D0F13] rounded-xl p-3.5 border border-white/[0.04] hover:border-white/[0.08] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/45 truncate pr-1">{d.label}</span>
                <div className="flex items-center gap-1">
                  {isUp && <TrendingUp className="w-2.5 h-2.5 text-[#10B981]" />}
                  {isDown && <TrendingDown className="w-2.5 h-2.5 text-[#EF4444]" />}
                  {!isUp && !isDown && <Minus className="w-2.5 h-2.5 text-white/20" />}
                  <span className="text-[9.5px] font-mono" style={{ color: isUp ? '#10B981' : isDown ? '#EF4444' : '#6B7280' }}>{d.delta}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.score}%`, background: d.color }} />
                </div>
                <span className="text-[13px] font-bold shrink-0" style={{ color: d.color }}>{d.score}</span>
              </div>
              <p className="text-[9px] text-white/20 leading-tight">{d.note}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── WATCHER: PRESS ────────────────────────────────────────────────────────────

function PressWatcher() {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F59E0B]/10 border border-[#F59E0B]/20">
          <Newspaper className="w-3.5 h-3.5 text-[#F59E0B]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/80">Press Mentions</p>
          <p className="text-[9px] font-mono text-white/25">6 mentions · Last 30 days · {PRESS_MENTIONS.filter(p => p.sentiment === 'positive').length} positive</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9.5px] font-mono text-white/20">Total reach</span>
          <span className="text-[13px] font-bold text-[#F59E0B]">14.4M</span>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {PRESS_MENTIONS.map(p => (
          <div key={p.id} className="px-5 py-3.5 flex items-start gap-4 hover:bg-white/[0.018] transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[11.5px] font-bold text-white/65">{p.outlet}</span>
                <PillBadge label={p.sentiment} color={SENTIMENT_COLOR[p.sentiment]} />
                <PillBadge label={p.type} color="#6B7280" />
                {p.tier === 1 && <PillBadge label="Tier 1" color="#EC4899" />}
              </div>
              <p className="text-[12px] text-white/75 leading-snug">"{p.headline}"</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] font-mono text-white/25">{p.date}</p>
              <p className="text-[10.5px] font-bold text-[#F59E0B] mt-0.5">{p.reach}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WATCHER: SOCIAL ───────────────────────────────────────────────────────────

function SocialWatcher() {
  const statusLabel: Record<string, string> = { active: 'Active', irregular: 'Irregular', low: 'Low Activity', passive: 'Passive' };
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EC4899]/10 border border-[#EC4899]/20">
          <Activity className="w-3.5 h-3.5 text-[#EC4899]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/80">Social Activity</p>
          <p className="text-[9px] font-mono text-white/25">5 platforms monitored · 2 with posting gaps</p>
        </div>
        <div className="ml-auto">
          <span className="text-[9px] font-mono px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">NEEDS ATTENTION</span>
        </div>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {SOCIAL_ACTIVITY.map(s => (
          <div key={s.platform} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.018] transition-colors">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
            <div className="w-28 shrink-0">
              <p className="text-[12px] font-medium text-white/75">{s.platform}</p>
              <p className="text-[9.5px] font-mono text-white/30">{s.followers} followers</p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[8.5px] font-mono text-white/20 uppercase">Posts/mo</p>
                <p className="text-[12px] font-bold text-white/60">{s.posts_30d}</p>
              </div>
              <div>
                <p className="text-[8.5px] font-mono text-white/20 uppercase">Eng. Rate</p>
                <p className="text-[12px] font-bold text-white/60">{s.engagement_rate}</p>
              </div>
              <div>
                <p className="text-[8.5px] font-mono text-white/20 uppercase">Growth</p>
                <p className="text-[12px] font-bold" style={{ color: s.color }}>{s.growth_30d}</p>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1">
              <PillBadge label={statusLabel[s.status] ?? s.status} color={STATUS_COLOR[s.status] ?? '#6B7280'} />
              <p className="text-[9px] font-mono text-white/20">Last: {s.last_post}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── WATCHER: SITE ─────────────────────────────────────────────────────────────

function SiteWatcher() {
  const sevColor: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#06B6D4' };
  const SevIcon = ({ sev }: { sev: string }) =>
    sev === 'critical' ? <AlertTriangle className="w-3 h-3 text-[#EF4444]" /> :
    sev === 'high' ? <AlertTriangle className="w-3 h-3 text-[#F59E0B]" /> :
    <Clock className="w-3 h-3 text-[#06B6D4]" />;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#06B6D4]/10 border border-[#06B6D4]/20">
          <Globe className="w-3.5 h-3.5 text-[#06B6D4]" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/80">Site Activity</p>
          <p className="text-[9px] font-mono text-white/25">{fmtNum(SITE_ACTIVITY.monthly_visits)} monthly visits · {SITE_ACTIVITY.visit_delta} MoM · {SITE_ACTIVITY.issues.length} issues</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="text-[13px] font-bold text-[#10B981]">{SITE_ACTIVITY.visit_delta}</span>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Top Pages</p>
          <div className="space-y-2.5">
            {SITE_ACTIVITY.top_pages.map(p => (
              <div key={p.page}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] font-mono text-white/55">{p.page}</span>
                  <span className="text-[10.5px] font-bold text-[#06B6D4]">{p.visits}</span>
                </div>
                <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#06B6D4]/60" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-white/[0.05]">
            <div>
              <p className="text-[8.5px] font-mono text-white/20 uppercase">Avg Session</p>
              <p className="text-[14px] font-bold text-white/60">{SITE_ACTIVITY.avg_session}</p>
            </div>
            <div>
              <p className="text-[8.5px] font-mono text-white/20 uppercase">Bounce Rate</p>
              <p className="text-[14px] font-bold text-[#F59E0B]">{SITE_ACTIVITY.bounce_rate}</p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Site Issues</p>
          <div className="space-y-2">
            {SITE_ACTIVITY.issues.map((iss, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-[#0D0F13] rounded-lg px-3 py-2.5 border"
                style={{ borderColor: `${sevColor[iss.severity]}18` }}>
                <SevIcon sev={iss.severity} />
                <p className="text-[11px] text-white/60 leading-snug">{iss.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WATCHER: NARRATIVE ────────────────────────────────────────────────────────

function NarrativeWatcher() {
  const strengthColor: Record<string, string> = { dominant: '#EC4899', growing: '#10B981', strong: '#3B82F6', moderate: '#F59E0B', low: '#6B7280' };
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#A3E635]/10 border border-[#A3E635]/20">
          <MessageSquare className="w-3.5 h-3.5 text-[#A3E635]" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white/80">Public Narrative Tracker</p>
          <p className="text-[9px] font-mono text-white/25">5 narrative themes · Dominant framing: Legacy + Rediscovery</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-mono text-white/20 uppercase">Narrative Health</p>
          <p className="text-[16px] font-bold text-[#10B981]">{PUBLIC_NARRATIVE.narrative_score}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="bg-[#0D0F13] rounded-xl p-3.5 border border-white/[0.04]">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">Dominant Public Narrative</p>
          <p className="text-[12px] text-white/70 leading-relaxed">{PUBLIC_NARRATIVE.dominant_narrative}</p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2.5">Narrative Themes</p>
          <div className="space-y-2">
            {PUBLIC_NARRATIVE.themes.map(t => (
              <div key={t.theme} className="flex items-start gap-3 bg-[#0D0F13] rounded-xl px-3.5 py-3 border border-white/[0.04] hover:border-white/[0.07] transition-all">
                <div className="flex items-center gap-2 w-48 shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: strengthColor[t.strength] ?? '#6B7280' }} />
                  <span className="text-[11px] font-semibold text-white/70">{t.theme}</span>
                </div>
                <div className="flex items-center gap-2 w-32 shrink-0">
                  <PillBadge label={t.strength} color={strengthColor[t.strength] ?? '#6B7280'} />
                  <PillBadge label={t.sentiment} color={SENTIMENT_COLOR[t.sentiment]} />
                </div>
                <p className="text-[10.5px] text-white/35 leading-snug flex-1">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[#0D0F13] rounded-xl p-4 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-3.5 h-3.5 text-[#06B6D4]" />
              <p className="text-[10.5px] font-semibold text-white/65">Google Knowledge Panel</p>
              <PillBadge label={PUBLIC_NARRATIVE.knowledge_panel.status} color="#10B981" />
            </div>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#06B6D4]" style={{ width: `${PUBLIC_NARRATIVE.knowledge_panel.completeness}%` }} />
              </div>
              <span className="text-[11px] font-bold text-[#06B6D4]">{PUBLIC_NARRATIVE.knowledge_panel.completeness}%</span>
            </div>
            {PUBLIC_NARRATIVE.knowledge_panel.issues.map((iss, i) => (
              <div key={i} className="flex items-start gap-1.5 mt-1.5">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/35">{iss}</p>
              </div>
            ))}
          </div>
          <div className="bg-[#0D0F13] rounded-xl p-4 border border-white/[0.04]">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-3.5 h-3.5 text-[#A3E635]" />
              <p className="text-[10.5px] font-semibold text-white/65">Wikipedia</p>
              <PillBadge label={PUBLIC_NARRATIVE.wikipedia.status} color="#10B981" />
              <PillBadge label={PUBLIC_NARRATIVE.wikipedia.quality} color="#A3E635" />
            </div>
            <p className="text-[9.5px] font-mono text-white/20 mb-2.5">Last edited: {PUBLIC_NARRATIVE.wikipedia.last_edited}</p>
            {PUBLIC_NARRATIVE.wikipedia.issues.map((iss, i) => (
              <div key={i} className="flex items-start gap-1.5 mt-1.5">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B] shrink-0 mt-0.5" />
                <p className="text-[10px] text-white/35">{iss}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WATCHER: CATALOG VISIBILITY ───────────────────────────────────────────────

function CatalogVisibilityWatcher() {
  const syncStatusColor: Record<string, string> = { cleared: '#10B981', in_nego: '#06B6D4', submitted: '#F59E0B' };
  const syncStatusLabel: Record<string, string> = { cleared: 'Cleared', in_nego: 'In Negotiation', submitted: 'Submitted' };
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#3B82F6]/10 border border-[#3B82F6]/20">
          <Eye className="w-3.5 h-3.5 text-[#3B82F6]" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white/80">Catalog Visibility Tracker</p>
          <p className="text-[9px] font-mono text-white/25">DSP editorial + sync presence</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[8.5px] font-mono text-white/20 uppercase">Editorial Score</p>
            <p className="text-[16px] font-bold text-[#3B82F6]">{CATALOG_VISIBILITY.dsp_editorial_score}</p>
          </div>
          <div className="text-right">
            <p className="text-[8.5px] font-mono text-white/20 uppercase">Playlist Reach</p>
            <p className="text-[16px] font-bold text-[#10B981]">{CATALOG_VISIBILITY.playlist_reach}</p>
          </div>
        </div>
      </div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">DSP Editorial Presence</p>
          <div className="space-y-2">
            {CATALOG_VISIBILITY.items.map(item => (
              <div key={item.platform} className="flex items-center gap-3 bg-[#0D0F13] rounded-xl px-3.5 py-3 border border-white/[0.04]">
                <StatusDot status={item.status} />
                <div className="w-28 shrink-0">
                  <p className="text-[11.5px] font-medium text-white/70">{item.platform}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] text-white/30 leading-snug">{item.note}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  {item.editorial && <PillBadge label="Editorial" color="#3B82F6" />}
                  <span className="text-[10.5px] font-bold text-white/50 font-mono">{item.placements}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Active Sync Pipeline</p>
          <div className="space-y-2">
            {CATALOG_VISIBILITY.sync_activity.map((s, i) => (
              <div key={i} className="bg-[#0D0F13] rounded-xl px-3.5 py-3 border border-white/[0.04]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11.5px] font-medium text-white/70 truncate pr-2">{s.project}</p>
                  <PillBadge label={syncStatusLabel[s.status]} color={syncStatusColor[s.status]} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-mono text-white/30">"{s.track}"</span>
                  <span className="text-[9px] text-white/20">·</span>
                  <span className="text-[9px] font-mono text-white/20">{s.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WATCHER: BRAND REHAB ──────────────────────────────────────────────────────

function BrandRehabWatcher() {
  const prColor: Record<string, string> = { high: '#F59E0B', medium: '#06B6D4', low: '#6B7280', critical: '#EF4444' };
  const stColor: Record<string, string> = { open: '#EF4444', monitor: '#F59E0B', resolved: '#10B981' };
  const stLabel: Record<string, string> = { open: 'Open', monitor: 'Monitor', resolved: 'Resolved' };
  const StIcon = ({ st }: { st: string }) =>
    st === 'open' ? <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" /> :
    st === 'monitor' ? <Eye className="w-3.5 h-3.5 text-[#F59E0B]" /> :
    <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />;

  const open = BRAND_REHAB.items.filter(i => i.status === 'open').length;
  const monitor = BRAND_REHAB.items.filter(i => i.status === 'monitor').length;
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#10B981]/10 border border-[#10B981]/20">
          <Shield className="w-3.5 h-3.5 text-[#10B981]" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-semibold text-white/80">Brand Rehab Tracker</p>
          <p className="text-[9px] font-mono text-white/25">{open} open · {monitor} monitoring · Risk level: {BRAND_REHAB.risk_level}</p>
        </div>
        <PillBadge label={`Risk: ${BRAND_REHAB.risk_level}`} color="#10B981" />
      </div>
      <div className="divide-y divide-white/[0.04]">
        {BRAND_REHAB.items.map((item, i) => (
          <div key={i} className="px-5 py-3.5 flex items-start gap-4 hover:bg-white/[0.018] transition-colors">
            <StIcon st={item.status} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <p className="text-[12px] font-semibold text-white/75">{item.issue}</p>
                <PillBadge label={stLabel[item.status]} color={stColor[item.status]} />
                <PillBadge label={item.priority} color={prColor[item.priority]} />
              </div>
              <p className="text-[10.5px] text-white/35 leading-relaxed">{item.action}</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/15 shrink-0 mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── RECOMMENDATIONS ───────────────────────────────────────────────────────────

function Recommendations() {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-3.5 h-3.5 text-[#EC4899]" />
        <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest">Recommended Actions</p>
        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EC4899]/10 text-[#EC4899] border border-[#EC4899]/20 ml-1">{RECOMMENDATIONS.length} actions</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {RECOMMENDATIONS.map(r => {
          const Icon = r.icon;
          const uc = URGENCY_COLOR[r.urgency];
          return (
            <div key={r.id} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 flex gap-4 hover:border-white/[0.10] transition-all">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${r.color}12`, border: `1px solid ${r.color}22` }}>
                <Icon className="w-4 h-4" style={{ color: r.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[12.5px] font-semibold text-white/85 leading-snug">{r.title}</p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <PillBadge label={r.category} color={r.color} />
                    <PillBadge label={r.urgency} color={uc} />
                  </div>
                </div>
                <p className="text-[11px] text-white/40 leading-relaxed mb-2">{r.body}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-white/20" />
                    <span className="text-[9.5px] font-mono text-white/30">{r.owner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-white/20" />
                    <span className="text-[9.5px] font-mono text-white/30">{r.est_effort}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

type TabId = 'score' | 'watchers' | 'recommendations';

export default function COSBrand() {
  const [activeTab, setActiveTab] = useState<TabId>('score');

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'score',           label: 'Brand Score',    icon: BarChart2   },
    { id: 'watchers',        label: 'Watcher Modules', icon: Eye         },
    { id: 'recommendations', label: 'Recommendations', icon: Target      },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Star}
        title="Brand Health"
        subtitle="Visibility, sentiment, reputation, cultural presence, and rehab opportunities"
        accentColor={ACCENT}
        badge="Score 78"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#EC4899]/25 bg-[#EC4899]/[0.07] text-[10.5px] text-[#EC4899] hover:bg-[#EC4899]/[0.12] transition-all">
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <ArrowUpRight className="w-3 h-3" />
              Export
            </button>
          </div>
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
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-medium transition-all border-b-2 -mb-[1px]"
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

        {/* ══ BRAND SCORE TAB ══ */}
        {activeTab === 'score' && (
          <>
            <ScorePanel />
            {/* Quick status bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Press Activity',  value: '6 placements',     color: '#F59E0B', sub: 'Last 30 days',         icon: Newspaper   },
                { label: 'Site Visits',     value: fmtNum(142_000),    color: '#06B6D4', sub: '+22% MoM',             icon: Globe       },
                { label: 'Sync Cleared',    value: '2 placements',     color: '#10B981', sub: '2 in pipeline',        icon: CheckCircle },
                { label: 'Open Rehab',      value: '4 issues',         color: '#EF4444', sub: '2 monitoring',         icon: AlertTriangle },
              ].map(m => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${m.color}12`, border: `1px solid ${m.color}20` }}>
                      <Icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{m.label}</p>
                      <p className="text-[15px] font-bold" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-[9px] font-mono text-white/20">{m.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══ WATCHERS TAB ══ */}
        {activeTab === 'watchers' && (
          <>
            <PressWatcher />
            <SocialWatcher />
            <SiteWatcher />
            <NarrativeWatcher />
            <CatalogVisibilityWatcher />
            <BrandRehabWatcher />
          </>
        )}

        {/* ══ RECOMMENDATIONS TAB ══ */}
        {activeTab === 'recommendations' && (
          <>
            {/* Urgency alert */}
            <div className="bg-[#EF4444]/[0.05] border border-[#EF4444]/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
              <p className="text-[11.5px] text-[#EF4444]/80 font-medium">
                1 critical action (broken mobile store link) + 3 high-priority actions need execution before the next campaign window.
              </p>
            </div>
            <Recommendations />
          </>
        )}

      </div>
    </div>
  );
}
