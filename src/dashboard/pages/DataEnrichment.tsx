// ============================================================
// Data Enrichment Admin — Artist OS
// Central hub for managing all API integration points,
// enrichment field status, and per-artist data coverage.
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { Zap, Search, RefreshCw, ChevronDown, ChevronRight, Music2, Smartphone, Camera, Youtube, Globe, Users, UserCheck, CheckCircle, Clock, CreditCard as Edit, AlertTriangle, Loader, ExternalLink, BarChart3, Database } from 'lucide-react';
import { SIGNED_ARTISTS } from '../data/artistRosterData';
import {
  INTEGRATIONS, FIELD_CATALOGUE,
  fetchAllEnrichmentFields, simulateApiSync, fetchSyncLog,
  computeEnrichmentSummary,
  type EnrichmentField, type SyncLogEntry, type FieldGroup, type IntegrationConnector,
} from '../data/enrichmentService';
import DataFieldBadge from '../components/enrichment/DataFieldBadge';
import EnrichmentPanel from '../components/enrichment/EnrichmentPanel';

// ─── Helpers ─────────────────────────────────────────────────

const GROUP_ICONS: Record<FieldGroup, React.ElementType> = {
  spotify:         Music2,
  tiktok:          Smartphone,
  instagram:       Camera,
  youtube:         Youtube,
  geography:       Globe,
  demographics:    Users,
  similar_artists: UserCheck,
};

