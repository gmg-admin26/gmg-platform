// ============================================================
// Artist OS — External Data Enrichment Service
// Manages per-field provenance, API integration points,
// manual overrides, and sync state.
// ============================================================

import { supabase } from '../../lib/supabase';

// ─── Core types ──────────────────────────────────────────────

export type FieldGroup =
  | 'spotify'
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'geography'
  | 'demographics'
  | 'similar_artists';

export type SourceStatus = 'live' | 'pending_api' | 'manual_override';

export interface EnrichmentField {
  id: string;
  artistId: string;
  fieldKey: string;
  fieldGroup: FieldGroup;
  displayLabel: string;
  rawValue: string | null;
  sourceStatus: SourceStatus;
  apiSource: string;
  lastSyncedAt: string | null;
  manualValue: string | null;
  manualSetBy: string;
  manualSetAt: string | null;
  autoRefresh: boolean;
  updatedAt: string;
}

export interface SyncLogEntry {
  id: string;
  artistId: string;
  integration: string;
  status: 'success' | 'failed' | 'partial';
  recordsUpdated: number;
  errorMsg: string | null;
  syncedAt: string;
}

// ─── Field catalogue — all integration points ────────────────

export interface FieldDefinition {
  key: string;
  group: FieldGroup;
  label: string;
  apiSource: string;
  description: string;
  unit?: string;
  expectedType: 'number' | 'string' | 'json' | 'percent';
}

