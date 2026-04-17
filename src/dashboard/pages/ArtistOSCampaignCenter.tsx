import { useState } from 'react';
import {
  Star, Megaphone, DollarSign,
  Brain, Globe, Users, Zap, RefreshCcw, TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useRole } from '../../auth/RoleContext';
import { useActiveArtist } from '../hooks/useActiveArtist';
import FinancialCommandBar from '../components/artistOS/FinancialCommandBar';
import CampaignEngine from '../components/artistOS/CampaignEngine';
import AIRepsPanel from '../components/artistOS/AIRepsPanel';
import FanIntelligenceMap from '../components/artistOS/FanIntelligenceMap';
import AudienceIntelligence from '../components/artistOS/AudienceIntelligence';
import RequestModal from '../components/artistOS/RequestModal';
import AdvanceRequestModal from '../components/artistOS/AdvanceRequestModal';

type TimeWindow = 'allTime' | 'ytd' | 'last30';

const TIER_COLORS: Record<string, string> = {
  Priority: '#EF4444',
  Rising: '#06B6D4',
  Developing: '#F59E0B',
  'New Signing': '#6366F1',
};

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function SectionHead({ index, label, children }: { index: string; label: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[9px] font-mono text-white/20 tracking-widest shrink-0">{index}</span>
      <div className="h-[1px] w-3 bg-white/[0.06] shrink-0" />
      <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-[1px] bg-white/[0.04]" />
      {children}
    </div>
  );
}

