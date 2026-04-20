import { useState, useRef, useEffect } from 'react';
import { Music, Disc, Album, Calendar, ChevronRight, Filter, Rocket, Clock, Plus, X } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { useCatalogClient } from '../../context/CatalogClientContext';

type Format = 'single' | 'ep' | 'album';
type Stage = 'concept' | 'recording' | 'mixing' | 'mastering' | 'delivery' | 'scheduled' | 'released';
type Status = 'on_track' | 'at_risk' | 'delayed' | 'confirmed' | 'tentative';
type Priority = 'critical' | 'high' | 'medium' | 'low';

interface FutureRelease {
  id: string;
  client_id: string;
  artist: string;
  title: string;
  format: Format;
  target_date: string;
  stage: Stage;
  status: Status;
  priority: Priority;
  notes: string;
}

const FORMAT_META: Record<Format, { label: string; icon: typeof Music; color: string }> = {
  single: { label: 'Single', icon: Music,   color: '#10B981' },
  ep:     { label: 'EP',     icon: Disc,    color: '#06B6D4' },
  album:  { label: 'Album',  icon: Album,   color: '#F59E0B' },
};

const STAGE_META: Record<Stage, { label: string; color: string; pct: number }> = {
  concept:   { label: 'Concept',   color: '#6B7280', pct: 10 },
  recording: { label: 'Recording', color: '#3B82F6', pct: 30 },
  mixing:    { label: 'Mixing',    color: '#8B5CF6', pct: 55 },
  mastering: { label: 'Mastering', color: '#F59E0B', pct: 75 },
  delivery:  { label: 'Delivery',  color: '#06B6D4', pct: 88 },
  scheduled: { label: 'Scheduled', color: '#10B981', pct: 96 },
  released:  { label: 'Released',  color: '#A3E635', pct: 100 },
};

const STATUS_META: Record<Status, { label: string; color: string }> = {
  on_track:  { label: 'On Track',  color: '#10B981' },
  at_risk:   { label: 'At Risk',   color: '#F59E0B' },
  delayed:   { label: 'Delayed',   color: '#EF4444' },
  confirmed: { label: 'Confirmed', color: '#06B6D4' },
  tentative: { label: 'Tentative', color: '#6B7280' },
};

const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  critical: { label: 'Critical', color: '#EF4444' },
  high:     { label: 'High',     color: '#F59E0B' },
  medium:   { label: 'Medium',   color: '#06B6D4' },
  low:      { label: 'Low',      color: '#6B7280' },
};