export const FIELD_CATALOGUE: FieldDefinition[] = [
  // Spotify
  { key: 'spotify.monthly_listeners',  group: 'spotify', label: 'Monthly Listeners',    apiSource: 'Spotify API', description: 'Unique monthly listeners on Spotify',          unit: '',   expectedType: 'number'  },
  { key: 'spotify.total_streams',      group: 'spotify', label: 'Total Streams',         apiSource: 'Spotify API', description: 'All-time stream count across catalog',          unit: '',   expectedType: 'number'  },
  { key: 'spotify.followers',          group: 'spotify', label: 'Followers',             apiSource: 'Spotify API', description: 'Spotify profile followers',                     unit: '',   expectedType: 'number'  },
  { key: 'spotify.popularity',         group: 'spotify', label: 'Popularity Score',      apiSource: 'Spotify API', description: 'Spotify popularity index (0–100)',              unit: '/100', expectedType: 'number'},
  { key: 'spotify.top_track',          group: 'spotify', label: 'Top Track',             apiSource: 'Spotify API', description: 'Most-streamed track name',                      expectedType: 'string'  },
  { key: 'spotify.top_track_streams',  group: 'spotify', label: 'Top Track Streams',     apiSource: 'Spotify API', description: 'Stream count of top track',                     expectedType: 'number'  },
  { key: 'spotify.playlist_adds_30d',  group: 'spotify', label: 'Playlist Adds (30d)',   apiSource: 'Spotify API', description: 'New playlist additions in last 30 days',         expectedType: 'number'  },
  { key: 'spotify.saves_30d',          group: 'spotify', label: 'Saves (30d)',           apiSource: 'Spotify API', description: 'Track saves in last 30 days',                   expectedType: 'number'  },
  { key: 'spotify.listener_growth_7d', group: 'spotify', label: 'Listener Growth (7d)',  apiSource: 'Spotify API', description: '7-day listener growth percentage',               unit: '%',  expectedType: 'percent' },
  { key: 'spotify.top_tracks_json',    group: 'spotify', label: 'Top 5 Tracks',          apiSource: 'Spotify API', description: 'JSON array of top 5 tracks with stream counts',  expectedType: 'json'    },

  // TikTok
  { key: 'tiktok.followers',           group: 'tiktok',  label: 'Followers',             apiSource: 'TikTok API',  description: 'TikTok profile followers',                      expectedType: 'number'  },
  { key: 'tiktok.video_views_30d',     group: 'tiktok',  label: 'Video Views (30d)',      apiSource: 'TikTok API',  description: 'Total video views in last 30 days',             expectedType: 'number'  },
  { key: 'tiktok.sound_creations',     group: 'tiktok',  label: 'Sound Creations',        apiSource: 'TikTok API',  description: 'Videos created using artist sounds',            expectedType: 'number'  },
  { key: 'tiktok.avg_video_views',     group: 'tiktok',  label: 'Avg Video Views',        apiSource: 'TikTok API',  description: 'Average views per video',                       expectedType: 'number'  },
  { key: 'tiktok.engagement_rate',     group: 'tiktok',  label: 'Engagement Rate',        apiSource: 'TikTok API',  description: 'Likes + comments + shares / views',             unit: '%',  expectedType: 'percent' },
  { key: 'tiktok.trending_sounds',     group: 'tiktok',  label: 'Trending Sounds',        apiSource: 'TikTok API',  description: 'Number of tracks currently trending',           expectedType: 'number'  },

  // Instagram
  { key: 'instagram.followers',        group: 'instagram', label: 'Followers',            apiSource: 'Instagram Graph API', description: 'Instagram profile followers',            expectedType: 'number'  },
  { key: 'instagram.following',        group: 'instagram', label: 'Following',            apiSource: 'Instagram Graph API', description: 'Accounts followed',                     expectedType: 'number'  },
  { key: 'instagram.post_count',       group: 'instagram', label: 'Post Count',           apiSource: 'Instagram Graph API', description: 'Total published posts',                  expectedType: 'number'  },
  { key: 'instagram.avg_likes',        group: 'instagram', label: 'Avg Likes',            apiSource: 'Instagram Graph API', description: 'Average likes per post (last 30 posts)', expectedType: 'number'  },
  { key: 'instagram.avg_comments',     group: 'instagram', label: 'Avg Comments',         apiSource: 'Instagram Graph API', description: 'Average comments per post',              expectedType: 'number'  },
  { key: 'instagram.engagement_rate',  group: 'instagram', label: 'Engagement Rate',      apiSource: 'Instagram Graph API', description: 'Engagement rate percentage',             unit: '%',  expectedType: 'percent' },
  { key: 'instagram.story_views',      group: 'instagram', label: 'Story Views (7d)',     apiSource: 'Instagram Graph API', description: 'Story views in last 7 days',             expectedType: 'number'  },
  { key: 'instagram.reach_30d',        group: 'instagram', label: 'Reach (30d)',          apiSource: 'Instagram Graph API', description: 'Unique accounts reached in 30 days',    expectedType: 'number'  },

  // YouTube
  { key: 'youtube.subscribers',        group: 'youtube', label: 'Subscribers',            apiSource: 'YouTube Data API', description: 'YouTube channel subscribers',              expectedType: 'number'  },
  { key: 'youtube.total_views',        group: 'youtube', label: 'Total Views',            apiSource: 'YouTube Data API', description: 'All-time channel views',                   expectedType: 'number'  },
  { key: 'youtube.views_30d',          group: 'youtube', label: 'Views (30d)',            apiSource: 'YouTube Data API', description: 'Views in last 30 days',                    expectedType: 'number'  },
  { key: 'youtube.watch_time_hours',   group: 'youtube', label: 'Watch Time (hrs)',        apiSource: 'YouTube Data API', description: 'Total watch time in hours',                expectedType: 'number'  },
  { key: 'youtube.avg_view_duration',  group: 'youtube', label: 'Avg View Duration',      apiSource: 'YouTube Data API', description: 'Average seconds watched per view',         unit: 's',  expectedType: 'number'  },
  { key: 'youtube.top_video',          group: 'youtube', label: 'Top Video',              apiSource: 'YouTube Data API', description: 'Most viewed video title',                   expectedType: 'string'  },

  // Geography
  { key: 'geo.top_city_1',             group: 'geography', label: 'Top City #1',          apiSource: 'Spotify API / Chartmetric', description: 'City with highest listener concentration', expectedType: 'string' },
  { key: 'geo.top_city_2',             group: 'geography', label: 'Top City #2',          apiSource: 'Spotify API / Chartmetric', description: 'Second city by listener count',           expectedType: 'string' },
  { key: 'geo.top_city_3',             group: 'geography', label: 'Top City #3',          apiSource: 'Spotify API / Chartmetric', description: 'Third city by listener count',            expectedType: 'string' },
  { key: 'geo.top_country_1',          group: 'geography', label: 'Top Country #1',       apiSource: 'Spotify API / Chartmetric', description: 'Country with highest listener concentration', expectedType: 'string' },
  { key: 'geo.top_country_2',          group: 'geography', label: 'Top Country #2',       apiSource: 'Spotify API / Chartmetric', description: 'Second country by listener count',        expectedType: 'string' },
  { key: 'geo.fan_map_json',           group: 'geography', label: 'Fan Map Data',         apiSource: 'Chartmetric', description: 'JSON array of city-level fan concentration data', expectedType: 'json'   },
  { key: 'geo.fastest_growing_city',   group: 'geography', label: 'Fastest Growing City', apiSource: 'Chartmetric', description: 'City with highest month-over-month growth',     expectedType: 'string' },
  { key: 'geo.international_pct',      group: 'geography', label: 'International %',      apiSource: 'Spotify API', description: 'Percent of listeners outside home country',     unit: '%',  expectedType: 'percent' },

  // Demographics
  { key: 'demo.age_13_17_pct',         group: 'demographics', label: 'Age 13–17 %',       apiSource: 'Spotify API / Meta', description: 'Percentage of audience aged 13–17',    unit: '%',  expectedType: 'percent' },
  { key: 'demo.age_18_24_pct',         group: 'demographics', label: 'Age 18–24 %',       apiSource: 'Spotify API / Meta', description: 'Percentage of audience aged 18–24',    unit: '%',  expectedType: 'percent' },
  { key: 'demo.age_25_34_pct',         group: 'demographics', label: 'Age 25–34 %',       apiSource: 'Spotify API / Meta', description: 'Percentage of audience aged 25–34',    unit: '%',  expectedType: 'percent' },
  { key: 'demo.age_35_44_pct',         group: 'demographics', label: 'Age 35–44 %',       apiSource: 'Spotify API / Meta', description: 'Percentage of audience aged 35–44',    unit: '%',  expectedType: 'percent' },
  { key: 'demo.age_45_plus_pct',       group: 'demographics', label: 'Age 45+ %',         apiSource: 'Spotify API / Meta', description: 'Percentage of audience aged 45+',      unit: '%',  expectedType: 'percent' },
  { key: 'demo.gender_male_pct',       group: 'demographics', label: 'Gender — Male %',   apiSource: 'Spotify API / Meta', description: 'Male audience percentage',             unit: '%',  expectedType: 'percent' },
  { key: 'demo.gender_female_pct',     group: 'demographics', label: 'Gender — Female %', apiSource: 'Spotify API / Meta', description: 'Female audience percentage',           unit: '%',  expectedType: 'percent' },
  { key: 'demo.peak_listening_hour',   group: 'demographics', label: 'Peak Listening Hour',apiSource: 'Spotify API',        description: 'Hour of day with highest stream count', expectedType: 'string' },
  { key: 'demo.core_demographic',      group: 'demographics', label: 'Core Demographic',  apiSource: 'Spotify API / Meta', description: 'Primary audience segment description', expectedType: 'string' },

  // Similar artists
  { key: 'similar.artist_1',           group: 'similar_artists', label: 'Similar Artist #1', apiSource: 'Spotify API', description: 'Most similar artist by Spotify', expectedType: 'string' },
  { key: 'similar.artist_2',           group: 'similar_artists', label: 'Similar Artist #2', apiSource: 'Spotify API', description: 'Second similar artist',          expectedType: 'string' },
  { key: 'similar.artist_3',           group: 'similar_artists', label: 'Similar Artist #3', apiSource: 'Spotify API', description: 'Third similar artist',           expectedType: 'string' },
  { key: 'similar.collab_suggestion_1',group: 'similar_artists', label: 'Top Collab Match',  apiSource: 'Chartmetric / Internal', description: 'AI-recommended collaboration match', expectedType: 'string' },
  { key: 'similar.shared_audience_pct',group: 'similar_artists', label: 'Shared Audience %', apiSource: 'Chartmetric', description: 'Audience overlap with closest peer', unit: '%', expectedType: 'percent' },
  { key: 'similar.fans_also_like_json',group: 'similar_artists', label: 'Fans Also Like',    apiSource: 'Spotify API', description: 'JSON list of artists fans also stream', expectedType: 'json' },
];

