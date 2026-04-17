import { useState } from 'react';
import {
  X, Bug, Send, Loader, CheckCircle, ChevronDown, HelpCircle,
  Image, Clock, User, Monitor,
} from 'lucide-react';
import { useHelp } from '../../context/HelpContext';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../auth/AuthContext';
import { useRole } from '../../../auth/RoleContext';

const CATEGORIES = [
  'UI / Display',
  'Data / Numbers',
  'Performance',
  'Access / Permissions',
  'Forms / Save Issues',
  'Navigation / Routing',
  'Charts / Visualizations',
  'Other',
];

const ISSUE_TYPES = [
  'Incorrect data displayed',
  'Feature not working',
  'Page not loading',
  'Button / action unresponsive',
  'Layout / styling broken',
  'Permission denied unexpectedly',
  'Slow performance',
  'Data not saving',
  'Other',
];

const PAGE_OPTIONS = [
  'Command Center',
  'Admin OS',
  'Artist OS — Overview',
  'Artist OS — Roster',
  'Artist OS — Releases',
  'Artist OS — Audience',
  'Artist OS — Revenue',
  'Artist OS — Recoupment',
  'Artist OS — Campaign Center',
  'Artist OS — Campaign OS',
  'Artist OS — Team',
  'Artist OS — Settings',
  'Catalog OS — Overview',
  'Catalog OS — Catalog Value',
  'Catalog OS — Asset Library',
  'Catalog OS — Revenue',
  'Catalog OS — Tasks',
  'Catalog OS — Team Progress',
  'Catalog OS — 12-Month Plan',
  'Catalog OS — Campaigns',
  'Catalog OS — Roster',
  'Catalog OS — Fan Intelligence',
  'Catalog OS — Touring',
  'Catalog OS — Brand Health',
  'Catalog OS — Inventory',
  'Catalog OS — Rights & Contracts',
  'Catalog OS — Meetings & Reports',
  'Catalog OS — Business Entities',
  'Rocksteady — Overview',
  'Rocksteady — Alerts',
  'Rocksteady — Discoveries',
  'Rocksteady — Deal Pipeline',
  'Rocksteady — Scout Network',
  'Rocksteady — Heatmaps',
  'Rocksteady — Culture Map',
  'Rocksteady — Reports',
  'Other / Unknown',
];

const SEVERITIES: { value: string; label: string; color: string; bg: string; desc: string }[] = [
  { value: 'low',      label: 'Low',      color: '#10B981', bg: 'rgba(16,185,129,0.1)',  desc: 'Minor cosmetic issue' },
  { value: 'medium',   label: 'Medium',   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  desc: 'Feature not working as expected' },
  { value: 'high',     label: 'High',     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   desc: 'Blocking workflow' },
  { value: 'critical', label: 'Critical', color: '#FF0040', bg: 'rgba(255,0,64,0.1)',    desc: 'Data loss / system down' },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
      {children}
    </label>
  );
}

interface SelectProps {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}

