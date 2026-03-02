# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --legacy-peer-deps

# ================================
# Stage 2: Migrator
# (Pakai full node_modules dari deps, tidak perlu copy-copy manual)
# ================================
FROM node:20-alpine AS migrator
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma/

CMD ["npx", "prisma", "migrate", "deploy"]

# ================================
# Stage 3: Builder
# ================================
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env vars (NEXT_PUBLIC_* harus ada saat next build)
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ================================
# Stage 4: Runner (Production)
# ================================
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl netcat-openbsd
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma Client (hanya untuk runtime app, bukan CLI)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
