import { supabase } from '../../lib/supabase';
import { SIGNED_ARTISTS, type SignedArtist } from './artistRosterData';
import { applyOverridesToArtist } from './artistOverrideService';

export type SocialPlatform = 'spotify' | 'instagram' | 'tiktok' | 'youtube' | 'facebook';

export interface NormalizedSocialLink {
  platform: SocialPlatform;
  raw: string;
  url: string;
  label: string;
  valid: boolean;
}

export interface NormalizedArtist extends SignedArtist {
  _email_clean: string;
  _email_valid: boolean;
  _email_raw: string;
  _phone_clean: string;
  _phone_valid: boolean;
  _phone_raw: string;
  _social_links: NormalizedSocialLink[];
  _issues: ArtistIssue[];
  _data_complete: boolean;
}

export interface ArtistIssue {
  field: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface IngestionReport {
  total: number;
  withEmail: number;
  withPhone: number;
  withAnySocial: number;
  missingEmail: number;
  missingPhone: number;
  missingSocial: number;
  pctEmail: number;
  pctPhone: number;
  pctSocial: number;
  artists: NormalizedArtist[];
  issues: { artistId: string; artistName: string; issues: ArtistIssue[] }[];
  runAt: Date;
  source: string;
}

const SENTINEL_VALUES = new Set(['needs info', 'needs_info', 'pending sync', 'pending_sync', 'tbd', 'n/a', '—', '-', 'none', '']);

function isSentinel(v: string | undefined | null): boolean {
  if (v == null) return true;
  return SENTINEL_VALUES.has(v.trim().toLowerCase());
}

function normalizeEmail(raw: string): { clean: string; valid: boolean } {
  if (isSentinel(raw)) return { clean: '', valid: false };
  const trimmed = raw.trim().toLowerCase();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  return { clean: valid ? trimmed : trimmed, valid };
}

function normalizePhone(raw: string): { clean: string; valid: boolean } {
  if (isSentinel(raw)) return { clean: '', valid: false };
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, '');
  const valid = digits.length >= 10;
  return { clean: trimmed, valid };
}

function ensureHttps(url: string): string {
  if (!url) return '';
  const t = url.trim();
  if (t.startsWith('http://') || t.startsWith('https://')) return t;
  if (t.startsWith('//')) return 'https:' + t;
  if (t.startsWith('www.')) return 'https://' + t;
  return 'https://' + t;
}

function detectPlatform(url: string): SocialPlatform | null {
  const u = url.toLowerCase();
  if (u.includes('spotify.com')) return 'spotify';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('facebook.com') || u.includes('fb.com')) return 'facebook';
  return null;
}

function buildSocialLinks(artist: SignedArtist): NormalizedSocialLink[] {
  const links: NormalizedSocialLink[] = [];

  const rawPairs: { platform: SocialPlatform; raw: string; label: string }[] = [
    { platform: 'spotify',   raw: artist.spotifyLink,   label: 'Spotify' },
    { platform: 'instagram', raw: artist.instagramLink, label: 'Instagram' },
    { platform: 'tiktok',    raw: artist.tiktokLink,    label: 'TikTok' },
    { platform: 'youtube',   raw: artist.youtubeLink,   label: 'YouTube' },
    { platform: 'facebook',  raw: artist.facebookLink,  label: 'Facebook' },
  ];

  for (const { platform, raw, label } of rawPairs) {
    if (isSentinel(raw)) continue;
    const url = ensureHttps(raw);
    const detectedPlatform = detectPlatform(url) ?? platform;
    const valid = url.startsWith('https://') && url.length > 12;
    links.push({ platform: detectedPlatform, raw, url, label, valid });
  }

  return links;
}

