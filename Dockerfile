# Stage 1: Build Phase
# Uses a full Node environment to install dependencies and run the build command
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
# Use package-lock.json for reproducible builds if it exists, otherwise npm install
RUN npm install

# Copy source code and run the build command
# This command creates the production-ready assets in the 'dist' folder
COPY . .
RUN npm run build 

# Stage 2: Production/Runtime Phase
# Uses the ultra-lightweight Nginx to serve the static files. 
# This is much smaller and more secure than running a Node server.
FROM nginx:alpine

# The port must be 7860 for Hugging Face Spaces
EXPOSE 7860

# Copy the built application from the 'build' stage into the Nginx serving directory
# The 'dist' folder is the standard output for 'vite build'
COPY --from=build /app/dist /usr/share/nginx/html

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
