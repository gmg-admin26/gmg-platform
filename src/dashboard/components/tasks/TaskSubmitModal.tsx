import { useState } from 'react';
import {
  X, Plus, Trash2, Send, Loader, CheckCircle, ChevronDown,
  Bot, User, UserCheck, Globe, AlertCircle,
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import type { TaskPriority, AssigneeType, CreateTaskInput } from '../../data/taskService';
import { PRIORITY_META, ASSIGNEE_TYPE_META, SYSTEM_META } from '../../data/taskService';

const ASSIGNEES = [
  { name: 'AI Marketing Operator', type: 'ai_operator' as AssigneeType },
  { name: 'GMG Admin',             type: 'human_team'  as AssigneeType },
  { name: 'GMG Ops',               type: 'human_team'  as AssigneeType },
  { name: 'GMG Legal',             type: 'human_team'  as AssigneeType },
  { name: 'GMG Sync Team',         type: 'human_team'  as AssigneeType },
  { name: 'GMG Marketing',         type: 'human_team'  as AssigneeType },
  { name: 'Artist / Manager',      type: 'artist'      as AssigneeType },
  { name: 'External Partner',      type: 'external'    as AssigneeType },
  { name: 'Unassigned',            type: 'human_team'  as AssigneeType },
];

const ASSIGNEE_ICONS: Record<AssigneeType, typeof Bot> = {
  ai_operator: Bot,
  human_team:  User,
  artist:      UserCheck,
  external:    Globe,
};

interface RowState {
  title: string;
  priority: TaskPriority;
  assignee_name: string;
  assignee_type: AssigneeType;
  due_date: string;
  notes: string;
}

const defaultRow = (): RowState => ({
  title: '', priority: 'medium', assignee_name: 'Unassigned',
  assignee_type: 'human_team', due_date: '', notes: '',
});

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 9, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700, marginBottom: 5 }}>
      {children}
    </p>
  );
}

