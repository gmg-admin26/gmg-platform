import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

const bullets = [
  'Series development and concept collaboration',
  'Artist, brand, and cultural programming partnerships',
  'Early access to GMG media initiatives and rollout opportunities',
];

interface CollaborateModalProps {
  onClose: () => void;
}

export default function CollaborateModal({ onClose }: CollaborateModalProps) {
  const navigate = useNavigate();

  const handleContinue = useCallback(() => {
    onClose();
    navigate('/get-started#creative-collaborator');
    setTimeout(() => {
      const el = document.getElementById('creative-collaborator');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 120);
  }, [navigate, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Collaborate with GMG Cultural Media"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        style={{ backdropFilter: 'blur(12px)' }}
      />

      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(18,18,18,0.98) 0%, rgba(10,10,10,0.99) 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)',
          animation: 'modalIn 0.28s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
        `}</style>

        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)' }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative p-8 md:p-10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2} />
          </button>

          <div className="mb-7">
            <span className="inline-block text-xs font-black tracking-[0.3em] uppercase text-gmg-gold/80 mb-4 border border-gmg-gold/25 px-2.5 py-1 rounded-md">
              Cultural Media
            </span>
            <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-white mb-3">
              Collaborate With GMG<br />Cultural Media
            </h2>
            <p className="text-base text-white/55 leading-relaxed">
              Original programming, cultural storytelling, artist-led formats, and development partnerships built for what's next.
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.7)' }}
                />
                <span className="text-sm text-white/65 leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleContinue}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-bold text-base rounded-xl hover:bg-gmg-gold transition-all duration-300 hover:scale-[1.02] group"
            >
              Continue to Collaborate
              <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
            <button
              onClick={onClose}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-white/40 hover:text-white/70 text-sm font-medium transition-colors duration-200"
            >
              Close
            </button>
          </div>

          <p className="text-center text-xs text-white/25 mt-4 leading-relaxed">
            Built for artists, brands, and creative collaborators shaping culture.
          </p>
        </div>
      </div>
    </div>
  );
}
