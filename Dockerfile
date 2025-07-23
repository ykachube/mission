# Dockerfile for Mission Control Dashboard

# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY src/frontend/package*.json ./src/frontend/

# Install backend dependencies
RUN npm ci

# Install frontend dependencies
RUN cd src/frontend && npm ci

# Copy source code
COPY . .

# Build backend
RUN npm run build

# Build frontend
RUN cd src/frontend && npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]