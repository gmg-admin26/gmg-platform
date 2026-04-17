import { useState } from 'react';
import {
  Megaphone, Play, Pause, TrendingUp, TrendingDown, AlertTriangle,
  Zap, Target, Globe, Music, Smartphone, ShoppingBag, Clock,
  ArrowUpRight, ChevronRight, DollarSign, BarChart2, Info
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props {
  artist: SignedArtist;
  onRequestCampaign: () => void;
}

type CampaignStatus = 'planning' | 'active' | 'scaling' | 'ending' | 'paused';

interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  platform: string;
  budget: number;
  spent: number;
  ctr: string;
  streams: number;
  trend: 'up' | 'down' | 'flat';
  team?: string;
}

interface AIAction {
  id: string;
  action: string;
  why: string;
  impact: string;
  urgency: 'critical' | 'high' | 'medium';
  estimatedCost: string;
  category: string;
}

interface Opportunity {
  id: string;
  type: string;
  title: string;
  detail: string;
  platform: string;
  urgency: string;
  cta: string;
}

interface Guardrail {
  type: 'warning' | 'info';
  message: string;
}

const CAMPAIGN_STATUS_META: Record<CampaignStatus, { color: string; label: string; pulse: boolean }> = {
  planning: { color: '#06B6D4', label: 'Planning', pulse: false },
  active:   { color: '#10B981', label: 'Active', pulse: true },
  scaling:  { color: '#F59E0B', label: 'Scaling', pulse: true },
  ending:   { color: '#6B7280', label: 'Winding Down', pulse: false },
  paused:   { color: '#EF4444', label: 'Paused', pulse: false },
};

const PLATFORM_COLOR: Record<string, string> = {
  Meta: '#3B82F6', Instagram: '#E1306C', TikTok: '#06B6D4',
  Spotify: '#10B981', YouTube: '#EF4444', X: '#FFFFFF',
};

function fmtMoney(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

function getArtistCampaigns(artist: SignedArtist): Campaign[] {
  return [
    { id: 'C-038', name: 'Night Circuit — Spotify Conversion', status: 'active', platform: 'Meta', budget: 3000, spent: 1840, ctr: '3.4%', streams: 14800, trend: 'up', team: 'Dana Reeves' },
    { id: 'C-039', name: 'Brazil Geo Push', status: 'scaling', platform: 'Instagram', budget: 500, spent: 320, ctr: '2.1%', streams: 3100, trend: 'up', team: 'Dana Reeves' },
    { id: 'C-040', name: `${artist.name} Vol. 2 Pre-Save`, status: 'planning', platform: 'TikTok', budget: 2000, spent: 0, ctr: '—', streams: 0, trend: 'flat' },
  ];
}

function getAIActions(artist: SignedArtist): AIAction[] {
  return [
    {
      id: 'ai-1', urgency: 'critical',
      action: 'Post a TikTok NOW using your trending sound',
      why: 'Sound velocity is up 1,800 uses. You have a 6-hour window before peak cools.',
      impact: '+12K–40K new listeners',
      estimatedCost: '$0',
      category: 'Content',
    },
    {
      id: 'ai-2', urgency: 'high',
      action: `Run a $300 Instagram ad targeting Brazil`,
      why: `São Paulo is your fastest growing city (+340%). Discovery window is open.`,
      impact: '+3,000–6,000 streams',
      estimatedCost: '$300',
      category: 'Ad Spend',
    },
    {
      id: 'ai-3', urgency: 'high',
      action: 'Activate Vol. 2 Pre-Save Campaign',
      why: 'Release is 37 days out. Pre-save campaigns that launch 30+ days early perform 22% better.',
      impact: '+22% pre-save conversion',
      estimatedCost: '$2,000 budget ready',
      category: 'Release',
    },
    {
      id: 'ai-4', urgency: 'medium',
      action: 'Schedule BTS content this week',
      why: 'Fan engagement peaks in the 4–6 week window before release drops.',
      impact: '+18% engagement rate',
      estimatedCost: '$0',
      category: 'Content',
    },
  ];
}

function getOpportunities(artist: SignedArtist): Opportunity[] {
  return [
    { id: 'op-1', type: 'geo', title: 'Brazil Discovery Window', detail: 'São Paulo is your #3 city — blog feature created a short-lived discovery window.', platform: 'Instagram', urgency: 'Expires in ~5 days', cta: 'Request Ad Spend' },
    { id: 'op-2', type: 'platform', title: 'TikTok Sound Momentum', detail: 'Your sound has 1,800 new uses. Organic reach is peaking — creator content converts at 3x.', platform: 'TikTok', urgency: 'Expires in ~6 hours', cta: 'Schedule Content' },
    { id: 'op-3', type: 'platform', title: 'Spotify Editorial Window', detail: '"Night Circuit" added to 12 playlists. Submit Vol. 2 for editorial consideration now.', platform: 'Spotify', urgency: 'Ongoing', cta: 'Submit Pitch' },
  ];
}

function getGuardrails(artist: SignedArtist): Guardrail[] {
  const rails: Guardrail[] = [];
  const ytdRevenue = artist.financials.ytdRevenue;
  const ytdInvestment = artist.financials.totalInvestment.ytd;
  const ratio = ytdInvestment > 0 ? ytdRevenue / ytdInvestment : 1;

  if (ratio < 0.5) {
    rails.push({ type: 'warning', message: `High spend relative to revenue — YTD return is ${Math.round(ratio * 100)}¢ per $1 invested. Review before adding new spend.` });
  }
  if (artist.fanEngagementScore < 50) {
    rails.push({ type: 'warning', message: 'Low engagement trend detected. Organic growth signals should improve before scaling paid spend.' });
  }
  if (artist.financials.recoupableBalance > artist.financials.ytdRevenue * 2) {
    rails.push({ type: 'info', message: `Recoupable balance is ${((artist.financials.recoupableBalance / Math.max(ytdRevenue, 1))).toFixed(1)}x YTD revenue. Additional recoupable spend extends timeline to profitability.` });
  }
  return rails;
}

const PLATFORM_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  TikTok: Smartphone, Instagram: Smartphone, Meta: Target,
  Spotify: Music, YouTube: Play,
};

