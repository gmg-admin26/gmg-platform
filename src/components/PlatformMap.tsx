import { Brain, Zap, TrendingUp, ShoppingBag, Video, Users, Sparkles } from 'lucide-react';

export default function PlatformMap() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-black via-gmg-charcoal/30 to-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The GMG Platform</h2>
          <p className="text-lg text-gmg-gray max-w-3xl mx-auto">
            AI native infrastructure for modern music
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-gradient-radial from-gmg-violet/20 via-transparent to-transparent blur-3xl"></div>

          <div className="relative flex flex-col items-center">
            <div className="relative w-full max-w-5xl aspect-square flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 800">
                <defs>
                  <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <filter id="center-glow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  <radialGradient id="center-radial" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#a855f7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="400" cy="400" r="295" fill="none" stroke="url(#line-gradient)" strokeWidth="1" opacity="0.2" strokeDasharray="5,5">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 400 400"
                    to="360 400 400"
                    dur="60s"
                    repeatCount="indefinite"
                  />
                </circle>

                <circle cx="400" cy="400" r="140" fill="url(#center-radial)" filter="url(#center-glow)" opacity="0.4" />

                <line x1="400" y1="400" x2="400" y2="105" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
                </line>
                <line x1="400" y1="400" x2="655" y2="213" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="0.5s" repeatCount="indefinite" />
                </line>
                <line x1="400" y1="400" x2="655" y2="587" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="1s" repeatCount="indefinite" />
                </line>
                <line x1="400" y1="400" x2="400" y2="695" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="1.5s" repeatCount="indefinite" />
                </line>
                <line x1="400" y1="400" x2="145" y2="587" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="2s" repeatCount="indefinite" />
                </line>
                <line x1="400" y1="400" x2="145" y2="213" stroke="url(#line-gradient)" strokeWidth="2" opacity="0.4" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" begin="2.5s" repeatCount="indefinite" />
                </line>

                <circle cx="400" cy="105" r="4" fill="#ec4899" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="655" cy="213" r="4" fill="#06b6d4" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="0.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="655" cy="587" r="4" fill="#8b5cf6" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="400" cy="695" r="4" fill="#f59e0b" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="145" cy="587" r="4" fill="#ec4899" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="1.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="145" cy="213" r="4" fill="#06b6d4" opacity="0.8">
                  <animate attributeName="r" values="3;6;3" dur="2.5s" begin="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" begin="2s" repeatCount="indefinite" />
                </circle>
              </svg>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-gmg-violet/20 via-gmg-magenta/20 to-transparent rounded-full blur-3xl scale-150"></div>

                  <div className="relative flex flex-col items-center justify-center" style={{
                    animation: 'float 6s ease-in-out infinite'
                  }}>
                    <Sparkles className="w-20 h-20 text-gmg-violet mb-4" style={{
                      filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.6))',
                      animation: 'pulse-glow 8s ease-in-out infinite'
                    }} />
                    <h3 className="text-2xl font-bold text-center tracking-tight">Greater Music Group</h3>
                    <p className="text-sm text-center text-gmg-gray/70 mt-2">AI Native Infrastructure</p>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px) rotate(0deg); }
                  50% { transform: translateY(-3px) rotate(0.5deg); }
                }
                @keyframes pulse-glow {
                  0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)); }
                  50% { filter: drop-shadow(0 0 30px rgba(139, 92, 246, 0.9)); }
                }
              `}</style>

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-44" style={{ top: '0%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite'
                }}>
                  <div className="absolute inset-0 bg-gmg-magenta/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-magenta/40 group-hover:border-gmg-magenta group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <Brain className="w-12 h-12 text-gmg-magenta mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Rocksteady</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">AI-driven discovery identifying emerging artists</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/4 right-0 translate-x-10 w-44 h-44" style={{ top: '18%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite 0.5s'
                }}>
                  <div className="absolute inset-0 bg-gmg-cyan/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-cyan/40 group-hover:border-gmg-cyan group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <Zap className="w-12 h-12 text-gmg-cyan mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Artist Tools</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">Marketing automation and campaign systems</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 right-0 translate-x-10 w-44 h-44" style={{ bottom: '18%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite 1s'
                }}>
                  <div className="absolute inset-0 bg-gmg-violet/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-violet/40 group-hover:border-gmg-violet group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <TrendingUp className="w-12 h-12 text-gmg-violet mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Catalog Growth</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">Infrastructure for expanding music catalogs</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-44 h-44" style={{ bottom: '0%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite 1.5s'
                }}>
                  <div className="absolute inset-0 bg-gmg-gold/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-gold/40 group-hover:border-gmg-gold group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gmg-gold mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Merch & Products</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">Apparel and merchandise platforms</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-1/4 left-0 -translate-x-10 w-44 h-44" style={{ bottom: '18%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite 2s'
                }}>
                  <div className="absolute inset-0 bg-gmg-magenta/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-magenta/40 group-hover:border-gmg-magenta group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <Video className="w-12 h-12 text-gmg-magenta mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Media & Microseries</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">Music-driven original programming</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/4 left-0 -translate-x-10 w-44 h-44" style={{ top: '18%' }}>
                <div className="relative w-full h-full group cursor-pointer" style={{
                  animation: 'node-breathe 6s ease-in-out infinite 2.5s'
                }}>
                  <div className="absolute inset-0 bg-gmg-cyan/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-gradient-to-br from-gmg-graphite to-gmg-charcoal rounded-3xl p-6 border border-gmg-cyan/40 group-hover:border-gmg-cyan group-hover:scale-105 transition-all duration-500 h-full flex flex-col items-center justify-center">
                    <Users className="w-12 h-12 text-gmg-cyan mb-3 group-hover:scale-110 transition-transform duration-500" />
                    <h4 className="text-lg font-bold text-center mb-2">Community</h4>
                    <p className="text-xs text-gmg-gray text-center leading-relaxed">Artists • Labels • Catalog Owners • Fans</p>
                  </div>
                </div>
              </div>

              <style>{`
                @keyframes node-breathe {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.03); }
                }
              `}</style>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <p className="text-2xl font-bold text-gmg-white">
            Discover artists. Grow catalogs. Build culture.
          </p>
        </div>
      </div>
    </section>
  );
}
