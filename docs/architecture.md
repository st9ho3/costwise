# Architecture

## Overview

CostWise is a Next.js App Router application with a layered backend and a domain-oriented frontend.

## Top-Level Structure

- `src/app/(auth)` - sign-in and sign-up flow
- `src/app/(user)` - authenticated application shell and user-facing pages
- `src/app/api` - route handlers for CRUD, auth, search, and uploads
- `src/app/components` - domain components and design system UI primitives (`src/app/components/ui`)
- `src/app/hooks` - client-side form, search, upload, and UI helpers
- `src/app/stores` - Zustand state for UI, files, notifications, and general app state
- `src/app/services` - business logic and orchestration
- `src/app/repositories` - database queries and persistence logic
- `src/app/utils` - formatting, pricing, transformers, pagination, and error helpers
- `src/db` - Drizzle database connection and schema
- `src/shemas` - validation schemas and shared domain types

## Design System & UI Layer

- The design system is the **Costwise Design System ("Paper and Produce")** documented in `docs/ui.md`.
- Semantic design tokens live in `src/app/globals.css` with warm surfaces (`--cream-50`, `#FFFFFF`), brand green (`--green-800`), accent gold (`--gold-500`), and produce accents (clay, tomato, berry, blueberry).
- All reusable UI primitives live under `src/app/components/ui/` (`Button`, `IconButton`, `Badge`, `Card`, `Input`, `MoneyInput`, `Label`, `Select`, `NativeSelect`, `Avatar`, `StatTile`, `ProgressMeter`, `DataRow`, `Dialog`, `Modal`, `Toast`, `EmptyState`, `Checkbox`, `Switch`, `Logo`, `Textarea`).
- Typography uses Bricolage Grotesque (headings), Nunito Sans (body & labels), IBM Plex Mono (money & tabular numbers), and Baloo 2 (wordmark). No cold greys or generic templates.

## Runtime Shell

- `src/app/(user)/layout.tsx` is the authenticated shell.
- It checks `auth()`, redirects unauthenticated users to `/signin`, and renders the shared chrome:
- sidebar
- header
- mobile search
- tab bar
- Vercel analytics
- `src/app/(auth)/layout.tsx` is the lightweight shell for auth pages.

## User-Facing Domains

### Recipes

- List page: `src/app/(user)/recipes/page.tsx`
- Create page: `src/app/(user)/recipes/create/page.tsx`
- Detail page: `src/app/(user)/recipes/[id]/page.tsx`
- Edit page: `src/app/(user)/recipes/edit/[id]/page.tsx`
- Forms and tables live under `src/app/components/recipes`

### Ingredients

- List page: `src/app/(user)/ingredients/page.tsx`
- Create page: `src/app/(user)/ingredients/create/page.tsx`
- Detail page: `src/app/(user)/ingredients/[id]/page.tsx`
- Edit page: `src/app/(user)/ingredients/edit/[id]/page.tsx`
- Forms and tables live under `src/app/components/ingredients`

### Suppliers

- List page: `src/app/(user)/suppliers/page.tsx`
- Create page: `src/app/(user)/suppliers/create/page.tsx`
- Detail page: `src/app/(user)/suppliers/[id]/page.tsx`
- Edit page: `src/app/(user)/suppliers/edit/[id]/page.tsx`
- Forms and tables live under `src/app/components/suppliers`

## Backend Layers

### API Routes

- `src/app/api/*/route.ts` handles request validation, auth checks, service instantiation, and response formatting.
- API routes should stay thin and delegate real work to services.

### Services

- `src/app/services/*Service.ts` contains business rules, permission checks, transactions, and cross-entity coordination.
- Services depend on repositories and shared transformers/validators.

### Repositories

- `src/app/repositories/*Repository.ts` encapsulates SQL-facing operations.
- Repositories should not contain UI concerns or route-specific logic.

### Database

- `src/db/db.ts` creates the Drizzle connection.
- `src/db/schema.ts` defines tables, enums, and relations.

## Auth Flow

- `src/auth.ts` configures NextAuth.
- It supports Google OAuth and credentials login.
- The session is used by `src/app/(user)/layout.tsx` and most user pages to gate access.

## Data Flow

Typical request path:
1. Page or component triggers an action.
2. Client code calls an API route or server component calls a service directly.
3. Service validates ownership and business rules.
4. Service calls one or more repositories.
5. Repository reads or writes through Drizzle.
6. Results are transformed back into app-friendly objects.

## Source Of Truth Rule

- Architecture belongs here.
- Ownership and edit routing belong in `where-to-touch.md`.
- Do not restate this architecture in other files unless you are intentionally creating a short pointer.

