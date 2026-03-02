# CLAUDE.md — Project Conventions and Architecture

This file defines the rules, conventions, and architectural decisions for this project. Follow it strictly across all sessions.

---

## Overview

Personal website with CV, portfolio, projects, and blog. Monorepo managed with **Turborepo** and **pnpm**.

---

## Monorepo Structure

```
my-website/
├── apps/
│   ├── api/          # Backend — NestJS
│   └── web/          # Frontend — Next.js
├── packages/
│   └── shared/       # Shared library (Zod schemas, types, etc.)
├── docker-compose.yml
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Package Manager

- **Always use pnpm** to install, remove, or update dependencies:
  - Install: `pnpm add <package>` (or `pnpm add -D` for devDependencies)
  - Remove: `pnpm remove <package>`
  - Update: `pnpm update <package>`
  - **Never manually edit `package.json` files** to add or remove dependencies — always use the commands above.

---

## Library Versioning Rule

- **Never assume a library's version.**
- Before using any lib:
  1. Check if it already exists in any `package.json` in the project (root, `apps/api`, `apps/web`, or `packages/shared`).
  2. Search the web for the library's latest documentation to know how to implement it correctly.
- This ensures compatibility and use of the most up-to-date APIs.

---

## `apps/api` — Backend (NestJS)

### Stack

- **Framework**: NestJS
- **ORM**: Prisma
- **Database**: PostgreSQL (via Docker Compose)
- **Authentication**: Firebase Auth (JWT token verification in guards)
- **Validation**: Zod (schemas from `packages/shared`)
- **IDs**: UUIDv7 in the PostgreSQL database

### Layered Architecture

```
api/src/
├── modules/
│   └── <feature>/
│       ├── <feature>.controller.ts   # HTTP entry point, request validation
│       ├── <feature>.service.ts      # Business logic
│       ├── <feature>.repository.ts   # Database access via Prisma
│       └── <feature>.module.ts       # NestJS module
├── common/
│   ├── guards/                       # Firebase Auth guard
│   ├── filters/                      # Exception filters
│   ├── interceptors/
│   └── pipes/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── main.ts
```

### Backend Conventions

- **Functional programming and clean code** — prefer pure functions, avoid state mutation, compose pipelines.
- All business logic lives in the service; the controller only routes and validates input.
- Use `readonly` on class properties whenever possible.
- Errors, logs, validation messages, and API responses must be in **Brazilian Portuguese**.
- Use Zod to validate incoming payloads, importing schemas from `packages/shared`.
- Firebase Auth guards protect private endpoints; no permission system for now (authenticated or not).
- All database IDs must use **UUIDv7**.

### Database and Docker

- PostgreSQL is configured via `docker-compose.yml` at the monorepo root.
- Use `prisma migrate dev` for development and `prisma migrate deploy` for production.
- The connection string comes from the `DATABASE_URL` environment variable.

---

## `apps/web` — Frontend (Next.js)

### Stack

- **Framework**: Next.js (App Router)
- **Validation**: Zod (schemas from `packages/shared`)
- **Data fetching**: React Query (for client components with caching)
- **Forms**: react-hook-form (integrated with Zod via `@hookform/resolvers/zod`)
- **Styling**: TBD

### Frontend Conventions

- **Functional programming and clean code** — use functional components and hooks, avoid classes.
- Requests to `apps/api` via React Query with proper cache settings (staleTime, gcTime).
- Forms use react-hook-form with Zod validation.
- Validation errors, feedback messages, and UI text must be in **Brazilian Portuguese**.
- Default to Server Components; use Client Components only when needed (interactivity, React Query, forms).

---

## `packages/shared` — Shared Library

- Contains Zod schemas reused by both frontend and backend.
- Contains shared TypeScript types (DTOs, enums, etc.).
- Exported as an internal workspace package (`@my-website/shared`).

---

## Language

All of the following must be in **Brazilian Portuguese**:

- Error messages (API and frontend)
- Log messages (backend)
- Zod validation errors
- API responses (`message`, `error` fields, etc.)
- User interface text

---

## Authentication

- Firebase Auth is used to authenticate the user on the frontend.
- The Firebase JWT token is sent in the `Authorization: Bearer <token>` header on requests to the backend.
- A NestJS guard verifies and decodes the token via the Firebase Admin SDK.
- No roles or permission system for now — any valid token grants access to private endpoints.

---

## Environment Variables

- Backend: `.env` file at `apps/api/`
- Frontend: `.env.local` file at `apps/web/`
- Never commit `.env` files with real values.
- Keep `.env.example` files with all required keys and placeholder values.
