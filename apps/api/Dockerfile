FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

# ---- builder ----
FROM base AS builder
WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile

# dummy DATABASE_URL
ENV DATABASE_URL="postgresql://dummy:dummy@localhost/dummy"
RUN pnpm --filter api exec prisma generate
RUN pnpm --filter api run build
RUN pnpm --filter api deploy --prod /deploy

# ---- runner ----
FROM node:24-alpine AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001

COPY --from=builder --chown=nestjs:nodejs /deploy/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/generated ./generated
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/prisma ./prisma

USER nestjs

ENV NODE_ENV=production

EXPOSE 3001

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/main.js"]
