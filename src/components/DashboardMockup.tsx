import { TrendingUp, Users, Calendar, Target, BarChart3, Globe } from 'lucide-react';

export function ArtistDashboard() {
  return (
    <div className="relative h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-400">Artist Dashboard</h3>
            <p className="text-xs text-gray-600">Last 30 days</p>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">284K</div>
            <div className="text-xs text-gray-400">Streams</div>
            <div className="text-xs text-green-400 mt-1">+24%</div>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Users className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">12.5K</div>
            <div className="text-xs text-gray-400">Followers</div>
            <div className="text-xs text-green-400 mt-1">+18%</div>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <Target className="w-5 h-5 text-cyan-400 mb-2" />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-gray-400">Campaigns</div>
            <div className="text-xs text-blue-400 mt-1">Active</div>
          </div>
        </div>

        <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400">Campaign Performance</span>
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </div>
          <div className="space-y-2">
            {[65, 82, 45, 91, 73].map((height, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-16 text-xs text-gray-500">Week {i + 1}</div>
                <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${height}%` }}
                  ></div>
                </div>
                <div className="w-12 text-xs text-gray-400 text-right">{height}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
            <Calendar className="w-4 h-4 text-gray-500 mb-2" />
            <div className="text-xs text-gray-400">Next Release</div>
            <div className="text-sm font-medium text-white">March 15</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800">
            <Target className="w-4 h-4 text-gray-500 mb-2" />
            <div className="text-xs text-gray-400">Ad Spend</div>
            <div className="text-sm font-medium text-white">$2,450</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RocksteadyInterface() {
  return (
    <div className="relative h-[500px] bg-gradient-to-br from-cyan-950/30 to-blue-950/30 rounded-2xl border border-cyan-500/30 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e920_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e920_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative h-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-cyan-400">Rocksteady Discovery</h3>
            <p className="text-xs text-gray-500">AI-Powered A&R Intelligence</p>
          </div>
          <div className="px-3 py-1 bg-cyan-500/20 rounded-full text-xs text-cyan-400">
            Live
          </div>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Rising Artist A', growth: '+284%', signals: 'High' },
            { name: 'Emerging Artist B', growth: '+195%', signals: 'Medium' },
            { name: 'Breakout Artist C', growth: '+347%', signals: 'Very High' },
          ].map((artist, i) => (
            <div key={i} className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg"></div>
                  <div>
                    <div className="text-sm font-medium text-white">{artist.name}</div>
                    <div className="text-xs text-gray-400">Electronic / Pop</div>
                  </div>
                </div>
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Growth Velocity</div>
                  <div className="text-sm font-bold text-cyan-400">{artist.growth}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cultural Signals</div>
                  <div className="text-sm font-bold text-white">{artist.signals}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-cyan-500/5 rounded-xl border border-cyan-500/20 p-4">
          <div className="text-xs text-gray-400 mb-3">Trend Analysis</div>
          <div className="flex items-end justify-between h-24 gap-1">
            {[20, 35, 28, 45, 38, 52, 48, 65, 58, 72, 68, 84].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogGrowthPanel() {
  return (
    <div className="relative h-[500px] bg-gradient-to-br from-emerald-950/30 to-green-950/30 rounded-2xl border border-emerald-500/30 p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98120_1px,transparent_1px),linear-gradient(to_bottom,#10b98120_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative h-full flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-medium text-emerald-400">Catalog Performance</h3>
          <p className="text-xs text-gray-500">Growth Analytics</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
            <div className="text-2xl font-bold text-white">1.2M</div>
            <div className="text-xs text-gray-400">Monthly Streams</div>
            <div className="text-xs text-green-400 mt-1">+32%</div>
          </div>
          <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <Globe className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">48</div>
            <div className="text-xs text-gray-400">Countries</div>
            <div className="text-xs text-blue-400 mt-1">Expanded</div>
          </div>
        </div>

        <div className="flex-1 bg-emerald-500/5 rounded-xl border border-emerald-500/20 p-4">
          <div className="text-xs text-gray-400 mb-3">Revenue Growth</div>
          <div className="h-full flex items-end gap-2">
            {[45, 52, 48, 65, 71, 68, 78, 85, 82, 92, 88, 95].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full bg-gradient-to-t from-emerald-500 to-green-500 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-lg font-bold text-white">245</div>
            <div className="text-xs text-gray-400">Tracks</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-lg font-bold text-white">12</div>
            <div className="text-xs text-gray-400">Active Campaigns</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-lg font-bold text-white">$48K</div>
            <div className="text-xs text-gray-400">Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}
