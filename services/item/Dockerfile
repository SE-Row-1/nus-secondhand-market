FROM oven/bun:alpine AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun:alpine AS production

WORKDIR /app

RUN apk add --no-cache curl

COPY --from=build /app/dist/index.js .

ENV NODE_ENV=production

CMD ["bun", "run", "index.js"]
