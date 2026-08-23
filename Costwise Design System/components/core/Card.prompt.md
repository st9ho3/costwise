Every block of content in Costwise sits in a Card: white, 18px radius, 1px --border-subtle, --shadow-sm.

```jsx
<Card eyebrow="This week" title="Food cost" action={<Badge tone="good" dot>On target</Badge>}>
  …
</Card>
```

`brand` (deep green) is reserved for one hero card per screen. `accent` (gold wash) marks something Costwise noticed. `sunken` nests inside another card.
