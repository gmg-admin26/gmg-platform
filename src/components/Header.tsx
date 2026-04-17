// =============================================================================
// LOCKED PRODUCTION COMPONENT — Public site navigation header
// Do NOT redesign, regenerate, or replace this component.
// Only make scoped edits (e.g. adding/removing nav links, fixing destinations).
// Nav link destinations must match routes in src/lib/routes.ts
// =============================================================================
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import BrandLockup from './BrandLockup';

const navLinks = [
  { name: 'AI Scouts', path: '/discovery' },
  { name: 'Artist OS', path: '/platform' },
  { name: 'Catalog OS', path: '/catalog-os' },
  { name: 'Industry OS', path: '/industry-os' },
  { name: 'Cultural Media', path: '/media' },
  { name: 'Collections', path: '/shop' },
  { name: 'About', path: '/about' },
  { name: 'Press', path: '/press' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/catalog-os') {
      return location.pathname === '/catalog-os' || location.pathname.startsWith('/catalog-os/');
    }
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-black/40 backdrop-blur-2xl border-b border-white/[0.06] shadow-sm shadow-white/[0.02]'
          : 'bg-black/20 backdrop-blur-md border-b border-white/[0.04]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-8 py-3.5">
        <div className="flex items-center justify-between">
          <Link to="/" className="mr-12 flex items-center">
            <BrandLockup variant="nav" showSignalMotif={true} />
          </Link>

          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 ease-out group ${
                  isActive(link.path) ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {isActive(link.path) && (
                  <div className="absolute inset-x-2 bottom-0 h-[1px] bg-white/30 rounded-full"></div>
                )}
                {!isActive(link.path) && (
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] rounded-lg transition-all duration-300 ease-out"></div>
                )}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center ml-auto">
            <button
              onClick={() => handleNavClick('/get-started')}
              className="relative px-6 py-2 bg-white/[0.03] border border-white/[0.12] hover:bg-white/[0.06] hover:border-white/[0.18] text-white text-[13px] font-medium tracking-wide rounded-full transition-all duration-300 ease-out group overflow-hidden"
            >
              <span className="relative z-10">Request Access</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/[0.02] to-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white/90 hover:text-white transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-6 pb-4 border-t border-white/[0.06] pt-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`block w-full text-left px-4 py-2.5 text-[13px] font-medium tracking-wide rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('/get-started')}
              className="block w-full px-6 py-2.5 mt-4 bg-white/[0.03] border border-white/[0.12] hover:bg-white/[0.06] text-white text-[13px] font-medium tracking-wide rounded-full text-center transition-all duration-300"
            >
              Request Access
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
