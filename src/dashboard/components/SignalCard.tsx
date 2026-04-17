import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SignalCardProps {
  label: string;
  value: string;
  delta: string;
  deltaDir: 'up' | 'down' | 'neutral';
  sub: string;
  accent: string;
}

export default function SignalCard({ label, value, delta, deltaDir, sub, accent }: SignalCardProps) {
  return (
    <div className="relative bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 hover:border-white/[0.12] transition-all group overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-[1px] opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.06] blur-2xl group-hover:opacity-[0.1] transition-opacity"
        style={{ background: accent }}
      />

      <p className="text-[11px] font-mono text-white/30 uppercase tracking-widest mb-2">{label}</p>

      <div className="flex items-end justify-between">
        <p className="text-[28px] font-bold text-white leading-none tracking-tight font-['Satoshi',sans-serif]">
          {value}
        </p>
        <div className={`flex items-center gap-1 text-[11px] font-medium ${
          deltaDir === 'up' ? 'text-[#10B981]' :
          deltaDir === 'down' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
        }`}>
          {deltaDir === 'up' ? <TrendingUp className="w-3 h-3" /> :
           deltaDir === 'down' ? <TrendingDown className="w-3 h-3" /> :
           <Minus className="w-3 h-3" />}
          <span>{delta}</span>
        </div>
      </div>

      <p className="text-[11px] text-white/25 mt-1.5">{sub}</p>
    </div>
  );
}
