import { CheckCircle2, Send, Clock, RefreshCw, ShieldCheck, FileText, Banknote, ClipboardList, XCircle, AlertTriangle, Zap } from 'lucide-react';
import type { WorkerWithRelations, PaymentDelayLog } from '../../../data/workerPaymentService';
import { AdminCard, Pill } from '../../shared';
import {
  currentStage, blockersFor, STAGE_LABEL, STAGE_COLOR, CATEGORY_LABEL, RELEASE_TYPE_LABEL, contractedFee, computeRemaining,
} from './safeHelpers';

export default function WorkerDetailPanel({
  worker, delayLog,
  onApprove, onMarkProcessing, onMarkReady, onDelay, onClearDelay, onInitiate, onClose,
}: {
  worker: WorkerWithRelations;
  delayLog: PaymentDelayLog[];
  onApprove:        () => void;
  onMarkProcessing: () => void;
  onMarkReady:      () => void;
  onDelay:          () => void;
  onClearDelay:     () => void;
  onInitiate:       () => void;
  onClose:          () => void;
}) {
  const safe = worker.payment_safe;
  const stage = currentStage(worker);
  const blockers = blockersFor(worker);
  const contracted = contractedFee(worker);
  const remaining = computeRemaining(safe, contracted);
  const paidOut = contracted - remaining;
  const isDelayed = stage === 'delayed';

  const compliance = [
    { key: 'Contract',     ok: worker.agreement_status === 'signed',  icon: FileText      },
    { key: 'W9 / EIN',     ok: worker.w9_status !== 'missing',         icon: ClipboardList },
    { key: 'Invoice',      ok: worker.invoice_status !== 'missing',    icon: FileText      },
    { key: 'ACH',          ok: worker.ach_status === 'connected',      icon: Banknote      },
    { key: 'Deliverables', ok: !!safe?.compliance_deliverables_approved, icon: CheckCircle2 },
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Identity strip */}
      <div
        className="relative p-5 border-b border-white/[0.06]"
        style={{ background: `radial-gradient(circle at 0% 0%, ${STAGE_COLOR[stage]}14, transparent 60%)` }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${STAGE_COLOR[stage]}, transparent)` }} />
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Project Safe</span>
              <span className="text-[9px] font-mono text-white/20">·</span>
              <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: STAGE_COLOR[stage] }}>{STAGE_LABEL[stage]}</span>
            </div>
            <h3 className="text-[18px] font-bold text-white tracking-tight leading-tight">{worker.name}</h3>
            <div className="text-[11.5px] text-white/45 mt-0.5">{worker.role} · {worker.project || 'No project'}</div>
          </div>
          <button onClick={onClose} className="text-[10px] font-mono text-white/35 hover:text-white/80 tracking-wider">
            CLOSE
          </button>
        </div>

        {/* Fee math */}
        <div className="grid grid-cols-3 gap-2">
          <FeeTile label="Contracted"  value={contracted} color="#8B8F9B" />
          <FeeTile label="Paid Out"    value={paidOut}    color="#10B981" />
          <FeeTile label="Remaining"   value={remaining}  color="#06B6D4" />
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Action bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          <ActionBtn icon={Send}         label="Initiate Payment"  color="#10B981" onClick={onInitiate} />
          <ActionBtn icon={CheckCircle2} label="Approve"           color="#10B981" onClick={onApprove} />
          <ActionBtn icon={Zap}          label="Mark Processing"   color="#06B6D4" onClick={onMarkProcessing} />
          <ActionBtn icon={ShieldCheck}  label="Ready to Withdraw" color="#10B981" onClick={onMarkReady} />
          {isDelayed
            ? <ActionBtn icon={RefreshCw} label="Clear Delay" color="#F59E0B" onClick={onClearDelay} />
            : <ActionBtn icon={Clock}     label="Delay Payment" color="#EF4444" onClick={onDelay} />
          }
        </div>

        {/* Delay reason panel */}
        {isDelayed && safe?.delay_title && (
          <div
            className="rounded-lg p-4 border border-[#EF4444]/25 bg-gradient-to-br from-[#EF4444]/10 to-transparent"
            style={{ boxShadow: 'inset 0 0 0 1px #EF444410' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#EF4444]">Active Delay Reason</span>
              {safe.delay_category && (
                <Pill color="#EF4444" label={CATEGORY_LABEL[safe.delay_category as keyof typeof CATEGORY_LABEL] ?? safe.delay_category} />
              )}
            </div>
            <div className="text-[13px] text-white font-semibold mb-1">{safe.delay_title}</div>
            {safe.delay_description && <div className="text-[12px] text-white/65 leading-relaxed">{safe.delay_description}</div>}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <span className="text-[9px] font-mono uppercase tracking-widest text-white/30">Worker action</span>
              <Pill color={safe.delay_requires_worker_action ? '#F59E0B' : '#10B981'} label={safe.delay_requires_worker_action ? 'REQUIRED' : 'NOT REQUIRED'} />
              <span className="ml-auto text-[9px] font-mono text-white/25">Visible on Project OS</span>
            </div>
          </div>
        )}

        {/* Compliance readiness */}
        <AdminCard title="Compliance Readiness" sub="Cleared items must all be green to release" accent="#06B6D4">
          <div className="space-y-1.5">
            {compliance.map(c => (
              <div key={c.key} className="flex items-center gap-3 px-2.5 py-2 rounded border border-white/[0.04] bg-white/[0.015]">
                <div className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ background: c.ok ? '#10B98112' : '#EF444412', border: `1px solid ${c.ok ? '#10B98128' : '#EF444428'}` }}>
                  <c.icon className="w-3 h-3" style={{ color: c.ok ? '#10B981' : '#EF4444' }} />
                </div>
                <span className="text-[12px] text-white/80 flex-1">{c.key}</span>
                {c.ok
                  ? <Pill color="#10B981" label="CLEARED" />
                  : <Pill color="#EF4444" label="MISSING" glow />}
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Blockers */}
        {blockers.length > 0 && (
          <AdminCard title="Active Blockers" sub={`${blockers.length} blocking release`} accent="#EF4444">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {blockers.map(b => (
                <div key={b.label} className="flex items-center gap-2 px-2.5 py-1.5 rounded border text-[11px]"
                  style={{ color: b.severity === 'critical' ? '#EF4444' : '#F59E0B', background: `${b.severity === 'critical' ? '#EF4444' : '#F59E0B'}10`, borderColor: `${b.severity === 'critical' ? '#EF4444' : '#F59E0B'}28` }}>
                  <XCircle className="w-3 h-3" />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </AdminCard>
        )}

        {/* Worker status breakdown */}
        <AdminCard title="Status Detail" sub="Current stage + operational flags" accent="#F59E0B">
          <div className="grid grid-cols-2 gap-2">
            <StatusCell label="Current Stage"   value={STAGE_LABEL[stage]}                           color={STAGE_COLOR[stage]} />
            <StatusCell label="Invoice Status"  value={(worker.invoice_status ?? '').toUpperCase()}  color={worker.invoice_status === 'approved' ? '#10B981' : worker.invoice_status === 'missing' ? '#EF4444' : '#F59E0B'} />
            <StatusCell label="ACH Status"      value={(worker.ach_status ?? '').toUpperCase()}      color={worker.ach_status === 'connected' ? '#10B981' : worker.ach_status === 'missing' ? '#EF4444' : '#06B6D4'} />
            <StatusCell label="Agreement"       value={(worker.agreement_status ?? '').toUpperCase()} color={worker.agreement_status === 'signed' ? '#10B981' : '#EF4444'} />
            <StatusCell label="Release Type"    value={RELEASE_TYPE_LABEL[safe?.release_type ?? 'partial']} color="#06B6D4" />
            <StatusCell label="Fee Type"        value={(worker.fee_type ?? '').toUpperCase()}        color="#8B8F9B" />
          </div>
        </AdminCard>

        {/* Deliverables */}
        {(worker.assignments ?? []).length > 0 && (
          <AdminCard title="Deliverables" sub="Tied to this safe" accent="#EC4899">
            <div className="space-y-1.5">
              {worker.assignments.map(a => (
                <div key={a.id} className="flex items-center gap-3 px-2.5 py-2 rounded border border-white/[0.04] bg-white/[0.015]">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: a.status === 'approved' ? '#10B981' : a.status === 'in_progress' ? '#06B6D4' : '#F59E0B' }} />
                  <span className="text-[12px] text-white/80 flex-1 truncate">{a.deliverable_title}</span>
                  <Pill color={a.status === 'approved' ? '#10B981' : a.status === 'in_progress' ? '#06B6D4' : '#F59E0B'} label={a.status.replace('_', ' ').toUpperCase()} />
                </div>
              ))}
            </div>
          </AdminCard>
        )}

        {/* Delay history */}
        {delayLog.length > 0 && (
          <AdminCard title="Delay History" sub={`${delayLog.length} recorded event${delayLog.length === 1 ? '' : 's'}`} accent="#EF4444">
            <div className="relative pl-4">
              <div className="absolute top-1 bottom-1 left-[5px] w-px bg-white/[0.08]" />
              <div className="space-y-3">
                {delayLog.map(log => (
                  <div key={log.id} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-[#EF4444]/70 ring-2 ring-[#0B0C0F]" />
                    <div className="text-[11.5px] text-white/80">{log.reason}</div>
                    <div className="text-[9px] font-mono text-white/30 mt-0.5">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
}

function FeeTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0E0F12] p-2.5" style={{ boxShadow: `inset 0 0 0 1px ${color}06` }}>
      <div className="text-[8.5px] font-mono uppercase tracking-widest text-white/30 mb-1">{label}</div>
      <div className="text-[15px] font-bold text-white font-mono leading-none">
        ${Math.round(value).toLocaleString()}
      </div>
    </div>
  );
}

function StatusCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.015] px-2.5 py-2">
      <div className="text-[8.5px] font-mono uppercase tracking-widest text-white/30 mb-0.5">{label}</div>
      <div className="text-[11.5px] font-medium" style={{ color }}>{value || '—'}</div>
    </div>
  );
}

function ActionBtn({ icon: Icon, label, color, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded border text-[10px] font-mono tracking-wider uppercase transition-all hover:brightness-125"
      style={{ color, background: `${color}10`, borderColor: `${color}30` }}
    >
      <Icon className="w-3 h-3" />
      <span className="truncate">{label}</span>
    </button>
  );
}
