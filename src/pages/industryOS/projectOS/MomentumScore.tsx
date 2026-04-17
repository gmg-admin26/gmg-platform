import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import type { WorkerWithRelations } from '../../../dashboard/data/workerPaymentService';

const ACCENT = '#10B981';
const AMBER = '#F59E0B';
const RED = '#EF4444';

function colorFor(score: number): { stroke: string; glow: string; label: string } {
  if (score >= 75) return { stroke: ACCENT, glow: 'rgba(16,185,129,0.55)', label: 'Strong' };
  if (score >= 45) return { stroke: AMBER, glow: 'rgba(245,158,11,0.5)', label: 'Building' };
  return { stroke: RED, glow: 'rgba(239,68,68,0.5)', label: 'At Risk' };
}

export function computeMomentum(worker: WorkerWithRelations): number {
  const assignments = worker.assignments ?? [];
  const safe = worker.payment_safe;

  const delivW = assignments.length === 0
    ? 0
    : (assignments.filter(a => a.status === 'approved').length * 1 +
       assignments.filter(a => a.status === 'submitted').length * 0.75 +
       assignments.filter(a => a.status === 'in_progress').length * 0.4) / assignments.length;

  const compliance = [
    worker.agreement_status === 'signed',
    worker.w9_status !== 'missing',
    worker.ach_status === 'connected',
    worker.invoice_status !== 'missing',
  ];
  const compW = compliance.filter(Boolean).length / compliance.length;

  const stageMap: Record<string, number> = {
    held: 0.15, pending: 0.45, approved: 0.8, delayed: 0.35, paid: 1, cancelled: 0,
  };
  const stageW = safe ? (stageMap[safe.status] ?? 0.25) : 0.2;

  const activityW = assignments.length > 0 ? 0.75 : 0.3;

  const score = (delivW * 35) + (compW * 25) + (stageW * 25) + (activityW * 15);
  return Math.max(0, Math.min(100, Math.round(score)));
}

interface Props {
  worker: WorkerWithRelations;
  size?: number;
}

export default function MomentumScore({ worker, size = 118 }: Props) {
  const target = computeMomentum(worker);
  const [display, setDisplay] = useState(0);
  const { stroke, glow, label } = colorFor(target);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const r = (size - 14) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = (display / 100) * circ;

  return (
    <div
      className="relative rounded-2xl p-3 flex flex-col items-center"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.08), rgba(0,0,0,0) 60%), #0B0D10',
        border: `1px solid ${stroke}22`,
        boxShadow: `0 0 24px ${glow.replace('0.5', '0.1').replace('0.55', '0.12')}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <style>{`
        @keyframes ms-pulse { 0%,100% { filter: drop-shadow(0 0 6px ${glow}); } 50% { filter: drop-shadow(0 0 14px ${glow}); } }
        @keyframes ms-ambient { 0%,100% { opacity: 0.35 } 50% { opacity: 0.65 } }
      `}</style>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 20%, ${stroke}18, transparent 70%)`,
          animation: 'ms-ambient 3.2s ease-in-out infinite',
        }}
      />

      <div className="relative flex items-center justify-center" style={{ width: size, height: size, animation: 'ms-pulse 2.6s ease-in-out infinite' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id={`ms-grad-${Math.round(target)}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.9" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.05)" strokeWidth={6} fill="none" />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={`url(#ms-grad-${Math.round(target)})`}
            strokeWidth={6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 0.3s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[24px] font-bold leading-none" style={{ color: stroke }}>
            {display}
          </div>
          <div className="text-[7.5px] font-mono uppercase tracking-[0.2em] text-white/30 mt-1">of 100</div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <TrendingUp className="w-3 h-3" style={{ color: stroke }} />
        <span className="text-[10px] font-semibold" style={{ color: stroke }}>Momentum · {label}</span>
      </div>
      <p className="text-[9px] font-mono text-white/28 uppercase tracking-wide text-center mt-0.5 leading-tight">
        Determines payment priority<br/>and project access
      </p>
    </div>
  );
}
