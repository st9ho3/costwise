# Task 4 — Web Becomes Pure UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development or superpowers:executing-plans. Checkbox steps track progress.
>
> **Authority (docs/AGENTS.md):** authored by Fable 5; executors implement as written, STOP-and-report on anything uncovered. **Execution: executor models, in their own clone/worktree.**
>
> **TDD:** Task 2 (api-client) is red-green — every test watched failing first. Tasks 3–6 are transport refactoring — declared exception per spec Decision 7: existing suites + build + greps gate every commit; the human walkthrough is the final behavioral gate.
>
> **Executor mode:** external allowed — push every task-boundary commit with gate output in the body, tick checkboxes in the same commit, STOP at the `⛔ CHECKPOINT`.
>
> **Ops rule (learned in Task 3):** after ANY edit under `packages/*`, restart `pnpm dev` — Turbopack wedges on hot-reloading transpiled workspace packages, and the wedge presents as blank 500s on every route.

**Goal:** zero `@costwise/domain` imports in `apps/web`; all data via `@costwise/api-client` over `/v1`; web `/api` routes deleted; zero visual/behavioral regression.

**Architecture:** `packages/api-client` = `openapi-fetch` over types generated (`openapi-typescript`) from a committed `openapi.json` that `apps/api` emits deterministically. Web wraps it as `apiBrowser` (credentials include) and `apiServer()` (cookie-forwarding RSC helper). Pure shared code (`pricing`, `transformers`, UI-needed types) relocates to `@costwise/shared`. `services.ts` keeps its export names but speaks `/v1`; refresh via `router.refresh()`.

**Tech Stack:** openapi-fetch, openapi-typescript (dev), vitest (api-client tests), existing stack otherwise.

**Spec:** `docs/superpowers/specs/2026-08-23-task4-web-pure-ui-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7tac

## Global Constraints

- `services.ts` exported function names/signatures stay identical (5 hooks depend on them): `sendRecipe`, `sendRecipeToUpdate`, `deleteRecipesFromServer`, `sendIngredient`, `updateIngredient`, `deleteIngredient`, `createSupplier`, `updateSupplier`, `deleteSupplier`, `search`, `createMessage` (untouched — localStorage mock).
- Per-domain commits; workspace gates (`pnpm build && pnpm test && pnpm lint`) green at EVERY commit.
- `grep -rn "@costwise/db" packages/shared` must stay empty (relocation rule: anything importing db/repositories stays in domain).
- Nothing under `apps/api` routes changes (client conforms to server, never the reverse).

---

### Task 1: Preflight

- [x] `git fetch origin && git merge-base --is-ancestor origin/feature/better-auth origin/main && echo OK` → `OK`, else STOP.
- [x] Own clone/worktree, clean tree, branch `feature/web-pure-ui` off pulled `main`.

---

### Task 2: `@costwise/api-client` (TDD)

**Files:** Create `packages/api-client/{package.json,tsconfig.json,README.md}`, `packages/api-client/src/{index.ts,index.test.ts}`, `packages/api-client/openapi.json` (generated), `packages/api-client/src/schema.d.ts` (generated); `apps/api/scripts/emit-openapi.ts`; modify `apps/api/package.json` (script), root `package.json` (optional `gen:api` convenience script).

**Interfaces produced:** `createApiClient(opts: { baseUrl: string; fetch?: typeof fetch; headers?: Record<string, string>; credentials?: RequestCredentials }): Client<paths>` — an `openapi-fetch` client; consumers call `client.GET("/v1/recipes", { params: { query } })` etc. with full typing. Regen: `pnpm --filter api emit-openapi && pnpm --filter @costwise/api-client gen`.

- [x] **Step 1:** `apps/api/scripts/emit-openapi.ts`:

```ts
import { writeFileSync } from "node:fs";
import { createApp } from "../src/app";

