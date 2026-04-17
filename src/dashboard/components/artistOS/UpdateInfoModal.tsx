import { useState } from 'react';
import {
  X, Send, Mail, Phone, Globe, Lock, AlertTriangle, CheckCircle,
  Music, Camera, Video, Eye, EyeOff, Loader, Users, CreditCard
} from 'lucide-react';
import { type NormalizedArtist } from '../../data/rosterIngestionService';
import {
  createSubmission,
  type SubmitterRole,
  type SubmissionChanges,
  type BankingChanges,
} from '../../data/updateSubmissionsService';
import { type ArtistOSRole } from '../../../auth/roles';

interface Props {
  artist: NormalizedArtist;
  submitterEmail: string;
  submitterName: string;
  submitterRole: ArtistOSRole;
  onClose: () => void;
  onSubmitted: () => void;
}

const TABS = [
  { key: 'contact', label: 'Contact Info', icon: Mail },
  { key: 'social',  label: 'Social Links', icon: Globe },
  { key: 'manager', label: 'Management',   icon: Users },
  { key: 'banking', label: 'Banking',      icon: Lock },
];

type TabKey = 'contact' | 'social' | 'manager' | 'banking';

const SOCIAL_FIELDS = [
  { key: 'spotifyLink',    label: 'Spotify URL',    icon: Music,  placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'instagramLink',  label: 'Instagram URL',  icon: Camera, placeholder: 'https://instagram.com/...' },
  { key: 'instagramHandle',label: 'Instagram Handle',icon: Camera,placeholder: '@artisthandle' },
  { key: 'tiktokLink',     label: 'TikTok URL',     icon: Video,  placeholder: 'https://tiktok.com/@...' },
  { key: 'youtubeLink',    label: 'YouTube URL',    icon: Video,  placeholder: 'https://youtube.com/...' },
  { key: 'facebookLink',   label: 'Facebook URL',   icon: Globe,  placeholder: 'https://facebook.com/...' },
];

