type Status = 'Active' | 'Scaling' | 'Risk' | 'Blocked' | 'Hot' | 'Rising' | 'Watch' | 'Emerging' | 'Critical' | 'Low' | 'Medium' | 'High' | string;

const STATUS_MAP: Record<string, { bg: string; text: string; dot: string }> = {
  Active:    { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
  Scaling:   { bg: 'bg-[#06B6D4]/10', text: 'text-[#06B6D4]', dot: 'bg-[#06B6D4]' },
  Risk:      { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  Blocked:   { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  Hot:       { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  Rising:    { bg: 'bg-[#06B6D4]/10', text: 'text-[#06B6D4]', dot: 'bg-[#06B6D4]' },
  Watch:     { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  Emerging:  { bg: 'bg-white/[0.06]', text: 'text-white/50', dot: 'bg-white/40' },
  Critical:  { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
  Low:       { bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', dot: 'bg-[#10B981]' },
  Medium:    { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', dot: 'bg-[#F59E0B]' },
  High:      { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: 'bg-[#EF4444]' },
};

const fallback = { bg: 'bg-white/[0.05]', text: 'text-white/40', dot: 'bg-white/30' };

interface StatusTagProps {
  status: Status;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusTag({ status, pulse = false, size = 'sm' }: StatusTagProps) {
  const s = STATUS_MAP[status] ?? fallback;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono ${
      size === 'md' ? 'text-[11px]' : 'text-[10px]'
    } font-medium tracking-wider uppercase ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${
        pulse && (status === 'Hot' || status === 'Scaling' || status === 'Blocked' || status === 'Critical') ? 'animate-pulse' : ''
      }`} />
      {status}
    </span>
  );
}
