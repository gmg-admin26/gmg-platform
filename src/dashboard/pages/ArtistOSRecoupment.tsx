import { RefreshCcw, DollarSign, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useActiveArtist } from '../hooks/useActiveArtist';

function fmtMoney(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n}`;
}

const MONTHLY_RECOUPMENT = [
  { month: 'Oct', amount: 3200 },
  { month: 'Nov', amount: 4100 },
  { month: 'Dec', amount: 5800 },
  { month: 'Jan', amount: 3900 },
  { month: 'Feb', amount: 4700 },
  { month: 'Mar', amount: 6200 },
  { month: 'Apr', amount: 5400 },
];

export default function ArtistOSRecoupment() {
  const artist = useActiveArtist();

  if (!artist) {
    return (
      <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, fontFamily: 'monospace' }}>No artist context active.</p>
      </div>
    );
  }

  const f = artist.financials;
  const isRecouped = f.recoupableBalance <= 0;
  const totalRecoupable = f.advance + Math.max(f.recoupableBalance, 0);
  const recoupedAmt = f.allTimeRevenue;
  const recoupPct = totalRecoupable > 0 ? Math.min(Math.round((recoupedAmt / (totalRecoupable + recoupedAmt)) * 100), 100) : 100;
  const maxMonthly = Math.max(...MONTHLY_RECOUPMENT.map(m => m.amount));
  const projectedMonthsRemaining = f.recoupableBalance > 0
    ? Math.ceil(f.recoupableBalance / 5000)
    : 0;

  return (
    <div style={{ background: '#08090B', minHeight: '100%', padding: '22px 24px' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RefreshCcw size={16} color="#F59E0B" />
        </div>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>Recoupment</h1>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{artist.name} — Advance Recoupment Tracker</p>
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <Info size={14} color="#06B6D4" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ margin: '0 0 3px 0', fontSize: 11, fontWeight: 600, color: '#06B6D4' }}>How Recoupment Works</p>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
            Recoupable spend (advance + designated ad, marketing, and content costs) is paid back through withheld streaming earnings and other revenue streams.
            Once the balance reaches $0, you begin receiving full artist royalty splits. Non-recoupable grants do not count against your balance.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Recoupable Balance', value: fmtMoney(f.recoupableBalance), color: '#F59E0B', Icon: RefreshCcw, sub: 'Remaining to recoup' },
          { label: 'Original Advance', value: fmtMoney(f.advance), color: '#06B6D4', Icon: DollarSign, sub: 'Initial advance issued' },
          { label: 'All-Time Revenue', value: fmtMoney(f.allTimeRevenue), color: '#10B981', Icon: TrendingUp, sub: 'Applied to recoupment' },
          { label: 'Recoupment Status', value: isRecouped ? 'Recouped' : 'In Progress', color: isRecouped ? '#10B981' : '#F59E0B', Icon: isRecouped ? CheckCircle : AlertCircle, sub: isRecouped ? 'Full splits active' : `~${projectedMonthsRemaining} months remaining` },
        ].map(stat => (
          <div key={stat.label} style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <stat.Icon size={12} color={stat.color} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</p>
            <p style={{ margin: '6px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recoupment Progress</span>
          </div>
          <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
              <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none"
                  stroke={recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - recoupPct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.9s' }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444' }}>
                  {recoupPct}%
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>RECOUPED</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 8px 0', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                {isRecouped ? 'Fully Recouped' : 'In Active Recoupment'}
              </p>
              <p style={{ margin: '0 0 14px 0', fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                {isRecouped
                  ? 'You are receiving your full royalty splits on all revenue.'
                  : `${fmtMoney(f.recoupableBalance)} remaining. Estimated ${projectedMonthsRemaining} months at current pace.`}
              </p>
              <div style={{ height: 8, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 4, transition: 'width 0.9s',
                  background: recoupPct >= 80 ? '#10B981' : recoupPct >= 50 ? '#F59E0B' : '#EF4444',
                  width: `${recoupPct}%`,
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>$0</span>
                <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>{fmtMoney(f.advance + Math.max(f.recoupableBalance, 0))}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Monthly Recoupment Rate</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, marginBottom: 8 }}>
              {MONTHLY_RECOUPMENT.map(m => {
                const h = maxMonthly > 0 ? (m.amount / maxMonthly) * 100 : 0;
                return (
                  <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', background: 'rgba(16,185,129,0.15)', borderRadius: '3px 3px 0 0', height: `${h}%`, border: '1px solid rgba(16,185,129,0.25)', borderBottom: 'none', minHeight: 4 }} />
                    <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>Avg monthly recoupment</span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#10B981' }}>
                {fmtMoney(Math.round(MONTHLY_RECOUPMENT.reduce((s, m) => s + m.amount, 0) / MONTHLY_RECOUPMENT.length))}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#0D0E11', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Financial Breakdown</span>
        </div>
        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Advance', value: fmtMoney(f.advance), color: '#06B6D4', note: 'Initial advance issued' },
              { label: 'Artist Grant', value: fmtMoney(f.artistGrant), color: f.artistGrantRecoupable ? '#EF4444' : '#10B981', note: f.artistGrantRecoupable ? 'Recoupable grant' : 'Non-recoupable grant' },
              { label: 'Recoupable Balance', value: fmtMoney(f.recoupableBalance), color: '#F59E0B', note: 'Outstanding balance' },
            ].map(item => (
              <div key={item.label} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.025)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                <p style={{ margin: '0 0 4px 0', fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</p>
                <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
