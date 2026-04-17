import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ADMIN_COLORS = {
  accent: '#F59E0B',
  cyan:   '#06B6D4',
  green:  '#10B981',
  pink:   '#EC4899',
  red:    '#EF4444',
  amber:  '#F59E0B',
};

export function AdminPage({
  eyebrow,
  title,
  subtitle,
  accent = ADMIN_COLORS.accent,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  accent?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="p-5 space-y-5 min-h-full bg-[#08090B]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[9px] font-mono uppercase tracking-[0.18em] px-2 py-0.5 rounded border"
              style={{
                color: accent,
                background: `${accent}10`,
                borderColor: `${accent}30`,
              }}
            >
              {eyebrow}
            </span>
            <span className="text-[9px] font-mono text-white/20 tracking-widest uppercase">Admin OS</span>
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight font-['Satoshi',sans-serif]">{title}</h1>
          {subtitle && <p className="text-[12px] text-white/40 mt-1 max-w-xl leading-relaxed">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({
  title,
  sub,
  accent = ADMIN_COLORS.cyan,
  right,
  children,
  className = '',
}: {
  title?: string;
  sub?: string;
  accent?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl border border-white/[0.07] bg-[#0B0C0F] overflow-hidden ${className}`}
      style={{ boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02), 0 0 40px ${accent}04` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}70, transparent)` }}
      />
      {(title || right) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
          <div>
            {title && <h3 className="text-[12px] font-semibold text-white/85 tracking-tight">{title}</h3>}
            {sub && <p className="text-[10px] text-white/30 font-mono tracking-wide mt-0.5">{sub}</p>}
          </div>
          {right}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Pill({
  color,
  label,
  glow = false,
}: { color: string; label: string; glow?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded tracking-wider"
      style={{
        color,
        background: `${color}12`,
        border: `1px solid ${color}28`,
      }}
    >
      <span
        className="w-1 h-1 rounded-full inline-block"
        style={{ background: color, boxShadow: glow ? `0 0 6px ${color}` : 'none' }}
      />
      {label}
    </span>
  );
}

export function StatTile({
  label,
  value,
  sub,
  color = ADMIN_COLORS.cyan,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className="rounded-lg border border-white/[0.06] bg-[#0E0F12] p-3 relative overflow-hidden"
      style={{ boxShadow: `inset 0 0 0 1px ${color}04` }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color }} />}
      </div>
      <div className="text-[20px] font-bold text-white leading-none tracking-tight">{value}</div>
      {sub && <div className="text-[10px] text-white/40 mt-1 font-mono">{sub}</div>}
    </div>
  );
}

export function CommandRow({
  icon: Icon,
  title,
  meta,
  accent,
  trailing,
  onClick,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  meta?: string;
  accent?: string;
  trailing?: ReactNode;
  onClick?: () => void;
}) {
  const c = accent ?? 'rgba(255,255,255,0.4)';
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-white/[0.03] transition-colors cursor-pointer group"
    >
      {Icon && (
        <div
          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
          style={{ background: `${c}10`, border: `1px solid ${c}24` }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: c }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] text-white/85 truncate">{title}</p>
        {meta && <p className="text-[10px] text-white/35 font-mono mt-0.5 truncate">{meta}</p>}
      </div>
      {trailing}
      <ChevronRight className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors shrink-0" />
    </div>
  );
}

export function SectionTiles({ items }: { items: { label: string; path: string; count?: number | string; icon?: React.ComponentType<{ className?: string }>; color?: string }[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map(it => {
        const Icon = it.icon;
        const c = it.color ?? '#06B6D4';
        return (
          <Link
            key={it.path + it.label}
            to={it.path}
            className="group relative rounded-lg border border-white/[0.06] bg-[#0E0F12] p-3.5 hover:border-white/[0.14] transition-all"
            style={{ boxShadow: `inset 0 0 0 1px ${c}05` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: `${c}12`, border: `1px solid ${c}26` }}
              >
                {Icon && <Icon className="w-3.5 h-3.5" style={{ color: c }} />}
              </div>
              {it.count !== undefined && (
                <span className="text-[9px] font-mono text-white/35">{it.count}</span>
              )}
            </div>
            <p className="text-[12.5px] font-medium text-white/85 group-hover:text-white transition-colors">{it.label}</p>
            <p className="text-[10px] text-white/25 font-mono mt-1 tracking-wide">Open Module →</p>
          </Link>
        );
      })}
    </div>
  );
}

export function DensityTable<T>({
  rows, columns, emptyLabel = 'No records',
}: {
  rows: T[];
  columns: { key: string; label: string; render: (row: T) => ReactNode; width?: string }[];
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-8 text-center text-[11px] text-white/25 font-mono">{emptyLabel}</div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/[0.05]">
            {columns.map(col => (
              <th key={col.key} className="text-[9px] font-mono uppercase tracking-widest text-white/30 py-2 px-2" style={{ width: col.width }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors">
              {columns.map(col => (
                <td key={col.key} className="py-2.5 px-2 text-[12px] text-white/75">{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
