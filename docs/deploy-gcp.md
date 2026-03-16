# 🚀 Deploy Backend to Google Cloud Run - Complete Guide

> **Database:** This guide uses **Supabase** (managed PostgreSQL).
> See [Setup Supabase](./setup-supabase.md) for database configuration.

---

## 📋 Prerequisites

1. **Google Cloud Account** - Sign up at https://console.cloud.google.com
   - New users get $300 free credit
   - Cloud Run has generous free tier (2M requests/month)

2. **Supabase Account** - Sign up at https://supabase.com
   - Free tier: 500MB database, unlimited API calls
   - No credit card required for free tier

3. **Install Google Cloud CLI**

   ```bash
   # Windows (Chocolatey)
   choco install google-cloud-cli

   # Or download from:
   # https://cloud.google.com/sdk/docs/install
   ```

4. **Login and Setup**
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com
   ```

---

## 🎯 Quick Deploy (10 Minutes)

### Option A: PowerShell Script (Windows)

```powershell
# Run deployment script
.\deploy-gcp.ps1 -ProjectId "your-project-id" -Region "us-central1"
```

### Option B: Bash Script (Linux/Mac)

```bash
# Make executable
chmod +x deploy-gcp.sh

# Run deployment
./deploy-gcp.sh your-project-id us-central1
```

### Option C: Manual Commands

```bash
# 1. Build and submit Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/maintix-api

# 2. Deploy to Cloud Run
gcloud run deploy maintix-api \
  --image gcr.io/YOUR_PROJECT_ID/maintix-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1

# 3. Get service URL
gcloud run services describe maintix-api \
  --platform managed \
  --region us-central1 \
  --format='value(status.url)'
```

---

## 🗄️ Setup Database (Supabase)

**Note:** Using Supabase instead of Cloud SQL simplifies deployment significantly!

### Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Choose organization and project name: `maintix`
4. Set database password (save it!)
5. Choose region closest to you

### Get Connection String

1. Go to **Settings** → **Database**
2. Click **Connection pool** tab
3. Enable connection pooling (important for Cloud Run!)
4. Copy the **URI** connection string:
   ```
   postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

Full guide: [Setup Supabase](./setup-supabase.md)

### Add to Cloud Run

```bash
gcloud run services update maintix-api \
  --set-env-vars="DATABASE_URL=postgresql://postgres.PROJECT:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**No Cloud SQL needed!** Supabase handles everything. 🎉

---

## 🔧 Run Migrations

```bash
# From project root
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Push schema (for demo/competition)
pnpm prisma db push

# Seed demo data
pnpm prisma db seed
```

---

## ✅ Verify Deployment

### Test Health Endpoint

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe maintix-api \
  --platform managed \
  --region us-central1 \
  --format='value(status.url)')

# Test health
curl $SERVICE_URL/health

# Test API
curl $SERVICE_URL/api/v1/health

# Should return:
# {"status":"ok","timestamp":"2026-..."}
```

### Check Logs

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=maintix-api" \
  --limit=20 \
  --format="table(timestamp,textPayload)"
```

---

## 🌐 Update Frontend

Update `apps/web/.env` or set in Vercel/Netlify:

```env
NEXT_PUBLIC_API_URL=https://maintix-api-xxxxxx-uc.a.run.app
```

Or add to Cloud Run as CORS origin:

```bash
gcloud run services update maintix-api \
  --set-env-vars="CORS_ORIGIN=https://your-frontend.vercel.app"
```

---

## 🔐 Environment Variables

### Required Variables

| Variable         | Description           | Example            |
| ---------------- | --------------------- | ------------------ |
| `DATABASE_URL`   | PostgreSQL connection | `postgresql://...` |
| `JWT_SECRET`     | JWT signing key       | `your-secret-key`  |
| `JWT_EXPIRES_IN` | Token expiry          | `7d`               |
| `PORT`           | Server port           | `3001`             |

### Optional Variables

| Variable      | Description         | Default      |
| ------------- | ------------------- | ------------ |
| `CORS_ORIGIN` | Allowed CORS origin | `*`          |
| `NODE_ENV`    | Environment         | `production` |
| `LOG_LEVEL`   | Logging level       | `info`       |

### Set Variables

```bash
# Via CLI
gcloud run services update maintix-api \
  --set-env-vars="JWT_SECRET=your-secret-key,JWT_EXPIRES_IN=7d"

# Or via Console:
# 1. Cloud Run → maintix-api
# 2. Edit & Deploy New Revision
# 3. Variables & Secrets section
```

---

