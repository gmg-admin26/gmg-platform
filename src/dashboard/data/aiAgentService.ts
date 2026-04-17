import { supabase } from '../../lib/supabase';

export type AgentLevel = 'Elite' | 'Senior' | 'Junior';
export type AgentStatus = 'deployed' | 'standby' | 'inactive';
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Open' | 'In Progress' | 'Done';

export interface AIAgent {
  id: string;
  slug: string;
  name: string;
  role: string;
  level: AgentLevel;
  status: AgentStatus;
  color: string;
  icon_key: string;
  capabilities: string[];
  description: string;
  created_at: string;
}

export interface AIAgentAssignment {
  id: string;
  agent_id: string;
  artist_id: string;
  assigned_at: string;
  assigned_by: string;
  active: boolean;
}

export interface AIAgentTask {
  id: string;
  agent_id: string | null;
  artist_id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface AIAgentWithStats extends AIAgent {
  assignedArtistIds: string[];
  activeTasks: number;
}

export const AGENT_LEVEL_META: Record<AgentLevel, { label: string; color: string; bg: string; rank: number }> = {
  Elite:  { label: 'Elite',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  rank: 1 },
  Senior: { label: 'Senior', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   rank: 2 },
  Junior: { label: 'Junior', color: '#10B981', bg: 'rgba(16,185,129,0.1)',  rank: 3 },
};

export const AGENT_STATUS_META: Record<AgentStatus, { label: string; color: string; dot: string }> = {
  deployed: { label: 'Deployed', color: '#10B981', dot: '#10B981' },
  standby:  { label: 'Standby',  color: '#F59E0B', dot: '#F59E0B' },
  inactive: { label: 'Inactive', color: '#6B7280', dot: '#6B7280' },
};

const ICON_MAP: Record<string, string> = {
  crown: '♛', calendar: '◈', users: '◉', zap: '⚡', settings: '⚙',
  megaphone: '◀', disc: '◎', 'bar-chart': '▦', compass: '◇',
};
export function agentIconEmoji(key: string): string {
  return ICON_MAP[key] ?? '◆';
}

export const FALLBACK_AGENTS: AIAgent[] = [
  { id: 'apex', slug: 'apex', name: 'Apex', role: 'High-level strategy, system alignment, long-term direction', level: 'Elite', status: 'deployed', color: '#F59E0B', icon_key: 'crown', capabilities: ['Strategic Oversight','System Alignment','Long-Term Direction','Priority Setting'], description: 'Primary strategic lead for all Artist OS operations.', created_at: '' },
  { id: 'velar', slug: 'velar', name: 'Velar', role: 'Campaign architecture, rollout timing, release planning', level: 'Senior', status: 'deployed', color: '#06B6D4', icon_key: 'calendar', capabilities: ['Release Planning','Campaign Architecture','Rollout Timing','Launch Strategy'], description: 'Owns release strategy from concept to execution.', created_at: '' },
  { id: 'mira', slug: 'mira', name: 'Mira', role: 'Audience development, fan engagement, growth systems', level: 'Senior', status: 'deployed', color: '#10B981', icon_key: 'users', capabilities: ['Audience Development','Fan Engagement','Growth Systems','Community Building'], description: 'Specializes in audience intelligence and fan-to-community conversion.', created_at: '' },
  { id: 'flux', slug: 'flux', name: 'Flux', role: 'Cross-channel growth, momentum systems, execution alignment', level: 'Senior', status: 'deployed', color: '#EC4899', icon_key: 'zap', capabilities: ['Cross-Channel Growth','Momentum Systems','Execution Alignment','Platform Expansion'], description: 'Drives cross-platform expansion and momentum acceleration.', created_at: '' },
  { id: 'axiom', slug: 'axiom', name: 'Axiom', role: 'Day-to-day operations, coordination, execution consistency', level: 'Senior', status: 'deployed', color: '#8B5CF6', icon_key: 'settings', capabilities: ['Operations','Coordination','Execution Consistency','Workflow Management'], description: 'Manages the operational engine behind each artist.', created_at: '' },
  { id: 'forge', slug: 'forge', name: 'Forge', role: 'Marketing execution, amplification systems, visibility', level: 'Senior', status: 'deployed', color: '#EF4444', icon_key: 'megaphone', capabilities: ['Marketing Execution','Amplification Systems','Paid Media','Visibility Infrastructure'], description: 'Runs the marketing amplification layer.', created_at: '' },
  { id: 'sol', slug: 'sol', name: 'Sol', role: 'Content planning, catalog positioning, release alignment', level: 'Senior', status: 'deployed', color: '#22D3EE', icon_key: 'disc', capabilities: ['Content Planning','Catalog Positioning','Release Alignment','Asset Strategy'], description: 'Manages content and catalog strategy.', created_at: '' },
  { id: 'lyric', slug: 'lyric', name: 'Lyric', role: 'Performance tracking, engagement signals, optimization', level: 'Junior', status: 'deployed', color: '#84CC16', icon_key: 'bar-chart', capabilities: ['Performance Tracking','Engagement Signals','Data Optimization','Signal Analysis'], description: 'Monitors real-time performance data and engagement signals.', created_at: '' },
  { id: 'rune', slug: 'rune', name: 'Rune', role: 'Long-term decision support, prioritization, strategy guidance', level: 'Junior', status: 'deployed', color: '#F97316', icon_key: 'compass', capabilities: ['Career Direction','Decision Support','Prioritization','Strategy Guidance'], description: 'Provides long-term career direction and strategic prioritization.', created_at: '' },
];

export async function fetchAgents(): Promise<AIAgent[]> {
  const { data, error } = await supabase
    .from('ai_agents')
    .select('*')
    .order('level', { ascending: true });
  if (error || !data || data.length === 0) return FALLBACK_AGENTS;
  return data as AIAgent[];
}

export async function fetchAllAgentAssignments(): Promise<AIAgentAssignment[]> {
  const { data, error } = await supabase
    .from('ai_agent_assignments')
    .select('*')
    .eq('active', true);
  if (error) return [];
  return (data ?? []) as AIAgentAssignment[];
}

export async function fetchAssignmentsByArtist(artistId: string): Promise<AIAgentAssignment[]> {
  const { data, error } = await supabase
    .from('ai_agent_assignments')
    .select('*')
    .eq('artist_id', artistId)
    .eq('active', true);
  if (error) return [];
  return (data ?? []) as AIAgentAssignment[];
}

export async function fetchAgentTasks(agentId?: string, artistId?: string): Promise<AIAgentTask[]> {
  let query = supabase.from('ai_agent_tasks').select('*');
  if (agentId) query = query.eq('agent_id', agentId);
  if (artistId) query = query.eq('artist_id', artistId);
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as AIAgentTask[];
}

export async function fetchAllTasks(): Promise<AIAgentTask[]> {
  const { data, error } = await supabase
    .from('ai_agent_tasks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as AIAgentTask[];
}

export async function assignAgentToArtist(
  agentId: string,
  artistId: string,
  assignedBy = 'admin'
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('ai_agent_assignments')
    .upsert({
      agent_id: agentId,
      artist_id: artistId,
      assigned_by: assignedBy,
      active: true,
      assigned_at: new Date().toISOString(),
    }, { onConflict: 'agent_id,artist_id' });
  if (error) return { error: error.message };
  return { error: null };
}

export async function removeAgentFromArtist(
  agentId: string,
  artistId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('ai_agent_assignments')
    .update({ active: false })
    .eq('agent_id', agentId)
    .eq('artist_id', artistId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function upsertTask(task: Partial<AIAgentTask> & { title: string; artist_id: string }): Promise<{ error: string | null }> {
  const now = new Date().toISOString();
  const payload = { ...task, updated_at: now, created_at: task.created_at ?? now };
  const { error } = await supabase.from('ai_agent_tasks').upsert(payload);
  if (error) return { error: error.message };
  return { error: null };
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('ai_agent_tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId);
  if (error) return { error: error.message };
  return { error: null };
}

export function buildAgentStats(agents: AIAgent[], assignments: AIAgentAssignment[], tasks: AIAgentTask[]): AIAgentWithStats[] {
  return (agents ?? []).map(agent => ({
    ...agent,
    capabilities: agent.capabilities ?? [],
    assignedArtistIds: (assignments ?? []).filter(a => a.agent_id === agent.id && a.active).map(a => a.artist_id),
    activeTasks: (tasks ?? []).filter(t => t.agent_id === agent.id && t.status !== 'Done').length,
  }));
}

export const STATIC_TASKS: AIAgentTask[] = [
  { id: 'st-1', agent_id: null, artist_id: 'ZEAL', title: 'Approve Brazil ad budget for ZEAL', description: '', priority: 'High', status: 'Open', due_date: 'Apr 12', created_at: '', updated_at: '' },
  { id: 'st-2', agent_id: null, artist_id: 'Lila Daye', title: 'Book vocal production session — Lila Daye', description: '', priority: 'High', status: 'Open', due_date: 'Apr 14', created_at: '', updated_at: '' },
  { id: 'st-3', agent_id: null, artist_id: 'Mon Rovia', title: 'Assign manager to Mon Rovia', description: '', priority: 'Medium', status: 'In Progress', due_date: 'Apr 15', created_at: '', updated_at: '' },
  { id: 'st-4', agent_id: null, artist_id: 'Mako Sol', title: 'Campaign strategy session — Mako Sol', description: '', priority: 'Medium', status: 'Open', due_date: 'Apr 18', created_at: '', updated_at: '' },
  { id: 'st-5', agent_id: null, artist_id: 'Ayra Jae', title: 'Pitch Ayra Jae single to playlists', description: '', priority: 'High', status: 'In Progress', due_date: 'Apr 22', created_at: '', updated_at: '' },
  { id: 'st-6', agent_id: null, artist_id: 'Cato Strand', title: 'Recoupment review — Cato Strand', description: '', priority: 'Low', status: 'Open', due_date: 'Apr 30', created_at: '', updated_at: '' },
  { id: 'st-7', agent_id: null, artist_id: 'Sung Holly', title: 'Content calendar — Sung Holly', description: '', priority: 'Medium', status: 'In Progress', due_date: 'Apr 16', created_at: '', updated_at: '' },
];
