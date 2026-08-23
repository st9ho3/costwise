Text field with label, hint and error in one component.

```jsx
<Input label="Ingredient" placeholder="e.g. San Marzano tomatoes" icon={<Icon name="search" size={18}/>} />
<Input label="Pack size" suffix="kg" hint="What you actually buy, not what the recipe uses." />
<Input label="Supplier" error="We need a name to file the invoice." />
```