const stub = new Proxy({}, { get: () => () => { throw new Error("emit-only"); } });
const app = createApp(stub as never);
const doc = app.getOpenAPI31Document({
  openapi: "3.1.0",
  info: { title: "CostWise API", version: "1" },
});
writeFileSync(new URL("../../../packages/api-client/openapi.json", import.meta.url), JSON.stringify(doc, null, 2));
console.log("openapi.json written");
```

(If `getOpenAPI31Document` doesn't exist in the installed `@hono/zod-openapi`, use `getOpenAPIDocument` with the same config — check the version's exports, STOP if neither.) Add `"emit-openapi": "tsx scripts/emit-openapi.ts"` to `apps/api` scripts; run it once — expect `packages/api-client/openapi.json` containing all 13 `/v1` paths (verify: `grep -c '"/v1/' packages/api-client/openapi.json` ≥ 13).

- [x] **Step 2:** Package scaffold. `packages/api-client/package.json`:

```json
{
  "name": "@costwise/api-client",
  "version": "0.0.0",
  "private": true,
  "exports": { ".": "./src/index.ts", "./schema": "./src/schema.d.ts" },
  "scripts": {
    "gen": "openapi-typescript openapi.json -o src/schema.d.ts",
    "build": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": { "openapi-fetch": "^0.13.0" },
  "devDependencies": { "openapi-typescript": "^7.6.0", "typescript": "^5", "vitest": "^3.1.0" }
}
```

`tsconfig.json`: copy from `packages/db`, include `["src"]`. Add a `vitest.config.ts` like `apps/api`'s. Run `pnpm install`, then `pnpm --filter @costwise/api-client gen` — expect `src/schema.d.ts` with a `paths` interface.

- [x] **Step 3 (RED):** `src/index.test.ts` — mock fetch, no network:

```ts
import { describe, it, expect, vi } from "vitest";
import { createApiClient } from "./index";

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("createApiClient", () => {
  it("returns typed data on 200", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, { recipes: [], count: { count: 0 } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock });
    const { data, error } = await client.GET("/v1/recipes");
    expect(error).toBeUndefined();
    expect(data?.count.count).toBe(0);
  });
  it("surfaces the error envelope on 401", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(401, { error: { code: "AUTHENTICATION_ERROR", message: "Sign in required" } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock });
    const { data, error } = await client.GET("/v1/recipes");
    expect(data).toBeUndefined();
    expect(error?.error.code).toBe("AUTHENTICATION_ERROR");
  });
  it("passes credentials and headers through to fetch", async () => {
    const fetchMock = vi.fn(async () => jsonResponse(200, { recipes: [], count: { count: 0 } }));
    const client = createApiClient({ baseUrl: "http://x", fetch: fetchMock, credentials: "include", headers: { cookie: "s=1" } });
    await client.GET("/v1/recipes");
    const req = fetchMock.mock.calls[0][0] as Request;
    expect(req.credentials).toBe("include");
    expect(req.headers.get("cookie")).toBe("s=1");
  });
});
```

Run → FAIL (`./index` missing).

- [x] **Step 4 (GREEN):** `src/index.ts`:

```ts
import createClient, { type Client } from "openapi-fetch";
import type { paths } from "./schema";

export type ApiClient = Client<paths>;
export type { paths };

export const createApiClient = (opts: {
  baseUrl: string;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}): ApiClient =>
  createClient<paths>({
    baseUrl: opts.baseUrl,
    fetch: opts.fetch,
    headers: opts.headers,
    credentials: opts.credentials,
  });
