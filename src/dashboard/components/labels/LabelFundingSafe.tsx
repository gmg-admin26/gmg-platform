import { useState } from 'react';
import {
  Shield, Lock, ArrowUpRight, ArrowDownLeft, Send, Vault,
  Zap, Clock, TrendingUp, CheckCircle, AlertTriangle, Target,
  ChevronDown, ChevronUp, DollarSign, Activity, BarChart3,
  ArrowRight, RefreshCw, Wallet, PieChart, Building2, ShieldCheck,
  ArrowRightLeft, Settings,
} from 'lucide-react';

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

type ACHBankStatus = 'connected' | 'pending' | 'not_connected';

const ACH_BANK = {
  status: 'connected' as ACHBankStatus,
  institution: 'Chase Business Checking',
  last4: '7302',
  achEligible: true,
  verificationState: 'verified' as 'verified' | 'pending_microdep' | 'none',
};

function ACHBankStatusBar() {
  const bank = ACH_BANK;

  const isConnected   = bank.status === 'connected';
  const isPending     = bank.status === 'pending';
  const isMissing     = bank.status === 'not_connected';
  const isVerified    = bank.verificationState === 'verified';
  const isMicroPend   = bank.verificationState === 'pending_microdep';

  const statusColor  = isConnected ? '#10B981' : isPending ? '#F59E0B' : '#EF4444';
  const statusLabel  = isConnected ? 'ACH Bank Connected' : isPending ? 'Verification Pending' : 'Bank Account Needed';
  const StatusIcon   = isConnected ? ShieldCheck : isPending ? Clock : AlertTriangle;

  return (
    <>
      {/* Warning banners */}
      {isMissing && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10, marginBottom: 14,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
        }}>
          <AlertTriangle size={13} color="#EF4444" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(239,68,68,0.85)', lineHeight: 1.45 }}>
            ACH payout destination missing — connect a bank account before initiating label payouts.
          </span>
        </div>
      )}
      {isPending && isMicroPend && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 16px', borderRadius: 10, marginBottom: 14,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
        }}>
          <Clock size={13} color="#F59E0B" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.85)', lineHeight: 1.45 }}>
            Bank account connected but still awaiting ACH verification.
          </span>
        </div>
      )}

      {/* Status bar row */}
      <div style={{
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10,
        padding: '10px 14px', borderRadius: 11, marginBottom: 18,
        background: `${statusColor}07`,
        border: `1px solid ${statusColor}20`,
      }}>
        {/* Status badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
          <StatusIcon size={11} color={statusColor} />
          <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, letterSpacing: '0.06em', color: statusColor, textTransform: 'uppercase' as const }}>
            {statusLabel}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

        {/* Linked account */}
        {isConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Building2 size={10} color="rgba(255,255,255,0.3)" />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
              Linked: {bank.institution} &bull;&bull;&bull;&bull; {bank.last4}
            </span>
          </div>
        )}

        {/* ACH eligible */}
        {isConnected && bank.achEligible && (
          <>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ArrowRightLeft size={10} color="#06B6D4" />
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(6,182,212,0.7)' }}>ACH Eligible · 1–2 business days</span>
            </div>
          </>
        )}

        {/* Verification pill */}
        {isConnected && (
          <>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: isVerified ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${isVerified ? 'rgba(16,185,129,0.22)' : 'rgba(245,158,11,0.22)'}` }}>
              <ShieldCheck size={8} color={isVerified ? '#10B981' : '#F59E0B'} />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: isVerified ? '#10B981' : '#F59E0B', letterSpacing: '0.04em' }}>
                {isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </>
        )}

        {/* Right-side actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 7, flexShrink: 0 }}>
          {isMissing && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
              <Building2 size={9} /> Connect Bank Account
            </button>
          )}
          {isPending && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.28)', color: '#F59E0B' }}>
              <ShieldCheck size={9} /> Verify Bank Account
            </button>
          )}
          {isConnected && (
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.04em', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
              <Settings size={9} /> Manage Bank Account
            </button>
          )}
        </div>
      </div>
    </>
  );
}

const SAFE = {
  availableCapital:     28_400,
  achInProgress:         6_200,
  recoupableOutstanding: 18_000,
  nextPayoutLow:         14_000,
  nextPayoutHigh:        21_000,
  nextPayoutDate:       'May 15',
  campaignCapital:       9_500,
  lastPayoutAmount:      4_800,
  lastPayoutDate:       'Apr 3',
  linkedAccount:        'JPMorgan ••• 7302',
  totalCapital:         44_100,
};

const ALLOCATION = [
  { label: 'Campaigns',    amount: 9_500,  color: '#EC4899', pct: 22 },
  { label: 'Advances',     amount: 8_200,  color: '#F59E0B', pct: 19 },
  { label: 'Reserved',     amount: 10_700, color: '#06B6D4', pct: 24 },
  { label: 'In-flight ACH',amount: 6_200,  color: '#10B981', pct: 14 },
  { label: 'Unallocated',  amount: 9_500,  color: 'rgba(255,255,255,0.15)', pct: 21 },
];

interface ActionCard {
  id: string;
  type: 'deploy' | 'hold' | 'reallocate' | 'approve';
  headline: string;
  reason: string;
  confidence: 'High' | 'Medium' | 'Low';
  cta: string;
  amount?: number;
  color: string;
  icon: React.ElementType;
  dismissed?: boolean;
}

const INITIAL_ACTIONS: ActionCard[] = [
  {
    id: 'a1',
    type: 'deploy',
    headline: 'Deploy $9.5K to Robot Sunrise campaign',
    reason: 'Listener growth at +22.1% — high ROI signal window before Apr 25 release.',
    confidence: 'High',
    cta: 'Deploy',
    amount: 9_500,
    color: '#EC4899',
    icon: Zap,
  },
  {
    id: 'a2',
    type: 'hold',
    headline: 'Delay payout — AAR still in recoupment window',
    reason: 'All American Rejects has $18K outstanding. Releasing funds now reduces recoupment leverage.',
    confidence: 'High',
    cta: 'Review',
    color: '#F59E0B',
    icon: Clock,
  },
  {
    id: 'a3',
    type: 'reallocate',
    headline: 'Reallocate $2K from underperforming Brazil campaign',
    reason: 'Spend efficiency down 34% vs. baseline. Redirect to US market where Jorgen has organic traction.',
    confidence: 'Medium',
    cta: 'Approve',
    amount: 2_000,
    color: '#06B6D4',
    icon: RefreshCw,
  },
  {
    id: 'a4',
    type: 'approve',
    headline: 'Robot Sunrise advance request pending approval',
    reason: 'Team submitted $5K advance request for recording costs. Health score 74 — within approval range.',
    confidence: 'Medium',
    cta: 'Approve',
    amount: 5_000,
    color: '#10B981',
    icon: CheckCircle,
  },
];

interface Tx {
  id: string;
  label: string;
  amount: string;
  date: string;
  state: 'settled' | 'sent' | 'pending';
  credit: boolean;
}

const TXS: Tx[] = [
  { id: 't1', label: 'ACH Payout — All American Rejects',   amount: '+$4,800', date: 'Apr 3',  state: 'settled', credit: true  },
  { id: 't2', label: 'Campaign Spend Deployed — AAR Paid',  amount: '-$3,200', date: 'Apr 1',  state: 'settled', credit: false },
  { id: 't3', label: 'Streaming Royalties Received Q1',     amount: '+$12,100',date: 'Mar 28', state: 'settled', credit: true  },
  { id: 't4', label: 'Advance Issued — Robot Sunrise',      amount: '-$5,000', date: 'Mar 20', state: 'settled', credit: false },
  { id: 't5', label: 'Recoupment Collected — Jorgen',       amount: '+$1,400', date: 'Mar 15', state: 'settled', credit: true  },
  { id: 't6', label: 'ACH In Progress — Imprint Payout',    amount: '+$6,200', date: 'Apr 10', state: 'sent',    credit: true  },
];

function GlowCard({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      background: `${color}08`, border: `1px solid ${color}22`, borderRadius: 13, padding: '15px 17px',
      boxShadow: `0 0 22px ${color}09, inset 0 1px 0 ${color}14`, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${color}45,transparent)` }} />
      {children}
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 7, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
      color, background: `${color}14`, border: `1px solid ${color}25`, borderRadius: 5, padding: '2px 6px',
    }}>{label}</span>
  );
}

