# CostWise — UI/Backend Separation, AI Assistant & Mobile Readiness

**Date:** 2026-08-23
**Status:** Approved (design)
**Owner:** Panos

## 1. Context & Goal

CostWise is currently a single Next.js App Router application. The backend
(API routes → services → repositories → Drizzle → Postgres) lives inside the
Next app, and auth is NextAuth (Google OAuth + credentials). The app is
deployed but has no production users, so restructuring risk is low.

Goals, in priority order:

1. Separate the app into a pure UI frontend and a standalone backend API.
2. Position CostWise as an **intelligence-first app**: start with a chat
   assistant, with an architecture that grows into more agentic features
   (document extraction, background automation) without rearchitecting.
3. Enable a mobile app (React Native + Expo) that consumes the same backend.

## 2. Decisions (ADR)

These are the accepted decisions. When implementation completes, fold them
into `docs/decisions.md` and update `docs/architecture.md`,
`docs/AGENTS.md`, and `docs/where-to-touch.md` to describe the new shape.

| # | Decision | Rationale | Rejected alternatives |
|---|----------|-----------|----------------------|
| 1 | **Monorepo** (pnpm workspaces + Turborepo) with `apps/api`, `apps/web`, `apps/mobile` (later) and `packages/shared`, `packages/db`, `packages/agent-core` | Type/schema sharing across web, mobile, and API with zero publishing friction for a solo dev | Separate repos (package publishing overhead); keeping everything in Next (no real separation) |
| 2 | **Hono** for the standalone API | TypeScript-first, minimal ceremony, existing services/repositories plug in nearly unchanged, first-class streaming for AI chat | NestJS (heavier, team-oriented); Express/Fastify (more hand-wiring) |
| 3 | **API is the only door to data.** Web server components and mobile screens call the API over HTTP; nothing outside `apps/api` imports services or repositories | Makes mobile and agents first-class clients; every permission check lives in one place | Letting web keep direct service imports (splits the trust boundary in two) |
| 4 | **Better Auth** replaces NextAuth, hosted inside `apps/api` | NextAuth is cookie/web-only; Better Auth has a first-class Expo plugin (token sessions), runs in a standalone server, supports Google + credentials | Keeping NextAuth + custom token layer (fighting the library); rolling our own auth (no) |
| 5 | **`/v1` route prefix + additive-changes-only policy** | Old mobile app versions live on phones for months; additive discipline means `/v2` may never be needed | No versioning (mobile breaks on API change); heavyweight versioning schemes (premature) |
| 6 | **Generated API docs** via `@hono/zod-openapi` + docs UI at `/docs` | Docs generated from the same Zod schemas used for validation never drift; mobile client can be generated from the spec | Hand-written API docs (drift guaranteed) |
| 7 | **Agent harness lives in `packages/agent-core`**, transport-agnostic; `apps/api/src/agent/` is only an entry point | Error handling, retries, context management, and hooks evolve inside the package; agents can later move to a dedicated worker service by adding a queue entry point — no rewrite | Separate agent microservice now (premature); agent logic baked into HTTP routes (locks it to the API server) |
| 8 | **Agent tools wrap existing services**, always called with the authenticated `userId` | The agent can never touch data the logged-in user couldn't; permissions enforced by construction, not by prompt | Giving the agent direct DB/repository access (bypasses every business rule) |
| 9 | **Confirm-before-write**: agent write tools return a proposed action the user confirms in the UI; read tools execute freely | Conversational AI silently mutating cost data destroys trust | Fully autonomous writes (unsafe); confirming reads too (annoying) |
| 10 | **Deployment split**: web on Vercel, API as a long-lived Node server (Railway / Fly.io / Render), Postgres unchanged | SSE streaming and future background agents need a process that doesn't time out; web keeps Vercel's DX | API on Vercel serverless (timeouts kill agent loops) |
| 11 | **React Native + Expo** for mobile, built last | One TS codebase sharing `packages/shared`; Expo handles native tooling; lands on a finished, documented, token-auth API | Native Swift/Kotlin (two codebases, no sharing); Flutter (no TS sharing); building mobile early (moving-target API) |

