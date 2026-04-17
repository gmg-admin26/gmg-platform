import { Link } from 'react-router-dom';
import { Search, Layers, TrendingUp, Video, ArrowRight, Cpu, AlertTriangle, RotateCcw, CheckCircle, Zap } from 'lucide-react';
import InteractiveEcosystemMap from '../components/InteractiveEcosystemMap';
import GMGMotif from '../components/GMGMotif';

const BG_GRID = {
  backgroundImage: `
    linear-gradient(rgba(139, 92, 246, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
};

export default function About() {
  return (
    <div className="min-h-screen text-white bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 40%, #221B33 50%, #0B0B0D 100%)' }}></div>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 120% 75% at 50% 50%, rgba(75,59,120,0.28) 0%, rgba(55,40,90,0.14) 40%, transparent 70%)' }}></div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.55) 100%)' }}></div>
        <GMGMotif />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
            <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">About Greater Music Group</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.05] tracking-tighter">
            Greater Music Group is building the operating system for the modern music industry.
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A full-stack platform combining AI, infrastructure, and real-world execution to discover, develop, and scale artists globally.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative py-28 px-6 overflow-hidden bg-zinc-950/40">
        <div className="absolute inset-0 opacity-[0.012]" style={BG_GRID}></div>
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-red-900/10 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
            <AlertTriangle className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">The Problem</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-12 tracking-tighter leading-[1.05]">
            The music industry is fragmented and inefficient.
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Discovery is unpredictable.',
              'Marketing is disconnected.',
              'Infrastructure is outdated.',
              'Most artists never get a real shot — and most teams never operate at scale.',
            ].map((line, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-sm ${i === 3 ? 'md:col-span-2' : ''}`}
              >
                <p className={`font-bold leading-relaxed ${i === 3 ? 'text-xl text-gray-200' : 'text-lg text-gray-300'}`}>
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Shift */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/2 left-1/4 w-[700px] h-[600px] bg-zinc-600/8 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">The Shift</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.05]">
            We turned the industry into a system.
          </h2>

          <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-sm">
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Instead of relying on chance, GMG builds integrated systems that identify opportunity, execute strategy, and scale results across every stage of an artist's career.
            </p>
          </div>
        </div>
      </section>

      {/* The Platform */}
      <section className="relative py-28 px-6 overflow-hidden bg-zinc-950/40">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-zinc-600/8 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
              <Cpu className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">The Platform</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tighter leading-[1.05]">
              A full-stack music system.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'AI Scouts',
                desc: 'AI-powered scouting system identifying emerging artists and cultural signals early.',
              },
              {
                icon: Layers,
                title: 'Artist OS',
                desc: 'Growth and development system for artists.',
              },
              {
                icon: TrendingUp,
                title: 'Catalog OS',
                desc: 'Catalog expansion and monetization engine.',
              },
              {
                icon: Cpu,
                title: 'Industry OS',
                desc: 'Training and operator system powering real-world execution.',
              },
              {
                icon: Video,
                title: 'Cultural Media',
                desc: 'Content and distribution layer driving reach and influence.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`group relative bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-8 hover:border-zinc-600/60 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm ${i === 4 ? 'lg:col-start-2' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center mb-6 group-hover:bg-zinc-700/60 transition-colors duration-300">
                  <item.icon className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="text-xl font-black mb-3 text-white tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[500px] bg-zinc-600/8 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
            <Zap className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">How It Works</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-12 tracking-tighter leading-[1.05]">
            Intelligence → Execution → Scale
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', label: 'Intelligence', body: 'AI identifies opportunity.' },
              { step: '02', label: 'Execution', body: 'Operators execute strategy.' },
              { step: '03', label: 'Scale', body: 'Systems scale results.' },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-sm">
                <div className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-4">{item.step}</div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{item.label}</h3>
                <p className="text-gray-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why GMG Wins */}
      <section className="relative py-28 px-6 overflow-hidden bg-zinc-950/40">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/3 left-1/3 w-[700px] h-[600px] bg-zinc-600/8 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
            <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">Why GMG Wins</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-12 tracking-tighter leading-[1.05]">
            Built differently from the ground up.
          </h2>

          <div className="space-y-4">
            {[
              'AI + human operators combined',
              'Owned infrastructure (not rented tools)',
              'End-to-end system (not fragmented services)',
              'Built for scale from day one',
            ].map((bullet, i) => (
              <div key={i} className="flex items-center gap-5 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 backdrop-blur-sm hover:border-zinc-600/60 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-lg font-bold text-gray-200">{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/3 left-1/4 w-[800px] h-[800px] bg-zinc-600/8 blur-[160px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50"></div>

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-xl mb-8">
              <span className="text-xs text-gray-400 font-bold tracking-wider uppercase">Leadership</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
              Founded by music industry leaders.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="group relative bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-10 hover:border-zinc-600/60 transition-all duration-300 backdrop-blur-sm">
              <div className="w-36 h-36 mx-auto mb-8 rounded-xl overflow-hidden border border-zinc-800/60">
                <img src="/Randy-Jackson-ceo.png" alt="Randy Jackson" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="text-2xl font-black mb-1 text-center text-white">Randy Jackson</h3>
              <p className="text-gray-500 text-xs mb-6 text-center uppercase tracking-widest font-bold">Co-CEO</p>
              <p className="text-sm text-gray-400 leading-relaxed text-center">
                Globally recognized music executive, producer, musician, and cultural icon known for discovering and developing artists and for his role on American Idol.
              </p>
            </div>

            <div className="group relative bg-zinc-900/50 border border-zinc-800/60 rounded-2xl p-10 hover:border-zinc-600/60 transition-all duration-300 backdrop-blur-sm">
              <div className="w-36 h-36 mx-auto mb-8 rounded-xl overflow-hidden border border-zinc-800/60">
                <img src="/Paula-Moore-ceo.png" alt="Paula Moore" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-2xl font-black mb-1 text-center text-white">Paula Moore</h3>
              <p className="text-gray-500 text-xs mb-6 text-center uppercase tracking-widest font-bold">Co-CEO</p>
              <p className="text-sm text-gray-400 leading-relaxed text-center">
                Music executive, A&R innovator, and technology founder known for building new discovery systems at the intersection of music, data, and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Ecosystem Map */}
      <InteractiveEcosystemMap />

      {/* Final CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={BG_GRID}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-zinc-600/8 blur-[150px] rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.05]">
            We're not adapting to the future of the music industry.
          </h2>
          <p className="text-3xl md:text-4xl font-black text-gray-400 mb-16 tracking-tight">
            We're building it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/get-started"
              className="group inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-black rounded-full font-black text-base hover:bg-gray-100 hover:scale-105 transition-all duration-300"
            >
              Request Access
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              to="/press"
              className="inline-flex items-center justify-center gap-3 px-10 py-6 bg-transparent border border-white/20 text-white rounded-full font-bold text-base hover:bg-white/5 hover:border-white/30 transition-all duration-300"
            >
              Press
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
