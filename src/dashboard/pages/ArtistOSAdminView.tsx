import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Zap, Send, BarChart2, RefreshCcw, Shield, ArrowUpRight, ArrowDownRight, Trophy, Target, Flame, ChevronUp, ChevronDown, Award } from 'lucide-react';
import { SIGNED_ARTISTS } from '../data/artistRosterData';
import { SYSTEM_UPDATES, PRIORITY_META } from '../data/updatesData';
import { getActiveArtists } from '../data/dropArtistService';

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

type SortMetric = 'streams' | 'revenue' | 'growth' | 'roi' | 'health';

const METRIC_META: Record<SortMetric, { label: string; color: string; shortLabel: string }> = {
  streams: { label: 'Monthly Listeners', color: '#06B6D4', shortLabel: 'Listeners' },
  revenue: { label: 'YTD Revenue',       color: '#10B981', shortLabel: 'Revenue'   },
  growth:  { label: 'Growth Velocity',   color: '#F59E0B', shortLabel: 'Growth'    },
  roi:     { label: 'ROI (YTD)',          color: '#EF4444', shortLabel: 'ROI'       },
  health:  { label: 'Health Score',      color: '#8B5CF6', shortLabel: 'Health'    },
};

function parseDelta(delta: string): number {
  const cleaned = delta.replace(/[^0-9.-]/g, '');
  const val = parseFloat(cleaned) || 0;
  return delta.startsWith('-') ? -val : val;
}

const OPEN_TASKS = [
  { title: 'Mon Rovia — Manager Assignment Needed', owner: 'Unassigned', priority: 'urgent', artist: 'AOS-005' },
  { title: 'Lila Daye — Vocal Production Budget Approval', owner: 'Alex Kim', priority: 'high', artist: 'AOS-003' },
  { title: 'Cato Strand — Q3 Single Pre-Production Plan', owner: 'Alex Kim', priority: 'normal', artist: 'AOS-006' },
  { title: 'Sung Holly — TikTok Strategy Session', owner: 'Dana Reeves', priority: 'normal', artist: 'AOS-007' },
  { title: 'ZEAL — Brazil Geo Campaign Launch', owner: 'Dana Reeves', priority: 'high', artist: 'AOS-001' },
];

const TEAM_MEMBERS = [
  { name: 'Dana Reeves', role: 'Artist Services Lead', artists: ['AOS-001', 'AOS-004', 'AOS-007'], openTasks: 3, dept: 'Artist Services' },
  { name: 'Alex Kim', role: 'A&R / Operations', artists: ['AOS-003', 'AOS-005', 'AOS-006'], openTasks: 4, dept: 'Operations' },
  { name: 'Marcus Webb', role: 'Manager — Lila Daye', artists: ['AOS-003'], openTasks: 1, dept: 'Management' },
  { name: 'Jamie Torres', role: 'Manager — Mako Sol', artists: ['AOS-002'], openTasks: 0, dept: 'Management' },
];

