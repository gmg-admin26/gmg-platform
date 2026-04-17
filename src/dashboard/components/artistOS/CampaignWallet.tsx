import { useEffect, useRef, useState } from 'react';
import {
  Wallet, ArrowDownToLine, Zap, Rocket, TrendingUp, Globe,
  Brain, ArrowUpRight, Activity, Radio, DollarSign, Target,
} from 'lucide-react';

type WalletStatus = 'ready' | 'building' | 'hold';

const STATUS_CONFIG: Record<WalletStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  ready:    { label: 'Ready to Scale',        color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  dot: '#10B981' },
  building: { label: 'Momentum Building',     color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', dot: '#F59E0B' },
  hold:     { label: 'Hold – Optimize First', color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)',  dot: '#EF4444' },
};

const LIVE_SIGNALS = [
  { text: 'Brazil momentum spike detected',                         color: '#EC4899', icon: TrendingUp  },
  { text: 'Advance eligible based on current payout velocity',      color: '#06B6D4', icon: Zap         },
  { text: 'Campaign funding window open — high conversion market',  color: '#10B981', icon: Target      },
  { text: 'ACH payout processing — T+2 settlement incoming',        color: '#F59E0B', icon: Activity    },
  { text: 'US playlist algorithm momentum at 7-day high',           color: '#10B981', icon: Radio       },
  { text: 'Available capital exceeds deployment threshold by 22%',  color: '#06B6D4', icon: DollarSign  },
  { text: 'Pre-save conversion rate above portfolio baseline',       color: '#EC4899', icon: ArrowUpRight },
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

function MoneyDisplay({ value, color }: { value: number; color: string }) {
  const display = useTicker(value);
  const fmt = display >= 1_000_000
    ? `$${(display / 1_000_000).toFixed(2)}M`
    : display >= 1_000
    ? `$${(display / 1_000).toFixed(1)}K`
    : `$${display.toLocaleString()}`;
  return <span style={{ color }}>{fmt}</span>;
}

function FuelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginTop: 10 }}>
      <div style={{
        height: '100%', borderRadius: 99,
        width: `${pct}%`,
        background: `linear-gradient(90deg, ${color}88, ${color})`,
        boxShadow: `0 0 8px ${color}60`,
        transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

type WalletCard = {
  label: string;
  value: number;
  color: string;
  fuelPct: number;
  icon: React.ElementType;
  note: string;
};

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

function WalletCard({ card }: { card: WalletCard }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 13, padding: '14px 16px 12px',
        background: hov ? `rgba(${hexToRgb(card.color)},0.04)` : 'rgba(0,0,0,0.25)',
        border: `1px solid ${hov ? `${card.color}30` : 'rgba(255,255,255,0.07)'}`,
        transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-2px)' : 'none',
        boxShadow: hov ? `0 8px 28px rgba(0,0,0,0.25), 0 0 0 1px ${card.color}18` : 'none',
        cursor: 'default',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 60, height: 60,
        borderRadius: '50%', background: card.color,
        opacity: hov ? 0.06 : 0.03, filter: 'blur(20px)',
        transition: 'opacity 0.25s', pointerEvents: 'none',
      }} />
      {hov && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)` }} />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${card.color}14`, border: `1px solid ${card.color}25`, transition: 'box-shadow 0.25s', boxShadow: hov ? `0 0 10px ${card.color}30` : 'none' }}>
          <card.icon size={11} color={card.color} />
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{card.label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1 }}>
        <MoneyDisplay value={card.value} color={card.color} />
      </div>
      <p style={{ margin: '5px 0 0', fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)' }}>{card.note}</p>
      <FuelBar pct={card.fuelPct} color={card.color} />
    </div>
  );
}

