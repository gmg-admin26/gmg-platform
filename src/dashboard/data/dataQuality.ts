// ============================================================
// Artist OS — Data Quality Engine
// Computes per-artist data quality scores, identifies missing
// fields, flags Nebula-dependent fields, and generates an
// audit report across the entire roster.
// ============================================================

import { SIGNED_ARTISTS } from './artistRosterData';
import type { DataFieldGroup, DataFieldStatus } from './schema';

// ─── Field definitions ──────────────────────────────────────

export interface FieldSpec {
  key: string;
  label: string;
  group: DataFieldGroup;
  weight: number;
  nebulaSource: boolean;
  required: boolean;
}

export const FIELD_SPECS: FieldSpec[] = [
  // Identity (weight total: 20)
  { key: 'name',          label: 'Artist Name',      group: 'identity',  weight: 5,  nebulaSource: false, required: true  },
  { key: 'tier',          label: 'Roster Tier',       group: 'identity',  weight: 3,  nebulaSource: false, required: true  },
  { key: 'status',        label: 'Roster Status',     group: 'identity',  weight: 3,  nebulaSource: false, required: true  },
  { key: 'genre',         label: 'Genre',             group: 'identity',  weight: 3,  nebulaSource: false, required: true  },
  { key: 'city',          label: 'City / Market',     group: 'identity',  weight: 3,  nebulaSource: false, required: false },
  { key: 'signingDate',   label: 'Signing Date',      group: 'identity',  weight: 3,  nebulaSource: false, required: false },

  // Streaming (weight total: 25) — all Nebula-sourced
  { key: 'monthlyListeners',  label: 'Monthly Listeners',   group: 'streaming', weight: 7,  nebulaSource: true,  required: true  },
  { key: 'totalStreams',       label: 'Total Streams',        group: 'streaming', weight: 6,  nebulaSource: true,  required: true  },
  { key: 'spotifyLink',        label: 'Spotify Artist Link',  group: 'streaming', weight: 4,  nebulaSource: false, required: false },
  { key: 'spotifyFollowers',   label: 'Spotify Followers',    group: 'streaming', weight: 4,  nebulaSource: true,  required: false },
  { key: 'healthScore',        label: 'Health Score',         group: 'streaming', weight: 4,  nebulaSource: true,  required: false },

  // Social (weight total: 20)
  { key: 'instagramLink',      label: 'Instagram Link',       group: 'social',    weight: 5,  nebulaSource: false, required: false },
  { key: 'instagramFollowers', label: 'Instagram Followers',  group: 'social',    weight: 4,  nebulaSource: true,  required: false },
  { key: 'tiktokLink',         label: 'TikTok Link',          group: 'social',    weight: 4,  nebulaSource: false, required: false },
  { key: 'youtubeLink',        label: 'YouTube Link',         group: 'social',    weight: 4,  nebulaSource: false, required: false },
  { key: 'youtubeFollowers',   label: 'YouTube Followers',    group: 'social',    weight: 3,  nebulaSource: true,  required: false },

  // Contact (weight total: 20)
  { key: 'primaryEmail',       label: 'Primary Email',        group: 'contact',   weight: 6,  nebulaSource: false, required: true  },
  { key: 'manager',            label: 'Manager Name',         group: 'contact',   weight: 5,  nebulaSource: false, required: false },
  { key: 'managementContact',  label: 'Manager Email',        group: 'contact',   weight: 5,  nebulaSource: false, required: false },
  { key: 'artistPhone',        label: 'Artist Phone',         group: 'contact',   weight: 4,  nebulaSource: false, required: false },

  // Internal (weight total: 15)
  { key: 'arRep',         label: 'A&R Rep',           group: 'internal',  weight: 5,  nebulaSource: false, required: true  },
  { key: 'pointPerson',   label: 'Point Person',      group: 'internal',  weight: 5,  nebulaSource: false, required: false },
  { key: 'internalNotes', label: 'Internal Notes',    group: 'internal',  weight: 3,  nebulaSource: false, required: false },
  { key: 'rosterNotes',   label: 'Roster Notes',      group: 'internal',  weight: 2,  nebulaSource: false, required: false },
];

const TOTAL_WEIGHT = FIELD_SPECS.reduce((s, f) => s + f.weight, 0);

// ─── Missing-data sentinels ──────────────────────────────────

const MISSING_SENTINELS = new Set([
  '', '0', 'Needs Info', 'Pending Sync', 'Pending sync', 'needs info',
]);

