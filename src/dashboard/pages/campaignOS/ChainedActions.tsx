import { useState } from 'react';
import {
  CheckCircle, Clock, Lock, Zap, Play,
  AlertTriangle, ChevronRight, ChevronDown, Eye,
  Cpu, Users, Target, Music2, ShoppingBag, MapPin,
} from 'lucide-react';
import { mono, chip, ProgressBar, LiveDot, HoverBtn } from './primitives';
import { useAutopilot } from '../../context/AutopilotContext';

type StepStatus   = 'complete' | 'running' | 'pending_approval' | 'queued' | 'blocked' | 'locked';
type StepExecMode = 'auto' | 'review' | 'manual';
type PlaybookTag  = 'RELEASE' | 'PLATFORM' | 'GROWTH' | 'FAN' | 'MERCH' | 'MEDIA';

interface StepBlocker {
  label: string;
  type: 'data' | 'platform' | 'funding' | 'approval';
  resolvable: boolean;
}

interface ChainStep {
  id: string;
  num: number;
  label: string;
  detail: string;
  status: StepStatus;
  execMode: StepExecMode;
  trigger?: string;
  pct?: number;
  estimatedTime?: string;
  blocker?: StepBlocker;
  dependsOn?: string;
}

interface Playbook {
  id: string;
  title: string;
  subtitle: string;
  tag: PlaybookTag;
  color: string;
  icon: React.ElementType;
  pct: number;
  steps: ChainStep[];
  riskIfIgnored?: string;
  nextAutoTrigger?: string;
}

const TAG_CFG: Record<PlaybookTag, { label: string; color: string }> = {
  RELEASE:  { label: 'Release',  color: '#F59E0B' },
  PLATFORM: { label: 'Platform', color: '#FA2D48' },
  GROWTH:   { label: 'Growth',   color: '#10B981' },
  FAN:      { label: 'Fan',      color: '#EC4899' },
  MERCH:    { label: 'Merch',    color: '#8B5CF6' },
  MEDIA:    { label: 'Media',    color: '#06B6D4' },
};

const STATUS_CFG: Record<StepStatus, { icon: React.ElementType; color: string; label: string }> = {
  complete:         { icon: CheckCircle,  color: '#10B981', label: 'Complete'        },
  running:          { icon: Zap,          color: '#F59E0B', label: 'Running'         },
  pending_approval: { icon: Eye,          color: '#06B6D4', label: 'Needs Approval'  },
  queued:           { icon: Clock,        color: '#94A3B8', label: 'Queued'          },
  blocked:          { icon: AlertTriangle,color: '#EF4444', label: 'Blocked'         },
  locked:           { icon: Lock,         color: 'rgba(255,255,255,0.2)', label: 'Locked' },
};

const EXEC_MODE_CFG: Record<StepExecMode, { label: string; color: string; bg: string; border: string }> = {
  auto:   { label: 'AUTO',   color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)'  },
  review: { label: 'REVIEW', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)'   },
  manual: { label: 'MANUAL', color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.2)' },
};

