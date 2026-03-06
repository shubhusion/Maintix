# Competition Audit — Prime Challenges: PropTech Full-Stack Challenge

> **Prize:** $1,500 | **Duration:** 25 weeks  
> **Requirement:** Mobile-First mini property maintenance management system  
> **Date:** June 2025

---

## Executive Summary

Maintix is a **strong submission** with a well-architected monorepo, a sophisticated ticket state machine, event-driven notifications, optimistic concurrency control, and a polished landing page. The project already covers ~80% of what judges are looking for.

However, several **critical gaps** could cost the win: zero tests, missing authorization on some endpoints, no registration flow, no email notifications, the `RequestIdMiddleware` is never applied, and some dashboard pages have fixed-width elements that break on mobile. This document maps every judging criterion to the current state and gives concrete fixes prioritized by competition impact.

---

## Scoring Matrix — Current vs Target

| #                        | Judging Criterion          | Current Score | Target                                                              | Key Gap                                                                   |
| ------------------------ | -------------------------- | ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1                        | Backend Architecture       | **8/10**      | 9.5                                                                 | Missing middleware registration, no logging, no pagination on users       |
| 2                        | Database Design            | **9/10**      | 9.5                                                                 | Minor: no `updatedBy` audit, no DB-level CHECK constraints                |
| 3                        | Auth + Role Management     | **8/10**      | 9.5                                                                 | Missing auth guards on category update/delete, ticket detail, attachments |
| 4                        | File Uploads               | **8.5/10**    | 9.5                                                                 | No thumbnail generation, no attachment preview on frontend                |
| 5                        | Workflow Logic             | **9.5/10**    | 10                                                                  | Nearly perfect — state machine + optimistic locking + audit trail         |
| 6                        | Clean UI/UX                | **7/10**      | 9                                                                   | Dashboard pages are basic; landing page is 9/10                           |
| 7                        | Code Quality & Structure   | **8/10**      | 9.5                                                                 | Zero tests, no CI lint/test step, some code duplication                   |
| 8                        | Deployment & Documentation | **8.5/10**    | 9.5                                                                 | Both Dockerfiles ready, GCP CI/CD exists, docs are thorough               |
| **Bonus: Tests**         | **0/10**                   | 8             | **No test files exist anywhere**                                    |
| **Bonus: Docker**        | **8/10**                   | 9.5           | Multi-stage Dockerfiles ✓, but no `docker-compose.prod.yml`         |
| **Bonus: Thoughtful UX** | **7/10**                   | 9             | No empty states, no skeleton loaders, no command palette            |
| **Bonus: Edge Cases**    | **8/10**                   | 9.5           | Optimistic locking ✓, but missing concurrent deletion handling      |
| **Mobile-First**         | **8/10**                   | 9.5           | Foundation strong; few fixed-width elements break on narrow screens |

**Overall: ~78/100 → Target: 94/100**

---

## 1. Backend Architecture (Current: 8/10)

### What's Strong

- Clean NestJS module structure with 8 feature modules + common layer
- Global request pipeline: ThrottlerGuard → JwtAuthGuard → RolesGuard → ValidationPipe → TransformInterceptor → HttpExceptionFilter
- Event-driven notification bus (`@nestjs/event-emitter`) with 8 event listeners
- `BusinessException` with typed `ErrorCode` enum (50+ codes)
- Standardized response envelope `{ data, meta }` via `TransformInterceptor`
- `PropertyGuard` for scoped authorization
- Cursor-based pagination with `hasMore`/`nextCursor`

### What Needs Fixing

#### P0 — Critical (Judges will notice)

| #   | Issue                                                                                                                                          | Impact                                                                             | Fix                                                                         |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1.1 | **`RequestIdMiddleware` is defined but never registered** — it's in `common/middleware/` but no module calls `configure(consumer)` to apply it | Request IDs won't appear in responses despite being referenced in the error filter | Register it in `AppModule.configure()` for all routes                       |
| 1.2 | **No structured logging** — `console.log/error` usage, no correlation with request IDs                                                         | Judges expect production-grade observability                                       | Add `@nestjs/common Logger` or `pino`/`winston` with request-scoped context |
| 1.3 | **Users endpoint lacks pagination** — `GET /users` returns all users with no cursor/limit                                                      | Inconsistent with tickets' cursor pagination; doesn't scale                        | Add `TicketQueryDto`-style pagination to users                              |
| 1.4 | **No `GET /users/me` update endpoint** — users can't change their own name/password                                                            | Unrealistic — every SaaS app has profile editing                                   | Add `PATCH /users/me` with UpdateProfileDto                                 |

