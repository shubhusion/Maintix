# Contributing

Guidelines for contributing to the Maintix project.

## Development Workflow

### 1. Set Up Your Environment

Follow the [Getting Started](./getting-started.md) guide to set up the project locally.

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

**Branch naming conventions**:

| Prefix      | Use Case                    |
| ----------- | --------------------------- |
| `feature/`  | New features                |
| `fix/`      | Bug fixes                   |
| `refactor/` | Code restructuring          |
| `docs/`     | Documentation updates       |
| `chore/`    | Build, deps, config changes |

### 3. Make Changes

- Work in small, focused commits
- Run linting and tests before pushing
- Ensure the build passes

### 4. Verify Your Changes

```bash
# Lint everything
pnpm lint

# Run tests
pnpm test

# Build everything (ensures no compile errors)
pnpm build
```

### 5. Submit a Pull Request

- Write a clear PR title and description
- Reference any related issues
- Request review from the team

---

## Code Style

### TypeScript

- **Strict mode** enabled via shared tsconfig
- Use explicit types over `any` — prefer `unknown` or proper interfaces
- Use `enum` values from local shared-types (not string literals)

### API (NestJS)

| Guideline            | Details                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| **Module structure** | One folder per feature module in `src/modules/`                          |
| **Controllers**      | Thin — delegate logic to services                                        |
| **Services**         | Business logic lives here                                                |
| **DTOs**             | Always validate input with `class-validator` decorators                  |
| **Guards**           | Use `@Public()` for unauthenticated routes, `@Roles()` for authorization |
| **Error handling**   | Use `BusinessException` with typed `ErrorCode`                           |
| **Database**         | Use `PrismaService` — never instantiate `PrismaClient` directly          |

### Frontend (Next.js)

| Guideline         | Details                                                          |
| ----------------- | ---------------------------------------------------------------- |
| **Components**    | Use `'use client'` directive for interactive components          |
| **Data fetching** | Always use TanStack Query hooks (in `src/hooks/`)                |
| **Forms**         | react-hook-form + Zod schemas (in `src/lib/validations.ts`)      |
| **Styling**       | Tailwind CSS utility classes, use `cn()` for conditional classes |
| **Theme**         | All custom colors must support `dark:` variant                   |
| **API calls**     | Use the `api` client from `src/lib/api-client.ts`                |

### Formatting

Prettier is configured at the root. Run:

```bash
pnpm format
```

---

## Project Conventions

### API Response Format

All responses must be wrapped in the standard envelope:

```json
{ "data": { ... } }
```

Paginated responses:

```json
{
  "data": [...],
  "meta": { "hasMore": true, "nextCursor": "uuid" }
}
```

### Error Format

Use `BusinessException` from local shared-types:

```typescript
throw new BusinessException(ErrorCode.TICKET_NOT_FOUND, HttpStatus.NOT_FOUND);
```

Never throw raw `HttpException` — always use `BusinessException` with a typed error code.

### Database Changes

1. Edit `apps/api/prisma/schema.prisma`
2. Run `pnpm db:generate` to regenerate the Prisma client
3. Run `pnpm db:push` (dev) or `pnpm db:migrate` (production) to apply
4. If adding new enums, mirror them in `apps/*/shared-types/enums.ts`

### Adding a New Feature Module (API)

1. Create folder: `apps/api/src/modules/your-feature/`
2. Create files: `your-feature.module.ts`, `your-feature.controller.ts`, `your-feature.service.ts`, `dto/`
3. Register module in `app.module.ts` imports
4. Add routes with proper decorators (`@Public`, `@Roles`, `@UseGuards`)

### Adding a New Page (Frontend)

1. Create folder: `apps/web/src/app/dashboard/your-page/`
2. Create `page.tsx` with `'use client'` directive
3. Create hooks in `src/hooks/use-your-feature.ts`
4. Add validation schemas in `src/lib/validations.ts`
5. Add sidebar link in `components/dashboard-layout.tsx` (with role gate if needed)

### Adding Shared Types

1. Add to the appropriate file in `apps/*/shared-types/`
2. Export from the index file if creating a new file
3. Run `pnpm build` to recompile
4. Import as local dependency

---

## Architecture Rules

1. **No direct DB access from controllers** — always go through a service
2. **No business logic in guards** — guards only check access, services handle logic
3. **Soft deletes by default** — set `deletedAt` rather than destroying records
4. **Optimistic concurrency** — all ticket mutations must accept and check `version`
5. **Event-driven notifications** — emit events from services, handle in `NotificationListeners`
6. **Typed errors** — use `ErrorCode` enum, never raw strings
7. **Shared enums** — always import from local shared-types, never redefine
