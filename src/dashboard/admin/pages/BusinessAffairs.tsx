import { useParams } from 'react-router-dom';
import { FileText, Link2, Repeat, FileCheck, RefreshCw, Timer, Ligature as FileSignature, CheckSquare, MessageSquare, Send, AlertTriangle, Scale, Clock } from 'lucide-react';
import { AdminPage, AdminCard, Pill, StatTile, DensityTable, CommandRow } from '../shared';
import AgentPanel from '../AgentPanel';

const LOIS = [
  { party: 'Gallagher Insurance',    stage: 'sent',     owner: 'Counsel', updated: '2d ago', value: '$88K' },
  { party: 'Banc of California',     stage: 'drafting', owner: 'Vault',   updated: '4d ago', value: '—'    },
  { party: 'Fractional Collective',  stage: 'reply',    owner: 'Crest',   updated: '1d ago', value: '$250K'},
  { party: 'Cutwater Capital',       stage: 'sent',     owner: 'Ledger',  updated: '6d ago', value: '$500K'},
];

const CONTRACTS_OUT = [
  { doc: 'ZARA VEX — Management Addendum', status: 'out for signature', days: 2, owner: 'Paula',  system: 'Artist OS' },
  { doc: 'SPIN Records — Imprint Renewal', status: 'counter-signature', days: 5, owner: 'Randy',  system: 'Artist OS' },
  { doc: 'Arctic Fox — Merch License',     status: 'draft review',      days: 1, owner: 'Counsel',system: 'Merch'     },
  { doc: 'Rocksteady — Scout Retainer',    status: 'out for signature', days: 3, owner: 'Paula',  system: 'Rocksteady'},
];

const RENEWALS = [
  { doc: 'Trouble Andrew — Creative License',  window: '30d', due: 'Apr 29, 2026', stage: 'notice due',  owner: 'Counsel' },
  { doc: 'Bassnectar Catalog — Access Deal',   window: '60d', due: 'May 29, 2026', stage: 'negotiating', owner: 'Randy'   },
  { doc: 'Campus Program — Pilot Extension',   window: '90d', due: 'Jun 29, 2026', stage: 'monitor',     owner: 'Paula'   },
];

const GUIDANCE_QUEUE = [
  { q: 'Can the Gallagher rider stack with Cyber umbrella?',    asked: 'Randy',   waiting: '1d' },
  { q: 'Artist wants distribution override — what\'s exposure?',asked: 'Paula',   waiting: '3h' },
  { q: 'Do we need a standalone NDA for tour stop A?',          asked: 'Tour Mgr',waiting: '2d' },
];

