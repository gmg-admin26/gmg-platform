import { Link } from 'react-router-dom';
import { Workflow, Zap, Database, Settings, Users, TrendingUp } from 'lucide-react';

export default function PlatformOperations() {
  const features = [
    {
      icon: Zap,
      title: 'Marketing Operations',
      description: 'Streamlined marketing workflows that help you execute campaigns efficiently and effectively.'
    },
    {
      icon: Settings,
      title: 'Campaign Execution',
      description: 'End-to-end campaign management from strategy to execution to analysis.'
    },
    {
      icon: Database,
      title: 'Business Infrastructure',
      description: 'Core operational infrastructure that modern artist businesses need to scale.'
    },
    {
      icon: Users,
      title: 'Direct-to-Fan Systems',
      description: 'Build and maintain direct relationships with your audience through integrated systems.'
    },
    {
      icon: TrendingUp,
      title: 'Revenue Workflow Support',
      description: 'Operational tools that help you manage and optimize revenue streams.'
    },
    {
      icon: Workflow,
      title: 'Integrated Workflows',
      description: 'Connected systems that reduce manual work and increase operational efficiency.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gmg-charcoal to-black text-white pt-24">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gmg-cyan/10 border border-gmg-cyan/20">
              <Workflow className="w-4 h-4 text-gmg-cyan" />
              <span className="text-sm text-gmg-cyan font-medium">Platform</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Artist Operations,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gmg-cyan to-gmg-violet">
              Rebuilt
            </span>
          </h1>

          <p className="text-xl text-gmg-gray max-w-3xl mx-auto mb-12">
            GMG provides operational infrastructure that helps modern artist businesses run more efficiently.
          </p>

          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gmg-cyan to-gmg-violet text-white rounded-full font-semibold hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
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
                className="group relative p-8 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-gmg-cyan/20 hover:border-gmg-cyan/50 transition-all"
              >
                <div className="absolute inset-0 bg-gmg-cyan/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative">
                  <div className="inline-flex p-4 rounded-2xl bg-gmg-charcoal border border-gmg-cyan/20 mb-6">
                    <Icon className="w-8 h-8 text-gmg-cyan" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gmg-gray leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="relative p-10 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-gmg-cyan/20">
            <h3 className="text-2xl font-bold mb-4">For Independent Artists</h3>
            <p className="text-gmg-gray leading-relaxed mb-6">
              Build a professional operation without the overhead of traditional infrastructure.
              Focus on your art while we handle the operational complexity.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                <span className="text-gmg-gray">Automated workflow management</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                <span className="text-gmg-gray">Integrated marketing systems</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-cyan mt-2"></div>
                <span className="text-gmg-gray">Direct fan engagement tools</span>
              </li>
            </ul>
          </div>

          <div className="relative p-10 bg-gradient-to-br from-gmg-graphite/60 to-gmg-charcoal rounded-3xl border border-gmg-violet/20">
            <h3 className="text-2xl font-bold mb-4">For Growing Artist Businesses</h3>
            <p className="text-gmg-gray leading-relaxed mb-6">
              Scale your operations efficiently as your business grows. Get the infrastructure
              you need without building it from scratch.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                <span className="text-gmg-gray">Scalable business infrastructure</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                <span className="text-gmg-gray">Revenue optimization systems</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet mt-2"></div>
                <span className="text-gmg-gray">Professional operations support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative p-12 bg-gradient-to-br from-gmg-cyan/10 to-gmg-violet/10 rounded-3xl border border-gmg-cyan/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Build a Better Artist Business</h2>
            <p className="text-xl text-gmg-gray mb-8">
              Get the operational infrastructure that helps you run your business professionally and efficiently.
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
