# Use an official Node.js runtime as the base image
FROM node:20.9.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application with both build and dev commands
CMD ["sh", "-c", "npm run build && npm run dev"]
