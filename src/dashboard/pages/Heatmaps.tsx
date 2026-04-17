import { useState } from 'react';
import { Map, Filter } from 'lucide-react';
import { MAP_NODES } from '../data/rocksteadyData';

const TABS = ['Artist Heatmap', 'Scene Heatmap', 'Producer Heatmap', 'Songwriter Heatmap', 'Superfan Clusters', 'Genre Momentum'];
const TIME_RANGES = ['7D', '30D', '90D', 'All Time'];

const SCENE_NODES = [
  { id: 'ATL-SCENE', lat: 33.75, lng: -84.39, label: 'ATL Trap', intensity: 'critical', count: 12 },
  { id: 'LA-SCENE',  lat: 34.05, lng: -118.24, label: 'LA Alt-Pop', intensity: 'critical', count: 9 },
  { id: 'LON-SCENE', lat: 51.51, lng: -0.13,   label: 'UK R&B', intensity: 'high', count: 7 },
  { id: 'BER-SCENE', lat: 52.52, lng: 13.41,   label: 'Berlin Electronic', intensity: 'high', count: 6 },
  { id: 'MIA-SCENE', lat: 25.77, lng: -80.19,  label: 'Miami Latin', intensity: 'high', count: 8 },
  { id: 'LGS-SCENE', lat: 6.52,  lng: 3.38,    label: 'Lagos Afrobeats', intensity: 'critical', count: 14 },
  { id: 'SAO-SCENE', lat: -23.55,lng: -46.63,  label: 'São Paulo Urban', intensity: 'medium', count: 5 },
  { id: 'TKY-SCENE', lat: 35.68, lng: 139.69,  label: 'Tokyo Pop', intensity: 'medium', count: 4 },
];

const GENRE_MOMENTUM = [
  { genre: 'Afrobeats', momentum: 94, delta: '+18%', color: '#F59E0B' },
  { genre: 'Alt-Pop',   momentum: 88, delta: '+22%', color: '#EF4444' },
  { genre: 'Latin Trap',momentum: 82, delta: '+31%', color: '#10B981' },
  { genre: 'Hyperpop',  momentum: 79, delta: '+14%', color: '#06B6D4' },
  { genre: 'R&B',       momentum: 74, delta: '+8%',  color: '#EC4899' },
  { genre: 'Indie Folk',momentum: 64, delta: '+5%',  color: '#A78BFA' },
  { genre: 'Amapiano',  momentum: 58, delta: '+40%', color: '#F59E0B' },
  { genre: 'Drill',     momentum: 52, delta: '-3%',  color: '#6B7280' },
];

function latLngToXY(lat: number, lng: number, W: number, H: number) {
  const x = ((lng + 180) / 360) * W;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = (H / 2) - (W * mercN) / (2 * Math.PI);
  return { x, y };
}

