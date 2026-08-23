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
Fable 5 itself does NOT execute plans. The single exception: a task
Fable 5 explicitly declares **super-complex** in the spec and plan
header, with its reasoning stated — the bar is high (novel architecture
or judgment-dense work a plan cannot make executor-safe), and Fable 5
states the call outright either way.

**Executor modes and checkpoints:** every plan is executed in one of two
modes, and the plan's header says which applies by default:
- **Supervised** — a subagent dispatched by Fable 5 in-session; Fable 5
  reviews between plan tasks, no extra ceremony needed.
- **External** — any executor whose work Fable 5 cannot observe live
  (another session, another harness, e.g. Gemini on Antigravity). Git is
  the ONLY visible surface, so external executors MUST: (1) commit at
  every plan task boundary as the plans already require, AND push after
  every such commit; (2) paste the verification-gate output (test/build
  results, grep results) into the commit body so review needs no replay;
  (3) tick the plan file's `- [ ]` checkboxes in the same commit;
  (4) STOP at any step marked `⛔ CHECKPOINT` — push, report, and wait
  for review by Panos or Fable 5 before continuing. Proceeding past a
  checkpoint unreviewed is a plan violation even if everything is green.

**One writer per checkout:** an external executor MUST work in its own
clone or `git worktree` (`git worktree add ../costwise-<task> main`),
never in a directory another session is using. Two sessions sharing one
checkout switch branches under each other and commits land on the wrong
branch (this happened on 2026-08-23 during the CI task). The remote is
the only shared surface.

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

