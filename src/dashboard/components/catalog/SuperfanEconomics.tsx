import { Wifi } from 'lucide-react';

interface EconCard {
  id: string;
  label: string;
  value: string;
  unit?: string;
  detail: string;
  color: string;
  placeholder: boolean;
}

const CARDS: EconCard[] = [
  {
    id: 'revenue_per_1k',
    label: 'Superfan Revenue per 1K Listeners',
    value: '—',
    unit: '',
    detail: 'Average direct revenue generated per 1,000 listeners in the superfan tier across merch, tickets, and direct purchase.',
    color: '#F59E0B',
    placeholder: true,
  },
  {
    id: 'owned_audience_ratio',
    label: 'Owned Audience Ratio',
    value: '—',
    unit: '%',
    detail: 'Share of total audience reachable without a third-party platform — email list, fan club, direct SMS, and owned app.',
    color: '#10B981',
    placeholder: true,
  },
  {
    id: 'fan_conversion_rate',
    label: 'Fan Conversion Rate',
    value: '—',
    unit: '%',
    detail: 'Percentage of passive or engaged listeners who convert into a paying transaction within any 90-day window.',
    color: '#06B6D4',
    placeholder: true,
  },
];

function LiveBadge() {
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <Wifi className="w-2.5 h-2.5" style={{ color: 'rgba(255,255,255,0.2)' }} />
      <span className="text-[8px] font-mono tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
        LIVE WHEN CONNECTED
      </span>
    </div>
  );
}

export default function SuperfanEconomics() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[9px] font-mono uppercase tracking-[0.18em]"
          style={{ color: 'rgba(245,158,11,0.45)' }}>
          Superfan Economics
        </span>
        <div className="flex-1 h-[1px]" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <LiveBadge />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {CARDS.map(card => (
          <div
            key={card.id}
            className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: `linear-gradient(90deg, transparent, ${card.color}28, transparent)` }}
            />
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: card.color, opacity: 0.035, filter: 'blur(20px)' }}
            />

            <p className="text-[9px] font-mono uppercase tracking-[0.15em] mb-4 leading-relaxed pr-4"
              style={{ color: 'rgba(255,255,255,0.28)' }}>
              {card.label}
            </p>

            <div className="flex items-end gap-1 mb-3">
              {card.placeholder ? (
                <div className="flex items-end gap-2">
                  <span className="text-[36px] font-bold leading-none"
                    style={{ color: `${card.color}40`, fontVariantNumeric: 'tabular-nums' }}>
                    —
                  </span>
                </div>
              ) : (
                <div className="flex items-end gap-1">
                  <span className="text-[36px] font-bold leading-none"
                    style={{ color: card.color, fontVariantNumeric: 'tabular-nums' }}>
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-[16px] font-semibold pb-0.5"
                      style={{ color: `${card.color}80` }}>
                      {card.unit}
                    </span>
                  )}
                </div>
              )}
            </div>

            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {card.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
