import { useState, useEffect, useRef } from 'react';
import { DollarSign, Megaphone, Radio, TrendingUp, RefreshCw, ArrowRight, Zap, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { mono, HoverBtn, LiveDot } from './primitives';

const BOTTLENECK_STAGE = 1;

interface Stage {
  id: number;
  key: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  value: string;
  valueLabel: string;
  current: number;
  max: number;
  unit: string;
  insight: string;
  action?: string;
}

const BASE_STAGES: Stage[] = [
  {
    id: 0,
    key: 'money',
    label: 'Funding',
    sublabel: 'Available capital',
    icon: DollarSign,
    color: '#10B981',
    value: '$8,420',
    valueLabel: 'Wallet balance',
    current: 8420,
    max: 15000,
    unit: '$',
    insight: 'Wallet healthy — streaming receivable arriving Apr 30',
    action: undefined,
  },
  {
    id: 1,
    key: 'campaign',
    label: 'Campaign',
    sublabel: 'Paid spend activated',
    icon: Megaphone,
    color: '#EF4444',
    value: '$0',
    valueLabel: 'Spend activated',
    current: 0,
    max: 5000,
    unit: '$',
    insight: 'You are currently underfunded at the Campaign stage',
    action: 'Increasing spend by $2K unlocks next growth tier',
  },
  {
    id: 2,
    key: 'streams',
    label: 'Streams',
    sublabel: 'Projected 30-day',
    icon: Radio,
    color: '#06B6D4',
    value: '~42K',
    valueLabel: 'Projected streams',
    current: 42,
    max: 100,
    unit: 'K',
    insight: 'Algorithm velocity below release-week target of 80K',
    action: undefined,
  },
  {
    id: 3,
    key: 'revenue',
    label: 'Revenue',
    sublabel: 'Streaming + merch',
    icon: TrendingUp,
    color: '#F59E0B',
    value: '$5,200',
    valueLabel: 'Est. return (30d)',
    current: 5200,
    max: 18000,
    unit: '$',
    insight: 'Unlocking campaign spend projects $12K–$18K return',
    action: undefined,
  },
  {
    id: 4,
    key: 'reinvest',
    label: 'Reinvest',
    sublabel: 'Next cycle capital',
    icon: RefreshCw,
    color: '#A855F7',
    value: '$2,100',
    valueLabel: 'Reinvestable surplus',
    current: 2100,
    max: 8000,
    unit: '$',
    insight: 'Flywheel grows with each funded cycle',
    action: undefined,
  },
];

const SPEND_SCENARIOS = [
  { spend: 0,    streams: 42,  revenue: 5200,  reinvest: 2100,  tier: 'No Campaign',    tierColor: '#EF4444' },
  { spend: 1000, streams: 55,  revenue: 7400,  reinvest: 3800,  tier: 'Starter',        tierColor: '#F59E0B' },
  { spend: 2000, streams: 68,  revenue: 10200, reinvest: 5600,  tier: 'Growth Unlocked', tierColor: '#06B6D4' },
  { spend: 3500, streams: 82,  revenue: 14500, reinvest: 8200,  tier: 'Full Velocity',  tierColor: '#10B981' },
  { spend: 5000, streams: 100, revenue: 18000, reinvest: 11000, tier: 'Max Flywheel',   tierColor: '#A855F7' },
];

function FlywheelArrow({ active, color, bottleneck }: { active: boolean; color: string; bottleneck: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative', width: 40 }}>
      <div style={{
        height: 2, flex: 1,
        background: bottleneck
          ? 'rgba(239,68,68,0.35)'
          : active ? `linear-gradient(90deg, ${color}60, ${color}20)` : 'rgba(255,255,255,0.07)',
        transition: 'all 0.5s ease',
        position: 'relative', overflow: 'hidden',
      }}>
        {active && !bottleneck && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '40%', height: '100%',
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            animation: 'fg-flow 1.4s linear infinite',
          }} />
        )}
        {bottleneck && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '60%', height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.8), transparent)',
            animation: 'fg-block 1.2s ease-in-out infinite',
          }} />
        )}
      </div>
      <ArrowRight size={10} color={bottleneck ? '#EF4444' : active ? color : 'rgba(255,255,255,0.15)'} style={{ flexShrink: 0, marginLeft: -2 }} />
    </div>
  );
}

