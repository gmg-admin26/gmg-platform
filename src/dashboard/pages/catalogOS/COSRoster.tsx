import { useState, useRef, useEffect } from 'react';
import {
  Users, DollarSign, TrendingUp, Activity, MoreHorizontal,
  Music, ArrowUpRight, AlertTriangle, CheckCircle, Globe,
  ExternalLink, Loader, Search, Filter,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useCatalogClient } from '../../context/CatalogClientContext';

// ── Static client data (mirrors seeded DB rows) ───────────────────────────────

interface ClientRow {
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

const CLIENTS: ClientRow[] = [
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
    name: 'Placeholder Artist 03',
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

// ── Shared primitives ─────────────────────────────────────────────────────────

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
    }}>
      {label}
    </span>
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

// ── Actions context menu ──────────────────────────────────────────────────────

function ActionsMenu({ client, onSwitch }: { client: ClientRow; onSwitch: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function handleOpen() {
    setLoading(true);
    onSwitch(client.id);
    await new Promise(r => setTimeout(r, 300));
    setLoading(false);
    setOpen(false);
  }

  const actions = [
    { label: 'Open Catalog OS', icon: ArrowUpRight, color: client.accent, onClick: handleOpen },
    { label: 'View Revenue',    icon: DollarSign,   color: '#10B981',     onClick: () => setOpen(false) },
    { label: 'View Assets',     icon: Music,        color: '#06B6D4',     onClick: () => setOpen(false) },
    { label: 'View Tasks',      icon: CheckCircle,  color: '#F59E0B',     onClick: () => setOpen(false) },
    { label: 'Open Rights',     icon: ExternalLink, color: '#6B7280',     onClick: () => setOpen(false) },
  ];

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
          color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'all 0.12s',
        }}
        onMouseEnter={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.08)'; b.style.borderColor = 'rgba(255,255,255,0.14)'; } }}
        onMouseLeave={e => { if (!open) { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'rgba(255,255,255,0.04)'; b.style.borderColor = 'rgba(255,255,255,0.08)'; } }}
      >
        <MoreHorizontal size={13} color="rgba(255,255,255,0.5)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 5px)', zIndex: 200,
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
                  color: action.color, fontSize: 12, fontWeight: 600, textAlign: 'left' as const,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                  background: `${action.color}12`, border: `1px solid ${action.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {loading && i === 0
                    ? <Loader size={9} color={action.color} style={{ animation: 'spin 1s linear infinite' }} />
                    : <Icon size={9} color={action.color} />
                  }
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

function KPIStrip() {
  const avgHealth = Math.round(CLIENTS.reduce((s, c) => s + c.health, 0) / CLIENTS.length);
  const openIssues = CLIENTS.reduce((s, c) => s + c.openIssues, 0);

  const kpis = [
    { label: 'Total Clients',   value: `${CLIENTS.length}`, icon: Users,          color: '#06B6D4' },
    { label: 'Portfolio Value', value: '$9.4M',              icon: DollarSign,     color: '#10B981' },
    { label: 'Monthly Revenue', value: '$451K / mo',         icon: TrendingUp,     color: '#F59E0B' },
    { label: 'Avg Health',      value: `${avgHealth}`,       icon: Activity,       color: '#A3E635' },
    { label: 'Open Issues',     value: `${openIssues}`,      icon: AlertTriangle,  color: openIssues > 0 ? '#EF4444' : '#6B7280' },
  ];

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      {kpis.map(k => {
        const Icon = k.icon;
        return (
          <div key={k.label} style={{
            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
            borderRight: '1px solid rgba(255,255,255,0.04)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `${k.color}12`, border: `1px solid ${k.color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
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

function TableRow({ client, onSwitch }: { client: ClientRow; onSwitch: (id: string) => void }) {
  const sm = STATUS_META[client.status];
  const pm = PRIORITY_META[client.priority];

  return (
    <div
      onClick={() => onSwitch(client.id)}
      style={{
        display: 'grid', gridTemplateColumns: COL, alignItems: 'center', gap: 12,
        padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer', transition: 'background 0.12s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
    >
      {/* Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9, flexShrink: 0,
          background: `${client.accent}14`, border: `1px solid ${client.accent}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Music size={14} color={client.accent} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
            {client.name}
          </div>
          <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.25)', marginTop: 1 }}>
            {client.genre} · {client.releases} rel · {client.streams}
          </div>
        </div>
      </div>

      {/* Status */}
      <div><PillBadge label={sm.label} color={sm.color} /></div>

      {/* Health */}
      <div><HealthBar score={client.health} /></div>

      {/* Priority */}
      <div><PillBadge label={pm.label} color={pm.color} /></div>

      {/* Catalog Value */}
      <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB', fontFamily: 'monospace' }}>{client.catalogValue}</div>

      {/* Monthly Rev */}
      <div style={{ fontSize: 11, color: '#10B981', fontFamily: 'monospace' }}>{client.monthlyRevenue}</div>

      {/* Tasks / Issues */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
      </div>

      {/* Manager */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
            {client.manager.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
          {client.manager.split(' ')[0]}
        </span>
      </div>

      {/* Actions */}
      <div onClick={e => e.stopPropagation()}>
        <ActionsMenu client={client} onSwitch={onSwitch} />
      </div>
    </div>
  );
}

// ── Notes strip ───────────────────────────────────────────────────────────────

function NotesStrip({ clients, onSwitch }: { clients: ClientRow[]; onSwitch: (id: string) => void }) {
  return (
    <div style={{ padding: '12px 18px 24px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {clients.map(c => (
        <div key={c.id} style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: '10px 14px', borderRadius: 10,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent, flexShrink: 0, marginTop: 4 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>{c.name}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{c.notes}</span>
          </div>
          <button
            onClick={() => onSwitch(c.id)}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, color: c.accent,
              background: `${c.accent}10`, border: `1px solid ${c.accent}22`, borderRadius: 6,
              padding: '3px 8px', cursor: 'pointer',
            }}
          >
            <ExternalLink size={9} color={c.accent} /> View
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

type FilterKey = 'All' | 'Active' | 'Onboarding' | 'At Risk';

const FILTERS: { key: FilterKey; color: string }[] = [
  { key: 'All',        color: '#06B6D4' },
  { key: 'Active',     color: '#10B981' },
  { key: 'Onboarding', color: '#06B6D4' },
  { key: 'At Risk',    color: '#EF4444' },
];

const COLS = ['Client', 'Status', 'Health', 'Priority', 'Catalog Value', 'Mo. Revenue', 'Tasks', 'Manager', ''];

export default function COSRoster() {
  const { activeClient, switchClient } = useCatalogClient();
  const accent = activeClient?.accent_color ?? '#10B981';

  const [filter, setFilter] = useState<FilterKey>('All');
  const [search, setSearch] = useState('');

  const filtered = CLIENTS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.genre.toLowerCase().includes(q) || c.manager.toLowerCase().includes(q);
    if (!matchSearch) return false;
    if (filter === 'Active')     return c.status === 'active';
    if (filter === 'Onboarding') return c.status === 'onboarding';
    if (filter === 'At Risk')    return c.health < 55 || c.openIssues > 2;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07080A]">
      <CatalogPageHeader
        icon={Users}
        title="Catalog Clients"
        subtitle="Client roster · admin overview · operational management"
        accentColor={accent}
        badge="ADMIN"
      />

      <KPIStrip />

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
                padding: '4px 11px', borderRadius: 7, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', border: '1px solid',
                background: filter === f.key ? `${f.color}18` : 'rgba(255,255,255,0.04)',
                borderColor: filter === f.key ? `${f.color}35` : 'rgba(255,255,255,0.07)',
                color: filter === f.key ? f.color : 'rgba(255,255,255,0.35)',
                transition: 'all 0.12s',
              }}
            >{f.key}</button>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
          borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', minWidth: 200,
        }}>
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
      <div style={{
        display: 'grid', gridTemplateColumns: COL, gap: 12,
        padding: '7px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
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
        filtered.map(c => <TableRow key={c.id} client={c} onSwitch={switchClient} />)
      )}

      {/* Count */}
      <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <span style={{ fontSize: 9.5, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>
          {filtered.length} of {CLIENTS.length} clients
        </span>
      </div>

      {/* Notes strip */}
      <NotesStrip clients={filtered} onSwitch={switchClient} />
    </div>
  );
}
