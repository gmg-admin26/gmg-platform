import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShieldCheck, DollarSign, Clock, Send, AlertTriangle, Radio, X, Search,
  CheckCircle2, Banknote, FileText,
} from 'lucide-react';
import { AdminPage, AdminCard, Pill, StatTile, ADMIN_COLORS } from '../shared';
import {
  fetchWorkers, fetchDelayLog, updatePaymentSafeStatus, logPaymentDelay,
  WorkerWithRelations, WorkerSystem, PaymentDelayLog,
} from '../../data/workerPaymentService';
import { supabase } from '../../../lib/supabase';
import {
  TAB_KEYS, TAB_LABELS, ROUTE_TO_TAB, TabKey,
  STAGE_LABEL, STAGE_COLOR, CATEGORY_LABEL,
  currentStage, matchesTab, blockersFor, contractedFee,
} from './projectSafe/safeHelpers';
import DelayPaymentModal, { DelayPayload } from './projectSafe/DelayPaymentModal';
import InitiatePaymentModal, { InitiatePayload } from './projectSafe/InitiatePaymentModal';
import WorkerDetailPanel from './projectSafe/WorkerDetailPanel';

const SYSTEMS: WorkerSystem[] = ['artist_os', 'catalog_os', 'industry_os', 'rocksteady'];