#### P1 — Important

| #   | Issue                                                                                          | Fix                                                                                  |
| --- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 1.5 | No health check for Supabase Storage connectivity                                              | Extend `/health` to ping Supabase bucket                                             |
| 1.6 | Swagger doesn't document error responses (`@ApiResponse` decorators missing on most endpoints) | Add `@ApiResponse({ status: 400, description })` to all controllers                  |
| 1.7 | No API versioning strategy beyond URL prefix                                                   | Current `/api/v1` is fine, but document the versioning strategy in architecture docs |

---

## 2. Database Design (Current: 9/10)

### What's Strong

- 8 models with proper UUID primary keys
- Composite unique constraints (`PropertyMember[propertyId, userId]`, `Category[propertyId, name]`)
- Strategic indexes on high-query columns (`Ticket[propertyId, status]`, `Ticket[assignedToId, status]`, `Notification[userId, isRead, createdAt]`)
- Soft deletes across all domain models
- Optimistic locking via `version` field on `Ticket`
- Immutable audit trail (`TicketActivity`) with JSON `previousValue`/`newValue`
- Schema uses `@map` for snake_case DB columns / camelCase TypeScript

### What Could Improve

| #   | Issue                                                                        | Impact                                                   | Fix                                                                                                              |
| --- | ---------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2.1 | No `updatedBy` field on `Ticket`                                             | Can't show "last modified by" in UI                      | Add `updatedById String?` + relation to User                                                                     |
| 2.2 | Seed data is minimal (1 property, 3 users, 0 tickets)                        | Judges see a sparse demo                                 | Expand seed to create 2-3 properties, 5-8 users, 15-20 tickets across all statuses with attachments and activity |
| 2.3 | No database-level `CHECK` constraints (e.g., `fileSize > 0`, `version >= 0`) | Prisma doesn't support CHECK natively                    | Add via raw SQL migration for extra credit                                                                       |
| 2.4 | No `@updatedAt` on `PropertyMember`                                          | Minor — join table doesn't track when membership changed | Add if time permits                                                                                              |

---

## 3. Auth + Role Management (Current: 8/10)

### What's Strong

- Global `JwtAuthGuard` + `RolesGuard` via `APP_GUARD`
- `@Public()` decorator to bypass auth
- `@Roles(Role.MANAGER)` granular per-endpoint
- `@CurrentUser()` param decorator extracting JWT payload
- JWT strategy validates user existence, `isActive`, and `deletedAt` on every request
- Login rate-limited to 5 req/min
- `PropertyGuard` validates membership per-property

### What Needs Fixing

#### P0 — Critical Security Gaps

| #   | Issue                                                                                                                                                         | Impact                                                                                 | Fix                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 3.1 | **`PATCH /categories/:id` and `DELETE /categories/:id` skip PropertyGuard** — any manager can modify any property's categories if they know the category UUID | **Authorization bypass** — a manager of Property A can delete categories on Property B | Add PropertyGuard or validate ownership in the service layer |
| 3.2 | **`GET /tickets/:id` has no PropertyGuard** — any authenticated user can read any ticket by UUID                                                              | **Data leak** — tenant from Property A can read tickets on Property B                  | Add ownership/membership check in service                    |
| 3.3 | **`GET /tickets/:ticketId/attachments` has no scoped guard** — same as above for attachments                                                                  | **Data leak**                                                                          | Validate ticket ownership before returning attachments       |
| 3.4 | **`DELETE /attachments/:id`** — only checks uploader, not property membership                                                                                 | Minor — uploader must be authenticated, but no property scoping                        | Add property membership check                                |

#### P1 — Missing Features

| #   | Issue                                                                                 | Fix                                                                                                                                     |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 3.5 | **No registration flow** — only login exists; users are created by managers           | For a real product this is correct, but add a `/auth/register` for the initial manager account (first-run setup) or document it clearly |
| 3.6 | **No password change endpoint**                                                       | Add `PATCH /auth/change-password` with oldPassword verification                                                                         |
| 3.7 | **No token refresh** — JWT has fixed expiration, no refresh token                     | Add refresh token rotation or clearly document the 24h expiration in README                                                             |
| 3.8 | **No logout/token blacklist** — JWT is stateless so tokens are valid until expiration | Document this or add a simple Redis/DB token blacklist                                                                                  |

