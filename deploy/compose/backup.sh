#!/bin/sh
set -eu
mkdir -p "${BACKUP_DIR:-/backups}"
file="${BACKUP_DIR:-/backups}/blog-$(date +%Y%m%d-%H%M%S).sql.gz"
docker compose exec -T db pg_dump -U blog blog | gzip > "$file"
find "${BACKUP_DIR:-/backups}" -name 'blog-*.sql.gz' -mtime +14 -delete
echo "$file"
