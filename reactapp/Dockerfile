# Use an official Node runtime as a parent image
FROM node:20.0.0-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY reactapp/package.json reactapp/yarn.lock /app/
RUN yarn install

# Copy project
COPY reactapp/ /app/

# Build the project
RUN yarn build

# Install serve to serve the build folder
RUN yarn global add serve

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["serve", "-s", "build", "-l", "5000"]
