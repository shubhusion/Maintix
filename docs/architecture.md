# Architecture

## Overview

Maintix is a **pnpm monorepo** managed by **Turborepo** containing two applications and four shared packages. The architecture follows a clean separation between a REST API backend and a React SPA frontend, connected through shared type definitions.

```
┌────────────────────────────────────────────────────────────────┐
│                        pnpm Workspace                          │
│                                                                │
│  ┌─────────────┐    ┌─────────────┐                            │
│  │   apps/web   │───▶│  apps/api   │                            │
│  │  (Next.js)   │    │  (NestJS)   │                            │
│  └──────┬───────┘    └──────┬──────┘                            │
│         │                   │                                   │
│         ▼                   ▼                                   │
│  ┌─────────────────────────────────────────┐                    │
│  │         packages/shared-types           │                    │
│  │    (Enums, Types, Constants, Errors)    │                    │
│  └─────────────────────────────────────────┘                    │
│         │                   │                                   │
│         ▼                   ▼                                   │
│  ┌────────────┐    ┌────────────────┐    ┌──────────────────┐  │
│  │  tsconfig   │    │    database     │    │  eslint-config   │  │
│  │  (shared)   │    │ (Prisma ORM)   │    │    (shared)      │  │
│  └────────────┘    └────────────────┘    └──────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## Monorepo Structure

### Applications

| App     | Path        | Stack                                | Port |
| ------- | ----------- | ------------------------------------ | ---- |
| **API** | `apps/api/` | NestJS 10, TypeScript 5, Prisma 6    | 3001 |
| **Web** | `apps/web/` | Next.js 15, React 19, Tailwind CSS 4 | 3000 |

### Packages

| Package                  | Path                      | Purpose                                                |
| ------------------------ | ------------------------- | ------------------------------------------------------ |
| `@maintix/database`      | `packages/database/`      | Prisma schema, client generation, seed script          |
| `@maintix/shared-types`  | `packages/shared-types/`  | Enums, TypeScript types, error codes, constants        |
| `@maintix/tsconfig`      | `packages/tsconfig/`      | Shared `tsconfig.json` presets (base, NestJS, Next.js) |
| `@maintix/eslint-config` | `packages/eslint-config/` | Shared ESLint configuration                            |

### Dependency Graph

```
apps/api
  ├── @maintix/database       (Prisma client)
  ├── @maintix/shared-types   (enums, error codes)
  ├── @maintix/tsconfig       (tsconfig/nestjs.json)
  └── @maintix/eslint-config

apps/web
  ├── @maintix/shared-types   (enums, types)
  ├── @maintix/tsconfig       (tsconfig/nextjs.json)
  └── @maintix/eslint-config
```

## Build Pipeline

Turborepo orchestrates builds with dependency-aware task execution:

```json
{
  "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
  "dev": { "cache": false, "persistent": true },
  "lint": { "dependsOn": ["^build"] },
  "test": { "dependsOn": ["^build"] }
}
```

Build order: `shared-types` → `database` → `api` + `web` (parallel).

## Backend Architecture

### Module Structure

The NestJS API organizes code into **feature modules** with a shared **common layer**:

```
apps/api/src/
├── main.ts                    # Bootstrap, global config, Swagger
├── app.module.ts              # Root module importing all features
├── common/
│   ├── database/              # PrismaService (global)
│   ├── decorators/            # @Public, @Roles, @CurrentUser
│   ├── exceptions/            # BusinessException
│   ├── filters/               # HttpExceptionFilter
│   ├── guards/                # PropertyGuard
│   ├── interceptors/          # TransformInterceptor
│   └── middleware/            # RequestIdMiddleware
└── modules/
    ├── auth/                  # Login, JWT strategy, guards
    ├── users/                 # User CRUD (Manager-only creation)
    ├── properties/            # Property CRUD + member management
    ├── categories/            # Category CRUD (per-property)
    ├── tickets/               # Ticket lifecycle + state machine
    ├── uploads/               # File uploads (Supabase Storage)
    ├── notifications/         # Event-driven notifications
    └── health/                # Health check endpoint
