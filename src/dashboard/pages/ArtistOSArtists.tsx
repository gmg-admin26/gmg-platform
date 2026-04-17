import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Search, TrendingUp, TrendingDown, Activity,
  ArrowUpRight, DollarSign, Music, AlertTriangle, Globe,
  Tag as TagIcon, ChevronDown, UserMinus, MoreHorizontal,
  Star, Building2, ShieldOff, CheckCircle, Lock, Loader,
  Flag, CreditCard as FinanceIcon,
} from 'lucide-react';
import { SIGNED_ARTISTS, type SignedArtist } from '../data/artistRosterData';
import {
  getLocalLifecycleState, setLocalLifecycleState, isArtistDropped,
  completeDropArtist, getActiveArtists,
} from '../data/dropArtistService';
import { useRole } from '../../auth/RoleContext';
import { ROLE_PERMISSIONS, type ArtistOSRole } from '../../auth/roles';
import DropArtistModal from '../components/artistOS/DropArtistModal';
import { labelsData } from '../data/labelsData';
import { assignArtistToLabel } from '../data/labelService';

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

type FilterKey = 'All' | 'By Label' | 'At Risk' | 'Growth' | 'Dropped';

const FILTERS: { key: FilterKey; color: string; icon: React.ElementType }[] = [
  { key: 'All',      color: '#06B6D4', icon: Globe    },
  { key: 'By Label', color: '#A78BFA', icon: TagIcon  },
  { key: 'Growth',   color: '#10B981', icon: TrendingUp },
  { key: 'At Risk',  color: '#EF4444', icon: AlertTriangle },
  { key: 'Dropped',  color: '#6B7280', icon: UserMinus },
];

const FILTER_COLOR: Record<FilterKey, string> = {
  'All':      '#06B6D4',
  'By Label': '#A78BFA',
  'Growth':   '#10B981',
  'At Risk':  '#EF4444',
  'Dropped':  '#6B7280',
};

