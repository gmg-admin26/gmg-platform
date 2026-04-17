import { Link } from 'react-router-dom';
import { BarChart, TrendingUp, Brain, Music, Target, MapPin, Package, Sparkles, ArrowRight } from 'lucide-react';

export default function ProductDemo() {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black via-gray-950 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gmg-violet rounded-full filter blur-[200px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">See the Platform in Action</h2>
          <p className="text-lg text-gmg-gray max-w-2xl mx-auto leading-relaxed">
            AI powered tools that help artists, teams, and catalogs grow faster.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <DashboardPanel
            title="AI Campaign Dashboard"
            description="Automated marketing tools that help artists launch smarter campaigns."
            color="violet"
          >
            <CampaignDashboard />
          </DashboardPanel>

          <DashboardPanel
            title="Rocksteady Discovery"
            description="AI driven discovery that identifies emerging artists and cultural signals."
            color="cyan"
          >
            <RocksteadyDiscovery />
          </DashboardPanel>

          <DashboardPanel
            title="Catalog Growth"
            description="Tools that help artists and labels expand the value of their catalogs."
            color="magenta"
          >
            <CatalogGrowth />
          </DashboardPanel>
        </div>

        <div className="text-center">
          <p className="text-xl text-gmg-white mb-8 font-semibold">
            One infrastructure connecting discovery, marketing, catalog growth, and culture.
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 px-8 py-4 gradient-violet-magenta text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 glow-violet"
          >
            Explore the Platform
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardPanel({
  title,
  description,
  color,
  children
}: {
  title: string;
  description: string;
  color: 'violet' | 'cyan' | 'magenta';
  children: React.ReactNode;
}) {
  const borderColors = {
    violet: 'border-gmg-violet/40 hover:border-gmg-violet/70',
    cyan: 'border-gmg-cyan/40 hover:border-gmg-cyan/70',
    magenta: 'border-gmg-magenta/40 hover:border-gmg-magenta/70',
  };

  const glowColors = {
    violet: 'hover:shadow-[0_0_40px_rgba(108,75,255,0.3)]',
    cyan: 'hover:shadow-[0_0_40px_rgba(35,213,255,0.3)]',
    magenta: 'hover:shadow-[0_0_40px_rgba(255,47,209,0.3)]',
  };

  return (
    <div className={`group relative bg-gmg-graphite/40 backdrop-blur-sm rounded-3xl border-2 ${borderColors[color]} ${glowColors[color]} transition-all hover:scale-105 overflow-hidden`}>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 text-gmg-white">{title}</h3>
        <p className="text-sm text-gmg-gray mb-6 leading-relaxed">{description}</p>
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function CampaignDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-violet/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gmg-violet/20 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-gmg-violet" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gmg-white">Release Campaign</div>
            <div className="text-xs text-gmg-gray">Active • 14 days</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gmg-violet">+284%</div>
          <div className="text-xs text-gmg-gray">Growth</div>
        </div>
      </div>

      <div className="p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-violet/20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gmg-gray font-medium">Ad Performance</div>
          <BarChart className="w-4 h-4 text-gmg-violet" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-gmg-cyan" />
            <div className="text-xs text-gmg-white">Spotify</div>
            <div className="h-1 bg-gmg-violet/20 rounded-full flex-1">
              <div className="h-full w-4/5 bg-gradient-to-r from-gmg-violet to-gmg-magenta rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Music className="w-3 h-3 text-gmg-magenta" />
            <div className="text-xs text-gmg-white">YouTube</div>
            <div className="h-1 bg-gmg-cyan/20 rounded-full flex-1">
              <div className="h-full w-3/5 bg-gradient-to-r from-gmg-cyan to-gmg-violet rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-gmg-gold" />
            <div className="text-xs text-gmg-white">TikTok</div>
            <div className="h-1 bg-gmg-gold/20 rounded-full flex-1">
              <div className="h-full w-2/3 bg-gradient-to-r from-gmg-gold to-gmg-magenta rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-violet/20 text-center">
          <div className="text-xs text-gmg-gray mb-1">Reach</div>
          <div className="text-sm font-bold text-gmg-white">1.2M</div>
        </div>
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-violet/20 text-center">
          <div className="text-xs text-gmg-gray mb-1">Streams</div>
          <div className="text-sm font-bold text-gmg-white">847K</div>
        </div>
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-violet/20 text-center">
          <div className="text-xs text-gmg-gray mb-1">ROI</div>
          <div className="text-sm font-bold text-gmg-violet">3.4x</div>
        </div>
      </div>
    </div>
  );
}

function RocksteadyDiscovery() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-cyan/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gmg-cyan/20 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-gmg-cyan" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gmg-white">Emerging Signal Detected</div>
            <div className="text-xs text-gmg-gray">High growth velocity</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-px bg-gradient-to-r from-gmg-cyan via-gmg-magenta to-transparent"></div>
          <div className="h-px bg-gradient-to-r from-gmg-violet via-gmg-cyan to-transparent opacity-70"></div>
          <div className="h-px bg-gradient-to-r from-gmg-magenta via-gmg-violet to-transparent opacity-50"></div>
        </div>
      </div>

      <div className="p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-cyan/20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gmg-gray font-medium">Growth Trends</div>
          <TrendingUp className="w-4 h-4 text-gmg-cyan" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gmg-white">Audience Growth</div>
            <div className="text-xs font-bold text-gmg-cyan">+342%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gmg-white">Cultural Momentum</div>
            <div className="text-xs font-bold text-gmg-magenta">+218%</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gmg-white">Platform Velocity</div>
            <div className="text-xs font-bold text-gmg-violet">+156%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-cyan/20">
          <Music className="w-4 h-4 text-gmg-cyan mb-2" />
          <div className="text-xs text-gmg-gray mb-1">Artists</div>
          <div className="text-sm font-bold text-gmg-white">1,247</div>
        </div>
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-cyan/20">
          <Target className="w-4 h-4 text-gmg-magenta mb-2" />
          <div className="text-xs text-gmg-gray mb-1">Signals</div>
          <div className="text-sm font-bold text-gmg-white">3,891</div>
        </div>
      </div>
    </div>
  );
}

