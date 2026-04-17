import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Briefcase, Brain, Rocket, Target, Activity, Clock, CheckCircle,
  DollarSign, Star, BarChart3, History, TrendingUp, Zap, Globe,
  ListChecks, ShieldCheck, Send, AlertCircle, FileText,
  CircleDot, BadgeCheck, ChevronDown, Info, RefreshCw,
  ArrowRight, Award, Shield,
} from 'lucide-react';
import { useIndustryOS } from '../../auth/IndustryOSContext';
import {
  WorkerWithRelations, PaymentDelayLog, PaymentSafe,
  fetchWorkerByEmail, fetchDelayLog, getMissingComplianceItems, WorkerSystem,
} from '../../dashboard/data/workerPaymentService';
import IndustryProjectOSSetup, { type SetupItemState } from './IndustryProjectOSSetup';
import MomentumScore from './projectOS/MomentumScore';
import NextBestAction from './projectOS/NextBestAction';
import PerformanceHeatmap from './projectOS/PerformanceHeatmap';

// ── CONSTANTS ───────────────────────────────────────────────────────────────

const ACCENT = '#10B981';
const PINK   = '#EC4899';
const CYAN   = '#06B6D4';
const AMBER  = '#F59E0B';

const STATUS_COLOR: Record<string, string> = {
  held:      AMBER,
  pending:   CYAN,
  approved:  ACCENT,
  delayed:   '#EF4444',
  paid:      ACCENT,
  cancelled: '#6B7280',
};
const STATUS_LABEL: Record<string, string> = {
  held:      'Pending Approval',
  pending:   'ACH Initiated',
  approved:  'Ready to Get Paid',
  delayed:   'Processing Delayed',
  paid:      'Paid',
  cancelled: 'Cancelled',
};

const PAYMENT_STAGES = [
  { key: 'agreement',   label: 'Agreement Active' },
  { key: 'submitted',   label: 'Deliverables Submitted' },
  { key: 'review',      label: 'Under Review' },
  { key: 'approved',    label: 'Approved' },
  { key: 'processing',  label: 'Processing' },
  { key: 'paid',        label: 'Get Paid' },
];

function buildSetupItems(worker: WorkerWithRelations | null): SetupItemState[] {
  const hasDeliverables = (worker?.assignments?.length ?? 0) > 0;
  const projectApproved = !!worker?.payment_safe && worker.payment_safe.status !== 'held';
  return [
    { key: 'agreement', label: 'Project Agreement', description: 'Review and sign the engagement terms.', ok: worker?.agreement_status === 'signed', icon: FileText },
    { key: 'w9', label: 'W-9 / EIN Documentation', description: 'Submit tax documentation for payout eligibility.', ok: !!worker && worker.w9_status !== 'missing', icon: ShieldCheck },
    { key: 'ach', label: 'ACH Banking Connection', description: 'Connect the bank account that will receive payouts.', ok: worker?.ach_status === 'connected', icon: Send },
    { key: 'deliverables', label: 'Deliverables Assigned', description: 'GMG assigns your initial milestones and deliverables.', ok: hasDeliverables, icon: ListChecks },
    { key: 'approval', label: 'Admin Project Start Approval', description: 'Final verification before the project safe activates.', ok: projectApproved, icon: CheckCircle },
  ];
}

function safeStatusToStageIndex(status?: string): number {
  if (!status) return 0;
  const map: Record<string, number> = {
    held:      1,
    pending:   2,
    approved:  3,
    delayed:   4,
    paid:      5,
    cancelled: 0,
  };
  return map[status] ?? 0;
}

const LIVE_SIGNALS = [
  { text: 'Final deliverable review completed — payment window open',       color: ACCENT, icon: CheckCircle },
  { text: 'ACH verification confirmed — funds staging for release',         color: CYAN,   icon: Zap         },
  { text: 'New project milestone assigned — check your deliverables',       color: AMBER,  icon: Target      },
  { text: 'Payment release window updated by project team',                 color: CYAN,   icon: Activity    },
  { text: 'Two deliverables due this week — complete to stay on track',     color: PINK,   icon: Clock       },
  { text: 'Historical earnings record updated',                             color: ACCENT, icon: TrendingUp  },
  { text: 'Compliance documents verified — ACH ready to process',          color: ACCENT, icon: ShieldCheck },
];

const MOCK_ACTIVITY = [
  { icon: FileText,   color: CYAN,   text: 'Project brief uploaded by project lead',       time: '2 days ago'   },
  { icon: Send,       color: ACCENT, text: 'Final deliverable submitted for review',        time: '4 days ago'   },
  { icon: AlertCircle, color: AMBER, text: 'Minor revision requested on milestone 3',       time: '6 days ago'   },
  { icon: ShieldCheck, color: ACCENT, text: 'W-9 documentation accepted',                  time: '1 week ago'   },
  { icon: Activity,   color: CYAN,   text: 'Payment moved to approval stage',               time: '10 days ago'  },
  { icon: CheckCircle, color: ACCENT, text: 'Final report received and acknowledged',       time: '2 weeks ago'  },
];

// ── UTILITIES ───────────────────────────────────────────────────────────────

function fmt(v: number): string {
  if (v === 0) return '$0';
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000)     return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v.toLocaleString()}`;
}
function fmtFull(v: number): string {
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function hexToRgb(hex: string): string {
  const c = hex.replace('#', '');
  return `${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)}`;
}
function computeEarnings(safes: PaymentSafe[]) {
  const now = new Date();
  const ytdStart = new Date(now.getFullYear(), 0, 1);
  const lyStart  = new Date(now.getFullYear() - 1, 0, 1);
  const lyEnd    = new Date(now.getFullYear(), 0, 1);
  const paid = safes.filter(s => s.status === 'paid' && s.paid_at);
  return {
    lifetime: safes.filter(s => s.status === 'paid').reduce((a, s) => a + (s.amount ?? 0), 0),
    ytd:      paid.filter(s => new Date(s.paid_at!) >= ytdStart).reduce((a, s) => a + (s.amount ?? 0), 0),
    lastYear: paid.filter(s => { const d = new Date(s.paid_at!); return d >= lyStart && d < lyEnd; }).reduce((a, s) => a + (s.amount ?? 0), 0),
  };
}

// ── ANIMATION HOOKS ─────────────────────────────────────────────────────────

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
      setDisplay(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return display;
}

function MoneyDisplay({ value, color }: { value: number; color: string }) {
  const d = useTicker(value);
  const s = d >= 1_000_000 ? `$${(d / 1_000_000).toFixed(2)}M` : d >= 1_000 ? `$${(d / 1_000).toFixed(1)}K` : `$${d.toLocaleString()}`;
  return <span style={{ color }}>{s}</span>;
}

function FuelBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginTop: 10 }}>
      <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg,${color}88,${color})`, boxShadow: `0 0 8px ${color}60`, transition: 'width 1s cubic-bezier(0.16,1,0.3,1)' }} />
    </div>
  );
}

