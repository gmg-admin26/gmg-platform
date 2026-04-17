import { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Users, Radio, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SignalCard from '../components/SignalCard';
import AIInsightPanel from '../components/AIInsightPanel';
import ActivityFeed from '../components/ActivityFeed';
import StatusTag from '../components/StatusTag';
import LiveSystemFeed from '../components/LiveSystemFeed';
import { SIGNAL_CARDS, ARTISTS, CAMPAIGNS } from '../data/mockData';
import { useAuth } from '../../auth/AuthContext';

const TOP_ALERTS = [
  { id: 1, level: 'critical', title: 'Nova Blaze — Velocity Spike', body: 'Streaming up +847% in 6h. Tier-1 signal triggered.', action: 'Review Signal' },
  { id: 2, level: 'warning', title: 'Campaign C-0041 CTR Below Floor', body: 'Current: 0.8% vs 1.2% threshold. Creative rotation needed.', action: 'View Campaign' },
  { id: 3, level: 'critical', title: 'Drift Current — Distribution Block', body: 'Day 12. No resolution. Estimated loss: $2.8K/wk.', action: 'Escalate' },
];

const ALERT_STYLES: Record<string, { border: string; bg: string; dot: string; text: string }> = {
  critical: { border: 'border-[#EF4444]/30', bg: 'bg-[#EF4444]/5', dot: 'bg-[#EF4444] animate-pulse', text: 'text-[#EF4444]' },
  warning: { border: 'border-[#F59E0B]/30', bg: 'bg-[#F59E0B]/5', dot: 'bg-[#F59E0B]', text: 'text-[#F59E0B]' },
  info: { border: 'border-[#06B6D4]/30', bg: 'bg-[#06B6D4]/5', dot: 'bg-[#06B6D4]', text: 'text-[#06B6D4]' },
};

function LiveSparkline({ accent }: { accent: string }) {
  const points = Array.from({ length: 20 }, (_, i) => ({
    x: i * 5,
    y: 30 - Math.random() * 20,
  }));
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <svg width="100" height="32" viewBox="0 0 100 32" className="opacity-60">
      <path d={d} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CommandCenter() {
  const [now, setNow] = useState(new Date());
  const { rocksteadyAuth } = useAuth();
  const isInternalSession = rocksteadyAuth.authenticated;
  const showInternal = isInternalSession;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const topArtists = ARTISTS.slice(0, 5);
  const topCampaigns = CAMPAIGNS.slice(0, 4);

  return (
    <div className="p-6 space-y-6 min-h-full">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Command Center</h1>
          <p className="text-[12px] text-white/30 mt-0.5 font-mono">
            {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            {' · '}
            <span className="text-[#10B981]">● LIVE</span>
          </p>
        </div>
        {showInternal && (
          <Link
            to="/dashboard/rocksteady"
            className="flex items-center gap-1.5 text-[11px] text-[#06B6D4] hover:text-white transition-colors font-mono"
          >
            <Radio className="w-3.5 h-3.5" />
            Rocksteady Signals
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Priority Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TOP_ALERTS.map(alert => {
          const s = ALERT_STYLES[alert.level];
          return (
            <div key={alert.id} className={`rounded-lg border ${s.border} ${s.bg} p-4`}>
              <div className="flex items-start gap-2.5">
                <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[11px] font-semibold ${s.text} mb-1`}>{alert.title}</p>
                  <p className="text-[11px] text-white/50 leading-snug">{alert.body}</p>
                  <button className={`mt-2 text-[10px] font-mono ${s.text} hover:underline tracking-wider`}>
                    {alert.action} →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Signal Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {SIGNAL_CARDS.map(card => (
          <SignalCard key={card.id} {...card} />
        ))}
      </div>

      {/* AI Insight */}
      <AIInsightPanel />

      {/* Middle row: Artists + Campaigns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Artist Roster (top 5) */}
        <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-white/30" />
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Artist Roster</span>
            </div>
            <Link
              to={showInternal ? '/dashboard/artists' : '/dashboard/artist-os/roster'}
              className="text-[10px] font-mono text-[#06B6D4] hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topArtists.map(artist => (
              <div key={artist.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0">
                  {artist.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-white truncate">{artist.name}</p>
                  <p className="text-[10px] text-white/30">{artist.genre}</p>
                </div>
                <div className="hidden md:flex items-center">
                  <LiveSparkline accent={
                    artist.status === 'Scaling' ? '#06B6D4' :
                    artist.status === 'Risk' || artist.status === 'Blocked' ? '#EF4444' : '#10B981'
                  } />
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[11px] font-mono font-medium ${
                    artist.velocity.startsWith('+') ? 'text-[#10B981]' :
                    artist.velocity === '0%' ? 'text-white/30' : 'text-[#EF4444]'
                  }`}>{artist.velocity}</p>
                  <p className="text-[10px] text-white/25">{artist.streams}</p>
                </div>
                <StatusTag status={artist.status} pulse />
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-white/30" />
              <span className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Live Campaigns</span>
            </div>
            <Link
              to={showInternal ? '/dashboard/campaigns' : '/dashboard/artist-os/campaign-center'}
              className="text-[10px] font-mono text-[#06B6D4] hover:text-white transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {topCampaigns.map(c => (
              <div key={c.id} className="px-5 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-[13px] font-medium text-white">{c.name}</p>
                    <p className="text-[10px] text-white/30 font-mono">{c.id} · {c.type}</p>
                  </div>
                  <StatusTag status={c.status} pulse />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white/[0.06] rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#3B82F6] transition-all"
                      style={{ width: `${Math.round((parseInt(c.spent.replace(/\D/g,'')) / parseInt(c.budget.replace(/\D/g,''))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 shrink-0">
                    {c.spent} / {c.budget}
                  </span>
                  <span className={`text-[10px] font-mono shrink-0 ${
                    c.ctr === '—' ? 'text-white/20' :
                    parseFloat(c.ctr) >= 2 ? 'text-[#10B981]' :
                    parseFloat(c.ctr) >= 1 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
                  }`}>
                    CTR {c.ctr}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Activity + Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-4">
          <ActivityFeed />
          <LiveSystemFeed variant="strip" title="System Feed" />
        </div>
        <div className="space-y-4">
          <LiveSystemFeed variant="rail" maxVisible={8} title="Live Feed" />
          <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-5">
          <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-4">Platform Health</p>
          {[
            { label: 'Rocksteady Engine', status: 'Operational', pct: 100 },
            { label: 'Campaign Delivery', status: 'Operational', pct: 98 },
            { label: 'Catalog Sync', status: 'Degraded', pct: 81 },
            { label: 'Revenue Pipeline', status: 'Operational', pct: 100 },
            { label: 'AI Insights API', status: 'Operational', pct: 99 },
          ].map(item => (
            <div key={item.label} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-white/50">{item.label}</span>
                <span className={`text-[10px] font-mono ${
                  item.status === 'Operational' ? 'text-[#10B981]' : 'text-[#F59E0B]'
                }`}>{item.pct}%</span>
              </div>
              <div className="h-[3px] bg-white/[0.06] rounded-full">
                <div
                  className={`h-[3px] rounded-full ${
                    item.status === 'Operational' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'
                  }`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

    </div>
  );
}
