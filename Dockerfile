# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN yarn build

# Expose Next.js port
EXPOSE 3000

# Start the Next.js app
CMD ["yarn", "start"]
