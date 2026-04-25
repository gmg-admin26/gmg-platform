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
  PLATFORM:              '/platform',
  AI_TOOLS:              '/ai-tools',
  ROCKSTEADY:            '/rocksteady',
  DISCOVERY:             '/discovery',
  CATALOG:               '/catalog',
  CATALOG_PARTNERSHIPS:  '/catalog-partnerships',
  CATALOG_OS_PUBLIC:     '/catalog-os',
  INDUSTRY_OS:           '/industry-os',
  OPERATIONS:            '/operations',
  MERCH:                 '/merch',
  ARTIST_GROWTH:         '/artist-growth',
  AI_MARKETING_TOOLS:    '/ai-music-marketing-tools',

  // ── Login / auth entry points ────────────────────────────────────────
  LOGIN:              '/login',
  LOGIN_ROCKSTEADY:   '/login/rocksteady',
  LOGIN_ARTIST_OS:    '/login/artist-os',
  LOGIN_CATALOG_OS:   '/catalog-os/login',   // canonical login URL shown in public nav
  LOGIN_CATALOG_ALT:  '/catalog/login',       // alternate (used by protected route redirect)
  LOGIN_INDUSTRY_OS:  '/login/industry-os',
  LOGIN_INDUSTRY_ALT: '/industry-os/login',

  // ── Industry OS ──────────────────────────────────────────────────────
  INDUSTRY_OS_APP:         '/industry-os/app',
  INDUSTRY_OS_NETWORK:     '/industry-os/app/network',
  INDUSTRY_OS_AI:          '/industry-os/app/ai-coworkers',
  INDUSTRY_OS_PROJECT:     '/industry-os/app/project',
  INDUSTRY_OS_BOUTIQUE:    '/industry-os/app/boutique',
  INDUSTRY_OS_PROFILE:     '/industry-os/app/profile',
  INDUSTRY_OS_SIGNUP:      '/industry-os/signup',

  // ── Project OS ───────────────────────────────────────────────────────
  PROJECT_OS:         '/project-os',

  // ── System Hub (admin-only internal entry point) ─────────────────────
  SYSTEM_HUB:         '/system-hub',

  // ── Catalog OS app (protected) ───────────────────────────────────────
  CATALOG_APP:        '/catalog/app',
  CATALOG_APP_VALUE:  '/catalog/app/value',
  CATALOG_APP_ASSETS: '/catalog/app/assets',
  CATALOG_APP_REVENUE:'/catalog/app/revenue',
  CATALOG_APP_TASKS:  '/catalog/app/tasks',

  // ── Artist OS dashboard (protected) ──────────────────────────────────
  ARTIST_OS:              '/dashboard/artist-os',
  ARTIST_OS_ROSTER:       '/dashboard/artist-os/roster',
  ARTIST_OS_RELEASES:     '/dashboard/artist-os/releases',
  ARTIST_OS_CAMPAIGNS:    '/dashboard/artist-os/campaigns',
  ARTIST_OS_REVENUE:      '/dashboard/artist-os/revenue',
  ARTIST_OS_REQUESTS:     '/dashboard/artist-os/requests',
  ARTIST_OS_SETTINGS:     '/dashboard/artist-os/settings',
  ARTIST_OS_UPDATES:      '/dashboard/artist-os/updates',
  ARTIST_OS_AUDIENCE:     '/dashboard/artist-os/audience',
  ARTIST_OS_SPENDING:     '/dashboard/artist-os/spending',
  ARTIST_OS_RECOUPMENT:   '/dashboard/artist-os/recoupment',
  ARTIST_OS_TEAM:         '/dashboard/artist-os/team',
  ARTIST_OS_DATA_QUALITY: '/dashboard/artist-os/data-quality',
  ARTIST_OS_READINESS:    '/dashboard/artist-os/roster-readiness',
  ARTIST_OS_ENRICHMENT:   '/dashboard/artist-os/data-enrichment',
  ARTIST_OS_FAN_OS:       '/dashboard/artist-os/fan-os',
  ARTIST_OS_CAMPAIGN_CTR: '/dashboard/artist-os/campaign-center',
  ARTIST_OS_PENDING:      '/dashboard/artist-os/pending-updates',
  ARTIST_OS_DROPPED:      '/dashboard/artist-os/dropped-queue',
  ARTIST_OS_LABELS:       '/dashboard/artist-os/labels',
  ARTIST_OS_ARTISTS:      '/dashboard/artist-os/artists',

  // ── Internal / Rocksteady dashboard (protected) ──────────────────────
  DASHBOARD:              '/dashboard',
  ROCKSTEADY_DASH:        '/dashboard/rocksteady',
  ROCKSTEADY_SCOUTS:      '/dashboard/rocksteady/scouts',
  ROCKSTEADY_HEATMAPS:    '/dashboard/rocksteady/heatmaps',
  ROCKSTEADY_PIPELINE:    '/dashboard/rocksteady/pipeline',
  ROCKSTEADY_SIGNINGS:    '/dashboard/rocksteady/signings',
  ROCKSTEADY_REPORTS:     '/dashboard/rocksteady/reports',
  ROCKSTEADY_ALERTS:      '/dashboard/rocksteady/alerts',

  // ── Admin OS (internal protected) ────────────────────────────────────
  ADMIN_OS:               '/dashboard/admin-os',
  ADMIN_OS_PROJECTS:      '/dashboard/admin-os/projects',
  ADMIN_OS_SAFES:         '/dashboard/admin-os/projects/safes',
  ADMIN_OS_LEGAL:         '/dashboard/admin-os/legal',
  ADMIN_OS_FINANCE:       '/dashboard/admin-os/finance',
  ADMIN_OS_AGENTS:        '/dashboard/admin-os/agents',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
