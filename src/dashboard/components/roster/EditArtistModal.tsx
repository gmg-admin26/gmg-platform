import { useState, useEffect } from 'react';
import { X, Save, Loader, Building2 } from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import { GMG_TEAM_MEMBERS } from '../../data/rosterReadiness';
import { labelsData, getLabelById, LABEL_TYPE_COLORS } from '../../data/labelsData';
import {
  assignArtistToLabel, removeArtistFromLabel,
  fetchAssignmentsByArtist, type ArtistLabelAssignment,
} from '../../data/labelService';

interface Props {
  artist: SignedArtist;
  onClose: () => void;
  onSave: (updates: Partial<SignedArtist>) => Promise<void>;
  onLabelChanged?: (newLabelId: string | null) => void;
}

const FIELD_GROUPS = [
  {
    label: 'Identity',
    fields: [
      { key: 'name',      label: 'Artist Name',  type: 'text' },
      { key: 'genre',     label: 'Genre',         type: 'text' },
      { key: 'subgenre',  label: 'Subgenre',      type: 'text' },
      { key: 'city',      label: 'City',           type: 'text' },
      { key: 'market',    label: 'Market',         type: 'text' },
      { key: 'signingDate', label: 'Signing Date', type: 'text' },
    ],
  },
  {
    label: 'Contact',
    fields: [
      { key: 'primaryEmail',      label: 'Primary Email',    type: 'email' },
      { key: 'artistPhone',       label: 'Artist Phone',     type: 'tel'   },
      { key: 'manager',           label: 'Manager Name',     type: 'text'  },
      { key: 'managementContact', label: 'Manager Email',    type: 'email' },
      { key: 'managerPhone',      label: 'Manager Phone',    type: 'tel'   },
    ],
  },
  {
    label: 'Social Links',
    fields: [
      { key: 'spotifyLink',    label: 'Spotify Link',    type: 'url' },
      { key: 'instagramLink',  label: 'Instagram Link',  type: 'url' },
      { key: 'tiktokLink',     label: 'TikTok Link',     type: 'url' },
      { key: 'youtubeLink',    label: 'YouTube Link',    type: 'url' },
      { key: 'facebookLink',   label: 'Facebook Link',   type: 'url' },
      { key: 'instagramHandle',label: 'Instagram Handle',type: 'text'},
    ],
  },
  {
    label: 'Internal',
    fields: [
      { key: 'arRep',        label: 'A&R Rep',       type: 'text' },
      { key: 'pointPerson',  label: 'Point Person',  type: 'text' },
      { key: 'rosterNotes',  label: 'Roster Notes',  type: 'textarea' },
      { key: 'internalNotes',label: 'Internal Notes',type: 'textarea' },
    ],
  },
];

const ALL_TABS = [...FIELD_GROUPS.map(g => g.label), 'Label'];

