import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin, TrendingUp, TrendingDown, ShoppingBag, Users, Radio,
  Activity, Target, AlertTriangle, CheckCircle, Zap, BarChart2,
  DollarSign, Clock, ArrowUpRight, RefreshCcw, Eye, Cpu,
  Flame, Music2, Globe, CreditCard, X, ChevronRight,
} from 'lucide-react';

const mono: React.CSSProperties = { fontFamily: 'monospace' };

type SignalView = 'artist' | 'label';

type Urgency = 'immediate' | 'high' | 'medium' | 'watching';

type SignalType =
  | 'geo-spike'
  | 'content-signal'
  | 'merch-intent'
  | 'creator-pickup'
  | 'stream-accel'
  | 'engagement-decay'
  | 'conversion-lift'
  | 'playlist-miss'
  | 'roster-health'
  | 'breakout-artist'
  | 'campaign-under'
  | 'payout-ready'
  | 'release-blocker'
  | 'recoupment-change'
  | 'budget-window';

interface Signal {
  id: string;
  type: SignalType;
  urgency: Urgency;
  title: string;
  body: string;
  cta?: { label: string; action: string };
  meta?: string;
  value?: string;
  valueColor?: string;
  fresh?: boolean;
}

const TYPE_CFG: Record<SignalType, { label: string; color: string; icon: React.ElementType }> = {
  'geo-spike':         { label: 'Geo Spike',        color: '#10B981', icon: MapPin        },
  'content-signal':    { label: 'Content Signal',   color: '#06B6D4', icon: Radio         },
  'merch-intent':      { label: 'Merch Intent',     color: '#EC4899', icon: ShoppingBag   },
  'creator-pickup':    { label: 'Creator Pickup',   color: '#F59E0B', icon: Users         },
  'stream-accel':      { label: 'Stream Accel',     color: '#10B981', icon: TrendingUp    },
  'engagement-decay':  { label: 'Decay Alert',      color: '#EF4444', icon: TrendingDown  },
  'conversion-lift':   { label: 'Conversion Lift',  color: '#10B981', icon: Target        },
  'playlist-miss':     { label: 'Playlist Miss',    color: '#F59E0B', icon: Music2        },
  'roster-health':     { label: 'Roster Health',    color: '#F59E0B', icon: Activity      },
  'breakout-artist':   { label: 'Breakout',         color: '#EC4899', icon: Flame         },
  'campaign-under':    { label: 'Campaign Under',   color: '#EF4444', icon: BarChart2     },
  'payout-ready':      { label: 'Payout Ready',     color: '#10B981', icon: CreditCard    },
  'release-blocker':   { label: 'Release Blocker',  color: '#EF4444', icon: AlertTriangle },
  'recoupment-change': { label: 'Recoupment',       color: '#06B6D4', icon: DollarSign    },
  'budget-window':     { label: 'Budget Window',    color: '#F59E0B', icon: Zap           },
};

const URGENCY_CFG: Record<Urgency, { label: string; color: string }> = {
  immediate: { label: 'IMMEDIATE', color: '#EF4444' },
  high:      { label: 'HIGH',      color: '#F59E0B' },
  medium:    { label: 'MEDIUM',    color: '#06B6D4' },
  watching:  { label: 'WATCHING', color: '#94A3B8' },
};

