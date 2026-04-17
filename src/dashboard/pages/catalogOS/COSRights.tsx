import { useState } from 'react';
import {
  FileText, AlertTriangle, CheckCircle, Clock, Shield,
  Scale, Lock, DollarSign, User, Building2, Globe,
  RefreshCw, Plus, Eye, Download, AlertCircle,
  ChevronDown, ChevronUp, XCircle, Info, Gavel,
  BadgeCheck, FileLock2, CreditCard, Receipt, Fingerprint,
  ShieldAlert, ShieldCheck, Wifi, FileWarning, ArrowUpRight,
} from 'lucide-react';
import CatalogPageHeader from './CatalogPageHeader';
import {
  BN_RIGHTS_OVERVIEW, BN_SPLITS, BN_MISSING_DOCS,
  BN_CONTRACTS, BN_CONTRACT_RENEWALS, BN_NDA_TRACKING,
  BN_RELEASES_LIABILITY, BN_FINANCIAL_DOCS, BN_CYBER_PROTECTION,
} from '../../data/bassnectarCatalogData';

const ACCENT = '#3B82F6';

// ── DATA (imported from bassnectarCatalogData.ts) ─────────────────────────────

const RIGHTS_OVERVIEW  = BN_RIGHTS_OVERVIEW;
const SPLITS           = BN_SPLITS;
const MISSING_DOCS     = BN_MISSING_DOCS;
const CONTRACTS        = BN_CONTRACTS;
const RENEWALS         = BN_CONTRACT_RENEWALS;
const NDA_TRACKING     = BN_NDA_TRACKING;
const RELEASES_LIABILITY = BN_RELEASES_LIABILITY;
const FINANCIAL_DOCS   = BN_FINANCIAL_DOCS;
const CYBER_PROTECTION = BN_CYBER_PROTECTION;

// ── HELPERS ───────────────────────────────────────────────────────────────────
// DELETED: legacy local data arrays replaced by imports from bassnectarCatalogData.ts

// ── HELPERS ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  clean: '#10B981', review: '#F59E0B', conflict: '#EF4444', expiring: '#EF4444',
  active: '#10B981', pending: '#F59E0B', issue: '#EF4444', complete: '#10B981',
  partial: '#F59E0B', signed: '#10B981', missing: '#EF4444', on_file: '#10B981',
  issued: '#06B6D4', paid: '#10B981', placeholder: '#6B7280', disputed: '#EF4444',
};
const STATUS_LABEL: Record<string, string> = {
  clean: 'Clean', review: 'Under Review', conflict: 'Conflict', expiring: 'Expiring',
  active: 'Active', pending: 'Pending', issue: 'Issue', complete: 'Complete',
  partial: 'Partial', signed: 'Signed', missing: 'MISSING', on_file: 'On File',
  issued: 'Issued', paid: 'Paid', placeholder: 'Placeholder', disputed: 'Disputed',
};

function PillBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded shrink-0"
      style={{ color, background: `${color}14`, border: `1px solid ${color}22` }}>
      {label.toUpperCase()}
    </span>
  );
}

