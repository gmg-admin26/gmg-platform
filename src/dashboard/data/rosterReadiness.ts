// ============================================================
// Roster Readiness — scoring, flag types, and Supabase service
// ============================================================

import { supabase } from '../../lib/supabase';
import type { SignedArtist } from './artistRosterData';

// ─── Readiness types ─────────────────────────────────────────

export type ReadinessStatus = 'ready' | 'incomplete' | 'needs_review';

export interface RosterFlag {
  id: string;
  artistId: string;
  readinessStatus: ReadinessStatus;
  flaggedForUpdate: boolean;
  assignedTo: string;
  flagReason: string;
  adminNotes: string;
  lastReviewedAt: string | null;
  lastReviewedBy: string;
  updatedAt: string;
}

export type UpsertFlagInput = Omit<RosterFlag, 'id' | 'updatedAt'>;

// ─── Missing field categories ───────────────────────────────

export interface ReadinessAudit {
  artistId: string;
  score: number;
  status: ReadinessStatus;
  missingContact: boolean;
  missingSocial: boolean;
  noActiveRelease: boolean;
  noFinancialData: boolean;
  isNewSigning: boolean;
  missingFields: MissingField[];
}

export interface MissingField {
  group: 'contact' | 'social' | 'release' | 'financial' | 'identity';
  label: string;
  severity: 'critical' | 'high' | 'medium';
}

const MISSING_VALS = new Set(['', 'Needs Info', 'Pending Sync', 'Pending sync']);
function blank(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === 'number') return v === 0;
  if (typeof v === 'string') return MISSING_VALS.has(v.trim());
  return false;
}

export function computeReadiness(artist: SignedArtist): ReadinessAudit {
  const missing: MissingField[] = [];

  // --- Contact ---
  if (blank(artist.primaryEmail) || artist.primaryEmail === 'Needs Info') {
    missing.push({ group: 'contact', label: 'Primary Email', severity: 'critical' });
  }
  if (blank(artist.manager)) {
    missing.push({ group: 'contact', label: 'Manager', severity: 'high' });
  }
  if (blank(artist.managementContact) || artist.managementContact === 'Needs Info') {
    missing.push({ group: 'contact', label: 'Manager Email', severity: 'high' });
  }
  if (blank(artist.artistPhone)) {
    missing.push({ group: 'contact', label: 'Artist Phone', severity: 'medium' });
  }

  // --- Social ---
  if (blank(artist.spotifyLink)) {
    missing.push({ group: 'social', label: 'Spotify Link', severity: 'critical' });
  }
  if (blank(artist.instagramLink)) {
    missing.push({ group: 'social', label: 'Instagram Link', severity: 'high' });
  }
  if (blank(artist.tiktokLink)) {
    missing.push({ group: 'social', label: 'TikTok Link', severity: 'medium' });
  }
  if (blank(artist.youtubeLink)) {
    missing.push({ group: 'social', label: 'YouTube Link', severity: 'medium' });
  }

  // --- Release ---
  const activeRelease = artist.releases.find(r =>
    r.status !== 'No Active Release' && r.status !== 'Blocked'
  );
  if (!activeRelease) {
    missing.push({ group: 'release', label: 'Active Release', severity: 'high' });
  }

  // --- Financials ---
  const hasFinData =
    artist.financials.advance > 0 ||
    artist.financials.totalInvestment.allTime > 0 ||
    artist.financials.ytdRevenue > 0;
  if (!hasFinData) {
    missing.push({ group: 'financial', label: 'Financial Records', severity: 'medium' });
  }

  // --- Identity ---
  if (blank(artist.genre) || artist.genre === 'Needs Info') {
    missing.push({ group: 'identity', label: 'Genre', severity: 'high' });
  }
  if (blank(artist.city) || artist.city === 'Needs Info') {
    missing.push({ group: 'identity', label: 'City / Market', severity: 'medium' });
  }
  if (blank(artist.arRep) || artist.arRep === 'Needs Info') {
    missing.push({ group: 'identity', label: 'A&R Rep', severity: 'high' });
  }
  if (blank(artist.signingDate) || artist.signingDate === 'Pending Sync') {
    missing.push({ group: 'identity', label: 'Signing Date', severity: 'medium' });
  }

  // --- Score ---
  const criticalMissing = missing.filter(f => f.severity === 'critical').length;
  const highMissing = missing.filter(f => f.severity === 'high').length;
  const mediumMissing = missing.filter(f => f.severity === 'medium').length;
  const totalPossible = 15;
  const penalty = criticalMissing * 12 + highMissing * 7 + mediumMissing * 3;
  const score = Math.max(0, Math.min(100, 100 - Math.round((penalty / (totalPossible * 12)) * 100)));

  let status: ReadinessStatus;
  if (criticalMissing > 0 || score < 40) {
    status = 'incomplete';
  } else if (highMissing > 1 || score < 70) {
    status = 'needs_review';
  } else {
    status = 'ready';
  }

  return {
    artistId: artist.id,
    score,
    status,
    missingContact: missing.some(f => f.group === 'contact'),
    missingSocial: missing.some(f => f.group === 'social'),
    noActiveRelease: !activeRelease,
    noFinancialData: !hasFinData,
    isNewSigning: artist.status === 'New Signing',
    missingFields: missing,
  };
}

// ─── Supabase service ────────────────────────────────────────

function dbToFlag(r: Record<string, unknown>): RosterFlag {
  return {
    id:               r.id as string,
    artistId:         r.artist_id as string,
    readinessStatus:  r.readiness_status as ReadinessStatus,
    flaggedForUpdate: r.flagged_for_update as boolean,
    assignedTo:       r.assigned_to as string,
    flagReason:       r.flag_reason as string,
    adminNotes:       r.admin_notes as string,
    lastReviewedAt:   r.last_reviewed_at as string | null,
    lastReviewedBy:   r.last_reviewed_by as string,
    updatedAt:        r.updated_at as string,
  };
}

export async function fetchAllFlags(): Promise<RosterFlag[]> {
  const { data, error } = await supabase
    .from('aos_roster_flags')
    .select('*');
  if (error) return [];
  return (data ?? []).map(r => dbToFlag(r as Record<string, unknown>));
}

export async function upsertFlag(input: UpsertFlagInput): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('aos_roster_flags')
    .upsert(
      {
        artist_id:         input.artistId,
        readiness_status:  input.readinessStatus,
        flagged_for_update: input.flaggedForUpdate,
        assigned_to:       input.assignedTo,
        flag_reason:       input.flagReason,
        admin_notes:       input.adminNotes,
        last_reviewed_at:  input.lastReviewedAt,
        last_reviewed_by:  input.lastReviewedBy,
        updated_at:        new Date().toISOString(),
      },
      { onConflict: 'artist_id' }
    );
  return { error: error?.message ?? null };
}

export async function upsertArtistRecord(
  artistId: string,
  updates: Partial<Record<string, unknown>>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('aos_artists')
    .upsert({ id: artistId, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  return { error: error?.message ?? null };
}

// ─── Team members list ───────────────────────────────────────

export { ASSIGNEE_NAMES as GMG_TEAM_MEMBERS } from './assignees';