function StageNode({ stage, isBottleneck, isActive, spendIdx }: { stage: Stage; isBottleneck: boolean; isActive: boolean; spendIdx: number }) {
  const scenario = SPEND_SCENARIOS[spendIdx];
  const Icon = stage.icon;

  let displayValue = stage.value;
  let displayCurrent = stage.current;

  if (stage.key === 'campaign') {
    displayValue = `$${scenario.spend.toLocaleString()}`;
    displayCurrent = (scenario.spend / 5000) * 100;
  } else if (stage.key === 'streams') {
    displayValue = `~${scenario.streams}K`;
    displayCurrent = scenario.streams;
  } else if (stage.key === 'revenue') {
    displayValue = `$${(scenario.revenue / 1000).toFixed(1)}K`;
    displayCurrent = (scenario.revenue / 18000) * 100;
  } else if (stage.key === 'reinvest') {
    displayValue = `$${(scenario.reinvest / 1000).toFixed(1)}K`;
    displayCurrent = (scenario.reinvest / 11000) * 100;
  }

  const pct = stage.key === 'streams'
    ? (displayCurrent / 100) * 100
    : stage.key === 'campaign'
    ? (scenario.spend / 5000) * 100
    : (displayCurrent / stage.max) * 100;

  return (
    <div style={{
      position: 'relative', borderRadius: 14, overflow: 'hidden',
      background: isBottleneck ? 'rgba(239,68,68,0.07)' : isActive ? `${stage.color}08` : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isBottleneck ? 'rgba(239,68,68,0.35)' : isActive ? stage.color + '30' : 'rgba(255,255,255,0.07)'}`,
      padding: '14px 14px 12px',
      minWidth: 120,
      transition: 'all 0.4s ease',
      boxShadow: isBottleneck ? '0 0 20px rgba(239,68,68,0.12)' : isActive ? `0 0 16px ${stage.color}12` : 'none',
      animation: isBottleneck ? 'fg-bottle 2.5s ease-in-out infinite' : 'none',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${isBottleneck ? '#EF4444' : stage.color}50, transparent)` }} />

      {isBottleneck && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <AlertTriangle size={9} color="#EF4444" />
        </div>
      )}

      {isActive && !isBottleneck && (
        <div style={{ position: 'absolute', top: 9, right: 9 }}>
          <LiveDot color={stage.color} size={5} gap={2} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: isBottleneck ? 'rgba(239,68,68,0.12)' : `${stage.color}12`,
          border: `1px solid ${isBottleneck ? 'rgba(239,68,68,0.30)' : stage.color + '28'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={13} color={isBottleneck ? '#EF4444' : stage.color} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1, marginBottom: 4 }}>{stage.label}</p>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: isBottleneck ? '#EF4444' : stage.color, lineHeight: 1, marginBottom: 2 }}>{displayValue}</p>
          <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.25)', lineHeight: 1 }}>{stage.sublabel}</p>
        </div>

        {/* Fill bar */}
        <div style={{ width: '100%', height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, Math.max(0, pct))}%`,
            borderRadius: 99,
            background: isBottleneck ? '#EF4444' : stage.color,
            boxShadow: `0 0 6px ${isBottleneck ? '#EF4444' : stage.color}60`,
            transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          }} />
        </div>
      </div>
    </div>
  );
}

