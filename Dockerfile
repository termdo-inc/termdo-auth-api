# >-----< CONFIG STAGE >-----< #

# >-----< BASE STAGE >-----< #

FROM node:24.4-alpine AS base

# >-----< INSTALL STAGE >-----< #

FROM base AS installer

WORKDIR /app/

COPY package-lock.json .
COPY package.json .

RUN npm clean-install

# >-----< LINT STAGE >-----< #

FROM base AS linter

WORKDIR /app/

COPY --from=installer /app/node_modules/ node_modules/
COPY source/ source/
COPY eslint.config.js .

RUN npm run lint

# >-----< BUILD STAGE >-----< #

FROM base AS builder

WORKDIR /app/

COPY --from=installer /app/node_modules/ node_modules/
COPY source/ source/
COPY package.json .
COPY tsconfig.json .

RUN npm run build && npm prune --omit=dev

# >-----< LAUNCH STAGE >-----< #

FROM base AS launcher

WORKDIR /app/

COPY --from=builder /app/node_modules/ node_modules/
COPY --from=builder /app/out/ out/

ENTRYPOINT ["node", "out/main.js"]
