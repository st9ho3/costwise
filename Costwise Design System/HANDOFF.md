# Handoff: Costwise Design System

## Overview

Costwise is a companion app for small food-and-beverage businesses — a café, a bakery, a
20-cover trattoria. It tracks ingredient prices, works out what each dish costs to put on a
plate, reads supplier invoices, and tells the owner in plain language what changed and what to
do about it. The product is framed as an **assistant, not a dashboard**: warm, casual, on the
owner's side.

This project is the complete design system — colour/type/space/shape/motion tokens, 24 React
components, 27 specimen cards, and a 5-screen web-app UI kit that composes all of it.

## About the design files

**The files here are design references created in HTML.** They are prototypes that show
intended look and behaviour — not production code to lift wholesale.

The task is to **recreate these designs in your codebase's existing environment** (React, Vue,
SwiftUI, native, whatever you run) using its established patterns, state library, routing and
build tooling. If no environment exists yet, pick the framework that suits the project and
implement the designs there.

Two things *are* directly portable and should be treated as the source of truth:

- **`tokens/*.css`** — plain CSS custom properties. Copy verbatim, or transpile into whatever
  token format you use (Tailwind theme, SCSS map, Style Dictionary, Swift constants). Every
  value in this document comes from these files.
- **`assets/*.png`** — the real brand assets. Use these files; do not redraw them.

The `.jsx` components are deliberately dependency-free (React only, styles injected as plain CSS
referencing the custom properties) so they read as clear specifications. Port their **structure,
class semantics and state logic**; re-implement them in your own component conventions rather
than dropping them in.

Ignore these build artefacts: `_ds_bundle.js`, `_ds_manifest.json`, `_adherence.oxlintrc.json`,
`support.js`, `thumbnail.html`, `Canvas.dc.html`, `uploads/`.

## Fidelity

**High fidelity.** Colours, type scale, spacing, radii, shadows, motion curves and copy are all
final and exact. Recreate pixel-perfectly. Every numeric value in this document is the intended
value — do not round or snap to a 4/8px grid, and do not substitute your framework's defaults
(the system deliberately uses 6px, 14px, 18px, 26px and 5px steps in places).

One caveat, flagged under **Assets**: the fonts and icon set are *substitutions*. Colours,
layout, spacing and behaviour are not.

---

## Design tokens

All tokens are CSS custom properties on `:root`. Source files are in `tokens/`, reached through
the single entry point `styles.css` (which is nothing but `@import` lines).

### Colour — base ramps

Sampled from the brand assets. The greens come from the coin-broccoli logo mark; the golds from
its stacked coins; the produce accents from the 3D illustration cast.

**Green** (primary)

| Token | Hex | | Token | Hex |
| --- | --- | --- | --- | --- |
| `--green-950` | `#0B2213` | | `--green-400` | `#6FB86E` |
| `--green-900` | `#123420` | | `--green-300` | `#9AD183` |
| `--green-800` | `#1B4A2C` | | `--green-200` | `#C6E7AF` |
| `--green-700` | `#24603A` | | `--green-100` | `#E4F3D8` |
| `--green-600` | `#2F7A45` | | `--green-50`  | `#F2F9EC` |
| `--green-500` | `#43955A` | | | |

**Gold** (accent — money, nudges)

`--gold-800 #6E4A11` · `--gold-700 #8A5F16` · `--gold-600 #B98A2A` · `--gold-500 #DCB24A` ·
`--gold-400 #E9C86B` · `--gold-300 #F3DFA3` · `--gold-100 #FBF1D4`

**Produce accents**

`--clay-700 #9E4220` · `--clay-600 #C4552C` · `--clay-500 #EE7B3C` · `--clay-300 #F7BC91` · `--clay-100 #FDEBDD`
`--tomato-700 #9E2A20` · `--tomato-600 #C0392B` · `--tomato-500 #DE5145` · `--tomato-100 #FBE6E3`
`--berry-600 #7A4A8C` · `--berry-500 #9A63AC` · `--berry-100 #F1E7F5`
`--blueberry-600 #3A6E9E` · `--blueberry-500 #4A86C4` · `--blueberry-100 #E6EFF8`

**Warm neutrals** — *critical: these are paper, never grey. Every neutral carries yellow.*

`--cream-50 #FDFBF6` · `--cream-100 #F8F4EA` · `--cream-200 #F0EADC` ·
`--sand-300 #E2DACA` · `--sand-400 #C9BFAA` ·
`--stone-500 #8C8574` · `--stone-600 #6B6558` ·
`--ink-700 #45413A` · `--ink-800 #2C2A25` · `--ink-900 #1B1A16` · `--white #FFFFFF`

