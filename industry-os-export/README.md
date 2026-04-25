# Industry OS — Export Package

Self-contained export of the Industry OS marketing/landing page from the Greater Music Group project.
Drop the files below into a Vite + React + TypeScript + Tailwind project and the page will work as-is.

---

## Files Included

```
industry-os-export/
├── src/
│   ├── pages/
│   │   └── IndustryOS.tsx          ← The page itself
│   ├── components/
│   │   ├── GMGMotif.tsx            ← Animated signal-network canvas background
│   │   ├── GlobeVisual.tsx         ← Wireframe globe with Gallagher plaque
│   │   └── RevealSection.tsx       ← Scroll-reveal wrapper + child components
│   ├── hooks/
│   │   ├── useReveal.ts            ← IntersectionObserver reveal hook
│   │   ├── useMagneticCard.ts      ← Magnetic card tilt hook
│   │   ├── useScrollDepth.ts       ← Scroll depth analytics hook
│   │   └── usePageMeta.ts          ← Per-page <head> metadata hook
│   ├── auth/
│   │   └── IndustryOSContext.tsx   ← Auth context (login/signup/logout)
│   ├── lib/
│   │   ├── analytics.ts            ← Analytics event layer
│   │   ├── routes.ts               ← Route constants
│   │   └── supabase.ts             ← Supabase client singleton
│   └── industry-os.css             ← All custom CSS classes the page needs
├── public/
│   └── assets/
│       └── gallagher-logo.svg      ← Gallagher logo (referenced by GlobeVisual)
└── supabase/
    └── industry_os_members.sql     ← Database migration (run once)
```

---

## Where to Place Files in the Destination Project

| Export path | Destination path |
|---|---|
| `src/pages/IndustryOS.tsx` | `src/pages/IndustryOS.tsx` |
| `src/components/GMGMotif.tsx` | `src/components/GMGMotif.tsx` |
| `src/components/GlobeVisual.tsx` | `src/components/GlobeVisual.tsx` |
| `src/components/RevealSection.tsx` | `src/components/RevealSection.tsx` |
| `src/hooks/useReveal.ts` | `src/hooks/useReveal.ts` |
| `src/hooks/useMagneticCard.ts` | `src/hooks/useMagneticCard.ts` |
| `src/hooks/useScrollDepth.ts` | `src/hooks/useScrollDepth.ts` |
| `src/hooks/usePageMeta.ts` | `src/hooks/usePageMeta.ts` |
| `src/auth/IndustryOSContext.tsx` | `src/auth/IndustryOSContext.tsx` |
| `src/lib/analytics.ts` | `src/lib/analytics.ts` |
| `src/lib/routes.ts` | `src/lib/routes.ts` |
| `src/lib/supabase.ts` | `src/lib/supabase.ts` |
| `public/assets/gallagher-logo.svg` | `public/gallagher-logo.svg` ← must be at root of public |

> **Note on `routes.ts`:** This file contains every route in the original project.
> If the destination project already has a routes file, merge only the Industry OS
> routes into it:
> ```ts
> INDUSTRY_OS:         '/industry-os',
> INDUSTRY_OS_APP:     '/industry-os/app',
> INDUSTRY_OS_SIGNUP:  '/industry-os/signup',
> LOGIN_INDUSTRY_OS:   '/login/industry-os',
> LOGIN_INDUSTRY_ALT:  '/industry-os/login',
> ```
> Then update the imports in `IndustryOS.tsx` and `IndustryOSContext.tsx` to point
> at your existing routes file.

---

## Required npm Packages

Install these if not already present:

```bash
npm install react react-dom react-router-dom lucide-react @supabase/supabase-js
```

| Package | Version used | Purpose |
|---|---|---|
| `react` | ^18 | Core |
| `react-dom` | ^18 | Core |
| `react-router-dom` | ^7 | `<Link>`, routing |
| `lucide-react` | ^0.344 | Icons throughout the page |
| `@supabase/supabase-js` | ^2 | Auth + member database |

No other runtime dependencies.

---

## Required Tailwind / Config Changes

### 1. Tailwind content paths
Ensure your `tailwind.config.js` includes `src/**/*.{ts,tsx}`:
```js
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
```

### 2. Custom colors (optional)
The page uses only inline RGBA values — no custom Tailwind color tokens are required.
The only Tailwind class using a custom token is `bg-gmg-charcoal` on the root `<div>`.
Either add it to your config:
```js
theme: { extend: { colors: { 'gmg-charcoal': '#0B0B0D' } } }
```
Or replace it in `IndustryOS.tsx` with `bg-[#0B0B0D]`.

