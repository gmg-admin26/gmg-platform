import { Radio, MessageSquare, Heart, Users, Mail } from 'lucide-react';

type Status = 'Active' | 'Growing' | 'Untapped';

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  status: Status;
  statusColor: string;
  statusBg: string;
  accentColor: string;
  description: string;
}

const PLATFORMS: Platform[] = [
  {
    id: 'instagram',
    name: 'Instagram Broadcast',
    icon: Radio,
    status: 'Active',
    statusColor: '#10B981',
    statusBg: 'rgba(16,185,129,0.08)',
    accentColor: '#F472B6',
    description: 'One-way broadcast channel to opted-in followers. High open rates, direct artist voice.',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: MessageSquare,
    status: 'Growing',
    statusColor: '#F59E0B',
    statusBg: 'rgba(245,158,11,0.08)',
    accentColor: '#818CF8',
    description: 'Community server with channel structure. Superfan engagement hub and early-access drops.',
  },
  {
    id: 'patreon',
    name: 'Patreon',
    icon: Heart,
    status: 'Untapped',
    statusColor: '#6B7280',
    statusBg: 'rgba(107,114,128,0.08)',
    accentColor: '#F97316',
    description: 'Recurring revenue from core fans. Exclusive content tiers with predictable monthly income.',
  },
  {
    id: 'facebook',
    name: 'Facebook Groups',
    icon: Users,
    status: 'Active',
    statusColor: '#10B981',
    statusBg: 'rgba(16,185,129,0.08)',
    accentColor: '#3B82F6',
    description: 'Organic fan community with long-tail engagement. Strong for legacy and crossover audiences.',
  },
  {
    id: 'email_sms',
    name: 'Email / SMS',
    icon: Mail,
    status: 'Growing',
    statusColor: '#F59E0B',
    statusBg: 'rgba(245,158,11,0.08)',
    accentColor: '#06B6D4',
    description: 'Highest-ownership channel. No algorithm dependency. Critical for direct-to-fan monetization.',
  },
];

const STATUS_DOT: Record<Status, string> = {
  Active: '#10B981',
  Growing: '#F59E0B',
  Untapped: '#6B7280',
};

export default function PlatformEcosystem() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'rgba(59,130,246,0.45)' }}
        >
          Platform Ecosystem
        </span>
        <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="flex items-center gap-3">
          {(['Active', 'Growing', 'Untapped'] as Status[]).map(s => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: STATUS_DOT[s] }}
              />
              <span
                className="text-[8px] font-mono tracking-[0.1em]"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {PLATFORMS.map(platform => {
          const Icon = platform.icon;
          return (
            <div
              key={platform.id}
              className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden group cursor-default"
              style={{ transition: 'border-color 0.2s' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${platform.accentColor}22`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[1px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${platform.accentColor}20, transparent)`,
                }}
              />
              <div
                className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                style={{
                  background: platform.accentColor,
                  opacity: 0.04,
                  filter: 'blur(24px)',
                }}
              />

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${platform.accentColor}10`, border: `1px solid ${platform.accentColor}18` }}
                >
                  <Icon className="w-4 h-4" style={{ color: platform.accentColor }} />
                </div>

                <div
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8px] font-mono tracking-[0.1em]"
                  style={{
                    background: platform.statusBg,
                    color: platform.statusColor,
                    border: `1px solid ${platform.statusColor}22`,
                  }}
                >
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: platform.statusColor, opacity: 0.8 }}
                  />
                  {platform.status.toUpperCase()}
                </div>
              </div>

              <p
                className="text-[11px] font-semibold leading-snug mb-2"
                style={{ color: 'rgba(255,255,255,0.75)' }}
              >
                {platform.name}
              </p>

              <p
                className="text-[10px] leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.26)' }}
              >
                {platform.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
