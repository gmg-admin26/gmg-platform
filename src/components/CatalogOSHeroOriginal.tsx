// ORPHANED FILE — Not imported anywhere in the app as of stabilization pass.
// The active Catalog OS public page is: src/pages/CatalogOS.tsx
// Do not delete without confirming it is still unused.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CatalogAccessRequestModal from './CatalogAccessRequestModal';

export default function CatalogOSHeroOriginal() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <CatalogAccessRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 140% 120% at 50% 50%, #1a1a3e 0%, #0d0d2b 30%, #080818 60%, #04040f 100%)',
        }}
      >
        {/* Deep navy base */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #0a0a20 0%, #0e0e2a 25%, #070714 55%, #030309 100%)',
          }}
        />

        {/* Central blue-purple radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 70% at 50% 45%, rgba(60,60,160,0.28) 0%, rgba(30,30,100,0.18) 35%, rgba(10,10,50,0.08) 60%, transparent 80%)',
          }}
        />

        {/* Softer outer corona */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 90% at 50% 50%, rgba(40,40,120,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Top/bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Star/noise field */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 12% 18%, rgba(180,180,255,0.9) 0%, transparent 100%),
              radial-gradient(1px 1px at 27% 44%, rgba(160,160,240,0.7) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 41% 9%, rgba(200,200,255,0.8) 0%, transparent 100%),
              radial-gradient(1px 1px at 58% 31%, rgba(170,170,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 73% 67%, rgba(190,190,255,0.8) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 85% 15%, rgba(180,180,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 93% 52%, rgba(160,160,240,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 6% 78%, rgba(200,200,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 34% 88%, rgba(170,170,255,0.5) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 65% 82%, rgba(190,190,255,0.6) 0%, transparent 100%),
              radial-gradient(1px 1px at 78% 91%, rgba(180,180,255,0.4) 0%, transparent 100%),
              radial-gradient(1px 1px at 19% 61%, rgba(160,160,240,0.5) 0%, transparent 100%),
              radial-gradient(1px 1px at 47% 55%, rgba(200,200,255,0.4) 0%, transparent 100%),
              radial-gradient(1.5px 1.5px at 88% 36%, rgba(190,190,255,0.7) 0%, transparent 100%),
              radial-gradient(1px 1px at 52% 73%, rgba(170,170,255,0.5) 0%, transparent 100%)
            `,
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-8 text-center flex flex-col items-center">

          {/* Eyebrow */}
          <p
            className="text-xs font-semibold tracking-[0.3em] uppercase mb-8"
            style={{ color: 'rgba(160,160,230,0.55)' }}
          >
            Greater Music Group
          </p>

          {/* Headline */}
          <h1
            className="font-black leading-[0.9] tracking-tighter mb-7"
            style={{
              fontSize: 'clamp(4rem, 10vw, 8rem)',
              color: '#EEEEF5',
            }}
          >
            Catalog OS
          </h1>

          {/* Subheadline */}
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 leading-tight"
            style={{ color: 'rgba(220,220,245,0.72)' }}
          >
            Turn Catalog Into a Living Growth Engine
          </h2>

          {/* Body */}
          <p
            className="text-lg md:text-xl font-light leading-relaxed mb-4 max-w-2xl"
            style={{ color: 'rgba(200,200,230,0.52)' }}
          >
            Catalog OS is GMG's AI-powered system for managing, optimizing, and scaling music catalogs.
          </p>
          <p
            className="text-base font-light leading-relaxed mb-14 max-w-xl"
            style={{ color: 'rgba(180,180,210,0.38)' }}
          >
            It continuously improves performance across distribution, metadata, audience expansion, and revenue generation.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Primary */}
            <Link
              to="/catalog-os/login"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              style={{
                background: 'rgba(80, 80, 200, 0.18)',
                border: '1px solid rgba(120, 120, 255, 0.35)',
                color: '#EEEEF5',
                boxShadow: '0 0 28px rgba(80, 80, 200, 0.25), 0 4px 20px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(80, 80, 200, 0.28)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(140, 140, 255, 0.55)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 42px rgba(80, 80, 200, 0.4), 0 6px 28px rgba(0,0,0,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(80, 80, 200, 0.18)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(120, 120, 255, 0.35)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(80, 80, 200, 0.25), 0 4px 20px rgba(0,0,0,0.4)';
              }}
            >
              Access Catalog OS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary / ghost */}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid rgba(160, 160, 220, 0.22)',
                color: 'rgba(200, 200, 235, 0.6)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(160, 160, 220, 0.42)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(220, 220, 245, 0.85)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(160, 160, 220, 0.22)';
                (e.currentTarget as HTMLElement).style.color = 'rgba(200, 200, 235, 0.6)';
              }}
            >
              Partner Access
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
