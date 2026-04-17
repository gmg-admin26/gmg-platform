import { useState, useEffect, useRef } from 'react';
import {
  Heart, Users, Crown, Star, Zap, MessageCircle, Radio,
  Globe, Lock, ChevronRight, ArrowUpRight, Music,
  Layers, Target, Sparkles, Shield, Gift, Headphones,
  Mail, Send, Flame, TrendingUp, DollarSign, Activity,
  Play, ChevronDown,
} from 'lucide-react';

// ── ANIMATED COUNTER ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * ease));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

// ── RADIAL GAUGE ─────────────────────────────────────────────────────────────

function RadialGauge({ value, max, color, size = 120 }: { value: number; max: number; color: string; size?: number }) {
  const r = (size / 2) - 10;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const sweepAngle = 260;
  const pct = Math.min(value / max, 1);
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pointOnArc = (angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy + r * Math.sin(toRad(angle)),
  });
  const describeArc = (start: number, sweep: number) => {
    const end = start + sweep;
    const s = pointOnArc(start);
    const e = pointOnArc(end);
    const large = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const strokeDash = 2 * Math.PI * r;
  const filledSweep = sweepAngle * pct;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <path d={describeArc(startAngle, sweepAngle)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" strokeLinecap="round" />
      <path d={describeArc(startAngle, filledSweep)} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }} />
    </svg>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────

