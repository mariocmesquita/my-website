# CLAUDE.md — Project Conventions and Architecture

Personal website monorepo (Turborepo + pnpm): `apps/api` (NestJS), `apps/web` (Next.js), `packages/env`, `packages/schemas`, `packages/typescript-config`, `packages/eslint-config`, `packages/prettier-config`.

---

## Rules

- **pnpm only** — never edit `package.json` manually; use `pnpm add/remove/update`
- **Check lib versions first** — read existing `package.json` and fetch latest docs before using any library
- **All text in Brazilian Portuguese** — errors, logs, Zod messages, API responses, UI text
- **No `index.ts` barrel files** — import directly from the file
- `simple-import-sort` is enforced as error — run `eslint --fix` after creating files with imports

---

## Backend (`apps/api`) — NestJS

**Stack**: NestJS · Prisma 7 · PostgreSQL · Firebase Auth · Zod · UUIDv7

**Architecture**:

- Feature modules: `src/modules/<feature>/` — `controller.ts`, `service.ts`, `repository.ts`, `module.ts`
- Infrastructure: `src/common/` — `prisma/`, `firebase/`, `log/`, `guards/`, `filters/`

**Infrastructure details**:

- `PrismaModule` — `@Global()`, provides `PrismaService` everywhere
- `LogModule` — `@Global()`, provides `LogService` everywhere; `GET /logs` (auth-guarded, paginated)
- `FirebaseModule` — provides `FirebaseAuthGuard` + `FirebaseService`
- `AllExceptionsFilter` — global `APP_FILTER`; logs 500+ errors as `level: error`, `eventType: INTERNAL_ERROR`
- `AppThrottlerGuard` — global `APP_GUARD`; logs rate limit hits as `level: security`, `eventType: RATE_LIMIT`
- `FirebaseAuthGuard` — per-endpoint `@UseGuards`; logs auth failures as `level: security`, `eventType: AUTH_FAILURE`

**Key rules**:

- Functional programming, `readonly` on class properties
- Zod validates all incoming payloads; errors in PT-BR
- All IDs: UUIDv7
- Prisma 7: generator is `prisma-client`; import from `'../../generated/prisma/client'`
- CORS enabled in `main.ts`

---

## Frontend (`apps/web`) — Next.js App Router

**Stack**: Next.js · Tailwind CSS 4 · shadcn/ui (new-york, neutral) · React Query · react-hook-form · Zod · Firebase Client SDK · iron-session · sonner

**Directory layout**:

```
src/
├── app/
│   ├── (public)/          # Public pages (landing, project detail, blog)
│   ├── admin/             # Protected admin (dashboard, career, projects, posts, profile)
│   ├── auth/sign-in/
│   ├── api/auth/session/  # iron-session POST/DELETE
│   └── providers.tsx      # QueryClientProvider + Toaster
├── components/
│   ├── form/              # FormField, FormButton, FormError, FormTextarea, FormDatePicker, FormSwitch, MarkdownEditor
│   ├── layout/            # Sidebar, Navbar
│   ├── sections/          # AboutSection, CareerSection, ProjectsSection, PostsSection
│   └── ui/                # TechBadge, ProjectCard, shadcn components
├── hooks/                 # useZodForm, useProfile, useCareer, useProjects, usePosts, useLogs
├── http/                  # Pure client fetch functions (auth, profile, career, project, post, log)
├── server/                # Server-side fetch + DAL (session, profile, career, project, post)
└── proxy.ts               # Route protection (Node.js runtime, replaces middleware.ts)
```

**Key rules**:

- Default to Server Components; `'use client'` only for interactivity/hooks/forms
- `server/*.ts` — server-side fetches with Next.js `cache`; `http/*.ts` — pure client functions
- Forms: `useZodForm<T>(schema, options?)` with `mode: 'onChange'`; `ZodType<T, any>` to support schemas with `.default()`
- Admin pages pattern (sheet): Server Component page → `*PageClient.tsx` (React Query + state) → `*Sheet.tsx` → `*Form.tsx` + field components
- Admin pages pattern (dedicated page): for complex forms — `page.tsx` → `*PageClient.tsx` (list) → `/new/page.tsx` + `/[id]/edit/page.tsx` → `*Editor.tsx` (e.g. posts)
- File uploads: use `<label htmlFor>` to trigger hidden inputs — `inputRef.click()` is blocked inside dialogs
- Route protection: `proxy.ts` protects `/admin`

**Component decomposition**: split when a component has distinct visual sections, mixed concerns, or reusable pieces. State lives as close to use as possible. Parent = orchestrator only.

---

## Shared Packages

**`@my-website/env`** — env validation via `@t3-oss/env-nextjs`. Single `index.ts` used by both apps.

**`@my-website/schemas`** — shared Zod schemas. Current exports: Profile, Career, Project, Post (list item, detail, admin, create, update), Log (entry, list response).

---

## Design Tokens (globals.css)

`--brand: #4a3428` · `--brand-foreground: #f3e9dc` · `--olive: #6c7a4e` · `--background: #f3e9dc` · `--foreground: #2b1e17` · Font: Spectral 400/700 → `font-spectral`

---

## Authentication

**Frontend**: Firebase sign-in → `POST /api/auth/session` → httpOnly cookie (iron-session) → `proxy.ts` verifies on each request. API calls use `Authorization: Bearer <firebase-id-token>`.

**Backend**: Firebase Admin SDK verifies JWT in the guard. No roles.

---

## Environment Variables

All vars in root `.env`. Key vars: `DATABASE_URL`, `FIREBASE_*` (api), `SESSION_SECRET` (min 32 chars), `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_FIREBASE_*`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (web).

---

## Firebase Storage

Bucket: `my-website-7a1fa.firebasestorage.app`. Rules: public read, write disabled (uploads via Admin SDK only). URL format: `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media`. `next.config.ts` remotePatterns includes `firebasestorage.googleapis.com`.
