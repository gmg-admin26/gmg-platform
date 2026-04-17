import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, TrendingUp, Activity,
  ArrowUpRight, DollarSign, BarChart2, Zap, UserPlus, UserMinus, ArrowRightLeft,
  ChevronDown, Check, Loader, X,
} from 'lucide-react';
import { getLabelById, labelsData, syncLabelFromSupabase, LABEL_TYPE_COLORS, LABEL_CATEGORY_META, type LabelRecord } from '../data/labelsData';
import { getArtistsByLabel, cleanGenre, getCanonicalLocation } from '../utils/labelUtils';
import { SIGNED_ARTISTS, type SignedArtist } from '../data/artistRosterData';
import LabelPortfolioCapital from '../components/labels/LabelPortfolioCapital';
import LabelAssignModal from '../components/labels/LabelAssignModal';
import { useRole } from '../../auth/RoleContext';
import { ROLE_PERMISSIONS } from '../../auth/roles';
import {
  assignArtistToLabel, removeArtistFromLabel,
  fetchAssignmentsByLabel, fetchLabelBySlug, type ArtistLabelAssignment,
} from '../data/labelService';
import { getActiveArtists } from '../data/dropArtistService';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

const RELEASE_STATUS_COLOR: Record<string, string> = {
  'Released':          '#10B981',
  'In Production':     '#F59E0B',
  'Scheduled':         '#06B6D4',
  'Blocked':           '#EF4444',
  'Pre-Save Live':     '#EC4899',
  'No Active Release': '#6B7280',
};

