import { useState, useMemo } from 'react';
import { X, Search, ChevronDown, HelpCircle, Bug } from 'lucide-react';
import { useHelp } from '../../context/HelpContext';
import { FAQ_CATEGORIES, type FAQItem } from '../../data/faqData';

function FAQItemRow({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{
      borderRadius: 10,
      border: `1px solid ${isOpen ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)'}`,
      background: isOpen ? 'rgba(6,182,212,0.04)' : 'rgba(255,255,255,0.02)',
      overflow: 'hidden',
      transition: 'all 0.15s',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 10,
        }}
      >
        <span style={{ fontSize: 12.5, fontWeight: 600, color: isOpen ? '#F9FAFB' : 'rgba(255,255,255,0.7)', lineHeight: 1.4, flex: 1 }}>
          {item.question}
        </span>
        <ChevronDown
          size={13}
          style={{ color: isOpen ? '#06B6D4' : 'rgba(255,255,255,0.25)', flexShrink: 0, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      {isOpen && (
        <div style={{ padding: '0 14px 14px' }}>
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 12 }} />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPanel() {
  const { isOpen, view, pageContext, close, openBugReport } = useHelp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const show = isOpen && view === 'faq';

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQ_CATEGORIES
      .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          !q ||
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.items.length > 0);
  }, [search, activeCategory]);

  function toggleItem(id: string) {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!show) return null;

  return (
    <>
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 1400,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
        }}
      />

      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 1401,
        width: 480, maxWidth: '95vw',
        background: '#0B0C0F',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.6)',
        animation: 'slideInRight 0.22s ease-out',
      }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        <div style={{
          padding: '18px 20px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          background: 'rgba(6,182,212,0.03)',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#06B6D450,transparent)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HelpCircle size={14} color="#06B6D4" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', letterSpacing: '-0.01em' }}>Help & FAQ</div>
                {pageContext && (
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 1, letterSpacing: '0.06em' }}>
                    {pageContext.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => openBugReport(pageContext)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 11px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#EF4444',
                }}
              >
                <Bug size={11} />
                Report Bug
              </button>
              <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 4 }}>
                <X size={15} />
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.25)', pointerEvents: 'none' }} />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveCategory('all'); }}
              placeholder="Search questions..."
              autoFocus
              style={{
                width: '100%', padding: '8px 12px 8px 32px', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 9, color: '#F9FAFB', fontSize: 12, outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{
          padding: '10px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          display: 'flex', gap: 6, flexWrap: 'wrap',
          background: 'rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '4px 10px', borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: 'pointer',
              background: activeCategory === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: `1px solid ${activeCategory === 'all' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
              color: activeCategory === 'all' ? 'rgba(255,255,255,0.8)' : '#6B7280',
              transition: 'all 0.13s',
            }}
          >
            All
          </button>
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '4px 10px', borderRadius: 7, fontSize: 10, fontWeight: 600, cursor: 'pointer',
                background: activeCategory === cat.id ? 'rgba(6,182,212,0.1)' : 'transparent',
                border: `1px solid ${activeCategory === cat.id ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.07)'}`,
                color: activeCategory === cat.id ? '#06B6D4' : '#6B7280',
                transition: 'all 0.13s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredCategories.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: 10 }}>
              <HelpCircle size={28} color="rgba(255,255,255,0.1)" />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
                No results found for "{search}"
              </p>
              <button
                onClick={() => openBugReport(pageContext)}
                style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                  color: '#EF4444', marginTop: 4,
                }}
              >
                Submit a Bug Report Instead
              </button>
            </div>
          ) : (
            filteredCategories.map(cat => (
              <div key={cat.id}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 9 }}>
                  {cat.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cat.items.map(item => (
                    <FAQItemRow
                      key={item.id}
                      item={item}
                      isOpen={openItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{
          padding: '12px 20px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.18)' }}>
            GMG PLATFORM SUPPORT
          </span>
          <button
            onClick={() => openBugReport(pageContext)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
              color: '#EF4444',
            }}
          >
            <Bug size={11} />
            Report a Bug
          </button>
        </div>
      </div>
    </>
  );
}