function validateArtist(artist: SignedArtist): ArtistIssue[] {
  const issues: ArtistIssue[] = [];

  const { valid: emailValid, clean: emailClean } = normalizeEmail(artist.primaryEmail);
  if (!emailClean) {
    issues.push({ field: 'primaryEmail', severity: 'error', message: 'Email is missing' });
  } else if (!emailValid) {
    issues.push({ field: 'primaryEmail', severity: 'warning', message: `Email may be invalid: "${artist.primaryEmail}"` });
  }

  const { valid: phoneValid } = normalizePhone(artist.artistPhone);
  if (isSentinel(artist.artistPhone)) {
    issues.push({ field: 'artistPhone', severity: 'warning', message: 'Artist phone is missing' });
  } else if (!phoneValid) {
    issues.push({ field: 'artistPhone', severity: 'warning', message: `Phone format may be incorrect: "${artist.artistPhone}"` });
  }

  const socialLinks = buildSocialLinks(artist);
  if (socialLinks.length === 0) {
    issues.push({ field: 'social', severity: 'warning', message: 'No social links found' });
  } else {
    for (const link of socialLinks) {
      if (!link.valid) {
        issues.push({ field: link.platform, severity: 'warning', message: `${link.label} URL may be malformed: "${link.raw}"` });
      }
    }
  }

  if (isSentinel(artist.genre) || artist.genre === 'Needs Info') {
    issues.push({ field: 'genre', severity: 'info', message: 'Genre not yet set' });
  }

  if (isSentinel(artist.city) || artist.city === 'Needs Info') {
    issues.push({ field: 'city', severity: 'info', message: 'City not yet set' });
  }

  return issues;
}

export function normalizeArtist(artist: SignedArtist): NormalizedArtist {
  const patched = applyOverridesToArtist(artist);
  const { clean: emailClean, valid: emailValid } = normalizeEmail(patched.primaryEmail);
  const { clean: phoneClean, valid: phoneValid } = normalizePhone(patched.artistPhone);
  const socialLinks = buildSocialLinks(patched);
  const issues = validateArtist(patched);
  const dataComplete = emailValid && phoneValid && socialLinks.length > 0;

  return {
    ...patched,
    _email_clean: emailClean,
    _email_valid: emailValid,
    _email_raw: patched.primaryEmail,
    _phone_clean: phoneClean,
    _phone_valid: phoneValid,
    _phone_raw: patched.artistPhone,
    _social_links: socialLinks,
    _issues: issues,
    _data_complete: dataComplete,
  };
}

export function runIngestion(source = 'roster_data_ts'): IngestionReport {
  const artists = SIGNED_ARTISTS.map(normalizeArtist);
  const total = artists.length;

  const withEmail    = artists.filter(a => a._email_valid).length;
  const withPhone    = artists.filter(a => a._phone_valid).length;
  const withAnySocial = artists.filter(a => a._social_links.length > 0).length;

  const missingEmail   = total - withEmail;
  const missingPhone   = total - withPhone;
  const missingSocial  = total - withAnySocial;

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100 * 100) / 100 : 0;

  const allIssues = artists
    .filter(a => a._issues.length > 0)
    .map(a => ({ artistId: a.id, artistName: a.name, issues: a._issues }));

  return {
    total,
    withEmail,
    withPhone,
    withAnySocial,
    missingEmail,
    missingPhone,
    missingSocial,
    pctEmail:   pct(withEmail),
    pctPhone:   pct(withPhone),
    pctSocial:  pct(withAnySocial),
    artists,
    issues: allIssues,
    runAt: new Date(),
    source,
  };
}

export async function saveIngestionReport(report: IngestionReport): Promise<void> {
  try {
    await supabase.from('roster_ingestion_log').insert({
      total_artists:           report.total,
      artists_with_email:      report.withEmail,
      artists_with_phone:      report.withPhone,
      artists_with_any_social: report.withAnySocial,
      artists_missing_email:   report.missingEmail,
      artists_missing_phone:   report.missingPhone,
      artists_missing_social:  report.missingSocial,
      pct_email_coverage:      report.pctEmail,
      pct_phone_coverage:      report.pctPhone,
      pct_social_coverage:     report.pctSocial,
      issues: report.issues.map(i => ({
        artistId: i.artistId,
        artistName: i.artistName,
        issues: i.issues,
      })),
      source: report.source,
      notes: `Run at ${report.runAt.toISOString()}`,
    });
  } catch (err) {
    console.warn('Could not save ingestion report to Supabase:', err);
  }
}

export const PLATFORM_META: Record<SocialPlatform, { label: string; color: string; bg: string }> = {
  spotify:   { label: 'Spotify',   color: '#1DB954', bg: 'rgba(29,185,84,0.1)' },
  instagram: { label: 'Instagram', color: '#E1306C', bg: 'rgba(225,48,108,0.1)' },
  tiktok:    { label: 'TikTok',    color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  youtube:   { label: 'YouTube',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  facebook:  { label: 'Facebook',  color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
};
