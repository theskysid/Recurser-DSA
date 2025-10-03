#!/bin/bash

# DSA Tracker Quick Start Script

echo "🚀 Starting DSA Tracker Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "📦 Building and starting containers..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."

# Wait for backend to be healthy
echo "Checking backend health..."
for i in {1..30}; do
    if docker-compose ps | grep -q "Up (healthy).*dsa-tracker-backend"; then
        echo "✅ Backend is ready!"
        break
    elif [ $i -eq 30 ]; then
        echo "❌ Backend failed to start properly"
        docker-compose logs backend
        exit 1
    else
        echo "⏳ Waiting for backend... ($i/30)"
        sleep 5
    fi
done

# Check if frontend is running
if docker-compose ps | grep -q "Up.*dsa-tracker-frontend"; then
    echo "✅ Frontend is ready!"
else
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
    exit 1
fi

echo ""
echo "🎉 DSA Tracker is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8080"
echo "💾 Database: localhost:5432"
echo ""
echo "📋 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
echo "Happy coding! 🎯"