import { useEffect, useState } from 'react';
import { Radio, Disc, Shield, TrendingUp } from 'lucide-react';
import { mono, LiveDot, ScoreRing, chip, ProgressBar } from './primitives';

interface ReleaseData {
  title: string; artist: string; label: string; daysUntil: number;
  stage: string; healthScore: number; readinessScore: number;
  momentumScore: number; releaseDate: string;
}

const CONFIDENCE_BREAKDOWN = [
  { label: 'Setup Completeness', score: 72, color: '#F59E0B' },
  { label: 'Market Signals',     score: 84, color: '#10B981' },
  { label: 'Content Performance', score: 76, color: '#06B6D4' },
  { label: 'Funding Readiness',  score: 91, color: '#10B981' },
];

const CAMPAIGN_CONFIDENCE = 78;

function ConfidenceScore() {
  const [show, setShow] = useState(false);
  const color = CAMPAIGN_CONFIDENCE >= 80 ? '#10B981' : CAMPAIGN_CONFIDENCE >= 65 ? '#F59E0B' : '#EF4444';
  const r = 26, circ = 2 * Math.PI * r;
  const offset = circ - (CAMPAIGN_CONFIDENCE / 100) * circ;

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 13, background: `${color}08`, border: `1px solid ${color}22`, cursor: 'pointer', userSelect: 'none' as const }}
        onClick={() => setShow(v => !v)}
      >
        <svg width={60} height={60} viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={30} cy={30} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
          <circle cx={30} cy={30} r={r} fill="none" stroke={color} strokeWidth={4}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
          <text x={30} y={30} textAnchor="middle" dominantBaseline="central" fill={color}
            style={{ fontSize: 14, fontWeight: 900, fontFamily: 'monospace', transform: 'rotate(90deg)', transformOrigin: '30px 30px' }}>
            {CAMPAIGN_CONFIDENCE}
          </text>
        </svg>
        <div>
          <div style={{ ...mono, fontSize: 7, color: `${color}66`, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 3 }}>Campaign Confidence</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
            {CAMPAIGN_CONFIDENCE >= 80 ? 'Strong trajectory' : CAMPAIGN_CONFIDENCE >= 65 ? 'On track — gaps remain' : 'Needs attention'}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Likelihood to outperform baseline</div>
        </div>
        <TrendingUp size={12} color={color} />
      </div>
      {show && (
        <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 10, background: '#111318', border: `1px solid ${color}22`, borderRadius: 14, padding: '14px 16px', width: 240, boxShadow: '0 12px 40px rgba(0,0,0,0.5)', animation: 'cos-slide 0.2s ease' }}>
          <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 12 }}>Confidence Breakdown</div>
          {CONFIDENCE_BREAKDOWN.map(b => (
            <div key={b.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{b.label}</span>
                <span style={{ ...mono, fontSize: 9, fontWeight: 800, color: b.color }}>{b.score}</span>
              </div>
              <ProgressBar pct={b.score} color={b.color} height={3} />
            </div>
          ))}
          <div style={{ marginTop: 8, padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
            <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
              Closing Apple Music + Creator gaps would lift confidence to ~91%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function CampaignHero({ data, tickerMessages }: { data: ReleaseData; tickerMessages: string[] }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 4500);
    return () => clearInterval(t);
  }, []);

  const healthColor = data.healthScore >= 80 ? '#10B981' : data.healthScore >= 60 ? '#F59E0B' : '#EF4444';
  const readColor   = data.readinessScore >= 80 ? '#10B981' : data.readinessScore >= 60 ? '#F59E0B' : '#EF4444';
  const momColor    = data.momentumScore >= 80 ? '#10B981' : data.momentumScore >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(6,182,212,0.04) 50%, rgba(239,68,68,0.04) 100%)',
      border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: 22, padding: '24px 28px 20px',
      boxShadow: '0 0 0 1px rgba(16,185,129,0.05), 0 12px 40px rgba(0,0,0,0.3)',
      position: 'relative', overflow: 'visible', marginBottom: 24,
    }}>
      {/* Top shimmer edge */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderRadius: '22px 22px 0 0', background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.5) 30%, rgba(6,182,212,0.4) 70%, transparent 100%)' }} />

      {/* System badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
        <LiveDot color="#10B981" size={7} gap={4} />
        <span style={{ ...mono, fontSize: 8, fontWeight: 900, color: '#10B981', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>Release OS · System Active</span>
        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em' }}>{data.label} / {data.artist}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 20 }}>
        {/* Left: release identity */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 10 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 22px rgba(239,68,68,0.1)' }}>
              <Disc size={22} color="#EF4444" />
            </div>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1 }}>{data.title}</h1>
              <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{data.artist}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <span style={{ ...chip('#EF4444') }}>{data.stage}</span>
            <span style={{ ...chip('#06B6D4'), fontSize: 9 }}>Release: {data.releaseDate}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              <LiveDot color="#EF4444" size={5} />
              <span style={{ ...mono, fontSize: 8, fontWeight: 900, color: '#EF4444' }}>{data.daysUntil} DAYS OUT</span>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, maxWidth: 520 }}>
            8-week release architecture active &nbsp;·&nbsp; live campaign adaptation enabled &nbsp;·&nbsp; funding ready
          </p>
        </div>

        {/* Right: scores */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'flex-end' }}>
            <ScoreRing value={data.healthScore}    color={healthColor} label="Health"    size={60} />
            <ScoreRing value={data.readinessScore} color={readColor}   label="Readiness" size={60} />
            <ScoreRing value={data.momentumScore}  color={momColor}    label="Momentum"  size={60} />
            <ConfidenceScore />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
            <Shield size={11} color="#F59E0B" />
            <span style={{ ...mono, fontSize: 8, fontWeight: 800, color: '#F59E0B', letterSpacing: '0.06em' }}>WALLET: $8,420 READY</span>
            <span style={{ width: 1, height: 9, background: 'rgba(245,158,11,0.2)' }} />
            <span style={{ ...mono, fontSize: 7, color: 'rgba(245,158,11,0.55)' }}>Advance Eligible</span>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <Radio size={10} color="#10B981" />
        <span style={{ ...mono, fontSize: 8, color: '#10B981', fontWeight: 900, letterSpacing: '0.1em', flexShrink: 0 }}>LIVE</span>
        <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
        <span key={tick} style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', animation: 'cos-slide 0.4s ease' }}>
          {tickerMessages[tick % tickerMessages.length]}
        </span>
      </div>
    </div>
  );
}
