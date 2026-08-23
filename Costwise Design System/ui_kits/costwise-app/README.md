# Costwise web app — UI kit

Five click-through screens built entirely from the design-system primitives. No new visual
decisions were made here: every colour, radius, shadow and type role comes from `styles.css`,
and every control is a component from `components/`.

Open `index.html`. It starts on the login screen; any submit signs you in.

## Screens

| File | What it is |
| --- | --- |
| `LoginScreen.jsx` | Split sign-in — copy + form left, brand illustration on green-50 right. |
| `AppShell.jsx` | Sidebar (`SidebarNav`) + glass topbar + toast host + view routing. |
| `TodayScreen.jsx` | The home view: four stat tiles, one gold "Costwise spotted this" card, spend breakdown, dish and invoice lists, sticky composer. |
| `AskScreen.jsx` | The assistant thread — bubbles with card attachments, thinking state, confirm dialog. |
| `DishScreen.jsx` | Dish costing: ingredient rows, cost history, price suggestion with `MoneyInput`. |
| `InvoicesScreen.jsx` | Invoice inbox + a read invoice showing which prices moved. |

## Interactions that work

- Sign in / sign out.
- Sidebar navigation between Today, Ask, Dishes, Invoices.
- Ask Costwise: tap a chip or type — the agent shows a thinking state, then answers with an attached card.
- "Update the menu price" opens a confirm dialog and fires a toast with Undo.
- Invoice list → detail; "File it" toasts.
- Sidebar entries with nothing designed for them (Ingredients, Suppliers, Settings) render an
  explicit "not in the kit yet" empty state rather than invented UI.

## Deliberately not built

No mobile app screens, no marketing site, no onboarding flow — nothing was supplied for those
surfaces. The desktop web-app layout follows the reference shots in `references/`; those shots
are third-party products used only as layout reference, never as brand material.
