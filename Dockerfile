# >-----< BASE STAGE >-----< #

FROM node:24.6-alpine AS base

ENV CI=true

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

# >-----< TEST STAGE >-----< #

FROM builder AS tester

RUN npm run test

# >-----< RUN STAGE >-----< #

FROM gcr.io/distroless/nodejs24-debian12:nonroot AS runner

ENV NODE_ENV=production

WORKDIR /app/

COPY --from=builder /app/node_modules/ node_modules/
COPY --from=builder /app/out/ out/

CMD ["out/main.js"]
