import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useRole } from '../auth/RoleContext';
import {
  Sparkles, Mic2, Users, BarChart3, Radio, MessageSquare,
  Target, TrendingUp, Package, Handshake, Music2, Camera,
  Award, Lightbulb, Megaphone, Building2, ArrowRight, LogIn,
  Layers, Zap, Brain, Shield, Tv, Globe, ArrowUp,
  Rocket, Activity, Cog, Mic, FileText, Compass
} from 'lucide-react';
import GMGMotif from '../components/GMGMotif';
import SignalGridBackground from '../components/SignalGridBackground';
import ArtistOSProtect from '../components/ArtistOSProtect';
import ArtistOSAccounting from '../components/ArtistOSAccounting';
import ArtistOSBanking from '../components/ArtistOSBanking';
import CampaignEngine from '../components/CampaignEngine';
import SystemRebuildStatement from '../components/SystemRebuildStatement';

const novaRep = {
  roleLabel: 'ELITE ARTIST REP',
  name: 'Apex',
  function: 'Elite Artist Rep',
  badge: 'ELITE',
  sublabel: null as string | null,
  description: 'Leads high-level artist strategy, aligning releases, growth systems, partnerships, and long-term positioning into a unified execution plan.',
  tags: ['Strategic Direction', 'Career Architecture', 'System Alignment'],
  icon: Award,
};

const aiArtistReps = [
  {
    roleLabel: 'RELEASE STRATEGY',
    name: 'Velar',
    function: 'Campaign Architect',
    badge: 'MASTER',
    sublabel: null as string | null,
    description: 'Supports release planning, rollout timing, and coordinated execution across singles, EPs, and album cycles.',
    tags: ['Release Planning', 'Rollout Timing', 'Campaign Structure'],
    icon: Rocket,
  },
  {
    roleLabel: 'AUDIENCE GROWTH',
    name: 'Mira',
    function: 'Audience Builder',
    badge: 'MASTER',
    sublabel: null as string | null,
    description: 'Helps identify growth opportunities across fan development, engagement systems, and audience momentum.',
    tags: ['Audience Growth', 'Fan Engagement', 'Momentum Strategy'],
    icon: TrendingUp,
  },
  {
    roleLabel: 'GROWTH OPERATOR',
    name: 'Flux',
    function: 'Growth Operator',
    badge: 'SENIOR',
    sublabel: 'GENERALIST',
    description: 'Connects release strategy, audience growth, and content systems to ensure momentum is consistent across platforms and campaigns.',
    tags: ['Cross-Channel Growth', 'Campaign Continuity', 'Momentum Systems'],
    icon: Activity,
  },
  {
    roleLabel: 'ARTIST OPERATIONS',
    name: 'Axiom',
    function: 'Operations Lead',
    badge: 'SENIOR',
    sublabel: null as string | null,
    description: 'Supports day-to-day execution, team coordination, and operational consistency across the artist business.',
    tags: ['Team Coordination', 'Execution Support', 'Workflow Systems'],
    icon: Cog,
  },
  {
    roleLabel: 'MARKETING SYSTEMS',
    name: 'Forge',
    function: 'Marketing Systems Operator',
    badge: 'SENIOR',
    sublabel: 'GENERALIST',
    description: 'Coordinates marketing execution across releases, content, and audience touchpoints to maintain visibility, engagement, and expansion.',
    tags: ['Marketing Systems', 'Audience Touchpoints', 'Release Amplification'],
    icon: Radio,
  },
  {
    roleLabel: 'CATALOG & CONTENT',
    name: 'Sol',
    function: 'Content Operator',
    badge: 'SENIOR',
    sublabel: null as string | null,
    description: 'Supports content planning, catalog positioning, and release-to-content alignment across the artist ecosystem.',
    tags: ['Content Systems', 'Catalog Positioning', 'Release Alignment'],
    icon: FileText,
  },
  {
    roleLabel: 'PERFORMANCE',
    name: 'Lyric',
    function: 'Performance Strategist',
    badge: 'JUNIOR',
    sublabel: null as string | null,
    description: 'Helps align live performance, content rhythm, and audience response into a stronger artist growth loop.',
    tags: ['Live Strategy', 'Performance Rhythm', 'Audience Response'],
    icon: Mic,
  },
  {
    roleLabel: 'CAREER DIRECTION',
    name: 'Rune',
    function: 'Career Navigator',
    badge: 'JUNIOR',
    sublabel: null as string | null,
    description: 'Helps artists make better long-range decisions across timing, priorities, and strategic next moves.',
    tags: ['Strategic Direction', 'Decision Support', 'Career Prioritization'],
    icon: Compass,
  },
];