## 💰 Cost Breakdown

### Cloud Run (Backend)

| Resource  | Free Tier     | Your Usage | Cost            |
| --------- | ------------- | ---------- | --------------- |
| Requests  | 2M/month      | ~100K      | $0 ✅           |
| CPU time  | 180K vCPU-sec | ~10K       | $0 ✅           |
| Memory    | 360K GiB-sec  | ~20K       | $0 ✅           |
| **Total** |               |            | **$0/month** ✅ |

### Supabase (Database)

| Plan     | Database | Bandwidth | Price     |
| -------- | -------- | --------- | --------- |
| **Free** | 500 MB   | Unlimited | $0 ✅     |
| **Pro**  | 8 GB     | Unlimited | $25/month |

**For Competition:** Free tier is perfect! (500MB = ~50,000+ tickets)

### Total Monthly Cost

- **Cloud Run:** $0 (free tier)
- **Supabase:** $0 (free tier)
- **Total:** **$0/month** 🎉

Perfect for competition demos!

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Real-time logs
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=maintix-api"

# Last 50 errors
gcloud logging read "resource.type=cloud_run_revision severity>=ERROR" \
  --limit=50 \
  --format="table(timestamp,textPayload)"
```

### Check Service Status

```bash
# Service details
gcloud run services describe maintix-api \
  --platform managed \
  --region us-central1

# List revisions
gcloud run revisions list \
  --service maintix-api \
  --platform managed \
  --region us-central1
```

### Set Up Alerts

```bash
# Create alert policy for errors
cat > alert-policy.json << EOF
{
  "displayName": "Maintix API Errors",
  "conditions": [
    {
      "displayName": "Error rate > 5%",
      "conditionThreshold": {
        "filter": "resource.type=cloud_run_revision AND resource.labels.service_name=maintix-api severity>=ERROR",
        "comparison": "COMPARISON_GT",
        "thresholdValue": 5
      }
    }
  ],
  "notificationChannels": ["YOUR_CHANNEL_ID"]
}
EOF

gcloud alpha monitoring policies create --policy-from-file=alert-policy.json
```

---

## 🚨 Troubleshooting

### Issue: Build Fails

```bash
# Check Dockerfile
cat apps/api/Dockerfile

# Test build locally
docker build -f apps/api/Dockerfile -t test-api .

# Check logs
gcloud builds list --limit=5
gcloud builds log BUILD_ID
```

### Issue: Service Won't Start

```bash
# Check logs
gcloud logging read "resource.labels.service_name=maintix-api" \
  --limit=50

# Common issues:
# 1. DATABASE_URL not set
# 2. Prisma client not generated
# 3. Port not matching (should be 3001)
```

### Issue: Database Connection Fails

```bash
# Verify Cloud SQL instance
gcloud sql instances describe maintix-db

# Check connection string format
# Should be: postgresql://user:pass@/db?host=/cloudsql/PROJECT:REGION:INSTANCE

# Test connection locally
psql "postgresql://user:pass@/db?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

### Issue: CORS Errors

```bash
# Update CORS settings in API
gcloud run services update maintix-api \
  --set-env-vars="CORS_ORIGIN=https://your-frontend.vercel.app"

# Or allow all for demo (not recommended for production)
gcloud run services update maintix-api \
  --set-env-vars="CORS_ORIGIN=*"
```

---

## 🎯 Competition Checklist

- [ ] Cloud Run service deployed
- [ ] Cloud SQL instance created
- [ ] Database migrations run
- [ ] Demo data seeded
- [ ] Environment variables set
- [ ] Health endpoint responds
- [ ] Frontend connected to backend
- [ ] All 3 roles can login
- [ ] Ticket creation works
- [ ] Assignment workflow works
- [ ] Activity log shows updates
- [ ] Mobile responsive tested
- [ ] Deployment URL in README

---

## 📚 Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud SQL for PostgreSQL](https://cloud.google.com/sql/docs/postgres)
- [Pricing Calculator](https://cloud.google.com/products/calculator)
- [Free Tier Details](https://cloud.google.com/free)

---

## 🏆 Competition Tips

1. **Use Free Tier:** db-f1-micro + Cloud Run free tier = ~$8/month
2. **Deploy Early:** Test deployment before competition deadline
3. **Set Up Monitoring:** Know if service goes down
4. **Document URLs:** Add live URLs to README
5. **Test All Flows:** Verify all roles work on deployed version
6. **Backup Database:** Enable automated backups
7. **Use Environment Variables:** Never commit secrets

---

**Good luck with your competition! 🚀**
