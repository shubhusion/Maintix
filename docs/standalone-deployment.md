# 🚀 Standalone Deployment Guide

## 📋 Overview

Maintix now supports **standalone Docker builds** for easier deployment:

| Component | Dockerfile | Output Size | Build Time |
|-----------|-----------|-------------|------------|
| **Frontend** | `Dockerfile.standalone` | ~150MB | ~3 minutes |
| **Backend** | `Dockerfile.standalone` | ~200MB | ~4 minutes |

**Benefits:**
- ✅ No monorepo dependencies in production
- ✅ Smaller image sizes
- ✅ Faster builds
- ✅ Easier to deploy anywhere
- ✅ Production-ready out of the box

---

## 🎯 Quick Start

### **Build and Deploy**

```bash
# 1. Setup environment
cp .env.supabase.example .env
# Edit .env with your Supabase credentials

# 2. Run migrations
pnpm db:migrate:supabase

# 3. Deploy with Docker
docker compose -f docker-compose.prod.yml up --build
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## 🐳 Standalone Dockerfiles

### **Frontend: `apps/web/Dockerfile.standalone`**

Uses Next.js standalone output mode:

```dockerfile
# Build stage
FROM node:22-alpine AS builder
# Install dependencies
# Build Next.js with standalone output

# Production stage
FROM node:22-alpine AS runner
# Copy standalone output
# Copy static files
# Run server.js
```

**What's included:**
- ✅ Next.js server
- ✅ React and dependencies
- ✅ Built pages and static assets
- ✅ Public folder
- ❌ Development dependencies
- ❌ Source code
- ❌ Monorepo dependencies

**Output:** `server.js` - self-contained Next.js server

---

### **Backend: `apps/api/Dockerfile.standalone`**

Uses NestJS production build:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
# Install dependencies
# Generate Prisma client
# Build NestJS

# Production stage
FROM node:20-alpine AS runner
# Copy built files
# Copy Prisma client
# Install production deps only
# Run main.js
```

**What's included:**
- ✅ NestJS framework
- ✅ Compiled JavaScript
- ✅ Prisma client
- ✅ Production dependencies
- ❌ Development dependencies
- ❌ TypeScript source
- ❌ Test files

**Output:** `apps/api/dist/main.js` - self-contained NestJS server

---

## 📊 Comparison: Standalone vs Monorepo

| Aspect | Standalone | Monorepo |
|--------|-----------|----------|
| **Image Size** | ~150-200MB | ~500MB+ |
| **Build Time** | 3-4 minutes | 8-10 minutes |
| **Dependencies** | Production only | All dependencies |
| **Deployment** | Simple | Complex |
| **Portability** | High | Low |
| **Best For** | Production | Development |

---

## 🔧 Build Commands

### **Build Frontend Only**

```bash
# Build standalone frontend
docker build -f apps/web/Dockerfile.standalone \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 \
  -t maintix-web:latest .

# Run
docker run -p 3000:3000 maintix-web:latest
```

### **Build Backend Only**

```bash
# Build standalone backend
docker build -f apps/api/Dockerfile.standalone \
  -t maintix-api:latest .

# Run with environment
docker run -p 3001:3001 \
  -e DATABASE_URL="your-supabase-url" \
  -e JWT_SECRET="your-secret" \
  maintix-api:latest
```

### **Build Both (Docker Compose)**

```bash
# Build and deploy both
docker compose -f docker-compose.prod.yml up --build

# Or in background
docker compose -f docker-compose.prod.yml up -d --build

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

---

## 🌐 Deployment Options

### **Option 1: Google Cloud Run**

```bash
# Build for Cloud Run
docker build -f apps/api/Dockerfile.standalone \
  -t gcr.io/YOUR_PROJECT/maintix-api .

# Push to Container Registry
docker push gcr.io/YOUR_PROJECT/maintix-api

