import { supabase } from '../../lib/supabase';

export type TaskSystem = 'admin_os' | 'artist_os' | 'catalog_os' | 'industry_os' | 'rocksteady';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'open' | 'in_progress' | 'blocked' | 'review' | 'completed' | 'cancelled';
export type AssigneeType = 'ai_operator' | 'human_team' | 'artist' | 'external';

export interface Task {
  id: string;
  title: string;
  description?: string;
  linked_system: TaskSystem;
  linked_entity_id?: string;
  linked_entity_name?: string;
  assignee_id?: string;
  assignee_name: string;
  assignee_type: AssigneeType;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  notes?: string;
  blocker_notes?: string;
  revenue_impact?: number;
  revenue_impact_label?: string;
  related_milestone?: string;
  created_by?: string;
  completed_by?: string;
  completed_at?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TaskNote {
  id: string;
  task_id: string;
  author: string;
  author_type: AssigneeType;
  body: string;
  created_at: string;
}

export interface TaskStatusHistory {
  id: string;
  task_id: string;
  from_status?: string;
  to_status: string;
  changed_by: string;
  note?: string;
  created_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  linked_system: TaskSystem;
  linked_entity_id?: string;
  linked_entity_name?: string;
  assignee_name?: string;
  assignee_type?: AssigneeType;
  priority?: TaskPriority;
  due_date?: string;
  notes?: string;
  revenue_impact?: number;
  revenue_impact_label?: string;
  related_milestone?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
}

export async function fetchTasks(system?: TaskSystem): Promise<Task[]> {
  let q = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (system) q = q.eq('linked_system', system);
  const { data, error } = await q;
  if (error) throw error;
  return data as Task[];
}

export async function fetchTaskById(id: string): Promise<Task | null> {
  const { data, error } = await supabase.from('tasks').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Task | null;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const { data, error } = await supabase.from('tasks').insert({
    ...input,
    assignee_name: input.assignee_name ?? 'Unassigned',
    assignee_type: input.assignee_type ?? 'human_team',
    priority: input.priority ?? 'medium',
    status: 'open',
  }).select().single();
  if (error) throw error;
  return data as Task;
}

export async function updateTaskStatus(
  id: string,
  status: TaskStatus,
  changedBy: string,
  note?: string
): Promise<void> {
  const current = await fetchTaskById(id);
  if (!current) throw new Error('Task not found');

  await supabase.from('task_status_history').insert({
    task_id: id,
    from_status: current.status,
    to_status: status,
    changed_by: changedBy,
    note,
  });

  const update: Partial<Task> = { status, updated_at: new Date().toISOString() };
  if (status === 'completed') {
    update.completed_by = changedBy;
    update.completed_at = new Date().toISOString();
  }

  const { error } = await supabase.from('tasks').update(update).eq('id', id);
  if (error) throw error;
}

export async function updateTask(id: string, patch: Partial<Task>): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function addTaskNote(
  taskId: string,
  author: string,
  authorType: AssigneeType,
  body: string
): Promise<TaskNote> {
  const { data, error } = await supabase.from('task_notes').insert({
    task_id: taskId,
    author,
    author_type: authorType,
    body,
  }).select().single();
  if (error) throw error;
  return data as TaskNote;
}

export async function fetchTaskNotes(taskId: string): Promise<TaskNote[]> {
  const { data, error } = await supabase
    .from('task_notes')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as TaskNote[];
}

export async function fetchTaskStatusHistory(taskId: string): Promise<TaskStatusHistory[]> {
  const { data, error } = await supabase
    .from('task_status_history')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as TaskStatusHistory[];
}

export const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: '#EF4444' },
  high:     { label: 'High',     color: '#F59E0B' },
  medium:   { label: 'Medium',   color: '#06B6D4' },
  low:      { label: 'Low',      color: '#6B7280' },
};

export const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  open:        { label: 'Open',        color: '#6B7280' },
  in_progress: { label: 'In Progress', color: '#06B6D4' },
  blocked:     { label: 'Blocked',     color: '#EF4444' },
  review:      { label: 'In Review',   color: '#F59E0B' },
  completed:   { label: 'Completed',   color: '#10B981' },
  cancelled:   { label: 'Cancelled',   color: '#374151' },
};

export const ASSIGNEE_TYPE_META: Record<AssigneeType, { label: string; color: string }> = {
  ai_operator:  { label: 'AI Operator',  color: '#06B6D4' },
  human_team:   { label: 'Team Member',  color: '#10B981' },
  artist:       { label: 'Artist',       color: '#F59E0B' },
  external:     { label: 'External',     color: '#A3E635' },
};

