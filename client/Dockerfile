# Base image
FROM node:alpine3.20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3001

# Start command
CMD ["npm", "run", "dev"]
