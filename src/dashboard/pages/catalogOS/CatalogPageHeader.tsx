import { BookOpen, Bug, type LucideIcon } from 'lucide-react';
import { useHelp } from '../../context/HelpContext';

interface Props {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  accentColor?: string;
  actions?: React.ReactNode;
  badge?: string;
  logoUrl?: string;
  logoAlt?: string;
}

export default function CatalogPageHeader({
  icon: Icon,
  title,
  subtitle,
  accentColor = '#10B981',
  actions,
  badge,
  logoUrl,
  logoAlt,
}: Props) {
  const { openFAQ, openBugReport } = useHelp();

  return (
    <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/[0.05]">
      <div className="flex items-center gap-3">
        {logoUrl ? (
          <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: `${accentColor}12`, border: `1px solid ${accentColor}22` }}>
            <img
              src={logoUrl}
              alt={logoAlt ?? title}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}28` }}>
            <Icon className="w-4 h-4" style={{ color: accentColor }} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-bold text-white tracking-tight">{title}</h1>
            {badge && (
              <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded tracking-wider"
                style={{ color: accentColor, background: `${accentColor}14`, border: `1px solid ${accentColor}22` }}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-white/30 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {actions}
        <div className="w-px h-5 bg-white/[0.07] mx-1" />
        <button
          onClick={() => openFAQ(title)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-white/70 hover:border-[#06B6D4]/30 hover:text-[#06B6D4] transition-all group"
        >
          <BookOpen className="w-3 h-3" />
          <span className="hidden sm:inline">FAQ</span>
        </button>
        <button
          onClick={() => openBugReport(title)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-white/[0.07] text-[10.5px] text-white/30 hover:text-[#EF4444] hover:border-[#EF4444]/30 transition-all group"
        >
          <Bug className="w-3 h-3" />
          <span className="hidden sm:inline">Bug</span>
        </button>
      </div>
    </div>
  );
}