function MapView({ nodes, label }: { nodes: typeof MAP_NODES; label: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 800, H = 420;

  return (
    <div className="space-y-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl" style={{ background: 'linear-gradient(180deg, #0B0D14 0%, #080A0F 100%)' }}>
        {[...Array(14)].map((_, r) => (
          <line key={`h${r}`} x1={0} y1={(r/13)*H} x2={W} y2={(r/13)*H} stroke="rgba(255,255,255,0.025)" strokeWidth={0.5} />
        ))}
        {[...Array(24)].map((_, c) => (
          <line key={`v${c}`} x1={(c/23)*W} y1={0} x2={(c/23)*W} y2={H} stroke="rgba(255,255,255,0.025)" strokeWidth={0.5} />
        ))}
        {nodes.map(node => {
          const n = node as typeof nodes[0] & { count?: number };
          const { x, y } = latLngToXY(n.lat, n.lng, W, H);
          const color = n.intensity === 'critical' ? '#EF4444' : n.intensity === 'high' ? '#F59E0B' : '#06B6D4';
          const r = n.intensity === 'critical' ? 10 : n.intensity === 'high' ? 7 : 5;
          const isHov = hovered === n.id;
          return (
            <g key={n.id} onMouseEnter={() => setHovered(n.id)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
              <circle cx={x} cy={y} r={r * 3.5} fill={color} opacity={0.04} />
              <circle cx={x} cy={y} r={r * 2} fill={color} opacity={0.09} />
              <circle cx={x} cy={y} r={r} fill={color} opacity={isHov ? 1 : 0.75} style={{ filter: `drop-shadow(0 0 ${r + 3}px ${color})`, transition: 'opacity 0.15s' }} />
              {isHov && (
                <g>
                  <rect x={x + 10} y={y - 22} width={100} height={24} rx={4} fill="#0D0F15" stroke="rgba(255,255,255,0.09)" strokeWidth={0.5} />
                  <text x={x + 16} y={y - 6} fill="rgba(255,255,255,0.8)" fontSize="10" fontFamily="monospace">{n.label}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-5 flex-wrap">
        {[['#EF4444', 'Critical'], ['#F59E0B', 'High'], ['#06B6D4', 'Emerging']].map(([color, lbl]) => (
          <div key={lbl} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-[9px] font-mono text-white/25">{lbl}</span>
          </div>
        ))}
        <span className="ml-auto text-[9px] font-mono text-white/15">{nodes.length} nodes · {label}</span>
      </div>
    </div>
  );
}

export default function Heatmaps() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [timeRange, setTimeRange] = useState('30D');

  const isGenreMomentum = activeTab === 'Genre Momentum';

  function getNodes() {
    if (activeTab === 'Scene Heatmap') return SCENE_NODES as unknown as typeof MAP_NODES;
    return MAP_NODES;
  }

  return (
    <div className="min-h-full bg-[#07080A] p-5 space-y-5">

      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
            <Map className="w-5 h-5 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-white">Heatmaps</h1>
            <p className="text-[11px] text-white/25">Signal intensity visualization across artists, scenes, and markets</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {TIME_RANGES.map(t => (
            <button key={t} onClick={() => setTimeRange(t)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all ${timeRange === t ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'text-white/25 border border-white/[0.06] hover:text-white/50'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap border-b border-white/[0.06] pb-0">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-[12px] font-medium transition-all relative whitespace-nowrap ${
              activeTab === tab
                ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F59E0B] after:rounded-full'
                : 'text-white/30 hover:text-white/60'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
          <div className="w-[3px] h-4 rounded-full bg-[#F59E0B]" />
          <span className="text-[13px] font-semibold text-white/85">{activeTab}</span>
          <span className="text-[9px] font-mono text-white/15">// {timeRange} window</span>
          <div className="ml-auto flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-white/20" />
            <span className="text-[10px] font-mono text-white/20">Filter</span>
          </div>
        </div>

        <div className="p-5">
          {isGenreMomentum ? (
            <div className="space-y-3">
              {GENRE_MOMENTUM.map((g, i) => (
                <div key={g.genre} className="flex items-center gap-4">
                  <span className="text-[11px] font-mono text-white/25 w-4 shrink-0">{i + 1}</span>
                  <span className="text-[13px] text-white/70 w-32 shrink-0">{g.genre}</span>
                  <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${g.momentum}%`, background: g.color }} />
                  </div>
                  <span className="text-[12px] font-mono font-bold w-8 text-right shrink-0" style={{ color: g.color }}>{g.momentum}</span>
                  <span className={`text-[10px] font-mono w-12 text-right shrink-0 ${g.delta.startsWith('+') ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{g.delta}</span>
                </div>
              ))}
            </div>
          ) : (
            <MapView nodes={getNodes()} label={activeTab} />
          )}
        </div>
      </div>

      {!isGenreMomentum && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { label: 'Total Nodes',   value: getNodes().length.toString(), color: '#06B6D4' },
            { label: 'Critical',      value: getNodes().filter(n => n.intensity === 'critical').length.toString(), color: '#EF4444' },
            { label: 'High Activity', value: getNodes().filter(n => n.intensity === 'high').length.toString(),     color: '#F59E0B' },
            { label: 'Emerging',      value: getNodes().filter(n => n.intensity === 'medium').length.toString(),   color: '#10B981' },
          ].map(s => (
            <div key={s.label} className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl px-4 py-3">
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-[24px] font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
