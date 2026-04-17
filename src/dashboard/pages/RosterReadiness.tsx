import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, CreditCard as Edit3, Flag, CheckCircle, AlertTriangle, XCircle, Users, ShieldCheck, Mail, Link2, Music, DollarSign, Star, RefreshCw, ChevronDown, Clock, UserCheck } from 'lucide-react';
import { SIGNED_ARTISTS, type SignedArtist } from '../data/artistRosterData';
import {
  computeReadiness, fetchAllFlags, upsertFlag, upsertArtistRecord,
  type RosterFlag, type ReadinessAudit,
} from '../data/rosterReadiness';
import { getActiveArtists } from '../data/dropArtistService';
import EditArtistModal from '../components/roster/EditArtistModal';
import FlagAssignModal from '../components/roster/FlagAssignModal';

// ─── Helpers ─────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

type ActiveFilter =
  | 'all'
  | 'missing_contact'
  | 'missing_social'
  | 'no_release'
  | 'no_financial'
  | 'new_signing'
  | 'flagged';

const FILTER_OPTIONS: { key: ActiveFilter; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'all',             label: 'All Artists',           icon: Users,         color: '#9CA3AF' },
  { key: 'missing_contact', label: 'Missing Contact Info',  icon: Mail,          color: '#EF4444' },
  { key: 'missing_social',  label: 'Missing Social Links',  icon: Link2,         color: '#F59E0B' },
  { key: 'no_release',      label: 'No Active Release',     icon: Music,         color: '#06B6D4' },
  { key: 'no_financial',    label: 'No Financial Data',     icon: DollarSign,    color: '#10B981' },
  { key: 'new_signing',     label: 'New Signings',          icon: Star,          color: '#F59E0B' },
  { key: 'flagged',         label: 'Flagged for Update',    icon: Flag,          color: '#EF4444' },
];

const READINESS_STYLE = {
  ready:        { label: 'Ready',        color: '#10B981', icon: CheckCircle,    bg: 'rgba(16,185,129,0.1)'  },
  needs_review: { label: 'Needs Review', color: '#F59E0B', icon: AlertTriangle,  bg: 'rgba(245,158,11,0.1)'  },
  incomplete:   { label: 'Incomplete',   color: '#EF4444', icon: XCircle,        bg: 'rgba(239,68,68,0.1)'   },
};

const GROUP_COLORS = {
  contact:   '#EF4444',
  social:    '#F59E0B',
  release:   '#06B6D4',
  financial: '#10B981',
  identity:  '#9CA3AF',
};

// ─── Stat card ───────────────────────────────────────────────

