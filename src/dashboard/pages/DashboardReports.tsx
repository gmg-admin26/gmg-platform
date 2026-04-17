import { FileText, Download, Calendar, BarChart3, Target, TrendingUp, AlertCircle } from 'lucide-react';
import StatusTag from '../components/StatusTag';
import { PIPELINE_OPPORTUNITIES } from '../data/pipelineData';
import { PARAGON_TODAY_REPORT } from '../data/paragonReportData';

const REPORTS = [
  { id: 'RPT-001', name: 'Q2 2026 Artist Performance Summary', period: 'Apr 1–30, 2026', type: 'Performance', status: 'Active', generated: 'Apr 8, 2026', size: '4.2 MB' },
  { id: 'RPT-002', name: 'Campaign ROI Breakdown — March', period: 'Mar 1–31, 2026', type: 'Campaign', status: 'Active', generated: 'Apr 1, 2026', size: '2.8 MB' },
  { id: 'RPT-003', name: 'Rocksteady Discovery Signals Q1', period: 'Jan–Mar 2026', type: 'Discovery', status: 'Active', generated: 'Apr 2, 2026', size: '6.1 MB' },
  { id: 'RPT-004', name: 'Catalog Revenue Report — Q1', period: 'Jan–Mar 2026', type: 'Revenue', status: 'Active', generated: 'Apr 3, 2026', size: '3.4 MB' },
  { id: 'RPT-005', name: 'Merch Drop Performance — Mar', period: 'Mar 2026', type: 'Merch', status: 'Active', generated: 'Apr 4, 2026', size: '1.9 MB' },
  { id: 'RPT-006', name: 'At-Risk Artist Intervention Log', period: 'Q1 2026', type: 'Risk', status: 'Risk', generated: 'Apr 5, 2026', size: '0.8 MB' },
];

const TYPE_COLORS: Record<string, string> = {
  Performance: 'text-[#10B981] bg-[#10B981]/10',
  Campaign: 'text-[#06B6D4] bg-[#06B6D4]/10',
  Discovery: 'text-[#8B5CF6] bg-[#8B5CF6]/10',
  Revenue: 'text-[#F59E0B] bg-[#F59E0B]/10',
  Merch: 'text-[#3B82F6] bg-[#3B82F6]/10',
  Risk: 'text-[#EF4444] bg-[#EF4444]/10',
};

