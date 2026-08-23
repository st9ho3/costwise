One metric per tile: overline label, big display number, one line of plain-language context.

```jsx
<StatTile label="Food cost" value="31.4" unit="%" delta="-2.1 pts" deltaTone="good" caption="vs last week" />
<StatTile variant="brand" size="lg" label="Kept this month" value="€1,840" />
```

Never stack more than 3 tiles across on a phone. deltaTone is judged from the owner's point of view — costs going down is `good`.
