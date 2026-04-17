import { labelsData, getLabelById, type LabelRecord } from '../data/labelsData';
import { SIGNED_ARTISTS, type SignedArtist } from '../data/artistRosterData';
import { getActiveArtists } from '../data/dropArtistService';
import type { ArtistLabelAssignment } from '../data/labelService';

export interface LabelMetrics extends LabelRecord {
  artist_count: number;
  total_listeners: number;
  total_streams: number;
  total_revenue: number;
  total_investment: number;
  avg_health: number;
  assigned_artists: SignedArtist[];
}

export function getArtistsByLabel(
  labelId: string,
  artists: SignedArtist[] = SIGNED_ARTISTS,
  dbAssignments?: ArtistLabelAssignment[],
): SignedArtist[] {
  const active = getActiveArtists(artists);
  if (dbAssignments) {
    const dbIds = new Set(
      dbAssignments.filter(a => a.label_id === labelId && a.active).map(a => a.artist_id)
    );
    const staticFiltered = active.filter(
      a => (a as SignedArtist & { label_id?: string | null }).label_id === labelId
    );
    const staticIds = new Set(staticFiltered.map(a => a.id));
    const dynamicOnly = active.filter(a => dbIds.has(a.id) && !staticIds.has(a.id));
    const removedByDb = staticFiltered.filter(
      a => dbAssignments.some(la => la.artist_id === a.id && !la.active)
        && !dbIds.has(a.id)
    );
    const removedIds = new Set(removedByDb.map(a => a.id));
    return [...staticFiltered.filter(a => !removedIds.has(a.id)), ...dynamicOnly];
  }
  return active.filter(a => (a as SignedArtist & { label_id?: string | null }).label_id === labelId);
}

export function buildLabelMetrics(
  labels: LabelRecord[] = labelsData,
  artists: SignedArtist[] = SIGNED_ARTISTS,
  dbAssignments?: ArtistLabelAssignment[],
): LabelMetrics[] {
  const activeArtists = getActiveArtists(artists);
  return labels.map(label => {
    const assigned = getArtistsByLabel(label.id, activeArtists, dbAssignments);
    const count = assigned.length;

    const total_listeners   = assigned.reduce((s, a) => s + (a.monthlyListeners  ?? 0), 0);
    const total_streams     = assigned.reduce((s, a) => s + (a.totalStreams       ?? 0), 0);
    const total_revenue     = assigned.reduce((s, a) => s + (a.financials?.ytdRevenue          ?? 0), 0);
    const total_investment  = assigned.reduce((s, a) => s + (a.financials?.totalInvestment?.ytd ?? 0), 0);
    const avg_health        = count > 0
      ? Math.round(assigned.reduce((s, a) => s + (a.healthScore ?? 0), 0) / count)
      : 0;

    return {
      ...label,
      artist_count: count,
      total_listeners,
      total_streams,
      total_revenue,
      total_investment,
      avg_health,
      assigned_artists: assigned,
    };
  });
}

export function getLabelNameForArtist(artist: SignedArtist & { label_id?: string | null }): string {
  if (!artist.label_id) return 'Independent';
  const label = getLabelById(artist.label_id);
  return label?.name ?? 'Independent';
}

const LOCATION_PATTERN = /\b[A-Z][a-zA-Z\s]+,\s*[A-Z]{2}\b/;

export function cleanGenre(genre: string | undefined | null): string {
  if (!genre) return '';
  return genre
    .split('·')
    .map(s => s.trim())
    .filter(s => !LOCATION_PATTERN.test(s))
    .join(' / ');
}

export function getCanonicalLocation(artist: { market?: string; city?: string; country?: string }): string {
  if (artist.market && artist.market !== 'Needs Info') return artist.market;
  if (artist.city) return artist.city;
  return '';
}

export function validateLabelMappings(artists: SignedArtist[] = SIGNED_ARTISTS): void {
  if (process.env.NODE_ENV !== 'development') return;
  const withLabel  = artists.filter(a => !!(a as { label_id?: string | null }).label_id).length;
  const withoutLabel = artists.length - withLabel;
  const invalidIds = artists
    .filter(a => {
      const id = (a as { label_id?: string | null }).label_id;
      return id && !getLabelById(id);
    })
    .map(a => `${a.id} (${a.name}): label_id="${(a as { label_id?: string | null }).label_id}"`);

  console.group('[LabelUtils] Validation');
  console.log(`Total artists: ${artists.length}`);
  console.log(`With label_id: ${withLabel}`);
  console.log(`Without label_id: ${withoutLabel}`);
  if (invalidIds.length > 0) {
    console.warn(`Invalid label_ids (${invalidIds.length}):`, invalidIds);
  } else {
    console.log('No invalid label_id references.');
  }
  console.groupEnd();
}
