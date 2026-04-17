import { useState, useEffect } from 'react';
import { Zap, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { AI_OPS_INSIGHTS } from '../../data/opsData';

export default function AIExecInsight() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(false);

  function go(next: number) {
    setFading(true);
    setTimeout(() => { setIdx(next); setFading(false); }, 250);
  }

  useEffect(() => {
    const t = setInterval(() => go((idx + 1) % AI_OPS_INSIGHTS.length), 15000);
    return () => clearInterval(t);
  }, [idx]);

  function refresh() {
    setLoading(true);
    setTimeout(() => { go((idx + 1) % AI_OPS_INSIGHTS.length); setLoading(false); }, 600);
  }

  return (
    <div className="relative bg-[#09090C] border border-[#06B6D4]/20 rounded-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/20 to-transparent" />

      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <span className="text-[11px] font-mono text-[#06B6D4] tracking-widest uppercase">AI Executive Insight</span>
          <span className="text-[9px] font-mono text-white/15 tracking-wider">// auto-generated · updated continuously</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => go((idx - 1 + AI_OPS_INSIGHTS.length) % AI_OPS_INSIGHTS.length)}
            className="p-1 rounded hover:bg-white/[0.04] transition-colors text-white/20 hover:text-white/50">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => go((idx + 1) % AI_OPS_INSIGHTS.length)}
            className="p-1 rounded hover:bg-white/[0.04] transition-colors text-white/20 hover:text-white/50">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={refresh} disabled={loading}
            className="p-1.5 rounded hover:bg-white/[0.04] transition-colors text-white/20 hover:text-white/50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className={`text-[14px] text-white/80 leading-relaxed transition-opacity duration-250 ${fading ? 'opacity-0' : 'opacity-100'}`}>
          {AI_OPS_INSIGHTS[idx]}
        </p>
      </div>

      <div className="flex items-center gap-2 px-5 pb-3">
        {AI_OPS_INSIGHTS.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`h-[2px] rounded-full transition-all ${i === idx ? 'w-6 bg-[#06B6D4]' : 'w-2 bg-white/10 hover:bg-white/20'}`} />
        ))}
        <span className="ml-auto text-[10px] font-mono text-white/15">{idx + 1} / {AI_OPS_INSIGHTS.length}</span>
      </div>
    </div>
  );
}
