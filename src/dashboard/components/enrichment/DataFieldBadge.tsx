// ============================================================
// DataFieldBadge — status pill for enrichment fields
// Shows: Live (green) | Pending API (amber) | Manual Override (blue)
// ============================================================

import { Wifi, Clock, CreditCard as Edit } from 'lucide-react';
import type { SourceStatus } from '../../data/enrichmentService';

const STATUS_CONFIG = {
  live: {
    label: 'Live',
    color: '#10B981',
    bg:    'rgba(16,185,129,0.1)',
    border:'rgba(16,185,129,0.22)',
    icon:  Wifi,
    dot:   '#10B981',
  },
  pending_api: {
    label: 'Pending API',
    color: '#F59E0B',
    bg:    'rgba(245,158,11,0.08)',
    border:'rgba(245,158,11,0.2)',
    icon:  Clock,
    dot:   '#F59E0B',
  },
  manual_override: {
    label: 'Manual Override',
    color: '#3B82F6',
    bg:    'rgba(59,130,246,0.1)',
    border:'rgba(59,130,246,0.22)',
    icon:  Edit,
    dot:   '#3B82F6',
  },
} as const;

interface Props {
  status: SourceStatus;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  showDot?: boolean;
  lastSynced?: string | null;
}

function fmtSync(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 2)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function DataFieldBadge({
  status,
  size = 'sm',
  showIcon = true,
  showDot = false,
  lastSynced,
}: Props) {
  const cfg  = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  const isSm = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: isSm ? 4 : 5,
      padding: isSm ? '2px 7px' : '3px 10px',
      borderRadius: 20,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.color,
      fontSize: isSm ? 9 : 11,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      lineHeight: 1.4,
    }}>
      {showDot && (
        <span style={{
          width: isSm ? 5 : 6, height: isSm ? 5 : 6, borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
          boxShadow: status === 'live' ? `0 0 4px ${cfg.dot}` : 'none',
        }} />
      )}
      {showIcon && !showDot && <Icon size={isSm ? 8 : 10} />}
      {cfg.label}
      {lastSynced && status === 'live' && (
        <span style={{ opacity: 0.65, fontWeight: 500 }}>· {fmtSync(lastSynced)}</span>
      )}
    </span>
  );
}
