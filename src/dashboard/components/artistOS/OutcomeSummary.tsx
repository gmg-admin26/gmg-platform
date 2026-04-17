import { useState } from 'react';
import { CheckCircle2, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Clock } from 'lucide-react';

export type OutcomeStatus = 'pending' | 'in_progress' | 'completed' | 'missed';

export interface OutcomeData {
  predicted: string;
  actual: string;
  delta: string;
  deltaDirection: 'beat' | 'met' | 'missed';
  confidence: number;
  completedAt: string;
  status: OutcomeStatus;
  note?: string;
}

const STATUS_META: Record<OutcomeStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:     { label: 'PENDING',     color: '#94A3B8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
  in_progress: { label: 'IN PROGRESS', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  completed:   { label: 'COMPLETED',   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  missed:      { label: 'MISSED',      color: '#EF4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
};

const DIRECTION_META = {
  beat:   { label: 'Beat forecast',  color: '#10B981', icon: TrendingUp   },
  met:    { label: 'Met forecast',   color: '#F59E0B', icon: Minus        },
  missed: { label: 'Missed forecast', color: '#EF4444', icon: TrendingDown },
};

interface OutcomeSummaryProps {
  outcome: OutcomeData;
  defaultExpanded?: boolean;
  indent?: number;
  highImportance?: boolean;
}

export default function OutcomeSummary({ outcome, defaultExpanded, indent = 66, highImportance = false }: OutcomeSummaryProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? highImportance ?? false);
  const sm = STATUS_META[outcome.status];
  const dir = DIRECTION_META[outcome.deltaDirection];
  const DirIcon = dir.icon;

  return (
    <div style={{
      marginLeft: indent,
      marginRight: 16,
      marginBottom: 12,
      borderRadius: 10,
      border: `1px solid ${expanded ? sm.border : 'rgba(255,255,255,0.05)'}`,
      background: expanded ? sm.bg : 'rgba(255,255,255,0.015)',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      <button
        onClick={() => setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          width: '100%', padding: '7px 10px',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <CheckCircle2 size={10} color={sm.color} />
        <span style={{ fontFamily: 'monospace', fontSize: 8, fontWeight: 800, color: sm.color, letterSpacing: '0.08em', flexShrink: 0 }}>
          OUTCOME
        </span>
        <span style={{
          fontFamily: 'monospace', fontSize: 7, padding: '1px 6px', borderRadius: 99,
          background: sm.bg, border: `1px solid ${sm.border}`, color: sm.color, flexShrink: 0,
        }}>
          {sm.label}
        </span>

        {outcome.status === 'completed' && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
            <DirIcon size={8} color={dir.color} />
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: dir.color, fontWeight: 700 }}>{dir.label}</span>
          </span>
        )}

        <span style={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto', flexShrink: 0 }}>
          <Clock size={7} color="rgba(255,255,255,0.2)" />
          <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>{outcome.completedAt}</span>
          {expanded
            ? <ChevronUp size={8} color="rgba(255,255,255,0.2)" />
            : <ChevronDown size={8} color="rgba(255,255,255,0.2)" />
          }
        </span>
      </button>

      {expanded && (
        <div style={{
          padding: '0 10px 10px',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6,
          animation: 'outcome-expand 0.18s ease both',
        }}>
          <style>{`@keyframes outcome-expand { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }`}</style>

          <DataCell label="Predicted" value={outcome.predicted} color="rgba(255,255,255,0.45)" />
          <DataCell label="Actual" value={outcome.actual} color={outcome.status === 'completed' ? dir.color : 'rgba(255,255,255,0.45)'} />
          <DataCell label="Variance" value={outcome.delta} color={dir.color} />

          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10, paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 2 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.2)' }}>CONF AT TIME</span>
            <div style={{ width: 50, height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${outcome.confidence}%`, background: outcome.confidence >= 80 ? '#10B981' : '#F59E0B', borderRadius: 2 }} />
            </div>
            <span style={{ fontFamily: 'monospace', fontSize: 7, color: outcome.confidence >= 80 ? '#10B981' : '#F59E0B', fontWeight: 700 }}>{outcome.confidence}%</span>
            {outcome.note && (
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontStyle: 'italic' }}>{outcome.note}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DataCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: '6px 8px', background: 'rgba(255,255,255,0.025)', borderRadius: 7, border: '1px solid rgba(255,255,255,0.04)' }}>
      <p style={{ margin: '0 0 3px', fontFamily: 'monospace', fontSize: 7, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color, lineHeight: 1.2 }}>{value}</p>
    </div>
  );
}
