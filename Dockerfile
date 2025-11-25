# Use Node.js 18 on Alpine Linux for a lightweight image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package definition files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 7860 (Standard for Hugging Face Spaces)
EXPOSE 7860

# Start the Vite development server
CMD ["npm", "run", "dev"]
