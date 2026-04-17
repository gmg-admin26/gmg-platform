import { useEffect, useState } from 'react';
import {
  Target, AlertTriangle, CheckCircle2, Activity, Archive, Building2,
  Calendar, FileText, DollarSign, Wallet, Shield, MessageSquare,
  Zap, TrendingUp, Clock, Flame, Brain,
} from 'lucide-react';
import ExecSummaryStrip from '../../components/ops/ExecSummaryStrip';
import GlobalSignalMonitor from '../../components/ops/GlobalSignalMonitor';
import OpsHealthPanel from '../../components/ops/OpsHealthPanel';
import FinanceCommand from '../../components/ops/FinanceCommand';
import ContractDealFlow from '../../components/ops/ContractDealFlow';
import TeamPerformance from '../../components/ops/TeamPerformance';
import CalendarIntel from '../../components/ops/CalendarIntel';
import PartnerPipeline from '../../components/ops/PartnerPipeline';
import AIExecInsight from '../../components/ops/AIExecInsight';
import { AdminPage, AdminCard, Pill, StatTile, CommandRow } from '../shared';
import { AIOperationsStatus } from '../AgentPanel';
import { supabase } from '../../../lib/supabase';

interface Digest {
  id: string;
  period: string;
  title: string;
  summary: string;
  decisions_needed: number;
  blocked_items: number;
  ready_items: number;
  what_changed: string;
  published_at: string;
}

const TOP_PRIORITIES = [
  { icon: Flame,          color: '#EF4444', title: 'ZARA VEX — momentum +847%, rollout decision needed',      meta: 'OWNER: Paula · DUE: today' },
  { icon: FileText,       color: '#06B6D4', title: 'Gallagher policy package — final signature block',       meta: 'OWNER: Counsel · DUE: 2d'  },
  { icon: DollarSign,     color: '#10B981', title: 'Q2 payout queue — 4 deliverables staged for release',   meta: 'OWNER: Ledger · DUE: today' },
  { icon: Building2,      color: '#F59E0B', title: 'Banc of California — fractional structure docs',         meta: 'OWNER: Vault · DUE: 3d'    },
  { icon: Brain,          color: '#EC4899', title: 'SignalOps — recommend pausing 2 under-performing ads',   meta: 'OWNER: Signal · DUE: today'},
];

const RISK_BLOCKS = [
  { icon: AlertTriangle, color: '#EF4444', title: 'Contract renewal notice — 14d window on catalog deal', meta: 'Notice path: Counsel → Paula'    },
  { icon: Shield,        color: '#F59E0B', title: 'Cyber policy renewal past due by 3 days',              meta: 'Shield requesting approval'      },
  { icon: Wallet,        color: '#EC4899', title: 'ACH routing blocked for 1 worker (banking mismatch)',   meta: 'Vault holding safe'              },
];

const DECISIONS_NEEDED = [
  { title: 'Approve ZARA VEX rollout plan',                   meta: 'Paula + Randy' },
  { title: 'Sign Gallagher coverage package',                 meta: 'Randy'         },
  { title: 'Approve Q2 payout release',                       meta: 'Paula'         },
  { title: 'Finalize fractional partnership scope',           meta: 'Exec'          },
];

const CROSS_SYSTEM_STATUS = [
  { label: 'Rocksteady',  pill: 'LIVE', color: '#EF4444' },
  { label: 'Artist OS',   pill: 'LIVE', color: '#06B6D4' },
  { label: 'Catalog OS',  pill: 'LIVE', color: '#10B981' },
  { label: 'Industry OS', pill: 'LIVE', color: '#F59E0B' },
];

