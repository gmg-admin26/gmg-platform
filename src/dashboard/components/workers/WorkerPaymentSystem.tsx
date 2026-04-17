import { useState, useEffect, useCallback, useRef } from 'react';
import {
  User, Briefcase, DollarSign, FileText, CheckCircle, XCircle,
  Clock, AlertTriangle, ChevronDown, ChevronUp, Lock, Unlock,
  BadgeCheck, CreditCard, Receipt, Building2, Phone, Mail,
  Shield, ShieldCheck, ShieldAlert, Plus, RefreshCw, Eye,
  ArrowUpRight, AlertCircle, Info, Calendar, Flag, Send,
  Wallet, ArrowDownToLine, Activity, CheckSquare, ListChecks,
  Milestone, ChevronRight, Upload, FileCheck,
} from 'lucide-react';
import {
  WorkerWithRelations, WorkerSystem, PaymentSafe, ProjectAssignment,
  fetchWorkers, updatePaymentSafeStatus, logPaymentDelay,
  updateAssignmentStatus, isPaymentReleasable, getMissingComplianceItems,
  fetchDelayLog, PaymentDelayLog,
} from '../../data/workerPaymentService';

// ── SHARED STYLE CONSTANTS ──────────────────────────────────────────────────

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
  pending:   'Processing',
  approved:  'Ready to Withdraw',
  delayed:   'Delayed',
  paid:      'Paid',
  cancelled: 'Cancelled',
};

const ASSIGNMENT_STATUS_COLOR: Record<string, string> = {
  open: '#6B7280', in_progress: '#06B6D4', submitted: '#F59E0B',
  approved: '#10B981', rejected: '#EF4444', cancelled: '#6B7280',
};

const ASSIGNMENT_STATUS_LABEL: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress', submitted: 'Submitted',
  approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled',
};

const DOC_STATUS_COLOR: Record<string, string> = {
  missing: '#EF4444', pending: '#F59E0B', sent: '#F59E0B',
  submitted: '#06B6D4', connected: '#10B981', verified: '#10B981',
  approved: '#10B981', paid: '#10B981', signed: '#10B981',
};

const FEE_LABEL: Record<string, string> = {
  hourly: 'Hourly', flat: 'Flat Fee', retainer: 'Retainer', rev_share: 'Rev Share',
};

// ── TICKER ITEMS ─────────────────────────────────────────────────────────────

const PROJECT_TICKER_ITEMS = [
  { text: 'Invoice submitted — under review by project lead',      color: '#06B6D4', icon: FileCheck    },
  { text: 'W-9 approved · ACH banking verified',                   color: '#10B981', icon: ShieldCheck  },
  { text: '2 deliverables awaiting approval',                      color: '#F59E0B', icon: ListChecks   },
  { text: 'Payment delayed — awaiting client settlement',          color: '#EF4444', icon: Clock        },
  { text: 'ACH initiated Apr 16 for $2,500',                       color: '#10B981', icon: Activity     },
  { text: 'Funds ready to withdraw — ACH processing T+2',          color: '#10B981', icon: ArrowDownToLine },
  { text: 'Contract signed · Compliance gate 1 of 5 cleared',     color: '#06B6D4', icon: CheckSquare  },
  { text: 'Invoice #204 submitted — pending team approval',        color: '#F59E0B', icon: FileText     },
  { text: 'Deliverables under review — revision requested',        color: '#F59E0B', icon: Eye          },
  { text: 'ACH connected · Ready to receive payment',              color: '#10B981', icon: CreditCard   },
];

// ── SUB-COMPONENTS ───────────────────────────────────────────────────────────

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded shrink-0 uppercase"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label}
    </span>
  );
}

function ComplianceDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {ok
        ? <ShieldCheck className="w-3 h-3 text-[#10B981] shrink-0" />
        : <ShieldAlert className="w-3 h-3 text-[#EF4444] shrink-0" />}
      <span className="text-[9.5px]" style={{ color: ok ? '#10B981' : '#EF4444' }}>{label}</span>
    </div>
  );
}

// ── PROJECT PROGRESS TICKER ──────────────────────────────────────────────────