export default function MarketingCenterpiece({ artist, onRequestCampaign }: Props) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'actions' | 'opportunities'>('campaigns');
  const campaigns = getArtistCampaigns(artist);
  const aiActions = getAIActions(artist);
  const opportunities = getOpportunities(artist);
  const guardrails = getGuardrails(artist);

  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'scaling');
  const totalActiveBudget = activeCampaigns.reduce((s, c) => s + c.budget, 0);
  const totalSpent = activeCampaigns.reduce((s, c) => s + c.spent, 0);

  return (
    <div className="bg-[#0D0E11] border border-[#06B6D4]/20 rounded-2xl overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent" />

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#06B6D4]/14 border border-[#06B6D4]/25 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <h2 className="text-[16px] font-bold text-white tracking-tight">Marketing & Campaign Center</h2>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20 animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-white/35 ml-10.5">The operational brain for {artist.name}'s growth</p>
          </div>
          <button
            onClick={onRequestCampaign}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#06B6D4]/14 border border-[#06B6D4]/30 text-[#06B6D4] text-[11px] font-semibold hover:bg-[#06B6D4]/22 transition-all shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            Submit Request
          </button>
        </div>

        {/* Guardrail warnings */}
        {guardrails.length > 0 && (
          <div className="mt-4 space-y-2">
            {guardrails.map((g, i) => (
              <div key={i} className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl text-[11px] leading-snug ${
                g.type === 'warning'
                  ? 'bg-[#F59E0B]/06 border border-[#F59E0B]/20 text-[#F59E0B]/80'
                  : 'bg-[#06B6D4]/06 border border-[#06B6D4]/18 text-[#06B6D4]/70'
              }`}>
                {g.type === 'warning'
                  ? <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  : <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                }
                <span>{g.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Active Campaigns', value: activeCampaigns.length.toString(), color: '#10B981' },
            { label: 'Active Budget', value: fmtMoney(totalActiveBudget), color: '#06B6D4' },
            { label: 'Spent to Date', value: fmtMoney(totalSpent), color: '#F59E0B' },
            { label: 'AI Actions', value: aiActions.filter(a => a.urgency === 'critical' || a.urgency === 'high').length.toString(), color: '#EF4444' },
          ].map(s => (
            <div key={s.label} className="bg-black/30 border border-white/[0.05] rounded-xl p-3">
              <p className="text-[18px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[8.5px] font-mono text-white/25 uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/[0.06]">
        {([
          { key: 'campaigns', label: 'Active Campaigns', count: activeCampaigns.length },
          { key: 'actions', label: 'AI Recommended Actions', count: aiActions.filter(a => a.urgency !== 'medium').length },
          { key: 'opportunities', label: 'Campaign Opportunities', count: opportunities.length },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-5 py-3 text-[11px] font-medium transition-all border-b-2 -mb-px ${
              activeTab === t.key
                ? 'text-white border-[#06B6D4]'
                : 'text-white/35 border-transparent hover:text-white/55'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${
                activeTab === t.key ? 'bg-[#06B6D4]/20 text-[#06B6D4]' : 'bg-white/[0.06] text-white/30'
              }`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Active Campaigns */}
      {activeTab === 'campaigns' && (
        <div className="p-5 space-y-3">
          {campaigns.map(c => {
            const sm = CAMPAIGN_STATUS_META[c.status];
            const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
            const pColor = PLATFORM_COLOR[c.platform] ?? '#06B6D4';
            const PlatformIcon = PLATFORM_ICON[c.platform] ?? Target;
            return (
              <div key={c.id} className="bg-black/25 border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {sm.pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: sm.color }} />}
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                          style={{ color: sm.color, background: `${sm.color}10`, borderColor: `${sm.color}25` }}>
                          {sm.label}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: pColor, background: `${pColor}10`, borderColor: `${pColor}22` }}>
                        {c.platform}
                      </span>
                      {c.team && <span className="text-[9px] font-mono text-white/25">{c.team}</span>}
                    </div>
                    <p className="text-[13px] font-semibold text-white/85">{c.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {c.ctr !== '—' ? (
                      <>
                        <p className="text-[12px] font-mono text-[#10B981]">{c.ctr} CTR</p>
                        <p className="text-[9px] font-mono text-white/30 mt-0.5">{c.streams.toLocaleString()} streams</p>
                      </>
                    ) : (
                      <p className="text-[11px] font-mono text-white/25">Not yet launched</p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-mono text-white/25">Budget utilization</span>
                    <span className="text-[9px] font-mono text-white/40">{fmtMoney(c.spent)} / {fmtMoney(c.budget)} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: pct > 85 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#06B6D4' }} />
                  </div>
                </div>

                {c.status === 'planning' && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-white/30">Ready to launch when approved</span>
                    <button
                      onClick={onRequestCampaign}
                      className="text-[10px] font-mono text-[#06B6D4] px-2.5 py-1 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 hover:bg-[#06B6D4]/18 transition-colors"
                    >
                      Request Activation →
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={onRequestCampaign}
            className="w-full border border-dashed border-white/[0.10] rounded-xl py-3 text-[11px] text-white/30 hover:text-white/55 hover:border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Megaphone className="w-3.5 h-3.5" />
            Request New Campaign
          </button>
        </div>
      )}

      {/* Tab: AI Actions */}
      {activeTab === 'actions' && (
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Prioritized by urgency and expected impact</span>
          </div>
          {aiActions.map(a => {
            const urgencyMeta = {
              critical: { color: '#EF4444', bg: 'bg-[#EF4444]/08', border: 'border-[#EF4444]/20', label: 'Critical' },
              high:     { color: '#F59E0B', bg: 'bg-[#F59E0B]/08', border: 'border-[#F59E0B]/20', label: 'High' },
              medium:   { color: '#06B6D4', bg: 'bg-[#06B6D4]/06', border: 'border-[#06B6D4]/15', label: 'Medium' },
            }[a.urgency];
            return (
              <div key={a.id} className={`rounded-xl p-4 border ${urgencyMeta.bg} ${urgencyMeta.border}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: urgencyMeta.color, background: `${urgencyMeta.color}14`, borderColor: `${urgencyMeta.color}28` }}>
                        {urgencyMeta.label}
                      </span>
                      <span className="text-[8px] font-mono text-white/25 px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.07]">
                        {a.category}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-white/88 leading-snug">{a.action}</p>
                    <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">{a.why}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-[#10B981]" />
                        <span className="text-[10px] font-mono text-[#10B981]">{a.impact}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] font-mono text-white/40">{a.estimatedCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {a.estimatedCost !== '$0' ? (
                    <button
                      onClick={onRequestCampaign}
                      className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg border transition-all"
                      style={{ color: urgencyMeta.color, background: `${urgencyMeta.color}10`, borderColor: `${urgencyMeta.color}25` }}
                    >
                      Submit Spend Request
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-white/25 italic">No budget needed — take action directly</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Opportunities */}
      {activeTab === 'opportunities' && (
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">Trend-based · Geo opportunities · Platform-specific</span>
          </div>
          {opportunities.map(op => {
            const pColor = PLATFORM_COLOR[op.platform] ?? '#06B6D4';
            return (
              <div key={op.id} className="bg-black/25 border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.12] transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: pColor, background: `${pColor}10`, borderColor: `${pColor}22` }}>
                        {op.platform}
                      </span>
                      <span className="text-[9px] font-mono text-white/25 uppercase tracking-wider">{op.type.toUpperCase()}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-white/85">{op.title}</p>
                    <p className="text-[11px] text-white/40 mt-1.5 leading-relaxed">{op.detail}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Clock className="w-3 h-3 text-white/25" />
                      <span className="text-[9px] font-mono text-white/30">{op.urgency}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onRequestCampaign}
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-lg text-[#06B6D4] bg-[#06B6D4]/10 border border-[#06B6D4]/20 hover:bg-[#06B6D4]/18 transition-all"
                >
                  {op.cta}
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
