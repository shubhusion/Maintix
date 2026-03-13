# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace configs
COPY pnpm-workspace.yaml pnpm-lock.yaml turbo.json package.json ./

# Copy shared packages (CRITICAL for monorepo)
COPY packages/ ./packages/

# Copy API app
COPY apps/api/ ./apps/api/

# Install all dependencies (including dev for build)
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN cd packages/database && pnpm prisma generate

# Build shared packages first
RUN pnpm --filter @maintix/shared-types build

# Build API
RUN pnpm --filter @maintix/api build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY pnpm-workspace.yaml pnpm-lock.yaml turbo.json package.json ./
COPY packages/database/prisma ./prisma
COPY apps/api/package.json ./apps/api/

# Copy built files from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/node_modules/.prisma ./prisma

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --filter @maintix/api

# Set ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start application
CMD ["node", "apps/api/dist/main.js"]
