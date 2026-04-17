import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScanSearch, Activity, Zap, Globe, Network, TrendingUp,
  Clock, AlertTriangle, ChevronRight, Filter
} from 'lucide-react';

interface SignalPulse {
  id: string;
  category: string;
  title: string;
  detail: string;
  count: number;
  delta: string;
  deltaDir: '+' | '-';
  scout: string;
  region: string;
  ts: string;
  color: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

const SIGNAL_PULSES: SignalPulse[] = [
  { id: 'SP-01', category: 'TikTok Spikes', title: 'TikTok viral breakouts detected', detail: '14 artists crossing 1M TikTok uses in under 48h. Zara Vex, DXTR, and 12 others.', count: 14, delta: '+3 in 1h', deltaDir: '+', scout: 'Nova', region: 'Global', ts: '8m ago', color: '#EF4444', priority: 'critical' },
  { id: 'SP-02', category: 'Streaming Acceleration', title: 'Streaming velocity events active', detail: '8 artists showing streaming acceleration above 300% 7-day baseline. Multiple scout confirmations.', count: 8, delta: '+1 today', deltaDir: '+', scout: 'Rift', region: 'US / Global', ts: '22m ago', color: '#F59E0B', priority: 'high' },
  { id: 'SP-03', category: 'Scout Confirmations', title: 'Scout-confirmed discoveries today', detail: '5 scouts have submitted confirmations today. Nova, Prism, Flare, Vibe, and Nexus have all filed reports.', count: 5, delta: 'today', deltaDir: '+', scout: 'Multiple', region: 'Global', ts: '45m ago', color: '#10B981', priority: 'high' },
  { id: 'SP-04', category: 'New Market Signals', title: 'Emerging market signals flagged', detail: 'Lagos, Berlin, and Seoul markets showing elevated signal activity. New artist entries above threshold.', count: 3, delta: 'this week', deltaDir: '+', scout: 'Prism / Drift / Halo', region: 'International', ts: '1h ago', color: '#06B6D4', priority: 'medium' },
  { id: 'SP-05', category: 'Editorial Activity', title: 'DSP editorial additions detected', detail: 'Spotify and Apple Music editorial teams have added 6 new artists to feature playlists. NMF activity elevated.', count: 6, delta: '+2 today', deltaDir: '+', scout: 'Nova', region: 'Global', ts: '2h ago', color: '#F59E0B', priority: 'medium' },
  { id: 'SP-06', category: 'Cross-Genre Events', title: 'Cross-genre crossover signals', detail: 'Artists showing dual-genre streaming audiences. Latin-to-English and Afrobeats-to-Pop most active.', count: 4, delta: 'active', deltaDir: '+', scout: 'Vibe / Flare', region: 'US / Global', ts: '3h ago', color: '#06B6D4', priority: 'medium' },
  { id: 'SP-07', category: 'Breakout Watch', title: 'Pre-breakout window open', detail: '7 artists in pre-breakout phase. Estimated 14–30 day windows to mainstream exposure based on current trajectory.', count: 7, delta: 'active', deltaDir: '+', scout: 'Multiple', region: 'Global', ts: '4h ago', color: '#EF4444', priority: 'high' },
  { id: 'SP-08', category: 'Sync Signals', title: 'Sync inquiry volume elevated', detail: '3 scouts reporting increased sync inquiry activity. Nashville and folk artists primary focus.', count: 3, delta: 'this week', deltaDir: '+', scout: 'Nexus', region: 'Nashville / Global', ts: '5h ago', color: '#10B981', priority: 'low' },
];

const RADAR_EVENTS = [
  { time: '8m ago',  event: 'Nova confirmed Zara Vex TikTok breakout — velocity threshold crossed', color: '#EF4444', priority: 'critical' },
  { time: '22m ago', event: 'Rift flagged DXTR streaming acceleration — 3 platform editorial adds', color: '#F59E0B', priority: 'high' },
  { time: '45m ago', event: 'Prism filed Lagos market report — 4 new artists above radar threshold', color: '#10B981', priority: 'high' },
  { time: '1h ago',  event: 'Halo detected Seoul breakout signal — Asia streaming alert sent', color: '#06B6D4', priority: 'medium' },
  { time: '2h ago',  event: 'Flare confirmed Mako Sol NMF add — sign-window clock started', color: '#10B981', priority: 'high' },
  { time: '3h ago',  event: 'Vibe reported Kael Torres Latin-to-English crossover momentum', color: '#F59E0B', priority: 'medium' },
  { time: '4h ago',  event: 'Drift filed Berlin underground report — 2 artists entering breakout window', color: '#06B6D4', priority: 'medium' },
  { time: '5h ago',  event: 'Nexus flagged sync inquiry spike — Nashville market elevated', color: '#10B981', priority: 'low' },
  { time: '6h ago',  event: 'AI scoring model refreshed — 6 artists re-ranked based on new signals', color: '#06B6D4', priority: 'low' },
  { time: '8h ago',  event: 'Cipher submitted London R&B scene report — 1 new discovery flagged', color: '#10B981', priority: 'low' },
];

const PRIORITY_CONFIG = {
  critical: { dot: 'bg-[#EF4444] animate-pulse', pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25', border: 'border-l-[#EF4444]' },
  high:     { dot: 'bg-[#F59E0B]',               pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', border: 'border-l-[#F59E0B]' },
  medium:   { dot: 'bg-[#06B6D4]',               pill: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', border: 'border-l-[#06B6D4]' },
  low:      { dot: 'bg-white/25',                pill: 'bg-white/5 text-white/30 border-white/10',             border: 'border-l-white/10' },
};

const REGIONS = ['All', 'Global', 'US / Global', 'International', 'Nashville / Global', 'Lagos', 'Berlin / EU', 'Seoul'];
const TIMEFRAMES = ['Live', '1H', '6H', '24H', '7D'];
const GENRES = ['All', 'Alt-Pop', 'Electronic', 'Afrobeats', 'R&B', 'Latin Urban', 'Folk', 'Hyperpop', 'Drill'];

export default function DiscoveryRadar() {
  const navigate = useNavigate();
  const [region, setRegion] = useState('All');
  const [timeframe, setTimeframe] = useState('Live');
  const [genre, setGenre] = useState('All');

  const totalSignals = SIGNAL_PULSES.reduce((a, s) => a + s.count, 0);
  const criticalCount = SIGNAL_PULSES.filter(s => s.priority === 'critical').reduce((a, s) => a + s.count, 0);
  const scoutConfirmations = SIGNAL_PULSES.find(s => s.category === 'Scout Confirmations')?.count || 0;
  const breakoutWatch = SIGNAL_PULSES.find(s => s.category === 'Breakout Watch')?.count || 0;
  const newMarkets = SIGNAL_PULSES.find(s => s.category === 'New Market Signals')?.count || 0;

  return (
    <div className="min-h-full bg-[#07080A]">
      <div className="relative bg-[#09090D] border-b border-[#F59E0B]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center shrink-0">
              <ScanSearch className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-white leading-tight">Discovery Radar</h1>
              <p className="text-[10.5px] text-white/25">Real-time signal pulse board · A&R intelligence feed</p>
            </div>
          </div>

          <div className="flex gap-3 ml-auto flex-wrap">
            {[
              { label: 'Active Signals', value: totalSignals, color: '#EF4444' },
              { label: 'Critical', value: criticalCount, color: '#F59E0B' },
              { label: 'Scout Confirmed', value: scoutConfirmations, color: '#10B981' },
              { label: 'Breakout Watch', value: breakoutWatch, color: '#06B6D4' },
              { label: 'New Markets', value: newMarkets, color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-3.5 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl text-center">
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                <p className="text-[16px] font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-center gap-3 flex-wrap p-3.5 bg-[#0A0B0E] border border-white/[0.07] rounded-xl">
          <Filter className="w-3 h-3 text-white/15 shrink-0" />
          {[
            ['Region', REGIONS, region, setRegion],
            ['Genre', GENRES, genre, setGenre],
          ].map(([label, opts, val, setter]) => (
            <div key={String(label)} className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-white/25">{String(label)}:</span>
              <select value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                className="px-2 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/60 focus:outline-none">
                {(opts as string[]).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}

          <div className="flex items-center gap-1.5 ml-auto bg-white/[0.03] border border-white/[0.06] rounded-lg p-1">
            {TIMEFRAMES.map(t => (
              <button key={t} onClick={() => setTimeframe(t)}
                className={`px-2.5 py-1 rounded text-[10px] font-mono transition-all ${timeframe === t ? 'bg-[#F59E0B]/12 text-[#F59E0B] border border-[#F59E0B]/25' : 'text-white/30 hover:text-white/60'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {SIGNAL_PULSES.slice(0, 4).map(pulse => {
            const pc = PRIORITY_CONFIG[pulse.priority];
            return (
              <div key={pulse.id} className={`relative p-4 bg-[#0A0B0E] border border-white/[0.07] rounded-xl border-l-2 ${pc.border} overflow-hidden`}>
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-10" style={{ background: pulse.color }} />
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center`} style={{ background: `${pulse.color}15`, border: `1px solid ${pulse.color}25` }}>
                    <Activity className="w-3.5 h-3.5" style={{ color: pulse.color }} />
                  </div>
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${pc.pill}`}>{pulse.priority.toUpperCase()}</span>
                </div>
                <p className="text-[32px] font-bold leading-none mb-1" style={{ color: pulse.color }}>{pulse.count}</p>
                <p className="text-[11px] text-white/65 mb-1 leading-tight">{pulse.category}</p>
                <p className="text-[10px] font-mono" style={{ color: pulse.color }}>{pulse.delta}</p>
                <p className="text-[9px] font-mono text-white/20 mt-0.5">{pulse.ts}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
          <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
              <div className="w-[3px] h-4 rounded-full bg-[#F59E0B]" />
              <span className="text-[13px] font-semibold text-white/85">Signal Pulse Board</span>
              <span className="text-[9px] font-mono text-white/15">// ALL ACTIVE SIGNAL CATEGORIES</span>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[9px] font-mono text-[#10B981]">LIVE</span>
              </div>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {SIGNAL_PULSES.map(pulse => {
                const pc = PRIORITY_CONFIG[pulse.priority];
                return (
                  <div key={pulse.id} className={`flex items-start gap-4 px-5 py-4 border-l-2 ${pc.border} hover:bg-white/[0.015] transition-colors cursor-pointer`}
                    onClick={() => navigate('/dashboard/rocksteady/discoveries')}>
                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${pc.dot}`} />
                    <div className="w-[3px] shrink-0 self-stretch rounded-full" style={{ background: pulse.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.07]">{pulse.category}</span>
                        <span className="text-[13px] font-semibold text-white/85">{pulse.title}</span>
                      </div>
                      <p className="text-[11px] text-white/40 leading-relaxed">{pulse.detail}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[9.5px] font-mono">
                        <span className="text-white/20 flex items-center gap-1"><Network className="w-2.5 h-2.5" /> {pulse.scout}</span>
                        <span className="text-white/20 flex items-center gap-1"><Globe className="w-2.5 h-2.5" /> {pulse.region}</span>
                        <span className="text-white/15 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {pulse.ts}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[28px] font-bold leading-none mb-0.5" style={{ color: pulse.color }}>{pulse.count}</p>
                      <p className="text-[9px] font-mono" style={{ color: pulse.color }}>{pulse.delta}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/15 shrink-0 self-center" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06]">
                <div className="w-[3px] h-4 rounded-full bg-[#06B6D4]" />
                <span className="text-[13px] font-semibold text-white/85">Radar Event Timeline</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {RADAR_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.01] transition-colors">
                    <div className="flex flex-col items-center gap-1 shrink-0 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: ev.color }} />
                      {i < RADAR_EVENTS.length - 1 && <div className="w-[1px] h-6 bg-white/[0.05]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/55 leading-snug">{ev.event}</p>
                      <p className="text-[9.5px] font-mono text-white/18 mt-0.5">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="text-[12px] font-semibold text-white/75">Signal Category Summary</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'TikTok / Social Viral', count: 14, color: '#EF4444' },
                  { label: 'Streaming Acceleration', count: 8, color: '#F59E0B' },
                  { label: 'Scout Confirmations', count: 5, color: '#10B981' },
                  { label: 'Emerging Markets', count: 3, color: '#06B6D4' },
                  { label: 'Editorial / Playlist', count: 6, color: '#F59E0B' },
                  { label: 'Cross-Genre Crossover', count: 4, color: '#06B6D4' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[11px] text-white/50 flex-1 truncate">{label}</span>
                    <div className="w-24 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(count / 14) * 100}%`, background: color }} />
                    </div>
                    <span className="text-[11px] font-mono font-bold w-4 text-right" style={{ color }}>{count}</span>
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
