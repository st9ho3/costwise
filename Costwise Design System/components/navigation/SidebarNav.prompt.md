Desktop app navigation. Active item is a green-50 pill, not a bar.

```jsx
<SidebarNav value={view} onChange={setView} items={[
  {value:'home',label:'Today',icon:<Icon name="house"/>},
  {group:'Kitchen'},
  {value:'dishes',label:'Dishes',icon:<Icon name="utensils"/>,badge:'3'},
]} />
```
