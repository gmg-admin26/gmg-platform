import { useEffect, useRef, useState } from 'react';
import {
  Wallet, Zap, Rocket, TrendingUp, ArrowDownToLine,
  ShieldCheck, Landmark, Clock, BadgeCheck, Activity,
  DollarSign, RefreshCw, Target, Radio, ChevronsRight,
} from 'lucide-react';

const LIVE_SIGNALS = [
  { text: 'ACH batch processing — T+2 window active',            color: '#F59E0B', icon: Activity    },
  { text: 'Campaign capital deployment window open',             color: '#10B981', icon: Target      },
  { text: 'Recoupable balance trending toward breakeven',        color: '#06B6D4', icon: TrendingUp  },
  { text: 'Payout velocity above 30-day average by 18%',        color: '#10B981', icon: Radio       },
  { text: 'Capital pool eligible for artist advance disbursement',color: '#EC4899', icon: Zap        },
  { text: 'Next settlement window opens in 6 business days',     color: '#F59E0B', icon: Clock       },
  { text: 'Chase ACH link verified — funds transfer ready',      color: '#10B981', icon: ShieldCheck },
];

function useTicker(target: number, duration = 900) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) { setDisplay(target); return; }
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * ease));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return display;
}

function MoneyDisplay({ value, color, size = 22 }: { value: number; color: string; size?: number }) {
  const display = useTicker(value);
  const fmt = display >= 1_000_000
    ? `$${(display / 1_000_000).toFixed(2)}M`
    : display >= 1_000
    ? `$${(display / 1_000).toFixed(0)}K`
    : `$${display.toLocaleString()}`;
  return <span style={{ color, fontSize: size, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>{fmt}</span>;
}

function FuelBar({ pct, color, glow = true }: { pct: number; color: string; glow?: boolean }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
      <div style={{
        height: '100%', borderRadius: 99, width: `${pct}%`,
        background: `linear-gradient(90deg,${color}88,${color})`,
        boxShadow: glow ? `0 0 8px ${color}60` : 'none',
        transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

type CapCard = {
  label: string;
  value: number;
  color: string;
  fuelPct: number;
  icon: React.ElementType;
  note: string;
};

function CapitalCard({ card, flash }: { card: CapCard; flash: boolean }) {
  const [hov, setHov] = useState(false);
  const active = hov || flash;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 12, padding: '13px 15px 11px',
        background: active ? `rgba(${hexRgb(card.color)},0.05)` : 'rgba(0,0,0,0.28)',
        border: `1px solid ${active ? `${card.color}32` : 'rgba(255,255,255,0.07)'}`,
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: active ? `0 6px 24px rgba(0,0,0,0.2),0 0 0 1px ${card.color}18` : 'none',
        backdropFilter: 'blur(12px)',
        cursor: 'default',
      }}
    >
      <div style={{ position: 'absolute', top: -18, right: -18, width: 54, height: 54, borderRadius: '50%', background: card.color, opacity: active ? 0.07 : 0.03, filter: 'blur(18px)', transition: 'opacity 0.25s', pointerEvents: 'none' }} />
      {active && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${card.color}55,transparent)` }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
        <div style={{ width: 21, height: 21, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${card.color}14`, border: `1px solid ${card.color}25`, boxShadow: active ? `0 0 10px ${card.color}30` : 'none', transition: 'box-shadow 0.25s' }}>
          <card.icon size={10} color={card.color} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{card.label}</span>
      </div>
      <MoneyDisplay value={card.value} color={card.color} size={21} />
      <p style={{ margin: '4px 0 0', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{card.note}</p>
      <FuelBar pct={card.fuelPct} color={card.color} />
    </div>
  );
}

function ActionBtn({ label, color, icon: Icon, primary }: { label: string; color: string; icon: React.ElementType; primary?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 9, cursor: 'pointer',
        background: primary
          ? (hov ? color : `${color}EE`)
          : (hov ? `${color}1A` : `${color}0D`),
        border: `1px solid ${hov ? `${color}55` : `${color}30`}`,
        color: primary ? '#000' : (hov ? color : `${color}CC`),
        fontFamily: 'monospace', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.05em',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? (primary ? `0 4px 16px ${color}40` : `0 4px 16px ${color}20`) : 'none',
        whiteSpace: 'nowrap' as const,
      }}
    >
      <Icon size={10} color={primary ? '#000' : (hov ? color : `${color}AA`)} />
      {label}
    </button>
  );
}