function LabelTab({
  artist,
  onLabelChanged,
}: {
  artist: SignedArtist;
  onLabelChanged?: (newLabelId: string | null) => void;
}) {
  const [assignments, setAssignments] = useState<ArtistLabelAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchAssignmentsByArtist(artist.id).then(data => {
      setAssignments(data);
      setLoading(false);
    });
  }, [artist.id]);

  const activeAssignment = assignments.find(a => a.active);
  const activeLabelId = activeAssignment?.label_id ?? artist.label_id ?? null;
  const activeLabel = activeLabelId ? labelsData.find(l => l.id === activeLabelId) ?? getLabelById(activeLabelId) : null;

  async function handleAssign(labelId: string) {
    setAssigning(labelId);
    if (activeLabelId && activeLabelId !== labelId) {
      await removeArtistFromLabel(artist.id, activeLabelId);
    }
    await assignArtistToLabel(artist.id, labelId, 'primary', 'admin');
    const updated = await fetchAssignmentsByArtist(artist.id);
    setAssignments(updated);
    setAssigning(null);
    onLabelChanged?.(labelId);
  }

  async function handleRemove() {
    if (!activeLabelId) return;
    setRemoving(true);
    await removeArtistFromLabel(artist.id, activeLabelId);
    const updated = await fetchAssignmentsByArtist(artist.id);
    setAssignments(updated);
    setRemoving(false);
    onLabelChanged?.(null);
  }

  if (loading) {
    return (
      <div style={{ padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Loader size={13} color="#10B981" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: 12, color: '#6B7280' }}>Loading label data…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: '14px 16px',
        background: activeLabel ? `${activeLabel.color}08` : 'rgba(255,255,255,0.025)',
        border: `1px solid ${activeLabel ? `${activeLabel.color}22` : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12,
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          Current Label Assignment
        </div>
        {activeLabel ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${activeLabel.color}18`, border: `1px solid ${activeLabel.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Building2 size={15} color={activeLabel.color} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{activeLabel.name}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 4 }}>
                  {(() => {
                    const meta = LABEL_TYPE_COLORS[activeLabel.type];
                    return (
                      <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: meta.bg, color: meta.color }}>
                        {activeLabel.type}
                      </span>
                    );
                  })()}
                  <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                    Active
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={removing}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: removing ? 'wait' : 'pointer',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!removing) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.15)'; } }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)'; }}
            >
              {removing ? <Loader size={10} style={{ animation: 'spin 1s linear infinite' }} /> : null}
              {removing ? 'Removing…' : 'Remove from Label'}
            </button>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
            Not assigned to any label — GMG Direct
          </div>
        )}
      </div>

      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
          {activeLabel ? 'Move to Another Label' : 'Assign to Label'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {labelsData.filter(l => l.status === 'Active').map(lbl => {
            const isActive = activeLabelId === lbl.id;
            const isLoading = assigning === lbl.id;
            const typeMeta = LABEL_TYPE_COLORS[lbl.type];
            return (
              <div
                key={lbl.id}
                onClick={() => !assigning && !isActive && handleAssign(lbl.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, cursor: isActive ? 'default' : assigning ? 'wait' : 'pointer',
                  background: isActive ? `${lbl.color}10` : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${isActive ? `${lbl.color}30` : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.12s',
                  opacity: assigning && !isLoading ? 0.5 : 1,
                }}
                onMouseEnter={e => { if (!isActive && !assigning) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${lbl.color}18`, border: `1px solid ${lbl.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isLoading
                    ? <Loader size={11} color={lbl.color} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Building2 size={12} color={lbl.color} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}>{lbl.name}</div>
                  <span style={{ fontFamily: 'monospace', fontSize: 7.5, padding: '1px 5px', borderRadius: 4, background: typeMeta.bg, color: typeMeta.color }}>
                    {lbl.type}
                  </span>
                </div>
                {isActive && (
                  <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 8px', borderRadius: 20, background: `${lbl.color}15`, color: lbl.color, border: `1px solid ${lbl.color}30` }}>
                    Current
                  </span>
                )}
                {!isActive && !isLoading && (
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                    {activeLabel ? 'Move here' : 'Assign'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function EditArtistModal({ artist, onClose, onSave, onLabelChanged }: Props) {
  const [form, setForm] = useState<Partial<SignedArtist>>({
    name:              artist.name,
    genre:             artist.genre,
    subgenre:          artist.subgenre,
    city:              artist.city,
    market:            artist.market,
    signingDate:       artist.signingDate,
    primaryEmail:      artist.primaryEmail,
    artistPhone:       artist.artistPhone,
    manager:           artist.manager,
    managementContact: artist.managementContact,
    managerPhone:      artist.managerPhone,
    spotifyLink:       artist.spotifyLink,
    instagramLink:     artist.instagramLink,
    instagramHandle:   artist.instagramHandle,
    tiktokLink:        artist.tiktokLink,
    youtubeLink:       artist.youtubeLink,
    facebookLink:      artist.facebookLink,
    arRep:             artist.arRep,
    pointPerson:       artist.pointPerson,
    rosterNotes:       artist.rosterNotes,
    internalNotes:     artist.internalNotes,
  });
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLabelTab = activeTab === ALL_TABS.length - 1;
  const group = isLabelTab ? null : FIELD_GROUPS[activeTab];

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    if (isLabelTab) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 600,
        background: '#0E0F13',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F9FAFB' }}>Edit Artist</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>{artist.name} · {artist.id}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px', overflowX: 'auto' }}>
          {ALL_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '10px 14px', whiteSpace: 'nowrap',
                background: 'none', border: 'none',
                borderBottom: activeTab === i
                  ? tab === 'Label' ? '2px solid #06B6D4' : '2px solid #10B981'
                  : '2px solid transparent',
                color: activeTab === i
                  ? tab === 'Label' ? '#06B6D4' : '#10B981'
                  : '#6B7280',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                marginBottom: -1, transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ padding: 20, maxHeight: 420, overflowY: 'auto' }}>
          {isLabelTab ? (
            <LabelTab artist={artist} onLabelChanged={onLabelChanged} />
          ) : group ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {group.fields.map(field => {
                const val = (form as Record<string, unknown>)[field.key] as string ?? '';
                const isTeamField = field.key === 'arRep' || field.key === 'pointPerson';
                return (
                  <div key={field.key} style={{ gridColumn: field.type === 'textarea' ? 'span 2' : 'span 1' }}>
                    <label style={{ display: 'block', fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginBottom: 5 }}>
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={val}
                        onChange={e => set(field.key, e.target.value)}
                        rows={3}
                        style={{
                          width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 8, color: '#F9FAFB', fontSize: 12,
                          outline: 'none', resize: 'vertical',
                          fontFamily: 'system-ui, sans-serif',
                        }}
                      />
                    ) : isTeamField ? (
                      <select
                        value={val}
                        onChange={e => set(field.key, e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                        }}
                      >
                        <option value="">— Unassigned —</option>
                        {GMG_TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={val}
                        onChange={e => set(field.key, e.target.value)}
                        style={{
                          width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '14px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {isLabelTab ? 'Close' : 'Cancel'}
          </button>
          {!isLabelTab && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '7px 16px', borderRadius: 8,
                background: saved ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
                border: `1px solid ${saved ? '#10B981' : 'rgba(16,185,129,0.3)'}`,
                color: '#10B981', fontSize: 12, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={12} />}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
