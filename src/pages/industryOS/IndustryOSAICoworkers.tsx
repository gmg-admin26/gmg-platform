import { useState } from 'react';
import { Bot, ChevronRight, Zap, Lock } from 'lucide-react';

const ACCENT = '#10B981';

interface AICoworker {
  id: string;
  name: string;
  specialty: string;
  description: string;
  skills: string[];
  color: string;
  status: 'active' | 'coming_soon';
  modules: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  recommended?: boolean;
}

const COWORKERS: AICoworker[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    specialty: 'Campaign Execution',
    description: 'Guides you through building and launching marketing campaigns from strategy to deployment. Trains on paid media, playlist pitching, and release sequencing.',
    skills: ['Paid Media', 'Release Strategy', 'Ad Creative', 'Campaign Analytics'],
    color: '#10B981',
    status: 'active',
    modules: 6,
    level: 'Beginner',
    recommended: true,
  },
  {
    id: 'crest',
    name: 'Crest',
    specialty: 'Audience Growth',
    description: 'Teaches audience development through organic and paid methods. Covers playlist discovery, social growth frameworks, and fan activation.',
    skills: ['Organic Growth', 'Social Strategy', 'Fan Activation', 'Streaming'],
    color: '#06B6D4',
    status: 'active',
    modules: 5,
    level: 'Beginner',
    recommended: true,
  },
  {
    id: 'echo',
    name: 'Echo',
    specialty: 'Cultural Intelligence',
    description: 'Develops your ability to read cultural signals, identify emerging trends, and understand what makes artists connect with audiences at a deeper level.',
    skills: ['Trend Analysis', 'Cultural Reading', 'Emerging Signals', 'A&R Instinct'],
    color: '#F59E0B',
    status: 'active',
    modules: 4,
    level: 'Intermediate',
  },
  {
    id: 'current',
    name: 'Current',
    specialty: 'Creator Economy',
    description: 'Trains on how to monetize creative work in the modern music economy — from licensing and sync to brand deals and direct-to-fan revenue.',
    skills: ['Licensing', 'Sync Deals', 'Brand Partnerships', 'D2F Revenue'],
    color: '#3B82F6',
    status: 'active',
    modules: 4,
    level: 'Intermediate',
  },
  {
    id: 'ledger',
    name: 'Ledger',
    specialty: 'Music Finance',
    description: 'Covers the financial infrastructure of the music industry — recoupment, royalty accounting, campaign budgeting, and reading deal structures.',
    skills: ['Royalty Accounting', 'Deal Structures', 'Recoupment', 'Campaign Finance'],
    color: '#EF4444',
    status: 'coming_soon',
    modules: 5,
    level: 'Advanced',
  },
  {
    id: 'vector',
    name: 'Vector',
    specialty: 'Data Operations',
    description: 'Teaches how to work with music data — artist analytics, performance metrics, data enrichment, quality audits, and reporting.',
    skills: ['Artist Analytics', 'Data Enrichment', 'Metrics', 'Reporting'],
    color: '#8B5CF6',
    status: 'coming_soon',
    modules: 3,
    level: 'Advanced',
  },
];

const LEVEL_META: Record<string, { color: string; label: string }> = {
  Beginner:     { color: '#10B981', label: 'Beginner' },
  Intermediate: { color: '#F59E0B', label: 'Intermediate' },
  Advanced:     { color: '#EF4444', label: 'Advanced' },
};

