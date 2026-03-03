# Maintix

**Multi-Property Maintenance Workflow Platform**

Maintix streamlines maintenance ticket workflows across multiple properties. Tenants report issues, managers oversee and assign work, and technicians track jobs from start to completion — all in one platform.

## Features

- **Multi-Property Management** — Manage unlimited properties with isolated teams and categories
- **Role-Based Access** — Three user roles: Manager, Tenant, Technician — each with tailored dashboards
- **Ticket Lifecycle** — Full workflow: Open → Assigned → In Progress → Awaiting Approval → Done
- **File Attachments** — Image uploads via Supabase Storage with size/type validation
- **Real-Time Notifications** — Event-driven notification system with polling
- **Activity Audit Trail** — Immutable log of every ticket action with actor and timestamps
- **Optimistic Concurrency** — Version-based conflict detection prevents stale writes
- **Dark/Light Theme** — Toggle between themes, persisted across sessions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, TanStack Query 5 |
| **Backend** | NestJS 10, Passport JWT, Prisma 6 |
| **Database** | PostgreSQL 16 |
| **Storage** | Supabase Storage |
| **Monorepo** | pnpm Workspaces + Turborepo |
| **UI** | Radix UI, shadcn/ui, Magic UI, Framer Motion |

## Quick Start

```bash
# Prerequisites: Node.js ≥ 20, pnpm ≥ 10, Docker

# 1. Clone & Install
git clone https://github.com/your-org/Maintix.git
cd Maintix
pnpm install

# 2. Start Database
docker compose up -d

# 3. Setup Environment
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Initialize Database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 5. Start Development
pnpm dev
```

Open:
- **Frontend** → http://localhost:3000
- **API** → http://localhost:3001/api/v1
- **Swagger** → http://localhost:3001/api/docs

### Default Seed Credentials

| Email | Password | Role |
|-------|----------|------|
| `admin@Maintix.com` | `ChangeThisPassword123` | Manager |

## Project Structure

```
Maintix/
├── apps/
│   ├── api/              # NestJS backend (REST API)
│   └── web/              # Next.js frontend (SPA)
├── packages/
│   ├── database/         # Prisma schema, client & seed
│   ├── shared-types/     # Enums, types, constants, error codes
│   ├── tsconfig/         # Shared TypeScript configurations
│   └── eslint-config/    # Shared ESLint configuration
├── docs/                 # Detailed project documentation
├── docker-compose.yml    # PostgreSQL 16 container
├── turbo.json            # Turborepo pipeline config
└── pnpm-workspace.yaml   # Workspace definition
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run all tests |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema changes (dev) |
| `pnpm db:seed` | Seed database with initial data |
| `pnpm db:studio` | Open Prisma Studio GUI |
| `pnpm format` | Format code with Prettier |

## Documentation

See the [docs/](./docs/) folder for comprehensive documentation:

- [Architecture](./docs/architecture.md) — System design, monorepo structure, data flow
- [Getting Started](./docs/getting-started.md) — Full setup guide with environment configuration
- [API Reference](./docs/api-reference.md) — Complete REST endpoint documentation
- [Frontend Guide](./docs/frontend.md) — Pages, components, hooks, theming
- [Database Schema](./docs/database.md) — Models, relationships, migrations
- [Shared Packages](./docs/shared-packages.md) — Types, constants, error codes
- [Contributing](./docs/contributing.md) — Code style and contribution guidelines

## License

Private — All rights reserved.
