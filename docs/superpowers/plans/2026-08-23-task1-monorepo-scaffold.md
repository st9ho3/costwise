# Task 1 — Monorepo Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Authority note (docs/AGENTS.md Delivery Process):** this plan was authored by Fable 5. Executors implement it as written. If a step fails in a way the plan doesn't cover, STOP and report — do not redesign.

**Goal:** Convert the single-root Next.js repo into a pnpm-workspaces + Turborepo monorepo with `apps/web`, `packages/shared`, and `packages/db`, with zero behavior change.

**Architecture:** The whole Next.js app moves intact to `apps/web`. Zod schemas (`src/shemas`) become `@costwise/shared`; the Drizzle layer (`src/db` + `drizzle.config.ts`) becomes `@costwise/db`. Packages ship raw TypeScript (no build step); Next transpiles them via `transpilePackages`. Root scripts wrap turbo with `dotenv-cli` so the root `.env` reaches every task.

**Tech Stack:** pnpm 11 (installed: 11.0.9), Turborepo 2, dotenv-cli, Next.js 15.3.8, Drizzle, Jest 30.

**Spec:** `docs/superpowers/specs/2026-08-23-task1-monorepo-scaffold-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7ta9

## Global Constraints

- Zero behavior/UI change; `pnpm build`, `pnpm test`, `pnpm lint` must pass at the end of every task (2–5).
- Do NOT rename schema files or fix the `shemas` typo — contents move verbatim.
- Do NOT create `apps/api` or move services/repositories (Task 2 of the epic).
- Do NOT touch auth (Task 3 of the epic).
- Use `git mv` for all moves so history follows files.
- Package names exactly: `@costwise/shared`, `@costwise/db`, web app package `web`, root `costwise`.
- All imports of moved code use subpaths: `@costwise/shared/<file>`, `@costwise/db/<file>` (there are no bare `@/shemas` or `@/db` imports — verified).
- `apps/web` keeps ALL its current dependencies (even ones that look db-only, e.g. `drizzle-orm` — repositories import its operators directly). Dependency slimming happens in epic Task 2.

---

### Task 1: Preflight gate and branch

**Files:** none (verification only)

**Interfaces:**
- Produces: a clean working tree on branch `chore/monorepo-scaffold`, branched from the repo's main line after `feature/SupplierIngredients` has been landed.

- [ ] **Step 1: Verify the working tree is clean**

Run: `git status --porcelain | wc -l`
Expected: `0`

If non-zero: **STOP and report.** The `feature/SupplierIngredients` work (~149 files) must be committed and merged by Panos first. Do not stash, commit, or discard anything yourself.

- [ ] **Step 2: Verify toolchain**

Run: `pnpm -v && node -v`
Expected: pnpm `11.x` (11.0.9 installed), node `v26.x`

- [ ] **Step 3: Create the branch**

```bash
git checkout -b chore/monorepo-scaffold
```

Run: `git branch --show-current`
Expected: `chore/monorepo-scaffold`

---

### Task 2: Move the app to apps/web and establish the pnpm + Turborepo workspace

**Files:**
- Move: `src/`, `public/`, `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `jest.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`, `drizzle.config.ts` → `apps/web/`
- Delete: `package-lock.json`
- Create: `package.json` (new root), `pnpm-workspace.yaml`, `turbo.json`
- Modify: `apps/web/package.json` (name), `.gitignore`

**Interfaces:**
- Consumes: clean tree from Task 1.
- Produces: `pnpm dev|build|test|lint` working from the repo root; app runs from `apps/web`. Later tasks rely on root scripts `pnpm build` / `pnpm test` as their verification gate and on the workspace glob `packages/*`.

- [ ] **Step 1: Move the app**

```bash
mkdir -p apps/web
for f in src public package.json tsconfig.json next.config.ts next-env.d.ts jest.config.ts eslint.config.mjs postcss.config.mjs components.json drizzle.config.ts; do
  [ -e "$f" ] && git mv "$f" apps/web/
done
git rm package-lock.json
```

