import React from 'react';
const CSS=`
.cw-chip{display:inline-flex;align-items:center;gap:7px;min-height:36px;padding:0 14px;background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-pill);color:var(--text-body);font:var(--weight-semibold) var(--text-sm)/1.2 var(--font-body);cursor:pointer;text-align:left;transition:var(--transition-control)}
.cw-chip:hover{border-color:var(--green-400);background:var(--surface-brand-soft);color:var(--green-800);transform:translateY(var(--lift-hover))}
.cw-chip:active{transform:scale(var(--press-scale))}
.cw-chip--accent{background:var(--surface-accent-soft);border-color:#EFE0B8;color:var(--gold-800)}
.cw-chip--accent:hover{background:var(--gold-300);border-color:var(--gold-400);color:var(--gold-800)}
.cw-chip--soft{background:var(--surface-brand-soft);border-color:transparent;color:var(--green-800)}
.cw-chip--filter{border-radius:var(--radius-pill);min-height:32px;font-size:var(--text-xs)}
.cw-chip--selected{background:var(--green-800);border-color:transparent;color:var(--cream-50)}
.cw-chip--selected:hover{background:var(--green-700);color:var(--cream-50)}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','chip');s.textContent=CSS;document.head.appendChild(s)}
export function SuggestionChip({icon,children,variant='default',selected=false,...rest}){
  inject();
  const cls=['cw-chip',variant!=='default'&&'cw-chip--'+variant,selected&&'cw-chip--selected'].filter(Boolean).join(' ');
  return <button className={cls} {...rest}>{icon}{children}</button>;
}
