import { useState, useCallback } from 'react';
import {
  Calendar, Megaphone, Music, ShoppingBag, Mic2, Video,
  FileText, Heart, Shield, Rocket, Handshake, Globe,
  Scale, DollarSign, ChevronDown, ChevronUp, Plus, X,
  TrendingUp, Target, Star, Users, BarChart2, Zap,
  CheckCircle2, Clock, AlertTriangle, Flag, ArrowRight,
  RefreshCw, User,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useTasks } from '../../context/TaskContext';
import {
  BN_TIMELINE_DATA,
  BN_EXPECTED_OUTCOMES_DATA,
  type BNTimelineItemType,
  type BNTimelineItemStatus,
  type BNTimelinePriority,
  type BNTimelineItem,
  type BNMonthData,
} from '../../data/bassnectarCatalogData';

const ACCENT = '#10B981';

type ItemType   = BNTimelineItemType;
type ItemStatus = BNTimelineItemStatus;
type Priority   = BNTimelinePriority;
type TimelineItem = BNTimelineItem;
type MonthData    = BNMonthData;

const TIMELINE_DATA = BN_TIMELINE_DATA;

// ─── Type meta ───────────────────────────────────────────────────────────────

const TYPE_META: Record<ItemType, { icon: React.ElementType; label: string; color: string }> = {
  release:     { icon: Music,        label: 'Release',          color: '#A3E635' },
  campaign:    { icon: Megaphone,    label: 'Campaign',         color: '#10B981' },
  sync:        { icon: Zap,          label: 'Sync Push',        color: '#F59E0B' },
  merch:       { icon: ShoppingBag,  label: 'Merch Drop',       color: '#06B6D4' },
  touring:     { icon: Mic2,         label: 'Touring',          color: '#3B82F6' },
  interview:   { icon: Video,        label: 'Interview',        color: '#8B5CF6' },
  press:       { icon: FileText,     label: 'Press',            color: '#EC4899' },
  fan_club:    { icon: Heart,        label: 'Fan Club',         color: '#F97316' },
  brand_rehab: { icon: Shield,       label: 'Brand',            color: '#06B6D4' },
  venture:     { icon: Rocket,       label: 'New Venture',      color: '#A3E635' },
  partnership: { icon: Handshake,    label: 'Partnership',      color: '#F59E0B' },
  content:     { icon: Globe,        label: 'Content / Web',    color: '#EC4899' },
  legal:       { icon: Scale,        label: 'Legal',            color: '#EF4444' },
  finance:     { icon: DollarSign,   label: 'Finance',          color: '#8B5CF6' },
};

const STATUS_META: Record<ItemStatus, { color: string; label: string; icon: React.ElementType }> = {
  planned:     { color: '#6B7280', label: 'Planned',     icon: Clock        },
  in_progress: { color: '#06B6D4', label: 'In Progress', icon: RefreshCw    },
  completed:   { color: '#10B981', label: 'Completed',   icon: CheckCircle2 },
  delayed:     { color: '#F59E0B', label: 'Delayed',     icon: AlertTriangle },
  cancelled:   { color: '#EF4444', label: 'Cancelled',   icon: X            },
};

const PRIORITY_META: Record<Priority, { color: string; label: string }> = {
  critical: { color: '#EF4444', label: 'Critical' },
  high:     { color: '#F59E0B', label: 'High'     },
  medium:   { color: '#06B6D4', label: 'Medium'   },
  low:      { color: '#6B7280', label: 'Low'       },
};

// ─── Expected outcomes — icons mapped here since icons can't live in data file ─

const OUTCOME_ICON_MAP: Record<string, React.ElementType> = {
  revenue:   TrendingUp,
  valuation: BarChart2,
  audience:  Users,
  sync:      Zap,
  merch:     ShoppingBag,
  touring:   Mic2,
  brand:     Shield,
};

const EXPECTED_OUTCOMES = Object.fromEntries(
  Object.entries(BN_EXPECTED_OUTCOMES_DATA).map(([key, val]) => [
    key,
    { ...val, icon: OUTCOME_ICON_MAP[key] ?? TrendingUp },
  ])
) as Record<string, typeof BN_EXPECTED_OUTCOMES_DATA['revenue'] & { icon: React.ElementType }>;

