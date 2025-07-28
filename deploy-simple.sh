#!/bin/bash

# Simple deploy script for figgs-api2
# This script performs the deployment steps on the server

echo "Starting deployment process..."

# Step 1: Change to dev directory
echo "Changing to dev directory..."
cd dev

if [ $? -ne 0 ]; then
    echo "Error: Failed to change to dev directory"
    exit 1
fi

echo "Current directory: $(pwd)"

# Step 2: Git pull
echo "Pulling latest changes from git..."
git pull

if [ $? -ne 0 ]; then
    echo "Error: Git pull failed"
    exit 1
fi

echo "Git pull completed successfully"

# Step 3: Restart PM2 dev process
echo "Restarting PM2 dev process..."

# Use the full path to PM2 (adjust this path based on your server setup)
export PATH=$PATH:/home/ubuntu/.npm-global/bin
pm2 restart dev

if [ $? -ne 0 ]; then
    echo "Error: Failed to restart PM2 dev process"
    exit 1
fi

echo "PM2 dev process restarted successfully"

# Show PM2 status
echo "Current PM2 status:"
pm2 status

echo "Deployment completed successfully!" 