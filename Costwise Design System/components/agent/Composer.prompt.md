The ask-Costwise bar. Floats above content with --shadow-md; pill radius.

```jsx
<Composer value={q} onChange={e=>setQ(e.target.value)} onSend={ask}
  lead={<Icon name="sparkles" size={16}/>}
  tools={<><IconButton size="sm" round icon={<Icon name="camera" size={18}/>} label="Snap an invoice"/></>}
  sendIcon={<Icon name="arrow-up" size={18}/>} />
```

Placeholder is always an invitation in the owner's words, never "Type a message".
