# UI

The canonical UI guide. Architecture lives in `architecture.md`; routing in
`where-to-touch.md`; invariants in `decisions.md`. This file owns the **look**:
the design language, tokens, and how to build screens.

## Design Language — "Linear, soft"

Linear-aesthetic dominant, brutalism dialed to near-zero:

- Soft rounded corners (~6px), thin slate borders.
- Soft, blurred shadows; focus shows a ring, not a border jump.
- Restrained palette: one calm primary, semantic neutrals and intent colors.
- Linear identity cues: mono uppercase labels/metadata, thin separators, dense rhythm.
- No hard black offset shadows, no loud color blocks.

## Token Rules

- Never hardcode a color. Use a semantic token utility: `bg-card`,
  `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`,
  `bg-primary`, `bg-destructive`, `bg-success`, `bg-accent`, `bg-muted`.
- Tokens are defined once in `src/app/globals.css` (`@theme`). New value →
  add a token there first; do not inline hex or raw palette utilities
  (`bg-gray-100`, `text-blue-600`).
- Radius: `rounded-md` default, `rounded-lg` for panels. Shadows:
  `shadow-soft-sm` / `shadow-soft-md`.
- Light theme only today; the token structure supports adding `.dark` later.

## Primitive Rules

- Reusable UI lives in `src/app/components/ui/` (one component root).
- Compose primitives; do not restyle raw `<button>`/`<input>` ad hoc.
- Current primitives: Button, Input, Label, Textarea, Card, Badge, Select.
- Button variants: `default`, `outline`, `secondary`, `ghost`, `destructive`,
  `link`; sizes `sm`, `default`, `lg`, `icon`. This replaces all bespoke buttons.
- Customize a primitive by editing its source in `src/app/components/ui/`.

## Typography

- Sans (existing) for interface copy and headings (heavier weight + tight tracking).
- Mono (JetBrains Mono) for labels, metadata, and values — via `font-mono` or
  the `Label` primitive.

## Migration Status

- Migrated: Ingredients domain.
- Legacy (not yet migrated): recipes, suppliers, auth, layout, shared. These
  still use ad-hoc styling and bespoke buttons until their own migration plans.
