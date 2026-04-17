import { useState } from 'react';
import {
  Settings, Bell, Lock, CheckCircle2, AlertCircle, Clock,
  Music, ShoppingBag, TrendingUp, Instagram, Youtube, Zap,
  ExternalLink, RefreshCw, ChevronRight, Building2, ShieldCheck,
  ArrowRightLeft, RotateCcw,
} from 'lucide-react';
import { useActiveArtist } from '../hooks/useActiveArtist';

const PLATFORMS = [
  {
    id: 'spotify',
    name: 'Spotify for Artists',
    description: 'Streaming analytics, playlist pitching, audience insights',
    status: 'connected' as const,
    lastSync: '2 minutes ago',
    enables: ['Monthly Listeners', 'Stream Counts', 'City Demographics', 'Playlist Reach'],
    color: '#1DB954',
    icon: Music,
  },
  {
    id: 'apple-music',
    name: 'Apple Music for Artists',
    description: 'Apple Music streams, Shazam discovery, artist analytics',
    status: 'pending' as const,
    lastSync: null,
    enables: ['Stream Counts', 'Discovery Sources', 'Radio Airplay'],
    color: '#FC3C44',
    icon: Music,
  },
  {
    id: 'tiktok',
    name: 'TikTok Analytics',
    description: 'Video views, sound usage, creator reach, trend signals',
    status: 'connected' as const,
    lastSync: '8 minutes ago',
    enables: ['Video Views', 'Sound Uses', 'Creator Count', 'Trend Velocity'],
    color: '#06B6D4',
    icon: TrendingUp,
  },
  {
    id: 'instagram',
    name: 'Instagram / Meta Ads',
    description: 'Follower growth, post reach, ad campaign performance',
    status: 'connected' as const,
    lastSync: '3 minutes ago',
    enables: ['Followers', 'Story Reach', 'Ad Performance', 'Audience Insights'],
    color: '#E1306C',
    icon: Instagram,
  },
  {
    id: 'youtube',
    name: 'YouTube Studio',
    description: 'Video performance, subscriber growth, content revenue',
    status: 'not_connected' as const,
    lastSync: null,
    enables: ['Views', 'Subscribers', 'Watch Time', 'Revenue'],
    color: '#FF0000',
    icon: Youtube,
  },
  {
    id: 'shopify',
    name: 'Shopify Store',
    description: 'Merch sales, product inventory, fan purchase data',
    status: 'not_connected' as const,
    lastSync: null,
    enables: ['Orders', 'Revenue', 'Top Products', 'Customer Data'],
    color: '#96BF48',
    icon: ShoppingBag,
  },
  {
    id: 'gmg-store',
    name: 'GMG Store',
    description: 'Internal GMG merchandise and consumer product catalog',
    status: 'connected' as const,
    lastSync: '5 minutes ago',
    enables: ['Product Listings', 'Sales Data', 'Inventory', 'Fan Orders'],
    color: '#F59E0B',
    icon: Zap,
  },
];

const STATUS_META = {
  connected:     { label: 'Connected',     color: '#10B981', bg: 'rgba(16,185,129,0.1)',   border: 'rgba(16,185,129,0.25)',   Icon: CheckCircle2 },
  pending:       { label: 'Pending Setup', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)',   Icon: Clock },
  not_connected: { label: 'Not Connected', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.2)',   Icon: AlertCircle },
};

const NOTIF_DEFAULTS = {
  weeklyReport: true,
  streamingMilestone: true,
  campaignSummary: false,
  teamTaskReminder: true,
  releaseReminder: true,
};

const NOTIF_LABELS: Record<keyof typeof NOTIF_DEFAULTS, string> = {
  weeklyReport: 'Weekly Performance Report',
  streamingMilestone: 'Streaming Milestone Reached',
  campaignSummary: 'Campaign Weekly Summary',
  teamTaskReminder: 'Team Task Reminders',
  releaseReminder: 'Release Date Reminders',
};

type ACHStatus = 'connected' | 'pending' | 'not_connected';

const ARTIST_ACH_BANK = {
  status: 'connected' as ACHStatus,
  institution: 'Bank of America',
  accountType: 'Business Checking',
  last4: '4821',
  routingLast4: '0959',
  verificationState: 'verified' as 'verified' | 'pending_microdep' | 'none',
  lastUpdated: 'Apr 8, 2026',
  achSpeed: '1–2 business days',
};

const ACH_STATUS_META = {
  connected: {
    label: 'ACH Connected',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.07)',
    border: 'rgba(16,185,129,0.18)',
    topLine: 'rgba(16,185,129,0.35)',
    Icon: CheckCircle2,
  },
  pending: {
    label: 'Pending Verification',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.2)',
    topLine: 'rgba(245,158,11,0.4)',
    Icon: Clock,
  },
  not_connected: {
    label: 'No Bank Account On File',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.06)',
    border: 'rgba(239,68,68,0.2)',
    topLine: 'rgba(239,68,68,0.4)',
    Icon: AlertCircle,
  },
} as const;

