// =============================================================================
// LOCKED PRODUCTION COMPONENT — Product card for Collections page
// Image safety rules:
//   - onError fires when image returns HTTP error
//   - onLoad fires to detect 0-byte / empty images (naturalWidth === 0)
//   - If primary fails → show safe placeholder; never show wrong product image
//   - If hover fails → fall back to primary only (no hover swap)
//   - Never break layout if image is missing
// =============================================================================
import { useState } from 'react';

interface ProductCardProps {
  title: string;
  price: string;
  status: string;
  primaryImage: string;
  hoverImage?: string;
  bg?: string;
  fit?: 'cover' | 'contain';
}

export default function ProductCard({
  title,
  price,
  status,
  primaryImage,
  hoverImage,
  bg = 'bg-neutral-100',
  fit = 'cover',
}: ProductCardProps) {
  const [primaryFailed, setPrimaryFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);

  const effectiveHover = hoverImage && !hoverFailed ? hoverImage : undefined;

  return (
    <div className="group cursor-pointer">
      {/* Image wrapper */}
      <div
        className={`relative w-full overflow-hidden rounded-[2px] transition-all duration-500 ease-out group-hover:shadow-[0_8px_40px_rgba(0,0,0,0.55)] group-hover:-translate-y-0.5 ${primaryFailed ? 'bg-zinc-900 border border-white/[0.06]' : bg}`}
        style={{ aspectRatio: '4/5' }}
      >
        {primaryFailed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center mb-1">
              <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-[11px] text-white/25 font-light tracking-wide leading-snug">{title}</p>
          </div>
        ) : (
          <>
            <img
              src={primaryImage}
              alt={title}
              onError={() => setPrimaryFailed(true)}
              onLoad={(e) => { if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setPrimaryFailed(true); }}
              className={`absolute inset-0 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-8'} transition-opacity duration-500 ease-in-out ${effectiveHover ? 'group-hover:opacity-0' : ''}`}
            />
            {effectiveHover && (
              <img
                src={effectiveHover}
                alt={`${title} — alternate view`}
                onError={() => setHoverFailed(true)}
                onLoad={(e) => { if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setHoverFailed(true); }}
                className={`absolute inset-0 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-8'} transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100`}
              />
            )}
          </>
        )}
        {/* Subtle bottom vignette to ground the image */}
        {!primaryFailed && <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />}
      </div>

      {/* Caption */}
      <div className="mt-5 pb-5 border-b border-white/[0.06]">
        <h3 className="text-[13px] font-medium text-white/90 tracking-[0.04em] leading-snug mb-2 transition-colors duration-300 group-hover:text-white">
          {title}
        </h3>
        <div className="flex items-baseline gap-3">
          {price && (
            <span className="text-[13px] text-white/50 font-light tracking-wide">
              {price}
            </span>
          )}
          <span className="text-[10px] text-white/25 font-normal tracking-[0.15em] uppercase">
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
