import { useState } from 'react';
import { Music, Disc, Album, Calendar, Flag, ChevronRight, Filter, Rocket, Clock } from 'lucide-react';
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

export default function COSFutures() {
  const { activeClient } = useCatalogClient();
  const accent = activeClient?.accent_color ?? '#10B981';
  const clientId = activeClient?.id ?? '';

  const [formatFilter, setFormatFilter] = useState<Format | 'all'>('all');

  const releases = ALL_RELEASES.filter(r => {
    if (r.client_id !== clientId) return false;
    if (formatFilter !== 'all' && r.format !== formatFilter) return false;
    return true;
  });

  const counts = {
    single: ALL_RELEASES.filter(r => r.client_id === clientId && r.format === 'single').length,
    ep:     ALL_RELEASES.filter(r => r.client_id === clientId && r.format === 'ep').length,
    album:  ALL_RELEASES.filter(r => r.client_id === clientId && r.format === 'album').length,
  };

  return (
    <div className="min-h-screen bg-[#07080A]">
      <CatalogPageHeader
        icon={Rocket}
        title="Futures"
        subtitle="Planned release schedule · upcoming music pipeline"
        accentColor={accent}
        badge="PIPELINE"
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

        {/* Format filter */}
        <div className="flex items-center gap-2 mb-5">
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
            <p className="text-white/20 text-[11px] mt-1">Switch clients or adjust the format filter.</p>
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
    </div>
  );
}
