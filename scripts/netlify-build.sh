#!/bin/bash
echo "Starting Netlify Build..."

# 1. Frontend Build
echo "Building Frontend..."
cd nesco-frontend
npm install # Installs everything including vite
npm run build
cd ..

# 2. Functions Build
echo "Installing Functions Dependencies..."
cd functions
npm install --omit=dev
cd ..

echo "Build Complete!"