const INITIAL_PLAYBOOKS: Playbook[] = [
  {
    id: 'p1',
    title: 'Release Week Acceleration',
    subtitle: 'Fund → Activate Paid → Seed Creators → Capture Fans',
    tag: 'RELEASE',
    color: '#F59E0B',
    icon: Zap,
    pct: 28,
    riskIfIgnored: 'Miss release-week amplification window. Paid algorithms require 5-day warm-up.',
    nextAutoTrigger: 'Paid ads launch auto-triggers the moment advance is approved',
    steps: [
      {
        id: 's1-1', num: 1,
        label: 'Advance Request Approved',
        detail: '$3,500 against Apr 30 streaming receivable · recoupable',
        status: 'complete', execMode: 'review',
        trigger: 'Manual approval required',
        estimatedTime: 'Done',
      },
      {
        id: 's1-2', num: 2,
        label: 'Launch Paid Media Stack',
        detail: 'TikTok Spark Ads + Meta Reels · $3,500 · 7-day release sprint',
        status: 'running', execMode: 'auto',
        trigger: 'Auto-triggered on advance approval',
        pct: 62,
        estimatedTime: '~4 hours to full deployment',
      },
      {
        id: 's1-3', num: 3,
        label: 'Creator Push — Wave 2',
        detail: '42 creators · release-week content · co-ord briefed',
        status: 'queued', execMode: 'auto',
        trigger: 'Auto-triggers when paid campaign hits 50% deployment',
        dependsOn: 's1-2',
        estimatedTime: '~1 day after paid activates',
      },
      {
        id: 's1-4', num: 4,
        label: 'Fan Capture Funnel Live',
        detail: 'Fan Hub → email + SMS expansion · smart link deploy',
        status: 'locked', execMode: 'auto',
        trigger: 'Unlocks when creator wave 2 has 10+ active posts',
        dependsOn: 's1-3',
        estimatedTime: '~2 days out',
      },
      {
        id: 's1-5', num: 5,
        label: 'Momentum Score Review',
        detail: 'AI reviews day-3 performance · auto-scales if threshold met',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-runs at 72h post-release',
        dependsOn: 's1-4',
        estimatedTime: '72h post-release',
      },
    ],
  },
  {
    id: 'p2',
    title: 'Apple Music Recovery',
    subtitle: 'Close setup gaps before editorial window closes',
    tag: 'PLATFORM',
    color: '#FA2D48',
    icon: Music2,
    pct: 0,
    riskIfIgnored: 'Editorial placement opportunity is permanently forfeited. Window closes in 10 days.',
    nextAutoTrigger: 'AI will auto-draft bio + Q&A from press materials — awaiting your approval',
    steps: [
      {
        id: 's2-1', num: 1,
        label: 'AI Bio + Q&A Draft Generated',
        detail: 'Drafts from existing press kit, prior interviews, release notes',
        status: 'running', execMode: 'auto',
        pct: 89,
        trigger: 'Auto-runs on playbook activation',
        estimatedTime: '~5 min',
      },
      {
        id: 's2-2', num: 2,
        label: 'Artist Approval — Bio & Q&A',
        detail: 'Review AI draft · approve or edit in 5 minutes',
        status: 'pending_approval', execMode: 'review',
        trigger: 'Paused — awaiting artist review',
        dependsOn: 's2-1',
        estimatedTime: 'Awaiting approval',
      },
      {
        id: 's2-3', num: 3,
        label: 'Promo Card + Artwork Upload',
        detail: 'Final release art · 3000×3000 · Apple spec-compliant',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-triggers on bio approval',
        dependsOn: 's2-2',
        estimatedTime: '~15 min after approval',
        blocker: {
          label: 'Final artwork not uploaded to asset vault',
          type: 'data',
          resolvable: true,
        },
      },
      {
        id: 's2-4', num: 4,
        label: 'Submit Apple Music Editorial Pitch',
        detail: 'Pitch auto-compiled and routed to Apple Music editorial team',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-submits once all assets pass spec check',
        dependsOn: 's2-3',
        estimatedTime: '~20 min after artwork upload',
      },
    ],
  },
  {
    id: 'p3',
    title: 'LATAM Momentum Amplification',
    subtitle: 'Organic signal detected → paid scale into top markets',
    tag: 'GROWTH',
    color: '#10B981',
    icon: MapPin,
    pct: 55,
    nextAutoTrigger: 'Paid scale auto-deploys once 8 of 12 creator posts are live',
    steps: [
      {
        id: 's3-1', num: 1,
        label: 'LATAM Signal Confirmed',
        detail: 'Brazil +50%, Mexico City +38% vs prior 30-day window',
        status: 'complete', execMode: 'auto',
        trigger: 'Auto-detected by Rocksteady',
        estimatedTime: 'Done · 3 days ago',
      },
      {
        id: 's3-2', num: 2,
        label: 'Creator Brief Sent — LATAM Pack',
        detail: '12 creators briefed · São Paulo (8) + Mexico City (4)',
        status: 'complete', execMode: 'auto',
        trigger: 'Auto-triggered on signal confirmation',
        estimatedTime: 'Done · 2 days ago',
      },
      {
        id: 's3-3', num: 3,
        label: 'Creator Wave 1 — Live',
        detail: '8 of 12 posts published · engagement above target',
        status: 'running', execMode: 'manual',
        pct: 67,
        trigger: 'Partially live — waiting on 4 remaining creators',
        estimatedTime: '~2 creators posting today',
      },
      {
        id: 's3-4', num: 4,
        label: 'Scale Paid — São Paulo + Mexico City',
        detail: 'Deploy $800 in top-performing markets · Spark Ads + Meta',
        status: 'queued', execMode: 'auto',
        trigger: 'Auto-triggers when 8/12 creator posts are live',
        dependsOn: 's3-3',
        estimatedTime: '~1 day away',
      },
      {
        id: 's3-5', num: 5,
        label: 'Performance Review + Scale Decision',
        detail: 'AI reviews LATAM campaign · recommends scale or hold',
        status: 'locked', execMode: 'review',
        trigger: 'Triggers at 72h post paid launch',
        dependsOn: 's3-4',
        estimatedTime: '~4 days from now',
      },
    ],
  },
  {
    id: 'p4',
    title: 'Pre-Save Conversion Rescue',
    subtitle: 'Gap detected → urgency push → algorithmic trigger saved',
    tag: 'RELEASE',
    color: '#06B6D4',
    icon: Target,
    pct: 0,
    riskIfIgnored: 'Day-1 algo trigger stays weak. Release Radar and Discover Weekly eligibility at risk.',
    nextAutoTrigger: 'SMS + email urgency push auto-deploys on activation',
    steps: [
      {
        id: 's4-1', num: 1,
        label: 'Pre-Save Gap Identified',
        detail: '11.2K of 25K target · 13,800 more needed in 18 days',
        status: 'complete', execMode: 'auto',
        trigger: 'Auto-detected by campaign signal monitor',
        estimatedTime: 'Done',
      },
      {
        id: 's4-2', num: 2,
        label: 'Fan Base Urgency Push — Email + SMS',
        detail: 'Personalized pre-save CTA to warm fan segment · ~8,200 contacts',
        status: 'pending_approval', execMode: 'review',
        trigger: 'Ready to send — awaiting approval',
        dependsOn: 's4-1',
        estimatedTime: 'Sends within 1 hour of approval',
      },
      {
        id: 's4-3', num: 3,
        label: 'Creator Pre-Save Push',
        detail: '18 creator partners · pre-save CTA in story + video overlay',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-triggers on email push send',
        dependsOn: 's4-2',
        estimatedTime: '~6 hours after email sends',
      },
      {
        id: 's4-4', num: 4,
        label: 'Paid Pre-Save Ads Activated',
        detail: '$500 targeted · lookalike fans + Spotify interest layer',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-triggers when pre-save pace crosses 18K',
        dependsOn: 's4-3',
        estimatedTime: 'Triggers on velocity threshold',
        blocker: {
          label: '$500 pre-save ad budget not confirmed',
          type: 'funding',
          resolvable: true,
        },
      },
      {
        id: 's4-5', num: 5,
        label: 'Confirm 25K Threshold Hit',
        detail: 'Pace monitoring · AI confirms Discover Weekly eligibility met',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-confirms when 25K hit',
        dependsOn: 's4-4',
        estimatedTime: '~10–14 days out',
      },
    ],
  },
  {
    id: 'p5',
    title: 'Fan Club Activation',
    subtitle: 'Warm audience → superfan segment → D2C flywheel',
    tag: 'FAN',
    color: '#EC4899',
    icon: Users,
    pct: 12,
    nextAutoTrigger: 'Fan segmentation auto-runs after smart link deploy',
    steps: [
      {
        id: 's5-1', num: 1,
        label: 'Smart Link + Fan Hub Deployed',
        detail: 'Bio link → Fan Hub → email capture · goes live on release',
        status: 'running', execMode: 'auto',
        pct: 40,
        trigger: 'Auto-deploying on release schedule',
        estimatedTime: '~18 days until live',
      },
      {
        id: 's5-2', num: 2,
        label: 'Fan Segmentation — Superfan ID',
        detail: 'AI segments by engagement depth · top 5% flagged as superfans',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-runs 7 days after hub goes live',
        dependsOn: 's5-1',
        estimatedTime: '~25 days out',
      },
      {
        id: 's5-3', num: 3,
        label: 'Superfan Exclusive Drop',
        detail: 'Early access merch link + bonus content to top-tier fans',
        status: 'locked', execMode: 'review',
        trigger: 'Triggered when superfan segment > 500 identified',
        dependsOn: 's5-2',
        estimatedTime: '~28 days out',
      },
      {
        id: 's5-4', num: 4,
        label: 'Referral Loop Activation',
        detail: 'Fan-forward pre-save and merch link · share incentive active',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-deploys 48h after superfan drop',
        dependsOn: 's5-3',
        estimatedTime: '~30 days out',
      },
    ],
  },
  {
    id: 'p6',
    title: 'Merch Spike Capture',
    subtitle: 'Streaming spike detected → merch push → D2C revenue capture',
    tag: 'MERCH',
    color: '#8B5CF6',
    icon: ShoppingBag,
    pct: 0,
    riskIfIgnored: 'Streaming momentum window passes without merch revenue capture. Spikes are short.',
    nextAutoTrigger: 'Merch push email auto-queues when velocity threshold detected',
    steps: [
      {
        id: 's6-1', num: 1,
        label: 'Streaming Spike Trigger',
        detail: 'Rocksteady detects +30% velocity · merch window flagged',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-triggers on +30% stream velocity event',
        estimatedTime: 'Monitoring · waiting on trigger',
        blocker: {
          label: 'Velocity threshold not yet reached',
          type: 'data',
          resolvable: false,
        },
      },
      {
        id: 's6-2', num: 2,
        label: 'Merch Email + SMS Blast',
        detail: 'Timed push to full fan base · direct link to drop',
        status: 'locked', execMode: 'review',
        trigger: 'Auto-queued on spike detection · requires approval',
        dependsOn: 's6-1',
        estimatedTime: 'Awaiting trigger event',
      },
      {
        id: 's6-3', num: 3,
        label: 'Social + Creator Merch Push',
        detail: 'Top 5 fan-facing creators briefed for merch post',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-triggers 2h after email blast sends',
        dependsOn: 's6-2',
        estimatedTime: 'Awaiting email send',
      },
      {
        id: 's6-4', num: 4,
        label: 'Scarcity Push — 48h Window',
        detail: '"Limited drop" messaging · countdown timer on store',
        status: 'locked', execMode: 'auto',
        trigger: 'Auto-runs 24h after creator push',
        dependsOn: 's6-3',
        estimatedTime: 'Awaiting creator push',
      },
    ],
  },
];

