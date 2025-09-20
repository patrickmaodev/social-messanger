#!/bin/bash

echo "🚀 Starting Social Messenger Backend..."
echo "=================================="

# Navigate to backend directory
cd backend

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start backend services
echo "📦 Starting Docker containers..."
docker-compose up --build

echo "✅ Backend is running on http://localhost:8000"
echo "📱 API endpoints available at http://localhost:8000/api/v1/"
echo "🔧 Admin panel at http://localhost:8000/admin/"
echo ""
echo "Press Ctrl+C to stop the backend"
