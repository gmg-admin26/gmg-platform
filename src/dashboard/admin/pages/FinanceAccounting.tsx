import { useParams } from 'react-router-dom';
import {
  Calculator, TrendingUp, Receipt, Send, BookOpen, CheckCircle2,
  FileText, Flag, DollarSign, Wallet, AlertCircle, Activity,
} from 'lucide-react';
import { AdminPage, AdminCard, Pill, StatTile, DensityTable, CommandRow } from '../shared';
import AgentPanel from '../AgentPanel';

const REV_MOVEMENT = [
  { system: 'Artist OS',   mtd: 48200, mom: 8.4 },
  { system: 'Catalog OS',  mtd: 92640, mom: 11.2 },
  { system: 'Industry OS', mtd: 14800, mom: -2.1 },
  { system: 'Rocksteady',  mtd: 6400,  mom: 4.3 },
];

const PAYOUT_QUEUE = [
  { who: 'Industry Member', amount: 4800, system: 'Industry OS', status: 'pending_approval' },
  { who: 'Creative Lead',   amount: 7200, system: 'Artist OS',   status: 'approved'         },
  { who: 'Tour Advance',    amount: 12500,system: 'Catalog OS',  status: 'ach_initiated'    },
  { who: 'Scout Retainer',  amount: 3400, system: 'Rocksteady',  status: 'delayed'          },
];

const EXPENSES = [
  { category: 'Software + Cloud',     mtd: 8420,  flagged: 0 },
  { category: 'Contractor Payouts',   mtd: 48200, flagged: 1 },
  { category: 'Travel + Events',      mtd: 6200,  flagged: 0 },
  { category: 'Legal + Advisory',     mtd: 11200, flagged: 0 },
  { category: 'Marketing + Campaigns',mtd: 18400, flagged: 2 },
];

const CLOSE_CHECKLIST = [
  { task: 'Reconcile bank accounts',           done: true  },
  { task: 'Reconcile Stripe/processor',         done: true  },
  { task: 'Close payout queue',                 done: false },
  { task: 'Final expense categorization',       done: true  },
  { task: 'Royalty report mapping',             done: false },
  { task: 'Tax-ready snapshot',                 done: true  },
];

const PAYOUT_STATUS_COLOR: Record<string, string> = {
  pending_approval: '#F59E0B',
  approved: '#06B6D4',
  ach_initiated: '#06B6D4',
  delayed: '#EF4444',
  paid: '#10B981',
};