### Colour — semantic aliases

**Always consume these, not the ramps.**

| Alias | Value | Used for |
| --- | --- | --- |
| `--surface-page` | `--cream-50` | Page background |
| `--surface-card` | `--white` | Cards |
| `--surface-sunken` | `--cream-100` | Nested panels, filled inputs, tab track |
| `--surface-inset` | `--cream-200` | Deepest inset, meter track |
| `--surface-brand` | `--green-800` | The one hero card per screen |
| `--surface-brand-strong` | `--green-900` | Pressed brand |
| `--surface-brand-soft` | `--green-50` | Active nav pill, ghost hover, avatar plate |
| `--surface-accent-soft` | `--gold-100` | "Costwise spotted this" cards |
| `--surface-warm-soft` | `--clay-100` | Occasional warm wash |
| `--surface-overlay` | `rgba(27,26,22,.42)` | Dialog scrim |
| `--surface-glass` | `rgba(253,251,246,.78)` | Sticky topbar (with 8px blur) |
| `--text-strong` | `--ink-900` | Headings, values |
| `--text-body` | `--ink-700` | Prose |
| `--text-muted` | `--stone-500` | Captions, overlines |
| `--text-faint` | `--sand-400` | Placeholder text only |
| `--text-brand` | `--green-700` | Brand text, ghost buttons |
| `--text-on-brand` | `--cream-50` | Text on green |
| `--text-on-accent` | `--gold-800` | Text on gold |
| `--text-link` / `--text-link-hover` | `--green-700` / `--green-900` | Links |
| `--border-subtle` | `#EFE8DA` | Card edges, list dividers |
| `--border-default` | `--sand-300` | Inputs, secondary buttons |
| `--border-strong` | `--sand-400` | Input hover, checkbox |
| `--border-focus` | `--green-500` | Focused field border |

### Colour — status

Costwise uses its own cost vocabulary rather than success/warning/error.

| Tone | Solid | Soft (background) | Text | Meaning |
| --- | --- | --- | --- | --- |
| `good` | `--green-600 #2F7A45` | `--green-100 #E4F3D8` | `--green-800 #1B4A2C` | On target |
| `watch` | `--gold-600 #B98A2A` | `--gold-100 #FBF1D4` | `--gold-800 #6E4A11` | Drifting |
| `over` | `--tomato-600 #C0392B` | `--tomato-100 #FBE6E3` | `--tomato-700 #9E2A20` | Above target |
| `info` | `--blueberry-500 #4A86C4` | `--blueberry-100 #E6EFF8` | `--blueberry-600 #3A6E9E` | Price changed |
| `agent` | `--berry-500 #9A63AC` | `--berry-100 #F1E7F5` | `--berry-600 #7A4A8C` | Costwise noticed |

### Colour — data visualisation

Ordered ramp: `--viz-1 #43955A`, `--viz-2 #DCB24A`, `--viz-3 #EE7B3C`, `--viz-4 #9A63AC`,
`--viz-5 #4A86C4`, `--viz-6 #9AD183`. Track: `--viz-track #F0EADC`.

**Bars and meters only. No pie charts, no donuts, no gauges.**

### Typography

| Token | Stack | Role |
| --- | --- | --- |
| `--font-display` | `"Bricolage Grotesque", Trebuchet MS, sans-serif` | Headlines, titles, big metrics |
| `--font-body` | `"Nunito Sans", Avenir Next, Segoe UI, sans-serif` | All prose, labels, buttons |
| `--font-logotype` | `"Baloo 2", sans-serif` | Wordmark only — **never UI copy** |
| `--font-mono` | `"IBM Plex Mono", ui-monospace, monospace` | Money and quantities, always `tabular-nums` |

**Size scale** — `--text-2xs 11` · `xs 12` · `sm 13` · `base 15` · `md 17` · `lg 20` · `xl 24` ·
`2xl 30` · `3xl 38` · `4xl 48` · `5xl 60` (px).

**Leading** — `tight 1.08` · `snug 1.22` · `normal 1.45` · `relaxed 1.62`.
**Tracking** — `tight -0.02em` · `snug -0.01em` · `normal 0` · `wide 0.04em` · `caps 0.08em`.
**Weights** — `regular 400` · `medium 500` · `semibold 600` · `bold 700` · `black 800`.

**Composite roles** (CSS `font` shorthand tokens — use these):

