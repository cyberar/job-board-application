
# ==========================================
# Stage 1: Base image
# ==========================================
FROM node:22-alpine AS base

WORKDIR /app

# ==========================================
# Stage 2: Install dependencies
# ==========================================
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci

# ==========================================
# Stage 3: Build application
# ==========================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ==========================================
# Stage 4: Production runner
# ==========================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy standalone application
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run as non-root user
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
