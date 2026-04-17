import { useState } from 'react';
import { Globe, ChevronRight, TrendingUp, Zap, Users, BarChart2, ChevronDown, X } from 'lucide-react';
import { MarketDetailModal, FanMarket } from './CampaignModals';

type DrillLevel = 'country' | 'state' | 'city';

interface MarketNode extends FanMarket {
  children?: MarketNode[];
}

const MARKET_DATA: MarketNode[] = [
  {
    name: 'United States', type: 'country', listeners: '2.4M', growth: '+18%', engagement: '9.2', saveRate: '34%', socialScore: '94', campaign: 'Active', trending: true,
    children: [
      {
        name: 'California', type: 'state', listeners: '620K', growth: '+22%', engagement: '9.8', saveRate: '38%', socialScore: '97', campaign: 'Active', trending: true,
        children: [
          { name: 'Los Angeles', type: 'city', listeners: '310K', growth: '+24%', engagement: '10.2', saveRate: '41%', socialScore: '99', campaign: 'Active', trending: true },
          { name: 'San Francisco', type: 'city', listeners: '140K', growth: '+19%', engagement: '9.1', saveRate: '36%', socialScore: '91', campaign: 'Scheduled', trending: false },
          { name: 'San Diego', type: 'city', listeners: '88K', growth: '+17%', engagement: '8.7', saveRate: '33%', socialScore: '87', campaign: 'None', trending: false },
        ],
      },
      {
        name: 'Texas', type: 'state', listeners: '380K', growth: '+14%', engagement: '8.4', saveRate: '31%', socialScore: '88', campaign: 'Active', trending: false,
        children: [
          { name: 'Houston', type: 'city', listeners: '162K', growth: '+16%', engagement: '8.9', saveRate: '33%', socialScore: '90', campaign: 'Active', trending: true },
          { name: 'Dallas', type: 'city', listeners: '130K', growth: '+12%', engagement: '8.2', saveRate: '29%', socialScore: '85', campaign: 'None', trending: false },
          { name: 'Austin', type: 'city', listeners: '88K', growth: '+21%', engagement: '9.4', saveRate: '37%', socialScore: '94', campaign: 'Scheduled', trending: true },
        ],
      },
      {
        name: 'New York', type: 'state', listeners: '410K', growth: '+16%', engagement: '8.9', saveRate: '33%', socialScore: '91', campaign: 'Scheduled', trending: true,
        children: [
          { name: 'New York City', type: 'city', listeners: '315K', growth: '+17%', engagement: '9.2', saveRate: '35%', socialScore: '93', campaign: 'Scheduled', trending: true },
          { name: 'Brooklyn', type: 'city', listeners: '95K', growth: '+14%', engagement: '8.5', saveRate: '30%', socialScore: '88', campaign: 'None', trending: false },
        ],
      },
      {
        name: 'Florida', type: 'state', listeners: '290K', growth: '+11%', engagement: '7.9', saveRate: '28%', socialScore: '83', campaign: 'None', trending: false,
        children: [
          { name: 'Miami', type: 'city', listeners: '148K', growth: '+14%', engagement: '8.6', saveRate: '32%', socialScore: '88', campaign: 'None', trending: true },
          { name: 'Orlando', type: 'city', listeners: '78K', growth: '+9%', engagement: '7.4', saveRate: '25%', socialScore: '79', campaign: 'None', trending: false },
        ],
      },
    ],
  },
  {
    name: 'Brazil', type: 'country', listeners: '1.1M', growth: '+44%', engagement: '11.8', saveRate: '47%', socialScore: '98', campaign: 'Active', trending: true,
    children: [
      {
        name: 'São Paulo', type: 'state', listeners: '490K', growth: '+48%', engagement: '12.3', saveRate: '51%', socialScore: '99', campaign: 'Active', trending: true,
        children: [
          { name: 'São Paulo City', type: 'city', listeners: '390K', growth: '+50%', engagement: '12.8', saveRate: '54%', socialScore: '99', campaign: 'Active', trending: true },
          { name: 'Campinas', type: 'city', listeners: '100K', growth: '+42%', engagement: '11.4', saveRate: '46%', socialScore: '96', campaign: 'Scheduled', trending: true },
        ],
      },
      {
        name: 'Rio de Janeiro', type: 'state', listeners: '310K', growth: '+40%', engagement: '11.2', saveRate: '44%', socialScore: '96', campaign: 'Active', trending: true,
        children: [
          { name: 'Rio de Janeiro City', type: 'city', listeners: '260K', growth: '+42%', engagement: '11.6', saveRate: '46%', socialScore: '97', campaign: 'Active', trending: true },
        ],
      },
    ],
  },
  {
    name: 'Mexico', type: 'country', listeners: '680K', growth: '+31%', engagement: '10.4', saveRate: '39%', socialScore: '95', campaign: 'Active', trending: true,
    children: [
      {
        name: 'Mexico City Metro', type: 'state', listeners: '420K', growth: '+35%', engagement: '11.0', saveRate: '43%', socialScore: '97', campaign: 'Active', trending: true,
        children: [
          { name: 'Mexico City', type: 'city', listeners: '380K', growth: '+36%', engagement: '11.2', saveRate: '44%', socialScore: '98', campaign: 'Active', trending: true },
          { name: 'Ecatepec', type: 'city', listeners: '40K', growth: '+28%', engagement: '9.8', saveRate: '38%', socialScore: '90', campaign: 'None', trending: false },
        ],
      },
      {
        name: 'Jalisco', type: 'state', listeners: '140K', growth: '+22%', engagement: '9.1', saveRate: '35%', socialScore: '89', campaign: 'Scheduled', trending: false,
        children: [
          { name: 'Guadalajara', type: 'city', listeners: '120K', growth: '+23%', engagement: '9.3', saveRate: '36%', socialScore: '90', campaign: 'Scheduled', trending: true },
        ],
      },
    ],
  },
  {
    name: 'United Kingdom', type: 'country', listeners: '520K', growth: '+12%', engagement: '8.1', saveRate: '30%', socialScore: '86', campaign: 'Scheduled', trending: false,
    children: [
      {
        name: 'England', type: 'state', listeners: '440K', growth: '+12%', engagement: '8.2', saveRate: '31%', socialScore: '87', campaign: 'Scheduled', trending: false,
        children: [
          { name: 'London', type: 'city', listeners: '280K', growth: '+14%', engagement: '8.7', saveRate: '33%', socialScore: '89', campaign: 'Scheduled', trending: true },
          { name: 'Manchester', type: 'city', listeners: '95K', growth: '+10%', engagement: '7.8', saveRate: '28%', socialScore: '83', campaign: 'None', trending: false },
        ],
      },
    ],
  },
  {
    name: 'Australia', type: 'country', listeners: '290K', growth: '+9%', engagement: '7.6', saveRate: '27%', socialScore: '82', campaign: 'None', trending: false,
    children: [
      {
        name: 'New South Wales', type: 'state', listeners: '150K', growth: '+10%', engagement: '7.8', saveRate: '28%', socialScore: '84', campaign: 'None', trending: false,
        children: [
          { name: 'Sydney', type: 'city', listeners: '120K', growth: '+11%', engagement: '8.0', saveRate: '29%', socialScore: '85', campaign: 'None', trending: true },
        ],
      },
    ],
  },
];