## 3. Target Architecture

```
costwise/
  apps/
    api/                      Hono server (long-lived Node process)
      src/
        routes/               thin /v1 HTTP handlers: validate → service → respond
        services/             moved from src/app/services (business rules)
        repositories/         moved from src/app/repositories (data access)
        agent/                /v1/chat entry point; wires services in as tools
        auth/                 Better Auth instance + session middleware
    web/                      Next.js — pure UI; fetches via typed API client
    mobile/                   Expo + React Native (Phase 8)
  packages/
    shared/                   Zod schemas (from src/shemas), types, constants
    db/                       Drizzle schema + connection (imported only by api)
    agent-core/               agent harness: loop, tool registry, context
                              management, retry/error policy, hooks, model config
```

### Data flow

1. Web page / mobile screen → HTTP call to Hono API (typed client; shared Zod
   schemas validate on both ends).
2. Hono route middleware resolves the Better Auth session and injects `userId`.
3. Route → service (ownership + business rules, unchanged from today).
4. Service → repository → Drizzle → Postgres.
5. The `/v1/chat` endpoint sits beside CRUD routes and calls the **same
   services** as its tools.

### Versioning policy

- All routes under `/v1`.
- Additive changes only: new endpoints and new response fields are fine;
  never rename or remove a field an existing client reads.
- `/v2` only if a breaking change becomes unavoidable; versions then run side
  by side while old mobile clients drain.

## 4. Auth Migration (NextAuth → Better Auth)

- Better Auth runs inside `apps/api` with its Drizzle adapter, owning the
  user/session/account tables.
- Migration script maps existing NextAuth tables; Google-linked users and
  credential users survive. Verify bcrypt hash compatibility during
  implementation; if incompatible, re-hash transparently on first login.
- Same login methods as today: Google OAuth + email/password.
- Web uses Better Auth's client with cookie sessions;
  `(user)/layout.tsx` swaps `auth()` for a session check against the API.
- Mobile (Phase 8) uses the Expo plugin's token sessions.
- Every `/v1` route passes through auth middleware that injects `userId`.
- **Gate:** both login methods verified end-to-end before any other phase
  builds on the new auth.

## 5. AI Chat Assistant

- `/v1/chat` SSE streaming endpoint on the Hono server.
- Model: latest Claude model via the Claude API.
- Tools: thin wrappers over existing services (`list_recipes`,
  `get_recipe_cost`, `create_ingredient`, `search_suppliers`, …), always
  invoked with the session's `userId`.
- Read tools execute freely. Write tools return a **proposed action** the UI
  renders as a confirmation card; execution happens only after the user
  confirms.
- Conversations persist in Postgres (`conversations` + `messages` tables) so
  chats survive refreshes and behave identically on web and mobile.
- Harness concerns (loop, retries, context window management, hooks,
  error policy) live in `packages/agent-core`, which knows nothing about
  HTTP. Future agentic features (invoice extraction, margin watching,
  scheduled jobs) are new tools plus new entry points (cron/queue consumer)
  into the same core. If agent load ever needs isolation, `agent-core`
  lifts into a worker service without a rewrite. The Claude Agent SDK can
  slot in behind this boundary if a batteries-included harness is wanted
  later.

## 6. Error Handling & Testing

- **API errors:** consistent JSON error envelope (`code`, `message`) across
  all `/v1` routes; Zod validation failures return 400 with field errors;
  auth failures 401/403; services keep throwing domain errors that routes
  map to status codes. No stack traces or internals in responses.
- **Agent errors:** `agent-core` owns retry policy for transient model/API
  failures and surfaces a clean "assistant unavailable" state to clients;
  tool errors are fed back to the model, not shown raw to users.
