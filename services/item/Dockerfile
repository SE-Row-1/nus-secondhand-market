FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

FROM oven/bun AS production

WORKDIR /app

COPY --from=build /app/dist/index.js .

CMD ["bun", "index.js"]
