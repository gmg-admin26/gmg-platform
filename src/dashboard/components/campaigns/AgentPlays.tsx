import { useState } from 'react';
import { Zap, TrendingUp, Music, Users, BarChart2, ChevronRight, Clock, Play } from 'lucide-react';

interface AgentPlay {
  id: string;
  name: string;
  agentTag: string;
  desc: string;
  steps: string[];
  expectedLift: string;
  timeToActivate: string;
  budget: string;
  channels: string[];
  priority: 'critical' | 'high' | 'medium';
  color: string;
  Icon: React.ElementType;
  liveSignal?: string;
}

const AGENT_PLAYS: AgentPlay[] = [
  {
    id: 'momentum-blitz',
    name: 'Momentum Blitz',
    agentTag: 'Agent: Signal Amplifier',
    desc: 'Detected a stream velocity spike on Flagpole Sitta over the last 72h. This play turns that signal into a full-stack activation before it fades.',
    steps: ['Surface trending clips to creator network', 'Boost IG Reels + TikTok with top performing audio', 'Push Spotify editorial pitch with velocity data', 'Fire fan engagement sequence to top 5% listeners'],
    expectedLift: '+35% streams in 14 days',
    timeToActivate: '48h',
    budget: '$4,000–$8,000',
    channels: ['TikTok', 'Instagram', 'Spotify', 'Creator'],
    priority: 'critical',
    color: '#EF4444',
    Icon: Zap,
    liveSignal: 'Stream velocity +22% in last 72h',
  },
  {
    id: 'brazil-surge',
    name: 'Brazil Surge Play',
    agentTag: 'Agent: Geo Intelligence',
    desc: 'São Paulo and Rio are seeing 50%+ growth. This play maximizes the Brazil cluster before competitors enter the market.',
    steps: ['Launch geo-targeted Meta ads in São Paulo + Rio', 'Seed local Brazilian TikTok creator network', 'Submit to Brazilian editorial playlist queues', 'Run Portuguese social engagement campaign'],
    expectedLift: '+44% in Brazil markets',
    timeToActivate: '72h',
    budget: '$3,500–$6,000',
    channels: ['Meta', 'TikTok', 'Local Creator', 'Spotify'],
    priority: 'critical',
    color: '#10B981',
    Icon: TrendingUp,
    liveSignal: 'Brazil cluster growing +50% week over week',
  },
  {
    id: 'presave-sprint',
    name: 'Pre-Save Conversion Sprint',
    agentTag: 'Agent: Release Intel',
    desc: 'Move Along (Deluxe) drops in 63 days. Current 12.4K pre-saves are 38% above benchmark — this play pushes to 25K before release week.',
    steps: ['Launch pre-save story sequence across IG + TikTok', 'Fan DM outreach to top 2K followers', 'Creator seeding with pre-save hooks', 'Countdown content campaign — 7 days of assets'],
    expectedLift: '+28% save conversion → 25K pre-saves',
    timeToActivate: '24h',
    budget: '$2,500–$5,000',
    channels: ['Spotify', 'IG Stories', 'TikTok', 'DM'],
    priority: 'high',
    color: '#EC4899',
    Icon: Music,
    liveSignal: '63 days to release — optimal window now',
  },
  {
    id: 'fan-reactivation',
    name: 'Dormant Fan Reactivation',
    agentTag: 'Agent: Fan Intelligence',
    desc: 'AI identified 48K fans who engaged 45+ days ago and have gone cold. This play re-ignites them before they churn permanently.',
    steps: ['Surface dormant fan profiles by platform', 'Build personalized re-engagement content series', 'Fire retargeted ad sequences at lapsed listeners', 'Launch comment prompt campaign to drive return'],
    expectedLift: 'Recover 15–22K dormant fans',
    timeToActivate: '48h',
    budget: '$2,000–$4,000',
    channels: ['Instagram', 'TikTok', 'Meta Ads', 'Community'],
    priority: 'high',
    color: '#06B6D4',
    Icon: Users,
    liveSignal: '48K fans dormant 45+ days',
  },
  {
    id: 'catalog-reignite',
    name: 'Catalog Reignite Play',
    agentTag: 'Agent: Catalog Intel',
    desc: 'Move Along and Flagpole Sitta are being picked up in nostalgia + throwback content cycles. Push catalog before the trend window closes.',
    steps: ['Seed nostalgia short-form content with catalog cuts', 'Submit to throwback + 00s playlist targets', 'Creator briefing with "early 2000s" angle', 'Story Q&A series — era content engagement'],
    expectedLift: '+18% catalog streams',
    timeToActivate: '48h',
    budget: '$1,800–$3,500',
    channels: ['TikTok', 'Spotify', 'IG Reels', 'Creator'],
    priority: 'medium',
    color: '#F59E0B',
    Icon: BarChart2,
  },
];

