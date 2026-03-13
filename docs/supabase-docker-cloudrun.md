# 🗄️ Supabase + Docker + Cloud Run Setup

## 🎯 Complete Setup Guide

This guide shows you how to configure your Maintix backend to use **Supabase** as the database when deploying to **Google Cloud Run** with **Docker**.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Supabase Setup](#supabase-setup)
3. [Docker Configuration](#docker-configuration)
4. [Cloud Run Deployment](#cloud-run-deployment)
5. [Environment Variables](#environment-variables)
6. [Running Migrations](#running-migrations)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Create Supabase account
https://supabase.com

# 2. Create project and get connection string
Settings → Database → Connection pool → Copy URI

# 3. Set environment variable
export DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 4. Run migrations
pnpm db:migrate:supabase

# 5. Deploy to Cloud Run
.\deploy-gcp.ps1 -ProjectId "your-project"

# Done! ✅
```

---

## 🗄️ Supabase Setup

### Step 1: Create Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Choose organization
4. Project name: `maintix`
5. Database password: **Save this!**
6. Region: Choose closest to users (e.g., `us-central-1`)

Wait 2-3 minutes for provisioning.

### Step 2: Get Connection String

**Important:** Use **Connection Pool** for Cloud Run!

1. Go to **Settings** → **Database**
2. Click **Connection pool** tab
3. Enable connection pooling (Transaction mode)
4. Copy **URI** connection string

It should look like:
```
postgresql://postgres.maintix:[YOUR-PASSWORD]@aws-0-us-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 3: Test Connection

```bash
# Set environment variable
export DATABASE_URL="your-connection-string"

# Test with psql (optional)
psql $DATABASE_URL

# Or with Prisma
pnpm prisma db pull
```

---

## 🐳 Docker Configuration

### Dockerfile (Already Configured)

The `apps/api/Dockerfile` is already optimized for Supabase:

```dockerfile
# Generates Prisma client for Supabase
RUN cd packages/database && pnpm prisma generate

# Copies Prisma schema
COPY packages/database/prisma ./prisma

# Optimized for Supabase connection pooling
ENV PGPOOL_MAX_CLIENT=100
ENV PGPOOL_RESERVE_POOL_SIZE=10
```

### Build Docker Image

```bash
# From project root
gcloud builds submit --tag gcr.io/YOUR_PROJECT/maintix-api
```

The Docker build will:
1. ✅ Install all dependencies
2. ✅ Generate Prisma client
3. ✅ Build the API
4. ✅ Create production image with Supabase support

---

## ☁️ Cloud Run Deployment

### Deploy with Supabase

```bash
# 1. Set DATABASE_URL
export DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# 2. Deploy to Cloud Run
gcloud run deploy maintix-api \
  --image gcr.io/YOUR_PROJECT/maintix-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars="JWT_SECRET=your-secret-key"
```

### Or Use Deployment Script

```powershell
# Windows
.\deploy-gcp.ps1 -ProjectId "your-project"

# Then set environment variables in Cloud Console
```

---

## 🔑 Environment Variables

### Required Variables

```env
# Supabase Connection (Connection Pool)
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# JWT Configuration
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=production
```

### Optional Variables

```env
# CORS (for frontend)
CORS_ORIGIN="https://your-frontend.vercel.app"

# Logging
LOG_LEVEL=info

# File Upload (if using Supabase Storage)
SUPABASE_URL="https://[PROJECT].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
```

### Set in Cloud Run

```bash
# Via CLI
gcloud run services update maintix-api \
  --set-env-vars="DATABASE_URL=your-url,JWT_SECRET=your-secret"

# Or via Console:
# Cloud Run → maintix-api → Edit & Deploy → Variables & Secrets
```

---

## 🔄 Running Migrations

### Option 1: Local Migration (Recommended)

```bash
# Set DATABASE_URL
export DATABASE_URL="your-supabase-url"

# Run migrations
pnpm db:migrate:supabase

# Or manually
cd packages/database
pnpm prisma generate
pnpm prisma db push
pnpm prisma db seed
```

### Option 2: Cloud Build Migration

Create `cloudbuild-migrate.yaml`:

```yaml
steps:
  - name: node:20-alpine
    entrypoint: sh
    args:
      - -c
      - |
        corepack enable
        corepack prepare pnpm@latest --activate
        pnpm install --frozen-lockfile
        cd packages/database
        pnpm prisma generate
        pnpm prisma db push
        pnpm prisma db seed
    env:
      - 'DATABASE_URL=${_DATABASE_URL}'
```

Run:
```bash
gcloud builds submit --config=cloudbuild-migrate.yaml --substitutions=_DATABASE_URL="your-url"
```

### Option 3: One-Click Migration Button

Add to your README:

```markdown
## Deploy Database Migrations

[![Run Migrations](https://storage.googleapis.com/cloud-run-button.svg)](https://console.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https://github.com/your-org/Maintix&cloudshell_workspace=.&open_in_editor=cloudbuild-migrate.yaml)
```

---

## 🔍 Verification

### Test Connection

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe maintix-api \
  --region us-central1 \
  --format='value(status.url)')

# Test health endpoint
curl $SERVICE_URL/health

# Should return:
# {"status":"ok","timestamp":"2026-..."}
```

### Check Database

```bash
# Connect to Supabase
psql "your-database-url"

# Check tables
\dt

# Check data
SELECT * FROM users LIMIT 5;
```

### View Logs

```bash
# Real-time logs
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=maintix-api"

# Last 50 errors
gcloud logging read "resource.type=cloud_run_revision severity>=ERROR" \
  --limit=50
```

---

## 🚨 Troubleshooting

### Issue: Connection Timeout

**Solution:** Use connection pooling (PgBouncer)

```env
# Make sure you're using port 6543 and pgbouncer=true
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

### Issue: Prisma Client Not Generated

**Solution:** Generate in Dockerfile

```dockerfile
RUN cd packages/database && pnpm prisma generate
```

---

### Issue: Migration Fails

**Solution:** Use `db push` instead of `migrate` for Supabase

```bash
# Instead of prisma migrate deploy
pnpm prisma db push --accept-data-loss
```

---

### Issue: Too Many Connections

**Solution:** Reduce concurrency in Cloud Run

```bash
gcloud run services update maintix-api \
  --concurrency=40 \
  --max-instances=5
```

---

### Issue: SSL Error

**Solution:** Add sslmode to connection string

```env
DATABASE_URL="postgresql://...?sslmode=require&pgbouncer=true"
```

---

## 💰 Cost Optimization

### Supabase Free Tier

- ✅ 500MB database (~50,000+ tickets)
- ✅ Unlimited API calls
- ✅ 50,000 monthly active users
- ✅ Community support

### Cloud Run Free Tier

- ✅ 2M requests/month
- ✅ 180,000 vCPU-seconds/month
- ✅ 360,000 GiB-seconds memory/month

**Total Cost: $0/month** for competition demo! 🎉

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/database/connectors/orm/prisma)
- [Connection Pooling](https://supabase.com/docs/guides/database/connection-pooling)
- [Cloud Run Docs](https://cloud.google.com/run/docs)

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Connection string copied (with pooling)
- [ ] DATABASE_URL set in environment
- [ ] Prisma client generated
- [ ] Migrations run successfully
- [ ] Demo data seeded
- [ ] Docker image built
- [ ] Deployed to Cloud Run
- [ ] Health endpoint responds
- [ ] All roles can login
- [ ] Ticket workflow works

---

**Your backend is now fully configured for Supabase + Docker + Cloud Run! 🚀**
