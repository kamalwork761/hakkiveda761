# Production Dockerfile for Hostinger Linux VPS deployment

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and configuration
COPY . .

# Build Vite frontend & bundle Express backend via esbuild
RUN npm run build

# Stage 2: Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets and server bundle
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Ensure uploads directory exists
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
