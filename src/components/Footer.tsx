import { Link } from 'react-router-dom';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import BrandLockup from './BrandLockup';

export default function Footer() {
  return (
    <footer className="relative bg-[#0B0B0D]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-6">
            <BrandLockup variant="footer" />
            <p className="text-[#9FA1A6] text-sm leading-relaxed max-w-xs tracking-wide">
              Music Infrastructure for the Modern Industry
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/ai-tools" className="text-gray-400 hover:text-white text-sm transition-colors">AI Artist Tools</Link></li>
              <li><Link to="/rocksteady" className="text-gray-400 hover:text-white text-sm transition-colors">Rocksteady A&R</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-white text-sm transition-colors">Catalog Growth</Link></li>
              <li><Link to="/operations" className="text-gray-400 hover:text-white text-sm transition-colors">Artist Operations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">More</h3>
            <ul className="space-y-2">
              <li><Link to="/merch" className="text-gray-400 hover:text-white text-sm transition-colors">Merch & Products</Link></li>
              <li><Link to="/media" className="text-gray-400 hover:text-white text-sm transition-colors">Media & Microseries</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About</Link></li>
              <li><Link to="/press" className="text-gray-400 hover:text-white text-sm transition-colors">Press</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <p className="text-gray-400 text-sm mb-4">
              Ready to grow your music?
            </p>
            <Link
              to="/contact"
              className="inline-block px-5 py-2 btn-glass-primary text-white rounded-lg font-medium text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-16 pt-10 text-center" style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <p className="text-sm font-light tracking-wide" style={{
            color: 'rgba(159, 161, 166, 0.6)'
          }}>
            &copy; {new Date().getFullYear()} Greater Music Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