```

### Request Pipeline

Every HTTP request passes through a standardized pipeline:

```
Request
  │
  ▼
RequestIdMiddleware         → Ensures x-request-id header
  │
  ▼
ThrottlerGuard (global)     → Rate limiting (30 req/60s)
  │
  ▼
JwtAuthGuard (global)       → JWT verification (skip if @Public)
  │
  ▼
RolesGuard (global)         → Role enforcement (skip if no @Roles)
  │
  ▼
PropertyGuard (per-route)   → Membership verification for property routes
  │
  ▼
ValidationPipe (global)     → DTO validation (whitelist, transform)
  │
  ▼
Controller Handler          → Business logic
  │
  ▼
TransformInterceptor        → Wraps response in { data: T }
  │
  ▼
HttpExceptionFilter         → Standardized error format
  │
  ▼
Response: { data, statusCode, ... }
```

### Auth Flow

```
Client                          API
  │                              │
  ├── POST /auth/login ─────────▶│
  │   { email, password }        │──▶ Validate credentials (bcrypt)
  │                              │──▶ Check isActive
  │◀── { accessToken, user } ────│──▶ Sign JWT { sub, email, role }
  │                              │
  ├── GET /any-endpoint ─────────▶│
  │   Authorization: Bearer xxx  │──▶ JwtStrategy.validate()
  │                              │──▶ Look up user in DB
  │◀── { data: ... } ───────────│──▶ Attach user to request
  │                              │
```

### Event-Driven Notifications

Ticket operations emit events via `EventEmitter2`. The `NotificationListeners` service subscribes and creates persistent notifications:

```
TicketsService                    NotificationListeners
  │                                │
  ├── ticket.created ─────────────▶│──▶ Notify all property managers
  ├── ticket.assigned ────────────▶│──▶ Notify technician + creator
  ├── ticket.started ─────────────▶│──▶ Notify creator + managers
  ├── ticket.submitted ───────────▶│──▶ Notify managers
  ├── ticket.completed ───────────▶│──▶ Notify creator + technician
  ├── ticket.cancelled ───────────▶│──▶ Notify managers + technician
  ├── ticket.priorityChanged ─────▶│──▶ Notify assignee
  └── ticket.reassigned ──────────▶│──▶ Notify old + new technician
```

### Ticket State Machine

Valid status transitions are enforced by `TicketStateMachine`:

```
  ┌──────────────┐
  │     OPEN     │
  └──────┬───────┘
         │ assign
         ▼
  ┌──────────────┐    reassign
  │   ASSIGNED   │◀─────────────┐
  └──────┬───────┘              │
         │ start                │
         ▼                      │
  ┌──────────────┐              │
  │ IN_PROGRESS  │──────────────┘
  └──────┬───────┘
         │ complete
         ▼
  ┌──────────────────┐
  │AWAITING_APPROVAL │
  └──────┬───────────┘
         │ approve
         ▼
  ┌──────────────┐
  │     DONE     │ (terminal)
  └──────────────┘

  * OPEN, ASSIGNED → CANCELLED (by creator)
```

### Optimistic Concurrency Control

All ticket mutations require a `version` field. The service checks that the provided version matches the current database version before applying changes. On conflict, it returns HTTP 409 with `TICKET_VERSION_CONFLICT`.

```typescript
// Client sends version with every mutation
{ technicianId: "abc-123", version: 3 }

// Server compares and either applies or rejects
if (ticket.version !== dto.version) {
  throw new BusinessException(ErrorCode.TICKET_VERSION_CONFLICT, 409);
}
// On success, increments version
await prisma.ticket.update({ data: { version: { increment: 1 } } });
```

## Frontend Architecture

### Page Structure

```
/ ──────────────────── Landing page (public, SSR-disabled client component)
/login ────────────── Login form (public)
/dashboard ─────────── Protected layout (AuthGuard + DashboardLayout)
  ├── / ───────────── Stats & property overview
  ├── /properties ──── Property list + CRUD
  │   └── /[id] ───── Property detail (members, categories, tickets)
  ├── /tickets ─────── Ticket list with filters
  │   └── /[id] ───── Ticket detail + actions
  ├── /users ────────── User management (Manager only)
  └── /notifications ── Notification center
