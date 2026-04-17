import { useState } from 'react';
import {
  X, Send, Zap, Brain,
  Activity, ArrowUpRight, CheckCircle,
  Users, Crown, Settings, Megaphone, Compass,
  Disc, ListTodo, PlayCircle, AlertTriangle, Clock, Eye,
  TrendingUp, Music, BarChart2, MessageSquare, ChevronRight,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import OperatorTeamGrid, { type AIOperatorDef } from './OperatorTeamGrid';

interface Props {
  artist: SignedArtist;
}

const STATUS_COLORS: Record<string, string> = {
  'Active':             '#10B981',
  'Monitoring':         '#06B6D4',
  'Running Campaign':   '#F59E0B',
  'Release Active':     '#EC4899',
  'Awaiting Approval':  '#EF4444',
  'Escalated':          '#EF4444',
  'Standby':            'rgba(255,255,255,0.25)',
};

type ActionType = 'approve' | 'execute' | 'queue' | 'review' | 'activate';

interface OperatorAction {
  label: string;
  type: ActionType;
  prompt: string;
}

interface AIOperator {
  id: string;
  name: string;
  specialty: string;
  roleTag: string;
  tierShort: string;
  tierLevel: 'Elite' | 'Master' | 'Senior' | 'Junior';
  color: string;
  Icon: React.ElementType;
  status: string;
  currentAssignment: string;
  latestActivity: string;
  recommendedAction: string;
  actions: OperatorAction[];
  suggestedMessages: string[];
  prompt: string;
}

const OPERATORS: AIOperator[] = [
  {
    id: 'apex',
    name: 'Apex',
    specialty: 'Leads high-level artist strategy, aligning releases, growth systems, partnerships, and long-term positioning into a unified execution plan.',
    roleTag: 'STRATEGY',
    tierShort: 'Elite Artist Rep',
    tierLevel: 'Elite',
    color: '#F59E0B',
    Icon: Crown,
    status: 'Active',
    currentAssignment: 'Aligning Q2 release and partnership priorities',
    latestActivity: 'Escalated release sequencing conflict between campaign spend and editorial timing',
    recommendedAction: 'Approve updated release path',
    actions: [
      { label: 'Approve', type: 'approve', prompt: 'Approve the updated Q2 release path' },
      { label: 'View Actions', type: 'queue', prompt: 'Show Apex\'s current action list' },
      { label: 'Ask for Help', type: 'review', prompt: 'Review my overall Q2 strategy with Apex' },
    ],
    suggestedMessages: [
      'Approve updated release path',
      'What partnerships should I pursue right now?',
      'Align my release and growth plan for Q2',
    ],
    prompt: 'Ask Apex about high-level strategy and positioning',
  },
  {
    id: 'velar',
    name: 'Velar',
    specialty: 'Supports release planning, rollout timing, editorial submissions, and coordinated execution across singles, EPs, and album cycles.',
    roleTag: 'RELEASE',
    tierShort: 'Release Strategy',
    tierLevel: 'Master',
    color: '#06B6D4',
    Icon: Music,
    status: 'Release Active',
    currentAssignment: 'Managing release architecture for Move Along Deluxe',
    latestActivity: 'Identified metadata and approval gaps blocking submission',
    recommendedAction: 'Review submission blocker list',
    actions: [
      { label: 'Review Blockers', type: 'review', prompt: 'Show me the submission blocker list for the current release' },
      { label: 'Open Queue', type: 'queue', prompt: 'Open Velar\'s current release queue' },
      { label: 'Ask for Help', type: 'review', prompt: 'Help me resolve the submission blockers' },
    ],
    suggestedMessages: [
      'Review submission blocker list now',
      'What is blocking the current editorial submission?',
      'Optimal release timing for the next single',
    ],
    prompt: 'Ask Velar about release timing and planning',
  },
  {
    id: 'mira',
    name: 'Mira',
    specialty: 'Identifies audience growth opportunities across fan development, engagement systems, geo expansion, and momentum building.',
    roleTag: 'GROWTH',
    tierShort: 'Audience Growth',
    tierLevel: 'Master',
    color: '#10B981',
    Icon: TrendingUp,
    status: 'Running Campaign',
    currentAssignment: 'Monitoring audience growth in LATAM and high-affinity segments',
    latestActivity: 'Detected conversion lift in Brazil creator cluster',
    recommendedAction: 'Activate growth expansion',
    actions: [
      { label: 'Activate Expansion', type: 'activate', prompt: 'Activate the LATAM audience growth expansion now' },
      { label: 'Open Queue', type: 'queue', prompt: 'Open Mira\'s current growth queue' },
      { label: 'Ask for Help', type: 'review', prompt: 'Where should I focus audience growth this month?' },
    ],
    suggestedMessages: [
      'Activate growth expansion in Brazil now',
      'Which geo markets are showing the strongest signals?',
      'How do I convert TikTok followers to Spotify listeners?',
    ],
    prompt: 'Ask Mira where to focus audience growth',
  },
  {
    id: 'flux',
    name: 'Flux',
    specialty: 'Connects release strategy, audience growth, and content systems to ensure momentum is sustained across platforms and campaigns.',
    roleTag: 'OPS',
    tierShort: 'Growth Operator',
    tierLevel: 'Senior',
    color: '#EC4899',
    Icon: Zap,
    status: 'Running Campaign',
    currentAssignment: 'Optimizing spend and momentum transfer',
    latestActivity: 'Flagged underperforming EU campaign and suggested budget reallocation',
    recommendedAction: 'Approve reallocation',
    actions: [
      { label: 'Approve Reallocation', type: 'approve', prompt: 'Approve the EU campaign budget reallocation' },
      { label: 'Open Queue', type: 'queue', prompt: 'Open Flux\'s campaign optimization queue' },
      { label: 'Ask for Help', type: 'review', prompt: 'Which creative variants are performing best right now?' },
    ],
    suggestedMessages: [
      'Approve EU budget reallocation now',
      'Which creative variants are performing best?',
      'Show me the current campaign ROAS breakdown',
    ],
    prompt: 'Ask Flux to optimize your marketing spend',
  },
  {
    id: 'axiom',
    name: 'Axiom',
    specialty: 'Supports day-to-day execution, team coordination, task follow-through, and operational consistency across the artist business.',
    roleTag: 'OPERATIONS',
    tierShort: 'Artist Operations',
    tierLevel: 'Senior',
    color: '#8B5CF6',
    Icon: Settings,
    status: 'Active',
    currentAssignment: 'Coordinating cross-functional execution',
    latestActivity: 'Detected 3 unresolved release dependencies',
    recommendedAction: 'Open operations queue',
    actions: [
      { label: 'Open Queue', type: 'queue', prompt: 'Open Axiom\'s operations queue' },
      { label: 'Execute', type: 'execute', prompt: 'Execute pending operational tasks now' },
      { label: 'Ask for Help', type: 'review', prompt: 'What are the most urgent operational tasks right now?' },
    ],
    suggestedMessages: [
      'Open operations queue and resolve blockers',
      'What are the 3 unresolved release dependencies?',
      'Clear my task backlog and prioritize next steps',
    ],
    prompt: 'Ask Axiom about operations and task coordination',
  },
  {
    id: 'forge',
    name: 'Forge',
    specialty: 'Coordinates marketing execution across releases, content, paid media, and audience touchpoints to maintain visibility and engagement.',
    roleTag: 'MARKETING',
    tierShort: 'Marketing Systems',
    tierLevel: 'Senior',
    color: '#EF4444',
    Icon: Megaphone,
    status: 'Running Campaign',
    currentAssignment: 'Managing release marketing systems',
    latestActivity: 'Queued paid media and channel distribution sequence',
    recommendedAction: 'Launch campaign workflow',
    actions: [
      { label: 'Launch Workflow', type: 'execute', prompt: 'Launch the campaign workflow now' },
      { label: 'Open Queue', type: 'queue', prompt: 'Open Forge\'s marketing queue' },
      { label: 'Ask for Help', type: 'review', prompt: 'What marketing actions should I take this week?' },
    ],
    suggestedMessages: [
      'Launch the campaign workflow now',
      'What paid media is queued for this release?',
      'What is my current paid media performance?',
    ],
    prompt: 'Ask Forge about marketing execution',
  },
  {
    id: 'sol',
    name: 'Sol',
    specialty: 'Supports content planning, catalog positioning, release-to-content alignment, and asset routing across the artist ecosystem.',
    roleTag: 'CONTENT',
    tierShort: 'Catalog & Content',
    tierLevel: 'Senior',
    color: '#22D3EE',
    Icon: Disc,
    status: 'Active',
    currentAssignment: 'Routing content and catalog alignment',
    latestActivity: 'Scheduled post-release content sequence and updated asset map',
    recommendedAction: 'Approve content plan',
    actions: [
      { label: 'Approve Plan', type: 'approve', prompt: 'Approve the post-release content plan' },
      { label: 'Open Queue', type: 'queue', prompt: 'Open Sol\'s content queue' },
      { label: 'Ask for Help', type: 'review', prompt: 'What content is scheduled and performing best right now?' },
    ],
    suggestedMessages: [
      'Approve the post-release content plan',
      'What content is scheduled for this week?',
      'Show me the asset routing map',
    ],
    prompt: 'Ask Sol about content scheduling and catalog positioning',
  },
  {
    id: 'lyric',
    name: 'Lyric',
    specialty: 'Tracks live performance, content rhythm, audience response, and campaign pacing to strengthen the growth loop.',
    roleTag: 'PERFORMANCE',
    tierShort: 'Performance',
    tierLevel: 'Junior',
    color: '#84CC16',
    Icon: BarChart2,
    status: 'Monitoring',
    currentAssignment: 'Monitoring pacing and performance signals',
    latestActivity: 'Detected drop in content rhythm and weaker engagement cadence',
    recommendedAction: 'Adjust publishing cadence',
    actions: [
      { label: 'Adjust Cadence', type: 'execute', prompt: 'Adjust the publishing cadence based on Lyric\'s signal' },
      { label: 'View Actions', type: 'queue', prompt: 'Show Lyric\'s current performance monitoring data' },
      { label: 'Ask for Help', type: 'review', prompt: 'What is my streaming performance telling me this week?' },
    ],
    suggestedMessages: [
      'Show me the engagement cadence drop in detail',
      'Which songs are driving the most velocity?',
      'What does my playlist add velocity look like?',
    ],
    prompt: 'Ask Lyric about your performance data',
  },
  {
    id: 'rune',
    name: 'Rune',
    specialty: 'Helps guide long-range decisions across timing, priorities, sequencing, and broader strategic positioning.',
    roleTag: 'DIRECTION',
    tierShort: 'Career Direction',
    tierLevel: 'Junior',
    color: '#F97316',
    Icon: Compass,
    status: 'Monitoring',
    currentAssignment: 'Tracking long-range positioning',
    latestActivity: 'Flagged timing conflict between short-term campaign push and larger catalog strategy',
    recommendedAction: 'Review strategic priority',
    actions: [
      { label: 'Review Priority', type: 'review', prompt: 'Review the strategic priority conflict Rune flagged' },
      { label: 'View Actions', type: 'queue', prompt: 'Show Rune\'s current long-range monitoring signals' },
      { label: 'Ask for Help', type: 'review', prompt: 'What are the most important long-term decisions I need to make now?' },
    ],
    suggestedMessages: [
      'Explain the timing conflict Rune flagged',
      'Help me sequence the next 6 months',
      'What long-term moves should I prioritize right now?',
    ],
    prompt: 'Ask Rune about long-term career direction',
  },
];

const TIER_COLORS: Record<string, { color: string; bg: string }> = {
  Elite:  { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  Master: { color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' },
  Senior: { color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
  Junior: { color: 'rgba(255,255,255,0.38)', bg: 'rgba(255,255,255,0.05)' },
};

const ACTION_STYLES: Record<ActionType, { bg: string; border: string; color: string }> = {
  approve:  { bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)',  color: '#10B981' },
  execute:  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)',  color: '#F59E0B' },
  queue:    { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' },
  review:   { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.32)' },
  activate: { bg: 'rgba(236,72,153,0.10)',  border: 'rgba(236,72,153,0.22)',  color: '#EC4899' },
};

const ACTION_ICONS: Record<ActionType, React.ElementType> = {
  approve:  CheckCircle,
  execute:  PlayCircle,
  queue:    ListTodo,
  review:   Eye,
  activate: Zap,
};

interface HumanRep {
  name: string;
  role: string;
  initials: string;
  color: string;
}

const HUMAN_REPS: HumanRep[] = [
  { name: 'Tiffany', role: 'Artist Support — Generalist', initials: 'T', color: '#10B981' },
  { name: 'Angie',   role: 'Artist Support — Generalist', initials: 'A', color: '#06B6D4' },
  { name: 'Mar',     role: 'Artist Support — Generalist', initials: 'M', color: '#F59E0B' },
];

interface FeedItem {
  id: string;
  label: string;
  repName: string;
  repColor: string;
  type: 'campaign' | 'signal' | 'action' | 'alert';
  ts: string;
}

const FEED_ITEMS: FeedItem[] = [
  { id: 'f1', label: 'LATAM audience growth expansion queued — awaiting approval', repName: 'Mira',  repColor: '#10B981', type: 'alert',    ts: '2m ago' },
  { id: 'f2', label: 'Metadata gaps detected blocking editorial submission', repName: 'Velar', repColor: '#06B6D4', type: 'alert',    ts: '8m ago' },
  { id: 'f3', label: 'EU campaign underperforming — budget reallocation flagged', repName: 'Flux',  repColor: '#EC4899', type: 'signal',   ts: '22m ago' },
  { id: 'f4', label: 'Post-release content sequence scheduled and asset map updated', repName: 'Sol',   repColor: '#22D3EE', type: 'action',   ts: '45m ago' },
  { id: 'f5', label: 'Content rhythm drop detected — publishing cadence weakening', repName: 'Lyric', repColor: '#84CC16', type: 'signal',   ts: '1h ago' },
  { id: 'f6', label: 'Campaign workflow queued — paid media ready to launch', repName: 'Forge', repColor: '#EF4444', type: 'campaign',  ts: '2h ago' },
  { id: 'f7', label: 'Q2 release sequencing conflict escalated for review', repName: 'Apex',  repColor: '#F59E0B', type: 'alert',    ts: '3h ago' },
];

const TYPE_DOT: Record<FeedItem['type'], string> = {
  campaign: '#F59E0B',
  signal:   '#06B6D4',
  action:   '#10B981',
  alert:    '#EF4444',
};

interface RepModalProps {
  op: AIOperator;
  artist: SignedArtist;
  onClose: () => void;
  initialMessage?: string;
}

function RepModal({ op, artist, onClose, initialMessage }: RepModalProps) {
  const [message, setMessage] = useState(initialMessage || '');
  const [submitted, setSubmitted] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const Icon = op.Icon;
  const tierMeta = TIER_COLORS[op.tierLevel];
  const statusColor = STATUS_COLORS[op.status] || 'rgba(255,255,255,0.25)';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="bg-[#0D0E11] border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
          style={{ borderColor: `${op.color}30` }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{ background: `${op.color}14`, borderColor: `${op.color}30` }}>
            <CheckCircle className="w-7 h-7" style={{ color: op.color }} />
          </div>
          <p className="text-[16px] font-bold text-white mb-1">Sent to {op.name}</p>
          <p className="text-[12px] text-white/40 mb-4">{op.name} has received your request and is processing.</p>
          {escalated && (
            <div className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07] mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-[10px] font-mono text-[#10B981]/70">Escalated to GMG team</span>
            </div>
          )}
          <button onClick={onClose} className="text-[11px] font-mono text-white/35 hover:text-white/55 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0D0E11] border border-white/[0.10] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        style={{ position: 'relative' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, transparent, ${op.color}50, transparent)` }} />

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]"
          style={{ background: `${op.color}06` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border"
              style={{ background: `${op.color}14`, borderColor: `${op.color}30` }}>
              <Icon className="w-5 h-5" style={{ color: op.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-bold text-white">{op.name}</p>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                  style={{ color: op.color, background: `${op.color}12`, borderColor: `${op.color}25` }}>
                  {op.roleTag}
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                  style={{ color: tierMeta.color, background: tierMeta.bg }}>
                  {op.tierShort.toUpperCase()}
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1"
                  style={{ color: statusColor, background: `${statusColor}14` }}>
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: statusColor }} />
                  {op.status}
                </span>
              </div>
              <p className="text-[10px] text-white/35 mt-0.5">{op.tierShort} · {artist.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-[11px] text-white/40 leading-relaxed">{op.specialty}</p>

          {/* Execution status */}
          <div className="grid grid-cols-1 gap-2">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8px] font-mono uppercase tracking-wider mb-1.5" style={{ color: `${op.color}70` }}>Current Assignment</p>
              <p className="text-[11px] text-white/60 leading-snug">{op.currentAssignment}</p>
            </div>
            <div className="p-3 rounded-xl border" style={{ background: 'rgba(239,68,68,0.04)', borderColor: 'rgba(239,68,68,0.10)' }}>
              <p className="text-[8px] font-mono uppercase tracking-wider text-[#EF4444]/50 mb-1.5">Latest Activity</p>
              <p className="text-[11px] text-white/55 leading-snug">{op.latestActivity}</p>
            </div>
            <div className="p-3 rounded-xl border" style={{ background: `${op.color}06`, borderColor: `${op.color}18` }}>
              <p className="text-[8px] font-mono uppercase tracking-wider mb-1.5" style={{ color: `${op.color}70` }}>Recommended Next Action</p>
              <p className="text-[11px] font-semibold leading-snug" style={{ color: op.color }}>{op.recommendedAction}</p>
            </div>
          </div>

          <div>
            <p className="text-[8px] font-mono text-white/25 uppercase tracking-wider mb-2">Quick Requests</p>
            <div className="space-y-1.5">
              {op.suggestedMessages.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMessage(a)}
                  className="w-full text-left px-3 py-2 rounded-xl border text-[11px] transition-all"
                  style={message === a
                    ? { color: op.color, background: `${op.color}10`, borderColor: `${op.color}28` }
                    : { color: 'rgba(255,255,255,0.40)', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }
                  }
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[8px] font-mono text-white/25 uppercase tracking-wider mb-2">Your Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={op.prompt}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.025] border border-white/[0.07] text-[12px] text-white/75 placeholder-white/20 outline-none transition-colors resize-none leading-relaxed"
                style={{ borderColor: message ? `${op.color}28` : undefined }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-semibold transition-all border"
                style={{
                  color: message.trim() ? op.color : 'rgba(255,255,255,0.2)',
                  background: message.trim() ? `${op.color}14` : 'rgba(255,255,255,0.02)',
                  borderColor: message.trim() ? `${op.color}30` : 'rgba(255,255,255,0.06)',
                  cursor: message.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                <Send className="w-3.5 h-3.5" />
                Send to {op.name}
              </button>
              <button
                type="button"
                onClick={() => { setEscalated(true); setSubmitted(true); }}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[10px] font-mono text-white/30 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] transition-all"
              >
                <ArrowUpRight className="w-3 h-3" />
                Escalate to GMG
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


export default function AIRepsPanel({ artist }: Props) {
  const [activeOp, setActiveOp] = useState<AIOperator | null>(null);
  const [prefillMessage, setPrefillMessage] = useState('');
  const [humanActionDone, setHumanActionDone] = useState<string | null>(null);

  function openOp(op: AIOperator, msg = '') {
    setActiveOp(op);
    setPrefillMessage(msg);
  }

  function handleGridAction(opDef: AIOperatorDef) {
    const matched = OPERATORS.find(o => o.id === opDef.id);
    if (matched) openOp(matched);
  }

  function fireHumanAction(label: string) {
    setHumanActionDone(label);
    setTimeout(() => setHumanActionDone(null), 2000);
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Header */}
        <div style={{ padding: '14px 18px 12px', marginBottom: 14, background: 'rgba(6,182,212,0.03)', border: '1px solid rgba(6,182,212,0.10)', borderRadius: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain size={14} color="#06B6D4" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>AI Operator Team</h3>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>9 Operators · Executable · Always running for {artist.name}</p>
            </div>
          </div>
        </div>

        <OperatorTeamGrid variant="artist" onOperatorAction={handleGridAction} />

        {/* Human Support Team */}
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={13} color="rgba(255,255,255,0.35)" />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Support Team (GMG)</span>
            </div>
          </div>
          <div>
            {HUMAN_REPS.map((rep, i) => (
              <div
                key={rep.name}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < HUMAN_REPS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: `${rep.color}12`, border: `1px solid ${rep.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: rep.color }}>{rep.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>{rep.name}</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>{rep.role}</p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => fireHumanAction(`${rep.name} — Support request sent`)}
                    style={{ fontSize: 9, padding: '5px 11px', borderRadius: 7, cursor: 'pointer', background: `${rep.color}10`, border: `1px solid ${rep.color}20`, color: rep.color, fontWeight: 600 }}
                  >
                    {humanActionDone?.startsWith(rep.name) && humanActionDone.includes('Support') ? 'Sent' : 'Request Support'}
                  </button>
                  <button
                    onClick={() => fireHumanAction(`${rep.name} — Message sent`)}
                    style={{ fontSize: 9, padding: '5px 11px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
                  >
                    {humanActionDone?.startsWith(rep.name) && humanActionDone.includes('Message') ? 'Sent' : 'Message Team'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeOp && (
        <RepModal
          op={activeOp}
          artist={artist}
          initialMessage={prefillMessage}
          onClose={() => { setActiveOp(null); setPrefillMessage(''); }}
        />
      )}
    </>
  );
}
