import { useState } from 'react';
import {
  Mic2, MapPin, Calendar, DollarSign, Users, Truck,
  FileText, CheckSquare, AlertTriangle, CheckCircle,
  Package, Headphones, Wrench, ChevronDown, ChevronUp,
  ArrowUpRight, RefreshCw, Shield, Zap, BarChart2,
  Building2, Phone, Plus, Copy, Eye, Target, Star,
  TrendingUp, Activity,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';

const ACCENT = '#3B82F6';

// ── DATA ──────────────────────────────────────────────────────────────────────

const TOUR_STATUS = {
  status: 'planning',
  tour_name: 'Bassnectar — Return Routing 2027',
  tour_entity: 'Amorphous Music Tour LLC',
  tour_rep: 'WME Touring (Head Agent: Jordan Hicks)',
  booking_contact: 'jhicks@wme.com',
  next_show: null,
  next_routing_window: 'Q1 2027 (Jan–Apr)',
  target_markets: ['Los Angeles', 'New York', 'Chicago', 'Denver', 'Austin', 'Miami', 'Seattle', 'Nashville'],
  key_notes: [
    'Routing strategy under review with WME — targeting amphitheater + arena hybrid run.',
    'Production budget cap set at $280K per show pending final P&L model.',
    'No public announcement until Q3 2026. Internal planning only.',
    'Rider drafts in progress — final versions expected by June 2026.',
  ],
};

const TOUR_METRICS = {
  projected_gross: '$18.2M',
  projected_net: '$6.4M',
  active_holds: 14,
  confirmed_dates: 0,
  routing_markets: 22,
  avg_ticket: '$82',
  capacity_target: '12,000–22,000',
  merch_per_head: '$28 (est.)',
  total_merch_proj: '$3.3M',
  show_count_target: '28–34 shows',
  on_sale_window: 'Sep–Oct 2026',
  production_budget_per_show: '$280K',
};

const ROUTING_PLAN = [
  { id: 'RT-001', market: 'Los Angeles, CA',   venue: 'Kia Forum',             capacity: 17_500, hold_status: 'hold_2', date_target: 'Jan 16, 2027', offer_status: 'hold'    },
  { id: 'RT-002', market: 'San Francisco, CA', venue: 'Chase Center',          capacity: 18_000, hold_status: 'hold_1', date_target: 'Jan 18, 2027', offer_status: 'hold'    },
  { id: 'RT-003', market: 'Denver, CO',        venue: 'Ball Arena',            capacity: 19_500, hold_status: 'hold_1', date_target: 'Jan 23, 2027', offer_status: 'in_nego' },
  { id: 'RT-004', market: 'Chicago, IL',       venue: 'United Center',         capacity: 21_000, hold_status: 'hold_3', date_target: 'Jan 30, 2027', offer_status: 'hold'    },
  { id: 'RT-005', market: 'New York, NY',      venue: 'Madison Square Garden', capacity: 20_000, hold_status: 'hold_1', date_target: 'Feb 6, 2027',  offer_status: 'in_nego' },
  { id: 'RT-006', market: 'Boston, MA',        venue: 'TD Garden',             capacity: 19_600, hold_status: 'tbd',    date_target: 'Feb 8, 2027',  offer_status: 'tbd'     },
  { id: 'RT-007', market: 'Washington DC',     venue: 'Capital One Arena',     capacity: 20_000, hold_status: 'hold_2', date_target: 'Feb 14, 2027', offer_status: 'hold'    },
  { id: 'RT-008', market: 'Nashville, TN',     venue: 'Bridgestone Arena',     capacity: 17_500, hold_status: 'tbd',    date_target: 'Feb 20, 2027', offer_status: 'tbd'     },
  { id: 'RT-009', market: 'Miami, FL',         venue: 'Kaseya Center',         capacity: 21_000, hold_status: 'hold_1', date_target: 'Feb 28, 2027', offer_status: 'in_nego' },
  { id: 'RT-010', market: 'Austin, TX',        venue: 'Moody Center',          capacity: 15_000, hold_status: 'hold_2', date_target: 'Mar 7, 2027',  offer_status: 'hold'    },
  { id: 'RT-011', market: 'Dallas, TX',        venue: 'American Airlines Ctr', capacity: 20_000, hold_status: 'tbd',    date_target: 'Mar 8, 2027',  offer_status: 'tbd'     },
  { id: 'RT-012', market: 'Seattle, WA',       venue: 'Climate Pledge Arena',  capacity: 18_100, hold_status: 'hold_3', date_target: 'Mar 14, 2027', offer_status: 'hold'    },
];

const OFFERS_PIPELINE = [
  { id: 'OF-001', market: 'Denver, CO',      venue: 'Ball Arena',            promoter: 'AEG Presents',  offer_amt: '$420K vs 85%', status: 'in_nego', notes: 'Counter submitted Apr 12. Waiting on promoter response.'      },
  { id: 'OF-002', market: 'New York, NY',    venue: 'Madison Square Garden', promoter: 'Live Nation',   offer_amt: '$680K vs 85%', status: 'in_nego', notes: 'First offer reviewed. Bonus structure in discussion.'          },
  { id: 'OF-003', market: 'Miami, FL',       venue: 'Kaseya Center',         promoter: 'Live Nation',   offer_amt: '$390K vs 82%', status: 'in_nego', notes: 'Routing dependency on Dallas — co-offer being structured.'    },
  { id: 'OF-004', market: 'Los Angeles, CA', venue: 'Kia Forum',             promoter: 'AEG Presents',  offer_amt: 'TBD',          status: 'hold',    notes: 'Hold confirmed. Offer expected once market confirmed for Jan.' },
  { id: 'OF-005', market: 'Chicago, IL',     venue: 'United Center',         promoter: 'Live Nation',   offer_amt: 'TBD',          status: 'hold',    notes: 'Second hold. Needs primary market confirmation first.'        },
];

const PRODUCTION_NEEDS = [
  { category: 'Production Design', item: 'Stage / Set Design Firm',       status: 'open',      notes: 'RFP to be issued Q3 2026. Budget envelope: $1.2M production build.'  },
  { category: 'Audio',             item: 'FOH Engineer',                   status: 'open',      notes: 'Crew from prior run under consideration. Decision by Aug 2026.'       },
  { category: 'Audio',             item: 'Monitor Engineer',               status: 'open',      notes: 'To be determined with FOH engineer.'                                 },
  { category: 'Lighting / Video',  item: 'LD + Lighting Co.',             status: 'open',      notes: 'In early conversations with 2 vendors.'                              },
  { category: 'Lighting / Video',  item: 'LED Vendor + Video Director',   status: 'open',      notes: 'Dependent on stage design. RFP Q3 2026.'                             },
  { category: 'Backline',          item: 'Backline Co.',                   status: 'open',      notes: 'National backline vendor to be assigned per region.'                 },
  { category: 'Transport',         item: 'Bus + Truck Co.',               status: 'open',      notes: 'Touring PM to solicit bids once routing confirmed.'                  },
  { category: 'Tour Management',   item: 'Tour Manager',                  status: 'in_review', notes: '3 candidates under review. Decision expected May 2026.'              },
  { category: 'Production Mgmt',   item: 'Production Manager',            status: 'in_review', notes: 'Reviewing 2 PM candidates with prior EDM touring experience.'         },
  { category: 'Staffing',          item: 'Merch Manager',                 status: 'open',      notes: 'To be assigned once merch line is confirmed.'                        },
  { category: 'Staffing',          item: 'Security / Crowd Mgmt',         status: 'open',      notes: 'Venue + promoter to provide primary. Tour security also needed.'     },
  { category: 'Staffing',          item: 'Hospitality Rider Coordinator', status: 'open',      notes: 'Rider coordinator assigned during pre-production phase.'             },
];

const RIDER_VERSIONS = [
  {
    id: 'RDR-001', type: 'artist', version: 'v2.1', label: 'Artist Rider',
    updated: 'Apr 3, 2026', status: 'draft',
    share_link: 'https://gmg.io/riders/bassnectar-artist-v2-1',
    sections: ['Hospitality', 'Catering', 'Dressing Room', 'Hotel / Transportation', 'Guest List', 'Personnel'],
    notes: 'Draft. Hotel block spec and catering quantities to be finalized before distribution.',
  },
  {
    id: 'RDR-002', type: 'production', version: 'v1.4', label: 'Production Rider',
    updated: 'Mar 28, 2026', status: 'draft',
    share_link: 'https://gmg.io/riders/bassnectar-prod-v1-4',
    sections: ['Stage Dimensions', 'Power Requirements', 'FOH + Monitor Position', 'Lighting Grid Spec', 'LED Wall Spec', 'Crew Meals', 'Load In / Out Timeline'],
    notes: 'Stage dimensions subject to change. Do not distribute until production design is locked.',
  },
  {
    id: 'RDR-003', type: 'advance', version: 'v1.0', label: 'Advance Pack',
    updated: 'Apr 10, 2026', status: 'internal',
    share_link: 'https://gmg.io/riders/bassnectar-advance-v1-0',
    sections: ['Venue Requirements Checklist', 'Promoter Responsibilities', 'Day-of-Show Timeline', 'Settlement Instructions'],
    notes: 'Internal only. Distribute to promoters at time of contract signing.',
  },
];

const TOUR_TASKS = [
  { id: 'TT-001', category: 'Staffing',   title: 'Finalize Tour Manager hire',               priority: 'high',   status: 'in_progress', owner: 'GMG Ops',        due: 'May 15, 2026'  },
  { id: 'TT-002', category: 'Staffing',   title: 'Confirm Production Manager',               priority: 'high',   status: 'in_progress', owner: 'GMG Ops',        due: 'May 15, 2026'  },
  { id: 'TT-003', category: 'Routing',    title: 'Confirm WME routing strategy — Phase 1',  priority: 'high',   status: 'in_progress', owner: 'WME',            due: 'May 30, 2026'  },
  { id: 'TT-004', category: 'Offers',     title: 'Respond to Denver / NYC offer counters',   priority: 'high',   status: 'open',        owner: 'WME',            due: 'Apr 20, 2026'  },
  { id: 'TT-005', category: 'Production', title: 'Issue stage design RFP',                   priority: 'medium', status: 'open',        owner: 'Production Mgr', due: 'Jul 1, 2026'   },
  { id: 'TT-006', category: 'Riders',     title: 'Finalize Artist Rider v3.0',               priority: 'medium', status: 'open',        owner: 'Tour Manager',   due: 'Jun 30, 2026'  },
  { id: 'TT-007', category: 'Riders',     title: 'Finalize Production Rider v2.0',           priority: 'medium', status: 'open',        owner: 'Production Mgr', due: 'Jun 30, 2026'  },
  { id: 'TT-008', category: 'Contracts',  title: 'Execute engagement letters — WME',         priority: 'high',   status: 'open',        owner: 'GMG Legal',      due: 'May 10, 2026'  },
  { id: 'TT-009', category: 'Contracts',  title: 'Venue contracts — Phase 1 markets',        priority: 'high',   status: 'open',        owner: 'GMG Legal',      due: 'Aug 2026'      },
  { id: 'TT-010', category: 'Deposits',   title: 'Confirm deposit schedule — per contract',  priority: 'medium', status: 'open',        owner: 'GMG Finance',    due: 'Upon contract' },
  { id: 'TT-011', category: 'Logistics',  title: 'Transport vendor bid solicitation',        priority: 'medium', status: 'open',        owner: 'Production Mgr', due: 'Aug 2026'      },
  { id: 'TT-012', category: 'Marketing',  title: 'On-sale marketing strategy — Phase 1',    priority: 'high',   status: 'open',        owner: 'GMG Marketing',  due: 'Aug 15, 2026'  },
  { id: 'TT-013', category: 'Marketing',  title: 'Announce strategy — press + social',       priority: 'high',   status: 'open',        owner: 'GMG PR',         due: 'Q3 2026'       },
  { id: 'TT-014', category: 'Merch',      title: 'Tour merch line brief + design direction', priority: 'medium', status: 'open',        owner: 'GMG Merch',      due: 'Jul 2026'      },
];

const TIMELINE_MILESTONES = [
  { month: 'Apr–May 2026',  label: 'Internal planning + offer responses',  status: 'in_progress', color: '#3B82F6' },
  { month: 'Jun 2026',      label: 'Staffing + production RFPs issued',    status: 'planned',     color: '#6B7280' },
  { month: 'Jul 2026',      label: 'Rider lock + routing Phase 1 confirm', status: 'planned',     color: '#6B7280' },
  { month: 'Aug 2026',      label: 'Contracts + deposit schedule',         status: 'planned',     color: '#6B7280' },
  { month: 'Sep 2026',      label: 'On-sale marketing launch',             status: 'planned',     color: '#6B7280' },
  { month: 'Oct 2026',      label: 'Tickets on sale — Phase 1 markets',   status: 'planned',     color: '#6B7280' },
  { month: 'Nov–Dec 2026',  label: 'Pre-production builds + rehearsals',   status: 'planned',     color: '#6B7280' },
  { month: 'Jan 2027',      label: 'Tour opens',                           status: 'planned',     color: '#10B981' },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function fmtCap(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);
}

const STATUS_COLOR: Record<string, string> = {
  in_nego: '#06B6D4', hold: '#F59E0B', confirmed: '#10B981', tbd: '#6B7280',
  open: '#EF4444', in_review: '#F59E0B', done: '#10B981',
  in_progress: '#06B6D4', planned: '#6B7280',
  draft: '#F59E0B', internal: '#6B7280', final: '#10B981',
};
const STATUS_LABEL: Record<string, string> = {
  in_nego: 'In Negotiation', hold: 'On Hold', confirmed: 'Confirmed', tbd: 'TBD',
  open: 'Open', in_review: 'In Review', done: 'Done',
  in_progress: 'In Progress', planned: 'Planned',
  draft: 'Draft', internal: 'Internal', final: 'Final',
};
const HOLD_LABEL: Record<string, string> = {
  hold_1: '1st Hold', hold_2: '2nd Hold', hold_3: '3rd Hold', tbd: 'No Hold',
};
const HOLD_COLOR: Record<string, string> = {
  hold_1: '#10B981', hold_2: '#F59E0B', hold_3: '#EF4444', tbd: '#6B7280',
};
const PRIORITY_COLOR: Record<string, string> = {
  critical: '#EF4444', high: '#F59E0B', medium: '#06B6D4', low: '#6B7280',
};
const CAT_COLOR: Record<string, string> = {
  Staffing: '#3B82F6', Routing: '#A3E635', Offers: '#06B6D4',
  Production: '#F59E0B', Riders: '#EC4899', Contracts: '#EF4444',
  Deposits: '#10B981', Logistics: '#8B5CF6', Marketing: '#F97316', Merch: '#06B6D4',
};

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded shrink-0"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label.toUpperCase()}
    </span>
  );
}

