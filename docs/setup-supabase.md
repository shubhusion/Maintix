# 🗄️ Setup Supabase Database

## 🎯 Why Supabase?

- ✅ **Free Tier:** 500MB database, unlimited API calls
- ✅ **No Docker needed:** Managed PostgreSQL
- ✅ **Connection Pooling:** Built-in PgBouncer for serverless
- ✅ **Auto Backups:** Daily backups included
- ✅ **Web UI:** Easy database management
- ✅ **Perfect for Cloud Run:** Optimized for serverless

---

## 📋 Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Choose organization (or create new)
4. Project name: `maintix`
5. Database password: **Save this securely!**
6. Region: Choose closest to your users (e.g., `us-central-1` for US)

**Wait 2-3 minutes** for provisioning.

---

## 📋 Step 2: Get Connection String

### Option A: Direct Connection (Development)

1. Go to **Settings** → **Database**
2. Click **Connection string** tab
3. Copy **URI** connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### Option B: Connection Pooling (Production - Recommended)

1. Go to **Settings** → **Database**
2. Click **Connection pool** tab
3. Enable connection pooling
4. Copy **URI** connection string:
   ```
   postgresql://postgres.[PROJECT]:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

**For Cloud Run, use Option B (Connection Pooling)!**

---

## 📋 Step 3: Update Environment Variables

### Add to `.env` (Development)

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

### Add to Cloud Run (Production)

```bash
gcloud run services update maintix-api \
  --set-env-vars="DATABASE_URL=postgresql://postgres.[PROJECT]:[YOUR-PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

Or via Cloud Console:

1. Cloud Run → maintix-api
2. Edit & Deploy New Revision
3. Variables & Secrets → Add variable
4. Name: `DATABASE_URL`
5. Value: Your Supabase connection string

---

## 📋 Step 4: Run Migrations

```bash
# From project root
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Push schema to Supabase
pnpm prisma db push

# Seed demo data
pnpm prisma db seed
```

---

## 📋 Step 5: Verify Connection

```bash
# Test connection from local
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"

# Or via Prisma Studio
pnpm prisma studio
```

---

## 🔒 Security Best Practices

### 1. Use Environment Variables

**Never commit your Supabase URL!**

```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
```

### 2. Use Supabase Secrets Manager (Optional)

```bash
# Store password in Secret Manager
gcloud secrets create supabase-password --data-file=password.txt

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding supabase-password \
  --member="serviceAccount:maintix-api@PROJECT.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Mount in Cloud Run
gcloud run services update maintix-api \
  --set-secrets="/etc/secrets/supabase-password=supabase-password:latest"
```

### 3. Enable SSL (Required for Production)

Add to connection string:

```
DATABASE_URL="postgresql://...?sslmode=require"
```

### 4. Restrict Database Access

In Supabase Dashboard:

1. Go to **Settings** → **Database**
2. Under **Connection security**, enable:
   - ✅ Require SSL
   - ✅ Enable password authentication
3. Under **IP allowlist**, add Cloud Run IP ranges (optional)

---

## 💰 Supabase Pricing

| Plan     | Database Size | Bandwidth | Price          |
| -------- | ------------- | --------- | -------------- |
| **Free** | 500 MB        | Unlimited | $0 ✅          |
| **Pro**  | 8 GB          | Unlimited | $25/month      |
| **Team** | Unlimited     | Unlimited | $25/user/month |

**For Competition:** Free tier is perfect! (500MB = ~50,000+ tickets)

---

## 📊 Monitor Database Usage

### Supabase Dashboard

1. Go to **Settings** → **Database**
2. View:
   - Database size
   - Connection count
   - Query performance

### Set Up Alerts

1. Go to **Settings** → **Notifications**
2. Enable:
   - ✅ Database size warnings
   - ✅ High connection count
   - ✅ Failed login attempts

---

## 🚀 Quick Setup Script

```bash
#!/bin/bash

# Supabase Setup Script
# Usage: ./setup-supabase.sh

echo "🗄️ Supabase Setup for Maintix"
echo "=============================="
echo ""

# Get Supabase credentials
read -p "Enter Supabase project URL (e.g., db.xxxxx.supabase.co): " SUPABASE_URL
read -p "Enter Supabase password: " -s SUPABASE_PASSWORD
echo ""
read -p "Enter Supabase project ref (e.g., xxxxx): " PROJECT_REF

# Build connection string
DATABASE_URL="postgresql://postgres:${SUPABASE_PASSWORD}@${SUPABASE_URL}:5432/postgres"

echo ""
echo "✅ Connection string created"
echo ""

# Update local .env
cat > apps/api/.env << EOF
DATABASE_URL="${DATABASE_URL}"
JWT_SECRET="your-jwt-secret-change-me"
PORT=3001
EOF

echo "✅ Local .env updated"
echo ""

# Update Cloud Run
echo "☁️ Updating Cloud Run..."
gcloud run services update maintix-api \
  --set-env-vars="DATABASE_URL=${DATABASE_URL}"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run: pnpm db:push"
echo "2. Run: pnpm db:seed"
echo "3. Test: curl https://your-api-url/health"
```

---

## 🔍 Troubleshooting

### Issue: Connection Timeout

**Solution:** Use connection pooling (PgBouncer)

```env
# Change from direct to pooled connection
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

### Issue: Too Many Connections

**Solution:** Enable connection pooling in Supabase

1. Settings → Database → Connection pool
2. Enable pooling
3. Use port 6543 instead of 5432

---

### Issue: SSL Required

**Solution:** Add sslmode to connection string

```env
DATABASE_URL="postgresql://...?sslmode=require"
```

---

### Issue: Prisma Migration Fails

**Solution:** Supabase uses `postgres` schema by default

```bash
# Reset database (development only!)
pnpm prisma migrate reset

# Or push schema directly
pnpm prisma db push
```

---

## 📚 Supabase Resources

- [Supabase Dashboard](https://app.supabase.com)
- [Connection Pooling Docs](https://supabase.com/docs/guides/database/connection-pooling)
- [Prisma + Supabase Guide](https://supabase.com/docs/guides/database/connectors/orm/prisma)
- [Pricing Calculator](https://supabase.com/pricing)

---

## 🏆 Competition Checklist

- [ ] Supabase project created
- [ ] Connection string copied
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Demo data seeded
- [ ] Connection pooling enabled
- [ ] SSL required
- [ ] Health endpoint responds
- [ ] All roles can login
- [ ] Ticket workflow works

---

**You're all set! Supabase + Cloud Run = Perfect Match! 🚀**
