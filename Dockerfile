FROM node:24.4.1-alpine AS base

# >-----< Install Stage >-----< #
FROM base AS installer

WORKDIR /app/

COPY package-lock.json .
COPY package.json .

RUN npm clean-install

# >-----< Lint Stage >-----< #
FROM base AS linter

WORKDIR /app/

COPY --from=installer /app/node_modules/ node_modules/
COPY source/ source/
COPY eslint.config.js .

RUN npm run lint

# >-----< Build Stage >-----< #
FROM base AS builder

WORKDIR /app/

COPY --from=installer /app/node_modules/ node_modules/
COPY source/ source/
COPY package.json .
COPY tsconfig.json .

RUN npm run build && npm prune --omit=dev

# >-----< Launch Stage >-----< #
FROM base AS launcher

WORKDIR /app/

COPY --from=builder /app/node_modules/ node_modules/
COPY --from=builder /app/out/ out/
COPY package.json .

ENTRYPOINT ["npm", "start"]
