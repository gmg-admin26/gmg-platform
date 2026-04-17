import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserMinus, Clock, CheckCircle, AlertTriangle, DollarSign,
  FileText, ArrowUpRight, RefreshCw, ShieldOff, Activity,
  Users, Building2, TrendingDown, MoreHorizontal, Check,
  Loader, ExternalLink,
} from 'lucide-react';
import {
  fetchDroppedQueue,
  completeDropArtist,
  setLocalLifecycleState,
  getLocalLifecycleState,
  type ArtistLifecycleEvent,
} from '../data/dropArtistService';
import { SIGNED_ARTISTS } from '../data/artistRosterData';
import { useRole } from '../../auth/RoleContext';
import { getLabelById } from '../data/labelsData';

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
function fmtListeners(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}
function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function ExitProgressBar({ state }: { state: string }) {
  const steps = [
    { label: 'Initiated',   done: true },
    { label: 'Payout',      done: state === 'dropped_complete' },
    { label: 'Metadata',    done: state === 'dropped_complete' },
    { label: 'Complete',    done: state === 'dropped_complete' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{
            width: 16, height: 16, borderRadius: 5, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: s.done ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${s.done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
            {s.done
              ? <Check size={8} color="#10B981" />
              : <Clock size={8} color="rgba(255,255,255,0.2)" />
            }
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 10, height: 1, background: s.done ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

interface RowActionMenuProps {
  artistId: string;
  artistName: string;
  state: string;
  initiatedBy: string;
  onViewArtist: () => void;
  onCompleteDrop: () => void;
  completing: boolean;
}

function RowActionMenu({ artistId, state, onViewArtist, onCompleteDrop, completing }: RowActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 7, cursor: 'pointer',
          background: open ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.4)', transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
        onMouseLeave={e => { if (!open) (e.currentTarget.style.background = 'rgba(255,255,255,0.04)'); }}
      >
        <MoreHorizontal size={13} />
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 100 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', right: 0, top: 34, zIndex: 200,
            background: '#141519', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, overflow: 'hidden', minWidth: 160,
            boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
          }}>
            <button
              onClick={() => { setOpen(false); onViewArtist(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', fontSize: 11, fontWeight: 600, transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <ExternalLink size={11} color="#06B6D4" />
              View Artist
            </button>

            {state === 'dropped_pending' && (
              <>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                <button
                  onClick={() => { setOpen(false); onCompleteDrop(); }}
                  disabled={completing}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 14px', background: 'none', border: 'none', cursor: completing ? 'wait' : 'pointer', color: completing ? 'rgba(255,255,255,0.25)' : '#10B981', fontSize: 11, fontWeight: 600, transition: 'background 0.1s' }}
                  onMouseEnter={e => { if (!completing) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.06)'; } }}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  {completing ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={11} color="#10B981" />}
                  Complete Drop
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface QueueRowData extends ArtistLifecycleEvent {
  _completing?: boolean;
}

export default function DroppedQueue() {
  const navigate = useNavigate();
  const { roleState } = useRole();
  const [rows, setRows] = useState<QueueRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    const remote = await fetchDroppedQueue();

    const localIds = SIGNED_ARTISTS
      .filter(a => {
        const ls = getLocalLifecycleState(a.id);
        return ls === 'dropped_pending' || ls === 'dropped_complete';
      })
      .map(a => a.id);

    const remoteIds = new Set(remote.map(r => r.artist_id));
    const localOnly = localIds
      .filter(id => !remoteIds.has(id))
      .map(id => {
        const a = SIGNED_ARTISTS.find(x => x.id === id);
        return {
          artist_id: id,
          artist_name: a?.name ?? id,
          state: getLocalLifecycleState(id),
          initiated_by: 'admin',
          initiated_at: new Date().toISOString(),
          notes: null,
        } as ArtistLifecycleEvent;
      });

    setRows([...remote, ...localOnly]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCompleteDrop = useCallback(async (artistId: string) => {
    setCompletingIds(prev => new Set([...prev, artistId]));
    const initiatedBy = roleState.user?.email ?? 'admin@gmg.ai';
    await completeDropArtist(artistId, initiatedBy);
    setLocalLifecycleState(artistId, 'dropped_complete');
    setRows(prev => prev.map(r => r.artist_id === artistId ? { ...r, state: 'dropped_complete' } : r));
    setCompletingIds(prev => { const s = new Set(prev); s.delete(artistId); return s; });
  }, [roleState.user?.email]);

  const pendingRows   = rows.filter(r => r.state === 'dropped_pending');
  const completeRows  = rows.filter(r => r.state === 'dropped_complete');

  const totalRecoupBalance = rows.reduce((sum, row) => {
    const a = SIGNED_ARTISTS.find(x => x.id === row.artist_id);
    return sum + (a?.financials.recoupableBalance ?? 0);
  }, 0);

  const totalOutstandingRevenue = rows.reduce((sum, row) => {
    const a = SIGNED_ARTISTS.find(x => x.id === row.artist_id);
    return sum + (a?.financials.ytdRevenue ?? 0);
  }, 0);

  const statsBar = [
    { label: 'Pending Exit',     value: pendingRows.length.toString(),         color: '#F59E0B', icon: Clock,       sub: 'Awaiting final processing' },
    { label: 'Exit Complete',    value: completeRows.length.toString(),         color: '#6B7280', icon: CheckCircle, sub: 'Fully processed' },
    { label: 'Revenue Balance',  value: fmtMoney(totalOutstandingRevenue),      color: '#10B981', icon: DollarSign,  sub: 'Outstanding payout owed' },
    { label: 'Recoup Balance',   value: fmtMoney(Math.abs(totalRecoupBalance)), color: '#06B6D4', icon: TrendingDown, sub: 'Unrecouped investment' },
  ];

  function renderTable(queueRows: QueueRowData[], title: string, emptyMsg: string, accentColor: string) {
    return (
      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</span>
          <span style={{ marginLeft: 6, fontFamily: 'monospace', fontSize: 8, color: `${accentColor}70`, background: `${accentColor}12`, border: `1px solid ${accentColor}22`, borderRadius: 5, padding: '1px 7px' }}>
            {queueRows.length}
          </span>
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '6px 20px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {[
            { label: 'Artist',          w: 210 },
            { label: 'Artist ID',       w: 90  },
            { label: 'Label',           w: 140 },
            { label: 'GMG Rep',         w: 100 },
            { label: 'Manager',         w: 120 },
            { label: 'Rev Balance',     w: 90  },
            { label: 'Recoup',          w: 90  },
            { label: 'Exit Progress',   w: 100 },
            { label: 'Date Dropped',    w: 100 },
            { label: '',                flex: 1 },
            { label: '',                w: 36  },
          ].map((col, i) => (
            <div key={i} style={{ width: col.w, flexShrink: col.flex ? undefined : 0, flex: col.flex, fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {col.label}
            </div>
          ))}
        </div>

        {queueRows.length === 0 ? (
          <div style={{ padding: '36px', textAlign: 'center' }}>
            <CheckCircle size={22} color="rgba(255,255,255,0.08)" style={{ margin: '0 auto 10px' }} />
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{emptyMsg}</div>
          </div>
        ) : (
          queueRows.map(row => {
            const artist = SIGNED_ARTISTS.find(a => a.id === row.artist_id);
            const completing = completingIds.has(row.artist_id);
            const label = artist?.label_id ? getLabelById(artist.label_id) : null;
            const labelName = label?.name ?? artist?.labelImprint ?? '—';
            const rep = artist?.pointPerson || artist?.arRep || '—';
            const manager = artist?.manager || '—';
            const recoupBalance = artist?.financials.recoupableBalance ?? 0;
            const recoupColor = recoupBalance > 0 ? '#EF4444' : '#10B981';
            const recoupLabel = recoupBalance > 0 ? `${fmtMoney(recoupBalance)} unrecouped` : 'Recouped';

            return (
              <div
                key={row.artist_id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 0,
                  padding: '13px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  background: row.state === 'dropped_pending' ? 'rgba(239,68,68,0.015)' : 'transparent',
                  opacity: row.state === 'dropped_complete' ? 0.6 : 1,
                }}
              >
                {/* Artist avatar + name */}
                <div style={{ width: 210, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 9 }}>
                  {artist ? (
                    <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: `${artist.avatarColor}14`, border: `1px solid ${artist.avatarColor}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 8, fontWeight: 800, fontFamily: 'monospace', color: artist.avatarColor }}>{artist.avatarInitials}</span>
                    </div>
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserMinus size={11} color="rgba(255,255,255,0.2)" />
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: row.state === 'dropped_complete' ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {row.artist_name}
                    </div>
                    {artist && (
                      <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>
                        {fmtListeners(artist.monthlyListeners)} listeners · {artist.genre.split('/')[0].trim()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Artist ID */}
                <div style={{ width: 90, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 5, padding: '2px 6px' }}>
                    {row.artist_id}
                  </span>
                </div>

                {/* Label */}
                <div style={{ width: 140, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Building2 size={9} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {labelName}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>Former Label</div>
                </div>

                {/* GMG Rep */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {rep !== 'Needs Info' ? rep : '—'}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>GMG Rep</div>
                </div>

                {/* Manager */}
                <div style={{ width: 120, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Users size={9} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {manager !== 'Needs Info' ? manager : '—'}
                    </span>
                  </div>
                </div>

                {/* Revenue balance */}
                <div style={{ width: 90, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 800, color: '#10B981' }}>
                    {fmtMoney(artist?.financials.ytdRevenue ?? 0)}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>YTD Revenue</div>
                </div>

                {/* Recoup status */}
                <div style={{ width: 90, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: 'monospace', fontSize: 7.5, fontWeight: 700,
                    color: recoupColor, background: `${recoupColor}10`, border: `1px solid ${recoupColor}22`,
                    borderRadius: 5, padding: '2px 6px', whiteSpace: 'nowrap',
                  }}>
                    {recoupLabel}
                  </span>
                </div>

                {/* Exit Progress */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <ExitProgressBar state={row.state} />
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: row.state === 'dropped_complete' ? '#6B7280' : '#F59E0B', marginTop: 4 }}>
                    {row.state === 'dropped_complete' ? 'Complete' : 'Processing'}
                  </div>
                </div>

                {/* Date dropped */}
                <div style={{ width: 100, flexShrink: 0 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.35)' }}>
                    {fmtDate(row.initiated_at)}
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)', marginTop: 2 }}>
                    by {row.initiated_by.split('@')[0]}
                  </div>
                </div>

                {/* Notes */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {row.notes ? (
                    <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {row.notes}
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.1)' }}>—</span>
                  )}
                </div>

                {/* Row actions */}
                <div style={{ width: 36, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <RowActionMenu
                    artistId={row.artist_id}
                    artistName={row.artist_name}
                    state={row.state}
                    initiatedBy={row.initiated_by}
                    onViewArtist={() => navigate(`/dashboard/artist-os/roster/${row.artist_id}`)}
                    onCompleteDrop={() => handleCompleteDrop(row.artist_id)}
                    completing={completing}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: '#08090B', minHeight: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserMinus size={15} color="#EF4444" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Dropped Queue</h1>
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 5, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Admin Only
                </span>
              </div>
              <p style={{ fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.25)', margin: '3px 0 0' }}>
                Artists in exit workflow. Payout and Safe access preserved. Campaign + release locked.
              </p>
            </div>
          </div>

          <button
            onClick={load}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 15px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer', fontFamily: 'monospace' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
          >
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
        {statsBar.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${s.color}40,transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `${s.color}12`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={10} color={s.color} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: `${s.color}70`, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Process context banner */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 11, marginBottom: 18 }}>
        {[
          { icon: ShieldOff,  color: '#EF4444', text: 'Campaign & release locked for all artists in this queue' },
          { icon: DollarSign, color: '#10B981', text: 'Payout and Safe access preserved throughout exit process' },
          { icon: FileText,   color: '#06B6D4', text: 'Metadata transfer initiated on drop — monitored internally' },
          { icon: Activity,   color: '#F59E0B', text: 'Complete Drop removes from active operating views' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ width: 20, height: 20, borderRadius: 5, background: `${item.color}10`, border: `1px solid ${item.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={9} color={item.color} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{item.text}</span>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div style={{ padding: 64, textAlign: 'center', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
          <Loader size={20} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 10px', animation: 'spin 1s linear infinite' }} />
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>Loading exit queue...</div>
        </div>
      ) : (
        <>
          {pendingRows.length > 0 && renderTable(pendingRows, 'Pending Exit Processing', 'No artists pending exit.', '#F59E0B')}
          {renderTable(completeRows, 'Exit Complete — Internal Record', 'No completed exits on record.', '#6B7280')}
          {pendingRows.length === 0 && completeRows.length === 0 && (
            <div style={{ padding: 64, textAlign: 'center', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <CheckCircle size={28} color="rgba(16,185,129,0.25)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Exit queue is clear.</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>All roster artists are active. Use Drop Artist from an artist profile or the Artists table to initiate an exit.</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
