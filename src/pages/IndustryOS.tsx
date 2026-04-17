import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, BarChart2, Music, ArrowRight, Zap, Users, Megaphone, TrendingUp, Waves, LayoutGrid as Layout, Database, Workflow } from 'lucide-react';
import GMGMotif from '../components/GMGMotif';
import LaunchpadSignalNetwork from '../components/LaunchpadSignalNetwork';

const aiCoworkers = [
  {
    name: 'Atlas',
    roleType: 'Campaign Operator',
    specialty: 'Release Strategy & Campaign Execution',
    description: 'Plans, coordinates, and executes real releases across platforms.',
    tags: ['Release Strategy', 'Campaign Planning', 'Rollout Execution'],
    icon: Megaphone,
    badge: 'MASTER',
  },
  {
    name: 'Crest',
    roleType: 'Audience Builder',
    specialty: 'Audience Growth & Fan Development',
    description: 'Builds and optimizes audience systems, engagement loops, and growth strategy.',
    tags: ['Audience Growth', 'Platform Strategy', 'Fan Engagement'],
    icon: TrendingUp,
    badge: 'MASTER',
  },
  {
    name: 'Echo',
    roleType: 'Cultural Analyst',
    specialty: 'Cultural Intelligence & Positioning',
    description: 'Identifies trends, signals, and positioning opportunities before they break.',
    tags: ['Trend Analysis', 'Cultural Positioning', 'Signal Identification'],
    icon: Waves,
    badge: 'SENIOR',
  },
  {
    name: 'Current',
    roleType: 'Content Systems',
    specialty: 'Content + Distribution',
    description: 'Supports content creation systems, posting strategy, and distribution workflows.',
    tags: ['Content Strategy', 'Distribution', 'Short Form Systems'],
    icon: Layout,
    badge: 'SENIOR',
  },
  {
    name: 'Ledger',
    roleType: 'Catalog Operator',
    specialty: 'Catalog Growth',
    description: 'Optimizes catalog performance, metadata, and long-term audience expansion.',
    tags: ['Catalog Strategy', 'Metadata Optimization', 'Revenue Growth'],
    icon: Database,
    badge: 'JUNIOR',
  },
  {
    name: 'Vector',
    roleType: 'Artist Operations',
    specialty: 'Day-to-Day Execution',
    description: 'Supports artist workflows, coordination, and operational execution across teams.',
    tags: ['Artist Support', 'Operations', 'Coordination'],
    icon: Workflow,
    badge: 'JUNIOR',
  },
];

