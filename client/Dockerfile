# Base image
FROM node:alpine3.20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy application files
COPY . .

# build the application
RUN npm run build

# Expose the application port
EXPOSE 3001

# Command to run the application
CMD ["npm", "run", "dev"]