```

Verify GREEN (adapt only to `openapi-fetch`'s actual option names for the installed version — if `credentials` isn't a top-level option, pass it via `Request` init through a custom `fetch` wrapper; keep the tests as the contract). Write a 10-line README with the regen command. Workspace gates. Commit `feat(api-client): typed /v1 client generated from openapi spec`.

---

### Task 3: Relocate shared pure code to `@costwise/shared` (refactor)

**Files:** Move `packages/domain/src/utils/pricing.ts` and `utils/transformers.ts` (+ `helpers.test.ts` if it tests them) → `packages/shared/src/`; move `packages/domain/src/types/specialTypes.ts` → `packages/shared/src/`; for `types/context.ts`, move ONLY the web-consumed members (grep the 6 web imports for the symbols they use) into a new `packages/shared/src/uiTypes.ts` — members referencing repositories/db stay in domain.

- [ ] **Step 1:** `git mv` the whole-file moves; split `context.ts` per the grep; update `@costwise/shared` deps if transformers/pricing import anything new (they must NOT import `@costwise/db` — if one does, STOP and report).
- [ ] **Step 2:** Rewrite imports in BOTH `packages/domain` (services/repositories that used these utils/types — now import from `@costwise/shared/...`) and `apps/web` (all `@costwise/domain/utils/pricing|transformers`, `types/specialTypes`, moved context members → `@costwise/shared/...`).
- [ ] **Step 3:** Gates + `grep -rn "@costwise/db" packages/shared` empty + `grep -rn "domain/utils/pricing\|domain/utils/transformers\|domain/types/specialTypes" apps packages` empty. Commit `refactor(shared): move pure pricing/transformers/types to shared`. **Restart dev servers** (packages changed).

---

### Task 4: Server components → api-client (refactor, per-domain commits)

**Files:** Create `apps/web/src/app/lib/api.ts`; modify every page under `apps/web/src/app/(user)/` that instantiates a service, `apps/web/next.config.ts` (transpilePackages + add `@costwise/api-client`), `apps/web/package.json` (add the dep).

- [ ] **Step 1:** `apps/web/src/app/lib/api.ts`:

```ts
import { headers } from "next/headers";
import { createApiClient } from "@costwise/api-client";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiServer = async () => {
  const h = await headers();
  return createApiClient({ baseUrl, headers: { cookie: h.get("cookie") ?? "" } });
};

