import { useState } from 'react';
import { X, Flag, UserCheck, Loader } from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import type { RosterFlag, ReadinessStatus } from '../../data/rosterReadiness';
import { GMG_TEAM_MEMBERS } from '../../data/rosterReadiness';

interface Props {
  artist: SignedArtist;
  existingFlag: RosterFlag | null;
  onClose: () => void;
  onSave: (flag: Omit<RosterFlag, 'id' | 'updatedAt'>) => Promise<void>;
}

const STATUS_OPTIONS: { value: ReadinessStatus; label: string; color: string }[] = [
  { value: 'ready',        label: 'Ready',        color: '#10B981' },
  { value: 'needs_review', label: 'Needs Review', color: '#F59E0B' },
  { value: 'incomplete',   label: 'Incomplete',   color: '#EF4444' },
];

export default function FlagAssignModal({ artist, existingFlag, onClose, onSave }: Props) {
  const [status, setStatus]   = useState<ReadinessStatus>(existingFlag?.readinessStatus ?? 'needs_review');
  const [flagged, setFlagged] = useState(existingFlag?.flaggedForUpdate ?? true);
  const [assignTo, setAssignTo] = useState(existingFlag?.assignedTo ?? '');
  const [reason, setReason]   = useState(existingFlag?.flagReason ?? '');
  const [notes, setNotes]     = useState(existingFlag?.adminNotes ?? '');
  const [saving, setSaving]   = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave({
      artistId:         artist.id,
      readinessStatus:  status,
      flaggedForUpdate: flagged,
      assignedTo:       assignTo,
      flagReason:       reason,
      adminNotes:       notes,
      lastReviewedAt:   new Date().toISOString(),
      lastReviewedBy:   'Admin',
    });
    setSaving(false);
    onClose();
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
        width: '100%', maxWidth: 460,
        background: '#0E0F13',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Flag size={14} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#F9FAFB' }}>Flag & Assign</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{artist.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Readiness status */}
          <div>
            <label style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, display: 'block', marginBottom: 8 }}>Readiness Status</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  style={{
                    flex: 1, padding: '8px 4px', borderRadius: 8, cursor: 'pointer',
                    background: status === opt.value ? `${opt.color}18` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${status === opt.value ? opt.color : 'rgba(255,255,255,0.08)'}`,
                    color: status === opt.value ? opt.color : '#6B7280',
                    fontSize: 12, fontWeight: 600,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flag toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB' }}>Flag for Update</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>Marks artist as needing data entry</div>
            </div>
            <button
              onClick={() => setFlagged(f => !f)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: flagged ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${flagged ? '#F59E0B' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 3, left: flagged ? 22 : 3,
                width: 16, height: 16, borderRadius: '50%',
                background: flagged ? '#F59E0B' : '#6B7280',
                transition: 'all 0.2s ease',
              }} />
            </button>
          </div>

          {/* Assign to */}
          <div>
            <label style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, display: 'block', marginBottom: 6 }}>
              <UserCheck size={11} style={{ display: 'inline', marginRight: 5 }} />
              Assign To
            </label>
            <select
              value={assignTo}
              onChange={e => setAssignTo(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 8, color: assignTo ? '#F9FAFB' : '#6B7280',
                fontSize: 12, outline: 'none',
              }}
            >
              <option value="">— Unassigned —</option>
              {GMG_TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {/* Flag reason */}
          <div>
            <label style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, display: 'block', marginBottom: 6 }}>Flag Reason</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Missing email, no active release..."
              style={{
                width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
              }}
            />
          </div>

          {/* Admin notes */}
          <div>
            <label style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, display: 'block', marginBottom: 6 }}>Admin Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes for this artist..."
              style={{
                width: '100%', padding: '8px 10px', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 8, color: '#F9FAFB', fontSize: 12, outline: 'none',
                resize: 'none', fontFamily: 'system-ui, sans-serif',
              }}
            />
          </div>
        </div>

        {/* Footer */}
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '7px 16px', borderRadius: 8,
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#F59E0B', fontSize: 12, fontWeight: 700,
              cursor: saving ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {saving ? <Loader size={12} /> : <Flag size={12} />}
            {saving ? 'Saving...' : 'Save Flag'}
          </button>
        </div>
      </div>
    </div>
  );
}
