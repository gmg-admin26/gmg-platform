import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, MapPin, CheckCircle, Clock, Download,
  Copy, Send, Bookmark, Zap, ChevronRight, TrendingUp,
  AlertTriangle, Activity, FileText, X
} from 'lucide-react';
import { ARTISTS } from '../data/rocksteadyData';
import { SCOUTS } from './ScoutNetwork';
import TodaysReport from '../components/rocksteady/TodaysReport';

const TIER_CONFIG: Record<string, { bar: string; pill: string; bg: string; border: string; icon: string }> = {
  Elite:  { bar: '#F59E0B', pill: 'bg-[#F59E0B]/12 text-[#F59E0B] border-[#F59E0B]/30', bg: 'bg-[#F59E0B]/[0.04]', border: 'border-[#F59E0B]/15', icon: '◆' },
  Master: { bar: '#06B6D4', pill: 'bg-[#06B6D4]/12 text-[#06B6D4] border-[#06B6D4]/25', bg: 'bg-[#06B6D4]/[0.03]', border: 'border-[#06B6D4]/12', icon: '◈' },
  Senior: { bar: '#10B981', pill: 'bg-[#10B981]/12 text-[#10B981] border-[#10B981]/25', bg: 'bg-[#10B981]/[0.02]', border: 'border-[#10B981]/10', icon: '●' },
  Junior: { bar: '#6B7280', pill: 'bg-white/[0.06] text-white/40 border-white/12',       bg: 'bg-white/[0.01]',       border: 'border-white/[0.06]', icon: '○' },
};

const STATUS_DOT: Record<string, string> = {
  active:  'bg-[#10B981] animate-pulse',
  standby: 'bg-[#F59E0B]',
  offline: 'bg-white/20',
};

interface RangeReport {
  date: string;
  summary: string;
  topSignal: string;
  topSignalDetail: string;
  marketNote: string;
  marketNoteDetail: string;
  aiRec: string;
  aiRecDetail: string;
  flaggedArtists: string[];
  newSignals: number;
  confirmedSignals: number;
}

const REPORTS_BY_SCOUT: Record<string, Record<string, RangeReport>> = {
  'SC-01': {
    'Today':   { date: 'Apr 9, 2026',    summary: 'High-velocity window for Zara Vex continues into day 4. TikTok audience saturation approaching 5M — major label involvement expected within 72h. Separately, DXTR Berlin signal strengthening without label contact. Two markets (Tokyo, Lagos) showing independent Zara discovery signals.', topSignal: 'TikTok Spike — Zara Vex', topSignalDetail: '+840K TikTok followers in 7 days. Views on "Glass Teeth" crossing 280M. Unsigned. 30-day window.', marketNote: 'LA market tension rising', marketNoteDetail: 'At least two major labels confirmed in conversations with management. Atlantic and Republic reportedly showing interest. Window is closing.', aiRec: 'SIGN Zara Vex immediately', aiRecDetail: 'Delay cost estimated at 30–40% increase in signing cost within 14 days. Initiate contact today.', flaggedArtists: ['Zara Vex', 'DXTR'], newSignals: 3, confirmedSignals: 2 },
    '7 Days':  { date: 'Apr 2–9, 2026',  summary: 'Week marked by Alt-Pop velocity in LA and Berlin. Three new signals detected. Scout confirmed two SIGN-level artists. Mako Sol deal expiration approaching Q3 — lateral escalation recommended. Market competition increasing in Atlanta.', topSignal: 'Streaming Acceleration — Mako Sol', topSignalDetail: '+180% MoM Spotify growth. Three editorial playlist adds confirmed this week. Indie deal expires Q3.', marketNote: 'ATL competition escalating', marketNoteDetail: 'Two major label scouts confirmed present at same venue as Mako Sol last Friday. Urgency elevated to HIGH.', aiRec: 'SIGN Mako Sol before deal expiry. SIGN Zara Vex', aiRecDetail: 'Q3 deal expiry is 84 days out. Recommend contact within 7 days. Zara Vex window 14–21 days max.', flaggedArtists: ['Zara Vex', 'Mako Sol', 'DXTR'], newSignals: 7, confirmedSignals: 5 },
    '14 Days': { date: 'Mar 26–Apr 9',   summary: 'Two-week pattern confirms sustained growth across all monitored artists. Zero false positives in signal feed for the period. Kael Torres Latin crossover momentum consistent and strengthening. Recommend in-market visit to Miami in next 30 days.', topSignal: 'Engagement Cluster — Kael Torres', topSignalDetail: '14.2% engagement rate — 6× industry average. Miami local scene validation confirmed by three independent sources.', marketNote: 'Latin market window opening', marketNoteDetail: 'Spanish-language streaming on Spotify US grew 22% this quarter. Window for Latin crossover artists is widening.', aiRec: 'SIGN Zara Vex. SIGN Mako Sol. WATCH Kael Torres', aiRecDetail: 'Kael Torres needs one more release cycle to confirm ceiling. Recommend 30-day watch with in-market follow-up.', flaggedArtists: ['Zara Vex', 'Mako Sol', 'Kael Torres', 'DXTR'], newSignals: 14, confirmedSignals: 9 },
    '30 Days': { date: 'Mar 10–Apr 9',   summary: 'Strongest discovery pipeline in 18 months. Six artists flagged, three reaching SIGN recommendation. Berlin and LA are primary discovery markets this cycle. Unsigned inventory is historically high — opportunity window is significant.', topSignal: 'Multi-platform breakout — DXTR', topSignalDetail: 'EU viral + festival booking confirmed. Once touring begins, estimated valuation increase of 40–60%.', marketNote: 'Major unsigned inventory in LA', marketNoteDetail: 'Highest number of unsigned, un-managed artists above 500K monthly listeners since 2021. Structural gap in the market.', aiRec: 'SIGN Zara Vex, DXTR, Mako Sol. WATCH Kael Torres, Amara Blue', aiRecDetail: 'Three simultaneous SIGN recommendations is unusual. Timing is extraordinary. Recommend executive review this week.', flaggedArtists: ['Zara Vex', 'DXTR', 'Mako Sol', 'Kael Torres', 'Amara Blue', 'Phoebe Strand'], newSignals: 28, confirmedSignals: 18 },
  },
};

