import { useState } from 'react';
import { Brain, Zap, AlertTriangle, DollarSign, TrendingUp, ChevronRight, Lock, Play, RotateCcw, Cpu, TrendingDown, CheckCircle, Clock, Wand2 } from 'lucide-react';
import type { CommandGroup, UrgencyLevel } from './types';
import { mono, chip, ProgressBar, HoverBtn, LiveDot } from './primitives';
import AutopilotModeControl from '../../components/autopilot/AutopilotModeControl';
import AutopilotStatusStrip from '../../components/autopilot/AutopilotStatusStrip';
import { useAutopilot } from '../../context/AutopilotContext';

type ExecMode   = 'manual' | 'one-click' | 'auto';
type ExecStatus = 'not-started' | 'queued' | 'in-progress' | 'complete';

interface BlockerItem {
  label: string;
  aiResolvable: boolean;
  detail?: string;
}

interface SimProjection {
  liftLow: number;
  liftHigh: number;
  confidence: number;
  impactWindow: string;
  points: number[];
}

interface CommandAction {
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
  execMode: ExecMode;
  execStatus: ExecStatus;
  execDetail?: string;
  execPct?: number;
  blockers?: BlockerItem[];
  simulation?: SimProjection;
  fundingTrigger?: { label: string; amount: string; state: 'locked' | 'allocated' | 'deployed' };
  consequence?: string;
}

const ACTIONS: CommandAction[] = [
  {
    id: 'a1', rank: 1, color: '#FA2D48', group: 'blocked', urgency: 'immediate', confidence: 96,
    title: 'Complete Apple Music setup — 18 days out',
    body: 'Bio, Q&A, and promo card missing. Apple editorial response window closes in 10 days. This gap will cost a featured placement.',
    outcome: 'Unlock potential Apple editorial feature', timeWindow: '48 hours',
    execMode: 'one-click', execStatus: 'not-started',
    blockers: [
      { label: 'Artist bio + Q&A not updated', aiResolvable: true, detail: 'AI can draft from existing press materials' },
      { label: 'Promo card not uploaded', aiResolvable: false, detail: 'Upload required: 3000×3000 artwork' },
      { label: 'Promotional pitch not sent', aiResolvable: true, detail: 'AI can generate pitch from campaign brief' },
    ],
    consequence: 'Risk: lose editorial placement · -18% streams in first 30 days',
  },
  {
    id: 'a2', rank: 2, color: '#EF4444', group: 'active', urgency: 'immediate', confidence: 92,
    title: 'Activate Week 4 creator seeding — 34 creators behind',
    body: 'Creator network brief 43% complete. Nostalgia + identity angles trending — window closes in 8 days.',
    outcome: '+18–24% stream velocity on release day', timeWindow: '3 days',
    execMode: 'one-click', execStatus: 'in-progress',
    execDetail: '18 / 42 creators contacted',
    execPct: 44,
    simulation: { liftLow: 18, liftHigh: 24, confidence: 92, impactWindow: '5–8 days', points: [0, 4, 9, 14, 20, 24, 22, 21] },
    consequence: 'If skipped: projected -22% release week momentum',
  },
  {
    id: 'a3', rank: 3, color: '#F59E0B', group: 'funding', urgency: 'high', confidence: 89,
    title: 'Use $3,500 advance for Week 2 paid media launch',
    body: 'Release week paid media requires $3,500 minimum. Advance eligible against Apr 30 payout.',
    outcome: 'Recoup within 21 days from streaming cycle', timeWindow: '5 days',
    execMode: 'one-click', execStatus: 'not-started',
    fundingTrigger: { label: 'Advance Available', amount: '$3,500', state: 'locked' },
    simulation: { liftLow: 18, liftHigh: 32, confidence: 87, impactWindow: '5–9 days', points: [0, 3, 8, 15, 22, 28, 32, 30] },
    consequence: 'If skipped: miss release-week paid window — no paid amplification on drop day',
  },
  {
    id: 'a4', rank: 4, color: '#10B981', group: 'active', urgency: 'high', confidence: 88,
    title: 'Hit 25K pre-saves — currently at 12,400',
    body: 'Need 12,600 more pre-saves in 18 days. Paid amplification + creator wave can bridge. 94% confidence if both activate.',
    outcome: '+25–40% Spotify algorithm boost on day-1', timeWindow: '7 days',
    execMode: 'one-click', execStatus: 'in-progress',
    execDetail: '12,400 / 25,000 pre-saves',
    execPct: 50,
    simulation: { liftLow: 25, liftHigh: 40, confidence: 88, impactWindow: '18 days', points: [0, 5, 10, 16, 22, 30, 38, 40] },
    consequence: 'If not hit: -25 to -40% Spotify algorithmic reach on release day',
  },
  {
    id: 'a5', rank: 5, color: '#10B981', group: 'momentum', urgency: 'high', confidence: 91,
    title: 'Brazil + Mexico City momentum — creator brief ready',
    body: 'Both markets organic signals strong. Brief ready. LATAM creators 72h avg response — send today for first posts before Week 2.',
    outcome: '+31% LATAM stream lift, $14K est. revenue', timeWindow: '24 hours',
    execMode: 'auto', execStatus: 'in-progress',
    execDetail: '6 / 12 creators briefed',
    execPct: 50,
    simulation: { liftLow: 25, liftHigh: 37, confidence: 91, impactWindow: '4–7 days', points: [0, 6, 14, 22, 30, 35, 37, 36] },
  },
  {
    id: 'a6', rank: 6, color: '#06B6D4', group: 'funding', urgency: 'medium', confidence: 100,
    title: 'Request payout — $8,420 available now',
    body: 'Streaming receivables ready for ACH. Funds arrive in bank 1–2 business days to cover upcoming campaign expenses.',
    outcome: 'Cash in hand for release-week activation', timeWindow: 'Any time',
    execMode: 'one-click', execStatus: 'not-started',
    fundingTrigger: { label: 'Funds Ready', amount: '$8,420', state: 'locked' },
  },
  {
    id: 'a7', rank: 7, color: '#FF0050', group: 'blocked', urgency: 'medium', confidence: 85,
    title: 'Complete TikTok creator seed pack',
    body: 'Creator seed pack 60% complete. Missing: short hook clips, lyric cards, B-roll footage.',
    outcome: '2x creator content output, broader reach', timeWindow: '4 days',
    execMode: 'one-click', execStatus: 'not-started',
    blockers: [
      { label: 'Hook clips not uploaded (3 needed)', aiResolvable: false, detail: 'Requires video production assets' },
      { label: 'Lyric card graphics missing', aiResolvable: true, detail: 'AI can generate lyric card templates' },
      { label: 'B-roll footage package incomplete', aiResolvable: false, detail: 'Raw footage needed from artist' },
    ],
    consequence: 'If skipped: 2x lower creator content velocity on release day',
  },
];

