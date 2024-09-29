# Build Hono standalone server.

FROM oven/bun AS build

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Copy and serve only the necessary files.

FROM oven/bun AS production

WORKDIR /app

COPY --from=build /app/dist/index.js .

EXPOSE ${PORT}

CMD ["bun", "index.js"]
