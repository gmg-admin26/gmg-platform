import { useState } from 'react';
import { MessageSquare, Radio, Star, Mic2, Share2, Music, ChevronRight, Bot } from 'lucide-react';

type PlaybookTag = 'ACT NOW' | 'OPPORTUNITY' | 'SCHEDULED';

interface Playbook {
  id: string;
  tag: PlaybookTag;
  title: string;
  reasoning: string;
  category: string;
  icon: React.ElementType;
  accentColor: string;
}

const PLAYBOOKS: Playbook[] = [
  {
    id: 'discord_listening',
    tag: 'ACT NOW',
    title: 'Launch Discord listening session',
    reasoning: 'Fan engagement window is open — listening sessions convert passive fans to active community members.',
    category: 'Community',
    icon: MessageSquare,
    accentColor: '#F59E0B',
  },
  {
    id: 'ig_broadcast',
    tag: 'ACT NOW',
    title: 'Activate IG Broadcast channel',
    reasoning: 'Broadcast channels reach opted-in fans directly, bypassing algorithm friction during release windows.',
    category: 'Direct Channel',
    icon: Radio,
    accentColor: '#EF4444',
  },
  {
    id: 'exclusive_drop',
    tag: 'OPPORTUNITY',
    title: 'Drop exclusive content to top fans',
    reasoning: 'Top-tier superfans respond to exclusivity signals — a targeted drop reinforces their status and loyalty.',
    category: 'Retention',
    icon: Star,
    accentColor: '#10B981',
  },
  {
    id: 'studio_snippet',
    tag: 'OPPORTUNITY',
    title: 'Share a studio process snippet',
    reasoning: 'Behind-the-scenes content consistently outperforms polished posts in organic save and share rate.',
    category: 'Content',
    icon: Mic2,
    accentColor: '#06B6D4',
  },
  {
    id: 'fan_share_prompt',
    tag: 'OPPORTUNITY',
    title: 'Prompt top fans to share new release',
    reasoning: 'Fan-amplified sharing carries higher trust signals and can trigger algorithmic uplift within 48 hours of release.',
    category: 'Amplification',
    icon: Share2,
    accentColor: '#F97316',
  },
  {
    id: 'playlist_pitch',
    tag: 'SCHEDULED',
    title: 'Pitch catalog track to editorial playlist',
    reasoning: 'Catalog sync opportunities increase when paired with an active release cycle — pitching now captures that halo.',
    category: 'Catalog',
    icon: Music,
    accentColor: '#8B5CF6',
  },
];

const TAG_STYLES: Record<PlaybookTag, { bg: string; text: string; border: string; dot: string }> = {
  'ACT NOW':    { bg: 'rgba(239,68,68,0.08)',   text: '#EF4444', border: 'rgba(239,68,68,0.2)',   dot: '#EF4444' },
  'OPPORTUNITY':{ bg: 'rgba(245,158,11,0.08)',  text: '#F59E0B', border: 'rgba(245,158,11,0.2)',  dot: '#F59E0B' },
  'SCHEDULED':  { bg: 'rgba(107,114,128,0.08)', text: '#9CA3AF', border: 'rgba(107,114,128,0.2)', dot: '#6B7280' },
};

function PlaybookCard({ playbook, isLast }: { playbook: Playbook; isLast: boolean }) {
  const [active, setActive] = useState(false);
  const tag = TAG_STYLES[playbook.tag];

  return (
    <div
      className="relative flex items-stretch gap-0"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex flex-col items-center" style={{ width: 32, flexShrink: 0 }}>
        <div
          className="w-[1px] flex-1"
          style={{
            background: active ? `${playbook.accentColor}30` : 'rgba(255,255,255,0.05)',
            transition: 'background 0.2s ease',
            minHeight: 16,
          }}
        />
        <div
          className="w-2 h-2 rounded-full shrink-0 my-0.5"
          style={{
            background: active ? playbook.accentColor : 'rgba(255,255,255,0.1)',
            boxShadow: active ? `0 0 8px ${playbook.accentColor}60` : 'none',
            transition: 'all 0.2s ease',
          }}
        />
        {!isLast && (
          <div
            className="w-[1px] flex-1"
            style={{
              background: active ? `${playbook.accentColor}30` : 'rgba(255,255,255,0.05)',
              transition: 'background 0.2s ease',
              minHeight: 16,
            }}
          />
        )}
      </div>

      <div
        className="flex-1 rounded-xl p-4 mb-2 relative overflow-hidden cursor-default"
        style={{
          background: active ? `${playbook.accentColor}06` : 'rgba(255,255,255,0.02)',
          border: `1px solid ${active ? `${playbook.accentColor}20` : 'rgba(255,255,255,0.05)'}`,
          transition: 'all 0.2s ease',
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${playbook.accentColor}${active ? '28' : '10'}, transparent)`,
            transition: 'all 0.2s ease',
          }}
        />

        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${playbook.accentColor}10`,
              border: `1px solid ${playbook.accentColor}20`,
            }}
          >
            <playbook.icon className="w-3.5 h-3.5" style={{ color: playbook.accentColor }} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-[0.1em]"
                style={{ background: tag.bg, color: tag.text, border: `1px solid ${tag.border}` }}
              >
                {playbook.tag === 'ACT NOW' && (
                  <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: tag.dot }} />
                )}
                {playbook.tag}
              </div>
              <span
                className="text-[8px] font-mono tracking-[0.08em] px-1.5 py-0.5 rounded"
                style={{ color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                {playbook.category.toUpperCase()}
              </span>
            </div>

            <p className="text-[12px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.78)' }}>
              {playbook.title}
            </p>
            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {playbook.reasoning}
            </p>
          </div>

          <ChevronRight
            className="w-3.5 h-3.5 shrink-0 mt-2.5"
            style={{ color: active ? playbook.accentColor : 'rgba(255,255,255,0.12)', transition: 'color 0.2s ease' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function AIPlaybooks() {
  const actNowCount = PLAYBOOKS.filter(p => p.tag === 'ACT NOW').length;
  const opportunityCount = PLAYBOOKS.filter(p => p.tag === 'OPPORTUNITY').length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'rgba(245,158,11,0.45)' }}
        >
          AI Playbooks
        </span>
        <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Bot className="w-2.5 h-2.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
          <span className="text-[8px] font-mono tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            STRUCTURED RECOMMENDATIONS
          </span>
        </div>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: '#080A0D', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Bot className="w-3.5 h-3.5" style={{ color: '#F59E0B' }} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Recommended Actions
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono"
              style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: '#EF4444' }} />
              {actNowCount} Act Now
            </div>
            <div
              className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono"
              style={{ background: 'rgba(245,158,11,0.06)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.15)' }}
            >
              {opportunityCount} Opportunity
            </div>
          </div>
        </div>

        <div className="p-5 grid md:grid-cols-2 gap-x-6 gap-y-0">
          {PLAYBOOKS.map((playbook, idx) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              isLast={idx === PLAYBOOKS.length - 1 || idx === PLAYBOOKS.length - 2}
            />
          ))}
        </div>

        <div
          className="px-5 py-3 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.1)' }}>
            Note
          </span>
          <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Playbooks are generated from pattern analysis — no live performance data is referenced in recommendations.
          </span>
        </div>
      </div>
    </div>
  );
}