function getCampaignStyle(campaign: FanMarket['campaign']): React.CSSProperties {
  if (campaign === 'Active') return { color: '#10B981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' };
  if (campaign === 'Scheduled') return { color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' };
  return { color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
}

function getGrowthColor(growth: string): string {
  const val = parseFloat(growth.replace('%', '').replace('+', ''));
  if (val >= 30) return '#10B981';
  if (val >= 15) return '#06B6D4';
  if (val >= 8) return '#F59E0B';
  return 'rgba(255,255,255,0.5)';
}

function MarketRow({ market, level, onDrillIn, onOpenDetail }: {
  market: MarketNode;
  level: number;
  onDrillIn: (market: MarketNode) => void;
  onOpenDetail: (market: FanMarket) => void;
}) {
  const indent = level * 20;
  const hasChildren = market.children && market.children.length > 0;
  const growthColor = getGrowthColor(market.growth);
  const campaignStyle = getCampaignStyle(market.campaign);

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 80px 90px 80px',
      alignItems: 'center', padding: '9px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)',
      transition: 'background 0.12s', cursor: 'pointer',
      background: level === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.035)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = level === 0 ? 'rgba(255,255,255,0.015)' : 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: indent }}>
        {market.trending && (
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', flexShrink: 0, boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
        )}
        {!market.trending && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />}
        <span style={{ fontSize: level === 0 ? 13 : 12, fontWeight: level === 0 ? 700 : 500, color: level === 0 ? '#fff' : 'rgba(255,255,255,0.7)', letterSpacing: '-0.01em' }}>
          {market.name}
        </span>
        {level === 0 && (
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
            {market.type}
          </span>
        )}
      </div>

      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{market.listeners}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: growthColor, textAlign: 'right' }}>{market.growth}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>{market.engagement}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'right' }}>{market.saveRate}</span>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 20, ...campaignStyle }}>
          {market.campaign}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button
          onClick={e => { e.stopPropagation(); onOpenDetail(market); }}
          style={{ fontSize: 10, padding: '4px 9px', borderRadius: 7, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600 }}
        >
          Detail
        </button>
        {hasChildren && (
          <button
            onClick={e => { e.stopPropagation(); onDrillIn(market); }}
            style={{ fontSize: 10, padding: '4px 7px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}
          >
            Drill <ChevronRight size={9} />
          </button>
        )}
      </div>
    </div>
  );
}

