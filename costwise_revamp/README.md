# Handoff: Costwise app revamp on the Costwise Design System

## Overview
A full visual revamp of the CostWise web app (`st9ho3/costwise`, branch `main`) onto the Costwise
Design System, plus one behavioural change: **Today is no longer a dashboard, it's a decision queue**.
Every other screen and every piece of functionality that exists today is preserved — this is a re-skin
plus a new Today, not a feature change. The prototype is one file, `Costwise.dc.html`, which routes
between all screens with sample data. `Overview explorations.dc.html` carries the two Today directions
that were explored and the Greek type comparison that settled the font decision — read it for the
rationale, build from this document.

Source of truth for what existed before: `github.md` in this bundle (repo, branch, and a
screen → source-file map).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behaviour. They are **not production code to copy**. The task is to recreate these
designs inside the existing codebase: **Next.js 15 App Router + React 19 + TypeScript + Tailwind CSS 4
+ Zustand**, keeping the existing data layer (Drizzle/PostgreSQL, NextAuth, the repositories/services
split) exactly as it is. Only the presentation layer changes.

`Costwise.dc.html` is a streaming "Design Component" file — it uses a small custom template runtime
(`<x-dc>`, `{{ holes }}`, `<sc-for>`, `<sc-if>`, `<x-import>`). Read it for structure, values and
copy; do not port the runtime.

## Fidelity
**High-fidelity.** Final colours, type, spacing, radii, shadows, copy and interaction behaviour.
Recreate pixel-perfectly using the design system's tokens (in `design-system/` here) and its React
components. All values below are exact.

## Design system
The revamp is built on the **Costwise Design System**. `design-system/` contains the token
stylesheets that were linked by the prototype. Prefer wiring these tokens into Tailwind 4's
`@theme` block over hardcoding hex values.

Components used from the system (implement or import equivalents): `Button`, `IconButton`, `Icon`,
`Badge`, `Card`, `Avatar`, `Input`, `MoneyInput`, `Select`, `StatTile`, `ProgressMeter`, `DataRow`,
`Dialog`, `Toast`, `EmptyState`, `Logo`.

Icons: **Lucide 0.454.0, stroke-width 1.75, currentColor only.** The codebase already has
`lucide-react` — use it. Never inline hand-drawn SVG, never a PNG icon, never emoji.

### Tokens actually used

Colour
```
green-800 #1B4A2C   green-700 #24603A   green-600 #2F7A45   green-500 #43955A
green-100 #E4F3D8   green-50  #F2F9EC
gold-800  #6E4A11   gold-700  #8A5F16   gold-600 #B98A2A   gold-500 #DCB24A   gold-100 #FBF1D4
clay-700  #9E4220   clay-600  #C4552C   clay-500 #EE7B3C   clay-100 #FDEBDD
tomato-700 #9E2A20  tomato-600 #C0392B  tomato-100 #FBE6E3
berry-600 #7A4A8C   berry-500 #9A63AC   berry-100 #F1E7F5
blueberry-600 #3A6E9E  blueberry-500 #4A86C4  blueberry-100 #E6EFF8
cream-50 #FDFBF6 (page)   cream-100 #F8F4EA   cream-200 #F0EADC
sand-300 #E2DACA   sand-400 #C9BFAA
stone-500 #8C8574  stone-600 #6B6558
ink-700 #45413A    ink-800 #2C2A25    ink-900 #1B1A16
border-subtle #EFE8DA   border-default #E2DACA
accent card border #F0E3BE
glass topbar rgba(253,251,246,.78) + blur(8px)
```
Only two background colours per screen: cream page `#FDFBF6`, white cards `#FFFFFF`.

Type
```
display / titles / metrics : "Bricolage Grotesque", 700, letter-spacing -0.02em
body / labels              : "Nunito Sans", 400/600/700, 15px base, line-height 1.45
money & quantities         : "IBM Plex Mono", 600, font-variant-numeric: tabular-nums
wordmark only              : "Baloo 2", 800
sizes: 11 / 12 / 13 / 15 / 17 / 20 / 24 / 30 / 38 / 48
overline: 11px, 700, 0.08em tracking, uppercase — the ONLY uppercase in the system
```
Body copy never below 15px. Sentence case everywhere else.

**Greek.** None of the four substitute faces ship Greek glyphs — Bricolage Grotesque, Nunito Sans,
IBM Plex Mono and Baloo 2 are Latin / Latin-ext / Cyrillic / Vietnamese only (verified against the
Google Fonts charsets, not assumed). Greek copy in an unmodified build renders in system fallbacks.
The fix is a per-character fallback appended to each stack — English is byte-for-byte unchanged,
Greek falls through to a face that has the glyph:
```
--font-display: "Bricolage Grotesque","Geologica","Bricolage Grotesque Fallback",Trebuchet MS,sans-serif
--font-body:    "Nunito Sans","Fira Sans","Nunito Sans Fallback",Avenir Next,Segoe UI,sans-serif
--font-mono:    "IBM Plex Mono","Fira Mono",ui-monospace,SFMono-Regular,monospace
```
Add `Geologica:wght@400;600;700`, `Fira Sans:wght@400;500;600;700` and `Fira Mono:wght@500;600` to
the font request. Geologica was chosen for display because it is the closest Greek-capable face to
Bricolage's optical sharpness; Fira's Greek is the best-drawn of the free options and covers
greek-ext. Three requirements follow:
- Set `lang` on `<html>` per locale. Without it Chrome uppercases Greek literally and the
  `.cw-overline` treatment renders "ΈΝΑ ΠΡΆΓΜΑ" instead of "ΕΝΑ ΠΡΑΓΜΑ" — monotonic Greek drops the
  tonos on capitals. Never hand-strip accents in source strings.
