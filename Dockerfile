# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app
COPY . .

# Build the Nuxt app
RUN npm run build

# ---- Production image ----
FROM node:18-alpine

WORKDIR /app

# Copy built app from previous stage
COPY --from=builder /app/.output .output

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Expose port (Nuxt default is 3000)
EXPOSE 3000

# Start Nuxt
CMD ["node", ".output/server/index.mjs"]
