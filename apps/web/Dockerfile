# Standalone Next.js Production Dockerfile
# Build from: cd apps/web && docker build -t maintix-web:latest .

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

# Copy package files (standalone - no monorepo needed)
COPY package.json ./
COPY tsconfig.json ./
COPY next.config.ts ./
COPY shared-types/ ./shared-types/
COPY src/ ./src/
COPY public/ ./public/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Build shared-types (need to install deps first)
WORKDIR /app/shared-types
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# Build Next.js with standalone output
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV BUILD_STANDALONE=true
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./apps/web/.next/static
COPY --from=builder /app/public ./public

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["node", "server.js"]
