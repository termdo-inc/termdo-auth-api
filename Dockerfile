# >-----< Build Stage >-----< #
FROM node:24.4.1-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm clean-install

COPY . .

RUN npm run build

# >-----< Production Stage >-----< #
FROM node:24.4.1-alpine AS production

WORKDIR /app

COPY --from=builder /app/out ./out
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev

CMD ["npm", "start"]
