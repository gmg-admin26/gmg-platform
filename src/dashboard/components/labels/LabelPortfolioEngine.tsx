import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Zap, DollarSign, BarChart2,
  AlertTriangle, ArrowUpRight, RefreshCcw, CheckCircle2,
  Flame, ArrowRight, Brain, ChevronDown, ChevronUp,
  Activity, Users, Layers, Target,
} from 'lucide-react';

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const PORTFOLIO = {
  totalCapitalDeployed: 312_400,
  capitalDeployedChange: 14.2,
  portfolioGrowthRate: 22.8,
  growthRateDelta: 3.1,
  portfolioROI: 1.74,
  roiDelta: 0.18,
  totalAUM: 487_000,
  unrealizedValue: 174_600,
};

interface ArtistAsset {
  id: string;
  name: string;
  initials: string;
  color: string;
  lane: string;
  capitalDeployed: number;
  ytdRevenue: number;
  roi: number;
  momentumScore: number;
  momentumDelta: number;
  monthlyListeners: number;
  listenerGrowth: number;
  growthVelocity: 'accelerating' | 'steady' | 'decelerating';
  riskLevel: 'low' | 'medium' | 'high';
  campaignEfficiency: number;
}

const ARTISTS: ArtistAsset[] = [
  {
    id: 'aar',
    name: 'All American Rejects',
    initials: 'AAR',
    color: '#06B6D4',
    lane: 'Alt-Rock / Nostalgia',
    capitalDeployed: 180_000,
    ytdRevenue: 142_000,
    roi: 1.94,
    momentumScore: 91,
    momentumDelta: 8,
    monthlyListeners: 2_100_000,
    listenerGrowth: 12,
    growthVelocity: 'accelerating',
    riskLevel: 'low',
    campaignEfficiency: 87,
  },
  {
    id: 'rs',
    name: 'Robot Sunrise',
    initials: 'RS',
    color: '#06B6D4',
    lane: 'Indie Pop / Electronic',
    capitalDeployed: 92_000,
    ytdRevenue: 38_400,
    roi: 1.41,
    momentumScore: 74,
    momentumDelta: 14,
    monthlyListeners: 287_000,
    listenerGrowth: 34,
    growthVelocity: 'accelerating',
    riskLevel: 'medium',
    campaignEfficiency: 61,
  },
  {
    id: 'jrg',
    name: 'Jorgen',
    initials: 'JR',
    color: '#10B981',
    lane: 'Hip-Hop / Alternative',
    capitalDeployed: 40_400,
    ytdRevenue: 19_200,
    roi: 0.97,
    momentumScore: 48,
    momentumDelta: -6,
    monthlyListeners: 91_500,
    listenerGrowth: 8,
    growthVelocity: 'decelerating',
    riskLevel: 'high',
    campaignEfficiency: 32,
  },
];

interface AIAction {
  id: string;
  type: 'reallocate' | 'scale' | 'pause' | 'investigate';
  headline: string;
  detail: string;
  fromArtist?: string;
  fromColor?: string;
  toArtist?: string;
  toColor?: string;
  amount?: number;
  projectedLift: string;
  confidence: 'High' | 'Medium' | 'Low';
  color: string;
}

const AI_ACTIONS: AIAction[] = [
  {
    id: 'ai1',
    type: 'reallocate',
    headline: 'Reallocate $15K from Jorgen → Robot Sunrise',
    detail: 'Jorgen\'s campaign efficiency dropped to 32% — well below the 65% portfolio threshold. Robot Sunrise is trending +34% with an upcoming release window. Capital reallocation now could yield a projected +28% ROI uplift.',
    fromArtist: 'Jorgen',
    fromColor: '#10B981',
    toArtist: 'Robot Sunrise',
    toColor: '#06B6D4',
    amount: 15_000,
    projectedLift: '+28% ROI on redeployed capital',
    confidence: 'High',
    color: '#06B6D4',
  },
  {
    id: 'ai2',
    type: 'scale',
    headline: 'Scale AAR campaign by $8K — pre-release window open',
    detail: 'All American Rejects is at 1.94x ROI with campaign efficiency at 87%. They\'re 6 days from asset lock and listener momentum is accelerating. This is an optimal compounding window.',
    fromArtist: undefined,
    toArtist: 'All American Rejects',
    toColor: '#06B6D4',
    amount: 8_000,
    projectedLift: '+18–24% stream lift on release week',
    confidence: 'High',
    color: '#06B6D4',
  },
  {
    id: 'ai3',
    type: 'investigate',
    headline: 'Investigate Jorgen revenue-to-listener gap',
    detail: 'Jorgen has 91.5K monthly listeners but only $19.2K YTD revenue — that\'s significantly below conversion benchmarks. Audit monetization setup, sync licensing, and merchandise integration.',
    amount: undefined,
    projectedLift: 'Potential $8–18K unlocked revenue',
    confidence: 'Medium',
    color: '#F59E0B',
  },
];

