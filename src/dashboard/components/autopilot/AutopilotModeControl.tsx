import React, { useState } from 'react';
import { Hand, Wand2, Cpu, ChevronDown, ShieldCheck, Zap, Info } from 'lucide-react';
import { useAutopilot } from '../../context/AutopilotContext';
import type { AutopilotMode } from '../../context/AutopilotContext';

interface ModeOption {
  value: AutopilotMode;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  description: string;
  badge?: string;
}

const MODES: ModeOption[] = [
  {
    value: 'manual',
    label: 'Manual',
    sublabel: 'You decide everything',
    icon: Hand,
    color: '#94A3B8',
    bg: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.2)',
    description: 'AI surfaces recommendations only. No actions execute without your direct input.',
  },
  {
    value: 'assisted',
    label: 'Assisted',
    sublabel: 'AI prepares, you approve',
    icon: Wand2,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    description: 'AI queues approved playbooks for your review. One-click execution on pre-staged actions.',
    badge: 'Recommended',
  },
  {
    value: 'autopilot',
    label: 'Autopilot',
    sublabel: 'AI executes on triggers',
    icon: Cpu,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    description: 'Safe, approved playbooks execute automatically when signal triggers are met.',
    badge: 'Live',
  },
];

interface Props {
  variant?: 'full' | 'compact' | 'inline';
}

