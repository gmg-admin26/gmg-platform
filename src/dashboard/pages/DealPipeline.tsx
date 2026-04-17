import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ChevronRight, MapPin, Shield, Star, Send, MessageSquare, Calendar, FileText, CheckCircle, Activity, Clock, Zap, ArrowUpRight, X, Mail, Slack, CalendarCheck, FilePen, Bot, UserCheck, AlertTriangle, RotateCcw, Target, Import as SortAsc } from 'lucide-react';
import {
  PIPELINE_OPPORTUNITIES, STAGE_CONFIG, STAGE_ORDER, PIPELINE_STATS,
  type PipelineOpportunity, type PipelineStage, type TimelineEvent
} from '../data/pipelineData';
import { cleanGenre } from '../utils/labelUtils';

const STAGE_FUNNEL: PipelineStage[] = [
  'Surfaced', 'Under Review', 'Outreach Sent', 'Awaiting Reply',
  'Escalated to A&R', 'Meeting Requested', 'Meeting Scheduled',
  'Agreement Ready', 'Agreement Sent', 'Contract In Progress',
  'Signed',
];

const CONTACT_STYLE = {
  Hot:  'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  Warm: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  Cold: 'bg-white/[0.05] text-white/35 border-white/[0.08]',
};

const REC_STYLE = {
  SIGN:  'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  WATCH: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  PASS:  'bg-white/[0.04] text-white/25 border-white/[0.07]',
};

