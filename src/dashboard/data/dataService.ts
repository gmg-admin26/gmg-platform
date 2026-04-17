// ============================================================
// Artist OS — Supabase Data Service
// Handles all reads and writes to the Artist OS database tables.
// Falls back to in-memory data (artistRosterData.ts) when
// Nebula has not yet synced a field.
// ============================================================

import { supabase } from '../../lib/supabase';
import type {
  ArtistObject,
  LabelObject,
  ContactObject,
  FinancialObject,
  CampaignObject,
  ReleaseObject,
  DataQualityEntry,
  FinancialPeriod,
} from './schema';

// ─── Artists ────────────────────────────────────────────────

export async function fetchAllArtists(): Promise<ArtistObject[]> {
  const { data, error } = await supabase
    .from('aos_artists')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data ?? []).map(dbToArtist);
}

export async function fetchArtistById(id: string): Promise<ArtistObject | null> {
  const { data, error } = await supabase
    .from('aos_artists')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? dbToArtist(data) : null;
}

export async function upsertArtist(artist: ArtistObject): Promise<void> {
  const { error } = await supabase
    .from('aos_artists')
    .upsert(artistToDb(artist), { onConflict: 'id' });

  if (error) throw error;
}

// ─── Labels ─────────────────────────────────────────────────

export async function fetchAllLabels(): Promise<LabelObject[]> {
  const { data, error } = await supabase
    .from('aos_labels')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data ?? []).map(dbToLabel);
}

// ─── Contacts ───────────────────────────────────────────────

export async function fetchContactsForArtist(artistId: string): Promise<ContactObject[]> {
  const { data, error } = await supabase
    .from('aos_contacts')
    .select('*')
    .eq('artist_id', artistId)
    .order('is_primary', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbToContact);
}

export async function upsertContact(contact: Omit<ContactObject, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('aos_contacts')
    .insert(contactToDb(contact));

  if (error) throw error;
}

// ─── Financials ─────────────────────────────────────────────

export async function fetchFinancialsForArtist(
  artistId: string,
  period?: FinancialPeriod
): Promise<FinancialObject[]> {
  let query = supabase
    .from('aos_financials')
    .select('*')
    .eq('artist_id', artistId)
    .order('snapshot_date', { ascending: false });

  if (period) query = query.eq('period', period);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(dbToFinancial);
}

export async function upsertFinancials(fin: Omit<FinancialObject, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('aos_financials')
    .upsert(financialToDb(fin), { onConflict: 'artist_id,period,snapshot_date' });

  if (error) throw error;
}

// ─── Campaigns ──────────────────────────────────────────────

export async function fetchCampaignsForArtist(artistId: string): Promise<CampaignObject[]> {
  const { data, error } = await supabase
    .from('aos_campaigns')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbToCampaign);
}

export async function upsertCampaign(campaign: Omit<CampaignObject, 'id'>): Promise<void> {
  const { error } = await supabase
    .from('aos_campaigns')
    .insert(campaignToDb(campaign));

  if (error) throw error;
}

// ─── Releases ───────────────────────────────────────────────

