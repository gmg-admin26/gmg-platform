import { supabase } from '../../lib/supabase';

export type AgentStatus = 'active' | 'idle' | 'paused' | 'blocked';
export type AssignmentStatus = 'active' | 'queued' | 'blocked' | 'completed';
export type Severity = 'info' | 'warn' | 'critical' | 'success';
export type EventType = 'trigger' | 'action' | 'escalation' | 'failure' | 'approval_wait' | 'cross_update' | 'output';

export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  mission: string;
  status: AgentStatus;
  system: string;
  category: string;
  specialties: string[];
  human_override_owner: string;
  escalation_level: string;
  current_assignments: number;
  recent_actions: number;
  blockers: number;
  escalations: number;
  last_action_at: string;
  color: string;
  sort_order: number;
}

export interface AgentAssignment {
  id: string;
  agent_slug: string;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  human_owner: string;
  status: AssignmentStatus;
  next_action: string;
  blocker: string | null;
  priority: 'low' | 'normal' | 'high' | 'critical';
  progress_pct: number;
  updated_at: string;
}

export interface AgentActivity {
  id: string;
  agent_slug: string;
  event_type: EventType;
  entity_type: string;
  entity_id: string;
  entity_label: string;
  summary: string;
  detail: string;
  severity: Severity;
  occurred_at: string;
}

export interface AgentCapability {
  id: string;
  agent_slug: string;
  capability_type: 'workflow' | 'trigger' | 'escalation' | 'knowledge';
  label: string;
  detail: string;
  sort_order: number;
}

export const CATEGORY_META: Record<string, { label: string; color: string; description: string }> = {
  core:       { label: 'Core',       color: '#06B6D4', description: 'Always-on operational backbone' },
  executive:  { label: 'Executive',  color: '#F59E0B', description: 'Paula + Jacquelyn support layer' },
  legal:      { label: 'Legal',      color: '#EF4444', description: 'Contracts, loops, counsel' },
  growth:     { label: 'Growth',     color: '#EC4899', description: 'Marketing + campaign execution' },
  operations: { label: 'Operations', color: '#10B981', description: 'Touring, store, campus ops' },
  account:    { label: 'Account',    color: '#06B6D4', description: 'Artist + label account management' },
};

export const STATUS_COLOR: Record<string, string> = {
  active: '#10B981', idle: '#06B6D4', paused: '#F59E0B', blocked: '#EF4444',
  queued: '#06B6D4', completed: '#64748B',
};

export const SEVERITY_COLOR: Record<Severity, string> = {
  info: '#06B6D4', warn: '#F59E0B', critical: '#EF4444', success: '#10B981',
};

export const EVENT_LABEL: Record<EventType, string> = {
  trigger: 'TRIGGER', action: 'ACTION', escalation: 'ESCALATION',
  failure: 'FAILURE', approval_wait: 'APPROVAL WAIT', cross_update: 'CROSS UPDATE', output: 'OUTPUT',
};

export const PRIORITY_COLOR: Record<string, string> = {
  low: '#64748B', normal: '#06B6D4', high: '#F59E0B', critical: '#EF4444',
};

export async function fetchAgents(): Promise<Agent[]> {
  const { data } = await supabase.from('admin_ai_agents').select('*').order('sort_order', { ascending: true });
  return (data ?? []).map(row => ({
    ...row,
    specialties: Array.isArray(row.specialties) ? row.specialties : [],
  })) as Agent[];
}

export async function fetchAgentBySlug(slug: string): Promise<Agent | null> {
  const { data } = await supabase.from('admin_ai_agents').select('*').eq('slug', slug).maybeSingle();
  if (!data) return null;
  return { ...data, specialties: Array.isArray(data.specialties) ? data.specialties : [] } as Agent;
}

export async function fetchAssignments(opts: { agentSlug?: string; entityType?: string; entityId?: string } = {}): Promise<AgentAssignment[]> {
  let q = supabase.from('admin_agent_assignments').select('*').order('priority', { ascending: false }).order('updated_at', { ascending: false });
  if (opts.agentSlug) q = q.eq('agent_slug', opts.agentSlug);
  if (opts.entityType) q = q.eq('entity_type', opts.entityType);
  if (opts.entityId) q = q.eq('entity_id', opts.entityId);
  const { data } = await q;
  return (data ?? []) as AgentAssignment[];
}

export async function fetchActivity(opts: { agentSlug?: string; entityType?: string; entityId?: string; limit?: number } = {}): Promise<AgentActivity[]> {
  let q = supabase.from('admin_agent_activity').select('*').order('occurred_at', { ascending: false });
  if (opts.agentSlug) q = q.eq('agent_slug', opts.agentSlug);
  if (opts.entityType) q = q.eq('entity_type', opts.entityType);
  if (opts.entityId) q = q.eq('entity_id', opts.entityId);
  q = q.limit(opts.limit ?? 80);
  const { data } = await q;
  return (data ?? []) as AgentActivity[];
}

export async function fetchCapabilities(agentSlug: string): Promise<AgentCapability[]> {
  const { data } = await supabase.from('admin_agent_capabilities').select('*').eq('agent_slug', agentSlug).order('sort_order');
  return (data ?? []) as AgentCapability[];
}

export function relativeTime(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