export default function ArtistOSAdminView() {
  const navigate = useNavigate();
  const [broadcastScope, setBroadcastScope] = useState('full_roster');
  const [broadcastText, setBroadcastText] = useState('');
  const [sortMetric, setSortMetric] = useState<SortMetric>('streams');
  const [topN, setTopN] = useState(8);

  const activeRoster = useMemo(() => getActiveArtists(SIGNED_ARTISTS), []);

  const totalListeners = activeRoster.reduce((s, a) => s + a.monthlyListeners, 0);
  const totalRevenue = activeRoster.reduce((s, a) => s + a.financials.ytdRevenue, 0);
  const totalInvestment = activeRoster.reduce((s, a) => s + a.financials.totalInvestment.ytd, 0);
  const totalBalance = activeRoster.reduce((s, a) => s + a.financials.recoupableBalance, 0);
  const urgentUpdates = SYSTEM_UPDATES.filter(u => u.priority === 'urgent' || u.priority === 'high');
  const blockedArtists = activeRoster.filter(a => a.status === 'Recouping' || a.healthScore < 60);

  const artistsWithROI = useMemo(() => activeRoster.map(a => {
    const roi = a.financials.totalInvestment.ytd > 0
      ? (a.financials.ytdRevenue / a.financials.totalInvestment.ytd)
      : 0;
    const growthVal = parseDelta(a.streamingDelta);
    return { ...a, roi, growthVal };
  }), []);

  const topArtists = useMemo(() => {
    const sorted = [...artistsWithROI].sort((a, b) => {
      if (sortMetric === 'streams')  return b.monthlyListeners - a.monthlyListeners;
      if (sortMetric === 'revenue')  return b.financials.ytdRevenue - a.financials.ytdRevenue;
      if (sortMetric === 'growth')   return b.growthVal - a.growthVal;
      if (sortMetric === 'roi')      return b.roi - a.roi;
      if (sortMetric === 'health')   return b.healthScore - a.healthScore;
      return 0;
    });
    return sorted.slice(0, topN);
  }, [artistsWithROI, sortMetric, topN]);

  const bestCampaignArtist = useMemo(() =>
    [...artistsWithROI].sort((a, b) => b.financials.ytdRevenue - a.financials.ytdRevenue)[0],
  [artistsWithROI]);

  const highestROIArtist = useMemo(() =>
    [...artistsWithROI].sort((a, b) => b.roi - a.roi)[0],
  [artistsWithROI]);

  const fastestGrowthArtist = useMemo(() =>
    [...artistsWithROI].sort((a, b) => b.growthVal - a.growthVal)[0],
  [artistsWithROI]);

  const totalRosterGrowthPct = useMemo(() => {
    const vals = activeRoster.map(a => parseDelta(a.streamingDelta));
    const avg = vals.reduce((s, v) => s + v, 0) / Math.max(vals.length, 1);
    return avg;
  }, [activeRoster]);

  const maxMetricVal = useMemo(() => {
    if (sortMetric === 'streams')  return Math.max(...topArtists.map(a => a.monthlyListeners), 1);
    if (sortMetric === 'revenue')  return Math.max(...topArtists.map(a => a.financials.ytdRevenue), 1);
    if (sortMetric === 'growth')   return Math.max(...topArtists.map(a => Math.abs(a.growthVal)), 1);
    if (sortMetric === 'roi')      return Math.max(...topArtists.map(a => a.roi), 1);
    if (sortMetric === 'health')   return 100;
    return 1;
  }, [topArtists, sortMetric]);

  return (
    <div className="p-5 space-y-6 min-h-full bg-[#08090B]">

      {/* Admin header */}
      <div className="bg-[#0D0E11] border border-[#F59E0B]/15 rounded-xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/12 border border-[#F59E0B]/25 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-bold text-white tracking-tight">Admin Operations View</h1>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded border text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20">
                ADMIN
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/25 mt-0.5">
              Full roster access · {activeRoster.length} active artists · Internal GMG view
            </p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#EF4444]">{urgentUpdates.length}</p>
              <p className="text-[9px] font-mono text-white/25">Urgent Items</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#F59E0B]">{OPEN_TASKS.length}</p>
              <p className="text-[9px] font-mono text-white/25">Open Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#06B6D4]">{activeRoster.length}</p>
              <p className="text-[9px] font-mono text-white/25">Active Artists</p>
            </div>
          </div>
        </div>
      </div>

      {/* System KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: Users,        label: 'Total Listeners',    value: fmt(totalListeners),       color: '#06B6D4', sub: 'Monthly · All roster' },
          { icon: TrendingUp,   label: 'YTD Revenue',        value: fmtMoney(totalRevenue),    color: '#10B981', sub: 'Aggregate roster' },
          { icon: TrendingDown, label: 'YTD Investment',     value: fmtMoney(totalInvestment), color: '#EF4444', sub: 'Marketing + ops' },
          { icon: RefreshCcw,   label: 'Total Recoup Bal.',  value: fmtMoney(totalBalance),    color: '#F59E0B', sub: 'Outstanding advances' },
        ].map(item => (
          <div key={item.label} className="bg-[#0D0E11] border border-white/[0.07] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
              </div>
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-[22px] font-bold leading-none" style={{ color: item.color }}>{item.value}</p>
            <p className="text-[10px] text-white/25 mt-1.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Open Tasks */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Open Tasks</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
              {OPEN_TASKS.length} open
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {OPEN_TASKS.map((task, i) => {
              const artist = SIGNED_ARTISTS.find(a => a.id === task.artist);
              const pm = PRIORITY_META[task.priority as keyof typeof PRIORITY_META];
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => artist && navigate(`/dashboard/artist-os/roster/${artist.id}`)}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border"
                    style={{ background: `${artist?.avatarColor ?? '#06B6D4'}18`, borderColor: `${artist?.avatarColor ?? '#06B6D4'}30` }}>
                    <span className="text-[8px] font-bold" style={{ color: artist?.avatarColor ?? '#06B6D4' }}>{artist?.avatarInitials ?? 'OS'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/70 truncate">{task.title}</p>
                    <p className="text-[9px] font-mono text-white/25 mt-0.5">{task.owner}</p>
                  </div>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${pm.bg} ${pm.border}`} style={{ color: pm.color }}>
                    {pm.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Assignments */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Team Assignments</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TEAM_MEMBERS.map((member, i) => {
              const assignedArtists = SIGNED_ARTISTS.filter(a => member.artists.includes(a.id));
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.10] flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-white/50">{member.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-semibold text-white/80">{member.name}</p>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/25 border border-white/[0.07]">
                        {member.dept}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/30 mt-0.5 mb-1.5">{member.role}</p>
                    <div className="flex items-center gap-1 flex-wrap">
                      {assignedArtists.map(a => (
                        <span
                          key={a.id}
                          onClick={e => { e.stopPropagation(); navigate(`/dashboard/artist-os/roster/${a.id}`); }}
                          className="text-[8px] font-mono px-1.5 py-0.5 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                          style={{ color: a.avatarColor, background: `${a.avatarColor}14`, borderColor: `${a.avatarColor}25` }}
                        >
                          {a.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  {member.openTasks > 0 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20 shrink-0">
                      {member.openTasks} tasks
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Intelligence Snapshot ── */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
          <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Intelligence Snapshot</span>
          <span className="ml-2 text-[9px] font-mono text-white/20">Live · Roster aggregate</span>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-0 divide-y xl:divide-y-0 xl:divide-x divide-white/[0.04]">

          {/* Total roster growth */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#10B981]/10 border border-[#10B981]/20">
                <TrendingUp className="w-3 h-3 text-[#10B981]" />
              </div>
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Avg Roster Growth</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className={`text-[22px] font-bold leading-none ${totalRosterGrowthPct >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {totalRosterGrowthPct >= 0 ? '+' : ''}{totalRosterGrowthPct.toFixed(1)}%
              </span>
              {totalRosterGrowthPct >= 0
                ? <ArrowUpRight className="w-4 h-4 text-[#10B981]" />
                : <ArrowDownRight className="w-4 h-4 text-[#EF4444]" />
              }
            </div>
            <p className="text-[10px] text-white/20">Streaming delta · Avg across {activeRoster.length} active artists</p>
          </div>

          {/* Best performing campaign */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#06B6D4]/10 border border-[#06B6D4]/20">
                <Trophy className="w-3 h-3 text-[#06B6D4]" />
              </div>
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Top Revenue Artist</span>
            </div>
            {bestCampaignArtist && (
              <>
                <div
                  className="flex items-center gap-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/dashboard/artist-os/roster/${bestCampaignArtist.id}`)}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center border" style={{ background: `${bestCampaignArtist.avatarColor}18`, borderColor: `${bestCampaignArtist.avatarColor}30` }}>
                    <span className="text-[7px] font-bold" style={{ color: bestCampaignArtist.avatarColor }}>{bestCampaignArtist.avatarInitials}</span>
                  </div>
                  <span className="text-[13px] font-bold text-white/80">{bestCampaignArtist.name}</span>
                </div>
                <p className="text-[18px] font-bold text-[#06B6D4] leading-none mb-1">{fmtMoney(bestCampaignArtist.financials.ytdRevenue)}</p>
                <p className="text-[10px] text-white/20">YTD revenue · {bestCampaignArtist.genre.split(' · ')[0]}</p>
              </>
            )}
          </div>

          {/* Highest ROI */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#EF4444]/10 border border-[#EF4444]/20">
                <Target className="w-3 h-3 text-[#EF4444]" />
              </div>
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Highest ROI Artist</span>
            </div>
            {highestROIArtist && (
              <>
                <div
                  className="flex items-center gap-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/dashboard/artist-os/roster/${highestROIArtist.id}`)}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center border" style={{ background: `${highestROIArtist.avatarColor}18`, borderColor: `${highestROIArtist.avatarColor}30` }}>
                    <span className="text-[7px] font-bold" style={{ color: highestROIArtist.avatarColor }}>{highestROIArtist.avatarInitials}</span>
                  </div>
                  <span className="text-[13px] font-bold text-white/80">{highestROIArtist.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <p className="text-[18px] font-bold text-[#EF4444] leading-none">
                    {highestROIArtist.roi >= 1 ? `${highestROIArtist.roi.toFixed(1)}x` : `${(highestROIArtist.roi * 100).toFixed(0)}¢/$1`}
                  </p>
                </div>
                <p className="text-[10px] text-white/20">Return on investment · YTD</p>
              </>
            )}
          </div>

          {/* Fastest growth */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                <Award className="w-3 h-3 text-[#F59E0B]" />
              </div>
              <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Fastest Growing</span>
            </div>
            {fastestGrowthArtist && (
              <>
                <div
                  className="flex items-center gap-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate(`/dashboard/artist-os/roster/${fastestGrowthArtist.id}`)}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center border" style={{ background: `${fastestGrowthArtist.avatarColor}18`, borderColor: `${fastestGrowthArtist.avatarColor}30` }}>
                    <span className="text-[7px] font-bold" style={{ color: fastestGrowthArtist.avatarColor }}>{fastestGrowthArtist.avatarInitials}</span>
                  </div>
                  <span className="text-[13px] font-bold text-white/80">{fastestGrowthArtist.name}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <p className="text-[18px] font-bold text-[#F59E0B] leading-none">
                    {fastestGrowthArtist.streamingDelta}
                  </p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
                <p className="text-[10px] text-white/20">Streaming delta · {fastestGrowthArtist.genre.split(' · ')[0]}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Top Performing Artists ── */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05] flex-wrap">
          <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Top Performing Artists</span>

          {/* Metric selector */}
          <div className="flex items-center gap-1 ml-3">
            {(Object.keys(METRIC_META) as SortMetric[]).map(m => (
              <button
                key={m}
                onClick={() => setSortMetric(m)}
                className="px-2.5 py-1 rounded-md text-[8px] font-mono transition-all"
                style={{
                  background: sortMetric === m ? `${METRIC_META[m].color}14` : 'transparent',
                  border: sortMetric === m ? `1px solid ${METRIC_META[m].color}30` : '1px solid transparent',
                  color: sortMetric === m ? METRIC_META[m].color : 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                }}
              >
                {METRIC_META[m].shortLabel}
              </button>
            ))}
          </div>

          {/* Top N selector */}
          <div className="flex items-center gap-1 ml-2">
            {[5, 8, 10].map(n => (
              <button
                key={n}
                onClick={() => setTopN(n)}
                className="px-2 py-1 rounded text-[8px] font-mono transition-all"
                style={{
                  background: topN === n ? 'rgba(255,255,255,0.07)' : 'transparent',
                  border: topN === n ? '1px solid rgba(255,255,255,0.14)' : '1px solid transparent',
                  color: topN === n ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }}
              >
                Top {n}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[9px] font-mono text-white/20">
            Ranked by {METRIC_META[sortMetric].label}
          </div>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-0 px-5 py-2 bg-black/10 border-b border-white/[0.03]">
          <div className="w-7 shrink-0" />
          <div className="w-7 shrink-0" />
          <div className="flex-1 min-w-0 text-[8px] font-mono text-white/20 uppercase tracking-wider">Artist</div>
          <div className="w-24 shrink-0 text-[8px] font-mono text-white/20 uppercase tracking-wider text-right">Listeners</div>
          <div className="w-24 shrink-0 text-[8px] font-mono text-white/20 uppercase tracking-wider text-right">YTD Rev</div>
          <div className="w-20 shrink-0 text-[8px] font-mono text-white/20 uppercase tracking-wider text-right">Growth</div>
          <div className="w-16 shrink-0 text-[8px] font-mono text-white/20 uppercase tracking-wider text-right">Health</div>
          <div className="w-40 shrink-0 text-[8px] font-mono text-white/20 uppercase tracking-wider pl-4">Metric Bar</div>
        </div>

        <div className="divide-y divide-white/[0.03]">
          {topArtists.map((artist, idx) => {
            const metricColor = METRIC_META[sortMetric].color;
            const metricVal = sortMetric === 'streams' ? artist.monthlyListeners
              : sortMetric === 'revenue' ? artist.financials.ytdRevenue
              : sortMetric === 'growth'  ? Math.abs(artist.growthVal)
              : sortMetric === 'roi'     ? artist.roi
              : artist.healthScore;
            const barPct = maxMetricVal > 0 ? Math.min((metricVal / maxMetricVal) * 100, 100) : 0;
            const metricDisplay = sortMetric === 'streams' ? fmt(artist.monthlyListeners)
              : sortMetric === 'revenue' ? fmtMoney(artist.financials.ytdRevenue)
              : sortMetric === 'growth'  ? artist.streamingDelta
              : sortMetric === 'roi'     ? (artist.roi >= 1 ? `${artist.roi.toFixed(1)}x` : `${(artist.roi * 100).toFixed(0)}¢`)
              : `${artist.healthScore}`;
            const growthPositive = !artist.streamingDelta.startsWith('-');
            const healthColor = artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444';
            const rankMedal = idx === 0 ? '#F59E0B' : idx === 1 ? '#9CA3AF' : idx === 2 ? '#F97316' : null;

            return (
              <div
                key={artist.id}
                className="flex items-center gap-0 px-5 py-3 hover:bg-white/[0.025] transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
              >
                {/* Rank */}
                <div className="w-7 shrink-0">
                  {rankMedal ? (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${rankMedal}15`, border: `1px solid ${rankMedal}35` }}>
                      <span className="text-[8px] font-bold" style={{ color: rankMedal }}>{idx + 1}</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-mono text-white/20">{idx + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-7 shrink-0">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center border" style={{ background: `${artist.avatarColor}18`, borderColor: `${artist.avatarColor}30` }}>
                    <span className="text-[7px] font-bold" style={{ color: artist.avatarColor }}>{artist.avatarInitials}</span>
                  </div>
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-white/80 truncate">{artist.name}</span>
                    <span className="text-[7px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{
                      background: `${artist.avatarColor}12`,
                      border: `1px solid ${artist.avatarColor}25`,
                      color: artist.avatarColor,
                    }}>{artist.status}</span>
                  </div>
                  <p className="text-[9px] font-mono text-white/20 truncate">{artist.genre} • {artist.market} • {artist.labelImprint || 'Independent'}</p>
                </div>

                {/* Listeners */}
                <div className="w-24 shrink-0 text-right">
                  <span className="text-[11px] font-mono text-white/55">{fmt(artist.monthlyListeners)}</span>
                </div>

                {/* YTD Revenue */}
                <div className="w-24 shrink-0 text-right">
                  <span className="text-[11px] font-mono text-[#10B981]">{fmtMoney(artist.financials.ytdRevenue)}</span>
                </div>

                {/* Growth */}
                <div className="w-20 shrink-0 text-right flex items-center justify-end gap-1">
                  {growthPositive
                    ? <ChevronUp className="w-3 h-3 text-[#10B981] shrink-0" />
                    : <ChevronDown className="w-3 h-3 text-[#EF4444] shrink-0" />
                  }
                  <span className={`text-[11px] font-mono ${growthPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {artist.streamingDelta}
                  </span>
                </div>

                {/* Health */}
                <div className="w-16 shrink-0 text-right">
                  <span className="text-[12px] font-bold" style={{ color: healthColor }}>{artist.healthScore}</span>
                </div>

                {/* Bar */}
                <div className="w-40 shrink-0 pl-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${barPct}%`,
                          background: `linear-gradient(90deg,${metricColor}60,${metricColor})`,
                          boxShadow: `0 0 6px ${metricColor}40`,
                        }}
                      />
                    </div>
                    <span className="text-[8px] font-mono shrink-0 w-10 text-right" style={{ color: metricColor }}>
                      {metricDisplay}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster health overview */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
          <BarChart2 className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Full Roster Health</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.04]">
          {[...activeRoster].sort((a, b) => b.healthScore - a.healthScore).map(artist => (
            <div
              key={artist.id}
              className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center border"
                  style={{ background: `${artist.avatarColor}20`, borderColor: `${artist.avatarColor}35` }}>
                  <span className="text-[9px] font-bold" style={{ color: artist.avatarColor }}>{artist.avatarInitials}</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-white/80">{artist.name}</p>
                  <p className="text-[9px] font-mono text-white/25">{artist.status}</p>
                </div>
                <span className="ml-auto text-[12px] font-bold" style={{ color: artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444' }}>
                  {artist.healthScore}
                </span>
              </div>
              <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${artist.healthScore}%`,
                  background: artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444',
                }} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] font-mono text-white/25">{fmt(artist.monthlyListeners)} listeners</span>
                <span className={`text-[9px] font-mono ${artist.streamingDelta.startsWith('+') ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {artist.streamingDelta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast / Update Tool */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Send className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Broadcast Update</span>
          <span className="ml-2 text-[9px] font-mono text-[#F59E0B]/50">Admin Only</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">Recipient Scope</p>
            <select
              value={broadcastScope}
              onChange={e => setBroadcastScope(e.target.value)}
              className="w-full bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white/60 outline-none"
            >
              <option value="full_roster">Full Roster</option>
              <option value="single_artist">Single Artist</option>
              <option value="single_label">Single Label</option>
              <option value="internal_team">Internal Team Only</option>
              <option value="selected_artists">Selected Artists</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-2">Message</p>
            <div className="flex gap-2">
              <textarea
                value={broadcastText}
                onChange={e => setBroadcastText(e.target.value)}
                placeholder="Write update message..."
                rows={2}
                className="flex-1 bg-black/30 border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white/60 outline-none resize-none placeholder:text-white/20"
              />
              <button
                onClick={() => setBroadcastText('')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F59E0B]/12 border border-[#F59E0B]/25 text-[#F59E0B] text-[11px] font-semibold hover:bg-[#F59E0B]/20 transition-all self-end h-10 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent system updates — internal view */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
          <Zap className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Recent System Updates</span>
          <span className="ml-auto text-[9px] font-mono text-white/20">{SYSTEM_UPDATES.length} total</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {SYSTEM_UPDATES.slice(0, 5).map(update => {
            const pm = PRIORITY_META[update.priority];
            return (
              <div key={update.id} className="flex items-start gap-3 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${pm.bg} ${pm.border}`} style={{ color: pm.color }}>
                  {pm.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/75 font-medium truncate">{update.title}</p>
                  <p className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{update.body}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[9px] font-mono text-white/20">{update.author}</span>
                    <span className="text-[9px] font-mono text-white/15">
                      {new Date(update.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]">
                      {update.scope.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