function CatalogGrowth() {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-magenta/20">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gmg-gray font-medium">Streaming Performance</div>
          <BarChart className="w-4 h-4 text-gmg-magenta" />
        </div>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gmg-white mb-1">2.4M</div>
          <div className="text-xs text-gmg-gray">Monthly Streams</div>
        </div>
        <div className="h-16 flex items-end gap-1">
          {[40, 55, 45, 70, 65, 85, 100].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-gmg-magenta to-gmg-violet rounded-t-sm"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gmg-charcoal/60 rounded-xl border border-gmg-magenta/20">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gmg-magenta" />
          <div className="text-xs text-gmg-gray font-medium">Top Markets</div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gmg-white">United States</span>
            <span className="text-gmg-gray">847K</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gmg-white">United Kingdom</span>
            <span className="text-gmg-gray">524K</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gmg-white">Brazil</span>
            <span className="text-gmg-gray">412K</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-magenta/20">
          <Package className="w-4 h-4 text-gmg-gold mb-2" />
          <div className="text-xs text-gmg-gray mb-1">Merch</div>
          <div className="text-sm font-bold text-gmg-white">$12.4K</div>
        </div>
        <div className="p-3 bg-gmg-charcoal/60 rounded-lg border border-gmg-magenta/20">
          <TrendingUp className="w-4 h-4 text-gmg-cyan mb-2" />
          <div className="text-xs text-gmg-gray mb-1">Growth</div>
          <div className="text-sm font-bold text-gmg-magenta">+187%</div>
        </div>
      </div>
    </div>
  );
}
