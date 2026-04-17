import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Search, AlertTriangle, CheckCircle, RefreshCcw, BarChart2, X, Info, Music, Camera, Video, Globe, Eye, CreditCard as Edit2, CheckSquare, XCircle, ExternalLink, ChevronDown } from 'lucide-react';
import { type RosterStatus, type RosterTier } from '../data/artistRosterData';
import {
  runIngestion,
  saveIngestionReport,
  type NormalizedArtist,
  type IngestionReport,
  type SocialPlatform,
  type ArtistIssue,
  PLATFORM_META,
} from '../data/rosterIngestionService';
import { loadAllOverrides } from '../data/artistOverrideService';

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const TIER_COLORS: Record<RosterTier, string> = {
  Priority:       '#EF4444',
  'Growth Roster': '#06B6D4',
  'Base Roster':   '#F59E0B',
  'Label Roster':  '#10B981',
};

const STATUS_COLORS: Record<RosterStatus, string> = {
  Priority:      '#EF4444',
  Active:        '#10B981',
  Recouping:     '#F59E0B',
  'On Hold':     '#6B7280',
  Inactive:      '#374151',
  'New Signing': '#06B6D4',
  'Pending Sync': '#8B5CF6',
};

const SOCIAL_ICONS: Record<SocialPlatform, React.ElementType> = {
  spotify:   Music,
  instagram: Camera,
  tiktok:    Video,
  youtube:   Video,
  facebook:  Globe,
};

function SocialLinkBadge({ link }: { link: { platform: SocialPlatform; url: string; label: string; valid: boolean } }) {
  const meta = PLATFORM_META[link.platform];
  const Icon = SOCIAL_ICONS[link.platform];
  if (!link.valid) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: '2px 7px', borderRadius: 6,
        fontFamily: 'monospace', fontSize: 9,
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        color: '#EF4444',
      }}>
        <Icon size={9} color="#EF4444" />
        {meta.label} ⚠
      </span>
    );
  }
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 7px', borderRadius: 6,
        fontFamily: 'monospace', fontSize: 9,
        background: meta.bg,
        border: `1px solid ${meta.color}25`,
        color: meta.color,
        textDecoration: 'none',
        transition: 'filter 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.3)')}
      onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      <Icon size={9} color={meta.color} />
      {meta.label}
      <ExternalLink size={8} color={meta.color} />
    </a>
  );
}

function CoverageBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color }}>{value.toFixed(0)}%</span>
      </div>
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}80)`,
          borderRadius: 4,
          boxShadow: `0 0 8px ${color}40`,
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  );
}

type IssueFilter = 'all' | 'errors' | 'warnings' | 'missing_email' | 'missing_phone' | 'missing_social' | 'missing_label' | 'parsing_errors';

type NormalizedIssueRow = {
  artist_name: string;
  artistId: string;
  issue_type: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  _rowKey: string;
};

function toIssueType(severity: string | undefined): 'error' | 'warning' | 'info' {
  if (severity === 'error') return 'error';
  if (severity === 'warning') return 'warning';
  return 'info';
}

function toSeverityLevel(severity: string | undefined, field: string | undefined): 'critical' | 'high' | 'medium' | 'low' {
  if (severity === 'error') return (field === 'primaryEmail') ? 'critical' : 'high';
  if (severity === 'warning') return 'medium';
  return 'low';
}

function flattenIssues(
  rawIssues: { artistId: string; artistName: string; issues: ArtistIssue[] }[]
): NormalizedIssueRow[] {
  const rows: NormalizedIssueRow[] = [];
  if (!Array.isArray(rawIssues)) return rows;
  rawIssues.forEach((entry, ei) => {
    if (!entry || typeof entry !== 'object') return;
    const artistId   = (typeof entry.artistId   === 'string' && entry.artistId)   ? entry.artistId   : `unknown-${ei}`;
    const artistName = (typeof entry.artistName === 'string' && entry.artistName) ? entry.artistName : 'Unknown Artist';
    const issues = Array.isArray(entry.issues) ? entry.issues : [];
    issues.forEach((issue, ii) => {
      if (!issue || typeof issue !== 'object') return;
      const field   = (typeof issue.field   === 'string' && issue.field)   ? issue.field   : 'Unknown Field';
      const message = (typeof issue.message === 'string' && issue.message) ? issue.message : 'No description available';
      const rawSev  = typeof issue.severity === 'string' ? issue.severity : undefined;
      rows.push({
        artist_name: artistName,
        artistId,
        issue_type: toIssueType(rawSev),
        field,
        message,
        severity: toSeverityLevel(rawSev, field),
        _rowKey: `${artistId}-${field}-${ii}`,
      });
    });
  });
  return rows;
}

function getSuggestedFix(field: string): string {
  if (field === 'primaryEmail') return 'Update roster source or add email via Edit Artist';
  if (field === 'artistPhone') return 'Request phone from artist or manager';
  if (field === 'social') return 'Verify roster workbook — check Spotify, Instagram, TikTok cells';
  if (field === 'genre') return 'Set genre in artist profile';
  if (field === 'city') return 'Add city in artist profile';
  if (['spotify', 'instagram', 'tiktok', 'youtube', 'facebook'].includes(field)) return 'Verify URL format — must begin with https://';
  return 'Review artist record and update manually';
}

function getIssueTypeLabel(field: string): string {
  if (field === 'primaryEmail') return 'Missing Email';
  if (field === 'artistPhone') return 'Missing Phone';
  if (field === 'social') return 'No Social Links';
  if (field === 'genre') return 'Missing Genre';
  if (field === 'city') return 'Missing Location';
  if (['spotify', 'instagram', 'tiktok', 'youtube', 'facebook'].includes(field)) return 'Malformed URL';
  return 'Data Issue';
}

const SEVERITY_STYLE: Record<'critical' | 'high' | 'medium' | 'low', { color: string; bg: string; border: string; label: string }> = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   label: 'Critical' },
  high:     { color: '#F97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)',  label: 'High'     },
  medium:   { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  label: 'Warning'  },
  low:      { color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)',   label: 'Info'     },
};

const ISSUE_TYPE_STYLE: Record<'error' | 'warning' | 'info', { color: string; bg: string; border: string }> = {
  error:   { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)'  },
  warning: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  info:    { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.18)'  },
};

function IngestionReportPanel({ report, onClose, onViewArtist, onEditArtist }: {
  report: IngestionReport;
  onClose: () => void;
  onViewArtist: (id: string) => void;
  onEditArtist: (id: string) => void;
}) {
  const [issueFilter, setIssueFilter] = useState<IssueFilter>('all');
  const [issueSearch, setIssueSearch] = useState('');
  const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(new Set());
  const [resolvedKeys,  setResolvedKeys]  = useState<Set<string>>(new Set());

  const allRows: NormalizedIssueRow[] = useMemo(
    () => flattenIssues(Array.isArray(report.issues) ? report.issues : []),
    [report.issues]
  );

  const totalErrors   = allRows.filter(r => r.issue_type === 'error').length;
  const totalWarnings = allRows.filter(r => r.issue_type === 'warning').length;

  const FILTER_TABS: { id: IssueFilter; label: string; count: number; color: string }[] = [
    { id: 'all',            label: 'All Issues',    count: allRows.length, color: 'rgba(255,255,255,0.55)' },
    { id: 'errors',         label: 'Errors',        count: totalErrors,    color: '#EF4444' },
    { id: 'warnings',       label: 'Warnings',      count: totalWarnings,  color: '#F59E0B' },
    { id: 'missing_email',  label: 'Missing Email', count: allRows.filter(r => r.field === 'primaryEmail').length, color: '#10B981' },
    { id: 'missing_phone',  label: 'Missing Phone', count: allRows.filter(r => r.field === 'artistPhone').length,  color: '#06B6D4' },
    { id: 'missing_social', label: 'No Social',     count: allRows.filter(r => r.field === 'social').length,       color: '#8B5CF6' },
  ];

  const filteredRows = useMemo(() => {
    const q = issueSearch.toLowerCase().trim();
    return allRows.filter(row => {
      if (dismissedKeys.has(row._rowKey) || resolvedKeys.has(row._rowKey)) return false;

      const matchFilter = (() => {
        if (issueFilter === 'all')            return true;
        if (issueFilter === 'errors')         return row.issue_type === 'error';
        if (issueFilter === 'warnings')       return row.issue_type === 'warning';
        if (issueFilter === 'missing_email')  return row.field === 'primaryEmail';
        if (issueFilter === 'missing_phone')  return row.field === 'artistPhone';
        if (issueFilter === 'missing_social') return row.field === 'social';
        if (issueFilter === 'missing_label')  return false;
        if (issueFilter === 'parsing_errors') return row.issue_type === 'error';
        return true;
      })();
      if (!matchFilter) return false;

      if (q) {
        return (
          row.artist_name.toLowerCase().includes(q) ||
          row.field.toLowerCase().includes(q) ||
          row.message.toLowerCase().includes(q) ||
          row.artistId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allRows, issueFilter, issueSearch, dismissedKeys, resolvedKeys]);

  const unresolvedCount = allRows.length - resolvedKeys.size - dismissedKeys.size;

  return (
    <div style={{
      background: '#0D0E11',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      {/* Header */}
      <div style={{
        position: 'relative',
        padding: '16px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={14} color="#06B6D4" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: '-0.01em' }}>Ingestion Parse Report</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
              {report.total} artists parsed · {report.runAt instanceof Date ? report.runAt.toLocaleTimeString() : String(report.runAt)} · Source: {String(report.source ?? 'unknown')}
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}
        >
          <X size={14} color="rgba(255,255,255,0.3)" />
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Total Parsed',  value: String(report.total ?? 0),       color: 'rgba(255,255,255,0.7)', sub: 'all artists' },
            { label: 'With Email',    value: String(report.withEmail ?? 0),    color: (report.pctEmail ?? 0) >= 70 ? '#10B981' : '#F59E0B', sub: `${(report.pctEmail ?? 0).toFixed(0)}%` },
            { label: 'With Phone',    value: String(report.withPhone ?? 0),    color: (report.pctPhone ?? 0) >= 50 ? '#10B981' : '#EF4444', sub: `${(report.pctPhone ?? 0).toFixed(0)}%` },
            { label: 'With Social',   value: String(report.withAnySocial ?? 0), color: (report.pctSocial ?? 0) >= 60 ? '#10B981' : '#F59E0B', sub: `${(report.pctSocial ?? 0).toFixed(0)}%` },
            { label: 'Total Errors',  value: String(totalErrors),              color: '#EF4444', sub: 'critical' },
            { label: 'Warnings',      value: String(totalWarnings),            color: '#F59E0B', sub: 'review needed' },
            { label: 'Unresolved',    value: String(Math.max(0, unresolvedCount)), color: '#06B6D4', sub: 'open issues' },
          ].map(s => (
            <div key={s.label} style={{
              background: `${s.color}08`, border: `1px solid ${s.color}18`,
              borderRadius: 10, padding: '10px 12px',
            }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 7.5, color: s.color, opacity: 0.6, marginTop: 2 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Coverage bars */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 18 }}>
          <CoverageBar value={report.pctEmail ?? 0} color="#10B981" label="EMAIL COVERAGE" />
          <CoverageBar value={report.pctPhone ?? 0} color="#06B6D4" label="PHONE COVERAGE" />
          <CoverageBar value={report.pctSocial ?? 0} color="#F59E0B" label="SOCIAL COVERAGE" />
        </div>

        {/* Per-Artist Issues */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Per-Artist Issues
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
              {filteredRows.length} of {allRows.length} shown
            </div>
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
            {FILTER_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setIssueFilter(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 6,
                  fontFamily: 'monospace', fontSize: 9, cursor: 'pointer',
                  background: issueFilter === tab.id ? `${tab.color}14` : 'rgba(255,255,255,0.03)',
                  border: issueFilter === tab.id ? `1px solid ${tab.color}35` : '1px solid rgba(255,255,255,0.07)',
                  color: issueFilter === tab.id ? tab.color : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                <span style={{
                  padding: '1px 5px', borderRadius: 10,
                  background: issueFilter === tab.id ? `${tab.color}20` : 'rgba(255,255,255,0.06)',
                  color: issueFilter === tab.id ? tab.color : 'rgba(255,255,255,0.25)',
                  fontSize: 8,
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8, padding: '6px 11px', marginBottom: 10,
          }}>
            <Search size={11} color="rgba(255,255,255,0.2)" />
            <input
              value={issueSearch}
              onChange={e => setIssueSearch(e.target.value)}
              placeholder="Search artist name, field, or issue text..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 11, color: 'rgba(255,255,255,0.55)',
              }}
            />
            {issueSearch && (
              <button onClick={() => setIssueSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <X size={10} color="rgba(255,255,255,0.3)" />
              </button>
            )}
          </div>

          {/* Issue rows — flat list, one row per issue */}
          <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 2 }}>
            {allRows.length === 0 ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '24px 16px',
                fontSize: 12, color: 'rgba(16,185,129,0.6)',
                border: '1px dashed rgba(16,185,129,0.15)', borderRadius: 10,
              }}>
                <CheckCircle size={15} color="rgba(16,185,129,0.5)" />
                <span>All artist data clean — no issues detected</span>
              </div>
            ) : filteredRows.length === 0 ? (
              <div style={{
                padding: '24px 16px', textAlign: 'center',
                fontSize: 12, color: 'rgba(255,255,255,0.2)',
                border: '1px dashed rgba(255,255,255,0.07)', borderRadius: 10,
              }}>
                No matching issues for this filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filteredRows.map(row => {
                  const sevStyle  = SEVERITY_STYLE[row.severity] ?? SEVERITY_STYLE.low;
                  const typeStyle = ISSUE_TYPE_STYLE[row.issue_type] ?? ISSUE_TYPE_STYLE.info;
                  const issueTypeLabel = getIssueTypeLabel(row.field);
                  const suggestedFix   = getSuggestedFix(row.field);

                  return (
                    <div
                      key={row._rowKey}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: '9px 12px',
                        borderRadius: 8,
                        border: `1px solid ${sevStyle.border}`,
                        background: `${sevStyle.bg}`,
                        transition: 'background 0.15s',
                      }}
                    >
                      {/* Severity badge */}
                      <span style={{
                        flexShrink: 0,
                        display: 'inline-flex', alignItems: 'center',
                        padding: '2px 7px', borderRadius: 5,
                        fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                        background: sevStyle.bg,
                        border: `1px solid ${sevStyle.border}`,
                        color: sevStyle.color,
                        marginTop: 1,
                        whiteSpace: 'nowrap',
                      }}>
                        {sevStyle.label}
                      </span>

                      {/* Main content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Row 1: Artist name + issue type badge + field */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                            {row.artistId}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                            {row.artist_name}
                          </span>
                          <span style={{
                            fontFamily: 'monospace', fontSize: 8,
                            padding: '1px 6px', borderRadius: 4,
                            background: typeStyle.bg,
                            border: `1px solid ${typeStyle.border}`,
                            color: typeStyle.color,
                            whiteSpace: 'nowrap',
                          }}>
                            {issueTypeLabel}
                          </span>
                          <span style={{
                            fontFamily: 'monospace', fontSize: 8,
                            padding: '1px 6px', borderRadius: 4,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.09)',
                            color: 'rgba(255,255,255,0.35)',
                            whiteSpace: 'nowrap',
                          }}>
                            {row.field}
                          </span>
                        </div>

                        {/* Row 2: Message */}
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginBottom: 3, lineHeight: 1.5 }}>
                          {row.message}
                        </div>

                        {/* Row 3: Fix hint */}
                        <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>
                          Fix: <span style={{ color: 'rgba(255,255,255,0.35)' }}>{suggestedFix}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <button
                          onClick={() => onViewArtist(row.artistId)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 3,
                            padding: '3px 8px', borderRadius: 5, cursor: 'pointer',
                            background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.18)',
                            color: '#06B6D4', fontFamily: 'monospace', fontSize: 8,
                          }}
                        >
                          <Eye size={9} color="#06B6D4" />
                          View
                        </button>
                        <button
                          onClick={() => onEditArtist(row.artistId)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 3,
                            padding: '3px 8px', borderRadius: 5, cursor: 'pointer',
                            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)',
                            color: '#F59E0B', fontFamily: 'monospace', fontSize: 8,
                          }}
                        >
                          <Edit2 size={9} color="#F59E0B" />
                          Edit
                        </button>
                        <button
                          onClick={() => setResolvedKeys(prev => new Set([...prev, row._rowKey]))}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 3,
                            padding: '3px 8px', borderRadius: 5, cursor: 'pointer',
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)',
                            color: '#10B981', fontFamily: 'monospace', fontSize: 8,
                          }}
                        >
                          <CheckSquare size={9} color="#10B981" />
                          Resolve
                        </button>
                        <button
                          onClick={() => setDismissedKeys(prev => new Set([...prev, row._rowKey]))}
                          style={{
                            padding: '3px 5px', borderRadius: 5, cursor: 'pointer',
                            background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
                            color: 'rgba(255,255,255,0.25)',
                          }}
                        >
                          <XCircle size={9} color="rgba(255,255,255,0.25)" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtistRow({ artist, showReport, onNavigate }: { artist: NormalizedArtist; showReport: boolean; onNavigate: (id: string) => void }) {
  const tierColor = TIER_COLORS[artist.tier] ?? '#6B7280';
  const statusColor = STATUS_COLORS[artist.status] ?? '#6B7280';
  const healthColor = artist.healthScore >= 80 ? '#10B981' : artist.healthScore >= 60 ? '#F59E0B' : '#EF4444';
  const errorCount = artist._issues.filter(i => i.severity === 'error').length;
  const warnCount  = artist._issues.filter(i => i.severity === 'warning').length;

  return (
    <>
      <div
        onClick={() => onNavigate(artist.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 18px',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          cursor: 'pointer',
          background: 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}35`,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: artist.avatarColor }}>{artist.avatarInitials}</span>
        </div>

        <div style={{ width: 148, flexShrink: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {artist.name}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {artist.genre === 'Needs Info' ? <span style={{ color: 'rgba(239,68,68,0.5)' }}>Genre missing</span> : artist.genre}
          </div>
        </div>

        <div style={{ width: 92, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
            padding: '2px 7px', borderRadius: 20,
            background: `${tierColor}12`, border: `1px solid ${tierColor}30`, color: tierColor,
          }}>
            {artist.tier}
          </span>
        </div>

        <div style={{ width: 80, flexShrink: 0 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 8,
            padding: '2px 7px', borderRadius: 20,
            background: `${statusColor}12`, border: `1px solid ${statusColor}30`, color: statusColor,
          }}>
            {artist.status}
          </span>
        </div>

        <div style={{ width: 88, flexShrink: 0 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{fmt(artist.monthlyListeners)}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>Monthly</div>
        </div>

        <div style={{ width: 54, flexShrink: 0 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: healthColor, lineHeight: 1 }}>{artist.healthScore}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>Health</div>
        </div>

        <div style={{ width: 70, flexShrink: 0 }}>
          {artist._email_valid ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={9} color="#10B981" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>Email</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertTriangle size={9} color="#EF4444" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444' }}>No Email</span>
            </div>
          )}
          {artist._phone_valid ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <CheckCircle size={9} color="#10B981" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#10B981' }}>Phone</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <Info size={9} color="rgba(255,255,255,0.2)" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>No Phone</span>
            </div>
          )}
        </div>

        <div style={{ width: 110, flexShrink: 0 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {artist.pointPerson && artist.pointPerson !== 'Needs Info' ? artist.pointPerson : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
          </div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {artist.arRep && artist.arRep !== 'Needs Info' && artist.arRep !== artist.pointPerson ? `A&R: ${artist.arRep}` : ''}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: 4, flexWrap: 'nowrap', overflow: 'hidden' }}>
          {artist._social_links.length > 0 ? (
            artist._social_links.slice(0, 3).map(link => (
              <SocialLinkBadge key={link.platform} link={link} />
            ))
          ) : (
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>No social links</span>
          )}
        </div>

        {showReport && (errorCount > 0 || warnCount > 0) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {errorCount > 0 && <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '1px 5px', borderRadius: 4 }}>{errorCount}e</span>}
            {warnCount > 0 && <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '1px 5px', borderRadius: 4 }}>{warnCount}w</span>}
          </div>
        )}

        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
          <ChevronDown size={12} color="rgba(255,255,255,0.18)" />
        </div>
      </div>
    </>
  );
}

