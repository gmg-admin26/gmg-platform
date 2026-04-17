import { Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { TEAM_PERFORMANCE } from '../../data/opsData';

function ScoreArc({ score }: { score: number }) {
  const color = score >= 90 ? '#10B981' : score >= 75 ? '#06B6D4' : score >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="18" cy="18" r="14" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${(score / 100) * 88} 88`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function TeamPerformance() {
  return (
    <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <Users className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[10px] font-mono text-white/35 uppercase tracking-widest">Team Performance</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">This week</span>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {TEAM_PERFORMANCE.map(t => (
          <div key={t.team} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
            <ScoreArc score={t.score} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[13px] font-medium text-white/80">{t.team}</p>
                <span className="text-[10px] font-mono text-white/20">{t.members}m</span>
                {t.blocked > 0 && (
                  <span className="text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded">
                    {t.blocked} blocked
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-[#10B981]" />
                  <span className="text-[10px] font-mono text-white/35">{t.completed}</span>
                </div>
                {t.overdue > 0 && (
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#F59E0B]" />
                    <span className="text-[10px] font-mono text-[#F59E0B]">{t.overdue} overdue</span>
                  </div>
                )}
                {t.blocked > 0 && (
                  <div className="flex items-center gap-1">
                    <XCircle className="w-3 h-3 text-[#EF4444]" />
                    <span className="text-[10px] font-mono text-[#EF4444]">{t.blocked} blocked</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
