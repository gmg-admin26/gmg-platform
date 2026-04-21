// Catalog client lifecycle service — mirrors dropArtistService.ts pattern.
// Uses Supabase catalog_lifecycle_events table with in-memory cache.

import { supabase } from '../../lib/supabase';

export type CatalogLifecycleState = 'active' | 'dropped_pending' | 'dropped_complete';

export interface CatalogLifecycleEvent {
  id?: string;
  client_id: string;
  client_name: string;
  state: CatalogLifecycleState;
  initiated_by: string;
  initiated_at: string;
  notes: string | null;
}

const _stateOverrides: Record<string, CatalogLifecycleState> = {};
let _hydrated = false;

export async function initCatalogDropState(): Promise<void> {
  if (_hydrated) return;
  _hydrated = true;
  try {
    const { data } = await supabase
      .from('catalog_lifecycle_events')
      .select('client_id, state')
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false });
    if (!data) return;
    const seen = new Set<string>();
    for (const row of data) {
      if (!seen.has(row.client_id)) {
        seen.add(row.client_id);
        _stateOverrides[row.client_id] = row.state as CatalogLifecycleState;
      }
    }
  } catch {
    _hydrated = false;
  }
}

export function getLocalCatalogState(clientId: string): CatalogLifecycleState {
  return _stateOverrides[clientId] ?? 'active';
}

export function setLocalCatalogState(clientId: string, state: CatalogLifecycleState): void {
  _stateOverrides[clientId] = state;
}

export function isClientDropped(clientId: string): boolean {
  const s = getLocalCatalogState(clientId);
  return s === 'dropped_pending' || s === 'dropped_complete';
}

export async function dropClient(payload: {
  clientId: string;
  clientName: string;
  initiatedBy: string;
  notes?: string;
}): Promise<{ error: string | null }> {
  setLocalCatalogState(payload.clientId, 'dropped_pending');
  try {
    const { error } = await supabase.from('catalog_lifecycle_events').insert({
      client_id: payload.clientId,
      client_name: payload.clientName,
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

export async function reinstateClient(clientId: string, initiatedBy: string): Promise<{ error: string | null }> {
  setLocalCatalogState(clientId, 'active');
  try {
    const { error } = await supabase.from('catalog_lifecycle_events').insert({
      client_id: clientId,
      client_name: '',
      state: 'active',
      initiated_by: initiatedBy,
      notes: 'Reinstated from Dropped Queue',
    });
    if (error) return { error: error.message };
    return { error: null };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function fetchCatalogDroppedQueue(): Promise<CatalogLifecycleEvent[]> {
  try {
    const { data, error } = await supabase
      .from('catalog_lifecycle_events')
      .select('*')
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false });

    if (error || !data) return [];

    const seen = new Set<string>();
    const result: CatalogLifecycleEvent[] = [];
    for (const row of data) {
      if (!seen.has(row.client_id)) {
        seen.add(row.client_id);
        setLocalCatalogState(row.client_id, row.state as CatalogLifecycleState);
        result.push(row as CatalogLifecycleEvent);
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function getDroppedClientIds(): string[] {
  return Object.entries(_stateOverrides)
    .filter(([, v]) => v === 'dropped_pending' || v === 'dropped_complete')
    .map(([k]) => k);
}

export async function fetchLifecycleEventForClient(clientId: string): Promise<CatalogLifecycleEvent | null> {
  try {
    const { data, error } = await supabase
      .from('catalog_lifecycle_events')
      .select('*')
      .eq('client_id', clientId)
      .in('state', ['dropped_pending', 'dropped_complete'])
      .order('initiated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as CatalogLifecycleEvent;
  } catch {
    return null;
  }
}
