import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, CheckSquare, Music, Megaphone, Calendar,
  ArrowLeft, Zap, Clock, Flag, BarChart2, Users,
  ChevronRight, Bot, Activity,
} from 'lucide-react';
import { getClientProfile } from '../../data/catalogClientProfiles';
import { useCatalogClient } from '../../context/CatalogClientContext';

const TASK_STATUS_COLOR: Record<string, string> = {
  in_progress: '#F59E0B',
  open:        '#06B6D4',
  completed:   '#10B981',
  pending:     '#6B7280',
};

const TASK_PRIORITY_COLOR: Record<string, string> = {
  critical: '#EF4444',
  high:     '#F59E0B',
  medium:   '#06B6D4',
  low:      '#6B7280',
};

export default function COSTeamView({ forceClientId }: { forceClientId?: string } = {}) {
  const navigate = useNavigate();
  const { activeClient, switchClient } = useCatalogClient();

  const targetId = forceClientId;
  useEffect(() => {
    if (targetId && activeClient?.id !== targetId) {
      switchClient(targetId);
    }
  }, [targetId, activeClient?.id, switchClient]);

  const profile = getClientProfile(activeClient?.id);
  const { META, METRICS, TASKS, TIMELINE, EXPECTED_ANNUAL_OUTCOMES, AI_RECOMMENDATIONS, CURRENT_STATUS } = profile;
  const ACCENT = META.status_color ?? '#10B981';

  const openTasks    = TASKS.filter(t => t.status !== 'completed');
  const flaggedTasks = TASKS.filter(t => t.flagged);
  const campaignRecs = AI_RECOMMENDATIONS.filter(r => r.category === 'Marketing' || r.category === 'Campaign' || r.category === 'Release' || r.category === 'Sync');
  const allRecs      = campaignRecs.length > 0 ? campaignRecs : AI_RECOMMENDATIONS.slice(0, 2);

  return (
    <div className="p-5 space-y-5 min-h-full bg-[#08090B]">

      {/* Header */}
      <div className="bg-[#0D0E11] border rounded-xl px-6 py-4" style={{ borderColor: `${ACCENT}18` }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ background: `${ACCENT}12`, borderColor: `${ACCENT}25` }}>
            <Target className="w-4 h-4" style={{ color: ACCENT }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[16px] font-bold text-white tracking-tight">{META.artist_name}</h1>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded border"
                style={{ color: ACCENT, background: `${ACCENT}10`, borderColor: `${ACCENT}25` }}>
                TEAM VIEW
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded"
                style={{ color: META.status_color, background: `${META.status_color}12`, border: `1px solid ${META.status_color}20` }}>
                {META.status_label.toUpperCase()}
              </span>
            </div>
            <p className="text-[10px] font-mono text-white/25 mt-0.5 truncate">{META.strategic_focus}</p>
          </div>
          <button
            onClick={() => navigate('/catalog/app/roster')}
            className="flex items-center gap-1.5 text-[9px] font-mono text-white/25 hover:text-white/50 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Catalog Clients
          </button>
        </div>
      </div>

      {/* Sales Goals + Key Metrics */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.16em] uppercase mb-3" style={{ color: `${ACCENT}60` }}>
          01 · SALES GOALS &amp; TARGETS
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {EXPECTED_ANNUAL_OUTCOMES.map((outcome, i) => (
            <div key={i} className="bg-[#0D0E11] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[18px] font-bold" style={{ color: outcome.color }}>{outcome.value}</p>
              <p className="text-[9px] font-mono text-white/30 mt-1 leading-snug">{outcome.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaign Tasks */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.16em] uppercase mb-3" style={{ color: `${ACCENT}60` }}>
          02 · CAMPAIGN TASKS
        </p>
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.05]">
            <CheckSquare className="w-3.5 h-3.5" style={{ color: ACCENT }} />
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Active Tasks</span>
            <div className="ml-auto flex items-center gap-2">
              {flaggedTasks.length > 0 && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                  {flaggedTasks.length} flagged
                </span>
              )}
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 border border-white/[0.06]">
                {openTasks.length} open
              </span>
            </div>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {openTasks.slice(0, 6).map(task => (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3.5">
                {task.flagged && <Flag className="w-3 h-3 text-[#EF4444] shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/75 truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[8px] font-mono text-white/25">{task.assignee}</span>
                    {task.ai && <Bot className="w-2.5 h-2.5 text-white/20" />}
                    <span className="text-[8px] font-mono text-white/20">Due {task.due}</span>
                    <span className="text-[8px] font-mono px-1 py-0.5 rounded" style={{ color: ACCENT, background: `${ACCENT}10` }}>{task.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                    style={{ color: TASK_STATUS_COLOR[task.status] ?? '#6B7280', background: `${TASK_STATUS_COLOR[task.status] ?? '#6B7280'}12`, borderColor: `${TASK_STATUS_COLOR[task.status] ?? '#6B7280'}25` }}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                    style={{ color: TASK_PRIORITY_COLOR[task.priority], background: `${TASK_PRIORITY_COLOR[task.priority]}12`, borderColor: `${TASK_PRIORITY_COLOR[task.priority]}25` }}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
            {openTasks.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="text-[11px] text-white/20">No open tasks</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Release / Campaign Pipeline */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.16em] uppercase mb-3" style={{ color: `${ACCENT}60` }}>
          03 · RELEASE &amp; CAMPAIGN PIPELINE
        </p>
        <div className="space-y-3">
          {TIMELINE.map((month, mi) => (
            <div key={mi} className="bg-[#0D0E11] border border-white/[0.06] rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04]">
                <Calendar className="w-3 h-3 text-white/25" />
                <span className="text-[10px] font-mono text-white/30">{month.month}</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {month.items.map((item, ii) => (
                  <div key={ii} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <div className="flex-1">
                      <p className="text-[11px] text-white/70">{item.label}</p>
                      <p className="text-[9px] font-mono text-white/25 mt-0.5">{item.outcome}</p>
                    </div>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Priorities */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.16em] uppercase mb-3" style={{ color: `${ACCENT}60` }}>
          04 · MARKETING PRIORITIES
        </p>
        <div className="space-y-3">
          {allRecs.map((rec, i) => (
            <div key={i} className="bg-[#0D0E11] border border-white/[0.06] rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5 border"
                  style={{ background: `${rec.color}12`, borderColor: `${rec.color}25` }}>
                  <Zap className="w-3 h-3" style={{ color: rec.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                      style={{ color: rec.color, background: `${rec.color}10`, borderColor: `${rec.color}25` }}>
                      {rec.verdict}
                    </span>
                    <span className="text-[9px] font-mono text-white/30">{rec.category}</span>
                  </div>
                  <p className="text-[12px] font-semibold text-white/80 mb-1">{rec.title}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed mb-2">{rec.body}</p>
                  <div className="flex items-start gap-1.5 bg-white/[0.03] rounded-lg p-2.5">
                    <ChevronRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: rec.color }} />
                    <p className="text-[10px] text-white/50">{rec.action}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div>
        <p className="text-[9px] font-mono tracking-[0.16em] uppercase mb-3" style={{ color: `${ACCENT}60` }}>
          05 · CURRENT STATUS
        </p>
        <div className="bg-[#0D0E11] border border-white/[0.06] rounded-xl p-5">
          <p className="text-[11px] font-bold text-white/70 mb-2">{CURRENT_STATUS.headline}</p>
          <p className="text-[11px] text-white/40 leading-relaxed mb-4">{CURRENT_STATUS.summary}</p>
          <div className="space-y-2">
            {CURRENT_STATUS.dimensions.map((dim, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dim.color }} />
                <span className="text-[10px] font-mono text-white/40 w-28 shrink-0">{dim.label}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                  style={{ color: dim.color, background: `${dim.color}10`, border: `1px solid ${dim.color}20` }}>
                  {dim.status.replace('_', ' ').toUpperCase()}
                </span>
                <p className="text-[9px] text-white/25 truncate">{dim.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
