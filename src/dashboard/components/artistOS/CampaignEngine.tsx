import { useState } from 'react';
import {
  Megaphone, Play, TrendingUp, Zap, Target,
  Music, Smartphone, CheckCircle, ArrowUpRight,
  ChevronRight, DollarSign, BarChart2, AlertTriangle,
  Globe, Users, Layers, RefreshCcw,
  Info
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props {
  artist: SignedArtist;
  onRequestCampaign: () => void;
  role?: string;
}

type CampaignStatus = 'active' | 'optimizing' | 'scaling' | 'complete' | 'suggested' | 'paused';

interface Campaign {
  id: string;
  goal: string;
  name: string;
  status: CampaignStatus;
  channels: string[];
  budget: number;
  spent: number;
  audienceGrowth: string;
  streams: string;
  engagementLift: string;
  aiActions: string[];
  trend: 'up' | 'down' | 'flat';
  team?: string;
  suggestedReason?: string;
}

interface AIGuidance {
  id: string;
  message: string;
  type: 'insight' | 'warning' | 'opportunity';
  actionable?: string;
}

function fmtMoney(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const STATUS_META: Record<CampaignStatus, { color: string; label: string; pulse: boolean; bg: string; border: string; glow: string }> = {
  active:      { color: '#10B981', label: 'Active',      pulse: true,  bg: 'rgba(16,185,129,0.05)',  border: 'rgba(16,185,129,0.18)',  glow: 'rgba(16,185,129,0.08)' },
  optimizing:  { color: '#06B6D4', label: 'Optimizing',  pulse: true,  bg: 'rgba(6,182,212,0.05)',   border: 'rgba(6,182,212,0.18)',   glow: 'rgba(6,182,212,0.08)' },
  scaling:     { color: '#F59E0B', label: 'Scaling',     pulse: true,  bg: 'rgba(245,158,11,0.05)',  border: 'rgba(245,158,11,0.18)',  glow: 'rgba(245,158,11,0.06)' },
  complete:    { color: '#6B7280', label: 'Complete',    pulse: false, bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)', glow: 'transparent' },
  suggested:   { color: '#06B6D4', label: 'Suggested',   pulse: false, bg: 'rgba(6,182,212,0.04)',   border: 'rgba(6,182,212,0.15)',   glow: 'rgba(6,182,212,0.06)' },
  paused:      { color: '#EF4444', label: 'Paused',      pulse: false, bg: 'rgba(239,68,68,0.04)',   border: 'rgba(239,68,68,0.15)',   glow: 'transparent' },
};

const CHANNEL_META: Record<string, { color: string; icon: React.ElementType }> = {
  TikTok:    { color: '#06B6D4', icon: Smartphone },
  Instagram: { color: '#E1306C', icon: Smartphone },
  Spotify:   { color: '#10B981', icon: Music },
  YouTube:   { color: '#EF4444', icon: Play },
  Meta:      { color: '#3B82F6', icon: Target },
  X:         { color: '#E2E8F0', icon: BarChart2 },
};

const GUIDANCE_DATA: AIGuidance[] = [
  { id: 'g1', type: 'opportunity', message: 'Your audience is growing fastest in Brazil — up 340% this week.', actionable: 'Launch Brazil geo campaign' },
  { id: 'g2', type: 'insight', message: 'TikTok is outperforming Instagram by 3.2x on CPM-adjusted reach.' },
  { id: 'g3', type: 'warning', message: 'You should consider a release in the next 14 days while playlist momentum is hot.' },
  { id: 'g4', type: 'insight', message: 'Morning listeners (6–9am) convert to saves at 2x the daily average.' },
];

function getCampaigns(artist: SignedArtist): Campaign[] {
  return [
    {
      id: 'C-038',
      goal: 'Blow up this song',
      name: 'Night Circuit — Spotify Conversion',
      status: 'active',
      channels: ['Meta', 'Spotify', 'Instagram'],
      budget: 3000,
      spent: 1840,
      audienceGrowth: '+4,200 new listeners',
      streams: '+14,800 streams',
      engagementLift: '+28% saves rate',
      aiActions: ['Creative testing (3 variants live)', 'Budget reallocated to 6-10pm window', 'Lookalike audience expanded to UK/AU'],
      trend: 'up',
      team: 'Dana Reeves',
    },
    {
      id: 'C-039',
      goal: 'Grow fanbase',
      name: 'Brazil Geo Discovery Push',
      status: 'scaling',
      channels: ['Instagram', 'TikTok'],
      budget: 500,
      spent: 320,
      audienceGrowth: '+1,800 São Paulo followers',
      streams: '+3,100 streams',
      engagementLift: '+44% story replies',
      aiActions: ['Geo-targeted audience active', 'Influencer seeding (2 placements)', 'Spanish-language creative deployed'],
      trend: 'up',
      team: 'Dana Reeves',
    },
    {
      id: 'C-040',
      goal: 'Tour prep',
      name: `${artist.name} Vol. 2 Pre-Save`,
      status: 'paused',
      channels: ['TikTok', 'Spotify', 'Instagram'],
      budget: 2000,
      spent: 0,
      audienceGrowth: '—',
      streams: '—',
      engagementLift: '—',
      aiActions: ['Awaiting campaign activation approval'],
      trend: 'flat',
    },
    {
      id: 'S-001',
      goal: 'Grow fanbase',
      name: 'TikTok Sound Momentum Push',
      status: 'suggested',
      channels: ['TikTok'],
      budget: 800,
      spent: 0,
      audienceGrowth: 'Est. +8K–22K listeners',
      streams: 'Est. +12K streams',
      engagementLift: 'Est. +3.2x reach',
      aiActions: ['Sound is trending — 1,800 new organic uses', 'Window closes in ~6 hours'],
      trend: 'up',
      suggestedReason: 'Sound velocity peaked. Creator campaigns during sound spikes convert at 3x normal.',
    },
    {
      id: 'C-035',
      goal: 'Release launch',
      name: 'Vol. 1 Launch Campaign',
      status: 'complete',
      channels: ['Meta', 'Instagram', 'Spotify'],
      budget: 4500,
      spent: 4480,
      audienceGrowth: '+18,400 new listeners',
      streams: '+84K streams',
      engagementLift: '+61% saves',
      aiActions: ['Campaign concluded — 22-week run', 'Final report available'],
      trend: 'up',
    },
  ];
}

function GuidanceCard({ g, onAction }: { g: AIGuidance; onAction: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isWarn = g.type === 'warning';
  const isOpp  = g.type === 'opportunity';
  const color = isWarn ? '#F59E0B' : isOpp ? '#10B981' : 'rgba(255,255,255,0.3)';
  const bg    = isWarn ? 'rgba(245,158,11,0.05)' : isOpp ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.025)';
  const border = isWarn ? 'rgba(245,158,11,0.18)' : isOpp ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.07)';
  const IconComp = isWarn ? AlertTriangle : isOpp ? TrendingUp : Info;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexShrink: 0,
        gap: 10,
        padding: '10px 13px',
        borderRadius: 12,
        background: hovered ? (isOpp ? 'rgba(16,185,129,0.08)' : isWarn ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)') : bg,
        border: `1px solid ${hovered ? color + '30' : border}`,
        maxWidth: 260,
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'default',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.3)` : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <IconComp size={11} color={color} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>
        <div style={{ fontSize: 10, color: hovered ? color : color, opacity: hovered ? 0.9 : 0.7, lineHeight: 1.5 }}>{g.message}</div>
        {g.actionable && (
          <button
            onClick={onAction}
            style={{
              fontFamily: 'monospace', fontSize: 9, color: '#06B6D4',
              background: 'transparent', border: 'none', padding: 0,
              cursor: 'pointer', marginTop: 5,
              display: 'flex', alignItems: 'center', gap: 3,
            }}
          >
            {g.actionable} <ArrowUpRight size={9} color="#06B6D4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: `${color}08`,
      border: `1px solid ${color}18`,
      borderRadius: 12,
      padding: '12px 14px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }} />
      <div style={{ fontWeight: 800, fontSize: 20, color, lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.25)', marginTop: 5, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

function CampaignCard({ c, onAction, role }: { c: Campaign; onAction: () => void; role?: string }) {
  const [hovered, setHovered] = useState(false);
  const sm = STATUS_META[c.status];
  const pct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16,
        border: `1px solid ${hovered ? sm.border.replace('0.18', '0.3').replace('0.15', '0.28') : sm.border}`,
        background: hovered ? sm.glow : sm.bg,
        padding: '18px 20px',
        transition: 'all 0.22s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? `0 12px 40px rgba(0,0,0,0.35)` : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${sm.color}50, transparent)`,
        }} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 7 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {sm.pulse && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: sm.color,
                  boxShadow: `0 0 8px ${sm.color}`,
                  animation: 'ce-dot-pulse 1.8s ease-in-out infinite',
                  display: 'block',
                }} />
              )}
              <span style={{
                fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                padding: '2px 8px', borderRadius: 20,
                background: `${sm.color}12`,
                border: `1px solid ${sm.color}25`,
                color: sm.color, letterSpacing: '0.06em',
              }}>
                {sm.label.toUpperCase()}
              </span>
            </div>
            <span style={{
              fontFamily: 'monospace', fontSize: 8,
              padding: '2px 7px', borderRadius: 6,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.3)',
            }}>
              Goal: {c.goal}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.18)' }}>{c.id}</span>
            {c.team && (
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{c.team}</span>
            )}
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>{c.name}</div>
          {c.suggestedReason && (
            <div style={{ fontSize: 11, color: 'rgba(6,182,212,0.6)', marginTop: 6, lineHeight: 1.6 }}>{c.suggestedReason}</div>
          )}
        </div>
        {c.status !== 'paused' && c.status !== 'suggested' && c.trend === 'up' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <TrendingUp size={11} color="#10B981" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#10B981' }}>Performing</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Channels:</span>
        {c.channels.map(ch => {
          const cm = CHANNEL_META[ch] ?? { color: '#06B6D4', icon: Globe };
          const Icon = cm.icon;
          return (
            <span key={ch} style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'monospace', fontSize: 9,
              padding: '2px 8px', borderRadius: 6,
              background: `${cm.color}0F`,
              border: `1px solid ${cm.color}22`,
              color: cm.color,
            }}>
              <Icon size={9} color={cm.color} />
              {ch}
            </span>
          );
        })}
      </div>

      {c.status !== 'paused' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {[
            { label: 'Audience Growth', value: c.audienceGrowth, icon: Users, color: '#10B981' },
            { label: 'Streams', value: c.streams, icon: Music, color: '#06B6D4' },
            { label: 'Engagement Lift', value: c.engagementLift, icon: ArrowUpRight, color: '#F59E0B' },
          ].map(m => {
            const Icon = m.icon;
            const isEmpty = m.value === '—';
            return (
              <div key={m.label} style={{
                background: isEmpty ? 'rgba(255,255,255,0.02)' : `${m.color}07`,
                border: `1px solid ${isEmpty ? 'rgba(255,255,255,0.06)' : m.color + '15'}`,
                borderRadius: 10,
                padding: '10px 11px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <Icon size={10} color={isEmpty ? 'rgba(255,255,255,0.2)' : m.color} />
                  <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{m.label}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 12, color: isEmpty ? 'rgba(255,255,255,0.18)' : m.color, lineHeight: 1 }}>{m.value}</div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Zap size={10} color={sm.color} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: `${sm.color}70`, textTransform: 'uppercase', letterSpacing: '0.07em' }}>AI Actions</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {c.aiActions.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: `${sm.color}50`, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)', lineHeight: 1.5 }}>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {c.status !== 'suggested' && c.budget > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>BUDGET</span>
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.38)' }}>
              {fmtMoney(c.spent)} / {fmtMoney(c.budget)} · {pct}%
            </span>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: pct > 85 ? 'linear-gradient(90deg,#EF4444,#F59E0B)' : pct > 60 ? 'linear-gradient(90deg,#F59E0B,#F59E0B80)' : `linear-gradient(90deg,${sm.color},${sm.color}60)`,
              borderRadius: 4,
              boxShadow: `0 0 8px ${pct > 85 ? '#EF4444' : sm.color}40`,
              transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
            }} />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {c.status === 'suggested' ? (
          <>
            <button
              onClick={onAction}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
                padding: '7px 14px', borderRadius: 9,
                color: '#06B6D4',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.25)',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <Play size={10} color="#06B6D4" />
              Activate Campaign
              <ChevronRight size={10} color="#06B6D4" />
            </button>
            {c.budget > 0 && (
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <DollarSign size={9} color="rgba(255,255,255,0.22)" />
                Est. {fmtMoney(c.budget)}
              </span>
            )}
          </>
        ) : c.status === 'paused' ? (
          <button
            onClick={onAction}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'monospace', fontSize: 10,
              padding: '7px 14px', borderRadius: 9,
              color: '#F59E0B',
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
              cursor: 'pointer',
            }}
          >
            <RefreshCcw size={10} color="#F59E0B" />
            Request Activation
          </button>
        ) : c.status === 'complete' ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.22)' }}>
            <CheckCircle size={11} color="#10B981" />
            Concluded — {c.budget > 0 ? fmtMoney(c.budget) : ''} total spend
          </span>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981',
                animation: 'ce-dot-pulse 1.8s ease-in-out infinite',
                display: 'block',
              }} />
              System is running
            </div>
            {role === 'admin_team' && (
              <button
                onClick={onAction}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontFamily: 'monospace', fontSize: 9,
                  padding: '5px 10px', borderRadius: 7,
                  color: 'rgba(255,255,255,0.35)',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                }}
              >
                <Layers size={10} color="rgba(255,255,255,0.35)" />
                Admin Override
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CampaignEngine({ artist, onRequestCampaign, role }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'suggested' | 'completed'>('active');
  const campaigns = getCampaigns(artist);

  const active = campaigns.filter(c => ['active', 'scaling', 'optimizing', 'paused'].includes(c.status));
  const suggested = campaigns.filter(c => c.status === 'suggested');
  const completed = campaigns.filter(c => c.status === 'complete');

  const activeBudget = active.reduce((s, c) => s + c.budget, 0);
  const activeSpent = active.filter(c => c.status !== 'paused').reduce((s, c) => s + c.spent, 0);
  const liveCount = campaigns.filter(c => ['active', 'optimizing', 'scaling'].includes(c.status)).length;

  const displayList = activeTab === 'active' ? active : activeTab === 'suggested' ? suggested : completed;

  return (
    <div style={{
      background: '#0D0E11',
      border: '1px solid rgba(6,182,212,0.18)',
      borderRadius: 20,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes ce-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
        @keyframes ce-guidance-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ce-tab-btn:hover { color: rgba(255,255,255,0.65) !important; }
        .ce-new-btn:hover { background: rgba(6,182,212,0.18) !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(6,182,212,0.12); }
        .ce-add-btn:hover { border-color: rgba(255,255,255,0.22) !important; color: rgba(255,255,255,0.55) !important; }
      `}</style>

      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
      }} />

      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 11,
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Megaphone size={16} color="#06B6D4" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>Campaigns That Run Themselves</span>
                {liveCount > 0 && (
                  <span style={{
                    fontFamily: 'monospace', fontSize: 8, fontWeight: 700,
                    padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.22)',
                    color: '#10B981',
                    animation: 'ce-dot-pulse 2s ease-in-out infinite',
                    letterSpacing: '0.06em',
                  }}>
                    {liveCount} LIVE
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>You choose the goal. The system executes.</div>
            </div>
          </div>
          <button
            onClick={onRequestCampaign}
            className="ce-new-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 16px', borderRadius: 11,
              background: 'rgba(6,182,212,0.1)',
              border: '1px solid rgba(6,182,212,0.28)',
              color: '#06B6D4',
              fontSize: 11, fontWeight: 700,
              cursor: 'pointer', flexShrink: 0,
              transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <Zap size={13} color="#06B6D4" />
            New Campaign
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
          {GUIDANCE_DATA.map((g, i) => (
            <div key={g.id} style={{ animation: `ce-guidance-in 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both` }}>
              <GuidanceCard g={g} onAction={onRequestCampaign} />
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          <StatPill label="Live Now" value={liveCount.toString()} color="#10B981" />
          <StatPill label="Active Budget" value={fmtMoney(activeBudget)} color="#06B6D4" />
          <StatPill label="Deployed" value={fmtMoney(activeSpent)} color="#F59E0B" />
          <StatPill label="Suggested" value={suggested.length.toString()} color="#EF4444" />
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          { key: 'active' as const, label: 'Active Campaigns', count: active.length },
          { key: 'suggested' as const, label: 'AI Suggested', count: suggested.length },
          { key: 'completed' as const, label: 'Completed', count: completed.length },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="ce-tab-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '12px 20px',
              fontSize: 11, fontWeight: activeTab === t.key ? 600 : 400,
              color: activeTab === t.key ? '#fff' : 'rgba(255,255,255,0.3)',
              background: 'transparent', border: 'none',
              borderBottom: activeTab === t.key ? '2px solid #06B6D4' : '2px solid transparent',
              marginBottom: -1,
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span style={{
                fontFamily: 'monospace', fontSize: 9,
                padding: '1px 7px', borderRadius: 20,
                background: activeTab === t.key ? 'rgba(6,182,212,0.18)' : 'rgba(255,255,255,0.05)',
                color: activeTab === t.key ? '#06B6D4' : 'rgba(255,255,255,0.28)',
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {displayList.map(c => (
          <CampaignCard key={c.id} c={c} onAction={onRequestCampaign} role={role} />
        ))}

        <button
          onClick={onRequestCampaign}
          className="ce-add-btn"
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: 14,
            background: 'transparent',
            color: 'rgba(255,255,255,0.28)',
            fontSize: 11,
            cursor: 'pointer',
            transition: 'all 0.18s',
          }}
        >
          <Megaphone size={13} color="rgba(255,255,255,0.28)" />
          Request New Campaign
        </button>
      </div>
    </div>
  );
}