---

## 4. File Uploads (Current: 8.5/10)

### What's Strong

- Supabase Storage integration with service key
- MIME type validation (jpeg, png, webp only)
- 5 MB size limit
- 5 attachments per ticket maximum
- Deterministic storage paths: `{propertyId}/{ticketId}/{uuid}-{originalName}`
- Only uploader can delete their own files
- Database records track `fileName`, `fileSize`, `mimeType`

### What Could Improve

| #   | Issue                                                                                                | Fix                                                                                                   |
| --- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4.1 | **No image preview/thumbnail on frontend**                                                           | Frontend should display attachment thumbnails; Supabase supports image transformations via URL params |
| 4.2 | **No image optimization** (resizing, compression)                                                    | Use Supabase image transform or Sharp in a post-upload step                                           |
| 4.3 | **PDF support missing** — competition mentions "maintenance" which often involves inspection reports | Add `application/pdf` to allowed MIME types                                                           |
| 4.4 | **No drag-and-drop upload UX** on the ticket detail page                                             | Add a dropzone component with preview                                                                 |
| 4.5 | Frontend upload progress indicator missing                                                           | Use `XMLHttpRequest` or `fetch` streams to show upload progress                                       |

---

## 5. Workflow Logic (Current: 9.5/10)

### What's Strong — This Is the Crown Jewel

- **Explicit state machine** (`TicketStateMachine`) with defined transition matrix
- **6 states:** OPEN → ASSIGNED → IN_PROGRESS → AWAITING_APPROVAL → DONE / CANCELLED
- **Optimistic locking** — every transition requires `version` to prevent concurrent edit conflicts
- **10 distinct activity actions** tracked in immutable audit log
- **Event-driven architecture** — mutations emit typed events consumed by notification listeners
- **Role-gated transitions:** Only technicians can start/complete; only managers can assign/approve
- **Reassignment** resets status to ASSIGNED — realistic and well-thought-out
- **Cancellation restrictions** — only ticket creator, only from OPEN/ASSIGNED states
- **Cursor-based pagination** on activity log

### Minor Improvements

| #   | Issue                                                                                           | Fix                                                                      |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 5.1 | No **re-open** transition (DONE → OPEN for reopening resolved tickets)                          | Add REOPEN action: DONE → OPEN if manager decides work is unsatisfactory |
| 5.2 | No **SLA tracking** — no due date or escalation                                                 | Add optional `dueDate` field to ticket; highlight overdue tickets in UI  |
| 5.3 | Cancellation from IN_PROGRESS is blocked — what if a tenant realizes the issue resolved itself? | Consider allowing CANCELLED from IN_PROGRESS with manager confirmation   |
| 5.4 | No **comments/notes** on tickets — only status transitions are tracked                          | Add a `TicketComment` model for threaded discussions                     |

---

## 6. Clean UI/UX (Current: 7/10)

### What's Strong

- **Landing page (9/10):** Premium — Framer Motion animations, glassmorphism, gradient borders, noise textures, 8 sections with responsive design
- **Login page (8.5/10):** Split panel, mobile-optimized, animated gradient
- **Design system:** Consistent color palette (indigo/violet), DM Sans typography, dark/light mode, shadcn/ui components
- **Dashboard sidebar:** Collapsible with hamburger menu, overlay on mobile, keyboard accessible (Escape to close)

### What Needs Fixing — Dashboard Quality Gap

The landing page is competition-winning quality, but dashboard pages feel like scaffolding in comparison.

#### P0 — Judges Will See These Immediately

