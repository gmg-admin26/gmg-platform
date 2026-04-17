import { useState, useRef } from 'react';
import CollaborateModal from '../components/CollaborateModal';
import StickyCollaborateCTA from '../components/StickyCollaborateCTA';

const originalSeries = [
  {
    id: 1,
    title: 'Almost Famous… For Real',
    tagline: 'The Road to the Spotlight',
    description: 'A raw look at emerging artists navigating the modern music industry.',
    status: 'Competition Series',
    category: 'Competition',
    image: '/bus-Almost-famous.png',
    accentColor: 'rgba(212, 175, 55, 0.6)',
    glowColor: 'rgba(212, 175, 55, 0.3)',
    isFeatured: true,
  },
  {
    id: 2,
    title: 'Artists vs AI',
    tagline: 'Creativity vs Code',
    description: 'A cultural series exploring the evolving relationship between artists and artificial intelligence.',
    status: 'Original Series',
    category: 'Doc Series',
    image: '/artists_v_ai_.jpg',
    accentColor: 'rgba(6, 182, 212, 0.6)',
    glowColor: 'rgba(6, 182, 212, 0.3)',
    isFeatured: false,
  },
  {
    id: 3,
    title: 'In A Room Full of People',
    tagline: 'Conversations That Shape Culture',
    description: 'Raw conversations with artists, producers, and cultural leaders exploring the realities behind modern music.',
    status: 'Original Series',
    category: 'Original Series',
    image: '/room_full_of_peoples.jpg',
    accentColor: 'rgba(236, 72, 153, 0.6)',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    isFeatured: false,
  },
  {
    id: 4,
    title: 'Creative House',
    tagline: 'Where Culture Lives',
    description: 'Inside the creative spaces where music, fashion, art, and technology collide.',
    status: 'Original Series',
    category: 'Original Series',
    image: '/creative_house_image.jpg',
    accentColor: 'rgba(251, 146, 60, 0.6)',
    glowColor: 'rgba(251, 146, 60, 0.3)',
    isFeatured: false,
  },
];

export default function Media() {
  const [modalOpen, setModalOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <HeroSection ref={heroRef} onOpenModal={openModal} />
      <MicroSeriesPositioning />
      <PositioningStatement />
      <ProgrammingSlate />
      <NetworkIdentity />
      <CategoryClaim />
      <PartnerCTA onOpenModal={openModal} ref={footerRef} />

      <StickyCollaborateCTA
        heroRef={heroRef}
        footerRef={footerRef}
        onOpenModal={openModal}
      />

      {modalOpen && <CollaborateModal onClose={closeModal} />}
    </div>
  );
}

import { forwardRef } from 'react';

const HeroSection = forwardRef<HTMLElement, { onOpenModal: () => void }>(
  ({ onOpenModal }, ref) => {
    return (
      <section ref={ref} className="relative min-h-[90vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/bus-Almost-famous.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gmg-gold/40 to-transparent" />

        <div className="relative w-full px-6 pb-20 md:pb-28">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 bg-gmg-gold rounded-full animate-pulse" />
                <span
                  className="text-xs font-bold tracking-[0.3em] uppercase"
                  style={{
                    color: 'rgba(212,175,55,0.9)',
                    textShadow: '0 0 20px rgba(212,175,55,0.5)',
                    letterSpacing: '0.28em',
                  }}
                >
                  Season 01 &bull; Network Launch
                </span>
              </div>

              <h1
                className="text-6xl md:text-8xl lg:text-[96px] font-black leading-none tracking-tight mb-6"
                style={{ textShadow: '0 0 80px rgba(212,175,55,0.2), 0 4px 40px rgba(0,0,0,0.8)' }}
              >
                Almost Famous…<br />
                <span className="text-gmg-gold">For Real.</span>
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-xl leading-relaxed">
                A raw look at emerging artists navigating the modern music industry.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onOpenModal}
                  className="inline-flex items-center px-8 py-4 bg-white/10 text-white font-bold text-base rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  Collaborate With Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);
HeroSection.displayName = 'HeroSection';

function MicroSeriesPositioning() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gmg-gold/20 to-transparent" />

      <div className="relative max-w-[1200px] mx-auto">
        <div className="max-w-2xl">
          <span className="inline-block text-xs font-black tracking-[0.35em] uppercase text-gmg-gold mb-5 border border-gmg-gold/30 px-3 py-1 rounded-md">
            New Format
          </span>
          <h2
            className="text-4xl md:text-6xl font-black leading-none tracking-tight mb-4"
            style={{ textShadow: '0 0 60px rgba(212,175,55,0.15)' }}
          >
            Micro-series for<br />music culture.
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium">
            Short-form. Serialized. Built for how audiences actually watch.
          </p>
        </div>
      </div>
    </section>
  );
}

