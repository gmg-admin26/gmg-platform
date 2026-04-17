import { supabase } from '../../lib/supabase';

export type CatalogClientType =
  | 'artist'
  | 'management_company'
  | 'label'
  | 'distributor'
  | 'catalog_owner'
  | 'multi_entity';

export type CatalogClientStatus = 'active' | 'onboarding' | 'paused' | 'offboarded';
export type ArtistRole = 'owned' | 'managed' | 'distributed' | 'licensed' | 'acquired';
export type ArtistStatus = 'active' | 'inactive' | 'on_hold' | 'exit';

export interface CatalogClient {
  id: string;
  name: string;
  type: CatalogClientType;
  status: CatalogClientStatus;
  primary_contact?: string;
  contact_email?: string;
  territory?: string;
  client_since?: string;
  description?: string;
  accent_color: string;
  catalog_rep?: string;
  catalog_rep_email?: string;
  est_catalog_value?: number;
  est_monthly_revenue?: number;
  total_artists: number;
  total_releases?: number;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CatalogClientArtist {
  id: string;
  client_id: string;
  artist_name: string;
  artist_role: ArtistRole;
  genre?: string;
  catalog_value_est?: number;
  monthly_revenue_est?: number;
  total_releases?: number;
  total_streams_alltime?: string;
  status: ArtistStatus;
  is_primary: boolean;
  priority_rank: number;
  territory?: string;
  signed_date?: string;
  notes?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface CatalogClientWithRoster extends CatalogClient {
  artists: CatalogClientArtist[];
}

export const CLIENT_TYPE_META: Record<CatalogClientType, { label: string; color: string; description: string }> = {
  artist:             { label: 'Artist',              color: '#10B981', description: 'Single artist catalog management' },
  management_company: { label: 'Management Co.',      color: '#06B6D4', description: 'Artist management company representing multiple artists' },
  label:              { label: 'Label',               color: '#3B82F6', description: 'Record label with owned artist roster' },
  distributor:        { label: 'Distributor',         color: '#F59E0B', description: 'Distribution company using GMG services' },
  catalog_owner:      { label: 'Catalog Owner',       color: '#F59E0B', description: 'Investor or buyer managing acquired catalogs' },
  multi_entity:       { label: 'Multi-Entity',        color: '#EC4899', description: 'Holding company managing multiple business entities' },
};

export const ARTIST_ROLE_META: Record<ArtistRole, { label: string; color: string }> = {
  owned:       { label: 'Owned',       color: '#10B981' },
  managed:     { label: 'Managed',     color: '#06B6D4' },
  distributed: { label: 'Distributed', color: '#3B82F6' },
  licensed:    { label: 'Licensed',    color: '#F59E0B' },
  acquired:    { label: 'Acquired',    color: '#A3E635' },
};

export function isSingleArtist(client: CatalogClient): boolean {
  return client.type === 'artist';
}

export function isRosterView(client: CatalogClient): boolean {
  return ['management_company', 'label', 'distributor'].includes(client.type);
}

export function isPortfolioView(client: CatalogClient): boolean {
  return ['catalog_owner', 'multi_entity'].includes(client.type);
}

export async function fetchAllClients(): Promise<CatalogClient[]> {
  const { data, error } = await supabase
    .from('catalog_clients')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });
  return error ? [] : (data ?? []);
}

export async function fetchClientById(id: string): Promise<CatalogClientWithRoster | null> {
  const { data: client, error } = await supabase
    .from('catalog_clients')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !client) return null;

  const { data: artists } = await supabase
    .from('catalog_client_artists')
    .select('*')
    .eq('client_id', id)
    .order('priority_rank', { ascending: true });

  return { ...client, artists: artists ?? [] };
}

export async function fetchClientArtists(clientId: string): Promise<CatalogClientArtist[]> {
  const { data, error } = await supabase
    .from('catalog_client_artists')
    .select('*')
    .eq('client_id', clientId)
    .order('priority_rank', { ascending: true });
  return error ? [] : (data ?? []);
}
