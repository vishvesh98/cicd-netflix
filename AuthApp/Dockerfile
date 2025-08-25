# Step 1: Use Node.js base image
FROM node:18

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package files
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Install nodemon globally (optional, helpful for dev)
RUN npm install -g nodemon

# Step 6: Copy the rest of your application
COPY . .

# Step 7: Expose port (adjust if needed)
EXPOSE 5000

# Step 8: Default command
# For production use this:
CMD ["npm", "run", "dev"]

# For development use this (uncomment below and comment above if needed):
# CMD ["nodemon", "src/app.js"]
