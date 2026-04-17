import { supabase } from '../../lib/supabase';

export type SubmitterRole = 'artist' | 'manager' | 'admin_team' | 'label_partner';
export type SubmissionType = 'info_update' | 'contact_update' | 'social_update' | 'banking_update' | 'full_update';
export type SubmissionStatus = 'pending' | 'ai_review' | 'approved' | 'rejected' | 'applied';

export interface SubmissionChanges {
  primaryEmail?: string;
  artistPhone?: string;
  manager?: string;
  managementContact?: string;
  managerPhone?: string;
  spotifyLink?: string;
  instagramLink?: string;
  instagramHandle?: string;
  tiktokLink?: string;
  youtubeLink?: string;
  facebookLink?: string;
}

export interface BankingChanges {
  bankName?: string;
  accountHolder?: string;
  accountNumber?: string;
  routingNumber?: string;
  paymentEmail?: string;
  paymentNotes?: string;
}

export interface ArtistUpdateSubmission {
  id: string;
  artist_id: string;
  artist_name: string;
  submitted_by_email: string;
  submitted_by_name: string;
  submitter_role: SubmitterRole;
  submission_type: SubmissionType;
  status: SubmissionStatus;
  ai_review_ready: boolean;
  ai_review_notes: string;
  changes: SubmissionChanges;
  banking_changes: BankingChanges;
  admin_notes: string;
  reviewed_by: string;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSubmissionInput {
  artist_id: string;
  artist_name: string;
  submitted_by_email: string;
  submitted_by_name: string;
  submitter_role: SubmitterRole;
  changes: SubmissionChanges;
  banking_changes?: BankingChanges;
}

function deriveSubmissionType(changes: SubmissionChanges, banking: BankingChanges): SubmissionType {
  const hasBanking = Object.values(banking).some(v => v && v.trim() !== '');
  const hasContact = !!(changes.primaryEmail || changes.artistPhone || changes.manager || changes.managementContact || changes.managerPhone);
  const hasSocial = !!(changes.spotifyLink || changes.instagramLink || changes.tiktokLink || changes.youtubeLink || changes.facebookLink || changes.instagramHandle);

  if (hasBanking && (hasContact || hasSocial)) return 'full_update';
  if (hasBanking) return 'banking_update';
  if (hasContact && hasSocial) return 'full_update';
  if (hasSocial) return 'social_update';
  if (hasContact) return 'contact_update';
  return 'info_update';
}

export async function createSubmission(input: CreateSubmissionInput): Promise<{ data: ArtistUpdateSubmission | null; error: string | null }> {
  const banking = input.banking_changes ?? {};
  const type = deriveSubmissionType(input.changes, banking);

  const { data, error } = await supabase
    .from('artist_update_submissions')
    .insert({
      artist_id: input.artist_id,
      artist_name: input.artist_name,
      submitted_by_email: input.submitted_by_email,
      submitted_by_name: input.submitted_by_name,
      submitter_role: input.submitter_role,
      submission_type: type,
      status: 'pending',
      ai_review_ready: false,
      changes: input.changes,
      banking_changes: banking,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as ArtistUpdateSubmission, error: null };
}

export async function fetchAllSubmissions(): Promise<ArtistUpdateSubmission[]> {
  const { data, error } = await supabase
    .from('artist_update_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ArtistUpdateSubmission[];
}

export async function fetchSubmissionsByArtistId(artistId: string): Promise<ArtistUpdateSubmission[]> {
  const { data, error } = await supabase
    .from('artist_update_submissions')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ArtistUpdateSubmission[];
}

export async function fetchSubmissionsByEmail(email: string): Promise<ArtistUpdateSubmission[]> {
  const { data, error } = await supabase
    .from('artist_update_submissions')
    .select('*')
    .eq('submitted_by_email', email)
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data ?? []) as ArtistUpdateSubmission[];
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  reviewedBy: string,
  adminNotes?: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('artist_update_submissions')
    .update({
      status,
      reviewed_by: reviewedBy,
      admin_notes: adminNotes ?? '',
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function markAIReviewReady(
  id: string,
  aiNotes?: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('artist_update_submissions')
    .update({
      status: 'ai_review',
      ai_review_ready: true,
      ai_review_notes: aiNotes ?? '',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { error: error.message };
  return { error: null };
}

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, {
  label: string;
  color: string;
  bg: string;
  border: string;
  dot: string;
}> = {
  pending:   { label: 'Pending',    color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  dot: '#F59E0B' },
  ai_review: { label: 'AI Review',  color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)',   dot: '#06B6D4' },
  approved:  { label: 'Approved',   color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  dot: '#10B981' },
  rejected:  { label: 'Rejected',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   dot: '#EF4444' },
  applied:   { label: 'Applied',    color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)', dot: '#8B5CF6' },
};

export const SUBMISSION_TYPE_META: Record<SubmissionType, { label: string; color: string }> = {
  info_update:    { label: 'Info Update',    color: '#9CA3AF' },
  contact_update: { label: 'Contact Update', color: '#06B6D4' },
  social_update:  { label: 'Social Update',  color: '#F59E0B' },
  banking_update: { label: 'Banking Update', color: '#EF4444' },
  full_update:    { label: 'Full Update',    color: '#10B981' },
};

export const SUBMITTER_ROLE_META: Record<SubmitterRole, { label: string; color: string }> = {
  artist:       { label: 'Artist Submitted',  color: '#06B6D4' },
  manager:      { label: 'Manager Submitted', color: '#10B981' },
  admin_team:   { label: 'Admin Submitted',   color: '#F59E0B' },
  label_partner:{ label: 'Label Submitted',   color: '#8B5CF6' },
};
