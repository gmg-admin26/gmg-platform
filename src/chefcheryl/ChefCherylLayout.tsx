import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ChefHat, Star } from 'lucide-react';
import { ENROLLMENT_OPEN } from './config';

const NAV_LINKS = [
  { label: 'Home',           to: '/chef-cheryl'          },
  { label: 'Summer 2026',    to: '/chef-cheryl/classes'  },
  { label: 'About Chef Cheryl', to: '/chef-cheryl/about' },
  { label: 'Gallery',        to: '/chef-cheryl/gallery'  },
  { label: 'FAQ',            to: '/chef-cheryl/faq'      },
  { label: 'Contact',        to: '/chef-cheryl/contact'  },
];

export default function ChefCherylLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <div className="cc-root min-h-screen" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: '#FAFAF7' }}>
      {/* Announcement bar */}
      <div style={{ background: '#5C7A4E', color: '#F5F0E8' }} className="text-center py-2.5 px-4">
        <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13, letterSpacing: '0.01em' }}>
          <span className="font-semibold">Summer 2026 classes begin June 15.</span>
          {' '}
          {ENROLLMENT_OPEN
            ? 'Enrollment is open — spots are first come, first served.'
            : <>Reserve your spot now — enrollment opens <span className="font-semibold">May 1, 2026</span>.</>
          }
        </p>
      </div>

      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(250,250,247,0.97)' : '#FAFAF7',
          borderBottom: scrolled ? '1px solid rgba(92,122,78,0.12)' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/chef-cheryl" className="flex items-center gap-2.5 group">
            <div style={{ background: '#5C7A4E', borderRadius: 12 }} className="w-9 h-9 flex items-center justify-center">
              <ChefHat className="w-5 h-5" style={{ color: '#F5F0E8' }} />
            </div>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 700, color: '#2A3D1F', lineHeight: 1.1 }}>Chef Cheryl</div>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 10, color: '#8A9E7A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Summer Cooking Classes</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 14,
                  color: location.pathname === link.to ? '#5C7A4E' : '#4A5A3A',
                  fontWeight: location.pathname === link.to ? 600 : 400,
                  padding: '6px 14px',
                  borderRadius: 8,
                  background: location.pathname === link.to ? 'rgba(92,122,78,0.1)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:block">
            <Link
              to="/chef-cheryl/reserve"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: ENROLLMENT_OPEN ? '#C94A2A' : '#5C7A4E',
                color: '#FFF8F0',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 14, fontWeight: 600,
                padding: '10px 22px', borderRadius: 50,
                textDecoration: 'none',
                boxShadow: ENROLLMENT_OPEN ? '0 4px 16px rgba(201,74,42,0.28)' : '0 4px 16px rgba(92,122,78,0.28)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: '0.01em',
              }}
            >
              <Star className="w-3.5 h-3.5" />
              {ENROLLMENT_OPEN ? 'Enroll Now' : 'Reserve Your Spot'}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: '#4A5A3A' }}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="lg:hidden border-t px-5 py-4 space-y-1"
            style={{ background: '#FAFAF7', borderColor: 'rgba(92,122,78,0.12)' }}
          >
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: 15,
                  color: '#4A5A3A',
                  padding: '10px 12px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  fontWeight: location.pathname === link.to ? 600 : 400,
                  background: location.pathname === link.to ? 'rgba(92,122,78,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/chef-cheryl/reserve"
              style={{
                display: 'block',
                background: ENROLLMENT_OPEN ? '#C94A2A' : '#5C7A4E',
                color: '#FFF8F0',
                fontFamily: 'system-ui, sans-serif',
                fontSize: 15, fontWeight: 600,
                padding: '12px 16px', borderRadius: 50,
                textDecoration: 'none', textAlign: 'center',
                marginTop: 8,
              }}
            >
              {ENROLLMENT_OPEN ? 'Enroll Now' : 'Reserve Your Spot'}
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: '#2A3D1F', color: '#C5D4B5' }} className="mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div style={{ background: '#5C7A4E', borderRadius: 10 }} className="w-8 h-8 flex items-center justify-center">
                <ChefHat className="w-4 h-4" style={{ color: '#F5F0E8' }} />
              </div>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 700, color: '#F5F0E8' }}>Chef Cheryl</span>
            </div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, lineHeight: 1.7, color: '#8A9E7A', maxWidth: 320 }}>
              Premium hands-on cooking classes for elementary and middle school students. Building skills, confidence, and a love of cooking — one week at a time.
            </p>
          </div>

          <div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A8A5A', fontWeight: 600, marginBottom: 14 }}>Quick Links</p>
            <div className="space-y-2.5">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} style={{ display: 'block', fontFamily: 'system-ui, sans-serif', fontSize: 14, color: '#8A9E7A', textDecoration: 'none' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6A8A5A', fontWeight: 600, marginBottom: 14 }}>Summer 2026</p>
            <div className="space-y-2" style={{ fontFamily: 'system-ui, sans-serif', fontSize: 14, color: '#8A9E7A' }}>
              <p>Starts June 15, 2026</p>
              <p>8-week program</p>
              <p>$300 / week per child</p>
              <p>All supplies included</p>
              <p>Morning &amp; afternoon sessions</p>
            </div>
            <div className="mt-5">
              <Link to="/chef-cheryl/reserve" style={{
                display: 'inline-block',
                background: '#5C7A4E', color: '#F5F0E8',
                fontFamily: 'system-ui, sans-serif', fontSize: 13, fontWeight: 600,
                padding: '9px 20px', borderRadius: 50, textDecoration: 'none',
              }}>
                Reserve Your Spot
              </Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#4A6A3A' }}>
            &copy; 2026 Chef Cheryl's Cooking Classes. All rights reserved.
          </p>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: 12, color: '#4A6A3A' }}>
            A summer experience they'll remember long after the last bite.
          </p>
        </div>
      </footer>
    </div>
  );
}
