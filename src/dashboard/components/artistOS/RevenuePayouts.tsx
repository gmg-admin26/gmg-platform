import { DollarSign, ArrowDownLeft, TrendingUp, Building2, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { REVENUE } from '../../data/artistOSData';

const ARTIST_PAYOUT_BANK = {
  status: 'connected' as 'connected' | 'not_connected' | 'pending',
  institution: 'Bank of America',
  accountType: 'Business Checking',
  last4: '4821',
  verified: true,
};

export default function RevenuePayouts() {
  const maxBar = Math.max(...REVENUE.monthly.map(m => m.val));

  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <DollarSign className="w-4 h-4 text-[#10B981]" />
        <span className="text-[13px] font-semibold text-white/80">Revenue & Payouts</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Main figures */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative p-3.5 rounded-xl bg-[#10B981]/[0.06] border border-[#10B981]/15 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">This Month</p>
            <p className="text-[24px] font-bold text-[#10B981] leading-none font-['Satoshi',sans-serif]">{REVENUE.total_mtd}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <TrendingUp className="w-3 h-3 text-[#10B981]" />
              <p className="text-[10px] text-[#10B981]/60">Up from last month</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#06B6D4]/[0.06] border border-[#06B6D4]/15">
            <div className="flex items-center gap-1.5 mb-1">
              <ArrowDownLeft className="w-3 h-3 text-[#06B6D4]" />
              <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider">Next Payout</p>
            </div>
            <p className="text-[24px] font-bold text-[#06B6D4] leading-none font-['Satoshi',sans-serif]">{REVENUE.next_payout}</p>
            <p className="text-[10px] text-[#06B6D4]/50 mt-1.5">{REVENUE.next_payout_date}</p>
          </div>
        </div>

        {/* Revenue bar chart */}
        <div>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">6-Month Trend</p>
          <div className="flex items-end gap-1 h-16">
            {REVENUE.monthly.map(m => {
              const h = Math.max(8, (m.val / maxBar) * 100);
              const isLatest = m.month === 'Apr';
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: isLatest
                        ? 'linear-gradient(180deg, #10B981, #06B6D4)'
                        : 'rgba(255,255,255,0.06)',
                    }}
                  />
                  <span className="text-[9px] font-mono text-white/20">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown */}
        <div>
          <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2.5">By Source</p>
          <div className="space-y-2">
            {REVENUE.breakdown.map(b => (
              <div key={b.source} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: b.color }} />
                <span className="text-[11px] text-white/45 flex-1">{b.source}</span>
                <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                </div>
                <span className="text-[11px] font-mono text-white/55 w-14 text-right shrink-0">{b.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* YTD */}
        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-[11px] text-white/30">Year to date</p>
          <p className="text-[14px] font-bold text-white/60 font-['Satoshi',sans-serif]">{REVENUE.total_ytd}</p>
        </div>

        {/* Payout destination status */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 12 }}>
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Payout Destination</p>

          {ARTIST_PAYOUT_BANK.status === 'connected' && (
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 9, padding: '9px 12px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.3),transparent)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 size={12} color="#10B981" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.72)' }}>
                      {ARTIST_PAYOUT_BANK.institution} · {ARTIST_PAYOUT_BANK.accountType} &bull;&bull;&bull;&bull; {ARTIST_PAYOUT_BANK.last4}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 8, padding: '1px 6px', borderRadius: 10, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)', color: 'rgba(16,185,129,0.8)' }}>ACH Connected</span>
                    {ARTIST_PAYOUT_BANK.verified && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'monospace', fontSize: 8, color: 'rgba(16,185,129,0.6)' }}>
                        <ShieldCheck size={9} color="#10B981" /> Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {ARTIST_PAYOUT_BANK.status === 'pending' && (
            <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: 9, padding: '9px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: 11, fontWeight: 600, color: 'rgba(245,158,11,0.85)' }}>Pending Verification</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                    Payouts held until micro-deposit verification completes.
                  </p>
                </div>
                <button style={{ flexShrink: 0, fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.28)', color: '#F59E0B', cursor: 'pointer' }}>
                  VERIFY
                </button>
              </div>
            </div>
          )}

          {ARTIST_PAYOUT_BANK.status === 'not_connected' && (
            <div style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 9, padding: '9px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: 11, fontWeight: 600, color: 'rgba(239,68,68,0.85)' }}>No Bank Account On File</p>
                  <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', lineHeight: 1.5 }}>
                    Payouts cannot be initiated until a verified account is connected.
                  </p>
                </div>
                <button style={{ flexShrink: 0, fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', cursor: 'pointer' }}>
                  CONNECT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
