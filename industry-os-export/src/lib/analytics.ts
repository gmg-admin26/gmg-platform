// ─── Analytics event layer ────────────────────────────────────────────────────
//
// All events flow through `track()`. Call sites use typed helper functions
// instead of raw strings so event names and properties stay consistent.
//
// Provider integration: assign `window.analytics.track` (Segment-compatible)
// or `window.gtag` before this module loads and events will forward
// automatically. Until then they are logged in development only.
//
// Event name convention: "<object>_<verb>" in snake_case.

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, string | number | boolean>;
}

// ── Core dispatcher ───────────────────────────────────────────────────────────

function track(event: string, properties: Record<string, string | number | boolean> = {}) {
  const payload: AnalyticsEvent = { event, properties: { ...properties, timestamp: Date.now() } };

  if (import.meta.env.DEV) {
    console.debug('[analytics]', payload.event, payload.properties);
  }

  // Segment / Analytics.js compatible
  if (typeof window !== 'undefined' && typeof (window as any).analytics?.track === 'function') {
    (window as any).analytics.track(event, properties);
    return;
  }

  // Google Analytics 4 (gtag)
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, properties);
    return;
  }

  // PostHog
  if (typeof window !== 'undefined' && typeof (window as any).posthog?.capture === 'function') {
    (window as any).posthog.capture(event, properties);
  }
}

// ── Page events ───────────────────────────────────────────────────────────────

export const Analytics = {
  // Fired once when the page mounts
  pageView(page: string) {
    track('page_viewed', { page });
  },

  // ── CTA clicks ──────────────────────────────────────────────────────────────

  ctaClicked(label: string, destination: string) {
    track('cta_clicked', { label, destination });
  },

  // ── Scroll depth ────────────────────────────────────────────────────────────

  scrollDepth(page: string, percent: 25 | 50 | 75 | 100) {
    track('scroll_depth_reached', { page, percent });
  },

  // ── Card interactions ────────────────────────────────────────────────────────

  cardViewed(card_type: 'tool' | 'role' | 'ai_coworker', card_name: string) {
    track('card_viewed', { card_type, card_name });
  },

  cardClicked(card_type: 'tool' | 'role' | 'ai_coworker', card_name: string) {
    track('card_clicked', { card_type, card_name });
  },

  // ── Section engagement ───────────────────────────────────────────────────────

  sectionEngaged(section: string) {
    track('section_engaged', { section });
  },
} as const;