| #   | Issue                                                                                                 | File(s)                  | Fix                                                                                 |
| --- | ----------------------------------------------------------------------------------------------------- | ------------------------ | ----------------------------------------------------------------------------------- |
| 6.1 | **No dashboard charts** — no visual representation of ticket pipeline, status distribution, or trends | `dashboard/page.tsx`     | Add a stacked/donut chart for ticket status distribution using Recharts or Chart.js |
| 6.2 | **No empty states** — pages show nothing when there's no data (no illustration, no CTA)               | All dashboard pages      | Add empty state illustrations with action CTAs ("Create your first ticket")         |
| 6.3 | **No skeleton loaders** — content just pops in when loaded                                            | All dashboard pages      | Add Skeleton components from shadcn/ui during loading states                        |
| 6.4 | **No breadcrumbs on mobile** — breadcrumbs are `hidden sm:block` but mobile shows just a page title   | `dashboard-layout.tsx`   | Show a simplified breadcrumb or "Back" link on mobile                               |
| 6.5 | **Ticket filter selects have fixed widths** (`w-[200px]`, `w-[160px]`) that overflow on mobile        | `tickets/page.tsx`       | Change to `w-full sm:w-[200px]`                                                     |
| 6.6 | **Notification filter has fixed width** (`w-[200px]`)                                                 | `notifications/page.tsx` | Change to `w-full sm:w-[200px]`                                                     |

#### P1 — Polish That Differentiates Winners

| #    | Issue                                                                                                                     | Fix                                                                                              |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 6.7  | **No toast notifications** — hook exists but is it wired to mutations? Verify success/error toasts on all CRUD operations | Wire `useToast` to every mutation's `onSuccess`/`onError` in React Query hooks                   |
| 6.8  | **No collapsible sidebar** — sidebar is always full-width on desktop, can't be minimized to icon-only                     | Add icon-only collapsed mode on desktop                                                          |
| 6.9  | **No command palette** (Cmd+K)                                                                                            | Add using `cmdk` package (already popular with shadcn) — search tickets, navigate, quick actions |
| 6.10 | **No data table** with sorting/filtering for tickets                                                                      | Replace card list with shadcn DataTable for the tickets list (keep cards for mobile)             |
| 6.11 | **No optimistic UI updates** — mutations wait for server response before updating UI                                      | Add optimistic updates to React Query mutations (e.g., ticket status change)                     |
| 6.12 | **Create User dialog** uses `grid-cols-2` without mobile breakpoint (forms cramped on mobile)                             | Change `grid-cols-2` → `grid-cols-1 sm:grid-cols-2` in `users/page.tsx`                          |
| 6.13 | **No confirmation dialogs** for destructive actions (delete property, remove member)                                      | Add `AlertDialog` from shadcn/ui before delete operations                                        |
| 6.14 | **No image preview** in ticket detail for uploaded attachments                                                            | Display thumbnail gallery using Supabase image URLs                                              |
| 6.15 | **No relative timestamps** ("5 minutes ago") — dates shown as formatted strings                                           | Use `date-fns` `formatDistanceToNow()` or `timeago.js`                                           |
| 6.16 | **Page headers don't wrap** — `flex items-center justify-between` pushes CTA button off-screen on narrow devices          | Add `flex-wrap gap-2` or `flex-col sm:flex-row`                                                  |

---

## 7. Code Quality & Structure (Current: 8/10)

### What's Strong

- **Monorepo:** Clean Turborepo + pnpm workspace with shared packages
- **Shared types:** Enums, error codes, constants shared between frontend and backend
- **DTOs:** 27 DTOs with class-validator decorators and Swagger annotations
- **Error handling:** 4-layer error handling (BusinessException → HttpExceptionFilter → ValidationPipe → generic catch)
- **ESLint:** Shared config package
- **TypeScript:** Strict mode, `@map` decorators for DB column names
- **Barrel exports:** `index.ts` re-exports in shared packages

### What Needs Fixing

| #   | Issue                                                                                          | Impact                                                                                    | Fix                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 7.1 | **Zero test files** — not a single `.spec.ts` or `.test.ts` exists                             | **Biggest weakness for bonus points** — judges explicitly list "Tests" as bonus criterion | Add unit tests for critical services (see §10 below)                                                     |
| 7.2 | **No CI pipeline for lint/test** — only deploy-api.yml exists                                  | CI doesn't validate quality before deploy                                                 | Add a `ci.yml` workflow that runs lint + test on PRs                                                     |
| 7.3 | **No Prettier config** despite `pnpm format` script in README                                  | Inconsistent formatting                                                                   | Add `.prettierrc` and `.prettierignore` to root                                                          |
| 7.4 | **All frontend pages are `'use client'`** — no Server Components used                          | Missing a Next.js 15 headline feature                                                     | Convert data-fetching logic to RSC where appropriate, or explicitly document the SPA architecture choice |
| 7.5 | **api-client.ts uses manual fetch** without interceptors for token refresh                     | Fragile — 401s aren't handled gracefully                                                  | Add a response interceptor that redirects to `/login` on 401                                             |
| 7.6 | **Duplicated type definitions** — hook files re-define types that could come from shared-types | DRY violation                                                                             | Import from `@maintix/shared-types` on the frontend                                                      |
| 7.7 | **No `strict: true` in Prisma schema**                                                         | Potential null safety issues                                                              | Add `strictMode = true` to generator block                                                               |

