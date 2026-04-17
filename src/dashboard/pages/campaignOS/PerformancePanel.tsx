import { TrendingUp, TrendingDown, Minus, ArrowUpRight, Activity } from 'lucide-react';
import type { SignalItem } from './types';
import { mono, chip, LiveDot, HoverBtn } from './primitives';

const ADAPTATIONS = [
  { label: 'Brazil creator content', note: 'Outperforming paid media baseline by 31%', action: 'Scale creator budget', color: '#10B981', type: 'outperforming' },
  { label: 'NA merch-intent segment', note: '22K fans showing high purchase signals — bundle eligible', action: 'Activate merch push', color: '#F59E0B', type: 'opportunity' },
  { label: 'TikTok hook retention', note: 'Hook strong (73% hold), but CTA click-through weak (2.1%)', action: 'Refresh CTA variant', color: '#EF4444', type: 'underperforming' },
  { label: 'Apple placement detected', note: 'Algorithm-driven placement in 2 editorial playlists — promo response recommended', action: 'Send promo response', color: '#FA2D48', type: 'opportunity' },
  { label: 'UK engagement cooling', note: 'Post engagement down 4% — scheduled push Apr 22 will re-activate', action: 'View UK plan', color: '#6B7280', type: 'cooling' },
  { label: 'Mexico City organic spike', note: '+38% listener growth without paid support — signals audience match', action: 'Brief LATAM creators', color: '#10B981', type: 'outperforming' },
];

const TYPE_CFG = {
  outperforming:  { color: '#10B981', label: 'Outperforming' },
  opportunity:    { color: '#06B6D4', label: 'Opportunity'   },
  underperforming:{ color: '#EF4444', label: 'Needs Fix'     },
  cooling:        { color: '#F59E0B', label: 'Cooling'        },
};

function AdaptationCard({ item }: { item: typeof ADAPTATIONS[0] }) {
  const tc = TYPE_CFG[item.type as keyof typeof TYPE_CFG];
  return (
    <div style={{ background: '#0A0B0D', border: `1px solid ${item.color}20`, borderLeft: `2px solid ${item.color}`, borderRadius: 12, padding: '13px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 7, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{item.label}</span>
          <span style={{ ...chip(tc.color), fontSize: 7 }}>{tc.label}</span>
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item.note}</p>
      <HoverBtn label={item.action} color={item.color} icon={ArrowUpRight} sm />
    </div>
  );
}

export function PerformancePanel({ signals }: { signals: SignalItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Signal cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {signals.map(signal => {
          const TrendIcon = signal.trend === 'up' ? TrendingUp : signal.trend === 'down' ? TrendingDown : Minus;
          return (
            <div key={signal.id} style={{ background: `${signal.color}07`, border: `1px solid ${signal.color}18`, borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ ...mono, fontSize: 7, color: `${signal.color}66`, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 7 }}>{signal.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: signal.color, lineHeight: 1, marginBottom: 5 }}>{signal.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                <TrendIcon size={10} color={signal.color} />
                <span style={{ fontSize: 10, fontWeight: 700, color: signal.color }}>{signal.delta}</span>
              </div>
              {signal.note && <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>{signal.note}</p>}
            </div>
          );
        })}
      </div>

      {/* Live adaptation section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Activity size={11} color="#06B6D4" />
          <span style={{ ...mono, fontSize: 9, fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Live Adaptation Signals</span>
          <LiveDot color="#10B981" size={5} />
          <span style={{ ...mono, fontSize: 8, color: 'rgba(16,185,129,0.4)' }}>System adapting in real time</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {ADAPTATIONS.map((item, i) => <AdaptationCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
}
