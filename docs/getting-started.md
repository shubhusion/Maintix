# Getting Started

Complete setup guide for running Maintix locally.

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| **Node.js** | ≥ 20.0.0 | [nodejs.org](https://nodejs.org) |
| **pnpm** | ≥ 10.30.0 | `npm install -g pnpm` |
| **Docker** | Latest | [docker.com](https://www.docker.com/get-started) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

You'll also need a **Supabase** project for file storage (free tier works).

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Maintix.git
cd Maintix
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs all workspace dependencies across `apps/` and `packages/`.

### 3. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container:
- **Host**: `localhost`
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `postgres`
- **Database**: `Maintix`

Verify it's running:

```bash
docker compose ps
```

### 4. Configure Environment Variables

#### API Environment (`apps/api/.env`)

Create the file and set the following:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/Maintix

# JWT
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_EXPIRATION=24h

# Supabase (for file storage)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Server
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

> **JWT_SECRET** must be at least 32 characters. Generate one:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

#### Web Environment (`apps/web/.env`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### 5. Initialize the Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (development mode)
pnpm db:push

# Seed with default manager account
pnpm db:seed
```

### 6. Start Development Servers

```bash
pnpm dev
```

This starts both apps concurrently via Turborepo:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001/api/v1
- **Swagger**: http://localhost:3001/api/docs

### 7. Log In

Use the seed credentials:

| Email | Password |
|-------|----------|
| `admin@Maintix.com` | `ChangeThisPassword123` |

---

## Supabase Setup

Maintix uses Supabase Storage for ticket attachments.

### 1. Create a Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Create a Storage Bucket

In the Supabase dashboard:
1. Go to **Storage** → **New Bucket**
2. Create a bucket named `ticket-attachments`
3. Set it to **Public** (or configure RLS policies as needed)

### 3. Get Your Keys

From **Project Settings** → **API**:
- **Project URL** → `SUPABASE_URL`
- **Service Role Key** → `SUPABASE_SERVICE_KEY`

---

## Common Commands

### Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm test` | Run all test suites |
| `pnpm format` | Format code with Prettier |

### Database

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Regenerate Prisma client |
| `pnpm db:push` | Push schema changes (dev) |
| `pnpm db:migrate` | Run production migrations |
| `pnpm db:seed` | Seed default data |
| `pnpm db:studio` | Open Prisma Studio GUI (localhost:5555) |

### Docker

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start PostgreSQL in background |
| `docker compose down` | Stop PostgreSQL |
| `docker compose down -v` | Stop + remove data volume |
| `docker compose logs postgres` | View PostgreSQL logs |

### Individual Apps

```bash
# Run only the API
cd apps/api
pnpm dev

# Run only the web app
cd apps/web
pnpm dev

# Build a single package
cd packages/shared-types
pnpm build
```

---

## Troubleshooting

### "Cannot find module '@maintix/shared-types'"

Run a full build to generate the compiled output:

```bash
pnpm build
```

### Database connection refused

Ensure Docker is running and the PostgreSQL container is up:

```bash
docker compose up -d
docker compose ps
```

### "JWT_SECRET must be at least 32 characters"

Generate a proper secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Port already in use

Check what's using the port and kill it:

```bash
# Check port 3001
netstat -ano | findstr :3001

# Or use a different port via env
PORT=3002 pnpm dev
```

### Prisma client out of date

Regenerate after schema changes:

```bash
pnpm db:generate
```

### Stale build artifacts

Clean and rebuild:

```bash
# Remove all dist/ and .next/ directories
npx turbo clean
pnpm build
```
