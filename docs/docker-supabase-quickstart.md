# 🐳 Docker + Supabase Quick Start

## 🎯 Choose Your Setup

### Option A: Local PostgreSQL (Development)
**Best for:** Local development, testing, offline work

**Pros:**
- ✅ Works offline
- ✅ Fast iteration
- ✅ Full control
- ✅ No external dependencies

**Cons:**
- ❌ Not production-like
- ❌ Manual backups
- ❌ No connection pooling

---

### Option B: Supabase (Production)
**Best for:** Production deployment, Cloud Run, team collaboration

**Pros:**
- ✅ Managed PostgreSQL
- ✅ Built-in connection pooling
- ✅ Automatic backups
- ✅ Web UI for database management
- ✅ Free tier (500MB)
- ✅ Production-ready

**Cons:**
- ❌ Requires internet
- ❌ External dependency

---

## 🚀 Quick Start

### Option A: Local PostgreSQL

```bash
# 1. Start local database
docker compose up -d

# 2. Set environment variables
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Maintix"
export JWT_SECRET="dev-secret-key-at-least-32-characters-long"

# 3. Run migrations
pnpm db:push
pnpm db:seed

# 4. Start development
pnpm dev
```

**Database Access:**
- Host: `localhost`
- Port: `5432`
- Database: `Maintix`
- User: `postgres`
- Password: `postgres`

---

### Option B: Supabase

```bash
# 1. Create Supabase account
https://supabase.com

# 2. Create project and get connection string
# Settings → Database → Connection pool → Copy URI

# 3. Copy environment template
cp .env.supabase.example .env

# 4. Edit .env with your Supabase credentials
# DATABASE_URL=your-supabase-url
# JWT_SECRET=your-secret-key

# 5. Run migrations
pnpm db:migrate:supabase

# 6. Start development
pnpm dev

# OR deploy to production
docker compose -f docker-compose.prod.yml up --build
```

---

## 📋 Environment Variables

### For Local Development

```env
# .env (local)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Maintix"
JWT_SECRET="dev-secret-key-at-least-32-characters-long"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
```

### For Supabase (Production)

```env
# .env (production)
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your-production-secret-min-32-characters"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="https://your-frontend.vercel.app"
NODE_ENV=production
```

---

## 🔄 Switching Between Local and Supabase

### From Local to Supabase

```bash
# 1. Stop local development
pnpm dev

# 2. Update .env with Supabase credentials
# Edit DATABASE_URL to use Supabase connection string

# 3. Run migrations on Supabase
pnpm db:migrate:supabase

# 4. Start with Supabase
pnpm dev
```

### From Supabase to Local

```bash
# 1. Stop application
# Ctrl+C

# 2. Update .env with local PostgreSQL URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/Maintix"

# 3. Start local database
docker compose up -d

# 4. Push schema to local
pnpm db:push
pnpm db:seed

# 5. Start development
pnpm dev
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to local database

**Solution:**
```bash
# Check if PostgreSQL container is running
docker compose ps

# Restart if needed
docker compose restart postgres

# Check logs
docker compose logs postgres
```

---

### Issue: Supabase connection timeout

**Solution:**
```bash
# Make sure you're using connection pooling
# Port should be 6543, not 5432
# URL should include ?pgbouncer=true

DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

---

### Issue: Environment variables not loading

**Solution:**
```bash
# Check if .env file exists
ls -la .env

# Verify format (no spaces around =)
cat .env

# Restart application
pnpm dev
```

---

## 📊 Comparison Table

| Feature | Local PostgreSQL | Supabase |
|---------|-----------------|----------|
| **Setup Time** | 2 minutes | 5 minutes |
| **Cost** | Free | Free (500MB) |
| **Internet Required** | No | Yes |
| **Backups** | Manual | Automatic |
| **Connection Pooling** | No | Yes |
| **Web UI** | pgAdmin (manual) | Built-in |
| **Production Ready** | No | Yes |
| **Best For** | Development | Production |

---

## 🎯 Recommendation

### For Development
Use **Local PostgreSQL**:
```bash
docker compose up -d
pnpm dev
```

### For Production
Use **Supabase + Cloud Run**:
```bash
cp .env.supabase.example .env
# Edit .env with Supabase credentials
pnpm db:migrate:supabase
docker compose -f docker-compose.prod.yml up --build
```

---

## 📚 Related Documentation

- [Supabase Setup Guide](./docs/setup-supabase.md)
- [Cloud Run Deployment](./docs/deploy-gcp.md)
- [Docker Configuration](./docs/docker-deployment.md)
- [Environment Variables](./docs/environment-variables.md)

---

## ✅ Checklist

### Local Development
- [ ] Docker installed
- [ ] `docker compose up -d` runs successfully
- [ ] Can connect to `localhost:5432`
- [ ] Migrations run: `pnpm db:push`
- [ ] Demo data seeded: `pnpm db:seed`

### Production (Supabase)
- [ ] Supabase account created
- [ ] Project created
- [ ] Connection string copied
- [ ] `.env` file configured
- [ ] Migrations run: `pnpm db:migrate:supabase`
- [ ] Docker image built
- [ ] Deployed to Cloud Run
- [ ] Health endpoint responds

---

**Choose your setup and start building! 🚀**
