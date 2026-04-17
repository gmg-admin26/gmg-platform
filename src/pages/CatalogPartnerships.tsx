import { Link } from 'react-router-dom';
import { TrendingUp, Target, Users, BarChart, ArrowRight, ShoppingBag, Film, Building2, Music, Radio, LineChart, Sparkles, Zap, Package, DollarSign } from 'lucide-react';

export default function CatalogPartnerships() {
  return (
    <div className="min-h-screen bg-gmg-charcoal text-gmg-white">
      <section className="relative min-h-screen flex items-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gmg-charcoal via-gmg-cyan/20 to-gmg-charcoal">
          <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full filter blur-[150px] animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(35, 213, 255, 0.4) 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full filter blur-[130px] animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(108, 75, 255, 0.3) 0%, transparent 70%)', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full filter blur-[110px] animate-pulse-slow" style={{ background: 'radial-gradient(circle, rgba(255, 47, 209, 0.25) 0%, transparent 70%)', animationDelay: '2s' }}></div>
        </div>

        <div className="absolute inset-0 opacity-5">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: 0,
                right: 0,
                background: i % 3 === 0
                  ? 'linear-gradient(90deg, transparent, rgba(35, 213, 255, 0.8) 50%, transparent)'
                  : i % 3 === 1
                  ? 'linear-gradient(90deg, transparent, rgba(108, 75, 255, 0.6) 50%, transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255, 47, 209, 0.5) 50%, transparent)',
                animationDelay: `${Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tighter">
              <span className="text-gradient-cyan-violet">Turn Your Music Catalog</span><br />
              <span className="text-gmg-white">Into a Growing Asset</span>
            </h1>
            <p className="text-xl text-gmg-gray mb-10 leading-relaxed font-medium">
              Greater Music Group partners with artists, labels, and catalog owners to grow the reach, revenue, and long-term value of modern music catalogs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-gmg-cyan to-gmg-blue hover:opacity-90 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-gmg-cyan/30 flex items-center justify-center gap-2"
              >
                Explore Partnership
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-gmg-graphite/50 hover:bg-gmg-graphite backdrop-blur-sm text-gmg-white rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-gmg-cyan/30"
              >
                Talk to GMG
              </Link>
            </div>
          </div>

          <div className="relative h-[500px] hidden lg:block">
            <div className="absolute top-0 right-0 w-80 h-72 bg-gmg-graphite/40 backdrop-blur-md border border-gmg-cyan/40 rounded-2xl p-6 animate-pulse-slow">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gmg-gray font-medium">Catalog Value Growth</div>
                  <LineChart className="w-5 h-5 text-gmg-cyan" />
                </div>
                <div className="h-32 flex items-end gap-2">
                  {[40, 45, 52, 58, 70, 78, 88, 100].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-gmg-cyan to-gmg-violet rounded-t transition-all" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="text-center">
                    <div className="text-xs text-gmg-gray">Streams</div>
                    <div className="text-sm font-bold text-gmg-cyan">+245%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gmg-gray">Revenue</div>
                    <div className="text-sm font-bold text-gmg-violet">+178%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gmg-gray">Value</div>
                    <div className="text-sm font-bold text-gmg-magenta">+312%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-20 right-20 w-72 h-48 bg-gmg-graphite/40 backdrop-blur-md border border-gmg-violet/40 rounded-2xl p-6 animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gmg-violet/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gmg-violet" />
                </div>
                <div>
                  <div className="text-sm text-gmg-white font-semibold">Partnership Active</div>
                  <div className="text-xs text-gmg-gray">Multi-year growth plan</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gmg-gray">Catalog expansion</span>
                  <span className="text-gmg-white font-semibold">On track</span>
                </div>
                <div className="h-1.5 bg-gmg-violet/30 rounded-full">
                  <div className="h-full w-3/4 bg-gradient-to-r from-gmg-violet to-gmg-cyan rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Music Catalogs Are Now Long-Term Assets</h2>
          <p className="text-xl text-gmg-gray mb-8 leading-relaxed max-w-3xl mx-auto">
            Streaming has transformed music catalogs into long-term assets that can continue generating value for decades.
          </p>
          <p className="text-xl text-gmg-gray mb-8 leading-relaxed max-w-3xl mx-auto">
            But many artists and labels lack the infrastructure needed to fully unlock that potential.
          </p>
          <p className="text-xl text-gmg-gray mb-8 leading-relaxed max-w-3xl mx-auto">
            Without coordinated marketing, audience growth strategies, merchandising, and media exposure, valuable catalogs often remain underdeveloped.
          </p>
          <p className="text-xl text-gmg-white font-semibold max-w-3xl mx-auto">
            GMG provides the systems and operational support needed to expand the reach and value of music catalogs.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-gmg-charcoal to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Grow First. Monetize Later.</h2>
          </div>

          <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-10 mb-8">
            <p className="text-xl text-gmg-gray leading-relaxed mb-6 text-center">
              Unlike traditional catalog buyers who focus only on acquisition, GMG focuses first on <span className="text-gmg-white font-semibold">growing the value of music catalogs</span>.
            </p>
            <p className="text-xl text-gmg-gray leading-relaxed mb-8 text-center">
              By increasing audience reach, streams, cultural relevance, and merchandise opportunities, catalogs can become significantly more valuable over time.
            </p>
            <p className="text-xl text-gmg-white font-semibold text-center">
              This approach aligns GMG with artists and catalog owners who want to build long-term value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gmg-graphite/40 border border-gmg-cyan/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gmg-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gmg-cyan" />
              </div>
              <div className="text-3xl font-bold mb-2 text-gmg-cyan">Step 1</div>
              <div className="text-lg font-semibold mb-2">Grow Value</div>
              <p className="text-sm text-gmg-gray">Increase reach and revenue first</p>
            </div>
            <div className="bg-gmg-graphite/40 border border-gmg-violet/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gmg-violet/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart className="w-8 h-8 text-gmg-violet" />
              </div>
              <div className="text-3xl font-bold mb-2 text-gmg-violet">Step 2</div>
              <div className="text-lg font-semibold mb-2">Build Infrastructure</div>
              <p className="text-sm text-gmg-gray">Establish operational systems</p>
            </div>
            <div className="bg-gmg-graphite/40 border border-gmg-magenta/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gmg-magenta/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gmg-magenta" />
              </div>
              <div className="text-3xl font-bold mb-2 text-gmg-magenta">Step 3</div>
              <div className="text-lg font-semibold mb-2">Monetize Growth</div>
              <p className="text-sm text-gmg-gray">Capture increased catalog value</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The GMG Catalog Growth Model</h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto">
              Comprehensive infrastructure designed to expand catalog reach and value
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-10 hover:border-gmg-cyan transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-gmg-cyan/0 to-gmg-cyan/0 group-hover:from-gmg-cyan/10 group-hover:to-gmg-purple/5 transition-all duration-500 rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gmg-cyan/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-cyan/30 transition-all">
                  <Target className="w-8 h-8 text-gmg-cyan" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Marketing Campaigns</h3>
                <p className="text-gmg-gray mb-6 leading-relaxed">
                  Coordinated campaigns designed to increase streams and audience engagement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-cyan rounded-full"></div>
                    Catalog promotion
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-cyan rounded-full"></div>
                    Fan targeting strategies
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-cyan rounded-full"></div>
                    Release reactivation campaigns
                  </li>
                </ul>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-violet/30 rounded-3xl p-10 hover:border-gmg-violet transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-gmg-violet/0 to-gmg-violet/0 group-hover:from-gmg-violet/10 group-hover:to-gmg-purple/5 transition-all duration-500 rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gmg-violet/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-violet/30 transition-all">
                  <Users className="w-8 h-8 text-gmg-violet" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Audience Expansion</h3>
                <p className="text-gmg-gray mb-6 leading-relaxed">
                  Reach new listeners across streaming and social platforms.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-violet rounded-full"></div>
                    Audience growth campaigns
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-violet rounded-full"></div>
                    Platform expansion
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-violet rounded-full"></div>
                    Data-driven promotion
                  </li>
                </ul>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-magenta/30 rounded-3xl p-10 hover:border-gmg-magenta transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-gmg-magenta/0 to-gmg-magenta/0 group-hover:from-gmg-magenta/10 group-hover:to-gmg-purple/5 transition-all duration-500 rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gmg-magenta/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-magenta/30 transition-all">
                  <ShoppingBag className="w-8 h-8 text-gmg-magenta" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Merchandise & Products</h3>
                <p className="text-gmg-gray mb-6 leading-relaxed">
                  Expand music catalogs into consumer products and merchandise.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-magenta rounded-full"></div>
                    Apparel development
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-magenta rounded-full"></div>
                    Product branding
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-magenta rounded-full"></div>
                    E-commerce systems
                  </li>
                </ul>
              </div>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-gold/30 rounded-3xl p-10 hover:border-gmg-gold transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-gmg-gold/0 to-gmg-gold/0 group-hover:from-gmg-gold/10 group-hover:to-gmg-purple/5 transition-all duration-500 rounded-3xl"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gmg-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-gold/30 transition-all">
                  <Film className="w-8 h-8 text-gmg-gold" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Media & Culture</h3>
                <p className="text-gmg-gray mb-6 leading-relaxed">
                  Extend music catalogs into new storytelling formats.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-gold rounded-full"></div>
                    Music-driven microseries
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-gold rounded-full"></div>
                    Artist storytelling
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gmg-gray">
                    <div className="w-1.5 h-1.5 bg-gmg-gold rounded-full"></div>
                    Brand collaborations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-gmg-charcoal to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">At a Certain Stage, Artists Need CEOs . Not Managers</h2>
            <p className="text-xl text-gmg-gray mb-8 leading-relaxed max-w-3xl mx-auto">
              Early in their careers, artists often rely on managers to guide creative opportunities.
            </p>
            <p className="text-xl text-gmg-gray mb-8 leading-relaxed max-w-3xl mx-auto">
              But once an artist has built a catalog, touring audience, and fan base, the challenge becomes running and growing a business.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-10 mb-8">
            <p className="text-xl text-gmg-gray leading-relaxed mb-6 text-center">
              At that stage, artists need more than a traditional manager taking a percentage.
            </p>
            <p className="text-2xl text-gmg-white font-bold text-center mb-8">
              They need a team capable of <span className="gradient-text">operating the business behind the music</span>.
            </p>
            <p className="text-lg text-gmg-gray text-center max-w-3xl mx-auto">
              Major artists such as Beyoncé, Bon Jovi, and the Grateful Dead have structured their careers this way for years.
            </p>
          </div>

          <p className="text-xl text-gmg-white font-semibold text-center">
            GMG helps artists operate and expand their catalog as a modern business.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Who This Is For</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-10 text-center hover:border-gmg-cyan transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-cyan/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-gmg-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Established Artists</h3>
              <p className="text-gmg-gray leading-relaxed">
                Artists with catalogs and fanbases who want to expand their reach and revenue.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-violet/30 rounded-3xl p-10 text-center hover:border-gmg-violet transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-violet/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Radio className="w-8 h-8 text-gmg-violet" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Independent Labels</h3>
              <p className="text-gmg-gray leading-relaxed">
                Labels with rosters and music catalogs seeking growth infrastructure.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-magenta/30 rounded-3xl p-10 text-center hover:border-gmg-magenta transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-magenta/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-gmg-magenta" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Catalog Owners</h3>
              <p className="text-gmg-gray leading-relaxed">
                Rights holders looking to increase the value and impact of their music assets.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-gmg-charcoal to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Flexible Partnership Structures</h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto mb-12">
              GMG works with artists and catalog owners through a variety of partnership structures designed to support catalog growth and long-term value creation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gmg-graphite/40 border border-gmg-cyan/20 rounded-2xl p-8 text-center hover:border-gmg-cyan transition-all">
              <div className="w-12 h-12 bg-gmg-cyan/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-gmg-cyan" />
              </div>
              <h3 className="text-lg font-bold mb-2">Growth Partnerships</h3>
              <p className="text-sm text-gmg-gray">Collaborative catalog expansion initiatives</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-violet/20 rounded-2xl p-8 text-center hover:border-gmg-violet transition-all">
              <div className="w-12 h-12 bg-gmg-violet/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-gmg-violet" />
              </div>
              <h3 className="text-lg font-bold mb-2">Operational Support</h3>
              <p className="text-sm text-gmg-gray">Infrastructure and systems integration</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-magenta/20 rounded-2xl p-8 text-center hover:border-gmg-magenta transition-all">
              <div className="w-12 h-12 bg-gmg-magenta/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-gmg-magenta" />
              </div>
              <h3 className="text-lg font-bold mb-2">Catalog Collaborations</h3>
              <p className="text-sm text-gmg-gray">Joint venture opportunities</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-gold/20 rounded-2xl p-8 text-center hover:border-gmg-gold transition-all">
              <div className="w-12 h-12 bg-gmg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-gmg-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">Strategic Partnerships</h3>
              <p className="text-sm text-gmg-gray">Long-term value creation plans</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black via-gmg-cyan/10 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Explore a Catalog Partnership</h2>
          <p className="text-xl text-gmg-gray mb-12 max-w-3xl mx-auto">
            If you are an artist, label, or catalog owner looking to grow the reach and value of your music, GMG would love to explore a partnership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-gmg-cyan to-gmg-blue text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-gmg-cyan/30"
            >
              Start a Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gmg-graphite/50 hover:bg-gmg-graphite backdrop-blur-sm text-gmg-white rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-gmg-cyan/30"
            >
              Contact GMG
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
