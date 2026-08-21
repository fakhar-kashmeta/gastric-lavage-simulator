# Stage 1: Build frontend
FROM node:20-slim AS frontend-builder

WORKDIR /app/frontend

# Copy frontend dependencies
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ .

# Build the React app
RUN npm run build

# Stage 2: Setup backend with built frontend
FROM node:20-slim

WORKDIR /app

# Copy backend directory (includes its own package.json/package-lock.json)
COPY backend/ ./backend/

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Install backend dependencies only (production)
RUN cd backend && npm ci --omit=dev

# Expose port (Cloud Run uses 8080 by default)
EXPOSE 8080

# Set working directory to backend
WORKDIR /app/backend

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the backend server directly (not via `npm start`/--env-file, since
# .env.local is intentionally excluded from the image; Cloud Run supplies
# env vars at runtime and server.js already loads dotenv/config optionally)
CMD ["node", "server.js"]
