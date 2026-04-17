import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Wallet, FileText, Clock, CheckCircle, Send,
  Shield, ListChecks, AlertCircle, RefreshCw,
  User, Info, ChevronDown,
  ShieldCheck, Activity, CheckSquare,
  FolderKanban, TrendingUp, Zap,
  DollarSign, Star, BarChart3, History, ArrowRight,
  BadgeCheck, CircleDot, Brain, Rocket, Globe,
  Target, Radio, ArrowUpRight, Calendar, Receipt,
} from 'lucide-react';
import {
  WorkerWithRelations, PaymentDelayLog, PaymentSafe,
  fetchWorkerByEmail, fetchDelayLog,
  getMissingComplianceItems,
  WorkerSystem,
} from '../../data/workerPaymentService';
import { IndustryOSMember } from '../../../auth/IndustryOSContext';

const ACCENT = '#10B981';
const PINK   = '#EC4899';

const PAYMENT_STATUS_COLOR: Record<string, string> = {
  held:      '#F59E0B',
  pending:   '#06B6D4',
  approved:  '#10B981',
  delayed:   '#EF4444',
  paid:      '#10B981',
  cancelled: '#6B7280',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  held:      'Pending Approval',
  pending:   'ACH Initiated',
  approved:  'Ready to Get Paid',
  delayed:   'Processing Delayed',
  paid:      'Paid',
  cancelled: 'Cancelled',
};

function fmt(v: number): string {
  if (v === 0) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}

function fmtFull(v: number): string {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function computeEarnings(allSafes: PaymentSafe[]) {
  const now = new Date();
  const ytdStart = new Date(now.getFullYear(), 0, 1);
  const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
  const lastYearEnd = new Date(now.getFullYear(), 0, 1);
  const paidSafes = allSafes.filter(s => s.status === 'paid' && s.paid_at);
  const lifetime = allSafes.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const ytd = paidSafes.filter(s => new Date(s.paid_at!) >= ytdStart).reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const lastYear = paidSafes.filter(s => { const d = new Date(s.paid_at!); return d >= lastYearStart && d < lastYearEnd; }).reduce((sum, s) => sum + (s.amount ?? 0), 0);
  return { lifetime, ytd, lastYear };
}

// ── MONEY TICKER ─────────────────────────────────────────────────────────────

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
  const str = display >= 1_000_000
    ? `$${(display / 1_000_000).toFixed(2)}M`
    : display >= 1_000
    ? `$${(display / 1_000).toFixed(1)}K`
    : `$${display.toLocaleString()}`;
  return <span style={{ color }}>{str}</span>;
}

// ── FUEL BAR ─────────────────────────────────────────────────────────────────

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

// ── WALLET CARD (exact CampaignWallet clone) ──────────────────────────────

