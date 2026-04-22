import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Users, DollarSign, TrendingUp, AlertCircle, CheckCircle,
  Library, UserMinus, ArrowUpRight, BarChart2, Zap, Music,
  Calendar, Target, Activity, Flag,
} from 'lucide-react';
import { useCatalogClient } from '../../context/CatalogClientContext';
import { ALL_CATALOG_CLIENTS } from './COSRoster';
import { isClientDropped } from '../../data/catalogDropService';
import { getClientProfile } from '../../data/catalogClientProfiles';

const ACCENT = '#10B981';

const OPEN_TASKS = [
  { id: 'CT-001', title: 'Bassnectar — Live catalog audit completion',         client: 'Bassnectar',         assignee: 'GMG Catalog Team',  priority: 'high',   category: 'Ops'      },
  { id: 'CT-002', title: 'Santigold — "Disparate Youth" ad renewal contract', client: 'Santigold',          assignee: 'GMG Licensing',     priority: 'high',   category: 'Sync'     },
  { id: 'CT-003', title: 'Virgin Catalog — Rights clearance (2 releases)',     client: 'Virgin Catalog',     assignee: 'GMG Legal',         priority: 'urgent', category: 'Rights'   },
  { id: 'CT-004', title: 'Bassnectar — Electronic anthology sync outreach',    client: 'Bassnectar',         assignee: 'GMG Licensing',     priority: 'medium', category: 'Sync'     },
  { id: 'CT-005', title: 'Santigold — LP5 A&R brief to distribution',         client: 'Santigold',          assignee: 'GMG AI Operator',   priority: 'medium', category: 'Release'  },
  { id: 'CT-006', title: 'Virgin Catalog — Initial streaming baseline report', client: 'Virgin Catalog',     assignee: 'GMG Analytics',     priority: 'medium', category: 'Strategy' },
];

const TEAM_MEMBERS = [
  { name: 'GMG Catalog Team',  role: 'Catalog Operations Lead',  clients: ['Bassnectar', 'Santigold', 'Virgin Catalog'], openTasks: 3 },
  { name: 'GMG Licensing',     role: 'Sync & Licensing',         clients: ['Bassnectar', 'Santigold'],                   openTasks: 2 },
  { name: 'GMG Legal',         role: 'Rights & Contracts',       clients: ['Virgin Catalog', 'Santigold'],               openTasks: 2 },
  { name: 'GMG AI Operator',   role: 'Automated Operations',     clients: ['Santigold', 'Virgin Catalog'],               openTasks: 1 },
];

const PRIORITY_COLOR: Record<string, string> = {
  urgent: '#EF4444',
  high:   '#F59E0B',
  medium: '#06B6D4',
  low:    '#6B7280',
};

const CLIENT_IDS: Record<string, string> = {
  'a1000000-0000-0000-0000-000000000001': 'Bassnectar',
  'a2000000-0000-0000-0000-000000000002': 'Santigold',
  'a3000000-0000-0000-0000-000000000003': 'Virgin Catalog Artist',
};