function getDRSTier(score: number) {
  if (score >= 85) return { label: 'High Priority', color: '#EF4444', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/25', action: 'Act Now' };
  if (score >= 70) return { label: 'Strong Opportunity', color: '#F59E0B', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/25', action: 'Engage' };
  if (score >= 50) return { label: 'Developing', color: '#06B6D4', bg: 'bg-[#06B6D4]/10', border: 'border-[#06B6D4]/25', action: 'Monitor' };
  return { label: 'Early', color: '#6B7280', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', action: 'Watch' };
}

export default function DashboardReports() {
  const pipelineScores = PIPELINE_OPPORTUNITIES.map(o => o.dealReadinessScore);
  const avgDRS = Math.round(pipelineScores.reduce((a, b) => a + b, 0) / pipelineScores.length);
  const highPriorityCount = pipelineScores.filter(s => s >= 85).length;
  const top5Pipeline = [...PIPELINE_OPPORTUNITIES]
    .sort((a, b) => b.dealReadinessScore - a.dealReadinessScore)
    .slice(0, 5);
  const top5Report = [...PARAGON_TODAY_REPORT.artists]
    .filter(a => a.dealReadinessScore !== undefined)
    .sort((a, b) => (b.dealReadinessScore ?? 0) - (a.dealReadinessScore ?? 0))
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-white/50" />
            <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">Reports</h1>
          </div>
          <p className="text-[12px] text-white/30">{REPORTS.length} reports available · auto-generated</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-all">
          <Calendar className="w-3 h-3" />
          Schedule Report
        </button>
      </div>

      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]">
          <div className="w-[3px] h-4 rounded-full bg-[#EF4444] shrink-0" />
          <Target className="w-3.5 h-3.5 text-[#EF4444]" />
          <span className="text-[13px] font-bold text-white/88">Deal Readiness Intelligence</span>
          <span className="text-[9px] font-mono text-white/22 ml-1">// EXECUTIVE SUMMARY</span>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">High Priority</p>
              </div>
              <p className="text-[28px] font-bold leading-none text-[#EF4444] tabular-nums">{highPriorityCount}</p>
              <p className="text-[10px] text-white/32 mt-1">Opportunities scoring 85+</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#F59E0B]" />
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Avg. DRS</p>
              </div>
              <p className="text-[28px] font-bold leading-none text-[#F59E0B] tabular-nums">{avgDRS}</p>
              <p className="text-[10px] text-white/32 mt-1">Across active pipeline</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3.5 h-3.5 text-[#10B981]" />
                <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Active Deals</p>
              </div>
              <p className="text-[28px] font-bold leading-none text-[#10B981] tabular-nums">{PIPELINE_OPPORTUNITIES.length}</p>
              <p className="text-[10px] text-white/32 mt-1">In scoring pipeline</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-white/28 uppercase tracking-widest mb-3">Top 5 by DRS — Deal Pipeline</p>
              <div className="space-y-2">
                {top5Pipeline.map((opp, i) => {
                  const drs = getDRSTier(opp.dealReadinessScore);
                  return (
                    <div key={opp.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[10px] font-mono text-white/22 w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-white/80 truncate">{opp.artistName}</p>
                        <p className="text-[9px] font-mono text-white/28 truncate">{opp.stage}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Target className="w-2.5 h-2.5 shrink-0" style={{ color: drs.color }} />
                        <span className="text-[13px] font-bold tabular-nums" style={{ color: drs.color }}>{opp.dealReadinessScore}</span>
                        <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${drs.bg} ${drs.border}`} style={{ color: drs.color }}>
                          {drs.action}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-white/28 uppercase tracking-widest mb-3">Top 5 by DRS — Paragon Report</p>
              <div className="space-y-2">
                {top5Report.map((artist, i) => {
                  const score = artist.dealReadinessScore ?? 0;
                  const drs = getDRSTier(score);
                  return (
                    <div key={artist.rank} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-[10px] font-mono text-white/22 w-4 shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-white/80 truncate">{artist.name}</p>
                        <p className="text-[9px] font-mono text-white/28 truncate">{artist.genre}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Target className="w-2.5 h-2.5 shrink-0" style={{ color: drs.color }} />
                        <span className="text-[13px] font-bold tabular-nums" style={{ color: drs.color }}>{score}</span>
                        <span className={`text-[7px] font-mono px-1.5 py-0.5 rounded border ${drs.bg} ${drs.border}`} style={{ color: drs.color }}>
                          {drs.action}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Reports Generated (30d)', value: '24', icon: BarChart3 },
          { label: 'Scheduled Reports', value: '6', icon: Calendar },
          { label: 'Total Storage', value: '42 MB', icon: FileText },
        ].map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-[#0D0E11] border border-white/[0.06] rounded-lg p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-white/30" />
              </div>
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">{m.label}</p>
                <p className="text-[20px] font-bold text-white font-['Satoshi',sans-serif]">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#0D0E11] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-white/[0.06] text-[10px] font-mono text-white/20 uppercase tracking-widest">
          <div className="col-span-4">Report</div>
          <div className="col-span-2">Period</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Generated</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {REPORTS.map(r => (
            <div key={r.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-colors items-center group cursor-pointer">
              <div className="col-span-4">
                <p className="text-[13px] font-medium text-white">{r.name}</p>
                <p className="text-[10px] font-mono text-white/25">{r.id}</p>
              </div>
              <div className="col-span-2 text-[11px] font-mono text-white/40">{r.period}</div>
              <div className="col-span-2">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${TYPE_COLORS[r.type] ?? 'text-white/40 bg-white/[0.05]'}`}>
                  {r.type}
                </span>
              </div>
              <div className="col-span-2 text-[11px] text-white/40">{r.generated}</div>
              <div className="col-span-1 text-[11px] font-mono text-white/30">{r.size}</div>
              <div className="col-span-1 flex justify-end">
                <button className="p-1.5 rounded hover:bg-white/[0.06] transition-colors text-white/20 group-hover:text-white/60">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
