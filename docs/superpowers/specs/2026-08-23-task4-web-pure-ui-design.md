# Task 4 — Web Becomes Pure UI (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 4 — Web becomes pure UI](https://app.clickup.com/t/868kv7tac)
**Parent spec:** `docs/superpowers/specs/2026-08-23-ui-backend-separation-design.md` (ADR 3 — this task completes it: after this, `apps/api` is `@costwise/domain`'s only consumer)
**Status:** Ready for planning
**Execution:** executor models. Large but mechanical-with-gates; not
super-complex.

## Goal

`apps/web` stops importing `@costwise/domain` and calls the `/v1` API
exclusively, through a typed client that mobile (Task 8) will reuse. All
legacy web `/api` routes are deleted. Zero visual/behavioral regression.

## Current State (verified 2026-08-23 on merged main)

- 37 web files / 60 imports from `@costwise/domain`; zero direct
  `@costwise/db` imports. Breakdown: pages instantiate services directly
  (list/detail/create/edit/home); types (`specialTypes` ×10, `context` ×6,
  `repositories` ×2, `errors` ×1); pure utils the UI genuinely needs
  (`pricing` ×7 — live form totals; `transformers` ×4 — display transforms;
  `errors` ×8 — mostly web `/api` routes that die in this task).
- `app/services/services.ts` is the client-side HTTP helper; 5 hooks
  (`useRecipeForm`, `useIngredientsForm`, `useSuppliersForm`, `useHelpers`,
  `useSearch`) call it; it fetches the web `/api/*` routes (incl. one
  pre-existing bug: a relative `api/recipes/...` missing its leading slash).
- Web `/api` routes remain for recipes, ingredients, suppliers, search,
  upload; recipe mutations carry `revalidatePath("/recipes")` — the
  refresh mechanism that must be replaced when routes die.
- `getServerSession` (from Task 3) already talks to the API and stays.
- The API serves `/openapi.json` covering all 13 `/v1` paths (Task 2), and
  every response schema is `satisfies`-bound to the real types.

## Decisions

1. **`packages/api-client` (`@costwise/api-client`)** — not a web-local
   file: parent spec Task 8 explicitly reuses "the same typed `/v1`
   client" for mobile. (Amends the ClickUp anchor naming
   `apps/web/src/lib/api-client.ts` — the folder moves up to a package;
   same idea, shareable home.)
2. **Types are generated from the OpenAPI spec** —
   `openapi-typescript` generates `paths` types from a committed
   `openapi.json`; `openapi-fetch` provides the runtime client. A small
   `apps/api` script (`emit-openapi`) writes the spec deterministically
   from `createApp()` (no server needed); regeneration is one command
   (`gen` script) and the generated types + spec are committed. This makes
   the API docs the single source of truth for client shapes — drift is a
   type error, mirroring Task 2's `satisfies` honesty on the server side.
3. **Two client entries, one core:** `createApiClient({ baseUrl, fetch?,
   headers? })` from the package; `apps/web` wraps it twice —
   `apiBrowser` (adds `credentials: "include"`) and `apiServer()` (RSC
   helper forwarding the incoming `cookie` header via `next/headers`,
   `cache: "no-store"`). Auth stays cookie-based; no tokens in web.
4. **Truly-shared code moves to `@costwise/shared`:** `utils/pricing`,
   `utils/transformers`, and the type modules web needs
   (`specialTypes`, the UI-relevant members of `context`) — they are pure
   functions/types over shared schemas and their real home is the shared
   package (mobile will need pricing/display types too). Rule for the
   split: anything importing `@costwise/db` or repositories STAYS in
   domain; web imports of those get narrowed instead. `utils/errors`
   stays in domain — after this task the web handles API error envelopes,
   not `AppError` classes.
5. **Mutation flow:** `services.ts` is rewritten onto the api-client
   (same exported function names/signatures, so the 5 hooks change
   minimally); success paths call `router.refresh()` (or keep existing
   `router.push`) to replace the deleted `revalidatePath` — same UX,
   client-driven. The leading-slash bug dies with the rewrite.
6. **Deletions once green:** entire `apps/web/src/app/api/` tree;
   `@costwise/domain` from web's `package.json` plus now-unused deps
   (`drizzle-orm`, `pg`, `bcrypt`, `uuid`/`uid` if unreferenced —
   grep-gated); `@costwise/domain` leaves `transpilePackages`. Also the
   Task 3 debris this unblocks: the triple-`dotenv.config` hacks in
   `packages/db/src/db.ts` and `apps/api/src/{auth,index}.ts` (turbo
   `globalEnv` made them redundant — keep exactly one `dotenv/config` in
   `apps/api/src/index.ts` top as belt-and-braces for non-turbo runs).
7. **TDD boundary (per docs/AGENTS.md):** new behavior = the api-client
   package (red-green unit tests with an injected mock fetch: typed
   success, error-envelope mapping, credentials/header forwarding). The
   page/hook rewiring is transport refactoring — declared exception,
   gated by existing suites, build, greps, and the human walkthrough.
8. **Ops lesson encoded:** dev-server restarts are required after edits
   under `packages/*` (Turbopack transpilePackages wedge — observed
   repeatedly in Task 3). Goes in the plan header and `docs/AGENTS.md`.

## Acceptance Criteria (verification gate)

1. `grep -rn "@costwise/domain" apps/web` → empty;
   `apps/web/src/app/api/` does not exist; web `package.json` has no
   domain/db/driver deps.
2. `pnpm build && pnpm test && pnpm lint` green; CI green on the PR.
3. api-client tests cover: typed 200 flow, 401/error envelope surfaced,
   credentials include (browser) and cookie forwarding (server) — written
   red-green.
4. Full walkthrough on `pnpm dev` — every domain: recipes
   (list/detail/create/edit/delete + list refresh after mutation),
   ingredients (same), suppliers (same), search, upload, auth
   (in/out), dashboard analytics — behavior and visuals unchanged
   (`docs/ui.md` conformance). Human (Panos) confirms; ⛔ CHECKPOINT
   before the PR merges.
5. `openapi.json` + generated types committed, with a one-command regen
   documented in the api-client README.

## Out of Scope

- Deployment (Task 5). Fixing the hardcoded home-dashboard demo data
  (bug 868kv80u3 — but the analytics endpoints get wired here, which is
  most of that bug's groundwork). Chat (Task 7), mobile (Task 8).
  Caching/SWR layers — plain fetch + `router.refresh()` now, revisit if
  UX demands it.

## Risks & Mitigations

- **Widest-touch task so far (37 files)** → per-domain commits, grep
  gates between them, existing test suite must stay green throughout.
- **Type relocation pulls db types into shared** → the "imports db ⇒
  stays in domain" rule plus a `grep -rn "@costwise/db" packages/shared`
  gate (must stay empty).
- **Hidden behavior differences (status codes, shapes)** → the client is
  generated from the same spec the server enforces; the PATCH 200
  deviation is already the documented contract.
- **Upload flow needs multipart via the client** → `openapi-fetch`
  supports FormData bodies; the plan carries the exact call.