---

## 8. Deployment & Documentation (Current: 8.5/10)

### What's Strong

- **Multi-stage Dockerfiles** for both API and Web (non-root users, Alpine base, standalone Next.js output)
- **GitHub Actions CI/CD** deploying API to Google Cloud Run with secret management
- **Prisma migrations** run automatically in CI before deploy
- **Comprehensive README** with tech stack table, quick start, seed credentials, project structure, script reference
- **8 documentation files** in `docs/` covering architecture, API reference, database schema, frontend guide, deployment, contributing
- **`.env.example`** with all variables documented
- **Swagger UI** at `/api/docs` with Bearer auth

### What Could Improve

| #   | Issue                                                                                                                  | Fix                                                                     |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 8.1 | **No `docker-compose.prod.yml`** — only postgres in docker-compose; no way to run the full stack with Docker           | Add a compose file that builds and runs api + web + postgres together   |
| 8.2 | **No CI workflow for frontend** — only `deploy-api.yml` exists                                                         | Add `deploy-web.yml` for the Next.js app (Vercel, Cloud Run, or Fly.io) |
| 8.3 | **No `CONTRIBUTING.md` at root** — the docs/contributing.md exists but conventions say it should also be at root level | Symlink or duplicate to root                                            |
| 8.4 | **No `LICENSE` file** — README says "Private — All rights reserved" but no actual license file                         | Add a LICENSE file (MIT for competition submissions)                    |
| 8.5 | **API docs don't describe Webhook/SSE** — notifications use polling, but this isn't documented                         | Document the polling strategy or add WebSocket support                  |
| 8.6 | **Deployment docs don't cover frontend**                                                                               | Add Vercel/Netlify/Cloud Run deployment instructions for the web app    |

---

## 9. Mobile-First Assessment (Current: 8/10)

> **This is the #1 judging criterion for this competition.**

### What's Already Mobile-Optimized (85%)

