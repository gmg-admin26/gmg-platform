import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Activity, AlertCircle, AlertTriangle, Zap, Filter, CheckCircle2 } from 'lucide-react';
import {
  Agent, AgentActivity, EventType,
  fetchAgents, fetchActivity,
  SEVERITY_COLOR, EVENT_LABEL, relativeTime,
} from '../adminAgentService';
import { AdminPage, AdminCard, Pill, StatTile } from '../shared';

const EVENT_TYPES: EventType[] = ['trigger', 'action', 'escalation', 'failure', 'approval_wait', 'cross_update', 'output'];

export default function AgentActivityLog() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activity, setActivity] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ag, act] = await Promise.all([fetchAgents(), fetchActivity({ limit: 200 })]);
      setAgents(ag); setActivity(act);
      setLoading(false);
    })();
  }, []);

  const agentMap = useMemo(() => new Map(agents.map(a => [a.slug, a])), [agents]);

  const filtered = activity.filter(e => {
    if (eventFilter !== 'all' && e.event_type !== eventFilter) return false;
    if (severityFilter !== 'all' && e.severity !== severityFilter) return false;
    if (agentFilter !== 'all' && e.agent_slug !== agentFilter) return false;
    return true;
  });

  const totals = {
    total: activity.length,
    triggers: activity.filter(e => e.event_type === 'trigger').length,
    escalations: activity.filter(e => e.event_type === 'escalation').length,
    failures: activity.filter(e => e.event_type === 'failure').length,
    waits: activity.filter(e => e.event_type === 'approval_wait').length,
    cross: activity.filter(e => e.event_type === 'cross_update').length,
  };

  return (
    <AdminPage
      eyebrow="AI Agent Roster"
      title="Agent Activity Log"
      subtitle="System-wide stream of triggers, actions, escalations, failed automations, approval waits, and cross-system updates across all AI agents."
      accent="#06B6D4"
      actions={<Pill color="#06B6D4" label="LIVE FEED" glow />}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatTile label="Total Events"    value={totals.total}       color="#06B6D4" icon={Activity}     />
        <StatTile label="Triggers"        value={totals.triggers}    color="#06B6D4" icon={Zap}          />
        <StatTile label="Escalations"     value={totals.escalations} color="#F59E0B" icon={AlertTriangle}/>
        <StatTile label="Failures"        value={totals.failures}    color="#EF4444" icon={AlertCircle}  />
        <StatTile label="Approval Waits"  value={totals.waits}       color="#EC4899" icon={CheckCircle2} />
        <StatTile label="Cross Updates"   value={totals.cross}       color="#10B981" icon={Activity}     />
      </div>

      <AdminCard
        title="Filters"
        accent="#06B6D4"
        right={
          <div className="flex items-center gap-1.5 flex-wrap max-w-3xl">
            <Filter className="w-3 h-3 text-white/25" />
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Event</span>
            <Chip active={eventFilter === 'all'} onClick={() => setEventFilter('all')} label="ALL" color="#64748B" />
            {EVENT_TYPES.map(t => (
              <Chip key={t} active={eventFilter === t} onClick={() => setEventFilter(t)} label={EVENT_LABEL[t]} color="#06B6D4" />
            ))}
          </div>
        }
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Severity</span>
          {['all', 'info', 'warn', 'critical', 'success'].map(s => (
            <Chip key={s} active={severityFilter === s} onClick={() => setSeverityFilter(s)} label={s.toUpperCase()}
              color={s === 'all' ? '#64748B' : SEVERITY_COLOR[s as keyof typeof SEVERITY_COLOR] ?? '#06B6D4'} />
          ))}
          <span className="w-px h-3 bg-white/10 mx-1" />
          <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Agent</span>
          <select
            value={agentFilter}
            onChange={e => setAgentFilter(e.target.value)}
            className="bg-[#0B0C0F] border border-white/[0.08] rounded px-2 py-0.5 text-[10px] font-mono text-white/70 focus:outline-none"
          >
            <option value="all">ALL AGENTS</option>
            {agents.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
          <span className="ml-auto text-[10px] font-mono text-white/45">
            Showing <span className="text-white/80 font-semibold">{filtered.length}</span> of {activity.length}
          </span>
        </div>
      </AdminCard>

      <AdminCard title="Live Activity Stream" sub="Ordered by occurrence · most recent first" accent="#06B6D4">
        {loading ? (
          <div className="py-8 text-center text-[11px] font-mono text-white/30">Loading activity…</div>
        ) : (
          <div className="space-y-0.5 max-h-[680px] overflow-y-auto pr-1">
            {filtered.map(ev => {
              const agent = agentMap.get(ev.agent_slug);
              const c = SEVERITY_COLOR[ev.severity];
              return (
                <div key={ev.id} className="flex items-start gap-3 py-2 px-3 rounded hover:bg-white/[0.02] border border-transparent hover:border-white/[0.05]">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: c, boxShadow: `0 0 7px ${c}` }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Pill color={c} label={EVENT_LABEL[ev.event_type]} />
                      {agent && (
                        <Link to={`/dashboard/admin-os/agents/${agent.slug}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded hover:brightness-125"
                          style={{ color: agent.color, background: `${agent.color}14`, border: `1px solid ${agent.color}30` }}>
                          <Brain className="w-2.5 h-2.5" /> {agent.name}
                        </Link>
                      )}
                      {ev.entity_label && (
                        <span className="text-[9.5px] font-mono text-white/45 tracking-wider uppercase">
                          {ev.entity_type} · {ev.entity_label}
                        </span>
                      )}
                      <span className="ml-auto text-[9.5px] font-mono text-white/30">{relativeTime(ev.occurred_at)}</span>
                    </div>
                    <div className="text-[11.5px] text-white/85">{ev.summary}</div>
                    {ev.detail && <div className="text-[10px] text-white/45 mt-0.5 leading-snug">{ev.detail}</div>}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-[11px] font-mono text-white/30">No events match current filters.</div>
            )}
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
