# 🚀 Standalone Apps - Complete Guide

## ✅ **Both API and Web Can Run Completely Standalone**

Your Maintix project is now structured so that `apps/api` and `apps/web` can each run **independently** without needing any other folders.

---

## 📁 **Standalone Structure**

```
Maintix/
├── apps/
│   ├── api/                          # ✅ FULLY STANDALONE
│   │   ├── src/                      # Source code
│   │   ├── prisma/                   # Prisma schema & seed
│   │   ├── shared-types/             # Local shared types
│   │   │   ├── dist/                 # Built output
│   │   │   ├── index.ts
│   │   │   ├── enums.ts
│   │   │   ├── types.ts
│   │   │   ├── error-codes.ts
│   │   │   ├── constants.ts
│   │   │   ├── package.json          # ✅ Local package
│   │   │   └── tsconfig.json         # ✅ Local config
│   │   ├── dist/                     # Built API
│   │   ├── package.json              # ✅ Standalone (uses file:./shared-types)
│   │   ├── package-lock.json         # ✅ NPM lockfile for standalone use
│   │   ├── tsconfig.json             # ✅ Standalone config
│   │   └── Dockerfile.standalone     # ✅ Production Docker
│   │
│   └── web/                          # ✅ FULLY STANDALONE
│       ├── src/                      # Source code
│       ├── shared-types/             # Local shared types
│       │   ├── dist/                 # Built output
│       │   ├── index.ts
│       │   ├── enums.ts
│       │   ├── types.ts
│       │   ├── error-codes.ts
│       │   ├── constants.ts
│       │   ├── package.json          # ✅ Local package
│       │   └── tsconfig.json         # ✅ Local config
│       ├── .next/                    # Built output
│       ├── package.json              # ✅ Standalone (uses file:./shared-types)
│       ├── package-lock.json         # ✅ NPM lockfile for standalone use
│       ├── tsconfig.json             # ✅ Standalone config
│       ├── next.config.ts            # ✅ Fixed lockfile warning
│       └── Dockerfile.standalone     # ✅ Production Docker
│
└── packages/                         # Development reference only (optional)
```

---

## 🔧 **How Standalone Works**

### **1. Local shared-types**

Each app has its own copy of shared-types:

