# Production deployment checklist

The code is production-ready. These steps require **your accounts** — they
can't be done for you. Do them in order. Estimated time: ~30–45 min.

---

## 1. Postgres database (~5 min)

SQLite is dev-only — it does not persist on Vercel's serverless filesystem.

1. In the Vercel dashboard → **Storage → Create Database → Postgres** (free
   tier is fine). Or use [Neon](https://neon.tech) / [Supabase](https://supabase.com).
2. Copy the connection string (looks like `postgresql://user:pass@host/db`).
3. In `prisma/schema.prisma`, change **one line**:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
4. Commit that change and push.
5. Apply the schema to the new database (run locally, pointing at prod):
   ```bash
   DATABASE_URL="postgresql://...your-prod-url..." npx prisma migrate deploy
   ```

> No application code changes are needed — the data layer is provider-agnostic.

---

## 2. Generate a production AUTH_SECRET (~1 min)

The dev secret is exposed (it was shown in chat). Generate a fresh one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Keep this value for step 5.

---

## 3. Google OAuth (~10 min)

1. <https://console.cloud.google.com/apis/credentials> → **Create Credentials
   → OAuth client ID → Web application**.
2. **Authorized JavaScript origins**: `https://YOUR_DOMAIN`
3. **Authorized redirect URIs**:
   `https://YOUR_DOMAIN/api/auth/callback/google`
   (also add `http://localhost:3000/api/auth/callback/google` for local testing)
4. Copy the **Client ID** and **Client Secret** for step 5.

---

## 4. Resend email magic links (~10 min)

1. Sign up at <https://resend.com> (free tier: 100 emails/day).
2. **Domains** → add and verify your sending domain via the DNS records they
   give you. (Until verified you can only send from `onboarding@resend.dev`.)
3. **API Keys** → create one. Copy it for step 5.

---

## 5. Set Vercel environment variables (~5 min)

Vercel dashboard → your project → **Settings → Environment Variables**.
Add these for the **Production** environment:

| Name                  | Value                                              |
| --------------------- | -------------------------------------------------- |
| `DATABASE_URL`        | your Postgres connection string (step 1)           |
| `AUTH_SECRET`         | the value from step 2                              |
| `GOOGLE_CLIENT_ID`    | from step 3                                        |
| `GOOGLE_CLIENT_SECRET`| from step 3                                        |
| `RESEND_API_KEY`      | from step 4                                        |
| `EMAIL_FROM`          | `MealSwift <noreply@YOUR_VERIFIED_DOMAIN>`         |

Then **redeploy** (Deployments → ⋯ → Redeploy, or push a commit).

---

## 6. Verify in production

After deploy:

- [ ] Visit the site — every page loads
- [ ] `/api/auth/session` returns `null` (not a 500)
- [ ] Click **Continue with Google** → completes → you land back signed in
- [ ] **Profile** page shows your real name/email
- [ ] Save a recipe (bookmark icon) → it appears under Profile → reload → still there
- [ ] Sign out → saved bookmarks no longer show as saved
- [ ] Enter your email on `/sign-in` → you receive the magic link → it logs you in

If Google sign-in 400s: the redirect URI in step 3 doesn't exactly match your
domain (check `https` vs `http`, trailing slash, www).

---

## What's already done for you

- ✅ Auth.js + Prisma adapter wired (email links work once Resend is set)
- ✅ DB schema, migrations, cascade deletes, unique constraints
- ✅ Server-side auth enforcement on every mutation
- ✅ Conditional providers (app boots even with missing keys)
- ✅ Error boundaries, 404 page, ESLint, typecheck — all green
- ✅ Next.js 16 (security-patched), Prisma 6 (stable)
- ✅ `npm run verify` gate (typecheck + lint + DB test + build)
