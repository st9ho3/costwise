# Costwise Design System

Costwise is a **companion for small food-and-beverage businesses** — a café, a bakery, a
20-cover trattoria. It watches what ingredients cost, works out what each dish costs to put on
a plate, reads supplier invoices, and tells the owner in plain language what changed and what to
do about it. It behaves like a knowledgeable friend who happens to be good with numbers, not
like a finance dashboard.

The brief that produced this system, verbatim in spirit: *"an app that will serve also as agent
to people that want a companion about their small business… small and medium businesses… an
assistant, not just another SaaS product. So the system needs to have this warmth and casualty.
We will use it on food and beverage businesses mostly."*

Everything below follows from those two words: **warmth** and **casualty**.

---

## Sources I was given

| Source | What it is | How it was used |
| --- | --- | --- |
| `uploads/apple-icon.png` → `assets/logo-mark.png` | The Costwise app icon: coins stacked into a broccoli, mid-green florets, `#1B4A2C` outline | **Primary brand source.** The whole colour system is sampled from it. Also the logo — never redrawn. |
| `uploads/auth_photo.png` → `assets/brand-illustration-cast.png` | 3D render: a smiling banknote surrounded by a carrot, courgette, broccoli, aubergine, steak, garlic, coin and calculator, under the "CostWise" bubble logotype | **Second brand source.** Sets the illustration style, the accent hues, and the tone (food and money as friendly characters). |
| 8 × `uploads/original-*.webp`, `uploads/ClickUp Web 222.png` → `references/` | Third-party product shots (a "stratify.com" AI-assistant concept, an event-card concept, health-dashboard cards, a ClickUp screen captured via Mobbin) | **Layout and interaction reference only.** They informed the sidebar + card-feed + floating-composer structure of the UI kit. None of their colours, type or brand marks were copied. |

**No codebase, Figma file or font binaries were supplied.** No product copy existed beyond the
brief. So the component inventory is the standard set (see *Intentional additions*), the type is
substituted from Google Fonts, and the icon set is substituted with Lucide — all three flagged
below and all three worth replacing with the real thing.

The "CostWise" bubble logotype inside `auth_photo.png` is rendered art, not a supplied
wordmark file. It is treated as reference for the wordmark's *character* (rounded, chunky,
friendly); the system sets live wordmarks in Baloo 2 as the nearest free match.

---

## Content fundamentals

Costwise talks the way a good supplier rep talks: quick, specific, on your side, never lecturing.

**Voice**

- **We say "you" and "I".** Costwise is a someone. *"I'll flag anything that went up."* /
  *"Your carbonara costs €3.90 a plate."* Never "the system" or "users".
- **Plain words over finance words.** "What you keep" beats "gross margin". "Plate cost" beats
  "unit COGS". If a term must be technical, a `Tooltip` defines it in one sentence:
  *"What you pay for the food on one plate, before staff and rent."*
- **Lead with the number, then the reason, then the option.**
  *"Eggs are up 14% at Metro. That's 40c a plate on the carbonara. Two options: hold the price
  for a fortnight, or go to €15.50 and stay at a 68% margin."*
- **Never alarmist.** Costs going up is normal. *"Nothing's broken — just worth knowing before
  you print the new menu."* Tone words: *worth a look*, *drifting*, *tight*, *fine*. Not:
  *critical*, *alert*, *failure*, *urgent*.
- **Short sentences. Contractions always.** "Let's", "I'll", "you're", "isn't".
- **Time is human.** "Before service", "Mondays, 8am", "this week", "tonight" — not "T-1" or
  "in the last 7 days".

**Casing & punctuation**

- Sentence case everywhere — headings, buttons, labels, badges, nav. `Add ingredient`, not
  `Add Ingredient`. The only uppercase is the `.cw-overline` eyebrow (11px, 0.08em tracking).
- No trailing periods on headings, labels, badges or single-line captions. Periods in prose.
- Currency glyph outside the tabular figure: `€3.90`. Percentages with one decimal when precise
  (`31.4%`), whole when spoken (`up 14%`).
