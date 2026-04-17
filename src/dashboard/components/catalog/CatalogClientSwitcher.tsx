import { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle, Users, Building2, Briefcase, Music, Globe, BarChart2, Loader2 } from 'lucide-react';
import { useCatalogClient } from '../../context/CatalogClientContext';
import { CatalogClientType, CLIENT_TYPE_META } from '../../data/catalogClientService';

const TYPE_ICON: Record<CatalogClientType, React.ElementType> = {
  artist:             Music,
  management_company: Briefcase,
  label:              Building2,
  distributor:        Globe,
  catalog_owner:      BarChart2,
  multi_entity:       Users,
};

function fmt(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function CatalogClientSwitcher() {
  const { clients, activeClient, loading, switchClient } = useCatalogClient();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!activeClient) return null;

  const meta = CLIENT_TYPE_META[activeClient.type];
  const TypeIcon = TYPE_ICON[activeClient.type];

  return (
    <div ref={ref} className="relative px-3 py-2.5 border-b border-white/[0.05]">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 group"
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all"
          style={{ background: `${activeClient.accent_color}18`, border: `1px solid ${activeClient.accent_color}28` }}>
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: activeClient.accent_color }} />
            : <TypeIcon className="w-3.5 h-3.5" style={{ color: activeClient.accent_color }} />}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[11.5px] font-bold text-white/80 truncate group-hover:text-white/95 transition-colors">
            {activeClient.name}
          </p>
          <p className="text-[8.5px] font-mono truncate" style={{ color: activeClient.accent_color }}>
            {meta.label}
            {activeClient.total_artists > 1 ? ` · ${activeClient.total_artists} artists` : ''}
          </p>
        </div>
        <ChevronDown className="w-3 h-3 text-white/20 shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>

      {open && (
        <div className="absolute left-2 right-2 top-full mt-1.5 z-50 bg-[#0D0F14] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
          <div className="px-3 py-1.5 border-b border-white/[0.05]">
            <p className="text-[8.5px] font-mono text-white/20 uppercase tracking-widest">Switch Client</p>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {clients.map(c => {
              const cmeta = CLIENT_TYPE_META[c.type];
              const CIcon = TYPE_ICON[c.type];
              const isActive = c.id === activeClient.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { switchClient(c.id); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/[0.04] transition-all text-left"
                >
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${c.accent_color}14`, border: `1px solid ${c.accent_color}22` }}>
                    <CIcon className="w-3 h-3" style={{ color: c.accent_color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[11px] font-semibold text-white/65 truncate">{c.name}</p>
                      {isActive && <CheckCircle className="w-3 h-3 shrink-0" style={{ color: c.accent_color }} />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8px] font-mono" style={{ color: c.accent_color }}>{cmeta.label}</span>
                      <span className="text-[8px] font-mono text-white/20">{fmt(c.est_catalog_value)}</span>
                      {c.total_artists > 1 && (
                        <span className="text-[8px] font-mono text-white/20">{c.total_artists} artists</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