const ARTIST_SIGNALS: Signal[] = [
  {
    id: 'a1',
    type: 'geo-spike',
    urgency: 'immediate',
    title: 'São Paulo stream velocity up 50% in 72 hours',
    body: 'Brazil is your fastest-growing market right now. Organic discovery is driving it — no paid activity running. If you activate a creator pack in São Paulo today, you can amplify while the momentum is hot.',
    cta: { label: 'Activate LATAM Creator Pack', action: 'latam-creators' },
    value: '+50%',
    valueColor: '#10B981',
    meta: '72h · Brazil',
  },
  {
    id: 'a2',
    type: 'creator-pickup',
    urgency: 'high',
    title: '3 mid-tier creators posted without coordination',
    body: 'Three creators in your niche used your track in organic posts in the past 48 hours without a paid brief. Their combined reach is 1.2M. This is an earned signal — reaching out with an official brief now could multiply it.',
    cta: { label: 'Brief These Creators', action: 'brief-creators' },
    value: '1.2M reach',
    valueColor: '#F59E0B',
    meta: '48h · TikTok',
  },
  {
    id: 'a3',
    type: 'stream-accel',
    urgency: 'high',
    title: 'Flagpole Sitta daily streams up 22% — no campaign active',
    body: 'This track is growing on its own. Something external is driving it — possibly sync, a viral post, or playlist add. Now is the time to push paid support behind it before the organic window closes.',
    cta: { label: 'Launch Paid Behind This Track', action: 'paid-track' },
    value: '+22%/day',
    valueColor: '#10B981',
    meta: 'Last 7 days · Spotify',
  },
  {
    id: 'a4',
    type: 'merch-intent',
    urgency: 'medium',
    title: 'Merch link clicks up 3x vs baseline this week',
    body: 'Your fans are checking merch more than usual. No new drop has been announced. This could be purchase intent from the streaming momentum. A limited drop announcement in the next 48 hours would likely convert.',
    cta: { label: 'Schedule Merch Drop', action: 'merch-drop' },
    value: '3x intent',
    valueColor: '#EC4899',
    meta: '7-day window',
  },
  {
    id: 'a5',
    type: 'playlist-miss',
    urgency: 'immediate',
    title: 'Apple Music editorial deadline in 10 days — profile incomplete',
    body: 'Your Apple Music artist profile is missing bio, Q&A, and promo card. Apple editorial pitches require a complete profile. You have a real window here — but it closes in 10 days and cannot be recovered.',
    cta: { label: 'Fix Apple Music Profile', action: 'apple-fix' },
    value: '10 days left',
    valueColor: '#EF4444',
    meta: 'Apple Music · Editorial',
  },
  {
    id: 'a6',
    type: 'content-signal',
    urgency: 'medium',
    title: 'Behind-the-scenes content outperforming release content 4:1',
    body: 'Your candid and behind-the-scenes posts are getting 4x the engagement of your formal release content. Your audience wants access and authenticity — shifting the content mix now would improve overall reach.',
    value: '4x eng',
    valueColor: '#06B6D4',
    meta: 'Last 14 days · Instagram + TikTok',
  },
  {
    id: 'a7',
    type: 'engagement-decay',
    urgency: 'high',
    title: 'Spotify followers growing but saves per stream are dropping',
    body: 'New listeners are finding you but not saving your tracks. This suggests passive listening rather than fan conversion. Your Release Radar and Discover Weekly placements depend on save rates — this needs attention before your next release.',
    cta: { label: 'Run Save Rate Recovery', action: 'save-recovery' },
    value: '-18% saves',
    valueColor: '#EF4444',
    meta: 'Last 30 days · Spotify',
  },
  {
    id: 'a8',
    type: 'conversion-lift',
    urgency: 'medium',
    title: 'Email list subscribers converting to streams at 34%',
    body: 'Your email audience is highly engaged — 34% of subscribers streamed your last release within 24 hours of the announcement. This is well above the 12% industry average. Your fan list is an asset worth growing.',
    value: '34% conv',
    valueColor: '#10B981',
    meta: 'Last release · Email segment',
  },
  {
    id: 'a9',
    type: 'geo-spike',
    urgency: 'watching',
    title: 'Emerging listener spike in Atlanta — no campaign active',
    body: 'Atlanta is showing early-stage organic growth without any targeted activity. Playlists local to the market may be picking you up. Worth monitoring — if it holds for 7 more days, a paid push would be justified.',
    value: '+18%',
    valueColor: '#10B981',
    meta: '14-day trend · Atlanta',
  },
  {
    id: 'a10',
    type: 'stream-accel',
    urgency: 'watching',
    title: 'Night streaming hours outperforming day streams by 2.4x',
    body: 'Your audience listens heavily between 10pm–2am. Your current paid schedule runs daytime. Shifting ad delivery windows to evening and late night would reach your listeners when they are already active.',
    value: '2.4x at night',
    valueColor: '#06B6D4',
    meta: 'Last 30 days · Time-of-day data',
  },
  {
    id: 'a11',
    type: 'merch-intent',
    urgency: 'watching',
    title: 'Scrunchie set and crossbody bag getting repeat visits',
    body: 'Two merch items are being viewed multiple times by the same users — a typical pre-purchase behavior signal. These items may benefit from a limited-window push or a bundle offer to close the sale.',
    value: '2 items trending',
    valueColor: '#EC4899',
    meta: 'Last 7 days · Store analytics',
  },
  {
    id: 'a12',
    type: 'conversion-lift',
    urgency: 'medium',
    title: 'Pre-save rate 4x higher from creator traffic vs direct links',
    body: 'Fans arriving from creator content are converting to pre-saves at 4x the rate of your direct links. This validates your creator strategy — increasing creator seeding ahead of this release would directly improve day-1 performance.',
    cta: { label: 'Expand Creator Seeding', action: 'creator-seed' },
    value: '4x conv rate',
    valueColor: '#10B981',
    meta: 'Current release · Attribution',
  },
];

