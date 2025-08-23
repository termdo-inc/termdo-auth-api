# Termdo Auth API

Internal microservice for user authentication and token issuance. Provides login, signup, and token refresh using JWT, backed by PostgreSQL.

This service is part of the Termdo system alongside:

- **termdo-gateway-api:** Edge/API gateway and routing
- **termdo-tasks-api:** Core domain APIs for tasks
- **termdo-web:** Frontend web application
- **termdo-db:** Database assets (schemas, migrations, seed data)

## Features

- Login, Signup, and Token Refresh endpoints
- JWT generation and verification (60m expiration)
- Bcrypt password hashing with per-password salt
- PostgreSQL connection pool with startup connectivity test
- Consistent response envelope with machine-readable error codes
- Express 5 middleware for logging, 405/404 handling, and failures

## Tech Stack

- Runtime: Node.js 24 (see `.nvmrc`)
- Language: TypeScript (strict), compiled to `out/`
- Web: Express 5
- Auth: `jsonwebtoken`
- Crypto: `bcrypt`
- DB: `pg` (PostgreSQL)
- Lint/Format: ESLint + Prettier
- Container: Multi-stage Docker (distroless runtime)

## Getting Started

### Prerequisites

- Node `v24.6.0` (or use `nvm use`)
- A reachable PostgreSQL instance
- An `.env` file (see `.env.example`)

### Environment Variables

- `APP_PORT`: Port number to listen on
- `APP_SECRET`: JWT signing secret
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_USER`: PostgreSQL user
- `DB_PASSWORD`: PostgreSQL password
- `DB_NAME`: PostgreSQL database name

Create a `.env` file by copying `.env.example` and filling values accordingly.

### Install, Build, Run (Local)

```bash
npm ci
npm run build-dev   # or: npm run build-prod
npm run dev         # reads env from .env and runs out/main.js
```

Server logs include request/response details and a pool connectivity test on startup.

### Docker

Builds to a distroless image using multi-stage Dockerfile.

```bash
docker build -t termdo-auth-api:local .
docker run --rm --env-file .env -p 8080:8080 termdo-auth-api:local
```

Alternatively, use the provided compose file (expects external DB on the same network):

```bash
docker compose up --build
```

## Database

The service expects an `account` table with fields referenced by the code:

- `account_id` (integer, primary key)
- `username` (text, unique)
- `password` (text, bcrypt hash)

Example schema:

```sql
CREATE TABLE IF NOT EXISTS account (
  account_id SERIAL PRIMARY KEY,
  username   TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL
);
```

## API

All responses share a common envelope and include a hostname header:

- Header: `X-Hostname: <server-hostname>`
- Body:
  - `httpStatus`: `{ code: number, message: string }`
  - `serverError`: `{ name: string, message: string, stackTrace?: string } | null`
  - `clientErrors`: `Array<{ code: number, message: string }>`
  - `data`: endpoint-specific payload or `null`
  - `token`: JWT string or `null`

### POST /login

- Route: `/login/`
- Body:
  - `username`: string
  - `password`: string
- Success: `200 OK`
  - `data`: `{ accountId: number, username: string }`
  - `token`: `string` (JWT, 60m)
- Errors: `400 BAD_REQUEST`, `404 NOT_FOUND`, `409 CONFLICT`

Example:

```bash
curl -sS -X POST http://localhost:$APP_PORT/login/ \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"P@ssw0rd!"}'
```

### POST /signup

- Route: `/signup/`
- Body:
  - `username`: string
  - `password`: string
- Success: `201 CREATED`
  - `data`: `{ accountId: number, username: string }`
  - `token`: `string` (JWT, 60m)
- Errors: `400 BAD_REQUEST`, `409 CONFLICT`

Example:

```bash
curl -sS -X POST http://localhost:$APP_PORT/signup/ \
  -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"P@ssw0rd!"}'
```

### GET /refresh

- Route: `/refresh/` (private)
- Headers:
  - `Authorization: Bearer <token>`
- Success: `200 OK`
  - `data`: `{ accountId: number }`
  - `token`: `string` (new JWT)
- Errors: `400 BAD_REQUEST`, `401 UNAUTHORIZED`, `403 FORBIDDEN`

Example:

```bash
curl -sS -X GET http://localhost:$APP_PORT/refresh/ \
  -H "Authorization: Bearer $TOKEN"
```

## Validation Rules

- Username:
  - Length: 2–32
  - Allowed: letters (A–Z, a–z), digits (0–9), dot (`.`), underscore (`_`)
- Password:
  - Minimum length: 4
  - Must include: at least one lowercase letter, one uppercase letter, one digit, one special character
  - No whitespace (regex uses `\S+`)

If validation fails, errors appear in `clientErrors` with specific codes/messages.

## Middleware & Behavior

- Logging: Request method/url, headers, and body are logged for non-`/_internal` paths.
- Method Guard: Returns `405` when a route exists but method is not allowed.
- Not Found: Returns `404` for unmatched routes.
- Failure Handler: Returns `500` with structured server error.
- Host Header: `X-Hostname` is included in controller responses.

## Development

- Lint: `npm run lint`
- Format: `npm run format`
- Clean build artifacts: `npm run clean`

TypeScript builds to `out/`. The app entrypoint is `out/main.js`.

## Integration Notes

- The API is typically called via `termdo-gateway-api`.
- Other services (e.g., `termdo-tasks-api`) should validate JWTs minted here.
- Docker Compose uses the `termdo-net` network; ensure the DB is reachable on that network (see `termdo-db` or your infrastructure setup in `termdo-infra`).

## License

MIT — see `LICENSE.md`.
