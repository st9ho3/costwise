The action button — one `primary` per screen, everything else `secondary` or `ghost`.

```jsx
<Button iconLeft={<Icon name="sparkles" size={18}/>}>Ask Costwise</Button>
<Button variant="secondary" size="sm">Not now</Button>
<Button variant="accent" pill iconRight={<Icon name="arrow-right" size={18}/>}>Price this dish</Button>
```

Variants: primary (green-800, brand shadow), accent (gold, for agent prompts), secondary (white + sand border), ghost (text only), danger. Sizes sm 36 / md 44 / lg 52 — never smaller than 36, and 44 is the default because these are thumbs on a phone behind a counter.
