import { useCallback, useRef } from 'react';

// Subtle magnetic tilt for cards. Spread onMouseMove/onMouseLeave onto the card element.
// The card must contain a child with class `.gmg-card-inner` that receives the tilt.
export function useMagneticCard(strength = 6) {
  // Cache the inner element so querySelector doesn't run on every mousemove
  const innerRef = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!innerRef.current) {
      innerRef.current = e.currentTarget.querySelector<HTMLElement>('.gmg-card-inner');
    }
    const inner = innerRef.current;
    if (!inner) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
    const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
    inner.style.transform = `rotateY(${dx * strength}deg) rotateX(${-dy * strength}deg) translateZ(2px)`;
  }, [strength]);

  const onMouseLeave = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    if (innerRef.current) {
      innerRef.current.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0)';
    }
    innerRef.current = null; // reset so next card gets a fresh lookup
  }, []);

  return { onMouseMove, onMouseLeave };
}