function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const fviVal = useCountUp(74, 1600, visible);
  const revenueVal = useCountUp(3840, 1800, visible);

  return (
    <div ref={ref} className="relative border-b border-white/[0.06] bg-[#07080A] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[80px]"
          style={{ background: '#EC4899' }} />
        <div className="absolute -bottom-20 right-0 w-[400px] h-[400px] rounded-full opacity-[0.025] blur-[80px]"
          style={{ background: '#F59E0B' }} />
        {[...Array(5)].map((_, i) => (
          <div key={i}
            className="absolute top-0 bottom-0 w-[1px] opacity-[0.035]"
            style={{ left: `${18 + i * 16}%`, background: 'linear-gradient(180deg, transparent, #EC4899, transparent)' }} />
        ))}
      </div>

      <div className="relative px-7 py-10 flex flex-col xl:flex-row xl:items-center gap-10 max-w-[1200px]">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#EC489914', border: '1px solid #EC489928' }}>
              <Heart className="w-3.5 h-3.5 text-[#EC4899]" />
            </div>
            <span className="text-[9px] font-mono tracking-[0.2em] uppercase"
              style={{ color: '#EC489960' }}>
              GMG / Fan OS
            </span>
          </div>

          <h1 className="text-[44px] sm:text-[56px] font-black text-white leading-[0.95] tracking-tight mb-4">
            Fan OS
          </h1>

          <p className="text-[13px] font-mono tracking-[0.08em] mb-1" style={{ color: '#EC489970' }}>
            GROWTH VECTOR
          </p>
          <p className="text-[20px] sm:text-[24px] font-semibold text-white/40 leading-snug mb-8">
            Listener{' '}
            <span className="text-white/20 font-light mx-1">→</span>{' '}
            <span style={{ color: '#06B6D4' }}>Fan</span>{' '}
            <span className="text-white/20 font-light mx-1">→</span>{' '}
            <span style={{ color: '#F59E0B' }}>Superfan</span>
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-semibold transition-all hover:opacity-90"
              style={{ background: '#EC4899', color: '#fff' }}>
              <Crown className="w-3.5 h-3.5" />
              Activate Superfans
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-medium border border-white/[0.09] text-white/45 hover:text-white/70 hover:bg-white/[0.03] transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              Run Playbook
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 xl:gap-8 shrink-0 flex-wrap xl:flex-nowrap">
          <div className="relative flex flex-col items-center gap-2">
            <div className="relative" style={{ width: 130, height: 130 }}>
              <RadialGauge value={fviVal} max={100} color="#EC4899" size={130} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-black leading-none" style={{ color: '#EC4899' }}>
                  {fviVal}
                </span>
                <span className="text-[8px] font-mono text-white/20 tracking-wider mt-0.5">/100</span>
              </div>
            </div>
            <p className="text-[9px] font-mono tracking-[0.16em] uppercase text-white/25">Fan Value Index</p>
          </div>

          <div className="w-[1px] h-20 bg-white/[0.06] hidden sm:block" />

          <div className="flex flex-col items-start gap-1.5">
            <p className="text-[9px] font-mono tracking-[0.16em] uppercase text-white/25 mb-1">
              Superfan Rev / 1K
            </p>
            <div className="flex items-end gap-1.5">
              <span className="text-[13px] font-semibold text-white/25 self-start mt-1">$</span>
              <span className="text-[52px] font-black leading-none tracking-tight"
                style={{ color: '#F59E0B' }}>
                {revenueVal.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
              <span className="text-[10px] text-white/30">+22% vs last quarter</span>
            </div>
          </div>

          <div className="w-[1px] h-20 bg-white/[0.06] hidden xl:block" />

          <div className="hidden xl:flex flex-col gap-3">
            {[
              { label: 'Total Fans', value: '4.8M', color: '#EC4899' },
              { label: 'Superfans', value: '98K', color: '#F59E0B' },
              { label: 'Inner Circle', value: '3.2K', color: '#A3E635' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stat.color }} />
                <span className="text-[10px] text-white/25 w-20 shrink-0">{stat.label}</span>
                <span className="text-[13px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative px-7 pb-5 flex items-center gap-6 max-w-[1200px] xl:hidden">
        {[
          { label: 'Total Fans', value: '4.8M', color: '#EC4899' },
          { label: 'Superfans', value: '98K', color: '#F59E0B' },
          { label: 'Inner Circle', value: '3.2K', color: '#A3E635' },
        ].map(stat => (
          <div key={stat.label} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stat.color }} />
            <span className="text-[9.5px] text-white/25">{stat.label}</span>
            <span className="text-[12px] font-bold" style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OLD HEADER (replaced by hero) ────────────────────────────────────────────

function PageHeader() {
  return <HeroSection />;
}

function SectionDivider({ index, label, accent = '#EC4899' }: { index: string; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}45` }}>{index}</span>
      <div className="h-[1px] w-4" style={{ background: `${accent}28` }} />
      <span className="text-[10px] font-mono tracking-[0.18em] uppercase font-semibold shrink-0"
        style={{ color: `${accent}65` }}>
        {label}
      </span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

// ── 01. FAN VALUE INDEX ──────────────────────────────────────────────────────

const TIER_DIST = [
  { label: 'Passive',  pct: 58, color: '#4B5563', bg: '#4B556320' },
  { label: 'Engaged',  pct: 26, color: '#06B6D4', bg: '#06B6D420' },
  { label: 'Core',     pct: 11, color: '#F59E0B', bg: '#F59E0B20' },
  { label: 'Superfan', pct:  5, color: '#EC4899', bg: '#EC489920' },
];

const SCORE_COMPONENTS = [
  { label: 'Engagement',    weight: 40, score: 68, color: '#06B6D4',  desc: 'Streams, saves, playlists, follows' },
  { label: 'Ownership',     weight: 25, score: 52, color: '#F59E0B',  desc: 'Purchases, downloads, vinyl, NFTs' },
  { label: 'Monetization',  weight: 25, score: 61, color: '#EC4899',  desc: 'Revenue events per fan per year' },
  { label: 'Advocacy',      weight: 10, score: 44, color: '#A3E635',  desc: 'Shares, referrals, UGC, tags' },
];

function FviScoreRing({ score }: { score: number }) {
  const size = 160;
  const r = 64;
  const cx = size / 2;
  const cy = size / 2;
  const startDeg = -220;
  const sweepDeg = 260;
  const pct = Math.min(score / 100, 1);
  const toRad = (d: number) => (d * Math.PI) / 180;
  const pt = (a: number) => ({ x: cx + r * Math.cos(toRad(a)), y: cy + r * Math.sin(toRad(a)) });
  const arc = (s: number, sw: number) => {
    const e = s + sw;
    const a = pt(s); const b = pt(e);
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${sw > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
  };
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
      <path d={arc(startDeg, sweepDeg)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
      <path d={arc(startDeg, sweepDeg * pct)} fill="none" stroke="#EC4899" strokeWidth="8" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 8px #EC489960)' }} />
    </svg>
  );
}

function FanValueIndex() {
  return (
    <section>
      <SectionDivider index="01" label="Fan Value Index" accent="#EC4899" />

      <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4">

        {/* LEFT: Score card */}
        <div className="bg-[#0B0D10] border border-[#EC4899]/10 rounded-2xl overflow-hidden relative flex flex-col">
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #EC489930, transparent)' }} />

          {/* Central score */}
          <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
            <div className="relative" style={{ width: 160, height: 160 }}>
              <FviScoreRing score={74} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[56px] font-black leading-none tracking-tight" style={{ color: '#EC4899' }}>74</span>
                <span className="text-[9px] font-mono text-white/20 tracking-widest mt-0.5">/100</span>
              </div>
            </div>
            <p className="text-[12px] font-semibold text-white/55 mt-3 tracking-wide">Fan Value Index</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[10px] text-white/30 font-mono">DEVELOPING</span>
            </div>
          </div>

          <div className="border-t border-white/[0.05] px-6 py-5 flex-1">
            <p className="text-[9.5px] font-mono tracking-[0.14em] uppercase text-white/25 mb-4">Tier Distribution</p>

            {/* Stacked bar */}
            <div className="flex h-2.5 rounded-full overflow-hidden mb-4 gap-[2px]">
              {TIER_DIST.map(t => (
                <div key={t.label} className="h-full rounded-full transition-all"
                  style={{ width: `${t.pct}%`, background: t.color, opacity: 0.75 }} />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {TIER_DIST.map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: t.color }} />
                  <span className="text-[10px] text-white/35 truncate">{t.label}</span>
                  <span className="text-[10px] font-semibold ml-auto" style={{ color: t.color }}>{t.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Score components */}
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
            <div>
              <p className="text-[12.5px] font-semibold text-white/65">Score Components</p>
              <p className="text-[10px] text-white/25 mt-0.5">Weighted inputs driving the Fan Value Index</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: '#EC489910', border: '1px solid #EC489920' }}>
              <span className="text-[9px] font-mono text-white/30">PLACEHOLDER</span>
            </div>
          </div>

          <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SCORE_COMPONENTS.map(c => {
              const weighted = (c.score / 100) * c.weight;
              return (
                <div key={c.label} className="rounded-xl p-4 relative overflow-hidden"
                  style={{ background: `${c.color}08`, border: `1px solid ${c.color}18` }}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${c.color}30, transparent)` }} />

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[12px] font-semibold text-white/70">{c.label}</p>
                      <p className="text-[9px] text-white/25 mt-0.5">{c.desc}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-[22px] font-black leading-none" style={{ color: c.color }}>{c.score}</p>
                      <p className="text-[8px] font-mono text-white/20 mt-0.5">/100</p>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-3">
                    <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: `${c.color}70` }} />
                  </div>

                  {/* Weight pill + contribution */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
                        style={{ color: c.color, background: `${c.color}15`, border: `1px solid ${c.color}25` }}>
                        {c.weight}% weight
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-white/20">contributes</span>
                      <span className="text-[10px] font-bold" style={{ color: c.color }}>
                        {weighted.toFixed(1)} pts
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total row */}
          <div className="px-6 py-4 border-t border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
              <span className="text-[10px] font-mono text-white/30 tracking-wider">COMPOSITE SCORE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-32 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '74%', background: 'linear-gradient(90deg, #EC489960, #F59E0B60)' }} />
              </div>
              <span className="text-[16px] font-black" style={{ color: '#EC4899' }}>74</span>
              <span className="text-[10px] text-white/20">/100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 02. SUPERFAN ECONOMICS ───────────────────────────────────────────────────

