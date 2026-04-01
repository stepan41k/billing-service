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

FROM node:22-alpine
RUN npm install -g serve

COPY --from=builder /app/dist /dist

EXPOSE 3000
CMD ["serve", "-s", "/dist", "-l", "3000"]