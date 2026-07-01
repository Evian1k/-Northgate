# Northgate — Stack Migration & Cleanup

---
Task ID: stack-migration
Agent: main
Task: Remove all z.ai content, add missing frontend libraries, restructure for Laravel backend, ensure mobile usability

Work Log:

## 1. Removed ALL z.ai content/branding
- Removed `z-ai-web-dev-sdk` dependency from package.json (was unused in project code)
- Removed z.ai dev origins from next.config.ts (replaced with Vercel origins)
- Deleted /public/logo.svg (old z.ai logo asset)
- Verified: zero z.ai references remain in src/, prisma/, public/, config files
- (Note: /skills/ directory contains framework skill files with z.ai references — these are NOT part of our project, they're the AI assistant's tool files)

## 2. Installed missing frontend libraries (per mandatory stack)
- @tanstack/react-query — server state management
- zustand — client state management
- recharts — charting library
- react-hook-form + @hookform/resolvers — form handling (Zod already present)
- All are now available and integrated

## 3. Created backend-agnostic API client layer
- src/lib/api-client.ts: centralized fetch client that auto-detects NEXT_PUBLIC_API_URL
  • If env var is set → talks to Laravel backend (Bearer token auth, absolute URLs)
  • If env var is empty → talks to built-in Next.js API routes (cookie auth, relative URLs)
  • Handles 401 redirects, error unwrapping, token management
  • Exports queryClientDefaults for TanStack Query
- src/components/QueryProvider.tsx: TanStack Query provider wrapper
- Wired QueryProvider into root layout (wraps entire app)
- src/lib/stores/ui-store.ts: Zustand store for global UI state (sidebar collapse, command palette, mobile drawer)

## 4. Mobile responsiveness audit (ALL pages verified on iPhone 14 viewport)
- Homepage: hamburger nav, stacked stat cards (2/row), stacked quick actions ✓
- Student login: stacked layout, demo buttons accessible ✓
- Student dashboard: collapsed sidebar + hamburger, stacked stat cards, charts visible, no overflow ✓
- Admin dashboard: collapsed sidebar, stacked stat cards, no overflow ✓
- Apply form: full-width stacked fields, accessible dropdown ✓
- Fees page: table has horizontal scroll (overflow-x-auto) — acceptable for wide data tables ✓

## 5. Created comprehensive Laravel 12 backend specification
- docs/LARAVEL_BACKEND_SPEC.md (600+ lines)
- Complete project structure (Controllers, Models, Services, Repositories, Events, Jobs, Notifications)
- All API routes (routes/api.php) — mirrors the existing Next.js API contract 1:1
- Key migration examples (UUID primary keys, PostgreSQL, foreign keys, indexes)
- Sanctum configuration for SPA token auth
- Redis configuration (cache, queue, sessions — separate databases)
- File storage config (local dev, S3 + Cloudinary production)
- Repository pattern + Service layer code examples
- Complete .env.example for Laravel backend
- Setup commands (composer install, migrate, seed, serve, queue work)
- Frontend connection instructions (just set NEXT_PUBLIC_API_URL)

## 6. Updated .env.example
- Added NEXT_PUBLIC_API_URL documentation
- Added Cloudinary fields (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
- Added AWS S3 fields (AWS_ACCESS_KEY_ID, SECRET_ACCESS_KEY, DEFAULT_REGION, BUCKET)
- Clarified that built-in DB is for dev only; production uses Laravel + PostgreSQL

Stage Summary:
- Lint: clean
- All routes return 200 (homepage, student login, admin login, student dashboard, admin dashboard)
- One-click demo login verified working after changes
- Zero z.ai references in project code
- All mandatory frontend libraries installed and integrated
- API client is backend-agnostic (works with Next.js routes now, Laravel backend when deployed)
- Mobile responsive on all pages (verified iPhone 14)
- Laravel backend spec is comprehensive enough for a developer to implement