export function FundingGrowth() {
  const [spendIdx, setSpendIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const prevIdx = useRef(0);

  const scenario = SPEND_SCENARIOS[spendIdx];
  const isBottleneck = (stageId: number) => spendIdx === 0 && stageId === BOTTLENECK_STAGE;
  const isActive = (stageId: number) => spendIdx > 0 && stageId <= (spendIdx + 1);

  function changeSpend(delta: number) {
    const next = Math.max(0, Math.min(SPEND_SCENARIOS.length - 1, spendIdx + delta));
    if (next === spendIdx) return;
    prevIdx.current = spendIdx;
    setAnimating(true);
    setSpendIdx(next);
    setTimeout(() => setAnimating(false), 600);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <style>{`
        @keyframes fg-flow  { 0%{left:-40%} 100%{left:140%} }
        @keyframes fg-block { 0%,100%{opacity:0.3;left:-40%} 50%{opacity:1;left:30%} }
        @keyframes fg-bottle { 0%,100%{box-shadow:0 0 20px rgba(239,68,68,0.12)} 50%{box-shadow:0 0 28px rgba(239,68,68,0.22)} }
        @keyframes fg-tier-in { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Flywheel header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <RefreshCw size={11} color="#10B981" />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Growth Flywheel — Money → Campaign → Streams → Revenue → Reinvest
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, background: `${scenario.tierColor}12`, border: `1px solid ${scenario.tierColor}30`, animation: 'fg-tier-in 0.3s ease' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: scenario.tierColor, boxShadow: `0 0 6px ${scenario.tierColor}` }} />
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: scenario.tierColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{scenario.tier}</span>
        </div>
      </div>

      {/* Main flywheel */}
      <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'nowrap', overflowX: 'auto' }}>
          {BASE_STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <StageNode
                stage={stage}
                isBottleneck={isBottleneck(stage.id)}
                isActive={isActive(stage.id)}
                spendIdx={spendIdx}
              />
              {i < BASE_STAGES.length - 1 && (
                <FlywheelArrow
                  active={isActive(stage.id) && isActive(stage.id + 1)}
                  color={stage.color}
                  bottleneck={isBottleneck(stage.id)}
                />
              )}
            </div>
          ))}
        </div>

        {/* Return arrow indicating loop */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, opacity: spendIdx > 0 ? 1 : 0.2, transition: 'opacity 0.5s ease' }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(160,85,247,0.3), rgba(16,185,129,0.3), transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 20, background: 'rgba(160,85,247,0.06)', border: '1px solid rgba(160,85,247,0.15)' }}>
            <RefreshCw size={8} color="rgba(160,85,247,0.7)" style={{ animation: spendIdx > 0 ? 'fg-spin 3s linear infinite' : 'none' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(160,85,247,0.7)' }}>reinvestment loop active</span>
          </div>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.3), rgba(160,85,247,0.3), transparent)' }} />
        </div>
      </div>

      {/* Dynamic insight banner */}
      <div style={{
        padding: '14px 18px', borderRadius: 12,
        background: spendIdx === 0 ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.05)',
        border: `1px solid ${spendIdx === 0 ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.20)'}`,
        transition: 'all 0.4s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0, marginTop: 1 }}>
            {spendIdx === 0
              ? <AlertTriangle size={14} color="#EF4444" />
              : <Zap size={14} color="#10B981" />
            }
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 800, color: spendIdx === 0 ? '#EF4444' : '#fff', lineHeight: 1.3 }}>
              {spendIdx === 0
                ? 'You are currently underfunded at the Campaign stage'
                : `${scenario.tier} — flywheel spinning at ${Math.round((spendIdx / (SPEND_SCENARIOS.length - 1)) * 100)}% capacity`
              }
            </p>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
              {spendIdx === 0
                ? `Increasing spend by $2K unlocks next growth tier — projected streams jump from 42K to 68K (+62%) and revenue from $5.2K to $10.2K (+96%)`
                : spendIdx < SPEND_SCENARIOS.length - 1
                  ? `At $${scenario.spend.toLocaleString()} spend: ~${scenario.streams}K streams projected · $${(scenario.revenue / 1000).toFixed(1)}K revenue · $${(scenario.reinvest / 1000).toFixed(1)}K reinvestable — increase spend further to unlock next tier`
                  : `Maximum flywheel capacity reached — $${scenario.spend.toLocaleString()} spend projecting ${scenario.streams}K streams and $${(scenario.revenue / 1000).toFixed(0)}K revenue`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Spend control */}
      <div style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ margin: '0 0 2px', fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Campaign Spend Simulator</p>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#fff' }}>
              Adjust spend to see flywheel impact
            </p>
          </div>

          {/* Step controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => changeSpend(-1)}
              disabled={spendIdx === 0}
              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: spendIdx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: spendIdx === 0 ? 0.3 : 1, transition: 'all 0.15s' }}
            >
              <ChevronDown size={13} color="#fff" />
            </button>

            <div style={{ textAlign: 'center', minWidth: 90 }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: scenario.tierColor, lineHeight: 1, transition: 'color 0.3s ease' }}>
                ${scenario.spend.toLocaleString()}
              </p>
              <p style={{ margin: '2px 0 0', fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>campaign spend</p>
            </div>

            <button
              onClick={() => changeSpend(1)}
              disabled={spendIdx === SPEND_SCENARIOS.length - 1}
              style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', cursor: spendIdx === SPEND_SCENARIOS.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: spendIdx === SPEND_SCENARIOS.length - 1 ? 0.3 : 1, transition: 'all 0.15s' }}
            >
              <ChevronUp size={13} color="#fff" />
            </button>
          </div>

          {/* Scenario pills */}
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {SPEND_SCENARIOS.map((s, i) => (
              <button
                key={i}
                onClick={() => { prevIdx.current = spendIdx; setAnimating(true); setSpendIdx(i); setTimeout(() => setAnimating(false), 600); }}
                style={{
                  padding: '5px 10px', borderRadius: 20, cursor: 'pointer', fontFamily: 'monospace',
                  fontSize: 8, fontWeight: 700, transition: 'all 0.2s ease',
                  background: i === spendIdx ? `${s.tierColor}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === spendIdx ? s.tierColor + '40' : 'rgba(255,255,255,0.07)'}`,
                  color: i === spendIdx ? s.tierColor : 'rgba(255,255,255,0.3)',
                }}
              >
                ${s.spend === 0 ? '0' : (s.spend / 1000).toFixed(s.spend % 1000 === 0 ? 0 : 1) + 'K'}
              </button>
            ))}
          </div>
        </div>

        {/* Outcome row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          {[
            { label: 'Projected Streams', value: `~${scenario.streams}K`, color: '#06B6D4', prev: SPEND_SCENARIOS[Math.max(0, spendIdx - 1)].streams },
            { label: 'Est. Revenue (30d)', value: `$${(scenario.revenue / 1000).toFixed(1)}K`, color: '#F59E0B', prev: SPEND_SCENARIOS[Math.max(0, spendIdx - 1)].revenue / 1000 },
            { label: 'Reinvestable',       value: `$${(scenario.reinvest / 1000).toFixed(1)}K`, color: '#A855F7', prev: SPEND_SCENARIOS[Math.max(0, spendIdx - 1)].reinvest / 1000 },
          ].map((m, i) => {
            const isGain = spendIdx > prevIdx.current;
            return (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: `${m.color}07`, border: `1px solid ${m.color}18`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'monospace', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', lineHeight: 1, marginBottom: 4 }}>{m.label}</p>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: m.color, lineHeight: 1, transition: 'all 0.4s ease' }}>{m.value}</p>
                </div>
                {spendIdx > 0 && animating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 6px', borderRadius: 6, background: isGain ? 'rgba(16,185,129,0.10)' : 'rgba(239,68,68,0.10)', border: `1px solid ${isGain ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    <TrendingUp size={8} color={isGain ? '#10B981' : '#EF4444'} />
                    <span style={{ fontFamily: 'monospace', fontSize: 7.5, color: isGain ? '#10B981' : '#EF4444' }}>{isGain ? '+' : ''}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#fff' }}>Ready to activate the flywheel?</p>
          <p style={{ margin: '2px 0 0', fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>GMG advances campaign spend against your streaming receivables · auto-recouped at payout</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <HoverBtn label="Activate $3,500 Advance" color="#F59E0B" icon={Zap} sm />
          <HoverBtn label="View Recoup Schedule" color="#10B981" icon={TrendingUp} sm />
        </div>
      </div>
    </div>
  );
}
