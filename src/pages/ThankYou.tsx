import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gmg-charcoal text-gmg-white pt-24 flex items-center">
      <section className="py-20 px-6 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gmg-violet to-gmg-magenta rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-gmg-violet/50 animate-pulse-slow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Thanks for Reaching Out
          </h1>

          <p className="text-xl text-gmg-gray mb-12 leading-relaxed max-w-2xl mx-auto">
            A member of the GMG team will follow up shortly. We are excited to explore how we can work together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/"
              className="group px-8 py-4 gradient-violet-magenta hover:opacity-90 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 glow-violet flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Explore the Platform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              to="/ai-tools"
              className="p-6 bg-gmg-graphite/40 rounded-2xl border border-gmg-violet/20 hover:border-gmg-violet/40 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-3">🎵</div>
              <div className="text-lg font-semibold text-gmg-white mb-2">AI Artist Tools</div>
              <div className="text-sm text-gmg-gray">Discover growth systems for artists</div>
            </Link>

            <Link
              to="/rocksteady"
              className="p-6 bg-gmg-graphite/40 rounded-2xl border border-gmg-cyan/20 hover:border-gmg-cyan/40 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-3">🧠</div>
              <div className="text-lg font-semibold text-gmg-white mb-2">Rocksteady A&R</div>
              <div className="text-sm text-gmg-gray">Explore AI discovery platform</div>
            </Link>

            <Link
              to="/media"
              className="p-6 bg-gmg-graphite/40 rounded-2xl border border-gmg-magenta/20 hover:border-gmg-magenta/40 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-3">🎬</div>
              <div className="text-lg font-semibold text-gmg-white mb-2">Music Media</div>
              <div className="text-sm text-gmg-gray">Learn about our microseries</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
