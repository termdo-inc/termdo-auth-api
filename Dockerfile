# >-----< BASE STAGE >-----< #

FROM node:24.4-alpine AS base
ENV CI=true

RUN \
  addgroup --system appgroup && \
  adduser --system --no-create-home --ingroup appgroup appuser

# >-----< INSTALL STAGE >-----< #

FROM base AS installer

WORKDIR /app/

COPY \
  package-lock.json \
  package.json ./

RUN npm clean-install

# >-----< BUILD STAGE >-----< #

FROM base AS builder

WORKDIR /app/

COPY --from=installer /app/node_modules/ node_modules/
COPY source/ source/
COPY \
  package.json \
  tsconfig.json \
  tsconfig.prod.json ./

RUN \
  npm run build-prod && \
  npm prune --omit=dev

# >-----< RUN STAGE >-----< #

FROM base AS runner

USER appuser

ENV NODE_ENV=production

WORKDIR /app/

COPY --from=builder --chown=appuser:appgroup /app/node_modules/ node_modules/
COPY --from=builder --chown=appuser:appgroup /app/out/ out/

ENTRYPOINT ["node", "out/main.js"]