function HealthBar({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ width: 38, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

interface MenuAction {
  label: string;
  icon: React.ElementType;
  color?: string;
  onClick: () => void;
  danger?: boolean;
  dividerAbove?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

function ActionsMenu({
  artist,
  isDropped,
  canDrop,
  onNavigate,
  onDrop,
  onCompleteDrop,
  onMarkPriority,
}: {
  artist: typeof SIGNED_ARTISTS[number];
  isDropped: boolean;
  canDrop: boolean;
  onNavigate: (path: string) => void;
  onDrop: (id: string, name: string) => void;
  onCompleteDrop: (id: string, name: string) => void;
  onMarkPriority: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [labelSubOpen, setLabelSubOpen] = useState(false);
  const [assigningLabel, setAssigningLabel] = useState<string | null>(null);
  const [completingDrop, setCompletingDrop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setLabelSubOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  async function handleAssignLabel(labelId: string) {
    setAssigningLabel(labelId);
    await assignArtistToLabel(artist.id, labelId, 'primary');
    setAssigningLabel(null);
    setLabelSubOpen(false);
    setOpen(false);
  }

  async function handleCompleteDrop() {
    setCompletingDrop(true);
    await onCompleteDrop(artist.id, artist.name);
    setCompletingDrop(false);
    setOpen(false);
  }

  const droppedActions: MenuAction[] = [
    {
      label: 'Open Artist',
      icon: ArrowUpRight,
      color: '#06B6D4',
      onClick: () => { onNavigate(`/dashboard/artist-os/roster/${artist.id}`); setOpen(false); },
    },
    {
      label: 'View Safe',
      icon: ShieldOff,
      color: '#F59E0B',
      dividerAbove: true,
      onClick: () => { onNavigate(`/dashboard/artist-os/roster/${artist.id}`); setOpen(false); },
    },
    {
      label: completingDrop ? 'Completing...' : 'Complete Drop',
      icon: completingDrop ? Loader : CheckCircle,
      color: '#10B981',
      loading: completingDrop,
      disabled: completingDrop,
      onClick: handleCompleteDrop,
    },
  ];

  const normalActions: MenuAction[] = [
    {
      label: 'Open Artist',
      icon: ArrowUpRight,
      color: '#06B6D4',
      onClick: () => { onNavigate(`/dashboard/artist-os/roster/${artist.id}`); setOpen(false); },
    },
    {
      label: 'View Financial Status',
      icon: FinanceIcon,
      color: '#10B981',
      onClick: () => { onNavigate(`/dashboard/artist-os/roster/${artist.id}`); setOpen(false); },
    },
    {
      label: 'View Issues',
      icon: AlertTriangle,
      color: '#F59E0B',
      onClick: () => { onNavigate(`/dashboard/artist-os/roster/${artist.id}`); setOpen(false); },
    },
    {
      label: 'Mark Priority',
      icon: Star,
      color: '#EC4899',
      onClick: () => { onMarkPriority(artist.id); setOpen(false); },
    },
    ...(canDrop ? [{
      label: 'Drop Artist',
      icon: UserMinus,
      color: '#EF4444',
      danger: true,
      dividerAbove: true,
      onClick: () => { onDrop(artist.id, artist.name); setOpen(false); },
    }] : []),
  ];

  const actions = isDropped ? droppedActions : normalActions;

  return (
    <div ref={menuRef} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); setLabelSubOpen(false); }}
        title="Actions"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 7,
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: open ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!open) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.14)'; } }}
        onMouseLeave={e => { if (!open) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.08)'; } }}
      >
        <MoreHorizontal size={13} color="rgba(255,255,255,0.5)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 5px)', zIndex: 200,
          background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 11, boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
          minWidth: 190, overflow: 'visible',
          animation: 'fadeInDown 0.1s ease',
        }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.35),transparent)', marginBottom: 4 }} />

          {isDropped && (
            <div style={{ padding: '6px 14px 2px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(239,68,68,0.6)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 800 }}>
                Exit Workflow
              </span>
            </div>
          )}

          {actions.map((action, i) => {
            const Icon = action.icon;
            const color = action.color ?? 'rgba(255,255,255,0.7)';
            return (
              <div key={i}>
                {action.dividerAbove && (
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
                )}
                <button
                  onClick={e => { e.stopPropagation(); if (!action.disabled) action.onClick(); }}
                  disabled={action.disabled}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', padding: '8px 14px',
                    background: 'transparent', border: 'none', cursor: action.disabled ? 'wait' : 'pointer',
                    color: action.danger ? '#EF4444' : color,
                    fontSize: 12, fontWeight: 600, textAlign: 'left',
                    transition: 'background 0.1s',
                    opacity: action.disabled ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!action.disabled) (e.currentTarget as HTMLButtonElement).style.background = action.danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                    background: action.danger ? 'rgba(239,68,68,0.1)' : `${color}12`,
                    border: `1px solid ${action.danger ? 'rgba(239,68,68,0.2)' : `${color}20`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {action.loading
                      ? <Loader size={9} color={color} style={{ animation: 'spin 1s linear infinite' }} />
                      : <Icon size={9} color={action.danger ? '#EF4444' : color} />
                    }
                  </div>
                  {action.label}
                </button>
              </div>
            );
          })}

          {!isDropped && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px 0' }} />
              <div style={{ position: 'relative' }}>
                <button
                  onClick={e => { e.stopPropagation(); setLabelSubOpen(v => !v); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    width: '100%', padding: '8px 14px',
                    background: labelSubOpen ? 'rgba(167,139,250,0.07)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    color: '#A78BFA', fontSize: 12, fontWeight: 600, textAlign: 'left',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(167,139,250,0.07)'; }}
                  onMouseLeave={e => { if (!labelSubOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={9} color="#A78BFA" />
                  </div>
                  Assign Label
                  <ChevronDown size={9} color="#A78BFA" style={{ marginLeft: 'auto', transform: labelSubOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
                </button>

                {labelSubOpen && (
                  <div style={{
                    position: 'absolute', left: 'calc(100% + 4px)', top: 0, zIndex: 201,
                    background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 11, boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
                    minWidth: 180, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '7px 12px 5px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(167,139,250,0.55)', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 800 }}>Assign to Label</span>
                    </div>
                    {labelsData.filter(l => l.status === 'Active').map(label => (
                      <button
                        key={label.id}
                        onClick={e => { e.stopPropagation(); handleAssignLabel(label.id); }}
                        disabled={assigningLabel === label.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          width: '100%', padding: '7px 12px',
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, textAlign: 'left',
                          transition: 'background 0.1s', opacity: assigningLabel && assigningLabel !== label.id ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                      >
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: label.color, flexShrink: 0 }} />
                        {assigningLabel === label.id
                          ? <Loader size={9} color={label.color} style={{ animation: 'spin 1s linear infinite' }} />
                          : <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label.name}</span>
                        }
                        <span style={{ fontFamily: 'monospace', fontSize: 7, color: `${label.color}70`, background: `${label.color}12`, border: `1px solid ${label.color}20`, borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>{label.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div style={{ height: 4 }} />
        </div>
      )}
    </div>
  );
}

function ArtistRow({
  artist,
  index,
  onOpen,
  canDrop,
  onDrop,
  isDropped,
  onCompleteDrop,
  onMarkPriority,
}: {
  artist: typeof SIGNED_ARTISTS[number];
  index: number;
  onOpen: (id: string) => void;
  canDrop: boolean;
  onDrop: (id: string, name: string) => void;
  isDropped: boolean;
  onCompleteDrop: (id: string, name: string) => void;
  onMarkPriority: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const delta = artist.streamingDelta;
  const isUp = delta.startsWith('+');
  const isPending = delta.toLowerCase().includes('pending') || delta.toLowerCase().includes('n/a') || delta === '—';
  const deltaColor = isPending ? 'rgba(255,255,255,0.2)' : isUp ? '#10B981' : '#EF4444';

  const statusColor: Record<string, string> = {
    'Active':       '#10B981',
    'Priority':     '#EF4444',
    'New Signing':  '#06B6D4',
    'Recouping':    '#F59E0B',
    'On Hold':      '#6B7280',
    'Inactive':     '#6B7280',
    'Pending Sync': 'rgba(255,255,255,0.25)',
  };
  const sc = statusColor[artist.status] ?? 'rgba(255,255,255,0.3)';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: isDropped
          ? 'rgba(239,68,68,0.02)'
          : hovered ? 'rgba(255,255,255,0.016)' : 'transparent',
        transition: 'background 0.1s',
        cursor: 'default',
        opacity: isDropped ? 0.65 : 1,
      }}
    >
      <div style={{ width: 24, flexShrink: 0, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.18)', textAlign: 'right' }}>
        {index + 1}
      </div>

      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: `${artist.avatarColor}18`, border: `1px solid ${artist.avatarColor}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: hovered && !isDropped ? `0 0 12px ${artist.avatarColor}20` : 'none',
        transition: 'box-shadow 0.15s',
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, fontFamily: 'monospace', color: artist.avatarColor }}>
          {artist.avatarInitials}
        </span>
      </div>

      <div style={{ width: 200, flexShrink: 0, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.name}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.28)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.genre}{artist.labelImprint ? ` • ${artist.labelImprint}` : ''}
        </div>
      </div>

      <div style={{ width: 90, flexShrink: 0 }}>
        {isDropped ? (
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, fontWeight: 800, padding: '2px 7px', borderRadius: 5, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', whiteSpace: 'nowrap' }}>
            Dropped
          </span>
        ) : (
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, fontWeight: 800, padding: '2px 7px', borderRadius: 5, color: sc, background: `${sc}14`, border: `1px solid ${sc}28`, whiteSpace: 'nowrap' }}>
            {artist.status}
          </span>
        )}
      </div>

      <div style={{ width: 95, flexShrink: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 900, color: 'rgba(255,255,255,0.75)', lineHeight: 1 }}>
          {fmt(artist.monthlyListeners)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
          {!isPending && (isUp ? <TrendingUp size={8} color="#10B981" /> : <TrendingDown size={8} color="#EF4444" />)}
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: deltaColor }}>{delta}</span>
        </div>
      </div>

      <div style={{ width: 52, flexShrink: 0 }}>
        <HealthBar score={artist.healthScore} />
      </div>

      <div style={{ width: 100, flexShrink: 0 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap' }}>
          {artist.tier}
        </span>
      </div>

      <div style={{ width: 72, flexShrink: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>
          {fmtMoney(artist.financials.ytdRevenue)}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>YTD Rev</div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.market || '—'}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>Market</div>
      </div>

      <div style={{ width: 110, flexShrink: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {artist.manager || '—'}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', marginTop: 2 }}>Manager</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <button
          onClick={() => onOpen(artist.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '6px 12px', borderRadius: 8,
            fontFamily: 'monospace', fontSize: 8.5, fontWeight: 800, letterSpacing: '0.04em',
            color: isDropped ? 'rgba(255,255,255,0.3)' : artist.avatarColor,
            background: isDropped ? 'rgba(255,255,255,0.04)' : `${artist.avatarColor}10`,
            border: isDropped ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${artist.avatarColor}25`,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!isDropped) { (e.currentTarget as HTMLButtonElement).style.background = `${artist.avatarColor}20`; } }}
          onMouseLeave={e => { if (!isDropped) { (e.currentTarget as HTMLButtonElement).style.background = `${artist.avatarColor}10`; } }}
        >
          Open <ArrowUpRight size={9} />
        </button>

        <ActionsMenu
          artist={artist}
          isDropped={isDropped}
          canDrop={canDrop}
          onNavigate={navigate}
          onDrop={onDrop}
          onCompleteDrop={onCompleteDrop}
          onMarkPriority={onMarkPriority}
        />
      </div>
    </div>
  );
}

function GlobalInsightBar({ roster }: { roster: typeof SIGNED_ARTISTS }) {
  const totalListeners = roster.reduce((s, a) => s + a.monthlyListeners, 0);
  const avgHealth      = Math.round(roster.reduce((s, a) => s + a.healthScore, 0) / Math.max(roster.length, 1));
  const totalRevenue   = roster.reduce((s, a) => s + a.financials.ytdRevenue, 0);
  const topGrowing     = [...roster]
    .filter(a => a.streamingDelta.startsWith('+'))
    .sort((a, b) => parseFloat(b.streamingDelta) - parseFloat(a.streamingDelta))[0];

  const stats = [
    { label: 'Total Monthly Listeners', value: fmt(totalListeners),       sub: `Across ${roster.length} artists`,    icon: Music,      color: '#06B6D4' },
    { label: 'Avg Health Score',        value: avgHealth.toString(),       sub: avgHealth >= 75 ? 'Roster healthy' : 'Attention needed', icon: Activity,   color: avgHealth >= 75 ? '#10B981' : '#F59E0B' },
    { label: 'YTD Revenue',             value: fmtMoney(totalRevenue),     sub: 'Aggregate global roster',           icon: DollarSign, color: '#10B981' },
    { label: 'Top Growing Artist',      value: topGrowing?.name ?? '—',    sub: topGrowing ? `${topGrowing.streamingDelta} listener growth` : 'No delta data', icon: TrendingUp, color: '#EC4899' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(6,182,212,0.06) 0%,rgba(16,185,129,0.04) 55%,rgba(236,72,153,0.035) 100%)',
      border: '1px solid rgba(6,182,212,0.18)', borderRadius: 14, padding: '14px 18px',
      position: 'relative', overflow: 'hidden', marginBottom: 16,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.48),rgba(16,185,129,0.3),transparent)' }} />
      <div style={{ fontFamily: 'monospace', fontSize: 7.5, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(6,182,212,0.45)', marginBottom: 11 }}>
        Global Roster Intelligence — {roster.length} Artists
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: `${s.color}07`, border: `1px solid ${s.color}16`, borderRadius: 10, padding: '11px 13px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: `${s.color}14`, border: `1px solid ${s.color}24`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={10} color={s.color} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.07em', textTransform: 'uppercase', color: `${s.color}80` }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 17, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 3, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.26)' }}>{s.sub}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const UNIQUE_LABELS = Array.from(
  new Set(SIGNED_ARTISTS.map(a => a.labelImprint).filter(Boolean))
).sort() as string[];

export default function ArtistOSArtists() {
  const navigate = useNavigate();
  const { roleState } = useRole();
  const currentRole = (roleState.role ?? 'artist_manager') as ArtistOSRole;
  const perms = ROLE_PERMISSIONS[currentRole];

  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');
  const [selectedLabel, setSelectedLabel] = useState<string>('');
  const [search, setSearch] = useState('');
  const [showLabelDrop, setShowLabelDrop] = useState(false);
  const [dropTarget, setDropTarget] = useState<{ id: string; name: string } | null>(null);
  const [droppedIds, setDroppedIds] = useState<Set<string>>(() => {
    const s = new Set<string>();
    SIGNED_ARTISTS.forEach(a => { if (isArtistDropped(a.id)) s.add(a.id); });
    return s;
  });
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2800);
  }

  const handleDrop = useCallback((id: string, name: string) => {
    setDropTarget({ id, name });
  }, []);

  const handleDropConfirmed = useCallback((artistId: string) => {
    setLocalLifecycleState(artistId, 'dropped_pending');
    setDroppedIds(prev => new Set([...prev, artistId]));
    showToast('Artist moved to Dropped Queue');
  }, []);

  const handleCompleteDrop = useCallback(async (artistId: string, artistName: string) => {
    const initiatedBy = roleState.user?.email ?? 'admin@gmg.ai';
    await completeDropArtist(artistId, initiatedBy);
    setCompletedIds(prev => new Set([...prev, artistId]));
    showToast(`${artistName} — exit marked complete`);
  }, [roleState.user?.email]);

  const handleMarkPriority = useCallback((artistId: string) => {
    const artist = SIGNED_ARTISTS.find(a => a.id === artistId);
    showToast(`${artist?.name ?? 'Artist'} flagged as Priority`);
  }, []);

  const activeRoster = useMemo(
    () => getActiveArtists(SIGNED_ARTISTS),
    [droppedIds],
  );

  const filtered = useMemo(() => {
    let result = activeRoster;

    if (activeFilter === 'By Label') {
      if (selectedLabel) result = result.filter(a => a.labelImprint === selectedLabel);
    } else if (activeFilter === 'Growth') {
      result = result.filter(a => a.streamingDelta.startsWith('+'));
    } else if (activeFilter === 'At Risk') {
      result = result.filter(a => a.healthScore < 65 || a.status === 'Recouping');
    } else if (activeFilter === 'Dropped') {
      result = SIGNED_ARTISTS.filter(a => droppedIds.has(a.id));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.genre.toLowerCase().includes(q) ||
        (a.manager ?? '').toLowerCase().includes(q) ||
        (a.labelImprint ?? '').toLowerCase().includes(q) ||
        (a.market ?? '').toLowerCase().includes(q),
      );
    }

    return result;
  }, [activeFilter, selectedLabel, search, droppedIds, activeRoster]);

  const atRiskCount  = activeRoster.filter(a => a.healthScore < 65 || a.status === 'Recouping').length;
  const droppedCount = droppedIds.size;

  function handleOpen(id: string) {
    navigate(`/dashboard/artist-os/roster/${id}`);
  }

  return (
    <div style={{ padding: 20, background: '#08090B', minHeight: '100%' }}>

      {toastMsg && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, padding: '11px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', gap: 9,
          animation: 'fadeInUp 0.18s ease',
        }}>
          <CheckCircle size={12} color="#10B981" />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{toastMsg}</span>
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={14} color="#06B6D4" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Artists</h1>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>—</span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: '#06B6D4' }}>Global Roster</span>
              <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(6,182,212,0.45)', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', borderRadius: 5, padding: '2px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>All Artists</span>
            </div>
          </div>

          {droppedCount > 0 && (
            <button
              onClick={() => navigate('/dashboard/artist-os/dropped-queue')}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontFamily: 'monospace', fontSize: 9, fontWeight: 800, cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            >
              <UserMinus size={10} color="#EF4444" />
              {droppedCount} in Dropped Queue
            </button>
          )}
        </div>
        <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
          {activeRoster.length} active artists across all labels, imprints, and rosters. Sorted by monthly listeners.
        </p>
      </div>

      {atRiskCount > 0 && activeFilter !== 'At Risk' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '9px 15px', marginBottom: 14 }}>
          <AlertTriangle size={12} color="#EF4444" />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(239,68,68,0.8)' }}>
            {atRiskCount} artist{atRiskCount > 1 ? 's' : ''} flagged At Risk across the global roster.
          </span>
          <button
            onClick={() => setActiveFilter('At Risk')}
            style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 6, padding: '3px 9px', cursor: 'pointer' }}
          >
            View At Risk →
          </button>
        </div>
      )}

      <GlobalInsightBar roster={activeRoster} />

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 9, padding: '6px 11px', flex: 1, maxWidth: 240 }}>
            <Search size={10} color="rgba(255,255,255,0.22)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search artists, labels, markets..."
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 11, color: 'rgba(255,255,255,0.6)', minWidth: 0 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {FILTERS.map(f => {
              const active = activeFilter === f.key;
              const c = FILTER_COLOR[f.key];
              const Icon = f.icon;
              const badge = f.key === 'At Risk' ? atRiskCount : f.key === 'Dropped' ? droppedCount : null;
              return (
                <button
                  key={f.key}
                  onClick={() => {
                    if (f.key === 'Dropped' && droppedCount > 0) {
                      navigate('/dashboard/artist-os/dropped-queue');
                      return;
                    }
                    setActiveFilter(f.key);
                    if (f.key === 'By Label') setShowLabelDrop(v => !v);
                    else setShowLabelDrop(false);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 11px', borderRadius: 7,
                    fontFamily: 'monospace', fontSize: 8, fontWeight: 800, cursor: 'pointer',
                    background: active ? `${c}12` : 'transparent',
                    color: active ? c : 'rgba(255,255,255,0.28)',
                    border: active ? `1px solid ${c}28` : '1px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={8} color={active ? c : 'rgba(255,255,255,0.2)'} />
                  {f.key}
                  {badge !== null && badge > 0 && (
                    <span style={{
                      fontFamily: 'monospace', fontSize: 7, fontWeight: 900,
                      padding: '1px 4px', borderRadius: 4,
                      background: active ? `${c}20` : 'rgba(255,255,255,0.06)',
                      color: active ? c : 'rgba(255,255,255,0.25)',
                      border: `1px solid ${active ? c + '30' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                      {badge}
                    </span>
                  )}
                  {f.key === 'By Label' && <ChevronDown size={7} color={active ? c : 'rgba(255,255,255,0.2)'} />}
                </button>
              );
            })}
          </div>

          {activeFilter === 'By Label' && showLabelDrop && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.22)' }}>
              <TagIcon size={9} color="#A78BFA" />
              <select
                value={selectedLabel}
                onChange={e => setSelectedLabel(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: 8.5, color: '#A78BFA', cursor: 'pointer', minWidth: 120 }}
              >
                <option value="">All Labels</option>
                {UNIQUE_LABELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
              {filtered.length} of {activeFilter === 'Dropped' ? droppedCount : activeRoster.length} artists
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '7px 20px', background: 'rgba(0,0,0,0.16)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ width: 24, flexShrink: 0 }} />
          <div style={{ width: 36, flexShrink: 0 }} />
          {[
            { label: 'Artist / Label',  w: 200 },
            { label: 'Status',          w: 90  },
            { label: 'Listeners',       w: 95  },
            { label: 'Health',          w: 52  },
            { label: 'Tier',            w: 100 },
            { label: 'Revenue YTD',     w: 72  },
            { label: 'Market',          flex: 1 },
            { label: 'Manager',         w: 110 },
          ].map(col => (
            <div key={col.label} style={{ width: col.w, flexShrink: col.flex ? undefined : 0, flex: col.flex, fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {col.label}
            </div>
          ))}
          <div style={{ width: 72, flexShrink: 0, fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Actions</div>
        </div>

        {filtered.length > 0 ? (
          filtered
            .slice()
            .sort((a, b) => b.monthlyListeners - a.monthlyListeners)
            .map((a, i) => (
              <ArtistRow
                key={a.id}
                artist={a}
                index={i}
                onOpen={handleOpen}
                canDrop={perms.canDropArtists}
                onDrop={handleDrop}
                isDropped={droppedIds.has(a.id)}
                onCompleteDrop={handleCompleteDrop}
                onMarkPriority={handleMarkPriority}
              />
            ))
        ) : (
          <div style={{ padding: '48px', textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            No artists match your filter.
          </div>
        )}

        <div style={{ padding: '9px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.15)' }}>
            Global Roster · {SIGNED_ARTISTS.length} artists · All labels & imprints
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.15)' }}>
            Last synced: Apr 13, 2026
          </span>
        </div>
      </div>

      {dropTarget && (
        <DropArtistModal
          artistId={dropTarget.id}
          artistName={dropTarget.name}
          initiatedBy={roleState.user?.email ?? 'admin@gmg.ai'}
          onClose={() => setDropTarget(null)}
          onConfirmed={handleDropConfirmed}
        />
      )}

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