function isMissing(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'number') return value === 0;
  if (typeof value === 'string') return MISSING_SENTINELS.has(value.trim());
  return false;
}

// ─── Per-artist audit ───────────────────────────────────────

export interface FieldAudit {
  key: string;
  label: string;
  group: DataFieldGroup;
  status: DataFieldStatus;
  nebulaSource: boolean;
  required: boolean;
  weight: number;
}

export interface ArtistDataAudit {
  artistId: string;
  artistName: string;
  tier: string;
  status: string;
  dataQualityScore: number;
  fields: FieldAudit[];
  presentCount: number;
  missingCount: number;
  pendingNebulaCount: number;
  missingRequired: string[];
}

export function auditArtist(artist: typeof SIGNED_ARTISTS[0]): ArtistDataAudit {
  let earnedWeight = 0;
  const fields: FieldAudit[] = [];
  const missingRequired: string[] = [];

  for (const spec of FIELD_SPECS) {
    const raw = (artist as unknown as Record<string, unknown>)[spec.key];
    const missing = isMissing(raw);

    let status: DataFieldStatus;
    if (!missing) {
      status = 'present';
      earnedWeight += spec.weight;
    } else if (spec.nebulaSource) {
      status = 'pending_nebula';
    } else {
      status = 'missing';
      if (spec.required) missingRequired.push(spec.label);
    }

    fields.push({
      key: spec.key,
      label: spec.label,
      group: spec.group,
      status,
      nebulaSource: spec.nebulaSource,
      required: spec.required,
      weight: spec.weight,
    });
  }

  const score = Math.round((earnedWeight / TOTAL_WEIGHT) * 100);

  return {
    artistId: artist.id,
    artistName: artist.name,
    tier: artist.tier,
    status: artist.status,
    dataQualityScore: score,
    fields,
    presentCount:       fields.filter(f => f.status === 'present').length,
    missingCount:       fields.filter(f => f.status === 'missing').length,
    pendingNebulaCount: fields.filter(f => f.status === 'pending_nebula').length,
    missingRequired,
  };
}

// ─── Full roster audit ──────────────────────────────────────

export interface RosterDataAudit {
  generatedAt: string;
  totalArtists: number;
  averageQualityScore: number;
  highQuality: number;
  mediumQuality: number;
  lowQuality: number;
  artistsWithMissingRequired: number;
  totalMissingFields: number;
  totalPendingNebula: number;

  fieldsMissingMost: { fieldLabel: string; missingCount: number; nebulaSource: boolean }[];
  nebulaFields: { key: string; label: string; group: DataFieldGroup; missingAcrossRoster: number }[];

  byTier: Record<string, { count: number; avgScore: number }>;
  artists: ArtistDataAudit[];
}

export function auditRoster(): RosterDataAudit {
  const audits = SIGNED_ARTISTS.map(auditArtist);
  const scores = audits.map(a => a.dataQualityScore);
  const avg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);

  const fieldMissCount: Record<string, number> = {};
  for (const f of FIELD_SPECS) fieldMissCount[f.label] = 0;

  for (const audit of audits) {
    for (const f of audit.fields) {
      if (f.status === 'missing' || f.status === 'pending_nebula') {
        fieldMissCount[f.label] = (fieldMissCount[f.label] ?? 0) + 1;
      }
    }
  }

  const fieldsMissingMost = Object.entries(fieldMissCount)
    .map(([fieldLabel, missingCount]) => {
      const spec = FIELD_SPECS.find(f => f.label === fieldLabel)!;
      return { fieldLabel, missingCount, nebulaSource: spec.nebulaSource };
    })
    .filter(f => f.missingCount > 0)
    .sort((a, b) => b.missingCount - a.missingCount)
    .slice(0, 15);

  const nebulaFields = FIELD_SPECS
    .filter(f => f.nebulaSource)
    .map(f => ({
      key: f.key,
      label: f.label,
      group: f.group,
      missingAcrossRoster: audits.reduce((sum, a) => {
        const entry = a.fields.find(af => af.key === f.key);
        return sum + (entry?.status !== 'present' ? 1 : 0);
      }, 0),
    }));

  const byTier: Record<string, { count: number; avgScore: number }> = {};
  for (const audit of audits) {
    if (!byTier[audit.tier]) byTier[audit.tier] = { count: 0, avgScore: 0 };
    byTier[audit.tier].count++;
    byTier[audit.tier].avgScore += audit.dataQualityScore;
  }
  for (const t of Object.keys(byTier)) {
    byTier[t].avgScore = Math.round(byTier[t].avgScore / byTier[t].count);
  }

  return {
    generatedAt: new Date().toISOString(),
    totalArtists: audits.length,
    averageQualityScore: avg,
    highQuality:   audits.filter(a => a.dataQualityScore >= 70).length,
    mediumQuality: audits.filter(a => a.dataQualityScore >= 40 && a.dataQualityScore < 70).length,
    lowQuality:    audits.filter(a => a.dataQualityScore < 40).length,
    artistsWithMissingRequired: audits.filter(a => a.missingRequired.length > 0).length,
    totalMissingFields:   audits.reduce((s, a) => s + a.missingCount, 0),
    totalPendingNebula:   audits.reduce((s, a) => s + a.pendingNebulaCount, 0),
    fieldsMissingMost,
    nebulaFields,
    byTier,
    artists: audits,
  };
}