function CoworkerCard({ coworker, onSelect }: { coworker: AICoworker; onSelect: () => void }) {
  const active = coworker.status === 'active';
  const level = LEVEL_META[coworker.level];

  return (
    <div className="relative bg-[#0B0D10] border rounded-2xl p-5 overflow-hidden transition-all hover:-translate-y-0.5"
      style={{
        borderColor: active ? `${coworker.color}18` : 'rgba(255,255,255,0.06)',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
      }}>
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: active ? `linear-gradient(90deg, transparent, ${coworker.color}30, transparent)` : 'transparent' }} />
      <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
        style={{ background: active ? `radial-gradient(ellipse at 50% 140%, ${coworker.color}06 0%, transparent 70%)` : 'transparent' }} />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${coworker.color}12`, border: `1px solid ${coworker.color}20` }}>
              <Bot className="w-4 h-4" style={{ color: coworker.color }} />
            </div>
            {coworker.recommended && active && (
              <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide"
                style={{ color: ACCENT, background: `${ACCENT}10`, border: `1px solid ${ACCENT}20` }}>
                Recommended
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wide"
              style={{ color: level.color, background: `${level.color}10`, border: `1px solid ${level.color}20` }}>
              {level.label}
            </span>
            {!active && (
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-lg px-2 py-0.5">
                <Lock className="w-2.5 h-2.5 text-white/20" />
                <span className="text-[8px] font-mono text-white/20">Soon</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-[15px] font-bold text-white/85">{coworker.name}</p>
          <p className="text-[10.5px] text-white/35 mt-0.5">{coworker.specialty}</p>
        </div>

        <p className="text-[11px] text-white/35 leading-relaxed mb-4">{coworker.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {coworker.skills.map(skill => (
            <span key={skill}
              className="text-[8.5px] font-mono px-2 py-0.5 rounded-md"
              style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="text-[9.5px] font-mono text-white/20">{coworker.modules} training modules</span>
          <button
            onClick={active ? onSelect : undefined}
            disabled={!active}
            className="flex items-center gap-1.5 text-[10.5px] font-semibold transition-all disabled:opacity-30"
            style={{ color: active ? coworker.color : 'rgba(255,255,255,0.2)' }}>
            {active ? 'Start Training' : 'Coming Soon'}
            {active && <ChevronRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function TrainingModal({ coworker, onClose }: { coworker: AICoworker; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0D0F13] border border-white/[0.08] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.05]">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${coworker.color}12`, border: `1px solid ${coworker.color}20` }}>
            <Bot className="w-4 h-4" style={{ color: coworker.color }} />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white/85">{coworker.name}</p>
            <p className="text-[9.5px] font-mono text-white/25">{coworker.specialty}</p>
          </div>
          <button onClick={onClose}
            className="text-[9px] font-mono text-white/20 hover:text-white/45 transition-colors px-2 py-1 border border-white/[0.07] rounded-lg">
            Close
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-4">
            <p className="text-[9px] font-mono text-white/20 uppercase tracking-wide mb-2">Training Modules</p>
            <div className="space-y-2">
              {Array.from({ length: coworker.modules }, (_, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border"
                    style={{
                      background: i === 0 ? `${coworker.color}15` : 'transparent',
                      borderColor: i === 0 ? coworker.color : 'rgba(255,255,255,0.1)',
                      color: i === 0 ? coworker.color : 'rgba(255,255,255,0.2)',
                    }}>
                    {i + 1}
                  </div>
                  <span className="text-[11px]" style={{ color: i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)' }}>
                    {i === 0 ? `${coworker.specialty} — Introduction` : `Module ${i + 1}`}
                    {i > 0 && <span className="ml-2 text-[8.5px] font-mono text-white/15">Coming soon</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#10B981]/[0.05] border border-[#10B981]/15 rounded-xl p-4">
            <p className="text-[10.5px] text-[#10B981]/60 leading-relaxed">
              Full module gating and progress tracking is coming soon. Start with the introduction to begin your training with {coworker.name}.
            </p>
          </div>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-[12px] font-semibold text-white"
            style={{ background: coworker.color }}>
            Begin Training
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IndustryOSAICoworkers() {
  const [selected, setSelected] = useState<AICoworker | null>(null);

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes ios-fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ios-fade-up { animation: ios-fade-up 0.4s ease both; }
      `}</style>

      {/* Header */}
      <div className="ios-fade-up">
        <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-[0.18em] mb-0.5">Industry OS</p>
        <h1 className="text-[26px] font-bold text-white/90">AI Coworkers</h1>
        <p className="text-[12px] text-white/30 mt-1 max-w-xl">
          Train inside real GMG systems. Not simulations.
        </p>
      </div>

      {/* Banner */}
      <div className="relative bg-[#0A0C10] border rounded-xl px-5 py-4 overflow-hidden ios-fade-up"
        style={{ borderColor: `${ACCENT}18` }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)` }} />
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${ACCENT}12`, border: `1px solid ${ACCENT}20` }}>
            <Zap className="w-3.5 h-3.5" style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-white/80">Train inside real GMG systems. Not simulations.</p>
            <p className="text-[10.5px] text-white/35 mt-0.5 leading-relaxed">
              Each AI coworker is built on actual GMG operational workflows. Start with Beginner modules and progress through real industry systems.
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ios-fade-up" style={{ animationDelay: '0.1s' }}>
        {COWORKERS.map(c => (
          <CoworkerCard key={c.id} coworker={c} onSelect={() => setSelected(c)} />
        ))}
      </div>

      {selected && <TrainingModal coworker={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
