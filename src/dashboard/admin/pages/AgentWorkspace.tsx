import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Brain, Activity, AlertCircle, Target, Zap, Cpu, Pause, Search, Filter,
} from 'lucide-react';
import {
  Agent, fetchAgents, CATEGORY_META, STATUS_COLOR,
} from '../adminAgentService';
import { AdminPage, AdminCard, Pill, StatTile } from '../shared';
import AgentProfile from './AgentProfile';

export default function AgentWorkspace() {
  const { agentSlug } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setAgents(await fetchAgents());
      setLoading(false);
    })();
  }, []);

  if (agentSlug) return <AgentProfile slug={agentSlug} />;

  const filtered = useMemo(() => agents.filter(a => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (query && !`${a.name} ${a.role} ${a.mission} ${a.specialties.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [agents, query, categoryFilter, statusFilter]);

  const totals = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    idle: agents.filter(a => a.status === 'idle').length,
    assignments: agents.reduce((a, x) => a + x.current_assignments, 0),
    actions: agents.reduce((a, x) => a + x.recent_actions, 0),
    escalations: agents.reduce((a, x) => a + x.escalations, 0),
  };

  const categories = ['all', ...Object.keys(CATEGORY_META)];
  const statuses = ['all', 'active', 'idle', 'paused', 'blocked'];

  return (
    <AdminPage
      eyebrow="AI Agent Roster"
      title="AI Agent Roster"
      subtitle="Every GMG AI agent operating across Project Ops, Finance, Legal, Growth, Communications, and Partner Pipeline. Click any agent to open the profile."
      accent="#06B6D4"
      actions={<Pill color="#06B6D4" label={`${totals.active} LIVE`} glow />}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatTile label="Total Agents"    value={totals.total}        color="#06B6D4" icon={Cpu}          />
        <StatTile label="Active"          value={totals.active}       color="#10B981" icon={Activity}     />
        <StatTile label="Idle"            value={totals.idle}         color="#F59E0B" icon={Pause}        />
        <StatTile label="Assignments"     value={totals.assignments}  color="#EC4899" icon={Target}       />
        <StatTile label="Actions (7d)"    value={totals.actions}      color="#06B6D4" icon={Zap}          />
        <StatTile label="Escalations"     value={totals.escalations}  color="#EF4444" icon={AlertCircle}  />
      </div>

      <AdminCard
        title="All Agents"
        sub={`${filtered.length} of ${agents.length} shown`}
        accent="#06B6D4"
        right={
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/[0.08] bg-black/30">
              <Search className="w-3 h-3 text-white/35" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search agents, specialties…"
                className="bg-transparent text-[11px] text-white placeholder-white/30 focus:outline-none w-44"
              />
            </div>
          </div>
        }
      >
        <div className="flex items-center gap-1.5 flex-wrap mb-3 pb-3 border-b border-white/[0.04]">
          <Filter className="w-3 h-3 text-white/25" />
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider mr-1">Category</span>
          {categories.map(c => (
            <FilterChip key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}
              label={c === 'all' ? 'ALL' : CATEGORY_META[c]?.label.toUpperCase() ?? c.toUpperCase()}
              color={c === 'all' ? '#64748B' : CATEGORY_META[c]?.color ?? '#06B6D4'} />
          ))}
          <span className="w-px h-3 bg-white/10 mx-1" />
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider mr-1">Status</span>
          {statuses.map(s => (
            <FilterChip key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}
              label={s.toUpperCase()} color={s === 'all' ? '#64748B' : STATUS_COLOR[s] ?? '#06B6D4'} />
          ))}
        </div>

        {loading ? (
          <div className="py-8 text-center text-[11px] font-mono text-white/30">Loading agents…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(a => (
              <AgentCard key={a.id} agent={a} onClick={() => navigate(`/dashboard/admin-os/agents/${a.slug}`)} />
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPage>
  );
}

function FilterChip({ active, onClick, label, color }: { active: boolean; onClick: () => void; label: string; color: string }) {
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

export function AgentCard({ agent, onClick }: { agent: Agent; onClick?: () => void }) {
  const cat = CATEGORY_META[agent.category] ?? { label: agent.category, color: agent.color, description: '' };
  const specialties = (agent.specialties ?? []).slice(0, 4);
  return (
    <div
      onClick={onClick}
      className="group rounded-xl border border-white/[0.07] bg-[#0E0F12] p-4 hover:border-white/[0.16] transition-all cursor-pointer relative overflow-hidden"
      style={{ boxShadow: `inset 0 0 0 1px ${agent.color}08` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${agent.color}80, transparent)` }}
      />
      <div className="flex items-center gap-3 mb-2.5">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${agent.color}18`, border: `1px solid ${agent.color}36`, boxShadow: `0 0 18px ${agent.color}22` }}
        >
          <Brain className="w-5 h-5" style={{ color: agent.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13.5px] font-semibold text-white/95 truncate">{agent.name}</div>
          <div className="text-[9.5px] font-mono text-white/40 tracking-wider uppercase truncate">{agent.role}</div>
        </div>
        <Pill color={STATUS_COLOR[agent.status]} label={agent.status.toUpperCase()} glow={agent.status === 'active'} />
      </div>

      <p className="text-[11.5px] text-white/60 leading-snug line-clamp-2 mb-2.5">{agent.mission}</p>

      {specialties.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mb-2.5">
          {specialties.map((s, i) => (
            <span key={i} className="text-[9px] font-mono text-white/55 bg-white/[0.04] border border-white/[0.06] px-1.5 py-0.5 rounded tracking-wider">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/[0.05]">
        <Pill color={cat.color} label={cat.label.toUpperCase()} />
        <span className="text-[9px] font-mono text-white/45">
          <span className="text-white/25">ASSN</span> {agent.current_assignments}
        </span>
        <span className="text-[9px] font-mono text-white/45">
          <span className="text-white/25">·</span> <span className="text-white/25">ACT</span> {agent.recent_actions}
        </span>
        {agent.blockers > 0 && <Pill color="#EF4444" label={`BLK ${agent.blockers}`} />}
        {agent.escalations > 0 && <Pill color="#F59E0B" label={`ESC ${agent.escalations}`} />}
        <span className="ml-auto text-[9px] font-mono text-white/35 tracking-wider uppercase">View Profile →</span>
      </div>
    </div>
  );
}
