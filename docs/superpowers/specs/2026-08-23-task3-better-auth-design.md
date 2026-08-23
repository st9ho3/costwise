# Task 3 — Auth Migration to Better Auth (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 3 — Auth migration to Better Auth](https://app.clickup.com/t/868kv7tab)
**Parent spec:** `docs/superpowers/specs/2026-08-23-ui-backend-separation-design.md` (ADR 4)
**Status:** Spec ready for review. **Plan deliberately deferred** until Task 2
merges — it must reference real files inside `apps/api` (`app.ts`,
`requireUser`, Deps wiring) that Task 2 creates.
**Execution:** executor models (not super-complex: the design decisions are
all made here; what remains is careful, gate-checked mechanical work. The
data-migration script gets a hard checkpoint).

## Goal

Replace NextAuth with Better Auth hosted inside `apps/api`, keeping Google
OAuth + email/password exactly as today. Every existing user survives with
the same user id and the same password. The Task 2 `requireUser` seam gets
its real implementation.

## Current State (verified 2026-08-23)

- NextAuth v5 beta, **JWT session strategy** — the `session` table is unused,
  so there are **zero session rows to migrate**.
- Tables (NextAuth/Drizzle-adapter shape): `user` (text id UUID, `name`,
  `email` unique, `emailVerified` **timestamp**, `image`,
  `password` varchar — credential hash lives ON the user row),
  `account` (Google rows; compound PK provider+providerAccountId),
  `verificationToken`, `authenticator` (unused — no passkeys in the UI).
- Passwords: **bcrypt, cost 10** (`bcrypt.hash(pw, 10)` in
  `authservice.create`; `bcrypt.compare` in the Credentials authorize).
- Google flow: NextAuth `signIn` callback creates/updates the user row via
  `AuthService` (`createGoogleUser`, `updateUserImage`).
- Domain tables (`recipes`, `ingredients`, …) FK-reference `user.id` —
  **user ids must be preserved; the user table can be altered, never
  recreated.**
- Web gates: `(user)/layout.tsx` calls `auth()`; signin/signup forms post to
  NextAuth/`/api/auth/signup`.

## Decisions

1. **Better Auth lives in `apps/api`**, configured with the Drizzle adapter
   over `@costwise/db`, mounted on the Hono app at **`/v1/auth/*`**
   (`basePath: "/v1/auth"`); `app.on(["GET","POST"], "/v1/auth/*", c =>
   auth.handler(c.req.raw))`. OpenAPI docs note the path but Better Auth
   owns its own endpoint surface.
2. **Passwords: keep bcrypt — zero re-hashing.** Better Auth's default is
   scrypt, but it accepts custom `emailAndPassword.password.{hash,verify}`;
   we plug the existing bcrypt (cost 10) in for both. Every current
   password keeps working forever; no lazy re-hash complexity. (Documented
   trade-off: we stay on bcrypt rather than scrypt — acceptable, bcrypt@10
   is industry-standard.)
3. **Schema migration — alter `user` in place, recreate the rest:**
   - `user`: ADD `createdAt`/`updatedAt` (default now()), CONVERT
     `emailVerified` timestamp → boolean (`emailVerified IS NOT NULL`),
     SET `name` NOT NULL with `''`/email-prefix backfill, keep `email`
     unique NOT NULL. `password` column is dropped ONLY after the data
     migration moves hashes into `account` and verification passes.
   - `account`, `session`, `verification`: dropped and recreated in Better
     Auth shape (via `npx @better-auth/cli generate` for the Drizzle
     schema, merged into `packages/db/src/schema.ts` — the generated
     definitions replace the NextAuth ones; `authenticators` and
     `verificationToken` are dropped, nothing uses them).
4. **Data migration script** (one-shot, in `packages/db/scripts/`):
   - Google links: old `account` rows → new `account`
     (`provider`→`providerId`, `providerAccountId`→`accountId`, tokens
     copied, timestamps stamped).
   - Credentials: every `user.password` → new `account` row with
     `providerId: "credential"`, `accountId: user.id`, `password: <hash>`.
   - Idempotent (safe to re-run), wrapped in a transaction, with row-count
     assertions printed. Runs against dev DB first; prod run is a
     ⛔ CHECKPOINT with Panos.
