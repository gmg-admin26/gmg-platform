import { Cpu, TrendingUp, Users, DollarSign, Zap } from 'lucide-react';
import { ARTISTS } from '../../data/rocksteadyData';

const SCORE_METRICS = [
  { key: 'growthScore',     label: 'Growth',     icon: TrendingUp, color: '#10B981' },
  { key: 'engagementScore', label: 'Engagement', icon: Users,      color: '#06B6D4' },
  { key: 'revenueScore',    label: 'Revenue Pot.', icon: DollarSign, color: '#F59E0B' },
  { key: 'viralityScore',   label: 'Virality',   icon: Zap,        color: '#EF4444' },
] as const;

function ScoreRow({ artist }: { artist: typeof ARTISTS[0] }) {
  return (
    <div className="px-4 py-3 hover:bg-white/[0.015] transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-white/40">{artist.name.charAt(0)}</span>
        </div>
        <span className="text-[12px] font-semibold text-white/75 group-hover:text-white transition-colors">{artist.name}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-white/20">AI Score</span>
          <span className="text-[14px] font-bold" style={{ color: artist.aiScore >= 90 ? '#10B981' : artist.aiScore >= 80 ? '#F59E0B' : '#06B6D4' }}>
            {artist.aiScore}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {SCORE_METRICS.map(m => {
          const val = artist[m.key];
          return (
            <div key={m.key}>
              <div className="flex items-center gap-1 mb-1">
                <m.icon className="w-2.5 h-2.5" style={{ color: m.color }} />
                <span className="text-[9px] font-mono text-white/20">{m.label}</span>
              </div>
              <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${val}%`, background: m.color, opacity: 0.8 }} />
              </div>
              <span className="text-[9px] font-mono mt-0.5 block" style={{ color: m.color }}>{val}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AIScoringSystem() {
  const sorted = [...ARTISTS].sort((a, b) => b.aiScore - a.aiScore);

  return (
    <div className="bg-[#0A0C0F] border border-[#10B981]/15 rounded-xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" style={{ position: 'relative' }} />
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Cpu className="w-4 h-4 text-[#10B981]" />
        <span className="text-[13px] font-semibold text-white/80">AI Scoring System</span>
        <span className="text-[9px] font-mono text-white/15 ml-1 tracking-widest">// ROCKSTEADY ENGINE</span>
        <span className="ml-auto text-[9px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 px-2 py-0.5 rounded">
          {sorted.length} artists scored
        </span>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {sorted.map(a => <ScoreRow key={a.id} artist={a} />)}
      </div>
    </div>
  );
}
