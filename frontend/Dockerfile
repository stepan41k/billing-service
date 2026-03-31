
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

ARG VITE_API_URL=""
ARG VITE_USE_MOCKS="false"
ARG VITE_ENV="prod"

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
ENV VITE_ENV=$VITE_ENV

RUN npm run build

# ── Stage 2: Serve ─────────────────────────────────────────────────────────
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ── Runtime: подставляем BACKEND_URL в nginx.conf ─────────────────────────────
# envsubst заменяет ${BACKEND_URL} в конфиге на реальное значение из env
CMD ["/bin/sh", "-c",   "envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf &&    cp /tmp/nginx.conf /etc/nginx/conf.d/default.conf &&    nginx -g 'daemon off;'"]