- **Sidebar navigation:** Excellent slide-out pattern with hamburger, overlay, focus trap, escape-to-close
- **Landing page:** All 8+ sections fully responsive with 4-level text sizing, `flex-col sm:flex-row` patterns, hamburger nav
- **Login page:** Two-panel → single-panel collapse on mobile with gradient wash
- **Dashboard grids:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` patterns throughout
- **Card-based data display:** No HTML tables — lists use flex/card layouts that flow naturally on mobile
- **CSS:** `prefers-reduced-motion` accessibility, `overflow-x-hidden` prevents horizontal scroll

### What's Broken on Mobile (15%)

| #   | Issue                                                                                          | File                                                           | Fix                                                                                          | Effort  |
| --- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------- |
| 9.1 | **Ticket filter selects** have `w-[200px]`, `w-[160px]`, `w-[140px]`, `w-[180px]` fixed widths | `tickets/page.tsx`                                             | `w-full sm:w-[200px]` for all                                                                | 5 min   |
| 9.2 | **Notification filter** has `w-[200px]`                                                        | `notifications/page.tsx`                                       | `w-full sm:w-[200px]`                                                                        | 2 min   |
| 9.3 | **Create User dialog** grid is `grid-cols-2` without mobile breakpoint                         | `users/page.tsx`                                               | `grid-cols-1 sm:grid-cols-2`                                                                 | 2 min   |
| 9.4 | **Page headers** (`flex items-center justify-between`) don't wrap on narrow screens            | `tickets/page.tsx`, `notifications/page.tsx`, `users/page.tsx` | `flex-col sm:flex-row gap-2`                                                                 | 10 min  |
| 9.5 | **Stats section** on landing has `grid-cols-3` with no breakpoint — tight on <360px            | `stats-section.tsx`                                            | `grid-cols-1 sm:grid-cols-3`                                                                 | 2 min   |
| 9.6 | **Ticket detail header** badges can get pushed off-screen on narrow devices                    | `tickets/[ticketId]/page.tsx`                                  | Allow `flex-wrap` on badge row                                                               | 5 min   |
| 9.7 | **No pull-to-refresh** pattern on mobile dashboard                                             | Global                                                         | Add via `onTouchStart`/`onTouchMove` or a library                                            | 1 hour  |
| 9.8 | **No bottom navigation** for mobile — relies purely on sidebar                                 | `dashboard-layout.tsx`                                         | Consider a fixed bottom nav bar on mobile for key routes (Dashboard, Tickets, Notifications) | 2 hours |

**Total fix time for items 9.1–9.6: ~26 minutes** — do these FIRST.

---

## 10. The Biggest Win: Add Tests (Current: 0/10)

> **Tests are explicitly listed as a bonus criterion. Going from 0 to basic coverage will have the highest ROI of any change.**

### Recommended Test Strategy

#### Unit Tests (Backend) — `apps/api/src/**/*.spec.ts`

| Test File                        | What to Test                                                    | Priority |
| -------------------------------- | --------------------------------------------------------------- | -------- |
| `ticket-state-machine.spec.ts`   | All valid/invalid state transitions                             | **P0**   |
| `tickets.service.spec.ts`        | Create, assign, reassign, cancel, optimistic locking conflict   | **P0**   |
| `auth.service.spec.ts`           | Login success, invalid credentials, inactive user, deleted user | **P0**   |
| `users.service.spec.ts`          | Create (duplicate email, cannot create manager), soft delete    | **P1**   |
| `properties.service.spec.ts`     | Create (auto-add member), add duplicate member, findAllForUser  | **P1**   |
| `categories.service.spec.ts`     | Create (duplicate name), update uniqueness                      | **P2**   |
| `uploads.service.spec.ts`        | File type validation, max attachments, delete by non-uploader   | **P2**   |
| `notification.listeners.spec.ts` | Event → correct notification recipients                         | **P2**   |

#### E2E Tests — `apps/api/test/*.e2e-spec.ts`

| Test File                | What to Test                                                        | Priority |
| ------------------------ | ------------------------------------------------------------------- | -------- |
| `auth.e2e-spec.ts`       | Login flow, JWT validation, protected routes                        | **P0**   |
| `tickets.e2e-spec.ts`    | Full ticket lifecycle: create → assign → start → complete → approve | **P0**   |
| `properties.e2e-spec.ts` | CRUD + member management + property guard                           | **P1**   |

#### Frontend Tests (Optional but Impressive)

| Test                  | What to Test                             |
| --------------------- | ---------------------------------------- |
| `auth-guard.test.tsx` | Redirect to login when not authenticated |
| `use-tickets.test.ts` | React Query hook integration             |

### Setup Required

```bash
# Backend unit tests
pnpm --filter @maintix/api add -D @nestjs/testing jest @types/jest ts-jest

# Backend e2e tests
pnpm --filter @maintix/api add -D supertest @types/supertest
```

**Estimated effort: 2-3 days for P0 tests, 1-2 days for P1-P2**

---

## 11. Priority Roadmap — Winning the Competition

### Phase 1 — Quick Wins (1-2 days) ⚡

These are the changes with the highest impact-to-effort ratio:

| #   | Task                                                                                                                  | Effort    | Impact                                        |
| --- | --------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------- |
| A   | Fix all mobile responsive issues (§9.1-9.6)                                                                           | 30 min    | High — competition is explicitly Mobile-First |
| B   | Register `RequestIdMiddleware` in `AppModule`                                                                         | 10 min    | High — currently defined but never applied    |
| C   | Fix authorization gaps (§3.1-3.4) — add PropertyGuard/ownership checks to category update, ticket detail, attachments | 2 hours   | Critical — security vulnerability             |
| D   | Add empty states to all dashboard pages                                                                               | 2 hours   | High — judges notice bare empty pages         |
| E   | Add skeleton loaders to dashboard pages                                                                               | 1.5 hours | Medium — professional polish                  |
| F   | Fix page header wrapping for mobile                                                                                   | 15 min    | Medium — mobile-first compliance              |
| G   | Add confirmation dialogs for destructive actions                                                                      | 1 hour    | Medium — UX maturity signal                   |
| H   | Add relative timestamps throughout dashboard                                                                          | 30 min    | Low effort, noticeable polish                 |

### Phase 2 — Tests (2-3 days) 🧪

| #   | Task                                                                    | Effort  | Impact                                             |
| --- | ----------------------------------------------------------------------- | ------- | -------------------------------------------------- |
| I   | `ticket-state-machine.spec.ts` — pure unit test of transitions          | 2 hours | **Highest ROI test** — showcases the state machine |
| J   | `tickets.service.spec.ts` — mock Prisma, test business rules            | 4 hours | Demonstrates testing depth                         |
| K   | `auth.service.spec.ts` — login edge cases                               | 2 hours | Standard expectation                               |
| L   | `auth.e2e-spec.ts` + `tickets.e2e-spec.ts` — full API integration tests | 6 hours | Bonus multiplier — shows real-world coverage       |
| M   | Add CI workflow (`ci.yml`) running lint + test on PRs                   | 1 hour  | Shows engineering maturity                         |

### Phase 3 — Feature Enhancements (3-5 days) 🚀

| #   | Task                                                                        | Effort    | Impact                                         |
| --- | --------------------------------------------------------------------------- | --------- | ---------------------------------------------- |
| N   | Dashboard chart — ticket status distribution (donut/bar chart)              | 3 hours   | High — visual analytics signal                 |
| O   | Expand seed data — multiple properties, diverse tickets across all statuses | 2 hours   | High — judges demo from seed data              |
| P   | Ticket comments/notes system                                                | 4 hours   | Medium — realistic feature                     |
| Q   | Image preview/gallery in ticket detail                                      | 3 hours   | Medium — completes the upload story            |
| R   | Add `PATCH /auth/change-password`                                           | 1.5 hours | Medium — expected in any auth system           |
| S   | Add `PATCH /users/me` for profile editing                                   | 1 hour    | Medium — basic user expectation                |
| T   | Add due date (`dueDate`) to tickets with overdue highlighting               | 3 hours   | Medium — realistic property management feature |
| U   | Command palette (Cmd+K) with cmdk                                           | 3 hours   | High — WOW factor for judges                   |

### Phase 4 — Polish & Edge Cases (2-3 days) ✨

| #   | Task                                                           | Effort  | Impact                                |
| --- | -------------------------------------------------------------- | ------- | ------------------------------------- |
| V   | `docker-compose.prod.yml` running full stack                   | 2 hours | Bonus — Docker criterion              |
| W   | Add WebSocket for real-time notifications (replace polling)    | 6 hours | High — modern real-time app           |
| X   | Add structured logging (Winston/Pino) with request correlation | 3 hours | Medium — production-grade             |
| Y   | Collapsible sidebar (icon-only mode on desktop)                | 3 hours | Medium — dashboard UX polish          |
| Z   | Add PDF support to file uploads                                | 30 min  | Low effort, realistic for maintenance |

---

## 12. Security Checklist

| #   | Check                                              | Status                        | Action                                             |
| --- | -------------------------------------------------- | ----------------------------- | -------------------------------------------------- |
| 1   | JWT secret min 32 chars                            | ✅ Enforced via Joi           | —                                                  |
| 2   | Password hashing (bcrypt 12 rounds)                | ✅                            | —                                                  |
| 3   | Rate limiting (global + login)                     | ✅ 30/min global, 5/min login | —                                                  |
| 4   | Input validation (whitelist, forbidNonWhitelisted) | ✅ Global ValidationPipe      | —                                                  |
| 5   | CORS configurable                                  | ✅ via env                    | —                                                  |
| 6   | Non-root Docker user                               | ✅ Both Dockerfiles           | —                                                  |
| 7   | Soft deletes (no data loss)                        | ✅ All models                 | —                                                  |
| 8   | `PropertyGuard` on property routes                 | ✅                            | —                                                  |
| 9   | Category endpoints missing property scoping        | ❌                            | Fix §3.1                                           |
| 10  | Ticket detail readable by any auth user            | ❌                            | Fix §3.2                                           |
| 11  | Attachments readable by any auth user              | ❌                            | Fix §3.3                                           |
| 12  | No HTTPS enforcement doc                           | ⚠️                            | Document that Cloud Run provides HTTPS termination |
| 13  | No helmet middleware                               | ⚠️                            | Add `@nestjs/helmet` for security headers          |
| 14  | No CSRF protection                                 | ⚠️                            | JWT-based APIs don't need CSRF, but document this  |
| 15  | Secrets in env (not hardcoded)                     | ✅ Joi validation             | —                                                  |

---

## 13. What Makes This Submission Stand Out (Highlight for Judges)

Ensure these strengths are prominently featured in the README and demo:

1. **Ticket State Machine with Optimistic Locking** — Concurrent editing protection using version-based conflict detection. This is a feature most competitors won't implement.

2. **Event-Driven Notification System** — 8 business events with targeted recipient logic (e.g., reassignment notifies both old and new technician). Clean decoupling via `@nestjs/event-emitter`.

3. **Multi-Property Architecture** — Not just one property — supports unlimited properties with isolated member teams, categories, and tickets. `PropertyGuard` enforces membership at the API level.

4. **Immutable Audit Trail** — Every ticket action logged with actor, timestamp, previous/new values. Cursor-paginated for performance.

5. **Shared Type Safety** — `@maintix/shared-types` package shares enums, error codes, and constants between backend and frontend — zero type drift.

6. **Production-Ready Deployment** — Multi-stage Dockerfiles, GCP Cloud Run CI/CD, Prisma migrations in pipeline, Supabase for managed storage.

7. **Comprehensive Documentation** — 8 docs covering architecture, API reference, database schema, deployment, and contributing guide.

---

## 14. Recommended New Dependencies

| Package                            | Purpose                              | Where      |
| ---------------------------------- | ------------------------------------ | ---------- |
| `recharts` or `@nivo/core`         | Dashboard charts                     | `apps/web` |
| `cmdk`                             | Command palette (Cmd+K)              | `apps/web` |
| `date-fns`                         | Relative timestamps, date formatting | `apps/web` |
| `@nestjs/testing`                  | Test utilities                       | `apps/api` |
| `supertest`                        | E2E HTTP testing                     | `apps/api` |
| `helmet`                           | Security headers middleware          | `apps/api` |
| `@nestjs/websockets` + `socket.io` | Real-time notifications (optional)   | `apps/api` |
| `pino` or `winston`                | Structured logging (optional)        | `apps/api` |

---

## 15. File-Level Change Map

Quick reference of files that need changes, grouped by priority:

### Must Fix (Phase 1)

| File                                                    | Change                                             |
| ------------------------------------------------------- | -------------------------------------------------- |
| `apps/api/src/app.module.ts`                            | Register `RequestIdMiddleware`                     |
| `apps/api/src/modules/categories/categories.service.ts` | Add property ownership validation on update/delete |
| `apps/api/src/modules/tickets/tickets.service.ts`       | Add property membership check on `findOne`         |
| `apps/api/src/modules/uploads/uploads.service.ts`       | Add property membership check on `findByTicket`    |
| `apps/web/src/app/dashboard/tickets/page.tsx`           | Fix filter widths, header wrapping                 |
| `apps/web/src/app/dashboard/notifications/page.tsx`     | Fix filter width, header wrapping                  |
| `apps/web/src/app/dashboard/users/page.tsx`             | Fix dialog grid, header wrapping                   |
| `apps/web/src/app/_components/stats-section.tsx`        | Add mobile breakpoint to grid                      |

### Should Add (Phase 2)

| File                                                        | Change                  |
| ----------------------------------------------------------- | ----------------------- |
| `apps/api/src/modules/tickets/ticket-state-machine.spec.ts` | **New**: Unit tests     |
| `apps/api/src/modules/tickets/tickets.service.spec.ts`      | **New**: Service tests  |
| `apps/api/src/modules/auth/auth.service.spec.ts`            | **New**: Auth tests     |
| `apps/api/test/auth.e2e-spec.ts`                            | **New**: E2E tests      |
| `.github/workflows/ci.yml`                                  | **New**: Lint + test CI |

### Nice to Add (Phase 3-4)

| File                                          | Change                              |
| --------------------------------------------- | ----------------------------------- |
| `apps/web/src/app/dashboard/page.tsx`         | Add charts, empty states            |
| `apps/web/src/components/skeleton-*.tsx`      | **New**: Skeleton loader components |
| `apps/web/src/components/empty-state.tsx`     | **New**: Reusable empty state       |
| `apps/web/src/components/command-palette.tsx` | **New**: Cmd+K search               |
| `packages/database/prisma/seed.ts`            | Expand with richer demo data        |
| `docker-compose.prod.yml`                     | **New**: Full-stack compose         |

---

_Generated from full codebase analysis — June 2025_