const QUICK_CHIPS = [
  { label: 'Deep artist scan',    desc: 'Full profile + signal history' },
  { label: 'Market scan',         desc: 'Emerging signals in a market'  },
  { label: 'Similar artists',     desc: 'Soundalike discovery query'    },
  { label: 'Scene scan',          desc: 'Genre or location deep dive'   },
  { label: 'Playlist scan',       desc: 'Playlist momentum analysis'    },
];

const PRIORITIES = [
  { key: 'Low',    color: 'text-white/40 border-white/10',  active: 'bg-white/[0.06] text-white/70 border-white/[0.14]' },
  { key: 'Medium', color: 'text-white/40 border-white/10',  active: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/25' },
  { key: 'High',   color: 'text-white/40 border-white/10',  active: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25' },
  { key: 'Urgent', color: 'text-white/40 border-white/10',  active: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25' },
];

const REC_STYLE: Record<string, string> = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/5 text-white/30 border-white/10',
};

const RANGES = ['Today', '7 Days', '14 Days', '30 Days'] as const;
type Range = typeof RANGES[number];

export default function ScoutDetail() {
  const { scoutId = 'SC-01' } = useParams<{ scoutId: string }>();
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>('Today');
  const [priority, setPriority] = useState('High');
  const [chips, setChips] = useState<string[]>([]);
  const [reqTarget, setReqTarget] = useState('');
  const [reqRegion, setReqRegion] = useState('');
  const [reqTrend, setReqTrend] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scout = SCOUTS.find(s => s.id === scoutId) ?? SCOUTS[0];
  const tc = TIER_CONFIG[scout.tier];
  const sdot = STATUS_DOT[scout.status];

  const scoutReports = REPORTS_BY_SCOUT['SC-01'];
  const report = scoutReports[range];

  function toggleChip(chip: string) {
    setChips(p => p.includes(chip) ? p.filter(c => c !== chip) : [...p, chip]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setReqTarget(''); setReqRegion(''); setReqTrend(''); setReqNotes(''); setChips([]);
  }

  return (
    <div className="min-h-full bg-[#07080A]">

      <div className="px-6 py-4 border-b border-white/[0.05] bg-[#09090D] flex items-center gap-2">
        <button onClick={() => navigate('/dashboard/rocksteady/scouts')}
          className="flex items-center gap-1.5 text-[10.5px] font-mono text-white/25 hover:text-white/60 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Scout Network
        </button>
        <span className="text-white/12 font-mono">/</span>
        <span className="text-[10.5px] font-mono text-white/40">{scout.name}</span>
        <span className="text-white/12 font-mono">/</span>
        <span className="text-[10.5px] font-mono" style={{ color: `${tc.bar}70` }}>{range}</span>
      </div>

      <div className="relative border-b px-6 py-5 overflow-hidden" style={{ borderColor: `${tc.bar}18`, background: `${tc.bar}05` }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${tc.bar}35, transparent)` }} />
        <div className="absolute -top-10 left-1/3 w-64 h-20 rounded-full opacity-[0.05] blur-3xl" style={{ background: tc.bar }} />

        <div className="flex items-start gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-[16px] font-bold text-white/60"
                style={{ background: `${tc.bar}10`, border: `1px solid ${tc.bar}25` }}>
                {scout.name.split(' ')[0].charAt(0)}{scout.name.split(' ')[1]?.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#09090D] ${sdot}`} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-bold text-white">{scout.name}</h1>
                <span className={`text-[8.5px] font-mono px-2 py-0.5 rounded border ${tc.pill}`}>
                  {tc.icon} {scout.tier}
                </span>
                {scout.tier === 'Elite' && <Star className="w-4 h-4 text-[#F59E0B]" fill="currentColor" />}
              </div>
              <p className="text-[12px] text-white/40 mt-0.5">{scout.role}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-white/20" />
                  <span className="text-[10.5px] text-white/30">{scout.region}</span>
                </div>
                <span className="text-[10px] font-mono font-semibold" style={{ color: `${tc.bar}B0` }}>
                  {tc.icon} {scout.specialization}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto flex-wrap">
            {[
              { label: 'Live Signals', value: `${scout.liveSignals}`, color: '#EF4444', pulse: true  },
              { label: 'Accuracy',     value: `${scout.accuracy}%`,   color: '#10B981', pulse: false },
              { label: 'Total Disc.',  value: `${scout.totalDiscoveries}`, color: '#06B6D4', pulse: false },
              { label: 'Signs',        value: `${scout.signsConverted}`,   color: tc.bar, pulse: false },
            ].map(s => (
              <div key={s.label} className="text-center px-4 py-2.5 rounded-xl border bg-black/20" style={{ borderColor: `${tc.bar}15` }}>
                <div className="flex items-center justify-center gap-1.5">
                  {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />}
                  <span className="text-[22px] font-bold tabular-nums leading-none" style={{ color: s.color }}>{s.value}</span>
                </div>
                <p className="text-[8.5px] font-mono text-white/18 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.04]">
          <p className="text-[9px] font-mono text-white/18 uppercase tracking-wider mb-1">Scout Biography</p>
          <p className="text-[12px] text-white/45 leading-relaxed">{scout.bio}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">

          <div className="space-y-4">

            {scoutId === 'SC-00' ? (
              <TodaysReport accentColor={tc.bar} scoutName={scout.name} />
            ) : (
              <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
                  <div className="w-[3px] h-4 rounded-full" style={{ background: tc.bar }} />
                  <span className="text-[13px] font-semibold text-white/85">Intelligence Report</span>
                  <span className="text-[9px] font-mono text-white/15 ml-1">// {report.date}</span>
                  <div className="ml-auto flex items-center p-0.5 bg-white/[0.03] border border-white/[0.06] rounded-lg gap-0.5">
                    {RANGES.map(r => (
                      <button key={r} onClick={() => setRange(r)}
                        className={`px-3 py-1.5 text-[10px] font-mono rounded-md transition-all whitespace-nowrap ${
                          range === r
                            ? 'font-semibold'
                            : 'text-white/20 hover:text-white/50'
                        }`}
                        style={range === r ? { background: `${tc.bar}14`, color: tc.bar, border: `1px solid ${tc.bar}25` } : {}}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: `${tc.bar}40` }} />
                    <div>
                      <p className="text-[9px] font-mono text-white/18 uppercase tracking-[0.14em] mb-1.5">Report Summary</p>
                      <p className="text-[13px] text-white/65 leading-relaxed">{report.summary}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { label: 'New Signals',       value: `${report.newSignals}`,      color: '#EF4444' },
                      { label: 'Confirmed Signals',  value: `${report.confirmedSignals}`, color: '#10B981' },
                      { label: 'Artists Flagged',    value: `${report.flaggedArtists.length}`, color: tc.bar },
                    ].map(stat => (
                      <div key={stat.label} className="px-4 py-3 rounded-xl bg-white/[0.025] border border-white/[0.05] text-center">
                        <p className="text-[24px] font-bold tabular-nums" style={{ color: stat.color }}>{stat.value}</p>
                        <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl overflow-hidden border border-[#EF4444]/12 bg-[#EF4444]/[0.03]">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#EF4444]/08">
                        <AlertTriangle className="w-3 h-3 text-[#EF4444]/70 shrink-0" />
                        <span className="text-[9.5px] font-mono text-[#EF4444]/70 uppercase tracking-wider">Top Signal</span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[12.5px] font-semibold text-white/80 mb-1">{report.topSignal}</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{report.topSignalDetail}</p>
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-[#F59E0B]/12 bg-[#F59E0B]/[0.03]">
                      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#F59E0B]/08">
                        <Activity className="w-3 h-3 text-[#F59E0B]/70 shrink-0" />
                        <span className="text-[9.5px] font-mono text-[#F59E0B]/70 uppercase tracking-wider">Market Note</span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-[12.5px] font-semibold text-white/80 mb-1">{report.marketNote}</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{report.marketNoteDetail}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-[#10B981]/12 bg-[#10B981]/[0.03]">
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#10B981]/08">
                      <Zap className="w-3 h-3 text-[#10B981]/70 shrink-0" />
                      <span className="text-[9.5px] font-mono text-[#10B981]/70 uppercase tracking-wider">AI Recommendation</span>
                      <span className="ml-auto text-[8px] font-mono text-[#10B981]/40 border border-[#10B981]/15 px-1.5 py-0.5 rounded">Confidence: {scout.confidenceScore}%</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-[13px] font-bold text-[#10B981] mb-1.5">{report.aiRec}</p>
                      <p className="text-[11px] text-white/40 leading-relaxed">{report.aiRecDetail}</p>
                    </div>
                  </div>

                  {report.flaggedArtists.length > 0 && (
                    <div>
                      <p className="text-[9px] font-mono text-white/18 uppercase tracking-[0.14em] mb-2">Flagged in This Period</p>
                      <div className="flex flex-wrap gap-2">
                        {report.flaggedArtists.map(a => (
                          <span key={a} className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ background: `${tc.bar}0A`, color: `${tc.bar}C0`, borderColor: `${tc.bar}20` }}>
                            {a} <ChevronRight className="w-3 h-3" />
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {[
                      { label: 'Export PDF',      icon: Download  },
                      { label: 'Copy Summary',    icon: Copy      },
                      { label: 'Send to Team',    icon: Send      },
                      { label: 'Save to Watchlist', icon: Bookmark },
                    ].map(({ label, icon: Icon }) => (
                      <button key={label}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-mono text-white/30 border border-white/[0.07] hover:text-white/60 hover:border-white/[0.13] hover:bg-white/[0.025] transition-all">
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
                <div className="w-[3px] h-4 rounded-full bg-[#06B6D4]" />
                <span className="text-[13px] font-semibold text-white/85">Discovery Tracker</span>
                <span className="text-[9px] font-mono text-white/12">// {ARTISTS.length} artists in pipeline</span>
                <span className="ml-auto text-[9px] font-mono text-white/18">Sorted by velocity</span>
              </div>

              <div className="hidden xl:grid grid-cols-[20px_1fr_80px_90px_100px_110px_52px] px-5 py-2.5 border-b border-white/[0.04]">
                {['', 'Artist', 'Country', 'Genre', 'Signal', 'Confidence', 'Rec'].map(h => (
                  <span key={h} className="text-[8.5px] font-mono text-white/15 uppercase tracking-[0.12em]">{h}</span>
                ))}
              </div>

              <div className="divide-y divide-white/[0.03]">
                {[...ARTISTS].sort((a, b) => b.velocityScore - a.velocityScore).map((artist, idx) => {
                  const velColor = artist.velocityScore > 90 ? '#EF4444' : artist.velocityScore > 75 ? '#F59E0B' : '#06B6D4';
                  const statusDot = artist.status === 'breaking' ? 'bg-[#EF4444] animate-pulse' : artist.status === 'rising' ? 'bg-[#F59E0B]' : 'bg-[#06B6D4]';
                  return (
                    <div key={artist.id}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.025] transition-colors cursor-pointer group xl:grid xl:grid-cols-[20px_1fr_80px_90px_100px_110px_52px]">
                      <span className="text-[10px] font-mono text-white/15 shrink-0">{idx + 1}</span>

                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="relative shrink-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40">
                            {artist.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0A0C0F] ${statusDot}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-white/80 truncate">{artist.name}</p>
                          <p className="text-[9.5px] text-white/25 truncate">{artist.location}</p>
                        </div>
                      </div>

                      <span className="hidden xl:block text-[10.5px] text-white/35 font-mono">{artist.country}</span>

                      <span className="hidden xl:block text-[10px] text-white/30 truncate">
                        {artist.genre.split('/')[0].trim()}
                      </span>

                      <span className="hidden xl:block text-[9px] font-mono text-white/28 truncate">
                        {artist.signalTags[0]}
                      </span>

                      <div className="hidden xl:flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${artist.aiScore}%`, background: velColor }} />
                        </div>
                        <span className="text-[10.5px] font-mono font-bold shrink-0 w-7 text-right" style={{ color: velColor }}>{artist.aiScore}</span>
                      </div>

                      <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border w-fit ${REC_STYLE[artist.recommendation]}`}>
                        {artist.recommendation}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">

            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden sticky top-4">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
                <div className="w-[3px] h-4 rounded-full bg-[#F59E0B]" />
                <div>
                  <p className="text-[13px] font-semibold text-white/85">Request Research <span className="text-[9px] font-mono text-[#F59E0B]/60 ml-1">({scout.name} Only)</span></p>
                  <p className="text-[9.5px] text-white/28 mt-0.5">Send a targeted request directly to {scout.name}'s intelligence model</p>
                </div>
              </div>

              {submitted ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <p className="text-[13px] font-semibold text-white/70">Request Submitted</p>
                  <p className="text-[11px] text-white/30 mt-1">Scout will respond within the next report cycle</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div>
                    <p className="text-[9px] font-mono text-white/18 uppercase tracking-[0.14em] mb-2">Quick Request Type</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_CHIPS.map(chip => {
                        const on = chips.includes(chip.label);
                        return (
                          <button key={chip.label} type="button" onClick={() => toggleChip(chip.label)}
                            title={chip.desc}
                            className={`text-[9px] font-mono px-2.5 py-1.5 rounded-lg border transition-all ${
                              on ? '' : 'text-white/30 border-white/[0.07] hover:text-white/55 hover:border-white/[0.12]'
                            }`}
                            style={on ? { background: `${tc.bar}10`, color: tc.bar, borderColor: `${tc.bar}30` } : {}}>
                            {chip.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-[1px] bg-white/[0.04]" />

                  <div className="space-y-3">
                    {[
                      { label: 'Research Target', placeholder: 'Artist name or market...', value: reqTarget, setter: setReqTarget },
                      { label: 'Region / Market',  placeholder: 'City, country, or region...', value: reqRegion, setter: setReqRegion },
                      { label: 'Trend or Angle',   placeholder: 'Genre, sound, cultural moment...', value: reqTrend, setter: setReqTrend },
                    ].map(f => (
                      <div key={f.label}>
                        <label className="text-[9px] font-mono text-white/18 uppercase tracking-[0.13em] block mb-1">{f.label}</label>
                        <input value={f.value} onChange={e => f.setter(e.target.value)} placeholder={f.placeholder}
                          className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-lg text-[11.5px] text-white/65 placeholder-white/15 focus:outline-none focus:border-[#F59E0B]/30 transition-colors" />
                      </div>
                    ))}

                    <div>
                      <label className="text-[9px] font-mono text-white/18 uppercase tracking-[0.13em] block mb-1.5">Priority Level</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {PRIORITIES.map(p => (
                          <button key={p.key} type="button" onClick={() => setPriority(p.key)}
                            className={`py-2 text-[9.5px] font-mono rounded-lg border transition-all ${priority === p.key ? p.active : p.color}`}>
                            {p.key}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-mono text-white/18 uppercase tracking-[0.13em] block mb-1">Notes</label>
                      <textarea value={reqNotes} onChange={e => setReqNotes(e.target.value)}
                        placeholder="Context, specific questions, or intelligence gaps to fill..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.07] rounded-lg text-[11.5px] text-white/65 placeholder-white/15 focus:outline-none focus:border-[#F59E0B]/30 transition-colors resize-none leading-relaxed" />
                    </div>
                  </div>

                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-[12px] font-semibold transition-all"
                    style={{ background: `${tc.bar}12`, border: `1px solid ${tc.bar}25`, color: tc.bar }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${tc.bar}1E`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${tc.bar}12`; }}
                  >
                    <Send className="w-4 h-4" />
                    Submit Research Request
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
                <div className="w-[3px] h-4 rounded-full bg-[#06B6D4]" />
                <span className="text-[13px] font-semibold text-white/85">Scout Performance</span>
              </div>
              <div className="p-5 space-y-3">
                {[
                  { label: 'Signal Accuracy',       value: scout.accuracy,       max: 100, color: '#10B981' },
                  { label: 'Confidence Score',       value: scout.confidenceScore,max: 100, color: tc.bar    },
                  { label: '30D Discovery Rate',     value: Math.min(scout.discoveries30d * 4, 100), max: 100, color: '#06B6D4' },
                  { label: 'Sign Conversion Rate',   value: scout.totalDiscoveries > 0 ? Math.round((scout.signsConverted / scout.totalDiscoveries) * 100) : 0, max: 100, color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-white/40">{m.label}</span>
                      <span className="text-[11px] font-mono font-bold" style={{ color: m.color }}>{m.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${m.value}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