function ArtistPayoutBanking() {
  const [bank] = useState(ARTIST_ACH_BANK);
  const s = ACH_STATUS_META[bank.status];
  const StatusIcon = s.Icon;

  const verLabel =
    bank.verificationState === 'verified' ? 'Verified for payouts'
    : bank.verificationState === 'pending_microdep' ? 'Micro-deposit verification pending'
    : 'Not verified';

  const verColor =
    bank.verificationState === 'verified' ? '#10B981'
    : bank.verificationState === 'pending_microdep' ? '#F59E0B'
    : '#EF4444';

  const isConnected = bank.status === 'connected';
  const isPending = bank.status === 'pending';
  const isDisconnected = bank.status === 'not_connected';

  return (
    <div style={{
      background: '#0D0E11',
      border: `1px solid ${s.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 14,
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${s.topLine},transparent)` }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `${s.color}12`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Building2 size={14} color={s.color} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#fff', letterSpacing: '-0.01em' }}>Payout Banking</span>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 20, background: `${s.color}10`, border: `1px solid ${s.color}22`, color: s.color, letterSpacing: '0.04em' }}>ACH</span>
            </div>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>
              Artist payout destination · ACH disbursements
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, background: s.bg, border: `1px solid ${s.border}`, flexShrink: 0 }}>
          <StatusIcon size={10} color={s.color} />
          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, color: s.color, letterSpacing: '0.05em' }}>{s.label}</span>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>

        {/* ── STATE B: NOT CONNECTED ───────────────────────────── */}
        {isDisconnected && (
          <>
            {/* Warning banner */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 16 }}>
              <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ margin: '0 0 3px 0', fontSize: 12, fontWeight: 700, color: 'rgba(239,68,68,0.9)' }}>No verified payout bank account on file</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Payouts and approved ACH disbursements cannot be initiated until a verified bank account is connected.
                </p>
              </div>
            </div>

            {/* No bank UI */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 260px', background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 12, padding: '20px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} color="rgba(239,68,68,0.55)" />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>No bank account connected</p>
                  <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.22)', lineHeight: 1.6 }}>
                    Connect a verified bank account to enable ACH payouts and advance disbursements.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#EF4444', opacity: 0.5 }} />
                  <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>PAYOUTS BLOCKED</span>
                </div>
              </div>

              <div style={{ flex: '0 1 200px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ArrowRightLeft size={10} color="rgba(255,255,255,0.2)" />
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>Standard ACH: 1–2 business days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                    <ShieldCheck size={10} color="rgba(255,255,255,0.18)" style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', lineHeight: 1.5 }}>
                      Bank details encrypted and access-controlled to authorized personnel.
                    </span>
                  </div>
                </div>

                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, padding: '10px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontWeight: 700, letterSpacing: '0.01em' }}>
                  <Building2 size={12} /> Connect Bank Account
                </button>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                  <ExternalLink size={10} /> Learn More
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── STATE C: PENDING VERIFICATION ───────────────────── */}
        {isPending && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 16 }}>
              <Clock size={13} color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ margin: '0 0 3px 0', fontSize: 12, fontWeight: 700, color: 'rgba(245,158,11,0.9)' }}>Bank account pending verification</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                  Confirm the two micro-deposits that were sent to your account. Payouts are held until verification is complete.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 260px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building2 size={16} color="#F59E0B" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>{bank.institution} &bull;&bull;&bull;&bull; {bank.last4}</p>
                    <p style={{ margin: 0, fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>{bank.accountType}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 8 }}>
                  <Clock size={10} color="#F59E0B" />
                  <span style={{ fontSize: 10, color: 'rgba(245,158,11,0.8)', fontFamily: 'monospace' }}>Micro-deposit verification in progress</span>
                </div>
              </div>
              <div style={{ flex: '0 1 200px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, padding: '10px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontWeight: 700 }}>
                  <ShieldCheck size={12} /> Verify Bank Account
                </button>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                  <ExternalLink size={10} /> View Payout History
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── STATE A: CONNECTED ───────────────────────────────── */}
        {isConnected && (
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Account detail card */}
            <div style={{ flex: '1 1 260px', background: 'rgba(16,185,129,0.025)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={17} color="#10B981" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                    {bank.institution}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                    {bank.accountType} &bull;&bull;&bull;&bull; {bank.last4}
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginBottom: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Verification</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <ShieldCheck size={11} color={verColor} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: verColor }}>{verLabel}</span>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: '8px 10px' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>Last Updated</p>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{bank.lastUpdated}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 8 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.75)', letterSpacing: '0.05em' }}>ACTIVE · ACH PAYOUT ENABLED</span>
              </div>
            </div>

            {/* Right: ops info + actions */}
            <div style={{ flex: '0 1 210px', display: 'flex', flexDirection: 'column', gap: 8 }}>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 11, padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ArrowRightLeft size={11} color="#06B6D4" />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>
                    <span style={{ color: '#06B6D4', fontWeight: 600 }}>Standard ACH:</span> {bank.achSpeed}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <ShieldCheck size={10} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
                    Bank details are encrypted. Visible only to authorized label personnel.
                  </span>
                </div>
              </div>

              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, padding: '9px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                <RotateCcw size={12} /> Update Bank Account
              </button>
              <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 10, padding: '7px 14px', borderRadius: 9, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
                <ExternalLink size={10} /> View Payout History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtistOSSettings() {
  const artist = useActiveArtist();

  const [notifs, setNotifs] = useState(NOTIF_DEFAULTS);
  const [expanded, setExpanded] = useState<string | null>('spotify');

  function toggleNotif(key: keyof typeof NOTIF_DEFAULTS) {
    setNotifs(v => ({ ...v, [key]: !v[key] }));
  }

  const connectedCount = PLATFORMS.filter(p => p.status === 'connected').length;

  if (!artist) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist data available.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={16} color="#F59E0B" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 1 }}>
            <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>Settings</h1>
            <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)', color: '#F59E0B', letterSpacing: '0.06em' }}>SPIN Records</span>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>SPIN Records — Imprint Configuration</p>
        </div>
      </div>

      <ArtistPayoutBanking />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Bell size={13} color="#F59E0B" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notifications</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            {(Object.entries(notifs) as [keyof typeof NOTIF_DEFAULTS, boolean][]).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{NOTIF_LABELS[key]}</span>
                <button onClick={() => toggleNotif(key)} style={{
                  position: 'relative', width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer', flexShrink: 0,
                  background: val ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)',
                  outline: `1px solid ${val ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.1)'}`,
                  transition: 'all 0.2s',
                }}>
                  <div style={{
                    position: 'absolute', top: 2, width: 14, height: 14, borderRadius: '50%', transition: 'all 0.2s',
                    left: val ? 17 : 2, background: val ? '#06B6D4' : 'rgba(255,255,255,0.25)',
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Lock size={13} color="#EF4444" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Access & Security</span>
          </div>
          <div style={{ padding: '14px 18px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Artist Account</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.025)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `${artist.avatarColor}20`, border: `1px solid ${artist.avatarColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: artist.avatarColor }}>{artist.avatarInitials}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#fff' }}>{artist.name}</p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{artist.genre}</p>
              </div>
              <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '3px 8px', borderRadius: 20, background: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.2)' }}>ACTIVE</span>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Authorized Team</p>
            {['manager@gmg.ai', 'team@gmg.ai'].map(email => (
              <div key={email} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>{email}</span>
                <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>Manager</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#10B981" />
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>Connected Platforms</span>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 10 }}>
                {connectedCount} of {PLATFORMS.length} connected
              </span>
            </div>
          </div>
        </div>

        {PLATFORMS.map((platform, idx) => {
          const meta = STATUS_META[platform.status];
          const isExpanded = expanded === platform.id;
          const IconComp = platform.icon;
          const StatusIcon = meta.Icon;

          return (
            <div key={platform.id} style={{ borderBottom: idx < PLATFORMS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div
                onClick={() => setExpanded(isExpanded ? null : platform.id)}
                style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', gap: 14 }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: `${platform.color}15`, border: `1px solid ${platform.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconComp size={17} color={platform.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{platform.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: meta.bg, border: `1px solid ${meta.border}` }}>
                      <StatusIcon size={9} color={meta.color} />
                      <span style={{ fontSize: 9, fontFamily: 'monospace', color: meta.color }}>{meta.label}</span>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{platform.description}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {platform.status === 'connected' && platform.lastSync && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <RefreshCw size={10} color="rgba(255,255,255,0.2)" />
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{platform.lastSync}</span>
                    </div>
                  )}
                  {platform.status === 'not_connected' && (
                    <button onClick={e => e.stopPropagation()} style={{ fontSize: 10, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', background: `${platform.color}15`, border: `1px solid ${platform.color}30`, color: platform.color, fontWeight: 600 }}>
                      Connect
                    </button>
                  )}
                  {platform.status === 'pending' && (
                    <button onClick={e => e.stopPropagation()} style={{ fontSize: 10, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B', fontWeight: 600 }}>
                      Setup
                    </button>
                  )}
                  <ChevronRight size={14} color="rgba(255,255,255,0.2)" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 20px 16px 72px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      What this enables
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {platform.enables.map(d => (
                        <span key={d} style={{
                          fontSize: 10, padding: '4px 10px', borderRadius: 20,
                          background: platform.status === 'connected' ? `${platform.color}12` : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${platform.status === 'connected' ? `${platform.color}25` : 'rgba(255,255,255,0.07)'}`,
                          color: platform.status === 'connected' ? platform.color : 'rgba(255,255,255,0.3)',
                        }}>
                          {platform.status === 'connected' && <CheckCircle2 size={8} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />}
                          {d}
                        </span>
                      ))}
                    </div>
                    {platform.status === 'connected' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                          <RefreshCw size={10} /> Sync Now
                        </button>
                        <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                          <ExternalLink size={10} /> Open Dashboard
                        </button>
                      </div>
                    ) : (
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, padding: '8px 16px', borderRadius: 9, cursor: 'pointer', background: `${platform.color}15`, border: `1px solid ${platform.color}30`, color: platform.color, fontWeight: 600 }}>
                        <ExternalLink size={11} /> Connect {platform.name}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
