import { useEffect, useRef, useState } from 'react';
import { Activity, Zap, TrendingUp, AlertTriangle, DollarSign, CheckCircle } from 'lucide-react';
import { mono, LiveDot } from './primitives';

interface FeedEntry {
  id: number;
  icon: React.ElementType;
  color: string;
  msg: string;
  time: string;
  type: 'execution' | 'signal' | 'funding' | 'alert' | 'complete';
}

const SEED_ENTRIES: Omit<FeedEntry, 'id'>[] = [
  { icon: Zap,           color: '#10B981', msg: 'Creator outreach batch deployed — Chicago market',    time: '2m ago',  type: 'execution' },
  { icon: TrendingUp,    color: '#10B981', msg: 'Mexico City engagement spike detected — +38%',        time: '5m ago',  type: 'signal'    },
  { icon: Activity,      color: '#06B6D4', msg: 'Ad set CTR improving — TikTok variant B at 3.2%',    time: '9m ago',  type: 'signal'    },
  { icon: DollarSign,    color: '#F59E0B', msg: 'Advance eligibility recalculated — $3,500 ready',    time: '14m ago', type: 'funding'   },
  { icon: CheckCircle,   color: '#10B981', msg: 'Spotify Countdown Page verified — live',             time: '18m ago', type: 'complete'  },
  { icon: AlertTriangle, color: '#EF4444', msg: 'Apple Music bio gap detected — AI draft queued',     time: '22m ago', type: 'alert'     },
  { icon: Zap,           color: '#FF0050', msg: 'TikTok sound page updated — 4,200 organic plays',    time: '28m ago', type: 'execution' },
  { icon: TrendingUp,    color: '#EC4899', msg: 'Nostalgia angle trending — 3 new creator placements', time: '35m ago', type: 'signal'    },
  { icon: DollarSign,    color: '#10B981', msg: 'ACH payout settled — $2,300 in Chase ••• 4821',      time: '1h ago',  type: 'funding'   },
  { icon: CheckCircle,   color: '#06B6D4', msg: 'YouTube Premiere scheduled — Apr 30 11AM ET',        time: '1h ago',  type: 'complete'  },
  { icon: Activity,      color: '#F59E0B', msg: 'Pre-save velocity tracking — 12,400 saves banked',   time: '2h ago',  type: 'signal'    },
  { icon: Zap,           color: '#10B981', msg: 'Instagram story cadence triggered — 3 posts queued', time: '2h ago',  type: 'execution' },
];

const APPEND_POOL = [
  { icon: Zap,           color: '#10B981', msg: 'Creator brief sent to Rio de Janeiro contacts',      type: 'execution' as const },
  { icon: TrendingUp,    color: '#06B6D4', msg: 'São Paulo playlist add detected — 8,200 listeners',  type: 'signal'    as const },
  { icon: DollarSign,    color: '#F59E0B', msg: 'Streaming payout projection updated — $4,800 est',   type: 'funding'   as const },
  { icon: Activity,      color: '#EC4899', msg: 'Fan cluster intelligence refresh complete',           type: 'signal'    as const },
  { icon: CheckCircle,   color: '#10B981', msg: 'Amazon Hype Card submitted to editorial team',       type: 'complete'  as const },
  { icon: AlertTriangle, color: '#EF4444', msg: 'Paid ads landing page still missing — priority gap', type: 'alert'     as const },
];

let globalId = SEED_ENTRIES.length + 1;

function timeStr() {
  return 'just now';
}

export function LiveSystemFeed() {
  const [entries, setEntries] = useState<FeedEntry[]>(
    SEED_ENTRIES.map((e, i) => ({ ...e, id: i + 1 }))
  );
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const poolIdx = useRef(0);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const item = APPEND_POOL[poolIdx.current % APPEND_POOL.length];
      poolIdx.current++;
      setEntries(prev => [{ ...item, id: globalId++, time: timeStr() }, ...prev.slice(0, 24)]);
    }, 5200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div style={{ background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <LiveDot color="#10B981" size={6} gap={3} />
          <span style={{ ...mono, fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>System Activity</span>
          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Live</span>
        </div>
        <button onClick={() => setPaused(v => !v)}
          style={{ ...mono, fontSize: 8, padding: '3px 10px', borderRadius: 7, cursor: 'pointer', background: paused ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${paused ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`, color: paused ? '#EF4444' : 'rgba(255,255,255,0.3)' }}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Feed list */}
      <div ref={containerRef} style={{ maxHeight: 260, overflowY: 'auto', padding: '8px 0' }}>
        {entries.map((entry, i) => {
          const Icon = entry.icon;
          return (
            <div key={entry.id}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', borderBottom: '1px solid rgba(255,255,255,0.025)', background: i === 0 ? `${entry.color}06` : 'transparent', transition: 'background 0.4s', animation: i === 0 ? 'cos-slide 0.3s ease' : 'none' }}>
              <div style={{ width: 22, height: 22, borderRadius: 7, background: `${entry.color}12`, border: `1px solid ${entry.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={9} color={entry.color} />
              </div>
              <span style={{ fontSize: 10, color: i === 0 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)', flex: 1, lineHeight: 1.4 }}>{entry.msg}</span>
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.15)', flexShrink: 0 }}>{entry.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
