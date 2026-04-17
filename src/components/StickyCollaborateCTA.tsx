import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface StickyCollaborateCTAProps {
  heroRef: React.RefObject<HTMLElement | null>;
  footerRef: React.RefObject<HTMLElement | null>;
  onOpenModal: () => void;
}

export default function StickyCollaborateCTA({ heroRef, footerRef, onOpenModal }: StickyCollaborateCTAProps) {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const heroBottom = heroRef.current
        ? heroRef.current.getBoundingClientRect().bottom
        : 0;

      const pastHero = heroBottom < 0;

      let close = false;
      if (footerRef.current) {
        const footerTop = footerRef.current.getBoundingClientRect().top;
        close = footerTop < window.innerHeight + 80;
      }

      setVisible(pastHero && !close);
      setNearFooter(close);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroRef, footerRef]);

  const shown = visible && !nearFooter;

  return (
    <div
      aria-hidden={!shown}
      className="fixed z-[100] transition-all duration-500 ease-out"
      style={{
        bottom: '28px',
        right: '24px',
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
        pointerEvents: shown ? 'auto' : 'none',
      }}
    >
      <button
        onClick={onOpenModal}
        className="group flex flex-col items-end gap-0.5"
        tabIndex={shown ? 0 : -1}
        aria-label="Collaborate With Us — Cultural Media"
      >
        <span
          className="text-[10px] font-black tracking-[0.25em] uppercase mb-1"
          style={{ color: 'rgba(212,175,55,0.65)' }}
        >
          Cultural Media
        </span>
        <div
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl transition-all duration-300 group-hover:scale-105"
          style={{
            background: 'rgba(10,10,10,0.92)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
            transition: 'box-shadow 0.3s, transform 0.3s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              '0 12px 50px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.12), 0 0 0 1px rgba(212,175,55,0.25)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)';
          }}
        >
          <span className="text-sm font-bold text-white tracking-wide">Collaborate With Us</span>
          <ArrowRight
            size={14}
            strokeWidth={2.5}
            className="text-white/50 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all duration-200"
          />
        </div>
      </button>
    </div>
  );
}