export default function COSAdminView() {
  const navigate = useNavigate();
  const { clients } = useCatalogClient();
  const [sortMetric, setSortMetric] = useState<'revenue' | 'value' | 'health'>('revenue');

  const activeClients = ALL_CATALOG_CLIENTS.filter(c => !isClientDropped(c.id));
  const droppedCount  = ALL_CATALOG_CLIENTS.length - activeClients.length;

  const portfolioValue   = '$4.14M';
  const monthlyRevenue   = '$287K';
  const totalTasks       = OPEN_TASKS.length;
  const urgentTasks      = OPEN_TASKS.filter(t => t.priority === 'urgent').length;

  const sortedClients = useMemo(() => {
    return [...activeClients].sort((a, b) => {
      const parse = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
      if (sortMetric === 'revenue') return parse(b.monthlyRevenue) - parse(a.monthlyRevenue);
      if (sortMetric === 'value')   return parse(b.catalogValue)   - parse(a.catalogValue);
      if (sortMetric === 'health')  return b.health - a.health;
      return 0;
    });
  }, [activeClients, sortMetric]);

  return (
    <div className="p-5 space-y-6 min-h-full bg-[#08090B]">

      {/* Admin header */}
      <div className="bg-[#0D0E11] border border-[#10B981]/15 rounded-xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/12 border border-[#10B981]/25 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-bold text-white tracking-tight">Catalog OS — Admin Operations</h1>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded border text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20">
                INTERNAL ADMIN
              </span>
            </div>
            <p className="text-[11px] font-mono text-white/25 mt-0.5">
              Full portfolio access · {activeClients.length} active clients · Internal GMG view
            </p>
          </div>
          <div className="ml-auto flex items-center gap-6">
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#EF4444]">{urgentTasks}</p>
              <p className="text-[9px] font-mono text-white/25">Urgent</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#F59E0B]">{totalTasks}</p>
              <p className="text-[9px] font-mono text-white/25">Open Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-[20px] font-bold text-[#10B981]">{activeClients.length}</p>
              <p className="text-[9px] font-mono text-white/25">Active Clients</p>
            </div>
            {droppedCount > 0 && (
              <button
                onClick={() => navigate('/catalog/app/dropped-queue')}
                className="text-[9px] font-mono px-2.5 py-1.5 rounded border border-[#EF4444]/20 bg-[#EF4444]/08 text-[#EF4444]/70 hover:bg-[#EF4444]/14 transition-colors"
              >
                {droppedCount} Dropped
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: DollarSign,  label: 'Portfolio Value',    value: portfolioValue,   color: '#10B981', sub: 'Est. total catalog value'   },
          { icon: TrendingUp,  label: 'Monthly Revenue',    value: monthlyRevenue,   color: '#06B6D4', sub: 'Aggregate across clients'    },
          { icon: Users,       label: 'Active Clients',     value: `${activeClients.length}`,  color: '#F59E0B', sub: 'Fully managed portfolios'   },
          { icon: Activity,    label: 'Open Tasks',         value: `${totalTasks}`,  color: '#EF4444', sub: `${urgentTasks} urgent items` },
        ].map(item => (
          <div key={item.label} className="bg-[#0D0E11] border border-white/[0.07] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `${item.color}14`, border: `1px solid ${item.color}25` }}>
                <item.icon className="w-3 h-3" style={{ color: item.color }} />
              </div>
              <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-[22px] font-bold leading-none" style={{ color: item.color }}>{item.value}</p>
            <p className="text-[10px] text-white/25 mt-1.5">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Open Tasks */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
            <AlertCircle className="w-3.5 h-3.5 text-[#EF4444]" />
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Open Tasks</span>
            <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
              {OPEN_TASKS.length} open
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {OPEN_TASKS.map(task => {
              const clientEntry = ALL_CATALOG_CLIENTS.find(c => c.name.toLowerCase().includes(task.client.toLowerCase().split(' ')[0]));
              const accent = clientEntry?.accent ?? ACCENT;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => clientEntry && navigate(`/catalog/app/client/${clientEntry.id}`)}
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border"
                    style={{ background: `${accent}18`, borderColor: `${accent}30` }}>
                    <Library className="w-3 h-3" style={{ color: accent }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white/70 truncate">{task.title}</p>
                    <p className="text-[9px] font-mono text-white/25 mt-0.5">{task.assignee} · {task.category}</p>
                  </div>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border shrink-0"
                    style={{ color: PRIORITY_COLOR[task.priority], background: `${PRIORITY_COLOR[task.priority]}12`, borderColor: `${PRIORITY_COLOR[task.priority]}25` }}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Assignments */}
        <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.05]">
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Team Assignments</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full bg-[#10B981]/12 border border-[#10B981]/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-[#10B981]">{member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-white/80">{member.name}</p>
                  <p className="text-[9px] font-mono text-white/25 mt-0.5">{member.role}</p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {member.clients.map(c => (
                      <span key={c} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-white/35">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-bold text-[#F59E0B]">{member.openTasks}</p>
                  <p className="text-[8px] font-mono text-white/20">tasks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Portfolio */}
      <div className="bg-[#0D0E11] border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.05]">
          <Library className="w-3.5 h-3.5 text-[#10B981]" />
          <span className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Client Portfolio</span>
          <div className="ml-auto flex items-center gap-1">
            {(['revenue', 'value', 'health'] as const).map(m => (
              <button
                key={m}
                onClick={() => setSortMetric(m)}
                className="text-[8px] font-mono px-2 py-1 rounded transition-colors"
                style={{
                  background: sortMetric === m ? `${ACCENT}15` : 'transparent',
                  color: sortMetric === m ? ACCENT : 'rgba(255,255,255,0.25)',
                  border: `1px solid ${sortMetric === m ? `${ACCENT}30` : 'transparent'}`,
                }}
              >
                {m.toUpperCase()}
              </button>
            ))}
            <button
              onClick={() => navigate('/catalog/app/roster')}
              className="text-[8px] font-mono px-2.5 py-1.5 rounded border ml-2 transition-colors"
              style={{ borderColor: `${ACCENT}30`, color: ACCENT, background: `${ACCENT}08` }}
            >
              Full Roster
            </button>
          </div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {sortedClients.map(c => {
            const profile = getClientProfile(c.id);
            const acc = c.accent;
            const dropped = isClientDropped(c.id);
            if (dropped) return null;
            return (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                onClick={() => navigate(`/catalog/app/client/${c.id}`)}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ background: `${acc}14`, borderColor: `${acc}25` }}>
                  <Library className="w-4 h-4" style={{ color: acc }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-white/85">{c.name}</p>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                      style={{ color: acc, background: `${acc}10`, borderColor: `${acc}25` }}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-white/25 mt-0.5">{c.genre} · Since {c.clientSince}</p>
                </div>
                <div className="hidden sm:flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-white/70">{c.monthlyRevenue}</p>
                    <p className="text-[8px] font-mono text-white/20">mo. revenue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-white/70">{c.catalogValue}</p>
                    <p className="text-[8px] font-mono text-white/20">catalog value</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${c.health}%`, background: c.health >= 70 ? '#10B981' : c.health >= 45 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <p className="text-[11px] font-bold" style={{ color: c.health >= 70 ? '#10B981' : c.health >= 45 ? '#F59E0B' : '#EF4444' }}>{c.health}</p>
                    </div>
                    <p className="text-[8px] font-mono text-white/20 text-right">health</p>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Catalog Clients',  icon: Users,      path: '/catalog/app/roster',        color: '#10B981' },
          { label: 'Dropped Queue',    icon: UserMinus,  path: '/catalog/app/dropped-queue',  color: '#EF4444' },
          { label: 'Tasks',            icon: CheckCircle, path: '/catalog/app/tasks',         color: '#F59E0B' },
          { label: 'Revenue',          icon: DollarSign, path: '/catalog/app/revenue',        color: '#06B6D4' },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="bg-[#0D0E11] border border-white/[0.07] rounded-xl p-4 flex flex-col items-center gap-2 hover:border-white/[0.12] transition-all group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}>
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <span className="text-[10px] font-mono text-white/35 group-hover:text-white/55 transition-colors">{item.label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
