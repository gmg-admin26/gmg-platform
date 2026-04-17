import { useState, useEffect } from 'react';
import {
  ClipboardList, RefreshCcw, CheckCircle, XCircle, Brain,
  ChevronDown, ChevronUp, Mail, Phone, Globe, Lock,
  Clock, Filter, Search, Shield, AlertTriangle, Eye
} from 'lucide-react';
import {
  fetchAllSubmissions,
  updateSubmissionStatus,
  markAIReviewReady,
  SUBMISSION_STATUS_META,
  SUBMISSION_TYPE_META,
  SUBMITTER_ROLE_META,
  type ArtistUpdateSubmission,
  type SubmissionStatus,
} from '../data/updateSubmissionsService';

function timeAgo(ts: string): string {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ChangeDiff({ changes, banking }: {
  changes: Record<string, string>;
  banking: Record<string, string>;
}) {
  const changeEntries = Object.entries(changes).filter(([, v]) => v && v.trim() !== '');
  const bankEntries = Object.entries(banking).filter(([, v]) => v && v.trim() !== '');
  const hasBank = bankEntries.length > 0;

  const FIELD_LABELS: Record<string, string> = {
    primaryEmail: 'Email', artistPhone: 'Phone', manager: 'Manager',
    managementContact: 'Manager Email', managerPhone: 'Manager Phone',
    spotifyLink: 'Spotify', instagramLink: 'Instagram', instagramHandle: 'IG Handle',
    tiktokLink: 'TikTok', youtubeLink: 'YouTube', facebookLink: 'Facebook',
    bankName: 'Bank', accountHolder: 'Account Holder',
    accountNumber: 'Account #', routingNumber: 'Routing #',
    paymentEmail: 'Payment Email', paymentNotes: 'Notes',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {changeEntries.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '5px 10px', borderRadius: 7, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', width: 100, flexShrink: 0 }}>{FIELD_LABELS[k] ?? k}</span>
          <span style={{ fontSize: 11, color: '#06B6D4', wordBreak: 'break-all' }}>{v}</span>
        </div>
      ))}
      {hasBank && (
        <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
            <Lock size={10} color="#EF4444" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#EF4444', fontWeight: 700 }}>SECURE BANKING DATA — {bankEntries.length} field{bankEntries.length !== 1 ? 's' : ''}</span>
          </div>
          {bankEntries.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', width: 100, flexShrink: 0 }}>{FIELD_LABELS[k] ?? k}</span>
              <span style={{ fontSize: 11, color: 'rgba(239,68,68,0.8)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {k === 'accountNumber' || k === 'routingNumber' ? '•'.repeat(v.length) : v}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ submission, onAction, loading }: {
  submission: ArtistUpdateSubmission;
  onAction: (id: string, action: 'approve' | 'reject' | 'ai_review', notes?: string) => void;
  loading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const statusMeta = SUBMISSION_STATUS_META[submission.status];
  const typeMeta = SUBMISSION_TYPE_META[submission.submission_type];
  const roleMeta = SUBMITTER_ROLE_META[submission.submitter_role];
  const isBanking = submission.submission_type === 'banking_update' || Object.keys(submission.banking_changes ?? {}).length > 0;
  const isPending = submission.status === 'pending' || submission.status === 'ai_review';

  return (
    <div style={{
      background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, overflow: 'hidden',
      boxShadow: isBanking ? '0 0 0 1px rgba(239,68,68,0.1)' : 'none',
    }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
          cursor: 'pointer', transition: 'background 0.15s',
          background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent',
        }}
        onClick={() => setExpanded(e => !e)}
        onMouseEnter={e => { if (!expanded) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.018)'; }}
        onMouseLeave={e => { if (!expanded) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{submission.artist_name}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{submission.artist_id}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 20, background: statusMeta.bg, border: `1px solid ${statusMeta.border}`, color: statusMeta.color }}>{statusMeta.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 20, background: `${typeMeta.color}12`, border: `1px solid ${typeMeta.color}28`, color: typeMeta.color }}>{typeMeta.label}</span>
            {isBanking && <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 3 }}><Lock size={8} />Banking</span>}
            {submission.ai_review_ready && <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '2px 7px', borderRadius: 20, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: 3 }}><Brain size={8} />AI Ready</span>}
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: `${roleMeta.color}90` }}>● {roleMeta.label}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>by {submission.submitted_by_name || submission.submitted_by_email}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}><Clock size={9} color="rgba(255,255,255,0.25)" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />{timeAgo(submission.created_at)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isPending && (
            <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
              <button
                onClick={() => onAction(submission.id, 'ai_review')}
                disabled={loading || submission.ai_review_ready}
                title="Flag for AI Review"
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: loading || submission.ai_review_ready ? 'not-allowed' : 'pointer',
                  background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4',
                  display: 'flex', alignItems: 'center', gap: 4, opacity: submission.ai_review_ready ? 0.5 : 1,
                }}
              >
                <Brain size={11} color="#06B6D4" />
                AI Review
              </button>
              <button
                onClick={() => { setShowNotes(true); setExpanded(true); }}
                disabled={loading}
                title="Approve"
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <CheckCircle size={11} color="#10B981" />
                Approve
              </button>
              <button
                onClick={() => onAction(submission.id, 'reject')}
                disabled={loading}
                title="Reject"
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 10, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <XCircle size={11} color="#EF4444" />
                Reject
              </button>
            </div>
          )}
          {expanded ? <ChevronUp size={13} color="rgba(255,255,255,0.2)" /> : <ChevronDown size={13} color="rgba(255,255,255,0.2)" />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '14px 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Proposed Changes</div>
            <ChangeDiff changes={submission.changes as Record<string, string>} banking={submission.banking_changes as Record<string, string>} />
          </div>

          {showNotes && isPending && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Admin Notes (optional)</div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder="Reason for approval / additional context..."
                style={{
                  width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                  resize: 'vertical', fontFamily: 'system-ui', marginBottom: 10,
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => onAction(submission.id, 'approve', notes)} disabled={loading} style={{ padding: '7px 18px', borderRadius: 9, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={12} color="#10B981" />
                  Confirm Approve
                </button>
                <button onClick={() => setShowNotes(false)} style={{ padding: '7px 16px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#6B7280', fontSize: 12, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}

          {submission.admin_notes && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', marginBottom: 4 }}>ADMIN NOTES</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{submission.admin_notes}</div>
            </div>
          )}

          {submission.reviewed_by && (
            <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>Reviewed by: {submission.reviewed_by}</span>
              {submission.reviewed_at && <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{timeAgo(submission.reviewed_at)}</span>}
            </div>
          )}

          {submission.ai_review_notes && (
            <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 9, background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <Brain size={10} color="#06B6D4" />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#06B6D4' }}>AI REVIEW NOTES</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{submission.ai_review_notes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const STATUS_FILTER_OPTS: { value: SubmissionStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'ai_review', label: 'AI Review' },
  { value: 'approved',  label: 'Approved' },
  { value: 'rejected',  label: 'Rejected' },
  { value: 'applied',   label: 'Applied' },
];

export default function PendingUpdatesQueue() {
  const [submissions, setSubmissions] = useState<ArtistUpdateSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchAllSubmissions().then(data => {
      setSubmissions(data);
      setLoading(false);
    });
  }, [refreshKey]);

  async function handleAction(id: string, action: 'approve' | 'reject' | 'ai_review', notes?: string) {
    setActionLoading(true);
    if (action === 'ai_review') {
      await markAIReviewReady(id, 'Flagged for AI agent review by admin.');
    } else {
      await updateSubmissionStatus(
        id,
        action === 'approve' ? 'approved' : 'rejected',
        'Admin',
        notes
      );
    }
    setActionLoading(false);
    setRefreshKey(k => k + 1);
  }

  const filtered = submissions.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.artist_name.toLowerCase().includes(q) || s.artist_id.toLowerCase().includes(q) || s.submitted_by_email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    pending:   submissions.filter(s => s.status === 'pending').length,
    ai_review: submissions.filter(s => s.status === 'ai_review').length,
    approved:  submissions.filter(s => s.status === 'approved').length,
    rejected:  submissions.filter(s => s.status === 'rejected').length,
    applied:   submissions.filter(s => s.status === 'applied').length,
    banking:   submissions.filter(s => s.submission_type === 'banking_update' || Object.keys(s.banking_changes ?? {}).length > 0).length,
  };

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '20px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={15} color="#F59E0B" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Pending Updates Queue</h1>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginLeft: 42 }}>Review and approve artist-submitted profile changes</p>
        </div>
        <button
          onClick={() => setRefreshKey(k => k + 1)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.5)', fontSize: 11, cursor: 'pointer' }}
        >
          <RefreshCcw size={12} />
          Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 22 }}>
        {[
          { label: 'Pending',   count: counts.pending,   color: '#F59E0B' },
          { label: 'AI Review', count: counts.ai_review, color: '#06B6D4' },
          { label: 'Approved',  count: counts.approved,  color: '#10B981' },
          { label: 'Rejected',  count: counts.rejected,  color: '#EF4444' },
          { label: 'Applied',   count: counts.applied,   color: '#8B5CF6' },
          { label: 'Banking',   count: counts.banking,   color: '#EF4444', sub: 'includes banking' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0D0E11', border: `1px solid ${stat.color}18`, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ fontWeight: 800, fontSize: 22, color: stat.color, lineHeight: 1 }}>{stat.count}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>{stat.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={13} color="rgba(255,255,255,0.25)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search artist, ID, or email..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', boxSizing: 'border-box', background: '#0D0E11', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 10, color: '#F9FAFB', fontSize: 12, outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {STATUS_FILTER_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value as SubmissionStatus | 'all')}
              style={{
                padding: '8px 14px', borderRadius: 9, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                background: statusFilter === opt.value ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${statusFilter === opt.value ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.08)'}`,
                color: statusFilter === opt.value ? '#F59E0B' : '#6B7280',
              }}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.01)' }}>
          <Shield size={13} color="#F59E0B" />
          <span style={{ fontWeight: 700, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Admin Review Queue</span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginLeft: 4 }}>{filtered.length} submission{filtered.length !== 1 ? 's' : ''}</span>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Brain size={11} color="#06B6D4" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#06B6D4' }}>AI Review Ready pipeline active</span>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <ClipboardList size={32} color="rgba(255,255,255,0.08)" style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>No submissions found</div>
            {submissions.length === 0 && <div style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>Updates submitted by artists and managers will appear here</div>}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 14px' }}>
            {filtered.map(s => (
              <SubmissionCard
                key={s.id}
                submission={s}
                onAction={handleAction}
                loading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
