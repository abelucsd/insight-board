# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.15.0

# Base image with Node
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Stage for installing dependencies and building the app
FROM base as build

# Install all dependencies (including dev dependencies for build)
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code and build
COPY . .
RUN npm run build

################################################################################
# Create minimal runtime image (production only)
FROM node:${NODE_VERSION}-alpine as final

# Set environment and working directory
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Copy only production dependencies from build stage
COPY --from=build /usr/src/app/node_modules ./node_modules

# Copy app build and other necessary files
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/docs ./docs

# Use non-root user
USER node

# Expose app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
