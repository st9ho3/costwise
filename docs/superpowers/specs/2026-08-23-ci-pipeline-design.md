# Task 1.5 — CI Pipeline (Spec)

**Date:** 2026-08-23
**ClickUp:** [Task 1.5 — CI pipeline (GitHub Actions)](https://app.clickup.com/t/868kv7u7m)
**Status:** Ready for planning

## Goal

Every PR to `main` is gated by an automated check that runs the full
workspace pipeline — build, test, lint — so the TDD discipline from
`docs/AGENTS.md` is enforced by machinery before any Task 2+ code lands.

## Decisions

1. **One GitHub Actions workflow**, `.github/workflows/ci.yml`, single job
   named `ci`, triggered on `pull_request` → `main` and `push` → `main`.
   Concurrency-cancel superseded runs on the same ref.
2. **Toolchain:** Node 24 (LTS), pnpm resolved from the root
   `packageManager` field via `pnpm/action-setup`; pnpm store cached by
   `actions/setup-node`, turbo cache in `.turbo` via `actions/cache`.
3. **Command:** `pnpm exec turbo run build test lint` — turbo is called
   directly, NOT through the root `dotenv -c` wrapper scripts, because CI
   has no `.env` file and `dotenv-cli` would fail on the missing file.
4. **Placeholder env vars** at workflow level so `next build` succeeds
   without secrets: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`,
   `AUTH_GOOGLE_SECRET` (the full set the code reads — verified by grep).
   `pg.Pool` and NextAuth do not connect/validate at build time, so dummy
   values suffice. No real secrets are stored in the workflow or repo.
5. **`--frozen-lockfile` install** — a PR that changes deps without
   updating `pnpm-lock.yaml` fails fast.
6. **Branch protection on `main`** requiring the `ci` check is a GitHub
   dashboard action performed by Panos; the plan delivers the exact
   click-path. CD stays with Vercel (Root Directory `apps/web`) — out of
   scope here.
7. **TDD exception (declared per docs/AGENTS.md):** this task is pure
   configuration — no production code, no new tests. Its gate is the
   workflow itself running green on a real PR.

## Acceptance Criteria

1. `ci.yml` exists on `main`; the `ci` check runs on a test PR and passes
   (install, build, test, lint all green).
2. The same command sequence passes locally with placeholder env, proving
   the pipeline doesn't depend on a `.env` file.
3. A PR with a deliberately failing test shows the check red (verified once
   during rollout, then the failing commit is dropped).
4. Panos has the branch-protection steps and has enabled (or explicitly
   deferred) the required check.

## Out of Scope

- API deploy pipelines (epic Task 5), release automation, coverage
  thresholds.
- Fallow advisory analysis — [Task 4.5](https://app.clickup.com/t/868kv7u7r),
  deliberately after Task 4 so the migration churn of Tasks 2–4 doesn't
  drown the dead-code/duplication report in noise. Fallow complements
  ESLint (project-graph analysis vs per-file correctness); ESLint remains
  the blocking gate.