function PrimaryBtn({ label, color, icon: Icon, onClick }: { label: string; color: string; icon?: React.ElementType; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 9, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em',
        color: hov ? '#000' : color,
        background: hov ? color : `${color}12`,
        border: `1px solid ${color}35`,
        borderRadius: 9, padding: '8px 14px', cursor: 'pointer',
        whiteSpace: 'nowrap' as const,
        transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
        boxShadow: hov ? `0 0 16px ${color}35` : 'none',
      }}
    >
      {Icon && <Icon size={10} color={hov ? '#000' : color} />}
      {label}
    </button>
  );
}

function ActionBtn({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 9, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em',
        color, background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 8,
        padding: '7px 13px', cursor: 'pointer', whiteSpace: 'nowrap' as const,
        transition: 'background 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = `${color}22`;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 10px ${color}20`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = `${color}12`;
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
    >{label}</button>
  );
}

function ConfidencePip({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const color = level === 'High' ? '#10B981' : level === 'Medium' ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: 2,
          background: i < (level === 'High' ? 3 : level === 'Medium' ? 2 : 1) ? color : 'rgba(255,255,255,0.1)',
        }} />
      ))}
      <span style={{ fontFamily: 'monospace', fontSize: 7, color, letterSpacing: '0.06em', fontWeight: 800 }}>{level}</span>
    </div>
  );
}

