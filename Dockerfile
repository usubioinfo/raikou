# Use Node.js 16 as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /apps/raikou

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files to the working directory
COPY . .

# Expose port 3200 to the host
EXPOSE 3200

# Command to run the production build
CMD ["npm", "run", "prod"]

