// =============================================================================
// LOCKED PRODUCTION PAGE — Catalog OS public marketing page
// Do NOT redesign, regenerate, or replace this component.
// Only make scoped, targeted edits to specific sections.
// Route: /catalog-os  (see src/lib/routes.ts → ROUTES.CATALOG_OS_PUBLIC)
// Login CTA points to: /catalog-os/login  (ROUTES.LOGIN_CATALOG_OS)
// =============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  LayoutGrid,
  Globe,
  TrendingUp,
  RefreshCw,
  Database,
  Send,
  BarChart2,
  Archive,
  Activity,
  LogIn,
} from 'lucide-react';
import CatalogAccessRequestModal from '../components/CatalogAccessRequestModal';
import GMGMotif from '../components/GMGMotif';
import SignalGridBackground from '../components/SignalGridBackground';

const systemFunctions = [
  {
    icon: LayoutGrid,
    title: 'Optimize Performance',
    description: 'Improve streaming, discovery, and retention across all releases.',
    color: '#14b8a6',
  },
  {
    icon: Globe,
    title: 'Expand Audience',
    description: 'Activate new listeners through data-driven targeting and distribution logic.',
    color: '#14b8a6',
  },
  {
    icon: TrendingUp,
    title: 'Maximize Revenue',
    description: 'Unlock new income across platforms, territories, and formats.',
    color: '#a855f7',
  },
  {
    icon: RefreshCw,
    title: 'Automate Growth',
    description: 'Continuously improve catalog performance using AI systems operating around the clock.',
    color: '#14b8a6',
  },
];

const aiSystems = [
  {
    system: 'INDEX',
    name: 'Index',
    tier: 'MASTER',
    subtitle: 'Metadata Intelligence',
    description: 'Cleans, structures, and optimizes catalog data across every release — ensuring accurate tagging, discoverability, and long-term catalog integrity.',
    tags: ['Metadata Optimization', 'Catalog Structuring', 'Data Integrity'],
    icon: Database,
    color: '#14b8a6',
  },
  {
    system: 'RELAY',
    name: 'Relay',
    tier: 'MASTER',
    subtitle: 'Distribution Engine',
    description: 'Routes content across platforms and territories for maximum reach — coordinating delivery, updates, and synchronization in real time.',
    tags: ['Platform Delivery', 'Territory Routing', 'Release Sync'],
    icon: Send,
    color: '#14b8a6',
  },
  {
    system: 'AMPLIFY',
    name: 'Amplify',
    tier: 'MASTER',
    subtitle: 'Catalog Growth',
    description: 'Re-engages existing audiences and activates new listeners through data-driven targeting, playlist strategy, and sustained streaming growth loops.',
    tags: ['Audience Re-engagement', 'Playlist Strategy', 'Growth Loops'],
    icon: TrendingUp,
    color: '#14b8a6',
  },
  {
    system: 'YIELD',
    name: 'Yield',
    tier: 'SENIOR',
    subtitle: 'Revenue Optimization',
    description: 'Identifies and unlocks monetization opportunities across platforms, territories, licensing channels, and revenue formats.',
    tags: ['Revenue Tracking', 'Monetization Expansion', 'Yield Optimization'],
    icon: BarChart2,
    color: '#14b8a6',
  },
  {
    system: 'ARCHIVE',
    name: 'Archive',
    tier: 'SENIOR',
    subtitle: 'Catalog Structuring',
    description: 'Organizes, maintains, and preserves long-term catalog health — ensuring every asset is properly structured, accessible, and protected.',
    tags: ['Asset Organization', 'Long-term Health', 'Catalog Preservation'],
    icon: Archive,
    color: '#14b8a6',
  },
  {
    system: 'SIGNALFLOW',
    name: 'SignalFlow',
    tier: 'SENIOR',
    subtitle: 'Performance Tracking',
    description: 'Monitors real-time streaming performance, audience signals, and platform behavior — triggering optimization actions when and where they matter.',
    tags: ['Real-time Monitoring', 'Signal Detection', 'Performance Triggers'],
    icon: Activity,
    color: '#14b8a6',
  },
];

const steps = [
  {
    num: '01',
    icon: LayoutGrid,
    title: 'Structure the Catalog',
    description: 'Organize releases, metadata, and assets into a clean, scalable system — so every element is optimized for discovery and performance.',
  },
  {
    num: '02',
    icon: Globe,
    title: 'Activate Distribution + Discovery',
    description: 'Deploy content across platforms with optimized positioning — routing to the right territories, playlists, and audience segments.',
    highlighted: true,
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Optimize in Real Time',
    description: 'AI systems continuously improve performance, reach, and revenue — responding to signals and compounding results over time.',
    highlighted: true,
  },
];

