import { Link } from 'react-router-dom';
import { Target, Zap, BarChart, Users, TrendingUp } from 'lucide-react';

export default function Operations() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-black to-amber-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8">Artist Operations, Rebuilt</h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            GMG provides operational infrastructure that helps modern artist businesses run more efficiently.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/50"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-10 h-10" />}
              title="Marketing Operations"
              description="Streamlined marketing workflows that help artists execute campaigns efficiently."
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10" />}
              title="Campaign Execution"
              description="End-to-end campaign management from planning through execution and analysis."
            />
            <FeatureCard
              icon={<BarChart className="w-10 h-10" />}
              title="Business Infrastructure"
              description="Essential operational tools and infrastructure for running a modern artist business."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Direct-to-Fan Systems"
              description="Technology and strategies to build direct relationships with fans."
            />
            <FeatureCard
              icon={<TrendingUp className="w-10 h-10" />}
              title="Revenue Workflow Support"
              description="Systems to manage and optimize revenue streams across platforms."
            />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Focus on Music, Not Admin</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Artists shouldn't have to choose between making music and running their business. GMG provides the infrastructure to do both.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-semibold text-lg transition-all hover:scale-105"
          >
            Partner With Us
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all hover:scale-105">
      <div className="text-orange-400 mb-4">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
