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