function ExecModeBadge({ mode }: { mode: StepExecMode }) {
  const c = EXEC_MODE_CFG[mode];
  return (
    <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5, background: c.bg, border: `1px solid ${c.border}`, color: c.color, letterSpacing: '0.09em' }}>
      {c.label}
    </span>
  );
}

function StatusBadge({ status }: { status: StepStatus }) {
  const c = STATUS_CFG[status];
  if (status === 'complete' || status === 'locked') return null;
  return (
    <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5, background: `${c.color}12`, border: `1px solid ${c.color}30`, color: c.color, letterSpacing: '0.08em' }}>
      {c.label.toUpperCase()}
    </span>
  );
}

function AutopilotModeBadge({ mode }: { mode: 'manual' | 'assisted' | 'autopilot' }) {
  if (mode === 'autopilot') return (
    <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', letterSpacing: '0.09em' }}>
      AUTOPILOT ON
    </span>
  );
  if (mode === 'assisted') return (
    <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4', letterSpacing: '0.09em' }}>
      ASSISTED
    </span>
  );
  return (
    <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', color: '#94A3B8', letterSpacing: '0.09em' }}>
      MANUAL
    </span>
  );
}

interface StepProps {
  step: ChainStep;
  isLast: boolean;
  color: string;
  autopilotMode: 'manual' | 'assisted' | 'autopilot';
  onApprove: (stepId: string) => void;
  onExecute: (stepId: string) => void;
}

