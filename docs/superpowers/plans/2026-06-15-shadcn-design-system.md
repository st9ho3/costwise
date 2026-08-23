# Shadcn Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a token-driven "Linear, soft" UI system built on shadcn/ui primitives, and prove it by migrating the Ingredients domain end-to-end.

**Architecture:** Semantic design tokens live in `src/app/globals.css` via Tailwind v4 `@theme`. Reusable primitives live in `src/app/components/ui/` (one component root, matching `docs/where-to-touch.md`). Primitives compose classes through a `cn()` helper. The Ingredients domain is migrated onto tokens + primitives; other domains stay on legacy styling until later plans.

**Tech Stack:** Next.js 15.3.8 (App Router), React 19, Tailwind CSS v4, TypeScript 5, npm, Jest + React Testing Library, class-variance-authority, tailwind-merge, Radix UI (Select).

**Design source of truth:** `docs/superpowers/specs/2026-06-15-shadcn-design-system-design.md`

---

## Execution Notes

- **Working tree is dirty.** `src/app/components/ingredients/ingredientForm.tsx` is already modified, and `CLAUDE.md`, `AGENTS.md`, `docs/`, `review.md` are untracked from prior work. Do not revert these. Only stage the files each task names.
- **No jest-dom matchers.** `jest.config.ts` does not wire `@testing-library/jest-dom` (`setupFilesAfterEnv` is commented out). Tests in this plan use **plain Jest matchers** against `element.className` / `textContent` — do NOT use `toBeInTheDocument` or `toHaveClass`.
- **Design calibration ("Linear, soft"):** ~6px radius, thin slate borders, soft blurred shadows, focus ring (not border-jump), restrained primary, mono uppercase labels. No hard black offset shadows.
- **Light theme only** this plan. Token names are chosen so a `.dark` block can be added later without renaming.
- **Primitive library vs wiring:** Tasks 4–5 create all seven primitives. Tasks 6–7 wire only Button, Input, Label, Card, Badge into Ingredients. Select and Textarea ship ready-but-unused for later domains.
- Verification gate every task: `npx tsc --noEmit` and the named tests pass. Full `npm run build` runs in the final task.

---

## File Structure

### Create
- `src/app/utils/cn.ts` — class-merge helper (`clsx` + `tailwind-merge`).
- `src/app/utils/cn.test.ts` — unit test for `cn()`.
- `components.json` — shadcn config pointing at `src/app/components/ui/`.
- `src/app/components/ui/button.tsx` — Button primitive.
- `src/app/components/ui/button.test.tsx` — Button render test.
- `src/app/components/ui/input.tsx` — Input primitive.
- `src/app/components/ui/label.tsx` — Label primitive (mono uppercase).
- `src/app/components/ui/textarea.tsx` — Textarea primitive (library, unwired).
- `src/app/components/ui/card.tsx` — Card primitive set.
- `src/app/components/ui/badge.tsx` — Badge primitive.
- `src/app/components/ui/select.tsx` — Radix Select primitive (library, unwired).
- `src/app/components/ui/primitives.test.tsx` — smoke render test for Input/Label/Card/Badge.
- `docs/ui.md` — canonical UI documentation.

### Modify
- `package.json` / `package-lock.json` — add deps.
- `src/app/globals.css` — token foundation.
- `src/app/components/ingredients/ingredientForm.tsx` — use Card, Label, Button.
- `src/app/components/ingredients/ingredientsFormComponents/ingredientNameInput.tsx` — tokens.
- `src/app/components/ingredients/ingredientsFormComponents/ingredientpriceInput.tsx` — tokens.
- `src/app/components/ingredients/ingredientsFormComponents/FormSelect.tsx` — tokens.
- `src/app/components/ingredients/ingredientsFormComponents/formErrors.tsx` — tokens.
- `src/app/components/ingredients/ingredientsFormComponents/ingredientSummary.tsx` — tokens.
- `src/app/components/ingredients/ingredientsTable.tsx` — tokens + Badge.
- `src/app/components/ingredients/ingredientPage/*.tsx` — tokens + Badge.
- `CLAUDE.md`, `docs/AGENTS.md` — pointer to `docs/ui.md`.

---

## Task 1: Install dependencies and add shadcn config

**Files:**
- Modify: `package.json`, `package-lock.json`
- Create: `components.json`

