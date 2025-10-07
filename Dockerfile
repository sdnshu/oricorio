# Step 1: Use an official Node.js image as the base image
FROM node:22-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Step 2: Install dependencies
# First, copy only package.json and package-lock.json (for caching purposes)
COPY package*.json ./

# Install dependencies
RUN npm install

# Step 3: Copy the entire project
COPY . .

# Step 4: Expose the Next.js default port (3000)
EXPOSE 3000

# Step 5: Set environment variable to enable hot reloading
ENV NEXT_TELEMETRY_DISABLED 1

# Step 6: Command to run the Next.js development server
CMD ["npm", "run", "dev"]
