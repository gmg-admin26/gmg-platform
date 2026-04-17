import { Megaphone, Play, Pause, Calendar } from 'lucide-react';
import { CAMPAIGNS, CONTENT_CALENDAR } from '../../data/artistOSData';

const CONTENT_STATUS: Record<string, { color: string; label: string }> = {
  scheduled:   { color: 'text-[#10B981]', label: 'Scheduled' },
  draft:       { color: 'text-[#F59E0B]', label: 'Draft' },
  not_started: { color: 'text-white/25',  label: 'Not Started' },
};

const PLATFORM_COLOR: Record<string, string> = {
  Meta: '#3B82F6',
  Instagram: '#E1306C',
  TikTok: '#06B6D4',
};

export default function MarketingEngine() {
  return (
    <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
        <Megaphone className="w-4 h-4 text-[#F59E0B]" />
        <span className="text-[13px] font-semibold text-white/80">Marketing Engine</span>
        <span className="ml-auto text-[10px] font-mono text-[#10B981]">
          {CAMPAIGNS.filter(c => c.status === 'active').length} active campaigns
        </span>
      </div>

      {/* Campaigns */}
      <div className="p-4 border-b border-white/[0.04]">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Ad Campaigns</p>
        <div className="space-y-3">
          {CAMPAIGNS.map(c => {
            const pct = Math.round((c.budget_spent / c.budget_total) * 100) || 0;
            const pColor = PLATFORM_COLOR[c.platform] ?? '#06B6D4';
            return (
              <div key={c.id} className="bg-white/[0.02] rounded-lg border border-white/[0.05] p-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {c.status === 'active' ? (
                      <Play className="w-3 h-3 text-[#10B981] shrink-0" />
                    ) : (
                      <Pause className="w-3 h-3 text-white/25 shrink-0" />
                    )}
                    <p className="text-[12px] font-medium text-white/80 truncate">{c.name}</p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                      style={{ color: pColor, background: `${pColor}14`, border: `1px solid ${pColor}22` }}>
                      {c.platform}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {c.status === 'active' ? (
                      <div className="flex items-center gap-2.5">
                        <span className="text-[12px] font-mono font-bold text-[#10B981]">{c.ctr} CTR</span>
                        <span className="text-[9px] font-mono text-white/30">{c.cpc} CPC</span>
                      </div>
                    ) : (
                      <button className="text-[9px] font-mono text-[#06B6D4] px-2 py-1 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/18 hover:bg-[#06B6D4]/18 transition-colors">
                        Activate →
                      </button>
                    )}
                  </div>
                </div>

                {c.status === 'active' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/35">{c.streams.toLocaleString()} streams</span>
                        <span className="text-[10px] font-mono text-white/25">{c.saves.toLocaleString()} saves</span>
                      </div>
                      <span className="text-[9px] font-mono text-white/30">${c.budget_spent.toLocaleString()} / ${c.budget_total.toLocaleString()}</span>
                    </div>
                    <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pColor, boxShadow: `0 0 4px ${pColor}50` }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Content calendar */}
      <div className="p-4">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-3">Content Calendar</p>
        <div className="space-y-2">
          {CONTENT_CALENDAR.map(item => {
            const cs = CONTENT_STATUS[item.status];
            return (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0">
                <div className="flex items-center gap-1.5 w-28 shrink-0">
                  <Calendar className="w-3 h-3 text-white/20" />
                  <span className="text-[10px] font-mono text-white/30">{item.date}</span>
                </div>
                <span className="text-[9px] font-mono text-white/20 w-16 shrink-0">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-white/65 truncate">{item.content}</p>
                  <p className="text-[10px] text-white/25">{item.type}</p>
                </div>
                <span className={`text-[10px] font-mono shrink-0 ${cs.color}`}>{cs.label}</span>
              </div>
            );
          })}
        </div>
        <button className="mt-3 w-full text-[11px] text-[#06B6D4] border border-[#06B6D4]/20 rounded-lg py-2 hover:bg-[#06B6D4]/5 transition-colors font-mono tracking-wider">
          + Schedule Content
        </button>
      </div>
    </div>
  );
}
