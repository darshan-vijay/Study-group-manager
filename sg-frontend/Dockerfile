# Stage 1: Build the React app
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:stable

# Remove default Nginx HTML files and add React app build output
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Use Nginx as the entrypoint
CMD ["nginx", "-g", "daemon off;"]
