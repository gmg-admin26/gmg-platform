import { useRef, useState, useEffect } from 'react';
import { HelpCircle, Bug, BookOpen, X } from 'lucide-react';
import { useHelp } from '../../context/HelpContext';
import { useLocation } from 'react-router-dom';

function getPageLabel(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const map: Record<string, string> = {
    'dashboard':        'Command Center',
    'rocksteady':       'Rocksteady A&R',
    'artist-os':        'Artist OS',
    'catalog-os':       'Catalog OS',
    'admin-os':         'Admin OS',
    'roster':           'Roster',
    'releases':         'Releases',
    'audience':         'Audience',
    'revenue':          'Revenue',
    'spending':         'Spending',
    'recoupment':       'Recoupment',
    'campaign-center':  'Campaign Center',
    'campaigns':        'Campaign OS',
    'team':             'Team',
    'settings':         'Settings',
    'labels':           'Labels',
    'updates':          'Updates',
    'requests':         'Requests',
    'overview':         'Overview',
    'alerts':           'Alerts',
    'discoveries':      'Top Discoveries',
    'pipeline':         'Deal Pipeline',
    'signings':         'Weekly Signings',
    'scouts':           'Scout Network',
    'heatmaps':         'Heatmaps',
    'culture':          'Culture Map',
    'radar':            'Discovery Radar',
    'hot-artists':      'Hot Artists',
    'reports':          'Reports',
    'value':            'Catalog Value',
    'tasks':            'Tasks',
    'timeline':         '12-Month Plan',
    'fans':             'Fan Intelligence',
    'touring':          'Touring',
    'brand':            'Brand Health',
    'inventory':        'Inventory + Merch',
    'rights':           'Rights + Contracts',
    'meetings':         'Meetings + Reports',
    'entities':         'Business Entities',
  };
  const last = parts[parts.length - 1];
  return map[last] ?? last ?? 'Dashboard';
}

export default function HelpLauncher() {
  const { openFAQ, openBugReport } = useHelp();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pageLabel = getPageLabel(location.pathname);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setMenuOpen(p => !p)}
        title="Help"
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '5px 9px', borderRadius: 8,
          background: menuOpen ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${menuOpen ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.08)'}`,
          color: menuOpen ? '#06B6D4' : 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transition: 'all 0.14s',
        }}
        onMouseEnter={e => {
          if (!menuOpen) {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = 'rgba(255,255,255,0.75)';
            btn.style.borderColor = 'rgba(255,255,255,0.15)';
          }
        }}
        onMouseLeave={e => {
          if (!menuOpen) {
            const btn = e.currentTarget as HTMLButtonElement;
            btn.style.color = 'rgba(255,255,255,0.4)';
            btn.style.borderColor = 'rgba(255,255,255,0.08)';
          }
        }}
      >
        <HelpCircle size={14} />
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'monospace', letterSpacing: '0.04em' }}>HELP</span>
      </button>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          width: 220,
          background: '#0E0F12',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12,
          boxShadow: '0 16px 60px rgba(0,0,0,0.65)',
          zIndex: 500,
          overflow: 'hidden',
          animation: 'fadeDropIn 0.14s ease-out',
        }}>
          <style>{`
            @keyframes fadeDropIn {
              from { transform: translateY(-4px); opacity: 0; }
              to   { transform: translateY(0);    opacity: 1; }
            }
          `}</style>

          <div style={{
            padding: '10px 13px 8px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Platform Help</div>
              <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>
                {pageLabel.toUpperCase()}
              </div>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 2 }}>
              <X size={12} />
            </button>
          </div>

          <div style={{ padding: '6px' }}>
            <button
              onClick={() => { setMenuOpen(false); openFAQ(pageLabel); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 11px', borderRadius: 9, cursor: 'pointer',
                background: 'none', border: 'none', textAlign: 'left',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(6,182,212,0.07)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
            >
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={12} color="#06B6D4" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#F9FAFB' }}>FAQ</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Search common questions</div>
              </div>
            </button>

            <button
              onClick={() => { setMenuOpen(false); openBugReport(pageLabel); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 11px', borderRadius: 9, cursor: 'pointer',
                background: 'none', border: 'none', textAlign: 'left',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.07)'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'none'}
            >
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bug size={12} color="#EF4444" />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#F9FAFB' }}>Report Bug</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Submit an issue report</div>
              </div>
            </button>
          </div>

          <div style={{ padding: '6px 13px 9px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.08em' }}>
              GMG PLATFORM v2
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