export default function BusinessAffairs() {
  const { tab = 'lois' } = useParams();
  const titles: Record<string, string> = {
    lois: 'LOIs',
    pipeline: 'Contract Pipeline',
    pandadoc: 'PandaDoc Loop',
    signed: 'Signed Contracts',
    renewals: 'Renewals — 90 / 60 / 30',
    notices: 'Notice Deadlines',
    ndas: 'NDA / Project Work Contracts',
    tasks: 'Legal Tasks',
    guidance: 'Business Affairs Guidance Queue',
  };

  return (
    <AdminPage
      eyebrow="Business Affairs + Legal"
      title={titles[tab] ?? 'Legal'}
      subtitle="Contracts, renewals, notices, NDAs, and exec legal guidance — all in one command surface."
      accent="#06B6D4"
      actions={<Pill color="#06B6D4" label="COUNSEL AGENT MONITORING" glow />}
    >
      <AgentPanel
        title="Legal Agents — Counsel + Contract Loop Manager"
        agentSlugs={['counsel', 'contract-loop']}
        accent="#06B6D4"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatTile label="LOIs Open"         value={LOIS.length}           color="#06B6D4" icon={FileText}     />
        <StatTile label="Contracts Out"     value={CONTRACTS_OUT.length}  color="#F59E0B" icon={Link2}        sub="3 this week" />
        <StatTile label="Signed (30d)"      value={9}                     color="#10B981" icon={FileCheck}    />
        <StatTile label="Renewals Window"   value={RENEWALS.length}       color="#EC4899" icon={RefreshCw}    />
        <StatTile label="Notices Pending"   value={2}                     color="#EF4444" icon={Timer}        />
        <StatTile label="Guidance Waiting"  value={GUIDANCE_QUEUE.length} color="#06B6D4" icon={MessageSquare}/>
      </div>

      {(tab === 'lois') && (
        <AdminCard title="LOI Pipeline" sub="All live LOIs" accent="#06B6D4">
          <DensityTable rows={LOIS}
            columns={[
              { key: 'p', label: 'Party',   render: r => <span className="font-medium">{r.party}</span> },
              { key: 's', label: 'Stage',   render: r => <Pill color="#06B6D4" label={r.stage.toUpperCase()} /> },
              { key: 'o', label: 'Owner',   render: r => <span className="text-white/60">{r.owner}</span> },
              { key: 'u', label: 'Updated', render: r => <span className="text-white/40 font-mono">{r.updated}</span> },
              { key: 'v', label: 'Value',   render: r => <span className="font-mono text-white/75">{r.value}</span> },
            ]} />
        </AdminCard>
      )}

      {tab === 'pipeline' && (
        <AdminCard title="Contract Pipeline" sub="All contracts moving through system" accent="#F59E0B">
          <DensityTable rows={CONTRACTS_OUT}
            columns={[
              { key: 'd', label: 'Contract', render: r => <span className="font-medium">{r.doc}</span> },
              { key: 's', label: 'Status',   render: r => <Pill color="#F59E0B" label={r.status.toUpperCase()} /> },
              { key: 'sys', label: 'System', render: r => <Pill color="#06B6D4" label={r.system.toUpperCase()} /> },
              { key: 'dy',  label: 'Days',   render: r => <span className="font-mono text-white/60">{r.days}d</span> },
              { key: 'o',   label: 'Owner',  render: r => <span className="text-white/60">{r.owner}</span> },
            ]} />
        </AdminCard>
      )}

      {tab === 'pandadoc' && (
        <AdminCard title="PandaDoc Loop" sub="Live signature tracking" accent="#10B981">
          <div className="space-y-2">
            {[
              { t: 'ZARA VEX — Management Addendum', s: 'SENT', pct: 60, color: '#F59E0B' },
              { t: 'Arctic Fox — Merch License',     s: 'VIEWED', pct: 80, color: '#06B6D4' },
              { t: 'SPIN — Imprint Renewal',         s: 'SIGNED', pct: 100, color: '#10B981' },
              { t: 'Rocksteady Scout Retainer',      s: 'SENT', pct: 40, color: '#F59E0B' },
            ].map(d => (
              <div key={d.t} className="rounded border border-white/[0.06] bg-white/[0.015] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] text-white/85">{d.t}</span>
                  <Pill color={d.color} label={d.s} />
                </div>
                <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className="h-full" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {tab === 'renewals' && (
        <AdminCard title="Renewals 90 / 60 / 30" sub="Windowed renewal tracking" accent="#EC4899">
          <DensityTable rows={RENEWALS}
            columns={[
              { key: 'd', label: 'Contract', render: r => <span className="font-medium">{r.doc}</span> },
              { key: 'w', label: 'Window',   render: r => <Pill color={r.window === '30d' ? '#EF4444' : r.window === '60d' ? '#F59E0B' : '#10B981'} label={r.window.toUpperCase()} glow /> },
              { key: 'u', label: 'Due',      render: r => <span className="font-mono text-white/75">{r.due}</span> },
              { key: 's', label: 'Stage',    render: r => <Pill color="#06B6D4" label={r.stage.toUpperCase()} /> },
              { key: 'o', label: 'Owner',    render: r => <span className="text-white/60">{r.owner}</span> },
            ]} />
        </AdminCard>
      )}

      {tab === 'notices' && (
        <AdminCard title="Notice Deadlines" sub="Notices approaching window" accent="#EF4444">
          <div className="space-y-1">
            {RENEWALS.filter(r => r.stage === 'notice due').concat({ doc: 'Campus Program — Review Window', window: '30d', due: 'May 10, 2026', stage: 'notice due', owner: 'Counsel' })
              .map(r => (
                <CommandRow key={r.doc} icon={Timer} title={`${r.doc} — ${r.due}`} meta={`Owner: ${r.owner} · Window ${r.window}`} accent="#EF4444" />
              ))}
          </div>
        </AdminCard>
      )}

      {tab === 'signed' && (
        <AdminCard title="Signed Contracts Repository" sub="All completed agreements" accent="#10B981">
          <DensityTable rows={[
            { doc: 'Paula Moore — Engagement Ltr', signed: 'Jan 14, 2026', system: 'Admin',    value: '—' },
            { doc: 'SPIN Records — Imprint Deal',   signed: 'Feb 4, 2026',  system: 'Artist OS', value: '$1.2M' },
            { doc: 'Trouble Andrew — Creative',     signed: 'Feb 19, 2026', system: 'Merch',     value: '$340K' },
          ]} columns={[
            { key: 'd', label: 'Document', render: r => <span className="font-medium">{r.doc}</span> },
            { key: 's', label: 'Signed',   render: r => <span className="font-mono text-white/70">{r.signed}</span> },
            { key: 'y', label: 'System',   render: r => <Pill color="#10B981" label={r.system} /> },
            { key: 'v', label: 'Value',    render: r => <span className="font-mono text-white/75">{r.value}</span> },
          ]} />
        </AdminCard>
      )}

      {tab === 'ndas' && (
        <AdminCard title="NDA / Project Work Contracts" sub="Confidentiality + scope agreements" accent="#06B6D4">
          <DensityTable rows={[
            { party: 'Arctic Fox', type: 'NDA',            status: 'Signed',   expires: 'Jan 2027' },
            { party: 'Greater Studio Team', type: 'Work', status: 'Active',   expires: 'Ongoing'  },
            { party: 'Rocksteady Scouts',   type: 'NDA',  status: 'Pending',  expires: '—'        },
          ]} columns={[
            { key: 'p', label: 'Party',   render: r => <span className="font-medium">{r.party}</span> },
            { key: 't', label: 'Type',    render: r => <Pill color="#06B6D4" label={r.type} /> },
            { key: 's', label: 'Status',  render: r => <Pill color={r.status === 'Signed' ? '#10B981' : r.status === 'Active' ? '#06B6D4' : '#F59E0B'} label={r.status.toUpperCase()} /> },
            { key: 'e', label: 'Expires', render: r => <span className="font-mono text-white/60">{r.expires}</span> },
          ]} />
        </AdminCard>
      )}

      {tab === 'tasks' && (
        <AdminCard title="Legal Tasks" sub="Open legal workstream" accent="#F59E0B">
          <div className="space-y-1">
            {[
              { t: 'Draft counter on SPIN imprint deal',        owner: 'Counsel', due: '2d' },
              { t: 'Redline Gallagher MSA',                     owner: 'Counsel', due: '4d' },
              { t: 'Finalize Rocksteady scout retainer',        owner: 'Counsel', due: '1d' },
              { t: 'Review Arctic Fox license terms',           owner: 'Counsel', due: '3d' },
            ].map(t => (
              <CommandRow key={t.t} icon={CheckSquare} title={t.t} meta={`Owner: ${t.owner} · Due in ${t.due}`} accent="#F59E0B" />
            ))}
          </div>
        </AdminCard>
      )}

      {tab === 'guidance' && (
        <AdminCard title="Business Affairs Guidance Queue" sub="Execs awaiting legal guidance" accent="#EC4899">
          <div className="space-y-1">
            {GUIDANCE_QUEUE.map((g, i) => (
              <CommandRow key={i} icon={AlertTriangle} title={g.q} meta={`Asked by ${g.asked} · Waiting ${g.waiting}`} accent="#EC4899" />
            ))}
          </div>
        </AdminCard>
      )}
    </AdminPage>
  );
}
