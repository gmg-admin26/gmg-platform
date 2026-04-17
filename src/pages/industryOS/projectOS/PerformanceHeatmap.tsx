import { useEffect, useState } from 'react';
import { Flame, Globe as Globe2 } from 'lucide-react';

interface Region {
  name: string;
  label: string;
  intensity: number;
}

const REGIONS: Region[] = [
  { name: 'United States',  label: 'High traction',    intensity: 92 },
  { name: 'Brazil',          label: 'Rapid growth',     intensity: 78 },
  { name: 'United Kingdom',  label: 'Stable',           intensity: 61 },
  { name: 'Germany',         label: 'Building',         intensity: 48 },
  { name: 'Japan',           label: 'Emerging',         intensity: 35 },
];

function colorFor(intensity: number): string {
  if (intensity >= 80) return '#EC4899';
  if (intensity >= 60) return '#F472B6';
  if (intensity >= 40) return '#22D3EE';
  return '#06B6D4';
}

export default function PerformanceHeatmap() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(236,72,153,0.04))',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      <style>{`
        @keyframes ph-fill { from { width: 0 } }
        @keyframes ph-glow { 0%,100% { opacity: 0.35 } 50% { opacity: 0.7 } }
      `}</style>

      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 60%)',
          filter: 'blur(30px)',
          animation: 'ph-glow 4s ease-in-out infinite',
        }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.28)' }}
          >
            <Flame className="w-3 h-3" style={{ color: '#EC4899' }} />
          </div>
          <div>
            <div className="text-[12px] font-semibold text-white/82">Performance Heatmap</div>
            <div className="text-[9.5px] font-mono uppercase tracking-wide text-white/30">Where your work is performing best</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/30">
          <Globe2 className="w-3 h-3" />
          Global Signals
        </div>
      </div>

      <div className="space-y-2 relative">
        {REGIONS.map((r, i) => {
          const color = colorFor(r.intensity);
          return (
            <div key={r.name} className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
              <span className="text-[11px] text-white/65 truncate">{r.name}</span>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: animated ? `${r.intensity}%` : '0%',
                    background: `linear-gradient(90deg, #06B6D4, ${color})`,
                    boxShadow: `0 0 10px ${color}55`,
                    transitionDelay: `${i * 90}ms`,
                  }}
                />
              </div>
              <div className="flex items-center gap-1.5 min-w-[90px] justify-end">
                <span className="text-[9.5px] font-mono uppercase tracking-wide" style={{ color }}>
                  {r.label}
                </span>
                <span className="text-[10px] font-semibold text-white/60 tabular-nums">{r.intensity}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
