import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, AlertCircle, CheckCircle2, Clock, Filter } from 'lucide-react';
import {
  Agent, AgentAssignment, fetchAgents, fetchAssignments,
  STATUS_COLOR, PRIORITY_COLOR,
} from '../adminAgentService';
import { AdminPage, AdminCard, Pill, StatTile, DensityTable } from '../shared';

export default function AgentAssignments() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [assignments, setAssignments] = useState<AgentAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ag, as] = await Promise.all([fetchAgents(), fetchAssignments()]);
      setAgents(ag); setAssignments(as);
      setLoading(false);
    })();
  }, []);

  const agentBySlug = useMemo(() => new Map(agents.map(a => [a.slug, a])), [agents]);

  const entityTypes = Array.from(new Set(assignments.map(a => a.entity_type)));
  const statuses = ['all', 'active', 'queued', 'blocked', 'completed'];

  const filtered = assignments.filter(a => {
    if (entityFilter !== 'all' && a.entity_type !== entityFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const groupedByEntity = filtered.reduce<Record<string, AgentAssignment[]>>((acc, a) => {
    const key = `${a.entity_type}:${a.entity_id}`;
    (acc[key] = acc[key] ?? []).push(a);
    return acc;
  }, {});

  const totals = {
    total: assignments.length,
    active: assignments.filter(a => a.status === 'active').length,
    queued: assignments.filter(a => a.status === 'queued').length,
    blocked: assignments.filter(a => a.status === 'blocked').length,
  };

  return (
    <AdminPage
      eyebrow="AI Agent Roster"
      title="Agent Assignments"
      subtitle="Every AI agent assignment across projects, artists, catalogs, campaigns, contracts, partners. Grouped by entity to reveal which agents + humans are working together."
      accent="#EC4899"
      actions={<Pill color="#10B981" label={`${totals.active} ACTIVE`} glow />}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatTile label="Total Assignments" value={totals.total}   color="#06B6D4" icon={Target}       />
        <StatTile label="Active"            value={totals.active}  color="#10B981" icon={CheckCircle2} />
        <StatTile label="Queued"            value={totals.queued}  color="#F59E0B" icon={Clock}        />
        <StatTile label="Blocked"           value={totals.blocked} color="#EF4444" icon={AlertCircle}  />
      </div>

      <AdminCard
        title="Filters"
        accent="#06B6D4"
        right={
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3 h-3 text-white/25" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Entity</span>
            <Chip active={entityFilter === 'all'} onClick={() => setEntityFilter('all')} label="ALL" color="#64748B" />
            {entityTypes.map(t => (
              <Chip key={t} active={entityFilter === t} onClick={() => setEntityFilter(t)} label={t.toUpperCase()} color="#06B6D4" />
            ))}
            <span className="w-px h-3 bg-white/10 mx-1" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Status</span>
            {statuses.map(s => (
              <Chip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)} label={s.toUpperCase()}
                color={s === 'all' ? '#64748B' : STATUS_COLOR[s] ?? '#06B6D4'} />
            ))}
          </div>
        }
      >
        <div className="text-[10.5px] text-white/45">
          Showing <span className="text-white/80 font-semibold">{filtered.length}</span> of {assignments.length} assignments across{' '}
          <span className="text-white/80 font-semibold">{Object.keys(groupedByEntity).length}</span> entities.
        </div>
      </AdminCard>

      <AdminCard title="Assignments by Entity" sub="Agents + humans collaborating per entity" accent="#EC4899">
        {loading ? (
          <div className="py-8 text-center text-[11px] font-mono text-white/30">Loading assignments…</div>
        ) : (
          <div className="space-y-3">
            {Object.entries(groupedByEntity).map(([key, rows]) => {
              const first = rows[0];
              const involvedAgents = Array.from(new Set(rows.map(r => r.agent_slug)))
                .map(s => agentBySlug.get(s)).filter(Boolean) as Agent[];
              const humanOwners = Array.from(new Set(rows.map(r => r.human_owner).filter(Boolean)));
              const blockersHere = rows.filter(r => r.status === 'blocked' || r.blocker).length;

              return (
                <div key={key} className="rounded-lg border border-white/[0.06] bg-[#0B0C0F] p-3">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.04]">
                    <Pill color="#06B6D4" label={first.entity_type.toUpperCase()} />
                    <span className="text-[12.5px] font-semibold text-white/90">{first.entity_label}</span>
                    <span className="ml-auto text-[9.5px] font-mono text-white/35">
                      {involvedAgents.length} AGENT · {humanOwners.length} HUMAN · {blockersHere} BLOCKED
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className="text-[9px] font-mono text-white/30 tracking-wider uppercase">Humans:</span>
                    {humanOwners.map(h => (
                      <span key={h} className="text-[9.5px] font-mono text-white/70 bg-[#F59E0B]12 border border-[#F59E0B]28 px-1.5 py-0.5 rounded" style={{background:'#F59E0B12',borderColor:'#F59E0B28'}}>
                        {h}
                      </span>
                    ))}
                    <span className="text-[9px] font-mono text-white/30 tracking-wider uppercase ml-2">Agents:</span>
                    {involvedAgents.map(a => (
                      <Link key={a.slug} to={`/dashboard/admin-os/agents/${a.slug}`}
                        className="inline-flex items-center gap-1 text-[9.5px] font-mono px-1.5 py-0.5 rounded hover:brightness-125 transition"
                        style={{ color: a.color, background: `${a.color}12`, border: `1px solid ${a.color}30` }}>
                        <Brain className="w-2.5 h-2.5" /> {a.name}
                      </Link>
                    ))}
                  </div>

                  <DensityTable
                    rows={rows}
                    columns={[
                      { key: 'agent', label: 'Agent', render: (r: AgentAssignment) => {
                        const a = agentBySlug.get(r.agent_slug);
                        return a ? (
                          <Link to={`/dashboard/admin-os/agents/${a.slug}`} className="inline-flex items-center gap-1.5 hover:brightness-125" style={{color: a.color}}>
                            <Brain className="w-3 h-3" /> {a.name}
                          </Link>
                        ) : <span className="text-white/40">{r.agent_slug}</span>;
                      }},
                      { key: 'status', label: 'Status', render: (r: AgentAssignment) =>
                        <Pill color={STATUS_COLOR[r.status] ?? '#06B6D4'} label={r.status.toUpperCase()} glow={r.status==='active'} /> },
                      { key: 'priority', label: 'Priority', render: (r: AgentAssignment) =>
                        <Pill color={PRIORITY_COLOR[r.priority]} label={r.priority.toUpperCase()} /> },
                      { key: 'next', label: 'Next Action', render: (r: AgentAssignment) =>
                        <span className="text-white/70">{r.next_action}</span> },
                      { key: 'blocker', label: 'Blocker', render: (r: AgentAssignment) =>
                        r.blocker ? <span className="text-[#EF4444] font-mono text-[10.5px]">{r.blocker}</span> : <span className="text-white/25">—</span> },
                      { key: 'progress', label: 'Progress', render: (r: AgentAssignment) => {
                        const a = agentBySlug.get(r.agent_slug);
                        return (
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 h-[3px] bg-white/[0.05] rounded overflow-hidden">
                              <div className="h-full" style={{ width: `${r.progress_pct}%`, background: a?.color ?? '#06B6D4' }} />
                            </div>
                            <span className="text-[9.5px] font-mono text-white/40 w-8 text-right">{r.progress_pct}%</span>
                          </div>
                        );
                      }},
                    ]}
                    emptyLabel="No assignments"
                  />
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>
    </AdminPage>
  );
}

function Chip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase transition-all"
      style={{
        color: active ? color : 'rgba(255,255,255,0.5)',
        background: active ? `${color}14` : 'transparent',
        border: `1px solid ${active ? color + '44' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {label}
    </button>
  );
}
