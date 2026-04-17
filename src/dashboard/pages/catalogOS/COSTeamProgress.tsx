import { useState } from 'react';
import {
  Activity, Users, Bot, CheckCircle2, Clock, AlertTriangle,
  TrendingUp, BarChart2, Mail, Inbox, Zap, ArrowRight,
  Video, Calendar, FileText, ChevronDown, ChevronUp,
  User, Flag, Target, RefreshCw, ExternalLink, Shield,
  Megaphone, Music2, ShoppingBag, Plane, Scale, DollarSign,
  Globe, Heart, Star, Plus,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useTasks } from '../../context/TaskContext';

const ACCENT = '#10B981';

// ─── Static mock data ───────────────────────────────────────────────────────

const WEEK_STATS = {
  completed_this_week: 14,
  in_progress: 8,
  blocked: 2,
  ai_hours: 38.5,
  human_hours: 22.0,
  monthly_completed: 52,
  monthly_ai_hours: 148,
  monthly_human_hours: 89,
  avg_response_hrs: 1.4,
  avg_completion_days: 2.8,
  open_tasks: 8,
  resolved_tasks: 52,
  weekly_throughput: 14,
};

const DEPT_SPLIT = [
  { label: 'Marketing',      pct: 28, color: '#10B981', icon: Megaphone   },
  { label: 'Sync / Licensing', pct: 18, color: '#F59E0B', icon: Music2      },
  { label: 'Merch & Products', pct: 14, color: '#06B6D4', icon: ShoppingBag },
  { label: 'Touring',        pct: 8,  color: '#3B82F6', icon: Plane        },
  { label: 'Legal',          pct: 10, color: '#EF4444', icon: Scale        },
  { label: 'Finance / Acctg',pct: 12, color: '#8B5CF6', icon: DollarSign   },
  { label: 'Content / Web',  pct: 6,  color: '#EC4899', icon: Globe        },
  { label: 'Fan Community',  pct: 2,  color: '#F97316', icon: Heart        },
  { label: 'Brand / Press',  pct: 2,  color: '#A3E635', icon: Star         },
];

const WORK_BY_CATEGORY = [
  {
    category: 'Marketing',
    icon: Megaphone,
    color: '#10B981',
    items: [
      { title: 'Spotify editorial pitch — Bassnectar catalog playlist',   status: 'completed', owner: 'AI Operator',    due: 'Apr 11' },
      { title: 'YouTube paid ad campaign — 3 creatives live',             status: 'completed', owner: 'Human Team',     due: 'Apr 12' },
      { title: 'Apple Music editorial outreach — reissue campaign',       status: 'in_progress', owner: 'AI Operator',  due: 'Apr 17' },
      { title: 'Fan re-engagement email draft',                           status: 'in_progress', owner: 'Human Team',   due: 'Apr 18' },
    ],
  },
  {
    category: 'Sync / Licensing',
    icon: Music2,
    color: '#F59E0B',
    items: [
      { title: 'Netflix music supervisor intro — submitted brief',         status: 'completed',    owner: 'Human Team',   due: 'Apr 9'  },
      { title: 'TV license inquiry — HBO documentary track clearance',     status: 'in_progress',  owner: 'Human Team',   due: 'Apr 20' },
      { title: 'Advertising sync brief — submitted to 4 agencies',        status: 'completed',    owner: 'AI Operator',  due: 'Apr 10' },
    ],
  },
  {
    category: 'Merch & Products',
    icon: ShoppingBag,
    color: '#06B6D4',
    items: [
      { title: 'Spring drop product line finalized — 3 SKUs approved',    status: 'completed',    owner: 'Human Team',   due: 'Apr 8'  },
      { title: 'E-commerce product descriptions updated',                 status: 'completed',    owner: 'AI Operator',  due: 'Apr 9'  },
      { title: 'Fulfillment partner integration QA',                      status: 'in_progress',  owner: 'Human Team',   due: 'Apr 19' },
    ],
  },
  {
    category: 'Legal',
    icon: Scale,
    color: '#EF4444',
    items: [
      { title: 'Master license agreement draft — attorney review',        status: 'in_progress',  owner: 'Human Team',   due: 'Apr 22' },
      { title: 'Publishing sub-publishing agreement renewal',             status: 'blocked',      owner: 'Human Team',   due: 'Apr 15' },
    ],
  },
  {
    category: 'Finance / Accounting',
    icon: DollarSign,
    color: '#8B5CF6',
    items: [
      { title: 'March royalty statement reconciled',                      status: 'completed',    owner: 'AI Operator',  due: 'Apr 10' },
      { title: 'Q1 revenue summary prepared for artist review',           status: 'completed',    owner: 'Human Team',   due: 'Apr 11' },
      { title: 'Advance recoupment calculation updated',                  status: 'in_progress',  owner: 'AI Operator',  due: 'Apr 16' },
    ],
  },
  {
    category: 'Content / Website',
    icon: Globe,
    color: '#EC4899',
    items: [
      { title: 'Artist bio updated — 2026 narrative',                     status: 'completed',    owner: 'AI Operator',  due: 'Apr 9'  },
      { title: 'Press page asset refresh',                                status: 'in_progress',  owner: 'Human Team',   due: 'Apr 17' },
    ],
  },
  {
    category: 'Fan Community',
    icon: Heart,
    color: '#F97316',
    items: [
      { title: 'Fan Discord mod protocol updated',                        status: 'completed',    owner: 'Human Team',   due: 'Apr 12' },
    ],
  },
  {
    category: 'Brand / Press',
    icon: Star,
    color: '#A3E635',
    items: [
      { title: 'Rolling Stone feature pitch submitted',                   status: 'completed',    owner: 'Human Team',   due: 'Apr 8'  },
    ],
  },
  {
    category: 'Touring',
    icon: Plane,
    color: '#3B82F6',
    items: [
      { title: '2026 tour routing research — 8 cities mapped',            status: 'in_progress',  owner: 'AI Operator',  due: 'Apr 25' },
    ],
  },
];