| Token | Resolves to |
| --- | --- |
| `--type-display` | 700 48px/1.08 display, `-0.02em` |
| `--type-title` | 700 30px/1.22 display |
| `--type-heading` | 700 20px/1.22 display |
| `--type-subheading` | 700 17px/1.22 body |
| `--type-body` | 400 15px/1.45 body |
| `--type-body-strong` | 600 15px/1.45 body |
| `--type-label` | 600 13px/1.22 body |
| `--type-caption` | 400 12px/1.45 body |
| `--type-overline` | 700 11px/1 body, `+0.08em`, uppercase |
| `--type-metric` | 700 38px/1 display, tabular |
| `--type-money` | 600 15px/1.22 mono, tabular |

Two helper classes ship in `tokens/base.css`: `.cw-money` (mono + tabular-nums) and
`.cw-overline` (11px bold caps, `--text-muted`).

**Rules:** body copy never below 15px. Sentence case everywhere except the overline. All money
uses tabular figures so columns align. Currency glyph sits outside the tabular number (`€3.90`).

### Spacing

Base 4px with deliberate 2px and 6px half-steps for dense rows.

`--space-1 2` · `2 4` · `3 6` · `4 8` · `5 12` · `6 16` · `7 20` · `8 24` · `9 32` · `10 40` ·
`11 48` · `12 64` · `13 80` · `14 96` (px).

| Token | Value | Meaning |
| --- | --- | --- |
| `--gutter-page` | `20px` | Phone side margin |
| `--gutter-page-lg` | `40px` | Desktop side margin |
| `--gap-stack` | `12px` | Between rows inside a card |
| `--gap-cards` | `16px` | Between cards in a feed |
| `--gap-section` | `32px` | Between page sections |
| `--pad-card` | `20px` | Card padding |
| `--pad-card-tight` | `14px` | Row-list card padding |
| `--pad-control-x` / `-y` | `16px` / `11px` | Control padding |
| `--width-content` | `1160px` | Max content width |
| `--width-prose` | `64ch` | Max prose measure |
| `--width-app-phone` | `390px` | Phone canvas |
| `--width-sidebar` | `248px` | Desktop sidebar |
| `--width-sidebar-collapsed` | `64px` | Icon rail |
| `--height-control` | `44px` | Default control height — **never below 44 for touch** |
| `--height-control-sm` | `36px` | Compact control |
| `--height-topbar` | `60px` | Sticky topbar |

### Shape

**Radii** — nothing sharp anywhere.

`--radius-xs 6` · `sm 10` · `md 12` · `lg 16` · `xl 20` · `2xl 26` · `3xl 32` · `pill 999`
Semantic: `--radius-control 12` · `--radius-card 18` · `--radius-tile 20` · `--radius-sheet 28` ·
`--radius-bubble 20`.

Chat bubbles break **one** corner to `8px` on the speaker's side — the only asymmetric shape in
the system.

**Borders** — `--border-width 1px`, `--border-width-thick 2px`. Checkboxes use 1.5px; the active
underline tab uses 2.5px.

**Shadows** — warm green-black, never blue-black. All use `rgba(27,26,22,…)`.

| Token | Value |
| --- | --- |
| `--shadow-xs` | `0 1px 2px rgba(27,26,22,.05)` |
| `--shadow-sm` | `0 1px 2px rgba(27,26,22,.05), 0 2px 6px rgba(27,26,22,.04)` |
| `--shadow-md` | `0 2px 4px rgba(27,26,22,.04), 0 8px 20px -6px rgba(27,26,22,.10)` |
| `--shadow-lg` | `0 4px 8px rgba(27,26,22,.05), 0 20px 40px -12px rgba(27,26,22,.16)` |
| `--shadow-pop` | `0 8px 16px rgba(27,26,22,.06), 0 32px 64px -20px rgba(18,52,32,.24)` |
| `--shadow-inset` | `inset 0 1px 2px rgba(27,26,22,.06)` |
| `--shadow-brand` | `0 8px 24px -10px rgba(27,74,44,.5)` |
| `--ring-focus` | `0 0 0 3px rgba(67,149,90,.32)` |
| `--ring-danger` | `0 0 0 3px rgba(222,81,69,.28)` |

Usage: `xs` on tiles, `sm` on cards (the default), `md` on hover and the floating composer, `lg`
on toasts, `pop` on dialogs only, `brand` under green buttons and green cards.

### Motion

| Token | Value |
| --- | --- |
| `--dur-instant` | `90ms` |
| `--dur-fast` | `140ms` — control feedback |
| `--dur-base` | `200ms` — surfaces |
| `--dur-slow` | `320ms` — a bar filling |
| `--dur-slower` | `480ms` |
| `--ease-out-soft` | `cubic-bezier(.2,.8,.25,1)` — the default for everything |
| `--ease-in-out-soft` | `cubic-bezier(.5,0,.3,1)` |
| `--ease-nudge` | `cubic-bezier(.34,1.4,.64,1)` — the **only** springy curve |
| `--press-scale` | `0.975` |
| `--lift-hover` | `-1px` |