- **Testing:** existing Jest tests move with the code they cover. Each phase
  gate includes: services/repository tests green, plus a manual end-to-end
  walkthrough of the affected flows. Auth phase additionally requires both
  login methods verified. Agent tools get unit tests asserting the userId
  scoping (a tool can never return another user's data).

## 7. Migration Phases & ClickUp Task List

Each phase below is one ClickUp task, written so another LLM can create it
via MCP without further context. The app must remain fully working after
every phase. Docs are updated per-phase; Phase 6 is the final sweep.

---

**Task 1 — Monorepo scaffold**
Restructure the CostWise repo into a pnpm-workspaces + Turborepo monorepo.
Move the existing Next.js app to `apps/web` unchanged. Extract validation
schemas and shared types from `src/shemas` into `packages/shared`, and the
Drizzle schema/connection from `src/db` into `packages/db`. Update all
imports.
*Done when:* `pnpm dev` runs the web app from `apps/web`, `pnpm build` and
tests pass, and app behavior is unchanged.

**Task 2 — Stand up the Hono API**
Create `apps/api` (Hono, long-lived Node server). Move
`src/app/services` and `src/app/repositories` into it. Implement all
existing CRUD/search/upload endpoints as `/v1` routes using
`@hono/zod-openapi` with schemas from `packages/shared`; mount generated API
docs at `/docs`. Keep the web app working during transition (temporary
compatibility layer is acceptable).
*Done when:* every operation the web app performs is available as a
documented `/v1` endpoint and the API runs locally alongside the web app.

**Task 3 — Auth migration to Better Auth**
Install Better Auth in `apps/api` with the Drizzle adapter. Migrate existing
NextAuth user/account/session data. Support Google OAuth and
email/password exactly as today. Add session middleware injecting `userId`
into all `/v1` routes. Switch the web app to the Better Auth client
(cookie sessions).
*Done when:* both login methods work end-to-end against the new API, existing
users can still sign in, and all `/v1` routes reject unauthenticated calls.

**Task 4 — Web becomes pure UI**
Convert `apps/web` to fetch exclusively through a typed client for the `/v1`
API. Remove `src/app/api` route handlers and all direct service/repository
imports from the web app.
*Done when:* a full manual walkthrough of recipes, ingredients, suppliers,
auth, search, and uploads works against the API only, and `apps/web` has no
imports from services, repositories, or `packages/db`.

**Task 5 — Deploy the split**
Deploy `apps/api` as a long-lived Node service (Railway, Fly.io, or Render)
and keep `apps/web` on Vercel. Configure environment variables, CORS,
and auth cookie/token settings for the split origins. Postgres unchanged.
*Done when:* the production web app works fully against the deployed API,
including login and uploads.

**Task 6 — ADR & docs sweep**
Fold the decisions table from this spec into `docs/decisions.md` as ADR
entries. Rewrite `docs/architecture.md` for the monorepo shape, update
`docs/AGENTS.md` and `docs/where-to-touch.md` edit-routing for the new
layout, and remove stale references to the old structure.
*Done when:* an agent reading only `docs/` gets an accurate picture of the
new architecture with no references to the pre-split layout.

**Task 7 — AI chat assistant**
Build `packages/agent-core` (agent loop, tool registry, context management,
retry/error policy, hooks) and the `/v1/chat` SSE endpoint in `apps/api`
using the latest Claude model. Implement read tools over recipes,
ingredients, and suppliers services, and confirm-before-write tools for
create/update operations. Persist conversations in Postgres. Build the chat
UI in `apps/web` following `docs/ui.md`, including confirmation cards for
proposed writes.
*Done when:* a signed-in user can ask data questions and get streamed,
correct, user-scoped answers, and a write proposed by the assistant only
executes after explicit confirmation.

**Task 8 — Mobile app (Expo)**
Scaffold `apps/mobile` with Expo + React Native. Integrate Better Auth via
the Expo plugin (token sessions, Google + credentials). Implement core
screens — recipes list/detail, ingredients list/detail, suppliers, and the
chat assistant — using the same typed `/v1` client and schemas from
`packages/shared`.
*Done when:* the app runs on iOS and Android simulators with working login,
browsing of all three domains, and streaming chat.

---

## 8. Out of Scope (for now)

- Background/scheduled agents, invoice extraction, notifications — enabled
  by this architecture, designed later as their own specs.
- A separate agent worker service — only if agent load demands it.
- `/v2` API — only if a breaking change becomes unavoidable.
- App store release process — Phase 8 ends at working simulator builds.
