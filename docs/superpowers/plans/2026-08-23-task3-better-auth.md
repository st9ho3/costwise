# Task 3 — Better Auth Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox steps track progress.
>
> **Authority (docs/AGENTS.md):** authored by Fable 5; executors implement as written, STOP-and-report on anything uncovered. **Execution: executor models**, in their own clone (one-writer rule).
>
> **TDD:** API middleware and mounting changes are red-green (Tasks 4–5). Declared exceptions per docs/AGENTS.md: Better Auth config + schema/migration (config/schema class, gated by rehearsal + E2E acceptance), and the web client rewiring (auth UI flows — verified by the E2E gates in Task 7; unit-testing them would mean mocking the entire Better Auth client for no signal).
>
> **Executor mode:** external allowed. Push every task-boundary commit with gate output in the body; tick checkboxes in the same commit; STOP at the `⛔ CHECKPOINT` (before the migration script runs against the real database).

**Goal:** NextAuth → Better Auth inside `apps/api` at `/v1/auth`, Google + credentials preserved, every user keeps their id and password, `requireUser` gets its real session implementation, NextAuth fully removed from web.

**Architecture:** Better Auth instance in `apps/api/src/auth.ts` (Drizzle adapter over `@costwise/db`, custom bcrypt hash/verify, Google provider), handler mounted BEFORE the `/v1` router so `requireUser` never intercepts it. `requireUser` resolves the session via a `Deps`-injected `getSessionUserId` (real: `auth.api.getSession`; tests: fake). Web swaps to the Better Auth client + one server-side session helper that forwards cookies to the API (used by the layout AND the web's own `/api` routes until Task 4 removes them).

**Tech Stack:** better-auth (latest 1.x — pin the exact version at install; STOP on type mismatches with this plan rather than guessing), hono/cors, existing bcrypt.

**Spec:** `docs/superpowers/specs/2026-08-23-task3-better-auth-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7tab

## Global Constraints

- User ids never change; `user` table altered in place, never dropped.
- No scrypt anywhere: password hash AND verify are bcrypt cost 10 (spec Decision 2).
- `x-user-id` backdoor is deleted from production code; test fakes may emulate it in-memory only.
- Env additions (Panos supplies real values in `.env` BEFORE Task 6's E2E): `BETTER_AUTH_SECRET` (openssl rand -base64 32), `BETTER_AUTH_URL=http://localhost:3001`, `NEXT_PUBLIC_API_URL=http://localhost:3001`, `WEB_ORIGIN=http://localhost:3000`. Existing `AUTH_GOOGLE_ID/SECRET` reused.
- Session user shape exposed to web components stays `{ id, name, email, image }`.

---

### Task 1: Preflight

- [x] `git fetch origin && git merge-base --is-ancestor origin/feature/hono-api origin/main && echo OK` → `OK` (Task 2 merged), else STOP.
- [x] Own clone, clean tree, `git checkout main && git pull && git checkout -b feature/better-auth`.

---

### Task 2: Better Auth instance + mounting (mount test is TDD)

**Files:** Create `apps/api/src/auth.ts`; modify `apps/api/src/app.ts`, `apps/api/package.json`, `apps/api/src/app.test.ts`.

**Interfaces produced:** `auth` (Better Auth instance) exported from `apps/api/src/auth.ts`; `/v1/auth/*` handled by Better Auth; CORS on `/v1/*` for `WEB_ORIGIN` with credentials.

- [x] **Step 1:** `pnpm --filter api add better-auth` (record the resolved version in the commit body).
- [x] **Step 2 (RED):** add to `app.test.ts`:

```ts
it("does not gate /v1/auth/* behind requireUser", async () => {
  const res = await createApp(fakeDeps()).request("/v1/auth/get-session");
  const body = await res.json().catch(() => null);
  // Better Auth answers (null session), not our auth envelope:
  expect(body?.error?.code).not.toBe("AUTHENTICATION_ERROR");
});
```

Run → FAIL (currently 401 envelope from requireUser).

- [x] **Step 3:** `apps/api/src/auth.ts`:

```ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import bcrypt from "bcrypt";
import { db } from "@costwise/db/db";
import { users, sessions, accounts, verifications } from "@costwise/db/schema";

export const auth = betterAuth({
  basePath: "/v1/auth",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user: users, session: sessions, account: accounts, verification: verifications },
  }),
  emailAndPassword: {
    enabled: true,
    password: {
      hash: (password) => bcrypt.hash(password, 10),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  trustedOrigins: [process.env.WEB_ORIGIN ?? "http://localhost:3000"],
});
```

(`bcrypt` is already a domain dep; add it to `apps/api` deps too: `pnpm --filter api add bcrypt && pnpm --filter api add -D @types/bcrypt`.)

- [x] **Step 4 (GREEN):** in `app.ts`, BEFORE `app.route("/v1", v1)`:

```ts
import { cors } from "hono/cors";
import { auth } from "./auth";

app.use("/v1/*", cors({
  origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  credentials: true,
}));
app.on(["GET", "POST"], "/v1/auth/*", (c) => auth.handler(c.req.raw));
```

Registration ORDER is the point: auth handler before the v1 sub-app. Run the test → PASS. NOTE: importing `./auth` at module load requires env vars to merely exist for tests — if the instance throws in CI (no DB connection is fine, `pg.Pool` is lazy; a missing secret is not), give `auth.ts` safe fallbacks for test env (`process.env.BETTER_AUTH_SECRET ?? "test-secret-32-chars-minimum-xxxx"`) and note it.

- [x] **Step 5:** Workspace gates green. Commit `feat(api): better-auth instance mounted at /v1/auth`.

---

### Task 3: Schema change + migration script (declared exception; rehearsal-gated)

**Files:** Modify `packages/db/src/schema.ts`; create `packages/db/scripts/migrate-auth.ts`; modify `packages/db/package.json` (script + `tsx` devDep).

- [x] **Step 1:** In `schema.ts`, REPLACE the five NextAuth table definitions (`users`, `accounts`, `sessions`, `verificationTokens`, `authenticators`) with the Better Auth shape — table names stay singular; `users` keeps its columns' identity (same table, altered):

```ts
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expiresAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
```

Delete `verificationTokens`/`authenticators` exports; fix any imports of them (`grep -rn "verificationTokens\|authenticators" apps packages` — expect only schema.ts; STOP if the old NextAuth `AdapterAccountType` import becomes unused and remove it). `udersRelations` (sic) stays.

- [x] **Step 2:** `packages/db/scripts/migrate-auth.ts` — one transaction, idempotent, chatty:

```ts
import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

const run = async () => {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");

    // 1. user table: new columns + emailVerified type flip + name backfill
    await c.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "createdAt" timestamp NOT NULL DEFAULT now()`);
    await c.query(`ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "updatedAt" timestamp NOT NULL DEFAULT now()`);
    const evType = await c.query(`SELECT data_type FROM information_schema.columns WHERE table_name='user' AND column_name='emailVerified'`);
    if (evType.rows[0]?.data_type !== "boolean") {
      await c.query(`ALTER TABLE "user" ADD COLUMN "emailVerified_b" boolean NOT NULL DEFAULT false`);
      await c.query(`UPDATE "user" SET "emailVerified_b" = ("emailVerified" IS NOT NULL)`);
      await c.query(`ALTER TABLE "user" DROP COLUMN "emailVerified"`);
      await c.query(`ALTER TABLE "user" RENAME COLUMN "emailVerified_b" TO "emailVerified"`);
    }
    await c.query(`UPDATE "user" SET name = split_part(email, '@', 1) WHERE name IS NULL`);
    await c.query(`ALTER TABLE "user" ALTER COLUMN name SET NOT NULL`);
    await c.query(`ALTER TABLE "user" ALTER COLUMN email SET NOT NULL`);

    // 2. park old account table; drop dead tables
    await c.query(`ALTER TABLE IF EXISTS "account" RENAME TO "account_old"`);
    await c.query(`DROP TABLE IF EXISTS "session"`);
    await c.query(`DROP TABLE IF EXISTS "verificationToken"`);
    await c.query(`DROP TABLE IF EXISTS "authenticator"`);

    // 3. new tables (Better Auth shape — mirror schema.ts exactly)
    await c.query(`CREATE TABLE IF NOT EXISTS "account" (
      id text PRIMARY KEY, "accountId" text NOT NULL, "providerId" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "accessToken" text, "refreshToken" text, "idToken" text,
      "accessTokenExpiresAt" timestamp, "refreshTokenExpiresAt" timestamp,
      scope text, password text,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);
    await c.query(`CREATE TABLE IF NOT EXISTS "session" (
      id text PRIMARY KEY, token text NOT NULL UNIQUE,
      "userId" text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "expiresAt" timestamp NOT NULL, "ipAddress" text, "userAgent" text,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);
    await c.query(`CREATE TABLE IF NOT EXISTS "verification" (
      id text PRIMARY KEY, identifier text NOT NULL, value text NOT NULL,
      "expiresAt" timestamp NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now())`);

    // 4. data: google links + credential rows
    const gOld = await c.query(`SELECT count(*) FROM "account_old" WHERE provider = 'google'`).catch(() => ({ rows: [{ count: "0" }] }));
    await c.query(`INSERT INTO "account" (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", scope)
      SELECT gen_random_uuid()::text, "providerAccountId", provider, "userId", access_token, refresh_token, id_token, scope
      FROM "account_old" WHERE provider = 'google'
      ON CONFLICT DO NOTHING`);
    const gNew = await c.query(`SELECT count(*) FROM "account" WHERE "providerId" = 'google'`);

    const pwUsers = await c.query(`SELECT count(*) FROM "user" WHERE password IS NOT NULL`);
    await c.query(`INSERT INTO "account" (id, "accountId", "providerId", "userId", password)
      SELECT gen_random_uuid()::text, id, 'credential', id, password FROM "user"
      WHERE password IS NOT NULL
        AND NOT EXISTS (SELECT 1 FROM "account" a WHERE a."userId" = "user".id AND a."providerId" = 'credential')`);
    const credNew = await c.query(`SELECT count(*) FROM "account" WHERE "providerId" = 'credential'`);

    console.log(`google: old=${gOld.rows[0].count} new=${gNew.rows[0].count}`);
    console.log(`credential: users-with-password=${pwUsers.rows[0].count} rows=${credNew.rows[0].count}`);
    if (gOld.rows[0].count !== gNew.rows[0].count) throw new Error("google account count mismatch");
    if (pwUsers.rows[0].count !== credNew.rows[0].count) throw new Error("credential count mismatch");

    // 5. only now: drop parked table and the user.password column
    await c.query(`DROP TABLE IF EXISTS "account_old"`);
    await c.query(`ALTER TABLE "user" DROP COLUMN IF EXISTS "password"`);

    await c.query("COMMIT");
    console.log("migration complete");
  } catch (e) {
    await c.query("ROLLBACK");
    console.error("ROLLED BACK:", e);
    process.exit(1);
  } finally {
    c.release();
    await pool.end();
  }
};
run();
```

Add to `packages/db/package.json` scripts: `"migrate-auth": "tsx scripts/migrate-auth.ts"`; `pnpm --filter @costwise/db add -D tsx`.

- [x] **Step 3:** Build gates: `pnpm build` green (schema type changes will surface every consumer of the old auth types — fix ONLY compile errors that follow mechanically, e.g. removed exports; STOP on anything judgment-shaped). NOTE: web still compiles against NextAuth code until Task 5 rips it out — if `apps/web` build breaks on the schema change (e.g. Drizzle adapter types in `src/auth.ts`), it is acceptable to reorder: complete Task 5's deletions first, then re-run this gate. Say so in the commit body.
- [ ] **Step 4: ⛔ CHECKPOINT — do NOT run the script yet.** Push everything, report, and wait: Panos confirms which `DATABASE_URL` this runs against and gives the explicit go. (App has no production users, but the database is the one thing with no undo.) After the go: run `dotenv -c -- pnpm --filter @costwise/db run migrate-auth` from the repo root, paste the printed counts into the commit/report.

---

### Task 4: `requireUser` real implementation (TDD)

**Files:** Modify `apps/api/src/app.ts` (Deps), `apps/api/src/middleware/auth.ts`, `apps/api/src/middleware/auth.test.ts`, `apps/api/src/testing/fakes.ts`, `apps/api/src/index.ts`.

**Interfaces:** `Deps` gains REQUIRED `getSessionUserId: (headers: Headers) => Promise<string | null>`; `requireUser` becomes a factory `makeRequireUser(getSessionUserId)`; route files unchanged except `app.ts` wiring `v1.use("*", makeRequireUser(deps.getSessionUserId))`.

- [x] **Step 1 (RED):** rewrite `auth.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { OpenAPIHono } from "@hono/zod-openapi";
import { makeRequireUser } from "./auth";

