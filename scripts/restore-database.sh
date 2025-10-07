#!/bin/bash
##
# Database Restore Script
# Kroi Auto Center - PostgreSQL Restore Utility
##

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DB_CONTAINER="${DB_CONTAINER:-kroi-postgres-dev}"
DB_USER="${DB_USER:-kroi}"
DB_NAME="${DB_NAME:-kroi_auto_center}"
BACKUP_FILE="$1"

# Check if backup file is provided
if [ -z "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not specified${NC}"
    echo "Usage: $0 <backup_file.sql.gz>"
    echo ""
    echo "Available backups:"
    ls -lh ./backups/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will replace the current database!${NC}"
echo "Database: $DB_NAME"
echo "Container: $DB_CONTAINER"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${YELLOW}❌ Restore cancelled${NC}"
    exit 0
fi

# Check if container is running
if ! docker ps | grep -q "$DB_CONTAINER"; then
    echo -e "${RED}❌ Error: Container $DB_CONTAINER is not running${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Starting database restore...${NC}"

# Drop and recreate database
echo -e "${YELLOW}📦 Preparing database...${NC}"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS ${DB_NAME};"
docker exec "$DB_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE ${DB_NAME};"

# Restore backup
echo -e "${YELLOW}📥 Restoring backup...${NC}"
gunzip -c "$BACKUP_FILE" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" "$DB_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database restored successfully!${NC}"
else
    echo -e "${RED}❌ Restore failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✨ Restore process completed!${NC}"