const LABEL_SIGNALS: Signal[] = [
  {
    id: 'l1',
    type: 'breakout-artist',
    urgency: 'immediate',
    title: 'All American Rejects LATAM momentum needs immediate paid backing',
    body: 'Brazil and Mexico City are showing organic breakout signals. No label budget is currently deployed in these markets. This is a high-confidence, time-limited window — the 5-day paid warm-up window starts now if you act.',
    cta: { label: 'Approve LATAM Budget', action: 'latam-budget' },
    value: '+50% velocity',
    valueColor: '#EC4899',
    meta: 'Brazil + Mexico · 72h signal',
    fresh: true,
  },
  {
    id: 'l2',
    type: 'roster-health',
    urgency: 'high',
    title: 'Roster health score down 6 points this week — 2 artists in risk zone',
    body: 'Overall label health dropped from 79 to 73. Two artists have missed milestones and one has a release blocker that has been open for 12 days without resolution. The system has flagged these for escalation.',
    cta: { label: 'Review Risk Artists', action: 'risk-artists' },
    value: '73 / 100',
    valueColor: '#F59E0B',
    meta: 'Weekly health scan',
  },
  {
    id: 'l3',
    type: 'budget-window',
    urgency: 'immediate',
    title: 'High-return budget window open — 3 artists under-deployed this week',
    body: 'Three artists have allocated campaign budgets that have not been deployed. Two of them are currently showing active streaming momentum that would amplify paid spend. Every day these budgets sit idle is missed velocity.',
    cta: { label: 'Deploy Idle Budgets', action: 'deploy-budgets' },
    value: '$8,200 idle',
    valueColor: '#F59E0B',
    meta: 'Current period · Spend analysis',
    fresh: true,
  },
  {
    id: 'l4',
    type: 'payout-ready',
    urgency: 'medium',
    title: '2 artist recoupment accounts crossed payout threshold',
    body: 'Two artists have reached the recoupment threshold and are now eligible for their first streaming revenue payout. Releasing this now builds trust and improves artist retention. Approval is a one-click action.',
    cta: { label: 'Approve Payouts', action: 'approve-payouts' },
    value: '$4,100 ready',
    valueColor: '#10B981',
    meta: 'This cycle · Recoupment cleared',
  },
  {
    id: 'l5',
    type: 'release-blocker',
    urgency: 'immediate',
    title: 'Arctic Fox — release assets incomplete with 12 days to drop',
    body: 'The release is 12 days out and platform delivery is missing final artwork and ISRC metadata on two tracks. Apple Music and Spotify require 7 days minimum for processing. If this is not resolved in 48 hours, the release date is at risk.',
    cta: { label: 'Resolve Release Blockers', action: 'release-blockers' },
    value: '12 days left',
    valueColor: '#EF4444',
    meta: 'Arctic Fox · Asset vault',
    fresh: true,
  },
  {
    id: 'l6',
    type: 'campaign-under',
    urgency: 'high',
    title: "SNBJR Records campaign is underperforming vs projections by 38%",
    body: 'The current campaign is delivering streams at 62% of the projected rate. The paid mix is over-indexed on Meta and under-deployed on TikTok. Rebalancing now would recover roughly half the shortfall before the campaign ends.',
    cta: { label: 'Rebalance Campaign Mix', action: 'rebalance' },
    value: '-38% vs plan',
    valueColor: '#EF4444',
    meta: 'SNBJR Records · Ongoing campaign',
  },
  {
    id: 'l7',
    type: 'recoupment-change',
    urgency: 'medium',
    title: 'Recoupment rate accelerating for 2 artists — on track to clear early',
    body: 'Two artists are recouping advances faster than projected based on current streaming velocity. If this pace holds, they will clear 6–8 weeks ahead of schedule. This creates an opportunity to offer a new advance tied to the next release cycle.',
    value: 'On track · Early',
    valueColor: '#06B6D4',
    meta: 'Recoupment modeling',
  },
  {
    id: 'l8',
    type: 'breakout-artist',
    urgency: 'high',
    title: 'Unsigned artist on Rocksteady watchlist spiking in 3 markets',
    body: 'A watched artist outside your roster is showing momentum in LA, Atlanta, and Chicago simultaneously. Rocksteady score jumped from 61 to 88 this week. This is the type of multi-market organic signal that typically precedes a competitive signing window.',
    cta: { label: 'View Artist Report', action: 'view-artist' },
    value: 'Score: 88',
    valueColor: '#EC4899',
    meta: 'Rocksteady · A&R radar',
  },
  {
    id: 'l9',
    type: 'roster-health',
    urgency: 'watching',
    title: 'GMG direct roster averaging 84 momentum score — strongest in 3 months',
    body: 'Momentum across the GMG direct roster is at its highest point in the last quarter. Three artists are in active campaign periods and performing above baseline. No immediate intervention needed — the system is sustaining growth.',
    value: '84 avg score',
    valueColor: '#10B981',
    meta: 'GMG Roster · Monthly scan',
  },
  {
    id: 'l10',
    type: 'payout-ready',
    urgency: 'watching',
    title: 'Label advance pool replenishment window opening next month',
    body: 'Based on current streaming receivables across the roster, your advance pool will be eligible for replenishment in approximately 30 days. Planning a new advance cycle now means you can deploy faster when the window opens.',
    value: '~30 days',
    valueColor: '#06B6D4',
    meta: 'Financial modeling · Q2',
  },
  {
    id: 'l11',
    type: 'campaign-under',
    urgency: 'watching',
    title: 'TikTok Spark Ads performing 2.3x above Meta across the full roster',
    body: 'Roster-wide analysis shows TikTok Spark Ads are significantly outperforming Meta Reels for stream conversion. The overall budget mix is still weighted 60/40 toward Meta. A rebalance across upcoming campaigns would materially improve ROI.',
    value: '2.3x TikTok',
    valueColor: '#06B6D4',
    meta: 'Full roster · Platform analysis',
  },
  {
    id: 'l12',
    type: 'budget-window',
    urgency: 'medium',
    title: 'Quarterly budget review — 3 artists have unspent Q1 allocations',
    body: 'Q1 ends in 18 days and three artists have remaining budget that has not been committed to campaigns. Unspent allocations typically roll back to the label pool. Deploying now on active momentum windows prevents waste.',
    cta: { label: 'Review Q1 Spending', action: 'q1-review' },
    value: '$12,400 unspent',
    valueColor: '#F59E0B',
    meta: 'Q1 close · Budget management',
  },
];

