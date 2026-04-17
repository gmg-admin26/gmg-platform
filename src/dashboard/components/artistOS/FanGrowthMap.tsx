import { Globe, TrendingUp } from 'lucide-react';
import { GEO_CITIES } from '../../data/artistOSData';

export default function FanGrowthMap() {
  const maxStreams = Math.max(...GEO_CITIES.map(c => c.streams));

  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Globe className="w-4 h-4 text-[#10B981]" />
        <span className="text-[13px] font-semibold text-white/80">Fan Growth Map</span>
        <span className="ml-auto text-[9px] font-mono text-white/20">Last 28 days</span>
      </div>

      {/* Abstract world map visual */}
      <div className="relative h-44 bg-[#09090C] overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          {[...Array(8)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`}
              stroke="white" strokeWidth="0.5" />
          ))}
          {[...Array(12)].map((_, i) => (
            <line key={`v${i}`} x1={`${(i + 1) * 8.33}%`} y1="0" x2={`${(i + 1) * 8.33}%`} y2="100%"
              stroke="white" strokeWidth="0.5" />
          ))}
          {/* Simplified continent outlines */}
          <ellipse cx="22%" cy="38%" rx="11%" ry="18%" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <ellipse cx="33%" cy="65%" rx="6%" ry="10%" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <ellipse cx="50%" cy="35%" rx="16%" ry="16%" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <ellipse cx="73%" cy="40%" rx="10%" ry="12%" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <ellipse cx="79%" cy="60%" rx="6%" ry="8%" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        </svg>

        {/* City dots */}
        {GEO_CITIES.map(city => {
          const scale = 0.35 + (city.streams / maxStreams) * 0.65;
          const isHot = city.delta.startsWith('+') && parseInt(city.delta) > 50;
          return (
            <div
              key={city.city}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
            >
              {isHot && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{
                    width: `${14 * scale}px`,
                    height: `${14 * scale}px`,
                    transform: 'translate(-50%, -50%) translate(50%, 50%)',
                    background: '#EF4444',
                  }}
                />
              )}
              <div
                className="rounded-full border-2 transition-all group-hover:scale-125"
                style={{
                  width: `${10 * scale}px`,
                  height: `${10 * scale}px`,
                  background: isHot ? '#EF4444' : '#06B6D4',
                  borderColor: isHot ? 'rgba(239,68,68,0.5)' : 'rgba(6,182,212,0.5)',
                  boxShadow: isHot
                    ? '0 0 8px rgba(239,68,68,0.6)'
                    : '0 0 8px rgba(6,182,212,0.4)',
                }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                <div className="bg-[#161820] border border-white/[0.1] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                  <p className="text-[11px] font-medium text-white">{city.city}</p>
                  <p className="text-[10px] font-mono text-[#10B981]">{city.delta}</p>
                  <p className="text-[10px] text-white/30">{(city.streams / 1000).toFixed(0)}K streams</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* City list */}
      <div className="p-4">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2.5">Hot Cities</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          {GEO_CITIES.map(city => (
            <div key={city.city} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/20 w-4 text-right shrink-0">{city.rank}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-white/65 truncate">{city.city}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <TrendingUp className="w-2.5 h-2.5 text-[#10B981]" />
                    <span className={`text-[10px] font-mono ${
                      parseInt(city.delta) > 100 ? 'text-[#EF4444]' :
                      parseInt(city.delta) > 30 ? 'text-[#F59E0B]' : 'text-[#10B981]'
                    }`}>{city.delta}</span>
                  </div>
                </div>
                <div className="h-0.5 bg-white/[0.04] rounded-full mt-0.5 overflow-hidden">
                  <div className="h-full bg-[#06B6D4] rounded-full"
                    style={{ width: `${(city.streams / maxStreams) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
