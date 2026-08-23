# Task 5 — Deploy the Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox steps track progress.
>
> **Authority (docs/AGENTS.md):** authored by Fable 5; executors implement as written, STOP-and-report on anything uncovered. **Execution: executor models for Tasks 1–3 (repo changes), in their own clone/worktree. Tasks 5–8 are Panos actions** (they need his Railway/Vercel/Google/DNS accounts) — the executor's job there is to verify and record outcomes, never to guess at dashboard state.
>
> **Executor mode:** external allowed — push every task-boundary commit with gate output in the body, tick checkboxes in the same commit, STOP at every `⛔ CHECKPOINT`.
>
> **TDD:** entire delta is deployment configuration — declared config exception per spec Decision 10. Every commit gates on `pnpm build && pnpm test && pnpm lint`; the behavioral gates are the deployed `/health` check and the Task 8 walkthrough.

**Goal:** `apps/api` live on Railway at `https://api.<apex>`, web on Vercel at `https://app.<apex>`, sessions working across both, production walkthrough green.

**Architecture:** Railway runs the API as a long-lived Node process via `tsx` (no Dockerfile; `railway.json` at repo root pins install/start/healthcheck). Cookies become cross-subdomain via Better Auth `advanced.crossSubDomainCookies`, gated on a new `COOKIE_DOMAIN` env var so dev is untouched. Vercel just gains env vars + a custom domain and a rebuild (NEXT_PUBLIC_* is build-time inlined).

**Tech Stack:** Railway (Railpack builder), Vercel, Better Auth 1.7, Hono/@hono/node-server, tsx.

**Spec:** `docs/superpowers/specs/2026-08-23-task5-deploy-split-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7tad

## Global Constraints

- `<apex>` below is a placeholder for the production apex domain Panos names at the Task 4 checkpoint. Web origin = `https://app.<apex>`, API origin = `https://api.<apex>`, cookie domain = `.<apex>`. Substitute everywhere; never ship a placeholder.
- Local dev behavior must not change: no `COOKIE_DOMAIN` set locally, port fallback stays 3001, `pnpm dev` untouched.
- Env inventory is spec Decision 6's table — no extra vars, none skipped.
- Cutover order is spec Decision 8: code merged → API healthy → Google URI → Vercel envs/domain → web redeploy → walkthrough.
- Workspace gates (`pnpm build && pnpm test && pnpm lint`) green at every commit.

---

### Task 1: Preflight (executor)

- [ ] `git fetch origin && git merge-base --is-ancestor origin/fix/ingredient-supplier-selection origin/main && echo BUGFIX-MERGED` — informational only; note the result (the deploy ships whatever `main` holds; urgent bug 868kv84c1 should ideally be merged first — STOP and report if it isn't, don't wait silently).
- [ ] Own clone/worktree, clean tree, branch `feature/deploy-split` off pulled `origin/main`.
- [ ] Check ClickUp 868kv87ad (Google sign-in error-page flash): if still unclassified at cutover time, flag it at the Task 4 checkpoint — an unclassified auth flash makes a Task 8 Google-login failure ambiguous between the pre-existing bug and the new split-origin config. Panos decides whether to classify it first or proceed.

---

### Task 2: API production runtime (executor)

**Files:**
- Modify: `apps/api/src/index.ts` (port line only)
- Modify: `apps/api/package.json` (start script; tsx → dependencies)
- Create: `railway.json` (repo root)
- Modify: `turbo.json` (globalEnv)

**Interfaces produced:** `pnpm --filter api start` boots the server honoring `PORT`; Railway reads `railway.json` for build/deploy config.

- [ ] **Step 1:** In `apps/api/src/index.ts`, change the final `serve(...)` call to:

```ts
serve(
  { fetch: createApp(deps).fetch, port: Number(process.env.PORT ?? 3001) },
  (i) => console.log(`api listening on :${i.port}`)
);
```

- [ ] **Step 2:** In `apps/api/package.json`: add `"start": "tsx src/index.ts"` to `scripts`; move `"tsx": "^4.20.3"` from `devDependencies` to `dependencies`. Run `pnpm install` (lockfile updates).