- Greek locales use the comma as decimal separator: `€15,50`, `31,4%`. Format through `Intl`, not
  string concatenation.
- If Costwise licenses real faces, **a Greek cut is a hard requirement**, and the wordmark face
  (Baloo 2) needs one too or the wordmark stays Latin-only by policy.

Radius
```
6 tick boxes · 12 controls · 16–18 cards · 20 tiles · 26–28 dialogs/sheets · 999 pills
```

Shadow (warm green-black, never blue-black)
```
xs    0 1px 2px rgba(27,26,22,.05)
sm    0 1px 2px rgba(27,26,22,.05), 0 2px 6px rgba(27,26,22,.04)   ← card default
md    0 2px 4px rgba(27,26,22,.04), 0 8px 20px -6px rgba(27,26,22,.10)  ← hover
lg    0 4px 8px rgba(27,26,22,.05), 0 20px 40px -12px rgba(27,26,22,.16)  ← toast
brand 0 8px 24px -10px rgba(27,74,44,.5)  ← green buttons / green cards
focus ring: 0 0 0 3px rgba(67,149,90,.32)
```

Spacing / layout
```
4px base. Page gutter 40px desktop / 20px phone. Content max-width 1160px, centered.
Sidebar 248px expanded, 64px collapsed rail. Topbar 60px, sticky, glass.
Card padding 20px. 12px between rows in a card, 16px between cards, 32px between sections.
Table cells: 10px 18px on first/last column, 10px 14px in between. Header row 12px padding.
```

Motion
```
140ms control feedback · 200ms surfaces · 320ms bars filling
ease-out-soft cubic-bezier(.2,.8,.25,1)   ease-nudge cubic-bezier(.34,1.4,.64,1) (dialog/toast/tick only)
hover: translateY(-1px), shadow sm → md. press: scale(.975) + one step darker.
Opacity is only for disabled (0.42). Collapse everything to 0ms under prefers-reduced-motion.
```

## App shell
Replaces `src/app/(user)/layout.tsx`, `components/layout/sideBar.tsx`, `components/layout/header.tsx`.

**Sidebar** — 248px, `padding:18px 12px`, right border `1px solid #EFE8DA`, background cream
`#FDFBF6`. Expanded by default (today's app starts collapsed — that changes).
- Lockup at top: `logo-mark-transparent.png` at 26×26 + wordmark "Costwise" in Baloo 2 800 / 22px /
  `#1B4A2C`, gap 9px, `padding:0 6px 18px`.
- Nav items: `min-height:42px`, `padding:0 12px`, `radius:12px`, gap 11px, 15px/600.
  Inactive `color:#45413A` on transparent; **active `background:#F2F9EC; color:#1B4A2C`**.
  Order and destinations, unchanged from today: Today `/`, Add something (opens the create dialog),
  Dishes `/recipes`, Ingredients `/ingredients`, Suppliers `/suppliers`.
  Icons: `house`, `plus`, `utensils`, `carrot`, `truck` at 20px.
  Active also covers child routes (`/recipes/*` lights Dishes, etc).
- Gold note card above the collapse button: `background:#FBF1D4; radius:18px; padding:14px`,
  title 13px/700 `#6E4A11` "You've kept €1,840 this month", body 12px `#6E4A11` at .8 opacity
  "Mostly by fixing three dish prices." *(Placeholder content — wire to real month-to-date savings or
  drop it.)*
- Collapse control at the bottom: `panel-left-close` + "Tuck it away", 14px/600 `#8C8574`.
- Collapsed rail: 64px wide, 44×44 icon buttons, same active pill, `panel-left-open` at the bottom,
  `title` attribute as the tooltip.

**Topbar** — 60px, `padding:0 26px`, bottom border `1px solid #EFE8DA`,
`background:rgba(253,251,246,.78)` + `backdrop-filter:blur(8px)`, `z-index:30`.
- Left: search trigger pill, `max-width:460px`, `height:36px`, `padding:0 14px`, `radius:999px`,
  `background:#F8F4EA`, `color:#8C8574`, 13px, `search` icon 18px, label
  "Search dishes, ingredients, suppliers…".
- Right, in order: an IconButton (`smartphone`) that switches to the phone view — **prototype-only, do
  not ship**; a bell IconButton with a notification pip (`min-width:17px; height:17px;
  background:#C0392B; color:#fff; 10px/700; radius:999px`, offset `top:-1px; right:-1px`);
  a 1px × 26px `#EFE8DA` divider; then the account chip — right-aligned two-line stack
  (name 13px/600 `#2C2A25`, email 11px `#8C8574`) + `Avatar size="sm"`, opening the profile dialog.

## Screens

### 1. Today (`/`) — replaces `(user)/(home)/page.tsx` + `components/home/card.tsx`
**This screen is rebuilt, not re-skinned.** The four stat tiles, the insight pair and the
spend-by-category meters are gone. Today is a queue of proposals the owner approves or dismisses —
Costwise proposes, the owner decides, nothing is written without a yes. Sections stacked with 26px
gaps, `padding:26px 40px 60px`, content max-width 1160px.

The screen has **two states**, chosen by whether the account has enough data to brief on. In the
prototype it's the `firstDay` prop; in the app derive it (no costed dishes yet, or account younger
than a day).

