import { Link } from 'react-router-dom';
import { Sparkles, Target, Calendar, TrendingUp, Video, BarChart3, Zap, Radio, Music, Users, PlayCircle, ArrowRight, CheckCircle, LineChart, Megaphone } from 'lucide-react';

export default function AIMarketingTools() {
  return (
    <div className="min-h-screen bg-gmg-charcoal text-gmg-white">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gmg-charcoal via-gmg-violet/10 to-gmg-charcoal">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full filter blur-[140px]" style={{ background: 'radial-gradient(circle, rgba(108, 75, 255, 0.4) 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(0, 224, 255, 0.3) 0%, transparent 70%)' }}></div>
        </div>

        <div className="absolute inset-0 opacity-5">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px w-full"
              style={{
                top: `${(i + 1) * 6.67}%`,
                background: 'linear-gradient(90deg, transparent, rgba(0, 224, 255, 0.6) 50%, transparent)',
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-gmg-cyan/20 border border-gmg-cyan/30 rounded-full text-sm text-gmg-cyan font-semibold">
              AI-Powered Music Marketing
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              AI Tools to Promote<br />
              <span className="gradient-text">Your Music</span>
            </h1>

            <p className="text-xl md:text-2xl text-gmg-gray max-w-4xl mx-auto mb-12 leading-relaxed">
              Greater Music Group provides AI powered marketing tools that help artists launch smarter campaigns, reach new audiences, and grow their music across streaming and social platforms.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link
                to="/artist-growth"
                className="group px-8 py-4 bg-gradient-to-r from-gmg-cyan to-gmg-blue rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start Growing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 bg-gmg-graphite/60 border border-gmg-cyan/30 rounded-full font-bold text-lg hover:bg-gmg-graphite hover:border-gmg-cyan transition-all duration-300"
              >
                Get Early Access
              </Link>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="relative bg-gradient-to-br from-gmg-graphite/80 to-gmg-charcoal border border-gmg-cyan/20 rounded-3xl p-8 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gmg-cyan/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gmg-violet/10 rounded-full filter blur-3xl"></div>

                <div className="relative grid md:grid-cols-2 gap-6">
                  <div className="bg-gmg-charcoal/50 rounded-2xl p-6 border border-gmg-cyan/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-8 h-8 text-gmg-cyan" />
                      <div className="text-left">
                        <div className="text-2xl font-bold">Campaign Active</div>
                        <div className="text-xs text-gmg-gray">Spotify + Social</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gmg-gray">Reach</span>
                        <span className="text-gmg-cyan font-semibold">142K</span>
                      </div>
                      <div className="w-full bg-gmg-graphite rounded-full h-2">
                        <div className="bg-gradient-to-r from-gmg-cyan to-gmg-blue h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gmg-gray">
                        <span>76% to goal</span>
                        <span>4 days left</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gmg-charcoal/50 rounded-2xl p-6 border border-gmg-violet/20">
                    <div className="flex items-center gap-3 mb-4">
                      <LineChart className="w-8 h-8 text-gmg-violet" />
                      <div className="text-left">
                        <div className="text-2xl font-bold">+234%</div>
                        <div className="text-xs text-gmg-gray">Stream Growth</div>
                      </div>
                    </div>
                    <div className="h-20 flex items-end gap-1">
                      {[30, 45, 38, 60, 52, 78, 85, 100].map((height, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-gmg-violet to-gmg-purple rounded-t" style={{ height: `${height}%` }}></div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gmg-charcoal/50 rounded-2xl p-6 border border-gmg-magenta/20 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <Megaphone className="w-8 h-8 text-gmg-magenta" />
                      <div className="text-left">
                        <div className="text-lg font-bold">Active Promotions</div>
                        <div className="text-xs text-gmg-gray">Cross-platform campaigns</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gmg-magenta/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <Music className="w-5 h-5 text-gmg-magenta" />
                        </div>
                        <div className="text-sm font-semibold">Spotify</div>
                        <div className="text-xs text-gmg-gray">Running</div>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gmg-cyan/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <Video className="w-5 h-5 text-gmg-cyan" />
                        </div>
                        <div className="text-sm font-semibold">TikTok</div>
                        <div className="text-xs text-gmg-gray">Running</div>
                      </div>
                      <div className="text-center">
                        <div className="w-10 h-10 bg-gmg-gold/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <PlayCircle className="w-5 h-5 text-gmg-gold" />
                        </div>
                        <div className="text-sm font-semibold">YouTube</div>
                        <div className="text-xs text-gmg-gray">Scheduled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Music Marketing Is<br />Too Complicated
            </h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto leading-relaxed mb-8">
              Independent artists are expected to run advertising campaigns, manage releases, create content, and grow their audience across multiple platforms.
            </p>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto leading-relaxed mb-8">
              Most artists don't have the tools or time to do this effectively.
            </p>
            <p className="text-xl text-gmg-white font-semibold max-w-3xl mx-auto">
              GMG simplifies music marketing through intelligent tools and automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gmg-graphite/40 border border-gmg-graphite rounded-2xl p-8 text-left hover:border-gmg-violet/30 transition-all">
              <div className="w-12 h-12 bg-gmg-violet/20 rounded-xl flex items-center justify-center mb-4">
                <Radio className="w-6 h-6 text-gmg-violet" />
              </div>
              <h3 className="text-xl font-bold mb-2">Running ads is complex</h3>
              <p className="text-gmg-gray">Platform advertising requires technical expertise and constant optimization</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-graphite rounded-2xl p-8 text-left hover:border-gmg-cyan/30 transition-all">
              <div className="w-12 h-12 bg-gmg-cyan/20 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-gmg-cyan" />
              </div>
              <h3 className="text-xl font-bold mb-2">Release campaigns are hard to plan</h3>
              <p className="text-gmg-gray">Coordinating timelines and promotions across platforms is overwhelming</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-graphite rounded-2xl p-8 text-left hover:border-gmg-magenta/30 transition-all">
              <div className="w-12 h-12 bg-gmg-magenta/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gmg-magenta" />
              </div>
              <h3 className="text-xl font-bold mb-2">Finding new audiences is difficult</h3>
              <p className="text-gmg-gray">Discovery and fan growth requires data and targeting most artists don't have</p>
            </div>

            <div className="bg-gmg-graphite/40 border border-gmg-graphite rounded-2xl p-8 text-left hover:border-gmg-gold/30 transition-all">
              <div className="w-12 h-12 bg-gmg-gold/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-gmg-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Marketing takes too much time</h3>
              <p className="text-gmg-gray">Manual campaign management drains time away from creating music</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-gmg-charcoal to-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">AI Music Marketing Tools</h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto">
              Comprehensive tools designed to help artists promote their music more effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-violet/30 rounded-3xl p-8 hover:border-gmg-violet transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-violet/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-violet/30 transition-all">
                <Sparkles className="w-8 h-8 text-gmg-violet" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Automated Marketing Campaigns</h3>
              <p className="text-gmg-gray mb-6">
                Launch campaigns that promote your music across multiple platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-violet" />
                  Automated campaign setup
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-violet" />
                  Platform promotion tools
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-violet" />
                  Fan targeting
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-8 hover:border-gmg-cyan transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-cyan/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-cyan/30 transition-all">
                <Radio className="w-8 h-8 text-gmg-cyan" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Music Advertising Tools</h3>
              <p className="text-gmg-gray mb-6">
                Run ads designed specifically for music promotion.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-cyan" />
                  Spotify promotion campaigns
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-cyan" />
                  YouTube music promotion
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-cyan" />
                  Social media ad support
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-magenta/30 rounded-3xl p-8 hover:border-gmg-magenta transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-magenta/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-magenta/30 transition-all">
                <Calendar className="w-8 h-8 text-gmg-magenta" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Release Campaign Planning</h3>
              <p className="text-gmg-gray mb-6">
                Plan music releases with structured timelines and marketing strategies.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-magenta" />
                  Release calendar tools
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-magenta" />
                  Promotion checklists
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-magenta" />
                  Campaign scheduling
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-gold/30 rounded-3xl p-8 hover:border-gmg-gold transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-gold/30 transition-all">
                <TrendingUp className="w-8 h-8 text-gmg-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Audience Growth Tools</h3>
              <p className="text-gmg-gray mb-6">
                Understand and expand your fanbase using audience insights.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-gold" />
                  Fan analytics
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-gold" />
                  Growth signals
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-gold" />
                  Engagement indicators
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-blue/30 rounded-3xl p-8 hover:border-gmg-blue transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-blue/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-blue/30 transition-all">
                <Video className="w-8 h-8 text-gmg-blue" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Content Promotion Tools</h3>
              <p className="text-gmg-gray mb-6">
                Help your music and videos reach new audiences.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-blue" />
                  Short-form content promotion
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-blue" />
                  Platform discovery tools
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-blue" />
                  Viral content support
                </li>
              </ul>
            </div>

            <div className="group bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-white/30 rounded-3xl p-8 hover:border-gmg-white transition-all duration-500 hover:scale-105">
              <div className="w-16 h-16 bg-gmg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gmg-white/30 transition-all">
                <BarChart3 className="w-8 h-8 text-gmg-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Campaign Analytics</h3>
              <p className="text-gmg-gray mb-6">
                Track performance and optimize marketing campaigns in real-time.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-white" />
                  Real-time campaign tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-white" />
                  Performance insights
                </li>
                <li className="flex items-center gap-2 text-sm text-gmg-gray">
                  <CheckCircle className="w-4 h-4 text-gmg-white" />
                  Optimization recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">A Smarter Way to<br />Promote Your Music</h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto">
              Three steps to start promoting your music more effectively
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-gmg-cyan to-gmg-blue rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-gmg-cyan/20">
                1
              </div>
              <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/30 rounded-3xl p-8 pt-12 h-full">
                <h3 className="text-2xl font-bold mb-4">Plan</h3>
                <p className="text-gmg-gray leading-relaxed">
                  Build a structured campaign before your release with timelines and promotional strategies.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-gmg-violet to-gmg-purple rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-gmg-violet/20">
                2
              </div>
              <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-violet/30 rounded-3xl p-8 pt-12 h-full">
                <h3 className="text-2xl font-bold mb-4">Launch</h3>
                <p className="text-gmg-gray leading-relaxed">
                  Use automated marketing tools to promote across platforms with intelligent targeting.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-gmg-magenta to-gmg-pink rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-gmg-magenta/20">
                3
              </div>
              <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-magenta/30 rounded-3xl p-8 pt-12 h-full">
                <h3 className="text-2xl font-bold mb-4">Grow</h3>
                <p className="text-gmg-gray leading-relaxed">
                  Track audience growth and optimize campaigns using real-time analytics and insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-gmg-charcoal to-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Designed for the<br />
                <span className="gradient-text">Modern Music Landscape</span>
              </h2>
              <p className="text-xl text-gmg-gray leading-relaxed mb-8">
                GMG tools are built for artists navigating the streaming era, where success depends on consistent releases, smart marketing, and audience engagement.
              </p>
              <Link
                to="/artist-growth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gmg-cyan to-gmg-blue rounded-full font-bold text-lg hover:scale-105 transition-all duration-300"
              >
                Explore Tools
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal border border-gmg-cyan/20 rounded-3xl p-8 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-gmg-charcoal/50 rounded-2xl p-4">
                    <div className="w-12 h-12 bg-gmg-cyan/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-gmg-cyan" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">Automated Campaigns</div>
                      <div className="text-sm text-gmg-gray truncate">Cross-platform promotion</div>
                    </div>
                    <div className="text-gmg-cyan font-bold text-lg">Active</div>
                  </div>

                  <div className="flex items-center gap-4 bg-gmg-charcoal/50 rounded-2xl p-4">
                    <div className="w-12 h-12 bg-gmg-violet/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-gmg-violet" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">Stream Growth +156%</div>
                      <div className="text-sm text-gmg-gray truncate">Last 30 days</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-gmg-charcoal/50 rounded-2xl p-4">
                    <div className="w-12 h-12 bg-gmg-magenta/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-gmg-magenta" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">New Fans +12.4K</div>
                      <div className="text-sm text-gmg-gray truncate">Audience expansion</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black to-gmg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Start Promoting Your<br />Music Smarter
          </h2>
          <p className="text-xl text-gmg-gray mb-12 max-w-2xl mx-auto leading-relaxed">
            Join artists using AI tools to plan releases, launch campaigns, and grow their audience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/artist-growth"
              className="group px-8 py-4 bg-gradient-to-r from-gmg-cyan to-gmg-blue rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-gmg-graphite/60 border border-gmg-cyan/30 rounded-full font-bold text-lg hover:bg-gmg-graphite hover:border-gmg-cyan transition-all duration-300"
            >
              Join the Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
