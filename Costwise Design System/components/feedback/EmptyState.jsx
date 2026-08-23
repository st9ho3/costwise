import React from 'react';
const CSS=`
.cw-empty{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding:32px 24px}
.cw-empty img{width:180px;max-width:60%;height:auto;display:block;margin-bottom:-4px}
.cw-empty--compact{padding:22px 16px}
.cw-empty--compact img{width:110px}
.cw-empty__art{display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:var(--radius-2xl);background:var(--surface-brand-soft);color:var(--green-600)}
.cw-empty__title{font:var(--type-heading);color:var(--text-strong)}
.cw-empty__msg{font:var(--type-body);color:var(--text-muted);max-width:38ch}
.cw-empty__actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','empty');s.textContent=CSS;document.head.appendChild(s)}
export function EmptyState({illustration,icon,title,message,actions,compact=false,...rest}){
  inject();
  return <div className={'cw-empty'+(compact?' cw-empty--compact':'')} {...rest}>
    {illustration?<img src={illustration} alt=""/>:icon?<span className="cw-empty__art">{icon}</span>:null}
    <div className="cw-empty__title">{title}</div>
    {message&&<p className="cw-empty__msg">{message}</p>}
    {actions&&<div className="cw-empty__actions">{actions}</div>}
  </div>;
}
