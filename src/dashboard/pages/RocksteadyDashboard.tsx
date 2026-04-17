import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio, TrendingUp, Users, Globe, Clock, AlertTriangle,
  MapPin, ChevronRight, Zap, Activity, Network, Map, Radar,
  X, ArrowUpRight, Star, FileText
} from 'lucide-react';
import { ARTISTS, SIGNALS, ALERTS, SCOUT_REPORTS, MAP_NODES } from '../data/rocksteadyData';
import { ParagonReportPanel } from '../components/rocksteady/ParagonReportPanel';
import ActionableDiscoveries from '../components/rocksteady/ActionableDiscoveries';
import SigningWorkflowSummary from '../components/rocksteady/SigningWorkflowSummary';

const STATUS_STYLE = {
  breaking: { pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25',  dot: 'bg-[#EF4444] animate-pulse' },
  rising:   { pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',  dot: 'bg-[#F59E0B]'              },
  watch:    { pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20',  dot: 'bg-[#06B6D4]'              },
};
const REC_STYLE = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/30 border-white/10',
};
const ALERT_STYLE = {
  critical: { border: 'border-l-[#EF4444]', dot: 'bg-[#EF4444] animate-pulse', pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25' },
  high:     { border: 'border-l-[#F59E0B]', dot: 'bg-[#F59E0B]',               pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' },
  medium:   { border: 'border-l-[#06B6D4]', dot: 'bg-[#06B6D4]',               pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20' },
};

const SCOUTS = [
  { id: 'SC-00', name: 'Paragon', tier: 'Elite',  region: 'Global — All Markets',    liveSignals: 24, todayReport: true,  discoveries7d: 8, accuracy: 98, primary: true  },
  { id: 'SC-01', name: 'Nova',    tier: 'Elite',  region: 'West Coast / Global',     liveSignals: 14, todayReport: true,  discoveries7d: 4, accuracy: 94, primary: false },
  { id: 'SC-02', name: 'Rift',    tier: 'Elite',  region: 'New York / Global',       liveSignals: 16, todayReport: true,  discoveries7d: 5, accuracy: 96, primary: false },
  { id: 'SC-03', name: 'Flare',   tier: 'Elite',  region: 'Atlanta / Southeast',     liveSignals: 11, todayReport: false, discoveries7d: 5, accuracy: 91, primary: false },
  { id: 'SC-04', name: 'Drift',   tier: 'Elite',  region: 'Europe · Berlin · Paris', liveSignals: 9,  todayReport: true,  discoveries7d: 3, accuracy: 89, primary: false },
  { id: 'SC-05', name: 'Vibe',    tier: 'Elite',  region: 'Miami · Latin Markets',   liveSignals: 7,  todayReport: true,  discoveries7d: 2, accuracy: 84, primary: false },
  { id: 'SC-06', name: 'Prism',   tier: 'Master', region: 'Lagos · London · Accra',  liveSignals: 12, todayReport: true,  discoveries7d: 6, accuracy: 87, primary: false },
  { id: 'SC-07', name: 'Nexus',   tier: 'Master', region: 'Nashville · Austin',      liveSignals: 4,  todayReport: true,  discoveries7d: 1, accuracy: 82, primary: false },
  { id: 'SC-08', name: 'Cipher',  tier: 'Master', region: 'London · Manchester',     liveSignals: 5,  todayReport: false, discoveries7d: 1, accuracy: 76, primary: false },
  { id: 'SC-09', name: 'Halo',    tier: 'Master', region: 'Seoul · Tokyo · Sydney',  liveSignals: 6,  todayReport: false, discoveries7d: 2, accuracy: 79, primary: false },
  { id: 'SC-10', name: 'Blaze',   tier: 'Master', region: 'Chicago · Detroit',       liveSignals: 3,  todayReport: false, discoveries7d: 1, accuracy: 71, primary: false },
];

const ACTIVITY = [
  { id: 'AC1', type: 'scout',   text: 'Paragon filed daily report — Zaylevelten breakout signal confirmed, immediate action window open',  ts: 'just now', color: '#EF4444' },
  { id: 'AC2', type: 'signal',  text: 'Paragon: Gigi Perez 1B streams benchmark confirmed — viral-to-major pipeline model validated',       ts: '12m ago',  color: '#F59E0B' },
  { id: 'AC3', type: 'artist',  text: 'Paragon: Lamb flagged — Drake, SZA, Russ co-signs detected, pre-viral window open',                  ts: '34m ago',  color: '#10B981' },
  { id: 'AC4', type: 'market',  text: 'Paragon: Africa market acceleration — Afro-fusion pipeline expanding across Nigeria, Ghana, UK',      ts: '1h ago',   color: '#06B6D4' },
  { id: 'AC5', type: 'scout',   text: 'Paragon: Mon Rovia at 2.4M monthly listeners — touring momentum, unsigned opportunity window',        ts: '2h ago',   color: '#10B981' },
  { id: 'AC6', type: 'signal',  text: 'Paragon archetype scan: LA sweep — Nessa Barrett (88), Anneth (86), Chloe Tang (84) flagged',        ts: '4h ago',   color: '#F59E0B' },
  { id: 'AC7', type: 'artist',  text: 'Paragon: 2hollis and Bella Kay pipeline trajectories confirm TikTok-to-chart model efficiency',       ts: '5h ago',   color: '#06B6D4' },
  { id: 'AC8', type: 'system',  text: 'AI scoring model refreshed — 8 artists re-ranked based on Paragon daily intelligence input',          ts: '6h ago',   color: '#10B981' },
];

const HEALTH = [
  { label: 'Rocksteady Engine', pct: 100, color: '#10B981' },
  { label: 'Scout Signal Feed',  pct: 98,  color: '#10B981' },
  { label: 'Discovery Radar',    pct: 100, color: '#10B981' },
  { label: 'Heatmap Indexing',   pct: 94,  color: '#10B981' },
  { label: 'AI Scoring API',     pct: 87,  color: '#F59E0B' },
];

const RADAR_SIGNALS = [
  { label: 'TikTok spikes detected',   value: '14',  delta: '+3 in 1h', color: '#EF4444' },
  { label: 'Streaming accelerations',  value: '8',   delta: '+1 today', color: '#F59E0B' },
  { label: 'Scout confirmations',      value: '5',   delta: 'today',    color: '#10B981' },
  { label: 'New markets flagged',       value: '3',   delta: 'this week', color: '#06B6D4' },
];

function SectionHeader({ title, meta, cta, onCta, accent = '#06B6D4' }: {
  title: string; meta?: string; cta?: string; onCta?: () => void; accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
      <div className="w-[3px] h-4 rounded-full" style={{ background: accent }} />
      <span className="text-[13px] font-bold text-white/88">{title}</span>
      {meta && <span className="text-[9px] font-mono text-white/28 tracking-widest">{meta}</span>}
      {cta && (
        <button onClick={onCta} className="ml-auto flex items-center gap-1 text-[10px] font-mono hover:opacity-80 transition-opacity" style={{ color: accent }}>
          {cta} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function latLngToXY(lat: number, lng: number, W: number, H: number) {
  const x = ((lng + 180) / 360) * W;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = (H / 2) - (W * mercN) / (2 * Math.PI);
  return { x, y };
}

export default function RocksteadyDashboard() {
  const navigate = useNavigate();
  const [timeTab, setTimeTab] = useState<'24H' | '72H' | '7D'>('7D');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(new Date());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showParagonReport, setShowParagonReport] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const activeAlerts = ALERTS.filter(a => !dismissed.has(a.id));
  const sortedArtists = [...ARTISTS].sort((a, b) => b.velocityScore - a.velocityScore);
  const breakingCount = ARTISTS.filter(a => a.status === 'breaking').length;

  const W = 600, H = 300;

  return (
    <div className="min-h-full bg-[#07080A]">
      {showParagonReport && <ParagonReportPanel onClose={() => setShowParagonReport(false)} />}

      <div className="relative bg-[#09090D] border-b border-[#EF4444]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/25 to-transparent" />
        <div className="absolute -top-12 left-1/4 w-64 h-24 rounded-full opacity-[0.035] blur-3xl" style={{ background: '#EF4444' }} />

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#F59E0B]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-[#EF4444]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-white">Rocksteady</h1>
                <span className="flex items-center gap-1.5 text-[9px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" /> LIVE
                </span>
              </div>
              <p className="text-[11px] text-white/42">AI-Driven A&R Intelligence System</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-white/15" />
                <span className="text-[10px] font-mono text-white/15">
                  {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap ml-auto items-center">
            {[
              { icon: TrendingUp, label: 'Breaking', value: `${breakingCount}`,       color: '#EF4444' },
              { icon: Users,      label: 'Monitored', value: `${ARTISTS.length}`,     color: '#06B6D4' },
              { icon: Zap,        label: 'Signals',   value: `${SIGNALS.length}`,     color: '#F59E0B' },
              { icon: Globe,      label: 'Markets',   value: '12',                    color: '#10B981' },
              { icon: AlertTriangle, label: 'Critical', value: `${activeAlerts.filter(a => a.level === 'critical').length}`, color: '#EF4444' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-2.5 px-3.5 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                <div>
                  <p className="text-[8.5px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
                  <p className="text-[13px] font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowParagonReport(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(245,158,11,0.08) 100%)',
                borderColor: 'rgba(239,68,68,0.35)',
                boxShadow: '0 0 16px rgba(239,68,68,0.12)',
              }}
            >
              <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
              <div>
                <p className="text-[8.5px] font-mono text-[#EF4444]/60 uppercase tracking-wider">Paragon</p>
                <p className="text-[12px] font-bold text-white leading-tight">Daily Report</p>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse ml-1" />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/[0.04] overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 3%, black 97%, transparent)' }}>
          <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'rs-slide 40s linear infinite', width: 'max-content' }}>
            {[...SIGNALS, ...SIGNALS].map((s, i) => (
              <div key={`${s.id}-${i}`} className="flex items-center gap-2 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.level === 'critical' ? 'bg-[#EF4444] animate-pulse' : s.level === 'high' ? 'bg-[#F59E0B]' : 'bg-[#06B6D4]'}`} />
                <span className="text-[10px] font-mono text-white/22">{s.type}: <span className="text-white/45">{s.artist !== '—' ? s.artist : s.location}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">

        {activeAlerts.length > 0 && (
          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Alert System" meta={`${activeAlerts.length} active`} cta="View All" onCta={() => navigate('/dashboard/rocksteady/alerts')} accent="#EF4444" />
            <div className="divide-y divide-white/[0.03]">
              {activeAlerts.map(alert => {
                const s = ALERT_STYLE[alert.level as keyof typeof ALERT_STYLE];
                return (
                  <div key={alert.id} className={`flex items-start gap-4 px-5 py-3.5 border-l-2 ${s.border} hover:bg-white/[0.015] transition-colors`}>
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${s.pill}`}>{alert.level.toUpperCase()}</span>
                        <span className="text-[13px] font-semibold text-white/85">{alert.headline}</span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">{alert.body}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-white/20">{alert.ts === 'now' ? 'just now' : `${alert.ts} ago`}</span>
                      <button className="text-[10px] font-mono text-[#06B6D4]/60 hover:text-[#06B6D4] transition-colors whitespace-nowrap border border-[#06B6D4]/20 px-2 py-0.5 rounded hover:bg-[#06B6D4]/[0.06]">{alert.action}</button>
                      <button onClick={() => setDismissed(p => new Set([...p, alert.id]))} className="text-white/15 hover:text-white/40 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <ActionableDiscoveries />

        <SigningWorkflowSummary />

        <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
            <div className="w-[3px] h-4 rounded-full bg-[#EF4444]" />
            <span className="text-[13px] font-semibold text-white/85">Top Discoveries</span>
            <span className="text-[9px] font-mono text-white/22 tracking-widest">// WHO MATTERS RIGHT NOW</span>
            <div className="ml-auto flex items-center gap-1.5">
              {(['24H', '72H', '7D'] as const).map(t => (
                <button key={t} onClick={() => setTimeTab(t)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${timeTab === t ? 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20' : 'text-white/20 hover:text-white/50'}`}>
                  {t}
                </button>
              ))}
              <button onClick={() => navigate('/dashboard/rocksteady/discoveries')} className="ml-2 flex items-center gap-1 text-[10px] font-mono text-[#EF4444]/60 hover:text-[#EF4444] transition-colors">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="hidden xl:grid grid-cols-[28px_1fr_90px_110px_90px_80px_100px_48px] gap-0 px-5 py-2 border-b border-white/[0.04]">
            {['#', 'Artist', 'Velocity', 'Monthly', 'Status', 'Rec', 'Signal Tags', ''].map(h => (
              <span key={h} className="text-[9px] font-mono text-white/15 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-white/[0.03]">
            {sortedArtists.map((artist, i) => {
              const s = STATUS_STYLE[artist.status];
              return (
                <div key={artist.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer xl:grid xl:grid-cols-[28px_1fr_90px_110px_90px_80px_100px_48px]"
                  onClick={() => navigate('/dashboard/rocksteady')}>
                  <span className="text-[11px] font-mono text-white/20">{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white/40">{artist.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-white/85 truncate">{artist.name}</span>
                        {i === 0 && <Star className="w-3 h-3 text-[#F59E0B] shrink-0" fill="currentColor" />}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-white/25">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate">{artist.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden xl:flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${artist.velocityScore}%`, background: artist.velocityScore > 90 ? '#EF4444' : artist.velocityScore > 75 ? '#F59E0B' : '#06B6D4' }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold w-6 text-right" style={{ color: artist.velocityScore > 90 ? '#EF4444' : artist.velocityScore > 75 ? '#F59E0B' : '#06B6D4' }}>{artist.velocityScore}</span>
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-[12px] font-mono text-white/50">{(artist.monthlyListeners / 1e6).toFixed(1)}M</p>
                    <p className="text-[9px] font-mono text-[#10B981]">{artist.listenersDelta}</p>
                  </div>
                  <span className={`hidden xl:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded border ${s.pill}`}>{artist.status}</span>
                  <span className={`hidden xl:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded border ${REC_STYLE[artist.recommendation]}`}>{artist.recommendation}</span>
                  <div className="hidden xl:flex flex-wrap gap-1">
                    {artist.signalTags.slice(0, 1).map(tag => (
                      <span key={tag} className="text-[8px] font-mono px-1 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.06] truncate max-w-[95px]">{tag}</span>
                    ))}
                  </div>
                  <button className="ml-auto xl:ml-0 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#EF4444]/[0.08] transition-colors group">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#EF4444] transition-colors" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Global Heatmap" meta="// SIGNAL INTENSITY BY MARKET" cta="Open Heatmaps" onCta={() => navigate('/dashboard/rocksteady/heatmaps')} accent="#F59E0B" />
            <div className="relative p-3">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-lg" style={{ background: 'linear-gradient(180deg, #0C0E14 0%, #080A0F 100%)' }}>
                <rect x={0} y={0} width={W} height={H} fill="#080A0F" rx={6} />
                {[...Array(12)].map((_, r) => (
                  <line key={`h${r}`} x1={0} y1={(r / 11) * H} x2={W} y2={(r / 11) * H} stroke="rgba(255,255,255,0.025)" strokeWidth={0.5} />
                ))}
                {[...Array(20)].map((_, c) => (
                  <line key={`v${c}`} x1={(c / 19) * W} y1={0} x2={(c / 19) * W} y2={H} stroke="rgba(255,255,255,0.025)" strokeWidth={0.5} />
                ))}
                {MAP_NODES.map(node => {
                  const { x, y } = latLngToXY(node.lat, node.lng, W, H);
                  const color = node.intensity === 'critical' ? '#EF4444' : node.intensity === 'high' ? '#F59E0B' : '#06B6D4';
                  const r = node.intensity === 'critical' ? 8 : node.intensity === 'high' ? 6 : 4;
                  const isHovered = hoveredNode === node.id;
                  return (
                    <g key={node.id} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
                      <circle cx={x} cy={y} r={r * 2.5} fill={color} opacity={0.06} />
                      <circle cx={x} cy={y} r={r * 1.5} fill={color} opacity={0.12} />
                      <circle cx={x} cy={y} r={r} fill={color} opacity={isHovered ? 0.9 : 0.7} style={{ filter: `drop-shadow(0 0 ${r + 2}px ${color})` }} />
                      {isHovered && (
                        <g>
                          <rect x={x + 8} y={y - 18} width={80} height={20} rx={3} fill="#0E0F14" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
                          <text x={x + 13} y={y - 4} fill="rgba(255,255,255,0.7)" fontSize="9" fontFamily="monospace">{node.label} ({node.artistCount})</text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
              <div className="flex items-center gap-4 mt-2 px-1">
                {[['#EF4444', 'Critical'], ['#F59E0B', 'High'], ['#06B6D4', 'Emerging']] .map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[9px] font-mono text-white/25">{label}</span>
                  </div>
                ))}
                <span className="ml-auto text-[9px] font-mono text-white/15">{MAP_NODES.length} active markets</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Culture Map" meta="// SCENE & GENRE CLUSTERS" cta="Open Culture Map" onCta={() => navigate('/dashboard/rocksteady/culture')} accent="#06B6D4" />
            <div className="p-3">
              <svg viewBox="0 0 400 240" className="w-full rounded-lg" style={{ background: '#080A0F' }}>
                {[
                  { x: 80,  y: 60,  r: 28, color: '#EF4444', label: 'Alt-Pop',   sub: 'LA / Global' },
                  { x: 200, y: 45,  r: 22, color: '#F59E0B', label: 'Afrobeats', sub: 'ATL / Lagos' },
                  { x: 320, y: 70,  r: 24, color: '#06B6D4', label: 'Hyperpop',  sub: 'Berlin / EU' },
                  { x: 60,  y: 165, r: 18, color: '#10B981', label: 'Indie Folk',sub: 'Nashville'   },
                  { x: 175, y: 170, r: 20, color: '#EC4899', label: 'R&B',       sub: 'London / UK' },
                  { x: 310, y: 170, r: 22, color: '#F59E0B', label: 'Latin',     sub: 'Miami / MX'  },
                ].map((n, idx, arr) => {
                  const connections = [[0,1],[0,3],[1,4],[2,5],[3,4],[4,5]];
                  return null;
                })}
                {[[0,1],[0,3],[1,4],[2,5],[3,4],[4,5]].map(([a, b], i) => {
                  const nodes = [
                    { x: 80, y: 60 }, { x: 200, y: 45 }, { x: 320, y: 70 },
                    { x: 60, y: 165 }, { x: 175, y: 170 }, { x: 310, y: 170 }
                  ];
                  return <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3,4" />;
                })}
                {[
                  { x: 80,  y: 60,  r: 28, color: '#EF4444', label: 'Alt-Pop',   sub: 'LA / Global' },
                  { x: 200, y: 45,  r: 22, color: '#F59E0B', label: 'Afrobeats', sub: 'ATL / Lagos' },
                  { x: 320, y: 70,  r: 24, color: '#06B6D4', label: 'Hyperpop',  sub: 'Berlin / EU' },
                  { x: 60,  y: 165, r: 18, color: '#10B981', label: 'Indie Folk',sub: 'Nashville'   },
                  { x: 175, y: 170, r: 20, color: '#EC4899', label: 'R&B',       sub: 'London / UK' },
                  { x: 310, y: 170, r: 22, color: '#F59E0B', label: 'Latin',     sub: 'Miami / MX'  },
                ].map(n => (
                  <g key={n.label}>
                    <circle cx={n.x} cy={n.y} r={n.r + 8} fill={n.color} opacity={0.06} />
                    <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} opacity={0.18} style={{ filter: `drop-shadow(0 0 6px ${n.color})` }} />
                    <circle cx={n.x} cy={n.y} r={3} fill={n.color} opacity={0.9} />
                    <text x={n.x} y={n.y + n.r + 12} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">{n.label}</text>
                    <text x={n.x} y={n.y + n.r + 21} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6.5" fontFamily="monospace">{n.sub}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Scout Network" meta={`${SCOUTS.length} active`} cta="Open Scout Network" onCta={() => navigate('/dashboard/rocksteady/scouts')} accent="#10B981" />
            <div className="divide-y divide-white/[0.03]">
              {SCOUTS.map(scout => (
                <div key={scout.id}
                  className={`flex items-center gap-4 px-5 py-3 hover:bg-white/[0.015] transition-colors cursor-pointer ${scout.primary ? 'bg-[#EF4444]/[0.02] border-l-2 border-l-[#EF4444]/30' : ''}`}
                  onClick={() => navigate(`/dashboard/rocksteady/scouts`)}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${scout.primary ? 'bg-[#EF4444]/15 border border-[#EF4444]/30' : 'bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08]'}`}>
                    <span className={`text-[10px] font-bold ${scout.primary ? 'text-[#EF4444]' : 'text-white/40'}`}>{scout.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-white/88">{scout.name}</span>
                      {scout.primary && <span className="text-[7px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/12 text-[#EF4444] border border-[#EF4444]/25 tracking-widest">PRIMARY</span>}
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${
                        scout.tier === 'Elite'  ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' :
                        scout.tier === 'Master' ? 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20' :
                        scout.tier === 'Senior' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                        'bg-white/5 text-white/30 border-white/10'}`}>{scout.tier}</span>
                      {scout.todayReport && <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">Report Ready</span>}
                    </div>
                    <p className="text-[10px] text-white/38 mt-0.5">{scout.region}</p>
                  </div>
                  <div className="flex items-center gap-5 shrink-0 text-right">
                    <div>
                      <p className="text-[13px] font-bold text-[#EF4444]">{scout.liveSignals}</p>
                      <p className="text-[9px] font-mono text-white/28">live</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white/70">{scout.discoveries7d}</p>
                      <p className="text-[9px] font-mono text-white/28">7D disc.</p>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#10B981]">{scout.accuracy}%</p>
                      <p className="text-[9px] font-mono text-white/28">accuracy</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Discovery Radar" cta="Open Radar" onCta={() => navigate('/dashboard/rocksteady/radar')} accent="#F59E0B" />
            <div className="p-4 space-y-3">
              {RADAR_SIGNALS.map(s => (
                <div key={s.label} className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                    <Activity className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-white/72">{s.label}</p>
                    <p className="text-[10px] font-mono mt-0.5" style={{ color: s.color }}>{s.delta}</p>
                  </div>
                  <p className="text-[22px] font-bold shrink-0" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <SectionHeader title="Activity Feed" meta="// SYSTEM EVENTS" accent="#06B6D4" />
            <div className="divide-y divide-white/[0.03]">
              {ACTIVITY.map(a => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.01] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5" style={{ background: a.color }} />
                  <p className="text-[12px] text-white/60 flex-1 leading-snug">{a.text}</p>
                  <span className="text-[10px] font-mono text-white/18 shrink-0">{a.ts}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
              <SectionHeader title="Platform Health" accent="#10B981" />
              <div className="px-5 py-4 space-y-3">
                {HEALTH.map(h => (
                  <div key={h.label} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: h.color }} />
                    <span className="text-[12px] text-white/60 flex-1">{h.label}</span>
                    <div className="w-28 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${h.pct}%`, background: h.color }} />
                    </div>
                    <span className="text-[11px] font-mono w-8 text-right" style={{ color: h.color }}>{h.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
              <SectionHeader title="Scout Reports" meta={`${SCOUT_REPORTS.length} recent`} cta="View All" onCta={() => navigate('/dashboard/rocksteady/scouts')} accent="#F59E0B" />
              <div className="divide-y divide-white/[0.03]">
                {SCOUT_REPORTS.slice(0, 3).map(r => (
                  <div key={r.id} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors cursor-pointer">
                    <FileText className="w-3.5 h-3.5 text-white/20 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[12px] font-semibold text-white/75">{r.artist}</span>
                        <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${REC_STYLE[r.recommendation]}`}>{r.recommendation}</span>
                      </div>
                      <p className="text-[10px] text-white/30 truncate">{r.scout} · {r.date}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/15 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rs-slide {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
