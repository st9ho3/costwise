# Task 1 — Monorepo Scaffold (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 1 — Monorepo scaffold](https://app.clickup.com/t/868kv7ta9)
**Parent spec:** `docs/superpowers/specs/2026-08-23-ui-backend-separation-design.md` (Section 7, Task 1; ADR 1)
**Status:** Ready for planning

## Goal

Convert the single-root Next.js repository into a pnpm-workspaces +
Turborepo monorepo with `apps/web`, `packages/shared`, and `packages/db` —
with zero change to app behavior, UI, or test outcomes.

## Current State (verified 2026-08-23)

- Package manager is **npm** (`package-lock.json` at root). pnpm is not in
  use yet — the migration to pnpm is part of this task.
- All app code lives under `src/` with the tsconfig alias `@/*` → `./src/*`,
  used throughout.
- `src/shemas/` contains `auth.ts`, `chat.ts`, `recipe.ts` (Zod schemas +
  inferred types), imported widely via `@/shemas/...`.
- `src/db/` contains `db.ts` (Drizzle connection), `schema.ts`, `helpers.ts`;
  `drizzle.config.ts` sits at root.
- `src/types/` is broadly imported but entangled with repository/service/db
  types — it does **not** move in this task (sorted in Task 2).
- Root configs: `next.config.ts`, `jest.config.ts`, `eslint.config.mjs`,
  `postcss.config.mjs`, `components.json`, `tsconfig.json`.
- **Precondition:** the working tree has ~149 uncommitted changes on
  `feature/SupplierIngredients`. That work must be committed and merged (or
  explicitly parked) before restructuring begins. The scaffold starts from a
  clean tree on a fresh branch.

## Target State

```
costwise/
  package.json              private root; scripts delegate to turbo
  pnpm-workspace.yaml       apps/*, packages/*
  turbo.json                dev, build, lint, test pipelines
  apps/
    web/                    the entire current Next.js app, moved intact
      package.json          name: web; current deps minus what moves to packages
      next.config.ts, jest.config.ts, eslint.config.mjs,
      postcss.config.mjs, components.json, tsconfig.json
      src/                  everything except src/shemas and src/db
  packages/
    shared/                 name: @costwise/shared
      src/                  auth.ts, chat.ts, recipe.ts (from src/shemas, unrenamed)
      package.json          deps: zod
    db/                     name: @costwise/db
      src/                  db.ts, schema.ts, helpers.ts (from src/db)
      drizzle.config.ts     moved from root
      package.json          deps: drizzle-orm, pg, dotenv
```

## Decisions

1. **Package manager migration npm → pnpm** in this task (acceptance
   criteria require `pnpm dev`). Delete `package-lock.json`, generate
   `pnpm-lock.yaml`, pin via `"packageManager"` field (corepack).
2. **Package naming:** `@costwise/shared` and `@costwise/db`, consumed via
   `workspace:*` dependencies. The web app package is named `web`.
3. **Import strategy:** inside `apps/web`, `@/*` alias stays exactly as-is
   for everything that remains. Imports of `@/shemas/...` become
   `@costwise/shared`; imports of `@/db/...` become `@costwise/db`. This is
   a mechanical, global find-and-replace-with-verification.
4. **Packages ship TypeScript source** (no build step): `main`/`exports`
   point at `src/index.ts`; Next.js transpiles them via
   `transpilePackages: ["@costwise/shared", "@costwise/db"]`. Avoids build
   orchestration complexity now; Task 2 can revisit if the API needs
   compiled output.
5. **Packages expose wildcard subpath exports** (`"./*": "./src/*.ts"`), so
   imports stay 1:1 with today's shape (`@/shemas/recipe` →
   `@costwise/shared/recipe`) and no barrel-collision risk exists. File
   names inside packages are NOT renamed (per ClickUp out-of-scope),
   including the `shemas` typo heritage — contents move verbatim.
6. **`src/types` stays in `apps/web`** untouched. Its db-coupled members now
   import from `@costwise/db` instead of `@/db`.
7. **Turborepo pipelines:** `dev` (persistent, no cache), `build`
   (dependency-ordered), `lint`, `test`. Root scripts: `pnpm dev`,
   `pnpm build`, `pnpm lint`, `pnpm test` delegate to turbo.
8. **Env files:** `.env` stays at repo root; root scripts wrap turbo with
   `dotenv-cli` (`dotenv -c -- turbo run ...`) so every workspace task
   inherits it. Drizzle CLI commands run from `packages/db` through the
   same wrapper.
9. **Git history:** moves use `git mv` where possible so history follows
   files.

## Acceptance Criteria (verification gate)

From the ClickUp task, made concrete:

1. `pnpm install` succeeds from a clean checkout.
2. `pnpm dev` serves the web app from `apps/web`; manual smoke test of
   sign-in, recipes, ingredients, and suppliers pages shows no regression.
3. `pnpm build` passes (includes type-checking across all packages).
4. `pnpm test` passes with the same results as before the move.
5. `pnpm lint` passes.
6. No file outside `packages/` imports `src/shemas` or `src/db` paths;
   `grep` for `@/shemas` and `@/db` in `apps/web` returns nothing.
7. Drizzle commands (`drizzle-kit` generate/push) work from `packages/db`.

## Out of Scope

- `apps/api`, moving services/repositories (Task 2).
- Auth changes (Task 3).
- Renaming schema files/paths or fixing the `shemas` typo.
- `packages/agent-core`, `apps/mobile` (later tasks).
- Vercel deployment config for the monorepo (root directory setting) — noted
  as a follow-up check in Task 5, though a quick Vercel root-dir update is
  allowed here if the current deployment breaks.

## Risks & Mitigations

- **Vercel deploy breaks** when the app moves to `apps/web` → set the Vercel
  project "Root Directory" to `apps/web` right after merging; no users are
  affected (pre-production).
- **npm→pnpm strictness** (pnpm doesn't hoist phantom dependencies) may
  surface imports of packages not declared in `package.json` → fix by
  declaring them explicitly; this is a feature, not a bug.
- **Path alias drift in tests/jest moduleNameMapper** → jest config moves
  with `apps/web` and its mapper is re-verified by the test gate.