function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const c = URGENCY_CFG[urgency];
  return (
    <span style={{
      ...mono, fontSize: 7, fontWeight: 900, padding: '2px 7px', borderRadius: 5,
      background: `${c.color}12`, border: `1px solid ${c.color}30`, color: c.color,
      letterSpacing: '0.09em',
    }}>
      {c.label}
    </span>
  );
}

function TypeBadge({ type }: { type: SignalType }) {
  const c = TYPE_CFG[type];
  return (
    <span style={{
      ...mono, fontSize: 7, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
      background: `${c.color}10`, border: `1px solid ${c.color}28`, color: c.color,
      letterSpacing: '0.07em',
    }}>
      {c.label}
    </span>
  );
}

interface SignalCardProps {
  signal: Signal;
  onDismiss: (id: string) => void;
}

function SignalCard({ signal, onDismiss }: SignalCardProps) {
  const [hov, setHov] = useState(false);
  const [ctaHov, setCtaHov] = useState(false);
  const tc = TYPE_CFG[signal.type];
  const Icon = tc.icon;
  const isUrgent = signal.urgency === 'immediate' || signal.urgency === 'high';

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: hov ? '#111318' : '#0C0E12',
        border: `1px solid ${hov ? tc.color + '30' : isUrgent ? tc.color + '18' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12, padding: '13px 14px',
        transition: 'all 0.2s',
        boxShadow: hov ? `0 0 18px ${tc.color}08` : 'none',
      }}
    >
      {signal.fresh && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, ${tc.color}60, transparent)`,
          borderRadius: '12px 12px 0 0',
        }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0,
          background: `${tc.color}12`, border: `1px solid ${tc.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isUrgent ? `0 0 10px ${tc.color}20` : 'none',
        }}>
          <Icon size={13} color={tc.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <TypeBadge type={signal.type} />
            <UrgencyBadge urgency={signal.urgency} />
            {signal.fresh && (
              <span style={{ ...mono, fontSize: 7, padding: '2px 7px', borderRadius: 5, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.28)', color: '#10B981', letterSpacing: '0.08em' }}>NEW</span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{signal.title}</p>
        </div>

        {signal.value && (
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <div style={{ ...mono, fontSize: 14, fontWeight: 900, color: signal.valueColor || tc.color, lineHeight: 1 }}>{signal.value}</div>
            {signal.meta && <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', marginTop: 2, lineHeight: 1.3, maxWidth: 90, textAlign: 'right' }}>{signal.meta}</div>}
          </div>
        )}

        <button
          onClick={() => onDismiss(signal.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'rgba(255,255,255,0.15)', flexShrink: 0, lineHeight: 0 }}
        >
          <X size={11} />
        </button>
      </div>

      {/* Body text */}
      <p style={{ margin: '0 0 10px 40px', fontSize: 10.5, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65 }}>{signal.body}</p>

      {/* Footer */}
      {(signal.cta || signal.meta) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 40 }}>
          {!signal.value && signal.meta && <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.18)' }}>{signal.meta}</span>}
          {!signal.value && !signal.meta && <span />}
          {signal.cta ? (
            <button
              onMouseEnter={() => setCtaHov(true)}
              onMouseLeave={() => setCtaHov(false)}
              style={{
                ...mono, fontSize: 9, fontWeight: 800, padding: '5px 12px', borderRadius: 8,
                cursor: 'pointer', letterSpacing: '0.04em',
                background: ctaHov ? `${tc.color}1E` : `${tc.color}0E`,
                border: `1px solid ${ctaHov ? tc.color + '50' : tc.color + '28'}`,
                color: tc.color, transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {signal.cta.label}
              <ArrowUpRight size={9} />
            </button>
          ) : <span />}
        </div>
      )}
    </div>
  );
}

interface SignalFeedModuleProps {
  view: SignalView;
}

export default function SignalFeedModule({ view }: SignalFeedModuleProps) {
  const allSignals = view === 'artist' ? ARTIST_SIGNALS : LABEL_SIGNALS;
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [filterUrgency, setFilterUrgency] = useState<Urgency | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<SignalType | 'ALL'>('ALL');
  const [lastRefresh, setLastRefresh] = useState(0);
  const [scanPct, setScanPct] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setScanPct(prev => {
        if (prev >= 100) {
          setLastRefresh(s => s + 1);
          return 0;
        }
        return prev + (100 / 45);
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const visible = allSignals.filter(s => {
    if (dismissed.has(s.id)) return false;
    if (filterUrgency !== 'ALL' && s.urgency !== filterUrgency) return false;
    if (filterType !== 'ALL' && s.type !== filterType) return false;
    return true;
  });

  const immediateCount = allSignals.filter(s => !dismissed.has(s.id) && s.urgency === 'immediate').length;
  const highCount      = allSignals.filter(s => !dismissed.has(s.id) && s.urgency === 'high').length;

  const urgencyFilters: Array<Urgency | 'ALL'> = ['ALL', 'immediate', 'high', 'medium', 'watching'];

  const color = view === 'artist' ? '#06B6D4' : '#F59E0B';

  return (
    <div>
      <style>{`
        @keyframes sf-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(800%)} }
        @keyframes sf-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
        @keyframes sf-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* System status bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 11, marginBottom: 14,
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap', gap: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.8)' }} />
              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '1px solid rgba(16,185,129,0.4)', animation: 'sf-pulse 2s infinite' }} />
            </div>
            <span style={{ ...mono, fontSize: 8, fontWeight: 900, color: '#10B981', letterSpacing: '0.08em' }}>SYSTEM WATCHING</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Cpu size={9} color="rgba(255,255,255,0.2)" />
            <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.22)' }}>
              {allSignals.length - dismissed.size} active signals · {visible.length} shown
            </span>
          </div>

          {immediateCount > 0 && (
            <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 8px', borderRadius: 5, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', letterSpacing: '0.08em' }}>
              {immediateCount} IMMEDIATE
            </span>
          )}
          {highCount > 0 && (
            <span style={{ ...mono, fontSize: 7, fontWeight: 900, padding: '2px 8px', borderRadius: 5, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B', letterSpacing: '0.08em' }}>
              {highCount} HIGH
            </span>
          )}
        </div>

        {/* Scan progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.18)' }}>next scan</span>
          <div style={{ width: 60, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${scanPct}%`, background: color, borderRadius: 99, transition: 'width 1s linear' }} />
          </div>
          <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.18)' }}>{Math.round(45 - (scanPct / 100) * 45)}s</span>
        </div>
      </div>

      {/* Urgency filter */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
        {urgencyFilters.map(u => {
          const active = filterUrgency === u;
          const uc = u === 'ALL' ? { color: '#94A3B8' } : URGENCY_CFG[u];
          return (
            <button
              key={u}
              onClick={() => setFilterUrgency(u)}
              style={{
                ...mono, fontSize: 7.5, fontWeight: 900, padding: '4px 11px', borderRadius: 20,
                cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                background: active ? `${uc.color}18` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? uc.color + '40' : 'rgba(255,255,255,0.07)'}`,
                color: active ? uc.color : 'rgba(255,255,255,0.28)',
                transition: 'all 0.15s',
              }}
            >
              {u === 'ALL' ? 'All Urgency' : u}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.18)', lineHeight: 1.7, marginBottom: 14 }}>
        {view === 'artist'
          ? 'The system is monitoring your geo momentum, content performance, creator activity, streaming patterns, and fan conversion in real time. Each signal below represents something the system noticed that you should act on — or be aware of.'
          : 'The system is monitoring your full roster for health changes, breakout signals, campaign gaps, payout readiness, and release blockers. Each signal below is roster intelligence surfaced without you having to look for it.'}
      </p>

      {/* Signals */}
      {visible.length === 0 ? (
        <div style={{ padding: '32px 20px', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12 }}>
          <CheckCircle size={20} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 10px', display: 'block' }} />
          <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>No signals match the current filter</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {visible.map((s, i) => (
            <div key={s.id} style={{ animation: `sf-in 0.2s ease ${i * 0.04}s both` }}>
              <SignalCard signal={s} onDismiss={id => setDismissed(prev => new Set([...prev, id]))} />
            </div>
          ))}
        </div>
      )}

      {dismissed.size > 0 && (
        <button
          onClick={() => setDismissed(new Set())}
          style={{
            ...mono, marginTop: 12, fontSize: 8, fontWeight: 700, padding: '6px 14px', borderRadius: 8,
            cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s',
          }}
        >
          <RefreshCcw size={9} />
          Restore {dismissed.size} dismissed {dismissed.size === 1 ? 'signal' : 'signals'}
        </button>
      )}
    </div>
  );
}
