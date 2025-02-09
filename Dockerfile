# Use an official Node.js runtime as a parent image
FROM node:22-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of your application code
COPY . .

# Ensure the app listens on the port Cloud Run provides (default is 8080)
ENV PORT=8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