export default function CommandCenter() {
  const [now, setNow] = useState(new Date());
  const [digests, setDigests] = useState<Digest[]>([]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('admin_executive_digests')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);
      if (data) setDigests(data);
    })();
  }, []);

  return (
    <AdminPage
      eyebrow="Command Center"
      title="Executive Command Layer"
      subtitle="Live operating view across Rocksteady, Artist OS, Catalog OS, Industry OS, Finance, Legal, Capital, and AI agent activity."
      accent="#F59E0B"
      actions={
        <div className="flex items-center gap-2">
          <Pill color="#10B981" label="ALL SYSTEMS OP" glow />
          <span className="text-[10px] font-mono text-white/25 tracking-wider">
            {now.toLocaleTimeString('en-US', { hour12: false })} UTC
          </span>
        </div>
      }
    >
      {/* Stat tiles row */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
        <StatTile label="Decisions Needed"  value={11}  color="#EF4444" icon={CheckCircle2} sub="4 waiting exec"        />
        <StatTile label="Contracts Out"     value={12}  color="#06B6D4" icon={FileText}     sub="3 signed this week"    />
        <StatTile label="Payouts Queue"     value="$48.2K" color="#10B981" icon={DollarSign} sub="22 cleared"           />
        <StatTile label="Partner Items"     value={7}   color="#F59E0B" icon={Building2}    sub="2 waiting docs"        />
        <StatTile label="Risk Renewals"     value={4}   color="#EC4899" icon={Shield}       sub="Next due in 6d"        />
        <StatTile label="Agent Escalations" value={3}   color="#06B6D4" icon={Brain}        sub="Counsel · Artist Acct" />
      </div>

      {/* Executive summary strip */}
      <section>
        <ExecSummaryStrip />
      </section>

      {/* AI exec insight */}
      <AIExecInsight />

      {/* AI Operations Status — live view of the AI workforce */}
      <AIOperationsStatus />

      {/* Priorities + Risks + Decisions */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <AdminCard title="Today's Priorities" sub="5 items · priority-ordered" accent="#F59E0B" right={<Pill color="#F59E0B" label="TODAY" />}>
          <div className="space-y-1">
            {TOP_PRIORITIES.map((p, i) => (
              <CommandRow key={i} icon={p.icon} title={p.title} meta={p.meta} accent={p.color} />
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Risks + Blocks" sub="Active blockers across systems" accent="#EF4444" right={<Pill color="#EF4444" label="ACTIVE" glow />}>
          <div className="space-y-1">
            {RISK_BLOCKS.map((r, i) => (
              <CommandRow key={i} icon={r.icon} title={r.title} meta={r.meta} accent={r.color} />
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Decisions Needed" sub="Exec approval queue" accent="#06B6D4" right={<Pill color="#06B6D4" label="QUEUE" />}>
          <div className="space-y-1">
            {DECISIONS_NEEDED.map((d, i) => (
              <CommandRow
                key={i}
                icon={CheckCircle2}
                title={d.title}
                meta={d.meta}
                accent="#06B6D4"
                trailing={<span className="text-[9px] font-mono text-white/30">→</span>}
              />
            ))}
          </div>
        </AdminCard>
      </section>

      {/* Global signal + cross-system status */}
      <section>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-[9px] font-mono text-white/15 tracking-widest">02</span>
          <div className="h-[1px] w-3 bg-white/[0.08]" />
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Cross-System Signal Board</span>
          <span className="text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1.5 py-0.5 rounded tracking-wider animate-pulse ml-1">LIVE</span>
          <div className="flex-1 h-[1px] bg-white/[0.04]" />
          <div className="flex items-center gap-2">
            {CROSS_SYSTEM_STATUS.map(s => (
              <Pill key={s.label} color={s.color} label={`${s.label} · ${s.pill}`} glow />
            ))}
          </div>
        </div>
        <GlobalSignalMonitor />
      </section>

      {/* Ops + Finance */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div>
          <SectionHdr index="03" label="Operations Health" />
          <OpsHealthPanel />
        </div>
        <div>
          <SectionHdr index="04" label="Finance Command Center" />
          <FinanceCommand />
        </div>
      </section>

      {/* Capital + Risk (new boards) */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AdminCard title="Capital + Banking Board" sub="Reserves, setup, funding readiness" accent="#06B6D4">
          <div className="grid grid-cols-2 gap-2.5">
            <Mini label="Banking Setup"       value="Complete"    color="#10B981" />
            <Mini label="Operating Reserves"  value="$142.6K"     color="#06B6D4" />
            <Mini label="Card Access"         value="Eligible"    color="#10B981" />
            <Mini label="Capital Readiness"   value="88%"         color="#F59E0B" />
            <Mini label="Funding Open"        value="3 deals"     color="#EC4899" />
            <Mini label="Payment Routing"     value="1 blocked"   color="#EF4444" />
          </div>
        </AdminCard>
        <AdminCard title="Risk + Protection Board" sub="Coverage, renewals, exposure" accent="#F59E0B">
          <div className="grid grid-cols-2 gap-2.5">
            <Mini label="Required Policies"   value="8 / 9"       color="#F59E0B" />
            <Mini label="Renewals Due"        value="4"           color="#EC4899" />
            <Mini label="Coverage Gaps"       value="1"           color="#EF4444" />
            <Mini label="Claims Routing"      value="0 open"      color="#10B981" />
            <Mini label="Cyber Exposure"      value="Monitored"   color="#06B6D4" />
            <Mini label="Live Event Risk"     value="2 items"     color="#F59E0B" />
          </div>
        </AdminCard>
      </section>

      {/* Contracts + Team */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div>
          <SectionHdr index="05" label="Contract & Deal Flow" />
          <ContractDealFlow />
        </div>
        <div>
          <SectionHdr index="06" label="Team Performance" />
          <TeamPerformance />
        </div>
      </section>

      {/* Calendar + Partners */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div>
          <SectionHdr index="07" label="Calendar & Deadline Intelligence" />
          <CalendarIntel />
        </div>
        <div>
          <SectionHdr index="08" label="Partner Pipeline" />
          <PartnerPipeline />
        </div>
      </section>

      {/* Communications Ops + Executive Digest */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <AdminCard title="Communications Ops Board" sub="Inbox, escalations, drips, FAQ learning" accent="#06B6D4">
          <div className="grid grid-cols-2 gap-2.5">
            <Mini label="Inbox Queue"          value="38"   color="#06B6D4" />
            <Mini label="Escalations Waiting"  value="5"    color="#EF4444" />
            <Mini label="Unanswered Priority"  value="2"    color="#F59E0B" />
            <Mini label="Drips Sent (7d)"      value="124"  color="#10B981" />
            <Mini label="FAQ Learning Events"  value="9"    color="#EC4899" />
            <Mini label="Slack / WhatsApp"     value="On"   color="#10B981" />
          </div>
        </AdminCard>
        <AdminCard
          title="Executive Digest Archive"
          sub="Daily / Weekly / Monthly snapshots"
          accent="#F59E0B"
          right={<Pill color="#F59E0B" label={`${digests.length} ON FILE`} />}
        >
          <div className="space-y-2">
            {digests.length === 0 && (
              <p className="text-[11px] text-white/30 font-mono py-3 text-center">Digest archive loading…</p>
            )}
            {digests.map(d => (
              <div key={d.id} className="rounded-md border border-white/[0.06] bg-white/[0.015] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Archive className="w-3 h-3 text-[#F59E0B]" />
                    <span className="text-[11px] font-semibold text-white/85">{d.title}</span>
                  </div>
                  <Pill color="#F59E0B" label={d.period.toUpperCase()} />
                </div>
                <p className="text-[11px] text-white/50 leading-snug mb-2">{d.summary}</p>
                <div className="flex items-center gap-3 text-[9px] font-mono text-white/35">
                  <span><span className="text-[#EC4899]">DECISIONS</span> {d.decisions_needed}</span>
                  <span><span className="text-[#EF4444]">BLOCKED</span> {d.blocked_items}</span>
                  <span><span className="text-[#10B981]">READY</span> {d.ready_items}</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>
    </AdminPage>
  );
}

function SectionHdr({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[9px] font-mono text-white/15 tracking-widest">{index}</span>
      <div className="h-[1px] w-3 bg-white/[0.08]" />
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-[1px] bg-white/[0.04]" />
    </div>
  );
}

function Mini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-md border border-white/[0.05] bg-white/[0.015] px-2.5 py-2">
      <div className="text-[9px] font-mono text-white/35 uppercase tracking-widest">{label}</div>
      <div className="text-[13px] font-bold mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}