export default function ArtistOSCampaignCenter() {
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('ytd');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [advanceModalOpen, setAdvanceModalOpen] = useState(false);

  const { auth } = useAuth();
  const { roleState } = useRole();
  const activeRole = roleState.role ?? 'artist_manager';
  const activeEmail = auth.email || 'manager@gmg.ai';

  const artist = useActiveArtist();

  if (!artist) {
    return (
      <div className="flex items-center justify-center" style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist context active.</p>
      </div>
    );
  }

  const tierColor = TIER_COLORS[artist.tier] ?? '#06B6D4';

  const fin = artist.financials;
  const ytdRatio = fin.totalInvestment.ytd > 0 ? fin.ytdRevenue / fin.totalInvestment.ytd : 1;
  const highSpend = ytdRatio < 0.5 && fin.totalInvestment.ytd > 5000;

  const timeBtn = (w: TimeWindow, label: string) => (
    <button key={w} onClick={() => setTimeWindow(w)}
      className={`text-[9px] font-mono px-2.5 py-1 rounded-md transition-all ${timeWindow === w ? 'bg-white/[0.10] text-white/70' : 'text-white/30 hover:text-white/55'}`}>
      {label}
    </button>
  );

  const TimeToggle = () => (
    <div className="flex items-center gap-0.5 bg-[#0D0E11] border border-white/[0.08] rounded-lg p-0.5">
      {timeBtn('last30', 'L30')}
      {timeBtn('ytd', 'YTD')}
      {timeBtn('allTime', 'ALL')}
    </div>
  );

  return (
    <div className="p-5 space-y-7 min-h-full bg-[#08090B]">

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-2xl px-6 py-5">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2"
                style={{ background: `${artist.avatarColor}18`, borderColor: `${artist.avatarColor}35` }}>
                <span className="text-[18px] font-bold" style={{ color: artist.avatarColor }}>{artist.avatarInitials}</span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0D0E11]
                ${artist.status === 'Priority' ? 'bg-[#EF4444]' : artist.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] font-bold text-white tracking-tight">{artist.name}</h1>
                <span className="flex items-center gap-1 text-[8px] font-mono px-1.5 py-0.5 rounded border"
                  style={{ background: `${tierColor}12`, color: tierColor, borderColor: `${tierColor}30` }}>
                  <Star className="w-2 h-2" />{artist.tier}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-[12px] text-white/45">{artist.genre}</p>
                <span className="text-white/15">•</span>
                <p className="text-[12px] text-white/30">{artist.market}</p>
                <span className="text-white/15">•</span>
                <span className="text-[10px] font-mono font-bold text-[#06B6D4]" style={{ letterSpacing: '0.04em' }}>{artist.labelImprint}</span>
                <span className="text-white/10 mx-1">·</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[9px] font-mono text-[#10B981]/70">Campaign Center Live</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden lg:flex items-center gap-4">
              {[
                { label: 'Monthly Listeners', value: fmt(artist.monthlyListeners), color: '#06B6D4' },
                { label: 'Followers', value: fmt(artist.followers), color: '#10B981' },
                { label: 'Engagement', value: `${artist.fanEngagementScore}/100`, color: '#EC4899' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="text-[13px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[7.5px] font-mono text-white/20 mt-0.5 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page descriptor */}
        <div className="mt-4 pt-4 border-t border-white/[0.05]">
          <div className="flex items-center gap-6 flex-wrap">
            {[
              { icon: DollarSign, label: 'Financial Command', color: '#10B981' },
              { icon: Megaphone, label: 'Campaign Engine', color: '#06B6D4' },
              { icon: Brain, label: 'AI Rep Team', color: '#F59E0B' },
              { icon: Globe, label: 'Fan Intelligence Map', color: '#EF4444' },
              { icon: Users, label: 'Audience Intelligence', color: '#EC4899' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-1.5">
                  <Icon className="w-3 h-3 shrink-0" style={{ color: s.color }} />
                  <span className="text-[9.5px] font-mono text-white/30">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 1: FINANCIAL COMMAND BAR ── */}
      <section>
        <SectionHead index="01" label="Financial Command">
          <div className="flex items-center gap-2">
            {highSpend && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-[9px] font-mono text-[#F59E0B]">Review before spending</span>
              </div>
            )}
            <TimeToggle />
          </div>
        </SectionHead>
        <FinancialCommandBar
          artist={artist}
          timeWindow={timeWindow}
          onRequestAdvance={() => setAdvanceModalOpen(true)}
        />
      </section>

      {/* ── SECTION 2: CAMPAIGN ENGINE ── */}
      <section>
        <SectionHead index="02" label="Campaign Engine">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[9px] font-mono text-[#10B981]/60 uppercase tracking-wider">Autonomous</span>
          </div>
        </SectionHead>
        <CampaignEngine
          artist={artist}
          onRequestCampaign={() => setRequestModalOpen(true)}
          role={activeRole}
        />
      </section>

      {/* ── SECTION 3: AI REPS + REQUEST CENTER GRID ── */}
      <section>
        <SectionHead index="03" label="AI Artist Reps & Request Center" />
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
          <div className="xl:col-span-3">
            <AIRepsPanel artist={artist} />
          </div>

          {/* Request Center quick panel */}
          <div className="xl:col-span-2 bg-[#0D0E11] border border-white/[0.07] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#06B6D4]/14 border border-[#06B6D4]/25 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Request Center</h3>
                  <p className="text-[10px] text-white/30 mt-0.5">Submit directly to GMG team</p>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Marketing / Campaign Request', icon: Megaphone, color: '#06B6D4', desc: 'Campaign strategy, creative briefs, launch plans' },
                { label: 'Research Request', icon: TrendingUp, color: '#10B981', desc: 'Audience analysis, market research, competitor intel' },
                { label: 'Strategy Session', icon: Brain, color: '#F59E0B', desc: 'Book a session with your GMG strategy team' },
                { label: 'Content Feedback', icon: Star, color: '#EC4899', desc: 'Get notes on content before publishing' },
                { label: 'Advance Request', icon: DollarSign, color: '#EF4444', desc: 'Request funds against future streaming revenue', advance: true },
              ].map(r => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.label}
                    onClick={() => r.advance ? setAdvanceModalOpen(true) : setRequestModalOpen(true)}
                    className="w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center border shrink-0"
                      style={{ background: `${r.color}14`, borderColor: `${r.color}25` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: r.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-white/70 group-hover:text-white/90 transition-colors">{r.label}</p>
                      <p className="text-[9px] text-white/25 mt-0.5 truncate">{r.desc}</p>
                    </div>
                    {r.advance && (
                      <span className="text-[7px] font-mono px-1.5 py-0.5 rounded border text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20 shrink-0">RECOUPABLE</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FAN INTELLIGENCE MAP ── */}
      <section>
        <SectionHead index="04" label="Fan Intelligence Map">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-white/30" />
            <span className="text-[9px] font-mono text-white/25">10 global markets tracked</span>
          </div>
        </SectionHead>
        <FanIntelligenceMap artist={artist} />
      </section>

      {/* ── SECTION 5: AUDIENCE INTELLIGENCE + COLLABS ── */}
      <section>
        <SectionHead index="05" label="Audience Intelligence & Collaborations" />
        <AudienceIntelligence artist={artist} />
      </section>

      {/* ── ROLE VARIANTS NOTE (admin only) ── */}
      {activeRole === 'admin_team' && (
        <section>
          <SectionHead index="06" label="Admin Override Panel" />
          <div className="bg-[#0D0E11] border border-[#EF4444]/15 rounded-2xl p-5">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-semibold text-[#EF4444]/80 mb-0.5">Admin View</p>
                <p className="text-[11px] text-white/35">You have admin access. You can override campaign actions, assign requests, and adjust financial data.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Override Campaign', icon: Megaphone, color: '#06B6D4' },
                { label: 'Assign Request', icon: Users, color: '#10B981' },
                { label: 'Adjust Financial', icon: DollarSign, color: '#F59E0B' },
                { label: 'Reset All Signals', icon: RefreshCcw, color: '#EF4444' },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-mono transition-all"
                    style={{ color: a.color, background: `${a.color}08`, borderColor: `${a.color}20` }}
                  >
                    <Icon className="w-3 h-3" />
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Modals */}
      {requestModalOpen && (
        <RequestModal
          artist={artist}
          submittedByEmail={activeEmail}
          submittedByRole={activeRole}
          onClose={() => setRequestModalOpen(false)}
        />
      )}
      {advanceModalOpen && (
        <AdvanceRequestModal
          artist={artist}
          submittedByEmail={activeEmail}
          submittedByRole={activeRole}
          onClose={() => setAdvanceModalOpen(false)}
        />
      )}
    </div>
  );
}
