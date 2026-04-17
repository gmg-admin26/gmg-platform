import { useState } from 'react';
import {
  Shield, Lock, ArrowUpRight, ArrowDownLeft, Clock,
  Zap, Send, CreditCard, TrendingUp, Building2, ShieldCheck,
  AlertCircle, ArrowRight, Activity, Radio, ChevronDown,
  Flame, BarChart2, RefreshCw,
} from 'lucide-react';
import { mono, chip, LiveDot, HoverBtn } from './primitives';
import type { WalletTx } from './types';
import { WALLET_TXS } from './data';

type ACHDestStatus = 'connected' | 'pending' | 'not_connected';

const ACH_DEST = {
  status: 'connected' as ACHDestStatus,
  institution: 'Chase',
  accountType: 'Business Checking',
  last4: '4821',
  verified: true,
};

const WALLET = {
  available: '$8,420',
  achInProgress: '$2,300',
  lastPayout: 'Mar 28',
  lastPayoutAmount: '$2,300',
  nextPayout: 'Apr 30',
  nextPayoutEst: '$4,200–$5,800',
  recoupableAvail: '$5,000',
  advanceAvail: '$3,500',
  status: 'advance-eligible' as const,
  linked: 'Chase ••• 4821',
};

const STATUS_COPY: Record<string, { label: string; color: string; note: string }> = {
  'advance-eligible':   { label: 'Advance Eligible',  color: '#F59E0B', note: 'Qualify for advance against Apr 30 streaming payout' },
  'ach-sent':           { label: 'ACH Sent',           color: '#06B6D4', note: 'Transfer to Chase ••• 4821 initiated' },
  'recoupable-active':  { label: 'Recoupable Active',  color: '#10B981', note: 'Active campaign spend recouping against streaming cycle' },
};

interface CapitalStage {
  id: string;
  label: string;
  sublabel: string;
  amount: string;
  amountNote: string;
  state: 'live' | 'ready' | 'pending' | 'locked';
  nextUnlock: string;
  outcome: string;
  icon: React.ElementType;
  color: string;
  ctaLabel?: string;
  ctaColor?: string;
  ctaIcon?: React.ElementType;
}

const CAPITAL_CHAIN: CapitalStage[] = [
  {
    id: 'receivable',
    label: 'Streaming Receivable',
    sublabel: 'Next payout cycle',
    amount: '$4,200–$5,800',
    amountNote: 'Est. Apr 30 payout',
    state: 'pending',
    nextUnlock: '17 days',
    outcome: 'Funds the safe + enables next advance eligibility',
    icon: Radio,
    color: '#06B6D4',
  },
  {
    id: 'safe',
    label: 'Wallet Safe',
    sublabel: 'Available now',
    amount: '$8,420',
    amountNote: 'Ready for activation',
    state: 'live',
    nextUnlock: 'Immediate',
    outcome: 'Covers ACH payouts or campaign deployment',
    icon: Shield,
    color: '#10B981',
    ctaLabel: 'Start Payout',
    ctaColor: '#10B981',
    ctaIcon: Send,
  },
  {
    id: 'advance',
    label: 'Advance Eligible',
    sublabel: 'Pre-funded capital',
    amount: '$3,500',
    amountNote: 'Recoupable vs. Apr 30',
    state: 'ready',
    nextUnlock: 'On request',
    outcome: 'Unlocks release-week paid media before payout arrives',
    icon: Zap,
    color: '#F59E0B',
    ctaLabel: 'Request Advance',
    ctaColor: '#F59E0B',
    ctaIcon: CreditCard,
  },
  {
    id: 'deploy',
    label: 'Campaign Deployment',
    sublabel: 'Paid media ready to launch',
    amount: '$3,500',
    amountNote: 'Deployable into release week',
    state: 'locked',
    nextUnlock: 'Activate advance',
    outcome: 'Funds Meta + TikTok ads, creator fees, paid placements',
    icon: Flame,
    color: '#EF4444',
    ctaLabel: 'Deploy Now',
    ctaColor: '#EF4444',
    ctaIcon: ArrowUpRight,
  },
  {
    id: 'lift',
    label: 'Projected Lift',
    sublabel: 'If deployed in full',
    amount: '+25–40%',
    amountNote: 'Streams on release day',
    state: 'locked',
    nextUnlock: 'Post-deployment',
    outcome: '+$12K–$18K est. 30-day revenue · Recoup by May 14',
    icon: BarChart2,
    color: '#A855F7',
  },
];

