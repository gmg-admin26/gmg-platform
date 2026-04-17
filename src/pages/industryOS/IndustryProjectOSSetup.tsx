import { Briefcase, CheckCircle2, Clock, FileText, Landmark, ListChecks, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACCENT = '#10B981';
const AMBER = '#F59E0B';

export interface SetupItemState {
  key: string;
  label: string;
  description: string;
  ok: boolean;
  icon: React.ElementType;
}

interface Props {
  name: string;
  items?: SetupItemState[];
}

const DEFAULT_ITEMS: SetupItemState[] = [
  { key: 'agreement', label: 'Project Agreement', description: 'Review and sign the engagement terms.', ok: false, icon: FileText },
  { key: 'w9', label: 'W-9 / EIN Documentation', description: 'Submit tax documentation for payout eligibility.', ok: false, icon: ShieldCheck },
  { key: 'ach', label: 'ACH Banking Connection', description: 'Connect the bank account that will receive payouts.', ok: false, icon: Landmark },
  { key: 'deliverables', label: 'Deliverables Assigned', description: 'GMG assigns your initial milestones and deliverables.', ok: false, icon: ListChecks },
  { key: 'approval', label: 'Admin Project Start Approval', description: 'Final verification before the project safe activates.', ok: false, icon: CheckCircle2 },
];

export default function IndustryProjectOSSetup({ name, items = DEFAULT_ITEMS }: Props) {
  const doneCount = items.filter(i => i.ok).length;
  const pct = Math.round((doneCount / items.length) * 100);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: `${ACCENT}0d`, border: `1px solid ${ACCENT}1f` }}
            >
              <Briefcase className="w-6 h-6" style={{ color: `${ACCENT}99` }} />
            </div>
            <div
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: `${AMBER}26`, border: `1px solid ${AMBER}45` }}
            >
              <Clock className="w-2.5 h-2.5" style={{ color: AMBER }} />
            </div>
          </div>
          <div>
            <p className="text-[9px] font-mono uppercase tracking-[0.22em] text-white/25 mb-1.5">Project OS · Workspace Setup</p>
            <h1 className="text-[24px] font-bold text-white/85">Welcome, {name.split(' ')[0]}</h1>
            <p className="text-[12.5px] text-white/40 leading-relaxed mt-1.5 max-w-md">
              Your Industry OS profile is connected. Complete the setup items below to activate your project safe and unlock Project OS.
            </p>
          </div>
        </div>

        <div className="bg-[#0B0D10] border border-white/[0.06] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[9.5px] font-mono text-white/28 uppercase tracking-wide">Setup Progress</span>
            <span className="text-[10px] font-mono text-white/50">{doneCount}/{items.length} complete</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${ACCENT}, ${AMBER})` }}
            />
          </div>
          <div className="space-y-2">
            {items.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  style={{
                    background: item.ok ? `${ACCENT}08` : 'rgba(255,255,255,0.015)',
                    border: `1px solid ${item.ok ? `${ACCENT}22` : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: item.ok ? `${ACCENT}1a` : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${item.ok ? `${ACCENT}30` : 'rgba(255,255,255,0.05)'}`,
                    }}
                  >
                    {item.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                    ) : (
                      <Icon className="w-3.5 h-3.5 text-white/35" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-semibold text-white/80">{item.label}</span>
                      <span
                        className="text-[8.5px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{
                          background: item.ok ? `${ACCENT}18` : 'rgba(255,255,255,0.04)',
                          color: item.ok ? ACCENT : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        {item.ok ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/35 leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Link
            to="/industry-os/app"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.08] text-[11.5px] text-white/50 hover:text-white/80 transition-colors"
          >
            Return to Industry OS
          </Link>
          <a
            href="mailto:projects@greatermusic.com"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11.5px] font-semibold text-white transition-all"
            style={{ background: `${ACCENT}1a`, border: `1px solid ${ACCENT}40`, color: ACCENT }}
          >
            Contact Project Team
          </a>
        </div>

        <p className="text-center text-[10px] text-white/20">
          Questions? <a href="mailto:projects@greatermusic.com" className="text-white/40 hover:text-white/70">projects@greatermusic.com</a>
        </p>
      </div>
    </div>
  );
}
