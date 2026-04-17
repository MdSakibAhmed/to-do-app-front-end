# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-/api}

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production (serve static files — no nginx needed) ───────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install 'serve' — lightweight static file server
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1

# serve the dist folder on port 3000, -s = SPA mode (all routes → index.html)
CMD ["serve", "-s", "dist", "-l", "3000"]