5. **Sessions: database-backed** (Better Auth default with an adapter) —
   cookie session for web now, and the same table serves mobile bearer
   tokens in Task 8. No secondaryStorage/Redis (YAGNI at this scale).
6. **Cross-origin plan:** local dev works out of the box — cookies are
   per-host and ignore ports (web :3000, api :3001, same `localhost`).
   Production (Task 5) puts both apps under one apex
   (`app.example.com` + `api.example.com`) with
   `advanced.crossSubDomainCookies.enabled` — recorded here, wired in
   Task 5. `trustedOrigins` lists the web origin(s); CORS on `/v1/*`
   allows the web origin with credentials.
7. **Web switches to the Better Auth client** in the same task:
   `authClient = createAuthClient({ baseURL: <api origin>/v1/auth })` —
   signin/signup forms call `signIn.email` / `signUp.email` /
   `signIn.social({ provider: "google" })`; `(user)/layout.tsx` replaces
   `auth()` with a server-side `authClient.getSession({ fetchOptions:
   { headers: { cookie } } })` (forwarding the incoming cookie header).
   NextAuth, `@auth/drizzle-adapter`, and the web `/api/auth/*` routes
   (incl. signup) are fully REMOVED in this task. `AuthService`
   credential/Google-creation methods become dead code owned by Better
   Auth and are deleted with them.
8. **`requireUser` gets its real body:** `auth.api.getSession({ headers:
   c.req.raw.headers })` → sets `userId`; 401 envelope otherwise. Contract
   from Task 2 unchanged — zero route edits. The `x-user-id` dev header
   backdoor is deleted (tests switch to a mocked session or a test helper
   that mints a real session — decided in the plan against the real Task 2
   test code).
9. **Google Cloud Console** (user action): add the new redirect URI
   `<api origin>/v1/auth/callback/google` (keep the old one until cutover
   verified). Env: `BETTER_AUTH_SECRET` (generate fresh), `BETTER_AUTH_URL`
   = api origin; `AUTH_GOOGLE_ID/SECRET` reused as the Google
   `clientId`/`clientSecret`.

## Acceptance Criteria (verification gate)

1. Existing **Google** user signs in via the new flow and lands on their
   own data (same user id — verify a recipe list matches pre-migration).
2. Existing **credential** user signs in with their unchanged password
   (bcrypt verify path proven).
3. New signup (email/password) works end-to-end; new Google-first sign-in
   creates a linked user.
4. `/v1` routes 401 without a session and succeed with a real session
   cookie — `requireUser` no longer honors `x-user-id`.
5. Migration script ran with printed row-count assertions matching
   (`#google old rows == #google new rows`, `#users-with-password ==
   #credential rows`); `user.password` dropped only after 1–3 pass.
6. `grep -rn "next-auth\|@auth/" apps/ packages/` → empty;
   `pnpm build/test/lint` green; CI green on the PR.
7. Web smoke: signed-out redirect to `/signin` still works; sign-out works.

## Out of Scope

- Mobile/Expo plugin and bearer mode (Task 8). Production cookie domain
  wiring (Task 5). Email verification / password reset flows (not in the
  app today — file separately if wanted). Passkeys (unused table dropped).
- Web consuming `/v1` data routes (Task 4) — only the auth surface moves
  now.

## Risks & Mitigations

- **Highest-risk step is the data migration** → idempotent transactional
  script, dev-DB rehearsal, row-count assertions, prod run behind a
  ⛔ CHECKPOINT, `user.password` dropped last.
- **`emailVerified` type flip** breaks NextAuth mid-migration → NextAuth is
  removed in the same PR; the flip lands with it, atomically via merge.
- **Google redirect URI misconfig** → old URI kept until acceptance 1
  passes; both URIs can coexist in Google Console.
- **Better Auth API drift vs this spec** → the plan (written post-Task 2)
  pins exact package versions and verifies each config key against the
  installed version's types; executor STOPs on type errors rather than
  guessing.