const GROUP_CFG: Record<CommandGroup, { label: string; color: string; icon: React.ElementType }> = {
  active:   { label: 'Active Now',              color: '#EF4444', icon: Zap          },
  blocked:  { label: 'Blocked',                 color: '#F59E0B', icon: AlertTriangle },
  funding:  { label: 'Funding Opportunities',   color: '#F59E0B', icon: DollarSign   },
  momentum: { label: 'Momentum Opportunities',  color: '#10B981', icon: TrendingUp   },
};

const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  immediate: '#EF4444', high: '#F59E0B', medium: '#06B6D4', monitoring: 'rgba(255,255,255,0.3)',
};

const EXEC_STATUS_CFG: Record<ExecStatus, { color: string; label: string; icon: React.ElementType }> = {
  'not-started': { color: 'rgba(255,255,255,0.25)', label: 'Not Started', icon: Clock       },
  'queued':      { color: '#06B6D4',                label: 'Queued',      icon: Clock       },
  'in-progress': { color: '#F59E0B',                label: 'In Progress', icon: Cpu         },
  'complete':    { color: '#10B981',                label: 'Complete',    icon: CheckCircle },
};

function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const w = 80, h = 28;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(v => h - (v / max) * (h - 4));
  const pathD = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
  const fillD = `${pathD} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillD} fill={`url(#sg-${color.replace('#', '')})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 3px ${color}80)` }} />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r={2.5} fill={color} style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
    </svg>
  );
}

function SimPanel({ sim, color }: { sim: SimProjection; color: string }) {
  return (
    <div style={{ background: `${color}07`, border: `1px solid ${color}20`, borderRadius: 11, padding: '12px 14px', marginBottom: 10 }}>
      <div style={{ ...mono, fontSize: 7, color: `${color}66`, textTransform: 'uppercase' as const, letterSpacing: '0.09em', marginBottom: 8 }}>Simulated Impact</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.02em' }}>+{sim.liftLow}–{sim.liftHigh}%</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Expected lift</div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{sim.confidence}%</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Confidence</div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{sim.impactWindow}</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>Impact window</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <MiniSparkline points={sim.points} color={color} />
        </div>
      </div>
    </div>
  );
}

