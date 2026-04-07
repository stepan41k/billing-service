FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_USE_MOCKS=false
ARG VITE_API_URL=
ARG VITE_ENV=production

ENV VITE_USE_MOCKS=$VITE_USE_MOCKS
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ENV=$VITE_ENV

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443