function PositioningStatement() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-graphite/10 to-black" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.03) 60px, rgba(255,255,255,0.03) 61px)',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto text-center">
        <h2
          className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tight"
          style={{ textShadow: '0 0 100px rgba(212,175,55,0.12), 0 0 40px rgba(255,255,255,0.05)' }}
        >
          We don't make content.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gmg-gold via-white to-gmg-gold">
            We program culture.
          </span>
        </h2>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          Original series built around artists, moments, and movements.<br className="hidden md:block" />
          <span className="text-white/35">Structured like programming. Moving at the speed of culture.</span>
        </p>
      </div>
    </section>
  );
}

function ProgrammingSlate() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative py-8 pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-graphite/5 to-black" />

      <div className="relative max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-gmg-gold rounded-full" />
            <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
              Season 01 Lineup
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-gmg-gold rounded-full animate-pulse" />
            <span className="text-xs text-white/40 tracking-widest uppercase font-semibold">All Projects In Development</span>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative px-6 md:px-12"
        style={{
          overflowX: 'auto',
          overflowY: 'visible',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '8px',
        }}
      >
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>
        <div
          className="flex gap-4 md:gap-6"
          style={{
            width: 'max-content',
            paddingLeft: '24px',
            paddingRight: '24px',
          }}
        >
          {originalSeries.map((show, index) => (
            <ShowCard key={show.id} show={show} index={index} total={originalSeries.length} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShowCard({ show, index, total }: { show: typeof originalSeries[0]; index: number; total: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const isCenterish = index === 0 || index === Math.floor(total / 2);

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-2xl flex-shrink-0 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        scrollSnapAlign: 'center',
        width: '280px',
        aspectRatio: '9/16',
        transform: isHovered
          ? 'translateY(-8px) scale(1.03)'
          : isCenterish
          ? 'translateY(0) scale(1.0)'
          : 'translateY(0) scale(0.96)',
        opacity: isHovered ? 1 : isCenterish ? 1 : 0.75,
        boxShadow: isHovered
          ? `0 32px 80px ${show.glowColor}, 0 0 0 1px ${show.accentColor}`
          : `0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)`,
      }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url(${show.image})`,
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.30 : 0.50 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {show.isFeatured && (
        <div className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${show.accentColor} 0%, transparent 70%)`,
            opacity: isHovered ? 0.3 : 0.12,
          }}
        />
      )}

      <div className="absolute inset-x-0 top-0 h-px transition-opacity duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${show.accentColor}, transparent)`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        <div className="flex flex-col gap-2 items-start">
          <span
            className="text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md backdrop-blur-sm"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'rgba(212,175,55,0.9)',
              border: `1px solid rgba(212,175,55,0.3)`,
            }}
          >
            In Development
          </span>
          <span
            className="text-xs font-semibold tracking-widest uppercase px-2.5 py-1 rounded-md backdrop-blur-sm"
            style={{
              background: 'rgba(0,0,0,0.6)',
              color: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${isHovered ? show.accentColor : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.4s',
            }}
          >
            {show.category}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black leading-tight mb-1.5 drop-shadow-2xl">
            {show.title}
          </h3>
          <p
            className="text-sm italic mb-3 transition-colors duration-400"
            style={{ color: isHovered ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.45)' }}
          >
            {show.tagline}
          </p>
          <p
            className="text-sm leading-relaxed transition-all duration-500 line-clamp-3"
            style={{ color: 'rgba(255,255,255,0.60)' }}
          >
            {show.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function NetworkIdentity() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gmg-graphite/10 to-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-14 leading-tight">
          Built like a network.<br />
          <span className="text-white/40">Powered like a system.</span>
        </h2>

        <div className="flex flex-col items-center gap-5">
          {['Always on.', 'Always evolving.', 'Always inside the culture.'].map((line, i) => (
            <span key={i} className="text-xl md:text-2xl font-bold text-white/70 tracking-wide">
              {line}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryClaim() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gmg-gold/15 to-transparent" />

      <div className="relative max-w-[1100px] mx-auto text-center">
        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-6"
          style={{ textShadow: '0 0 80px rgba(212,175,55,0.1)' }}
        >
          The next category of music media<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gmg-gold to-white">
            is micro-series.
          </span>
        </h2>
        <p className="text-xl text-white/45 font-medium">
          We're building it from the ground up.
        </p>
      </div>
    </section>
  );
}

const PartnerCTA = forwardRef<HTMLElement, { onOpenModal: () => void }>(
  ({ onOpenModal }, ref) => {
    return (
      <section ref={ref} className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gmg-graphite/20" />

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            We collaborate with artists, brands, and platforms to build original programming that actually moves culture.
          </p>
          <button
            onClick={onOpenModal}
            className="inline-flex items-center px-12 py-5 bg-white text-black font-bold text-lg rounded-xl hover:bg-gmg-gold transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            Collaborate With Us
          </button>
        </div>
      </section>
    );
  }
);
PartnerCTA.displayName = 'PartnerCTA';
