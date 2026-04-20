// Local-state drop/reinstate service for Catalog OS clients.
// Mirrors the pattern used by dropArtistService.ts for Artist OS.

const STORAGE_KEY = 'gmg_catalog_dropped_clients';

export interface CatalogDropRecord {
  clientId: string;
  clientName: string;
  droppedAt: string;   // ISO timestamp
  droppedBy: string;
  reason: string;
  state: 'dropped' | 'reinstated';
}

function loadAll(): CatalogDropRecord[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveAll(records: CatalogDropRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function isClientDropped(clientId: string): boolean {
  return loadAll().some(r => r.clientId === clientId && r.state === 'dropped');
}

export function dropClient(clientId: string, clientName: string, reason = ''): void {
  const records = loadAll().filter(r => r.clientId !== clientId);
  records.push({
    clientId,
    clientName,
    droppedAt: new Date().toISOString(),
    droppedBy: 'Admin',
    reason: reason || 'Dropped via admin roster',
    state: 'dropped',
  });
  saveAll(records);
}

export function reinstateClient(clientId: string): void {
  const records = loadAll().map(r =>
    r.clientId === clientId ? { ...r, state: 'reinstated' as const } : r
  );
  saveAll(records);
}

export function getDroppedClients(): CatalogDropRecord[] {
  return loadAll().filter(r => r.state === 'dropped');
}

export function getDropRecord(clientId: string): CatalogDropRecord | null {
  return loadAll().find(r => r.clientId === clientId) ?? null;
}
