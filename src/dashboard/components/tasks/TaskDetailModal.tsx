import { useState, useEffect } from 'react';
import {
  X, Clock, AlertTriangle, CheckCircle, Bot, User, UserCheck, Globe,
  ChevronDown, Send, Loader, Calendar, DollarSign, Link2, Flag,
  Activity, MessageSquare,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import type { TaskNote, TaskStatusHistory, AssigneeType, TaskStatus } from '../../data/taskService';
import {
  PRIORITY_META, STATUS_META, ASSIGNEE_TYPE_META,
  fetchTaskNotes, fetchTaskStatusHistory, addTaskNote,
} from '../../data/taskService';

const ASSIGNEE_ICONS: Record<AssigneeType, typeof Bot> = {
  ai_operator: Bot,
  human_team:  User,
  artist:      UserCheck,
  external:    Globe,
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'open',        label: 'Open'        },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked',     label: 'Blocked'     },
  { value: 'review',      label: 'In Review'   },
  { value: 'completed',   label: 'Completed'   },
  { value: 'cancelled',   label: 'Cancelled'   },
];

function fmtDate(s?: string) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtTime(s: string) {
  return new Date(s).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export default function TaskDetailModal() {
  const { tasks, detailTaskId, closeDetail, changeStatus, useMock } = useTasks();
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [history, setHistory] = useState<TaskStatusHistory[]>([]);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [tab, setTab] = useState<'details' | 'notes' | 'history'>('details');

  const task = tasks.find(t => t.id === detailTaskId);

  useEffect(() => {
    if (!task) return;
    if (!useMock) {
      fetchTaskNotes(task.id).then(setNotes).catch(() => {});
      fetchTaskStatusHistory(task.id).then(setHistory).catch(() => {});
    } else {
      setNotes([
        {
          id: 'n1', task_id: task.id, author: 'GMG Admin', author_type: 'human_team',
          body: 'Initial brief sent. Waiting on confirmation from the sync team.',
          created_at: new Date(Date.now() - 7_200_000).toISOString(),
        },
      ]);
      setHistory([
        { id: 'h1', task_id: task.id, from_status: undefined, to_status: 'open', changed_by: 'GMG Admin', created_at: task.created_at },
        ...(task.status !== 'open' ? [{
          id: 'h2', task_id: task.id, from_status: 'open', to_status: task.status,
          changed_by: task.assignee_name, created_at: task.updated_at,
        }] : []),
      ]);
    }
  }, [task, useMock]);

  if (!detailTaskId || !task) return null;

  const AIcon = ASSIGNEE_ICONS[task.assignee_type];
  const pm = PRIORITY_META[task.priority];
  const sm = STATUS_META[task.status];
  const atm = ASSIGNEE_TYPE_META[task.assignee_type];

  async function submitNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      if (!useMock) {
        const n = await addTaskNote(task!.id, 'GMG Admin', 'human_team', noteText.trim());
        setNotes(prev => [...prev, n]);
      } else {
        setNotes(prev => [...prev, {
          id: `note-${Date.now()}`, task_id: task!.id, author: 'GMG Admin',
          author_type: 'human_team', body: noteText.trim(), created_at: new Date().toISOString(),
        }]);
      }
      setNoteText('');
    } finally {
      setAddingNote(false);
    }
  }

  return (
    <>
      <div onClick={closeDetail} style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} />

      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 1401, width: '100%', maxWidth: 660,
        background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, boxShadow: '0 48px 120px rgba(0,0,0,0.85)',
        overflow: 'hidden', animation: 'fadeUpTask 0.18s ease-out',
        maxHeight: '88vh', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,transparent,${pm.color}50,transparent)` }} />

        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 5, fontWeight: 700,
                color: pm.color, background: `${pm.color}15`, border: `1px solid ${pm.color}25` }}>
                {pm.label.toUpperCase()}
              </span>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setStatusOpen(p => !p)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', padding: '2px 7px',
                    borderRadius: 5, fontWeight: 700, cursor: 'pointer', color: sm.color,
                    background: `${sm.color}15`, border: `1px solid ${sm.color}25` }}
                >
                  {sm.label.toUpperCase()} <ChevronDown size={9} />
                </button>
                {statusOpen && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 10, marginTop: 3,
                    background: '#111214', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 9, boxShadow: '0 8px 24px rgba(0,0,0,0.6)', overflow: 'hidden', minWidth: 130 }}>
                    {STATUS_OPTIONS.map(s => {
                      const sm2 = STATUS_META[s.value];
                      return (
                        <button
                          key={s.value}
                          onClick={() => {
                            changeStatus(task.id, s.value, 'GMG Admin');
                            setStatusOpen(false);
                          }}
                          style={{ width: '100%', padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
                            background: s.value === task.status ? `${sm2.color}08` : 'none',
                            border: 'none', color: sm2.color, fontSize: 11, display: 'block' }}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: '#fff', lineHeight: 1.3, margin: 0 }}>{task.title}</h2>
            {task.linked_entity_name && (
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontFamily: 'monospace' }}>
                {task.linked_system.replace('_', ' ').toUpperCase()} · {task.linked_entity_name}
              </p>
            )}
          </div>
          <button onClick={closeDetail} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4, flexShrink: 0 }}>
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          {(['details', 'notes', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 0', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: 'none', background: 'none', textTransform: 'capitalize',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.3)',
                borderBottom: tab === t ? '2px solid #10B981' : '2px solid transparent',
              }}
            >
              {t} {t === 'notes' && notes.length > 0 ? `(${notes.length})` : ''}
            </button>
          ))}
        </div>

        <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>

          {tab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {task.description && (
                <div>
                  <p style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 6 }}>Description</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>{task.description}</p>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 8.5, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>Assigned To</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <AIcon size={13} color={atm.color} />
                    <div>
                      <p style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{task.assignee_name}</p>
                      <p style={{ fontSize: 9, color: atm.color, fontFamily: 'monospace', marginTop: 1 }}>{atm.label}</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: 8.5, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Calendar size={9} /> Due Date
                  </p>
                  <p style={{ fontSize: 13, color: task.due_date ? '#F9FAFB' : '#374151', fontWeight: 600 }}>
                    {task.due_date ? fmtDate(task.due_date) : 'No deadline set'}
                  </p>
                </div>

                {task.revenue_impact != null && (
                  <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p style={{ fontSize: 8.5, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <DollarSign size={9} /> Revenue Impact
                    </p>
                    <p style={{ fontSize: 13, color: '#10B981', fontWeight: 700 }}>{task.revenue_impact_label ?? `$${task.revenue_impact.toLocaleString()}`}</p>
                  </div>
                )}

                {task.related_milestone && (
                  <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: 10, padding: '11px 13px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ fontSize: 8.5, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Link2 size={9} /> Milestone
                    </p>
                    <p style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 500 }}>{task.related_milestone}</p>
                  </div>
                )}
              </div>

              {task.blocker_notes && (
                <div style={{ padding: '11px 13px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                    <Flag size={12} color="#EF4444" />
                    <p style={{ fontSize: 9, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>Blocker</p>
                  </div>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{task.blocker_notes}</p>
                </div>
              )}

              {task.notes && (
                <div>
                  <p style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 6 }}>Initial Notes</p>
                  <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{task.notes}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 16, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {[
                  { label: 'Created', value: `${fmtDate(task.created_at)} by ${task.created_by ?? 'System'}` },
                  ...(task.completed_at ? [{ label: 'Completed', value: `${fmtDate(task.completed_at)} by ${task.completed_by ?? '—'}` }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 8.5, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {notes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '30px 0', color: 'rgba(255,255,255,0.2)' }}>
                  <MessageSquare size={28} style={{ marginBottom: 8, opacity: 0.3 }} />
                  <p style={{ fontSize: 12 }}>No notes yet. Add the first one below.</p>
                </div>
              )}
              {notes.map(n => {
                const NIcon = ASSIGNEE_ICONS[n.author_type];
                const natm = ASSIGNEE_TYPE_META[n.author_type];
                return (
                  <div key={n.id} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: `${natm.color}14`, border: `1px solid ${natm.color}22` }}>
                      <NIcon size={12} color={natm.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#D1D5DB' }}>{n.author}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{fmtTime(n.created_at)}</span>
                      </div>
                      <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>{n.body}</p>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={3}
                  placeholder="Add a note or update..."
                  style={{
                    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 9, color: '#D1D5DB', fontSize: 12, outline: 'none',
                    resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.5, marginBottom: 8,
                  }}
                />
                <button
                  onClick={submitNote}
                  disabled={addingNote || !noteText.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8,
                    background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
                    color: '#10B981', fontSize: 11, fontWeight: 700, cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                    opacity: noteText.trim() ? 1 : 0.5,
                  }}
                >
                  {addingNote ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={11} />}
                  Add Note
                </button>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.length === 0 && (
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '24px 0' }}>No status changes recorded yet.</p>
              )}
              {history.map((h, i) => {
                const sm2 = STATUS_META[h.to_status as TaskStatus] ?? { label: h.to_status, color: '#6B7280' };
                return (
                  <div key={h.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, flexShrink: 0, paddingTop: 3 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: sm2.color }} />
                      {i < history.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.07)', minHeight: 20 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 4,
                          color: sm2.color, background: `${sm2.color}12` }}>{sm2.label}</span>
                        {h.from_status && (
                          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
                            from {STATUS_META[h.from_status as TaskStatus]?.label ?? h.from_status}
                          </span>
                        )}
                        <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.4)' }}>by {h.changed_by}</span>
                        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginLeft: 'auto' }}>{fmtTime(h.created_at)}</span>
                      </div>
                      {h.note && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, lineHeight: 1.5 }}>{h.note}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '10px 20px 14px', borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={11} color="#6B7280" />
            <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>
              Updated {fmtTime(task.updated_at)}
            </span>
          </div>
          <button
            onClick={closeDetail}
            style={{ padding: '7px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: 11.5, cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
