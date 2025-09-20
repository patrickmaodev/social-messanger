#!/bin/bash

echo "🚀 Starting Social Messenger Frontend (SDK 54)..."

# Load NVM with full path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use correct Node.js version
echo "📦 Using Node.js $(nvm use 20.19)"
nvm use 20.19

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing all dependencies..."
    npm install --legacy-peer-deps
fi

# Start Expo with SDK 54 using full path
echo "🎯 Starting Expo development server (SDK 54)..."
/home/patrickdev/.nvm/versions/node/v20.19.5/bin/npx expo start --clear

echo "✅ Frontend is running with SDK 54!"
echo "📱 Scan the QR code with Expo Go app (SDK 54)"
echo "🌐 Or press 'w' to open in web browser"