#### 1a. Everyday — the decision queue
1. **Header row** — `display:flex; align-items:flex-end; justify-content:space-between; gap:32px`.
   Left: h1 Bricolage 700 / 38px / 1.08 / `-0.02em` "Three for you before service" (the count is the
   queue length — write it, don't hardcode), sub 17px `#8C8574` "Nothing's broken, {firstName} — one
   of them is worth money, two are housekeeping."
2. **Stat line** — replaces the four `StatTile`s. One 13px `#8C8574` row: dishes · ingredients ·
   food cost · you keep, each figure in mono 600 `#45413A` tabular, deltas in `#2F7A45` 600.
   **Wrap each figure+label+delta group in `white-space:nowrap`** so a "·" separator can never
   start a wrapped line. Same four numbers the app computes today
   (`RecipeService.getRecipesAnalytics`, `IngredientService.getIngredientAnalytics`).
3. **Cleared counter** — 220px column, right-aligned: overline "Cleared today", mono readout
   "{n} of {total} done", then an 8px track `#F0EADC` with a `#43955A` fill,
   `transition:width 200ms var(--ease-out-soft)`. Total counts what Costwise did unasked (see 5) plus
   the open proposals, so the owner starts above zero.
4. **The queue** — 12px gaps, ordered by money at stake, **at most three**. Each card:
   44px tinted glyph circle, overline, 21px Bricolage title phrased as a question, a 15px
   plain-language body that gives the number, the reason and the option, then the actions.
   - Card 1 is the money decision and takes the **accent** treatment (`background:#FBF1D4;
     border:1px solid #F0E3BE`), glyph `trending-up` on `#F5E3B4`/`#6E4A11`, overline
     "Worth money · do it first" with a right-aligned timing note. It carries a 3-up figure row
     (On the menu now / Plate cost today / You'd keep — mono 17px, the kept % in `#1B4A2C`) so the
     decision needs no second screen. Actions: primary "Use €15.50", secondary "Hold two weeks",
     ghost "Look at the carbonara" (→ the dish form).
   - Cards 2+ are white cards, shadow-sm, with the invoice total or the saving right-aligned in mono
     on the title line. Actions: one primary verb, one secondary that opens the evidence.
   - **Approved state replaces the buttons in place** — a 15px 600 `#2F7A45` line with a `check`
     glyph, the specific outcome ("Done — carbonara is €15.50 on the menu."), and an underlined
     `#8C8574` "Undo". It also fires a toast and advances the counter. Dismiss does not hide the
     card; it toasts "Left alone — I'll bring it up again Monday."
   The three in the prototype, and the data each needs:
   | Card | Proposal | Needs |
   | --- | --- | --- |
   | Reprice | "Move the carbonara to €15.50?" | ingredient price delta by supplier + the recipe's current margin |
   | Cost update | "Update four ingredient costs?" (€188.20 Zeta Dairy invoice) | parsed invoice → matched ingredients, with a diff to approve |
   | Supplier switch | "Buy tomatoes from Kritikos?" (−€0.09 a plate) | same ingredient priced across two suppliers, × usage |
5. **Done strip** — cream sunken row, 26px green check circle: what Costwise handled before the owner
   was up ("Friday's Kritikos order drafted, 11 lines, €146.00"), with a ghost "Look at the draft".
6. **Last touched** — unchanged: h2 20px + "All dishes" link, white card (`padding:6px 20px`) of four
   `DataRow`s, row click opens the dish form.

**Rules for the queue.** Three cards maximum — a fourth means the ranking is wrong, not that the
owner needs more. Every card states the number, the reason and the option, in that order. Every
primary button is the owner's words for what happens ("Use €15.50", "Update them", "Switch to
Kritikos"), never "Confirm". Nothing in the queue writes on render; approval is the only write.

#### 1b. Day one — the brief (after signup)
`max-width:860px`, 22px gaps. Costwise reports what it already worked out from whatever signup
gave it — business type, the one or two dishes entered, a snapped invoice, regional averages — so
the first screen is never empty and never a checklist.
1. **Agent line** — `<Avatar agent src="assets/logo-mark-transparent.png">` + "Costwise" 13px/700
   `#1B4A2C` + "read your invoice just now" 12px `#8C8574`. The mark is an image, never recoloured.
   (`Avatar` renders initials unless `src` is passed — `agent` alone only sets the green ground.)
2. **Headline** — 38px Bricolage "I've read your invoice, {firstName}." Sub 17px: "You're a
   trattoria, you gave me two dishes and one invoice from Metro. That's enough to start — here's
   where you stand." Then the same nowrap stat line, counting what exists: 2 dishes · 11 ingredients
   · 1 supplier · 1 invoice read.
3. **One thing to do today** — the accent card, with an effort estimate ("About a minute") where the
   timing note sits on the everyday screen. In the prototype: the two invoice lines OCR couldn't
   read. Primary "Look at the two lines" (`eye` glyph), ghost "Later today".
4. **While you were signing up** — 16px/1.55 prose paragraphs, max-width 700px, numbers inline in
   mono, each with a trailing inline link action (`font-weight:600`, 1px `#A8CDB4` underline). This
   is deliberately prose and not cards: on day one the owner is deciding whether to trust the
   numbers, and the reasoning is the content.
5. **What I'd do next** — two cream rows, 40px tinted glyph circle + title + one line of why, with a
   secondary button each ("Snap the menu" → the dish form, "Set a watch").

No composer on either state in the prototype; if the sticky ask-Costwise composer ships, it belongs
at the bottom of both.

### 2. Dishes (`/recipes`) — replaces `components/recipes/recipestable.tsx`
Header: h1 30px Bricolage "Your dishes", sub "{n} dishes, priced and costed", right-aligned primary
Button `iconLeft=plus` "Add a dish".

Table inside a white card (`radius:18px`, `overflow:hidden`, shadow-sm), `table-layout:fixed`,
header row `background:#FDFBF6`, every body row `border-top:1px solid #EFE8DA`.
Columns — widths, labels (renamed from today), and sort keys:

| Width | Label | Source field | Sortable |
| --- | --- | --- | --- |
| 32% | Dish | `title` | yes |
| 11% | VAT | `tax` (× 100, `%`) | yes |
| 15% | Menu price | `sellingPrice` | yes |
| 16% | What you keep | `profitMargin` | yes |
| 15% | Plate cost | `totalCost` | yes |
| 11% | Edit | actions | no |

- Header cells: overline type (11px/700/0.08em/uppercase `#8C8574`) as a button, with a trailing
  `↑`/`↓` in `#24603A` for the active sort. Keep today's URL-driven sorting
  (`?sort=&order=`, `SortedLink`, `searchRepository`) — only the label and the arrow change.
- Dish cell: 36px circle thumb, tinted by ingredient category (see the map below), containing an
  18px food Icon, gap 12px, then the title 15px/600 `#1B1A16`. **This replaces today's photo
  thumbnail and emoji.** If `imgPath` exists, put the photo in the same 36px circle
  (`object-fit:cover`) instead of the glyph.
- Money cells: IBM Plex Mono 600 / 14px / tabular-nums. `#1B1A16` for the menu price, `#45413A` for
  VAT and plate cost.
- "What you keep": a `Badge`. Tone from today's `getProfitMarginType` thresholds, remapped —
  `> 60 → good`, `> 50 → info`, `> 40 → watch`, `≤ 40 → over`.
- Actions: two small IconButtons right-aligned, `pencil` (17px) → `/recipes/edit/{id}`, and
  `trash-2` (17px, `#C0392B`) → delete confirm.
- Pagination unchanged: 9 per page, "Back" / numbered pages / "More" (today's Prev/Next), centered,
  18px gaps. Page chips are 30×30, `radius:10px`, 13px/600 tabular; current
  `border:1px solid #C9BFAA; background:#F8F4EA; color:#1B1A16`, others transparent with `#8C8574`.
  Hide the pager when there's one page (today's behaviour).

### 3. Ingredients (`/ingredients`) — replaces `components/ingredients/ingredientsTable.tsx`
Same table shell. Header "Your ingredients", sub "{n} things you buy, across {m} suppliers", button
"Add an ingredient".

| Width | Label | Source | Sortable |
| --- | --- | --- | --- |
| 34% | Ingredient | `name` | yes |
| 20% | What it costs | `unitPrice` + `/ {displayUnit}` | yes |
| 16% | How often | `usage` | yes |
| 19% | Kind | `categoryName` | yes |
| 11% | Edit | actions | no |

- Price cell: mono `#1B1A16` for the figure, then `" / g"` in `#8C8574` 500. Keep today's
  `formatPrice` rule (3 decimals under €1, otherwise 2) and `getDisplayUnit` (kg/g → g, L/ml → ml,
  else piece).
- "How often": `Badge`, from today's `getUsageCategory` thresholds with plain-language labels —
  `> 15 → "Most days" (good)`, `> 8 → "Weekly" (info)`, else `"Now and then" (neutral)`.
- "Kind": a tinted category chip (not a Badge) — `padding:4px 10px; radius:999px; 12px/600`, colours
  from the map below.
- Name cell click → `/ingredients/{id}`.

**Category tint map** (replaces today's Tailwind `typeStyles`; used for both the 36px thumb and the
chip — `background` / `color`):
```
Produce                       #E4F3D8 / #1B4A2C   glyph carrot
Meat & Poultry                #FBE6E3 / #9E2A20   glyph beef
Fish & Seafood                #E6EFF8 / #3A6E9E   glyph fish
Dairy & Alternatives          #FBF1D4 / #6E4A11   glyph milk, egg
Dry Goods                     #FDEBDD / #9E4220   glyph wheat
Spices & Seasonings           #FBF1D4 / #8A5F16   glyph utensils
Oils, Vinegars, & Condiments  #F1E7F5 / #7A4A8C   glyph droplets
Frozen                        #E6EFF8 / #4A86C4
Coffee & Tea                  #FDEBDD / #9E4220   glyph coffee
Beverages (Other)             #E6EFF8 / #3A6E9E
Bakery                        #FDEBDD / #C4552C   glyph croissant, cookie
Other                         #F0EADC / #6B6558   glyph utensils
```
Pick the glyph from the ingredient's category — food-specific over abstract. This replaces
`utils/uiHelpers.ts` (`createIngredientIcon` emoji + `getIconColor`); delete both.

### 4. Suppliers (`/suppliers`) — replaces `components/suppliers/suppliersTable.tsx`
Header "Who you buy from", sub "{n} suppliers on your list", button "Add a supplier".

| Width | Label | Source |
| --- | --- | --- |
| 28% | Supplier (sortable) | `name` |
| 22% | Who you talk to | `contactPerson` |
| 24% | Email | `email` |
| 15% | Delivery | `deliveryTime` |
| 11% | Edit | actions |

- Thumb: 36px circle `#E4F3D8` / `#1B4A2C` with the `store` glyph (replaces
  `/images/supplierIcon.png`).
- Contact 14px `#45413A`; email 14px `#8C8574`, `text-overflow:ellipsis; white-space:nowrap`.
- Delivery `Badge` tones: `Same day → good`, `1-2 days → good`, `2-3 days → info`,
  `Up to 5 days → watch`, `Weekly → over`. Keys are sentence case, matching `DELIVERY_OPTIONS`
  in §7 — the tone map and the form's select read the same list.
- Name click → the supplier edit form (today it goes to `/suppliers/{id}`, which renders nothing).

### 5. Dish form (`/recipes/create`, `/recipes/edit/{id}`) — replaces `recipeForm.tsx` + `formComponents/*`
Back IconButton (`arrow-left`, `variant="outline"`) + h1 "A new dish" / "Change this dish", sub
"Add what goes on the plate and I'll work out what it costs you."

Two columns, `grid-template-columns:1.5fr 1fr; gap:16px; align-items:start`.

**Left, three white cards (16px gaps):**
1. Title `Input size="lg"`, label "What's the dish called?", placeholder "Spaghetti carbonara".
   Then the photo dropzone: `border:1px dashed #C9BFAA; radius:16px; padding:16px;
   background:#FDFBF6`, `camera` glyph 22px `#8C8574`, "Add a photo of the plate" 15px/600 +
   "Handy on the menu later — skip it if you're in a rush" 13px `#8C8574`. Keep today's
   `useFileUpload` / `/api/upload` / Vercel Blob wiring.
2. Overline "What goes on the plate", then a
   `grid-template-columns:1.6fr .9fr auto auto; gap:10px; align-items:flex-end` row:
   ingredient `Select` ("Ingredient"), unit `Select` ("Measured in" — grams/kilos/millilitres/litres/
   pieces), a quantity stepper, and a primary "Add it" button (44px tall).
   **Stepper** (replaces `shared/incremental.tsx`): 44px tall, `border:1px solid #E2DACA;
   radius:12px`, 28px circular −/+ buttons `background:#F0EADC; color:#6B6558` with `minus`/`plus`
   at 16/18px, and a 56px borderless mono 16px tabular input between them. Clamp at 0.
3. Overline "What you charge". Two mutually exclusive selectable rows —
   `display:flex; gap:12px; padding:12px 14px; radius:16px`; selected
   `border:1px solid #43955A; background:#F2F9EC`, unselected `border:1px solid #EFE8DA;
   background:#fff`. Each has an 18px radio dot (selected `border:5px solid #2F7A45; background:#fff`,
   unselected `border:1.5px solid #C9BFAA`), a 15px/600 label, and a 150px field on the right.
   - "I set the menu price" → `MoneyInput`, placeholder 15.50
   - "I set what I keep" → `Input suffix="%"`, placeholder 68
   The non-selected row's field is disabled and its value cleared — same rule as today's
   `usePricing`.
   Below: a cream sunken row (`border:1px solid #EFE8DA; radius:16px; background:#FDFBF6;
   padding:14px`) with the VAT `Select` ("VAT on top" — **No VAT / 13% / 24%**, values 0 / 0.13 /
   0.24; the Greek "ΦΠΑ" label is gone) and an accent (gold) "Work it out" button.
   Submit is bottom-right: `Button size="lg"`, "Save the dish" / "Save the changes".

**Right, one sticky white card** (`position:sticky; top:0`) — overline "On the plate", then the line
list: 30px tinted circle + name (14px/600) + quantity ("120 g", 12px `#8C8574`) + mono line total +
a small `trash-2` IconButton. Divider `1px solid #EFE8DA` under each line.
Empty state: `EmptyState compact` with a 30px `salad` glyph `#C9BFAA`, "Nothing on the plate yet",
"Pick an ingredient on the left and I'll start adding it up."
Totals block below (`border-top:1px solid #EFE8DA; padding-top:14px`, 10px gaps), label 14px
`#45413A` left, mono 15px value right — replaces `total.tsx` / `statItem.tsx`:
"What it costs you", "Menu price", "What you keep" (value in `#24603A`), "Food cost", "Things on it".

**Maths — unchanged from `utils/pricing.ts`:**
```
lineTotal   = unitPrice × qty × (unit is kg or L ? 1000 : 1)
cogs        = Σ lineTotal
foodCost %  = cogs / sellingPrice × 100
margin %    = (price − price×tax − cogs) / price × 100
price       = cogs / (1 − tax − margin/100)      [only when the denominator > 0]
```
"Work it out" fills whichever field the owner didn't choose, then toasts the result. When
`1 − tax − margin/100 ≤ 0`: `watch` toast "That one is tight — VAT and margin add up past 100%, try a
smaller margin." With neither number: `watch` toast "One number short — give me a price or a margin
first."

### 6. Ingredient form (`/ingredients/create`, `/ingredients/edit/{id}`) — replaces `ingredientForm.tsx`
`max-width:760px`. Back button + h1 "A new ingredient" / "Change this ingredient", sub "Tell me what
you paid and how much you got — I'll work out the rest."

One white card, 16px gaps, hairline `#EFE8DA` dividers between groups:
- Row 1 `1.4fr 1fr`: "What is it?" `Input` (placeholder "Pecorino romano") · "What kind?" `Select`
  (the 12 categories).
- Row 2 `1.2fr auto .8fr 1fr`, `align-items:flex-end`: "Who from?" `Select` (suppliers) ·
  "How much you got" stepper · "In what" `Select` (kilos/grams/litres/millilitres/pieces) ·
  "What you paid" `MoneyInput` (placeholder 12.40).
- Live summary: `background:#F2F9EC; radius:16px; padding:16px`, `sparkles` 20px `#2F7A45`, body 15px
  `#1B4A2C` — "€12.40 for 1 kg works out at €0.012 a gram." Before there's enough input:
  "Fill in what you paid and how much you got — I'll tell you the price per gram."
  Uses today's `normalizePrice`: divide by `qty × 1000` for kg/L, by `qty` otherwise.
- Footer right: secondary "Not yet" + primary "Add the ingredient" / "Save the changes".

Today's multi-supplier `useFieldArray` rows and the supplier-picker modal are collapsed to one
supplier `Select`. **If multi-supplier pricing must stay, add rows back as repeated card sections
with a ghost "Another supplier" button** — don't reinstate the modal.

### 7. Supplier form (`/suppliers/create`, `/suppliers/edit/{id}`) — replaces `suppliersForm.tsx`
`max-width:900px`. Back + h1 "A new supplier" / "Change this supplier", sub "Just the bits you'd need
to place an order." One white card, four overline-titled groups separated by hairlines, 18px gaps.
**All labels and options move from Greek to English.**

- Who they are — `1fr 1fr`: "Business name" (`name`, placeholder "Kritikos Produce") ·
  "Who you talk to" (`contactPerson`, "Nikos Vlachos").
- How to reach them — `1.2fr 1fr 1fr`: "Email" · "Phone" ("695 533 1016") · "Website" ("kritikos.gr").
- Delivery and money — `1fr 1fr 1fr`: "How fast they deliver" `Select` ·
  "When you pay" `Select` · "VAT number" (was ΑΦΜ, placeholder "EL123456789").
  **Both option lists are canonical and shared with the suppliers table** — define them once
  (`DELIVERY_OPTIONS`, `PAYMENT_OPTIONS`) and read them in the form, the table badge tone map,
  and the Zod enum. Stored values are the option strings themselves:
  ```
  delivery: Same day · 1-2 days · 2-3 days · Up to 5 days · Weekly
  payment:  On delivery · 15 days · 30 days · 60 days · Paid up front
  ```
  Today's `paymentTermsOptions` ships finance jargon (`Net 30`, `COD`, `Due on Receipt`,
  `Prepaid`) that never appeared in the form's own list, so editing a supplier silently rewrote
  its terms to whatever option happened to be first. **Migrate the column**: `Net 30 → 30 days`,
  `Net 60 → 60 days`, `COD → On delivery`, `Due on Receipt → On delivery`,
  `Prepaid → Paid up front`. Both selects lead with a `{value: "", label: "Pick one"}` option so a
  blank create form doesn't display a value it hasn't stored.
- Where they are — `1.6fr 1fr .7fr`: "Street" ("Solomou 49") · "Town" ("Athens") · "Postcode" ("11851").
- "What they bring you" — a wrapping row of 8px-gapped toggle chips, one per category
  (`padding:7px 14px; radius:999px; 13px/600`). Selected takes the category tint plus a 1px border in
  the category's text colour; unselected is `border:1px solid #E2DACA; background:#fff;
  color:#8C8574`. **This replaces today's `MultipleSelect` + `ItemsStore` modal** — inline chips, no
  dialog.
- Footer right: secondary "Not yet" + primary "Add the supplier" / "Save the changes".

**Validation.** Only two fields are required — business name and email; everything else can wait.
On submit, block navigation and render the message through `Input`'s `error` prop (which replaces
the hint and turns the field tomato); clear a field's error as soon as it's edited, and clear the
whole set on entering the form. Messages, verbatim:
```
name    (empty)   I need a name to file their invoices under.
email   (empty)   Add an email so you can order straight from here.
email   (malformed) That address looks off — check the @ and what follows it.
```
Shape check: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`. Nothing is toasted on failure — the toast
("Filed — {name} is on your list.") only fires on a clean save, and it uses the real name, never a
"The supplier" fallback. The email field carries the standing hint "Where you send orders".

**Category chips.** When nothing is picked, a 13px `#8C8574` line sits under the chip row:
"Pick what they bring you — it helps me match their invoices." It disappears on the first pick — it's
a nudge, not an error; categories stay optional. Suppliers carry a `cats` array in the data model,
so the edit form loads their existing categories rather than starting from a default.

