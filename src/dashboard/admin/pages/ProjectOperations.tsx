import { useEffect, useMemo, useState } from 'react';
import {
  Briefcase, UserCheck, Users, Brain, ShieldCheck, ListChecks, DollarSign,
  Clock, History, Gauge, CheckCircle2, AlertTriangle, Send, Zap, Flag,
  BarChart3, FileText, Activity,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AdminPage, AdminCard, Pill, StatTile, CommandRow, DensityTable, ADMIN_COLORS } from '../shared';
import AgentPanel from '../AgentPanel';
import {
  fetchWorkers, WorkerWithRelations, PaymentSafe, WorkerSystem, PaymentStatus,
  updatePaymentSafeStatus, updateAssignmentStatus,
} from '../../data/workerPaymentService';

const STATUS_COLOR: Record<string, string> = {
  held: '#F59E0B', pending: '#06B6D4', approved: '#10B981',
  delayed: '#EF4444', paid: '#10B981', cancelled: '#6B7280',
};
const STATUS_LABEL: Record<string, string> = {
  held: 'Pending Approval', pending: 'ACH Initiated', approved: 'Ready to Get Paid',
  delayed: 'Processing Delayed', paid: 'Paid', cancelled: 'Cancelled',
};

const SYSTEM_TABS: { key: WorkerSystem | 'all'; label: string }[] = [
  { key: 'all',          label: 'All Systems'  },
  { key: 'artist_os',    label: 'Artist OS'    },
  { key: 'catalog_os',   label: 'Catalog OS'   },
  { key: 'industry_os',  label: 'Industry OS'  },
  { key: 'rocksteady',   label: 'Rocksteady'   },
];

const AI_AGENTS_PER_PROJECT = [
  { project: 'GMG Platform Launch — Q2 2026', agents: ['SignalOps', 'Counsel', 'Beacon', 'Stage'] },
  { project: 'Catalog Reactivation — SPIN',   agents: ['Ledger', 'Vault', 'Crest']               },
  { project: 'Arctic Fox Merch Drop',         agents: ['Stage', 'Industry Marketing']            },
];

const HUMAN_OWNERS = [
  { person: 'Paula Moore',   role: 'Executive Lead',   projects: 4, blocked: 0 },
  { person: 'Randy Jackson', role: 'Executive Lead',   projects: 3, blocked: 1 },
  { person: 'Jacquelyn R.',  role: 'Operations',       projects: 5, blocked: 0 },
  { person: 'Counsel Team',  role: 'Legal',            projects: 6, blocked: 1 },
];

export default function ProjectOperations() {
  const params = useParams();
  const tab = (params.tab ?? 'dashboard') as string;
  return (
    <ProjectOperationsInner tab={tab} />
  );
}

