import { useState } from 'react';
import {
  List, LayoutGrid, ChevronRight, Bot, User, UserCheck, Globe,
  AlertTriangle, Clock, DollarSign, Filter, ChevronDown,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import type { Task, TaskStatus, TaskPriority, AssigneeType } from '../../data/taskService';
import { PRIORITY_META, STATUS_META, ASSIGNEE_TYPE_META } from '../../data/taskService';

const ASSIGNEE_ICONS: Record<AssigneeType, typeof Bot> = {
  ai_operator: Bot,
  human_team:  User,
  artist:      UserCheck,
  external:    Globe,
};

const KANBAN_COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'open',        label: 'Open'        },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'blocked',     label: 'Blocked'     },
  { status: 'review',      label: 'In Review'   },
  { status: 'completed',   label: 'Completed'   },
];

function fmtDate(s?: string) {
  if (!s) return null;
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const pm  = PRIORITY_META[task.priority];
  const sm  = STATUS_META[task.status];
  const atm = ASSIGNEE_TYPE_META[task.assignee_type];
  const AIcon = ASSIGNEE_ICONS[task.assignee_type];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[#0D0F12] border border-white/[0.06] rounded-xl p-3.5 hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg,transparent,${pm.color}20,transparent)` }} />
      <div className="flex items-start gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: pm.color }} />
        <p className="text-[11.5px] text-white/80 leading-snug flex-1">{task.title}</p>
      </div>

      {task.linked_entity_name && (
        <p className="text-[9px] font-mono text-white/20 mb-2 ml-3.5">{task.linked_entity_name}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap ml-3.5">
        <div className="flex items-center gap-1">
          <AIcon className="w-3 h-3" style={{ color: atm.color }} />
          <span className="text-[9.5px] text-white/30 truncate max-w-[90px]">{task.assignee_name}</span>
        </div>
        {task.due_date && (
          <div className="flex items-center gap-1">
            <Clock className={`w-3 h-3 ${isOverdue ? 'text-[#F59E0B]' : 'text-white/15'}`} />
            <span className={`text-[9px] font-mono ${isOverdue ? 'text-[#F59E0B]' : 'text-white/20'}`}>
              {fmtDate(task.due_date)}
            </span>
          </div>
        )}
        {task.revenue_impact != null && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#10B981]" />
            <span className="text-[9px] font-mono text-[#10B981]/60">
              {task.revenue_impact_label ?? `$${task.revenue_impact.toLocaleString()}`}
            </span>
          </div>
        )}
        {task.status === 'blocked' && <AlertTriangle className="w-3 h-3 text-[#EF4444]" />}
      </div>
    </button>
  );
}

function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  const pm  = PRIORITY_META[task.priority];
  const sm  = STATUS_META[task.status];
  const atm = ASSIGNEE_TYPE_META[task.assignee_type];
  const AIcon = ASSIGNEE_ICONS[task.assignee_type];
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';

  return (
    <button
      onClick={onClick}
      className="w-full grid items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-all text-left border-b border-white/[0.04] last:border-0"
      style={{ gridTemplateColumns: '10px 1fr 130px 90px 100px 85px 18px' }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: pm.color }} />
      <div className="min-w-0">
        <p className="text-[11.5px] text-white/80 truncate">{task.title}</p>
        {task.linked_entity_name && (
          <p className="text-[9px] font-mono text-white/20 truncate mt-0.5">{task.linked_entity_name}</p>
        )}
      </div>
      <div className="flex items-center gap-1.5 min-w-0">
        <AIcon className="w-3 h-3 shrink-0" style={{ color: atm.color }} />
        <span className="text-[9.5px] text-white/35 truncate">{task.assignee_name}</span>
      </div>
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded text-center"
        style={{ color: pm.color, background: `${pm.color}12` }}>
        {pm.label}
      </span>
      <div className={`flex items-center gap-1 ${isOverdue ? 'text-[#F59E0B]' : 'text-white/20'}`}>
        <Clock className="w-3 h-3 shrink-0" />
        <span className="text-[9.5px] font-mono">{fmtDate(task.due_date) ?? '—'}</span>
      </div>
      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap"
        style={{ color: sm.color, background: `${sm.color}12` }}>
        {sm.label}
      </span>
      <ChevronRight className="w-3 h-3 text-white/15 justify-self-end" />
    </button>
  );
}

