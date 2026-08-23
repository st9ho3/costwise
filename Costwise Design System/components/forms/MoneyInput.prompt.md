Amount field — tabular mono digits, currency glyph outside the number, optional per-unit.

```jsx
<MoneyInput label="Buy price" per="kg" defaultValue="3.40" />
<MoneyInput label="Menu price" size="lg" defaultValue="14.50" />
```

Intentional addition to the standard set: money entry is the single most repeated task in Costwise, so it gets its own primitive.
