# Base image with Node.js 20.8.0 on Ubuntu
FROM node:20.8.0-bullseye-slim as base

# Install Python, pip, FFmpeg, and Git dependencies
RUN apt-get update
RUN apt-get install -y python3 python3-venv python3-pip ffmpeg git
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the Python virtual environment requirements
COPY ./requirements.txt .

# Set up Python virtual environment
RUN python3 -m venv /app/myenv
RUN /app/myenv/bin/pip install --upgrade pip
RUN /app/myenv/bin/pip install -r requirements.txt

# Copy package.json and package-lock.json to install npm dependencies
COPY ./package.json ./package-lock.json ./

# Install npm packages
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port used by Next.js (4002 in your case)
EXPOSE 4002

# Run the db setup and then start the application
CMD ["sh", "-c", "npm run db:setup && npm run dev"]
