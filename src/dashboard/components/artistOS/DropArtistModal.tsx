import { useState } from 'react';
import { AlertTriangle, X, UserMinus, Loader, ShieldOff, DollarSign, FileText } from 'lucide-react';
import { dropArtist } from '../../data/dropArtistService';

interface Props {
  artistId: string;
  artistName: string;
  initiatedBy: string;
  onClose: () => void;
  onConfirmed: (artistId: string) => void;
}

export default function DropArtistModal({ artistId, artistName, initiatedBy, onClose, onConfirmed }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const { error: err } = await dropArtist({ artistId, artistName, initiatedBy, notes: notes.trim() || undefined });
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    onConfirmed(artistId);
    onClose();
  }

  const consequences = [
    { icon: ShieldOff,  color: '#EF4444', label: 'Campaign & release access locked' },
    { icon: DollarSign, color: '#F59E0B', label: 'Payout and Safe access preserved' },
    { icon: FileText,   color: '#06B6D4', label: 'Metadata transfer processing initiated' },
    { icon: UserMinus,  color: '#9CA3AF', label: 'Artist moved into Dropped Queue' },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: '100%', maxWidth: 480, background: '#0E0F13', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(239,68,68,0.06)' }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.7),rgba(239,68,68,0.3),transparent)' }} />

        <div style={{ padding: '20px 22px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={18} color="#EF4444" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB', letterSpacing: '-0.01em' }}>Drop Artist?</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(239,68,68,0.6)', marginTop: 2 }}>Destructive admin action · {artistId}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(255,255,255,0.3)' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ margin: '0 22px 16px', padding: '12px 16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserMinus size={13} color="#EF4444" />
            <span style={{ fontSize: 13, fontWeight: 800, color: '#F9FAFB' }}>{artistName}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(239,68,68,0.5)', marginLeft: 'auto' }}>STATUS → DROPPED (PENDING)</span>
          </div>
        </div>

        <div style={{ padding: '0 22px 16px' }}>
          <p style={{ margin: '0 0 14px', fontSize: 12.5, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)' }}>
            This will lock campaign and release functionality, begin payout + metadata transfer processing, and move the artist into the Dropped Queue.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {consequences.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: `${c.color}12`, border: `1px solid ${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={11} color={c.color} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>{c.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
              This is not deletion. This is an exit workflow state. The artist record is preserved in full.
            </span>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
              Exit Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Reason for drop, context for team..."
              style={{ width: '100%', padding: '8px 10px', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 8, color: '#F9FAFB', fontSize: 11.5, outline: 'none', resize: 'none', fontFamily: 'system-ui' }}
            />
          </div>

          {error && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444' }}>Note: {error} — status updated locally.</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
          <button
            onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 22px', borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', fontSize: 12, fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><UserMinus size={13} /> Confirm Drop</>}
          </button>
        </div>
      </div>
    </div>
  );
}