const INBOUND_EMAIL_LOG = [
  { id: 1, subject: 'Q1 performance question — streaming breakdown',  sender: 'Attorney',       received: '2 days ago', status: 'task_created',  assigned: 'Finance Team'  },
  { id: 2, subject: 'New sync opportunity — major ad campaign brief', sender: 'Manager',        received: '3 days ago', status: 'task_created',  assigned: 'Sync Team'     },
  { id: 3, subject: 'Fan community moderation issue flagged',         sender: 'Community Mod',  received: '4 days ago', status: 'task_created',  assigned: 'Ops Team'      },
  { id: 4, subject: 'Spring merch restock request',                   sender: 'Merch Partner',  received: '5 days ago', status: 'task_created',  assigned: 'Merch Team'    },
  { id: 5, subject: 'Music supervisor inquiry — TV placement',        sender: 'Music Supervisor', received: '1 week ago', status: 'task_created', assigned: 'Sync Team'    },
];

const ALL_HANDS_MEETINGS = [
  {
    id: 'm1',
    title: 'Q2 Kick-Off — Bassnectar Catalog Strategy',
    date: 'April 10, 2026',
    time: '11:00 AM PT',
    video_link: '#',
    status: 'completed',
    summary: 'Reviewed Q1 performance, aligned on Q2 marketing priorities, confirmed spring merch drop timeline, and discussed sync pipeline.',
    attendees: ['Randy Jackson (GMG)', 'Paula Moore (GMG)', 'Sarah Bloom, Esq.', 'Artist Manager', 'Finance Lead'],
    action_items: [
      { item: 'Submit 3 new editorial pitches to Spotify & Apple Music', owner: 'AI Operator', status: 'completed' },
      { item: 'Finalize spring merch SKUs and confirm fulfillment partner', owner: 'Human Team', status: 'completed' },
      { item: 'Prepare Q1 royalty reconciliation report', owner: 'Finance Lead', status: 'completed' },
      { item: 'Draft attorney communication re: sub-publishing renewal', owner: 'Human Team', status: 'in_progress' },
    ],
    next_steps: 'Next meeting scheduled April 24. Finance summary and sync pipeline review on agenda.',
  },
  {
    id: 'm2',
    title: 'Monthly Operations Check-In',
    date: 'April 24, 2026',
    time: '11:00 AM PT',
    video_link: '#',
    status: 'upcoming',
    summary: '',
    attendees: ['Randy Jackson (GMG)', 'Paula Moore (GMG)', 'Artist Manager'],
    action_items: [],
    next_steps: 'Agenda: sync pipeline review, summer campaign planning, merch Q2 restock.',
  },
];

