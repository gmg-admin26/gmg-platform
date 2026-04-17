import { useState, useEffect, useRef } from 'react';
import {
  Zap, AlertTriangle, TrendingUp, AlertCircle,
  DollarSign, Disc, Activity, ChevronDown, ChevronUp, CheckCircle2,
} from 'lucide-react';

export type FeedEventType = 'execution' | 'alert' | 'win' | 'risk' | 'financial' | 'release' | 'outcome';

export interface FeedEvent {
  id: string;
  type: FeedEventType;
  text: string;
  ts: number;
  source?: string;
}

const TYPE_META: Record<FeedEventType, { color: string; bg: string; border: string; icon: React.ElementType; label: string }> = {
  execution: { color: '#06B6D4', bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.18)',   icon: Zap,           label: 'EXEC'    },
  alert:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.18)',  icon: AlertTriangle, label: 'ALERT'   },
  win:       { color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.18)',  icon: TrendingUp,    label: 'WIN'     },
  risk:      { color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.18)',   icon: AlertCircle,   label: 'RISK'    },
  financial: { color: '#A78BFA', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.18)', icon: DollarSign,    label: 'FIN'     },
  release:   { color: '#EC4899', bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.18)',  icon: Disc,          label: 'RELEASE' },
  outcome:   { color: '#10B981', bg: 'rgba(16,185,129,0.06)',  border: 'rgba(16,185,129,0.2)',   icon: CheckCircle2,  label: 'RESULT'  },
};

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 15) return 'just now';
  if (diff < 90) return `${diff}s ago`;
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

const BASE_FEED: Omit<FeedEvent, 'id' | 'ts'>[] = [
  { type: 'execution', text: 'Autopilot reallocated $300 to Brazil segment · São Paulo velocity +340% triggered threshold', source: 'Autopilot Engine' },
  { type: 'execution', text: 'Assisted mode drafted 3 creator briefs for review · awaiting approval before send',           source: 'Autopilot Engine' },
  { type: 'execution', text: 'AI queued editorial metadata fix request · incorrect genre tag detected on ZEAL Vol. 1',      source: 'AI Quality Agent' },
  { type: 'outcome',   text: 'Brazil geo-targeting returned +31.4% streams vs +18% forecast · +13.4% beat', source: 'Outcome Layer'   },
  { type: 'outcome',   text: 'Creator brief execution: 14 posts · 1.3M reach vs 900K forecast · +44% beat', source: 'Outcome Layer'   },
  { type: 'outcome',   text: 'Ad variant switch: CTR recovered to 2.4% vs 1.8% floor · Chorus-first won',   source: 'Outcome Layer'   },
  { type: 'outcome',   text: 'Pre-save push: +8.7K pre-saves vs +11.2K forecast · -22% miss · core segment strong', source: 'Outcome Layer' },
  { type: 'outcome',   text: 'Re-engagement blast: +11.3% fan reactivation · 620 streamed within 48h',      source: 'Outcome Layer'   },
  { type: 'execution', text: 'Creator brief sent to Rio de Janeiro contacts',          source: 'Campaign Engine' },
  { type: 'win',       text: 'TikTok variant CTR improved to 3.2%',                   source: 'Ad Monitor'      },
  { type: 'financial', text: 'Advance eligibility recalculated — $4,200 available',   source: 'Finance OS'      },
  { type: 'release',   text: 'Spotify countdown page verified and live',               source: 'Release Ops'     },
  { type: 'win',       text: 'Mexico City engagement spike detected +38%',             source: 'Audience Intel'  },
  { type: 'alert',     text: 'Release metadata issue flagged for review',              source: 'QA Agent'        },
  { type: 'win',       text: 'Pre-save velocity 2.4× above baseline',                 source: 'Signal Monitor'  },
  { type: 'financial', text: 'Budget reallocated to outperforming market — Brazil',    source: 'Finance OS'      },
  { type: 'execution', text: 'Apple Music editorial pitch submitted',                  source: 'Campaign Engine' },
  { type: 'risk',      text: 'EU playlist campaign CTR below threshold — 0.6%',       source: 'Ad Monitor'      },
  { type: 'win',       text: 'Playlist add — 22K reach via indie pop editorial',       source: 'Rocksteady'      },
  { type: 'execution', text: 'Paid media campaign scaled — LA + NYC markets',         source: 'Campaign Engine' },
  { type: 'release',   text: 'DSP delivery confirmed — 6 of 7 stores',                source: 'Release Ops'     },
  { type: 'alert',     text: 'Streaming velocity slowdown detected — Week 3',         source: 'Signal Monitor'  },
  { type: 'win',       text: 'Fan engagement up 19% post-content drop',               source: 'Audience Intel'  },
  { type: 'financial', text: 'Q2 recoupable spend reconciled — $12.4K',               source: 'Finance OS'      },
  { type: 'execution', text: 'TikTok creator seed pack activated — 42 creators',      source: 'Campaign Engine' },
  { type: 'risk',      text: 'Artwork variant missing for Japan store',                source: 'QA Agent'        },
  { type: 'win',       text: 'Germany radio add confirmed — national rotation',       source: 'Rocksteady'      },
  { type: 'release',   text: 'ISRC codes generated and filed',                        source: 'Release Ops'     },
  { type: 'execution', text: 'Fan segment re-scored after tour announcement',          source: 'Audience Intel'  },
  { type: 'financial', text: 'Royalty statement processed — $3,180 pending payout',   source: 'Finance OS'      },
  { type: 'alert',     text: 'YouTube Content ID conflict detected on B-side',        source: 'Rights Monitor'  },
  { type: 'win',       text: 'Spotify Save rate 18.4% — above category average',     source: 'Signal Monitor'  },
  { type: 'execution', text: 'Weekly artist report generated and dispatched',          source: 'Ops Engine'      },
  { type: 'execution', text: 'Autopilot scaled Meta spend +$150 · ROAS threshold exceeded in LA market',     source: 'Autopilot Engine' },
  { type: 'execution', text: 'AI drafted playlist pitch for Sad Lullabies — 3 targets queued for approval', source: 'Autopilot Engine' },
  { type: 'execution', text: 'Autopilot paused EU campaign · CPM spike detected — budget preserved',         source: 'Autopilot Engine' },
  { type: 'execution', text: 'AI re-scored fan segments after streaming spike · Brazil tier 1 expanded',     source: 'AI Quality Agent' },
  { type: 'execution', text: 'Assisted mode queued TikTok sound push — 6 creators matched · pending review', source: 'Autopilot Engine' },
];

