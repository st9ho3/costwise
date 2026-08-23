A conversation turn. Costwise speaks in white cards on the left; the owner in green on the right.

```jsx
<ChatBubble avatar={<Avatar agent src="…/logo-mark-transparent.png"/>} meta="Just now">
  Your <strong>carbonara</strong> costs €3.90 a plate this week — up 40c since the eggs went up.
</ChatBubble>
<ChatBubble from="me">How much should I charge?</ChatBubble>
<ChatBubble typing avatar={<Avatar agent src="…"/>} />
```

Attach a Card, ProgressMeter or DataRow via `attachment` rather than nesting it in the text — the bubble stays readable.
