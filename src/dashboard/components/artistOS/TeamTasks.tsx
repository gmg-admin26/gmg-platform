import { Users, CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import { TEAM_TASKS, ARTIST_PROFILE } from '../../data/artistOSData';

const TASK_STATUS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  done:         { icon: CheckCircle,  color: 'text-[#10B981]', label: 'Done' },
  in_progress:  { icon: Clock,        color: 'text-[#06B6D4]', label: 'In Progress' },
  overdue:      { icon: AlertCircle,  color: 'text-[#EF4444]', label: 'Overdue' },
  not_started:  { icon: Circle,       color: 'text-white/20',  label: 'Not Started' },
};

const TASK_TYPE_COLOR: Record<string, string> = {
  release:   '#F59E0B',
  marketing: '#06B6D4',
  playlist:  '#10B981',
  ads:       '#3B82F6',
  content:   '#EF4444',
};

export default function TeamTasks() {
  const { rep, manager } = ARTIST_PROFILE;

  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Users className="w-4 h-4 text-white/30" />
        <span className="text-[13px] font-semibold text-white/80">Team & Tasks</span>
      </div>

      {/* Team members */}
      <div className="px-5 py-3 border-b border-white/[0.04] flex items-center gap-4">
        {[rep, manager].map(m => (
          <div key={m.name} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06B6D4]/40 to-[#3B82F6]/40 border border-[#06B6D4]/20 flex items-center justify-center text-[11px] font-bold text-[#06B6D4] shrink-0">
              {m.initials}
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/75">{m.name}</p>
              <p className="text-[10px] text-white/30">{m.role}</p>
            </div>
          </div>
        ))}
        <button className="ml-auto text-[10px] font-mono text-[#06B6D4] px-2.5 py-1 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 hover:bg-[#06B6D4]/20 transition-colors">
          Message Team
        </button>
      </div>

      {/* Task list */}
      <div className="divide-y divide-white/[0.04]">
        {TEAM_TASKS.map(t => {
          const cfg = TASK_STATUS[t.status];
          const Icon = cfg.icon;
          const typeColor = TASK_TYPE_COLOR[t.type] ?? '#ffffff';
          return (
            <div key={t.id} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.015] transition-colors cursor-pointer">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.color} ${t.status === 'overdue' ? 'animate-pulse' : ''}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/75 leading-snug">{t.task}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/25">{t.assignee}</span>
                  <span className="text-white/15">·</span>
                  <span className={`text-[10px] font-mono ${
                    t.status === 'overdue' ? 'text-[#EF4444]' : 'text-white/25'
                  }`}>Due {t.due}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                  style={{ color: typeColor, background: `${typeColor}15`, border: `1px solid ${typeColor}25` }}>
                  {t.type}
                </span>
                <span className={`text-[10px] font-mono ${cfg.color}`}>{cfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 border-t border-white/[0.04]">
        <button className="text-[11px] text-[#06B6D4] font-mono tracking-wider hover:text-white transition-colors">
          View All Tasks →
        </button>
      </div>
    </div>
  );
}