const STATUS_META: Record<string, { color: string; label: string; bg: string }> = {
  completed:   { color: '#10B981', label: 'Completed',   bg: '#10B98118' },
  in_progress: { color: '#06B6D4', label: 'In Progress', bg: '#06B6D418' },
  blocked:     { color: '#EF4444', label: 'Blocked',     bg: '#EF444418' },
  upcoming:    { color: '#F59E0B', label: 'Upcoming',    bg: '#F59E0B18' },
  task_created:{ color: '#10B981', label: 'Task Created',bg: '#10B98118' },
  pending:     { color: '#6B7280', label: 'Pending',     bg: '#6B728018' },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ index, label, accent = ACCENT }: { index: string; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}55` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0" style={{ color: `${accent}80` }}>{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function StatTile({
  label, value, sub, color = ACCENT, icon: Icon,
}: { label: string; value: string | number; sub?: string; color?: string; icon: React.ElementType }) {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}35, transparent)` }} />
      <div className="flex items-start justify-between mb-2">
        <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest leading-tight">{label}</p>
        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: `${color}70` }} />
      </div>
      <p className="text-[24px] font-bold leading-none" style={{ color }}>{value}</p>
      {sub && <p className="text-[9.5px] text-white/30 mt-1.5 font-mono">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] ?? STATUS_META.pending;
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-mono font-semibold uppercase tracking-wide"
      style={{ color: m.color, background: m.bg }}>
      {m.label}
    </span>
  );
}