**API (`apps/api/shared-types/`):**
```json
{
  "name": "@maintix/shared-types",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

**Web (`apps/web/shared-types/`):**
```json
{
  "name": "@maintix/shared-types",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```

---

### **2. File Dependencies**

Both apps reference their local shared-types:

**API package.json:**
```json
{
  "dependencies": {
    "@maintix/shared-types": "file:./shared-types"
  }
}
```

**Web package.json:**
```json
{
  "dependencies": {
    "@maintix/shared-types": "file:./shared-types"
  }
}
```

---

### **3. Separate Lockfiles**

Each app has its own `package-lock.json` for standalone NPM use:
- ✅ `apps/api/package-lock.json` - API dependencies
- ✅ `apps/web/package-lock.json` - Web dependencies

**Root uses pnpm:**
- ✅ `pnpm-lock.yaml` - Root workspace (optional for development)

**This is INTENTIONAL** - allows both standalone NPM use AND workspace development.

---

## 🚀 **How to Run Each App Standalone**

### **API - Standalone Mode**

```bash
# Navigate to API folder
cd apps/api

# Install dependencies (uses package-lock.json)
npm install

# Build shared-types first
cd shared-types
npm install
npm run build

# Go back and build API
cd ..
npm run build

# Start API
npm start

# Or development mode
npm run dev
```

**Access:** http://localhost:3001

---

### **Web - Standalone Mode**

```bash
# Navigate to Web folder
cd apps/web

# Install dependencies (uses package-lock.json)
npm install

# Build shared-types first
cd shared-types
npm install
npm run build

# Go back and build Web
cd ..
npm run build

# Start Web
npm start

# Or development mode
npm run dev
```

**Access:** http://localhost:3000

---

## 🐳 **Docker Deployment (Standalone)**

### **API Docker**

```bash
# Build standalone API image
docker build -f apps/api/Dockerfile.standalone -t maintix-api:latest .

# Run
docker run -p 3001:3001 \
  -e DATABASE_URL="your-supabase-url" \
  -e JWT_SECRET="your-secret" \
  maintix-api:latest
```

---

### **Web Docker**

```bash
# Build standalone Web image
docker build -f apps/web/Dockerfile.standalone \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 \
  -t maintix-web:latest .

# Run
docker run -p 3000:3000 maintix-web:latest
```

---

## ✅ **Verification Tests**

### **Test 1: API Standalone Build**

```bash
cd apps/api
npm install    # Should install ~840 packages
npm run build  # Should succeed
npm start      # Should start on port 3001
```

**Expected Output:**
```
✅ Nest application started on http://localhost:3001
```

---

### **Test 2: Web Standalone Build**

```bash
cd apps/web
npm install    # Should install ~340 packages
npm run build  # Should succeed
npm start      # Should start on port 3000
```

**Expected Output:**
```
✓ Ready in 123ms
○ Compiling /login
✓ Compiled /login in 1.2s
```

---

## 🔧 **Fixing Multiple Lockfiles Warning**

### **Problem:**
Next.js detects both root `pnpm-lock.yaml` and app `package-lock.json` files.

### **Solution:**
Added `outputFileTracingRoot` to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  outputFileTracingRoot: './',  // Tells Next.js where to look for lockfiles
  // ... other config
};
```

This silences the warning while keeping both lockfile types for flexibility.

---

## 📊 **Standalone vs Workspace**

| Feature | Standalone (NPM) | Workspace (pnpm) |
|---------|-----------------|------------------|
| **Lockfile** | package-lock.json | pnpm-lock.yaml |
| **Install** | `npm install` | `pnpm install` |
| **Use Case** | Production deploy | Development |
| **Speed** | Fast | Faster |
| **Disk** | More (duplicated deps) | Less (shared deps) |
| **Portability** | High (copy folder) | Low (needs workspace) |

---

## 🎯 **Recommended Workflow**

### **Development:**
```bash
# Use pnpm workspace at root
cd D:\Github\Maintro
pnpm install
pnpm dev  # Runs both apps
```

**Benefits:**
- ✅ Shared dependencies
- ✅ Faster installs
- ✅ Single command for both apps

---

### **Production Deploy:**
```bash
# Use standalone NPM in each app
cd apps/api
npm install
npm run build
npm start

cd ../web
npm install
npm run build
npm start
```

**Benefits:**
- ✅ No workspace needed
- ✅ Each app is self-contained
- ✅ Easy Docker builds
- ✅ Deploy anywhere

---

## 📝 **package-lock.json Files - Keep or Delete?**

### **Keep Them If:**
- ✅ You want standalone NPM support
- ✅ You deploy with Docker (uses package-lock.json)
- ✅ You want flexibility to use npm or pnpm

### **Delete Them If:**
- ❌ You ONLY use pnpm workspace
- ❌ You never deploy apps individually
- ❌ You want to enforce pnpm-only usage

---

## ✅ **Current Setup (Recommended)**

**We KEEP package-lock.json files because:**

1. ✅ **Flexibility** - Can use npm or pnpm
2. ✅ **Docker** - Uses package-lock.json by default
3. ✅ **Standalone** - Each app truly independent
4. ✅ **Production** - NPM is more universal
5. ✅ **Development** - Can still use pnpm workspace

---

## 🎯 **Quick Reference Commands**

### **Root Workspace (Development)**
```bash
cd D:\Github\Maintro
pnpm install           # Install all
pnpm dev              # Run both apps
pnpm build            # Build both apps
```

### **API Standalone (Production)**
```bash
cd apps/api
npm install           # Install API deps
npm run build         # Build API
npm start             # Start API
```

### **Web Standalone (Production)**
```bash
cd apps/web
npm install           # Install Web deps
npm run build         # Build Web
npm start             # Start Web
```

### **Docker (Production)**
```bash
# API
docker build -f apps/api/Dockerfile.standalone -t maintix-api .

# Web
docker build -f apps/web/Dockerfile.standalone \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1 \
  -t maintix-web .
```

---

## ✅ **Checklist**

- [x] API has standalone package.json
- [x] API has standalone package-lock.json
- [x] API has local shared-types
- [x] API has standalone tsconfig.json
- [x] API builds independently
- [x] Web has standalone package.json
- [x] Web has standalone package-lock.json
- [x] Web has local shared-types
- [x] Web has standalone tsconfig.json
- [x] Web builds independently
- [x] Next.js lockfile warning fixed
- [x] Dockerfile.standalone for both apps

---

## 🎉 **Summary**

Your Maintix project now supports **BOTH**:

1. **Workspace Development** (pnpm at root)
2. **Standalone Production** (npm in each app)

**Both apps can run completely independently** without needing any other folders!

---

**🎊 Standalone setup is COMPLETE! 🎊**

---

## 📚 **Related Documentation**

- `docs/CLEANUP_COMPLETE.md` - Codebase cleanup summary
- `docs/METADATA_WARNINGS_FIXED.md` - Next.js warnings fix
- `docs/COMPLETE_BUILD_SUCCESS.md` - Build status
- `docs/standalone-deployment.md` - Deployment guide
