import { useState } from 'react';
import { BarChart2, TrendingDown, AlertCircle } from 'lucide-react';
import { useActiveArtist } from '../hooks/useActiveArtist';

type TimeWindow = 'allTime' | 'ytd' | 'last30';

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const CATEGORIES = [
  { key: 'adSpend', label: 'Ad Spend', recoupable: true, color: '#EF4444' },
  { key: 'marketingSpend', label: 'Marketing', recoupable: true, color: '#F59E0B' },
  { key: 'contentProduction', label: 'Content Production', recoupable: true, color: '#06B6D4' },
  { key: 'liveShows', label: 'Live Shows', recoupable: false, color: '#10B981' },
  { key: 'touring', label: 'Touring', recoupable: false, color: '#3B82F6' },
  { key: 'arSpend', label: 'A&R Spend', recoupable: false, color: '#8B5CF6' },
  { key: 'operationsPeople', label: 'Operations / People', recoupable: false, color: '#EC4899' },
  { key: 'otherRecoupable', label: 'Other Recoupable', recoupable: true, color: '#F97316' },
  { key: 'otherNonRecoupable', label: 'Other Non-Recoupable', recoupable: false, color: '#6B7280' },
] as const;

type CategoryKey = typeof CATEGORIES[number]['key'];

export default function ArtistOSSpending() {
  const artist = useActiveArtist();

  if (!artist) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist context active.</p>
      </div>
    );
  }

  const [window, setWindow] = useState<TimeWindow>('ytd');

  const f = artist.financials;
  const tw = window === 'last30' ? 'last30' : window === 'ytd' ? 'ytd' : 'allTime';

  function getCatVal(key: CategoryKey): number {
    return f[key][tw];
  }

  const totalSpend = f.totalInvestment[tw];
  const categoryTotals = CATEGORIES.map(c => ({ ...c, total: getCatVal(c.key) })).sort((a, b) => b.total - a.total);
  const maxCat = categoryTotals[0]?.total ?? 1;
  const recoupableTotal = categoryTotals.filter(c => c.recoupable).reduce((s, c) => s + c.total, 0);
  const nonRecoupableTotal = categoryTotals.filter(c => !c.recoupable).reduce((s, c) => s + c.total, 0);

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={16} color="#EF4444" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 1 }}>
              <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>Investments</h1>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)', color: '#F59E0B', letterSpacing: '0.06em' }}>{artist.labelImprint}</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{artist.name} — Investment Breakdown</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#0D0E11', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3 }}>
          {(['allTime', 'ytd', 'last30'] as TimeWindow[]).map(w => (
            <button key={w} onClick={() => setWindow(w)} style={{
              fontSize: 9, fontFamily: 'monospace', padding: '5px 11px', borderRadius: 7, cursor: 'pointer', border: 'none',
              background: window === w ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: window === w ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            }}>
              {w === 'allTime' ? 'ALL TIME' : w === 'ytd' ? 'YTD' : 'LAST 30'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Investment', value: fmtMoney(totalSpend), color: '#EF4444', Icon: TrendingDown, sub: 'All spend categories' },
          { label: 'Recoupable Spend', value: fmtMoney(recoupableTotal), color: '#F59E0B', Icon: AlertCircle, sub: 'Against advance balance' },
          { label: 'Non-Recoupable', value: fmtMoney(nonRecoupableTotal), color: '#6B7280', Icon: BarChart2, sub: 'Expensed only' },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <stat.Icon size={12} color={stat.color} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ margin: '6px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Spend by Category</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>Recoupable</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)' }}>Non-Recoupable</span>
            </div>
          </div>
        </div>
        <div style={{ padding: '16px 18px' }}>
          {categoryTotals.map(cat => (
            <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 140, flexShrink: 0 }}>
                <p style={{ margin: '0 0 3px 0', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{cat.label}</p>
                <span style={{
                  fontSize: 8, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 4,
                  color: cat.recoupable ? '#F59E0B' : 'rgba(255,255,255,0.25)',
                  background: cat.recoupable ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                }}>
                  {cat.recoupable ? 'Recoupable' : 'Non-Recoup'}
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 3, background: cat.color, width: `${maxCat > 0 ? (cat.total / maxCat) * 100 : 0}%`, transition: 'width 0.7s' }} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)', width: 64, textAlign: 'right', flexShrink: 0 }}>{fmtMoney(cat.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Detailed Spend Summary</span>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { label: 'Ad Spend', value: fmtMoney(f.adSpend[tw]), color: '#EF4444' },
              { label: 'Marketing', value: fmtMoney(f.marketingSpend[tw]), color: '#F59E0B' },
              { label: 'Content Production', value: fmtMoney(f.contentProduction[tw]), color: '#06B6D4' },
              { label: 'Live Shows', value: fmtMoney(f.liveShows[tw]), color: '#10B981' },
              { label: 'Touring', value: fmtMoney(f.touring[tw]), color: '#3B82F6' },
              { label: 'A&R Spend', value: fmtMoney(f.arSpend[tw]), color: '#8B5CF6' },
              { label: 'Operations / People', value: fmtMoney(f.operationsPeople[tw]), color: '#EC4899' },
              { label: 'Other Recoupable', value: fmtMoney(f.otherRecoupable[tw]), color: '#F97316' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: 'rgba(255,255,255,0.025)', borderRadius: 9, border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