const STATE_CFG: Record<CapitalStage['state'], { color: string; label: string }> = {
  live:    { color: '#10B981', label: 'Live'    },
  ready:   { color: '#F59E0B', label: 'Ready'   },
  pending: { color: '#06B6D4', label: 'Pending' },
  locked:  { color: '#475569', label: 'Locked'  },
};

function PipeConnector({ active, color }: { active: boolean; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative', width: 32, height: 60 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: 2, background: active ? `linear-gradient(90deg, ${color}60, ${color}30)` : 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
        {active && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '45%', height: '100%',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            animation: 'ws-flow 1.6s linear infinite',
          }} />
        )}
      </div>
      <ArrowRight size={9} color={active ? color : 'rgba(255,255,255,0.1)'} style={{ position: 'absolute', right: -1, top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
}

function CapitalStageCard({ stage, isLast }: { stage: CapitalStage; isLast: boolean }) {
  const sc = STATE_CFG[stage.state];
  const Icon = stage.icon;
  const isActive = stage.state === 'live' || stage.state === 'ready';
  const isPending = stage.state === 'pending';

  return (
    <div style={{
      flex: 1, minWidth: 120, borderRadius: 14, overflow: 'hidden',
      background: isActive ? `${stage.color}08` : isPending ? `${stage.color}05` : 'rgba(255,255,255,0.025)',
      border: `1px solid ${isActive ? stage.color + '28' : isPending ? stage.color + '18' : 'rgba(255,255,255,0.06)'}`,
      borderTop: `2px solid ${isActive ? stage.color : isPending ? stage.color + '60' : 'rgba(255,255,255,0.06)'}`,
      boxShadow: isActive ? `0 0 18px ${stage.color}10` : 'none',
      transition: 'all 0.3s ease',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '14px 13px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Icon + state */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${stage.color}12`, border: `1px solid ${stage.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? `0 0 8px ${stage.color}18` : 'none' }}>
            <Icon size={12} color={isActive ? stage.color : isPending ? stage.color : 'rgba(255,255,255,0.3)'} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {isActive && <LiveDot color={stage.color} size={5} gap={2} />}
            <span style={{ ...chip(sc.color, 7) }}>{sc.label}</span>
          </div>
        </div>

        {/* Label */}
        <div>
          <p style={{ margin: 0, ...mono, fontSize: 7, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1, marginBottom: 3 }}>{stage.label}</p>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 900, color: isActive ? stage.color : isPending ? stage.color : 'rgba(255,255,255,0.5)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>{stage.amount}</p>
          <p style={{ margin: '3px 0 0', fontSize: 8.5, color: 'rgba(255,255,255,0.28)', lineHeight: 1.3 }}>{stage.amountNote}</p>
        </div>

        {/* Next unlock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={8} color="rgba(255,255,255,0.2)" />
          <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>{stage.nextUnlock}</span>
        </div>

        {/* Outcome */}
        <p style={{ margin: 0, fontSize: 8.5, color: isActive ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)', lineHeight: 1.5, flex: 1 }}>
          {stage.outcome}
        </p>
      </div>

      {/* CTA */}
      {stage.ctaLabel && isActive && stage.ctaIcon && (
        <div style={{ padding: '10px 13px', borderTop: `1px solid ${stage.color}18` }}>
          <HoverBtn label={stage.ctaLabel} color={stage.ctaColor!} icon={stage.ctaIcon} sm />
        </div>
      )}
      {stage.state === 'locked' && (
        <div style={{ padding: '9px 13px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ ...mono, fontSize: 7.5, color: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Lock size={7} color="rgba(255,255,255,0.15)" />
            Unlock: {stage.nextUnlock}
          </span>
        </div>
      )}
    </div>
  );
}

function GlowCard({ children, color, style }: { children: React.ReactNode; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: `${color}07`, border: `1px solid ${color}22`, borderRadius: 14, padding: '16px 18px',
      boxShadow: `0 0 20px ${color}0A, inset 0 1px 0 ${color}15`, position: 'relative', overflow: 'hidden', ...style,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      {children}
    </div>
  );
}

function TxRow({ tx }: { tx: WalletTx }) {
  const isCredit = tx.amount.startsWith('+');
  const stateColor = tx.state === 'settled' ? 'rgba(255,255,255,0.2)' : tx.state === 'sent' ? '#06B6D4' : '#F59E0B';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: isCredit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)', border: `1px solid ${isCredit ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isCredit ? <ArrowDownLeft size={10} color="#10B981" /> : <ArrowUpRight size={10} color="#EF4444" />}
        </div>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{tx.label}</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: isCredit ? '#10B981' : '#EF4444', ...mono }}>{tx.amount}</span>
      <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{tx.date}</span>
      <span style={{ ...chip(stateColor), fontSize: 7 }}>{tx.state}</span>
    </div>
  );
}

export function WalletSafe() {
  const [showTx, setShowTx] = useState(false);
  const wsc = STATUS_COPY[WALLET.status];
  const achConnected = ACH_DEST.status === 'connected';
  const achPending = ACH_DEST.status === 'pending';
  const achMissing = ACH_DEST.status === 'not_connected';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{`
        @keyframes ws-flow  { 0%{left:-45%} 100%{left:145%} }
        @keyframes ws-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes ws-enter { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* ACH destination warnings */}
      {achMissing && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={13} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 2px 0', fontSize: 12, fontWeight: 700, color: 'rgba(239,68,68,0.9)' }}>No verified payout bank account on file</p>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
              Payouts and ACH disbursements cannot be initiated until a verified bank account is connected.
            </p>
          </div>
          <button style={{ flexShrink: 0, fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '5px 10px', borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#EF4444', cursor: 'pointer' }}>
            CONNECT BANK
          </button>
        </div>
      )}
      {achPending && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 12, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Clock size={12} color="#F59E0B" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(245,158,11,0.8)', flex: 1 }}>Bank account pending verification — payouts held until complete.</p>
          <button style={{ flexShrink: 0, fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '5px 10px', borderRadius: 7, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.28)', color: '#F59E0B', cursor: 'pointer' }}>VERIFY</button>
        </div>
      )}

      {/* ─── CAPITAL ENGINE CHAIN ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(245,158,11,0.04) 50%, rgba(168,85,247,0.03) 100%)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '20px 20px 18px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Top shimmer */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.5) 20%, rgba(16,185,129,0.4) 40%, rgba(245,158,11,0.4) 70%, rgba(168,85,247,0.3) 90%, transparent 100%)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16,185,129,0.1)' }}>
              <Activity size={13} color="#10B981" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Capital Engine</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <LiveDot color="#10B981" size={5} gap={2} />
                  <span style={{ ...mono, fontSize: 7, color: '#10B981', fontWeight: 700 }}>Active</span>
                </div>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
                Streaming Receivable → Safe → Advance → Campaign → Lift
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {achConnected
              ? <HoverBtn label="Start Payout" color="#10B981" icon={Send} sm />
              : <div style={{ opacity: 0.35, cursor: 'not-allowed' }}><HoverBtn label="Start Payout" color="#6B7280" icon={Send} sm /></div>
            }
            <HoverBtn label="Activate Advance" color="#F59E0B" icon={Zap} sm />
          </div>
        </div>

        {/* Chain */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto' }}>
          {CAPITAL_CHAIN.map((stage, i) => {
            const isActive = stage.state === 'live' || stage.state === 'ready';
            const nextStage = CAPITAL_CHAIN[i + 1];
            const arrowActive = isActive && nextStage && (nextStage.state === 'live' || nextStage.state === 'ready');
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'stretch', flex: i < CAPITAL_CHAIN.length - 1 ? '1 1 0' : '1 1 0' }}>
                <CapitalStageCard stage={stage} isLast={i === CAPITAL_CHAIN.length - 1} />
                {i < CAPITAL_CHAIN.length - 1 && (
                  <PipeConnector active={!!arrowActive} color={stage.color} />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottleneck callout */}
        <div style={{ marginTop: 14, padding: '11px 16px', borderRadius: 11, background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Zap size={12} color="#F59E0B" />
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>$3,500 advance ready to deploy — blocking release-week paid media</span>
              <p style={{ margin: '2px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>
                Activating now unlocks campaign deployment and projects +25–40% streams · estimated recoup: Apr 30 – May 14
              </p>
            </div>
          </div>
          <HoverBtn label="Deploy Advance" color="#F59E0B" icon={ArrowUpRight} sm />
        </div>
      </div>

      {/* ─── VAULT HEADER + BALANCES ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(16,185,129,0.05) 60%, rgba(6,182,212,0.03) 100%)',
        border: '1px solid rgba(245,158,11,0.22)', borderRadius: 18, padding: '20px 24px',
        boxShadow: '0 0 0 1px rgba(245,158,11,0.05), 0 8px 32px rgba(245,158,11,0.05)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.6) 40%, rgba(16,185,129,0.4) 70%, transparent 100%)' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(245,158,11,0.1)' }}>
              <Shield size={19} color="#F59E0B" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <Lock size={8} color="rgba(245,158,11,0.55)" />
                <span style={{ ...mono, fontSize: 7.5, color: 'rgba(245,158,11,0.55)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Artist Funding Safe</span>
                <span style={{ ...chip(wsc.color), fontSize: 7 }}>{wsc.label}</span>
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Campaign Wallet</h3>
              <p style={{ margin: '3px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.32)' }}>
                AI accounting · ACH automated · {achConnected ? `Linked: ${WALLET.linked}` : 'No payout bank linked'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {achConnected
              ? <HoverBtn label="Start Payout" color="#10B981" icon={Send} sm />
              : <div style={{ opacity: 0.35, cursor: 'not-allowed' }}><HoverBtn label="Start Payout" color="#6B7280" icon={Send} sm /></div>
            }
            <HoverBtn label="Request Advance" color="#F59E0B" icon={CreditCard} sm />
            <HoverBtn label="Open Wallet" color="#06B6D4" icon={Shield} sm />
          </div>
        </div>

        {/* Balance cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 11, marginBottom: 12 }}>
          <GlowCard color="#10B981">
            <div style={{ ...mono, fontSize: 6.5, color: 'rgba(16,185,129,0.5)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }}>Available Campaign Funds</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#10B981', lineHeight: 1, marginBottom: 5, letterSpacing: '-0.03em' }}>{WALLET.available}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <LiveDot color="#10B981" size={5} />
              <span style={{ fontSize: 8.5, color: 'rgba(16,185,129,0.55)' }}>Ready for immediate activation</span>
            </div>
          </GlowCard>

          <GlowCard color="#06B6D4">
            <div style={{ ...mono, fontSize: 6.5, color: 'rgba(6,182,212,0.5)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }}>ACH In Progress</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#06B6D4', lineHeight: 1, marginBottom: 5, letterSpacing: '-0.03em' }}>{WALLET.achInProgress}</div>
            <div style={{ ...mono, fontSize: 8.5, color: 'rgba(255,255,255,0.28)' }}>Sent {WALLET.lastPayout} · Settling</div>
          </GlowCard>

          <GlowCard color="#F59E0B">
            <div style={{ ...mono, fontSize: 6.5, color: 'rgba(245,158,11,0.5)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 7 }}>Next Streaming Payout</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#F59E0B', lineHeight: 1, marginBottom: 5, letterSpacing: '-0.03em' }}>{WALLET.nextPayoutEst}</div>
            <div style={{ fontSize: 8.5, color: 'rgba(245,158,11,0.5)' }}>Est. {WALLET.nextPayout} · Advance eligible</div>
          </GlowCard>
        </div>

        {/* Payout flow mini-pipeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '11px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 11, border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', overflowX: 'auto' }}>
          {[
            { label: 'Streams', value: '~42K/mo',   color: '#06B6D4', icon: Radio     },
            { label: 'Receivable', value: '$5K est', color: '#10B981', icon: TrendingUp },
            { label: 'Safe',    value: '$8,420',     color: '#10B981', icon: Shield    },
            { label: 'Advance', value: '$3,500',     color: '#F59E0B', icon: Zap       },
            { label: 'Media',   value: 'Deployable', color: '#EF4444', icon: ArrowUpRight },
            { label: 'Lift',    value: '+25–40%',    color: '#A855F7', icon: BarChart2  },
          ].map((node, i, arr) => (
            <div key={node.label} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 6px' }}>
                <node.icon size={9} color={node.color} />
                <span style={{ ...mono, fontSize: 9, fontWeight: 800, color: node.color }}>{node.value}</span>
                <span style={{ ...mono, fontSize: 6.5, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{node.label}</span>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight size={8} color="rgba(255,255,255,0.12)" style={{ flexShrink: 0, margin: '0 2px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ACH destination row */}
        {achConnected && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11, padding: '9px 12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.13)', borderRadius: 10 }}>
            <Building2 size={11} color="#10B981" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <span style={{ ...mono, fontSize: 8, color: 'rgba(16,185,129,0.7)', letterSpacing: '0.04em' }}>ACH Connected</span>
              <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.42)' }}>
                {ACH_DEST.institution} · {ACH_DEST.accountType} &bull;&bull;&bull;&bull; {ACH_DEST.last4}
              </span>
            </div>
            {ACH_DEST.verified && <ShieldCheck size={10} color="rgba(16,185,129,0.55)" />}
          </div>
        )}
        {achPending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11, padding: '9px 12px', background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.16)', borderRadius: 10 }}>
            <Clock size={11} color="#F59E0B" />
            <span style={{ ...mono, fontSize: 8, color: 'rgba(245,158,11,0.75)', flex: 1 }}>Pending Verification · Payouts held</span>
            <button style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#F59E0B', cursor: 'pointer' }}>VERIFY</button>
          </div>
        )}
        {achMissing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 11, padding: '9px 12px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10 }}>
            <AlertCircle size={11} color="#EF4444" />
            <span style={{ ...mono, fontSize: 8, color: 'rgba(239,68,68,0.75)', flex: 1 }}>No Bank Account On File · Payouts blocked</span>
            <button style={{ fontSize: 8, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', cursor: 'pointer' }}>CONNECT</button>
          </div>
        )}
      </div>

      {/* ─── ADVANCE ACTION CARD ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(239,68,68,0.04) 100%)',
        border: '1px solid rgba(245,158,11,0.22)', borderRadius: 14, padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(245,158,11,0.1)' }}>
            <Flame size={16} color="#F59E0B" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff' }}>$3,500 advance is sitting idle</span>
              <span style={{ ...mono, fontSize: 7, padding: '2px 6px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', color: '#EF4444', fontWeight: 900 }}>BLOCKING CAMPAIGN</span>
            </div>
            <p style={{ margin: 0, fontSize: 9.5, color: 'rgba(255,255,255,0.42)', lineHeight: 1.6, maxWidth: 500 }}>
              Deploy against release-week paid media — Meta + TikTok ads, creator activation, and paid placements. Projects +25–40% streams. Recoup estimated Apr 30 – May 14.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <HoverBtn label="Use Advance for Campaign" color="#F59E0B" icon={ArrowUpRight} sm />
          <HoverBtn label="View Recoup Schedule" color="#10B981" icon={RefreshCw} sm />
        </div>
      </div>

      {/* ─── TRANSACTION STRIP ─── */}
      <div style={{ background: '#0A0B0D', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div
          style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={() => setShowTx(v => !v)}
        >
          <span style={{ ...mono, fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Recent Transactions</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>{WALLET_TXS.length} entries</span>
            <ChevronDown size={11} color="rgba(255,255,255,0.25)" style={{ transform: showTx ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </div>
        </div>
        {showTx && (
          <div style={{ padding: '0 16px 12px', animation: 'cos-slide 0.2s ease' }}>
            {WALLET_TXS.map(tx => <TxRow key={tx.id} tx={tx} />)}
          </div>
        )}
      </div>
    </div>
  );
}
