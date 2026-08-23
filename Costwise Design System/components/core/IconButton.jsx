import React from 'react';
const CSS=`
.cw-ibtn{--s:40px;display:inline-flex;align-items:center;justify-content:center;width:var(--s);height:var(--s);border:1px solid transparent;border-radius:var(--radius-control);background:transparent;color:var(--text-body);cursor:pointer;transition:var(--transition-control)}
.cw-ibtn:hover:not(:disabled){background:var(--cream-100);color:var(--text-strong)}
.cw-ibtn:active:not(:disabled){transform:scale(var(--press-scale))}
.cw-ibtn:disabled{opacity:.42;cursor:not-allowed}
.cw-ibtn--sm{--s:32px}
.cw-ibtn--lg{--s:48px}
.cw-ibtn--round{border-radius:var(--radius-pill)}
.cw-ibtn--outline{background:var(--surface-card);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.cw-ibtn--outline:hover:not(:disabled){border-color:var(--border-strong)}
.cw-ibtn--solid{background:var(--green-800);color:var(--text-on-brand)}
.cw-ibtn--solid:hover:not(:disabled){background:var(--green-700)}
.cw-ibtn--soft{background:var(--surface-brand-soft);color:var(--text-brand)}
.cw-ibtn--soft:hover:not(:disabled){background:var(--green-100)}
.cw-ibtn--active{background:var(--surface-brand-soft);color:var(--text-brand)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','iconbutton');s.textContent=CSS;document.head.appendChild(s)}
export function IconButton({icon,variant='plain',size='md',round=false,active=false,label,...rest}){
  inject();
  const cls=['cw-ibtn',variant!=='plain'&&'cw-ibtn--'+variant,size!=='md'&&'cw-ibtn--'+size,round&&'cw-ibtn--round',active&&'cw-ibtn--active'].filter(Boolean).join(' ');
  return <button className={cls} aria-label={label} title={label} {...rest}>{icon}</button>;
}
