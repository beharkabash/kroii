#!/bin/bash
##
# Database Backup Script
# Kroi Auto Center - PostgreSQL Backup Utility
##

set -e

# Configuration
DB_CONTAINER="${DB_CONTAINER:-kroi-postgres-dev}"
DB_USER="${DB_USER:-kroi}"
DB_NAME="${DB_NAME:-kroi_auto_center}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
RETENTION_DAYS=30

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo -e "${GREEN}🔄 Starting database backup...${NC}"
echo "Database: $DB_NAME"
echo "Container: $DB_CONTAINER"
echo "Backup file: $BACKUP_FILE"
echo ""

# Check if container is running
if ! docker ps | grep -q "$DB_CONTAINER"; then
    echo -e "${RED}❌ Error: Container $DB_CONTAINER is not running${NC}"
    exit 1
fi

# Perform backup
echo -e "${YELLOW}📦 Creating backup...${NC}"
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup completed successfully!${NC}"
    echo "Size: $BACKUP_SIZE"
    echo "Location: $BACKUP_FILE"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

# Clean old backups
echo ""
echo -e "${YELLOW}🧹 Cleaning old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✅ Cleanup completed${NC}"

# List all backups
echo ""
echo -e "${GREEN}📋 Available backups:${NC}"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || echo "No backups found"

echo ""
echo -e "${GREEN}✨ Backup process completed!${NC}"
