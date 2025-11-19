# Stage 1: Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json ./

# Remove package-lock.json if exists and install dependencies
# This fixes rollup optional dependencies issue in Alpine
RUN rm -f package-lock.json && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production stage with Nginx
FROM nginx:alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy custom nginx config
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user (nginx user already exists in alpine)
# Nginx runs as nginx user by default in alpine image

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