// ─── Integration connector metadata ─────────────────────────

export interface IntegrationConnector {
  id: string;
  label: string;
  description: string;
  color: string;
  fields: string[];
  authType: 'oauth2' | 'api_key' | 'webhook';
  docsUrl: string;
  status: 'connected' | 'not_connected' | 'pending_auth' | 'error';
}

export const INTEGRATIONS: IntegrationConnector[] = [
  {
    id: 'spotify',
    label: 'Spotify for Artists',
    description: 'Monthly listeners, streams, top tracks, playlist adds, saves, fan geography',
    color: '#1DB954',
    authType: 'oauth2',
    docsUrl: 'https://developer.spotify.com/documentation/web-api',
    status: 'pending_auth',
    fields: FIELD_CATALOGUE.filter(f => f.group === 'spotify').map(f => f.key),
  },
  {
    id: 'tiktok',
    label: 'TikTok Creator API',
    description: 'Followers, video views, sound creations, engagement rate, trending sounds',
    color: '#FE2C55',
    authType: 'oauth2',
    docsUrl: 'https://developers.tiktok.com',
    status: 'pending_auth',
    fields: FIELD_CATALOGUE.filter(f => f.group === 'tiktok').map(f => f.key),
  },
  {
    id: 'instagram',
    label: 'Instagram Graph API',
    description: 'Followers, engagement, story views, reach, post analytics',
    color: '#E1306C',
    authType: 'oauth2',
    docsUrl: 'https://developers.facebook.com/docs/instagram-api',
    status: 'pending_auth',
    fields: FIELD_CATALOGUE.filter(f => f.group === 'instagram').map(f => f.key),
  },
  {
    id: 'youtube',
    label: 'YouTube Data API v3',
    description: 'Subscribers, total views, watch time, top videos, audience retention',
    color: '#FF0000',
    authType: 'api_key',
    docsUrl: 'https://developers.google.com/youtube/v3',
    status: 'not_connected',
    fields: FIELD_CATALOGUE.filter(f => f.group === 'youtube').map(f => f.key),
  },
  {
    id: 'chartmetric',
    label: 'Chartmetric',
    description: 'Fan map data, city-level geography, similar artists, audience overlap',
    color: '#7C3AED',
    authType: 'api_key',
    docsUrl: 'https://api.chartmetric.com/apidoc/',
    status: 'not_connected',
    fields: [
      ...FIELD_CATALOGUE.filter(f => f.group === 'geography').map(f => f.key),
      ...FIELD_CATALOGUE.filter(f => f.group === 'similar_artists').map(f => f.key),
    ],
  },
  {
    id: 'meta',
    label: 'Meta Business API',
    description: 'Audience demographics, ad performance, Instagram insights',
    color: '#1877F2',
    authType: 'oauth2',
    docsUrl: 'https://developers.facebook.com/docs/marketing-api',
    status: 'not_connected',
    fields: FIELD_CATALOGUE.filter(f => f.group === 'demographics').map(f => f.key),
  },
];