### 3. CSS classes
Add the contents of `src/industry-os.css` to your global CSS file (e.g. `index.css`).
Place it **after** the Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* paste industry-os.css contents here */
```

### 4. Fonts
Add these imports to the **top** of your global CSS (before the Tailwind directives):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@700,500,900&display=swap');
```
And set the base font in your body:
```css
body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
h1,h2,h3,h4,h5,h6 { font-family: 'Satoshi', sans-serif; font-weight: 700; }
```

---

## Environment Variables

Create a `.env` file in the project root (never commit this):
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Database Setup

Run the migration once against your Supabase project.

**Option A — Supabase Dashboard SQL editor:**
1. Open your Supabase project → SQL Editor
2. Paste the contents of `supabase/industry_os_members.sql`
3. Run

**Option B — Supabase CLI:**
```bash
supabase db push   # if using local dev flow
# or copy the file into supabase/migrations/ and push
```

The migration is idempotent — safe to run multiple times.

---

## How to Route It to /industry-os

### 1. Wrap your app with `IndustryOSProvider`

In your root component (e.g. `App.tsx` or `main.tsx`):
```tsx
import { IndustryOSProvider } from './auth/IndustryOSContext';

function App() {
  return (
    <IndustryOSProvider>
      {/* your router / routes */}
    </IndustryOSProvider>
  );
}
```

### 2. Add the route

Using React Router v6/v7:
```tsx
import IndustryOS from './pages/IndustryOS';

// Inside your <Routes>:
<Route path="/industry-os" element={<IndustryOS />} />
```

### 3. Add login/signup routes (optional but needed for CTAs)

The page's primary CTA links to `/industry-os/signup` and the Log In button links
to `/industry-os/login`. Wire those routes or update the `ROUTES` constants to
match your destination project's existing auth routes.

---

## How to Verify It Works

1. **Build passes** — `npm run build` exits with no errors
2. **Page renders** — navigate to `http://localhost:5173/industry-os`
3. **Hero animation** — hero text fades in sequentially on load
4. **Scroll reveals** — sections fade up as you scroll down
5. **Globe renders** — wireframe globe visible in the GIG section right column
6. **Gallagher logo** — logo appears in the globe plaque (check browser Network tab
   for `/gallagher-logo.svg` 200 response)
7. **CTA navigation** — "Become a Member" routes to `/industry-os/signup`
8. **Console analytics** — open DevTools → Console, scroll the page and click CTAs;
   you should see `[analytics] page_viewed`, `scroll_depth_reached`, `cta_clicked`
   etc. logged (these are dev-mode only; wire a provider for production)
9. **No Supabase errors** — Console should show no 400/401 errors on load

---

## Bolt Import Steps

This package was exported from a Bolt.new project. To import into another Bolt project:

1. **Commit to GitHub** (see below)
2. In Bolt, open your destination project
3. Use "Connect to GitHub" and pull in the branch, or manually copy file contents
   from the GitHub raw view into Bolt's file editor
4. Follow the steps above (npm install, env vars, CSS, route wiring)

---

## GitHub Commit Steps

From your local machine after downloading this export folder:

```bash
# 1. Clone or navigate to your destination repo
git clone https://github.com/your-org/your-repo.git
cd your-repo

# 2. Create a feature branch
git checkout -b feature/industry-os-page

# 3. Copy export files into the repo structure
#    (match the destination paths in the table above)
cp -r industry-os-export/src/* src/
cp industry-os-export/public/assets/gallagher-logo.svg public/gallagher-logo.svg
cp industry-os-export/supabase/industry_os_members.sql supabase/migrations/

# 4. Merge CSS into your global CSS file
#    (append contents of industry-os-export/src/industry-os.css to your src/index.css)

# 5. Stage and commit
git add .
git commit -m "feat: add Industry OS page with auth, analytics, and Gallagher integration"

# 6. Push
git push origin feature/industry-os-page

# 7. Open a PR and merge
```

---

## What This Page Does NOT Depend On

- No Bolt-specific runtime APIs
- No hidden global state from other pages
- No shared auth context (IndustryOSContext is fully self-contained)
- No other dashboard or internal pages
- No external image CDN (all visuals are canvas or inline SVG, except the one
  Gallagher logo SVG which is included in this package)
