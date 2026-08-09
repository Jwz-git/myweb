#!/bin/sh
set -eu
until pg_isready -h 127.0.0.1 -U blog -d blog >/dev/null 2>&1; do sleep 1; done
export PGPASSWORD="$POSTGRES_PASSWORD"
psql -h 127.0.0.1 -U blog -d blog -f /app/migrations/001_initial.sql >/dev/null
exec node /app/api/server.js

