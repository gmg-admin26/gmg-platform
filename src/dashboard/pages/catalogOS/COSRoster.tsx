import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, DollarSign, TrendingUp, Activity, MoreHorizontal,
  Music, ArrowUpRight, AlertTriangle, CheckCircle,
  ExternalLink, Loader, Search, Filter, UserMinus,
  ShieldOff, X,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useCatalogClient } from '../../context/CatalogClientContext';
import {
  isClientDropped, dropClient, initCatalogDropState,
} from '../../data/catalogDropService';

// ── Static client data ────────────────────────────────────────────────────────

export interface CatalogClientRow {
  id: string;
  name: string;
  status: 'active' | 'onboarding' | 'paused' | 'offboarded';
  health: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  catalogValue: string;
  monthlyRevenue: string;
  activeTasks: number;
  openIssues: number;
  manager: string;
  clientSince: string;
  accent: string;
  genre: string;
  releases: number;
  streams: string;
  notes: string;
}

export const ALL_CATALOG_CLIENTS: CatalogClientRow[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Bassnectar',
    status: 'active',
    health: 87,
    priority: 'critical',
    catalogValue: '$5.8M',
    monthlyRevenue: '$284.6K',
    activeTasks: 7,
    openIssues: 1,
    manager: 'Nick Terzo',
    clientSince: 'Nov 2025',
    accent: '#10B981',
    genre: 'Electronic / Bass',
    releases: 28,
    streams: '2.4B',
    notes: 'Brand rehab + catalog reactivation. ZFM active. Sync pipeline $200K–$600K target.',
  },
  {
    id: 'a2000000-0000-0000-0000-000000000002',
    name: 'Santigold',
    status: 'active',
    health: 74,
    priority: 'high',
    catalogValue: '$3.2M',
    monthlyRevenue: '$148K',
    activeTasks: 4,
    openIssues: 0,
    manager: 'GMG Catalog Team',
    clientSince: 'Feb 2026',
    accent: '#F59E0B',
    genre: 'Indie Pop / Art Rock',
    releases: 18,
    streams: '820M',
    notes: 'New LP in development for Q4 2026. Film + TV sync pipeline active.',
  },
  {
    id: 'a3000000-0000-0000-0000-000000000003',
    name: 'Virgin Catalog Artist',
    status: 'onboarding',
    health: 42,
    priority: 'medium',
    catalogValue: '$420K',
    monthlyRevenue: '$18.5K',
    activeTasks: 2,
    openIssues: 3,
    manager: 'GMG Catalog Team',
    clientSince: 'Apr 2026',
    accent: '#3B82F6',
    genre: 'TBD',
    releases: 6,
    streams: '42M',
    notes: 'Onboarding in progress. Rights clearance review underway. Full assessment May 2026.',
  },
];

// ── Primitives ────────────────────────────────────────────────────────────────

const STATUS_META = {
  active:      { label: 'Active',      color: '#10B981' },
  onboarding:  { label: 'Onboarding',  color: '#06B6D4' },
  paused:      { label: 'Paused',      color: '#F59E0B' },
  offboarded:  { label: 'Offboarded',  color: '#6B7280' },
};

const PRIORITY_META = {
  critical: { label: 'Critical', color: '#EF4444' },
  high:     { label: 'High',     color: '#F59E0B' },
  medium:   { label: 'Medium',   color: '#06B6D4' },
  low:      { label: 'Low',      color: '#6B7280' },
};

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
      textTransform: 'uppercase' as const, letterSpacing: '0.07em',
      padding: '2px 6px', borderRadius: 4,
      color, background: `${color}14`, border: `1px solid ${color}22`,
      whiteSpace: 'nowrap' as const, flexShrink: 0,
    }}>{label}</span>
  );
}

function HealthBar({ score }: { score: number }) {
  const color = score >= 75 ? '#10B981' : score >= 55 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 900, color, lineHeight: 1 }}>{score}</div>
      <div style={{ width: 38, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 99 }} />
      </div>
    </div>
  );
}

// ── Drop confirmation modal ───────────────────────────────────────────────────

