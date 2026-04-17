import { useEffect, useRef, useState } from 'react';
import { Radio, Zap, Globe, TrendingUp, ChevronDown, RefreshCw } from 'lucide-react';
import { GLOBAL_SIGNALS } from '../../data/opsData';
import { injectLiveCSS } from '../../utils/liveSystem';

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'Stream Spike': TrendingUp,
  'Social Velocity': Zap,
  'Playlist Add': Radio,
  'Geographic Surge': Globe,
  'Sync Inquiry': Radio,
  'Campaign Surge': TrendingUp,
  'Catalog Revival': TrendingUp,
};

const LEVEL_CONFIG: Record<string, { bar: string; barHex: string; badge: string; border: string; glow: string }> = {
  critical: { bar: 'bg-[#EF4444]', barHex: '#EF4444', badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20', border: 'border-l-[#EF4444]', glow: 'rgba(239,68,68,0.08)' },
  high:     { bar: 'bg-[#F59E0B]', barHex: '#F59E0B', badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20', border: 'border-l-[#F59E0B]', glow: 'rgba(245,158,11,0.06)' },
  medium:   { bar: 'bg-[#06B6D4]', barHex: '#06B6D4', badge: 'bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20', border: 'border-l-[#06B6D4]', glow: 'rgba(6,182,212,0.05)' },
};

const RERANKED_AGO = ['1m ago', '4m ago', '2m ago', '7m ago', '12m ago', '3m ago', '9m ago', '15m ago'];

function AnimatedMagnitudeBar({ value, unit, level, delay = 0 }: { value: number; unit: string; level: string; delay?: number }) {
  const cfg = LEVEL_CONFIG[level];
  const pct = unit === '%' ? Math.min(100, (value / 1500) * 100)
    : unit === 'playlists' ? Math.min(100, (value / 20) * 100)
    : unit === '% CTR' ? Math.min(100, (value / 5) * 100)
    : Math.min(100, (value / 10) * 100);

  const [width, setWidth] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    ref.current = setTimeout(() => setWidth(pct), 120 + delay);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${cfg.bar}`}
          style={{
            width: `${width}%`,
            transition: 'width 0.85s cubic-bezier(0.25,1,0.5,1)',
            boxShadow: `0 0 5px ${cfg.barHex}50`,
          }}
        />
      </div>
      <span className={`text-[11px] font-mono font-bold ${cfg.badge.split(' ')[1]}`}>
        {unit === '%' || unit === '% CTR' ? `+${value}${unit}` : `${value} ${unit}`}
      </span>
    </div>
  );
}

export default function GlobalSignalMonitor() {
  useEffect(() => { injectLiveCSS(); }, []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState('all');
  const [flashedRows, setFlashedRows] = useState<Set<string>>(new Set());
  const [rerankTs, setRerankTs] = useState('1m ago');

  const visible = levelFilter === 'all' ? GLOBAL_SIGNALS : GLOBAL_SIGNALS.filter(s => s.level === levelFilter);

  useEffect(() => {
    const ids = GLOBAL_SIGNALS.map(s => s.id);
    let idx = 0;
    const tick = () => {
      if (!ids[idx]) return;
      const id = ids[idx % ids.length];
      setFlashedRows(prev => new Set(prev).add(id));
      setRerankTs(RERANKED_AGO[idx % RERANKED_AGO.length]);
      setTimeout(() => setFlashedRows(prev => { const n = new Set(prev); n.delete(id); return n; }), 1600);
      idx++;
    };
    const t = setInterval(tick, 11000);
    const t0 = setTimeout(tick, 3200);
    return () => { clearInterval(t); clearTimeout(t0); };
  }, []);

  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06] bg-[#0A0B0D]">
        <div className="flex items-center gap-2">
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#EF4444', opacity: 0.4, animation: 'ls-ring-ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span className="ls-live-dot-urgent" style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
          </span>
          <Radio className="w-4 h-4 text-[#06B6D4]" />
          <span className="text-[12px] font-semibold text-white/70 tracking-wide">Global Signal Monitor</span>
          <span className="text-[9px] font-mono text-white/20 ml-1">// LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 ml-3">
          <RefreshCw style={{ width: 8, height: 8, color: 'rgba(255,255,255,0.18)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>Re-ranked {rerankTs}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {['all', 'critical', 'high', 'medium'].map(f => (
            <button
              key={f}
              onClick={() => setLevelFilter(f)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono tracking-wider transition-all ${
                levelFilter === f
                  ? f === 'critical' ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                  : f === 'high' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                  : f === 'medium' ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                  : 'bg-white/[0.06] text-white/60 border border-white/[0.12]'
                  : 'text-white/25 border border-white/[0.06] hover:border-white/[0.15] hover:text-white/50'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {visible.map((sig, i) => {
          const cfg = LEVEL_CONFIG[sig.level];
          const Icon = TYPE_ICON[sig.type] ?? TrendingUp;
          const isOpen = expanded === sig.id;
          const isFlashed = flashedRows.has(sig.id);
          return (
            <div
              key={sig.id}
              className={`border-l-2 ${cfg.border} cursor-pointer transition-all ls-fade-up`}
              style={{
                animationDelay: `${i * 45}ms`,
                background: isFlashed ? `${cfg.glow}` : 'transparent',
                boxShadow: isFlashed ? `inset 3px 0 0 ${cfg.barHex}30` : undefined,
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}
              onClick={() => setExpanded(isOpen ? null : sig.id)}
            >
              <div className="px-5 py-3 hover:bg-white/[0.012] transition-colors">
                <div className="grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-3 flex items-start gap-2.5">
                    <div className={`mt-0.5 w-6 h-6 rounded flex items-center justify-center shrink-0 border ${cfg.badge}`}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white leading-tight">{sig.artist}</p>
                      <p className="text-[10px] text-white/30 truncate">{sig.asset}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[11px] text-white/55">{sig.type}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-mono text-white/25">{sig.platform}</span>
                      {sig.geo !== '—' && (
                        <>
                          <span className="text-white/15">·</span>
                          <span className="text-[10px] font-mono text-white/20">{sig.geo}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3">
                    <AnimatedMagnitudeBar value={sig.magnitude} unit={sig.unit} level={sig.level} delay={i * 60} />
                  </div>

                  <div className="col-span-3">
                    <p className="text-[11px] text-white/45 leading-snug line-clamp-2">{sig.action}</p>
                  </div>

                  <div className="col-span-1 flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-mono ${isFlashed ? 'text-white/50' : 'text-white/20'} transition-colors`}>{sig.ts}</span>
                    <ChevronDown className={`w-3 h-3 text-white/15 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-white/[0.05] grid grid-cols-3 gap-4 ls-fade-up">
                    <div>
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-1">Signal ID</p>
                      <p className="text-[12px] font-mono text-white/50">{sig.id}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-wider mb-1">Recommended Action</p>
                      <p className="text-[12px] text-[#06B6D4] leading-snug">{sig.action}</p>
                    </div>
                    <div className="col-span-3 flex gap-2">
                      <button className="px-3 py-1.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[11px] text-[#06B6D4] hover:bg-[#06B6D4]/20 transition-colors flex items-center gap-1.5">
                        <Zap className="w-3 h-3" />
                        Take Action
                      </button>
                      <button className="px-3 py-1.5 rounded border border-white/[0.08] text-[11px] text-white/35 hover:text-white/65 hover:border-white/[0.15] transition-colors">
                        Dismiss Signal
                      </button>
                      <button className="px-3 py-1.5 rounded border border-white/[0.08] text-[11px] text-white/35 hover:text-white/65 hover:border-white/[0.15] transition-colors">
                        Assign to Team
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
