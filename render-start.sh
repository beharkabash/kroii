#!/bin/bash
set -e

echo "🚀 Starting Render deployment..."

# Run Prisma migrations
echo "📦 Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate || echo "⚠️ Schema push failed"

# Seed the database if needed
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️ Seeding skipped (data may already exist)"

# Start the server
echo "✅ Starting server..."
npm start