const INT_STATUS_STYLE: Record<IntegrationConnector['status'], { label: string; color: string; bg: string }> = {
  connected:      { label: 'Connected',     color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
  pending_auth:   { label: 'Auth Pending',  color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
  not_connected:  { label: 'Not Connected', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
  error:          { label: 'Error',         color: '#EF4444', bg: 'rgba(239,68,68,0.1)'   },
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// ─── Integration card ────────────────────────────────────────

function IntegrationCard({
  integration, allFields, onSimulateAll, syncing,
}: {
  integration: IntegrationConnector;
  allFields: EnrichmentField[];
  onSimulateAll: (integrationId: string) => void;
  syncing: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const st = INT_STATUS_STYLE[integration.status];
  const ChevIcon = expanded ? ChevronDown : ChevronRight;
  const fieldDefs = FIELD_CATALOGUE.filter(f => integration.fields.includes(f.key));
  const liveCount    = allFields.filter(f => integration.fields.includes(f.fieldKey) && f.sourceStatus === 'live').length;
  const manualCount  = allFields.filter(f => integration.fields.includes(f.fieldKey) && f.sourceStatus === 'manual_override').length;
  const coverage     = Math.round(((liveCount + manualCount) / (fieldDefs.length * SIGNED_ARTISTS.length)) * 100) || 0;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, overflow: 'hidden', marginBottom: 10,
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'grid', gridTemplateColumns: '44px 1fr 120px 130px 120px 120px',
          gap: 12, padding: '14px 16px', alignItems: 'center',
          cursor: 'pointer', background: 'rgba(255,255,255,0.01)',
        }}
      >
        {/* Icon */}
        <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${integration.color}15`, border: `1px solid ${integration.color}28` }}>
          <Database size={15} color={integration.color} />
        </div>

        {/* Name + desc */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>{integration.label}</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{integration.description}</div>
        </div>

        {/* Status */}
        <div>
          <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, fontWeight: 700, background: st.bg, color: st.color }}>
            {st.label}
          </span>
        </div>

        {/* Coverage bar */}
        <div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 4 }}>{coverage}% coverage</div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
            <div style={{ width: `${coverage}%`, height: '100%', background: integration.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Field counts */}
        <div style={{ fontSize: 11, color: '#6B7280' }}>
          {liveCount} live · {manualCount} manual
          <div style={{ fontSize: 10, color: '#4B5563' }}>{fieldDefs.length} fields</div>
        </div>

        {/* Simulate */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={e => { e.stopPropagation(); onSimulateAll(integration.id); }}
            disabled={syncing}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 7,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              color: '#9CA3AF', fontSize: 11, fontWeight: 600, cursor: syncing ? 'wait' : 'pointer',
            }}
          >
            <RefreshCw size={10} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Running...' : 'Simulate All'}
          </button>
          <ChevIcon size={13} color="#6B7280" />
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '10px 0 8px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 11, color: '#6B7280' }}>
              <strong style={{ color: '#9CA3AF' }}>Auth type:</strong> {integration.authType.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', marginLeft: 16 }}>
              <strong style={{ color: '#9CA3AF' }}>Fields managed:</strong> {fieldDefs.length}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 6 }}>
            {fieldDefs.map(def => (
              <div key={def.key} style={{
                padding: '7px 10px', borderRadius: 7,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#D1D5DB' }}>{def.label}</div>
                <div style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>{def.expectedType}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Artist row ──────────────────────────────────────────────

function ArtistCoverageRow({
  artistId, artistName, avatarInitials, avatarColor,
  fields, onViewArtist, onSyncAll, syncing,
}: {
  artistId: string;
  artistName: string;
  avatarInitials: string;
  avatarColor: string;
  fields: EnrichmentField[];
  onViewArtist: () => void;
  onSyncAll: () => void;
  syncing: boolean;
}) {
  const summary = computeEnrichmentSummary(artistId, fields);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 180px 100px 80px 80px 80px 90px 90px',
      gap: 0, padding: '8px 16px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'center',
      transition: 'background 0.12s',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.018)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Avatar */}
      <div style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${avatarColor}20`, border: `1px solid ${avatarColor}30`, flexShrink: 0 }}>
        <span style={{ fontSize: 8, fontWeight: 700, color: avatarColor }}>{avatarInitials}</span>
      </div>

      {/* Name */}
      <div style={{ paddingLeft: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#F9FAFB' }}>{artistName}</div>
        <div style={{ fontSize: 10, color: '#6B7280' }}>{artistId}</div>
      </div>

      {/* Coverage bar */}
      <div style={{ padding: '0 8px' }}>
        <div style={{ fontSize: 10, color: summary.coveragePct >= 60 ? '#10B981' : '#F59E0B', fontWeight: 700, marginBottom: 3 }}>
          {summary.coveragePct}%
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
          <div style={{ width: `${summary.coveragePct}%`, height: '100%', background: summary.coveragePct >= 60 ? '#10B981' : '#F59E0B', borderRadius: 2 }} />
        </div>
      </div>

      {/* Live */}
      <div style={{ paddingLeft: 8 }}>
        <DataFieldBadge status="live" showDot size="sm" />
        <div style={{ fontSize: 10, color: '#10B981', marginTop: 2 }}>{summary.liveCount}</div>
      </div>

      {/* Pending */}
      <div style={{ paddingLeft: 8 }}>
        <DataFieldBadge status="pending_api" showDot size="sm" />
        <div style={{ fontSize: 10, color: '#F59E0B', marginTop: 2 }}>{summary.pendingCount}</div>
      </div>

      {/* Manual */}
      <div style={{ paddingLeft: 8 }}>
        <DataFieldBadge status="manual_override" showDot size="sm" />
        <div style={{ fontSize: 10, color: '#60A5FA', marginTop: 2 }}>{summary.manualCount}</div>
      </div>

      {/* Last sync */}
      <div style={{ fontSize: 10, color: '#6B7280', paddingLeft: 8 }}>
        {summary.lastSyncedAt ? fmtDate(summary.lastSyncedAt) : 'Never'}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
        <button
          onClick={onViewArtist}
          style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)', color: '#06B6D4',
          }}
        >
          View
        </button>
        <button
          onClick={onSyncAll}
          disabled={syncing}
          style={{
            padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <RefreshCw size={8} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          Sync
        </button>
      </div>
    </div>
  );
}

// ─── Sync log ────────────────────────────────────────────────

function SyncLogRow({ entry }: { entry: SyncLogEntry }) {
  const statusStyle = {
    success: { color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
    failed:  { color: '#EF4444', bg: 'rgba(239,68,68,0.08)'  },
    partial: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
  }[entry.status];

  const artist = SIGNED_ARTISTS.find(a => a.id === entry.artistId);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '180px 120px 80px 60px 1fr 140px',
      gap: 0, padding: '7px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'center',
    }}>
      <div style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 600 }}>{artist?.name ?? entry.artistId}</div>
      <div>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: 'rgba(255,255,255,0.04)', color: '#9CA3AF', border: '1px solid rgba(255,255,255,0.06)' }}>
          {entry.integration}
        </span>
      </div>
      <div>
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}>
          {entry.status}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace' }}>{entry.recordsUpdated}</div>
      <div style={{ fontSize: 11, color: '#6B7280' }}>{entry.errorMsg ?? '—'}</div>
      <div style={{ fontSize: 10, color: '#4B5563', textAlign: 'right' }}>{fmtDate(entry.syncedAt)}</div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────