export default function CatalogOS() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 20%, #221B33 40%, #171322 60%, #0B0B0D 100%)' }}>
      <CatalogAccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden hero-cinematic-base">
        <SignalGridBackground />
        <div className="hero-atmospheric-light" />
        <GMGMotif />
        <div className="absolute inset-0 film-grain" />
        <div className="absolute inset-0 vignette" />

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-medium text-white/40 tracking-[0.25em] uppercase mb-8">
              Catalog Operating System
            </p>

            <h1 className="font-black mb-6 leading-[0.92] tracking-tighter text-center">
              <span
                className="block"
                style={{ fontSize: 'clamp(4.5rem, 11vw, 8.5rem)', color: '#E5E5E7' }}
              >
                Catalog OS
              </span>
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
                to="/catalog-os/login"
                className="group px-10 py-5 btn-glass-hero text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                Access Catalog OS
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setModalOpen(true)}
                className="px-10 py-5 btn-glass-hero-secondary text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Partner Access
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="cinematic-divider" />

      {/* ── WHAT CATALOG OS DOES ── */}
      <section
        className="relative py-28 px-8 overflow-hidden"
        style={{ background: '#08080f' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 15% 25%, rgba(180,180,255,0.12) 0%, transparent 100%),
              radial-gradient(1px 1px at 35% 65%, rgba(180,180,255,0.08) 0%, transparent 100%),
              radial-gradient(1px 1px at 60% 20%, rgba(180,180,255,0.10) 0%, transparent 100%),
              radial-gradient(1px 1px at 80% 75%, rgba(180,180,255,0.09) 0%, transparent 100%),
              radial-gradient(1px 1px at 92% 40%, rgba(180,180,255,0.07) 0%, transparent 100%)
            `,
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p
            className="text-xs font-semibold tracking-[0.28em] uppercase mb-5"
            style={{ color: 'rgba(20,184,166,0.7)' }}
          >
            SYSTEM FUNCTIONS
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight" style={{ color: '#F0F0F8' }}>
            What Catalog OS Does
          </h2>
          <p
            className="text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(200,200,235,0.55)' }}
          >
            Four core functions running simultaneously — optimizing every dimension of catalog performance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {systemFunctions.map((fn, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 text-left transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(20,184,166,0.12)',
                    border: '1px solid rgba(20,184,166,0.25)',
                  }}
                >
                  <fn.icon className="w-6 h-6" style={{ color: '#14b8a6' }} />
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#F0F0F8' }}>
                  {fn.title}
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(200,200,235,0.50)' }}>
                  {fn.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI CATALOG SYSTEMS ── */}
      <section
        className="relative py-28 px-8 overflow-hidden"
        style={{ background: '#07070e' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 10% 30%, rgba(180,180,255,0.10) 0%, transparent 100%),
              radial-gradient(1px 1px at 28% 70%, rgba(180,180,255,0.08) 0%, transparent 100%),
              radial-gradient(1px 1px at 55% 15%, rgba(180,180,255,0.09) 0%, transparent 100%),
              radial-gradient(1px 1px at 75% 55%, rgba(180,180,255,0.07) 0%, transparent 100%),
              radial-gradient(1px 1px at 88% 85%, rgba(180,180,255,0.08) 0%, transparent 100%)
            `,
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p
            className="text-xs font-semibold tracking-[0.28em] uppercase mb-5 flex items-center justify-center gap-2"
            style={{ color: 'rgba(20,184,166,0.7)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#14b8a6' }} />
            AI CATALOG SYSTEMS
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight" style={{ color: '#F0F0F8' }}>
            AI Catalog Systems
          </h2>
          <p
            className="text-lg md:text-xl font-light mb-4 max-w-3xl mx-auto leading-relaxed"
            style={{ color: 'rgba(200,200,235,0.58)' }}
          >
            Catalog OS is powered by AI systems that continuously monitor, optimize, and grow catalog performance — each assigned to a specific function, operating in coordination.
          </p>
          <p
            className="text-base font-light mb-16 max-w-2xl mx-auto italic"
            style={{ color: 'rgba(180,180,220,0.35)' }}
          >
            These are not assistants. They are purpose-built operational systems running across every layer of the catalog.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {aiSystems.map((sys, i) => (
              <div
                key={i}
                className="rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {/* ACTIVE badge */}
                <div className="absolute top-5 right-5">
                  <span
                    className="text-[10px] font-bold tracking-[0.2em] px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(20,184,166,0.12)',
                      border: '1px solid rgba(20,184,166,0.30)',
                      color: '#14b8a6',
                    }}
                  >
                    ACTIVE
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    background: 'rgba(20,184,166,0.10)',
                    border: '1px solid rgba(20,184,166,0.22)',
                  }}
                >
                  <sys.icon className="w-6 h-6" style={{ color: '#14b8a6' }} />
                </div>

                <p
                  className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2"
                  style={{ color: 'rgba(20,184,166,0.55)' }}
                >
                  {sys.system}
                </p>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black" style={{ color: '#F0F0F8' }}>{sys.name}</h3>
                  <span
                    className="text-[9px] font-bold tracking-[0.15em] px-2 py-0.5 rounded"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      color: 'rgba(220,220,245,0.55)',
                    }}
                  >
                    {sys.tier}
                  </span>
                </div>

                <p className="text-sm font-medium mb-4" style={{ color: 'rgba(20,184,166,0.75)' }}>
                  {sys.subtitle}
                </p>

                <p className="text-sm font-light leading-relaxed mb-6" style={{ color: 'rgba(200,200,235,0.50)' }}>
                  {sys.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {sys.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(200,200,235,0.45)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p
            className="text-base font-light mt-16 mb-8 max-w-2xl mx-auto leading-relaxed text-center"
            style={{ color: 'rgba(190,190,230,0.45)' }}
          >
            Every system runs continuously — coordinated across the catalog layer, generating compounding results over time.
          </p>

          <Link
            to="/catalog-os/login"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            style={{
              background: 'rgba(10,10,30,0.8)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#F0F0F8',
              boxShadow: '0 0 24px rgba(40,40,140,0.20)',
            }}
          >
            Access Catalog OS
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ── CONTINUOUS CATALOG GROWTH ── */}
      <section
        className="relative py-28 px-8 overflow-hidden"
        style={{ background: '#08080f' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20% 40%, rgba(180,180,255,0.10) 0%, transparent 100%),
              radial-gradient(1px 1px at 45% 15%, rgba(180,180,255,0.08) 0%, transparent 100%),
              radial-gradient(1px 1px at 70% 60%, rgba(180,180,255,0.09) 0%, transparent 100%),
              radial-gradient(1px 1px at 90% 30%, rgba(180,180,255,0.07) 0%, transparent 100%)
            `,
          }}
        />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p
            className="text-xs font-semibold tracking-[0.28em] uppercase mb-5"
            style={{ color: 'rgba(20,184,166,0.7)' }}
          >
            HOW IT WORKS
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight" style={{ color: '#F0F0F8' }}>
            Continuous Catalog Growth
          </h2>
          <p
            className="text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'rgba(200,200,235,0.55)' }}
          >
            Three sequential steps. Each feeds the next. The system runs without interruption.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 text-left transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                style={{
                  background: step.highlighted
                    ? 'linear-gradient(135deg, rgba(10,30,40,0.9) 0%, rgba(8,25,35,0.95) 100%)'
                    : 'rgba(255,255,255,0.025)',
                  border: step.highlighted
                    ? '1px solid rgba(20,184,166,0.25)'
                    : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: step.highlighted ? '0 0 30px rgba(20,184,166,0.08)' : 'none',
                }}
              >
                {/* Step number */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-6 font-black text-sm"
                  style={{
                    background: 'rgba(20,184,166,0.12)',
                    border: '1px solid rgba(20,184,166,0.25)',
                    color: '#14b8a6',
                  }}
                >
                  {step.num}
                </div>

                {/* Icon */}
                <step.icon
                  className="w-6 h-6 mb-5"
                  style={{ color: '#14b8a6', opacity: 0.8 }}
                />

                <h3 className="text-xl font-black mb-4 leading-snug" style={{ color: '#F0F0F8' }}>
                  {step.title}
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: 'rgba(200,200,235,0.50)' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section
        className="relative py-28 px-8 overflow-hidden"
        style={{ background: '#07070e' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(20,50,80,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight" style={{ color: '#F0F0F8' }}>
            Operate Your Catalog<br />Like a Business
          </h2>
          <p
            className="text-lg font-light mb-12 leading-relaxed"
            style={{ color: 'rgba(200,200,235,0.52)' }}
          >
            Catalog OS gives you the tools, visibility, and infrastructure to manage your music as the asset it is. Access is available to approved catalog clients and partners.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/catalog-os/login"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              style={{
                background: 'rgba(10,10,30,0.85)',
                border: '1px solid rgba(255,255,255,0.16)',
                color: '#F0F0F8',
                boxShadow: '0 0 28px rgba(40,40,140,0.22)',
              }}
            >
              Access Catalog OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid rgba(200,200,240,0.18)',
                color: 'rgba(210,210,245,0.60)',
              }}
            >
              Partner Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
