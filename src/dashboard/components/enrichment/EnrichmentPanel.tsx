// ============================================================
// EnrichmentPanel — per-artist enrichment data view
// Shows all integration fields grouped by category with
// live/pending/manual status, values, and override controls.
// ============================================================

import { useState, useEffect } from 'react';
import {
  Music2, Smartphone, Camera, Youtube, Globe, Users, UserCheck,
  RefreshCw, Pencil, X, Check, ChevronDown, ChevronRight,
  Loader, Zap,
} from 'lucide-react';
import DataFieldBadge from './DataFieldBadge';
import {
  FIELD_CATALOGUE,
  INTEGRATIONS,
  fetchEnrichmentFields,
  setManualOverride,
  clearManualOverride,
  simulateApiSync,
  type EnrichmentField,
  type FieldGroup,
  type FieldDefinition,
} from '../../data/enrichmentService';
import type { SignedArtist } from '../../data/artistRosterData';

// ─── Group config ────────────────────────────────────────────

const GROUP_META: Record<FieldGroup, { label: string; icon: React.ElementType; color: string }> = {
  spotify:         { label: 'Spotify',         icon: Music2,     color: '#1DB954' },
  tiktok:          { label: 'TikTok',           icon: Smartphone, color: '#FE2C55' },
  instagram:       { label: 'Instagram',        icon: Camera,     color: '#E1306C' },
  youtube:         { label: 'YouTube',          icon: Youtube,    color: '#FF0000' },
  geography:       { label: 'Fan Geography',    icon: Globe,      color: '#06B6D4' },
  demographics:    { label: 'Demographics',     icon: Users,      color: '#F59E0B' },
  similar_artists: { label: 'Similar / Collabs',icon: UserCheck,  color: '#10B981' },
};

const GROUPS: FieldGroup[] = ['spotify', 'tiktok', 'instagram', 'youtube', 'geography', 'demographics', 'similar_artists'];

// ─── Helpers ─────────────────────────────────────────────────

function fmtValue(val: string | null, def: FieldDefinition): string {
  if (!val) return '—';
  if (def.expectedType === 'number') {
    const n = parseFloat(val);
    if (isNaN(n)) return val;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  }
  if (def.expectedType === 'percent') return `${parseFloat(val).toFixed(1)}%`;
  if (def.expectedType === 'json')    return '[JSON object]';
  return val;
}

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// ─── Single field row ────────────────────────────────────────