// ─── Nebula integration map ─────────────────────────────────

export interface NebulaFieldMap {
  field: string;
  label: string;
  group: DataFieldGroup;
  nebulaEndpoint: string;
  syncFrequency: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  notes: string;
}

export const NEBULA_INTEGRATION_MAP: NebulaFieldMap[] = [
  {
    field: 'monthlyListeners',
    label: 'Monthly Listeners',
    group: 'streaming',
    nebulaEndpoint: '/api/streaming/listeners/monthly',
    syncFrequency: 'Daily',
    priority: 'critical',
    notes: 'Core discovery signal. Used for health score and tier ranking.',
  },
  {
    field: 'totalStreams',
    label: 'Total Streams',
    group: 'streaming',
    nebulaEndpoint: '/api/streaming/streams/total',
    syncFrequency: 'Daily',
    priority: 'critical',
    notes: 'Recoupment calculation base. Must be accurate.',
  },
  {
    field: 'spotifyFollowers',
    label: 'Spotify Followers',
    group: 'streaming',
    nebulaEndpoint: '/api/streaming/spotify/followers',
    syncFrequency: 'Daily',
    priority: 'high',
    notes: 'Fan growth signal. Tracked alongside monthly listeners.',
  },
  {
    field: 'healthScore',
    label: 'Health Score',
    group: 'streaming',
    nebulaEndpoint: '/api/analytics/health-score',
    syncFrequency: 'Daily',
    priority: 'critical',
    notes: 'Composite score from Nebula signal model. Currently derived from listeners locally.',
  },
  {
    field: 'instagramFollowers',
    label: 'Instagram Followers',
    group: 'social',
    nebulaEndpoint: '/api/social/instagram/followers',
    syncFrequency: 'Weekly',
    priority: 'high',
    notes: 'Social fan base. Cross-platform growth indicator.',
  },
  {
    field: 'youtubeFollowers',
    label: 'YouTube Subscribers',
    group: 'social',
    nebulaEndpoint: '/api/social/youtube/subscribers',
    syncFrequency: 'Weekly',
    priority: 'medium',
    notes: 'Content engagement signal.',
  },
  {
    field: 'streamingDelta',
    label: 'Streaming Delta (30d)',
    group: 'streaming',
    nebulaEndpoint: '/api/streaming/listeners/delta',
    syncFrequency: 'Daily',
    priority: 'high',
    notes: 'Velocity signal. +/- listeners over last 30 days.',
  },
  {
    field: 'followerDelta',
    label: 'Follower Delta (30d)',
    group: 'social',
    nebulaEndpoint: '/api/social/followers/delta',
    syncFrequency: 'Daily',
    priority: 'medium',
    notes: 'Social growth velocity.',
  },
  {
    field: 'activeListeners',
    label: 'Active Listeners',
    group: 'streaming',
    nebulaEndpoint: '/api/streaming/listeners/active',
    syncFrequency: 'Daily',
    priority: 'high',
    notes: 'Engaged listener count. Higher signal quality than total monthly.',
  },
  {
    field: 'fanEngagementScore',
    label: 'Fan Engagement Score',
    group: 'streaming',
    nebulaEndpoint: '/api/analytics/fan-engagement',
    syncFrequency: 'Weekly',
    priority: 'high',
    notes: 'Composite engagement metric from Nebula AI model.',
  },
];