function DropClientModal({
  client,
  onConfirm,
  onCancel,
}: {
  client: CatalogClientRow;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 900,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, background: '#10121A',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18,
          padding: '24px', boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
          animation: 'fadeUp 0.16s ease-out',
        }}
      >
        <style>{`@keyframes fadeUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <UserMinus size={15} color="#EF4444" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#F9FAFB' }}>Drop Client</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{client.name}</div>
          </div>
          <button onClick={onCancel} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 4 }}>
            <X size={14} />
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 14 }}>
          Moving <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{client.name}</strong> to the Dropped Queue.
          Their profile will remain viewable by admin in locked/read-only mode.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 9.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', display: 'block', marginBottom: 5 }}>
            Reason (optional)
          </label>
          <textarea
            rows={2}
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="e.g. Contract concluded, mutual separation..."
            style={{
              width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 8, padding: '7px 10px', fontSize: 12, color: '#F9FAFB', outline: 'none',
              boxSizing: 'border-box' as const, resize: 'vertical' as const,
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => onConfirm(reason)}
            style={{
              flex: 1, padding: '9px 14px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#EF4444', fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <UserMinus size={12} /> Confirm Drop
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
              color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600,
            }}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Actions menu ──────────────────────────────────────────────────────────────

function ActionsMenu({
  client,
  isDropped,
  onOpen,
  onDrop,
}: {
  client: CatalogClientRow;
  isDropped: boolean;
  onOpen: () => void;
  onDrop: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const activeActions = [
    {
      label: 'Open Profile',   icon: ArrowUpRight, color: client.accent,
      onClick: () => { onOpen(); setOpen(false); },
    },
    {
      label: 'View Revenue',   icon: DollarSign,   color: '#10B981',
      onClick: () => setOpen(false),
    },
    {
      label: 'View Assets',    icon: Music,        color: '#06B6D4',
      onClick: () => setOpen(false),
    },
    {
      label: 'Drop Client',    icon: UserMinus,    color: '#EF4444', danger: true,
      onClick: () => { onDrop(); setOpen(false); },
    },
  ];

  const droppedActions = [
    {
      label: 'View Locked Profile', icon: ShieldOff, color: '#F59E0B',
      onClick: () => { onOpen(); setOpen(false); },
    },
  ];

  const actions = isDropped ? droppedActions : activeActions;

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
        title="Actions"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: 7,
          background: open ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          border: open ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.08)',
          cursor: 'pointer', transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.08)'; b.style.borderColor = 'rgba(255,255,255,0.14)'; } }}
        onMouseLeave={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.04)'; b.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
      >
        <MoreHorizontal size={13} color="rgba(255,255,255,0.5)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 5px)', zIndex: 300,
          background: '#131417', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 11, boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
          minWidth: 190, overflow: 'hidden',
        }}>
          <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${client.accent}55,transparent)`, marginBottom: 4 }} />
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); action.onClick(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  width: '100%', padding: '8px 14px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: ('danger' in action && action.danger) ? '#EF4444' : action.color,
                  fontSize: 12, fontWeight: 600, textAlign: 'left' as const,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = ('danger' in action && action.danger) ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  background: ('danger' in action && action.danger) ? 'rgba(239,68,68,0.1)' : `${action.color}12`,
                  border: `1px solid ${('danger' in action && action.danger) ? 'rgba(239,68,68,0.2)' : `${action.color}20`}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={9} color={('danger' in action && action.danger) ? '#EF4444' : action.color} />
                </div>
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── KPI strip ─────────────────────────────────────────────────────────────────

function KPIStrip({ activeCount, droppedCount }: { activeCount: number; droppedCount: number }) {
  const kpis = [
    { label: 'Active Clients',  value: `${activeCount}`,   icon: Users,         color: '#06B6D4' },
    { label: 'Portfolio Value', value: '$9.4M',             icon: DollarSign,    color: '#10B981' },
    { label: 'Monthly Revenue', value: '$451K / mo',        icon: TrendingUp,    color: '#F59E0B' },
    { label: 'Avg Health',      value: '68',                icon: Activity,      color: '#A3E635' },
    { label: 'Dropped',         value: `${droppedCount}`,   icon: UserMinus,     color: droppedCount > 0 ? '#EF4444' : '#6B7280' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      {kpis.map(k => {
        const Icon = k.icon;
        return (
          <div key={k.label} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, borderRight: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: `${k.color}12`, border: `1px solid ${k.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={13} color={k.color} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB', lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginTop: 3, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{k.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Table row ─────────────────────────────────────────────────────────────────

const COL = '2fr 80px 80px 80px 90px 80px 60px 120px 32px';

function TableRow({
  client,
  isDropped,
  onOpen,
  onDrop,
}: {
  client: CatalogClientRow;
  isDropped: boolean;
  onOpen: (id: string) => void;
  onDrop: (client: CatalogClientRow) => void;
}) {
  const sm = STATUS_META[client.status];
  const pm = PRIORITY_META[client.priority];

  return (
    <div
      onClick={() => onOpen(client.id)}
      style={{
        display: 'grid', gridTemplateColumns: COL, alignItems: 'center', gap: 12,
        padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer', transition: 'background 0.12s',
        opacity: isDropped ? 0.5 : 1,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: isDropped ? 'rgba(239,68,68,0.08)' : `${client.accent}14`,
          border: `1px solid ${isDropped ? 'rgba(239,68,68,0.2)' : `${client.accent}25`}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isDropped
            ? <UserMinus size={14} color="#EF4444" />
            : <Music size={14} color={client.accent} />
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: isDropped ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
              {client.name}
            </span>
            {isDropped && <PillBadge label="DROPPED" color="#EF4444" />}
          </div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
            {client.genre} · {client.releases} rel · {client.streams}
          </div>
        </div>
      </div>

      <div>{isDropped ? <PillBadge label="Dropped" color="#EF4444" /> : <PillBadge label={sm.label} color={sm.color} />}</div>
      <div>{isDropped ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>—</span> : <HealthBar score={client.health} />}</div>
      <div>{isDropped ? <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>—</span> : <PillBadge label={pm.label} color={pm.color} />}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: isDropped ? 'rgba(255,255,255,0.3)' : '#F9FAFB', fontFamily: 'monospace' }}>{client.catalogValue}</div>
      <div style={{ fontSize: 11, color: isDropped ? 'rgba(255,255,255,0.2)' : '#10B981', fontFamily: 'monospace' }}>{isDropped ? '—' : client.monthlyRevenue}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {!isDropped && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={9} color="#06B6D4" />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{client.activeTasks}</span>
            </div>
            {client.openIssues > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={9} color="#EF4444" />
                <span style={{ fontSize: 10, color: '#EF4444', fontFamily: 'monospace' }}>{client.openIssues}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
            {client.manager.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {client.manager.split(' ')[0]}
        </span>
      </div>

      <div onClick={e => e.stopPropagation()}>
        <ActionsMenu
          client={client}
          isDropped={isDropped}
          onOpen={() => onOpen(client.id)}
          onDrop={() => onDrop(client)}
        />
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type FilterKey = 'Active' | 'All' | 'At Risk' | 'Dropped';

const FILTERS: { key: FilterKey; color: string }[] = [
  { key: 'Active',  color: '#10B981' },
  { key: 'All',     color: '#06B6D4' },
  { key: 'At Risk', color: '#EF4444' },
  { key: 'Dropped', color: '#6B7280' },
];

const COLS = ['Client', 'Status', 'Health', 'Priority', 'Catalog Value', 'Mo. Revenue', 'Tasks', 'Manager', ''];

export default function COSRoster() {
  const navigate = useNavigate();
  const { activeClient } = useCatalogClient();
  const accent = activeClient?.accent_color ?? '#10B981';

  const [filter, setFilter] = useState<FilterKey>('Active');
  const [search, setSearch] = useState('');
  const [dropTarget, setDropTarget] = useState<CatalogClientRow | null>(null);
  const [dropVersion, setDropVersion] = useState(0);

  useEffect(() => { initCatalogDropState().then(() => setDropVersion(v => v + 1)); }, []);

  const isDropped = useCallback((id: string) => isClientDropped(id), [dropVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const droppedCount = ALL_CATALOG_CLIENTS.filter(c => isClientDropped(c.id)).length;
  const activeCount = ALL_CATALOG_CLIENTS.length - droppedCount;

  const filtered = ALL_CATALOG_CLIENTS.filter(c => {
    const dropped = isClientDropped(c.id);
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.genre.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === 'Active')  return !dropped;
    if (filter === 'Dropped') return dropped;
    if (filter === 'At Risk') return !dropped && (c.health < 55 || c.openIssues > 2);
    return true;
  });

  // Map client UUIDs to explicit slug routes so each row opens its own unique page
  const CLIENT_SLUGS: Record<string, string> = {
    'a1000000-0000-0000-0000-000000000001': 'bassnectar',
    'a2000000-0000-0000-0000-000000000002': 'santigold',
    'a3000000-0000-0000-0000-000000000003': 'virgin-catalog-artist',
  };

  function handleOpen(clientId: string) {
    const slug = CLIENT_SLUGS[clientId] ?? clientId;
    navigate(`/catalog/app/client/${slug}`);
  }

  function handleDrop(client: CatalogClientRow) {
    setDropTarget(client);
  }

  async function confirmDrop(reason: string) {
    if (!dropTarget) return;
    await dropClient({
      clientId: dropTarget.id,
      clientName: dropTarget.name,
      initiatedBy: 'Admin',
      notes: reason || 'Dropped via admin roster',
    });
    setDropTarget(null);
    setDropVersion(v => v + 1);
  }

  return (
    <div className="min-h-screen bg-[#07080A]">
      <CatalogPageHeader
        icon={Users}
        title="Catalog Clients"
        subtitle="Admin roster · client management · lifecycle operations"
        accentColor={accent}
        badge="ADMIN"
      />

      <KPIStrip activeCount={activeCount} droppedCount={droppedCount} />

      {/* Filter + search */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Filter size={13} color="rgba(255,255,255,0.25)" />
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '4px 11px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                border: '1px solid',
                background: filter === f.key ? `${f.color}18` : 'rgba(255,255,255,0.04)',
                borderColor: filter === f.key ? `${f.color}35` : 'rgba(255,255,255,0.07)',
                color: filter === f.key ? f.color : 'rgba(255,255,255,0.35)',
                transition: 'all 0.12s',
              }}
            >{f.key}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', minWidth: 200 }}>
          <Search size={12} color="rgba(255,255,255,0.25)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 11, color: 'rgba(255,255,255,0.7)', width: '100%' }}
          />
        </div>
      </div>

      {/* Table header */}
      <div style={{ display: 'grid', gridTemplateColumns: COL, gap: 12, padding: '7px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {COLS.map(col => (
          <div key={col} style={{ fontSize: 8.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{col}</div>
        ))}
      </div>

      {/* Rows */}
      {filtered.length === 0 ? (
        <div style={{ padding: '48px 18px', textAlign: 'center' as const, color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>
          No clients match the current filter.
        </div>
      ) : (
        filtered.map(c => (
          <TableRow
            key={c.id}
            client={c}
            isDropped={isDropped(c.id)}
            onOpen={handleOpen}
            onDrop={handleDrop}
          />
        ))
      )}

      {/* Count + dropped queue link */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>
          {filtered.length} of {ALL_CATALOG_CLIENTS.length} clients
        </span>
        {droppedCount > 0 && filter !== 'Dropped' && (
          <button
            onClick={() => setFilter('Dropped')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
          >
            <UserMinus size={9} color="#EF4444" /> {droppedCount} dropped
          </button>
        )}
      </div>

      {/* Notes strip */}
      <div style={{ padding: '12px 18px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: isClientDropped(c.id) ? '#EF4444' : c.accent, flexShrink: 0, marginTop: 4 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{c.name}</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{c.notes}</span>
            </div>
            <button
              onClick={() => handleOpen(c.id)}
              style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: isClientDropped(c.id) ? '#EF4444' : c.accent, background: isClientDropped(c.id) ? 'rgba(239,68,68,0.08)' : `${c.accent}10`, border: `1px solid ${isClientDropped(c.id) ? 'rgba(239,68,68,0.2)' : `${c.accent}22`}`, borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}
            >
              <ExternalLink size={9} /> {isClientDropped(c.id) ? 'View Locked' : 'View'}
            </button>
          </div>
        ))}
      </div>

      {/* Drop modal */}
      {dropTarget && (
        <DropClientModal
          client={dropTarget}
          onConfirm={confirmDrop}
          onCancel={() => setDropTarget(null)}
        />
      )}
    </div>
  );
}
