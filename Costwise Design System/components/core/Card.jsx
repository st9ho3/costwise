import React from 'react';
const CSS=`
.cw-card{position:relative;background:var(--surface-card);border:1px solid var(--border-subtle);border-radius:var(--radius-card);box-shadow:var(--shadow-sm);transition:var(--transition-surface)}
.cw-card--sunken{background:var(--surface-sunken);box-shadow:none}
.cw-card--brand{background:var(--surface-brand);border-color:transparent;color:var(--text-on-brand);box-shadow:var(--shadow-brand)}
.cw-card--accent{background:var(--surface-accent-soft);border-color:#F0E3BE;box-shadow:none}
.cw-card--flat{box-shadow:none}
.cw-card--pad{padding:var(--pad-card)}
.cw-card--pad-tight{padding:var(--pad-card-tight)}
.cw-card--interactive{cursor:pointer}
.cw-card--interactive:hover{box-shadow:var(--shadow-md);transform:translateY(-2px)}
.cw-card--interactive:active{transform:scale(.995)}
.cw-card__head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
.cw-card__title{flex:1;font:var(--type-heading);color:inherit;letter-spacing:var(--tracking-snug)}
.cw-card__eyebrow{display:block;font:var(--type-overline);letter-spacing:var(--tracking-caps);text-transform:uppercase;color:var(--text-muted);margin-bottom:3px}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','card');s.textContent=CSS;document.head.appendChild(s)}
export function Card({variant='default',padding='md',interactive=false,title,eyebrow,icon,action,children,...rest}){
  inject();
  const cls=['cw-card',variant!=='default'&&'cw-card--'+variant,padding==='md'&&'cw-card--pad',padding==='tight'&&'cw-card--pad-tight',interactive&&'cw-card--interactive'].filter(Boolean).join(' ');
  return <div className={cls} {...rest}>
    {(title||action)&&<div className="cw-card__head">{icon}<div style={{flex:1,minWidth:0}}>{eyebrow&&<span className="cw-card__eyebrow">{eyebrow}</span>}{title&&<div className="cw-card__title">{title}</div>}</div>{action}</div>}
    {children}
  </div>;
}