const appWith = (resolver: (h: Headers) => Promise<string | null>) => {
  const app = new OpenAPIHono<{ Variables: { userId: string } }>();
  app.use("/p/*", makeRequireUser(resolver));
  app.get("/p/me", (c) => c.json({ userId: c.var.userId }));
  return app;
};

describe("requireUser (session-backed)", () => {
  it("401s when the resolver finds no session", async () => {
    expect((await appWith(async () => null).request("/p/me")).status).toBe(401);
  });
  it("sets userId from the resolved session", async () => {
    const res = await appWith(async () => "u1").request("/p/me");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ userId: "u1" });
  });
  it("passes the request headers to the resolver", async () => {
    let seen: string | null = null;
    await appWith(async (h) => { seen = h.get("cookie"); return "u1"; })
      .request("/p/me", { headers: { cookie: "s=abc" } });
    expect(seen).toBe("s=abc");
  });
});
```

Run → FAIL (`makeRequireUser` doesn't exist).

- [x] **Step 2 (GREEN):** `auth.ts` middleware becomes:

```ts
import { createMiddleware } from "hono/factory";

export const makeRequireUser = (
  getSessionUserId: (headers: Headers) => Promise<string | null>
) =>
  createMiddleware<{ Variables: { userId: string } }>(async (c, next) => {
    const userId = await getSessionUserId(c.req.raw.headers);
    if (!userId)
      return c.json({ error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } }, 401);
    c.set("userId", userId);
    await next();
  });