export async function fetchReleasesForArtist(artistId: string): Promise<ReleaseObject[]> {
  const { data, error } = await supabase
    .from('aos_releases')
    .select('*')
    .eq('artist_id', artistId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(dbToRelease);
}

// ─── Data Quality Log ────────────────────────────────────────

export async function fetchDataQualityForArtist(artistId: string): Promise<DataQualityEntry[]> {
  const { data, error } = await supabase
    .from('aos_data_quality_log')
    .select('*')
    .eq('artist_id', artistId);

  if (error) throw error;
  return (data ?? []).map(dbToDataQuality);
}

export async function fetchDataQualitySummary(): Promise<{
  totalMissing: number;
  totalPendingNebula: number;
  totalPresent: number;
  coveragePercent: number;
}> {
  const { data, error } = await supabase
    .from('aos_data_quality_log')
    .select('status');

  if (error) throw error;

  const rows = data ?? [];
  const totalMissing       = rows.filter(r => r.status === 'missing').length;
  const totalPendingNebula = rows.filter(r => r.status === 'pending_nebula').length;
  const totalPresent       = rows.filter(r => r.status === 'present').length;
  const total              = rows.length;
  const coveragePercent    = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

  return { totalMissing, totalPendingNebula, totalPresent, coveragePercent };
}

// ─── DB ↔ Domain mappers ─────────────────────────────────────

function dbToArtist(r: Record<string, unknown>): ArtistObject {
  return {
    id:                   r.id as string,
    name:                 r.name as string,
    avatarInitials:       r.avatar_initials as string,
    avatarColor:          r.avatar_color as string,
    tier:                 r.tier as ArtistObject['tier'],
    status:               r.status as ArtistObject['status'],
    genre:                r.genre as string,
    subgenre:             r.subgenre as string,
    city:                 r.city as string,
    country:              r.country as string,
    market:               r.market as string,
    signingDate:          r.signing_date as string,
    labelImprint:         r.label_imprint as string,
    healthScore:          r.health_score as number,
    monthlyListeners:     r.monthly_listeners as number,
    activeListeners:      r.active_listeners as number,
    totalStreams:         (r.total_streams as number) ?? 0,
    streamingAtSigning:  (r.streaming_at_signing as number) ?? 0,
    followers:            r.followers as number,
    fanEngagementScore:   r.fan_engagement_score as number,
    spotifyLink:          r.spotify_link as string,
    spotifyFollowers:     r.spotify_followers as number,
    instagramLink:        r.instagram_link as string,
    instagramHandle:      r.instagram_handle as string,
    instagramFollowers:   r.instagram_followers as number,
    tiktokLink:           r.tiktok_link as string,
    youtubeLink:          r.youtube_link as string,
    youtubeFollowers:     r.youtube_followers as number,
    facebookLink:         r.facebook_link as string,
    topPlatform:          r.top_platform as string,
    artistPhone:          r.artist_phone as string,
    primaryEmail:         r.primary_email as string,
    arRep:                r.ar_rep as string,
    pointPerson:          r.point_person as string,
    manager:              r.manager as string,
    managementContact:    r.management_contact as string,
    managerPhone:         r.manager_phone as string,
    rosterNotes:          r.roster_notes as string,
    internalNotes:        r.internal_notes as string,
    streamingDelta:       r.streaming_delta as string,
    followerDelta:        r.follower_delta as string,
    activeListenerDelta:  r.active_listener_delta as string,
    dataQualityScore:     r.data_quality_score as number,
    nebulasSynced:        r.nebula_synced as boolean,
    lastSyncedAt:         r.last_synced_at as string | null,
  };
}

function artistToDb(a: ArtistObject): Record<string, unknown> {
  return {
    id:                   a.id,
    name:                 a.name,
    avatar_initials:      a.avatarInitials,
    avatar_color:         a.avatarColor,
    tier:                 a.tier,
    status:               a.status,
    genre:                a.genre,
    subgenre:             a.subgenre,
    city:                 a.city,
    country:              a.country,
    market:               a.market,
    signing_date:         a.signingDate,
    label_imprint:        a.labelImprint,
    health_score:         a.healthScore,
    monthly_listeners:    a.monthlyListeners,
    active_listeners:     a.activeListeners,
    total_streams:        a.totalStreams,
    streaming_at_signing: a.streamingAtSigning,
    followers:            a.followers,
    fan_engagement_score: a.fanEngagementScore,
    spotify_link:         a.spotifyLink,
    spotify_followers:    a.spotifyFollowers,
    instagram_link:       a.instagramLink,
    instagram_handle:     a.instagramHandle,
    instagram_followers:  a.instagramFollowers,
    tiktok_link:          a.tiktokLink,
    youtube_link:         a.youtubeLink,
    youtube_followers:    a.youtubeFollowers,
    facebook_link:        a.facebookLink,
    top_platform:         a.topPlatform,
    artist_phone:         a.artistPhone,
    primary_email:        a.primaryEmail,
    ar_rep:               a.arRep,
    point_person:         a.pointPerson,
    manager:              a.manager,
    management_contact:   a.managementContact,
    manager_phone:        a.managerPhone,
    roster_notes:         a.rosterNotes,
    internal_notes:       a.internalNotes,
    streaming_delta:      a.streamingDelta,
    follower_delta:       a.followerDelta,
    active_listener_delta: a.activeListenerDelta,
    data_quality_score:   a.dataQualityScore,
    nebula_synced:        a.nebulasSynced,
    last_synced_at:       a.lastSyncedAt,
    updated_at:           new Date().toISOString(),
  };
}

function dbToLabel(r: Record<string, unknown>): LabelObject {
  return {
    id:           r.id as string,
    name:         r.name as string,
    type:         r.type as LabelObject['type'],
    contactName:  r.contact_name as string,
    contactEmail: r.contact_email as string,
    contactPhone: r.contact_phone as string,
    website:      r.website as string,
    notes:        r.notes as string,
  };
}

function dbToContact(r: Record<string, unknown>): ContactObject {
  return {
    id:         r.id as string,
    artistId:   r.artist_id as string,
    fullName:   r.full_name as string,
    role:       r.role as ContactObject['role'],
    email:      r.email as string,
    phone:      r.phone as string,
    company:    r.company as string,
    isPrimary:  r.is_primary as boolean,
    notes:      r.notes as string,
  };
}

function contactToDb(c: Omit<ContactObject, 'id'>): Record<string, unknown> {
  return {
    artist_id:  c.artistId,
    full_name:  c.fullName,
    role:       c.role,
    email:      c.email,
    phone:      c.phone,
    company:    c.company,
    is_primary: c.isPrimary,
    notes:      c.notes,
  };
}

function dbToFinancial(r: Record<string, unknown>): FinancialObject {
  return {
    id:                        r.id as string,
    artistId:                  r.artist_id as string,
    period:                    r.period as FinancialPeriod,
    snapshotDate:              r.snapshot_date as string,
    advance:                   Number(r.advance),
    artistGrant:               Number(r.artist_grant),
    artistGrantRecoupable:     r.artist_grant_recoupable as boolean,
    adSpend:                   Number(r.ad_spend),
    marketingSpend:            Number(r.marketing_spend),
    liveShows:                 Number(r.live_shows),
    touring:                   Number(r.touring),
    contentProduction:         Number(r.content_production),
    arSpend:                   Number(r.ar_spend),
    operationsPeople:          Number(r.operations_people),
    otherRecoupable:           Number(r.other_recoupable),
    otherNonRecoupable:        Number(r.other_non_recoupable),
    totalInvestment:           Number(r.total_investment),
    totalRecoupableSpend:      Number(r.total_recoupable_spend),
    totalNonRecoupableSpend:   Number(r.total_non_recoupable_spend),
    recoupableBalance:         Number(r.recoupable_balance),
    revenue:                   Number(r.revenue),
  };
}

function financialToDb(f: Omit<FinancialObject, 'id'>): Record<string, unknown> {
  return {
    artist_id:                  f.artistId,
    period:                     f.period,
    snapshot_date:              f.snapshotDate,
    advance:                    f.advance,
    artist_grant:               f.artistGrant,
    artist_grant_recoupable:    f.artistGrantRecoupable,
    ad_spend:                   f.adSpend,
    marketing_spend:            f.marketingSpend,
    live_shows:                 f.liveShows,
    touring:                    f.touring,
    content_production:         f.contentProduction,
    ar_spend:                   f.arSpend,
    operations_people:          f.operationsPeople,
    other_recoupable:           f.otherRecoupable,
    other_non_recoupable:       f.otherNonRecoupable,
    total_investment:           f.totalInvestment,
    total_recoupable_spend:     f.totalRecoupableSpend,
    total_non_recoupable_spend: f.totalNonRecoupableSpend,
    recoupable_balance:         f.recoupableBalance,
    revenue:                    f.revenue,
    updated_at:                 new Date().toISOString(),
  };
}

function dbToCampaign(r: Record<string, unknown>): CampaignObject {
  return {
    id:             r.id as string,
    artistId:       r.artist_id as string,
    title:          r.title as string,
    type:           r.type as CampaignObject['type'],
    stage:          r.stage as CampaignObject['stage'],
    status:         r.status as CampaignObject['status'],
    budget:         Number(r.budget),
    spendToDate:    Number(r.spend_to_date),
    impressions:    Number(r.impressions),
    clicks:         Number(r.clicks),
    conversions:    Number(r.conversions),
    streamsDriver:  Number(r.streams_driven),
    startDate:      r.start_date as string | null,
    endDate:        r.end_date as string | null,
    platforms:      (r.platforms as string[]) ?? [],
    owner:          r.owner as string,
    notes:          r.notes as string,
  };
}

function campaignToDb(c: Omit<CampaignObject, 'id'>): Record<string, unknown> {
  return {
    artist_id:      c.artistId,
    title:          c.title,
    type:           c.type,
    stage:          c.stage,
    status:         c.status,
    budget:         c.budget,
    spend_to_date:  c.spendToDate,
    impressions:    c.impressions,
    clicks:         c.clicks,
    conversions:    c.conversions,
    streams_driven: c.streamsDriver,
    start_date:     c.startDate,
    end_date:       c.endDate,
    platforms:      c.platforms,
    owner:          c.owner,
    notes:          c.notes,
    updated_at:     new Date().toISOString(),
  };
}

function dbToRelease(r: Record<string, unknown>): ReleaseObject {
  return {
    id:            r.id as string,
    artistId:      r.artist_id as string,
    title:         r.title as string,
    type:          r.type as ReleaseObject['type'],
    status:        r.status as ReleaseObject['status'],
    releaseDate:   r.release_date as string,
    campaignStage: r.campaign_stage as ReleaseObject['campaignStage'],
    streams:       Number(r.streams),
    coverNote:     r.cover_note as string,
  };
}

function dbToDataQuality(r: Record<string, unknown>): DataQualityEntry {
  return {
    id:         r.id as string,
    artistId:   r.artist_id as string,
    fieldName:  r.field_name as string,
    fieldGroup: r.field_group as DataQualityEntry['fieldGroup'],
    status:     r.status as DataQualityEntry['status'],
    notes:      r.notes as string,
  };
}