const QUARTER_META: Record<string, { color: string }> = {
  'Q2 2026': { color: '#10B981' },
  'Q3 2026': { color: '#06B6D4' },
  'Q4 2026': { color: '#F59E0B' },
  'Q1 2027': { color: '#3B82F6' },
};

// ─── New item form defaults ───────────────────────────────────────────────────

const BLANK_FORM = {
  type: 'campaign' as ItemType,
  title: '',
  description: '',
  owner: 'GMG Team',
  status: 'planned' as ItemStatus,
  priority: 'medium' as Priority,
  expected_outcome: '',
  revenue_label: '',
  date_label: '',
  month_key: '2026-05',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ index, label, accent = ACCENT }: { index: string; label: string; accent?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[9px] font-mono shrink-0" style={{ color: `${accent}55` }}>{index}</span>
      <div className="h-[1px] w-3" style={{ background: `${accent}30` }} />
      <span className="text-[10px] font-mono tracking-[0.16em] uppercase font-semibold shrink-0" style={{ color: `${accent}80` }}>{label}</span>
      <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
    </div>
  );
}

function StatusBadge({ status }: { status: ItemStatus }) {
  const m = STATUS_META[status];
  const Icon = m.icon;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-mono font-semibold uppercase tracking-wide"
      style={{ color: m.color, background: `${m.color}15` }}>
      <Icon className="w-2.5 h-2.5" />{m.label}
    </span>
  );
}

function PriorityDot({ priority }: { priority: Priority }) {
  return (
    <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
      style={{ background: PRIORITY_META[priority].color }} />
  );
}

