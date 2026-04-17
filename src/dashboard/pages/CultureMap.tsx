import { useState } from 'react';
import { Zap, TrendingUp, Users } from 'lucide-react';

const CLUSTER_NODES = [
  { id: 'N1', x: 120, y: 100, r: 32, color: '#EF4444', label: 'Alt-Pop',    sub: 'LA / Global',    momentum: 94, connections: ['N2', 'N4'],      overlap: 'Hyperpop (42%), R&B (28%)' },
  { id: 'N2', x: 300, y: 70,  r: 26, color: '#F59E0B', label: 'Afrobeats',  sub: 'ATL / Lagos',    momentum: 89, connections: ['N1', 'N5'],      overlap: 'R&B (38%), Latin (22%)' },
  { id: 'N3', x: 500, y: 90,  r: 28, color: '#06B6D4', label: 'Hyperpop',   sub: 'Berlin / EU',    momentum: 85, connections: ['N1', 'N6'],      overlap: 'Electronic (55%), Alt-Pop (30%)' },
  { id: 'N4', x: 100, y: 270, r: 20, color: '#10B981', label: 'Indie Folk', sub: 'Nashville',      momentum: 64, connections: ['N1', 'N5'],      overlap: 'Alt-Country (60%), Pop (18%)' },
  { id: 'N5', x: 280, y: 290, r: 24, color: '#EC4899', label: 'R&B',        sub: 'London / UK',    momentum: 74, connections: ['N2', 'N4', 'N6'], overlap: 'Afrobeats (38%), Pop (24%)' },
  { id: 'N6', x: 470, y: 270, r: 26, color: '#F59E0B', label: 'Latin',      sub: 'Miami / MX',     momentum: 82, connections: ['N3', 'N5'],      overlap: 'Urban (44%), Pop (32%)' },
  { id: 'N7', x: 390, y: 175, r: 16, color: '#A78BFA', label: 'Drill',      sub: 'UK / Chicago',   momentum: 52, connections: ['N5'],             overlap: 'Hip-Hop (70%), R&B (18%)' },
  { id: 'N8', x: 185, y: 175, r: 18, color: '#6B7280', label: 'Amapiano',   sub: 'SA / Diaspora',  momentum: 58, connections: ['N2'],             overlap: 'Afrobeats (55%), Dance (28%)' },
];

const MOVEMENT_ZONES = [
  { x: 160, y: 50, w: 200, h: 120, label: 'Pop Crossover Zone', color: '#EF4444' },
  { x: 320, y: 210, w: 200, h: 110, label: 'Urban Fusion Zone', color: '#F59E0B' },
];

const MOMENTUM_LIST = [
  { label: 'Alt-Pop → Afrobeats crossover', delta: '+22%', color: '#EF4444' },
  { label: 'Latin → R&B audience overlap',  delta: '+18%', color: '#F59E0B' },
  { label: 'Hyperpop → mainstream pop',     delta: '+14%', color: '#06B6D4' },
  { label: 'Afrobeats global expansion',    delta: '+31%', color: '#F59E0B' },
  { label: 'Indie Folk sync licensing',     delta: '+8%',  color: '#10B981' },
];

const GENRE_FILTERS = ['All', 'Alt-Pop', 'Afrobeats', 'Hyperpop', 'R&B', 'Latin'];
const VIEW_FILTERS = ['All', 'Emerging Only', 'Cross-Market', 'High-Momentum'];

