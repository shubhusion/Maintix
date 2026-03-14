# Standalone NestJS Production Dockerfile
# Build from: cd apps/api && docker build -t maintix-api:latest .

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files (standalone - no monorepo needed)
COPY package.json ./
COPY tsconfig.json ./
COPY shared-types/ ./shared-types/
COPY prisma/ ./prisma/
COPY src/ ./src/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Generate Prisma client
RUN pnpm prisma generate

# Build shared-types (need to install deps first)
WORKDIR /app/shared-types
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# Build API
WORKDIR /app
RUN pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/shared-types ./shared-types
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose port (Cloud Run will override with PORT env var)
EXPOSE 8080

# Health check (use PORT env var)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/health || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start application
CMD ["node", "dist/main.js"]
