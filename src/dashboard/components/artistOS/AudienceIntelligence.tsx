import { useState } from 'react';
import {
  Users, Music, TrendingUp, Heart, Clock, Headphones,
  ArrowUpRight, ChevronRight, Star, Zap, Send, CheckCircle, X
} from 'lucide-react';
import type { SignedArtist } from '../../data/artistRosterData';

interface Props {
  artist: SignedArtist;
}

interface AgeGroup {
  range: string;
  pct: number;
  color: string;
}

interface CollabSuggestion {
  id: string;
  name: string;
  genre: string;
  sharedAudience: string;
  matchScore: number;
  collabType: 'Feature' | 'Production' | 'Writing' | 'Tour';
  why: string;
  color: string;
  initials: string;
}

const AGE_DATA: AgeGroup[] = [
  { range: '13–17', pct: 8,  color: '#06B6D4' },
  { range: '18–24', pct: 34, color: '#10B981' },
  { range: '25–34', pct: 38, color: '#F59E0B' },
  { range: '35–44', pct: 14, color: '#EF4444' },
  { range: '45+',   pct: 6,  color: '#6B7280' },
];

const GENDER_DATA = [
  { label: 'Male',   pct: 52, color: '#06B6D4' },
  { label: 'Female', pct: 44, color: '#EC4899' },
  { label: 'Other',  pct: 4,  color: '#6B7280' },
];

const LISTENING_HABITS = [
  { label: 'Peak Hours', value: '6–9am, 8–11pm', icon: Clock, color: '#06B6D4' },
  { label: 'Avg Session', value: '3.4 songs', icon: Headphones, color: '#10B981' },
  { label: 'Repeat Rate', value: '62%', icon: Heart, color: '#EC4899' },
  { label: 'Playlist Saves', value: '38%', icon: Music, color: '#F59E0B' },
];

const FANS_ALSO_LIKE = [
  { category: 'Artists', items: ['Kaytranada', 'Blood Orange', 'SZA', 'Frank Ocean', 'Syd', 'Arca'] },
  { category: 'Producers', items: ['Sounwave', 'Metro Boomin', 'Vegyn', 'Clams Casino', 'Arca'] },
  { category: 'Songwriters', items: ['Julia Michaels', 'Tobias Jesso Jr.', 'Nao', 'serpentwithfeet'] },
];

const COLLAB_SUGGESTIONS: CollabSuggestion[] = [
  {
    id: 'c1',
    name: 'Luma Night',
    genre: 'Electronic Soul',
    sharedAudience: '62% audience overlap',
    matchScore: 94,
    collabType: 'Feature',
    why: 'Similar listener demographics and growing in the same cities. Her fanbase skews 22–30, directly matching your core.',
    color: '#10B981',
    initials: 'LN',
  },
  {
    id: 'c2',
    name: 'Kelvin Mode',
    genre: 'Alt R&B',
    sharedAudience: '54% audience overlap',
    matchScore: 88,
    collabType: 'Production',
    why: 'Kelvin\'s production style directly complements your sonic palette. 3 mutual playlist placements this month.',
    color: '#06B6D4',
    initials: 'KM',
  },
  {
    id: 'c3',
    name: 'Vesper Rae',
    genre: 'Indie Electronic',
    sharedAudience: '41% audience overlap',
    matchScore: 79,
    collabType: 'Writing',
    why: 'Strong songwriting alignment. Her growth trajectory is 6 months behind yours — a collab now would benefit both.',
    color: '#F59E0B',
    initials: 'VR',
  },
  {
    id: 'c4',
    name: 'Drift',
    genre: 'Experimental R&B',
    sharedAudience: '38% audience overlap',
    matchScore: 74,
    collabType: 'Tour',
    why: 'Building a strong base in NYC and LA — your two strongest markets. A co-headline run would fill rooms faster.',
    color: '#EF4444',
    initials: 'DT',
  },
];

const COLLAB_TYPE_COLOR: Record<string, string> = {
  Feature: '#10B981',
  Production: '#06B6D4',
  Writing: '#F59E0B',
  Tour: '#EF4444',
};

interface IntroModalProps {
  collab: CollabSuggestion;
  onClose: () => void;
}