`--ease-nudge` is used in exactly four places: the checkbox tick, the switch knob, a dialog
arriving, a toast sliding up. Nowhere else.

All durations collapse to `0ms` and `--press-scale`/`--lift-hover` neutralise under
`prefers-reduced-motion: reduce` — already in `tokens/motion.css`; preserve it.

### Global interaction rules

The fastest way to make a port feel right:

- **Hover:** surfaces lift `translateY(-1px)` and step `--shadow-sm` → `--shadow-md`. Primary
  buttons lighten (green-800 → green-700). Secondary take a cream fill + stronger border. Ghost
  take a green-50 wash. List rows take a cream-100 wash. **Nothing changes opacity on hover** —
  opacity is reserved for disabled.
- **Press:** `scale(0.975)` *plus* a darker colour step (green-800 → green-900). Both, always.
- **Focus:** `--ring-focus` soft green halo, `outline: none`, never removed. Danger fields use
  `--ring-danger`.
- **Disabled:** `opacity: .42`, `cursor: not-allowed`, shadow removed.
- **Transparency and blur:** exactly two places — the sticky topbar (`--surface-glass` +
  `blur(8px)`) and the dialog scrim (`--surface-overlay` + `blur(3px)`). Never on cards, never
  behind text, never for depth games.

---

## Components

24 components in 7 groups at `components/<group>/<Name>.jsx`, each with a sibling `<Name>.d.ts`
(**the props contract — read these, they are the API spec**) and `<Name>.prompt.md` (what & when,
plus a usage example).

| Group | Components |
| --- | --- |
| `brand/` | `Logo` |
| `core/` | `Button`, `IconButton`, `Icon`, `Badge`, `Card`, `Avatar` |
| `forms/` | `Input`, `MoneyInput`, `Select`, `Checkbox`, `Switch` |
| `data/` | `StatTile`, `ProgressMeter`, `DataRow` |
| `navigation/` | `Tabs`, `SidebarNav` |
| `feedback/` | `Dialog`, `Toast`, `Tooltip`, `EmptyState` |
| `agent/` | `ChatBubble`, `SuggestionChip`, `Composer` |

Key specs where the values are non-obvious:

**Button** — heights sm `36` / md `44` (default) / lg `52`. Padding x: 14 / 18 / 24. Radius 12
(or pill). Font: body 700 15px (sm 13, lg 17), `-0.01em`, 8px icon gap. Variants: `primary`
(green-800 bg, cream text, `--shadow-brand`), `accent` (gold-500 bg, gold-800 text,
`--shadow-sm`), `secondary` (white bg, sand border, `--shadow-xs`), `ghost` (transparent,
green-700 text), `danger` (tomato-600 bg, white text).

**Card** — white, radius `18`, `1px solid #EFE8DA`, `--shadow-sm`, padding `20` (tight `14`).
Variants: `sunken` (cream-100, no shadow — nests inside another card), `brand` (green-800,
`--shadow-brand`, **exactly one hero per screen**), `accent` (gold-100 bg, `#F0E3BE` border, no
shadow — the "Costwise spotted this" treatment), `flat`. Optional `eyebrow` (overline) + `title`
(`--type-heading`) + `action` slot header, 14px bottom margin.
**Never a coloured left border only. Never a card three levels deep.**

**Badge** — height 24 (lg 28), padding x 10 (lg 12), pill radius, body 700 12px. Optional 6px
`currentColor` dot at 0.8 opacity.

**StatTile** — radius `20`, padding `14px 16px`, `--shadow-xs`. Overline label → 30px display
value (lg 38) with tabular figures → footer with a coloured delta (`good` green-600 / `over`
tomato-600 / `flat` muted) and plain-language caption. **`deltaTone` is judged from the owner's
point of view — costs going down is `good`.** Max 3 across on a phone, 4 on desktop.

**ProgressMeter** — 10px track (thick 14px), pill radius, `--viz-track` background, fill
transitions `width` over `--dur-slow`. Optional `target` notch: 2px ink-800 bar at 55% opacity,
overhanging 3px top and bottom. Optional `segments[]` for a stacked breakdown using `--viz-1…6`.

**DataRow** — 40px leading thumb (radius 12, green-50 plate), title 600 15px ellipsised,
subtitle 12px muted, right-aligned mono amount with an optional 12px note beneath, trailing slot.
Divider variant: `12px 4px` padding, `--border-subtle` bottom, none on last child. Card variant:
`14px 16px`, own border/radius/shadow.

