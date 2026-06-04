# Unified Personnel System — Backend

Express 5 REST API for managing university personnel records, organizational units, and authentication.

## Table of contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Authentication](#authentication)
- [Authorization](#authorization)
- [API reference](#api-reference)
- [Database](#database)
- [Error handling](#error-handling)
- [Logging](#logging)

## Prerequisites

- **Node.js** 18 or later
- **pnpm** (recommended) or npm
- **PostgreSQL** 14+
- **Redis** 6+

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Environment variables

Copy the example file and edit values for your environment:

```bash
cp .env.example .env
```

See [`.env.example`](.env.example) for all required variables.

### 3. Generate JWT keys

The API signs access and refresh tokens with RS256. Create a key pair in the `keys/` directory (already gitignored):

```bash
mkdir keys
openssl genrsa -out keys/private.pem 2048
openssl rsa -in keys/private.pem -pubout -out keys/public.pem
```

Set `PUBLIC_KEY_PATH` and `PRIVATE_KEY_PATH` in `.env` to point at these files.

### 4. Database

Create a PostgreSQL database, set `DATABASE_URL` in `.env`, then apply migrations:

```bash
pnpm db:migrate
```

For schema changes during development you can also use:

```bash
pnpm db:generate   # generate migration from schema changes
pnpm db:push       # push schema directly (dev only)
```

### 5. Start Redis

Ensure Redis is running locally or update `REDIS_URL` in `.env`.

### 6. Run the server

```bash
pnpm dev
```

The server starts on the port defined by `PORT` (default `3000`).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload (`tsx watch`) |
| `pnpm db:generate` | Generate Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push schema to database without migration files |

## Architecture

```
index.ts
├── CORS, rate limiting, JSON body parser
├── Passport JWT initialization
├── Route modules  (/api/*)
└── Global error middleware

src/
├── db/              Drizzle table definitions, relations, client
├── middleware/      Auth, permissions, validation, errors
├── modules/         Feature modules (one folder per domain)
│   └── <module>/
│       ├── *.router.ts      Route definitions
│       ├── *.controller.ts  Request/response handling
│       ├── *.service.ts     Business logic
│       └── *.validator.ts   Zod schemas
├── constants/       Shared constants (e.g. role IDs)
└── utils/           Shared utilities
```

Each feature module follows a consistent layered pattern: **router → controller → service → database**.

### Core entities

| Entity | Description |
|--------|-------------|
| `persons` | Base identity record (name, contact, address, credentials, role) |
| `students` | Student-specific fields linked to a person and course |
| `faculty` | Faculty linked to a person and department |
| `staff` | Staff linked to a person and office |
| `deans` | Dean linked to a person and department |
| `programChairs` | Program chair linked to a person and course |
| `admins` | Admin linked to a person and office |
| `departments` | Academic departments |
| `courses` | Degree programs / courses |
| `offices` | Administrative offices |
| `roles` / `permissions` / `permissionRoles` | RBAC configuration |


## Authentication

All routes under `/api/*` except `/api/auth/*` require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### Auth endpoints (public unless noted)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Authenticate with username and password; returns access and refresh tokens |
| `POST` | `/api/auth/logout` | Invalidate refresh token (requires access token) |
| `POST` | `/api/auth/refresh-token` | Exchange refresh token for a new access token |
| `POST` | `/api/auth/send-otp` | Send password-reset OTP to user's email |
| `POST` | `/api/auth/reset-password` | Reset password using OTP |
| `POST` | `/api/auth/change-password` | Change password while logged in (requires JWT) |

### Token details

- **Algorithm:** RS256 (asymmetric keys)
- **Access token:** Short-lived; used for API requests
- **Refresh token:** Stored in Redis (7-day TTL); used to obtain new access tokens

### Login response example

```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "...",
  "refreshToken": "..."
}
```

## Authorization

Protected routes use the `hasPermission` middleware, which checks the caller's role against permissions stored in the database.

| Permission | Meaning |
|------------|---------|
| `personnel:create:any` | Create personnel records |
| `personnel:read:any` | Read any personnel record |
| `personnel:read:self` | Read own personnel record |
| `personnel:update:any` | Update personnel records |
| `personnel:delete:any` | Delete personnel records |

Role IDs are defined in `src/constants/roles.ts` and must match the database seed/migration values.

## API reference

All protected routes require `Authorization: Bearer <accessToken>`.

### Students — `/api/student`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `GET` | `/` | — | List students |
| `POST` | `/` | `personnel:create:any` | Register a student |
| `GET` | `/:studentId` | `personnel:read:any` or `personnel:read:self` | Get student by ID |
| `PUT` | `/:studentId` | `personnel:update:any` | Update student |
| `DELETE` | `/:studentId` | `personnel:delete:any` | Delete student |

### Faculty — `/api/faculty`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create faculty member |
| `GET` | `/` | `personnel:read:any` | List faculty |
| `GET` | `/:facultyId` | `personnel:read:any` or `personnel:read:self` | Get faculty by ID |
| `PUT` | `/:facultyId` | `personnel:update:any` | Update faculty |
| `DELETE` | `/:facultyId` | `personnel:delete:any` | Delete faculty |

### Staff — `/api/staff`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create staff member |
| `GET` | `/` | `personnel:read:any` | List staff |
| `GET` | `/:staffId` | `personnel:read:any` or `personnel:read:self` | Get staff by ID |
| `PUT` | `/:staffId` | `personnel:update:any` | Update staff |
| `DELETE` | `/:staffId` | `personnel:delete:any` | Delete staff |

### Deans — `/api/dean`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create dean |
| `GET` | `/` | `personnel:read:any` | List deans |
| `GET` | `/:deanId` | `personnel:read:any` or `personnel:read:self` | Get dean by ID |
| `PUT` | `/:deanId` | `personnel:update:any` | Update dean |
| `DELETE` | `/:deanId` | `personnel:delete:any` | Delete dean |

### Program chairs — `/api/program-chair`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create program chair |
| `GET` | `/` | `personnel:read:any` | List program chairs |
| `GET` | `/:programChairId` | `personnel:read:any` or `personnel:read:self` | Get by ID |
| `PUT` | `/:programChairId` | `personnel:update:any` | Update program chair |
| `DELETE` | `/:programChairId` | `personnel:delete:any` | Delete program chair |

### Admins — `/api/admin`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | — | Create admin (no permission gate) |
| `GET` | `/` | `personnel:read:any` | List admins |
| `GET` | `/:adminId` | `personnel:read:any` or `personnel:read:self` | Get admin by ID |
| `PUT` | `/:adminId` | `personnel:update:any` | Update admin |
| `DELETE` | `/:adminId` | `personnel:delete:any` | Delete admin |

### Departments — `/api/department`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create department |
| `GET` | `/` | `personnel:read:any` | List departments |
| `PUT` | `/:departmentId` | `personnel:update:any` | Update department |
| `DELETE` | `/:departmentId` | `personnel:delete:any` | Delete department |

### Courses — `/api/course`

| Method | Path | Permission | Description |
|--------|------|------------|-------------|
| `POST` | `/` | `personnel:create:any` | Create course |
| `GET` | `/` | `personnel:read:any` | List courses |
| `PUT` | `/:courseId` | `personnel:update:any` | Update course |
| `DELETE` | `/:courseId` | `personnel:delete:any` | Delete course |

Request bodies are validated with Zod schemas defined in each module's `*.validator.ts` file.

## Database

- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) with `node-postgres`
- **Schema:** `src/db/*.ts`, exported via `src/db/schema.ts`
- **Migrations:** `drizzle/` (managed by drizzle-kit)
- **Config:** `drizzle.config.ts`

### Enums

| Enum | Values |
|------|--------|
| `StudentStatus` | `active`, `graduated`, `dropped`, `suspended` |
| `StudentType` | `regular`, `irregular` |
| `EmployeeStatus` | `active`, `suspended`, `terminated`, `retired`, `resigned` |
| `EmployeeType` | `Full-time`, `Part-time`, `Contractual` |

## Error handling

Errors are normalized by the global `errorMiddleware`. Responses follow this shape:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| Status | Typical cause |
|--------|---------------|
| `400` | Validation failure or bad request |
| `401` | Missing or invalid token |
| `403` | Insufficient permissions |
| `500` | Unexpected server error |

Application errors are thrown as `AppError` instances with an explicit status code.

## Logging

Winston logs to the console and to files under `logs/`:

- `logs/combined.log` — all log levels
- `logs/error.log` — errors only

Set `LOG_LEVEL` in `.env` (`debug`, `info`, `warn`, `error`).

## Rate limiting

The API applies a global rate limit of **100 requests per 15 minutes** per IP address.

## Security notes

- Never commit `.env` or `keys/` — both are listed in `.gitignore`
- Use strong RSA keys in production (2048-bit minimum)
- Configure `ALLOWED_ORIGINS` to restrict CORS to trusted front-end origins