function ProjectOperationsInner({ tab }: { tab: string }) {
  const navigate = useNavigate();
  const [system, setSystem] = useState<WorkerSystem | 'all'>('all');
  const [workers, setWorkers] = useState<WorkerWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const systems: WorkerSystem[] = system === 'all'
        ? ['artist_os', 'catalog_os', 'industry_os', 'rocksteady']
        : [system];
      const results = await Promise.all(systems.map(s => fetchWorkers(s)));
      setWorkers(results.flat());
      setLoading(false);
    })();
  }, [system]);

  const stats = useMemo(() => {
    const safes = workers.map(w => w.payment_safe).filter(Boolean) as PaymentSafe[];
    return {
      total: workers.length,
      active: workers.filter(w => w.is_active).length,
      pendingApproval: safes.filter(s => s.status === 'held').length,
      readyRelease: safes.filter(s => s.status === 'approved').length,
      delayed: safes.filter(s => s.status === 'delayed').length,
      totalEscrow: safes.reduce((a, s) => a + (s.amount ?? 0), 0),
      deliverables: workers.reduce((a, w) => a + (w.assignments?.length ?? 0), 0),
    };
  }, [workers]);

  async function approveSafe(id: string) {
    await updatePaymentSafeStatus(id, 'pending');
    setWorkers(w => w.map(x => x.payment_safe?.id === id ? { ...x, payment_safe: { ...x.payment_safe!, status: 'pending' } } : x));
  }
  async function markReadyWithdraw(id: string) {
    await updatePaymentSafeStatus(id, 'approved');
    setWorkers(w => w.map(x => x.payment_safe?.id === id ? { ...x, payment_safe: { ...x.payment_safe!, status: 'approved' } } : x));
  }
  async function delaySafe(id: string) {
    const reason = prompt('Delay reason?') ?? 'Delayed by admin';
    await updatePaymentSafeStatus(id, 'delayed', { delay_reason: reason } as Partial<PaymentSafe>);
    setWorkers(w => w.map(x => x.payment_safe?.id === id ? { ...x, payment_safe: { ...x.payment_safe!, status: 'delayed', delay_reason: reason } } : x));
  }

  const tabLabels: Record<string, string> = {
    dashboard:     'All Projects Dashboard',
    progress:      'Project Progress',
    workers:       'Worker Assignments',
    humans:        'Human Assignments',
    agents:        'AI Agent Assignments',
    safes:         'Project Safe Admin',
    deliverables:  'Deliverables Tracking',
    payments:      'Payment Approvals',
    delayed:       'Delayed Payments',
    history:       'Project History',
  };

  return (
    <AdminPage
      eyebrow="Project Operations"
      title={tabLabels[tab] ?? 'Project Operations'}
      subtitle="Admin counterpart to Project OS — controls across workers, deliverables, AI agents, and payment safes."
      accent={ADMIN_COLORS.cyan}
      actions={<Pill color={ADMIN_COLORS.cyan} label="ADMIN CONTROL" glow />}
    >
      {/* System filter */}
      <div className="flex items-center gap-1 flex-wrap">
        {SYSTEM_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setSystem(t.key as WorkerSystem | 'all')}
            className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border transition-all ${
              system === t.key
                ? 'text-white bg-[#06B6D4]/15 border-[#06B6D4]/40'
                : 'text-white/40 bg-white/[0.02] border-white/[0.06] hover:text-white/70'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatTile label="Active Workers"    value={stats.active}          color="#06B6D4" icon={UserCheck}    />
        <StatTile label="Deliverables"      value={stats.deliverables}    color="#EC4899" icon={ListChecks}   />
        <StatTile label="Pending Approval"  value={stats.pendingApproval} color="#F59E0B" icon={ShieldCheck}  />
        <StatTile label="Ready to Release"  value={stats.readyRelease}    color="#10B981" icon={Send}         />
        <StatTile label="Delayed"           value={stats.delayed}         color="#EF4444" icon={Clock}        />
        <StatTile label="Total Escrow"      value={`$${(stats.totalEscrow / 1000).toFixed(1)}K`} color="#F59E0B" icon={DollarSign} />
        <StatTile label="Human Owners"      value={HUMAN_OWNERS.length}   color="#06B6D4" icon={Users}        />
      </div>

      {/* AI Agents embedded across project ops */}
      <AgentPanel
        title="AI Agents Working Across Projects"
        entityType="project"
        accent="#06B6D4"
      />

      {/* Dashboard tab — master view */}
      {(tab === 'dashboard' || tab === 'progress') && (
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <AdminCard title="Master Project Dashboard" sub="Active projects across all systems" accent="#06B6D4" className="xl:col-span-2">
            <DensityTable
              rows={workers}
              emptyLabel={loading ? 'Loading…' : 'No projects yet'}
              columns={[
                { key: 'worker', label: 'Worker', render: w => <span className="font-medium">{w.name}</span> },
                { key: 'role',   label: 'Role',   render: w => <span className="text-white/60">{w.role}</span> },
                { key: 'sys',    label: 'System', render: w => <Pill color="#06B6D4" label={w.system.replace('_', ' ').toUpperCase()} /> },
                { key: 'proj',   label: 'Project', render: w => <span className="text-white/70 truncate">{w.project || '—'}</span> },
                { key: 'deliv',  label: 'Deliverables', render: w => <span className="text-white/60 font-mono">{w.assignments?.length ?? 0}</span> },
                { key: 'safe',   label: 'Safe', render: w => {
                  const s = w.payment_safe?.status ?? 'held';
                  return <Pill color={STATUS_COLOR[s]} label={STATUS_LABEL[s]} />;
                } },
                { key: 'amt',    label: 'Amount', render: w => <span className="font-mono text-white/75">${Number(w.payment_safe?.amount ?? 0).toLocaleString()}</span> },
              ]}
            />
          </AdminCard>

          <AdminCard title="Progress Pulse" sub="Velocity across projects" accent="#10B981">
            <div className="space-y-3">
              {workers.slice(0, 6).map(w => {
                const total = w.assignments?.length ?? 0;
                const done = w.assignments?.filter(a => a.status === 'approved').length ?? 0;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={w.id}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-white/75 truncate">{w.name}</span>
                      <span className="font-mono text-white/40">{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                      <div className="h-full" style={{ width: `${pct}%`, background: pct > 70 ? '#10B981' : pct > 40 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </section>
      )}

      {/* Human / AI assignment tabs */}
      {tab === 'humans' && (
        <AdminCard title="Human Assignments" sub="Owners across all active projects" accent="#F59E0B">
          <DensityTable
            rows={HUMAN_OWNERS}
            columns={[
              { key: 'p',  label: 'Person',   render: r => <span className="font-medium">{r.person}</span> },
              { key: 'r',  label: 'Role',     render: r => <span className="text-white/60">{r.role}</span> },
              { key: 'pr', label: 'Projects', render: r => <span className="font-mono text-white/70">{r.projects}</span> },
              { key: 'bk', label: 'Blocked',  render: r => r.blocked > 0 ? <Pill color="#EF4444" label={`${r.blocked} BLOCKED`} glow /> : <Pill color="#10B981" label="CLEAR" /> },
            ]}
          />
        </AdminCard>
      )}

      {tab === 'agents' && (
        <AdminCard title="AI Agent Assignments" sub="Which AI agents own what" accent="#EC4899">
          <div className="space-y-3">
            {AI_AGENTS_PER_PROJECT.map(p => (
              <div key={p.project} className="rounded-md border border-white/[0.06] bg-white/[0.015] p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] text-white/85 font-medium">{p.project}</span>
                  <span className="text-[9px] font-mono text-white/30">{p.agents.length} agents</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {p.agents.map(a => <Pill key={a} color="#EC4899" label={a} glow />)}
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Project Safe Admin */}
      {(tab === 'safes' || tab === 'payments' || tab === 'dashboard') && (
        <AdminCard
          title="Project Safe Admin"
          sub="Payment approval · compliance oversight"
          accent={ADMIN_COLORS.amber}
          right={<Pill color="#F59E0B" label={`${stats.pendingApproval} PENDING`} />}
        >
          <DensityTable
            rows={workers.filter(w => w.payment_safe)}
            emptyLabel={loading ? 'Loading…' : 'No safes.'}
            columns={[
              { key: 'w',  label: 'Worker',  render: w => <div><div className="text-white/85 font-medium">{w.name}</div><div className="text-[9px] text-white/35 font-mono">{w.email}</div></div> },
              { key: 's',  label: 'Status',  render: w => { const s = w.payment_safe!.status; return <Pill color={STATUS_COLOR[s]} label={STATUS_LABEL[s]} glow />; } },
              { key: 'c',  label: 'Compliance', render: w => {
                const s = w.payment_safe!;
                const items = [
                  { k: 'Contract', ok: s.compliance_contract_signed },
                  { k: 'W9',       ok: s.compliance_w9_submitted },
                  { k: 'ACH',      ok: s.compliance_ach_connected },
                  { k: 'Deliv',    ok: s.compliance_deliverables_approved },
                ];
                return (
                  <div className="flex items-center gap-1">
                    {items.map(i => (
                      <span key={i.k}
                        className="text-[8px] font-mono px-1 py-0.5 rounded"
                        style={{ color: i.ok ? '#10B981' : '#EF4444', background: i.ok ? '#10B98110' : '#EF444410', border: `1px solid ${i.ok ? '#10B98128' : '#EF444428'}` }}>
                        {i.k}
                      </span>
                    ))}
                  </div>
                );
              } },
              { key: 'amt', label: 'Amount', render: w => <span className="font-mono text-white/75">${Number(w.payment_safe!.amount).toLocaleString()}</span> },
              { key: 'act', label: 'Admin Actions', render: w => (
                <div className="flex items-center gap-1">
                  <ActionBtn color="#10B981" icon={CheckCircle2} label="Approve" onClick={() => approveSafe(w.payment_safe!.id)} />
                  <ActionBtn color="#06B6D4" icon={Send}         label="Ready"   onClick={() => markReadyWithdraw(w.payment_safe!.id)} />
                  <ActionBtn color="#EF4444" icon={Clock}        label="Delay"   onClick={() => delaySafe(w.payment_safe!.id)} />
                </div>
              ) },
            ]}
          />
        </AdminCard>
      )}

      {/* Deliverables */}
      {(tab === 'deliverables' || tab === 'dashboard') && (
        <AdminCard title="Deliverables Tracking" sub="Status across all workers" accent="#EC4899">
          <div className="space-y-2">
            {workers.flatMap(w => (w.assignments ?? []).map(a => ({ w, a }))).slice(0, 12).map(({ w, a }) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 rounded border border-white/[0.05] bg-white/[0.015]">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: '#EC489914', border: '1px solid #EC489928' }}>
                  <ListChecks className="w-3.5 h-3.5 text-[#EC4899]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-white/85 truncate">{a.deliverable_title}</div>
                  <div className="text-[10px] text-white/35 font-mono">{w.name} · {w.role}</div>
                </div>
                <Pill color={a.status === 'approved' ? '#10B981' : a.status === 'in_progress' ? '#06B6D4' : '#F59E0B'} label={a.status.replace('_', ' ').toUpperCase()} />
                {a.status !== 'approved' && (
                  <button
                    onClick={async () => { await updateAssignmentStatus(a.id, 'approved'); setWorkers(ws => ws.map(wx => wx.id === w.id ? { ...wx, assignments: wx.assignments.map(ax => ax.id === a.id ? { ...ax, status: 'approved' } : ax) } : wx)); }}
                    className="text-[9px] font-mono px-2 py-1 rounded border border-[#10B981]/30 text-[#10B981] bg-[#10B981]/8 hover:bg-[#10B981]/15 transition-colors"
                  >APPROVE</button>
                )}
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {/* Delayed */}
      {tab === 'delayed' && (
        <AdminCard title="Delayed Payments" sub="Blocked with reason" accent="#EF4444" right={<Pill color="#EF4444" label={`${stats.delayed} DELAYED`} glow />}>
          <DensityTable
            rows={workers.filter(w => w.payment_safe?.status === 'delayed')}
            emptyLabel="No delayed payments."
            columns={[
              { key: 'w', label: 'Worker', render: w => <span className="font-medium">{w.name}</span> },
              { key: 'r', label: 'Reason', render: w => <span className="text-white/60">{w.payment_safe?.delay_reason || 'Unspecified'}</span> },
              { key: 'a', label: 'Amount', render: w => <span className="font-mono">${Number(w.payment_safe?.amount ?? 0).toLocaleString()}</span> },
              { key: 'x', label: 'Actions', render: w => <ActionBtn color="#10B981" icon={CheckCircle2} label="Resume" onClick={() => approveSafe(w.payment_safe!.id)} /> },
            ]}
          />
        </AdminCard>
      )}

      {/* History */}
      {tab === 'history' && (
        <AdminCard title="Project History" sub="Past assignments by worker" accent="#06B6D4">
          <DensityTable
            rows={workers}
            columns={[
              { key: 'w',  label: 'Worker', render: w => <span className="font-medium">{w.name}</span> },
              { key: 'p',  label: 'Project', render: w => <span className="text-white/70">{w.project || '—'}</span> },
              { key: 'c',  label: 'Created', render: w => <span className="font-mono text-[10px] text-white/45">{new Date(w.created_at).toLocaleDateString()}</span> },
              { key: 'u',  label: 'Updated', render: w => <span className="font-mono text-[10px] text-white/45">{new Date(w.updated_at).toLocaleDateString()}</span> },
            ]}
          />
        </AdminCard>
      )}

      {/* Admin Action Panel — always visible on dashboard */}
      {tab === 'dashboard' && (
        <AdminCard title="Admin Command Actions" sub="Operate safes, assignments, and approvals in one place" accent="#F59E0B">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
            {[
              { icon: Send,         label: 'Initiate Payment',    color: '#10B981' },
              { icon: Clock,        label: 'Delay Payment',       color: '#EF4444' },
              { icon: AlertTriangle,label: 'Add Delay Reason',    color: '#F59E0B' },
              { icon: CheckCircle2, label: 'Approve Deliverables',color: '#10B981' },
              { icon: Zap,          label: 'Mark ACH Initiated',  color: '#06B6D4' },
              { icon: Flag,         label: 'Mark Ready Withdraw', color: '#10B981' },
              { icon: ShieldCheck,  label: 'Approve Project Start',color:'#F59E0B' },
              { icon: UserCheck,    label: 'Assign Worker',       color: '#06B6D4' },
              { icon: Brain,        label: 'Assign AI Agent',     color: '#EC4899' },
              { icon: Users,        label: 'Reassign Owner',      color: '#F59E0B' },
            ].map(a => (
              <button key={a.label}
                onClick={() => alert(`${a.label} — admin console`)}
                className="flex items-center gap-2 px-3 py-2 rounded-md border text-[11px] font-mono tracking-wider uppercase transition-all"
                style={{ color: a.color, background: `${a.color}08`, borderColor: `${a.color}28` }}
              >
                <a.icon className="w-3.5 h-3.5" />
                <span className="truncate">{a.label}</span>
              </button>
            ))}
          </div>
        </AdminCard>
      )}

      {/* back */}
      {tab !== 'dashboard' && (
        <div>
          <button onClick={() => navigate('/dashboard/admin-os/projects')} className="text-[11px] font-mono text-white/40 hover:text-white/70 tracking-wider">
            ← All Projects Dashboard
          </button>
        </div>
      )}
    </AdminPage>
  );
}

function ActionBtn({ color, icon: Icon, label, onClick }: { color: string; icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 text-[9px] font-mono px-2 py-1 rounded border tracking-wider uppercase transition-all"
      style={{ color, background: `${color}08`, borderColor: `${color}26` }}
    >
      <Icon className="w-3 h-3" />{label}
    </button>
  );
}
