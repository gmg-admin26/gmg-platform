import { useState, useEffect } from 'react';
import {
  AlertTriangle, TrendingDown, Clock, DollarSign, Radio,
  Zap, ArrowRight, Users, Target, BarChart2, Music2, ShoppingBag,
  MapPin,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

const mono: React.CSSProperties = { fontFamily: 'monospace' };

function chipStyle(color: string): React.CSSProperties {
  return {
    ...mono, fontSize: 7, padding: '2px 8px', borderRadius: 20,
    textTransform: 'uppercase' as const, letterSpacing: '0.07em',
    color, background: `${color}14`, border: `1px solid ${color}30`,
    whiteSpace: 'nowrap' as const,
  };
}

interface LossMetric {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  subtext: string;
}

interface ConsequenceChain {
  immediateImpact: string;
  downstreamConsequence: string;
  resolveAction: string;
}

interface Consequence {
  id: string;
  issue: string;
  context: string;
  severity: 'critical' | 'high' | 'medium';
  color: string;
  timeWindowLabel: string;
  windowHours: number;
  expectedDownside: string;
  metrics: LossMetric[];
  algoNote: string;
  cta: string;
  ctaDetail: string;
  chain?: ConsequenceChain;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

function buildConsequences(artist: SignedArtist): Consequence[] {
  const preSaves = Math.round(artist.followers * 0.022 + artist.monthlyListeners * 0.005);
  const preSaveGap = Math.max(25_000 - preSaves, 0);
  const preSavePct = Math.min(Math.round((preSaves / 25_000) * 100), 100);

  const creatorCoverage = Math.min(Math.round(artist.fanEngagementScore * 0.7 + 10), 100);
  const creatorGap = 100 - creatorCoverage;

  const listenerGap = Math.max(1_000_000 - artist.monthlyListeners, 0);
  const tourListenerGap = Math.max(250_000 - Math.round(artist.monthlyListeners * 0.14), 0);

  const hasActiveRelease = artist.releases.some(r => r.status === 'Pre-Save Live' || r.status === 'Scheduled');
  const recoupBalance = artist.financials.recoupableBalance;
  const adSpendLast30 = artist.financials.adSpend.last30;

  const gaps: Consequence[] = [];

  if (preSaveGap > 0) {
    gaps.push({
      id: 'presave_pace',
      issue: `Pre-save pace ${preSavePct}% of target`,
      context: 'Release Signal',
      severity: preSaveGap > 10_000 ? 'critical' : 'high',
      color: preSaveGap > 10_000 ? '#EF4444' : '#F59E0B',
      timeWindowLabel: `${fmt(preSaveGap)} pre-saves remaining`,
      windowHours: 18 * 24,
      expectedDownside: `At ${preSavePct}% of the 25K target, Release Radar and Discover Weekly eligibility is below the activation threshold. Missing the 25K mark reduces first-week algorithmic reach by an estimated 25–40% and compresses the window for editorial follow-on adds — both of which compound negatively across the full 30-day algo window.`,
      metrics: [
        { icon: Radio,        label: 'Pre-save gap',                value: `${fmt(preSaveGap)} remaining`,    color: preSaveGap > 10_000 ? '#EF4444' : '#F59E0B', subtext: `Current: ${fmt(preSaves)} of 25,000 target` },
        { icon: Zap,          label: 'Algo trigger at risk',        value: '-25% to -40% day-1 reach',        color: '#F59E0B',                                   subtext: 'Estimated reduction vs 25K pre-save baseline' },
        { icon: DollarSign,   label: 'Revenue impact · first week', value: `$${Math.round(preSaveGap * 0.43 / 100) * 100 > 5000 ? Math.round(preSaveGap * 0.43 / 1000) + 'K' : Math.round(preSaveGap * 0.43)} potential lost`, color: '#F59E0B', subtext: 'Compounding effect across 30-day algo window' },
      ],
      algoNote: `${fmt(preSaves)} pre-saves logged. ${fmt(preSaveGap)} more needed to hit the 25K trigger before release. Each day of inaction reduces the remaining runway — pre-save pushes during active stream spikes convert at 3× the baseline rate, and that window is open right now.`,
      cta: 'Accelerate Pre-Saves',
      ctaDetail: `${fmt(preSaveGap)} needed to close gap`,
      chain: {
        immediateImpact: 'Day-1 algorithmic trigger threshold not met — Release Radar and Discover Weekly reach reduced by an estimated 25–40%',
        downstreamConsequence: 'Lower editorial conversion probability in weeks 1–2 · algorithmic follow-on suppressed · week-one streams projected 12–18% below potential',
        resolveAction: `Push pre-save to top fan segment immediately · Brief ${Math.ceil(preSaveGap / 400)} creators to post pre-save links in the next 48 hours while the stream spike window is still active`,
      },
    });
  }

  if (creatorGap > 20) {
    gaps.push({
      id: 'creator_seeding',
      issue: `Creator seeding ${creatorGap}% below target`,
      context: 'Organic Velocity',
      severity: creatorGap > 40 ? 'critical' : 'high',
      color: creatorGap > 40 ? '#EF4444' : '#F59E0B',
      timeWindowLabel: '8 days remaining',
      windowHours: 8 * 24,
      expectedDownside: `Release week organic velocity is projected to fall 22% below target. Creator posts must go live 48–72h before release for maximum algorithmic seeding — after that window, their discovery contribution drops by more than half. Each day of seeding delay is a permanent reduction in the day-1 discovery pool.`,
      metrics: [
        { icon: Users,        label: 'Creator coverage gap',        value: `${creatorGap}% below target`,   color: '#EF4444', subtext: `${creatorCoverage} creators activated of 100 target` },
        { icon: Radio,        label: 'Organic reach loss · 7 days', value: '~18K streams lost',             color: '#EF4444', subtext: 'Velocity impact compounds through week 2' },
        { icon: TrendingDown, label: 'Day-1 momentum impact',       value: '-22% release velocity',         color: '#F59E0B', subtext: 'Algo trigger threshold at risk' },
      ],
      algoNote: 'Creator posts require a 48–72h lead time before release to generate maximum algorithmic seeding. After the release date, creator-driven discovery returns less than half the reach of pre-release seeding. The window is closing.',
      cta: 'Activate Creators',
      ctaDetail: 'Rocksteady auto-matches available creators',
      chain: {
        immediateImpact: `Release week organic velocity reduced ~22% — creator seeding gap means fewer posts seeding discovery pools in the 48–72h pre-release window where impact is highest`,
        downstreamConsequence: 'Smaller day-1 algorithmic discovery pool · negative momentum compounds through week 2 · editorial conversion probability falls · week-1 chart position affected',
        resolveAction: `Brief ${Math.ceil(creatorGap * 0.6)} creators via Rocksteady in the next 48 hours — post timing must be 48–72h before release or contribution drops by more than half`,
      },
    });
  }

  if (adSpendLast30 < 1000 && hasActiveRelease) {
    gaps.push({
      id: 'paid_media',
      issue: 'Paid media below activation floor',
      context: 'Paid Amplification',
      severity: 'high',
      color: '#F59E0B',
      timeWindowLabel: '5 days to launch deadline',
      windowHours: 5 * 24,
      expectedDownside: 'Paid campaigns require a 5-day warm-up window to build audience signal before release day. A cold campaign launched on drop day runs at 40% lower efficiency because the pixel has no data to optimize against. Launching late means paying more for lower-quality audience targeting at the highest-stakes moment.',
      metrics: [
        { icon: BarChart2,   label: 'Ad spend · last 30 days',     value: `$${adSpendLast30.toLocaleString()} of $3,500 floor`, color: '#F59E0B', subtext: 'Minimum threshold for meaningful release amplification' },
        { icon: Radio,       label: 'Streams at risk · release wk', value: '~9K streams lost',              color: '#F59E0B', subtext: 'Paid re-targeting compounds organic reach' },
        { icon: Target,      label: 'Pixel warm-up window',         value: 'Must launch 5 days pre',        color: '#EF4444', subtext: 'Cold campaigns on drop day lose 40% efficiency' },
      ],
      algoNote: 'Every day of delay after the 5-day warm-up threshold reduces paid campaign efficiency measurably. A campaign launched 2 days before release has had 60% less time to build audience signal than one launched 5 days prior — and the release window does not move.',
      cta: 'Fund Campaign',
      ctaDetail: `$${Math.max(3500 - adSpendLast30, 0).toLocaleString()} to reach activation floor`,
      chain: {
        immediateImpact: 'Paid amplification window is closing — campaigns launched without warm-up data run at 40% lower efficiency on drop day, the highest-stakes moment of the release cycle',
        downstreamConsequence: 'Weaker retargeting pool · ~9K streams forfeited in release week · lower paid-to-organic multiplier sustained throughout the 30-day campaign window',
        resolveAction: `Fund campaign with $${Math.max(3500 - adSpendLast30, 0).toLocaleString()} today and launch immediately — 5-day pixel warm-up window is the minimum required before release`,
      },
    });
  }

  if (listenerGap > 200_000) {
    gaps.push({
      id: 'streaming_gap',
      issue: `${fmt(listenerGap)} listeners to priority budget lane`,
      context: 'Streaming Threshold',
      severity: 'medium',
      color: '#06B6D4',
      timeWindowLabel: 'Rolling · momentum-dependent',
      windowHours: 60 * 24,
      expectedDownside: `The 1M monthly listener threshold unlocks a priority budget tier, advance renegotiation, and full team support. Without deliberate campaign acceleration, this gap tends to widen — platform algorithms disproportionately favor artists with faster velocity, making organic catch-up increasingly difficult the longer acceleration is deferred.`,
      metrics: [
        { icon: TrendingDown, label: 'Listener gap to priority tier',  value: `${fmt(listenerGap)} away`,            color: '#06B6D4', subtext: `Current: ${fmt(artist.monthlyListeners)} of 1M target` },
        { icon: DollarSign,   label: 'Advance expansion locked',       value: 'Requires 1M threshold',               color: '#F59E0B', subtext: 'Deal renegotiation window opens at milestone' },
        { icon: Zap,          label: 'Priority tier locked',           value: 'Full team support blocked',           color: '#06B6D4', subtext: 'Artist moves to Priority tier at 1M milestone' },
      ],
      algoNote: `At current growth rate, this milestone is reachable — but passive growth alone will not close the gap within the window needed to unlock the deal renegotiation cycle. A focused 60-day acceleration campaign would close approximately ${Math.round(listenerGap * 0.3 / 1000) * 1000 >= 1000 ? fmt(Math.round(listenerGap * 0.3)) : fmt(listenerGap)} of the gap and put the milestone in range.`,
      cta: 'Launch Growth Campaign',
      ctaDetail: `${fmt(listenerGap)} to unlock priority tier`,
      chain: {
        immediateImpact: 'Priority budget tier, advance renegotiation, and full team support remain locked — all three are gated on the 1M threshold',
        downstreamConsequence: 'Platform algorithms favor higher-velocity artists, making organic growth slower as the gap persists · deal expansion eligibility is delayed · lower-tier resource allocation continues',
        resolveAction: 'Accelerate via paid + creator campaigns targeting discovery playlists — 60-day focused push is the fastest path to close the gap and trigger the deal renegotiation window',
      },
    });
  }

  if (tourListenerGap > 50_000) {
    gaps.push({
      id: 'tour_readiness',
      issue: 'Top market not yet tour-ready',
      context: 'Live Activation',
      severity: 'medium',
      color: '#F59E0B',
      timeWindowLabel: 'Rolling · market-dependent',
      windowHours: 90 * 24,
      expectedDownside: 'Tour routing and live activation are blocked until the primary market hits 250K local listeners. Booking agents and promoters treat this threshold as a hard floor before committing to show capacity — below it, venue offers are smaller, guarantees are lower, and D2C merch programs do not activate.',
      metrics: [
        { icon: MapPin,   label: 'Local listener gap',             value: `${fmt(tourListenerGap)} needed`,  color: '#F59E0B', subtext: `${fmt(Math.round(artist.monthlyListeners * 0.14))} of 250K threshold` },
        { icon: Users,    label: 'Merch program locked',           value: 'Requires tour-ready status',      color: '#EC4899', subtext: 'D2C merch program activates at this milestone' },
        { icon: ShoppingBag, label: 'Booking pipeline status',    value: 'Pre-activation',                  color: '#F59E0B', subtext: 'GMG ops team on standby pending threshold' },
      ],
      algoNote: `${artist.city} market has ${fmt(Math.round(artist.monthlyListeners * 0.14))} local listeners. The 250K threshold activates the full GMG touring and merch pipeline — booking, D2C, and venue-tier access all unlock at once. A city-specific campaign is the fastest path to close this gap.`,
      cta: 'Target Local Market',
      ctaDetail: 'Activate city-specific campaign',
      chain: {
        immediateImpact: 'Tour routing and D2C merch program remain in pre-activation — booking agents require the 250K local listener floor before committing to show capacity or guarantees',
        downstreamConsequence: 'Live revenue stream delayed · D2C merch pipeline blocked · city-level fan base momentum cools without activation and becomes harder to re-ignite',
        resolveAction: 'Run a geo-targeted city campaign to close the local listener gap — 250K local threshold activates the full GMG touring and merch pipeline in one move',
      },
    });
  }

  if (artist.releases.some(r => r.status === 'Blocked')) {
    gaps.push({
      id: 'release_blocked',
      issue: 'Active release is blocked',
      context: 'Release Health',
      severity: 'critical',
      color: '#FA2D48',
      timeWindowLabel: 'Blocking all downstream execution',
      windowHours: 3 * 24,
      expectedDownside: 'A blocked release halts all downstream execution simultaneously. Platform pitching, creator seeding, and paid warm-up all require resolution before they can be sequenced. Every 24 hours this remains unresolved consumes available window time in each of those lanes — windows that cannot be extended.',
      metrics: [
        { icon: Zap,          label: 'Downstream impact',            value: 'All execution paused',            color: '#FA2D48', subtext: 'Campaign, seeding, and paid lanes blocked' },
        { icon: Music2,       label: 'Platform pitch window',        value: 'Closing while blocked',           color: '#FA2D48', subtext: 'Editorial submission deadlines continue counting down' },
        { icon: DollarSign,   label: 'Revenue delay cost',           value: 'Compounding daily',               color: '#F59E0B', subtext: 'Every 24h of delay reduces release week efficiency' },
      ],
      algoNote: 'This is the highest priority gap in the system. Every other time-sensitive action is blocked behind this resolution. Editorial deadlines, creator seeding windows, and paid warm-up all require this to clear first — and none of those clocks pause while this remains unresolved.',
      cta: 'Resolve Block',
      ctaDetail: 'Contact ops team immediately',
      chain: {
        immediateImpact: 'All downstream execution is paused — campaign activation, creator seeding, and paid warm-up are gated behind this resolution with no workaround',
        downstreamConsequence: 'Editorial submission deadlines continue counting down with no ability to submit · creator seeding window shrinks each day · paid warm-up window narrows toward launch · every hour costs real release-week efficiency',
        resolveAction: 'Contact the ops team immediately — do not wait for a scheduled check-in · every 24h of delay compounds efficiency loss across all release-week execution lanes',
      },
    });
  }

  if (recoupBalance > 50_000 && artist.financials.ytdRevenue < recoupBalance * 0.3) {
    gaps.push({
      id: 'recoup_velocity',
      issue: 'Recoupment velocity below target',
      context: 'Financial Health',
      severity: 'medium',
      color: '#8B5CF6',
      timeWindowLabel: 'Ongoing · tracking against advance',
      windowHours: 30 * 24,
      expectedDownside: 'At current revenue velocity, the recoupable balance is not tracking toward clearance within the expected window. Advance expansion, rate renegotiation, and priority tier upgrade are all gated on recoupment trajectory — and the deal renegotiation window only opens when the system sees improving coverage velocity, not just balance size.',
      metrics: [
        { icon: DollarSign,   label: 'Recoupable balance',           value: `$${(recoupBalance / 1000).toFixed(0)}K outstanding`,       color: '#8B5CF6', subtext: 'Advance + recoupable marketing spend' },
        { icon: BarChart2,    label: 'YTD revenue vs balance',       value: `${Math.round((artist.financials.ytdRevenue / recoupBalance) * 100)}% coverage YTD`, color: '#8B5CF6', subtext: 'Target is 30%+ coverage at this stage' },
        { icon: TrendingDown, label: 'Deal expansion eligibility',   value: 'Blocked until recoup trend',      color: '#F59E0B', subtext: 'Advance expansion requires improving trajectory' },
      ],
      algoNote: 'The deal renegotiation window responds to trajectory, not just balance. Improving YTD coverage velocity through streaming, touring, and sync now signals the kind of forward momentum that unlocks advance expansion discussions — waiting for the balance to clear passively takes significantly longer.',
      cta: 'Review Revenue Strategy',
      ctaDetail: 'See ArtistOS revenue projections',
      chain: {
        immediateImpact: 'Advance expansion eligibility is blocked — the deal renegotiation window does not open until coverage velocity shows an improving trend',
        downstreamConsequence: 'Advance increase, rate renegotiation, and priority tier upgrade all remain locked · passive recoupment extends the timeline significantly · competing artist priorities may shift attention during the delay',
        resolveAction: 'Accelerate streaming, sync placements, and live revenue now — targeting 30%+ YTD balance coverage this quarter is the signal needed to open the renegotiation window',
      },
    });
  }

  if (gaps.length === 0) {
    gaps.push({
      id: 'editorial_pitch',
      issue: 'Editorial pitch window approaching',
      context: 'Platform Pitching',
      severity: 'high',
      color: '#06B6D4',
      timeWindowLabel: '7 days to deadline',
      windowHours: 7 * 24,
      expectedDownside: 'Spotify requires editorial pitches at least 7 days before release. Missing this window removes the artist from editorial consideration entirely for this release cycle — there is no late submission path, no exception process, and no recovery. New Music Friday, R&B Rising, and Fresh Finds slots are permanently forfeited.',
      metrics: [
        { icon: Music2,   label: 'Editorial slots at risk',       value: '3 playlist targets',          color: '#06B6D4', subtext: 'New Music Friday, R&B Rising, Fresh Finds' },
        { icon: Radio,    label: 'Potential listener reach',      value: '50K–200K adds at risk',       color: '#06B6D4', subtext: 'Dependent on editorial outcome' },
        { icon: Zap,      label: 'Submission deadline',           value: '7-day hard deadline',         color: '#EF4444', subtext: 'Spotify does not review late submissions' },
      ],
      algoNote: 'Spotify editorial pitch must be submitted at least 7 days before release. The deadline is firm, non-negotiable, and non-recoverable. A pitch submitted today takes roughly 10 minutes and keeps all three editorial slots in play.',
      cta: 'Submit Pitch',
      ctaDetail: 'Takes ~10 min via Spotify for Artists',
      chain: {
        immediateImpact: 'Artist is removed from editorial playlist consideration for this release cycle — the deadline is a hard cut and there is no recovery path after it passes',
        downstreamConsequence: 'New Music Friday, R&B Rising, and Fresh Finds slots permanently forfeited for this release · 50K–200K listener adds lost · algorithmic follow-on that editorial adds trigger is suppressed entirely',
        resolveAction: 'Submit editorial pitch via Spotify for Artists now — takes ~10 minutes · the 7-day deadline is firm, non-negotiable, and non-recoverable',
      },
    });
  }

  return gaps;
}

function useCountdown(totalHours: number) {
  const [remaining, setRemaining] = useState(totalHours * 3600);
  useEffect(() => {
    const t = setInterval(() => setRemaining(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(remaining / 86400);
  const h = Math.floor((remaining % 86400) / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  return { d, h, m };
}

function CountdownBadge({ hours, color }: { hours: number; color: string }) {
  const { d, h, m } = useCountdown(hours);
  const urgent = d < 3;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 8,
      background: urgent ? `${color}14` : 'rgba(255,255,255,0.04)',
      border: `1px solid ${urgent ? color + '35' : 'rgba(255,255,255,0.08)'}`,
    }}>
      <Clock size={9} color={urgent ? color : 'rgba(255,255,255,0.3)'} />
      <span style={{ ...mono, fontSize: 9, color: urgent ? color : 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
        {d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`}
      </span>
      <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>remaining</span>
      {urgent && <span style={chipStyle(color)}>urgent</span>}
    </div>
  );
}

function MetricRow({ metric }: { metric: LossMetric }) {
  const Icon = metric.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '8px 11px', borderRadius: 9,
      background: `${metric.color}07`, border: `1px solid ${metric.color}14`,
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, background: `${metric.color}12`, border: `1px solid ${metric.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon size={10} color={metric.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', lineHeight: 1, marginBottom: 3 }}>{metric.label}</p>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: metric.color, lineHeight: 1, marginBottom: 2 }}>{metric.value}</p>
        <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.22)', lineHeight: 1.4 }}>{metric.subtext}</p>
      </div>
    </div>
  );
}

const SEVERITY_CFG = {
  critical: { label: 'Critical Risk',  color: '#EF4444' },
  high:     { label: 'High Risk',      color: '#F59E0B' },
  medium:   { label: 'Medium Risk',    color: '#06B6D4' },
};

function ConsequenceChainRow({ chain, color }: { chain: ConsequenceChain; color: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 11 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <span style={{ ...mono, fontSize: 7.5, color: color, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>
          Consequence chain
        </span>
        <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>{open ? '▲ hide' : '▼ show'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 7, padding: '10px 12px',
          background: `${color}06`, border: `1px solid ${color}18`,
          borderRadius: 9,
          display: 'flex', flexDirection: 'column', gap: 0,
        }}>
          {[
            { label: 'Issue', value: undefined as string | undefined },
            { label: 'Immediate impact', value: chain.immediateImpact },
            { label: 'Downstream consequence', value: chain.downstreamConsequence },
            { label: 'Resolve by', value: chain.resolveAction },
          ].filter(r => r.value !== undefined).map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, paddingBottom: i < arr.length - 1 ? 8 : 0, marginBottom: i < arr.length - 1 ? 8 : 0, borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === arr.length - 1 ? '#10B981' : color, flexShrink: 0 }} />
                {i < arr.length - 1 && <div style={{ width: 1, height: 16, background: `${color}30`, marginTop: 3 }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, letterSpacing: '0.07em', margin: '0 0 2px' }}>{row.label}</p>
                <p style={{ fontSize: 10.5, color: i === arr.length - 1 ? '#10B981' : 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0, fontWeight: i === arr.length - 1 ? 600 : 400 }}>{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConsequenceCard({ c }: { c: Consequence }) {
  const [hov, setHov] = useState(false);
  const [resolved, setResolved] = useState(false);
  const sc = SEVERITY_CFG[c.severity];
  const isCritical = c.severity === 'critical';

  if (resolved) {
    return (
      <div style={{
        padding: '24px', borderRadius: 16,
        background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: 140,
      }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Zap size={14} color="#10B981" />
        </div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#10B981' }}>Marked Resolved</p>
        <p style={{ margin: 0, ...mono, fontSize: 8, color: 'rgba(255,255,255,0.25)' }}>Gap acknowledged · monitoring active</p>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', overflow: 'hidden', borderRadius: 16,
        background: hov ? `${c.color}0C` : `${c.color}06`,
        border: `1px solid ${hov ? c.color + '40' : c.color + '20'}`,
        transition: 'all 0.25s ease',
        boxShadow: isCritical ? (hov ? `0 0 32px ${c.color}20` : `0 0 18px ${c.color}10`) : 'none',
      }}
    >
      <style>{`
        @keyframes ace-ring { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.8);opacity:0} }
        @keyframes ace-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(600%)} }
      `}</style>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${c.color}70,transparent)`, overflow: 'hidden' }}>
        {isCritical && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: '15%', background: `linear-gradient(90deg,transparent,${c.color},transparent)`, animation: 'ace-scan 3s linear infinite' }} />
        )}
      </div>

      {isCritical && (
        <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.color, boxShadow: `0 0 8px ${c.color}` }} />
          <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1.5px solid ${c.color}`, animation: 'ace-ring 1.8s ease-out infinite', opacity: 0 }} />
          <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', border: `1px solid ${c.color}50`, animation: 'ace-ring 1.8s ease-out 0.5s infinite', opacity: 0 }} />
        </div>
      )}

      <div style={{ padding: '16px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10, paddingRight: isCritical ? 22 : 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: `${c.color}14`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingDown size={14} color={c.color} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{c.issue}</span>
              <span style={chipStyle(sc.color)}>{sc.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{c.context}</span>
              <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.18)' }}>·</span>
              <span style={{ ...mono, fontSize: 7.5, color: c.color, fontWeight: 700 }}>{c.timeWindowLabel}</span>
            </div>
          </div>
        </div>

        <div style={{
          padding: '9px 12px', borderRadius: 9, marginBottom: 11,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', ...mono, fontSize: 8, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginRight: 6 }}>Expected downside:</span>
            {c.expectedDownside}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 11 }}>
          {c.metrics.map((m, i) => <MetricRow key={i} metric={m} />)}
        </div>

        {c.algoNote && (
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 8,
            padding: '8px 11px', borderRadius: 9, marginBottom: 12,
            background: `${c.color}0B`, border: `1px solid ${c.color}20`,
          }}>
            <div style={{ position: 'relative', width: 6, height: 6, flexShrink: 0, marginTop: 3 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: `1px solid ${c.color}55`, animation: 'cos-pulse 2s ease-in-out infinite' }} />
            </div>
            <span style={{ ...mono, fontSize: 8.5, color: c.color, lineHeight: 1.6, marginTop: 1 }}>{c.algoNote}</span>
          </div>
        )}

        {c.chain && <ConsequenceChainRow chain={c.chain} color={c.color} />}
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 18px 14px', flexWrap: 'wrap', gap: 8,
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(0,0,0,0.15)',
      }}>
        <CountdownBadge hours={c.windowHours} color={c.color} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>{c.ctaDetail}</span>
          <ResolveBtn label={c.cta} color={c.color} onResolve={() => setResolved(true)} />
        </div>
      </div>
    </div>
  );
}

function ResolveBtn({ label, color, onResolve }: { label: string; color: string; onResolve: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onResolve}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 700,
        background: hov ? `${color}1E` : `${color}0E`,
        border: `1px solid ${hov ? color + '50' : color + '28'}`,
        color, transition: 'all 0.15s',
        boxShadow: hov ? `0 0 14px ${color}20` : 'none',
      }}
    >
      <ArrowRight size={10} />
      {label}
    </button>
  );
}

export default function ArtistConsequenceEngine({ artist }: { artist: SignedArtist }) {
  const consequences = buildConsequences(artist);
  const criticals = consequences.filter(c => c.severity === 'critical');
  const highs     = consequences.filter(c => c.severity === 'high');
  const totalGaps = criticals.length + highs.length;

  const revAtRisk = `$${Math.round((criticals.length * 14 + highs.length * 7) * 1000 / 1000)}K+`;

  return (
    <div>
      <style>{`@keyframes cos-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0;transform:scale(1.9)} }`}</style>

      {/* Summary strip */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 10, alignItems: 'center',
        padding: '12px 16px', borderRadius: 12, marginBottom: 20,
        background: criticals.length > 0 ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.05)',
        border: `1px solid ${criticals.length > 0 ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <AlertTriangle size={13} color={criticals.length > 0 ? '#EF4444' : '#F59E0B'} style={{ flexShrink: 0 }} />
          <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
            {totalGaps} active execution gaps for {artist.name} ·{' '}
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>{revAtRisk} revenue potential at risk</span>
            {' '}· Each gap compounds in cost the longer it remains unresolved — most have time-limited windows
          </span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#EF4444', lineHeight: 1 }}>{criticals.length}</div>
          <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>Critical</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{highs.length}</div>
          <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>High</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ ...mono, fontSize: 18, fontWeight: 900, color: '#F59E0B', lineHeight: 1 }}>{revAtRisk}</div>
          <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' as const, marginTop: 2 }}>At Risk</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {consequences.map(c => <ConsequenceCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
