import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Mail, CheckCircle, Clock, AlertCircle, Cpu,
  ChevronDown, ChevronUp, Zap, Activity, UserCheck,
  Crown, Settings, TrendingUp, Disc, BarChart2, Compass,
  Megaphone, Calendar, Check, Loader,
} from 'lucide-react';
import OperatorTeamGrid from '../components/artistOS/OperatorTeamGrid';
import { useRole } from '../../auth/RoleContext';
import { ROLE_PERMISSIONS, type ArtistOSRole } from '../../auth/roles';
import { SPIN_ROSTER, SPIN_TEAM } from '../data/spinRecordsContext';
import {
  fetchAgents, fetchAllAgentAssignments, fetchAllTasks,
  assignAgentToArtist, removeAgentFromArtist, updateTaskStatus,
  buildAgentStats, AGENT_LEVEL_META, AGENT_STATUS_META, STATIC_TASKS,
  type AIAgentWithStats, type AIAgentAssignment, type AIAgentTask, type TaskStatus,
} from '../data/aiAgentService';

const ICON_COMPONENTS: Record<string, React.ElementType> = {
  crown: Crown, calendar: Calendar, users: Users, zap: Zap, settings: Settings,
  megaphone: Megaphone, disc: Disc, 'bar-chart': BarChart2, compass: Compass,
};

function AgentIcon({ iconKey, size = 14, color }: { iconKey: string; size?: number; color?: string }) {
  const Comp = ICON_COMPONENTS[iconKey] ?? Cpu;
  return <Comp size={size} color={color} />;
}



const DEPT_COLORS: Record<string, string> = {
  'Artist Relations': '#06B6D4', 'A&R': '#F59E0B', Marketing: '#10B981', International: '#EC4899',
};

const PRIORITY_COLORS: Record<string, string> = { High: '#EF4444', Medium: '#F59E0B', Low: '#6B7280' };
const STATUS_COLORS:   Record<string, string> = { Open: '#EF4444', 'In Progress': '#F59E0B', Done: '#10B981' };

function PulsingDot({ color }: { color: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.4, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
      <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
    </span>
  );
}

const OPERATOR_META: Record<string, {
  tierLabel: string;
  status: string;
  currentAssignment: string;
  latestActivity: string;
  recommendedAction: string;
}> = {
  apex:  { tierLabel: 'Elite Artist Rep',   status: 'Active',           currentAssignment: 'Aligning Q2 release and partnership priorities',           latestActivity: 'Escalated release sequencing conflict between campaign spend and editorial timing',    recommendedAction: 'Approve updated release path' },
  velar: { tierLabel: 'Release Strategy',   status: 'Release Active',   currentAssignment: 'Managing release architecture for Move Along Deluxe',       latestActivity: 'Identified metadata and approval gaps blocking submission',                           recommendedAction: 'Review submission blocker list' },
  mira:  { tierLabel: 'Audience Growth',    status: 'Running Campaign', currentAssignment: 'Monitoring audience growth in LATAM and high-affinity segments', latestActivity: 'Detected conversion lift in Brazil creator cluster',                               recommendedAction: 'Activate growth expansion' },
  flux:  { tierLabel: 'Growth Operator',    status: 'Running Campaign', currentAssignment: 'Optimizing spend and momentum transfer',                     latestActivity: 'Flagged underperforming EU campaign and suggested budget reallocation',               recommendedAction: 'Approve reallocation' },
  axiom: { tierLabel: 'Artist Operations',  status: 'Active',           currentAssignment: 'Coordinating cross-functional execution',                    latestActivity: 'Detected 3 unresolved release dependencies',                                         recommendedAction: 'Open operations queue' },
  forge: { tierLabel: 'Marketing Systems',  status: 'Running Campaign', currentAssignment: 'Managing release marketing systems',                         latestActivity: 'Queued paid media and channel distribution sequence',                                 recommendedAction: 'Launch campaign workflow' },
  sol:   { tierLabel: 'Catalog & Content',  status: 'Active',           currentAssignment: 'Routing content and catalog alignment',                      latestActivity: 'Scheduled post-release content sequence and updated asset map',                       recommendedAction: 'Approve content plan' },
  lyric: { tierLabel: 'Performance',        status: 'Monitoring',       currentAssignment: 'Monitoring pacing and performance signals',                  latestActivity: 'Detected drop in content rhythm and weaker engagement cadence',                       recommendedAction: 'Adjust publishing cadence' },
  rune:  { tierLabel: 'Career Direction',   status: 'Monitoring',       currentAssignment: 'Tracking long-range positioning',                            latestActivity: 'Flagged timing conflict between short-term campaign push and larger catalog strategy', recommendedAction: 'Review strategic priority' },
};

