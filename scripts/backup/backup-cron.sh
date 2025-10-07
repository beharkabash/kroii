#!/bin/bash
#
# Automated Backup Cron Script
# Add to crontab for automated backups
#
# Crontab examples:
# Daily at 2 AM:        0 2 * * * /path/to/backup-cron.sh
# Every 6 hours:        0 */6 * * * /path/to/backup-cron.sh
# Weekly on Sunday:     0 2 * * 0 /path/to/backup-cron.sh
#

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source environment variables
if [ -f "$SCRIPT_DIR/../../.env.production" ]; then
    set -a
    source "$SCRIPT_DIR/../../.env.production"
    set +a
fi

# Run backup
"$SCRIPT_DIR/backup-database.sh" production 2>&1 | logger -t kroi-backup

# Upload static files to S3 (optional)
if [ -n "$AWS_S3_BUCKET" ]; then
    aws s3 sync /path/to/public/cars "s3://${AWS_S3_BUCKET}/static/cars" \
        --delete \
        --exclude "*" \
        --include "*.jpg" \
        --include "*.png" \
        --include "*.webp" \
        2>&1 | logger -t kroi-static-backup
fi

exit 0