- Em dashes for asides, spaced en dash never. Ellipsis for waiting states: `Saving…`

**Button and empty-state copy**

Buttons say what happens in the owner's words: `Come on in`, `Look at the carbonara`,
`Snap an invoice`, `File it`, `Use €15.50`, `Not yet`, `Leave it`, `Remind me Monday`. Never
`Submit`, `Confirm`, `OK`, `Learn more`.

Empty states are invitations, not apologies:
*"Let's start with one dish — add what goes on the plate and I'll work out what it costs you."*

**Emoji: no.** The warmth is carried by the illustrated cast, the cream paper and the rounded
type. Product UI uses Lucide glyphs only. (The reference shots use 👋 and 🎉-style emoji in
headings — that is their voice, not ours.) Unicode arrows are used inline in deltas
(`↓ 2.1 pts`, `↑ €0.22`) because they read as typography, not decoration.

---

## Visual foundations

**Colour.** Everything is sampled from the two brand assets. The primary ramp is the broccoli
green (`--green-800 #1B4A2C` outline, `--green-400 #6FB86E` florets); the accent is coin gold
(`--gold-500 #DCB24A`); the produce cast supplies clay orange, tomato, aubergine berry and a
blueberry blue used for *info*. **Neutrals are warm paper, never grey** — every neutral carries
yellow (`--cream-50 #FDFBF6` pages, `--cream-200 #F0EADC` insets, `--ink-900 #1B1A16` text).
Two background colours per screen maximum: cream page, white cards. Status uses Costwise's own
vocabulary — `good` / `watch` / `over` rather than success / warning / error — plus `agent`
(berry) for "Costwise noticed this".

**Type.** Two families. **Bricolage Grotesque** (bold 700, `-0.02em`) for headlines, screen
titles and big metrics — it has a slightly irregular, hand-cut feel that keeps numbers from
looking corporate. **Nunito Sans** for everything the assistant says and every label — rounded
terminals, high x-height, 15px base, 1.45 leading. **IBM Plex Mono** with `tabular-nums` for all
money and quantities so columns line up. **Baloo 2** 800 for the wordmark only, never UI copy.
Body copy never below 15px; captions 12px; the smallest type in the system is the 11px overline.

**Spacing & layout.** 4px base with 2/6px half-steps for dense rows. 20px page gutter on phone,
40px on desktop, content capped at 1000–1160px. 20px card padding (`--pad-card`), 14px for row
lists, 12px between rows inside a card, 16px between cards, 32px between sections. Desktop
shell is a fixed 248px sidebar + a 60px sticky topbar; the ask-Costwise composer is
**sticky to the bottom** of scrolling views, over a cream-to-transparent protection gradient
(not a solid bar, not a capsule).

**Backgrounds.** Flat cream. No gradients as decoration, no photography behind text, no
repeating patterns, no noise or grain. The only gradients in the system are functional
protection gradients under sticky composers. Brand warmth comes from the illustrated 3D cast
(`assets/brand-illustration-cast*.png`) placed on `--surface-brand-soft`, at one scene per
screen — login, onboarding, big empty states, celebration moments.

