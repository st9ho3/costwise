import React from 'react';
const CSS=`
.cw-toast{display:flex;align-items:flex-start;gap:11px;padding:13px 15px;background:var(--ink-900);color:var(--cream-50);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);max-width:440px;animation:cw-slide var(--dur-base) var(--ease-nudge)}
.cw-toast--good{background:var(--green-800)}
.cw-toast--watch{background:var(--gold-100);color:var(--gold-800);box-shadow:var(--shadow-md)}
.cw-toast--over{background:var(--over)}
.cw-toast__body{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
.cw-toast__title{font:var(--weight-bold) var(--text-base)/1.3 var(--font-body)}
.cw-toast__msg{font:var(--type-caption);opacity:.82}
.cw-toast__action{border:0;background:transparent;color:inherit;font:var(--weight-bold) var(--text-sm)/1 var(--font-body);cursor:pointer;text-decoration:underline;padding:4px;border-radius:6px;flex:0 0 auto}
.cw-toast__action:hover{opacity:.75}
@keyframes cw-slide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
`;let _i=false;function inject(){if(_i||typeof document==='undefined')return;_i=true;const s=document.createElement('style');s.setAttribute('data-cw','toast');s.textContent=CSS;document.head.appendChild(s)}
export function Toast({title,message,tone='default',icon,actionLabel,onAction,...rest}){
  inject();
  return <div className={'cw-toast'+(tone!=='default'?' cw-toast--'+tone:'')} role="status" {...rest}>
    {icon}
    <div className="cw-toast__body"><span className="cw-toast__title">{title}</span>{message&&<span className="cw-toast__msg">{message}</span>}</div>
    {actionLabel&&<button className="cw-toast__action" onClick={onAction}>{actionLabel}</button>}
  </div>;
}