function StepRow({ step, isLast, color, autopilotMode, onApprove, onExecute }: StepProps) {
  const sc = STATUS_CFG[step.status];
  const Icon = sc.icon;
  const isActive   = step.status === 'running';
  const isLocked   = step.status === 'locked';
  const isBlocked  = step.status === 'blocked';
  const isApproval = step.status === 'pending_approval';
  const isComplete = step.status === 'complete';
  const isQueued   = step.status === 'queued';

  const canAutoRun = step.execMode === 'auto' && (isQueued || isApproval) && autopilotMode === 'autopilot';

  const dimmed = isLocked || (!isActive && !isComplete && !isApproval && !isQueued && !isBlocked);

  return (
    <div style={{ opacity: dimmed && !isQueued ? 0.45 : 1, transition: 'opacity 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '10px 0' }}>

        {/* Spine */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 9, flexShrink: 0,
            background: isActive ? `${sc.color}1E` : isComplete ? 'rgba(16,185,129,0.08)' : isBlocked ? 'rgba(239,68,68,0.08)' : isApproval ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isActive ? sc.color + '45' : isComplete ? 'rgba(16,185,129,0.25)' : isBlocked ? 'rgba(239,68,68,0.25)' : isApproval ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.08)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isActive ? `0 0 12px ${sc.color}30` : 'none',
            transition: 'all 0.3s',
          }}>
            {isActive && step.pct !== undefined
              ? <Zap size={12} color={sc.color} />
              : <Icon size={12} color={sc.color} />}
          </div>
          {!isLast && (
            <div style={{
              width: 1, height: 22,
              background: isActive || isComplete ? `${color}35` : 'rgba(255,255,255,0.06)',
              marginTop: 2,
            }} />
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', fontWeight: 900 }}>STEP {step.num}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: isLocked ? 'rgba(255,255,255,0.28)' : '#fff', lineHeight: 1.2 }}>{step.label}</span>
            <ExecModeBadge mode={step.execMode} />
            <StatusBadge status={step.status} />
            {canAutoRun && (
              <span style={{ ...mono, fontSize: 7, padding: '2px 7px', borderRadius: 5, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#10B981', letterSpacing: '0.08em' }}>
                READY TO AUTO-RUN
              </span>
            )}
          </div>

          <p style={{ margin: '0 0 5px', fontSize: 10, color: 'rgba(255,255,255,0.32)', lineHeight: 1.5 }}>{step.detail}</p>

          {/* Progress bar for running steps */}
          {isActive && step.pct !== undefined && (
            <div style={{ marginBottom: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.25)' }}>Execution progress</span>
                <span style={{ ...mono, fontSize: 8, fontWeight: 700, color: sc.color }}>{step.pct}%</span>
              </div>
              <ProgressBar pct={step.pct} color={sc.color} height={3} />
            </div>
          )}

          {/* Trigger info */}
          {step.trigger && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <Zap size={8} color="rgba(255,255,255,0.2)" />
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.2)' }}>{step.trigger}</span>
            </div>
          )}

          {/* Estimated time */}
          {step.estimatedTime && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <Clock size={8} color="rgba(255,255,255,0.15)" />
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.2)' }}>{step.estimatedTime}</span>
            </div>
          )}

          {/* Dependency note */}
          {step.dependsOn && !isComplete && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <ChevronRight size={8} color="rgba(255,255,255,0.15)" />
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.16)' }}>Depends on Step {parseInt(step.dependsOn.split('-')[1])} completion</span>
            </div>
          )}

          {/* Blocker */}
          {step.blocker && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7, marginTop: 6,
              padding: '5px 9px', borderRadius: 7,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
            }}>
              <AlertTriangle size={9} color="#EF4444" />
              <span style={{ ...mono, fontSize: 7.5, color: '#EF4444', lineHeight: 1.4 }}>{step.blocker.label}</span>
              {step.blocker.resolvable && (
                <span style={{ ...mono, fontSize: 7, padding: '1px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', marginLeft: 'auto', whiteSpace: 'nowrap' as const }}>
                  Resolvable
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
          {isApproval && (
            <HoverBtn label="Approve" color="#06B6D4" icon={CheckCircle} sm onClick={() => onApprove(step.id)} />
          )}
          {isActive && step.execMode !== 'auto' && (
            <HoverBtn label="Execute" color={sc.color} icon={Play} sm onClick={() => onExecute(step.id)} />
          )}
          {isQueued && autopilotMode === 'manual' && step.execMode !== 'auto' && (
            <HoverBtn label="Run Now" color="#94A3B8" icon={Play} sm onClick={() => onExecute(step.id)} />
          )}
          {isComplete && (
            <span style={{ ...mono, fontSize: 8, color: '#10B981', fontWeight: 700 }}>✓ Done</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaybookCard({ playbook, autopilotMode }: { playbook: Playbook; autopilotMode: 'manual' | 'assisted' | 'autopilot' }) {
  const [open, setOpen]     = useState(playbook.pct > 0 && playbook.pct < 100);
  const [steps, setSteps]   = useState(playbook.steps);
  const [pct, setPct]       = useState(playbook.pct);
  const [hov, setHov]       = useState(false);
  const { logExecution }    = useAutopilot();

  const tagCfg = TAG_CFG[playbook.tag];
  const Icon   = playbook.icon;
  const totalSteps    = steps.length;
  const completeCount = steps.filter(s => s.status === 'complete').length;
  const blockedCount  = steps.filter(s => s.status === 'blocked').length;
  const approvalCount = steps.filter(s => s.status === 'pending_approval').length;
  const isFullyDone   = completeCount === totalSteps;

  const needsAttention = approvalCount > 0 || blockedCount > 0;

  function onApprove(stepId: string) {
    setSteps(prev => prev.map(s => {
      if (s.id !== stepId) return s;
      return { ...s, status: 'running' as StepStatus, pct: 10 };
    }));
    logExecution({ id: stepId, label: `Approved: ${steps.find(s => s.id === stepId)?.label ?? stepId}`, artist: 'Campaign' });
  }

  function onExecute(stepId: string) {
    setSteps(prev => {
      const updated = prev.map(s => {
        if (s.id !== stepId) return s;
        return { ...s, status: 'running' as StepStatus, pct: 15 };
      });
      return updated;
    });
    logExecution({ id: stepId, label: `Executed: ${steps.find(s => s.id === stepId)?.label ?? stepId}`, artist: 'Campaign' });
  }

  const runIndicator = steps.some(s => s.status === 'running');

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0A0B0D',
        border: `1px solid ${hov ? playbook.color + '35' : playbook.color + '18'}`,
        borderRadius: 16, overflow: 'hidden',
        boxShadow: hov ? `0 0 24px ${playbook.color}10` : `0 0 12px ${playbook.color}05`,
        transition: 'all 0.25s',
      }}
    >
      <style>{`
        @keyframes pb-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(600%)} }
        @keyframes pb-run  { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      {/* Top line with scan effect if running */}
      <div style={{ position: 'relative', height: 2, background: `linear-gradient(90deg,transparent,${playbook.color}50,transparent)`, overflow: 'hidden' }}>
        {runIndicator && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '20%', background: `linear-gradient(90deg,transparent,${playbook.color},transparent)`, animation: 'pb-scan 2.5s linear infinite' }} />
        )}
      </div>

      {/* Header */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 18px', cursor: 'pointer' }}
        onClick={() => setOpen(v => !v)}
      >
        <div style={{ width: 36, height: 36, borderRadius: 11, background: `${playbook.color}14`, border: `1px solid ${playbook.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} color={playbook.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{playbook.title}</span>
            <span style={{ ...chip(tagCfg.color), fontSize: 7 }}>{tagCfg.label}</span>
            <AutopilotModeBadge mode={autopilotMode} />
            {needsAttention && (
              <span style={{ ...mono, fontSize: 7, padding: '2px 7px', borderRadius: 5, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.28)', color: '#06B6D4', letterSpacing: '0.08em' }}>
                {approvalCount > 0 ? `${approvalCount} NEEDS APPROVAL` : `${blockedCount} BLOCKED`}
              </span>
            )}
            {runIndicator && <LiveDot color={playbook.color} size={5} gap={2} />}
          </div>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{playbook.subtitle}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div>
            <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, marginBottom: 3, textAlign: 'right' }}>
              {completeCount}/{totalSteps} steps
            </div>
            <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: pct >= 80 ? '#10B981' : pct >= 40 ? playbook.color : '#EF4444', lineHeight: 1, textAlign: 'right' }}>
              {pct}%
            </div>
          </div>
          <div style={{ width: 56 }}>
            <ProgressBar pct={pct} color={pct >= 80 ? '#10B981' : playbook.color} height={4} />
          </div>
          <div style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>
            <ChevronDown size={14} color="rgba(255,255,255,0.25)" />
          </div>
        </div>
      </div>

      {/* Expanded body */}
      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '12px 18px 16px', animation: 'cos-slide 0.18s ease' }}>

          {/* Autopilot effect notice */}
          {autopilotMode !== 'manual' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
              padding: '7px 12px', borderRadius: 9,
              background: autopilotMode === 'autopilot' ? 'rgba(16,185,129,0.07)' : 'rgba(6,182,212,0.07)',
              border: `1px solid ${autopilotMode === 'autopilot' ? 'rgba(16,185,129,0.22)' : 'rgba(6,182,212,0.22)'}`,
            }}>
              <Cpu size={10} color={autopilotMode === 'autopilot' ? '#10B981' : '#06B6D4'} />
              <span style={{ ...mono, fontSize: 8, color: autopilotMode === 'autopilot' ? '#10B981' : '#06B6D4', lineHeight: 1.5 }}>
                {autopilotMode === 'autopilot'
                  ? 'Autopilot active — all AUTO steps will execute without approval. REVIEW steps still require your sign-off.'
                  : 'Assisted mode — AUTO steps are queued for execution. REVIEW steps require approval before running.'}
              </span>
            </div>
          )}

          {/* Auto-trigger banner */}
          {playbook.nextAutoTrigger && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14,
              padding: '7px 12px', borderRadius: 9,
              background: `${playbook.color}08`, border: `1px solid ${playbook.color}22`,
            }}>
              <LiveDot color={playbook.color} size={5} gap={2} />
              <span style={{ ...mono, fontSize: 8, color: `${playbook.color}BB`, lineHeight: 1.5 }}>{playbook.nextAutoTrigger}</span>
            </div>
          )}

          {/* Risk if ignored */}
          {playbook.riskIfIgnored && pct < 50 && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14,
              padding: '7px 12px', borderRadius: 9,
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)',
            }}>
              <AlertTriangle size={10} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(239,68,68,0.75)', lineHeight: 1.5 }}>{playbook.riskIfIgnored}</span>
            </div>
          )}

          {/* Step chain */}
          <div>
            {steps.map((step, i) => (
              <StepRow
                key={step.id}
                step={step}
                isLast={i === steps.length - 1}
                color={playbook.color}
                autopilotMode={autopilotMode}
                onApprove={onApprove}
                onExecute={onExecute}
              />
            ))}
          </div>

          {isFullyDone && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, padding: '8px', borderRadius: 9, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <CheckCircle size={11} color="#10B981" />
              <span style={{ ...mono, fontSize: 8, color: '#10B981', fontWeight: 700 }}>Playbook Complete — all steps executed</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ChainedActions() {
  const { mode } = useAutopilot();
  const [filter, setFilter]  = useState<PlaybookTag | 'ALL'>('ALL');

  const tags: Array<PlaybookTag | 'ALL'> = ['ALL', 'RELEASE', 'PLATFORM', 'GROWTH', 'FAN', 'MERCH'];
  const filtered = filter === 'ALL' ? INITIAL_PLAYBOOKS : INITIAL_PLAYBOOKS.filter(p => p.tag === filter);

  const totalActive   = INITIAL_PLAYBOOKS.filter(p => p.steps.some(s => s.status === 'running')).length;
  const totalApproval = INITIAL_PLAYBOOKS.reduce((acc, p) => acc + p.steps.filter(s => s.status === 'pending_approval').length, 0);
  const totalBlocked  = INITIAL_PLAYBOOKS.reduce((acc, p) => acc + p.steps.filter(s => s.status === 'blocked').length, 0);

  return (
    <div>
      {/* System status strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18,
        padding: '11px 16px', borderRadius: 12,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
      }}>
        {[
          { label: 'Active Playbooks', value: totalActive, color: '#F59E0B' },
          { label: 'Needs Approval',   value: totalApproval, color: '#06B6D4' },
          { label: 'Blocked Steps',    value: totalBlocked, color: '#EF4444' },
          { label: 'Autopilot Mode',   value: mode.toUpperCase(), color: mode === 'autopilot' ? '#10B981' : mode === 'assisted' ? '#06B6D4' : '#94A3B8', isText: true },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, marginBottom: 3 }}>{stat.label}</div>
            <div style={{ ...mono, fontSize: 'isText' in stat && stat.isText ? 10 : 20, fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {tags.map(t => {
          const active = filter === t;
          const tagColor = t === 'ALL' ? '#94A3B8' : TAG_CFG[t].color;
          return (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                ...mono, fontSize: 7.5, fontWeight: 900, padding: '4px 11px', borderRadius: 20, cursor: 'pointer',
                letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                background: active ? `${tagColor}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? tagColor + '40' : 'rgba(255,255,255,0.08)'}`,
                color: active ? tagColor : 'rgba(255,255,255,0.3)',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', lineHeight: 1.7, marginBottom: 14 }}>
        Each playbook is an executable action chain. AUTO steps run without intervention in Autopilot mode. REVIEW steps always require approval. MANUAL steps require you to trigger them.
      </p>

      {/* Playbook cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(p => (
          <PlaybookCard key={p.id} playbook={p} autopilotMode={mode} />
        ))}
      </div>
    </div>
  );
}
