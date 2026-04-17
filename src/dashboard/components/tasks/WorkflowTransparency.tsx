import { Bot, User, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import type { Task, TaskSystem } from '../../data/taskService';
import { PRIORITY_META, STATUS_META, ASSIGNEE_TYPE_META } from '../../data/taskService';
import { useTasks } from '../../context/TaskContext';

function fmtDate(s?: string) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Props {
  system?: TaskSystem;
  accent?: string;
}

export default function WorkflowTransparency({ system, accent = '#10B981' }: Props) {
  const { tasks, openDetail } = useTasks();

  const filtered = system ? tasks.filter(t => t.linked_system === system) : tasks;
  const active    = filtered.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
  const blocked   = filtered.filter(t => t.status === 'blocked');
  const overdue   = filtered.filter(t =>
    t.due_date && new Date(t.due_date) < new Date() && !['completed', 'cancelled'].includes(t.status)
  );
  const completedThisWeek = filtered.filter(t => {
    if (t.status !== 'completed' || !t.completed_at) return false;
    const d = new Date(t.completed_at);
    const week = new Date(); week.setDate(week.getDate() - 7);
    return d >= week;
  });
  const aiTasks    = active.filter(t => t.assignee_type === 'ai_operator');
  const humanTasks = active.filter(t => t.assignee_type !== 'ai_operator');

  const aiPct    = active.length > 0 ? Math.round(aiTasks.length / active.length * 100) : 0;
  const humanPct = 100 - aiPct;

  const assigneeMap: Record<string, Task[]> = {};
  active.forEach(t => {
    const k = t.assignee_name;
    if (!assigneeMap[k]) assigneeMap[k] = [];
    assigneeMap[k].push(t);
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Active Tasks',        value: active.length,            color: '#06B6D4', icon: TrendingUp    },
          { label: 'Completed This Week', value: completedThisWeek.length, color: '#10B981', icon: CheckCircle   },
          { label: 'Blocked',             value: blocked.length,           color: '#EF4444', icon: AlertTriangle },
          { label: 'Overdue',             value: overdue.length,           color: '#F59E0B', icon: Clock         },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg,transparent,${m.color}28,transparent)` }} />
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
                <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider">{m.label}</p>
              </div>
              <p className="text-[26px] font-black leading-none" style={{ color: m.color }}>{m.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-white/[0.05] flex items-center justify-between">
            <p className="text-[11.5px] font-semibold text-white/60">AI vs Human Work Split</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Bot className="w-3 h-3 text-[#06B6D4]" />
                <span className="text-[9.5px] text-white/40">{aiTasks.length} AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3 h-3 text-white/30" />
                <span className="text-[9.5px] text-white/40">{humanTasks.length} Human</span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="flex h-3 rounded-full overflow-hidden mb-3">
              {aiPct > 0 && (
                <div style={{ width: `${aiPct}%`, background: '#06B6D4', transition: 'width 0.4s' }} />
              )}
              {humanPct > 0 && (
                <div style={{ width: `${humanPct}%`, background: '#10B981', transition: 'width 0.4s' }} />
              )}
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                <span className="text-[9.5px] text-white/35">AI Operator: {aiPct}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[9.5px] text-white/35">Human Team: {humanPct}%</span>
              </div>
            </div>

            <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-3">Who Is Working On What</p>
            <div className="space-y-2">
              {Object.entries(assigneeMap).slice(0, 6).map(([name, atasks]) => {
                const first = atasks[0];
                const atm = ASSIGNEE_TYPE_META[first.assignee_type];
                const AIcon = first.assignee_type === 'ai_operator' ? Bot : User;
                return (
                  <div key={name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <AIcon className="w-3.5 h-3.5 shrink-0" style={{ color: atm.color }} />
                    <span className="text-[11px] text-white/65 flex-1 truncate">{name}</span>
                    <div className="flex items-center gap-1.5">
                      {atasks.slice(0, 3).map(t => {
                        const pm = PRIORITY_META[t.priority];
                        return (
                          <div key={t.id} className="w-1.5 h-1.5 rounded-full" style={{ background: pm.color }} />
                        );
                      })}
                      <span className="text-[9px] font-mono text-white/25 ml-1">{atasks.length} task{atasks.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {blocked.length > 0 && (
            <div className="bg-[#0B0D10] border border-[#EF4444]/15 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                <p className="text-[11px] font-semibold text-[#EF4444]/80">Blocked</p>
                <span className="ml-auto text-[8px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">{blocked.length}</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {blocked.map(t => (
                  <button
                    key={t.id}
                    onClick={() => openDetail(t.id)}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-all"
                  >
                    <p className="text-[11px] text-white/65 truncate">{t.title}</p>
                    {t.blocker_notes && (
                      <p className="text-[9.5px] text-[#EF4444]/50 truncate mt-0.5">{t.blocker_notes}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {overdue.length > 0 && (
            <div className="bg-[#0B0D10] border border-[#F59E0B]/15 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <p className="text-[11px] font-semibold text-[#F59E0B]/80">Overdue</p>
                <span className="ml-auto text-[8px] font-mono text-[#F59E0B] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded">{overdue.length}</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {overdue.map(t => (
                  <button
                    key={t.id}
                    onClick={() => openDetail(t.id)}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-all"
                  >
                    <p className="text-[11px] text-white/65 truncate">{t.title}</p>
                    <p className="text-[9.5px] text-[#F59E0B]/50 font-mono mt-0.5">Due {fmtDate(t.due_date)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {completedThisWeek.length > 0 && (
            <div className="bg-[#0B0D10] border border-[#10B981]/12 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                <p className="text-[11px] font-semibold text-[#10B981]/80">Completed This Week</p>
                <span className="ml-auto text-[8px] font-mono text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">{completedThisWeek.length}</span>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {completedThisWeek.map(t => (
                  <button
                    key={t.id}
                    onClick={() => openDetail(t.id)}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/[0.02] transition-all"
                  >
                    <p className="text-[11px] text-white/40 truncate line-through">{t.title}</p>
                    <p className="text-[9.5px] text-[#10B981]/40 font-mono mt-0.5">by {t.completed_by ?? t.assignee_name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