function ProjectProgressTicker({ workers }: { workers: WorkerWithRelations[] }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  const dynamicItems: typeof PROJECT_TICKER_ITEMS = [];
  workers.forEach(w => {
    const safe = w.payment_safe;
    if (safe?.status === 'delayed') {
      dynamicItems.push({
        text: `${w.name} — payment delayed${safe.delay_reason ? `: ${safe.delay_reason.slice(0, 60)}` : ' · awaiting release'}`,
        color: '#EF4444',
        icon: AlertCircle,
      });
    }
    if (safe?.status === 'approved') {
      dynamicItems.push({ text: `${w.name} — funds ready to withdraw`, color: '#10B981', icon: ArrowDownToLine });
    }
    if (safe?.status === 'pending') {
      dynamicItems.push({ text: `${w.name} — ACH initiated · processing`, color: '#06B6D4', icon: Activity });
    }
    const missing = getMissingComplianceItems(w, safe);
    if (missing.length > 0) {
      dynamicItems.push({
        text: `${w.name} — ${missing.length} compliance item${missing.length > 1 ? 's' : ''} needed before release`,
        color: '#F59E0B', icon: ShieldAlert,
      });
    }
  });

  const items = dynamicItems.length > 0 ? dynamicItems : PROJECT_TICKER_ITEMS;

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % items.length);
        setVisible(true);
      }, 250);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const item = items[idx];
  const ItemIcon = item.icon;

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0B0D10] border border-white/[0.05] rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
        <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.16em]">Project Status</span>
      </div>
      <div className="w-[1px] h-3 bg-white/[0.08] shrink-0" />
      <div className="flex items-center gap-2 flex-1 min-w-0 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}>
        <ItemIcon className="w-3 h-3 shrink-0" style={{ color: item.color }} />
        <span className="text-[11px] text-white/50 truncate">{item.text}</span>
      </div>
    </div>
  );
}

// ── WALLET CARDS (Project Safe style) ────────────────────────────────────────

interface SafeCard {
  label: string;
  desc: string;
  value: string;
  note?: string;
  color: string;
  icon: React.ElementType;
  fuelPct: number;
}

function SafeWalletCard({ card }: { card: SafeCard }) {
  const CardIcon = card.icon;
  return (
    <div className="relative bg-[#0B0D10] border rounded-2xl p-5 overflow-hidden"
      style={{ borderColor: `${card.color}18` }}>
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${card.color}35, transparent)` }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 140%, ${card.color}09 0%, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${card.color}12`, border: `1px solid ${card.color}20` }}>
          <CardIcon className="w-4 h-4" style={{ color: card.color }} />
        </div>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse mt-1.5"
          style={{ background: card.color, boxShadow: `0 0 6px ${card.color}80` }} />
      </div>

      <p className="text-[8.5px] font-mono uppercase tracking-[0.16em] mb-0.5"
        style={{ color: `${card.color}70` }}>{card.label}</p>
      <p className="text-[9px] text-white/20 mb-2 leading-snug">{card.desc}</p>
      <p className="text-[24px] font-bold leading-none" style={{ color: card.color }}>{card.value}</p>

      {card.note && (
        <p className="text-[9px] text-white/20 mt-2 font-mono">{card.note}</p>
      )}

      <div className="mt-3 h-[2px] rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${card.fuelPct}%`,
            background: `linear-gradient(90deg, ${card.color}60, ${card.color})`,
            boxShadow: `0 0 6px ${card.color}50`,
          }} />
      </div>
    </div>
  );
}

// ── REQUEST PAYMENT MODAL ─────────────────────────────────────────────────────

function RequestPaymentModal({
  worker, onClose, onSubmit,
}: {
  worker: WorkerWithRelations;
  onClose: () => void;
  onSubmit: (data: { amount: string; notes: string; deliverables: boolean }) => void;
}) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [deliverables, setDeliverables] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount.trim()) return;
    setSubmitting(true);
    await onSubmit({ amount, notes, deliverables });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0D0F13] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#10B981]/10 border border-[#10B981]/20">
            <Send className="w-3.5 h-3.5 text-[#10B981]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white/85">Request Payment</p>
            <p className="text-[9.5px] font-mono text-white/25">{worker.name} · {worker.project}</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.07] text-white/30 hover:text-white/60 transition-colors">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-[#10B981]/[0.05] border border-[#10B981]/15 rounded-xl px-4 py-3">
            <p className="text-[9px] font-mono text-[#10B981]/60 uppercase tracking-wide mb-1">Agreement Rate</p>
            <p className="text-[12px] text-[#10B981]/80">
              {FEE_LABEL[worker.fee_type] ?? worker.fee_type} ·{' '}
              {worker.fee_type === 'hourly' ? `$${worker.rate}/hr` :
               worker.fee_type === 'rev_share' ? `${worker.rate}% Rev Share` :
               `$${worker.rate.toLocaleString()} flat`}
            </p>
          </div>

          <div>
            <label className="block text-[9.5px] font-mono text-white/30 uppercase tracking-wide mb-1.5">
              Invoice Amount
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-[13px]">$</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-[14px] font-bold text-white/80 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] font-mono text-white/30 uppercase tracking-wide mb-1.5">
              Supporting Notes / Invoice Reference
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Invoice number, deliverable description, period covered..."
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-3 text-[11.5px] text-white/70 placeholder-white/20 resize-none focus:outline-none focus:border-[#10B981]/40 transition-colors"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setDeliverables(v => !v)}
              className="w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 border transition-all"
              style={{
                background: deliverables ? '#10B981' : 'transparent',
                borderColor: deliverables ? '#10B981' : 'rgba(255,255,255,0.15)',
              }}>
              {deliverables && <CheckCircle className="w-2.5 h-2.5 text-white" />}
            </div>
            <div>
              <p className="text-[11px] text-white/60 group-hover:text-white/75 transition-colors">
                I confirm all deliverables have been completed
              </p>
              <p className="text-[9.5px] text-white/25 mt-0.5">
                Checking this confirms your work is ready for review and approval
              </p>
            </div>
          </label>

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.07] text-[11px] text-white/35 hover:text-white/60 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!amount.trim() || submitting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11.5px] font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: '#10B981' }}>
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Submitting...' : 'Submit for Approval'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DELAY REASON MODAL ───────────────────────────────────────────────────────

