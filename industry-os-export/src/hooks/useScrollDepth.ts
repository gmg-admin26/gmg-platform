import { useEffect, useRef } from 'react';
import { Analytics } from '../lib/analytics';

const THRESHOLDS = [25, 50, 75, 100] as const;
type Threshold = (typeof THRESHOLDS)[number];

// Fires Analytics.scrollDepth once per threshold per page mount.
// Uses a single passive scroll listener and reads scrollY + documentElement
// dimensions — no layout thrashing since these are already-dirty values
// by the time the scroll event fires.
export function useScrollDepth(page: string) {
  const fired = useRef(new Set<Threshold>());

  useEffect(() => {
    fired.current.clear();

    const onScroll = () => {
      const el   = document.documentElement;
      const pct  = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;

      for (const threshold of THRESHOLDS) {
        if (!fired.current.has(threshold) && pct >= threshold) {
          fired.current.add(threshold);
          Analytics.scrollDepth(page, threshold);
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);
}