```

Delete the old `requireUser` and every `NODE_ENV_OVERRIDE`/`x-user-id` reference in src. `app.ts`: add the Deps member (REQUIRED) and wire `v1.use("*", makeRequireUser(deps.getSessionUserId))`. `fakes.ts`: `getSessionUserId: async (h) => h.get("x-user-id")` — the header emulation lives ONLY in the test fake now, so existing route tests keep passing unchanged. `index.ts`:

```ts
import { auth } from "./auth";
// in deps:
getSessionUserId: async (headers) =>
  (await auth.api.getSession({ headers }))?.user.id ?? null,
```

- [x] **Step 3:** Full api suite green (route tests prove the fake path; middleware tests prove the contract). Workspace gates green. Commit `feat(api): session-backed requireUser via Better Auth`.

---

### Task 5: Web switches to Better Auth; NextAuth removed (declared exception — E2E-gated)

**Files:**
- Create: `apps/web/src/app/lib/authClient.ts`, `apps/web/src/app/lib/serverSession.ts`
- Modify: `apps/web/src/app/(user)/layout.tsx`, `hooks/useSignIn.tsx`, `hooks/useSignUp.tsx`, `components/auth/authComponents/authButton.tsx`, `components/shared/profileModal.tsx`, the 8 web api route files that call `auth()` (`ingredients{,/[id]}`, `recipes{,/[id]}`, `suppliers{,/[id]}`, `search`, `upload`), `apps/web/package.json`
- Delete: `apps/web/src/auth.ts`, `apps/web/src/app/api/auth/` (entire dir), `packages/domain/src/services/authservice.ts`, `packages/domain/src/repositories/authRepository.ts` (grep-gated)

**Steps:**

- [ ] **Step 1:** `pnpm --filter web add better-auth` (client comes from the same package). Create `lib/authClient.ts`:

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/v1/auth`,
});
```

- [ ] **Step 2:** `lib/serverSession.ts` — the one server-side session door (layout + web api routes):

```ts
import { headers } from "next/headers";

