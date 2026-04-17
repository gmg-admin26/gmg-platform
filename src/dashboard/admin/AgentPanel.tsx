import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Activity, AlertCircle, ChevronRight, Pause, ShieldCheck, Link2 } from 'lucide-react';
import {
  Agent, AgentAssignment, AgentActivity,
  fetchAgents, fetchAssignments, fetchActivity,
  STATUS_COLOR, SEVERITY_COLOR, PRIORITY_COLOR, EVENT_LABEL, relativeTime,
} from './adminAgentService';
import { AdminCard, Pill } from './shared';

interface Props {
  title?: string;
  entityType?: string;
  entityId?: string;
  agentSlugs?: string[];
  accent?: string;
  maxActivity?: number;
  showActions?: boolean;
}

export default function AgentPanel({
  title = 'AI Agents On This',
  entityType,
  entityId,
  agentSlugs,
  accent = '#06B6D4',
  maxActivity = 5,
  showActions = true,
}: Props) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [assignments, setAssignments] = useState<AgentAssignment[]>([]);
  const [activity, setActivity] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [all, asg, act] = await Promise.all([
        fetchAgents(),
        fetchAssignments(entityType ? { entityType, entityId } : {}),
        fetchActivity({ entityType, entityId, limit: maxActivity }),
      ]);
      setAgents(all);
      setAssignments(asg);
      setActivity(act);
      setLoading(false);
    })();
  }, [entityType, entityId, maxActivity]);

  const filteredAssignments = agentSlugs
    ? assignments.filter(a => agentSlugs.includes(a.agent_slug))
    : assignments;

  const agentMap = new Map(agents.map(a => [a.slug, a]));
  const involvedSlugs = Array.from(new Set([
    ...filteredAssignments.map(a => a.agent_slug),
    ...(agentSlugs ?? []),
  ]));
  const involved = involvedSlugs.map(s => agentMap.get(s)).filter(Boolean) as Agent[];

  const blockerCount = filteredAssignments.filter(a => a.status === 'blocked' || a.blocker).length;
  const activeCount = filteredAssignments.filter(a => a.status === 'active').length;

  return (
    <AdminCard
      title={title}
      sub={`${involved.length} agent${involved.length === 1 ? '' : 's'} · ${activeCount} active · ${blockerCount} blocked`}
      accent={accent}
      right={<Pill color="#06B6D4" label="AI OPS" glow />}
    >
      {loading ? (
        <div className="py-6 text-center text-[11px] font-mono text-white/30">Loading agent activity…</div>
      ) : involved.length === 0 ? (
        <div className="py-6 text-center text-[11px] font-mono text-white/30">No agents currently assigned to this entity.</div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {involved.map(agent => {
              const agentAssignments = filteredAssignments.filter(a => a.agent_slug === agent.slug);
              const primary = agentAssignments[0];
              return (
                <Link
                  key={agent.slug}
                  to={`/dashboard/admin-os/agents/${agent.slug}`}
                  className="group rounded-lg border border-white/[0.07] bg-[#0E0F12] p-2.5 hover:border-white/[0.16] transition-all"
                  style={{ boxShadow: `inset 0 0 0 1px ${agent.color}06` }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ background: `${agent.color}14`, border: `1px solid ${agent.color}30` }}>
                      <Brain className="w-3 h-3" style={{ color: agent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-semibold text-white/90 truncate">{agent.name}</div>
                      <div className="text-[9px] font-mono text-white/35 tracking-wider uppercase truncate">{agent.role}</div>
                    </div>
                    <Pill color={STATUS_COLOR[agent.status]} label={agent.status.toUpperCase()} glow={agent.status === 'active'} />
                  </div>
                  {primary && (
                    <div className="pl-8">
                      <div className="text-[10.5px] text-white/65 leading-snug line-clamp-2">{primary.next_action}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Pill color={PRIORITY_COLOR[primary.priority]} label={primary.priority.toUpperCase()} />
                        {primary.blocker && <Pill color="#EF4444" label={`BLOCKED · ${primary.blocker}`} />}
                        <span className="ml-auto text-[9px] font-mono text-white/35">{primary.progress_pct}%</span>
                      </div>
                      <div className="h-[2px] mt-1 rounded bg-white/[0.04] overflow-hidden">
                        <div className="h-full" style={{ width: `${primary.progress_pct}%`, background: agent.color }} />
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {activity.length > 0 && (
            <div className="pt-2 border-t border-white/[0.05]">
              <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1.5">Recent Agent Activity</div>
              <div className="space-y-0.5">
                {activity.map(ev => {
                  const agent = agentMap.get(ev.agent_slug);
                  const c = SEVERITY_COLOR[ev.severity];
                  return (
                    <div key={ev.id} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02]">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: c, boxShadow: `0 0 5px ${c}` }} />
                      <span className="text-[10px] font-mono tracking-wider shrink-0" style={{ color: c }}>
                        {EVENT_LABEL[ev.event_type]}
                      </span>
                      <span className="text-[10.5px] text-white/75 flex-1 truncate">
                        <span className="text-white/50">{agent?.name ?? ev.agent_slug}</span> · {ev.summary}
                      </span>
                      <span className="text-[9.5px] font-mono text-white/30 shrink-0">{relativeTime(ev.occurred_at)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {showActions && (
            <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
              <QuickAction icon={Pause} color="#F59E0B" label="Pause" />
              <QuickAction icon={ShieldCheck} color="#10B981" label="Approve Queue" />
              <QuickAction icon={Link2} color="#06B6D4" label="Reassign" />
              <QuickAction icon={AlertCircle} color="#EF4444" label="Escalate" />
              <Link
                to="/dashboard/admin-os/agents/assignments"
                className="ml-auto inline-flex items-center gap-1 text-[10px] font-mono text-white/40 hover:text-white/70 tracking-wider uppercase"
              >
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </AdminCard>
  );
}

function QuickAction({ icon: Icon, color, label }: { icon: React.ComponentType<{ className?: string }>; color: string; label: string }) {
  return (
    <button
      onClick={() => alert(`${label} — human override applied`)}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[9.5px] font-mono tracking-wider uppercase transition-all hover:brightness-125"
      style={{ color, background: `${color}10`, borderColor: `${color}28` }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

export function AIOperationsStatus() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activity, setActivity] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [ag, act] = await Promise.all([fetchAgents(), fetchActivity({ limit: 8 })]);
      setAgents(ag);
      setActivity(act);
      setLoading(false);
    })();
  }, []);

  const active = agents.filter(a => a.status === 'active').length;
  const blocked = agents.filter(a => a.status === 'blocked').length;
  const escalations = agents.reduce((acc, a) => acc + a.escalations, 0);
  const criticalEvents = activity.filter(a => a.severity === 'critical' || a.severity === 'warn').slice(0, 5);

  return (
    <AdminCard
      title="AI Operations Status"
      sub="Live view of the AI workforce operating across GMG"
      accent="#06B6D4"
      right={<Pill color="#10B981" label={`${active} LIVE`} glow />}
    >
      {loading ? (
        <div className="py-6 text-center text-[11px] font-mono text-white/30">Loading AI ops…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-1 space-y-2">
            <StatLine label="Agents Active"      value={active}       color="#10B981" />
            <StatLine label="Agents Blocked"     value={blocked}      color="#EF4444" />
            <StatLine label="Escalations Open"   value={escalations}  color="#F59E0B" />
            <StatLine label="Last 24h Outputs"   value={activity.length} color="#06B6D4" />
          </div>
          <div className="lg:col-span-2">
            <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1.5">Critical Agent Events</div>
            <div className="space-y-0.5">
              {criticalEvents.length === 0 ? (
                <div className="text-[11px] font-mono text-white/35 py-3 text-center">All agents clear. No critical events.</div>
              ) : criticalEvents.map(ev => {
                const agent = agents.find(a => a.slug === ev.agent_slug);
                const c = SEVERITY_COLOR[ev.severity];
                return (
                  <Link
                    key={ev.id}
                    to={`/dashboard/admin-os/agents/${ev.agent_slug}`}
                    className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                    <Pill color={c} label={EVENT_LABEL[ev.event_type]} />
                    <span className="text-[11px] text-white/80 flex-1 truncate">
                      <span className="text-white/55">{agent?.name}</span> · {ev.summary}
                    </span>
                    <span className="text-[9.5px] font-mono text-white/30 shrink-0">{relativeTime(ev.occurred_at)}</span>
                    <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AdminCard>
  );
}

function StatLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md border border-white/[0.05] bg-[#0E0F12]">
      <span className="text-[10px] font-mono text-white/45 tracking-wider uppercase">{label}</span>
      <span className="text-[18px] font-bold tracking-tight" style={{ color }}>{value}</span>
    </div>
  );
}
