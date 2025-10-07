#!/bin/bash
#
# Database Restore Script for Kroi Auto Center
# This script restores a PostgreSQL database from a backup file
#
# Usage: ./restore-database.sh <backup_file>
# Example: ./restore-database.sh /var/backups/kroi-auto-center/kroi_db_production_20250927_120000.sql.gz
#

set -e

# Configuration
BACKUP_FILE="${1}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/kroi-auto-center}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Validate inputs
if [ -z "$BACKUP_FILE" ]; then
    error "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lh "$BACKUP_DIR" | grep ".sql.gz"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    error "Backup file not found: $BACKUP_FILE"
    exit 1
fi

if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Confirm restore
warn "⚠️  WARNING: This will OVERWRITE the current database!"
warn "Backup file: $BACKUP_FILE"
read -p "Are you sure you want to continue? (yes/no): " -r
echo
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    log "Restore cancelled"
    exit 0
fi

# Create a backup of current database before restore
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PRE_RESTORE_BACKUP="pre_restore_${TIMESTAMP}.sql.gz"
log "Creating backup of current database: $PRE_RESTORE_BACKUP"
pg_dump "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${PRE_RESTORE_BACKUP}"
log "Pre-restore backup created"

# Verify backup file integrity
log "Verifying backup file integrity..."
if ! gunzip -t "$BACKUP_FILE"; then
    error "Backup file is corrupted"
    exit 1
fi
log "Backup file verified"

# Restore database
log "Restoring database from: $BACKUP_FILE"
gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"

if [ $? -eq 0 ]; then
    log "✅ Database restored successfully"
    log "Pre-restore backup saved at: ${BACKUP_DIR}/${PRE_RESTORE_BACKUP}"
else
    error "Failed to restore database"
    warn "Rolling back using pre-restore backup..."
    gunzip -c "${BACKUP_DIR}/${PRE_RESTORE_BACKUP}" | psql "$DATABASE_URL"
    error "Restore failed and rolled back"
    exit 1
fi

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"✅ Database restored from: $(basename $BACKUP_FILE)\"}"
fi

exit 0