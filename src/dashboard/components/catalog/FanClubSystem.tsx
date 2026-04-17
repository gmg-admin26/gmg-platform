import { Users, Shield, Crown, Zap, Check } from 'lucide-react';

interface Tier {
  id: string;
  name: string;
  label: string;
  icon: React.ElementType;
  color: string;
  access: string[];
  monetization: string;
}

const TIERS: Tier[] = [
  {
    id: 'core',
    name: 'Core Fan',
    label: 'Free',
    icon: Users,
    color: '#6B7280',
    access: [
      'Public releases',
      'Community feed access',
      'Newsletter updates',
    ],
    monetization: 'Entry point — grows general audience base',
  },
  {
    id: 'member',
    name: 'Member',
    label: 'Paid',
    icon: Shield,
    color: '#3B82F6',
    access: [
      'Early release access',
      'Members-only content drops',
      'Exclusive broadcast channel',
      'Priority presale tickets',
    ],
    monetization: 'Recurring subscription revenue',
  },
  {
    id: 'superfan',
    name: 'Superfan',
    label: 'Premium',
    icon: Crown,
    color: '#F59E0B',
    access: [
      'Everything in Member',
      'Direct-message access window',
      'Exclusive physical merch',
      'Listening session invites',
      'Behind-the-scenes studio access',
    ],
    monetization: 'High-LTV tier — merch + subscription bundled',
  },
  {
    id: 'inner',
    name: 'Inner Circle',
    label: 'Invite Only',
    icon: Zap,
    color: '#10B981',
    access: [
      'Everything in Superfan',
      'Artist meet & greet allocation',
      'Credited collaborations',
      'First access to drops before all tiers',
      'Annual fan summit invite',
    ],
    monetization: 'Community-led scarcity — highest retention signal',
  },
];

function TierCard({ tier, isActive }: { tier: Tier; isActive: boolean }) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden"
      style={{
        background: isActive ? `${tier.color}07` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${isActive ? `${tier.color}25` : 'rgba(255,255,255,0.05)'}`,
        transition: 'all 0.2s ease',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${tier.color}${isActive ? '35' : '15'}, transparent)`,
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `${tier.color}12`, border: `1px solid ${tier.color}25` }}
          >
            <tier.icon className="w-3.5 h-3.5" style={{ color: tier.color }} />
          </div>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {tier.name}
            </p>
          </div>
        </div>
        <span
          className="text-[8px] font-mono font-bold tracking-[0.12em] px-2 py-0.5 rounded"
          style={{ background: `${tier.color}12`, color: tier.color, border: `1px solid ${tier.color}20` }}
        >
          {tier.label.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {tier.access.map((item) => (
          <div key={item} className="flex items-start gap-2">
            <Check
              className="w-3 h-3 shrink-0 mt-0.5"
              style={{ color: `${tier.color}80` }}
            />
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>
              {item}
            </span>
          </div>
        ))}
      </div>

      <div
        className="mt-auto pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <p className="text-[9px] font-mono uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Monetization
        </p>
        <p className="text-[10px]" style={{ color: `${tier.color}90` }}>
          {tier.monetization}
        </p>
      </div>
    </div>
  );
}

export default function FanClubSystem() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'rgba(59,130,246,0.45)' }}
        >
          Fan Club System
        </span>
        <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <span
          className="text-[8px] font-mono tracking-[0.1em] px-2 py-0.5 rounded"
          style={{ color: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {TIERS.length} TIERS
        </span>
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: '#080A0D', borderColor: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: '#3B82F6' }} />
            </div>
            <span className="text-[13px] font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Membership Tiers
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className="w-2 h-2 rounded-full"
                style={{ background: t.color, opacity: 0.5 }}
              />
            ))}
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {TIERS.map((tier, idx) => (
            <TierCard key={tier.id} tier={tier} isActive={idx === 2} />
          ))}
        </div>

        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-4">
            {[
              { label: 'Free to join', color: '#6B7280' },
              { label: 'Paid access', color: '#3B82F6' },
              { label: 'Premium', color: '#F59E0B' },
              { label: 'Invite only', color: '#10B981' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