function buildInitialFeed(): FeedEvent[] {
  const now = Date.now();
  return BASE_FEED.slice(0, 12).map((e, i) => ({
    ...e,
    id: `init-${i}`,
    ts: now - (i * 95 + Math.random() * 60) * 1000,
  }));
}

const ROTATION_POOL = BASE_FEED.slice(12);

export interface LiveSystemFeedProps {
  variant?: 'rail' | 'strip' | 'panel';
  maxVisible?: number;
  title?: string;
}

export default function LiveSystemFeed({
  variant = 'panel',
  maxVisible = 6,
  title = 'Live System Feed',
}: LiveSystemFeedProps) {
  const [events, setEvents] = useState<FeedEvent[]>(buildInitialFeed);
  const [tick, setTick] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);
  const poolIdx = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const interval = 4200 + Math.random() * 2800;
    const t = setTimeout(() => {
      const next = ROTATION_POOL[poolIdx.current % ROTATION_POOL.length];
      poolIdx.current++;
      const entry: FeedEvent = { ...next, id: `live-${Date.now()}`, ts: Date.now() };
      setNewId(entry.id);
      setEvents(prev => [entry, ...prev].slice(0, 40));
      setTimeout(() => setNewId(null), 600);
    }, interval);
    return () => clearTimeout(t);
  }, [events]);

  const visible = expanded ? events.slice(0, 20) : events.slice(0, maxVisible);

  if (variant === 'strip') {
    return <FeedStrip events={events} tick={tick} newId={newId} />;
  }

  if (variant === 'rail') {
    return <FeedRail events={visible} tick={tick} newId={newId} title={title} />;
  }

  return (
    <div style={{
      background: '#0A0B0E',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes lsf-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsf-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        @keyframes lsf-scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(500%)} }
        .lsf-new { animation: lsf-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .lsf-dot { animation: lsf-dot-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(6,182,212,0.4),rgba(16,185,129,0.3),transparent)', overflow: 'hidden' }}>
        <div className="lsf-scan" style={{ position: 'absolute', top: 0, bottom: 0, width: '20%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className="lsf-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B98170', flexShrink: 0 }} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {title}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 4, background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)', color: '#06B6D4' }}>LIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={10} color="rgba(255,255,255,0.15)" />
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{expanded ? 'Collapse' : 'See all'}</span>
            {expanded
              ? <ChevronUp size={9} color="rgba(255,255,255,0.2)" />
              : <ChevronDown size={9} color="rgba(255,255,255,0.2)" />
            }
          </button>
        </div>
      </div>

      <div style={{ padding: '4px 0' }}>
        {visible.map((ev, i) => (
          <FeedRow key={ev.id} event={ev} tick={tick} isNew={ev.id === newId} isFirst={i === 0} />
        ))}
      </div>

      <div style={{ padding: '6px 14px 8px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.12)' }}>
          {events.length} events logged
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['outcome', 'execution', 'win', 'alert', 'risk'] as FeedEventType[]).map(t => {
            const m = TYPE_META[t];
            const count = events.filter(e => e.type === t).length;
            return (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: m.color }} />
                <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FeedRow({ event, tick, isNew, isFirst }: { event: FeedEvent; tick: number; isNew: boolean; isFirst: boolean }) {
  const m = TYPE_META[event.type];
  const Icon = m.icon;
  const age = relativeTime(event.ts);

  return (
    <div
      className={isNew ? 'lsf-new' : ''}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 9, padding: '7px 14px',
        borderLeft: `2px solid ${isFirst ? m.color : 'transparent'}`,
        background: isFirst ? `${m.color}05` : 'transparent',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.bg, border: `1px solid ${m.border}`, marginTop: 1 }}>
        <Icon size={9} color={m.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 1, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 800, color: m.color, letterSpacing: '0.08em' }}>
            {m.label}
          </span>
          {event.source && (
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)' }}>
              {event.source}
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: 10, color: isFirst ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)', lineHeight: 1.4, fontWeight: isFirst ? 500 : 400 }}>
          {event.text}
        </p>
      </div>
      <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)', flexShrink: 0, marginTop: 2, whiteSpace: 'nowrap' }}>
        {age}
      </span>
    </div>
  );
}

