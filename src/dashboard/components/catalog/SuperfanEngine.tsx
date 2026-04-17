import { useState } from 'react';
import { Zap, Layers, Gift, Clock } from 'lucide-react';

type NodeStatus = 'Operational' | 'Configuring' | 'Standby';

interface EngineNode {
  id: string;
  title: string;
  description: string;
  status: NodeStatus;
  icon: React.ElementType;
  accentColor: string;
  sequence: number;
}

const NODES: EngineNode[] = [
  {
    id: 'exclusive_drops',
    title: 'Exclusive Drops',
    description: 'Limited releases pushed directly to superfans before any public window.',
    status: 'Operational',
    icon: Zap,
    accentColor: '#F59E0B',
    sequence: 1,
  },
  {
    id: 'access_tiers',
    title: 'Access Tiers',
    description: 'Tiered membership system that unlocks content, access, and perks by level.',
    status: 'Configuring',
    icon: Layers,
    accentColor: '#06B6D4',
    sequence: 2,
  },
  {
    id: 'fan_rewards',
    title: 'Fan Rewards',
    description: 'Point-based reward loops that convert engagement into redeemable value.',
    status: 'Standby',
    icon: Gift,
    accentColor: '#10B981',
    sequence: 3,
  },
  {
    id: 'early_releases',
    title: 'Early Releases',
    description: 'Pre-release access windows gated to top-tier fans 24–72 hours ahead of global.',
    status: 'Operational',
    icon: Clock,
    accentColor: '#F97316',
    sequence: 4,
  },
];

const STATUS_META: Record<NodeStatus, { label: string; color: string; pulse: boolean }> = {
  Operational: { label: 'Operational', color: '#10B981', pulse: true },
  Configuring: { label: 'Configuring', color: '#F59E0B', pulse: true },
  Standby:     { label: 'Standby',     color: '#6B7280', pulse: false },
};

function ConnectorLine({ active }: { active: boolean }) {
  return (
    <div className="hidden lg:flex items-center justify-center flex-1 px-1 relative" style={{ minWidth: 24 }}>
      <div
        className="h-[1px] w-full"
        style={{
          background: active
            ? 'linear-gradient(90deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))'
            : 'rgba(255,255,255,0.04)',
        }}
      />
      {active && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full border border-white/10"
          style={{ background: '#1A1D22', right: 0 }}
        />
      )}
    </div>
  );
}

export default function SuperfanEngine() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'rgba(245,158,11,0.45)' }}
        >
          Superfan Engine
        </span>
        <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-1 h-1 rounded-full animate-pulse"
            style={{ background: '#10B981' }}
          />
          <span className="text-[8px] font-mono tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
            SYSTEM ACTIVE
          </span>
        </div>
      </div>

      <div className="relative">
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.025) 0%, transparent 70%)',
          }}
        />

        <div
          className="rounded-2xl border p-5"
          style={{
            background: '#080A0D',
            borderColor: 'rgba(255,255,255,0.05)',
          }}
        >
          <div className="hidden lg:flex items-stretch gap-0 mb-1">
            {NODES.map((node, idx) => (
              <>
                <div
                  key={node.id}
                  className="flex-1 rounded-xl p-4 relative overflow-hidden cursor-default"
                  style={{
                    background: hovered === node.id ? `${node.accentColor}07` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${hovered === node.id ? `${node.accentColor}20` : 'rgba(255,255,255,0.05)'}`,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${node.accentColor}${hovered === node.id ? '30' : '14'}, transparent)`,
                      transition: 'all 0.2s ease',
                    }}
                  />

                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-2 h-2 rounded text-[8px] font-mono flex items-center justify-center"
                      style={{ color: 'rgba(255,255,255,0.15)' }}
                    >
                      {String(node.sequence).padStart(2, '0')}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {STATUS_META[node.status].pulse && (
                        <div
                          className="w-1 h-1 rounded-full animate-pulse"
                          style={{ background: STATUS_META[node.status].color }}
                        />
                      )}
                      <span
                        className="text-[8px] font-mono tracking-[0.08em]"
                        style={{ color: STATUS_META[node.status].color }}
                      >
                        {STATUS_META[node.status].label.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: `${node.accentColor}10`,
                      border: `1px solid ${node.accentColor}18`,
                    }}
                  >
                    <node.icon className="w-4 h-4" style={{ color: node.accentColor }} />
                  </div>

                  <p
                    className="text-[12px] font-semibold mb-1.5 leading-snug"
                    style={{ color: 'rgba(255,255,255,0.75)' }}
                  >
                    {node.title}
                  </p>
                  <p
                    className="text-[10px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {node.description}
                  </p>

                  <div
                    className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
                    style={{
                      background: node.accentColor,
                      opacity: hovered === node.id ? 0.06 : 0.025,
                      filter: 'blur(20px)',
                      transition: 'opacity 0.2s ease',
                    }}
                  />
                </div>
                {idx < NODES.length - 1 && (
                  <ConnectorLine key={`connector-${idx}`} active={hovered === node.id || hovered === NODES[idx + 1].id} />
                )}
              </>
            ))}
          </div>

          <div className="lg:hidden grid sm:grid-cols-2 gap-3">
            {NODES.map(node => (
              <div
                key={node.id}
                className="rounded-xl p-4 relative overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${node.accentColor}18, transparent)`,
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${node.accentColor}10`, border: `1px solid ${node.accentColor}18` }}
                  >
                    <node.icon className="w-3.5 h-3.5" style={{ color: node.accentColor }} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {STATUS_META[node.status].pulse && (
                      <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: STATUS_META[node.status].color }} />
                    )}
                    <span className="text-[8px] font-mono tracking-[0.08em]" style={{ color: STATUS_META[node.status].color }}>
                      {STATUS_META[node.status].label.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {node.title}
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {node.description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-4 pt-3 flex items-center gap-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.12)' }}>
              Pipeline
            </span>
            <div className="flex items-center gap-4 flex-1">
              {NODES.map((node, idx) => (
                <div key={node.id} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: STATUS_META[node.status].color, opacity: node.status === 'Standby' ? 0.4 : 1 }}
                  />
                  <span className="text-[8px] font-mono tracking-[0.08em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {node.title.toUpperCase()}
                  </span>
                  {idx < NODES.length - 1 && (
                    <div className="w-4 h-[1px]" style={{ background: 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