**Cards.** White, `--radius-card` 18px, `1px solid --border-subtle` (#EFE8DA), `--shadow-sm`.
Three variants: `sunken` (cream, no shadow, nested inside another card), `brand` (deep green,
`--shadow-brand`, exactly one hero per screen), `accent` (gold wash + `#F0E3BE` border — the
"Costwise spotted this" card). Never a coloured left border only. Never a card inside a card
inside a card.

**Corners.** Nothing sharp anywhere. 6px on tick boxes, 12px on controls, 16–18px on cards,
20px on tiles and chat bubbles, 28px on dialogs and sheets, full pill on anything
conversational (chips, tabs, the composer, badges). Chat bubbles break one corner to 8px on the
speaker's side — the only asymmetric shape in the system.

**Shadows.** Warm and green-black, never blue-black: `rgba(27,26,22,…)`. `--shadow-xs` on tiles,
`--shadow-sm` on cards (the default), `--shadow-md` on hover and the floating composer,
`--shadow-lg` on toasts, `--shadow-pop` on dialogs only, `--shadow-brand`
(`0 8px 24px -10px rgba(27,74,44,.5)`) under green buttons and green cards. One inset shadow
token exists for pressed wells; it is rarely used.

**Borders.** 1px hairlines in warm sand: `--border-subtle` for card edges and list dividers,
`--border-default` for inputs and secondary buttons, `--border-strong` on input hover, 1.5px on
checkboxes, 2.5px on the active underline tab. Borders are structure, never decoration.

**Animation.** Fast and soft. 140ms for control feedback, 200ms for surfaces, 320ms for a bar
filling. Default easing `--ease-out-soft cubic-bezier(.2,.8,.25,1)`. **One** springy curve,
`--ease-nudge cubic-bezier(.34,1.4,.64,1)`, used only where a small overshoot feels friendly:
the checkbox tick, the switch knob, a dialog arriving, a toast sliding up. No bounces on page
transitions, no parallax, no scroll-triggered reveals, no looping ambient motion. The assistant's
thinking state is three 6px green dots on a 1.1s stagger. Everything collapses to 0ms under
`prefers-reduced-motion`.

**Hover states.** Interactive surfaces lift `translateY(-1px)` and step from `--shadow-sm` to
`--shadow-md`. Primary buttons lighten (green-800 → green-700); secondary buttons take a cream
fill and a stronger border; ghost buttons take a green-50 wash; list rows take a cream-100 wash.
Nothing changes opacity on hover — opacity is reserved for disabled (0.42).

**Press states.** `scale(0.975)` plus a darker step (green-800 → green-900). Both, always,
together. Nothing moves more than that.

**Focus.** `--ring-focus: 0 0 0 3px rgba(67,149,90,.32)` — a soft green halo, no outline,
never removed. Danger fields get the tomato equivalent.

**Transparency & blur.** Used twice only: the sticky topbar (`--surface-glass` cream at 78% +
8px blur) and the dialog scrim (ink at 42% + 3px blur). Never on cards, never on text
backgrounds, never for depth games.

**Imagery.** The 3D illustration style is soft studio light, warm and slightly saturated, no
outlines, no grain, cast shadows only under the object. If photography is ever added it should
be warm-lit and close-up — hands, produce, a counter — never cool, never desaturated,
never a stock boardroom. Data visualisation is bars and meters on a cream track, in the ordered
`--viz-1…6` ramp. **No pie charts, no donuts, no gauges.**

**Fixed elements.** Sidebar and topbar are fixed on desktop; the composer is sticky-bottom on
scrolling views; toasts sit bottom-centre 26px up and live for ~3.6s. Nothing else floats.

---

## Iconography

**Lucide 0.454.0, stroke-width 1.75, `currentColor` only.** ⚠️ **Substituted** — no icon font,
sprite or SVG set was supplied with the brand assets. Lucide was chosen because its rounded caps
and joins and its light stroke match the logo's soft, thick-outlined character better than
Heroicons (sharper) or Material (heavier).

- Loaded from CDN: `<script src="https://unpkg.com/lucide@0.454.0/dist/umd/lucide.js"></script>`.
- Always through the `Icon` component — never hand-rolled inline SVG, never a PNG icon.
- Sizes: 16 inline with text, 20 in buttons and rows (default), 24 in navigation, 28–32 in
  compact empty states.
- The house set in practice: `house`, `sparkles` (Costwise itself), `receipt-text`, `carrot`,
  `egg`, `milk`, `beef`, `fish`, `wheat`, `salad`, `utensils`, `truck`, `store`, `scale`,
  `camera`, `mic`, `bell`, `trending-up` / `trending-down`, `circle-help`, `settings`,
  `chevron-right`, `ellipsis`.
- **Food-specific glyphs are preferred over abstract ones** — an ingredient row uses `carrot` or
  `egg`, not a generic `box`. This is the single most on-brand icon decision in the system.
- The Costwise mark itself (`assets/logo-mark-transparent.png`) is used as the assistant's
  avatar via `<Avatar agent>` — it is an image, not an icon, and is never recoloured.
- **No emoji, no unicode symbols as icons.** Inline arrows in numeric deltas (`↑ ↓`) are the
  single exception and are treated as type.

---

## Substitutions to fix

1. **Fonts.** No binaries were supplied. Bricolage Grotesque / Nunito Sans / Baloo 2 / IBM Plex
   Mono are loaded from Google Fonts in `tokens/fonts.css`. **If Costwise has real licensed
   faces — especially the actual logotype face — please send the files** and I'll swap them in
   and re-tune the type scale.
2. **Icons.** Lucide, as above. If there is a real Costwise icon set, send it and I'll drop it
   into `assets/` and repoint the `Icon` component.
3. **Logo.** Only a 180×180 raster app icon exists. `assets/logo-mark-transparent.png` is that
   file with its white background knocked out programmatically — no redrawing. **An SVG version
   would improve every surface in this system.** No alternate lockup, no horizontal wordmark
   file and no clear-space spec were supplied; the rules in `guidelines/brand-logo.card.html`
   are proposals.

---

## Index

**Root**

- `styles.css` — the single entry point consumers link. `@import` lines only.
- `thumbnail.html` — the homepage tile.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills front-matter so this folder works as a Claude Code skill.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `shape.css`,
`motion.css`, `base.css` (element resets + the `.cw-money` / `.cw-overline` helpers).

**`assets/`** — `logo-mark.png`, `logo-mark-transparent.png`,
`brand-illustration-cast.png`, `brand-illustration-cast-transparent.png`.

**`references/`** — the third-party product shots supplied as layout reference. Not brand
material; do not lift colour, type or marks from them.

**`guidelines/`** — 19 specimen cards: colour (greens, gold, produce, neutrals, status, viz,
surfaces), type (display, body, money, logotype), spacing (scale, layout), brand (radii,
shadows, motion, logo, illustration, iconography).

**`components/`** — 24 components in 7 groups.

| Group | Components |
| --- | --- |
| `brand/` | **Logo** |
| `core/` | **Button**, **IconButton**, **Icon**, **Badge**, **Card**, **Avatar** |
| `forms/` | **Input**, **MoneyInput**, **Select**, **Checkbox**, **Switch** |
| `data/` | **StatTile**, **ProgressMeter**, **DataRow** |
| `navigation/` | **Tabs**, **SidebarNav** |
| `feedback/` | **Dialog**, **Toast**, **Tooltip**, **EmptyState** |
| `agent/` | **ChatBubble**, **SuggestionChip**, **Composer** |

Each has a `.d.ts` props contract and a `.prompt.md` with a usage example; each directory has one
`@dsCard` HTML showing its states.

**`ui_kits/costwise-app/`** — the web app: `LoginScreen`, `AppShell`, `TodayScreen`, `AskScreen`,
`DishScreen`, `InvoicesScreen`, plus its own `README.md`. Open `index.html`.

### Intentional additions

No source defined a component inventory, so the standard set was authored. Four entries go
beyond it, each because Costwise's job demands it:

- **MoneyInput** — amount entry is the most repeated task in the product; it needs a currency
  glyph, tabular digits and a per-unit suffix as first-class props.
- **StatTile / ProgressMeter / DataRow** — the product is numbers about food. These three carry
  every screen, and letting each screen re-invent them would break the numeric type rules first.
- **ChatBubble / SuggestionChip / Composer** — the assistant *is* the product, so its surface is
  a primitive family, not a one-off screen.
- **Icon** — a wrapper over the substituted Lucide set, so swapping icon libraries later is one
  file, not a hundred call sites.

### Not built, on purpose

No mobile-app screens, no marketing site, no onboarding flow, no slide template — nothing was
supplied for any of them. Sidebar destinations with no supplied design (Ingredients, Suppliers,
Settings) render an explicit "not in the kit yet" empty state in the UI kit rather than invented
UI.