function BlockerPanel({ blockers, color }: { blockers: BlockerItem[]; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 8 }}>Blockers to Resolve</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {blockers.map((b, i) => (
          <div key={i} style={{ background: b.aiResolvable ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${b.aiResolvable ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: 9, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Lock size={10} color={b.aiResolvable ? '#10B981' : '#EF4444'} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#fff', marginBottom: 2 }}>{b.label}</div>
              {b.detail && <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{b.detail}</div>}
            </div>
            {b.aiResolvable && (
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, padding: '4px 10px', borderRadius: 7, cursor: 'pointer', fontWeight: 700, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
                <Wand2 size={9} />
                Auto-complete with AI
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FundingTriggerBadge({ trigger }: { trigger: NonNullable<CommandAction['fundingTrigger']> }) {
  const stateColor = trigger.state === 'deployed' ? '#10B981' : trigger.state === 'allocated' ? '#06B6D4' : '#F59E0B';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 9, background: `${stateColor}0A`, border: `1px solid ${stateColor}25`, marginBottom: 10 }}>
      <DollarSign size={10} color={stateColor} />
      <span style={{ ...mono, fontSize: 8, fontWeight: 800, color: stateColor }}>{trigger.amount} · {trigger.label}</span>
      <span style={{ ...chip(stateColor), fontSize: 7 }}>{trigger.state}</span>
    </div>
  );
}

function ActionCard({ action }: { action: CommandAction }) {
  const [open, setOpen] = useState(false);
  const { mode } = useAutopilot();
  const urgencyColor = URGENCY_COLOR[action.urgency];

  const effectiveStatus: ExecStatus =
    mode === 'autopilot' && action.execMode === 'auto' && action.execStatus === 'not-started' ? 'queued' :
    mode === 'assisted' && action.execMode === 'auto' && action.execStatus === 'not-started' ? 'queued' :
    action.execStatus;

  const esc = EXEC_STATUS_CFG[effectiveStatus];
  const ExecIcon = esc.icon;
  const isInProgress = effectiveStatus === 'in-progress';
  const isQueued = effectiveStatus === 'queued';
  const isAutoExecutable = action.execMode === 'auto' && mode === 'autopilot';
  const isManualOverride = mode === 'manual' && action.execMode === 'auto';

  const borderColor = open ? action.color + '28' : isInProgress ? action.color + '18' : isQueued ? action.color + '22' : 'rgba(255,255,255,0.07)';
  const borderLeftColor = isInProgress || isQueued ? action.color : action.color + '50';
  const glowShadow = isInProgress ? `0 0 12px ${action.color}08` : isQueued && isAutoExecutable ? `0 0 8px ${action.color}06` : 'none';

  return (
    <div style={{ background: '#0A0B0D', border: `1px solid ${borderColor}`, borderLeft: `2px solid ${borderLeftColor}`, borderRadius: 13, overflow: 'hidden', transition: 'border-color 0.2s', boxShadow: glowShadow }}>
      {isAutoExecutable && isQueued && (
        <div style={{ padding: '4px 16px', background: 'rgba(16,185,129,0.05)', borderBottom: '1px solid rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Cpu size={8} color="#10B981" />
          <span style={{ ...mono, fontSize: 8, color: '#10B981', fontWeight: 700, letterSpacing: '0.06em' }}>QUEUED FOR AUTO-EXECUTION</span>
        </div>
      )}
      {isManualOverride && action.execMode === 'auto' && (
        <div style={{ padding: '4px 16px', background: 'rgba(148,163,184,0.04)', borderBottom: '1px solid rgba(148,163,184,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ ...mono, fontSize: 8, color: 'rgba(148,163,184,0.5)', letterSpacing: '0.06em' }}>AUTO-EXEC PAUSED · MANUAL MODE</span>
        </div>
      )}
      <div style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 12 }} onClick={() => setOpen(v => !v)}>
        {/* Rank badge */}
        <div style={{ width: 26, height: 26, borderRadius: 8, background: `${action.color}14`, border: `1px solid ${action.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
          <span style={{ ...mono, fontSize: 10, fontWeight: 900, color: action.color }}>{action.rank}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{action.title}</span>
            <span style={{ ...chip(urgencyColor), fontSize: 7 }}>{action.urgency}</span>
            {/* Exec mode chip */}
            <span style={{ ...chip(action.execMode === 'auto' ? '#10B981' : action.execMode === 'one-click' ? '#06B6D4' : 'rgba(255,255,255,0.25)'), fontSize: 7 }}>
              {action.execMode === 'auto' ? '⚡ Auto' : action.execMode === 'one-click' ? '1-Click' : 'Manual'}
            </span>
          </div>

          {/* Exec status + progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: isInProgress ? 7 : 0 }}>
            <ExecIcon size={9} color={esc.color} />
            <span style={{ ...mono, fontSize: 8, color: esc.color, fontWeight: 700 }}>{esc.label}</span>
            {action.execDetail && <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>· {action.execDetail}</span>}
            {isInProgress && <LiveDot color={action.color} size={5} gap={2} />}
          </div>

          {isInProgress && action.execPct !== undefined && (
            <div style={{ marginTop: 4 }}>
              <ProgressBar pct={action.execPct} color={action.color} height={2} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexShrink: 0 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, marginBottom: 2 }}>Window</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: urgencyColor }}>{action.timeWindow}</div>
          </div>
          <ChevronRight size={12} color="rgba(255,255,255,0.25)" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
        </div>
      </div>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '13px 16px', animation: 'cos-slide 0.18s ease' }}>
          {/* Body */}
          <p style={{ margin: '0 0 12px', fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{action.body}</p>

          {/* Consequence */}
          {action.consequence && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 9, marginBottom: 12 }}>
              <TrendingDown size={10} color="#EF4444" />
              <span style={{ fontSize: 10, color: 'rgba(239,68,68,0.8)', fontWeight: 600 }}>{action.consequence}</span>
            </div>
          )}

          {/* Funding trigger */}
          {action.fundingTrigger && <FundingTriggerBadge trigger={action.fundingTrigger} />}

          {/* Simulation */}
          {action.simulation && <SimPanel sim={action.simulation} color={action.color} />}

          {/* Blockers */}
          {action.blockers && <BlockerPanel blockers={action.blockers} color={action.color} />}

          {/* Outcome */}
          <div style={{ background: `${action.color}07`, border: `1px solid ${action.color}18`, borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
            <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 4 }}>Projected Outcome · {action.confidence}% confidence</div>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{action.outcome}</p>
          </div>

          {/* Execute CTA */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {effectiveStatus === 'not-started' && <HoverBtn label="Execute Now" color={action.color} icon={Play} sm />}
            {effectiveStatus === 'queued' && mode === 'autopilot' && (
              <HoverBtn label="Auto-Execute Queued" color="#10B981" icon={Cpu} sm />
            )}
            {effectiveStatus === 'queued' && mode === 'assisted' && (
              <HoverBtn label="Approve & Execute" color="#F59E0B" icon={CheckCircle} sm />
            )}
            {effectiveStatus === 'in-progress' && <HoverBtn label="View Progress" color={action.color} icon={Cpu} sm />}
            {action.execMode === 'auto' && effectiveStatus !== 'complete' && (
              <HoverBtn label="Override" color="rgba(255,255,255,0.25)" icon={RotateCcw} sm />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type GroupFilter = CommandGroup | 'all';
const GROUPS: CommandGroup[] = ['active', 'blocked', 'funding', 'momentum'];

export function CommandCenter() {
  const [activeGroup, setActiveGroup] = useState<GroupFilter>('all');
  const { mode } = useAutopilot();
  const visible = activeGroup === 'all' ? ACTIONS : ACTIONS.filter(a => a.group === activeGroup);
  const autoQueueCount = ACTIONS.filter(a => a.execMode === 'auto').length;

  return (
    <div>
      {/* Autopilot header strip */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Brain size={12} color="rgba(255,255,255,0.3)" />
            <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              Command Center · {autoQueueCount} auto-eligible actions
            </span>
          </div>
          <AutopilotModeControl variant="compact" />
        </div>
        <AutopilotStatusStrip compact />
      </div>

      {/* Group filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setActiveGroup('all')}
          style={{ ...mono, fontSize: 8, padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', background: activeGroup === 'all' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${activeGroup === 'all' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`, color: activeGroup === 'all' ? '#fff' : 'rgba(255,255,255,0.3)' }}>
          All ({ACTIONS.length})
        </button>
        {GROUPS.map(g => {
          const cfg = GROUP_CFG[g];
          const count = ACTIONS.filter(a => a.group === g).length;
          return (
            <button key={g} onClick={() => setActiveGroup(g)}
              style={{ ...mono, fontSize: 8, padding: '4px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'inline-flex', alignItems: 'center', gap: 5, background: activeGroup === g ? `${cfg.color}12` : 'rgba(255,255,255,0.04)', border: `1px solid ${activeGroup === g ? cfg.color + '30' : 'rgba(255,255,255,0.07)'}`, color: activeGroup === g ? cfg.color : 'rgba(255,255,255,0.3)' }}>
              <cfg.icon size={8} />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {visible.map(a => <ActionCard key={a.id} action={a} />)}
      </div>

      <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 11, display: 'flex', alignItems: 'center', gap: 9 }}>
        <Brain size={11} color="#EF4444" />
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
          Actions ranked by urgency × confidence × time-sensitivity. Re-ranked every 6 hours. Simulations update as signals change.
        </span>
      </div>
    </div>
  );
}
