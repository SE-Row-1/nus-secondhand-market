FROM node:lts-alpine AS build

WORKDIR /app

RUN apk add --no-cache libc6-compat

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN pnpm run build

FROM node:lts-alpine AS production

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build /app/.next/standalone .

ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
