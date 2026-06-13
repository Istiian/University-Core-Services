# University Core Services

A microservices backend for a university personnel management system. All client traffic flows through a single API Gateway which handles authentication and proxying to downstream services.

## Services

| Service | Port | Description |
|---|---|---|
| [Gateway](./Gateway/README.md) | `3000` | Single entry point — JWT verification, rate limiting, reverse proxy |
| [Identity Access Service (IAS)](./Identity_Access_Service/README.md) | `3001` | Authentication, user management, role-based access control |

## Architecture

```
Client
  │
  ▼
Gateway (port 3000)
  │  Verifies RS256 JWT, injects x-user-id / x-user-role headers
  ▼
Identity Access Service (port 3001)
  │
  ├── PostgreSQL  — user data
  ├── Redis       — token store, OTP, response cache
  └── SMTP        — OTP email delivery
```

Clients interact only with the Gateway. The IAS is an internal service that trusts the headers injected by the Gateway and never re-validates JWTs directly.

## Prerequisites

- Node.js >= 18
- pnpm >= 10
- PostgreSQL
- Redis
- An RS256 key pair (`.pem` files)
- SMTP credentials

## Quick Start

Each service is independently runnable. Start them in order — IAS first, then Gateway — since the Gateway proxies to IAS.

```bash
# 1. Identity Access Service
cd Identity_Access_Service
pnpm install
cp .env.example .env   # fill in DATABASE_URL, key paths, Redis, SMTP
pnpm db:migrate
pnpm dev

# 2. Gateway
cd ../Gateway
pnpm install
cp .env.example .env   # fill in PUBLIC_KEY_PATH
pnpm dev
```

See each service's README for full environment variable reference and setup details.

## Key Design Decisions

- **RS256 JWT** — asymmetric signing means the Gateway only needs the public key to verify tokens; the private key stays inside IAS.
- **Header-based identity propagation** — the Gateway strips client tokens and injects trusted `x-user-id` / `x-user-role` headers, so downstream services don't need JWT logic.
- **Redis caching** — user records and paginated list queries are cached to reduce database load; a version counter invalidates list caches on any user update.
- **PDF credential slip** — when a new user is created, the system auto-generates credentials and returns a PDF slip directly in the response.

## Repository Structure

```
University Core Services/
├── Gateway/                  # API Gateway service
└── Identity_Access_Service/  # Auth & user management service
```
