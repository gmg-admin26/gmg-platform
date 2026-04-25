import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Shield } from 'lucide-react';
import { useRole } from '../../../auth/RoleContext';
import { type ArtistOSRole, ROLE_META } from '../../../auth/roles';

const ROLES: ArtistOSRole[] = ['artist_manager', 'label_partner', 'admin_team'];

interface Props {
  visible: boolean;
}

export default function DemoRoleSwitcher({ visible }: Props) {
  const { roleState, setRole } = useRole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentRole = roleState.role ?? 'artist_manager';
  const meta = ROLE_META[currentRole];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-[10px] font-mono"
        style={{
          background: `${meta.color}10`,
          borderColor: `${meta.color}30`,
          color: meta.color,
        }}
      >
        <Shield className="w-3 h-3 shrink-0" />
        <span className="hidden sm:inline">{meta.shortLabel}</span>
        <ChevronDown className={`w-3 h-3 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#0F1013] border border-white/[0.10] rounded-xl shadow-2xl z-[200]" style={{ overflow: 'hidden' }}>
          <div className="px-3 py-2.5 border-b border-white/[0.05]">
            <p className="text-[9px] font-mono text-white/25 uppercase tracking-widest">Demo View Switcher</p>
            <p className="text-[9px] text-white/15 mt-0.5">For preview only — tied to auth in production</p>
          </div>
          <div>
            {ROLES.map(role => {
              const m = ROLE_META[role];
              const isActive = role === currentRole;
              return (
                <button
                  key={role}
                  onClick={() => { setRole(role); setOpen(false); }}
                  className="w-full flex items-start gap-3 px-3 py-3.5 text-left hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: isActive ? m.color : 'transparent', border: `1px solid ${m.color}` }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium" style={{ color: isActive ? m.color : 'rgba(255,255,255,0.6)' }}>{m.label}</p>
                    <p className="text-[10px] text-white/25 mt-0.5 leading-relaxed">{m.description}</p>
                  </div>
                  {isActive && (
                    <span className="text-[8px] font-mono shrink-0 mt-0.5 px-1 py-0.5 rounded" style={{ background: `${m.color}15`, color: m.color }}>
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
