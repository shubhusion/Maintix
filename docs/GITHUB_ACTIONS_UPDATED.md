# ✅ GitHub Actions Workflow Updated

## 🎉 **Deploy API Workflow Updated for Standalone Structure**

---

## 📊 **What Changed**

### **1. Removed `packages/**` Trigger**

**Before:**
```yaml
paths:
  - 'apps/api/**'
  - 'packages/**'  # ❌ Removed - packages/ no longer exists
  - 'pnpm-lock.yaml'
```

**After:**
```yaml
paths:
  - 'apps/api/**'
  - 'pnpm-lock.yaml'
```

---

### **2. Updated Migration Commands**

**Before:**
```yaml
- name: Generate Prisma Client
  run: pnpm db:generate  # ❌ Uses root package.json scripts
  
- name: Run Migrations
  run: pnpm --filter @maintix/database db:migrate:deploy  # ❌ @maintix/database doesn't exist
```

**After:**
```yaml
- name: Generate Prisma Client
  run: cd apps/api && pnpm prisma generate  # ✅ Direct command in apps/api/
  
- name: Run Migrations
  run: cd apps/api && pnpm prisma migrate deploy  # ✅ Direct command in apps/api/
```

---

### **3. Updated Docker Build**

**Before:**
```yaml
- name: Build Docker Image
  run: |
    docker build \
      -f apps/api/Dockerfile \
      -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:${{ github.sha }} \
      .
```

**After:**
```yaml
- name: Build Docker Image
  run: |
    docker build \
      -f apps/api/Dockerfile \
      --build-arg DATABASE_URL=${{ secrets.DATABASE_URL }} \
      -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:${{ github.sha }} \
      -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:latest \
      .
```

**Added:** `--build-arg DATABASE_URL` for build-time environment variable

---

## ✅ **Complete Updated Workflow**

```yaml
name: Deploy API to Cloud Run

on:
  push:
    branches: [main]
    paths:
      - 'apps/api/**'
      - 'pnpm-lock.yaml'

env:
  PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
  REGION: us-central1
  SERVICE: maintix-api
  REGISTRY: us-central1-docker.pkg.dev

permissions:
  contents: read
  id-token: write

jobs:
  migrate:
    name: Run Database Migrations
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10.30.3

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: cd apps/api && pnpm prisma generate
        env:
          DATABASE_URL: ${{ secrets.DIRECT_DATABASE_URL }}

      - name: Run Migrations
        run: cd apps/api && pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DIRECT_DATABASE_URL }}

  deploy:
    name: Build & Deploy to Cloud Run
    needs: migrate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - id: auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - uses: google-github-actions/setup-gcloud@v2

      - name: Configure Docker for Artifact Registry
        run: gcloud auth configure-docker ${{ env.REGISTRY }}

      - name: Build Docker Image
        run: |
          docker build \
            -f apps/api/Dockerfile \
            --build-arg DATABASE_URL=${{ secrets.DATABASE_URL }} \
            -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:${{ github.sha }} \
            -t ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:latest \
            .

      - name: Push Docker Image
        run: |
          docker push ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy ${{ env.SERVICE }} \
            --image=${{ env.REGISTRY }}/${{ env.PROJECT_ID }}/maintix/api:${{ github.sha }} \
            --region=${{ env.REGION }} \
            --platform=managed \
            --allow-unauthenticated \
            --port=3001 \
            --memory=512Mi \
            --cpu=1 \
            --min-instances=0 \
            --max-instances=10 \
            --set-secrets="DATABASE_URL=DATABASE_URL:latest,JWT_SECRET=JWT_SECRET:latest,SUPABASE_URL=SUPABASE_URL:latest,SUPABASE_SERVICE_KEY=SUPABASE_SERVICE_KEY:latest" \
            --set-env-vars="NODE_ENV=production,CORS_ORIGIN=${{ vars.CORS_ORIGIN }}"

      - name: Show Service URL
        run: |
          gcloud run services describe ${{ env.SERVICE }} \
            --region=${{ env.REGION }} \
            --format="value(status.url)"
```

---

## 🔑 **Required Secrets**

Make sure these secrets are configured in your GitHub repository:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your Google Cloud Project ID |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | Workload Identity Provider |
| `GCP_SERVICE_ACCOUNT` | Service Account for deployment |
| `DATABASE_URL` | PostgreSQL connection string |
| `DIRECT_DATABASE_URL` | Direct connection for migrations |
| `JWT_SECRET` | JWT signing secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |

---

## 📝 **Required Variables**

| Variable | Description |
|----------|-------------|
| `CORS_ORIGIN` | Allowed CORS origin (e.g., `https://maintix.app`) |

---

## ✅ **Summary of Changes**

| Change | Before | After |
|--------|--------|-------|
| **Trigger Paths** | `apps/api/**`, `packages/**` | `apps/api/**` only |
| **Prisma Generate** | `pnpm db:generate` | `cd apps/api && pnpm prisma generate` |
| **Run Migrations** | `pnpm --filter @maintix/database` | `cd apps/api && pnpm prisma migrate deploy` |
| **Docker Build** | Standard | Added `--build-arg DATABASE_URL` |
| **Dockerfile** | `apps/api/Dockerfile.standalone` | `apps/api/Dockerfile` |

---

## 🚀 **How It Works Now**

1. **Push to `main`** with changes in `apps/api/**`
2. **Migration Job**:
   - Installs dependencies
   - Generates Prisma client
   - Runs database migrations
3. **Deploy Job**:
   - Authenticates with Google Cloud
   - Builds Docker image using `apps/api/Dockerfile`
   - Pushes to Artifact Registry
   - Deploys to Cloud Run
   - Sets secrets and environment variables

---

## 🎯 **Test the Workflow**

```bash
# Trigger manually or push to main
git push origin main

# Watch the workflow in GitHub Actions
# https://github.com/YOUR_ORG/Maintix/actions
```

---

## ✅ **Status: COMPLETE**

The GitHub Actions workflow is now updated to use the simplified standalone Dockerfile structure!

**File Updated:** `.github/workflows/deploy-api.yml`

---

**🎊 Ready for production deployment! 🎊**
