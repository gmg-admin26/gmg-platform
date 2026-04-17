import { Link } from 'react-router-dom';
import { Sparkles, Target, Calendar, Users, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { ArtistDashboard } from '../components/DashboardMockup';

export default function AITools() {
  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full mb-8 backdrop-blur-sm">
            <span className="text-blue-400 text-sm font-medium">AI-Powered Artist Tools</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">AI Tools Built for<br />Artist Growth</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            GMG provides AI-powered tools and services designed to help artists grow faster and operate more efficiently.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/40"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Command Center</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Track campaigns, monitor growth, and make data-driven decisions with our comprehensive artist dashboard.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Real-time Analytics</div>
                    <div className="text-sm text-gray-500">Monitor streams, followers, and engagement across all platforms</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Campaign Management</div>
                    <div className="text-sm text-gray-500">Launch and track marketing campaigns from one place</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white mb-1">Release Planning</div>
                    <div className="text-sm text-gray-500">Strategic scheduling based on audience behavior</div>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <ArtistDashboard />
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Complete Toolkit</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything artists need to plan, launch, and optimize their music careers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ToolCard
              icon={<Target className="w-10 h-10" />}
              title="Automated Marketing Support"
              description="AI-driven marketing automation that helps artists reach the right audiences at the right time."
            />
            <ToolCard
              icon={<Sparkles className="w-10 h-10" />}
              title="Ad Campaign Tools"
              description="Smart advertising tools that optimize spend and maximize reach across platforms."
            />
            <ToolCard
              icon={<Calendar className="w-10 h-10" />}
              title="Release Planning"
              description="Strategic release planning powered by data insights and market intelligence."
            />
            <ToolCard
              icon={<Users className="w-10 h-10" />}
              title="Collaboration Recommendations"
              description="AI-powered recommendations for artist collaborations based on audience overlap and trends."
            />
            <ToolCard
              icon={<TrendingUp className="w-10 h-10" />}
              title="Fan Growth Tools"
              description="Tools designed to help artists grow and engage their fanbase effectively."
            />
            <ToolCard
              icon={<Zap className="w-10 h-10" />}
              title="Workflow Automation"
              description="Streamline repetitive tasks and focus on creating music with intelligent automation."
            />
          </div>
        </div>
      </section>

      <section className="py-32 px-6 bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">Work Smarter, Not Harder</h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Our AI tools handle the complexity of modern music marketing, so artists can focus on what matters most: creating great music.
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

function ToolCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group relative p-8 bg-gradient-to-br from-gray-900/80 to-black rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300"></div>
      <div className="relative">
        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
          <div className="text-blue-400">{icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
}