// ── STAT CARD ───────────────────────────────────────────────────────────────

type CardDef = { label: string; value: number; color: string; fuelPct: number; icon: React.ElementType; note: string; cta?: { label: string; onClick: () => void } };

function StatCard({ card }: { card: CardDef }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      position: 'relative', overflow: 'hidden', borderRadius: 13, padding: '14px 16px 12px',
      background: hov ? `rgba(${hexToRgb(card.color)},0.04)` : 'rgba(0,0,0,0.25)',
      border: `1px solid ${hov ? `${card.color}30` : 'rgba(255,255,255,0.07)'}`,
      transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
      transform: hov ? 'translateY(-2px)' : 'none',
      boxShadow: hov ? `0 8px 28px rgba(0,0,0,0.25), 0 0 0 1px ${card.color}18` : 'none',
      backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: card.color, opacity: hov ? 0.06 : 0.03, filter: 'blur(20px)', pointerEvents: 'none' }} />
      {hov && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${card.color}50,transparent)` }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{ width: 22, height: 22, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${card.color}14`, border: `1px solid ${card.color}25`, boxShadow: hov ? `0 0 10px ${card.color}30` : 'none' }}>
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
        <button onClick={card.cta.onClick} style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', borderRadius: 8, cursor: 'pointer', background: card.color, border: 'none', color: '#000', fontFamily: 'monospace', fontSize: 10, fontWeight: 800, boxShadow: `0 2px 14px ${card.color}35` }}>
          <DollarSign size={10} color="#000" />{card.cta.label}
        </button>
      )}
    </div>
  );
}

// ── SIGNAL TICKER ───────────────────────────────────────────────────────────

function SignalTicker({ tick }: { tick: number }) {
  const idx = tick % LIVE_SIGNALS.length;
  const signal = LIVE_SIGNALS[idx];
  const Icon = signal.icon;
  const [vis, setVis] = useState(true);
  useEffect(() => { setVis(false); const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, [tick]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, overflow: 'hidden', height: 34 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px', borderRight: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}`, animation: 'ipos-dot 1.5s ease-in-out infinite' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const }}>Project Feed</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 14px', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(4px)', transition: 'opacity 0.22s, transform 0.22s' }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: `${signal.color}12`, border: `1px solid ${signal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={9} color={signal.color} />
          </div>
          <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' as const }}>{signal.text}</span>
          <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 4, background: `${signal.color}10`, border: `1px solid ${signal.color}20`, color: signal.color, flexShrink: 0 }}>LIVE</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '0 12px', borderLeft: '1px solid rgba(255,255,255,0.06)', height: '100%', flexShrink: 0 }}>
        {LIVE_SIGNALS.map((_, i) => <div key={i} style={{ width: i === idx ? 12 : 4, height: 4, borderRadius: 99, background: i === idx ? ACCENT : 'rgba(255,255,255,0.1)', transition: 'width 0.3s, background 0.3s' }} />)}
      </div>
    </div>
  );
}

// ── PINK AI ACTION BANNER ───────────────────────────────────────────────────

function AIActionBanner({ worker, tick, avail, onGetPaid }: { worker: WorkerWithRelations; tick: number; avail: number; onGetPaid: () => void }) {
  const [done, setDone] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const pulse = 0.5 + 0.5 * Math.sin(tick * 0.6);

  function handleCTA() {
    if (avail > 0) { onGetPaid(); return; }
    setConfirming(true);
    setTimeout(() => { setConfirming(false); setDone(true); }, 1500);
  }

  let msg = '', signal = '', cta = 'Complete Action';
  if (avail > 0) {
    msg = `Payment approved — ${fmtFull(avail)} ready for immediate release. Initiate your transfer now.`;
    signal = 'approved by GMG team · ACH ready · funds secured and staged';
    cta = 'Get Paid →';
  } else if (safe?.status === 'pending') {
    msg = 'ACH transfer is in progress — funds settling within 1–2 business days. No action needed from you.';
    signal = 'transfer confirmed · T+2 ACH settlement · fully protected';
    cta = 'Track Status';
  } else if (safe?.status === 'delayed') {
    msg = 'Payment processing delayed. Your funds are fully secured — the team is resolving the upstream hold.';
    signal = `delay: ${safe.delay_reason?.slice(0, 55) ?? 'upstream processing'} · your payment is protected`;
    cta = 'View Details';
  } else if (missing.length > 0) {
    msg = `Complete outstanding requirements to unlock your payment: ${missing[0]}`;
    signal = `${missing.length} item${missing.length > 1 ? 's' : ''} blocking release · action required`;
    cta = 'Submit Now';
  } else if (worker.assignments.some(a => a.status === 'in_progress' || a.status === 'open')) {
    msg = 'Submit your final milestone deliverable to unlock payment. Compliance is clear — funds are staged and ready.';
    signal = 'deliverables pending · compliance verified · payment staged for release';
    cta = 'Submit Deliverable';
  } else {
    msg = 'All deliverables submitted. Final review in progress — payment releases once approved by the project team.';
    signal = 'deliverables under review · payment release pending final team approval';
    cta = 'Check Status';
  }
  if (done) { msg = 'Action submitted. The GMG project team has been notified and will process your request shortly.'; signal = 'submitted successfully · team notified'; }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 13, padding: '14px 18px', background: done ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(6,182,212,0.05))' : 'linear-gradient(135deg,rgba(236,72,153,0.07) 0%,rgba(245,158,11,0.05) 50%,rgba(6,182,212,0.04) 100%)', border: `1px solid ${done ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.22)'}`, transition: 'all 0.4s' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: done ? 'linear-gradient(90deg,transparent,rgba(16,185,129,0.55),transparent)' : 'linear-gradient(90deg,transparent,rgba(236,72,153,0.55),rgba(245,158,11,0.35),transparent)' }} />
      {!done && <div style={{ position: 'absolute', top: -20, right: 40, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle,rgba(236,72,153,0.07),transparent 70%)', opacity: pulse, pointerEvents: 'none' }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: done ? 'rgba(16,185,129,0.12)' : 'rgba(236,72,153,0.12)', border: `1px solid ${done ? 'rgba(16,185,129,0.28)' : 'rgba(236,72,153,0.28)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? '0 0 14px rgba(16,185,129,0.12)' : '0 0 14px rgba(236,72,153,0.1)', transition: 'all 0.4s' }}>
          <Brain size={16} color={done ? ACCENT : PINK} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: done ? 'rgba(16,185,129,0.55)' : 'rgba(236,72,153,0.55)' }}>{done ? 'Submitted' : 'Best Move Right Now'}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: done ? 'rgba(16,185,129,0.1)' : 'rgba(236,72,153,0.1)', border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(236,72,153,0.2)'}`, color: done ? ACCENT : PINK }}>{done ? 'CONFIRMED' : 'AI SIGNAL'}</span>
          </div>
          <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{msg}</p>
          {!done && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Target size={8} color="rgba(236,72,153,0.5)" />
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(236,72,153,0.55)', letterSpacing: '0.06em' }}>{signal}</span>
            </div>
          )}
        </div>
        {!done && (
          <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
            <button style={{ fontFamily: 'monospace', fontSize: 8, padding: '6px 11px', borderRadius: 8, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}>Dismiss</button>
            <button onClick={handleCTA} disabled={confirming} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', padding: '8px 16px', borderRadius: 9, cursor: confirming ? 'default' : 'pointer', background: confirming ? 'rgba(16,185,129,0.2)' : PINK, border: `1px solid ${confirming ? 'rgba(16,185,129,0.3)' : PINK}`, color: confirming ? ACCENT : '#000', boxShadow: confirming ? 'none' : `0 0 14px ${PINK}35`, transition: 'all 0.25s', whiteSpace: 'nowrap' as const }}>
              <Rocket size={10} color={confirming ? ACCENT : '#000'} />
              {confirming ? 'Processing…' : cta}
            </button>
          </div>
        )}
        {done && <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}><div style={{ width: 7, height: 7, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} /><span style={{ fontFamily: 'monospace', fontSize: 9, color: ACCENT, fontWeight: 700 }}>Sent</span></div>}
      </div>
    </div>
  );
}

