import { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, Bug, X, MessageSquare } from 'lucide-react';
import { useHelp } from '../../context/HelpContext';
import { useLocation } from 'react-router-dom';

function getPageLabel(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const map: Record<string, string> = {
    dashboard:         'Command Center',
    rocksteady:        'Rocksteady A&R',
    'artist-os':       'Artist OS',
    'catalog-os':      'Catalog OS',
    'admin-os':        'Admin OS',
    roster:            'Roster',
    releases:          'Releases',
    audience:          'Audience',
    revenue:           'Revenue',
    spending:          'Spending',
    recoupment:        'Recoupment',
    'campaign-center': 'Campaign Center',
    campaigns:         'Campaign OS',
    team:              'Team',
    settings:          'Settings',
    labels:            'Labels',
    updates:           'Updates',
    requests:          'Requests',
    overview:          'Overview',
    alerts:            'Alerts',
    discoveries:       'Top Discoveries',
    pipeline:          'Deal Pipeline',
    signings:          'Weekly Signings',
    scouts:            'Scout Network',
    heatmaps:          'Heatmaps',
    culture:           'Culture Map',
    radar:             'Discovery Radar',
    'hot-artists':     'Hot Artists',
    reports:           'Reports',
    value:             'Catalog Value',
    assets:            'Asset Library',
    tasks:             'Tasks',
    progress:          'Team Progress',
    timeline:          '12-Month Plan',
    fans:              'Fan Intelligence',
    touring:           'Touring',
    brand:             'Brand Health',
    inventory:         'Inventory + Merch',
    rights:            'Rights + Contracts',
    meetings:          'Meetings + Reports',
    entities:          'Business Entities',
  };
  const last = parts[parts.length - 1];
  return map[last] ?? last ?? 'Dashboard';
}

export default function SupportWidget() {
  const { openFAQ, openBugReport } = useHelp();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pageLabel = getPageLabel(location.pathname);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setExpanded(false);
    }
    if (expanded) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  useEffect(() => { setExpanded(false); }, [location.pathname]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 900,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      {expanded && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6,
          pointerEvents: 'all',
          animation: 'widgetFadeUp 0.16s ease-out',
        }}>
          <style>{`
            @keyframes widgetFadeUp {
              from { transform: translateY(8px); opacity: 0; }
              to   { transform: translateY(0);   opacity: 1; }
            }
          `}</style>

          <div style={{
            background: '#0E0F12',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            minWidth: 200,
          }}>
            <div style={{
              padding: '10px 14px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>Platform Support</div>
                <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: 'rgba(255,255,255,0.2)', marginTop: 1, letterSpacing: '0.06em' }}>
                  {pageLabel.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 2 }}
              >
                <X size={12} />
              </button>
            </div>

            <div style={{ padding: '6px' }}>
              <button
                onClick={() => { setExpanded(false); openFAQ(pageLabel); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 11px', borderRadius: 9, cursor: 'pointer',
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
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>Browse help articles</div>
                </div>
              </button>

              <button
                onClick={() => { setExpanded(false); openBugReport(pageLabel); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 11px', borderRadius: 9, cursor: 'pointer',
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

            <div style={{ padding: '6px 14px 9px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.14)', letterSpacing: '0.08em' }}>
                GMG PLATFORM SUPPORT
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(v => !v)}
        title="Platform Support"
        style={{
          pointerEvents: 'all',
          display: 'flex', alignItems: 'center', gap: 6,
          padding: expanded ? '8px 14px' : '8px 14px',
          borderRadius: 40,
          background: expanded
            ? 'rgba(6,182,212,0.15)'
            : 'rgba(14,15,18,0.95)',
          border: `1px solid ${expanded ? 'rgba(6,182,212,0.35)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: expanded
            ? '0 0 0 3px rgba(6,182,212,0.12), 0 8px 30px rgba(0,0,0,0.6)'
            : '0 4px 24px rgba(0,0,0,0.55)',
          color: expanded ? '#06B6D4' : 'rgba(255,255,255,0.55)',
          cursor: 'pointer',
          transition: 'all 0.18s',
          backdropFilter: 'blur(12px)',
        }}
        onMouseEnter={e => {
          if (!expanded) {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.color = 'rgba(255,255,255,0.85)';
            b.style.borderColor = 'rgba(255,255,255,0.2)';
          }
        }}
        onMouseLeave={e => {
          if (!expanded) {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.color = 'rgba(255,255,255,0.55)';
            b.style.borderColor = 'rgba(255,255,255,0.1)';
          }
        }}
      >
        {expanded
          ? <X size={14} />
          : <MessageSquare size={14} />
        }
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          {expanded ? 'CLOSE' : 'SUPPORT'}
        </span>
        {!expanded && (
          <div style={{
            position: 'absolute',
            top: -3, right: -3,
            width: 8, height: 8, borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #0E0F12',
            boxShadow: '0 0 5px #10B981',
          }} />
        )}
      </button>
    </div>
  );
}