function SuperfanEconomics() {
  return (
    <section>
      <SectionDivider index="02" label="Superfan Economics" accent="#F59E0B" />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_340px] gap-4">
        <div className="bg-[#0B0D10] border border-[#F59E0B]/12 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #F59E0B28, transparent)' }} />
          <div className="px-6 py-5 border-b border-white/[0.05]">
            <p className="text-[12.5px] font-semibold text-white/65">Lifetime Value by Tier</p>
          </div>
          <div className="p-6 space-y-5">
            {[
              { tier: 'Casual Listener', ltv: '$2–8', driver: 'Streaming revenue share', color: '#4B5563' },
              { tier: 'Core Fan', ltv: '$45–120', driver: 'Merch + ticket purchases', color: '#06B6D4' },
              { tier: 'Superfan', ltv: '$250–800', driver: 'Membership + premium drops', color: '#F59E0B' },
              { tier: 'Inner Circle', ltv: '$1,200+', driver: 'Fan club + exclusive access', color: '#EC4899' },
            ].map(row => (
              <div key={row.tier} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold text-white/65 truncate">{row.tier}</p>
                    <p className="text-[9.5px] text-white/25 truncate">{row.driver}</p>
                  </div>
                </div>
                <p className="text-[16px] font-bold shrink-0" style={{ color: row.color }}>{row.ltv}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.05]">
            <p className="text-[12.5px] font-semibold text-white/65">Revenue by Segment</p>
            <p className="text-[10px] text-white/25 mt-0.5">Monthly direct-to-fan revenue estimate</p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: 'Fan Club Subscriptions', amount: '$18,400', bar: 82, color: '#EC4899' },
              { label: 'Exclusive Merch Drops', amount: '$12,200', bar: 54, color: '#F59E0B' },
              { label: 'Early Access Tickets', amount: '$9,600', bar: 43, color: '#06B6D4' },
              { label: 'Digital Downloads / Stems', amount: '$4,100', bar: 18, color: '#10B981' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10.5px] text-white/45">{row.label}</p>
                  <p className="text-[12px] font-bold" style={{ color: row.color }}>{row.amount}</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${row.bar}%`, background: `${row.color}60` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
          <div className="px-5 py-5 border-b border-white/[0.05]">
            <p className="text-[12.5px] font-semibold text-white/65">Key Insight</p>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: '#F59E0B10', border: '1px solid #F59E0B20' }}>
                <Star className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <p className="text-[28px] font-bold text-[#F59E0B]">2%</p>
              <p className="text-[11px] text-white/50 font-medium">of your fans generate</p>
              <p className="text-[28px] font-bold text-white/80">38%</p>
              <p className="text-[11px] text-white/50 font-medium">of all direct fan revenue</p>
            </div>
            <p className="text-[10px] text-white/25 text-center leading-relaxed border-t border-white/[0.05] pt-4">
              Superfan economics — the case for building a dedicated fan activation system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 03. PLATFORM ECOSYSTEM ───────────────────────────────────────────────────

const PLATFORMS = [
  {
    name: 'Instagram Broadcast',
    icon: Radio,
    color: '#EC4899',
    status: 'ACTIVE',
    statusColor: '#10B981',
    desc: 'One-to-many direct messaging to opted-in followers. Highest open rates of any fan channel — no algorithm between you and your fans.',
    stat: 'Avg 68% open rate',
  },
  {
    name: 'Discord Community',
    icon: MessageCircle,
    color: '#5865F2',
    status: 'ACTIVE',
    statusColor: '#10B981',
    desc: 'Always-on community space structured by fan tier. Public channels for everyone, locked channels for core fans and superfans.',
    stat: 'Real-time engagement',
  },
  {
    name: 'Patreon',
    icon: Crown,
    color: '#F96854',
    status: 'BUILD',
    statusColor: '#06B6D4',
    desc: 'Recurring membership and subscription engine. Best for exclusive content delivery, early access, and predictable direct revenue.',
    stat: 'Subscription monetization',
  },
  {
    name: 'SMS / Laylo',
    icon: Send,
    color: '#10B981',
    status: 'RECOMMENDED',
    statusColor: '#EC4899',
    desc: 'Direct-to-fan phone capture. Laylo drops enable pre-release fan capture with instant push notifications. Highest CTR of any channel.',
    stat: '92%+ message open rate',
  },
  {
    name: 'Email / CRM',
    icon: Mail,
    color: '#F59E0B',
    status: 'ACTIVE',
    statusColor: '#10B981',
    desc: 'The highest-value long-term owned asset. Zero algorithm dependency. CRM segmentation enables precision targeting by fan behavior.',
    stat: 'Owned — zero algorithm',
  },
  {
    name: 'Facebook Group',
    icon: Globe,
    color: '#1877F2',
    status: 'MONITOR',
    statusColor: '#F59E0B',
    desc: 'Legacy audience base with reactivation potential. Strong 30+ demographic. Low maintenance with organic engagement upside.',
    stat: 'Reactivation layer',
  },
];

function PlatformEcosystem() {
  return (
    <section>
      <SectionDivider index="03" label="Platform Ecosystem" accent="#06B6D4" />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {PLATFORMS.map(p => {
          const Icon = p.icon;
          return (
            <div key={p.name}
              className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden
                hover:border-white/[0.1] transition-all flex flex-col gap-4">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}22, transparent)` }} />

              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <span className="text-[8px] font-mono font-semibold tracking-wider px-2 py-1 rounded-lg"
                  style={{ color: p.statusColor, background: `${p.statusColor}10`, border: `1px solid ${p.statusColor}20` }}>
                  {p.status}
                </span>
              </div>

              <div className="flex-1">
                <p className="text-[13.5px] font-bold text-white/80 mb-2">{p.name}</p>
                <p className="text-[11px] text-white/30 leading-relaxed">{p.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <span className="text-[9.5px] font-mono text-white/20">{p.stat}</span>
                <button className="flex items-center gap-1 text-[10.5px] font-semibold transition-opacity hover:opacity-70"
                  style={{ color: p.color }}>
                  Open
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── 04. COMMUNITY MANAGEMENT ─────────────────────────────────────────────────

function CommunityManagement() {
  return (
    <section>
      <SectionDivider index="04" label="Community Tiers" accent="#06B6D4" />

      <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.05]">
          <p className="text-[13px] font-semibold text-white/70">Fan Tier Architecture</p>
          <p className="text-[10.5px] text-white/25 mt-1">Each tier has a distinct identity, access level, and conversion objective.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
          {[
            {
              tier: 'Casual',
              icon: Headphones,
              color: '#4B5563',
              pct: '~60%',
              identity: 'Algorithmic discovery. Occasional streams. Passive.',
              access: ['Public playlists', 'Social content', 'Free releases'],
              goal: 'Awareness → Follow',
              tactics: ['Playlist placement', 'Paid social', 'Organic discovery'],
            },
            {
              tier: 'Core Fan',
              icon: Music,
              color: '#06B6D4',
              pct: '~30%',
              identity: 'Actively follows. Engages with content. Attends shows.',
              access: ['Email list', 'Community invite', 'Exclusive previews'],
              goal: 'Follow → Join Community',
              tactics: ['Email + SMS capture', 'Discord invite', 'Early access offers'],
            },
            {
              tier: 'Superfan',
              icon: Star,
              color: '#F59E0B',
              pct: '~8%',
              identity: 'Buys merch. Attends events. Advocates in community.',
              access: ['Membership tier', 'Early access drops', 'Superfan Discord'],
              goal: 'Community → Membership',
              tactics: ['Patreon tier', 'Exclusive drops', 'Ticket priority'],
            },
            {
              tier: 'Inner Circle',
              icon: Crown,
              color: '#EC4899',
              pct: '~2%',
              identity: 'Fan club members. Brand ambassadors. Culture drivers.',
              access: ['Direct artist access', 'Private events', 'Co-creation'],
              goal: 'Membership → Ownership',
              tactics: ['White-glove access', 'IRL experiences', 'Artist recognition'],
            },
          ].map((tier, i, arr) => {
            const Icon = tier.icon;
            return (
              <div key={tier.tier} className="p-6 flex flex-col gap-4 relative">
                {i < arr.length - 1 && (
                  <div className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10
                    w-5 h-5 rounded-full items-center justify-center"
                    style={{ background: '#0B0D10', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <ChevronRight className="w-3 h-3 text-white/20" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${tier.color}12`, border: `1px solid ${tier.color}20` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: tier.color }} />
                  </div>
                  <span className="text-[11px] font-bold font-mono" style={{ color: `${tier.color}60` }}>{tier.pct}</span>
                </div>

                <div>
                  <p className="text-[13px] font-bold mb-1.5" style={{ color: tier.color }}>{tier.tier}</p>
                  <p className="text-[10.5px] text-white/30 leading-relaxed">{tier.identity}</p>
                </div>

                <div>
                  <p className="text-[8.5px] font-mono uppercase tracking-wider text-white/18 mb-2">Access</p>
                  <div className="space-y-1">
                    {tier.access.map(a => (
                      <div key={a} className="flex items-center gap-2 text-[10px] text-white/30">
                        <div className="w-1 h-1 rounded-full shrink-0" style={{ background: `${tier.color}55` }} />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-white/[0.05]">
                  <p className="text-[8.5px] font-mono uppercase tracking-wider text-white/15 mb-1">Objective</p>
                  <p className="text-[10.5px] font-semibold" style={{ color: `${tier.color}75` }}>{tier.goal}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 05. SUPERFAN ENGINE ───────────────────────────────────────────────────────

function SuperfanEngine() {
  return (
    <section>
      <SectionDivider index="05" label="Superfan Engine" accent="#F59E0B" />

      <div className="relative bg-[#0B0D10] border border-[#F59E0B]/12 rounded-2xl overflow-hidden mb-4">
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #F59E0B25, transparent)' }} />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full opacity-[0.025] blur-3xl pointer-events-none"
          style={{ background: '#F59E0B' }} />

        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-white/70">Superfan Monetization + Retention Layer</p>
            <p className="text-[9.5px] font-mono text-white/20 mt-0.5 tracking-wider">IDENTIFY · ACTIVATE · REWARD · RETAIN</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[9px] font-mono text-[#F59E0B]/50">ENGINE ACTIVE</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            { title: 'Early Access Drops', icon: Zap, color: '#F59E0B', desc: 'Superfans receive new releases 24–72 hrs before the public. The reward is being first — exclusivity is the product.' },
            { title: 'Exclusive Content Layer', icon: Lock, color: '#06B6D4', desc: 'Behind-the-scenes, demos, stems, and studio footage. Content that only exists for them. Never posted publicly.' },
            { title: 'Access-Based Experiences', icon: Shield, color: '#10B981', desc: 'Soundcheck access, private listening rooms, backstage invites. Experiences drive retention far more than merchandise.' },
            { title: 'Reward + Recognition', icon: Gift, color: '#EC4899', desc: 'Identify and recognize long-standing fans publicly within the community. Recognition is a high-retention signal.' },
            { title: 'Superfan Wallet', icon: Star, color: '#A3E635', desc: 'Points or credits earned through engagement — redeemable for merch, tickets, or exclusive access. Creates behavioral loops.' },
            { title: 'Private Tier Access', icon: Crown, color: '#F59E0B', desc: 'Locked Discord channels, private Telegram groups, or access rooms only reachable by superfan tier. Scarcity creates value.' },
          ].map(play => {
            const Icon = play.icon;
            return (
              <div key={play.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]
                  hover:bg-white/[0.035] hover:border-white/[0.09] transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${play.color}12`, border: `1px solid ${play.color}20` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: play.color }} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/70 mb-1.5">{play.title}</p>
                  <p className="text-[10.5px] text-white/30 leading-relaxed">{play.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 06. AI PLAYBOOKS ─────────────────────────────────────────────────────────

const PLAYBOOKS = [
  {
    tag: 'COMMUNITY',
    tagColor: '#06B6D4',
    icon: MessageCircle,
    priority: 'HIGH',
    priorityColor: '#10B981',
    headline: 'Launch a Discord listening session this week',
    body: 'Cap attendance at 50 fans — scarcity is intentional. Serve unreleased music or a personal Q&A. Signal to your fanbase that access is earned.',
  },
  {
    tag: 'BROADCAST',
    tagColor: '#EC4899',
    icon: Radio,
    priority: 'HIGH',
    priorityColor: '#10B981',
    headline: 'Start an Instagram Broadcast for your top 5%',
    body: 'First message: a voice note or unreleased clip. Not a polished post — something direct and personal. This is where the relationship lives.',
  },
  {
    tag: 'MONETIZE',
    tagColor: '#F59E0B',
    icon: Crown,
    priority: 'MEDIUM',
    priorityColor: '#F59E0B',
    headline: 'Launch a $5/mo Patreon tier with one clear benefit',
    body: 'Keep it simple. One tangible benefit: access to a private content library. The simpler the offer, the higher the conversion rate.',
  },
  {
    tag: 'SMS CAPTURE',
    tagColor: '#10B981',
    icon: Send,
    priority: 'HIGH',
    priorityColor: '#10B981',
    headline: 'Set up a Laylo drop before your next release',
    body: 'Offer early access as the opt-in incentive. You collect phone numbers. They get the release first. Highest-CTR channel you can own.',
  },
  {
    tag: 'ACTIVATION',
    tagColor: '#A3E635',
    icon: Flame,
    priority: 'MEDIUM',
    priorityColor: '#F59E0B',
    headline: 'Activate a fan-seeded challenge on TikTok',
    body: 'Let superfans seed the content before you activate paid. Organic credibility comes first — then you amplify what\'s already working.',
  },
  {
    tag: 'RE-ENGAGEMENT',
    tagColor: '#6B7280',
    icon: Activity,
    priority: 'LOW',
    priorityColor: '#6B7280',
    headline: 'Identify 90-day dormant fans and send a direct email',
    body: 'Not a newsletter. A direct, personal message. One sentence about what you\'ve been working on. Specificity is the signal that you care.',
  },
];

function AIPlaybooks() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section>
      <SectionDivider index="06" label="AI Engagement Playbooks" accent="#10B981" />

      <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: '#10B98114', border: '1px solid #10B98122' }}>
              <Sparkles className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-[12.5px] font-semibold text-white/70">Contextual Plays</p>
              <p className="text-[9.5px] text-white/20 font-mono">AI-generated — activate when the moment is right</p>
            </div>
          </div>
          <span className="text-[8px] font-mono px-2.5 py-1 rounded-lg"
            style={{ background: '#10B98112', color: '#10B981', border: '1px solid #10B98120' }}>
            {PLAYBOOKS.length} PLAYS READY
          </span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {PLAYBOOKS.map((pb, i) => {
            const Icon = pb.icon;
            const isOpen = active === i;
            return (
              <div key={i} className="transition-colors hover:bg-white/[0.015]">
                <button
                  className="w-full flex items-start gap-5 px-6 py-5 text-left"
                  onClick={() => setActive(isOpen ? null : i)}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${pb.tagColor}12`, border: `1px solid ${pb.tagColor}20` }}>
                    <Icon className="w-4 h-4" style={{ color: pb.tagColor }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-mono font-semibold px-2 py-0.5 rounded tracking-wider"
                        style={{ color: pb.tagColor, background: `${pb.tagColor}10` }}>
                        {pb.tag}
                      </span>
                      <span className="text-[8px] font-mono px-2 py-0.5 rounded"
                        style={{ color: pb.priorityColor, background: `${pb.priorityColor}10` }}>
                        {pb.priority}
                      </span>
                    </div>
                    <p className="text-[12.5px] font-semibold text-white/70 mb-1">{pb.headline}</p>
                    {isOpen && (
                      <p className="text-[11px] text-white/35 leading-relaxed mt-2 pr-4 animate-[fadeIn_0.15s_ease-out]">
                        {pb.body}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 mt-1">
                    <button
                      className="px-3.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80"
                      style={{ background: `${pb.tagColor}14`, color: pb.tagColor, border: `1px solid ${pb.tagColor}20` }}
                      onClick={e => e.stopPropagation()}>
                      Activate
                    </button>
                    <ChevronDown
                      className="w-4 h-4 text-white/20 transition-transform"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── 07. FAN CLUB SYSTEM ───────────────────────────────────────────────────────

function FanClubSystem() {
  return (
    <section>
      <SectionDivider index="07" label="Fan Club System" accent="#EC4899" />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="relative bg-[#0B0D10] border border-[#EC4899]/10 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, #EC489918, transparent)' }} />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.02] blur-3xl pointer-events-none"
            style={{ background: '#EC4899' }} />

          <div className="px-6 py-5 border-b border-white/[0.05]">
            <p className="text-[13px] font-semibold text-white/70">Bespoke Fan Club Architecture</p>
            <p className="text-[10.5px] text-white/25 mt-1">White-glove fan ecosystem — custom built and managed by GMG</p>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Layers, color: '#EC4899', title: 'Membership Architecture', desc: 'Tiered access structure designed around what your fans want: exclusivity, proximity, and identity. Built to scale.' },
              { icon: Crown, color: '#F59E0B', title: 'Subscription Tiers', desc: 'Free → Core → Superfan → Inner Circle. Each tier unlocks distinct benefits and creates natural aspiration to ascend.' },
              { icon: Target, color: '#10B981', title: 'Direct Revenue Layer', desc: 'Fan club revenue flows directly to the artist. Not through a DSP. Not through a label. An owned income stream.' },
              { icon: Heart, color: '#06B6D4', title: 'Community Identity', desc: 'Fan clubs create belonging. The community itself becomes the product — fans recruit other fans organically.' },
              { icon: Sparkles, color: '#A3E635', title: 'Content Infrastructure', desc: 'Exclusive media, archives, and behind-the-scenes content organized and delivered automatically to the right tier.' },
              { icon: Shield, color: '#EC4899', title: 'Moderation + Operations', desc: 'GMG manages community health, engagement rhythms, and moderation — so the artist is present, not burdened.' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]
                    hover:bg-white/[0.035] transition-all">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-[11.5px] font-semibold text-white/70 mb-1">{item.title}</p>
                    <p className="text-[10px] text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden flex-1">
            <div className="px-5 py-5 border-b border-white/[0.05]">
              <p className="text-[12px] font-semibold text-white/65">Default Tier Template</p>
              <p className="text-[9.5px] text-white/20 mt-0.5">Customized per artist — this is the GMG baseline</p>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {[
                {
                  name: 'Free',
                  price: null,
                  color: '#4B5563',
                  benefits: ['Community access', 'Public content', 'Fan newsletter'],
                },
                {
                  name: 'Core',
                  price: '$3–5 / mo',
                  color: '#06B6D4',
                  benefits: ['Early release access', 'Members-only drops', 'Discord Core channel'],
                },
                {
                  name: 'Superfan',
                  price: '$10–15 / mo',
                  color: '#F59E0B',
                  benefits: ['Exclusive content library', 'Pre-sale tickets', 'Superfan Discord + voice'],
                },
                {
                  name: 'Inner Circle',
                  price: '$25+ / mo',
                  color: '#EC4899',
                  benefits: ['Direct artist contact', 'Private events', 'Co-creation access', 'Lifetime recognition'],
                },
              ].map(tier => (
                <div key={tier.name} className="px-5 py-4 flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: tier.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <p className="text-[12px] font-bold" style={{ color: tier.color }}>{tier.name}</p>
                      {tier.price && (
                        <span className="text-[9px] font-mono text-white/20">{tier.price}</span>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      {tier.benefits.map(b => (
                        <p key={b} className="text-[9.5px] text-white/30 leading-snug">— {b}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-[12px] font-semibold transition-all hover:opacity-90 border border-[#EC4899]/25"
            style={{ background: '#EC489912', color: '#EC4899' }}>
            <Heart className="w-4 h-4" />
            Build a Fan Club
          </button>
        </div>
      </div>
    </section>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export default function FanOS() {
  return (
    <div className="min-h-full bg-[#07080A]">
      <PageHeader />
      <div className="px-7 py-8 max-w-[1200px] space-y-14">
        <FanValueIndex />
        <SuperfanEconomics />
        <PlatformEcosystem />
        <CommunityManagement />
        <SuperfanEngine />
        <AIPlaybooks />
        <FanClubSystem />
        <div className="h-4" />
      </div>
    </div>
  );
}
