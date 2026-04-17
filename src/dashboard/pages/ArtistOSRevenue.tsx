import { useState } from 'react';
import { DollarSign, TrendingUp, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useActiveArtist } from '../hooks/useActiveArtist';

type TimeWindow = 'allTime' | 'ytd' | 'last30';

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const REVENUE_STREAMS = [
  { label: 'Streaming', key: 'streaming', color: '#10B981', share: 0.52 },
  { label: 'Sync / Licensing', key: 'sync', color: '#06B6D4', share: 0.18 },
  { label: 'Publishing', key: 'publishing', color: '#F59E0B', share: 0.14 },
  { label: 'Merch / Commerce', key: 'merch', color: '#EC4899', share: 0.10 },
  { label: 'Live / Shows', key: 'live', color: '#3B82F6', share: 0.06 },
];

export default function ArtistOSRevenue() {
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
  const revenue = window === 'allTime' ? f.allTimeRevenue : window === 'ytd' ? f.ytdRevenue : f.last30Revenue;
  const investment = window === 'allTime' ? f.totalInvestment.allTime : window === 'ytd' ? f.totalInvestment.ytd : f.totalInvestment.last30;
  const netPosition = revenue - investment;
  const roiPct = investment > 0 ? ((revenue / investment) * 100).toFixed(0) : '0';
  const recouped = f.recoupableBalance <= 0;
  const recoupPct = f.advance > 0 ? Math.min(Math.round((f.allTimeRevenue / (f.advance + Math.max(f.recoupableBalance, 0))) * 100), 100) : 100;

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={16} color="#10B981" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 1 }}>
              <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>Revenue</h1>
              <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 7px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.22)', color: '#F59E0B', letterSpacing: '0.06em' }}>{artist.labelImprint}</span>
            </div>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{artist.name} — Earnings Intelligence</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Total Revenue', value: fmtMoney(revenue), color: '#10B981', Icon: TrendingUp, sub: window === 'allTime' ? 'All time' : window === 'ytd' ? 'Year to date' : 'Last 30 days' },
          { label: 'Total Investment', value: fmtMoney(investment), color: '#EF4444', Icon: BarChart2, sub: 'Recoupable + non-recoupable' },
          { label: 'Net Position', value: fmtMoney(Math.abs(netPosition)), color: netPosition >= 0 ? '#10B981' : '#EF4444', Icon: netPosition >= 0 ? ArrowUpRight : ArrowDownRight, sub: netPosition >= 0 ? 'Revenue ahead' : 'Investment ahead' },
          { label: 'ROI', value: `${roiPct}%`, color: Number(roiPct) >= 100 ? '#10B981' : '#F59E0B', Icon: ArrowUpRight, sub: 'Revenue / investment' },
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Revenue Breakdown by Stream</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            {REVENUE_STREAMS.map(stream => {
              const val = revenue * stream.share;
              return (
                <div key={stream.key} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{stream.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{(stream.share * 100).toFixed(0)}%</span>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: stream.color, fontWeight: 600 }}>{fmtMoney(val)}</span>
                    </div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: stream.color, borderRadius: 2, width: `${stream.share * 100}%`, transition: 'width 0.6s' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recoupment Status</span>
          </div>
          <div style={{ padding: '20px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
                <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                  <circle cx="32" cy="32" r="26" fill="none"
                    stroke={recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 26}`}
                    strokeDashoffset={`${2 * Math.PI * 26 * (1 - recoupPct / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.8s' }}
                  />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444' }}>
                    {recoupPct}%
                  </span>
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: 13, fontWeight: 700, color: '#fff' }}>
                  {recouped ? 'Fully Recouped' : 'In Recoupment'}
                </p>
                <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                  {recouped ? 'Receiving full royalty splits' : `$${fmtMoney(f.recoupableBalance)} remaining balance`}
                </p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'Advance', value: fmtMoney(f.advance), color: '#06B6D4' },
                { label: 'All-Time Revenue', value: fmtMoney(f.allTimeRevenue), color: '#10B981' },
                { label: 'Recoupable Balance', value: fmtMoney(f.recoupableBalance), color: '#F59E0B' },
                { label: 'Artist Grant', value: fmtMoney(f.artistGrant), color: f.artistGrantRecoupable ? '#EF4444' : '#10B981' },
              ].map(item => (
                <div key={item.label} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.025)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ margin: '0 0 3px 0', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Revenue vs Investment Timeline</span>
        </div>
        <div style={{ padding: '18px 20px' }}>
          {[
            { label: 'Total Revenue', value: revenue, color: '#10B981' },
            { label: 'Total Investment', value: investment, color: '#EF4444' },
            { label: 'Net Position', value: Math.abs(netPosition), color: netPosition >= 0 ? '#10B981' : '#EF4444' },
          ].map(row => {
            const max = Math.max(revenue, investment);
            const pct = max > 0 ? (row.value / max) * 100 : 0;
            return (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', width: 120, flexShrink: 0 }}>{row.label}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: row.color, borderRadius: 3, width: `${pct}%`, transition: 'width 0.7s' }} />
                </div>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: row.color, width: 72, textAlign: 'right', flexShrink: 0 }}>{fmtMoney(row.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
