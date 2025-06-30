#!/bin/bash

# Build and Deploy Script
set -e

echo "🚀 Starting deployment..."

# Stoppe laufende Container
echo "📦 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Baue neue Images
echo "🔨 Building new images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Starte die Services
echo "▶️  Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Warte bis die Services verfügbar sind
echo "⏳ Waiting for services to be ready..."
sleep 30

# Prüfe den Status
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo "✅ Deployment completed!"
echo "🌐 Your portfolio should be available at: $NEXT_PUBLIC_SERVER_URL"