function MoveArtistMenu({
  artistId,
  currentLabelId,
  onMoved,
}: {
  artistId: string;
  currentLabelId: string;
  onMoved: (newLabelId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [moving, setMoving] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const targets = labelsData.filter(l => l.status === 'Active' && l.id !== currentLabelId);

  async function handleMove(targetLabelId: string) {
    setMoving(targetLabelId);
    await removeArtistFromLabel(artistId, currentLabelId);
    await assignArtistToLabel(artistId, targetLabelId, 'primary', 'admin');
    setMoving(null);
    setOpen(false);
    onMoved(targetLabelId);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '5px 9px', borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: 'pointer',
          background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)', color: '#06B6D4',
          transition: 'all 0.12s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.13)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.07)'; }}
      >
        <ArrowRightLeft size={9} />
        Move
        <ChevronDown size={9} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 100,
          background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, overflow: 'hidden', minWidth: 180,
          boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
        }}>
          <div style={{ padding: '6px 10px 4px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Move to Label
          </div>
          {targets.map(lbl => {
            const isMoving = moving === lbl.id;
            const typeMeta = LABEL_TYPE_COLORS[lbl.type];
            return (
              <div
                key={lbl.id}
                onClick={e => { e.stopPropagation(); !moving && handleMove(lbl.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                  cursor: moving ? 'wait' : 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ width: 16, height: 16, borderRadius: 5, background: `${lbl.color}18`, border: `1px solid ${lbl.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isMoving
                    ? <Loader size={9} color={lbl.color} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Building2 size={8} color={lbl.color} />
                  }
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', flex: 1 }}>{lbl.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: typeMeta.bg, color: typeMeta.color }}>{lbl.type}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LabelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { roleState } = useRole();
  const [sortBy, setSortBy] = useState<'listeners' | 'revenue' | 'health'>('listeners');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [localAssignments, setLocalAssignments] = useState<ArtistLabelAssignment[]>([]);
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [dynamicLabel, setDynamicLabel] = useState<LabelRecord | undefined>(undefined);
  const [labelLoading, setLabelLoading] = useState(true);

  const currentRole = roleState.role ?? 'artist_manager';
  const perms = ROLE_PERMISSIONS[currentRole as keyof typeof ROLE_PERMISSIONS];

  useEffect(() => {
    if (!id) { setLabelLoading(false); return; }
    const staticLabel = getLabelById(id);
    if (staticLabel) {
      setDynamicLabel(staticLabel);
      setLabelLoading(false);
      return;
    }
    fetchLabelBySlug(id).then(remote => {
      if (remote) {
        const synced = syncLabelFromSupabase({
          id: remote.id,
          slug: remote.slug,
          name: remote.name,
          type: remote.type,
          status: remote.status,
          color: remote.color,
          notes: remote.notes,
          ar_rep: remote.ar_rep,
          point_person: remote.point_person,
          label_category: remote.label_category,
        });
        setDynamicLabel(synced);
      }
      setLabelLoading(false);
    });
  }, [id]);

  const label = dynamicLabel ?? (id ? getLabelById(id) : undefined);

  const loadAssignments = useCallback(async () => {
    if (!id) return;
    const supabaseLabel = await fetchLabelBySlug(id);
    const labelUUID = supabaseLabel?.id ?? null;
    if (!labelUUID) {
      setAssignmentsLoaded(true);
      return;
    }
    const rows = await fetchAssignmentsByLabel(labelUUID);
    setLocalAssignments(rows);
    setAssignmentsLoaded(true);
  }, [id]);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  const dynamicArtists: SignedArtist[] = useMemo(() => {
    if (!id) return [];
    if (!assignmentsLoaded) {
      return getArtistsByLabel(id);
    }
    const assignedIds = new Set(localAssignments.filter(a => a.active).map(a => a.artist_id));
    const staticArtists = getActiveArtists(SIGNED_ARTISTS).filter(
      a => (a as SignedArtist & { label_id?: string | null }).label_id === id
    );
    const staticIds = new Set(staticArtists.map(a => a.id));

    const dynamicOnly = getActiveArtists(SIGNED_ARTISTS).filter(
      a => assignedIds.has(a.id) && !staticIds.has(a.id)
    );

    const removed = new Set(
      staticArtists
        .filter(a => !assignedIds.has(a.id) && localAssignments.some(la => la.artist_id === a.id && !la.active))
        .map(a => a.id)
    );

    return [...staticArtists.filter(a => !removed.has(a.id)), ...dynamicOnly];
  }, [id, localAssignments, assignmentsLoaded]);

  if (labelLoading) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <Loader size={18} style={{ color: 'rgba(255,255,255,0.25)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!label) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: 24, fontFamily: 'monospace', fontSize: 12, color: '#EF4444', textAlign: 'center', paddingTop: 80 }}>
        Label not found.
      </div>
    );
  }

  const typeMeta = LABEL_TYPE_COLORS[label.type];

  const sortedArtists = [...dynamicArtists].sort((a, b) => {
    if (sortBy === 'listeners') return b.monthlyListeners - a.monthlyListeners;
    if (sortBy === 'revenue')   return b.financials.ytdRevenue - a.financials.ytdRevenue;
    return b.healthScore - a.healthScore;
  });

  const totalListeners  = dynamicArtists.reduce((s, a) => s + (a.monthlyListeners ?? 0), 0);
  const totalRevenue    = dynamicArtists.reduce((s, a) => s + (a.financials?.ytdRevenue ?? 0), 0);
  const totalInvestment = dynamicArtists.reduce((s, a) => s + (a.financials?.totalInvestment?.ytd ?? 0), 0);

  const allReleases = dynamicArtists.flatMap(a =>
    a.releases.map(r => ({ ...r, artistName: a.name, avatarColor: a.avatarColor, avatarInitials: a.avatarInitials }))
  );
  const activeReleases = allReleases.filter(r => r.status !== 'No Active Release').slice(0, 6);

  async function handleRemoveArtist(artist: SignedArtist) {
    if (!id) return;
    setRemovingId(artist.id);
    const supabaseLabel = await import('../data/labelService').then(m => m.fetchLabelBySlug(id));
    if (supabaseLabel?.id) {
      await removeArtistFromLabel(artist.id, supabaseLabel.id);
    }
    setLocalAssignments(prev => prev.map(a =>
      a.artist_id === artist.id ? { ...a, active: false } : a
    ));
    const removedFallback: ArtistLabelAssignment = {
      id: `removed-${artist.id}`,
      artist_id: artist.id,
      label_id: supabaseLabel?.id ?? id,
      role: 'primary',
      assigned_at: new Date().toISOString(),
      assigned_by: 'admin',
      notes: '',
      active: false,
    };
    setLocalAssignments(prev => {
      const exists = prev.find(a => a.artist_id === artist.id);
      if (exists) return prev.map(a => a.artist_id === artist.id ? { ...a, active: false } : a);
      return [...prev, removedFallback];
    });
    setRemovingId(null);
  }

  function handleMoved(artistId: string) {
    setLocalAssignments(prev => {
      const exists = prev.find(a => a.artist_id === artistId);
      if (exists) return prev.map(a => a.artist_id === artistId ? { ...a, active: false } : a);
      return [...prev, {
        id: `removed-${artistId}`,
        artist_id: artistId,
        label_id: id ?? '',
        role: 'primary',
        assigned_at: new Date().toISOString(),
        assigned_by: 'admin',
        notes: '',
        active: false,
      }];
    });
  }

  function handleAssignSaved() {
    loadAssignments();
  }

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '20px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button
          onClick={() => navigate('/dashboard/artist-os/labels')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', fontSize: 11, cursor: 'pointer' }}
        >
          <ArrowLeft size={12} />
          Labels
        </button>
        <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: 12 }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label.name}</span>
      </div>

      <div style={{ background: '#0D0E11', border: `1px solid ${label.color}22`, borderRadius: 16, padding: '20px 22px', marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${label.color}70,transparent)` }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: `${label.color}15`, border: `1px solid ${label.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building2 size={22} style={{ color: label.color }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5, flexWrap: 'wrap' }}>
                <h1 style={{ fontWeight: 800, fontSize: 22, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{label.name}</h1>
                {label.labelCategory && (() => {
                  const catMeta = LABEL_CATEGORY_META[label.labelCategory];
                  return (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontFamily: 'monospace', fontSize: 9, fontWeight: 800,
                      padding: '3px 10px', borderRadius: 20,
                      background: catMeta.bg, color: catMeta.color,
                      border: `1px solid ${catMeta.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                    }}>
                      {label.labelCategory}
                    </span>
                  );
                })()}
                <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 20, background: typeMeta.bg, color: typeMeta.color }}>{label.type}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 8px', borderRadius: 20, background: label.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: label.status === 'Active' ? '#10B981' : '#6B7280' }}>{label.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  {dynamicArtists.length} artist{dynamicArtists.length !== 1 ? 's' : ''} assigned
                </span>
                {label.ar_rep && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.18)' }}>A&R:</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label.ar_rep}</span>
                  </span>
                )}
                {label.point_person && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
                    <span style={{ color: 'rgba(255,255,255,0.18)' }}>Point:</span>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>{label.point_person}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {perms.canEditLabels && (
            <button
              onClick={() => setShowAssignModal(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                background: `${label.color}12`, border: `1px solid ${label.color}30`, color: label.color,
                transition: 'all 0.15s', flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${label.color}20`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = `${label.color}12`; }}
            >
              <UserPlus size={13} />
              Manage Roster
            </button>
          )}
        </div>
      </div>

      <LabelPortfolioCapital labelColor={label.color} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Artists',        value: dynamicArtists.length.toString(), icon: Users,      color: label.color },
          { label: 'Total Listeners',value: fmt(totalListeners),              icon: TrendingUp, color: '#06B6D4'   },
          { label: 'YTD Revenue',    value: fmtMoney(totalRevenue),           icon: DollarSign, color: '#10B981'   },
          { label: 'YTD Investment', value: fmtMoney(totalInvestment),        icon: BarChart2,  color: '#EF4444'   },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0D0E11', border: `1px solid ${stat.color}15`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: `${stat.color}12`, border: `1px solid ${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={11} color={stat.color} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 22, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Users size={13} color="rgba(255,255,255,0.4)" />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Label Roster &middot; {dynamicArtists.length} artists
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {perms.canEditLabels && (
              <button
                onClick={() => setShowAssignModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', borderRadius: 8, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', color: '#10B981',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.13)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(16,185,129,0.07)'; }}
              >
                <UserPlus size={10} />
                Add Artist
              </button>
            )}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 2 }}>
              {(['listeners', 'revenue', 'health'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 9, fontWeight: 700, cursor: 'pointer',
                    background: sortBy === s ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none', color: sortBy === s ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {sortedArtists.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <Users size={28} color="rgba(255,255,255,0.06)" style={{ marginBottom: 10 }} />
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)', marginBottom: 14 }}>No artists assigned to this label</div>
            {perms.canEditLabels && (
              <button
                onClick={() => setShowAssignModal(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                <UserPlus size={11} />
                Add Artist to Roster
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sortedArtists.map((artist, i) => {
              const f = artist.financials;
              const total = (f.advance ?? 0) + Math.abs(f.recoupableBalance ?? 0);
              const recoupPct = total > 0
                ? Math.min(Math.round(((f.allTimeRevenue ?? 0) / (total + (f.allTimeRevenue ?? 0))) * 100), 100)
                : 0;
              void recoupPct;
              const isRemoving = removingId === artist.id;
              return (
                <div
                  key={artist.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '13px 18px', transition: 'background 0.12s',
                    borderBottom: i < sortedArtists.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    opacity: isRemoving ? 0.5 : 1,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.18)', width: 18, flexShrink: 0 }}>{i + 1}</span>
                  <div
                    style={{ width: 34, height: 34, borderRadius: 9, background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700, color: artist.avatarColor }}>{artist.avatarInitials}</span>
                  </div>
                  <div
                    style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist.name}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{cleanGenre(artist.genre)}{getCanonicalLocation(artist) ? ` · ${getCanonicalLocation(artist)}` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Listeners</div>
                      <div style={{ fontSize: 13, fontFamily: 'monospace', color: '#06B6D4', fontWeight: 700 }}>{fmt(artist.monthlyListeners)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>Manager</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', maxWidth: 90, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist.manager || '—'}</div>
                    </div>
                    <div style={{ width: 70 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.18)' }}>Health</span>
                        <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>{artist.healthScore}</span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 99, width: `${artist.healthScore}%`,
                          background: artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444',
                        }} />
                      </div>
                    </div>

                    {perms.canEditLabels ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }} onClick={e => e.stopPropagation()}>
                        <MoveArtistMenu
                          artistId={artist.id}
                          currentLabelId={id!}
                          onMoved={() => handleMoved(artist.id)}
                        />
                        <button
                          onClick={e => { e.stopPropagation(); handleRemoveArtist(artist); }}
                          disabled={!!removingId}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '5px 9px', borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: removingId ? 'wait' : 'pointer',
                            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.16)', color: '#EF4444',
                            transition: 'all 0.12s',
                          }}
                          onMouseEnter={e => { if (!removingId) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'; }}
                        >
                          {isRemoving ? <Loader size={9} style={{ animation: 'spin 1s linear infinite' }} /> : <UserMinus size={9} />}
                          Remove
                        </button>
                      </div>
                    ) : (
                      <ArrowUpRight
                        size={13}
                        color="rgba(255,255,255,0.14)"
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <BarChart2 size={13} color="#10B981" />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Investment vs Revenue — YTD</span>
          </div>
          {sortedArtists.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '20px 0' }}>No artist data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sortedArtists.slice(0, 8).map(artist => {
                const rev = artist.financials?.ytdRevenue ?? 0;
                const inv = artist.financials?.totalInvestment?.ytd ?? 0;
                const maxVal = Math.max(rev, inv, 1);
                return (
                  <div key={artist.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 80, flexShrink: 0 }}>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist.name}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.6)', width: 22 }}>REV</span>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'rgba(16,185,129,0.6)', borderRadius: 99, width: `${(rev / maxVal) * 100}%` }} />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981', width: 52, textAlign: 'right' }}>{fmtMoney(rev)}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(239,68,68,0.6)', width: 22 }}>INV</span>
                        <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.04)', borderRadius: 99, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'rgba(239,68,68,0.4)', borderRadius: 99, width: `${(inv / maxVal) * 100}%` }} />
                        </div>
                        <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444', width: 52, textAlign: 'right' }}>{fmtMoney(inv)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
            <Zap size={13} color="#06B6D4" />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Release Pipeline</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>{activeReleases.length} active</span>
          </div>
          {activeReleases.length === 0 ? (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textAlign: 'center', padding: '20px 0' }}>No active releases</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeReleases.map((rel, i) => {
                const statusColor = RELEASE_STATUS_COLOR[rel.status] ?? '#6B7280';
                return (
                  <div key={`${rel.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: `${rel.avatarColor}20`, border: `1px solid ${rel.avatarColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, color: rel.avatarColor }}>{rel.avatarInitials}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rel.title}</div>
                      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{rel.artistName} · {rel.type}</div>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: `${statusColor}12`, border: `1px solid ${statusColor}25`, color: statusColor, flexShrink: 0 }}>{rel.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAssignModal && label && (
        <LabelAssignModal
          label={{ id: id!, slug: id!, name: label.name, type: label.type.toLowerCase() as 'internal' | 'partner' | 'distribution', status: label.status.toLowerCase() as 'active' | 'inactive', color: label.color, contact_name: '', contact_email: '', contact_phone: '', website: '', notes: '', logo_url: '', founded_year: null, ar_rep: label.ar_rep ?? '', point_person: label.point_person ?? '', created_at: '', updated_at: '', label_category: null }}
          onClose={() => setShowAssignModal(false)}
          onSaved={handleAssignSaved}
        />
      )}
    </div>
  );
}
