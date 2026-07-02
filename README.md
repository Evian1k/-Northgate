# Northgate Institute of Technology — Production-Ready TVET Platform

A complete, production-ready website + admin CMS for a Technical & Vocational Education and Training (TVET) institution. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma, and Framer Motion.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 + custom design system |
| UI Library | shadcn/ui (New York) + Lucide icons |
| Animations | Framer Motion 12 |
| Database | Prisma ORM + SQLite (swap to PostgreSQL for production) |
| Auth | Custom JWT (jose) + bcryptjs + httpOnly cookies |
| Validation | Zod |
| Theme | Custom ThemeProvider (light/dark) |

## Quick Start

```bash
bun install
bun run db:push      # Create database schema
bun run db:seed      # Seed admin user + sample content
bun run dev          # Start dev server at http://localhost:3000
```

### Default Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@northgate.ac.ke` | `Admin@2026` |
| Editor | `editor@northgate.ac.ke` | `Editor@2026` |

## Routes

### Public
- `/` — Homepage (server-rendered, fetches from DB)
- `/apply` — Public application form (writes to DB, returns reference number)

### Admin (auth-protected)
- `/admin/login` — Liquid Glass login screen
- `/admin` — Dashboard (live stats, trends, recent activity)
- `/admin/departments` — Departments CRUD
- `/admin/programmes` — Programmes CRUD
- `/admin/news` — News articles CRUD
- `/admin/events` — Events CRUD
- `/admin/testimonials` — Testimonials CRUD
- `/admin/gallery` — Gallery images CRUD
- `/admin/partners` — Partners CRUD
- `/admin/applications` — Admission applications (view, status update, delete)
- `/admin/messages` — Contact form submissions
- `/admin/subscribers` — Newsletter subscribers
- `/admin/audit-logs` — System activity log
- `/admin/analytics` — Analytics placeholder (wire up GA/Mixpanel/Plausible)
- `/admin/settings` — Site settings

### API (REST)
All under `/api/*` with proper auth, validation, rate limiting, and audit logging:

- `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/auth/logout`, `POST /api/auth/refresh`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `POST /api/auth/verify-email`
- `GET/POST /api/departments`, `GET/PATCH/DELETE /api/departments/[id]`
- `GET/POST /api/programmes`, `GET/PATCH/DELETE /api/programmes/[id]`
- `GET/POST /api/news`, `GET/PATCH/DELETE /api/news/[id]`
- `GET/POST /api/events`, `GET/PATCH/DELETE /api/events/[id]`
- `GET/POST /api/testimonials`, `GET/PATCH/DELETE /api/testimonials/[id]`
- `GET/POST /api/partners`, `GET/PATCH/DELETE /api/partners/[id]`
- `GET/POST /api/gallery`, `GET/PATCH/DELETE /api/gallery/[id]`
- `GET/POST /api/applications`, `GET/PATCH/DELETE /api/applications/[id]`
- `GET/POST /api/contact`, `GET/PATCH/DELETE /api/contact/[id]`
- `GET/POST /api/newsletter`
- `GET /api/audit-logs`
- `GET /api/stats` (dashboard aggregate metrics)

## Database Schema

13 models with relations, foreign keys, cascading deletes, soft deletes (`deletedAt`), indexes, and audit logging:

- `User` — auth, roles (ADMIN/EDITOR/STUDENT), status, lockout, 2FA-ready
- `RefreshToken`, `PasswordReset`, `EmailVerification` — auth flows
- `AuditLog` — every mutation is logged with user, action, resource, IP, user-agent
- `Department`, `Programme` — academic content (1-to-many)
- `News`, `Event`, `Testimonial`, `Partner`, `GalleryImage` — marketing content
- `Application` — admission applications with reference numbers
- `ContactMessage`, `NewsletterSubscriber` — engagement
- `SiteSetting` — key/value site-wide configuration

## Security

- **Auth**: bcryptjs password hashing (cost 12), JWT access (15m) + refresh (30d) tokens
- **Cookies**: httpOnly, secure in production, sameSite=lax
- **RBAC**: ADMIN and EDITOR roles enforced via middleware + API handlers
- **Rate Limiting**: in-memory limiter on auth, application, contact, newsletter endpoints
- **Account Lockout**: 5 failed login attempts → 15-minute lockout
- **Session Revocation**: refresh tokens tracked in DB, revocable
- **Input Validation**: Zod schemas on every API route
- **Audit Logging**: all mutations logged
- **SQL Injection**: Prisma parameterized queries
- **XSS**: React escapes by default; no `dangerouslySetInnerHTML` on user input
- **CSRF**: sameSite=lax cookies + custom header checks on mutations

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=file:/home/z/my-project/db/custom.db
JWT_ACCESS_SECRET=change-me-to-32+-char-random-string
JWT_REFRESH_SECRET=change-me-to-different-32+-char-random-string
```

For production, also configure:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — for transactional emails
- `GOOGLE_MAPS_API_KEY` — for embedded maps
- `GOOGLE_OAUTH_*`, `MICROSOFT_OAUTH_*` — for SSO
- `MPESA_*`, `STRIPE_*`, `FLUTTERWAVE_*` — for fee payments
- `CLOUDINARY_URL` or `AWS_S3_*` — for media uploads
- `OPENAI_API_KEY` / `GEMINI_API_KEY` — for AI features

## Production Deployment

1. **Database**: Swap `provider` to `postgresql` in `prisma/schema.prisma`, run `bun run db:migrate`
2. **Build**: `bun run build` (outputs standalone to `.next/standalone/`)
3. **Run**: `bun .next/standalone/server.js`
4. **Reverse proxy**: Caddy/Nginx with TLS, gzip, and static asset caching
5. **Process manager**: PM2 or systemd for the Node.js server

## Scripts

```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run lint         # ESLint
bun run db:push      # Push schema to DB
bun run db:generate  # Regenerate Prisma client
bun run db:migrate   # Create migration
bun run db:seed      # Seed sample data
bun run db:reset     # Reset DB (destructive)
```