function StatCard({ label, value, sub, color, icon: Icon }: {
  label: string; value: string | number; sub?: string;
  color: string; icon: React.ElementType;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}15`, border: `1px solid ${color}30`, flexShrink: 0 }}>
        <Icon size={15} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Score bar ───────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const c = score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
        <div style={{ width: `${score}%`, height: '100%', background: c, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color: c, width: 22, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

// ─── Missing field chips ─────────────────────────────────────

function MissingChips({ fields }: { fields: ReadinessAudit['missingFields'] }) {
  const [expanded, setExpanded] = useState(false);
  const show = expanded ? fields : fields.slice(0, 3);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
      {show.map(f => (
        <span key={f.label} style={{
          fontSize: 9, padding: '2px 6px', borderRadius: 10, fontWeight: 600,
          background: `${GROUP_COLORS[f.group]}12`,
          color: GROUP_COLORS[f.group],
          border: `1px solid ${GROUP_COLORS[f.group]}25`,
        }}>
          {f.label}
        </span>
      ))}
      {fields.length > 3 && !expanded && (
        <button onClick={e => { e.stopPropagation(); setExpanded(true); }} style={{
          fontSize: 9, padding: '2px 6px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: '#6B7280', cursor: 'pointer', fontWeight: 600,
        }}>+{fields.length - 3} more</button>
      )}
    </div>
  );
}

// ─── Main row ────────────────────────────────────────────────

function ArtistReadinessRow({
  artist, audit, flag,
  onEdit, onFlag,
}: {
  artist: SignedArtist;
  audit: ReadinessAudit;
  flag: RosterFlag | undefined;
  onEdit: () => void;
  onFlag: () => void;
}) {
  const rs = READINESS_STYLE[audit.status];
  const StatusIcon = rs.icon;
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 180px 90px 80px 140px 1fr 150px 110px',
      gap: 0,
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '0 16px',
      minHeight: 60,
      transition: 'background 0.12s ease',
      cursor: 'pointer',
    }}
      onClick={() => navigate(`/dashboard/artist-os/roster/${artist.id}`)}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.018)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Avatar */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}30`, flexShrink: 0,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: artist.avatarColor }}>{artist.avatarInitials}</span>
      </div>

      {/* Name */}
      <div style={{ padding: '0 8px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB', lineHeight: 1.2 }}>{artist.name}</div>
        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{artist.id} · {artist.tier}</div>
      </div>

      {/* Score */}
      <div style={{ padding: '0 8px' }}>
        <ScoreBar score={audit.score} />
      </div>

      {/* Status */}
      <div style={{ padding: '0 8px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px', borderRadius: 20,
          background: rs.bg, border: `1px solid ${rs.color}30`,
        }}>
          <StatusIcon size={9} color={rs.color} />
          <span style={{ fontSize: 10, fontWeight: 700, color: rs.color }}>{rs.label}</span>
        </div>
      </div>

      {/* Missing fields */}
      <div style={{ padding: '0 8px' }}>
        {audit.missingFields.length > 0
          ? <MissingChips fields={audit.missingFields} />
          : <span style={{ fontSize: 10, color: '#10B981' }}>All fields complete</span>
        }
      </div>

      {/* Assigned / last reviewed */}
      <div style={{ padding: '0 8px' }}>
        {flag?.assignedTo ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <UserCheck size={10} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#D1D5DB', fontWeight: 600 }}>{flag.assignedTo}</div>
              {flag.lastReviewedAt && <div style={{ fontSize: 9, color: '#6B7280' }}>{fmtDate(flag.lastReviewedAt)}</div>}
            </div>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: '#4B5563' }}>Unassigned</span>
        )}
      </div>

      {/* Flag indicator */}
      <div style={{ padding: '0 8px' }}>
        {flag?.flaggedForUpdate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Flag size={11} color="#F59E0B" />
            <span style={{ fontSize: 10, color: '#F59E0B', fontWeight: 600 }}>Flagged</span>
          </div>
        ) : (
          <span style={{ fontSize: 10, color: '#4B5563' }}>—</span>
        )}
        {flag?.flagReason && (
          <div style={{ fontSize: 9, color: '#6B7280', marginTop: 1, maxWidth: 100, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {flag.flagReason}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, padding: '0 4px', justifyContent: 'flex-end' }}>
        <button
          onClick={e => { e.stopPropagation(); onEdit(); }}
          title="Edit artist data"
          style={{
            width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.08)'; }}
        >
          <Edit3 size={11} color="#10B981" />
        </button>
        <button
          onClick={e => { e.stopPropagation(); onFlag(); }}
          title="Flag & assign"
          style={{
            width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: flag?.flaggedForUpdate ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.05)',
            border: `1px solid ${flag?.flaggedForUpdate ? 'rgba(245,158,11,0.35)' : 'rgba(245,158,11,0.12)'}`,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = flag?.flaggedForUpdate ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.05)'; }}
        >
          <Flag size={11} color="#F59E0B" />
        </button>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────

export default function RosterReadiness() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<ActiveFilter>('all');
  const [sortBy, setSortBy]   = useState<'score' | 'name' | 'status'>('score');
  const [flags, setFlags]     = useState<RosterFlag[]>([]);
  const [loadingFlags, setLoadingFlags] = useState(true);

  const [editArtist, setEditArtist]     = useState<SignedArtist | null>(null);
  const [flagArtist, setFlagArtist]     = useState<SignedArtist | null>(null);

  // Mutable local copy of artists (for in-memory edits before Supabase sync) — excludes dropped
  const [localArtists, setLocalArtists] = useState(() => getActiveArtists([...SIGNED_ARTISTS]));

  const loadFlags = useCallback(async () => {
    setLoadingFlags(true);
    const data = await fetchAllFlags();
    setFlags(data);
    setLoadingFlags(false);
  }, []);

  useEffect(() => { loadFlags(); }, [loadFlags]);

  const audits = useMemo(
    () => localArtists.reduce<Record<string, ReadinessAudit>>((acc, a) => {
      acc[a.id] = computeReadiness(a);
      return acc;
    }, {}),
    [localArtists]
  );

  const flagMap = useMemo(
    () => flags.reduce<Record<string, RosterFlag>>((acc, f) => { acc[f.artistId] = f; return acc; }, {}),
    [flags]
  );

  const filtered = useMemo(() => {
    let list = localArtists.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
      const audit = audits[a.id];
      switch (filter) {
        case 'missing_contact': return audit.missingContact;
        case 'missing_social':  return audit.missingSocial;
        case 'no_release':      return audit.noActiveRelease;
        case 'no_financial':    return audit.noFinancialData;
        case 'new_signing':     return audit.isNewSigning;
        case 'flagged':         return flagMap[a.id]?.flaggedForUpdate === true;
        default:                return true;
      }
    });

    list = list.slice().sort((a, b) => {
      if (sortBy === 'score') return audits[a.id].score - audits[b.id].score;
      if (sortBy === 'name')  return a.name.localeCompare(b.name);
      const order = { incomplete: 0, needs_review: 1, ready: 2 };
      return order[audits[a.id].status] - order[audits[b.id].status];
    });

    return list;
  }, [localArtists, search, filter, sortBy, audits, flagMap]);

  // Summary stats
  const stats = useMemo(() => {
    const all = Object.values(audits);
    return {
      total:         localArtists.length,
      ready:         all.filter(a => a.status === 'ready').length,
      needsReview:   all.filter(a => a.status === 'needs_review').length,
      incomplete:    all.filter(a => a.status === 'incomplete').length,
      flagged:       flags.filter(f => f.flaggedForUpdate).length,
      missingEmail:  localArtists.filter(a => audits[a.id].missingContact).length,
      noRelease:     all.filter(a => a.noActiveRelease).length,
      avgScore:      Math.round(all.reduce((s, a) => s + a.score, 0) / Math.max(all.length, 1)),
    };
  }, [audits, flags, localArtists]);

  async function handleSaveEdit(updates: Partial<SignedArtist>) {
    if (!editArtist) return;
    // Update local state immediately
    setLocalArtists(prev => prev.map(a => a.id === editArtist.id ? { ...a, ...updates } : a));
    // Persist to Supabase (best-effort — falls back gracefully)
    await upsertArtistRecord(editArtist.id, updates as Record<string, unknown>);
  }

  async function handleSaveFlag(flag: Omit<RosterFlag, 'id' | 'updatedAt'>) {
    await upsertFlag(flag);
    await loadFlags();
  }

  return (
    <div style={{ padding: '28px 28px', minHeight: '100vh', background: '#08090B', color: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <span style={{ fontSize: 10, letterSpacing: 3, color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>
              Admin Panel
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: '#F9FAFB' }}>Roster Readiness</h1>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            Data completeness · Missing fields · Status · Team assignment
          </p>
        </div>
        <button
          onClick={loadFlags}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          <RefreshCw size={11} style={{ animation: loadingFlags ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 10, marginBottom: 24 }}>
        <StatCard label="Total Artists"    value={stats.total}       color="#9CA3AF" icon={Users}        />
        <StatCard label="Ready"            value={stats.ready}       color="#10B981" icon={CheckCircle}  />
        <StatCard label="Needs Review"     value={stats.needsReview} color="#F59E0B" icon={AlertTriangle}/>
        <StatCard label="Incomplete"       value={stats.incomplete}  color="#EF4444" icon={XCircle}      />
        <StatCard label="Flagged"          value={stats.flagged}     color="#F59E0B" icon={Flag}         />
        <StatCard label="Missing Email"    value={stats.missingEmail}color="#EF4444" icon={Mail}         />
        <StatCard label="No Release"       value={stats.noRelease}   color="#06B6D4" icon={Music}        />
        <StatCard label="Avg Score"        value={`${stats.avgScore}%`} color="#9CA3AF" icon={ShieldCheck}/>
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8, padding: '6px 12px', flex: '0 0 220px',
        }}>
          <Search size={12} color="#6B7280" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search artists..."
            style={{ background: 'none', border: 'none', outline: 'none', color: '#F9FAFB', fontSize: 12, width: '100%' }}
          />
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FILTER_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const active = filter === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setFilter(opt.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', borderRadius: 20,
                  background: active ? `${opt.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? `${opt.color}40` : 'rgba(255,255,255,0.07)'}`,
                  color: active ? opt.color : '#6B7280',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={10} />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={11} color="#6B7280" />
          <span style={{ fontSize: 11, color: '#6B7280' }}>Sort:</span>
          {([['score', 'Score'], ['name', 'Name'], ['status', 'Status']] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setSortBy(k)}
              style={{
                padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: sortBy === k ? 'rgba(16,185,129,0.1)' : 'transparent',
                border: `1px solid ${sortBy === k ? 'rgba(16,185,129,0.25)' : 'transparent'}`,
                color: sortBy === k ? '#10B981' : '#6B7280',
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '36px 180px 90px 80px 140px 1fr 150px 110px',
          gap: 0, padding: '10px 16px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {['', 'Artist', 'Score', 'Status', 'Missing Fields', 'Assigned To', 'Flag', 'Actions'].map((h, i) => (
            <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: i > 0 ? 8 : 0 }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map(a => (
          <ArtistReadinessRow
            key={a.id}
            artist={a}
            audit={audits[a.id]}
            flag={flagMap[a.id]}
            onEdit={() => setEditArtist(a)}
            onFlag={() => setFlagArtist(a)}
          />
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#4B5563', fontSize: 13 }}>
            No artists match the current filter
          </div>
        )}

        {/* Footer */}
        <div style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Clock size={11} color="#4B5563" />
          <span style={{ fontSize: 10, color: '#4B5563' }}>
            Showing {filtered.length} of {localArtists.length} artists
            {loadingFlags && ' · Loading flags...'}
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#4B5563' }}>
            Scores computed from roster data · Flags persisted to Supabase
          </span>
        </div>
      </div>

      {/* Modals */}
      {editArtist && (
        <EditArtistModal
          artist={editArtist}
          onClose={() => setEditArtist(null)}
          onSave={async updates => {
            await handleSaveEdit(updates);
          }}
        />
      )}

      {flagArtist && (
        <FlagAssignModal
          artist={flagArtist}
          existingFlag={flagMap[flagArtist.id] ?? null}
          onClose={() => setFlagArtist(null)}
          onSave={handleSaveFlag}
        />
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
