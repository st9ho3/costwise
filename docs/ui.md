# UI

The canonical UI guide for Costwise. Architecture lives in `architecture.md`; routing in
`where-to-touch.md`; invariants in `decisions.md`. This file owns the **look**:
the design language, tokens, and how to build screens.

## Design Language — Costwise Design System ("Paper and Produce")

Warm, tactile, trustworthy companion for chefs, tavernas, and small food businesses:

- **Surfaces**: Two background colors per screen — warm cream page background (`--cream-50 #FDFBF6`) and crisp white cards (`#FFFFFF`). No cold greys.
- **Brand Palette**:
  - Primary: Broccoli green (`--green-800 #1B4A2C`, florets `--green-400 #6FB86E`, tints `--green-50 #F2F9EC`).
  - Accent: Warm gold (`--gold-500 #DCB24A`, background `--gold-100 #FBF1D4`, border `--gold-200 #F0E3BE`).
  - Produce Accents: Clay (`#EE7B3C`), Tomato (`#C0392B`), Berry (`#9A63AC`), Blueberry (`#4A86C4`).
- **Typography**:
  - Display / Headings: `Bricolage Grotesque` (700 bold, tight tracking `-0.02em`, `font-display`).
  - Body & Labels: `Nunito Sans` (15px base, 600 semibold for labels, `font-body`).
  - Numbers, Money & Quantities: `IBM Plex Mono` (tabular-nums, `font-mono` / `.cw-money`).
  - Brand Wordmark: `Baloo 2` (800 extra-bold, `font-logotype`).
  - Greek Fallbacks: `Geologica` / `Fira Sans` / `Fira Mono`.
- **Shape & Radii**:
  - Cards: `rounded-[18px]` (28px for popups/dialogs, 12-16px for form controls and pills).
  - Borders: 1px hairline (`#EFE8DA` / `--sand-200`).
  - Shadows: Soft organic drop shadows (`shadow-[0_1px_2px_rgba(27,26,22,0.05)]`).
- **Copy Voice**:
  - Plain, respectful kitchen talk. Sentence case everywhere (no title case).
  - No trailing periods on headings.
  - Money formatted with symbol before figure (`€15.50`), unit suffix outside (`€0.012 / g`).

## UI Primitives (`src/app/components/ui/`)

All reusable UI primitives live in `src/app/components/ui/`:

- `Button`: Variants (`primary`, `secondary`, `accent`, `outline`, `ghost`, `danger`, `link`), sizes (`sm`, `md`, `lg`, `icon`), `pill`, `block`, `iconLeft`, `iconRight`.
- `IconButton`: Sizes (`sm` 32px, `md` 40px, `lg` 48px), variants (`plain`, `outline`, `solid`, `soft`, `active`, `danger`).
- `Badge`: Tones (`neutral`, `good`, `watch`, `over`, `info`, `agent`, `brand`, `outline`), sizes (`sm`, `md`, `lg`), `dot`, `icon`.
- `Card`: Variants (`default`, `sunken`, `brand`, `accent`, `flat`), sub-components `CardHeader`, `CardTitle`, `CardContent`, etc.
- `Input`: Sizes (`sm`, `md`, `lg`), with `label`, `hint`, `error`, `icon`, `suffix`.
- `MoneyInput`: Currency input with tabular numeric mono font, prefix currency glyph (`€`), suffix `/ per`.
- `Label`: Radix-based label with standard and `overline` uppercase tracking mode.
- `Select` & `NativeSelect`: Dropdown selectors with Costwise styling.
- `Avatar`: Sizes (`sm`, `md`, `lg`, `xl`), initials generator, online dot, and `agent` (Costwise logo mark on green ground) mode.
- `StatTile`: Metric tile with `label`, `value`, `unit`, `delta`, `deltaTone` (`good`, `over`, `flat`), `caption`, `icon`.
- `ProgressMeter`: Progress bar with percentage calculation, label/value readout, and status tones (`good`, `watch`, `over`, `brand`).
- `DataRow`: List item component with `thumb`, `title`, `subtitle`, `amount`, `amountNote`, `end`.
- `Dialog` & `Modal`: Accessible dialogs with pop animation, blur scrim, title, body, and footer actions.
- `Toast`: Bottom-center notification toast with tones (`good`, `watch`, `over`, `default`).
- `EmptyState`: Empty state container with illustration or icon, title, message, and action buttons.
- `Checkbox` & `Switch`: Springy check toggle controls.
- `Logo`: Costwise brand lockup with logo mark and Baloo 2 wordmark.
- `Textarea`: Form textarea with Costwise focus rings and error states.

## Domain Screens Revamp Status

- **App Shell & Layout**:
  - `sideBar.tsx`: 248px expanded / 64px rail, Baloo 2 lockup, active pill (`#F2F9EC`), gold note card, collapse control.
  - `header.tsx`: 60px sticky glass topbar, search pill trigger, bell IconButton with pip, avatar chip opening profile dialog.
  - `tabBar.tsx`: 82px mobile bar with radial cutout mask + 56px green FAB (`+`).
  - `globals.css`: Full theme tokens, Google Fonts imports, Tailwind 4 `@theme` mappings.
- **Today (`/`)**:
  - Everyday Decision Queue: proposal cards (reprice, invoice, supplier switch), cleared counter, stat line, done strip, last touched dishes.
  - Day One Brief: for onboarding and initial accounts.
- **Dishes (`/recipes`)**:
  - Table: 36px category thumbs, mono prices, margin badges (`good`/`info`/`watch`/`over`).
  - Dish Form (`recipeForm.tsx`): 2-column layout (title + dropzone, ingredient row + stepper, radio pricing rows + VAT select; right: sticky "On the plate" live cost breakdown).
- **Ingredients (`/ingredients`)**:
  - Table: display unit pricing, usage badges, category chips.
  - Form (`ingredientForm.tsx`): sparkles live summary card, stepper, single supplier select.
  - Detail (`/ingredients/[id]`): 96px category circle hero + stat tiles + data rows.
- **Suppliers (`/suppliers`)**:
  - Table: store glyph thumbs, delivery badges.
  - Form (`suppliersForm.tsx`): 4 groups, English canonical delivery & payment options, category chips.
- **Auth (`/signin`, `/signup`)**:
  - 2-panel split: Left card ("Come on in" / "Set me up"), Right green panel with 3D produce cast illustration and brand copy.
- **Shared Components**:
  - Search: dropdown anchored under topbar pill with category thumbs and mono prices.
  - Create Sheet (`optionsModal.tsx`): "What are we adding?" with 3 tinted options.
  - Delete Confirm Dialog (`deleteConfirmationModal.tsx`): "Leave it" / "Delete it" voice.
  - Profile Dialog (`profileModal.tsx`): avatar chip, details, sign out.