export const apiBrowser = createApiClient({ baseUrl, credentials: "include" });
```

`pnpm --filter web add "@costwise/api-client@workspace:*"`; add it to `transpilePackages`.

- [ ] **Step 2 (worked example — recipes list page, apply the same shape everywhere):** in `(user)/recipes/page.tsx`, replace the service block:

```ts
// BEFORE: new RecipeService(session.user.id); await service.findAll(session.user.id, metadata)
// AFTER:
const api = await apiServer();
const { data: rawRecipes } = await api.GET("/v1/recipes", {
  params: { query: { page: numericPage, order, sort, itemsPerPage, offset } },
});
const totalItems = rawRecipes ? rawRecipes.count.count : 0;
const recipes = rawRecipes ? rawRecipes.recipes : [];
```

Drop the now-unused `RecipeService`/`Metadata` imports (Metadata may still come from `@costwise/shared` where a type annotation remains). The session gate (`getServerSession` + redirect) stays as-is.

- [ ] **Step 3:** Apply per domain, one commit each, existing UI behavior identical:
  - recipes: list, `[id]` detail (`GET /v1/recipes/{id}`), create/edit pages (they fetch ingredients for the selector — use `GET /v1/ingredients`), then commit.
  - ingredients: list/detail/create/edit → `GET /v1/ingredients`, `/v1/ingredients/{id}`; commit.
  - suppliers: list/edit → `GET /v1/suppliers`, `/v1/suppliers/{id}`; commit.
  - home: replace each analytics service call with its endpoint (`/v1/analytics/recipes`, `/categories`, `/margins`, `/ingredients`, `/high-impact-ingredients`); do NOT touch the hardcoded demo fallbacks (bug 868kv80u3, out of scope); commit.
  Gates green at each commit; visually spot-check each domain's pages on `pnpm dev` before committing it.

---

### Task 5: Client mutations + search + upload → api-client (refactor)

**Files:** Rewrite `apps/web/src/app/services/services.ts` internals; touch the 5 hooks only where refresh is needed; modify `apps/web/src/app/hooks/useFileUpload.tsx`.

- [ ] **Step 1:** Rewrite each `services.ts` function body onto `apiBrowser` with the SAME name/signature/return contract the hooks expect (inspect each current function's return usage first; preserve it). Example:

```ts
export const sendRecipe = async (/* unchanged args */) => {
  const { data, error, response } = await apiBrowser.POST("/v1/recipes", { body: payload });
  if (error) throw new Error(error.error.message);
  return /* what the hook expected before — mirror the old success contract */;
};
```

`search` → `GET /v1/search` with `params: { query: { q: searchTerm } }`.

- [ ] **Step 2:** Refresh behavior: find every hook path that previously depended on `revalidatePath` (recipe create/update/delete at minimum — `useRecipeForm`, `useHelpers`): after the awaited mutation succeeds, call `router.refresh()` (add `useRouter` where missing) unless the hook already `router.push`es to a page that will render fresh (force-dynamic pages refetch on navigation — verify by testing create→list flow in the browser).
- [ ] **Step 3:** `useFileUpload`: open `apps/api/src/routes/uploads.ts` FIRST and mirror its actual contract (Task 2 mirrored the old web route: `?filename=` + raw body vs multipart — whichever it implements). Point the hook at `${NEXT_PUBLIC_API_URL}/v1/uploads` with `credentials: "include"`; if the route is multipart, use the api-client `POST` with FormData; if raw-body+query, a direct `fetch` via `apiBrowser`'s baseUrl is acceptable — note which in the commit.
- [ ] **Step 4:** Gates + full manual flow of one create/edit/delete per domain + search + upload on `pnpm dev`. Commit `refactor(web): client mutations through api-client`.

---

### Task 6: Deletions and dependency slimming

- [ ] **Step 1:** Delete `apps/web/src/app/api/` entirely (`git rm -r`). Anything still importing from it → fix (should be nothing after Tasks 4–5; STOP if judgment needed).
- [ ] **Step 2:** `pnpm --filter web remove @costwise/domain`; remove `@costwise/domain` from `transpilePackages`. Then grep-gate each candidate dep before removing from web `package.json`: `drizzle-orm`, `pg`, `bcrypt`, `@types/bcrypt`, `uid`, `uuid` — remove ONLY those with zero references in `apps/web/src`.
- [ ] **Step 3:** Task 3 debris cleanup: in `packages/db/src/db.ts` and `apps/api/src/auth.ts` delete the triple `dotenv.config(...)` blocks (and their `dotenv`/`path` imports); in `apps/api/src/index.ts` replace the triple block with a single `import "dotenv/config";` first line. **Restart dev**; verify `pnpm dev` still boots both servers with working DB (turbo `globalEnv` provides the vars).
- [ ] **Step 4:** Codify the ops lesson: in `docs/AGENTS.md`, append to the "Working rules" list: `- Dev-server rule: after ANY edit under packages/*, restart pnpm dev — Turbopack wedges on hot-reloading transpiled workspace packages and presents as blank 500s on every route.`
- [ ] **Step 5:** Acceptance greps: `grep -rn "@costwise/domain" apps/web` → empty; `ls apps/web/src/app/api` → does not exist; `grep -rn "revalidatePath" apps/web` → empty. Full gates. Commit `chore(web): delete legacy api routes and backend deps — web is pure UI`.

---

### Task 7: Final gate — ⛔ CHECKPOINT (human walkthrough) → PR

- [ ] **Step 1:** Push everything. Executor's own browser pass first: sign-in (credentials + Google), every list/detail/create/edit/delete, search, upload, dashboard, sign-out — recording any deviation.
- [ ] **Step 2: ⛔ CHECKPOINT — STOP.** Report to Panos with the executor-pass results. Panos performs the human walkthrough (spec criterion 4 — visuals per `docs/ui.md`, list-refresh after mutations). Only after his explicit pass:
- [ ] **Step 3:** Open the PR (CI must go green). Report per-criterion evidence. Do NOT merge; ClickUp moves through Panos/Fable 5.
