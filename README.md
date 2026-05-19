# MealSwift 🍴

From pantry to plate, instantly. A Next.js app for finding recipes from what
you already have, saving favourites, and exploring food across the world.

## Tech stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)                  |
| Auth        | Auth.js v5 (NextAuth) — Google OAuth + email links  |
| Database    | Prisma 6 ORM — SQLite (dev) / Postgres (prod)       |
| Hosting     | Vercel                                              |

## Local development

```bash
# 1. Install deps (runs `prisma generate` via postinstall)
npm install

# 2. Set up env — copy the example and fill in what you need
cp .env.example .env.local
#    For local dev you only strictly need DATABASE_URL + AUTH_SECRET.
#    Generate AUTH_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 3. Create the local SQLite database
npm run db:migrate

# 4. Run it
npm run dev          # http://localhost:3000
```

Without Google/Resend keys the app runs fine — those sign-in buttons simply
won't be offered until the keys are present (the provider list is built
dynamically in `auth.ts`).

## Scripts

| Script              | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server                                           |
| `npm run build`     | `prisma generate` + production build                 |
| `npm run lint`      | ESLint 9 (flat config)                               |
| `npm run typecheck` | `tsc --noEmit`                                       |
| `npm run verify`    | typecheck + lint + DB integration test + build       |
| `npm run db:migrate`| Create/apply a dev migration                         |
| `npm run db:studio` | Prisma Studio (visual DB browser)                    |

## Architecture notes

- **`auth.ts`** — Auth.js config. The Prisma adapter is wired in, which is what
  makes the email magic-link provider actually work (it needs a token store).
  Providers are registered conditionally so missing credentials never crash boot.
- **`lib/prisma.ts`** — singleton Prisma client (avoids connection exhaustion in
  dev hot-reload and serverless).
- **`lib/actions.ts`** — server actions. Every mutation re-checks auth
  server-side via the session; recipe ids are validated against the catalog.
- **`lib/recipes.ts`** — the static recipe catalog (content, not user data).
- Data layer is provider-agnostic: switching SQLite → Postgres is a schema
  one-liner + `DATABASE_URL`, no application code changes.

## Deploying to production

See **[PRODUCTION.md](./PRODUCTION.md)** for the exact step-by-step checklist
(Postgres, Google OAuth, Resend, Vercel env vars).
