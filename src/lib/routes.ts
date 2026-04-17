// Central route constants — single source of truth for all app routes.
// When adding or renaming routes, change them here only.
// Do not hardcode route strings elsewhere; import from this file.

export const ROUTES = {
  // ── Public marketing pages ──────────────────────────────────────────
  HOME:               '/',
  ABOUT:              '/about',
  CONTACT:            '/contact',
  PRESS:              '/press',
  MEDIA:              '/media',
  SHOP:               '/shop',
  GET_STARTED:        '/get-started',
  START_HERE:         '/start-here',
  THANK_YOU:          '/thank-you',

  // ── Platform / product pages ─────────────────────────────────────────
  PLATFORM:           '/platform',
  AI_TOOLS:           '/ai-tools',
  ROCKSTEADY:         '/rocksteady',
  DISCOVERY:          '/discovery',
  CATALOG:            '/catalog',
  CATALOG_PARTNERSHIPS: '/catalog-partnerships',
  CATALOG_OS_PUBLIC:  '/catalog-os',
  INDUSTRY_OS:        '/industry-os',
  OPERATIONS:         '/operations',
  MERCH:              '/merch',
  ARTIST_GROWTH:      '/artist-growth',
  AI_MARKETING_TOOLS: '/ai-music-marketing-tools',

  // ── Login / auth entry points ────────────────────────────────────────
  LOGIN_ROCKSTEADY:   '/login/rocksteady',
  LOGIN_ARTIST_OS:    '/login/artist-os',
  LOGIN_CATALOG_OS:   '/catalog-os/login',   // canonical login URL shown in public nav
  LOGIN_CATALOG_ALT:  '/catalog/login',       // alternate (used by protected route redirect)
  LOGIN_INDUSTRY_OS:  '/login/industry-os',

  // ── Catalog OS app (protected) ───────────────────────────────────────
  CATALOG_APP:        '/catalog/app',
  CATALOG_APP_VALUE:  '/catalog/app/value',
  CATALOG_APP_ASSETS: '/catalog/app/assets',
  CATALOG_APP_REVENUE:'/catalog/app/revenue',
  CATALOG_APP_TASKS:  '/catalog/app/tasks',

  // ── Artist OS dashboard (protected) ──────────────────────────────────
  ARTIST_OS:          '/dashboard/artist-os',
  ARTIST_OS_ROSTER:   '/dashboard/artist-os/roster',
  ARTIST_OS_RELEASES: '/dashboard/artist-os/releases',
  ARTIST_OS_CAMPAIGNS:'/dashboard/artist-os/campaigns',
  ARTIST_OS_REVENUE:  '/dashboard/artist-os/revenue',
  ARTIST_OS_REQUESTS: '/dashboard/artist-os/requests',
  ARTIST_OS_SETTINGS: '/dashboard/artist-os/settings',
  ARTIST_OS_UPDATES:  '/dashboard/artist-os/updates',

  // ── Internal / Rocksteady dashboard (protected) ──────────────────────
  DASHBOARD:          '/dashboard',
  ROCKSTEADY_DASH:    '/dashboard/rocksteady',
  ADMIN_OS:           '/dashboard/admin-os',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
