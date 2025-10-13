#!/bin/bash

# Kroi Auto Center - Deployment Verification Script
echo "🚀 Kroi Auto Center - Deployment Verification"
echo "=============================================="

SITE_URL="https://kroiautocenter.fi"

echo "1. Checking health endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/health")
if [ "$response" = "200" ]; then
    echo "✅ Health endpoint: OK ($response)"
else
    echo "❌ Health endpoint: FAILED ($response)"
fi

echo "2. Checking home page..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
if [ "$response" = "200" ]; then
    echo "✅ Home page: OK ($response)"
else
    echo "❌ Home page: FAILED ($response)"
fi

echo "3. Checking cars page..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/cars")
if [ "$response" = "200" ]; then
    echo "✅ Cars page: OK ($response)"
else
    echo "❌ Cars page: FAILED ($response)"
fi

echo "4. Checking API endpoints..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/api/cars")
if [ "$response" = "200" ]; then
    echo "✅ Cars API: OK ($response)"
else
    echo "❌ Cars API: FAILED ($response)"
fi

echo ""
echo "🎉 Deployment verification complete!"
echo "If all checks show ✅, your deployment is successful!"