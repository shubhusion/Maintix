# Deployment Guide

> Complete guide for deploying Maintix to production — **Vercel** (frontend) + **Google Cloud Run** (backend API).

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Backend — Google Cloud Run](#backend--google-cloud-run)
- [Frontend — Vercel](#frontend--vercel)
- [Frontend — Docker (Alternative)](#frontend--docker-alternative)
- [Database Migrations](#database-migrations)
- [CI/CD — GitHub Actions](#cicd--github-actions)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

---

## Overview

| Component             | Platform         | URL Pattern                          |
| --------------------- | ---------------- | ------------------------------------ |
| Frontend (Next.js)    | Vercel           | `https://<project>.vercel.app`       |
| Backend API (NestJS)  | Google Cloud Run | `https://maintix-api-<hash>.run.app` |
| Database (PostgreSQL) | Supabase         | Managed — no deployment needed       |
| File Storage          | Supabase Storage | Managed — no deployment needed       |

**Build order** (handled by Turborepo):

```
@maintix/shared-types  →  @maintix/database  →  @maintix/api + @maintix/web
       (tsc)              (prisma generate)       (nest build)   (next build)
```

---

## Architecture

```
┌─────────────────────┐        ┌───────────────────────┐
│                     │  HTTPS │                       │
│   Vercel (Web)      │───────▶│  Cloud Run (API)      │
│   Next.js CSR       │        │  NestJS + Prisma      │
│   Port: auto        │        │  Port: from $PORT env │
│                     │        │  Prefix: /api/v1      │
└─────────────────────┘        └───────────┬───────────┘
                                           │
                                           │ PostgreSQL
                                           ▼
                               ┌───────────────────────┐
                               │  Supabase              │
                               │  DB (pooled:6543)      │
                               │  Storage (S3-compat)   │
                               └───────────────────────┘
```

- Frontend is **fully client-side rendered** (no SSR data fetching). API calls use `NEXT_PUBLIC_API_URL` baked in at build time.
- Backend listens on `0.0.0.0:$PORT` — Cloud Run injects `PORT` automatically.
- CORS is configured via `CORS_ORIGIN` env var — must point to the Vercel domain.

---

## Prerequisites

| Requirement              | Minimum Version | Check Command                   |
| ------------------------ | --------------- | ------------------------------- |
| Node.js                  | `>= 20.0.0`     | `node --version`                |
| pnpm                     | `10.30.3`       | `pnpm --version`                |
| Google Cloud CLI         | Latest          | `gcloud --version`              |
| Docker                   | Latest          | `docker --version`              |
| Vercel CLI (optional)    | Latest          | `vercel --version`              |
| Supabase project         | —               | Dashboard: `app.supabase.com`   |
| GCP project with billing | —               | `gcloud projects describe <ID>` |

---

## Environment Variables

### Backend (API) — Runtime

| Variable               | Required       | Default                 | Description                                              |
| ---------------------- | -------------- | ----------------------- | -------------------------------------------------------- |
| `DATABASE_URL`         | **Yes**        | —                       | Supabase pooled PostgreSQL connection string (port 6543) |
| `DIRECT_DATABASE_URL`  | For migrations | —                       | Supabase direct PostgreSQL connection string (port 5432) |
| `JWT_SECRET`           | **Yes**        | —                       | Minimum 32 characters. Used for signing auth tokens      |
| `JWT_EXPIRATION`       | No             | `24h`                   | Token expiration duration (e.g. `24h`, `7d`)             |
| `SUPABASE_URL`         | **Yes**        | —                       | Supabase project URL (e.g. `https://xxx.supabase.co`)    |
| `SUPABASE_SERVICE_KEY` | **Yes**        | —                       | Supabase service role key (for Storage uploads)          |
| `CORS_ORIGIN`          | No             | `http://localhost:3000` | **Set to your Vercel domain** in production              |
| `PORT`                 | No             | `3001`                  | Cloud Run injects this automatically — do not hardcode   |

> **Important**: `DATABASE_URL`, `JWT_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_KEY` are validated at startup via Joi. The API will refuse to start if any are missing or invalid.

### Frontend (Web) — Build Time

| Variable              | Required | Default                        | Description                                        |
| --------------------- | -------- | ------------------------------ | -------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | No       | `http://localhost:3001/api/v1` | **Set to Cloud Run URL + `/api/v1`** in production |

> **Note**: `NEXT_PUBLIC_` variables are embedded at build time, not runtime. Any change requires a rebuild.

### Seed (Optional)

| Variable                  | Default                 | Description                 |
| ------------------------- | ----------------------- | --------------------------- |
| `SEED_MANAGER_EMAIL`      | `admin@Maintix.com`     | Initial admin user email    |
| `SEED_MANAGER_PASSWORD`   | `ChangeThisPassword123` | Initial admin user password |
| `SEED_MANAGER_FIRST_NAME` | `Admin`                 | Admin first name            |
| `SEED_MANAGER_LAST_NAME`  | `Manager`               | Admin last name             |

---

## Backend — Google Cloud Run

### 1. Enable GCP APIs

```bash
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>

gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 2. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create maintix \
  --repository-format=docker \
  --location=us-central1 \
  --description="Maintix Docker images"
```

### 3. Store Secrets in GCP Secret Manager

```bash
echo -n "postgresql://..." | gcloud secrets create DATABASE_URL --data-file=-
echo -n "your-jwt-secret-min-32-chars-long" | gcloud secrets create JWT_SECRET --data-file=-
echo -n "https://xxx.supabase.co" | gcloud secrets create SUPABASE_URL --data-file=-
echo -n "your-supabase-service-key" | gcloud secrets create SUPABASE_SERVICE_KEY --data-file=-
```

### 4. Dockerfile

The backend Dockerfile is located at `apps/api/Dockerfile`. It uses a **multi-stage build**:

| Stage     | Base             | Purpose                                             |
| --------- | ---------------- | --------------------------------------------------- |
| `deps`    | `node:20-alpine` | Install pnpm workspace dependencies                 |
| `builder` | `node:20-alpine` | Build shared-types → generate Prisma → build NestJS |
| `runner`  | `node:20-alpine` | Minimal production image with compiled output       |

Key details:

- Uses a **dummy `DATABASE_URL`** during `prisma generate` — no real DB connection needed at build time
- Runs as non-root `nestjs` user
- Final image contains only `dist/`, Prisma client, and `node_modules`

### 5. Build and Push (Manual)

```bash
# Authenticate Docker to Artifact Registry
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build from repo root (context must be root for monorepo)
docker build -f apps/api/Dockerfile \
  -t us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/api:latest .

# Push
docker push us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/api:latest
```

### 6. Deploy to Cloud Run (Manual)

```bash
gcloud run deploy maintix-api \
  --image=us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/api:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=3001 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY:latest" \
  --set-env-vars="CORS_ORIGIN=https://<your-project>.vercel.app,NODE_ENV=production"
```

After deployment, note the **Service URL** from the output — you'll need it for the frontend `NEXT_PUBLIC_API_URL`.

---

## Frontend — Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import the `shubhusion/Maintix` GitHub repo.
2. Configure the project:

| Setting          | Value                                                |
| ---------------- | ---------------------------------------------------- |
| Framework Preset | Next.js                                              |
| Root Directory   | `apps/web`                                           |
| Build Command    | `cd ../.. && pnpm turbo build --filter=@maintix/web` |
| Install Command  | `pnpm install`                                       |
| Output Directory | (leave default)                                      |

3. Add environment variable:

| Name                  | Value                                       |
| --------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | `https://maintix-api-<hash>.run.app/api/v1` |

4. Click **Deploy**.

> Vercel automatically deploys **preview builds** for every PR and **production builds** on push to `main`.

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# From repo root
vercel link
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://maintix-api-<hash>.run.app/api/v1

vercel deploy --prod
```

### Vercel Configuration (Optional)

Create a `vercel.json` at the repo root if you need security headers:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

---

## Frontend — Docker (Alternative)

If you need to deploy the frontend outside of Vercel (e.g. Cloud Run, AWS ECS, self-hosted), a Dockerfile is available at `apps/web/Dockerfile`.

This Dockerfile uses Next.js **standalone output mode** (configured via `output: 'standalone'` in `next.config.ts`).

### Build & Run

```bash
# Build from repo root — pass the API URL as a build argument
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://maintix-api-<hash>.run.app/api/v1 \
  -t maintix-web .

# Run locally
docker run -p 3000:3000 maintix-web
```

### Deploy to Cloud Run (Optional)

```bash
# Push to Artifact Registry
docker tag maintix-web us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/web:latest
docker push us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/web:latest

# Deploy
gcloud run deploy maintix-web \
  --image=us-central1-docker.pkg.dev/<PROJECT_ID>/maintix/web:latest \
  --region=us-central1 \
  --platform=managed \
  --allow-unauthenticated \
  --port=3000 \
  --memory=256Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=5
```

> **Note**: When using Docker for the frontend, `NEXT_PUBLIC_API_URL` is baked in at **build time** via the `--build-arg` flag. To change the API URL, you must rebuild the image.

---

## Database Migrations

Migrations should run **before** a new API version is deployed — never inside the container startup.

### Manual Migration

```bash
# From repo root, with .env configured with DIRECT_DATABASE_URL
pnpm db:migrate        # Dev: generates + applies migration
```

```bash
# Production: applies pending migrations only (safe, no generation)
pnpm --filter @maintix/database db:migrate:deploy
```

### Automated Migration (in CI/CD)

The GitHub Actions workflow (`.github/workflows/deploy-api.yml`) runs `prisma migrate deploy` using `DIRECT_DATABASE_URL` **before** deploying the new container. This ensures:

- Schema changes are applied before new code expects them
- No race condition with multiple container instances
- Failed migrations block the deploy

> **Critical**: Always use `DIRECT_DATABASE_URL` (port 5432, direct connection) for migrations — not the pooled connection. Prisma migrations require a direct connection.

### Seeding Production

```bash
# One-time: seed the initial admin user
DATABASE_URL="<production-pooled-url>" pnpm db:seed
```

> Seed is idempotent — safe to run multiple times. Uses `upsert` and `findFirst` checks.

---

## CI/CD — GitHub Actions

### Workflow: Deploy API (`.github/workflows/deploy-api.yml`)

**Trigger**: Push to `main` with changes in `apps/api/`, `packages/`, or `pnpm-lock.yaml`.

| Job       | Steps                                                                        | Purpose                     |
| --------- | ---------------------------------------------------------------------------- | --------------------------- |
| `migrate` | Install deps → Generate Prisma → Run `prisma migrate deploy`                 | Apply pending DB migrations |
| `deploy`  | Auth to GCP → Build Docker → Push to Artifact Registry → Deploy to Cloud Run | Ship new API version        |

The `deploy` job depends on `migrate` — if migrations fail, deployment is blocked.

### Setup: Workload Identity Federation

Keyless authentication between GitHub Actions and GCP — more secure than service account JSON keys.

```bash
# 1. Create a Workload Identity Pool
gcloud iam workload-identity-pools create "github-pool" \
  --location="global" \
  --display-name="GitHub Actions Pool"

# 2. Create an OIDC Provider
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --location="global" \
  --workload-identity-pool="github-pool" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"

# 3. Create a Service Account
gcloud iam service-accounts create github-actions-sa \
  --display-name="GitHub Actions Service Account"

# 4. Grant Roles
SA_EMAIL="github-actions-sa@<PROJECT_ID>.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:$SA_EMAIL" --role="roles/run.admin"
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:$SA_EMAIL" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:$SA_EMAIL" --role="roles/iam.serviceAccountUser"
gcloud projects add-iam-policy-binding <PROJECT_ID> \
  --member="serviceAccount:$SA_EMAIL" --role="roles/secretmanager.secretAccessor"

# 5. Allow GitHub to impersonate the SA
gcloud iam service-accounts add-iam-policy-binding $SA_EMAIL \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/attribute.repository/shubhusion/Maintix"
```

### GitHub Repository Secrets

Add these in **GitHub → Settings → Secrets and variables → Actions**:

| Secret                           | Value                                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| `GCP_PROJECT_ID`                 | Your GCP project ID                                                                              |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/<NUMBER>/locations/global/workloadIdentityPools/github-pool/providers/github-provider` |
| `GCP_SERVICE_ACCOUNT`            | `github-actions-sa@<PROJECT_ID>.iam.gserviceaccount.com`                                         |
| `DIRECT_DATABASE_URL`            | Supabase direct connection string (port 5432)                                                    |

### GitHub Repository Variables

Add in **GitHub → Settings → Secrets and variables → Actions → Variables**:

| Variable      | Value                               |
| ------------- | ----------------------------------- |
| `CORS_ORIGIN` | `https://<your-project>.vercel.app` |

---

## Post-Deployment Verification

### Backend Health Check

```bash
# Should return: {"data":{"status":"ok","database":"connected"}}
curl https://maintix-api-<hash>.run.app/api/v1/health
```

### Swagger Documentation

Open in browser: `https://maintix-api-<hash>.run.app/api/docs`

### Frontend Smoke Test

1. Visit `https://<project>.vercel.app`
2. Open browser DevTools → Network tab
3. Confirm API requests go to the Cloud Run URL
4. Test login flow with seeded admin credentials

### CORS Verification

If you see CORS errors in the browser console:

```bash
# Update CORS_ORIGIN on Cloud Run
gcloud run services update maintix-api \
  --region=us-central1 \
  --set-env-vars="CORS_ORIGIN=https://<exact-vercel-domain>"
```

### Migration Status

```bash
DATABASE_URL="<direct-url>" npx prisma migrate status \
  --schema=packages/database/prisma/schema.prisma
```

---

## Troubleshooting

### Backend won't start on Cloud Run

| Symptom                                 | Cause                     | Fix                                                       |
| --------------------------------------- | ------------------------- | --------------------------------------------------------- |
| Container fails to start                | Missing required env vars | Check Secret Manager — all 4 required secrets must be set |
| `Port not listening` error              | PORT mismatch             | Ensure `--port=3001` is set in the deploy command         |
| Prisma connection error                 | Wrong `DATABASE_URL`      | Use **pooled** URL (port 6543) for runtime                |
| Health returns `database: disconnected` | DB unreachable            | Verify Supabase project is active                         |

### Frontend can't reach the API

| Symptom               | Cause                       | Fix                                               |
| --------------------- | --------------------------- | ------------------------------------------------- |
| CORS error in console | `CORS_ORIGIN` mismatch      | Update to exact Vercel URL (including `https://`) |
| 404 on API calls      | Wrong `NEXT_PUBLIC_API_URL` | Must include `/api/v1` suffix. Redeploy frontend  |
| Network error         | Cloud Run cold start        | Set `--min-instances=1` (increases cost)          |

### Migrations fail in CI

| Symptom            | Cause              | Fix                                           |
| ------------------ | ------------------ | --------------------------------------------- |
| Connection refused | Wrong URL          | Use `DIRECT_DATABASE_URL` (port 5432)         |
| Permission denied  | Wrong credentials  | Verify Supabase `postgres` user credentials   |
| Migration drift    | Schema out of sync | Run `prisma migrate diff` locally to diagnose |

### View Logs

```bash
# Cloud Run logs
gcloud run services logs read maintix-api --region=us-central1 --limit=50

# Build logs
gcloud builds list --limit=5
```

---

## Cost Optimization

| Resource          | Free Tier                            | Recommendation                     |
| ----------------- | ------------------------------------ | ---------------------------------- |
| Cloud Run         | 2M requests/month, 360K vCPU-seconds | `min-instances=0` to scale to zero |
| Artifact Registry | 500MB storage                        | Clean up old images periodically   |
| Secret Manager    | 6 active versions free               | Use `:latest` version references   |
| Vercel (Hobby)    | 100GB bandwidth, 6000 min build      | Sufficient for MVP                 |
| Supabase (Free)   | 500MB DB, 1GB storage                | Sufficient for MVP                 |

---

## Related Documentation

- [Architecture](./architecture.md) — Monorepo structure and design patterns
- [Getting Started](./getting-started.md) — Local development setup
- [Database Schema](./database.md) — Models, relationships, migrations
- [API Reference](./api-reference.md) — REST endpoints and authentication