const OP_STATUS_COLORS: Record<string, string> = {
  'Active':            '#10B981',
  'Monitoring':        '#06B6D4',
  'Running Campaign':  '#F59E0B',
  'Release Active':    '#EC4899',
  'Standby':           'rgba(255,255,255,0.25)',
};

function AgentCard({ agent }: { agent: AIAgentWithStats }) {
  const levelMeta  = AGENT_LEVEL_META[agent.level]  ?? AGENT_LEVEL_META['Junior'];
  const statusMeta = AGENT_STATUS_META[agent.status] ?? AGENT_STATUS_META['deployed'];
  const opMeta = OPERATOR_META[agent.slug] ?? null;
  const opStatus = opMeta?.status ?? 'Active';
  const opStatusColor = OP_STATUS_COLORS[opStatus] || '#10B981';

  return (
    <div style={{
      background: '#0D0E11', border: `1px solid ${agent.color}20`,
      borderLeft: `2px solid ${agent.color}35`,
      borderRadius: 14, padding: '16px 18px', position: 'relative', overflow: 'hidden',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${agent.color}40`; (e.currentTarget as HTMLDivElement).style.borderLeft = `2px solid ${agent.color}70`; (e.currentTarget as HTMLDivElement).style.background = `${agent.color}05`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${agent.color}20`; (e.currentTarget as HTMLDivElement).style.borderLeft = `2px solid ${agent.color}35`; (e.currentTarget as HTMLDivElement).style.background = '#0D0E11'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${agent.color}60,transparent)` }} />

      {/* Identity row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: `${agent.color}15`, border: `1px solid ${agent.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AgentIcon iconKey={agent.icon_key} size={17} color={agent.color} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', lineHeight: 1.2 }}>{agent.name}</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 20, background: levelMeta.bg, color: levelMeta.color }}>{opMeta?.tierLabel ?? levelMeta.label}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: opStatusColor, boxShadow: `0 0 6px ${opStatusColor}` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: opStatusColor }}>{opStatus}</span>
        </div>
      </div>

      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5, marginBottom: 10 }}>{agent.role}</p>

      {/* Capabilities */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {(agent.capabilities ?? []).slice(0, 3).map(cap => (
          <span key={cap} style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 6px', borderRadius: 20, background: `${agent.color}10`, border: `1px solid ${agent.color}20`, color: agent.color }}>{cap}</span>
        ))}
      </div>

      {/* Execution layer */}
      {opMeta && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
            <div style={{ padding: '6px 9px', background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 7 }}>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7, color: `${agent.color}70`, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Current Assignment</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45 }}>{opMeta.currentAssignment}</p>
            </div>
            <div style={{ padding: '6px 9px', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.08)', borderRadius: 7 }}>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7, color: 'rgba(239,68,68,0.55)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Latest Activity</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.48)', lineHeight: 1.45 }}>{opMeta.latestActivity}</p>
            </div>
          </div>
          <div style={{ marginBottom: 10, padding: '6px 10px', background: `${agent.color}08`, border: `1px solid ${agent.color}20`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: agent.color, boxShadow: `0 0 5px ${agent.color}`, flexShrink: 0 }} />
            <div>
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${agent.color}70`, textTransform: 'uppercase', letterSpacing: '0.1em', marginRight: 5 }}>Recommended Action</span>
              <span style={{ fontSize: 9, fontWeight: 600, color: agent.color }}>{opMeta.recommendedAction}</span>
            </div>
          </div>
        </>
      )}

      {/* Stats + action footer */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: agent.color, lineHeight: 1 }}>{(agent.assignedArtistIds ?? []).length}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>Artists</div>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#F59E0B', lineHeight: 1 }}>{agent.activeTasks}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>Active Tasks</div>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
          <PulsingDot color={statusMeta.dot} />
        </div>
      </div>
    </div>
  );
}

export default function ArtistOSTeam() {
  const navigate = useNavigate();
  const { roleState } = useRole();

  const [agents, setAgents]         = useState<AIAgentWithStats[]>([]);
  const [assignments, setAssignments] = useState<AIAgentAssignment[]>([]);
  const [tasks, setTasks]           = useState<AIAgentTask[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  const [assigning, setAssigning]   = useState<string | null>(null);
  const [taskUpdating, setTaskUpdating] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const currentRole = (roleState.role ?? 'artist_manager') as ArtistOSRole;
  const perms = ROLE_PERMISSIONS[currentRole];

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAgents(), fetchAllAgentAssignments(), fetchAllTasks()])
      .then(([rawAgents, rawAssignments, rawTasks]) => {
        const safeAgents = rawAgents ?? [];
        const safeAssignments = rawAssignments ?? [];
        const combined = (rawTasks ?? []).length > 0 ? rawTasks : STATIC_TASKS;
        setAgents(buildAgentStats(safeAgents, safeAssignments, combined));
        setAssignments(safeAssignments);
        setTasks(combined);
        setLoading(false);
      })
      .catch(() => {
        setAgents(buildAgentStats([], [], STATIC_TASKS));
        setAssignments([]);
        setTasks(STATIC_TASKS);
        setLoading(false);
      });
  }, [refreshKey]);

  async function toggleAgent(agentId: string, artistId: string) {
    const key = `${agentId}-${artistId}`;
    setAssigning(key);
    const isAssigned = assignments.some(a => a.agent_id === agentId && a.artist_id === artistId && a.active);
    if (isAssigned) {
      await removeAgentFromArtist(agentId, artistId);
      setAssignments(prev => prev.filter(a => !(a.agent_id === agentId && a.artist_id === artistId)));
    } else {
      await assignAgentToArtist(agentId, artistId, 'admin');
      setAssignments(prev => [...prev, { id: `tmp-${Date.now()}`, agent_id: agentId, artist_id: artistId, assigned_at: new Date().toISOString(), assigned_by: 'admin', active: true }]);
    }
    setAssigning(null);
    setRefreshKey(k => k + 1);
  }

  async function handleTaskStatus(taskId: string, next: TaskStatus) {
    setTaskUpdating(taskId);
    await updateTaskStatus(taskId, next);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: next } : t));
    setTaskUpdating(null);
  }

  function getArtistAgents(artistId: string): AIAgentWithStats[] {
    const ids = assignments.filter(a => a.artist_id === artistId && a.active).map(a => a.agent_id);
    return agents.filter(a => ids.includes(a.id));
  }

  const openTasks    = tasks.filter(t => t.status !== 'Done');
  const eliteAgents  = agents.filter(a => a.level === 'Elite');
  const seniorAgents = agents.filter(a => a.level === 'Senior');
  const juniorAgents = agents.filter(a => a.level === 'Junior');

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '20px 22px' }}>
      <style>{`
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} color="#06B6D4" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Team</h1>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>AI Agents + Human Team · <span style={{ color: '#F59E0B' }}>SPIN Records</span></p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{agents.length} AI Agents</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
            <PulsingDot color="#10B981" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981' }}>System Operational</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: OPEN TASKS ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <AlertCircle size={13} color="#EF4444" />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Open Tasks</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 7px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>{openTasks.length}</span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Loading...</div>
        ) : openTasks.map((task, i) => {
          const pc = PRIORITY_COLORS[task.priority] ?? '#6B7280';
          const sc = STATUS_COLORS[task.status] ?? '#6B7280';
          const agentOwner = task.agent_id ? agents.find(a => a.id === task.agent_id) : null;
          const isUpdating = taskUpdating === task.id;
          return (
            <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < openTasks.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: sc, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 2 }}>{task.title}</div>
                <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', display: 'flex', gap: 10 }}>
                  {agentOwner && <span style={{ color: agentOwner.color }}>— {agentOwner.name}</span>}
                  {task.due_date && <span>Due {task.due_date}</span>}
                  <span style={{ color: sc }}>{task.status}</span>
                </div>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: `${pc}12`, border: `1px solid ${pc}25`, color: pc, flexShrink: 0 }}>{task.priority}</span>
              {perms.canManageSystem && (
                <button
                  onClick={() => {
                    const next: TaskStatus = task.status === 'Open' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'Open';
                    handleTaskStatus(task.id, next);
                  }}
                  style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  {isUpdating ? <Loader size={10} color="#F59E0B" style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={10} color="rgba(255,255,255,0.2)" />}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── SECTION 2: ARTISTS with AI + Human Team ── */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <UserCheck size={13} color="#06B6D4" />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Artists — AI + Human Team</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 7px', borderRadius: 20, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#06B6D4' }}>{SPIN_ROSTER.length}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, padding: '1px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)', color: '#F59E0B' }}>SPIN Records</span>
        </div>
        {SPIN_ROSTER.map((artist, i) => {
          const artistAgents = getArtistAgents(artist.id);
          const humanManager = SPIN_TEAM.find(t => t.artist === artist.name && t.role.includes('Manager'));
          const isExpanded = expandedArtist === artist.id;
          return (
            <div key={artist.id} style={{ borderBottom: i < SPIN_ROSTER.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div
                onClick={() => setExpandedArtist(isExpanded ? null : artist.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', cursor: 'pointer', transition: 'background 0.12s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: artist.avatarColor }}>{artist.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 1 }}>{artist.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{artist.genre}</div>
                </div>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0 }}>
                  {artistAgents.length === 0 ? (
                    <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>No AI agents</span>
                  ) : (
                    <>
                      {artistAgents.slice(0, 4).map(agent => (
                        <div key={agent.id} title={agent.name} style={{ width: 22, height: 22, borderRadius: 6, background: `${agent.color}15`, border: `1px solid ${agent.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <AgentIcon iconKey={agent.icon_key} size={10} color={agent.color} />
                        </div>
                      ))}
                      {artistAgents.length > 4 && <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>+{artistAgents.length - 4}</span>}
                    </>
                  )}
                </div>
                <div style={{ flexShrink: 0, marginLeft: 8 }}>
                  {humanManager
                    ? <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{humanManager.name}</span>
                    : <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444' }}>No manager</span>
                  }
                </div>
                {isExpanded ? <ChevronUp size={12} color="rgba(255,255,255,0.25)" /> : <ChevronDown size={12} color="rgba(255,255,255,0.25)" />}
              </div>

              {isExpanded && (
                <div style={{ padding: '0 18px 16px 60px', background: 'rgba(0,0,0,0.12)' }}>
                  <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Agent Coverage</div>
                  {perms.canManageSystem ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {agents.map(agent => {
                        const isAssigned = assignments.some(a => a.agent_id === agent.id && a.artist_id === artist.id && a.active);
                        const key = `${agent.id}-${artist.id}`;
                        const isSaving = assigning === key;
                        return (
                          <div
                            key={agent.id}
                            onClick={() => !isSaving && toggleAgent(agent.id, artist.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, cursor: 'pointer', background: isAssigned ? `${agent.color}10` : 'rgba(255,255,255,0.03)', border: `1px solid ${isAssigned ? `${agent.color}28` : 'rgba(255,255,255,0.07)'}`, transition: 'all 0.15s' }}
                          >
                            <AgentIcon iconKey={agent.icon_key} size={10} color={isAssigned ? agent.color : 'rgba(255,255,255,0.3)'} />
                            <span style={{ fontSize: 10, color: isAssigned ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)' }}>{agent.name}</span>
                            {isSaving
                              ? <Loader size={9} color={agent.color} style={{ animation: 'spin 1s linear infinite' }} />
                              : isAssigned ? <Check size={9} color={agent.color} /> : null
                            }
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {artistAgents.length === 0
                        ? <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>No AI agents assigned</span>
                        : artistAgents.map(agent => (
                            <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: `${agent.color}10`, border: `1px solid ${agent.color}25` }}>
                              <AgentIcon iconKey={agent.icon_key} size={10} color={agent.color} />
                              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>{agent.name}</span>
                              <span style={{ fontFamily: 'monospace', fontSize: 8, color: agent.color }}>{agent.role.split(',')[0]}</span>
                            </div>
                          ))
                      }
                    </div>
                  )}

                  <div style={{ marginTop: 12, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Human Team</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {SPIN_TEAM.filter(m => m.artist === artist.name).length === 0
                      ? <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>No human team assigned</span>
                      : SPIN_TEAM.filter(m => m.artist === artist.name).map(member => (
                          <div key={member.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 9px', borderRadius: 8, background: `${DEPT_COLORS[member.dept] ?? '#6B7280'}10`, border: `1px solid ${DEPT_COLORS[member.dept] ?? '#6B7280'}20` }}>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{member.name}</span>
                            <span style={{ fontFamily: 'monospace', fontSize: 8, color: DEPT_COLORS[member.dept] ?? '#6B7280' }}>{member.role}</span>
                          </div>
                        ))
                    }
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/dashboard/artist-os/roster/${artist.id}`); }}
                    style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#06B6D4', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    View Artist Profile →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── SECTION 3: GMG TEAM ── */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Cpu size={13} color="#F59E0B" />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Operator Team</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', color: '#10B981' }}>9 Operators · Live</span>
        </div>
        <OperatorTeamGrid variant="artist" />
      </div>

      {/* Human Team */}
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={13} color="rgba(255,255,255,0.4)" />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Human Team ({SPIN_TEAM.length})</span>
        </div>
        {SPIN_TEAM.map((member, i) => {
          const dc = DEPT_COLORS[member.dept] ?? '#6B7280';
          const rosterArtist = SPIN_ROSTER.find(a => a.name === member.artist);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderBottom: i < SPIN_TEAM.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{member.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 1 }}>{member.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{member.role}</div>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: `${dc}12`, border: `1px solid ${dc}25`, color: dc, flexShrink: 0 }}>{member.dept}</span>
              {rosterArtist && (
                <div title={rosterArtist.name} style={{ width: 20, height: 20, borderRadius: 5, background: `${rosterArtist.avatarColor}20`, border: `1px solid ${rosterArtist.avatarColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 7, fontWeight: 700, color: rosterArtist.avatarColor }}>{rosterArtist.initials}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                <Mail size={12} />
                <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{member.email}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
