import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import type { WorkerWithRelations } from '../../../dashboard/data/workerPaymentService';

const PINK = '#EC4899';

interface Action {
  directive: string;
  reason: string;
  insight?: string;
  cta: string;
  intensity: 'urgent' | 'primary' | 'passive';
}

function buildAction(worker: WorkerWithRelations): Action {
  const safe = worker.payment_safe;
  const assignments = worker.assignments ?? [];
  const pendingDelivs = assignments.filter(a => a.status === 'open' || a.status === 'in_progress');
  const submittable = assignments.filter(a => a.status === 'in_progress');
  const amount = safe?.amount ?? 0;
  const fmt = amount >= 1000 ? `$${(amount / 1000).toFixed(1)}K` : `$${amount}`;

  if (safe?.status === 'approved') {
    return {
      directive: `Withdraw ${fmt} to your connected bank`,
      reason: 'Funds cleared compliance and are ready for ACH release.',
      insight: 'Average settlement time is under 48 hours.',
      cta: 'Get Paid Now',
      intensity: 'urgent',
    };
  }

  if (safe?.status === 'delayed') {
    return {
      directive: 'Review delay notice and prepare updated invoice',
      reason: safe.delay_reason || 'Upstream processing hold from admin review.',
      insight: 'Resolving the flagged item moves payment back to Pending.',
      cta: 'Open Delay Notice',
      intensity: 'urgent',
    };
  }

  if (submittable.length > 0) {
    return {
      directive: `Submit ${submittable.length} remaining deliverable${submittable.length === 1 ? '' : 's'} to unlock ${fmt} payment`,
      reason: 'This will move you from Pending → Approved stage.',
      insight: `${submittable.length} in progress · ${assignments.filter(a => a.status === 'approved').length} already approved`,
      cta: 'Submit Now',
      intensity: 'primary',
    };
  }

  if (safe?.status === 'pending') {
    return {
      directive: 'Complete compliance to accelerate approval',
      reason: 'Final verifications are blocking the payment safe from releasing.',
      insight: `Current stage: Pending · ${fmt} awaiting approval`,
      cta: 'Review Compliance',
      intensity: 'primary',
    };
  }

  if (pendingDelivs.length > 0) {
    return {
      directive: `Start ${pendingDelivs.length} open deliverable${pendingDelivs.length === 1 ? '' : 's'}`,
      reason: 'Getting started keeps your momentum score active.',
      cta: 'View Deliverables',
      intensity: 'primary',
    };
  }

  return {
    directive: 'Stay active · keep your momentum score live',
    reason: 'Your project safe is running smoothly. New assignments will appear as they\'re cleared.',
    cta: 'Refresh Status',
    intensity: 'passive',
  };
}

interface Props {
  worker: WorkerWithRelations;
  onAction: () => void;
}

export default function NextBestAction({ worker, onAction }: Props) {
  const action = buildAction(worker);
  const ring = action.intensity === 'urgent' ? PINK : action.intensity === 'primary' ? PINK : 'rgba(236,72,153,0.55)';

  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(236,72,153,0.09) 0%, rgba(236,72,153,0.04) 50%, rgba(6,182,212,0.04) 100%)',
      }}
    >
      <style>{`
        @keyframes nba-border { 0%,100% { box-shadow: 0 0 0 1px ${ring}44, 0 0 24px ${ring}2e; } 50% { box-shadow: 0 0 0 1px ${ring}66, 0 0 40px ${ring}55; } }
        @keyframes nba-sheen { 0% { transform: translateX(-30%); } 100% { transform: translateX(130%); } }
        @keyframes nba-pulse { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
      `}</style>

      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ animation: 'nba-border 2.8s ease-in-out infinite' }}
      />

      <div
        className="absolute top-0 left-0 w-1/3 h-full pointer-events-none opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ring}, transparent)`,
          animation: 'nba-sheen 4s linear infinite',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative p-5 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${PINK}1a`, border: `1px solid ${PINK}40` }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: PINK }} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: PINK, animation: 'nba-pulse 1.6s ease-in-out infinite' }} />
              <span className="text-[9px] font-mono uppercase tracking-[0.22em]" style={{ color: PINK }}>
                Next Best Action
              </span>
            </div>
          </div>
          <span className="text-[8.5px] font-mono uppercase tracking-wide text-white/30">
            AI Recommendation
          </span>
        </div>

        <h2 className="text-[18px] md:text-[20px] font-bold text-white/92 leading-tight mb-2">
          {action.directive}
        </h2>
        <p className="text-[12.5px] text-white/48 leading-relaxed mb-2.5 max-w-2xl">
          {action.reason}
        </p>

        {action.insight && (
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mb-4"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.22)' }}
          >
            <Zap className="w-3 h-3" style={{ color: '#06B6D4' }} />
            <span className="text-[10.5px] font-mono text-[#06B6D4]">{action.insight}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all"
            style={{
              background: `linear-gradient(135deg, ${PINK}, #BE185D)`,
              color: 'white',
              boxShadow: `0 6px 22px ${PINK}40`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 30px ${PINK}60`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 22px ${PINK}40`;
            }}
          >
            {action.cta}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-white/25 uppercase tracking-wide">
            Priority · {action.intensity === 'urgent' ? 'Critical' : action.intensity === 'primary' ? 'High' : 'Steady'}
          </span>
        </div>
      </div>
    </div>
  );
}
