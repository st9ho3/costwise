One question, two buttons. 28px radius, --shadow-pop, blurred scrim.

```jsx
<Dialog title="Raise the carbonara to €15.50?" onClose={close}
  footer={<><Button variant="secondary" onClick={close}>Not yet</Button><Button>Update the menu</Button></>}>
  That keeps you at a 68% margin even if egg prices hold.
</Dialog>
```
