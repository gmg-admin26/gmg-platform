import { Info } from 'lucide-react';

const ACCENT = '#3B82F6';

const FVI_DATA = {
  score: 72,
  label: 'Fan Value Index',
  trend: '+4 pts this month',
  trend_dir: 'up' as const,
  tiers: [
    { id: 'passive',   label: 'Passive',   pct: 62, count: 2_976_000, color: '#6B7280', description: 'Low-frequency listeners, minimal spend' },
    { id: 'engaged',   label: 'Engaged',   pct: 23, count: 1_104_000, color: '#3B82F6', description: 'Regular listeners, some conversion' },
    { id: 'core',      label: 'Core',      pct: 10, count: 480_000,   color: '#06B6D4', description: 'High-frequency, community-active' },
    { id: 'superfan',  label: 'Superfan',  pct: 5,  count: 240_000,   color: '#F59E0B', description: 'Top-spend, merch buyers, advocates' },
  ],
  dimensions: [
    {
      id: 'engagement',
      label: 'Engagement',
      weight: 40,
      score: 68,
      color: '#3B82F6',
      detail: 'Stream frequency, saves, playlist adds, social interactions',
    },
    {
      id: 'ownership',
      label: 'Ownership',
      weight: 25,
      score: 58,
      color: '#06B6D4',
      detail: 'Downloads, vinyl/CD purchases, library saves',
    },
    {
      id: 'monetization',
      label: 'Monetization',
      weight: 25,
      score: 81,
      color: '#10B981',
      detail: 'Merch spend, ticket purchases, subscription revenue',
    },
    {
      id: 'advocacy',
      label: 'Advocacy',
      weight: 10,
      score: 74,
      color: '#F59E0B',
      detail: 'Shares, reposts, fan-made content, community growth',
    },
  ],
};

function ScoreRing({ score }: { score: number }) {
  const size = 120;
  const strokeW = 9;
  const r = (size - strokeW) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const gap = circ - fill;

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#10B981';
    if (s >= 60) return '#3B82F6';
    if (s >= 40) return '#F59E0B';
    return '#EF4444';
  };
  const color = getScoreColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          strokeWidth={strokeW}
          stroke="rgba(255,255,255,0.05)"
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          strokeWidth={strokeW}
          stroke={color}
          strokeDasharray={`${fill} ${gap}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease', filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[30px] font-bold leading-none" style={{ color }}>{score}</span>
        <span className="text-[8px] font-mono text-white/25 mt-0.5 tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

function TierBar({ tiers }: { tiers: typeof FVI_DATA.tiers }) {
  return (
    <div className="space-y-2">
      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
        {tiers.map(tier => (
          <div
            key={tier.id}
            style={{
              width: `${tier.pct}%`,
              background: tier.color,
              opacity: 0.85,
              transition: 'width 0.5s ease',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        {tiers.map(tier => (
          <div key={tier.id} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: tier.color }} />
            <span className="text-[9.5px] text-white/40 font-mono">{tier.label}</span>
            <span className="text-[9px] font-bold" style={{ color: tier.color }}>{tier.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DimensionRow({ d }: { d: typeof FVI_DATA.dimensions[0] }) {
  const weighted = Math.round(d.score * (d.weight / 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-semibold text-white/75 truncate">{d.label}</span>
          <span
            className="text-[8px] font-mono px-1.5 py-0.5 rounded"
            style={{ color: d.color, background: `${d.color}14`, border: `1px solid ${d.color}22` }}
          >
            {d.weight}% weight
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono text-white/25">contrib.</span>
          <span className="text-[12px] font-bold" style={{ color: d.color }}>{weighted}</span>
        </div>
      </div>
      <div className="relative h-[5px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${d.score}%`,
            background: `linear-gradient(90deg, ${d.color}80, ${d.color})`,
            transition: 'width 0.5s ease',
            boxShadow: `0 0 8px ${d.color}40`,
          }}
        />
      </div>
      <p className="text-[9px] text-white/20 leading-relaxed">{d.detail}</p>
    </div>
  );
}

export default function FanValueIndex() {
  const { score, tiers, dimensions, trend } = FVI_DATA;

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)` }} />

      <div className="grid lg:grid-cols-[auto_1fr] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.05]">

        {/* Left — score ring */}
        <div className="flex flex-col items-center justify-center gap-3 px-8 py-6 lg:min-w-[200px]">
          <ScoreRing score={score} />
          <div className="text-center">
            <p className="text-[11px] font-semibold text-white/70 tracking-wide">{FVI_DATA.label}</p>
            <p className="text-[9px] font-mono text-[#10B981] mt-0.5">{trend}</p>
          </div>
          <div className="flex items-center gap-1 text-[8.5px] font-mono text-white/15 mt-1">
            <Info className="w-3 h-3" />
            <span>Composite — not real-time</span>
          </div>
        </div>

        {/* Right — tiers + dimensions */}
        <div className="px-5 py-5 space-y-5">

          {/* Tier distribution */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/25">Tier Distribution</span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>
            <TierBar tiers={tiers} />
          </div>

          {/* Dimension breakdown */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/25">Score Dimensions</span>
              <div className="flex-1 h-[1px] bg-white/[0.04]" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {dimensions.map(d => <DimensionRow key={d.id} d={d} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
