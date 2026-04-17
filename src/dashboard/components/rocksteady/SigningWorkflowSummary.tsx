import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, CheckCircle, ChevronRight, Send, MessageSquare,
  Calendar, FilePen, Bot, Zap, ArrowUpRight
} from 'lucide-react';
import { PIPELINE_OPPORTUNITIES, PIPELINE_STATS } from '../../data/pipelineData';

const FUNNEL_STAGES = [
  { label: 'Surfaced', key: 'Surfaced', color: '#6B7280', icon: Zap },
  { label: 'Outreach', key: 'Outreach Sent', color: '#06B6D4', icon: Send },
  { label: 'Escalated', key: 'Escalated to A&R', color: '#F59E0B', icon: MessageSquare },
  { label: 'Meeting', key: 'Meeting Scheduled', color: '#34D399', icon: Calendar },
  { label: 'Agreement', key: 'Agreement Sent', color: '#EC4899', icon: FilePen },
  { label: 'Ops', key: 'Contract In Progress', color: '#8B5CF6', icon: Bot },
  { label: 'Signed', key: 'Signed', color: '#10B981', icon: CheckCircle },
] as const;

export default function SigningWorkflowSummary() {
  const navigate = useNavigate();

  const counts = FUNNEL_STAGES.reduce((acc, stage) => {
    acc[stage.key] = PIPELINE_OPPORTUNITIES.filter(o => o.stage === stage.key).length;
    return acc;
  }, {} as Record<string, number>);

  const activeCount = PIPELINE_OPPORTUNITIES.filter(o =>
    !['Surfaced', 'Closed / Passed'].includes(o.stage)
  ).length;

  const signedThisWeek = PIPELINE_OPPORTUNITIES.filter(o => o.stage === 'Signed').length;

  const EXEC_STATS = [
    { label: 'Outreach Today', value: PIPELINE_STATS.outreachToday, color: '#06B6D4', icon: Send },
    { label: 'Escalations', value: PIPELINE_STATS.escalationsPending, color: '#F59E0B', icon: MessageSquare },
    { label: 'Meetings Set', value: PIPELINE_STATS.meetingsScheduled, color: '#34D399', icon: Calendar },
    { label: 'Agreements Out', value: PIPELINE_STATS.agreementsSent, color: '#EC4899', icon: FilePen },
    { label: 'Signed / Week', value: signedThisWeek, color: '#10B981', icon: CheckCircle },
  ];

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
        <div className="w-[3px] h-4 rounded-full bg-[#10B981]" />
        <span className="text-[13px] font-bold text-white/90">From Discovery to Deal</span>
        <span className="text-[9px] font-mono text-white/25 tracking-widest">// SIGNING WORKFLOW</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.07] text-white/30">
            {activeCount} active
          </span>
          <button onClick={() => navigate('/dashboard/rocksteady/pipeline')}
            className="flex items-center gap-1 text-[10px] font-mono text-[#10B981]/60 hover:text-[#10B981] transition-colors">
            Deal Pipeline <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center gap-0 overflow-x-auto pb-2">
          {FUNNEL_STAGES.map((stage, i) => {
            const count = counts[stage.key] || 0;
            const isActive = count > 0;
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="flex items-center min-w-0">
                <div className="flex flex-col items-center min-w-[72px]">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-1.5 transition-all ${isActive ? '' : 'opacity-25'}`}
                    style={{
                      background: isActive ? `${stage.color}15` : 'rgba(255,255,255,0.03)',
                      borderColor: isActive ? `${stage.color}30` : 'rgba(255,255,255,0.07)',
                    }}>
                    <Icon className="w-4 h-4" style={{ color: isActive ? stage.color : 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center mb-1 ${isActive ? '' : 'opacity-25'}`}
                    style={{
                      background: isActive ? `${stage.color}12` : 'rgba(255,255,255,0.02)',
                      borderColor: isActive ? `${stage.color}20` : 'rgba(255,255,255,0.05)',
                    }}>
                    <span className="text-[11px] font-bold" style={{ color: isActive ? stage.color : 'rgba(255,255,255,0.2)' }}>
                      {count}
                    </span>
                  </div>
                  <span className="text-[7.5px] font-mono text-center leading-tight" style={{ color: isActive ? stage.color : 'rgba(255,255,255,0.18)' }}>
                    {stage.label}
                  </span>
                </div>
                {i < FUNNEL_STAGES.length - 1 && (
                  <div className="flex items-center mx-1 mb-8">
                    <ChevronRight className="w-3 h-3 text-white/12 shrink-0" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2.5 mt-3 flex-wrap">
          {EXEC_STATS.map(s => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.05] flex-1 min-w-[100px]">
              <s.icon className="w-3 h-3 shrink-0" style={{ color: s.color }} />
              <div>
                <p className="text-[8px] font-mono text-white/28 uppercase tracking-wider leading-none mb-0.5">{s.label}</p>
                <p className="text-[15px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {PIPELINE_OPPORTUNITIES.filter(o => o.stage === 'Signed').length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9.5px] font-mono text-white/35 uppercase tracking-widest">Signed This Week</span>
              <button onClick={() => navigate('/dashboard/rocksteady/signings')}
                className="flex items-center gap-1 text-[9px] font-mono text-[#10B981]/55 hover:text-[#10B981] transition-colors">
                Weekly Signings <ChevronRight className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="space-y-1.5">
              {PIPELINE_OPPORTUNITIES.filter(o => o.stage === 'Signed').map(opp => (
                <div key={opp.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#10B981]/[0.05] border border-[#10B981]/12">
                  <CheckCircle className="w-3 h-3 text-[#10B981] shrink-0" />
                  <span className="text-[12px] font-semibold text-white/85 flex-1">{opp.artistName}</span>
                  <span className="text-[9px] font-mono text-white/30">{opp.market}</span>
                  <button onClick={() => navigate('/dashboard/rocksteady/pipeline')}
                    className="text-white/20 hover:text-[#10B981] transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