**Tabs** — pill variant: 4px padding cream-100 track, 36px tabs, active tab white with
`--shadow-sm`. Underline variant: 42px tall, 22px gap, 2.5px green-700 indicator, 1px subtle rule.

**SidebarNav** — 42px min-height items, radius 12, gap 11px, 600 15px. Active = green-50
background + green-800 text (a pill, **not** a bar). Collapsed = 64px icon rail. Inverse variant
for deep-green sidebars uses cream at 78% / 10% / 14% alphas.

**ChatBubble** — agent left (white card, `--border-subtle`, `--shadow-xs`, bottom-left corner
8px), owner right (green-800, cream text, `--shadow-brand`, bottom-right corner 8px), `note`
tone gold-100 + `#F0E3BE`. Body max-width `min(560px, 86%)`. Padding `12px 15px`. Typing state is
three 6px green-400 dots on a 1.1s stagger (0 / .14s / .28s). Attach a Card, ProgressMeter or
DataRow via the `attachment` slot rather than nesting it in the text.

**Composer** — pill radius, `8px 10px 8px 12px` padding, `--shadow-md` resting → `--shadow-lg` on
focus-within, 38px round green send button that disables when empty, 30px round green-50 leading
slot for the sparkle. Placeholder is always an invitation in the owner's words, never
"Type a message".

**Dialog** — radius `28`, padding 24, max-width 440 (wide 640), `--shadow-pop`, scrim
`rgba(27,26,22,.42)` + `blur(3px)`. Enters with fade + `translateY(10px) scale(.98)` over
`--dur-base` on `--ease-nudge`. Footer right-aligned, confirm last.

**Toast** — ink-900 (or green-800 / gold-100 / tomato) at radius 16, `--shadow-lg`, max-width
440, bottom-centre 26px up, ~3.6s lifetime, slides up 12px on `--ease-nudge`.

---

## Screens (UI kit)

Live prototype: **`ui_kits/costwise-app/index.html`** — opens in a browser and runs standalone.
Its own notes are in `ui_kits/costwise-app/README.md`.

Desktop web app. Page background `--surface-page`; content column capped at 1000px (invoices
1060px) with 26px horizontal and top padding.

### 1. Login — `LoginScreen.jsx`

- **Purpose:** sign in. Any submit signs you in (prototype).
- **Layout:** full-height grid, `1.05fr 1fr`.
  - **Left:** vertically centred, horizontal padding `clamp(32px, 7vw, 96px)`, 22px gap. Logo
    (26px mark + wordmark) → `h1` at `--type-display` sized down to 38px → 15px muted intro
    (max 42ch, 10px top margin) → form (max-width 380, 14px gap).
  - **Right:** `--surface-brand-soft` panel, 1px subtle left border, centred column, 18px gap:
    brand illustration at `min(78%, 440px)` wide, then a centred `--type-subheading` line in
    green-800, max 26ch.
- **Form:** `Input` email (mail icon) → `Input` password (lock icon) → `Button size="lg" block`
  "Come on in" with trailing arrow → "or" divider (1px subtle rules either side, 12px faint text,
  10px gaps) → `Button variant="secondary" size="lg" block` "Send me a code instead" → centred
  12px caption with a "Set up your place" link.
- **Copy:** headline *"Let's see where your money goes."* Intro: *"Costwise keeps an eye on what
  your dishes cost, so you can spend your evening in the kitchen instead of the spreadsheet."*
  Panel line: *"Food, money and a calculator walk into a kitchen."*

### 2. App shell — `AppShell.jsx`

Wraps screens 3–6.

- **Sidebar:** 248px fixed, `--cream-50`, 1px subtle right border, padding `18px 12px`, 6px gap.
  Logo block (26px, 6px side padding, 10px bottom) → `SidebarNav` → flex spacer → a gold
  `--surface-accent-soft` promo card (radius 18, padding 14): *"You've kept €1,840 this month"*
  (700 13px gold-800) with *"Mostly by fixing three dish prices."* (12px, 80% opacity) → a
  borderless "Sign out" row (10px 6px, `--type-label`, muted, log-out icon).
- **Nav items:** Today, Ask Costwise · group "Kitchen" · Dishes, Ingredients, Invoices (badge
  "2") · group "Your place" · Suppliers, Settings.
- **Topbar:** 60px, `--surface-glass` + `blur(8px)`, 1px subtle bottom border, 26px side padding,
  12px gap. Left: a fake search pill (36px, cream-100, pill radius, muted 13px, search icon,
  flex 1 capped at 420px). Right: camera `IconButton variant="outline"`, bell `IconButton`,
  `Avatar` "Marta Ruiz" with the online dot.
