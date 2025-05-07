# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose your app's port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]