import { supabase } from '../../lib/supabase';

export type RequestType =
  | 'Marketing Campaign'
  | 'Ad Spend'
  | 'Content Production'
  | 'Release Support'
  | 'Strategy Support'
  | 'Other';

export type RequestPriority = 'high' | 'medium' | 'low';

export type RequestStatus =
  | 'submitted'
  | 'in_review'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface ArtistOSRequest {
  id: string;
  request_type: RequestType;
  artist_id: string;
  artist_name: string;
  label_id?: string | null;
  submitted_by_email: string;
  submitted_by_role: string;
  priority: RequestPriority;
  budget_range?: string | null;
  description: string;
  desired_timeline: string;
  status: RequestStatus;
  assigned_to?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRequestInput {
  request_type: RequestType;
  artist_id: string;
  artist_name: string;
  label_id?: string;
  submitted_by_email: string;
  submitted_by_role: string;
  priority: RequestPriority;
  budget_range?: string;
  description: string;
  desired_timeline: string;
}

export async function createRequest(input: CreateRequestInput): Promise<{ data: ArtistOSRequest | null; error: string | null }> {
  const { data, error } = await supabase
    .from('artist_os_requests')
    .insert([{ ...input, status: 'submitted' }])
    .select()
    .maybeSingle();

  if (error) return { data: null, error: error.message };
  return { data: data as ArtistOSRequest, error: null };
}

export async function fetchRequestsByEmail(email: string): Promise<ArtistOSRequest[]> {
  const { data, error } = await supabase
    .from('artist_os_requests')
    .select('*')
    .eq('submitted_by_email', email)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ArtistOSRequest[];
}

export async function fetchRequestsByArtistIds(artistIds: string[]): Promise<ArtistOSRequest[]> {
  if (artistIds.length === 0) return [];
  const { data, error } = await supabase
    .from('artist_os_requests')
    .select('*')
    .in('artist_id', artistIds)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ArtistOSRequest[];
}

export async function fetchRequestsByArtistId(artistId: string): Promise<ArtistOSRequest[]> {
  if (!artistId) return [];
  const { data, error } = await supabase
    .from('artist_os_requests')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ArtistOSRequest[];
}

export async function fetchRequestsByLabel(labelId: string): Promise<ArtistOSRequest[]> {
  const { data, error } = await supabase
    .from('artist_os_requests')
    .select('*')
    .eq('label_id', labelId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ArtistOSRequest[];
}

export async function fetchAllRequests(): Promise<ArtistOSRequest[]> {
  const { data, error } = await supabase
    .from('artist_os_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as ArtistOSRequest[];
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  assignedTo?: string,
  adminNotes?: string
): Promise<{ error: string | null }> {
  const updates: Partial<ArtistOSRequest> = { status, updated_at: new Date().toISOString() };
  if (assignedTo !== undefined) updates.assigned_to = assignedTo;
  if (adminNotes !== undefined) updates.admin_notes = adminNotes;

  const { error } = await supabase
    .from('artist_os_requests')
    .update(updates)
    .eq('id', id);

  return { error: error?.message ?? null };
}

export const REQUEST_STATUS_META: Record<RequestStatus, { label: string; color: string; bg: string; border: string }> = {
  submitted:   { label: 'Submitted',   color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/20' },
  in_review:   { label: 'In Review',   color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' },
  approved:    { label: 'Approved',    color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20' },
  in_progress: { label: 'In Progress', color: '#3B82F6', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]/20' },
  completed:   { label: 'Completed',   color: '#10B981', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]/20' },
  rejected:    { label: 'Rejected',    color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20' },
};

export const PRIORITY_META: Record<RequestPriority, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: 'High',   color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' },
  low:    { label: 'Low',    color: '#6B7280', bg: 'bg-[#6B7280]/10', border: 'border-[#6B7280]/20' },
};
