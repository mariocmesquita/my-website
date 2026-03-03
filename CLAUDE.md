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
│   ├── env/                  # @my-website/env — env validation (@t3-oss/env-nextjs)
│   ├── typescript-config/    # Shared TypeScript configs
│   ├── eslint-config/        # Shared ESLint configs
│   └── prettier-config/      # Shared Prettier config
├── .env                      # All env vars (root — shared by both apps)
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
  1. Check if it already exists in any `package.json` in the project (root, `apps/api`, `apps/web`, or any package).
  2. Search the web for the library's latest documentation to know how to implement it correctly.
- This ensures compatibility and use of the most up-to-date APIs.

---

## `apps/api` — Backend (NestJS)

### Stack

- **Framework**: NestJS
- **ORM**: Prisma 7
- **Database**: PostgreSQL (via Docker Compose)
- **Authentication**: Firebase Auth (JWT token verification in guards)
- **Validation**: Zod (installed at root — available to all packages)
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
- Use Zod to validate incoming payloads (Zod is installed at monorepo root).
- Firebase Auth guards protect private endpoints; no permission system for now (authenticated or not).
- All database IDs must use **UUIDv7**.

### Prisma 7 Specifics

- Generator name: `prisma-client` (not `client`)
- Import the Prisma client with: `from '../../generated/prisma'` (not `@prisma/client`)
- Use `prisma migrate dev` for development and `prisma migrate deploy` for production.

### Database and Docker

- PostgreSQL is configured via `docker-compose.yml` at the monorepo root.
- The connection string comes from the `DATABASE_URL` environment variable.

---

## `apps/web` — Frontend (Next.js)

### Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS 4, shadcn/ui (new-york style, neutral base)
- **Validation**: Zod (installed at root — available to all packages)
- **Data fetching**: React Query (for client components with caching)
- **Forms**: react-hook-form (integrated with Zod via `@hookform/resolvers/zod`)
- **Authentication**: Firebase Client SDK + iron-session (httpOnly cookie sessions)
- **Notifications**: sonner (toast)

### Directory Structure

```
web/src/
├── app/
│   ├── api/auth/session/route.ts   # POST/DELETE session endpoints (iron-session)
│   ├── auth/sign-in/               # Sign-in page
│   ├── dashboard/                  # Protected route
│   ├── proxy.ts                    # Route protection (replaces middleware.ts)
│   └── providers.tsx               # QueryClientProvider + Toaster
├── components/
│   ├── form/                       # FormField, FormButton, FormError
│   ├── layout/                     # Sidebar, Navbar
│   ├── sections/                   # AboutSection, CareerSection, ProjectsSection, PostsSection
│   └── ui/                         # TechBadge, BackToTopButton, shadcn components
├── hooks/
│   └── useZodForm.ts               # Generic form hook with Zod resolver
├── http/
│   └── auth.ts                     # Pure HTTP client functions (postSession, deleteSession)
└── lib/
    ├── firebase.ts                 # Firebase init + useAuth() hook
    ├── session.ts                  # iron-session DAL (server-only)
    └── utils.ts
```

### Frontend Conventions

- **Functional programming and clean code** — use functional components and hooks, avoid classes.
- Default to Server Components; use Client Components only when needed (interactivity, React Query, forms).
- Requests to `apps/api` via React Query with proper cache settings (staleTime, gcTime).
- Forms use react-hook-form with Zod validation via the `useZodForm` hook.
- Validation errors, feedback messages, and UI text must be in **Brazilian Portuguese**.
- Route protection via `proxy.ts` (not middleware.ts) — Node.js runtime.
- Session DAL in `lib/session.ts` (server-only) — functions: `getSession()`, `setSession()`, `clearSession()`, `verifySession()`.
- HTTP client functions in `http/` folder — pure functions, no side effects.

### Design Tokens (globals.css)

- `--brand: #4a3428` → `bg-brand`, `text-brand`, `border-brand`
- `--brand-foreground: #f3e9dc` → `text-brand-foreground`
- `--olive: #6c7a4e` → `text-olive` (links)
- `--background: #f3e9dc` (warm cream)
- `--foreground: #2b1e17` (dark brown)
- Font: Spectral (Google Fonts, weight 400/700) → `font-spectral` utility

---

## `packages/env` — Environment Validation

- Package: `@my-website/env`
- Validates all environment variables using `@t3-oss/env-nextjs` and Zod.
- `index.ts`: full env schema (API + web vars) — used by `apps/api`
- `web.ts`: client-only schema (NEXT*PUBLIC*\* vars) — used by `apps/web`
- Import: `import { env } from '@my-website/env'`

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

### Frontend (Thin Cookie Bridge Pattern)

1. Firebase Client SDK handles sign-in (`signInWithEmailAndPassword`)
2. After sign-in, `POST /api/auth/session` creates an httpOnly cookie via iron-session
3. `proxy.ts` protects private routes by verifying the session cookie server-side
4. API calls include Firebase ID token in `Authorization: Bearer <token>` header

**Key files:**

- `lib/firebase.ts` — Firebase init + `useAuth()` hook (`{ user, isLoading, getToken, signOut }`)
- `lib/session.ts` — iron-session DAL (server-only): `getSession()`, `setSession(uid, email)`, `clearSession()`, `verifySession()`
- `http/auth.ts` — pure functions: `postSession()`, `deleteSession()`
- `app/proxy.ts` — protects `/dashboard`, redirects authenticated users away from `/auth/sign-in`

### Backend (NestJS Guard)

- Firebase Admin SDK verifies JWT tokens in the `Authorization: Bearer <token>` header.
- Guard at `common/guards/firebase-auth.guard.ts`.
- No roles or permission system for now — any valid token grants access to private endpoints.

---

## Environment Variables

- **All env vars live in a single `.env` file at the monorepo root.**
- Each app also has its own `.env.example` (scoped to its own vars) for reference.
- The root `.env.example` contains all vars for both apps.
- Never commit `.env` files with real values.
- `packages/env` validates all vars at runtime using `@t3-oss/env-nextjs`.

### Variables

| Variable                                   | Used by                          |
| ------------------------------------------ | -------------------------------- |
| `DATABASE_URL`                             | api                              |
| `FIREBASE_PROJECT_ID`                      | api                              |
| `FIREBASE_CLIENT_EMAIL`                    | api                              |
| `FIREBASE_PRIVATE_KEY`                     | api                              |
| `SERVER_PORT`                              | api                              |
| `NODE_ENV`                                 | api                              |
| `SESSION_SECRET`                           | web (iron-session, min 32 chars) |
| `NEXT_PUBLIC_API_URL`                      | web                              |
| `NEXT_PUBLIC_FIREBASE_API_KEY`             | web                              |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`         | web                              |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`          | web                              |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`      | web                              |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | web                              |
| `NEXT_PUBLIC_FIREBASE_APP_ID`              | web                              |
