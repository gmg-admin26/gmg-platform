import { Video, Calendar, FileText, Download, Clock, CheckCircle } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { BN_MEETINGS, BN_REPORTS } from '../../data/bassnectarCatalogData';

const MEETINGS = BN_MEETINGS;
const REPORTS  = BN_REPORTS;

const MEETING_TYPE_META: Record<string, { color: string; label: string }> = {
  ops:      { color: '#06B6D4', label: 'Operations' },
  licensing:{ color: '#F59E0B', label: 'Licensing'  },
  legal:    { color: '#EF4444', label: 'Legal'       },
  finance:  { color: '#10B981', label: 'Finance'     },
  business: { color: '#3B82F6', label: 'Business'    },
};

const MEETING_STATUS_META: Record<string, { color: string; label: string }> = {
  scheduled: { color: '#10B981', label: 'Scheduled' },
  tentative: { color: '#F59E0B', label: 'Tentative' },
  completed: { color: '#6B7280', label: 'Completed' },
};

const REPORT_TYPE_META: Record<string, { color: string }> = {
  monthly:    { color: '#06B6D4' },
  quarterly:  { color: '#10B981' },
  asset:      { color: '#F59E0B' },
  valuation:  { color: '#3B82F6' },
};

export default function COSMeetings() {
  const upcomingMeetings = MEETINGS.filter(m => m.status !== 'completed');
  const publishedReports = REPORTS.filter(r => r.status === 'published');

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Video}
        title="Meetings + Reporting"
        subtitle="Scheduled calls, published reports, and client transparency hub"
        accentColor="#10B981"
      />
      <div className="p-5 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Upcoming Meetings',  value: upcomingMeetings.length.toString(),  color: '#10B981' },
            { label: 'Published Reports',  value: publishedReports.length.toString(),  color: '#10B981' },
            { label: 'Upcoming Reports',   value: REPORTS.filter(r => r.status === 'upcoming').length.toString(), color: '#06B6D4' },
            { label: 'Transparency Score', value: '97%',                               color: '#F59E0B' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Meetings */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Calendar className="w-3 h-3 text-[#10B981]" /> Upcoming Meetings
          </p>
          <div className="space-y-2.5">
            {upcomingMeetings.map(m => {
              const tm = MEETING_TYPE_META[m.type] ?? MEETING_TYPE_META.ops;
              const sm = MEETING_STATUS_META[m.status] ?? MEETING_STATUS_META.scheduled;
              return (
                <div key={m.id} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-5 py-4 flex items-start gap-4 hover:border-white/[0.1] transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${tm.color}14`, border: `1px solid ${tm.color}22` }}>
                    <Video className="w-4 h-4" style={{ color: tm.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-[12.5px] font-semibold text-white/85">{m.title}</h3>
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded" style={{ color: tm.color, background: `${tm.color}12` }}>{tm.label}</span>
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded" style={{ color: sm.color, background: `${sm.color}12` }}>{sm.label}</span>
                    </div>
                    <p className="text-[10.5px] text-white/40">With: {m.with}</p>
                    <p className="text-[10px] text-white/25 mt-1 italic">{m.notes}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11.5px] font-semibold text-white/70">{m.date}</p>
                    <p className="text-[10px] font-mono text-white/35 mt-0.5">{m.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
            <FileText className="w-3 h-3 text-[#10B981]" /> Reports + Deliverables
          </p>
          <div className="space-y-2.5">
            {REPORTS.map(r => {
              const tm = REPORT_TYPE_META[r.type] ?? REPORT_TYPE_META.monthly;
              const isPublished = r.status === 'published';
              return (
                <div key={r.id} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-5 py-3.5 flex items-center gap-4 hover:border-white/[0.1] transition-all">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${tm.color}14`, border: `1px solid ${tm.color}20` }}>
                    <FileText className="w-3.5 h-3.5" style={{ color: tm.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[12px] font-medium text-white/80">{r.title}</p>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded" style={{ color: tm.color, background: `${tm.color}12` }}>{r.type.toUpperCase()}</span>
                    </div>
                    <p className="text-[10px] text-white/30">{r.date}{r.pages > 0 ? ` · ${r.pages} pages` : ''}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {isPublished ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all border border-white/[0.07]">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                        <span className="text-[10px] font-mono text-[#06B6D4]">Upcoming</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reporting Cadence Info */}
        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
          <p className="text-[11px] font-semibold text-white/60 mb-3">Reporting Cadence</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Monthly Reports',   detail: 'Delivered within 5 business days of month close', color: '#06B6D4' },
              { label: 'Quarterly Reviews', detail: 'In-depth P&L, campaign performance, and 90-day plan', color: '#10B981' },
              { label: 'Ad-Hoc Reports',    detail: 'Asset-level reports triggered by major signals or events', color: '#F59E0B' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: item.color }} />
                <div>
                  <p className="text-[11.5px] font-medium text-white/70">{item.label}</p>
                  <p className="text-[10px] text-white/35 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
