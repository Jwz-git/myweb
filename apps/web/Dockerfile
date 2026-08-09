FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps ./apps
COPY packages ./packages
COPY content ./content
RUN npm ci && VITE_BASE_PATH=/ VITE_SERVER_FEATURES=true npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY deploy/nginx/default.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD wget -qO- http://127.0.0.1/healthz || exit 1