function ActionButton({ label, color }: { label: string; color: string }) {
  const [hov, setHov] = useState(false);
  const Icon = label === 'Transfer to Bank' ? ArrowDownToLine : label === 'Activate Advance' ? Zap : Rocket;

  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
        background: hov ? `${color}18` : `${color}0D`,
        border: `1px solid ${hov ? `${color}40` : `${color}28`}`,
        color: hov ? color : `${color}CC`,
        fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: hov ? 'translateY(-1px)' : 'none',
        boxShadow: hov ? `0 4px 16px ${color}20` : 'none',
        whiteSpace: 'nowrap' as const,
      }}
    >
      <Icon size={11} color={hov ? color : `${color}AA`} />
      {label}
    </button>
  );
}

function LiveSignalTicker({ tick }: { tick: number }) {
  const idx = tick % LIVE_SIGNALS.length;
  const prev = (tick - 1 + LIVE_SIGNALS.length) % LIVE_SIGNALS.length;
  const signal = LIVE_SIGNALS[idx];
  const SignalIcon = signal.icon;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, [tick]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 10, overflow: 'hidden', height: 34,
    }}>
      {/* Left label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'wallet-dot-pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const }}>Signal Feed</span>
      </div>

      {/* Signal row */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: `${signal.color}12`, border: `1px solid ${signal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SignalIcon size={9} color={signal.color} />
          </div>
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' as const }}>{signal.text}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 4, background: `${signal.color}10`, border: `1px solid ${signal.color}20`, color: signal.color, flexShrink: 0 }}>LIVE</span>
        </div>
      </div>

      {/* Signal dots pagination */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 12px', borderLeft: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        {LIVE_SIGNALS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 12 : 4, height: 4, borderRadius: 99, background: i === idx ? '#10B981' : 'rgba(255,255,255,0.1)', transition: 'width 0.3s, background 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

function RecommendationBanner({ tick }: { tick: number }) {
  const [deployed, setDeployed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function handleDeploy() {
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setDeployed(true); }, 1600);
  }

  const pulseOpacity = 0.5 + 0.5 * Math.sin(tick * 0.6);

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 13, padding: '14px 18px',
      background: deployed
        ? 'linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(6,182,212,0.05) 100%)'
        : 'linear-gradient(135deg,rgba(236,72,153,0.07) 0%,rgba(245,158,11,0.05) 50%,rgba(6,182,212,0.04) 100%)',
      border: `1px solid ${deployed ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.22)'}`,
      transition: 'border-color 0.4s, background 0.4s',
    }}>
      {/* Top shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: deployed
          ? 'linear-gradient(90deg,transparent,rgba(16,185,129,0.55),transparent)'
          : 'linear-gradient(90deg,transparent,rgba(236,72,153,0.55),rgba(245,158,11,0.35),transparent)',
      }} />
      {/* Ambient pulse blob */}
      {!deployed && (
        <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)', opacity: pulseOpacity, pointerEvents: 'none', transition: 'opacity 0.1s' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: deployed ? 'rgba(16,185,129,0.12)' : 'rgba(236,72,153,0.12)',
          border: `1px solid ${deployed ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.28)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: deployed ? '0 0 14px rgba(16,185,129,0.12)' : '0 0 14px rgba(236,72,153,0.1)',
          transition: 'all 0.4s',
        }}>
          <Brain size={16} color={deployed ? '#10B981' : '#EC4899'} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: deployed ? 'rgba(16,185,129,0.55)' : 'rgba(236,72,153,0.55)' }}>
              {deployed ? 'Executing' : 'Best Move Right Now'}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: deployed ? 'rgba(16,185,129,0.1)' : 'rgba(236,72,153,0.1)', border: `1px solid ${deployed ? 'rgba(16,185,129,0.2)' : 'rgba(236,72,153,0.2)'}`, color: deployed ? '#10B981' : '#EC4899' }}>
              {deployed ? 'CONFIRMED' : 'AI SIGNAL'}
            </span>
          </div>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              {deployed
                ? 'Campaign capital is being routed to the highest-converting US market. Expect stream uplift in 24–48h.'
                : 'Deploy campaign funds into the highest-converting market — US organic traction is peaking now. Deploy before the window closes.'}
            </p>
            {!deployed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Target size={8} color="rgba(236,72,153,0.5)" />
                <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(236,72,153,0.55)', letterSpacing: '0.06em' }}>
                  triggered by stream spike on ZEAL Vol. 1 · +290% in 6h · playlist add detected
                </span>
              </div>
            )}
          </div>
        </div>

        {!deployed && (
          <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
            <button
              style={{ fontFamily: 'monospace', fontSize: 8, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}
            >Dismiss</button>
            <button
              onClick={handleDeploy}
              disabled={confirming}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
                padding: '8px 16px', borderRadius: 9, cursor: confirming ? 'default' : 'pointer',
                background: confirming ? 'rgba(16,185,129,0.2)' : '#EC4899',
                border: `1px solid ${confirming ? 'rgba(16,185,129,0.3)' : '#EC4899'}`,
                color: confirming ? '#10B981' : '#000',
                boxShadow: confirming ? 'none' : '0 0 14px rgba(236,72,153,0.35)',
                transition: 'all 0.25s',
                whiteSpace: 'nowrap' as const,
              }}
            >
              <Rocket size={10} color={confirming ? '#10B981' : '#000'} />
              {confirming ? 'Routing…' : 'Deploy Now →'}
            </button>
          </div>
        )}

        {deployed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', fontWeight: 700 }}>Active</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CampaignWallet({ status = 'ready' }: { status?: WalletStatus }) {
  const [pulse, setPulse] = useState(false);
  const [tick, setTick] = useState(0);
  const [headerGlow, setHeaderGlow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setTick(t => t + 1);
      setHeaderGlow(true);
      setTimeout(() => setHeaderGlow(false), 700);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const cfg = STATUS_CONFIG[status];

  const baseAvail   = 12_400;
  const basePending = 4_750;
  const baseAdvance = 25_000;
  const baseGrowth  = 38_500;

  const avail   = baseAvail   + (tick % 3 === 0 ? 120 : 0);
  const pending = basePending + (tick % 5 === 0 ? 80  : 0);
  const advance = baseAdvance;
  const growth  = baseGrowth  + (tick % 4 === 0 ? 500 : 0);

  const cards: WalletCard[] = [
    { label: 'Available Cash',    value: avail,   color: '#10B981', fuelPct: 72,  icon: Wallet,    note: 'Ready to transfer'     },
    { label: 'In Progress',       value: pending, color: '#F59E0B', fuelPct: 38,  icon: TrendingUp, note: 'Pending payouts'       },
    { label: 'Advance Available', value: advance, color: '#06B6D4', fuelPct: 100, icon: Zap,        note: 'Pre-approved capital'  },
    { label: 'Growth Power',      value: growth,  color: '#EC4899', fuelPct: 85,  icon: Rocket,     note: 'Est. campaign scaling' },
  ];

  const insights = [
    {
      icon: Rocket,
      color: '#EC4899',
      text: 'Deploying $3,500 now could generate +25–40% more streams over next 7 days',
      signal: 'triggered by TikTok sound velocity spike · +1,800 sound uses in 12h',
    },
    {
      icon: Globe,
      color: '#F59E0B',
      text: "You're under-investing relative to current momentum spike in Brazil",
      signal: 'triggered by São Paulo listener surge · +340% streams this week',
    },
  ];

  const actions = [
    { label: 'Transfer to Bank',  color: '#10B981', action: 'withdraw' },
    { label: 'Activate Advance',  color: '#06B6D4', action: 'advance'  },
    { label: 'Fund Campaign',     color: '#EC4899', action: 'deploy'   },
  ];

  return (
    <div style={{
      position: 'relative', borderRadius: 18, overflow: 'hidden',
      border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.32)' : 'rgba(16,185,129,0.18)'}`,
      background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(6,182,212,0.03) 40%, rgba(236,72,153,0.03) 100%)',
      boxShadow: headerGlow
        ? '0 0 60px rgba(16,185,129,0.1), 0 0 120px rgba(6,182,212,0.06), inset 0 1px 0 rgba(255,255,255,0.05)'
        : '0 0 60px rgba(16,185,129,0.06), 0 0 120px rgba(6,182,212,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
      marginBottom: 20,
      transition: 'border-color 0.5s, box-shadow 0.5s',
    }}>
      <style>{`
        @keyframes wallet-glow         { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes wallet-pulse-ring   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes wallet-shimmer      { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes wallet-float        { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes wallet-dot-pulse    { 0%,100%{opacity:1;box-shadow:0 0 4px #10B981} 50%{opacity:.5;box-shadow:0 0 10px #10B981} }
        @keyframes wallet-header-flash { 0%{opacity:0} 20%{opacity:1} 100%{opacity:0} }
      `}</style>

      {/* Ambient glow layer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 30%, rgba(6,182,212,0.05) 0%, transparent 55%)',
        animation: 'wallet-glow 4s ease-in-out infinite',
      }} />

      {/* Top accent line — flashes on signal */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.5) 30%, rgba(6,182,212,0.4) 60%, rgba(236,72,153,0.3) 85%, transparent 100%)',
        opacity: headerGlow ? 1 : 0.6,
        transition: 'opacity 0.4s',
      }} />

      {/* Left edge accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,transparent,rgba(16,185,129,0.3),transparent)', opacity: headerGlow ? 1 : 0.4, transition: 'opacity 0.4s' }} />

      <div style={{ padding: '18px 22px 20px' }}>

        {/* ── HEADER ROW ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Live pulse icon */}
            <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 12,
                background: headerGlow ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.25)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'wallet-float 3s ease-in-out infinite',
                transition: 'background 0.4s, border-color 0.4s',
                boxShadow: headerGlow ? '0 0 16px rgba(16,185,129,0.22)' : 'none',
              }}>
                <Wallet size={17} color="#10B981" />
              </div>
              {/* Pulse ring */}
              <div style={{
                position: 'absolute', inset: -5, borderRadius: 16,
                border: '1px solid rgba(16,185,129,0.35)',
                animation: pulse ? 'wallet-pulse-ring 1.4s ease-out forwards' : 'none',
                opacity: 0,
              }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <h2 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0F2', letterSpacing: '-0.02em', margin: 0 }}>Campaign Wallet</h2>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>/ ARTIST SAFE</span>
                {/* LIVE chip */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '2px 7px', borderRadius: 5,
                  background: headerGlow ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.25)'}`,
                  transition: 'all 0.4s',
                  boxShadow: headerGlow ? '0 0 8px rgba(16,185,129,0.2)' : 'none',
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981', animation: 'wallet-dot-pulse 1.5s ease-in-out infinite' }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 900, letterSpacing: '0.14em', color: '#10B981' }}>LIVE</span>
                </div>
              </div>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.22)' }}>Financial engine · Growth fuel · Money-to-momentum control system</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              background: cfg.bg, border: `1px solid ${cfg.border}`,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: cfg.color, letterSpacing: '0.06em' }}>{cfg.label}</span>
            </div>
          </div>
        </div>

        {/* ── WALLET CARDS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
          {cards.map(card => (
            <WalletCard key={card.label} card={card} />
          ))}
        </div>

        {/* ── LIVE SIGNAL TICKER ── */}
        <div style={{ marginBottom: 12 }}>
          <LiveSignalTicker tick={tick} />
        </div>

        {/* ── AI RECOMMENDATION BANNER ── */}
        <div style={{ marginBottom: 14 }}>
          <RecommendationBanner tick={tick} />
        </div>

        {/* ── INSIGHTS + ACTIONS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {insights.map((insight, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 9,
                padding: '8px 12px', borderRadius: 10,
                background: `${insight.color}06`,
                border: `1px solid ${insight.color}18`,
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${insight.color}12`, border: `1px solid ${insight.color}22`, flexShrink: 0, marginTop: 1 }}>
                  <insight.icon size={10} color={insight.color} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: insight.color, letterSpacing: '0.1em', flexShrink: 0 }}>AI INTEL</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{insight.text}</span>
                  </div>
                  {insight.signal && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Target size={7} color={`${insight.color}60`} />
                      <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${insight.color}70`, letterSpacing: '0.06em' }}>{insight.signal}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 170 }}>
            {actions.map(action => (
              <ActionButton key={action.action} label={action.label} color={action.color} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
