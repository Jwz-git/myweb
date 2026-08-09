FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api ./apps/api
COPY packages ./packages
RUN npm ci && npm run build -w @jwz/api
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY apps/api/migrations ./migrations
CMD ["sh","-c","node dist/migrate.js && node dist/server.js"]