// ─── DB row mapper ───────────────────────────────────────────

function dbToField(r: Record<string, unknown>): EnrichmentField {
  return {
    id:           r.id as string,
    artistId:     r.artist_id as string,
    fieldKey:     r.field_key as string,
    fieldGroup:   r.field_group as FieldGroup,
    displayLabel: r.display_label as string,
    rawValue:     r.raw_value as string | null,
    sourceStatus: r.source_status as SourceStatus,
    apiSource:    r.api_source as string,
    lastSyncedAt: r.last_synced_at as string | null,
    manualValue:  r.manual_value as string | null,
    manualSetBy:  r.manual_set_by as string,
    manualSetAt:  r.manual_set_at as string | null,
    autoRefresh:  r.auto_refresh as boolean,
    updatedAt:    r.updated_at as string,
  };
}

// ─── Service functions ───────────────────────────────────────

export async function fetchEnrichmentFields(artistId: string): Promise<EnrichmentField[]> {
  const { data, error } = await supabase
    .from('aos_enrichment_fields')
    .select('*')
    .eq('artist_id', artistId);
  if (error || !data) return [];
  return data.map(r => dbToField(r as Record<string, unknown>));
}

export async function fetchAllEnrichmentFields(): Promise<EnrichmentField[]> {
  const { data, error } = await supabase
    .from('aos_enrichment_fields')
    .select('*')
    .order('artist_id');
  if (error || !data) return [];
  return data.map(r => dbToField(r as Record<string, unknown>));
}