function FieldRow({
  def, field, artistId, onUpdated,
}: {
  def: FieldDefinition;
  field: EnrichmentField | undefined;
  artistId: string;
  onUpdated: () => void;
}) {
  const [editing, setEditing]   = useState(false);
  const [draft, setDraft]       = useState('');
  const [saving, setSaving]     = useState(false);

  const status   = field?.sourceStatus ?? 'pending_api';
  const rawValue = field ? (field.sourceStatus === 'manual_override' ? field.manualValue : field.rawValue) : null;

  async function save() {
    if (!draft.trim()) return;
    setSaving(true);
    await setManualOverride(artistId, def.key, draft.trim(), 'Admin');
    setSaving(false);
    setEditing(false);
    onUpdated();
  }

  async function clear() {
    setSaving(true);
    await clearManualOverride(artistId, def.key);
    setSaving(false);
    onUpdated();
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 100px 120px 120px 90px',
      gap: 0,
      padding: '7px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      alignItems: 'center',
    }}>
      {/* Label */}
      <div style={{ paddingRight: 12 }}>
        <div style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 600 }}>{def.label}</div>
        <div style={{ fontSize: 10, color: '#6B7280', marginTop: 1 }}>{def.apiSource}</div>
      </div>

      {/* Status badge */}
      <div>
        <DataFieldBadge status={status} showDot size="sm" />
      </div>

      {/* Value */}
      <div>
        {editing ? (
          <div style={{ display: 'flex', gap: 4 }}>
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
              style={{
                flex: 1, minWidth: 0, padding: '3px 7px',
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                borderRadius: 6, color: '#F9FAFB', fontSize: 11, outline: 'none',
              }}
            />
            <button onClick={save} disabled={saving} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#10B981', padding: 2 }}>
              {saving ? <Loader size={11} /> : <Check size={11} />}
            </button>
            <button onClick={() => setEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 2 }}>
              <X size={11} />
            </button>
          </div>
        ) : (
          <span style={{
            fontSize: 12,
            color: rawValue ? (status === 'live' ? '#10B981' : status === 'manual_override' ? '#60A5FA' : '#9CA3AF') : '#4B5563',
            fontFamily: def.expectedType === 'number' || def.expectedType === 'percent' ? 'monospace' : 'inherit',
          }}>
            {fmtValue(rawValue, def)}
          </span>
        )}
      </div>

      {/* Last synced */}
      <div style={{ fontSize: 10, color: '#6B7280' }}>
        {status === 'manual_override' && field?.manualSetAt
          ? <>Override {fmtDate(field.manualSetAt)}</>
          : field?.lastSyncedAt
          ? fmtDate(field.lastSyncedAt)
          : '—'}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
        {!editing && (
          <button
            onClick={() => { setDraft(rawValue ?? ''); setEditing(true); }}
            title="Set manual override"
            style={{
              width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)',
              cursor: 'pointer',
            }}
          >
            <Pencil size={9} color="#60A5FA" />
          </button>
        )}
        {status === 'manual_override' && !editing && (
          <button
            onClick={clear}
            title="Clear override, return to API"
            style={{
              width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)',
              cursor: 'pointer',
            }}
          >
            <X size={9} color="#F87171" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Group section ───────────────────────────────────────────

function GroupSection({
  group, fields, enrichmentFields, artistId, onUpdated, syncing, onSync,
}: {
  group: FieldGroup;
  fields: FieldDefinition[];
  enrichmentFields: EnrichmentField[];
  artistId: string;
  onUpdated: () => void;
  syncing: boolean;
  onSync: () => void;
}) {
  const [open, setOpen] = useState(true);
  const meta = GROUP_META[group];
  const Icon = meta.icon;
  const fieldMap = enrichmentFields.reduce<Record<string, EnrichmentField>>((m, f) => { m[f.fieldKey] = f; return m; }, {});
  const liveCount    = fields.filter(f => fieldMap[f.key]?.sourceStatus === 'live').length;
  const manualCount  = fields.filter(f => fieldMap[f.key]?.sourceStatus === 'manual_override').length;
  const pendingCount = fields.length - liveCount - manualCount;
  const integration  = INTEGRATIONS.find(i => i.id === group);
  const ChevIcon = open ? ChevronDown : ChevronRight;

  return (
    <div style={{
      background: 'rgba(255,255,255,0.015)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 10,
    }}>
      {/* Group header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', cursor: 'pointer',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: open ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${meta.color}14`, border: `1px solid ${meta.color}28`, flexShrink: 0 }}>
          <Icon size={13} color={meta.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>{meta.label}</span>
            {integration && (
              <span style={{
                fontSize: 9, padding: '1px 6px', borderRadius: 10,
                background: integration.status === 'pending_auth' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${integration.status === 'pending_auth' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                color: integration.status === 'pending_auth' ? '#F59E0B' : '#10B981',
                fontWeight: 700,
              }}>
                {integration.status === 'pending_auth' ? 'Auth Pending' : integration.status === 'connected' ? 'Connected' : 'Not Connected'}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 3 }}>
            <span style={{ fontSize: 10, color: '#10B981' }}>{liveCount} live</span>
            <span style={{ fontSize: 10, color: '#F59E0B' }}>{pendingCount} pending</span>
            {manualCount > 0 && <span style={{ fontSize: 10, color: '#60A5FA' }}>{manualCount} override</span>}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onSync(); }}
          disabled={syncing}
          title="Simulate API sync"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 6,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
            color: '#9CA3AF', fontSize: 10, fontWeight: 600, cursor: syncing ? 'wait' : 'pointer',
          }}
        >
          <RefreshCw size={9} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
          {syncing ? 'Syncing...' : 'Simulate Sync'}
        </button>
        <ChevIcon size={13} color="#6B7280" />
      </div>

      {/* Field rows */}
      {open && (
        <div style={{ padding: '4px 14px 8px' }}>
          {/* Column headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 120px 120px 90px',
            gap: 0, padding: '6px 0 4px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: 2,
          }}>
            {['Field', 'Status', 'Value', 'Last Synced', ''].map((h, i) => (
              <div key={i} style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', letterSpacing: 1 }}>{h}</div>
            ))}
          </div>

          {fields.map(def => (
            <FieldRow
              key={def.key}
              def={def}
              field={fieldMap[def.key]}
              artistId={artistId}
              onUpdated={onUpdated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────

interface Props {
  artist: SignedArtist;
}

export default function EnrichmentPanel({ artist }: Props) {
  const [enrichmentFields, setEnrichmentFields] = useState<EnrichmentField[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingGroup, setSyncingGroup] = useState<FieldGroup | null>(null);
  const [activeGroup, setActiveGroup] = useState<FieldGroup | 'all'>('all');

  async function load() {
    setLoading(true);
    const data = await fetchEnrichmentFields(artist.id);
    setEnrichmentFields(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, [artist.id]);

  async function handleSync(group: FieldGroup) {
    setSyncingGroup(group);
    await simulateApiSync(artist.id, group);
    await load();
    setSyncingGroup(null);
  }

  const fieldMap = enrichmentFields.reduce<Record<string, EnrichmentField>>((m, f) => { m[f.fieldKey] = f; return m; }, {});
  const liveTotal    = enrichmentFields.filter(f => f.sourceStatus === 'live').length;
  const manualTotal  = enrichmentFields.filter(f => f.sourceStatus === 'manual_override').length;
  const pendingTotal = FIELD_CATALOGUE.length - liveTotal - manualTotal;
  const coverage     = Math.round(((liveTotal + manualTotal) / FIELD_CATALOGUE.length) * 100);

  const lastSync = enrichmentFields
    .map(f => f.lastSyncedAt)
    .filter((d): d is string => d !== null)
    .sort().reverse()[0] ?? null;

  const visibleGroups = activeGroup === 'all' ? GROUPS : [activeGroup];

  return (
    <div>
      {/* Coverage summary */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          flex: 1, minWidth: 240, padding: '12px 16px',
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            <svg viewBox="0 0 48 48" style={{ width: 48, height: 48, transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle
                cx="24" cy="24" r="20" fill="none"
                stroke={coverage >= 70 ? '#10B981' : coverage >= 40 ? '#F59E0B' : '#EF4444'}
                strokeWidth="4"
                strokeDasharray={`${(coverage / 100) * 125.7} 125.7`}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#F9FAFB' }}>{coverage}%</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F9FAFB' }}>Data Coverage</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
              {liveTotal} live · {manualTotal} manual · {pendingTotal} pending
            </div>
            {lastSync && <div style={{ fontSize: 10, color: '#4B5563', marginTop: 1 }}>Last sync: {new Date(lastSync).toLocaleString()}</div>}
          </div>
        </div>

        {/* Stats chips */}
        {[
          { label: 'Live Fields',       value: liveTotal,    color: '#10B981' },
          { label: 'Manual Overrides',  value: manualTotal,  color: '#3B82F6' },
          { label: 'Pending API',       value: pendingTotal, color: '#F59E0B' },
          { label: 'Total Fields',      value: FIELD_CATALOGUE.length, color: '#9CA3AF' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10,
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Group filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {(['all', ...GROUPS] as const).map(g => {
          const meta = g === 'all' ? null : GROUP_META[g];
          const Icon = meta?.icon;
          const active = activeGroup === g;
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 12px', borderRadius: 20,
                background: active ? (meta ? `${meta.color}15` : 'rgba(255,255,255,0.06)') : 'transparent',
                border: `1px solid ${active ? (meta ? `${meta.color}35` : 'rgba(255,255,255,0.12)') : 'rgba(255,255,255,0.05)'}`,
                color: active ? (meta?.color ?? '#F9FAFB') : '#6B7280',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {Icon && <Icon size={10} />}
              {g === 'all' ? 'All Groups' : GROUP_META[g].label}
            </button>
          );
        })}
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '24px 0', color: '#6B7280', fontSize: 12 }}>
          <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Loading enrichment data...
        </div>
      )}

      {/* Groups */}
      {!loading && visibleGroups.map(group => {
        const fields = FIELD_CATALOGUE.filter(f => f.group === group);
        return (
          <GroupSection
            key={group}
            group={group}
            fields={fields}
            enrichmentFields={enrichmentFields.filter(f => f.fieldGroup === group)}
            artistId={artist.id}
            onUpdated={load}
            syncing={syncingGroup === group}
            onSync={() => handleSync(group)}
          />
        );
      })}

      <div style={{
        marginTop: 12, padding: '10px 14px',
        background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)',
        borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Zap size={13} color="#10B981" style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
          <strong style={{ color: '#10B981' }}>Integration note:</strong> Live data auto-refreshes when connected APIs push updates.
          Manual overrides take precedence over API values and are preserved across syncs.
          Use "Simulate Sync" to test the data flow before connecting live credentials.
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