function IntroModal({ collab, onClose }: IntroModalProps) {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="bg-[#0D0E11] border border-[#10B981]/30 rounded-2xl p-8 max-w-sm w-full text-center">
          <div className="w-14 h-14 rounded-full bg-[#10B981]/14 border border-[#10B981]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-[#10B981]" />
          </div>
          <p className="text-[16px] font-bold text-white mb-1">Intro Requested</p>
          <p className="text-[12px] text-white/40">Your GMG team will facilitate an introduction to {collab.name}.</p>
          <button onClick={onClose} className="mt-4 text-[10px] font-mono text-white/30 hover:text-white/55 transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0D0E11] border border-white/[0.10] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${collab.color}50, transparent)` }} />
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-[13px]"
              style={{ background: `${collab.color}14`, borderColor: `${collab.color}28`, color: collab.color }}>
              {collab.initials}
            </div>
            <div>
              <p className="text-[14px] font-bold text-white">{collab.name}</p>
              <p className="text-[10px] text-white/30">{collab.genre} · {collab.collabType}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/[0.05] hover:bg-white/[0.10] flex items-center justify-center">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-[11px] text-white/45 leading-relaxed mb-5">{collab.why}</p>
          <p className="text-[10px] text-white/30 mb-4">
            Your GMG team will reach out to {collab.name}'s camp and facilitate an introduction on your behalf.
          </p>
          <button
            onClick={() => setSent(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all border"
            style={{ color: collab.color, background: `${collab.color}14`, borderColor: `${collab.color}30` }}
          >
            <Send className="w-4 h-4" />
            Request Introduction via GMG
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AudienceIntelligence({ artist }: Props) {
  const [selectedCollab, setSelectedCollab] = useState<CollabSuggestion | null>(null);

  return (
    <>
      <div className="space-y-5">
        {/* Audience Demographics */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EC4899]/14 border border-[#EC4899]/25 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#EC4899]" />
              </div>
              <h3 className="text-[14px] font-bold text-white">Audience Intelligence</h3>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {/* Age */}
            <div>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-3">Age Distribution</p>
              <div className="space-y-2">
                {AGE_DATA.map(ag => (
                  <div key={ag.range} className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-white/35 w-10 shrink-0">{ag.range}</span>
                    <div className="flex-1 h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ag.pct}%`, background: ag.color }} />
                    </div>
                    <span className="text-[9px] font-mono text-white/40 w-7 text-right shrink-0">{ag.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="pt-4 sm:pt-0 sm:pl-5">
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-3">Gender Breakdown</p>
              <div className="flex gap-1 h-8 rounded-xl overflow-hidden mb-3">
                {GENDER_DATA.map(g => (
                  <div key={g.label} className="flex items-center justify-center text-[8px] font-mono font-bold text-white/70"
                    style={{ width: `${g.pct}%`, background: g.color + '40' }}>
                    {g.pct}%
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                {GENDER_DATA.map(g => (
                  <div key={g.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ background: g.color }} />
                    <span className="text-[10px] text-white/50">{g.label}</span>
                    <span className="text-[10px] font-mono ml-auto" style={{ color: g.color }}>{g.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listening habits */}
            <div className="pt-4 sm:pt-0 sm:pl-5">
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-3">Listening Habits</p>
              <div className="space-y-2.5">
                {LISTENING_HABITS.map(h => {
                  const Icon = h.icon;
                  return (
                    <div key={h.label} className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center border shrink-0"
                        style={{ background: `${h.color}14`, borderColor: `${h.color}25` }}>
                        <Icon className="w-3 h-3" style={{ color: h.color }} />
                      </div>
                      <div>
                        <p className="text-[8px] font-mono text-white/25 uppercase tracking-wider">{h.label}</p>
                        <p className="text-[11px] font-semibold text-white/70">{h.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fans Also Like */}
          <div className="px-5 pb-5 pt-4 border-t border-white/[0.05]">
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-3">Fans Also Like</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {FANS_ALSO_LIKE.map(f => (
                <div key={f.category}>
                  <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wider mb-2">{f.category}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {f.items.map(item => (
                      <span key={item} className="text-[9.5px] text-white/50 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.07] hover:text-white/70 hover:border-white/[0.12] transition-all cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Collaborations */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/14 border border-[#F59E0B]/25 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white">Suggested Collaborations</h3>
                <p className="text-[10px] text-white/30 mt-0.5">AI-matched by audience overlap, genre alignment, and growth trajectory</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {COLLAB_SUGGESTIONS.map(c => {
              const typeColor = COLLAB_TYPE_COLOR[c.collabType];
              return (
                <div key={c.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 text-[12px] font-bold"
                      style={{ background: `${c.color}14`, borderColor: `${c.color}28`, color: c.color }}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-[13px] font-semibold text-white/85">{c.name}</p>
                        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                          style={{ color: typeColor, background: `${typeColor}10`, borderColor: `${typeColor}22` }}>
                          {c.collabType}
                        </span>
                        <div className="flex items-center gap-1 ml-auto">
                          <Zap className="w-2.5 h-2.5 text-[#F59E0B]" />
                          <span className="text-[9px] font-mono text-[#F59E0B]">{c.matchScore}% match</span>
                        </div>
                      </div>
                      <p className="text-[9px] font-mono text-white/25 mb-1.5">{c.genre} · {c.sharedAudience}</p>
                      <p className="text-[10px] text-white/40 leading-relaxed mb-3">{c.why}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCollab(c)}
                          className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-lg transition-all border"
                          style={{ color: c.color, background: `${c.color}10`, borderColor: `${c.color}22` }}
                        >
                          <Send className="w-3 h-3" />
                          Request Intro
                        </button>
                        <button className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-lg text-white/30 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] transition-all">
                          <TrendingUp className="w-3 h-3" />
                          View Profile
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedCollab && (
        <IntroModal
          collab={selectedCollab}
          onClose={() => setSelectedCollab(null)}
        />
      )}
    </>
  );
}