function LiveSignalTicker({ tick }: { tick: number }) {
  const idx = tick % LIVE_SIGNALS.length;
  const signal = LIVE_SIGNALS[idx];
  const SignalIcon = signal.icon;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [tick]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 9, overflow: 'hidden', height: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 11px', borderRight: '1px solid rgba(255,255,255,0.05)', height: '100%', flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981', animation: 'lpc-dot 1.5s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 6.5, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const }}>Portfolio Signal</span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(3px)', transition: 'opacity 0.2s, transform 0.2s' }}>
          <div style={{ width: 16, height: 16, borderRadius: 4, background: `${signal.color}12`, border: `1px solid ${signal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SignalIcon size={8} color={signal.color} />
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.52)', whiteSpace: 'nowrap' as const }}>{signal.text}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 6.5, padding: '1px 5px', borderRadius: 3, background: `${signal.color}10`, border: `1px solid ${signal.color}22`, color: signal.color, flexShrink: 0 }}>LIVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2.5, padding: '0 11px', borderLeft: '1px solid rgba(255,255,255,0.05)', height: '100%', flexShrink: 0 }}>
        {LIVE_SIGNALS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 10 : 3.5, height: 3.5, borderRadius: 99, background: i === idx ? '#10B981' : 'rgba(255,255,255,0.1)', transition: 'width 0.3s, background 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

function PayoutStatusRow() {
  const items = [
    { icon: Landmark,   color: '#10B981', label: 'ACH Bank Connected',            value: 'Chase Business Checking •••• 7302', highlight: false },
    { icon: ShieldCheck,color: '#06B6D4', label: 'ACH Eligible',                  value: '1–2 Business Days',                 highlight: false },
    { icon: BadgeCheck, color: '#10B981', label: 'Verification Status',           value: 'Verified',                          highlight: true  },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 9,
            padding: '10px 14px',
            borderRight: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
              <Icon size={11} color={item.color} />
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: item.highlight ? item.color : 'rgba(255,255,255,0.65)' }}>{item.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function hexRgb(hex: string): string {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}

type Props = { labelColor?: string };

export default function LabelPortfolioCapital({ labelColor = '#10B981' }: Props) {
  const [tick, setTick] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [headerFlash, setHeaderFlash] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setTick(t => t + 1);
      setPulse(p => !p);
      setHeaderFlash(true);
      setTimeout(() => setHeaderFlash(false), 650);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const baseAvail   = 28_000;
  const baseACH     = 6_000;
  const baseRecoup  = 18_000;
  const baseCampaign= 10_000;

  const avail    = baseAvail    + (tick % 4 === 0 ? 200 : 0);
  const ach      = baseACH      + (tick % 6 === 0 ? 100 : 0);
  const campaign = baseCampaign + (tick % 3 === 0 ? 150 : 0);

  const cards: CapCard[] = [
    { label: 'Capital Pool',         value: avail,     color: '#10B981', fuelPct: 78,  icon: Wallet,      note: 'Available for deployment'   },
    { label: 'ACH In Progress',      value: ach,       color: '#F59E0B', fuelPct: 42,  icon: RefreshCw,   note: 'T+2 settlement'             },
    { label: 'Recoupable Outstanding',value: baseRecoup,color: '#EF4444', fuelPct: 55,  icon: DollarSign,  note: 'Across 4 artists'           },
    { label: 'Campaign Capital',     value: campaign,  color: '#EC4899', fuelPct: 88,  icon: Rocket,      note: 'Ready to deploy'            },
    { label: 'Last Payout Sent',     value: 5_000,     color: '#06B6D4', fuelPct: 100, icon: ArrowDownToLine, note: 'Sent Apr 10, 2026'      },
    { label: 'Est. Next Payout',     value: 14_000,    color: '#A78BFA', fuelPct: 65,  icon: ChevronsRight,   note: '$14K–$21K window'       },
  ];

  const actions = [
    { label: 'Initiate Payout Flow', color: '#10B981', icon: ArrowDownToLine, primary: true  },
    { label: 'Request New Capital',  color: '#06B6D4', icon: Zap,             primary: false },
    { label: 'Open Safe',            color: '#F59E0B', icon: ShieldCheck,     primary: false },
    { label: 'Deploy to Campaigns',  color: '#EC4899', icon: Rocket,          primary: false },
  ];

  return (
    <div style={{
      position: 'relative', borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${headerFlash ? `${labelColor}38` : `${labelColor}1A`}`,
      background: `linear-gradient(135deg,rgba(16,185,129,0.04) 0%,rgba(6,182,212,0.025) 40%,rgba(236,72,153,0.025) 100%)`,
      boxShadow: headerFlash
        ? `0 0 50px rgba(16,185,129,0.09),0 0 100px rgba(6,182,212,0.05),inset 0 1px 0 rgba(255,255,255,0.05)`
        : `0 0 40px rgba(16,185,129,0.05),inset 0 1px 0 rgba(255,255,255,0.04)`,
      marginBottom: 18,
      transition: 'border-color 0.5s, box-shadow 0.5s',
    }}>
      <style>{`
        @keyframes lpc-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes lpc-ring    { 0%{transform:scale(1);opacity:.65} 100%{transform:scale(2.1);opacity:0} }
        @keyframes lpc-glow    { 0%,100%{opacity:.45} 50%{opacity:.9} }
        @keyframes lpc-dot     { 0%,100%{opacity:1;box-shadow:0 0 4px #10B981} 50%{opacity:.45;box-shadow:0 0 9px #10B981} }
      `}</style>

      {/* Ambient glow layer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 65% 50% at 15% 50%,rgba(16,185,129,0.055) 0%,transparent 60%),radial-gradient(ellipse 45% 55% at 82% 30%,rgba(6,182,212,0.04) 0%,transparent 55%)', animation: 'lpc-glow 4s ease-in-out infinite' }} />

      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${labelColor}55 30%,rgba(6,182,212,0.4) 60%,rgba(236,72,153,0.3) 85%,transparent)`, opacity: headerFlash ? 1 : 0.55, transition: 'opacity 0.4s' }} />
      {/* Left accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: `linear-gradient(180deg,transparent,${labelColor}30,transparent)`, opacity: headerFlash ? 1 : 0.35, transition: 'opacity 0.4s' }} />

      <div style={{ padding: '16px 20px 18px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {/* Pulse icon */}
            <div style={{ position: 'relative', width: 38, height: 38, flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 11,
                background: headerFlash ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.09)',
                border: `1px solid ${headerFlash ? 'rgba(16,185,129,0.42)' : 'rgba(16,185,129,0.24)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'lpc-float 3.5s ease-in-out infinite',
                boxShadow: headerFlash ? '0 0 14px rgba(16,185,129,0.2)' : 'none',
                transition: 'all 0.4s',
              }}>
                <Wallet size={16} color="#10B981" />
              </div>
              <div style={{ position: 'absolute', inset: -5, borderRadius: 15, border: '1px solid rgba(16,185,129,0.32)', animation: pulse ? 'lpc-ring 1.4s ease-out forwards' : 'none', opacity: 0 }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#F0F0F2', letterSpacing: '-0.02em' }}>Portfolio Capital & Payout Center</h3>
                <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.12em' }}>/ SPIN RECORDS</span>
                {/* LIVE chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 3.5,
                  padding: '2px 7px', borderRadius: 5,
                  background: headerFlash ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.09)',
                  border: `1px solid ${headerFlash ? 'rgba(16,185,129,0.44)' : 'rgba(16,185,129,0.24)'}`,
                  transition: 'all 0.4s',
                  boxShadow: headerFlash ? '0 0 7px rgba(16,185,129,0.18)' : 'none',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', animation: 'lpc-dot 1.5s ease-in-out infinite' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 6.5, fontWeight: 900, letterSpacing: '0.14em', color: '#10B981' }}>LIVE</span>
                </div>
              </div>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Portfolio command infrastructure · Active capital engine · Payout operations</p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            {actions.map(a => (
              <ActionBtn key={a.label} label={a.label} color={a.color} icon={a.icon} primary={a.primary} />
            ))}
          </div>
        </div>

        {/* ── CAPITAL CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 9, marginBottom: 10 }}>
          {cards.map((card, i) => (
            <CapitalCard key={card.label} card={card} flash={headerFlash && i < 2} />
          ))}
        </div>

        {/* ── LIVE SIGNAL TICKER ── */}
        <div style={{ marginBottom: 10 }}>
          <LiveSignalTicker tick={tick} />
        </div>

        {/* ── PAYOUT DESTINATION STATUS ── */}
        <PayoutStatusRow />

      </div>
    </div>
  );
}
