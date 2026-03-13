# 🔐 Environment Variables Guide

## 📋 Required Variables

These variables **MUST** be set for the application to start:

| Variable | Description | Example | Validation |
|----------|-------------|---------|------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` | ✅ Required, must be valid URL |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` | ✅ Required, min 32 characters |

---

## ⚙️ Optional Variables

These variables have sensible defaults:

| Variable | Default | Description | Recommended Value |
|----------|---------|-------------|-------------------|
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration | `7d` (7 days) |
| `PORT` | `3001` | Server port | `3001` |
| `CORS_ORIGIN` | `*` | Allowed CORS origins | Your frontend URL |
| `NODE_ENV` | `development` | Environment | `production` |
| `LOG_LEVEL` | `info` | Logging level | `info` or `warn` |

---

## 🗄️ Database Connection Strings

### For Supabase (Recommended)

```env
# Connection Pool (for Cloud Run/Serverless)
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct Connection (for local development only)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
```

**Get your connection string:**
1. Go to https://supabase.com
2. Select your project
3. Settings → Database → Connection pool
4. Copy URI

---

### For Local PostgreSQL

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/maintix"
```

---

### For Google Cloud SQL

```env
DATABASE_URL="postgresql://user:password@/maintix?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

---

## 🔐 JWT Configuration

### Generate Secure JWT Secret

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using PowerShell
[System.Web.Security.Membership]::GeneratePassword(32, 8)
```

**Example:**
```env
JWT_SECRET="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
JWT_EXPIRES_IN="7d"
```

---

## 🌐 CORS Configuration

### Development

```env
CORS_ORIGIN="*"
```

### Production

```env
CORS_ORIGIN="https://your-frontend.vercel.app"
```

### Multiple Origins

```env
CORS_ORIGIN="https://maintix.app,https://www.maintix.app"
```

---

## 📊 Logging Configuration

### Available Log Levels

```env
# Show all logs
LOG_LEVEL="verbose"

# Show debug, info, warn, error
LOG_LEVEL="debug"

# Show info, warn, error (recommended)
LOG_LEVEL="info"

# Show warn, error only
LOG_LEVEL="warn"

# Show error only
LOG_LEVEL="error"
```

---

## 🚀 Environment Presets

### Local Development

```env
# .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/maintix"
JWT_SECRET="dev-secret-key-at-least-32-characters-long-for-testing"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
LOG_LEVEL=debug
```

### Production (Supabase + Cloud Run)

```env
# .env.production
DATABASE_URL="postgresql://postgres.PROJECT:PASS@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your-production-secret-key-min-32-characters-secure-random"
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="https://maintix.app"
NODE_ENV=production
LOG_LEVEL=info
```

### Docker/Cloud Run

```env
# Set via gcloud or Docker Compose
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
CORS_ORIGIN=https://maintix.app
NODE_ENV=production
LOG_LEVEL=info
```

---

## ✅ Validation Rules

The application validates environment variables on startup:

### Required Variables Check
```
✅ DATABASE_URL - Must be set and non-empty
✅ JWT_SECRET - Must be set and min 32 characters
```

### Security Warnings
```
⚠️ JWT_SECRET < 32 characters - Security warning
⚠️ JWT_EXPIRES_IN not set - Using default "7d"
```

### Success Output
```
✅ Environment variables validated successfully
📊 Database: Supabase
🔐 JWT Expires: 7d
🌍 Environment: production
🔓 CORS Origin: https://maintix.app
```

---

## 🚨 Common Issues

### Issue: "Missing required environment variables"

**Solution:**
```bash
# Set environment variables
export DATABASE_URL="your-url"
export JWT_SECRET="your-secret"

# Or create .env file
cp .env.example .env
# Edit .env with your values
```

---

### Issue: "JWT_SECRET should be at least 32 characters"

**Solution:**
```bash
# Generate secure secret
openssl rand -base64 32

# Use in .env
JWT_SECRET="generated-secret-here"
```

---

### Issue: "Cannot connect to database"

**Solution:**
1. Check DATABASE_URL format
2. Verify credentials
3. Test connection:
   ```bash
   psql $DATABASE_URL
   ```

---

## 📝 Environment File Templates

### `.env.example` (Copy this)

```env
# Required
DATABASE_URL="postgresql://postgres:password@localhost:5432/maintix"
JWT_SECRET="dev-secret-key-at-least-32-characters-long"

# Optional
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV=development
LOG_LEVEL=info
```

### `.env.supabase` (For Supabase)

```env
# Required - Supabase Connection Pool
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your-super-secret-key-min-32-characters"

# Optional
JWT_EXPIRES_IN="7d"
PORT=3001
CORS_ORIGIN="*"
NODE_ENV=production
LOG_LEVEL=info
```

---

## 🔒 Security Best Practices

### 1. Never Commit `.env` Files

```bash
# Add to .gitignore
.env
.env.*
!.env.example
```

### 2. Use Different Secrets per Environment

```bash
# Development
JWT_SECRET="dev-secret-key"

# Production
JWT_SECRET="completely-different-production-secret"
```

### 3. Rotate Secrets Regularly

```bash
# Generate new secret quarterly
openssl rand -base64 32

# Update in Cloud Run
gcloud run services update maintix-api \
  --set-env-vars="JWT_SECRET=new-secret"
```

### 4. Use Secret Manager (Production)

```bash
# Store in Google Secret Manager
gcloud secrets create jwt-secret --data-file=jwt-secret.txt

# Grant access
gcloud secrets add-iam-policy-binding jwt-secret \
  --member="serviceAccount:maintix-api@PROJECT.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Mount in Cloud Run
gcloud run services update maintix-api \
  --set-secrets="/etc/secrets/jwt-secret=jwt-secret:latest"
```

---

## 📚 Related Documentation

- [Supabase Setup](./setup-supabase.md)
- [Cloud Run Deployment](./deploy-gcp.md)
- [Docker Configuration](./docker-deployment.md)
- [Security Guide](./security.md)

---

## ✅ Checklist

Before deploying to production:

- [ ] DATABASE_URL set and tested
- [ ] JWT_SECRET is 32+ characters
- [ ] JWT_SECRET is different from development
- [ ] CORS_ORIGIN set to production URL
- [ ] NODE_ENV=production
- [ ] LOG_LEVEL=info or warn
- [ ] .env file NOT committed to git
- [ ] Secrets stored in secret manager (optional)

---

**Your application is now properly configured with secure environment variables! 🔐**