export default function FinanceAccounting() {
  const { tab = 'command' } = useParams();
  const titles: Record<string, string> = {
    command: 'Accounting Command Center',
    revenue: 'Revenue Movement',
    expenses: 'Expenses + Cash Visibility',
    payouts: 'Payout Queue',
    royalties: 'Royalty Reporting Readiness',
    close: 'Month-End Close',
    tax: 'Tax Ready Status',
    '1099': '1099 Tracking',
  };

  const subtitle = 'Live cash view, payouts, royalties, expenses, and close — governed by Ledger.';

  return (
    <AdminPage
      eyebrow="Finance + Accounting"
      title={titles[tab] ?? 'Finance'}
      subtitle={subtitle}
      accent="#10B981"
      actions={<Pill color="#10B981" label="LEDGER AGENT LIVE" glow />}
    >
      <AgentPanel
        title="Finance Agents — Ledger, Vault, Anchor"
        agentSlugs={['ledger', 'vault', 'anchor']}
        accent="#10B981"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatTile label="Cash On Hand"      value="$412.8K" color="#10B981" icon={Wallet}       sub="+3.2% MoM" />
        <StatTile label="Revenue MTD"       value="$162.0K" color="#06B6D4" icon={TrendingUp}   sub="+8.4% MoM" />
        <StatTile label="Payouts Queue"     value={PAYOUT_QUEUE.length} color="#F59E0B" icon={Send} sub="$27.9K pending" />
        <StatTile label="Expense Flags"     value={3}       color="#EF4444" icon={AlertCircle}  />
        <StatTile label="Royalty Ready"     value="88%"     color="#EC4899" icon={BookOpen}     />
        <StatTile label="Close Progress"    value={`${CLOSE_CHECKLIST.filter(c => c.done).length}/${CLOSE_CHECKLIST.length}`} color="#10B981" icon={CheckCircle2} />
      </div>

      {(tab === 'command' || tab === 'revenue') && (
        <AdminCard title="Revenue Movement" sub="MTD by system" accent="#10B981">
          <DensityTable rows={REV_MOVEMENT}
            columns={[
              { key: 's', label: 'System',     render: r => <span className="font-medium">{r.system}</span> },
              { key: 'm', label: 'MTD',        render: r => <span className="font-mono text-white/85">${r.mtd.toLocaleString()}</span> },
              { key: 'c', label: 'MoM Change', render: r => (
                <span className="font-mono" style={{ color: r.mom >= 0 ? '#10B981' : '#EF4444' }}>{r.mom >= 0 ? '+' : ''}{r.mom}%</span>
              ) },
            ]} />
        </AdminCard>
      )}

      {(tab === 'command' || tab === 'payouts') && (
        <AdminCard title="Payout Queue" sub="Live status across systems" accent="#F59E0B">
          <DensityTable rows={PAYOUT_QUEUE}
            columns={[
              { key: 'w', label: 'Worker',   render: r => <span className="font-medium">{r.who}</span> },
              { key: 's', label: 'System',   render: r => <Pill color="#06B6D4" label={r.system} /> },
              { key: 'a', label: 'Amount',   render: r => <span className="font-mono text-white/85">${r.amount.toLocaleString()}</span> },
              { key: 't', label: 'Status',   render: r => <Pill color={PAYOUT_STATUS_COLOR[r.status] ?? '#06B6D4'} label={r.status.replace(/_/g, ' ').toUpperCase()} glow /> },
            ]} />
        </AdminCard>
      )}

      {(tab === 'command' || tab === 'expenses') && (
        <AdminCard title="Expenses + Cash Visibility" sub="Categorized spend with flags" accent="#06B6D4">
          <DensityTable rows={EXPENSES}
            columns={[
              { key: 'c', label: 'Category', render: r => <span className="font-medium">{r.category}</span> },
              { key: 'm', label: 'MTD',      render: r => <span className="font-mono text-white/85">${r.mtd.toLocaleString()}</span> },
              { key: 'f', label: 'Flagged',  render: r => r.flagged > 0 ? <Pill color="#EF4444" label={`${r.flagged} FLAGGED`} glow /> : <Pill color="#10B981" label="CLEAR" /> },
            ]} />
        </AdminCard>
      )}

      {tab === 'royalties' && (
        <AdminCard title="Royalty Reporting Readiness" sub="Upcoming statements by partner" accent="#EC4899">
          <div className="grid grid-cols-2 gap-3">
            {[
              { p: 'DSP Royalties',    due: 'Apr 30', pct: 92 },
              { p: 'Label Partners',   due: 'May 5',  pct: 88 },
              { p: 'Catalog Licensors',due: 'May 10', pct: 76 },
              { p: 'Sync Partners',    due: 'May 14', pct: 94 },
            ].map(r => (
              <div key={r.p} className="rounded border border-white/[0.06] bg-white/[0.015] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-white/85">{r.p}</span>
                  <span className="font-mono text-[10px] text-white/45">Due {r.due}</span>
                </div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full" style={{ width: `${r.pct}%`, background: r.pct > 90 ? '#10B981' : r.pct > 80 ? '#06B6D4' : '#F59E0B' }} />
                </div>
                <div className="mt-1 text-[9px] font-mono text-white/40">{r.pct}% ready</div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {tab === 'close' && (
        <AdminCard title="Month-End Close Checklist" sub="Finalize current period" accent="#10B981">
          <div className="space-y-1">
            {CLOSE_CHECKLIST.map((c, i) => (
              <CommandRow key={i} icon={c.done ? CheckCircle2 : Activity} title={c.task} meta={c.done ? 'Complete' : 'Pending'} accent={c.done ? '#10B981' : '#F59E0B'} />
            ))}
          </div>
        </AdminCard>
      )}

      {tab === 'tax' && (
        <AdminCard title="Tax Ready Status" sub="Tax-readiness across entities" accent="#F59E0B">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { entity: 'Greater Music Group LLC', pct: 96 },
              { entity: 'Greater Catalog Holdings', pct: 88 },
              { entity: 'Greater Industries', pct: 74 },
            ].map(e => (
              <div key={e.entity} className="rounded border border-white/[0.06] bg-white/[0.015] p-3">
                <div className="text-[11px] text-white/80 mb-1.5">{e.entity}</div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full" style={{ width: `${e.pct}%`, background: '#10B981' }} />
                </div>
                <div className="mt-1 font-mono text-[10px] text-white/40">{e.pct}% tax-ready</div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {tab === '1099' && (
        <AdminCard title="1099 Tracking" sub="Contractor documentation" accent="#EC4899">
          <DensityTable rows={[
            { who: 'Industry Member',  w9: 'Verified',  paid: '$4,800', form: 'Due Jan 2027' },
            { who: 'Creative Lead',    w9: 'Verified',  paid: '$12,400', form: 'Due Jan 2027' },
            { who: 'Tour Manager Rep', w9: 'Missing',   paid: '$0',      form: 'Pending W9'   },
            { who: 'Campus Manager',   w9: 'Submitted', paid: '$2,100',  form: 'Due Jan 2027' },
          ]} columns={[
            { key: 'w', label: 'Worker',  render: r => <span className="font-medium">{r.who}</span> },
            { key: 'f', label: 'W9/EIN',  render: r => <Pill color={r.w9 === 'Verified' ? '#10B981' : r.w9 === 'Missing' ? '#EF4444' : '#F59E0B'} label={r.w9.toUpperCase()} /> },
            { key: 'p', label: 'Paid YTD',render: r => <span className="font-mono">{r.paid}</span> },
            { key: 'd', label: 'Filing',  render: r => <span className="text-white/60">{r.form}</span> },
          ]} />
        </AdminCard>
      )}
    </AdminPage>
  );
}
