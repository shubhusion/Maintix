# ☁️ Google Cloud Deployment Guide

## 🚀 Quick Deploy (10 Minutes)

### Prerequisites
1. **Google Cloud Account** - https://console.cloud.google.com ($300 free credit)
2. **Supabase Account** - https://supabase.com (Free tier: 500MB database)

### Windows (PowerShell)
```powershell
.\deploy-gcp.ps1 -ProjectId "your-project" -Region "us-central1"
```

### Linux/Mac (Bash)
```bash
chmod +x deploy-gcp.sh
./deploy-gcp.sh your-project us-central1
```

---

## 🗄️ Database Setup (Supabase)

**Much easier than Cloud SQL!**

1. Go to https://supabase.com
2. Create project: `maintix`
3. Save database password
4. Go to Settings → Database → Connection pool
5. Enable pooling and copy connection string
6. Add to Cloud Run:

```bash
gcloud run services update maintix-api \
  --set-env-vars="DATABASE_URL=postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Full guide:** [docs/setup-supabase.md](./docs/setup-supabase.md)

---

## 📋 Complete Guide

See [docs/deploy-gcp.md](./docs/deploy-gcp.md) for:
- ✅ Prerequisites setup
- ✅ Supabase configuration
- ✅ Environment variables
- ✅ Database migrations
- ✅ Monitoring and debugging

---

## 💰 Cost Breakdown

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| **Cloud Run** | Free tier | $0 ✅ |
| **Supabase** | Free tier | $0 ✅ |
| **Total** | | **$0/month** 🎉 |

**Completely FREE for competition demos!**

---

## 🔑 After Deployment

1. **Get your API URL:**
   ```bash
   gcloud run services describe maintix-api \
     --region us-central1 \
     --format='value(status.url)'
   ```

2. **Update frontend environment:**
   ```env
   NEXT_PUBLIC_API_URL=https://maintix-api-xxxxxx-uc.a.run.app
   ```

3. **Test the API:**
   ```bash
   curl https://maintix-api-xxxxxx-uc.a.run.app/health
   ```

4. **Add to README:**
   ```markdown
   **Live Demo:** https://your-frontend.vercel.app
   **API:** https://maintix-api-xxxxxx-uc.a.run.app
   ```

---

## 📚 Related Documentation

- [Complete GCP Deployment](./docs/deploy-gcp.md)
- [Supabase Setup](./docs/setup-supabase.md)
- [Docker Deployment](./docs/docker-deployment.md)