**Form state hygiene.** Entering the form — create *or* edit — replaces the whole supplier draft from
a single blank template instead of patching over the previous draft. In the prototype, patching was
what broke it: the create reset omitted `cats`, the chip row read `cats.indexOf` on `undefined`,
and "Add a supplier" took the screen down. In react-hook-form terms: `reset(defaultValues)` on
mount and on id change, never a partial `setValue` pass.

### 8. Ingredient detail (`/ingredients/{id}`) — replaces `ingredientPage/*`
`max-width:900px`. Header row: back button, h1 = ingredient name, sub "You buy it from {supplier}.",
and on the right a secondary "Change it" + danger "Delete".

Body `grid-template-columns:300px 1fr; gap:16px; align-items:start`:
- Left white card, `padding:24px`, centered: a 96px circle in the category tint with the food glyph at
  44px in the category's text colour, then the name in 20px Bricolage and the category chip.
- Right: three `StatTile`s (`repeat(3,1fr)`) — "What it costs you" (`unitPrice`, unit "/ g"),
  "You buy it in" (`unit`), "How often you use it" (the usage band label). Then a white card
  (`padding:6px 20px`) of `DataRow`s: "Who you buy it from" → supplier · "Measured in" → unit ·
  "How often you use it" → usage `Badge` in the `end` slot · "Price last changed" → relative time.
  The last row needs a timestamp the schema doesn't expose yet — add one or drop the row.

