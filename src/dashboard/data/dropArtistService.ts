import { supabase } from '../../lib/supabase';

export type ArtistLifecycleState = 'active' | 'at_risk' | 'dropped_pending' | 'dropped_complete';

export interface ArtistLifecycleEvent {
  id?: string;
  artist_id: string;
  artist_name: string;
  state: ArtistLifecycleState;
  initiated_by: string;
  initiated_at: string;
  notes: string | null;
}

const _stateOverrides: Record<string, ArtistLifecycleState> = {};
let _hydrated = false;

export async function initDropState(): Promise<void> {
  if (_hydrated) return;
  _hydrated = true;
  try {
    const { data } = await supabase
      .from('artist_lifecycle_events')
      .select('artist_id, state')
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false });
    if (!data) return;
    const seen = new Set<string>();
    for (const row of data) {
      if (!seen.has(row.artist_id)) {
        seen.add(row.artist_id);
        _stateOverrides[row.artist_id] = row.state as ArtistLifecycleState;
      }
    }
  } catch {
    _hydrated = false;
  }
}

export function getLocalLifecycleState(artistId: string): ArtistLifecycleState {
  return _stateOverrides[artistId] ?? 'active';
}

export function setLocalLifecycleState(artistId: string, state: ArtistLifecycleState): void {
  _stateOverrides[artistId] = state;
}

export function isArtistDropped(artistId: string): boolean {
  const s = getLocalLifecycleState(artistId);
  return s === 'dropped_pending' || s === 'dropped_complete';
}

export async function dropArtist(payload: {
  artistId: string;
  artistName: string;
  initiatedBy: string;
  notes?: string;
}): Promise<{ error: string | null }> {
  setLocalLifecycleState(payload.artistId, 'dropped_pending');
  try {
    const { error } = await supabase.from('artist_lifecycle_events').insert({
      artist_id: payload.artistId,
      artist_name: payload.artistName,
      state: 'dropped_pending',
      initiated_by: payload.initiatedBy,
      notes: payload.notes ?? null,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function completeDropArtist(artistId: string, initiatedBy: string): Promise<{ error: string | null }> {
  setLocalLifecycleState(artistId, 'dropped_complete');
  try {
    const { error } = await supabase.from('artist_lifecycle_events').insert({
      artist_id: artistId,
      artist_name: '',
      state: 'dropped_complete',
      initiated_by: initiatedBy,
      notes: null,
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function fetchDroppedQueue(): Promise<ArtistLifecycleEvent[]> {
  try {
    const { data, error } = await supabase
      .from('artist_lifecycle_events')
      .select('*')
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false });

    if (error || !data) return [];

    const seen = new Set<string>();
    const result: ArtistLifecycleEvent[] = [];
    for (const row of data) {
      if (!seen.has(row.artist_id)) {
        seen.add(row.artist_id);
        setLocalLifecycleState(row.artist_id, row.state as ArtistLifecycleState);
        result.push(row as ArtistLifecycleEvent);
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function getLocalDroppedIds(): string[] {
  return Object.entries(_stateOverrides)
    .filter(([, v]) => v === 'dropped_pending' || v === 'dropped_complete')
    .map(([k]) => k);
}

export function getActiveArtists<T extends { id: string }>(artists: T[]): T[] {
  return artists.filter(a => !isArtistDropped(a.id));
}

export function restoreArtist(artistId: string): void {
  setLocalLifecycleState(artistId, 'active');
}

export async function fetchLifecycleEventForArtist(artistId: string): Promise<ArtistLifecycleEvent | null> {
  try {
    const { data, error } = await supabase
      .from('artist_lifecycle_events')
      .select('*')
      .eq('artist_id', artistId)
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as ArtistLifecycleEvent;
  } catch {
    return null;
  }
}