Note: `.env` stays at root. `docs/`, `README.md`, `CLAUDE.md`, `.gitignore` stay at root.

- [ ] **Step 2: Create the root package.json**

Create `package.json` at root with exactly:

```json
{
  "name": "costwise",
  "private": true,
  "packageManager": "pnpm@11.0.9",
  "scripts": {
    "dev": "dotenv -c -- turbo run dev",
    "build": "dotenv -c -- turbo run build",
    "start": "dotenv -c -- turbo run start",
    "lint": "turbo run lint",
    "test": "dotenv -c -- turbo run test"
  },
  "devDependencies": {
    "dotenv-cli": "^8.0.0",
    "turbo": "^2.5.0"
  },
  "pnpm": {
    "onlyBuiltDependencies": ["bcrypt", "sharp", "@tailwindcss/oxide"]
  }
}
```

(`dotenv -c` loads `.env` plus any `.env.local`-style cascade from the root. `onlyBuiltDependencies` is required because pnpm ≥10 blocks postinstall scripts by default — without it, `bcrypt` silently fails at runtime.)

- [ ] **Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": { "cache": false, "persistent": true },
    "start": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "cache": false }
  }
}
```

- [ ] **Step 5: Rename the web package**

In `apps/web/package.json`, change `"name": "agent"` to `"name": "web"`. Leave every script and dependency untouched.

- [ ] **Step 6: Un-anchor .gitignore patterns**

In `.gitignore`, the Next/CRA defaults are root-anchored and will stop matching under `apps/web`. Replace these exact lines:

| Old | New |
|-----|-----|
| `/node_modules` | `node_modules/` |
| `/coverage` | `coverage/` |
| `/.next/` | `.next/` |
| `/out/` | `out/` |
| `/build` | `build/` |

Also append:

```
.turbo/
```

- [ ] **Step 7: Install with pnpm**

Run: `pnpm install`
Expected: succeeds, creates `pnpm-lock.yaml` at root and `node_modules` at root + `apps/web`. Warnings about peer deps are acceptable; errors are not.

- [ ] **Step 8: Verify build**

Run: `pnpm build`
Expected: turbo runs `web#build` (`next build`) successfully.

If it fails with a module-not-found for a package that used to be phantom-hoisted by npm, add that exact package to `apps/web/package.json` dependencies with `pnpm --filter web add <pkg>` and re-run. Report any such additions.

- [ ] **Step 9: Verify tests and lint**

Run: `pnpm test`
Expected: same suites pass as on the pre-move baseline (Jest via next/jest).

Run: `pnpm lint`
Expected: passes (warnings acceptable if they existed before).

- [ ] **Step 10: Smoke-test the dev server**

```bash
(pnpm dev &) ; sleep 15
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/signin
```

