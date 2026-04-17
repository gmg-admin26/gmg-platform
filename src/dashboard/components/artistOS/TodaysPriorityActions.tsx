import { useState, useEffect, useRef } from 'react';
import {
  Zap, Clock, TrendingUp, MapPin, Radio, Music2,
  Users, Star, BarChart2, CheckCircle2, ChevronRight,
  ArrowUpRight, Play, AlertCircle, RefreshCcw, Cpu,
  Target, DollarSign, Timer, Flame, Activity,
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';
import { useAutopilot } from '../../context/AutopilotContext';
import OutcomeSummary, { type OutcomeData } from './OutcomeSummary';

const mono: React.CSSProperties = { fontFamily: 'monospace' };

interface RankingSignal {
  dimension: 'impact-urgency' | 'confidence' | 'time-sensitivity' | 'revenue-exposure' | 'growth-window';
  label: string;
  value: number;
  display: string;
}

interface RankingRationale {
  headline: string;
  signals: RankingSignal[];
  rankStatement: string;
}

interface ActionCausalityTriad {
  whySurfaced: string;
  whatItChanges: string;
  ifIgnored: string;
}

interface Action {
  id: string;
  label: string;
  outcome: string;
  lift: string;
  timeToComplete: string;
  category: 'campaign' | 'release' | 'audience' | 'ops' | 'financial';
  urgency: number;
  impact: number;
  confidence: number;
  timeSensitivity: number;
  revenueExposure: number;
  growthWindow: number;
  icon: React.ElementType;
  color: string;
  ctaLabel: string;
  ctaAction: string;
  ranking: RankingRationale;
  causality?: ActionCausalityTriad;
}

const ACTION_OUTCOMES: Record<string, OutcomeData> = {
  presave_push: {
    predicted: '+11.2K pre-saves',
    actual: '+8.7K pre-saves',
    delta: '-22% vs forecast',
    deltaDirection: 'missed',
    confidence: 91,
    completedAt: '6h ago',
    status: 'completed',
    note: 'Casual segment under-converted. Core fans hit 62% conversion — above benchmark. Velocity signal still intact for Day 1.',
  },
  brazil_campaign: {
    predicted: '+18–25% streams',
    actual: '+31.4% streams',
    delta: '+13.4% above forecast',
    deltaDirection: 'beat',
    confidence: 87,
    completedAt: '2d ago',
    status: 'completed',
    note: 'Organic-paid multiplier hit 2.8× — significantly above the 2.1× model. São Paulo is now a tier-1 market.',
  },
  playlist_pitch: {
    predicted: 'Up to +120K exposure',
    actual: '+94K exposure',
    delta: '-21% vs forecast',
    deltaDirection: 'missed',
    confidence: 74,
    completedAt: '3d ago',
    status: 'completed',
    note: '2 of 3 pitches placed. Third rejected on genre classification mismatch — re-pitch queued with corrected metadata.',
  },
  ad_budget_scale: {
    predicted: '+12% weekly listeners',
    actual: '+14.8% weekly listeners',
    delta: '+2.8% above forecast',
    deltaDirection: 'beat',
    confidence: 89,
    completedAt: '1d ago',
    status: 'completed',
    note: 'CPM held at $0.87 through scale — well below the $1.80 break-even. Budget efficiency intact at current daily rate.',
  },
  engagement_blast: {
    predicted: '+8–14% fan reactivation',
    actual: '+11.3% reactivation',
    delta: 'Met forecast',
    deltaDirection: 'met',
    confidence: 82,
    completedAt: '5d ago',
    status: 'completed',
    note: '1,840 lapsed fans re-engaged. 620 streamed within 48h — those listeners are now active again entering release week.',
  },
  sync_license: {
    predicted: '$2K–$15K per sync',
    actual: 'In evaluation',
    delta: 'Decision expected 7–10 days',
    deltaDirection: 'met',
    confidence: 68,
    completedAt: 'Submitted 1d ago',
    status: 'in_progress',
    note: 'Both tracks under active review. TV drama brief is the stronger match. No action required until placement decision.',
  },
  fan_intel_review: {
    predicted: 'Surfaces next high-value market',
    actual: 'Austin TX + Denver CO confirmed',
    delta: 'Actionable routing data returned',
    deltaDirection: 'beat',
    confidence: 79,
    completedAt: '4h ago',
    status: 'completed',
    note: 'Austin at 3.1× 30-day growth — booking in this market now costs 2–4× less than after mainstream peak. Routing recommendation queued.',
  },
};

const DIMENSION_META: Record<RankingSignal['dimension'], { label: string; icon: React.ElementType; color: string }> = {
  'impact-urgency':    { label: 'Impact × Urgency',   icon: Zap,         color: '#F59E0B' },
  'confidence':        { label: 'Confidence',          icon: Target,      color: '#06B6D4' },
  'time-sensitivity':  { label: 'Time Sensitivity',    icon: Timer,       color: '#EF4444' },
  'revenue-exposure':  { label: 'Revenue Exposure',    icon: DollarSign,  color: '#10B981' },
  'growth-window':     { label: 'Growth Window',       icon: Flame,       color: '#EC4899' },
};

function buildActions(artist: SignedArtist): Action[] {
  const pool: Action[] = [];
  const hasActiveCampaign = artist.releases.some(r => ['Active Push', 'Launch Week', 'Pre-Release'].includes(r.campaignStage));
  const hasPreSave = artist.releases.some(r => r.status === 'Pre-Save Live');
  const isGrowthPhase = artist.monthlyListeners < 500_000;
  const lowEngagement = artist.fanEngagementScore < 55;
  const highFollowers = artist.followers > 50_000;
  const ml = artist.monthlyListeners;
  const presaveEst = Math.round(artist.followers * 0.008);

  if (hasPreSave) {
    pool.push({
      id: 'presave_push',
      label: 'Push pre-save to top fan segment',
      outcome: `Estimated +${presaveEst.toLocaleString()} pre-saves in 48h`,
      lift: `+${Math.round(presaveEst / 1000).toFixed(1)}K pre-saves`,
      timeToComplete: '3 min',
      category: 'release',
      urgency: 10,
      impact: 9,
      confidence: 91,
      timeSensitivity: 10,
      revenueExposure: 8,
      growthWindow: 9,
      icon: Music2,
      color: '#06B6D4',
      ctaLabel: 'Launch Push',
      ctaAction: 'presave_push',
      ranking: {
        headline: `#1 because release window closes in 48h and projected upside is +${Math.round(presaveEst / 1000).toFixed(0)}K pre-saves`,
        rankStatement: 'Pre-save push during an active stream spike converts at 3× the baseline rate. Every hour of delay compresses the runway — late pushes return 60–70% fewer conversions and releases below 25K pre-saves miss the editorial threshold entirely.',
        signals: [
          { dimension: 'time-sensitivity', label: 'Window closes in 48h', value: 10, display: '48h left' },
          { dimension: 'impact-urgency',   label: 'Pre-save velocity peak', value: 9, display: `+${Math.round(presaveEst / 1000).toFixed(1)}K est.` },
          { dimension: 'confidence',       label: 'Historical fan response', value: 91, display: '91% conf.' },
          { dimension: 'revenue-exposure', label: 'Day-1 stream multiplier', value: 8, display: 'High' },
        ],
      },
      causality: {
        whySurfaced: 'Stream spike (+290%) on ZEAL Vol. 1 triggered after a 1.4M-follower playlist add. The system is seeing a high-probability conversion window based on current geo acceleration and fan activity patterns.',
        whatItChanges: 'Pre-save pushes during active stream spikes convert at 3× baseline. Day-1 chart position and Release Radar eligibility are directly tied to pre-save count — missing the 25K threshold reduces first-week algorithmic reach by an estimated 25–40%.',
        ifIgnored: 'Ignoring this delays pre-save accumulation into a lower-conversion window, weakens the Day-1 algorithmic trigger, and is projected to reduce week-one streams by 12–18% relative to hitting the 25K pre-save target.',
      },
    });
  }

  if (isGrowthPhase && ml > 5_000) {
    pool.push({
      id: 'brazil_campaign',
      label: `Activate ${ml > 100_000 ? 'Latin America' : 'Brazil'} campaign`,
      outcome: `+18–25% stream lift on current release`,
      lift: '+18–25% streams',
      timeToComplete: '5 min',
      category: 'campaign',
      urgency: 9,
      impact: 10,
      confidence: 87,
      timeSensitivity: 8,
      revenueExposure: 9,
      growthWindow: 10,
      icon: MapPin,
      color: '#10B981',
      ctaLabel: 'Activate',
      ctaAction: 'campaign_brazil',
      ranking: {
        headline: '#2 because Brazil is outperforming organically and the paid efficiency window has a 5–7 day shelf life',
        rankStatement: 'A monetizable growth window has opened and will likely decay if not activated in the next 48–72 hours. Blog-driven organic momentum creates a 2.1× paid multiplier that vanishes once discovery normalizes.',
        signals: [
          { dimension: 'growth-window',   label: 'Organic 3.2x baseline', value: 10, display: '3.2x organic' },
          { dimension: 'impact-urgency',  label: 'Market velocity active', value: 10, display: '+21% velocity' },
          { dimension: 'confidence',      label: 'LATAM paid model', value: 87, display: '87% conf.' },
          { dimension: 'revenue-exposure', label: 'Budget efficiency', value: 9, display: '2.1x ROI est.' },
        ],
      },
      causality: {
        whySurfaced: 'Geographic surge signal: São Paulo streams +340% this week. A Brazilian music blog with 800K followers ran a feature — this is the catalyst, not sustained growth. The window is active and measurable now.',
        whatItChanges: 'Blog-driven organic momentum creates a 2.1× paid efficiency multiplier. Targeting this market during the organic event converts at a fraction of what the same spend costs in a cold market.',
        ifIgnored: 'The blog-driven window cools in 5–7 days. After normalization, paid CAC in Brazil returns to baseline — approximately 2.1× more expensive per listener. The efficiency gap is not recoverable after the event window closes.',
      },
    });
  }

  pool.push({
    id: 'playlist_pitch',
    label: 'Submit to 3 editorial playlists via Rocksteady',
    outcome: 'Each pitch = up to +40K listener exposure per placement',
    lift: 'Up to +120K exposure',
    timeToComplete: '6 min',
    category: 'audience',
    urgency: 7,
    impact: 10,
    confidence: 74,
    timeSensitivity: 8,
    revenueExposure: 7,
    growthWindow: 9,
    icon: Radio,
    color: '#3B82F6',
    ctaLabel: 'Pitch Now',
    ctaAction: 'playlist_pitch',
    ranking: {
      headline: '#3 because missing editorial submission now removes playlist support at release entirely — there is no recovery path after the deadline',
      rankStatement: 'Editorial pitches require 5–7 day processing. Missing this window means zero playlist support at release. The system is seeing elevated pitch probability based on recent playlist clustering — current momentum is the context that makes this pitch competitive.',
      signals: [
        { dimension: 'time-sensitivity',  label: 'Submission deadline in 3d', value: 8, display: '3 days' },
        { dimension: 'impact-urgency',    label: 'Week-1 velocity at risk', value: 9, display: '+120K exp.' },
        { dimension: 'growth-window',     label: 'Release aligned window', value: 9, display: 'Active' },
        { dimension: 'confidence',        label: 'Pitch success rate', value: 74, display: '74% conf.' },
      ],
    },
    causality: {
      whySurfaced: '"Move Along" landed in 12 playlists in 48 hours including 3 editorial-adjacent lists — a statistically significant pre-signal that Spotify editorial curators are actively tracking the catalog.',
      whatItChanges: 'Editorial adds deliver an average +40K listener exposure per placement. Early playlist coverage in week 1 directly raises algorithmic ranking signals and compounds into Discover Weekly and Release Radar follow-on adds.',
      ifIgnored: 'Missing this deadline eliminates editorial playlist support for this release cycle entirely. The submission deadline is firm and non-negotiable. Week-one reach is reduced and the algorithmic follow-on that editorial adds trigger is permanently lost for this cycle.',
    },
  });

  if (hasActiveCampaign) {
    pool.push({
      id: 'ad_budget_scale',
      label: 'Scale ad budget 20% on best-performing placement',
      outcome: 'Projected +12% listener growth this week',
      lift: '+12% weekly listeners',
      timeToComplete: '2 min',
      category: 'campaign',
      urgency: 8,
      impact: 9,
      confidence: 89,
      timeSensitivity: 6,
      revenueExposure: 8,
      growthWindow: 7,
      icon: BarChart2,
      color: '#F59E0B',
      ctaLabel: 'Scale Budget',
      ctaAction: 'ad_scale',
      ranking: {
        headline: '#4 because TikTok placement is returning 3.4× ROI and the budget is under-allocated on a winning asset',
        rankStatement: 'The system is seeing a high-probability conversion window based on current placement performance. CPM at $0.90 is less than half the $1.80 break-even threshold. Under-allocating on a winning placement is the most common missed revenue lever in active campaigns.',
        signals: [
          { dimension: 'revenue-exposure', label: 'CPM below break-even', value: 8, display: '3.4x ROI' },
          { dimension: 'confidence',       label: 'Placement signal strength', value: 89, display: '89% conf.' },
          { dimension: 'impact-urgency',   label: 'Active campaign window', value: 8, display: '+12% listeners' },
          { dimension: 'growth-window',    label: 'Campaign mid-flight', value: 7, display: 'Mid-flight' },
        ],
      },
      causality: {
        whySurfaced: 'Campaign performance signal: TikTok placement CTR at 3.4% vs 1.2% portfolio average. Best-performing asset is running at under-allocated budget — the return-to-spend gap is measurable and actionable now.',
        whatItChanges: 'Scaling a 3.4× ROI placement by 20% compounds return at zero incremental efficiency cost while CPM holds below break-even. This is a direct revenue lever with near-term measurable output.',
        ifIgnored: 'High-performing TikTok inventory attracts competitive bidding as performance data becomes more visible. The CPM advantage window is 48–96 hours before competing advertisers respond to the same signal.',
      },
    });
  }

  if (lowEngagement && highFollowers) {
    pool.push({
      id: 'engagement_blast',
      label: 'Send re-engagement blast to lapsed followers',
      outcome: 'Recovers est. 8–14% dormant fans, lifts streams',
      lift: '+8–14% fan reactivation',
      timeToComplete: '4 min',
      category: 'audience',
      urgency: 7,
      impact: 8,
      confidence: 82,
      timeSensitivity: 5,
      revenueExposure: 6,
      growthWindow: 7,
      icon: Users,
      color: '#EC4899',
      ctaLabel: 'Send Blast',
      ctaAction: 'engagement_blast',
      ranking: {
        headline: `#5 because the fan base has a measurable lapsed segment that converts at 3× the rate pre-release vs post-release`,
        rankStatement: 'Fan lists decay at 2% per month without activation. The streaming-to-follow ratio has dropped below 38% — indicating a large dormant segment that is still reachable. Re-engagement compounds significantly better when executed before a release than after.',
        signals: [
          { dimension: 'revenue-exposure',  label: 'Dormant fan pool', value: 6, display: `${Math.round(artist.followers * 0.12 / 1000)}K dormant` },
          { dimension: 'confidence',        label: 'Re-engagement model', value: 82, display: '82% conf.' },
          { dimension: 'growth-window',     label: 'Pre-release window', value: 7, display: 'Pre-release' },
          { dimension: 'impact-urgency',    label: 'Engagement score decline', value: 7, display: '-12 pts' },
        ],
      },
      causality: {
        whySurfaced: 'Fan engagement score dropped 12 points in 30 days. Streaming-to-follow ratio is below 38% — a large portion of the follower base has gone dormant and is not tracking toward pre-save or day-1 streaming.',
        whatItChanges: 'Re-engaging this segment before the release increases pre-save conversion by an estimated 22% and brings dormant fans back into active listening status in time for day-1 counting.',
        ifIgnored: 'Fan lists continue to decay at ~2% per month. Post-release re-engagement returns 40–60% fewer conversions than pre-release because the intent signal has cooled. The window to recover this segment before ZEAL Vol. 2 is narrowing.',
      },
    });
  }

  if (ml > 50_000) {
    pool.push({
      id: 'sync_license',
      label: 'Flag 2 tracks for sync licensing queue',
      outcome: 'Sync deals avg $2K–$15K per placement',
      lift: '$2K–$15K per sync',
      timeToComplete: '8 min',
      category: 'financial',
      urgency: 5,
      impact: 9,
      confidence: 68,
      timeSensitivity: 3,
      revenueExposure: 10,
      growthWindow: 5,
      icon: Star,
      color: '#F59E0B',
      ctaLabel: 'Flag Tracks',
      ctaAction: 'sync_flag',
      ranking: {
        headline: '#6 because two active briefs match catalog tracks and both close in 14 days — the revenue window is open now',
        rankStatement: 'Sync placements are first-come-first-served. Two active briefs in the Rocksteady queue match catalog tracks with a combined revenue potential of $2K–$15K. Flagging takes 8 minutes and has zero downside cost.',
        signals: [
          { dimension: 'revenue-exposure',  label: 'Active sync briefs match', value: 10, display: '$2K–$15K' },
          { dimension: 'time-sensitivity',  label: 'Brief expiry in 14 days', value: 3, display: '14 days' },
          { dimension: 'confidence',        label: 'Catalog-brief match score', value: 68, display: '68% conf.' },
          { dimension: 'impact-urgency',    label: 'Revenue diversification', value: 7, display: 'High' },
        ],
      },
      causality: {
        whySurfaced: 'Rocksteady matched catalog tracks to two active briefs — one TV drama brief and one brand ad campaign, both open for 14 more days. Sync briefs are first-come, first-evaluated — volume of submissions matters.',
        whatItChanges: 'Sync placements generate one-time income ($2K–$15K per placement) plus sustained long-tail streaming lift from soundtrack and ad exposure. Flagging takes 8 minutes and costs nothing.',
        ifIgnored: 'Both briefs expire in 14 days. After closure, the same tracks cannot be retroactively submitted. The revenue opportunity is permanently lost for this brief cycle — not recoverable.',
      },
    });
  }

  if (artist.actionQueue.length > 0) {
    const topAction = artist.actionQueue[0];
    const isUrgent = topAction.priority === 'urgent';
    pool.push({
      id: 'team_task',
      label: topAction.label,
      outcome: 'Unblocks distribution, editorial pitch, and pre-save campaign — all time-locked downstream',
      lift: 'Unblocks 2–3 downstream actions',
      timeToComplete: '10 min',
      category: 'ops',
      urgency: isUrgent ? 10 : topAction.priority === 'high' ? 7 : 5,
      impact: 7,
      confidence: 95,
      timeSensitivity: isUrgent ? 9 : 6,
      revenueExposure: 5,
      growthWindow: 6,
      icon: CheckCircle2,
      color: '#8B5CF6',
      ctaLabel: 'Mark Done',
      ctaAction: 'team_task',
      ranking: {
        headline: isUrgent ? '#X because this ops task is overdue and is blocking the release pipeline — distribution and editorial pitch cannot proceed' : '#X because this unresolved ops task has direct downstream dependencies on campaign and pitch execution',
        rankStatement: 'Unresolved operational blockers create cascading delays across distribution, editorial pitch, and paid campaign warm-up. Clearing this is the unlock condition for the next 2–3 time-sensitive actions.',
        signals: [
          { dimension: 'confidence',       label: 'Blocker confirmed', value: 95, display: '95% conf.' },
          { dimension: 'time-sensitivity', label: isUrgent ? 'Overdue' : 'Approaching deadline', value: isUrgent ? 9 : 6, display: isUrgent ? 'Overdue' : 'Due soon' },
          { dimension: 'impact-urgency',   label: 'Pipeline dependency', value: 7, display: 'Blocking' },
          { dimension: 'revenue-exposure', label: 'Delay cost estimate', value: 5, display: 'Medium' },
        ],
      },
      causality: {
        whySurfaced: isUrgent
          ? 'Ops flag: this task is overdue and confirmed as a hard blocker on the release pipeline. Distribution submission is gated on resolution — every day of delay reduces the editorial pitch window.'
          : 'Ops queue signal: this task is approaching its deadline and has confirmed downstream dependencies. Campaign execution and editorial submission cannot be sequenced until it clears.',
        whatItChanges: 'Resolving this unblocks distribution submission, editorial pitch activation, and pre-save campaign launch — all of which have time-locked windows that are already counting down.',
        ifIgnored: isUrgent
          ? 'Missing this delays release execution, compresses the editorial window, and is projected to reduce week-one streams by 12–18% if distribution misses the submission deadline this week.'
          : 'The task escalates to overdue status within 48 hours. Each day of slip compounds downstream compression — editorial deadlines move regardless of internal blockers.',
      },
    });
  }

  pool.push({
    id: 'fan_intel_review',
    label: 'Review Fan Intelligence map — 3 new city surges',
    outcome: 'Surface next tour-ready market before competitors',
    lift: 'Identifies next $XX,XXX market',
    timeToComplete: '4 min',
    category: 'audience',
    urgency: 6,
    impact: 8,
    confidence: 79,
    timeSensitivity: 4,
    revenueExposure: 7,
    growthWindow: 9,
    icon: TrendingUp,
    color: '#10B981',
    ctaLabel: 'Review Map',
    ctaAction: 'fan_intel',
    ranking: {
      headline: '#X because 3 new city surges appeared in the last 7 days — city-level data has a 14–21 day lead time on mainstream traction',
      rankStatement: 'Routing decisions made at the early-growth stage cost 2–4× less than decisions made after mainstream peak. The system has surfaced 3 markets where listener trajectory data is actionable now.',
      signals: [
        { dimension: 'growth-window',    label: '3 new city surges detected', value: 9, display: '3 surges' },
        { dimension: 'revenue-exposure', label: 'Tour routing upside', value: 7, display: 'High' },
        { dimension: 'confidence',       label: 'Fan map accuracy', value: 79, display: '79% conf.' },
        { dimension: 'time-sensitivity', label: 'Data freshness window', value: 4, display: '7-day data' },
      ],
    },
    causality: {
      whySurfaced: 'Fan Intelligence map flagged 3 new city surges in the past 7 days: Austin TX (+3.1× listeners), Denver CO (+2.4×), and Philadelphia PA (+1.9×). All three have crossed the threshold that precedes sustainable touring markets at this catalog size.',
      whatItChanges: 'City-level momentum data leads mainstream traction by 14–21 days. Routing and market development decisions made now capture 2–4× the cost efficiency of decisions made after markets peak.',
      ifIgnored: 'City momentum signals normalize to background growth within 2–3 weeks. Once markets peak, venue costs and booking competition increase sharply — the same routing decisions at that stage cost significantly more for the same audience.',
    },
  });

  const ranked = pool
    .sort((a, b) => {
      const scoreA = (a.impact * a.urgency * 0.4) + (a.confidence * 0.2) + (a.timeSensitivity * 0.25) + (a.revenueExposure * 0.1) + (a.growthWindow * 0.05);
      const scoreB = (b.impact * b.urgency * 0.4) + (b.confidence * 0.2) + (b.timeSensitivity * 0.25) + (b.revenueExposure * 0.1) + (b.growthWindow * 0.05);
      return scoreB - scoreA;
    })
    .slice(0, 6);

  ranked.forEach((a, i) => {
    const rn = i + 1;
    a.ranking.headline = a.ranking.headline.replace(/^#\d+/, `#${rn}`).replace(/^#X/, `#${rn}`);
  });

  return ranked;
}

type ExecState = 'idle' | 'running' | 'done';

function ScorePip({ value, max = 10, color }: { value: number; max?: number; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ width: 36, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, boxShadow: `0 0 4px ${color}60` }} />
      </div>
    </div>
  );
}

