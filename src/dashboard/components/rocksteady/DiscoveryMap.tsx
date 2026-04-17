import { useState } from 'react';
import { Globe, Zap } from 'lucide-react';
import { MAP_NODES } from '../../data/rocksteadyData';

const INTENSITY = {
  critical: { pulse: 'bg-[#EF4444]', ring: 'rgba(239,68,68,0.3)', size: 14, glow: '0 0 12px rgba(239,68,68,0.6)' },
  high:     { pulse: 'bg-[#F59E0B]', ring: 'rgba(245,158,11,0.25)', size: 11, glow: '0 0 10px rgba(245,158,11,0.5)' },
  medium:   { pulse: 'bg-[#06B6D4]', ring: 'rgba(6,182,212,0.2)',  size: 8,  glow: '0 0 8px rgba(6,182,212,0.4)' },
};

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  const x = ((lng + 180) / 360) * w;
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = (h / 2) - (w * mercN) / (2 * Math.PI);
  return { x, y };
}

export default function DiscoveryMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const W = 800, H = 400;

  return (
    <div className="bg-[#0A0C0F] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Globe className="w-4 h-4 text-[#06B6D4]" />
        <span className="text-[13px] font-semibold text-white/80">Discovery Map</span>
        <span className="text-[9px] font-mono text-white/15 tracking-widest ml-1">// GLOBAL SIGNALS</span>
        <div className="ml-auto flex items-center gap-3">
          {(['critical', 'high', 'medium'] as const).map(k => {
            const cfg = INTENSITY[k];
            return (
              <div key={k} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: cfg.pulse.replace('bg-', '') === 'bg-[#EF4444]' ? '#EF4444' : cfg.pulse === 'bg-[#F59E0B]' ? '#F59E0B' : '#06B6D4', boxShadow: cfg.glow }} />
                <span className="text-[9px] font-mono text-white/25">{k}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative w-full" style={{ paddingBottom: '50%' }}>
        <div className="absolute inset-0">
          {/* SVG world map outline (simplified grid) */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          >
            {/* Grid lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`lat-${i}`} x1={0} y1={(i + 1) * H / 10} x2={W} y2={(i + 1) * H / 10} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
            ))}
            {Array.from({ length: 17 }).map((_, i) => (
              <line key={`lng-${i}`} x1={(i + 1) * W / 18} y1={0} x2={(i + 1) * W / 18} y2={H} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
            ))}
            {/* Equator */}
            <line x1={0} y1={H * 0.49} x2={W} y2={H * 0.49} stroke="rgba(255,255,255,0.07)" strokeWidth={1} strokeDasharray="4 8" />

            {/* Connection lines between critical cities */}
            {MAP_NODES.filter(n => n.intensity === 'critical').map((from, i) => {
              const pFrom = latLngToXY(from.lat, from.lng, W, H);
              return MAP_NODES.filter(n => n.intensity === 'critical' && n.id !== from.id).map((to, j) => {
                if (i >= j) return null;
                const pTo = latLngToXY(to.lat, to.lng, W, H);
                return (
                  <line
                    key={`${from.id}-${to.id}`}
                    x1={pFrom.x} y1={pFrom.y} x2={pTo.x} y2={pTo.y}
                    stroke="rgba(239,68,68,0.08)" strokeWidth={1} strokeDasharray="3 6"
                  />
                );
              });
            })}

            {/* Nodes */}
            {MAP_NODES.map(node => {
              const cfg = INTENSITY[node.intensity as keyof typeof INTENSITY];
              const { x, y } = latLngToXY(node.lat, node.lng, W, H);
              const isHov = hovered === node.id;
              const r = cfg.size / 2;
              const color = cfg.pulse === 'bg-[#EF4444]' ? '#EF4444' : cfg.pulse === 'bg-[#F59E0B]' ? '#F59E0B' : '#06B6D4';

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer ring */}
                  <circle cx={x} cy={y} r={r * 3.5} fill={cfg.ring} opacity={isHov ? 0.8 : 0.4} />
                  {/* Pulse ring */}
                  <circle cx={x} cy={y} r={r * 2} fill="none" stroke={color} strokeWidth={0.5} opacity={0.4} />
                  {/* Core dot */}
                  <circle cx={x} cy={y} r={r} fill={color} style={{ filter: `drop-shadow(${cfg.glow})` }} />

                  {/* Tooltip on hover */}
                  {isHov && (
                    <foreignObject x={x - 70} y={y - 70} width={140} height={60}>
                      <div className="bg-[#0D0F12] border border-white/[0.1] rounded-lg p-2 pointer-events-none">
                        <p className="text-[11px] font-semibold text-white">{node.label}</p>
                        <p className="text-[10px] font-mono text-white/35">{node.artistCount} artists detected</p>
                        {node.artists.length > 0 && (
                          <p className="text-[9px] text-white/25 mt-0.5">{node.artists.join(', ')}</p>
                        )}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom city strip */}
      <div className="px-5 py-3 border-t border-white/[0.05] flex gap-4 overflow-x-auto">
        {MAP_NODES.filter(n => n.intensity !== 'medium').map(n => {
          const color = n.intensity === 'critical' ? '#EF4444' : '#F59E0B';
          return (
            <div key={n.id} className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px] font-mono text-white/30">{n.label}</span>
              <span className="text-[10px] font-mono" style={{ color }}>{n.artistCount}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-1.5 shrink-0">
          <Zap className="w-3 h-3 text-[#10B981]" />
          <span className="text-[10px] font-mono text-[#10B981]">
            {MAP_NODES.reduce((a, n) => a + n.artistCount, 0)} active signals
          </span>
        </div>
      </div>
    </div>
  );
}