export default function CultureMap() {
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeView, setActiveView] = useState('All');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const filteredNodes = CLUSTER_NODES.filter(n => {
    if (activeGenre !== 'All' && n.label !== activeGenre) return false;
    if (activeView === 'High-Momentum' && n.momentum < 75) return false;
    if (activeView === 'Emerging Only' && n.momentum >= 75) return false;
    return true;
  });

  const activeNode = hoveredNode ? CLUSTER_NODES.find(n => n.id === hoveredNode) : null;

  return (
    <div className="min-h-full bg-[#07080A] p-5 space-y-5">

      <div className="flex items-start gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-[#06B6D4]" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-white">Culture Map</h1>
            <p className="text-[11px] text-white/25">Scene relationships, genre crossover, and audience movement intelligence</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {VIEW_FILTERS.map(f => (
            <button key={f} onClick={() => setActiveView(f)}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all ${activeView === f ? 'bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20' : 'text-white/25 border border-white/[0.06] hover:text-white/50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {GENRE_FILTERS.map(g => (
          <button key={g} onClick={() => setActiveGenre(g)}
            className={`px-3 py-1 text-[10px] font-mono rounded-lg transition-all ${activeGenre === g ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/25 hover:text-white/50'}`}>
            {g}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

        <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
            <div className="w-[3px] h-4 rounded-full bg-[#06B6D4]" />
            <span className="text-[13px] font-semibold text-white/85">Genre Cluster Graph</span>
            <span className="text-[9px] font-mono text-white/15">// {filteredNodes.length} clusters active</span>
          </div>
          <div className="p-4">
            <svg viewBox="0 0 620 380" className="w-full" style={{ background: 'linear-gradient(180deg, #0B0D14 0%, #080A0F 100%)', borderRadius: '8px' }}>
              {MOVEMENT_ZONES.map(z => (
                <g key={z.label}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={8} fill={z.color} opacity={0.03} stroke={z.color} strokeWidth={0.5} strokeOpacity={0.12} strokeDasharray="4,6" />
                  <text x={z.x + z.w / 2} y={z.y + 14} textAnchor="middle" fill={z.color} fontSize="8" fontFamily="monospace" opacity={0.4}>{z.label}</text>
                </g>
              ))}

              {CLUSTER_NODES.flatMap(node =>
                node.connections
                  .filter(cid => {
                    const target = CLUSTER_NODES.find(n => n.id === cid);
                    return target && filteredNodes.includes(node) && filteredNodes.includes(target);
                  })
                  .map(cid => {
                    const target = CLUSTER_NODES.find(n => n.id === cid)!;
                    const isActive = hoveredNode === node.id || hoveredNode === cid;
                    return (
                      <line
                        key={`${node.id}-${cid}`}
                        x1={node.x} y1={node.y} x2={target.x} y2={target.y}
                        stroke={isActive ? node.color : 'rgba(255,255,255,0.05)'}
                        strokeWidth={isActive ? 1.5 : 0.8}
                        strokeDasharray={isActive ? 'none' : '3,5'}
                        opacity={isActive ? 0.6 : 1}
                        style={{ transition: 'all 0.2s' }}
                      />
                    );
                  })
              )}

              {CLUSTER_NODES.filter(n => filteredNodes.includes(n)).map(node => {
                const isHov = hoveredNode === node.id;
                const dimmed = hoveredNode && !isHov;
                return (
                  <g key={node.id} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{ cursor: 'pointer' }}>
                    <circle cx={node.x} cy={node.y} r={node.r + 12} fill={node.color} opacity={isHov ? 0.1 : 0.04} style={{ transition: 'opacity 0.2s' }} />
                    <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} opacity={dimmed ? 0.08 : 0.2} style={{ filter: isHov ? `drop-shadow(0 0 10px ${node.color})` : 'none', transition: 'all 0.2s' }} />
                    <circle cx={node.x} cy={node.y} r={4} fill={node.color} opacity={dimmed ? 0.3 : 0.9} style={{ transition: 'opacity 0.2s' }} />
                    <text x={node.x} y={node.y + node.r + 14} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="9" fontFamily="monospace" opacity={dimmed ? 0.3 : 1} style={{ transition: 'opacity 0.2s' }}>{node.label}</text>
                    <text x={node.x} y={node.y + node.r + 24} textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="7" fontFamily="monospace" opacity={dimmed ? 0.2 : 1} style={{ transition: 'opacity 0.2s' }}>{node.sub}</text>
                  </g>
                );
              })}
            </svg>

            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="text-[9px] font-mono text-white/15">Hover nodes to explore connections</span>
              <div className="flex items-center gap-4 ml-auto flex-wrap">
                {[['#EF4444', 'High Momentum'], ['#F59E0B', 'Rising'], ['#06B6D4', 'Stable']].map(([color, lbl]) => (
                  <div key={lbl} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                    <span className="text-[9px] font-mono text-white/20">{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">

          {activeNode ? (
            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-white/[0.06]" style={{ borderLeftWidth: 3, borderLeftColor: activeNode.color }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: activeNode.color, boxShadow: `0 0 8px ${activeNode.color}` }} />
                  <span className="text-[14px] font-bold text-white">{activeNode.label}</span>
                  <span className="ml-auto text-[10px] font-mono" style={{ color: activeNode.color }}>{activeNode.momentum} score</span>
                </div>
                <p className="text-[11px] text-white/30 mt-0.5 ml-4">{activeNode.sub}</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Audience Overlap</p>
                  <p className="text-[12px] text-white/50">{activeNode.overlap}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1.5">Connections</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeNode.connections.map(cid => {
                      const n = CLUSTER_NODES.find(x => x.id === cid);
                      return n ? (
                        <span key={cid} className="text-[9px] font-mono px-2 py-0.5 rounded" style={{ background: `${n.color}15`, color: n.color, border: `1px solid ${n.color}25` }}>{n.label}</span>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" style={{ color: activeNode.color }} />
                  <span className="text-[11px] text-white/50">Momentum score: <span className="font-bold" style={{ color: activeNode.color }}>{activeNode.momentum}/100</span></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl p-5 text-center">
              <div className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-2">
                <Zap className="w-4 h-4 text-white/20" />
              </div>
              <p className="text-[12px] text-white/25">Hover a cluster node to explore its connections and audience data</p>
            </div>
          )}

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
              <div className="w-[3px] h-4 rounded-full bg-[#F59E0B]" />
              <span className="text-[13px] font-semibold text-white/85">Momentum Rankings</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {[...CLUSTER_NODES].sort((a, b) => b.momentum - a.momentum).map((n, i) => (
                <div key={n.id} className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/[0.01] transition-colors">
                  <span className="text-[10px] font-mono text-white/20 w-4">{i + 1}</span>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />
                  <span className="text-[12px] text-white/60 flex-1">{n.label}</span>
                  <div className="w-16 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${n.momentum}%`, background: n.color }} />
                  </div>
                  <span className="text-[11px] font-mono w-6 text-right" style={{ color: n.color }}>{n.momentum}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-[#08090C]">
              <div className="w-[3px] h-4 rounded-full bg-[#10B981]" />
              <span className="text-[13px] font-semibold text-white/85">Movement Signals</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {MOMENTUM_LIST.map(m => (
                <div key={m.label} className="flex items-center gap-3 px-5 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
                  <span className="text-[11px] text-white/50 flex-1 leading-snug">{m.label}</span>
                  <span className="text-[11px] font-mono text-[#10B981] shrink-0">{m.delta}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
