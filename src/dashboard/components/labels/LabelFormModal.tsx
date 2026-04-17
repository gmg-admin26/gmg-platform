import { useState } from 'react';
import { X, Save, Loader, Archive, Building2, CheckCircle } from 'lucide-react';
import {
  createLabel, updateLabel, archiveLabel,
  LABEL_TYPE_META,
  type Label, type CreateLabelInput, type LabelType, type LabelStatus,
} from '../../data/labelService';
import { syncLabelFromSupabase, LABEL_CATEGORIES, LABEL_CATEGORY_META, type LabelCategory } from '../../data/labelsData';
import { GMG_TEAM_MEMBERS } from '../../data/rosterReadiness';

const COLOR_OPTIONS = [
  '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#3B82F6',
  '#EC4899', '#F97316', '#14B8A6', '#22D3EE', '#84CC16',
];

interface Props {
  label?: Label;
  onClose: () => void;
  onSaved: (newLabel?: Label) => void;
}

function FieldInput({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
        }}
      />
    </div>
  );
}

export default function LabelFormModal({ label: existing, onClose, onSaved }: Props) {
  const isEdit = !!existing;

  const [name, setName]               = useState(existing?.name ?? '');
  const [slug, setSlug]               = useState(existing?.slug ?? '');
  const [type, setType]               = useState<LabelType>(existing?.type ?? 'partner');
  const [status, setStatus]           = useState<LabelStatus>(existing?.status ?? 'active');
  const [labelCategory, setLabelCategory] = useState<LabelCategory | ''>(
    (existing?.label_category as LabelCategory) ?? ''
  );
  const [color, setColor]             = useState(existing?.color ?? '#10B981');
  const [description, setDescription] = useState(existing?.notes ?? '');
  const [contactName, setContactName]   = useState(existing?.contact_name ?? '');
  const [contactEmail, setContactEmail] = useState(existing?.contact_email ?? '');
  const [contactPhone, setContactPhone] = useState(existing?.contact_phone ?? '');
  const [website, setWebsite]         = useState(existing?.website ?? '');
  const [foundedYear, setFoundedYear] = useState(existing?.founded_year?.toString() ?? '');
  const [arRep, setArRep]             = useState(existing?.ar_rep ?? '');
  const [pointPerson, setPointPerson] = useState(existing?.point_person ?? '');
  const [saving, setSaving]           = useState(false);
  const [archiving, setArchiving]     = useState(false);
  const [error, setError]             = useState('');
  const [saved, setSaved]             = useState(false);

  function autoSlug(n: string) {
    return n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function makeSlugUnique(base: string): string {
    const ts = Date.now().toString(36).slice(-4);
    return `${base}-${ts}`;
  }

  async function handleSave() {
    if (!name.trim()) { setError('Label name is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    const slugVal = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
    if (!slugVal) { setError('Slug must contain at least one alphanumeric character.'); return; }
    setSaving(true);
    setError('');

    const input: CreateLabelInput = {
      slug: slugVal,
      name: name.trim(),
      type,
      color,
      label_category: labelCategory || null,
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      website,
      notes: description,
      founded_year: foundedYear ? parseInt(foundedYear) : undefined,
      ar_rep: arRep,
      point_person: pointPerson,
    };

    if (isEdit && existing) {
      const { error: err } = await updateLabel(existing.id, { ...input, status });
      setSaving(false);
      if (err) { setError(err); return; }
      syncLabelFromSupabase({ id: existing.id, slug: slugVal, name: name.trim(), type, status, color, notes: description, ar_rep: arRep, point_person: pointPerson, label_category: labelCategory || null });
      setSaved(true);
      setTimeout(() => { onSaved(); onClose(); }, 500);
    } else {
      let result = await createLabel(input);
      if (result.error?.includes('duplicate') || result.error?.includes('unique') || result.error?.includes('already exists')) {
        const uniqueSlug = makeSlugUnique(slugVal);
        setSlug(uniqueSlug);
        result = await createLabel({ ...input, slug: uniqueSlug });
      }
      setSaving(false);
      if (result.error || !result.data) {
        setError(result.error ?? 'Failed to create label.');
        return;
      }
      const data = result.data;
      syncLabelFromSupabase({ id: data.id, slug: data.slug, name: data.name, type: data.type, status: data.status, color: data.color, notes: data.notes, ar_rep: data.ar_rep, point_person: data.point_person, label_category: data.label_category });
      setSaved(true);
      setTimeout(() => { onSaved(data); onClose(); }, 600);
    }
  }

  async function handleArchive() {
    if (!existing) return;
    setArchiving(true);
    await archiveLabel(existing.id);
    setArchiving(false);
    onSaved();
    onClose();
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1200,
        background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 560,
        background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 48px 120px rgba(0,0,0,0.75)',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${color}aa,transparent)` }} />
          <div style={{ padding: '18px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={14} style={{ color }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>{isEdit ? 'Edit Label' : 'Create New Label'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
                  {isEdit ? 'Update label details and settings' : 'Add a new label to the system'}
                </div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 4 }}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 540, overflowY: 'auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <FieldInput
                label="Label Name *"
                value={name}
                onChange={v => { setName(v); if (!isEdit) setSlug(autoSlug(v)); }}
                placeholder="e.g. SPIN Records"
              />
            </div>
            <FieldInput label="Slug *" value={slug} onChange={setSlug} placeholder="e.g. spin-records" />
            <div>
              <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Status</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['active', 'inactive'] as LabelStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                      background: status === s
                        ? (s === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.1)')
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${status === s
                        ? (s === 'active' ? 'rgba(16,185,129,0.35)' : 'rgba(107,114,128,0.28)')
                        : 'rgba(255,255,255,0.07)'}`,
                      color: status === s
                        ? (s === 'active' ? '#10B981' : '#9CA3AF')
                        : '#6B7280',
                    }}
                  >
                    {s === 'active' ? 'Active' : 'Inactive'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Label Type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['internal', 'partner', 'distribution'] as LabelType[]).map(t => {
                const m = LABEL_TYPE_META[t];
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                      background: type === t ? `${m.color}15` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${type === t ? `${m.color}38` : 'rgba(255,255,255,0.07)'}`,
                      color: type === t ? m.color : '#6B7280',
                      transition: 'all 0.13s',
                    }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Label Category</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
              {LABEL_CATEGORIES.map(cat => {
                const m = LABEL_CATEGORY_META[cat];
                const isSelected = labelCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setLabelCategory(isSelected ? '' : cat)}
                    style={{
                      padding: '9px 6px', borderRadius: 9, fontSize: 10, fontWeight: 700, cursor: 'pointer',
                      background: isSelected ? m.bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? m.border : 'rgba(255,255,255,0.07)'}`,
                      color: isSelected ? m.color : '#6B7280',
                      transition: 'all 0.13s',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = m.bg + '60'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>Short Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Describe this label's focus, roster, or partnership..."
              style={{
                width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                resize: 'vertical', fontFamily: 'system-ui',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Accent Color</label>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  title={c}
                  style={{
                    width: 30, height: 30, borderRadius: 9, background: c, cursor: 'pointer', flexShrink: 0,
                    border: color === c ? '2.5px solid #fff' : '2.5px solid transparent',
                    boxShadow: color === c ? `0 0 0 3px ${c}44` : 'none',
                    transition: 'all 0.13s',
                  }}
                />
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: color, border: '1px solid rgba(255,255,255,0.2)' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.3)' }}>{color}</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Internal Assignment</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([
                { label: 'A&R Rep', value: arRep, onChange: setArRep },
                { label: 'Point Person', value: pointPerson, onChange: setPointPerson },
              ] as const).map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>{f.label}</label>
                  <select
                    value={f.value}
                    onChange={e => f.onChange(e.target.value)}
                    style={{
                      width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 9, color: f.value ? '#F9FAFB' : '#6B7280', fontSize: 12, outline: 'none',
                    }}
                  >
                    <option value="">— Unassigned —</option>
                    {GMG_TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Contact Info (optional)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FieldInput label="Contact Name" value={contactName} onChange={setContactName} placeholder="A&R contact" />
              <FieldInput label="Contact Email" value={contactEmail} onChange={setContactEmail} type="email" placeholder="contact@label.com" />
              <FieldInput label="Contact Phone" value={contactPhone} onChange={setContactPhone} placeholder="+1 555 000 0000" />
              <FieldInput label="Website" value={website} onChange={setWebsite} placeholder="https://label.com" />
              <FieldInput label="Founded Year" value={foundedYear} onChange={setFoundedYear} type="number" placeholder="2019" />
            </div>
          </div>

          {error && (
            <div style={{ padding: '9px 13px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#EF4444' }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ padding: '12px 22px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div>
            {isEdit && (
              <button
                onClick={handleArchive}
                disabled={archiving}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px', borderRadius: 9,
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                  color: '#EF4444', fontSize: 11, fontWeight: 700, cursor: archiving ? 'not-allowed' : 'pointer',
                }}
              >
                {archiving ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Archive size={11} />}
                Archive Label
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <button
              onClick={onClose}
              style={{ padding: '8px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 22px', borderRadius: 9, minWidth: 140, justifyContent: 'center',
                background: saved ? 'rgba(16,185,129,0.15)' : `${color}18`,
                border: `1px solid ${saved ? 'rgba(16,185,129,0.35)' : `${color}38`}`,
                color: saved ? '#10B981' : color,
                fontSize: 12, fontWeight: 700,
                cursor: (saving || saved) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {saved
                ? <><CheckCircle size={13} /> {isEdit ? 'Saved' : 'Label Created'}</>
                : saving
                  ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</>
                  : <><Save size={12} /> {isEdit ? 'Save Changes' : 'Create Label'}</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