- **Toast host:** `position: fixed`, `left: 50%`, `bottom: 26px`, `translateX(-50%)`,
  `z-index: 80`; auto-dismiss at 3600ms.
- **Unbuilt destinations** (Ingredients, Suppliers, Settings) render an explicit `EmptyState`
  reading *"<Label> isn't in the kit yet"* — nothing was supplied for them, so nothing was
  invented. **Replace with real designs; do not ship the placeholder.**

### 3. Today — `TodayScreen.jsx`

Home view. Sections separated by `--gap-section 32`.

- **Header row:** `h1` `--type-title` *"Morning, Marta."*, 15px muted subline *"Two things worth
  a look before service, and one bit of good news."*, right-aligned pill `Tabs` (This week /
  Month).
- **Stat row:** 4-column grid, 16px gap — Food cost `31.4%` (↓ 2.1 pts, good, "target 30%");
  Plate cost avg `€4.18` (↑ €0.22, over, "eggs, cream"); Waste `€184` (↓ €31, good, "best month
  yet"); `variant="brand"` tile, Kept this month `€1,840`.
- **Insight row:** grid `1.35fr 1fr`, 16px gap.
  - `Card variant="accent"`, eyebrow "Costwise spotted this", title *"Eggs are up 14% at Metro"*,
    a `watch` badge, body copy, then two small buttons: "Look at the carbonara" (→ Dishes) and
    "Remind me Monday" (fires a toast).
  - `Card` "Where the money went": thick segmented `ProgressMeter` (42 / 24 / 19 / 15) above a
    four-row legend — 9px rounded colour chip, label, mono amount (Produce €1,240 · Dairy & eggs
    €712 · Meat & fish €560 · Dry goods €442).
- **List row:** two equal `Card padding="tight"` — "Costs that moved" (3 `DataRow` dishes, each
  navigating to the dish screen) and "Two invoices to file" (2 `DataRow` invoices plus a
  "Snap a new one" `SuggestionChip`).
- **Sticky composer:** `position: sticky; bottom: 0`, 22px top padding, over
  `linear-gradient(to top, var(--surface-page) 62%, rgba(253,251,246,0))`. Three
  `SuggestionChip`s above the `Composer`.

### 4. Ask Costwise — `AskScreen.jsx`

- **Layout:** full-height flex column. Scrolling thread (`26px 26px 8px`, inner column max 760px,
  16px gap) above a non-scrolling composer dock (`12px 26px 22px`) over the same gradient.
- **Thread header:** `Avatar agent size="lg"` + "Costwise" (`--type-heading`) + caption
  *"Knows your last 14 weeks of invoices · Casa Ruiz"*.
- **Seeded turns:** agent (with a `ProgressMeter` + three badges attached) → owner → agent in
  `tone="note"` (with a two-row `DataRow` comparison attached and the buttons that open the
  confirm dialog).
- **Behaviour:** tapping a chip or sending text appends the owner's turn, shows
  `<ChatBubble typing>` for **1200ms**, then appends a canned agent reply with a `DataRow`
  attachment.
- **Dialog:** *"Raise the carbonara to €15.50?"* / *"That keeps you at a 68% margin even if eggs
  stay where they are. I'll let you know if they come back down."* / "Not yet" + "Update the
  menu" → fires a `good` toast with an Undo action.

### 5. Dish costing — `DishScreen.jsx`

- **Header:** back `IconButton variant="outline"` → overline "Dish" + `h1` "Carbonara" →
  `Badge tone="watch" size="lg"` "Cost up 40c this week" → "Edit recipe" secondary button.
- **Stat row:** Plate cost €3.90 (↑ €0.40, over); Menu price (live, bound to the `MoneyInput`);
  Food cost 26% (↑ 2.6 pts, over, "target 25%"); brand tile "You keep €11.10 / plate".
- **Body:** grid `1.4fr 1fr`.
  - Left `Card padding="tight"` with underline `Tabs` (Ingredients / History / Notes).
    *Ingredients:* 5 `DataRow`s (Guanciale 60g €1.44 · Free-range eggs 2 yolks €0.72 with a
    `+14%` over badge · Pecorino 30g €0.81 · Spaghetti 110g €0.28 · Cupboard €0.65), then an
    "Add ingredient" ghost button and a right-aligned "Plate cost €3.90" total.
    *History:* four `ProgressMeter`s, weeks 30–33 (€3.42 → €3.90); tone flips to `watch` above 62.
    *Notes:* a single muted empty line.
  - Right column: an `accent` card — *"€15.50 keeps your margin"* with a large `MoneyInput`
    (two-way bound to the Menu price tile) and "Use €15.50" / "Keep €15.00"; then a card
    explaining plate cost with a `Tooltip` help icon, a thick segmented meter
    (37 / 21 / 18 / 7 / 17) and two filter chips.

### 6. Invoices — `InvoicesScreen.jsx`

- **Header:** `h1` "Invoices" + subline *"Snap them, I'll read them and tell you what moved."*,
  a `Tabs` (Needs you · count 2 / Everything), and a primary "Snap an invoice" button.
- **Stat row:** Spent this month €4,120 (↑ €260, over, "vs July"); Prices that moved 7 items
  ("5 up · 2 down"); Invoices waiting 2.
- **Body:** grid `1fr 1.15fr`. Left is the invoice list (`DataRow` per invoice with a status
  badge; selecting one drives the right pane; an `EmptyState` when the filter empties). Right is
  the read invoice: badge row, four line-item `DataRow`s showing what changed (eggs +14%, cream
  +8%, carrots −11%, "11 other items — no change"), a 16px-padded top rule, a `Checkbox`
  "Update my dish costs with these prices" (checked, with description), then "File it" /
  "Something looks wrong".

---

## Interactions & behaviour

| Trigger | Result |
| --- | --- |
| Login submit | Swaps root state to the app shell |
| Sidebar item | Switches the routed view; item takes the green-50 active pill |
| Suggestion chip / composer send | Owner turn → 1200ms typing bubble → canned agent reply with an attached card |
| "Update the menu price" | Opens the confirm dialog; confirming fires a `good` toast with Undo |
| "Use €15.50" | Writes the price into local state (Menu price tile updates live) and toasts |
| Invoice row | Loads that invoice into the detail pane |
| "File it" / camera button | Fires a toast |
| Toast | Auto-dismisses at 3600ms |

**Animations:** all covered by the motion tokens. Bars animate `width` over `--dur-slow` on
`--ease-out-soft`. The typing indicator loops a 1.1s three-dot bounce (`translateY(-4px)`,
opacity .45 → 1) on `--ease-in-out-soft`.

**Loading states:** the only one designed is the assistant's typing bubble. Skeletons were not
designed — if you need them, use `--surface-sunken` blocks at the target radius, no shimmer.

**Error states:** field-level only — `Input` takes an `error` string that replaces the hint,
turns the border `--over` and the ring `--ring-danger`. No global error page was designed.

**Validation:** none specified. The prototype's forms accept anything.

**Responsive:** the kit is desktop-only. The token set carries phone values (`--gutter-page 20`,
`--width-app-phone 390`, `--height-control 44`) but **no phone layouts were designed** — do not
infer them from the desktop screens. If the real user is behind a counter on a phone, that is a
design task, not a port task.

## State management

Deliberately minimal, all local React state — replace with your app's real store and router.

| Owner | State | Notes |
| --- | --- | --- |
| Root (`index.html`) | `signedIn: boolean` | Login vs shell |
| `AppShell` | `view: string` | Stands in for routing |
| `AppShell` | `toast: object \| null` | Global toast slot, 3600ms timer |
| `TodayScreen` | `q: string`, `range: 'week' \| 'month'` | Composer draft, date range |
| `AskScreen` | `turns: []`, `thinking: bool`, `confirm: bool`, `q: string` | Thread, typing, dialog |
| `DishScreen` | `tab: string`, `price: string` | Tab, live menu price |
| `InvoicesScreen` | `tab: string`, `open: invoice` | Filter, selected invoice |

**Data fetching:** none. All content is hard-coded fixtures. Real integrations implied by the
design: ingredient prices per supplier over time, dish recipes with quantities, OCR'd supplier
invoices with per-line price deltas, and an LLM-backed assistant that can attach a component
(meter, comparison rows) to its answer. The `attachment` prop on `ChatBubble` is the seam for
that last one — plan for the assistant to return a structured payload, not just prose.

---

## Assets

In `assets/`:

| File | What | Provenance |
| --- | --- | --- |
| `logo-mark.png` | 180×180 app icon — coins stacked into a broccoli | **Supplied by the client.** The entire colour system is sampled from it. |
| `logo-mark-transparent.png` | Same file, white background knocked out programmatically | Derived. No redrawing. |
| `brand-illustration-cast.png` | 3D render — a smiling banknote among a carrot, courgette, broccoli, aubergine, steak, garlic, coin and calculator | **Supplied by the client.** Sets illustration style, accent hues and tone. |
| `brand-illustration-cast-transparent.png` | Same, background knocked out | Derived. |

**Illustration style:** chunky 3D characters, soft studio light, no outlines, no grain, cast
shadow under the object only. Food and money share the frame as equals — that is the brand idea.
One scene per screen, on cream or green-50, never over photography.

### Three substitutions — please resolve before shipping

1. **Fonts.** No binaries were supplied. Bricolage Grotesque, Nunito Sans, Baloo 2 and IBM Plex
   Mono load from Google Fonts in `tokens/fonts.css`. The rounded bubble logotype in the client's
   illustration is **not** any of these — Baloo 2 is the nearest free stand-in. If real licensed
   faces exist, swap them in and re-check the type scale.
2. **Icons.** No icon set was supplied. The system uses **Lucide 0.454.0 at `stroke-width: 1.75`,
   `currentColor` only**, from `https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js`. Chosen
   because its rounded caps and joins match the logo's soft character better than Heroicons or
   Material. In your port use your framework's Lucide package (`lucide-react` etc.), not the UMD
   script. Sizes: 16 inline with text, 20 in buttons and rows (default), 24 in nav, 28–32 in
   empty states. **Food-specific glyphs are preferred over abstract ones** — an ingredient row
   uses `carrot` or `egg`, never a generic `box`; the most on-brand icon rule in the system.
   **No emoji. No unicode symbols as icons.** Inline `↑ ↓` in numeric deltas are the one
   exception and are treated as typography.
3. **Logo.** Only a 180px raster exists — no SVG, no horizontal lockup, no clear-space spec. The
   rules in `guidelines/brand-logo.card.html` (min mark 20px, clear space 0.5× mark height, never
   recolour or outline) are proposals, not client-supplied brand law. **An SVG would improve
   every surface here.**

Also note: eight of the client's eleven uploads were third-party product screenshots (a
"stratify.com" assistant concept, a ClickUp screen captured via Mobbin). They informed **layout
structure only** — sidebar + card feed + floating composer. No colour, type or brand was taken
from them. They sit in `references/` and are not brand material.

