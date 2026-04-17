import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { OVERVIEW_STATS } from '../../data/artistOSData';
import { injectLiveCSS } from '../../utils/liveSystem';

const PROGRESS_PCTS: Record<string, number> = {
  streams: 72,
  followers: 58,
  revenue: 84,
  releases: 40,
  engagement: 74,
};

const LAST_UPDATED: Record<string, string> = {
  streams: '3m ago',
  followers: '12m ago',
  revenue: '1h ago',
  releases: '6h ago',
  engagement: '8m ago',
};

const IS_LIVE: Record<string, boolean> = {
  streams: true,
  followers: true,
  revenue: false,
  releases: false,
  engagement: true,
};

function ProgressBar({ pct, color, delay }: { pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ref.current = setTimeout(() => setWidth(pct), 80 + delay);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [pct, delay]);

  return (
    <div style={{ height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', marginTop: 8 }}>
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: 2,
          boxShadow: `0 0 6px ${color}50`,
          transition: 'width 0.85s cubic-bezier(0.25,1,0.5,1)',
        }}
      />
    </div>
  );
}

export default function ArtistOverview() {
  useEffect(() => { injectLiveCSS(); }, []);
  const [signalled, setSignalled] = useState<Set<string>>(new Set());

  useEffect(() => {
    const liveIds = Object.entries(IS_LIVE).filter(([, v]) => v).map(([k]) => k);
    let idx = 0;
    const cycle = () => {
      const id = liveIds[idx % liveIds.length];
      setSignalled(prev => new Set(prev).add(id));
      setTimeout(() => setSignalled(prev => {
        const n = new Set(prev); n.delete(id); return n;
      }), 1800);
      idx++;
    };
    const t = setInterval(cycle, 9000);
    const t0 = setTimeout(cycle, 2400);
    return () => { clearInterval(t); clearTimeout(t0); };
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {OVERVIEW_STATS.map((stat, i) => {
        const isLive = IS_LIVE[stat.id];
        const isSignalled = signalled.has(stat.id);
        return (
          <div
            key={stat.id}
            className="relative bg-[#0D0E11] border border-white/[0.06] rounded-xl p-4 overflow-hidden group hover:border-white/[0.12] transition-all ls-fade-up"
            style={{
              animationDelay: `${i * 60}ms`,
              border: isSignalled ? `1px solid ${stat.color}30` : undefined,
              boxShadow: isSignalled ? `0 0 16px ${stat.color}08, inset 0 0 12px ${stat.color}04` : undefined,
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
              style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
            />
            <div
              className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full opacity-[0.06]"
              style={{ background: stat.color }}
            />

            {/* Live badge */}
            {isLive && (
              <div style={{ position: 'absolute', top: 9, right: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ position: 'relative', display: 'inline-flex', width: 6, height: 6 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: stat.color, opacity: 0.4, animation: 'ls-ring-ping 2s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span className="ls-live-dot" style={{ position: 'relative', width: 6, height: 6, borderRadius: '50%', background: stat.color, display: 'inline-block' }} />
                </span>
              </div>
            )}

            <p
              className="text-[28px] font-bold leading-none font-['Satoshi',sans-serif]"
              style={{
                color: stat.color,
                animation: isSignalled ? 'ls-number-pop 0.5s cubic-bezier(0.16,1,0.3,1)' : undefined,
              }}
            >
              {stat.value}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 mb-1">
              {stat.delta_dir === 'up' ? (
                <TrendingUp className="w-3 h-3 text-[#10B981]" />
              ) : stat.delta_dir === 'down' ? (
                <TrendingDown className="w-3 h-3 text-[#EF4444]" />
              ) : (
                <Minus className="w-3 h-3 text-white/20" />
              )}
              <span className={`text-[11px] font-mono font-semibold ${
                stat.delta_dir === 'up' ? 'text-[#10B981]' :
                stat.delta_dir === 'down' ? 'text-[#EF4444]' :
                'text-white/25'
              }`}>{stat.delta}</span>
            </div>
            <p className="text-[9px] font-mono text-white/22 uppercase tracking-widest">{stat.label}</p>
            <p className="text-[9px] text-white/15 mt-0.5 truncate">{stat.sub}</p>

            <ProgressBar pct={PROGRESS_PCTS[stat.id] ?? 50} color={stat.color} delay={i * 80} />

            <p style={{ margin: '5px 0 0', fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.13)', letterSpacing: '0.06em' }}>
              {isLive ? 'LIVE' : 'UPDATED'} · {LAST_UPDATED[stat.id] ?? '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