function IssueSeverityDot({ severity }: { severity: 'error' | 'warning' | 'info' }) {
  const color = severity === 'error' ? '#EF4444' : severity === 'warning' ? '#F59E0B' : '#06B6D4';
  return <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0, marginTop: 3 }} />;
}

export default function RosterIntelligence() {
  const navigate = useNavigate();
  const [report, setReport]       = useState<IngestionReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    loadAllOverrides().then(() => {
      const r = runIngestion('roster_data_ts');
      setReport(r);
      saveIngestionReport(r);
    });
  }, []);

  function rerun() {
    setIsRunning(true);
    loadAllOverrides().then(() => {
      const r = runIngestion('roster_data_ts');
      setReport(r);
      saveIngestionReport(r);
      setIsRunning(false);
    });
  }

  const artists = report?.artists ?? [];

  return (
    <div style={{ padding: '20px', background: '#08090B', minHeight: '100%' }}>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={14} color="#06B6D4" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Roster Intelligence</h1>
          </div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            Data health, ingestion coverage, and unresolved artist record issues
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={rerun}
            disabled={isRunning}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'monospace', fontSize: 10, cursor: isRunning ? 'not-allowed' : 'pointer',
              opacity: isRunning ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            <RefreshCcw size={12} color="rgba(255,255,255,0.5)" style={{ animation: isRunning ? 'aos-spin 0.8s linear infinite' : 'none' }} />
            {isRunning ? 'Parsing...' : 'Re-Parse'}
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Parsed',    value: artists.length.toString(),                                   icon: Users,      color: '#06B6D4' },
          { label: 'With Email',      value: report ? `${report.withEmail} / ${report.total}` : '—',      icon: Mail,       color: '#10B981' },
          { label: 'With Social',     value: report ? `${report.withAnySocial} / ${report.total}` : '—',  icon: Globe,      color: '#F59E0B' },
          { label: 'Open Issues',     value: report ? report.issues.reduce((s, e) => s + e.issues.length, 0).toString() : '—', icon: AlertTriangle, color: '#EF4444' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} style={{
              background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${stat.color}18`, border: `1px solid ${stat.color}30`,
              }}>
                <Icon size={14} color={stat.color} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17, color: '#fff', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Loading state */}
      {!report && (
        <div style={{
          background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '40px',
          textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)',
        }}>
          <RefreshCcw size={18} color="rgba(255,255,255,0.15)" style={{ marginBottom: 10 }} />
          <div>Running ingestion parse...</div>
        </div>
      )}

      {/* Ingestion parse report */}
      {report && (
        <IngestionReportPanel
          report={report}
          onClose={() => {}}
          onViewArtist={id => navigate(`/dashboard/artist-os/roster/${id}`)}
          onEditArtist={id => navigate(`/dashboard/artist-os/roster/${id}`)}
        />
      )}
    </div>
  );
}