function FieldInput({
  label, value, onChange, type = 'text', placeholder, icon: Icon, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
  icon?: React.ElementType;
  hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        {Icon && <Icon size={10} color="#9CA3AF" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '9px 12px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.09)'}`,
          borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />
      {hint && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function SecureInput({
  label, value, onChange, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
        <Lock size={10} color="#EF4444" />
        {label}
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '1px 5px', borderRadius: 4, marginLeft: 4 }}>SECURE</span>
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: '9px 38px 9px 12px', boxSizing: 'border-box',
            background: 'rgba(239,68,68,0.04)',
            border: `1px solid ${focused ? 'rgba(239,68,68,0.35)' : 'rgba(239,68,68,0.18)'}`,
            borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          {show ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      </div>
      {hint && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

export default function UpdateInfoModal({ artist, submitterEmail, submitterName, submitterRole, onClose, onSubmitted }: Props) {
  const [tab, setTab] = useState<TabKey>('contact');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [changes, setChanges] = useState<SubmissionChanges>({
    primaryEmail: '',
    artistPhone: '',
    manager: '',
    managementContact: '',
    managerPhone: '',
    spotifyLink: '',
    instagramLink: '',
    instagramHandle: '',
    tiktokLink: '',
    youtubeLink: '',
    facebookLink: '',
  });

  const [banking, setBanking] = useState<BankingChanges>({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    routingNumber: '',
    paymentEmail: '',
    paymentNotes: '',
  });

  function setField(key: keyof SubmissionChanges, val: string) {
    setChanges(c => ({ ...c, [key]: val }));
  }
  function setBankField(key: keyof BankingChanges, val: string) {
    setBanking(b => ({ ...b, [key]: val }));
  }

  const hasChanges = (
    Object.values(changes).some(v => v && v.trim() !== '') ||
    Object.values(banking).some(v => v && v.trim() !== '')
  );

  const hasBankingData = Object.values(banking).some(v => v && v.trim() !== '');

  const roleToSubmitterRole: Record<ArtistOSRole, SubmitterRole> = {
    artist_manager: 'manager',
    label_partner: 'label_partner',
    admin_team: 'admin_team',
  };

  async function handleSubmit() {
    if (!hasChanges) return;
    setSubmitting(true);
    setError('');

    const { error: err } = await createSubmission({
      artist_id: artist.id,
      artist_name: artist.name,
      submitted_by_email: submitterEmail,
      submitted_by_name: submitterName,
      submitter_role: roleToSubmitterRole[submitterRole],
      changes: Object.fromEntries(
        Object.entries(changes).filter(([, v]) => v && (v as string).trim() !== '')
      ) as SubmissionChanges,
      banking_changes: hasBankingData ? banking : {},
    });

    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      onSubmitted();
      onClose();
    }, 1800);
  }

  const changedCount = [
    ...Object.values(changes),
    ...Object.values(banking),
  ].filter(v => v && (v as string).trim() !== '').length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: 580,
        background: '#0B0C0F', border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 48px 120px rgba(0,0,0,0.75)',
      }}>

        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.7),transparent)' }} />
          <div style={{
            padding: '20px 24px 16px',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={13} color="#06B6D4" />
                </div>
                <span style={{ fontWeight: 800, fontSize: 16, color: '#fff' }}>Submit Update Request</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 36 }}>
                {artist.name} · {artist.id}
                {changedCount > 0 && (
                  <span style={{ marginLeft: 10, fontFamily: 'monospace', fontSize: 9, color: '#06B6D4', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '1px 6px', borderRadius: 20 }}>
                    {changedCount} field{changedCount !== 1 ? 's' : ''} changed
                  </span>
                )}
              </div>
              <div style={{ marginTop: 8, marginLeft: 36, display: 'flex', alignItems: 'center', gap: 5 }}>
                <AlertTriangle size={10} color="#F59E0B" />
                <span style={{ fontSize: 10, color: 'rgba(245,158,11,0.8)' }}>Changes go to review queue — not applied immediately</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: 4, marginTop: 2 }}>
              <X size={16} color="#6B7280" />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px' }}>
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key as TabKey)}
                style={{
                  padding: '11px 14px', background: 'none', border: 'none',
                  borderBottom: tab === t.key ? '2px solid #06B6D4' : '2px solid transparent',
                  color: tab === t.key ? '#06B6D4' : '#6B7280',
                  fontSize: 11, fontWeight: 600, cursor: 'pointer', marginBottom: -1,
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <Icon size={11} color={tab === t.key ? '#06B6D4' : '#6B7280'} />
                {t.label}
                {t.key === 'banking' && (
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.18)', padding: '0px 4px', borderRadius: 3 }}>SECURE</span>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '20px 24px', maxHeight: 400, overflowY: 'auto' }}>
          {tab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                Current: {artist._email_valid ? artist._email_clean : 'No email on file'} · {artist._phone_valid ? artist._phone_clean : 'No phone on file'}
              </div>
              <FieldInput label="New Email Address" value={changes.primaryEmail ?? ''} onChange={v => setField('primaryEmail', v)} type="email" placeholder="artist@email.com" icon={Mail} />
              <FieldInput label="New Phone Number" value={changes.artistPhone ?? ''} onChange={v => setField('artistPhone', v)} type="tel" placeholder="+1 555 000 0000" icon={Phone} />
            </div>
          )}

          {tab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SOCIAL_FIELDS.map(f => {
                const Icon = f.icon;
                return (
                  <FieldInput
                    key={f.key}
                    label={f.label}
                    value={(changes as Record<string, string>)[f.key] ?? ''}
                    onChange={v => setField(f.key as keyof SubmissionChanges, v)}
                    placeholder={f.placeholder}
                    icon={Icon}
                  />
                );
              })}
            </div>
          )}

          {tab === 'manager' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                Current manager: {artist.manager && artist.manager !== 'Needs Info' ? artist.manager : 'Not on file'}
              </div>
              <FieldInput label="Manager Name" value={changes.manager ?? ''} onChange={v => setField('manager', v)} placeholder="Full name" icon={Users} />
              <FieldInput label="Manager Email" value={changes.managementContact ?? ''} onChange={v => setField('managementContact', v)} type="email" placeholder="manager@email.com" icon={Mail} />
              <FieldInput label="Manager Phone" value={changes.managerPhone ?? ''} onChange={v => setField('managerPhone', v)} type="tel" placeholder="+1 555 000 0000" icon={Phone} />
            </div>
          )}

          {tab === 'banking' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <Lock size={12} color="#EF4444" />
                  <span style={{ fontWeight: 700, fontSize: 11, color: '#EF4444' }}>Secure Banking Information</span>
                </div>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                  Banking data is stored encrypted and separately from profile data. Only reviewed by authorized GMG finance team members. This submission will require manual admin approval.
                </p>
              </div>
              <SecureInput label="Bank Name" value={banking.bankName ?? ''} onChange={v => setBankField('bankName', v)} placeholder="Bank of America, Chase, etc." />
              <SecureInput label="Account Holder Name" value={banking.accountHolder ?? ''} onChange={v => setBankField('accountHolder', v)} placeholder="Full legal name on account" />
              <SecureInput label="Account Number" value={banking.accountNumber ?? ''} onChange={v => setBankField('accountNumber', v)} placeholder="••••••••••" hint="Will be masked after submission" />
              <SecureInput label="Routing Number" value={banking.routingNumber ?? ''} onChange={v => setBankField('routingNumber', v)} placeholder="9-digit routing number" />
              <FieldInput label="Payment Email (PayPal / Venmo)" value={banking.paymentEmail ?? ''} onChange={v => setBankField('paymentEmail', v)} type="email" placeholder="payment@email.com" icon={CreditCard} />
              <div>
                <label style={{ display: 'block', fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Additional Notes</label>
                <textarea
                  value={banking.paymentNotes ?? ''}
                  onChange={e => setBankField('paymentNotes', e.target.value)}
                  rows={2}
                  placeholder="Wire instructions, preferred payment method, etc."
                  style={{
                    width: '100%', padding: '9px 12px', boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
                    resize: 'vertical', fontFamily: 'system-ui',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ margin: '0 24px', padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, color: '#EF4444' }}>
            {error}
          </div>
        )}

        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
          {submitted ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'center', padding: '10px 0' }}>
              <CheckCircle size={16} color="#10B981" />
              <span style={{ fontWeight: 700, fontSize: 13, color: '#10B981' }}>Update request submitted for review</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                Submitted as <span style={{ color: 'rgba(255,255,255,0.45)' }}>{submitterName || submitterEmail}</span>
                {' · '}
                <span style={{ color: '#06B6D4' }}>{submitterRole.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={onClose} style={{
                  padding: '9px 18px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                  color: '#9CA3AF', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>Cancel</button>
                <button
                  onClick={handleSubmit}
                  disabled={!hasChanges || submitting}
                  style={{
                    padding: '9px 22px', borderRadius: 10,
                    background: hasChanges ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${hasChanges ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    color: hasChanges ? '#06B6D4' : '#4B5563',
                    fontSize: 12, fontWeight: 700, cursor: hasChanges && !submitting ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s',
                  }}
                >
                  {submitting ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={12} color={hasChanges ? '#06B6D4' : '#4B5563'} />}
                  {submitting ? 'Submitting...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