const PRIORITY_STYLES: Record<string, React.CSSProperties> = {
  critical: { color: '#EF4444', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' },
  high: { color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' },
  medium: { color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' },
};

function AgentPlayCard({ play, onActivate }: { play: AgentPlay; onActivate: (play: AgentPlay) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.015)', border: `1px solid ${expanded ? `${play.color}25` : 'rgba(255,255,255,0.07)'}`,
      borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
    }}>
      <div
        style={{ padding: '16px 18px', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${play.color}12`, border: `1px solid ${play.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
              <play.Icon size={15} color={play.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{play.name}</h4>
                <span style={{ fontSize: 8, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, ...PRIORITY_STYLES[play.priority], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {play.priority}
                </span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20, color: `${play.color}`, background: `${play.color}0D`, border: `1px solid ${play.color}20` }}>
                  {play.agentTag}
                </span>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{play.desc}</p>
              {play.liveSignal && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', color: play.color, background: `${play.color}0A`, border: `1px solid ${play.color}20`, borderRadius: 20, padding: '3px 10px' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: play.color, animation: 'pulse 1.5s infinite' }} />
                  {play.liveSignal}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 1px', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Lift</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#10B981' }}>{play.expectedLift}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 1px', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Activate</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#06B6D4' }}>{play.timeToActivate}</p>
              </div>
            </div>
            <ChevronRight size={14} color="rgba(255,255,255,0.3)" style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: '0.2s' }} />
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, padding: '14px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Play Steps</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {play.steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span style={{ fontSize: 10, color: play.color, fontFamily: 'monospace', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Channels</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {play.channels.map(ch => (
                    <span key={ch} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)' }}>{ch}</span>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 4px', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>Budget Range</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff' }}>{play.budget}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: `${play.color}06`, border: `1px solid ${play.color}15`, borderRadius: 10, padding: '9px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Expected Lift</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: play.color }}>{play.expectedLift}</p>
                </div>
                <div style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)', borderRadius: 10, padding: '9px 12px' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Time to Live</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={10} color="#06B6D4" />
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#06B6D4' }}>{play.timeToActivate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              style={{ flex: 1, fontSize: 11, padding: '9px', borderRadius: 9, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}
              onClick={() => setExpanded(false)}
            >
              Queue With Reps
            </button>
            <button
              onClick={() => onActivate(play)}
              style={{ flex: 2, fontSize: 12, padding: '9px 14px', borderRadius: 9, cursor: 'pointer', background: `${play.color}16`, border: `1px solid ${play.color}40`, color: play.color, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <Play size={12} /> Activate This Play
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentPlaysSection({ onActivatePlay }: { onActivatePlay: () => void }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="#F59E0B" />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Agent-Built Campaign Plays</h3>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Artist OS agents analyzed your signals and built these plays — ready to activate</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '5px 11px', borderRadius: 20, color: '#EF4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
            2 Critical
          </span>
          <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '5px 11px', borderRadius: 20, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            2 High Priority
          </span>
          <button
            onClick={onActivatePlay}
            style={{ fontSize: 11, padding: '6px 14px', borderRadius: 9, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Zap size={11} /> Launch Best Play
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {AGENT_PLAYS.map(play => (
          <AgentPlayCard key={play.id} play={play} onActivate={onActivatePlay} />
        ))}
      </div>
    </div>
  );
}
