import { useState } from 'react';
import { FileText, Download, Calendar, Radio, Filter, Search } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  period: string;
  type: 'Daily Scout' | 'Discovery Summary' | 'Market Scan' | 'Heatmap' | 'Trend Movement' | 'Sign Candidates' | 'Priority Research';
  scout: string;
  generated: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Scheduled';
}

const REPORTS: Report[] = [
  { id: 'RS-001', name: 'Nova — Daily Scout Intelligence Brief', period: 'Apr 9, 2026', type: 'Daily Scout', scout: 'Nova', generated: 'Apr 9, 2026', size: '1.4 MB', status: 'Ready' },
  { id: 'RS-002', name: 'Rift — Daily Scout Intelligence Brief', period: 'Apr 9, 2026', type: 'Daily Scout', scout: 'Rift', generated: 'Apr 9, 2026', size: '1.2 MB', status: 'Ready' },
  { id: 'RS-003', name: 'Top Discoveries Summary — 7D Window', period: 'Apr 2–9, 2026', type: 'Discovery Summary', scout: 'All Scouts', generated: 'Apr 9, 2026', size: '3.8 MB', status: 'Ready' },
  { id: 'RS-004', name: 'Prism — Africa & Diaspora Market Scan', period: 'Apr 8, 2026', type: 'Market Scan', scout: 'Prism', generated: 'Apr 8, 2026', size: '2.1 MB', status: 'Ready' },
  { id: 'RS-005', name: 'Flare — Daily Scout Intelligence Brief', period: 'Apr 9, 2026', type: 'Daily Scout', scout: 'Flare', generated: 'Apr 9, 2026', size: '1.1 MB', status: 'Generating' },
  { id: 'RS-006', name: 'Global Signal Heatmap Report — Q2', period: 'Apr 1–9, 2026', type: 'Heatmap', scout: 'System', generated: 'Apr 9, 2026', size: '5.6 MB', status: 'Ready' },
  { id: 'RS-007', name: 'Afrobeats × R&B Trend Movement Report', period: 'Apr 2026', type: 'Trend Movement', scout: 'Prism / Flare', generated: 'Apr 8, 2026', size: '2.9 MB', status: 'Ready' },
  { id: 'RS-008', name: 'Weekly Sign Candidates — Apr 7–9', period: 'Apr 7–9, 2026', type: 'Sign Candidates', scout: 'All Scouts', generated: 'Apr 9, 2026', size: '1.8 MB', status: 'Ready' },
  { id: 'RS-009', name: 'Zara Vex — Priority Research Deep Diligence', period: 'Apr 9, 2026', type: 'Priority Research', scout: 'Nova', generated: 'Apr 9, 2026', size: '4.4 MB', status: 'Ready' },
  { id: 'RS-010', name: 'Vibe — Latin Market Intelligence Scan', period: 'Apr 7, 2026', type: 'Market Scan', scout: 'Vibe', generated: 'Apr 7, 2026', size: '1.9 MB', status: 'Ready' },
  { id: 'RS-011', name: 'Drift — EU Underground Scene Movement', period: 'Apr 6, 2026', type: 'Trend Movement', scout: 'Drift', generated: 'Apr 6, 2026', size: '2.3 MB', status: 'Ready' },
  { id: 'RS-012', name: 'DXTR — Priority Research Memo', period: 'Apr 8, 2026', type: 'Priority Research', scout: 'Rift', generated: 'Apr 8, 2026', size: '3.1 MB', status: 'Ready' },
];

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  'Daily Scout':     { color: '#10B981', bg: 'bg-[#10B981]/10' },
  'Discovery Summary': { color: '#EF4444', bg: 'bg-[#EF4444]/10' },
  'Market Scan':     { color: '#06B6D4', bg: 'bg-[#06B6D4]/10' },
  'Heatmap':         { color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
  'Trend Movement':  { color: '#F59E0B', bg: 'bg-[#F59E0B]/10' },
  'Sign Candidates': { color: '#10B981', bg: 'bg-[#10B981]/10' },
  'Priority Research': { color: '#EF4444', bg: 'bg-[#EF4444]/10' },
};

const REPORT_TYPES = ['All', 'Daily Scout', 'Discovery Summary', 'Market Scan', 'Heatmap', 'Trend Movement', 'Sign Candidates', 'Priority Research'];
const SCOUT_FILTERS = ['All', 'Nova', 'Rift', 'Flare', 'Drift', 'Vibe', 'Prism', 'Nexus', 'Cipher', 'Halo', 'Blaze', 'System', 'All Scouts'];