type Tab = 'integrations' | 'coverage' | 'artist_detail' | 'sync_log';

export default function DataEnrichment() {
  const [tab, setTab]                   = useState<Tab>('integrations');
  const [allFields, setAllFields]       = useState<EnrichmentField[]>([]);
  const [syncLog, setSyncLog]           = useState<SyncLogEntry[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [syncingId, setSyncingId]       = useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [fields, log] = await Promise.all([fetchAllEnrichmentFields(), fetchSyncLog()]);
    setAllFields(fields);
    setSyncLog(log);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSimulateAll(integrationId: string) {
    setSyncingId(integrationId);
    const groups = INTEGRATIONS.find(i => i.id === integrationId);
    if (!groups) { setSyncingId(null); return; }
    const group = integrationId as FieldGroup;
    for (const artist of SIGNED_ARTISTS) {
      await simulateApiSync(artist.id, group);
    }
    await load();
    setSyncingId(null);
  }

  async function handleSyncArtist(artistId: string) {
    setSyncingId(`artist-${artistId}`);
    for (const integration of INTEGRATIONS) {
      const group = integration.id as FieldGroup;
      await simulateApiSync(artistId, group);
    }
    await load();
    setSyncingId(null);
  }

  const filteredArtists = useMemo(() =>
    SIGNED_ARTISTS.filter(a => a.name.toLowerCase().includes(search.toLowerCase())),
  [search]);

  const globalStats = useMemo(() => {
    const liveCount   = allFields.filter(f => f.sourceStatus === 'live').length;
    const manualCount = allFields.filter(f => f.sourceStatus === 'manual_override').length;
    const total       = FIELD_CATALOGUE.length * SIGNED_ARTISTS.length;
    return {
      liveCount,
      manualCount,
      pendingCount: total - liveCount - manualCount,
      coverage:     Math.round(((liveCount + manualCount) / total) * 100) || 0,
      total,
    };
  }, [allFields]);

  const selectedArtist = SIGNED_ARTISTS.find(a => a.id === selectedArtistId);

  const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'integrations',  label: 'Integrations',   icon: Zap        },
    { key: 'coverage',      label: 'Artist Coverage', icon: BarChart3  },
    { key: 'sync_log',      label: 'Sync Log',        icon: RefreshCw  },
  ];

  return (
    <div style={{ padding: '28px', minHeight: '100vh', background: '#08090B', color: '#F9FAFB', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, color: '#10B981', fontWeight: 700, textTransform: 'uppercase' }}>Admin · Data Systems</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>External Data Enrichment</h1>
        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          Manage API integrations · Monitor data coverage · Set manual overrides
        </p>
      </div>

      {/* Global stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total Fields',      value: globalStats.total,        color: '#9CA3AF' },
          { label: 'Live',              value: globalStats.liveCount,    color: '#10B981' },
          { label: 'Manual Overrides',  value: globalStats.manualCount,  color: '#3B82F6' },
          { label: 'Pending API',       value: globalStats.pendingCount, color: '#F59E0B' },
          { label: 'Global Coverage',   value: `${globalStats.coverage}%`, color: globalStats.coverage >= 60 ? '#10B981' : '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.key || (tab === 'artist_detail' && t.key === 'coverage');
          return (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); if (t.key === 'coverage') setSelectedArtistId(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 16px', background: 'none', border: 'none',
                borderBottom: active ? '2px solid #10B981' : '2px solid transparent',
                color: active ? '#10B981' : '#6B7280',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                marginBottom: -1, transition: 'all 0.15s',
              }}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 12 }}>
          <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Loading enrichment data...
        </div>
      )}

      {/* Integrations tab */}
      {!loading && tab === 'integrations' && (
        <div>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280' }}>
              {INTEGRATIONS.length} integrations configured · "Simulate Sync" populates mock data for all artists
            </div>
          </div>
          {INTEGRATIONS.map(int => (
            <IntegrationCard
              key={int.id}
              integration={int}
              allFields={allFields}
              onSimulateAll={handleSimulateAll}
              syncing={syncingId === int.id}
            />
          ))}
        </div>
      )}

      {/* Artist coverage tab */}
      {!loading && tab === 'coverage' && !selectedArtistId && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 12px', flex: '0 0 220px' }}>
              <Search size={12} color="#6B7280" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search artists..."
                style={{ background: 'none', border: 'none', outline: 'none', color: '#F9FAFB', fontSize: 12 }}
              />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
            {/* Column headers */}
            <div style={{
              display: 'grid', gridTemplateColumns: '32px 180px 100px 80px 80px 80px 90px 90px',
              gap: 0, padding: '9px 16px',
              background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              {['', 'Artist', 'Coverage', 'Live', 'Pending', 'Manual', 'Last Sync', 'Actions'].map((h, i) => (
                <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: 1, paddingLeft: i > 0 ? 8 : 0 }}>{h}</div>
              ))}
            </div>

            {filteredArtists.map(a => (
              <ArtistCoverageRow
                key={a.id}
                artistId={a.id}
                artistName={a.name}
                avatarInitials={a.avatarInitials}
                avatarColor={a.avatarColor}
                fields={allFields.filter(f => f.artistId === a.id)}
                onViewArtist={() => { setSelectedArtistId(a.id); setTab('artist_detail'); }}
                onSyncAll={() => handleSyncArtist(a.id)}
                syncing={syncingId === `artist-${a.id}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Artist detail view */}
      {!loading && tab === 'artist_detail' && selectedArtist && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => { setTab('coverage'); setSelectedArtistId(null); }}
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 7, padding: '5px 12px', color: '#9CA3AF', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              ← Back to Coverage
            </button>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${selectedArtist.avatarColor}20`, border: `1px solid ${selectedArtist.avatarColor}30` }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: selectedArtist.avatarColor }}>{selectedArtist.avatarInitials}</span>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB' }}>{selectedArtist.name}</div>
              <div style={{ fontSize: 11, color: '#6B7280' }}>{selectedArtist.id} · {selectedArtist.genre}</div>
            </div>
          </div>
          <EnrichmentPanel artist={selectedArtist} />
        </div>
      )}

      {/* Sync log tab */}
      {!loading && tab === 'sync_log' && (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '180px 120px 80px 60px 1fr 140px',
            gap: 0, padding: '9px 16px',
            background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['Artist', 'Integration', 'Status', 'Records', 'Error', 'Synced At'].map((h, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</div>
            ))}
          </div>

          {syncLog.length === 0 && (
            <div style={{ padding: '32px 0', textAlign: 'center', color: '#4B5563', fontSize: 12 }}>
              No sync events yet. Use "Simulate Sync" to generate log entries.
            </div>
          )}
          {syncLog.map(entry => <SyncLogRow key={entry.id} entry={entry} />)}

          <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: '#4B5563' }}>
            Showing {syncLog.length} most recent events
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
