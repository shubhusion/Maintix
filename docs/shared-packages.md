# Shared Packages

The `packages/` directory contains four shared packages consumed by the applications.

## @maintix/shared-types

**Path**: `packages/shared-types/`  
**Output**: CommonJS (built to `dist/`)

Shared TypeScript definitions used by both the API and web app. This package is built as part of the Turborepo pipeline and must be compiled before dependent apps.

### Enums

```typescript
enum Role {
  TENANT = 'TENANT',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
}

enum TicketStatus {
  OPEN = 'OPEN',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

enum ActivityAction {
  TICKET_CREATED, TECHNICIAN_ASSIGNED, TECHNICIAN_REASSIGNED,
  WORK_STARTED, COMPLETION_SUBMITTED, TICKET_APPROVED,
  TICKET_CANCELLED, PRIORITY_CHANGED, ATTACHMENT_ADDED, ATTACHMENT_REMOVED
}

enum NotificationType {
  TICKET_CREATED, TICKET_ASSIGNED, WORK_STARTED,
  COMPLETION_SUBMITTED, TICKET_APPROVED, TICKET_CANCELLED,
  PRIORITY_CHANGED, TECHNICIAN_REASSIGNED
}
```

### Types

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    hasMore: boolean;
    nextCursor: string | null;
    total?: number;
  };
}

interface ApiResponse<T> {
  data: T;
}

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  requestId?: string;
}
```

### Error Codes

All typed error codes used by `BusinessException` on the API and `ApiError` on the frontend:

| Category | Codes |
|----------|-------|
| **Auth** | `INVALID_CREDENTIALS`, `USER_INACTIVE`, `TOKEN_EXPIRED`, `TOKEN_INVALID` |
| **Authorization** | `FORBIDDEN`, `ROLE_NOT_ALLOWED`, `PROPERTY_ACCESS_DENIED` |
| **Users** | `USER_NOT_FOUND`, `EMAIL_ALREADY_EXISTS`, `CANNOT_CREATE_MANAGER` |
| **Properties** | `PROPERTY_NOT_FOUND`, `ALREADY_PROPERTY_MEMBER`, `NOT_PROPERTY_MEMBER` |
| **Categories** | `CATEGORY_NOT_FOUND`, `CATEGORY_NAME_EXISTS` |
| **Tickets** | `TICKET_NOT_FOUND`, `TICKET_INVALID_TRANSITION`, `TICKET_VERSION_CONFLICT`, `TICKET_NOT_CANCELLABLE`, `TECHNICIAN_NOT_ASSIGNEE`, `ASSIGNEE_NOT_TECHNICIAN`, `ASSIGNEE_NOT_PROPERTY_MEMBER` |
| **Uploads** | `UPLOAD_SIZE_EXCEEDED`, `UPLOAD_TYPE_NOT_ALLOWED`, `UPLOAD_LIMIT_REACHED`, `ATTACHMENT_NOT_FOUND` |
| **General** | `VALIDATION_ERROR`, `RATE_LIMIT_EXCEEDED`, `INTERNAL_ERROR` |

### Constants

```typescript
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;          // 5 MB
const MAX_ATTACHMENTS_PER_TICKET = 5;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const RATE_LIMITS = {
  LOGIN:           { ttl: 60_000, limit: 5 },
  TICKET_CREATION: { ttl: 60_000, limit: 10 },
  GENERAL:         { ttl: 60_000, limit: 30 },
};

const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 50,
};

const STORAGE_BUCKET = 'ticket-attachments';
```

---

## @maintix/database

**Path**: `packages/database/`

Prisma schema and client generation. This package is not directly imported by the web app — only the API depends on it.

### Contents

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | Database schema (models, enums, relations) |
| `prisma/seed.ts` | Seed script for initial manager account |
| `src/index.ts` | Re-exports Prisma client |

### Usage in API

```typescript
import { PrismaService } from './common/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({ where: { deletedAt: null } });
  }
}
```

---

## @maintix/tsconfig

**Path**: `packages/tsconfig/`

Shared TypeScript configuration presets.

| File | Used By | Key Settings |
|------|---------|-------------|
| `base.json` | All packages | `strict: true`, `esModuleInterop`, `skipLibCheck` |
| `nestjs.json` | `apps/api` | Extends base, `module: commonjs`, `declaration: true`, `outDir: dist` |
| `nextjs.json` | `apps/web` | Extends base, `jsx: preserve`, Next.js plugin |

### Usage

```json
// apps/api/tsconfig.json
{
  "extends": "@maintix/tsconfig/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist",
    "baseUrl": "./"
  }
}
```

---

## @maintix/eslint-config

**Path**: `packages/eslint-config/`

Shared ESLint configuration for consistent code style across the monorepo.

### Usage

```json
// apps/api/package.json (or .eslintrc)
{
  "devDependencies": {
    "@maintix/eslint-config": "workspace:*"
  }
}
```

---

## Dependency Graph

```
apps/api
  ├── @maintix/database         ← Prisma client for DB access
  ├── @maintix/shared-types     ← Enums, error codes, constants
  ├── @maintix/tsconfig         ← nestjs.json extends
  └── @maintix/eslint-config    ← Lint config

apps/web
  ├── @maintix/shared-types     ← Enums, types (transpiled by Next.js)
  ├── @maintix/tsconfig         ← nextjs.json extends
  └── @maintix/eslint-config    ← Lint config
```

### Build Order

Turborepo ensures packages build before their dependents:

```
1. @maintix/tsconfig       (no build step)
2. @maintix/eslint-config  (no build step)
3. @maintix/shared-types   (tsc → dist/)
4. @maintix/database       (prisma generate)
5. apps/api + apps/web     (parallel, depend on above)
```