// All future release data keyed by client_id
const ALL_RELEASES: FutureRelease[] = [
  // Bassnectar
  {
    id: 'bn-01',
    client_id: 'a1000000-0000-0000-0000-000000000001',
    artist: 'Bassnectar',
    title: 'Untitled Archival Single',
    format: 'single',
    target_date: 'Jun 2026',
    stage: 'mastering',
    status: 'on_track',
    priority: 'high',
    notes: 'Previously unreleased archival recording. Fan community seeding planned via ZFM first.',
  },
  {
    id: 'bn-02',
    client_id: 'a1000000-0000-0000-0000-000000000001',
    artist: 'Bassnectar',
    title: 'ZFM Exclusive Vault EP',
    format: 'ep',
    target_date: 'Aug 2026',
    stage: 'mixing',
    status: 'confirmed',
    priority: 'critical',
    notes: 'Direct-fan-first release via ZFM platform. 4–6 tracks from vault sessions 2015–2018. DSP window 90 days later.',
  },
  {
    id: 'bn-03',
    client_id: 'a1000000-0000-0000-0000-000000000001',
    artist: 'Bassnectar',
    title: 'Divergent Spectrum (Expanded Edition)',
    format: 'album',
    target_date: 'Q4 2026',
    stage: 'concept',
    status: 'tentative',
    priority: 'medium',
    notes: 'Anniversary reissue with bonus content. Pending artist approval. Sync pitch window opens post-announcement.',
  },
  {
    id: 'bn-04',
    client_id: 'a1000000-0000-0000-0000-000000000001',
    artist: 'Bassnectar',
    title: 'Live Return Pre-Release Single',
    format: 'single',
    target_date: 'Oct 2026',
    stage: 'recording',
    status: 'tentative',
    priority: 'high',
    notes: 'Tied to live return announcement. Timing locked to venue confirmation. PR coordination required.',
  },

  // Santigold
  {
    id: 'sg-01',
    client_id: 'a2000000-0000-0000-0000-000000000002',
    artist: 'Santigold',
    title: 'Brave Signal',
    format: 'single',
    target_date: 'May 2026',
    stage: 'delivery',
    status: 'confirmed',
    priority: 'critical',
    notes: 'Lead single for upcoming LP campaign. Radio servicing and editorial pitching confirmed. Video shoot wrapped.',
  },
  {
    id: 'sg-02',
    client_id: 'a2000000-0000-0000-0000-000000000002',
    artist: 'Santigold',
    title: 'Bright Machines EP',
    format: 'ep',
    target_date: 'Jul 2026',
    stage: 'mastering',
    status: 'on_track',
    priority: 'high',
    notes: 'Bridge release between singles and LP. 5 tracks. Physical vinyl edition planned. Sync submissions queued.',
  },
  {
    id: 'sg-03',
    client_id: 'a2000000-0000-0000-0000-000000000002',
    artist: 'Santigold',
    title: 'Untitled Studio Album 5',
    format: 'album',
    target_date: 'Q4 2026',
    stage: 'recording',
    status: 'on_track',
    priority: 'critical',
    notes: '5th studio album. 12 confirmed tracks. Production with external collaborators ongoing. Label discussions in Q3.',
  },
  {
    id: 'sg-04',
    client_id: 'a2000000-0000-0000-0000-000000000002',
    artist: 'Santigold',
    title: 'Creator Series Collab Single',
    format: 'single',
    target_date: 'Sep 2026',
    stage: 'concept',
    status: 'tentative',
    priority: 'medium',
    notes: 'Brand partnership collab single. Partner not yet announced. Budget approved, legal in progress.',
  },

  // Placeholder Artist 03
  {
    id: 'pa-01',
    client_id: 'a3000000-0000-0000-0000-000000000003',
    artist: 'Placeholder Artist 03',
    title: '[Catalog Single TBD]',
    format: 'single',
    target_date: 'Q3 2026',
    stage: 'concept',
    status: 'tentative',
    priority: 'low',
    notes: 'First release under GMG management. Catalog intake still in progress. Target window subject to rights clearance.',
  },
  {
    id: 'pa-02',
    client_id: 'a3000000-0000-0000-0000-000000000003',
    artist: 'Placeholder Artist 03',
    title: '[Back Catalog Reissue EP]',
    format: 'ep',
    target_date: 'Q4 2026',
    stage: 'concept',
    status: 'at_risk',
    priority: 'medium',
    notes: 'Rights clearance in review. Distributor migration pending. Onboarding must complete before scheduling.',
  },
];

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-[8.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide shrink-0"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}
    >
      {label}
    </span>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

function ReleaseRow({ release, accent }: { release: FutureRelease; accent: string }) {
  const fmt = FORMAT_META[release.format];
  const stage = STAGE_META[release.stage];
  const status = STATUS_META[release.status];
  const priority = PRIORITY_META[release.priority];
  const FormatIcon = fmt.icon;

  return (
    <div className="group bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.10] hover:bg-[#0D0F14] transition-all">
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${fmt.color}14`, border: `1px solid ${fmt.color}22` }}
        >
          <FormatIcon className="w-4 h-4" style={{ color: fmt.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-white/80 truncate group-hover:text-white/95 transition-colors">
                {release.title}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">{release.artist}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
              <PillBadge label={fmt.label} color={fmt.color} />
              <PillBadge label={priority.label} color={priority.color} />
              <PillBadge label={status.label} color={status.color} />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-2.5">
            <div className="flex items-center gap-1.5 text-[10px] text-white/35">
              <Calendar className="w-3 h-3" />
              <span>{release.target_date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px]" style={{ color: stage.color }}>
              <Clock className="w-3 h-3" />
              <span>{stage.label}</span>
            </div>
          </div>

          <div className="mb-2">
            <ProgressBar pct={stage.pct} color={stage.color} />
          </div>

          {release.notes && (
            <p className="text-[10.5px] text-white/30 leading-relaxed mt-1.5">{release.notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const FORMAT_FILTERS: Array<{ value: Format | 'all'; label: string }> = [
  { value: 'all',    label: 'All' },
  { value: 'single', label: 'Singles' },
  { value: 'ep',     label: 'EPs' },
  { value: 'album',  label: 'Albums' },
];

// ── Add Release modal ─────────────────────────────────────────────────────────

interface AddReleaseForm {
  title: string;
  format: Format;
  target_date: string;
  stage: Stage;
  status: Status;
  priority: Priority;
  notes: string;
}

const BLANK_FORM: AddReleaseForm = {
  title: '', format: 'single', target_date: '',
  stage: 'concept', status: 'tentative', priority: 'medium', notes: '',
};

function AddReleaseModal({
  onClose,
  onAdd,
  accent,
  artistName,
}: {
  onClose: () => void;
  onAdd: (r: FutureRelease) => void;
  accent: string;
  artistName: string;
}) {
  const [form, setForm] = useState<AddReleaseForm>(BLANK_FORM);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  function set<K extends keyof AddReleaseForm>(key: K, val: AddReleaseForm[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      id: `new-${Date.now()}`,
      client_id: '__new__',
      artist: artistName,
      title: form.title.trim(),
      format: form.format,
      target_date: form.target_date || 'TBD',
      stage: form.stage,
      status: form.status,
      priority: form.priority,
      notes: form.notes.trim(),
    });
    onClose();
  }

  const labelStyle: React.CSSProperties = { fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 5 };
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 8, padding: '7px 10px', fontSize: 12, color: '#F9FAFB', outline: 'none',
    boxSizing: 'border-box' as const,
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 800,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 480, background: '#10121A',
        border: '1px solid rgba(255,255,255,0.09)', borderRadius: 18,
        padding: '22px 24px', boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
        animation: 'fadeUp 0.16s ease-out',
      }}>
        <style>{`@keyframes fadeUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}18`, border: `1px solid ${accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={13} color={accent} />
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: '#F9FAFB', margin: 0 }}>Add Planned Release</h2>
            </div>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 4, marginLeft: 36 }}>{artistName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Release Title *</label>
            <input required style={inputStyle} placeholder="e.g. Untitled Single" value={form.title} onChange={e => set('title', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Format</label>
              <select style={selectStyle} value={form.format} onChange={e => set('format', e.target.value as Format)}>
                <option value="single">Single</option>
                <option value="ep">EP</option>
                <option value="album">Album</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Target Date</label>
              <input style={inputStyle} placeholder="e.g. Q3 2026" value={form.target_date} onChange={e => set('target_date', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Stage</label>
              <select style={selectStyle} value={form.stage} onChange={e => set('stage', e.target.value as Stage)}>
                {(Object.keys(STAGE_META) as Stage[]).map(s => <option key={s} value={s}>{STAGE_META[s].label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={selectStyle} value={form.status} onChange={e => set('status', e.target.value as Status)}>
                {(Object.keys(STATUS_META) as Status[]).map(s => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={selectStyle} value={form.priority} onChange={e => set('priority', e.target.value as Priority)}>
                {(Object.keys(PRIORITY_META) as Priority[]).map(p => <option key={p} value={p}>{PRIORITY_META[p].label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' as const }}
              placeholder="Optional planning notes..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button
              type="submit"
              style={{
                flex: 1, padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                background: `${accent}18`, border: `1px solid ${accent}30`,
                color: accent, fontSize: 12, fontWeight: 700,
              }}
            >
              Add Release
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function COSFutures() {
  const { activeClient } = useCatalogClient();
  const accent = activeClient?.accent_color ?? '#10B981';
  const clientId = activeClient?.id ?? '';
  const artistName = activeClient?.name ?? 'Artist';

  const [formatFilter, setFormatFilter] = useState<Format | 'all'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [localReleases, setLocalReleases] = useState<FutureRelease[]>([]);

  const allReleases = [...ALL_RELEASES, ...localReleases];

  const releases = allReleases.filter(r => {
    const matchClient = r.client_id === clientId || r.client_id === '__new__';
    if (!matchClient) return false;
    if (formatFilter !== 'all' && r.format !== formatFilter) return false;
    return true;
  });

  const counts = {
    single: allReleases.filter(r => (r.client_id === clientId || r.client_id === '__new__') && r.format === 'single').length,
    ep:     allReleases.filter(r => (r.client_id === clientId || r.client_id === '__new__') && r.format === 'ep').length,
    album:  allReleases.filter(r => (r.client_id === clientId || r.client_id === '__new__') && r.format === 'album').length,
  };

  function handleAdd(r: FutureRelease) {
    setLocalReleases(prev => [...prev, r]);
  }

  const addButton = (
    <button
      onClick={() => setAddOpen(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}
    >
      <Plus className="w-3.5 h-3.5" />
      Add Release
    </button>
  );

  return (
    <div className="min-h-screen bg-[#07080A]">
      <CatalogPageHeader
        icon={Rocket}
        title="Futures"
        subtitle="Planned release schedule · upcoming music pipeline"
        accentColor={accent}
        badge="PIPELINE"
        actions={addButton}
      />

      <div className="px-6 pt-5 pb-8">
        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['single', 'ep', 'album'] as Format[]).map(f => {
            const m = FORMAT_META[f];
            const Icon = m.icon;
            return (
              <div
                key={f}
                className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${m.color}14`, border: `1px solid ${m.color}22` }}
                >
                  <Icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <div>
                  <p className="text-[20px] font-bold text-white leading-none">{counts[f]}</p>
                  <p className="text-[9px] font-mono text-white/30 mt-0.5 uppercase tracking-wide">{m.label}s</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter + Add */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-white/25 shrink-0" />
            <div className="flex items-center gap-1.5">
              {FORMAT_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFormatFilter(f.value as Format | 'all')}
                  className="px-3 py-1 rounded-lg text-[11px] font-medium transition-all"
                  style={
                    formatFilter === f.value
                      ? { background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }
                      : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: `${accent}14`, border: `1px solid ${accent}28`, color: accent }}
          >
            <Plus className="w-3 h-3" />
            Add Release
          </button>
        </div>

        {/* Release list */}
        {releases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${accent}12`, border: `1px solid ${accent}20` }}
            >
              <Rocket className="w-5 h-5" style={{ color: accent }} />
            </div>
            <p className="text-white/40 text-[13px]">No releases planned yet for this filter.</p>
            <button
              onClick={() => setAddOpen(true)}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
              style={{ background: `${accent}18`, border: `1px solid ${accent}30`, color: accent }}
            >
              <Plus className="w-3.5 h-3.5" /> Add First Release
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {releases.map(r => (
              <ReleaseRow key={r.id} release={r} accent={accent} />
            ))}
          </div>
        )}

        {/* Stage legend */}
        <div className="mt-8 pt-5 border-t border-white/[0.05]">
          <p className="text-[8.5px] font-mono text-white/15 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ChevronRight className="w-3 h-3" /> Rollout stages
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(STAGE_META) as [Stage, typeof STAGE_META[Stage]][]).map(([, m]) => (
              <div key={m.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                <span className="text-[9px] text-white/30">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {addOpen && (
        <AddReleaseModal
          onClose={() => setAddOpen(false)}
          onAdd={handleAdd}
          accent={accent}
          artistName={artistName}
        />
      )}
    </div>
  );
}
