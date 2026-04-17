import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FileCheck2,
  FileText,
  Landmark,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import {
  fetchWorkers,
  logPaymentDelay,
  updateAssignmentStatus,
  updatePaymentSafeStatus,
  type PaymentSafe,
  type PaymentStatus,
  type WorkerSystem,
  type WorkerWithRelations,
} from '../../dashboard/data/workerPaymentService';

const ACCENT = '#10B981';
const AMBER = '#F59E0B';
const CYAN = '#06B6D4';
const PINK = '#EC4899';
const RED = '#EF4444';

const STATUS_COLOR: Record<PaymentStatus, string> = {
  held: '#6B7280',
  pending: AMBER,
  approved: CYAN,
  delayed: RED,
  paid: ACCENT,
  cancelled: '#6B7280',
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  held: 'Setup',
  pending: 'Pending Approval',
  approved: 'Approved',
  delayed: 'Delayed',
  paid: 'Paid',
  cancelled: 'Cancelled',
};

function fmt(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v.toFixed(0)}`;
}

function computeReadiness(w: WorkerWithRelations): { done: number; total: number; items: { key: string; label: string; ok: boolean }[] } {
  const items = [
    { key: 'agreement', label: 'Contract Signed', ok: w.agreement_status === 'signed' },
    { key: 'w9', label: 'W-9 / EIN Submitted', ok: w.w9_status !== 'missing' },
    { key: 'ach', label: 'Banking Connected', ok: w.ach_status === 'connected' },
    { key: 'deliverables', label: 'Deliverables Assigned', ok: (w.assignments?.length ?? 0) > 0 },
    { key: 'invoice', label: 'Invoice Submitted', ok: w.invoice_status !== 'missing' },
  ];
  return { done: items.filter(i => i.ok).length, total: items.length, items };
}

interface Props {
  system?: WorkerSystem;
  adminName?: string;
}

export default function IndustryProjectOSAdmin({ system = 'industry_os', adminName = 'Admin' }: Props) {
  const [workers, setWorkers] = useState<WorkerWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [delayTarget, setDelayTarget] = useState<WorkerWithRelations | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const ws = await fetchWorkers(system);
    setWorkers(ws);
    setLoading(false);
  }, [system]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return workers.filter(w => {
      if (query && !(`${w.name} ${w.role} ${w.project} ${w.email ?? ''}`.toLowerCase().includes(query.toLowerCase()))) return false;
      if (statusFilter !== 'all') {
        const s = w.payment_safe?.status ?? 'held';
        if (s !== statusFilter) return false;
      }
      return true;
    });
  }, [workers, query, statusFilter]);

  const aggregates = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let paid = 0;
    let delayed = 0;
    let expected = 0;
    workers.forEach(w => {
      const safe = w.payment_safe;
      if (!safe) return;
      expected += safe.amount ?? 0;
      if (safe.status === 'pending') pending += safe.amount ?? 0;
      if (safe.status === 'approved') approved += safe.amount ?? 0;
      if (safe.status === 'paid') paid += safe.amount ?? 0;
      if (safe.status === 'delayed') delayed += safe.amount ?? 0;
    });
    return { pending, approved, paid, delayed, expected, count: workers.length };
  }, [workers]);

  async function changeStatus(worker: WorkerWithRelations, next: PaymentStatus) {
    const safe = worker.payment_safe;
    if (!safe) return;
    setBusyId(worker.id);
    const extra: Partial<PaymentSafe> = {};
    if (next === 'approved') {
      extra.approved_by = adminName;
      extra.approved_at = new Date().toISOString();
    }
    if (next === 'paid') {
      extra.paid_at = new Date().toISOString();
      extra.payment_method = 'ACH';
    }
    if (next !== 'delayed') {
      extra.delay_reason = '';
    }
    await updatePaymentSafeStatus(safe.id, next, extra);
    await load();
    setBusyId(null);
  }

  async function approveProjectStart(worker: WorkerWithRelations) {
    setBusyId(worker.id);
    const safe = worker.payment_safe;
    if (safe) {
      await updatePaymentSafeStatus(safe.id, 'pending', {
        compliance_contract_signed: true,
        compliance_w9_submitted: worker.w9_status !== 'missing',
        compliance_ach_connected: worker.ach_status === 'connected',
      });
    }
    const open = (worker.assignments ?? []).filter(a => a.status === 'open');
    await Promise.all(open.map(a => updateAssignmentStatus(a.id, 'in_progress')));
    await load();
    setBusyId(null);
  }

  async function submitDelay(reason: string) {
    if (!delayTarget) return;
    const safe = delayTarget.payment_safe;
    if (!safe) return;
    setBusyId(delayTarget.id);
    await updatePaymentSafeStatus(safe.id, 'delayed', { delay_reason: reason });
    await logPaymentDelay(safe.id, delayTarget.id, reason, adminName);
    setDelayTarget(null);
    await load();
    setBusyId(null);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
        <AggCard label="Workers" value={String(aggregates.count)} icon={Users} color="rgba(255,255,255,0.5)" />
        <AggCard label="Pending" value={fmt(aggregates.pending)} icon={Clock} color={AMBER} />
        <AggCard label="Approved" value={fmt(aggregates.approved)} icon={CheckCircle2} color={CYAN} />
        <AggCard label="Paid" value={fmt(aggregates.paid)} icon={Landmark} color={ACCENT} />
        <AggCard label="Delayed" value={fmt(aggregates.delayed)} icon={AlertTriangle} color={RED} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, role, project, email"
            className="w-full bg-white/[0.03] border border-white/[0.07] rounded-xl pl-9 pr-3 py-2 text-[12px] text-white/75 placeholder-white/20 focus:outline-none focus:border-white/20"
          />
        </div>
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1 overflow-x-auto">
          {(['all', 'held', 'pending', 'approved', 'delayed', 'paid'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wide transition-colors whitespace-nowrap ${
                statusFilter === s ? 'bg-white/[0.08] text-white/85' : 'text-white/35 hover:text-white/60'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[11px] text-white/50 hover:text-white/80 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-white/25 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/[0.08] rounded-2xl">
          <Users className="w-6 h-6 text-white/20 mx-auto mb-3" />
          <p className="text-[12px] text-white/40">No workers match the current filters.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(w => (
            <WorkerRow
              key={w.id}
              worker={w}
              expanded={expanded === w.id}
              busy={busyId === w.id}
              onToggle={() => setExpanded(expanded === w.id ? null : w.id)}
              onChangeStatus={next => changeStatus(w, next)}
              onApproveStart={() => approveProjectStart(w)}
              onDelay={() => setDelayTarget(w)}
            />
          ))}
        </div>
      )}

      {delayTarget && (
        <DelayModal
          worker={delayTarget}
          onClose={() => setDelayTarget(null)}
          onSubmit={submitDelay}
        />
      )}
    </div>
  );
}

function AggCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white/[0.022] border border-white/[0.06] rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="text-[9px] font-mono uppercase tracking-wide text-white/30">{label}</span>
      </div>
      <div className="text-[17px] font-semibold text-white/88">{value}</div>
    </div>
  );
}

function WorkerRow({
  worker,
  expanded,
  busy,
  onToggle,
  onChangeStatus,
  onApproveStart,
  onDelay,
}: {
  worker: WorkerWithRelations;
  expanded: boolean;
  busy: boolean;
  onToggle: () => void;
  onChangeStatus: (next: PaymentStatus) => void;
  onApproveStart: () => void;
  onDelay: () => void;
}) {
  const safe = worker.payment_safe;
  const status: PaymentStatus = safe?.status ?? 'held';
  const color = STATUS_COLOR[status];
  const label = STATUS_LABEL[status];
  const readiness = computeReadiness(worker);
  const canStart = readiness.done >= 3 && status === 'held';

  return (
    <div
      className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden transition-colors"
      style={{ boxShadow: expanded ? `inset 0 0 0 1px ${color}22` : undefined }}
    >
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center gap-4 hover:bg-white/[0.015] transition-colors text-left"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <span className="text-[11px] font-semibold" style={{ color }}>
            {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
          <div>
            <div className="text-[13px] font-semibold text-white/85 truncate">{worker.name}</div>
            <div className="text-[10.5px] text-white/35 truncate">{worker.role}</div>
          </div>
          <div className="hidden md:block">
            <div className="text-[10.5px] text-white/55 truncate">{worker.project}</div>
            <div className="text-[9px] font-mono text-white/25 uppercase tracking-wide truncate">{worker.email}</div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {readiness.items.map(item => (
                  <div
                    key={item.key}
                    title={item.label}
                    className="w-1.5 h-3 rounded-sm"
                    style={{ background: item.ok ? ACCENT : 'rgba(255,255,255,0.08)' }}
                  />
                ))}
              </div>
              <span className="text-[9.5px] font-mono text-white/40">{readiness.done}/{readiness.total}</span>
            </div>
            <div className="text-[9px] font-mono text-white/22 uppercase tracking-wide mt-0.5">Setup Readiness</div>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="text-right">
              <div className="text-[13px] font-semibold" style={{ color }}>
                {safe ? fmt(safe.amount) : '—'}
              </div>
              <div className="flex items-center gap-1 justify-end">
                <span className="w-1 h-1 rounded-full" style={{ background: color }} />
                <span className="text-[9px] font-mono uppercase tracking-wide" style={{ color: `${color}cc` }}>{label}</span>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-white/25 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.05] px-4 py-4 space-y-4 bg-black/10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {readiness.items.map(item => (
              <div
                key={item.key}
                className="rounded-lg px-2.5 py-2 border"
                style={{
                  background: item.ok ? `${ACCENT}0c` : 'rgba(255,255,255,0.015)',
                  borderColor: item.ok ? `${ACCENT}24` : 'rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  {item.ok ? (
                    <CheckCircle2 className="w-3 h-3" style={{ color: ACCENT }} />
                  ) : (
                    <Clock className="w-3 h-3 text-white/30" />
                  )}
                  <span className="text-[10px] font-mono uppercase tracking-wide text-white/50">{item.label}</span>
                </div>
                <div className="text-[10px] text-white/35 mt-0.5">{item.ok ? 'Complete' : 'Outstanding'}</div>
              </div>
            ))}
          </div>

          {safe?.status === 'delayed' && safe.delay_reason && (
            <div
              className="rounded-xl p-3 flex items-start gap-2"
              style={{ background: `${RED}0c`, border: `1px solid ${RED}26` }}
            >
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wide mb-0.5" style={{ color: RED }}>
                  Delay Reason (visible to worker)
                </div>
                <p className="text-[12px] text-white/65 leading-relaxed">{safe.delay_reason}</p>
              </div>
            </div>
          )}

          <div>
            <div className="text-[9px] font-mono text-white/25 uppercase tracking-wide mb-2">Deliverables</div>
            {(worker.assignments?.length ?? 0) === 0 ? (
              <div className="text-[11px] text-white/35 italic">No deliverables assigned</div>
            ) : (
              <div className="space-y-1.5">
                {worker.assignments!.map(a => (
                  <div
                    key={a.id}
                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
                  >
                    <FileText className="w-3 h-3 text-white/30" />
                    <span className="text-[11.5px] text-white/70 flex-1 truncate">{a.deliverable_title}</span>
                    <span
                      className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{
                        background:
                          a.status === 'approved' ? `${ACCENT}15` :
                          a.status === 'submitted' ? `${CYAN}15` :
                          a.status === 'in_progress' ? `${AMBER}15` :
                          'rgba(255,255,255,0.04)',
                        color:
                          a.status === 'approved' ? ACCENT :
                          a.status === 'submitted' ? CYAN :
                          a.status === 'in_progress' ? AMBER :
                          'rgba(255,255,255,0.4)',
                      }}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {canStart && (
              <ActionBtn
                icon={Play}
                color={ACCENT}
                onClick={onApproveStart}
                busy={busy}
              >
                Approve Project Start
              </ActionBtn>
            )}
            {safe?.status === 'pending' && (
              <ActionBtn
                icon={ShieldCheck}
                color={CYAN}
                onClick={() => onChangeStatus('approved')}
                busy={busy}
              >
                Approve Payment
              </ActionBtn>
            )}
            {safe?.status === 'approved' && (
              <ActionBtn
                icon={DollarSign}
                color={PINK}
                onClick={() => onChangeStatus('paid')}
                busy={busy}
              >
                Mark as Paid
              </ActionBtn>
            )}
            {safe && safe.status !== 'paid' && safe.status !== 'delayed' && safe.status !== 'cancelled' && (
              <ActionBtn
                icon={Pause}
                color={AMBER}
                onClick={onDelay}
                busy={busy}
                variant="outline"
              >
                Delay Payment
              </ActionBtn>
            )}
            {safe?.status === 'delayed' && (
              <ActionBtn
                icon={ArrowRight}
                color={CYAN}
                onClick={() => onChangeStatus('pending')}
                busy={busy}
              >
                Resume Payment
              </ActionBtn>
            )}
            {safe?.status === 'held' && !canStart && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/40">
                <FileCheck2 className="w-3.5 h-3.5" />
                Awaiting worker setup completion
              </div>
            )}
            {safe?.status === 'paid' && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg" style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}26`, color: ACCENT }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">Payment Released</span>
              </div>
            )}
          </div>

          {safe && (
            <div className="flex items-center gap-4 pt-2 border-t border-white/[0.04] text-[10px] font-mono text-white/30 uppercase tracking-wide flex-wrap">
              <span>Expected: {fmt(safe.amount)}</span>
              {safe.expected_release_date && <span>Release: {new Date(safe.expected_release_date).toLocaleDateString()}</span>}
              {safe.approved_by && <span>Approved by {safe.approved_by}</span>}
              {safe.paid_at && <span>Paid {new Date(safe.paid_at).toLocaleDateString()}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  color,
  onClick,
  busy,
  variant = 'solid',
  children,
}: {
  icon: React.ElementType;
  color: string;
  onClick: () => void;
  busy: boolean;
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40"
      style={{
        background: variant === 'solid' ? `${color}18` : 'transparent',
        border: `1px solid ${color}${variant === 'solid' ? '3a' : '30'}`,
        color,
      }}
    >
      {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
      {children}
      <ChevronRight className="w-3 h-3 opacity-60" />
    </button>
  );
}

function DelayModal({ worker, onClose, onSubmit }: { worker: WorkerWithRelations; onClose: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState('');
  const valid = reason.trim().length >= 10;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0B0D10] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Pause className="w-3.5 h-3.5" style={{ color: AMBER }} />
            <span className="text-[11px] font-mono uppercase tracking-wide text-white/60">Delay Payment</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <div className="text-[11px] text-white/40 mb-1">Worker</div>
            <div className="text-[13px] font-semibold text-white/85">{worker.name}</div>
            <div className="text-[10.5px] text-white/35">{worker.project}</div>
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wide text-white/40">
              Reason (visible to worker)
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder="Explain why this payment is delayed. The worker will see this message on their dashboard."
              className="w-full mt-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2.5 text-[12px] text-white/80 placeholder-white/20 focus:outline-none focus:border-white/20 resize-none"
            />
            <div className="text-[10px] text-white/25 mt-1">{reason.trim().length}/10 minimum</div>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2.5 rounded-xl border border-white/[0.08] text-[11.5px] text-white/50 hover:text-white/80 transition-colors"
            >
              <Ban className="inline w-3.5 h-3.5 mr-1" />
              Cancel
            </button>
            <button
              onClick={() => valid && onSubmit(reason.trim())}
              disabled={!valid}
              className="flex-1 px-3 py-2.5 rounded-xl text-[11.5px] font-semibold transition-all disabled:opacity-40"
              style={{ background: `${AMBER}1a`, border: `1px solid ${AMBER}40`, color: AMBER }}
            >
              Confirm Delay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
