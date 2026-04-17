import { Globe, Building2, RefreshCw, CheckCircle, Clock, AlertCircle, Link } from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import { BN_ENTITIES_DETAIL, BN_CONNECTED_ACCOUNTS } from '../../data/bassnectarCatalogData';

const BUSINESS_ENTITIES = BN_ENTITIES_DETAIL;
const CONNECTED_ACCOUNTS = BN_CONNECTED_ACCOUNTS;

const ENTITY_TYPE_META: Record<string, { color: string }> = {
  'Record Label':    { color: '#10B981' },
  'Music Publisher': { color: '#06B6D4' },
  'Touring Entity':  { color: '#F59E0B' },
  'Merchandise':     { color: '#EC4899' },
  'IP Holding Trust':{ color: '#3B82F6' },
};

const ACCOUNT_STATUS_META: Record<string, { color: string; label: string; icon: typeof CheckCircle }> = {
  connected: { color: '#10B981', label: 'Connected', icon: CheckCircle  },
  pending:   { color: '#F59E0B', label: 'Pending',   icon: Clock        },
  error:     { color: '#EF4444', label: 'Error',     icon: AlertCircle  },
};

const ACCOUNT_TYPE_META: Record<string, { color: string }> = {
  Streaming:   { color: '#1DB954' },
  Video:       { color: '#FF0000' },
  Social:      { color: '#06B6D4' },
  Licensing:   { color: '#F59E0B' },
  Finance:     { color: '#10B981' },
  Accounting:  { color: '#3B82F6' },
  Royalties:   { color: '#EC4899' },
};

export default function COSEntities() {
  const connected = CONNECTED_ACCOUNTS.filter(a => a.status === 'connected').length;
  const pending   = CONNECTED_ACCOUNTS.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Globe}
        title="Connected Accounts + Business Entities"
        subtitle="Legal entities, platform integrations, and data source status"
        accentColor="#06B6D4"
      />
      <div className="p-5 space-y-5">

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Business Entities', value: BUSINESS_ENTITIES.length.toString(), color: '#06B6D4' },
            { label: 'Connected Accounts',value: connected.toString(),                 color: '#10B981' },
            { label: 'Pending Auth',       value: pending.toString(),                  color: '#F59E0B' },
            { label: 'Data Sync Active',   value: `${connected}/${CONNECTED_ACCOUNTS.length}`, color: '#3B82F6' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
              <p className="text-[9.5px] font-mono text-white/25 uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Business Entities */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Building2 className="w-3 h-3 text-[#06B6D4]" /> Legal Entities
          </p>
          <div className="bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Entity', 'Type', 'Role', 'Jurisdiction', 'EIN', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-mono text-white/20 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {BUSINESS_ENTITIES.map(e => {
                  const tm = ENTITY_TYPE_META[e.type] ?? { color: '#6B7280' };
                  return (
                    <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="text-[12px] font-medium text-white/80">{e.name}</p>
                        <p className="text-[9.5px] font-mono text-white/20">{e.id}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded"
                          style={{ color: tm.color, background: `${tm.color}14` }}>{e.type}</span>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-white/50">{e.role}</td>
                      <td className="px-4 py-3 text-[11px] text-white/40">{e.jurisdiction}</td>
                      <td className="px-4 py-3 text-[11px] font-mono text-white/30">{e.ein}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-[10px] font-mono text-[#10B981]">{e.status}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connected Accounts */}
        <div>
          <p className="text-[9.5px] font-mono text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Link className="w-3 h-3 text-[#10B981]" /> Connected Platforms
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {CONNECTED_ACCOUNTS.map(acc => {
              const sm = ACCOUNT_STATUS_META[acc.status] ?? ACCOUNT_STATUS_META.pending;
              const tm = ACCOUNT_TYPE_META[acc.type] ?? { color: '#6B7280' };
              const StatusIcon = sm.icon;
              return (
                <div key={acc.id} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl px-4 py-3.5 flex items-center gap-3.5 hover:border-white/[0.1] transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${tm.color}12`, border: `1px solid ${tm.color}1C` }}>
                    <Globe className="w-4 h-4" style={{ color: tm.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[12px] font-medium text-white/80 truncate">{acc.platform}</p>
                      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded shrink-0"
                        style={{ color: tm.color, background: `${tm.color}12` }}>{acc.type}</span>
                    </div>
                    <p className="text-[10px] text-white/30 truncate">{acc.data}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end mb-0.5">
                      <StatusIcon className="w-3.5 h-3.5" style={{ color: sm.color }} />
                      <span className="text-[9.5px] font-mono" style={{ color: sm.color }}>{sm.label}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <RefreshCw className="w-2.5 h-2.5 text-white/15" />
                      <span className="text-[9px] text-white/20">{acc.last_sync}</span>
                    </div>
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