function SelectBtn({ value, options, onChange, style }: {
  value: string;
  options: { value: string; label: string; color?: string }[];
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.value === value);
  return (
    <div style={{ position: 'relative', ...style }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: current?.color ?? '#D1D5DB', fontSize: 11,
        }}
      >
        <span style={{ color: current?.color }}>{current?.label}</span>
        <ChevronDown size={11} style={{ color: '#6B7280' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: 3,
          background: '#111214', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 9, boxShadow: '0 8px 32px rgba(0,0,0,0.6)', overflow: 'hidden',
        }}>
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 12px', textAlign: 'left', cursor: 'pointer',
                background: o.value === value ? 'rgba(255,255,255,0.05)' : 'none',
                border: 'none', color: o.value === value ? (o.color ?? '#fff') : '#9CA3AF', fontSize: 11,
                display: 'block',
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskSubmitModal() {
  const { submitOpen, submitSystem, submitEntityName, closeSubmit, addTask } = useTasks();
  const [rows, setRows] = useState<RowState[]>([defaultRow()]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [submitterName, setSubmitterName] = useState('');

  if (!submitOpen) return null;

  const systemMeta = SYSTEM_META[submitSystem];

  function updateRow(i: number, patch: Partial<RowState>) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  }

  function addRow() { setRows(prev => [...prev, defaultRow()]); }
  function removeRow(i: number) { setRows(prev => prev.filter((_, idx) => idx !== i)); }

  async function handleSubmit() {
    const valid = rows.filter(r => r.title.trim());
    if (!valid.length) { setError('Please add at least one task title.'); return; }
    setSaving(true);
    setError('');
    try {
      for (const row of valid) {
        const input: CreateTaskInput = {
          title: row.title.trim(),
          notes: row.notes.trim() || undefined,
          linked_system: submitSystem,
          linked_entity_name: submitEntityName || undefined,
          assignee_name: row.assignee_name,
          assignee_type: row.assignee_type,
          priority: row.priority,
          due_date: row.due_date || undefined,
          created_by: submitterName.trim() || 'Unknown',
        };
        await addTask(input);
      }
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setRows([defaultRow()]);
        setSubmitterName('');
        closeSubmit();
      }, 1800);
    } catch {
      setError('Submission failed. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    setRows([defaultRow()]);
    setSubmitterName('');
    setError('');
    closeSubmit();
  }

  const priorityOptions = (Object.entries(PRIORITY_META) as [TaskPriority, { label: string; color: string }][])
    .map(([v, m]) => ({ value: v, label: m.label, color: m.color }));

  return (
    <>
      <div
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
      />

      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 1401, width: '100%', maxWidth: 680,
        background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, boxShadow: '0 48px 120px rgba(0,0,0,0.85)',
        overflow: 'hidden', animation: 'fadeUpTask 0.18s ease-out',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
      }}>
        <style>{`
          @keyframes fadeUpTask {
            from { transform: translate(-50%,-46%); opacity: 0; }
            to   { transform: translate(-50%,-50%); opacity: 1; }
          }
        `}</style>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${systemMeta.color}60, transparent)` }} />

        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `${systemMeta.color}18`,
              border: `1px solid ${systemMeta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={14} color={systemMeta.color} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Submit Task / Request</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
                {systemMeta.label.toUpperCase()}{submitEntityName ? ` · ${submitEntityName}` : ''}
              </div>
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
            <X size={15} />
          </button>
        </div>

        {saved ? (
          <div style={{ padding: '52px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} color="#10B981" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 5 }}>
                {rows.filter(r => r.title.trim()).length} Task{rows.filter(r => r.title.trim()).length > 1 ? 's' : ''} Submitted
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Tasks have been logged and assigned. You'll receive an update as work progresses.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '18px 22px', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: 16 }}>
              <FieldLabel>Your Name / Submitted By</FieldLabel>
              <input
                value={submitterName}
                onChange={e => setSubmitterName(e.target.value)}
                placeholder="Name or email..."
                style={{
                  width: '100%', padding: '8px 11px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <FieldLabel>Tasks ({rows.length})</FieldLabel>
                {rows.length < 8 && (
                  <button
                    onClick={addRow}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 7,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#9CA3AF', fontSize: 10.5, cursor: 'pointer',
                    }}
                  >
                    <Plus size={11} /> Add Task
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {rows.map((row, i) => {
                  const AIcon = ASSIGNEE_ICONS[row.assignee_type];
                  return (
                    <div key={i} style={{
                      background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 12, padding: '14px 14px 12px', position: 'relative',
                    }}>
                      {rows.length > 1 && (
                        <button
                          onClick={() => removeRow(i)}
                          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none',
                            cursor: 'pointer', color: '#EF4444', opacity: 0.5, padding: 3 }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}

                      <div style={{ marginBottom: 10 }}>
                        <FieldLabel>Task Title *</FieldLabel>
                        <input
                          value={row.title}
                          onChange={e => updateRow(i, { title: e.target.value })}
                          placeholder="What needs to be done?"
                          style={{
                            width: '100%', padding: '8px 11px', boxSizing: 'border-box',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                          }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div>
                          <FieldLabel>Priority</FieldLabel>
                          <SelectBtn
                            value={row.priority}
                            options={priorityOptions}
                            onChange={v => updateRow(i, { priority: v as TaskPriority })}
                          />
                        </div>

                        <div>
                          <FieldLabel>Assigned To</FieldLabel>
                          <div style={{ position: 'relative' }}>
                            <SelectBtn
                              value={row.assignee_name}
                              options={ASSIGNEES.map(a => ({ value: a.name, label: a.name, color: ASSIGNEE_TYPE_META[a.type].color }))}
                              onChange={v => {
                                const a = ASSIGNEES.find(x => x.name === v);
                                updateRow(i, { assignee_name: v, assignee_type: a?.type ?? 'human_team' });
                              }}
                            />
                            <AIcon size={10} style={{
                              position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)',
                              color: ASSIGNEE_TYPE_META[row.assignee_type].color, pointerEvents: 'none',
                            }} />
                          </div>
                        </div>

                        <div>
                          <FieldLabel>Due Date</FieldLabel>
                          <input
                            type="date"
                            value={row.due_date}
                            onChange={e => updateRow(i, { due_date: e.target.value })}
                            style={{
                              width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                              borderRadius: 8, color: '#D1D5DB', fontSize: 11, outline: 'none',
                              colorScheme: 'dark',
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <FieldLabel>Notes / Context (optional)</FieldLabel>
                        <textarea
                          value={row.notes}
                          onChange={e => updateRow(i, { notes: e.target.value })}
                          rows={2}
                          placeholder="Additional context, links, or instructions..."
                          style={{
                            width: '100%', padding: '8px 11px', boxSizing: 'border-box',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                            borderRadius: 8, color: '#D1D5DB', fontSize: 11, outline: 'none',
                            resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.5,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AlertCircle size={12} color="#6B7280" />
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                Attachments can be added after submission by opening the task detail.
              </p>
            </div>

            {error && (
              <div style={{ padding: '9px 13px', borderRadius: 9, background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#EF4444', marginTop: 8 }}>
                {error}
              </div>
            )}
          </div>
        )}

        {!saved && (
          <div style={{ padding: '12px 22px 18px', borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
              {rows.filter(r => r.title.trim()).length} task{rows.filter(r => r.title.trim()).length !== 1 ? 's' : ''} ready to submit
            </p>
            <div style={{ display: 'flex', gap: 9 }}>
              <button
                onClick={handleClose}
                style={{ padding: '8px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '8px 22px', borderRadius: 9,
                  background: `${systemMeta.color}18`, border: `1px solid ${systemMeta.color}35`,
                  color: systemMeta.color, fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving
                  ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
                  : <><Send size={12} /> Submit {rows.filter(r => r.title.trim()).length > 1 ? 'All' : 'Task'}</>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
