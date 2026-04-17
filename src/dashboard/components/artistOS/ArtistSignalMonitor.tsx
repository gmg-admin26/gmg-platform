import { useEffect, useRef, useState } from 'react';
import { Radio, Zap, TrendingUp, Globe, ChevronDown, ChevronUp, ArrowRight, RefreshCw, Target, Clock, ArrowUpRight } from 'lucide-react';
import { ARTIST_SIGNALS } from '../../data/artistOSData';
import { injectLiveCSS } from '../../utils/liveSystem';

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  'Stream Spike': TrendingUp,
  'Social Velocity': Zap,
  'Playlist Add': Radio,
  'Geographic Surge': Globe,
};

const LEVEL_STYLES: Record<string, { pill: string; bar: string; barHex: string; border: string; glow: string }> = {
  critical: {
    pill: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25',
    bar: 'bg-[#EF4444]',
    barHex: '#EF4444',
    border: 'border-l-[#EF4444]',
    glow: 'rgba(239,68,68,0.07)',
  },
  high: {
    pill: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
    bar: 'bg-[#F59E0B]',
    barHex: '#F59E0B',
    border: 'border-l-[#F59E0B]',
    glow: 'rgba(245,158,11,0.06)',
  },
};

const RERANKED_AGO = ['1m ago', '3m ago', '6m ago', '2m ago', '8m ago', '4m ago'];