export default function AutopilotModeControl({ variant = 'full' }: Props) {
  const { mode, setMode } = useAutopilot();
  const [open, setOpen] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<AutopilotMode | null>(null);
  const [confirming, setConfirming] = useState<AutopilotMode | null>(null);

  const currentMeta = MODES.find(m => m.value === mode)!;
  const CurrentIcon = currentMeta.icon;

  const handleSelect = (next: AutopilotMode) => {
    if (next === mode) { setOpen(false); return; }
    if (next === 'autopilot') {
      setConfirming(next);
      return;
    }
    setMode(next);
    setOpen(false);
  };

  const confirmAutopilot = () => {
    if (confirming) setMode(confirming);
    setConfirming(null);
    setOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
        {MODES.map(m => {
          const Icon = m.icon;
          const active = mode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => handleSelect(m.value)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7,
                background: active ? m.bg : 'transparent',
                border: `1px solid ${active ? m.border : 'transparent'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Icon size={10} color={active ? m.color : 'rgba(255,255,255,0.25)'} />
              <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: active ? 800 : 500, color: active ? m.color : 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {m.label}
              </span>
            </button>
          );
        })}
        {confirming && <ConfirmOverlay mode={confirming} onConfirm={confirmAutopilot} onCancel={() => setConfirming(null)} />}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', borderRadius: 8,
            background: currentMeta.bg, border: `1px solid ${currentMeta.border}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <CurrentIcon size={11} color={currentMeta.color} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 800, color: currentMeta.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {currentMeta.label}
          </span>
          <ChevronDown size={9} color={currentMeta.color} style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {open && <ModeDropdown modes={MODES} currentMode={mode} hoveredMode={hoveredMode} setHoveredMode={setHoveredMode} onSelect={handleSelect} onClose={() => setOpen(false)} />}
        {confirming && <ConfirmOverlay mode={confirming} onConfirm={confirmAutopilot} onCancel={() => setConfirming(null)} />}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes ap-ctrl-glow { 0%,100%{box-shadow:0 0 20px rgba(16,185,129,0.15)} 50%{box-shadow:0 0 32px rgba(16,185,129,0.28)} }
        .ap-autopilot-active { animation: ap-ctrl-glow 2.4s ease-in-out infinite; }
      `}</style>

      <div
        className={mode === 'autopilot' ? 'ap-autopilot-active' : ''}
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${currentMeta.border}`,
          borderRadius: 14,
          overflow: 'visible',
          transition: 'border-color 0.3s',
        }}
      >
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={11} color="rgba(255,255,255,0.25)" />
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                System Mode
              </span>
            </div>
            <div style={{ padding: '2px 8px', borderRadius: 5, background: `${currentMeta.color}15`, border: `1px solid ${currentMeta.color}25` }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, color: currentMeta.color, fontWeight: 800, letterSpacing: '0.06em' }}>
                {currentMeta.sublabel}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {MODES.map(m => {
              const Icon = m.icon;
              const active = mode === m.value;
              const hovered = hoveredMode === m.value;
              return (
                <button
                  key={m.value}
                  onClick={() => handleSelect(m.value)}
                  onMouseEnter={() => setHoveredMode(m.value)}
                  onMouseLeave={() => setHoveredMode(null)}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    padding: '10px 8px', borderRadius: 9,
                    background: active ? m.bg : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: `1px solid ${active ? m.border : hovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                    cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                  }}
                >
                  {m.badge && active && (
                    <div style={{ position: 'absolute', top: -6, right: 4, padding: '1px 6px', borderRadius: 4, background: m.color, boxShadow: `0 0 8px ${m.color}60` }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 7, fontWeight: 900, color: '#000', letterSpacing: '0.05em' }}>{m.badge}</span>
                    </div>
                  )}
                  <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${m.color}20` : 'rgba(255,255,255,0.04)', transition: 'all 0.2s' }}>
                    <Icon size={13} color={active ? m.color : hovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'} />
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: active ? 800 : 600, color: active ? m.color : 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          {(hoveredMode || mode) && (
            <div style={{ marginTop: 10, padding: '7px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 7, alignItems: 'flex-start' }}>
              <Info size={10} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                {MODES.find(m => m.value === (hoveredMode ?? mode))?.description}
              </span>
            </div>
          )}
        </div>
      </div>

      {confirming && <ConfirmOverlay mode={confirming} onConfirm={confirmAutopilot} onCancel={() => setConfirming(null)} />}
    </div>
  );
}

function ModeDropdown({ modes, currentMode, hoveredMode, setHoveredMode, onSelect, onClose }: {
  modes: ModeOption[];
  currentMode: AutopilotMode;
  hoveredMode: AutopilotMode | null;
  setHoveredMode: (m: AutopilotMode | null) => void;
  onSelect: (m: AutopilotMode) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={onClose} />
      <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50, width: 260, background: '#111318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>System Mode</span>
        </div>
        {modes.map(m => {
          const Icon = m.icon;
          const active = currentMode === m.value;
          return (
            <button
              key={m.value}
              onClick={() => onSelect(m.value)}
              onMouseEnter={() => setHoveredMode(m.value)}
              onMouseLeave={() => setHoveredMode(null)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: active ? m.bg : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? `${m.color}20` : 'rgba(255,255,255,0.04)', flexShrink: 0 }}>
                <Icon size={13} color={active ? m.color : 'rgba(255,255,255,0.3)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: active ? m.color : 'rgba(255,255,255,0.6)', letterSpacing: '0.03em' }}>{m.label}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{m.sublabel}</div>
              </div>
              {active && <Zap size={10} color={m.color} />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ConfirmOverlay({ mode, onConfirm, onCancel }: { mode: AutopilotMode; onConfirm: () => void; onCancel: () => void }) {
  const meta = MODES.find(m => m.value === mode)!;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#0E1013', border: `1px solid ${meta.border}`, borderRadius: 16, padding: 28, width: 380, boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 40px ${meta.color}20` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Cpu size={16} color={meta.color} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', letterSpacing: '-0.02em' }}>Enable Autopilot?</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>AI will execute approved actions automatically</div>
          </div>
        </div>
        <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
          <ul style={{ margin: 0, padding: '0 0 0 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Only pre-approved playbooks execute', 'All actions are logged and reversible', 'You can disable at any time', 'Safe actions only — no irreversible operations without manual override'].map((line, i) => (
              <li key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{line}</li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '10px 0', borderRadius: 9, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 2, padding: '10px 0', borderRadius: 9, background: meta.bg, border: `1px solid ${meta.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 0 16px ${meta.color}25` }}>
            <Cpu size={13} color={meta.color} />
            <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 800, color: meta.color, letterSpacing: '0.04em' }}>ENABLE AUTOPILOT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