function DelayModal({
  onClose, onSubmit,
}: { onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0D0F13] border border-white/[0.08] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EF4444]/10 border border-[#EF4444]/20">
            <Flag className="w-3.5 h-3.5 text-[#EF4444]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-white/80">Log Payment Delay</p>
            <p className="text-[9px] font-mono text-white/25">This will be recorded and visible to the worker</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Awaiting client settlement · Deliverables pending approval · ACH details missing..."
            rows={4}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-3 text-[11.5px] text-white/70 placeholder-white/20 resize-none focus:outline-none focus:border-[#EF4444]/40 transition-colors"
          />
          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-white/[0.07] text-[11px] text-white/35 hover:text-white/60 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => reason.trim() && onSubmit(reason.trim())}
              disabled={!reason.trim()}
              className="flex-1 py-2 rounded-xl text-[11px] font-semibold transition-colors disabled:opacity-40"
              style={{ background: '#EF4444', color: '#fff' }}>
              Log Delay Notice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── PAYMENT TIMELINE ─────────────────────────────────────────────────────────

interface TimelineStep {
  label: string;
  done: boolean;
  active?: boolean;
  color: string;
}

function PaymentTimeline({ worker }: { worker: WorkerWithRelations }) {
  const safe = worker.payment_safe;

  const steps: TimelineStep[] = [
    {
      label: 'Agreement Signed',
      done: worker.agreement_status === 'signed',
      color: '#10B981',
    },
    {
      label: 'Compliance Verified',
      done: !!(safe?.compliance_contract_signed && safe?.compliance_w9_submitted && safe?.compliance_ach_connected),
      color: '#06B6D4',
    },
    {
      label: 'Deliverables Submitted',
      done: worker.assignments.some(a => a.status === 'submitted' || a.status === 'approved'),
      color: '#F59E0B',
    },
    {
      label: 'Invoice Submitted',
      done: worker.invoice_status === 'submitted' || worker.invoice_status === 'approved' || worker.invoice_status === 'paid',
      color: '#F59E0B',
    },
    {
      label: 'Invoice Approved',
      done: safe?.status === 'approved' || safe?.status === 'paid',
      color: '#10B981',
    },
    {
      label: 'ACH Initiated',
      done: safe?.status === 'pending' || safe?.status === 'paid',
      color: '#06B6D4',
    },
    {
      label: 'Payment Complete',
      done: safe?.status === 'paid',
      color: '#10B981',
    },
  ];

  const firstIncomplete = steps.findIndex(s => !s.done);
  const stepsWithActive = steps.map((s, i) => ({ ...s, active: i === firstIncomplete }));

  return (
    <div className="space-y-0">
      {stepsWithActive.map((step, i) => (
        <div key={step.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: step.done ? `${step.color}18` : step.active ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${step.done ? step.color : step.active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
              }}>
              {step.done
                ? <CheckCircle className="w-2.5 h-2.5" style={{ color: step.color }} />
                : step.active
                ? <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white/40" />
                : <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              }
            </div>
            {i < stepsWithActive.length - 1 && (
              <div className="w-[1px] h-5 mt-0.5"
                style={{ background: step.done ? `${step.color}30` : 'rgba(255,255,255,0.05)' }} />
            )}
          </div>
          <p className="text-[10.5px] pt-0.5 pb-4 leading-none"
            style={{ color: step.done ? 'rgba(255,255,255,0.65)' : step.active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)' }}>
            {step.label}
            {step.active && <span className="ml-2 text-[8.5px] font-mono text-white/25 uppercase tracking-wide">← Current</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── DELAY NOTICE BLOCK ────────────────────────────────────────────────────────

function DelayNoticeBlock({ worker, delayLog }: { worker: WorkerWithRelations; delayLog: PaymentDelayLog[] }) {
  const safe = worker.payment_safe;
  if (!safe?.delay_reason && delayLog.length === 0) return null;

  const latestLog = delayLog[0];

  return (
    <div className="bg-[#EF4444]/[0.05] border border-[#EF4444]/20 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#EF4444]/10">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#EF4444]/10 border border-[#EF4444]/20">
          <AlertCircle className="w-3 h-3 text-[#EF4444]" />
        </div>
        <span className="text-[10.5px] font-bold text-[#EF4444]">Payment Delay Notice</span>
        <span className="ml-auto text-[8.5px] font-mono text-[#EF4444]/40 uppercase">Status: Delayed</span>
      </div>
      <div className="px-4 py-3.5 space-y-2.5">
        {safe?.delay_reason && (
          <div>
            <p className="text-[8.5px] font-mono text-[#EF4444]/40 uppercase tracking-wide mb-1">Reason</p>
            <p className="text-[11px] text-white/55 leading-relaxed">{safe.delay_reason}</p>
          </div>
        )}
        {latestLog && (
          <div className="bg-white/[0.02] rounded-xl px-3.5 py-2.5">
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide mb-1">Latest Update</p>
            <p className="text-[10.5px] text-white/45">{latestLog.reason}</p>
            <p className="text-[8.5px] font-mono text-white/15 mt-1">
              {latestLog.logged_by ?? 'System'} · {new Date(latestLog.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
        <div className="flex items-center gap-2 bg-white/[0.02] rounded-xl px-3.5 py-2.5">
          <Clock className="w-3 h-3 text-white/20 shrink-0" />
          <p className="text-[10px] text-white/30">
            Awaiting release or upstream settlement. No action required from worker at this time.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── COMPLIANCE STATUS BLOCK ───────────────────────────────────────────────────

function ComplianceStatusBlock({ worker }: { worker: WorkerWithRelations }) {
  const safe = worker.payment_safe;

  const items: { label: string; status: string; done: boolean }[] = [
    { label: 'Contract Signed',       status: worker.agreement_status === 'signed' ? 'complete' : worker.agreement_status === 'sent' ? 'submitted' : 'missing', done: worker.agreement_status === 'signed' },
    { label: 'W-9 / EIN Submitted',   status: worker.w9_status === 'verified' ? 'complete' : worker.w9_status === 'submitted' ? 'submitted' : 'missing', done: worker.w9_status !== 'missing' },
    { label: 'ACH Banking Connected', status: worker.ach_status === 'connected' ? 'complete' : worker.ach_status === 'pending' ? 'pending' : 'missing', done: worker.ach_status === 'connected' },
    { label: 'Invoice Submitted',     status: worker.invoice_status === 'paid' ? 'complete' : worker.invoice_status === 'approved' ? 'complete' : worker.invoice_status === 'submitted' ? 'submitted' : 'missing', done: worker.invoice_status !== 'missing' },
    { label: 'Deliverables Approved', status: safe?.compliance_deliverables_approved ? 'complete' : 'pending', done: !!safe?.compliance_deliverables_approved },
  ];

  const statusColor: Record<string, string> = {
    complete: '#10B981', submitted: '#06B6D4', pending: '#F59E0B', missing: '#EF4444', blocked: '#EF4444',
  };
  const statusLabel: Record<string, string> = {
    complete: 'Complete', submitted: 'Submitted', pending: 'Pending', missing: 'Missing', blocked: 'Blocked',
  };

  const completedCount = items.filter(i => i.done).length;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span className="text-[10.5px] font-semibold text-white/60">Compliance Status</span>
        </div>
        <span className="text-[9px] font-mono text-white/25">{completedCount} / {items.length} cleared</span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {items.map(item => {
          const col = statusColor[item.status] ?? '#6B7280';
          return (
            <div key={item.label} className="flex items-center justify-between px-4 py-2.5">
              <div className="flex items-center gap-2">
                {item.done
                  ? <CheckCircle className="w-3 h-3 text-[#10B981] shrink-0" />
                  : <div className="w-3 h-3 rounded-full border border-white/[0.12] shrink-0" />}
                <span className="text-[11px] text-white/50">{item.label}</span>
              </div>
              <PillBadge label={statusLabel[item.status] ?? item.status} color={col} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DELIVERABLE STATUS BLOCK ──────────────────────────────────────────────────

function DeliverableStatusBlock({ worker }: { worker: WorkerWithRelations }) {
  if (worker.assignments.length === 0) return null;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
        <ListChecks className="w-3.5 h-3.5 text-[#F59E0B]" />
        <span className="text-[10.5px] font-semibold text-white/60">Deliverable Status</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">
          {worker.assignments.filter(a => a.status === 'approved').length} / {worker.assignments.length} approved
        </span>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {worker.assignments.map(a => {
          const scol = ASSIGNMENT_STATUS_COLOR[a.status] ?? '#6B7280';
          return (
            <div key={a.id} className="px-4 py-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-medium text-white/65 flex-1 min-w-0 truncate">{a.deliverable_title}</p>
                <PillBadge label={ASSIGNMENT_STATUS_LABEL[a.status] ?? a.status} color={scol} />
              </div>
              {a.deliverable_description && (
                <p className="text-[9.5px] text-white/25">{a.deliverable_description}</p>
              )}
              {a.due_date && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-white/20">
                  <Calendar className="w-2.5 h-2.5" /> Due {a.due_date}
                </span>
              )}
              {a.issues && (
                <div className="flex items-start gap-1.5 bg-[#EF4444]/[0.05] border border-[#EF4444]/15 rounded-lg px-2.5 py-1.5">
                  <AlertCircle className="w-2.5 h-2.5 text-[#EF4444] shrink-0 mt-0.5" />
                  <p className="text-[9px] text-[#EF4444]/65">{a.issues}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── WORKER DETAIL DRAWER ─────────────────────────────────────────────────────

function WorkerDetailDrawer({
  worker, onClose, onRefresh,
}: {
  worker: WorkerWithRelations;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [delayLog, setDelayLog] = useState<PaymentDelayLog[]>([]);
  const [loadingLog, setLoadingLog] = useState(false);
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const releasable = safe ? isPaymentReleasable(safe) : false;

  useEffect(() => {
    if (safe) {
      setLoadingLog(true);
      fetchDelayLog(safe.id).then(log => { setDelayLog(log); setLoadingLog(false); });
    }
  }, [safe?.id]);

  const handleDelay = async (reason: string) => {
    if (!safe) return;
    await logPaymentDelay(safe.id, worker.id, reason, 'Admin');
    await updatePaymentSafeStatus(safe.id, 'delayed', { delay_reason: reason });
    setShowDelayModal(false);
    onRefresh();
  };

  const handleApprove = async () => {
    if (!safe || !releasable) return;
    await updatePaymentSafeStatus(safe.id, 'approved', { approved_by: 'Admin', approved_at: new Date().toISOString() });
    onRefresh();
  };

  const handleMarkPaid = async () => {
    if (!safe) return;
    await updatePaymentSafeStatus(safe.id, 'paid', { paid_at: new Date().toISOString() });
    onRefresh();
  };

  const handleRequestPayment = async ({ amount, notes }: { amount: string; notes: string; deliverables: boolean }) => {
    setShowRequestModal(false);
    onRefresh();
  };

  const safeStatusColor = safe ? (PAYMENT_STATUS_COLOR[safe.status] ?? '#6B7280') : '#6B7280';
  const safeStatusLabel = safe ? (PAYMENT_STATUS_LABEL[safe.status] ?? safe.status) : 'No Safe';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[680px] bg-[#09090C] border-l border-white/[0.06] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05] shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#3B82F6]/10 border border-[#3B82F6]/20">
            <User className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-white/90 truncate">{worker.name}</p>
            <p className="text-[9.5px] text-white/30">{worker.role} · {worker.project}</p>
          </div>
          <div className="flex items-center gap-2">
            {safe && <PillBadge label={safeStatusLabel} color={safeStatusColor} />}
            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/[0.07] text-white/30 hover:text-white/60 transition-colors">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2.5 px-5 py-3 border-b border-white/[0.04] shrink-0">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-semibold text-white transition-all"
            style={{ background: '#10B981', boxShadow: '0 2px 12px rgba(16,185,129,0.25)' }}>
            <Send className="w-3 h-3" /> Request Payment
          </button>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/[0.09] text-[11px] text-white/45 hover:text-white/65 hover:border-white/[0.14] transition-all">
            <ArrowDownToLine className="w-3 h-3" /> Transfer to Bank
          </button>
          {safe && safe.status !== 'paid' && safe.status !== 'cancelled' && (
            <button onClick={() => setShowDelayModal(true)}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/[0.06] text-[10.5px] text-[#EF4444] hover:bg-[#EF4444]/[0.1] transition-all">
              <Flag className="w-3 h-3" /> Log Delay
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-4">

            {/* Delay Notice */}
            {safe?.status === 'delayed' && (
              <DelayNoticeBlock worker={worker} delayLog={delayLog} />
            )}

            {/* Project Safe Card */}
            {safe && (
              <div className="relative bg-[#0B0D10] border rounded-2xl overflow-hidden"
                style={{ borderColor: `${safeStatusColor}20` }}>
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${safeStatusColor}35, transparent)` }} />
                <div className="px-5 pt-4 pb-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {releasable
                        ? <Unlock className="w-3.5 h-3.5 text-[#10B981]" />
                        : <Lock className="w-3.5 h-3.5 text-[#EF4444]" />}
                      <span className="text-[9.5px] font-mono text-white/30 uppercase tracking-wide">
                        {releasable ? 'All gates cleared — ready to release' : 'Compliance incomplete'}
                      </span>
                    </div>
                    <PillBadge label={safeStatusLabel} color={safeStatusColor} />
                  </div>

                  <div className="text-center py-3">
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Project Payment</p>
                    <p className="text-[36px] font-bold" style={{ color: safeStatusColor }}>
                      ${safe.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[9.5px] font-mono text-white/25 mt-0.5">{safe.currency} · Net {worker.payment_terms_days}</p>
                  </div>

                  {safe.expected_release_date && (
                    <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-3.5 py-2.5 mb-3">
                      <span className="text-[10.5px] text-white/35">Expected Release</span>
                      <span className="text-[11px] font-mono font-bold text-[#06B6D4]">{safe.expected_release_date}</span>
                    </div>
                  )}

                  {releasable && safe.status === 'held' && (
                    <button onClick={handleApprove}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11.5px] font-semibold text-white"
                      style={{ background: '#10B981' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Release
                    </button>
                  )}
                  {safe.status === 'approved' && (
                    <button onClick={handleMarkPaid}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11.5px] font-semibold text-white"
                      style={{ background: '#3B82F6' }}>
                      <BadgeCheck className="w-3.5 h-3.5" /> Mark Payment Complete
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Compliance Status */}
            <ComplianceStatusBlock worker={worker} />

            {/* Deliverable Status */}
            <DeliverableStatusBlock worker={worker} />

            {/* Payment Timeline */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05]">
                <Milestone className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="text-[10.5px] font-semibold text-white/60">Payment Timeline</span>
              </div>
              <div className="px-4 py-4">
                <PaymentTimeline worker={worker} />
              </div>
            </div>

            {/* Worker Profile */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4 space-y-3">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Worker Profile</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                {[
                  { icon: Briefcase,  label: 'Role',          value: worker.role },
                  { icon: Building2,  label: 'Entity',        value: worker.entity_name ?? '—' },
                  { icon: Flag,       label: 'Project',       value: worker.project },
                  { icon: DollarSign, label: 'Fee Type',      value: FEE_LABEL[worker.fee_type] ?? worker.fee_type },
                  { icon: Receipt,    label: 'Rate',          value: worker.fee_type === 'hourly' ? `$${worker.rate}/hr` : worker.fee_type === 'rev_share' ? `${worker.rate}% Rev Share` : `$${worker.rate.toLocaleString()} flat` },
                  { icon: Clock,      label: 'Payment Terms', value: `Net ${worker.payment_terms_days}` },
                  ...(worker.email ? [{ icon: Mail,  label: 'Email', value: worker.email }] : []),
                  ...(worker.phone ? [{ icon: Phone, label: 'Phone', value: worker.phone }] : []),
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2">
                    <Icon className="w-3 h-3 text-white/20 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[8.5px] font-mono text-white/20 uppercase">{label}</p>
                      <p className="text-[11px] text-white/60">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {worker.notes && (
                <div className="flex items-start gap-2 bg-white/[0.025] rounded-xl px-3.5 py-2.5">
                  <Info className="w-3 h-3 text-white/20 shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-white/35 italic">{worker.notes}</p>
                </div>
              )}
            </div>

            {/* Delay Audit Log */}
            {delayLog.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[9px] font-mono text-white/15 uppercase tracking-widest px-1">Payment Notices</p>
                {delayLog.map(log => (
                  <div key={log.id} className="flex items-start gap-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl px-3.5 py-2.5">
                    <Clock className="w-3 h-3 text-[#EF4444]/40 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10.5px] text-white/40">{log.reason}</p>
                      <p className="text-[8.5px] font-mono text-white/15 mt-0.5">
                        {log.logged_by ?? 'System'} · {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {showDelayModal && safe && (
        <DelayModal onClose={() => setShowDelayModal(false)} onSubmit={handleDelay} />
      )}
      {showRequestModal && (
        <RequestPaymentModal
          worker={worker}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequestPayment}
        />
      )}
    </>
  );
}

// ── WORKER ROW ────────────────────────────────────────────────────────────────

function WorkerRow({ worker, onSelect }: { worker: WorkerWithRelations; onSelect: () => void }) {
  const safe = worker.payment_safe;
  const missing = getMissingComplianceItems(worker, safe);
  const allClear = missing.length === 0;
  const pCol = safe ? (PAYMENT_STATUS_COLOR[safe.status] ?? '#6B7280') : '#6B7280';
  const pLabel = safe ? (PAYMENT_STATUS_LABEL[safe.status] ?? safe.status) : '—';

  return (
    <div
      onClick={onSelect}
      className="group px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.02] cursor-pointer transition-all border-b border-white/[0.03] last:border-0"
    >
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-[#3B82F6]/10 border border-[#3B82F6]/15">
        <User className="w-3.5 h-3.5 text-[#3B82F6]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[12px] font-semibold text-white/75 group-hover:text-white/90 transition-colors truncate">{worker.name}</p>
          {!allClear && <AlertTriangle className="w-3 h-3 text-[#F59E0B] shrink-0" />}
        </div>
        <p className="text-[10px] text-white/25 truncate">{worker.role} · {worker.project}</p>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        {[
          { ok: worker.agreement_status === 'signed',  label: 'Contract' },
          { ok: worker.w9_status !== 'missing',        label: 'W-9' },
          { ok: worker.invoice_status !== 'missing',   label: 'Invoice' },
          { ok: worker.ach_status === 'connected',     label: 'ACH' },
        ].map(({ ok, label }) => (
          <span key={label}
            className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
            style={{
              color: ok ? '#10B981' : 'rgba(255,255,255,0.2)',
              background: ok ? '#10B98112' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${ok ? '#10B98122' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {label}
          </span>
        ))}
      </div>

      <div className="shrink-0 text-right">
        {safe ? (
          <>
            <p className="text-[13px] font-bold" style={{ color: pCol }}>
              ${safe.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </p>
            <PillBadge label={pLabel} color={pCol} />
          </>
        ) : (
          <span className="text-[10px] font-mono text-white/20">No safe</span>
        )}
      </div>

      <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 shrink-0 transition-colors" />
    </div>
  );
}

// ── PROJECT SAFE SUMMARY (top 4 wallet cards) ─────────────────────────────────

function ProjectSafeSummary({ workers }: { workers: WorkerWithRelations[] }) {
  const safes = workers.map(w => w.payment_safe).filter(Boolean) as PaymentSafe[];

  const expectedTotal = safes.reduce((a, s) => a + s.amount, 0);
  const pendingApproval = safes.filter(s => s.status === 'held').reduce((a, s) => a + s.amount, 0);
  const achInitiated = safes.filter(s => s.status === 'pending').reduce((a, s) => a + s.amount, 0);
  const stillPending = safes.filter(s => s.status === 'delayed').reduce((a, s) => a + s.amount, 0);

  const achDate = safes.find(s => s.status === 'pending')?.updated_at;
  const achDateStr = achDate ? new Date(achDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;

  const fmt = (v: number) => v === 0 ? '$0' : v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v.toLocaleString()}`;

  const cards: SafeCard[] = [
    {
      label: 'Expected Project Payment',
      desc: 'Total project fee from signed agreements',
      value: fmt(expectedTotal),
      color: '#06B6D4',
      icon: Wallet,
      fuelPct: expectedTotal > 0 ? 100 : 0,
      note: `${safes.length} active worker${safes.length !== 1 ? 's' : ''}`,
    },
    {
      label: 'Pending Approval',
      desc: 'Submitted invoices awaiting approval / release',
      value: fmt(pendingApproval),
      color: '#F59E0B',
      icon: FileText,
      fuelPct: expectedTotal > 0 ? Math.round((pendingApproval / expectedTotal) * 100) : 0,
      note: `${safes.filter(s => s.status === 'held').length} invoice${safes.filter(s => s.status === 'held').length !== 1 ? 's' : ''} in queue`,
    },
    {
      label: 'ACH Initiated',
      desc: 'Payment processing has started',
      value: fmt(achInitiated),
      color: '#10B981',
      icon: ArrowDownToLine,
      fuelPct: expectedTotal > 0 ? Math.round((achInitiated / expectedTotal) * 100) : 0,
      note: achDateStr ? `Initiated ${achDateStr} · T+2 settlement` : 'No active ACH',
    },
    {
      label: 'Still Pending',
      desc: 'Awaiting release or upstream settlement',
      value: fmt(stillPending),
      color: '#EF4444',
      icon: Clock,
      fuelPct: expectedTotal > 0 ? Math.round((stillPending / expectedTotal) * 100) : 0,
      note: stillPending > 0 ? 'Delayed · no action required from worker' : 'No current delays',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(card => <SafeWalletCard key={card.label} card={card} />)}
    </div>
  );
}

// ── PAYMENT POLICY NOTE ───────────────────────────────────────────────────────

function PaymentPolicyNote() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <Shield className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
        <p className="flex-1 text-[11px] font-semibold text-white/50">Project Payment Requirements</p>
        <span className="text-[9px] font-mono text-white/20 mr-2">5 compliance gates</span>
        {collapsed ? <ChevronDown className="w-3.5 h-3.5 text-white/20" /> : <ChevronUp className="w-3.5 h-3.5 text-white/20" />}
      </button>
      {!collapsed && (
        <div className="px-4 pb-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 border-t border-white/[0.04] pt-3">
          {[
            { icon: FileText,   label: 'Contract signed',         desc: 'A fully executed agreement must be on file before any payment is initiated.' },
            { icon: Receipt,    label: 'W-9 / EIN submitted',     desc: 'Valid tax documentation required for all domestic and international workers.' },
            { icon: FileText,   label: 'Invoice submitted',       desc: 'Worker must submit a formal invoice matching the agreed project fee.' },
            { icon: CreditCard, label: 'ACH banking connected',   desc: 'Direct deposit information must be verified and on file.' },
            { icon: CheckCircle, label: 'Deliverables approved',  desc: 'Assigned manager must formally approve all project deliverables.' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start gap-2">
              <Icon className="w-3 h-3 text-[#06B6D4]/40 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-white/40">{label}</p>
                <p className="text-[9px] text-white/20 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────

interface WorkerPaymentSystemProps {
  system: WorkerSystem;
  accentColor?: string;
}

export default function WorkerPaymentSystem({
  system, accentColor = '#10B981',
}: WorkerPaymentSystemProps) {
  const [workers, setWorkers] = useState<WorkerWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WorkerWithRelations | null>(null);
  const [filter, setFilter] = useState<'all' | 'blocked' | 'held' | 'pending' | 'delayed' | 'approved' | 'paid'>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchWorkers(system);
    setWorkers(data);
    setLoading(false);
  }, [system]);

  useEffect(() => { load(); }, [load]);

  const handleRefresh = useCallback(async () => {
    const data = await fetchWorkers(system);
    setWorkers(data);
    if (selected) {
      const updated = data.find(w => w.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [system, selected]);

  const filtered = workers.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'blocked') return getMissingComplianceItems(w, w.payment_safe).length > 0;
    return w.payment_safe?.status === filter;
  });

  const FILTERS: { id: typeof filter; label: string; warningCount?: number }[] = [
    { id: 'all',      label: 'All Workers' },
    { id: 'blocked',  label: 'Compliance Blocked', warningCount: workers.filter(w => getMissingComplianceItems(w, w.payment_safe).length > 0).length },
    { id: 'held',     label: 'Pending Approval' },
    { id: 'pending',  label: 'ACH Initiated' },
    { id: 'delayed',  label: 'Delayed' },
    { id: 'approved', label: 'Ready to Withdraw' },
    { id: 'paid',     label: 'Paid' },
  ];

  return (
    <div className="min-h-full space-y-4 px-5 pb-8">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-5 h-5 text-white/20 animate-spin" />
        </div>
      ) : (
        <>
          {/* Wallet Cards */}
          <ProjectSafeSummary workers={workers} />

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white transition-all"
              style={{ background: '#10B981', boxShadow: '0 2px 16px rgba(16,185,129,0.22)' }}>
              <Send className="w-3.5 h-3.5" /> Request Payment
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/[0.1] text-[12px] text-white/50 hover:text-white/70 hover:border-white/[0.16] transition-all">
              <ArrowDownToLine className="w-3.5 h-3.5" /> Transfer to Bank
            </button>
            <button
              onClick={handleRefresh}
              className="ml-auto flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/[0.07] text-[10.5px] text-white/25 hover:text-white/50 transition-colors">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {/* Progress Ticker */}
          <ProjectProgressTicker workers={workers} />

          {/* Worker Table */}
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/[0.05] overflow-x-auto">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="px-3 py-1.5 rounded-lg text-[10.5px] font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
                  style={filter === f.id ? {
                    background: `${accentColor}18`,
                    color: accentColor,
                    border: `1px solid ${accentColor}28`,
                  } : {
                    color: 'rgba(255,255,255,0.25)',
                    border: '1px solid transparent',
                  }}
                >
                  {f.label}
                  {f.warningCount !== undefined && f.warningCount > 0 && (
                    <span className="text-[8px] font-bold bg-[#EF4444] text-white px-1 py-0.5 rounded-full leading-none">
                      {f.warningCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <User className="w-8 h-8 text-white/10" />
                <p className="text-[11.5px] text-white/25">No workers match this filter</p>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-5 px-5 py-2 border-b border-white/[0.03]">
                  {['Worker', '', 'Compliance', '', 'Payment'].map((h, i) => (
                    <p key={i} className={`text-[8.5px] font-mono text-white/15 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</p>
                  ))}
                </div>
                {filtered.map(w => (
                  <WorkerRow key={w.id} worker={w} onSelect={() => setSelected(w)} />
                ))}
              </div>
            )}
          </div>

          {/* Payment Policy */}
          <PaymentPolicyNote />
        </>
      )}

      {selected && (
        <WorkerDetailDrawer
          worker={selected}
          onClose={() => setSelected(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}