export type SessionUser = { id: string; name: string | null; email: string | null; image: string | null };

export const getServerSession = async (): Promise<{ user: SessionUser } | null> => {
  const h = await headers();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/v1/auth/get-session`,
    { headers: { cookie: h.get("cookie") ?? "" }, cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.user ? { user: data.user } : null;
};
```

- [ ] **Step 3:** Rewire, file by file:
  - `layout.tsx`: `const session = await getServerSession(); if (!session?.user) redirect("/signin");` — remove `SessionProvider` and the `next-auth/react` import (Header already takes `session` as a prop; pass the same shape).
  - `useSignIn.tsx`: replace `signIn("credentials", {...})` with `const { error } = await authClient.signIn.email({ email, password, callbackURL: "/" });` — surface `error.message` through the hook's existing error state.
  - `useSignUp.tsx`: replace the `/api/auth/signup` fetch with `authClient.signUp.email({ email, password, name: email.split("@")[0], callbackURL: "/" })` (Better Auth requires `name`; email-prefix matches the migration backfill).
  - `authButton.tsx`: `signIn("google")` → `authClient.signIn.social({ provider: "google", callbackURL: process.env.NEXT_PUBLIC_WEB_ORIGIN ?? "http://localhost:3000" })`.
  - `profileModal.tsx`: `signOut()` → `await authClient.signOut(); window.location.href = "/signin";`
  - Each web api route: replace `const session = await auth()` with `const session = await getServerSession()` (import from `@/app/lib/serverSession`) — the `session?.user?.id` checks that follow are shape-compatible and stay.
- [ ] **Step 4:** Delete: `apps/web/src/auth.ts`, `apps/web/src/app/api/auth/` entirely. Then `grep -rn "authservice\|authRepository" apps packages` — expected: only the domain files themselves; delete `packages/domain/src/services/authservice.ts` and `packages/domain/src/repositories/authRepository.ts`. If ANY other file imports them, STOP and report instead. Remove deps: `pnpm --filter web remove next-auth @auth/drizzle-adapter` and `pnpm --filter @costwise/db remove @auth/core 2>/dev/null || true` (also drop the `AdapterAccountType` import in schema.ts if still present).
- [ ] **Step 5:** Gates: `pnpm build && pnpm test && pnpm lint` green; `grep -rn "next-auth\|@auth/" apps packages` → empty. Commit `feat(web): switch to better-auth client, remove NextAuth`.

---

### Task 6: E2E verification (spec acceptance criteria 1–4, 7)

Precondition: env vars set (Global Constraints), migration script has run (Task 3 checkpoint cleared), Google Console has the new redirect URI `http://localhost:3001/v1/auth/callback/google` (Panos action — STOP and ask if unsure it's done).

- [ ] `pnpm dev` (web :3000 + api :3001). Verify and record each:
  1. Existing credential user signs in with their OLD password → lands on their own data.
  2. Existing Google user signs in → same user id (their recipes list unchanged).
  3. Fresh signup (new email) works; sign-out then sign-in again works.
  4. `curl -s -o /dev/null -w '%{http_code}' localhost:3001/v1/recipes` → 401; in the browser devtools, a signed-in session calling `fetch("http://localhost:3001/v1/recipes", {credentials:"include"})` → 200 with data.
  5. Signed-out visit to `/` redirects to `/signin`.
- [ ] Push, open PR to `main` (CI green required), report all evidence. Do NOT merge.

---

### Task 7: Report

- [ ] Final report: per-criterion evidence, migration counts, resolved better-auth version, any STOP items and how they resolved, PR URL. ClickUp 868kv7tab moves through Panos/Fable 5.