### 9. Sign in / Sign up (`/signin`, `/signup`) — replaces `components/auth/*`
Full-height two-panel split, no app chrome.
- Left (flex 1), centered, `max-width:404px`: the 30px lockup, then h1 30px Bricolage —
  "Good to see you" / "Let's get you set up" — sub 15px `#8C8574` ("Sign in and I'll pick up where we
  left off." / "One account, and I'll start keeping track of what your food costs."). Then a white
  card (`radius:18px`, shadow-sm, `padding:20px`, 14px gaps): Email `Input`
  (placeholder "you@yourplace.gr"), Password `Input`, and on sign-up a "Password again" field with the
  hint "Just so a typo doesn't lock you out". Sign-in shows a right-aligned "Forgotten it?" link.
  Primary block button — **"Come on in"** / **"Set me up"**. Then an "or" rule (1px `#EFE8DA` lines,
  11px overline) and a secondary block "Continue with Google" (`chrome` glyph 18px — swap for the real
  Google mark). Footer: "New here? Make an account" / "Already with us? Sign in".
- Right (`flex:0 0 46%`): `background:#F2F9EC`, left border `1px solid #EFE8DA`, centered —
  `brand-illustration-cast-transparent.png` at `max-width:420px`, then 24px Bricolage `#1B4A2C`
  "I keep an eye on what your food costs" and 15px `#24603A` "Add what goes on the plate and I'll work
  out what it costs you — and what you keep."

Keep NextAuth credentials + Google exactly as today.

## Overlays

**Search** (replaces `shared/search/*`) — a dropdown anchored under the topbar pill: `top:44px`,
full width of the pill, white, `border:1px solid #EFE8DA`, `radius:26px`, shadow-lg, `z-index:40`.
Head row (`padding:14px 18px`, bottom hairline): `search` glyph, autofocused borderless 15px input
("Type a dish or an ingredient"), and a 26px round clear button `background:#F0EADC`. Results
(`max-height:380px; overflow:auto; padding:8px 0`) group under overline headers
"Dishes · {n}" / "Ingredients · {n}", each row `padding:9px 18px` with a 36px tinted thumb, 15px/600
title, and a right-aligned mono price. Empty: 17px Bricolage "Nothing matched that" + 13px "Try a
shorter word — "carb", "egg", "oil"." Keep today's debounced `/api/search`; the prototype caps each
group at 4. Loading state: reuse today's spinner slot with the copy "Finding delicious things…".
Dismiss on click-outside and Escape.

**Create sheet** (replaces `shared/optionsModal.tsx`) — `Dialog` titled "What are we adding?", sub
"Pick one and I'll open a blank form." Three option buttons, `padding:14px`,
`border:1px solid #EFE8DA; radius:16px`, gap 14px, each with a 44px tinted circle + 22px glyph, a
16px/700 label and a 13px `#8C8574` description:
- A dish — `#FDEBDD`/`#9E4220`, `utensils` — "What goes on the plate, and what you charge"
- An ingredient — `#E4F3D8`/`#1B4A2C`, `carrot` — "Something you buy, and what it costs"
- A supplier — `#E6EFF8`/`#3A6E9E`, `truck` — "Who you order from and when they deliver"

**Delete confirm** (replaces `shared/deleteConfirmationModal.tsx`) — `Dialog` with a
`triangle-alert` icon (22px `#C0392B`), title "Delete this {dish|ingredient|supplier}?", body "It'll
go for good — costs and history with it. Nothing else on your list changes.", footer right-aligned:
secondary **"Leave it"** then danger **"Delete it"**. On confirm, toast "Gone — that {noun} is off
your list."

**Profile** (replaces `shared/profileModal.tsx`) — `Dialog`, centered `Avatar size="xl"`, name in
20px Bricolage, email in a `#F8F4EA` pill (12px `#6B6558`), then a hairline and two pill rows
(`padding:11px 12px; radius:999px; 15px/600`): "Your details" `#45413A` with `circle-user-round`, and
"Sign out" `#9E2A20` with `log-out`.

**Toast** (replaces `shared/notification.tsx`) — `Toast` fixed **bottom-centre, 26px up**,
`z-index:120`, auto-dismiss at **3600ms**, tones `good` / `watch` / `over`. Today's top-right
success/failure/info variants map to good / over / watch. Copy is always specific:
"Filed — Spaghetti carbonara is on your list.", "Worked out — at €15.50 you keep 68.0%.",
"On the plate — Eggs, free range added."

## Phone view (replaces `components/layout/tabBar.tsx` + `shared/mobileListCard.tsx`)
The prototype fakes a 390×812 frame behind a topbar toggle; in the real app this is just the
sub-`md` breakpoint. Ship the breakpoint, not the toggle.
- 52px glass topbar: small lockup left; `search` IconButton + `Avatar size="sm"` right.
- Content `padding:20px 20px 108px`.
- **Today is the same queue, not a reduced dashboard** — this is the surface that needs it most.
  14px gaps: 26px headline, the lead, the stat line (12px, 7px gaps, same nowrap rule), the cleared
  counter, then the three proposal cards full-width and the done strip. Cards keep the desktop
  anatomy at phone scale: 34px glyph circle, overline + mono figure on one row, 18px title, 14px
  body, and the **actions stacked full-width at 44px** (`Button block`) — never side by side.
  The money card keeps its 3-up figure row at 15px.
  Day one gets the same brief, tightened: agent line, 26px headline, three-fact stat line, the
  accent card with a block primary, one condensed prose paragraph instead of four, and the two
  "what I'd do next" rows without their buttons (the row itself is the tap target).
- Lists become a card feed: white card, `radius:18px`, `padding:16px`. Header row = 36px tinted thumb
  + 16px/700 title + pencil/trash IconButtons, with a bottom hairline; then label/value rows (13px/600
  `#8C8574` left, mono 14px right; the category row uses the tint chip). Fields per today's
  `mobileListCard` usage: dishes → VAT, Menu price, You keep, Plate cost; ingredients → What it costs,
  How often, Kind; suppliers → Who you talk to, Email, Delivery.
- Bottom tab bar: 82px tall, white, `filter:drop-shadow(0 -4px 10px rgba(27,26,22,.06))`, with the
  **cutout mask kept from today** —
  `mask-image:radial-gradient(circle at 50% 0px, transparent 35px, black 36px)`. Four tabs (Today,
  Dishes, [gap], Ingredients, Suppliers), 22px glyph + 10px/700 label, active `#1B4A2C`, inactive
  `#C9BFAA` (today's blue/grey is gone). FAB in the cutout: 56px circle `background:#1B4A2C`,
  `color:#FDFBF6`, `box-shadow:0 8px 24px -10px rgba(27,74,44,.5)`, 26px `plus`, offset `top:-28px`,
  opens the create sheet.

## State
Keep Zustand. The prototype's local state maps to the existing stores:
- `uiStore` — `isModalOpen` / `modalType` / `isProfileOpen` / `isMobileMenuOpen` /
  mobile-search open. Add `sidebarCollapsed` (defaulting to **expanded**, persisted).
- `notificationStore` — unchanged; toast tone + title + message, cleared after 3600ms.
- `fileStore` — unchanged.
- **New: the queue.** Proposals are server-owned, not client state — they're generated from price
  deltas, parsed invoices and supplier comparisons, and they need to survive a refresh and agree
  across the owner's phone and laptop. Model each as a row with a stable id, a kind, a payload, a
  status (`open` / `approved` / `dismissed`), and the write it would perform. Approval posts the
  write and returns the outcome sentence the "Done —" line displays; the client keeps only optimistic
  status and the Undo window. Dismissal is a status change with a re-surface date, not a delete.
- Sort and page stay in the URL (`?sort=&order=&page=`), server-rendered as today. Nothing about
  the data layer, the services, or the API routes changes.

Form state: keep `react-hook-form` + Zod. The pricing radio pair maps to today's `usePricing`
(`selectedPricingMethod`, disabled-field rules, `calculate`). The dish-line list maps to
`tempIngredients` / `handleAddIngredient` / `handleRemoveIngredient`.

## Assets
- `assets/logo-mark-transparent.png` — the Costwise mark, from the design system. Never recoloured,
  never redrawn. Also the assistant avatar via `<Avatar agent>`.
- `assets/brand-illustration-cast-transparent.png` — the 3D produce-and-banknote cast, used once per
  screen at most (auth right panel, big empty states).
- Icons: Lucide 0.454.0 via `lucide-react`, stroke-width 1.75.
- Fonts: Bricolage Grotesque, Nunito Sans, Baloo 2, IBM Plex Mono, plus Geologica / Fira Sans /
  Fira Mono for Greek (Google Fonts — see `design-system/tokens/fonts.css` and the Greek note under
  *Design system*). These replace Poppins. **All are Google-Fonts substitutes; if Costwise has
  licensed faces, swap them in — with a Greek cut.**
- **Dropped:** `/images/supplierIcon.png` (→ `store` glyph), the category emoji in
  `utils/uiHelpers.ts` (→ Lucide food glyphs). Recipe photos in `/public/images` are still used where
  `imgPath` is set — the prototype substitutes glyph circles because those files are 4–5 MB each and
  worth optimising.

## Copy changes at a glance
Sentence case everywhere; no trailing periods on headings, labels, badges or one-line captions.
```
Recipes            → Dishes                   Food Name      → Dish
Avg Food Cost      → Food cost, average        Tax            → VAT
Avg Profit Margin  → What you keep             Price          → Menu price
Price per Unit     → What it costs             Profit         → What you keep
Usage              → How often                 Cost           → Plate cost
Category           → Kind                      Contact Person → Who you talk to
Delivery Time      → Delivery                  Create New     → What are we adding?
Net 30 / COD       → 30 days / On delivery     Prepaid        → Paid up front
Avg Food Cost tile → one stat line             Worth a look   → Worth money · do it first
Recommendation     → a question + Use €15.50   Dismiss        → Hold two weeks / Leave it
Sign In            → Come on in                Create Account → Set me up
Yes / No           → Delete it / Leave it      Submit         → Save the dish / File it
Search…            → Search dishes, ingredients, suppliers…
```
Never "Submit", "Confirm", "OK", "Learn more". Never emoji. Money as `€3.90` with the glyph outside
the tabular figure; percentages to one decimal when precise.

## Open questions for the team
1. **The queue needs a ranking rule.** Three cards, ordered by money at stake — but who sets the
   cutoff, and what shows on a day with nothing worth proposing? (Proposal: the empty state is the
   day-one brief, not an empty queue.)
2. **Every card needs a data source the API doesn't return yet**: price deltas by supplier and
   period, invoice→ingredient matching with a reviewable diff, and the same ingredient priced across
   two suppliers. This is the critical path for Today — sequence it before the re-skin if you want
   the screen to be real rather than seeded.
3. **Undo needs a window and a scope.** Reprice writes one menu price; a cost update writes several
   ingredients and recosts dishes. How long is Undo good for, and does it revert the whole batch?
4. Stat-line deltas ("↓ 2.1") still need a previous-period comparison in the analytics queries.
5. Greek: confirm the Geologica / Fira Sans / Fira Mono fallback is acceptable, or budget a licensed
   display face with a Greek cut. Confirm `lang` is set per locale on `<html>`.
6. "Price last changed" on the ingredient detail needs a timestamp the schema doesn't expose.
7. The ingredient form collapses today's multi-supplier `useFieldArray` to one supplier. Confirm
   that's acceptable, or take the repeated-section fallback described above.
8. Supplier payment terms need a data migration (§7). Confirm the five-term list covers every real
   supplier before dropping `Net 30` / `COD` / `Due on Receipt` / `Prepaid`, and that nothing
   downstream reads the old strings.
9. Recipe photos are 4–5 MB PNGs. Resize/convert before they go anywhere near a 36px thumbnail.

## Files
- `Costwise.dc.html` — the full prototype: all nine screens (Today in both states), four overlays,
  the phone view, sample data, and the pricing maths. Open it in a browser. Its Tweaks panel exposes
  `firstDay` (day one vs. everyday Today), `showStatLine`, `ownerName` and `itemsPerPage`.
- `Overview explorations.dc.html` — the two Today directions (the written brief vs. the decision
  queue, each drawn at day one and three months in), the Greek screen that exposed the missing
  glyphs, and the three candidate Greek type systems. Rationale, not build material.
- `design-system/` — the token stylesheets the prototype linked (`colors`, `typography`, `spacing`,
  `shape`, `motion`, `fonts`, `base`, plus the `styles.css` entry point).
- `github.md` — the source repo, branch, and the screen → source-file map this revamp was built from.