function getDRSTier(score: number): { label: string; color: string; bg: string; border: string; action: string } {
  if (score >= 85) return { label: 'High Priority', color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25', action: 'Act Now' };
  if (score >= 70) return { label: 'Strong Opportunity', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25', action: 'Engage' };
  if (score >= 50) return { label: 'Developing', color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25', action: 'Monitor' };
  return { label: 'Early', color: '#6B7280', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', action: 'Watch' };
}

const TIMELINE_ICON: Record<TimelineEvent['type'], React.ElementType> = {
  scout:     Activity,
  outreach:  Mail,
  slack:     Slack,
  calendar:  CalendarCheck,
  pandadoc:  FilePen,
  ops:       Bot,
  system:    Zap,
  human:     UserCheck,
};

function TimelineBlock({ event }: { event: TimelineEvent }) {
  const Icon = TIMELINE_ICON[event.type];
  const TYPE_LABEL: Record<TimelineEvent['type'], string> = {
    scout: 'AI Scout', outreach: 'Outreach', slack: 'Slack Escalation',
    calendar: 'Calendar', pandadoc: 'PandaDoc', ops: 'Operations AI',
    system: 'System', human: 'Human A&R',
  };
  return (
    <div className="flex gap-3 relative">
      <div className="flex flex-col items-center">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
          style={{ background: `${event.color}12`, borderColor: `${event.color}25` }}>
          <Icon className="w-3 h-3" style={{ color: event.color }} />
        </div>
        <div className="w-[1px] flex-1 mt-1" style={{ background: `${event.color}18`, minHeight: 16 }} />
      </div>
      <div className="flex-1 pb-4 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
            style={{ background: `${event.color}10`, borderColor: `${event.color}20`, color: event.color }}>
            {TYPE_LABEL[event.type]}
          </span>
          <span className="text-[10px] font-semibold text-white/70">{event.actor}</span>
          <span className="text-[9px] font-mono text-white/20 ml-auto shrink-0">{event.ts}</span>
        </div>
        <p className="text-[11.5px] text-white/58 leading-relaxed">{event.text}</p>
        {event.meta && (
          <p className="text-[9.5px] font-mono text-white/28 mt-0.5">{event.meta}</p>
        )}
      </div>
    </div>
  );
}

function PipelineCard({
  opp, onClick, onAction,
}: {
  opp: PipelineOpportunity;
  onClick: () => void;
  onAction: (action: string, opp: PipelineOpportunity) => void;
}) {
  const sc = STAGE_CONFIG[opp.stage];
  const confColor = opp.confidence >= 90 ? '#10B981' : opp.confidence >= 80 ? '#F59E0B' : '#06B6D4';
  const drs = getDRSTier(opp.dealReadinessScore);

  return (
    <div
      className={`bg-[#0C0D10] border rounded-xl overflow-hidden hover:border-opacity-50 transition-all cursor-pointer group ${sc.border}`}
      onClick={onClick}
    >
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0"
            style={{ background: `${sc.dot}12`, borderColor: `${sc.dot}25` }}>
            <span className="text-[11px] font-bold" style={{ color: sc.dot }}>{opp.artistName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-bold text-white/90 truncate">{opp.artistName}</span>
              {opp.stage === 'Signed' && <CheckCircle className="w-3 h-3 text-[#10B981] shrink-0" />}
            </div>
            <div className="flex items-center gap-1 text-[9.5px] text-white/32">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{opp.market}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${sc.bg} ${sc.border}`}
              style={{ color: sc.color }}>
              {opp.stage}
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-2 h-2 shrink-0" style={{ color: drs.color }} />
              <span className="text-[9px] font-bold tabular-nums" style={{ color: drs.color }}>{opp.dealReadinessScore}</span>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-white/35 font-mono truncate">{opp.genre}</p>
      </div>

      <div className="px-4 py-2.5 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${CONTACT_STYLE[opp.contactReadiness]}`}>
            {opp.contactReadiness} Contact
          </span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${REC_STYLE[opp.recommendation]}`}>
            {opp.recommendation}
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/[0.06] text-white/30"
            style={{ background: `${confColor}08`, borderColor: `${confColor}18`, color: confColor }}>
            {opp.confidence}% conf.
          </span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${drs.bg} ${drs.border}`}
            style={{ color: drs.color }}>
            {drs.action}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] font-mono" style={{ color: '#EF4444' }}>
            <Shield className="w-2.5 h-2.5" />
            <span>{opp.aiScouts.length} AI scouts</span>
          </div>
          <span className="text-white/15">·</span>
          <div className="flex items-center gap-1 text-[9px] font-mono text-[#10B981]">
            <Users className="w-2.5 h-2.5" />
            <span>{opp.humanCoSigns.length} co-signed</span>
          </div>
          <span className="text-white/15 ml-auto">·</span>
          <span className="text-[9px] font-mono text-white/25">{opp.discoveredAgo}</span>
        </div>

        <div className="flex items-start gap-1.5 pt-0.5">
          <Zap className="w-2.5 h-2.5 text-[#F59E0B]/60 shrink-0 mt-0.5" />
          <p className="text-[10px] text-white/42 leading-snug">{opp.nextAction}</p>
        </div>
      </div>

      <div className="px-4 py-2.5 border-t border-white/[0.04] flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/28">
          <Activity className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{opp.assignedScout}</span>
        </div>
        <span className="text-white/15">·</span>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/28">
          <UserCheck className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">{opp.assignedHuman}</span>
        </div>
        <ArrowUpRight className="w-3 h-3 text-white/15 group-hover:text-white/50 transition-colors ml-auto shrink-0" />
      </div>
    </div>
  );
}

function DetailModal({ opp, onClose, onAction }: {
  opp: PipelineOpportunity;
  onClose: () => void;
  onAction: (action: string, opp: PipelineOpportunity) => void;
}) {
  const sc = STAGE_CONFIG[opp.stage];
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'outreach'>('overview');

  const ACTIONS: { label: string; icon: React.ComponentType<{ className?: string }>; color: string; key: string; disabled?: boolean }[] = [
    { label: 'Send Outreach', icon: Send, color: '#06B6D4', key: 'outreach', disabled: ['Outreach Sent','Awaiting Reply','Escalated to A&R','Meeting Requested','Meeting Scheduled','Agreement Ready','Agreement Sent','Contract In Progress','Signed'].includes(opp.stage) },
    { label: 'Escalate to A&R', icon: MessageSquare, color: '#F59E0B', key: 'escalate', disabled: ['Escalated to A&R','Meeting Requested','Meeting Scheduled','Agreement Ready','Agreement Sent','Contract In Progress','Signed'].includes(opp.stage) },
    { label: 'Request Meeting', icon: Calendar, color: '#34D399', key: 'meeting', disabled: ['Meeting Scheduled','Agreement Ready','Agreement Sent','Contract In Progress','Signed'].includes(opp.stage) },
    { label: 'Send Agreement', icon: FilePen, color: '#EC4899', key: 'agreement', disabled: opp.stage === 'Signed' },
    { label: 'Assign Ops AI', icon: Bot, color: '#8B5CF6', key: 'ops', disabled: !['Agreement Sent','Contract In Progress'].includes(opp.stage) },
    { label: 'Mark Signed', icon: CheckCircle, color: '#10B981', key: 'signed', disabled: opp.stage === 'Signed' },
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#0C0D10] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07] bg-[#0A0B0E] shrink-0">
          <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0"
            style={{ background: `${sc.dot}15`, borderColor: `${sc.dot}30` }}>
            <span className="text-[14px] font-bold" style={{ color: sc.dot }}>{opp.artistName.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-bold text-white">{opp.artistName}</p>
              {opp.stage === 'Signed' && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
              <span className="text-[8px] font-mono px-2 py-0.5 rounded border ml-1"
                style={{ background: `${sc.dot}10`, borderColor: `${sc.dot}25`, color: sc.color }}>
                {opp.stage}
              </span>
            </div>
            <p className="text-[10px] text-white/35 font-mono">{cleanGenre(opp.genre)}{opp.market ? ` · ${opp.market}` : ''}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/60 transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-0 px-5 border-b border-white/[0.06] shrink-0">
          {(['overview', 'timeline', 'outreach'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-[11px] font-mono capitalize border-b-2 transition-all ${
                activeTab === tab ? 'text-white border-[#EF4444]' : 'text-white/30 border-transparent hover:text-white/55'
              }`}>
              {tab === 'outreach' ? 'Actions' : tab}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {(() => {
                const drs = getDRSTier(opp.dealReadinessScore);
                return (
                  <div className={`p-4 rounded-xl border ${drs.bg} ${drs.border} flex items-center gap-4`}>
                    <div className="flex items-center gap-2.5">
                      <Target className="w-5 h-5 shrink-0" style={{ color: drs.color }} />
                      <div>
                        <p className="text-[9px] font-mono text-white/35 uppercase tracking-widest mb-0.5">Deal Readiness Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-[28px] font-bold tabular-nums leading-none" style={{ color: drs.color }}>{opp.dealReadinessScore}</span>
                          <span className="text-[11px] font-mono text-white/35">/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 pl-4 border-l border-white/[0.07]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${drs.bg} ${drs.border}`} style={{ color: drs.color }}>
                          {drs.label}
                        </span>
                      </div>
                      <p className="text-[12px] font-semibold" style={{ color: drs.color }}>{drs.action}</p>
                      <p className="text-[10px] text-white/38 mt-0.5">
                        {drs.action === 'Act Now' && 'High-confidence window — initiate outreach or prepare offer terms immediately'}
                        {drs.action === 'Engage' && 'Strong opportunity — schedule intro call and engage management now'}
                        {drs.action === 'Monitor' && 'Developing — track signals and prepare discovery brief'}
                        {drs.action === 'Watch' && 'Early stage — watch for velocity catalyst before engaging'}
                      </p>
                    </div>
                  </div>
                );
              })()}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Confidence', value: `${opp.confidence}%`, color: opp.confidence >= 90 ? '#10B981' : opp.confidence >= 80 ? '#F59E0B' : '#06B6D4' },
                  { label: 'Velocity Score', value: `${opp.velocityScore}`, color: '#EF4444' },
                  { label: 'Monthly Listeners', value: opp.monthlyListeners >= 1000000 ? `${(opp.monthlyListeners/1e6).toFixed(1)}M` : `${(opp.monthlyListeners/1000).toFixed(0)}K`, color: '#06B6D4' },
                  { label: 'Opportunity Window', value: opp.opportunityWindow, color: '#F59E0B' },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05]">
                    <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="text-[14px] font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                {[
                  { label: 'Label Status', value: opp.labelStatus },
                  { label: 'Contact Point', value: opp.contactPoint },
                  { label: 'Assigned Scout', value: opp.assignedScout },
                  { label: 'Assigned Human A&R', value: opp.assignedHuman },
                  ...(opp.meetingDate ? [{ label: 'Meeting Date', value: opp.meetingDate }] : []),
                  ...(opp.agreementType ? [{ label: 'Agreement Type', value: opp.agreementType }] : []),
                  ...(opp.signedDate ? [{ label: 'Signed Date', value: opp.signedDate }] : []),
                  ...(opp.opsStatus ? [{ label: 'Ops AI Status', value: opp.opsStatus }] : []),
                ].map(f => (
                  <div key={f.label} className="flex items-baseline gap-3">
                    <span className="text-[9.5px] font-mono text-white/28 uppercase tracking-widest shrink-0 w-44">{f.label}</span>
                    <span className="text-[11.5px] text-white/65">{f.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/[0.05]">
                <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-2">AI Scout Consensus</p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.aiScouts.map(s => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#EF4444]/[0.07] text-[#EF4444]/75 border border-[#EF4444]/18">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {opp.humanCoSigns.length > 0 && (
                <div className="pt-1">
                  <p className="text-[9px] font-mono text-white/28 uppercase tracking-widest mb-2">Human Co-Signs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {opp.humanCoSigns.map(s => (
                      <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-[#10B981]/[0.06] text-[#10B981]/70 border border-[#10B981]/15">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {opp.escalationReason && (
                <div className="p-3 rounded-xl bg-[#F59E0B]/[0.05] border border-[#F59E0B]/15">
                  <p className="text-[9px] font-mono text-[#F59E0B]/60 uppercase tracking-widest mb-1">Escalation Reason</p>
                  <p className="text-[11.5px] text-white/60">{opp.escalationReason}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-0">
              {opp.timeline.map((event, i) => (
                <TimelineBlock key={i} event={event} />
              ))}
            </div>
          )}

          {activeTab === 'outreach' && (
            <div className="space-y-3">
              <p className="text-[11px] text-white/40 leading-relaxed mb-2">
                Trigger workflow actions for this artist opportunity. Actions update the pipeline stage and log to the timeline.
              </p>
              {ACTIONS.map(action => (
                <button
                  key={action.key}
                  disabled={action.disabled}
                  onClick={() => { onAction(action.key, opp); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    action.disabled
                      ? 'bg-white/[0.02] border-white/[0.05] opacity-35 cursor-not-allowed'
                      : 'bg-white/[0.025] border-white/[0.07] hover:border-opacity-60 cursor-pointer'
                  }`}
                  style={action.disabled ? {} : { borderColor: `${action.color}20` }}
                >
                  <div className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0"
                    style={action.disabled ? { background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' } : { background: `${action.color}12`, borderColor: `${action.color}25` }}>
                    {(() => { const Icon = action.icon; return <Icon className="w-4 h-4" style={{ color: action.disabled ? 'rgba(255,255,255,0.2)' : action.color }} />; })()}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold" style={{ color: action.disabled ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.82)' }}>
                      {action.label}
                    </p>
                    {!action.disabled && (
                      <p className="text-[9.5px] font-mono" style={{ color: `${action.color}60` }}>
                        {action.key === 'outreach' && 'Paragon sends initial contact via identified route'}
                        {action.key === 'escalate' && 'Escalate via Slack to assigned human A&R'}
                        {action.key === 'meeting' && 'Coordinate meeting via Google Calendar'}
                        {action.key === 'agreement' && 'Send standard agreement via PandaDoc'}
                        {action.key === 'ops' && 'Hand monitoring to Operations AI agent'}
                        {action.key === 'signed' && 'Mark as signed and add to weekly signings'}
                      </p>
                    )}
                  </div>
                  {!action.disabled && <ChevronRight className="w-4 h-4 ml-auto shrink-0" style={{ color: action.color }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DealPipeline() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<PipelineOpportunity[]>(PIPELINE_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<PipelineOpportunity | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'All'>('All');
  const [sortByDRS, setSortByDRS] = useState(false);
  const [topOnly, setTopOnly] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const STAGE_NEXT: Partial<Record<PipelineStage, PipelineStage>> = {
    'Surfaced': 'Under Review',
    'Under Review': 'Outreach Sent',
    'Outreach Sent': 'Awaiting Reply',
    'Awaiting Reply': 'Escalated to A&R',
    'Escalated to A&R': 'Meeting Scheduled',
    'Meeting Requested': 'Meeting Scheduled',
    'Meeting Scheduled': 'Agreement Ready',
    'Agreement Ready': 'Agreement Sent',
    'Agreement Sent': 'Contract In Progress',
    'Contract In Progress': 'Signed',
  };

  const ACTION_STAGE: Record<string, PipelineStage> = {
    outreach: 'Outreach Sent',
    escalate: 'Escalated to A&R',
    meeting: 'Meeting Scheduled',
    agreement: 'Agreement Sent',
    ops: 'Contract In Progress',
    signed: 'Signed',
  };

  const ACTION_MESSAGE: Record<string, string> = {
    outreach: 'Outreach sent via identified contact route',
    escalate: 'Escalated to human A&R via Slack',
    meeting: 'Meeting coordination initiated via Google Calendar',
    agreement: 'Standard agreement sent via PandaDoc',
    ops: 'Operations AI assigned — monitoring contract process',
    signed: 'Marked as signed — added to weekly signings',
  };

  function handleAction(action: string, opp: PipelineOpportunity) {
    const newStage = ACTION_STAGE[action];
    if (newStage) {
      setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, stage: newStage } : o));
    }
    setActionFeedback(ACTION_MESSAGE[action]);
    setTimeout(() => setActionFeedback(null), 3500);
  }

  const filtered = (() => {
    let result = stageFilter === 'All' ? opportunities : opportunities.filter(o => o.stage === stageFilter);
    if (topOnly) result = result.filter(o => o.dealReadinessScore >= 85);
    if (sortByDRS) result = [...result].sort((a, b) => b.dealReadinessScore - a.dealReadinessScore);
    return result;
  })();

  const signed = opportunities.filter(o => o.stage === 'Signed');
  const active = opportunities.filter(o => !['Signed', 'Closed / Passed', 'Surfaced'].includes(o.stage));

  return (
    <div className="min-h-full bg-[#07080A]">
      {selectedOpp && (
        <DetailModal
          opp={selectedOpp}
          onClose={() => setSelectedOpp(null)}
          onAction={handleAction}
        />
      )}

      {actionFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl shadow-2xl backdrop-blur-sm">
          <CheckCircle className="w-4 h-4 text-[#10B981]" />
          <span className="text-[12px] font-semibold text-[#10B981]">{actionFeedback}</span>
          <button onClick={() => setActionFeedback(null)} className="ml-2 text-[#10B981]/50 hover:text-[#10B981]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="bg-[#09090D] border-b border-[#10B981]/10 px-6 py-5">
        <div className="absolute-0" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#10B981]/20 to-[#34D399]/10 border border-[#10B981]/20 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-[20px] font-bold text-white">Deal Pipeline</h1>
                <span className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                  {opportunities.filter(o => !['Closed / Passed'].includes(o.stage)).length} active
                </span>
              </div>
              <p className="text-[11px] text-white/42">AI-Assisted Signing Execution System</p>
            </div>
          </div>

          <div className="flex gap-2.5 ml-auto flex-wrap items-center">
            {[
              { label: 'Outreach Today', value: PIPELINE_STATS.outreachToday, color: '#06B6D4' },
              { label: 'Escalations', value: PIPELINE_STATS.escalationsPending, color: '#F59E0B' },
              { label: 'Meetings', value: PIPELINE_STATS.meetingsScheduled, color: '#34D399' },
              { label: 'Agreements Out', value: PIPELINE_STATS.agreementsSent, color: '#EC4899' },
              { label: 'Signed / Week', value: PIPELINE_STATS.signedThisWeek, color: '#10B981' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 px-3 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl">
                <div>
                  <p className="text-[8px] font-mono text-white/30 uppercase tracking-wider">{label}</p>
                  <p className="text-[14px] font-bold leading-tight" style={{ color }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">

        <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-4 rounded-full bg-[#10B981]" />
              <span className="text-[12px] font-bold text-white/85">From Discovery to Deal</span>
              <span className="text-[8.5px] font-mono text-white/25">// LIVE FUNNEL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${viewMode === 'list' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-white/25 hover:text-white/50'}`}>
                List
              </button>
              <button onClick={() => setViewMode('board')}
                className={`px-2.5 py-1 text-[10px] font-mono rounded transition-all ${viewMode === 'board' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' : 'text-white/25 hover:text-white/50'}`}>
                Board
              </button>
            </div>
          </div>
          <div className="flex items-center gap-0 overflow-x-auto">
            {STAGE_FUNNEL.map((stage, i) => {
              const count = opportunities.filter(o => o.stage === stage).length;
              const sc = STAGE_CONFIG[stage];
              const isActive = count > 0;
              return (
                <div key={stage} className="flex items-center min-w-0">
                  <button
                    onClick={() => setStageFilter(stageFilter === stage ? 'All' : stage)}
                    className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all min-w-[80px] ${
                      stageFilter === stage ? 'bg-white/[0.05] border border-white/[0.1]' : 'hover:bg-white/[0.03]'
                    }`}>
                    <div className={`w-7 h-7 rounded-full border flex items-center justify-center mb-1 transition-all ${
                      isActive ? '' : 'opacity-30'
                    }`} style={{ background: isActive ? `${sc.dot}15` : 'rgba(255,255,255,0.03)', borderColor: isActive ? `${sc.dot}25` : 'rgba(255,255,255,0.07)' }}>
                      <span className="text-[10px] font-bold" style={{ color: isActive ? sc.dot : 'rgba(255,255,255,0.2)' }}>{count}</span>
                    </div>
                    <span className="text-[7.5px] font-mono text-center leading-tight" style={{ color: isActive ? sc.color : 'rgba(255,255,255,0.2)' }}>
                      {stage === 'Escalated to A&R' ? 'Escalated' : stage === 'Meeting Scheduled' ? 'Meeting Set' : stage === 'Agreement Sent' ? 'Agrmt Sent' : stage === 'Contract In Progress' ? 'In Progress' : stage}
                    </span>
                  </button>
                  {i < STAGE_FUNNEL.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-white/10 shrink-0" />
                  )}
                </div>
              );
            })}
            <button onClick={() => setStageFilter('All')}
              className="ml-3 px-2.5 py-1 text-[9px] font-mono text-white/25 hover:text-white/55 border border-white/[0.06] rounded-lg transition-all">
              All
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C] flex-wrap">
              <div className="w-[3px] h-4 rounded-full bg-[#10B981]" />
              <span className="text-[13px] font-bold text-white/88">
                {stageFilter === 'All' ? 'All Opportunities' : stageFilter}
              </span>
              <span className="text-[9px] font-mono text-white/28">{filtered.length} total</span>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={() => setTopOnly(v => !v)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono rounded border transition-all ${
                    topOnly ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/25' : 'text-white/28 border-white/[0.07] hover:text-white/55'
                  }`}>
                  <Target className="w-2.5 h-2.5" />
                  Top Opportunities
                </button>
                <button
                  onClick={() => setSortByDRS(v => !v)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono rounded border transition-all ${
                    sortByDRS ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25' : 'text-white/28 border-white/[0.07] hover:text-white/55'
                  }`}>
                  <SortAsc className="w-2.5 h-2.5" />
                  Sort by DRS
                </button>
                <button onClick={() => navigate('/dashboard/rocksteady/signings')}
                  className="flex items-center gap-1 text-[10px] font-mono text-[#10B981]/60 hover:text-[#10B981] transition-colors ml-1">
                  Weekly Signings <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {filtered.map(opp => {
                const sc = STAGE_CONFIG[opp.stage];
                const confColor = opp.confidence >= 90 ? '#10B981' : opp.confidence >= 80 ? '#F59E0B' : '#06B6D4';
                const drs = getDRSTier(opp.dealReadinessScore);
                return (
                  <div key={opp.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    style={{ borderLeft: `2px solid ${sc.dot}20` }}
                    onClick={() => setSelectedOpp(opp)}>
                    <div className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0"
                      style={{ background: `${sc.dot}12`, borderColor: `${sc.dot}25` }}>
                      <span className="text-[11px] font-bold" style={{ color: sc.dot }}>{opp.artistName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-bold text-white/88">{opp.artistName}</span>
                        {opp.stage === 'Signed' && <CheckCircle className="w-3 h-3 text-[#10B981]" />}
                        <span className={`hidden sm:inline text-[7.5px] font-mono px-1.5 py-0.5 rounded border`}
                          style={{ background: `${sc.dot}10`, borderColor: `${sc.dot}20`, color: sc.color }}>
                          {opp.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-white/32">
                        <MapPin className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{opp.market}</span>
                        <span className="text-white/15">·</span>
                        <span className="hidden md:block font-mono text-white/25 truncate">{opp.genre}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 shrink-0 text-right">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="flex items-center gap-1">
                          <Target className="w-2.5 h-2.5 shrink-0" style={{ color: drs.color }} />
                          <span className="text-[13px] font-bold tabular-nums" style={{ color: drs.color }}>{opp.dealReadinessScore}</span>
                        </div>
                        <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${drs.bg} ${drs.border}`} style={{ color: drs.color }}>
                          {drs.action}
                        </span>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold" style={{ color: confColor }}>{opp.confidence}%</p>
                        <p className="text-[8.5px] font-mono text-white/22">confidence</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-[#EF4444]/60">
                          <Shield className="w-2.5 h-2.5" /><span>{opp.aiScouts.length}</span>
                        </div>
                        <p className="text-[8.5px] font-mono text-white/22">AI scouts</p>
                      </div>
                      <div className="max-w-[140px] text-right">
                        <p className="text-[10px] text-white/45 leading-snug truncate">{opp.nextAction}</p>
                        <p className="text-[8.5px] font-mono text-white/20">{opp.discoveredAgo}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/50 transition-colors shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(opp => (
              <PipelineCard
                key={opp.id}
                opp={opp}
                onClick={() => setSelectedOpp(opp)}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
