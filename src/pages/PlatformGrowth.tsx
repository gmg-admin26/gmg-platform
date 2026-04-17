import { Link } from 'react-router-dom';
import { TrendingUp, Target, BarChart3, Users, Globe, Sparkles } from 'lucide-react';

export default function PlatformGrowth() {
  const strategies = [
    {
      icon: Target,
      title: 'Audience Targeting',
      description: 'Data-driven audience identification and targeting strategies that help you reach the right listeners.'
    },
    {
      icon: BarChart3,
      title: 'Growth Analytics',
      description: 'Deep analytics that reveal growth opportunities and help you make informed decisions.'
    },
    {
      icon: Users,
      title: 'Fan Development',
      description: 'Convert casual listeners into dedicated fans through strategic engagement and content.'
    },
    {
      icon: Globe,
      title: 'Market Expansion',
      description: 'Identify and enter new markets with data-informed expansion strategies.'
    },
    {
      icon: Sparkles,
      title: 'Content Strategy',
      description: 'Optimize your content strategy based on audience behavior and cultural trends.'
    },
    {
      icon: TrendingUp,
      title: 'Momentum Building',
      description: 'Create and sustain growth momentum through coordinated campaigns and initiatives.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gmg-charcoal to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gmg-magenta/10 border border-gmg-magenta/20">
              <TrendingUp className="w-4 h-4 text-gmg-magenta" />
              <span className="text-sm text-gmg-magenta font-medium">Platform</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Data-Driven
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gmg-magenta to-gmg-violet">
              Artist Growth
            </span>
          </h1>

          <p className="text-xl text-gmg-gray max-w-3xl mx-auto mb-12">
            GMG helps artists grow strategically through data-driven strategies and tools designed
            to accelerate audience development and expand reach.
          </p>

          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gmg-magenta to-gmg-violet text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {strategies.map((strategy, index) => {
            const Icon = strategy.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-gmg-magenta/20 hover:border-gmg-magenta/50 transition-all"
              >
                <div className="absolute inset-0 bg-gmg-magenta/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-gmg-charcoal border border-gmg-magenta/20 mb-6">
                    <Icon className="w-8 h-8 text-gmg-magenta" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{strategy.title}</h3>
                  <p className="text-gmg-gray leading-relaxed">{strategy.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative p-12 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-white/10 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Growth Framework</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gmg-magenta">Discovery & Reach</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Identify target audiences and growth opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Launch strategic campaigns to expand reach</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Optimize content for maximum discovery</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gmg-violet">Engagement & Retention</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                    <span className="text-gmg-gray">Build deeper connections with your audience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                    <span className="text-gmg-gray">Create retention strategies that build loyalty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                    <span className="text-gmg-gray">Turn casual listeners into dedicated fans</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gmg-cyan">Analysis & Optimization</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                    <span className="text-gmg-gray">Track performance across all platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                    <span className="text-gmg-gray">Identify what works and double down</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                    <span className="text-gmg-gray">Continuously refine your growth strategy</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-gmg-magenta">Expansion & Scale</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Enter new markets and demographics</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Scale successful campaigns efficiently</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gmg-magenta mt-2"></div>
                    <span className="text-gmg-gray">Build sustainable long-term growth</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="relative p-12 bg-gradient-to-br from-gmg-magenta/10 to-gmg-violet/10 rounded-3xl border border-gmg-magenta/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Accelerate Your Growth?</h2>
            <p className="text-xl text-gmg-gray mb-8">
              Partner with GMG to build a data-driven growth strategy that helps you reach more listeners and build a bigger fanbase.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gmg-gray transition-all"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
