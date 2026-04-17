import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Plus, Loader, Building2, X } from 'lucide-react';
import { labelsData, getLabelById, LABEL_TYPE_COLORS, syncLabelFromSupabase, type LabelRecord } from '../../data/labelsData';
import {
  assignArtistToLabel, removeArtistFromLabel,
  createLabel, type ArtistLabelAssignment,
} from '../../data/labelService';

interface CreateLabelFormState {
  name: string;
  type: 'Partner' | 'Distribution' | 'Internal';
  color: string;
}

const PRESET_COLORS = [
  '#06B6D4', '#10B981', '#F59E0B', '#EC4899',
  '#EF4444', '#8B5CF6', '#F97316', '#3B82F6',
];

interface Props {
  artistId: string;
  currentLabelId: string | null;
  assignments: ArtistLabelAssignment[];
  assignedBy?: string;
  onAssigned: (newLabelId: string | null, updatedAssignments: ArtistLabelAssignment[]) => void;
  disabled?: boolean;
}

export default function LabelAssignDropdown({
  artistId,
  currentLabelId,
  assignments,
  assignedBy = 'admin',
  onAssigned,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState<CreateLabelFormState>({
    name: '', type: 'Partner', color: '#06B6D4',
  });
  const [labels, setLabels] = useState<LabelRecord[]>(labelsData);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLabelId = assignments.find(a => a.active)?.label_id ?? currentLabelId ?? null;
  const activeLabel = activeLabelId ? getLabelById(activeLabelId) : null;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCreate(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function selectLabel(labelId: string) {
    if (loading) return;
    setLoading(labelId);

    const prevLabelId = activeLabelId;

    if (prevLabelId && prevLabelId !== labelId) {
      await removeArtistFromLabel(artistId, prevLabelId);
    }

    if (prevLabelId === labelId) {
      await removeArtistFromLabel(artistId, labelId);
      setLoading(null);
      setOpen(false);
      onAssigned(null, []);
      return;
    }

    const { error } = await assignArtistToLabel(artistId, labelId, 'primary', assignedBy);
    setLoading(null);
    setOpen(false);

    if (!error) {
      const newAssignment: ArtistLabelAssignment = {
        id: `tmp-${Date.now()}`,
        artist_id: artistId,
        label_id: labelId,
        role: 'primary',
        assigned_at: new Date().toISOString(),
        assigned_by: assignedBy,
        notes: '',
        active: true,
      };
      onAssigned(labelId, [newAssignment]);
    }
  }

  async function handleCreate() {
    if (!createForm.name.trim()) {
      setCreateError('Label name is required.');
      return;
    }
    setCreating(true);
    setCreateError('');
    const slug = createForm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data, error } = await createLabel({
      slug,
      name: createForm.name.trim(),
      type: createForm.type.toLowerCase() as 'partner' | 'distribution' | 'internal',
      color: createForm.color,
    });
    if (error || !data) {
      setCreateError(error ?? 'Failed to create label.');
      setCreating(false);
      return;
    }
    syncLabelFromSupabase({ id: data.id, slug: data.slug, name: data.name, type: data.type, status: data.status, color: data.color, notes: data.notes, ar_rep: data.ar_rep, point_person: data.point_person });
    setLabels([...labelsData]);
    setCreating(false);
    setShowCreate(false);
    setCreateForm({ name: '', type: 'Partner', color: '#06B6D4' });
    await selectLabel(data.id);
  }

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '8px 10px',
    borderRadius: 9,
    background: open ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
    border: `1px solid ${open ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.15s',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <button
        onClick={() => !disabled && setOpen(o => !o)}
        style={buttonStyle}
        disabled={disabled}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {activeLabel ? (
            <>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: activeLabel.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{activeLabel.name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: `${activeLabel.color}18`, color: activeLabel.color, border: `1px solid ${activeLabel.color}28` }}>
                {activeLabel.type}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Unassigned — Independent</span>
          )}
        </div>
        <ChevronDown size={12} color="rgba(255,255,255,0.3)" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0,
          background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 11, zIndex: 200, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
        }}>
          {!showCreate ? (
            <>
              <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div
                  onClick={() => !loading && activeLabelId && selectLabel(activeLabelId)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 10px', borderRadius: 8, cursor: loading ? 'wait' : 'pointer',
                    background: !activeLabelId ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = !activeLabelId ? 'rgba(255,255,255,0.05)' : 'transparent')}
                >
                  <div style={{ width: 16, height: 16, borderRadius: 5, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {!activeLabelId && <Check size={9} color="rgba(255,255,255,0.5)" />}
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Independent (unassigned)</span>
                </div>

                {labels.map(lbl => {
                  const isActive = activeLabelId === lbl.id;
                  const isLoading = loading === lbl.id;
                  const typeMeta = LABEL_TYPE_COLORS[lbl.type as keyof typeof LABEL_TYPE_COLORS];
                  return (
                    <div
                      key={lbl.id}
                      onClick={() => !loading && selectLabel(lbl.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '7px 10px', borderRadius: 8,
                        cursor: loading ? 'wait' : 'pointer',
                        background: isActive ? `${lbl.color}10` : 'transparent',
                        border: isActive ? `1px solid ${lbl.color}22` : '1px solid transparent',
                        transition: 'all 0.12s',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <div style={{ width: 16, height: 16, borderRadius: 5, background: `${lbl.color}18`, border: `1px solid ${lbl.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {isLoading ? <Loader size={8} color={lbl.color} style={{ animation: 'spin 1s linear infinite' }} /> : isActive ? <Check size={9} color={lbl.color} /> : null}
                      </div>
                      <span style={{ fontSize: 11, color: isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)', flex: 1, fontWeight: isActive ? 600 : 400 }}>{lbl.name}</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: typeMeta.bg, color: typeMeta.color, border: `1px solid ${typeMeta.color}25` }}>
                        {lbl.type}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: 6 }}>
                <div
                  onClick={() => setShowCreate(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(6,182,212,0.07)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ width: 16, height: 16, borderRadius: 5, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Plus size={9} color="#06B6D4" />
                  </div>
                  <span style={{ fontSize: 11, color: '#06B6D4', fontWeight: 600 }}>Create New Label</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={12} color="#06B6D4" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>New Label</span>
                </div>
                <button onClick={() => { setShowCreate(false); setCreateError(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex' }}>
                  <X size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label Name</label>
                  <input
                    autoFocus
                    value={createForm.name}
                    onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="e.g. SNBJR Records"
                    style={{
                      width: '100%', padding: '7px 10px', borderRadius: 7,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff', fontSize: 12, outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Type</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {(['Partner', 'Distribution', 'Internal'] as const).map(t => {
                      const meta = LABEL_TYPE_COLORS[t];
                      return (
                        <button
                          key={t}
                          onClick={() => setCreateForm(f => ({ ...f, type: t }))}
                          style={{
                            flex: 1, padding: '5px 0', borderRadius: 6, fontSize: 10, fontFamily: 'monospace',
                            cursor: 'pointer', transition: 'all 0.12s',
                            background: createForm.type === t ? meta.bg : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${createForm.type === t ? `${meta.color}40` : 'rgba(255,255,255,0.08)'}`,
                            color: createForm.type === t ? meta.color : 'rgba(255,255,255,0.4)',
                          }}
                        >{t}</button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Color</label>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setCreateForm(f => ({ ...f, color: c }))}
                        style={{
                          width: 22, height: 22, borderRadius: 6, background: c, cursor: 'pointer',
                          border: createForm.color === c ? '2px solid #fff' : '2px solid transparent',
                          transition: 'border 0.12s',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {createError && (
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444', padding: '4px 0' }}>{createError}</div>
                )}

                <button
                  onClick={handleCreate}
                  disabled={creating}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px', borderRadius: 8, cursor: creating ? 'wait' : 'pointer',
                    background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.3)',
                    color: '#06B6D4', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                    marginTop: 2,
                  }}
                >
                  {creating ? <Loader size={11} color="#06B6D4" style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={11} />}
                  {creating ? 'Creating…' : 'Create & Assign'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