type WalletCardDef = {
  label: string;
  value: number;
  color: string;
  fuelPct: number;
  icon: React.ElementType;
  note: string;
  cta?: { label: string; onClick: () => void };
};

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r},${g},${b}`;
}

function WalletCard({ card, headerGlow }: { card: WalletCardDef; headerGlow: boolean }) {
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
        display: 'flex', flexDirection: 'column',
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
      {card.cta && card.value > 0 && (
        <button
          onClick={card.cta.onClick}
          style={{
            marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: '7px 0', borderRadius: 8, cursor: 'pointer',
            background: card.color, border: 'none',
            color: '#000', fontFamily: 'monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
            boxShadow: `0 2px 14px ${card.color}35`,
          }}
        >
          <DollarSign size={10} color="#000" />
          {card.cta.label}
        </button>
      )}
    </div>
  );
}

// ── LIVE SIGNAL TICKER (identical to CampaignWallet) ────────────────────────

const PROJECT_SIGNALS = [
  { text: 'Deliverable review completed — payment window open',              color: ACCENT,   icon: CheckCircle  },
  { text: 'Milestone reached — funds eligible for release',                  color: '#06B6D4', icon: Zap          },
  { text: 'Compliance documents verified — ACH ready to process',            color: ACCENT,   icon: ShieldCheck  },
  { text: 'Final approval pending — contact team to accelerate payout',      color: '#F59E0B', icon: Clock        },
  { text: 'Submit outstanding deliverables to unlock next payment tranche',  color: '#F59E0B', icon: ListChecks   },
  { text: 'Payment initiated — T+2 ACH settlement expected',                 color: '#06B6D4', icon: Activity     },
  { text: 'All milestones on track · project health: strong',                color: ACCENT,   icon: TrendingUp   },
];

function LiveSignalTicker({ tick }: { tick: number }) {
  const idx = tick % PROJECT_SIGNALS.length;
  const signal = PROJECT_SIGNALS[idx];
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, animation: 'ps-dot-pulse 1.5s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const }}>Project Feed</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.22s ease, transform 0.22s ease' }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: `${signal.color}12`, border: `1px solid ${signal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <SignalIcon size={9} color={signal.color} />
          </div>
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' as const }}>{signal.text}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 4, background: `${signal.color}10`, border: `1px solid ${signal.color}20`, color: signal.color, flexShrink: 0 }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 12px', borderLeft: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        {PROJECT_SIGNALS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 12 : 4, height: 4, borderRadius: 99, background: i === idx ? ACCENT : 'rgba(255,255,255,0.1)', transition: 'width 0.3s, background 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

// ── AI ACTION BANNER (pink, exact CampaignWallet clone) ───────────────────

function AIActionBanner({
  worker, tick, availableToWithdraw, onGetPaid,
}: {
  worker: WorkerWithRelations;
  tick: number;
  availableToWithdraw: number;
  onGetPaid: () => void;
}) {
  const [actioned, setActioned] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);

  function handleAction() {
    if (availableToWithdraw > 0) { onGetPaid(); return; }
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setActioned(true); }, 1600);
  }

  const pulseOpacity = 0.5 + 0.5 * Math.sin(tick * 0.6);

  let message = '';
  let signal = '';
  let ctaLabel = 'Complete Action';

  if (availableToWithdraw > 0) {
    message = `Payment approved and ready — ${fmtFull(availableToWithdraw)} available to release to your account now.`;
    signal = `approved by GMG team · ACH ready · funds secured`;
    ctaLabel = 'Get Paid →';
  } else if (safe?.status === 'pending') {
    message = 'ACH transfer initiated — your payment is on the way. Expect funds to settle within 1–2 business days.';
    signal = 'transfer confirmed · T+2 ACH settlement · no action needed';
    ctaLabel = 'Track Status';
  } else if (safe?.status === 'delayed') {
    message = 'Payment processing delayed. Your funds are fully secured — the GMG team is resolving the upstream hold.';
    signal = `delay reason: ${safe.delay_reason?.slice(0, 55) ?? 'upstream processing'} · your payment is protected`;
    ctaLabel = 'View Details';
  } else if (missing.length > 0) {
    message = `Complete outstanding requirements to unlock your payment: ${missing[0]}`;
    signal = `${missing.length} item${missing.length > 1 ? 's' : ''} blocking payment release · action required`;
    ctaLabel = 'Submit Now';
  } else if (worker.assignments.some(a => a.status === 'in_progress' || a.status === 'open')) {
    message = 'Submit final deliverables to unlock your payment. All compliance is clear — funds are staged and ready.';
    signal = `deliverables pending · compliance verified · payment staged`;
    ctaLabel = 'Submit Now';
  } else {
    message = 'All deliverables submitted. Final review in progress — payment will be released once approved by the project team.';
    signal = 'deliverables under review · payment release pending team approval';
    ctaLabel = 'Check Status';
  }

  if (actioned) {
    message = 'Action submitted. The GMG project team has been notified and will process your request.';
    signal = 'submitted successfully · team notified';
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderRadius: 13, padding: '14px 18px',
      background: actioned
        ? 'linear-gradient(135deg,rgba(16,185,129,0.08) 0%,rgba(6,182,212,0.05) 100%)'
        : 'linear-gradient(135deg,rgba(236,72,153,0.07) 0%,rgba(245,158,11,0.05) 50%,rgba(6,182,212,0.04) 100%)',
      border: `1px solid ${actioned ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.22)'}`,
      transition: 'border-color 0.4s, background 0.4s',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: actioned
          ? 'linear-gradient(90deg,transparent,rgba(16,185,129,0.55),transparent)'
          : 'linear-gradient(90deg,transparent,rgba(236,72,153,0.55),rgba(245,158,11,0.35),transparent)',
      }} />
      {!actioned && (
        <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%)', opacity: pulseOpacity, pointerEvents: 'none', transition: 'opacity 0.1s' }} />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: actioned ? 'rgba(16,185,129,0.12)' : 'rgba(236,72,153,0.12)',
          border: `1px solid ${actioned ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.28)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: actioned ? '0 0 14px rgba(16,185,129,0.12)' : '0 0 14px rgba(236,72,153,0.1)',
          transition: 'all 0.4s',
        }}>
          <Brain size={16} color={actioned ? ACCENT : PINK} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: actioned ? 'rgba(16,185,129,0.55)' : 'rgba(236,72,153,0.55)' }}>
              {actioned ? 'Submitted' : 'Next Best Move'}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: actioned ? 'rgba(16,185,129,0.1)' : 'rgba(236,72,153,0.1)', border: `1px solid ${actioned ? 'rgba(16,185,129,0.2)' : 'rgba(236,72,153,0.2)'}`, color: actioned ? ACCENT : PINK }}>
              {actioned ? 'CONFIRMED' : 'AI SIGNAL'}
            </span>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{message}</p>
          {!actioned && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Target size={8} color="rgba(236,72,153,0.5)" />
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(236,72,153,0.55)', letterSpacing: '0.06em' }}>{signal}</span>
            </div>
          )}
        </div>

        {!actioned && (
          <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
            <button
              style={{ fontFamily: 'monospace', fontSize: 8, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}
            >Dismiss</button>
            <button
              onClick={handleAction}
              disabled={confirming}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em',
                padding: '8px 16px', borderRadius: 9, cursor: confirming ? 'default' : 'pointer',
                background: confirming ? 'rgba(16,185,129,0.2)' : PINK,
                border: `1px solid ${confirming ? 'rgba(16,185,129,0.3)' : PINK}`,
                color: confirming ? ACCENT : '#000',
                boxShadow: confirming ? 'none' : `0 0 14px ${PINK}35`,
                transition: 'all 0.25s',
                whiteSpace: 'nowrap' as const,
              }}
            >
              <Rocket size={10} color={confirming ? ACCENT : '#000'} />
              {confirming ? 'Processing…' : ctaLabel}
            </button>
          </div>
        )}

        {actioned && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: ACCENT, fontWeight: 700 }}>Sent</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AI INSIGHT STACK (exact CampaignWallet insight cards) ────────────────────

function AIInsightStack({ worker, availableToWithdraw }: { worker: WorkerWithRelations; availableToWithdraw: number }) {
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const openDelivs = worker.assignments.filter(a => a.status === 'open' || a.status === 'in_progress').length;

  const insights: { icon: React.ElementType; color: string; text: string; signal: string }[] = [];

  if (availableToWithdraw > 0) {
    insights.push({
      icon: DollarSign, color: ACCENT,
      text: `${fmtFull(availableToWithdraw)} is approved and ready for release — initiate transfer now to receive funds within 24–48 hours.`,
      signal: `approved by GMG · ACH ready · funds fully secured`,
    });
  }
  if (openDelivs > 0) {
    insights.push({
      icon: Rocket, color: PINK,
      text: `Submitting ${openDelivs} open deliverable${openDelivs > 1 ? 's' : ''} now will accelerate your payment timeline significantly.`,
      signal: `triggered by open deliverable status · payment staged pending submission`,
    });
  }
  if (missing.length > 0) {
    insights.push({
      icon: Shield, color: '#F59E0B',
      text: `${missing.length} compliance item${missing.length > 1 ? 's' : ''} outstanding — completing these is required before any payment can be released.`,
      signal: `blocking payment release · ${missing[0]}`,
    });
  }
  if (safe?.status === 'pending') {
    insights.push({
      icon: Activity, color: '#06B6D4',
      text: 'Your ACH transfer is in progress. Payments typically settle within 1–2 business days after initiation.',
      signal: 'ACH confirmed · T+2 settlement window · no action needed',
    });
  }

  if (insights.length === 0) {
    insights.push(
      {
        icon: Globe, color: '#F59E0B',
        text: 'Complete all deliverables and compliance steps to keep your payment timeline on track.',
        signal: 'payment release requires: deliverables submitted + compliance clear + approval',
      },
      {
        icon: TrendingUp, color: ACCENT,
        text: 'Consistent on-time delivery improves your standing for future GMG project opportunities.',
        signal: 'performance tracking active · project history building',
      }
    );
  }

  return (
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
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: insight.color, letterSpacing: '0.1em', flexShrink: 0 }}>PROJECT INTEL</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{insight.text}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Target size={7} color={`${insight.color}60`} />
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${insight.color}70`, letterSpacing: '0.06em' }}>{insight.signal}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CURRENT PROJECT PANEL ─────────────────────────────────────────────────────