---

## Content & voice

The voice is the product. Getting the pixels right and the words wrong would miss the brief.

- **"You" and "I".** Costwise is a someone. *"I'll flag anything that went up."* Never "the
  system", never "users".
- **Plain words over finance words.** "What you keep" not "gross margin". "Plate cost" not
  "unit COGS". Where a term must be technical, a `Tooltip` defines it in one sentence:
  *"What you pay for the food on one plate, before staff and rent."*
- **Number → reason → option.** *"Eggs are up 14% at Metro. That's 40c a plate on the carbonara.
  Two options: hold the price for a fortnight, or go to €15.50 and stay at a 68% margin."*
- **Never alarmist.** Costs going up is normal. *"Nothing's broken — just worth knowing before
  you print the new menu."* Tone words: *worth a look*, *drifting*, *tight*, *fine*.
  Not: *critical*, *alert*, *failure*, *urgent*.
- **Short sentences. Contractions always.**
- **Human time.** "Before service", "Mondays, 8am", "tonight" — not "T-1" or "in the last 7 days".
- **Sentence case everywhere** except the 11px overline. No trailing periods on headings, labels,
  badges or one-line captions.
- **Buttons say what happens, in the owner's words:** `Come on in`, `Snap an invoice`, `File it`,
  `Use €15.50`, `Not yet`, `Leave it`, `Remind me Monday`. Never `Submit`, `Confirm`, `OK`,
  `Learn more`.
- **Empty states are invitations, not apologies:** *"Let's start with one dish — add what goes on
  the plate and I'll work out what it costs you."*
- **No emoji in product UI.**

---

## Files

```
styles.css                    Single entry point — @import lines only
tokens/                       colors, typography, spacing, shape, motion, fonts, base
components/<group>/           24 × { Name.jsx, Name.d.ts, Name.prompt.md } + one card HTML per group
guidelines/                   19 specimen cards (open any in a browser)
assets/                       Logo mark + brand illustration, each with a transparent variant
ui_kits/costwise-app/         index.html + 6 screen files + its own README
templates/app-screen/         The app shell as a reusable starting template
readme.md                     Brand guide: content fundamentals, visual foundations, iconography
HANDOFF.md                    This document
references/                   Third-party layout reference shots — NOT brand material
```

**Where to start:** open `ui_kits/costwise-app/index.html` to see the product move, then read
`readme.md` for the reasoning, then work component-by-component from the `.d.ts` files.

`guidelines/*.card.html` are standalone specimen pages — each opens in a browser and shows one
foundation (a colour ramp, a type role, the radius set, the shadow set) rendered from the real
tokens. They are the quickest way to check a port against the source.