function CategorySection({ cat, defaultOpen = false }: { cat: typeof WORK_BY_CATEGORY[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const CatIcon = cat.icon;
  const completedCount = cat.items.filter(i => i.status === 'completed').length;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${cat.color}14`, border: `1px solid ${cat.color}25` }}>
          <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-white/80">{cat.category}</p>
          <p className="text-[9.5px] text-white/30 font-mono">{completedCount}/{cat.items.length} complete this week</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {cat.items.filter(i => i.status === 'blocked').length > 0 && (
            <span className="flex items-center gap-1 text-[9px] font-mono text-[#EF4444]">
              <AlertTriangle className="w-3 h-3" />
              {cat.items.filter(i => i.status === 'blocked').length} blocked
            </span>
          )}
          <div className="w-20 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${(completedCount / cat.items.length) * 100}%`, background: cat.color }} />
          </div>
          {open ? <ChevronUp className="w-3.5 h-3.5 text-white/25" /> : <ChevronDown className="w-3.5 h-3.5 text-white/25" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
          {cat.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors">
              <div className="w-1 h-1 rounded-full shrink-0 mt-0.5" style={{ background: cat.color, opacity: 0.5 }} />
              <p className="flex-1 text-[11.5px] text-white/65 leading-snug min-w-0">{item.title}</p>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[9.5px] text-white/25 font-mono hidden sm:block">{item.owner}</span>
                <span className="text-[9px] text-white/20 font-mono hidden md:block">{item.due}</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting, defaultOpen = false }: { meeting: typeof ALL_HANDS_MEETINGS[0]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const isCompleted = meeting.status === 'completed';

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: isCompleted ? '#10B98114' : '#F59E0B14', border: `1px solid ${isCompleted ? '#10B98125' : '#F59E0B25'}` }}>
          <Video className="w-4 h-4" style={{ color: isCompleted ? '#10B981' : '#F59E0B' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-[12.5px] font-semibold text-white/85">{meeting.title}</h3>
            <StatusBadge status={meeting.status} />
          </div>
          <p className="text-[10.5px] text-white/35">{meeting.date} · {meeting.time}</p>
          {isCompleted && (
            <p className="text-[10px] text-white/25 mt-1 line-clamp-1">{meeting.summary}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {meeting.video_link && meeting.video_link !== '#' && (
            <a href={meeting.video_link} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-[9.5px] text-white/35 hover:text-[#06B6D4] hover:bg-[#06B6D4]/08 border border-white/[0.07] transition-all">
              <ExternalLink className="w-3 h-3" /> Watch
            </a>
          )}
          {open ? <ChevronUp className="w-3.5 h-3.5 text-white/25" /> : <ChevronDown className="w-3.5 h-3.5 text-white/25" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-white/[0.05] px-5 py-4 space-y-4">
          {meeting.summary && (
            <div>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1.5">Meeting Summary</p>
              <p className="text-[11.5px] text-white/55 leading-relaxed">{meeting.summary}</p>
            </div>
          )}

          <div>
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Attendees</p>
            <div className="flex flex-wrap gap-2">
              {meeting.attendees.map((a, i) => (
                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[10px] text-white/50">
                  <User className="w-2.5 h-2.5 text-white/25" />{a}
                </span>
              ))}
            </div>
          </div>

          {meeting.action_items.length > 0 && (
            <div>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Action Items</p>
              <div className="space-y-2">
                {meeting.action_items.map((ai, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.025] border border-white/[0.05]">
                    <div className="mt-0.5">
                      {ai.status === 'completed'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        : <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/70 leading-snug">{ai.item}</p>
                      <p className="text-[9.5px] text-white/30 font-mono mt-0.5">Owner: {ai.owner}</p>
                    </div>
                    <StatusBadge status={ai.status} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {meeting.next_steps && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#10B981]/05 border border-[#10B981]/15">
              <ArrowRight className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <p className="text-[9px] font-mono text-[#10B981]/60 uppercase tracking-widest mb-0.5">Next Steps</p>
                <p className="text-[11px] text-white/55 leading-relaxed">{meeting.next_steps}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function COSTeamProgress() {
  const { openSubmit } = useTasks();

  const aiPct = Math.round((WEEK_STATS.ai_hours / (WEEK_STATS.ai_hours + WEEK_STATS.human_hours)) * 100);
  const humanPct = 100 - aiPct;
  const resolvedPct = Math.round((WEEK_STATS.resolved_tasks / (WEEK_STATS.open_tasks + WEEK_STATS.resolved_tasks)) * 100);

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Activity}
        title="Team Progress + Workflow"
        subtitle="Live view of work being done on your catalog — marketing, legal, sync, merch, and more"
        accentColor={ACCENT}
        badge="LIVE"
        actions={
          <button
            onClick={() => openSubmit('catalog_os', 'Bassnectar / Amorphous Music')}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
            style={{ background: ACCENT, color: '#000' }}
          >
            <Plus className="w-3.5 h-3.5" /> Submit Request
          </button>
        }
      />

      <div className="p-5 space-y-10 max-w-[1080px]">

        {/* ── SECTION 01: ARTIST-FACING CLARITY ── */}
        <section>
          <SectionLabel index="01" label="What Is Happening Right Now" accent={ACCENT} />
          <div className="bg-[#0B0D10] border border-[#10B981]/20 rounded-xl p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: '#10B98114', border: '1px solid #10B98125' }}>
                <Shield className="w-3.5 h-3.5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white/85 mb-1">Your GMG team is actively working on your catalog.</p>
                <p className="text-[11.5px] text-white/45 leading-relaxed max-w-xl">
                  This page shows you exactly what is in motion — no need to email or call to find out. Every task, every department,
                  every meeting action item is tracked here in real time.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {[
                { label: 'Tasks completed this week', value: WEEK_STATS.completed_this_week, color: '#10B981', icon: CheckCircle2 },
                { label: 'Tasks in progress now',     value: WEEK_STATS.in_progress,          color: '#06B6D4', icon: RefreshCw   },
                { label: 'Blocked — needs attention', value: WEEK_STATS.blocked,               color: '#EF4444', icon: AlertTriangle },
                { label: 'Completed this month',      value: WEEK_STATS.monthly_completed,     color: '#F59E0B', icon: Target       },
              ].map(item => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.label} className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <ItemIcon className="w-4 h-4 mb-2" style={{ color: item.color }} />
                    <p className="text-[22px] font-bold leading-none mb-1" style={{ color: item.color }}>{item.value}</p>
                    <p className="text-[9.5px] text-white/30 font-mono leading-snug">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 02: TEAM EXECUTION DASHBOARD ── */}
        <section>
          <SectionLabel index="02" label="Team Execution Dashboard" accent={ACCENT} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatTile label="AI Operator Hours / Week" value={`${WEEK_STATS.ai_hours}h`}     sub="Automated ops, outreach, analysis" color="#10B981" icon={Bot}          />
              <StatTile label="Human Team Hours / Week"  value={`${WEEK_STATS.human_hours}h`}  sub="Strategy, legal, creative, sync"  color="#06B6D4" icon={Users}        />
              <StatTile label="Monthly AI Hours"         value={`${WEEK_STATS.monthly_ai_hours}h`}    sub="Rolling 30-day total"    color="#F59E0B" icon={Zap}           />
              <StatTile label="Monthly Human Hours"      value={`${WEEK_STATS.monthly_human_hours}h`} sub="Rolling 30-day total"    color="#8B5CF6" icon={User}          />
            </div>

            {/* AI vs Human split bar */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-3">AI vs Human Effort Split — This Week</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-[#10B981] w-12">{aiPct}% AI</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/[0.06] overflow-hidden flex">
                  <div className="h-full rounded-l-full transition-all" style={{ width: `${aiPct}%`, background: '#10B981' }} />
                  <div className="h-full rounded-r-full transition-all" style={{ width: `${humanPct}%`, background: '#06B6D4' }} />
                </div>
                <span className="text-[11px] font-mono text-[#06B6D4] w-14 text-right">{humanPct}% Human</span>
              </div>
              <p className="text-[9.5px] text-white/20">
                AI handles research, outreach drafts, reporting, and triage. Human team manages legal, creative decisions, relationship calls, and approvals.
              </p>
            </div>

            {/* Department split */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-4">Department Work Split — This Week</p>
              <div className="space-y-2.5">
                {DEPT_SPLIT.map(dept => {
                  const DeptIcon = dept.icon;
                  return (
                    <div key={dept.label} className="flex items-center gap-3">
                      <DeptIcon className="w-3 h-3 shrink-0" style={{ color: dept.color }} />
                      <span className="text-[10.5px] text-white/50 w-36 shrink-0">{dept.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${dept.pct}%`, background: dept.color }} />
                      </div>
                      <span className="text-[10px] font-mono shrink-0 w-8 text-right" style={{ color: dept.color }}>{dept.pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 03: WORK BY CATEGORY ── */}
        <section>
          <SectionLabel index="03" label="Work By Category" accent="#06B6D4" />
          <div className="space-y-2.5">
            {WORK_BY_CATEGORY.map((cat, i) => (
              <CategorySection key={cat.category} cat={cat} defaultOpen={i < 2} />
            ))}
          </div>
        </section>

        {/* ── SECTION 04: EFFICIENCY DISPLAY ── */}
        <section>
          <SectionLabel index="04" label="Efficiency Metrics" accent="#F59E0B" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatTile label="Avg Response Time"  value={`${WEEK_STATS.avg_response_hrs}h`}   sub="From request to first action"  color="#F59E0B" icon={Clock}      />
            <StatTile label="Avg Completion"     value={`${WEEK_STATS.avg_completion_days}d`} sub="Request to completed task"     color="#10B981" icon={CheckCircle2} />
            <StatTile label="Weekly Throughput"  value={WEEK_STATS.weekly_throughput}          sub="Tasks closed this week"        color="#06B6D4" icon={TrendingUp}  />
            <StatTile label="Resolution Rate"    value={`${resolvedPct}%`}                    sub={`${WEEK_STATS.resolved_tasks} resolved / ${WEEK_STATS.open_tasks} open`} color="#8B5CF6" icon={BarChart2} />
          </div>
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
            <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-4">Open vs Resolved — Rolling 30 Days</p>
            <div className="flex items-end gap-2 h-16">
              {[
                { label: 'Open',     value: WEEK_STATS.open_tasks,     color: '#06B6D4' },
                { label: 'Resolved', value: WEEK_STATS.resolved_tasks, color: '#10B981' },
              ].map(bar => {
                const maxH = Math.max(WEEK_STATS.open_tasks, WEEK_STATS.resolved_tasks);
                return (
                  <div key={bar.label} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[11px] font-bold" style={{ color: bar.color }}>{bar.value}</span>
                    <div className="w-full rounded-t" style={{ height: `${(bar.value / maxH) * 40}px`, background: bar.color, opacity: 0.7 }} />
                    <span className="text-[9px] font-mono text-white/25">{bar.label}</span>
                  </div>
                );
              })}
              <div className="flex-[3]" />
            </div>
          </div>
        </section>

        {/* ── SECTION 05: EMAIL-TO-WORKFLOW LOGIC ── */}
        <section>
          <SectionLabel index="05" label="Email → Workflow System" accent="#06B6D4" />
          <div className="space-y-3">
            {/* How it works */}
            <div className="bg-[#0B0D10] border border-[#06B6D4]/20 rounded-xl p-5">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: '#06B6D414', border: '1px solid #06B6D425' }}>
                  <Mail className="w-5 h-5 text-[#06B6D4]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/85 mb-0.5">Dedicated Catalog Email</p>
                  <p className="text-[16px] font-bold text-[#06B6D4] font-mono tracking-tight">bn@greatermusicgroupteam.com</p>
                  <p className="text-[10.5px] text-white/35 mt-1">
                    All inbound requests, questions, and approvals sent to this address are automatically captured into workflow.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { step: '01', label: 'Email Received',      desc: 'Sent to bn@greatermusicgroupteam.com',          icon: Inbox,         color: '#06B6D4' },
                  { step: '02', label: 'AI Triage',           desc: 'Classified by department, priority, and type',  icon: Bot,           color: '#10B981' },
                  { step: '03', label: 'Task Assigned',       desc: 'Routed to the correct team member or operator', icon: ArrowRight,    color: '#F59E0B' },
                  { step: '04', label: 'Visible Here',        desc: 'Status tracked on this page in real time',      icon: Activity,      color: '#8B5CF6' },
                ].map(s => {
                  const StepIcon = s.icon;
                  return (
                    <div key={s.step} className="flex items-start gap-2.5 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${s.color}14`, border: `1px solid ${s.color}25` }}>
                        <StepIcon className="w-3 h-3" style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-[9px] font-mono text-white/20 mb-0.5">{s.step}</p>
                        <p className="text-[11px] font-semibold text-white/70">{s.label}</p>
                        <p className="text-[9.5px] text-white/30 mt-0.5 leading-snug">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent inbound log */}
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-3">Recent Inbound → Workflow Conversions</p>
              <div className="space-y-2">
                {INBOUND_EMAIL_LOG.map(entry => (
                  <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.025] border border-white/[0.05] hover:border-white/[0.09] transition-colors">
                    <Mail className="w-3.5 h-3.5 text-white/20 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/65 truncate">{entry.subject}</p>
                      <p className="text-[9px] font-mono text-white/25">From: {entry.sender} · {entry.received}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] text-white/30 hidden sm:block">{entry.assigned}</span>
                      <StatusBadge status={entry.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 06: ALL-HANDS MEETING REPORTING ── */}
        <section>
          <SectionLabel index="06" label="All-Hands Meetings + Action Items" accent="#F59E0B" />
          <div className="space-y-3">
            {ALL_HANDS_MEETINGS.map((m, i) => (
              <MeetingCard key={m.id} meeting={m} defaultOpen={i === 0} />
            ))}
            <div className="flex items-center gap-2 text-[10px] text-white/25 font-mono px-1">
              <Calendar className="w-3 h-3" />
              Meetings are added after each call with notes, attendees, action items, and next steps.
            </div>
          </div>
        </section>

        {/* ── SECTION 07: WHAT IS NEXT ── */}
        <section>
          <SectionLabel index="07" label="What Is Next" accent={ACCENT} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: FileText,
                color: '#10B981',
                title: 'Sub-Publishing Agreement',
                desc: 'Attorney review in progress. Target close: April 22. Blocking some publishing revenue optimization.',
                owner: 'Legal / Human Team',
                status: 'in_progress',
              },
              {
                icon: Megaphone,
                color: '#06B6D4',
                title: 'Apple Music Editorial Push',
                desc: 'Pitch submitted. Awaiting curator response. Target: April 17.',
                owner: 'AI Operator',
                status: 'in_progress',
              },
              {
                icon: ShoppingBag,
                color: '#F59E0B',
                title: 'Merch Fulfillment Integration QA',
                desc: 'Final testing of new fulfillment partner integration. Go-live: April 19.',
                owner: 'Human Team',
                status: 'in_progress',
              },
            ].map(item => {
              const ItemIcon = item.icon;
              return (
                <div key={item.title} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.1] transition-colors">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                      <ItemIcon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-[12px] font-semibold text-white/80 mb-1.5">{item.title}</p>
                  <p className="text-[10.5px] text-white/40 leading-relaxed mb-2.5">{item.desc}</p>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-white/20" />
                    <span className="text-[9.5px] font-mono text-white/25">{item.owner}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="h-8" />
      </div>
    </div>
  );
}
