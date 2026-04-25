import { useEffect, useRef, useState } from 'react';

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Returns [ref, isRevealed].
 * Attaches an IntersectionObserver to the ref element.
 * By default fires once — element stays revealed after entering viewport.
 */
export function useReveal<T extends Element = HTMLElement>({
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setRevealed(false);
        }
      },
      { threshold, rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, revealed] as const;
}
