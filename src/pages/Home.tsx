import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Music, Brain, Target, Film, ShoppingBag, ArrowRight, Radio, Activity, Layers, Eye, Zap, Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import GMGMotif from '../components/GMGMotif';
import BrandLockup from '../components/BrandLockup';
import EcosystemMap from '../components/EcosystemMap';
import AIScouts from '../components/AIScouts';
import RocksteadyHeroSignals from '../components/RocksteadyHeroSignals';

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const rotatingWords = ['Earlier.', 'First.', 'Globally.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="min-h-screen text-gmg-white" style={{
      background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 20%, #221B33 40%, #171322 60%, #0B0B0D 100%)'
    }}>
      {/* Atmospheric background layer with signal dots */}
      <div className="atmospheric-canvas fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      <section className="relative min-h-screen flex items-center overflow-hidden hero-cinematic-base">

        <div className="hero-atmospheric-light"></div>

        <GMGMotif />

        <div className="absolute inset-0 film-grain"></div>
        <div className="absolute inset-0 vignette"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">
          <div className="max-w-4xl">
            <div className="mb-8 opacity-80">
              <BrandLockup variant="hero" showIcon={false} showSignalMotif={true} />
            </div>

            {/* Industry Category Claim */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-center" style={{ color: '#6B7280' }}>
              The AI Operating Layer for the Music Industry
            </p>

            {/* Category Label */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  color: '#C4B5FD'
                }}>
                AI-Native Music Systems
              </span>
            </div>

            <h1 className="font-black mb-6 tracking-tighter text-left">
              <span className="block text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] leading-none pb-2" style={{ color: '#E5E5E7' }}>
                Discover Artists
              </span>
              <span className="block text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] leading-none pb-4" style={{ height: '1.15em', position: 'relative' }}>
                {rotatingWords.map((word, index) => (
                  <span
                    key={word}
                    className="absolute left-0 transition-all duration-500 whitespace-nowrap"
                    style={{
                      opacity: currentWordIndex === index ? 1 : 0,
                      transform: currentWordIndex === index ? 'translateY(0)' : 'translateY(0.15em)',
                      color: '#F4F6FB',
                      textShadow: '0 0 12px rgba(255,255,255,0.12)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
              <span className="block text-[5.5rem] md:text-[7rem] lg:text-[8.5rem] leading-none pb-2" style={{ color: '#E5E5E7' }}>Expand Catalog Value.</span>
              <span className="block text-[4rem] md:text-[5rem] lg:text-[6rem] leading-none pt-2" style={{ color: '#8A8C93', opacity: 0.85 }}>Connect Global Culture.</span>
            </h1>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-10" style={{ color: '#6B7280' }}>
              Built by the team behind WarnerDigital, Flypaper, and SoundsGood.
            </p>

            {/* Single Positioning Statement */}
            <p className="text-2xl md:text-3xl font-medium mb-4 leading-relaxed max-w-3xl" style={{ color: '#E5E5E7' }}>
              GMG is an AI-native music operating company — built to discover artists earlier, scale careers systematically, and grow catalog value over time.
            </p>

            <p className="text-sm mb-6 leading-relaxed max-w-3xl" style={{ color: '#6B7280' }}>
              Discovery &rarr; Artist OS &rarr; Catalog expansion &rarr; Cultural media
            </p>

            <p className="text-xs font-bold uppercase tracking-widest mb-12" style={{ color: '#6B7280' }}>
              Powered by Rocksteady — GMG's AI discovery system, operating continuously.
            </p>

            {/* Three Core Systems Module */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl">
              {/* Discovery System */}
              <div className="group relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(139, 92, 246, 0.05)',
                  border: '1px solid rgba(139, 92, 246, 0.15)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-400/20 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Discovery System</span>
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">AI Scout Intelligence</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    AI scouts running continuously — identifying emerging artists, signals, and cultural momentum before the market.
                  </p>
                </div>
              </div>

              {/* Artist Operating System */}
              <div className="group relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Artist Operating System</span>
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">Artist OS</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    The operating system running careers — AI reps, growth infrastructure, financial systems, and protection in one layer.
                  </p>
                </div>
              </div>

              {/* Catalog Growth */}
              <div className="group relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(251, 191, 36, 0.05)',
                  border: '1px solid rgba(251, 191, 36, 0.15)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center">
                      <Database className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Catalog OS</span>
                  </div>
                  <h3 className="text-sm font-black text-white mb-2">Catalog OS</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Dedicated infrastructure for growing, optimizing, and monetizing music catalog assets at scale.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs mb-0 leading-relaxed max-w-3xl" style={{ color: '#6B7280' }}>
              Discovery &rarr; Artist OS &rarr; Catalog expansion — one connected system.
            </p>

          </div>
        </div>
      </section>

      {/* Ecosystem Signal Strip */}
      <div className="relative py-8 px-8 lg:px-12" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Connected Ecosystem
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {['Artists', 'Producers & Creators', 'Managers', 'Independent Labels', 'Catalog Owners', 'Creative Collaborators', 'Media & Culture Platforms', 'Fans & Audiences'].map((category, i, arr) => (
              <span key={category} className="flex items-center gap-3">
                <span className="text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {category}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '8px' }}>•</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Premium hero divider */}
      <div className="flex justify-center py-8">
        <div className="w-[75%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)' }} />
      </div>

      {/* GMG OPERATING SYSTEM SECTION */}
      <section className="relative py-20 px-8 lg:px-12 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>

        {/* Subtle signal particles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(60)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            />
          ))}
        </div>

        <GMGMotif />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="mb-4">
              <span className="inline-block text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400/70">
                AI Music Operating System
              </span>
            </div>
            <h2 className="font-black text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-6 leading-[0.95] tracking-tighter" style={{ color: '#E5E5E7' }}>
              The Operating Layer for the Music Industry
            </h2>
            <p className="text-sm text-gmg-white/40 mb-5 max-w-2xl mx-auto text-center">
              Discovery. Artist OS. Catalog. Media. One system.
            </p>
            <p className="text-xl md:text-2xl text-gmg-white/90 font-light leading-relaxed max-w-4xl mx-auto">
              GMG integrates discovery intelligence, artist operating infrastructure, and catalog expansion into one interconnected system — built to compound results across every layer.
            </p>
          </div>

          {/* Evolution Visual */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Column 1: Traditional */}
            <div className="relative bg-gradient-to-br from-white/[0.03] to-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 text-gmg-white/60">Traditional Industry</h3>
              <div className="space-y-4 text-gmg-white/50 text-base">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Labels</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Managers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Distributors</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Marketing Agencies</span>
                </div>
              </div>
            </div>

            {/* Column 2: Technology */}
            <div className="relative bg-gradient-to-br from-white/[0.03] to-black/40 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 text-gmg-white/60">Technology Platforms</h3>
              <div className="space-y-4 text-gmg-white/50 text-base">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Streaming Platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Social Platforms</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gmg-white/30"></div>
                  <span>Marketing Tools</span>
                </div>
              </div>
            </div>

            {/* Column 3: GMG Infrastructure - HERO */}
            <div className="relative bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-black/60 backdrop-blur-xl border border-cyan-400/30 rounded-2xl p-8 shadow-[0_0_80px_rgba(6,182,212,0.2)]">
              {/* Glowing aura behind */}
              <div className="absolute inset-0 bg-gradient-radial from-cyan-400/10 via-transparent to-transparent blur-2xl"></div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-300">Artist OS</h3>
                </div>
                <div className="space-y-4 text-cyan-100/90 text-base">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span>Discovery Intelligence (Rocksteady)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span>Artist OS — Career Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span>Catalog OS — Growth Engine</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span>Cultural Media Layer</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                    <span>Financial & Protection Infrastructure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Body Copy */}
          <div className="text-center mt-12 max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gmg-white/80 font-light leading-relaxed">
              Greater Music Group is an AI-native music operating company — built to run discovery, artist development, catalog growth, and media through one integrated system.
            </p>
          </div>

          {/* How it Works */}
          <div className="text-center mt-10 max-w-3xl mx-auto">
            <p className="text-base md:text-lg text-gmg-white/60 font-light leading-relaxed">
              Each layer feeds the next. Discovery surfaces the right artists. Artist OS scales careers. Catalog OS grows long-term value. Every output compounds across the system.
            </p>
          </div>

        </div>
      </section>

      {/* Cinematic transition */}
      <div className="cinematic-divider" />

      {/* Shared background signal field for continuity */}
      <div className="relative" style={{
        background: 'linear-gradient(180deg, #0B0B0D 0%, #171322 50%, #0B0B0D 100%)'
      }}>
        {/* Persistent signal dots across multiple sections */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gmg-violet/20 rounded-full animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.3 + 0.1
              }}
            />
          ))}
        </div>


        {/* ACT 2 . DISCOVERY ENGINE */}
        <section className="relative py-28 px-8 lg:px-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>

          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 1.5 + 0.3}px`,
                  height: `${Math.random() * 1.5 + 0.3}px`,
                  opacity: Math.random() * 0.3 + 0.05,
                  animation: `pulse-slow ${Math.random() * 4 + 3}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 opacity-5" style={{ zIndex: 2 }}>
            <div className="absolute top-1/3 right-1/4 w-[1000px] h-[1000px] bg-gmg-violet/60 rounded-full blur-3xl"></div>
          </div>

          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.10] blur-[0.5px] pointer-events-none shepard-parallax"
            style={{
              backgroundImage: 'url(/shepard_fairey_art.png)',
              backgroundPosition: '75% center',
              backgroundSize: 'cover',
              mixBlendMode: 'screen',
              maskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 85%)',
              WebkitMaskImage: 'linear-gradient(to left, black 0%, black 50%, transparent 85%)',
              zIndex: 3
            }}
          />

          <GMGMotif />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-gmg-violet/20 rounded-lg mb-5 backdrop-blur-sm border border-gmg-violet/20">
                  <span className="text-gmg-violet font-semibold text-sm tracking-wider uppercase">Discovery</span>
                </div>
                <h2 className="font-black text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-8 leading-[0.95] tracking-tighter" style={{ color: '#E5E5E7' }}>
                  Discover Artists Earlier
                </h2>
                <div className="space-y-8 text-xl text-gmg-white/90 leading-relaxed">
                  <p className="font-light">
                    Rocksteady is GMG's AI discovery system — continuously scanning music signals, cultural momentum, and emerging artist traction to surface opportunities before the market.
                  </p>
                  <p className="font-light">
                    Built on a foundation of discovery innovation — Paula Moore's original digital music discovery platforms, WarnerDigital, Flypaper, and SoundsGood, developed at Warner Music Group.
                  </p>
                  <p className="font-light">
                    Rocksteady processes streaming data, social signals, and cultural movement to generate intelligence that drives action — not just awareness.
                  </p>
                  <div className="pt-6">
                    <Link
                      to="/discovery"
                      onClick={() => window.scrollTo(0, 0)}
                      className="inline-flex items-center gap-2 text-lg font-semibold text-gmg-violet hover:text-gmg-magenta transition-colors"
                    >
                      Explore Rocksteady
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative h-[500px]">
                <div className="absolute inset-0">
                  <RocksteadyHeroSignals />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cinematic transition */}
        <div className="cinematic-divider" />

        {/* ACT 3 . THE PLATFORM SYSTEM */}
        <EcosystemMap />

        {/* Cinematic transition */}
        <div className="cinematic-divider" />

        {/* AI SCOUTS */}
        <AIScouts />

        {/* Cinematic transition */}
        <div className="cinematic-divider" />

        {/* ACT 4 . CULTURE OUTPUT */}
        <section className="relative py-28 px-8 lg:px-12 flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black"></div>

          <div className="absolute inset-0 opacity-5">
            <div className="absolute bottom-1/3 right-1/3 w-[800px] h-[800px] bg-gmg-magenta/60 rounded-full blur-3xl"></div>
          </div>

          <GMGMotif />

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-block px-4 py-2 bg-gmg-magenta/20 rounded-lg mb-5 backdrop-blur-sm border border-gmg-magenta/20">
                  <span className="text-gmg-magenta font-semibold text-sm tracking-wider uppercase">Cultural Media</span>
                </div>
                <h2 className="font-black text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-8 leading-[0.95] tracking-tighter" style={{ color: '#E5E5E7' }}>
                  Where Music Becomes Culture
                </h2>
                <div className="space-y-8 text-xl text-gmg-white/90 leading-relaxed">
                  <p className="font-light">
                    GMG develops original music-driven microseries and formats built for vertical video, artist-first storytelling, and cultural programming at scale.
                  </p>
                  <p className="font-light">
                    The media layer extends the GMG system — connecting artists, audiences, and brand collaborators through owned cultural programming.
                  </p>
                  <div className="pt-6">
                    <Link
                      to="/media"
                      onClick={() => window.scrollTo(0, 0)}
                      className="inline-flex items-center gap-2 text-lg font-semibold text-gmg-magenta hover:text-gmg-cyan transition-colors"
                    >
                      Explore Media
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative h-[500px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-64 h-[500px] editorial-panel rounded-3xl overflow-hidden shadow-2xl shadow-gmg-magenta/20 border-8 border-gmg-charcoal">
                  <div className="absolute inset-0 bg-gradient-to-br from-gmg-violet/30 via-gmg-magenta/20 to-gmg-charcoal flex items-center justify-center">
                    <Film className="w-20 h-20 text-gmg-white/40" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gmg-charcoal to-transparent">
                    <div className="text-sm font-bold text-gmg-white">Music Microseries</div>
                    <div className="text-xs text-gmg-gray mt-1">Vertical Storytelling</div>
                  </div>
                </div>

                <div className="absolute left-1/4 -translate-x-1/2 top-1/2 -translate-y-1/2 w-56 h-[440px] editorial-panel rounded-3xl overflow-hidden shadow-xl opacity-60 rotate-[-8deg] border-8 border-gmg-charcoal">
                  <div className="absolute inset-0 bg-gradient-to-br from-gmg-cyan/30 via-gmg-charcoal to-gmg-charcoal flex items-center justify-center">
                    <Radio className="w-16 h-16 text-gmg-white/30" />
                  </div>
                </div>

                <div className="absolute right-1/4 translate-x-1/2 top-1/2 -translate-y-1/2 w-56 h-[440px] editorial-panel rounded-3xl overflow-hidden shadow-xl opacity-60 rotate-[8deg] border-8 border-gmg-charcoal">
                  <div className="absolute inset-0 bg-gradient-to-br from-gmg-gold/30 via-gmg-charcoal to-gmg-charcoal flex items-center justify-center">
                    <Activity className="w-16 h-16 text-gmg-white/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cinematic transition */}
        <div className="cinematic-divider" />

        {/* ACT 5 . PEOPLE AND PLATFORM */}
        <section className="py-28 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-charcoal/20 to-black"></div>

          <GMGMotif />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-14">
              <div className="inline-block px-4 py-2 bg-gmg-gold/20 rounded-lg mb-5 backdrop-blur-sm border border-gmg-gold/20">
                <span className="text-gmg-gold font-semibold text-sm tracking-wider uppercase">Leadership</span>
              </div>
              <h2 className="font-black text-[3.5rem] md:text-[5rem] lg:text-[6rem] mb-6 leading-[0.95] tracking-tighter" style={{ color: '#E5E5E7' }}>
                The People and Platform Behind GMG
              </h2>
              <p className="text-xl md:text-2xl text-gmg-white/75 font-light leading-relaxed max-w-4xl mx-auto">
                Decades of industry depth. Purpose-built AI infrastructure. One integrated system.
              </p>
            </div>

            <div className="relative space-y-10">
              {/* Subtle radial glow */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[800px] h-[800px] bg-gmg-violet/5 rounded-full blur-3xl opacity-40" />
              </div>

              {/* Top Row: Founders */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
                <div
                  className="group rounded-[18px] p-12 transition-all duration-500 hover:translate-y-[-4px] animate-float"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    animation: 'float 8s ease-in-out infinite',
                  }}
                >
                  <div className="w-44 h-44 mx-auto mb-10 rounded-2xl overflow-hidden bg-neutral-800 ring-1 ring-white/10 flex-shrink-0">
                    <img
                      src="/Randy-Jackson-ceo.png"
                      alt="Randy Jackson"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center">Randy Jackson</h3>
                  <p className="text-gmg-violet text-xs mb-7 text-center uppercase tracking-widest font-medium">Co-CEO</p>
                  <p className="text-base text-gmg-gray leading-relaxed text-center">
                    Music executive, producer, and cultural icon. Decades of artist development experience across major label, independent, and cultural platforms.
                  </p>
                </div>

                <div
                  className="group rounded-[18px] p-12 transition-all duration-500 hover:translate-y-[-4px] animate-float"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    animation: 'float 7s ease-in-out infinite 1s',
                  }}
                >
                  <div className="w-44 h-44 mx-auto mb-10 rounded-2xl overflow-hidden bg-neutral-800 ring-1 ring-white/10 flex-shrink-0">
                    <img
                      src="/Paula-Moore-ceo.png"
                      alt="Paula Moore"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center">Paula Moore</h3>
                  <p className="text-gmg-cyan text-xs mb-7 text-center uppercase tracking-widest font-medium">Co-CEO</p>
                  <p className="text-base text-gmg-gray leading-relaxed text-center">
                    Music executive, A&R innovator, and technology founder. Architect of discovery systems at the intersection of music, data, and culture — built at Warner Music Group.
                  </p>
                </div>
              </div>

              {/* Bottom Row: Platform */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto relative z-10">
                <div
                  className="group rounded-[18px] p-10 transition-all duration-500 hover:translate-y-[-4px] animate-float"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    animation: 'float 6s ease-in-out infinite 2s',
                  }}
                >
                  <div className="w-36 h-36 mx-auto mb-7 rounded-2xl overflow-hidden bg-neutral-900 ring-1 ring-gmg-magenta/30 flex-shrink-0">
                    <img
                      src="/shepard_fairey_art.png"
                      alt="Rocksteady"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center">Rocksteady</h3>
                  <p className="text-gmg-magenta text-xs mb-6 text-center uppercase tracking-widest font-medium">Discovery System</p>
                  <p className="text-sm text-gmg-gray leading-relaxed text-center">
                    GMG's AI discovery system — continuously scanning signals to identify artists, cultural momentum, and breakout potential before the market moves.
                  </p>
                </div>

                <div
                  className="group rounded-[18px] p-10 transition-all duration-500 hover:translate-y-[-4px] animate-float"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(12px)',
                    animation: 'float 7s ease-in-out infinite 3s',
                  }}
                >
                  <div className="w-36 h-36 mx-auto mb-4 rounded-2xl flex items-center justify-center overflow-hidden bg-neutral-900 ring-1 ring-gmg-gold/30 flex-shrink-0">
                    <img
                      src="/GMG_logo_Crown_black_and_color.png"
                      alt="GMG"
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-center">Artist OS</h3>
                  <p className="text-gmg-gold text-xs mb-6 text-center uppercase tracking-widest font-medium">Artist Operating System</p>
                  <p className="text-sm text-gmg-gray leading-relaxed text-center">
                    The operating system for modern artist careers — AI reps, growth infrastructure, financial systems, protection, and media in one connected layer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ACT 6 . CATEGORY DEFINITION */}
      <section className="py-28 px-8 lg:px-12 cinematic-gradient-dark film-grain relative overflow-hidden">
        <div className="absolute inset-0 cinematic-lighting"></div>

        <GMGMotif />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-2 bg-white/10 rounded-lg mb-8 backdrop-blur-sm border border-white/10">
            <span className="text-white/80 font-semibold text-sm tracking-wider uppercase">The Future of Music</span>
          </div>

          <h2 className="font-black mb-10 leading-[0.92] tracking-tighter">
            <span className="block text-[3.5rem] md:text-[5rem] lg:text-[6.5rem]" style={{ color: '#E5E5E7' }}>The Future of</span>
            <span className="block text-[3rem] md:text-[4rem] lg:text-[5rem] mt-4" style={{ color: '#A9AAB0' }}>Music Runs on GMG</span>
          </h2>

          <div className="space-y-8 max-w-4xl mx-auto mb-10">
            <p className="text-xl md:text-2xl text-gmg-white/90 leading-relaxed font-light">
              Access is selective. The system is built. Apply to enter.
            </p>
          </div>

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
        </div>
      </section>

    </div>
  );
}
