#!/bin/bash
echo "Starting Netlify Build..."

# 1. Install Root Dependencies (excluding Puppeteer)
echo "Installing root dependencies..."
# We use --no-optional to skip optional deps like some puppeteer binaries, 
# and --omit=dev to skip devDeps entirely.
npm install --omit=dev --no-optional --no-audit --no-fund

# 2. Build Frontend
echo "Building Frontend..."
cd nesco-frontend
npm install
npm run build
cd ..

echo "Build Complete!"
