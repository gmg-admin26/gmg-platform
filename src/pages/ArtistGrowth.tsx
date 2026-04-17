import { Link } from 'react-router-dom';
import { Music, Target, Users, TrendingUp, Zap, Settings, Calendar, Sparkles, BarChart3, PlayCircle, Radio, Mic2, ArrowRight, CheckCircle, MapPin, Eye, FileText, Activity, Rocket, Cog } from 'lucide-react';
import GMGMotif from '../components/GMGMotif';
import ArtistOSProtect from '../components/ArtistOSProtect';
import SystemRebuildStatement from '../components/SystemRebuildStatement';
import CampaignEngine from '../components/CampaignEngine';

const aiArtistReps = [
  {
    name: 'Apex',
    specialty: 'Release Strategy',
    description: 'Plans rollout timing, release structure, and positioning.',
    tags: ['Release Planning', 'Timing Strategy', 'Drop Structure'],
    icon: Rocket,
  },
  {
    name: 'Orbit',
    specialty: 'Audience Growth',
    description: 'Builds fan systems and grows your audience.',
    tags: ['Audience Growth', 'Fan Funnels', 'Engagement Systems'],
    icon: Users,
  },
  {
    name: 'Forge',
    specialty: 'Content Strategy',
    description: 'Guides what to post and how to stay consistent.',
    tags: ['Content Planning', 'Short Form Strategy', 'Consistency Systems'],
    icon: FileText,
  },
  {
    name: 'Rise',
    specialty: 'Performance',
    description: 'Tracks what\'s working and optimizes growth.',
    tags: ['Analytics', 'Performance Tracking', 'Optimization'],
    icon: Activity,
  },
  {
    name: 'Align',
    specialty: 'Momentum',
    description: 'Maintains growth and identifies opportunities.',
    tags: ['Growth Strategy', 'Momentum Tracking', 'Opportunity Detection'],
    icon: TrendingUp,
  },
  {
    name: 'Bridge',
    specialty: 'Operations',
    description: 'Supports execution and coordination across your career.',
    tags: ['Coordination', 'Execution', 'Workflow Support'],
    icon: Cog,
  },
];