function CurrentProjectPanel({ worker, onGetPaid }: { worker: WorkerWithRelations; onGetPaid: () => void }) {
  const safe = worker.payment_safe;
  const pColor = safe ? (PAYMENT_STATUS_COLOR[safe.status] ?? ACCENT) : ACCENT;
  const total = safe?.amount ?? 0;
  const paidOut = worker.all_safes?.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.amount ?? 0), 0) ?? 0;
  const remaining = Math.max(0, total - paidOut);
  const completedDelivs = worker.assignments.filter(a => a.status === 'approved').length;
  const totalDelivs = worker.assignments.length;
  const pct = totalDelivs > 0 ? Math.round((completedDelivs / totalDelivs) * 100) : 0;
  const availableToGetPaid = safe?.status === 'approved' ? (safe.amount ?? 0) : 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: `1px solid ${ACCENT}18`, borderRadius: 13, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)` }} />
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, flexShrink: 0 }}>
              <FolderKanban size={15} color={ACCENT} />
            </div>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: `${ACCENT}55`, marginBottom: 2 }}>Current Project</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{worker.project}</p>
              <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{worker.role}</p>
            </div>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '4px 9px', borderRadius: 20, color: pColor, background: `${pColor}10`, border: `1px solid ${pColor}20`, flexShrink: 0 }}>
            {safe ? (PAYMENT_STATUS_LABEL[safe.status] ?? safe.status) : 'Active'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Total Value', value: fmt(total), color: '#06B6D4', sub: 'Contracted' },
            { label: 'Paid Out', value: fmt(paidOut), color: ACCENT, sub: 'Released to you' },
            { label: 'Remaining', value: fmt(remaining), color: remaining > 0 ? '#F59E0B' : 'rgba(255,255,255,0.18)', sub: 'Pending release' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 10, padding: '10px 12px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{s.label}</p>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.1)', marginTop: 2 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: availableToGetPaid > 0 ? 12 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>Deliverable progress</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT }}>{pct}%</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>({completedDelivs}/{totalDelivs})</span>
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${ACCENT}88, ${ACCENT})`,
              boxShadow: pct > 0 ? `0 0 8px ${ACCENT}60` : 'none',
              transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>

        {availableToGetPaid > 0 && (
          <button
            onClick={onGetPaid}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 0', borderRadius: 9, cursor: 'pointer',
              background: ACCENT, border: 'none',
              color: '#000', fontSize: 12, fontWeight: 800,
              boxShadow: `0 4px 20px ${ACCENT}35`,
            }}
          >
            <DollarSign size={13} color="#000" />
            Get Paid — {fmt(availableToGetPaid)} Available
            <ArrowRight size={13} color="#000" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── DELIVERABLES SECTION ──────────────────────────────────────────────────────

