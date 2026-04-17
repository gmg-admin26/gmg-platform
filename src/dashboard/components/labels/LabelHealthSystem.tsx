import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Users, Disc3, DollarSign, BarChart2 } from 'lucide-react';

interface HealthDimension {
  id: string;
  label: string;
  score: number;
  trend: 'up' | 'down' | 'flat';
  trendDelta: string;
  explanation: string;
  icon: React.ElementType;
  color: string;
}

const DIMENSIONS: HealthDimension[] = [
  {
    id: 'roster',
    label: 'Roster Performance',
    score: 82,
    trend: 'up',
    trendDelta: '+6 pts',
    explanation: 'AAR driving strong listener growth. Robot Sunrise breakout trajectory on track. Jorgen underactivated but stable.',
    icon: Users,
    color: '#06B6D4',
  },
  {
    id: 'campaign',
    label: 'Campaign Efficiency',
    score: 68,
    trend: 'down',
    trendDelta: '−4 pts',
    explanation: 'Robot Sunrise EU campaign underperforming vs. spend. AAR pre-save conversion healthy. Jorgen has no active push.',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    id: 'release',
    label: 'Release Execution',
    score: 71,
    trend: 'flat',
    trendDelta: '0 pts',
    explanation: 'Jorgen cleared and scheduled. AAR at-risk on asset approval. Robot Sunrise has 3 open blockers — mastering not delivered.',
    icon: Disc3,
    color: '#EC4899',
  },
  {
    id: 'financial',
    label: 'Financial Health',
    score: 79,
    trend: 'up',
    trendDelta: '+3 pts',
    explanation: 'YTD revenue up 18% vs. prior period. Recoupment on track for AAR. Advance exposure on RS needs monitoring.',
    icon: DollarSign,
    color: '#10B981',
  },
];

const COMPOSITE = Math.round(DIMENSIONS.reduce((s, d) => s + d.score, 0) / DIMENSIONS.length);

const BIGGEST_RISK = 'Robot Sunrise has 3 release blockers — DSP submission and mastering both stalled. Missing delivery window puts campaign spend at risk.';
const BIGGEST_OPPORTUNITY = 'Robot Sunrise +34% listener growth is outpacing spend. Accelerating campaign budget now could lock in the breakout window before momentum plateaus.';

function scoreColor(s: number) {
  return s >= 80 ? '#10B981' : s >= 65 ? '#F59E0B' : '#EF4444';
}

function ScoreRing({ score, size = 44 }: { score: number; size?: number }) {
  const color = scoreColor(score);
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={center} cy={center} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={3} />
      <circle cx={center} cy={center} r={r} fill="none" stroke={color} strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - score / 100)}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}90)` }} />
      <text x={center} y={center} textAnchor="middle" dominantBaseline="central" fill={color}
        style={{ fontSize: size * 0.26, fontWeight: 900, fontFamily: 'monospace', transform: `rotate(90deg)`, transformOrigin: `${center}px ${center}px` }}>
        {score}
      </text>
    </svg>
  );
}

export function LabelHealthSystem() {
  const compositeColor = scoreColor(COMPOSITE);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${compositeColor}60,rgba(6,182,212,0.3),transparent)` }} />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: `${compositeColor}15`, border: `1px solid ${compositeColor}28` }}>
            <BarChart2 size={14} color={compositeColor} />
          </div>
          <div>
            <h2 className="text-[13px] font-black text-white/80 leading-none tracking-tight">Label Health System</h2>
            <p className="text-[9px] font-mono text-white/25 mt-0.5 uppercase tracking-wider">CEO-Level Snapshot · SPIN Records</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider">Composite Score</div>
            <div className="text-[22px] font-black leading-none" style={{ color: compositeColor }}>{COMPOSITE}</div>
          </div>
          <ScoreRing score={COMPOSITE} size={50} />
        </div>
      </div>

      {/* 4-dimension grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.04]">
        {DIMENSIONS.map(dim => {
          const dc = scoreColor(dim.score);
          const TrendIcon = dim.trend === 'up' ? TrendingUp : dim.trend === 'down' ? TrendingDown : Minus;
          const trendColor = dim.trend === 'up' ? '#10B981' : dim.trend === 'down' ? '#EF4444' : '#6B7280';
          const Icon = dim.icon;
          const barWidth = `${dim.score}%`;
          return (
            <div key={dim.id} className="p-5 flex flex-col gap-3">
              {/* Label + icon */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${dim.color}14`, border: `1px solid ${dim.color}22` }}>
                  <Icon size={12} color={dim.color} />
                </div>
                <span className="text-[10px] font-mono text-white/35 uppercase tracking-wider">{dim.label}</span>
              </div>

              {/* Score + trend */}
              <div className="flex items-end justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[28px] font-black leading-none" style={{ color: dc }}>{dim.score}</span>
                  <span className="text-[9px] font-mono text-white/20">/100</span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{ background: `${trendColor}10`, border: `1px solid ${trendColor}20` }}>
                  <TrendIcon size={9} color={trendColor} />
                  <span className="text-[8px] font-mono font-bold" style={{ color: trendColor }}>{dim.trendDelta}</span>
                </div>
              </div>

              {/* Bar */}
              <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: barWidth, background: dc, boxShadow: `0 0 6px ${dc}60` }} />
              </div>

              {/* Explanation */}
              <p className="text-[10px] text-white/35 leading-relaxed">{dim.explanation}</p>
            </div>
          );
        })}
      </div>

      {/* Risk / Opportunity bar */}
      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-white/[0.05] border-t border-white/[0.05]">
        <div className="flex items-start gap-3 px-6 py-4">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)' }}>
            <AlertTriangle size={12} color="#EF4444" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-[#EF4444]/60 uppercase tracking-wider font-bold block mb-1">Biggest Risk Right Now</span>
            <p className="text-[11px] text-white/50 leading-relaxed">{BIGGEST_RISK}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 px-6 py-4">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.22)' }}>
            <Zap size={12} color="#10B981" />
          </div>
          <div>
            <span className="text-[8px] font-mono text-[#10B981]/60 uppercase tracking-wider font-bold block mb-1">Biggest Opportunity</span>
            <p className="text-[11px] text-white/50 leading-relaxed">{BIGGEST_OPPORTUNITY}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
