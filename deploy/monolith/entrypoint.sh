#!/bin/sh
set -eu

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  mkdir -p "$PGDATA"
  chown -R postgres:postgres "$PGDATA"
  chmod 700 "$PGDATA"
  pwfile="$(mktemp)"
  printf '%s' "$POSTGRES_PASSWORD" > "$pwfile"
  chown postgres:postgres "$pwfile"
  su-exec postgres initdb -D "$PGDATA" --username=blog --pwfile="$pwfile"
  rm -f "$pwfile"
  su-exec postgres pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start
  su-exec postgres createdb -O blog blog
  su-exec postgres pg_ctl -D "$PGDATA" -m fast -w stop
fi

exec supervisord -c /etc/supervisord.conf

