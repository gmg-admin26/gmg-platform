export type WeekStatus = 'complete' | 'strong' | 'at-risk' | 'blocked' | 'upcoming';
export type PlatformStatus = 'complete' | 'ready' | 'partial' | 'missing' | 'blocked';
export type PlatformRowState = 'ready' | 'partial' | 'blocked' | 'needs-fix' | 'monitoring';
export type PlatformCTA = 'fix-now' | 'complete-setup' | 'verify' | 'sync' | 'review' | 'none';
export type WalletState = 'advance-eligible' | 'ach-sent' | 'ach-pending' | 'recoupable-active' | 'settled';
export type CommandGroup = 'active' | 'blocked' | 'funding' | 'momentum';
export type UrgencyLevel = 'immediate' | 'high' | 'medium' | 'monitoring';

export interface WeekTask {
  label: string;
  done: boolean;
  critical: boolean;
  blocker?: boolean;
}

export interface ReleaseWeek {
  num: number;
  label: string;
  objective: string;
  status: WeekStatus;
  pct: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  tasks: WeekTask[];
  color: string;
}

export interface PlatformCheck {
  label: string;
  status: PlatformStatus;
  blocker?: boolean;
  detail?: string;
}

export interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  hygieneScore: number;
  setupPct: number;
  checks: PlatformCheck[];
  overallStatus: PlatformStatus;
  rowState: PlatformRowState;
  currentStatus: string;
  actionNeeded: string;
  isBlocker: boolean;
  ctaActions: PlatformCTA[];
  lastSynced?: string;
  channel: 'dsp' | 'social' | 'fan' | 'paid';
}

export interface WalletTx {
  id: string;
  label: string;
  amount: string;
  date: string;
  state: 'settled' | 'pending' | 'sent' | 'incoming';
}

export interface CommandAction {
  id: string;
  rank: number;
  title: string;
  body: string;
  urgency: UrgencyLevel;
  confidence: number;
  outcome: string;
  timeWindow: string;
  group: CommandGroup;
  color: string;
  blocked?: string;
}

export interface SignalItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  color: string;
  note?: string;
}