function SectionLabel({ label, color = '#3B82F6', icon: Icon }: {
  label: string; color?: string; icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />}
      <p className="text-[9.5px] font-mono text-white/30 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function BlockCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0B0D10] border border-white/[0.06] rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
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

// ── SECTION: RIGHTS / SPLITS ─────────────────────────────────────────────────

function RightsSplits() {
  const [showAllRights, setShowAllRights] = useState(false);
  const conflicts = RIGHTS_OVERVIEW.filter(r => r.status === 'conflict');
  const missing   = MISSING_DOCS.filter(d => d.blocking_payment);
  const visibleRights = showAllRights ? RIGHTS_OVERVIEW : RIGHTS_OVERVIEW.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Rights Records',     value: RIGHTS_OVERVIEW.length, color: '#3B82F6' },
          { label: 'Clean',              value: RIGHTS_OVERVIEW.filter(r => r.status === 'clean').length, color: '#10B981' },
          { label: 'Under Review',       value: RIGHTS_OVERVIEW.filter(r => r.status === 'review').length, color: '#F59E0B' },
          { label: 'Active Conflicts',   value: conflicts.length, color: '#EF4444' },
        ].map(m => (
          <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4 hover:border-white/[0.09] transition-all">
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide mb-1">{m.label}</p>
            <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {conflicts.length > 0 && (
        <div className="bg-[#EF4444]/[0.06] border border-[#EF4444]/25 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <p className="text-[11.5px] font-semibold text-[#EF4444]">{conflicts.length} Active Rights Conflict{conflicts.length > 1 ? 's' : ''} — Exploitation Hold</p>
          </div>
          {conflicts.map(c => (
            <div key={c.id} className="pl-6 text-[10.5px] text-[#EF4444]/70">
              <span className="font-mono text-[#EF4444]/50 mr-2">{c.id}</span>{c.asset} — {c.type}: {c.notes}
            </div>
          ))}
        </div>
      )}

      {missing.length > 0 && (
        <div className="bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <FileWarning className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <p className="text-[11.5px] font-semibold text-[#F59E0B]">{missing.length} Missing Documents — Payments Blocked</p>
          </div>
          {missing.map(d => (
            <div key={d.id} className="pl-6 text-[10.5px] text-[#F59E0B]/70">
              <span className="font-mono text-[#F59E0B]/40 mr-2">{d.id}</span>{d.asset} — {d.doc}
            </div>
          ))}
        </div>
      )}

      <BlockCard>
        <SectionHeader icon={Scale} color="#3B82F6" title="Rights Overview" sub="Master + Publishing · Ownership % · Territory · Term" />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['ID', 'Asset', 'Type', 'Ownership', 'Publisher', 'Territory', 'Term', 'Splits Locked', 'Status', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {visibleRights.map(r => {
                const col = STATUS_COLOR[r.status] ?? '#6B7280';
                return (
                  <tr key={r.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 text-[9px] font-mono text-white/20 whitespace-nowrap">{r.id}</td>
                    <td className="px-4 py-3 max-w-[160px]"><p className="text-[11px] font-medium text-white/70 truncate">{r.asset}</p></td>
                    <td className="px-4 py-3 whitespace-nowrap"><PillBadge label={r.type} color="#3B82F6" /></td>
                    <td className="px-4 py-3 text-[12px] font-bold whitespace-nowrap" style={{ color: r.ownership === '100%' ? '#10B981' : '#F59E0B' }}>{r.ownership}</td>
                    <td className="px-4 py-3 text-[10px] text-white/35 whitespace-nowrap">{r.publisher}</td>
                    <td className="px-4 py-3 text-[10px] font-mono text-white/30 whitespace-nowrap">{r.territory}</td>
                    <td className="px-4 py-3 text-[10px] font-mono text-white/30 whitespace-nowrap">{r.term}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.splits_locked
                        ? <span className="flex items-center gap-1 text-[10px] font-mono text-[#10B981]"><BadgeCheck className="w-3 h-3" /> Locked</span>
                        : <span className="flex items-center gap-1 text-[10px] font-mono text-[#F59E0B]"><Clock className="w-3 h-3" /> Pending</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap"><PillBadge label={STATUS_LABEL[r.status] ?? r.status} color={col} /></td>
                    <td className="px-4 py-3 text-[9.5px] text-white/25 max-w-[200px]"><p className="truncate">{r.notes}</p></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {RIGHTS_OVERVIEW.length > 6 && (
          <button onClick={() => setShowAllRights(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] text-white/25 hover:text-white/50 border-t border-white/[0.04] transition-colors">
            {showAllRights ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show {RIGHTS_OVERVIEW.length - 6} More</>}
          </button>
        )}
      </BlockCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlockCard>
          <SectionHeader icon={FileText} color="#06B6D4" title="Split Sheets" sub="Per-asset co-write splits and signature status" />
          <div className="divide-y divide-white/[0.03]">
            {SPLITS.map(s => (
              <div key={s.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.015] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-white/70 truncate">{s.asset}</p>
                  <p className="text-[9.5px] text-white/30">{s.party} — {s.role}</p>
                </div>
                <p className="text-[13px] font-bold shrink-0" style={{ color: s.pct === '100%' ? '#10B981' : '#06B6D4' }}>{s.pct}</p>
                <div className="shrink-0 w-20 text-right">
                  {s.signed
                    ? <span className="flex items-center justify-end gap-1 text-[9.5px] text-[#10B981]"><CheckCircle className="w-3 h-3" /> Signed</span>
                    : <span className="flex items-center justify-end gap-1 text-[9.5px] text-[#EF4444]"><XCircle className="w-3 h-3" /> {s.doc === 'DISPUTED' ? 'Disputed' : 'Unsigned'}</span>}
                </div>
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard>
          <SectionHeader icon={FileWarning} color="#EF4444" title="Missing Documents" sub="Items required before exploitation or payment" />
          <div className="divide-y divide-white/[0.03]">
            {MISSING_DOCS.map(d => (
              <div key={d.id} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.015] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] font-semibold text-white/65 truncate">{d.doc}</p>
                  <p className="text-[9px] text-white/25">{d.asset}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <PillBadge label={d.priority} color={d.priority === 'high' ? '#EF4444' : d.priority === 'medium' ? '#F59E0B' : '#6B7280'} />
                  {d.blocking_payment && (
                    <span className="text-[8px] font-mono font-bold text-[#EF4444] bg-[#EF4444]/10 px-1.5 py-0.5 rounded border border-[#EF4444]/20">
                      BLOCKS PAYMENT
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </BlockCard>
      </div>
    </div>
  );
}

// ── SECTION: CONTRACTS ────────────────────────────────────────────────────────

function ContractsSection() {
  const [showAll, setShowAll] = useState(false);
  const issues = CONTRACTS.filter(c => c.status === 'issue');
  const pending = CONTRACTS.filter(c => c.status === 'pending');
  const visible = showAll ? CONTRACTS : CONTRACTS.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'Total Agreements', value: CONTRACTS.length, color: '#3B82F6' },
          { label: 'Active', value: CONTRACTS.filter(c => c.status === 'active').length, color: '#10B981' },
          { label: 'Pending / Unsigned', value: pending.length, color: '#F59E0B' },
          { label: 'Issues', value: issues.length, color: '#EF4444' },
        ].map(m => (
          <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide mb-1">{m.label}</p>
            <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      {issues.length > 0 && (
        <div className="bg-[#EF4444]/[0.06] border border-[#EF4444]/25 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <p className="text-[11.5px] font-semibold text-[#EF4444]">{issues.length} Contract with Active Issues — Legal Review Required</p>
          </div>
          {issues.map(c => (
            <p key={c.id} className="pl-6 text-[10.5px] text-[#EF4444]/70">{c.title}: {c.notes}</p>
          ))}
        </div>
      )}

      <BlockCard>
        <SectionHeader icon={Gavel} color="#3B82F6" title="All Agreements" sub="Active · Pending · Under Review" right={
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
            <Plus className="w-3 h-3" /> Add Agreement
          </button>
        } />
        <div className="divide-y divide-white/[0.03]">
          {visible.map(c => {
            const col = STATUS_COLOR[c.status] ?? '#6B7280';
            return (
              <div key={c.id} className="px-5 py-4 flex items-start gap-4 hover:bg-white/[0.015] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${col}10`, border: `1px solid ${col}18` }}>
                  <FileText className="w-3.5 h-3.5" style={{ color: col }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[12px] font-semibold text-white/80">{c.title}</p>
                    <PillBadge label={c.type} color="#3B82F6" />
                    <PillBadge label={STATUS_LABEL[c.status] ?? c.status} color={col} />
                    {!c.signed && <PillBadge label="Unsigned" color="#F59E0B" />}
                    {c.issues && <PillBadge label="Issue" color="#EF4444" />}
                  </div>
                  <p className="text-[10px] text-white/30">{c.parties.join(' · ')}</p>
                  {c.notes && <p className="text-[9.5px] text-white/25 mt-1 italic">{c.notes}</p>}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-mono text-white/35">{c.effective} — {c.expires}</p>
                  <p className="text-[11px] font-bold mt-0.5" style={{ color: '#10B981' }}>{c.value}</p>
                  <p className="text-[8.5px] font-mono text-white/20 mt-0.5">Renew: {c.renewal}</p>
                </div>
              </div>
            );
          })}
        </div>
        {CONTRACTS.length > 5 && (
          <button onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] text-white/25 hover:text-white/50 border-t border-white/[0.04] transition-colors">
            {showAll ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show {CONTRACTS.length - 5} More</>}
          </button>
        )}
      </BlockCard>

      <BlockCard>
        <SectionHeader icon={RefreshCw} color="#F59E0B" title="Renewal Calendar" sub="Upcoming contract decision windows" />
        <div className="divide-y divide-white/[0.03]">
          {RENEWALS.map(r => {
            const col = PRIORITY_COLOR[r.priority];
            return (
              <div key={r.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.015] transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-medium text-white/70">{r.contract}</p>
                  <p className="text-[9.5px] text-white/30 mt-0.5">{r.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-bold" style={{ color: col }}>{r.deadline}</p>
                  <p className="text-[9px] font-mono text-white/25">{r.days_out} days out</p>
                </div>
                <PillBadge label={r.priority} color={col} />
              </div>
            );
          })}
        </div>
      </BlockCard>
    </div>
  );
}

const PRIORITY_COLOR: Record<string, string> = {
  high: '#EF4444', medium: '#F59E0B', low: '#6B7280',
};

// ── SECTION: SECURITY / PROTECTION ───────────────────────────────────────────

function SecuritySection() {
  const pendingNDAs = NDA_TRACKING.filter(n => n.status === 'pending');
  const partialReleases = RELEASES_LIABILITY.filter(r => r.status !== 'complete');

  return (
    <div className="space-y-4">
      {pendingNDAs.length > 0 && (
        <div className="bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <p className="text-[11px] text-[#F59E0B]/80">{pendingNDAs.length} NDA{pendingNDAs.length > 1 ? 's' : ''} pending signature — {pendingNDAs.map(n => n.party).join(', ')}</p>
        </div>
      )}

      <BlockCard>
        <SectionHeader icon={FileLock2} color="#06B6D4" title="NDA + Confidentiality Tracking"
          sub={`${NDA_TRACKING.length} parties tracked · ${NDA_TRACKING.filter(n => n.status === 'signed').length} signed · ${pendingNDAs.length} pending`}
          right={
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <Plus className="w-3 h-3" /> Add NDA
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['Party', 'Type', 'Status', 'Signed', 'Expiry', 'Scope'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {NDA_TRACKING.map(n => {
                const col = n.status === 'signed' ? '#10B981' : '#F59E0B';
                return (
                  <tr key={n.id} className="hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3 max-w-[200px]"><p className="text-[11px] font-medium text-white/70 truncate">{n.party}</p></td>
                    <td className="px-4 py-3 whitespace-nowrap"><PillBadge label={n.type} color="#06B6D4" /></td>
                    <td className="px-4 py-3 whitespace-nowrap"><PillBadge label={n.status === 'signed' ? 'Signed' : 'Pending'} color={col} /></td>
                    <td className="px-4 py-3 text-[10px] font-mono text-white/35 whitespace-nowrap">{n.signed_date}</td>
                    <td className="px-4 py-3 text-[10px] font-mono text-white/35 whitespace-nowrap">{n.expiry}</td>
                    <td className="px-4 py-3 text-[9.5px] text-white/25 max-w-[250px]"><p className="truncate">{n.scope}</p></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BlockCard>

      <BlockCard>
        <SectionHeader icon={BadgeCheck} color="#10B981" title="Release + Liability Tracking"
          sub="Session musician releases · Photography · UGC · Sync · Tour crew" />
        <div className="divide-y divide-white/[0.03]">
          {RELEASES_LIABILITY.map(r => {
            const col = STATUS_COLOR[r.status] ?? '#6B7280';
            return (
              <div key={r.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-white/[0.015] transition-colors">
                <div className="shrink-0 mt-0.5">
                  {r.status === 'complete'
                    ? <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    : r.status === 'partial'
                    ? <ShieldAlert className="w-4 h-4 text-[#F59E0B]" />
                    : <ShieldAlert className="w-4 h-4 text-[#6B7280]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-medium text-white/70">{r.doc}</p>
                  <p className="text-[9.5px] text-white/30 mt-0.5">{r.notes}</p>
                </div>
                <PillBadge label={STATUS_LABEL[r.status] ?? r.status} color={col} />
              </div>
            );
          })}
        </div>
      </BlockCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlockCard>
          <SectionHeader icon={Wifi} color="#6B7280" title="Cyber Protection"
            sub="Data security · Access controls · Encryption — Integration pending" />
          <div className="divide-y divide-white/[0.03]">
            {CYBER_PROTECTION.map(c => (
              <div key={c.id} className="px-5 py-3.5 flex items-start gap-3">
                <Lock className="w-3.5 h-3.5 text-white/20 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-white/55">{c.area}</p>
                  <p className="text-[9.5px] text-white/25 mt-0.5">{c.note}</p>
                </div>
                <PillBadge label="Placeholder" color="#6B7280" />
              </div>
            ))}
          </div>
        </BlockCard>

        <BlockCard>
          <SectionHeader icon={ShieldAlert} color="#6B7280" title="General Protection / Risk"
            sub="Business risk tracking — Integration pending" />
          <div className="p-5 space-y-3">
            {[
              { area: 'General Liability Insurance',    note: 'Certificate of insurance placeholder. Vendor / event coverage tracking in development.'  },
              { area: 'E&O / Professional Liability',   note: 'Errors & omissions tracking pending. Required for sync and brand licensing workflows.'   },
              { area: 'IP Infringement Monitoring',     note: 'Catalog monitoring integration (e.g., Content ID conflicts, DMCA) in development.'        },
              { area: 'Contract Breach / Dispute Log',  note: 'Dispute tracking and legal hold workflow in development. Into The Sun conflict active.'    },
              { area: 'Tax / Compliance Reporting',     note: '1099 issuance tracking and royalty withholding compliance reporting in development.'       },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-white/[0.04] last:border-0 last:pb-0">
                <AlertCircle className="w-3.5 h-3.5 text-white/15 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-medium text-white/45">{item.area}</p>
                  <p className="text-[9.5px] text-white/20 mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </BlockCard>
      </div>
    </div>
  );
}

// ── SECTION: FINANCIAL / LEGAL READINESS ─────────────────────────────────────

function FinancialReadiness() {
  const [showAll, setShowAll] = useState(false);
  const blocking = FINANCIAL_DOCS.filter(d => d.blocking_payment && d.status === 'missing');
  const visible = showAll ? FINANCIAL_DOCS : FINANCIAL_DOCS.slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="bg-[#EF4444]/[0.06] border border-[#EF4444]/25 rounded-xl px-5 py-4 space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#EF4444] shrink-0" />
          <p className="text-[13px] font-bold text-[#EF4444]">Payment Policy — No Exceptions</p>
        </div>
        <p className="text-[11px] text-[#EF4444]/75 leading-relaxed pl-7">
          No payments of any kind will be issued until all required documentation is on file. This includes W9 / tax forms, ACH / banking information, a fully executed contract, and — where applicable — a signed split sheet. Incomplete documentation results in an automatic payment hold. This policy applies to all parties without exception, including featured artists, session musicians, producers, and collaborators.
        </p>
        {blocking.length > 0 && (
          <div className="pl-7 pt-1">
            <p className="text-[10px] font-mono text-[#EF4444]/60 uppercase tracking-wide mb-1">Currently blocking {blocking.length} payment{blocking.length > 1 ? 's' : ''}:</p>
            {blocking.map(d => (
              <p key={d.id} className="text-[10px] text-[#EF4444]/60">· {d.party} — {d.doc}</p>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { label: 'On File', value: FINANCIAL_DOCS.filter(d => d.status === 'on_file').length, color: '#10B981' },
          { label: 'Missing', value: FINANCIAL_DOCS.filter(d => d.status === 'missing').length, color: '#EF4444' },
          { label: 'Blocking Payment', value: blocking.length, color: '#EF4444' },
          { label: 'Invoices Tracked', value: FINANCIAL_DOCS.filter(d => d.doc.includes('Invoice')).length, color: '#06B6D4' },
        ].map(m => (
          <div key={m.label} className="bg-[#0B0D10] border border-white/[0.06] rounded-xl p-4">
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-wide mb-1">{m.label}</p>
            <p className="text-[22px] font-bold" style={{ color: m.color }}>{m.value}</p>
          </div>
        ))}
      </div>

      <BlockCard>
        <SectionHeader
          icon={Receipt} color="#10B981"
          title="Financial Documentation Registry"
          sub="W9 · EIN · ACH · Invoices · Payment status per party"
          right={
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <Plus className="w-3 h-3" /> Add Doc
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['ID', 'Party', 'Document', 'Status', 'Blocks Payment', 'File', 'Notes'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-[9px] font-mono text-white/20 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {visible.map(d => {
                const col = STATUS_COLOR[d.status] ?? '#6B7280';
                return (
                  <tr key={d.id} className={`hover:bg-white/[0.015] transition-colors ${d.blocking_payment && d.status === 'missing' ? 'bg-[#EF4444]/[0.03]' : ''}`}>
                    <td className="px-4 py-3 text-[9px] font-mono text-white/20 whitespace-nowrap">{d.id}</td>
                    <td className="px-4 py-3 max-w-[160px]"><p className="text-[11px] font-medium text-white/65 truncate">{d.party}</p></td>
                    <td className="px-4 py-3 max-w-[180px]"><p className="text-[11px] text-white/60 truncate">{d.doc}</p></td>
                    <td className="px-4 py-3 whitespace-nowrap"><PillBadge label={STATUS_LABEL[d.status] ?? d.status} color={col} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {d.blocking_payment
                        ? <span className="text-[9px] font-mono font-bold text-[#EF4444]">YES</span>
                        : <span className="text-[9px] font-mono text-white/20">—</span>}
                    </td>
                    <td className="px-4 py-3 text-[9.5px] font-mono whitespace-nowrap"
                      style={{ color: d.file ? '#06B6D4' : '#6B7280' }}>
                      {d.file ? (
                        <button className="flex items-center gap-1 hover:underline"><Eye className="w-3 h-3" /> {d.file}</button>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-[9.5px] text-white/25 max-w-[220px]"><p className="truncate">{d.notes}</p></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {FINANCIAL_DOCS.length > 8 && (
          <button onClick={() => setShowAll(v => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[10.5px] text-white/25 hover:text-white/50 border-t border-white/[0.04] transition-colors">
            {showAll ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show {FINANCIAL_DOCS.length - 8} More</>}
          </button>
        )}
      </BlockCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            icon: User, color: '#10B981', title: 'W9 / Tax Status',
            items: FINANCIAL_DOCS.filter(d => d.doc === 'W9'),
            emptyMsg: 'No W9 records found.',
          },
          {
            icon: CreditCard, color: '#06B6D4', title: 'ACH / Banking Status',
            items: FINANCIAL_DOCS.filter(d => d.doc === 'ACH / Banking'),
            emptyMsg: 'No ACH records found.',
          },
          {
            icon: Receipt, color: '#F59E0B', title: 'Invoice Status',
            items: FINANCIAL_DOCS.filter(d => d.doc.includes('Invoice')),
            emptyMsg: 'No invoices found.',
          },
        ].map(({ icon: Icon, color, title, items }) => (
          <BlockCard key={title}>
            <SectionHeader icon={Icon} color={color} title={title} sub={`${items.filter(i => i.status === 'on_file' || i.status === 'paid').length}/${items.length} complete`} />
            <div className="divide-y divide-white/[0.03]">
              {items.map(d => {
                const col = STATUS_COLOR[d.status] ?? '#6B7280';
                return (
                  <div key={d.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.015] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-white/65 truncate">{d.party}</p>
                      <p className="text-[9px] text-white/25 truncate">{d.notes}</p>
                    </div>
                    <PillBadge label={STATUS_LABEL[d.status] ?? d.status} color={col} />
                    {d.blocking_payment && d.status === 'missing' && (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </BlockCard>
        ))}
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

type TabId = 'rights' | 'contracts' | 'security' | 'financial';

export default function COSRights() {
  const [activeTab, setActiveTab] = useState<TabId>('rights');

  const allConflicts = RIGHTS_OVERVIEW.filter(r => r.status === 'conflict').length
    + CONTRACTS.filter(c => c.status === 'issue').length;
  const allMissing = MISSING_DOCS.filter(d => d.blocking_payment).length
    + FINANCIAL_DOCS.filter(d => d.blocking_payment && d.status === 'missing').length;

  const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'rights',    label: 'Rights + Splits',    icon: Scale,       badge: RIGHTS_OVERVIEW.filter(r => r.status === 'conflict').length || undefined },
    { id: 'contracts', label: 'Contracts',           icon: Gavel,       badge: CONTRACTS.filter(c => c.status === 'issue' || c.status === 'pending').length || undefined },
    { id: 'security',  label: 'Security',            icon: Shield,      badge: NDA_TRACKING.filter(n => n.status === 'pending').length || undefined },
    { id: 'financial', label: 'Financial / Legal',   icon: DollarSign,  badge: FINANCIAL_DOCS.filter(d => d.status === 'missing' && d.blocking_payment).length || undefined },
  ];

  return (
    <div className="min-h-full bg-[#07080A]">
      <CatalogPageHeader
        icon={Scale}
        title="Rights + Contracts + Compliance"
        subtitle="Rights · Splits · Contracts · NDA · Financial Docs · Payment Policy"
        accentColor={ACCENT}
        badge={allConflicts > 0 || allMissing > 0 ? `${allConflicts + allMissing} Items Need Attention` : 'All Systems'}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/60 transition-all">
              <Download className="w-3 h-3" /> Export
            </button>
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[#3B82F6]/25 bg-[#3B82F6]/[0.07] text-[10.5px] text-[#3B82F6] hover:bg-[#3B82F6]/[0.12] transition-all">
              <ArrowUpRight className="w-3 h-3" /> Send to Legal
            </button>
          </div>
        }
      />

      {(allConflicts > 0 || allMissing > 0) && (
        <div className="mx-5 mt-4 flex items-start gap-3 bg-[#EF4444]/[0.05] border border-[#EF4444]/20 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#EF4444]/80 leading-snug">
            <span className="font-bold">{allConflicts} active conflict{allConflicts !== 1 ? 's' : ''}</span> and <span className="font-bold">{allMissing} payment-blocking missing document{allMissing !== 1 ? 's' : ''}</span> require immediate attention. Review Rights + Splits and Financial / Legal tabs.
          </p>
        </div>
      )}

      <div className="flex items-center gap-1 px-5 pt-4 border-b border-white/[0.05] overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-3.5 py-2.5 text-[11.5px] font-medium transition-all border-b-2 -mb-[1px] whitespace-nowrap shrink-0 relative"
              style={{
                color: active ? ACCENT : 'rgba(255,255,255,0.3)',
                borderBottomColor: active ? ACCENT : 'transparent',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-0.5 min-w-[16px] h-4 flex items-center justify-center text-[8px] font-bold rounded-full bg-[#EF4444] text-white px-1">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-5">
        {activeTab === 'rights'    && <RightsSplits />}
        {activeTab === 'contracts' && <ContractsSection />}
        {activeTab === 'security'  && <SecuritySection />}
        {activeTab === 'financial' && <FinancialReadiness />}
      </div>
    </div>
  );
}
