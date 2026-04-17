// =============================================================================
// LOCKED PRODUCTION PAGE — Collections / Shop page
// Do NOT redesign, regenerate, or replace this component.
// Only make scoped edits (e.g. adding/removing product cards).
// Route: /shop
// Product data source: src/data/collections.ts
// Image base path: /images/collections/{collection-name}/
// =============================================================================
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import {
  troubleAndrewProducts,
  accessoriesProducts,
  gpsBrandProducts,
  artistDropsProducts,
} from '../data/collections';

export default function Shop() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full flex items-center justify-center will-change-transform"
            style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.15)` }}
          >
            <img
              src="/ChatGPT_Image_Mar_11,_2026,_04_06_28_PM.png"
              alt=""
              className="w-auto h-[130%] object-contain opacity-[0.08]"
              style={{ filter: 'blur(0.8px)' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,rgba(0,0,0,0.6)_65%,black_100%)]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight leading-none drop-shadow-2xl">
            Greater Provisions<br />& Supply Co.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed mb-5 tracking-wide drop-shadow-lg">
            Limited drops and cultural collaborations.
          </p>
          <p className="text-base md:text-lg text-white/60 max-w-3xl mx-auto font-light leading-relaxed">
            Collections released in limited runs tied to artists, tours, and creative partnerships.
          </p>
        </div>
      </div>

      {/* FEATURED COLLECTIONS */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">Featured Collections</h2>
            <p className="text-base text-white/50 font-light tracking-wide">Curated drops and limited releases.</p>
          </div>

          {/* GPS × Trouble Andrew — featured hero card */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-1 group cursor-pointer">
              <div className="relative w-full overflow-hidden rounded-sm bg-neutral-900" style={{ aspectRatio: '2/3' }}>
                <img
                  src="/images/collections/trouble-andrew/tour-art-cardigan-primary.png"
                  alt="GPS × Trouble Andrew Tour Art Collection - Front"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <img
                  src="/images/collections/trouble-andrew/tour-art-cardigan-hover.png"
                  alt="GPS × Trouble Andrew Tour Art Collection - Back"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                />
              </div>
            </div>
            <div className="order-2">
              <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                GPS × Trouble Andrew<br />Tour Art Collection
              </h3>
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed mb-8">
                Limited edition pre-order collaboration featuring tour artwork and cultural design.
              </p>
              <button className="group inline-flex items-center gap-2 text-white hover:gap-4 transition-all">
                <span className="text-sm font-medium tracking-wide">Shop Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GPS × TROUBLE ANDREW PRODUCT GRID */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse"></div>
              <p className="text-[10px] md:text-xs text-cyan-400/70 font-medium tracking-[0.25em] uppercase">GPS GLOBAL DROP</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">GPS × Trouble Andrew</h2>
            <p className="text-lg text-white/60 font-light tracking-wide mb-3">Limited Edition Pre-Order</p>
            <p className="text-xs text-white/30 font-light tracking-[0.15em] uppercase">Drop Coordinates: Los Angeles</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {troubleAndrewProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>

      {/* ACCESSORIES & PRODUCTS */}
      <div className="relative py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900/50 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <p className="text-[10px] md:text-xs text-cyan-400/70 font-medium tracking-[0.25em] uppercase">GPS PARTNER COLLABORATIONS</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.7s' }}></div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">Accessories & Products</h2>
            <p className="text-lg text-white/60 font-light tracking-wide mb-3">Brand and artist collaborations.</p>
            <p className="text-xs text-white/30 font-light tracking-[0.15em] uppercase">Distribution Network: Nationwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {accessoriesProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>

      {/* GPS BRAND COLLECTION */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <p className="text-[10px] md:text-xs text-cyan-400/70 font-medium tracking-[0.25em] uppercase">GPS CORE COLLECTION</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">GPS Brand Collection</h2>
            <p className="text-lg text-white/60 font-light tracking-wide mb-3">Exclusive GMG products and apparel.</p>
            <p className="text-xs text-white/30 font-light tracking-[0.15em] uppercase">Origin Point: Global Network HQ</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {gpsBrandProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>

      {/* ARTIST DROPS */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <p className="text-[10px] md:text-xs text-cyan-400/70 font-medium tracking-[0.25em] uppercase">GPS ARTIST NETWORK</p>
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">Artist Drops</h2>
            <p className="text-lg text-white/60 font-light tracking-wide mb-3">Tour merchandise and artist collections.</p>
            <p className="text-xs text-white/30 font-light tracking-[0.15em] uppercase">Signal Source: Tour Routes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
            {artistDropsProducts.map((product) => (
              <ProductCard key={product.title} {...product} />
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black"></div>
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-tight">
            Limited Drops & Cultural Collaborations
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            Collections released in limited runs tied to artists, tours, and creative partnerships.
          </p>
          <Link
            to="/get-started"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white text-black text-base font-medium tracking-wide rounded-full hover:bg-white/90 hover:scale-105 transition-all duration-300 group shadow-2xl shadow-white/10"
          >
            <span>Discuss A Collaboration</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