function RankingBreakdown({ ranking, color, expanded }: { ranking: RankingRationale; color: string; expanded: boolean }) {
  if (!expanded) return null;
  return (
    <div style={{
      margin: '0 16px 12px 66px',
      padding: '12px 14px',
      background: 'rgba(255,255,255,0.02)',
      border: `1px solid ${color}18`,
      borderRadius: 10,
      animation: 'pta-expand 0.18s ease both',
    }}>
      <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, margin: '0 0 10px' }}>
        {ranking.rankStatement}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {ranking.signals.map((sig, i) => {
          const meta = DIMENSION_META[sig.dimension];
          const Icon = meta.icon;
          const isPercent = sig.dimension === 'confidence';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, flexShrink: 0, background: `${meta.color}12`, border: `1px solid ${meta.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={9} color={meta.color} />
              </div>
              <span style={{ ...mono, fontSize: 8, color: meta.color, fontWeight: 700, width: 110, flexShrink: 0 }}>{meta.label}</span>
              <ScorePip value={sig.value} max={isPercent ? 100 : 10} color={meta.color} />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 700, minWidth: 60 }}>{sig.display}</span>
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.18)', flex: 1 }}>{sig.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionRow({ action, rank, onExecute, defaultExpanded, collapsed }: {
  action: Action;
  rank: number;
  onExecute: (id: string) => void;
  defaultExpanded?: boolean;
  collapsed?: boolean;
}) {
  const [state, setState] = useState<ExecState>('idle');
  const [expanded, setExpanded] = useState(defaultExpanded ?? false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const { mode, logExecution } = useAutopilot();
  const Icon = action.icon;

  const isAutoQueued = mode === 'autopilot' && rank === 0 && state === 'idle';
  const isAssistedQueued = mode === 'assisted' && rank <= 1 && state === 'idle';
  const effectiveCta = isAutoQueued ? 'Auto-Execute' : isAssistedQueued ? 'Approve & Run' : action.ctaLabel;
  const ctaColor = isAutoQueued ? '#10B981' : isAssistedQueued ? '#F59E0B' : action.color;

  function handleClick() {
    if (state !== 'idle') return;
    setState('running');
    onExecute(action.id);
    logExecution({ id: action.id, label: action.label, artist: 'All American Rejects' });
    setTimeout(() => setState('done'), 1600);
  }

  const compositeScore = Math.round(
    (action.impact * action.urgency * 0.4) +
    (action.confidence * 0.2) +
    (action.timeSensitivity * 0.25) +
    (action.revenueExposure * 0.1) +
    (action.growthWindow * 0.05)
  );

  const topSignal = action.ranking.signals.reduce((a, b) => a.value >= b.value ? a : b);
  const topMeta = DIMENSION_META[topSignal.dimension];
  const TopIcon = topMeta.icon;

  const isTopAction = rank === 0;
  const isUrgent = action.urgency >= 9;

  if (collapsed && !collapseOpen) {
    return (
      <div
        onClick={() => setCollapseOpen(true)}
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          borderLeft: '2px solid transparent',
          background: 'transparent',
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 16px', cursor: 'pointer',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.012)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span style={{ ...mono, fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.2)', width: 14, textAlign: 'center', flexShrink: 0 }}>{rank + 1}</span>
        <div style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, background: `${action.color}0E`, border: `1px solid ${action.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={10} color={action.color} />
        </div>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{action.label}</span>
        <span style={{ ...mono, fontSize: 8, color: action.color, flexShrink: 0 }}>{action.lift}</span>
        <span style={{ ...mono, fontSize: 7.5, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)', flexShrink: 0 }}>{action.confidence}%</span>
        <ChevronRight size={10} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0 }} />
      </div>
    );
  }

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      borderLeft: isTopAction ? `2px solid ${action.color}50` : '2px solid transparent',
      background: state === 'done' ? `${action.color}05` : isTopAction ? `${action.color}04` : expanded ? 'rgba(255,255,255,0.012)' : 'transparent',
      transition: 'background 0.15s',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px 11px', cursor: 'pointer' }}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Rank + score column */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingTop: 1 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: isTopAction ? `${action.color}22` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isTopAction ? `${action.color}45` : 'rgba(255,255,255,0.07)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isTopAction ? `0 0 10px ${action.color}30` : 'none',
            animation: isUrgent && isTopAction ? 'ls-status-flicker 5s ease-in-out infinite' : 'none',
          }}>
            <span style={{ ...mono, fontSize: 9, fontWeight: 900, color: isTopAction ? action.color : 'rgba(255,255,255,0.22)' }}>{rank + 1}</span>
          </div>
          <span style={{ ...mono, fontSize: 7, color: isTopAction ? `${action.color}80` : 'rgba(255,255,255,0.14)', fontWeight: isTopAction ? 700 : 400 }}>{compositeScore}</span>
        </div>

        {/* Icon */}
        <div style={{
          width: 30, height: 30, borderRadius: 9, flexShrink: 0, marginTop: 1,
          background: `${action.color}0E`, border: `1px solid ${action.color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={13} color={action.color} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: state === 'done' ? action.color : 'rgba(255,255,255,0.85)', lineHeight: 1.25 }}>
              {action.label}
            </span>
            {rank === 0 && (
              <span style={{ ...mono, fontSize: 7, padding: '1px 7px', borderRadius: 99, background: `${action.color}18`, border: `1px solid ${action.color}35`, color: action.color, flexShrink: 0 }}>
                TOP PRIORITY
              </span>
            )}
          </div>

          {/* Rank rationale headline */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: action.causality ? 5 : 7 }}>
            <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, background: `${topMeta.color}12`, border: `1px solid ${topMeta.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
              <TopIcon size={8} color={topMeta.color} />
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', lineHeight: 1.55, fontStyle: 'italic' }}>
              {action.ranking.headline}
            </span>
          </div>

          {/* Causality triad */}
          {action.causality && (
            <div style={{ marginBottom: 7, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[
                { label: 'Why surfaced', value: action.causality.whySurfaced, color: '#06B6D4' },
                { label: 'What it changes', value: action.causality.whatItChanges, color: '#10B981' },
                { label: 'If ignored', value: action.causality.ifIgnored, color: '#EF4444' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 7, color: row.color, fontWeight: 800, letterSpacing: '0.08em', flexShrink: 0, paddingTop: 1, minWidth: 74 }}>{row.label.toUpperCase()}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Dimension pills row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
            {action.ranking.signals.slice(0, 3).map((sig, i) => {
              const dm = DIMENSION_META[sig.dimension];
              return (
                <span key={i} style={{
                  ...mono, fontSize: 7.5, padding: '2px 7px', borderRadius: 5,
                  background: `${dm.color}0D`, border: `1px solid ${dm.color}20`,
                  color: dm.color, fontWeight: 700,
                }}>
                  {dm.label}: {sig.display}
                </span>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 2 }}>
              <Clock size={8} color="rgba(255,255,255,0.2)" />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>{action.timeToComplete}</span>
            </div>
          </div>

          {/* Lift + confidence bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
            <ArrowUpRight size={9} color={action.color} />
            <span style={{ fontSize: 10, color: action.color, fontWeight: 700 }}>{action.lift}</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>·</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{action.outcome}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', flexShrink: 0 }}>CONFIDENCE</span>
            <div style={{ flex: 1, maxWidth: 100, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${action.confidence}%`, background: action.confidence >= 80 ? '#10B981' : action.confidence >= 60 ? '#F59E0B' : '#EF4444', borderRadius: 2, boxShadow: `0 0 4px ${action.confidence >= 80 ? '#10B981' : '#F59E0B'}50` }} />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: action.confidence >= 80 ? '#10B981' : action.confidence >= 60 ? '#F59E0B' : '#EF4444', fontWeight: 700 }}>{action.confidence}%</span>
          </div>
        </div>

        {/* Right column: CTA + expand toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
          <button
            onClick={handleClick}
            disabled={state !== 'idle'}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9,
              fontSize: 11, fontWeight: 700, cursor: state !== 'idle' ? 'default' : 'pointer',
              border: `1px solid ${state === 'done' ? `${ctaColor}30` : `${ctaColor}38`}`,
              background: state === 'done' ? `${ctaColor}10` : state === 'running' ? `${ctaColor}18` : `${ctaColor}14`,
              color: state === 'done' ? ctaColor : state === 'running' ? `${ctaColor}99` : ctaColor,
              transition: 'all 0.2s ease', whiteSpace: 'nowrap',
              boxShadow: isAutoQueued && state === 'idle' ? `0 0 10px ${ctaColor}22` : 'none',
            }}
          >
            {state === 'done' ? <><CheckCircle2 size={11} />Done</>
              : state === 'running' ? <><RefreshCcw size={11} style={{ animation: 'spin 0.8s linear infinite' }} />Running…</>
              : isAutoQueued ? <><Cpu size={9} />{effectiveCta}</>
              : <><Play size={9} />{effectiveCta}</>}
          </button>
          <button
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            style={{ ...mono, fontSize: 7.5, color: expanded ? action.color : 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', fontWeight: 700 }}
          >
            {expanded ? '▲ hide logic' : '▼ why ranked here'}
          </button>
        </div>
      </div>

      <RankingBreakdown ranking={action.ranking} color={action.color} expanded={expanded} />

      {state === 'done' && ACTION_OUTCOMES[action.id] && (
        <OutcomeSummary
          outcome={ACTION_OUTCOMES[action.id]}
          defaultExpanded={true}
          indent={66}
          highImportance={true}
        />
      )}
    </div>
  );
}

export default function TodaysPriorityActions({ artist }: { artist: SignedArtist }) {
  const actions = buildActions(artist);
  const [completedCount, setCompletedCount] = useState(0);
  const { mode } = useAutopilot();
  const [rerankedMin, setRerankedMin] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRerankedMin(m => m + 1);
    }, 60_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const modeLabel = mode === 'autopilot' ? 'Autopilot' : mode === 'assisted' ? 'Assisted' : 'Manual';
  const modeColor = mode === 'autopilot' ? '#10B981' : mode === 'assisted' ? '#F59E0B' : '#94A3B8';

  function handleExecute() {
    setTimeout(() => setCompletedCount(c => c + 1), 1700);
  }

  const allDone = completedCount >= actions.length;

  const scoringWeights = [
    { label: 'Impact × Urgency', weight: '40%', color: '#F59E0B' },
    { label: 'Time Sensitivity',  weight: '25%', color: '#EF4444' },
    { label: 'Confidence',        weight: '20%', color: '#06B6D4' },
    { label: 'Revenue Exposure',  weight: '10%', color: '#10B981' },
    { label: 'Growth Window',     weight: '5%',  color: '#EC4899' },
  ];

  return (
    <div style={{
      background: 'rgba(13,14,17,0.98)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16, overflow: 'hidden',
      position: 'relative', marginBottom: 20,
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pta-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pta-expand { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
        .pta-row { animation: pta-in 0.3s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,#F59E0B50,#EF444440,#06B6D440,#10B98140,transparent)' }} />

      {/* Header */}
      <div style={{ padding: '14px 16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#F59E0B" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em' }}>Today's Priority Actions</span>
                {completedCount > 0 && (
                  <span style={{ ...mono, fontSize: 8, padding: '1px 7px', borderRadius: 99, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
                    {completedCount}/{actions.length} done
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 3, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Activity size={8} color="rgba(255,255,255,0.2)" />
                  <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.22)' }}>
                    Re-ranked {rerankedMin === 0 ? 'just now' : `${rerankedMin} min ago`} · {actions.length} actions scored
                  </span>
                </div>
                <span style={{ ...mono, fontSize: 8, padding: '1px 7px', borderRadius: 99, background: `${modeColor}12`, border: `1px solid ${modeColor}25`, color: modeColor, display: 'flex', alignItems: 'center', gap: 4 }}>
                  {mode === 'autopilot' && <Cpu size={7} />}
                  {modeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', paddingTop: 4 }}>
            {actions.map((a, i) => (
              <div key={a.id} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i < completedCount ? a.color : 'rgba(255,255,255,0.08)',
                boxShadow: i < completedCount ? `0 0 6px ${a.color}60` : 'none',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        </div>

        {/* Scoring weights legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.15)', marginRight: 2 }}>RANKING ENGINE:</span>
          {scoringWeights.map((w, i) => (
            <span key={i} style={{
              ...mono, fontSize: 7, padding: '1px 6px', borderRadius: 4,
              background: `${w.color}0C`, border: `1px solid ${w.color}1E`,
              color: w.color, fontWeight: 700,
            }}>
              {w.label} {w.weight}
            </span>
          ))}
        </div>
      </div>

      {allDone ? (
        <div style={{ padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#10B981" />
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#10B981' }}>All actions complete</p>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>You've completed all priority actions for today. New actions will surface tomorrow.</p>
        </div>
      ) : (
        <div>
          {actions.map((action, i) => (
            <div key={action.id} className="pta-row" style={{ animationDelay: `${i * 45}ms` }}>
              {i === 3 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderBottom: '1px solid rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
                  <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>MORE ACTIONS · click to expand</span>
                </div>
              )}
              <ActionRow
                action={action}
                rank={i}
                onExecute={handleExecute}
                defaultExpanded={i === 0}
                collapsed={i >= 3}
              />
            </div>
          ))}
        </div>
      )}

      {!allDone && (
        <div style={{ padding: '8px 16px 10px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.15)' }}>
            {actions.length} actions · Est. total: {actions.reduce((acc, a) => acc + parseInt(a.timeToComplete), 0)} min
          </span>
          <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '3px 0' }}>
            <span style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>View all tasks</span>
            <ChevronRight size={10} color="rgba(255,255,255,0.2)" />
          </button>
        </div>
      )}
    </div>
  );
}
