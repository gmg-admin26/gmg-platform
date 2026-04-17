import { Link } from 'react-router-dom';
import {
  TrendingUp, Target, Sparkles, Users, ArrowRight,
  Music, LineChart, Globe, Activity, Zap,
  Send, LogIn, Database, BarChart2, Layers, Radio,
  RefreshCw, Archive, SlidersHorizontal
} from 'lucide-react';
import GMGMotif from '../components/GMGMotif';
import SignalGridBackground from '../components/SignalGridBackground';

const aiCatalogSystems = [
  {
    id: 'INDEX',
    name: 'Index',
    function: 'Metadata Intelligence',
    description: 'Cleans, structures, and optimizes catalog data across every release — ensuring accurate tagging, discoverability, and long-term catalog integrity.',
    tags: ['Metadata Optimization', 'Catalog Structuring', 'Data Integrity'],
    icon: Database,
    badge: 'MASTER',
  },
  {
    id: 'RELAY',
    name: 'Relay',
    function: 'Distribution Engine',
    description: 'Routes content across platforms and territories for maximum reach — coordinating delivery, updates, and synchronization in real time.',
    tags: ['Platform Delivery', 'Territory Routing', 'Release Sync'],
    icon: Send,
    badge: 'MASTER',
  },
  {
    id: 'AMPLIFY',
    name: 'Amplify',
    function: 'Catalog Growth',
    description: 'Re-engages existing audiences and activates new listeners through data-driven targeting, playlist strategy, and sustained streaming growth loops.',
    tags: ['Audience Re-engagement', 'Playlist Strategy', 'Growth Loops'],
    icon: TrendingUp,
    badge: 'MASTER',
  },
  {
    id: 'YIELD',
    name: 'Yield',
    function: 'Revenue Optimization',
    description: 'Identifies and unlocks monetization opportunities across platforms, territories, licensing channels, and revenue formats.',
    tags: ['Revenue Tracking', 'Monetization Expansion', 'Yield Optimization'],
    icon: BarChart2,
    badge: 'SENIOR',
  },
  {
    id: 'ARCHIVE',
    name: 'Archive',
    function: 'Catalog Structuring',
    description: 'Organizes, maintains, and preserves long-term catalog health — ensuring every asset is properly structured, accessible, and protected.',
    tags: ['Asset Organization', 'Long-term Health', 'Catalog Preservation'],
    icon: Archive,
    badge: 'SENIOR',
  },
  {
    id: 'SIGNALFLOW',
    name: 'SignalFlow',
    function: 'Performance Tracking',
    description: 'Monitors real-time streaming performance, audience signals, and platform behavior — triggering optimization actions when and where they matter.',
    tags: ['Real-time Monitoring', 'Signal Detection', 'Performance Triggers'],
    icon: Activity,
    badge: 'SENIOR',
  },
];

const badgeStyles: Record<string, string> = {
  MASTER: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
  SENIOR: 'bg-white/[0.06] text-white/55 border-white/[0.1]',
  JUNIOR: 'bg-white/[0.03] text-white/35 border-white/[0.07]',
};

