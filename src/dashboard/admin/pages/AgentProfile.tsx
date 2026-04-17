import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Activity, AlertCircle, Clock, Link2, Target, Zap, CheckCircle2,
  ArrowLeft, Power, Pause, ShieldCheck, Database, Workflow, AlertTriangle,
  BookOpen, GitBranch, UserCheck,
} from 'lucide-react';
import {
  Agent, AgentAssignment, AgentActivity, AgentCapability,
  fetchAgentBySlug, fetchAssignments, fetchActivity, fetchCapabilities,
  CATEGORY_META, STATUS_COLOR, SEVERITY_COLOR, PRIORITY_COLOR, EVENT_LABEL, relativeTime,
} from '../adminAgentService';
import { AdminPage, AdminCard, Pill, StatTile } from '../shared';

export default function AgentProfile({ slug }: { slug: string }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [assignments, setAssignments] = useState<AgentAssignment[]>([]);
  const [activity, setActivity] = useState<AgentActivity[]>([]);
  const [capabilities, setCapabilities] = useState<AgentCapability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [ag, asg, act, caps] = await Promise.all([
        fetchAgentBySlug(slug),
        fetchAssignments({ agentSlug: slug }),
        fetchActivity({ agentSlug: slug, limit: 30 }),
        fetchCapabilities(slug),
      ]);
      setAgent(ag);
      setAssignments(asg);
      setActivity(act);
      setCapabilities(caps);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return <AdminPage eyebrow="Agent Profile" title="Loading agent…" accent="#06B6D4">{null}</AdminPage>;
  }
  if (!agent) {
    return (
      <AdminPage eyebrow="Agent Profile" title="Agent Not Found" accent="#EF4444">
        <Link to="/dashboard/admin-os/agents" className="text-[11px] font-mono text-white/40 hover:text-white/70">← All Agents</Link>
      </AdminPage>
    );
  }

  const cat = CATEGORY_META[agent.category] ?? { label: agent.category, color: agent.color, description: '' };
  const statusColor = STATUS_COLOR[agent.status];

  const workflows   = capabilities.filter(c => c.capability_type === 'workflow');
  const triggers    = capabilities.filter(c => c.capability_type === 'trigger');
  const escalations = capabilities.filter(c => c.capability_type === 'escalation');
  const knowledge   = capabilities.filter(c => c.capability_type === 'knowledge');

  const active    = assignments.filter(a => a.status === 'active');
  const queued    = assignments.filter(a => a.status === 'queued');
  const blocked   = assignments.filter(a => a.status === 'blocked');
  const completed = assignments.filter(a => a.status === 'completed');

  return (
    <AdminPage
      eyebrow={`AI Agent · ${cat.label}`}
      title={agent.name}
      subtitle={agent.mission}
      accent={agent.color}
      actions={
        <div className="flex items-center gap-2">
          <Pill color={statusColor} label={agent.status.toUpperCase()} glow={agent.status === 'active'} />
          <Pill color={cat.color} label={cat.label.toUpperCase()} />
        </div>
      }
    >
      <Link to="/dashboard/admin-os/agents" className="inline-flex items-center gap-1 text-[11px] font-mono text-white/40 hover:text-white/70 tracking-wider">
        <ArrowLeft className="w-3 h-3" /> All Agents
      </Link>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatTile label="Active"      value={active.length}     color="#10B981" icon={Activity}    />
        <StatTile label="Queued"      value={queued.length}     color="#06B6D4" icon={Clock}       />
        <StatTile label="Blocked"     value={blocked.length}    color="#EF4444" icon={AlertCircle} />
        <StatTile label="Completed"   value={completed.length}  color="#64748B" icon={CheckCircle2}/>
        <StatTile label="Actions 7d"  value={activity.length}   color={agent.color} icon={Zap}     />
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <AdminCard title="Identity" sub="Who this agent is" accent={agent.color}>
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${agent.color}1a`, border: `1px solid ${agent.color}40`, boxShadow: `0 0 20px ${agent.color}28` }}
            >
              <Brain className="w-6 h-6" style={{ color: agent.color }} />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold text-white/95">{agent.name}</div>
              <div className="text-[10px] font-mono text-white/40 tracking-wider uppercase">{agent.role}</div>
            </div>
          </div>
          <p className="text-[11.5px] text-white/70 leading-relaxed mb-3">{agent.mission}</p>
          <div className="space-y-1.5 text-[10.5px] font-mono pt-3 border-t border-white/[0.05]">
            <Row k="CATEGORY" v={cat.label} c={cat.color} />
            <Row k="STATUS"   v={agent.status.toUpperCase()} c={statusColor} />
            <Row k="SYSTEM"   v={agent.system.replace('_', ' ').toUpperCase()} c={agent.color} />
            <Row k="OWNER"    v={agent.human_override_owner} c="#F59E0B" />
            <Row k="ESCAL."   v={agent.escalation_level.toUpperCase()} c="#EC4899" />
          </div>
        </AdminCard>

        <AdminCard title="Specialties + Capabilities" sub="Workflows, triggers, escalations, knowledge" accent="#EC4899">
          {(agent.specialties ?? []).length > 0 && (
            <div className="flex items-center gap-1 flex-wrap mb-3 pb-3 border-b border-white/[0.05]">
              {agent.specialties.map((s, i) => (
                <span key={i} className="text-[9.5px] font-mono text-white/65 bg-white/[0.04] border border-white/[0.06] px-2 py-0.5 rounded tracking-wider">
                  {s}
                </span>
              ))}
            </div>
          )}
          <CapGroup icon={Workflow}      label="Workflows"   items={workflows}   color="#10B981" />
          <CapGroup icon={Zap}            label="Triggers"    items={triggers}    color="#06B6D4" />
          <CapGroup icon={AlertTriangle}  label="Escalations" items={escalations} color="#F59E0B" />
          <CapGroup icon={BookOpen}       label="Knowledge"   items={knowledge}   color="#EC4899" />
        </AdminCard>

        <AdminCard title="Systems + Data" sub="Where this agent operates" accent="#06B6D4">
          <div className="flex items-center gap-1 flex-wrap mb-3">
            <Pill color={agent.color} label={`SYSTEM: ${agent.system.replace('_', ' ').toUpperCase()}`} glow />
            <Pill color="#06B6D4" label="ADMIN OS" />
            <Pill color="#10B981" label="FINANCE FEEDS" />
            <Pill color="#EC4899" label="SIGNAL BOARD" />
            <Pill color="#F59E0B" label="LIVE SYSTEM FEED" />
          </div>
          <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1.5">Tables Used</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {tablesForAgent(agent.slug).map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-[9.5px] font-mono text-white/65 bg-[#0B0C0F] border border-white/[0.06] px-1.5 py-0.5 rounded">
                <Database className="w-2.5 h-2.5 text-white/35" /> {t}
              </span>
            ))}
          </div>
          <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1.5">Dependencies</div>
          <div className="flex flex-wrap gap-1">
            {dependenciesForAgent(agent.slug).map(d => (
              <span key={d} className="inline-flex items-center gap-1 text-[9.5px] font-mono text-white/65 bg-[#0B0C0F] border border-white/[0.06] px-1.5 py-0.5 rounded">
                <GitBranch className="w-2.5 h-2.5 text-white/35" /> {d}
              </span>
            ))}
          </div>
        </AdminCard>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AdminCard title="Assignments" sub={`${assignments.length} total · ${active.length} active · ${blocked.length} blocked`} accent="#EC4899">
          {assignments.length === 0 ? (
            <p className="text-[11px] text-white/35 font-mono py-4 text-center">No assignments yet.</p>
          ) : (
            <div className="space-y-1">
              {assignments.map(a => (
                <div key={a.id} className="rounded-md border border-white/[0.05] bg-[#0B0C0F] p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Pill color={STATUS_COLOR[a.status] ?? '#06B6D4'} label={a.status.toUpperCase()} />
                    <Pill color={PRIORITY_COLOR[a.priority]} label={a.priority.toUpperCase()} />
                    <span className="text-[10.5px] text-white/85 font-medium truncate">{a.entity_label}</span>
                    <span className="ml-auto text-[9px] font-mono text-white/30">{a.entity_type.toUpperCase()}</span>
                  </div>
                  <div className="text-[10.5px] text-white/60 leading-snug pl-1 line-clamp-2">{a.next_action}</div>
                  {a.blocker && (
                    <div className="mt-1 text-[10px] font-mono text-[#EF4444]">BLOCKED · {a.blocker}</div>
                  )}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-mono text-white/35">OWNER · {a.human_owner}</span>
                    <div className="flex-1 h-[2px] bg-white/[0.04] rounded overflow-hidden">
                      <div className="h-full" style={{ width: `${a.progress_pct}%`, background: agent.color }} />
                    </div>
                    <span className="text-[9px] font-mono text-white/40 w-8 text-right">{a.progress_pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard title="Activity Feed" sub="Recent outputs, alerts, escalations, actions taken" accent="#06B6D4">
          {activity.length === 0 ? (
            <p className="text-[11px] text-white/35 font-mono py-4 text-center">No recent activity.</p>
          ) : (
            <div className="space-y-0.5 max-h-[480px] overflow-y-auto pr-1">
              {activity.map(ev => {
                const c = SEVERITY_COLOR[ev.severity];
                return (
                  <div key={ev.id} className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-white/[0.02]">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Pill color={c} label={EVENT_LABEL[ev.event_type]} />
                        <span className="text-[9.5px] font-mono text-white/30">{relativeTime(ev.occurred_at)}</span>
                      </div>
                      <div className="text-[11px] text-white/80">{ev.summary}</div>
                      {ev.detail && <div className="text-[10px] text-white/45 mt-0.5 leading-snug">{ev.detail}</div>}
                      {ev.entity_label && <div className="text-[9px] font-mono text-white/35 mt-1 tracking-wider uppercase">{ev.entity_type} · {ev.entity_label}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AdminCard title="Training Layer" sub="Prompt grouping, approval logic (UI only)" accent="#F59E0B">
          <div className="space-y-1.5">
            <TrainingRow label="Training Notes Structure" value="Grouped by capability + approval tier" />
            <TrainingRow label="Prompt Grouping" value="Role · Mission · Guardrails · Task Templates" />
            <TrainingRow label="Approval Logic" value="Auto-execute below $1k · Human approval $1k+ · Paula sign-off $10k+" />
            <TrainingRow label="Output Quality Gate" value="Counsel + Anchor review on external comms" />
            <TrainingRow label="Kill-switch Owner" value={agent.human_override_owner} />
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            <div className="text-[9px] font-mono text-white/30 tracking-widest uppercase mb-1">System Prompt</div>
            <div className="text-[10px] font-mono text-white/30 italic">Redacted from UI by policy. Managed in secure ops layer.</div>
          </div>
        </AdminCard>

        <AdminCard title="Human Override Controls" sub={`Owner: ${agent.human_override_owner}`} accent={agent.color}>
          <div className="grid grid-cols-2 gap-2">
            <OverrideBtn icon={Pause}        color="#F59E0B" label="Pause Agent" />
            <OverrideBtn icon={Power}        color="#EF4444" label="Halt Agent"  />
            <OverrideBtn icon={ShieldCheck}  color="#10B981" label="Approve Queue" />
            <OverrideBtn icon={Link2}        color="#06B6D4" label="Re-assign Scope" />
            <OverrideBtn icon={Target}       color="#EC4899" label="Set Priority" />
            <OverrideBtn icon={UserCheck}    color={agent.color} label="Transfer Owner" />
          </div>
        </AdminCard>
      </section>
    </AdminPage>
  );
}

function Row({ k, v, c }: { k: string; v: string; c: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-white/30 w-20">{k}</span>
      <span style={{ color: c }}>{v}</span>
    </div>
  );
}

function CapGroup({ icon: Icon, label, items, color }: { icon: React.ComponentType<{ className?: string }>; label: string; items: AgentCapability[]; color: string }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color }}>{label}</span>
      </div>
      <div className="space-y-1 pl-4">
        {items.map(c => (
          <div key={c.id} className="border-l-2 pl-2 py-0.5" style={{ borderColor: `${color}40` }}>
            <div className="text-[11px] text-white/80">{c.label}</div>
            {c.detail && <div className="text-[9.5px] font-mono text-white/40 leading-snug mt-0.5">{c.detail}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrainingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-[10.5px] border-b border-white/[0.03] pb-1.5 last:border-0">
      <span className="text-white/30 font-mono tracking-wider uppercase w-40 shrink-0">{label}</span>
      <span className="text-white/75 flex-1">{value}</span>
    </div>
  );
}

function OverrideBtn({ icon: Icon, color, label }: { icon: React.ComponentType<{ className?: string }>; color: string; label: string }) {
  return (
    <button
      onClick={() => alert(`${label} — override applied`)}
      className="flex items-center gap-2 px-3 py-2 rounded-md border text-[11px] font-mono tracking-wider uppercase transition-all hover:brightness-125"
      style={{ color, background: `${color}08`, borderColor: `${color}28` }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}

function tablesForAgent(slug: string): string[] {
  const m: Record<string, string[]> = {
    ledger: ['finance_ledger', 'payouts', 'invoices'],
    vault: ['project_safes', 'reserves', 'capital_allocations'],
    shield: ['insurance_policies', 'coverage_events'],
    beacon: ['partner_pipeline', 'partner_inquiries'],
    stage: ['releases', 'release_readiness'],
    signalops: ['signals', 'live_system_events'],
    crest: ['culture_map', 'artist_brand_health'],
    anchor: ['project_safes', 'compliance_checks'],
    'paula-exec': ['exec_inbox', 'calendar'],
    'jacquelyn-exec': ['exec_inbox', 'briefings'],
    counsel: ['contracts', 'legal_reviews'],
    'contract-loop': ['contracts', 'pandadoc_loop'],
    'industry-marketing': ['campaigns', 'budgets'],
    'tour-manager': ['tour_dates', 'advances'],
    'store-manager': ['inventory', 'fulfillment'],
    'campus-manager': ['memberships', 'campus_billing'],
    'artist-account': ['artist_os_requests', 'artists'],
    'label-account': ['labels', 'catalog_clients'],
  };
  return m[slug] ?? ['admin_ai_agents', 'admin_agent_assignments', 'admin_agent_activity'];
}

function dependenciesForAgent(slug: string): string[] {
  const m: Record<string, string[]> = {
    ledger: ['Anchor', 'Vault'],
    vault: ['Ledger', 'Counsel'],
    shield: ['Anchor', 'Counsel'],
    beacon: ['Counsel', 'Paula Exec'],
    stage: ['Industry Marketing', 'Artist Account'],
    signalops: ['All Core'],
    crest: ['SignalOps'],
    anchor: ['Ledger', 'Vault', 'Shield'],
    'paula-exec': ['Jacquelyn Exec', 'All Core'],
    'jacquelyn-exec': ['Paula Exec'],
    counsel: ['Contract Loop', 'Anchor'],
    'contract-loop': ['Counsel'],
    'industry-marketing': ['Stage', 'Artist Account'],
    'tour-manager': ['Shield', 'Stage'],
    'store-manager': ['Ledger'],
    'campus-manager': ['Ledger'],
    'artist-account': ['Stage', 'Industry Marketing'],
    'label-account': ['Artist Account', 'Ledger'],
  };
  return m[slug] ?? ['SignalOps'];
}