Expected: `200`. Then stop the dev server (`kill` the `next dev` process; e.g. `pkill -f "next dev"`).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: move app to apps/web under pnpm + turborepo workspace"
```

---

### Task 3: Extract @costwise/shared (Zod schemas)

**Files:**
- Move: `apps/web/src/shemas/{auth,chat,recipe}.ts` → `packages/shared/src/`
- Create: `packages/shared/package.json`, `packages/shared/tsconfig.json`
- Modify: `apps/web/next.config.ts` (transpilePackages), `apps/web/package.json` (dependency), every file importing `@/shemas/*`

**Interfaces:**
- Consumes: workspace from Task 2.
- Produces: package `@costwise/shared` with subpath exports — imports become `@costwise/shared/auth`, `@costwise/shared/chat`, `@costwise/shared/recipe` (same named exports as before, files unrenamed).

- [ ] **Step 1: Move the schema files**

```bash
mkdir -p packages/shared/src
git mv apps/web/src/shemas/auth.ts packages/shared/src/auth.ts
git mv apps/web/src/shemas/chat.ts packages/shared/src/chat.ts
git mv apps/web/src/shemas/recipe.ts packages/shared/src/recipe.ts
```

- [ ] **Step 2: Create packages/shared/package.json**

```json
{
  "name": "@costwise/shared",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./*": "./src/*.ts"
  },
  "scripts": {
    "build": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.25.75"
  },
  "devDependencies": {
    "typescript": "^5"
  }
}
```

(No barrel index: subpath wildcard exports keep the import shape 1:1 with today's `@/shemas/<file>` imports and avoid cross-file name collisions. `build` is a type-check only — packages ship TS source.)

- [ ] **Step 3: Create packages/shared/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Wire the dependency and transpilePackages**

```bash
pnpm --filter web add "@costwise/shared@workspace:*"
```

In `apps/web/next.config.ts`, add to the config object (before `export default`):

```ts
const nextConfig: NextConfig = {
 transpilePackages: ["@costwise/shared"],
 images: {
   // ... existing block unchanged
```

- [ ] **Step 5: Rewrite imports**

```bash
grep -rl "@/shemas/" apps/web/src | xargs sed -i '' 's|@/shemas/|@costwise/shared/|g'
```

- [ ] **Step 6: Verify no schema imports remain**

Run: `grep -rn "shemas" apps/web/src | grep -v "://"`
Expected: no import statements referencing `shemas` (comments/strings mentioning the word are acceptable; report them but don't edit).

- [ ] **Step 7: Install and verify**

Run: `pnpm install` (links the new package)
Run: `pnpm build`
Expected: turbo builds `@costwise/shared` (tsc) then `web` successfully.

Run: `pnpm test`
Expected: same pass results as Task 2 Step 9 (Jest ≥28 resolves the `exports` field; workspace symlinks resolve to real paths outside `node_modules`, so the TS sources are transformed).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: extract zod schemas into @costwise/shared"
```

---

### Task 4: Extract @costwise/db (Drizzle layer)

**Files:**
- Move: `apps/web/src/db/{db,schema,helpers}.ts` → `packages/db/src/`; `apps/web/drizzle.config.ts` → `packages/db/drizzle.config.ts`
- Create: `packages/db/package.json`, `packages/db/tsconfig.json`, `packages/db/src/pg.d.ts`
- Modify: `packages/db/drizzle.config.ts` (schema path), `apps/web/next.config.ts` (transpilePackages), `apps/web/package.json` (dependency), every file importing `@/db/*`

**Interfaces:**
- Consumes: workspace from Task 2 (pattern identical to Task 3).
- Produces: package `@costwise/db` — imports become `@costwise/db/db` (the `db` Drizzle instance), `@costwise/db/schema` (tables/enums/relations), `@costwise/db/helpers` (`checkIfRecipeExists`, `checkIfIngredientExists`). Drizzle CLI runs from `packages/db` via `pnpm --filter @costwise/db run generate|push`.

- [ ] **Step 1: Move the files**

```bash
mkdir -p packages/db/src
git mv apps/web/src/db/db.ts packages/db/src/db.ts
git mv apps/web/src/db/schema.ts packages/db/src/schema.ts
git mv apps/web/src/db/helpers.ts packages/db/src/helpers.ts
git mv apps/web/drizzle.config.ts packages/db/drizzle.config.ts
```

- [ ] **Step 2: Create packages/db/src/pg.d.ts**

The `pg` package has no bundled types; the app used a one-line shim in `apps/web/src/types/pg.d.ts` (which stays where it is). The package needs its own copy to type-check standalone:

```ts
declare module 'pg';
```

- [ ] **Step 3: Fix the drizzle config schema path**

In `packages/db/drizzle.config.ts`, change `schema: './src/db/schema.ts'` to `schema: './src/schema.ts'`. Everything else (including `out: './drizzle'`) stays — migrations will land in `packages/db/drizzle/`.

- [ ] **Step 4: Create packages/db/package.json**

```json
{
  "name": "@costwise/db",
  "version": "0.0.0",
  "private": true,
  "exports": {
    "./*": "./src/*.ts"
  },
  "scripts": {
    "build": "tsc --noEmit",
    "generate": "drizzle-kit generate",
    "push": "drizzle-kit push"
  },
  "dependencies": {
    "dotenv": "^17.2.0",
    "drizzle-orm": "^0.44.5",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "drizzle-kit": "^0.31.4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 5: Create packages/db/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "types": ["node"]
  },
  "include": ["src", "drizzle.config.ts"]
}
```

Then: `pnpm --filter @costwise/db add -D @types/node`

- [ ] **Step 6: Wire the dependency and transpilePackages**

```bash
pnpm --filter web add "@costwise/db@workspace:*"
```

In `apps/web/next.config.ts`: `transpilePackages: ["@costwise/shared", "@costwise/db"]`.

- [ ] **Step 7: Rewrite imports**

```bash
grep -rl "@/db/" apps/web/src | xargs sed -i '' 's|@/db/|@costwise/db/|g'
```

- [ ] **Step 8: Verify no old db imports remain**

Run: `grep -rn "from ['\"]@/db\|from ['\"].*\.\./db/" apps/web/src`
Expected: empty.

- [ ] **Step 9: Install and verify**

Run: `pnpm install && pnpm build && pnpm test && pnpm lint`
Expected: all pass, `@costwise/db` type-checks in the build graph.

- [ ] **Step 10: Verify Drizzle CLI works from the package**

```bash
dotenv -c -- pnpm --filter @costwise/db run generate
```

Expected: drizzle-kit runs and reports the schema is read (it may emit a no-op migration or "No schema changes"). Delete any generated no-op migration folder afterwards: `git status` must be clean of unwanted `packages/db/drizzle/` output before committing (`rm -rf packages/db/drizzle` if it only contains the no-op check output).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: extract drizzle layer into @costwise/db"
```

---

### Task 5: Full acceptance gate

**Files:** none (verification + report)

**Interfaces:**
- Consumes: everything above.
- Produces: pass/fail against the spec's acceptance criteria; report for Panos.

- [ ] **Step 1: Clean-room install check**

```bash
git clean -ndx   # review what WOULD be removed — expect only node_modules, .next, .turbo, tsconfig.tsbuildinfo; STOP if .env or source files appear
git clean -fdx -e .env
pnpm install
```

Expected: install succeeds from scratch. (`-e .env` protects the untracked env file.)

- [ ] **Step 2: Run every gate**

```bash
pnpm build && pnpm test && pnpm lint
```

Expected: all pass.

- [ ] **Step 3: Import-hygiene greps (spec criterion 6)**

```bash
grep -rn "@/shemas\|@/db/" apps/web/src
grep -rn "src/shemas\|src/db" apps/web/src
```

Expected: both empty.

- [ ] **Step 4: Manual smoke walkthrough**

Start `pnpm dev`, then verify with the browser or curl that these routes return 200 and render: `/signin`, `/` (redirects to signin when unauthenticated — a 3xx to `/signin` is the correct behavior), and after signing in with a test account: recipes, ingredients, suppliers list pages. Stop the server after.

- [ ] **Step 5: Final report**

Report to Panos:
- Result of every gate (build/test/lint/greps/smoke), with output for anything unexpected.
- Any dependencies that had to be explicitly added due to pnpm strictness (Task 2 Step 8).
- Reminder: **Vercel project setting "Root Directory" must be changed to `apps/web`** before the next deploy — this is a dashboard action for Panos.
- The branch `chore/monorepo-scaffold` is ready for review/merge; do NOT merge it yourself.
- ClickUp task 868kv7ta9 can be moved to review — status updates go through Panos or Fable 5.
