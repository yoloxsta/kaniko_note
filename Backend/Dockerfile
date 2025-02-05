# Use the official Node.js image
FROM node:16-slim

# Use official Node.js image

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY ./backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./backend ./

# Expose port 3000 for the backend
EXPOSE 3000

# Run the backend application
CMD ["node", "server.js"]