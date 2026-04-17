import { ShoppingBag, TrendingUp, Package, DollarSign } from 'lucide-react';
import AIInsightPanel from '../components/AIInsightPanel';
import StatusTag from '../components/StatusTag';

const MERCH_DROPS = [
  { id: 'MD-001', name: 'Aria Cross Q2 Drop', artist: 'Aria Cross', type: 'Apparel', revenue: '$42,400', units: 312, status: 'Active', margin: '68%', date: 'Apr 6' },
  { id: 'MD-002', name: 'ZEAL Vol. 1 Bundle', artist: 'ZEAL', type: 'Bundle', revenue: '$71,000', units: 890, status: 'Scaling', margin: '71%', date: 'Mar 28' },
  { id: 'MD-003', name: 'Nova Blaze Capsule', artist: 'Nova Blaze', type: 'Apparel', revenue: '$18,200', units: 142, status: 'Active', margin: '64%', date: 'Apr 1' },
  { id: 'MD-004', name: 'SOLACE Vinyl + Tee', artist: 'SOLACE', type: 'Bundle', revenue: '$9,800', units: 88, status: 'Active', margin: '59%', date: 'Mar 15' },
  { id: 'MD-005', name: 'Maeven Spring Tee', artist: 'Maeven', type: 'Apparel', revenue: '$4,100', units: 67, status: 'Risk', margin: '42%', date: 'Feb 20' },
];

export default function MerchRevenue() {
  const totalRevenue = MERCH_DROPS.reduce((sum, d) => sum + parseFloat(d.revenue.replace(/\D/g, '')), 0);
  const totalUnits = MERCH_DROPS.reduce((sum, d) => sum + d.units, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag className="w-4 h-4 text-[#F59E0B]" />
          <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Merch & Revenue</h1>
        </div>
        <p className="text-[12px] text-white/30">{MERCH_DROPS.length} active drops · Q2 tracking</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Q2 Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, accent: '#F59E0B' },
          { label: 'Units Sold', value: totalUnits.toLocaleString(), icon: Package, accent: '#06B6D4' },
          { label: 'Avg Margin', value: '61%', icon: TrendingUp, accent: '#10B981' },
          { label: 'Active Drops', value: MERCH_DROPS.filter(d => d.status === 'Active' || d.status === 'Scaling').length.toString(), icon: ShoppingBag, accent: '#8B5CF6' },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px]"
                style={{ background: `linear-gradient(90deg, transparent, ${m.accent}55, transparent)` }} />
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">{m.label}</p>
                <Icon className="w-3.5 h-3.5" style={{ color: m.accent }} />
              </div>
              <p className="text-[26px] font-bold leading-none font-['Satoshi',sans-serif]" style={{ color: m.accent }}>{m.value}</p>
            </div>
          );
        })}
      </div>

      <AIInsightPanel />

      <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[11px] font-mono text-white/30 uppercase tracking-widest">Merch Drops</span>
        </div>
        <div className="grid grid-cols-12 gap-2 px-5 py-2 text-[10px] font-mono text-white/20 uppercase tracking-widest border-b border-white/[0.04]">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Artist</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Date</div>
          <div className="col-span-2">Revenue</div>
          <div className="col-span-1">Units</div>
          <div className="col-span-1">Margin</div>
          <div className="col-span-1">Status</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {MERCH_DROPS.map(d => (
            <div key={d.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-colors items-center cursor-pointer">
              <div className="col-span-3">
                <p className="text-[13px] font-medium text-white">{d.name}</p>
                <p className="text-[10px] font-mono text-white/25">{d.id}</p>
              </div>
              <div className="col-span-2 text-[12px] text-white/60">{d.artist}</div>
              <div className="col-span-1 text-[11px] text-white/40">{d.type}</div>
              <div className="col-span-1 text-[11px] font-mono text-white/40">{d.date}</div>
              <div className="col-span-2 text-[13px] font-medium text-white/80">{d.revenue}</div>
              <div className="col-span-1 text-[12px] font-mono text-white/50">{d.units}</div>
              <div className="col-span-1 text-[12px] font-mono text-[#10B981]">{d.margin}</div>
              <div className="col-span-1"><StatusTag status={d.status} pulse /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
