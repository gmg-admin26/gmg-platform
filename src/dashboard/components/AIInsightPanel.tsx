import { useState, useEffect } from 'react';
import { Zap, RefreshCw } from 'lucide-react';

const INSIGHTS = [
  "Streaming velocity across the active roster is up 18.4% in the last 24 hours. ZEAL and Nova Blaze account for 71% of that momentum. Recommend accelerating Campaign C-0038 spend allocation by 15% through May 15.",
  "Rocksteady has flagged KAEZO as a Priority-1 emerging signal. TikTok viral coefficient has exceeded threshold (score: 94). Recommend immediate outreach within 48h before competitive window closes.",
  "Catalog asset utilization shows 3 of 5 flagship LPs have active sync placements. ZEAL Vol. 1 has 9 placements — highest in portfolio. Q2 sync revenue is tracking 22% ahead of plan.",
  "Campaign C-0041 CTR has dropped to 0.8% — below the 1.2% floor. Creative fatigue is the likely driver (Day 18). Recommend creative rotation and audience expansion to 25–34 demo.",
  "Drift Current remains blocked on distribution at Day 12. No artist manager response logged. Escalation required to prevent revenue loss — estimated $2.8K/week at current trajectory.",
];

export default function AIInsightPanel() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [loading, setLoading] = useState(false);

  function rotate(newIdx: number) {
    setFading(true);
    setTimeout(() => {
      setIdx(newIdx);
      setFading(false);
    }, 300);
  }

  useEffect(() => {
    const t = setInterval(() => {
      rotate((idx + 1) % INSIGHTS.length);
    }, 12000);
    return () => clearInterval(t);
  }, [idx]);

  function refresh() {
    setLoading(true);
    setTimeout(() => {
      rotate((idx + 1) % INSIGHTS.length);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="bg-[#0D0E11] border border-[#06B6D4]/20 rounded-lg p-5 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#06B6D4]/40 to-transparent" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
          </div>
          <span className="text-[11px] font-mono text-[#06B6D4] tracking-widest uppercase">AI Insight</span>
          <span className="text-[9px] font-mono text-white/20 tracking-wider">// generated</span>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="p-1.5 rounded hover:bg-white/[0.04] transition-colors text-white/30 hover:text-white/60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p
        className={`text-[13px] text-white/70 leading-relaxed transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        {INSIGHTS[idx]}
      </p>

      <div className="flex items-center gap-1.5 mt-4">
        {INSIGHTS.map((_, i) => (
          <button
            key={i}
            onClick={() => rotate(i)}
            className={`h-[2px] rounded-full transition-all ${
              i === idx ? 'w-6 bg-[#06B6D4]' : 'w-2 bg-white/10 hover:bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