export async function upsertEnrichmentField(
  artistId: string,
  fieldDef: FieldDefinition,
  value: string | null,
  status: SourceStatus,
  extra?: { manualSetBy?: string; lastSyncedAt?: string }
): Promise<{ error: string | null }> {
  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    artist_id:      artistId,
    field_key:      fieldDef.key,
    field_group:    fieldDef.group,
    display_label:  fieldDef.label,
    api_source:     fieldDef.apiSource,
    source_status:  status,
    updated_at:     now,
  };

  if (status === 'manual_override') {
    payload.manual_value  = value;
    payload.manual_set_by = extra?.manualSetBy ?? 'Admin';
    payload.manual_set_at = now;
    payload.raw_value     = value;
  } else {
    payload.raw_value      = value;
    payload.last_synced_at = extra?.lastSyncedAt ?? now;
  }

  const { error } = await supabase
    .from('aos_enrichment_fields')
    .upsert(payload, { onConflict: 'artist_id,field_key' });

  return { error: error?.message ?? null };
}

export async function setManualOverride(
  artistId: string,
  fieldKey: string,
  value: string,
  setBy: string
): Promise<{ error: string | null }> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from('aos_enrichment_fields')
    .upsert({
      artist_id:      artistId,
      field_key:      fieldKey,
      source_status:  'manual_override',
      manual_value:   value,
      raw_value:      value,
      manual_set_by:  setBy,
      manual_set_at:  now,
      updated_at:     now,
    }, { onConflict: 'artist_id,field_key' });

  return { error: error?.message ?? null };
}

export async function clearManualOverride(
  artistId: string,
  fieldKey: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('aos_enrichment_fields')
    .update({
      source_status: 'pending_api',
      manual_value:  null,
      manual_set_by: '',
      manual_set_at: null,
      updated_at:    new Date().toISOString(),
    })
    .eq('artist_id', artistId)
    .eq('field_key', fieldKey);

  return { error: error?.message ?? null };
}

export async function logSyncAttempt(
  artistId: string,
  integration: string,
  status: 'success' | 'failed' | 'partial',
  recordsUpdated: number,
  errorMsg?: string
): Promise<void> {
  await supabase.from('aos_enrichment_sync_log').insert({
    artist_id:        artistId,
    integration,
    status,
    records_updated:  recordsUpdated,
    error_msg:        errorMsg ?? null,
  });
}

export async function fetchSyncLog(artistId?: string): Promise<SyncLogEntry[]> {
  let query = supabase
    .from('aos_enrichment_sync_log')
    .select('*')
    .order('synced_at', { ascending: false })
    .limit(100);

  if (artistId) query = query.eq('artist_id', artistId);

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(r => ({
    id:             r.id as string,
    artistId:       r.artist_id as string,
    integration:    r.integration as string,
    status:         r.status as SyncLogEntry['status'],
    recordsUpdated: r.records_updated as number,
    errorMsg:       r.error_msg as string | null,
    syncedAt:       r.synced_at as string,
  }));
}

// ─── Stub: simulate incoming API data ────────────────────────
// In production this would be called by a Supabase Edge Function
// scheduled via pg_cron or triggered via webhook.

export async function simulateApiSync(artistId: string, integration: string): Promise<{ fieldsUpdated: number }> {
  const group = integration as FieldGroup;
  const fields = FIELD_CATALOGUE.filter(f => f.group === group);
  let count = 0;
  const syncedAt = new Date().toISOString();

  for (const def of fields) {
    if (def.expectedType === 'json') continue;
    const mockVal = generateMockValue(def);
    const { error } = await upsertEnrichmentField(artistId, def, mockVal, 'live', { lastSyncedAt: syncedAt });
    if (!error) count++;
  }

  await logSyncAttempt(artistId, integration, 'success', count);
  return { fieldsUpdated: count };
}