function MomentumBar({ score, color }: { score: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: `linear-gradient(90deg,${color}80,${color})`, borderRadius: 99, transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)', boxShadow: `0 0 6px ${color}40` }} />
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 800, color, minWidth: 24, textAlign: 'right' }}>{score}</span>
    </div>
  );
}

function ROIBadge({ roi, color }: { roi: number; color: string }) {
  const isAbove = roi >= 1;
  const c = isAbove ? '#10B981' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 7, background: `${c}10`, border: `1px solid ${c}20` }}>
      {isAbove ? <ArrowUpRight size={9} color={c} /> : <TrendingDown size={9} color={c} />}
      <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 800, color: c }}>{roi.toFixed(2)}x</span>
    </div>
  );
}

function RiskPip({ level }: { level: 'low' | 'medium' | 'high' }) {
  const map = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };
  const label = { low: 'Low Risk', medium: 'Med Risk', high: 'High Risk' };
  const c = map[level];
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '2px 6px', borderRadius: 5, background: `${c}10`, border: `1px solid ${c}20`, color: c, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
      {label[level]}
    </span>
  );
}

function ConfidenceDots({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const c = level === 'High' ? '#10B981' : level === 'Medium' ? '#F59E0B' : '#EF4444';
  const filled = level === 'High' ? 3 : level === 'Medium' ? 2 : 1;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 5, height: 5, borderRadius: 2, background: i < filled ? c : 'rgba(255,255,255,0.08)' }} />
      ))}
      <span style={{ fontFamily: 'monospace', fontSize: 7, color: c, letterSpacing: '0.06em', fontWeight: 800 }}>{level}</span>
    </div>
  );
}

