import { Link } from 'react-router-dom';
import { Sparkles, Target, Calendar, Users, Megaphone, BarChart3 } from 'lucide-react';

export default function PlatformAITools() {
  const features = [
    {
      icon: Target,
      title: 'Automated Marketing Support',
      description: 'AI-powered marketing automation that helps you reach the right audiences at the right time.'
    },
    {
      icon: Megaphone,
      title: 'Ad Campaign Tools',
      description: 'Create, launch, and optimize advertising campaigns across multiple platforms with AI assistance.'
    },
    {
      icon: Calendar,
      title: 'Release Planning',
      description: 'Strategic release planning tools that maximize impact and audience engagement.'
    },
    {
      icon: Users,
      title: 'Collaboration Recommendations',
      description: 'Discover collaboration opportunities based on audience overlap and cultural signals.'
    },
    {
      icon: BarChart3,
      title: 'Fan Growth Tools',
      description: 'Data-driven tools to understand, reach, and grow your fanbase effectively.'
    },
    {
      icon: Sparkles,
      title: 'Workflow Automation',
      description: 'Automate repetitive tasks and focus on what matters: creating great music.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gmg-charcoal to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gmg-violet/10 border border-gmg-violet/20">
              <Sparkles className="w-4 h-4 text-gmg-violet" />
              <span className="text-sm text-gmg-violet font-medium">Platform</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            AI Tools Built for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gmg-violet to-gmg-cyan">
              Artist Growth
            </span>
          </h1>

          <p className="text-xl text-gmg-gray max-w-3xl mx-auto mb-12">
            GMG provides AI-powered tools and services designed to help artists grow faster and operate more efficiently.
          </p>

          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gmg-violet to-gmg-cyan text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all"
          >
            Get Started
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-gmg-violet/20 hover:border-gmg-violet/50 transition-all"
              >
                <div className="absolute inset-0 bg-gmg-violet/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-gmg-charcoal border border-gmg-violet/20 mb-6">
                    <Icon className="w-8 h-8 text-gmg-violet" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gmg-gray leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative p-12 bg-gradient-to-br from-gmg-violet/10 to-gmg-cyan/10 rounded-3xl border border-gmg-violet/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Accelerate Your Growth?</h2>
            <p className="text-xl text-gmg-gray mb-8">
              Join artists who are using GMG's AI tools to grow smarter, faster, and more efficiently.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gmg-gray transition-all"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