function CapitalActionsSection() {
  const [actions, setActions] = useState<ActionCard[]>(INITIAL_ACTIONS);
  const [confirming, setConfirming] = useState<string | null>(null);

  function dismiss(id: string) {
    setActions(prev => prev.filter(a => a.id !== id));
    setConfirming(null);
  }

  function handleCTA(id: string) {
    setConfirming(id);
    setTimeout(() => dismiss(id), 1800);
  }

  if (actions.length === 0) {
    return (
      <div style={{
        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)',
        borderRadius: 14, padding: '18px 22px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <CheckCircle size={16} color="#10B981" />
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(16,185,129,0.7)' }}>
          All capital actions resolved. No pending decisions.
        </span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(239,68,68,0.06) 0%,rgba(245,158,11,0.04) 50%,rgba(6,182,212,0.03) 100%)',
      border: '1px solid rgba(239,68,68,0.22)', borderRadius: 16, overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(239,68,68,0.55),rgba(245,158,11,0.35),transparent)' }} />

      {/* Header */}
      <div style={{ padding: '14px 20px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={13} color="#EF4444" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>Capital Actions Required</div>
          <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
            {actions.length} decision{actions.length !== 1 ? 's' : ''} pending · Act now to maximize deployment window
          </div>
        </div>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 5, padding: '3px 8px' }}>
          {actions.length} PENDING
        </span>
      </div>

      {/* Cards */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {actions.map(action => {
          const Icon = action.icon;
          const isConfirming = confirming === action.id;
          return (
            <div key={action.id} style={{
              background: isConfirming ? `${action.color}10` : 'rgba(255,255,255,0.025)',
              border: `1px solid ${isConfirming ? action.color + '40' : 'rgba(255,255,255,0.07)'}`,
              borderRadius: 12, padding: '13px 15px',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              {/* Icon */}
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: `${action.color}12`, border: `1px solid ${action.color}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isConfirming ? `0 0 12px ${action.color}30` : 'none',
                transition: 'box-shadow 0.2s',
              }}>
                <Icon size={15} color={action.color} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: isConfirming ? action.color : 'rgba(255,255,255,0.88)', transition: 'color 0.2s' }}>
                    {isConfirming ? 'Processing...' : action.headline}
                  </span>
                  {action.amount && (
                    <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 900, color: action.color }}>
                      {fmtMoney(action.amount)}
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{action.reason}</div>
              </div>

              {/* Confidence + CTA */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <ConfidencePip level={action.confidence} />
                {isConfirming ? (
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: action.color }}>Confirmed ✓</span>
                ) : (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => dismiss(action.id)}
                      style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '5px 9px', cursor: 'pointer' }}
                    >Dismiss</button>
                    <button
                      onClick={() => handleCTA(action.id)}
                      style={{
                        fontFamily: 'monospace', fontSize: 9, fontWeight: 800, letterSpacing: '0.04em',
                        color: '#000', background: action.color, border: `1px solid ${action.color}`,
                        borderRadius: 7, padding: '6px 13px', cursor: 'pointer',
                        boxShadow: `0 0 10px ${action.color}35`,
                        transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = '1'}
                    >
                      {action.cta} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AllocationBreakdown() {
  const total = ALLOCATION.reduce((s, a) => s + a.amount, 0);

  return (
    <div style={{ background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '12px 18px 11px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <PieChart size={12} color="rgba(255,255,255,0.25)" />
        <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)' }}>Capital Allocation Breakdown</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>Total: {fmtMoney(total)}</span>
      </div>
      <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Stacked bar */}
        <div style={{ display: 'flex', height: 8, borderRadius: 99, overflow: 'hidden', gap: 2 }}>
          {ALLOCATION.map(a => (
            <div key={a.label} style={{ width: `${a.pct}%`, background: a.color, borderRadius: 99, flexShrink: 0 }} />
          ))}
        </div>

        {/* Legend rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 4 }}>
          {ALLOCATION.map(a => (
            <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: 3, background: a.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{a.label}</span>
              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: a.color }}>{fmtMoney(a.amount)}</span>
              <div style={{ width: 80, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: `${a.pct}%`, height: '100%', background: a.color, borderRadius: 99 }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', width: 26, textAlign: 'right' as const }}>{a.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TxRow({ tx }: { tx: Tx }) {
  const stateColor = tx.state === 'settled' ? 'rgba(255,255,255,0.18)' : tx.state === 'sent' ? '#06B6D4' : '#F59E0B';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        background: tx.credit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${tx.credit ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {tx.credit ? <ArrowDownLeft size={10} color="#10B981" /> : <ArrowUpRight size={10} color="#EF4444" />}
      </div>
      <span style={{ flex: 1, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{tx.label}</span>
      <span style={{ fontSize: 12, fontWeight: 900, fontFamily: 'monospace', color: tx.credit ? '#10B981' : '#EF4444' }}>{tx.amount}</span>
      <span style={{ fontSize: 8, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>{tx.date}</span>
      <Chip label={tx.state} color={stateColor} />
    </div>
  );
}

export function LabelFundingSafe() {
  const [showTx, setShowTx] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* ── CAPITAL ACTIONS REQUIRED ── */}
      <CapitalActionsSection />

      {/* ── MAIN VAULT PANEL ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.09) 0%, rgba(16,185,129,0.06) 55%, rgba(6,182,212,0.04) 100%)',
        border: '1px solid rgba(245,158,11,0.28)', borderRadius: 20, padding: '22px 26px',
        boxShadow: '0 0 0 1px rgba(245,158,11,0.06), 0 12px 40px rgba(245,158,11,0.07)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent 0%, rgba(245,158,11,0.65) 35%, rgba(16,185,129,0.4) 65%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 15, flexShrink: 0,
              background: 'rgba(245,158,11,0.11)', border: '1px solid rgba(245,158,11,0.32)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 22px rgba(245,158,11,0.14)',
            }}>
              <Shield size={22} color="#F59E0B" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <Lock size={8} color="rgba(245,158,11,0.55)" />
                <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: 'rgba(245,158,11,0.55)' }}>Label Funding Safe</span>
                <Chip label="Active" color="#10B981" />
                <Chip label="SPIN Records" color="#F59E0B" />
              </div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Portfolio Capital &amp; Payout Center</h3>
              <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                Portfolio-level capital, payouts, recoupable campaign spend, and available deployment · {SAFE.linkedAccount}
              </p>
            </div>
          </div>
          {/* Upgraded action buttons */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            {ACH_BANK.status === 'connected' ? (
              <ActionBtn label="Initiate Payout Flow" color="#10B981" />
            ) : (
              <div style={{ position: 'relative' }}>
                <button
                  disabled
                  title={ACH_BANK.status === 'not_connected' ? 'Connect bank to enable ACH payout flow' : 'Bank verification required before payout'}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.05em', padding: '7px 13px', borderRadius: 8, cursor: 'not-allowed', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.22)', color: 'rgba(239,68,68,0.55)' }}
                >
                  <AlertTriangle size={9} /> {ACH_BANK.status === 'not_connected' ? 'Connect bank to enable ACH payout flow' : 'Payout Flow — Verify Bank First'}
                </button>
              </div>
            )}
            <ActionBtn label="Request New Capital" color="#F59E0B" />
            <ActionBtn label="Open Safe" color="#06B6D4" />
            <PrimaryBtn label="Deploy to Campaigns" color="#EC4899" icon={Zap} />
          </div>
        </div>

        {/* ACH bank status bar */}
        <ACHBankStatusBar />

        {/* Primary metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11, marginBottom: 11 }}>
          <GlowCard color="#10B981">
            <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'rgba(16,185,129,0.5)', marginBottom: 9 }}>Available Capital Pool</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#10B981', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 5 }}>{fmtMoney(SAFE.availableCapital)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px #10B981' }} />
              <span style={{ fontSize: 9, color: 'rgba(16,185,129,0.55)' }}>Ready for immediate deployment</span>
            </div>
          </GlowCard>

          <GlowCard color="#06B6D4">
            <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'rgba(6,182,212,0.5)', marginBottom: 9 }}>ACH In Progress</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#06B6D4', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 5 }}>{fmtMoney(SAFE.achInProgress)}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Initiated Apr 10 · Settling T+2</div>
          </GlowCard>

          <GlowCard color="#EF4444">
            <div style={{ fontFamily: 'monospace', fontSize: 7, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'rgba(239,68,68,0.5)', marginBottom: 9 }}>Recoupable Outstanding</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#EF4444', lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 5 }}>{fmtMoney(SAFE.recoupableOutstanding)}</div>
            <div style={{ fontSize: 9, color: 'rgba(239,68,68,0.5)' }}>Active across 3 roster artists</div>
          </GlowCard>
        </div>

        {/* Secondary stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            {
              label: 'Next Portfolio Payout',
              value: `${fmtMoney(SAFE.nextPayoutLow)}–${fmtMoney(SAFE.nextPayoutHigh)}`,
              sub: `Est. window · ${SAFE.nextPayoutDate}`,
              color: '#06B6D4',
            },
            {
              label: 'Campaign Capital Available',
              value: fmtMoney(SAFE.campaignCapital),
              sub: 'Ready for ad activation now',
              color: '#EC4899',
            },
            {
              label: 'Last Payout Sent',
              value: fmtMoney(SAFE.lastPayoutAmount),
              sub: `Cleared ${SAFE.lastPayoutDate} · ${SAFE.linkedAccount}`,
              color: '#10B981',
            },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '13px 15px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 7, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color: 'rgba(255,255,255,0.2)', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em' }}>{s.value}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CAPITAL ALLOCATION BREAKDOWN ── */}
      <AllocationBreakdown />

      {/* ── DEPLOY CALLOUT ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(245,158,11,0.05) 100%)',
        border: '1px solid rgba(236,72,153,0.22)', borderRadius: 14, padding: '15px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(236,72,153,0.45),transparent)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(236,72,153,0.1)', flexShrink: 0 }}>
            <Zap size={16} color="#EC4899" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 3 }}>$9,500 Campaign Capital Ready to Deploy</div>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: 500 }}>
              Activate paid media for All American Rejects pre-save or Robot Sunrise launch. Recoupable against next portfolio payout window · Est. {SAFE.nextPayoutDate}.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PrimaryBtn label="Deploy to Campaigns" color="#EC4899" icon={Zap} />
          <ActionBtn label="View Payout Schedule" color="#06B6D4" />
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS ── */}
      <div style={{ background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div
          style={{ padding: '12px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: showTx ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
          onClick={() => setShowTx(v => !v)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={12} color="rgba(255,255,255,0.25)" />
            <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.35)' }}>Recent Transactions</span>
            <Chip label={`${TXS.length} entries`} color="rgba(255,255,255,0.25)" />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#06B6D4', cursor: 'pointer' }}>
            {showTx ? <ChevronUp size={13} color="#06B6D4" /> : <ChevronDown size={13} color="#06B6D4" />}
          </span>
        </div>
        {showTx && (
          <div style={{ padding: '4px 18px 12px' }}>
            {TXS.map(tx => <TxRow key={tx.id} tx={tx} />)}
            <div style={{ paddingTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={9} color="rgba(16,185,129,0.4)" /> All cleared · Last updated Apr 12
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
