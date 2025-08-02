# >-----< BASE STAGE >-----< #

FROM node:24.4-alpine AS base

RUN addgroup --system appgroup && \
  adduser --system --no-create-home --ingroup appgroup appuser

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

# >-----< RUN STAGE >-----< #

FROM base AS runner

USER appuser

WORKDIR /app/

COPY --from=builder --chown=appuser:appgroup /app/node_modules/ node_modules/
COPY --from=builder --chown=appuser:appgroup /app/out/ out/

ENTRYPOINT ["node", "out/main.js"]
