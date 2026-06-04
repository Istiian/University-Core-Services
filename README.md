# Unified Personnel System

A REST API for managing university personnel—students, faculty, staff, deans, program chairs, and administrators—along with organizational data such as departments, courses, and offices.

## Overview

The system provides role-based access control (RBAC) with JWT authentication, permission-gated endpoints, and PostgreSQL persistence via Drizzle ORM. Redis stores refresh tokens and OTP codes for password recovery.

| Component | Technology |
|-----------|------------|
| Runtime | Node.js, TypeScript |
| HTTP | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Cache / sessions | Redis |
| Auth | Passport JWT (RS256), bcrypt |
| Validation | Zod |

## Repository structure

```
Unified Personnel System/
└── backend/          # Express API (see backend/README.md)
    ├── index.ts      # Application entry point
    ├── src/
    │   ├── db/       # Drizzle schema and relations
    │   ├── middleware/
    │   ├── modules/  # Feature modules (auth, student, faculty, …)
    │   └── constants/
    └── drizzle/      # SQL migrations
```

## Quick start

1. **Prerequisites:** Node.js 18+, pnpm, PostgreSQL, Redis
2. **Configure:** Copy `backend/.env.example` to `backend/.env` and fill in values
3. **Install & run:**

```bash
cd backend
pnpm install
pnpm db:migrate
pnpm dev
```

The API listens on `http://localhost:3000` by default.

## Roles

| Role ID | Role |
|---------|------|
| 1 | Admin |
| 2 | Student |
| 3 | Faculty |
| 4 | Staff |
| 5 | Dean |
| 6 | Program Chair |

## Documentation

- **[Backend setup, API reference, and architecture →](backend/README.md)**

## License

ISC — see `backend/package.json` for author details.