export default function ArtistGrowth() {
  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0B0B0D 0%, #0f1a12 20%, #0B0B0D 60%, #0B0B0D 100%)' }}>
      <div className="atmospheric-canvas fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/15 to-black"></div>
        <GMGMotif />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 py-32">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-6">
                Artist Operating System
              </p>
              <h1 className="font-black mb-6 leading-[0.92] tracking-tighter">
                <span className="block text-[4rem] md:text-[5rem] lg:text-[6rem]" style={{ color: '#E5E5E7' }}>
                  Run Your Career
                </span>
                <span className="block text-[4rem] md:text-[5rem] lg:text-[6rem]" style={{ color: '#E5E5E7' }}>
                  Like a System
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 mb-8 leading-relaxed font-light">
                Artist OS is GMG's AI-powered system for building, releasing, and growing as an artist.
              </p>
              <p className="text-lg text-white/50 mb-4 leading-relaxed font-light">
                Instead of navigating the music industry alone, you operate inside a structured system powered by AI Artist Reps.
              </p>
              <p className="text-lg text-white/50 mb-4 leading-relaxed font-light">
                They guide releases, audience growth, and day-to-day decisions so you can move faster and scale what's working.
              </p>
              <p className="text-base text-white/35 mb-10 font-light italic">
                This isn't a tool. It's infrastructure for your career.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/get-started"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400/60 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  Start Running Your Career
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl filter blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-sm overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.1)]">
                <div className="absolute inset-0 opacity-[0.04]">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.4) 1px, transparent 1px)`,
                    backgroundSize: '28px 28px'
                  }}></div>
                </div>

                <div className="relative space-y-4">
                  <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-4 border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <Rocket className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">Release Campaign Active</div>
                      <div className="text-xs text-white/40">Orbit is managing rollout strategy</div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-4 border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">Audience Growing +142%</div>
                      <div className="text-xs text-white/40">Rise detected momentum window</div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="flex items-center gap-4 bg-black/40 rounded-2xl p-4 border border-emerald-500/10">
                    <div className="w-12 h-12 bg-emerald-500/15 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <Activity className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">Performance Insight Ready</div>
                      <div className="text-xs text-white/40">Signal flagged 3 optimization points</div>
                    </div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="pt-2 border-t border-white/[0.06]">
                    <p className="text-xs text-white/30 text-center">6 AI Artist Reps active in your system</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SystemRebuildStatement accentColor="emerald" />

      {/* AI Artist Reps Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black"></div>
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-4">AI Artist Reps</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              AI That Helps You Grow
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
              Specialized AI operators supporting your releases, growth, and career decisions in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {aiArtistReps.map((rep, i) => (
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
                      <rep.icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="mb-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-400/50">Specialty</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1">{rep.name}</h3>
                  <p className="text-sm font-semibold text-white/40 mb-4 tracking-wide">{rep.specialty}</p>
                  <p className="text-white/60 font-light leading-relaxed text-sm mb-6">{rep.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {rep.tags.map((tag, j) => (
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
            ))}
          </div>

          <div className="text-center">
            <p className="text-xl text-white/60 font-light mb-8 max-w-2xl mx-auto">
              You're not building alone. You're operating inside a system designed to help you grow.
            </p>
            <Link
              to="/get-started"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-400/50 text-white rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Start Running Your Career
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <CampaignEngine />

      {/* What's Inside Artist OS */}
      <section className="relative py-36 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/8 to-black pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 70%)'
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-emerald-400/50 mb-5">What's Inside</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-7 leading-[0.95]" style={{ color: '#E5E5E7' }}>
              One System.<br />Six Growth Engines.
            </h2>
            <p className="text-lg md:text-xl text-white/45 max-w-3xl mx-auto font-light leading-relaxed">
              Artist OS brings together the essential systems artists need to release smarter, grow audiences, build fan infrastructure, create better content, activate opportunity, and operate at a higher level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            {[
              {
                label: 'RELEASE',
                title: 'Release Engine',
                description: 'Campaign timing, rollout sequencing, and launch structure designed to turn releases into momentum.',
                index: 0,
              },
              {
                label: 'INTELLIGENCE',
                title: 'Audience Intelligence',
                description: 'Live audience signals, fan behavior, regional demand, and growth patterns that show where to push next.',
                index: 1,
              },
              {
                label: 'CONTENT',
                title: 'Content System',
                description: 'Storytelling, positioning, campaign ideas, and content support designed around artist identity and growth.',
                index: 2,
              },
              {
                label: 'INFRASTRUCTURE',
                title: 'Fan Infrastructure',
                description: 'Artist pages, fan capture flows, release destinations, and direct audience pathways built for conversion.',
                index: 3,
              },
              {
                label: 'ACTIVATION',
                title: 'Growth Activation',
                description: 'Connected systems for audience expansion, promotion, campaign support, and opportunity execution.',
                index: 4,
              },
              {
                label: 'OPERATIONS',
                title: 'Artist Operations',
                description: 'Structured support across workflows, coordination, execution, and the systems artists need to scale.',
                index: 5,
              },
            ].map((engine) => (
              <div
                key={engine.index}
                className="group relative bg-zinc-950 hover:bg-zinc-900/80 transition-all duration-500 p-10 overflow-hidden"
                style={{ minHeight: '260px' }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 40%, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
                />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[9px] font-black tracking-[0.28em] uppercase text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors duration-300">
                      {engine.label}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30 group-hover:bg-emerald-400/60 transition-colors duration-300" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-4 leading-tight tracking-tight group-hover:text-white transition-colors duration-300">
                    {engine.title}
                  </h3>

                  <p className="text-white/40 font-light leading-relaxed text-sm group-hover:text-white/55 transition-colors duration-300">
                    {engine.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
              </div>
            ))}
          </div>

          <div className="mt-20 flex flex-col items-center gap-8">
            <p className="text-center text-white/35 font-light text-base md:text-lg max-w-2xl leading-relaxed italic">
              Artist OS is built to function like real artist infrastructure — not a disconnected stack of tools.
            </p>
            <Link
              to="/get-started"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 hover:border-emerald-400/50 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>Artists Are Expected<br />to Do Everything</h2>
          <p className="text-xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Today's artists must handle marketing, releases, audience growth, and business operations while still focusing on music.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Target, color: 'emerald', title: 'Marketing takes too much time', body: 'Running campaigns manually drains creative energy' },
              { icon: Radio, color: 'emerald', title: 'Ads are complex to run', body: 'Platform advertising requires technical expertise' },
              { icon: Calendar, color: 'emerald', title: 'Release planning is manual', body: 'Coordinating timelines across platforms is tedious' },
              { icon: Mic2, color: 'emerald', title: 'Finding collaborators is difficult', body: 'Discovery and connection happens randomly' },
            ].map((item, i) => (
              <div key={i} className="bg-zinc-900/40 border border-white/[0.07] rounded-2xl p-8 text-left hover:border-emerald-500/20 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/15">
                  <item.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-white/40 font-light">{item.body}</p>
              </div>
            ))}
          </div>

          <p className="text-xl text-white font-semibold">
            Artist OS provides the structure and AI support to handle all of it.
          </p>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-12 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>The Artist OS Toolkit</h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto font-light">
              Comprehensive tools designed to help artists grow faster and operate more efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, color: 'emerald', title: 'AI Marketing Tools', desc: 'Automated campaign tools that help artists promote releases and grow their audience.', items: ['Ad campaign tools', 'Marketing automation', 'Fan targeting tools'] },
              { icon: Calendar, color: 'emerald', title: 'Release Planning', desc: 'Plan releases with structured timelines and promotional strategies.', items: ['Release calendars', 'Campaign timelines', 'Promotion checklists'] },
              { icon: Users, color: 'emerald', title: 'Collaboration Discovery', desc: 'Find potential collaborators based on audience signals and music trends.', items: ['Artist discovery suggestions', 'Genre and audience matching', 'Creative collaboration tools'] },
              { icon: TrendingUp, color: 'emerald', title: 'Audience Growth Tools', desc: 'Understand and grow your fanbase using data-driven insights.', items: ['Fan growth analytics', 'Audience engagement tools', 'Platform growth indicators'] },
              { icon: Zap, color: 'emerald', title: 'Campaign Automation', desc: 'Reduce manual work by automating core marketing workflows.', items: ['Scheduled campaigns', 'Automated promotions', 'Release reminders'] },
              { icon: Settings, color: 'emerald', title: 'Artist Operations Support', desc: 'Infrastructure that helps artists operate their careers more efficiently.', items: ['Marketing coordination', 'Release support', 'Operational systems'] },
            ].map((card, i) => (
              <div key={i} className="group relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/15 backdrop-blur-sm hover:-translate-y-1 transition-all duration-500 overflow-hidden hover:border-emerald-400/35 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] p-8">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:border-emerald-400/40 transition-all">
                  <card.icon className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black mb-3 text-white">{card.title}</h3>
                <p className="text-white/50 mb-6 font-light text-sm leading-relaxed">{card.desc}</p>
                <ul className="space-y-2">
                  {card.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/40">
                      <CheckCircle className="w-4 h-4 text-emerald-400/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-8 lg:px-12 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>A Simpler Way to<br />Grow Your Music</h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto font-light">
              Three steps to start growing your artist career inside Artist OS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', color: 'emerald', title: 'Plan your release', body: 'Use AI tools to structure your campaign timeline and promotional strategy.' },
              { num: '02', color: 'emerald', title: 'Launch smarter campaigns', body: 'Automated marketing tools help promote your music across platforms.' },
              { num: '03', color: 'emerald', title: 'Grow your audience', body: 'Campaign analytics and growth systems help expand your reach.' },
            ].map((step, i) => (
              <div key={i} className="relative rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-emerald-500/15 p-8 pt-12">
                <div className="absolute -top-4 left-8 w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                  <span className="text-emerald-400 font-black text-lg">{step.num}</span>
                </div>
                <h3 className="text-2xl font-black mb-4 text-white">{step.title}</h3>
                <p className="text-white/50 leading-relaxed font-light">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ArtistOSProtect />

      <section className="py-32 px-8 lg:px-12 bg-gradient-to-b from-zinc-950 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>Start Running Your Career</h2>
          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Access the tools and infrastructure designed to help artists grow their audience, campaigns, and careers.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/get-started"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400/60 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 text-white/70 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