- [ ] **Step 1: Install runtime dependencies**

Run:

```bash
npm install class-variance-authority tailwind-merge @radix-ui/react-select @radix-ui/react-label @radix-ui/react-slot
```

Expected: installs succeed; `package.json` dependencies now include all five (`clsx` is already present).

- [ ] **Step 2: Create `components.json` pointing at the existing component root**

Create `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/app/components",
    "utils": "@/app/utils/cn",
    "ui": "@/app/components/ui",
    "lib": "@/app/utils",
    "hooks": "@/app/hooks"
  },
  "iconLibrary": "lucide"
}
```

Note: we write primitive source directly in later tasks rather than running the interactive `shadcn add` CLI, so this file documents intent and supports future `shadcn add` runs. It is not executed by these tasks.

- [ ] **Step 3: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: PASS (no errors; new deps have types).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components.json
git commit -m "build: add shadcn design-system dependencies and config"
```

---

## Task 2: Add the `cn()` class-merge helper (TDD)

**Files:**
- Create: `src/app/utils/cn.ts`
- Test: `src/app/utils/cn.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/utils/cn.test.ts`:

```ts
import { cn } from './cn'

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })

  it('merges conflicting tailwind classes, last wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('keeps non-conflicting tailwind classes', () => {
    expect(cn('text-sm', 'font-medium')).toBe('text-sm font-medium')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- cn.test.ts`
Expected: FAIL — cannot find module `./cn`.

- [ ] **Step 3: Implement `cn()`**

Create `src/app/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- cn.test.ts`
Expected: PASS (4 passing).

- [ ] **Step 5: Commit**

```bash
git add src/app/utils/cn.ts src/app/utils/cn.test.ts
git commit -m "feat: add cn class-merge helper"
```

---

## Task 3: Replace the global token foundation

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Rewrite `globals.css` with the Linear-soft token system**

Replace the entire contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  /* surfaces */
  --background: 210 20% 98%;
  --foreground: 222 47% 11%;
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;

  /* brand / intent */
  --primary: 222 47% 31%;
  --primary-foreground: 210 20% 98%;
  --secondary: 210 20% 94%;
  --secondary-foreground: 222 47% 18%;
  --muted: 210 20% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 210 20% 94%;
  --accent-foreground: 222 47% 18%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 210 20% 98%;
  --success: 160 84% 30%;
  --success-foreground: 210 20% 98%;

  /* lines & focus */
  --border: 214 20% 88%;
  --input: 214 20% 88%;
  --ring: 222 47% 31%;

  --radius: 6px;
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-success: hsl(var(--success));
  --color-success-foreground: hsl(var(--success-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 4px);

  --font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

  --shadow-soft-sm: 0 1px 2px 0 rgb(15 23 42 / 0.06);
  --shadow-soft-md: 0 2px 8px -2px rgb(15 23 42 / 0.10);
}

@layer base {
  body {
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    font-size: small;
  }
}

@layer utilities {
  .shadow-soft-sm { box-shadow: var(--shadow-soft-sm); }
  .shadow-soft-md { box-shadow: var(--shadow-soft-md); }
}

/* Chrome, Safari, Edge, Opera: hide number input spinners */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .chat-ipad { left: 0px !important; width: 100% !important; }
}

@media (min-width: 1024px) and (max-width: 1370px) {
  .chat-laptop { left: calc(100% - 400px) !important; width: calc(100% - 64px) !important; }
}
```

- [ ] **Step 2: Add the JetBrains Mono font import**

The plan uses `font-mono` for labels. Install the font package so it is bundled:

```bash
npm install @fontsource/jetbrains-mono
```

Then add these imports at the very top of `src/app/layout.tsx` (above the existing imports):

```tsx
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
```

- [ ] **Step 3: Verify the app compiles and the dev server boots**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run build`
Expected: PASS (confirms the new CSS is valid Tailwind v4 and `@theme` parses).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add linear-soft design tokens to globals.css"
```

---

## Task 4: Add the Button primitive (TDD)

**Files:**
- Create: `src/app/components/ui/button.tsx`
- Test: `src/app/components/ui/button.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/app/components/ui/button.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders its text content', () => {
    const { getByRole } = render(<Button>Save</Button>)
    expect(getByRole('button').textContent).toBe('Save')
  })

  it('applies the destructive variant classes', () => {
    const { getByRole } = render(<Button variant="destructive">Delete</Button>)
    expect(getByRole('button').className).toContain('bg-destructive')
  })

  it('merges a custom className', () => {
    const { getByRole } = render(<Button className="w-full">Wide</Button>)
    expect(getByRole('button').className).toContain('w-full')
  })

  it('forwards the onClick handler', () => {
    const onClick = jest.fn()
    const { getByRole } = render(<Button onClick={onClick}>Go</Button>)
    getByRole('button').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- button.test.tsx`
Expected: FAIL — cannot find module `./button`.

- [ ] **Step 3: Implement the Button primitive**

Create `src/app/components/ui/button.tsx`:

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft-sm hover:bg-primary/90",
        outline: "border border-border bg-card text-foreground shadow-soft-sm hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent",
        destructive: "bg-destructive text-destructive-foreground shadow-soft-sm hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test -- button.test.tsx`
Expected: PASS (4 passing).

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ui/button.tsx src/app/components/ui/button.test.tsx
git commit -m "feat: add Button primitive"
```

---

## Task 5: Add the remaining primitives

**Files:**
- Create: `src/app/components/ui/input.tsx`, `label.tsx`, `textarea.tsx`, `card.tsx`, `badge.tsx`, `select.tsx`
- Test: `src/app/components/ui/primitives.test.tsx`

- [ ] **Step 1: Create `input.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/app/utils/cn'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

export { Input }
```

- [ ] **Step 2: Create `label.tsx` (mono uppercase — the Linear identity cue)**

```tsx
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/app/utils/cn'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

- [ ] **Step 3: Create `textarea.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/app/utils/cn'

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

- [ ] **Step 4: Create `card.tsx`**

```tsx
import * as React from 'react'
import { cn } from '@/app/utils/cn'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card text-card-foreground shadow-soft-sm", className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn("flex flex-col gap-1 border-b border-border px-5 py-4", className)} {...props} />
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn("text-base font-semibold leading-none", className)} {...props} />
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn("font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn("px-5 py-4", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn("flex items-center border-t border-border px-5 py-4", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

- [ ] **Step 5: Create `badge.tsx`**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/utils/cn'

const badgeVariants = cva(
  "inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-card text-foreground",
        success: "border-transparent bg-success text-success-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 6: Create `select.tsx` (Radix — library primitive, unwired this plan)**

```tsx
'use client'
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/app/utils/cn'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-soft-md",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
```

- [ ] **Step 7: Write the smoke test for the simple primitives**

Create `src/app/components/ui/primitives.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Card, CardTitle } from './card'

describe('primitives', () => {
  it('Input forwards className and renders an input', () => {
    const { container } = render(<Input className="custom-in" placeholder="x" />)
    const input = container.querySelector('input')!
    expect(input).toBeTruthy()
    expect(input.className).toContain('custom-in')
  })

  it('Label renders mono uppercase styling', () => {
    const { container } = render(<Label>Name</Label>)
    const label = container.querySelector('label')!
    expect(label.className).toContain('uppercase')
    expect(label.textContent).toBe('Name')
  })

  it('Badge applies the success variant', () => {
    const { container } = render(<Badge variant="success">Active</Badge>)
    expect(container.firstChild!.textContent).toBe('Active')
    expect((container.firstChild as HTMLElement).className).toContain('bg-success')
  })

  it('Card renders title text', () => {
    const { container } = render(<Card><CardTitle>Hello</CardTitle></Card>)
    expect(container.textContent).toContain('Hello')
  })
})
```

- [ ] **Step 8: Run primitive tests and typecheck**

Run: `npm test -- primitives.test.tsx`
Expected: PASS (4 passing).

Run: `npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/app/components/ui/input.tsx src/app/components/ui/label.tsx src/app/components/ui/textarea.tsx src/app/components/ui/card.tsx src/app/components/ui/badge.tsx src/app/components/ui/select.tsx src/app/components/ui/primitives.test.tsx
git commit -m "feat: add Input, Label, Textarea, Card, Badge, Select primitives"
```

---

## Task 6: Migrate the Ingredients form onto primitives + tokens

**Files:**
- Modify: `src/app/components/ingredients/ingredientForm.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/ingredientNameInput.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/ingredientpriceInput.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/FormSelect.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/formErrors.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/ingredientSummary.tsx`
- Modify: `src/app/components/ingredients/ingredientsFormComponents/button/submitIngredientButton.tsx`

- [ ] **Step 1: Rewrite the legacy submit Button to use the primitive**

The legacy `submitIngredientButton.tsx` imports a bespoke `./button`. Repoint it at the new primitive. Replace the entire contents of `src/app/components/ingredients/ingredientsFormComponents/button/submitIngredientButton.tsx` with:

```tsx
"use client";
import React, { memo } from 'react';
import { Pencil, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type AddIngredientButtonProps = {
  mode: 'create' | 'edit';
  isSubmitting: boolean;
};

const AddIngredientButton = memo(({ mode, isSubmitting }: AddIngredientButtonProps) => {
  const isEditMode = mode === 'edit';
  const label = isEditMode
    ? (isSubmitting ? 'Updating' : 'Update')
    : (isSubmitting ? 'Adding' : 'Add');

  return (
    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
      {isSubmitting ? (
        <Loader2 className="animate-spin" />
      ) : isEditMode ? (
        <Pencil />
      ) : (
        <Plus />
      )}
      <span>{label}</span>
    </Button>
  );
});

AddIngredientButton.displayName = 'AddIngredientButton';

export default AddIngredientButton;
```

Note: the bespoke `button/button.tsx` is now unused by Ingredients but is left in place (other domains may still import it); it gets deleted in a later domain-migration plan.

- [ ] **Step 2: Convert the form container to a Card and labels to the Label primitive**

In `src/app/components/ingredients/ingredientForm.tsx`:

Add these imports after the existing `lucide-react` import (line 17):

```tsx
import { Card } from '../ui/card';
import { Label } from '../ui/label';
```

Replace the card container opening tag (line 52):

```tsx
      <div className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100">
```

with:

```tsx
      <Card className="p-6">
```

And replace its matching closing `</div>` (line 173, the one immediately before the `{/* Suppliers Selection Modal */}` comment) with:

```tsx
      </Card>
```

Then replace **each** of the four inline label elements that read like this:

```tsx
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
              Ingredient Name
            </label>
```

with the primitive (keep each label's own text — "Ingredient Name", "Category", "Quantity", "Unit", "Price / Unit"):

```tsx
            <Label className="mb-1.5 ml-1 block">Ingredient Name</Label>
```

Also remove the stray debug line `console.log(error)` (line 45).

- [ ] **Step 3: Retokenize the Name input**

In `src/app/components/ingredients/ingredientsFormComponents/ingredientNameInput.tsx`, replace the container `className` and input `className` so hardcoded grays/blues become tokens. Replace the container div className block with:

```tsx
    <div className={`
      flex items-center w-full px-4 h-10
      bg-card border border-input rounded-md
      transition-colors
      focus-within:ring-2 focus-within:ring-ring
    `}>
```

Replace the `Carrot` icon className `"text-gray-400 mr-3 shrink-0"` with `"text-muted-foreground mr-3 shrink-0"`.

Replace the input className with:

```tsx
        className="
          w-full h-full bg-transparent border-none outline-none
          text-sm font-medium text-foreground placeholder:text-muted-foreground
        "
```

- [ ] **Step 4: Retokenize the Price input**

In `src/app/components/ingredients/ingredientsFormComponents/ingredientpriceInput.tsx`, apply the same three replacements as Step 3:

- Container div className → the `bg-card border border-input rounded-md ... focus-within:ring-2 focus-within:ring-ring` block (with `h-10`).
- `Euro` icon className → `"text-muted-foreground mr-3 shrink-0"`.
- Input className → replace `text-gray-900` with `text-foreground` and `placeholder:text-gray-400` with `placeholder:text-muted-foreground` (keep the `[appearance:textfield]` spin-button utilities intact).

- [ ] **Step 5: Retokenize FormSelect**

In `src/app/components/ingredients/ingredientsFormComponents/FormSelect.tsx`:

- Container div className → the `bg-card border border-input rounded-md ... focus-within:ring-2 focus-within:ring-ring relative` block (with `h-10`).
- `Icon` className → `"text-muted-foreground mr-3 shrink-0"`.
- `select` className → replace `text-gray-900` with `text-foreground` and `placeholder:text-gray-400` with `placeholder:text-muted-foreground`.
- The disabled placeholder `<option>` className `"text-gray-400"` → `"text-muted-foreground"`.

- [ ] **Step 6: Retokenize FormErrors (destructive tokens)**

In `src/app/components/ingredients/ingredientsFormComponents/formErrors.tsx`, replace the color classes:

- Outer container: `bg-red-50 border border-red-100` → `bg-destructive/10 border border-destructive/20`, and `rounded-xl` → `rounded-md`.
- Icon wrapper: `text-red-600` → `text-destructive`.
- Heading: `text-red-900` → `text-destructive`.
- List: `text-red-700/90` → `text-destructive/90`.

- [ ] **Step 7: Retokenize IngredientSummary (accent/muted tokens)**

In `src/app/components/ingredients/ingredientsFormComponents/ingredientSummary.tsx`, replace the blue palette with neutral accent tokens:

- Outer container: `bg-blue-50 border border-blue-100 text-blue-900` → `bg-accent border border-border text-foreground`, and `rounded-2xl` → `rounded-lg`.
- Icon wrapper: `bg-blue-100 rounded-lg text-blue-600` → `bg-secondary rounded-md text-primary`.
- "Summary" label: `text-blue-400` → use the Label look: `text-muted-foreground` (keep the existing `text-xs font-bold uppercase tracking-wider`).
- Body paragraph: `text-blue-900` → `text-foreground`.
- Divider: `border-blue-200/60` → `border-border`.
- "Estimated Cost" label: `text-blue-500` → `text-muted-foreground`.
- Total value: `text-blue-700` → `text-primary`.

- [ ] **Step 8: Typecheck and run the full ingredient test suite**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm test`
Expected: PASS (cn, button, primitives suites green; no ingredient tests exist yet — none should break).

- [ ] **Step 9: Commit**

```bash
git add src/app/components/ingredients/ingredientForm.tsx src/app/components/ingredients/ingredientsFormComponents/
git commit -m "feat: migrate ingredients form to design-system primitives and tokens"
```

---

## Task 7: Migrate the Ingredients table and detail pages

**Files:**
- Modify: `src/app/components/ingredients/ingredientsTable.tsx`
- Modify: `src/app/components/ingredients/ingredientPage/title.tsx`
- Modify: `src/app/components/ingredients/ingredientPage/ingredientHeader.tsx`
- Modify: `src/app/components/ingredients/ingredientPage/ingredientDetails.tsx`
- Modify: `src/app/components/ingredients/ingredientPage/ingredientData.tsx`
- Modify: `src/app/components/ingredients/ingredientPage/data.tsx`

- [ ] **Step 1: Retokenize `ingredientsTable.tsx` and use Badge for category chips**

Open `src/app/components/ingredients/ingredientsTable.tsx`. Apply these mechanical token replacements throughout the file (replace every occurrence):

- `text-gray-900` → `text-foreground`
- `text-gray-700`, `text-gray-800` → `text-foreground`
- `text-gray-500`, `text-gray-600`, `text-gray-400` → `text-muted-foreground`
- `bg-gray-50`, `bg-gray-100` → `bg-muted`
- `bg-white` → `bg-card`
- `border-gray-100`, `border-gray-200`, `border-gray-300` → `border-border`
- `rounded-xl`, `rounded-2xl` → `rounded-lg`; bare `rounded`/`rounded-md` → `rounded-md`

Then, if the table renders a category as a plain `<span>` chip (e.g. a span with `bg-*-100 text-*-700` pill classes), import the Badge primitive:

```tsx
import { Badge } from '../ui/badge';
```

and replace that chip span with:

```tsx
<Badge variant="secondary">{/* existing category expression */}</Badge>
```

If no such chip exists, skip the Badge import for this file.

- [ ] **Step 2: Retokenize the `ingredientPage/*` components**

Apply the same replacement map from Step 1 to each of these files:

- `ingredientPage/title.tsx`
- `ingredientPage/ingredientHeader.tsx`
- `ingredientPage/ingredientDetails.tsx`
- `ingredientPage/ingredientData.tsx`
- `ingredientPage/data.tsx`

For any colored status/category pill spans (`bg-*-100 text-*-700` etc.) in these files, replace with `<Badge variant="secondary">…</Badge>` (or `variant="success"` for an explicit "active/in-stock" state), importing `Badge` from `'../ui/badge'`.

- [ ] **Step 3: Typecheck, test, and build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm test`
Expected: PASS.

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Visually verify the Ingredients screens**

Run: `npm run dev` and open the app. Check:

```text
- /ingredients (list/table): tokens applied, badges render, borders soft
- /ingredients/create: form is a Card, mono labels, soft inputs, focus ring on tab
- /ingredients/edit/[id]: same as create, submit button reads "Update"
- an ingredient detail page: header, details, badges read correctly
- recipes/suppliers pages still render on legacy styling (unbroken)
```

If a local browser check is not possible during execution, state that explicitly instead of claiming visual verification.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/ingredients/ingredientsTable.tsx src/app/components/ingredients/ingredientPage/
git commit -m "feat: migrate ingredients table and detail pages to design tokens"
```

---

## Task 8: Document the design system and wire pointers

**Files:**
- Create: `docs/ui.md`
- Modify: `CLAUDE.md`, `docs/AGENTS.md`

- [ ] **Step 1: Write `docs/ui.md`**

Create `docs/ui.md`:

```markdown
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
```

- [ ] **Step 2: Wire the pointer into `CLAUDE.md`**

In `CLAUDE.md`, add to the canonical docs list (after the `docs/decisions.md` line):

```markdown
- `docs/ui.md`
```

- [ ] **Step 3: Wire the pointer into `docs/AGENTS.md`**

In `docs/AGENTS.md`, add to the canonical references list (after the `docs/decisions.md` line):

```markdown
- `docs/ui.md` for the UI design language, tokens, and primitive rules
```

And add a line to the working rules: "Before adding or restyling any UI, read `docs/ui.md` and use the primitives in `src/app/components/ui/`."

- [ ] **Step 4: Commit**

```bash
git add docs/ui.md CLAUDE.md docs/AGENTS.md
git commit -m "docs: add UI design-system guide and wire pointers"
```

---

## Task 9: Full verification

**Files:**
- Verify: all of the above.

- [ ] **Step 1: Run the full quality gate**

Run: `npx tsc --noEmit` → Expected: PASS.
Run: `npm test` → Expected: PASS (cn, button, primitives suites green).
Run: `npm run lint` → Expected: PASS, or pre-existing warnings only (note any in the report).
Run: `npm run build` → Expected: PASS (production build).

- [ ] **Step 2: Final visual pass in both create and edit modes**

Confirm the Ingredients create, edit, list, and detail screens render in the new look and that recipes/suppliers/auth still render on legacy styling.

- [ ] **Step 3: Prepare the implementation summary**

Report:

```text
- primitives created (Button, Input, Label, Textarea, Card, Badge, Select)
- which were wired into Ingredients (Button, Input, Label, Card, Badge) vs shipped-ready (Select, Textarea)
- the token foundation and font addition
- the Ingredients files migrated
- the docs added/updated
- exact verification commands run and their outcomes
- whether the visual check was performed or skipped
```

---

## Self-Review

### Spec coverage
- Token foundation (spec §Components 1): Task 3.
- `cn()` helper (spec §Components 2): Task 2.
- Primitives Button/Input/Label/Textarea/Select/Card/Badge (spec §Components 3): Tasks 4–5.
- shadcn init/config + one components root (spec §Architecture): Task 1.
- Ingredients migration (spec §Components 4): Tasks 6–7.
- `docs/ui.md` + pointers (spec §Components 5): Task 8.
- Light-only tokens, fonts (keep sans + add mono): Task 3.
- Verification: tsc + test + build + visual (spec §Testing): every task + Task 9.

Deviation from spec, intentional and noted in Execution Notes: Select and Textarea are built as library primitives but not wired into Ingredients (Ingredients has native RHF selects and no textarea — rewiring would be risky churn for no proof value). They are ready for the next domain plans.

### Placeholder scan
- No TBD/TODO/"implement later". Code steps contain complete source. Token-replacement steps enumerate exact class→token mappings rather than vague "use tokens".

### Type consistency
- `cn` signature, `Button`/`ButtonProps`/`buttonVariants`, `Badge`/`badgeVariants`, Card subcomponent names, and Select export names are defined in Tasks 2/4/5 and used consistently in Tasks 6/7. Import paths use `@/app/utils/cn` and `../ui/<name>` consistently with the `@/*`→`src/*` alias.