export default function ProjectSafeAdmin() {
  const loc = useLocation();
  const routeSegment = loc.pathname.split('/').pop() ?? 'safes';
  const initialTab: TabKey = ROUTE_TO_TAB[routeSegment] ?? 'all';

  const [tab, setTab] = useState<TabKey>(initialTab);
  const [workers, setWorkers] = useState<WorkerWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [delayLog, setDelayLog] = useState<PaymentDelayLog[]>([]);
  const [delayModal, setDelayModal] = useState<WorkerWithRelations | null>(null);
  const [initiateModal, setInitiateModal] = useState<WorkerWithRelations | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => { setTab(initialTab); }, [initialTab]);

  async function loadWorkers() {
    setLoading(true);
    const results = await Promise.all(SYSTEMS.map(s => fetchWorkers(s)));
    setWorkers(results.flat());
    setLoading(false);
  }

  useEffect(() => { loadWorkers(); }, []);

  useEffect(() => {
    if (!selectedId) { setDelayLog([]); return; }
    const w = workers.find(x => x.id === selectedId);
    if (!w?.payment_safe) { setDelayLog([]); return; }
    fetchDelayLog(w.payment_safe.id).then(setDelayLog);
  }, [selectedId, workers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return workers.filter(w => {
      if (!matchesTab(w, tab)) return false;
      if (!q) return true;
      return [w.name, w.role, w.project, w.email].filter(Boolean).some(v => v!.toLowerCase().includes(q));
    });
  }, [workers, tab, search]);

  const stats = useMemo(() => {
    const safes = workers.map(w => w.payment_safe).filter(Boolean);
    return {
      pending:    workers.filter(w => matchesTab(w, 'pending')).length,
      processing: workers.filter(w => matchesTab(w, 'processing')).length,
      delayed:    workers.filter(w => matchesTab(w, 'delayed')).length,
      ready:      workers.filter(w => matchesTab(w, 'ready')).length,
      totalEscrow: safes.reduce((a, s) => a + Number(s!.amount ?? 0), 0),
    };
  }, [workers]);

  const signals = useMemo(() => {
    const achBlocked = workers.filter(w => w.ach_status === 'missing').length;
    const contractBlocked = workers.filter(w => w.agreement_status !== 'signed').length;
    const upstream = workers.filter(w => w.payment_safe?.delay_category === 'upstream_cash_timing').length;
    const invoicesReady = workers.filter(w => w.invoice_status === 'submitted' && w.payment_safe?.status === 'held').length;
    const s: { label: string; color: string; icon: typeof AlertTriangle }[] = [];
    if (achBlocked > 0)       s.push({ label: `${achBlocked} worker${achBlocked > 1 ? 's' : ''} blocked by missing ACH setup`, color: '#EF4444', icon: Banknote });
    if (contractBlocked > 0)  s.push({ label: `${contractBlocked} contract${contractBlocked > 1 ? 's' : ''} still need signatures`, color: '#F59E0B', icon: FileText });
    if (upstream > 0)         s.push({ label: `${upstream} payment${upstream > 1 ? 's' : ''} delayed for upstream settlement`, color: '#F59E0B', icon: Clock });
    if (invoicesReady > 0)    s.push({ label: `${invoicesReady} invoice${invoicesReady > 1 ? 's' : ''} ready for approval`, color: '#10B981', icon: CheckCircle2 });
    return s;
  }, [workers]);

  const selected = workers.find(w => w.id === selectedId) ?? null;

  function flashBanner(msg: string) { setBanner(msg); setTimeout(() => setBanner(null), 2800); }

  async function patchSafeLocal(workerId: string, patch: Partial<NonNullable<WorkerWithRelations['payment_safe']>>) {
    setWorkers(ws => ws.map(w => w.id === workerId && w.payment_safe
      ? { ...w, payment_safe: { ...w.payment_safe, ...patch } }
      : w));
  }

  async function handleApprove(w: WorkerWithRelations) {
    if (!w.payment_safe) return;
    await updatePaymentSafeStatus(w.payment_safe.id, 'pending', { stage: 'processing' });
    patchSafeLocal(w.id, { status: 'pending', stage: 'processing' });
    flashBanner(`Approved — ${w.name} moved to Processing`);
  }
  async function handleMarkProcessing(w: WorkerWithRelations) {
    if (!w.payment_safe) return;
    await updatePaymentSafeStatus(w.payment_safe.id, 'pending', { stage: 'processing' });
    patchSafeLocal(w.id, { status: 'pending', stage: 'processing' });
    flashBanner(`${w.name} marked Processing`);
  }
  async function handleMarkReady(w: WorkerWithRelations) {
    if (!w.payment_safe) return;
    await updatePaymentSafeStatus(w.payment_safe.id, 'approved', { stage: 'get_paid' });
    patchSafeLocal(w.id, { status: 'approved', stage: 'get_paid' });
    flashBanner(`${w.name} ready to withdraw`);
  }
  async function handleClearDelay(w: WorkerWithRelations) {
    if (!w.payment_safe) return;
    await updatePaymentSafeStatus(w.payment_safe.id, 'held', {
      stage: 'under_review',
      delay_title: '', delay_category: '', delay_description: '', delay_requires_worker_action: false, delay_reason: '',
    });
    patchSafeLocal(w.id, {
      status: 'held', stage: 'under_review',
      delay_title: '', delay_category: '', delay_description: '', delay_requires_worker_action: false, delay_reason: '',
    });
    flashBanner(`Delay cleared — ${w.name} back to Pending`);
  }
  async function handleDelaySubmit(w: WorkerWithRelations, p: DelayPayload) {
    if (!w.payment_safe) return;
    await updatePaymentSafeStatus(w.payment_safe.id, 'delayed', {
      stage: 'delayed',
      delay_title: p.title, delay_category: p.category, delay_description: p.description,
      delay_requires_worker_action: p.requires_worker_action, delay_reason: p.title,
    });
    await logPaymentDelay(w.payment_safe.id, w.id, `${p.title} — ${CATEGORY_LABEL[p.category]}`);
    patchSafeLocal(w.id, {
      status: 'delayed', stage: 'delayed',
      delay_title: p.title, delay_category: p.category, delay_description: p.description,
      delay_requires_worker_action: p.requires_worker_action, delay_reason: p.title,
    });
    setDelayModal(null);
    flashBanner(`Delayed — ${w.name} (${CATEGORY_LABEL[p.category]})`);
    if (selectedId === w.id && w.payment_safe) {
      fetchDelayLog(w.payment_safe.id).then(setDelayLog);
    }
  }
  async function handleInitiateSubmit(p: InitiatePayload) {
    const worker = workers.find(x => x.id === p.worker_id);
    if (!worker) return;
    if (worker.payment_safe) {
      await supabase.from('payment_safes').update({
        amount: p.amount, release_type: p.release_type, notes: p.notes,
        stage: 'under_review', status: 'held', updated_at: new Date().toISOString(),
      }).eq('id', worker.payment_safe.id);
      patchSafeLocal(worker.id, {
        amount: p.amount, release_type: p.release_type, notes: p.notes,
        stage: 'under_review', status: 'held',
      });
    } else {
      const { data } = await supabase.from('payment_safes').insert({
        worker_id: worker.id, amount: p.amount, currency: 'USD', status: 'held',
        release_type: p.release_type, notes: p.notes, stage: 'under_review',
        compliance_contract_signed: worker.agreement_status === 'signed',
        compliance_w9_submitted: worker.w9_status !== 'missing',
        compliance_invoice_submitted: worker.invoice_status !== 'missing',
        compliance_ach_connected: worker.ach_status === 'connected',
        compliance_deliverables_approved: false,
      }).select().maybeSingle();
      if (data) {
        setWorkers(ws => ws.map(w => w.id === worker.id ? { ...w, payment_safe: data, all_safes: [...(w.all_safes ?? []), data] } : w));
      }
    }
    setInitiateModal(null);
    setSelectedId(worker.id);
    flashBanner(`Initiated release for ${worker.name} — $${p.amount.toLocaleString()}`);
  }

  return (
    <AdminPage
      eyebrow="Project Operations"
      title="Project Safe Admin"
      subtitle="Authorize releases, resolve blockers, and control worker payment flow across GMG projects."
      accent={ADMIN_COLORS.amber}
      actions={
        <>
          <Pill color={ADMIN_COLORS.amber} label="ADMIN CONTROL" glow />
          <button
            onClick={() => setInitiateModal(workers[0] ?? null)}
            className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase px-3 py-1.5 rounded border"
            style={{ color: '#10B981', background: '#10B98110', borderColor: '#10B98130' }}
          >
            <Send className="w-3 h-3" />
            Initiate Payment
          </button>
        </>
      }
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Pending Approval"  value={stats.pending}    color="#F59E0B" icon={ShieldCheck} sub="Held in safe · awaiting approval" />
        <StatTile label="Processing"        value={stats.processing} color="#06B6D4" icon={Clock}       sub="ACH initiated · in flight" />
        <StatTile label="Delayed"           value={stats.delayed}    color="#EF4444" icon={AlertTriangle} sub="Blocked with structured reason" />
        <StatTile label="Ready to Release"  value={stats.ready}      color="#10B981" icon={Send}        sub={`$${(stats.totalEscrow / 1000).toFixed(1)}K total escrow`} />
      </div>

      {/* Signal strip */}
      <AdminCard title="Payment Signals" sub="Live alerts across all project safes" accent="#06B6D4" right={<Pill color="#06B6D4" label={`${signals.length} SIGNALS`} glow />}>
        {signals.length === 0 ? (
          <div className="py-4 text-center text-[11px] text-white/25 font-mono">All queues clear — nothing needs attention.</div>
        ) : (
          <div className="space-y-1.5">
            {signals.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded border border-white/[0.05] bg-white/[0.015]">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `${s.color}12`, border: `1px solid ${s.color}26` }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                <div className="flex-1 text-[12.5px] text-white/85">{s.label}</div>
                <Radio className="w-3 h-3" style={{ color: s.color, animation: 'pulse 2s infinite' }} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      {/* Flash banner */}
      {banner && (
        <div className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/8 px-4 py-2.5 text-[12px] text-[#10B981] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {banner}
        </div>
      )}

      {/* Tabs + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {TAB_KEYS.map(k => {
            const count = k === 'all' ? workers.length : workers.filter(w => matchesTab(w, k)).length;
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1.5 rounded border transition-all ${
                  active ? 'text-white bg-[#F59E0B]/12 border-[#F59E0B]/40' : 'text-white/45 bg-white/[0.015] border-white/[0.06] hover:text-white/80 hover:border-white/[0.12]'
                }`}
              >
                {TAB_LABELS[k]}
                <span className="text-[9px] font-mono px-1 rounded" style={{ color: active ? '#F59E0B' : 'rgba(255,255,255,0.35)', background: active ? '#F59E0B14' : 'rgba(255,255,255,0.03)' }}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-white/25 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search worker, role, project"
            className="bg-[#0E0F12] border border-white/[0.07] rounded-md pl-8 pr-2.5 py-1.5 text-[11.5px] text-white/85 placeholder:text-white/25 focus:outline-none focus:border-[#F59E0B]/40 w-64"
          />
        </div>
      </div>

      {/* Main split */}
      <div className={`grid gap-4 ${selected ? 'grid-cols-1 xl:grid-cols-[1fr_460px]' : 'grid-cols-1'}`}>
        <AdminCard title="Worker Payment Queue" sub={`${filtered.length} result${filtered.length === 1 ? '' : 's'}`} accent="#F59E0B">
          {loading ? (
            <div className="py-10 text-center text-[11px] text-white/25 font-mono">Loading queue…</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-[11px] text-white/25 font-mono">No records in this filter.</div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map(w => <QueueRow key={w.id} worker={w} selected={selectedId === w.id} onClick={() => setSelectedId(w.id)} />)}
            </div>
          )}
        </AdminCard>

        {selected && (
          <div className="rounded-xl border border-white/[0.07] bg-[#0B0C0F] overflow-hidden max-h-[calc(100vh-120px)] sticky top-4">
            <WorkerDetailPanel
              worker={selected}
              delayLog={delayLog}
              onApprove={() => handleApprove(selected)}
              onMarkProcessing={() => handleMarkProcessing(selected)}
              onMarkReady={() => handleMarkReady(selected)}
              onDelay={() => setDelayModal(selected)}
              onClearDelay={() => handleClearDelay(selected)}
              onInitiate={() => setInitiateModal(selected)}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>

      {delayModal && (
        <DelayPaymentModal
          workerName={delayModal.name}
          onClose={() => setDelayModal(null)}
          onSubmit={(p) => handleDelaySubmit(delayModal, p)}
        />
      )}
      {initiateModal && (
        <InitiatePaymentModal
          workers={workers}
          defaultWorkerId={initiateModal.id}
          onClose={() => setInitiateModal(null)}
          onSubmit={handleInitiateSubmit}
        />
      )}
    </AdminPage>
  );
}

function QueueRow({ worker, selected, onClick }: { worker: WorkerWithRelations; selected: boolean; onClick: () => void }) {
  const stage = currentStage(worker);
  const blockers = blockersFor(worker);
  const amount = Number(worker.payment_safe?.amount ?? 0);
  const contracted = contractedFee(worker);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border transition-all overflow-hidden relative ${
        selected ? 'border-[#F59E0B]/50 bg-[#F59E0B]/[0.04]' : 'border-white/[0.05] bg-white/[0.015] hover:border-white/[0.12] hover:bg-white/[0.025]'
      }`}
      style={selected ? { boxShadow: `0 0 0 1px #F59E0B20, inset 0 0 40px #F59E0B08` } : undefined}
    >
      <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ background: STAGE_COLOR[stage] }} />
      <div className="flex items-center gap-4 px-4 py-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[13px] text-white font-medium truncate">{worker.name}</span>
            <Pill color={STAGE_COLOR[stage]} label={STAGE_LABEL[stage]} glow={stage === 'delayed' || stage === 'get_paid'} />
            {worker.payment_safe?.delay_category && (
              <Pill color="#EF4444" label={CATEGORY_LABEL[worker.payment_safe.delay_category as keyof typeof CATEGORY_LABEL] ?? ''} />
            )}
          </div>
          <div className="text-[11px] text-white/45 truncate">
            {worker.role} · {worker.project || 'No project'} · {worker.system.replace('_', ' ').toUpperCase()}
          </div>
          {blockers.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {blockers.slice(0, 4).map(b => (
                <span key={b.label} className="text-[8.5px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded"
                  style={{ color: b.severity === 'critical' ? '#EF4444' : '#F59E0B', background: `${b.severity === 'critical' ? '#EF4444' : '#F59E0B'}10`, border: `1px solid ${b.severity === 'critical' ? '#EF4444' : '#F59E0B'}26` }}>
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <div className="text-[13px] font-mono text-white/90 leading-none">${amount.toLocaleString()}</div>
          <div className="text-[9px] text-white/30 font-mono mt-1">of ${contracted.toLocaleString()} fee</div>
        </div>
      </div>
    </button>
  );
}