- [ ] **Step 3:** Create `railway.json` at the repo root:

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "RAILPACK",
    "buildCommand": "pnpm install --frozen-lockfile"
  },
  "deploy": {
    "startCommand": "pnpm --filter api start",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

- [ ] **Step 4:** In `turbo.json`, extend `globalEnv` (keep existing entries, append): `"NEXT_PUBLIC_WEB_ORIGIN"`, `"COOKIE_DOMAIN"`, `"PORT"`.

- [ ] **Step 5:** Verify locally:

```bash
pnpm build && pnpm test && pnpm lint
PORT=3999 pnpm --filter api start
```

Expected: gates green; server logs `api listening on :3999`; `curl -s localhost:3999/health` → `{"status":"ok"}`. Ctrl-C the server. Then confirm no dev regression: `pnpm --filter api dev` still listens on :3001.

- [ ] **Step 6:** Commit (gate output in body) and push:

```bash
git add apps/api/src/index.ts apps/api/package.json railway.json turbo.json pnpm-lock.yaml
git commit -m "feat(api): production runtime — PORT env, start script, railway.json"
git push -u origin feature/deploy-split
```

---

### Task 3: Cross-subdomain cookies (executor)

**Files:**
- Modify: `apps/api/src/auth.ts`

**Interfaces produced:** setting `COOKIE_DOMAIN=.<apex>` on the API host scopes Better Auth cookies to the apex; unset → today's behavior exactly.

- [ ] **Step 1:** In `apps/api/src/auth.ts`, add to the `betterAuth({ ... })` options object (sibling of `trustedOrigins`):

```ts
  advanced: {
    ...(process.env.COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: process.env.COOKIE_DOMAIN,
          },
        }
      : {}),
  },
```

If the installed `better-auth` types reject this shape, STOP and report the actual type — do not guess an alternative key.

- [ ] **Step 2:** Gates: `pnpm build && pnpm test && pnpm lint` → green. Quick behavioral probe (dev unchanged): `pnpm dev`, sign in locally, confirm the session cookie in devtools has **no** Domain attribute (host-only cookie, as today). Stop dev servers.

- [ ] **Step 3:** Commit + push:

```bash
git add apps/api/src/auth.ts
git commit -m "feat(api): opt-in cross-subdomain session cookies via COOKIE_DOMAIN"
git push
```

---

### Task 4: PR + ⛔ CHECKPOINT (executor opens; Panos decides)

- [ ] Open a PR `feature/deploy-split` → `main` titled "Task 5: deploy-split runtime + cookie config", body linking the spec, this plan, and ClickUp 868kv7tad.
- [ ] ⛔ **CHECKPOINT — do not proceed until Panos has:** (1) approved the spec (Decisions 1–2 especially: Railway; custom apex required); (2) named the apex domain `<apex>` (owned or purchased, with DNS access); (3) confirmed a Railway account on a non-sleeping plan; (4) reviewed + merged the PR. Record the concrete `<apex>` value in the PR thread — all later steps substitute it.

---

### Task 5: Railway service (Panos, guided)

- [ ] In Railway: New Project → Deploy from GitHub repo → `st9ho3/costwise` (renamed from `chat-agent` on GitHub; the Vercel project keeps the old name), branch `main`. Leave root at the repo root (`railway.json` is read from there).
- [ ] Service → Variables — set exactly (spec Decision 6):
  `DATABASE_URL` (same value as today's `.env`), `BETTER_AUTH_SECRET` (fresh: `openssl rand -base64 32`), `BETTER_AUTH_URL=https://api.<apex>`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `WEB_ORIGIN=https://app.<apex>`, `COOKIE_DOMAIN=.<apex>`, `BLOB_READ_WRITE_TOKEN` (Vercel → Storage → Blob store token), `NODE_ENV=production`.
- [ ] Deploy; open the build log. Verify: Railpack uses Node ≥ 20 and pnpm 11 (from `packageManager`), runs `pnpm install --frozen-lockfile`, and the deploy log shows `api listening on :<railway port>` with the health check passing. STOP-and-report on any builder misdetection.
- [ ] Settings → Networking → Custom Domain: `api.<apex>`; add the CNAME Railway shows at the DNS provider. Wait for the domain to verify.
- [ ] Verify from any machine:

```bash
curl -s https://api.<apex>/health
```

Expected: `{"status":"ok"}`. Also open `https://api.<apex>/docs` — the API reference renders. An unauthenticated `curl -s https://api.<apex>/v1/recipes` returns the 401 envelope.

---

### Task 6: Google Console redirect URI (Panos)

- [ ] Google Cloud Console → the existing CostWise OAuth client → Authorized redirect URIs → **add** `https://api.<apex>/v1/auth/callback/google`. Keep the existing localhost URI (dev still uses it). Save.

---

### Task 7: Vercel cutover (Panos, guided)

- [ ] Vercel project `chat-agent` → Settings → Environment Variables → **Production**: `NEXT_PUBLIC_API_URL=https://api.<apex>`, `NEXT_PUBLIC_WEB_ORIGIN=https://app.<apex>`.
- [ ] Settings → Domains: add `app.<apex>`; create the CNAME/A records Vercel shows at the DNS provider; wait for verification.
- [ ] **Redeploy production** (Deployments → latest `main` → Redeploy) — required, the env vars are inlined at build time. Wait for the deployment to go Ready.
- [ ] Sanity: open `https://app.<apex>` — the signin page loads; in devtools Network, the page's fetches target `https://api.<apex>` (no `localhost:3001` anywhere). If a `localhost` URL appears, the env vars weren't picked up — STOP, re-check Task 7 step 1, redeploy.

---

### Task 8: Production walkthrough — acceptance gate (Panos; executor records)

Run on `https://app.<apex>`, devtools open (Console + Network):

- [ ] **Credential login** with an existing user → lands authenticated; in devtools → Application → Cookies, the session cookie's Domain is `.<apex>`; hard-refresh an authenticated page → still signed in (RSC cookie forwarding works).
- [ ] **Google login** (second browser/profile) → completes and returns to `https://app.<apex>`, session works.
- [ ] Recipes: list, create (with ingredients), edit, delete — values correct.
- [ ] Ingredients: list, create, edit (incl. supplier selection), delete.
- [ ] Suppliers: list, create, edit, delete.
- [ ] Search returns results; dashboard analytics render.
- [ ] Upload an image on a recipe/ingredient → it renders back from `*.public.blob.vercel-storage.com`.
- [ ] Console: zero CORS errors across the walkthrough. `curl -s https://api.<apex>/v1/recipes` (no cookie) → 401 envelope.
- [ ] Sign out → redirected to `/signin`; deep-linking an authenticated route while signed out redirects to `/signin`.
- [ ] ⛔ **CHECKPOINT — walkthrough verdict.** All green: move ClickUp 868kv7tad → done, note the two production URLs on the task. Any failure: file findings against this plan and STOP (rollback if user-facing: Vercel instant-rollback to the prior deployment; the Railway service can be stopped — spec Decision 8).