function AnimatedMagnitudeBar({ magnitude, level, delay = 0 }: { magnitude: string; level: string; delay?: number }) {
  const styles = LEVEL_STYLES[level] ?? LEVEL_STYLES.high;
  const num = parseFloat(magnitude.replace(/[^0-9.]/g, ''));
  const pct = Math.min(100, (num / 2000) * 100);
  const [width, setWidth] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    ref.current = setTimeout(() => setWidth(pct), 100 + delay);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [pct, delay]);

  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${styles.bar}`}
          style={{
            width: `${width}%`,
            transition: 'width 0.85s cubic-bezier(0.25,1,0.5,1)',
            boxShadow: `0 0 5px ${styles.barHex}50`,
          }}
        />
      </div>
      <span className={`text-[11px] font-mono font-bold ${styles.pill.split(' ')[1]}`}>{magnitude}</span>
    </div>
  );
}

export default function ArtistSignalMonitor() {
  useEffect(() => { injectLiveCSS(); }, []);
  const [expanded, setExpanded] = useState<string>('AS-001');
  const [flashedRows, setFlashedRows] = useState<Set<string>>(new Set());
  const [rerankTs, setRerankTs] = useState('2m ago');

  useEffect(() => {
    const ids = ARTIST_SIGNALS.map(s => s.id);
    let idx = 0;
    const tick = () => {
      const id = ids[idx % ids.length];
      setFlashedRows(prev => new Set(prev).add(id));
      setRerankTs(RERANKED_AGO[idx % RERANKED_AGO.length]);
      setTimeout(() => setFlashedRows(prev => { const n = new Set(prev); n.delete(id); return n; }), 1600);
      idx++;
    };
    const t = setInterval(tick, 12000);
    const t0 = setTimeout(tick, 3500);
    return () => { clearInterval(t); clearTimeout(t0); };
  }, []);

  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#09090C]">
        <div className="flex items-center gap-2">
          <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#EF4444', opacity: 0.4, animation: 'ls-ring-ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
            <span className="ls-live-dot-urgent" style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
          </span>
          <Radio className="w-4 h-4 text-[#06B6D4]" />
          <span className="text-[13px] font-semibold text-white/80">Signal Monitor</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <RefreshCw style={{ width: 8, height: 8, color: 'rgba(255,255,255,0.18)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>Re-ranked {rerankTs}</span>
        </div>
        <span className="text-[9px] font-mono text-white/20 tracking-widest ml-1">// LIVE · {ARTIST_SIGNALS.length} active signals</span>
        <div className="ml-auto flex items-center gap-2">
          {['critical', 'high'].map(lvl => (
            <span key={lvl} className={`text-[9px] font-mono px-2 py-0.5 rounded border ${LEVEL_STYLES[lvl].pill}`}>
              {ARTIST_SIGNALS.filter(s => s.level === lvl).length} {lvl}
            </span>
          ))}
        </div>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {ARTIST_SIGNALS.map((sig, i) => {
          const isOpen = expanded === sig.id;
          const styles = LEVEL_STYLES[sig.level] ?? LEVEL_STYLES.high;
          const Icon = TYPE_ICON[sig.type] ?? TrendingUp;
          const isFlashed = flashedRows.has(sig.id);
          return (
            <div
              key={sig.id}
              className={`border-l-2 ${styles.border} cursor-pointer ls-fade-up`}
              style={{
                animationDelay: `${i * 50}ms`,
                background: isFlashed ? styles.glow : 'transparent',
                boxShadow: isFlashed ? `inset 3px 0 0 ${styles.barHex}30` : undefined,
                transition: 'background 0.5s ease, box-shadow 0.5s ease',
              }}
              onClick={() => setExpanded(isOpen ? '' : sig.id)}
            >
              {/* ── Compact default row ── */}
              <div className={`px-4 py-3 ${isOpen ? 'bg-white/[0.015]' : 'hover:bg-white/[0.01]'} transition-colors`}>
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${styles.pill}`} style={{ minWidth: 24 }}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5" style={{ flexWrap: 'wrap' as const }}>
                      <p className="text-[12.5px] font-semibold text-white leading-tight">{sig.asset}</p>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${styles.pill}`}>{sig.type}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10.5px] text-white/45 truncate" style={{ maxWidth: 360 }}>{sig.what}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className={`text-[10px] font-mono font-bold ${styles.pill.split(' ')[1]}`}>{sig.magnitude}</span>
                      <span className="text-[8px] font-mono text-white/25">{sig.ts}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className={`text-[9px] font-semibold px-2.5 py-1 rounded-lg border transition-all whitespace-nowrap ${
                        sig.level === 'critical'
                          ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/22 hover:bg-[#EF4444]/18'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/22 hover:bg-[#F59E0B]/18'
                      }`}
                    >
                      Act Now
                    </button>
                    <div className="shrink-0 text-white/20">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
                <div className="mt-2 ml-9">
                  <AnimatedMagnitudeBar magnitude={sig.magnitude} level={sig.level} delay={i * 60} />
                </div>
              </div>

              {/* ── Expanded: why this matters ── */}
              {isOpen && (
                <div className="px-4 pb-4 ls-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ml-9">
                    <div className="bg-white/[0.025] rounded-lg p-3 border border-white/[0.05]">
                      <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1.5">What's Happening</p>
                      <p className="text-[11px] text-white/65 leading-relaxed">{sig.what}</p>
                    </div>
                    <div className="bg-white/[0.025] rounded-lg p-3 border border-white/[0.05]">
                      <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Why It Matters</p>
                      <p className="text-[11px] text-white/65 leading-relaxed">{sig.why}</p>
                    </div>
                    <div className={`rounded-lg p-3 border ${
                      sig.level === 'critical' ? 'bg-[#EF4444]/[0.04] border-[#EF4444]/12' : 'bg-[#F59E0B]/[0.04] border-[#F59E0B]/12'
                    }`}>
                      <p className="text-[8px] font-mono text-white/25 uppercase tracking-widest mb-1.5">Recommended Action</p>
                      <p className="text-[11px] text-white/80 leading-relaxed mb-2">{sig.next}</p>
                      <button className={`flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                        sig.level === 'critical'
                          ? 'bg-[#EF4444]/12 text-[#EF4444] hover:bg-[#EF4444]/22 border border-[#EF4444]/20'
                          : 'bg-[#F59E0B]/12 text-[#F59E0B] hover:bg-[#F59E0B]/22 border border-[#F59E0B]/20'
                      }`}>
                        Take Action <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {(sig.triggeredAction || sig.expectedImpact || sig.window) && (
                    <div style={{
                      display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                      padding: '9px 12px', marginLeft: 36,
                      background: `${styles.barHex}07`,
                      border: `1px solid ${styles.barHex}18`,
                      borderRadius: 9,
                    }}>
                      {sig.triggeredAction && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <Target size={8} color={styles.barHex} style={{ marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Triggered Action</p>
                            <p style={{ margin: 0, fontSize: 10, color: styles.barHex, fontWeight: 700, lineHeight: 1.45 }}>{sig.triggeredAction}</p>
                          </div>
                        </div>
                      )}
                      {sig.expectedImpact && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <ArrowUpRight size={8} color="#10B981" style={{ marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Expected Impact</p>
                            <p style={{ margin: 0, fontSize: 10, color: '#10B981', fontWeight: 700, lineHeight: 1.45 }}>{sig.expectedImpact}</p>
                          </div>
                        </div>
                      )}
                      {sig.window && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <Clock size={8} color="#F59E0B" style={{ marginTop: 2, flexShrink: 0 }} />
                          <div>
                            <p style={{ margin: '0 0 1px', fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Window</p>
                            <p style={{ margin: 0, fontSize: 10, color: '#F59E0B', fontWeight: 700, lineHeight: 1.45 }}>{sig.window}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
