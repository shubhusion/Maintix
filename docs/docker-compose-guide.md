# 🐳 Docker Compose Files Explained

## 📋 Overview

Maintix has **two Docker Compose configurations** for different purposes:

| File | Purpose | Database | Use Case |
|------|---------|----------|----------|
| `docker-compose.yml` | Local development | PostgreSQL (local) | Development |
| `docker-compose.prod.yml` | Production deployment | Supabase (managed) | Production |

---

## 📁 File Comparison

### `docker-compose.yml` (Local Development)

**Purpose:** Local development with PostgreSQL container

**Services:**
- ✅ `postgres` - Local PostgreSQL database
- ⬜ `api` - Not included (run locally with `pnpm dev`)
- ⬜ `web` - Not included (run locally with `pnpm dev`)

**When to Use:**
- Local development
- Testing features
- Offline work
- Quick iterations

**Commands:**
```bash
# Start local database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs -f postgres
```

**Database Connection:**
```
Host: localhost
Port: 5432
Database: Maintix
User: postgres
Password: postgres
```

---

### `docker-compose.prod.yml` (Production)

**Purpose:** Full-stack production deployment with Supabase

**Services:**
- ✅ `api` - NestJS backend API
- ✅ `web` - Next.js frontend
- ⬜ `postgres` - Not included (uses Supabase)

**When to Use:**
- Production deployment
- Staging environment
- Team testing
- Cloud Run preparation

**Commands:**
```bash
# Deploy full stack
docker compose -f docker-compose.prod.yml up --build

# Deploy in background
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f api
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## 🔄 Workflow Comparison

### Local Development Workflow

```bash
# 1. Start local database
docker compose up -d

# 2. Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Maintix"
export JWT_SECRET="dev-secret-key-32-chars"

# 3. Run migrations
pnpm db:push
pnpm db:seed

# 4. Start development servers
pnpm dev

# 5. Code and test
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

---

### Production Deployment Workflow

```bash
# 1. Create Supabase account
https://supabase.com

# 2. Copy environment template
cp .env.supabase.example .env

# 3. Edit .env with Supabase credentials
# DATABASE_URL="postgresql://postgres.PROJECT:PASS@...supabase.com:6543/postgres?pgbouncer=true"
# JWT_SECRET="production-secret-32-chars"

# 4. Run migrations on Supabase
pnpm db:migrate:supabase

# 5. Deploy with Docker
docker compose -f docker-compose.prod.yml up --build

# 6. Access production app
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

---

## 🎯 When to Use Each

### Use `docker-compose.yml` When:

- ✅ Developing new features locally
- ✅ Testing database changes
- ✅ Working offline
- ✅ Quick iterations and debugging
- ✅ No internet connection
- ✅ Learning the codebase

### Use `docker-compose.prod.yml` When:

- ✅ Deploying to production
- ✅ Testing production configuration
- ✅ Team demo/staging environment
- ✅ Preparing for Cloud Run deployment
- ✅ Integration testing
- ✅ Performance testing

---

## 🔧 Environment Variables

### For `docker-compose.yml` (Local)

```env
# .env (local development)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Maintix"
JWT_SECRET="dev-secret-key-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
LOG_LEVEL=debug
```

### For `docker-compose.prod.yml` (Production)

```env
# .env (production with Supabase)
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="production-secret-key-min-32-characters"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="https://your-frontend.vercel.app"
NODE_ENV=production
LOG_LEVEL=info
SUPABASE_URL="https://PROJECT.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

---

## 📊 Architecture Comparison

### Local Development (`docker-compose.yml`)

```
┌─────────────────┐
│   Your Code     │
│  (pnpm dev)     │
└────────┬────────┘
         │
         │ localhost:5432
         │
┌────────▼────────┐
│   PostgreSQL    │
│   (Docker)      │
└─────────────────┘
```

### Production (`docker-compose.prod.yml`)

```
┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend API   │
│   (Docker)      │     │   (Docker)      │
└─────────────────┘     └────────┬────────┘
                                 │
                                 │ Internet
                                 │
                        ┌────────▼────────┐
                        │    Supabase     │
                        │  (Managed DB)   │
                        └─────────────────┘
```

---

## 🚨 Common Issues

### Issue: Wrong file used

**Solution:**
```bash
# For local development
docker compose up -d              # Uses docker-compose.yml

# For production
docker compose -f docker-compose.prod.yml up --build  # Uses docker-compose.prod.yml
```

---

### Issue: Database connection fails in production

**Solution:**
```bash
# Make sure you're using docker-compose.prod.yml
docker compose -f docker-compose.prod.yml up --build

# Check .env has Supabase URL
cat .env | grep DATABASE_URL

# Should show Supabase URL, not localhost
```

---

### Issue: Services not starting

**Solution:**
```bash
# Check which file you're using
docker compose config              # Validates docker-compose.yml
docker compose -f docker-compose.prod.yml config  # Validates prod file

# View logs
docker compose logs postgres       # Local
docker compose -f docker-compose.prod.yml logs api  # Production
```

---

## 💡 Best Practices

### 1. Keep Files Separate

```bash
# ✅ Good
docker compose up -d              # Local dev
docker compose -f docker-compose.prod.yml up --build  # Production

# ❌ Bad
docker compose -f docker-compose.yml up --build  # Confusing!
```

### 2. Use Different .env Files

```bash
# Local development
cp .env.supabase.example .env.local
# Edit for local PostgreSQL

# Production
cp .env.supabase.example .env.production
# Edit for Supabase
```

### 3. Never Commit .env

```bash
# Add to .gitignore
.env
.env.local
.env.production
!.env.supabase.example
```

### 4. Test Production Locally

```bash
# Before deploying to Cloud Run
docker compose -f docker-compose.prod.yml up --build

# Test locally at:
# Frontend: http://localhost:3000
# API: http://localhost:3001
```

---

## 📚 Related Documentation

| Document | Purpose |
|----------|---------|
| [Docker + Supabase Quick Start](./docker-supabase-quickstart.md) | Complete setup guide |
| [Supabase Setup](./setup-supabase.md) | Supabase configuration |
| [Cloud Run Deployment](./deploy-gcp.md) | Production deployment |
| [Environment Variables](./environment-variables.md) | Env vars reference |

---

## ✅ Quick Reference

### Local Development
```bash
docker compose up -d              # Start database
pnpm db:push                      # Run migrations
pnpm dev                          # Start app
```

### Production Deployment
```bash
cp .env.supabase.example .env     # Setup environment
pnpm db:migrate:supabase          # Run migrations
docker compose -f docker-compose.prod.yml up --build  # Deploy
```

### Cloud Run
```bash
.\deploy-gcp.ps1 -ProjectId "project"  # Windows
./deploy-gcp.sh project us-central1    # Linux/Mac
```

---

**Choose the right Docker Compose file for your use case! 🚀**
