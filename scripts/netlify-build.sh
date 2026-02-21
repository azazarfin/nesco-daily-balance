#!/bin/bash
set -e # Exit immediately if a command fails

echo "Starting Netlify Build..."

# 1. Frontend Build
echo "Building Frontend..."
cd nesco-frontend
npm install --include=dev # Explicitly install devDependencies
npm run build
cd ..

# 2. Functions Build
echo "Installing Functions Dependencies..."
cd functions
npm install --omit=dev
cd ..

echo "Build Complete!"