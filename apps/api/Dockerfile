# Standalone NestJS Production Dockerfile
# Build from: cd apps/api && docker build -t maintix-api:latest .

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Copy dependency files
COPY package.json ./
COPY tsconfig.json ./
COPY shared-types/ ./shared-types/
COPY prisma/ ./prisma/
COPY src/ ./src/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Generate Prisma client
RUN pnpm prisma generate

# Build shared-types
WORKDIR /app/shared-types
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# Build API
WORKDIR /app
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built API
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copy shared-types to proper location in node_modules
COPY --from=builder /app/shared-types ./node_modules/@maintix/shared-types

# Copy package.json
COPY --from=builder /app/package.json ./package.json

# Set ownership
RUN chown -R nestjs:nodejs /app

USER nestjs

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start application
CMD ["node", "dist/main.js"]
