# Task 5 — Deploy the Split (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 5 — Deploy the split](https://app.clickup.com/t/868kv7tad)
**Parent spec:** `docs/superpowers/specs/2026-08-23-ui-backend-separation-design.md` (ADR 10)
**Depends on:** Task 4 (merged to main 2026-08-23, PR #163; CI + Vercel checks green)
**Status:** Spec ready for review. Plan authored alongside (deploy is config-heavy;
no code dependencies left to wait for).
**Execution:** executor models for the repo changes (not super-complex — every
decision is made here; the code delta is ~20 lines of env-driven config).
Dashboard steps (Railway, Vercel, Google Console, DNS) are **Panos actions**
guided by the plan's checklists, because they need his accounts.

## Goal

`apps/api` runs as a long-lived Node process on Railway behind HTTPS;
`apps/web` stays on Vercel and points at it; Better Auth cookies work across
the split origins; the production app passes a full end-to-end walkthrough
(login both methods, recipes, ingredients, suppliers, search, uploads).

## Current State (verified 2026-08-23)

- `apps/api` boots via `tsx src/index.ts` (tsx is a **devDependency**); its
  `build` script is `tsc --noEmit` (typecheck only, nothing emitted); there is
  **no Dockerfile and no `start` script**; port is **hardcoded 3001**
  (`serve({ fetch, port: 3001 })` — no hostname given, so Node binds all
  interfaces, which is what Railway needs).
- Cross-origin config already env-driven: CORS on `/v1/*` allows
  `WEB_ORIGIN` with credentials (`apps/api/src/app.ts:115`); Better Auth
  `baseURL` = `BETTER_AUTH_URL`, `trustedOrigins` = `[WEB_ORIGIN]`
  (`apps/api/src/auth.ts`). **No cookie-domain / cross-subdomain config
  exists yet** — dev works because web :3000 and api :3001 share `localhost`.
- Web reaches the API only via `NEXT_PUBLIC_API_URL` (browser client, RSC
  helper `apiServer.ts`, `serverSession.ts`, `authClient.ts`) — **build-time
  inlined**, so changing it requires a Vercel rebuild. Google sign-in's
  return URL uses `NEXT_PUBLIC_WEB_ORIGIN` (`authButton.tsx:32`), which is
  **missing from `turbo.json` globalEnv**.
- Uploads: the API calls `@vercel/blob` `put()` → needs
  `BLOB_READ_WRITE_TOKEN` on the API host. The blob hostname is already
  allowed in `apps/web/next.config.ts`.
- Postgres: `pg` Pool on `DATABASE_URL`, no pool tuning (default max 10).
  The DB is already remote (dev connects over the internet), so the API host
  only needs the same URL. Parent ADR 10: **Postgres unchanged**.
- Vercel project **chat-agent** (repo `st9ho3/costwise`, renamed on GitHub
  from `chat-agent`): Root Directory
  `apps/web` set, deploys green; **production env vars not set yet**.
- `/health` returns `{"status":"ok"}` unauthenticated — ready-made health
  check endpoint.

## Decisions

1. **API host: Railway** (settles parent ADR 10's open choice).
   Rationale: deploys a pnpm/Turborepo monorepo from GitHub with **no
   Dockerfile** (Railpack builder), injects `PORT`, gives HTTPS + custom
   domains out of the box, supports health-checked always-on services, and
   the Hobby plan (~$5/mo) never sleeps — sleeping would break the entire
   premise of this task (long-lived SSE for Task 7's chat).
   Rejected: **Render** (free tier spins down → cold starts + killed
   connections; paid tier has no edge over Railway here); **Fly.io**
   (Dockerfile + `fly.toml` + volume/region ops for no benefit at this
   scale). Deployment config is committed as `railway.json` at the repo root
   so the service definition is code, not dashboard state.
2. **Production domains: one apex, two subdomains — a custom domain is
   REQUIRED, not optional.** Web = `https://app.<apex>` (Vercel custom
   domain), API = `https://api.<apex>` (Railway custom domain). This
   implements Task 3 spec Decision 6. With both hosts under one registrable
   domain, web→API requests are **same-site**: default Lax cookies flow on
   credentialed fetches, and Safari/ITP third-party-cookie blocking never
   enters the picture.
   Rejected: shipping on `chat-agent.vercel.app` + `*.up.railway.app` — the
   session cookie would be third-party (and `vercel.app` is on the Public
   Suffix List, so no shared-domain cookie is even possible); Safari blocks
   it outright → login broken. **The concrete apex is an input from Panos**
   (owned or newly bought — ~10€/yr); the plan parameterizes it as
   `<apex>` and blocks on a ⛔ CHECKPOINT until it's known.
3. **Cookie config: Better Auth `advanced.crossSubDomainCookies`**, gated on
   a new env var `COOKIE_DOMAIN` (prod: `.<apex>`; unset in dev, so local
   behavior is untouched):
   `advanced: { crossSubDomainCookies: { enabled: true, domain: COOKIE_DOMAIN } }`
   applied only when `COOKIE_DOMAIN` is set. Secure cookies come free —
   Better Auth switches them on for https `baseURL`. `trustedOrigins`/CORS
   keep working off `WEB_ORIGIN` (now `https://app.<apex>`).
4. **Production runtime: `tsx`, not a compile step.** `tsx` moves to
   `dependencies`; `apps/api` gains `"start": "tsx src/index.ts"`; Railway
   runs `pnpm --filter api start`. Rationale: the API consumes workspace
   packages (`domain`, `db`, `shared`) as raw TS — a `tsc` emit needs
   project references or a bundler across four packages for zero user-visible
   benefit at this scale (YAGNI; revisit if cold-start or CPU cost ever
   matters). `build` stays `tsc --noEmit` as the CI typecheck gate.
5. **Port from env:** `port: Number(process.env.PORT ?? 3001)` in
   `apps/api/src/index.ts` — Railway injects `PORT`; 3001 fallback keeps dev
   identical. Hostname stays unset (Node already binds all interfaces).
6. **Env inventory** (the complete production set — nothing else):

   | Where | Var | Value |
   |---|---|---|
   | Railway | `DATABASE_URL` | same DB as today (unchanged) |
   | Railway | `BETTER_AUTH_SECRET` | fresh: `openssl rand -base64 32` |
   | Railway | `BETTER_AUTH_URL` | `https://api.<apex>` |
   | Railway | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | existing Google OAuth client |
   | Railway | `WEB_ORIGIN` | `https://app.<apex>` |
   | Railway | `COOKIE_DOMAIN` | `.<apex>` |
   | Railway | `BLOB_READ_WRITE_TOKEN` | from the existing Vercel Blob store |
   | Railway | `NODE_ENV` | `production` |
   | Vercel (Production) | `NEXT_PUBLIC_API_URL` | `https://api.<apex>` |
   | Vercel (Production) | `NEXT_PUBLIC_WEB_ORIGIN` | `https://app.<apex>` |

   `turbo.json` globalEnv additionally learns `NEXT_PUBLIC_WEB_ORIGIN`,
   `COOKIE_DOMAIN`, `PORT` (the first is a live gap: turbo-driven prod
   builds currently strip it).
7. **Google Console** (Panos action, mirrors Task 3 Decision 9): add
   redirect URI `https://api.<apex>/v1/auth/callback/google` to the existing
   OAuth client; keep the localhost URI for dev. No new client.
8. **Cutover order is load-bearing:** merge code → Railway service healthy on
   `api.<apex>` → Google URI added → Vercel env vars + `app.<apex>` domain →
   **redeploy web** (required — `NEXT_PUBLIC_*` is inlined at build) → e2e
   walkthrough. Rollback = Vercel instant-rollback to the previous
   deployment + removing the DNS records; the API service can simply be
   stopped.
9. **Vercel preview deployments are OUT of this task's acceptance.** They
   build with preview env (unset → localhost fallbacks) and their origins
   can't be first-party to the API cookie domain. Acceptance covers the
   production domain pair only; preview strategy is filed separately if ever
   wanted.
10. **TDD posture:** the whole delta is deployment configuration (env
    plumbing, scripts, `railway.json`) with no branching logic —
    **declared config exception** per `docs/AGENTS.md`: every commit still
    gates on `pnpm build && pnpm test && pnpm lint` green, and the
    behavioral gate is the deployed `/health` check plus the acceptance
    walkthrough.

## Acceptance Criteria (verification gate)

1. `https://api.<apex>/health` returns `{"status":"ok"}` over HTTPS;
   `https://api.<apex>/docs` renders the API reference.
2. `https://app.<apex>` serves the web app from Vercel production.
3. **Credential login and Google login both work on `https://app.<apex>`**;
   after login, the session cookie is scoped to `.<apex>` and
   authenticated pages survive a hard refresh (RSC cookie forwarding
   works cross-host).
4. Full walkthrough against production: recipes list/create/edit/delete,
   ingredients list/create/edit/delete, suppliers list/create/edit/delete,
   search, dashboard analytics, and an image upload that renders back from
   blob storage.
5. Browser console shows no CORS errors during the walkthrough; a `/v1`
   call without a session returns the 401 envelope.
6. Sign-out works and signed-out users are redirected to `/signin`.
7. `pnpm build && pnpm test && pnpm lint` green on the PR; CI green.

## Out of Scope

- Mobile deploy (Task 8); background workers (parent spec §8).
- Vercel preview-deployment auth strategy (Decision 9).
- CI → Railway deploy gating (Railway auto-deploys `main`; if we ever want
  "deploy only after CI", file it separately).
- Docs sweep — `docs/architecture.md`/`decisions.md` learn the deployed
  shape in Task 6, not here.

## Risks & Mitigations

- **Wrong/missing env var on either host** → Decision 6's table is the
  single checklist; the plan verifies each var at the step that consumes it
  (health check, login, upload).
- **Railpack build surprises (pnpm workspace)** → `railway.json` pins
  install + start commands; plan step verifies the build log runs Node ≥20
  and `pnpm install --frozen-lockfile`; STOP-and-report if the builder
  misdetects.
- **Cookie scoped wrong** (forgot `COOKIE_DOMAIN`, or apex typo) → symptom
  is "login succeeds, next request 401s"; acceptance 3 explicitly inspects
  the cookie's Domain attribute in devtools before moving on.
- **Google redirect URI mismatch** → URI added and verified before the web
  cutover step; the localhost URI stays as fallback for dev.
- **DNS propagation lag** → plan orders DNS records first among the
  dashboard steps and gates on `dig`/browser checks before anything
  depends on them.