interface Props {
  title?: string;
  accent?: string;
}

export default function TaskListView({ title = 'Tasks', accent = '#10B981' }: Props) {
  const { tasks, loading, openDetail, openSubmit } = useTasks();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = tasks.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    return true;
  });

  const open       = filtered.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
  const blocked    = filtered.filter(t => t.status === 'blocked').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-white/80">{title}</span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30">{open} open</span>
          {blocked > 0 && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444]">{blocked} blocked</span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(p => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] border border-white/[0.09] text-white/40 hover:text-white/65 transition-all"
            >
              <Filter className="w-3 h-3" /> Filter
              <ChevronDown className="w-3 h-3" />
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-1.5 bg-[#111214] border border-white/[0.1] rounded-xl shadow-2xl z-20 p-3 min-w-[200px]">
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-2">Status</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(['all', 'open', 'in_progress', 'blocked', 'review', 'completed'] as const).map(s => {
                    const sm = s === 'all' ? { label: 'All', color: '#6B7280' } : STATUS_META[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className="text-[9px] px-2 py-0.5 rounded font-mono"
                        style={{
                          color: filterStatus === s ? sm.color : '#6B7280',
                          background: filterStatus === s ? `${sm.color}18` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${filterStatus === s ? sm.color + '30' : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        {sm.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-2">Priority</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', 'critical', 'high', 'medium', 'low'] as const).map(p => {
                    const pm = p === 'all' ? { label: 'All', color: '#6B7280' } : PRIORITY_META[p];
                    return (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className="text-[9px] px-2 py-0.5 rounded font-mono"
                        style={{
                          color: filterPriority === p ? pm.color : '#6B7280',
                          background: filterPriority === p ? `${pm.color}18` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${filterPriority === p ? pm.color + '30' : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        {pm.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center border border-white/[0.09] rounded-lg overflow-hidden">
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10.5px] transition-all"
              style={{ background: view === 'list' ? `${accent}18` : 'transparent', color: view === 'list' ? accent : '#6B7280' }}
            >
              <List className="w-3 h-3" /> List
            </button>
            <button
              onClick={() => setView('kanban')}
              className="flex items-center gap-1 px-3 py-1.5 text-[10.5px] transition-all border-l border-white/[0.09]"
              style={{ background: view === 'kanban' ? `${accent}18` : 'transparent', color: view === 'kanban' ? accent : '#6B7280' }}
            >
              <LayoutGrid className="w-3 h-3" /> Kanban
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-8 text-center">
          <p className="text-[11px] text-white/20 font-mono">Loading tasks…</p>
        </div>
      ) : view === 'list' ? (
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div
            className="grid gap-3 px-4 py-2.5 border-b border-white/[0.05]"
            style={{ gridTemplateColumns: '10px 1fr 130px 90px 100px 85px 18px' }}
          >
            {['', 'Task', 'Assignee', 'Priority', 'Due', 'Status', ''].map((h, i) => (
              <span key={i} className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{h}</span>
            ))}
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[11px] text-white/20">No tasks match the current filters.</p>
            </div>
          ) : (
            filtered.map(t => <TaskRow key={t.id} task={t} onClick={() => openDetail(t.id)} />)
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3 items-start">
          {KANBAN_COLUMNS.map(col => {
            const sm = STATUS_META[col.status];
            const colTasks = filtered.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="px-3 py-3 border-b border-white/[0.05] flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: sm.color }} />
                  <span className="text-[10.5px] font-semibold text-white/55 flex-1">{col.label}</span>
                  <span className="text-[9px] font-mono text-white/25">{colTasks.length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[80px]">
                  {colTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => openDetail(t.id)} />)}
                  {colTasks.length === 0 && (
                    <p className="text-[9.5px] text-white/15 text-center py-3 font-mono">No tasks</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
