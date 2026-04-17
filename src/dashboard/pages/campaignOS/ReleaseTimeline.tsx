import { useState } from 'react';
import { ChevronDown, AlertTriangle, CheckCircle, Clock, Zap, Flag } from 'lucide-react';
import type { ReleaseWeek, WeekStatus } from './types';
import { chip, mono, ProgressBar, HoverBtn } from './primitives';

const STATUS_CFG: Record<WeekStatus, { label: string; color: string }> = {
  complete:  { label: 'Complete',  color: '#10B981' },
  strong:    { label: 'Strong',    color: '#06B6D4' },
  'at-risk': { label: 'At Risk',   color: '#F59E0B' },
  blocked:   { label: 'Blocked',   color: '#EF4444' },
  upcoming:  { label: 'Upcoming',  color: 'rgba(255,255,255,0.25)' },
};

const PRIORITY_CFG = {
  critical: { color: '#EF4444', label: 'Critical' },
  high:     { color: '#F59E0B', label: 'High' },
  medium:   { color: '#06B6D4', label: 'Medium' },
  low:      { color: '#6B7280', label: 'Low' },
};

function WeekCard({ week, isCurrentWeek }: { week: ReleaseWeek; isCurrentWeek: boolean }) {
  const [open, setOpen] = useState(isCurrentWeek);
  const sc = STATUS_CFG[week.status];
  const pc = PRIORITY_CFG[week.priority];
  const blockers = week.tasks.filter(t => t.blocker && !t.done);
  const done = week.tasks.filter(t => t.done).length;

  return (
    <div style={{
      background: isCurrentWeek ? `${week.color}07` : '#0A0B0D',
      border: `1px solid ${isCurrentWeek ? week.color + '30' : (week.status === 'at-risk' || week.status === 'blocked' ? '#F59E0B22' : 'rgba(255,255,255,0.07)')}`,
      borderRadius: 14, overflow: 'hidden', transition: 'all 0.2s',
      boxShadow: isCurrentWeek ? `0 0 0 1px ${week.color}0A, 0 4px 20px ${week.color}08` : 'none',
    }}>
      {/* Left accent bar */}
      <div style={{ display: 'flex' }}>
        <div style={{ width: 3, background: week.color, flexShrink: 0, opacity: week.status === 'upcoming' ? 0.2 : 1 }} />

        <div style={{ flex: 1 }}>
          {/* Header row */}
          <div
            style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
            onClick={() => setOpen(v => !v)}
          >
            {/* Week number badge */}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${week.color}12`, border: `1px solid ${week.color}25`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ ...mono, fontSize: 6, color: `${week.color}88`, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>WK</span>
              <span style={{ ...mono, fontSize: 14, fontWeight: 900, color: week.color, lineHeight: 1 }}>{week.num}</span>
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: week.status === 'upcoming' ? 'rgba(255,255,255,0.4)' : '#fff' }}>{week.label}</span>
                <span style={{ ...chip(sc.color) }}>{sc.label}</span>
                {isCurrentWeek && <span style={{ ...chip('#EF4444'), fontSize: 7 }}>Current Week</span>}
                {blockers.length > 0 && (
                  <span style={{ ...chip('#EF4444'), fontSize: 7, display: 'flex', alignItems: 'center', gap: 3 }}>
                    <AlertTriangle size={7} /> {blockers.length} Blocker{blockers.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{week.objective}</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, marginBottom: 2 }}>Tasks</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: week.pct === 100 ? '#10B981' : '#fff' }}>{done}/{week.tasks.length}</div>
              </div>
              <div style={{ width: 50 }}>
                <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, marginBottom: 4 }}>{week.pct}%</div>
                <ProgressBar pct={week.pct} color={week.color} height={3} />
              </div>
              <ChevronDown size={13} color="rgba(255,255,255,0.25)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
          </div>

          {/* Expanded */}
          {open && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '14px 18px', animation: 'cos-slide 0.2s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {week.tasks.map((task, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      {task.done
                        ? <CheckCircle size={12} color="#10B981" />
                        : task.blocker
                          ? <AlertTriangle size={12} color="#EF4444" />
                          : <Clock size={12} color="rgba(255,255,255,0.2)" />
                      }
                      <span style={{ fontSize: 11, color: task.done ? 'rgba(255,255,255,0.5)' : task.blocker ? '#fff' : 'rgba(255,255,255,0.65)', textDecoration: task.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
                        {task.label}
                      </span>
                      {task.critical && !task.done && <span style={{ ...chip('#EF4444'), fontSize: 7 }}>Critical</span>}
                      {task.blocker && !task.done && <span style={{ ...chip('#EF4444'), fontSize: 7 }}>Blocker</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <HoverBtn label="Drill In" color={week.color} icon={Zap} sm />
                  <span style={{ ...chip(pc.color), fontSize: 7 }}>{pc.label} Priority</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReleaseTimeline({ weeks, daysUntil }: { weeks: ReleaseWeek[]; daysUntil: number }) {
  const currentWeekNum = daysUntil <= 7 ? 1 : daysUntil <= 14 ? 2 : daysUntil <= 21 ? 3 : daysUntil <= 28 ? 4 : daysUntil <= 35 ? 5 : daysUntil <= 42 ? 6 : daysUntil <= 49 ? 7 : 8;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { color: '#10B981', label: 'Complete / Strong' },
            { color: '#F59E0B', label: 'At Risk' },
            { color: '#EF4444', label: 'Blocked' },
            { color: 'rgba(255,255,255,0.25)', label: 'Upcoming' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline rail */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weeks.map(week => (
            <WeekCard key={week.num} week={week} isCurrentWeek={week.num === currentWeekNum} />
          ))}
        </div>
      </div>
    </div>
  );
}
