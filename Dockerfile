# Base image for Node.js
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /usr/src

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the TypeScript code
RUN npm install -g ts-node typescript && npm run build

# Expose the port your app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]
