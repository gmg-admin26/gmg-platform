import { useState, useEffect, useRef } from 'react';
import { X, Users, Check, Loader, Search } from 'lucide-react';
import {
  fetchAssignmentsByLabel,
  fetchLabelBySlug,
  assignArtistToLabel,
  removeArtistFromLabel,
  type Label,
} from '../../data/labelService';
import { SIGNED_ARTISTS } from '../../data/artistRosterData';

interface Props {
  label: Label;
  onClose: () => void;
  onSaved: () => void;
}

export default function LabelAssignModal({ label, onClose, onSaved }: Props) {
  const [assigned, setAssigned]       = useState<Set<string>>(new Set());
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const resolvedIdRef                 = useRef<string>(label.id);

  useEffect(() => {
    async function load() {
      let labelId = label.id;
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!UUID_RE.test(labelId)) {
        const resolved = await fetchLabelBySlug(labelId);
        if (resolved) {
          labelId = resolved.id;
          resolvedIdRef.current = labelId;
        }
      }
      const assignments = await fetchAssignmentsByLabel(labelId);
      setAssigned(new Set(assignments.map(a => a.artist_id)));
      setLoading(false);
    }
    load();
  }, [label.id]);

  const filtered = SIGNED_ARTISTS.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search)
  );

  async function toggle(artistId: string) {
    const labelId = resolvedIdRef.current;
    setSaving(artistId);
    if (assigned.has(artistId)) {
      await removeArtistFromLabel(artistId, labelId);
      setAssigned(prev => { const s = new Set(prev); s.delete(artistId); return s; });
    } else {
      await assignArtistToLabel(artistId, labelId, 'primary', 'admin');
      setAssigned(prev => new Set([...prev, artistId]));
    }
    setSaving(null);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1300,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }} onClick={e => { if (e.target === e.currentTarget) { onSaved(); onClose(); } }}>
      <div style={{
        width: '100%', maxWidth: 500,
        background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 48px 120px rgba(0,0,0,0.75)',
      }}>
        <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} style={{ color: label.color }} />
            <span style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Assign Artists</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 2 }}>— {label.name}</span>
          </div>
          <button onClick={() => { onSaved(); onClose(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={12} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search artists..."
              style={{ width: '100%', padding: '8px 12px 8px 30px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px 12px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Loading roster...</div>
          ) : (
            filtered.map(artist => {
              const isAssigned = assigned.has(artist.id);
              const isSaving = saving === artist.id;
              return (
                <div key={artist.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  borderRadius: 10, marginBottom: 4,
                  background: isAssigned ? `${label.color}08` : 'transparent',
                  border: `1px solid ${isAssigned ? `${label.color}20` : 'rgba(255,255,255,0.04)'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }} onClick={() => !isSaving && toggle(artist.id)}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}30`, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: artist.avatarColor }}>{artist.avatarInitials}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{artist.id} · {artist.genre}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: isAssigned ? `${label.color}20` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isAssigned ? `${label.color}40` : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isSaving
                      ? <Loader size={10} style={{ color: label.color, animation: 'spin 1s linear infinite' }} />
                      : isAssigned ? <Check size={11} style={{ color: label.color }} /> : null
                    }
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: '10px 20px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'right' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', marginRight: 16 }}>{assigned.size} artist{assigned.size !== 1 ? 's' : ''} assigned</span>
          <button onClick={() => { onSaved(); onClose(); }} style={{ padding: '8px 20px', borderRadius: 9, background: `${label.color}15`, border: `1px solid ${label.color}35`, color: label.color, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
