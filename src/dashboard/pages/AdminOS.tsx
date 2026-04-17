import { useEffect, useState } from 'react';
import { Activity, Cpu } from 'lucide-react';
import ExecSummaryStrip from '../components/ops/ExecSummaryStrip';
import GlobalSignalMonitor from '../components/ops/GlobalSignalMonitor';
import OpsHealthPanel from '../components/ops/OpsHealthPanel';
import FinanceCommand from '../components/ops/FinanceCommand';
import ContractDealFlow from '../components/ops/ContractDealFlow';
import TeamPerformance from '../components/ops/TeamPerformance';
import CalendarIntel from '../components/ops/CalendarIntel';
import PartnerPipeline from '../components/ops/PartnerPipeline';
import AIExecInsight from '../components/ops/AIExecInsight';

function LivePulse() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 1800);
    return () => clearInterval(t);
  }, []);
  const bars = [3, 6, 4, 8, 5, 9, 4, 7, 6, 5, 8, 3, 6, 9, 4];
  return (
    <div className="flex items-end gap-[2px] h-5">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-[#06B6D4] transition-all duration-300"
          style={{
            height: `${((h + ((tick + i) % 4)) / 13) * 100}%`,
            opacity: 0.4 + (((tick + i) % 3) * 0.2),
          }}
        />
      ))}
    </div>
  );
}

export default function AdminOS() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="p-5 space-y-5 min-h-full bg-[#08090B]">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#06B6D4]" />
              <h1 className="text-[20px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">
                Admin OS
              </h1>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#06B6D4]/25 bg-[#06B6D4]/8 text-[#06B6D4] tracking-widest">
              EXECUTIVE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-mono text-white/25">
              {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {' — '}
              {now.toLocaleTimeString('en-US', { hour12: false })} UTC
            </p>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#10B981]" />
              <span className="text-[10px] font-mono text-[#10B981]">ALL SYSTEMS MONITORED</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LivePulse />
          <span className="text-[10px] font-mono text-white/20 tracking-wider">LIVE DATA</span>
        </div>
      </div>

      {/* ── 1. Executive Summary Strip ── */}
      <section>
        <SectionLabel label="Executive Summary" index="01" />
        <ExecSummaryStrip />
      </section>

      {/* ── 9. AI Executive Insight (high prominence) ── */}
      <AIExecInsight />

      {/* ── 2. Global Signal Monitor ── */}
      <section>
        <SectionLabel label="Global Signal Monitor" index="02" hot />
        <GlobalSignalMonitor />
      </section>

      {/* ── 3 + 4: Ops Health + Finance ── */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div>
            <SectionLabel label="Operations Health" index="03" />
            <OpsHealthPanel />
          </div>
          <div>
            <SectionLabel label="Finance Command Center" index="04" />
            <FinanceCommand />
          </div>
        </div>
      </section>

      {/* ── 5 + 6: Contracts + Team ── */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div>
            <SectionLabel label="Contract & Deal Flow" index="05" />
            <ContractDealFlow />
          </div>
          <div>
            <SectionLabel label="Team Performance" index="06" />
            <TeamPerformance />
          </div>
        </div>
      </section>

      {/* ── 7 + 8: Calendar + Partners ── */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div>
            <SectionLabel label="Calendar & Deadline Intelligence" index="07" />
            <CalendarIntel />
          </div>
          <div>
            <SectionLabel label="Partner Pipeline" index="08" />
            <PartnerPipeline />
          </div>
        </div>
      </section>

    </div>
  );
}

function SectionLabel({ label, index, hot = false }: { label: string; index: string; hot?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-[9px] font-mono text-white/15 tracking-widest">{index}</span>
      <div className="h-[1px] w-3 bg-white/[0.08]" />
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</span>
      {hot && (
        <span className="text-[9px] font-mono text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-1.5 py-0.5 rounded tracking-wider animate-pulse ml-1">
          CRITICAL
        </span>
      )}
      <div className="flex-1 h-[1px] bg-white/[0.04]" />
    </div>
  );
}