```

### Provider Chain

```
ThemeProvider (next-themes)
  └── QueryClientProvider (TanStack Query)
        └── AuthProvider (JWT + user state)
              └── {children}
              └── Toaster (toast notifications)
```

### Data Flow

```
Component
  │
  ├── useTickets(propertyId) ──▶ TanStack Query ──▶ api.get('/...') ──▶ REST API
  │                                                       │
  │                                                 localStorage
  │                                                 .accessToken
  │                                                       │
  │◀── { data, isLoading, error } ◀── Cache ◀── { data: T } (unwrapped)
  │
  └── mutate() ──▶ useMutation ──▶ api.post('/...') ──▶ REST API
                                        │
                                  onSuccess: invalidateQueries
```

### Key Frontend Patterns

| Pattern           | Implementation                                                           |
| ----------------- | ------------------------------------------------------------------------ |
| **Auth**          | JWT in localStorage, `AuthProvider` context, `AuthGuard` HOC             |
| **Data Fetching** | TanStack Query with 30s stale time, auto-refetch                         |
| **Forms**         | react-hook-form + Zod schemas for validation                             |
| **Theming**       | next-themes with `dark`/`light`/`system` + Tailwind CSS `dark:` variants |
| **Animations**    | Framer Motion + Magic UI components                                      |
| **Notifications** | Polling (15-30s), real-time via TanStack Query refetch                   |
| **Pagination**    | Cursor-based with `useInfiniteQuery`                                     |
| **UI Components** | Radix UI primitives, shadcn/ui patterns, Magic UI effects                |

## Infrastructure

### Docker Services

```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ['5432:5432']
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: Maintix
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Environment Variables

#### API (`apps/api/.env`)

| Variable               | Required | Default                 | Description                  |
| ---------------------- | -------- | ----------------------- | ---------------------------- |
| `DATABASE_URL`         | Yes      | —                       | PostgreSQL connection string |
| `JWT_SECRET`           | Yes      | —                       | Minimum 32 characters        |
| `JWT_EXPIRATION`       | No       | `24h`                   | Token TTL                    |
| `SUPABASE_URL`         | Yes      | —                       | Supabase project URL         |
| `SUPABASE_SERVICE_KEY` | Yes      | —                       | Supabase service role key    |
| `CORS_ORIGIN`          | No       | `http://localhost:3000` | Allowed CORS origin          |
| `PORT`                 | No       | `3001`                  | API server port              |

#### Web (`apps/web/.env`)

| Variable              | Required | Default                        | Description  |
| --------------------- | -------- | ------------------------------ | ------------ |
| `NEXT_PUBLIC_API_URL` | No       | `http://localhost:3001/api/v1` | API base URL |

## API Versioning Strategy

Maintix uses **URL-prefix versioning** with the global prefix `api/v1` set in `main.ts`:

```typescript
app.setGlobalPrefix('api/v1');
```

### Current Design

- **All endpoints** are served under `/api/v1/...` (e.g., `/api/v1/tickets`, `/api/v1/auth/login`).
- **Swagger docs** are available at `/api/docs` (outside the versioned prefix).
- **Health check** is at `/api/v1/health`.

### When to Introduce v2

A new API version (`/api/v2`) should be introduced only when:

1. **Breaking changes** to request/response shapes are needed (e.g., renaming fields, removing endpoints).
2. **Behavioral changes** that would break existing clients (e.g., changing pagination from cursor to offset).
3. **Authentication scheme changes** (e.g., migrating from JWT to OAuth2 flows).

Non-breaking additions (new endpoints, new optional fields, new query parameters) do **not** require a version bump — they can be added to `v1`.

### Migration Path

When `v2` is needed:

1. Create a `v2/` module folder or use NestJS versioning (`@Version('2')` decorator).
2. Keep `v1` running in parallel during deprecation window.
3. Return `Sunset` and `Deprecation` headers on `v1` responses.
4. Document timeline in API changelog and notify consumers.

> **Current status:** The application is in its initial release. `v1` is the only version and no breaking changes are planned.