export default function IndustryOS() {
  return (
    <div className="min-h-screen text-white bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 40%, #221B33 50%, #0B0B0D 100%)' }}></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 130% 80% at 30% 50%, rgba(75,59,120,0.28) 0%, rgba(55,40,90,0.14) 40%, transparent 70%)' }}></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 60% at 75% 50%, rgba(30,20,55,0.18) 0%, transparent 70%)' }}></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.55) 100%)' }}></div>
        <GMGMotif />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-violet-400/60 tracking-[0.25em] uppercase mb-6">
                Greater Music Group
              </p>
              <h1 className="font-black mb-6 leading-[0.92] tracking-tighter">
                <span className="block text-[4rem] md:text-[5rem] lg:text-[6rem]" style={{ color: '#E5E5E7' }}>
                  Industry OS
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl text-white/70 mb-8 leading-tight font-light">
                Learn the Music Industry by Working Inside It
              </h2>

              <p className="text-lg md:text-xl text-white/60 mb-6 leading-relaxed">
                Industry OS is GMG's hands-on training and experience system where artists and operators gain real-world experience across discovery, marketing, and music infrastructure.
              </p>

              <p className="text-lg text-white/50 mb-12 leading-relaxed">
                Work on real campaigns, collaborate with artists, and build a track record inside live music systems—not simulations.
              </p>

              <Link
                to="/login/industry-os"
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-xl font-semibold text-lg transition-all"
              >
                Join Industry OS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative hidden md:block">
              <LaunchpadSignalNetwork />
            </div>
          </div>
        </div>
      </section>

      {/* AI Coworkers Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/10 to-black"></div>
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-cyan-400/60 tracking-[0.25em] uppercase mb-3">AI Workforce — Industry Division</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              AI Coworkers
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-3">
              AI Coworkers function as peer-level collaborators across the industry layer — supporting execution, learning, and real-world application across finance, touring, media, partnerships, and operations.
            </p>
            <p className="text-lg text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-4">
              Designed to feel like teammates, they help emerging professionals and artists build real experience while working inside structured systems.
            </p>
            <p className="text-sm font-medium text-cyan-400/50 tracking-[0.15em] uppercase">
              Part of the GMG AI Workforce, designed for real-world collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {aiCoworkers.map((coworker, i) => {
              const badgeStyles: Record<string, string> = {
                ELITE: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
                MASTER: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
                SENIOR: 'bg-white/[0.06] text-white/55 border-white/[0.1]',
                JUNIOR: 'bg-white/[0.03] text-white/35 border-white/[0.07]',
              };
              const badgeStyle = badgeStyles[coworker.badge] || badgeStyles.JUNIOR;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-cyan-500/20 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(6,182,212,0.25),0_20px_60px_rgba(6,182,212,0.1)] hover:border-cyan-400/40"
                >
                  <div className="absolute inset-0 opacity-[0.04]">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.4) 1px, transparent 1px)`,
                      backgroundSize: '28px 28px'
                    }}></div>
                  </div>

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-cyan-500/10 border border-cyan-500/25 shadow-[0_0_16px_rgba(6,182,212,0.2)] group-hover:shadow-[0_0_24px_rgba(6,182,212,0.35)] transition-all duration-500">
                        <coworker.icon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 rounded-full">
                        Available
                      </span>
                    </div>

                    <div className="mb-1">
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400/50">{coworker.roleType}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-black text-white">{coworker.name}</h3>
                      <span className={`text-[9px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}>{coworker.badge}</span>
                    </div>
                    <p className="text-sm font-semibold text-white/40 mb-4 tracking-wide">{coworker.specialty}</p>
                    <p className="text-white/60 font-light leading-relaxed text-sm mb-6">{coworker.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {coworker.tags.map((tag, j) => (
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
            <p className="text-xl text-white/60 font-light mb-8 max-w-2xl mx-auto">
              You're not learning alone. You're working with systems designed to make you better.
            </p>
            <Link
              to="/login/industry-os"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-cyan-500/5 hover:bg-cyan-500/10 border border-cyan-500/25 hover:border-cyan-400/50 text-white rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Start Training Inside Industry OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-violet-400/60 tracking-[0.25em] uppercase mb-6">How It Works</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Three Steps. Real Results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Learn the System',
                description: 'Understand how discovery, marketing, catalog growth, and artist operations actually work together.',
                accent: 'violet',
              },
              {
                icon: Zap,
                title: 'Work on Real Projects',
                description: 'Contribute to live campaigns, artist development, and cultural media initiatives across the GMG ecosystem.',
                accent: 'cyan',
              },
              {
                icon: BarChart2,
                title: 'Build Your Track Record',
                description: 'Create a verifiable body of work including campaigns supported, signals identified, and projects completed.',
                accent: 'emerald',
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)] ${
                  card.accent === 'violet'
                    ? 'border-violet-500/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.5),0_20px_60px_rgba(139,92,246,0.2)]'
                    : card.accent === 'cyan'
                    ? 'border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.5),0_20px_60px_rgba(6,182,212,0.2)]'
                    : 'border-emerald-500/40 hover:shadow-[0_0_40px_rgba(16,185,129,0.5),0_20px_60px_rgba(16,185,129,0.2)]'
                }`}
              >
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                  }}></div>
                </div>
                <div className="relative p-10">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 border-2 ${
                    card.accent === 'violet'
                      ? 'bg-violet-600/10 border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : card.accent === 'cyan'
                      ? 'bg-cyan-600/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                      : 'bg-emerald-600/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  }`}>
                    <card.icon className={`w-8 h-8 ${
                      card.accent === 'violet' ? 'text-violet-400' : card.accent === 'cyan' ? 'text-cyan-400' : 'text-emerald-400'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-white">{card.title}</h3>
                  <p className="text-white/60 font-light leading-relaxed">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950/50 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-white/30 tracking-[0.25em] uppercase mb-4">System Architecture</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              One System. Three Layers. Built to Run the Modern Music Business.
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-2">
              Industry OS is not a standalone program — it is part of GMG's AI-powered operating system for music.
            </p>
            <p className="text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
              Each layer works together to discover talent, grow artists, and train the people who operate the system.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                title: 'AI Scouts',
                tagline: 'Find what matters early',
                description: 'Identify and prioritize breakout artists, cultural signals, and emerging movements before the market does.',
                color: 'violet',
                rgb: '139,92,246',
              },
              {
                title: 'AI Artist Reps',
                tagline: 'Grow what matters',
                description: 'Power artist growth through marketing, release strategy, audience development, and operational execution.',
                color: 'emerald',
                rgb: '16,185,129',
              },
              {
                title: 'AI Coworkers',
                tagline: 'Train who runs it',
                description: 'Develop the next generation of operators through real work, guided execution, and AI-assisted training.',
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
            <p className="text-lg text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
              <span className="text-violet-400 font-semibold">AI Scouts</span> identify opportunity.{' '}
              <span className="text-emerald-400 font-semibold">AI Artist Reps</span> grow it.{' '}
              <span className="text-cyan-400 font-semibold">AI Coworkers</span> train the people who execute it.
            </p>
          </div>
        </div>
      </section>

      {/* Two Tracks Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-violet-400/60 tracking-[0.25em] uppercase mb-6">Two Tracks</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Built for Operators and Artists
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-violet-500/40 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_0_40px_rgba(139,92,246,0.6),0_20px_60px_rgba(139,92,246,0.3)] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(to right, rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,92,246,0.3) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
              <div className="relative p-12">
                <div className="w-20 h-20 bg-violet-600/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                  <Briefcase className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-white">For Operators</h3>
                <p className="text-violet-300 font-semibold mb-6 text-sm tracking-wide uppercase">
                  Future A&Rs, marketers, managers, and creatives
                </p>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  Learn how the industry actually works and gain experience that translates into real roles.
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
                  <Music className="w-10 h-10 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-black mb-2 text-white">For Artists</h3>
                <p className="text-cyan-300 font-semibold mb-6 text-sm tracking-wide uppercase">
                  Artists learning the system they operate in
                </p>
                <p className="text-white/60 font-light leading-relaxed text-lg">
                  Understand how to grow, release, and build a career with more control and better decision-making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Where This Happens Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-violet-400/60 tracking-[0.25em] uppercase mb-6">Infrastructure</p>
            <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Built Inside Real Music Infrastructure
            </h2>
            <p className="text-xl text-white/60 max-w-4xl mx-auto font-light leading-relaxed mb-4">
              Industry OS runs across GMG's live ecosystem—including discovery systems, marketing workflows, catalog growth tools, and cultural media platforms.
            </p>
            <p className="text-lg font-bold text-white/80">
              This is not theory. This is real participation.
            </p>
          </div>

          <div className="relative bg-gradient-to-br from-violet-950/40 via-black/60 to-black/80 backdrop-blur-xl border border-violet-400/30 rounded-2xl p-12 shadow-[0_0_80px_rgba(139,92,246,0.3)]">
            <div className="absolute inset-0 opacity-10 rounded-2xl overflow-hidden">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(139,92,246,0.2) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(139,92,246,0.2) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative grid md:grid-cols-2 gap-6">
              {[
                'Discovery systems and cultural scouting',
                'Marketing workflows and campaign execution',
                'Catalog growth tools and audience expansion',
                'Cultural media platforms and storytelling',
                'Artist development and operational support',
                'Data analysis and signal identification',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-5">
                  <div className="w-2 h-2 rounded-full bg-violet-400 mt-2 flex-shrink-0"></div>
                  <span className="text-white/70 font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Outcome Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-xs font-medium text-violet-400/60 tracking-[0.25em] uppercase mb-6">Outcomes</p>
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight" style={{ color: '#E5E5E7' }}>
            You Don't Leave With a Certificate
          </h2>
          <p className="text-3xl font-bold text-white/70 mb-16">
            You leave with experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {[
              { icon: Zap, label: 'Campaigns worked on' },
              { icon: Users, label: 'Artists supported' },
              { icon: BarChart2, label: 'Signals identified' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-8 py-6 min-w-[200px]">
                <item.icon className="w-7 h-7 text-violet-400 flex-shrink-0" />
                <span className="text-lg font-semibold text-white/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
            Start Building Inside the Industry
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Industry OS is the system GMG built to give artists and operators real access to the modern music ecosystem.
          </p>

          <Link
            to="/login/industry-os"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white rounded-xl font-bold text-xl transition-all"
          >
            Join Industry OS
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