function TimelineItemCard({
  item,
  onStatusChange,
}: {
  item: TimelineItem;
  onStatusChange: (id: string, status: ItemStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[item.type];
  const Icon = meta.icon;

  return (
    <div
      className="rounded-xl border transition-all overflow-hidden"
      style={{
        background: `${meta.color}06`,
        borderColor: expanded ? `${meta.color}28` : 'rgba(255,255,255,0.06)',
      }}
    >
      <button
        onClick={() => setExpanded(o => !o)}
        className="w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${meta.color}14`, border: `1px solid ${meta.color}22` }}>
          <Icon className="w-3 h-3" style={{ color: meta.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <PriorityDot priority={item.priority} />
            <p className="text-[11.5px] font-semibold text-white/80 leading-snug">{item.title}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded"
              style={{ color: meta.color, background: `${meta.color}12` }}>{meta.label}</span>
            <StatusBadge status={item.status} />
            {item.date_label && (
              <span className="text-[9px] font-mono text-white/25">{item.date_label}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {item.revenue_label && (
            <span className="text-[9.5px] font-mono text-[#10B981] hidden sm:block">{item.revenue_label}</span>
          )}
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/20" /> : <ChevronDown className="w-3.5 h-3.5 text-white/20" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t border-white/[0.04] space-y-3">
          <p className="text-[11px] text-white/50 leading-relaxed pt-3">{item.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-widest mb-1">Expected Outcome</p>
              <p className="text-[11px] text-white/60 leading-snug">{item.expected_outcome}</p>
            </div>
            {item.revenue_label && (
              <div className="p-3 rounded-lg bg-[#10B981]/05 border border-[#10B981]/15">
                <p className="text-[8.5px] font-mono text-[#10B981]/50 uppercase tracking-widest mb-1">Revenue Target</p>
                <p className="text-[14px] font-bold text-[#10B981]">{item.revenue_label}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-white/20" />
              <span className="text-[9.5px] font-mono text-white/30">{item.owner}</span>
              {item.linked_task && (
                <>
                  <span className="text-white/10">·</span>
                  <span className="text-[9px] font-mono text-white/20">Task: {item.linked_task}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {(['planned', 'in_progress', 'completed'] as ItemStatus[]).map(s => (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); onStatusChange(item.id, s); }}
                  className={`px-2 py-0.5 rounded text-[8.5px] font-mono transition-all border ${
                    item.status === s
                      ? 'text-white border-white/20 bg-white/[0.08]'
                      : 'text-white/20 border-white/[0.05] hover:text-white/50 hover:border-white/15'
                  }`}
                >
                  {STATUS_META[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OutcomeCard({ data }: { data: typeof EXPECTED_OUTCOMES['revenue'] }) {
  const Icon = data.icon;
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.1] transition-colors">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${data.color}14`, border: `1px solid ${data.color}22` }}>
          <Icon className="w-4 h-4" style={{ color: data.color }} />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-white/80">{data.label}</p>
          <p className="text-[9.5px] font-mono text-white/25">Current: {data.current}</p>
        </div>
      </div>
      <div className="mb-3">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-1">12-Month Target</p>
        <p className="text-[17px] font-bold leading-tight" style={{ color: data.color }}>{data.target}</p>
      </div>
      <p className="text-[10.5px] text-white/35 leading-relaxed mb-4">{data.detail}</p>
      <div className="space-y-2">
        {data.milestones.map((m, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
              <span className="text-[9.5px] text-white/35">{m.label}</span>
            </div>
            <span className="text-[9.5px] font-mono font-semibold" style={{ color: m.color }}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Add item modal ───────────────────────────────────────────────────────────

function AddItemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: TimelineItem, monthKey: string) => void;
}) {
  const [form, setForm] = useState(BLANK_FORM);
  const { openSubmit } = useTasks();

  const set = (k: keyof typeof BLANK_FORM, v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const item: TimelineItem = {
      id: `custom-${Date.now()}`,
      type: form.type,
      title: form.title,
      description: form.description,
      owner: form.owner,
      status: form.status,
      priority: form.priority,
      expected_outcome: form.expected_outcome,
      revenue_label: form.revenue_label || undefined,
      date_label: form.date_label || undefined,
    };
    onAdd(item, form.month_key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg bg-[#0D0F12] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: '#10B98114', border: '1px solid #10B98125' }}>
              <Plus className="w-3.5 h-3.5 text-[#10B981]" />
            </div>
            <p className="text-[13px] font-semibold text-white/85">Add Timeline Item</p>
          </div>
          <button onClick={onClose} className="text-white/25 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 focus:outline-none focus:border-[#10B981]/40"
              >
                {(Object.keys(TYPE_META) as ItemType[]).map(t => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Month</label>
              <select
                value={form.month_key}
                onChange={e => set('month_key', e.target.value)}
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 focus:outline-none focus:border-[#10B981]/40"
              >
                {TIMELINE_DATA.map(m => (
                  <option key={m.month_key} value={m.month_key}>{m.month_label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Spotify Editorial Campaign — Divergent Spectrum"
              className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40"
            />
          </div>

          <div>
            <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="What is this? Why does it matter?"
              rows={3}
              className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 focus:outline-none focus:border-[#10B981]/40"
              >
                {(['critical', 'high', 'medium', 'low'] as Priority[]).map(p => (
                  <option key={p} value={p}>{PRIORITY_META[p].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Date / Window</label>
              <input
                value={form.date_label}
                onChange={e => set('date_label', e.target.value)}
                placeholder="e.g. May 15 or May 1–31"
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Owner</label>
              <input
                value={form.owner}
                onChange={e => set('owner', e.target.value)}
                placeholder="GMG Marketing, Legal, etc."
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40"
              />
            </div>
            <div>
              <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Revenue Target</label>
              <input
                value={form.revenue_label}
                onChange={e => set('revenue_label', e.target.value)}
                placeholder="e.g. $80K–$220K"
                className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40"
              />
            </div>
          </div>

          <div>
            <label className="text-[9px] font-mono text-white/25 uppercase tracking-widest block mb-1.5">Expected Outcome</label>
            <input
              value={form.expected_outcome}
              onChange={e => set('expected_outcome', e.target.value)}
              placeholder="What does success look like?"
              className="w-full bg-[#131518] border border-white/[0.08] rounded-lg px-3 py-2 text-[11.5px] text-white/70 placeholder-white/15 focus:outline-none focus:border-[#10B981]/40"
            />
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.05]">
            <button
              onClick={() => { openSubmit('catalog_os', 'Bassnectar'); onClose(); }}
              className="flex items-center gap-1.5 text-[10px] text-white/30 hover:text-white/55 transition-colors"
            >
              <ArrowRight className="w-3 h-3" /> Create from task instead
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-white/[0.07]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[11px] text-white/35 hover:text-white/60 hover:bg-white/[0.04] border border-white/[0.07] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="px-4 py-2 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: ACCENT, color: '#000' }}
          >
            Add to Timeline
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function COSTimeline() {
  const [items, setItems] = useState<Record<string, TimelineItem[]>>(() => {
    const map: Record<string, TimelineItem[]> = {};
    for (const m of TIMELINE_DATA) map[m.month_key] = [...m.items];
    return map;
  });

  const [filterType, setFilterType] = useState<ItemType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ItemStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeView, setActiveView] = useState<'timeline' | 'outcomes'>('timeline');

  const handleStatusChange = useCallback((id: string, status: ItemStatus) => {
    setItems(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        next[key] = next[key].map(item => item.id === id ? { ...item, status } : item);
      }
      return next;
    });
  }, []);

  const handleAddItem = useCallback((item: TimelineItem, monthKey: string) => {
    setItems(prev => ({
      ...prev,
      [monthKey]: [...(prev[monthKey] ?? []), item],
    }));
  }, []);

  const allItems = Object.values(items).flat();
  const totalItems     = allItems.length;
  const completedItems = allItems.filter(i => i.status === 'completed').length;
  const inProgressItems= allItems.filter(i => i.status === 'in_progress').length;
  const criticalItems  = allItems.filter(i => i.priority === 'critical').length;

  const filteredItems = (monthKey: string): TimelineItem[] =>
    (items[monthKey] ?? []).filter(item => {
      const typeOk   = filterType   === 'all' || item.type   === filterType;
      const statusOk = filterStatus === 'all' || item.status === filterStatus;
      return typeOk && statusOk;
    });

  const quarters = [
    { label: 'Q2 2026', months: TIMELINE_DATA.filter(m => m.quarter === 'Q2 2026') },
    { label: 'Q3 2026', months: TIMELINE_DATA.filter(m => m.quarter === 'Q3 2026') },
    { label: 'Q4 2026', months: TIMELINE_DATA.filter(m => m.quarter === 'Q4 2026') },
    { label: 'Q1 2027', months: TIMELINE_DATA.filter(m => m.quarter === 'Q1 2027') },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Calendar}
        title="12-Month Operating Plan"
        subtitle="Strategic roadmap · Releases · Campaigns · Sync · Touring · Merch · Brand rehab"
        accentColor={ACCENT}
        badge="Apr 2026 – Mar 2027"
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
            style={{ background: ACCENT, color: '#000' }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        }
      />

      {showAddModal && (
        <AddItemModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />
      )}

      <div className="p-5 max-w-[1100px] space-y-6">

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Initiatives', value: totalItems,        color: ACCENT,    icon: Target       },
            { label: 'In Progress',        value: inProgressItems,  color: '#06B6D4', icon: RefreshCw    },
            { label: 'Completed',          value: completedItems,   color: '#10B981', icon: CheckCircle2 },
            { label: 'Critical Priority',  value: criticalItems,    color: '#EF4444', icon: Flag         },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}35, transparent)` }} />
                <div className="flex items-start justify-between mb-2">
                  <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{stat.label}</p>
                  <Icon className="w-3.5 h-3.5" style={{ color: `${stat.color}60` }} />
                </div>
                <p className="text-[26px] font-bold leading-none" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* View toggle + Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 p-0.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
            {(['timeline', 'outcomes'] as const).map(v => (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                  activeView === v ? 'bg-white/[0.08] text-white/85' : 'text-white/30 hover:text-white/55'
                }`}
              >
                {v === 'timeline' ? 'Operating Plan' : 'Expected Outcomes'}
              </button>
            ))}
          </div>

          {activeView === 'timeline' && (
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as ItemType | 'all')}
                className="bg-[#0B0D10] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[10.5px] text-white/50 focus:outline-none focus:border-[#10B981]/40"
              >
                <option value="all">All Types</option>
                {(Object.keys(TYPE_META) as ItemType[]).map(t => (
                  <option key={t} value={t}>{TYPE_META[t].label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as ItemStatus | 'all')}
                className="bg-[#0B0D10] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[10.5px] text-white/50 focus:outline-none focus:border-[#10B981]/40"
              >
                <option value="all">All Statuses</option>
                {(Object.keys(STATUS_META) as ItemStatus[]).map(s => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ── Operating Plan (Timeline) view ── */}
        {activeView === 'timeline' && (
          <div className="space-y-10">
            {quarters.map(q => {
              const qMeta = QUARTER_META[q.label];
              const qItems = q.months.flatMap(m => filteredItems(m.month_key));
              if (qItems.length === 0 && (filterType !== 'all' || filterStatus !== 'all')) return null;
              return (
                <div key={q.label}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-[1px] w-8" style={{ background: qMeta.color }} />
                    <span className="text-[11px] font-mono tracking-[0.14em] uppercase font-bold"
                      style={{ color: qMeta.color }}>{q.label}</span>
                    <div className="flex-1 h-[1px] bg-white/[0.04]" />
                    <span className="text-[9px] font-mono text-white/20">
                      {qItems.length} initiative{qItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {q.months.map(month => {
                      const monthItems = filteredItems(month.month_key);
                      const isCurrent = month.month_key === '2026-04';
                      return (
                        <div key={month.month_key}
                          className={`rounded-xl border relative overflow-hidden ${
                            isCurrent ? 'border-[#10B981]/20' : 'border-white/[0.05]'
                          }`}
                          style={{ background: isCurrent ? '#10B98106' : '#0B0D10' }}>
                          {isCurrent && (
                            <div className="absolute top-0 left-0 right-0 h-[1px]"
                              style={{ background: 'linear-gradient(90deg, transparent, #10B98130, transparent)' }} />
                          )}
                          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" style={{ color: qMeta.color }} />
                              <span className="text-[11.5px] font-semibold text-white/70">{month.month_label}</span>
                              {isCurrent && (
                                <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded"
                                  style={{ color: ACCENT, background: `${ACCENT}15`, border: `1px solid ${ACCENT}25` }}>
                                  NOW
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-white/20">
                              {monthItems.length} item{monthItems.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          <div className="p-3 space-y-2">
                            {monthItems.length === 0 ? (
                              <p className="text-[10px] text-white/15 font-mono py-4 text-center">No items matching filter</p>
                            ) : (
                              monthItems.map(item => (
                                <TimelineItemCard
                                  key={item.id}
                                  item={item}
                                  onStatusChange={handleStatusChange}
                                />
                              ))
                            )}
                            <button
                              onClick={() => setShowAddModal(true)}
                              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-white/[0.07] text-[9.5px] text-white/20 hover:text-white/45 hover:border-white/15 transition-all"
                            >
                              <Plus className="w-3 h-3" /> Add item
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Type legend */}
            <div className="pt-4 border-t border-white/[0.05]">
              <p className="text-[9px] font-mono text-white/15 uppercase tracking-widest mb-3">Filter by Type</p>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(TYPE_META) as [ItemType, typeof TYPE_META[ItemType]][]).map(([key, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterType(filterType === key ? 'all' : key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all text-[9.5px] ${
                        filterType === key ? 'border-current' : 'border-white/[0.07] text-white/30 hover:text-white/55'
                      }`}
                      style={filterType === key ? { color: meta.color, background: `${meta.color}12` } : {}}
                    >
                      <Icon className="w-2.5 h-2.5" />
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Expected Outcomes view ── */}
        {activeView === 'outcomes' && (
          <div className="space-y-6">
            <SectionLabel index="01" label="12-Month Expected Outcomes" accent={ACCENT} />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(EXPECTED_OUTCOMES).map(([key, data]) => (
                <OutcomeCard key={key} data={data} />
              ))}
            </div>

            {/* Summary strip */}
            <div className="bg-[#0B0D10] border border-[#10B981]/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#10B98114', border: '1px solid #10B98125' }}>
                  <Star className="w-3.5 h-3.5 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/85 mb-0.5">12-Month Total Revenue Opportunity</p>
                  <p className="text-[11px] text-white/35">Across streaming growth, sync, merch, touring, and vault drops</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                {[
                  { label: 'Streaming Revenue (12mo)', value: '$3.8M–$5.2M', color: '#10B981' },
                  { label: 'Sync Pipeline (12mo)',     value: '$300K–$900K', color: '#F59E0B' },
                  { label: 'Merch + Vault Drops',      value: '$480K–$820K', color: '#06B6D4' },
                  { label: 'Touring (Q1 2027 start)',  value: '$250K–$600K', color: '#3B82F6' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-[16px] font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Total 12-Month Opportunity</p>
                  <p className="text-[26px] font-bold text-[#10B981]">$4.8M–$7.5M</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-1">Catalog Value Target</p>
                  <p className="text-[26px] font-bold text-[#06B6D4]">$13.4M–$16.2M</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-8" />
      </div>
    </div>
  );
}