const READY_COUNT = REPORTS.filter(r => r.status === 'Ready').length;
const SCOUT_REPORTS_COUNT = REPORTS.filter(r => r.type === 'Daily Scout').length;
const PRIORITY_RESEARCH_COUNT = REPORTS.filter(r => r.type === 'Priority Research').length;

export default function RocksteadyReports() {
  const [typeFilter, setTypeFilter] = useState('All');
  const [scoutFilter, setScoutFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = REPORTS.filter(r => {
    if (typeFilter !== 'All' && r.type !== typeFilter) return false;
    if (scoutFilter !== 'All' && r.scout !== scoutFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.name.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-full bg-[#07080A]">
      <div className="relative bg-[#09090D] border-b border-[#EF4444]/10 px-6 py-5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EF4444]/15 to-transparent" />
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center shrink-0">
              <Radio className="w-4 h-4 text-[#EF4444]" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold text-white leading-tight">Rocksteady Reports</h1>
              <p className="text-[10.5px] text-white/25">Scout intelligence, discovery summaries, and market research reports</p>
            </div>
          </div>
          <div className="flex gap-3 ml-auto">
            {[
              { label: 'Ready', value: READY_COUNT, color: '#10B981' },
              { label: 'Scout Reports', value: SCOUT_REPORTS_COUNT, color: '#06B6D4' },
              { label: 'Priority Research', value: PRIORITY_RESEARCH_COUNT, color: '#EF4444' },
              { label: 'Total', value: REPORTS.length, color: '#F59E0B' },
            ].map(({ label, value, color }) => (
              <div key={label} className="px-3.5 py-2 bg-white/[0.025] border border-white/[0.05] rounded-xl text-center">
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-wider">{label}</p>
                <p className="text-[16px] font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-all">
              <Calendar className="w-3 h-3" />
              Schedule Report
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 flex-wrap p-3.5 bg-[#0A0B0E] border border-white/[0.07] rounded-xl">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..."
              className="pl-8 pr-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/70 placeholder-white/20 focus:outline-none focus:border-[#EF4444]/40 w-44" />
          </div>
          <Filter className="w-3 h-3 text-white/15 shrink-0" />
          {[
            ['Type', REPORT_TYPES, typeFilter, setTypeFilter],
            ['Scout', SCOUT_FILTERS, scoutFilter, setScoutFilter],
          ].map(([label, opts, val, setter]) => (
            <div key={String(label)} className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono text-white/25">{String(label)}:</span>
              <select value={String(val)} onChange={e => (setter as (v: string) => void)(e.target.value)}
                className="px-2 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded text-[11px] text-white/60 focus:outline-none focus:border-[#EF4444]/30">
                {(opts as string[]).map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <p className="ml-auto text-[10px] font-mono text-white/20">{filtered.length} reports</p>
        </div>

        <div className="bg-[#0A0B0E] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-2.5 border-b border-white/[0.06] text-[9px] font-mono text-white/15 uppercase tracking-widest">
            <div className="col-span-4">Report</div>
            <div className="col-span-2">Period</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-1">Scout</div>
            <div className="col-span-2">Generated</div>
            <div className="col-span-1"></div>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(r => {
              const tc = TYPE_CONFIG[r.type];
              return (
                <div key={r.id} className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-colors items-center group cursor-pointer">
                  <div className="col-span-4 flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${tc.color}10`, border: `1px solid ${tc.color}20` }}>
                      <FileText className="w-3 h-3" style={{ color: tc.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-white/80 truncate">{r.name}</p>
                      <p className="text-[9px] font-mono text-white/20">{r.id}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-[11px] font-mono text-white/35">{r.period}</div>
                  <div className="col-span-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border`} style={{ color: tc.color, background: `${tc.color}10`, borderColor: `${tc.color}25` }}>
                      {r.type}
                    </span>
                  </div>
                  <div className="col-span-1 text-[11px] font-mono text-white/40 truncate">{r.scout}</div>
                  <div className="col-span-2 text-[11px] text-white/35">{r.generated}</div>
                  <div className="col-span-1 flex justify-end">
                    <button className="p-1.5 rounded hover:bg-white/[0.06] transition-colors text-white/20 group-hover:text-white/60">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-8 h-8 text-white/10 mx-auto mb-3" />
              <p className="text-[13px] text-white/25">No reports match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
