# Shadcn Design System — Design Spec

> **Status:** Design approved 2026-06-15. Awaiting spec review before plan.

## Goal

Introduce a consistent, token-driven UI system to the CostWise app by adopting
shadcn/ui as the shared primitive layer, defining a semantic design-token
foundation, and proving the system by migrating the **Ingredients** domain
end-to-end. Other domains migrate in later plans.

## Design Language

**"Linear, soft" — Linear aesthetic dominant, brutalism dialed to near-zero.**

Resolved during brainstorming (user: "not too hard", "linear a"):

- Soft rounded corners (~6px), thin **slate** borders (not black).
- Soft, blurred shadows + a focus ring/glow — **no hard black offset shadows**.
- Restrained palette: one calm primary (slate/indigo family), semantic
  neutrals, semantic intent colors. No loud brutalist color blocks.
- Linear identity cues kept: **mono uppercase labels/metadata**, thin
  structural separators, dense information rhythm.

This intentionally **supersedes** the soft-gray token set proposed in the
earlier UI audit and is *not* the full brutalist spec from the SupplyR
reference plan — it sits between them, Linear-leaning.

## Scope

**In scope (this spec → one implementation plan):**

- shadcn/ui init configured to the project's structure.
- Semantic design tokens in `globals.css` (light-only).
- A `cn()` class-merge helper.
- Core customized primitives: Button, Input, Label, Textarea, Select, Card, Badge.
- Migration of the **Ingredients** domain onto the primitives and tokens.
- `docs/ui.md` plus pointer wiring into `CLAUDE.md` and `docs/AGENTS.md`.

**Out of scope (later plans):**

- Migration of recipes, suppliers, auth, layout, and shared components.
- Deletion of the 8 legacy button components (they stay until their domains migrate).
- Dark theme (token structure will permit adding it later).
- New display/brand font (may add later).

## Tech Context

- Next.js 15.3.8 (App Router), React 19, Tailwind CSS v4, TypeScript 5, npm.
- Path alias `@/*` → `./src/*` (`tsconfig.json`).
- Components live under `src/app/components/...` (per `docs/where-to-touch.md`).
  There is no `src/components/`. No `components.json` yet.
- `clsx` already installed; `tailwind-merge` is not.
- `globals.css` currently defines only `--background`/`--foreground`; dark mode
  is commented out; `body { font-size: small }` sets density; number-input
  spinners are reset.

## Architecture Decisions

### Primitive location — one components root

Configure `components.json` so the shadcn CLI writes primitives into
`src/app/components/ui/` (not the default `src/components/ui/`). This keeps a
single component root consistent with `docs/where-to-touch.md`.

- Rejected: shadcn default `src/components/ui/` — introduces a second component
  root, contradicts the architecture docs.
- Rejected: hand-building primitives without the CLI — re-implements Radix
  accessibility (Select/Dropdown) for no gain after choosing shadcn.

### Token strategy

Semantic CSS variables consumed via Tailwind v4 `@theme`. Components reference
semantic utilities (`bg-card`, `text-muted-foreground`, `border-border`,
`ring-ring`) — never raw palette utilities (`bg-gray-100`) or hex values.

### Fonts

Keep the existing sans. Add **JetBrains Mono** for labels/metadata (the mono
accent is core to the Linear identity). No separate display font — headings use
the sans at heavier weight with tighter tracking.

## Components / Units

### 1. Token foundation (`src/app/globals.css`)

- `@theme` semantic tokens (light-only): `background`, `foreground`, `card`,
  `card-foreground`, `popover`, `popover-foreground`, `primary`,
  `primary-foreground`, `secondary`, `secondary-foreground`, `muted`,
  `muted-foreground`, `accent`, `accent-foreground`, `destructive`,
  `destructive-foreground`, `border`, `input`, `ring`.
- `--radius: 6px` with `sm/md/lg` derivations.
- Soft shadow utilities (subtle blurred shadows; no hard offsets).
- Font variables: `--font-sans` (existing), `--font-mono` (JetBrains Mono).
- Preserve `body { font-size: small }` density and the number-input spinner reset.

### 2. `cn()` helper (`src/app/utils/cn.ts`)

Standard `clsx` + `tailwind-merge` merge helper. Add `tailwind-merge` dependency.
All primitives compose classes through `cn()`.

### 3. Primitives (`src/app/components/ui/`)

Added via shadcn CLI, then customized to the Linear-soft spec:

- **Button** — variants `default`, `outline`, `ghost`, `destructive`, `link`;
  sizes `sm`, `default`, `lg`, `icon`. Replaces all 8 legacy button components
  (legacy ones remain until their domains migrate).
- **Input**, **Label**, **Textarea** — soft borders, mono uppercase labels,
  focus ring.
- **Select** — Radix-backed; soft popover, mono trigger, compact items.
- **Card** — soft panel, thin separators, dense `px`/`py`.
- **Badge** — compact mono utility labels.

All use 6px radius, slate borders, soft shadow, focus ring (no border-jump).

### 4. Ingredients migration (`src/app/components/ingredients/*`)

- Replace raw `<button>`/`<input>`/`<select>` and the one-off
  `ingredientsFormComponents/button/` with the new primitives.
- Covers `ingredientForm.tsx` and the `ingredientPage` components.
- Replace ad-hoc gray/blue/red utilities with semantic tokens.
- Recipes, suppliers, auth, layout untouched and functional on legacy styling.

### 5. Documentation

- `docs/ui.md` — canonical UI doc: Linear-soft design principles; token rules
  ("never hardcode a color/spacing value, use a token; new value → add a token
  first"); primitive catalog + "compose primitives, don't restyle raw elements";
  typography roles; "all shared UI lives in `src/app/components/ui/`".
- Wire pointer into `CLAUDE.md` and `docs/AGENTS.md` (same pattern as
  `decisions.md`).

## Data Flow / Interfaces

- Primitives are presentational: props in (`variant`, `size`, `className`,
  native element props), styled markup out. No data/business logic.
- Consumers import from `@/app/components/ui/<primitive>` and pass `className`
  for layout-specific overrides, merged safely by `cn()`.

## Error Handling

- Not applicable to presentational primitives. Form validation behavior in the
  Ingredients domain is unchanged — only markup/styling is swapped, not logic.

## Testing / Verification

- `npm run build` passes (Next.js production build).
- `tsc` typecheck passes (variant/prop typing, Radix imports).
- Visual check: Ingredients create, edit, and list screens render correctly in
  the new look; buttons, inputs, selects, badges, and cards read as intended.
- Recipes/suppliers/auth pages still render and function on legacy styling.

## Risks

- shadcn Tailwind v4 support is relatively recent — init may need the
  `@theme`/CSS-variable setup wired manually. Mitigation: configure
  `components.json` explicitly and verify the first primitive renders before
  customizing the rest.
- Legacy and new styling coexist during migration — acceptable and intentional;
  the boundary is per-domain.
