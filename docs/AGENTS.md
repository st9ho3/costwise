# AGENTS

This repository uses `docs/` as the single source of truth for project guidance.

Use these files as the canonical references:
- `docs/architecture.md` for the architecture and folder map
- `docs/where-to-touch.md` for edit routing and file ownership
- `docs/decisions.md` for the "why": invariants, constraints, and gotchas you must not break
- `docs/ui.md` for the UI design language, tokens, and primitive rules

Before any change that crosses a layer or touches pricing, recipe
recalculation, ingredient usage counts, transactions, ownership, or folder
names, read `docs/decisions.md` first.

## Delivery Process (ClickUp task → spec → plan → execute)

This loop applies to ALL work in this repository, no exceptions:

1. **ClickUp task** — every unit of work starts as a task in the ClickUp
   `Costwise` folder (Panos Workspace). One task = one spec = one plan =
   one execute-and-verify cycle. Tasks follow the **CostWise task
   contract** (ClickUp doc in the Costwise folder): template blocks
   (Context, Anchors, Acceptance criteria, Out of scope, Links) plus four
   fields — Type, Area (which layer/packages the change lands in),
   Surface (where the user feels it), Priority.
2. **Spec** — written to `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md`
   and approved by Panos before planning.
3. **Plan** — written to `docs/superpowers/plans/YYYY-MM-DD-<topic>.md`
   from the approved spec.
4. **Execute** — implementation follows the plan; the task's acceptance
   criteria are the verification gate; ClickUp status is updated when done.

**Model authority rule:** specs and plans are authored ONLY by the
Fable 5 model (`claude-fable-5`). All other models are executors: they
implement an existing approved plan and MUST NOT create, rewrite, or
re-scope specs or plans. If an executor finds a plan wrong, blocked, or
incomplete, it stops and reports back instead of improvising.

**TDD rule:** the canonical definition is the
`superpowers:test-driven-development` skill — its Iron Law applies: no
production code without a failing test first; code written before its
test is deleted and redone. Project bindings on top of the skill:
- Plans embed the RED test code verbatim, plus the verify-fail and
  verify-pass steps. Executors MUST NOT reorder, skip, or weaken them.
- The skill's exceptions (config files, generated code, pure file moves)
  are granted ONLY by being declared in the Fable 5-authored plan that
  Panos approved — an executor never self-declares an exception. Excepted
  steps still gate on the existing suite and build passing.
- Refactor steps follow the skill's refactor discipline: tests stay green
  throughout; any behavior change discovered mid-refactor gets its own
  RED test first.

Working rules:
- Prefer the smallest file that owns the change.
- Keep behavior, architecture, and routing guidance in `docs/` only.
- Before adding or restyling any UI, read `docs/ui.md` and use the primitives in `src/app/components/ui/`.
- If a rule becomes outdated, update this file instead of adding a second copy elsewhere.
- When in doubt, follow the layer order: UI -> hooks/stores -> services -> repositories -> database.

Project shape:
- Next.js App Router application
- Authenticated shell under `src/app/(user)`
- Auth pages under `src/app/(auth)`
- API routes under `src/app/api`
- Database schema and connection under `src/db`
- Domain logic in `src/app/services`
- Query/data access in `src/app/repositories`

