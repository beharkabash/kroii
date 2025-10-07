# ===================================
# Stage 1: Dependencies
# ===================================
FROM node:20-alpine AS deps

# Install security updates and required system dependencies
RUN apk add --no-cache libc6-compat openssl curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies with production optimizations
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# ===================================
# Stage 2: Builder
# ===================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install all dependencies including devDependencies for build
RUN npm ci

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Build the application
RUN npm run build

# ===================================
# Stage 3: Runner (Production)
# ===================================
FROM node:20-alpine AS runner

# Install security updates and dumb-init for proper signal handling
RUN apk add --no-cache \
    dumb-init \
    curl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user for security
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "server.js"]