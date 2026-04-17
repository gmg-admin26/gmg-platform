// ============================================================
// Artist OS — Normalized Data Schema (TypeScript)
// Single source of truth for all object shapes used in
// Artist OS, matching the Supabase tables 1:1.
// ============================================================

// ─── Enums / union types ────────────────────────────────────

export type RosterTier = 'Growth Roster' | 'Base Roster' | 'Label Roster' | 'Priority';

export type RosterStatus =
  | 'Active'
  | 'On Hold'
  | 'Recouping'
  | 'Inactive'
  | 'Priority'
  | 'New Signing'
  | 'Pending Sync';

export type ReleaseStatus =
  | 'Released'
  | 'In Production'
  | 'Scheduled'
  | 'Blocked'
  | 'Pre-Save Live'
  | 'No Active Release';

export type CampaignStage =
  | 'Pre-Release'
  | 'Launch Week'
  | 'Active Push'
  | 'Sustain'
  | 'Wind Down'
  | 'Standby';

export type CampaignType =
  | 'release'
  | 'brand'
  | 'touring'
  | 'content'
  | 'awareness'
  | 'retargeting'
  | 'playlist';

export type CampaignStatus = 'active' | 'paused' | 'completed' | 'draft' | 'cancelled';

export type ContactRole =
  | 'manager'
  | 'ar_rep'
  | 'booking'
  | 'legal'
  | 'publicist'
  | 'label_contact'
  | 'artist_self'
  | 'other';

export type LabelType = 'GMG_internal' | 'external_partner' | 'distribution';

export type FinancialPeriod = 'all_time' | 'ytd' | 'last_30';

export type DataFieldStatus =
  | 'present'
  | 'missing'
  | 'pending_nebula'
  | 'stale'
  | 'needs_review';

export type DataFieldGroup =
  | 'identity'
  | 'streaming'
  | 'social'
  | 'contact'
  | 'financial'
  | 'release'
  | 'campaign'
  | 'internal';

// ─── 1. ARTIST OBJECT ───────────────────────────────────────

export interface ArtistObject {
  id: string;
  name: string;
  avatarInitials: string;
  avatarColor: string;

  // Classification
  tier: RosterTier;
  status: RosterStatus;
  genre: string;
  subgenre: string;

  // Location
  city: string;
  country: string;
  market: string;

  // Identity
  signingDate: string;
  labelImprint: string;

  // Streaming metrics (Nebula-sourced when synced)
  healthScore: number;
  monthlyListeners: number;
  activeListeners: number;
  totalStreams: number;
  streamingAtSigning: number;
  followers: number;
  fanEngagementScore: number;

  // Platform links + followers
  spotifyLink: string;
  spotifyFollowers: number;
  instagramLink: string;
  instagramHandle: string;
  instagramFollowers: number;
  tiktokLink: string;
  youtubeLink: string;
  youtubeFollowers: number;
  facebookLink: string;
  topPlatform: string;

  // Direct contact
  artistPhone: string;
  primaryEmail: string;

  // Internal team
  arRep: string;
  pointPerson: string;
  manager: string;
  managementContact: string;
  managerPhone: string;

  // Notes
  rosterNotes: string;
  internalNotes: string;

  // Velocity deltas (display strings until Nebula syncs)
  streamingDelta: string;
  followerDelta: string;
  activeListenerDelta: string;

  // Data quality
  dataQualityScore: number;
  nebulasSynced: boolean;
  lastSyncedAt: string | null;
}

// ─── 2. LABEL OBJECT ────────────────────────────────────────

export interface LabelObject {
  id: string;
  name: string;
  type: LabelType;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  notes: string;
}

// ─── 3. CONTACT OBJECT ──────────────────────────────────────

export interface ContactObject {
  id: string;
  artistId: string;
  fullName: string;
  role: ContactRole;
  email: string;
  phone: string;
  company: string;
  isPrimary: boolean;
  notes: string;
}

// ─── 4. FINANCIAL OBJECT ────────────────────────────────────

export interface FinancialObject {
  id: string;
  artistId: string;
  period: FinancialPeriod;
  snapshotDate: string;

  // Investment categories
  advance: number;
  artistGrant: number;
  artistGrantRecoupable: boolean;
  adSpend: number;
  marketingSpend: number;
  liveShows: number;
  touring: number;
  contentProduction: number;
  arSpend: number;
  operationsPeople: number;
  otherRecoupable: number;
  otherNonRecoupable: number;

  // Totals
  totalInvestment: number;
  totalRecoupableSpend: number;
  totalNonRecoupableSpend: number;
  recoupableBalance: number;
  revenue: number;
}

// ─── 5. CAMPAIGN OBJECT ─────────────────────────────────────

export interface CampaignObject {
  id: string;
  artistId: string;
  title: string;
  type: CampaignType;
  stage: CampaignStage;
  status: CampaignStatus;
  budget: number;
  spendToDate: number;
  impressions: number;
  clicks: number;
  conversions: number;
  streamsDriver: number;
  startDate: string | null;
  endDate: string | null;
  platforms: string[];
  owner: string;
  notes: string;
}

// ─── 6. RELEASE OBJECT ──────────────────────────────────────

export interface ReleaseObject {
  id: string;
  artistId: string;
  title: string;
  type: 'Single' | 'EP' | 'Album' | 'Mixtape';
  status: ReleaseStatus;
  releaseDate: string;
  campaignStage: CampaignStage;
  streams: number;
  coverNote: string;
}

// ─── 7. DATA QUALITY ENTRY ──────────────────────────────────

export interface DataQualityEntry {
  id: string;
  artistId: string;
  fieldName: string;
  fieldGroup: DataFieldGroup;
  status: DataFieldStatus;
  notes: string;
}