# Deploy to Cloud Run
gcloud run deploy maintix-api \
  --image gcr.io/YOUR_PROJECT/maintix-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="DATABASE_URL=your-url,JWT_SECRET=your-secret"
```

---

### **Option 2: Vercel (Frontend)**

```bash
# Deploy frontend to Vercel
cd apps/web
vercel --prod

# Vercel automatically:
# - Detects Next.js
# - Builds with standalone output
# - Deploys globally
```

---

### **Option 3: Railway (Backend)**

```bash
# Deploy backend to Railway
cd apps/api
railway up

# Railway automatically:
# - Builds Dockerfile.standalone
# - Sets environment variables
# - Deploys with auto-scaling
```

---

### **Option 4: AWS ECS/Fargate**

```bash
# Build for ECR
docker build -f apps/api/Dockerfile.standalone \
  -t YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/maintix-api .

# Push to ECR
docker push YOUR_ACCOUNT.dkr.ecr.REGION.amazonaws.com/maintix-api

# Deploy to ECS/Fargate
# (Use AWS Console or ECS CLI)
```

---

### **Option 5: DigitalOcean App Platform**

```bash
# Connect GitHub repo
# DigitalOcean automatically:
# - Detects Dockerfile.standalone
# - Builds and deploys
# - Manages scaling
```

---

## 📦 Image Optimization

### **Multi-Stage Build Benefits**

```dockerfile
# Stage 1: Builder (large, has all build tools)
FROM node:20-alpine AS builder
# Install, compile, build

# Stage 2: Runner (small, production only)
FROM node:20-alpine AS runner
# Copy only what's needed from builder
# Result: Minimal production image
```

**Size comparison:**
- Builder stage: ~1.2GB (temporary)
- Runner stage: ~200MB (final)
- **Savings:** ~83% smaller!

---

### **Further Optimization (Optional)**

Add to Dockerfile for even smaller images:

```dockerfile
# Use slim base image
FROM node:20-alpine

# Install only production dependencies
RUN pnpm install --prod

# Remove unnecessary files
RUN rm -rf /app/node_modules/.cache
RUN rm -rf /app/.pnpm-store
```

---

## 🔍 Verification

### **Check Image Size**

```bash
# List images
docker images | grep maintix

# Should show:
# maintix-api    latest    xxxxx    2 days ago    ~200MB
# maintix-web    latest    xxxxx    2 days ago    ~150MB
```

### **Test Locally**

```bash
# Test API
docker run -p 3001:3001 \
  -e DATABASE_URL="your-url" \
  -e JWT_SECRET="secret" \
  maintix-api:latest

# Test in browser
http://localhost:3001/health
```

---

## 🚨 Troubleshooting

### **Issue: Build fails with "Cannot find module"**

**Solution:**
```bash
# Clear cache and rebuild
docker builder prune -f
docker compose -f docker-compose.prod.yml build --no-cache
```

---

### **Issue: Image too large**

**Solution:**
```bash
# Check what's in the image
docker run --rm -it maintix-api:latest sh
du -sh /*  # Check folder sizes
```

---

### **Issue: Prisma client not found**

**Solution:**
```bash
# Ensure Prisma client is generated
docker build -f apps/api/Dockerfile.standalone \
  --progress=plain \
  -t maintix-api:latest .

# Check logs for "Generating Prisma client"
```

---

## ✅ Checklist

Before deploying standalone builds:

- [ ] `.env` file configured with Supabase URL
- [ ] JWT_SECRET is 32+ characters
- [ ] Migrations run on Supabase
- [ ] Docker images built successfully
- [ ] Health endpoints respond
- [ ] Frontend can reach backend
- [ ] All roles can login
- [ ] Ticket workflow works

---

## 📚 Related Documentation

- [Supabase Setup](./setup-supabase.md)
- [Cloud Run Deployment](./deploy-gcp.md)
- [Environment Variables](./environment-variables.md)
- [Docker Compose Guide](./docker-compose-guide.md)

---

**Your apps are now standalone and deployment-ready! 🚀**
