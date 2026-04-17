import { supabase } from '../../lib/supabase';
import type { SignedArtist } from './artistRosterData';

export interface ArtistOverride {
  id: string;
  artist_id: string;
  field: string;
  value: string;
  updated_by: string;
  updated_at: string;
}

const OVERRIDABLE_FIELDS: (keyof SignedArtist)[] = [
  'name', 'genre', 'subgenre', 'city', 'market', 'signingDate',
  'primaryEmail', 'artistPhone', 'manager', 'managementContact', 'managerPhone',
  'spotifyLink', 'instagramLink', 'instagramHandle', 'tiktokLink', 'youtubeLink', 'facebookLink',
  'arRep', 'pointPerson', 'rosterNotes', 'internalNotes',
  'status', 'tier',
];

const _cache = new Map<string, Map<string, string>>();

export function getLocalOverride(artistId: string, field: string): string | undefined {
  return _cache.get(artistId)?.get(field);
}

export function setLocalOverride(artistId: string, field: string, value: string) {
  if (!_cache.has(artistId)) _cache.set(artistId, new Map());
  _cache.get(artistId)!.set(field, value);
}

export function applyOverridesToArtist(artist: SignedArtist): SignedArtist {
  const map = _cache.get(artist.id);
  if (!map || map.size === 0) return artist;
  const patched = { ...artist };
  for (const [field, value] of map.entries()) {
    (patched as Record<string, unknown>)[field] = value;
  }
  return patched;
}

export async function loadOverridesForArtist(artistId: string): Promise<void> {
  const { data, error } = await supabase
    .from('aos_artist_overrides')
    .select('field, value')
    .eq('artist_id', artistId);
  if (error || !data) return;
  if (!_cache.has(artistId)) _cache.set(artistId, new Map());
  const map = _cache.get(artistId)!;
  for (const row of data) {
    map.set(row.field, row.value);
  }
}

export async function loadAllOverrides(): Promise<void> {
  const { data, error } = await supabase
    .from('aos_artist_overrides')
    .select('artist_id, field, value');
  if (error || !data) return;
  for (const row of data) {
    if (!_cache.has(row.artist_id)) _cache.set(row.artist_id, new Map());
    _cache.get(row.artist_id)!.set(row.field, row.value);
  }
}

export async function saveArtistOverrides(
  artistId: string,
  updates: Partial<SignedArtist>,
  updatedBy = 'admin',
): Promise<void> {
  const rows = (Object.keys(updates) as (keyof SignedArtist)[])
    .filter(k => OVERRIDABLE_FIELDS.includes(k))
    .map(k => ({
      artist_id: artistId,
      field: k as string,
      value: String((updates as Record<string, unknown>)[k] ?? ''),
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    }));

  if (rows.length === 0) return;

  for (const row of rows) {
    setLocalOverride(artistId, row.field, row.value);
  }

  await supabase
    .from('aos_artist_overrides')
    .upsert(rows, { onConflict: 'artist_id,field' });
}
