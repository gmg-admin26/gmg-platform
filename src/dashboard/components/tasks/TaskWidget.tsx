import { useEffect } from 'react';
import { CheckSquare, ChevronRight, Plus, Bot, User, AlertTriangle, Clock } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import type { TaskSystem } from '../../data/taskService';
import { PRIORITY_META, STATUS_META } from '../../data/taskService';

interface TaskWidgetProps {
  system: TaskSystem;
  entityName?: string;
  maxItems?: number;
  accent?: string;
}

export default function TaskWidget({ system, entityName, maxItems = 5, accent = '#10B981' }: TaskWidgetProps) {
  const { tasks, loading, loadTasks, openSubmit, openDetail } = useTasks();

  useEffect(() => { loadTasks(system); }, [system, loadTasks]);

  const filtered = tasks.filter(t =>
    t.linked_system === system &&
    t.status !== 'completed' && t.status !== 'cancelled'
  ).slice(0, maxItems);

  const blocked  = filtered.filter(t => t.status === 'blocked').length;
  const overdue  = filtered.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed').length;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}>
            <CheckSquare className="w-3.5 h-3.5" style={{ color: accent }} />
          </div>
          <span className="text-[12px] font-semibold text-white/70">Active Tasks</span>
          {blocked > 0 && (
            <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
              {blocked} BLOCKED
            </span>
          )}
          {overdue > 0 && (
            <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">
              {overdue} OVERDUE
            </span>
          )}
        </div>
        <button
          onClick={() => openSubmit(system, entityName)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all hover:opacity-80"
          style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}25` }}
        >
          <Plus className="w-3 h-3" /> Submit Task
        </button>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-center">
          <p className="text-[10px] text-white/20 font-mono">Loading tasks…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="px-4 py-5 flex items-center gap-3">
          <CheckSquare className="w-4 h-4 text-white/15" />
          <p className="text-[11px] text-white/20">No open tasks. All clear.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {filtered.map(task => {
            const pm = PRIORITY_META[task.priority];
            const sm = STATUS_META[task.status];
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
            return (
              <button
                key={task.id}
                onClick={() => openDetail(task.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-all text-left"
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pm.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] text-white/75 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.assignee_type === 'ai_operator'
                      ? <Bot className="w-3 h-3 text-[#06B6D4]" />
                      : <User className="w-3 h-3 text-white/20" />
                    }
                    <span className="text-[9.5px] text-white/30 truncate">{task.assignee_name}</span>
                    {task.status === 'blocked' && <AlertTriangle className="w-3 h-3 text-[#EF4444] shrink-0" />}
                    {isOverdue && <Clock className="w-3 h-3 text-[#F59E0B] shrink-0" />}
                  </div>
                </div>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: sm.color, background: `${sm.color}12` }}>
                  {sm.label}
                </span>
                <ChevronRight className="w-3 h-3 text-white/15 shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      <div className="px-4 py-3 border-t border-white/[0.04]">
        <button
          onClick={() => openSubmit(system, entityName)}
          className="w-full text-center text-[10.5px] font-mono transition-colors hover:opacity-80"
          style={{ color: `${accent}60` }}
        >
          Submit Task / Request →
        </button>
      </div>
    </div>
  );
}
