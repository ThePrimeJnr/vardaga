FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the React app (production build)
RUN npm run build

RUN npm install -g serve

# Expose the port on which the app runs
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