// ── PROJECT INTEL CARDS ─────────────────────────────────────────────────────

function ProjectIntelCards({ worker, avail }: { worker: WorkerWithRelations; avail: number }) {
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const open = worker.assignments.filter(a => a.status === 'open' || a.status === 'in_progress').length;
  const completed = worker.assignments.filter(a => a.status === 'approved').length;
  const total = worker.assignments.length;

  const cards: { icon: React.ElementType; color: string; text: string; signal: string }[] = [];
  if (avail > 0)
    cards.push({ icon: DollarSign, color: ACCENT, text: `${fmtFull(avail)} approved and ready — initiate transfer to receive funds within 24–48 hours.`, signal: 'approved by GMG · ACH ready · funds fully secured' });
  if (open > 0)
    cards.push({ icon: Rocket, color: PINK, text: `Submitting ${open} open deliverable${open > 1 ? 's' : ''} now will accelerate your payment timeline significantly.`, signal: 'triggered by open deliverable status · payment staged pending submission' });
  if (missing.length > 0)
    cards.push({ icon: Shield, color: AMBER, text: `${missing.length} compliance item${missing.length > 1 ? 's' : ''} outstanding — required before payment can be released.`, signal: `blocking payment release · ${missing[0]}` });
  if (safe?.status === 'pending')
    cards.push({ icon: Activity, color: CYAN, text: 'ACH transfer in progress. Payments typically settle within 1–2 business days after initiation.', signal: 'ACH confirmed · T+2 settlement window · no action needed' });
  if (cards.length === 0) {
    cards.push(
      { icon: TrendingUp, color: ACCENT, text: `You've completed ${completed} of ${total} deliverables. Keep momentum to unlock full payment release.`, signal: 'deliverable progress tracked · completion drives payment velocity' },
      { icon: Globe, color: AMBER, text: 'Consistent on-time delivery improves your standing for future GMG project placements and compensation.', signal: 'performance tracking active · project history building' },
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {cards.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '8px 12px', borderRadius: 10, background: `${c.color}06`, border: `1px solid ${c.color}18` }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${c.color}12`, border: `1px solid ${c.color}22`, flexShrink: 0, marginTop: 1 }}>
            <c.icon size={10} color={c.color} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: c.color, letterSpacing: '0.1em', flexShrink: 0 }}>PROJECT INTEL</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{c.text}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Target size={7} color={`${c.color}60`} />
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${c.color}70`, letterSpacing: '0.06em' }}>{c.signal}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CURRENT ASSIGNMENT MODULE ────────────────────────────────────────────────

function CurrentAssignment({ worker, onGetPaid }: { worker: WorkerWithRelations; onGetPaid: () => void }) {
  const safe = worker.payment_safe;
  const pColor = safe ? (STATUS_COLOR[safe.status] ?? ACCENT) : ACCENT;
  const total = safe?.amount ?? 0;
  const paidOut = (worker.all_safes ?? []).filter(s => s.status === 'paid').reduce((a, s) => a + (s.amount ?? 0), 0);
  const remaining = Math.max(0, total - paidOut);
  const completed = worker.assignments.filter(a => a.status === 'approved').length;
  const totalA = worker.assignments.length;
  const pct = totalA > 0 ? Math.round((completed / totalA) * 100) : 0;
  const readyToPay = safe?.status === 'approved' ? (safe.amount ?? 0) : 0;
  const stageIdx = safeStatusToStageIndex(safe?.status);

  return (
    <div style={{ position: 'relative', background: 'rgba(255,255,255,0.022)', border: `1px solid ${ACCENT}18`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${ACCENT}30,transparent)` }} />
      <div style={{ padding: '18px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, flexShrink: 0, boxShadow: `0 0 16px ${ACCENT}12` }}>
              <Briefcase size={17} color={ACCENT} />
            </div>
            <div>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase' as const, letterSpacing: '0.14em', color: `${ACCENT}60`, margin: '0 0 4px' }}>Current Assignment</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: 'rgba(255,255,255,0.92)', margin: 0, letterSpacing: '-0.02em' }}>{worker.project}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>{worker.role}</p>
            </div>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '5px 11px', borderRadius: 20, color: pColor, background: `${pColor}10`, border: `1px solid ${pColor}20`, flexShrink: 0, letterSpacing: '0.06em' }}>
            {safe ? (STATUS_LABEL[safe.status] ?? safe.status) : 'Active'}
          </span>
        </div>

        {/* Value stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Total Value', value: fmt(total),     color: CYAN,  sub: 'Contracted fee' },
            { label: 'Paid Out',    value: fmt(paidOut),   color: ACCENT, sub: 'Released to you' },
            { label: 'Remaining',   value: fmt(remaining), color: remaining > 0 ? AMBER : 'rgba(255,255,255,0.18)', sub: 'Pending release' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 11, padding: '12px 14px', textAlign: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.22)', marginTop: 5 }}>{s.label}</p>
              <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.12)', marginTop: 2 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>Overall completion</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: ACCENT }}>{pct}%</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>({completed}/{totalA} deliverables)</span>
            </div>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg,${ACCENT}88,${ACCENT})`, boxShadow: pct > 0 ? `0 0 10px ${ACCENT}50` : 'none', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)' }} />
          </div>
        </div>

        {/* Payment stage trail */}
        <div style={{ marginBottom: readyToPay > 0 ? 16 : 0 }}>
          <p style={{ fontFamily: 'monospace', fontSize: 7.5, textTransform: 'uppercase' as const, letterSpacing: '0.13em', color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>Payment Stage</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {PAYMENT_STAGES.map((stage, i) => {
              const isActive = i === stageIdx;
              const isPast   = i < stageIdx;
              const color    = isPast ? ACCENT : isActive ? (stageIdx === 5 ? ACCENT : AMBER) : 'rgba(255,255,255,0.1)';
              const isLast   = i === PAYMENT_STAGES.length - 1;
              return (
                <div key={stage.key} style={{ display: 'flex', alignItems: 'center', flex: isLast ? 'none' : 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: isActive ? 14 : 10, height: isActive ? 14 : 10, borderRadius: '50%', background: color, boxShadow: isActive ? `0 0 10px ${color}` : 'none', border: `2px solid ${color}`, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {isPast && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#000' }} />}
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: isActive ? 7.5 : 7, fontWeight: isActive ? 700 : 400, color: isActive ? color : isPast ? `${ACCENT}55` : 'rgba(255,255,255,0.15)', whiteSpace: 'nowrap' as const, letterSpacing: '0.04em' }}>{stage.label}</span>
                  </div>
                  {!isLast && <div style={{ flex: 1, height: 2, background: i < stageIdx ? ACCENT : 'rgba(255,255,255,0.06)', marginBottom: 18, transition: 'background 0.4s', marginLeft: 0, marginRight: 0 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {readyToPay > 0 && (
          <button onClick={onGetPaid} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '12px 0', borderRadius: 10, cursor: 'pointer', background: ACCENT, border: 'none', color: '#000', fontSize: 13, fontWeight: 800, boxShadow: `0 4px 24px ${ACCENT}35`, letterSpacing: '0.01em' }}>
            <DollarSign size={14} color="#000" />
            Get Paid — {fmt(readyToPay)} Available
            <ArrowRight size={14} color="#000" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── DELIVERABLES MODULE ──────────────────────────────────────────────────────

const DELIV_STATUS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  open:        { label: 'Not Started', color: '#6B7280',  icon: CircleDot   },
  in_progress: { label: 'In Progress', color: AMBER,      icon: Zap         },
  submitted:   { label: 'In Review',   color: CYAN,       icon: Send        },
  approved:    { label: 'Complete',    color: ACCENT,     icon: CheckCircle },
  rejected:    { label: 'Needs Revision', color: '#EF4444', icon: AlertCircle },
  cancelled:   { label: 'Cancelled',   color: '#6B7280',  icon: AlertCircle },
};

function DeliverablesModule({ worker }: { worker: WorkerWithRelations }) {
  if (!worker.assignments.length) return null;
  const done = worker.assignments.filter(a => a.status === 'approved').length;
  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}18` }}>
            <ListChecks size={13} color={ACCENT} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.82)', margin: 0 }}>Deliverables & Milestones</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Your active work items and completion status</p>
          </div>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: ACCENT, padding: '3px 8px', borderRadius: 6, background: `${ACCENT}10`, border: `1px solid ${ACCENT}18` }}>{done}/{worker.assignments.length} complete</span>
      </div>
      <div>
        {worker.assignments.map((item, i) => {
          const meta = DELIV_STATUS[item.status] ?? DELIV_STATUS.open;
          const Icon = meta.icon;
          const isNext = i === worker.assignments.findIndex(a => a.status === 'open' || a.status === 'in_progress');
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < worker.assignments.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${meta.color}10`, border: `1px solid ${meta.color}22`, flexShrink: 0 }}>
                <Icon size={13} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', margin: 0 }}>{item.deliverable_title}</p>
                  {isNext && <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: AMBER, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>NEXT</span>}
                </div>
                {item.due_date && <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>Due {item.due_date}</p>}
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '4px 8px', borderRadius: 6, color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}22`, flexShrink: 0 }}>{meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── EARNINGS RECORD ──────────────────────────────────────────────────────────

function EarningsRecord({ worker, lifetime, ytd, lastYear, allSafes }: { worker: WorkerWithRelations; lifetime: number; ytd: number; lastYear: number; allSafes: PaymentSafe[] }) {
  const completed = allSafes.filter(s => s.status === 'paid').length;
  const onTime = completed > 0 ? Math.round((completed / Math.max(worker.assignments.length, 1)) * 100) : 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: `1px solid ${ACCENT}14`, borderRadius: 14, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${ACCENT}25,transparent)` }} />
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.18)' }}>
              <Award size={13} color={AMBER} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.82)', margin: 0 }}>Your GMG Earnings Record</p>
              <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Your completed work history with the network</p>
            </div>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 19, fontWeight: 800, color: ACCENT, flexShrink: 0 }}>{fmt(lifetime)}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Lifetime', value: fmt(lifetime), color: ACCENT },
            { label: 'Year-to-Date', value: fmt(ytd), color: CYAN },
            { label: 'Last Year', value: fmt(lastYear), color: AMBER },
            { label: 'Projects', value: `${completed}`, color: '#A78BFA' },
          ].map(s => (
            <div key={s.label} style={{ borderRadius: 10, padding: '10px 12px', textAlign: 'center', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', marginTop: 5, textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: `${ACCENT}06`, border: `1px solid ${ACCENT}14` }}>
          <TrendingUp size={13} color={`${ACCENT}55`} style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', margin: 0, lineHeight: 1.6 }}>
            Your completed work history strengthens future project access and placement priority within the GMG network.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── PROJECT HISTORY ──────────────────────────────────────────────────────────

function ProjectHistory({ safes, project, role }: { safes: PaymentSafe[]; project: string; role: string }) {
  const [showAll, setShowAll] = useState(false);
  const paid = safes.filter(s => s.status === 'paid' && s.paid_at).sort((a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime());
  const total = paid.reduce((a, s) => a + (s.amount ?? 0), 0);
  const visible = showAll ? paid : paid.slice(0, 4);

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.18)' }}>
            <History size={13} color={CYAN} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.82)', margin: 0 }}>Project History</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>All completed & paid assignments</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {total > 0 && <p style={{ fontSize: 13, fontWeight: 700, color: ACCENT, margin: 0 }}>{fmtFull(total)}</p>}
          <span style={{ fontFamily: 'monospace', fontSize: 8.5, padding: '2px 7px', borderRadius: 5, color: CYAN, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>{paid.length}</span>
        </div>
      </div>
      {paid.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)' }}>
            <History size={16} color="rgba(255,255,255,0.1)" />
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, textAlign: 'center' }}>No completed projects yet. Your payment history will appear here.</p>
        </div>
      ) : (
        <>
          {visible.map((s, i) => {
            const date = s.paid_at ? new Date(s.paid_at) : null;
            const dateStr = date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <div style={{ width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}10`, border: `1px solid ${ACCENT}20`, flexShrink: 0 }}>
                  <BadgeCheck size={14} color={ACCENT} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' as const }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{project}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}18` }}>Paid</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>Completed</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{role}</span>
                    {date && <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.12)' }}>· {date.getFullYear()}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: ACCENT, margin: 0 }}>{fmt(s.amount ?? 0)}</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>{dateStr}</p>
                </div>
              </div>
            );
          })}
          {paid.length > 4 && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button onClick={() => setShowAll(v => !v)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <ChevronDown size={13} style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                {showAll ? 'Show Less' : `Show ${paid.length - 4} More`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── COMPLIANCE MODULE ────────────────────────────────────────────────────────

function ComplianceReadiness({ worker }: { worker: WorkerWithRelations }) {
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const items = [
    { label: 'Project Agreement',         done: true,                            note: 'Executed on file'          },
    { label: 'W-9 / EIN on File',         done: worker.w9_status === 'verified' || worker.w9_status === 'submitted', note: worker.w9_status === 'verified' ? 'Verified' : worker.w9_status === 'submitted' ? 'Under review' : 'Required for payment' },
    { label: 'ACH Banking Connected',     done: worker.ach_status === 'connected', note: worker.ach_status === 'connected' ? 'Account verified' : 'Connect to receive payments' },
    { label: 'Deliverable Agreement',     done: true,                            note: 'Accepted'                  },
    { label: 'Final Signoff Submitted',   done: !worker.assignments.some(a => a.status === 'open' || a.status === 'in_progress'), note: missing.length === 0 ? 'All submitted' : 'Outstanding items remain' },
  ];
  const allClear = items.every(i => i.done);

  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: `1px solid ${allClear ? `${ACCENT}18` : 'rgba(245,158,11,0.15)'}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${allClear ? 'rgba(255,255,255,0.05)' : 'rgba(245,158,11,0.08)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: allClear ? `${ACCENT}10` : 'rgba(245,158,11,0.1)', border: `1px solid ${allClear ? `${ACCENT}18` : 'rgba(245,158,11,0.2)'}` }}>
            <ShieldCheck size={13} color={allClear ? ACCENT : AMBER} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.82)', margin: 0 }}>Project Readiness</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Compliance & payment prerequisites</p>
          </div>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '4px 10px', borderRadius: 20, color: allClear ? ACCENT : AMBER, background: allClear ? `${ACCENT}10` : 'rgba(245,158,11,0.1)', border: `1px solid ${allClear ? `${ACCENT}20` : 'rgba(245,158,11,0.2)'}` }}>
          {allClear ? 'All Clear' : `${items.filter(i => !i.done).length} Pending`}
        </span>
      </div>
      <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 9, background: item.done ? `${ACCENT}04` : 'rgba(245,158,11,0.03)', border: `1px solid ${item.done ? `${ACCENT}10` : 'rgba(245,158,11,0.1)'}` }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.done ? `${ACCENT}12` : 'rgba(245,158,11,0.1)', border: `1px solid ${item.done ? `${ACCENT}22` : 'rgba(245,158,11,0.2)'}`, flexShrink: 0 }}>
              {item.done ? <CheckCircle size={11} color={ACCENT} /> : <Clock size={11} color={AMBER} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11.5, color: item.done ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.45)', margin: 0 }}>{item.label}</p>
              <p style={{ fontFamily: 'monospace', fontSize: 8, color: item.done ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)', marginTop: 2 }}>{item.note}</p>
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '2px 7px', borderRadius: 5, color: item.done ? ACCENT : AMBER, background: item.done ? `${ACCENT}10` : 'rgba(245,158,11,0.08)', border: `1px solid ${item.done ? `${ACCENT}18` : 'rgba(245,158,11,0.18)'}`, flexShrink: 0 }}>
              {item.done ? 'Verified' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PAYMENT TIMING NOTICE ────────────────────────────────────────────────────

function PaymentTimingNotice({ worker, log }: { worker: WorkerWithRelations; log: PaymentDelayLog[] }) {
  const safe = worker.payment_safe;
  if (safe?.status !== 'delayed' && log.length === 0) return null;
  const latest = log[0];
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 13, background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.2)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,158,11,0.3),transparent)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderBottom: '1px solid rgba(245,158,11,0.1)' }}>
        <Clock size={14} color={AMBER} />
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: AMBER, margin: 0 }}>Payment Timing Update</p>
          <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(245,158,11,0.45)', marginTop: 2 }}>No action required from you</p>
        </div>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {safe?.delay_reason && <p style={{ fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{safe.delay_reason}</p>}
        {latest && (
          <div style={{ borderRadius: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: 11, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{latest.reason}</p>
            <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.18)', marginTop: 6 }}>{latest.logged_by ?? 'GMG Team'} · {new Date(latest.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, borderRadius: 10, padding: '10px 14px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <Info size={13} color="rgba(245,158,11,0.4)" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 10.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.32)', margin: 0 }}>Upstream payment timing update. Your funds will be released once upstream clearance is received. Your payment is fully protected.</p>
        </div>
      </div>
    </div>
  );
}

// ── ACTIVITY TIMELINE ────────────────────────────────────────────────────────

function ActivityTimeline({ worker }: { worker: WorkerWithRelations }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.18)' }}>
          <Activity size={13} color={PINK} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.82)', margin: 0 }}>Recent Activity</p>
          <p style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Timeline of project actions and updates</p>
        </div>
      </div>
      <div style={{ padding: '4px 0' }}>
        {MOCK_ACTIVITY.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 18px', borderBottom: i < MOCK_ACTIVITY.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                  <Icon size={11} color={item.color} />
                </div>
                {i < MOCK_ACTIVITY.length - 1 && <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.05)', marginTop: 2 }} />}
              </div>
              <div style={{ flex: 1, paddingTop: 3 }}>
                <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                <p style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', marginTop: 4 }}>{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── GET PAID MODAL ───────────────────────────────────────────────────────────

function GetPaidModal({ worker, onClose, onSubmit }: { worker: WorkerWithRelations; onClose: () => void; onSubmit: () => void }) {
  const [deliverable, setDeliverable] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!amount.trim() || !confirmed) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false); setSubmitted(true);
    setTimeout(() => { onSubmit(); }, 1600);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 440, background: '#0D0F13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: `${ACCENT}04` }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}12`, border: `1px solid ${ACCENT}22`, boxShadow: `0 0 16px ${ACCENT}14` }}>
            <DollarSign size={16} color={ACCENT} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Get Paid</p>
            <p style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{worker.project} · Payment Request</p>
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {submitted ? (
          <div style={{ padding: 36, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}12`, border: `1px solid ${ACCENT}22` }}>
              <CheckCircle size={24} color={ACCENT} />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Request Submitted</p>
              <p style={{ fontSize: 11.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.32)', marginTop: 8 }}>Your payment request has been sent to the GMG project team for review.</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8.5, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Deliverable Completed</label>
              <input value={deliverable} onChange={e => setDeliverable(e.target.value)} placeholder="Which milestone are you invoicing for?" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.65)', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8.5, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Invoice Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px 14px 10px 26px', borderRadius: 10, fontSize: 16, fontWeight: 700, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', outline: 'none', boxSizing: 'border-box' as const }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 8.5, textTransform: 'uppercase' as const, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', marginBottom: 6 }}>Notes (optional)</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Invoice number, period, or context…" rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', outline: 'none', resize: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }} onClick={() => setConfirmed(v => !v)}>
              <div style={{ width: 17, height: 17, borderRadius: 5, flexShrink: 0, marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: confirmed ? ACCENT : 'transparent', border: `1px solid ${confirmed ? ACCENT : 'rgba(255,255,255,0.15)'}`, transition: 'all 0.15s' }}>
                {confirmed && <CheckCircle size={10} color="#fff" />}
              </div>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.58)', margin: 0 }}>I confirm all listed deliverables are complete</p>
                <p style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>This will go to the project team for review and approval</p>
              </div>
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontSize: 11, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={!amount.trim() || !confirmed || submitting} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderRadius: 10, border: 'none', background: ACCENT, color: '#000', fontSize: 12, fontWeight: 700, cursor: !amount.trim() || !confirmed || submitting ? 'not-allowed' : 'pointer', opacity: !amount.trim() || !confirmed || submitting ? 0.45 : 1, transition: 'opacity 0.2s' }}>
                <Send size={13} color="#000" />
                {submitting ? 'Submitting…' : 'Submit Payment Request'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── NO WORKER STATE ──────────────────────────────────────────────────────────

function NotYetAssigned({ name }: { name: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 16px', gap: 24 }}>
      <div style={{ position: 'relative' }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${ACCENT}08`, border: `1px solid ${ACCENT}15` }}>
          <Briefcase size={26} color={`${ACCENT}45`} />
        </div>
        <div style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <Clock size={11} color={AMBER} />
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 340 }}>
        <p style={{ fontFamily: 'monospace', fontSize: 8.5, textTransform: 'uppercase' as const, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>Project OS</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.8)', margin: '0 0 12px' }}>Workspace Setting Up</h1>
        <p style={{ fontSize: 12.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.3)', margin: 0 }}>Welcome, {name}. Your project safe is being configured by the GMG team.</p>
      </div>
      <div style={{ width: '100%', maxWidth: 340, borderRadius: 14, padding: 20, background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {['Project agreement sent for signature', 'W-9 / EIN documentation request', 'ACH banking connection setup', 'Deliverables and milestones assigned', 'Project safe activated'].map(item => (
          <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: `${ACCENT}30`, flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', margin: 0 }}>{item}</p>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>Questions? <a href="mailto:projects@greatermusic.com" style={{ color: `${ACCENT}50` }}>projects@greatermusic.com</a></p>
    </div>
  );
}

// ── MAIN PAGE COMPONENT ──────────────────────────────────────────────────────

interface Props {
  system?: WorkerSystem;
}

export default function IndustryProjectOS({ system = 'industry_os' }: Props) {
  const { iosAuth } = useIndustryOS();
  const member = iosAuth.member;

  const [worker, setWorker] = useState<WorkerWithRelations | null>(null);
  const [delayLog, setDelayLog] = useState<PaymentDelayLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [tick, setTick] = useState(0);
  const [headerGlow, setHeaderGlow] = useState(false);

  const load = useCallback(async () => {
    if (!member) return;
    setLoading(true);
    const w = await fetchWorkerByEmail(member.email, system);
    setWorker(w);
    if (w?.payment_safe) {
      const log = await fetchDelayLog(w.payment_safe.id);
      setDelayLog(log);
    }
    setLoading(false);
  }, [member, system]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const iv = setInterval(() => {
      setPulse(p => !p);
      setTick(t => t + 1);
      setHeaderGlow(true);
      setTimeout(() => setHeaderGlow(false), 700);
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  if (!member) return null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 0' }}>
        <RefreshCw size={22} color="rgba(255,255,255,0.2)" style={{ animation: 'ipos-spin 1s linear infinite' }} />
        <style>{`@keyframes ipos-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── STATE DERIVATION ───────────────────────────────────────────────
  const hasProjectAssignment = !!worker && (worker.assignments?.length ?? 0) > 0;
  const projectAgreementSigned = worker?.agreement_status === 'signed';
  const w9OrEinSubmitted = !!worker && worker.w9_status !== 'missing';
  const achConnected = worker?.ach_status === 'connected';
  const deliverablesAssigned = hasProjectAssignment;
  const adminProjectStartApproved = !!worker?.payment_safe;
  const setupComplete =
    projectAgreementSigned &&
    w9OrEinSubmitted &&
    achConnected &&
    deliverablesAssigned &&
    adminProjectStartApproved;

  let view: 'NO_ASSIGNMENT' | 'SETUP' | 'LIVE_WORKER_SAFE';
  if (!worker || !hasProjectAssignment) view = 'NO_ASSIGNMENT';
  else if (!setupComplete) view = 'SETUP';
  else view = 'LIVE_WORKER_SAFE';

  // NO_ASSIGNMENT state
  if (view === 'NO_ASSIGNMENT') {
    return (
      <div style={{ padding: '64px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)' }}>
          <Briefcase size={22} color={CYAN} />
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#F0F0F2', margin: 0 }}>No Active Project Assignment</h1>
          <p style={{ marginTop: 8, maxWidth: 460, fontSize: 13, color: 'rgba(255,255,255,0.48)', lineHeight: 1.55 }}>
            Your Project OS will activate as soon as GMG assigns you to a live project. Historical earnings and assignments will appear here once available.
          </p>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', padding: '6px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', letterSpacing: '0.08em' }}>
          VIEW: NO_ASSIGNMENT · setup_complete: {String(setupComplete)} · admin_start_approved: {String(adminProjectStartApproved)} · assignment: {String(hasProjectAssignment)}
        </div>
      </div>
    );
  }

  // SETUP state
  if (view === 'SETUP') {
    return (
      <IndustryProjectOSSetup
        name={member.full_name}
        items={buildSetupItems(worker)}
      />
    );
  }
  // else LIVE_WORKER_SAFE — fall through to premium dashboard below

  const safe = worker.payment_safe;
  const allSafes = worker.all_safes ?? (safe ? [safe] : []);
  const pColor = safe ? (STATUS_COLOR[safe.status] ?? '#6B7280') : ACCENT;
  const avail = safe?.status === 'approved' ? (safe.amount ?? 0) : 0;
  const { lifetime, ytd, lastYear } = computeEarnings(allSafes);
  const safeTotal = safe?.amount ?? 0;

  const cards: CardDef[] = [
    { label: 'Lifetime Project Earnings', value: lifetime, color: ACCENT, fuelPct: lifetime > 0 ? Math.min(100, Math.round((lifetime / Math.max(lifetime, safeTotal)) * 100)) : 0, icon: Star, note: 'Total earned across all GMG projects' },
    { label: 'Year-to-Date Earnings',     value: ytd,      color: CYAN,  fuelPct: ytd > 0 && lifetime > 0 ? Math.min(100, Math.round((ytd / lifetime) * 100)) : 0, icon: BarChart3, note: `Earnings across ${new Date().getFullYear()} assignments` },
    { label: 'Last Year Earnings',        value: lastYear, color: AMBER, fuelPct: lastYear > 0 && lifetime > 0 ? Math.min(100, Math.round((lastYear / lifetime) * 100)) : 0, icon: History, note: `Historical ${new Date().getFullYear() - 1} project payouts` },
    { label: 'Available to Get Paid',     value: avail,    color: avail > 0 ? ACCENT : '#6B7280', fuelPct: avail > 0 ? 100 : 0, icon: DollarSign, note: avail > 0 ? 'Cleared — ready for ACH release' : 'No funds cleared yet', cta: avail > 0 ? { label: 'Get Paid', onClick: () => setShowModal(true) } : undefined },
  ];

  // Status pill config
  const statusPills = [
    { label: 'Active Assignment', color: ACCENT },
    { label: 'GMG Project Network', color: CYAN  },
    { label: safe?.status === 'approved' ? 'Ready to Get Paid' : safe?.status === 'pending' ? 'Payment Processing' : 'Controlled Workflow', color: pColor },
  ];

  return (
    <>
      <style>{`
        @keyframes ipos-dot   { 0%,100%{opacity:1;box-shadow:0 0 4px ${ACCENT}} 50%{opacity:.4;box-shadow:0 0 10px ${ACCENT}} }
        @keyframes ipos-ring  { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.4);opacity:0} }
        @keyframes ipos-glow  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes ipos-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes ipos-spin  { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes ipos-fade-slide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes ipos-ambient { 0%,100% { transform: translate(0,0) } 50% { transform: translate(-6px,4px) } }
        @media (max-width: 900px) {
          .ipos-hero-grid { grid-template-columns: 1fr !important; }
          .ipos-stat-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ══ OUTER SHELL ══ */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden',
        border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.32)' : 'rgba(16,185,129,0.18)'}`,
        background: 'linear-gradient(135deg,rgba(16,185,129,0.04) 0%,rgba(6,182,212,0.03) 40%,rgba(236,72,153,0.03) 100%)',
        boxShadow: headerGlow
          ? '0 0 60px rgba(16,185,129,0.1),0 0 120px rgba(6,182,212,0.06),inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 0 60px rgba(16,185,129,0.06),0 0 120px rgba(6,182,212,0.04),inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'border-color 0.5s, box-shadow 0.5s',
      }}>

        {/* Ambient glow layer */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 20% 50%,rgba(16,185,129,0.06) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 80% 30%,rgba(6,182,212,0.05) 0%,transparent 55%)', animation: 'ipos-glow 4s ease-in-out infinite' }} />
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent 0%,rgba(16,185,129,0.5) 30%,rgba(6,182,212,0.4) 60%,rgba(236,72,153,0.3) 85%,transparent 100%)', opacity: headerGlow ? 1 : 0.6, transition: 'opacity 0.4s' }} />
        {/* Left edge accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg,transparent,rgba(16,185,129,0.3),transparent)', opacity: headerGlow ? 1 : 0.4, transition: 'opacity 0.4s' }} />

        <div style={{ padding: '20px 24px 24px' }}>

          {/* ── HERO HEADER ── */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Icon with pulse ring */}
                <div style={{ position: 'relative', width: 46, height: 46, flexShrink: 0 }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: headerGlow ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)', border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ipos-float 3s ease-in-out infinite', boxShadow: headerGlow ? '0 0 20px rgba(16,185,129,0.22)' : 'none', transition: 'all 0.4s' }}>
                    <Briefcase size={19} color={ACCENT} />
                  </div>
                  <div style={{ position: 'absolute', inset: -6, borderRadius: 18, border: '1px solid rgba(16,185,129,0.35)', animation: pulse ? 'ipos-ring 1.4s ease-out forwards' : 'none', opacity: 0 }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#F0F0F2', letterSpacing: '-0.025em', margin: 0 }}>Project OS</h1>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.15em' }}>/ WORKER SAFE</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 5, background: headerGlow ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.1)', border: `1px solid ${headerGlow ? 'rgba(16,185,129,0.45)' : 'rgba(16,185,129,0.25)'}`, transition: 'all 0.4s', boxShadow: headerGlow ? '0 0 8px rgba(16,185,129,0.2)' : 'none' }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: ACCENT, boxShadow: `0 0 5px ${ACCENT}`, animation: 'ipos-dot 1.5s ease-in-out infinite' }} />
                      <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 900, letterSpacing: '0.14em', color: ACCENT }}>LIVE</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>Your project work, payment progress, and deliverables — operated as one system.</p>
                </div>
              </div>

              {/* Status pill — right */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: `${pColor}10`, border: `1px solid ${pColor}25` }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: pColor, boxShadow: `0 0 8px ${pColor}` }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: pColor, letterSpacing: '0.06em' }}>
                    {safe ? (STATUS_LABEL[safe.status] ?? safe.status) : 'Active'}
                  </span>
                </div>
                {/* DEBUG PILL — remove after verification */}
                <div style={{ fontFamily: 'monospace', fontSize: 8, lineHeight: 1.5, color: 'rgba(255,255,255,0.55)', padding: '6px 10px', borderRadius: 8, background: 'rgba(236,72,153,0.08)', border: '1px dashed rgba(236,72,153,0.35)', letterSpacing: '0.04em', textAlign: 'right' }}>
                  <div style={{ color: PINK, fontWeight: 700 }}>VIEW: LIVE_WORKER_SAFE</div>
                  <div>setup_complete: {String(setupComplete)}</div>
                  <div>admin_start_approved: {String(adminProjectStartApproved)}</div>
                  <div>assignment: {String(hasProjectAssignment)}</div>
                </div>
              </div>
            </div>

            {/* Subline pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
              {statusPills.map(pill => (
                <span key={pill.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 8, padding: '3px 9px', borderRadius: 6, color: pill.color, background: `${pill.color}08`, border: `1px solid ${pill.color}18`, letterSpacing: '0.06em' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: pill.color }} />
                  {pill.label}
                </span>
              ))}
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', padding: '3px 9px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', letterSpacing: '0.04em' }}>
                {member.full_name}
              </span>
            </div>
          </div>

          {/* ── STAT CARDS + MOMENTUM SCORE ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 200px', gap: 12, marginBottom: 12, alignItems: 'stretch' }} className="ipos-hero-grid">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }} className="ipos-stat-grid">
              {cards.map((c, i) => (
                <div key={c.label} style={{ animation: `ipos-fade-slide 0.55s ease-out ${i * 70}ms both` }}>
                  <StatCard card={c} />
                </div>
              ))}
            </div>
            <div style={{ animation: 'ipos-fade-slide 0.65s ease-out 200ms both' }}>
              <MomentumScore worker={worker} />
            </div>
          </div>

          {/* ── PERFORMANCE HEATMAP ── */}
          <div style={{ marginBottom: 12, animation: 'ipos-fade-slide 0.6s ease-out 260ms both' }}>
            <PerformanceHeatmap />
          </div>

          {/* ── SIGNAL TICKER ── */}
          <div style={{ marginBottom: 12 }}>
            <SignalTicker tick={tick} />
          </div>

          {/* ── PAYMENT TIMING NOTICE (conditional) ── */}
          {(safe?.status === 'delayed' || delayLog.length > 0) && (
            <div style={{ marginBottom: 12 }}>
              <PaymentTimingNotice worker={worker} log={delayLog} />
            </div>
          )}

          {/* ── PINK AI ACTION BANNER ── */}
          <div style={{ marginBottom: 14 }}>
            <AIActionBanner worker={worker} tick={tick} avail={avail} onGetPaid={() => setShowModal(true)} />
          </div>

          {/* ── PROJECT INTEL + ACTION BUTTONS ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start', marginBottom: 20 }}>
            <ProjectIntelCards worker={worker} avail={avail} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minWidth: 164 }}>
              {avail > 0 && (
                <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, cursor: 'pointer', background: `${ACCENT}18`, border: `1px solid ${ACCENT}40`, color: ACCENT, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${ACCENT}28`}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${ACCENT}18`}>
                  <DollarSign size={11} color={ACCENT} />Get Paid
                </button>
              )}
              <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, cursor: 'pointer', background: `${PINK}0D`, border: `1px solid ${PINK}28`, color: `${PINK}CC`, fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
                <Send size={11} color={`${PINK}AA`} />Submit Request
              </button>
              <button onClick={load} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px 16px', borderRadius: 10, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)', color: 'rgba(6,182,212,0.8)', fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', whiteSpace: 'nowrap' as const }}>
                <Activity size={11} color="rgba(6,182,212,0.8)" />Refresh Status
              </button>
            </div>
          </div>

          {/* ── CURRENT ASSIGNMENT ── */}
          <div style={{ marginBottom: 14 }}>
            <CurrentAssignment worker={worker} onGetPaid={() => setShowModal(true)} />
          </div>

          {/* ── NEXT BEST ACTION (AI) ── */}
          <div style={{ marginBottom: 14, animation: 'ipos-fade-slide 0.6s ease-out 320ms both' }}>
            <NextBestAction worker={worker} onAction={() => setShowModal(true)} />
          </div>

          {/* ── DELIVERABLES ── */}
          {worker.assignments.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <DeliverablesModule worker={worker} />
            </div>
          )}

          {/* ── TWO-COLUMN: Compliance + Activity ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <ComplianceReadiness worker={worker} />
            <ActivityTimeline worker={worker} />
          </div>

          {/* ── EARNINGS RECORD ── */}
          <div style={{ marginBottom: 14 }}>
            <EarningsRecord worker={worker} lifetime={lifetime} ytd={ytd} lastYear={lastYear} allSafes={allSafes} />
          </div>

          {/* ── PROJECT HISTORY ── */}
          <ProjectHistory safes={allSafes} project={worker.project} role={worker.role} />

        </div>
      </div>

      {showModal && worker && (
        <GetPaidModal worker={worker} onClose={() => setShowModal(false)} onSubmit={() => { setShowModal(false); load(); }} />
      )}
    </>
  );
}