function getDashboardPath(role: string | null): string {
  if (role === 'admin_team') return '/dashboard/artist-os';
  if (role === 'label_partner') return '/dashboard/artist-os';
  return '/dashboard/artist-os';
}

export default function Platform() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { roleState } = useRole();

  function handleEnterSystem() {
    if (auth.authenticated) {
      navigate(getDashboardPath(roleState.role));
    } else {
      navigate('/login/artist-os');
    }
  }

  const hotspots = [
    {
      id: 'breakout',
      label: 'Breakout Score',
      description: 'A proprietary signal-weighted score estimating breakout potential across audience growth, engagement, and cultural momentum.',
      position: { top: '28%', left: '72%' }
    },
    {
      id: 'momentum',
      label: 'Artist Momentum',
      description: 'A live measure of acceleration across streaming, social activity, and audience response.',
      position: { top: '45%', left: '15%' }
    },
    {
      id: 'signals',
      label: 'Signal Detection',
      description: 'AI-driven identification of meaningful artist activity before it becomes obvious to the wider market.',
      position: { top: '65%', left: '50%' }
    }
  ];

  return (
    <div className="min-h-screen text-gmg-white" style={{
      background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 20%, #221B33 40%, #171322 60%, #0B0B0D 100%)'
    }}>
      <div className="atmospheric-canvas fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-cinematic-base">
        <SignalGridBackground />
        <div className="hero-atmospheric-light"></div>
        <GMGMotif />
        <div className="absolute inset-0 film-grain"></div>
        <div className="absolute inset-0 vignette"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium text-white/40 tracking-[0.25em] uppercase mb-8">Artist Operating System</p>

            <h1 className="font-black mb-6 leading-[0.92] tracking-tighter text-center">
              <span className="block text-[5.5rem] md:text-[7rem] lg:text-[8.5rem]" style={{ color: '#E5E5E7' }}>Artist OS</span>
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold text-white/80 mb-10 tracking-tight">
              Your Career, Operated as a System
            </h2>

            <p className="text-xl md:text-2xl text-white/60 mb-6 leading-relaxed font-light max-w-3xl mx-auto">
              Artist OS is GMG's career operating system — built to run releases, growth, operations, and financial infrastructure for modern artists.
            </p>

            <p className="text-lg text-white/50 mb-4 leading-relaxed font-light max-w-3xl mx-auto">
              You operate inside a structured system, supported by AI Artist Reps assigned to your releases, growth strategy, and day-to-day execution.
            </p>
            <p className="text-lg text-white/50 mb-4 leading-relaxed font-light max-w-3xl mx-auto">
              Every layer compounds. Decisions move faster. The system scales with you.
            </p>
            <p className="text-base text-white/35 mb-12 font-light italic">
              Not a tool. Not a platform. An operating system for careers.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <button
                onClick={handleEnterSystem}
                className="group px-10 py-5 btn-glass-hero text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                Enter the System
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/get-started"
                onClick={() => window.scrollTo(0, 0)}
                className="px-10 py-5 btn-glass-hero-secondary text-gmg-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Artist / Partner Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      <SystemRebuildStatement accentColor="emerald" />

      {/* AI Artist Reps Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/10 to-black"></div>
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-6">
            <p className="text-xs font-medium text-emerald-400/60 tracking-[0.25em] uppercase mb-4">AI Workforce — Artist Layer</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              AI Artist Reps
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-3">
              A structured AI workforce deployed across the artist journey — each rep assigned to a defined function, level, and set of outcomes.
            </p>
            <p className="text-lg text-white/50 max-w-3xl mx-auto font-light leading-relaxed mb-3">
              From release execution to elite strategic direction — every layer of the career is covered. This is not assistance. It's a defined operational structure.
            </p>
            <p className="text-sm font-medium text-emerald-400/50 tracking-[0.15em] uppercase">
              Operating continuously. Assigned by function. Coordinated across the platform.
            </p>
          </div>

          {/* Nova — Featured Elite Card */}
          <div className="mt-16 mb-6">
            <div className="group relative rounded-2xl overflow-hidden border border-amber-400/30 hover:border-amber-400/55 transition-all duration-500 hover:-translate-y-1 shadow-[0_16px_60px_rgba(0,0,0,0.9),0_0_60px_rgba(245,158,11,0.08)] hover:shadow-[0_0_60px_rgba(245,158,11,0.2),0_24px_80px_rgba(245,158,11,0.1)]"
              style={{ background: 'linear-gradient(135deg, #111008 0%, #1a1505 40%, #0e0d0b 100%)' }}>
              <div className="absolute inset-0 opacity-[0.035]" style={{
                backgroundImage: `linear-gradient(to right, rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.5) 1px, transparent 1px)`,
                backgroundSize: '32px 32px'
              }} />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-transparent pointer-events-none" />

              <div className="relative p-8 md:p-10 flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-amber-500/10 border border-amber-500/30 shadow-[0_0_32px_rgba(245,158,11,0.25)] group-hover:shadow-[0_0_48px_rgba(245,158,11,0.4)] transition-all duration-500">
                    <novaRep.icon className="w-10 h-10 text-amber-400" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-400/60">{novaRep.roleLabel}</span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2.5 py-0.5 bg-amber-400/15 text-amber-300 border border-amber-400/30 rounded-full">ELITE</span>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-0.5 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">LIVE OPERATOR</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{novaRep.name}</h3>
                  <p className="text-sm font-semibold text-amber-400/50 mb-4 tracking-wide uppercase">{novaRep.function}</p>
                  <p className="text-white/65 font-light leading-relaxed text-base mb-5 max-w-2xl">{novaRep.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {novaRep.tags.map((tag, j) => (
                      <span key={j} className="text-[11px] font-medium px-3 py-1 bg-amber-500/[0.06] border border-amber-500/20 text-amber-300/70 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rep Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {aiArtistReps.map((rep, i) => {
              const badgeStyles: Record<string, string> = {
                ELITE: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
                MASTER: 'bg-sky-400/10 text-sky-300 border-sky-400/25',
                SENIOR: 'bg-white/[0.06] text-white/55 border-white/[0.1]',
                JUNIOR: 'bg-white/[0.03] text-white/35 border-white/[0.07]',
              };
              const badgeStyle = badgeStyles[rep.badge] || badgeStyles.JUNIOR;
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

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/25 shadow-[0_0_16px_rgba(16,185,129,0.2)] group-hover:shadow-[0_0_24px_rgba(16,185,129,0.35)] transition-all duration-500">
                        <rep.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 rounded-full">
                        Deployed
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-emerald-400/50">{rep.roleLabel}</span>
                      {rep.sublabel && (
                        <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/25">· {rep.sublabel}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xl font-black text-white">{rep.name}</h3>
                      <span className={`text-[9px] font-black tracking-[0.18em] uppercase px-2 py-0.5 rounded-full border ${badgeStyle}`}>{rep.badge}</span>
                    </div>
                    <p className="text-xs font-semibold text-white/40 mb-3 tracking-wide">{rep.function}</p>
                    <p className="text-white/55 font-light leading-relaxed text-xs mb-5">{rep.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {rep.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="text-[10px] font-medium px-2.5 py-0.5 bg-white/[0.04] border border-white/[0.08] text-white/45 rounded-full"
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
              AI Artist Reps augment human teams — adding execution depth, decision support, and continuous momentum across every stage of the career.
            </p>
            <Link
              to="/get-started"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-3 px-10 py-5 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-400/50 text-white rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Request Access to the Artist Workforce
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      <CampaignEngine />

      <div className="cinematic-divider" />

      {/* Dashboard Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>
        <GMGMotif />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-xs font-medium text-gmg-violet/60 tracking-[0.2em] uppercase mb-6">Live Platform</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tight" style={{ color: '#E5E5E7' }}>
              Inside the Artist Operating System
            </h2>
            <p className="text-xl text-gmg-white/75 max-w-3xl mx-auto mb-6 font-light leading-relaxed">
              A live command center — real-time signal intelligence, artist momentum tracking, and breakout detection across the full GMG discovery network.
            </p>
            <div className="flex justify-center">
              <p className="text-sm text-violet-300/60 max-w-xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-violet-500/10 rounded-full px-8 py-3 inline-block backdrop-blur-sm">
                Live platform access is restricted to approved partners and artists.
              </p>
            </div>
          </div>

          {/* Dashboard Mock Panel */}
          <div className="relative mb-16 max-w-[1400px] mx-auto">
            <div className="absolute inset-0 bg-gradient-radial from-violet-500/20 via-transparent to-transparent blur-3xl opacity-60 pointer-events-none"></div>

            <div className="relative rounded-2xl overflow-hidden border border-violet-400/30 bg-gradient-to-br from-violet-950/40 via-black/60 to-black/80 backdrop-blur-xl shadow-[0_0_80px_rgba(139,92,246,0.3)] p-12">
              {/* Futuristic Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(139,92,246,0.2) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(139,92,246,0.2) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="relative">
                {/* Metrics Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  {/* Signals Detected Today - Active pulse animation */}
                  <div className="relative bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-400/20 rounded-xl p-6 hover:border-violet-400/40 transition-colors overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial from-emerald-400/10 via-transparent to-transparent opacity-0 animate-pulse"></div>
                    <div className="relative">
                      <div className="text-violet-400/60 text-xs font-medium uppercase tracking-wider mb-2">Signals Detected Today</div>
                      <div className="text-4xl font-black text-violet-300 mb-2">142</div>
                      <div className="flex items-center gap-2 mt-3">
                        <ArrowUp className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400 font-medium">+8 signals in the last hour</span>
                      </div>
                      <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-transparent rounded-full mt-2 shadow-[0_0_8px_rgba(52,211,153,0.4)]"></div>
                    </div>
                  </div>

                  {/* Artists Under Tracking */}
                  <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-colors">
                    <div className="text-cyan-400/60 text-xs font-medium uppercase tracking-wider mb-2">Artists Under Tracking</div>
                    <div className="text-4xl font-black text-cyan-300 mb-2">3,218</div>
                    <div className="flex items-center gap-2 mt-3">
                      <ArrowUp className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs text-cyan-400/80 font-medium">+46 new artists added this week</span>
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-cyan-400 to-transparent rounded-full mt-2"></div>
                  </div>

                  {/* Breakout Alerts */}
                  <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-400/20 rounded-xl p-6 hover:border-pink-400/40 transition-colors">
                    <div className="text-pink-400/60 text-xs font-medium uppercase tracking-wider mb-2">Breakout Alerts</div>
                    <div className="text-4xl font-black text-pink-300 mb-2">29</div>
                    <div className="flex items-center gap-2 mt-3">
                      <ArrowUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-pink-400/80 font-medium">3 new alerts in the past 24 hours</span>
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-pink-400 to-transparent rounded-full mt-2"></div>
                  </div>

                  {/* Global Scene Clusters */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-400/20 rounded-xl p-6 hover:border-purple-400/40 transition-colors">
                    <div className="text-purple-400/60 text-xs font-medium uppercase tracking-wider mb-2">Global Scene Clusters</div>
                    <div className="text-4xl font-black text-purple-300 mb-2">47</div>
                    <div className="flex items-center gap-2 mt-3">
                      <ArrowUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-purple-400/80 font-medium">2 emerging scenes detected this week</span>
                    </div>
                    <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-transparent rounded-full mt-2"></div>
                  </div>
                </div>

                {/* Access Notice */}
                <div className="text-center py-8 border-t border-violet-400/20">
                  <div className="inline-flex items-center gap-3 text-sm text-violet-300/80">
                    <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></div>
                    <span>System is live. Access is restricted to approved partners and artists.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Platform Interface Screenshot */}
          <div className="mt-20">
            <div className="text-center mb-10">
              <p className="text-xs font-medium text-violet-400/60 tracking-[0.2em] uppercase mb-3">Live Platform Interface</p>
              <p className="text-sm text-gmg-white/60 max-w-2xl mx-auto mt-4">
                Operational view from the GMG discovery and intelligence system.
              </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-violet-400/20 bg-gradient-to-br from-violet-950/20 via-black/40 to-black/60 backdrop-blur-xl shadow-[0_0_60px_rgba(139,92,246,0.2)]">
              <img
                src="/Screenshot_2026-03-12_at_12.08.13_PM.png"
                alt="GMG Platform Interface - Artist Discovery Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <Link
              to="/get-started"
              onClick={() => window.scrollTo(0, 0)}
              className="group px-8 py-4 btn-glass-hero text-white rounded-xl font-semibold text-base flex items-center gap-2"
            >
              Request Platform Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* What's Inside Artist OS */}
      <section className="relative py-36 px-8 lg:px-12 overflow-hidden bg-black">
        {/* Ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(16,185,129,0.04) 0%, transparent 65%)'
        }} />
        {/* Slow pulse glow layer */}
        <div className="absolute inset-0 pointer-events-none animate-[pulse-slow_6s_ease-in-out_infinite]" style={{
          background: 'radial-gradient(ellipse 50% 35% at 50% 60%, rgba(16,185,129,0.025) 0%, transparent 70%)'
        }} />
        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse-slow_2.5s_ease-in-out_infinite]" />
              <p className="text-[10px] font-black tracking-[0.32em] uppercase text-emerald-400/55">What's Inside Artist OS</p>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-[pulse-slow_2.5s_ease-in-out_infinite_0.5s]" />
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-7 leading-[0.93]" style={{ color: '#E5E5E7' }}>
              The System Behind<br />Modern Artist Growth
            </h2>
            <p className="text-lg md:text-xl text-white/45 max-w-3xl mx-auto font-light leading-relaxed">
              Artist OS is a live system — coordinating releases, audience growth, content, and career execution in real time.
            </p>
          </div>

          {/* System panel container */}
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.0) 40%, rgba(16,185,129,0.06) 100%)',
              filter: 'blur(1px)'
            }} />
            {/* Animated grid background inside panel */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
              <div className="absolute inset-0 animate-[atmospheric-drift_25s_linear_infinite]" style={{
                backgroundImage: `linear-gradient(to right, rgba(16,185,129,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.04) 1px, transparent 1px)`,
                backgroundSize: '48px 48px',
                transform: 'translateZ(0)'
              }} />
            </div>

            <div
              className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-emerald-500/10 hover:border-emerald-500/18 transition-colors duration-700"
              style={{
                background: 'rgba(16,185,129,0.04)',
                boxShadow: '0 0 0 1px rgba(16,185,129,0.06), 0 0 80px rgba(0,0,0,0.95), 0 0 120px rgba(16,185,129,0.05)'
              }}
            >
              {[
                {
                  label: 'RELEASE STRATEGY',
                  title: 'Release Strategy',
                  description: 'Plan launches, timing, rollout structure, and momentum windows around each release.',
                  idx: 0,
                },
                {
                  label: 'FAN GROWTH',
                  title: 'Fan Growth',
                  description: 'Build audience loops that turn discovery into retention, engagement, and long-term growth.',
                  idx: 1,
                },
                {
                  label: 'CONTENT ENGINE',
                  title: 'Content Engine',
                  description: 'Structure content creation, posting systems, campaign assets, and platform-native storytelling.',
                  idx: 2,
                },
                {
                  label: 'AUDIENCE INTELLIGENCE',
                  title: 'Audience Intelligence',
                  description: 'Surface the signals that matter across listener behavior, momentum, fan response, and market activity.',
                  idx: 3,
                },
                {
                  label: 'CAREER INFRASTRUCTURE',
                  title: 'Career Infrastructure',
                  description: 'Support the real business behind the artist including operations, coordination, monetization pathways, and support systems.',
                  idx: 4,
                },
                {
                  label: 'AI GUIDANCE LAYER',
                  title: 'AI Guidance Layer',
                  description: 'Give artists strategic AI support across planning, execution, growth decisions, and daily workflow.',
                  idx: 5,
                },
              ].map((engine) => (
                <div
                  key={engine.idx}
                  className="group relative bg-[#060808] hover:bg-[#08100d] transition-all duration-500 p-10 lg:p-12 overflow-hidden"
                  style={{ minHeight: '290px', zIndex: 1 }}
                >
                  {/* Hover radial glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse 60% 60% at 20% 30%, rgba(16,185,129,0.09) 0%, transparent 65%)' }}
                  />
                  {/* Top edge signal sweep — animates left to right on hover via clip trick */}
                  <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        transform: 'translateX(-100%)',
                        animation: 'none'
                      }}
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"
                      style={{
                        transform: 'translateX(-100%)',
                        transition: 'transform 0s',
                      }}
                    />
                    <style>{`
                      .group:hover .signal-sweep-${engine.idx} {
                        animation: signal-sweep 0.55s ease-out forwards !important;
                      }
                      @keyframes signal-sweep {
                        from { transform: translateX(-100%); opacity: 1; }
                        to   { transform: translateX(100%);  opacity: 0.6; }
                      }
                    `}</style>
                    <div
                      className={`signal-sweep-${engine.idx} absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent`}
                      style={{ transform: 'translateX(-100%)' }}
                    />
                  </div>
                  {/* Card lift shadow on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-sm" style={{
                    boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.12)'
                  }} />

                  <div className="relative z-10 transform group-hover:-translate-y-0.5 transition-transform duration-400">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-[9px] font-black tracking-[0.3em] uppercase text-emerald-400/30 group-hover:text-emerald-400/70 transition-colors duration-300">
                        {engine.label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/15 group-hover:bg-emerald-400/60 transition-all duration-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/25 group-hover:bg-emerald-400 group-hover:shadow-[0_0_6px_rgba(16,185,129,0.8)] transition-all duration-400" />
                        <div className="w-1 h-1 rounded-full bg-emerald-500/15 group-hover:bg-emerald-400/60 transition-all duration-500" />
                      </div>
                    </div>

                    <h3 className="text-[1.6rem] font-black text-white/85 mb-4 leading-tight tracking-tight group-hover:text-white transition-colors duration-300">
                      {engine.title}
                    </h3>

                    <div className="h-px mb-5 bg-gradient-to-r from-emerald-500/20 to-transparent group-hover:from-emerald-400/55 transition-all duration-500" style={{ width: '2.5rem' }} />

                    <p className="text-white/32 font-light leading-relaxed text-sm group-hover:text-white/58 transition-colors duration-300">
                      {engine.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center gap-10">
            <p className="text-center font-light leading-relaxed tracking-wide max-w-lg">
              <span className="block text-white/22 text-sm md:text-base">This isn't software you use.</span>
              <span className="block text-white/35 text-sm md:text-base mt-1">It's a system that runs alongside you.</span>
            </p>
            <Link
              to="/get-started"
              onClick={() => window.scrollTo(0, 0)}
              className="group inline-flex items-center gap-3 px-11 py-5 bg-emerald-500/[0.07] hover:bg-emerald-500/[0.13] border border-emerald-500/22 hover:border-emerald-400/55 text-white rounded-xl font-semibold text-lg transition-all duration-400 hover:shadow-[0_0_60px_rgba(16,185,129,0.22),0_0_20px_rgba(16,185,129,0.1)] hover:scale-[1.025] active:scale-[0.98]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            >
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* System Reveal Section */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-violet-950/8 to-black"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-white/30 tracking-[0.25em] uppercase mb-4">GMG AI System</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              One System. Multiple Layers.
            </h2>
            <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed mb-3">
              GMG runs as a unified intelligence system — discovery, artist operations, catalog optimization, and industry infrastructure operating in coordination.
            </p>
            <p className="text-lg text-white/45 max-w-2xl mx-auto font-light leading-relaxed">
              Each layer feeds the next. Output compounds. The system gets stronger over time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'AI Scouts',
                layer: 'Discovery Layer',
                description: 'Deployed continuously across the discovery layer — surfacing emerging artists, cultural signals, and breakout momentum before the market.',
                color: 'violet',
                rgb: '139,92,246',
                icon: Sparkles,
              },
              {
                label: 'AI Artist Reps',
                layer: 'Artist Layer',
                description: 'Assigned to the artist layer — executing releases, audience development, marketing operations, and career-level decisions.',
                color: 'emerald',
                rgb: '16,185,129',
                icon: Mic2,
              },
              {
                label: 'AI Catalog Operators',
                layer: 'Catalog Layer',
                description: 'Assigned to the catalog layer — optimizing streaming performance, metadata integrity, and long-term revenue positioning.',
                color: 'cyan',
                rgb: '6,182,212',
                icon: Layers,
              },
              {
                label: 'AI Coworkers',
                layer: 'Industry Layer',
                description: 'Deployed across the industry layer — finance, touring, media, and operations, supporting structured execution and institutional coordination.',
                color: 'sky',
                rgb: '14,165,233',
                icon: Users,
              },
            ].map((node, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border backdrop-blur-sm p-7 transition-all duration-500 bg-gradient-to-b from-white/[0.03] to-transparent ${
                  node.color === 'violet'
                    ? 'border-violet-500/25 hover:border-violet-400/45 hover:shadow-[0_0_32px_rgba(139,92,246,0.18)]'
                    : node.color === 'emerald'
                    ? 'border-emerald-500/25 hover:border-emerald-400/45 hover:shadow-[0_0_32px_rgba(16,185,129,0.18)]'
                    : node.color === 'cyan'
                    ? 'border-cyan-500/25 hover:border-cyan-400/45 hover:shadow-[0_0_32px_rgba(6,182,212,0.18)]'
                    : 'border-sky-500/25 hover:border-sky-400/45 hover:shadow-[0_0_32px_rgba(14,165,233,0.18)]'
                }`}
              >
                <div className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full mb-5 border ${
                  node.color === 'violet'
                    ? 'bg-violet-400/10 text-violet-400 border-violet-400/20'
                    : node.color === 'emerald'
                    ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                    : node.color === 'cyan'
                    ? 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
                    : 'bg-sky-400/10 text-sky-400 border-sky-400/20'
                }`}>
                  <node.icon className="w-3 h-3" />
                  {node.label}
                </div>
                <h3 className="text-lg font-black text-white mb-1">{node.layer}</h3>
                <div className={`w-8 h-px mb-4 ${
                  node.color === 'violet' ? 'bg-violet-500/50' : node.color === 'emerald' ? 'bg-emerald-500/50' : node.color === 'cyan' ? 'bg-cyan-500/50' : 'bg-sky-500/50'
                }`}></div>
                <p className="text-white/50 font-light leading-relaxed text-sm">{node.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/30 font-medium tracking-[0.12em] uppercase">
              All layers run continuously — coordinated across the GMG system.
            </p>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* Platform Capabilities */}
      <section className="relative py-32 px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/20 to-black"></div>
        <GMGMotif />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <p className="text-xs font-medium text-white/30 tracking-[0.25em] uppercase mb-4">System Architecture</p>
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
              The GMG System Stack
            </h2>
            <p className="text-xl text-gmg-white/65 max-w-3xl mx-auto font-light leading-relaxed">
              Institutional-grade infrastructure across every dimension of the modern artist business.
            </p>
          </div>

          {/* Capability Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Artist Intelligence */}
            <div className="bg-gradient-to-br from-violet-500/10 to-transparent border border-violet-400/20 rounded-xl p-8 hover:border-violet-400/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-violet-300 text-base font-extrabold mb-5">Artist Intelligence</h3>
              <div className="space-y-3">
                {['AI signal detection', 'Artist discovery engine', 'Audience intelligence layer', 'Breakout prediction'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-violet-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Infrastructure */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-400/20 rounded-xl p-8 hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-cyan-300 text-base font-extrabold mb-5">Growth Infrastructure</h3>
              <div className="space-y-3">
                {['Marketing execution layer', 'Media amplification', 'Audience development', 'Fan intelligence', 'Campaign deployment'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-cyan-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Infrastructure */}
            <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-400/20 rounded-xl p-8 hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-purple-300 text-base font-extrabold mb-5">Distribution Infrastructure</h3>
              <div className="space-y-3">
                {['Release architecture', 'Platform delivery', 'Catalog management', 'Strategic release coordination'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Artist Operations */}
            <div className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-400/20 rounded-xl p-8 hover:border-pink-400/50 hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-pink-300 text-base font-extrabold mb-5">Artist Operations</h3>
              <div className="space-y-3">
                {['Operational workflow management', 'Touring coordination', 'Release execution', 'Partnership infrastructure', 'Strategic planning layer'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-pink-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Infrastructure */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-400/20 rounded-xl p-8 hover:border-emerald-400/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-emerald-300 text-base font-extrabold mb-5">Financial Infrastructure</h3>
              <div className="space-y-3">
                {['Institutional banking access', 'Royalty-backed credit', 'Capital positioning', 'Financial planning layer', 'Cash flow visibility'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Protection Infrastructure */}
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-400/20 rounded-xl p-8 hover:border-blue-400/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-blue-300 text-base font-extrabold mb-5">Protection Infrastructure</h3>
              <div className="space-y-3">
                {['Tour & event insurance', 'Cancellation coverage', 'Equipment & asset protection', 'Liability coverage', 'Risk management layer'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Infrastructure */}
            <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-400/20 rounded-xl p-8 hover:border-amber-400/50 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-amber-300 text-base font-extrabold mb-5">Live Infrastructure</h3>
              <div className="space-y-3">
                {['Venue network access', 'Event programming', 'Touring infrastructure', 'Cultural media integration'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Media Infrastructure */}
            <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-400/20 rounded-xl p-8 hover:border-rose-400/50 hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:translate-y-[-2px] transition-all duration-300 backdrop-blur-xl">
              <h3 className="text-rose-300 text-base font-extrabold mb-5">Media Infrastructure</h3>
              <div className="space-y-3">
                {['Content distribution', 'Platform partnerships', 'Original cultural programming', 'Brand collaboration layer'].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gmg-white/80">
                    <div className="w-1 h-1 rounded-full bg-rose-400 mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Access Layer Intro */}
      <section className="relative py-24 px-8 lg:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-950/8 to-black"></div>
        <GMGMotif />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <p className="text-xs font-medium text-emerald-400/55 tracking-[0.25em] uppercase mb-5">Institutional Access Layer</p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight" style={{ color: '#E5E5E7' }}>
            Institutional Access.<br />Built Into the System.
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
            Through GMG's institutional partner network, artists and companies access financial, protection, and capital infrastructure that was previously available only to major label rosters and established enterprises.
          </p>
        </div>
      </section>

      <ArtistOSProtect />

      <div className="cinematic-divider" />

      <ArtistOSAccounting />

      <div className="cinematic-divider" />

      <ArtistOSBanking />

      <div className="cinematic-divider" />

      {/* Final CTA */}
      <section className="py-48 px-8 lg:px-12 cinematic-gradient-dark film-grain relative overflow-hidden">
        <div className="absolute inset-0 cinematic-lighting"></div>
        <GMGMotif />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="font-black mb-8 leading-[0.92] tracking-tighter">
            <span className="block text-[3.5rem] md:text-[5rem] lg:text-[6.5rem]" style={{ color: '#E5E5E7' }}>Enter the System</span>
          </h2>

          <p className="text-xl text-white/55 max-w-2xl mx-auto font-light leading-relaxed mb-16">
            Access is selective. The system operates with approved artists, companies, and partners at scale or in active growth. Not everyone qualifies.
          </p>

          <div className="flex justify-center">
            <Link
              to="/get-started"
              onClick={() => window.scrollTo(0, 0)}
              className="group px-12 py-6 btn-glass-primary text-white rounded-xl font-semibold text-xl flex items-center justify-center gap-2"
            >
              Request Access
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <p className="mt-20 text-xs text-white/20 tracking-[0.18em] uppercase">
            GMG AI systems operate continuously across all layers.
          </p>
        </div>
      </section>
    </div>
  );
}