function SectionHeader({ icon: Icon, title, sub, color, right }: {
  icon: React.ElementType; title: string; sub?: string; color: string; right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/[0.05]">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
        <Icon className="w-3.5 h-3.5" style={{ color }} />
      </div>
      <div className="flex-1">
        <p className="text-[12px] font-semibold text-white/80">{title}</p>
        {sub && <p className="text-[9px] font-mono text-white/25">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ── TOUR STATUS HEADER ────────────────────────────────────────────────────────

function TourStatusHeader() {
  const sc: Record<string, { color: string }> = {
    active: { color: '#10B981' }, planning: { color: '#F59E0B' }, paused: { color: '#6B7280' },
  };
  const color = sc[TOUR_STATUS.status]?.color ?? '#6B7280';
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-5">
      <div className="flex items-start gap-5 flex-wrap">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
            <Mic2 className="w-5 h-5" style={{ color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h2 className="text-[15px] font-bold text-white/90">{TOUR_STATUS.tour_name}</h2>
              <PillBadge label={STATUS_LABEL[TOUR_STATUS.status] ?? TOUR_STATUS.status} color={color} />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-white/20" />
                <span className="text-[10.5px] text-white/45">{TOUR_STATUS.tour_entity}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-white/20" />
                <span className="text-[10.5px] text-white/45">{TOUR_STATUS.tour_rep}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-white/20" />
                <span className="text-[10.5px] text-white/45">Next routing window: <span style={{ color: ACCENT }}>{TOUR_STATUS.next_routing_window}</span></span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#0D0F13] rounded-xl p-3.5 border border-white/[0.04] min-w-[240px] max-w-sm">
          <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-2">Key Notes</p>
          <ul className="space-y-1.5">
            {TOUR_STATUS.key_notes.map((n, i) => (
              <li key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-[6px] shrink-0" style={{ background: `${ACCENT}60` }} />
                <p className="text-[10px] text-white/40 leading-snug">{n}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ── TOUR METRICS ──────────────────────────────────────────────────────────────

function TourMetrics() {
  const items = [
    { label: 'Projected Gross',         value: TOUR_METRICS.projected_gross,             color: '#10B981', icon: DollarSign  },
    { label: 'Projected Net',           value: TOUR_METRICS.projected_net,               color: '#A3E635', icon: TrendingUp  },
    { label: 'Projected Merch',         value: TOUR_METRICS.total_merch_proj,            color: '#06B6D4', icon: Package     },
    { label: 'Active Holds',            value: String(TOUR_METRICS.active_holds),        color: '#F59E0B', icon: MapPin      },
    { label: 'Confirmed Dates',         value: String(TOUR_METRICS.confirmed_dates),     color: '#6B7280', icon: Calendar    },
    { label: 'Routing Markets',         value: String(TOUR_METRICS.routing_markets),     color: '#3B82F6', icon: Target      },
    { label: 'Show Count Target',       value: TOUR_METRICS.show_count_target,           color: '#F59E0B', icon: BarChart2   },
    { label: 'Avg Ticket (Est.)',       value: TOUR_METRICS.avg_ticket,                  color: '#EC4899', icon: Star        },
    { label: 'Capacity Target',         value: TOUR_METRICS.capacity_target,             color: '#3B82F6', icon: Users       },
    { label: 'Merch Per Head (Est.)',   value: TOUR_METRICS.merch_per_head,              color: '#06B6D4', icon: Package     },
    { label: 'Prod. Budget / Show',     value: TOUR_METRICS.production_budget_per_show, color: '#EF4444', icon: Wrench      },
    { label: 'On-Sale Window',          value: TOUR_METRICS.on_sale_window,              color: '#A3E635', icon: Zap         },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
      {items.map(m => {
        const Icon = m.icon;
        return (
          <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-3.5 flex items-start gap-3 hover:border-white/[0.09] transition-all">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: `${m.color}10`, border: `1px solid ${m.color}1A` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: m.color }} />
            </div>
            <div className="min-w-0">
              <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide">{m.label}</p>
              <p className="text-[14px] font-bold mt-0.5" style={{ color: m.color }}>{m.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ROUTING PLAN ──────────────────────────────────────────────────────────────

function RoutingPlan() {
  const inNego = ROUTING_PLAN.filter(r => r.offer_status === 'in_nego').length;
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={MapPin} color="#3B82F6"
        title="Routing Plan"
        sub={`${ROUTING_PLAN.length} markets charted · ${inNego} in negotiation · 0 confirmed`}
        right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
            <Plus className="w-3 h-3" /> Add Market
          </button>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['ID', 'Market', 'Venue', 'Cap.', 'Hold', 'Target Date', 'Offer Status'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03]">
            {ROUTING_PLAN.map(r => (
              <tr key={r.id} className="hover:bg-white/[0.015] transition-colors">
                <td className="px-4 py-3 text-[9.5px] font-mono text-white/25">{r.id}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-white/20 shrink-0" />
                    <span className="text-[11.5px] font-medium text-white/70">{r.market}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-white/40 whitespace-nowrap">{r.venue}</td>
                <td className="px-4 py-3 text-[11px] font-bold text-white/55 whitespace-nowrap">{fmtCap(r.capacity)}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PillBadge label={HOLD_LABEL[r.hold_status] ?? r.hold_status} color={HOLD_COLOR[r.hold_status] ?? '#6B7280'} />
                </td>
                <td className="px-4 py-3 text-[10.5px] font-mono text-white/40 whitespace-nowrap">{r.date_target}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PillBadge label={STATUS_LABEL[r.offer_status] ?? r.offer_status} color={STATUS_COLOR[r.offer_status] ?? '#6B7280'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── OFFERS PIPELINE ───────────────────────────────────────────────────────────

function OffersPipeline() {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={DollarSign} color="#10B981"
        title="Offers Pipeline"
        sub={`${OFFERS_PIPELINE.length} active offers · ${OFFERS_PIPELINE.filter(o => o.status === 'in_nego').length} in negotiation`}
      />
      <div className="divide-y divide-white/[0.04]">
        {OFFERS_PIPELINE.map(o => (
          <div key={o.id} className="px-5 py-3.5 flex items-start gap-4 hover:bg-white/[0.015] transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[12px] font-semibold text-white/75">{o.market}</span>
                <span className="text-[10.5px] text-white/25">—</span>
                <span className="text-[11px] text-white/40">{o.venue}</span>
                <PillBadge label={STATUS_LABEL[o.status] ?? o.status} color={STATUS_COLOR[o.status] ?? '#6B7280'} />
              </div>
              <p className="text-[10px] text-white/25 mb-1">{o.promoter}</p>
              <p className="text-[10.5px] text-white/40 leading-snug">{o.notes}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[9px] font-mono text-white/20 uppercase">Offer</p>
              <p className="text-[13px] font-bold text-[#10B981]">{o.offer_amt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PRODUCTION NEEDS ──────────────────────────────────────────────────────────

function ProductionNeeds() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? PRODUCTION_NEEDS : PRODUCTION_NEEDS.slice(0, 6);
  const categories = [...new Set(PRODUCTION_NEEDS.map(p => p.category))];

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Truck} color="#F59E0B"
        title="Production Needs"
        sub={`${PRODUCTION_NEEDS.length} items · ${PRODUCTION_NEEDS.filter(p => p.status === 'in_review').length} in review · ${PRODUCTION_NEEDS.filter(p => p.status === 'open').length} open`}
      />
      <div className="px-5 pt-3 pb-2 flex flex-wrap gap-1.5">
        {categories.map(c => (
          <span key={c} className="text-[8.5px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-white/25 border border-white/[0.04]">{c}</span>
        ))}
      </div>
      <div className="divide-y divide-white/[0.04]">
        {visible.map((p, i) => (
          <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.015] transition-colors">
            <div className="w-2 h-2 rounded-full mt-[6px] shrink-0" style={{ background: STATUS_COLOR[p.status] ?? '#6B7280' }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-[11.5px] font-medium text-white/70">{p.item}</span>
                <PillBadge label={p.category} color="#6B7280" />
                <PillBadge label={STATUS_LABEL[p.status] ?? p.status} color={STATUS_COLOR[p.status] ?? '#6B7280'} />
              </div>
              <p className="text-[10px] text-white/30 leading-snug">{p.notes}</p>
            </div>
          </div>
        ))}
      </div>
      {PRODUCTION_NEEDS.length > 6 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] text-white/25 hover:text-white/50 border-t border-white/[0.04] transition-colors"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show {PRODUCTION_NEEDS.length - 6} More</>}
        </button>
      )}
    </div>
  );
}

// ── RIDER MANAGEMENT ──────────────────────────────────────────────────────────

function RiderManagement() {
  const [copied, setCopied] = useState<string | null>(null);

  function handleCopy(link: string, id: string) {
    navigator.clipboard.writeText(link).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  const typeIcon: Record<string, React.ElementType> = {
    artist: Headphones, production: Truck, advance: FileText,
  };
  const typeColor: Record<string, string> = {
    artist: '#EC4899', production: '#F59E0B', advance: '#06B6D4',
  };

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={FileText} color="#EC4899"
        title="Rider Management"
        sub="Multiple rider versions · Private share links for venues + promoters"
        right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
            <Plus className="w-3 h-3" /> Add Version
          </button>
        }
      />
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {RIDER_VERSIONS.map(r => {
          const Icon = typeIcon[r.type] ?? FileText;
          const color = typeColor[r.type] ?? '#6B7280';
          return (
            <div key={r.id} className="bg-[#0D0F13] border border-white/[0.05] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <p className="text-[12px] font-semibold text-white/80">{r.label}</p>
                    <PillBadge label={r.version} color={color} />
                    <PillBadge label={STATUS_LABEL[r.status] ?? r.status} color={STATUS_COLOR[r.status] ?? '#6B7280'} />
                  </div>
                  <p className="text-[9px] font-mono text-white/20">Updated {r.updated}</p>
                </div>
              </div>
              <div>
                <p className="text-[8.5px] font-mono text-white/15 uppercase tracking-widest mb-1.5">Sections</p>
                <div className="flex flex-wrap gap-1">
                  {r.sections.map(s => (
                    <span key={s} className="text-[8.5px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-[#0B0D10] rounded-lg px-3 py-2 border border-white/[0.04]">
                <p className="text-[9px] text-white/25 leading-snug">{r.notes}</p>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
                <p className="flex-1 text-[8.5px] font-mono text-white/15 truncate min-w-0">{r.share_link}</p>
                <button
                  onClick={() => handleCopy(r.share_link, r.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded border border-white/[0.07] text-[9.5px] text-white/30 hover:text-white/60 transition-all shrink-0"
                >
                  {copied === r.id ? <CheckCircle className="w-3 h-3 text-[#10B981]" /> : <Copy className="w-3 h-3" />}
                  {copied === r.id ? 'Copied' : 'Copy'}
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded border border-white/[0.07] text-[9.5px] text-white/30 hover:text-white/60 transition-all shrink-0">
                  <Eye className="w-3 h-3" /> View
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TOUR TASKS ────────────────────────────────────────────────────────────────

function TourTasks() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(TOUR_TASKS.map(t => t.category)))];
  const filtered = filter === 'All' ? TOUR_TASKS : TOUR_TASKS.filter(t => t.category === filter);

  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={CheckSquare} color="#06B6D4"
        title="Tour Tasks"
        sub={`${TOUR_TASKS.length} tasks · ${TOUR_TASKS.filter(t => t.status === 'in_progress').length} in progress · ${TOUR_TASKS.filter(t => t.status === 'open').length} open`}
        right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#06B6D4]/25 bg-[#06B6D4]/[0.07] text-[10.5px] text-[#06B6D4] hover:bg-[#06B6D4]/[0.12] transition-all">
            <Plus className="w-3 h-3" /> Add Task
          </button>
        }
      />
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-white/[0.04] overflow-x-auto">
        {categories.map(c => {
          const active = filter === c;
          const col = CAT_COLOR[c] ?? '#06B6D4';
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="px-2.5 py-1 rounded text-[10px] font-medium transition-all whitespace-nowrap shrink-0"
              style={{
                background: active ? `${col}18` : 'transparent',
                color: active ? col : 'rgba(255,255,255,0.3)',
                border: active ? `1px solid ${col}30` : '1px solid transparent',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="divide-y divide-white/[0.03]">
        {filtered.map(t => {
          const catColor = CAT_COLOR[t.category] ?? '#6B7280';
          const isActive = t.status === 'in_progress';
          return (
            <div key={t.id} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.015] transition-colors">
              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 border"
                style={{ borderColor: isActive ? '#06B6D4' : 'rgba(255,255,255,0.08)', background: isActive ? '#06B6D410' : 'transparent' }}>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />}
              </div>
              <span className="text-[9px] font-mono text-white/20 w-16 shrink-0">{t.id}</span>
              <p className="flex-1 text-[11.5px] font-medium text-white/70 truncate min-w-0">{t.title}</p>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <PillBadge label={t.category} color={catColor} />
                <PillBadge label={t.priority} color={PRIORITY_COLOR[t.priority] ?? '#6B7280'} />
                <PillBadge label={STATUS_LABEL[t.status] ?? t.status} color={STATUS_COLOR[t.status] ?? '#6B7280'} />
                <span className="text-[9px] font-mono text-white/20 whitespace-nowrap hidden md:inline">{t.owner}</span>
                <span className="text-[9px] font-mono text-white/15 whitespace-nowrap hidden lg:inline">{t.due}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── TIMELINE INTEGRATION ──────────────────────────────────────────────────────

function TimelineIntegration() {
  return (
    <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
      <SectionHeader
        icon={Calendar} color="#10B981"
        title="12-Month Timeline Integration"
        sub="Touring milestones mapped to the Catalog OS planning calendar"
        right={
          <a
            href="/catalog/app/timeline"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#10B981]/25 text-[10.5px] text-[#10B981] hover:bg-[#10B981]/[0.07] transition-all"
          >
            <ArrowUpRight className="w-3 h-3" /> View Full Timeline
          </a>
        }
      />
      <div className="p-5">
        <div className="relative pl-6">
          <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-white/[0.05] rounded-full" />
          <div className="space-y-0">
            {TIMELINE_MILESTONES.map((item, i) => {
              const isActive = item.status === 'in_progress';
              return (
                <div key={i} className="relative flex items-start gap-4 pb-5 last:pb-0">
                  <div className="absolute -left-[3px] top-1.5 w-3 h-3 rounded-full border-2 z-10"
                    style={{
                      borderColor: item.color,
                      background: isActive ? item.color : '#07080A',
                    }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-mono text-white/35">{item.month}</span>
                      <PillBadge label={STATUS_LABEL[item.status] ?? item.status} color={item.color} />
                    </div>
                    <p className="text-[12px] font-medium text-white/65">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'routing' | 'production' | 'riders' | 'tasks' | 'timeline';

export default function COSTouring() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview',   label: 'Overview',    icon: BarChart2   },
    { id: 'routing',    label: 'Routing',     icon: MapPin      },
    { id: 'production', label: 'Production',  icon: Truck       },
    { id: 'riders',     label: 'Riders',      icon: FileText    },
    { id: 'tasks',      label: 'Tasks',       icon: CheckSquare },
    { id: 'timeline',   label: 'Timeline',    icon: Calendar    },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Mic2}
        title="Touring"
        subtitle="Routing · Offers · Production · Riders · Tour Tasks · Timeline Integration"
        accentColor={ACCENT}
        badge="Planning"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#3B82F6]/25 bg-[#3B82F6]/[0.07] text-[10.5px] text-[#3B82F6] hover:bg-[#3B82F6]/[0.12] transition-all">
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <ArrowUpRight className="w-3 h-3" /> Export
            </button>
          </div>
        }
      />

      <div className="flex items-center gap-1 px-5 pt-4 border-b border-white/[0.05] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap shrink-0"
              style={{
                color: active ? ACCENT : 'rgba(255,255,255,0.3)',
                borderBottomColor: active ? ACCENT : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">

        {activeTab === 'overview' && (
          <>
            <TourStatusHeader />
            <div>
              <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest mb-3">Tour Metrics</p>
              <TourMetrics />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <OffersPipeline />
              <TimelineIntegration />
            </div>
          </>
        )}

        {activeTab === 'routing' && (
          <>
            <TourStatusHeader />
            <RoutingPlan />
            <OffersPipeline />
          </>
        )}

        {activeTab === 'production' && (
          <>
            <div className="bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <p className="text-[11.5px] text-[#F59E0B]/80 font-medium">
                Production hiring is the critical path item. Tour Manager + Production Manager must be locked before vendor RFPs can be issued. Target: May 15, 2026.
              </p>
            </div>
            <ProductionNeeds />
          </>
        )}

        {activeTab === 'riders' && (
          <>
            <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <Shield className="w-4 h-4 text-[#EC4899] shrink-0" />
              <p className="text-[11.5px] text-white/45">
                All rider share links are private. Share only with venue and promoter contacts upon contract execution. Do not distribute draft versions publicly.
              </p>
            </div>
            <RiderManagement />
          </>
        )}

        {activeTab === 'tasks' && <TourTasks />}

        {activeTab === 'timeline' && (
          <>
            <TimelineIntegration />
            <TourTasks />
          </>
        )}

      </div>
    </div>
  );
}
