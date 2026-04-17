import { useState } from 'react';

export const mono: React.CSSProperties = { fontFamily: 'monospace' };

export function chip(color: string, size = 9): React.CSSProperties {
  return { ...mono, fontSize: size, padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase' as const, letterSpacing: '0.07em', color, background: `${color}14`, border: `1px solid ${color}30` };
}

export function LiveDot({ color, size = 7, gap = 3 }: { color: string; size?: number; gap?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
      <div style={{ position: 'absolute', inset: -gap, borderRadius: '50%', border: `1px solid ${color}55`, animation: 'cos-pulse 2s ease-in-out infinite' }} />
    </div>
  );
}

export function ScoreRing({ value, color, size = 56, label }: { value: number; color: string; size?: number; label: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}80)` }} />
        <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill="#fff"
          style={{ fontSize: 13, fontWeight: 900, fontFamily: 'monospace', transform: 'rotate(90deg)', transformOrigin: `${size / 2}px ${size / 2}px` }}>
          {value}
        </text>
      </svg>
      <span style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

export function ProgressBar({ pct, color, height = 3 }: { pct: number; color: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, boxShadow: `0 0 6px ${color}60`, transition: 'width 0.4s ease' }} />
    </div>
  );
}

export function SectionHead({
  title, sub, icon: Icon, color, right,
}: {
  title: string; sub: string; icon: React.ElementType; color: string; right?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: `${color}12`, border: `1px solid ${color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 12px ${color}10` }}>
          <Icon size={14} color={color} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1 }}>{title}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
        </div>
      </div>
      {right}
    </div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '32px 0' }} />;
}

export function HoverBtn({
  label, color, icon: Icon, sm, onClick,
}: {
  label: string; color: string; icon?: React.ElementType; sm?: boolean; onClick?: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: sm ? 10 : 11, padding: sm ? '6px 12px' : '8px 16px',
        borderRadius: sm ? 8 : 10, cursor: 'pointer', fontWeight: 700,
        background: hov ? `${color}1E` : `${color}0E`,
        border: `1px solid ${hov ? color + '50' : color + '28'}`,
        color, transition: 'all 0.15s',
        boxShadow: hov ? `0 0 14px ${color}20` : 'none',
      }}
    >
      {Icon && <Icon size={sm ? 10 : 12} />}
      {label}
    </button>
  );
}

export const CSS_ANIMATIONS = `
@keyframes cos-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0;transform:scale(1.9)} }
@keyframes cos-spin  { to{transform:rotate(360deg)} }
@keyframes cos-slide { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
@keyframes cos-glow  { 0%,100%{opacity:0.6} 50%{opacity:1} }
@keyframes cos-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
`;
