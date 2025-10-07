#!/bin/bash
set -e

echo "🚀 Starting Render deployment..."

# Run Prisma migrations
echo "📦 Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate || echo "⚠️ Schema push failed"

# Seed the database if needed
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️ Seeding skipped (data may already exist)"

# Copy static assets to standalone build
echo "📁 Copying static assets..."
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
cp -r public .next/standalone/public 2>/dev/null || true

# Start the server
echo "✅ Starting server..."
cd .next/standalone
node server.js
