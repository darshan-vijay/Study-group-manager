# Use an official Node.js runtime as a parent image
FROM node:18 as build

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code and build the app
COPY . .
RUN npm run build

# Use an Nginx image to serve the static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port on which the app will run
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
