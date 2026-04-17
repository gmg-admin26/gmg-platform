import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, X, ChevronRight, Search, Filter,
  Clock, ArrowUpRight, Bell, Zap, Globe, Network, Users
} from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  artistOrMarket: string;
  signalType: string;
  scout: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  region: string;
  ts: string;
  body: string;
  status: 'open' | 'reviewed' | 'escalated';
}

const ALERTS: Alert[] = [
  {
    id: 'AL-001', title: 'New breakout signal detected (Nigeria)',
    artistOrMarket: 'Zaylevelten', signalType: 'Velocity Spike', scout: 'Paragon',
    severity: 'Critical', region: 'Lagos / Nigeria', ts: 'just now',
    body: 'Zaylevelten — Spotify velocity spike +2,071% following Fresh Finds Africa playlist placement. Unsigned Afro-fusion act. Audience 86% age 18–29. Immediate outreach window — estimated 30-day window before major label engagement. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-002', title: 'Viral-to-major pipeline benchmark confirmed',
    artistOrMarket: 'Gigi Perez', signalType: 'Pipeline Signal', scout: 'Paragon',
    severity: 'Critical', region: 'Global', ts: '12m ago',
    body: 'Gigi Perez surpasses 1B streams on "Sailor Song." Major label conversion model confirmed. This trajectory validates the TikTok-to-chart pipeline at scale. Breakout archetype benchmark locked. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-003', title: 'Pre-viral breakout candidate (Los Angeles)',
    artistOrMarket: 'Lamb', signalType: 'Pre-Viral Signal', scout: 'Paragon',
    severity: 'High', region: 'Los Angeles, CA', ts: '34m ago',
    body: 'Lamb gaining early traction with high-profile co-signs from Drake, SZA, and Russ. Unsigned. Jersey Club sound with strong crossover potential. Pre-viral window open now — unsigned opportunity. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-004', title: 'Emerging market acceleration (Africa)',
    artistOrMarket: 'Africa Markets', signalType: 'Market Heat', scout: 'Paragon',
    severity: 'High', region: 'Lagos / Accra / London', ts: '1h ago',
    body: 'Afro-fusion pipeline expanding rapidly across Nigeria, Ghana, and UK diaspora. Zaylevelten is leading this wave. Multiple unsigned acts crossing velocity thresholds simultaneously. Strategic market entry window open. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-005', title: 'Indie-to-major pathway replication confirmed',
    artistOrMarket: '2hollis / Bella Kay', signalType: 'Pipeline Signal', scout: 'Paragon',
    severity: 'Medium', region: 'Global', ts: '2h ago',
    body: '2hollis and Bella Kay trajectories confirm TikTok-to-chart pipeline efficiency. Both artists validating the model independently. Archetype intelligence suggests replication opportunities in adjacent markets. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-006', title: 'Mon Rovia touring momentum accelerating',
    artistOrMarket: 'Mon Rovia', signalType: 'Streaming Accel.', scout: 'Paragon',
    severity: 'Medium', region: 'USA / Liberia', ts: '3h ago',
    body: 'Mon Rovia — 2.4M monthly listeners with active touring schedule. Indie folk with viral momentum. Authentic fanbase, high engagement rate. Consistent streaming growth. Unsigned opportunity window approaching. Reported by Paragon A&R Scout.',
    status: 'reviewed',
  },
  {
    id: 'AL-007', title: 'LA archetype scan: Nessa Barrett flagged',
    artistOrMarket: 'Nessa Barrett', signalType: 'Archetype Match', scout: 'Paragon',
    severity: 'Medium', region: 'Los Angeles, CA', ts: '4h ago',
    body: 'Paragon archetype scan flags Nessa Barrett (A&R Score 88). Unsigned. High priority. Multiple indicators of imminent breakout. Anneth (Score 86), Chloe Tang (Score 84, TikTok 2.8M), and Maya Chen (Score 83) also flagged in same LA sweep. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-008', title: 'Sung Holly — developing signal (Dallas)',
    artistOrMarket: 'Sung Holly', signalType: 'Scene Signal', scout: 'Paragon',
    severity: 'Low', region: 'Dallas, TX', ts: '5h ago',
    body: 'Sung Holly — Dallas bedroom pop artist. Consistent YouTube growth, strong songwriting. Not viral yet. Monitor for next release catalyst. Early-stage signal confirmed. Reported by Paragon A&R Scout.',
    status: 'open',
  },
  {
    id: 'AL-009', title: 'Makaio Huizar — pre-EP unsigned watch',
    artistOrMarket: 'Makaio Huizar', signalType: 'Pre-Release Signal', scout: 'Paragon',
    severity: 'Low', region: 'Arizona', ts: '6h ago',
    body: 'Makaio Huizar — Arizona-based, velocity score 76. Pre-EP, unsigned. Early development indicators present. Watchlist placement recommended ahead of EP release cycle. Reported by Paragon A&R Scout.',
    status: 'open',
  },
];