function DeliverablesSection({ worker }: { worker: WorkerWithRelations }) {
  if (worker.assignments.length === 0) return null;

  const statusMap: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    open:        { label: 'Not Started', color: '#6B7280',  icon: CircleDot },
    in_progress: { label: 'In Progress', color: '#F59E0B',  icon: Zap       },
    submitted:   { label: 'In Review',   color: '#06B6D4',  icon: Send      },
    approved:    { label: 'Approved',    color: ACCENT,     icon: CheckCircle },
    rejected:    { label: 'Revision',    color: '#EF4444',  icon: AlertCircle },
    cancelled:   { label: 'Cancelled',   color: '#6B7280',  icon: AlertCircle },
  };

  const approved = worker.assignments.filter(a => a.status === 'approved').length;
  const total = worker.assignments.length;

  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 13, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}18` }}>
            <ListChecks size={12} color={ACCENT} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Deliverables</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>Your active work items</p>
          </div>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: ACCENT }}>{approved}/{total} done</span>
      </div>
      <div>
        {worker.assignments.map((item, i) => {
          const meta = statusMap[item.status] ?? statusMap.open;
          const Icon = meta.icon;
          const isNext = i === worker.assignments.findIndex(a => a.status === 'open' || a.status === 'in_progress');
          return (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
                borderBottom: i < worker.assignments.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
              }}
            >
              <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${meta.color}10`, border: `1px solid ${meta.color}22`, flexShrink: 0 }}>
                <Icon size={11} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1 }}>{item.deliverable_title}</p>
                  {isNext && <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>NEXT</span>}
                </div>
                {item.due_date && <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>Due {item.due_date}</p>}
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '3px 7px', borderRadius: 5, color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}22`, flexShrink: 0 }}>
                {meta.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── PROJECT HISTORY ───────────────────────────────────────────────────────────

function ProjectHistory({ allSafes, workerProject, workerRole }: { allSafes: PaymentSafe[]; workerProject: string; workerRole: string }) {
  const [showAll, setShowAll] = useState(false);
  const paidSafes = allSafes.filter(s => s.status === 'paid' && s.paid_at).sort((a, b) =>
    new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime()
  );
  const totalEarned = paidSafes.reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const visible = showAll ? paidSafes : paidSafes.slice(0, 5);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 13, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.18)' }}>
            <History size={12} color="#06B6D4" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Project History</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>All completed & paid projects</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {totalEarned > 0 && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, margin: 0 }}>{fmtFull(totalEarned)}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>total earned</p>
            </div>
          )}
          <span style={{ fontFamily: 'monospace', fontSize: 8.5, padding: '2px 6px', borderRadius: 5, color: '#06B6D4', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
            {paidSafes.length}
          </span>
        </div>
      </div>

      {paidSafes.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)' }}>
            <History size={16} color="rgba(255,255,255,0.1)" />
          </div>
          <p style={{ fontSize: 11, textAlign: 'center', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            No completed projects yet. Your payment history will appear here.
          </p>
        </div>
      ) : (
        <>
          {visible.map((s, i) => {
            const date = s.paid_at ? new Date(s.paid_at) : null;
            const dateStr = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const year = date?.getFullYear() ?? null;
            return (
              <div
                key={s.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, flexShrink: 0 }}>
                  <BadgeCheck size={13} color={ACCENT} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' as const }}>
                    <p style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{workerProject}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}18` }}>Paid</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{workerRole}</span>
                    {year && <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.12)' }}>· {year}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: ACCENT, margin: 0 }}>{fmt(s.amount ?? 0)}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>{dateStr}</p>
                </div>
              </div>
            );
          })}
          {paidSafes.length > 5 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button
                onClick={() => setShowAll(v => !v)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <ChevronDown size={13} style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                {showAll ? 'Show Less' : `Show ${paidSafes.length - 5} More`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── PAYMENT DELAY NOTICE ──────────────────────────────────────────────────────

function PaymentDelayNotice({ worker, delayLog }: { worker: WorkerWithRelations; delayLog: PaymentDelayLog[] }) {
  const safe = worker.payment_safe;
  if (safe?.status !== 'delayed' && delayLog.length === 0) return null;
  const latest = delayLog[0];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 13, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
        <Clock size={14} color="#F59E0B" />
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#F59E0B', margin: 0 }}>Payment Timing Update</p>
          <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(245,158,11,0.45)', marginTop: 2 }}>No action required from you</p>
        </div>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {safe?.delay_reason && <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{safe.delay_reason}</p>}
        {latest && (
          <div style={{ borderRadius: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{latest.reason}</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.18)', marginTop: 6 }}>
              {latest.logged_by ?? 'GMG Team'} · {new Date(latest.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, borderRadius: 10, padding: '10px 14px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <Info size={13} color="rgba(245,158,11,0.4)" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.32)', margin: 0 }}>
            Upstream payment delay. Funds will be released once received. Your payment is fully secured.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── REQUEST PAYMENT MODAL ────────────────────────────────────────────────────

function RequestPaymentModal({ worker, onClose, onSubmit }: { worker: WorkerWithRelations; onClose: () => void; onSubmit: () => void }) {
  const [deliverable, setDeliverable] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!amount.trim() || !confirmed) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false); setSubmitted(true);
    setTimeout(() => { onSubmit(); }, 1600);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#0D0F13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
            <DollarSign size={14} color={ACCENT} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: 0 }}>Get Paid</p>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{worker.project}</p>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>

        {submitted ? (
          <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}12`, border: `1px solid ${ACCENT}20` }}>
              <CheckCircle size={22} color={ACCENT} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.88)', margin: 0 }}>Request Submitted</p>
              <p style={{ fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.32)', marginTop: 6 }}>Your payment request has been sent to the GMG project team.</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Deliverable Completed</label>
              <input type="text" value={deliverable} onChange={e => setDeliverable(e.target.value)} placeholder="Which deliverable are you invoicing for?"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Invoice Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                  style={{ width: '100%', padding: '10px 14px 10px 26px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.82)', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 9, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Invoice number, period, notes..." rows={2}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 11.5, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }} onClick={() => setConfirmed(v => !v)}>
              <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: confirmed ? ACCENT : 'transparent', border: `1px solid ${confirmed ? ACCENT : 'rgba(255,255,255,0.15)'}`, transition: 'all 0.15s' }}>
                {confirmed && <CheckCircle size={10} color="#fff" />}
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', margin: 0 }}>I confirm all listed deliverables are complete</p>
                <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>This will go to the project team for review</p>
              </div>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer' }}>Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!amount.trim() || !confirmed || submitting}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 0', borderRadius: 10, border: 'none', background: ACCENT, color: '#000', fontSize: 11.5, fontWeight: 700, cursor: !amount.trim() || !confirmed || submitting ? 'not-allowed' : 'pointer', opacity: !amount.trim() || !confirmed || submitting ? 0.4 : 1 }}
              >
                <Send size={12} color="#000" />
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NO WORKER STATE ───────────────────────────────────────────────────────────

function NoWorkerRecord({ member }: { member: IndustryOSMember }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', gap: 24 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}08`, border: `1px solid ${ACCENT}18` }}>
          <Wallet size={24} color={`${ACCENT}50`} />
        </div>
        <div style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <Clock size={10} color="#F59E0B" />
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 8.5, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: 8 }}>Project OS</p>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.78)', margin: '0 0 10px' }}>Workspace Setting Up</h1>
        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
          Welcome, {member.full_name}. Your project safe is being configured by the GMG team.
        </p>
      </div>
      <div style={{ width: '100%', maxWidth: 320, borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Project agreement sent for signature', 'W-9 / EIN documentation request', 'ACH banking connection setup', 'Deliverables and milestones assigned', 'Project safe activated'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${ACCENT}30`, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
        Questions? Email{' '}
        <a href="mailto:projects@greatermusic.com" style={{ color: `${ACCENT}55` }}>
          projects@greatermusic.com
        </a>
      </p>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

interface MyProjectSafeProps {
  member: IndustryOSMember;
  system?: WorkerSystem;
}

export default function MyProjectSafe({ member, system = 'industry_os' }: MyProjectSafeProps) {
  const [worker, setWorker] = useState<WorkerWithRelations | null>(null);
  const [delayLog, setDelayLog] = useState<PaymentDelayLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [tick, setTick] = useState(0);
  const [headerGlow, setHeaderGlow] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const w = await fetchWorkerByEmail(member.email, system);
    setWorker(w);
    if (w?.payment_safe) {
      const log = await fetchDelayLog(w.payment_safe.id);
      setDelayLog(log);
    }
    setLoading(false);
  }, [member.email, system]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
      setTick(t => t + 1);
      setHeaderGlow(true);
      setTimeout(() => setHeaderGlow(false), 700);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
        <RefreshCw size={20} color="rgba(255,255,255,0.2)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!worker) return <NoWorkerRecord member={member} />;

  const safe = worker.payment_safe;
  const allSafes = worker.all_safes ?? (safe ? [safe] : []);
  const pColor = safe ? (PAYMENT_STATUS_COLOR[safe.status] ?? '#6B7280') : ACCENT;

  const availableToWithdraw = safe?.status === 'approved' ? (safe.amount ?? 0) : 0;
  const { lifetime, ytd, lastYear } = computeEarnings(allSafes);

  const safeTotal = safe?.amount ?? 0;
  const paidOut = allSafes.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const remaining = Math.max(0, safeTotal - paidOut);

  const cards: WalletCardDef[] = [
    {
      label: 'Lifetime Earnings',
      value: lifetime,
      color: ACCENT,
      fuelPct: lifetime > 0 ? Math.min(100, Math.round((lifetime / Math.max(lifetime, safeTotal)) * 100)) : 0,
      icon: Star,
      note: 'Total earned with GMG',
    },
    {
      label: 'Year-to-Date',
      value: ytd,
      color: '#06B6D4',
      fuelPct: ytd > 0 && lifetime > 0 ? Math.min(100, Math.round((ytd / lifetime) * 100)) : 0,
      icon: BarChart3,
      note: `${new Date().getFullYear()} earnings`,
    },
    {
      label: 'Last Year',
      value: lastYear,
      color: '#F59E0B',
      fuelPct: lastYear > 0 && lifetime > 0 ? Math.min(100, Math.round((lastYear / lifetime) * 100)) : 0,
      icon: History,
      note: `${new Date().getFullYear() - 1} total earned`,
    },
    {
      label: 'Available to Withdraw',
      value: availableToWithdraw,
      color: availableToWithdraw > 0 ? ACCENT : '#6B7280',
      fuelPct: availableToWithdraw > 0 ? 100 : 0,
      icon: DollarSign,
      note: availableToWithdraw > 0 ? 'Approved — ready for release' : 'No funds cleared yet',
      cta: availableToWithdraw > 0 ? { label: 'Get Paid', onClick: () => setShowRequestModal(true) } : undefined,
    },
  ];

  return (
    <>
      <style>{`
        @keyframes ps-dot-pulse { 0%,100%{opacity:1;box-shadow:0 0 4px ${ACCENT}} 50%{opacity:.5;box-shadow:0 0 10px ${ACCENT}} }
        @keyframes ps-pulse-ring { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes ps-glow { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes ps-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* ══ OUTER CONTAINER — identical to CampaignWallet ══ */}
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

        {/* Ambient glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(16,185,129,0.06) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 30%, rgba(6,182,212,0.05) 0%, transparent 55%)',
          animation: 'ps-glow 4s ease-in-out infinite',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.5) 30%, rgba(6,182,212,0.4) 60%, rgba(236,72,153,0.3) 85%, transparent 100%)',
          opacity: headerGlow ? 1 : 0.6, transition: 'opacity 0.4s',
        }} />

        {/* Left edge accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,transparent,rgba(16,185,129,0.3),transparent)', opacity: headerGlow ? 1 : 0.4, transition: 'opacity 0.4s' }} />

        <div style={{ padding: '18px 22px 20px' }}>

          {/* ── HEADER ROW ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 40, height: 40, flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 12,
                  background: headerGlow ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
                  border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.25)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'ps-float 3s ease-in-out infinite',
                  transition: 'background 0.4s, border-color 0.4s',
                  boxShadow: headerGlow ? '0 0 16px rgba(16,185,129,0.22)' : 'none',
                }}>
                  <Wallet size={17} color={ACCENT} />
                </div>
                <div style={{
                  position: 'absolute', inset: -5, borderRadius: 16,
                  border: '1px solid rgba(16,185,129,0.35)',
                  animation: pulse ? 'ps-pulse-ring 1.4s ease-out forwards' : 'none',
                  opacity: 0,
                }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0F2', letterSpacing: '-0.02em', margin: 0 }}>Project Safe</h2>
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em' }}>/ PROJECT OS</span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '2px 7px', borderRadius: 5,
                    background: headerGlow ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.1)',
                    border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.25)'}`,
                    transition: 'all 0.4s',
                    boxShadow: headerGlow ? '0 0 8px rgba(16,185,129,0.2)' : 'none',
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 5px ${ACCENT}`, animation: 'ps-dot-pulse 1.5s ease-in-out infinite' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 900, letterSpacing: '0.14em', color: ACCENT }}>LIVE</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.22)' }}>
                  {worker.project} · {worker.role} · earnings & payment command center
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', borderRadius: 20,
                background: `${pColor}10`, border: `1px solid ${pColor}25`,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: pColor, boxShadow: `0 0 8px ${pColor}` }} />
                <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: pColor, letterSpacing: '0.06em' }}>
                  {safe ? (PAYMENT_STATUS_LABEL[safe.status] ?? safe.status) : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* ── 4 WALLET CARDS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 12 }}>
            {cards.map(card => (
              <WalletCard key={card.label} card={card} headerGlow={headerGlow} />
            ))}
          </div>

          {/* ── LIVE SIGNAL TICKER ── */}
          <div style={{ marginBottom: 12 }}>
            <LiveSignalTicker tick={tick} />
          </div>

          {/* ── PAYMENT DELAY NOTICE ── */}
          {(safe?.status === 'delayed' || delayLog.length > 0) && (
            <div style={{ marginBottom: 12 }}>
              <PaymentDelayNotice worker={worker} delayLog={delayLog} />
            </div>
          )}

          {/* ── PINK AI ACTION BANNER ── */}
          <div style={{ marginBottom: 14 }}>
            <AIActionBanner
              worker={worker}
              tick={tick}
              availableToWithdraw={availableToWithdraw}
              onGetPaid={() => setShowRequestModal(true)}
            />
          </div>

          {/* ── AI INSIGHTS + ACTION BUTTONS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <AIInsightStack worker={worker} availableToWithdraw={availableToWithdraw} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 160 }}>
              {availableToWithdraw > 0 && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                    background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`,
                    color: ACCENT, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                    whiteSpace: 'nowrap' as const,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${ACCENT}28`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${ACCENT}18`; }}
                >
                  <DollarSign size={11} color={ACCENT} />
                  Get Paid
                </button>
              )}
              <button
                onClick={load}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                  background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)',
                  color: 'rgba(6,182,212,0.8)', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                <Activity size={11} color="rgba(6,182,212,0.8)" />
                Refresh Status
              </button>
              <button
                onClick={() => setShowRequestModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                  background: `${PINK}0D`, border: `1px solid ${PINK}28`,
                  color: `${PINK}CC`, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                  whiteSpace: 'nowrap' as const,
                }}
              >
                <FileText size={11} color={`${PINK}AA`} />
                Submit Request
              </button>
            </div>
          </div>

          {/* ── CURRENT PROJECT BLOCK ── */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <CurrentProjectPanel worker={worker} onGetPaid={() => setShowRequestModal(true)} />
          </div>

          {/* ── DELIVERABLES ── */}
          {worker.assignments.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <DeliverablesSection worker={worker} />
            </div>
          )}

          {/* ── PROJECT HISTORY ── */}
          <ProjectHistory allSafes={allSafes} workerProject={worker.project} workerRole={worker.role} />

        </div>
      </div>

      {showRequestModal && (
        <RequestPaymentModal
          worker={worker}
          onClose={() => setShowRequestModal(false)}
          onSubmit={() => { setShowRequestModal(false); load(); }}
        />
      )}
    </>
  );
}