function FeedStrip({ events, tick, newId }: { events: FeedEvent[]; tick: number; newId: string | null }) {
  const [visibleIdx, setVisibleIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setVisibleIdx(i => (i + 1) % Math.min(events.length, 10));
        setFading(false);
      }, 300);
    }, 3800);
    return () => clearInterval(t);
  }, [events.length]);

  const ev = events[visibleIdx];
  if (!ev) return null;
  const m = TYPE_META[ev.type];
  const Icon = m.icon;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 9,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <style>{`
        @keyframes lsf-strip-fade-in  { from{opacity:0;transform:translateX(6px)} to{opacity:1;transform:translateX(0)} }
        @keyframes lsf-strip-fade-out { from{opacity:1} to{opacity:0} }
        .lsf-strip-in  { animation: lsf-strip-fade-in  0.3s ease both; }
        .lsf-strip-out { animation: lsf-strip-fade-out 0.3s ease both; }
      `}</style>

      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B98160', flexShrink: 0, animation: 'lsf-dot-pulse 1.8s ease-in-out infinite' }} />

      <div style={{ width: 18, height: 18, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.bg, border: `1px solid ${m.border}`, flexShrink: 0 }}>
        <Icon size={8} color={m.color} />
      </div>

      <div className={fading ? 'lsf-strip-out' : 'lsf-strip-in'} style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
          {ev.text}
        </span>
      </div>

      <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
        {relativeTime(ev.ts)}
      </span>

      <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
        {Array.from({ length: Math.min(events.length, 5) }).map((_, i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: i === visibleIdx % 5 ? m.color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
        ))}
      </div>
    </div>
  );
}

function FeedRail({ events, tick, newId, title }: { events: FeedEvent[]; tick: number; newId: string | null; title: string }) {
  return (
    <div style={{
      background: '#0A0B0E',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      overflow: 'hidden',
      minWidth: 220,
    }}>
      <style>{`
        @keyframes lsf-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lsf-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        .lsf-new { animation: lsf-slide-in 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .lsf-dot { animation: lsf-dot-pulse 1.8s ease-in-out infinite; }
      `}</style>

      <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="lsf-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B98170' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{title}</span>
      </div>

      <div>
        {events.map((ev, i) => (
          <div
            key={ev.id}
            className={ev.id === newId ? 'lsf-new' : ''}
            style={{ padding: '7px 12px', borderBottom: i < events.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', display: 'flex', gap: 7, alignItems: 'flex-start' }}
          >
            {(() => {
              const m = TYPE_META[ev.type];
              const Icon = m.icon;
              return (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', background: m.bg, border: `1px solid ${m.border}`, flexShrink: 0, marginTop: 1 }}>
                    <Icon size={8} color={m.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 9, color: i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)', lineHeight: 1.4, fontWeight: i === 0 ? 500 : 400 }}>{ev.text}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.15)' }}>{relativeTime(ev.ts)}</span>
                  </div>
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