function ArtistAssetCard({ artist, rank }: { artist: ArtistAsset; rank: number }) {
  const velocityIcon = artist.growthVelocity === 'accelerating' ? TrendingUp : artist.growthVelocity === 'steady' ? Activity : TrendingDown;
  const velocityColor = artist.growthVelocity === 'accelerating' ? '#10B981' : artist.growthVelocity === 'steady' ? '#F59E0B' : '#EF4444';
  const VelIcon = velocityIcon;
  const pctOfPortfolio = Math.round((artist.capitalDeployed / PORTFOLIO.totalCapitalDeployed) * 100);

  return (
    <div style={{
      background: rank === 0 ? `${artist.color}06` : 'rgba(255,255,255,0.015)',
      border: `1px solid ${rank === 0 ? `${artist.color}22` : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 13, padding: '14px 16px',
      position: 'relative', overflow: 'hidden',
    }}>
      {rank === 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${artist.color}50,transparent)` }} />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: `${artist.color}14`, border: `1px solid ${artist.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 900, color: artist.color }}>{artist.initials}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.82)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.name}</span>
            {rank === 0 && (
              <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: `${artist.color}18`, border: `1px solid ${artist.color}28`, color: artist.color }}>Top Momentum</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <RiskPip level={artist.riskLevel} />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{artist.lane}</span>
          </div>
        </div>
        <ROIBadge roi={artist.roi} color={artist.color} />
      </div>

      {/* Momentum */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Momentum Score</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <VelIcon size={9} color={velocityColor} />
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: velocityColor, fontWeight: 700 }}>{artist.growthVelocity}</span>
          </div>
        </div>
        <MomentumBar score={artist.momentumScore} color={artist.color} />
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Capital Deployed</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.7)', lineHeight: 1, marginBottom: 2 }}>{fmtMoney(artist.capitalDeployed)}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{pctOfPortfolio}% of portfolio</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>YTD Revenue</div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#10B981', lineHeight: 1, marginBottom: 2 }}>{fmtMoney(artist.ytdRevenue)}</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>+{artist.listenerGrowth}% listeners</div>
        </div>
      </div>

      {/* Campaign efficiency bar */}
      <div style={{ marginTop: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Campaign Efficiency</span>
          <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, color: artist.campaignEfficiency >= 65 ? '#10B981' : artist.campaignEfficiency >= 45 ? '#F59E0B' : '#EF4444' }}>
            {artist.campaignEfficiency}%
          </span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: `${artist.campaignEfficiency}%`, height: '100%', borderRadius: 99, background: artist.campaignEfficiency >= 65 ? '#10B981' : artist.campaignEfficiency >= 45 ? '#F59E0B' : '#EF4444' }} />
        </div>
      </div>
    </div>
  );
}

function UnderperformingAssets() {
  const underperforming = ARTISTS.filter(a => a.roi < 1.2 || a.campaignEfficiency < 50 || a.riskLevel === 'high');

  return (
    <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.16)', borderRadius: 13, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.45),transparent)' }} />
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={11} color="#EF4444" />
        </div>
        <span style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.75)' }}>Underperforming Assets</span>
        <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '2px 7px', borderRadius: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
          {underperforming.length} flagged
        </span>
      </div>
      <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {underperforming.map(a => {
          const reasons: string[] = [];
          if (a.roi < 1.2) reasons.push(`ROI at ${a.roi.toFixed(2)}x — below 1.20x threshold`);
          if (a.campaignEfficiency < 50) reasons.push(`Campaign efficiency ${a.campaignEfficiency}% — critical`);
          if (a.riskLevel === 'high') reasons.push('Classified as high-risk portfolio asset');

          return (
            <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: `${a.color}05`, borderRadius: 10, border: `1px solid ${a.color}14` }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${a.color}12`, border: `1px solid ${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 900, color: a.color }}>{a.initials}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{a.name}</span>
                  <ROIBadge roi={a.roi} color={a.color} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reasons.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#EF4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: '3px 8px', cursor: 'pointer' }}>
                  Review
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type ExecState = 'idle' | 'running' | 'done' | 'dismissed';

function AIActionCard({ action }: { action: AIAction }) {
  const [state, setState] = useState<ExecState>('idle');

  function execute() {
    if (state !== 'idle') return;
    setState('running');
    setTimeout(() => setState('done'), 2000);
  }
  function dismiss() { setState('dismissed'); }

  if (state === 'dismissed') return null;

  return (
    <div style={{
      background: state === 'done' ? `${action.color}07` : 'rgba(255,255,255,0.02)',
      border: `1px solid ${state === 'done' ? `${action.color}35` : `${action.color}18`}`,
      borderRadius: 13, padding: '14px 16px',
      transition: 'border-color 0.25s, background 0.25s',
      position: 'relative', overflow: 'hidden',
    }}>
      {state === 'done' && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${action.color}50,transparent)` }} />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${action.color}12`, border: `1px solid ${action.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Brain size={14} color={action.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: state === 'done' ? action.color : 'rgba(255,255,255,0.82)', transition: 'color 0.2s' }}>
              {state === 'done' ? 'Action queued for execution' : action.headline}
            </span>
            {action.amount && (
              <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 900, color: action.color }}>{fmtMoney(action.amount)}</span>
            )}
          </div>

          {/* From → To flow */}
          {action.fromArtist && action.toArtist && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 7px', borderRadius: 5, background: `${action.fromColor}10`, border: `1px solid ${action.fromColor}20`, color: action.fromColor }}>{action.fromArtist}</span>
              <ArrowRight size={10} color="rgba(255,255,255,0.2)" />
              <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 7px', borderRadius: 5, background: `${action.toColor}10`, border: `1px solid ${action.toColor}20`, color: action.toColor }}>{action.toArtist}</span>
            </div>
          )}
          {!action.fromArtist && action.toArtist && (
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, padding: '1px 7px', borderRadius: 5, background: `${action.toColor}10`, border: `1px solid ${action.toColor}20`, color: action.toColor }}>{action.toArtist}</span>
            </div>
          )}
        </div>
        <ConfidenceDots level={action.confidence} />
      </div>

      {/* Detail text */}
      <p style={{ margin: '0 0 10px 44px', fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 }}>{action.detail}</p>

      {/* Projected lift + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 44, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: `${action.color}08`, border: `1px solid ${action.color}18` }}>
          <TrendingUp size={9} color={action.color} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, color: action.color }}>{action.projectedLift}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {state === 'done' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={12} color={action.color} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: action.color }}>Queued</span>
            </div>
          ) : state === 'running' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <RefreshCcw size={11} color={action.color} style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: action.color }}>Processing…</span>
            </div>
          ) : (
            <>
              <button
                onClick={dismiss}
                style={{ fontFamily: 'monospace', fontSize: 8, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.2)' }}
              >Dismiss</button>
              <button
                onClick={execute}
                style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'monospace', fontSize: 9, fontWeight: 800, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: action.color, border: `1px solid ${action.color}`, color: '#000', boxShadow: `0 0 12px ${action.color}30`, transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
              >
                <Zap size={9} color="#000" /> Execute →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioMetricCard({ label, value, sub, delta, deltaPositive, color, icon: Icon }: {
  label: string; value: string; sub: string; delta: string; deltaPositive: boolean; color: string; icon: React.ElementType;
}) {
  return (
    <div style={{ background: `${color}07`, border: `1px solid ${color}18`, borderRadius: 13, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color}40,transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 9, background: `${color}12`, border: `1px solid ${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13} color={color} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 6, background: deltaPositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${deltaPositive ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
          {deltaPositive ? <ArrowUpRight size={8} color="#10B981" /> : <TrendingDown size={8} color="#EF4444" />}
          <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, color: deltaPositive ? '#10B981' : '#EF4444' }}>{delta}</span>
        </div>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.025em', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>{sub}</div>
    </div>
  );
}

export default function LabelPortfolioEngine() {
  const [aiExpanded, setAiExpanded] = useState(true);
  const [showUnderperforming, setShowUnderperforming] = useState(true);

  const topThree = [...ARTISTS].sort((a, b) => b.momentumScore - a.momentumScore).slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── PORTFOLIO ENGINE HEADER ── */}
      <div style={{
        background: 'linear-gradient(135deg,rgba(6,182,212,0.07) 0%,rgba(16,185,129,0.05) 50%,rgba(245,158,11,0.04) 100%)',
        border: '1px solid rgba(6,182,212,0.2)', borderRadius: 16, padding: '18px 22px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.55),rgba(16,185,129,0.35),transparent)' }} />
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,182,212,0.05) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(6,182,212,0.1)' }}>
              <Layers size={20} color="#06B6D4" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(6,182,212,0.55)' }}>Portfolio Intelligence Engine</span>
                <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)', color: '#10B981' }}>Active</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Label Portfolio Overview</h3>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Manage artists as assets — deploy capital, track ROI, and act on AI-driven reallocation signals</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[
              { dot: '#10B981', label: `${ARTISTS.filter(a => a.riskLevel === 'low').length} Low Risk` },
              { dot: '#F59E0B', label: `${ARTISTS.filter(a => a.riskLevel === 'medium').length} Med Risk` },
              { dot: '#EF4444', label: `${ARTISTS.filter(a => a.riskLevel === 'high').length} High Risk` },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, boxShadow: `0 0 5px ${s.dot}80` }} />
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── MACRO METRICS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginTop: 18 }}>
          <PortfolioMetricCard
            label="Total Capital Deployed"
            value={fmtMoney(PORTFOLIO.totalCapitalDeployed)}
            sub="Across all active artist assets"
            delta={`+${PORTFOLIO.capitalDeployedChange}%`}
            deltaPositive={true}
            color="#06B6D4"
            icon={DollarSign}
          />
          <PortfolioMetricCard
            label="Portfolio Growth Rate"
            value={`${PORTFOLIO.portfolioGrowthRate}%`}
            sub="Blended YTD listener + revenue"
            delta={`+${PORTFOLIO.growthRateDelta}%`}
            deltaPositive={true}
            color="#10B981"
            icon={TrendingUp}
          />
          <PortfolioMetricCard
            label="Blended Portfolio ROI"
            value={`${PORTFOLIO.portfolioROI.toFixed(2)}x`}
            sub="Revenue ÷ capital deployed"
            delta={`+${PORTFOLIO.roiDelta.toFixed(2)}x`}
            deltaPositive={true}
            color="#F59E0B"
            icon={BarChart2}
          />
          <PortfolioMetricCard
            label="Unrealized Asset Value"
            value={fmtMoney(PORTFOLIO.unrealizedValue)}
            sub="Est. catalog + audience equity"
            delta="+9.2%"
            deltaPositive={true}
            color="#EC4899"
            icon={Target}
          />
        </div>
      </div>

      {/* ── TOP 3 BY MOMENTUM ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flame size={12} color="#F59E0B" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>Top 3 Artists by Momentum</span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(255,255,255,0.05),transparent)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>Ranked by momentum score</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {topThree.map((a, i) => <ArtistAssetCard key={a.id} artist={a} rank={i} />)}
        </div>
      </div>

      {/* ── UNDERPERFORMING ASSETS ── */}
      <div>
        <button
          onClick={() => setShowUnderperforming(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <AlertTriangle size={11} color="#EF4444" />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)' }}>Underperforming Assets</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(239,68,68,0.1),transparent)', width: 80 }} />
          {showUnderperforming ? <ChevronUp size={11} color="rgba(255,255,255,0.2)" /> : <ChevronDown size={11} color="rgba(255,255,255,0.2)" />}
        </button>
        {showUnderperforming && <UnderperformingAssets />}
      </div>

      {/* ── AI REALLOCATION ENGINE ── */}
      <div>
        <button
          onClick={() => setAiExpanded(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 8, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)' }}>
            <Brain size={10} color="#06B6D4" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#06B6D4' }}>AI Capital Reallocation Engine</span>
            <span style={{ fontFamily: 'monospace', fontSize: 7, padding: '1px 5px', borderRadius: 4, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}>{AI_ACTIONS.length} signals</span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(6,182,212,0.12),transparent)' }} />
          {aiExpanded ? <ChevronUp size={11} color="rgba(255,255,255,0.2)" /> : <ChevronDown size={11} color="rgba(255,255,255,0.2)" />}
        </button>

        {aiExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AI_ACTIONS.map(a => <AIActionCard key={a.id} action={a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