interface DrillState {
  market: MarketNode;
  level: DrillLevel;
}

export function FanClusterIntelligence() {
  const [drillStack, setDrillStack] = useState<DrillState[]>([]);
  const [detailMarket, setDetailMarket] = useState<FanMarket | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'active' | 'opportunity'>('all');

  const currentData: MarketNode[] = drillStack.length > 0
    ? (drillStack[drillStack.length - 1].market.children ?? [])
    : MARKET_DATA;

  const filteredData = currentData.filter(m => {
    if (activeFilter === 'trending') return m.trending;
    if (activeFilter === 'active') return m.campaign === 'Active';
    if (activeFilter === 'opportunity') return m.campaign === 'None' && m.trending;
    return true;
  });

  function drillIn(market: MarketNode) {
    if (market.children && market.children.length > 0) {
      setDrillStack(prev => [...prev, { market, level: market.type }]);
    }
  }

  function drillBack(idx: number) {
    setDrillStack(prev => prev.slice(0, idx));
  }

  const totals = {
    listeners: currentData.reduce((a, m) => a + parseFloat(m.listeners.replace(/[^0-9.]/g, '')) * (m.listeners.includes('M') ? 1000 : 1), 0),
    active: currentData.filter(m => m.campaign === 'Active').length,
    trending: currentData.filter(m => m.trending).length,
  };

  return (
    <div>
      {detailMarket && (
        <MarketDetailModal market={detailMarket} onClose={() => setDetailMarket(null)} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={13} color="#06B6D4" />
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Fan Cluster Intelligence</h3>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Drill into your fan markets — Country → State / Region → City</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'trending', 'active', 'opportunity'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: 10, padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                textTransform: 'capitalize', fontFamily: 'monospace',
                background: activeFilter === f ? 'rgba(6,182,212,0.14)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeFilter === f ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.08)'}`,
                color: activeFilter === f ? '#06B6D4' : 'rgba(255,255,255,0.4)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total Markets', value: currentData.length.toString(), icon: Globe, color: '#06B6D4' },
          { label: 'Active Campaigns', value: totals.active.toString(), icon: Zap, color: '#10B981' },
          { label: 'Trending Now', value: totals.trending.toString(), icon: TrendingUp, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${stat.color}12`, border: `1px solid ${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <stat.icon size={13} color={stat.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</p>
              <p style={{ margin: 0, fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginTop: 3 }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {drillStack.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => drillBack(0)}
            style={{ fontSize: 11, color: '#06B6D4', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
          >
            Global
          </button>
          {drillStack.map((d, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={11} color="rgba(255,255,255,0.25)" />
              <button
                onClick={() => drillBack(i + 1)}
                style={{ fontSize: 11, color: i === drillStack.length - 1 ? '#fff' : '#06B6D4', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}
              >
                {d.market.name}
              </button>
            </div>
          ))}
          <button
            onClick={() => drillBack(0)}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 7px', borderRadius: 6 }}
          >
            <X size={10} /> Reset
          </button>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px 80px 80px 80px 90px 80px', padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          {['Market', 'Listeners', 'Growth', 'Eng. Index', 'Save Rate', 'Campaign', 'Actions'].map(h => (
            <span key={h} style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: h === 'Market' ? 'left' : h === 'Actions' ? 'right' : 'right' }}>
              {h}
            </span>
          ))}
        </div>

        {filteredData.length === 0 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
            No markets match this filter
          </div>
        ) : (
          filteredData.map((market, i) => (
            <MarketRow
              key={`${market.name}-${i}`}
              market={market}
              level={0}
              onDrillIn={drillIn}
              onOpenDetail={m => setDetailMarket(m)}
            />
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 5px rgba(16,185,129,0.7)' }} />
          Trending
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#10B981', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>Active</span>
          Campaign Running
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, color: '#F59E0B', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>Scheduled</span>
          Campaign Queued
        </div>
        <p style={{ margin: '0 0 0 auto', fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.2)' }}>
          Click "Drill" to explore sub-markets · Click "Detail" for full market intelligence
        </p>
      </div>
    </div>
  );
}

export function FanAnalyticsDrilldown({ onOpenDetail }: { onOpenDetail: (market: FanMarket) => void }) {
  const [expanded, setExpanded] = useState(false);
  const TOP_CITIES: FanMarket[] = [
    { name: 'São Paulo City', type: 'city', listeners: '390K', growth: '+50%', engagement: '12.8', saveRate: '54%', socialScore: '99', campaign: 'Active', trending: true },
    { name: 'Mexico City', type: 'city', listeners: '380K', growth: '+36%', engagement: '11.2', saveRate: '44%', socialScore: '98', campaign: 'Active', trending: true },
    { name: 'Los Angeles', type: 'city', listeners: '310K', growth: '+24%', engagement: '10.2', saveRate: '41%', socialScore: '99', campaign: 'Active', trending: true },
    { name: 'New York City', type: 'city', listeners: '315K', growth: '+17%', engagement: '9.2', saveRate: '35%', socialScore: '93', campaign: 'Scheduled', trending: true },
    { name: 'London', type: 'city', listeners: '280K', growth: '+14%', engagement: '8.7', saveRate: '33%', socialScore: '89', campaign: 'Scheduled', trending: true },
    { name: 'Rio de Janeiro City', type: 'city', listeners: '260K', growth: '+42%', engagement: '11.6', saveRate: '46%', socialScore: '97', campaign: 'Active', trending: true },
    { name: 'Houston', type: 'city', listeners: '162K', growth: '+16%', engagement: '8.9', saveRate: '33%', socialScore: '90', campaign: 'Active', trending: true },
    { name: 'San Francisco', type: 'city', listeners: '140K', growth: '+19%', engagement: '9.1', saveRate: '36%', socialScore: '91', campaign: 'Scheduled', trending: false },
  ];

  const visible = expanded ? TOP_CITIES : TOP_CITIES.slice(0, 4);

  return (
    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginTop: 14 }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BarChart2 size={13} color="#F59E0B" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Top City Markets — All American Rejects</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', alignSelf: 'center' }}>Live · {new Date().toLocaleDateString()}</span>
          <button onClick={() => setExpanded(!expanded)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, padding: '5px 10px', borderRadius: 7, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            {expanded ? 'Show Less' : 'Show All'} <ChevronDown size={10} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
          </button>
        </div>
      </div>
      <div>
        {visible.map((city, i) => {
          const growthColor = getGrowthColor(city.growth);
          const campaignStyle = getCampaignStyle(city.campaign);
          return (
            <div key={city.name} style={{
              display: 'grid', gridTemplateColumns: '2fr 90px 70px 70px 80px 90px',
              alignItems: 'center', padding: '9px 16px', borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
              cursor: 'pointer',
            }}
              onClick={() => onOpenDetail(city)}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', width: 16 }}>{i + 1}</span>
                {city.trending && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', flexShrink: 0, boxShadow: '0 0 5px rgba(16,185,129,0.6)' }} />}
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{city.name}</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'right' }}>{city.listeners}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: growthColor, textAlign: 'right' }}>{city.growth}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'right' }}>{city.saveRate}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, padding: '3px 8px', borderRadius: 20, ...campaignStyle }}>{city.campaign}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={e => { e.stopPropagation(); onOpenDetail(city); }} style={{ fontSize: 10, padding: '4px 9px', borderRadius: 7, cursor: 'pointer', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4', fontWeight: 600 }}>
                  Detail
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