export default function Catalog() {
  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #0B0B0D 0%, #0a1210 20%, #0d1a16 40%, #0a1210 60%, #0B0B0D 100%)'
    }}>
      <div className="atmospheric-canvas fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-cinematic-base">
        <SignalGridBackground />
        <div className="hero-atmospheric-light"></div>
        <GMGMotif />
        <div className="absolute inset-0 film-grain"></div>
        <div className="absolute inset-0 vignette"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium text-white/40 tracking-[0.25em] uppercase mb-8">Catalog Operating System</p>

            <h1 className="font-black mb-6 leading-[0.92] tracking-tighter text-center">
              <span className="block text-[5.5rem] md:text-[7rem] lg:text-[8.5rem]" style={{ color: '#E5E5E7' }}>Catalog OS</span>
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold text-white/80 mb-10 tracking-tight">
              Turn Catalog Into a Living Growth Engine
            </h2>

            <p className="text-xl md:text-2xl text-white/60 mb-6 leading-relaxed font-light max-w-3xl mx-auto">
              Catalog OS is GMG's AI-powered system for managing, optimizing, and scaling music catalogs.
            </p>

            <p className="text-lg text-white/50 mb-4 leading-relaxed font-light max-w-3xl mx-auto">
              It continuously improves performance across distribution, metadata, audience expansion, and revenue generation.
            </p>
            <p className="text-base text-white/35 mb-12 font-light italic">
              This is not passive catalog management. This is active, system-driven growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                to="/login/catalog-os"
                onClick={() => window.scrollTo(0, 0)}
                className="group px-10 py-5 btn-glass-hero text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                Access Catalog OS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login/catalog-os"
                onClick={() => window.scrollTo(0, 0)}
                className="px-10 py-5 btn-glass-hero-secondary text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Partner Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* CORE VALUE STRIP */}
      <section className="relative py-24 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/8 to-black"></div>
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-4">System Functions</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              What Catalog OS Does
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              Four core functions running simultaneously — optimizing every dimension of catalog performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: SlidersHorizontal,
                title: 'Optimize Performance',
                description: 'Improve streaming, discovery, and retention across all releases.',
                color: 'emerald',
                rgb: '16,185,129',
              },
              {
                icon: Globe,
                title: 'Expand Audience',
                description: 'Activate new listeners through data-driven targeting and distribution logic.',
                color: 'cyan',
                rgb: '6,182,212',
              },
              {
                icon: TrendingUp,
                title: 'Maximize Revenue',
                description: 'Unlock new income across platforms, territories, and formats.',
                color: 'violet',
                rgb: '139,92,246',
              },
              {
                icon: RefreshCw,
                title: 'Automate Growth',
                description: 'Continuously improve catalog performance using AI systems operating around the clock.',
                color: 'sky',
                rgb: '14,165,233',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border backdrop-blur-sm p-8 transition-all duration-500 ${
                  card.color === 'emerald'
                    ? 'border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                    : card.color === 'cyan'
                    ? 'border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]'
                    : card.color === 'violet'
                    ? 'border-violet-500/20 hover:border-violet-400/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                    : 'border-sky-500/20 hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(14,165,233,0.15)]'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border-2 ${
                  card.color === 'emerald'
                    ? 'bg-emerald-600/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : card.color === 'cyan'
                    ? 'bg-cyan-600/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                    : card.color === 'violet'
                    ? 'bg-violet-600/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                    : 'bg-sky-600/10 border-sky-500/30 shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                }`}>
                  <card.icon className={`w-7 h-7 ${
                    card.color === 'emerald' ? 'text-emerald-400'
                    : card.color === 'cyan' ? 'text-cyan-400'
                    : card.color === 'violet' ? 'text-violet-400'
                    : 'text-sky-400'
                  }`} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{card.title}</h3>
                <p className="text-white/55 font-light leading-relaxed text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* AI CATALOG SYSTEMS */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden" style={{ background: 'linear-gradient(to bottom, #080a0b 0%, #04100d 50%, #080a0b 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(16,185,129,0.06) 0%, transparent 65%)' }} className="absolute inset-0" />
          <div style={{ background: 'radial-gradient(ellipse 40% 40% at 80% 80%, rgba(6,182,212,0.03) 0%, transparent 60%)' }} className="absolute inset-0" />
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(to right, rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/[0.05] border border-emerald-500/15 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-emerald-400/70">AI Catalog Systems</span>
            </div>
            <h2 className="font-black tracking-tighter mb-5 leading-[0.93]" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', color: '#E5E5E7' }}>
              AI Catalog Systems
            </h2>
            <p className="text-xl text-white/55 max-w-3xl mx-auto font-light leading-relaxed mb-4">
              Catalog OS is powered by AI systems that continuously monitor, optimize, and grow catalog performance — each assigned to a specific function, operating in coordination.
            </p>
            <p className="text-base text-white/35 max-w-2xl mx-auto font-light leading-relaxed">
              These are not assistants. They are purpose-built operational systems running across every layer of the catalog.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 mb-12">
            {aiCatalogSystems.map((system, i) => {
              const badgeStyle = badgeStyles[system.badge] || badgeStyles.JUNIOR;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/20 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(16,185,129,0.25),0_20px_60px_rgba(16,185,129,0.1)] hover:border-emerald-400/40"
                >
                  <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.4) 1px, transparent 1px)`,
                      backgroundSize: '28px 28px'
                    }}></div>
                  </div>

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_16px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all duration-500">
                        <system.icon className="w-7 h-7 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="mb-1">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400/50">{system.id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-black text-white">{system.name}</h3>
                      <span className={`text-[9px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}>{system.badge}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/40 mb-4 tracking-wide">{system.function}</p>
                    <p className="text-white/60 font-light leading-relaxed text-sm mb-6">{system.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {system.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="text-[11px] font-medium px-3 py-1 bg-white/[0.04] border border-white/[0.08] text-white/50 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-lg text-white/50 font-light mb-8 max-w-2xl mx-auto">
              Every system runs continuously — coordinated across the catalog layer, generating compounding results over time.
            </p>
            <Link
              to="/login/catalog-os"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-400/50 text-white rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Access Catalog OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* HOW IT WORKS — CONTINUOUS CATALOG GROWTH */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-6">How It Works</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Continuous Catalog Growth
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              Three sequential steps. Each feeds the next. The system runs without interruption.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Layers,
                title: 'Structure the Catalog',
                description: 'Organize releases, metadata, and assets into a clean, scalable system — so every element is optimized for discovery and performance.',
                accent: 'emerald',
                number: '01',
              },
              {
                icon: Radio,
                title: 'Activate Distribution + Discovery',
                description: 'Deploy content across platforms with optimized positioning — routing to the right territories, playlists, and audience segments.',
                accent: 'cyan',
                number: '02',
              },
              {
                icon: LineChart,
                title: 'Optimize in Real Time',
                description: 'AI systems continuously improve performance, reach, and revenue — responding to signals and compounding results over time.',
                accent: 'sky',
                number: '03',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] ${
                  card.accent === 'emerald'
                    ? 'border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.5),0_20px_60px_rgba(16,185,129,0.2)]'
                    : card.accent === 'cyan'
                    ? 'border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.5),0_20px_60px_rgba(6,182,212,0.2)]'
                    : 'border-sky-500/40 hover:shadow-[0_0_40px_rgba(14,165,233,0.5),0_20px_60px_rgba(14,165,233,0.2)]'
                }`}
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.3) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>
                <div className="relative p-10">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border-2 mb-6 font-black text-xl ${
                    card.accent === 'emerald'
                      ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : card.accent === 'cyan'
                      ? 'bg-cyan-600/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-sky-600/10 border-sky-500/30 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                  }`}>
                    {card.number}
                  </div>
                  <card.icon className={`w-8 h-8 mb-5 ${
                    card.accent === 'emerald' ? 'text-emerald-400' : card.accent === 'cyan' ? 'text-cyan-400' : 'text-sky-400'
                  }`} />
                  <h3 className="text-2xl font-black mb-4 text-white">{card.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* SYSTEM ARCHITECTURE — PART OF A LARGER SYSTEM */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-white/30 tracking-[0.25em] uppercase mb-4">System Architecture</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              Part of a Larger System
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-2">
              Catalog OS is fully integrated into GMG's AI-powered ecosystem — connected to discovery, artist operations, and industry infrastructure.
            </p>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Catalog OS ensures every release and asset continues to grow inside this system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                title: 'AI Scouts',
                tagline: 'Identify trends early',
                description: 'Identify trends and cultural signals that inform catalog strategy — surfacing what is gaining momentum before the market reacts.',
                color: 'violet',
                rgb: '139,92,246',
              },
              {
                title: 'AI Artist Reps',
                tagline: 'Drive catalog growth',
                description: 'Drive growth strategy, releases, and audience expansion — working in parallel with Catalog OS to maximize every release.',
                color: 'emerald',
                rgb: '16,185,129',
              },
              {
                title: 'AI Coworkers',
                tagline: 'Execute across the system',
                description: 'Execute campaigns, operations, and system workflows — ensuring catalog strategy translates into real, measurable action.',
                color: 'cyan',
                rgb: '6,182,212',
              },
            ].map((layer, i) => (
              <div
                key={i}
                className={`relative rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border backdrop-blur-sm p-10 transition-all duration-500 ${
                  layer.color === 'violet'
                    ? 'border-violet-500/20 hover:border-violet-400/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                    : layer.color === 'emerald'
                    ? 'border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                    : 'border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]'
                }`}
              >
                <div className={`inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-6 border ${
                  layer.color === 'violet'
                    ? 'bg-violet-400/10 text-violet-400 border-violet-400/20'
                    : layer.color === 'emerald'
                    ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                    : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
                }`}>
                  {layer.title}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{layer.tagline}</h3>
                <div className={`w-10 h-px mb-5 ${
                  layer.color === 'violet' ? 'bg-violet-500/50' : layer.color === 'emerald' ? 'bg-emerald-500/50' : 'bg-cyan-500/50'
                }`}></div>
                <p className="text-white/55 font-light leading-relaxed">{layer.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center border-t border-white/[0.06] pt-14">
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
              <span className="text-violet-400 font-semibold">AI Scouts</span> surface the signals.{' '}
              <span className="text-emerald-400 font-semibold">AI Artist Reps</span> drive the growth.{' '}
              <span className="text-cyan-400 font-semibold">AI Coworkers</span> execute across the system.{' '}
              <span className="text-white/80 font-semibold">Catalog OS</span> ensures every asset compounds.
            </p>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* BUILT FOR SCALE */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-6">Who It's For</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Built for Scale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/40 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.6),0_20px_60px_rgba(16,185,129,0.3)] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.3) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              <div className="relative p-12">
                <div className="w-20 h-20 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <Music className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-white">For Artists</h3>
                <p className="text-emerald-300 font-semibold mb-6 text-sm tracking-wide uppercase">
                  Build a long-term music asset
                </p>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  Turn your music into a long-term asset that grows over time — managed by AI systems that work your catalog continuously, not just at release.
                </p>
              </div>
            </div>

            <div className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-cyan-500/40 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.6),0_20px_60px_rgba(6,182,212,0.3)] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.3) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              <div className="relative p-12">
                <div className="w-20 h-20 bg-cyan-600/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                  <BarChart2 className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-white">For Labels & Operators</h3>
                <p className="text-cyan-300 font-semibold mb-6 text-sm tracking-wide uppercase">
                  Scale across artists and releases
                </p>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  Manage and scale catalogs across multiple artists and releases — with AI systems handling optimization, performance tracking, and revenue growth at every level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* INFRASTRUCTURE SECTION */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-6">Infrastructure</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Built on Real Music Infrastructure
            </h2>
            <p className="text-xl text-white/60 max-w-4xl mx-auto font-light leading-relaxed mb-4">
              Catalog OS runs across purpose-built infrastructure — not general-purpose tools. Every layer is designed for the specific demands of music catalog management and growth.
            </p>
            <p className="text-lg font-bold text-white/80">
              Active infrastructure. Active results.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-emerald-950/40 via-black/60 to-black/80 backdrop-blur-xl border border-emerald-400/30 rounded-2xl p-12 shadow-[0_0_80px_rgba(16,185,129,0.3)]">
            <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(16,185,129,0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(16,185,129,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative grid md:grid-cols-2 gap-6">
              {[
                'Distribution systems and platform integrations',
                'Metadata optimization and catalog structuring',
                'Audience expansion and growth loops',
                'Revenue tracking and performance analytics',
                'Cross-platform release management',
                'Real-time signal monitoring and optimization triggers',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                  <span className="text-white/70 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* OUTCOME SECTION */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-6">Outcomes</p>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight" style={{ color: '#E5E5E7' }}>
            Your Catalog Becomes an Asset
          </h2>
          <p className="text-3xl font-bold text-white/70 mb-16">
            That Compounds.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, label: 'Catalog Growth Rate', color: 'emerald' },
              { icon: Users, label: 'Audience Expansion', color: 'cyan' },
              { icon: Zap, label: 'Revenue Per Release', color: 'sky' },
              { icon: BarChart2, label: 'Long-Term Performance', color: 'violet' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col items-center gap-4 bg-white/[0.04] border rounded-2xl px-6 py-8 ${
                item.color === 'emerald' ? 'border-emerald-500/20'
                : item.color === 'cyan' ? 'border-cyan-500/20'
                : item.color === 'sky' ? 'border-sky-500/20'
                : 'border-violet-500/20'
              }`}>
                <item.icon className={`w-8 h-8 flex-shrink-0 ${
                  item.color === 'emerald' ? 'text-emerald-400'
                  : item.color === 'cyan' ? 'text-cyan-400'
                  : item.color === 'sky' ? 'text-sky-400'
                  : 'text-violet-400'
                }`} />
                <span className="text-sm font-semibold text-white/80 text-center leading-snug">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* FINAL CTA */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
            Build a Catalog That Grows
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Catalog OS gives you the systems to turn music into a scalable, long-term asset — managed by AI infrastructure that works continuously.
          </p>

          <Link
            to="/login/catalog-os"
            onClick={() => window.scrollTo(0, 0)}
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-xl transition-all"
          >
            Access Catalog OS
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