export const SYSTEM_META: Record<TaskSystem, { label: string; color: string }> = {
  admin_os:    { label: 'Admin OS',      color: '#06B6D4' },
  artist_os:   { label: 'Artist OS',     color: '#F59E0B' },
  catalog_os:  { label: 'Catalog OS',    color: '#10B981' },
  industry_os: { label: 'Industry OS',   color: '#A3E635' },
  rocksteady:  { label: 'Rocksteady',    color: '#EC4899' },
};

export const MOCK_TASKS: Omit<Task, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'Submit "Butterfly" sync for Netflix confirmation',
    description: 'Follow up with sync rep. Deal memo was sent April 12. Need written approval before May 1 lockdown.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Bassnectar / Amorphous Music',
    assignee_name: 'GMG Sync Team',
    assignee_type: 'human_team',
    priority: 'critical',
    status: 'in_progress',
    due_date: '2026-04-18',
    revenue_impact: 180000,
    revenue_impact_label: '$80K–$220K sync fee',
    related_milestone: 'Q2 Sync Revenue',
    created_by: 'GMG Admin',
  },
  {
    title: 'Launch Spotify Marquee — Divergent Spectrum',
    description: 'Campaign approved. Creative assets ready. Awaiting final budget sign-off from finance.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Bassnectar / Amorphous Music',
    assignee_name: 'AI Marketing Operator',
    assignee_type: 'ai_operator',
    priority: 'high',
    status: 'review',
    due_date: '2026-04-20',
    revenue_impact: 12000,
    revenue_impact_label: '+$12K est. monthly streaming uplift',
    related_milestone: 'Streaming Growth Q2',
    created_by: 'GMG Admin',
  },
  {
    title: 'Prepare CIM delivery for Investment Fund A',
    description: 'Confidential Information Memorandum needs final review and legal sign-off before sending to buyer.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Bassnectar / Amorphous Music',
    assignee_name: 'Sarah M. Bloom, Esq.',
    assignee_type: 'external',
    priority: 'high',
    status: 'in_progress',
    due_date: '2026-04-18',
    related_milestone: 'Sale Process Q2',
    created_by: 'GMG Catalog Team',
  },
  {
    title: 'Vasona Blue vendor consolidation proposal',
    description: 'Identify 1 primary + 1 overflow vendor. Present savings analysis showing $8,200/mo reduction.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Vasona Blue',
    assignee_name: 'GMG Ops',
    assignee_type: 'human_team',
    priority: 'medium',
    status: 'open',
    due_date: '2026-05-05',
    revenue_impact: 8200,
    revenue_impact_label: '-$8,200/mo in overhead savings',
    created_by: 'GMG Admin',
  },
  {
    title: 'ZFM subscription tier architecture',
    description: 'Design and spec the subscription tier for ZFM direct fan platform. Target Aug 2026 launch.',
    linked_system: 'catalog_os',
    linked_entity_name: 'ZFM',
    assignee_name: 'AI Marketing Operator',
    assignee_type: 'ai_operator',
    priority: 'medium',
    status: 'open',
    due_date: '2026-06-01',
    revenue_impact: 25000,
    revenue_impact_label: '+$25K/mo subscription revenue target',
    created_by: 'GMG Admin',
  },
  {
    title: 'Resolve YouTube Content ID dispute — 3 tracks',
    description: 'Three bootleg recordings generating false claims. Submit counter-notification with rights documentation.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Amorphous Music Inc.',
    assignee_name: 'GMG Legal',
    assignee_type: 'human_team',
    priority: 'low',
    status: 'blocked',
    blocker_notes: 'Waiting on documentation from previous distribution partner.',
    due_date: '2026-04-30',
    created_by: 'GMG Admin',
  },
  {
    title: 'Renew Bassnectar Touring LLC insurance',
    description: 'General liability and touring policy renewal overdue. Required before any booking conversations.',
    linked_system: 'catalog_os',
    linked_entity_name: 'Bassnectar Touring LLC',
    assignee_name: 'GMG Ops',
    assignee_type: 'human_team',
    priority: 'high',
    status: 'in_progress',
    due_date: '2026-04-19',
    blocker_notes: undefined,
    created_by: 'GMG Admin',
  },
  {
    title: 'Vault Drop Vol. 2 — pre-sale campaign setup',
    description: 'Bandcamp pre-sale page, ZFM announcement email, Discord preview post. Target drop May 15.',
    linked_system: 'catalog_os',
    linked_entity_name: 'ZFM',
    assignee_name: 'AI Marketing Operator',
    assignee_type: 'ai_operator',
    priority: 'high',
    status: 'open',
    due_date: '2026-05-01',
    revenue_impact: 31000,
    revenue_impact_label: '$31K+ estimated (based on Vol. 1)',
    created_by: 'GMG Admin',
  },
];
