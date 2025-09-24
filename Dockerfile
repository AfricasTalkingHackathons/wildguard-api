# Multi-stage Docker build for WildGuard API

# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm ci --only=development

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install system dependencies for PostgreSQL
RUN apk add --no-cache postgresql-client curl

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S wildguard -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=wildguard:nodejs /app/dist ./dist

# Create uploads directory for media files
RUN mkdir -p uploads && chown wildguard:nodejs uploads

# Switch to non-root user
USER wildguard

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]