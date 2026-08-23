# Task 1.5 — CI Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Authority note (docs/AGENTS.md Delivery Process):** authored by Fable 5; executors implement as written and STOP on anything the plan doesn't cover.
>
> **TDD note:** this task is a declared configuration exception (spec, Decision 7). No new tests; the gate is the workflow running green on a real PR.

**Goal:** Gate every PR to `main` with `turbo run build test lint` in GitHub Actions.

**Architecture:** One workflow file, one job. pnpm from the root `packageManager` field, Node 24, pnpm-store + turbo caching, placeholder env vars instead of secrets, turbo invoked directly (bypassing the `dotenv -c` root scripts because CI has no `.env`).

**Tech Stack:** GitHub Actions (`actions/checkout@v4`, `pnpm/action-setup@v4`, `actions/setup-node@v4`, `actions/cache@v4`), Turborepo 2, pnpm 11.

**Spec:** `docs/superpowers/specs/2026-08-23-ci-pipeline-design.md`
**ClickUp:** https://app.clickup.com/t/868kv7u7m

## Global Constraints

- No real secrets anywhere in the workflow or repo — placeholder values only.
- Job name must be exactly `ci` (branch protection will reference it).
- Do not modify root `package.json` scripts, `turbo.json`, or any app code.
- Work happens on branch `chore/ci-pipeline` off up-to-date `main`.

---

### Task 1: Preflight

**Files:** none

**Interfaces:**
- Produces: branch `chore/ci-pipeline` on a `main` that already contains the monorepo scaffold.

- [ ] **Step 1: Verify the scaffold is merged**

Run: `git fetch origin && git merge-base --is-ancestor origin/chore/monorepo-scaffold origin/main && echo MERGED || echo NOT-MERGED`
Expected: `MERGED`. If `NOT-MERGED`: **STOP and report** — this task depends on the monorepo layout being on `main`.

- [ ] **Step 2: Verify clean tree and branch off main**

```bash
git status --porcelain | wc -l   # must print 0; otherwise STOP and report
git checkout main && git pull origin main
git checkout -b chore/ci-pipeline
```

---

### Task 2: Create the workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: job `ci` that branch protection will require.

- [ ] **Step 1: Write `.github/workflows/ci.yml` with exactly:**

```yaml
name: ci

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

env:
  DATABASE_URL: postgres://ci:ci@localhost:5432/ci
  AUTH_SECRET: ci-placeholder-secret
  AUTH_GOOGLE_ID: ci-placeholder
  AUTH_GOOGLE_SECRET: ci-placeholder

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - uses: actions/cache@v4
        with:
          path: .turbo
          key: turbo-${{ github.ref_name }}-${{ github.sha }}
          restore-keys: |
            turbo-${{ github.ref_name }}-
            turbo-

      - run: pnpm install --frozen-lockfile

      - run: pnpm exec turbo run build test lint --cache-dir=.turbo
```

(`pnpm/action-setup@v4` reads the pnpm version from the root `packageManager` field — do not pin a version in the workflow.)

- [ ] **Step 2: Prove the CI command works without a `.env` file**

```bash
env -i HOME="$HOME" PATH="$PATH" \
  DATABASE_URL=postgres://ci:ci@localhost:5432/ci \
  AUTH_SECRET=ci-placeholder-secret \
  AUTH_GOOGLE_ID=ci-placeholder \
  AUTH_GOOGLE_SECRET=ci-placeholder \
  pnpm exec turbo run build test lint --cache-dir=.turbo --force
```

Expected: all three tasks pass (`--force` bypasses cache so this is a real run). If `next build` fails on a missing env var, add that exact var with a `ci-placeholder` value to BOTH this command and the workflow's `env:` block, note it for the report, and re-run.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions gate (build, test, lint on PRs to main)"
```

---

### Task 3: Prove the gate on a real PR

**Files:** none (uses the branch and GitHub)

**Interfaces:**
- Consumes: the `ci` job from Task 2.
- Produces: evidence the check passes when green and fails when red.

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin chore/ci-pipeline
gh pr create --base main --title "ci: add GitHub Actions gate" --body "$(cat <<'EOF'
Adds the ci workflow per docs/superpowers/specs/2026-08-23-ci-pipeline-design.md: pnpm install (frozen lockfile) + turbo run build test lint with placeholder env, pnpm/turbo caching.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 2: Watch the check go green**

Run: `gh pr checks --watch`
Expected: `ci` → pass. If it fails, read the log with `gh run view --log-failed`, fix ONLY within this plan's scope (workflow file / placeholder env), and push again. Anything else: STOP and report.

- [ ] **Step 3: Prove the gate can fail (red test canary)**

```bash
cat > apps/web/src/ci-canary.test.ts <<'EOF'
test('ci canary: must never land on main', () => {
  expect(true).toBe(false);
});
EOF
git add apps/web/src/ci-canary.test.ts
git commit -m "ci: TEMPORARY canary failing test - will be reverted"
git push
```

Run: `gh pr checks --watch`
Expected: `ci` → **fail**. This proves the gate actually blocks broken code.

- [ ] **Step 4: Remove the canary**

```bash
git revert --no-edit HEAD
git push
gh pr checks --watch
```

Expected: `ci` → pass again. The canary file must NOT exist in the final tree: `ls apps/web/src/ci-canary.test.ts` → "No such file".

---

### Task 4: Report and hand off branch protection

**Files:** none

- [ ] **Step 1: Final report to Panos**

Report:
- PR URL, with the check history showing green → red (canary) → green.
- Any env vars added beyond the planned four (Task 2 Step 2).
- The PR is ready to merge; do NOT merge it yourself.
- Branch-protection steps for Panos (dashboard, ~1 minute):
  GitHub repo **st9ho3/costwise** → Settings → Branches → Add branch
  ruleset (or classic protection rule) for `main` → enable **"Require
  status checks to pass"** → search and select **`ci`** → save. From then
  on PRs cannot merge with a red check.
- ClickUp task 868kv7u7m → review; status updates go through Panos or
  Fable 5.
