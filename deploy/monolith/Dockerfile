FROM node:20-alpine AS build
ARG SITE_URL=https://blog.jwzlab.com
ARG VITE_SITE_URL=https://blog.jwzlab.com
ENV SITE_URL=$SITE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
WORKDIR /app
COPY package*.json ./
COPY apps ./apps
COPY packages ./packages
COPY content ./content
COPY deploy ./deploy
RUN npm ci \
 && npm run build -w @jwz/api \
 && VITE_BASE_PATH=/ VITE_SERVER_FEATURES=true npm run build

FROM postgres:16-alpine
RUN apk add --no-cache nodejs caddy supervisor wget
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./api
COPY --from=build /app/apps/api/migrations ./migrations
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY deploy/monolith/Caddyfile /etc/caddy/Caddyfile
COPY deploy/monolith/supervisord.conf /etc/supervisord.conf
COPY deploy/monolith/entrypoint.sh /usr/local/bin/jwz-entrypoint
COPY deploy/monolith/start-api.sh /usr/local/bin/start-api
RUN chmod +x /usr/local/bin/jwz-entrypoint /usr/local/bin/start-api \
 && mkdir -p /data/caddy /config/caddy /var/log/supervisor \
 && chown -R postgres:postgres /var/lib/postgresql
ENV PGDATA=/var/lib/postgresql/data
ENV XDG_DATA_HOME=/data
ENV XDG_CONFIG_HOME=/config
EXPOSE 80 443
VOLUME ["/var/lib/postgresql/data", "/data/caddy", "/config/caddy"]
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- http://127.0.0.1/healthz || exit 1
ENTRYPOINT ["jwz-entrypoint"]
