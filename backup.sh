#!/bin/bash

# MongoDB Backup Script
set -e

BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
CONTAINER_NAME="mkcms_mongo_1"

echo "📦 Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

echo "💾 Creating MongoDB backup..."
docker exec $CONTAINER_NAME mongodump --db mkcms --out /tmp/backup

echo "📋 Copying backup from container..."
docker cp $CONTAINER_NAME:/tmp/backup/mkcms "$BACKUP_DIR/"

echo "🗜️  Compressing backup..."
tar -czf "$BACKUP_DIR.tar.gz" -C "$BACKUP_DIR" .
rm -rf "$BACKUP_DIR"

echo "✅ Backup completed: $BACKUP_DIR.tar.gz"

# Behalte nur die letzten 7 Backups
echo "🧹 Cleaning old backups..."
find ./backups -name "*.tar.gz" -type f -mtime +7 -delete
