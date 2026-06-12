# Gateway

The API Gateway is the single entry point for all client requests in the . It handles routing, authentication, rate limiting, and proxying to downstream microservices.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [Middleware](#middleware)
- [Routes](#routes)
- [Logging](#logging)
- [Error Handling](#error-handling)

---

## Overview

The Gateway sits in front of all microservices. Every request from a client passes through here first. It is responsible for:

- **JWT authentication** — verifies RS256-signed tokens before forwarding to protected services
- **Rate limiting** — global and per-route limits to prevent abuse
- **Reverse proxying** — forwards requests to the appropriate downstream service
- **Request logging** — logs every request with method, path, status code, and IP
- **CORS** — restricts cross-origin requests to configured allowed origins

---

## Architecture

```
Client
  │
  ▼
Gateway (port 3000)
  │
  ├── Public routes  ──────────────────────────────► IAS (port 3001)
  │
  └── Protected routes
        │
        ├── JWT verification (passport-jwt / RS256)
        │
        └── Proxy with x-user-id & x-user-role headers ► IAS (port 3001)
```

Authenticated user identity (`userId`, `role`) is extracted from the JWT and forwarded to downstream services via the `x-user-id` and `x-user-role` HTTP headers.

---

## Prerequisites

- Node.js >= 18
- pnpm >= 10
- An RS256 key pair (public key required by Gateway; private key required by IAS)

---

## Setup

```bash
# Install dependencies
pnpm install

# Copy the environment file and fill in values
cp .env.example .env   # or manually create .env — see Environment Variables section
```

Place your RS256 **public key** at the path specified by `PUBLIC_KEY_PATH` (default: `./src/keys/public.pem`).

---

## Environment Variables

| Variable          | Required | Default                                          | Description                                           |
|-------------------|----------|--------------------------------------------------|-------------------------------------------------------|
| `PORT`            | No       | `3000`                                           | Port the Gateway listens on                           |
| `PUBLIC_KEY_PATH` | Yes      | —                                                | Path to the RS256 public key PEM file                 |
| `ALLOWED_ORIGINS` | No       | `""` (no origins allowed)                        | Comma-separated list of allowed CORS origins          |

Example `.env`:

```env
PORT=3000
PUBLIC_KEY_PATH=./src/keys/public.pem
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

---

## Running the Server

```bash
# Development (with hot reload)
pnpm dev

# The server starts at http://localhost:3000
```

---

## Project Structure

```
Gateway/
├── src/
│   ├── index.ts              # App entry point — registers middleware, routes, and starts server
│   ├── middleware/
│   │   ├── authenticate.ts   # Passport JWT authentication middleware
│   │   ├── createProxy.ts    # HTTP reverse proxy factory (http-proxy)
│   │   ├── errorHandler.ts   # Global Express error handler
│   │   ├── passport.ts       # Passport JWT strategy setup (RS256)
│   │   ├── rateLimit.ts      # Rate limiter factory (express-rate-limit)
│   │   └── requestLogger.ts  # Per-request logging middleware
│   ├── routes/
│   │   └── IAS.routes.ts     # All Identity & Access Service route definitions
│   ├── types/
│   │   └── Routes.types.ts   # RouteConfig type definition
│   └── utils/
│       ├── AppError.ts       # Custom error class with statusCode
│       └── logger.ts         # Winston logger (file + console transports)
├── logs/
│   ├── combined.log          # All log levels
│   └── error.log             # Error-level logs only
├── .env                      # Local environment variables (not committed)
├── package.json
└── tsconfig.json
```

---

## Middleware

### `authenticate`

Verifies the `Authorization: Bearer <token>` header using Passport's JWT strategy with RS256. On success, attaches `{ userId, role }` to `req.user`. Returns `401` if the token is missing or invalid.

### `createProxy`

Factory that creates an `http-proxy` middleware targeting a given URL. Before forwarding, it injects two headers from the authenticated user:

| Header        | Value             |
|---------------|-------------------|
| `x-user-id`   | `userId` (string) |
| `x-user-role` | `role`            |

### `requestLogger`

Logs each completed request in the format:

```
[info] 2026-06-12T10:00:00.000Z: POST /IAS/auth/session 200 - ::1
```

Log level is determined by status code: `error` (5xx), `warn` (4xx), `info` (2xx/3xx).

### `rateLimit`

Configurable rate limiter. Two limits are applied:

| Scope          | Window   | Max Requests |
|----------------|----------|--------------|
| Global (`/IAS`)| 15 min   | 100          |
| Login endpoint | 10 min   | 5            |

### `errorHandler`

Catches all errors passed via `next(error)`. Returns a JSON response:

```json
{
  "success": false,
  "error": "Error message"
}
```

`5xx` errors are logged at `error` level with stack trace; `4xx` at `warn`.

---

## Routes

All routes are prefixed with `/IAS` at the Gateway level and proxied to `http://localhost:3001/IAS`.

### Public Routes (no authentication required)

| Method | Path                           | Description                        |
|--------|--------------------------------|------------------------------------|
| `POST` | `/IAS/auth/session`            | Login (rate limited: 5/10min)      |
| `POST` | `/IAS/auth/token`              | Refresh access token               |
| `POST` | `/IAS/auth/password/reset-request` | Request password reset OTP    |
| `POST` | `/IAS/auth/otp/verify`         | Verify OTP                         |
| `POST` | `/IAS/auth/password/reset`     | Reset password                     |


### Protected Routes (JWT required)

| Method   | Path                                   | Description                            |
|----------|----------------------------------------|----------------------------------------|
| `DELETE` | `/IAS/auth/session`                    | Logout                                 |
| `PATCH`  | `/IAS/auth/password/change`            | Change own password                    |
| `PATCH`  | `/IAS/auth/password/change/:userId`    | Admin: change another user's password  |
| `PATCH`  | `/IAS/users/:id`                       | Update user information                |
| `GET`    | `/IAS/users/:id`                       | Get user by ID                         |
| `GET`    | `/IAS/users`                           | List all users                         |
| `POST`   | `/IAS/users`                           | Register a new user                    |

Protected routes attach `x-user-id` and `x-user-role` headers before proxying. Downstream services use these headers for authorization decisions.

---

## Logging

Logs are written by [Winston](https://github.com/winstonjs/winston) to two destinations:

| Destination         | Format | Level filter |
|---------------------|--------|--------------|
| `logs/error.log`    | JSON   | `error` only |
| `logs/combined.log` | JSON   | All levels   |
| Console             | Colorized text with stack traces | All levels |

Log files are not committed to version control.

---

## Error Handling

All errors flow through the global `errorHandler` middleware. Throw an `AppError` anywhere to produce a structured response:

```typescript
throw new AppError('Resource not found', 404);
// → { "success": false, "error": "Resource not found" }
```

Unmatched routes return a `404` with the method and path included in the message.
