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
- Infrastructure: `src/common/` — `prisma/`, `firebase/`, `log/`, `guards/`, `filters/`, `locales.ts`

**Infrastructure details**:

- `PrismaModule` — `@Global()`, provides `PrismaService` everywhere
- `LogModule` — `@Global()`, provides `LogService` everywhere; `GET /logs` (auth-guarded, paginated)
- `FirebaseModule` — provides `FirebaseAuthGuard` + `FirebaseService`
- `AllExceptionsFilter` — global `APP_FILTER`; logs 500+ errors as `level: error`, `eventType: INTERNAL_ERROR`
- `AppThrottlerGuard` — global `APP_GUARD`; logs rate limit hits as `level: security`, `eventType: RATE_LIMIT`
- `FirebaseAuthGuard` — per-endpoint `@UseGuards`; logs auth failures as `level: security`, `eventType: AUTH_FAILURE`
- `locales.ts` — `SUPPORTED_LOCALES`, `isValidLocale()`, `resolveLocale()` helpers

**Key rules**:

- Functional programming, `readonly` on class properties
- Zod validates all incoming payloads; errors in PT-BR
- All IDs: UUIDv7
- Prisma 7: generator is `prisma-client`; import from `'../../generated/prisma/client'`
- CORS: prod origins from env, dev allows localhost
- Translation endpoints on all 4 entities (profile, career, project, post): `GET/PUT /:id/translations/:locale`
- Public GETs accept optional `?locale=` param (defaults to `'en'`)

---

## Frontend (`apps/web`) — Next.js App Router

**Stack**: Next.js · next-intl · Tailwind CSS 4 · shadcn/ui (new-york, neutral) · React Query · react-hook-form · Zod · Firebase Client SDK · iron-session · sonner

**Directory layout**:

```
src/
├── app/
│   ├── [locale]/(public)/  # Public pages (landing, project detail, blog) — locale-prefixed
│   ├── admin/              # Protected admin (dashboard, career, projects, posts, profile)
│   ├── auth/sign-in/
│   ├── api/auth/session/   # iron-session POST/DELETE
│   └── providers.tsx       # QueryClientProvider + Toaster
├── components/
│   ├── admin/              # LocaleToggle, OtherLocaleDialog, AdminBreadcrumb, AdminSidebar
│   ├── form/               # FormField, FormButton, FormError, FormTextarea, FormDatePicker, FormSwitch, MarkdownEditor
│   ├── layout/             # Sidebar, Navbar, LanguageSwitcher
│   ├── sections/           # AboutSection, CareerSection, ProjectsSection, PostsSection
│   └── ui/                 # TechBadge, ProjectCard, NotTranslatedBanner, shadcn components
├── hooks/                  # useZodForm, useProfile, useCareer, useProjects, usePosts, useLogs
├── http/                   # Pure client fetch functions (auth, profile, career, project, post, log)
├── i18n/                   # next-intl config: routing.ts, navigation.ts, request.ts
├── server/                 # Server-side fetch + DAL (session, profile, career, project, post)
└── proxy.ts                # Locale detection + route protection (Node.js runtime)
```

**Key rules**:

- Default to Server Components; `'use client'` only for interactivity/hooks/forms
- `server/*.ts` — server-side fetches with Next.js `cache`; `http/*.ts` — pure client functions
- Locale-aware server fetches accept optional `locale` param passed to `?locale=` query
- Forms: `useZodForm<T>(schema, options?)` with `mode: 'onChange'`; `ZodType<T, any>` to support schemas with `.default()`
- Admin pages pattern (sheet): Server Component page → `*PageClient.tsx` (React Query + state) → `*Sheet.tsx` → `*Form.tsx` + field components
- Admin pages pattern (dedicated page): for complex forms — `page.tsx` → `*PageClient.tsx` (list) → `/new/page.tsx` + `/[id]/edit/page.tsx` → `*Editor.tsx` (e.g. posts)
- File uploads: use `<label htmlFor>` to trigger hidden inputs — `inputRef.click()` is blocked inside dialogs
- Route protection: `proxy.ts` detects locale (cookie → Accept-Language → `'en'`), redirects public routes to `/{locale}/...`; admin/auth are locale-free

**Admin translation UX pattern**:

- `LocaleToggle` — segmented EN/PT control in sheet/form headers; switches which locale's fields are visible
- `OtherLocaleDialog` — post-save prompt asking user to update the other locale
- Sheet `onSubmit` signature: `(values, onSuccess: () => void) => void` — parent passes `onSuccess`, sheet decides what to do after (show dialog or close)
- `PostEditor`: separate `enMethods`/`ptMethods` for TipTap instances; `editorReady` flag prevents mounting editor before async data loads

**Component decomposition**: split when a component has distinct visual sections, mixed concerns, or reusable pieces. State lives as close to use as possible. Parent = orchestrator only.

---

## i18n (next-intl)

- Supported locales: `en`, `pt` — message files at `apps/web/messages/en.json` + `pt.json`
- `[locale]/layout.tsx` — wraps subtree with `NextIntlClientProvider`
- `proxy.ts` locale detection order: `NEXT_LOCALE` cookie → `Accept-Language` header → `'en'`
- Public routes redirect to `/{locale}/...`; `/admin` and `/auth` are locale-free
- `NotTranslatedBanner` — shown when post/project `translated === false`

---

## Shared Packages

**`@my-website/env`** — env validation via `@t3-oss/env-nextjs`. Single `index.ts` used by both apps.

**`@my-website/schemas`** — shared Zod schemas. Current exports: Profile, Career, Project, Post (list item, detail, admin, create, update), Log (entry, list response), `*Translation` schemas for all 4 entities.

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
