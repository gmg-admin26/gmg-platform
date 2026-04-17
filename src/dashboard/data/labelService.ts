import { supabase } from '../../lib/supabase';
import { SIGNED_ARTISTS, type SignedArtist } from './artistRosterData';

export type LabelType = 'internal' | 'partner' | 'distribution';
export type LabelStatus = 'active' | 'inactive' | 'archived';
export type AssignmentRole = 'primary' | 'secondary' | 'distribution';

export interface Label {
  id: string;
  slug: string;
  name: string;
  type: LabelType;
  status: LabelStatus;
  label_category: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  notes: string;
  logo_url: string;
  color: string;
  founded_year: number | null;
  ar_rep: string;
  point_person: string;
  created_at: string;
  updated_at: string;
}

export interface ArtistLabelAssignment {
  id: string;
  artist_id: string;
  label_id: string;
  role: AssignmentRole;
  assigned_at: string;
  assigned_by: string;
  notes: string;
  active: boolean;
}

export interface LabelWithArtists extends Label {
  artistIds: string[];
  artists: SignedArtist[];
  totalListeners: number;
  totalYTDRevenue: number;
  totalYTDInvestment: number;
  totalRecoupableBalance: number;
}

export interface CreateLabelInput {
  slug: string;
  name: string;
  type: LabelType;
  color: string;
  label_category?: string | null;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  notes?: string;
  founded_year?: number;
  ar_rep?: string;
  point_person?: string;
}

export interface UpdateLabelInput extends Partial<CreateLabelInput> {
  status?: LabelStatus;
}

export function enrichLabelWithArtists(label: Label, assignments: ArtistLabelAssignment[]): LabelWithArtists {
  const artistIds = assignments
    .filter(a => a.label_id === label.id && a.active)
    .map(a => a.artist_id);

  const artists = SIGNED_ARTISTS.filter(a => artistIds.includes(a.id));

  return {
    ...label,
    artistIds,
    artists,
    totalListeners: artists.reduce((s, a) => s + a.monthlyListeners, 0),
    totalYTDRevenue: artists.reduce((s, a) => s + a.financials.ytdRevenue, 0),
    totalYTDInvestment: artists.reduce((s, a) => s + a.financials.totalInvestment.ytd, 0),
    totalRecoupableBalance: artists.reduce((s, a) => s + a.financials.recoupableBalance, 0),
  };
}

export async function fetchLabels(): Promise<Label[]> {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .neq('status', 'archived')
    .order('name', { ascending: true });
  if (error) return [];
  return (data ?? []) as Label[];
}

export async function fetchAllLabelsIncludeArchived(): Promise<Label[]> {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .order('name', { ascending: true });
  if (error) return [];
  return (data ?? []) as Label[];
}

export async function fetchLabelById(id: string): Promise<Label | null> {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) return null;
  return data as Label | null;
}

export async function fetchLabelBySlug(slug: string): Promise<Label | null> {
  const { data, error } = await supabase
    .from('labels')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) return null;
  return data as Label | null;
}

export async function fetchAllAssignments(): Promise<ArtistLabelAssignment[]> {
  const { data, error } = await supabase
    .from('artist_label_assignments')
    .select('*')
    .eq('active', true);
  if (error) return [];
  return (data ?? []) as ArtistLabelAssignment[];
}

export async function fetchAssignmentsByLabel(labelId: string): Promise<ArtistLabelAssignment[]> {
  const { data, error } = await supabase
    .from('artist_label_assignments')
    .select('*')
    .eq('label_id', labelId)
    .eq('active', true);
  if (error) return [];
  return (data ?? []) as ArtistLabelAssignment[];
}

export async function fetchAssignmentsByArtist(artistId: string): Promise<ArtistLabelAssignment[]> {
  const { data, error } = await supabase
    .from('artist_label_assignments')
    .select('*')
    .eq('artist_id', artistId)
    .eq('active', true);
  if (error) return [];
  return (data ?? []) as ArtistLabelAssignment[];
}

export async function assignArtistToLabel(
  artistId: string,
  labelId: string,
  role: AssignmentRole = 'primary',
  assignedBy = 'admin'
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('artist_label_assignments')
    .upsert({
      artist_id: artistId,
      label_id: labelId,
      role,
      assigned_by: assignedBy,
      active: true,
      assigned_at: new Date().toISOString(),
    }, { onConflict: 'artist_id,label_id' });
  if (error) return { error: error.message };
  return { error: null };
}

export async function removeArtistFromLabel(
  artistId: string,
  labelId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('artist_label_assignments')
    .update({ active: false })
    .eq('artist_id', artistId)
    .eq('label_id', labelId);
  if (error) return { error: error.message };
  return { error: null };
}

export async function createLabel(input: CreateLabelInput): Promise<{ data: Label | null; error: string | null }> {
  const { data, error } = await supabase
    .from('labels')
    .insert({
      slug: input.slug,
      name: input.name,
      type: input.type,
      color: input.color,
      label_category: input.label_category ?? null,
      contact_name: input.contact_name ?? '',
      contact_email: input.contact_email ?? '',
      contact_phone: input.contact_phone ?? '',
      website: input.website ?? '',
      notes: input.notes ?? '',
      founded_year: input.founded_year ?? null,
      ar_rep: input.ar_rep ?? '',
      point_person: input.point_person ?? '',
      status: 'active',
    })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as Label, error: null };
}

export async function updateLabel(id: string, input: UpdateLabelInput): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('labels')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return { error: error.message };
  return { error: null };
}

export async function archiveLabel(id: string): Promise<{ error: string | null }> {
  return updateLabel(id, { status: 'archived' });
}

export async function autoMapArtistsToLabels(
  assignments: ArtistLabelAssignment[],
  labels: Label[]
): Promise<{ artistId: string; labelId: string | null }[]> {
  return SIGNED_ARTISTS.map(artist => {
    const existing = assignments.find(a => a.artist_id === artist.id && a.active);
    if (existing) return { artistId: artist.id, labelId: existing.label_id };

    if (artist.labelImprint && artist.labelImprint.trim() !== '' && artist.labelImprint !== 'GMG') {
      const match = labels.find(l =>
        l.name.toLowerCase().includes(artist.labelImprint.toLowerCase()) ||
        artist.labelImprint.toLowerCase().includes(l.name.toLowerCase().split(' ')[0])
      );
      return { artistId: artist.id, labelId: match ? match.id : null };
    }
    return { artistId: artist.id, labelId: null };
  });
}

export const LABEL_TYPE_META: Record<LabelType, { label: string; color: string; bg: string }> = {
  internal:     { label: 'Internal',     color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  partner:      { label: 'Partner',      color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  distribution: { label: 'Distribution', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)'  },
};

export const LABEL_STATUS_META: Record<LabelStatus, { label: string; color: string }> = {
  active:   { label: 'Active',   color: '#10B981' },
  inactive: { label: 'Inactive', color: '#6B7280' },
  archived: { label: 'Archived', color: '#EF4444' },
};
