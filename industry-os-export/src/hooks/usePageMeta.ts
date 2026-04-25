import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

// Swaps document metadata on mount, restores defaults on unmount.
// Designed for pages that need distinct SEO / OG identity from the site default.
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prev = snapshot();
    apply(meta);
    return () => apply(prev);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getMeta(selector: string): string {
  return document.querySelector<HTMLMetaElement>(selector)?.content ?? '';
}

function setMeta(selector: string, content: string) {
  const el = document.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

function snapshot(): PageMeta {
  return {
    title:              document.title,
    description:        getMeta('meta[name="description"]'),
    ogTitle:            getMeta('meta[property="og:title"]'),
    ogDescription:      getMeta('meta[property="og:description"]'),
    ogImage:            getMeta('meta[property="og:image"]'),
    ogImageAlt:         getMeta('meta[property="og:image:alt"]'),
    ogUrl:              getMeta('meta[property="og:url"]'),
    twitterTitle:       getMeta('meta[name="twitter:title"]'),
    twitterDescription: getMeta('meta[name="twitter:description"]'),
  };
}

function apply(meta: PageMeta) {
  document.title = meta.title;
  setMeta('meta[name="description"]',        meta.description);
  setMeta('meta[property="og:title"]',       meta.ogTitle        ?? meta.title);
  setMeta('meta[property="og:description"]', meta.ogDescription  ?? meta.description);
  setMeta('meta[property="og:url"]',         meta.ogUrl          ?? '');
  if (meta.ogImage) {
    setMeta('meta[property="og:image"]',         meta.ogImage);
    setMeta('meta[property="og:image:secure_url"]', meta.ogImage);
    setMeta('meta[property="og:image:alt"]',     meta.ogImageAlt ?? meta.title);
  }
  setMeta('meta[name="twitter:title"]',       meta.twitterTitle       ?? meta.ogTitle ?? meta.title);
  setMeta('meta[name="twitter:description"]', meta.twitterDescription ?? meta.ogDescription ?? meta.description);
  if (meta.ogImage) {
    setMeta('meta[name="twitter:image"]',     meta.ogImage);
    setMeta('meta[name="twitter:image:alt"]', meta.ogImageAlt ?? meta.title);
  }
}