function generateMockValue(def: FieldDefinition): string {
  switch (def.expectedType) {
    case 'number': {
      const ranges: Record<string, [number, number]> = {
        'spotify.monthly_listeners':  [50000, 2000000],
        'spotify.total_streams':      [500000, 50000000],
        'spotify.followers':          [10000, 800000],
        'spotify.popularity':         [30, 90],
        'spotify.top_track_streams':  [100000, 10000000],
        'spotify.playlist_adds_30d':  [50, 5000],
        'spotify.saves_30d':          [200, 20000],
        'tiktok.followers':           [5000, 500000],
        'tiktok.video_views_30d':     [10000, 2000000],
        'tiktok.sound_creations':     [100, 50000],
        'tiktok.avg_video_views':     [1000, 100000],
        'tiktok.trending_sounds':     [0, 5],
        'instagram.followers':        [5000, 300000],
        'instagram.post_count':       [50, 2000],
        'instagram.avg_likes':        [200, 20000],
        'instagram.avg_comments':     [20, 2000],
        'instagram.story_views':      [500, 50000],
        'instagram.reach_30d':        [5000, 500000],
        'youtube.subscribers':        [1000, 200000],
        'youtube.total_views':        [50000, 10000000],
        'youtube.views_30d':          [5000, 500000],
        'youtube.watch_time_hours':   [1000, 100000],
        'youtube.avg_view_duration':  [60, 300],
      };
      const [lo, hi] = ranges[def.key] ?? [100, 10000];
      return Math.round(lo + Math.random() * (hi - lo)).toString();
    }
    case 'percent':
      return (5 + Math.random() * 45).toFixed(1);
    case 'string': {
      const strings: Record<string, string[]> = {
        'spotify.top_track':           ['Night Circuit', 'Voltage Dreams', 'Static Love', 'Golden Hour', 'Echo Chamber'],
        'geo.top_city_1':              ['New York', 'Los Angeles', 'Atlanta', 'Chicago', 'Houston'],
        'geo.top_city_2':              ['Miami', 'Dallas', 'Philadelphia', 'Phoenix', 'San Antonio'],
        'geo.top_city_3':              ['Austin', 'Nashville', 'Seattle', 'Denver', 'Charlotte'],
        'geo.top_country_1':           ['United States', 'Canada', 'United Kingdom', 'Australia'],
        'geo.top_country_2':           ['Germany', 'France', 'Brazil', 'Mexico', 'Sweden'],
        'geo.fastest_growing_city':    ['Atlanta', 'Phoenix', 'Austin', 'Charlotte', 'Nashville'],
        'demo.peak_listening_hour':    ['10 PM', '11 PM', '9 PM', '8 PM', '12 AM'],
        'demo.core_demographic':       ['18–24 Urban Female', '25–34 Male', '18–24 Gen Z', '25–34 Urban'],
        'youtube.top_video':           ['Official Music Video', 'Live Performance', 'Studio Session', 'Lyric Video'],
        'similar.artist_1':            ['SZA', 'Frank Ocean', 'The Weeknd', 'Summer Walker', 'Daniel Caesar'],
        'similar.artist_2':            ['Jhene Aiko', 'Khalid', 'Cautious Clay', 'H.E.R.', 'Kehlani'],
        'similar.artist_3':            ['Ravyn Lenae', 'Mereba', 'Syd', 'Masego', 'Ari Lennox'],
        'similar.collab_suggestion_1': ['Kaytranada', 'Dev Hynes', 'Steve Lacy', 'Sango', 'Kahlid'],
      };
      const opts = strings[def.key] ?? ['Value pending'];
      return opts[Math.floor(Math.random() * opts.length)];
    }
    default:
      return '';
  }
}

// ─── Computed enrichment summary for a single artist ─────────

export interface EnrichmentSummary {
  artistId: string;
  totalFields: number;
  liveCount: number;
  pendingCount: number;
  manualCount: number;
  coveragePct: number;
  lastSyncedAt: string | null;
}

export function computeEnrichmentSummary(
  artistId: string,
  fields: EnrichmentField[]
): EnrichmentSummary {
  const artistFields = fields.filter(f => f.artistId === artistId);
  const liveCount    = artistFields.filter(f => f.sourceStatus === 'live').length;
  const manualCount  = artistFields.filter(f => f.sourceStatus === 'manual_override').length;
  const pendingCount = (FIELD_CATALOGUE.length - liveCount - manualCount);
  const syncedDates  = artistFields
    .map(f => f.lastSyncedAt)
    .filter((d): d is string => d !== null)
    .sort()
    .reverse();

  return {
    artistId,
    totalFields:  FIELD_CATALOGUE.length,
    liveCount,
    pendingCount,
    manualCount,
    coveragePct:  Math.round(((liveCount + manualCount) / FIELD_CATALOGUE.length) * 100),
    lastSyncedAt: syncedDates[0] ?? null,
  };
}