const SEV_CONFIG: Record<string, { border: string; dot: string; pill: string; row: string }> = {
  Critical: { border: 'border-l-[#EF4444]', dot: 'bg-[#EF4444] animate-pulse', pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', row: 'hover:bg-[#EF4444]/[0.015]' },
  High:     { border: 'border-l-[#F59E0B]', dot: 'bg-[#F59E0B]',               pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', row: 'hover:bg-[#F59E0B]/[0.01]'  },
  Medium:   { border: 'border-l-[#06B6D4]', dot: 'bg-[#06B6D4]',               pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', row: 'hover:bg-[#06B6D4]/[0.01]'  },
  Low:      { border: 'border-l-white/10',   dot: 'bg-white/25',                pill: 'bg-white/5 text-white/30 border-white/10',              row: 'hover:bg-white/[0.01]'      },
};

const SIGNAL_TYPES = ['All', 'Velocity Spike', 'Pipeline Signal', 'Pre-Viral Signal', 'Market Heat', 'Streaming Accel.', 'Archetype Match', 'Scene Signal', 'Pre-Release Signal'];
const SCOUTS_FILTER = ['All', 'Paragon', 'Nova', 'Rift', 'Flare', 'Drift', 'Vibe', 'Prism', 'Nexus', 'Cipher', 'Halo', 'Blaze'];
const REGIONS = ['All', 'Lagos / Nigeria', 'Global', 'Los Angeles, CA', 'Lagos / Accra / London', 'USA / Liberia', 'Dallas, TX', 'Arizona', 'West Coast', 'Atlanta'];
const SEVERITIES = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function RocksteadyAlerts() {
  const navigate = useNavigate();
  const [sev, setSev] = useState('All');
  const [sigType, setSigType] = useState('All');
  const [scoutFilter, setScoutFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Alert | null>(null);

  const filtered = ALERTS.filter(a => {
    if (dismissed.has(a.id)) return false;
    if (sev !== 'All' && a.severity !== sev) return false;
    if (sigType !== 'All' && a.signalType !== sigType) return false;
    if (scoutFilter !== 'All' && a.scout !== scoutFilter) return false;
    if (regionFilter !== 'All' && a.region !== regionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.title.toLowerCase().includes(q) && !a.artistOrMarket.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const critCount = ALERTS.filter(a => a.severity === 'Critical' && !dismissed.has(a.id)).length;
  const highCount = ALERTS.filter(a => a.severity === 'High' && !dismissed.has(a.id)).length;
  const openCount = ALERTS.filter(a => a.status === 'open' && !dismissed.has(a.id)).length;

  return (
    <div className="min-h-full bg-[#07080A]">

      <div className="relative bg-[#09090D] border-b border-[#EF4444]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/25 to-transparent" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-white leading-tight">Alert System</h1>
              <p className="text-[10.5px] text-white/25">Rocksteady signal intelligence alerts · real-time monitoring</p>
            </div>
          </div>
          <div className="flex gap-3 ml-auto flex-wrap">
            {[
              { label: 'Critical', value: critCount, color: '#EF4444' },
              { label: 'High', value: highCount, color: '#F59E0B' },
              { label: 'Open', value: openCount, color: '#06B6D4' },
              { label: 'Total', value: filtered.length, color: '#10B981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-3.5 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl text-center">
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                <p className="text-[16px] font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3.5 bg-[#0A0B0E] border border-white/[0.07] rounded-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts..."
              className="pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#EF4444]/40 w-44" />
          </div>

          <Filter className="w-3 h-3 text-white/15 shrink-0" />

          {([['Severity', SEVERITIES, sev, setSev], ['Signal', SIGNAL_TYPES, sigType, setSigType], ['Scout', SCOUTS_FILTER, scoutFilter, setScoutFilter], ['Region', REGIONS, regionFilter, setRegionFilter]] as const).map(([label, opts, val, setter]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-white/25">{label}:</span>
              <select value={val} onChange={e => setter(e.target.value)}
                className="px-2 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/60 focus:outline-none focus:border-[#EF4444]/30">
                {opts.map((o: string) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            {SEVERITIES.slice(1).map(s => (
              <button key={s} onClick={() => setSev(sev === s ? 'All' : s)}
                className={`px-2.5 py-1 rounded text-[9px] font-mono border transition-all ${sev === s ? SEV_CONFIG[s].pill : 'text-white/25 border-white/[0.06] hover:text-white/50'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="hidden xl:grid grid-cols-[28px_1fr_100px_120px_80px_70px_80px_90px_48px] gap-2 px-5 py-2.5 border-b border-white/[0.05]">
            {['', 'Alert', 'Artist / Market', 'Signal Type', 'Scout', 'Severity', 'Region', 'Time', ''].map(h => (
              <span key={h} className="text-[9px] font-mono text-white/15 uppercase tracking-widest">{h}</span>
            ))}
          </div>

          <div className="divide-y divide-white/[0.03]">
            {filtered.map(alert => {
              const sc = SEV_CONFIG[alert.severity];
              return (
                <div key={alert.id}
                  className={`flex items-start gap-3 px-5 py-3.5 border-l-2 ${sc.border} ${sc.row} transition-colors cursor-pointer xl:grid xl:grid-cols-[28px_1fr_100px_120px_80px_70px_80px_90px_48px] xl:items-center`}
                  onClick={() => setSelected(alert)}>
                  <div className={`mt-1.5 xl:mt-0 w-1.5 h-1.5 rounded-full shrink-0 ${sc.dot}`} />
                  <div className="flex-1 xl:flex-none min-w-0">
                    <p className="text-[12.5px] font-medium text-white/85 leading-snug truncate">{alert.title}</p>
                    <p className="text-[10px] text-white/30 mt-0.5 xl:hidden">{alert.artistOrMarket} · {alert.scout} · {alert.ts}</p>
                  </div>
                  <span className="hidden xl:block text-[11px] text-white/55 truncate">{alert.artistOrMarket}</span>
                  <span className="hidden xl:block text-[10px] font-mono text-white/35 truncate">{alert.signalType}</span>
                  <span className="hidden xl:block text-[11px] text-white/50">{alert.scout}</span>
                  <span className={`hidden xl:inline-flex text-[8.5px] font-mono px-1.5 py-0.5 rounded border ${sc.pill}`}>{alert.severity}</span>
                  <span className="hidden xl:block text-[10px] text-white/30 truncate">{alert.region}</span>
                  <span className="hidden xl:flex items-center gap-1 text-[10px] font-mono text-white/20">
                    <Clock className="w-2.5 h-2.5 shrink-0" />{alert.ts}
                  </span>
                  <div className="hidden xl:flex items-center gap-1.5 shrink-0">
                    <button onClick={e => { e.stopPropagation(); setSelected(alert); }}
                      className="p-1.5 rounded hover:bg-[#EF4444]/[0.08] text-white/20 hover:text-[#EF4444] transition-colors">
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button onClick={e => { e.stopPropagation(); setDismissed(p => new Set([...p, alert.id])); }}
                      className="p-1.5 rounded hover:bg-white/[0.05] text-white/15 hover:text-white/40 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <AlertTriangle className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-[13px] text-white/25">No alerts match your filters</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-end" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg h-full bg-[#0C0D10] border-l border-white/[0.08] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>
            <div className={`p-5 border-b border-white/[0.07] border-l-4 ${SEV_CONFIG[selected.severity].border}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex text-[9px] font-mono px-2 py-0.5 rounded border mb-2 ${SEV_CONFIG[selected.severity].pill}`}>{selected.severity}</span>
                  <h2 className="text-[15px] font-bold text-white mb-1">{selected.title}</h2>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/30">
                    <span>{selected.artistOrMarket}</span>
                    <span>·</span>
                    <span>{selected.signalType}</span>
                    <span>·</span>
                    <span>{selected.ts}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/20 hover:text-white/60 transition-colors mt-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <p className="text-[11px] font-mono text-white/25 uppercase tracking-wider mb-2">Intelligence Summary</p>
                <p className="text-[13px] text-white/70 leading-relaxed">{selected.body}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Network, label: 'Scout', value: selected.scout },
                  { icon: Globe, label: 'Region', value: selected.region },
                  { icon: Zap, label: 'Signal Type', value: selected.signalType },
                  { icon: Clock, label: 'Timestamp', value: selected.ts },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className="w-3 h-3 text-white/20" />
                      <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-[12px] text-white/65">{value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Open Artist Profile', color: '#06B6D4', action: () => navigate('/dashboard/rocksteady/hot-artists') },
                    { label: 'Open Market View', color: '#F59E0B', action: () => navigate('/dashboard/rocksteady/heatmaps') },
                    { label: 'Assign Review', color: '#10B981', action: () => {} },
                    { label: 'Escalate', color: '#EF4444', action: () => {} },
                  ].map(({ label, color, action }) => (
                    <button key={label} onClick={action}
                      className="py-2.5 px-3 rounded-lg text-[11px] font-medium border transition-all flex items-center justify-center gap-1.5"
                      style={{ color, borderColor: `${color}30`, background: `${color}0D` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}1A`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}0D`; }}>
                      {label} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={() => { setDismissed(p => new Set([...p, selected.id])); setSelected(null); }}
                className="w-full py-2.5 rounded-lg text-[11px] text-white/25 border border-white/[0.06] hover:text-white/50 hover:border-white/15 transition-all">
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