function SelectField({ value, options, onChange, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '9px 12px', borderRadius: 9, cursor: 'pointer', textAlign: 'left',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
          color: value ? '#F9FAFB' : 'rgba(255,255,255,0.3)', fontSize: 12,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 8 }}>
          {value || placeholder || 'Select...'}
        </span>
        <ChevronDown size={12} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0, transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 20, marginTop: 4,
          background: '#111214', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: 220, overflowY: 'auto',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: '100%', padding: '9px 13px', textAlign: 'left', cursor: 'pointer', fontSize: 12,
                background: opt === value ? 'rgba(6,182,212,0.08)' : 'none',
                border: 'none', color: opt === value ? '#06B6D4' : 'rgba(255,255,255,0.65)',
                display: 'block',
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(d: Date) {
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

export default function ReportBugModal() {
  const { isOpen, view, pageContext, close, openFAQ } = useHelp();
  const { auth } = useAuth();
  const { roleState } = useRole();

  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [issueType,   setIssueType]   = useState(ISSUE_TYPES[0]);
  const [pageView,    setPageView]    = useState('');
  const [severity,    setSeverity]    = useState('medium');
  const [summary,     setSummary]     = useState('');
  const [description, setDescription] = useState('');
  const [submittedBy, setSubmittedBy] = useState(auth.email || '');
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState('');
  const [timestamp]                   = useState(new Date());

  const show = isOpen && view === 'bug';
  const resolvedPage = pageView || pageContext || window.location.pathname;

  async function handleSubmit() {
    if (!summary.trim()) { setError('Please enter a brief summary of the issue.'); return; }
    setSaving(true);
    setError('');

    const userRole = roleState.role ?? '';

    const { error: dbErr } = await supabase.from('bug_reports').insert({
      page_context: resolvedPage,
      category,
      severity,
      summary:     summary.trim(),
      description: description.trim(),
      user_email:  submittedBy.trim() || auth.email || '',
      user_role:   userRole,
      metadata: {
        url:          window.location.pathname,
        issue_type:   issueType,
        submitted_at: timestamp.toISOString(),
        browser:      navigator.userAgent.substring(0, 120),
      },
      status: 'open',
    });

    setSaving(false);
    if (dbErr) { setError('Failed to submit. Please try again.'); return; }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSummary('');
      setDescription('');
      setPageView('');
      close();
    }, 2400);
  }

  if (!show) return null;

  const activeSeverity = SEVERITIES.find(s => s.value === severity)!;

  return (
    <>
      <div
        onClick={close}
        style={{ position: 'fixed', inset: 0, zIndex: 1400, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      />

      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        zIndex: 1401,
        width: '100%', maxWidth: 560,
        background: '#0B0C0F',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20,
        boxShadow: '0 48px 120px rgba(0,0,0,0.8)',
        overflow: 'hidden',
        animation: 'fadeUp 0.18s ease-out',
      }}>
        <style>{`
          @keyframes fadeUp {
            from { transform: translate(-50%,-46%); opacity: 0; }
            to   { transform: translate(-50%,-50%); opacity: 1; }
          }
        `}</style>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent)' }} />

        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bug size={14} color="#EF4444" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff' }}>Report a Bug</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 1, letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={9} />
                {formatTimestamp(timestamp)}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={() => openFAQ(pageContext)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 11px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.18)',
                color: '#06B6D4',
              }}
            >
              <HelpCircle size={11} />
              FAQ
            </button>
            <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 4 }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {saved ? (
          <div style={{ padding: '48px 22px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} color="#10B981" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 5 }}>Bug Report Submitted</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Thanks for the report. The team has been notified and will review shortly.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '72vh', overflowY: 'auto' }}>

            {/* Page / View + Issue Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Page / View</FieldLabel>
                <SelectField
                  value={pageView}
                  options={PAGE_OPTIONS}
                  onChange={setPageView}
                  placeholder={pageContext || 'Select page…'}
                />
              </div>
              <div>
                <FieldLabel>Issue Type</FieldLabel>
                <SelectField
                  value={issueType}
                  options={ISSUE_TYPES}
                  onChange={setIssueType}
                />
              </div>
            </div>

            {/* Category + Severity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Issue Category</FieldLabel>
                <SelectField
                  value={category}
                  options={CATEGORIES}
                  onChange={setCategory}
                />
              </div>
              <div>
                <FieldLabel>Severity</FieldLabel>
                <div style={{ display: 'flex', gap: 5 }}>
                  {SEVERITIES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSeverity(s.value)}
                      title={s.desc}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 9.5, fontWeight: 700, cursor: 'pointer',
                        background: severity === s.value ? s.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${severity === s.value ? s.color + '40' : 'rgba(255,255,255,0.07)'}`,
                        color: severity === s.value ? s.color : '#6B7280',
                        transition: 'all 0.13s',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.28)', marginTop: 5, fontStyle: 'italic' }}>
                  {activeSeverity.desc}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <FieldLabel>Summary *</FieldLabel>
              <input
                type="text"
                value={summary}
                onChange={e => setSummary(e.target.value)}
                placeholder="Brief title describing the issue..."
                maxLength={140}
                style={{
                  width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                }}
              />
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Detailed Description</FieldLabel>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder={`What happened? What did you expect?\nSteps to reproduce if relevant.\nBrowser / device if relevant.`}
                style={{
                  width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                  resize: 'vertical', fontFamily: 'system-ui', lineHeight: 1.6,
                }}
              />
            </div>

            {/* Screenshot placeholder */}
            <div>
              <FieldLabel>Screenshot (optional)</FieldLabel>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '18px 12px', borderRadius: 10,
                border: '1.5px dashed rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.015)',
              }}>
                <Image size={20} color="rgba(255,255,255,0.12)" />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Screenshot upload</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)', marginTop: 2 }}>Coming soon — paste a URL or file path in the description for now</div>
                </div>
              </div>
            </div>

            {/* Submitted By + Auto-captured */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Submitted By</FieldLabel>
                <div style={{ position: 'relative' }}>
                  <User size={12} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    value={submittedBy}
                    onChange={e => setSubmittedBy(e.target.value)}
                    placeholder="email or name"
                    style={{
                      width: '100%', padding: '9px 12px 9px 28px', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <FieldLabel>Auto-captured</FieldLabel>
                <div style={{ padding: '9px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 5, minHeight: 44 }}>
                  {[
                    { icon: Monitor, k: 'Page', v: resolvedPage },
                    { icon: User,    k: 'Role',  v: roleState.role ?? 'unknown' },
                  ].map(({ icon: Icon, k, v }) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon size={9} color="rgba(255,255,255,0.2)" />
                      <span style={{ fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.22)' }}>{k}:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 9.5, color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ padding: '9px 13px', borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', fontSize: 11, color: '#EF4444' }}>
                {error}
              </div>
            )}
          </div>
        )}

        {!saved && (
          <div style={{ padding: '12px 22px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'flex-end', gap: 9, background: 'rgba(0,0,0,0.2)' }}>
            <button
              onClick={close}
              style={{ padding: '8px 18px', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9CA3AF', fontSize: 12, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 22px', borderRadius: 9, minWidth: 150, justifyContent: 'center',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)',
                color: '#EF4444', fontSize: 12, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {saving
                ? <><Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
                : <><Send size={12} /> Submit Report</>
              }
            </button>
          </div>
        )}
      </div>
    </>
  );
}
