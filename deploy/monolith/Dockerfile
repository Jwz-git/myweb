FROM node:20-alpine AS build
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
RUN apk add --no-cache nodejs nginx supervisor wget
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./api
COPY --from=build /app/apps/api/migrations ./migrations
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY deploy/monolith/nginx.conf /etc/nginx/http.d/default.conf
COPY deploy/monolith/supervisord.conf /etc/supervisord.conf
COPY deploy/monolith/entrypoint.sh /usr/local/bin/jwz-entrypoint
COPY deploy/monolith/start-api.sh /usr/local/bin/start-api
RUN chmod +x /usr/local/bin/jwz-entrypoint /usr/local/bin/start-api \
 && mkdir -p /run/nginx /var/log/supervisor \
 && chown -R postgres:postgres /var/lib/postgresql
ENV PGDATA=/var/lib/postgresql/data
EXPOSE 80
VOLUME ["/var/lib/postgresql/data"]
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- http://127.0.0.1/healthz || exit 1
ENTRYPOINT ["jwz-entrypoint"]

