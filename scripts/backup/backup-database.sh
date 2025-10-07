#!/bin/bash
#
# Database Backup Script for Kroi Auto Center
# This script creates timestamped backups of the PostgreSQL database
#
# Usage: ./backup-database.sh [environment]
# Example: ./backup-database.sh production
#

set -e

# Configuration
ENVIRONMENT="${1:-production}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/kroi-auto-center}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="kroi_db_${ENVIRONMENT}_${TIMESTAMP}.sql.gz"

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

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    error "DATABASE_URL environment variable is not set"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

log "Starting database backup for environment: $ENVIRONMENT"

# Perform backup
log "Creating backup: $BACKUP_FILE"
if pg_dump "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"; then
    log "Backup created successfully: ${BACKUP_DIR}/${BACKUP_FILE}"

    # Get file size
    SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
    log "Backup size: $SIZE"
else
    error "Failed to create backup"
    exit 1
fi

# Verify backup
log "Verifying backup integrity..."
if gunzip -t "${BACKUP_DIR}/${BACKUP_FILE}"; then
    log "Backup integrity verified"
else
    error "Backup verification failed"
    exit 1
fi

# Clean up old backups
log "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "kroi_db_${ENVIRONMENT}_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
log "Old backups cleaned up"

# List recent backups
log "Recent backups:"
ls -lh "$BACKUP_DIR" | grep "kroi_db_${ENVIRONMENT}" | tail -5

# Upload to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
    log "Uploading backup to S3..."
    if aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" "s3://${AWS_S3_BUCKET}/backups/${BACKUP_FILE}"; then
        log "Backup uploaded to S3 successfully"
    else
        warn "Failed to upload backup to S3"
    fi
fi

log "Backup process completed successfully"

# Send notification (optional)
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\":\"✅ Database backup completed: $BACKUP_FILE ($SIZE)\"}"
fi

exit 0